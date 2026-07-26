'use strict';

const { text, toInt, all } = require('./html');

// 디시인사이드 갤러리 목록. 주식갤(neostock)·부동산갤(immovables) 공용.
// robots.txt: `User-agent: *` 는 `Allow: /`. 차단 갤러리 14개 목록에 neostock 없음,
// immovables 는 개별 글 2건만 차단되고 목록은 허용된다. 목록만 수집한다.

const ROW_RE = /<tr class="ub-content us-post"([^>]*)>([\s\S]*?)<\/tr>/g;

function parse(html, gid) {
    const items = [];

    for (const m of all(ROW_RE, html)) {
        const attrs = m[1];
        const row = m[2];

        // 공지·설문 행 제외
        if (/data-type="icon_notice"/.test(attrs)) continue;

        const linkM = row.match(/<a\s+href="(\/board\/view\/\?id=[^"]+)"/);
        if (!linkM) continue;

        const titleCellM = row.match(/<td class="gall_tit[^"]*">([\s\S]*?)<\/td>/);
        if (!titleCellM) continue;

        // 제목 링크 안에서 아이콘(<em>)과 댓글수 배지(reply_numbox)를 걷어낸다
        const anchorM = titleCellM[1].match(/<a\s+href="\/board\/view\/[^"]*"[^>]*>([\s\S]*?)<\/a>/);
        const title = anchorM ? text(anchorM[1]) : '';
        if (!title) continue;

        const replyM = titleCellM[1].match(/<span class="reply_num">\[?(\d+)\]?<\/span>/);
        const viewsM = row.match(/<td class="gall_count">([\s\S]*?)<\/td>/);
        const recM = row.match(/<td class="gall_recommend">([\s\S]*?)<\/td>/);
        const nickM = row.match(/<td class="gall_writer[^"]*"[^>]*data-nick="([^"]*)"/);
        const dateM = row.match(/<td class="gall_date"[^>]*title="([^"]*)"/);

        const href = linkM[1].replace(/&amp;/g, '&');

        items.push({
            title,
            url: 'https://gall.dcinside.com' + href,
            author: nickM ? nickM[1] : null,
            // 댓글 배지가 없으면 댓글 0건이라는 뜻이다 (미제공이 아니므로 0)
            comments: replyM ? parseInt(replyM[1], 10) : 0,
            views: viewsM ? toInt(viewsM[1]) : null,
            recommends: recM ? toInt(recM[1]) : null,
            postedAt: dateM ? dateM[1] : null
        });
    }

    return items;
}

function make(id, name, gid) {
    return {
        id,
        name,
        url: 'https://gall.dcinside.com/board/lists/?id=' + gid,
        provides: { views: true, comments: true },
        parse: html => parse(html, gid)
    };
}

module.exports = { make };
