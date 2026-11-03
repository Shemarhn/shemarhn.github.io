# Organic growth and buyer acquisition — 2 November 2026

## 1. Executive summary

**Measured:** Google currently reports 42 impressions and one click. D1 records 55 page views in the last seven complete UTC days, including two Google-attributed page views, and no saved inquiries in that week. There is not yet evidence of a repeatable organic acquisition engine or of qualified organic leads.

**Observed:** The production foundation is sound: all 55 public verification requests passed across the 25 current sitemap URLs. The important gaps are buyer guidance, relevance of proof, internal connections and source attribution. The strongest immediate external repair is updating the retired portfolio links still displayed on LinkedIn and X.

**Implemented:** Improved all ten service pages through explicit related-service links, service-specific intake guidance and an additional useful FAQ; corrected website-development proof; strengthened work, About, homepage and pricing paths; added one Proxmox readiness article; fixed first-touch attribution consistency and privacy handling; supplied read-only weekly reporting and a practical operating routine. Existing individual positioning and visual design are retained. No ranking or lead improvement is claimed from these changes.

Companion records:

- [Current market, competitors, opportunity scoring and keyword map](SEARCH-MARKET-2026-11-02.md)
- [Every service and conversion-path audit](SERVICE-AUDIT-2026-11-02.md)
- [Technical and measurement audit](TECHNICAL-AUDIT-2026-11-02.md)
- [Weekly operating system and KPI template](WEEKLY-ORGANIC-WORKFLOW.md)
- [Previous report](ORGANIC-GROWTH-2026-10-27.md)

## 2. Collection scope and current traffic baseline

**Observed:** Used the Codex built-in browser exclusively for browser work. Fresh authenticated Google Search Console, Bing Webmaster Tools and Cloudflare D1 were inspected before implementation was finalized. Public production was checked using the repository's read-only verifier. Source HEAD and live deployment both matched `b8882dbbb1e379dd377412946dab8c3ee0e9c4f4`. Recent scheduled GitHub validation runs were successful; scheduled validation is not a deployment.

Report date is **2 November, America/Jamaica**. Collection crossed into **3 November UTC**. D1 windows are explicit complete UTC days: seven days `[2026-10-27, 2026-11-03)` and 28 days `[2026-10-06, 2026-11-03)`. These differ from Google and Bing reporting windows. Do not align them by simply relabeling a date.

**Measured — Google Web search:**

| Selected report | Clicks | Impressions |  CTR | Average position |
| --------------- | -----: | ----------: | ---: | ---------------: |
| Last 7 days     |      1 |          42 | 2.4% |             13.2 |
| Last 28 days    |      1 |          42 | 2.4% |             13.2 |
| Last 3 months   |      1 |          42 | 2.4% |             13.2 |

Only **25–31 October** populated the displayed data; the three selections contain the same small sample. The report showed its last update four hours before inspection. This is not three months of established performance.

## 3. Comparison to the previous baseline

**Measured:** The 27 October report recorded four impressions, zero clicks, 0% CTR and position 39.8, with only 25 October populated. The new report has 38 additional impressions and one additional click. Its lower aggregate position number reflects a different mix of pages and queries; it does not prove that a commercial query improved.

The preserved earlier D1 receipt recorded 128 all-time page views, three email clicks, two website CTA clicks, two contact submissions, one case-study view and one case-study click. Fresh all-time totals were 186, three, four, two, one and one respectively, plus newly available contact/search subsets. The old receipt has no comparable period or qualification breakdown. These cumulative differences are **not** a controlled before/after SEO experiment. Owner visits, QA and bots cannot be reliably excluded from these aggregates.

## 4. Google Search Console findings

**Measured — all disclosed query rows, three-month selection:**

| Query                   | Clicks | Impressions | CTR | Position | Interpretation                                                          |
| ----------------------- | -----: | ----------: | --: | -------: | ----------------------------------------------------------------------- |
| shemar bridges          |      0 |           7 |  0% |      8.3 | Inferred unrelated name intent; not confirmed Shemar Marks brand demand |
| linux security baseline |      0 |           2 |  0% |     52.0 | Informational, weak immediate hiring intent                             |
| sirmark                 |      0 |           1 |  0% |     49.0 | Ambiguous; do not count as confirmed brand demand                       |

No disclosed row explicitly names Shemar Marks or a hire-now service. None of the disclosed queries received a click. Query rows expose ten impressions versus 42 property impressions; undisclosed queries prevent classification of the remaining impressions and the single click. Do not infer their intent.

**Measured — disclosed-query position buckets:** positions 1–3: zero queries; 4–10: one; 11–20: zero; 21–50: one; over 50: one. These are buckets of query-average positions, not counts of individual ranking observations. There is **no evidenced high-intent query in positions 4–50** to call a fast ranking win. Page-average positions below must not be substituted for commercial query rankings.

**Measured — daily property totals:** 25 October: 4 impressions / 0 clicks / position 39.8; 26: 3 / 0 / 3.7; 27: 10 / 0 / 7.4; 28: 10 / 1 / 5.6; 29: 4 / 0 / 9.0; 30: 6 / 0 / 32.8; 31: 5 / 0 / 4.2. A changing query mix can produce large movements at this scale.

**Measured — devices:** mobile: four impressions, one click, 25% CTR, position 4.3; desktop: 38 impressions, zero clicks, 0% CTR, position 14.1. One mobile click does not establish a higher converting mobile audience.

**Measured — leading countries:** US 16 impressions / 0 clicks / position 8.8; Russia 5 / 0 / 20.0; Morocco 4 / 0 / 9.0; UK 3 / 1 / 2.7; Argentina 2 / 0 / 5.0; Vietnam 2 / 0 / 8.0; Brazil 2 / 0 / 71.0. Canada, Ukraine and Pakistan each had one impression and no clicks. Fifteen countries were reported; only the leading ten were transcribed. Country does not establish buyer identity or justify local landing pages.

**Unavailable:** A reliable page-level improving/declining comparison to the previous report, query-to-page cannibalization history, and commercial-query trends. Collect comparable weekly exports before drawing those conclusions.

## 5. Bing findings

**Measured:** The three-month Search Performance report displayed **zero clicks, zero impressions, 0% CTR and no keyword rows**, with a displayed range of 2 August–1 November. There is no meaningful average ranking position to report with zero impressions.

**Observed:** Production property is accessible. Sitemap `https://shemarmarks.com/sitemap.xml` was submitted and crawled on 28 October: **Success, 25 discovered URLs, zero errors, zero warnings**. This completes the prior report's unverified Bing outcome. Discovery is not proof that all pages are indexed or receiving traffic.

## 6. Current traffic sources

**Measured — D1 `event_counts`:**

| Event                            | Last 7 complete UTC days | Last 28 complete UTC days |
| -------------------------------- | -----------------------: | ------------------------: |
| page_view                        |                       55 |                       184 |
| google_organic_page_view         |                        2 |                         2 |
| website_cta_click                |                        2 |                         4 |
| contact_cta_click                |                        2 |                         2 |
| google_organic_website_cta_click |                        1 |                         1 |
| google_organic_contact_cta_click |                        1 |                         1 |
| email_click                      |               0 recorded |                         3 |
| contact_submission               |               0 recorded |                         2 |
| case_study_view                  |               0 recorded |                         1 |
| case_study_click                 |               0 recorded |                         1 |

No Bing-prefixed event, organic submission, service conversion, pricing CTA, booking event or testimonial-submission event was present in these query results. This means **no recorded event**, not proof that the action never happened. Organic subset rows are already included in base totals. Never add them together.

**Unavailable:** Existing aggregate events cannot separate direct, referral and paid page views. `page_view - Google - Bing` is not direct traffic. Form attribution now distinguishes those coarse channels for new inquiries when measurement is enabled. It does not backfill old records or create unique visitor tracking. Google page views are tab-attributed actions, not necessarily distinct organic landings, and are not directly comparable to Search Console clicks.

Cloudflare's account-home tiles showed 953 requests and roughly 1.7k Worker invocations over its last 24 hours. These account-level operational totals include nonvisitor activity and possibly staging; they are **not** site visitors, search traffic or leads. No separately verified Cloudflare Web Analytics audience report is claimed.

## 7. Current conversions and inquiry quality

**Measured:** Production D1 has **two saved inquiries**, both Website Development, first landing `/`, source unknown, saved on 20 October UTC. No new saved inquiry exists in the seven-day window. No saved inquiry is explicitly attributed to Google or Bing. Two browser contact-submission events are a separate measurement and must not be added to the two saved rows.

**Unavailable:** Whether these two records are genuine prospects, test records, qualified opportunities or clients was not established. Only aggregates were retrieved; names, emails, project messages and full referrers were not exported. Do not describe them as organic leads. Qualification, proposals and won work require the owner's private review/CRM status. Email and CTA clicks indicate intent rather than delivered messages or clients.

**Measured operations:** The two acknowledgment email jobs are delivered; the two CRM jobs remain pending. Investigate CRM configuration/reachability through the existing delivery console before relying on CRM completeness. No jobs were retried and no email was sent by this audit. The production reference table has no rows, so there are currently no stored references to treat as conversion proof.

## 8. Top pages and landing-page evidence

**Measured — D1 page activity, last 28 complete UTC days:** `/` 111 views; `/contact/` 22; `/work/` 17; `/services/` 8; `/about/` 8; `/privacy/` 4; `/insights/` 4; `/thank-you/` 2; `/services/proxmox-virtualization/` 2; `/admin/` 2; `/work/northstar/`, `/references/`, `/pricing/`, and the backup Insight each 1. Google subsets: homepage 1, contact 1; all other displayed paths 0. These are current-page actions, **not an entrance-page report**. Admin activity also illustrates why owner/test contamination matters.

**Measured — all 19 Google page rows:**

| URL path (HTTPS unless shown)                      | Impressions | Clicks | Average position |
| -------------------------------------------------- | ----------: | -----: | ---------------: |
| `/`                                                |           9 |      1 |              3.9 |
| `/about/`                                          |          16 |      0 |              8.1 |
| `/privacy/`                                        |          12 |      0 |              3.7 |
| `/work/`                                           |           9 |      0 |              7.4 |
| `/contact/?cta=Footer`                             |           8 |      0 |              6.3 |
| `/insights/linux-hardening-start-with-a-baseline/` |           6 |      0 |             43.7 |
| `/services/`                                       |           4 |      0 |             20.5 |
| `/services/automation/`                            |           2 |      0 |              9.5 |
| `http://shemarmarks.com/pricing/`                  |           1 |      0 |              4.0 |
| `/pricing/`                                        |           1 |      0 |              4.0 |
| `/work/cedarfield/`                                |           1 |      0 |              4.0 |
| `/insights/`                                       |           1 |      0 |              6.0 |
| `/services/maintenance/`                           |           1 |      0 |              6.0 |
| `/services/linux-systems/`                         |           1 |      0 |              7.0 |
| `/references/`                                     |           1 |      0 |              8.0 |
| `/services/agency-msp-partnership/`                |           1 |      0 |              8.0 |
| `/services/websites/`                              |           1 |      0 |              9.0 |
| `/services/infrastructure-documentation/`          |           1 |      0 |             10.0 |
| `/insights/automations-need-a-failure-path/`       |           1 |      0 |             11.0 |

Page rows and property totals use different aggregation and must not be summed as identical denominators. Homepage is the only displayed page receiving a click; the others have impressions without clicks. Several service pages have only one impression, which is insufficient evidence for a title rewrite or an inferred commercial ranking. Cloud, IaC, recovery and Proxmox did not appear in this page table; this is not proof they are unindexed.

## 9–14. Search opportunities, clusters, map, SERPs and competitors

**Observed / inferred / recommended:** The [market report](SEARCH-MARKET-2026-11-02.md) supplies the ten-service map, A/B/C/D intent classification, buyer profiles, competing formats, cited sources, explicit scoring and quick/medium/long priorities. Current Google Proxmox migration results and Bing Linux consulting results contain service providers; broader samples also include marketplaces, recruitment and vendor documentation. This establishes current commercial terminology and result formats, not keyword volume, link strength or ranking difficulty.

**Recommended priority:** relevant proof and first-discussion guidance; Proxmox readiness; tested recovery; Linux maintenance boundaries; documentation examples. Broad AWS/DevOps authority is longer term. Keep each service intent on one existing substantial page. No new AWS, Azure, city or keyword-synonym service pages were justified. Rankings in the keyword map remain unknown unless the actual property query report identifies the query.

## 15. Technical SEO findings

**Measured:** Live production verifier passed **25 canonical indexable pages and 55 requests**, including robots/sitemap, HTTP/www/Worker-host normalization, slash/index redirects preserving query attribution, genuine 404s, private source-file denial, staging noindex and anonymous admin denial. Release identity matched current main. Final local generated audit passed 32 HTML documents, 32 JSON-LD documents, 26 sitemap URLs and 1,156 local link/asset references. Public content is built into static HTML and does not need JavaScript to be read by crawlers.

**Observed:** Existing self-hosted fonts, image dimensions, local optimized assets, reduced motion, pause controls and responsive layout remain. No measured reason justified a visual redesign or dependency upgrade. The production build is required after temporary accessibility instrumentation; QA assets must not be released.

## 16. Indexing findings

**Observed:** Google sitemap: **Success, 25 discovered pages, submitted 27 October, last read 31 October**. Page Indexing still says processing; no whole-site indexed count is available. Overview reports 19 valid breadcrumbs / zero invalid, no field Core Web Vitals data, and 20 HTTPS / one non-HTTPS item. The remaining issue is **HTTPS not evaluated**, example `https://www.shemarmarks.com/`, validation already started 27 October, last crawl N/A. Live redirects pass; the lingering report is not evidence of a current insecure apex page. Do not restart validation repeatedly or weaken redirects to satisfy a lagging report.

**Recommended:** After merge/deployment, confirm the 26-URL sitemap and article/service canonicals with the normal verifier; inspect the changed Proxmox service and new article in Google/Bing, and request indexing once where available. No indexing request for unpublished branch content was submitted. The existing successful sitemap does not need repeated submission before release. Recheck the HTTPS example after recrawl.

## 17. Content findings

**Observed:** The three existing articles already connect relevant technical questions, services and lab evidence. They do not warrant wholesale rewrites from one weak informational query. One new decision-support article is justified by the commercial Proxmox market sample and an existing service that needs planning support. It cites official Proxmox sources and separates planning from executed migration evidence. No tools, calculators, mass content or arbitrary posting quota were introduced.

## 18. Service-page findings

**Observed:** All ten pages already had meaningful titles/H1s, audience, problems, deliverables, approach, scope, evidence and CTA. The shared related-services selection was generic; intake guidance was not service-specific. The [individual audit](SERVICE-AUDIT-2026-11-02.md) records each page's changes. Titles are retained because current query evidence does not justify churn. New FAQ answers are useful, scoped and reflected exactly in visible content/schema.

## 19. Case-study findings

**Observed:** NORTHSTAR, CEDARFIELD and HARBORLIGHT are executed synthetic labs, not paid client outcomes. Their environment, checks, results and limits remain labeled. Added explicit role wording and three relevant service routes per study. Website development previously inherited unrelated NORTHSTAR proof; it now uses this actual site's public source/architecture, honestly labeled as Shemar's own site. Paid documentation-review experience remains separate and private; permission is needed before any client material becomes a case study.

## 20. Conversion findings

**Inferred:** Generic intake and mismatched evidence can make the next step less clear, though the tiny dataset cannot quantify their effect. Each service now says what a buyer can share first; pricing explains scope inputs and an assessment option without invented prices. Existing direct email and service preselection remain. No booking provider, response-time guarantee, scarcity or popup was invented. Service conversion still represents a final service CTA context, not every previous service visit.

## 21. Internal-link findings

**Implemented:** Homepage links all secondary services directly; services have deliberate adjacent scopes, relevant work/Insights and a first-discussion anchor; work returns to relevant services; About connects documentation-review experience to its service; pricing explains the path to a quote. The new article links Proxmox/recovery/documentation and NORTHSTAR with its exact evidence limitation. Important commercial pages are reachable from homepage/service directory. Static audit found no broken local targets; no orphan commercial page was introduced.

## 22. Structured-data findings

**Observed / implemented:** Existing Person, Organization, WebSite, Service, BreadcrumbList and BlogPosting are retained. Provider remains the real individual. Service FAQ schema now has the same two questions and answers as visible expandable content. No Review, AggregateRating, fake office, certification, SLA or partner claim is added. Valid JSON-LD is not a rich-result or ranking promise. Existing review/reference consent controls remain intact.

## 23. Off-site authority findings

**Observed live:** LinkedIn's headline aligns with cloud/Linux/Proxmox/Terraform/recovery and white-label support. Its Contact info still links `https://shemarhn.github.io/`, the retired site. X's profile website and pinned introductory post also display the retired hostname. Those are concrete broken acquisition paths because the old Pages site returns 404. The GitHub profile README already uses production; its fresh source takes precedence over a stale search snippet. No reliable backlink inventory or domain-strength score was available.

**Recommended owner action:** update LinkedIn's website and X's website to `https://shemarmarks.com/`; replace the old pinned X introduction when ready. No social message, post, DM or profile mutation was performed. Relevant earned contributions, eligibility-based directory review and useful project README links are prioritized in the market report; do not buy backlinks or spam communities.

## 24–28. Implementation and GitHub change inventory

**Implemented on branch `organic-acquisition-2026-11-02`:**

- New `src/data/service-engagements.ts`: ten explicit intake/FAQ/related-service definitions.
- Service template: visible/scoped FAQ and matching schema, relevant website proof, intake anchors, adjacent services and Proxmox planning links.
- Work template, homepage, About and pricing: clearer role/evidence/engagement connections.
- New page/article: `/insights/proxmox-migration-readiness-checklist/`; no new service pages, merges or redirects. Automatic social distribution is disabled for this article.
- `shared/analytics.ts` and `src/scripts/site.ts`: stable first-touch campaign/source context, coarse new inquiry channels, privacy-aware storage. No event-name or database schema change.
- Privacy/architecture documentation: attribution and existing retention behavior accurately described; no retention-code change.
- `scripts/weekly-acquisition.sql`, five attribution/SQL tests, four companion reports, this baseline and README/SEO documentation links.

**Measured validation:** 32 tests pass; Astro check and Worker TypeScript pass with zero errors/warnings/hints; production build and static audit pass; 52 browser samples across all 26 public routes at 390px and 1440px have no axe violations or horizontal overflow. Local HTTP smoke passes route protection, durable form acceptance, idempotent replay and private reference moderation. A built-in mobile-browser submission also preserved the Proxmox service selection and reached the saved-inquiry receipt. Only synthetic local records were created, with no external mail/CRM credentials configured. Temporary QA build is followed by a clean normal build. An independent diff review found no actionable issue.

**Release boundary:** Prepared as a pull request against main. Main is the established automatic production deploy trigger; this work does not bypass review by merging itself or deploying the branch directly. Content publishing documentation requires owner/editorial review. Production baseline remains the pre-change version until that review and merge. The PR's CI must pass on its exact head before release; no changed-page indexing or production result is claimed in advance.

Sanitized verification receipts: [pre-change production](../reports/production-baseline-2026-11-02.json), [52 browser samples](../reports/browser-growth-2026-11-02.json), [local HTTP smoke](../reports/http-smoke.json), and [final normal-build audit](../reports/static-audit.json). Local browser timings are not field Core Web Vitals. The normal-build audit records 12,225 bytes gzipped homepage HTML, 61,929 bytes CSS and 141,081 bytes JavaScript across all modules; no QA instrumentation remains in that build.

## 29. Items needing owner involvement

**Recommended:** review the article and service-scoping statements before merging; repair LinkedIn/X website links and the pinned X introduction; privately classify the two existing inquiries; provide public credential evidence if available; seek genuine references and permissioned professional case studies; choose approved numerical prices only if desired. Monitor failed delivery jobs through the existing admin flow before retrying any uncertain email. No new account, paid subscription or expanded permission is needed for this plan.

## 30. Quick wins

**Implemented:** proof relevance, deliberate links, buyer preparation, pricing scope clarity, first-touch consistency and privacy controls. **Recommended next:** repair retired social-profile links, release the reviewed branch through existing CI, confirm sitemap/canonicals, and record the next complete comparable week. There is no measured commercial ranking quick win yet; do not relabel an ambiguous name query as one.

## 31. First 30 days — through 2 December

**Recommended:** review/merge/release; verify 26-page sitemap and indexing of changed priority pages; repair profile links; classify inquiry quality privately; run the weekly routine. Watch Proxmox, Linux, recovery, maintenance and documentation queries. Improve the existing backup article with one useful original restore-test example if evidence and buyer questions justify it. Keep a sanitized runbook example ready. Do not turn the plan into a posting quota or publish an interactive lead magnet.

## 32. Days 31–60 — through 1 January 2027

**Recommended:** select supporting content from actual commercial impressions and inquiry questions: runbook handover acceptance, Linux maintenance scope or Terraform state ownership. Strengthen the existing primary page first. Obtain a genuine reference or professional case-study permission; make one useful relevant community contribution. Review queries in positions 11–30 and split-intent pages only if repeatable query/page evidence exists.

## 33. Days 61–90 — through 31 January 2027

**Recommended:** invest in services producing relevant inquiries; consolidate true duplication; improve snippets for sustained relevant impressions with low CTR; extend professional proof and earned mentions. Recheck mobile/forms, links, canonicals and field CWV if sufficient data appears. Separate Azure or other expanded pages require distinct evidence and demand. Adjust the roadmap to measured results instead of following an arbitrary schedule.

## 34. Weekly KPI dashboard and operating system

Use [the 30–45 minute workflow and dashboard](WEEKLY-ORGANIC-WORKFLOW.md), backed by [read-only SQL](../scripts/weekly-acquisition.sql). Record collection date, exact window, Google/Bing query and page exports, organic action subsets, saved inquiries and private qualification outcomes. Preserve zero, unknown and unavailable as distinct states.

Priority order: qualified organic inquiries; organic contact/email/booking intent; identifiable service-led inquiries; high-intent nonbrand clicks; relevant query positions; impressions; total traffic. Do not sum overlapping CTA categories or estimate a unique visitor funnel from aggregate counts. Compare like periods, defer title churn on tiny samples, and create a new page only for a distinct supported buyer question. Keep an earned-backlink register with context and useful referrals rather than a raw link-count target.

## 35. Risks and limitations

**Observed / inferred:** Search reporting lags; query privacy hides most impressions; tiny samples and changing query mix distort averages. Attribution is inferred from referrers/UTMs and can be suppressed, spoofed or lost across tabs. DNT/GPC/opt-out and blocked scripts reduce measured actions. Owner/test/bot events are not isolated. Old inquiries have unknown source/quality. No search volumes, neutral rank tracker, competitor backlink metrics, field INP/CWV or statistically valid conversion rates were established. Public profile repair and professional proof require owner work. Valid markup, sitemap discovery and implementation are separate from indexing, clicks, inquiries and clients.

## 36. Next review

**Recommended:** **9 November 2026, Jamaica time**, then weekly. Review exact release and collection dates, completed UTC periods, fresh Google/Bing reports, source/qualification of new inquiries and the outstanding www HTTPS report. A release check can verify correct behavior immediately; commercial acquisition impact needs subsequent real observations.
