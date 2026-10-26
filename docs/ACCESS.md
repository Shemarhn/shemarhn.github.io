# Cloudflare Access design

Protect the private website administration with **one** Cloudflare Access self-hosted application so the Worker can validate one application audience (`ACCESS_AUD`). Configure that application with public destinations covering both:

- `shemarmarks.com/admin*`
- `shemarmarks.com/api/admin*`

Add the equivalent staging destinations when Cloudflare supports them in the same application, or create a separate staging Access application and use the staging environment's own `ACCESS_AUD` variable. Do not accidentally reuse a production audience for a different application.

The policy should allow only `shemar@shemarmarks.com`. Use the Workspace/Google identity provider if practical; Cloudflare One-Time PIN to that mailbox is an acceptable low-complexity fallback. Require strong authentication on the mailbox itself. Access is the edge gate, while the Worker independently verifies the signed `CF_Authorization`/Access JWT, issuer, audience, and email allowlist.

Do not protect the whole public website. Only the private admin pages and admin API need Access. Public contact/reference forms use their own same-origin, Turnstile, validation, and rate-limit controls.
