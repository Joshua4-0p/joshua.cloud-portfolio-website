import { experience } from '@/content/site';
import { Timeline } from './Community';

export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="scroll-mt-24 px-5 pt-24 md:px-10 md:pt-36">
      <div className="mx-auto max-w-[1600px]">
        <h2 id="experience-title" data-reveal className="font-display text-[clamp(48px,9vw,150px)]">Experience</h2>
        <div className="mt-12">
          <Timeline items={experience} />
        </div>
      </div>
    </section>
  );
}
