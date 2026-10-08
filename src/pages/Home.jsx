import { Hero } from '../components/sections/Hero.jsx';
import { CountdownBand } from '../components/sections/CountdownBand.jsx';
import { Intro } from '../components/sections/Intro.jsx';
import { ExperienceSteps } from '../components/sections/ExperienceSteps.jsx';
import { WeekendExperience } from '../components/sections/WeekendExperience.jsx';
import { Reasons } from '../components/sections/Reasons.jsx';
import { Location } from '../components/sections/Location.jsx';
import { FinalCta } from '../components/sections/FinalCta.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

// Landing page built for conversion: the next event first, then the reasons to come.
export default function Home() {
  useDocumentTitle('');
  return (
    <>
      <Hero />
      <CountdownBand />
      <Intro />
      <ExperienceSteps />
      <WeekendExperience />
      <Reasons />
      <Location />
      <FinalCta />
    </>
  );
}
