"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, ContactShadows } from "@react-three/drei";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import * as THREE from "three";

function SkateboardModel({ scrollYProgress }: { scrollYProgress: any }) {
  const { scene } = useGLTF("/skateboard-opt.glb");
  const ref = useRef<THREE.Group>(null);

  // Map scroll progress (0 → 1) to position and rotation
  const x = useTransform(scrollYProgress, [0, 1], [-8, 8]);
  const zRot = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 2 * 5]); // 5 full rolls

  useFrame(() => {
    if (ref.current) {
      ref.current.position.x = x.get();
      ref.current.rotation.z = zRot.get();
    }
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={1.2}
      position={[-8, -1, 0]}
      rotation={[0.2, 0, 0]}
    />
  );
}

export default function SkateboardScrollScene() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed bottom-0 left-0 w-full h-[300px] pointer-events-none"
      style={{ zIndex: 10 }}
    >
      <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <ContactShadows position={[0, -1, 0]} scale={20} blur={2.5} opacity={0.5} />
        <SkateboardModel scrollYProgress={scrollYProgress} />
      </Canvas>
    </motion.div>
  );
}
