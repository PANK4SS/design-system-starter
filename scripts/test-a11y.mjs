// Audit d'accessibilité de TOUTES les stories, en thème clair et sombre, avec axe.
// Lancer avec : docker compose run --rm a11y   (construit Storybook puis audite)
// Sort en erreur (code 1) si une seule violation est trouvée.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';

const ROOT = 'storybook-static';
const PORT = 6007;
const THEMES = ['light', 'dark'];
const CONCURRENCY = 4;

// ─── Petit serveur de fichiers statiques pour le Storybook construit ─────────
const TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
};
const server = createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
  try {
    const body = await readFile(join(ROOT, path === '/' ? 'index.html' : path));
    res.writeHead(200, { 'Content-Type': TYPES[extname(path)] ?? 'application/octet-stream' }).end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(PORT, resolve));

// ─── Liste des stories ───────────────────────────────────────────────────────
const index = JSON.parse(await readFile(join(ROOT, 'index.json'), 'utf8'));
const jobs = Object.values(index.entries)
  .filter((entry) => entry.type === 'story')
  .flatMap((entry) => THEMES.map((theme) => ({ id: entry.id, theme })));

// ─── Audit ───────────────────────────────────────────────────────────────────
const browser = await chromium.launch();
const failures = [];
let done = 0;

async function audit({ id, theme }, page) {
  await page.goto(`http://localhost:${PORT}/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`);
  await page.waitForSelector('#storybook-root > *', { state: 'attached', timeout: 15000 });
  await page.waitForTimeout(300); // laisse les animations d'entrée se terminer
  const { violations } = await new AxeBuilder({ page }).include('#storybook-root').analyze();
  for (const v of violations) {
    failures.push(`${id} [${theme}] ${v.id} (${v.impact}) : ${v.help} — ${v.nodes[0]?.target.join(' ')}`);
  }
  done += 1;
  if (done % 50 === 0) console.log(`  ${done}/${jobs.length}`);
}

async function worker(queue) {
  const context = await browser.newContext({ viewport: { width: 1000, height: 700 } });
  const page = await context.newPage();
  for (let job = queue.shift(); job; job = queue.shift()) await audit(job, page);
  await context.close();
}

console.log(`Audit axe de ${jobs.length} combinaisons story × thème…`);
const queue = [...jobs];
await Promise.all(Array.from({ length: CONCURRENCY }, () => worker(queue)));
await browser.close();
server.close();

if (failures.length) {
  console.error(`\n${failures.length} violation(s) :\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(`\nAucune violation d'accessibilité (${jobs.length} combinaisons).`);
