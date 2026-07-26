'use strict';

const { text, toInt, all } = require('./html');

// 루리웹 베스트. robots.txt 에 /best 관련 금지 없음.
// 주의: 우측 사이드바 `ul.hit_list > li.right_best_list_item` 은 제목만 있고 지표가 없다.
// 반드시 본문 표(tr.best_top_row)를 파싱해야 한다.
// 목록에 조회수 컬럼이 없다 → views 는 항상 null.

// 목록에는 두 종류의 행이 있다: 상단 베스트(best_top_row)와 본문 목록(mode_list).
// 둘 다 수집해야 한다. 태그 내부 공백에 관대해야 한다.
const ROW_RE = /<tr\b[^>]*class="[^"]*table_body[^"]*"[^>]*>([\s\S]*?)<\/tr>/g;

function parse(html) {
    const items = [];
    const seen = new Set();

    for (const m of all(ROW_RE, html)) {
        const row = m[1];

        const subjectM = row.match(/<td\b[^>]*class="[^"]*subject[^"]*"[^>]*>([\s\S]*?)<\/td>/);
        if (!subjectM) continue;

        const linkM = subjectM[1].match(/<a\s[^>]*href="(\/best\/board\/[^"]+)"/);
        if (!linkM) continue;

        const strongM = subjectM[1].match(/<strong\b[^>]*class="text_over"[^>]*>([\s\S]*?)<\/strong>/);
        // strong 이 없는 행은 앵커 텍스트에서 댓글수 배지를 떼고 쓴다
        const anchorM = subjectM[1].match(/<a\s[^>]*href="\/best\/board\/[^"]+"[^>]*>([\s\S]*?)<\/a>/);
        const rawTitle = strongM
            ? strongM[1]
            : anchorM
            ? anchorM[1].replace(/<span\b[^>]*class="[^"]*num_reply[^"]*"[^>]*>[\s\S]*?<\/span>/g, '')
            : '';
        const title = text(rawTitle);
        if (!title) continue;

        const url = 'https://bbs.ruliweb.com' + linkM[1].replace(/&amp;/g, '&');
        if (seen.has(url)) continue; // 상단 베스트와 본문 목록에 같은 글이 중복 노출된다
        seen.add(url);

        const replyM = subjectM[1].match(/<span\b[^>]*class="[^"]*num_reply[^"]*"[^>]*>\s*\(?(\d+)\)?\s*<\/span>/);
        const recM = row.match(/<td\b[^>]*class="[^"]*recomd[^"]*"[^>]*>([\s\S]*?)<\/td>/);
        const writerM = row.match(/<td\b[^>]*class="[^"]*writer[^"]*"[^>]*>([\s\S]*?)<\/td>/);

        items.push({
            title,
            url,
            author: writerM ? text(writerM[1]) : null,
            comments: replyM ? parseInt(replyM[1], 10) : 0,
            views: null, // 목록에서 제공하지 않음
            recommends: recM ? toInt(recM[1]) : null,
            postedAt: null
        });
    }

    return items;
}

module.exports = {
    id: 'ruliweb',
    name: '루리웹',
    url: 'https://bbs.ruliweb.com/best',
    provides: { views: false, comments: true },
    parse
};
