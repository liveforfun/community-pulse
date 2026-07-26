// ===== 30-Minute Multi-Sector Community News Aggregator Engine =====

// Configuration for 12 Communities across 3 Sectors
const COMMUNITY_CONFIG = {
    // Sector 1: 💬 종합/유머
    fmkorea: {
        id: 'fmkorea',
        sector: 'general',
        name: '에펨코리아',
        shortName: '펨코',
        color: 'var(--c-fmkorea)',
        bgColor: 'var(--c-fmkorea-bg)',
        url: 'https://www.fmkorea.com'
    },
    ruliweb: {
        id: 'ruliweb',
        sector: 'general',
        name: '루리웹',
        shortName: '루리웹',
        color: 'var(--c-ruliweb)',
        bgColor: 'var(--c-ruliweb-bg)',
        url: 'https://bbs.ruliweb.com'
    },
    theqoo: {
        id: 'theqoo',
        sector: 'general',
        name: '더쿠',
        shortName: '더쿠',
        color: 'var(--c-theqoo)',
        bgColor: 'var(--c-theqoo-bg)',
        url: 'https://theqoo.net'
    },
    instiz: {
        id: 'instiz',
        sector: 'general',
        name: '인스티즈',
        shortName: '인티',
        color: 'var(--c-instiz)',
        bgColor: 'var(--c-instiz-bg)',
        url: 'https://www.instiz.net'
    },

    // Sector 2: 📈 주식/증시
    naver_stock: {
        id: 'naver_stock',
        sector: 'stock',
        name: '네이버 종토방',
        shortName: '종토방',
        color: 'var(--c-naver-stock)',
        bgColor: 'var(--c-naver-stock-bg)',
        url: 'https://finance.naver.com'
    },
    dc_stock: {
        id: 'dc_stock',
        sector: 'stock',
        name: '디시 미주갤/주갤',
        shortName: '미주갤',
        color: 'var(--c-dc-stock)',
        bgColor: 'var(--c-dc-stock-bg)',
        url: 'https://gall.dcinside.com/mgallery/board/lists/?id=stockus'
    },
    blind: {
        id: 'blind',
        sector: 'stock',
        name: '블라인드 주식·투자',
        shortName: '블라인드',
        color: 'var(--c-blind)',
        bgColor: 'var(--c-blind-bg)',
        url: 'https://www.teamblind.com/kr'
    },
    toss_stock: {
        id: 'toss_stock',
        sector: 'stock',
        name: '토스/증권플러스',
        shortName: '토스증권',
        color: 'var(--c-toss-stock)',
        bgColor: 'var(--c-toss-stock-bg)',
        url: 'https://tossinvest.com'
    },

    // Sector 3: 🏢 부동산/청약
    naver_boos: {
        id: 'naver_boos',
        sector: 'realestate',
        name: '부동산 스터디',
        shortName: '부스',
        color: 'var(--c-naver-boos)',
        bgColor: 'var(--c-naver-boos-bg)',
        url: 'https://cafe.naver.com/jaeup'
    },
    weolbu: {
        id: 'weolbu',
        sector: 'realestate',
        name: '월급쟁이부자들',
        shortName: '월부',
        color: 'var(--c-weolbu)',
        bgColor: 'var(--c-weolbu-bg)',
        url: 'https://cafe.naver.com/weolbu'
    },
    hogangnono: {
        id: 'hogangnono',
        sector: 'realestate',
        name: '호갱노노 / 아실',
        shortName: '호갱노노',
        color: 'var(--c-hogangnono)',
        bgColor: 'var(--c-hogangnono-bg)',
        url: 'https://hogangnono.com'
    },
    dc_realestate: {
        id: 'dc_realestate',
        sector: 'realestate',
        name: '디시 부동산 갤러리',
        shortName: '부갤',
        color: 'var(--c-dc-realestate)',
        bgColor: 'var(--c-dc-realestate-bg)',
        url: 'https://gall.dcinside.com/board/lists/?id=immovable'
    }
};

// Expanded Seed Articles Database (12 Communities)
const SEED_NEWS_DATABASE = [
    // 📈 주식/증시
    {
        id: 'stock-1',
        community: 'naver_stock',
        title: '[삼성전자 종토방] 외국인 기습 매수세 유입... 반도체 반등 신호탄일까?',
        snippet: '오늘 장중 외인 선물 및 현물 순매수 1위 기록. 반도체 업황 회복 기대감으로 종토방 주주들 사이에서 열띤 토론이 이어지는 중입니다.',
        topic: 'stock',
        author: '삼전존버',
        minutesAgo: 2,
        views: 54100,
        upvotes: 2100,
        comments: 1420,
        url: 'https://finance.naver.com/item/board.naver?code=005930',
        isHot: true
    },
    {
        id: 'stock-2',
        community: 'dc_stock',
        title: '[미주갤 핫글] 엔비디아 실적 발표 앞두고 서학개미들 매수 현황 정리.jpg',
        snippet: '실적 발표 전 옵션 변동성 대폭 상승. 미주갤러들 사이에서 타점 및 거품 여부에 관한 찬반 논쟁이 실시간으로 매섭게 오가는 중.',
        topic: 'stock',
        author: '엔비디아주주',
        minutesAgo: 7,
        views: 38200,
        upvotes: 1450,
        comments: 890,
        url: 'https://gall.dcinside.com/mgallery/board/lists/?id=stockus',
        isHot: true
    },
    {
        id: 'stock-3',
        community: 'blind',
        title: '[블라인드] 현직 반도체 엔지니어가 말하는 3나노 공정 실제 체감 분기점',
        snippet: '대기업 반도체 라인 재직자 인증글. 수율 안정화 속도와 고객사 납품 일정에 대한 현장의 솔직한 시각 공유.',
        topic: 'stock',
        author: '삼성전자·엔지니어',
        minutesAgo: 14,
        views: 29800,
        upvotes: 1120,
        comments: 340,
        url: 'https://www.teamblind.com/kr',
        isHot: true
    },
    {
        id: 'stock-4',
        community: 'toss_stock',
        title: '[토스 실주주 인증] 미주 수익률 +140% 찍은 주린이의 1년 분할매수 기록',
        snippet: '토스증권 주주 인증 마크 달고 올라온 가치투자 솔직 후기. 매달 일정 금액씩 모아간 종목 리스트와 마인드 컨트롤 팁.',
        topic: 'stock',
        author: '수익률100프로가자',
        minutesAgo: 19,
        views: 22400,
        upvotes: 980,
        comments: 260,
        url: 'https://tossinvest.com',
        isHot: false
    },

    // 🏢 부동산/청약
    {
        id: 're-1',
        community: 'naver_boos',
        title: '[부동산 스터디] 이번 주 서울 주요 상급지 청약 경쟁률 분석 및 가점 컷 예측',
        snippet: '강남/마용성 분양가 상한제 단지 청약 접수 완료. 예상 당첨 가점 컷과 실거주 의무, 세금 이슈 종합 분석 리포트입니다.',
        topic: 'realestate',
        author: '부동산고수',
        minutesAgo: 5,
        views: 48900,
        upvotes: 1890,
        comments: 920,
        url: 'https://cafe.naver.com/jaeup',
        isHot: true
    },
    {
        id: 're-2',
        community: 'weolbu',
        title: '[월부 임장기] 수도권 신분당선 역세권 신축 아파트 직접 발로 뛴 현장 보고서',
        snippet: '주말 동안 진행한 현장 답사. 학군, 상권, 동간 거리, 실거주 입주민 인터뷰까지 포함된 체계적인 분석 자료.',
        topic: 'realestate',
        author: '임장발자국',
        minutesAgo: 12,
        views: 31200,
        upvotes: 1350,
        comments: 410,
        url: 'https://cafe.naver.com/weolbu',
        isHot: true
    },
    {
        id: 're-3',
        community: 'hogangnono',
        title: '[호갱노노 아파트 리뷰] 마포 신축 거주 2년 차가 남기는 솔직한 찐 장단점',
        snippet: '실제 입주민 인증 후기. 층간소음, 커뮤니티 시설 관리 상태, 출퇴근 지하철 혼잡도까지 거품 없이 적은 리뷰.',
        topic: 'realestate',
        author: '마포입주민',
        minutesAgo: 21,
        views: 26500,
        upvotes: 940,
        comments: 530,
        url: 'https://hogangnono.com',
        isHot: false
    },
    {
        id: 're-4',
        community: 'dc_realestate',
        title: '[부갤 매운맛] 올해 아파트 매매 실거래가 추이로 본 매수 타이밍 솔직 토론',
        snippet: '금리와 집값 상승/하락론자들의 직설적인 가감 없는 대립 토론. 최신 거래 데이터 기반 매운맛 분석.',
        topic: 'realestate',
        author: '부갤러',
        minutesAgo: 31,
        views: 34000,
        upvotes: 1050,
        comments: 780,
        url: 'https://gall.dcinside.com/board/lists/?id=immovable',
        isHot: true
    },

    // 💬 종합/유머
    {
        id: 'gen-1',
        community: 'fmkorea',
        title: '[오피셜] 손흥민, 시즌 15호골 달성 후 현지 매체 평점 1위 극찬',
        snippet: '오늘 새벽 경기에서 환상적인 궤적의 슛으로 선제골을 기록했습니다. 득점 직후 현지 축구 전문가들의 찬사가 이어지고 있습니다.',
        topic: 'sports',
        author: '축구전문가',
        minutesAgo: 4,
        views: 42100,
        upvotes: 1820,
        comments: 482,
        url: 'https://www.fmkorea.com/best/1001',
        isHot: true
    },
    {
        id: 'gen-2',
        community: 'ruliweb',
        title: '신작 대작 RPG 게임 공식 한국어판 출시일 및 플레이 영상 공개',
        snippet: '유저들의 기대를 한 몸에 받고 있는 신작 RPG의 개발사 개발자 대담 영상과 함께 4K 게임플레이 트레일러가 기습 발표되었습니다.',
        topic: 'game',
        author: '게이머A',
        minutesAgo: 11,
        views: 28900,
        upvotes: 950,
        comments: 215,
        url: 'https://bbs.ruliweb.com/news/1002',
        isHot: true
    },
    {
        id: 'gen-3',
        community: 'theqoo',
        title: '오늘 자 빌보드 차트 1위 기록한 인기 걸그룹 신곡 반응 요약.txt',
        snippet: '해외 음악 평론가들과 국내 음악 커뮤니티에서 대호평을 받고 있는 신곡의 음원 성적과 수록곡 무대 모음입니다.',
        topic: 'entertainment',
        author: 'KPOP러버',
        minutesAgo: 15,
        views: 35400,
        upvotes: 1200,
        comments: 630,
        url: 'https://theqoo.net/square/1003',
        isHot: true
    },
    {
        id: 'gen-4',
        community: 'instiz',
        title: '요즘 SNS에서 난리 난 가성비 미니멀 홈 인테리어 & 꿀템 조합',
        snippet: '자취생과 원룸족 사이에서 입소문 타고 있는 감성 조명과 인테리어 소품 정리 모음집입니다.',
        topic: 'entertainment',
        author: '일상러버',
        minutesAgo: 22,
        views: 18700,
        upvotes: 620,
        comments: 189,
        url: 'https://www.instiz.net/pt/1004',
        isHot: false
    }
];

// App State
let newsDatabase = [...SEED_NEWS_DATABASE];
let activeSector = 'all'; // 'all', 'general', 'stock', 'realestate'
let activeCommunityFilter = 'all';
let activeTopicFilter = 'all';
let activeSortOption = 'latest';
let searchQuery = '';
let bookmarkedIds = JSON.parse(localStorage.getItem('cp_bookmarks') || '[]');

// Timer State (30 minutes = 1800 seconds)
const UPDATE_INTERVAL_SECONDS = 1800; // 30분
let timerSecondsRemaining = UPDATE_INTERVAL_SECONDS;
let countdownInterval = null;
let lastUpdatedTimestamp = new Date();

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

// Modal Elements
const newsDetailModal = document.getElementById('newsDetailModal');
const closeDetailModalBtn = document.getElementById('closeDetailModalBtn');
const modalCommunityBadge = document.getElementById('modalCommunityBadge');
const modalTitle = document.getElementById('modalTitle');
const modalMeta = document.getElementById('modalMeta');
const modalSummary = document.getElementById('modalSummary');
const modalStats = document.getElementById('modalStats');
const modalBookmarkBtn = document.getElementById('modalBookmarkBtn');
const modalOriginalLink = document.getElementById('modalOriginalLink');

// Bookmark Drawer Elements
const bookmarkDrawerModal = document.getElementById('bookmarkDrawerModal');
const openBookmarkBtn = document.getElementById('openBookmarkBtn');
const closeBookmarkBtn = document.getElementById('closeBookmarkBtn');
const bookmarkList = document.getElementById('bookmarkList');
const drawerBookmarkCount = document.getElementById('drawerBookmarkCount');

// Trending Hot Keywords List (Stock + Real Estate + General)
const HOT_KEYWORDS = [
    '미국주식', '엔비디아', '삼성전자 종토방', '부동산스터디', '아파트청약', '호갱노노 리뷰', '손흥민', '펨코 핫게', '월부 임장기'
];

// ===== App Initialization =====
function initApp() {
    renderTrendingKeywords();
    renderCommunityPills();
    setupEventListeners();
    startCountdownTimer();
    renderFeed();
    updateBookmarkBadge();
}

// Render Community Pills based on Active Sector
function renderCommunityPills() {
    communityTabs.innerHTML = '';

    // '전체' Button
    const allBtn = document.createElement('button');
    allBtn.classList.add('community-tab');
    if (activeCommunityFilter === 'all') allBtn.classList.add('active');
    allBtn.dataset.community = 'all';
    allBtn.innerHTML = `<span class="tab-dot dot-all"></span> 전체`;
    allBtn.addEventListener('click', () => selectCommunity('all', allBtn));
    communityTabs.appendChild(allBtn);

    // Filter available communities by sector
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

// ===== Timer & Multi-Sector Crawler Simulator =====
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
        const newArticles = generateFreshCrawledNews();
        newsDatabase = [...newArticles, ...newsDatabase];

        timerSecondsRemaining = UPDATE_INTERVAL_SECONDS;
        lastUpdatedTimestamp = new Date();
        lastUpdatedTimeEl.textContent = `마지막 업데이트: 방금 전`;

        refreshIcon.classList.remove('spinning');
        renderFeed();

        const message = isAuto 
            ? `🔄 [30분 자동 수집] 12개 커뮤니티 신규 뉴스 ${newArticles.length}건이 업데이트되었습니다!`
            : `✨ [수동 수집 완료] 커뮤니티 최신 뉴스가 즉시 갱신되었습니다!`;
        showToast(message);
    }, 800);
}

function generateFreshCrawledNews() {
    const freshTemplates = [
        // 주식
        {
            community: 'naver_stock',
            title: '[실시간 종토방] 나스닥 선물 급등 반응... 국내 증시 수혜 종목 집중 분석',
            snippet: '외국인 대량 매수세 유입과 함께 나스닥 관련주 및 증시 훈풍에 대한 주주들의 기대평 모음.',
            topic: 'stock',
            author: '주식왕',
            views: Math.floor(Math.random() * 15000) + 20000,
            upvotes: Math.floor(Math.random() * 800) + 500,
            comments: Math.floor(Math.random() * 400) + 200,
            url: 'https://finance.naver.com'
        },
        {
            community: 'dc_stock',
            title: '[미주갤 30분 핫글] 빅테크 어닝 서프라이즈 후 시간외 거래 급등 현황',
            snippet: '미국 빅테크 기업들의 실적 호조에 서학개미들이 열광 중. 실시간 차트 분석 및 개미들 반응.',
            topic: 'stock',
            author: '미주개미',
            views: Math.floor(Math.random() * 12000) + 15000,
            upvotes: Math.floor(Math.random() * 600) + 400,
            comments: Math.floor(Math.random() * 300) + 150,
            url: 'https://gall.dcinside.com/mgallery/board/lists/?id=stockus'
        },
        // 부동산
        {
            community: 'naver_boos',
            title: '[부동산 스터디] 서울 핵심 재건축 조합원 분양가 및 사업성 최신 분석',
            snippet: '금리 변화에 따른 분양가 상한제 유불리 및 재건축 프리미엄에 대한 분석 보고서.',
            topic: 'realestate',
            author: '재건축전문가',
            views: Math.floor(Math.random() * 18000) + 22000,
            upvotes: Math.floor(Math.random() * 900) + 600,
            comments: Math.floor(Math.random() * 350) + 180,
            url: 'https://cafe.naver.com/jaeup'
        },
        {
            community: 'hogangnono',
            title: '[호갱노노 리뷰] 판교/분당 역세권 대장 아파트 실거주 후기 & 주차/학군',
            snippet: '실제 입주민들이 작성한 단지 내 커뮤니티 시설 및 주변 초등학교 학군 평가.',
            topic: 'realestate',
            author: '판교입주민',
            views: Math.floor(Math.random() * 10000) + 12000,
            upvotes: Math.floor(Math.random() * 500) + 300,
            comments: Math.floor(Math.random() * 200) + 100,
            url: 'https://hogangnono.com'
        }
    ];

    return freshTemplates.map((item, index) => ({
        id: `news-crawled-${Date.now()}-${index}`,
        ...item,
        minutesAgo: Math.floor(Math.random() * 5) + 1,
        isHot: true
    }));
}

// ===== Rendering Functions =====
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

function renderFeed() {
    let filtered = newsDatabase.filter(news => {
        const commConfig = COMMUNITY_CONFIG[news.community];

        // Sector Filter
        if (activeSector !== 'all' && commConfig.sector !== activeSector) {
            return false;
        }

        // Community Filter
        if (activeCommunityFilter !== 'all' && news.community !== activeCommunityFilter) {
            return false;
        }

        // Topic Filter
        if (activeTopicFilter === 'hot' && !news.isHot) return false;
        if (activeTopicFilter !== 'all' && activeTopicFilter !== 'hot' && news.topic !== activeTopicFilter) {
            return false;
        }

        // Search Filter
        if (searchQuery) {
            const titleMatch = news.title.toLowerCase().includes(searchQuery);
            const snippetMatch = news.snippet.toLowerCase().includes(searchQuery);
            const authorMatch = news.author.toLowerCase().includes(searchQuery);
            if (!titleMatch && !snippetMatch && !authorMatch) return false;
        }

        return true;
    });

    // Sorting
    if (activeSortOption === 'latest') {
        filtered.sort((a, b) => a.minutesAgo - b.minutesAgo);
    } else if (activeSortOption === 'hot') {
        filtered.sort((a, b) => (b.views + b.upvotes * 10) - (a.views + a.upvotes * 10));
    }

    // Header Summary Text
    let filterLabel = '전체 커뮤니티';
    if (activeCommunityFilter !== 'all') {
        filterLabel = COMMUNITY_CONFIG[activeCommunityFilter].name;
    } else if (activeSector !== 'all') {
        const sectorNames = { general: '💬 종합/유머 커뮤니티', stock: '📈 주식/증시 커뮤니티', realestate: '🏢 부동산/청약 커뮤니티' };
        filterLabel = sectorNames[activeSector];
    }
    activeFilterNameEl.textContent = filterLabel;
    newsTotalCountEl.textContent = `${filtered.length}개 게시글`;

    // Render Grid
    newsGrid.innerHTML = '';

    if (filtered.length === 0) {
        newsGrid.innerHTML = `
            <div class="empty-feed">
                <span class="material-symbols-rounded">find_in_page</span>
                <p>선택하신 조건에 해당하는 뉴스가 없습니다.</p>
            </div>
        `;
        return;
    }

    filtered.forEach((news, idx) => {
        const config = COMMUNITY_CONFIG[news.community];
        const isBookmarked = bookmarkedIds.includes(news.id);

        const card = document.createElement('article');
        card.classList.add('news-card');
        card.style.style = `--card-brand-color: ${config.color}`;
        card.style.animationDelay = `${idx * 0.03}s`;

        card.innerHTML = `
            <div class="card-header">
                <span class="community-badge" style="--badge-color: ${config.color}; --badge-bg: ${config.bgColor}">
                    ${config.name}
                </span>
                <span class="time-ago">${news.minutesAgo}분 전</span>
            </div>
            <div class="card-body">
                <h3 class="card-title">${escapeHtml(news.title)}</h3>
                <p class="card-snippet">${escapeHtml(news.snippet)}</p>
            </div>
            <div class="card-footer">
                <div class="card-stats">
                    <div class="stat-item" title="조회수">
                        <span class="material-symbols-rounded">visibility</span>
                        <span>${formatNumber(news.views)}</span>
                    </div>
                    <div class="stat-item" title="추천수">
                        <span class="material-symbols-rounded">thumb_up</span>
                        <span>${formatNumber(news.upvotes)}</span>
                    </div>
                    <div class="stat-item" title="댓글수">
                        <span class="material-symbols-rounded">mode_comment</span>
                        <span>${formatNumber(news.comments)}</span>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="action-icon-btn bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" title="북마크">
                        <span class="material-symbols-rounded">${isBookmarked ? 'bookmark_added' : 'bookmark_add'}</span>
                    </button>
                    <a href="${news.url}" target="_blank" rel="noopener noreferrer" class="action-icon-btn" title="원문 보기">
                        <span class="material-symbols-rounded">open_in_new</span>
                    </a>
                </div>
            </div>
        `;

        card.querySelector('.card-title').addEventListener('click', () => openDetailModal(news));
        card.querySelector('.bookmark-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleBookmark(news.id);
        });

        newsGrid.appendChild(card);
    });
}

// ===== Detail Modal Logic =====
let currentSelectedNews = null;

function openDetailModal(news) {
    currentSelectedNews = news;
    const config = COMMUNITY_CONFIG[news.community];
    const isBookmarked = bookmarkedIds.includes(news.id);

    modalCommunityBadge.textContent = config.name;
    modalCommunityBadge.style.backgroundColor = config.bgColor;
    modalCommunityBadge.style.color = config.color;

    modalTitle.textContent = news.title;
    modalSummary.textContent = news.snippet;

    modalMeta.innerHTML = `
        <span>작성자: ${news.author}</span> •
        <span>수집 시간: ${news.minutesAgo}분 전</span>
    `;

    modalStats.innerHTML = `
        <div class="stat-item"><span class="material-symbols-rounded">visibility</span> 조회 ${formatNumber(news.views)}</div>
        <div class="stat-item"><span class="material-symbols-rounded">thumb_up</span> 추천 ${formatNumber(news.upvotes)}</div>
        <div class="stat-item"><span class="material-symbols-rounded">mode_comment</span> 댓글 ${formatNumber(news.comments)}</div>
    `;

    modalOriginalLink.href = news.url;
    updateModalBookmarkBtn(isBookmarked);

    newsDetailModal.classList.add('active');
}

function updateModalBookmarkBtn(isBookmarked) {
    if (isBookmarked) {
        modalBookmarkBtn.innerHTML = `
            <span class="material-symbols-rounded" style="color: #f59e0b">bookmark_added</span>
            <span>북마크 해제</span>
        `;
    } else {
        modalBookmarkBtn.innerHTML = `
            <span class="material-symbols-rounded">bookmark_add</span>
            <span>북마크 저장</span>
        `;
    }
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

    if (currentSelectedNews && currentSelectedNews.id === id) {
        updateModalBookmarkBtn(bookmarkedIds.includes(id));
    }
}

function updateBookmarkBadge() {
    bookmarkCountEl.textContent = bookmarkedIds.length;
    drawerBookmarkCount.textContent = bookmarkedIds.length;
}

function renderBookmarkDrawer() {
    bookmarkList.innerHTML = '';
    const savedNews = newsDatabase.filter(n => bookmarkedIds.includes(n.id));

    if (savedNews.length === 0) {
        bookmarkList.innerHTML = `
            <div class="empty-feed">
                <span class="material-symbols-rounded">bookmark_border</span>
                <p>저장된 북마크 뉴스가 없습니다.</p>
            </div>
        `;
        return;
    }

    savedNews.forEach(news => {
        const config = COMMUNITY_CONFIG[news.community];
        const item = document.createElement('div');
        item.classList.add('bookmark-item');
        item.innerHTML = `
            <span class="community-badge" style="--badge-color: ${config.color}; --badge-bg: ${config.bgColor}">
                ${config.name}
            </span>
            <a href="${news.url}" target="_blank" rel="noopener noreferrer" class="bookmark-item-title">
                ${escapeHtml(news.title)}
            </a>
            <button class="action-icon-btn remove-bookmark-btn" title="삭제">
                <span class="material-symbols-rounded">delete</span>
            </button>
        `;

        item.querySelector('.remove-bookmark-btn').addEventListener('click', () => {
            toggleBookmark(news.id);
            renderBookmarkDrawer();
        });

        bookmarkList.appendChild(item);
    });
}

// ===== Event Listeners Setup =====
function setupEventListeners() {
    // Manual Crawl Refresh
    manualRefreshBtn.addEventListener('click', () => {
        triggerCommunityCrawl(false);
    });

    // Sector Tabs (Large Main Categories)
    sectorTabs.querySelectorAll('.sector-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            sectorTabs.querySelectorAll('.sector-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeSector = btn.dataset.sector;
            activeCommunityFilter = 'all'; // Reset community pill selection
            renderCommunityPills();
            renderFeed();
        });
    });

    // Topic Category Badges
    topicCategories.querySelectorAll('.topic-badge').forEach(btn => {
        btn.addEventListener('click', () => {
            topicCategories.querySelectorAll('.topic-badge').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeTopicFilter = btn.dataset.topic;
            renderFeed();
        });
    });

    // Search Input
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

    // Sort Options
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeSortOption = btn.dataset.sort;
            renderFeed();
        });
    });

    // Modals
    closeDetailModalBtn.addEventListener('click', () => newsDetailModal.classList.remove('active'));
    modalBookmarkBtn.addEventListener('click', () => {
        if (currentSelectedNews) toggleBookmark(currentSelectedNews.id);
    });

    // Bookmarks Drawer
    openBookmarkBtn.addEventListener('click', () => {
        renderBookmarkDrawer();
        bookmarkDrawerModal.classList.add('active');
    });
    closeBookmarkBtn.addEventListener('click', () => bookmarkDrawerModal.classList.remove('active'));

    // Close Modals on Overlay Click
    window.addEventListener('click', (e) => {
        if (e.target === newsDetailModal) newsDetailModal.classList.remove('active');
        if (e.target === bookmarkDrawerModal) bookmarkDrawerModal.classList.remove('active');
    });
}

// ===== Utility Functions =====
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

// Initialize on Load
document.addEventListener('DOMContentLoaded', initApp);
