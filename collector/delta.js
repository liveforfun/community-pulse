'use strict';

// 증분(delta) 계산.
//
// 조회수·댓글수는 작성 이후 누적값이다. 그대로 순위를 매기면 오래된 글이 구조적으로 유리해서
// "최근 30분의 화제글"이 절대 나오지 않는다(실제로 10시간 전 글이 2위였다).
// 그래서 **직전 스냅샷 대비 증가분**으로 순위를 매긴다.
//
// 글 식별자는 URL 이다.
//
// 주의: 증가분은 "30분치"가 아니라 "직전 수집 이후치"다. GitHub Actions 예약 실행은
// 부하에 따라 건너뛰어지므로 실제 간격이 3시간을 넘기도 한다(관측된 최대 235분).
// 그대로 두면 간격이 벌어진 슬롯일수록 점수가 부풀어 슬롯 간 비교가 깨지고,
// 같은 슬롯 안에서도 'new-in-window'(최대 30분치) 글이 구조적으로 밀린다.
// 그래서 실측 증가분을 **실제 경과시간으로 나눠 30분치로 환산**해 순위에 쓴다.

const fs = require('fs');
const path = require('path');

const SLOT_MINUTES = 30;

// 이보다 오래 끊긴 뒤의 증가분은 30분치로 환산해도 의미가 없다(하루치를 48로 나눈 값은
// 그 시간대의 화제성을 대표하지 못한다). 환산하지 않고 원값을 쓰되 그 사실을 기록한다.
const MAX_ELAPSED_MINUTES = 24 * 60;

function readJson(file, fallback) {
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
        return fallback;
    }
}

/** 직전 스냅샷을 찾는다 (data/index.json 의 최신 슬롯) */
function loadPrevious(dataDir, currentSlotLabel) {
    const index = readJson(path.join(dataDir, 'index.json'), { slots: [] });
    const slots = (index.slots || []).filter(s => s.slot !== currentSlotLabel);
    if (slots.length === 0) return null;

    const prev = readJson(path.join(dataDir, slots[0].path), null);
    if (!prev) return null;
    return prev;
}

/** URL → {views, comments} 맵 */
function indexByUrl(snapshot) {
    const map = new Map();
    if (!snapshot) return map;
    (snapshot.clusters || []).forEach(c => {
        (c.items || []).forEach(i => {
            if (i.url) map.set(i.url, { views: i.views, comments: i.comments });
        });
    });
    return map;
}

/** 직전 스냅샷 수집 시각과의 실제 경과분. 잴 수 없으면 null */
function elapsedMinutesSince(previousSnapshot, capturedAt) {
    if (!previousSnapshot || !previousSnapshot.capturedAt) return null;
    const prevMs = Date.parse(previousSnapshot.capturedAt);
    if (isNaN(prevMs)) return null;
    const minutes = (capturedAt.getTime() - prevMs) / 60000;
    if (!isFinite(minutes)) return null;
    return Math.round(minutes * 10) / 10;
}

/**
 * 실측 증가분을 30분치로 환산할 계수를 정한다.
 *
 * reason:
 *   'ok'             — 환산 적용
 *   'no-previous'    — 비교 대상 없음 (첫 실행 등)
 *   'invalid-elapsed'— 경과시간이 0 이하 (시계 문제·중복 실행)
 *   'gap-too-large'  — 하루 넘게 끊김 → 환산이 무의미
 */
function normalizationFor(elapsedMinutes) {
    if (elapsedMinutes === null || elapsedMinutes === undefined) {
        return { applied: false, factor: 1, reason: 'no-previous' };
    }
    if (elapsedMinutes <= 0) {
        return { applied: false, factor: 1, reason: 'invalid-elapsed' };
    }
    if (elapsedMinutes > MAX_ELAPSED_MINUTES) {
        return { applied: false, factor: 1, reason: 'gap-too-large' };
    }
    return { applied: true, factor: SLOT_MINUTES / elapsedMinutes, reason: 'ok' };
}

function scale(value, factor) {
    if (value === null || value === undefined) return null;
    return Math.round(value * factor);
}

function diff(current, previous) {
    if (current === null || current === undefined) return null;
    if (previous === null || previous === undefined) return null;
    const d = current - previous;
    // 음수는 사이트가 카운트를 조정했거나 글이 수정된 경우다. 0 으로 본다.
    return d < 0 ? 0 : d;
}

/**
 * 각 아이템에 증분을 붙인다.
 *
 * deltaBasis:
 *   'measured'      — 직전 스냅샷에 같은 글이 있어 실제 증가분을 쟀다 (가장 정확)
 *   'new-in-window' — 이번에 처음 보였고 작성시각이 창 안이다 → 누적값 전부가 이 창에서 생긴 것
 *   'first-seen'    — 이번에 처음 보였는데 작성시각이 창 밖이거나 불명 → 증가분을 알 수 없다
 *
 * deltaViews/deltaComments 는 **잰 그대로의 원값**이다. 스냅샷 원본은 7일간 보관되며
 * 나중에 재집계에 쓰이므로 덮어쓰지 않는다. 순위에 쓰는 30분 환산값은 별도 필드
 * deltaViewsNorm/deltaCommentsNorm 에 담는다.
 *
 * 환산은 'measured' 에만 적용한다. 'new-in-window' 는 글의 생애 전체가 창(30분) 안에
 * 있어 누적값 자체가 이미 30분 이하의 값이다. 여기에 30/경과분을 곱하면 실제로 겪은
 * 시간보다 짧은 시간으로 나누는 셈이라 값이 근거 없이 줄어든다.
 * 'first-seen' 은 원값이 null 이므로 해당 없다.
 */
function attachDeltas(items, previousSnapshot, slotStart, normalization) {
    const prevMap = indexByUrl(previousSnapshot);
    const norm = normalization || { applied: false, factor: 1 };
    const factor = norm.applied ? norm.factor : 1;

    return items.map(item => {
        const prev = prevMap.get(item.url);

        if (prev) {
            const deltaViews = diff(item.views, prev.views);
            const deltaComments = diff(item.comments, prev.comments);
            return Object.assign({}, item, {
                deltaViews,
                deltaComments,
                deltaViewsNorm: scale(deltaViews, factor),
                deltaCommentsNorm: scale(deltaComments, factor),
                deltaBasis: 'measured'
            });
        }

        // 처음 본 글: 작성시각이 이 창 안이면 누적값 전부가 창 안에서 생긴 것이다
        const postedMs = item.postedAtISO ? Date.parse(item.postedAtISO) : NaN;
        const inWindow =
            item.postedAtPrecision === 'minute' && !isNaN(postedMs) && postedMs >= slotStart.getTime();

        if (inWindow) {
            // 이미 30분 이하의 값이므로 환산하지 않는다 (위 주석 참고)
            return Object.assign({}, item, {
                deltaViews: item.views,
                deltaComments: item.comments,
                deltaViewsNorm: item.views === undefined ? null : item.views,
                deltaCommentsNorm: item.comments === undefined ? null : item.comments,
                deltaBasis: 'new-in-window'
            });
        }

        return Object.assign({}, item, {
            deltaViews: null,
            deltaComments: null,
            deltaViewsNorm: null,
            deltaCommentsNorm: null,
            deltaBasis: 'first-seen'
        });
    });
}

module.exports = {
    loadPrevious,
    indexByUrl,
    attachDeltas,
    elapsedMinutesSince,
    normalizationFor,
    SLOT_MINUTES,
    MAX_ELAPSED_MINUTES
};
