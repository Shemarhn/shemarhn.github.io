# Weekly organic acquisition workflow

Spend **30–45 minutes once a week**, starting 9 November 2026 in Jamaica time. Record the collection time, reporting dates and any missing access. This routine uses Search Console, Bing Webmaster Tools, existing aggregate analytics and private inquiry/CRM records; no paid tool or extra tracker is required. Its purpose is more qualified inquiries for Shemar's actual services.

## Keep the measures separate

1. **Business outcome:** qualified inquiries attributed to organic search; later, proposals and won engagements from those inquiries.
2. **Buyer actions:** recorded organic contact/email/booking actions, where an actual booking link exists, and saved inquiries.
3. **Commercial discovery:** relevant non-branded query clicks, commercial impressions and service landing-page clicks.
4. **Supporting signals:** query positions, index coverage, evidence-page activity and aggregate page views.

Indexing is not traffic. A click is not a lead. A saved inquiry is not necessarily qualified. A qualified inquiry is not a won client. Keep unknown values as **unknown**, rather than zero.

`event_counts` contains actions by UTC day, event and page, without a persistent visitor identifier. Google/Bing prefixed events are **subsets of their base events**: never add `google_organic_page_view` or `bing_organic_page_view` to `page_view`. A person can take multiple actions and visit multiple pages. These counts cannot establish unique visitors, a person-level funnel, drop-off or a visitor conversion rate. The remaining base total cannot be labeled direct/referral traffic.

Saved inquiry counts come from the durable `inquiries` table; browser submission events are best-effort and can differ. Missing historical channel/landing metadata is `privacy_or_unknown`, not direct. DNT/GPC, opt-out, referrer suppression, bots, cross-tab behavior and self-reported attribution limit coverage. A reported organic source is useful context, not independently verified proof. References/testimonials and email/CRM delivery jobs are operational measures, not acquisition conversions. See [architecture and measurement](ARCHITECTURE.md).

## 1. Review inquiries first — 5–10 minutes

Review new saved inquiries privately in the existing inquiry/CRM workflow. Check delivery failures before assuming a quiet inbox means no inquiries. Maintain one private row per inquiry; use an opaque record/reference ID in summaries, with names, addresses, messages and confidential details kept out of this public repository.

**Current operating status — owner clarification, 3 November 2026:** the CRM has not yet been deployed or activated. Use the website's saved inquiries and a private qualification record in the meantime. The two measured pending CRM synchronization jobs are expected and intentionally await activation; the two acknowledgment email jobs were delivered. No CRM retry or configuration change is needed now. When the CRM is ready, validate the complete inquiry-to-CRM path and reconcile the pending records without duplicating them. Do not flag this expected pending state as a fault.

| Private field                | What to record                                                                                                                                                                                                       |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Inquiry ID and received date | Existing record ID; do not count an email retry or repeated follow-up as another opportunity                                                                                                                         |
| Service and need             | Cloud, Linux, Proxmox, recovery, IaC, automation, documentation, maintenance, agency/MSP or website; a short business problem                                                                                        |
| First landing/channel        | Recorded first-touch metadata when available; otherwise unknown. Keep optional self-reported discovery in its own field.                                                                                             |
| Qualification                | Pending / qualified / not a fit / spam or test. Qualified means a real buyer has a relevant need within supported scope and a credible path to discussing work. Budget, authority and timing can remain unconfirmed. |
| Evidence and next step       | Why the need fits, missing scoping information, agreed next action and owner                                                                                                                                         |
| Stage                        | New → scoping → proposal → won / lost / no decision; record stage dates and a brief reason                                                                                                                           |
| Attribution confidence       | Recorded organic / self-reported organic / referral or other / unknown; preserve contradictions rather than overwriting them                                                                                         |
| Outcome                      | Won date only when an engagement is actually agreed; do not infer a win from a form, reply or proposal                                                                                                               |

Count qualified inquiries and won work by **inquiry cohort** as well as this week's stage changes. A lead received weeks ago can become won this week; do not divide this week's wins by this week's new inquiries and call it a reliable close rate. Keep the original source when stages change. In a conversation, an optional “How did you find me?” can clarify an unknown source without adding required form friction. Do not fill historical gaps by guessing.

## 2. Review search discovery — 10 minutes

In Search Console, select the production `shemarmarks.com` property and Web search. Review the last 7 days, last 28 days and three-month context. Capture the exact reported date ranges and latest available date; Search Console's reporting window can lag and need not align with the UTC D1 export. Compare like windows with the preceding period. Preserve the raw export privately when available.

- Record clicks, impressions, CTR and average position. These totals describe the selected report, not necessarily the visible query rows; privacy filtering can hide queries.
- Inspect queries and pages together. Classify visible queries as branded, commercial non-branded, problem-aware, informational or irrelevant/ambiguous. “Shemar” alone is not automatically a relevant branded query: inspect the full wording and landing page.
- Watch buyer clusters from [the search-market map](SEARCH-MARKET-2026-11-02.md): Proxmox migration/readiness, Linux support/maintenance, AWS infrastructure, recovery testing, Terraform/state, documentation/handover, automation and MSP delivery.
- Bucket observed query positions into **1–3, 4–10, 11–20, 21–50 and over 50**. Average position is not a fixed rank; do not describe a single impression as stable placement.
- Flag commercial impressions with no clicks and the right landing page in positions 4–20 first. For 21–50, inspect page fit, evidence and authority before expanding copy. A zero-click row is a review candidate, not proof of a bad title.
- Compare page visibility, country and device. Check whether the queries reflect plausible buyers. A device or country change can explain a position/CTR change; it does not justify a fake local service page.

In Bing Webmaster Tools, record available search performance and sitemap/indexing issues separately. If access or data is missing, record that limit. A verification tag or submitted sitemap does not prove indexation or visits. Inspect only a few priority changed URLs when there is a meaningful issue; do not repeatedly request indexing for unchanged pages.

## 3. Export site actions — 5 minutes

Run the read-only queries in [`scripts/weekly-acquisition.sql`](../scripts/weekly-acquisition.sql) through the authorized production D1 console/CLI. The script exports this/prior 7-day and 28-day periods, excluding the current incomplete UTC day. Save each result with its collection date in a private working location; no visitor identities or messages are selected.

Record `start_day` inclusive and `end_day` exclusive. UTC midnight is 7 p.m. on the previous Jamaica calendar date, so do not silently substitute local calendar days. The SQL uses `now`; rerunning it next week produces different periods. For a repeatable historical comparison, retain the original export or explicitly use the recorded date bounds in a read-only query.

Review base and Google/Bing subsets for page views; service, work, pricing and contact pages; service/contact/pricing CTAs; email/booking clicks; and saved inquiries grouped by channel, first landing and service. Empty grouped results mean no stored rows for that selection, not that all real activity was observed. If aggregate organic actions occur on one page and an inquiry comes from another, do not join them into a person-level journey.

## 4. Inspect one buyer path and choose one action — 10–15 minutes

Open the most relevant landing page on mobile and desktop: search promise → service explanation → relevant evidence → scope/pricing → contact. Check that links work, text is readable, navigation and CTA are usable, and the selected service reaches the form. Check real saved-inquiry/delivery health separately; use the documented local smoke test for synthetic form submissions. Do not submit fake production inquiries as an SEO check.

Choose the smallest justified action, or deliberately leave content unchanged. Record the reason, affected URL, release date and a review date. A weekly check does not require a weekly page rewrite or article.

| Decision                      | Use this gate                                                                                                                                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fix now                       | Broken CTA/link/form, wrong canonical/noindex, inaccurate claim, stale technical instruction, inaccessible layout or a mismatched evidence link. Validate the affected behavior before publishing.      |
| Strengthen an existing page   | It already owns the buyer intent and lacks an answer, deliverable, credible example, internal link or clear next step. Use actual query/inquiry evidence where available.                               |
| Test title/description        | Sufficient relevant impressions show a repeated CTR concern and the promise can be made more accurate. Inspect device/country/query mix first; record one focused change and allow fresh data.          |
| Create one supporting article | A distinct buyer decision question appears in search/inquiries or is strongly supported by market/evidence research; it can be answered with original detail and linked to one existing service.        |
| Create a service page         | A genuinely distinct paid scope, buyer intent, original evidence and ongoing ownership justify it; existing pages cannot answer it well. Research current results and map it first.                     |
| Merge/redirect                | Pages repeatedly serve the same intent with little unique value. Review queries, links and evidence, choose the primary destination, preserve useful content and verify the redirect/canonical/sitemap. |
| Do not update                 | Only a few impressions, hidden queries, a one-week wobble, fresh content awaiting recrawl, a change in query mix, no better answer to add, or a posting calendar is the sole reason.                    |

Suspect cannibalization when the **same commercial query** repeatedly switches between two similar pages or splits relevant impressions and clicks without a clear purpose. Multiple relevant pages appearing once is not enough. Compare query-filtered page reports across several reviews, then use the [intent map](SEARCH-MARKET-2026-11-02.md) to identify the primary service. An article and service can coexist when the article answers a decision question and links to the service. Do not delete useful evidence or create redirects based on one sparse report.

## Weekly KPI record

Copy this table into a **private** weekly note or existing tracker. Fill this/prior periods and explain important changes in one sentence. Avoid percentage changes when the prior value is zero; show absolute counts. With tiny samples, do not interpret calculated rates as stable business performance.

| Metric                                                        | This 7 days | Prior 7 | This 28 days | Prior 28 | Source / limit                                                  |
| ------------------------------------------------------------- | ----------- | ------- | ------------ | -------- | --------------------------------------------------------------- |
| Qualified recorded-organic inquiries                          | —           | —       | —            | —        | Private inquiry/CRM review; unknown until qualified             |
| Qualified self-reported-organic inquiries                     | —           | —       | —            | —        | Separate from recorded source; avoid counting twice             |
| Saved inquiries: Google / Bing / unknown / other              | —           | —       | —            | —        | D1; qualify each privately                                      |
| New proposals and won engagements                             | —           | —       | —            | —        | CRM; keep original inquiry cohort/source                        |
| Google/Bing organic contact, email and actual booking actions | —           | —       | —            | —        | D1 subsets, separate event names; actions, not people           |
| Organic service-page actions / evidence-page actions          | —           | —       | —            | —        | Group by page/event; no reconstructed funnel                    |
| Search commercial non-branded clicks and impressions          | —           | —       | —            | —        | Visible classified query rows; not a full hidden-query estimate |
| Search total clicks / impressions / CTR / average position    | —           | —       | —            | —        | Search Console; record report dates and lag                     |
| Commercial query counts in position buckets                   | —           | —       | —            | —        | Visible rows; 1–3 / 4–10 / 11–20 / 21–50 / over 50              |
| Service pages receiving search impressions / clicks           | —           | —       | —            | —        | Search Console page report                                      |
| Top three landing pages and relevant queries                  | —           | —       | —            | —        | Query intent and buyer relevance beside count                   |
| Bing search clicks / impressions where available              | —           | —       | —            | —        | Bing report, separate from Google                               |
| Base page views; Google/Bing subsets                          | —           | —       | —            | —        | D1; subsets never added to base                                 |
| Relevant earned/owned mentions and referral inquiries         | —           | —       | —            | —        | Backlink register and private inquiry evidence                  |
| Indexing / delivery / broken-path issue                       | —           | —       | —            | —        | Description, affected URL and resolution owner                  |

### Starting receipt from the 2 November review

**Measured:** Search Console selected 7-day, 28-day and three-month views each showed **42 impressions, 1 click, 2.4% CTR and average position 13.2**. These are overlapping report views, not three independent samples to add. Visible query rows were `shemar bridges` (7 impressions, average position 8.3), `linux security baseline` (2, position 52) and `sirmark` (1, position 49), each with zero clicks. None establishes a known commercial-query opportunity; hidden queries remain unknown. The query rows do not explain the one click, so do not assign it to any displayed phrase. The 27 October documented three-month view had 4 impressions and zero clicks; greater totals now do not establish stable ranking improvement or qualified demand.

**Measured:** D1's seven complete UTC days ending **2026-11-03 exclusive** contained **55 base page views**, a **2-action Google-organic page-view subset**, **1 Google-organic contact CTA action**, **1 Google-organic website CTA action**, and **no saved inquiries**. The 28-day export contained **184 base page views**, the same **2-action Google subset**, and **2 saved Website Development inquiries dated 20 October** whose source and qualification were unknown. These historical inquiries must not be relabeled organic, qualified or won. Saved inquiry totals are stronger acceptance evidence than browser event totals; they still require review for tests/spam/fit.

This receipt is a starting observation, not a target or forecast. Keep Search Console's actual selected ranges with the original evidence; do not assume they match the D1 UTC periods. The immediate operating priority is to build relevant commercial discovery and keep the contact path credible and measurable, rather than optimize around ambiguous name queries.

## Backlink and distribution register

Use one private or non-sensitive row per relevant mention:

| Found date | Referring URL | Destination URL | Why relevant / owned or earned | Owner action | Last checked | Observable referrals or inquiry evidence |
| ---------- | ------------- | --------------- | ------------------------------ | ------------ | ------------ | ---------------------------------------- |
| —          | —             | —               | —                              | —            | —            | Unknown until observed                   |

Check one useful profile/repository/community opportunity weekly; review older links monthly. Prioritize appropriate project README links, accurate professional profiles and useful technical contributions. Do not buy links, mass-submit directories, automate outreach or claim an unearned vendor relationship. A useful contribution every two to four weeks is enough when there is real work to share; no forced posting schedule is needed. Track which links lead relevant people to evidence/services or produce useful conversations, rather than chasing total backlinks.

## End the review with a short decision log

- **Evidence:** what changed, using measured/observed/inferred labels.
- **Decision:** one action or “leave unchanged,” with the reason and primary URL.
- **Validation:** checks needed and the actual result.
- **Follow-up:** next review date; expected signal to inspect, without promising an uplift.
- **Owner involvement:** real reference/case-study permission, an eligibility decision or a useful professional contribution that requires Shemar.

Once a month, spend up to an extra 30 minutes reviewing the rolling 28-day trend, qualified inquiry outcomes, service priorities, current official technical guidance for changed material and the 30/60/90-day plan. Continue what brings relevant buyers closer to an informed inquiry; revise the plan when the evidence changes.
