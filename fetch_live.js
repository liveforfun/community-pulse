const https = require('https');

function get(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

async function run() {
  const results = {};
  
  const naver = await get('https://finance.naver.com/item/board.naver?code=005930');
  results.naverStock = [...naver.matchAll(/board_read\.naver\?code=005930&nid=(\d+)/g)].slice(0,3).map(m => 'https://finance.naver.com/item/board_read.naver?code=005930&nid=' + m[1]);

  const dc = await get('https://gall.dcinside.com/board/lists/?id=immovable');
  results.dcRealestate = [...dc.matchAll(/\/board\/view\/\?id=immovable&amp;no=(\d+)/g)].slice(0,3).map(m => 'https://gall.dcinside.com/board/view/?id=immovable&no=' + m[1]);

  const dcStock = await get('https://gall.dcinside.com/board/lists/?id=neostock');
  results.dcStock = [...dcStock.matchAll(/\/board\/view\/\?id=neostock&amp;no=(\d+)/g)].slice(0,3).map(m => 'https://gall.dcinside.com/board/view/?id=neostock&no=' + m[1]);

  const blind = await get('https://www.teamblind.com/kr/topics/%ED%88%AC%EC%9E%90%C2%B7%EC%A3%BC%EC%8B%9D');
  results.blind = [...blind.matchAll(/\/kr\/post\/([^\"']+)/g)].slice(0,3).map(m => 'https://www.teamblind.com/kr/post/' + m[1]);

  const boos = await get('https://cafe.naver.com/ArticleList.nhn?search.clubid=27332795&search.boardtype=L');
  results.boos = [...boos.matchAll(/articleid=(\d+)/g)].slice(0,3).map(m => 'https://cafe.naver.com/jaeup/' + m[1]);

  const weolbu = await get('https://cafe.naver.com/ArticleList.nhn?search.clubid=27393432&search.boardtype=L');
  results.weolbu = [...weolbu.matchAll(/articleid=(\d+)/g)].slice(0,3).map(m => 'https://cafe.naver.com/weolbu/' + m[1]);

  const instiz = await get('https://www.instiz.net/pt');
  results.instiz = [...instiz.matchAll(/\/pt\/(\d+)/g)].slice(0,3).map(m => 'https://www.instiz.net/pt/' + m[1]);

  const ruliweb = await get('https://bbs.ruliweb.com/best');
  results.ruliweb = [...ruliweb.matchAll(/href=\"(https:\/\/bbs\.ruliweb\.com\/best\/board\/\d+\/read\/\d+)\"/g)].slice(0,3).map(m => m[1]);

  const fmkorea = await get('https://www.fmkorea.com/best');
  results.fmkorea = [...fmkorea.matchAll(/href=\"(\/best\/\d+)\"/g)].slice(0,3).map(m => 'https://www.fmkorea.com' + m[1]);

  console.log(JSON.stringify(results, null, 2));
}

run();
