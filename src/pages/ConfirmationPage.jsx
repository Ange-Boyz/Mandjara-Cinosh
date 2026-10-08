import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Button } from '../components/Button.jsx';
import { Eyebrow } from '../components/Eyebrow.jsx';
import { Mark } from '../components/Mark.jsx';
import { TicketCard } from '../components/TicketCard.jsx';
import { CheckIcon } from '../components/Icons.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { api } from '../services/api.js';
import { downloadCalendarEvent } from '../utils/ics.js';
import { formatDate, formatTime, mapsDirectionsUrl } from '../utils/format.js';
import { REFERENCE_RE, TOKEN_RE } from '../utils/validators.js';
import { session } from '../utils/storage.js';

const POLL_LIMIT_MS = 180000;

// Payment truth lives on the server. This page never decides a booking is paid:
// it asks the API (with the booking's private access token) until the server
// reports a final status, and only then does the QR ticket appear.
function useBooking(reference, token) {
  const [state, setState] = useState({ booking: null, notFound: false, error: null, timedOut: false });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!reference || !token) return undefined;
    let cancelled = false;
    let timer;
    let attempts = 0;
    const started = Date.now();
    const controller = new AbortController();
    setState((s) => ({ ...s, timedOut: false, notFound: false }));

    const tick = async () => {
      try {
        const booking = await api.getBooking(reference, token, controller.signal);
        if (cancelled) return;
        setState({ booking, notFound: false, error: null, timedOut: false });
        if (booking.paymentStatus === 'PENDING') {
          if (Date.now() - started > POLL_LIMIT_MS) {
            setState((s) => ({ ...s, timedOut: true }));
            return;
          }
          attempts += 1;
          timer = setTimeout(tick, Math.min(2000 + attempts * 500, 6000));
        }
      } catch (err) {
        if (cancelled || err.name === 'AbortError') return;
        if (err.status === 404) {
          setState((s) => ({ ...s, notFound: true }));
          return;
        }
        setState((s) => ({ ...s, error: err }));
        attempts += 1;
        if (attempts < 8) timer = setTimeout(tick, 4000);
      }
    };
    tick();
    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [reference, token, nonce]);

  return { ...state, recheck: () => setNonce((n) => n + 1) };
}

function readToken(reference, hash) {
  // The token lives in the URL *fragment* (never sent to servers or logs) and in
  // sessionStorage so a refresh keeps working.
  const fromHash = new URLSearchParams(hash.replace(/^#/, '')).get('t');
  if (fromHash && TOKEN_RE.test(fromHash)) {
    session.set(`mj_t_${reference}`, fromHash);
    return fromHash;
  }
  const stored = session.get(`mj_t_${reference}`);
  return stored && TOKEN_RE.test(stored) ? stored : '';
}

function Notice({ mark = true, eyebrow, title, children, actions }) {
  return (
    <section className="container state">
      {mark ? <Mark className="state__mark" /> : null}
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="state__title">{title}</h1>
      <div className="lede">{children}</div>
      {actions ? <div className="cta-row">{actions}</div> : null}
    </section>
  );
}

export default function ConfirmationPage() {
  const { reference = '' } = useParams();
  const { hash } = useLocation();
  const validRef = REFERENCE_RE.test(reference);
  const token = useMemo(() => (validRef ? readToken(reference, hash) : ''), [reference, hash, validRef]);
  const { booking, notFound, error, timedOut, recheck } = useBooking(validRef ? reference : '', token);
  const [copied, setCopied] = useState(false);

  const paid = booking?.paymentStatus === 'SUCCESS';
  useDocumentTitle(paid ? "You're in" : 'Your booking');

  if (!validRef || !token || notFound) {
    return (
      <Notice eyebrow="Ticket" title="We cannot open this ticket." actions={<><Button to="/" arrow>Back to Mandjara</Button><Button to="/contact" variant="secondary">Contact us</Button></>}>
        <p>The link looks incomplete or has expired. Open the full link from your confirmation email or message, or contact us with your booking reference.</p>
      </Notice>
    );
  }

  if (!booking) {
    return (
      <Notice eyebrow="Booking" title={error ? 'We cannot reach the server.' : 'Checking your booking…'} actions={error ? <Button onClick={recheck}>Try again</Button> : null}>
        <p role="status">{error ? error.message : 'One moment while we confirm your payment.'}</p>
      </Notice>
    );
  }

  if (booking.paymentStatus === 'PENDING') {
    return (
      <Notice eyebrow={`Booking ${booking.reference}`} title="Confirming your payment…" actions={timedOut ? <Button onClick={recheck}>Check again</Button> : null}>
        {timedOut ? (
          <p>This is taking longer than usual. If you approved the payment, it may still arrive — check again in a moment. You have not been charged twice, and your booking reference is <strong>{booking.reference}</strong>.</p>
        ) : (
          <p role="status">Approve the payment with your provider if you are asked to. Keep this page open — your ticket appears here as soon as our server confirms it.</p>
        )}
        {!timedOut ? <div className="spinner" aria-hidden="true" /> : null}
      </Notice>
    );
  }

  if (booking.paymentStatus === 'FAILED') {
    return (
      <Notice eyebrow={`Booking ${booking.reference}`} title="The payment did not go through." actions={<Button to="/ticket" arrow>Try again</Button>}>
        <p>No money was taken for this attempt. You can start a new booking whenever you are ready — your seats are not held until payment succeeds.</p>
      </Notice>
    );
  }

  if (booking.paymentStatus === 'REFUNDED' || booking.ticketStatus === 'CANCELLED') {
    return (
      <Notice eyebrow={`Booking ${booking.reference}`} title="This booking was cancelled." actions={<Button to="/contact">Contact us</Button>}>
        <p>If a payment was made, it has been refunded. Reach out if anything looks wrong.</p>
      </Notice>
    );
  }

  const s = booking.screening;
  const used = booking.ticketStatus === 'USED';
  const ticketLink = `${window.location.origin}/ticket/${encodeURIComponent(booking.reference)}#t=${encodeURIComponent(token)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(ticketLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt('Copy your private ticket link', ticketLink);
    }
  }

  const inviteText = `I'm going to ${s.title} at Mandjara Cinosh — ${formatDate(s.startsAt)}, ${formatTime(s.startsAt)}, ${s.city}. Come with me: ${window.location.origin}/next-screening`;

  return (
    <div className="container confirm">
      <header className="confirm__head no-print">
        <p className="confirm__badge"><CheckIcon /> Payment confirmed</p>
        <h1 className="confirm__title">You&rsquo;re in.</h1>
        <p className="lede">Your Mandjara experience is confirmed. Show this ticket at the door — on your phone is perfect.</p>
        {used ? <p className="notice" role="status">This ticket has already been scanned at the door.</p> : null}
      </header>

      <div className="confirm__ticket">
        <TicketCard booking={booking} />
      </div>

      <div className="confirm__actions no-print">
        <Button variant="secondary" onClick={() => downloadCalendarEvent({ uid: booking.reference, title: `${s.title} — Mandjara Cinosh`, startsAt: s.startsAt, location: [s.venue, s.address, s.city].filter(Boolean).join(', '), description: `Doors open at ${formatTime(s.doorsOpenAt)}. Booking ${booking.reference}.` })}>Add to calendar</Button>
        <Button variant="secondary" onClick={() => window.print()}>Print or save ticket</Button>
        <Button variant="secondary" onClick={copyLink}>{copied ? 'Link copied' : 'Copy private ticket link'}</Button>
        <Button variant="secondary" href={mapsDirectionsUrl(s.venue, s.address, s.city)}>Get directions</Button>
        <Button variant="ghost" href={`https://wa.me/?text=${encodeURIComponent(inviteText)}`}>Invite a friend on WhatsApp</Button>
      </div>

      <p className="confirm__fine no-print">
        Doors open at {formatTime(s.doorsOpenAt)}. Keep your ticket link private: anyone who has it can see your QR code.
      </p>
    </div>
  );
}
