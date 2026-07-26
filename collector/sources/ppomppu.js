'use strict';

const { text, toInt, all } = require('./html');

// 뽐뿌 자유게시판. robots.txt `*` 가 Allow.
// **인코딩이 euc-kr 이다** (http.js 가 TextDecoder 로 디코딩한다).
// 조회수·댓글수 모두 목록에서 제공한다.
//
// 주의: 이 사이트는 속성값에 작은따옴표를 섞어 쓴다 (class='baseList-title').
// 큰따옴표만 보는 정규식은 조용히 0 을 반환한다.

const ROW_RE = /<tr\b[^>]*class=['"][^'"]*baseList[^'"]*['"][^>]*>([\s\S]*?)<\/tr>/g;

function parse(html) {
    const items = [];

    for (const m of all(ROW_RE, html)) {
        const row = m[1];

        const linkM = row.match(/<a\s[^>]*class=['"]baseList-title['"][^>]*href=['"]([^'"]*view\.php[^'"]*)['"]/);
        if (!linkM) continue;

        const noM = linkM[1].match(/[?&]no=(\d+)/);
        if (!noM) continue;

        const anchorM = row.match(/<a\s[^>]*class=['"]baseList-title['"][^>]*>([\s\S]*?)<\/a>/);
        const title = anchorM ? text(anchorM[1]) : '';
        if (!title) continue;

        const cmtM = row.match(/<span\s[^>]*class=['"]baseList-c['"][^>]*>([\s\S]*?)<\/span>/);
        const viewM = row.match(/<td\s[^>]*class=['"][^'"]*baseList-views[^'"]*['"][^>]*>([\s\S]*?)<\/td>/);
        const recM = row.match(/<td\s[^>]*class=['"][^'"]*baseList-rec[^'"]*['"][^>]*>([\s\S]*?)<\/td>/);
        const nameM = row.match(/<span\s[^>]*class=['"]baseList-name['"][^>]*>([\s\S]*?)<\/span>/);
        const timeM = row.match(/<time\s[^>]*class=['"]baseList-time['"][^>]*>([\s\S]*?)<\/time>/);

        const views = viewM ? toInt(viewM[1]) : null;
        if (views === null) continue; // 공지 행은 조회수 칸이 비어 있다

        items.push({
            title,
            url: 'https://www.ppomppu.co.kr/zboard/view.php?id=freeboard&no=' + noM[1],
            author: nameM ? text(nameM[1]) || null : null,
            // 댓글 배지가 없으면 0건이다
            comments: cmtM ? toInt(cmtM[1]) || 0 : 0,
            views,
            // 추천 칸은 값이 없을 때 빈 셀로 온다 → null (미제공이 아니라 값 없음이지만
            // 점수에 쓰지 않는 지표이므로 null 로 둔다)
            recommends: recM ? toInt(recM[1]) : null,
            postedAt: timeM ? text(timeM[1]) : null
        });
    }

    return items;
}

module.exports = {
    id: 'ppomppu',
    name: '뽐뿌',
    url: 'https://www.ppomppu.co.kr/zboard/zboard.php?id=freeboard',
    encoding: 'euc-kr',
    provides: { views: true, comments: true },
    parse
};
