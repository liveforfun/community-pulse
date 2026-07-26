'use strict';

// 7일 종합 TOP 10.
//
// 30분 스냅샷이 각각 그 시점의 TOP 3 를 담는 것과 달리, 여기서는 창 전체에서
// 가장 화제였던 글 10개를 뽑는다. 같은 글이 여러 슬롯에 반복 등장하므로
// 정규화된 제목으로 중복을 합치고 **최고 점수를 찍은 시점(peakSlot)** 을 남긴다.

const fs = require('fs');
const path = require('path');

const { normalizeTitle } = require('./cluster');

const TOP_N = 10;
const WINDOW_DAYS = 7;

function readJson(file, fallback) {
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
        return fallback;
    }
}

function consider(bestByTitle, cluster, slotLabel) {
    const key = normalizeTitle(cluster.title) || cluster.title;
    const prev = bestByTitle.get(key);
    if (prev && prev.score >= cluster.score) return;

    bestByTitle.set(key, {
        title: cluster.title,
        score: cluster.score,
        totalViews: cluster.totalViews,
        totalComments: cluster.totalComments,
        deltaViews: cluster.deltaViews,
        deltaComments: cluster.deltaComments,
        deltaBasis: cluster.deltaBasis,
        cumulativeScore: cluster.cumulativeScore,
        viewsComplete: cluster.viewsComplete,
        commentsComplete: cluster.commentsComplete,
        scoreBasis: cluster.scoreBasis,
        memberCount: cluster.memberCount,
        communities: cluster.communities,
        peakSlot: slotLabel,
        items: cluster.items
    });
}

/**
 * 최근 windowDays 일치 상위 글을 집계해 data/weekly.json 을 만든다.
 *
 * 원본이 남은 날은 전체 클러스터를 후보로 삼는다. 보관 기간을 넘겨 원본이 삭제된 날은
 * 일별 요약을 쓰는데, 요약에는 그날 TOP 3 만 남아 있으므로 후보가 3개로 줄어든다
 * (용량 통제를 위한 의도된 손실 — README 의 누적 정책 참조).
 */
function build(dataDir, todayDay, windowDays) {
    const days = windowDays || WINDOW_DAYS;

    const start = new Date(todayDay + 'T00:00:00Z');
    start.setUTCDate(start.getUTCDate() - (days - 1));
    const startDay = start.toISOString().slice(0, 10);

    const snapshotRoot = path.join(dataDir, 'snapshots');
    const dailyRoot = path.join(dataDir, 'daily');

    const candidateDays = new Set();
    if (fs.existsSync(snapshotRoot)) {
        fs.readdirSync(snapshotRoot).forEach(d => {
            if (/^\d{4}-\d{2}-\d{2}$/.test(d)) candidateDays.add(d);
        });
    }
    if (fs.existsSync(dailyRoot)) {
        fs.readdirSync(dailyRoot).forEach(f => {
            const m = f.match(/^(\d{4}-\d{2}-\d{2})\.json$/);
            if (m) candidateDays.add(m[1]);
        });
    }

    const bestByTitle = new Map();
    const sourceAgg = {};
    const daysUsed = [];
    const partialDays = [];
    let snapshotCount = 0;
    let itemCountTotal = 0;
    // 점수 체계가 누적 → 증분으로 바뀌었다. 두 방식은 스케일이 완전히 달라서
    // 같은 순위표에 놓으면 구버전 스냅샷이 이긴다. 증분 스냅샷만 후보로 삼는다.
    let legacySnapshotCount = 0;

    function aggregateSources(sources) {
        (sources || []).forEach(s => {
            const agg =
                sourceAgg[s.id] ||
                (sourceAgg[s.id] = {
                    id: s.id,
                    name: s.name,
                    okCount: 0,
                    emptyCount: 0,
                    blockedCount: 0,
                    errorCount: 0,
                    itemCountTotal: 0
                });
            const key = (s.status || 'error') + 'Count';
            if (agg[key] !== undefined) agg[key]++;
            agg.itemCountTotal += s.itemCount || 0;
        });
    }

    Array.from(candidateDays)
        .filter(day => day >= startDay && day <= todayDay)
        .sort()
        .forEach(day => {
            const dayDir = path.join(snapshotRoot, day);

            if (fs.existsSync(dayDir)) {
                const files = fs.readdirSync(dayDir).filter(f => /^\d{4}\.json$/.test(f)).sort();
                files.forEach(f => {
                    const snap = readJson(path.join(dayDir, f), null);
                    if (!snap) return;
                    snapshotCount++;
                    itemCountTotal += snap.itemCount || 0;
                    aggregateSources(snap.sources);
                    if (snap.scoreMode !== 'delta') { legacySnapshotCount++; return; }
                    (snap.clusters || snap.top || []).forEach(c => consider(bestByTitle, c, snap.slot));
                });
                if (files.length > 0) daysUsed.push(day);
                return;
            }

            const daily = readJson(path.join(dailyRoot, day + '.json'), null);
            if (!daily) return;

            snapshotCount += daily.snapshotCount || 0;
            itemCountTotal += daily.itemCountTotal || 0;
            (daily.sourceSummary || []).forEach(s => {
                const agg =
                    sourceAgg[s.id] ||
                    (sourceAgg[s.id] = {
                        id: s.id,
                        name: s.name,
                        okCount: 0,
                        emptyCount: 0,
                        blockedCount: 0,
                        errorCount: 0,
                        itemCountTotal: 0
                    });
                agg.okCount += s.okCount || 0;
                agg.emptyCount += s.emptyCount || 0;
                agg.blockedCount += s.blockedCount || 0;
                agg.errorCount += s.errorCount || 0;
                agg.itemCountTotal += s.itemCountTotal || 0;
            });
            (daily.top || []).forEach(c => consider(bestByTitle, c, c.peakSlot || daily.date));

            daysUsed.push(day);
            partialDays.push(day); // 후보가 TOP 3 로 제한된 날
        });

    const ranked = Array.from(bestByTitle.values()).sort((a, b) => b.score - a.score);

    // 커뮤니티별 TOP N 을 따로 계산한다.
    // 전체 TOP N 만 저장하고 프론트에서 걸러내면, 전체 상위권에 그 커뮤니티 글이 적을 때
    // 결과가 0~3개로 쪼그라든다(초기 구현의 버그). 후보 전체에서 커뮤니티별로 다시 뽑아야 한다.
    const byCommunity = {};
    ranked.forEach(c => {
        (c.communities || []).forEach(id => {
            if (!byCommunity[id]) byCommunity[id] = [];
            if (byCommunity[id].length < TOP_N) byCommunity[id].push(c);
        });
    });
    Object.keys(byCommunity).forEach(id => {
        byCommunity[id] = byCommunity[id].map((c, i) => Object.assign({ rank: i + 1 }, c));
    });

    return {
        kind: 'weekly',
        generatedAt: new Date().toISOString(),
        windowDays: days,
        fromDay: daysUsed.length ? daysUsed[0] : null,
        toDay: daysUsed.length ? daysUsed[daysUsed.length - 1] : null,
        daysUsed,
        // 원본이 삭제되어 후보가 TOP 3 로 제한된 날 — UI 가 이 사실을 밝힐 수 있게 한다
        partialDays,
        snapshotCount,
        // 점수 체계 전환 이전(누적 점수) 스냅샷 수 — 순위 후보에서 제외했다
        legacySnapshotCount,
        itemCountTotal,
        candidateCount: ranked.length,
        top: ranked.slice(0, TOP_N).map((c, i) => Object.assign({ rank: i + 1 }, c)),
        byCommunity,
        sourceSummary: Object.values(sourceAgg)
    };
}

module.exports = { build, TOP_N, WINDOW_DAYS };
