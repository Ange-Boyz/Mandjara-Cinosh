import { Eyebrow } from '../Eyebrow.jsx';
import { Reveal } from '../Reveal.jsx';
import { EXPERIENCE_STEPS } from '../../config/site.js';

export function ExperienceSteps() {
  return (
    <section className="section section--leaf" id="experience" aria-labelledby="exp-title">
      <div className="container">
        <Reveal className="section__head">
          <Eyebrow>The experience</Eyebrow>
          <h2 id="exp-title" className="h2">More than a screening.</h2>
          <p className="lede">At Mandjara, a film does not begin when the lights go down.</p>
        </Reveal>
        <ol className="steps">
          {EXPERIENCE_STEPS.map((step, i) => (
            <Reveal as="li" className="step" key={step.n} delay={i * 80}>
              <span className="step__n">{step.n}</span>
              <div>
                <h3 className="step__t">{step.title}</h3>
                <p className="step__p">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
