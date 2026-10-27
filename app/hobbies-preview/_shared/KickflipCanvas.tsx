"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { FlatSkateboard } from "./Skateboard";
import { usePalette } from "./usePalette";

const FLIP_SECONDS = 0.9;

// Board that idles with a slow turn and does a kickflip (pop, spin around its
// length, land) every time `flipKey` changes.
function FlippingBoard({ flipKey }: { flipKey: number }) {
  const outer = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const start = useRef<number | null>(null);

  useEffect(() => {
    start.current = null; // restart on next frame
    if (flipKey > 0) start.current = -1;
  }, [flipKey]);

  useFrame((state, delta) => {
    if (!outer.current || !spin.current) return;
    outer.current.rotation.y += delta * 0.35;

    if (start.current === -1) start.current = state.clock.elapsedTime;
    if (start.current !== null) {
      const t = Math.min(1, (state.clock.elapsedTime - start.current) / FLIP_SECONDS);
      spin.current.position.y = Math.sin(t * Math.PI) * 1.4;
      spin.current.rotation.x = t * Math.PI * 2; // one full flip around the length
      spin.current.rotation.z = Math.sin(t * Math.PI) * 0.35; // pop the nose up
      if (t >= 1) {
        start.current = null;
        spin.current.rotation.set(0, 0, 0);
        spin.current.position.y = 0;
      }
    }
  });

  return (
    <group ref={outer}>
      <group ref={spin}>
        <FlatSkateboard length={3.2} />
      </group>
    </group>
  );
}

export default function KickflipCanvas({ flipKey }: { flipKey: number }) {
  const palette = usePalette();
  return (
    <Canvas camera={{ position: [0, 1.8, 5], fov: 40 }} dpr={[1, 2]}>
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} />
      <pointLight position={[-3, 2, -2]} intensity={8} color={palette.accent} />
      <Suspense fallback={null}>
        <group position={[0, -0.2, 0]}>
          <FlippingBoard flipKey={flipKey} />
        </group>
      </Suspense>
      <ContactShadows position={[0, -0.6, 0]} opacity={0.45} blur={2.2} scale={8} color={palette.accent} />
    </Canvas>
  );
}
