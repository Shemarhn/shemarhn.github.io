# Shemar Marks

A static-first Astro 7 website with a separate Cloudflare Worker for inquiries, references, analytics, authentication, and durable delivery. Prepared for `shemarmarks.com`; not deployed or connected to live accounts by this build.

## Start here

1. Read [the launch checklist](docs/LAUNCH.md).
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

Development is on `site-experience-v2` in [Shemarhn/shemarhn.github.io](https://github.com/Shemarhn/shemarhn.github.io). The existing default-branch history and live GitHub Pages files are preserved. The Astro application builds from `src/` into `dist/`; legacy root HTML is not part of that build. Production remains gated until the account resources in the launch checklist are configured.
