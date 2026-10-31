const https = require('https');

const routes = [
  '/',
  '/login',
  '/pricing',
  '/termos',
  '/privacidade',
  '/seguranca',
  '/robots.txt',
  '/dashboard',
  '/admin/login'
];

async function checkRoute(route) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const req = https.get('https://editalflash.pages.dev' + route, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const duration = Date.now() - startTime;
        resolve({
          route,
          status: res.statusCode,
          headers: res.headers,
          durationMs: duration,
          contentLength: data.length,
          hasCss: data.includes('.css'),
          hasTitle: data.includes('<title>'),
          isHtml: (res.headers['content-type'] || '').includes('text/html')
        });
      });
    });
    req.on('error', (err) => {
      resolve({ route, error: err.message });
    });
  });
}

(async () => {
  console.log('--- TESTANDO ROTAS DO CLOUDFLARE PAGES ---');
  for (const r of routes) {
    const res = await checkRoute(r);
    console.log(JSON.stringify(res, null, 2));
  }
})();
