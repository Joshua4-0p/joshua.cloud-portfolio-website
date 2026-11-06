'use client';
import { useEffect, useSyncExternalStore } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { MeshReflectorMaterial } from '@react-three/drei';
import SlitDrum from './SlitDrum';
import FanOut from './FanOut';
import type { Variant } from './DrumCanvas';

// Stage Mode is `data-stage="on"` on <html> (set by DrumSection); watch it without touching the drum state.
const subStage = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-stage'] });
  return () => mo.disconnect();
};
const isStage = () => document.documentElement.dataset.stage === 'on';

const LOOK = {
  quiet: { bg: '#0B0B0C', ambient: 0.35, key: '#FFC48E', rim: '#E8A06A', keyI: 260, rimI: 160 },
  stage: { bg: '#140A05', ambient: 0.08, key: '#FF9C52', rim: '#FF7A2E', keyI: 320, rimI: 200 },
};

/** Re-render once when the stage look changes or the canvas scrolls back into view (frameloop is "demand"). */
function Kick({ stage, active }: { stage: boolean; active: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => { if (active) invalidate(); }, [invalidate, stage, active]);
  return null;
}

export default function Stage({ variant, active, onReady }: { variant: Variant; active: boolean; onReady: () => void }) {
  const stage = useSyncExternalStore(subStage, isStage, () => false);
  const l = stage ? LOOK.stage : LOOK.quiet;
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? 'demand' : 'never'}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      shadows="percentage"
      camera={{ position: [0, 5.2, 6.9], fov: 34 }}
      onCreated={({ camera }) => { camera.lookAt(0, 0.9, -0.9); requestAnimationFrame(onReady); }}
      style={{ touchAction: 'pan-y' }}
    >
      <Kick stage={stage} active={active} />
      <color attach="background" args={[l.bg]} />
      <fog attach="fog" args={[l.bg, 7, 17]} />
      <ambientLight intensity={l.ambient} color="#FFD9B8" />
      <spotLight position={[-3, 6, 4]} angle={0.42} penumbra={0.9} intensity={l.keyI} color={l.key} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0004} />
      <spotLight position={[4, 4.5, -3.5]} angle={0.5} penumbra={1} intensity={l.rimI} color={l.rim} />
      <SlitDrum variant={variant} />
      {variant === 'stage' && <FanOut />}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <MeshReflectorMaterial
          resolution={512}
          blur={[0, 0]}
          mixBlur={1}
          mixStrength={40}
          roughness={0.75}
          depthScale={1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.3}
          color={stage ? '#1E0F07' : '#17130F'}
          metalness={0.45}
          mirror={0.75}
        />
      </mesh>
    </Canvas>
  );
}
