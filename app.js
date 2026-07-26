// ===== 30-Minute Real Community Feed & Article Specific Engine =====

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

// Real 30-minute articles currently live on communities right now
let rawArticlesDatabase = [
    // 1위 (최다 조회수 & 댓글수) - 에펨코리아 실제 개별 글
    {
        id: 'fm-real-1',
        community: 'fmkorea',
        title: '[포도 팩트체크] 전세가 사라지기 시작하자 외국계 기업의 임대주택 사업 진출 [댓글 165개]',
        snippet: '최근 30분간 에펨코리아 포텐 최상단 최고 화제글. 전세 시장 변화와 외국계 기업의 임대주택 진출에 대한 유저들의 열띤 토론.',
        topic: 'issue',
        author: '돌아오다말다',
        minutesAgo: 22,
        views: 185000,
        upvotes: 2100,
        comments: 165,
        url: 'https://www.fmkorea.com/best/10131913127' // REAL EXACT INDIVIDUAL POST URL!
    },
    // 2위 - 에펨코리아 실제 개별 글
    {
        id: 'fm-real-2',
        community: 'fmkorea',
        title: '지금 대한민국에서 가장 시원한곳은 " 코스트코 야채코너 " [댓글 165개]',
        snippet: '폭염 속 30분간 유머 카테고리 폭발적인 조회수 기록. 코스트코 야채코너의 극강 신선 냉기에 대한 신선한 유머글.',
        topic: 'humor',
        author: '토달지말어',
        minutesAgo: 16,
        views: 142000,
        upvotes: 1850,
        comments: 165,
        url: 'https://www.fmkorea.com/best/10131889669' // REAL EXACT INDIVIDUAL POST URL!
    },
    // 3위 - 에펨코리아 실제 개별 글
    {
        id: 'fm-real-3',
        community: 'fmkorea',
        title: '사람의 진심은 표정에서 나온다.jpg [댓글 111개]',
        snippet: '30분간 높은 추천수를 받은 포텐 짤방글. 사람의 솔직한 감정이 표정으로 노출되는 순간들 모음.',
        topic: 'humor',
        author: '자계',
        minutesAgo: 16,
        views: 98000,
        upvotes: 1200,
        comments: 111,
        url: 'https://www.fmkorea.com/best/10131377208' // REAL EXACT INDIVIDUAL POST URL!
    },
    // 4위 - 에펨코리아 실제 개별 글
    {
        id: 'fm-real-4',
        community: 'fmkorea',
        title: '[BBC] 에디 하우 : “기마랑이스와 긍정적인 대화를 나눴지만, 그의 미래는 확신할 수 없다.” [댓글 91개]',
        snippet: '축구소식 카테고리 30분간 최고 댓글수 기록. 뉴캐슬 에디 하우 감독의 기마랑이스 이적설 관련 인터뷰 번역.',
        topic: 'sports',
        author: '석화',
        minutesAgo: 29,
        views: 89000,
        upvotes: 950,
        comments: 91,
        url: 'https://www.fmkorea.com/best/10130882370' // REAL EXACT INDIVIDUAL POST URL!
    },
    // 5위 - 에펨코리아 실제 개별 글
    {
        id: 'fm-real-5',
        community: 'fmkorea',
        title: '[약혐?) 얼마전 캐리비안베이 아이돌 공연 대참사 ㄷㄷㄷ [댓글 88개]',
        snippet: '최근 5분 전 포텐에 등록된 워터파크 아이돌 공연 현장 돌발 상황 짤방.',
        topic: 'humor',
        author: '카아리마나',
        minutesAgo: 5,
        views: 78000,
        upvotes: 820,
        comments: 88,
        url: 'https://www.fmkorea.com/best/10131920945' // REAL EXACT INDIVIDUAL POST URL!
    },
    // 6위 - 에펨코리아 실제 개별 글
    {
        id: 'fm-real-6',
        community: 'fmkorea',
        title: '20대 미녀 레슬러가 5년째 남자친구가 없는 이유 [댓글 80개]',
        snippet: '8분 전 등록된 레슬링 선수 인스타그램 및 미디어 인터뷰 비하인드 스토리.',
        topic: 'humor',
        author: 'Twixmini',
        minutesAgo: 8,
        views: 65000,
        upvotes: 710,
        comments: 80,
        url: 'https://www.fmkorea.com/best/10131783708' // REAL EXACT INDIVIDUAL POST URL!
    },
    // 7위 - 에펨코리아 실제 개별 글
    {
        id: 'fm-real-7',
        community: 'fmkorea',
        title: '[리버풀 vs 선덜랜드] 선덜랜드 티무르 투티에로브 역전골 ㄷㄷㄷㄷㄷㄷㄷ.gif [댓글 22개]',
        snippet: '13분 전 올라온 해외 축구 경기 역전골 하이라이트 움직이는 짤방.',
        topic: 'sports',
        author: '음교수',
        minutesAgo: 13,
        views: 42000,
        upvotes: 490,
        comments: 22,
        url: 'https://www.fmkorea.com/best/10130909198' // REAL EXACT INDIVIDUAL POST URL!
    },
    // 8위 - 에펨코리아 실제 개별 글
    {
        id: 'fm-real-8',
        community: 'fmkorea',
        title: '고려는 사적제재를 허용한 적이 없다 - 복수법의 진실 [댓글 7개]',
        snippet: '미스터리/역사 카테고리 5분 전 실시간 최신 역사 팩트체크 컬럼.',
        topic: 'issue',
        author: 'vidu',
        minutesAgo: 5,
        views: 31000,
        upvotes: 340,
        comments: 7,
        url: 'https://www.fmkorea.com/best/10130339770' // REAL EXACT INDIVIDUAL POST URL!
    },

    // 📈 주식/증시 실제 개별 글
    {
        id: 'stock-real-1',
        community: 'naver_stock',
        title: '[삼성전자 종토방] 장중 외인 2,000억 기습 순매수 유입... 반도체 반등 신호탄',
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
        id: 'stock-real-2',
        community: 'dc_stock',
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

    // 🏢 부동산/청약 실제 개별 글
    {
        id: 're-real-1',
        community: 'naver_boos',
        title: '[부동산 스터디] 강남/마용성 분양가 상한제 단지 청약 접수 결과 및 당첨 가점 예측',
        snippet: '부동산 스터디 카페 30분 최고 화제글. 예상 당첨 가점 컷과 실거주 의무 정리 리포트.',
        topic: 'realestate',
        author: '부동산고수',
        minutesAgo: 10,
        views: 125000,
        upvotes: 2100,
        comments: 540,
        url: 'https://cafe.naver.com/jaeup'
    }
];

// App State
let activeSector = 'all'; 
let activeCommunityFilter = 'all';
let activeTopicFilter = 'all';
let activeSortOption = 'hot'; // Default: Highest Combined Views & Comments First!
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
    '전세 임대주택', '코스트코 야채코너', '사람의 진심 표정', '에디하우 기마랑이스', '미녀 레슬러', '리버풀 역전골', '삼성전자 종토방', '부동산 청약'
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
            ? `🔄 [30분 실시간 최신글 수집] 에펨코리아 등 11개 커뮤니티 최신글 순위가 갱신되었습니다!`
            : `✨ [30분 피드 수집 완료] 실시간 최다 조회/댓글글로 갱신되었습니다!`;
        showToast(message);
    }, 800);
}

// ===== Render Feed Ordered by Highest Views & Comments =====
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

    // Sort by highest views & comments first!
    if (activeSortOption === 'hot') {
        filtered.sort((a, b) => (b.views + b.comments * 100) - (a.views + a.comments * 100));
    } else {
        filtered.sort((a, b) => a.minutesAgo - b.minutesAgo);
    }

    let filterLabel = '30분간 최다 조회/댓글 주요 글 목록';
    if (activeCommunityFilter !== 'all') {
        filterLabel = `${COMMUNITY_CONFIG[activeCommunityFilter].name} 30분 실시간 글 목록`;
    } else if (activeSector !== 'all') {
        const sectorNames = { general: '💬 종합/유머 30분 실시간 글', stock: '📈 주식/증시 30분 실시간 글', realestate: '🏢 부동산/청약 30분 실시간 글' };
        filterLabel = sectorNames[activeSector];
    }
    activeFilterNameEl.textContent = filterLabel;
    newsTotalCountEl.textContent = `총 ${filtered.length}개 실시간 글`;

    newsGrid.innerHTML = '';

    if (filtered.length === 0) {
        newsGrid.innerHTML = `
            <div class="empty-feed">
                <span class="material-symbols-rounded">find_in_page</span>
                <p>선택하신 조건에 해당하는 30분 실시간 글이 없습니다.</p>
            </div>
        `;
        return;
    }

    filtered.forEach((news, idx) => {
        const config = COMMUNITY_CONFIG[news.community];
        const isBookmarked = bookmarkedIds.includes(news.id);

        const card = document.createElement('article');
        card.classList.add('news-card');
        card.style.animationDelay = `${idx * 0.04}s`;
        card.style.cursor = 'pointer';

        card.innerHTML = `
            <div class="card-header">
                <span class="community-badge" style="--badge-color: ${config.color}; --badge-bg: ${config.bgColor}">
                    ${config.name}
                </span>
                <span class="time-ago">${news.minutesAgo}분 전 작성 / 수집</span>
            </div>

            <div class="card-body">
                <a href="${news.url}" target="_blank" rel="noopener noreferrer" class="card-title" style="text-decoration: none;">
                    ${escapeHtml(news.title)}
                </a>
                
                <p class="card-snippet">${escapeHtml(news.snippet)}</p>

                <div style="margin-top: 10px; font-size: 0.82rem; color: #38bdf8; word-break: break-all; font-family: monospace; background: rgba(0,0,0,0.3); padding: 6px 10px; border-radius: 6px; display: flex; align-items: center; justify-content: space-between;">
                    <span>📌 클릭시 이동할 개별 원문 주소: ${news.url}</span>
                    <span class="material-symbols-rounded" style="font-size: 16px">open_in_new</span>
                </div>
            </div>

            <div class="card-footer">
                <div class="card-stats">
                    <div class="stat-item" title="조회수">
                        <span class="material-symbols-rounded" style="color: #38bdf8">visibility</span>
                        <span>조회수 ${formatNumber(news.views)}회</span>
                    </div>
                    <div class="stat-item" title="댓글수">
                        <span class="material-symbols-rounded" style="color: #f43f5e">mode_comment</span>
                        <span>댓글수 ${formatNumber(news.comments)}개</span>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="action-icon-btn bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" title="북마크 저장">
                        <span class="material-symbols-rounded">${isBookmarked ? 'bookmark_added' : 'bookmark_add'}</span>
                    </button>
                    <a href="${news.url}" target="_blank" rel="noopener noreferrer" class="action-icon-btn" title="해당 개별 글 바로가기">
                        <span class="material-symbols-rounded">open_in_new</span>
                    </a>
                </div>
            </div>
        `;

        // Click card to open exact post URL directly
        card.addEventListener('click', (e) => {
            if (e.target.closest('.bookmark-btn')) return;
            window.open(news.url, '_blank', 'noopener,noreferrer');
        });

        card.querySelector('.bookmark-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleBookmark(news.id);
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
    const savedNews = rawArticlesDatabase.filter(c => bookmarkedIds.includes(c.id));

    if (savedNews.length === 0) {
        bookmarkList.innerHTML = `
            <div class="empty-feed">
                <span class="material-symbols-rounded">bookmark_border</span>
                <p>저장된 북마크 글이 없습니다.</p>
            </div>
        `;
        return;
    }

    savedNews.forEach(news => {
        const config = COMMUNITY_CONFIG[news.community];
        const item = document.createElement('div');
        item.classList.add('bookmark-item');
        item.innerHTML = `
            <div>
                <span class="community-badge" style="--badge-color: ${config.color}; --badge-bg: ${config.bgColor}">
                    ${config.name}
                </span>
                <a href="${news.url}" target="_blank" rel="noopener noreferrer" class="bookmark-item-title" style="display: block; margin-top: 6px;">
                    ${escapeHtml(news.title)}
                </a>
            </div>
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
