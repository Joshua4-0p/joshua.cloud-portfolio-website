import { profile } from '@/content/site';
import MagneticButton from '../MagneticButton';
import BueaClock from '../BueaClock';

const pills = [
  { label: profile.email, href: `mailto:${profile.email}` },
  { label: 'LinkedIn', href: profile.links.linkedin },
  { label: 'GitHub', href: profile.links.github },
  { label: 'dev.to', href: profile.links.devto },
];

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden px-5 pb-16 pt-28 md:px-10 md:pt-40"
      style={{ background: 'radial-gradient(60% 50% at 20% 0%, rgb(200 116 60 / 0.14), transparent 70%), #111113' }}>
      <div className="mx-auto max-w-[1600px]">
        <h2 id="contact-title" className="font-display flex flex-wrap items-center gap-x-6 text-[clamp(64px,15vw,250px)]">
          <span className="inline-flex items-center gap-[0.12em]">
            <img src="/images/headshot-640.webp" alt="" width={640} height={640} loading="lazy"
              className="inline-block h-[0.7em] w-[0.7em] rounded-full object-cover ring-2 ring-copper" />
            Let&rsquo;s
          </span>
          <span>build</span>
        </h2>

        <div className="relative mt-12 border-t rule pt-12">
          <MagneticButton href={`mailto:${profile.email}`} className="absolute -top-20 right-4 h-36 w-36 bg-copper text-base font-medium text-ink md:-top-24 md:right-24 md:h-48 md:w-48 md:text-lg">
            Get in touch
          </MagneticButton>
          <ul className="flex flex-wrap gap-3 pt-16 md:pt-4">
            {pills.map((p) => (
              <li key={p.href}>
                <a href={p.href} className="inline-block rounded-full border border-bone/30 px-6 py-4 text-[15px] transition-colors hover:border-copper hover:bg-copper hover:text-ink"
                  {...(p.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                  {p.label}
                </a>
              </li>
            ))}
          </ul>
          <dl className="mt-16 grid gap-6 font-mono text-xs tracking-wide sm:grid-cols-3">
            <div><dt className="text-ash">LOCAL TIME</dt><dd className="mt-1 text-bone"><BueaClock /> · Buea</dd></div>
            <div><dt className="text-ash">BASED IN</dt><dd className="mt-1 text-bone">{profile.location}</dd></div>
            <div><dt className="text-ash">STATUS</dt><dd className="mt-1 text-bone">{profile.status}</dd></div>
          </dl>
        </div>
      </div>
    </section>
  );
}
