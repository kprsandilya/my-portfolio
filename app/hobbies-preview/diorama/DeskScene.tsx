"use client";

import { createContext, Suspense, useContext, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { HOBBIES, type Hobby } from "../_shared/hobbies";
import { FlatSkateboard } from "../_shared/Skateboard";
import { usePalette, type Palette } from "../_shared/usePalette";

type HobbyId = Hobby["id"];

// Lets every mesh inside a hobby object glow when that object is hovered.
const GlowContext = createContext<{ active: boolean; glow: string }>({ active: false, glow: "#ffffff" });

function Mat({ color, flat = false }: { color: string; flat?: boolean }) {
  const { active, glow } = useContext(GlowContext);
  return (
    <meshStandardMaterial
      color={color}
      flatShading={flat}
      emissive={active ? glow : "#000000"}
      emissiveIntensity={active ? 0.45 : 0}
      roughness={0.6}
    />
  );
}

function HobbyObject({
  id,
  label,
  glow,
  hovered,
  setHovered,
  onSelect,
  position,
  children,
}: {
  id: HobbyId;
  label: string;
  glow: string;
  hovered: HobbyId | null;
  setHovered: (id: HobbyId | null) => void;
  onSelect: (id: HobbyId) => void;
  position: [number, number, number];
  children: ReactNode;
}) {
  const active = hovered === id;
  return (
    <group
      position={position}
      scale={active ? 1.06 : 1}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(id);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(null);
        document.body.style.cursor = "";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
      <GlowContext.Provider value={{ active, glow }}>{children}</GlowContext.Provider>
      {active && (
        <Html center position={[0, 1.1, 0]} distanceFactor={9} style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap rounded-md bg-[var(--pf-term)] px-2 py-1 font-mono text-xs text-[var(--pf-term-fg)] shadow-lg">
            <span className="text-[var(--pf-prompt)]">$</span> open {label}
          </div>
        </Html>
      )}
    </group>
  );
}

function Room({ palette }: { palette: Palette }) {
  return (
    <group>
      {/* floor and back wall */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 10]} />
        <meshStandardMaterial color={palette.bgAlt} />
      </mesh>
      <mesh position={[0, 3.5, -4.2]}>
        <planeGeometry args={[16, 7]} />
        <meshStandardMaterial color={palette.bgDeep} />
      </mesh>
      {/* desk */}
      <RoundedBox args={[6.4, 0.16, 2.8]} radius={0.05} position={[0, 1.5, -2.4]}>
        <meshStandardMaterial color={palette.raised} />
      </RoundedBox>
      {[
        [-3, -3.6],
        [3, -3.6],
        [-3, -1.2],
        [3, -1.2],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.71, z]}>
          <boxGeometry args={[0.12, 1.42, 0.12]} />
          <meshStandardMaterial color={palette.border} />
        </mesh>
      ))}
    </group>
  );
}

function Monitor({ palette }: { palette: Palette }) {
  return (
    <group>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.16, 0.5, 0.16]} />
        <Mat color={palette.border} />
      </mesh>
      <RoundedBox args={[2.6, 1.5, 0.12]} radius={0.05} position={[0, 1.1, 0]}>
        <Mat color={palette.term} />
      </RoundedBox>
      {/* code lines on the screen */}
      {[0.45, 0.25, 0.05, -0.15, -0.35].map((y, i) => (
        <mesh key={y} position={[-0.95 + (i % 2) * 0.2 + 0.4, 1.1 + y, 0.07]}>
          <planeGeometry args={[0.8 + ((i * 37) % 5) * 0.2, 0.08]} />
          <meshBasicMaterial color={[palette.accent, palette.accent2, palette.prompt][i % 3]} />
        </mesh>
      ))}
    </group>
  );
}

function Keyboard({ palette }: { palette: Palette }) {
  const whites = 14;
  return (
    <group>
      <RoundedBox args={[2.9, 0.12, 0.8]} radius={0.03}>
        <Mat color={palette.term} />
      </RoundedBox>
      {Array.from({ length: whites }).map((_, i) => (
        <mesh key={`w${i}`} position={[-1.3 + i * 0.2, 0.08, 0.1]}>
          <boxGeometry args={[0.18, 0.05, 0.5]} />
          <Mat color="#f4f4f0" />
        </mesh>
      ))}
      {/* Black keys sit between white keys, except after E and B (positions 2 and 6 of each octave). */}
      {Array.from({ length: whites - 1 }).map((_, i) =>
        i % 7 === 2 || i % 7 === 6 ? null : (
          <mesh key={`b${i}`} position={[-1.2 + i * 0.2, 0.12, -0.02]}>
            <boxGeometry args={[0.1, 0.06, 0.3]} />
            <Mat color="#15161e" />
          </mesh>
        )
      )}
    </group>
  );
}

function Violin() {
  const wood = "#9a5b34";
  return (
    // Scaled down so it reads as a violin next to the desk, not a cello.
    <group rotation={[0, 0, 0.25]} scale={0.62}>
      <mesh position={[0, 0, 0]} scale={[0.5, 0.62, 0.15]}>
        <sphereGeometry args={[1, 24, 16]} />
        <Mat color={wood} />
      </mesh>
      <mesh position={[0, 0.78, 0]} scale={[0.4, 0.5, 0.14]}>
        <sphereGeometry args={[1, 24, 16]} />
        <Mat color={wood} />
      </mesh>
      <mesh position={[0, 1.65, 0.02]}>
        <boxGeometry args={[0.1, 1.1, 0.08]} />
        <Mat color="#1f1a17" />
      </mesh>
      <mesh position={[0, 2.25, 0.02]}>
        <torusGeometry args={[0.08, 0.035, 8, 16]} />
        <Mat color={wood} />
      </mesh>
      {[-0.045, -0.015, 0.015, 0.045].map((x) => (
        <mesh key={x} position={[x, 0.95, 0.17]}>
          <boxGeometry args={[0.006, 2.2, 0.006]} />
          <meshBasicMaterial color="#e8e2d0" />
        </mesh>
      ))}
    </group>
  );
}

function D20({ palette }: { palette: Palette }) {
  return (
    <mesh rotation={[0.4, 0.6, 0.2]}>
      <icosahedronGeometry args={[0.32, 0]} />
      <Mat color={palette.accent2} flat />
    </mesh>
  );
}

function ChipsAndCards({ palette }: { palette: Palette }) {
  const chipColors = [palette.accent, palette.accent2, palette.accent3];
  return (
    <group>
      {chipColors.map((c, stack) =>
        Array.from({ length: 4 + stack }).map((_, i) => (
          <mesh key={`${stack}-${i}`} position={[stack * 0.42, 0.03 + i * 0.05, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.045, 24]} />
            <Mat color={c} />
          </mesh>
        ))
      )}
      {[0, 1].map((i) => (
        <mesh key={`card${i}`} position={[0.35 + i * 0.25, 0.012, 0.45]} rotation={[-Math.PI / 2, 0, 0.3 - i * 0.5]}>
          <planeGeometry args={[0.45, 0.65]} />
          <Mat color="#f4f4f0" />
        </mesh>
      ))}
    </group>
  );
}

function LeaningBoard() {
  return (
    // Stand the board on its tail against the wall.
    <group rotation={[0.25, 0, Math.PI / 2 - 0.12]}>
      <FlatSkateboard length={3} />
    </group>
  );
}

export default function DeskScene() {
  const palette = usePalette();
  const [hovered, setHovered] = useState<HobbyId | null>(null);
  const [selected, setSelected] = useState<HobbyId>("skate");
  const hobby = HOBBIES.find((h) => h.id === selected)!;
  const Icon = hobby.icon;

  const shared = { hovered, setHovered, onSelect: setSelected };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="relative h-[560px] overflow-hidden rounded-2xl border border-[var(--pf-border)] bg-[var(--pf-bg-alt)] shadow-xl">
        <Canvas camera={{ position: [6.5, 5.5, 7], fov: 38 }} dpr={[1, 2]} shadows>
          <color attach="background" args={[palette.bgAlt]} />
          <ambientLight intensity={1.1} />
          <directionalLight position={[5, 8, 5]} intensity={1.3} castShadow />
          <pointLight position={[0, 3.2, -1]} intensity={12} color={palette.accent} />
          <Room palette={palette} />

          <HobbyObject id="gamejams" label="gamejams.md" glow={palette.accent} position={[0.6, 1.58, -3.3]} {...shared}>
            <Monitor palette={palette} />
          </HobbyObject>
          <HobbyObject id="piano" label="piano.md" glow={palette.accent3} position={[-0.4, 1.64, -1.75]} {...shared}>
            <Keyboard palette={palette} />
          </HobbyObject>
          <HobbyObject id="dnd" label="dnd.md" glow={palette.accent2} position={[2.4, 1.9, -1.8]} {...shared}>
            <D20 palette={palette} />
          </HobbyObject>
          <HobbyObject id="puzzles" label="puzzles.md" glow={palette.accent3} position={[-2.7, 1.58, -2.6]} {...shared}>
            <ChipsAndCards palette={palette} />
          </HobbyObject>
          <HobbyObject id="violin" label="violin.md" glow={palette.accent2} position={[3.9, 0.5, -2.9]} {...shared}>
            <Violin />
          </HobbyObject>
          <Suspense fallback={null}>
            <HobbyObject id="skate" label="skate.md" glow={palette.accent} position={[-4.6, 1.55, -3.7]} {...shared}>
              <LeaningBoard />
            </HobbyObject>
          </Suspense>

          <ContactShadows position={[0, 0.01, 0]} opacity={0.35} blur={2.5} scale={16} />
          <OrbitControls
            target={[0, 1.4, -2.4]}
            enableZoom={false}
            enablePan={false}
            minPolarAngle={0.7}
            maxPolarAngle={1.35}
            minAzimuthAngle={-0.7}
            maxAzimuthAngle={0.9}
          />
        </Canvas>
        <p className="pointer-events-none absolute bottom-3 left-4 font-mono text-xs text-[var(--pf-fg-muted)]">
          drag to look around · click an object
        </p>
      </div>

      <aside className="flex flex-col gap-4">
        <div className="rounded-2xl border border-[var(--pf-border)] bg-[var(--pf-raised)] p-5 shadow-lg">
          <p className="font-mono text-xs text-[var(--pf-fg-muted)]">
            <span className="text-[var(--pf-accent)]">$</span> cat {hobby.file}
          </p>
          <h3 className="mt-2 flex items-center gap-2 text-2xl font-semibold" style={{ color: `var(${hobby.accent})` }}>
            <Icon aria-hidden="true" /> {hobby.name}
          </h3>
          <p className="mt-2">{hobby.blurb}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--pf-fg-muted)]">
            {hobby.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {HOBBIES.map((h) => {
            const HIcon = h.icon;
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => setSelected(h.id)}
                onMouseEnter={() => setHovered(h.id)}
                onMouseLeave={() => setHovered(null)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${
                  selected === h.id
                    ? "border-[var(--pf-accent)] bg-[var(--pf-accent)] text-[var(--pf-on-accent)]"
                    : "border-[var(--pf-border)] bg-[var(--pf-raised)] hover:border-[var(--pf-accent)]"
                }`}
              >
                <HIcon aria-hidden="true" /> {h.name}
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
