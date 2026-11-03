import { test } from 'node:test';
import assert from 'node:assert/strict';
import { firstTouch, measurementAllowed, trafficChannel } from '../shared/analytics.ts';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';

const origin = 'https://shemarmarks.com';
const params = (value = '') => new URLSearchParams(value);

test('first-touch inquiry source distinguishes search, referrals, direct and explicit campaigns', () => {
  assert.equal(trafficChannel('https://www.google.com/', origin, params()), 'google');
  assert.equal(trafficChannel('https://www.bing.com/', origin, params()), 'bing');
  assert.equal(trafficChannel('https://github.com/Shemarhn', origin, params()), 'referral');
  assert.equal(trafficChannel('', origin, params()), 'direct');
  assert.equal(trafficChannel(`${origin}/pricing/`, origin, params()), 'direct');
  assert.equal(trafficChannel('https://www.google.com/', origin, params('gclid=redacted')), 'paid');
  assert.equal(trafficChannel('https://www.bing.com/', origin, params('utm_medium=cpc')), 'paid');
  assert.equal(
    trafficChannel('', origin, params('utm_source=linkedin&utm_medium=social')),
    'campaign',
  );
  assert.equal(trafficChannel('not-a-url', origin, params()), 'unknown');
});

test('later internal links cannot overwrite first landing, referrer, channel or campaign', () => {
  const first = firstTouch(
    null,
    '/services/linux-systems/',
    'https://www.google.com/',
    origin,
    params('utm_medium=organic&utm_source=google&utm_campaign=initial'),
  );
  const next = firstTouch(
    first,
    '/contact/',
    `${origin}/pricing/`,
    origin,
    params('utm_medium=social&utm_source=linkedin&utm_campaign=later'),
  );
  assert.deepEqual(next, first);
  assert.equal(next.landing_page, '/services/linux-systems/');
  assert.equal(next.traffic_channel, 'google');
  assert.equal(next.utm_campaign, 'initial');
});

test('invalid stored attribution is recoverable and legacy empty channels remain unknown', () => {
  for (const prior of [null, [], 'invalid', 12, { landing_page: 12 }]) {
    assert.equal(firstTouch(prior, '/', '', origin, params()).traffic_channel, 'direct');
  }
  const legacy = firstTouch(
    { landing_page: '/', traffic_channel: '', referrer: '' },
    '/contact/',
    `${origin}/pricing/`,
    origin,
    params(),
  );
  assert.equal(legacy.traffic_channel, 'unknown');
  assert.equal(legacy.referrer, '');
});

test('privacy signals disable optional attribution as well as interaction measurement', () => {
  assert.equal(measurementAllowed(null), true);
  assert.equal(measurementAllowed('1'), false);
  assert.equal(measurementAllowed(null, true), false);
  assert.equal(measurementAllowed(null, false, true), false);
});

test('weekly acquisition SQL keeps complete UTC periods and organic subsets separate', () => {
  const db = new DatabaseSync(':memory:');
  db.exec(readFileSync(new URL('../migrations/0001_initial.sql', import.meta.url), 'utf8'));
  db.exec(`
    INSERT INTO event_counts VALUES(date('now','-7 day'),'page_view','/',10);
    INSERT INTO event_counts VALUES(date('now','-7 day'),'google_organic_page_view','/',3);
    INSERT INTO event_counts VALUES(date('now','-8 day'),'page_view','/',20);
    INSERT INTO event_counts VALUES(date('now'),'page_view','/',99);
    INSERT INTO inquiries VALUES('boundary','{"service":"Linux / Systems","metadata":{"traffic_channel":"google","landing_page":"/services/linux-systems/"}}',strftime('%Y-%m-%dT%H:%M:%fZ','now','start of day','-7 day'));
    INSERT INTO inquiries VALUES('previous','{"service":"Linux / Systems","metadata":{"traffic_channel":"","landing_page":"/"}}',strftime('%Y-%m-%dT%H:%M:%fZ','now','start of day','-8 day'));
    INSERT INTO inquiries VALUES('today','{"service":"Linux / Systems","metadata":{}}',strftime('%Y-%m-%dT%H:%M:%fZ','now','start of day'));
  `);
  const sql = readFileSync(new URL('../scripts/weekly-acquisition.sql', import.meta.url), 'utf8');
  const queries = sql.match(/WITH periods[\s\S]*?;/g)!;
  assert.equal(queries.length, 2);
  const events = db.prepare(queries[0]).all();
  assert.equal(events.find((r) => r.period === 'last_7' && r.event === 'page_view')!.actions, 10);
  assert.equal(
    events.find((r) => r.period === 'last_7' && r.event === 'google_organic_page_view')!.actions,
    3,
  );
  assert.equal(events.find((r) => r.period === 'prior_7' && r.event === 'page_view')!.actions, 20);
  const inquiries = db.prepare(queries[1]).all();
  assert.equal(inquiries.find((r) => r.period === 'last_7')!.saved_inquiries, 1);
  assert.equal(inquiries.find((r) => r.period === 'last_7')!.traffic_channel, 'google');
  assert.equal(
    inquiries.find((r) => r.period === 'prior_7')!.traffic_channel,
    'privacy_or_unknown',
  );
  db.close();
});
