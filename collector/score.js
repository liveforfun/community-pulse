'use strict';

// 점수는 "이 30분 동안 늘어난 조회수 + 댓글수" 다.
//
// 누적값을 쓰면 오래된 글이 구조적으로 이긴다(작성 이후 계속 쌓인 값이므로).
// 실제로 누적 방식에서는 10시간 전에 쓰인 글이 2위였다. 증분으로 바꾸면
// "지금 뜨거워지고 있는 글"이 올라온다.
//
// 지표 제공 범위가 소스마다 다르므로(조회수를 안 주는 곳이 있다) 없는 값은
// 만들어내지 않고 null 로 두며, 어떤 근거로 점수를 냈는지 scoreBasis 에 남긴다.
const COMMENT_WEIGHT = 100;

function sumOrNull(values) {
    const present = values.filter(v => v !== null && v !== undefined);
    if (present.length === 0) return null;
    return present.reduce((a, b) => a + b, 0);
}

/** 누적값 기반 점수 (증분을 전혀 잴 수 없을 때의 대체 경로) */
function cumulativeScore(members) {
    const totalViews = sumOrNull(members.map(m => m.views));
    const totalComments = sumOrNull(members.map(m => m.comments));
    return (totalViews || 0) + (totalComments || 0) * COMMENT_WEIGHT;
}

function scoreCluster(members) {
    const viewValues = members.map(m => m.views);
    const commentValues = members.map(m => m.comments);

    const totalViews = sumOrNull(viewValues);
    const totalComments = sumOrNull(commentValues);

    const viewsComplete = viewValues.every(v => v !== null && v !== undefined);
    const commentsComplete = commentValues.every(v => v !== null && v !== undefined);

    let scoreBasis;
    if (viewsComplete && commentsComplete) scoreBasis = 'views+comments';
    else if (!viewsComplete && commentsComplete) scoreBasis = totalViews === null ? 'comments-only' : 'partial';
    else if (viewsComplete && !commentsComplete) scoreBasis = totalComments === null ? 'views-only' : 'partial';
    else scoreBasis = 'partial';

    // 증분
    const deltaViews = sumOrNull(members.map(m => m.deltaViews));
    const deltaComments = sumOrNull(members.map(m => m.deltaComments));
    const deltaScore = (deltaViews || 0) + (deltaComments || 0) * COMMENT_WEIGHT;

    // 증분 근거: 하나라도 실측(measured)이면 measured, 아니면 가장 약한 근거를 따른다
    const bases = members.map(m => m.deltaBasis).filter(Boolean);
    const deltaBasis = bases.indexOf('measured') !== -1
        ? 'measured'
        : bases.indexOf('new-in-window') !== -1
        ? 'new-in-window'
        : 'first-seen';

    const measurable = deltaViews !== null || deltaComments !== null;

    return {
        // 순위에 쓰는 점수 = 증분
        score: deltaScore,
        deltaViews,
        deltaComments,
        deltaBasis,
        measurable,
        // 누적값도 함께 보관한다(카드에서 참고용으로 보여준다)
        totalViews,
        totalComments,
        cumulativeScore: cumulativeScore(members),
        viewsComplete,
        commentsComplete,
        scoreBasis
    };
}

module.exports = { scoreCluster, cumulativeScore, COMMENT_WEIGHT };
