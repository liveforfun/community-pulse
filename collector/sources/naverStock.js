'use strict';

const { decodeEntities, text, toInt, all } = require('./html');

// 네이버 금융 종목토론실(삼성전자 005930).
// robots.txt: `Allow: /item/board.naver?code=*` 로 목록 1페이지는 명시적으로 허용되지만
// `Disallow: /item/board.naver?code=*&page=*` 이므로 &page= 를 붙이면 안 되고,
// 개별 글(board_read.naver)은 Disallow 대상이라 요청하지 않고 링크로만 노출한다.
//
// 인코딩은 UTF-8 이다(charset=utf-8 명시). euc-kr 로 디코딩하면 한글이 깨진다.
// 목록에 댓글수 컬럼이 없다 → comments 는 항상 null.

const STOCK_CODE = '005930';
const ROW_RE = /<tr[^>]*>([\s\S]*?)<\/tr>/g;

function parse(html) {
    const items = [];

    for (const m of all(ROW_RE, html)) {
        const row = m[1];

        const linkM = row.match(/<a\s+href="\/item\/board_read\.naver\?code=(\d+)&(?:amp;)?nid=(\d+)[^"]*"[^>]*title="([^"]*)"/);
        if (!linkM) continue;

        // 제목은 title 속성에서 뽑는다. 본문 텍스트에는 <img new.gif> 가 섞인다.
        const title = decodeEntities(linkM[3]).replace(/\s+/g, ' ').trim();
        if (!title) continue;

        const dateM = row.match(/<span class="tah p10 gray03">([^<]*)<\/span>/);

        // 컬럼 순서: 날짜 / 제목 / 작성자 / 조회수 / 공감 / 비공감
        // 조회수는 span.tah, 공감·비공감은 strong.tah 로 마크업된다.
        const spanNums = all(/<span class="tah p10 gray03">([^<]*)<\/span>/, row).map(x => text(x[1]));
        const strongNums = all(/<strong class="tah p10 gray03\s*">([^<]*)<\/strong>/, row).map(x => text(x[1]));

        // spanNums[0] 은 날짜이므로 그 다음 항목이 조회수다
        const views = spanNums.length > 1 ? toInt(spanNums[1]) : null;

        const writerM = row.match(/<td class="p11 align_right"[^>]*>([\s\S]*?)<\/td>/);

        items.push({
            title,
            url:
                'https://finance.naver.com/item/board_read.naver?code=' +
                linkM[1] +
                '&nid=' +
                linkM[2],
            author: writerM ? text(writerM[1]) || null : null,
            comments: null, // 목록에서 제공하지 않음
            views,
            recommends: strongNums.length > 0 ? toInt(strongNums[0]) : null,
            postedAt: dateM ? text(dateM[1]) : null
        });
    }

    return items;
}

// 네이버는 브라우저가 아닌 User-Agent 에 대해 200 응답으로 오류 안내 페이지(약 2.7KB)를 돌려준다.
// robots.txt 는 이 경로를 허용하지만 서버가 UA 로 게이팅한다. 브라우저를 위장하지 않으므로
// 이 상태를 감지해 "blocked" 로 정직하게 기록하고, 우회를 시도하지 않는다.
function isBlocked(html) {
    return html.length < 20000 && html.indexOf('board_read.naver') === -1;
}

module.exports = {
    id: 'naver_stock',
    name: '네이버 종토방',
    url: 'https://finance.naver.com/item/board.naver?code=' + STOCK_CODE,
    provides: { views: true, comments: false },
    parse,
    isBlocked
};
