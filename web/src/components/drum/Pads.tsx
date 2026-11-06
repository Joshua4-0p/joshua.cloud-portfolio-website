'use client';
import type { Tone } from '@/lib/drum-engine';

const PADS: { tone: Tone; label: string; short: string; key: string; glyph: string }[] = [
  { tone: 'L', label: 'Low drum', short: 'LOW', key: 'F', glyph: '●' },
  { tone: 'H', label: 'High drum', short: 'HIGH', key: 'J', glyph: '○' },
];

/**
 * Two big pad buttons. One physical hit = one onHit:
 * - pointer (mouse/touch/pen): counted on pointerdown (same-frame feedback); the click that follows (detail ≥ 1) is ignored;
 * - keyboard activation (Enter/Space): the button's click arrives with detail === 0 and is counted there.
 * F/J are handled by the section's keydown and also call onHit.
 */
export default function Pads({ onHit, padRefs }: { onHit: (t: Tone) => void; padRefs: React.RefObject<Record<Tone, HTMLButtonElement | null>> }) {
  const refs = padRefs;
  return (
    <div className="flex items-center justify-center gap-5 md:gap-10">
      {PADS.map((p) => (
        <button
          key={p.tone}
          ref={(el) => { refs.current[p.tone] = el; }}
          type="button"
          aria-label={p.label}
          aria-keyshortcuts={p.key}
          onPointerDown={(e) => { if (e.pointerType === 'mouse' && e.button !== 0) return; onHit(p.tone); }}
          onClick={(e) => { if (e.detail === 0) onHit(p.tone); }}
          onContextMenu={(e) => e.preventDefault()}
          className={`drum-pad group relative grid touch-manipulation select-none place-items-center rounded-full ring-1 ring-copper/50 ${
            p.tone === 'L' ? 'h-36 w-36 md:h-44 md:w-44' : 'h-28 w-28 md:h-36 md:w-36'
          }`}
        >
          <span aria-hidden="true" className="flex flex-col items-center gap-1">
            <span className="text-3xl leading-none text-copper-hi md:text-4xl">{p.glyph}</span>
            <span className="font-mono text-xs tracking-[0.2em]">{p.short}</span>
            <kbd className="mt-1 hidden rounded border border-bone/30 px-1.5 font-mono text-[10px] text-ash md:inline-block">{p.key}</kbd>
          </span>
        </button>
      ))}
    </div>
  );
}
