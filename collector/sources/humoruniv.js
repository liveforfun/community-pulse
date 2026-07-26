'use strict';

const { text, toInt, all } = require('./html');

// 웃긴대학 베스트(pds). robots.txt 에 이 경로 관련 금지 규칙이 없다.
// **인코딩이 euc-kr 이다.**
// 조회수·댓글수 모두 목록에서 제공한다.
//
// 행 안에 프로필 아이콘용 <table> 이 중첩되어 있어 <tr>…</tr> 정규식이 행 중간에서 끊긴다.
// 시작 마커(<tr id="li_chk_pds-숫자">)로 경계를 잘라야 한다.
const ROW_START = /<tr[^>]*id="li_chk_[a-z]+-\d+"[^>]*>/g;

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
        const linkM = row.match(/href=["'](read\.html\?table=[^"'&]+&(?:amp;)?number=(\d+))["']/);
        if (!linkM) return;

        const titleM = row.match(/<span\s[^>]*id="title_chk_[a-z]+-\d+"[^>]*>([\s\S]*?)<\/span>/);
        const title = titleM ? text(titleM[1]) : '';
        if (!title) return;

        const cmtM = row.match(/<span\s[^>]*class="list_comment_num"[^>]*>\s*\[?(\d+)\]?\s*<\/span>/);

        // td.li_und 셀이 순서대로 조회수 / 추천 / 비추천 이다
        const undCells = all(/<td\b[^>]*class="li_und"[^>]*>([\s\S]*?)<\/td>/, row).map(x => text(x[1]));

        const dateM = row.match(/<span\s[^>]*class="w_date"[^>]*>([\s\S]*?)<\/span>/);
        const timeM = row.match(/<span\s[^>]*class="w_time"[^>]*>([\s\S]*?)<\/span>/);
        const nickM = row.match(/<span\s[^>]*class=hu_nick_txt[^>]*>([\s\S]*?)<\/span>/) ||
                      row.match(/<span\s[^>]*class="hu_nick_txt"[^>]*>([\s\S]*?)<\/span>/);

        const views = undCells.length > 0 ? toInt(undCells[0]) : null;
        if (views === null) return;

        items.push({
            title,
            url: 'https://web.humoruniv.com/board/humor/' +
                linkM[1].replace(/&amp;/g, '&'),
            author: nickM ? text(nickM[1]) || null : null,
            comments: cmtM ? parseInt(cmtM[1], 10) : 0,
            views,
            recommends: undCells.length > 1 ? toInt(undCells[1]) : null,
            postedAt: dateM ? text(dateM[1]) + (timeM ? ' ' + text(timeM[1]) : '') : null
        });
    });

    return items;
}

module.exports = {
    id: 'humoruniv',
    name: '웃긴대학',
    url: 'https://web.humoruniv.com/board/humor/list.html?table=pds',
    encoding: 'euc-kr',
    provides: { views: true, comments: true },
    parse
};
