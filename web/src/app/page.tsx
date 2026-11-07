import Nav from '@/components/Nav';
import MotionInit from '@/components/MotionInit';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Superpowers from '@/components/sections/Superpowers';
import Work from '@/components/sections/Work';
import Recognition from '@/components/sections/Recognition';
import Experience from '@/components/sections/Experience';
import Community from '@/components/sections/Community';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';
import DrumSection from '@/components/drum/DrumSection';
import SoundPill from '@/components/SoundPill';

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
        <Experience />
        <Community />
        <DrumSection initialMode="normal" />
        <Contact />
      </main>
      <Footer soundToggle={<SoundPill variant="inline" />} />
      <SoundPill />
      <MotionInit />
    </>
  );
}
