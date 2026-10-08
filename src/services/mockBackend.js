// DEVELOPMENT / DEMO ONLY.
// A stand-in for the Mandjara API so the front end can be built and reviewed
// without a server. It mirrors the contract in README.md, including the rule
// that PAYMENT STATUS IS DECIDED BY THE "SERVER", never by the browser.
// State lives in localStorage and is NOT secure. Never enable in production.

import { ApiError } from './http.js';
import { BOOKING_LIMITS } from '../config/site.js';
import {
  cleanText,
  normalizePhone,
  validateEmail,
  validateName,
  validateQuantity,
  validateMessage,
} from '../utils/validators.js';

const DB_KEY = 'mj_mock_db_v1';
const latency = (ms = 350) => new Promise((r) => setTimeout(r, ms));

function randomToken(bytes = 24) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return btoa(String.fromCharCode(...arr)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function loadDb() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* fall through */
  }
  return { seq: 420, bookings: {}, idempotency: {}, votes: {}, feedback: [] };
}
function saveDb(db) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    /* storage may be unavailable (private mode) */
  }
}

const BASE_SOLD = 38; // seats already sold before this session

function baseScreening() {
  return {
    id: 'scr_2026_10_17',
    slug: 'My Village People',
    title: 'My Village People',
    tagline: 'Some stories are better experienced together.',
    synopsis:
      'A young teacher arrives in a village determined to change how its school is run, and discovers that the village has its own ideas about what a good education is. A story about learning, authority and who decides what a community teaches its children.',
    theme: 'Education, tradition and change',
    proverb: 'It takes a village to raise a child.',
    genre: 'Drama',
    runtimeMinutes: 93,
    rating: 'PG',
    trailerUrl: '',
    posterUrl: 'https://africanvibes.storage.googleapis.com/wp-content/uploads/2022/08/04004724/my-village-people-820x1025.jpg',
    startsAt: '2026-10-17T18:00:00+01:00',
    doorsOpenAt: '2026-10-17T17:00:00+01:00',
    venue: 'Mandjara Screening Hall',
    address: 'Molyko Road',
    neighbourhood: 'Molyko',
    city: 'Buea',
    accessNotes: 'Ask for Molyko in Buea. Doors open at 17:00, an hour before the film, so you can settle in.',
    capacity: 50,
    ticketPrice: 3000,
    currency: 'FCFA',
    preludeNote: 'Spoken word and acoustic music from young artists chosen by the Mandjara team.',
    circleNote: 'The Mandjara Circle: a moderated conversation with everyone in the room about what the film stirred up.',
    status: 'PUBLISHED',
    photos: [],
  };
}

function seatsSold(db) {
  const confirmed = Object.values(db.bookings).filter((b) => b.settled === 'SUCCESS');
  return BASE_SOLD + confirmed.reduce((n, b) => n + b.quantity, 0);
}

export const mock = {
  async getNextScreening() {
    await latency();
    const db = loadDb();
    const s = baseScreening();
    // Dev-only preview of the other lifecycle states: ?mock_status=COMPLETED
    const override = new URLSearchParams(window.location.search).get('mock_status');
    if (['DRAFT', 'PUBLISHED', 'SOLD_OUT', 'COMPLETED', 'CANCELLED'].includes(override)) s.status = override;
    const sold = override === 'SOLD_OUT' ? s.capacity : seatsSold(db);
    s.seatsSold = Math.min(sold, s.capacity);
    s.seatsRemaining = Math.max(s.capacity - s.seatsSold, 0);
    if (s.seatsRemaining === 0 && s.status === 'PUBLISHED') s.status = 'SOLD_OUT';
    return s;
  },

  async createBooking({ screeningId, quantity, customer, paymentMethod, idempotencyKey }) {
    await latency(600);
    const db = loadDb();

    // Idempotency: a double click / retry returns the same booking, never a second one.
    if (idempotencyKey && db.idempotency[idempotencyKey]) {
      const existing = db.bookings[db.idempotency[idempotencyKey]];
      return { reference: existing.reference, accessToken: existing.accessToken, paymentStatus: 'PENDING' };
    }

    // Server-side re-validation of EVERYTHING.
    const s = baseScreening();
    if (screeningId !== s.id) throw new ApiError('This screening is no longer available.', { status: 404, code: 'NOT_FOUND' });
    const fieldErrors = {};
    const qErr = validateQuantity(quantity, BOOKING_LIMITS.maxPerBooking);
    if (qErr) fieldErrors.quantity = qErr;
    const nErr = validateName(customer?.fullName);
    if (nErr) fieldErrors.fullName = nErr;
    const phone = normalizePhone(customer?.phone);
    if (!phone) fieldErrors.phone = 'Enter a valid Cameroon mobile number.';
    const eErr = validateEmail(customer?.email);
    if (eErr) fieldErrors.email = eErr;
    if (!['MOBILE_MONEY', 'CARD'].includes(paymentMethod)) fieldErrors.paymentMethod = 'Choose a payment method.';
    if (Object.keys(fieldErrors).length) {
      throw new ApiError('Please check the highlighted fields.', { status: 422, code: 'VALIDATION', fieldErrors });
    }

    const sold = seatsSold(db);
    const pendingQty = Object.values(db.bookings)
      .filter((b) => !b.settled)
      .reduce((n, b) => n + b.quantity, 0);
    if (sold + pendingQty + quantity > s.capacity) {
      throw new ApiError('Not enough seats left for that many tickets.', { status: 409, code: 'SOLD_OUT' });
    }

    db.seq += 1;
    const reference = `MJ-2026-${String(db.seq).padStart(5, '0')}`;
    const booking = {
      reference,
      accessToken: randomToken(),
      qrToken: randomToken(32), // unpredictable, not derived from any visible value
      screeningId,
      quantity,
      amount: quantity * s.ticketPrice, // computed server-side, never taken from the client
      customer: { fullName: cleanText(customer.fullName, 80), phone, email: cleanText(customer.email, 254) },
      paymentMethod,
      createdAt: Date.now(),
      settled: null,
    };
    db.bookings[reference] = booking;
    if (idempotencyKey) db.idempotency[idempotencyKey] = reference;
    saveDb(db);
    return { reference, accessToken: booking.accessToken, paymentStatus: 'PENDING' };
  },

  async getBooking(reference, token) {
    await latency(250);
    const db = loadDb();
    const b = db.bookings[reference];
    // Same error for "missing" and "wrong token" so references cannot be enumerated.
    if (!b || b.accessToken !== token) throw new ApiError('Booking not found.', { status: 404, code: 'NOT_FOUND' });

    // Simulated payment provider webhook, resolved ~3.5s after creation.
    if (!b.settled && Date.now() - b.createdAt > 3500) {
      b.settled = b.customer.phone.endsWith('000') ? 'FAILED' : 'SUCCESS'; // ...000 = test failure
      saveDb(db);
    }
    const s = baseScreening();
    const paid = b.settled === 'SUCCESS';
    return {
      reference: b.reference,
      paymentStatus: b.settled || 'PENDING',
      ticketStatus: paid ? 'VALID' : null,
      quantity: b.quantity,
      amount: b.amount,
      currency: s.currency,
      customerName: b.customer.fullName,
      qrToken: paid ? b.qrToken : null, // only released after verified payment
      screening: {
        title: s.title,
        startsAt: s.startsAt,
        doorsOpenAt: s.doorsOpenAt,
        venue: s.venue,
        address: s.address,
        city: s.city,
      },
    };
  },

  async submitVote({ screeningId, theme }) {
    await latency();
    const db = loadDb();
    db.votes[theme] = (db.votes[theme] || 0) + 1;
    saveDb(db);
    return { ok: true, screeningId };
  },

  async submitFeedback({ screeningId, rating, comment }) {
    await latency();
    const db = loadDb();
    db.feedback.push({ screeningId, rating, comment: cleanText(comment, 1000), at: Date.now() });
    saveDb(db);
    return { ok: true };
  },

  async sendContact({ name, email, message }) {
    await latency(500);
    const err = {};
    if (validateName(name)) err.name = validateName(name);
    if (validateEmail(email)) err.email = validateEmail(email);
    if (validateMessage(message)) err.message = validateMessage(message);
    if (Object.keys(err).length) throw new ApiError('Please check the highlighted fields.', { status: 422, code: 'VALIDATION', fieldErrors: err });
    return { ok: true };
  },
};
