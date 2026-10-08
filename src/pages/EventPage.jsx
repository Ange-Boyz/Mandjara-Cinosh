import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../components/Button.jsx';
import { Countdown } from '../components/Countdown.jsx';
import { Eyebrow } from '../components/Eyebrow.jsx';
import { Mark } from '../components/Mark.jsx';
import { Poster } from '../components/Poster.jsx';
import { Reveal } from '../components/Reveal.jsx';
import { SeatMeter } from '../components/SeatMeter.jsx';
import { TicketCta } from '../components/TicketCta.jsx';
import { FinalCta } from '../components/sections/FinalCta.jsx';
import { Location } from '../components/sections/Location.jsx';
import { Memory } from '../components/sections/Memory.jsx';
import { Ritual } from '../components/sections/Ritual.jsx';
import { useScreening } from '../hooks/useScreening.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { describeScreening } from '../utils/screening.js';
import { formatDate, formatFCFA, formatTime } from '../utils/format.js';
import { safeHttpsUrl } from '../utils/url.js';

function EventSkeleton() {
  return (
    <section className="hero" aria-busy="true">
      <p className="sr-only" role="status">Loading the screening…</p>
      <div className="container hero__grid">
        <div className="hero__poster"><div className="skeleton skeleton--poster" /></div>
        <div className="hero__copy">
          <div className="skeleton skeleton--title" />
          <div className="skeleton skeleton--block" />
        </div>
      </div>
    </section>
  );
}

function EventEmpty({ error, onRetry }) {
  return (
    <section className="container state">
      <Mark className="state__mark" />
      <Eyebrow>The next Mandjara</Eyebrow>
      <h1 className="state__title">{error ? 'We could not load the screening.' : 'The next evening is being prepared.'}</h1>
      <p className="lede">{error ? 'Please check your connection and try again.' : 'Nothing is open for booking right now. Come back soon, or read how a Mandjara evening unfolds.'}</p>
      <div className="cta-row">
        {error ? <Button onClick={onRetry}>Try again</Button> : null}
        <Button to="/about" variant={error ? 'secondary' : 'primary'} arrow>What is Mandjara?</Button>
      </div>
    </section>
  );
}

export default function EventPage() {
  useDocumentTitle('The Next Mandjara');
  const { phase, screening: s, error, reload } = useScreening();
  const { hash } = useLocation();

  useEffect(() => {
    if (phase === 'ready' && hash === '#memory') document.getElementById('memory')?.scrollIntoView();
  }, [phase, hash]);

  if (phase === 'loading') return <EventSkeleton />;
  if (phase !== 'ready') return <EventEmpty error={phase === 'error' ? error : null} onRetry={reload} />;

  const st = describeScreening(s);
  const trailer = safeHttpsUrl(s.trailerUrl);
  const upcoming = !st.completed && !st.cancelled;
  const details = [
    ['Date', formatDate(s.startsAt)],
    ['Doors open', formatTime(s.doorsOpenAt)],
    ['Film starts', formatTime(s.startsAt)],
    ['Venue', s.venue],
    ['Address', [s.address, s.neighbourhood, s.city].filter(Boolean).join(', ')],
    ['Ticket price', formatFCFA(s.ticketPrice)],
  ];
  const meta = [s.genre, s.runtimeMinutes ? `${s.runtimeMinutes} min` : '', s.rating].filter(Boolean);

  return (
    <>
      <section className="hero hero--event" aria-labelledby="event-title">
        <div className="container hero__grid">
          <div className="hero__poster"><Poster screening={s} priority /></div>
          <div className="hero__copy">
            <Eyebrow>{st.completed ? 'Past screening' : st.cancelled ? 'Cancelled' : 'The next Mandjara'}</Eyebrow>
            <h1 id="event-title" className="hero__title">{s.title}</h1>
            {s.tagline ? <p className="hero__tagline">{s.tagline}</p> : null}
            {meta.length ? (
              <ul className="chips" aria-label="Film details">
                {meta.map((m) => <li key={m}>{m}</li>)}
              </ul>
            ) : null}
            {s.synopsis ? <p className="synopsis">{s.synopsis}</p> : null}
            {st.cancelled ? (
              <p className="notice" role="status">This screening has been cancelled. Every booking is refunded in full.</p>
            ) : null}
            {upcoming ? <div className="hero__buy"><SeatMeter screening={s} /></div> : null}
            <div className="cta-row">
              {upcoming ? <TicketCta label="Reserve your place" hero /> : null}
              {trailer ? <Button href={trailer} variant="secondary">Watch the trailer</Button> : null}
            </div>
          </div>
        </div>
      </section>

      {upcoming && new Date(s.startsAt).getTime() > Date.now() ? (
        <section className="band" aria-label="Countdown">
          <div className="weave" aria-hidden="true" />
          <div className="container band__inner"><Countdown target={s.startsAt} /></div>
        </section>
      ) : null}

      <section className="section" id="details" aria-labelledby="details-title">
        <div className="container">
          <Reveal className="section__head">
            <Eyebrow>The event</Eyebrow>
            <h2 id="details-title" className="h2">Everything you need to know.</h2>
          </Reveal>
          <Reveal as="dl" className="detail-grid">
            {details.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section section--leaf" aria-labelledby="ritual-title">
        <div className="container">
          <Reveal className="section__head">
            <Eyebrow>The evening, step by step</Eyebrow>
            <h2 id="ritual-title" className="h2">The Mandjara ritual.</h2>
            <p className="lede">Eight moments turn a screening into a shared memory. Doors open an hour before the film, so come early.</p>
          </Reveal>
          <Ritual notes={{ 'The Mandjara Prelude': s.preludeNote, 'The Mandjara Circle': s.circleNote }} />
        </div>
      </section>

      <Location />
      {st.completed ? <Memory screening={s} /> : null}
      <FinalCta />
    </>
  );
}
