import { Button } from '../Button.jsx';
import { Mark } from '../Mark.jsx';
import { Poster } from '../Poster.jsx';
import { SeatMeter } from '../SeatMeter.jsx';
import { TicketCta } from '../TicketCta.jsx';
import { useScreening } from '../../hooks/useScreening.jsx';
import { describeScreening } from '../../utils/screening.js';
import { formatDay, formatFCFA, formatShortDate, formatTime } from '../../utils/format.js';

function eyebrowFor(s, st) {
  if (st.completed) return 'Last screening';
  if (st.cancelled) return 'Screening cancelled';
  const days = (new Date(s.startsAt).getTime() - Date.now()) / 86400000;
  if (days <= 7 && days > -1) return `This ${formatDay(s.startsAt)}`;
  return 'The next Mandjara';
}

function HeroSkeleton() {
  return (
    <section className="hero" aria-busy="true">
      <p className="sr-only" role="status">Loading the next screening…</p>
      <div className="container hero__grid">
        <div className="hero__poster"><div className="skeleton skeleton--poster" /></div>
        <div className="hero__copy">
          <div className="skeleton skeleton--line" style={{ width: '38%' }} />
          <div className="skeleton skeleton--title" />
          <div className="skeleton skeleton--line" style={{ width: '70%' }} />
          <div className="skeleton skeleton--block" />
        </div>
      </div>
    </section>
  );
}

function HeroEmpty({ error, onRetry }) {
  return (
    <section className="hero hero--empty">
      <div className="container hero__empty">
        <Mark className="hero__emptymark" />
        <p className="eyebrow"><span className="eyebrow__dash" aria-hidden="true" />The next Mandjara</p>
        <h1 className="hero__title">{error ? 'We could not load the screening.' : 'The next evening is being prepared.'}</h1>
        <p className="lede">
          {error
            ? 'Please check your connection and try again.'
            : 'No screening is open for booking right now. Discover what a Mandjara evening feels like while you wait for the announcement.'}
        </p>
        <div className="cta-row">
          {error ? <Button onClick={onRetry}>Try again</Button> : null}
          <Button to="/about" variant={error ? 'secondary' : 'primary'} arrow>What is Mandjara?</Button>
        </div>
      </div>
    </section>
  );
}

export function Hero() {
  const { phase, screening: s, error, reload } = useScreening();
  if (phase === 'loading') return <HeroSkeleton />;
  if (phase !== 'ready') return <HeroEmpty error={phase === 'error' ? error : null} onRetry={reload} />;

  const st = describeScreening(s);
  const upcoming = !st.completed && !st.cancelled;

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__poster">
          <Poster screening={s} priority />
        </div>

        <div className="hero__copy">
          <p className="eyebrow">
            <span className="eyebrow__dash" aria-hidden="true" />
            {eyebrowFor(s, st)}
          </p>
          <h1 id="hero-title" className="hero__title">{s.title}</h1>
          {s.tagline ? <p className="hero__tagline">{s.tagline}</p> : null}

          {upcoming ? (
            <>
              <dl className="facts">
                <div>
                  <dt>When</dt>
                  <dd>{formatDay(s.startsAt)} {formatShortDate(s.startsAt)}</dd>
                </div>
                <div>
                  <dt>Time</dt>
                  <dd>{formatTime(s.startsAt)}<span className="facts__sub"> · doors {formatTime(s.doorsOpenAt)}</span></dd>
                </div>
                <div>
                  <dt>Where</dt>
                  <dd>{s.city}</dd>
                </div>
              </dl>

              <div className="hero__buy">
                <p className="price">
                  {formatFCFA(s.ticketPrice)}
                  <span className="price__sub"> per ticket</span>
                </p>
                <SeatMeter screening={s} />
              </div>

              <div className="cta-row">
                <TicketCta label="Get your ticket" hero />
                <Button to="/next-screening" variant="ghost">See the evening</Button>
              </div>
              {st.soldOut ? <p className="hero__note">This evening is full. Follow us for the next date.</p> : null}
            </>
          ) : st.completed ? (
            <>
              <p className="lede">Thank you to everyone who was in the room. The photos, the conversation and the vote for what comes next are waiting for you.</p>
              <div className="cta-row">
                <Button to="/next-screening#memory" arrow>Keep the memory</Button>
                <Button to="/about" variant="ghost">About Mandjara</Button>
              </div>
            </>
          ) : (
            <>
              <p className="lede">This screening has been cancelled. Every booking is refunded in full. We are sorry, and we will announce the next evening soon.</p>
              <div className="cta-row">
                <Button to="/contact" variant="secondary">Contact us</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
