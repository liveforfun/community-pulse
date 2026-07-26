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
const SOURCES = [
    require('./fmkorea'),
    require('./ruliweb'),
    require('./instiz'),
    require('./todayhumor'),
    require('./theqoo'),
    dcinside.make('dc_stock', '디시 주식갤', 'neostock'),
    dcinside.make('dc_realestate', '디시 부동산갤', 'immovables')
];

module.exports = { SOURCES };
