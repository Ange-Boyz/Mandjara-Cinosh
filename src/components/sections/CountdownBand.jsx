import { Countdown } from '../Countdown.jsx';
import { useScreening } from '../../hooks/useScreening.jsx';
import { describeScreening } from '../../utils/screening.js';

export function CountdownBand() {
  const { phase, screening: s } = useScreening();
  if (phase !== 'ready') return null;
  const st = describeScreening(s);
  if (st.completed || st.cancelled) return null;
  if (new Date(s.startsAt).getTime() <= Date.now()) return null;
  return (
    <section className="band" aria-label="Countdown">
      <div className="weave" aria-hidden="true" />
      <div className="container band__inner">
        <Countdown target={s.startsAt} />
      </div>
    </section>
  );
}
