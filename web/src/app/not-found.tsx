import Emblem from '@/components/Emblem';

export default function NotFound() {
  return (
    <main id="main" className="grid min-h-[100svh] place-items-center px-5 text-center">
      <div>
        <Emblem className="mx-auto h-20 w-20 text-copper" />
        <p className="mt-8 font-mono text-xs tracking-[0.25em] text-ash">404</p>
        <h1 className="font-display mt-3 text-[clamp(48px,9vw,120px)]">This page missed the beat</h1>
        <p className="mt-6 text-bone/75">The rhythm you followed doesn&rsquo;t lead anywhere.</p>
        <a href="/" className="mt-10 inline-block rounded-full bg-copper px-6 py-3 font-medium text-ink hover:bg-copper-hi">Back home</a>
      </div>
    </main>
  );
}
