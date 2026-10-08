import { Button } from './Button.jsx';
import { useScreening } from '../hooks/useScreening.jsx';
import { describeScreening } from '../utils/screening.js';

// The conversion button, repeated through the page. It adapts to the real
// state of the screening so it never invites a booking that cannot happen.
export function TicketCta({ label = 'Get your ticket', variant = 'primary', size, block, hero = false, className = '' }) {
  const { phase, screening } = useScreening();
  if (phase !== 'ready') return null;
  const st = describeScreening(screening);

  if (st.canBook) {
    return (
      <Button to="/ticket" variant={variant} size={size} block={block} arrow className={className} {...(hero ? { 'data-hero-cta': '' } : {})}>
        {label}
      </Button>
    );
  }
  if (st.soldOut) {
    return <span className={`btn btn--disabled ${block ? 'btn--block' : ''}`} role="note">Sold out</span>;
  }
  if (st.completed) {
    return <Button to="/next-screening#memory" variant="secondary" block={block}>Keep the memory</Button>;
  }
  return null;
}
