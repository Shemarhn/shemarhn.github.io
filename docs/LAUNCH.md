# Launch checklist

The implementation is local and prepared for Cloudflare Workers with static assets. Nothing has been published to the primary domain.

## Required account configuration

1. **Cloudflare:** choose the account; create separate production and staging D1 databases. Replace the placeholder `database_id` values in `wrangler.jsonc`. Apply `migrations/0001_initial.sql` with `pnpm db:remote` (use `--env staging` for staging). Back up any existing database before applying migrations. There is no destructive migration here.
2. **Spam protection:** create a Turnstile widget restricted to your production/staging hostnames. Set the build variable `PUBLIC_TURNSTILE_SITE_KEY`. Store `TURNSTILE_SECRET_KEY` with `wrangler secret put`; configure `TURNSTILE_HOSTNAMES`. The browser emits `inquiry` and `testimonial` actions; the server checks both action and hostname. Do not deploy a test secret or the local bypass.
3. **Admin identity:** create a Cloudflare Access self-hosted application covering `/admin` and `/admin/*`, plus `/api/admin/*`. Use an allow policy for your account, requiring MFA through your identity provider. Set `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD`, and the `ADMIN_EMAILS` allowlist. The Worker independently verifies the JWT signature, issuer, expiry, audience, and email. Access protects the UI; origin checks protect mutations. Do not rely on a header containing an email address.
4. **Email:** configure Resend with a verified `shemarmarks.com` sending domain, then store `RESEND_API_KEY`. Alternatively configure the Gmail adapter described in [EMAIL.md](EMAIL.md). Confirm that `hello@shemarmarks.com` receives replies. Test with your own mailbox in staging.
5. **CRM:** set `CRM_API_URL` to the HTTPS endpoint and store `CRM_API_TOKEN`. Implement the idempotent v1 contract in [CRM.md](CRM.md). Optional `CRM_CREATE_OPPORTUNITY=true` enables the opportunity request. Missing CRM configuration leaves jobs pending without consuming failure attempts; inquiry acceptance still succeeds after D1 storage.
6. **Abuse protection:** store a high-entropy `IP_HASH_SALT` with `wrangler secret put`. Rotate deliberately; it salts short-lived rate counters. Confirm staging isolation and no production local-testing variables.
7. **Domain and content:** review the three launch articles, certification wording, case-study facts, privacy notice, and any pricing you choose to add. Configure the apex custom domain, `www` redirect, and staging hostname only after staging passes. Verify email DNS (SPF/DKIM/DMARC), Search Console, and Bing Webmaster Tools.

Example secret creation (interactive; never place values in repository files):

```sh
pnpm exec wrangler secret put TURNSTILE_SECRET_KEY
pnpm exec wrangler secret put IP_HASH_SALT
pnpm exec wrangler secret put RESEND_API_KEY
pnpm exec wrangler secret put CRM_API_TOKEN
```

Configure non-secret variables in Wrangler or the deployment environment. Repeat secrets for `--env staging`; bindings and variables are intentionally separate. Turnstile site keys and optional `PUBLIC_ANALYTICS_TOKEN` are build-time public values; never give them a privileged Cloudflare API token.

## Release sequence

1. Review the `site-experience-v2` branch and pull request in `Shemarhn/shemarhn.github.io`. Existing main history and GitHub Pages files are preserved. Merge only when the staged release is ready; the Astro build output is `dist/`, not the legacy root HTML.
2. Run `pnpm install --frozen-lockfile`, `pnpm test`, `pnpm build`, and `pnpm test:site`.
3. Configure the staging database, secrets, Access application, and hostname. Deploy with `pnpm exec wrangler deploy --env staging` after a normal build.
4. Verify staging has `X-Robots-Tag: noindex, nofollow` and a disallowing robots file. Add Cloudflare Access to the whole staging hostname if you want privacy; noindex alone is not privacy protection.
5. Run a legitimate Turnstile submission from the browser. Check D1 acceptance, CRM idempotency, email reception/reply behavior, and attribution. Disconnect the CRM and verify that the lead remains stored. Restore connectivity and confirm synchronization after a scheduled retry.
6. Verify authenticated reference creation, public pending submission, approve/reject/needs-changes transitions, identity withholding, and value permissions. Make a temporary real test reference in staging only, then remove it using the restricted database tools.
7. Configure production database/secrets, then deploy with `pnpm exec wrangler deploy`. Add the custom domain through Cloudflare. Keep the previous site available until DNS and routing are verified. Turn on production indexing only for the apex hostname.
8. Submit the sitemap and inspect representative URLs in Google/Bing. Test a real 404, redirects, canonical URLs, RSS, social previews, email delivery, and mobile performance from outside the local machine.

## CI/CD

The workflow validates pull requests and builds normal production artifacts. Production deployment is gated by GitHub’s `production` environment. Configure environment protection, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, and `PUBLIC_TURNSTILE_SITE_KEY`. Use a token restricted to the selected Worker/D1 account resources. Pull requests never receive deployment secrets. The scheduled build supports dated posts; protect the default branch.

Do not enable the production deployment job until Wrangler IDs and account resources are correct. No remote database migration runs implicitly in CI. Apply and verify a migration deliberately before a release that needs it.

## Costs and limits

The architecture can start on Workers/D1/Turnstile free allowances at low traffic. It does not require Queues or home-server hosting. Free allowances are bounded; a domain, an existing Google Workspace account, and usage beyond provider allowances are not included. Resend and Cloudflare plan terms must be checked at activation. See [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/) and [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/).

## Old GitHub Pages URLs

GitHub Pages cannot send arbitrary server-side 301 responses. Preserve old anchors such as `#services`, `#work`, `#northstar`, `#cedarfield`, `#harborlight`, `#care`, `#about`, and `#contact` in an optional migration page, map them to the new paths, and offer visible fallback links. Configure the old Pages repository to point to the custom domain if appropriate; verify platform redirect behavior rather than claiming a 301 from client JavaScript. A complete fallback is provided in `migration/github-pages/index.html`. Preserve/download old public slide decks if any external links still use them.
