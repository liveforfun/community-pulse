'use strict';

// 일별 요약 롤업.
//
// 30분 단위 원본 스냅샷은 7일만 보관하지만(용량·커밋 수 통제), 이력 자체는 영구히 남겨야 한다.
// 그래서 "완료된 날"마다 그날의 TOP 3 와 슬롯 목록을 요약 파일로 압축해 보관한다.
// 원본 삭제는 반드시 롤업이 존재하는 날에만 허용한다(snapshot.js 의 prune 참조).

const fs = require('fs');
const path = require('path');

const { normalizeTitle } = require('./cluster');

const DAILY_TOP_N = 3;

function readJson(file, fallback) {
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
        return fallback;
    }
}

function writeJson(file, obj) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

/** 하루치 스냅샷들을 읽어 요약 객체를 만든다 */
function buildDaily(dataDir, day) {
    const dayDir = path.join(dataDir, 'snapshots', day);
    if (!fs.existsSync(dayDir)) return null;

    const files = fs
        .readdirSync(dayDir)
        .filter(f => /^\d{4}\.json$/.test(f))
        .sort();
    if (files.length === 0) return null;

    const slots = [];
    const sourceAgg = {};
    // 같은 글이 여러 슬롯에 걸쳐 등장하므로 제목 기준으로 중복을 합치고 최고 점수를 남긴다
    const bestByTitle = new Map();
    let itemCountTotal = 0;

    files.forEach(file => {
        const snap = readJson(path.join(dayDir, file), null);
        if (!snap) return;

        itemCountTotal += snap.itemCount || 0;

        const okSources = (snap.sources || []).filter(s => s.status === 'ok').length;
        slots.push({
            slot: snap.slot,
            capturedAt: snap.capturedAt,
            top1: snap.top && snap.top.length > 0 ? snap.top[0].title : null,
            itemCount: snap.itemCount,
            clusterCount: snap.clusterCount,
            okSources,
            totalSources: (snap.sources || []).length
        });

        (snap.sources || []).forEach(s => {
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
            const key = s.status + 'Count';
            if (agg[key] !== undefined) agg[key]++;
            agg.itemCountTotal += s.itemCount || 0;
        });

        // 그날의 최고 화제글을 뽑는다. TOP 3 만 보는 게 아니라 전체 클러스터를 후보로 둔다.
        (snap.clusters || snap.top || []).forEach(cluster => {
            const key = normalizeTitle(cluster.title) || cluster.title;
            const prev = bestByTitle.get(key);
            if (!prev || cluster.score > prev.score) {
                bestByTitle.set(key, {
                    title: cluster.title,
                    score: cluster.score,
                    totalViews: cluster.totalViews,
                    totalComments: cluster.totalComments,
                    viewsComplete: cluster.viewsComplete,
                    commentsComplete: cluster.commentsComplete,
                    scoreBasis: cluster.scoreBasis,
                    memberCount: cluster.memberCount,
                    communities: cluster.communities,
                    peakSlot: snap.slot,
                    items: cluster.items
                });
            }
        });
    });

    const top = Array.from(bestByTitle.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, DAILY_TOP_N)
        .map((c, i) => Object.assign({ rank: i + 1 }, c));

    return {
        date: day,
        kind: 'daily',
        snapshotCount: slots.length,
        firstCapturedAt: slots.length ? slots[0].capturedAt : null,
        lastCapturedAt: slots.length ? slots[slots.length - 1].capturedAt : null,
        itemCountTotal,
        top,
        slots,
        sourceSummary: Object.values(sourceAgg)
    };
}

/**
 * 완료된 날(오늘 이전) 중 롤업이 없는 날의 요약을 생성한다.
 * 오늘은 아직 수집이 진행 중이므로 만들지 않는다.
 * @returns {string[]} 새로 생성한 날짜 목록
 */
function buildMissing(dataDir, todayDay) {
    const snapshotDir = path.join(dataDir, 'snapshots');
    if (!fs.existsSync(snapshotDir)) return [];

    const created = [];

    for (const day of fs.readdirSync(snapshotDir).sort()) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) continue;
        if (day >= todayDay) continue; // 오늘(및 미래)은 아직 미완료

        const target = path.join(dataDir, 'daily', day + '.json');
        if (fs.existsSync(target)) continue;

        const daily = buildDaily(dataDir, day);
        if (!daily) continue;

        writeJson(target, daily);
        created.push(day);
    }

    return created;
}

/** 롤업 존재 여부 — prune 이 원본을 지워도 되는지 판단하는 근거 */
function hasDaily(dataDir, day) {
    return fs.existsSync(path.join(dataDir, 'daily', day + '.json'));
}

/** data/daily/*.json 을 훑어 인덱스용 경량 목록을 만든다 (최신순) */
function listDaily(dataDir) {
    const dir = path.join(dataDir, 'daily');
    if (!fs.existsSync(dir)) return [];

    return fs
        .readdirSync(dir)
        .filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
        .sort()
        .reverse()
        .map(f => {
            const daily = readJson(path.join(dir, f), null);
            if (!daily) return null;
            return {
                date: daily.date,
                path: 'daily/' + f,
                snapshotCount: daily.snapshotCount,
                itemCountTotal: daily.itemCountTotal,
                top1: daily.top.length > 0 ? daily.top[0].title : null
            };
        })
        .filter(Boolean);
}

module.exports = { buildDaily, buildMissing, hasDaily, listDaily, DAILY_TOP_N };
