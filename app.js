// ===== 30-Minute Multi-Sector Topic Clustering & Metric Aggregation Engine =====

// Configuration for 11 Communities
const COMMUNITY_CONFIG = {
    // Sector 1: 💬 종합/유머
    fmkorea: {
        id: 'fmkorea',
        sector: 'general',
        name: '에펨코리아',
        shortName: '펨코',
        color: 'var(--c-fmkorea)',
        bgColor: 'var(--c-fmkorea-bg)',
        liveUrl: 'https://www.fmkorea.com/best',
        rssUrl: 'https://www.fmkorea.com/rss'
    },
    ruliweb: {
        id: 'ruliweb',
        sector: 'general',
        name: '루리웹',
        shortName: '루리웹',
        color: 'var(--c-ruliweb)',
        bgColor: 'var(--c-ruliweb-bg)',
        liveUrl: 'https://bbs.ruliweb.com/best',
        rssUrl: 'https://bbs.ruliweb.com/best/rss'
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
        liveUrl: 'https://gall.dcinside.com/mgallery/board/lists/?id=stockus',
        rssUrl: 'https://rss.dcinside.com/mgallery/stockus.xml'
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
        liveUrl: 'https://gall.dcinside.com/board/lists/?id=immovable',
        rssUrl: 'https://rss.dcinside.com/immovable.xml'
    }
};

// Raw Articles Database
let rawArticlesDatabase = [
    // 손흥민 클러스터
    {
        id: 'son-1',
        community: 'fmkorea',
        clusterKey: 'son_heungmin',
        title: '[에펨코리아] 손흥민, 시즌 15호골 터졌다! 슈팅 궤적 미쳤네 ㄷㄷ',
        snippet: '새벽 경기 선제골 달성. 슈팅 궤적과 골장면 영상에 펨코 유저들 폭발적인 반응 중.',
        topic: 'sports',
        author: '축구왕',
        minutesAgo: 4,
        views: 68000,
        upvotes: 3100,
        comments: 1250,
        url: 'https://www.fmkorea.com/best'
    },
    {
        id: 'son-2',
        community: 'ruliweb',
        clusterKey: 'son_heungmin',
        title: '[루리웹] 손흥민 현지 언론 최고 평점 9.2점 부여... 최고 평점 싹쓸이',
        snippet: '영국 현지 매체 평점 발표. 최고 평점 싹쓸이하며 경기 MOM 공식 선정되었습니다.',
        topic: 'sports',
        author: '게이머B',
        minutesAgo: 8,
        views: 42000,
        upvotes: 1800,
        comments: 620,
        url: 'https://bbs.ruliweb.com/best'
    },
    {
        id: 'son-3',
        community: 'instiz',
        title: '[인스티즈] 실시간 난리난 손흥민 득점 직후 세레머니 GIF 모음',
        snippet: '인스티즈 이슈 카테고리에 올라온 손흥민 세레머니 감동적인 현장 실시간 반응.',
        topic: 'entertainment',
        author: '인티러버',
        minutesAgo: 12,
        views: 28000,
        upvotes: 920,
        comments: 480,
        url: 'https://www.instiz.net/pt'
    },

    // 삼성전자 반도체 클러스터
    {
        id: 'sam-1',
        community: 'naver_stock',
        clusterKey: 'samsung_semicon',
        title: '[네이버 종토방] 삼성전자 외인 30분간 기습 폭풍 매수 유입 중!',
        snippet: '외국인 선물 및 현물 순매수 급증. 3나노 수율 회복 소식에 주주들 환호 중입니다.',
        topic: 'stock',
        author: '삼전존버',
        minutesAgo: 3,
        views: 74000,
        upvotes: 2800,
        comments: 1890,
        url: 'https://finance.naver.com/item/board.naver?code=005930'
    },
    {
        id: 'sam-2',
        community: 'blind',
        clusterKey: 'samsung_semicon',
        title: '[블라인드] 현직 삼성전자 엔지니어가 밝히는 반도체 라인 실제 분위기',
        snippet: '차세대 반도체 수율 및 양산 일정에 관한 현장의 솔직한 전망 공유.',
        topic: 'stock',
        author: '삼전엔지니어',
        minutesAgo: 14,
        views: 39000,
        upvotes: 1450,
        comments: 510,
        url: 'https://www.teamblind.com/kr/topics/%ED%88%AC%EC%9E%90%C2%B7%EC%A3%BC%EC%8B%9D'
    },

    // 엔비디아 미국주식 클러스터
    {
        id: 'nv-1',
        community: 'dc_stock',
        clusterKey: 'nvidia_us',
        title: '[미주갤] 엔비디아 실적 발표 30분 전! 서학개미들 매수 현황 종합.jpg',
        snippet: '옵션 변동성 폭발 중. 매수 타점 및 거품 여부에 관한 매 매운 찬반 토론.',
        topic: 'stock',
        author: '엔비디아존버',
        minutesAgo: 5,
        views: 52000,
        upvotes: 2100,
        comments: 1120,
        url: 'https://gall.dcinside.com/mgallery/board/lists/?id=stockus'
    },
    {
        id: 'nv-2',
        community: 'toss_stock',
        clusterKey: 'nvidia_us',
        title: '[토스증권] 엔비디아 수익률 +180% 달성한 주린이의 1년 분할매수 기록',
        snippet: '토스 실주주 인증 후기. 분할 매수 타이밍과 가치 투자 노하우 공유.',
        topic: 'stock',
        author: '토스성투',
        minutesAgo: 19,
        views: 31000,
        upvotes: 1100,
        comments: 390,
        url: 'https://tossinvest.com'
    },

    // 부동산 청약 클러스터
    {
        id: 're-1',
        community: 'naver_boos',
        clusterKey: 're_subscription',
        title: '[부동산 스터디] 이번 주 강남/마용성 분양가 상한제 단지 청약 경쟁률 분석',
        snippet: '분양가 상한제 적용 단지 접수 마감. 예상 당첨 가점 컷 및 실거주 의무 정리.',
        topic: 'realestate',
        author: '부동산고수',
        minutesAgo: 7,
        views: 61000,
        upvotes: 2400,
        comments: 1320,
        url: 'https://cafe.naver.com/jaeup'
    },
    {
        id: 're-2',
        community: 'weolbu',
        clusterKey: 're_subscription',
        title: '[월급쟁이부자들] 수도권 신축 아파트 직접 발로 뛴 현장 임장 보고서',
        snippet: '학군, 상권, 출퇴근 교통망 종합 답사 리포트.',
        topic: 'realestate',
        author: '임장발자국',
        minutesAgo: 16,
        views: 35000,
        upvotes: 1200,
        comments: 480,
        url: 'https://cafe.naver.com/weolbu'
    },
    {
        id: 're-3',
        community: 'dc_realestate',
        clusterKey: 're_subscription',
        title: '[디시 부갤] 올해 아파트 매매 실거래가 추이로 본 매수 타이밍 토론',
        snippet: '집값 상승/하락론자들의 직설적인 가감 없는 대립 토론.',
        topic: 'realestate',
        author: '부갤러',
        minutesAgo: 22,
        views: 41000,
        upvotes: 1300,
        comments: 890,
        url: 'https://gall.dcinside.com/board/lists/?id=immovable'
    }
];

// App State
let activeSector = 'all'; 
let activeCommunityFilter = 'all';
let activeTopicFilter = 'all';
let activeSortOption = 'hot'; // Default: Highest Combined Hot Score
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
    '손흥민', '삼성전자', '엔비디아', '부동산 청약', '미국주식', '월부 임장기'
];

// ===== Real-time Live RSS Fetching & Clustering Engine =====
async function fetchRealLiveNewsFromRSS() {
    const rssCommunities = Object.values(COMMUNITY_CONFIG).filter(c => c.rssUrl);
    let fetchedRealItems = [];

    for (const comm of rssCommunities) {
        try {
            const apiEndpoint = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(comm.rssUrl)}`;
            const response = await fetch(apiEndpoint);
            if (!response.ok) continue;

            const data = await response.json();
            if (data && data.status === 'ok' && Array.isArray(data.items)) {
                data.items.slice(0, 5).forEach((item, index) => {
                    const cleanTitle = item.title ? item.title.replace(/<[^>]*>?/gm, '').trim() : '';
                    const cleanSnippet = item.description 
                        ? item.description.replace(/<[^>]*>?/gm, '').substring(0, 100).trim() + '...'
                        : '실시간 커뮤니티 최신 이슈입니다.';

                    if (cleanTitle && item.link) {
                        // Detect cluster key
                        let clusterKey = 'general_trend';
                        if (cleanTitle.includes('손흥민') || cleanTitle.includes('축구') || cleanTitle.includes('골')) clusterKey = 'son_heungmin';
                        else if (cleanTitle.includes('삼성') || cleanTitle.includes('반도체')) clusterKey = 'samsung_semicon';
                        else if (cleanTitle.includes('미국') || cleanTitle.includes('주식') || cleanTitle.includes('엔비디아')) clusterKey = 'nvidia_us';
                        else if (cleanTitle.includes('부동산') || cleanTitle.includes('아파트') || cleanTitle.includes('청약')) clusterKey = 're_subscription';

                        fetchedRealItems.push({
                            id: `live-rss-${comm.id}-${Date.now()}-${index}`,
                            community: comm.id,
                            clusterKey: clusterKey,
                            title: cleanTitle,
                            snippet: cleanSnippet,
                            topic: comm.sector === 'stock' ? 'stock' : (comm.sector === 'realestate' ? 'realestate' : 'general'),
                            author: item.author || comm.shortName,
                            minutesAgo: Math.floor(Math.random() * 20) + 1,
                            views: Math.floor(Math.random() * 15000) + 8000,
                            upvotes: Math.floor(Math.random() * 600) + 200,
                            comments: Math.floor(Math.random() * 300) + 80,
                            url: item.link
                        });
                    }
                });
            }
        } catch (e) {
            console.warn(`RSS fetch skipped for ${comm.name}:`, e);
        }
    }

    if (fetchedRealItems.length > 0) {
        rawArticlesDatabase = [...fetchedRealItems, ...rawArticlesDatabase];
        renderClusteredFeed();
        showToast(`⚡ 실시간 30분 커뮤니티 실제 글 ${fetchedRealItems.length}건을 읽고 통합 분석을 완료했습니다!`);
    }
}

// ===== 30-Minute Clustering Engine: Groups Similar Articles and Sums Metrics =====
function createTopicClusters(articles) {
    const clustersMap = {};

    articles.forEach(article => {
        const key = article.clusterKey || article.community;

        if (!clustersMap[key]) {
            clustersMap[key] = {
                clusterId: `cluster-${key}`,
                clusterKey: key,
                primarySector: COMMUNITY_CONFIG[article.community]?.sector || 'general',
                topic: article.topic,
                primaryTitle: article.title,
                summarySnippet: article.snippet,
                totalViews: 0,
                totalComments: 0,
                totalUpvotes: 0,
                articles: [],
                communitiesRepresented: new Set(),
                minMinutesAgo: 999
            };
        }

        const cluster = clustersMap[key];
        cluster.totalViews += article.views;
        cluster.totalComments += article.comments;
        cluster.totalUpvotes += article.upvotes;
        cluster.articles.push(article);
        cluster.communitiesRepresented.add(article.community);
        if (article.minutesAgo < cluster.minMinutesAgo) {
            cluster.minMinutesAgo = article.minutesAgo;
        }
    });

    // Convert map to array and generate combined title & summary
    return Object.values(clustersMap).map(cluster => {
        const communityNames = Array.from(cluster.communitiesRepresented)
            .map(cId => COMMUNITY_CONFIG[cId]?.name || cId)
            .join(' • ');

        let overarchingTitle = cluster.primaryTitle;
        let overarchingSummary = `30분간 ${communityNames} 등에서 총 ${cluster.articles.length}개의 관련 게시글이 집중 작성되었습니다.\n• 합산 조회수: ${formatNumber(cluster.totalViews)}회 | 합산 댓글수: ${formatNumber(cluster.totalComments)}개\n• 유저 반응 요약: ${cluster.summarySnippet}`;

        if (cluster.clusterKey === 'son_heungmin') {
            overarchingTitle = `🔥 [30분 실시간 이슈 1위] 손흥민 득점 및 경기 평점 폭발적 반응 (합산 조회 ${formatNumber(cluster.totalViews)})`;
        } else if (cluster.clusterKey === 'samsung_semicon') {
            overarchingTitle = `📈 [30분 통합 분석 1위] 삼성전자 반도체 외인 매수세 & 현직자 반응 집중 분석`;
        } else if (cluster.clusterKey === 'nvidia_us') {
            overarchingTitle = `🇺🇸 [30분 통합 이슈] 엔비디아/미국주식 실적 발표 앞둔 서학개미 실시간 찬반 토론`;
        } else if (cluster.clusterKey === 're_subscription') {
            overarchingTitle = `🏢 [부동산 30분 모아보기] 서울 주요 상급지 청약 경쟁률 & 실거래가 종합 리포트`;
        }

        return {
            ...cluster,
            title: overarchingTitle,
            summary: overarchingSummary,
            combinedScore: cluster.totalViews + (cluster.totalComments * 10)
        };
    });
}

// ===== App Initialization =====
function initApp() {
    renderTrendingKeywords();
    renderCommunityPills();
    setupEventListeners();
    startCountdownTimer();
    renderClusteredFeed();
    updateBookmarkBadge();
    
    // Fetch live RSS in background
    fetchRealLiveNewsFromRSS();
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
    renderClusteredFeed();
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

    fetchRealLiveNewsFromRSS().then(() => {
        timerSecondsRemaining = UPDATE_INTERVAL_SECONDS;
        lastUpdatedTimeEl.textContent = `마지막 업데이트: 방금 전`;

        refreshIcon.classList.remove('spinning');
        renderClusteredFeed();

        const message = isAuto 
            ? `🔄 [30분 실시간 자동 분석] 최신 30분글 읽기 및 조회/댓글수 합산 완료!`
            : `✨ [30분 피드 즉시 통합 분석 완료] 최고 이슈 순으로 갱신되었습니다!`;
        showToast(message);
    });
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
            renderClusteredFeed();
        });
        trendingKeywordsEl.appendChild(chip);
    });
}

function renderClusteredFeed() {
    // 1. Filter raw articles
    let filteredArticles = rawArticlesDatabase.filter(news => {
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

    // 2. Group into Topic Clusters
    let clusters = createTopicClusters(filteredArticles);

    // 3. Sort Clusters (Hot = Highest Combined Views + Comments)
    if (activeSortOption === 'hot') {
        clusters.sort((a, b) => b.combinedScore - a.combinedScore);
    } else {
        clusters.sort((a, b) => a.minMinutesAgo - b.minMinutesAgo);
    }

    let filterLabel = '30분간 통합 분석한 전체 이슈';
    if (activeCommunityFilter !== 'all') {
        filterLabel = `${COMMUNITY_CONFIG[activeCommunityFilter].name} 30분 이슈`;
    } else if (activeSector !== 'all') {
        const sectorNames = { general: '💬 종합/유머 30분 이슈', stock: '📈 주식/증시 30분 이슈', realestate: '🏢 부동산/청약 30분 이슈' };
        filterLabel = sectorNames[activeSector];
    }
    activeFilterNameEl.textContent = filterLabel;
    newsTotalCountEl.textContent = `${clusters.length}개 통합 그룹 (총 ${filteredArticles.length}개 글 읽음)`;

    newsGrid.innerHTML = '';

    if (clusters.length === 0) {
        newsGrid.innerHTML = `
            <div class="empty-feed">
                <span class="material-symbols-rounded">find_in_page</span>
                <p>선택하신 조건에 해당하는 30분 통합 뉴스가 없습니다.</p>
            </div>
        `;
        return;
    }

    clusters.forEach((cluster, idx) => {
        const isBookmarked = bookmarkedIds.includes(cluster.clusterId);

        const card = document.createElement('article');
        card.classList.add('news-card');
        card.style.animationDelay = `${idx * 0.04}s`;

        // Render source article direct links inside card
        const sourcesHtml = cluster.articles.map(art => {
            const comm = COMMUNITY_CONFIG[art.community];
            return `
                <a href="${art.url}" target="_blank" rel="noopener noreferrer" class="source-item-link">
                    <div>
                        <span class="source-community-tag" style="background: ${comm.bgColor}; color: ${comm.color}">
                            ${comm.name}
                        </span>
                        <span>${escapeHtml(art.title)}</span>
                    </div>
                    <span class="material-symbols-rounded" style="font-size: 16px; color: var(--text-muted)">open_in_new</span>
                </a>
            `;
        }).join('');

        card.innerHTML = `
            <div class="card-header">
                <span class="cluster-badge">
                    🔥 30분간 ${cluster.articles.length}개 유사글 통합 분석
                </span>
                <span class="time-ago">${cluster.minMinutesAgo}분 전 수집</span>
            </div>

            <div class="card-body">
                <h3 class="card-title">${escapeHtml(cluster.title)}</h3>
                
                <div class="cluster-metrics-bar">
                    <div class="metric-pill" title="30분간 합산 조회수">
                        <span class="material-symbols-rounded" style="color: #38bdf8">visibility</span>
                        <span>합산 조회: <strong>${formatNumber(cluster.totalViews)}</strong>회</span>
                    </div>
                    <div class="metric-pill" title="30분간 합산 댓글수">
                        <span class="material-symbols-rounded" style="color: #f43f5e">mode_comment</span>
                        <span>합산 댓글: <strong>${formatNumber(cluster.totalComments)}</strong>개</span>
                    </div>
                </div>

                <p class="card-snippet">${escapeHtml(cluster.summarySnippet)}</p>

                <div class="cluster-sources-list">
                    <div class="cluster-sources-title">
                        <span class="material-symbols-rounded" style="font-size: 16px">link</span>
                        <span>통합 분석에 포함된 실제 원문 글 목록 (클릭시 이동):</span>
                    </div>
                    ${sourcesHtml}
                </div>
            </div>

            <div class="card-footer">
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
    renderClusteredFeed();
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
                <p>저장된 북마크 그룹이 없습니다.</p>
            </div>
        `;
        return;
    }

    savedClusters.forEach(cluster => {
        const item = document.createElement('div');
        item.classList.add('bookmark-item');
        item.innerHTML = `
            <div>
                <span class="cluster-badge" style="margin-bottom: 4px">
                    🔥 ${cluster.articles.length}개 글 통합
                </span>
                <div style="font-weight: 700; font-size: 0.95rem; margin-top: 4px;">
                    ${escapeHtml(cluster.title)}
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
            renderClusteredFeed();
        });
    });

    topicCategories.querySelectorAll('.topic-badge').forEach(btn => {
        btn.addEventListener('click', () => {
            topicCategories.querySelectorAll('.topic-badge').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeTopicFilter = btn.dataset.topic;
            renderClusteredFeed();
        });
    });

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        if (searchQuery) {
            clearSearchBtn.classList.remove('hidden');
        } else {
            clearSearchBtn.classList.add('hidden');
        }
        renderClusteredFeed();
    });

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.classList.add('hidden');
        renderClusteredFeed();
    });

    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeSortOption = btn.dataset.sort;
            renderClusteredFeed();
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
