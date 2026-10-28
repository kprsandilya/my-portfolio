"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import HobbiesTitle from "./HobbiesTitle";

// The 3D scene (and the skateboard model) only load once the section is
// close to the screen, so they don't slow down the rest of the page.
const SkateparkScene = dynamic(() => import("./SkateparkScene"), { ssr: false, loading: () => <Placeholder /> });

// Same height and pinned title as the scene, so nothing moves when it loads.
function Placeholder() {
  return (
    <div className="relative h-[600vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <HobbiesTitle />
      </div>
    </div>
  );
}

export default function HobbiesSection() {
  const trigger = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = trigger.current;
    if (!el) return;
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
  }, []);

  return (
    // The title lives inside the pinned stage (over the half-pipe) instead of
    // above it, so scrolling flows straight from the title into the run.
    <section id="hobbies" ref={trigger} className="relative bg-[color:var(--pf-term)] text-[var(--pf-term-fg)]">
      {near ? <SkateparkScene /> : <Placeholder />}
    </section>
  );
}
