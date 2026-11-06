import Nav from '@/components/Nav';
import MotionInit from '@/components/MotionInit';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Superpowers from '@/components/sections/Superpowers';
import Work from '@/components/sections/Work';
import Recognition from '@/components/sections/Recognition';
import Community from '@/components/sections/Community';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';
import { DrumHeading, AllMessages } from '@/components/drum/DrumIntro';

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <Superpowers />
        <Work />
        <Recognition />
        <Community />
        <section id="drum" aria-labelledby="drum-title" className="px-5 py-24 md:px-10 md:py-36">
          <div className="mx-auto max-w-[1600px]">
            <DrumHeading />
            <AllMessages />
          </div>
        </section>
        <Contact />
      </main>
      <Footer />
      <MotionInit />
    </>
  );
}
