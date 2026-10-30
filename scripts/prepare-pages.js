const fs = require('fs');
const path = require('path');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    const parentDir = path.dirname(dest);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

function processHtmlFiles(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processHtmlFiles(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.html') && entry.name !== 'index.html' && entry.name !== '404.html') {
      const baseName = entry.name.replace(/\.html$/, '');
      const subDir = path.join(dir, baseName);
      const targetIndex = path.join(subDir, 'index.html');
      if (!fs.existsSync(targetIndex)) {
        if (!fs.existsSync(subDir)) {
          fs.mkdirSync(subDir, { recursive: true });
        }
        fs.copyFileSync(fullPath, targetIndex);
      }
    }
  }
}

const root = process.cwd();
const serverApp = path.join(root, '.next', 'server', 'app');
const staticSrc = path.join(root, '.next', 'static');
const staticDest = path.join(serverApp, '_next', 'static');
const publicSrc = path.join(root, 'public');

console.log('[cf-pages-prepare] Copiando .next/static para .next/server/app/_next/static...');
copyRecursive(staticSrc, staticDest);

console.log('[cf-pages-prepare] Copiando public/ para .next/server/app/ ...');
copyRecursive(publicSrc, serverApp);

// 404 fallback
const notFoundHtml = path.join(serverApp, '_not-found.html');
const dest404 = path.join(serverApp, '404.html');
if (fs.existsSync(notFoundHtml)) {
  fs.copyFileSync(notFoundHtml, dest404);
}

console.log('[cf-pages-prepare] Ajustando rotas HTML (ex: login.html -> login/index.html)...');
processHtmlFiles(serverApp);

console.log('[cf-pages-prepare] Pronto! Diretório .next/server/app 100% preparado para Cloudflare Pages.');
