import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/entry.ts';
import { canonicalRedirect } from '../worker/canonical.ts';
import type { Env } from '../worker/types.ts';

const production = { APP_ENV: 'production' } as Env;
test('production aliases normalize scheme, host and page path in one hop', async () => {
  for (const host of [
    'shemarmarks.com',
    'www.shemarmarks.com',
    'shemar-marks.shemarmarks.workers.dev',
  ]) {
    for (const protocol of ['http:', 'https:']) {
      const response = await worker.fetch(
        new Request(`${protocol}//${host}/services/index.html?source=a%20b`),
        production,
        {} as ExecutionContext,
      );
      assert.equal(response.status, 301);
      assert.equal(
        response.headers.get('Location'),
        'https://shemarmarks.com/services/?source=a%20b',
      );
      assert.equal(
        canonicalRedirect(new Request(response.headers.get('Location')!), production),
        undefined,
      );
    }
  }
});
test('canonical pages and assets stay stable; POST redirects preserve method and API path', () => {
  assert.equal(
    canonicalRedirect(new Request('https://shemarmarks.com/services/'), production),
    undefined,
  );
  assert.equal(
    canonicalRedirect(new Request('https://shemarmarks.com/assets/favicon.png'), production),
    undefined,
  );
  const redirect = canonicalRedirect(
    new Request('http://www.shemarmarks.com/api/events', { method: 'POST', body: '{}' }),
    production,
  )!;
  assert.equal(redirect.status, 308);
  assert.equal(redirect.headers.get('Location'), 'https://shemarmarks.com/api/events');
});
test('staging, previews and local development never redirect to production', () => {
  for (const url of [
    'http://127.0.0.1:4321/',
    'https://shemar-marks-staging.shemarmarks.workers.dev/',
    'https://preview-shemar-marks.shemarmarks.workers.dev/',
  ])
    assert.equal(canonicalRedirect(new Request(url), production), undefined);
  assert.equal(
    canonicalRedirect(new Request('http://www.shemarmarks.com/'), { APP_ENV: 'staging' } as Env),
    undefined,
  );
});
