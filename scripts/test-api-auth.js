const https = require('https');

const postData = JSON.stringify({
  email: 'renanoacruz@gmail.com',
  password: 'admin'
});

const req = https.request('https://editalflash.pages.dev/api/admin/auth', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    console.log('HEADERS:', res.headers);
    console.log('BODY:', body);
  });
});

req.on('error', (err) => console.error('ERR:', err));
req.write(postData);
req.end();
