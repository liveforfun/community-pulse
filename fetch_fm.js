const https = require('https');
const http = require('http');

function fetchContent(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

async function run() {
  let fmkoreaHtml = await fetchContent('https://www.fmkorea.com/best');
  const fmRegex = /href="(\/best\/(\d+))"[^>]*>(.*?)<\/a>/g;
  let matches = [...fmkoreaHtml.matchAll(fmRegex)];
  
  let validFm = [];
  let seen = new Set();
  
  for (let m of matches) {
      if(m[3] && !m[3].includes('<img') && !seen.has(m[2])) {
          let title = m[3].replace(/<\/?[^>]+(>|$)/g, '').trim();
          if (title.length > 5) {
            seen.add(m[2]);
            validFm.push({
                id: m[2],
                url: 'https://www.fmkorea.com/best/' + m[2],
                title: title
            });
          }
      }
  }
  console.log(JSON.stringify(validFm.slice(0, 5), null, 2));
}

run();
