'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { onDelivered } from '@/lib/drum-bus';

const SIGNAL = new THREE.Color('#4FD1C5');
const DRUM = new THREE.Vector3(0, 1.75, 0);
const TOPIC = new THREE.Vector3(0, 2.7, -2.6);
// Exactly the two real SNS subscribers — nothing implied that doesn't exist.
const SUBS = [
  { label: "Josue's inbox (email)", x: -3.3 },
  { label: 'Village archive (SQS)', x: 3.3 },
];
// drei's Html wrapper div takes pointer events by default and would swallow taps on the lips beneath a label.
const NO_HIT = { pointerEvents: 'none' } as const;
const NARROW = 560; // canvas px below which the subscribers move inward and labels wrap (phones)
const UP = 0.9, OUT = 1.1; // seconds per leg

const curve = (a: THREE.Vector3, b: THREE.Vector3, lift: number) =>
  new THREE.QuadraticBezierCurve3(a, a.clone().lerp(b, 0.5).add(new THREE.Vector3(0, lift, 0)), b);

const Label = ({ children, side = false }: { children: string; side?: boolean }) => (
  <div className={`${side ? 'translate-x-[calc(50%+30px)] ' : ''}pointer-events-none whitespace-pre rounded bg-ink/60 px-1.5 py-0.5 text-center font-mono text-[11px] leading-tight tracking-wide text-signal/90 select-none`}>{children}</div>
);

function Node({ at, size }: { at: THREE.Vector3; size: number }) {
  return (
    <group position={at}>
      <mesh>
        <octahedronGeometry args={[size, 0]} />
        <meshStandardMaterial color="#0E2B29" emissive={SIGNAL} emissiveIntensity={0.6} roughness={0.3} />
      </mesh>
      <mesh scale={2.4}>
        <sphereGeometry args={[size, 16, 12]} />
        <meshBasicMaterial color={SIGNAL} transparent opacity={0.08} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

function Packet({ meshRef }: { meshRef: (m: THREE.Group | null) => void }) {
  return (
    <group ref={meshRef} visible={false}>
      <mesh>
        <sphereGeometry args={[0.07, 16, 12]} />
        <meshBasicMaterial color="#C9FFF8" />
      </mesh>
      <mesh scale={3.2}>
        <sphereGeometry args={[0.07, 16, 12]} />
        <meshBasicMaterial color={SIGNAL} transparent opacity={0.3} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

/** Stage variant only: on each real delivery, a packet leaves the drum, reaches the SNS topic, then fans out to both subscribers. */
export default function FanOut() {
  const invalidate = useThree((s) => s.invalidate);
  // A fixed label target: drei's default flips to `events.connected` after the first label mounts and drops it.
  const gl = useThree((s) => s.gl);
  const portal = useMemo(() => ({ current: gl.domElement.parentElement! }), [gl]);
  const narrow = useThree((s) => s.size.width) < NARROW;
  const subs = useMemo(() => SUBS.map((s) => ({
    label: narrow ? s.label.replace(' (', '\n(') : s.label,
    at: new THREE.Vector3(narrow ? s.x * 0.72 : s.x, 0.35, -2.4),
  })), [narrow]);
  const up = useMemo(() => curve(DRUM, TOPIC, 0.6), []);
  const outs = useMemo(() => subs.map((s) => curve(TOPIC, s.at, 0.9)), [subs]);
  const lines = useMemo(() => {
    const m = new THREE.LineBasicMaterial({ color: SIGNAL, transparent: true, opacity: 0.18 });
    return [up, ...outs].map((c) => new THREE.Line(new THREE.BufferGeometry().setFromPoints(c.getPoints(40)), m));
  }, [up, outs]);
  const packets = useRef<(THREE.Group | null)[]>([null, null, null]);
  const t = useRef(-1); // -1 = idle
  const emailed = useRef(false);

  // Only onDelivered starts a packet: a decode whose POST failed shows nothing. The archive (SQS) gets every message;
  // the inbox leg only runs when the backend says an email actually went out.
  useEffect(() => onDelivered((d) => { emailed.current = d.emailed === true; t.current = 0; invalidate(); }), [invalidate]);

  useFrame((_, dt) => {
    if (t.current < 0) return;
    t.current += Math.min(dt, 1 / 30);
    const [p0, p1, p2] = packets.current;
    const k = t.current;
    if (p0) { p0.visible = k < UP; if (k < UP) p0.position.copy(up.getPoint(k / UP)); }
    [p1, p2].forEach((p, i) => {
      if (!p) return;
      const f = (k - UP) / OUT;
      p.visible = f >= 0 && f < 1 && (i === 1 || emailed.current); // SUBS[0] is the inbox
      if (p.visible) p.position.copy(outs[i].getPoint(f));
    });
    if (k >= UP + OUT) t.current = -1;
    invalidate();
  });

  return (
    <group>
      {lines.map((l, i) => <primitive key={i} object={l} />)}
      <Node at={TOPIC} size={0.12} />
      <Html portal={portal} position={narrow ? [TOPIC.x, TOPIC.y - 0.45, TOPIC.z] : TOPIC} center zIndexRange={[1, 0]} style={NO_HIT}><Label side={!narrow}>Amazon SNS topic</Label></Html>
      {subs.map((s) => (
        <group key={s.label}>
          <Node at={s.at} size={0.1} />
          <Html portal={portal} position={[s.at.x, s.at.y - 0.32, s.at.z]} center zIndexRange={[1, 0]} style={NO_HIT}><Label>{s.label}</Label></Html>
        </group>
      ))}
      {[0, 1, 2].map((i) => <Packet key={i} meshRef={(m) => { packets.current[i] = m; }} />)}
    </group>
  );
}
