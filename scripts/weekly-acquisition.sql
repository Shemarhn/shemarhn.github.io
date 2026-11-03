-- Read-only; execute in the production D1 console or an authorized D1 CLI.
-- All periods are complete UTC days; today's incomplete day is excluded.
-- Export each result separately. No names, email addresses, messages, or full
-- referrers are selected. Never add base counts to Google/Bing subset counts.

-- 1. Page/event actions for this and the prior 7 and 28 complete days.
WITH periods(period,start_day,end_day) AS (
  VALUES
    ('last_7',date('now','-7 day'),date('now')),
    ('prior_7',date('now','-14 day'),date('now','-7 day')),
    ('last_28',date('now','-28 day'),date('now')),
    ('prior_28',date('now','-56 day'),date('now','-28 day'))
)
SELECT p.period,e.event,e.page,SUM(e.count) AS actions
FROM periods p JOIN event_counts e
  ON e.day >= p.start_day AND e.day < p.end_day
GROUP BY p.period,e.event,e.page
ORDER BY p.period,e.event,actions DESC,e.page;

-- 2. Saved inquiries, separate from best-effort browser submission events.
-- Blank pre-release channels are unknown, never presumed direct.
-- privacy_or_unknown includes disabled attribution, old records and missing data.
WITH periods(period,start_day,end_day) AS (
  VALUES
    ('last_7',date('now','-7 day'),date('now')),
    ('prior_7',date('now','-14 day'),date('now','-7 day')),
    ('last_28',date('now','-28 day'),date('now')),
    ('prior_28',date('now','-56 day'),date('now','-28 day'))
)
SELECT p.period,
  COALESCE(NULLIF(json_extract(i.payload,'$.metadata.traffic_channel'),''),
    'privacy_or_unknown') AS traffic_channel,
  COALESCE(NULLIF(json_extract(i.payload,'$.metadata.landing_page'),''),
    'privacy_or_unknown') AS landing_page,
  json_extract(i.payload,'$.service') AS service,
  COUNT(*) AS saved_inquiries
FROM periods p JOIN inquiries i
  ON julianday(i.created_at) >= julianday(p.start_day)
  AND julianday(i.created_at) < julianday(p.end_day)
GROUP BY p.period,traffic_channel,landing_page,service
ORDER BY p.period,saved_inquiries DESC,traffic_channel,landing_page;

-- 3. Reference flow and delivery health: not acquisition conversions.
SELECT status,COUNT(*) AS reference_count FROM testimonials GROUP BY status;
SELECT kind,status,COUNT(*) AS delivery_jobs FROM outbox GROUP BY kind,status;
