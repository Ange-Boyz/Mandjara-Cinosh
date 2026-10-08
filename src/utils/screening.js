// One place that turns the API's screening object into UI decisions.
export function describeScreening(s) {
  if (!s) return {};
  const remaining = Number.isFinite(s.seatsRemaining) ? s.seatsRemaining : 0;
  // Safety net if the server has not flipped the status yet: 4 hours after the start, it is over.
  const ended = Number.isFinite(Date.parse(s.startsAt)) && Date.now() > Date.parse(s.startsAt) + 4 * 3600 * 1000;
  const soldOut = s.status === 'SOLD_OUT' || (s.status === 'PUBLISHED' && remaining <= 0);
  return {
    canBook: !ended && s.status === 'PUBLISHED' && remaining > 0,
    soldOut,
    completed: ended || s.status === 'COMPLETED',
    cancelled: s.status === 'CANCELLED',
    // "Low" is real data only: a quarter of capacity (min 5 seats) or fewer.
    low: !soldOut && remaining > 0 && remaining <= Math.max(5, Math.ceil((s.capacity || 0) * 0.25)),
  };
}

export function newIdempotencyKey() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  const a = new Uint8Array(16);
  window.crypto.getRandomValues(a);
  return Array.from(a, (b) => b.toString(16).padStart(2, '0')).join('');
}
