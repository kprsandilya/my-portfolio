"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
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

// For visitors whose system asks for reduced motion: the same title and the
// hobbies as a simple grid of cards, with no scroll-driven animation.
function StaticHobbies() {
  return (
    <div className="pb-24">
      <div className="relative h-[22rem]">
        <HobbiesTitle />
      </div>
      <div className="mx-auto grid max-w-5xl gap-4 px-6 sm:grid-cols-2 lg:grid-cols-3">
        {HOBBIES.map((hobby) => {
          const Icon = hobby.icon;
          return (
            <div key={hobby.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="font-mono text-xs opacity-70">
                <span className="text-[var(--pf-prompt)]">~/hobbies</span> <span className="text-[var(--pf-accent)]">$</span> ./{hobby.id}
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
    </div>
  );
}

export default function HobbiesSection() {
  const trigger = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const el = trigger.current;
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

  return (
    // The title lives inside the pinned stage (over the skatepark) instead of
    // above it, so scrolling flows straight from the title into the run.
    <section id="hobbies" ref={trigger} className="relative bg-[color:var(--pf-term)] text-[var(--pf-term-fg)]">
      {reduceMotion ? <StaticHobbies /> : near ? <ParkScene /> : <Placeholder />}
    </section>
  );
}
