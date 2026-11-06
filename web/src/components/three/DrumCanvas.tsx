'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { detect3DEnv, shouldRender3D } from '@/lib/three-gate';

// three + r3f + the scene live only in this lazy chunk; the initial bundle carries the wrapper and the poster.
const Stage = dynamic(() => import('./Stage'), { ssr: false });

export type Variant = 'hero' | 'stage';

/**
 * Fixed 16:10 box: the poster is the SSR / no-JS / fallback markup (CLS 0); on capable devices the canvas
 * mounts over it after idle, once the box is near the viewport, and fades in on its first frame.
 */
export default function DrumCanvas({ variant, className = '' }: { variant: Variant; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  const [active, setActive] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!shouldRender3D(detect3DEnv())) return;
    let idle = false, near = false;
    const go = () => { if (idle && near) setMount(true); };
    const io = new IntersectionObserver((es) => { const v = es[es.length - 1].isIntersecting; near ||= v; setActive(v); go(); }, { rootMargin: '200px' });
    io.observe(box.current!);
    const done = () => { idle = true; go(); };
    const ric = typeof requestIdleCallback === 'function'; // Safari < 18 lacks it
    const id = ric ? requestIdleCallback(done, { timeout: 2000 }) : window.setTimeout(done, 800);
    return () => { io.disconnect(); if (ric) cancelIdleCallback(id); else window.clearTimeout(id); };
  }, []);

  return (
    <div ref={box} className={`drum-canvas relative aspect-[16/10] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized poster */}
      <img
        src="/images/drum-poster.webp"
        alt="A carved two-tone slit drum under warm stage lights"
        width={1600}
        height={1000}
        fetchPriority={variant === 'hero' ? 'high' : 'auto'}
        loading={variant === 'hero' ? 'eager' : 'lazy'}
        // The hero canvas is transparent: the poster must go once the drum is drawn over it.
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${shown ? 'opacity-0' : ''}`}
      />
      {mount && (
        <div aria-hidden="true" className={`absolute inset-0 transition-opacity duration-700 ${shown ? 'opacity-100' : 'opacity-0'}`}>
          <Stage variant={variant} active={active} onReady={() => setShown(true)} />
        </div>
      )}
    </div>
  );
}
