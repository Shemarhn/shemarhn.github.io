# Deployment handoff

This document is the browser/account-setup handoff for the `site-experience-v2` branch. Code should be treated as complete only after the exact branch head passes CI and the deployed staging environment passes the checks in `LAUNCH.md`.

## Account-side work still required

The remaining tasks require authenticated external services rather than source implementation:

- Cloudflare account/zone, production + staging D1, Worker deployment, Turnstile, Access, DNS and custom domains
- Google Workspace/Gmail OAuth for replyable website acknowledgments
- safe Namecheap → Cloudflare nameserver cutover while preserving every Workspace DNS record
- Orbit v0.2 deployment/reachability and a dedicated `crm.write` website integration token
- optional LinkedIn developer app/member authorization
- optional X developer app/credits and OAuth 1.0a user credentials only if the owner approves any cost
- Google Search Console and Bing Webmaster Tools
- deployed browser, accessibility, performance, form, mail, reference, CRM and social-review validation

## Non-negotiable boundaries

- Do not purchase anything or enable a paid balance without explicit owner approval.
- Do not expose Proxmox management or raw home-server ports to make CRM delivery work.
- Do not change Namecheap nameservers until current DNS has been inventoried and the complete Google Workspace mail/authentication records exist in Cloudflare.
- Do not enable `SOCIAL_MODE=automatic` at launch. Keep `review` until the owner explicitly changes it.
- Do not make a public LinkedIn/X test post without explicit approval at the moment of posting.
- Do not invent public pricing. The current scope-based pricing remains intentional until owner-approved figures are supplied.
- Do not merge the website PR before staging is verified.

## Important implementation contracts

Website inquiry acceptance is D1-first. Gmail acknowledgment and Orbit delivery are independent jobs. Orbit's receiver is `POST /api/v1/website-inquiries`, authenticated by a dedicated API token with only `crm.write`, and the inquiry UUID is the idempotency key. Orbit downtime must not make the public form fail.

The social system is website-first. A published Insight becomes LinkedIn and X drafts in D1. `/admin/social/` is the review console. Provider errors after a publish attempt fail closed because a lost response can represent an uncertain successful post; inspect the provider before retrying.

`/admin/`, `/admin/social/`, `/admin/data/`, and `/api/admin/*` require Cloudflare Access plus the Worker's own signed-JWT/allowlist validation. `/admin/data/` provides removal of website-held inquiry/reference copies. Scheduled retention removes website inquiry copies and unresolved reference submissions after 12 months.

Read `LAUNCH.md`, `EMAIL.md`, `CRM.md`, `SOCIAL.md`, `PUBLISHING.md`, and `SEO.md` before making account-side changes.
