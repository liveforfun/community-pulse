'use strict';

const { text, toInt, all } = require('./html');

// 에펨코리아 베스트. robots.txt 의 `User-agent: *` 는 `Disallow: /` 이지만
// `Allow: /best` 가 있어 베스트 목록·글은 허용된다.
// 목록에 조회수 컬럼이 없다 → views 는 항상 null (추정값을 넣지 않는다).

// 태그 내부에 탭·줄바꿈이 섞이므로 공백에 관대해야 한다.
// 또 UA 에 따라 두 가지 템플릿이 내려온다: 제목 링크가 `/best/{id}` 인 형태와
// `/index.php?...&document_srl={id}` 인 형태. 양쪽 모두 처리한다.
const ROW_RE = /<li\b[^>]*class="[^"]*li_best2[^"]*"[^>]*>([\s\S]*?)<\/li>/g;

function parse(html) {
    const items = [];

    for (const m of all(ROW_RE, html)) {
        const row = m[1];

        const titleM = row.match(/<h3\b[^>]*class="title"[^>]*>([\s\S]*?)<\/h3>/);
        if (!titleM) continue;

        const linkM =
            titleM[1].match(/<a\s[^>]*href="\/best\/(\d+)"/) ||
            titleM[1].match(/<a\s[^>]*href="[^"]*document_srl=(\d+)"/);
        if (!linkM) continue;

        // 제목 본문은 span.ellipsis-target 안에 있다. 없는 템플릿이면 댓글수 배지를 떼고 앵커 텍스트를 쓴다.
        const spanM = titleM[1].match(/<span\b[^>]*class="ellipsis-target"[^>]*>([\s\S]*?)<\/span>/);
        const anchorM = titleM[1].match(/<a\s[^>]*>([\s\S]*?)<\/a>/);
        const rawTitle = spanM
            ? spanM[1]
            : anchorM
            ? anchorM[1].replace(/<span\b[^>]*class="comment_count"[^>]*>[\s\S]*?<\/span>/g, '')
            : '';
        const title = text(rawTitle);
        if (!title) continue;

        const commentM = titleM[1].match(/<span\b[^>]*class="comment_count"[^>]*>\s*\[?(\d+)\]?\s*<\/span>/);
        const votedM = row.match(/class="pc_voted_count[^"]*"[^>]*>[\s\S]*?<span\b[^>]*class="count"[^>]*>([\s\S]*?)<\/span>/);
        const authorM = row.match(/<span\b[^>]*class="author"[^>]*>([\s\S]*?)<\/span>/);
        const regM = row.match(/<span\b[^>]*class="regdate"[^>]*>([\s\S]*?)<\/span>/);

        items.push({
            title,
            url: 'https://www.fmkorea.com/best/' + linkM[1],
            author: authorM ? text(authorM[1]).replace(/^\/\s*/, '') : null,
            comments: commentM ? parseInt(commentM[1], 10) : 0,
            views: null, // 목록에서 제공하지 않음
            recommends: votedM ? toInt(votedM[1]) : null,
            postedAt: regM ? text(regM[1].replace(/<!--[\s\S]*?-->/g, '')) : null
        });
    }

    return items;
}

module.exports = {
    id: 'fmkorea',
    name: '에펨코리아',
    url: 'https://www.fmkorea.com/best',
    provides: { views: false, comments: true },
    parse
};
