'use strict';

const { text, toInt } = require('./html');

// 클리앙 모두의공원. robots.txt `User-agent: *` 가 이 경로를 Allow.
// 조회수·댓글수 모두 목록에서 제공한다. 댓글수는 행 자체의 data-comment-count 속성에 있다.
//
// 행이 중첩 <div> 로 끝나서 정규식으로 닫는 태그를 맞추기 어렵다.
// 시작 마커로 경계를 잘라 행 단위 슬라이스를 만든다.
const ROW_START = /<div[^>]*class="list_item[^"]*"[^>]*>/g;

function sliceRows(html) {
    const positions = [];
    let m;
    const re = new RegExp(ROW_START.source, 'g');
    while ((m = re.exec(html)) !== null) positions.push(m.index);

    return positions.map((start, i) =>
        html.slice(start, i + 1 < positions.length ? positions[i + 1] : Math.min(html.length, start + 4000))
    );
}

function parse(html) {
    const items = [];

    sliceRows(html).forEach(row => {
        const linkM = row.match(/<a\s[^>]*class="list_subject"[^>]*href="(\/service\/board\/[^"?]+)/);
        if (!linkM) return;

        // 제목은 title 속성이 가장 깔끔하다(내부에 아이콘 span 이 섞인다)
        const titleAttrM = row.match(/<span\s[^>]*class="subject_fixed"[^>]*title="([^"]*)"/);
        const titleTextM = row.match(/<span\s[^>]*class="subject_fixed"[^>]*>([\s\S]*?)<\/span>/);
        const title = titleAttrM ? text(titleAttrM[1]) : titleTextM ? text(titleTextM[1]) : '';
        if (!title) return;

        // 댓글수는 행 속성에 있다 (data-comment-count=15). 속성값에 따옴표가 없다.
        const cmtAttrM = row.match(/data-comment-count=["']?(\d+)/);
        const cmtSpanM = row.match(/<span\s[^>]*class="rSymph05"[^>]*>([\s\S]*?)<\/span>/);
        const hitM = row.match(/<span\s[^>]*class="hit"[^>]*>([\s\S]*?)<\/span>/);
        const likeM = row.match(/<div\s[^>]*data-role="list-like-count"[^>]*>\s*<span>([\s\S]*?)<\/span>/);
        const nickM = row.match(/<span\s[^>]*class="nickname"[^>]*>([\s\S]*?)<\/span>\s*<\/div>/);
        const timeM = row.match(/<span\s[^>]*class="timestamp"[^>]*>([\s\S]*?)<\/span>/);

        const views = hitM ? toInt(hitM[1]) : null;
        if (views === null) return; // 공지·광고 행은 조회수 칸이 없다

        items.push({
            title,
            url: 'https://www.clien.net' + linkM[1],
            author: nickM ? text(nickM[1]) || null : null,
            comments: cmtAttrM ? parseInt(cmtAttrM[1], 10) : cmtSpanM ? toInt(cmtSpanM[1]) : 0,
            views,
            recommends: likeM ? toInt(likeM[1]) : null,
            postedAt: timeM ? text(timeM[1]) : null
        });
    });

    return items;
}

module.exports = {
    id: 'clien',
    name: '클리앙',
    url: 'https://www.clien.net/service/board/park',
    encoding: 'utf-8',
    provides: { views: true, comments: true },
    parse
};
