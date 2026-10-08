// Every URL that arrives from the API and ends up in the DOM goes through here.
// Only absolute https URLs are accepted: no javascript:, data:, http: or relative paths.

export function safeHttpsUrl(value) {
  if (typeof value !== 'string' || value.length > 2048) return '';
  try {
    const u = new URL(value.trim());
    return u.protocol === 'https:' ? u.href : '';
  } catch {
    return '';
  }
}

/** Map embeds are only accepted from OpenStreetMap (the one frame-src in our CSP). */
export function safeMapEmbedUrl(value) {
  const href = safeHttpsUrl(value);
  if (!href) return '';
  const { hostname } = new URL(href);
  return hostname === 'www.openstreetmap.org' ? href : '';
}

export function isAllowedOrigin(value, allowed) {
  const href = safeHttpsUrl(value);
  if (!href) return false;
  return allowed.includes(new URL(href).origin);
}
