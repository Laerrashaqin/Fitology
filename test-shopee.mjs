import https from 'https';

https.get('https://shopee.co.id/Kemeja-Puff-Sleeve-Wanita-Kerah-V-Neck-Blouse-Casual-i.123456789.987654321', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(data);
  });
});
