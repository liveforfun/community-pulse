'use strict';

const { text, toInt } = require('./html');

// 아카라이브 라이브 채널(전체 채널 통합 목록). robots.txt `*` 가 Allow.
// 조회수·댓글수 모두 목록에서 제공한다.
//
// 행은 <div class="vrow hybrid"> 이고 공지·광고는 class 에 notice 가, 헤더 행에는 head 가 붙는다.
// 중첩 div 때문에 닫는 태그를 맞출 수 없어 시작 마커로 경계를 자른다.
//
// 주의: `class="vrow[^"]*"` 로 쓰면 내부 컨테이너(vrow-inner, vrow-top, vrow-bottom,
// vrow-preview)까지 매칭되어 슬라이스가 65자로 잘린다(조회수가 전부 null 이 되는 원인).
// vrow 를 **단어 단위**로 매칭해야 한다.
const ROW_START = /<div[^>]*class="vrow(?:\s[^"]*)?"[^>]*>/g;

function sliceRows(html) {
    const positions = [];
    const classes = [];
    let m;
    const re = new RegExp(ROW_START.source, 'g');
    while ((m = re.exec(html)) !== null) {
        positions.push(m.index);
        classes.push(m[0]);
    }
    return positions.map((start, i) => ({
        openTag: classes[i],
        html: html.slice(start, i + 1 < positions.length ? positions[i + 1] : Math.min(html.length, start + 4000))
    }));
}

function parse(html) {
    const items = [];

    sliceRows(html).forEach(row => {
        if (/notice/.test(row.openTag)) return; // 공지·광고 제외
        if (/\bhead\b/.test(row.openTag)) return; // 컬럼 제목 행 제외

        const linkM = row.html.match(/<a\s[^>]*class="title[^"]*"[^>]*href="(\/b\/[^"?]+)/);
        if (!linkM) return;

        const anchorM = row.html.match(/<a\s[^>]*class="title[^"]*"[^>]*>([\s\S]*?)<\/a>/);
        if (!anchorM) return;

        // 앵커 안에 미디어 아이콘과 댓글수 배지(span.info)가 섞인다. 떼어내고 텍스트만 취한다.
        const inner = anchorM[1]
            .replace(/<span\s[^>]*class="info"[^>]*>[\s\S]*?<\/span>\s*<\/span>/g, '')
            .replace(/<span\s[^>]*class="info"[^>]*>[\s\S]*?<\/span>/g, '')
            .replace(/<span\s[^>]*class="media-icon[^"]*"[^>]*>[\s\S]*?<\/span>/g, '');
        const title = text(inner);
        if (!title) return;

        const cmtM = row.html.match(/<span\s[^>]*class="comment-count"[^>]*>\s*\[?(\d+)\]?\s*<\/span>/);
        const viewM = row.html.match(/<span\s[^>]*class="vcol col-view"[^>]*>([\s\S]*?)<\/span>/);
        const rateM = row.html.match(/<span\s[^>]*class="vcol col-rate[^"]*"[^>]*>([\s\S]*?)<\/span>/);
        const authorM = row.html.match(/<span\s[^>]*class="vcol col-author"[^>]*>([\s\S]*?)<\/span>\s*<\/span>/);
        const timeM = row.html.match(/<time\s[^>]*datetime="([^"]*)"/);

        items.push({
            title,
            url: 'https://arca.live' + linkM[1],
            author: authorM ? text(authorM[1]) || null : null,
            comments: cmtM ? parseInt(cmtM[1], 10) : 0,
            views: viewM ? toInt(viewM[1]) : null,
            recommends: rateM ? toInt(rateM[1]) : null,
            postedAt: timeM ? timeM[1] : null
        });
    });

    return items;
}

module.exports = {
    id: 'arcalive',
    name: '아카라이브',
    url: 'https://arca.live/b/live',
    encoding: 'utf-8',
    provides: { views: true, comments: true },
    parse
};
