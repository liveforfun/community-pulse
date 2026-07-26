const https = require('https');

function fetch(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = ''; res.on('data', c => data += c); res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

async function run() {
  const results = {};

  try {
    const naver = await fetch('https://finance.naver.com/item/board.naver?code=005930');
    results.naver_stock = Array.from(new Set([...naver.matchAll(/board_read\.naver\?code=005930&amp;nid=(\d+)/g)].map(m => m[1]))).slice(0,3).map(id => 'https://finance.naver.com/item/board_read.naver?code=005930&nid=' + id);

    const dc_re = await fetch('https://gall.dcinside.com/board/lists/?id=immovable');
    results.dc_realestate = Array.from(new Set([...dc_re.matchAll(/\/board\/view\/\?id=immovable&amp;no=(\d+)/g)].map(m => m[1]))).slice(0,3).map(id => 'https://gall.dcinside.com/board/view/?id=immovable&no=' + id);

    const dc_st = await fetch('https://gall.dcinside.com/board/lists/?id=neostock');
    results.dc_stock = Array.from(new Set([...dc_st.matchAll(/\/board\/view\/\?id=neostock&amp;no=(\d+)/g)].map(m => m[1]))).slice(0,3).map(id => 'https://gall.dcinside.com/board/view/?id=neostock&no=' + id);

    const blind = await fetch('https://www.teamblind.com/kr/topics/%ED%88%AC%EC%9E%90%C2%B7%EC%A3%BC%EC%8B%9D');
    results.blind = Array.from(new Set([...blind.matchAll(/\/kr\/post\/([A-Za-z0-9-]+)/g)].map(m => m[1]))).slice(0,3).map(id => 'https://www.teamblind.com/kr/post/' + id);

    const fmkorea = await fetch('https://www.fmkorea.com/best');
    results.fmkorea = Array.from(new Set([...fmkorea.matchAll(/href=\"(\/best\/\d+)\"/g)].map(m => m[1]))).slice(0,3).map(id => 'https://www.fmkorea.com' + id);

    const ruliweb = await fetch('https://bbs.ruliweb.com/best');
    results.ruliweb = Array.from(new Set([...ruliweb.matchAll(/href=\"(https:\/\/bbs\.ruliweb\.com\/best\/board\/\d+\/read\/\d+)\"/g)].map(m => m[1]))).slice(0,3);

    const instiz = await fetch('https://www.instiz.net/pt');
    results.instiz = Array.from(new Set([...instiz.matchAll(/\/pt\/(\d+)/g)].map(m => m[1]))).slice(0,3).map(id => 'https://www.instiz.net/pt/' + id);

  } catch(e) {}

  console.log(JSON.stringify(results, null, 2));
}

run();
