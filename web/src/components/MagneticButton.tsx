'use client';
import { useRef, type ReactNode } from 'react';
import { isFinePointer, prefersReducedMotion } from '@/lib/motion';

// A link that drifts toward the pointer on fine-pointer devices. No-op on touch and under reduced motion.
export default function MagneticButton({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse' || !isFinePointer() || prefersReducedMotion()) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.35;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.35;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    if (inner.current) inner.current.style.transform = `translate3d(${x * 0.4}px, ${y * 0.4}px, 0)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = '';
    if (inner.current) inner.current.style.transform = '';
  };

  return (
    <a
      ref={ref}
      href={href}
      onPointerMove={move}
      onPointerLeave={leave}
      className={`inline-flex items-center justify-center rounded-full transition-transform duration-500 ease-out ${className}`}
    >
      <span ref={inner} className="inline-block transition-transform duration-500 ease-out">{children}</span>
    </a>
  );
}
