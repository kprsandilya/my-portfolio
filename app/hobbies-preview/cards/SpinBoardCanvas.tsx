"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FlatSkateboard } from "../_shared/Skateboard";
import { usePalette } from "../_shared/usePalette";

function Spinner() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.9;
  });
  return (
    <group ref={ref} rotation={[0.5, 0, 0]}>
      <FlatSkateboard length={3} />
    </group>
  );
}

// Small spinning board used as the Skateboarding card's art.
export default function SpinBoardCanvas() {
  const palette = usePalette();
  return (
    <Canvas camera={{ position: [0, 1.2, 4.2], fov: 40 }} dpr={[1, 2]}>
      <ambientLight intensity={1.3} />
      <directionalLight position={[3, 4, 3]} intensity={1.4} />
      <pointLight position={[-2, 1, 2]} intensity={6} color={palette.accent} />
      <Suspense fallback={null}>
        <Spinner />
      </Suspense>
    </Canvas>
  );
}
