# Work-mode account setup checklist

Use this only after the current branch head has passed CI. The browser/account operator should read `HANDOFF.md` and `LAUNCH.md` first.

## Order of operations

1. Inventory Namecheap DNS and Google Workspace mail/authentication records. Do not change nameservers yet.
2. Create/configure Cloudflare and import/recreate the complete DNS zone.
3. Create staging + production D1 and replace only the placeholder database IDs in `wrangler.jsonc`; never commit secrets.
4. Apply migrations 0001 + 0002 to staging.
5. Configure staging Worker, Turnstile and Cloudflare Access.
6. Configure Gmail API sending for `hello@shemarmarks.com` and test send/reply.
7. Configure the Orbit `crm.write` integration if Orbit is safely reachable. Do not expose Proxmox; D1 may queue CRM work until later.
8. Deploy and fully test staging.
9. Configure optional LinkedIn. If LinkedIn requires a publisher Page, keep the name/identity `Shemar Marks`; do not create an agency brand.
10. Do not configure paid X API access without explicit approval. If approved, use write-enabled OAuth 1.0a user credentials. Keep social mode `review`.
11. Configure production D1/secrets only after staging passes.
12. Recheck the Cloudflare DNS zone against the original Namecheap zone. Only then switch Namecheap nameservers.
13. Verify inbound/outbound Google Workspace mail immediately after DNS propagation.
14. Verify production, then submit sitemap to Google Search Console and Bing Webmaster Tools.

## Required staging tests

- real 404 and canonical redirects
- `X-Robots-Tag` / staging noindex behavior
- contact form durable D1 receipt
- replyable Gmail acknowledgment
- Orbit exact-once ingestion and deliberate Orbit-offline retry test when reachable
- public and owner-entered reference moderation, privacy withholding, project-value consent, and deletion
- `/admin/`, `/admin/social/`, `/admin/data/` only behind Access
- social draft sync does not publish while in review mode
- mobile/desktop, keyboard, reduced motion, axe/accessibility, horizontal overflow
- PageSpeed/Lighthouse on deployed staging
- sitemap, RSS, JSON-LD, Open Graph/X metadata

## Stop-and-ask conditions

Pause for the owner when a provider requires login/2FA/CAPTCHA, a payment/credit purchase, a public test post, a destructive DNS action whose safety cannot be established, or an irreversible change not already authorized by the handoff. Do not paste secrets into chat or repository files.
