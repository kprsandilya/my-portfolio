"use client";

import { useEffect, useRef, useState } from "react";
import { HOBBIES, type Hobby } from "../_shared/hobbies";
import { usePalette, type Palette } from "../_shared/usePalette";

const HEIGHT = 360;
const GROUND = 70; // distance from the bottom of the canvas
const GRAVITY = 2600;
const JUMP_VELOCITY = -880;
const START_SPEED = 360;
const OBSTACLE_LABELS = ["{ }", ";", "404", "npm i", "NaN", "!==", "null", "git push -f"];
const HIGH_SCORE_KEY = "hobbies-skate-high-score";

type Phase = "ready" | "playing" | "over";

interface Obstacle { x: number; w: number; h: number; label: string }
interface Pickup { x: number; y: number; hobby: number; taken: boolean }

function readHighScore() {
  try {
    return Number(localStorage.getItem(HIGH_SCORE_KEY)) || 0;
  } catch {
    return 0;
  }
}

function saveHighScore(score: number) {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, String(score));
  } catch {
    // storage blocked: high score just won't persist
  }
}

function accentFor(p: Palette, h: Hobby) {
  return h.accent === "--pf-accent" ? p.accent : h.accent === "--pf-accent-2" ? p.accent2 : p.accent3;
}

export default function SkateGame() {
  const palette = usePalette();
  const paletteRef = useRef(palette);
  paletteRef.current = palette;

  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [unlocked, setUnlocked] = useState<Set<Hobby["id"]>>(new Set());
  const [shown, setShown] = useState<Hobby | null>(null);

  // Mutable game state lives in a ref so the animation loop doesn't re-render.
  const game = useRef({
    phase: "ready" as Phase,
    width: 800,
    y: 0,
    vy: 0,
    onGround: true,
    spin: 0,
    speed: START_SPEED,
    distance: 0,
    spawnIn: 1,
    pickupIn: 2.5,
    obstacles: [] as Obstacle[],
    pickups: [] as Pickup[],
    nextHobby: 0,
  });

  useEffect(() => setHighScore(readHighScore()), []);

  const reset = () => {
    Object.assign(game.current, {
      y: 0, vy: 0, onGround: true, spin: 0, speed: START_SPEED, distance: 0,
      spawnIn: 1, pickupIn: 2.5, obstacles: [], pickups: [],
    });
    setScore(0);
  };

  const jump = () => {
    const g = game.current;
    if (g.phase === "ready" || g.phase === "over") {
      reset();
      g.phase = "playing";
      setPhase("playing");
      return;
    }
    if (g.onGround) {
      g.vy = JUMP_VELOCITY;
      g.onGround = false;
    }
  };

  // Keyboard controls (only while the game area is on screen).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space" && e.code !== "ArrowUp") return;
      const r = wrap.current?.getBoundingClientRect();
      if (!r || r.bottom < 0 || r.top > window.innerHeight) return;
      e.preventDefault();
      jump();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Size the canvas to its container.
  useEffect(() => {
    const el = wrap.current;
    const c = canvas.current;
    if (!el || !c) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = el.clientWidth;
      game.current.width = w;
      c.width = w * dpr;
      c.height = HEIGHT * dpr;
      c.style.width = `${w}px`;
      c.style.height = `${HEIGHT}px`;
      c.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Game loop.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const groundY = HEIGHT - GROUND;
    const playerX = 110;

    const loop = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      const g = game.current;
      const p = paletteRef.current;
      const ctx = canvas.current?.getContext("2d");
      const W = g.width;

      if (g.phase === "playing") {
        g.speed += dt * 12;
        g.distance += g.speed * dt;
        // player physics
        g.vy += GRAVITY * dt;
        g.y += g.vy * dt;
        if (g.y >= 0) {
          g.y = 0;
          g.vy = 0;
          g.onGround = true;
          g.spin = 0;
        } else {
          g.spin += dt * 14; // kickflip spin while airborne
        }

        // spawn obstacles and pickups
        g.spawnIn -= dt;
        if (g.spawnIn <= 0) {
          const h = 28 + Math.random() * 30;
          g.obstacles.push({ x: W + 20, w: 34 + Math.random() * 40, h, label: OBSTACLE_LABELS[Math.floor(Math.random() * OBSTACLE_LABELS.length)] });
          g.spawnIn = 0.95 + Math.random() * 0.9 - Math.min(0.35, g.distance / 40000);
        }
        g.pickupIn -= dt;
        if (g.pickupIn <= 0) {
          g.pickups.push({ x: W + 20, y: 120 + Math.random() * 40, hobby: g.nextHobby % HOBBIES.length, taken: false });
          g.nextHobby += 1;
          g.pickupIn = 3 + Math.random() * 2;
        }

        // move and collide
        const playerTop = groundY + g.y - 64;
        const playerBottom = groundY + g.y;
        for (const o of g.obstacles) {
          o.x -= g.speed * dt;
          const hitX = playerX + 26 > o.x && playerX - 26 < o.x + o.w;
          const hitY = playerBottom > groundY - o.h + 4;
          if (hitX && hitY) {
            g.phase = "over";
            setPhase("over");
            const final = Math.floor(g.distance / 10);
            setScore(final);
            if (final > readHighScore()) {
              saveHighScore(final);
              setHighScore(final);
            }
          }
        }
        for (const k of g.pickups) {
          k.x -= g.speed * dt;
          if (!k.taken && Math.abs(k.x - playerX) < 30 && k.y + 16 > playerTop && k.y - 16 < playerBottom) {
            k.taken = true;
            const hobby = HOBBIES[k.hobby];
            setUnlocked((u) => new Set(u).add(hobby.id));
            setShown(hobby);
          }
        }
        g.obstacles = g.obstacles.filter((o) => o.x + o.w > -10);
        g.pickups = g.pickups.filter((k) => k.x > -30 && !k.taken);
        if (Math.floor(g.distance) % 5 === 0) setScore(Math.floor(g.distance / 10));
      }

      if (ctx) {
        // background and parallax grid
        ctx.fillStyle = p.term;
        ctx.fillRect(0, 0, W, HEIGHT);
        ctx.strokeStyle = p.term2;
        ctx.lineWidth = 1;
        const offset = (g.distance * 0.3) % 40;
        for (let x = -offset; x < W; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, groundY);
          ctx.stroke();
        }
        // ground
        ctx.strokeStyle = p.prompt;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, groundY + 10);
        ctx.lineTo(W, groundY + 10);
        ctx.stroke();
        ctx.fillStyle = p.prompt;
        ctx.font = "12px ui-monospace, monospace";
        const dash = (g.distance * 1) % 60;
        for (let x = -dash; x < W; x += 60) ctx.fillText("_", x, groundY + 30);

        // obstacles
        for (const o of g.obstacles) {
          ctx.fillStyle = p.accent2;
          ctx.globalAlpha = 0.2;
          ctx.fillRect(o.x, groundY + 10 - o.h, o.w, o.h);
          ctx.globalAlpha = 1;
          ctx.strokeStyle = p.accent2;
          ctx.strokeRect(o.x, groundY + 10 - o.h, o.w, o.h);
          ctx.fillStyle = p.termFg;
          ctx.font = "11px ui-monospace, monospace";
          ctx.textAlign = "center";
          ctx.fillText(o.label, o.x + o.w / 2, groundY + 10 - o.h / 2 + 4);
        }

        // pickups
        for (const k of g.pickups) {
          const h = HOBBIES[k.hobby];
          ctx.fillStyle = accentFor(p, h);
          ctx.beginPath();
          ctx.arc(k.x, k.y + Math.sin(now / 200 + k.x / 50) * 4, 15, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = p.term;
          ctx.font = "bold 12px ui-monospace, monospace";
          ctx.textAlign = "center";
          ctx.fillText(h.name[0], k.x, k.y + 4 + Math.sin(now / 200 + k.x / 50) * 4);
        }

        // rider and board
        const by = groundY + g.y;
        ctx.save();
        ctx.translate(playerX, by);
        // rider
        ctx.fillStyle = p.termFg;
        ctx.beginPath();
        ctx.arc(0, -56, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(-5, -46, 10, 26);
        ctx.strokeStyle = p.termFg;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-3, -22);
        ctx.lineTo(-10, -6);
        ctx.moveTo(3, -22);
        ctx.lineTo(10, -6);
        ctx.moveTo(-5, -40);
        ctx.lineTo(-16, -30);
        ctx.moveTo(5, -40);
        ctx.lineTo(16, -32);
        ctx.stroke();
        // board (squashes vertically while spinning = kickflip)
        ctx.translate(0, 2);
        ctx.scale(1, Math.cos(g.spin) || 0.05);
        ctx.fillStyle = p.accent;
        ctx.beginPath();
        ctx.roundRect(-30, -4, 60, 7, 4);
        ctx.fill();
        ctx.fillStyle = p.accent3;
        ctx.beginPath();
        ctx.arc(-18, 6, 4, 0, Math.PI * 2);
        ctx.arc(18, 6, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.textAlign = "left";
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="mx-auto max-w-5xl">
      <div
        ref={wrap}
        className="relative cursor-pointer select-none overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
        onPointerDown={(e) => {
          e.preventDefault();
          jump();
        }}
      >
        <canvas ref={canvas} aria-label="Skateboard mini-game" />

        <div className="pointer-events-none absolute right-4 top-3 text-right font-mono text-sm text-[var(--pf-term-fg)]">
          <p>score {String(score).padStart(5, "0")}</p>
          <p className="text-xs opacity-60">best {String(highScore).padStart(5, "0")}</p>
        </div>
        <p className="pointer-events-none absolute left-4 top-3 font-mono text-sm text-[var(--pf-term-fg)]">
          <span className="text-[var(--pf-prompt)]">~/hobbies</span> <span className="text-[var(--pf-accent)]">$</span> ./skate
        </p>

        {phase !== "playing" && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 font-mono text-[var(--pf-term-fg)]">
            {phase === "over" && <p className="text-2xl font-semibold text-[var(--pf-accent-2)]">bailed! score {score}</p>}
            <p className="text-lg">
              press <span className="rounded border border-white/30 px-2">space</span> or tap to {phase === "over" ? "retry" : "start"}
            </p>
            <p className="text-xs opacity-70">ollie over the bugs · grab the glowing tokens to unlock hobbies</p>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {HOBBIES.map((h) => {
          const Icon = h.icon;
          const open = unlocked.has(h.id);
          return (
            <button
              key={h.id}
              type="button"
              disabled={!open}
              onClick={() => setShown(h)}
              className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-center text-xs transition ${
                open
                  ? "border-[var(--pf-accent)] bg-[var(--pf-raised)] text-[var(--pf-fg)] hover:-translate-y-0.5"
                  : "border-dashed border-[var(--pf-border)] text-[var(--pf-fg-muted)] opacity-60"
              }`}
            >
              <Icon className="h-7 w-7" style={open ? { color: `var(${h.accent})` } : undefined} aria-hidden="true" />
              {open ? h.name : "locked"}
            </button>
          );
        })}
      </div>

      {shown && (
        <div className="mt-4 rounded-xl border border-[var(--pf-border)] bg-[var(--pf-raised)] p-4">
          <p className="font-mono text-xs text-[var(--pf-fg-muted)]">
            <span className="text-[var(--pf-accent)]">unlocked</span> · {shown.file}
          </p>
          <p className="mt-1 font-semibold" style={{ color: `var(${shown.accent})` }}>{shown.name}</p>
          <p className="text-sm">{shown.blurb}</p>
        </div>
      )}
    </div>
  );
}
