# Historical launch checklist

The production site is live. Use [DEPLOYMENT.md](DEPLOYMENT.md) for the current deployment architecture, migration sequence, and rollback. The checklist below records original launch preparation.

# Launch checklist

The implementation is prepared for Cloudflare Workers with static assets. Nothing should be published to the primary domain until staging, DNS, email, and form delivery are verified.

## Required account configuration

1. **DNS safety first:** before changing Namecheap nameservers, inventory every current DNS record and all Google Workspace records. Recreate MX, SPF, DKIM, DMARC, Google verification, and any other required records in Cloudflare and verify them before nameserver cutover. A website launch must not interrupt mail.
2. **Cloudflare:** create separate production and staging D1 databases. Replace the placeholder `database_id` values in `wrangler.jsonc`. Apply all repository migrations (`0001_initial.sql` and `0002_social_syndication.sql`) to staging first and production only after staging passes. Back up any existing database before applying future migrations.
3. **Spam protection:** create Turnstile widgets restricted to the production/staging hostnames. Set `PUBLIC_TURNSTILE_SITE_KEY`. Store `TURNSTILE_SECRET_KEY` as a Worker secret and configure `TURNSTILE_HOSTNAMES`. The server verifies action and hostname. Never deploy the local testing bypass.
4. **Admin identity:** create Cloudflare Access protection covering `/admin`, `/admin/*`, and `/api/admin/*`. Allow only `shemar@shemarmarks.com` and require strong authentication/MFA where available. Set `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD`, and `ADMIN_EMAILS`. The Worker independently verifies the signed Access JWT.
5. **Email:** launch with the Gmail adapter described in [EMAIL.md](EMAIL.md). Ensure `hello@shemarmarks.com` exists as a receiving address and is an authorized send-as identity for the Workspace account. Create the narrow Gmail API OAuth configuration, then store `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, and `GMAIL_REFRESH_TOKEN` as Worker secrets. Test send and reply behavior in staging before production.
6. **Orbit CRM:** deploy/configure Orbit v0.2 and use its dedicated `/api/v1/website-inquiries` endpoint described in [CRM.md](CRM.md). Create a dedicated Orbit integration token with only `crm.write`; store it as `CRM_API_TOKEN`. Set `CRM_API_URL` to the full HTTPS endpoint. Keep `CRM_CREATE_OPPORTUNITY=false` initially. If Orbit/home infrastructure is temporarily unavailable, do not expose Proxmox management or block the website launch: D1 retains accepted inquiries and the CRM delivery job retries later.
7. **Abuse protection:** store a high-entropy `IP_HASH_SALT`. It salts short-lived rate counters. Confirm staging isolation and no production local-testing variables.
8. **Social syndication:** keep `SOCIAL_MODE=review` for launch. Configure LinkedIn only after obtaining the correct member authorization and current API version. Configure X only if suitable developer access is available and explicitly approved; do not purchase credits without owner approval. See [SOCIAL.md](SOCIAL.md). Social-provider outages must never block article publication.
9. **Content:** review the three launch articles, certification wording, case-study facts, privacy notice, and approved pricing. Current pricing intentionally remains scope-based until owner-approved ranges are supplied.
10. **Search/measurement:** after the production domain is healthy, verify Google Search Console and Bing Webmaster Tools, submit `/sitemap.xml`, inspect representative URLs, and optionally configure privacy-respectful analytics.

Secrets belong in Cloudflare/authorized provider secret stores, never repository files. Relevant production/staging secret names include:

```text
TURNSTILE_SECRET_KEY
IP_HASH_SALT
CRM_API_TOKEN
GMAIL_CLIENT_ID
GMAIL_CLIENT_SECRET
GMAIL_REFRESH_TOKEN
LINKEDIN_ACCESS_TOKEN        # only when configured
X_API_KEY                    # only when configured and approved
X_API_SECRET
X_ACCESS_TOKEN
X_ACCESS_TOKEN_SECRET
```

Relevant non-secret variables include the D1 binding IDs in Wrangler, `TURNSTILE_HOSTNAMES`, `EMAIL_PROVIDER=gmail`, `SOCIAL_MODE=review`, `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD`, `ADMIN_EMAILS`, `CRM_API_URL`, `CRM_CREATE_OPPORTUNITY=false`, `LINKEDIN_AUTHOR_URN`, and a supported `LINKEDIN_VERSION` when LinkedIn is enabled. Turnstile site keys and the optional analytics token are public build variables, not credentials.

## Release sequence

1. Review the `site-experience-v2` pull request and the Orbit v0.2 pull request. Keep the website PR in draft until staging is fully exercised.
2. Confirm CI is green on the exact commit intended for staging. Locally this means `pnpm install --frozen-lockfile`, `pnpm test`, `pnpm build`, and `pnpm test:site` for the website, plus the Orbit release test/build suite.
3. Inventory Namecheap/Google Workspace DNS before touching nameservers. Reproduce the complete zone in Cloudflare first.
4. Configure the staging D1 database, apply all committed migrations (0001–0003), configure Turnstile, Access, secrets, and the staging hostname. Deploy with `pnpm exec wrangler deploy --env staging` after a successful build.
5. Verify staging has `X-Robots-Tag: noindex, nofollow` and a disallowing robots file. Protect the staging hostname with Access if privacy is desired; noindex is not access control.
6. Run a legitimate Turnstile inquiry. Verify D1 accepts the lead before downstream effects, the Gmail acknowledgment arrives and can be replied to, and Orbit ingests the lead exactly once. Take Orbit offline, submit another staging inquiry, confirm the website still succeeds and email still works, restore Orbit, and verify the pending CRM job later delivers once.
7. Verify references end to end: public pending submission, owner-entered reference, approve/reject/needs-changes, identity withholding, project-value permission, public rendering, and authenticated deletion from `/admin/data/`.
8. Open `/admin/social/`, sync published articles, inspect generated LinkedIn/X drafts, edit/save/skip them, and confirm review mode does not publish unapproved drafts. Do not make public social posts during staging without explicit owner approval.
9. Validate `/admin/data/` and the 12-month website-copy retention behavior. Orbit retains its own legitimate business records according to its separate policy; the website D1 is not the long-term CRM.
10. Run mobile/desktop visual QA, keyboard/accessibility checks, real 404/redirect tests, sitemap/RSS/social-preview/schema checks, and PageSpeed/Lighthouse from the deployed staging URL.
11. Configure the production D1 database and secrets, then deploy the Worker. Add the apex domain only after staging passes. Keep the old site available until production routing is verified.
12. Only after the Cloudflare zone is complete and mail records have been confirmed should Namecheap nameservers be switched. Verify Google Workspace inbound/outbound mail immediately after propagation.
13. Verify `shemarmarks.com`, the `www` redirect, contact flow, admin Access, and email externally. Then enable normal production indexing on the apex hostname.
14. Submit the sitemap to Google/Bing and inspect key service/article URLs. Keep `SOCIAL_MODE=review` after launch until owner explicitly chooses automatic syndication.

## CI/CD

The GitHub workflow validates pull requests and builds normal production artifacts. Production deployment is gated by GitHub's `production` environment. Configure environment protection, a least-privilege `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, and `PUBLIC_TURNSTILE_SITE_KEY`. Pull requests should not receive production secrets.

Do not enable production deployment until Wrangler database IDs and account resources are correct. Remote D1 migrations are deliberately not implicit in CI; apply and verify them before a release that depends on them.

## Costs

The launch target is no new recurring hosting bill: Cloudflare Workers/D1/Turnstile free allowances at low traffic plus the existing domain and Google Workspace account. Provider free allowances and terms can change, so check them at activation. Do not create a paid X developer balance, paid email provider, paid analytics service, or other recurring service without explicit owner approval.

## Old GitHub Pages URLs

GitHub Pages cannot send arbitrary server-side 301 responses. Preserve old anchors such as `#services`, `#work`, `#northstar`, `#cedarfield`, `#harborlight`, `#care`, `#about`, and `#contact` in the migration page and map them to the new paths with visible fallback links. Keep old public assets that may have external links. Verify the old-host behavior during production cutover rather than claiming a server-side 301 that GitHub Pages cannot provide.
