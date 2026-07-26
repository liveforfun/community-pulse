'use strict';

// 증분(delta) 계산.
//
// 조회수·댓글수는 작성 이후 누적값이다. 그대로 순위를 매기면 오래된 글이 구조적으로 유리해서
// "최근 30분의 화제글"이 절대 나오지 않는다(실제로 10시간 전 글이 2위였다).
// 그래서 **직전 스냅샷 대비 증가분**으로 순위를 매긴다.
//
// 글 식별자는 URL 이다.

const fs = require('fs');
const path = require('path');

const SLOT_MINUTES = 30;

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
 */
function attachDeltas(items, previousSnapshot, slotStart) {
    const prevMap = indexByUrl(previousSnapshot);

    return items.map(item => {
        const prev = prevMap.get(item.url);

        if (prev) {
            return Object.assign({}, item, {
                deltaViews: diff(item.views, prev.views),
                deltaComments: diff(item.comments, prev.comments),
                deltaBasis: 'measured'
            });
        }

        // 처음 본 글: 작성시각이 이 창 안이면 누적값 전부가 창 안에서 생긴 것이다
        const postedMs = item.postedAtISO ? Date.parse(item.postedAtISO) : NaN;
        const inWindow =
            item.postedAtPrecision === 'minute' && !isNaN(postedMs) && postedMs >= slotStart.getTime();

        if (inWindow) {
            return Object.assign({}, item, {
                deltaViews: item.views,
                deltaComments: item.comments,
                deltaBasis: 'new-in-window'
            });
        }

        return Object.assign({}, item, {
            deltaViews: null,
            deltaComments: null,
            deltaBasis: 'first-seen'
        });
    });
}

module.exports = { loadPrevious, indexByUrl, attachDeltas, SLOT_MINUTES };
