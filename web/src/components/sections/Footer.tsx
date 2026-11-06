import { profile, LAST_UPDATED } from '@/content/site';
import type { ReactNode } from 'react';

// `soundToggle` is the mirrored sound control (filled by the drum feature).
export default function Footer({ soundToggle }: { soundToggle?: ReactNode }) {
  return (
    <footer className="border-t rule bg-[#111113] px-5 py-8 font-mono text-xs tracking-wide text-ash md:px-10">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <p>© 2026 {profile.name}</p>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <li><a className="hover:text-copper-hi" href={profile.links.repo} target="_blank" rel="noopener noreferrer">Source on GitHub ↗</a></li>
          <li><a className="hover:text-copper-hi" href="/how-it-works/">How this site is built</a></li>
          <li>Last updated {LAST_UPDATED}</li>
          {soundToggle && <li>{soundToggle}</li>}
        </ul>
      </div>
    </footer>
  );
}
