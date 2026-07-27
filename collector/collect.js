'use strict';

// 수집 엔트리. 6개 소스를 순차 수집 → 유사글 클러스터링 → 조회수+댓글수 점수 → TOP 3 스냅샷 저장.
//
// 실패 격리: 소스 하나가 요청 실패하거나 파서가 깨져도 전체 수집을 중단하지 않는다.
// 각 소스의 상태를 스냅샷에 기록해 "언제 어느 파서가 깨졌는지" 이력으로 추적할 수 있게 한다.

const http = require('./http');
const { SOURCES } = require('./sources');
const { clusterItems, SIMILARITY_THRESHOLD } = require('./cluster');
const { scoreCluster } = require('./score');
const keywords = require('./keywords');
const snapshotStore = require('./snapshot');
const delta = require('./delta');
const { normalizePostedAt } = require('./time');

const TOP_N = 3;
const COLLECTOR_VERSION = 1;

async function collectSource(source) {
    const startedAt = Date.now();
    const result = {
        id: source.id,
        name: source.name,
        url: source.url,
        status: 'error',
        itemCount: 0,
        error: null,
        provides: source.provides,
        elapsedMs: 0
    };

    try {
        const res = await http.get(source.url, { encoding: source.encoding });

        if (!res.ok) {
            // 403/429 는 차단으로 구분해서 기록한다. 우회를 시도하지 않는다.
            result.status = res.status === 403 || res.status === 429 ? 'blocked' : 'error';
            result.error = res.error || 'http ' + res.status;
            return { result, items: [] };
        }

        // 일부 사이트는 200 응답으로 오류/안내 페이지를 돌려주며 UA 게이팅을 한다.
        // 그 경우 파싱 실패가 아니라 차단이므로 구분해서 기록한다.
        if (typeof source.isBlocked === 'function' && source.isBlocked(res.body)) {
            result.status = 'blocked';
            result.error = 'UA 게이팅으로 보이는 응답 (' + res.body.length + ' bytes)';
            return { result, items: [] };
        }

        const parsed = source.parse(res.body) || [];
        const items = parsed
            .filter(it => it && it.title)
            .map(it => Object.assign({}, it, { community: source.id, communityName: source.name }));

        result.itemCount = items.length;
        result.status = items.length > 0 ? 'ok' : 'empty';
        if (items.length === 0) result.error = 'parse: 0 rows matched';

        return { result, items };
    } catch (err) {
        result.status = 'error';
        result.error = (err && err.message) || String(err);
        return { result, items: [] };
    } finally {
        result.elapsedMs = Date.now() - startedAt;
    }
}

function buildTop(items) {
    const clusters = clusterItems(items, SIMILARITY_THRESHOLD);

    const scored = clusters.map(c => {
        const metrics = scoreCluster(c.members);
        // 대표 제목은 그룹 내 증분이 가장 큰 글의 원제목 (점수와 같은 30분 환산 기준)
        const norm = (m, key, rawKey) => (m[key] === undefined ? m[rawKey] : m[key]);
        const sortedMembers = c.members.slice().sort((a, b) => {
            const av = (norm(a, 'deltaViewsNorm', 'deltaViews') || 0) + (norm(a, 'deltaCommentsNorm', 'deltaComments') || 0) * 100;
            const bv = (norm(b, 'deltaViewsNorm', 'deltaViews') || 0) + (norm(b, 'deltaCommentsNorm', 'deltaComments') || 0) * 100;
            if (bv !== av) return bv - av;
            return (b.views || 0) - (a.views || 0);
        });

        return {
            clusterId: c.clusterId,
            title: sortedMembers[0].title,
            memberCount: c.members.length,
            communities: Array.from(new Set(c.members.map(m => m.community))),
            totalViews: metrics.totalViews,
            totalComments: metrics.totalComments,
            viewsComplete: metrics.viewsComplete,
            commentsComplete: metrics.commentsComplete,
            scoreBasis: metrics.scoreBasis,
            score: metrics.score,
            deltaViews: metrics.deltaViews,
            deltaComments: metrics.deltaComments,
            deltaViewsNorm: metrics.deltaViewsNorm,
            deltaCommentsNorm: metrics.deltaCommentsNorm,
            deltaBasis: metrics.deltaBasis,
            measurable: metrics.measurable,
            cumulativeScore: metrics.cumulativeScore,
            items: sortedMembers.map(m => ({
                community: m.community,
                communityName: m.communityName,
                title: m.title,
                url: m.url,
                author: m.author,
                views: m.views,
                comments: m.comments,
                deltaViews: m.deltaViews,
                deltaComments: m.deltaComments,
                deltaViewsNorm: m.deltaViewsNorm,
                deltaCommentsNorm: m.deltaCommentsNorm,
                deltaBasis: m.deltaBasis,
                recommends: m.recommends,
                postedAt: m.postedAt,
                postedAtISO: m.postedAtISO,
                postedAtPrecision: m.postedAtPrecision
            }))
        };
    });

    scored.sort((a, b) => b.score - a.score);

    return {
        clusterCount: scored.length,
        top: scored.slice(0, TOP_N).map((c, i) => Object.assign({ rank: i + 1 }, c)),
        // 전체 클러스터는 프론트의 커뮤니티 필터가 재산출에 쓴다
        clusters: scored
    };
}

async function main() {
    const capturedAt = new Date();
    const sources = [];
    let allItems = [];

    for (let i = 0; i < SOURCES.length; i++) {
        const source = SOURCES[i];
        process.stdout.write('수집: ' + source.name + ' … ');

        const { result, items } = await collectSource(source);
        sources.push(result);
        allItems = allItems.concat(items);

        console.log(result.status + ' (' + result.itemCount + '건, ' + result.elapsedMs + 'ms)' +
            (result.error ? ' — ' + result.error : ''));

        // 요청 사이 지연. 동시 요청을 하지 않는다.
        if (i < SOURCES.length - 1) await http.sleep(http.REQUEST_DELAY_MS);
    }

    // 1) 작성시간을 절대 시각으로 정규화한다 (사이트마다 표기가 제각각이다)
    allItems = allItems.map(item => {
        const norm = normalizePostedAt(item.postedAt, capturedAt);
        return Object.assign({}, item, {
            postedAtISO: norm ? norm.iso : null,
            postedAtPrecision: norm ? norm.precision : null
        });
    });

    // 2) 직전 스냅샷과 비교해 증분을 붙인다.
    //    예약 실행이 건너뛰어져 간격이 벌어질 수 있으므로, 실제 경과시간을 재서
    //    실측 증가분을 30분치로 환산한다(delta.js 참고).
    const slot = snapshotStore.slotOf(capturedAt);
    const slotStart = new Date(Date.parse(slot.label) - delta.SLOT_MINUTES * 60000);
    const previous = delta.loadPrevious(snapshotStore.DATA_DIR, slot.label);
    const elapsedMinutes = delta.elapsedMinutesSince(previous, capturedAt);
    const normalization = delta.normalizationFor(elapsedMinutes);
    allItems = delta.attachDeltas(allItems, previous, slotStart, normalization);

    let { top, clusters, clusterCount } = buildTop(allItems);

    // 3) 증분을 하나도 잴 수 없으면(첫 실행 등) 누적값으로 대체하고 그 사실을 기록한다
    let scoreMode = 'delta';
    if (!clusters.some(c => c.measurable)) {
        scoreMode = 'cumulative-fallback';
        clusters.forEach(c => { c.score = c.cumulativeScore; });
        clusters.sort((a, b) => b.score - a.score);
        top = clusters.slice(0, TOP_N).map((c, i) => Object.assign({}, c, { rank: i + 1 }));
    }

    const snapshot = {
        slot: snapshotStore.slotOf(capturedAt).label,
        capturedAt: capturedAt.toISOString(),
        collectorVersion: COLLECTOR_VERSION,
        similarityThreshold: SIMILARITY_THRESHOLD,
        itemCount: allItems.length,
        clusterCount,
        // 순위 산정 방식. 'delta' = 직전 스냅샷 대비 증가분, 'cumulative-fallback' = 비교 대상 없음
        scoreMode,
        previousSlot: previous ? previous.slot : null,
        // 직전 수집과의 **실제** 경과분. 예약 실행이 건너뛰어지면 30분이 아니다.
        elapsedMinutes,
        // 점수를 30분치로 환산했는지 — UI 가 "30분 증가분"을 그대로 주장하지 않게 한다
        deltaNormalization: {
            applied: normalization.applied,
            reason: normalization.reason,
            factor: normalization.applied ? Math.round(normalization.factor * 1000) / 1000 : 1,
            slotMinutes: delta.SLOT_MINUTES,
            // 환산 대상은 실측 증가분뿐이다 (new-in-window 는 이미 30분 이하치)
            appliedTo: 'measured'
        },
        sources,
        top,
        clusters,
        // 7일 키워드 집계의 원재료. 스냅샷마다 상위 키워드를 미리 계산해 두면
        // 집계 시 336개 원본을 전부 다시 토큰화하지 않아도 된다.
        keywords: keywords.summarizeSnapshot(allItems)
    };

    const saved = snapshotStore.save(snapshot);

    console.log('');
    console.log('슬롯      : ' + snapshot.slot);
    console.log('수집 건수 : ' + snapshot.itemCount + '건 → 클러스터 ' + clusterCount + '개');
    console.log('저장      : data/' + saved.relPath);
    const basisCount = allItems.reduce((a, i) => { a[i.deltaBasis] = (a[i.deltaBasis] || 0) + 1; return a; }, {});
    console.log('점수기준  : ' + scoreMode + (previous ? ' (직전 ' + previous.slot + ' 대비)' : ' (비교 대상 없음)') +
        ' | 실측 ' + (basisCount.measured || 0) + ' · 창내신규 ' + (basisCount['new-in-window'] || 0) +
        ' · 최초관측 ' + (basisCount['first-seen'] || 0));
    console.log('수집 간격 : ' + (elapsedMinutes === null ? '비교 대상 없음' : elapsedMinutes + '분') +
        (normalization.applied
            ? ' → 30분 환산 ×' + (Math.round(normalization.factor * 1000) / 1000)
            : ' → 환산 안 함 (' + normalization.reason + ')'));
    const normalized = allItems.filter(i => i.postedAtPrecision === 'minute').length;
    console.log('작성시간  : 분단위 확정 ' + normalized + '/' + allItems.length + '건');
    console.log('키워드    : ' + saved.keywordSummary.keywordCount + '개 (' +
        saved.keywordSummary.daysUsed.length + '일 · 스냅샷 ' + saved.keywordSummary.snapshotCount + '건 집계)');
    console.log('7일 종합  : 후보 ' + saved.weeklySummary.candidateCount + '개 → TOP ' +
        saved.weeklySummary.top.length + ' (' + saved.weeklySummary.daysUsed.length + '일)' +
        (saved.weeklySummary.partialDays.length > 0
            ? ' · 원본 없는 날 ' + saved.weeklySummary.partialDays.length + '일은 후보 제한'
            : ''));
    if (saved.createdRollups.length > 0) {
        console.log('일별요약  : ' + saved.createdRollups.join(', ') + ' 생성 (영구 보존)');
    }
    if (saved.removedDays.length > 0) {
        console.log('보관정리  : ' + saved.removedDays.join(', ') + ' 원본 삭제 (요약 보존됨)');
    }
    if (saved.keptWithoutRollup.length > 0) {
        console.log('보관유지  : ' + saved.keptWithoutRollup.join(', ') +
            ' — 일별 요약이 없어 원본을 지우지 않았다');
    }
    console.log('');
    console.log('TOP ' + TOP_N + ':');
    top.forEach(c => {
        console.log('  ' + c.rank + '. ' + c.title);
        console.log('     증분점수 ' + c.score.toLocaleString() +
            ' (30분 환산 조회 +' + (c.deltaViewsNorm === null ? '?' : c.deltaViewsNorm.toLocaleString()) +
            ', 댓글 +' + (c.deltaCommentsNorm === null ? '?' : c.deltaCommentsNorm.toLocaleString()) + ')' +
            ' | 누적조회 ' + (c.totalViews === null ? '미제공' : c.totalViews.toLocaleString()) +
            ' | ' + c.deltaBasis + ' | ' + c.communities.join(', '));
    });

    const failed = sources.filter(s => s.status !== 'ok');
    if (failed.length > 0) {
        console.log('');
        console.log('실패/빈 소스 ' + failed.length + '개: ' +
            failed.map(s => s.name + '(' + s.status + ')').join(', '));
    }

    // 전 소스 실패라도 상태 기록 자체가 데이터이므로 스냅샷은 남긴다.
    if (allItems.length === 0) {
        console.error('경고: 수집된 글이 0건이다. 모든 파서를 점검해야 한다.');
        process.exitCode = 1;
    }
}

main().catch(err => {
    console.error('수집 실패:', err);
    process.exit(1);
});
