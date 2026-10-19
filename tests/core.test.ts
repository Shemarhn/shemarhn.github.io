import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import worker, { processOutbox } from '../worker/index.ts';
import { publicReference, validateModeration } from '../worker/validation.ts';
import { emailText } from '../worker/integrations.ts';
import { SignJWT, generateKeyPair, exportJWK } from 'jose';
import type { Env, Lead } from '../worker/types.ts';
function database() {
  const db = new DatabaseSync(':memory:');
  db.exec(readFileSync(new URL('../migrations/0001_initial.sql', import.meta.url), 'utf8'));
  return db;
}
function adapter(db: DatabaseSync) {
  const wrapper = {
    prepare(sql: string) {
      let args: unknown[] = [];
      const statement = {
        bind(...values: unknown[]) {
          args = values;
          return statement;
        },
        async first() {
          return db.prepare(sql).get(...(args as never[])) || null;
        },
        async all() {
          return { results: db.prepare(sql).all(...(args as never[])), success: true };
        },
        async run() {
          const result = db.prepare(sql).run(...(args as never[]));
          return { success: true, meta: { changes: result.changes } };
        },
      };
      return statement;
    },
    async batch(statements: { run: () => Promise<unknown> }[]) {
      db.exec('BEGIN');
      try {
        const results = [];
        for (const s of statements) results.push(await s.run());
        db.exec('COMMIT');
        return results;
      } catch (e) {
        db.exec('ROLLBACK');
        throw e;
      }
    },
  };
  return wrapper as unknown as D1Database;
}
const baseLead = {
  name: 'Test Person',
  email: 'test@example.com',
  company: 'Example',
  website: 'https://example.com',
  service: 'Website Development',
  description: 'A new website with durable inquiries and booking integration.',
  timeline: 'Just exploring',
  budget: '',
  privacy: true,
  metadata: {
    page: '/contact/',
    cta: 'Website panel',
    source: 'Website',
    campaign: 'Want a Website Like This CTA',
  },
};
const reference = {
  name: 'Test Client',
  email: 'private@example.com',
  company: 'Private Company',
  title: 'Director',
  service: 'Documentation',
  quote: 'The technical review gave the team a clear and useful implementation handover.',
  project_value: 'USD 500',
  identity_consent: false,
  value_consent: false,
  privacy: true,
};
function setup() {
  const db = database();
  const env = {
    APP_ENV: 'development',
    LOCAL_FORM_TESTING: 'true',
    IP_HASH_SALT: 'test-only',
    DB: adapter(db),
    ASSETS: {
      fetch: async () =>
        new Response('<html><body>static</body></html>', {
          headers: { 'Content-Type': 'text/html' },
        }),
    },
  } as unknown as Env;
  const tasks: Promise<unknown>[] = [];
  const ctx = {
    waitUntil(p: Promise<unknown>) {
      tasks.push(p);
    },
  } as ExecutionContext;
  return { db, env, ctx, tasks };
}
async function submit(
  s: ReturnType<typeof setup>,
  path = '/api/inquiries',
  payload: unknown = { ...baseLead, requestId: crypto.randomUUID() },
  options: { origin?: string; env?: Partial<Env>; headers?: Record<string, string> } = {},
) {
  return worker.fetch(
    new Request(`http://localhost:4321${path}`, {
      method: 'POST',
      headers: {
        Origin: options.origin || 'http://localhost:4321',
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(payload),
    }),
    { ...s.env, ...options.env },
    s.ctx,
  );
}
test('an inquiry is durably saved with two independent outbox jobs before acknowledgment', async () => {
  const s = setup();
  const r = await submit(s);
  assert.equal(r.status, 201);
  assert.equal((await r.json()).ok, true);
  assert.equal(s.db.prepare('SELECT count(*) n FROM inquiries').get()!.n, 1);
  assert.equal(s.db.prepare('SELECT count(*) n FROM outbox').get()!.n, 2);
  await Promise.all(s.tasks);
  const jobs = s.db.prepare('SELECT * FROM outbox').all();
  assert.ok(jobs.every((j) => j.status === 'pending' && j.attempts === 0));
  s.db.close();
});
test('a lost acknowledgment can be retried without duplicate leads or jobs', async () => {
  const s = setup();
  const payload = { ...baseLead, requestId: crypto.randomUUID() };
  assert.equal((await submit(s, '/api/inquiries', payload)).status, 201);
  assert.equal((await submit(s, '/api/inquiries', payload)).status, 200);
  await Promise.all(s.tasks);
  assert.equal(s.db.prepare('SELECT count(*) n FROM inquiries').get()!.n, 1);
  assert.equal(s.db.prepare('SELECT count(*) n FROM outbox').get()!.n, 2);
  s.db.close();
});
test('cross-origin submissions and invalid email are rejected', async () => {
  const s = setup();
  assert.equal(
    (await submit(s, '/api/inquiries', undefined, { origin: 'https://evil.example' })).status,
    403,
  );
  assert.equal(
    (
      await submit(s, '/api/inquiries', {
        ...baseLead,
        email: 'a\r\nBcc: victim@example.com',
        requestId: crypto.randomUUID(),
      })
    ).status,
    400,
  );
  assert.equal(s.db.prepare('SELECT count(*) n FROM inquiries').get()!.n, 0);
  s.db.close();
});
test('production cannot use the local spam bypass or silently accept missing configuration', async () => {
  const s = setup();
  const r = await submit(s, '/api/inquiries', undefined, {
    env: { APP_ENV: 'production', LOCAL_FORM_TESTING: 'true' },
  });
  assert.equal(r.status, 503);
  assert.equal(s.db.prepare('SELECT count(*) n FROM inquiries').get()!.n, 0);
  s.db.close();
});
test('Turnstile verifies both hostname and action server-side', async () => {
  const s = setup();
  const original = globalThis.fetch;
  globalThis.fetch = async () =>
    Response.json({ success: true, hostname: 'evil.example', action: 'inquiry' });
  try {
    const r = await submit(
      s,
      '/api/inquiries',
      { ...baseLead, requestId: crypto.randomUUID(), 'cf-turnstile-response': 'test' },
      {
        env: {
          LOCAL_FORM_TESTING: 'false',
          TURNSTILE_SECRET_KEY: 'test',
          TURNSTILE_HOSTNAMES: 'localhost',
        },
      },
    );
    assert.equal(r.status, 400);
  } finally {
    globalThis.fetch = original;
    s.db.close();
  }
});
test('a failed database transaction never produces a successful receipt', async () => {
  const s = setup();
  const broken = {
    ...s.env.DB,
    batch: async () => {
      throw Error('simulated outage');
    },
  } as D1Database;
  const r = await submit(s, '/api/inquiries', undefined, { env: { DB: broken } });
  assert.equal(r.status, 500);
  assert.equal((await r.json()).ok, false);
  s.db.close();
});
test('oversized submissions are rejected and form attempts are bounded', async () => {
  const s = setup();
  assert.equal(
    (
      await submit(s, '/api/inquiries', {
        ...baseLead,
        description: 'x'.repeat(25000),
        requestId: crypto.randomUUID(),
      })
    ).status,
    413,
  );
  for (let i = 0; i < 5; i++)
    await submit(s, '/api/inquiries', {
      ...baseLead,
      email: 'invalid',
      requestId: crypto.randomUUID(),
    });
  assert.equal((await submit(s)).status, 429);
  s.db.close();
});
test('public references always start pending; forged approval fields have no effect', async () => {
  const s = setup();
  const r = await submit(s, '/api/testimonials', {
    ...reference,
    requestId: crypto.randomUUID(),
    status: 'approved',
    verified: true,
    show_value: true,
    owner_value_authorized: true,
  });
  assert.equal(r.status, 201);
  const saved = s.db.prepare('SELECT * FROM testimonials').get()!;
  assert.equal(saved.status, 'pending');
  assert.equal(saved.show_value, 0);
  assert.equal(saved.verified, 0);
  assert.equal(saved.owner_value_authorized, 0);
  const publicResult = await worker.fetch(
    new Request('http://localhost:4321/api/testimonials'),
    s.env,
    s.ctx,
  );
  assert.deepEqual((await publicResult.json()).testimonials, []);
  s.db.close();
});
test('public projection excludes private email and unconsented identity and value', () => {
  const result = publicReference({
    ...reference,
    status: 'approved',
    identity_consent: 0,
    value_consent: 0,
    show_value: 1,
    source: 'public',
    owner_value_authorized: 1,
  });
  assert.equal(result!.name, 'Client reference');
  assert.equal(result!.company, '');
  assert.equal(result!.public_value, '');
  assert.ok(!('email' in result!));
  assert.equal(publicReference({ ...reference, status: 'pending' }), null);
});
test('commercial publication requires consent or authorization on an admin entry, plus display approval', () => {
  const row = {
    ...reference,
    status: 'approved',
    value_consent: 0,
    source: 'public',
    owner_value_authorized: 1,
  };
  assert.throws(() =>
    validateModeration({ status: 'approved', quote: reference.quote, show_value: true }, row),
  );
  assert.equal(publicReference({ ...row, source: 'admin', show_value: 0 })!.public_value, '');
  assert.equal(
    publicReference({ ...row, source: 'admin', show_value: 1 })!.public_value,
    'USD 500',
  );
  assert.equal(
    publicReference({ ...row, value_consent: 1, show_value: 1 })!.public_value,
    'USD 500',
  );
});
test('database enforces the project-value permission boundary', () => {
  const db = database();
  assert.throws(() =>
    db
      .prepare(
        "INSERT INTO testimonials(id,name,service,quote,show_value) VALUES('x','Client','Test','A sufficiently long quotation for a reference.',1)",
      )
      .run(),
  );
  db.close();
});
test('admin HTML and API fail closed without valid Cloudflare Access identity', async () => {
  const s = setup();
  for (const path of ['/admin/', '/api/admin/testimonials']) {
    let r = await worker.fetch(new Request(`http://localhost:4321${path}`), s.env, s.ctx);
    assert.equal(r.status, 503);
    r = await worker.fetch(
      new Request(`http://localhost:4321${path}`),
      {
        ...s.env,
        ACCESS_TEAM_DOMAIN: 'example.cloudflareaccess.com',
        ACCESS_AUD: 'test',
        ADMIN_EMAILS: 'test@example.com',
      },
      s.ctx,
    );
    assert.equal(r.status, 401);
  }
  s.db.close();
});
test('CRM failure does not repeat a successful acknowledgment email', async () => {
  const s = setup();
  await submit(s);
  await Promise.all(s.tasks);
  s.db.prepare('UPDATE outbox SET next_attempt=0').run();
  const env = {
    ...s.env,
    CRM_API_URL: 'https://crm.example/inquiries',
    CRM_API_TOKEN: 'test',
    RESEND_API_KEY: 'test',
  };
  const original = globalThis.fetch;
  let crm = 0,
    email = 0;
  globalThis.fetch = async (input) => {
    if (String(input).includes('crm.example')) {
      crm++;
      return new Response(null, { status: crm === 1 ? 503 : 200 });
    }
    email++;
    return new Response(null, { status: 200 });
  };
  try {
    await processOutbox(env);
    assert.equal(
      s.db.prepare("SELECT status FROM outbox WHERE kind='email'").get()!.status,
      'delivered',
    );
    assert.equal(
      s.db.prepare("SELECT status FROM outbox WHERE kind='crm'").get()!.status,
      'pending',
    );
    s.db.prepare("UPDATE outbox SET next_attempt=0 WHERE kind='crm'").run();
    await processOutbox(env);
    assert.equal(crm, 2);
    assert.equal(email, 1);
    assert.equal(
      s.db.prepare("SELECT status FROM outbox WHERE kind='crm'").get()!.status,
      'delivered',
    );
  } finally {
    globalThis.fetch = original;
    s.db.close();
  }
});
test('overlapping delivery runners claim each task only once', async () => {
  const s = setup();
  await submit(s);
  await Promise.all(s.tasks);
  s.db.prepare('UPDATE outbox SET next_attempt=0').run();
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    await new Promise((resolve) => setTimeout(resolve, 10));
    return new Response(null, { status: 200 });
  };
  try {
    await Promise.all([
      processOutbox({
        ...s.env,
        CRM_API_URL: 'https://crm.example',
        CRM_API_TOKEN: 'test',
        RESEND_API_KEY: 'test',
      }),
      processOutbox({
        ...s.env,
        CRM_API_URL: 'https://crm.example',
        CRM_API_TOKEN: 'test',
        RESEND_API_KEY: 'test',
      }),
    ]);
    assert.equal(calls, 2);
  } finally {
    globalThis.fetch = original;
    s.db.close();
  }
});
test('permanent downstream rejection enters a visible failed state', async () => {
  const s = setup();
  await submit(s);
  await Promise.all(s.tasks);
  s.db.prepare('UPDATE outbox SET next_attempt=0').run();
  const original = globalThis.fetch;
  globalThis.fetch = async () => new Response(null, { status: 422 });
  try {
    await processOutbox({
      ...s.env,
      CRM_API_URL: 'https://crm.example',
      CRM_API_TOKEN: 'test',
      RESEND_API_KEY: 'test',
    });
    assert.ok(
      s.db
        .prepare('SELECT * FROM outbox')
        .all()
        .every((j) => j.status === 'failed'),
    );
  } finally {
    globalThis.fetch = original;
    s.db.close();
  }
});
test('staging is non-indexable and trailing slash redirects preserve attribution', async () => {
  const s = setup();
  const r = await worker.fetch(
    new Request('http://localhost:4321/services?utm_source=test'),
    s.env,
    s.ctx,
  );
  assert.equal(r.status, 301);
  assert.equal(r.headers.get('Location'), 'http://localhost:4321/services/?utm_source=test');
  assert.match(r.headers.get('X-Robots-Tag')!, /noindex/);
  assert.equal(r.headers.get('X-Content-Type-Options'), 'nosniff');
  s.db.close();
});
test('confirmation is human, replyable, and does not echo private project descriptions', () => {
  const text = emailText(baseLead as Lead);
  assert.match(text, /Hi Test,/);
  assert.match(text, /reply to this email/);
  assert.ok(!text.includes(baseLead.description));
});
test('signed Access identity can create, moderate, and withhold a reference; wrong audience is denied', async () => {
  const s = setup();
  const { privateKey, publicKey } = await generateKeyPair('RS256');
  const key = await exportJWK(publicKey);
  key.kid = 'qa-key';
  key.alg = 'RS256';
  const env = {
    ...s.env,
    ACCESS_TEAM_DOMAIN: 'qa.cloudflareaccess.com',
    ACCESS_AUD: 'qa-audience',
    ADMIN_EMAILS: 'owner@example.com',
  };
  const token = await new SignJWT({ email: 'owner@example.com' })
    .setProtectedHeader({ alg: 'RS256', kid: 'qa-key' })
    .setIssuer('https://qa.cloudflareaccess.com')
    .setAudience('qa-audience')
    .setIssuedAt()
    .setExpirationTime('5m')
    .sign(privateKey);
  const wrong = await new SignJWT({ email: 'owner@example.com' })
    .setProtectedHeader({ alg: 'RS256', kid: 'qa-key' })
    .setIssuer('https://qa.cloudflareaccess.com')
    .setAudience('wrong')
    .setIssuedAt()
    .setExpirationTime('5m')
    .sign(privateKey);
  const original = globalThis.fetch;
  globalThis.fetch = async () => Response.json({ keys: [key] });
  try {
    const call = (path: string, method: string, body?: unknown, jwt = token) =>
      worker.fetch(
        new Request(`http://localhost:4321${path}`, {
          method,
          headers: {
            Origin: 'http://localhost:4321',
            'Content-Type': 'application/json',
            'Cf-Access-Jwt-Assertion': jwt,
          },
          body: body ? JSON.stringify(body) : undefined,
        }),
        env,
        s.ctx,
      );
    assert.equal((await call('/api/admin/testimonials', 'GET', undefined, wrong)).status, 403);
    const created = await call('/api/admin/testimonials', 'POST', {
      ...reference,
      identity_consent: true,
      owner_value_authorized: true,
    });
    assert.equal(created.status, 201);
    const { id } = await created.json();
    let publicResponse = await worker.fetch(
      new Request('http://localhost:4321/api/testimonials'),
      env,
      s.ctx,
    );
    assert.equal((await publicResponse.json()).testimonials.length, 0);
    assert.equal(
      (
        await call(`/api/admin/testimonials/${id}`, 'PATCH', {
          status: 'approved',
          quote: reference.quote,
          show_value: true,
          verified: true,
          case_study: 'northstar',
        })
      ).status,
      200,
    );
    publicResponse = await worker.fetch(
      new Request('http://localhost:4321/api/testimonials'),
      env,
      s.ctx,
    );
    const rows = (await publicResponse.json()).testimonials;
    assert.equal(rows[0].name, 'Test Client');
    assert.equal(rows[0].public_value, 'USD 500');
    assert.ok(!('email' in rows[0]));
    assert.equal(
      (
        await call(`/api/admin/testimonials/${id}`, 'PATCH', {
          status: 'needs_changes',
          quote: reference.quote,
          show_value: false,
        })
      ).status,
      200,
    );
    publicResponse = await worker.fetch(
      new Request('http://localhost:4321/api/testimonials'),
      env,
      s.ctx,
    );
    assert.equal((await publicResponse.json()).testimonials.length, 0);
    assert.equal(s.db.prepare('SELECT count(*) n FROM moderation_audit').get()!.n, 3);
  } finally {
    globalThis.fetch = original;
    s.db.close();
  }
});
