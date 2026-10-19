# CRM integration contract v1

Set `CRM_API_URL` to one HTTPS ingestion endpoint and `CRM_API_TOKEN` to a least-privilege secret. The endpoint may sit behind Cloudflare Tunnel, authenticated at the application layer. Tunnel the CRM API, not Proxmox management. Do not expose ports or make website receipt depend on the tunnel.

## Request

```http
POST /api/website/inquiries
Authorization: Bearer <server-side-secret>
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

## Required receiver behavior

Validate `version`, authenticate the token, and enforce a unique `externalId`/idempotency key. Within one CRM transaction, upsert the contact, create one lead, record one activity, and optionally create one opportunity. A repeated request must return the already-accepted result without duplicating any effect. Retain the idempotency record for at least the full life of the inquiry.

Return 200/201/204 only after durable acceptance. Replays should return a successful 2xx response. Return 400/422 for an invalid contract, 401/403 for credential failure, 429 for throttling, and 5xx for temporary failure. Timeout is 12 seconds. The Worker treats 408, 409, 425, 429, and 5xx as retryable; most other 4xx failures require operator correction.

Do not trust attribution as identity, authorization, or verified campaign data: it is browser-reported context. The Worker adds its own received timestamp. Never return CRM credentials or internal error details to a visitor.

## Retry and reconciliation

D1 is the website’s durable source record. CRM downtime leaves pending jobs. Use the authenticated delivery queue to inspect status, correct endpoint/token configuration, and retry failed jobs. The CRM can reconcile received external IDs against D1 during an authorized export. The website does not ship a public inquiry-list endpoint.

Before launch, test: CRM offline; duplicate request; timeout after CRM commit; invalid token; permanent validation failure; concurrent cron runs; and recovery after an expired processing lease.
