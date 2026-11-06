import type { Metadata } from 'next';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { profile } from '@/content/site';
import Emblem from '@/components/Emblem';
import Footer from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: 'How this site is built — Tiaya Fotseu Josue',
  description: 'Architecture of the Talking Drum portfolio: Next.js static export on AWS Amplify Hosting, and a Drum Telegraph on API Gateway, Lambda, DynamoDB and SNS, built with AWS CDK.',
  alternates: { canonical: '/how-it-works/' },
};

// Read at build time and inlined, so the diagram's text is in the HTML. Same file is docs/architecture.svg.
const diagram = readFileSync(path.join(process.cwd(), 'public/architecture.svg'), 'utf8');

// Copy describes the final architecture. The API path (API Gateway → Lambda → DynamoDB + SNS → email + SQS) and
// monitoring are deployed in Phase 2 of the build plan, before submission.
const services: [string, string, string][] = [
  ['AWS Amplify Hosting', 'Builds every push from GitHub and serves the static site through CloudFront, with security headers.', '~$0'],
  ['Amazon API Gateway', 'HTTP API with GET /drum and POST /drum, throttled to 2 requests/s (burst 10), CORS locked to this site.', '~$0'],
  ['AWS Lambda', 'Node.js 22 on arm64, 128 MB: validates the phrase, counts it, publishes it.', '~$0 (free tier)'],
  ['Amazon DynamoDB', 'On-demand table holding the "rhythms have crossed the cloud" counter.', '~$0'],
  ['Amazon SNS', 'Topic drum-telegraph fans each phrase out to two subscribers; topic ops-alerts carries alarms.', '~$0'],
  ['Amazon SQS', 'Queue village-archive: the second subscriber, keeps every phrase for 4 days (encrypted).', '~$0'],
  ['Amazon CloudWatch Synthetics', 'Hourly canary opens the live site and checks the drum hint is there.', '~$0.74'],
  ['AWS Budgets', 'Monthly cost budget with alerts at $1 and $5.', '$0'],
];

const headers = [
  ['Strict-Transport-Security', 'max-age=31536000; includeSubDomains'],
  ['Content-Security-Policy', "default-src 'self'; connect-src limited to the drum API; frame-ancestors 'none'"],
  ['X-Content-Type-Options', 'nosniff'],
  ['Referrer-Policy', 'strict-origin-when-cross-origin'],
  ['Permissions-Policy', 'camera=(), microphone=(), geolocation=()'],
  ['X-Frame-Options', 'DENY'],
];

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-display mb-6 mt-20 text-[clamp(36px,5vw,64px)]">{children}</h2>
);

export default function HowItWorks() {
  return (
    <>
      <header className="px-5 py-6 md:px-10">
        <a href="/" className="inline-flex items-center gap-2.5 text-bone">
          <Emblem className="h-9 w-9 text-copper" />
          <span className="font-mono text-sm tracking-[0.2em]">JOSUE</span>
          <span className="sr-only">— back to the portfolio</span>
        </a>
      </header>
      <main id="main" className="px-5 pb-24 md:px-10">
        <div className="mx-auto max-w-[1240px]">
          <p className="mt-10 font-mono text-xs tracking-[0.25em] text-copper-hi">{profile.tagline.toUpperCase()}</p>
          <h1 className="font-display mt-4 text-[clamp(56px,10vw,150px)]">How this site is built</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-bone/85">
            A drummer publishes one rhythm and every village in earshot receives it. That is publish/subscribe, and it is what
            Amazon SNS does. This portfolio is a static Next.js site on AWS Amplify Hosting; when you play a phrase on the
            Talking Drum, it travels through a small serverless system defined in AWS CDK and fans out to two real subscribers.
          </p>

          <H2>Architecture</H2>
          <div className="overflow-x-auto rounded-3xl" dangerouslySetInnerHTML={{ __html: diagram }} />
          <ol className="mt-8 grid gap-4 text-[15px] leading-relaxed text-bone/85 md:grid-cols-3">
            <li><span className="font-mono text-xs text-copper-hi">01 DEPLOY — </span>Every push to GitHub triggers Amplify CI/CD, which exports static HTML, runs a personal-data check and publishes it on CloudFront.</li>
            <li><span className="font-mono text-xs text-signal">02 A PHRASE — </span>Four beats are POSTed as <code className="font-mono">{'{"phrase":"LLHL"}'}</code>. Lambda checks it against <code className="font-mono">^[LH]{'{4}'}$</code>, adds 1 in DynamoDB and publishes to SNS, which delivers to email and SQS.</li>
            <li><span className="font-mono text-xs text-copper-hi">03 WATCH — </span>A canary opens the site every hour. Alarms on the canary and on Lambda errors email me through a second SNS topic. Budgets warn at $1 and $5.</li>
          </ol>
          <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-bone/70">
            The site never waits for the API: the drum decodes instantly in the browser, and the call has a 3-second timeout. If it
            fails, you still get your message — only the “Delivered via Amazon SNS” line is missing.
          </p>

          <H2>AWS services</H2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
              <caption className="sr-only">AWS services used, their purpose and estimated monthly cost</caption>
              <thead className="font-mono text-xs tracking-[0.15em] text-ash">
                <tr className="border-b rule"><th scope="col" className="py-3 pr-6 font-normal">SERVICE</th><th scope="col" className="py-3 pr-6 font-normal">PURPOSE</th><th scope="col" className="py-3 font-normal">EST. / MONTH</th></tr>
              </thead>
              <tbody>
                {services.map(([name, purpose, cost]) => (
                  <tr key={name} className="border-b rule align-top">
                    <th scope="row" className="py-4 pr-6 font-medium">{name}</th>
                    <td className="py-4 pr-6 text-bone/80">{purpose}</td>
                    <td className="py-4 font-mono text-sm text-copper-hi">{cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 font-mono text-xs text-ash">Expected total: under $1 a month at portfolio traffic.</p>

          <div className="grid gap-x-16 md:grid-cols-2">
            <div>
              <H2>Security</H2>
              <ul className="space-y-3 text-[15px]">
                {headers.map(([k, v]) => (
                  <li key={k}><span className="font-mono text-sm text-copper-hi">{k}</span><br /><span className="text-bone/75">{v}</span></li>
                ))}
              </ul>
              <p className="mt-6 text-[15px] leading-relaxed text-bone/75">
                Least-privilege IAM via CDK grants (the function can only update its table and publish to its topic). Inputs longer
                than 200 bytes or not matching the phrase pattern are rejected before anything is written.
              </p>
            </div>
            <div>
              <H2>Stack</H2>
              <ul className="space-y-2 text-[15px] text-bone/85">
                <li>Next.js (static export) · TypeScript · Tailwind CSS</li>
                <li>GSAP + Lenis for motion · Web Audio API for every sound (no audio files)</li>
                <li>AWS CDK v2 (TypeScript) for all infrastructure · us-east-1</li>
                <li>Vitest + Playwright + axe for tests</li>
              </ul>
              <ul className="mt-8 flex flex-wrap gap-3">
                <li><a className="inline-block rounded-full border border-bone/30 px-5 py-2.5 text-sm hover:border-copper hover:text-copper-hi" href={`${profile.links.repo}/tree/main/web`}>Front end: web/ ↗</a></li>
                <li><a className="inline-block rounded-full border border-bone/30 px-5 py-2.5 text-sm hover:border-copper hover:text-copper-hi" href={`${profile.links.repo}/tree/main/infra`}>Infrastructure: infra/ ↗</a></li>
              </ul>
            </div>
          </div>

          <p className="mt-20"><a href="/#drum" className="font-display text-[clamp(32px,4vw,56px)] text-copper hover:text-copper-hi">← Back to the drum</a></p>
        </div>
      </main>
      <Footer />
    </>
  );
}
