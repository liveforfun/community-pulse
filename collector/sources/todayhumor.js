'use strict';

const { text, toInt, all } = require('./html');

// 오늘의유머 베스트오브베스트.
//
// robots.txt: `User-agent: * → Allow: /` (AI 학습 크롤러는 이름으로 차단되지만 우리는 해당 없음)
// Content-Signal: `search=yes, ai-train=no, use=reference`
//   → 제목을 인용하고 원문으로 링크하는 이 용도는 `use=reference` 에 해당한다.
//     학습 데이터로 쓰지 않는다.
// 조회수·댓글수 모두 목록에서 제공한다.

const ROW_RE = /<tr\b[^>]*class="[^"]*list_tr_[^"]*"[^>]*>([\s\S]*?)<\/tr>/g;

function parse(html) {
    const items = [];

    for (const m of all(ROW_RE, html)) {
        const row = m[1];

        const subjectM = row.match(/<td\b[^>]*class="subject"[^>]*>([\s\S]*?)<\/td>/);
        if (!subjectM) continue;

        const linkM = subjectM[1].match(/<a\s[^>]*href="([^"]*view\.php[^"]*)"/);
        if (!linkM) continue;

        const noM = linkM[1].match(/[?&]no=(\d+)/);
        if (!noM) continue;

        // 제목 앵커 뒤에 댓글수 배지와 아이콘 이미지가 붙는다. 앵커 내부만 취한다.
        const anchorM = subjectM[1].match(/<a\s[^>]*href="[^"]*view\.php[^"]*"[^>]*>([\s\S]*?)<\/a>/);
        const title = anchorM ? text(anchorM[1]) : '';
        if (!title) continue;

        // 이 사이트는 속성값에 작은따옴표를 쓴다 (class='list_memo_count_span').
        // 큰따옴표만 보면 댓글수가 조용히 0 으로 떨어진다.
        const cmtM = subjectM[1].match(/<span\b[^>]*class=['"]list_memo_count_span['"][^>]*>\s*\[?(\d+)\]?\s*<\/span>/);
        const hitsM = row.match(/<td\b[^>]*class="hits"[^>]*>([\s\S]*?)<\/td>/);
        const okM = row.match(/<td\b[^>]*class="oknok"[^>]*>([\s\S]*?)<\/td>/);
        const nameM = row.match(/<td\b[^>]*class="name"[^>]*>([\s\S]*?)<\/td>/);
        const dateM = row.match(/<td\b[^>]*class="date"[^>]*>([\s\S]*?)<\/td>/);

        // 공지·이벤트 행은 조회수 칸이 비어 있다
        const views = hitsM ? toInt(hitsM[1]) : null;
        if (views === null) continue;

        items.push({
            title,
            url: 'https://www.todayhumor.co.kr/board/view.php?table=bestofbest&no=' + noM[1],
            author: nameM ? text(nameM[1]) || null : null,
            // 댓글 배지가 없으면 댓글 0건이다 (미제공이 아니다)
            comments: cmtM ? parseInt(cmtM[1], 10) : 0,
            views,
            recommends: okM ? toInt(okM[1]) : null,
            postedAt: dateM ? text(dateM[1]) : null
        });
    }

    return items;
}

module.exports = {
    id: 'todayhumor',
    name: '오늘의유머',
    url: 'https://www.todayhumor.co.kr/board/list.php?table=bestofbest',
    provides: { views: true, comments: true },
    parse
};
