// ===== Community Pulse — 수집된 스냅샷을 읽어 렌더한다 =====
//
// 이 파일은 데이터를 만들지 않는다. collector 가 저장한 data/*.json 만 읽는다.
// 조회수·댓글수를 제공하지 않는 소스가 있으므로(null), 그 사실을 화면에 반드시 표시한다.

const COMMUNITY_CONFIG = {
    fmkorea: { id: 'fmkorea', name: '에펨코리아', color: '#0055a6', bgColor: 'rgba(0,85,166,0.14)' },
    ruliweb: { id: 'ruliweb', name: '루리웹', color: '#4d8fd6', bgColor: 'rgba(77,143,214,0.14)' },
    instiz: { id: 'instiz', name: '인스티즈', color: '#2b963a', bgColor: 'rgba(43,150,58,0.14)' },
    dc_stock: { id: 'dc_stock', name: '디시 주식갤', color: '#6b7ce0', bgColor: 'rgba(107,124,224,0.14)' },
    dc_realestate: { id: 'dc_realestate', name: '디시 부동산갤', color: '#b07ce0', bgColor: 'rgba(176,124,224,0.14)' }
};

const TOP_N = 3; // 30분 스냅샷·일별 요약 보기
const WEEKLY_TOP_N = 10; // 7일 종합 보기 (기본)
const SLOT_MINUTES = 30;

const STATUS_LABEL = {
    ok: { text: '정상', cls: 'ok' },
    empty: { text: '수집 0건', cls: 'warn' },
    blocked: { text: '차단됨', cls: 'blocked' },
    error: { text: '실패', cls: 'error' }
};

const BASIS_NOTE = {
    'views+comments': null,
    'comments-only': '조회수 미제공 — 댓글수만으로 산출',
    'views-only': '댓글수 미제공 — 조회수만으로 산출',
    partial: '일부 글의 지표가 미제공 — 합산값이 불완전'
};

// 워드클라우드 색 램프 — dataviz 검증기(ordinal, dark, surface #101622) 전 항목 PASS.
// 단일 블루 hue 의 명도 단계이므로 색은 크기와 같은 값(노출량)을 중복 인코딩한다.
// 커뮤니티를 색으로 구분하지 않는 이유: 흩뿌려진 마크(전 쌍 비교)에서 5색은
// 색약 분리 기준을 통과하지 못한다. 커뮤니티는 툴팁과 표에서 텍스트로 제공한다.
const KEYWORD_RAMP = ['#cde2fb', '#9ec5f4', '#6da7ec', '#3987e5', '#1c5cab'];
const CLOUD_HEIGHT = 360;
const CLOUD_MIN_FONT = 13;
const CLOUD_MAX_FONT = 54;
const CLOUD_SPIRAL_STEPS = 14000;
const BAR_TOP_N = 20;

const state = {
    index: null,
    // 화면에 보고 있는 데이터셋 (30분 스냅샷 / 일별 요약 / 7일 종합)
    snapshot: null,
    // 항상 최신 스냅샷. 헤더의 수집 시각·카운트다운은 보고 있는 보기와 무관하게 이것을 쓴다
    latest: null,
    keywords: null,
    keywordView: 'cloud',
    community: 'all',
    query: '',
    countdownTimer: null,
    cloudResizeTimer: null
};

// DOM
const el = {
    communityTabs: document.getElementById('communityTabs'),
    newsGrid: document.getElementById('newsGrid'),
    activeFilterName: document.getElementById('activeFilterName'),
    newsTotalCount: document.getElementById('newsTotalCount'),
    sourceStatus: document.getElementById('sourceStatus'),
    snapshotSelect: document.getElementById('snapshotSelect'),
    latestBtn: document.getElementById('latestBtn'),
    searchInput: document.getElementById('searchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    trendingKeywords: document.getElementById('trendingKeywords'),
    lastUpdatedTime: document.getElementById('lastUpdatedTime'),
    countdownDisplay: document.getElementById('countdownDisplay'),
    timerProgressBar: document.getElementById('timerProgressBar'),
    refreshBtn: document.getElementById('manualRefreshBtn'),
    refreshIcon: document.getElementById('refreshIcon'),
    timelineList: document.getElementById('timelineList'),
    timelineSub: document.getElementById('timelineSub'),
    toastContainer: document.getElementById('toastContainer'),
    keywordSubtitle: document.getElementById('keywordSubtitle'),
    keywordCloud: document.getElementById('keywordCloud'),
    keywordBar: document.getElementById('keywordBar'),
    keywordTable: document.getElementById('keywordTable'),
    keywordFootnote: document.getElementById('keywordFootnote')
};

// ===== 유틸 =====

function escapeHtml(s) {
    return String(s === null || s === undefined ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/** null 은 "미제공"이다. 0 과 구분해서 표기한다. */
function metric(value) {
    if (value === null || value === undefined) return '미제공';
    return Number(value).toLocaleString();
}

function communityOf(id) {
    return COMMUNITY_CONFIG[id] || { id, name: id, color: '#94a3b8', bgColor: 'rgba(148,163,184,0.14)' };
}

function toast(message) {
    if (!el.toastContainer) return;
    const div = document.createElement('div');
    div.className = 'toast';
    div.textContent = message;
    el.toastContainer.appendChild(div);
    setTimeout(() => div.remove(), 3200);
}

function formatSlot(slotLabel) {
    // "2026-07-26T19:00+09:00" → "07/26 19:00"
    const m = String(slotLabel).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    if (!m) return slotLabel;
    return m[2] + '/' + m[3] + ' ' + m[4] + ':' + m[5];
}

async function fetchJson(path) {
    const res = await fetch(path + '?t=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) throw new Error(path + ' → HTTP ' + res.status);
    return res.json();
}

// ===== 렌더 =====

function renderCommunityPills() {
    el.communityTabs.innerHTML = '';

    const counts = {};
    if (state.snapshot) {
        // 30분 스냅샷은 그 시점 수집 건수, 기간 종합은 누적 건수를 보여준다
        if (state.snapshot.sourceSummary) {
            state.snapshot.sourceSummary.forEach(s => { counts[s.id] = s.itemCountTotal; });
        } else {
            state.snapshot.sources.forEach(s => { counts[s.id] = s.itemCount; });
        }
    }

    const makePill = (id, label, count) => {
        const btn = document.createElement('button');
        btn.className = 'community-tab' + (state.community === id ? ' active' : '');
        btn.innerHTML = escapeHtml(label) + (count === null ? '' : ' <span class="pill-count">' + count + '</span>');
        btn.onclick = () => {
            state.community = id;
            renderCommunityPills();
            renderFeed();
        };
        el.communityTabs.appendChild(btn);
    };

    const total = state.snapshot ? state.snapshot.itemCount : null;
    makePill('all', '전체보기', total);
    Object.values(COMMUNITY_CONFIG).forEach(c => makePill(c.id, c.name, counts[c.id] === undefined ? null : counts[c.id]));
}

function renderSourceStatus() {
    if (!state.snapshot) return;

    // 일별 요약·7일 종합은 기간 집계이므로 슬롯 단위 상태와 표기가 다르다
    if (state.snapshot.isDaily || state.snapshot.isWeekly) {
        const chips = (state.snapshot.sourceSummary || []).map(s => {
            const total = s.okCount + s.emptyCount + s.blockedCount + s.errorCount;
            const cls = s.okCount === total ? 'ok' : s.okCount === 0 ? 'error' : 'warn';
            return (
                '<div class="source-chip ' + cls + '">' +
                '<span class="source-name">' + escapeHtml(s.name) + '</span>' +
                '<span class="source-state">' + s.okCount + '/' + total + ' 회 정상</span>' +
                '<span class="source-count">누적 ' + s.itemCountTotal.toLocaleString() + '건</span>' +
                '</div>'
            );
        });

        const heading = state.snapshot.isWeekly
            ? (state.snapshot.fromDay || '?') + ' ~ ' + (state.snapshot.toDay || '?') + ' 7일 종합'
            : escapeHtml(state.snapshot.date) + ' 일별 요약';

        el.sourceStatus.innerHTML =
            '<div class="source-status-head">' +
            '<span class="material-symbols-rounded">calendar_month</span>' +
            '<strong>' + heading + '</strong>' +
            '<span class="source-status-sum">' + state.snapshot.snapshotCount.toLocaleString() + '개 수집 집계</span>' +
            '</div>' +
            '<div class="source-chips">' + chips.join('') + '</div>' +
            // 원본이 삭제된 날은 후보가 그날 TOP 3 로 제한된다 — 순위 해석에 영향이 있으므로 밝힌다
            ((state.snapshot.partialDays || []).length > 0
                ? '<div class="basis-warning" style="margin-top:12px;margin-bottom:0">' +
                  '<span class="material-symbols-rounded">warning</span>' +
                  '30분 원본이 삭제된 ' + state.snapshot.partialDays.length +
                  '일은 일별 요약(그날 TOP 3)만 후보로 집계되었습니다' +
                  '</div>'
                : '');
        return;
    }

    const items = state.snapshot.sources.map(s => {
        const label = STATUS_LABEL[s.status] || { text: s.status, cls: 'warn' };
        const provides = [];
        if (!s.provides.views) provides.push('조회수 미제공');
        if (!s.provides.comments) provides.push('댓글수 미제공');

        return (
            '<div class="source-chip ' + label.cls + '">' +
            '<span class="source-name">' + escapeHtml(s.name) + '</span>' +
            '<span class="source-state">' + label.text + '</span>' +
            '<span class="source-count">' + s.itemCount + '건</span>' +
            (provides.length ? '<span class="source-note">' + provides.join(' · ') + '</span>' : '') +
            (s.error ? '<span class="source-error" title="' + escapeHtml(s.error) + '">' + escapeHtml(s.error) + '</span>' : '') +
            '</div>'
        );
    });

    const okCount = state.snapshot.sources.filter(s => s.status === 'ok').length;

    el.sourceStatus.innerHTML =
        '<div class="source-status-head">' +
        '<span class="material-symbols-rounded">monitor_heart</span>' +
        '<strong>소스 수집 상태</strong>' +
        '<span class="source-status-sum">' + okCount + ' / ' + state.snapshot.sources.length + ' 정상</span>' +
        '</div>' +
        '<div class="source-chips">' + items.join('') + '</div>';
}

/** 커뮤니티 필터·검색어를 적용해 TOP N 클러스터를 재산출한다 */
function selectClusters() {
    if (!state.snapshot) return [];

    let clusters = state.snapshot.clusters || [];

    if (state.community !== 'all') {
        // 해당 커뮤니티의 글을 포함한 클러스터만
        clusters = clusters.filter(c => c.communities.indexOf(state.community) !== -1);
    }

    if (state.query) {
        const q = state.query.toLowerCase();
        clusters = clusters.filter(c => {
            if (c.title.toLowerCase().indexOf(q) !== -1) return true;
            return c.items.some(i => i.title.toLowerCase().indexOf(q) !== -1);
        });
    }

    const topN = state.snapshot.topN || TOP_N;
    return clusters.slice().sort((a, b) => b.score - a.score).slice(0, topN);
}

function renderFeed() {
    const clusters = selectClusters();
    const topN = state.snapshot ? state.snapshot.topN || TOP_N : TOP_N;

    const filterName =
        state.community === 'all' ? '전체 커뮤니티' : communityOf(state.community).name;
    const periodName = state.snapshot && state.snapshot.isWeekly
        ? '7일 종합'
        : state.snapshot && state.snapshot.isDaily
        ? '하루 종합'
        : '이번 수집';
    el.activeFilterName.textContent =
        filterName + ' · ' + periodName + ' 조회수+댓글수 기준 TOP ' + topN;

    if (!state.snapshot) {
        el.newsTotalCount.textContent = '-';
    } else if (state.snapshot.isWeekly) {
        el.newsTotalCount.textContent =
            '7일 누적 ' + state.snapshot.itemCount.toLocaleString() + '건 · 후보 ' +
            state.snapshot.candidateCount.toLocaleString() + '개 중 최고 화제글';
    } else if (state.snapshot.isDaily) {
        el.newsTotalCount.textContent =
            '하루 누적 ' + state.snapshot.itemCount.toLocaleString() + '건 중 최고 화제글';
    } else {
        el.newsTotalCount.textContent =
            state.snapshot.itemCount + '개 글 → ' + state.snapshot.clusterCount + '개 그룹';
    }

    if (clusters.length === 0) {
        el.newsGrid.innerHTML =
            '<div class="empty-state">' +
            '<span class="material-symbols-rounded">inbox</span>' +
            '<p>표시할 그룹이 없습니다.</p>' +
            '</div>';
        return;
    }

    // 4위 이하는 메달이 없으므로 숫자로 표기한다
    const MEDALS = ['🥇 1위', '🥈 2위', '🥉 3위'];
    const rankLabel = idx => MEDALS[idx] || idx + 1 + '위';

    el.newsGrid.innerHTML = clusters
        .map((cluster, idx) => {
            const note = BASIS_NOTE[cluster.scoreBasis];

            const sources = cluster.items
                .map(item => {
                    const c = communityOf(item.community);
                    return (
                        '<a class="cluster-source" href="' + escapeHtml(item.url) + '" target="_blank" rel="noopener noreferrer">' +
                        '<span class="community-badge" style="background:' + c.bgColor + ';color:' + c.color + '">' +
                        escapeHtml(c.name) + '</span>' +
                        '<span class="cluster-source-title">' + escapeHtml(item.title) + '</span>' +
                        '<span class="cluster-source-metrics">조회 ' + metric(item.views) + ' · 댓글 ' + metric(item.comments) + '</span>' +
                        '<span class="cluster-source-go">원문 ↗</span>' +
                        '</a>'
                    );
                })
                .join('');

            const communityBadges = cluster.communities
                .map(id => {
                    const c = communityOf(id);
                    return '<span class="community-badge" style="background:' + c.bgColor + ';color:' + c.color + '">' + escapeHtml(c.name) + '</span>';
                })
                .join('');

            return (
                '<article class="news-card">' +
                '<div class="card-rank-row">' +
                '<span class="rank-medal' + (idx > 2 ? ' plain' : '') + '">' + rankLabel(idx) + '</span>' +
                '<span class="card-group-count">' +
                (cluster.peakSlot ? '최고 ' + formatSlot(cluster.peakSlot) + ' · ' : '') +
                '유사글 ' + cluster.memberCount + '건 묶음</span>' +
                '</div>' +
                '<h3 class="card-title">' + escapeHtml(cluster.title) + '</h3>' +
                '<div class="card-communities">' + communityBadges + '</div>' +
                // 지표는 접어서 공간을 확보한다. 다만 지표 결손 경고는 순위 해석에 필수이므로
                // 접히지 않는 자리에 압축 형태로 항상 노출한다.
                (note
                    ? '<div class="basis-chip" title="' + escapeHtml(note) + '">' +
                      '<span class="material-symbols-rounded">warning</span>' + escapeHtml(note) +
                      '</div>'
                    : '') +
                '<details class="metrics-toggle">' +
                '<summary>' +
                '<span class="material-symbols-rounded chevron">expand_more</span>' +
                '<span class="summary-text">지표 보기</span>' +
                '<span class="summary-score">점수 ' + cluster.score.toLocaleString() + '</span>' +
                '</summary>' +
                '<div class="card-metrics">' +
                '<div class="metric-box"><span class="metric-label">총 조회수</span><strong>' + metric(cluster.totalViews) + '</strong></div>' +
                '<div class="metric-box"><span class="metric-label">총 댓글수</span><strong>' + metric(cluster.totalComments) + '</strong></div>' +
                '<div class="metric-box"><span class="metric-label">점수</span><strong>' + cluster.score.toLocaleString() + '</strong></div>' +
                '</div>' +
                '</details>' +
                '<div class="cluster-sources">' +
                '<div class="cluster-sources-label">묶인 글 ' + cluster.items.length + '건</div>' +
                sources +
                '</div>' +
                '</article>'
            );
        })
        .join('');
}

/** 클러스터 대표 제목에서 빈출 토큰을 뽑는다 (수집된 실데이터 기반) */
function renderTrendingKeywords() {
    if (!state.snapshot) return;

    const STOP = ['그리고', '하지만', '있는', '없는', '진짜', '이거', '그거', '요즘', '지금', '너무', '오늘'];
    const counts = {};

    (state.snapshot.clusters || []).forEach(c => {
        c.title
            .replace(/[^가-힣a-zA-Z0-9\s]/g, ' ')
            .split(/\s+/)
            .forEach(word => {
                if (word.length < 2 || word.length > 10) return;
                if (STOP.indexOf(word) !== -1) return;
                counts[word] = (counts[word] || 0) + 1;
            });
    });

    const top = Object.keys(counts)
        .map(w => ({ w, n: counts[w] }))
        .filter(x => x.n > 1)
        .sort((a, b) => b.n - a.n)
        .slice(0, 12);

    if (top.length === 0) {
        el.trendingKeywords.innerHTML = '<span class="trending-empty">2회 이상 등장한 키워드가 없습니다</span>';
        return;
    }

    el.trendingKeywords.innerHTML = top
        .map(x =>
            '<button class="trending-tag" data-keyword="' + escapeHtml(x.w) + '">' +
            escapeHtml(x.w) + '<span class="tag-count">' + x.n + '</span></button>'
        )
        .join('');

    Array.from(el.trendingKeywords.querySelectorAll('.trending-tag')).forEach(btn => {
        btn.onclick = () => {
            el.searchInput.value = btn.dataset.keyword;
            state.query = btn.dataset.keyword;
            el.clearSearchBtn.classList.remove('hidden');
            renderFeed();
        };
    });
}

// ===== 7일 키워드 시각화 =====

function dominantCommunity(communities) {
    const entries = Object.keys(communities || {}).map(id => [id, communities[id]]);
    if (entries.length === 0) return null;
    entries.sort((a, b) => b[1] - a[1]);
    return { id: entries[0][0], count: entries[0][1], total: entries.length };
}

/** 노출량 → 램프 인덱스 (0 = 가장 큼) */
function rampIndex(exposure, min, max) {
    if (max === min) return 2;
    const t = (exposure - min) / (max - min);
    const idx = KEYWORD_RAMP.length - 1 - Math.round(t * (KEYWORD_RAMP.length - 1));
    return Math.max(0, Math.min(KEYWORD_RAMP.length - 1, idx));
}

/** 글자 크기: 면적이 값에 비례하도록 제곱근 스케일 */
function cloudFontSize(exposure, min, max) {
    if (max === min) return (CLOUD_MIN_FONT + CLOUD_MAX_FONT) / 2;
    const t = Math.sqrt((exposure - min) / (max - min));
    return CLOUD_MIN_FONT + t * (CLOUD_MAX_FONT - CLOUD_MIN_FONT);
}

function keywordTooltipText(k) {
    const dom = dominantCommunity(k.communities);
    const parts = ['노출량 ' + k.exposure.toLocaleString(), '등장 슬롯 ' + k.slots.toLocaleString()];
    if (dom) {
        parts.push('주요 커뮤니티 ' + communityOf(dom.id).name + (dom.total > 1 ? ' 외 ' + (dom.total - 1) : ''));
    }
    return k.w + ' — ' + parts.join(' · ');
}

/**
 * 아르키메데스 나선 배치 + AABB 충돌 검사로 워드클라우드를 배치한다.
 * 외부 라이브러리를 쓰지 않으므로 텍스트 폭은 canvas measureText 로 실측한다.
 * 배치 실패한 단어는 버리고 개수를 각주에 밝힌다(조용히 누락시키지 않는다).
 */
function renderKeywordCloud() {
    if (!state.keywords) return;

    const words = state.keywords.keywords;
    const box = el.keywordCloud;
    const width = box.clientWidth || 640;
    const height = CLOUD_HEIGHT;

    if (words.length === 0) {
        box.innerHTML = '<div class="empty-state"><p>집계된 키워드가 없습니다.</p></div>';
        return;
    }

    const max = words[0].exposure;
    const min = words[words.length - 1].exposure;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const placed = [];
    const rendered = [];
    const cx = width / 2;
    const cy = height / 2;
    const PAD = 5;

    words.forEach(k => {
        const fontSize = cloudFontSize(k.exposure, min, max);
        ctx.font = '700 ' + fontSize + 'px Pretendard, system-ui, sans-serif';
        const textWidth = ctx.measureText(k.w).width;
        const textHeight = fontSize * 1.18;

        if (textWidth + PAD * 2 > width) return; // 컨테이너보다 넓은 단어는 배치 불가

        let spot = null;
        // 나선을 촘촘히 돌며 빈 자리를 찾는다. 타원 비율을 컨테이너 종횡비에 맞춰
        // 가로로 퍼지게 한다. 파라미터는 실데이터 시뮬레이션으로 조정했다
        // (폭 420~1280px 에서 120개 중 51~120개 배치, 렌더 약 56ms).
        const yScale = height / width;
        const maxRadius = Math.sqrt(width * width + height * height);

        for (let t = 0; t < CLOUD_SPIRAL_STEPS; t++) {
            const angle = t * 0.08;
            const radius = 0.7 * angle;
            if (radius > maxRadius) break; // 컨테이너를 벗어난 뒤로는 탐색 무의미

            const x = cx + radius * Math.cos(angle) - textWidth / 2;
            const y = cy + radius * yScale * Math.sin(angle) - textHeight / 2;

            if (x < PAD || y < PAD || x + textWidth > width - PAD || y + textHeight > height - PAD) {
                continue;
            }

            const hit = placed.some(
                p =>
                    x < p.x + p.w + PAD &&
                    x + textWidth + PAD > p.x &&
                    y < p.y + p.h + PAD &&
                    y + textHeight + PAD > p.y
            );

            if (!hit) {
                spot = { x, y, w: textWidth, h: textHeight };
                break;
            }
        }

        if (!spot) return;

        placed.push(spot);
        rendered.push({ k, spot, fontSize });
    });

    box.style.height = height + 'px';
    box.innerHTML = rendered
        .map(r => {
            const color = KEYWORD_RAMP[rampIndex(r.k.exposure, min, max)];
            return (
                '<span class="cloud-word" style="left:' + r.spot.x.toFixed(1) + 'px;top:' + r.spot.y.toFixed(1) +
                'px;font-size:' + r.fontSize.toFixed(1) + 'px;color:' + color + '"' +
                ' title="' + escapeHtml(keywordTooltipText(r.k)) + '"' +
                ' data-word="' + escapeHtml(r.k.w) + '">' +
                escapeHtml(r.k.w) +
                '</span>'
            );
        })
        .join('');

    Array.from(box.querySelectorAll('.cloud-word')).forEach(span => {
        span.onclick = () => {
            el.searchInput.value = span.dataset.word;
            state.query = span.dataset.word;
            el.clearSearchBtn.classList.remove('hidden');
            renderFeed();
            el.searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        };
    });

    const dropped = words.length - rendered.length;
    el.keywordFootnote.textContent =
        '노출량 = ' + state.keywords.exposureDefinition +
        (dropped > 0 ? ' · 공간 부족으로 ' + dropped + '개 키워드는 표시되지 않았습니다(막대·표 보기에서 확인).' : '');
}

function renderKeywordBar() {
    if (!state.keywords) return;

    const words = state.keywords.keywords.slice(0, BAR_TOP_N);
    if (words.length === 0) {
        el.keywordBar.innerHTML = '<div class="empty-state"><p>집계된 키워드가 없습니다.</p></div>';
        return;
    }

    const max = words[0].exposure;

    el.keywordBar.style.height = 'auto';
    el.keywordBar.innerHTML =
        '<div class="bar-chart">' +
        words
            .map(k => {
                const pct = max === 0 ? 0 : (k.exposure / max) * 100;
                const dom = dominantCommunity(k.communities);
                return (
                    '<div class="bar-row" title="' + escapeHtml(keywordTooltipText(k)) + '">' +
                    '<span class="bar-label">' + escapeHtml(k.w) + '</span>' +
                    '<span class="bar-track">' +
                    '<span class="bar-fill" style="width:' + pct.toFixed(1) + '%"></span>' +
                    '</span>' +
                    '<span class="bar-value">' + k.exposure.toLocaleString() + '</span>' +
                    '<span class="bar-meta">' + escapeHtml(dom ? communityOf(dom.id).name : '-') + '</span>' +
                    '</div>'
                );
            })
            .join('') +
        '</div>';

    el.keywordFootnote.textContent =
        '상위 ' + words.length + '개 · 노출량 = ' + state.keywords.exposureDefinition;
}

function renderKeywordTable() {
    if (!state.keywords) return;

    const words = state.keywords.keywords;
    if (words.length === 0) {
        el.keywordTable.innerHTML = '<div class="empty-state"><p>집계된 키워드가 없습니다.</p></div>';
        return;
    }

    el.keywordTable.style.height = 'auto';
    el.keywordTable.innerHTML =
        '<div class="table-scroll"><table class="viz-table">' +
        '<thead><tr><th>순위</th><th>키워드</th><th class="num">노출량</th><th class="num">등장 슬롯</th><th>커뮤니티 분포</th></tr></thead><tbody>' +
        words
            .map((k, i) => {
                const dist = Object.keys(k.communities)
                    .map(id => [id, k.communities[id]])
                    .sort((a, b) => b[1] - a[1])
                    .map(e => communityOf(e[0]).name + ' ' + e[1])
                    .join(', ');
                return (
                    '<tr><td>' + (i + 1) + '</td>' +
                    '<td class="kw">' + escapeHtml(k.w) + '</td>' +
                    '<td class="num">' + k.exposure.toLocaleString() + '</td>' +
                    '<td class="num">' + k.slots.toLocaleString() + '</td>' +
                    '<td class="dist">' + escapeHtml(dist) + '</td></tr>'
                );
            })
            .join('') +
        '</tbody></table></div>';

    el.keywordFootnote.textContent =
        '전체 ' + words.length + '개 · 노출량 = ' + state.keywords.exposureDefinition;
}

function renderKeywordSection() {
    if (!state.keywords) {
        el.keywordSubtitle.textContent = '키워드 집계 데이터가 없습니다 (npm run collect 실행 필요)';
        return;
    }

    const k = state.keywords;
    el.keywordSubtitle.textContent =
        (k.fromDay || '?') + ' ~ ' + (k.toDay || '?') +
        ' · ' + k.daysUsed.length + '일 · 스냅샷 ' + k.snapshotCount.toLocaleString() + '건 집계 · 키워드 ' + k.keywordCount + '개';

    el.keywordCloud.classList.toggle('hidden', state.keywordView !== 'cloud');
    el.keywordBar.classList.toggle('hidden', state.keywordView !== 'bar');
    el.keywordTable.classList.toggle('hidden', state.keywordView !== 'table');

    if (state.keywordView === 'cloud') renderKeywordCloud();
    else if (state.keywordView === 'bar') renderKeywordBar();
    else renderKeywordTable();
}

function renderSnapshotSelect() {
    if (!state.index) return;

    const slotOptions = state.index.slots
        .map(s =>
            '<option value="' + escapeHtml(s.path) + '"' +
            (state.snapshot && !state.snapshot.isDaily && state.snapshot.slot === s.slot ? ' selected' : '') + '>' +
            formatSlot(s.slot) + ' (' + s.okSources + '/' + s.totalSources + ' 정상, ' + s.itemCount + '건)' +
            '</option>'
        )
        .join('');

    const dayOptions = (state.index.days || [])
        .map(d =>
            '<option value="' + escapeHtml(d.path) + '"' +
            (state.snapshot && state.snapshot.isDaily && state.snapshot.date === d.date ? ' selected' : '') + '>' +
            d.date + ' 요약 (' + d.snapshotCount + '회 수집)' +
            '</option>'
        )
        .join('');

    const weeklyOption =
        '<optgroup label="기간 종합">' +
        '<option value="weekly"' + (state.snapshot && state.snapshot.isWeekly ? ' selected' : '') + '>' +
        '7일 종합 TOP ' + WEEKLY_TOP_N +
        '</option></optgroup>';

    el.snapshotSelect.innerHTML =
        weeklyOption +
        '<optgroup label="30분 단위 원본 (최근 ' + (state.index.retentionDays || 7) + '일) · TOP ' + TOP_N + '">' + slotOptions + '</optgroup>' +
        (dayOptions ? '<optgroup label="일별 요약 (영구 보존) · TOP ' + TOP_N + '">' + dayOptions + '</optgroup>' : '');
}

function renderTimeline() {
    if (!state.index) return;

    const slots = state.index.slots;
    const days = state.index.days || [];

    el.timelineSub.textContent =
        '원본 ' + slots.length + '개(최근 ' + (state.index.retentionDays || 7) + '일) · 일별 요약 ' + days.length + '일(영구 보존)';

    if (slots.length === 0 && days.length === 0) {
        el.timelineList.innerHTML = '<div class="empty-state"><p>아직 누적된 스냅샷이 없습니다.</p></div>';
        return;
    }

    const slotRows = slots.slice(0, 48).map(s => {
        const active = state.snapshot && !state.snapshot.isDaily && state.snapshot.slot === s.slot;
        return (
            '<button class="timeline-row' + (active ? ' active' : '') + '" data-path="' + escapeHtml(s.path) + '" data-kind="slot">' +
            '<span class="timeline-time">' + formatSlot(s.slot) + '</span>' +
            '<span class="timeline-top1">' + escapeHtml(s.top1 || '수집 결과 없음') + '</span>' +
            '<span class="timeline-meta">' + s.itemCount + '건 · ' + s.okSources + '/' + s.totalSources + '</span>' +
            '</button>'
        );
    });

    const dayRows = days.map(d => {
        const active = state.snapshot && state.snapshot.isDaily && state.snapshot.date === d.date;
        return (
            '<button class="timeline-row daily' + (active ? ' active' : '') + '" data-path="' + escapeHtml(d.path) + '" data-kind="daily">' +
            '<span class="timeline-time">' + escapeHtml(d.date.slice(5)) + '</span>' +
            '<span class="timeline-top1">' + escapeHtml(d.top1 || '수집 결과 없음') + '</span>' +
            '<span class="timeline-meta">' + d.snapshotCount + '회 · 누적 ' + d.itemCountTotal.toLocaleString() + '건</span>' +
            '</button>'
        );
    });

    el.timelineList.innerHTML =
        '<div class="timeline-group-label">30분 단위 원본</div>' +
        (slotRows.length ? slotRows.join('') : '<div class="timeline-none">없음</div>') +
        (dayRows.length
            ? '<div class="timeline-group-label">일별 요약 · 영구 보존</div>' + dayRows.join('')
            : '');

    Array.from(el.timelineList.querySelectorAll('.timeline-row')).forEach(row => {
        row.onclick = () =>
            row.dataset.kind === 'daily' ? loadDaily(row.dataset.path) : loadSnapshot(row.dataset.path);
    });
}

// ===== 카운트다운 =====
//
// GitHub Actions 예약 실행은 부하에 따라 수 분 지연되거나 건너뛸 수 있다.
// 따라서 "정확히 30분 후"를 약속하지 않고, 기록된 capturedAt 기준의 "예정" 시각으로 표기한다.

function updateCountdown() {
    // 헤더의 수집 시각·카운트다운은 "수집이 얼마나 최신인가"를 알리는 정보이므로
    // 어떤 보기를 보고 있든 항상 최신 스냅샷 기준으로 표시한다.
    if (!state.latest) return;

    const captured = new Date(state.latest.capturedAt);
    const elapsedMin = (Date.now() - captured.getTime()) / 60000;

    el.lastUpdatedTime.textContent =
        '마지막 수집: ' + captured.toLocaleString('ko-KR', { hour12: false }) +
        ' (' + (elapsedMin < 1 ? '방금 전' : Math.floor(elapsedMin) + '분 전') + ')';

    const remaining = SLOT_MINUTES - (elapsedMin % SLOT_MINUTES);
    if (elapsedMin > SLOT_MINUTES * 2) {
        el.countdownDisplay.textContent = '지연';
        el.countdownDisplay.title = '예정 주기를 넘겼습니다. GitHub Actions 실행이 지연되거나 건너뛰어졌을 수 있습니다.';
        el.timerProgressBar.style.width = '100%';
        return;
    }

    const mm = Math.floor(remaining);
    const ss = Math.floor((remaining - mm) * 60);
    el.countdownDisplay.textContent =
        String(mm).padStart(2, '0') + ':' + String(ss).padStart(2, '0');
    el.timerProgressBar.style.width = ((SLOT_MINUTES - remaining) / SLOT_MINUTES * 100).toFixed(1) + '%';
}

// ===== 로딩 =====

async function loadSnapshot(path) {
    try {
        state.snapshot = await fetchJson('data/' + path);
        renderAll();
    } catch (err) {
        toast('스냅샷을 불러오지 못했습니다: ' + err.message);
    }
}

/**
 * 7일 종합 TOP 10 을 불러온다 (기본 보기).
 * 30분 스냅샷과 형태가 다르므로 렌더 경로가 공유되도록 맞춰준다.
 */
async function loadWeekly() {
    try {
        const w = await fetchJson('data/weekly.json');
        state.snapshot = {
            isWeekly: true,
            topN: WEEKLY_TOP_N,
            slot: 'weekly',
            fromDay: w.fromDay,
            toDay: w.toDay,
            capturedAt: w.generatedAt,
            snapshotCount: w.snapshotCount,
            itemCount: w.itemCountTotal,
            candidateCount: w.candidateCount,
            clusterCount: w.top.length,
            partialDays: w.partialDays || [],
            sourceSummary: w.sourceSummary,
            sources: [],
            clusters: w.top,
            top: w.top
        };
        renderAll();
    } catch (err) {
        toast('7일 종합을 불러오지 못했습니다: ' + err.message);
        // 7일 종합이 없으면 최신 스냅샷으로 물러난다
        if (state.latest) {
            state.snapshot = state.latest;
            renderAll();
        }
    }
}

/**
 * 일별 요약을 불러온다. 30분 스냅샷과 형태가 달라 렌더 경로가 공유되도록 맞춰준다.
 * (요약에는 전체 클러스터가 없고 그날의 TOP 3 만 있다 — 용량 통제를 위한 의도된 손실)
 */
async function loadDaily(path) {
    try {
        const daily = await fetchJson('data/' + path);
        state.snapshot = {
            isDaily: true,
            date: daily.date,
            slot: daily.date,
            capturedAt: daily.lastCapturedAt,
            snapshotCount: daily.snapshotCount,
            itemCount: daily.itemCountTotal,
            clusterCount: daily.top.length,
            sourceSummary: daily.sourceSummary,
            sources: [],
            clusters: daily.top,
            top: daily.top
        };
        renderAll();
    } catch (err) {
        toast('일별 요약을 불러오지 못했습니다: ' + err.message);
    }
}

function renderAll() {
    renderCommunityPills();
    renderSourceStatus();
    renderFeed();
    renderTrendingKeywords();
    renderSnapshotSelect();
    renderTimeline();
    renderKeywordSection();
    updateCountdown();
}

async function loadAll() {
    el.refreshIcon.classList.add('icon-spin');
    try {
        const [index, latest] = await Promise.all([
            fetchJson('data/index.json'),
            fetchJson('data/latest.json')
        ]);
        state.index = index;
        state.latest = latest;

        // 키워드 집계는 없어도 나머지 화면이 동작해야 한다
        try {
            state.keywords = await fetchJson('data/keywords.json');
        } catch (e) {
            state.keywords = null;
        }

        // 기본 보기는 7일 종합 TOP 10. 실패 시 loadWeekly 가 최신 스냅샷으로 물러난다.
        await loadWeekly();
    } catch (err) {
        el.newsGrid.innerHTML =
            '<div class="empty-state">' +
            '<span class="material-symbols-rounded">error</span>' +
            '<p>수집 데이터를 불러오지 못했습니다.</p>' +
            '<p class="empty-detail">' + escapeHtml(err.message) + '</p>' +
            '<p class="empty-detail">아직 수집한 적이 없다면 <code>npm run collect</code> 를 먼저 실행하세요. ' +
            'file:// 로 직접 열면 브라우저가 fetch 를 막으므로 <code>npm run serve</code> 로 확인하세요.</p>' +
            '</div>';
        el.lastUpdatedTime.textContent = '수집 기록 없음';
    } finally {
        el.refreshIcon.classList.remove('icon-spin');
    }
}

function initApp() {
    el.refreshBtn.onclick = loadAll;

    // 기본 보기(7일 종합)로 돌아가는 버튼
    el.latestBtn.onclick = () => loadWeekly();

    el.snapshotSelect.onchange = e => {
        const value = e.target.value;
        if (value === 'weekly') return loadWeekly();
        return value.indexOf('daily/') === 0 ? loadDaily(value) : loadSnapshot(value);
    };

    el.searchInput.oninput = e => {
        state.query = e.target.value.trim();
        el.clearSearchBtn.classList.toggle('hidden', state.query === '');
        renderFeed();
    };

    el.clearSearchBtn.onclick = () => {
        el.searchInput.value = '';
        state.query = '';
        el.clearSearchBtn.classList.add('hidden');
        renderFeed();
    };

    Array.from(document.querySelectorAll('.viz-view-btn')).forEach(btn => {
        btn.onclick = () => {
            state.keywordView = btn.dataset.view;
            Array.from(document.querySelectorAll('.viz-view-btn')).forEach(b => {
                const active = b === btn;
                b.classList.toggle('active', active);
                b.setAttribute('aria-selected', active ? 'true' : 'false');
            });
            renderKeywordSection();
        };
    });

    // 클라우드는 컨테이너 폭에 맞춰 배치하므로 리사이즈 시 다시 배치한다
    window.addEventListener('resize', () => {
        clearTimeout(state.cloudResizeTimer);
        state.cloudResizeTimer = setTimeout(() => {
            if (state.keywordView === 'cloud') renderKeywordCloud();
        }, 200);
    });

    loadAll();
    state.countdownTimer = setInterval(updateCountdown, 1000);
}

document.addEventListener('DOMContentLoaded', initApp);
