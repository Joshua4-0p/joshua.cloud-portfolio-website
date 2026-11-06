'use client';
import { useEffect, useSyncExternalStore } from 'react';
import { audio } from '@/lib/audio';
import { loadSound, saveSound } from '@/lib/storage';

const useSoundOn = () => useSyncExternalStore(audio.subscribe, audio.isOn, () => false);

/** Restores a remembered "sound on" choice. The AudioContext itself is only created on the next gesture. */
export function useRestoreSound() {
  useEffect(() => {
    if (!loadSound() || audio.isOn()) return;
    const cleanup = () => { window.removeEventListener('click', arm); window.removeEventListener('keydown', arm); };
    // A gesture on the toggle itself is handled by the toggle; anything else re-arms the remembered choice.
    function arm(e: Event) {
      if (!(e.target as Element | null)?.closest?.('[data-sound-toggle]') && !audio.wasChosen()) audio.setOn(true);
      cleanup();
    }
    window.addEventListener('click', arm);
    window.addEventListener('keydown', arm);
    return cleanup;
  }, []);
}

export default function SoundPill({ variant = 'floating' }: { variant?: 'floating' | 'inline' }) {
  const on = useSoundOn();
  const toggle = () => { const next = !audio.isOn(); audio.setOn(next, true); saveSound(next); };
  const bars = (
    <span aria-hidden="true" className="flex h-3.5 items-end gap-[3px]">
      {[0.5, 1, 0.7, 0.9].map((h, i) => (
        <span key={i} className={`w-[3px] rounded-full bg-current transition-all duration-300 ${on ? 'sound-bar' : ''}`} style={{ height: on ? `${h * 100}%` : '25%', animationDelay: `${i * 0.12}s` }} />
      ))}
    </span>
  );
  if (variant === 'inline')
    return (
      <button type="button" aria-pressed={on} data-sound-toggle onClick={toggle} className="inline-flex items-center gap-2 hover:text-copper-hi">
        {bars} Sound <span aria-hidden="true">{on ? 'on' : 'off'}</span>
      </button>
    );
  return (
    <button
      type="button"
      aria-pressed={on}
      data-sound-toggle
      onClick={toggle}
      className="fixed bottom-4 right-4 z-40 hidden md:inline-flex items-center gap-2.5 rounded-full bg-bone/95 px-4 py-2.5 font-mono text-xs tracking-wider text-ink shadow-lg backdrop-blur transition-colors hover:bg-copper-hi md:bottom-6 md:right-8"
    >
      {bars}
      <span>SOUND <span aria-hidden="true">{on ? 'ON' : 'OFF'}</span></span>
    </button>
  );
}
