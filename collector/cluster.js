'use strict';

// 제목 유사도로 글을 묶는다. 외부 API·의존성 없이 문자 bigram 자카드 유사도를 쓴다.
// 커뮤니티 경계를 넘어 비교한다 — 같은 이슈가 여러 커뮤니티에 퍼진 경우를 한 그룹으로 묶는 것이
// 이 기능의 목적이므로, 소속 커뮤니티는 판정에 쓰지 않는다.

// 실데이터로 검증해 0.45 → 0.38 로 낮췄다.
// 근거: 명백히 같은 이슈인 아래 쌍의 유사도가 0.448 로, 0.45 에서 아깝게 탈락했다.
//   에펨  "종편 아나운서가 반포 신축 50억 아파트 입주권 산 비결"
//   루리웹 "종편 아나운서가 50억 반포자이 아파트를 산 비결"
// 표현 차이가 이보다 큰 동일 이슈는 더 낮게 나오므로 여유를 둔다.
// 0.25 까지 낮춰도 최대 묶임이 5건(같은 제목 연속 게시글)에 머물러 과병합 징후가 없었으나,
// 서로 다른 주제가 뭉치는 위험을 피해 0.38 로 둔다.
const SIMILARITY_THRESHOLD = 0.38;
const MIN_NORMALIZED_LENGTH = 4;

// 짧은 조사·감탄사 위주. 내용어는 제거하지 않는다(제거하면 서로 다른 주제가 뭉친다).
const STOPWORDS = [
    '진짜', '오늘', '근데', '그리고', '하지만', '그래서', '이거', '저거', '그거',
    '요즘', '지금', '다들', '너무', '완전', '역시', '드디어', '결국', '갑자기'
];

function normalizeTitle(raw) {
    let s = String(raw || '');

    // 1. 파일 확장자 접미사 제거 (.jpg .mp4 .txt 등이 제목 끝에 붙는 관행)
    s = s.replace(/\.(jpg|jpeg|png|gif|webp|mp4|webm|txt|avi|mov)\s*$/gi, '');

    // 2. 선행 말머리 제거 ([유머], (스포) 등)
    s = s.replace(/^\s*[\[\(][^\]\)]{1,12}[\]\)]\s*/g, '');

    // 3. 자모 반복 감탄사 제거 (ㅋㅋㅋ, ㄷㄷ, ㅠㅠ …)
    s = s.replace(/[ㅋㅎㄷㅠㅜㅗㅡㅍㅃ]{2,}/g, ' ');

    // 4. 한글·영문·숫자만 남긴다 (이모지·특수문자 제거)
    s = s.replace(/[^가-힣ㄱ-ㅎa-zA-Z0-9\s]/g, ' ');

    s = s.toLowerCase().replace(/\s+/g, ' ').trim();

    // 5. 불용어 제거
    for (const w of STOPWORDS) {
        s = s.split(w).join(' ');
    }

    // 6. 공백 전부 제거 — 한국어는 띄어쓰기가 불안정해서 문자 n-gram 이 더 안정적이다
    return s.replace(/\s+/g, '');
}

function bigrams(s) {
    const set = new Set();
    for (let i = 0; i < s.length - 1; i++) set.add(s.slice(i, i + 2));
    return set;
}

function jaccard(a, b) {
    if (a.size === 0 || b.size === 0) return 0;
    let inter = 0;
    for (const g of a) if (b.has(g)) inter++;
    const union = a.size + b.size - inter;
    return union === 0 ? 0 : inter / union;
}

function clusterId(seed, index) {
    // 결정적이고 짧은 식별자. 해시 라이브러리를 쓰지 않는다.
    let h = 5381;
    for (let i = 0; i < seed.length; i++) h = ((h << 5) + h + seed.charCodeAt(i)) | 0;
    return 'c' + Math.abs(h).toString(36) + '-' + index;
}

/**
 * @param {Array} items 각 원소는 { title, community, ... }
 * @param {number} threshold
 * @returns {Array<{clusterId, members, normalized, grams}>}
 */
function clusterItems(items, threshold) {
    const th = threshold === undefined ? SIMILARITY_THRESHOLD : threshold;
    const clusters = [];

    items.forEach(item => {
        const normalized = normalizeTitle(item.title);

        // 정규화 후 너무 짧은 제목은 우연히 높은 유사도가 나오므로 단독 클러스터로 둔다
        if (normalized.length < MIN_NORMALIZED_LENGTH) {
            clusters.push({ members: [item], normalized, grams: bigrams(normalized), lonely: true });
            return;
        }

        const grams = bigrams(normalized);
        let best = null;
        let bestScore = 0;

        for (const c of clusters) {
            if (c.lonely) continue;
            const score = jaccard(grams, c.grams);
            if (score >= th && score > bestScore) {
                best = c;
                bestScore = score;
            }
        }

        if (best) {
            best.members.push(item);
            // 단일연결: 클러스터 대표 그램에 신규 항목을 합쳐 확장한다
            for (const g of grams) best.grams.add(g);
        } else {
            clusters.push({ members: [item], normalized, grams, lonely: false });
        }
    });

    return clusters.map((c, i) => ({
        clusterId: clusterId(c.normalized, i),
        members: c.members
    }));
}

module.exports = {
    normalizeTitle,
    bigrams,
    jaccard,
    clusterItems,
    SIMILARITY_THRESHOLD
};
