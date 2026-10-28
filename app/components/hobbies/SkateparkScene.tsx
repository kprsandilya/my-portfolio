"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import * as THREE from "three";
import { HOBBIES } from "./hobbies";
import { FlatSkateboard } from "./Skateboard";
import { usePalette, type Palette } from "./usePalette";
import { airStart, DECK_WIDTH, PIPE_LENGTH, PIPE_RADIUS, rideState } from "./ride";

const SEGMENTS = HOBBIES.length; // one air per hobby
// Progress where the run is over and the closing line shows.
const RUN_DONE = 0.985;

function HalfPipe({ palette }: { palette: Palette }) {
  // Open cylinder, lower half only (theta pi..2pi), lying along X.
  const pipe = useMemo(() => {
    const g = new THREE.CylinderGeometry(PIPE_RADIUS, PIPE_RADIUS, PIPE_LENGTH, 40, 30, true, Math.PI, Math.PI);
    g.rotateZ(Math.PI / 2);
    g.translate(0, PIPE_RADIUS, 0);
    return g;
  }, []);
  // Flat decks on top of each wall, so the lip the board launches from reads clearly.
  const deck = useMemo(() => {
    const g = new THREE.PlaneGeometry(PIPE_LENGTH, DECK_WIDTH, 30, 3);
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);
  return (
    <group>
      <mesh geometry={pipe}>
        <meshBasicMaterial color={palette.accent} wireframe transparent opacity={0.45} />
      </mesh>
      <mesh geometry={pipe}>
        <meshBasicMaterial color={palette.accent2} transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh geometry={deck} position={[0, PIPE_RADIUS, side * (PIPE_RADIUS + DECK_WIDTH / 2)]}>
            <meshBasicMaterial color={palette.accent} wireframe transparent opacity={0.3} />
          </mesh>
          {/* coping rail along the lip */}
          <mesh position={[0, PIPE_RADIUS, side * PIPE_RADIUS]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, PIPE_LENGTH, 12]} />
            <meshBasicMaterial color={palette.accent3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function RidingBoard({ progress }: { progress: MotionValue<number> }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    const board = ref.current;
    if (!board) return;
    const s = rideState(progress.get(), SEGMENTS);
    board.position.copy(s.position);
    // A little smoothing hides jumps when the page scrolls quickly.
    board.quaternion.slerp(s.quaternion, 0.5);
  });
  return (
    <group ref={ref}>
      <FlatSkateboard length={3.2} />
    </group>
  );
}

// Follow cam, like a filmer skating behind the rider: low in the pipe and
// trailing the board down its length, panning with it from wall to wall and
// tilting up to watch each air.
function ChaseCamera({ progress }: { progress: MotionValue<number> }) {
  const look = useRef(new THREE.Vector3(8, 1, 0));
  useFrame(({ camera }) => {
    const s = rideState(progress.get(), SEGMENTS);
    const p = s.position;
    const desired = new THREE.Vector3(p.x + 7.5, 2.2 + (s.airborne ? 1.2 : 0), p.z * 0.4);
    camera.position.lerp(desired, 0.08);
    look.current.lerp(new THREE.Vector3(p.x - 1.5, p.y * 0.85 + 0.5, p.z * 0.85), 0.12);
    camera.lookAt(look.current);
  });
  return null;
}

// On wide screens, shift the picture right so the board isn't under the
// hobby panel on the left.
function FrameRight() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  useEffect(() => {
    if (size.width >= 768) {
      camera.setViewOffset(size.width, size.height, -size.width * 0.17, 0, size.width, size.height);
    } else {
      camera.clearViewOffset();
    }
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}

// Hobby panel on the left. Each one slides in as the board launches into its
// air and stays until the next air.
function HobbyPanel({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const hobby = HOBBIES[index];
  const start = airStart(index, SEGMENTS);
  const end = index + 1 < SEGMENTS ? airStart(index + 1, SEGMENTS) : RUN_DONE;
  const fade = 0.012;
  const opacity = useTransform(progress, [start, start + fade, end - fade, end], [0, 1, 1, 0]);
  const x = useTransform(progress, [start, start + fade * 2], [-40, 0]);
  const Icon = hobby.icon;
  return (
    <motion.div
      style={{ opacity, x }}
      className="pointer-events-none absolute inset-x-4 bottom-24 md:inset-x-auto md:bottom-auto md:left-[5vw] md:top-1/2 md:w-[min(440px,38vw)] md:-translate-y-1/2"
    >
      <div className="rounded-2xl border border-white/10 bg-[var(--pf-term)]/85 p-6 text-[var(--pf-term-fg)] shadow-2xl backdrop-blur">
        <div className="flex items-center justify-between font-mono text-xs opacity-80">
          <span>
            <span className="text-[var(--pf-prompt)]">~/hobbies</span> <span className="text-[var(--pf-accent)]">$</span> ./{hobby.id}
          </span>
          <span>
            {String(index + 1).padStart(2, "0")} / {String(SEGMENTS).padStart(2, "0")}
          </span>
        </div>
        <p className="mt-4 flex items-center gap-3 text-3xl font-semibold" style={{ color: `var(${hobby.accent})` }}>
          <Icon aria-hidden="true" /> {hobby.name}
        </p>
        <p className="mt-3 text-base">{hobby.blurb}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm opacity-75">
          {hobby.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        <div className="mt-5 flex gap-1.5" aria-hidden="true">
          {HOBBIES.map((h, i) => (
            <span key={h.id} className={`h-1.5 flex-1 rounded-full ${i <= index ? "bg-[var(--pf-prompt)]" : "bg-white/15"}`} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Terminal lines before the first air and after the run ends.
function StatusLine({ progress, from, to, children }: { progress: MotionValue<number>; from: number; to: number; children: React.ReactNode }) {
  const opacity = useTransform(progress, [from, from + 0.01, to - 0.01, to], [0, 1, 1, 0]);
  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute inset-x-4 bottom-24 font-mono text-[var(--pf-term-fg)] md:inset-x-auto md:bottom-auto md:left-[5vw] md:top-1/2 md:w-[min(440px,38vw)] md:-translate-y-1/2"
    >
      <div className="rounded-2xl border border-white/10 bg-[var(--pf-term)]/85 p-6 shadow-2xl backdrop-blur">{children}</div>
    </motion.div>
  );
}

export default function SkateparkScene() {
  const palette = usePalette();
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const barWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    // Tall track: scrolling through it drives the run. The stage stays pinned.
    // Keep the height in sync with the placeholder in HobbiesSection.
    <div ref={track} className="relative h-[600vh] bg-[var(--pf-term)]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <Canvas camera={{ position: [16, 3, 0], fov: 55 }} dpr={[1, 2]}>
          <FrameRight />
          <color attach="background" args={[palette.term]} />
          <fog attach="fog" args={[palette.term, 14, 38]} />
          <ambientLight intensity={1.3} />
          <directionalLight position={[4, 10, 6]} intensity={1.4} />
          <pointLight position={[0, 6, 0]} intensity={30} color={palette.accent2} />
          <gridHelper args={[70, 70, palette.accent, palette.term2]} position={[0, -0.01, 0]} />
          <HalfPipe palette={palette} />
          <Suspense fallback={null}>
            <RidingBoard progress={scrollYProgress} />
          </Suspense>
          <ChaseCamera progress={scrollYProgress} />
        </Canvas>

        <StatusLine progress={scrollYProgress} from={-0.02} to={airStart(0, SEGMENTS)}>
          <p className="text-sm opacity-80">
            <span className="text-[var(--pf-prompt)]">~/hobbies</span> <span className="text-[var(--pf-accent)]">$</span> ./skate --drop-in
          </p>
          <p className="mt-3 font-sans text-2xl font-semibold">Drop in.</p>
          <p className="mt-1 font-sans text-sm opacity-75">Keep scrolling. Every air off the lip unlocks a hobby.</p>
        </StatusLine>

        {HOBBIES.map((h, i) => (
          <HobbyPanel key={h.id} index={i} progress={scrollYProgress} />
        ))}

        <StatusLine progress={scrollYProgress} from={RUN_DONE} to={1.02}>
          <p className="text-sm opacity-80">
            <span className="text-[var(--pf-prompt)]">~/hobbies</span> <span className="text-[var(--pf-accent)]">$</span> exit
          </p>
          <p className="mt-3 font-sans text-2xl font-semibold">Run complete.</p>
          <p className="mt-1 font-sans text-sm opacity-75">
            {SEGMENTS}/{SEGMENTS} hobbies landed. Thanks for riding along.
          </p>
        </StatusLine>

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
