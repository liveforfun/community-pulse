'use strict';

// 키워드 추출·집계.
//
// 한국어 형태소 분석기 없이(외부 의존성 0) 제목을 토큰화한다. 따라서 완벽한 명사 추출이
// 아니라 "제목에 자주 등장한 표현" 수준이다. 조사 일부만 보수적으로 떼어낸다.
//
// 노출량(exposure)의 정의: (스냅샷 × 그 스냅샷에서 해당 키워드를 포함한 글) 의 합.
// 같은 글이 48개 슬롯에 계속 걸려 있으면 48로 계산된다 — 게시판에 얼마나 오래·널리
// 노출됐는지를 나타내는 값이다. 고유 글 수가 아니다.

const fs = require('fs');
const path = require('path');

const MIN_LEN = 2;
const MAX_LEN = 12;
const PER_SNAPSHOT_LIMIT = 150;
const AGGREGATE_LIMIT = 120;

// 키워드 집계 창. 원본 보관 기간(snapshot.js 의 RETENTION_DAYS)과 **별개**로 둔다.
//   - 창 <= 보관 기간  → 전부 원본에서 집계된다(현재 상태: 둘 다 7일).
//   - 창 >  보관 기간  → 보관 기간을 넘긴 날은 일별 요약의 keywords 에서 집계된다.
// 즉 창을 늘리기만 하면 원본 없이도 과거 키워드가 이어진다.
const WINDOW_DAYS = 7;

// 짧은 조사·대명사·감탄 위주. 내용어는 넣지 않는다.
const STOPWORDS = new Set([
    '그리고', '하지만', '그래서', '그런데', '근데', '이거', '그거', '저거', '요즘', '지금',
    '진짜', '너무', '완전', '역시', '드디어', '결국', '갑자기', '다들', '오늘', '내일', '어제',
    '있는', '없는', '하는', '되는', '같은', '이런', '저런', '그런', '무슨', '어떤', '什么',
    '나는', '내가', '우리', '너희', '자기', '본인', '여기', '거기', '저기', '이제', '아직',
    '정도', '경우', '때문', '이후', '이전', '중에', '중인', '관련', '기준', '가장', '제일',
    '진행', '예정', '발생', '확인', '공개', '등장', '이유', '방법', '상태', '현재',
    // 형태소 분석기가 없어 걸러지지 않는 활용형·관형어 노이즈 (실데이터에서 상위권에 올라온 것들)
    '이상', '다른', '대한', '위한', '통해', '대해', '라며', '하며', '지만', '면서',
    '빠진', '생각', '생각하면', '오늘자', '보고', '보면', '해서', '하고', '되고', '이건',
    '그냥', '역대', '이번', '저번', '다시', '가면', '했는데', '하는데', '됐다', '했다'
]);

// 토큰 끝에 붙은 조사를 떼어낸다. 떼고 남는 길이가 2자 이상일 때만 적용한다.
const PARTICLES = [
    '에서는', '으로는', '에게는', '에서', '으로', '에게', '한테', '까지', '부터', '보다',
    '이라', '라는', '이란', '라고', '이나', '나마', '조차', '마저',
    '은', '는', '이', '가', '을', '를', '의', '에', '와', '과', '도', '만', '로'
];

function stripParticle(token) {
    for (const p of PARTICLES) {
        if (token.length >= p.length + 2 && token.endsWith(p)) {
            return token.slice(0, token.length - p.length);
        }
    }
    return token;
}

/** 제목 하나를 키워드 토큰 집합으로 (한 글 안에서 같은 단어는 1회로 센다) */
function tokenize(title) {
    let s = String(title || '');

    s = s.replace(/\.(jpg|jpeg|png|gif|webp|mp4|webm|txt|avi|mov)\b/gi, ' ');
    s = s.replace(/[ㅋㅎㄷㅠㅜㅡ]{2,}/g, ' ');
    // 한글·영문·숫자만 남긴다
    s = s.replace(/[^가-힣a-zA-Z0-9\s]/g, ' ');

    const out = new Set();

    for (let raw of s.split(/\s+/)) {
        if (!raw) continue;
        let token = raw.toLowerCase();
        if (/^\d+$/.test(token)) continue; // 순수 숫자 제외

        token = stripParticle(token);

        if (token.length < MIN_LEN || token.length > MAX_LEN) continue;
        // 영문·숫자만으로 된 토큰은 3자 이상만 (2자는 vs, ai, tv 같은 노이즈가 대부분)
        if (/^[a-z0-9]+$/.test(token) && token.length < 3) continue;
        if (STOPWORDS.has(token)) continue;
        // 자모만 남은 조각 제외
        if (/^[ㄱ-ㅎㅏ-ㅣ]+$/.test(token)) continue;

        out.add(token);
    }

    return out;
}

/**
 * 스냅샷 한 건의 키워드 집계.
 * @param {Array} items {title, community} 목록 (중복 글은 호출 전에 정리되어 있어야 한다)
 * @returns {Array<{w:string, n:number, c:Object}>} n = 이 스냅샷에서 해당 키워드를 포함한 글 수
 */
function summarizeSnapshot(items) {
    const map = new Map();

    items.forEach(item => {
        tokenize(item.title).forEach(word => {
            let entry = map.get(word);
            if (!entry) {
                entry = { w: word, n: 0, c: {} };
                map.set(word, entry);
            }
            entry.n++;
            const community = item.community || 'unknown';
            entry.c[community] = (entry.c[community] || 0) + 1;
        });
    });

    return Array.from(map.values())
        .sort((a, b) => b.n - a.n)
        .slice(0, PER_SNAPSHOT_LIMIT);
}

/** 키워드 배열들을 하나로 합친다 */
function merge(lists) {
    const map = new Map();

    lists.forEach(list => {
        (list || []).forEach(k => {
            let entry = map.get(k.w);
            if (!entry) {
                entry = { w: k.w, exposure: 0, slots: 0, communities: {} };
                map.set(k.w, entry);
            }
            entry.exposure += k.n;
            entry.slots += 1;
            Object.keys(k.c || {}).forEach(id => {
                entry.communities[id] = (entry.communities[id] || 0) + k.c[id];
            });
        });
    });

    return Array.from(map.values()).sort((a, b) => b.exposure - a.exposure);
}

function readJson(file, fallback) {
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
        return fallback;
    }
}

/**
 * 최근 windowDays 일치 키워드를 집계해 data/keywords.json 을 만든다.
 *
 * 완료된 날은 일별 요약(daily/*.json)의 keywords 를, 오늘은 원본 스냅샷을 읽는다.
 * 요약이 없는 과거 날짜는 원본이 남아 있으므로 원본에서 읽는다.
 */
function build(dataDir, todayDay, windowDays) {
    const days = windowDays || WINDOW_DAYS;
    const lists = [];
    const daysUsed = [];
    let snapshotCount = 0;

    // 윈도 시작일 계산 (문자열 비교로 충분하도록 YYYY-MM-DD 유지)
    const start = new Date(todayDay + 'T00:00:00Z');
    start.setUTCDate(start.getUTCDate() - (days - 1));
    const startDay = start.toISOString().slice(0, 10);

    const snapshotRoot = path.join(dataDir, 'snapshots');
    const dailyRoot = path.join(dataDir, 'daily');

    const candidateDays = new Set();
    if (fs.existsSync(snapshotRoot)) {
        fs.readdirSync(snapshotRoot).forEach(d => {
            if (/^\d{4}-\d{2}-\d{2}$/.test(d)) candidateDays.add(d);
        });
    }
    if (fs.existsSync(dailyRoot)) {
        fs.readdirSync(dailyRoot).forEach(f => {
            const m = f.match(/^(\d{4}-\d{2}-\d{2})\.json$/);
            if (m) candidateDays.add(m[1]);
        });
    }

    Array.from(candidateDays)
        .filter(day => day >= startDay && day <= todayDay)
        .sort()
        .forEach(day => {
            const dayDir = path.join(snapshotRoot, day);

            // 원본이 남아 있으면 원본을 쓴다(더 정확). 없으면 일별 요약의 집계를 쓴다.
            if (fs.existsSync(dayDir)) {
                const files = fs.readdirSync(dayDir).filter(f => /^\d{4}\.json$/.test(f));
                files.forEach(f => {
                    const snap = readJson(path.join(dayDir, f), null);
                    if (snap && snap.keywords) {
                        lists.push(snap.keywords);
                        snapshotCount++;
                    }
                });
                if (files.length > 0) daysUsed.push(day);
                return;
            }

            const daily = readJson(path.join(dailyRoot, day + '.json'), null);
            if (daily && daily.keywords) {
                // 요약의 keywords 는 이미 하루치 합계다. slots 수를 보존하기 위해
                // n 을 그대로 넣고 slots 는 요약의 snapshotCount 로 보정한다.
                lists.push(daily.keywords);
                snapshotCount += daily.snapshotCount || 1;
                daysUsed.push(day);
            }
        });

    const keywords = merge(lists).slice(0, AGGREGATE_LIMIT);

    return {
        generatedAt: new Date().toISOString(),
        windowDays: days,
        fromDay: daysUsed.length ? daysUsed[0] : null,
        toDay: daysUsed.length ? daysUsed[daysUsed.length - 1] : null,
        daysUsed,
        snapshotCount,
        keywordCount: keywords.length,
        // 노출량 정의를 데이터에 같이 실어 UI 가 오해 없이 설명할 수 있게 한다
        exposureDefinition:
            '(스냅샷 × 해당 키워드를 포함한 글) 의 합. 같은 글이 여러 슬롯에 걸려 있으면 중복 계산된다 — 노출 지속량이며 고유 글 수가 아니다.',
        keywords
    };
}

module.exports = { tokenize, summarizeSnapshot, merge, build, AGGREGATE_LIMIT, WINDOW_DAYS };
