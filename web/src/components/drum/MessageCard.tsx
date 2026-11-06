import { DRUM_MESSAGES, PUNCHLINE } from '@/content/site';
import { toNotation, type Decoded } from '@/lib/drum-engine';
import type { ReactNode } from 'react';

/** The stamped card for the latest decoded phrase. `delivery` is the slot for the Drum Telegraph line (Task 7). */
export default function MessageCard({ decoded, first, delivery }: { decoded: Decoded; first: boolean; delivery?: ReactNode }) {
  const n = String(decoded.index + 1).padStart(2, '0');
  return (
    <article
      data-testid="message-card"
      className="stamp relative mx-auto w-full max-w-xl rounded-2xl border border-copper/40 bg-[#17110c] p-6 text-left shadow-[0_30px_80px_-30px_rgba(200,116,60,0.5)] md:p-8"
    >
      <header className="flex items-center justify-between font-mono text-[11px] tracking-[0.2em] text-copper-hi">
        <span>MESSAGE {n} / 0{DRUM_MESSAGES.length}{decoded.replay ? ' · AGAIN' : ''}</span>
        <span className="text-base tracking-[0.3em]"><span aria-hidden="true">{toNotation(decoded.phrase)}</span><span className="sr-only">Rhythm {decoded.phrase.split('').map((c) => (c === 'L' ? 'low' : 'high')).join(' ')}</span></span>
      </header>
      <p className="mt-5 text-[clamp(19px,2vw,24px)] leading-snug text-bone">{DRUM_MESSAGES[decoded.index]}</p>
      {first && (
        <p className="mt-5 border-t border-bone/10 pt-4 text-[15px] leading-relaxed text-bone/80">
          <a href="/how-it-works/" className="underline decoration-copper underline-offset-4 hover:text-copper-hi">{PUNCHLINE}</a>
        </p>
      )}
      {delivery}
    </article>
  );
}
