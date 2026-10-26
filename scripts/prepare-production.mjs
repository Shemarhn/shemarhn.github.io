import { execFileSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
const key = process.env.PUBLIC_TURNSTILE_SITE_KEY;
if (!key || !/^0x[\w-]+$/.test(key))
  throw Error('PUBLIC_TURNSTILE_SITE_KEY must be set for production.');
const revision =
  process.env.WORKERS_CI_COMMIT_SHA ||
  process.env.GITHUB_SHA ||
  execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
if (!/^[a-f0-9]{40}$/i.test(revision)) throw Error('A full Git revision is required.');
await writeFile(
  'public/deployment.json',
  JSON.stringify({
    revision,
    canonical: 'https://shemarmarks.com',
    builtAt: new Date().toISOString(),
  }) + '\n',
);
console.log(`Preparing production revision ${revision}`);
