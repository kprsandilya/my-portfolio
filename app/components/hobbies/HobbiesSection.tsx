"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import SectionKicker from "../sectionKicker";
import { GradientText } from "@/components/ui/shadcn-io/gradient-text";

// The 3D scene (and the skateboard model) only load once the section is
// close to the screen, so they don't slow down the rest of the page.
const SkateparkScene = dynamic(() => import("./SkateparkScene"), { ssr: false });

const TITLE_GRADIENT = "linear-gradient(90deg, var(--pf-accent) 0%, var(--pf-accent-2) 50%, var(--pf-accent) 100%)";

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
    <section id="hobbies" className="relative bg-[color:var(--pf-term)] text-[var(--pf-term-fg)]">
      <SectionKicker index="06" path="hobbies" className="pt-16" />
      <div className="flex flex-col items-center px-6 pb-10 pt-10 text-center">
        <GradientText
          className="text-5xl font-semibold leading-none tracking-tighter sm:text-6xl md:text-8xl"
          gradient={TITLE_GRADIENT}
          text="Off the Clock"
        />
        <p className="mt-4 font-mono text-sm opacity-70">
          <span className="text-[var(--pf-prompt)]">~/hobbies</span> <span className="text-[var(--pf-accent)]">$</span>{" "}
          scroll to ride through what I do for fun
        </p>
      </div>

      {/* Same height as the scene's scroll track, so the page doesn't jump when it loads. */}
      <div ref={trigger}>{near ? <SkateparkScene /> : <div className="h-[600vh]" aria-hidden="true" />}</div>
    </section>
  );
}
