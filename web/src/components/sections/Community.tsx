import { community, experience, talks, writing, photos, profile } from '@/content/site';

function Timeline({ items }: { items: { org: string; role: string; period: string; summary: string }[] }) {
  return (
    <ol className="border-t rule">
      {items.map((e) => (
        <li key={e.org} className="grid gap-2 border-b rule py-6 md:grid-cols-12 md:gap-6">
          <p className="font-mono text-xs tracking-wide text-copper-hi md:col-span-2 md:pt-1">{e.period}</p>
          <div className="md:col-span-4">
            <h4 className="text-lg font-medium leading-snug">{e.org}</h4>
            <p className="mt-1 font-mono text-xs text-ash">{e.role}</p>
          </div>
          {e.summary.replace(/\.$/, '') !== e.role.replace(/\.$/, '') && <p className="text-[15px] leading-relaxed text-bone/80 md:col-span-6">{e.summary}</p>}
        </li>
      ))}
    </ol>
  );
}

const Label = ({ children, id }: { children: React.ReactNode; id?: string }) => (
  <h3 id={id} className="mb-6 font-mono text-xs tracking-[0.25em] text-ash">{children}</h3>
);

export default function Community() {
  const talk = talks[0];
  return (
    <section id="community" aria-labelledby="community-title" className="px-5 pb-24 pt-8 md:px-10 md:pb-36">
      <div className="mx-auto max-w-[1600px]">
        <h2 id="community-title" data-reveal className="font-display text-[clamp(48px,9vw,150px)]">
          Community <span className="text-copper">&amp;</span> Speaking
        </h2>

        <div id="experience" className="mt-16 scroll-mt-24">
          <Label>EXPERIENCE</Label>
          <Timeline items={experience} />
        </div>

        <div className="mt-20">
          <Label>COMMUNITY ROLES</Label>
          <Timeline items={community} />
        </div>

        <div id="talks" className="mt-20 grid scroll-mt-24 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Label>TALK</Label>
            <p className="font-display text-[clamp(32px,4vw,60px)]">{talk.title}</p>
            <p className="mt-4 font-mono text-xs tracking-wide text-copper-hi">{talk.date} · {talk.host}</p>
            <p className="mt-4 text-[15px] leading-relaxed text-bone/80">{talk.format}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:col-span-7">
            <figure>
              <img src="/images/flyer-640.webp" srcSet="/images/flyer-640.webp 640w, /images/flyer-1280.webp 1280w" sizes="(min-width:768px) 28vw, 45vw"
                alt="Flyer for the talk The Unbreakable Cloud — Observability & Disaster Recovery on AWS, by Cloud Builders Africa and educloud academy"
                width={640} height={625} loading="lazy" className="aspect-square w-full rounded-2xl object-cover" />
              <figcaption className="mt-2 font-mono text-[11px] text-ash">Talk flyer — 31 Oct 2026</figcaption>
            </figure>
            <figure>
              <img src="/images/speaker-640.webp" srcSet="/images/speaker-640.webp 640w, /images/speaker-1280.webp 1280w" sizes="(min-width:768px) 28vw, 45vw"
                alt="Josue in a green suit on an event stage in front of a Build Innovate Create Impact backdrop"
                width={640} height={853} loading="lazy" className="aspect-square w-full rounded-2xl object-cover object-top" />
              <figcaption className="mt-2 font-mono text-[11px] text-ash">On stage</figcaption>
            </figure>
          </div>
        </div>

        <div className="mt-20">
          <Label>IN THE ROOM</Label>
          <div tabIndex={0} role="region" aria-label="Community photos (scrolls sideways)" className="-mx-5 snap-x snap-mandatory overflow-x-auto px-5 pb-4 md:mx-0 md:overflow-visible md:px-0">
          <ul className="flex gap-4 md:grid md:grid-cols-5">
            {photos.map((p) => (
              <li key={p.src} className="w-[72vw] shrink-0 snap-start md:w-auto">
                <figure className="duotone">
                  <img src={`${p.src}-640.webp`} alt={p.alt} width={640} height={480} loading="lazy" className="aspect-[4/5] w-full rounded-2xl object-cover" />
                  <figcaption className="mt-2 font-mono text-[11px] leading-snug text-ash">{p.caption}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
          </div>
        </div>

        <div className="mt-20 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <Label>WRITING</Label>
            <ul className="border-t rule">
              {writing.map((w) => (
                <li key={w.href} className="border-b rule">
                  <a href={w.href} target="_blank" rel="noopener noreferrer" className="group flex items-start justify-between gap-6 py-5 transition-colors hover:text-copper-hi">
                    <span>
                      <span className="block text-lg leading-snug">{w.title}</span>
                      <span className="mt-1 block font-mono text-xs text-ash">{w.date} · dev.to</span>
                    </span>
                    <span aria-hidden="true" className="text-xl text-copper">↗</span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-4">
            <Label>ELSEWHERE</Label>
            <p className="text-[15px] leading-relaxed text-bone/80">
              Blog: <a className="underline decoration-copper underline-offset-4 hover:text-copper-hi" href={profile.links.devto}>dev.to/joshuaer</a>
              <br />
              AWS Builder Center: <span className="font-mono">{profile.builderCenterHandle}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
