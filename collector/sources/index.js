'use strict';

const dcinside = require('./dcinside');

// 공개 접근이 가능하고 robots.txt 가 허용하는 6곳만 수집한다.
// 로그인·SPA 렌더가 필요한 곳(네이버카페 부동산스터디·월부, 블라인드, 토스증권, 호갱노노)은
// 수집 자체가 불가능하므로 제외했다. 가짜 데이터로 채우지 않는다.
const SOURCES = [
    require('./fmkorea'),
    require('./ruliweb'),
    require('./instiz'),
    require('./naverStock'),
    dcinside.make('dc_stock', '디시 주식갤', 'neostock'),
    dcinside.make('dc_realestate', '디시 부동산갤', 'immovables')
];

module.exports = { SOURCES };
