// Single entry point for all data access. Components never call fetch directly.
// Contract (see README): the server is the only authority on price, capacity,
// payment status and ticket validity.

import { USE_MOCK } from '../config/site.js';
import { http } from './http.js';
import { mock } from './mockBackend.js';

const enc = encodeURIComponent;

const real = {
  getNextScreening: (signal) => http('/v1/screenings/next', { signal }),

  // The client sends quantity only. Price is computed on the server.
  createBooking: (payload) =>
    http('/v1/bookings', { method: 'POST', body: payload, headers: { 'Idempotency-Key': payload.idempotencyKey } }),

  // Access token travels in a header, not in the URL, so it never lands in server logs.
  getBooking: (reference, token, signal) =>
    http(`/v1/bookings/${enc(reference)}`, { signal, headers: { Authorization: `Bearer ${token}` } }),

  submitVote: (payload) => http('/v1/votes', { method: 'POST', body: payload }),
  submitFeedback: (payload) => http('/v1/feedback', { method: 'POST', body: payload }),
  sendContact: (payload) => http('/v1/contact', { method: 'POST', body: payload }),
};

export const api = USE_MOCK ? mock : real;
export const isMockBackend = USE_MOCK;
