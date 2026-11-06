import type { Project } from '@/content/site';
import Emblem from './Emblem';

// Generated typographic cover: project name in Anton on ink with a copper glow, tags, emblem glyph.
// Spans only, so it can sit inside a <summary>.
export default function ProjectCover({ project, index }: { project: Project; index?: number }) {
  return (
    <span
      aria-hidden="true"
      className="relative flex aspect-[16/10] w-full flex-col justify-between overflow-hidden rounded-[inherit] p-5 text-bone"
      style={{
        background:
          'radial-gradient(90% 70% at 85% 110%, rgb(200 116 60 / 0.55), transparent 60%), radial-gradient(60% 50% at 0% 0%, rgb(232 160 106 / 0.12), transparent 70%), #141416',
      }}
    >
      <span className="flex items-start justify-between font-mono text-[11px] uppercase tracking-widest text-copper-hi">
        <span>{index !== undefined ? `0${index + 1} · ` : ''}{project.period}</span>
        <Emblem className="h-8 w-8 text-copper" />
      </span>
      <span className="font-display block max-w-[92%] text-[clamp(28px,4vw,52px)]">{project.name}</span>
      <span className="flex flex-wrap gap-1.5">
        {project.tags.map((t) => (
          <span key={t} className="rounded-full border border-bone/30 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider">{t}</span>
        ))}
      </span>
    </span>
  );
}
