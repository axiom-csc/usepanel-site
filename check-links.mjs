// Checks dist/: every internal href/src resolves to a file, every #anchor exists, every page has title+description.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const html = walk('dist').filter((f) => f.endsWith('.html'));
const resolve = (u) => { const p = join('dist', u); return [p, p + '.html', join(p, 'index.html')].find((c) => existsSync(c) && statSync(c).isFile()); };
let bad = 0, n = 0, ext = new Set();
for (const f of html) {
  const s = readFileSync(f, 'utf8');
  if (!/<title>[^<]+<\/title>/.test(s) || !/name="description"/.test(s)) { console.log('MISSING title/description', f); bad++; }
  for (const [, , u] of s.matchAll(/(href|src)="([^"]*)"/g)) {
    if (/^(mailto:|tel:)/.test(u)) { if (!/^mailto:[^@\s]+@[^@\s?]+(\?|$)/.test(u)) { console.log('BAD mailto', f, u.slice(0, 60)); bad++; } continue; }
    if (/^https?:\/\//.test(u)) { ext.add(u); continue; }
    n++;
    const [path, hash] = u.split('#');
    const target = path === '' ? f : path.startsWith('/') ? resolve(path) : null;
    if (!target) { console.log('BROKEN', f, u); bad++; continue; }
    if (hash && !new RegExp(`id="${hash}"`).test(readFileSync(target, 'utf8'))) { console.log('NO ANCHOR', f, u); bad++; }
  }
}
console.log(`${html.length} pages, ${n} internal links checked, ${bad} problems. External (not fetched here): ${[...ext].filter((u) => !u.startsWith('https://usepanel.dev')).join(', ')}`);
process.exit(bad ? 1 : 0);
