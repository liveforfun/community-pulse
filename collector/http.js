'use strict';

// Node 16 에는 전역 fetch 가 없으므로 https 모듈을 직접 쓴다.
const https = require('https');
const { URL } = require('url');

// 브라우저를 위장하지 않는다. 디시인사이드·에펨코리아는 AI 학습 크롤러를 UA 이름으로
// 차단하는데, 이 수집기는 학습 크롤러가 아니므로 정직하게 자신을 밝히고
// robots.txt 의 `User-agent: *` 규칙만 지킨다. 차단당하면 우회하지 않고 기록한다.
const USER_AGENT =
    'community-pulse-bot/1.0 (+https://github.com/liveforfun/community-pulse)';

const REQUEST_DELAY_MS = 1500;
const MAX_REDIRECTS = 3;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function once(url, timeoutMs, redirectsLeft) {
    return new Promise(resolve => {
        let target;
        try {
            target = new URL(url);
        } catch (e) {
            resolve({ ok: false, status: 0, body: '', error: 'invalid url: ' + url });
            return;
        }

        const req = https.get(
            target,
            {
                headers: {
                    'User-Agent': USER_AGENT,
                    'Accept': 'text/html,application/xhtml+xml',
                    'Accept-Language': 'ko-KR,ko;q=0.9'
                }
            },
            res => {
                const status = res.statusCode || 0;
                const location = res.headers.location;

                if (status >= 300 && status < 400 && location) {
                    res.resume();
                    if (redirectsLeft <= 0) {
                        resolve({ ok: false, status, body: '', error: 'too many redirects' });
                        return;
                    }
                    const next = new URL(location, target).toString();
                    once(next, timeoutMs, redirectsLeft - 1).then(resolve);
                    return;
                }

                const chunks = [];
                res.on('data', chunk => chunks.push(chunk));
                res.on('end', () => {
                    // 현재 6개 소스는 전부 UTF-8 이다. (네이버 종토방을 euc-kr 로 오판했다가
                    // charset=utf-8 확인으로 정정했다.) euc-kr 소스가 추가되면 여기서 분기한다.
                    const body = Buffer.concat(chunks).toString('utf8');
                    resolve({
                        ok: status >= 200 && status < 300,
                        status,
                        body,
                        error: status >= 200 && status < 300 ? null : 'http ' + status
                    });
                });
            }
        );

        req.setTimeout(timeoutMs, () => {
            req.destroy();
            resolve({ ok: false, status: 0, body: '', error: 'timeout ' + timeoutMs + 'ms' });
        });

        req.on('error', err => {
            resolve({ ok: false, status: 0, body: '', error: err.message });
        });
    });
}

async function get(url, options) {
    const opts = options || {};
    const timeoutMs = opts.timeoutMs || 15000;
    const retries = opts.retries === undefined ? 2 : opts.retries;

    let last = null;
    for (let attempt = 0; attempt <= retries; attempt++) {
        if (attempt > 0) await sleep(1000 * attempt);
        last = await once(url, timeoutMs, MAX_REDIRECTS);
        if (last.ok) return last;
        // 4xx 는 재시도해도 같은 결과다. 차단·삭제된 경로를 반복 요청하지 않는다.
        if (last.status >= 400 && last.status < 500) return last;
    }
    return last;
}

module.exports = { get, sleep, USER_AGENT, REQUEST_DELAY_MS };
