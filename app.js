// ===== Community Pulse — 수집된 스냅샷을 읽어 렌더한다 =====
//
// 이 파일은 데이터를 만들지 않는다. collector 가 저장한 data/*.json 만 읽는다.
// 조회수·댓글수를 제공하지 않는 소스가 있으므로(null), 그 사실을 화면에 반드시 표시한다.

const COMMUNITY_CONFIG = {
    fmkorea: { id: 'fmkorea', name: '에펨코리아', color: '#0055a6', bgColor: 'rgba(0,85,166,0.14)' },
    ruliweb: { id: 'ruliweb', name: '루리웹', color: '#4d8fd6', bgColor: 'rgba(77,143,214,0.14)' },
    instiz: { id: 'instiz', name: '인스티즈', color: '#2b963a', bgColor: 'rgba(43,150,58,0.14)' },
    naver_stock: { id: 'naver_stock', name: '네이버 종토방', color: '#03c75a', bgColor: 'rgba(3,199,90,0.14)' },
    dc_stock: { id: 'dc_stock', name: '디시 주식갤', color: '#6b7ce0', bgColor: 'rgba(107,124,224,0.14)' },
    dc_realestate: { id: 'dc_realestate', name: '디시 부동산갤', color: '#b07ce0', bgColor: 'rgba(176,124,224,0.14)' }
};

const TOP_N = 3;
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

const state = {
    index: null,
    snapshot: null,
    community: 'all',
    query: '',
    countdownTimer: null
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
    toastContainer: document.getElementById('toastContainer')
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
        state.snapshot.sources.forEach(s => { counts[s.id] = s.itemCount; });
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

    return clusters.slice().sort((a, b) => b.score - a.score).slice(0, TOP_N);
}

function renderFeed() {
    const clusters = selectClusters();

    const filterName =
        state.community === 'all' ? '전체 커뮤니티' : communityOf(state.community).name;
    el.activeFilterName.textContent =
        filterName + ' · 조회수+댓글수 기준 TOP ' + TOP_N;

    el.newsTotalCount.textContent = state.snapshot
        ? state.snapshot.itemCount + '개 글 → ' + state.snapshot.clusterCount + '개 그룹'
        : '-';

    if (clusters.length === 0) {
        el.newsGrid.innerHTML =
            '<div class="empty-state">' +
            '<span class="material-symbols-rounded">inbox</span>' +
            '<p>표시할 그룹이 없습니다.</p>' +
            '</div>';
        return;
    }

    const medals = ['🥇 1위', '🥈 2위', '🥉 3위'];

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
                '<span class="rank-medal">' + medals[idx] + '</span>' +
                '<span class="card-group-count">유사글 ' + cluster.memberCount + '건 묶음</span>' +
                '</div>' +
                '<h3 class="card-title">' + escapeHtml(cluster.title) + '</h3>' +
                '<div class="card-communities">' + communityBadges + '</div>' +
                '<div class="card-metrics">' +
                '<div class="metric-box"><span class="metric-label">총 조회수</span><strong>' + metric(cluster.totalViews) + '</strong></div>' +
                '<div class="metric-box"><span class="metric-label">총 댓글수</span><strong>' + metric(cluster.totalComments) + '</strong></div>' +
                '<div class="metric-box"><span class="metric-label">점수</span><strong>' + cluster.score.toLocaleString() + '</strong></div>' +
                '</div>' +
                (note ? '<div class="basis-warning"><span class="material-symbols-rounded">warning</span>' + escapeHtml(note) + '</div>' : '') +
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

function renderSnapshotSelect() {
    if (!state.index) return;

    el.snapshotSelect.innerHTML = state.index.slots
        .map(s =>
            '<option value="' + escapeHtml(s.path) + '"' +
            (state.snapshot && state.snapshot.slot === s.slot ? ' selected' : '') + '>' +
            formatSlot(s.slot) + ' (' + s.okSources + '/' + s.totalSources + ' 정상, ' + s.itemCount + '건)' +
            '</option>'
        )
        .join('');
}

function renderTimeline() {
    if (!state.index) return;

    const slots = state.index.slots;
    el.timelineSub.textContent =
        '누적 ' + slots.length + '개 스냅샷 · ' + (state.index.retentionDays || 7) + '일 보관';

    if (slots.length === 0) {
        el.timelineList.innerHTML = '<div class="empty-state"><p>아직 누적된 스냅샷이 없습니다.</p></div>';
        return;
    }

    el.timelineList.innerHTML = slots
        .slice(0, 48)
        .map(s => {
            const active = state.snapshot && state.snapshot.slot === s.slot;
            return (
                '<button class="timeline-row' + (active ? ' active' : '') + '" data-path="' + escapeHtml(s.path) + '">' +
                '<span class="timeline-time">' + formatSlot(s.slot) + '</span>' +
                '<span class="timeline-top1">' + escapeHtml(s.top1 || '수집 결과 없음') + '</span>' +
                '<span class="timeline-meta">' + s.itemCount + '건 · ' + s.okSources + '/' + s.totalSources + '</span>' +
                '</button>'
            );
        })
        .join('');

    Array.from(el.timelineList.querySelectorAll('.timeline-row')).forEach(row => {
        row.onclick = () => loadSnapshot(row.dataset.path);
    });
}

// ===== 카운트다운 =====
//
// GitHub Actions 예약 실행은 부하에 따라 수 분 지연되거나 건너뛸 수 있다.
// 따라서 "정확히 30분 후"를 약속하지 않고, 기록된 capturedAt 기준의 "예정" 시각으로 표기한다.

function updateCountdown() {
    if (!state.snapshot) return;

    const captured = new Date(state.snapshot.capturedAt);
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

function renderAll() {
    renderCommunityPills();
    renderSourceStatus();
    renderFeed();
    renderTrendingKeywords();
    renderSnapshotSelect();
    renderTimeline();
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
        state.snapshot = latest;
        renderAll();
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

    el.latestBtn.onclick = () => {
        if (state.index && state.index.slots.length > 0) {
            loadSnapshot(state.index.slots[0].path);
        }
    };

    el.snapshotSelect.onchange = e => loadSnapshot(e.target.value);

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

    loadAll();
    state.countdownTimer = setInterval(updateCountdown, 1000);
}

document.addEventListener('DOMContentLoaded', initApp);
