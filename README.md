# Mandjara Cinosh — public website (V1.1)

React front end for **Mandjara Cinosh**, a weekly cultural cinema in Buea, Cameroon.
Model: **1 week = 1 event = 1 film.** The site is built around one idea, *The Next Mandjara*,
and one goal: turn a visitor into a participant at the next screening.

Scope of this repository: the **public user website** only. The admin dashboard, the real
API and the payment integration are separate work (the contract is below).

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173, uses the built-in MOCK backend
npm test           # unit tests (Node's built-in runner, no extra dependencies)
npm run build      # production build in dist/
npm run preview
```

Requires Node 20+.

### Demo mode
With no `VITE_API_BASE_URL` the dev server uses `src/services/mockBackend.js` and shows a red
"DEMO MODE" banner on every page. A **production build never uses the mock** unless
`VITE_USE_MOCK=true` is set explicitly. Without an API it shows a clear "booking service is not
configured" message instead of pretending to work.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Conversion landing page: hero, countdown, what is Mandjara, the 5-step experience, this weekend's experience, 3 reasons, location, closing CTA |
| `/next-screening`, `/screening/:slug` | The event page: film, event details, ritual, location, after-the-event memory (photos, feedback, vote) |
| `/ticket` | Booking: ticket quantity, details, payment method, live summary |
| `/ticket/:reference` | Confirmation and QR ticket (add to calendar, print, copy private link, WhatsApp invite) |
| `/about`, `/faq`, `/contact`, `/privacy` | Story and ritual, FAQ, contact form, privacy notice |

Repeated CTAs follow the brief: **Get your ticket → I'm in → Join the screening → See you at Mandjara.**
Seat scarcity ("Only 12 seats left") is shown **only from real server data**, never invented.
Booking is by **quantity** (V1.1); seat selection is planned for V1.2.

## Brand implementation
Tokens, fonts and the mark come straight from the brand book: Bistre Soil `#1B0F07`,
Aureolin Gold `#F0B429`, Terracotta Ember `#D95A3B`, Raffia Cream `#F3E6C6`, Baobab Leaf `#0E3F37`;
Yeseva One (display), Orbitron (labels, showtimes), Work Sans (body). The logo is an inline SVG
component (`src/components/Mark.jsx`) that inherits `currentColor`, following the brand book's
clear-space and minimum-size rules. Gold is used sparingly; no glassmorphism, no card walls.
Textile and sprocket motifs are used only as dividers and edges.

## Backend contract
The front end never decides price, capacity, payment status or ticket validity. It expects:

| Method and path | Request / response |
| --- | --- |
| `GET /v1/screenings/next` | Returns `id`, `slug`, `title`, `tagline`, `synopsis`, `theme`, `proverb`, `genre`, `runtimeMinutes`, `rating`, `trailerUrl`, `posterUrl`, `startsAt`, `doorsOpenAt` (ISO 8601), `venue`, `address`, `neighbourhood`, `city`, `accessNotes`, `capacity`, `seatsSold`, `seatsRemaining`, `ticketPrice`, `currency`, `preludeNote`, `circleNote`, `status`, `photos` |
| `POST /v1/bookings` | Body: `screeningId`, `quantity`, `customer { fullName, phone, email }`, `paymentMethod` (`MOBILE_MONEY` or `CARD`), `idempotencyKey` (also sent as the `Idempotency-Key` header). **No price in the body.** Returns `reference`, `accessToken`, `paymentStatus`, and optionally `checkoutUrl` for a hosted payment page. Errors: `422` with `fieldErrors`, `409` when sold out |
| `GET /v1/bookings/:reference` | Header `Authorization: Bearer <accessToken>`. Returns `paymentStatus`, `ticketStatus`, `quantity`, `amount`, `currency`, `customerName`, `screening { title, startsAt, doorsOpenAt, venue, address, city }`, and `qrToken` **only after payment is verified**. Return the same `404` for a missing booking and a wrong token so references cannot be enumerated |
| `POST /v1/votes` | `{ screeningId, theme }` |
| `POST /v1/feedback` | `{ screeningId, rating, comment }` |
| `POST /v1/contact` | `{ name, email, message }` |

Statuses follow the spec: Screening `DRAFT/PUBLISHED/SOLD_OUT/COMPLETED/CANCELLED`,
Payment `PENDING/SUCCESS/FAILED/REFUNDED`, Ticket `VALID/USED/CANCELLED`.

## Security model
- **Server is the authority.** Client validation is a UX aid. The server must re-validate,
  price the order, enforce capacity, de-duplicate on `Idempotency-Key`, and confirm payment with the
  provider. The confirmation page polls the server and **never treats the browser's return from a payment page as proof of payment.**
- **No secrets in the bundle** (`VITE_*` values are public). No cookies are used (`credentials: 'omit'`), so there is no CSRF surface.
- **Access token in a header**, not the URL query, so it stays out of server logs. The share link keeps it in the URL *fragment*, which is never sent to the server.
- **QR codes carry only an opaque server-issued token**, never personal data or the booking reference.
- **XSS:** React escaping everywhere; no `dangerouslySetInnerHTML`, `innerHTML` or `eval`.
  Every URL from the API passes through `safeHttpsUrl`, which accepts absolute `https:` only. Map embeds are limited to OpenStreetMap and payment redirects to the origins listed in `VITE_PAYMENT_ORIGINS`.
- **Headers:** strict CSP, HSTS, `nosniff`, `frame-ancestors 'none'`, Referrer-Policy and Permissions-Policy are in `public/_headers` (Netlify/Cloudflare) and `vercel.json`. Set your real API origin in the `connect-src` of whichever you use, and enable HTTPS-only.
- **Hardened HTTP client** (`src/services/http.js`): JSON only, 15 s timeout, rate-limit aware, and raw server errors are never shown to users.
- Source maps are disabled in production builds.

## Performance
Landing page in the main bundle, every other route lazy-loaded; no UI library; one small icon set;
CSS is hand-written and split by area; reveal animations respect `prefers-reduced-motion`.
Built for average mobile connections in Cameroon, not fibre.

## Before going live
1. Set `VITE_API_BASE_URL` (HTTPS) and `VITE_PAYMENT_ORIGINS`; update `connect-src` in `public/_headers` / `vercel.json`.
2. Replace the venue, coordinates and map embed in the screening data; add real posters and event photography.
3. Add a canonical `<link>` and absolute `og:image` URL once the domain is known.
4. Add the real social links (Instagram / TikTok / WhatsApp) in `src/config/site.js`.
5. Have the privacy notice reviewed against local data-protection requirements.
