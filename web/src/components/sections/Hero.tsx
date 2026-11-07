import { profile } from '@/content/site';
import Emblem from '../Emblem';
import DrumCanvas from '../three/DrumCanvas';

const MARQUEE = `${profile.name.toUpperCase()} — `;

export default function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
      style={{
        background:
          'radial-gradient(55% 60% at 50% -5%, rgb(232 160 106 / 0.22), transparent 70%), radial-gradient(45% 30% at 50% 78%, rgb(200 116 60 / 0.16), transparent 70%), var(--ink)',
      }}
    >
      {/* Marquee name, behind the drum */}
      <div data-testid="marquee" aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-[3svh] z-0 select-none overflow-hidden md:bottom-[4svh]">
        <div className="marquee-track font-display whitespace-nowrap text-[20vw] leading-[0.8] text-bone/95 md:text-[13vw]">
          <span className="pr-[0.25em]">{MARQUEE}{MARQUEE}</span>
          <span className="pr-[0.25em]">{MARQUEE}{MARQUEE}</span>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-5 pt-24 md:block md:px-10 md:pt-0">
        {/* Right: name + titles */}
        <div className="relative z-20 md:absolute md:right-10 md:top-[26%] md:max-w-[30%] md:rounded-xl md:bg-ink md:p-4 lg:max-w-[28%]">
          <span aria-hidden="true" className="mb-4 hidden text-2xl text-copper md:block">↘</span>
          <h1 id="hero-title">
            <span className="mb-3 block font-mono text-xs tracking-[0.25em] text-copper-hi">{profile.name.toUpperCase()}</span>
            <span className="hero-intro block text-[clamp(28px,3.1vw,48px)] font-medium leading-[1.08] tracking-tight">
              {profile.titlesPrimary[0]}
              <br />
              {profile.titlesPrimary[1]}
            </span>
          </h1>
          <p className="mt-3 font-mono text-[13px] tracking-wide text-ash">{profile.titlesSecondary.join(' · ')}</p>
          <p className="mt-1 font-mono text-[13px] tracking-wide text-ash">{profile.location}</p>
          <p data-testid="tagline" className="mt-2 text-[15px] italic text-bone">{profile.tagline}</p>
        </div>

        {/* Centre: the drum (poster first, 3D after idle). Tapping it is a teaser; the real drum is below. */}
        <div className="relative mx-auto mt-4 w-full max-w-[480px] text-center md:absolute md:left-[41%] md:top-[20%] md:mt-0 md:w-[42vw] md:max-w-[760px] md:-translate-x-1/2">
          <DrumCanvas variant="hero" />
          <a href="#drum" className="relative -mt-4 inline-flex min-h-6 items-center font-mono text-xs tracking-[0.2em] text-copper-hi hover:text-bone">Play me below ↓</a>
        </div>

        {/* Left: the drum hint */}
        <div className="mt-4 md:absolute md:left-0 md:top-[50%] md:mt-0">
          <a
            href="#drum"
            className="pulse-ring relative inline-flex items-center gap-4 rounded-full bg-[#18181b] py-2 pl-5 pr-2 text-[15px] leading-snug text-bone ring-1 ring-bone/10 transition-colors hover:bg-[#222226] md:rounded-l-none md:py-3 md:pl-10 md:pr-3"
          >
            <span className="max-w-[17ch]">{profile.hint}</span>
            <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-copper text-ink md:h-14 md:w-14" style={{ ['--emblem-bg' as string]: 'var(--copper)' }}>
              <Emblem className="h-8 w-8 md:h-10 md:w-10" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
