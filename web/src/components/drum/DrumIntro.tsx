import { DRUM_MESSAGES, CULTURAL_FRAMING, profile } from '@/content/site';

// Static, no-JS part of the drum section: heading, what the feature is, and every message as text.
export function DrumHeading() {
  return (
    <>
      <p className="font-mono text-xs tracking-[0.25em] text-copper-hi">THE ONE CREATIVE FEATURE</p>
      <h2 id="drum-title" className="font-display mt-4 text-[clamp(56px,11vw,180px)]">The Talking Drum</h2>
      <p className="mt-4 max-w-2xl text-[clamp(20px,2vw,28px)] leading-snug">{profile.tagline}</p>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-bone/75">
        Play a phrase of four beats on the two-tone slit drum — low and high — and the drum answers with a message about me.
        Every phrase is also sent through Amazon API Gateway, AWS Lambda, Amazon DynamoDB and Amazon SNS. Eight messages to
        decode; a secret phrase opens Stage Mode.
      </p>
      <p className="mt-3 font-mono text-[11px] tracking-wide text-ash">Instrument {CULTURAL_FRAMING}.</p>
    </>
  );
}

export function AllMessages() {
  return (
    <details className="mt-8 max-w-3xl rounded-2xl border border-bone/15 px-5 py-4">
      <summary className="-my-4 flex min-h-11 cursor-pointer items-center font-mono text-xs tracking-[0.2em] text-bone/80">ALL 8 MESSAGES (TEXT VERSION)</summary>
      <ol className="mt-4 list-decimal space-y-2 pl-6 text-[15px] leading-relaxed text-bone/85">
        {DRUM_MESSAGES.map((m) => <li key={m}>{m}</li>)}
      </ol>
    </details>
  );
}
