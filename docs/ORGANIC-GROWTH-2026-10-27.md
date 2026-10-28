# Organic acquisition and credibility — 27 October 2026

Production: https://shemarmarks.com/. Source: `Shemarhn/shemarhn.github.io`, main → existing GitHub Actions → Wrangler → Cloudflare Worker. Production stack, database schema, mail, social review mode and Pages retirement are preserved.

## Observed baseline

Production was inspected in the Codex in-app browser before source changes. Clean source matched remote main `8a8e028797e8f0702148497d53405ebae35ccd4d`. No personal/local browser or connected browser session was used. Public research used built-in tools; original assets were subsequently downloaded into the repository.

Authenticated Search Console domain property `shemarmarks.com` was accessible. Selected three-month performance: **4 impressions, 0 clicks, 0% CTR, average position 39.8**, with the chart containing only 25 October data and no query rows. This tiny pre-release sample cannot establish stable rankings, demand, or improvement. Overview: indexing data processing, no field CWV data, 18 valid breadcrumbs / zero invalid, and 19 HTTPS / 1 non-HTTPS item. Follow up on the remaining HTTPS report item after recrawl; cached reporting may lag the canonical redirect migration.

There were no submitted sitemaps in this property. `https://shemarmarks.com/sitemap.xml` was submitted on 27 October; Google returned **Success, 24 discovered pages** for the pre-release sitemap. This release adds the 25th URL. Discovery/submission is not proof of indexing.

Homepage URL Inspection separately confirmed **URL is on Google / Page is indexed**, crawl allowed, indexing allowed, successful Googlebot smartphone fetch, declared production canonical and Google-selected “Inspected URL”. Last crawl shown: 21 October 2026. This is evidence of homepage indexing before this release, not proof that the changed page has been recrawled or that every service page is indexed.

Bing was accessible after routine Google sign-in but initially had no site. The production property was added; its public homepage verification tag is included in this release. Final release receipts must report the actual post-deployment Verify and sitemap outcomes, rather than assuming success from the tag.

The old Sites portfolio was identified with the Sites connector and inspected live at `https://shemar-marks.marks-shemarhn.chatgpt.site/`: title “Archived portfolio”, `noindex,follow`, production canonical. It remains viewable but is explicitly nonindexable. The existing production verifier checks retired GitHub Pages, canonical aliases, staging noindex, 404s, anonymous admin denial and release identity. The GitHub profile README already links to production; no backlink repair was needed there.

## Changes

- Exact “Previously worked with” heading immediately after the hero, before the perspective/services sections. Visible context distinguishes professional engagements, organizations supported through employment and vendor collaboration from independent direct clients or endorsements.
- Eleven original local marks: combined Guardsman/Beryllium plus all ten other requested brands, including ProxCenter. Ten official site/CDN/media sources; AWS reuses the legitimate Devicon AWS wordmark with its retained MIT notice. No AI-generated or redrawn logos, retail Amazon branding, or partner badges. See the source manifest and logo notes.
- CSS-only continuous 65-second rail with two equal groups, half-track translation, edge masks and no rail controls/hydration. Fixed plates, explicit image dimensions, lazy loading and async decoding. Accessible original group, hidden duplicate. Reduced-motion uses one wrapped static group; global pause does likewise. A tiny same-origin prepaint script applies the existing saved pause preference before layout, preventing an otherwise large returning-visit shift.
- Homepage copy names small businesses, startups and technical teams, cloud/Linux work, recovery and handover. Degree/AWS certification appear in hero credibility. About, Contact, footer and services explain remote availability across US, Canada, UK, Europe and Caribbean without fake offices.
- Search-focused natural titles/H1s for all ten services, platform context, related insight/evidence links, pricing/About links, deliverables, processes, FAQ and CTAs. AWS/Azure sections remain on one substantial cloud page. New Proxmox/virtualization page covers inventory, migration readiness/pilot, backup boundaries, scope limits and evidence. Linked from homepage, directory, technology explorer and related services; inquiry UI/aliases/server validation accept the new service.
- Existing static Insights, authorship, RSS and three articles retained. No mass-generated posts or city doorway pages.
- Person credentials, service/business remote areas, stable Service/FAQ IDs, visible-content FAQPage nodes, hierarchical breadcrumb graphs and visible service/article/work breadcrumbs. Person/WebSite/BlogPosting preserved. The remote practice uses Organization rather than the LocalBusiness subtype ProfessionalService, with its own logo and real profile links; Service is provided by the actual Person. This avoids inventing an office/address to satisfy local-business rich-result requirements. Twitter image alt added. No invented reviews, AggregateRating or certification levels. Schema validity does not imply Google rich-result eligibility; FAQ markup is not a promise of FAQ rich results. See [Google Organization guidance](https://developers.google.com/search/docs/appearance/structured-data/organization) and [LocalBusiness requirements](https://developers.google.com/search/docs/appearance/structured-data/local-business).
- Dynamic sitemap includes Proxmox. Existing canonical/robots/slash/noindex protections retained. Generated audit now checks sitemap uniqueness/indexability/canonical agreement, logo assets/sizes and new service coverage. Decorative empty HTML alt attributes are recognized correctly.
- First-party conversion events aligned with the server allowlist, successful reference events accepted, service-hero form attribution fixed, and privacy notice updated. Local preview upstream corrected so loopback-only synthetic form checks work without relaxing production protections.

## Intent by page

| Page | Primary intent / supporting context |
| --- | --- |
| `/` | Independent cloud infrastructure, Linux and automation consultant; small-team outcomes and credibility |
| `/services/cloud-infrastructure/` | AWS/Azure consultant; cloud migration, VM hosting, networking, access and recovery; NORTHSTAR |
| `/services/linux-systems/` | Linux consultant/systems administration; Ubuntu/Debian, SSH, systemd, Docker, Nginx, troubleshooting; CEDARFIELD |
| `/services/devops-infrastructure-as-code/` | DevOps/Terraform consultant; state ownership, repeatable environments, GitHub Actions; NORTHSTAR |
| `/services/proxmox-virtualization/` | Proxmox/virtualization help; migration assessment, VM/guest operations, backup isolation and runbooks |
| `/services/backup-disaster-recovery/` | Backup/DR consultant; restore validation, RTO/RPO requirements, off-host copies; NORTHSTAR |
| `/services/automation/` | Workflow/infrastructure automation; APIs, Bash/Python, retries/failures; HARBORLIGHT |
| `/services/infrastructure-documentation/` | Infrastructure documentation/runbooks, technical review, architecture and handover |
| `/services/maintenance/` | Linux/cloud maintenance and defined managed responsibilities; no implied 24/7 SLA |
| `/services/agency-msp-partnership/` | White-label, overflow and subcontracted infrastructure engineering |
| `/services/websites/` | Business website development, forms and integrations |
| `/work/*/` | Executed lab evidence; observations remain clearly bounded and separate from paid client work |
| `/insights/*/` | Problem-aware backup, Linux and automation questions leading to evidence and services |

## SERP research and content direction

In-app Google “Proxmox consultant migration backup” showed consulting pages, official support/backup pages, guides, videos and forums. Examples: [croit](https://croit.io/solutions/proxmox), [Marvin Pascale](https://www.marvinpascale.it/en/proxmox-consulting/), [Proxmox Backup Server](https://proxmox.com/en/products/proxmox-backup-server/overview), and [partner directory](https://proxmox.com/en/partners/find-partner/all/filter). Built-in search samples also included [ProxCenter consulting](https://proxcenter.io/consulting) and [Web Tech](https://web-tech.us/solutions/proxmox-consulting/).

“AWS Linux infrastructure consultant remote” was job/staffing-heavy, alongside consulting pages such as [Itransition](https://www.itransition.com/cloud/aws). Focus content on specific buyer problems and deliverables. These are qualitative, personalized/location-dependent samples, not neutral rank tracking or keyword-volume estimates. No competitor copy or claims are adopted.

## Measurement

Existing D1 `event_counts(day,event,page,count)` remains unchanged. Base events: page_view, contact_submission, website_cta_click, email_click, case_study_view/click, service_conversion, blog_conversion, contact_cta_click, service_cta_click, pricing_cta_click, pricing_link_click, case_study_cta_click, blog_cta_click, booking_click and testimonial_submission. Pricing-link entry and pricing-page contact CTA are distinct. Booking events apply to actual Calendly/cal.com links if present; no scheduling provider or newsletter is invented.

Google/Bing organic subsets use `google_organic_` and `bing_organic_` prefixes, retained in the current tab. Paid medium and gclid/msclkid landing signals exclude organic attribution; click IDs are not sent to events. Events send only name and current page path. Existing form metadata keeps first landing/referrer plus coarse traffic_channel. A direct first visit no longer adopts a later internal referrer. DNT, GPC and device opt-out are honored.

Base totals include organic subsets: **do not sum base and prefixed events**. Counts are actions, not unique people or a person-level journey. Referrer suppression, privacy controls, bots, cross-tab behavior and self-reported UTMs limit attribution. Email clicks are intent; saved inquiries are not won clients. Review webmaster impressions/clicks by landing page alongside D1 actions and qualified inquiry/CRM outcomes. No GA4/Clarity IDs were supplied, so neither is added blindly; optional Cloudflare analytics stays conditional on its existing configuration.

Read-only summaries in Cloudflare → D1 → shemar-marks → Console:

```sql
SELECT day,event,page,SUM(count) AS actions FROM event_counts
WHERE day >= date('now','-30 day') GROUP BY day,event,page
ORDER BY day DESC,actions DESC;
```

```sql
SELECT json_extract(payload,'$.metadata.landing_page') AS landing_page,
json_extract(payload,'$.metadata.traffic_channel') AS search_channel,
json_extract(payload,'$.service') AS service,COUNT(*) AS inquiries
FROM inquiries WHERE created_at >= datetime('now','-30 day')
GROUP BY landing_page,search_channel,service;
```

## Prioritized 30/60/90 days

**Days 1–30:** confirm sitemap processing and Google-selected canonicals for homepage/cloud/Linux/Proxmox; revisit the HTTPS issue after recrawl. Record weekly indexed URLs, nonbrand impressions, clicks, landing pages, meaningful actions and qualified inquiries. Publish one original Proxmox migration-readiness checklist and one evidence-backed restore-drill guide, with prerequisites, sanitized examples, current official sources, a relevant service and a restrained CTA. Link real public certification evidence when available; obtain permission before named paid-work case studies/testimonials. Avoid title churn on four impressions.

**Days 31–60:** publish an RTO/RPO worksheet, an infrastructure runbook/review checklist, Terraform state ownership guidance and a Linux maintenance-scope guide. Prioritize substantial original examples over volume; Azure-specific expansion waits for distinct reproducible evidence. Connect each resource to a service/case study. Refine pages around real Search Console questions. Add useful resource links to appropriate GitHub project READMEs. Explore eligible professional directories, technical community contributions and a relevant guest article; no unearned membership/partner claims.

**Days 61–90:** prioritize topics and services with relevant impressions and qualified inquiries. With permission, publish one real professional case study describing role, deliverables, checks and limits; request an authorized reference through the moderated flow. Offer a useful original guide as an earned community/vendor contribution. Proxmox/ProxCenter directories require genuine eligibility; no paid links, spam directories or automated outreach. Recheck mobile, links, canonicals, coverage and field CWV when data exists. Add provider/problem pages only when original depth and demand justify them.

## Verification scope

Tests cover inquiries/idempotency/delivery, service validation, references/consent, admin access, mail, social locking, redirects, allowed events, paid/organic discrimination and privacy headers. HTTP smoke uses synthetic local records only. In-app QA covers mobile/tablet/desktop, original assets, overflow, axe and pause/static geometry. Reduced-motion media rules are present; the user’s OS preference is not changed. Local performance is not field CWV or a statistically comparable benchmark. The normal production build removes axe/QA instrumentation. Final release receipts must report deployment, live verification, indexing requests and Bing outcomes from actual returned results. Implementation, discovery, indexing, impressions, rankings, traffic and qualified clients are separate outcomes.
