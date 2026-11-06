// Motion layer: Lenis smooth scroll + GSAP ScrollTrigger + SplitText line reveals on [data-reveal].
// Progressive only: content is fully readable before (and without) this running.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isFinePointer = () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

let lenis: Lenis | null = null;
export const getLenis = () => lenis;

export function initMotion(): () => void {
  if (prefersReducedMotion()) return () => {};
  gsap.registerPlugin(ScrollTrigger, SplitText);

  lenis = new Lenis({ anchors: { offset: 0 }, autoRaf: false });
  const raf = (t: number) => lenis?.raf(t * 1000);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  const splits: SplitText[] = [];
  const ctx = gsap.context(() => {
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      const inHero = !!el.closest('#hero');
      splits.push(
        SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: inHero ? 0.9 : 0.8,
              ease: 'power3.out',
              stagger: 0.08,
              delay: inHero ? 0.1 : 0,
              scrollTrigger: inHero ? undefined : { trigger: el, start: 'top 88%', once: true },
            }),
        }),
      );
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
    lenis?.destroy();
    lenis = null;
  };
}
