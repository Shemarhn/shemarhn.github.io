import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hasLegacyIdentity } from '../scripts/legacy-identity.mjs';

test('production identity verification rejects actual retired portfolio URLs', () => {
  for (const url of [
    'http://shemarhn.github.io/',
    'https://shemarhn.github.io/work/?source=test',
    '//shemarhn.github.io/',
    'https://SHEMARHN.GITHUB.IO/',
    'https://shemarhn.github.io:443/',
    'https://shemarhn.github.io./',
    'https://www.shemarhn.github.io/',
    'https://user@shemarhn.github.io/',
  ]) {
    assert.equal(hasLegacyIdentity(`<a href="${url}">Portfolio</a>`), true, url);
  }
  assert.equal(hasLegacyIdentity('<p>shemarhn.github.io</p>'), true);
});

test('production identity verification still rejects the obsolete email', () => {
  assert.equal(hasLegacyIdentity('<a href="mailto:shemarmarks.tech@gmail.com">Email</a>'), true);
  assert.equal(hasLegacyIdentity('<p>SHEMARMARKS.TECH@GMAIL.COM</p>'), true);
});

test('repository proof URLs do not count as links to the retired portfolio', () => {
  for (const url of [
    'https://github.com/Shemarhn/shemarhn.github.io',
    'https://github.com/Shemarhn/shemarhn.github.io/blob/main/README.md',
    'https://raw.githubusercontent.com/Shemarhn/shemarhn.github.io/main/README.md',
    '//github.com/Shemarhn/shemarhn.github.io',
    'https://github.com/search?q=shemarhn.github.io',
    'https://shemarmarks.com/',
  ]) {
    assert.equal(hasLegacyIdentity(`<a href="${url}">Source evidence</a>`), false, url);
  }
  assert.equal(hasLegacyIdentity('<a href="mailto:hello@shemarmarks.com">Email</a>'), false);
  assert.equal(
    hasLegacyIdentity('<a href="https://shemarhn.github.io.example.com/">Other host</a>'),
    false,
  );
});
