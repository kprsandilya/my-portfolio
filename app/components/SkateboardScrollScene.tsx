"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, ContactShadows } from "@react-three/drei";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import * as THREE from "three";

function SkateboardModel({ scrollYProgress }: { scrollYProgress: any }) {
  const { scene } = useGLTF("/skateboard-opt.glb");
  const ref = useRef<THREE.Group>(null);

  // Convert framer-motion MotionValue → number every frame
  const tRef = useRef(0);

  // Define a smooth horizontal zigzag path using Catmull-Rom spline
  const curve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-4, -1, 0),   // start
      new THREE.Vector3(-2, -1, -1),  // curve right
      new THREE.Vector3( 4, -1, -2),  // curve left
      new THREE.Vector3(-2, -1, -3),  // curve right
      new THREE.Vector3( 4, -1, -4),  // end
    ],
    false,   // closed = false
    "catmullrom",
    0.5      // curve tension
  );

  useFrame(() => {
    if (!ref.current) return;

    // Read current t between 0 and 1
    tRef.current = scrollYProgress.get();

    // Clamp for safety
    const t = Math.min(1, Math.max(0, tRef.current));

    // Sample the curve at this point
    const pos = curve.getPoint(t);

    // Set skateboard position along the curve
    ref.current.position.set(pos.x, pos.y, pos.z);
    

    // Get curve tangent direction for natural facing
    const tangent = curve.getTangent(t);
    const lookAtPos = pos.clone().add(tangent) // instead of add()
    ref.current.lookAt(lookAtPos);

    ref.current.rotation.y *= -1;

    // Add rolling rotation
    //ref.current.rotateZ(roll.get());
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

  return (
    <motion.div className="w-full h-full pointer-events-none">
      <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight intensity={1.2} position={[5, 5, 5]} />
        <ContactShadows blur={2.5} opacity={0.5} position={[0, -1, 0]} scale={20} />
        <SkateboardModel scrollYProgress={scrollYProgress} />
      </Canvas>
    </motion.div>
  );
}

