'use client';
import { useEffect, useRef, useState } from 'react';
import Emblem from './Emblem';

export const NAV_LINKS = [
  { label: 'ABOUT', href: '#about' },
  { label: 'SUPERPOWERS', href: '#superpowers' },
  { label: 'WORK', href: '#work' },
  { label: 'DRUM', href: '#drum' },
  { label: 'CONTACT', href: '#contact' },
];

export default function Nav() {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setCollapsed(window.scrollY > 120);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = dialog.current!;
    root.querySelector<HTMLElement>('a')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); button.current?.focus(); return; }
      if (e.key !== 'Tab') return;
      const items = [...root.querySelectorAll<HTMLElement>('a, button')];
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-bone focus:px-4 focus:py-2 focus:text-ink">
        Skip to content
      </a>
      <header className="absolute inset-x-0 top-0 z-40">
        <nav aria-label="Primary" className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 md:px-10 md:py-7">
          <a href="#hero" className="flex items-center gap-2.5 text-bone" data-nav-link>
            <Emblem className="h-9 w-9 text-copper" />
            <span className="font-mono text-sm tracking-[0.2em]">JOSUE</span>
          </a>
          <ul className="hidden items-center gap-6 font-mono text-[13px] tracking-wider md:flex lg:gap-10">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} data-nav-link className="group text-bone/85 transition-colors hover:text-copper-hi">
                  <span aria-hidden="true">[ </span>{l.label}<span aria-hidden="true"> ]</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <button
        ref={button}
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen(true)}
        className={`fixed right-4 top-4 z-50 grid h-14 w-14 place-items-center rounded-full bg-bone text-ink shadow-lg transition-all duration-300 md:right-8 md:top-6 md:h-16 md:w-16 ${
          collapsed ? 'md:visible md:scale-100 md:opacity-100' : 'md:invisible md:scale-0 md:opacity-0'
        }`}
      >
        <span aria-hidden="true" className="flex w-6 flex-col gap-1.5">
          <span className="h-px w-full bg-current" />
          <span className="h-px w-full bg-current" />
        </span>
      </button>

      {open && (
        <div
          ref={dialog}
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          data-lenis-prevent
          className="fixed inset-0 z-[60] flex flex-col overflow-y-auto overscroll-contain bg-ink px-6 pb-10 pt-24 md:px-16"
        >
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => { setOpen(false); button.current?.focus(); }}
            className="absolute right-4 top-4 grid h-14 w-14 place-items-center rounded-full bg-copper text-ink md:right-8 md:top-6 md:h-16 md:w-16"
          >
            <span aria-hidden="true" className="text-2xl leading-none">✕</span>
          </button>
          <p className="mb-6 font-mono text-xs tracking-[0.25em] text-ash">NAVIGATION</p>
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((l, i) => (
              <li key={l.href} className="border-b rule">
                <a
                  href={l.href}
                  data-nav-link
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 py-3 text-bone transition-colors hover:text-copper-hi"
                >
                  <span className="font-mono text-xs text-copper" aria-hidden="true">0{i + 1}</span>
                  <span className="font-display text-[clamp(44px,12vw,120px)]">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
