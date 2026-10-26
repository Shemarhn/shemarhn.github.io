# Architecture and operations

## Boundaries

```text
GitHub → Astro build → static HTML/CSS/assets → Cloudflare Worker + asset binding
Browser → same-origin API → validation + Turnstile + D1 transaction → receipt
                                                     ↓
                                             independent outbox jobs
                                               ↙             ↘
                                    CRM adapter             email adapter
                                 home CRM via HTTPS          replyable email
```

Astro renders all commercial and editorial content at build time. The normal build ships no component framework or WebGL engine. Motion powers client interactions and carousel transforms; Anime.js assembles the editable SVG identity. Native canvas paths and SVG grids adapt Kokonut UI and Bklit UI patterns. The logo is rebuilt as seven independently addressable vector facets with separate orbits and nodes. Reduced motion disables decorative animation, and a persistent pause control is available. See [the identity and interaction system](DESIGN-SYSTEM.md) for sources, licenses, and progressive enhancement behavior.

The custom Worker keeps server behavior independent of an Astro adapter. Its asset mapping enforces clean trailing-slash URLs, serves the real 404 document with HTTP 404, sets security headers, and applies staging indexing protection. Published references are injected into static HTML by HTMLRewriter using escaped, explicitly projected public fields; an API fallback supports previews. No private testimonial payload is serialized into a public page.

## Durable acceptance and retries

`inquiries` stores the complete validated payload. A D1 transaction inserts it and two unique jobs into `outbox`. A receipt is returned only after that transaction succeeds. Browser-generated UUIDs provide replay protection for accidental resubmissions. Receipt keys do not expose content or authorize administration.

The request’s background task and a five-minute scheduled handler attempt delivery. A single atomic `UPDATE … RETURNING` claims up to four jobs with an unpredictable lease token and a three-minute lease. Overlapping runners cannot claim an active lease. Completion updates are conditional on that token. Expired leases are reclaimed after a crash.

CRM and email status are independent. Transient errors use exponential delay with jitter, capped at one day. Ten recorded failures or a permanent provider rejection set a visible `failed` state. Missing configuration defers for one hour without consuming attempts. No failure path deletes the inquiry. At the initial scale, four jobs per five minutes is sufficient; monitor backlog before increasing batch size within Worker limits.

This is **at-least-once delivery**, not exactly-once delivery. CRM idempotency is mandatory. Resend has a bounded idempotency window; Gmail has no equivalent transactional send guarantee. A crash after provider acceptance can create a duplicate acknowledgment. Investigate uncertain delivery before manually requeuing old email jobs. See EMAIL.md.

## Admin and references

`/admin/` and `/api/admin/*` require a valid Cloudflare Access JWT plus a server-side email allowlist. No credential or shared admin password is exposed to JavaScript. The UI can create owner-entered references, edit a quote, associate a case study, mark verified status, moderate status, and separately approve value display. Moderation events are recorded with the authenticated actor.

Public status is forced to `pending`. Public clients cannot set verification, source, owner authorization, or visibility flags. Only `approved` rows are projected publicly. Identity permission is independent of approval. Project value needs `(client consent OR authorized owner-entered reference) AND separate display approval`. A SQL CHECK enforces the commercial permission boundary as well as application validation. Email and internal moderation notes never enter the public projection.

Logo URLs are accepted as optional metadata but are not fetched or rendered automatically. This avoids server-side URL fetching and remote visitor tracking. File uploads are deliberately unsupported; add type/size checks, malware handling, private object storage, and separate review before introducing uploads.

## Security

- Same-origin JSON mutation requests; no permissive CORS.
- Stream-enforced request-size limit; bounded strings, validated email, URL schemes, dates, enums, and required privacy acknowledgment.
- Server-verified Turnstile token, action, and hostname; honeypot and atomic D1 rate counters.
- Salted daily network hashes, expiring counters, and no raw IP stored in application tables.
- Prepared SQL statements, HTML escaping, and client textContent rendering.
- Restricted script CSP; inline styles are allowed for authored layout attributes. No unsafe-eval or unsafe-inline scripts. CSP permits Turnstile and optional Cloudflare analytics only.
- HTTPS CRM endpoint, bearer secret, short external request timeouts, and no credential-bearing redirect following.
- Admin fail-closed behavior and same-origin checks on cookie-authenticated changes.
- No browser access to CRM/Google/Cloudflare secrets; no public Proxmox management endpoint.

## Operations

The admin delivery API `GET /api/admin/deliveries` exposes status and sanitized errors, not inquiry bodies. `POST /api/admin/deliveries/{job-id}/retry` can requeue a failed job after investigation; it uses the same authenticated session and origin requirements. The admin page includes a delivery queue with retry controls.

Review failed jobs and backlog after launches and during routine care. Configure Cloudflare alerting for Worker failures, D1 limits, and scheduled-handler failures. Monitor `last_error`, oldest pending age, and the provider’s own delivery logs. The code does not claim a complete alerting service has already been activated without account access.

Use D1 export/restore facilities and exercise restoration before relying on the database operationally. Review unconverted inquiries/pending references for deletion within 12 months, and aggregate events on an appropriate retention schedule. Deletion is a deliberate operator task; no automatic removal of business records is enabled.

## Measurement

First-party events count allowlisted event names by UTC day and clean page path. There is no cookie or persistent visitor ID, and no IP/referrer/query string in `event_counts`. DNT/GPC and a device-level opt-out disable these events. Submitted inquiry attribution is separate and documented in the privacy notice. `sm:analytics` browser events are an integration hook. Optional Cloudflare Web Analytics supplies aggregate page measurement when its public beacon token is configured.
