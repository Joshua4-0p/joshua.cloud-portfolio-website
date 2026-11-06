// Original line-art emblem: a fist holding two crossed drumsticks inside a ring with a zig-zag band.
// Drawn from scratch on a 64×64 grid. Keep public/favicon.svg in sync when changing the paths.
export const EMBLEM_BAND =
  'M32.0 6.4L37.7 3.4L41.8 8.3L48.2 7.7L50.1 13.9L56.3 15.8L55.7 22.2L60.6 26.3L57.6 32.0L60.6 37.7L55.7 41.8L56.3 48.2L50.1 50.1L48.2 56.3L41.8 55.7L37.7 60.6L32.0 57.6L26.3 60.6L22.2 55.7L15.8 56.3L13.9 50.1L7.7 48.2L8.3 41.8L3.4 37.7L6.4 32.0L3.4 26.3L8.3 22.2L7.7 15.8L13.9 13.9L15.8 7.7L22.2 8.3L26.3 3.4L32.0 6.4';

export default function Emblem({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <path d={EMBLEM_BAND} strokeWidth={1.4} />
      <circle cx="32" cy="32" r="22.5" />
      {/* drumsticks */}
      <path d="M19 47 L42 16 M45 47 L22 16" />
      <circle cx="42.6" cy="15.2" r="2.2" />
      <circle cx="21.4" cy="15.2" r="2.2" />
      {/* fist (filled to sit in front of the sticks) */}
      <rect x="23" y="29" width="18" height="13" rx="4.5" style={{ fill: 'var(--emblem-bg, #0B0B0C)' }} />
      <path d="M27.5 29v4.5 M32 29v4.5 M36.5 29v4.5" strokeWidth={1.6} />
      <path d="M23.5 36.5h9.5a2.2 2.2 0 0 0 0-4.4h-3" strokeWidth={1.6} />
      <path d="M27 42v5h10v-5" />
    </svg>
  );
}
