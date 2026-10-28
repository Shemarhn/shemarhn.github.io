# Shemar Marks

A static-first Astro 7 website with a separate Cloudflare Worker for inquiries, references, analytics, authentication, and durable delivery. Production runs at https://shemarmarks.com on Cloudflare Workers with D1. The source of truth is the `main` branch of this repository. GitHub Pages publishing is disabled.

## Start here

1. Read [production deployment and rollback](docs/DEPLOYMENT.md).
2. Read [the architecture](docs/ARCHITECTURE.md) and [verification report](docs/VERIFICATION.md).
3. Use Node.js 24 and pnpm 11. The lockfile records tested dependency versions.

```sh
pnpm install --frozen-lockfile
cp .env.example .env
cp .dev.vars.example .dev.vars
pnpm db:local
pnpm build
pnpm preview
```

Open `http://127.0.0.1:4321`. Windows users can use `Copy-Item` instead of `cp`. `pnpm dev` starts the faster Astro-only visual preview; API, authentication, and D1 behavior require `pnpm preview`.

Local form testing works only on a loopback hostname with `APP_ENV=development` and `LOCAL_FORM_TESTING=true`. There is **no local administrator authentication bypass**. The admin route fails closed until Cloudflare Access is configured.

The preview command explicitly sets the local upstream to `127.0.0.1:4321`; otherwise Wrangler infers the production route hostname and correctly refuses the loopback-only form test bypass.

Astro telemetry may be disabled with `ASTRO_TELEMETRY_DISABLED=1`. Wrangler metrics may be disabled with `WRANGLER_SEND_METRICS=false`.

## Checks

```sh
pnpm test
pnpm build
pnpm test:site
node scripts/http-smoke.mjs
```

The HTTP smoke test needs the local Worker and writes synthetic records only to its local database. Never point it at production. `TEST_BASE_URL` changes its target for a separate local instance.

`pnpm build:qa` produces an explicitly instrumented local build with axe and rendering metrics. Inspect `document.documentElement.dataset.smAudit`, `smFcp`, `smLcp`, and `smCls` in the built-in browser. **Run `pnpm build` again before deployment** to remove the QA library. Production CI always uses the normal build.

## Content and customization

- Brand and shared content: `src/data/site.ts`.
- Page and component source: `src/pages/`, `src/components/`, `src/layouts/`.
- Visual system and responsive behavior: `src/styles/global.css` and `src/styles/experience.css`.
- Editable SM geometry: `src/brand/monogram.ts`; regenerate exports with `node scripts/export-brand.mjs`.
- Technology carousel content and actual logos: `src/data/technologies.ts`, `public/assets/technologies/`.
- Insights: Markdown in `src/content/insights/`; see [publishing](docs/PUBLISHING.md).
- Prices: `pricing` data in `src/data/site.ts`. No unapproved numerical prices are published.
- Original supplied brand references: `brand/`. Optimized site images: `public/assets/`.
- CRM and email adapters: `worker/integrations.ts`; contracts and setup are documented below.

## Documentation

- [Cloudflare deployment and credentials](docs/LAUNCH.md)
- [Architecture, security, and operations](docs/ARCHITECTURE.md)
- [CRM contract](docs/CRM.md)
- [Acknowledgment email setup](docs/EMAIL.md)
- [Weekly publishing](docs/PUBLISHING.md)
- [SEO research, topic map, and content plan](docs/SEO.md)
- [Content and brand audit](docs/AUDIT.md)
- [Vector identity, motion, technology explorer, and licenses](docs/DESIGN-SYSTEM.md)
- [Test results and verification limits](docs/VERIFICATION.md)

Production is built from `src/` into `dist/` and deployed by GitHub Actions from `main`, after tests, type checks, and the generated-site audit. Deployment activation requires the production environment credential and repository variables in [DEPLOYMENT.md](docs/DEPLOYMENT.md). The legacy root Pages entry files are retired; history remains available. Verify `/deployment.json` against the main commit after a release.
