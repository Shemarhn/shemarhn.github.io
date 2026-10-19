import { createRemoteJWKSet, jwtVerify } from 'jose';
import {
  InputError,
  validateLead,
  validateReference,
  validateModeration,
  publicReference,
  string,
  consent,
} from './validation.ts';
import { crmAdapter, emailAdapter, ConfigurationError, DeliveryError } from './integrations.ts';
import type { Env, Job, Lead, Reference } from './types.ts';

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
const json = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
const local = (request: Request) =>
  ['localhost', '127.0.0.1', '[::1]'].includes(new URL(request.url).hostname);
const securityHeaders: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Content-Security-Policy':
    "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' https://challenges.cloudflare.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://challenges.cloudflare.com https://cloudflareinsights.com; frame-src https://challenges.cloudflare.com; upgrade-insecure-requests",
};
function secure(response: Response, request: Request, env: Env) {
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(securityHeaders))
    headers.set(
      k,
      local(request) && k === 'Content-Security-Policy'
        ? v.replace('; upgrade-insecure-requests', '')
        : v,
    );
  if (!local(request)) headers.set('Strict-Transport-Security', 'max-age=31536000');
  if (
    env.APP_ENV !== 'production' ||
    !['shemarmarks.com', 'www.shemarmarks.com'].includes(new URL(request.url).hostname)
  )
    headers.set('X-Robots-Tag', 'noindex, nofollow');
  if (new URL(request.url).pathname.startsWith('/admin')) {
    headers.set('Cache-Control', 'private, no-store');
    headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
function sameOrigin(request: Request) {
  if (request.headers.get('Origin') !== new URL(request.url).origin)
    throw new HttpError(403, 'This submission must come from this website.');
}
async function body(request: Request) {
  if (!request.headers.get('Content-Type')?.startsWith('application/json'))
    throw new HttpError(415, 'Please submit using the website form.');
  if (Number(request.headers.get('Content-Length') || 0) > 24000)
    throw new HttpError(413, 'Submission too large.');
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, 'No submission received.');
  let total = 0;
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > 24000) {
      await reader.cancel();
      throw new HttpError(413, 'Submission too large.');
    }
    chunks.push(value);
  }
  const combined = new Uint8Array(total);
  let at = 0;
  for (const c of chunks) {
    combined.set(c, at);
    at += c.length;
  }
  try {
    const value = JSON.parse(new TextDecoder().decode(combined));
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw Error();
    return value as Record<string, unknown>;
  } catch {
    throw new HttpError(400, 'Invalid submission format.');
  }
}
export async function digest(value: string) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, '0')).join('');
}
async function rateLimit(request: Request, env: Env, group = 'form', limit = 6) {
  if (!env.DB)
    throw new HttpError(503, 'The form is not configured yet. Please email hello@shemarmarks.com.');
  if (!env.IP_HASH_SALT && !(local(request) && env.APP_ENV === 'development'))
    throw new HttpError(
      503,
      'The form is temporarily unavailable. Please email hello@shemarmarks.com.',
    );
  const now = Math.floor(Date.now() / 1000);
  const hash = await digest(
    `${env.IP_HASH_SALT || 'local-only'}:${Math.floor(now / 86400)}:${request.headers.get('CF-Connecting-IP') || 'local'}`,
  );
  const bucket = `${group}:${Math.floor(now / 600)}:${hash}`;
  const row = await env.DB.prepare(
    'INSERT INTO rate_limits(bucket,count,expires) VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET count=count+1 RETURNING count',
  )
    .bind(bucket, now + 1200)
    .first<{ count: number }>();
  if (!row || row.count > limit)
    throw new HttpError(
      429,
      'Too many attempts. Please wait a few minutes or email hello@shemarmarks.com.',
    );
}
async function challenge(
  request: Request,
  env: Env,
  data: Record<string, unknown>,
  action: string,
) {
  if (local(request) && env.APP_ENV === 'development' && env.LOCAL_FORM_TESTING === 'true') return;
  if (!env.TURNSTILE_SECRET_KEY)
    throw new HttpError(
      503,
      'Spam protection is not configured yet. Please email hello@shemarmarks.com.',
    );
  const token = string(data['cf-turnstile-response'], 2048, 1);
  let result: { success: boolean; hostname: string; action?: string };
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: request.headers.get('CF-Connecting-IP') || '',
        idempotency_key: crypto.randomUUID(),
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw Error();
    result = await response.json();
  } catch {
    throw new HttpError(503, 'Spam verification is unavailable. Please try again shortly.');
  }
  const hosts = (env.TURNSTILE_HOSTNAMES || 'shemarmarks.com').split(',').map((x) => x.trim());
  if (!result.success || !hosts.includes(result.hostname) || result.action !== action)
    throw new HttpError(400, 'Please complete the spam check again.');
}
function requestId(data: Record<string, unknown>) {
  const id = string(data.requestId, 36, 36);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id))
    throw new InputError('Invalid request identifier. Please reload the form.');
  return id;
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
  if (!token)
    throw new HttpError(401, 'Sign in through the configured Cloudflare Access application.');
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
    if (
      !(env.ADMIN_EMAILS || '')
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .includes(email)
    )
      throw Error();
    return email;
  } catch {
    throw new HttpError(403, 'Administrator access could not be verified.');
  }
}
async function insertReference(
  env: Env,
  id: string,
  r: Reference,
  source: 'admin' | 'public',
  ownerAuthorization: number,
  actor?: string,
) {
  const sql = env.DB.prepare(
    'INSERT INTO testimonials(id,name,email,company,title,service,quote,project_date,project_value,website,logo_url,identity_consent,value_consent,source,owner_value_authorized) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING',
  ).bind(
    id,
    r.name,
    r.email,
    r.company,
    r.title,
    r.service,
    r.quote,
    r.project_date,
    r.project_value,
    r.website,
    r.logo_url,
    r.identity_consent,
    r.value_consent,
    source,
    ownerAuthorization,
  );
  if (actor)
    await env.DB.batch([
      sql,
      env.DB.prepare(
        'INSERT INTO moderation_audit(id,testimonial_id,actor,action) VALUES(?,?,?,?)',
      ).bind(crypto.randomUUID(), id, actor, 'create_pending'),
    ]);
  else await sql.run();
}
export async function processOutbox(env: Env) {
  if (!env.DB) return;
  const now = Date.now();
  const lease = crypto.randomUUID();
  const claimed = await env.DB.prepare(
    "UPDATE outbox SET status='processing',lease_token=?,locked_until=? WHERE id IN (SELECT id FROM outbox WHERE ((status='pending' AND next_attempt<=?) OR (status='processing' AND locked_until<?)) AND attempts<10 ORDER BY next_attempt LIMIT 4) RETURNING id,lead_id,kind,attempts,lease_token",
  )
    .bind(lease, now + 180000, now, now)
    .all<Job>();
  await Promise.all(
    claimed.results.map(async (job) => {
      try {
        const row = await env.DB.prepare('SELECT payload FROM inquiries WHERE id=?')
          .bind(job.lead_id)
          .first<{ payload: string }>();
        if (!row) throw new DeliveryError('Source inquiry missing', true);
        const lead = JSON.parse(row.payload) as Lead;
        if (job.kind === 'crm') await crmAdapter(env).deliver(job.lead_id, lead);
        else await emailAdapter(env).send(job.lead_id, lead);
        await env.DB.prepare(
          "UPDATE outbox SET status='delivered',attempts=attempts+1,delivered_at=?,last_error=NULL,locked_until=0 WHERE id=? AND lease_token=?",
        )
          .bind(new Date().toISOString(), job.id, lease)
          .run();
      } catch (error) {
        const config = error instanceof ConfigurationError;
        const attempts = job.attempts + (config ? 0 : 1);
        const terminal = attempts >= 10 || (error instanceof DeliveryError && error.permanent);
        const delay = config
          ? 3600000
          : Math.min(86400000, 60000 * 2 ** attempts) + Math.floor(Math.random() * 15000);
        const note = config
          ? error.message
          : error instanceof DeliveryError
            ? error.message
            : 'Delivery unavailable; safe retry scheduled';
        await env.DB.prepare(
          'UPDATE outbox SET status=?,attempts=?,next_attempt=?,locked_until=0,last_error=? WHERE id=? AND lease_token=?',
        )
          .bind(terminal ? 'failed' : 'pending', attempts, Date.now() + delay, note, job.id, lease)
          .run();
      }
    }),
  );
}
const escape = (s: unknown) =>
  String(s ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );
function referenceHTML(t: Record<string, unknown>) {
  return `<article class="quote-card"><p class="eyebrow">${t.verified === 'true' ? 'Verified client' : 'Client reference'}</p><blockquote>${escape(t.quote)}</blockquote><p>${[t.name, t.title, t.company].filter(Boolean).map(escape).join(' · ')}</p><p>${[t.service, t.project_date, t.public_value].filter(Boolean).map(escape).join(' / ')}</p>${t.case_study ? `<a class="text-link" href="/work/${escape(t.case_study)}/">Related case study ↗</a>` : ''}</article>`;
}
async function publicReferences(env: Env) {
  const rows = await env.DB.prepare(
    "SELECT * FROM testimonials WHERE status='approved' ORDER BY created_at DESC LIMIT 100",
  ).all<Record<string, unknown>>();
  return rows.results.map(publicReference).filter(Boolean) as Record<string, unknown>[];
}
async function route(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  if (url.hostname === 'www.shemarmarks.com') {
    url.hostname = 'shemarmarks.com';
    return Response.redirect(url.href, 301);
  }
  if (path.startsWith('/api/')) {
    if (path.startsWith('/api/admin/')) {
      const actor = await admin(request, env);
      if (!env.DB) throw new HttpError(503, 'Database not configured.');
      if (request.method !== 'GET') sameOrigin(request);
      if (path === '/api/admin/testimonials' && request.method === 'GET') {
        const rows = await env.DB.prepare(
          'SELECT * FROM testimonials ORDER BY created_at DESC LIMIT 200',
        ).all();
        return json({ testimonials: rows.results });
      }
      if (path === '/api/admin/testimonials' && request.method === 'POST') {
        const data = await body(request);
        const r = validateReference(data, true);
        const id = crypto.randomUUID();
        await insertReference(
          env,
          id,
          r,
          'admin',
          Number(consent(data.owner_value_authorized)),
          actor,
        );
        return json({ ok: true, id }, 201);
      }
      const match = path.match(/^\/api\/admin\/testimonials\/([a-f0-9-]{36})$/);
      if (match && request.method === 'PATCH') {
        const data = await body(request);
        const row = await env.DB.prepare('SELECT * FROM testimonials WHERE id=?')
          .bind(match[1])
          .first<Record<string, unknown>>();
        if (!row) throw new HttpError(404, 'Reference not found.');
        const update = validateModeration(data, row);
        await env.DB.batch([
          env.DB.prepare(
            'UPDATE testimonials SET status=?,quote=?,case_study=?,show_value=?,verified=?,moderation_note=?,updated_at=? WHERE id=?',
          ).bind(
            update.status,
            update.quote,
            update.case_study,
            update.show_value,
            update.verified,
            update.moderation_note,
            new Date().toISOString(),
            match[1],
          ),
          env.DB.prepare(
            'INSERT INTO moderation_audit(id,testimonial_id,actor,action) VALUES(?,?,?,?)',
          ).bind(
            crypto.randomUUID(),
            match[1],
            actor,
            JSON.stringify({
              status: update.status,
              show_value: update.show_value,
              verified: update.verified,
              case_study: update.case_study,
              quote_changed: update.quote !== row.quote,
            }),
          ),
        ]);
        return json({ ok: true });
      }
      if (path === '/api/admin/deliveries' && request.method === 'GET') {
        const jobs = await env.DB.prepare(
          'SELECT id,lead_id,kind,status,attempts,next_attempt,last_error,delivered_at FROM outbox ORDER BY next_attempt LIMIT 200',
        ).all();
        return json({ deliveries: jobs.results });
      }
      const retry = path.match(/^\/api\/admin\/deliveries\/([a-f0-9-]{36}:(?:crm|email))\/retry$/);
      if (retry && request.method === 'POST') {
        await env.DB.prepare(
          "UPDATE outbox SET status='pending',attempts=0,next_attempt=0,last_error=NULL WHERE id=? AND status='failed'",
        )
          .bind(retry[1])
          .run();
        ctx.waitUntil(processOutbox(env));
        return json({ ok: true });
      }
      throw new HttpError(404, 'Admin endpoint not found.');
    }
    if (path === '/api/testimonials' && request.method === 'GET') {
      if (!env.DB) return json({ testimonials: [] });
      return json({ testimonials: await publicReferences(env) });
    }
    if (path === '/api/events' && request.method === 'POST') {
      sameOrigin(request);
      if (request.headers.get('DNT') === '1' || request.headers.get('Sec-GPC') === '1')
        return new Response(null, { status: 204 });
      await rateLimit(request, env, 'events', 60);
      const data = await body(request);
      const name = string(data.name, 40);
      const page = string(data.page, 200);
      const allowed = [
        'page_view',
        'contact_submission',
        'website_cta_click',
        'email_click',
        'case_study_view',
        'case_study_click',
        'service_conversion',
        'blog_conversion',
      ];
      if (!allowed.includes(name) || !/^\/[a-z0-9\/-]*$/.test(page))
        throw new InputError('Invalid event.');
      await env.DB.prepare(
        'INSERT INTO event_counts(day,event,page,count) VALUES(?,?,?,1) ON CONFLICT(day,event,page) DO UPDATE SET count=count+1',
      )
        .bind(new Date().toISOString().slice(0, 10), name, page)
        .run();
      return new Response(null, { status: 204 });
    }
    if (['/api/inquiries', '/api/testimonials'].includes(path) && request.method === 'POST') {
      sameOrigin(request);
      await rateLimit(request, env);
      const data = await body(request);
      if (data.fax) throw new InputError('This submission could not be accepted.');
      const id = requestId(data);
      const table = path === '/api/inquiries' ? 'inquiries' : 'testimonials';
      // The unpredictable request UUID is a receipt key; no private data is returned on replay.
      if (await env.DB.prepare(`SELECT id FROM ${table} WHERE id=?`).bind(id).first())
        return json({ ok: true, id, duplicate: true });
      if (path === '/api/inquiries') {
        const lead = validateLead(data);
        await challenge(request, env, data, 'inquiry');
        lead.metadata.received_at = new Date().toISOString();
        await env.DB.batch([
          env.DB.prepare(
            'INSERT INTO inquiries(id,payload) VALUES(?,?) ON CONFLICT(id) DO NOTHING',
          ).bind(id, JSON.stringify(lead)),
          env.DB.prepare(
            "INSERT INTO outbox(id,lead_id,kind) VALUES(?,?,'crm') ON CONFLICT(id) DO NOTHING",
          ).bind(`${id}:crm`, id),
          env.DB.prepare(
            "INSERT INTO outbox(id,lead_id,kind) VALUES(?,?,'email') ON CONFLICT(id) DO NOTHING",
          ).bind(`${id}:email`, id),
        ]);
        ctx.waitUntil(processOutbox(env));
        return json({ ok: true, id }, 201);
      }
      const reference = validateReference(data);
      await challenge(request, env, data, 'testimonial');
      await insertReference(env, id, reference, 'public', 0);
      return json({ ok: true, id }, 201);
    }
    throw new HttpError(404, 'Endpoint not found.');
  }
  if (path === '/admin' || path.startsWith('/admin/')) await admin(request, env);
  if (!['GET', 'HEAD'].includes(request.method)) throw new HttpError(405, 'Method not allowed.');
  if (path.endsWith('/index.html')) {
    url.pathname = path.slice(0, -10);
    return Response.redirect(url.href, 301);
  }
  if (path === '/index.html') {
    url.pathname = '/';
    return Response.redirect(url.href, 301);
  }
  if (!path.endsWith('/') && !path.split('/').pop()!.includes('.')) {
    url.pathname += '/';
    return Response.redirect(url.href, 301);
  }
  if (
    path === '/robots.txt' &&
    (env.APP_ENV !== 'production' || url.hostname !== 'shemarmarks.com')
  )
    return new Response('User-agent: *\nDisallow: /\n', {
      headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' },
    });
  const assetURL = new URL(url);
  if (path.endsWith('/')) assetURL.pathname += 'index.html';
  let response = await env.ASSETS.fetch(new Request(assetURL, request));
  if (response.status === 404) {
    const fallback = new URL('/404.html', url);
    const result = await env.ASSETS.fetch(new Request(fallback, request));
    return new Response(result.body, { status: 404, headers: result.headers });
  }
  if (path === '/references/' && env.DB && request.method === 'GET') {
    const refs = await publicReferences(env);
    if (refs.length) {
      response = new HTMLRewriter()
        .on('#approved-references', {
          element(e) {
            e.setInnerContent(refs.map(referenceHTML).join(''), { html: true });
            e.setAttribute('data-rendered', 'true');
          },
        })
        .on('#references-empty', {
          element(e) {
            e.setAttribute('hidden', '');
          },
        })
        .transform(response);
      const headers = new Headers(response.headers);
      headers.set('Cache-Control', 'no-store');
      response = new Response(response.body, { status: response.status, headers });
    }
  }
  return response;
}
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    try {
      return secure(await route(request, env, ctx), request, env);
    } catch (error) {
      const status =
        error instanceof HttpError ? error.status : error instanceof InputError ? 400 : 500;
      if (status === 500) console.error('Request failed', { path: new URL(request.url).pathname });
      return secure(
        json(
          {
            ok: false,
            error:
              status === 500
                ? 'The request could not be completed. Please try again or email hello@shemarmarks.com.'
                : (error as Error).message,
          },
          status,
        ),
        request,
        env,
      );
    }
  },
  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(
      (async () => {
        await processOutbox(env);
        await env.DB.prepare('DELETE FROM rate_limits WHERE expires<?')
          .bind(Math.floor(Date.now() / 1000))
          .run();
      })(),
    );
  },
};
