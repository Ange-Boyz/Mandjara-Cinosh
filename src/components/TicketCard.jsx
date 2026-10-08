import { QRCodeSVG } from 'qrcode.react';
import { Mark } from './Mark.jsx';
import { formatDay, formatShortDate, formatTime } from '../utils/format.js';

// The digital ticket. The QR encodes only an opaque, unpredictable token issued
// by the server after verified payment; check-in staff scan it against the API.
export function TicketCard({ booking }) {
  const s = booking.screening;
  return (
    <article className="ticket" aria-label={`Ticket for ${s.title}`}>
      <div className="ticket__main">
        <div className="ticket__brand">
          <Mark className="ticket__mark" />
          <span>MANDJARA CINOSH</span>
        </div>
        <h2 className="ticket__film">{s.title}</h2>
        <dl className="ticket__meta">
          <div><dt>Day</dt><dd>{formatDay(s.startsAt)}</dd></div>
          <div><dt>Date</dt><dd>{formatShortDate(s.startsAt)}</dd></div>
          <div><dt>Time</dt><dd>{formatTime(s.startsAt)}</dd></div>
          <div><dt>Admit</dt><dd>{booking.quantity} {booking.quantity === 1 ? 'person' : 'people'}</dd></div>
        </dl>
        <p className="ticket__venue">{[s.venue, s.city].filter(Boolean).join(' · ')}</p>
        <p className="ticket__ref">Booking <strong>{booking.reference}</strong></p>
      </div>
      <div className="ticket__stub">
        <div className="ticket__qr">
          <QRCodeSVG value={booking.qrToken} size={148} level="M" marginSize={2} bgColor="#FFFFFF" fgColor="#1B0F07" title={`QR code for booking ${booking.reference}`} />
        </div>
        <span className="ticket__admit">ADMIT {booking.quantity}</span>
      </div>
    </article>
  );
}
