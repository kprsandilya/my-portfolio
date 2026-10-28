"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Footer from "../components/footer";
import HobbiesTitle from "../components/hobbies/HobbiesTitle";

// Preview of the skatepark version of the hobbies section, to compare with
// the half-pipe on the home page before picking one.
const ParkScene = dynamic(() => import("../components/hobbies/ParkScene"), {
  ssr: false,
  loading: () => (
    <div className="relative h-[800vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <HobbiesTitle />
      </div>
    </div>
  ),
});

export default function HobbiesParkPreview() {
  return (
    <main className="bg-[color:var(--pf-term)] text-[var(--pf-term-fg)]">
      <div className="px-6 pt-10 font-mono text-sm opacity-70">
        <span className="text-[var(--pf-prompt)]">~/preview</span> <span className="text-[var(--pf-accent)]">$</span> hobbies --park{" "}
        <Link href="/#hobbies" className="underline underline-offset-4 hover:text-[var(--pf-accent)]">
          (compare with the half-pipe)
        </Link>
      </div>
      <section id="hobbies" className="relative">
        <ParkScene />
      </section>
      <Footer />
    </main>
  );
}
