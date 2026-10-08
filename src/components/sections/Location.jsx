import { Button } from '../Button.jsx';
import { Eyebrow } from '../Eyebrow.jsx';
import { Mark } from '../Mark.jsx';
import { Reveal } from '../Reveal.jsx';
import { PinIcon } from '../Icons.jsx';
import { useScreening } from '../../hooks/useScreening.jsx';
import { describeScreening } from '../../utils/screening.js';
import { mapsDirectionsUrl } from '../../utils/format.js';
import { safeMapEmbedUrl } from '../../utils/url.js';

export function Location() {
  const { phase, screening: s } = useScreening();
  if (phase !== 'ready') return null;
  if (describeScreening(s).cancelled) return null;
  const embed = safeMapEmbedUrl(s.mapEmbedUrl);

  return (
    <section className="section section--soil2" id="location" aria-labelledby="loc-title">
      <div className="container location">
        <Reveal className="location__info">
          <Eyebrow>Where are we?</Eyebrow>
          <h2 id="loc-title" className="h2">{s.venue}</h2>
          <address className="location__address">
            <PinIcon className="location__pin" />
            <span>
              {s.address}
              {s.neighbourhood ? <><br />{s.neighbourhood}</> : null}
              <br />
              {s.city}, Cameroon
            </span>
          </address>
          {s.accessNotes ? (
            <div className="location__notes">
              <h3 className="label">How to get there</h3>
              <p>{s.accessNotes}</p>
            </div>
          ) : null}
          <Button href={mapsDirectionsUrl(s.venue, s.address, s.city)} variant="secondary" arrow>Get directions</Button>
        </Reveal>

        <Reveal className="location__map" delay={120}>
          {embed ? (
            <iframe
              title={`Map showing ${s.venue}`}
              src={embed}
              loading="lazy"
              referrerPolicy="no-referrer"
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            <div className="map-fallback" aria-hidden="true">
              <Mark className="map-fallback__mark" />
              <span>{s.city}</span>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
