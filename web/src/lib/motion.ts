// Motion layer: Lenis smooth scroll + GSAP ScrollTrigger + SplitText line reveals on [data-reveal],
// hero marquee speed from scroll velocity, and the "water" swell on entering a section.
// Progressive only: content is fully readable before (and without) this running.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

import { audio } from './audio';
import { prefersReducedMotion } from './media';
export { prefersReducedMotion, isFinePointer } from './media';

let lenis: Lenis | null = null;
export const getLenis = () => lenis;

export function initMotion(): () => void {
  if (prefersReducedMotion()) return () => {};
  gsap.registerPlugin(ScrollTrigger, SplitText);

  lenis = new Lenis({ anchors: { offset: 0 }, autoRaf: false });
  // Marquee: 1× at rest, up to 4× while scrolling fast, easing back. Drives the CSS animation's playbackRate.
  const marquee = document.querySelector<HTMLElement>('.marquee-track')?.getAnimations()[0];
  let rate = 1;
  const raf = (t: number) => {
    lenis?.raf(t * 1000);
    if (!marquee || !lenis) return;
    const target = Math.min(4, 1 + Math.abs(lenis.velocity) / 12);
    const next = Math.abs(target - rate) < 0.01 ? target : rate + (target - rate) * 0.08;
    if (next !== rate) marquee.playbackRate = rate = next;
  };
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  const splits: SplitText[] = [];
  const ctx = gsap.context(() => {
    const fold = window.innerHeight * 0.88;
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      // Already on screen (or scrolled past, e.g. a deep link) when motion loads: leave it alone, no hide-then-show flash.
      if (el.getBoundingClientRect().top < fold) return;
      splits.push(
        SplitText.create(el, {
          type: 'lines',
          // aria-label is only valid on headings; elsewhere leave the split lines readable as-is.
          aria: el.matches('h1, h2, h3, h4, h5, h6') ? 'auto' : 'none',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.08,
              scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            }),
        }),
      );
    });

    // Entering a section plays the soft "water" swell (audio throttles it to one per 1.5 s; silent while sound is off).
    document.querySelectorAll<HTMLElement>('main > section[id]').forEach((el) => {
      ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 55%', onEnter: () => audio.swell(), onEnterBack: () => audio.swell() });
    });

    // Slow parallax on [data-parallax] images.
    document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
      gsap.fromTo(el, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el, scrub: true } });
    });
  });

  return () => {
    ctx.revert();
    splits.forEach((s) => s.revert());
    gsap.ticker.remove(raf);
    if (marquee) marquee.playbackRate = 1;
    lenis?.destroy();
    lenis = null;
  };
}
