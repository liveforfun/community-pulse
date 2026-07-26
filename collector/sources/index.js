'use strict';

const dcinside = require('./dcinside');

// 공개 접근이 가능하고 robots.txt 가 허용하며 실제로 수집이 되는 곳만 수집한다.
// 제외한 곳:
//  - 로그인·SPA 렌더 필요: 네이버카페 부동산스터디·월부, 블라인드, 토스증권, 호갱노노
//  - 네이버 종토방: robots.txt 는 허용하지만 서버가 브라우저 아닌 UA 를 게이팅한다
//    (200 응답 + 오류 페이지). 브라우저를 위장하지 않으므로 수집 대상에서 제외했다.
// 가짜 데이터로 채우지 않는다.
// 검토했으나 제외한 곳:
//  - robots.txt 가 목록 경로를 Disallow: SLR클럽, MLBPARK, 네이트판
//  - 봇 UA 에 406 응답(UA 게이팅): 보배드림
//  - 서버 렌더 목록에 조회수·댓글수가 아예 없음(제목만): 개드립
//    → 지표 없이 넣으면 점수 0 으로 순위에 의미가 없어 제외했다
const SOURCES = [
    require('./ruliweb'),
    require('./instiz'),
    require('./theqoo'),
    require('./clien'),
    require('./inven'),
    require('./ppomppu'), // euc-kr
    require('./humoruniv'), // euc-kr
    dcinside.make('dc_stock', '디시 주식갤', 'neostock'),
    dcinside.make('dc_realestate', '디시 부동산갤', 'immovables')
];

// GitHub Actions 러너 IP 에서 차단되어 뺀 소스들.
// 로컬(가정용 IP)에서는 200 이 오지만 Actions 에서는 403/430 이 반복됐다.
// 브라우저 UA 위장은 하지 않기로 했으므로 수집 대상에서 제외한다.
// 셀프호스티드 러너를 쓰게 되면 파서 파일이 그대로 있으니 아래를 SOURCES 에 되돌리면 된다.
const DISABLED_SOURCES = [
    { module: './fmkorea', name: '에펨코리아', reason: 'Actions IP 차단 (HTTP 430)' },
    { module: './todayhumor', name: '오늘의유머', reason: 'Actions IP 차단 (HTTP 403)' },
    { module: './arcalive', name: '아카라이브', reason: 'Actions IP 차단 (HTTP 403)' }
];

module.exports = { SOURCES, DISABLED_SOURCES };
