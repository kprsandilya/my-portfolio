"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import * as THREE from "three";
import { HOBBIES } from "./hobbies";
import { FlatSkateboard } from "./Skateboard";
import { usePalette, type Palette } from "./usePalette";

// Half-pipe dimensions (world units).
const PIPE_RADIUS = 4;
const PIPE_LENGTH = 26;
// How far up each wall the board rides, in radians from the bottom.
const SWING = 1.2;
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

// Board height above the half-pipe surface (so the wheels sit on it).
const RIDE_HEIGHT = 0.14;

function surfacePoint(t: number) {
  const { x, y, z } = boardPose(t);
  return new THREE.Vector3(x, y, z);
}

function RidingBoard({ progress }: { progress: MotionValue<number> }) {
  const ref = useRef<THREE.Group>(null);
  const target = useMemo(() => new THREE.Quaternion(), []);
  const basis = useMemo(() => new THREE.Matrix4(), []);

  useFrame(() => {
    const board = ref.current;
    if (!board) return;
    const t = THREE.MathUtils.clamp(progress.get(), 0, 1);
    const here = surfacePoint(t);

    // Direction of travel: where the board will be a moment later. This points
    // the nose up the wall on the way up and down it on the way back, turning
    // at the top of each wall like a kickturn.
    const step = 0.0015;
    const ahead = t + step <= 1 ? surfacePoint(t + step) : here.clone().add(here.clone().sub(surfacePoint(t - step)));
    const forward = ahead.sub(here);

    // "Up" for the board is the surface normal, pointing toward the pipe's
    // center line, so the wheels stay flat against the curve.
    const up = new THREE.Vector3(0, PIPE_RADIUS - here.y, -here.z).normalize();
    forward.addScaledVector(up, -forward.dot(up));
    if (forward.lengthSq() < 1e-10) forward.set(-1, 0, 0);
    forward.normalize();
    const side = new THREE.Vector3().crossVectors(forward, up);

    // FlatSkateboard's length runs along X and its deck faces +Y.
    basis.makeBasis(forward, up, side);
    target.setFromRotationMatrix(basis);
    board.quaternion.slerp(target, 0.35);
    board.position.copy(here).addScaledVector(up, RIDE_HEIGHT);
  });

  return (
    <group ref={ref}>
      <FlatSkateboard length={3.2} />
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
    // Keep the height in sync with the placeholder in HobbiesSection.
    <div ref={track} className="relative h-[450vh] bg-[var(--pf-term)]">
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
