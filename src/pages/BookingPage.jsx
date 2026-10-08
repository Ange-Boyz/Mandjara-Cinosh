import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button.jsx';
import { Eyebrow } from '../components/Eyebrow.jsx';
import { Field } from '../components/Field.jsx';
import { Mark } from '../components/Mark.jsx';
import { QuantityStepper } from '../components/QuantityStepper.jsx';
import { SeatMeter } from '../components/SeatMeter.jsx';
import { BOOKING_LIMITS, PAYMENT_METHODS, PAYMENT_ORIGINS } from '../config/site.js';
import { useScreening } from '../hooks/useScreening.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { api } from '../services/api.js';
import { ApiError } from '../services/http.js';
import { describeScreening, newIdempotencyKey } from '../utils/screening.js';
import { formatDay, formatFCFA, formatShortDate, formatTime } from '../utils/format.js';
import { cleanText, normalizePhone, validateEmail, validateName, validatePhone, validateQuantity } from '../utils/validators.js';
import { isAllowedOrigin } from '../utils/url.js';
import { session } from '../utils/storage.js';

const FIELD_IDS = { quantity: 'bk-qty', fullName: 'bk-name', phone: 'bk-phone', email: 'bk-email' };

function Unavailable({ s, st }) {
  let title = 'Booking is not open right now.';
  let text = 'There is no screening open for reservations at the moment.';
  if (st.soldOut) { title = 'This evening is sold out.'; text = 'Every seat has been taken. Follow us to hear about the next Mandjara.'; }
  if (st.completed) { title = 'This screening has taken place.'; text = 'Thank you to everyone who came. The next evening will be announced soon.'; }
  if (st.cancelled) { title = 'This screening was cancelled.'; text = 'Every booking is refunded in full. We will announce the next evening soon.'; }
  return (
    <section className="container state">
      <Mark className="state__mark" />
      <Eyebrow>{s ? s.title : 'Tickets'}</Eyebrow>
      <h1 className="state__title">{title}</h1>
      <p className="lede">{text}</p>
      <div className="cta-row">
        <Button to="/next-screening" arrow>See the screening</Button>
        <Button to="/contact" variant="secondary">Contact us</Button>
      </div>
    </section>
  );
}

export default function BookingPage() {
  useDocumentTitle('Get your ticket');
  const { phase, screening: s, reload } = useScreening();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [form, setForm] = useState({ fullName: '', phone: '', email: '' });
  const [method, setMethod] = useState(PAYMENT_METHODS[0].id);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false); // synchronous guard: a double click can never send two requests
  const keyRef = useRef(newIdempotencyKey());

  // Any change to the order is a new "intent", hence a new idempotency key.
  // An unchanged retry (after a timeout, say) reuses the key so the server
  // returns the same booking instead of creating a second one.
  const touch = () => { keyRef.current = newIdempotencyKey(); };

  const st = s ? describeScreening(s) : {};
  const max = s ? Math.max(1, Math.min(BOOKING_LIMITS.maxPerBooking, s.seatsRemaining)) : 1;

  useEffect(() => { if (qty > max) setQty(max); }, [max, qty]);

  if (phase === 'loading') {
    return <section className="container state" aria-busy="true"><p role="status" className="muted">Loading…</p></section>;
  }
  if (phase !== 'ready' || !st.canBook) return <Unavailable s={s} st={st} />;

  const total = qty * s.ticketPrice; // display only: the server computes the real amount

  const update = (key) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((prev) => { const { [key]: _drop, ...rest } = prev; return rest; });
    touch();
  };

  function focusFirst(errs) {
    const first = Object.keys(FIELD_IDS).find((k) => errs[k]);
    if (first) requestAnimationFrame(() => document.getElementById(FIELD_IDS[first])?.focus());
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (busyRef.current) return;

    const errs = {};
    const qErr = validateQuantity(qty, max); if (qErr) errs.quantity = qErr;
    const nErr = validateName(form.fullName); if (nErr) errs.fullName = nErr;
    const pErr = validatePhone(form.phone); if (pErr) errs.phone = pErr;
    const eErr = validateEmail(form.email); if (eErr) errs.email = eErr;
    setFormError('');
    if (Object.keys(errs).length) { setErrors(errs); focusFirst(errs); return; }

    busyRef.current = true;
    setBusy(true);
    try {
      const res = await api.createBooking({
        screeningId: s.id,
        quantity: qty,
        customer: { fullName: cleanText(form.fullName, 80), phone: normalizePhone(form.phone), email: cleanText(form.email, 254) },
        paymentMethod: method,
        idempotencyKey: keyRef.current,
      });
      session.set(`mj_t_${res.reference}`, res.accessToken);
      // If the provider needs a hosted payment page, only follow allow-listed https origins.
      if (res.checkoutUrl && isAllowedOrigin(res.checkoutUrl, PAYMENT_ORIGINS)) {
        window.location.assign(res.checkoutUrl);
        return;
      }
      navigate(`/ticket/${encodeURIComponent(res.reference)}#t=${encodeURIComponent(res.accessToken)}`);
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        setErrors(err.fieldErrors);
        focusFirst(err.fieldErrors);
      }
      setFormError(err.message || 'Something went wrong. Please try again.');
      if (err.code === 'SOLD_OUT' || err.status === 409) reload();
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  return (
    <div className="container booking">
      <header className="booking__head">
        <Eyebrow>The screening</Eyebrow>
        <h1 className="booking__title">{s.title}</h1>
        <p className="booking__when">
          {formatDay(s.startsAt)} {formatShortDate(s.startsAt)} · {formatTime(s.startsAt)} · {s.venue}, {s.city}
        </p>
      </header>

      <form className="booking__form" onSubmit={onSubmit} noValidate>
        <div className="booking__main">
          <fieldset className="fs">
            <legend className="fs__legend"><span>01</span> Your tickets</legend>
            <QuantityStepper id="bk-qty" value={qty} max={max} onChange={(v) => { setQty(v); touch(); setErrors((p) => ({ ...p, quantity: undefined })); }} error={errors.quantity} />
            <p className="fs__note">{formatFCFA(s.ticketPrice)} per ticket · up to {max} per booking</p>
          </fieldset>

          <fieldset className="fs">
            <legend className="fs__legend"><span>02</span> Your details</legend>
            <Field id="bk-name" label="Full name" autoComplete="name" maxLength={80} value={form.fullName} onChange={update('fullName')} error={errors.fullName} required />
            <Field id="bk-phone" label="Phone number" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="6XX XXX XXX" prefix="+237" value={form.phone} onChange={update('phone')} error={errors.phone} hint="Used for your ticket and Mobile Money." required />
            <Field id="bk-email" label="Email" type="email" inputMode="email" autoComplete="email" maxLength={254} value={form.email} onChange={update('email')} error={errors.email} hint="We send your QR ticket here." required />
          </fieldset>

          <fieldset className="fs">
            <legend className="fs__legend"><span>03</span> Payment</legend>
            <div className="choice-col">
              {PAYMENT_METHODS.map((m) => (
                <label key={m.id} className={`choice choice--row ${method === m.id ? 'is-on' : ''}`}>
                  <input type="radio" name="payment" value={m.id} checked={method === m.id} onChange={() => { setMethod(m.id); touch(); }} />
                  <span><strong>{m.label}</strong><small>{m.hint}</small></span>
                </label>
              ))}
            </div>
            {errors.paymentMethod ? <p className="field__error" role="alert">{errors.paymentMethod}</p> : null}
          </fieldset>
        </div>

        <aside className="booking__summary" aria-label="Your booking">
          <h2 className="label">Your booking</h2>
          <p className="summary__film">{s.title}</p>
          <p className="summary__when">{formatDay(s.startsAt)} {formatShortDate(s.startsAt)} · {formatTime(s.startsAt)}</p>
          <div className="summary__line"><span>{qty} × Ticket</span><span>{formatFCFA(s.ticketPrice)}</span></div>
          <div className="summary__total"><span>Total</span><strong>{formatFCFA(total)}</strong></div>
          <SeatMeter screening={s} />

          {formError ? <p className="notice notice--error" role="alert">{formError}</p> : null}

          <Button type="submit" block arrow disabled={busy} aria-busy={busy}>{busy ? 'Processing…' : 'Pay & reserve'}</Button>
          <p className="summary__fine">
            Your seat is confirmed only once your payment is verified by our server. If we cancel the screening, you are refunded in full.
          </p>
        </aside>
      </form>
    </div>
  );
}
