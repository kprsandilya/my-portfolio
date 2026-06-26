"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, ContactShadows, Line } from "@react-three/drei";
import { motion, useScroll } from "framer-motion";
import { useRef } from "react";
import * as THREE from "three";

function makeSpiralCurve() {
  const turns = 3.25;
  const startRadius = 4.2;
  const endRadius = 0.8;
  const samples = 260;

  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const angle = t * turns * Math.PI * 2;
    const radius = THREE.MathUtils.lerp(startRadius, endRadius, t);

    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    const y = -1;

    points.push(new THREE.Vector3(x, y, z));
  }

  return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.1);
}

function SkateboardModel({
  scrollYProgress,
  curve,
}: {
  scrollYProgress: any;
  curve: THREE.CatmullRomCurve3;
}) {
  const { scene } = useGLTF("/skateboard-opt.glb");
  const ref = useRef<THREE.Group>(null);

  // Convert framer-motion MotionValue → number every frame
  const tRef = useRef(0);
  const lastPosRef = useRef<THREE.Vector3 | null>(null);
  const distanceRef = useRef(0);

  useFrame(() => {
    if (!ref.current) return;

    // Read current t between 0 and 1
    tRef.current = scrollYProgress.get();

    // Clamp for safety
    const t = Math.min(1, Math.max(0, tRef.current));

    // Sample the curve at this point
    const pos = curve.getPointAt(t);

    // Set skateboard position along the curve
    ref.current.position.set(pos.x, pos.y, pos.z);
    

    // Get curve tangent direction for natural facing
    const tangent = curve.getTangentAt(t);
    const lookAtPos = pos.clone().add(tangent) // instead of add()
    ref.current.lookAt(lookAtPos);

    ref.current.rotation.y *= -1;

    if (lastPosRef.current) {
      distanceRef.current += pos.distanceTo(lastPosRef.current);
    }
    lastPosRef.current = pos.clone();

    // Add a simple "rolling" rotation (model-dependent axis)
    ref.current.rotation.z = -distanceRef.current * 1.25;
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={2.5}
      rotation={[30, 45, 0.2]}
    />
  );
}



export default function SkateboardScrollScene({ targetRef }: { targetRef: any }) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],  
  });

  const curveRef = useRef<THREE.CatmullRomCurve3 | null>(null);
  if (!curveRef.current) curveRef.current = makeSpiralCurve();

  return (
    <motion.div className="w-full h-full pointer-events-none">
      <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight intensity={1.2} position={[5, 5, 5]} />
        <ContactShadows blur={2.5} opacity={0.5} position={[0, -1, 0]} scale={20} />
        <Line
          points={curveRef.current.getPoints(260)}
          color="#ffffff"
          lineWidth={2}
          transparent
          opacity={0.35}
        />
        <SkateboardModel scrollYProgress={scrollYProgress} curve={curveRef.current} />
      </Canvas>
    </motion.div>
  );
}

