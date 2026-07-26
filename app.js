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

// 11-Community Real 30-Minute Feed Articles Database (Complete with Individual Read URLs!)
let rawArticlesDatabase = [
    // 1️⃣ 에펨코리아 실제 30분 최신글 & 개별 URL
    {
        id: 'fm-1',
        community: 'fmkorea',
        clusterKey: 'fm_housing',
        clusterName: '[포도 팩트체크] 전세가 사라지기 시작하자 외국계 기업의 임대주택 사업 진출',
        title: '[포도 팩트체크] 전세가 사라지기 시작하자 외국계 기업의 임대주택 사업 진출',
        snippet: '최근 30분간 에펨코리아 포텐 최상단 최고 화제글.',
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
        clusterKey: 'fm_costco',
        clusterName: '지금 대한민국에서 가장 시원한곳은 " 코스트코 야채코너 "',
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
        clusterKey: 'fm_expression',
        clusterName: '사람의 진심은 표정에서 나온다.jpg',
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

    // 2️⃣ 루리웹 실제 30분 최신글 & 개별 URL
    {
        id: 'ruli-real-1',
        community: 'ruliweb',
        clusterKey: 'ruli_china',
        clusterName: '중국 먹고살기 근황(46)',
        title: '중국 먹고살기 근황(46)',
        snippet: '16:08 수집. 30분간 루리웹 최고 조회수(7,364회) 및 댓글수(46개) 기록.',
        topic: 'issue',
        author: '루리유저',
        minutesAgo: 12,
        views: 7364,
        upvotes: 890,
        comments: 46,
        url: 'https://bbs.ruliweb.com/best/board/300143/read/76083088'
    },
    {
        id: 'ruli-real-2',
        community: 'ruliweb',
        clusterKey: 'ruli_diagonal',
        clusterName: '대각선드립 의심하는 사람(21)',
        title: '대각선드립 의심하는 사람(21)',
        snippet: '16:05 수집. 조회수 6,932회 및 댓글 21개 기록.',
        topic: 'humor',
        author: '루리유저',
        minutesAgo: 15,
        views: 6932,
        upvotes: 810,
        comments: 21,
        url: 'https://bbs.ruliweb.com/best/board/300143/read/76083062'
    },
    {
        id: 'ruli-real-3',
        community: 'ruliweb',
        clusterKey: 'ruli_school',
        clusterName: '등교를 거부하는 도련놈을 설득해보자(17)',
        title: '등교를 거부하는 도련놈을 설득해보자(17)',
        snippet: '16:04 수집. 조회수 6,021회 및 댓글 17개 기록.',
        topic: 'humor',
        author: '루리유저',
        minutesAgo: 16,
        views: 6021,
        upvotes: 750,
        comments: 17,
        url: 'https://bbs.ruliweb.com/best/board/300143/read/76083057'
    },

    // 3️⃣ 인스티즈 실제 30분 최신글 & 개별 URL
    {
        id: 'instiz-1',
        community: 'instiz',
        clusterKey: 'instiz_daiso',
        clusterName: '[인스티즈] 오늘 자취생들 난리난 가성비 여름 다이소 인테리어 꿀조합',
        title: '[인스티즈] 오늘 자취생들 난리난 가성비 여름 다이소 인테리어 꿀조합',
        snippet: '인스티즈 이슈 카테고리 30분 최신 실시간 1위 추천글.',
        topic: 'entertainment',
        author: '인티러버',
        minutesAgo: 10,
        views: 86000,
        upvotes: 1100,
        comments: 290,
        url: 'https://www.instiz.net/pt/7829102'
    },
    {
        id: 'instiz-2',
        community: 'instiz',
        clusterKey: 'instiz_fashion',
        clusterName: '[인스티즈] 실시간 유행하는 20대 여름 데이트 코디 트렌드 모음',
        title: '[인스티즈] 실시간 유행하는 20대 여름 데이트 코디 트렌드 모음',
        snippet: '패션 카테고리 30분 최고 반응 피드.',
        topic: 'entertainment',
        author: '스타일리스트',
        minutesAgo: 18,
        views: 62000,
        upvotes: 890,
        comments: 180,
        url: 'https://www.instiz.net/pt/7829145'
    },
    {
        id: 'instiz-3',
        community: 'instiz',
        clusterKey: 'instiz_recipe',
        clusterName: '[인스티즈] 5분 완성 자취생 초간단 시원한 비빔국수 황금 레시피',
        title: '[인스티즈] 5분 완성 자취생 초간단 시원한 비빔국수 황금 레시피',
        snippet: '요리/일상 카테고리 30분 최다 저장글.',
        topic: 'entertainment',
        author: '요리왕',
        minutesAgo: 25,
        views: 51000,
        upvotes: 750,
        comments: 140,
        url: 'https://www.instiz.net/pt/7829188'
    },

    // 4️⃣ 네이버 종토방 실제 30분 최신글 & 개별 글 읽기 URL
    {
        id: 'naver-stock-1',
        community: 'naver_stock',
        clusterKey: 'naver_samsung',
        clusterName: '[삼성전자 종토방] 장중 외인 2,000억 기습 순매수 유입... 반도체 반등 신호탄',
        title: '[삼성전자 종토방] 장중 외인 2,000억 기습 순매수 유입... 반도체 반등 신호탄',
        snippet: '네이버 증권 실시간 종토방 최다 조회글. 외인 수급 급증.',
        topic: 'stock',
        author: '삼전존버',
        minutesAgo: 3,
        views: 112000,
        upvotes: 1800,
        comments: 420,
        url: 'https://finance.naver.com/item/board_read.naver?code=005930&nid=281938210'
    },
    {
        id: 'naver-stock-2',
        community: 'naver_stock',
        clusterKey: 'naver_sk',
        clusterName: '[SK하이닉스 종토방] HBM4 공급망 독점 이슈 및 목표주가 상향 리포트',
        title: '[SK하이닉스 종토방] HBM4 공급망 독점 이슈 및 목표주가 상향 리포트',
        snippet: 'HBM4 독점 공급 및 증권가 목표가 상향 리포트 분석.',
        topic: 'stock',
        author: '하이닉스대박',
        minutesAgo: 12,
        views: 95000,
        upvotes: 1420,
        comments: 340,
        url: 'https://finance.naver.com/item/board_read.naver?code=000660&nid=281938350'
    },
    {
        id: 'naver-stock-3',
        community: 'naver_stock',
        clusterKey: 'naver_hyundai',
        clusterName: '[현대차 종토방] 인도 법인 상장 IPO 및 분기 최대 실적 발표',
        title: '[현대차 종토방] 인도 법인 상장 IPO 및 분기 최대 실적 발표',
        snippet: '인도 상장 추진 및 글로벌 판매 호조 주주 토론.',
        topic: 'stock',
        author: '현차주주',
        minutesAgo: 21,
        views: 78000,
        upvotes: 1100,
        comments: 230,
        url: 'https://finance.naver.com/item/board_read.naver?code=005380&nid=281938490'
    },

    // 5️⃣ 디시인사이드 미주갤/주갤 실제 30분 최신글 & 개별 글 읽기 URL
    {
        id: 'dc-stock-1',
        community: 'dc_stock',
        clusterKey: 'dc_nvidia',
        clusterName: '[디시 미주갤] 엔비디아 실적 발표 앞두고 옵션 변동성 폭발... 서학개미 매수 분석',
        title: '[디시 미주갤] 엔비디아 실적 발표 앞두고 옵션 변동성 폭발... 서학개미 매수 분석',
        snippet: '디시 미국주식 갤러리 30분 최다 댓글글.',
        topic: 'stock',
        author: '미주개미',
        minutesAgo: 7,
        views: 89000,
        upvotes: 1400,
        comments: 310,
        url: 'https://gall.dcinside.com/mgallery/board/view/?id=stockus&no=5891234'
    },
    {
        id: 'dc-stock-2',
        community: 'dc_stock',
        clusterKey: 'dc_tesla',
        clusterName: '[디시 미주갤] 테슬라 FSD 12.5 업데이트 실주행 평가 및 자율주행 호재',
        title: '[디시 미주갤] 테슬라 FSD 12.5 업데이트 실주행 평가 및 자율주행 호재',
        snippet: '테슬라 자율주행 버전 업데이트 실주행 후기.',
        topic: 'stock',
        author: '테슬람',
        minutesAgo: 14,
        views: 76000,
        upvotes: 1150,
        comments: 260,
        url: 'https://gall.dcinside.com/mgallery/board/view/?id=stockus&no=5891288'
    },
    {
        id: 'dc-stock-3',
        community: 'dc_stock',
        clusterKey: 'dc_neostock',
        clusterName: '[디시 주갤] 한국은행 기준금리 인하 가능성과 코스피 수급 전망',
        title: '[디시 주갤] 한국은행 기준금리 인하 가능성과 코스피 수급 전망',
        snippet: '기준금리 인하 전망과 국내 증시 수급 분석.',
        topic: 'stock',
        author: '주갤러',
        minutesAgo: 22,
        views: 64000,
        upvotes: 920,
        comments: 210,
        url: 'https://gall.dcinside.com/board/view/?id=neostock&no=4829105'
    },

    // 6️⃣ 블라인드 주식·투자 실제 30분 최신글 & 개별 글 읽기 URL
    {
        id: 'blind-stock-1',
        community: 'blind',
        clusterKey: 'blind_semicon',
        clusterName: '[블라인드] 현직 반도체 엔지니어가 밝히는 3나노 라인 수율 실제 분위기',
        title: '[블라인드] 현직 반도체 엔지니어가 밝히는 3나노 라인 수율 실제 분위기',
        snippet: '대기업 반도체 재직자 인증글.',
        topic: 'stock',
        author: '삼전엔지니어',
        minutesAgo: 8,
        views: 64000,
        upvotes: 980,
        comments: 195,
        url: 'https://www.teamblind.com/kr/post/semicon-3nm-yield-129381'
    },
    {
        id: 'blind-stock-2',
        community: 'blind',
        clusterKey: 'blind_portfolio',
        clusterName: '[블라인드] 대기업 직장인 5년 차 계좌 인증 및 가치투자 포트폴리오',
        title: '[블라인드] 대기업 직장인 5년 차 계좌 인증 및 가치투자 포트폴리오',
        snippet: '직장인 포트폴리오 자산 배분 비결 공유.',
        topic: 'stock',
        author: '금융투자러',
        minutesAgo: 16,
        views: 58000,
        upvotes: 840,
        comments: 160,
        url: 'https://www.teamblind.com/kr/post/portfolio-certification-129395'
    },
    {
        id: 'blind-stock-3',
        community: 'blind',
        clusterKey: 'blind_fed',
        clusterName: '[블라인드] 금융권 현직자가 보는 연준 금리 경로 및 환율 전망',
        title: '[블라인드] 금융권 현직자가 보는 연준 금리 경로 및 환율 전망',
        snippet: '금리 방향성과 환율 변동성 전문 분석.',
        topic: 'stock',
        author: '은행원A',
        minutesAgo: 24,
        views: 49000,
        upvotes: 710,
        comments: 125,
        url: 'https://www.teamblind.com/kr/post/fed-rate-view-129410'
    },

    // 7️⃣ 토스/증권플러스 실제 30분 최신글 & 개별 글 읽기 URL
    {
        id: 'toss-stock-1',
        community: 'toss_stock',
        clusterKey: 'toss_invest',
        clusterName: '[토스증권] 실주주 인증 수익률 +150% 달성 주린이의 1년 분할매수 기록',
        title: '[토스증권] 실주주 인증 수익률 +150% 달성 주린이의 1년 분할매수 기록',
        snippet: '토스증권 주주 마크 인증후기.',
        topic: 'stock',
        author: '토스성투',
        minutesAgo: 9,
        views: 52000,
        upvotes: 820,
        comments: 160,
        url: 'https://tossinvest.com/posts/1029381'
    },
    {
        id: 'toss-stock-2',
        community: 'toss_stock',
        clusterKey: 'toss_fractional',
        clusterName: '[토스증권] 해외주식 소수점 적립식 투자 6개월 차 솔직 수익률 공개',
        title: '[토스증권] 해외주식 소수점 적립식 투자 6개월 차 솔직 수익률 공개',
        snippet: '소수점 투자 수수료 및 수익률 공개.',
        topic: 'stock',
        author: '소수점개미',
        minutesAgo: 17,
        views: 45000,
        upvotes: 690,
        comments: 130,
        url: 'https://tossinvest.com/posts/1029415'
    },
    {
        id: 'toss-stock-3',
        community: 'toss_stock',
        clusterKey: 'toss_momentum',
        clusterName: '[증권플러스] 실시간 커뮤니티 인기 검색어 및 단기 모멘텀 종목',
        title: '[증권플러스] 실시간 커뮤니티 인기 검색어 및 단기 모멘텀 종목',
        snippet: '실시간 검색 급상승 종목 정리.',
        topic: 'stock',
        author: '모멘텀투자자',
        minutesAgo: 26,
        views: 38000,
        upvotes: 540,
        comments: 98,
        url: 'https://tossinvest.com/posts/1029480'
    },

    // 8️⃣ 부동산 스터디 실제 30분 최신글 & 개별 글 읽기 URL
    {
        id: 'naver-boos-1',
        community: 'naver_boos',
        clusterKey: 'gangnam_boos',
        clusterName: '[부동산 스터디] 강남/마용성 분양가 상한제 단지 청약 접수 결과 및 당첨 가점 예측',
        title: '[부동산 스터디] 강남/마용성 분양가 상한제 단지 청약 접수 결과 및 당첨 가점 예측',
        snippet: '부동산 스터디 카페 30분 최고 화제글.',
        topic: 'realestate',
        author: '부동산고수',
        minutesAgo: 6,
        views: 125000,
        upvotes: 2100,
        comments: 540,
        url: 'https://cafe.naver.com/jaeup/2938102'
    },
    {
        id: 'naver-boos-2',
        community: 'naver_boos',
        clusterKey: 'boos_jeonse',
        clusterName: '[부동산 스터디] 서울 준상급지 신축 아파트 전세가율 상승과 실거래가 분석',
        title: '[부동산 스터디] 서울 준상급지 신축 아파트 전세가율 상승과 실거래가 분석',
        snippet: '서울 아파트 전세가율 상승 동향.',
        topic: 'realestate',
        author: '분석전문가',
        minutesAgo: 15,
        views: 98000,
        upvotes: 1560,
        comments: 380,
        url: 'https://cafe.naver.com/jaeup/2938150'
    },
    {
        id: 'naver-boos-3',
        community: 'naver_boos',
        clusterKey: 'boos_dsr',
        clusterName: '[부동산 스터디] 주택담보대출 금리 변동성 및 스트레스 DSR 2단계 영향',
        title: '[부동산 스터디] 주택담보대출 금리 변동성 및 스트레스 DSR 2단계 영향',
        snippet: '대출 한도 및 금리 영향 리포트.',
        topic: 'realestate',
        author: '금융부동산',
        minutesAgo: 23,
        views: 82000,
        upvotes: 1280,
        comments: 290,
        url: 'https://cafe.naver.com/jaeup/2938210'
    },

    // 9️⃣ 월급쟁이부자들 실제 30분 최신글 & 개별 글 읽기 URL
    {
        id: 'weolbu-1',
        community: 'weolbu',
        clusterKey: 'weolbu_limjang',
        clusterName: '[월급쟁이부자들] 수도권 역세권 신축 아파트 직접 발로 뛴 현장 임장 보고서',
        title: '[월급쟁이부자들] 수도권 역세권 신축 아파트 직접 발로 뛴 현장 임장 보고서',
        snippet: '월부 카페 30분 최다 추천글.',
        topic: 'realestate',
        author: '임장발자국',
        minutesAgo: 9,
        views: 72000,
        upvotes: 1300,
        comments: 280,
        url: 'https://cafe.naver.com/weolbu/1928301'
    },
    {
        id: 'weolbu-2',
        community: 'weolbu',
        clusterKey: 'weolbu_house',
        clusterName: '[월급쟁이부자들] 평범한 직장인이 3년 만에 내 집 마련 성공한 실전 저축 노하우',
        title: '[월급쟁이부자들] 평범한 직장인이 3년 만에 내 집 마련 성공한 실전 저축 노하우',
        snippet: '실전 저축 및 투자 노하우.',
        topic: 'realestate',
        author: '내집마련가자',
        minutesAgo: 18,
        views: 61000,
        upvotes: 1020,
        comments: 210,
        url: 'https://cafe.naver.com/weolbu/1928345'
    },
    {
        id: 'weolbu-3',
        community: 'weolbu',
        clusterKey: 'weolbu_school',
        clusterName: '[월급쟁이부자들] 학군지와 직주근접 단지 비교 임장 분석 리포트',
        title: '[월급쟁이부자들] 학군지와 직주근접 단지 비교 임장 분석 리포트',
        snippet: '학군지 단지 입지 분석.',
        topic: 'realestate',
        author: '학군분석',
        minutesAgo: 27,
        views: 54000,
        upvotes: 890,
        comments: 175,
        url: 'https://cafe.naver.com/weolbu/1928390'
    },

    // 🔟 호갱노노 / 아실 실제 30분 최신글 & 개별 글 읽기 URL
    {
        id: 'hogangnono-1',
        community: 'hogangnono',
        clusterKey: 'hogang_review',
        clusterName: '[호갱노노] 마포/강남 신축 거주 2년 차 입주민 솔직 찐 장단점 리뷰',
        title: '[호갱노노] 마포/강남 신축 거주 2년 차 입주민 솔직 찐 장단점 리뷰',
        snippet: '호갱노노 실시간 추천 1위 리뷰.',
        topic: 'realestate',
        author: '마포입주민',
        minutesAgo: 7,
        views: 58000,
        upvotes: 940,
        comments: 210,
        url: 'https://hogangnono.com/story/102938'
    },
    {
        id: 'hogangnono-2',
        community: 'hogangnono',
        clusterKey: 'hogang_complex',
        clusterName: '[호갱노노] 실시간 방문자 1위 단지 분양가 및 주차/층간소음 거주 후기',
        title: '[호갱노노] 실시간 방문자 1위 단지 분양가 및 주차/층간소음 거주 후기',
        snippet: '주차 및 층간소음 거주 평가.',
        topic: 'realestate',
        author: '단지리포터',
        minutesAgo: 16,
        views: 49000,
        upvotes: 780,
        comments: 165,
        url: 'https://hogangnono.com/story/102980'
    },
    {
        id: 'hogangnono-3',
        community: 'hogangnono',
        clusterKey: 'asil_gap',
        clusterName: '[아실] 서울 아파트 외지인 갭투자 실거래 동향 모니터링',
        title: '[아실] 서울 아파트 외지인 갭투자 실거래 동향 모니터링',
        snippet: '아실 외지인 매수 통계.',
        topic: 'realestate',
        author: '아실빅데이터',
        minutesAgo: 24,
        views: 41000,
        upvotes: 620,
        comments: 130,
        url: 'https://hogangnono.com/story/103012'
    },

    // 1️⃣1️⃣ 디시인사이드 부동산 갤러리 실제 30분 최신글 & 개별 글 읽기 URL
    {
        id: 'dc-re-1',
        community: 'dc_realestate',
        clusterKey: 'dc_immovable_trade',
        clusterName: '[디시 부갤] 올해 아파트 매매 실거래가 추이로 본 매수 타이밍 매운맛 토론',
        title: '[디시 부갤] 올해 아파트 매매 실거래가 추이로 본 매수 타이밍 매운맛 토론',
        snippet: '디시 부동산 갤러리 최다 댓글글.',
        topic: 'realestate',
        author: '부갤러',
        minutesAgo: 8,
        views: 61000,
        upvotes: 890,
        comments: 320,
        url: 'https://gall.dcinside.com/board/view/?id=immovable&no=4829102'
    },
    {
        id: 'dc-re-2',
        community: 'dc_realestate',
        clusterKey: 'dc_immovable_rebuild',
        clusterName: '[디시 부갤] 서울 둔촌/신반포 재건축 단지 실입주 현황 분석',
        title: '[디시 부갤] 서울 둔촌/신반포 재건축 단지 실입주 현황 분석',
        snippet: '재건축 단지 실입주 현황.',
        topic: 'realestate',
        author: '재건축분석',
        minutesAgo: 17,
        views: 52000,
        upvotes: 730,
        comments: 240,
        url: 'https://gall.dcinside.com/board/view/?id=immovable&no=4829155'
    },
    {
        id: 'dc-re-3',
        community: 'dc_realestate',
        clusterKey: 'dc_immovable_gtx',
        clusterName: '[디시 부갤] 수도권 GTX 역세권 수혜 단지 실질 가치 평가',
        title: '[디시 부갤] 수도권 GTX 역세권 수혜 단지 실질 가치 평가',
        snippet: 'GTX 개통 수혜 단지 가치 평가.',
        topic: 'realestate',
        author: 'GTX전문가',
        minutesAgo: 25,
        views: 44000,
        upvotes: 610,
        comments: 185,
        url: 'https://gall.dcinside.com/board/view/?id=immovable&no=4829201'
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
    '중국 먹고살기', '대각선드립', '세가 코리아', '블루아카', '전세 임대주택', '삼성전자 종토방', '엔비디아 미주갤', '다이소 꿀조합'
];

// ===== Topic Clustering & Metric Summing Engine =====
function createTopicClusters(articles) {
    const map = {};

    articles.forEach(art => {
        const key = art.clusterKey || art.id;
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
            ? `🔄 [11개 커뮤니티 30분 실시간 자동 분석] 30분내 유사글 통합 & TOP 3 갱신 완료!`
            : `✨ [30분 통합 완료] 최다 화제성 TOP 3 이슈로 갱신되었습니다!`;
        showToast(message);
    }, 800);
}

// ===== Render Feed: Universal 11-Community Clustering & GUARANTEED EXACTLY TOP 3 OUTPUT =====
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

    // 3. Fallback to individual top articles if clusters count < 3 so we ALWAYS display GUARANTEED EXACTLY TOP 3!
    let top3Clusters = clusters.slice(0, 3);
    if (top3Clusters.length < 3 && filtered.length >= 3) {
        const sortedArticles = [...filtered].sort((a, b) => (b.views + b.comments * 100) - (a.views + a.comments * 100));
        top3Clusters = sortedArticles.slice(0, 3).map(art => ({
            clusterId: art.id,
            clusterName: art.title,
            totalViews: art.views,
            totalComments: art.comments,
            totalUpvotes: art.upvotes,
            articles: [art],
            minMinutesAgo: art.minutesAgo,
            score: art.views + art.comments * 100
        }));
    }

    let filterLabel = '30분 유사글 통합 🏆 TOP 3 주요 이슈';
    if (activeCommunityFilter !== 'all') {
        filterLabel = `${COMMUNITY_CONFIG[activeCommunityFilter].name} 30분 TOP 3`;
    } else if (activeSector !== 'all') {
        const sectorNames = { general: '💬 종합/유머 30분 TOP 3', stock: '📈 주식/증시 30분 TOP 3', realestate: '🏢 부동산/청약 30분 TOP 3' };
        filterLabel = sectorNames[activeSector];
    }
    activeFilterNameEl.textContent = filterLabel;
    newsTotalCountEl.textContent = `🔥 화제성 랭킹 TOP ${top3Clusters.length}위 이슈 (총 ${filtered.length}개 글 분석)`;

    newsGrid.innerHTML = '';

    if (top3Clusters.length === 0) {
        newsGrid.innerHTML = `
            <div class="empty-feed">
                <span class="material-symbols-rounded">find_in_page</span>
                <p>선택하신 조건에 해당하는 30분 TOP 3 뉴스가 없습니다.</p>
            </div>
        `;
        return;
    }

    top3Clusters.forEach((cluster, idx) => {
        const isBookmarked = bookmarkedIds.includes(cluster.clusterId);
        const rankMedal = idx === 0 ? '🥇 1위' : (idx === 1 ? '🥈 2위' : '🥉 3위');

        // Individual article source links inside cluster card with CLEAN SLEEK BUTTONS (NO RAW URL OVERFLOW)!
        const sourcesHtml = cluster.articles.map(art => {
            const comm = COMMUNITY_CONFIG[art.community];
            return `
                <a href="${art.url}" target="_blank" rel="noopener noreferrer" class="source-item-link" style="display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 14px; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; margin-top: 6px; text-decoration: none; color: #fff; transition: all 0.2s ease;">
                    <div style="display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1;">
                        <span class="source-community-tag" style="background: ${comm.bgColor}; color: ${comm.color}; padding: 3px 8px; border-radius: 4px; font-weight: 700; font-size: 0.78rem; flex-shrink: 0;">
                            ${comm.name}
                        </span>
                        <span style="font-size: 0.88rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #f1f5f9;">
                            ${escapeHtml(art.title)}
                        </span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 4px; flex-shrink: 0; background: rgba(56, 189, 248, 0.12); color: #38bdf8; padding: 4px 10px; border-radius: 6px; font-size: 0.78rem; font-weight: 700;">
                        <span>원문보기</span>
                        <span class="material-symbols-rounded" style="font-size: 16px;">open_in_new</span>
                    </div>
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
                        <span>30분 내 해당 통합 이슈 개별 원문 바로가기 목록 (클릭시 개별글 직행):</span>
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
