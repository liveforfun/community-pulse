'use strict';

const { text, toInt, all } = require('./html');

// 인스티즈 이슈 게시판. robots.txt 에 Disallow 규칙이 없다(Sitemap 만 존재).
// 조회수·댓글수 모두 목록에서 제공한다.

// 서버 렌더 행은 <tr id="detour"> 이고 제목 칸은 <td class="r{글번호} listsubject"> 다.
// (페이지 하단에는 JS 로 행을 append 하는 스크립트 문자열이 있는데, 그 안의
//  <td class="listsubject"> 는 실제 데이터가 아니므로 r{숫자} 접두사를 반드시 요구한다.)
const ROW_RE = /<tr\b[^>]*id="detour"[^>]*>([\s\S]*?)<\/tr>/g;

function parse(html) {
    const items = [];

    for (const m of all(ROW_RE, html)) {
        const row = m[1];

        const subjectM = row.match(/<td\b[^>]*class="r\d+\s+listsubject"[^>]*>([\s\S]*?)<\/td>/);
        if (!subjectM) continue;

        const linkM = subjectM[1].match(/href="(https:\/\/www\.instiz\.net\/pt\/\d+)[^"]*"/);
        if (!linkM) continue;

        // 댓글수 배지는 제목 <a> 안에 섞여 있다. 제목을 뽑기 전에 떼어낸다.
        // title 속성("유효 댓글 수 148")과 표시값(262)이 다른데, 사이트가 사용자에게
        // 보여주는 표시값을 쓴다(화면과 대조 검증이 가능해야 한다).
        const cmtM = subjectM[1].match(/<span\b[^>]*class="cmt\d*"[^>]*>([\s\S]*?)<\/span>/);
        const withoutCmt = subjectM[1].replace(/<span\b[^>]*class="cmt\d*"[^>]*>[\s\S]*?<\/span>/g, '');
        const title = text(withoutCmt);
        if (!title) continue;

        // td.listno 3개가 순서대로 시각 / 조회수 / 추천
        const listnos = all(/<td\b[^>]*class="listno"[^>]*>([\s\S]*?)<\/td>/, row).map(x => text(x[1]));

        items.push({
            title,
            url: linkM[1],
            author: null, // 목록에서 익명 처리되어 제공되지 않음
            comments: cmtM ? toInt(cmtM[1]) : 0,
            views: listnos.length > 1 ? toInt(listnos[1]) : null,
            recommends: listnos.length > 2 ? toInt(listnos[2]) : null,
            postedAt: listnos.length > 0 ? listnos[0] : null
        });
    }

    return items;
}

module.exports = {
    id: 'instiz',
    name: '인스티즈',
    url: 'https://www.instiz.net/pt',
    provides: { views: true, comments: true },
    parse
};
