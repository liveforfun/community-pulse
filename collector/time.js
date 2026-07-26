'use strict';

// 작성시간 정규화.
//
// 사이트마다 표기가 제각각이다: 완전한 타임스탬프, "MM.DD HH:MM", 시각만, 날짜만, 상대시각.
// 이걸 절대 시각(ISO)으로 통일해야 "이 슬롯 창에 쓰인 글인가"를 판단할 수 있다.
//
// 반환하는 precision 은 신뢰도를 나타낸다:
//   'minute' — 분 단위까지 확정
//   'day'    — 날짜만 확정(시각 불명). 창 판정에 쓰면 안 된다
//   null     — 파싱 실패

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/** KST 기준 연/월/일을 얻는다 */
function kstParts(date) {
    const k = new Date(date.getTime() + KST_OFFSET_MS);
    return { y: k.getUTCFullYear(), m: k.getUTCMonth() + 1, d: k.getUTCDate() };
}

/** KST 기준 연월일시분초 → UTC Date */
function fromKst(y, mo, d, h, mi, s) {
    return new Date(Date.UTC(y, mo - 1, d, h || 0, mi || 0, s || 0) - KST_OFFSET_MS);
}

/**
 * @param {string} raw 사이트가 준 원문
 * @param {Date} now 기준 시각(수집 시각)
 * @returns {{iso: string, precision: 'minute'|'day'}|null}
 */
function normalizePostedAt(raw, now) {
    if (!raw) return null;
    const s = String(raw).trim();
    if (!s) return null;

    const ref = now || new Date();
    const today = kstParts(ref);
    let m;

    // 상대 시각: "3 분 전", "2시간 전"
    if ((m = s.match(/^(\d+)\s*분\s*전$/))) {
        return { iso: new Date(ref.getTime() - +m[1] * 60000).toISOString(), precision: 'minute' };
    }
    if ((m = s.match(/^(\d+)\s*시간\s*전$/))) {
        return { iso: new Date(ref.getTime() - +m[1] * 3600000).toISOString(), precision: 'minute' };
    }

    // 완전한 형태: 2026-07-26 22:19:46 / 2026-07-26T22:19
    if ((m = s.match(/^(\d{4})[-.\/](\d{1,2})[-.\/](\d{1,2})[ T](\d{1,2}):(\d{2})(?::(\d{2}))?$/))) {
        return { iso: fromKst(+m[1], +m[2], +m[3], +m[4], +m[5], +(m[6] || 0)).toISOString(), precision: 'minute' };
    }

    // 두 자리 연도 + 시각: 26.07.26 23:46:25 (뽐뿌)
    if ((m = s.match(/^(\d{2})[-.\/](\d{1,2})[-.\/](\d{1,2})[ T](\d{1,2}):(\d{2})(?::(\d{2}))?$/))) {
        return { iso: fromKst(2000 + +m[1], +m[2], +m[3], +m[4], +m[5], +(m[6] || 0)).toISOString(), precision: 'minute' };
    }

    // 월일 + 시각: 07.26 20:26 (인스티즈)
    if ((m = s.match(/^(\d{1,2})[.\/-](\d{1,2})\s+(\d{1,2}):(\d{2})$/))) {
        let year = today.y;
        let d = fromKst(year, +m[1], +m[2], +m[3], +m[4], 0);
        // 미래로 계산되면 작년 글이다 (연말·연초 경계)
        if (d.getTime() - ref.getTime() > 24 * 3600 * 1000) d = fromKst(year - 1, +m[1], +m[2], +m[3], +m[4], 0);
        return { iso: d.toISOString(), precision: 'minute' };
    }

    // 시각만: 22:20 / 23:11:05 → 오늘(KST)
    if ((m = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/))) {
        let d = fromKst(today.y, today.m, today.d, +m[1], +m[2], +(m[3] || 0));
        // 수집 시각보다 미래면 어제 글이다 (자정 직후 경계)
        if (d.getTime() - ref.getTime() > 60 * 1000) d = new Date(d.getTime() - 24 * 3600 * 1000);
        return { iso: d.toISOString(), precision: 'minute' };
    }

    // 날짜만: 2026-07-26 / 26.07.26 / 07.26 → 시각 불명
    if ((m = s.match(/^(\d{4})[-.\/](\d{1,2})[-.\/](\d{1,2})$/))) {
        return { iso: fromKst(+m[1], +m[2], +m[3], 0, 0, 0).toISOString(), precision: 'day' };
    }
    if ((m = s.match(/^(\d{2})[-.\/](\d{1,2})[-.\/](\d{1,2})$/))) {
        return { iso: fromKst(2000 + +m[1], +m[2], +m[3], 0, 0, 0).toISOString(), precision: 'day' };
    }
    if ((m = s.match(/^(\d{1,2})[.\/-](\d{1,2})$/))) {
        let year = today.y;
        let d = fromKst(year, +m[1], +m[2], 0, 0, 0);
        if (d.getTime() - ref.getTime() > 24 * 3600 * 1000) d = fromKst(year - 1, +m[1], +m[2], 0, 0, 0);
        return { iso: d.toISOString(), precision: 'day' };
    }

    // ISO 문자열이 그대로 온 경우 (아카라이브의 <time datetime="...">)
    const parsed = Date.parse(s);
    if (!isNaN(parsed)) return { iso: new Date(parsed).toISOString(), precision: 'minute' };

    return null;
}

module.exports = { normalizePostedAt, KST_OFFSET_MS };
