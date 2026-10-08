import { SITE } from '../config/site.js';

const TZ = SITE.timeZone;

export function formatFCFA(amount) {
  return `${new Intl.NumberFormat('en-US').format(amount)} FCFA`;
}

export function formatDate(iso, opts = {}) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...opts,
  }).format(new Date(iso));
}

export function formatDay(iso) {
  return new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'long' }).format(new Date(iso));
}

export function formatShortDate(iso) {
  return new Intl.DateTimeFormat('en-GB', { timeZone: TZ, day: 'numeric', month: 'long' }).format(new Date(iso));
}

export function formatTime(iso) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso));
}

export function mapsDirectionsUrl(venue, address, city) {
  const q = encodeURIComponent([venue, address, city, 'Cameroon'].filter(Boolean).join(', '));
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}
