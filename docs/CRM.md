# CRM integration contract v1

The intended receiver is Orbit v0.2. **Owner clarification — 3 November 2026:** the CRM has not yet been deployed or activated. Pending website-to-CRM jobs are expected and intentionally await activation; no retry or configuration change is needed now. The audit measured two pending CRM jobs and two delivered acknowledgment email jobs. When Orbit is ready, validate the complete integration and reconcile the pending inquiries without duplication.

Set `CRM_API_URL` to the Orbit HTTPS ingestion endpoint, `https://crm.shemarmarks.com/api/v1/website-inquiries`, and `CRM_API_TOKEN` to a dedicated Orbit API token with only the `crm.write` scope. Both are retained as Worker secrets so future code deployments preserve the active connection. Keep `CRM_CREATE_OPPORTUNITY` unset or false initially. The endpoint sits behind Cloudflare Tunnel, authenticated at the application layer. Tunnel the Orbit API, not Proxmox management. Do not expose ports or make website receipt depend on the tunnel.

Wrangler enables `global_fetch_strictly_public` so requests to the sibling CRM hostname use Cloudflare's public front door, including its Tunnel routing and security rules. Without this flag, same-zone subrequests can bypass the edge route and try to contact an origin directly. Reference: [Cloudflare compatibility flags](https://developers.cloudflare.com/workers/configuration/compatibility-flags/#global-fetch-strictly-public).

## Request

```http
POST /api/v1/website-inquiries
Authorization: Bearer <orbit-integration-token>
Content-Type: application/json
Idempotency-Key: <inquiry-uuid>
```

```json
{
  "version": 1,
  "externalId": "5f82bca8-755e-46da-9d32-cf1f9b578fa7",
  "contact": {
    "name": "Example Person",
    "email": "person@example.com",
    "company": "Example",
    "website": "https://example.com"
  },
  "lead": {
    "service": "Website Development",
    "description": "A website with booking integration.",
    "timeline": "1–3 months",
    "budget": "",
    "attribution": {
      "page": "/contact/",
      "landing_page": "/services/websites/",
      "cta": "Website panel",
      "source": "Website",
      "campaign": "Want a Website Like This CTA",
      "referrer": "",
      "utm_source": "",
      "utm_medium": "",
      "utm_campaign": "",
      "utm_term": "",
      "utm_content": "",
      "submitted_at": "2026-10-19T13:00:00Z",
      "received_at": "2026-10-19T13:00:01Z"
    }
  },
  "activity": { "type": "website_inquiry", "source": "shemarmarks.com" },
  "opportunity": { "create": false, "name": "Website Development inquiry" }
}
```

## Orbit receiver behavior

Orbit validates version 1, authenticates the dedicated integration token, and enforces the `Idempotency-Key`. In one database transaction it finds or creates the company when supplied, finds or creates the contact by email, creates one inbound lead, records one website-inquiry activity, and optionally creates an opportunity when a usable pipeline exists. The inbound lead is marked so it cannot accidentally enter the cold-outreach path.

A repeated request with the same idempotency key and body returns the previously accepted result without duplicating records. Reusing the key for different input returns a conflict. The implementation lives in `Shemarhn/freelance-crm` on the Orbit v0.2 branch in `server/website.mjs` and is mounted at `/api/v1/website-inquiries`.

Return 200/201/204 only after durable acceptance. Replays should return a successful 2xx response. Return 400/422 for an invalid contract, 401/403 for credential failure, 429 for throttling, and 5xx for temporary failure. Timeout is 12 seconds. The website Worker treats 408, 409, 425, 429, and 5xx as retryable; most other 4xx failures require operator correction.

Do not trust attribution as identity, authorization, or verified campaign data: it is browser-reported context. The Worker adds its own received timestamp. Never return CRM credentials or internal error details to a visitor.

## Retry and reconciliation

D1 is the website’s durable source record. Orbit downtime leaves pending jobs. Use the authenticated delivery queue to inspect status, correct endpoint/token configuration, and retry failed jobs. The website keeps its durable copy independently so a home-server outage does not lose a lead.

Before launch, test: Orbit offline; duplicate request; timeout after Orbit commit; invalid token; permanent validation failure; concurrent cron runs; and recovery after an expired processing lease.
