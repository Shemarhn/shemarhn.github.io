# Verification — 19 October 2026

## Completed

| Check | Result |
|---|---|
| Astro/TypeScript build | Passed; 0 errors, 0 warnings, 0 hints |
| Worker TypeScript build | Passed separately with Cloudflare runtime types |
| Static pages | 28 HTML pages; 24 intended indexable routes |
| Local links and assets | 873 references checked; no broken local targets |
| Metadata | Unique titles/descriptions, canonical/social metadata, H1, alt attributes checked |
| JSON-LD | 28 documents parsed successfully |
| Unit/integration suite | 18 tests passed using a real in-memory SQLite database and mocked downstream providers |
| Local Cloudflare runtime | D1 migration applied; HTTP routes, true 404, redirects, staging headers, and API receipt behavior checked |
| Built-in browser | Visual checks, mobile navigation, website modal, service preselection, native form submission, and receipt page verified |
| Automated accessibility | axe WCAG A/AA and best-practice audit: 27 public routes at 1440px and 390px; no remaining violations after fixes |
| Extra responsive checks | Homepage at 320, 768, and 1024px; no overflow or axe violations. Harborlight’s longest heading also checked at 320px |
| Production dependency advisory scan | No known vulnerabilities reported by `pnpm audit --prod --audit-level high` |
| Production payload budget | 11,150 bytes gzipped homepage HTML, 58,748 bytes CSS, 133,095 bytes total JS across all page modules and dynamically loaded motion libraries; no WebGL engine |

The four noindex HTML documents are admin, reference submission, receipt, and 404. The admin document is protected in the Worker and was tested for fail-closed behavior; it is not included in the public-page axe run. Positive signed-identity tests exercise the authenticated moderation APIs with a test RSA key and a mocked identity-provider key response.

## Behavior tested

Tests cover durable inquiry/outbox insertion, idempotent replay, same-origin rejection, email validation, oversized bodies, rate limits, production spam-bypass refusal, Turnstile hostname/action verification, failed database transactions, public pending status, forged approval fields, identity/value withholding, SQL permission constraints, admin identity denial, signed owner creation/approval/withdrawal, wrong JWT audience, CRM/email independence, overlapping delivery claims, permanent rejection, and replyable acknowledgment text.

A real local Worker submission made through the built-in mobile browser reached the receipt page. All test records use synthetic `example.invalid` addresses or local in-memory databases. No live client inquiry, CRM contact, or real email was created.

## Performance evidence and limits

Observed local first contentful/largest contentful paint values in the instrumented built-in browser were roughly 72–212 ms on representative pages. The homepage’s observed CLS sample was about 0.002. These are unthrottled localhost measurements, include temporary QA instrumentation, and **do not establish production Core Web Vitals**. There is no reported Lighthouse score or field INP result. Measure the deployed site with PageSpeed Insights/Lighthouse, real mobile networks, and Search Console after launch.

The normal production build eliminates the QA-only axe import. `reports/static-audit.json` records the normal build’s payload sizes. `reports/browser-audit.json` contains the per-page audits and additional breakpoints. `reports/http-smoke.json` records local HTTP checks. Saved desktop/mobile screenshots show the final production build.

## Still requires live account configuration

- Production/staging D1 bindings and migrations on the selected Cloudflare account.
- A real Turnstile widget/token flow on authorized hostnames; local tests validate the server decision logic without solving a real challenge.
- Actual Cloudflare Access policy, MFA, and an interactive authenticated admin browser session.
- CRM receiver implementation, its persisted idempotency behavior, and an outage/recovery test against that receiver.
- Sending-domain verification or Workspace OAuth authorization, deliverability, and reply reception.
- Domain/DNS cutover, old-host redirect behavior, Search Console/Bing verification, social preview checks on external platforms, and deployed CWV.

The implementation is prepared for these integrations; account activation, live delivery, production hosting, and search indexing are not claimed complete. Development is published separately on `site-experience-v2`; the previous production site and default branch remain intact.

## Interactive redesign verification

The redesigned pages were audited again in the built-in browser: all 27 public routes at 1440px and 390px, plus homepage checks at 320px, 768px, and 1024px. All 57 final samples have no reported axe violations or horizontal overflow. The smallest screen initially exposed a keyboard access issue in the horizontally scrolling filters; adding a named focusable region resolved it.

Carousel checks covered category filtering, previous/next, arrow-key selection, full-index selection across categories, and pause/resume. The selected GitHub entry correctly reset a Cloud filter to All. Mobile and desktop visual checks covered the rebuilt identity and technology cards. No console errors were reported during the final QA run. `reports/browser-v2-audit.json` records the new route results. The 18 backend tests and local HTTP/form smoke suite were rerun successfully. The production build removes the temporary axe instrumentation, and the production dependency advisory scan reported no known vulnerabilities.
