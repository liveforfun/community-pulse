const https = require('https');

function fetchHtml(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

async function getUrls() {
    try {
        // Naver Stock (Samsung)
        const naverHtml = await fetchHtml('https://finance.naver.com/item/board.naver?code=005930');
        const naverMatch = naverHtml.match(/board_read\.naver\?code=005930&nid=\d+&st=&sw=&page=1/g);
        console.log('Naver:', naverMatch ? `https://finance.naver.com/item/${naverMatch[0]}` : 'not found');

        // DC Inside Neostock
        const dcHtml = await fetchHtml('https://gall.dcinside.com/board/lists/?id=neostock');
        const dcMatch = dcHtml.match(/\/board\/view\/\?id=neostock&no=\d+/g);
        console.log('DC:', dcMatch ? `https://gall.dcinside.com${dcMatch[0]}` : 'not found');

        // Instiz
        const instizHtml = await fetchHtml('https://www.instiz.net/pt');
        const instizMatch = instizHtml.match(/\/pt\/\d+/g);
        console.log('Instiz:', instizMatch ? `https://www.instiz.net${instizMatch[0]}` : 'not found');

    } catch (e) {
        console.error(e);
    }
}

getUrls();
