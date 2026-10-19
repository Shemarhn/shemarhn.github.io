# CRM integration contract v1

The production receiver is Orbit v0.2. Set `CRM_API_URL` to the Orbit HTTPS ingestion endpoint, normally `https://<orbit-host>/api/v1/website-inquiries`, and `CRM_API_TOKEN` to a dedicated Orbit API token with only the `crm.write` scope. The endpoint may sit behind Cloudflare Tunnel, authenticated at the application layer. Tunnel the Orbit API, not Proxmox management. Do not expose ports or make website receipt depend on the tunnel.

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
