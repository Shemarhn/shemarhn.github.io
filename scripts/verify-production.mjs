// Read-only public verification; never submits forms or sends email.
import { writeFile } from 'node:fs/promises';
const failures = [];
const rows = [];
const origin = 'https://shemarmarks.com';
const expectedRevision = process.env.EXPECTED_REVISION;
const check = (value, message) => {
  if (!value) failures.push(message);
};
async function get(url) {
  const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(25000) });
  const body = await response.text();
  const row = {
    url,
    status: response.status,
    location: response.headers.get('location'),
    robots: response.headers.get('x-robots-tag'),
  };
  rows.push(row);
  return { response, body, row };
}
let sitemap = await get(origin + '/sitemap.xml');
// Asset propagation can briefly serve the previous XML immediately after a release.
// Retry the same public URL; never lower the required page count or bypass the cache.
for (
  let attempt = 0;
  attempt < 4 && !sitemap.body.includes(`${origin}/services/proxmox-virtualization/`);
  attempt++
) {
  await new Promise((resolve) => setTimeout(resolve, (attempt + 1) * 3000));
  sitemap = await get(origin + '/sitemap.xml');
}
const urls = [...sitemap.body.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
check(
  sitemap.response.status === 200 &&
    urls.length >= 25 &&
    urls.includes(`${origin}/services/proxmox-virtualization/`),
  'Sitemap must list the production pages',
);
for (const url of urls) {
  check(url.startsWith(origin + '/'), 'Foreign sitemap URL: ' + url);
  const { response, body } = await get(url);
  check(response.status === 200, `${url}: expected 200`);
  check(!response.headers.get('x-robots-tag')?.includes('noindex'), `${url}: noindex header`);
  check(!/name="robots" content="[^"]*noindex/.test(body), `${url}: noindex meta`);
  check(body.includes(`rel="canonical" href="${url}"`), `${url}: canonical mismatch`);
  check(body.includes(`property="og:url" content="${url}"`), `${url}: OG mismatch`);
  check(!/shemarhn\.github\.io|shemarmarks\.tech@gmail\.com/.test(body), `${url}: legacy identity`);
  check(body.includes('hello@shemarmarks.com'), `${url}: business email missing`);
  for (const match of body.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    try {
      JSON.parse(match[1]);
    } catch {
      failures.push(`${url}: invalid schema`);
    }
  }
}
const robots = await get(origin + '/robots.txt');
const homepage = await get(origin + '/');
check(homepage.body.includes('Previously worked with'), 'Homepage credibility section missing');
check(homepage.body.includes('4FA60B7F501C47147288A0C0875C6CD8'), 'Bing verification tag missing');
const logoManifest = JSON.parse(
  await (await import('node:fs/promises')).readFile('vendor/previous-work-logos.json', 'utf8'),
);
for (const logo of logoManifest) {
  const response = await fetch(origin + logo.file, { signal: AbortSignal.timeout(25000) });
  const bytes = (await response.arrayBuffer()).byteLength;
  rows.push({ url: origin + logo.file, status: response.status, bytes });
  check(response.status === 200 && bytes === logo.bytes, `Logo missing or changed: ${logo.name}`);
}
check(
  robots.body.includes('Sitemap: ' + origin + '/sitemap.xml') &&
    !/^Disallow: \/\s*$/m.test(robots.body),
  'Production robots config',
);
for (const host of [
  'shemarmarks.com',
  'www.shemarmarks.com',
  'shemar-marks.shemarmarks.workers.dev',
]) {
  for (const protocol of ['http:', 'https:']) {
    const url = `${protocol}//${host}/services/index.html?source=audit`;
    const { response } = await get(url);
    check(
      response.status === 301 &&
        response.headers.get('location') === origin + '/services/?source=audit',
      `${url}: expected one-hop canonical redirect`,
    );
  }
}
for (const path of ['/not-a-real-page-for-deployment-audit/', '/.git/config', '/wrangler.jsonc']) {
  let { response } = await get(origin + path);
  if (response.status === 301 && response.headers.get('location')?.startsWith(origin + '/'))
    ({ response } = await get(response.headers.get('location')));
  check(response.status === 404, `${path}: expected terminal 404`);
}
for (const path of ['/admin/', '/api/admin/inquiries']) {
  const { response } = await get(origin + path);
  check([302, 401, 403].includes(response.status), `${path}: anonymous access must be blocked`);
}
const staging = await get('https://shemar-marks-staging.shemarmarks.workers.dev/');
check(
  staging.response.headers.get('x-robots-tag')?.includes('noindex') ||
    staging.response.status === 302,
  'Staging must not be indexable',
);
for (const url of ['https://shemarhn.github.io/', 'https://shemarhn.github.io/sitemap.xml']) {
  const { response } = await get(url);
  check([404, 410].includes(response.status), `${url}: retired Pages still serves content`);
}
if (expectedRevision) {
  const release = await get(origin + '/deployment.json');
  check(
    release.response.status === 200 && JSON.parse(release.body).revision === expectedRevision,
    'Deployed revision mismatch',
  );
}
const report = {
  date: new Date().toISOString(),
  pages: urls.length,
  requests: rows.length,
  rows,
  failures,
};
if (process.env.AUDIT_REPORT)
  await writeFile(process.env.AUDIT_REPORT, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ pages: urls.length, requests: rows.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;
