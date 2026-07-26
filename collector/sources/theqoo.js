'use strict';

const { text, toInt, all } = require('./html');

// 더쿠 핫게시판.
//
// robots.txt 가 404 로 존재하지 않아 크롤 제한 규칙이 없다. 그래도 목록 페이지만 요청하고
// 요청 간 지연을 지킨다.
// 조회수·댓글수 모두 목록에서 제공한다.
//
// 공지·이벤트 행 구분: 일반 글은 `<td class="no">` 가 순수 숫자이고, 공지는
// `<td class="no"><strong>공지</strong></td>` 또는 `<tr class="notice">` 다.

const ROW_RE = /<tr\b([^>]*)>([\s\S]*?)<\/tr>/g;

function parse(html) {
    const items = [];

    for (const m of all(ROW_RE, html)) {
        const attrs = m[1];
        const row = m[2];

        if (/class="[^"]*notice/.test(attrs)) continue;

        // 글번호가 순수 숫자인 행만 실제 게시글이다
        const noM = row.match(/<td\b[^>]*class="no"[^>]*>([\s\S]*?)<\/td>/);
        if (!noM || !/^\d+$/.test(text(noM[1]).replace(/,/g, ''))) continue;

        const titleCellM = row.match(/<td\b[^>]*class="title"[^>]*>([\s\S]*?)<\/td>/);
        if (!titleCellM) continue;

        const linkM = titleCellM[1].match(/<a\s[^>]*href="(\/hot\/\d+)"[^>]*>([\s\S]*?)<\/a>/);
        if (!linkM) continue;

        const title = text(linkM[2]);
        if (!title) continue;

        const replyM = titleCellM[1].match(/<a\b[^>]*class="replyNum"[^>]*>([\s\S]*?)<\/a>/);
        const viewM = row.match(/<td\b[^>]*class="m_no"[^>]*>([\s\S]*?)<\/td>/);
        const timeM = row.match(/<td\b[^>]*class="time"[^>]*>([\s\S]*?)<\/td>/);
        const cateM = row.match(/<td\b[^>]*class="cate"[^>]*>([\s\S]*?)<\/td>/);

        items.push({
            title,
            url: 'https://theqoo.net' + linkM[1],
            // 목록에서 작성자를 제공하지 않는다
            author: cateM ? text(cateM[1]) || null : null,
            comments: replyM ? toInt(replyM[1]) : 0,
            views: viewM ? toInt(viewM[1]) : null,
            recommends: null, // 목록에서 제공하지 않음
            postedAt: timeM ? text(timeM[1]) : null
        });
    }

    return items;
}

module.exports = {
    id: 'theqoo',
    name: '더쿠',
    url: 'https://theqoo.net/hot',
    provides: { views: true, comments: true },
    parse
};
