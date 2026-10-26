# Production deployment and rollback

Audit date: 26 October 2026 (Jamaica). Deployment completion is recorded separately in the migration receipt; desired configuration below must be verified in both dashboards.

## What the audit established

The custom domain and GitHub Pages were two different deployments. The live production application is Astro static output plus a Cloudflare Worker, not the old HTML at the repository root. Cloudflare's `shemar-marks` Worker had been deployed manually with Wrangler, most recently version `6d19dd3c-6e6e-48ff-ba50-ef44866c321a` on 20 October UTC. Its source was commit `9ffc6cf5e71bf8e8938012319f3abf4994a76b18` on `site-experience-v2`, in draft PR #1. `main` still served the old portfolio via GitHub Pages. No Cloudflare Git build was connected, and GitHub Actions had no deployment secrets or variables.

Production already had correct custom-domain canonical/OG/schema/email metadata, a 24-URL sitemap and matching robots file. The old GitHub Pages copy separately had its own canonical/sitemap. HTTP production requests still returned 200 rather than upgrading to HTTPS; the Worker hostname served a noindex copy.

## Single production architecture

```text
Shemarhn/shemarhn.github.io : main
  -> GitHub Actions : validate, then production deploy
  -> frozen pnpm dependencies, tests, type checks, Astro build, static audit
  -> Wrangler deploy : shemar-marks
  -> Cloudflare routes : shemarmarks.com/* and www.shemarmarks.com/*
  -> Worker + ASSETS (dist/) + production D1
  -> https://shemarmarks.com/
```

The repository name does not activate GitHub Pages. Keep **Settings > Pages > Branch = None**. There is no Pages deployment workflow. The obsolete root `index.html`, styles/script, robots, sitemap and `.nojekyll` are removed; Git history and the pre-migration Git bundle retain them. `migration/github-pages/` is an unused historical redirect template, not a publishing source. Existing root assets are historical reference assets and are not uploaded by Wrangler; only `dist/` is public.

The production Worker redirects HTTP, www, and its exact production workers.dev hostname to HTTPS apex. GET/HEAD redirects use 301; other methods use 308 to preserve bodies. Page-path normalization preserves attribution queries and avoids chains. Staging/preview/local hosts remain isolated and noindex. Unknown pages return 404. Retired Pages returns 404 rather than a competing page; it does not provide a 301 or transfer old fragment-link traffic.

## Account resources and DNS

- Cloudflare account: `bcc404e1b7f91905e3b021c9a6b46680`.
- Authoritative nameservers: `hal.ns.cloudflare.com`, `jean.ns.cloudflare.com`. Registrar was Namecheap in launch records; this audit does not require a registrar change.
- Apex A record: `162.255.119.56`, proxied; www CNAME: `shemarmarks.com`, proxied. These are route-bearing DNS records. The Worker intercepts both routes before origin; the Namecheap parking address is not the application host. Do not remove the Worker routes or disable the proxy as a rollback.
- Production D1: `shemar-marks`, ID `7ac03e7c-e8ac-4798-9f1f-0f0e4e133ea9`; `DB` binding. `ASSETS` serves `dist/`.
- Staging D1: `shemar-marks-staging`, ID `0bf4e1e1-e3ec-44e6-84ff-710f1b820e86`; separate Worker and database.
- Cron every five minutes processes durable delivery/retention and social review queues. Social remains `review`.
- Workspace mail: MX `smtp.google.com` priority 1; SPF Google include; DKIM `google._domainkey`; DMARC reports to `dmarc@shemarmarks.com`. Preserve these and verification TXT records byte for byte.
- Public/acknowledgment/reply email: `hello@shemarmarks.com`, an existing Workspace alias. Worker secrets supply Gmail OAuth. No new mailbox or mail-provider migration is required.

## Configure automatic deployment

Use `.github/workflows/site.yml` as the single automatic deployer. The workflow deploys validated main pushes and manual runs from main; PR and scheduled validation cannot deploy. The `production` GitHub environment holds the narrowly scoped Cloudflare token. The existing Cloudflare GitHub App is installed with all-repository access, but no permission change or native Workers Builds connection is needed for this architecture.

| Setting                       | Value                                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------- |
| Worker                        | `shemar-marks`                                                                              |
| Repository                    | `Shemarhn/shemarhn.github.io`                                                               |
| Production branch             | `main`                                                                                      |
| Root directory                | `/`                                                                                         |
| Node                          | 24 (`.node-version`)                                                                        |
| Package manager               | `pnpm@11.25.0` from package.json                                                            |
| Dependency installation       | `pnpm install --frozen-lockfile`                                                            |
| Build command                 | `pnpm run build:production`                                                                 |
| Deploy command                | `pnpm exec wrangler deploy`                                                                 |
| Build variable                | `PUBLIC_TURNSTILE_SITE_KEY` = existing production public widget key                         |
| Production environment secret | `CLOUDFLARE_API_TOKEN` (least privilege for this Worker and its configured routes/bindings) |
| Repository variable           | `CLOUDFLARE_ACCOUNT_ID=bcc404e1b7f91905e3b021c9a6b46680`                                    |
| Repository variable           | `ENABLE_PRODUCTION_DEPLOY=true` only after credential setup                                 |

`build:production` requires the Turnstile build key, records the commit in `/deployment.json`, runs tests, Astro/Worker type checks, builds Astro, and audits generated links/SEO. A failure stops deployment. Runtime Gmail, Turnstile secret, Access audience/team/email, and IP salt remain encrypted Worker secrets; do not copy them into GitHub or build variables. `wrangler.jsonc` owns non-secret runtime configuration, routes, bindings, and cron. D1 migrations are manual reviewed operations, never implicit in CI.

The validation job records provenance on main, tests, type-checks, builds, audits and uploads `dist/`. Deployment downloads that exact artifact, rejects missing credentials, skips a superseded main revision, serializes production deployments, and runs public URL/revision verification after Wrangler succeeds. A validation failure prevents deployment; a public verification failure marks the release failed and requires investigation or rollback. Do not add production secrets to pull request jobs. Repository branch rules should require the `validate` check where supported; inspect existing rules before changing protection. Do not enable a second native Workers Builds deployer alongside this workflow.

## Migration order

1. Save the old repository refs/Git bundle and current Worker version; capture DNS, Pages, routes, CI and public SEO evidence.
2. Confirm current production metadata, forms configuration, D1/Access bindings and Workspace records.
3. Disable Pages publishing before merging, so the modern source cannot be exposed accidentally by Pages.
4. Add canonical redirects, release provenance, automated verification and current documentation; remove obsolete root Pages entry files. Validate PR #1 and merge the verified revision into main.
5. Configure the GitHub production environment token and repository variables; authorize only required deployment access. Verify a real main commit produces a successful Actions deployment and matching `/deployment.json` revision. Until this is demonstrated, automation remains incomplete.
6. Run `node scripts/verify-production.mjs` with `EXPECTED_REVISION` set to the deployed main SHA. Preserve its JSON report. Confirm email DNS unchanged, existing aggregate analytics present, and anonymous admin access denied.
7. Update any GitHub profile/project links that still point to the retired Pages host. Search Console/Bing index removal is asynchronous; inspect their canonical/indexing reports after recrawl. A 404 retirement does not instantly erase cached results.

## SEO and analytics

`astro.config.mjs` and `src/data/site.ts` use `https://shemarmarks.com`. Shared layout builds page canonical/OG/social image URLs and schema from this origin. `src/pages/sitemap.xml.ts`, public robots and RSS use the same origin. Production HTML contains `hello@shemarmarks.com`; no old Gmail business identity is served.

First-party aggregate analytics uses relative `/api/events` on the production domain and `event_counts` in its D1 database. It records day/event/page counts and honors DNT/GPC and local opt-out. This is separate from search impressions/rankings. The optional Cloudflare Web Analytics beacon is off unless `PUBLIC_ANALYTICS_TOKEN` is configured for this domain. This migration does not claim GA4, Clarity, Bing or Search Console performance verification merely from DNS verification records. No paid analytics is required for deployment.

## Rollback

1. Set repository variable `ENABLE_PRODUCTION_DEPLOY=false`, then cancel any already-running deployment job before rollback. Do not push another main commit until the bad deployment is contained.
2. In Cloudflare > `shemar-marks` > Deployments, select the previously verified version and Rollback. The pre-migration known-live version is `6d19dd3c-6e6e-48ff-ba50-ef44866c321a`. CLI alternative from an authorized checkout: `pnpm exec wrangler rollback 6d19dd3c-6e6e-48ff-ba50-ef44866c321a --name shemar-marks`. Verify the provider's confirmation before executing.
3. Rollback is code/assets, not a D1 restore. This migration adds no schema migrations and leaves secrets/DNS/mail/Access in place. Do not run destructive SQL or restore an old database over new inquiries. Future schema releases must preserve backward compatibility or have a separate database recovery plan.
4. Revert the faulty repository commit via a reviewed PR; run tests/build/audit. Resume the main build only once the fixed revision is ready.
5. Verify homepage, contact, sitemap, canonical redirects, admin denial and aggregate event collection. A rollback to pre-migration code reintroduces the old HTTP/Worker alias behavior until the fix is redeployed.
6. Keep GitHub Pages disabled during production recovery. Re-enabling it is an explicit legacy restoration, not production rollback. If necessary, restore its prior root files from the Git bundle/history and select main/root, knowing it restores a separate indexable old website.

Useful public verification:

```sh
EXPECTED_REVISION=<full-main-commit-sha> node scripts/verify-production.mjs
```

On PowerShell set `$env:EXPECTED_REVISION` first. Set `AUDIT_REPORT` to a writable JSON path to retain results. The script is read-only and does not submit forms, send email or read private inquiry data.
