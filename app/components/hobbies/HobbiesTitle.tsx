import type { ReactNode } from "react";
import SectionKicker from "../sectionKicker";
import { GradientText } from "@/components/ui/shadcn-io/gradient-text";

const TITLE_GRADIENT = "linear-gradient(90deg, var(--pf-accent) 0%, var(--pf-accent-2) 50%, var(--pf-accent) 100%)";

// Section label and title, drawn over the top of the skatepark stage. Used by
// both the loading placeholder and the 3D scene so the title never moves.
// `children` replaces the hint line under the title ("scroll to drop in").
export default function HobbiesTitle({ children }: { children?: ReactNode }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 pt-20 text-center text-[var(--pf-term-fg)]">
      <SectionKicker index="06" path="hobbies" />
      <div className="px-6 pt-10">
        <GradientText
          className="text-5xl font-semibold leading-none tracking-tighter sm:text-6xl md:text-8xl"
          gradient={TITLE_GRADIENT}
          text="Off the Clock"
        />
        {children ?? (
          <p className="mt-4 font-mono text-sm opacity-70">
            <span className="text-[var(--pf-prompt)]">~/hobbies</span> <span className="text-[var(--pf-accent)]">$</span>{" "}
            scroll to drop in
          </p>
        )}
      </div>
    </div>
  );
}
