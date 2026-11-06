import { superpowers, alsoSkills } from '@/content/site';

export default function Superpowers() {
  return (
    <section id="superpowers" aria-labelledby="superpowers-title" className="section-bone px-5 pb-24 pt-10 md:px-10 md:pb-36">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex items-end justify-between gap-6">
          <h2 id="superpowers-title" data-reveal className="font-display text-[clamp(60px,14vw,230px)]">Superpowers</h2>
          <p className="hidden pb-4 pr-24 font-mono text-xs tracking-[0.2em] text-ash-deep md:block">SKILLS / WITH PROOF</p>
        </div>
        <ol className="mt-10 grid border-t border-ink lg:grid-cols-5">
          {superpowers.map((s) => (
            <li key={s.index} className="border-b border-ink/25 py-6 lg:border-b-0 lg:border-l lg:border-ink lg:px-5 lg:py-8 lg:first:border-l-0 lg:first:pl-0">
              <p className="font-mono text-xs text-ash-deep">{s.index}</p>
              <h3 className="font-display mt-3 text-[clamp(26px,2.2vw,34px)] lg:mt-8">{s.title}</h3>
              <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-1 text-[15px] leading-snug lg:block lg:min-h-64 lg:space-y-1">
                {s.skills.map((k) => <li key={k}>{k}</li>)}
              </ul>
              <p className="mt-6 font-mono text-[11px] tracking-[0.2em] text-ash-deep">PROOF</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {s.proofs.map((p) => (
                  <li key={p.label}>
                    <a href={p.href} className="inline-block rounded-full border border-ink/40 px-3 py-1 text-[13px] transition-colors hover:border-copper-deep hover:bg-ink hover:text-bone">
                      {p.label} <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <ul className="mt-10 space-y-1 font-mono text-[13px] text-ash-deep">
          {alsoSkills.map((a) => <li key={a}>+ {a}</li>)}
        </ul>
      </div>
    </section>
  );
}
