'use strict';

const { text, toInt, all } = require('./html');

// 인벤 오픈이슈갤러리. robots.txt 에 이 경로 관련 금지 규칙이 없다.
// 조회수·댓글수 모두 목록에서 제공한다.

// 공지 행은 <tr class="notice all"> 이고 조회수가 수년간 누적되어 100만 단위다.
// 걸러내지 않으면 공지가 순위를 영구히 점령한다.
const ROW_RE = /<tr\b([^>]*)>([\s\S]*?)<\/tr>/g;

function parse(html) {
    const items = [];

    for (const m of all(ROW_RE, html)) {
        const attrs = m[1];
        const row = m[2];

        if (/class="[^"]*notice/.test(attrs)) continue;
        if (/<span\b[^>]*class="notice-icon"/.test(row)) continue;

        const titleCellM = row.match(/<td\b[^>]*class="tit"[^>]*>([\s\S]*?)<\/td>/);
        if (!titleCellM) continue;

        const linkM = titleCellM[1].match(/<a\s[^>]*class="subject-link"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
        if (!linkM) continue;

        // 제목 앞에 <span class="category">[이슈]</span> 가 붙는다. 떼어낸다.
        const title = text(linkM[2].replace(/<span\s[^>]*class="category"[^>]*>[\s\S]*?<\/span>/g, ''));
        if (!title) continue;

        const cmtM = titleCellM[1].match(/<span\b[^>]*class="con-comment"[^>]*>\s*\[?(\d+)\]?\s*<\/span>/);
        const viewM = row.match(/<td\b[^>]*class="view"[^>]*>([\s\S]*?)<\/td>/);
        const recoM = row.match(/<td\b[^>]*class="reco"[^>]*>([\s\S]*?)<\/td>/);
        const userM = row.match(/<span\s[^>]*class="layerNickName"[^>]*>([\s\S]*?)<\/span>/);
        const dateM = row.match(/<td\b[^>]*class="date"[^>]*>([\s\S]*?)<\/td>/);

        const views = viewM ? toInt(viewM[1]) : null;
        if (views === null) continue; // 공지 행은 조회수 칸이 비어 있다

        items.push({
            title,
            url: linkM[1].indexOf('http') === 0 ? linkM[1] : 'https://www.inven.co.kr' + linkM[1],
            author: userM ? text(userM[1]) || null : null,
            comments: cmtM ? parseInt(cmtM[1], 10) : 0,
            views,
            recommends: recoM ? toInt(recoM[1]) : null,
            postedAt: dateM ? text(dateM[1]) : null
        });
    }

    return items;
}

module.exports = {
    id: 'inven',
    name: '인벤 오픈이슈',
    url: 'https://www.inven.co.kr/board/webzine/2097',
    encoding: 'utf-8',
    provides: { views: true, comments: true },
    parse
};
