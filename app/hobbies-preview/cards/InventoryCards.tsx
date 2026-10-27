"use client";

import dynamic from "next/dynamic";
import { useRef, useState, type MouseEvent } from "react";
import { HOBBIES, type Hobby } from "../_shared/hobbies";

const SpinBoardCanvas = dynamic(() => import("./SpinBoardCanvas"), { ssr: false });

// Playful rarity labels for the RPG framing. Edit freely.
const RARITY: Record<Hobby["id"], string> = {
  skate: "Rare",
  violin: "Legendary",
  piano: "Uncommon",
  gamejams: "Epic",
  dnd: "Legendary",
  puzzles: "Rare",
};

function ItemCard({ hobby }: { hobby: Hobby }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0, mx: 50, my: 50 });
  const [flipped, setFlipped] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const Icon = hobby.icon;
  const color = `var(${hobby.accent})`;

  const onMove = (e: MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({ x: (0.5 - py) * 14, y: (px - 0.5) * 14, mx: px * 100, my: py * 100 });
  };

  const face =
    "absolute inset-0 flex flex-col overflow-hidden rounded-2xl border-2 [backface-visibility:hidden] [-webkit-backface-visibility:hidden]";

  return (
    <div className="[perspective:1100px]">
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={`${hobby.name} card: ${flipped ? "show front" : "show story"}`}
        onMouseMove={onMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0, mx: 50, my: 50 })}
        onClick={() => setFlipped((f) => !f)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setFlipped((f) => !f);
          }
        }}
        className="relative aspect-[3/4] cursor-pointer transition-transform duration-500 ease-out [transform-style:preserve-3d]"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y + (flipped ? 180 : 0)}deg)`,
        }}
      >
        {/* front */}
        <div className={`${face} bg-[var(--pf-raised)]`} style={{ borderColor: color }}>
          <div className="flex items-center justify-between px-4 pt-3 font-mono text-[11px] uppercase tracking-widest">
            <span style={{ color }}>{RARITY[hobby.id]}</span>
            <span className="text-[var(--pf-fg-muted)]">{hobby.kind}</span>
          </div>

          <div className="relative mx-4 mt-2 flex h-[42%] items-center justify-center overflow-hidden rounded-xl bg-[var(--pf-term)]">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-40"
              style={{ background: `radial-gradient(circle at 50% 60%, ${color}, transparent 65%)` }}
            />
            {hobby.id === "skate" ? (
              <div className="absolute inset-0">
                <SpinBoardCanvas />
              </div>
            ) : (
              <Icon className="relative h-24 w-24 text-[var(--pf-term-fg)]" aria-hidden="true" />
            )}
          </div>

          <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
            <h3 className="text-xl font-semibold text-[var(--pf-fg)]">{hobby.name}</h3>
            <dl className="mt-2 space-y-1 font-mono text-xs">
              {hobby.stats.map((s) => (
                <div key={s.label} className="flex justify-between gap-2 border-b border-[var(--pf-border)]/60 pb-1">
                  <dt className="text-[var(--pf-fg-muted)]">{s.label}</dt>
                  <dd className="text-right text-[var(--pf-fg)]">{s.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-auto pt-2 text-xs italic text-[var(--pf-fg-muted)]">“{hobby.flavor}”</p>
          </div>

          {/* moving shine */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl mix-blend-overlay"
            style={{ background: `radial-gradient(circle at ${tilt.mx}% ${tilt.my}%, rgba(255,255,255,0.45), transparent 45%)` }}
          />
        </div>

        {/* back */}
        <div
          className={`${face} bg-[var(--pf-term)] p-5 text-[var(--pf-term-fg)] [transform:rotateY(180deg)]`}
          style={{ borderColor: color }}
        >
          <p className="font-mono text-xs opacity-70">
            <span className="text-[var(--pf-prompt)]">$</span> cat lore/{hobby.file}
          </p>
          <h3 className="mt-2 flex items-center gap-2 text-xl font-semibold" style={{ color }}>
            <Icon aria-hidden="true" /> {hobby.name}
          </h3>
          <p className="mt-3 text-sm">{hobby.blurb}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm opacity-80">
            {hobby.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <p className="mt-auto font-mono text-[11px] opacity-60">click to flip back</p>
        </div>
      </div>
    </div>
  );
}

export default function InventoryCards() {
  return (
    <div>
      <p className="mb-4 text-center font-mono text-sm text-[var(--pf-fg-muted)]">
        <span className="text-[var(--pf-accent)]">$</span> inventory --hobbies · {HOBBIES.length} items
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {HOBBIES.map((h) => (
          <ItemCard key={h.id} hobby={h} />
        ))}
      </div>
    </div>
  );
}
