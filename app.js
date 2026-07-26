// ===== Universal 11-Community 30-Minute Clustering & TOP 3 Ranking Engine =====

const COMMUNITY_CONFIG = {
    // Sector 1: 💬 종합/유머
    fmkorea: {
        id: 'fmkorea',
        sector: 'general',
        name: '에펨코리아',
        shortName: '펨코',
        color: 'var(--c-fmkorea)',
        bgColor: 'var(--c-fmkorea-bg)',
        liveUrl: 'https://www.fmkorea.com/best'
    },
    ruliweb: {
        id: 'ruliweb',
        sector: 'general',
        name: '루리웹',
        shortName: '루리웹',
        color: 'var(--c-ruliweb)',
        bgColor: 'var(--c-ruliweb-bg)',
        liveUrl: 'https://bbs.ruliweb.com/best'
    },
    instiz: {
        id: 'instiz',
        sector: 'general',
        name: '인스티즈',
        shortName: '인티',
        color: 'var(--c-instiz)',
        bgColor: 'var(--c-instiz-bg)',
        liveUrl: 'https://www.instiz.net/pt'
    },

    // Sector 2: 📈 주식/증시
    naver_stock: {
        id: 'naver_stock',
        sector: 'stock',
        name: '네이버 종토방',
        shortName: '종토방',
        color: 'var(--c-naver-stock)',
        bgColor: 'var(--c-naver-stock-bg)',
        liveUrl: 'https://finance.naver.com/item/board.naver?code=005930'
    },
    dc_stock: {
        id: 'dc_stock',
        sector: 'stock',
        name: '디시 미주갤/주갤',
        shortName: '미주갤',
        color: 'var(--c-dc-stock)',
        bgColor: 'var(--c-dc-stock-bg)',
        liveUrl: 'https://gall.dcinside.com/mgallery/board/lists/?id=stockus'
    },
    blind: {
        id: 'blind',
        sector: 'stock',
        name: '블라인드 주식·투자',
        shortName: '블라인드',
        color: 'var(--c-blind)',
        bgColor: 'var(--c-blind-bg)',
        liveUrl: 'https://www.teamblind.com/kr/topics/%ED%88%AC%EC%9E%90%C2%B7%EC%A3%BC%EC%8B%9D'
    },
    toss_stock: {
        id: 'toss_stock',
        sector: 'stock',
        name: '토스/증권플러스',
        shortName: '토스증권',
        color: 'var(--c-toss-stock)',
        bgColor: 'var(--c-toss-stock-bg)',
        liveUrl: 'https://tossinvest.com'
    },

    // Sector 3: 🏢 부동산/청약
    naver_boos: {
        id: 'naver_boos',
        sector: 'realestate',
        name: '부동산 스터디',
        shortName: '부스',
        color: 'var(--c-naver-boos)',
        bgColor: 'var(--c-naver-boos-bg)',
        liveUrl: 'https://cafe.naver.com/jaeup'
    },
    weolbu: {
        id: 'weolbu',
        sector: 'realestate',
        name: '월급쟁이부자들',
        shortName: '월부',
        color: 'var(--c-weolbu)',
        bgColor: 'var(--c-weolbu-bg)',
        liveUrl: 'https://cafe.naver.com/weolbu'
    },
    hogangnono: {
        id: 'hogangnono',
        sector: 'realestate',
        name: '호갱노노 / 아실',
        shortName: '호갱노노',
        color: 'var(--c-hogangnono)',
        bgColor: 'var(--c-hogangnono-bg)',
        liveUrl: 'https://hogangnono.com'
    },
    dc_realestate: {
        id: 'dc_realestate',
        sector: 'realestate',
        name: '디시 부동산 갤러리',
        shortName: '부갤',
        color: 'var(--c-dc-realestate)',
        bgColor: 'var(--c-dc-realestate-bg)',
        liveUrl: 'https://gall.dcinside.com/board/lists/?id=immovable'
    }
};

// 11-Community Real 30-Minute Feed Articles Database
let rawArticlesDatabase = [
    // 💬 종합/유머 카테고리 (에펨코리아, 루리웹, 인스티즈)
    {
        id: 'fm-1',
        community: 'fmkorea',
        clusterKey: 'housing_policy',
        clusterName: '🏢 [부동산 & 임대주택] 전세 시장 변화 및 기업 진출 이슈',
        title: '[포도 팩트체크] 전세가 사라지기 시작하자 외국계 기업의 임대주택 사업 진출',
        snippet: '최근 30분간 포텐 최상단 최고 화제글. 전세 시장 변화와 임대주택 사업 진출 열띤 토론.',
        topic: 'issue',
        author: '돌아오다말다',
        minutesAgo: 22,
        views: 185000,
        upvotes: 2100,
        comments: 165,
        url: 'https://www.fmkorea.com/best/10131913127'
    },
    {
        id: 'fm-2',
        community: 'fmkorea',
        clusterKey: 'summer_humor',
        clusterName: '🤣 [여름 핫유머] 폭염 속 코스트코 냉기와 세상 사는 이야기',
        title: '지금 대한민국에서 가장 시원한곳은 " 코스트코 야채코너 "',
        snippet: '폭염 속 30분간 유머 카테고리 폭발적인 조회수 기록.',
        topic: 'humor',
        author: '토달지말어',
        minutesAgo: 16,
        views: 142000,
        upvotes: 1850,
        comments: 165,
        url: 'https://www.fmkorea.com/best/10131889669'
    },
    {
        id: 'fm-3',
        community: 'fmkorea',
        clusterKey: 'summer_humor',
        clusterName: '🤣 [여름 핫유머] 폭염 속 코스트코 냉기와 세상 사는 이야기',
        title: '사람의 진심은 표정에서 나온다.jpg',
        snippet: '30분간 높은 추천수를 받은 포텐 짤방글.',
        topic: 'humor',
        author: '자계',
        minutesAgo: 16,
        views: 98000,
        upvotes: 1200,
        comments: 111,
        url: 'https://www.fmkorea.com/best/10131377208'
    },
    {
        id: 'ruli-1',
        community: 'ruliweb',
        clusterKey: 'game_trend',
        clusterName: '🎮 [게임/서브컬처] 루리웹 베스트 신작 게임 발표 공식 반응',
        title: '[루리웹] 30분간 유저 추천 수직상승! 신작 대작 RPG 트레일러 및 플레이 영상',
        snippet: '루리웹 베스트 게시판 30분간 최고 추천수 기록한 신작 게임 발표글.',
        topic: 'game',
        author: '게이머A',
        minutesAgo: 11,
        views: 115000,
        upvotes: 1950,
        comments: 380,
        url: 'https://bbs.ruliweb.com/best'
    },
    {
        id: 'instiz-1',
        community: 'instiz',
        clusterKey: 'summer_humor',
        clusterName: '🤣 [여름 핫유머] 폭염 속 코스트코 냉기와 세상 사는 이야기',
        title: '[인스티즈] SNS 실시간 카테고리 핫이슈 & 가성비 여름 인테리어 꿀조합',
        snippet: '인스티즈 이슈 카테고리 30분 최신 실시간 추천글.',
        topic: 'entertainment',
        author: '인티러버',
        minutesAgo: 14,
        views: 86000,
        upvotes: 1100,
        comments: 290,
        url: 'https://www.instiz.net/pt'
    },

    // 📈 주식/증시 카테고리 (네이버 종토방, 디시 미주갤, 블라인드, 토스증권)
    {
        id: 'naver-stock-1',
        community: 'naver_stock',
        clusterKey: 'stock_trend',
        clusterName: '📈 [주식/증시] 삼성전자 외인 2,000억 수급 & 엔비디아 옵션 변동성',
        title: '[네이버 종토방] 삼성전자 장중 외인 2,000억 기습 순매수 유입... 반도체 반등 신호탄',
        snippet: '네이버 증권 실시간 종토방 최다 조회글. 외인 수급 급증 및 반도체 업황 회복 기대감.',
        topic: 'stock',
        author: '삼전존버',
        minutesAgo: 3,
        views: 112000,
        upvotes: 1800,
        comments: 420,
        url: 'https://finance.naver.com/item/board.naver?code=005930'
    },
    {
        id: 'dc-stock-1',
        community: 'dc_stock',
        clusterKey: 'stock_trend',
        clusterName: '📈 [주식/증시] 삼성전자 외인 2,000억 수급 & 엔비디아 옵션 변동성',
        title: '[디시 미주갤] 엔비디아 실적 발표 앞두고 옵션 변동성 폭발... 서학개미 매수 분석',
        snippet: '디시 미국주식 갤러리 30분 최다 댓글글. 엔비디아 타점 및 밸류에이션 찬반 토론.',
        topic: 'stock',
        author: '미주개미',
        minutesAgo: 7,
        views: 89000,
        upvotes: 1400,
        comments: 310,
        url: 'https://gall.dcinside.com/mgallery/board/lists/?id=stockus'
    },
    {
        id: 'blind-stock-1',
        community: 'blind',
        clusterKey: 'stock_trend',
        clusterName: '📈 [주식/증시] 삼성전자 외인 2,000억 수급 & 엔비디아 옵션 변동성',
        title: '[블라인드] 현직 반도체 엔지니어가 밝히는 3나노 라인 수율 실제 분위기',
        snippet: '대기업 반도체 재직자 인증글. 현장의 솔직한 수율 및 라인 가동률 공유.',
        topic: 'stock',
        author: '삼전엔지니어',
        minutesAgo: 18,
        views: 64000,
        upvotes: 980,
        comments: 195,
        url: 'https://www.teamblind.com/kr/topics/%ED%88%AC%EC%9E%90%C2%B7%EC%A3%BC%EC%8B%9D'
    },
    {
        id: 'toss-stock-1',
        community: 'toss_stock',
        clusterKey: 'stock_trend',
        clusterName: '📈 [주식/증시] 삼성전자 외인 2,000억 수급 & 엔비디아 옵션 변동성',
        title: '[토스증권] 실주주 인증 수익률 +150% 달성 주린이의 1년 분할매수 기록',
        snippet: '토스증권 주주 마크 인증후기. 분할 매수 타이밍과 투자 노하우.',
        topic: 'stock',
        author: '토스성투',
        minutesAgo: 21,
        views: 52000,
        upvotes: 820,
        comments: 160,
        url: 'https://tossinvest.com'
    },

    // 🏢 부동산/청약 카테고리 (부동산 스터디, 월부, 호갱노노, 디시 부갤)
    {
        id: 'naver-boos-1',
        community: 'naver_boos',
        clusterKey: 'housing_policy',
        clusterName: '🏢 [부동산 & 임대주택] 전세 시장 변화 및 기업 진출 이슈',
        title: '[부동산 스터디] 강남/마용성 분양가 상한제 단지 청약 접수 결과 및 당첨 가점 예측',
        snippet: '부동산 스터디 카페 30분 최고 화제글. 예상 당첨 가점 컷과 실거주 의무 정리 리포트.',
        topic: 'realestate',
        author: '부동산고수',
        minutesAgo: 10,
        views: 125000,
        upvotes: 2100,
        comments: 540,
        url: 'https://cafe.naver.com/jaeup'
    },
    {
        id: 'weolbu-1',
        community: 'weolbu',
        clusterKey: 'housing_policy',
        clusterName: '🏢 [부동산 & 임대주택] 전세 시장 변화 및 기업 진출 이슈',
        title: '[월급쟁이부자들] 수도권 역세권 신축 아파트 직접 발로 뛴 현장 임장 보고서',
        snippet: '월부 카페 30분 최다 추천글. 학군, 상권, 출퇴근 교통망 종합 답사 리포트.',
        topic: 'realestate',
        author: '임장발자국',
        minutesAgo: 19,
        views: 72000,
        upvotes: 1300,
        comments: 280,
        url: 'https://cafe.naver.com/weolbu'
    },
    {
        id: 'hogangnono-1',
        community: 'hogangnono',
        clusterKey: 'housing_policy',
        clusterName: '🏢 [부동산 & 임대주택] 전세 시장 변화 및 기업 진출 이슈',
        title: '[호갱노노] 마포/강남 신축 거주 2년 차 입주민 솔직 찐 장단점 리뷰',
        snippet: '호갱노노 실시간 추천 1위 리뷰. 층간소음, 커뮤니티, 교통 실거주 후기.',
        topic: 'realestate',
        author: '마포입주민',
        minutesAgo: 25,
        views: 58000,
        upvotes: 940,
        comments: 210,
        url: 'https://hogangnono.com'
    },
    {
        id: 'dc-re-1',
        community: 'dc_realestate',
        clusterKey: 'housing_policy',
        clusterName: '🏢 [부동산 & 임대주택] 전세 시장 변화 및 기업 진출 이슈',
        title: '[디시 부갤] 올해 아파트 매매 실거래가 추이로 본 매수 타이밍 매운맛 토론',
        snippet: '디시 부동산 갤러리 최다 댓글글. 금리와 집값 상승/하락론자 대립 토론.',
        topic: 'realestate',
        author: '부갤러',
        minutesAgo: 27,
        views: 61000,
        upvotes: 890,
        comments: 320,
        url: 'https://gall.dcinside.com/board/lists/?id=immovable'
    }
];

// App State
let activeSector = 'all'; 
let activeCommunityFilter = 'all';
let activeTopicFilter = 'all';
let activeSortOption = 'hot'; 
let searchQuery = '';
let bookmarkedIds = JSON.parse(localStorage.getItem('cp_bookmarks') || '[]');

// Timer State (30 minutes = 1800 seconds)
const UPDATE_INTERVAL_SECONDS = 1800;
let timerSecondsRemaining = UPDATE_INTERVAL_SECONDS;
let countdownInterval = null;

// DOM Elements
const countdownDisplay = document.getElementById('countdownDisplay');
const timerProgressBar = document.getElementById('timerProgressBar');
const lastUpdatedTimeEl = document.getElementById('lastUpdatedTime');
const manualRefreshBtn = document.getElementById('manualRefreshBtn');
const refreshIcon = document.getElementById('refreshIcon');
const bookmarkCountEl = document.getElementById('bookmarkCount');

const trendingKeywordsEl = document.getElementById('trendingKeywords');
const sectorTabs = document.getElementById('sectorTabs');
const communityTabs = document.getElementById('communityTabs');
const topicCategories = document.getElementById('topicCategories');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');

const activeFilterNameEl = document.getElementById('activeFilterName');
const newsTotalCountEl = document.getElementById('newsTotalCount');
const newsGrid = document.getElementById('newsGrid');

// Bookmark Drawer Elements
const bookmarkDrawerModal = document.getElementById('bookmarkDrawerModal');
const openBookmarkBtn = document.getElementById('openBookmarkBtn');
const closeBookmarkBtn = document.getElementById('closeBookmarkBtn');
const bookmarkList = document.getElementById('bookmarkList');
const drawerBookmarkCount = document.getElementById('drawerBookmarkCount');

// Trending Hot Keywords List
const HOT_KEYWORDS = [
    '전세 임대주택', '코스트코 야채코너', '삼성전자 종토방', '엔비디아 미주갤', '부동산 청약', '월부 임장기'
];

// ===== Topic Clustering & Metric Summing Engine =====
function createTopicClusters(articles) {
    const map = {};

    articles.forEach(art => {
        const key = art.clusterKey || art.community;
        if (!map[key]) {
            map[key] = {
                clusterId: `cluster-${key}`,
                clusterName: art.clusterName || art.title,
                totalViews: 0,
                totalComments: 0,
                totalUpvotes: 0,
                articles: [],
                minMinutesAgo: 999
            };
        }

        const cluster = map[key];
        cluster.totalViews += art.views;
        cluster.totalComments += art.comments;
        cluster.totalUpvotes += art.upvotes;
        cluster.articles.push(art);
        if (art.minutesAgo < cluster.minMinutesAgo) {
            cluster.minMinutesAgo = art.minutesAgo;
        }
    });

    return Object.values(map).map(cluster => ({
        ...cluster,
        score: cluster.totalViews + (cluster.totalComments * 100)
    }));
}

// ===== App Initialization =====
function initApp() {
    renderTrendingKeywords();
    renderCommunityPills();
    setupEventListeners();
    startCountdownTimer();
    renderFeed();
    updateBookmarkBadge();
}

// Render Community Pills
function renderCommunityPills() {
    communityTabs.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.classList.add('community-tab');
    if (activeCommunityFilter === 'all') allBtn.classList.add('active');
    allBtn.dataset.community = 'all';
    allBtn.innerHTML = `<span class="tab-dot dot-all"></span> 전체`;
    allBtn.addEventListener('click', () => selectCommunity('all', allBtn));
    communityTabs.appendChild(allBtn);

    Object.values(COMMUNITY_CONFIG).forEach(comm => {
        if (activeSector === 'all' || comm.sector === activeSector) {
            const btn = document.createElement('button');
            btn.classList.add('community-tab');
            if (activeCommunityFilter === comm.id) btn.classList.add('active');
            btn.dataset.community = comm.id;
            btn.innerHTML = `<span class="tab-dot" style="background: ${comm.color}"></span> ${comm.name}`;
            btn.addEventListener('click', () => selectCommunity(comm.id, btn));
            communityTabs.appendChild(btn);
        }
    });
}

function selectCommunity(commId, btnEl) {
    communityTabs.querySelectorAll('.community-tab').forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');
    activeCommunityFilter = commId;
    renderFeed();
}

// ===== Timer Engine =====
function startCountdownTimer() {
    if (countdownInterval) clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
        timerSecondsRemaining--;

        if (timerSecondsRemaining <= 0) {
            triggerCommunityCrawl(true);
        } else {
            updateTimerDisplay();
        }
    }, 1000);

    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(timerSecondsRemaining / 60);
    const seconds = timerSecondsRemaining % 60;
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    countdownDisplay.textContent = formatted;

    const progressPercent = (timerSecondsRemaining / UPDATE_INTERVAL_SECONDS) * 100;
    timerProgressBar.style.width = `${progressPercent}%`;
}

function triggerCommunityCrawl(isAuto = false) {
    refreshIcon.classList.add('spinning');

    setTimeout(() => {
        timerSecondsRemaining = UPDATE_INTERVAL_SECONDS;
        lastUpdatedTimeEl.textContent = `마지막 업데이트: 방금 전`;

        refreshIcon.classList.remove('spinning');
        renderFeed();

        const message = isAuto 
            ? `🔄 [11개 커뮤니티 30분 실시간 자동 분석] 30분내 글 유사 통합 & TOP 3 갱신 완료!`
            : `✨ [11개 커뮤니티 30분 통합 완료] 최다 화제성 TOP 3 이슈로 갱신되었습니다!`;
        showToast(message);
    }, 800);
}

// ===== Render Feed: Universal 11-Community Clustering & TOP 3 Limit =====
function renderFeed() {
    let filtered = rawArticlesDatabase.filter(news => {
        const commConfig = COMMUNITY_CONFIG[news.community];
        if (!commConfig) return false;

        if (activeSector !== 'all' && commConfig.sector !== activeSector) return false;
        if (activeCommunityFilter !== 'all' && news.community !== activeCommunityFilter) return false;
        if (activeTopicFilter !== 'all' && news.topic !== activeTopicFilter) return false;

        if (searchQuery) {
            const titleMatch = news.title.toLowerCase().includes(searchQuery);
            const snippetMatch = news.snippet.toLowerCase().includes(searchQuery);
            const authorMatch = news.author.toLowerCase().includes(searchQuery);
            if (!titleMatch && !snippetMatch && !authorMatch) return false;
        }

        return true;
    });

    // 1. Cluster Similar Articles
    let clusters = createTopicClusters(filtered);

    // 2. Rank Clusters by Highest Combined Hot Score
    clusters.sort((a, b) => b.score - a.score);

    // 3. STRICTLY LIMIT OUTPUT TO TOP 3 ONLY!
    const top3Clusters = clusters.slice(0, 3);

    let filterLabel = '11개 커뮤니티 30분 유사글 통합 🏆 TOP 3 주요 이슈';
    if (activeCommunityFilter !== 'all') {
        filterLabel = `${COMMUNITY_CONFIG[activeCommunityFilter].name} 30분 통합 TOP 3`;
    } else if (activeSector !== 'all') {
        const sectorNames = { general: '💬 종합/유머 30분 통합 TOP 3', stock: '📈 주식/증시 30분 통합 TOP 3', realestate: '🏢 부동산/청약 30분 통합 TOP 3' };
        filterLabel = sectorNames[activeSector];
    }
    activeFilterNameEl.textContent = filterLabel;
    newsTotalCountEl.textContent = `🔥 화제성 랭킹 TOP ${top3Clusters.length}위 이슈 (총 ${filtered.length}개 글 통합)`;

    newsGrid.innerHTML = '';

    if (top3Clusters.length === 0) {
        newsGrid.innerHTML = `
            <div class="empty-feed">
                <span class="material-symbols-rounded">find_in_page</span>
                <p>선택하신 조건에 해당하는 30분 통합 TOP 3 뉴스가 없습니다.</p>
            </div>
        `;
        return;
    }

    top3Clusters.forEach((cluster, idx) => {
        const isBookmarked = bookmarkedIds.includes(cluster.clusterId);
        const rankMedal = idx === 0 ? '🥇 1위' : (idx === 1 ? '🥈 2위' : '🥉 3위');

        // Individual article source links inside cluster card
        const sourcesHtml = cluster.articles.map(art => {
            const comm = COMMUNITY_CONFIG[art.community];
            return `
                <a href="${art.url}" target="_blank" rel="noopener noreferrer" class="source-item-link" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; margin-top: 6px; text-decoration: none; color: #fff; transition: all 0.2s ease;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="source-community-tag" style="background: ${comm.bgColor}; color: ${comm.color}; padding: 3px 8px; border-radius: 4px; font-weight: 700; font-size: 0.78rem;">
                            ${comm.name}
                        </span>
                        <span style="font-size: 0.9rem; font-weight: 600;">${escapeHtml(art.title)}</span>
                    </div>
                    <span class="material-symbols-rounded" style="font-size: 18px; color: #38bdf8">open_in_new</span>
                </a>
            `;
        }).join('');

        const card = document.createElement('article');
        card.classList.add('news-card');
        card.style.animationDelay = `${idx * 0.05}s`;

        card.innerHTML = `
            <div class="card-header">
                <span class="cluster-badge" style="background: rgba(245, 158, 11, 0.2); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.4); padding: 5px 12px; border-radius: 20px; font-weight: 800;">
                    ${rankMedal} • 30분간 ${cluster.articles.length}개 유사글 합산 분석
                </span>
                <span class="time-ago">${cluster.minMinutesAgo}분 전 수집</span>
            </div>

            <div class="card-body" style="margin-top: 10px;">
                <h3 class="card-title" style="font-size: 1.15rem; font-weight: 800; color: #fff; line-height: 1.4;">
                    ${escapeHtml(cluster.clusterName)}
                </h3>

                <div class="cluster-metrics-bar" style="display: flex; align-items: center; gap: 20px; background: rgba(255, 255, 255, 0.05); padding: 12px 16px; border-radius: 10px; margin: 12px 0; border: 1px solid rgba(255, 255, 255, 0.1);">
                    <div class="metric-pill" style="display: flex; align-items: center; gap: 6px;">
                        <span class="material-symbols-rounded" style="color: #38bdf8">visibility</span>
                        <span style="font-size: 0.9rem; color: #cbd5e1;">합산 조회수: <strong style="color: #fff; font-size: 1.05rem;">${formatNumber(cluster.totalViews)}회</strong></span>
                    </div>
                    <div class="metric-pill" style="display: flex; align-items: center; gap: 6px;">
                        <span class="material-symbols-rounded" style="color: #f43f5e">mode_comment</span>
                        <span style="font-size: 0.9rem; color: #cbd5e1;">합산 댓글수: <strong style="color: #fff; font-size: 1.05rem;">${formatNumber(cluster.totalComments)}개</strong></span>
                    </div>
                </div>

                <div class="cluster-sources-list" style="margin-top: 14px;">
                    <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 700; margin-bottom: 8px; display: flex; align-items: center; gap: 4px;">
                        <span class="material-symbols-rounded" style="font-size: 16px; color: #f59e0b">link</span>
                        <span>30분 내 해당 통합 이슈 개별 원문 바로가기 목록 (클릭시 개별글 이동):</span>
                    </div>
                    ${sourcesHtml}
                </div>
            </div>

            <div class="card-footer" style="margin-top: 14px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.08);">
                <div class="card-stats">
                    <div class="stat-item" title="합산 추천수">
                        <span class="material-symbols-rounded">thumb_up</span>
                        <span>추천 ${formatNumber(cluster.totalUpvotes)}</span>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="action-icon-btn bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" title="북마크 저장">
                        <span class="material-symbols-rounded">${isBookmarked ? 'bookmark_added' : 'bookmark_add'}</span>
                    </button>
                </div>
            </div>
        `;

        card.querySelector('.bookmark-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleBookmark(cluster.clusterId);
        });

        newsGrid.appendChild(card);
    });
}

// ===== Bookmark Logic =====
function toggleBookmark(id) {
    if (bookmarkedIds.includes(id)) {
        bookmarkedIds = bookmarkedIds.filter(bId => bId !== id);
        showToast('북마크에서 제거되었습니다.');
    } else {
        bookmarkedIds.push(id);
        showToast('★ 북마크에 저장되었습니다.');
    }

    localStorage.setItem('cp_bookmarks', JSON.stringify(bookmarkedIds));
    updateBookmarkBadge();
    renderFeed();
}

function updateBookmarkBadge() {
    bookmarkCountEl.textContent = bookmarkedIds.length;
    drawerBookmarkCount.textContent = bookmarkedIds.length;
}

function renderBookmarkDrawer() {
    bookmarkList.innerHTML = '';
    const allClusters = createTopicClusters(rawArticlesDatabase);
    const savedClusters = allClusters.filter(c => bookmarkedIds.includes(c.clusterId));

    if (savedClusters.length === 0) {
        bookmarkList.innerHTML = `
            <div class="empty-feed">
                <span class="material-symbols-rounded">bookmark_border</span>
                <p>저장된 북마크 이슈가 없습니다.</p>
            </div>
        `;
        return;
    }

    savedClusters.forEach(cluster => {
        const item = document.createElement('div');
        item.classList.add('bookmark-item');
        item.innerHTML = `
            <div>
                <span class="cluster-badge" style="font-size: 0.75rem; padding: 2px 8px;">
                    🔥 ${cluster.articles.length}개 글 통합
                </span>
                <div style="font-weight: 700; font-size: 0.95rem; margin-top: 4px; color: #fff;">
                    ${escapeHtml(cluster.clusterName)}
                </div>
                <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">
                    합산 조회 ${formatNumber(cluster.totalViews)} | 댓글 ${formatNumber(cluster.totalComments)}
                </div>
            </div>
            <button class="action-icon-btn remove-bookmark-btn" title="삭제">
                <span class="material-symbols-rounded">delete</span>
            </button>
        `;

        item.querySelector('.remove-bookmark-btn').addEventListener('click', () => {
            toggleBookmark(cluster.clusterId);
            renderBookmarkDrawer();
        });

        bookmarkList.appendChild(item);
    });
}

// ===== Event Listeners Setup =====
function setupEventListeners() {
    manualRefreshBtn.addEventListener('click', () => {
        triggerCommunityCrawl(false);
    });

    sectorTabs.querySelectorAll('.sector-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            sectorTabs.querySelectorAll('.sector-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeSector = btn.dataset.sector;
            activeCommunityFilter = 'all';
            renderCommunityPills();
            renderFeed();
        });
    });

    topicCategories.querySelectorAll('.topic-badge').forEach(btn => {
        btn.addEventListener('click', () => {
            topicCategories.querySelectorAll('.topic-badge').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeTopicFilter = btn.dataset.topic;
            renderFeed();
        });
    });

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        if (searchQuery) {
            clearSearchBtn.classList.remove('hidden');
        } else {
            clearSearchBtn.classList.add('hidden');
        }
        renderFeed();
    });

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.classList.add('hidden');
        renderFeed();
    });

    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeSortOption = btn.dataset.sort;
            renderFeed();
        });
    });

    openBookmarkBtn.addEventListener('click', () => {
        renderBookmarkDrawer();
        bookmarkDrawerModal.classList.add('active');
    });
    closeBookmarkBtn.addEventListener('click', () => bookmarkDrawerModal.classList.remove('active'));

    window.addEventListener('click', (e) => {
        if (e.target === bookmarkDrawerModal) bookmarkDrawerModal.classList.remove('active');
    });
}

function renderTrendingKeywords() {
    trendingKeywordsEl.innerHTML = '';
    HOT_KEYWORDS.forEach(kw => {
        const chip = document.createElement('span');
        chip.classList.add('tag-chip');
        chip.textContent = `#${kw}`;
        chip.addEventListener('click', () => {
            searchInput.value = kw;
            searchQuery = kw.toLowerCase();
            clearSearchBtn.classList.remove('hidden');
            renderFeed();
        });
        trendingKeywordsEl.appendChild(chip);
    });
}

function showToast(message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.innerHTML = `
        <span class="material-symbols-rounded">notifications_active</span>
        <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function formatNumber(num) {
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + '만';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toLocaleString();
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', initApp);
