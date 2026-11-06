'use client';
import { useEffect } from 'react';
import 'lenis/dist/lenis.css';
import { prefersReducedMotion } from '@/lib/media';

// GSAP + Lenis load after the page has loaded, off the critical path; content never waits for them.
export default function MotionInit() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let cleanup = () => {};
    let dead = false;
    const start = () => import('@/lib/motion').then((m) => { if (!dead) cleanup = m.initMotion(); });
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => { dead = true; window.removeEventListener('load', start); cleanup(); };
  }, []);
  return null;
}
