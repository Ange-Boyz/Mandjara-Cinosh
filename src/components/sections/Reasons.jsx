import { Eyebrow } from '../Eyebrow.jsx';
import { Reveal } from '../Reveal.jsx';
import { SeatMeter } from '../SeatMeter.jsx';
import { TicketCta } from '../TicketCta.jsx';
import { REASONS } from '../../config/site.js';
import { useScreening } from '../../hooks/useScreening.jsx';
import { describeScreening } from '../../utils/screening.js';

export function Reasons() {
  const { phase, screening: s } = useScreening();
  if (phase !== 'ready') return null;
  const st = describeScreening(s);
  if (st.completed || st.cancelled) return null;

  return (
    <section className="section section--night" aria-labelledby="why-title">
      <div className="container why">
        <Reveal className="why__head">
          <Eyebrow>Why this screening?</Eyebrow>
          <h2 id="why-title" className="h2">Three reasons to be there.</h2>
          <div className="why__seats">
            <SeatMeter screening={s} />
          </div>
          <TicketCta label="Join the screening" />
        </Reveal>
        <ol className="reasons">
          {REASONS.map((r, i) => (
            <Reveal as="li" className="reason" key={r.n} delay={i * 90}>
              <span className="reason__n" aria-hidden="true">{r.n}</span>
              <div>
                <h3 className="reason__t">{r.title}</h3>
                <p>{r.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
