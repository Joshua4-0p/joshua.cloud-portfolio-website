import { achievements } from '@/content/site';
import Emblem from '../Emblem';

export default function Recognition() {
  return (
    <section id="achievements" aria-labelledby="achievements-title" className="px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1600px]">
        <h2 id="achievements-title" data-reveal className="font-display text-[clamp(56px,11vw,180px)]">Recognition</h2>
        <ul className="mt-10 border-t rule">
          {achievements.map((a, i) => {
            const body = (
              <>
                <Emblem className={`h-7 w-7 shrink-0 ${i === 0 ? 'text-copper' : 'text-ash'}`} />
                <span className="flex-1">
                  <span className="font-display text-[clamp(22px,2.6vw,40px)]">{a.name}</span>
                  {a.date && <sup className="ml-2 font-mono text-[11px] tracking-wide text-copper-hi">{a.date}</sup>}
                  <span className="mt-1 block font-mono text-xs tracking-wide text-ash md:mt-0 md:inline md:pl-4">{a.issuer}</span>
                </span>
                {a.href && (
                  <span aria-hidden="true" className="text-2xl text-copper transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
                )}
              </>
            );
            return (
              <li key={a.name} className="border-b rule">
                {a.href ? (
                  <a href={a.href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-5 py-5 transition-colors hover:text-copper-hi md:py-6">
                    {body}
                    <span className="sr-only">(credential, opens in a new tab)</span>
                  </a>
                ) : (
                  <div className="flex items-center gap-5 py-5 md:py-6">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
