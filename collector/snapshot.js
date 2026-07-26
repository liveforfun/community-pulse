'use strict';

const fs = require('fs');
const path = require('path');

const rollup = require('./rollup');
const keywords = require('./keywords');
const weekly = require('./weekly');

const DATA_DIR = path.join(__dirname, '..', 'data');
const SNAPSHOT_DIR = path.join(DATA_DIR, 'snapshots');

// 30분마다 수집하면 하루 48개가 쌓인다. 7일치(336개)로 상한을 둔다.
const RETENTION_DAYS = 7;
const MAX_INDEX_SLOTS = RETENTION_DAYS * 48;

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/** 수집 시각을 30분 경계로 내림한 KST 슬롯 */
function slotOf(date) {
    const kst = new Date(date.getTime() + KST_OFFSET_MS);
    const minutes = kst.getUTCMinutes() < 30 ? 0 : 30;

    const yyyy = kst.getUTCFullYear();
    const mm = String(kst.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(kst.getUTCDate()).padStart(2, '0');
    const hh = String(kst.getUTCHours()).padStart(2, '0');
    const mi = String(minutes).padStart(2, '0');

    return {
        day: `${yyyy}-${mm}-${dd}`,
        time: `${hh}${mi}`,
        label: `${yyyy}-${mm}-${dd}T${hh}:${mi}+09:00`
    };
}

function ensureDir(dir) {
    fs.mkdirSync(dir, { recursive: true });
}

function readJson(file, fallback) {
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
        return fallback;
    }
}

function writeJson(file, obj) {
    ensureDir(path.dirname(file));
    fs.writeFileSync(file, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

/**
 * 보관 기간을 넘긴 30분 단위 원본 디렉토리를 삭제한다.
 * **일별 요약(data/daily/<날짜>.json)이 존재하는 날만 삭제한다.** 요약이 없으면
 * 그 날의 이력이 영구히 사라지므로, 롤업 실패 시 원본을 남겨 다음 실행에서 재시도하게 한다.
 * @returns {{removed: string[], keptWithoutRollup: string[]}}
 */
function prune(nowDate) {
    if (!fs.existsSync(SNAPSHOT_DIR)) return { removed: [], keptWithoutRollup: [] };

    const cutoff = new Date(nowDate.getTime() - RETENTION_DAYS * 24 * 60 * 60 * 1000);
    const cutoffDay = slotOf(cutoff).day;
    const removed = [];
    const keptWithoutRollup = [];

    for (const entry of fs.readdirSync(SNAPSHOT_DIR)) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(entry)) continue;
        if (entry >= cutoffDay) continue;

        if (!rollup.hasDaily(DATA_DIR, entry)) {
            keptWithoutRollup.push(entry);
            continue;
        }

        fs.rmSync(path.join(SNAPSHOT_DIR, entry), { recursive: true, force: true });
        removed.push(entry);
    }
    return { removed, keptWithoutRollup };
}

/**
 * 스냅샷을 저장하고 인덱스를 갱신한다. 기존 파일을 덮어쓰지 않고 슬롯별로 누적한다.
 * (같은 슬롯이 재실행되면 그 슬롯만 갱신된다 — Actions 재시도 대비)
 */
function save(snapshot) {
    const now = new Date(snapshot.capturedAt);
    const slot = slotOf(now);

    const relPath = path.join('snapshots', slot.day, slot.time + '.json').split(path.sep).join('/');
    writeJson(path.join(DATA_DIR, relPath), snapshot);
    writeJson(path.join(DATA_DIR, 'latest.json'), snapshot);

    // 순서가 중요하다: 롤업을 먼저 만들고 나서 원본을 지운다.
    const createdRollups = rollup.buildMissing(DATA_DIR, slot.day);
    const pruned = prune(now);
    const removedDays = pruned.removed;

    // 인덱스 갱신
    const index = readJson(path.join(DATA_DIR, 'index.json'), { slots: [] });
    const slots = (index.slots || []).filter(s => {
        if (s.slot === slot.label) return false; // 같은 슬롯은 새 항목으로 교체
        return !removedDays.some(day => s.path.indexOf('snapshots/' + day + '/') === 0);
    });

    const okSources = snapshot.sources.filter(s => s.status === 'ok').length;

    slots.unshift({
        slot: slot.label,
        path: relPath,
        capturedAt: snapshot.capturedAt,
        top1: snapshot.top.length > 0 ? snapshot.top[0].title : null,
        itemCount: snapshot.itemCount,
        clusterCount: snapshot.clusterCount,
        okSources,
        totalSources: snapshot.sources.length
    });

    writeJson(path.join(DATA_DIR, 'index.json'), {
        updatedAt: snapshot.capturedAt,
        retentionDays: RETENTION_DAYS,
        slots: slots.slice(0, MAX_INDEX_SLOTS),
        // 일별 요약은 삭제하지 않는다 — 영구 보존 이력
        days: rollup.listDaily(DATA_DIR)
    });

    // 키워드 집계. 창 크기는 keywords.WINDOW_DAYS 가 정한다(원본 보관 기간과 별개).
    // 창이 보관 기간보다 길면 그 초과분은 일별 요약의 keywords 에서 읽힌다.
    const keywordSummary = keywords.build(DATA_DIR, slot.day, keywords.WINDOW_DAYS);
    writeJson(path.join(DATA_DIR, 'keywords.json'), keywordSummary);

    // 7일 종합 TOP 10 (프론트의 기본 보기)
    const weeklySummary = weekly.build(DATA_DIR, slot.day, weekly.WINDOW_DAYS);
    writeJson(path.join(DATA_DIR, 'weekly.json'), weeklySummary);

    return {
        slot,
        relPath,
        removedDays,
        keptWithoutRollup: pruned.keptWithoutRollup,
        createdRollups,
        keywordSummary,
        weeklySummary
    };
}

module.exports = { save, slotOf, prune, RETENTION_DAYS, DATA_DIR };
