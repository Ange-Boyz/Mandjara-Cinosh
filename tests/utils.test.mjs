import test from 'node:test';
import assert from 'node:assert/strict';
import {
  cleanText, normalizePhone, validateName, validatePhone, validateEmail,
  validateMessage, validateQuantity, REFERENCE_RE, TOKEN_RE,
} from '../src/utils/validators.js';
import { safeHttpsUrl, safeMapEmbedUrl, isAllowedOrigin } from '../src/utils/url.js';
import { describeScreening } from '../src/utils/screening.js';
import { esc } from '../src/utils/ics.js';

test('cleanText strips control characters, collapses spaces, enforces length', () => {
  assert.equal(cleanText('  a\u0000b \t  c  '), 'ab c');
  assert.equal(cleanText('x'.repeat(600), 10).length, 10);
  assert.equal(cleanText(null), '');
});

test('phone numbers normalise to +237 and reject non-Cameroon mobiles', () => {
  assert.equal(normalizePhone('671 234 567'), '+237671234567');
  assert.equal(normalizePhone('+237 6 71 23 45 67'), '+237671234567');
  assert.equal(normalizePhone('00237671234567'), '+237671234567');
  assert.equal(normalizePhone('12345'), null);
  assert.equal(normalizePhone('571234567'), null);
  assert.equal(validatePhone(''), 'Please enter your phone number.');
  assert.equal(validatePhone('671234567'), '');
});

test('names accept accents and apostrophes, reject markup and digits', () => {
  assert.equal(validateName('Élise Okumo'), '');
  assert.equal(validateName("Ange O'Brien-Tchomakam"), '');
  assert.notEqual(validateName('<script>alert(1)</script>'), '');
  assert.notEqual(validateName('A'), '');
  assert.notEqual(validateName('R2D2'), '');
  assert.notEqual(validateName(''), '');
});

test('email validation', () => {
  assert.equal(validateEmail('ange@example.com'), '');
  for (const bad of ['', 'nope', 'a@b', 'a b@c.com', '<x>@y.com', 'a@b.c'])
    assert.notEqual(validateEmail(bad), '', bad);
});

test('message and quantity validation', () => {
  assert.notEqual(validateMessage('short'), '');
  assert.equal(validateMessage('This is long enough.'), '');
  assert.equal(validateQuantity(2, 6), '');
  assert.notEqual(validateQuantity(0, 6), '');
  assert.notEqual(validateQuantity(7, 6), '');
  assert.notEqual(validateQuantity(1.5, 6), '');
  assert.notEqual(validateQuantity('2', 6), '');
});

test('reference and token formats', () => {
  assert.ok(REFERENCE_RE.test('MJ-2026-00421'));
  assert.ok(!REFERENCE_RE.test('MJ-2026-421'));
  assert.ok(!REFERENCE_RE.test('../../etc/passwd'));
  assert.ok(TOKEN_RE.test('im4v6MHU4uK5JvXEqp3MwRrE9jLlrdU3'));
  assert.ok(!TOKEN_RE.test('short'));
  assert.ok(!TOKEN_RE.test('has spaces in it and is long enough!!'));
});

test('safeHttpsUrl only lets absolute https URLs through', () => {
  assert.equal(safeHttpsUrl('https://example.com/a'), 'https://example.com/a');
  for (const bad of ['javascript:alert(1)', 'data:text/html,x', 'http://example.com', '/relative', '', null, 42])
    assert.equal(safeHttpsUrl(bad), '', String(bad));
  assert.equal(safeHttpsUrl('https://x.com/' + 'a'.repeat(3000)), '');
});

test('map embeds and payment redirects are allow-listed', () => {
  assert.notEqual(safeMapEmbedUrl('https://www.openstreetmap.org/export/embed.html?bbox=1'), '');
  assert.equal(safeMapEmbedUrl('https://evil.example/embed'), '');
  assert.equal(isAllowedOrigin('https://pay.good.com/x', ['https://pay.good.com']), true);
  assert.equal(isAllowedOrigin('https://pay.good.com.evil.io/x', ['https://pay.good.com']), false);
  assert.equal(isAllowedOrigin('https://pay.good.com/x', []), false);
});

test('describeScreening derives UI state from real data only', () => {
  const soon = new Date(Date.now() + 3 * 864e5).toISOString();
  const base = { status: 'PUBLISHED', startsAt: soon, capacity: 50, seatsRemaining: 12 };
  assert.deepEqual(
    (({ canBook, soldOut, low }) => ({ canBook, soldOut, low }))(describeScreening(base)),
    { canBook: true, soldOut: false, low: true },
  );
  assert.equal(describeScreening({ ...base, seatsRemaining: 40 }).low, false);
  assert.equal(describeScreening({ ...base, seatsRemaining: 0 }).soldOut, true);
  assert.equal(describeScreening({ ...base, seatsRemaining: 0 }).canBook, false);
  assert.equal(describeScreening({ ...base, status: 'CANCELLED' }).cancelled, true);
  const past = new Date(Date.now() - 6 * 3600e3).toISOString();
  assert.equal(describeScreening({ ...base, startsAt: past }).canBook, false);
  assert.deepEqual(describeScreening(null), {});
});

test('ICS escaping prevents line injection and escapes separators', () => {
  assert.equal(esc('a,b;c\\d'), 'a\\,b\\;c\\\\d');
  assert.equal(esc('line1\r\nBEGIN:VEVENT'), 'line1\\nBEGIN:VEVENT');
});
