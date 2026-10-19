import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:4321';
if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(base).hostname)) {
  throw new Error('This smoke test creates synthetic data and is restricted to local hosts.');
}
const results = [];
async function get(path, status = 200) {
  const response = await fetch(base + path, { redirect: 'manual' });
  assert.equal(response.status, status, path);
  results.push({ path, status: response.status });
  return response;
}
for (const path of [
  '/',
  '/services/',
  '/services/websites/',
  '/work/northstar/',
  '/about/',
  '/pricing/',
  '/references/',
  '/references/submit/',
  '/insights/',
  '/contact/',
  '/rss.xml',
  '/sitemap.xml',
]) {
  const r = await get(path);
  assert.match(r.headers.get('X-Robots-Tag') || '', /noindex/);
  assert.equal(r.headers.get('X-Content-Type-Options'), 'nosniff');
}
await get('/this-does-not-exist/', 404);
await get('/services?utm_source=smoke', 301);
await get('/admin/', 503);
await get('/api/admin/testimonials', 503);
const post = (payload) =>
  fetch(base + '/api/inquiries', {
    method: 'POST',
    headers: { Origin: base, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
const id = crypto.randomUUID();
const payload = {
  requestId: id,
  name: 'Local QA',
  email: 'qa@example.invalid',
  company: 'LOCAL TEST ONLY',
  service: 'Website Development',
  description: 'Local test of reliable inquiry storage. No external email delivery is configured.',
  timeline: 'Just exploring',
  privacy: true,
  metadata: { cta: 'Local QA', source: 'Website', campaign: 'Local form verification' },
};
let r = await post(payload);
assert.equal(r.status, 201, await r.clone().text());
assert.equal((await r.json()).ok, true);
r = await post(payload);
assert.equal(r.status, 200);
assert.equal((await r.json()).duplicate, true);
r = await fetch(base + '/api/testimonials', {
  method: 'POST',
  headers: { Origin: base, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    requestId: crypto.randomUUID(),
    name: 'LOCAL QA REFERENCE',
    email: 'qa@example.invalid',
    service: 'Local verification',
    quote:
      'This synthetic reference tests the private moderation boundary and must never be published.',
    privacy: true,
    status: 'approved',
    show_value: true,
  }),
});
assert.equal(r.status, 201);
const pub = await (await get('/api/testimonials')).json();
assert.ok(!pub.testimonials.some((t) => t.name === 'LOCAL QA REFERENCE'));
results.push(
  { check: 'durable form acceptance and idempotent replay', status: 'passed' },
  { check: 'public reference remains private', status: 'passed' },
);
await mkdir('reports', { recursive: true });
await writeFile('reports/http-smoke.json', JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
