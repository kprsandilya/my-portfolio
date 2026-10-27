"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import * as THREE from "three";
import { HOBBIES } from "../_shared/hobbies";
import { FlatSkateboard } from "../_shared/Skateboard";
import { usePalette, type Palette } from "../_shared/usePalette";

// Half-pipe dimensions (world units).
const PIPE_RADIUS = 4;
const PIPE_LENGTH = 26;
// How far up each wall the board rides, in radians from the bottom.
const SWING = 1.05;
// Number of back-and-forth passes over the whole scroll.
const PASSES = 6;

// Board position on the inside of the half-pipe for scroll progress t (0-1).
function boardPose(t: number) {
  const angle = Math.sin(t * Math.PI * PASSES) * SWING; // side to side
  const x = THREE.MathUtils.lerp(PIPE_LENGTH / 2 - 3, -PIPE_LENGTH / 2 + 3, t); // down the pipe
  const y = -Math.cos(angle) * PIPE_RADIUS + PIPE_RADIUS;
  const z = Math.sin(angle) * PIPE_RADIUS;
  return { x, y, z, angle };
}

function HalfPipe({ palette }: { palette: Palette }) {
  // Open cylinder, lower half only (theta pi..2pi), lying along X.
  const geometry = useMemo(() => {
    const g = new THREE.CylinderGeometry(PIPE_RADIUS, PIPE_RADIUS, PIPE_LENGTH, 40, 26, true, Math.PI, Math.PI);
    g.rotateZ(Math.PI / 2);
    g.translate(0, PIPE_RADIUS, 0);
    return g;
  }, []);
  return (
    <group>
      <mesh geometry={geometry}>
        <meshBasicMaterial color={palette.accent} wireframe transparent opacity={0.45} />
      </mesh>
      <mesh geometry={geometry}>
        <meshBasicMaterial color={palette.accent2} transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>
      {/* coping rails along both lips */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[0, PIPE_RADIUS, side * PIPE_RADIUS]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, PIPE_LENGTH, 12]} />
          <meshBasicMaterial color={palette.accent3} />
        </mesh>
      ))}
    </group>
  );
}

function RidingBoard({ progress }: { progress: MotionValue<number> }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    const t = THREE.MathUtils.clamp(progress.get(), 0, 1);
    const { x, y, z, angle } = boardPose(t);
    ref.current.position.set(x, y + 0.12, z);
    // Tilt with the wall so the wheels stay on the surface, and face down the pipe.
    ref.current.rotation.set(-angle, 0, 0);
  });
  return (
    <group ref={ref}>
      <group rotation={[0, 0, 0]}>
        <FlatSkateboard length={3.2} />
      </group>
    </group>
  );
}

function FollowCamera({ progress }: { progress: MotionValue<number> }) {
  useFrame(({ camera }) => {
    const t = THREE.MathUtils.clamp(progress.get(), 0, 1);
    const { x } = boardPose(t);
    // Raised three-quarter view from beside the pipe, trailing the board.
    camera.position.lerp(new THREE.Vector3(x + 6, 8, 11), 0.08);
    camera.lookAt(x - 1, 1.2, 0);
  });
  return null;
}

// One terminal card per hobby, each shown for a slice of the scroll.
function HobbyCard({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const hobby = HOBBIES[index];
  const slice = 1 / HOBBIES.length;
  const start = index * slice;
  const opacity = useTransform(progress, [start, start + slice * 0.2, start + slice * 0.8, start + slice], [0, 1, 1, 0]);
  const y = useTransform(progress, [start, start + slice * 0.2], [24, 0]);
  const Icon = hobby.icon;
  const left = index % 2 === 0;
  return (
    <motion.div
      style={{ opacity, y }}
      className={`pointer-events-none absolute top-1/2 w-[min(360px,80vw)] -translate-y-1/2 ${left ? "left-[6vw]" : "right-[6vw]"}`}
    >
      <div className="rounded-xl border border-white/10 bg-[var(--pf-term)]/90 p-5 font-mono text-sm text-[var(--pf-term-fg)] shadow-2xl backdrop-blur">
        <p className="mb-2 opacity-80">
          <span className="text-[var(--pf-prompt)]">~/hobbies</span> <span className="text-[var(--pf-accent)]">$</span> ./{hobby.id}
        </p>
        <p className="flex items-center gap-2 text-lg font-semibold" style={{ color: `var(${hobby.accent})` }}>
          <Icon aria-hidden="true" /> {hobby.name}
        </p>
        <p className="mt-1 font-sans">{hobby.blurb}</p>
        {hobby.details.map((d) => (
          <p key={d} className="mt-1 font-sans text-xs opacity-70">{d}</p>
        ))}
      </div>
    </motion.div>
  );
}

export default function SkateparkScene() {
  const palette = usePalette();
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const barWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    // Tall track: scrolling through it drives the ride. The stage stays pinned.
    <div ref={track} className="relative h-[600vh] bg-[var(--pf-term)]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <Canvas camera={{ position: [16, 8, 11], fov: 45 }} dpr={[1, 2]}>
          <color attach="background" args={[palette.term]} />
          <fog attach="fog" args={[palette.term, 12, 34]} />
          <ambientLight intensity={1.3} />
          <directionalLight position={[4, 10, 6]} intensity={1.4} />
          <pointLight position={[0, 6, 0]} intensity={30} color={palette.accent2} />
          <gridHelper args={[60, 60, palette.accent, palette.term2]} position={[0, -0.01, 0]} />
          <HalfPipe palette={palette} />
          <Suspense fallback={null}>
            <RidingBoard progress={scrollYProgress} />
          </Suspense>
          <FollowCamera progress={scrollYProgress} />
        </Canvas>

        {HOBBIES.map((h, i) => (
          <HobbyCard key={h.id} index={i} progress={scrollYProgress} />
        ))}

        {/* progress bar styled like a terminal download */}
        <div className="absolute inset-x-0 bottom-6 mx-auto w-[min(520px,85vw)] font-mono text-xs text-[var(--pf-term-fg)]">
          <div className="mb-1 flex justify-between opacity-70">
            <span>$ ./skate --session</span>
            <span>scroll to ride</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div style={{ width: barWidth }} className="h-full bg-[var(--pf-prompt)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
