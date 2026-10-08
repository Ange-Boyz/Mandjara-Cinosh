// Client-side validation is a UX aid ONLY. The server must re-validate every
// field, compute prices, and enforce capacity. Nothing here is trusted.

const NAME_RE = /^[\p{L}][\p{L}\p{M}' .-]{1,79}$/u;
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
const CM_MOBILE_RE = /^6\d{8}$/; // Cameroon mobile numbers: 9 digits starting with 6

/** Strip control characters and collapse whitespace. */
export function cleanText(value, maxLength = 500) {
  return String(value ?? '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/[ \t]+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

/** Normalise a Cameroon number to "+237XXXXXXXXX", or return null. */
export function normalizePhone(raw) {
  const digits = String(raw ?? '').replace(/[\s().-]/g, '');
  const local = digits.replace(/^(\+|00)?237/, '');
  return CM_MOBILE_RE.test(local) ? `+237${local}` : null;
}

export function validateName(v) {
  const s = cleanText(v, 80);
  if (!s) return 'Please enter your full name.';
  if (!NAME_RE.test(s)) return 'Use letters only (2–80 characters).';
  return '';
}

export function validatePhone(v) {
  if (!String(v ?? '').trim()) return 'Please enter your phone number.';
  return normalizePhone(v) ? '' : 'Enter a valid Cameroon mobile number, e.g. 6XX XXX XXX.';
}

export function validateEmail(v) {
  const s = cleanText(v, 254);
  if (!s) return 'Please enter your email.';
  return EMAIL_RE.test(s) ? '' : 'Enter a valid email address.';
}

export function validateMessage(v) {
  const s = cleanText(v, 2000);
  if (s.length < 10) return 'Please write at least 10 characters.';
  return '';
}

export function validateQuantity(q, max) {
  if (!Number.isInteger(q) || q < 1) return 'Choose at least 1 ticket.';
  if (q > max) return `You can book up to ${max} tickets.`;
  return '';
}

/** Booking reference format issued by the server, e.g. MJ-2026-00421. */
export const REFERENCE_RE = /^MJ-\d{4}-\d{5}$/;
/** Opaque access token (base64url). */
export const TOKEN_RE = /^[A-Za-z0-9_-]{20,128}$/;
