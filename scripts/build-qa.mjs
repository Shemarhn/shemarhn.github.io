import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
const pkg = JSON.parse(readFileSync('node_modules/astro/package.json', 'utf8'));
const result = spawnSync(
  process.execPath,
  [resolve('node_modules/astro', pkg.bin.astro), 'build'],
  {
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1', PUBLIC_QA_AUDIT: 'true' },
    stdio: 'inherit',
  },
);
process.exitCode = result.status || 0;
