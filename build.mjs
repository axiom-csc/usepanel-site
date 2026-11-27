// Static build: no dependencies. `node build.mjs` writes the site to ./dist.
import { rmSync, mkdirSync, writeFileSync, cpSync, readFileSync } from 'node:fs';
import { pages, nav, SITE, EARLY } from './src/pages.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const mark = '<img src="/assets/panel-mark.svg" alt="" width="46" height="46">';

const layout = (p) => {
  const title = p.path === '/' ? p.title : `${p.title} - Panel`;
  const url = SITE + (p.path === '/' ? '/' : p.path);
  const links = nav.map(([h, l]) => `<a href="${h}"${p.path === h ? ' aria-current="page"' : ''}>${l}</a>`).join('');
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(p.desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website"><meta property="og:site_name" content="Panel"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(p.desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITE}/assets/og-image.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${SITE}/assets/og-image.png">
<link rel="icon" href="/assets/icon.svg" type="image/svg+xml"><link rel="icon" href="/assets/favicon-32.png" sizes="32x32" type="image/png"><link rel="icon" href="/assets/favicon.ico" sizes="48x48"><link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<meta name="theme-color" content="#dbe4fa">
<link rel="preload" href="/fonts/plus-jakarta-sans-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/tokens.css"><link rel="stylesheet" href="/assets/site.css">
</head><body>
<a class="skip" href="#main">Skip to content</a>
<header class="hdr"><a class="brand" href="/" aria-label="Panel home">${mark}<span>panel</span></a><nav class="nav" aria-label="Main">${links}</nav><a class="btn" href="${EARLY}">Get early access</a></header>
<main id="main">${p.body}</main>
<footer class="ftr"><div class="in">
<div style="max-width:38ch"><p class="mark"><img src="/assets/panel-mark.svg" alt="" width="30" height="30">panel</p><p style="margin:12px 0 0"><a class="tl" href="https://tenthlook.com" aria-label="A Tenthlook product: tenthlook.com">A product of <img src="/brand/tenthlook-dark.svg" alt="tenthlook." width="93" height="16"></a></p><p style="margin:20px 0 0;color:var(--muted)">&copy; 2026 Panel &middot; Tenthlook</p><p>Questions? <a href="mailto:narensara@usepanel.dev">narensara@usepanel.dev</a></p></div>
<div class="cols"><div><h2>Panel</h2><ul><li><a href="/how-it-works">How it works</a></li><li><a href="/evals">Evals</a></li><li><a href="/design-partners">Design partners</a></li><li><a href="/pricing">Pricing</a></li></ul></div>
<div><h2>Company</h2><ul><li><a href="https://tenthlook.com">Tenthlook</a></li><li><a href="/security">Security</a></li><li><a href="/privacy">Privacy</a></li><li><a href="${EARLY}">Contact</a></li></ul></div></div>
</div></footer>
</body></html>`;
};

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist/assets', { recursive: true });
cpSync('tenthlook', 'dist', { recursive: true });
cpSync('assets', 'dist/assets', { recursive: true });
cpSync('src/site.css', 'dist/assets/site.css');

for (const p of pages) {
  const dir = p.path === '/' ? 'dist' : `dist${p.path}`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/index.html`, layout(p));
}
writeFileSync('dist/404.html', layout({ path: '/404', title: 'Page not found', desc: 'That page does not exist.', body: '<div class="narrow page-head"><h1 class="page-h1">Page not found.</h1><p class="lede" style="margin-left:0">That page does not exist. <a href="/">Back to the home page</a>.</p></div>' }));
writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `<url><loc>${SITE}${p.path === '/' ? '/' : p.path}</loc></url>`).join('\n')}\n</urlset>\n`);
writeFileSync('dist/_headers', `/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n`);
console.log(`built ${pages.length + 1} pages -> dist/`);
