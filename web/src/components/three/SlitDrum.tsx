'use client';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';
import type { Tone } from '@/lib/drum-engine';
import { onHit, requestHit } from '@/lib/drum-bus';
import { audio } from '@/lib/audio';
import { soundOnFirstHit } from '../SoundPill';
import type { Variant } from './DrumCanvas';

const LEN = 3.4, R = 0.62, Y = 0.95; // log length, radius, axis height
const TOP = Y + R * 1.03; // top of the log's belly, where the slit is cut
const COPPER_HI = new THREE.Color('#E8A06A');

// Seeded, so every render (and the poster) gets the same grain.
function rng(seed: number) {
  return () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** Procedural wood: long streaks running along the log (u = around, v = along). No external textures. */
function woodTexture() {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 256;
  const g = c.getContext('2d')!;
  const r = rng(7);
  for (let x = 0; x < c.width; x += 2) {
    const l = 34 + r() * 12 + Math.sin(x * 0.05) * 6;
    g.fillStyle = `hsl(${24 + r() * 6} 42% ${l}%)`;
    g.fillRect(x, 0, 2, c.height);
  }
  g.globalAlpha = 0.35;
  for (let i = 0; i < 140; i++) {
    g.strokeStyle = r() > 0.5 ? '#2A1307' : '#E8A06A';
    g.lineWidth = 0.5 + r() * 1.5;
    const x = r() * c.width;
    g.beginPath(); g.moveTo(x, 0);
    g.bezierCurveTo(x + r() * 16 - 8, c.height * 0.33, x + r() * 16 - 8, c.height * 0.66, x + r() * 10 - 5, c.height);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** Log profile for a lathe around Y (later laid along X): flat ends with a softened rim and a slight belly. */
function logProfile() {
  const pts: THREE.Vector2[] = [new THREE.Vector2(0, -LEN / 2)];
  for (let i = 0; i <= 24; i++) {
    const y = -LEN / 2 + (LEN * i) / 24;
    const edge = Math.min(1, (LEN / 2 - Math.abs(y)) / 0.08); // round the rim
    const belly = 1 + 0.03 * Math.cos((y / LEN) * Math.PI); // slight taper toward the ends
    pts.push(new THREE.Vector2(R * belly * (0.9 + 0.1 * Math.sqrt(edge)), y));
  }
  pts.push(new THREE.Vector2(0, LEN / 2));
  return pts;
}

// Lip layout along the slit: the low lip is the larger tongue.
const LIPS: Record<Tone, { x: number; len: number }> = { L: { x: -0.62, len: 1.25 }, H: { x: 0.62, len: 0.8 } };

export default function SlitDrum({ variant }: { variant: Variant }) {
  const invalidate = useThree((s) => s.invalidate);
  const wood = useMemo(() => woodTexture(), []);
  const profile = useMemo(() => logProfile(), []);
  const body = useRef<THREE.Group>(null);
  const lipMat = useRef<Record<Tone, THREE.MeshStandardMaterial | null>>({ L: null, H: null });
  const beater = useRef<Record<Tone, THREE.Group | null>>({ L: null, H: null });
  const ripple = useRef<THREE.Mesh>(null);
  const anim = useRef({ dip: 0, vel: 0, glow: { L: 0, H: 0 }, ripple: 1 });

  const strike = useCallback((t: Tone) => {
    const a = anim.current;
    a.vel += 0.5; a.glow[t] = 1; a.ripple = 0;
    invalidate();
  }, [invalidate]);

  // The stage drum follows every counted hit (pads, keys, its own lips via requestHit).
  useEffect(() => (variant === 'stage' ? onHit(strike) : undefined), [variant, strike]);

  const hitLip = (t: Tone) => {
    if (variant === 'stage') { requestHit(t); return; }
    // Hero teaser: a note and a ripple, never counted toward phrases.
    soundOnFirstHit();
    audio.drum(t);
    strike(t);
  };
  // One physical hit = one hitLip. Mouse/pen: on pointerdown (same-frame feedback). Touch: on the click that follows a
  // tap, because a pan that starts on a lip sends pointercancel and no click, so a scroll never plays the drum.
  const touchDown = useRef(false);
  const lipDown = (t: Tone) => (e: ThreeEvent<PointerEvent>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.stopPropagation();
    touchDown.current = e.pointerType === 'touch';
    if (!touchDown.current) hitLip(t);
  };
  const lipClick = (t: Tone) => () => {
    audio.unlock();
    if (!touchDown.current) return;
    touchDown.current = false;
    hitLip(t);
  };

  useFrame((state, dt) => {
    const a = anim.current;
    dt = Math.min(dt, 1 / 30);
    // Damped spring: the drum dips ~2–3 % and settles with a small bounce.
    a.vel += (-260 * a.dip - 16 * a.vel) * dt;
    a.dip = Math.min(0.03, a.dip + a.vel * dt);
    let busy = Math.abs(a.dip) > 1e-4 || Math.abs(a.vel) > 1e-3;
    for (const t of ['L', 'H'] as Tone[]) {
      a.glow[t] *= Math.exp(-dt * 5);
      if (a.glow[t] < 0.005) a.glow[t] = 0; else busy = true;
      const m = lipMat.current[t];
      if (m) m.emissiveIntensity = a.glow[t] * 2.2;
      const b = beater.current[t];
      if (b) b.rotation.z = (t === 'L' ? -1 : 1) * a.glow[t] * 0.35;
    }
    if (a.ripple < 1) {
      a.ripple = Math.min(1, a.ripple + dt / 0.9);
      busy = true;
    }
    if (ripple.current) {
      ripple.current.scale.setScalar(1 + a.ripple * 3.5);
      (ripple.current.material as THREE.MeshBasicMaterial).opacity = (1 - a.ripple) * 0.55;
    }
    if (body.current) {
      body.current.scale.setScalar(1 - a.dip);
      if (variant === 'hero') body.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.35) * THREE.MathUtils.degToRad(8);
    }
    if (busy || variant === 'hero') invalidate();
  });

  const hover = (on: boolean) => () => { document.body.style.cursor = on ? 'pointer' : ''; };
  useEffect(() => () => { document.body.style.cursor = ''; }, []); // unmounting under a hovered lip must not leave the pointer

  return (
    <group>
      <group ref={body} position={[0, 0, 0]} rotation-y={-0.2}>
        {/* the carved log */}
        <mesh position={[0, Y, 0]} rotation-z={Math.PI / 2} castShadow receiveShadow>
          <latheGeometry args={[profile, 64]} />
          <meshStandardMaterial map={wood} roughness={0.6} metalness={0.1} />
        </mesh>
        {/* a ring of copper studs near each end */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * (LEN / 2 - 0.42), Y, 0]} rotation-y={Math.PI / 2}>
            {Array.from({ length: 22 }, (_, i) => {
              const a = (i / 22) * Math.PI * 2;
              return (
                <mesh key={i} position={[Math.cos(a) * R * 1.02, Math.sin(a) * R * 1.02, 0]}>
                  <sphereGeometry args={[0.022, 8, 6]} />
                  <meshStandardMaterial color="#E8A06A" roughness={0.3} metalness={0.9} />
                </mesh>
              );
            })}
          </group>
        ))}
        {/* the slit: a dark groove, sunk below a thin bevelled rim, with two rounded tongues (lips) in it */}
        <mesh position={[0, TOP - 0.01, 0]}>
          <boxGeometry args={[2.55, 0.03, 0.36]} />
          <meshStandardMaterial color="#050201" roughness={1} />
        </mesh>
        {[-1, 1].map((s) => (
          <group key={s}>
            <mesh position={[0, TOP + 0.002, s * 0.195]}>
              <boxGeometry args={[2.63, 0.03, 0.03]} />
              <meshStandardMaterial color="#6A3517" roughness={0.5} metalness={0.2} />
            </mesh>
            <mesh position={[s * 1.3, TOP + 0.002, 0]}>
              <boxGeometry args={[0.04, 0.03, 0.42]} />
              <meshStandardMaterial color="#6A3517" roughness={0.5} metalness={0.2} />
            </mesh>
          </group>
        ))}
        {(['L', 'H'] as Tone[]).map((t) => (
          <group key={t} position={[LIPS[t].x, TOP + 0.006, 0]}>
            <RoundedBox args={[LIPS[t].len, 0.04, 0.22]} radius={0.018} smoothness={3} castShadow>
              <meshStandardMaterial
                ref={(m) => { lipMat.current[t] = m; }}
                color={t === 'L' ? '#7A3A16' : '#A0532A'}
                roughness={0.45}
                metalness={0.25}
                emissive={COPPER_HI}
                emissiveIntensity={0}
              />
            </RoundedBox>
            {/* invisible, generous hit area (raycasts ignore `visible`), so a tap needn't land on the thin lip */}
            <mesh visible={false} position-y={0.12} onPointerDown={lipDown(t)} onClick={lipClick(t)} onPointerOver={hover(true)} onPointerOut={hover(false)}>
              <boxGeometry args={[LIPS[t].len - 0.04, 0.32, 0.7]} />
            </mesh>
          </group>
        ))}
        {/* cradle */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 1.05, 0.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.28, 0.4, 1.0]} />
            <meshStandardMaterial color="#2A1307" roughness={0.75} />
          </mesh>
        ))}
        {/* two beaters, poised over their lips; they dip on a strike */}
        {(['L', 'H'] as Tone[]).map((t) => {
          const s = t === 'L' ? -1 : 1;
          return (
            <group key={t} ref={(g) => { beater.current[t] = g; }} position={[LIPS[t].x + s * 0.9, TOP + 0.5, 0.3 * s]}>
              <group rotation-z={s * 0.55}>
                <mesh position={[0, 0, 0]} rotation-z={Math.PI / 2} castShadow>
                  <cylinderGeometry args={[0.028, 0.034, 1.3, 12]} />
                  <meshStandardMaterial color="#3A1C0A" roughness={0.7} />
                </mesh>
                <mesh position={[-s * 0.68, 0, 0]} castShadow>
                  <sphereGeometry args={[t === 'L' ? 0.11 : 0.09, 24, 16]} />
                  <meshStandardMaterial color={t === 'L' ? '#C8743C' : '#E8A06A'} roughness={0.4} metalness={0.35} />
                </mesh>
              </group>
            </group>
          );
        })}
      </group>
      {/* floor ripple on each hit */}
      <mesh ref={ripple} position={[0, 0.01, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.95, 1.0, 96]} />
        <meshBasicMaterial color={COPPER_HI} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}
