'use client';
import { useEffect } from 'react';
import 'lenis/dist/lenis.css';
import { prefersReducedMotion } from '@/lib/media';
import { audio } from '@/lib/audio';

// Without the motion layer (reduced motion) the section-enter swell still plays: a section crossing 55 % of the
// viewport, the same line as motion.ts's ScrollTrigger. Only one of the two ever runs.
function sectionSwell() {
  const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) audio.swell(); }, { rootMargin: '-55% 0px -44% 0px' });
  document.querySelectorAll('main > section[id]').forEach((el) => io.observe(el));
  return () => io.disconnect();
}

// GSAP + Lenis load after the page has loaded, off the critical path; content never waits for them.
export default function MotionInit() {
  useEffect(() => {
    if (prefersReducedMotion()) return sectionSwell();
    let cleanup = () => {};
    let dead = false;
    const start = () => import('@/lib/motion').then((m) => { if (!dead) cleanup = m.initMotion(); });
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => { dead = true; window.removeEventListener('load', start); cleanup(); };
  }, []);
  return null;
}
