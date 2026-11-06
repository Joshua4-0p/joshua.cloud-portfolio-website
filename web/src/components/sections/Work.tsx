'use client';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { projects, moreProjects, type Project } from '@/content/site';
import ProjectCover from '../ProjectCover';
import { isFinePointer, prefersReducedMotion } from '@/lib/motion';

type View = 'list' | 'grid';
const WIDE = '(min-width: 1024px)';
const subscribeWide = (cb: () => void) => {
  const mq = window.matchMedia(WIDE);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

function CaseStudy({ p }: { p: Project }) {
  const rows: [string, string][] = [
    ['Problem', p.problem],
    ['My role', p.role],
    ['Decisions', p.decisions],
    ['Outcome', p.outcome],
  ];
  return (
    <div className="grid gap-6 pb-10 pt-2 md:grid-cols-12">
      <dl className="grid gap-4 md:col-span-8 md:grid-cols-[9rem_1fr]">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="font-mono text-[11px] tracking-[0.2em] text-copper-hi uppercase">{k}</dt>
            <dd className="text-[16px] leading-relaxed text-bone/90">{v}</dd>
          </div>
        ))}
        {p.stack.length > 0 && (
          <div className="contents">
            <dt className="font-mono text-[11px] tracking-[0.2em] text-copper-hi uppercase">Stack</dt>
            <dd>
              <ul className="flex flex-wrap gap-2">
                {p.stack.map((s) => <li key={s} className="rounded-full border border-bone/25 px-3 py-1 font-mono text-[12px]">{s}</li>)}
              </ul>
            </dd>
          </div>
        )}
      </dl>
      <div className="md:col-span-4">
        {p.links.length > 0 ? (
          <ul className="flex flex-wrap gap-3">
            {p.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-bone px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-copper-hi">
                  {l.label} <span aria-hidden="true">↗</span><span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-mono text-xs text-ash">No public link yet.</p>
        )}
      </div>
    </div>
  );
}

function LearningBadge() {
  return <span className="ml-3 inline-block translate-y-[-0.4em] rounded-full border border-copper px-2.5 py-0.5 align-middle font-mono text-[10px] tracking-widest text-copper-hi uppercase">Learning project</span>;
}

export default function Work() {
  // Default: list on wide screens (hover preview), grid below 1024px; the toggle overrides.
  const wide = useSyncExternalStore(subscribeWide, () => window.matchMedia(WIDE).matches, () => true);
  const [chosen, setView] = useState<View | null>(null);
  const view: View = chosen ?? (wide ? 'list' : 'grid');
  const [hovered, setHovered] = useState<number | null>(null);
  const preview = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const openFromHash = (hash: string) => {
      if (!hash.startsWith('#project-')) return;
      const d = document.getElementById(hash.slice(1))?.querySelector('details');
      if (d) d.open = true;
    };
    openFromHash(location.hash);
    const onHash = () => openFromHash(location.hash);
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.('a[href^="#project-"]');
      if (a) openFromHash(a.getAttribute('href')!);
    };
    window.addEventListener('hashchange', onHash);
    document.addEventListener('click', onClick);
    return () => { window.removeEventListener('hashchange', onHash); document.removeEventListener('click', onClick); };
  }, []);

  const followCursor = view === 'list';
  const canPreview = (e: React.PointerEvent) => e.pointerType === 'mouse' && isFinePointer() && !prefersReducedMotion();
  const onMove = (e: React.PointerEvent) => {
    if (!followCursor || !canPreview(e) || !preview.current) return;
    preview.current.style.transform = `translate3d(${e.clientX - 180}px, ${e.clientY - 115}px, 0)`;
  };

  return (
    <section id="work" aria-labelledby="work-title" className="relative px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="work-title" data-reveal className="font-display text-[clamp(60px,14vw,230px)]">Work</h2>
          <div className="flex items-center gap-2 pb-3 font-mono text-sm" role="group" aria-label="Project layout">
            {(['list', 'grid'] as View[]).map((v, i) => (
              <span key={v} className="flex items-center gap-2">
                {i === 1 && <span aria-hidden="true" className="text-ash">•</span>}
                <button
                  type="button"
                  aria-pressed={view === v}
                  onClick={() => setView(v)}
                  className={`rounded-full px-3 py-1.5 transition-colors ${view === v ? 'bg-bone text-ink' : 'text-bone/70 hover:text-bone'}`}
                >
                  {v}
                </button>
              </span>
            ))}
          </div>
        </div>
        <p className="mt-2 font-mono text-xs tracking-[0.2em] text-ash">RECENT WORK — SELECT A PROJECT FOR THE CASE STUDY</p>

        <ul
          onPointerMove={onMove}
          onPointerLeave={() => setHovered(null)}
          className={view === 'list' ? 'mt-10 border-t rule' : 'mt-10 grid gap-5 sm:grid-cols-2'}
        >
          {projects.map((p, i) =>
            view === 'list' ? (
              <li key={p.slug} id={`project-${p.slug}`} className="border-b rule" onPointerEnter={(e) => canPreview(e) && setHovered(i)}>
                <details className="group">
                  <summary className="grid cursor-pointer list-none grid-cols-1 items-center gap-3 py-8 transition-[padding] duration-300 hover:pl-4 md:grid-cols-[1fr_auto] md:py-10 [&::-webkit-details-marker]:hidden">
                    <h3 className="font-display text-[clamp(38px,5.4vw,88px)] text-bone/85 transition-colors group-hover:text-bone group-open:text-copper-hi">
                      {p.name}
                      {p.learning && <LearningBadge />}
                    </h3>
                    <span className="font-mono text-xs leading-relaxed text-ash md:text-right">
                      {p.tags.join(' & ')}
                      <br />
                      {p.period}
                    </span>
                  </summary>
                  <CaseStudy p={p} />
                </details>
              </li>
            ) : (
              <li key={p.slug} id={`project-${p.slug}`} className="rounded-[1.6rem] bg-[#121214] p-3 ring-1 ring-bone/5 sm:[&:has(details[open])]:col-span-2">
                <details className="group">
                  <summary className="block cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    <span className="block overflow-hidden rounded-[1.2rem] transition-transform duration-500 group-hover:scale-[0.99]">
                      <ProjectCover project={p} index={i} />
                    </span>
                    <span className="flex items-baseline justify-between gap-4 px-2 pb-1 pt-4">
                      <h3 className="text-xl font-medium">{p.name}{p.learning && <LearningBadge />}</h3>
                      <span className="shrink-0 font-mono text-xs text-ash">{p.period}</span>
                    </span>
                  </summary>
                  <div className="px-2 pt-4"><CaseStudy p={p} /></div>
                </details>
              </li>
            ),
          )}
        </ul>

        <p className="mt-10 max-w-3xl text-sm leading-relaxed text-ash">
          <span className="font-mono text-xs tracking-[0.2em] text-bone/70">MORE LEARNING PROJECTS — </span>
          {moreProjects.join(' · ')}
        </p>
      </div>

      {/* Cursor-following preview (list view, fine pointer only) */}
      <div
        ref={preview}
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-30 hidden w-[360px] transition-[transform,opacity] duration-200 ease-out lg:block ${
          followCursor && hovered !== null ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {hovered !== null && (
          <span className="relative block rounded-2xl shadow-2xl">
            <ProjectCover project={projects[hovered]} index={hovered} />
            <span className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-copper text-sm font-medium text-ink">View</span>
          </span>
        )}
      </div>
    </section>
  );
}
