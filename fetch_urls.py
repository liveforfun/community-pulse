import urllib.request
import re
import json

results = {}

try:
    req = urllib.request.Request('https://gall.dcinside.com/board/lists/?id=neostock', headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    ids = list(set(re.findall(r'href="/board/view/\?id=neostock&amp;no=(\d+)', html)))
    results['dc_stock'] = ['https://gall.dcinside.com/board/view/?id=neostock&no=' + i for i in ids[:3]]
except Exception as e:
    results['dc_stock_err'] = str(e)

try:
    req = urllib.request.Request('https://gall.dcinside.com/board/lists/?id=immovables', headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    ids = list(set(re.findall(r'href="/board/view/\?id=immovables&amp;no=(\d+)', html)))
    results['dc_realestate'] = ['https://gall.dcinside.com/board/view/?id=immovables&no=' + i for i in ids[:3]]
except Exception as e:
    results['dc_realestate_err'] = str(e)

try:
    req = urllib.request.Request('https://finance.naver.com/item/board.naver?code=005930', headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    html = urllib.request.urlopen(req).read().decode('euc-kr')
    ids = list(set(re.findall(r'board_read\.naver\?code=005930&amp;nid=(\d+)', html)))
    results['naver_stock'] = ['https://finance.naver.com/item/board_read.naver?code=005930&nid=' + i for i in ids[:3]]
except Exception as e:
    results['naver_stock_err'] = str(e)

print(json.dumps(results, indent=2))
