import type { Env, SocialDraft } from './types.ts';
import { ConfigurationError, DeliveryError } from './integrations.ts';

const timeout = () => AbortSignal.timeout(12000);
const oauthEncode = (value: string) =>
  encodeURIComponent(value).replace(/[!'()*]/g, (char) =>
    `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
  );

function combinedText(post: SocialDraft) {
  return `${post.content.trim()}\n\n${post.article_url}`;
}

async function publishLinkedIn(env: Env, post: SocialDraft) {
  if (!env.LINKEDIN_ACCESS_TOKEN || !env.LINKEDIN_AUTHOR_URN || !env.LINKEDIN_VERSION)
    throw new ConfigurationError('LinkedIn publishing configuration missing');
  const response = await fetch('https://api.linkedin.com/rest/posts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.LINKEDIN_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
      'Linkedin-Version': env.LINKEDIN_VERSION,
    },
    body: JSON.stringify({
      author: env.LINKEDIN_AUTHOR_URN,
      commentary: combinedText(post),
      visibility: 'PUBLIC',
      distribution: {
        feedDistribution: 'MAIN_FEED',
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: 'PUBLISHED',
      isReshareDisabledByAuthor: false,
    }),
    signal: timeout(),
  });
  if (!response.ok)
    throw new DeliveryError(`LinkedIn returned HTTP ${response.status}`, true);
  return { id: response.headers.get('x-restli-id') || '', url: '' };
}

async function hmacSha1(key: string, value: string) {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(key),
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign'],
  );
  const bytes = new Uint8Array(
    await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(value)),
  );
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

async function xAuthorization(env: Env, method: string, url: string) {
  if (!env.X_API_KEY || !env.X_API_SECRET || !env.X_ACCESS_TOKEN || !env.X_ACCESS_TOKEN_SECRET)
    throw new ConfigurationError('X publishing configuration missing');
  const oauth: Record<string, string> = {
    oauth_consumer_key: env.X_API_KEY,
    oauth_nonce: crypto.randomUUID().replaceAll('-', ''),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: String(Math.floor(Date.now() / 1000)),
    oauth_token: env.X_ACCESS_TOKEN,
    oauth_version: '1.0',
  };
  const parameterString = Object.entries(oauth)
    .map(([key, value]) => [oauthEncode(key), oauthEncode(value)] as const)
    .sort(([aKey, aValue], [bKey, bValue]) =>
      aKey === bKey ? aValue.localeCompare(bValue) : aKey.localeCompare(bKey),
    )
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  const baseString = `${method.toUpperCase()}&${oauthEncode(url)}&${oauthEncode(parameterString)}`;
  const signingKey = `${oauthEncode(env.X_API_SECRET)}&${oauthEncode(env.X_ACCESS_TOKEN_SECRET)}`;
  oauth.oauth_signature = await hmacSha1(signingKey, baseString);
  return `OAuth ${Object.entries(oauth)
    .map(([key, value]) => [oauthEncode(key), oauthEncode(value)] as const)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}="${value}"`)
    .join(', ')}`;
}

async function publishX(env: Env, post: SocialDraft) {
  if (post.content.length > 240)
    throw new DeliveryError('X draft is too long; shorten it before publishing.', true);
  const url = 'https://api.x.com/2/tweets';
  const authorization = await xAuthorization(env, 'POST', url);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: combinedText(post) }),
    signal: timeout(),
  });
  if (!response.ok) throw new DeliveryError(`X returned HTTP ${response.status}`, true);
  const payload = (await response.json()) as { data?: { id?: string } };
  const id = payload.data?.id || '';
  return { id, url: id ? `https://x.com/Shemarhn/status/${id}` : '' };
}

export async function syncSocialDrafts(env: Env) {
  if (!env.DB || env.SOCIAL_MODE === 'off') return;
  const response = await env.ASSETS.fetch(new Request('https://shemarmarks.com/social.json'));
  if (!response.ok) throw new Error('Social feed could not be read from built assets.');
  const feed = (await response.json()) as {
    posts: Array<{
      slug: string;
      url: string;
      linkedin?: string;
      linkedinUrl?: string;
      x?: string;
      xUrl?: string;
    }>;
  };
  for (const article of feed.posts || []) {
    for (const platform of ['linkedin', 'x'] as const) {
      const content = article[platform]?.trim();
      if (!content) continue;
      const articleUrl =
        platform === 'linkedin'
          ? article.linkedinUrl || article.url
          : article.xUrl || article.url;
      await env.DB.prepare(
        `INSERT INTO social_posts(id,article_slug,platform,content,article_url,status)
         VALUES(?,?,?,?,?,'draft')
         ON CONFLICT(article_slug,platform) DO UPDATE SET
           content=CASE WHEN social_posts.status IN ('draft','approved','failed') THEN excluded.content ELSE social_posts.content END,
           article_url=CASE WHEN social_posts.status IN ('draft','approved','failed') THEN excluded.article_url ELSE social_posts.article_url END,
           updated_at=CASE WHEN social_posts.status IN ('draft','approved','failed') THEN strftime('%Y-%m-%dT%H:%M:%fZ','now') ELSE social_posts.updated_at END`,
      )
        .bind(`${article.slug}:${platform}`, article.slug, platform, content, articleUrl)
        .run();
    }
  }
}

export async function processSocialOutbox(env: Env) {
  if (!env.DB || env.SOCIAL_MODE === 'off') return;
  const statuses = env.SOCIAL_MODE === 'automatic' ? "('draft','approved')" : "('approved')";
  const rows = await env.DB.prepare(
    `SELECT * FROM social_posts WHERE status IN ${statuses} ORDER BY created_at LIMIT 4`,
  ).all<SocialDraft>();
  for (const post of rows.results) {
    try {
      const result =
        post.platform === 'linkedin' ? await publishLinkedIn(env, post) : await publishX(env, post);
      const stamp = new Date().toISOString();
      await env.DB.prepare(
        "UPDATE social_posts SET status='published',attempts=attempts+1,provider_post_id=?,provider_url=?,last_error=NULL,published_at=?,updated_at=? WHERE id=? AND status<>'published'",
      )
        .bind(result.id, result.url, stamp, stamp, post.id)
        .run();
    } catch (error) {
      const configuration = error instanceof ConfigurationError;
      // Once a provider request has been attempted, a timeout/network error can be an uncertain
      // outcome: the provider may have created the post before the response was lost. Fail closed
      // and require a human to inspect the account before retrying instead of risking duplicates.
      await env.DB.prepare(
        'UPDATE social_posts SET status=?,attempts=?,last_error=?,updated_at=? WHERE id=?',
      )
        .bind(
          configuration ? post.status : 'failed',
          post.attempts + (configuration ? 0 : 1),
          configuration
            ? (error as Error).message
            : `${error instanceof Error ? error.message : 'Social publishing outcome uncertain'}; inspect the provider before retrying`,
          new Date().toISOString(),
          post.id,
        )
        .run();
    }
  }
}
