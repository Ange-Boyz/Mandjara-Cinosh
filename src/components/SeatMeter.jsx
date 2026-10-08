import { describeScreening } from '../utils/screening.js';

// Scarcity is only ever shown from real server numbers. No fake urgency.
export function SeatMeter({ screening }) {
  const { capacity, seatsSold, seatsRemaining } = screening;
  const st = describeScreening(screening);
  const pct = capacity ? Math.min(100, Math.round((seatsSold / capacity) * 100)) : 0;

  let headline = `${seatsSold} / ${capacity} seats booked`;
  if (st.soldOut) headline = 'Sold out';
  else if (st.low) headline = `Only ${seatsRemaining} ${seatsRemaining === 1 ? 'seat' : 'seats'} left`;

  return (
    <div className={`seats ${st.low ? 'seats--low' : ''} ${st.soldOut ? 'seats--out' : ''}`}>
      <div className="seats__row">
        <span className="seats__headline">{headline}</span>
        {st.low ? <span className="seats__sub">{seatsSold} / {capacity} booked</span> : null}
      </div>
      <div
        className="seats__bar"
        role="meter"
        aria-label="Seats booked"
        aria-valuemin={0}
        aria-valuemax={capacity}
        aria-valuenow={seatsSold}
        aria-valuetext={`${seatsSold} of ${capacity} seats booked`}
      >
        <span style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
