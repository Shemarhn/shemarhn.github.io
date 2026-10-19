import { readdir, readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { gzipSync } from 'node:zlib';
const root = resolve('dist');
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)])),
    )
  ).flat();
}
const files = await walk(root),
  htmlFiles = files.filter((f) => f.endsWith('.html'));
const failures = [],
  titles = new Set(),
  descs = new Set();
let links = 0,
  jsonld = 0;
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const name = file.slice(root.length).replaceAll('\\', '/');
  const check = (ok, reason) => {
    if (!ok) failures.push(`${name}: ${reason}`);
  };
  check((html.match(/<h1[ >]/g) || []).length === 1, 'exactly one H1');
  check(html.includes('lang="en"'), 'document language');
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  check(title && !titles.has(title), 'unique title');
  titles.add(title);
  const description = html.match(/name="description" content="([^"]*)"/)?.[1];
  check(description && !descs.has(description), 'unique description');
  descs.add(description);
  check(/rel="canonical" href="https:\/\/shemarmarks.com\//.test(html), 'canonical URL');
  for (const meta of ['og:title', 'og:description', 'og:image', 'og:url', 'twitter:card'])
    check(html.includes(`"${meta}"`), `missing ${meta}`);
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(match[1]);
      jsonld++;
    } catch {
      check(false, 'invalid JSON-LD');
    }
  }
  for (const match of html.matchAll(/<img\b[^>]*>/g))
    check(/\balt=/.test(match[0]), 'image missing alt');
  check(
    !/shemarmarks\.tech@gmail\.com|noreply@|lorem ipsum/i.test(html),
    'legacy or placeholder content',
  );
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
  for (const match of html.matchAll(/(?:href|src)="([^"#][^"]*)"/g)) {
    const url = match[1].replaceAll('&amp;', '&');
    if (!url.startsWith('/') || url.startsWith('//') || url.startsWith('/api/')) continue;
    links++;
    const clean = url.split(/[?#]/)[0];
    const target = join(root, clean, clean.endsWith('/') ? 'index.html' : '');
    check(files.includes(target), `broken local URL: ${clean}`);
  }
  for (const match of html.matchAll(/href="#([^" ]+)"/g))
    check(ids.has(match[1]), `missing anchor ${match[1]}`);
}
const homepage = await readFile(join(root, 'index.html'));
const css = files.filter((f) => f.endsWith('.css'));
const js = files.filter((f) => f.endsWith('.js'));
const size = async (fs) => {
  let bytes = 0;
  for (const f of fs) bytes += (await stat(f)).size;
  return bytes;
};
const report = {
  date: new Date().toISOString(),
  htmlPages: htmlFiles.length,
  localLinksChecked: links,
  jsonldDocuments: jsonld,
  homepageHTMLGzip: gzipSync(homepage).length,
  totalCSS: await size(css),
  totalJS: await size(js),
  failures,
};
await mkdir('reports', { recursive: true });
await writeFile('reports/static-audit.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;
