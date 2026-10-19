import { createRemoteJWKSet, jwtVerify } from 'jose';
import baseWorker from './index.ts';
import { processSocialOutbox, syncSocialDrafts } from './social.ts';
import type { Env } from './types.ts';

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const jwksCache = new Map<string, ReturnType<typeof createRemoteJWKSet>>();
async function admin(request: Request, env: Env) {
  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD || !env.ADMIN_EMAILS)
    throw new HttpError(503, 'Administrator authentication is not configured.');
  if (!/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(env.ACCESS_TEAM_DOMAIN))
    throw new HttpError(503, 'Administrator authentication configuration is invalid.');
  const header = request.headers.get('Cf-Access-Jwt-Assertion');
  const cookie = request.headers.get('Cookie')?.match(/(?:^|;\s*)CF_Authorization=([^;]+)/)?.[1];
  const token = header || cookie;
  if (!token) throw new HttpError(401, 'Sign in through Cloudflare Access.');
  const issuer = `https://${env.ACCESS_TEAM_DOMAIN}`;
  let keys = jwksCache.get(issuer);
  if (!keys) {
    keys = createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`));
    jwksCache.set(issuer, keys);
  }
  try {
    const { payload } = await jwtVerify(token, keys, {
      issuer,
      audience: env.ACCESS_AUD,
      algorithms: ['RS256'],
    });
    const email = String(payload.email || '').toLowerCase();
    const allowed = env.ADMIN_EMAILS.split(',').map((value) => value.trim().toLowerCase());
    if (!allowed.includes(email)) throw Error();
    return email;
  } catch {
    throw new HttpError(403, 'Administrator access could not be verified.');
  }
}

function sameOrigin(request: Request) {
  if (request.headers.get('Origin') !== new URL(request.url).origin)
    throw new HttpError(403, 'This action must come from the admin website.');
}

async function body(request: Request) {
  if (!request.headers.get('Content-Type')?.startsWith('application/json'))
    throw new HttpError(415, 'JSON required.');
  const value = (await request.json()) as unknown;
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new HttpError(400, 'Invalid request.');
  return value as Record<string, unknown>;
}

function adminJson(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

async function purgeRetention(env: Env) {
  if (!env.DB) return;
  const cutoff = new Date(Date.now() - 365 * 86400000).toISOString();
  const staleReferences = await env.DB.prepare(
    "SELECT id FROM testimonials WHERE created_at<? AND status IN ('pending','rejected','needs_changes') LIMIT 500",
  )
    .bind(cutoff)
    .all<{ id: string }>();
  for (const row of staleReferences.results) {
    await env.DB.batch([
      env.DB.prepare(
        'INSERT INTO moderation_audit(id,testimonial_id,actor,action) VALUES(?,?,?,?)',
      ).bind(crypto.randomUUID(), row.id, 'system:retention', 'delete_expired_reference'),
      env.DB.prepare('DELETE FROM testimonials WHERE id=?').bind(row.id),
    ]);
  }
  // The website copy is safe to expire only after Orbit has durably accepted it. If CRM delivery
  // is still pending/failed, D1 may be the only durable copy and must remain for operator recovery.
  const staleInquiries = await env.DB.prepare(
    "SELECT i.id FROM inquiries i JOIN outbox o ON o.lead_id=i.id AND o.kind='crm' WHERE i.created_at<? AND o.status='delivered' LIMIT 500",
  )
    .bind(cutoff)
    .all<{ id: string }>();
  for (const row of staleInquiries.results) {
    await env.DB.batch([
      env.DB.prepare('DELETE FROM outbox WHERE lead_id=?').bind(row.id),
      env.DB.prepare('DELETE FROM inquiries WHERE id=?').bind(row.id),
    ]);
  }
}

async function extendedAdmin(request: Request, env: Env, ctx: ExecutionContext) {
  const actor = await admin(request, env);
  if (!env.DB) throw new HttpError(503, 'Database not configured.');
  const path = new URL(request.url).pathname;
  if (request.method !== 'GET') sameOrigin(request);

  if (path === '/api/admin/inquiries' && request.method === 'GET') {
    const rows = await env.DB.prepare(
      `SELECT i.id,i.payload,i.created_at,
        (SELECT group_concat(kind||':'||status, ', ') FROM outbox o WHERE o.lead_id=i.id) AS delivery
       FROM inquiries i ORDER BY i.created_at DESC LIMIT 200`,
    ).all<{ id: string; payload: string; created_at: string; delivery: string }>();
    return adminJson({
      inquiries: rows.results.map((row) => ({ ...row, payload: JSON.parse(row.payload) })),
    });
  }

  const inquiry = path.match(/^\/api\/admin\/inquiries\/([a-f0-9-]{36})$/i);
  if (inquiry && request.method === 'DELETE') {
    await env.DB.batch([
      env.DB.prepare('DELETE FROM outbox WHERE lead_id=?').bind(inquiry[1]),
      env.DB.prepare('DELETE FROM inquiries WHERE id=?').bind(inquiry[1]),
    ]);
    return adminJson({ ok: true });
  }

  const reference = path.match(/^\/api\/admin\/testimonials\/([a-f0-9-]{36})$/i);
  if (reference && request.method === 'DELETE') {
    const found = await env.DB.prepare('SELECT id FROM testimonials WHERE id=?').bind(reference[1]).first();
    if (!found) throw new HttpError(404, 'Reference not found.');
    await env.DB.batch([
      env.DB.prepare(
        'INSERT INTO moderation_audit(id,testimonial_id,actor,action) VALUES(?,?,?,?)',
      ).bind(crypto.randomUUID(), reference[1], actor, 'delete_reference'),
      env.DB.prepare('DELETE FROM testimonials WHERE id=?').bind(reference[1]),
    ]);
    return adminJson({ ok: true });
  }

  if (path === '/api/admin/social' && request.method === 'GET') {
    const rows = await env.DB.prepare('SELECT * FROM social_posts ORDER BY created_at DESC LIMIT 200').all();
    return adminJson({ mode: env.SOCIAL_MODE || 'review', posts: rows.results });
  }
  if (path === '/api/admin/social/sync' && request.method === 'POST') {
    await syncSocialDrafts(env);
    return adminJson({ ok: true });
  }
  const publish = path.match(/^\/api\/admin\/social\/(.+)\/publish$/);
  if (publish && request.method === 'POST') {
    const id = decodeURIComponent(publish[1]);
    await env.DB.prepare(
      "UPDATE social_posts SET status='approved',last_error=NULL,updated_at=? WHERE id=? AND status<>'published'",
    )
      .bind(new Date().toISOString(), id)
      .run();
    ctx.waitUntil(processSocialOutbox(env));
    return adminJson({ ok: true });
  }
  const social = path.match(/^\/api\/admin\/social\/(.+)$/);
  if (social && request.method === 'PATCH') {
    const id = decodeURIComponent(social[1]);
    const data = await body(request);
    const status = String(data.status || 'draft');
    const content = String(data.content || '').trim();
    if (!['draft', 'approved', 'skipped'].includes(status)) throw new HttpError(400, 'Invalid social status.');
    if (!content || content.length > 3000) throw new HttpError(400, 'Social copy is missing or too long.');
    const row = await env.DB.prepare('SELECT platform,status FROM social_posts WHERE id=?')
      .bind(id)
      .first<{ platform: string; status: string }>();
    if (!row) throw new HttpError(404, 'Social draft not found.');
    if (row.status === 'published') throw new HttpError(409, 'Published posts are immutable here.');
    if (row.platform === 'x' && content.length > 240)
      throw new HttpError(400, 'X copy must be 240 characters or fewer before the article link.');
    await env.DB.prepare(
      'UPDATE social_posts SET content=?,status=?,last_error=NULL,updated_at=? WHERE id=?',
    )
      .bind(content, status, new Date().toISOString(), id)
      .run();
    return adminJson({ ok: true });
  }

  throw new HttpError(404, 'Admin endpoint not found.');
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    try {
      const path = new URL(request.url).pathname;
      const extendedPath =
        /^\/api\/admin\/(?:inquiries|social)(?:\/|$)/.test(path) ||
        (request.method === 'DELETE' && /^\/api\/admin\/testimonials\/[a-f0-9-]{36}$/i.test(path));
      if (extendedPath) return await extendedAdmin(request, env, ctx);
      return await baseWorker.fetch(request, env, ctx);
    } catch (error) {
      const status = error instanceof HttpError ? error.status : 500;
      return adminJson(
        {
          ok: false,
          error: status === 500 ? 'The admin action could not be completed.' : (error as Error).message,
        },
        status,
      );
    }
  },
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    await baseWorker.scheduled(event, env, ctx);
    ctx.waitUntil(
      (async () => {
        await purgeRetention(env);
        if (env.SOCIAL_MODE !== 'off') {
          await syncSocialDrafts(env);
          await processSocialOutbox(env);
        }
      })(),
    );
  },
};
