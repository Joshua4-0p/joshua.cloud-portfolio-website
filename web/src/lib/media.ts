// Tiny media-query helpers, kept apart from motion.ts so importing them doesn't pull GSAP/Lenis into the main chunk.
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isFinePointer = () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
