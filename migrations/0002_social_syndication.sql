CREATE TABLE social_posts (
  id TEXT PRIMARY KEY,
  article_slug TEXT NOT NULL,
  platform TEXT NOT NULL CHECK(platform IN ('linkedin','x')),
  content TEXT NOT NULL,
  article_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','approved','published','failed','skipped')),
  attempts INTEGER NOT NULL DEFAULT 0,
  provider_post_id TEXT,
  provider_url TEXT,
  last_error TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT,
  published_at TEXT,
  UNIQUE(article_slug, platform)
);
CREATE INDEX social_posts_status ON social_posts(status, platform, created_at);
