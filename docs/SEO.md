# SEO research and content plan

See [the 27 October acquisition pass](ORGANIC-GROWTH-2026-10-27.md) for current Search Console evidence, service mapping, measurement and prioritized 30/60/90-day actions. The historical plan below remains useful background.

Research date: **19 October 2026**. This is a technical/content foundation, not a ranking forecast. No paid keyword-volume dataset was available; the intent map below is qualitative and must be refined using actual Search Console/Bing data.

## Current primary guidance used

- [Google: helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content). Use the actual person, evidence, audience needs, and limits to guide copy. The implementation exposes authorship and avoids invented clients or broad unsourced claims.
- [Google: Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals). Engineering targets remain LCP ≤2.5s, INP ≤200ms, and CLS ≤0.1 at the 75th percentile. Local timings do not establish field performance or ranking eligibility.
- [Google: structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies). Markup reflects visible page purpose. Person, WebSite, ProfessionalService, Service, BreadcrumbList, and BlogPosting are used where relevant. No invented location/address or agency organization is added.
- [Google: review snippet restrictions](https://developers.google.com/search/docs/appearance/structured-data/review-snippet). Self-controlled business references are displayed without Review/AggregateRating markup intended to obtain stars. FAQ content uses accessible HTML; no FAQ rich-result promise or opportunistic schema.
- [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a). Stable canonical paths, crawlable links, clean removal/redirect behavior, focused pages, and verifiable content are the priorities. Staging uses noindex, not just robots restrictions.
- [Bing: IndexNow](https://www.bing.com/webmasters/help/indexnow-0z209wby). IndexNow is a possible next-step notification mechanism after production verification and key ownership setup. It is not silently configured or claimed active.

## Technical implementation

Static HTML contains the main service, case-study, and article content before JavaScript. Each page has a unique title/description, canonical URL, Open Graph and X metadata, a 1200×630 social image, and JSON-LD. The author entity links to the supplied GitHub, LinkedIn, and X profiles. The About page describes Jamaica as the actual base and remote US/Canada collaboration without claiming a US office.

`/sitemap.xml` includes canonical indexable pages only. `/rss.xml` includes published, non-future articles. Private admin/submission/receipt/404 pages use noindex metadata; APIs have no indexable document content. The Worker blocks indexing on non-production hostnames and staging. Robots allows production content and names the sitemap. No image sitemap is needed at this initial scale: the few meaningful images are already included in crawlable content.

Trailing slashes are consistent, slash/index.html duplicates redirect, www redirects to apex, and missing pages return HTTP 404. The old GitHub Pages migration requires host-side configuration; see LAUNCH.md. Do not mistake a JavaScript fallback for a server-side permanent redirect.

Self-hosted fonts, WebP assets, restrained CSS/SVG motion, progressive enhancement, reduced motion, and a small production JavaScript payload support performance. Validate field CWV after launch and compare mobile/desktop groups. Avoid promising a Lighthouse score from a local preview.

## Qualitative commercial intent map

| Page                                       | Primary intent     | Natural topic coverage                                                                                              |
| ------------------------------------------ | ------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `/services/cloud-infrastructure/`          | Commercial         | Cloud infrastructure consultant, AWS/Azure infrastructure help, remote cloud consultant, cloud deployment/migration |
| `/services/linux-systems/`                 | Commercial/problem | Linux consultant, Linux server support, troubleshooting, Proxmox/virtualization context                             |
| `/services/devops-infrastructure-as-code/` | Commercial         | Terraform consultant, DevOps consulting, environment standardization, deployment workflows                          |
| `/services/backup-disaster-recovery/`      | Commercial/problem | AWS disaster recovery, cloud disaster recovery, restore testing, backup architecture                                |
| `/services/automation/`                    | Commercial         | Infrastructure automation, API integrations, workflow automation                                                    |
| `/services/infrastructure-documentation/`  | Commercial         | Infrastructure documentation, runbooks, technical documentation review                                              |
| `/services/maintenance/`                   | Commercial         | Linux maintenance, recurring infrastructure support, operations review                                              |
| `/services/agency-msp-partnership/`        | Partner/commercial | MSP subcontractor, overflow infrastructure engineer, white-label DevOps/cloud engineering                           |
| `/services/websites/`                      | Commercial         | Business website development, native forms, website automation/integrations                                         |
| `/work/northstar/`                         | Evidence/problem   | Proxmox to AWS lab, S3 backup, Terraform rebuild, validated recovery                                                |
| `/work/cedarfield/`                        | Evidence/problem   | Linux hardening, access-safe changes, operational validation                                                        |
| `/work/harborlight/`                       | Evidence/problem   | Operations automation, guarded recovery, restore drills                                                             |

Search sampling covered cloud/DR consulting, MSP white-label engineering, and website integrations. Result terminology informed intent grouping rather than claims about search volume or competitiveness. Examples reviewed include [an AWS Marketplace DR consultation listing](https://aws.amazon.com/marketplace/pp/prodview-qbz5esg7crlhu) and [Inspired Technology’s subcontracting positioning](https://www.inspiredtech.biz/). Their claims and wording were not copied into Shemar’s site.

## Twelve-week editorial sequence

| Sequence | Topic                                                               | Intent                | Service / evidence connection |
| -------- | ------------------------------------------------------------------- | --------------------- | ----------------------------- |
| 1        | A backup is not a recovery plan (included)                          | Informational/problem | Disaster recovery / Northstar |
| 2        | Linux hardening starts with a baseline (included)                   | Informational         | Linux systems / Cedarfield    |
| 3        | Every automation needs a failure path (included)                    | Informational/problem | Automation / Harborlight      |
| 4        | RTO vs RPO for a small business                                     | Comparison            | Disaster recovery / Northstar |
| 5        | What a useful infrastructure runbook contains                       | Informational         | Documentation / all labs      |
| 6        | How to test an S3-backed restore without touching production        | Problem/solution      | Disaster recovery / Northstar |
| 7        | Terraform state ownership before the first pipeline                 | Informational/problem | DevOps / Northstar            |
| 8        | Proxmox backups and off-host recovery: different failure boundaries | Comparison            | Linux/DR / Northstar          |
| 9        | When a VM is enough, and when containers help                       | Comparison            | Cloud/Linux                   |
| 10       | What to include in monthly Linux maintenance                        | Commercial support    | Maintenance / Harborlight     |
| 11       | Scoping a white-label infrastructure handover                       | Partner/problem       | Agency/MSP partnership        |
| 12       | Connecting website inquiries to a CRM safely                        | Business/problem      | Websites / automation         |

Each article should answer one real question, cite current primary sources, use original diagrams or verified examples, link to one relevant service and case study, and end with a restrained next step. Add updated dates only for substantive changes. Update related content when a procedure or provider behavior changes.

## Useful scale, not thin scale

Publish an expanded AWS disaster-recovery pillar or an Azure-specific supporting page only when there is enough original provider-specific depth. Do not create near-duplicate city pages or templated combinations of every tool and service. Potential useful future assets include an RTO/RPO planning worksheet, a restore-drill checklist, and a documentation-review rubric. They require distinct practical value and editorial review.

After 8–12 weeks, inspect actual impressions, intent mismatch, indexing, inquiries, and CTA attribution. Refine titles/content around observed questions. No automated ranking monitor or recurring publishing automation has been created by this project.
