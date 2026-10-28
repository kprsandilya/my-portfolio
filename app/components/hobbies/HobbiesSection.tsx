"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import HobbiesTitle from "./HobbiesTitle";
import { HOBBIES } from "./hobbies";

// The 3D scene (and the skateboard model) only load once the section is
// close to the screen, so they don't slow down the rest of the page.
const ParkScene = dynamic(() => import("./ParkScene"), { ssr: false, loading: () => <Placeholder /> });

// Same height and pinned title as the scene, so nothing moves when it loads.
function Placeholder() {
  return (
    <div className="relative h-[800vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <HobbiesTitle />
      </div>
    </div>
  );
}

const Prompt = () => (
  <>
    <span className="text-[var(--pf-prompt)]">~/hobbies</span> <span className="text-[var(--pf-accent)]">$</span>
  </>
);

// The hobbies as a grid of cards. After the run, each card shows the trick
// that unlocked it.
function HobbyCards({ landed = false }: { landed?: boolean }) {
  return (
    <div className="mx-auto grid max-w-5xl gap-4 px-6 sm:grid-cols-2 lg:grid-cols-3">
      {HOBBIES.map((hobby) => {
        const Icon = hobby.icon;
        return (
          <div key={hobby.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="flex items-center justify-between gap-2 font-mono text-xs opacity-70">
              <span>
                <Prompt /> {landed ? hobby.trick : `./${hobby.id}`}
              </span>
              {landed && <span className="text-[var(--pf-prompt)]">landed</span>}
            </p>
            <p className="mt-3 flex items-center gap-2 text-xl font-semibold" style={{ color: `var(${hobby.accent})` }}>
              <Icon aria-hidden="true" /> {hobby.name}
            </p>
            <p className="mt-2 text-sm">{hobby.blurb}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs opacity-75">
              {hobby.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

// For visitors whose system asks for reduced motion: the title and the
// hobbies as cards, with no scroll-driven animation.
function StaticHobbies() {
  return (
    <div className="pb-24">
      <div className="relative h-[22rem]">
        <HobbiesTitle>
          <p className="mt-4 font-mono text-sm opacity-70">
            <Prompt /> ls
          </p>
        </HobbiesTitle>
      </div>
      <HobbyCards />
    </div>
  );
}

// Shown once the run has played to the end, so scrolling back up the page
// passes a normal-height section instead of replaying the whole run.
function RunRecap({ onReplay }: { onReplay: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="pb-24">
      <div className="relative h-[26rem]">
        <HobbiesTitle>
          <p className="mt-4 font-mono text-sm opacity-70">
            <Prompt /> exit <span className="opacity-60">&middot;</span> run complete, {HOBBIES.length}/{HOBBIES.length} tricks landed
          </p>
          <button
            type="button"
            onClick={onReplay}
            className="pointer-events-auto mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--pf-accent)] px-5 py-2 font-mono text-sm text-[var(--pf-term-fg)] transition-colors hover:bg-[var(--pf-accent)] hover:text-[var(--pf-on-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pf-accent)]"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Replay the run
          </button>
        </HobbiesTitle>
      </div>
      <HobbyCards landed />
    </motion.div>
  );
}

export default function HobbiesSection() {
  const section = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [done, setDone] = useState(false);
  const reduceMotion = useReducedMotion();
  // What to do with the scroll position right after the section swaps
  // between the run and the recap.
  const pending = useRef<{ kind: "keep-bottom"; bottom: number } | { kind: "to-start" } | null>(null);

  useEffect(() => {
    const el = section.current;
    if (!el || reduceMotion) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      // Start a few screens early so the board is ready when you arrive.
      { rootMargin: "300% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduceMotion]);

  // The run reached 100%: swap the tall scroll track for the recap. The
  // browser's own scroll anchoring is paused so the adjustment below is the
  // only one.
  const complete = useCallback(() => {
    const el = section.current;
    if (!el) return;
    document.documentElement.style.overflowAnchor = "none";
    pending.current = { kind: "keep-bottom", bottom: el.getBoundingClientRect().bottom };
    setDone(true);
  }, []);

  const replay = useCallback(() => {
    pending.current = { kind: "to-start" };
    setDone(false);
  }, []);

  useLayoutEffect(() => {
    const el = section.current;
    const todo = pending.current;
    pending.current = null;
    if (!el || !todo) return;
    if (todo.kind === "keep-bottom") {
      // The section got much shorter. Keep its bottom edge (and the footer
      // below it) where it was on screen, so the page doesn't jump.
      window.scrollBy(0, el.getBoundingClientRect().bottom - todo.bottom);
      requestAnimationFrame(() => {
        document.documentElement.style.overflowAnchor = "";
      });
    } else {
      // Back to the start of the run.
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "smooth" });
    }
  }, [done]);

  let content;
  if (reduceMotion) content = <StaticHobbies />;
  else if (done) content = <RunRecap onReplay={replay} />;
  else if (near) content = <ParkScene onComplete={complete} />;
  else content = <Placeholder />;

  return (
    // The title lives inside the pinned stage (over the skatepark) instead of
    // above it, so scrolling flows straight from the title into the run.
    <section id="hobbies" ref={section} className="relative bg-[color:var(--pf-term)] text-[var(--pf-term-fg)]">
      {content}
    </section>
  );
}
