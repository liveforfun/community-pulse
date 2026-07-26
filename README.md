# Community Pulse

공개 접근이 가능한 커뮤니티 게시판을 **30분마다 수집**해, **유사한 제목의 글을 하나의 그룹으로 묶고**, **조회수+댓글수 기준 TOP 3**를 스냅샷으로 **누적 기록**하는 정적 대시보드.

수집기는 GitHub Actions cron 이 실행하고, 결과 JSON 을 저장소에 커밋한다. 프론트엔드는 빌드 없는 정적 HTML/CSS/JS 로 그 JSON 을 읽어 렌더한다. **외부 npm 의존성이 없다.**

---

## 수집 대상과 지표 제공 범위

**이 프로젝트에서 가장 먼저 알아야 할 사실: 소스마다 제공하는 지표가 다르다.**

| 커뮤니티 | id | 조회수 | 댓글수 |
|---|---|---|---|
| 에펨코리아 베스트 | `fmkorea` | ❌ 미제공 | ✅ |
| 루리웹 베스트 | `ruliweb` | ❌ 미제공 | ✅ |
| 인스티즈 | `instiz` | ✅ | ✅ |
| 디시 주식갤 | `dc_stock` | ✅ | ✅ |
| 디시 부동산갤 | `dc_realestate` | ✅ | ✅ |

- **없는 값은 만들어내지 않는다.** 목록에서 얻을 수 없는 지표는 `null` 로 저장하고, UI 카드에 "조회수 미제공" 경고를 표시한다.
- 따라서 **조회수를 제공하는 소스와 그렇지 않은 소스가 같은 순위표에서 경쟁하면 순위가 왜곡된다.** 각 카드의 `scoreBasis` 배지를 보고 해석해야 한다.

**제외한 곳**
- 로그인이나 JS 렌더가 필요: 네이버카페(부동산스터디·월부), 블라인드, 토스증권, 호갱노노
- **네이버 종토방**: robots.txt 는 `Allow: /item/board.naver?code=*` 로 허용하지만, 서버가 브라우저 아닌 User-Agent 에 200 응답으로 오류 페이지(약 2.7KB)를 돌려주며 게이팅한다. 브라우저를 위장하지 않기로 했으므로 수집 대상에서 제외했다. (`collector/sources/naverStock.js` 및 `isBlocked` 훅 제거)

## 수집 매너

- robots.txt 를 확인하고 허용 경로만 요청한다.
  - 에펨코리아: `Disallow: /` 이지만 `Allow: /best` → 베스트 목록만
  - 디시: 차단 갤러리 목록에 `neostock`·`immovables` 없음
- **목록 페이지만 요청한다.** 개별 글은 요청하지 않고 링크로만 노출한다.
- 정직한 User-Agent 를 쓴다: `community-pulse-bot/1.0 (+https://github.com/liveforfun/community-pulse)`
- 소스를 **순차 처리**하고 요청 사이 **1.5초** 지연을 둔다. 동시 요청하지 않는다.

## 빠른 시작

```bash
# 1. 수집 (외부 의존성 없음 — npm install 불필요)
npm run collect

# 2. 확인. file:// 로 열면 브라우저가 fetch 를 막으므로 반드시 서버로 띄운다
npm run serve      # http://localhost:8080
```

Node 16 이상. 로컬에 glibc 제약이 있으면:
```bash
export PATH="$HOME/.nvm/versions/node/v16.20.2/bin:$PATH"
```

수집 출력 예:
```
수집: 에펨코리아 … ok (23건, 158ms)
수집: 루리웹 … ok (31건, 280ms)
수집: 인스티즈 … ok (15건, 639ms)
수집: 디시 주식갤 … ok (48건, 363ms)
수집: 디시 부동산갤 … ok (49건, 359ms)

수집 건수 : 166건 → 클러스터 161개
저장      : data/snapshots/2026-07-26/2130.json
```

## 구조

```
collector/
  collect.js        수집 엔트리 — 순차 수집 → 클러스터링 → 점수 → 스냅샷 저장
  http.js           https GET (UA·타임아웃·재시도·리다이렉트·요청 간 지연)
  cluster.js        제목 정규화 + bigram 자카드 유사도 클러스터링
  score.js          점수 계산 및 scoreBasis 판정
  snapshot.js       스냅샷 기록 · 인덱스 갱신 · 보관 기간 프루닝
  sources/
    html.js         정규식 HTML 유틸 (태그 제거·엔티티 해제·숫자 추출)
    dcinside.js     주식갤·부동산갤 공용 파서
    fmkorea.js  ruliweb.js  instiz.js
data/
  latest.json               최신 스냅샷 전문
  index.json                스냅샷 슬롯 목록 (타임라인 UI 용)
  snapshots/<날짜>/<HHmm>.json   30분 단위 누적 스냅샷
index.html  app.js  styles.css   정적 프론트엔드 (빌드 없음)
.github/workflows/collect.yml    30분 cron
```

## 유사글 그룹핑

제목을 정규화한 뒤 **문자 bigram 자카드 유사도**로 묶는다. 외부 API·의존성을 쓰지 않는다.

정규화 단계 (`collector/cluster.js`):
1. 파일 확장자 접미사 제거 (`.jpg`, `.mp4` …)
2. 선행 말머리 제거 (`[유머]`, `(스포)`)
3. 자모 반복 감탄사 제거 (`ㅋㅋㅋ`, `ㄷㄷ`, `ㅠㅠ`)
4. 한글·영문·숫자만 남기고 이모지·특수문자 제거
5. 불용어 제거 후 **공백 전부 제거** (한국어 띄어쓰기가 불안정해 문자 n-gram 이 더 안정적)

**임계값 `SIMILARITY_THRESHOLD = 0.38`** — 실데이터로 조정한 값이다.

| 근거 | 값 |
|---|---|
| 에펨 "종편 아나운서가 반포 신축 50억 아파트 입주권 산 비결" ↔ 루리웹 "종편 아나운서가 50억 반포자이 아파트를 산 비결" | 유사도 **0.448** |

같은 이슈인 위 쌍이 초기값 0.45 에서 아깝게 탈락했다. 표현 차이가 더 큰 동일 이슈는 그보다 낮게 나오므로 0.38 로 낮췄다. 0.25 까지 내려도 최대 묶임이 5건(같은 제목 연속 게시글)에 머물러 과병합 징후는 없었으나, 서로 다른 주제가 뭉칠 위험을 피해 0.38 로 둔다.

**커뮤니티 경계를 넘어 비교한다** — 같은 이슈가 여러 커뮤니티에 퍼진 경우를 묶는 것이 목적이므로 소속 커뮤니티는 판정에 쓰지 않는다.

> 실제 관찰: 현재 5곳은 주제 영역(유머 / 게임 / 주식 / 부동산)이 거의 겹치지 않아 **커뮤니티를 교차하는 그룹이 드물다.** 그룹핑은 주로 같은 갤러리에 연속 게시된 유사 제목 글을 묶는 데 작동한다. 교차 그룹을 늘리려면 주제가 겹치는 소스를 추가해야 한다.

## 점수

```
score = (totalViews ?? 0) + (totalComments ?? 0) × 100
```

댓글 1건을 조회 100회로 환산한다(기존 구현의 가중치를 승계). 추천수는 수집·보관하지만 점수에는 넣지 않는다.

`scoreBasis` 는 어떤 지표로 점수를 냈는지 기록하며, UI 가 이를 그대로 표시한다:

| 값 | 의미 | UI 경고 |
|---|---|---|
| `views+comments` | 모든 글이 두 지표 보유 | 없음 |
| `comments-only` | 조회수 전무 | "조회수 미제공 — 댓글수만으로 산출" |
| `views-only` | 댓글수 전무 | "댓글수 미제공 — 조회수만으로 산출" |
| `partial` | 그룹 안에 제공/미제공 소스가 섞임 | "일부 글의 지표가 미제공 — 합산값이 불완전" |

## 스냅샷 스키마

```json
{
  "slot": "2026-07-26T19:00+09:00",
  "capturedAt": "2026-07-26T10:02:11.512Z",
  "collectorVersion": 1,
  "similarityThreshold": 0.38,
  "itemCount": 166,
  "clusterCount": 154,
  "sources": [
    { "id": "fmkorea", "name": "에펨코리아", "status": "ok", "itemCount": 23,
      "error": null, "provides": { "views": false, "comments": true }, "elapsedMs": 180 }
  ],
  "top": [
    { "rank": 1, "clusterId": "c…", "title": "대표 제목", "memberCount": 2,
      "communities": ["fmkorea", "ruliweb"],
      "totalViews": null, "totalComments": 964,
      "viewsComplete": false, "commentsComplete": true,
      "scoreBasis": "comments-only", "score": 96400,
      "items": [ { "community": "fmkorea", "title": "…", "url": "https://…",
                   "author": "…", "views": null, "comments": 964,
                   "recommends": 111, "postedAt": "1 분 전" } ] }
  ],
  "clusters": [ "… 전체 클러스터 (프론트 필터가 TOP 3 를 재산출하는 데 사용) …" ]
}
```

`status`: `ok` | `empty`(요청 성공·행 0건, 파서 파손 신호) | `blocked`(403/429/UA 게이팅) | `error`(요청 실패)

**누적 정책**: 스냅샷은 덮어쓰지 않고 슬롯별로 쌓인다. 보관 기간은 **7일**(`collector/snapshot.js` 의 `RETENTION_DAYS`). 30분 주기면 하루 48개, 7일 336개로 상한이 걸린다. 초과분은 매 실행 시 디렉토리째 삭제되고 `index.json` 에서도 제거된다.

## 자동 수집 설정

`.github/workflows/collect.yml` 이 30분마다 실행되고 `data/` 변경을 커밋·푸시한다.

**저장소 설정 필요**: Settings → Actions → General → Workflow permissions 를 **Read and write permissions** 로 바꿔야 푸시가 된다.

주의사항:
- GitHub Actions 예약 실행은 부하에 따라 **수 분 지연되거나 건너뛰어진다.** 정확히 30분 간격이 보장되지 않으므로, UI 는 약속된 주기가 아니라 스냅샷에 기록된 실제 `capturedAt` 을 표시한다.
- 전 소스가 실패해도 스냅샷은 남긴다. "언제 어느 파서가 깨졌는지"가 그 자체로 데이터다.

## 파서가 깨졌을 때

정규식 HTML 파싱이므로 사이트 개편에 취약하다. 소스별로 실패가 격리되어 한 곳이 깨져도 나머지는 수집된다.

증상별 대응:

| 스냅샷 상태 | 의미 | 대응 |
|---|---|---|
| `empty` | 요청은 200 인데 행이 0건 | 해당 `sources/*.js` 의 `ROW_RE` 부터 확인 |
| `blocked` | 403/429 또는 UA 게이팅 | 우회하지 말 것. 소스 제외를 검토 |
| `error` | 타임아웃·네트워크 실패 | 일시적일 수 있음. 다음 슬롯 확인 |

파서 수정 시 주의: **태그 내부에 탭·줄바꿈이 섞인다.** `<li class="…">` 처럼 공백을 고정한 정규식은 조용히 0건을 반환한다. `<li\b[^>]*class="[^"]*…"` 형태로 공백에 관대하게 쓴다. (실제로 이 함정 때문에 초기 구현에서 에펨·루리웹·인스티즈가 부분 실패했다.)

또한 **에펨코리아는 User-Agent 에 따라 두 가지 템플릿을 내려준다** — 제목 링크가 `/best/{id}` 인 형태와 `/index.php?…&document_srl={id}` 인 형태. 파서는 양쪽을 모두 처리한다.

## 확장

새 소스를 추가하려면 `collector/sources/` 에 아래 형태의 모듈을 만들고 `sources/index.js` 에 등록한다.

```js
module.exports = {
    id: 'my_source',
    name: '표시 이름',
    url: 'https://example.com/board',
    provides: { views: true, comments: true },   // 실제 제공 여부를 정직하게 적을 것
    parse(html) {
        return [{ title, url, author, views, comments, recommends, postedAt }];
        // 얻을 수 없는 지표는 null. 추정값을 넣지 말 것
    },
    isBlocked(html) { return false; }            // 선택 — UA 게이팅 감지
};
```

프론트엔드 `app.js` 의 `COMMUNITY_CONFIG` 에도 같은 `id` 로 표시 이름·색을 추가한다.
