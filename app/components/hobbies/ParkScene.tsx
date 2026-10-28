"use client";

import { Suspense, useEffect, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import * as THREE from "three";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry.js";
import { HOBBIES } from "./hobbies";
import HobbiesTitle from "./HobbiesTitle";
import { FlatSkateboard } from "./Skateboard";
import { usePalette, type Palette } from "./usePalette";
import {
  BACK_WALL,
  BANK,
  BOARD,
  BOWL,
  bowlY,
  FUNBOX,
  KICKER,
  LEDGE,
  MANUAL_PAD,
  parkState,
  QUARTER,
  RAIL,
  REST_LEDGE,
  REST_START,
  RUN_END,
  SLAB,
  STATION,
  TRICKS,
} from "./park";

const COUNT = HOBBIES.length; // one trick per hobby
// The first part of the scroll is the intro: the title over a wide shot of
// the park, with the camera swooping down behind the board.
const INTRO = 0.08;

const smooth = (v: number) => v * v * (3 - 2 * v);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// ---------- Park geometry ----------

// Concrete surface with a neon outline, the look used across the park.
function Concrete({ geometry, palette, edges = true }: { geometry: THREE.BufferGeometry; palette: Palette; edges?: boolean }) {
  const outline = useMemo(() => (edges ? new THREE.EdgesGeometry(geometry, 30) : null), [geometry, edges]);
  const color = useMemo(() => new THREE.Color(palette.term2).lerp(new THREE.Color(palette.termFg), 0.2), [palette]);
  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial color={color} roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      {outline && (
        <lineSegments geometry={outline}>
          <lineBasicMaterial color={palette.accent} transparent opacity={0.55} />
        </lineSegments>
      )}
    </group>
  );
}

// The ground slab, with a round hole where the bowl is sunk into it, and
// short walls around its edge so it reads as a raised block of concrete.
function Slab({ palette }: { palette: Palette }) {
  const top = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(SLAB.minX, -SLAB.maxZ);
    shape.lineTo(SLAB.maxX, -SLAB.maxZ);
    shape.lineTo(SLAB.maxX, -SLAB.minZ);
    shape.lineTo(SLAB.minX, -SLAB.minZ);
    shape.closePath();
    // Shape y becomes world -z after the rotation below.
    const hole = new THREE.Path();
    hole.absarc(BOWL.x, -BOWL.z, BOWL.rimRadius, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    const g = new THREE.ShapeGeometry(shape, 48);
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);
  const sides = useMemo(() => {
    const w = SLAB.maxX - SLAB.minX;
    const d = SLAB.maxZ - SLAB.minZ;
    const g = new THREE.BoxGeometry(w, SLAB.thickness, d);
    // Open-topped box: drop the top face so the bowl's hole stays open.
    const index = g.getIndex()!;
    const groups = g.groups.filter((_, i) => i !== 2); // face 2 is +Y
    const kept: number[] = [];
    groups.forEach((gr) => {
      for (let i = gr.start; i < gr.start + gr.count; i++) kept.push(index.getX(i));
    });
    g.setIndex(kept);
    g.clearGroups();
    g.translate((SLAB.minX + SLAB.maxX) / 2, -SLAB.thickness / 2 - 0.001, (SLAB.minZ + SLAB.maxZ) / 2);
    return g;
  }, []);
  // A faint grid painted on the slab, like expansion joints in the concrete.
  const joints = useMemo(() => {
    const pts: number[] = [];
    for (let x = SLAB.minX; x <= SLAB.maxX; x += 4) pts.push(x, 0.005, SLAB.minZ, x, 0.005, SLAB.maxZ);
    for (let z = SLAB.minZ; z <= SLAB.maxZ; z += 4) pts.push(SLAB.minX, 0.005, z, SLAB.maxX, 0.005, z);
    // Leave the bowl's hole clear.
    const out: number[] = [];
    for (let i = 0; i < pts.length; i += 6) {
      const a = new THREE.Vector3(pts[i], pts[i + 1], pts[i + 2]);
      const b = new THREE.Vector3(pts[i + 3], pts[i + 4], pts[i + 5]);
      const n = 60;
      for (let k = 0; k < n; k++) {
        const p = a.clone().lerp(b, k / n);
        const q = a.clone().lerp(b, (k + 1) / n);
        const clear = (v: THREE.Vector3) => Math.hypot(v.x - BOWL.x, v.z - BOWL.z) > BOWL.rimRadius + 0.2;
        if (clear(p) && clear(q)) out.push(p.x, p.y, p.z, q.x, q.y, q.z);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(out, 3));
    return g;
  }, []);
  return (
    <group>
      <Concrete geometry={top} palette={palette} edges={false} />
      <Concrete geometry={sides} palette={palette} />
      <lineSegments geometry={joints}>
        <lineBasicMaterial color={palette.accent} transparent opacity={0.12} />
      </lineSegments>
    </group>
  );
}

// Sunken bowl: a flat bottom curving up to vertical at the rim, with steel
// coping around the edge.
function Bowl({ palette }: { palette: Palette }) {
  const geometry = useMemo(() => {
    const pts: THREE.Vector2[] = [new THREE.Vector2(0, -BOWL.depth)];
    for (let i = 0; i <= 24; i++) {
      const r = THREE.MathUtils.lerp(BOWL.flatRadius, BOWL.rimRadius, i / 24);
      pts.push(new THREE.Vector2(r, bowlY(r)));
    }
    const g = new THREE.LatheGeometry(pts, 64);
    g.translate(BOWL.x, 0, BOWL.z);
    return g;
  }, []);
  const color = useMemo(() => new THREE.Color(palette.term2).lerp(new THREE.Color(palette.termFg), 0.16), [palette]);
  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial color={color} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={geometry}>
        <meshBasicMaterial color={palette.accent} wireframe transparent opacity={0.18} />
      </mesh>
      <mesh position={[BOWL.x, 0, BOWL.z]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[BOWL.rimRadius, 0.08, 8, 96]} />
        <meshBasicMaterial color={palette.accent3} />
      </mesh>
    </group>
  );
}

// Side profile (in X/Y) pushed out along Z, for the funbox and the kicker.
function useExtruded(points: [number, number][], z: number, width: number) {
  return useMemo(() => {
    const shape = new THREE.Shape(points.map(([x, y]) => new THREE.Vector2(x, y)));
    const g = new THREE.ExtrudeGeometry(shape, { depth: width, bevelEnabled: false });
    g.translate(0, 0, z - width / 2);
    return g;
    // The layout constants never change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function Funbox({ palette }: { palette: Palette }) {
  const { x, halfLength: h, topHalfLength: t, height, z, width } = FUNBOX;
  const geometry = useExtruded(
    [
      [x - h, 0],
      [x + h, 0],
      [x + t, height],
      [x - t, height],
    ],
    z,
    width
  );
  return <Concrete geometry={geometry} palette={palette} />;
}

function Kicker({ palette }: { palette: Palette }) {
  const geometry = useExtruded(
    [
      [KICKER.fromX, 0],
      [KICKER.toX, 0],
      [KICKER.toX, KICKER.height],
    ],
    KICKER.z,
    KICKER.width
  );
  return <Concrete geometry={geometry} palette={palette} />;
}

function Rail({ palette }: { palette: Palette }) {
  const length = RAIL.toX - RAIL.fromX;
  return (
    <group>
      <mesh position={[(RAIL.fromX + RAIL.toX) / 2, RAIL.height, RAIL.z]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[RAIL.radius, RAIL.radius, length, 12]} />
        <meshStandardMaterial color={palette.accent3} emissive={palette.accent3} emissiveIntensity={0.6} metalness={0.6} roughness={0.3} />
      </mesh>
      {[RAIL.fromX + 0.5, RAIL.toX - 0.5].map((px) => (
        <mesh key={px} position={[px, RAIL.height / 2, RAIL.z]}>
          <cylinderGeometry args={[0.05, 0.05, RAIL.height, 8]} />
          <meshStandardMaterial color={palette.termFg} metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// A box ledge with a bright edge along the side that gets grinded.
function Ledge({
  fromX,
  toX,
  z,
  height,
  depth,
  edgeZ,
  palette,
}: {
  fromX: number;
  toX: number;
  z: number;
  height: number;
  depth: number;
  edgeZ: number;
  palette: Palette;
}) {
  const length = Math.abs(toX - fromX);
  const geometry = useMemo(() => {
    const g = new THREE.BoxGeometry(length, height, depth);
    g.translate((fromX + toX) / 2, height / 2, z);
    return g;
  }, [fromX, toX, z, height, depth, length]);
  return (
    <group>
      <Concrete geometry={geometry} palette={palette} />
      <mesh position={[(fromX + toX) / 2, height, edgeZ]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, length, 8]} />
        <meshBasicMaterial color={palette.accent3} />
      </mesh>
    </group>
  );
}

// Quarter pipe on the east end of the park: curving up toward +X, with a
// deck behind the coping.
function QuarterPipe({ palette }: { palette: Palette }) {
  const R = QUARTER.radius;
  const ramp = useMemo(
    () =>
      new ParametricGeometry(
        (u, v, target) => {
          const a = (u * Math.PI) / 2;
          target.set(QUARTER.x + R * Math.sin(a), R - R * Math.cos(a), (v - 0.5) * QUARTER.width);
        },
        14,
        16
      ),
    [R]
  );
  const back = useMemo(() => {
    // Solid block behind the curve: the deck on top, flat back and sides.
    const shape = new THREE.Shape();
    shape.moveTo(QUARTER.x, 0);
    for (let i = 0; i <= 16; i++) {
      const a = (i / 16) * (Math.PI / 2);
      shape.lineTo(QUARTER.x + R * Math.sin(a), R - R * Math.cos(a));
    }
    shape.lineTo(QUARTER.x + R + QUARTER.deck, R);
    shape.lineTo(QUARTER.x + R + QUARTER.deck, 0);
    shape.closePath();
    const g = new THREE.ExtrudeGeometry(shape, { depth: QUARTER.width, bevelEnabled: false, curveSegments: 16 });
    g.translate(0, 0, -QUARTER.width / 2);
    return g;
  }, [R]);
  return (
    <group>
      <Concrete geometry={back} palette={palette} />
      <mesh geometry={ramp}>
        <meshBasicMaterial color={palette.accent} wireframe transparent opacity={0.25} />
      </mesh>
      <mesh position={[QUARTER.x + R, R, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, QUARTER.width, 12]} />
        <meshBasicMaterial color={palette.accent3} />
      </mesh>
    </group>
  );
}

// A bank ramp along the back of the park, rising toward the back wall.
function Bank({ palette }: { palette: Palette }) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape([
      new THREE.Vector2(BANK.nearZ, 0),
      new THREE.Vector2(BANK.farZ, 0),
      new THREE.Vector2(BANK.farZ, BANK.height),
    ]);
    // The profile is drawn in (z, y) and pushed out along X.
    const g = new THREE.ExtrudeGeometry(shape, { depth: BANK.toX - BANK.fromX, bevelEnabled: false });
    g.rotateY(-Math.PI / 2);
    g.translate(BANK.toX, 0, 0);
    return g;
  }, []);
  return <Concrete geometry={geometry} palette={palette} />;
}

function BackWall({ palette }: { palette: Palette }) {
  const geometry = useMemo(() => {
    const g = new THREE.BoxGeometry(BACK_WALL.toX - BACK_WALL.fromX, BACK_WALL.height, BACK_WALL.thickness);
    g.translate((BACK_WALL.fromX + BACK_WALL.toX) / 2, BACK_WALL.height / 2, BACK_WALL.z);
    return g;
  }, []);
  return <Concrete geometry={geometry} palette={palette} />;
}

// Bright paint on a few walls, a nod to the graffiti in real parks. Each tag
// uses one of the hobby accent colors.
function Paint({ palette }: { palette: Palette }) {
  const colors = [palette.accent, palette.accent2, palette.prompt, palette.accent3];
  const tags: { pos: [number, number, number]; rot: [number, number, number]; size: [number, number] }[] = [
    // On the back of the quarter pipe deck block, facing the park's far side.
    { pos: [QUARTER.x + QUARTER.radius + QUARTER.deck + 0.01, 1.6, -2.5], rot: [0, Math.PI / 2, 0], size: [4.5, 1.6] },
    { pos: [QUARTER.x + QUARTER.radius + QUARTER.deck + 0.01, 1.4, 2.8], rot: [0, Math.PI / 2, 0], size: [3, 1.2] },
    // Sides of the funbox.
    { pos: [FUNBOX.x, 0.35, FUNBOX.z - FUNBOX.width / 2 - 0.01], rot: [0, Math.PI, 0], size: [3.2, 0.4] },
    // Front of the long ledge.
    { pos: [(LEDGE.fromX + LEDGE.toX) / 2, 0.3, LEDGE.z + LEDGE.depth / 2 + 0.01], rot: [0, 0, 0], size: [5, 0.3] },
    // Pieces along the back wall.
    { pos: [-15, 1, BACK_WALL.z + BACK_WALL.thickness / 2 + 0.01], rot: [0, 0, 0], size: [5, 1.2] },
    { pos: [3.5, 1.1, BACK_WALL.z + BACK_WALL.thickness / 2 + 0.01], rot: [0, 0, 0], size: [6, 1] },
    { pos: [14, 0.9, BACK_WALL.z + BACK_WALL.thickness / 2 + 0.01], rot: [0, 0, 0], size: [4, 1.3] },
  ];
  return (
    <group>
      {tags.map((t, i) => (
        <mesh key={i} position={t.pos} rotation={t.rot}>
          <planeGeometry args={t.size} />
          <meshBasicMaterial color={colors[i % colors.length]} transparent opacity={0.35} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function Park({ palette }: { palette: Palette }) {
  return (
    <group>
      <Slab palette={palette} />
      <Bowl palette={palette} />
      <Funbox palette={palette} />
      <Rail palette={palette} />
      <QuarterPipe palette={palette} />
      <Ledge {...LEDGE} edgeZ={LEDGE.z + LEDGE.depth / 2} palette={palette} />
      <Kicker palette={palette} />
      <Ledge
        fromX={REST_LEDGE.fromX}
        toX={REST_LEDGE.toX}
        z={REST_LEDGE.z}
        height={REST_LEDGE.height}
        depth={REST_LEDGE.width}
        edgeZ={REST_LEDGE.z + REST_LEDGE.width / 2}
        palette={palette}
      />
      <Ledge
        fromX={MANUAL_PAD.fromX}
        toX={MANUAL_PAD.toX}
        z={MANUAL_PAD.z}
        height={MANUAL_PAD.height}
        depth={MANUAL_PAD.depth}
        edgeZ={MANUAL_PAD.z + MANUAL_PAD.depth / 2}
        palette={palette}
      />
      <Bank palette={palette} />
      <BackWall palette={palette} />
      <Paint palette={palette} />
    </group>
  );
}

// ---------- Board, lights, camera ----------

function RidingBoard({ ride, glow }: { ride: MotionValue<number>; glow: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    const board = ref.current;
    if (!board) return;
    const s = parkState(ride.get());
    board.position.copy(s.position);
    board.quaternion.slerp(s.quaternion, 0.5);
  });
  return (
    <group ref={ref}>
      <FlatSkateboard length={BOARD.length} glow={glow} glowStrength={0.25} />
    </group>
  );
}

// Lights that travel with the board so it stands out from the concrete.
function BoardLights({ ride, palette }: { ride: MotionValue<number>; palette: Palette }) {
  const key = useRef<THREE.PointLight>(null);
  const rim = useRef<THREE.PointLight>(null);
  const under = useRef<THREE.PointLight>(null);
  useFrame(() => {
    const s = parkState(ride.get());
    const p = s.position;
    const h = s.heading;
    key.current?.position.set(p.x - h.x * 2 + h.z * 1.5, p.y + 2.5, p.z - h.z * 2 - h.x * 1.5);
    rim.current?.position.set(p.x + h.x * 2, p.y + 1.2, p.z + h.z * 2);
    under.current?.position.set(p.x, p.y + 0.6, p.z);
  });
  return (
    <>
      <pointLight ref={key} color="#ffffff" intensity={30} distance={9} />
      <pointLight ref={rim} color={palette.accent2} intensity={20} distance={7} />
      <pointLight ref={under} color={palette.accent} intensity={6} distance={3} />
    </>
  );
}

// Calm follow cam, built from three shots that blend into each other:
// - In the bowl, a camera circling slowly around the rim (a camera behind the
//   board would end up inside the bowl's wall).
// - On the street, a chase from behind along the route's smoothed direction,
//   easing in closer during each trick.
// - Around the quarter pipe and the ledge, a fixed spot in front of the ramp,
//   so the camera never swings around behind it as the board turns.
// At the end it settles into a three-quarter shot of the board resting
// against the ledge and tilts up.
const BOWL_END = TRICKS[0].end; // the air out of the bowl has landed
const ESTABLISHING = new THREE.Vector3(10, 22, 26);
const END_SHOT = new THREE.Vector3(REST_LEDGE.fromX + 1.6, 1.5, REST_LEDGE.z - 4.6);
const END_LOOK = new THREE.Vector3(REST_LEDGE.fromX + 0.5, 0.3, REST_LEDGE.z);
const lerp = THREE.MathUtils.lerp;
const ramp = (v: number, a: number, b: number) => smooth(clamp01((v - a) / (b - a)));

function ChaseCamera({ ride, intro }: { ride: MotionValue<number>; intro: MotionValue<number> }) {
  const look = useRef(new THREE.Vector3(0, 0, 0));
  useFrame(({ camera }, delta) => {
    const p = ride.get();
    const s = parkState(p);
    const c = smooth(s.closeness);
    const h = s.heading;
    const board = s.position;

    // Street: behind and a little above, looking ahead of the board.
    const desired = board.clone().addScaledVector(h, -lerp(5.5, 4, c));
    desired.y = Math.max(board.y, 0) + lerp(1.7, 1.2, c);
    const lookTarget = board.clone().addScaledVector(h, lerp(4, 1, c));
    lookTarget.y = board.y + 0.3;
    const atBoard = board.clone().setY(board.y + 0.3);

    // Bowl: starts behind the drop-in on the east deck, rises to see the
    // floor, then circles north as the board carves around to the exit.
    const t = clamp01(p / BOWL_END);
    const az = lerp(0, 1.9, ramp(t, 0.35, 0.9));
    const radius = lerp(9.5, 7.8, ramp(t, 0.3, 0.9));
    const height = t < 0.5 ? lerp(2.2, 4.2, ramp(t, 0.1, 0.4)) : lerp(4.2, 2, ramp(t, 0.6, 1));
    const bowlCam = new THREE.Vector3(BOWL.x + Math.cos(az) * radius, height, BOWL.z + Math.sin(az) * radius);
    const inBowl = 1 - ramp(p, BOWL_END, BOWL_END + 0.035);
    desired.lerp(bowlCam, inBowl);
    lookTarget.lerp(atBoard, inBowl);

    // Quarter pipe and ledge: a fixed spot in front of the ramp.
    const st = ramp(p, STATION.in[0], STATION.in[1]) * (1 - ramp(p, STATION.out[0], STATION.out[1]));
    desired.lerp(STATION.position, st);
    lookTarget.lerp(atBoard, st);

    // Intro: blend from a wide shot of the whole park.
    const e = smooth(intro.get());
    const target = ESTABLISHING.clone().lerp(desired, e);
    const aim = new THREE.Vector3(0, 0, 0).lerp(lookTarget, e);

    // Ending: a three-quarter shot of the board against the ledge, then tilt up.
    const w = ramp(p, RUN_END - 0.02, RUN_END + 0.06);
    target.lerp(END_SHOT, w);
    aim.lerp(END_LOOK, w);
    if (s.rest > 0) {
      const k = smooth(s.rest);
      target.y += 1.5 * k;
      aim.y += 4 * k;
    }

    // Never go behind the quarter pipe.
    target.x = Math.min(target.x, QUARTER.x - 1.5);

    camera.position.lerp(target, 1 - Math.exp(-delta * 3));
    look.current.lerp(aim, 1 - Math.exp(-delta * 5));
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

// ---------- Overlays ----------

const PANEL_POSITION =
  "pointer-events-none absolute inset-x-4 bottom-24 md:inset-x-auto md:bottom-auto md:left-[5vw] md:top-1/2 md:w-[min(440px,38vw)] md:-translate-y-1/2";

// The trick that unlocks each hobby, shown in the panel's prompt line.
const TRICK_NAMES = ["air --out-of-bowl", "ollie --funbox", "boardslide --rail", "frontside-air --quarter-pipe", "crooked-grind --ledge", "air --kicker"];

// Hobby panel on the left. Each one slides in as its trick starts and stays
// until the next trick.
function HobbyPanel({ index, ride }: { index: number; ride: MotionValue<number> }) {
  const hobby = HOBBIES[index];
  const start = TRICKS[index].start;
  const end = index + 1 < COUNT ? TRICKS[index + 1].start : REST_START;
  const fade = 0.012;
  const opacity = useTransform(ride, [start, start + fade, end - fade, end], [0, 1, 1, 0]);
  const x = useTransform(ride, [start, start + fade * 2], [-40, 0]);
  const Icon = hobby.icon;
  return (
    <motion.div style={{ opacity, x }} className={PANEL_POSITION}>
      <div className="rounded-2xl border border-white/10 bg-[var(--pf-term)]/85 p-6 text-[var(--pf-term-fg)] shadow-2xl backdrop-blur">
        <div className="flex items-center justify-between font-mono text-xs opacity-80">
          <span>
            <span className="text-[var(--pf-prompt)]">~/hobbies</span> <span className="text-[var(--pf-accent)]">$</span> {TRICK_NAMES[index]}
          </span>
          <span>
            {String(index + 1).padStart(2, "0")} / {String(COUNT).padStart(2, "0")}
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

function StatusLine({ ride, from, to, children }: { ride: MotionValue<number>; from: number; to: number; children: ReactNode }) {
  const opacity = useTransform(ride, [from, from + 0.01, to - 0.01, to], [0, 1, 1, 0]);
  return (
    <motion.div style={{ opacity }} className={`${PANEL_POSITION} font-mono text-[var(--pf-term-fg)]`}>
      <div className="rounded-2xl border border-white/10 bg-[var(--pf-term)]/85 p-6 shadow-2xl backdrop-blur">{children}</div>
    </motion.div>
  );
}

export default function ParkScene() {
  const palette = usePalette();
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress: rawProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const scrollYProgress = useSpring(rawProgress, { stiffness: 70, damping: 24, restDelta: 0.0001 });
  const intro = useTransform(scrollYProgress, (v) => clamp01(v / INTRO));
  const ride = useTransform(scrollYProgress, (v) => clamp01((v - INTRO) / (1 - INTRO)));
  const titleOpacity = useTransform(scrollYProgress, [0, INTRO * 0.7], [1, 0]);
  const barWidth = useTransform(ride, [0, 1], ["0%", "100%"]);
  const barOpacity = useTransform(scrollYProgress, [INTRO * 0.5, INTRO, 0.93, 0.96], [0, 1, 1, 0]);
  const endFade = useTransform(scrollYProgress, [0.965, 0.995], [0, 1]);

  return (
    // Tall track: scrolling through it drives the run. The stage stays pinned.
    // Keep the height in sync with the placeholder in HobbiesSection.
    <div ref={track} data-ride-track className="relative h-[800vh] bg-[var(--pf-term)]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <Canvas camera={{ position: ESTABLISHING.toArray(), fov: 50 }} dpr={[1, 2]}>
          <FrameRight />
          <color attach="background" args={[palette.term]} />
          <fog attach="fog" args={[palette.term, 22, 60]} />
          <ambientLight intensity={0.9} />
          <directionalLight position={[-8, 14, 10]} intensity={1.1} />
          <hemisphereLight args={[palette.accent2, palette.term, 0.35]} />
          <Park palette={palette} />
          <Suspense fallback={null}>
            <RidingBoard ride={ride} glow={palette.accent} />
          </Suspense>
          <BoardLights ride={ride} palette={palette} />
          <ChaseCamera ride={ride} intro={intro} />
        </Canvas>

        <motion.div style={{ opacity: endFade }} className="pointer-events-none absolute inset-0 bg-[var(--pf-term)]" />

        <motion.div style={{ opacity: titleOpacity }}>
          <HobbiesTitle />
        </motion.div>

        <StatusLine ride={ride} from={0.001} to={TRICKS[0].start}>
          <p className="text-sm opacity-80">
            <span className="text-[var(--pf-prompt)]">~/hobbies</span> <span className="text-[var(--pf-accent)]">$</span> ./skate --drop-in bowl
          </p>
          <p className="mt-3 font-sans text-2xl font-semibold">Drop in.</p>
          <p className="mt-1 font-sans text-sm opacity-75">Keep scrolling. Every trick around the park unlocks a hobby.</p>
        </StatusLine>

        {HOBBIES.map((h, i) => (
          <HobbyPanel key={h.id} index={i} ride={ride} />
        ))}

        <StatusLine ride={ride} from={REST_START} to={1.02}>
          <p className="text-sm opacity-80">
            <span className="text-[var(--pf-prompt)]">~/hobbies</span> <span className="text-[var(--pf-accent)]">$</span> exit
          </p>
          <p className="mt-3 font-sans text-2xl font-semibold">Run complete.</p>
          <p className="mt-1 font-sans text-sm opacity-75">
            {COUNT}/{COUNT} tricks landed. Thanks for riding along.
          </p>
        </StatusLine>

        <motion.div
          style={{ opacity: barOpacity }}
          className="absolute inset-x-0 bottom-6 mx-auto w-[min(520px,85vw)] font-mono text-xs text-[var(--pf-term-fg)]"
        >
          <div className="mb-1 flex justify-between opacity-70">
            <span>$ ./skate --session park</span>
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
