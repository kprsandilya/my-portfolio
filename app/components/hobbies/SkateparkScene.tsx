"use client";

import { Suspense, useEffect, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import * as THREE from "three";
import { HOBBIES } from "./hobbies";
import HobbiesTitle from "./HobbiesTitle";
import { FlatSkateboard } from "./Skateboard";
import { usePalette, type Palette } from "./usePalette";
import { airStart, DECK_WIDTH, PIPE_LENGTH, PIPE_RADIUS, rideState } from "./ride";

const SEGMENTS = HOBBIES.length; // one air per hobby
// The first part of the scroll is the intro: the title over a wide shot of
// the half-pipe, with the camera swooping down behind the board.
const INTRO = 0.08;
// Ride progress (after the intro) where the run is over.
const RUN_DONE = 0.985;

const smooth = (v: number) => v * v * (3 - 2 * v);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

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
        <meshBasicMaterial color={palette.accent} wireframe transparent opacity={0.4} />
      </mesh>
      <mesh geometry={pipe}>
        <meshBasicMaterial color={palette.accent2} transparent opacity={0.05} side={THREE.DoubleSide} />
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

function RidingBoard({ ride, glow }: { ride: MotionValue<number>; glow: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    const board = ref.current;
    if (!board) return;
    const s = rideState(ride.get(), SEGMENTS);
    board.position.copy(s.position);
    // A little smoothing hides jumps when the page scrolls quickly.
    board.quaternion.slerp(s.quaternion, 0.5);
  });
  return (
    <group ref={ref}>
      <FlatSkateboard length={3.2} glow={glow} glowStrength={0.25} />
    </group>
  );
}

// Lights that travel with the board so it always stands out from the dark
// pipe: a white key light, a rim light, and a neon glow underneath.
function BoardLights({ ride, palette }: { ride: MotionValue<number>; palette: Palette }) {
  const key = useRef<THREE.PointLight>(null);
  const rim = useRef<THREE.PointLight>(null);
  const under = useRef<THREE.PointLight>(null);
  useFrame(() => {
    const s = rideState(ride.get(), SEGMENTS);
    const p = s.position;
    key.current?.position.set(p.x + 2.5, p.y + 2.5, p.z - s.side * 1.5);
    rim.current?.position.set(p.x - 2.5, p.y + 1.2, p.z + s.side * 1.2);
    under.current?.position.set(p.x, p.y - 0.8, p.z);
  });
  return (
    <>
      <pointLight ref={key} color="#ffffff" intensity={40} distance={10} />
      <pointLight ref={rim} color={palette.accent2} intensity={30} distance={8} />
      <pointLight ref={under} color={palette.accent} intensity={18} distance={4} />
    </>
  );
}

// Follow cam that adapts to the board. On the flat it trails a few board
// lengths behind; as the board climbs it closes in and drops below it; at the
// top of each air it's right on the board, looking up, with a wider lens.
function ChaseCamera({ ride, intro }: { ride: MotionValue<number>; intro: MotionValue<number> }) {
  const look = useRef(new THREE.Vector3(8, 1, 0));
  const establishing = useMemo(() => new THREE.Vector3(PIPE_LENGTH / 2 + 12, 9, 10), []);
  useFrame(({ camera }) => {
    const cam = camera as THREE.PerspectiveCamera;
    const s = rideState(ride.get(), SEGMENTS);
    const c = smooth(s.closeness);

    const distance = THREE.MathUtils.lerp(5.5, 1.6, c);
    const dir = new THREE.Vector3(1, 0.45 - 0.75 * c, -s.side * 0.9 * c).normalize();
    const chase = s.position.clone().addScaledVector(dir, distance);
    chase.y = Math.max(chase.y, 0.4);

    // Intro: blend from a wide establishing shot into the chase position.
    const e = smooth(intro.get());
    const desired = establishing.clone().lerp(chase, e);
    const lookTarget = new THREE.Vector3(2, 1.5, 0).lerp(s.position, e);

    cam.position.lerp(desired, 0.15);
    look.current.lerp(lookTarget, 0.25);
    cam.lookAt(look.current);

    const fov = THREE.MathUtils.lerp(50, 66, c * e);
    if (Math.abs(cam.fov - fov) > 0.05) {
      cam.fov = THREE.MathUtils.lerp(cam.fov, fov, 0.15);
      cam.updateProjectionMatrix();
    }
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

const PANEL_POSITION =
  "pointer-events-none absolute inset-x-4 bottom-24 md:inset-x-auto md:bottom-auto md:left-[5vw] md:top-1/2 md:w-[min(440px,38vw)] md:-translate-y-1/2";

// Hobby panel on the left. Each one slides in as the board launches into its
// air and stays until the next air.
function HobbyPanel({ index, ride }: { index: number; ride: MotionValue<number> }) {
  const hobby = HOBBIES[index];
  const start = airStart(index, SEGMENTS);
  const end = index + 1 < SEGMENTS ? airStart(index + 1, SEGMENTS) : RUN_DONE;
  const fade = 0.012;
  const opacity = useTransform(ride, [start, start + fade, end - fade, end], [0, 1, 1, 0]);
  const x = useTransform(ride, [start, start + fade * 2], [-40, 0]);
  const Icon = hobby.icon;
  return (
    <motion.div style={{ opacity, x }} className={PANEL_POSITION}>
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
function StatusLine({ ride, from, to, children }: { ride: MotionValue<number>; from: number; to: number; children: ReactNode }) {
  const opacity = useTransform(ride, [from, from + 0.01, to - 0.01, to], [0, 1, 1, 0]);
  return (
    <motion.div style={{ opacity }} className={`${PANEL_POSITION} font-mono text-[var(--pf-term-fg)]`}>
      <div className="rounded-2xl border border-white/10 bg-[var(--pf-term)]/85 p-6 shadow-2xl backdrop-blur">{children}</div>
    </motion.div>
  );
}

export default function SkateparkScene() {
  const palette = usePalette();
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const intro = useTransform(scrollYProgress, (v) => clamp01(v / INTRO));
  const ride = useTransform(scrollYProgress, (v) => clamp01((v - INTRO) / (1 - INTRO)));
  const titleOpacity = useTransform(scrollYProgress, [0, INTRO * 0.7], [1, 0]);
  const barWidth = useTransform(ride, [0, 1], ["0%", "100%"]);
  const barOpacity = useTransform(scrollYProgress, [INTRO * 0.5, INTRO], [0, 1]);

  return (
    // Tall track: scrolling through it drives the run. The stage stays pinned.
    // Keep the height in sync with the placeholder in HobbiesSection.
    <div ref={track} className="relative h-[600vh] bg-[var(--pf-term)]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <Canvas camera={{ position: [PIPE_LENGTH / 2 + 12, 9, 10], fov: 50 }} dpr={[1, 2]}>
          <FrameRight />
          <color attach="background" args={[palette.term]} />
          <fog attach="fog" args={[palette.term, 16, 42]} />
          <ambientLight intensity={1.1} />
          <directionalLight position={[4, 10, 6]} intensity={1.2} />
          <gridHelper args={[80, 80, palette.accent, palette.term2]} position={[0, -0.01, 0]} />
          <HalfPipe palette={palette} />
          <Suspense fallback={null}>
            <RidingBoard ride={ride} glow={palette.accent} />
          </Suspense>
          <BoardLights ride={ride} palette={palette} />
          <ChaseCamera ride={ride} intro={intro} />
        </Canvas>

        <motion.div style={{ opacity: titleOpacity }}>
          <HobbiesTitle />
        </motion.div>

        <StatusLine ride={ride} from={0.001} to={airStart(0, SEGMENTS)}>
          <p className="text-sm opacity-80">
            <span className="text-[var(--pf-prompt)]">~/hobbies</span> <span className="text-[var(--pf-accent)]">$</span> ./skate --drop-in
          </p>
          <p className="mt-3 font-sans text-2xl font-semibold">Drop in.</p>
          <p className="mt-1 font-sans text-sm opacity-75">Keep scrolling. Every air off the lip unlocks a hobby.</p>
        </StatusLine>

        {HOBBIES.map((h, i) => (
          <HobbyPanel key={h.id} index={i} ride={ride} />
        ))}

        <StatusLine ride={ride} from={RUN_DONE} to={1.02}>
          <p className="text-sm opacity-80">
            <span className="text-[var(--pf-prompt)]">~/hobbies</span> <span className="text-[var(--pf-accent)]">$</span> exit
          </p>
          <p className="mt-3 font-sans text-2xl font-semibold">Run complete.</p>
          <p className="mt-1 font-sans text-sm opacity-75">
            {SEGMENTS}/{SEGMENTS} hobbies landed. Thanks for riding along.
          </p>
        </StatusLine>

        {/* progress bar styled like a terminal download; appears once the run starts */}
        <motion.div
          style={{ opacity: barOpacity }}
          className="absolute inset-x-0 bottom-6 mx-auto w-[min(520px,85vw)] font-mono text-xs text-[var(--pf-term-fg)]"
        >
          <div className="mb-1 flex justify-between opacity-70">
            <span>$ ./skate --session</span>
            <span>scroll to ride</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div style={{ width: barWidth }} className="h-full bg-[var(--pf-prompt)]" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
