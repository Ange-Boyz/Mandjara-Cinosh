import { Button } from '../Button.jsx';
import { Eyebrow } from '../Eyebrow.jsx';
import { Reveal } from '../Reveal.jsx';

export function Intro() {
  return (
    <section className="section intro">
      <div className="container intro__grid">
        <Reveal>
          <Eyebrow>What is Mandjara?</Eyebrow>
          <h2 className="h2">In Cameroon, <span className="accent">mandjara</span> means cousin.</h2>
        </Reveal>
        <Reveal delay={120} className="intro__body">
          <p className="lede">
            It is the bond people use to joke instead of quarrel, and to welcome a stranger like family. Mandjara Cinosh is a cinema
            built on that same idea: one screen, one story, and nobody left standing outside.
          </p>
          <p>
            Each evening is more than a film. It is music, live performance, a proverb, a shared silence and a conversation afterwards —
            a cultural experience you take home with you.
          </p>
          <Button to="/about" variant="ghost" arrow>Our story</Button>
        </Reveal>
      </div>
    </section>
  );
}
