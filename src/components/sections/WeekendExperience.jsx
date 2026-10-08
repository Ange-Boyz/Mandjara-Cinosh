import { Eyebrow } from '../Eyebrow.jsx';
import { Reveal } from '../Reveal.jsx';
import { TicketCta } from '../TicketCta.jsx';
import { ChatIcon, FilmIcon, LightIcon, MicIcon } from '../Icons.jsx';
import { useScreening } from '../../hooks/useScreening.jsx';
import { describeScreening } from '../../utils/screening.js';

export function WeekendExperience() {
  const { phase, screening: s } = useScreening();
  if (phase !== 'ready') return null;
  const st = describeScreening(s);
  if (st.cancelled) return null;

  const meta = [s.genre, s.runtimeMinutes ? `${s.runtimeMinutes} min` : '', s.rating].filter(Boolean).join(' · ');
  const blocks = [
    { Icon: FilmIcon, label: 'The film', body: s.synopsis, meta },
    { Icon: LightIcon, label: 'The theme', body: s.theme, quote: s.proverb },
    { Icon: MicIcon, label: 'Before the film', body: s.preludeNote },
    { Icon: ChatIcon, label: 'After the film', body: s.circleNote },
  ].filter((b) => b.body);

  return (
    <section className="section" aria-labelledby="wk-title">
      <div className="container">
        <Reveal className="section__head">
          <Eyebrow>{st.completed ? 'That evening' : "This weekend's experience"}</Eyebrow>
          <h2 id="wk-title" className="h2">Your ticket opens more than a film.</h2>
        </Reveal>
        <div className="wk-grid">
          {blocks.map(({ Icon, label, body, meta: m, quote }, i) => (
            <Reveal className="wk" key={label} delay={(i % 2) * 90}>
              <Icon className="wk__icon" />
              <h3 className="label">{label}</h3>
              <p>{body}</p>
              {quote ? <p className="wk__quote">“{quote}”</p> : null}
              {m ? <p className="wk__meta">{m}</p> : null}
            </Reveal>
          ))}
        </div>
        <Reveal className="section__cta">
          <TicketCta label="I'm in" />
        </Reveal>
      </div>
    </section>
  );
}
