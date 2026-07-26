'use strict';

// 점수는 조회수 + 댓글수 기준이다. 기존 코드의 가중치(댓글 1건 = 조회 100회)를 승계한다.
//
// 핵심: 6개 소스의 지표 제공 범위가 다르다. 조회수는 3곳만, 댓글수는 5곳만 제공한다.
// 없는 값을 추정하거나 만들어내지 않고 null 로 두며, 어떤 지표로 점수를 냈는지
// scoreBasis 에 남겨 UI 가 그 사실을 드러낼 수 있게 한다.
const COMMENT_WEIGHT = 100;

function sumOrNull(values) {
    const present = values.filter(v => v !== null && v !== undefined);
    if (present.length === 0) return null;
    return present.reduce((a, b) => a + b, 0);
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

    const score = (totalViews || 0) + (totalComments || 0) * COMMENT_WEIGHT;

    return {
        score,
        totalViews,
        totalComments,
        viewsComplete,
        commentsComplete,
        scoreBasis
    };
}

module.exports = { scoreCluster, COMMENT_WEIGHT };
