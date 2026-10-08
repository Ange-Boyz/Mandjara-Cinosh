import { Button } from '../Button.jsx';
import { Mark } from '../Mark.jsx';
import { Reveal } from '../Reveal.jsx';
import { TicketCta } from '../TicketCta.jsx';
import { useScreening } from '../../hooks/useScreening.jsx';
import { describeScreening } from '../../utils/screening.js';

export function FinalCta() {
  const { phase, screening } = useScreening();
  const bookable = phase === 'ready' && describeScreening(screening).canBook;
  return (
    <section className="final" aria-labelledby="final-title">
      <Reveal className="container final__inner">
        <Mark className="final__mark" />
        <h2 id="final-title" className="final__title">See you at Mandjara.</h2>
        <p className="lede">The culture that feeds the Soul.</p>
        <div className="cta-row cta-row--center">
          {bookable ? <TicketCta label="Get your ticket" /> : <Button to="/about" arrow>Discover Mandjara</Button>}
        </div>
      </Reveal>
    </section>
  );
}
