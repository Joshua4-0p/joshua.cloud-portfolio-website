// Static copper silhouette of a two-tone slit drum (carved log, slit with a low lip and a high lip, two beaters).
// Stands in for the 3D drum until Task 8, and stays as the no-JS / reduced-motion poster fallback.
export default function SlitDrumSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 360" className={className} role="img" aria-label="A carved two-tone slit drum under a warm spotlight">
      <defs>
        <linearGradient id="sd-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E8A06A" />
          <stop offset="0.45" stopColor="#C8743C" />
          <stop offset="1" stopColor="#5A2C10" />
        </linearGradient>
        <linearGradient id="sd-end" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#B86A35" />
          <stop offset="1" stopColor="#6B3514" />
        </linearGradient>
        <radialGradient id="sd-floor" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#C8743C" stopOpacity="0.45" />
          <stop offset="1" stopColor="#C8743C" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="320" cy="300" rx="290" ry="40" fill="url(#sd-floor)" />
      {/* stands */}
      <path d="M170 262 l-18 40 h52 l-12 -40z M450 262 l-12 40 h52 l-18 -40z" fill="#3A1C0A" />
      {/* log body */}
      <path d="M110 128 C110 108 128 98 150 98 H500 C526 98 540 110 540 132 V230 C540 256 522 268 496 268 H150 C126 268 110 256 110 236 Z" fill="url(#sd-wood)" />
      {/* end grain */}
      <ellipse cx="124" cy="183" rx="30" ry="84" fill="url(#sd-end)" />
      <ellipse cx="124" cy="183" rx="20" ry="60" fill="none" stroke="#E8A06A" strokeOpacity="0.45" strokeWidth="2" />
      <ellipse cx="124" cy="183" rx="10" ry="32" fill="none" stroke="#E8A06A" strokeOpacity="0.35" strokeWidth="2" />
      {/* carved geometric band */}
      <path d="M160 214 l14 -14 l14 14 l14 -14 l14 14 l14 -14 l14 14 l14 -14 l14 14 l14 -14 l14 14 l14 -14 l14 14 l14 -14 l14 14 l14 -14 l14 14 l14 -14 l14 14 l14 -14 l14 14 l14 -14 l14 14 l14 -14 l14 14 l14 -14 l14 14"
        fill="none" stroke="#2A1307" strokeOpacity="0.65" strokeWidth="3" strokeLinejoin="round" />
      <path d="M156 190 H528 M156 238 H528" stroke="#2A1307" strokeOpacity="0.5" strokeWidth="2" />
      {/* slit with two lips: low (larger, left) and high (smaller, right) */}
      <path d="M190 116 H470 C478 116 478 128 470 128 H190 C182 128 182 116 190 116 Z" fill="#160B05" />
      <rect x="350" y="112" width="12" height="20" rx="3" fill="url(#sd-wood)" />
      <path d="M206 108 H340" stroke="#F2EDE4" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
      <path d="M372 108 H456" stroke="#F2EDE4" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
      {/* beaters */}
      <g strokeLinecap="round">
        <path d="M402 74 L560 152" stroke="#2A1307" strokeWidth="7" />
        <circle cx="398" cy="72" r="13" fill="#E8A06A" />
        <path d="M430 56 L584 140" stroke="#2A1307" strokeWidth="7" />
        <circle cx="426" cy="54" r="13" fill="#C8743C" />
      </g>
    </svg>
  );
}
