import { profile, recommendation } from '@/content/site';
import MagneticButton from '../MagneticButton';

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section-bone relative px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto grid max-w-[1400px] gap-14 md:grid-cols-12">
        <div className="md:col-span-7">
          <h2 id="about-title" className="mb-8 font-mono text-xs tracking-[0.25em] text-ash-deep">ABOUT</h2>
          <p data-reveal className="text-[clamp(26px,3.2vw,46px)] leading-[1.18] tracking-tight">{profile.aboutLead}</p>

          <figure className="mt-14 max-w-xl border-l-2 border-copper pl-6">
            <blockquote className="text-lg leading-relaxed">“{recommendation.quote}”</blockquote>
            <figcaption className="mt-3 font-mono text-xs tracking-wide text-ash-deep">
              {recommendation.author} — {recommendation.context}
            </figcaption>
          </figure>
        </div>

        <div className="md:col-span-5 md:pt-14">
          <p className="text-[17px] leading-relaxed">{profile.aboutStory}</p>
          <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 font-mono text-[13px]">
            <dt className="text-ash-deep">NOW</dt>
            <dd>
              <ul>{profile.now.map((n) => <li key={n}>{n}</li>)}</ul>
            </dd>
            <dt className="text-ash-deep">STUDY</dt>
            <dd>{profile.degree}</dd>
            <dt className="text-ash-deep">LANGUAGES</dt>
            <dd>{profile.languages}</dd>
            <dt className="text-ash-deep">BASED</dt>
            <dd>{profile.location} ({profile.origin})</dd>
          </dl>
          <div className="mt-10 flex items-end gap-8">
            <div className="relative h-56 w-44 shrink-0 overflow-hidden rounded-2xl md:h-72 md:w-56">
              <img
                data-parallax
                src="/images/headshot-640.webp"
                srcSet="/images/headshot-640.webp 640w, /images/headshot-1280.webp 1280w"
                sizes="(min-width: 768px) 224px, 176px"
                alt={`Portrait of ${profile.name}`}
                width={640}
                height={640}
                loading="lazy"
                className="h-[112%] w-full object-cover"
              />
            </div>
            <MagneticButton href="#superpowers" className="h-32 w-32 bg-ink text-sm text-bone md:h-40 md:w-40">
              More about me
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
