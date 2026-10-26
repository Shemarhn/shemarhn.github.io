# Migration receipt — 26 October 2026

## Completed and verified

- Confirmed production runs on Cloudflare Worker `shemar-marks`, with static assets and the existing production D1 database, rather than GitHub Pages. Previous releases were manual Wrangler uploads from `site-experience-v2`.
- Merged PR #1 into main after successful validation (`f3ba344` PR checks, GitHub Actions run `40360144603`). Merge commit: `9dc1f699392e3c2b758ee955be935abe3b56d909`; main validation run `40360353199` succeeded.
- Retired the obsolete root Pages entry files. Unpublished the old Pages deployment and then changed its source to GitHub Actions with no Pages publishing workflow. The initial None setting did not prevent a legacy Jekyll build on the merge; that build failed without publishing. The final source setting stops branch-based builds. The old homepage and sitemap return 404.
- Deployed the validated main application with the existing authorized Wrangler login. Migration release version: `4e59b00e-7d14-44b4-a3c1-4d10bc111bf1`. `/deployment.json` identifies the released source revision. Subsequent documentation-only main releases can update the marker without changing page content.
- Public verification passed all 42 requests, including 24 sitemap pages, canonical and Open Graph metadata, noindex controls, exact HTTPS/apex redirects with query preservation, retired Pages, real missing-page responses, anonymous admin denial, and the deployed revision.
- Routing regression suite and existing backend suite pass: 25 tests. Astro/Worker checks: 0 errors/warnings. Generated audit: 30 HTML pages, 927 local links, 30 JSON-LD documents, no failures.
- Workspace MX remains `smtp.google.com` priority 1. SPF, DKIM, DMARC and verification TXT values were compared before/after and are unchanged. Website/email code uses `hello@shemarmarks.com`. No mail migration or additional mailbox was created.
- Confirmed aggregate analytics exists in production D1, including page views, email/CTA clicks and contact submissions. This does not establish SEO traffic or unique people. No GA4/Clarity or new paid analytics was enabled.
- Updated the GitHub profile website, profile README portfolio/email links, and website/Northstar/Harborlight repository About links to the custom domain. GitHub account email verification settings are separate and were preserved.
- Found a still-public older Sites portfolio at `https://shemar-marks.marks-shemarhn.chatgpt.site`. Kept its audience/content, added noindex, and changed canonical/OG/sitemap/email metadata to production. Published Sites version 3, source `98c1431541e1083cc520275315206830af3b287e`, deployment `appgdep_6adf83d1fd4c8191978649d23d791848`. The original source remains recoverable at `1dd815ff35ea4cee94895094e6ed69d8d7b42b8d`.

## Automatic deployment activation still required

The main workflow now contains a tested-build deployment path with serialized releases, a current-main check, exact build artifact reuse, and a public verification report. Repository variables `PUBLIC_TURNSTILE_SITE_KEY` and `CLOUDFLARE_ACCOUNT_ID` are saved. The GitHub `production` environment exists and permits only the `main` branch, with no tags.

Activation is intentionally incomplete until the owner approves creating a narrowly scoped Cloudflare deployment credential and storing it as `CLOUDFLARE_API_TOKEN` in that environment. `ENABLE_PRODUCTION_DEPLOY` remains unset. No automatic main-to-production release has yet been demonstrated. The original task requested automatic deployment; this receipt does not represent that requirement as complete.

After credential approval: create the Worker-scoped deployment token, save it encrypted in the production environment, set `ENABLE_PRODUCTION_DEPLOY=true`, push/merge a reviewed main update, and verify a successful deployment job plus `/deployment.json` matching that main SHA. If the Worker-scoped token lacks permission to reconcile the existing routes/bindings, inspect the exact failure and request only the additional resource permissions required; do not replace it with a global API key.

## Recovery and remaining limits

See [DEPLOYMENT.md](DEPLOYMENT.md) for the architecture, configuration, release sequence and rollback steps. The pre-migration known-live Worker version is `6d19dd3c-6e6e-48ff-ba50-ef44866c321a`. No database schema changes were made. Preserve current D1 records during code rollback.

The local audit directory retains public HTTP/DNS evidence, dashboard screenshots and a pre-migration Git bundle. Credentials were not written into source, evidence or this receipt. The existing Cloudflare GitHub App's all-repository grant was inspected and left unchanged; it is not needed by the prepared Actions deployment path. No classic branch protection or repository rulesets were configured at audit time; the workflow validates main before deployment and the production environment limits credential use to main.

Search engines remove cached old results after recrawling; a 404/noindex/canonical change is not proof of immediate deindexing. Search Console/Bing performance reports and live email delivery were not re-tested by this migration. No production form submission or outgoing test email was sent. Existing Gmail/Access/Turnstile secrets, database bindings and social review mode were preserved.
