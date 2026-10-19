PRAGMA foreign_keys = ON;
CREATE TABLE inquiries (
  id TEXT PRIMARY KEY,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE TABLE outbox (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL REFERENCES inquiries(id),
  kind TEXT NOT NULL CHECK(kind IN ('crm','email')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','processing','delivered','failed')),
  attempts INTEGER NOT NULL DEFAULT 0,
  next_attempt INTEGER NOT NULL DEFAULT 0,
  locked_until INTEGER NOT NULL DEFAULT 0,
  lease_token TEXT,
  last_error TEXT,
  delivered_at TEXT,
  UNIQUE(lead_id,kind)
);
CREATE INDEX outbox_due ON outbox(status,next_attempt,locked_until);
CREATE TABLE testimonials (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL DEFAULT '', company TEXT NOT NULL DEFAULT '', title TEXT NOT NULL DEFAULT '',
  service TEXT NOT NULL, quote TEXT NOT NULL, project_date TEXT NOT NULL DEFAULT '', project_value TEXT NOT NULL DEFAULT '', website TEXT NOT NULL DEFAULT '', logo_url TEXT NOT NULL DEFAULT '',
  identity_consent INTEGER NOT NULL DEFAULT 0 CHECK(identity_consent IN (0,1)),
  value_consent INTEGER NOT NULL DEFAULT 0 CHECK(value_consent IN (0,1)),
  owner_value_authorized INTEGER NOT NULL DEFAULT 0 CHECK(owner_value_authorized IN (0,1)),
  show_value INTEGER NOT NULL DEFAULT 0 CHECK(show_value IN (0,1)), verified INTEGER NOT NULL DEFAULT 0 CHECK(verified IN (0,1)),
  source TEXT NOT NULL DEFAULT 'public' CHECK(source IN ('public','admin')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected','needs_changes')),
  case_study TEXT NOT NULL DEFAULT '', moderation_note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')), updated_at TEXT,
  CHECK(show_value=0 OR (value_consent=1 OR (source='admin' AND owner_value_authorized=1)))
);
CREATE INDEX testimonials_status ON testimonials(status,created_at);
CREATE TABLE rate_limits (bucket TEXT PRIMARY KEY,count INTEGER NOT NULL,expires INTEGER NOT NULL);
CREATE TABLE moderation_audit (id TEXT PRIMARY KEY,testimonial_id TEXT NOT NULL,actor TEXT NOT NULL,action TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')));
CREATE TABLE event_counts (day TEXT NOT NULL,event TEXT NOT NULL,page TEXT NOT NULL,count INTEGER NOT NULL DEFAULT 1,PRIMARY KEY(day,event,page));
