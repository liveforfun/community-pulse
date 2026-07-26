'use strict';

// 외부 의존성 없이 쓰는 최소 HTML 유틸. 정규식 파싱이므로 사이트 개편에 취약하다.
// 파서가 0건을 반환하면 collect.js 가 status:"empty" 로 기록해 추적 가능하게 한다.

const ENTITIES = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': "'",
    '&nbsp;': ' ',
    '&#039;': "'",
    '&#39;': "'"
};

function decodeEntities(s) {
    if (!s) return '';
    return s
        .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
        .replace(/&[a-z]+;|&#0?39;/gi, m => (ENTITIES[m] !== undefined ? ENTITIES[m] : m));
}

function stripTags(s) {
    if (!s) return '';
    return s.replace(/<[^>]*>/g, '');
}

/** 태그 제거 + 엔티티 해제 + 공백 정규화 */
function text(s) {
    return decodeEntities(stripTags(s)).replace(/\s+/g, ' ').trim();
}

/**
 * 숫자 추출. 쉼표·대괄호·괄호를 걷어낸다.
 * 값이 없거나 숫자가 아니면 null (0 과 구분해야 한다 — null 은 "미제공"이고 0 은 "0건"이다)
 */
function toInt(s) {
    if (s === null || s === undefined) return null;
    const m = String(s).replace(/,/g, '').match(/-?\d+/);
    return m ? parseInt(m[0], 10) : null;
}

/** 정규식 전역 매칭 결과를 배열로. Node 16 의 matchAll 을 쓰되 g 플래그를 보장한다. */
function all(re, s) {
    const flags = re.flags.indexOf('g') === -1 ? re.flags + 'g' : re.flags;
    return Array.from(String(s).matchAll(new RegExp(re.source, flags)));
}

module.exports = { decodeEntities, stripTags, text, toInt, all };
