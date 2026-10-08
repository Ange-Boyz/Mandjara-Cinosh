import { Button } from '../components/Button.jsx';
import { Eyebrow } from '../components/Eyebrow.jsx';
import { Mark } from '../components/Mark.jsx';
import { Reveal } from '../components/Reveal.jsx';
import { FinalCta } from '../components/sections/FinalCta.jsx';
import { Ritual } from '../components/sections/Ritual.jsx';
import { FOCUS_AREAS } from '../config/site.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

const AUDIENCE = [
  'Young people and students',
  'Emerging artists and creatives',
  'Film lovers and the culturally curious',
  'Youth associations and community groups',
  'Local filmmakers and storytellers',
  'Everyone who wants to feel at home in African stories',
];

const SPECIALS = [
  ['Local filmmaker spotlight', 'An evening that puts a Cameroonian filmmaker and their work at the centre.'],
  ['Cultural theme night', 'Traditional attire, food, language and cultural immersion around a film.'],
  ['Film appreciation workshop', 'Learn how cinema tells stories and how to watch with a critical eye.'],
  ['Community dialogue forum', 'A deeper conversation on the social and cultural themes our films raise.'],
];

export default function AboutPage() {
  useDocumentTitle('About');
  return (
    <>
      <section className="page-hero">
        <div className="container page-hero__inner">
          <Mark className="page-hero__mark" />
          <Eyebrow>About Mandjara Cinosh</Eyebrow>
          <h1 className="page-hero__title">The culture that feeds the Soul.</h1>
          <p className="lede">A cultural cinema in Cameroon where a film becomes a shared, memorable experience.</p>
        </div>
      </section>

      <section className="section">
        <div className="container two-col">
          <Reveal>
            <Eyebrow>The name</Eyebrow>
            <h2 className="h2">Everyone&rsquo;s cousin.</h2>
          </Reveal>
          <Reveal delay={120} className="prose">
            <p className="lede">
              In Cameroon, &ldquo;mandjara&rdquo; means cousin — the bond communities use to joke instead of quarrel, and to welcome a
              stranger like family.
            </p>
            <p>
              Our mark draws two arms rising from opposite sides to meet at a single point of light: the screen. The road between them is
              made of filmstrip, because the story itself is what carries two sides toward each other. Neither arm is taller than the other.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section section--soil2">
        <div className="container two-col">
          <Reveal>
            <Eyebrow>Why we exist</Eyebrow>
            <h2 className="h2">Stories that reflect our roots.</h2>
          </Reveal>
          <Reveal delay={120} className="prose">
            <p>
              Young Africans grow up inside screens — endless scrolling, series and blockbusters built for someone else&rsquo;s world.
              Nothing is wrong with entertainment, but when the stories we grow up with do not reflect our roots, we start building
              identity on borrowed ground.
            </p>
            <p>
              Mandjara Cinosh answers with culturally grounded films that speak about ethics, family, community spirit and African
              heritage — and with a room full of people to talk about them with. Cinema as a place to reflect together, not to scroll alone.
            </p>
            <p className="pull">Our mission: accessible cinematic experiences that educate and inspire young people on African values, while building community dialogue.</p>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="focus-title">
        <div className="container">
          <Reveal className="section__head">
            <Eyebrow>What we care about</Eyebrow>
            <h2 id="focus-title" className="h2">Six focus areas.</h2>
          </Reveal>
          <ul className="focus">
            {FOCUS_AREAS.map((f, i) => (
              <Reveal as="li" key={f.title} delay={(i % 3) * 80}>
                <h3 className="label">{f.title}</h3>
                <p>{f.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--leaf" aria-labelledby="about-ritual-title">
        <div className="container">
          <Reveal className="section__head">
            <Eyebrow>The Mandjara ritual</Eyebrow>
            <h2 id="about-ritual-title" className="h2">Every evening follows the same road.</h2>
            <p className="lede">A structured, symbolic ritual turns each screening into a collective cultural experience — never a passive one.</p>
          </Reveal>
          <Ritual />
        </div>
      </section>

      <section className="section">
        <div className="container two-col">
          <Reveal>
            <Eyebrow>Who it is for</Eyebrow>
            <h2 className="h2">A room with space for you.</h2>
          </Reveal>
          <Reveal delay={120}>
            <ul className="ticklist">
              {AUDIENCE.map((a) => <li key={a}>{a}</li>)}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section section--night" aria-labelledby="specials-title">
        <div className="container">
          <Reveal className="section__head">
            <Eyebrow>From time to time</Eyebrow>
            <h2 id="specials-title" className="h2">Beyond the weekly screening.</h2>
          </Reveal>
          <dl className="specials">
            {SPECIALS.map(([t, d], i) => (
              <Reveal key={t} delay={(i % 2) * 90}>
                <dt className="label">{t}</dt>
                <dd>{d}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="container two-col">
          <Reveal>
            <Eyebrow>Work with us</Eyebrow>
            <h2 className="h2">Filmmaker, artist or partner?</h2>
          </Reveal>
          <Reveal delay={120} className="prose">
            <p>
              We want to hear from local filmmakers, spoken-word artists, musicians, universities, cultural centres and youth
              organisations who share this vision. Tell us about your work or your idea.
            </p>
            <Button to="/contact" arrow>Get in touch</Button>
          </Reveal>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
