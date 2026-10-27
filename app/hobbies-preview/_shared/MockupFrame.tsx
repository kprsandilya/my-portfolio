"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import SectionKicker from "../../components/sectionKicker";
import { MOCKUPS } from "./hobbies";

// Wraps each mockup: a switcher bar to move between the five designs, then
// the hobbies section label and title, styled like the rest of the site.
export default function MockupFrame({
  slug,
  children,
  bare = false,
}: {
  slug: (typeof MOCKUPS)[number]["slug"];
  children: ReactNode;
  // bare: the mockup draws its own full-width stage (no padded container)
  bare?: boolean;
}) {
  const index = MOCKUPS.findIndex((m) => m.slug === slug);
  const mockup = MOCKUPS[index];
  const prev = MOCKUPS[(index + MOCKUPS.length - 1) % MOCKUPS.length];
  const next = MOCKUPS[(index + 1) % MOCKUPS.length];

  return (
    <div className="min-h-screen bg-[var(--pf-bg)] pt-20 text-[var(--pf-fg)]">
      <div className="sticky top-[57px] z-40 border-b border-[var(--pf-border)] bg-[var(--pf-bg)]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-6 py-2 font-mono text-sm">
          <Link href="/hobbies-preview" className="text-[var(--pf-fg-muted)] hover:text-[var(--pf-accent)]">
            ~/hobbies-preview
          </Link>
          <span className="text-[var(--pf-fg-muted)]">/</span>
          <span className="font-semibold">
            Mockup {index + 1} of {MOCKUPS.length}: {mockup.title}
          </span>
          <span className="ml-auto flex gap-2">
            <Link
              href={`/hobbies-preview/${prev.slug}`}
              className="rounded-md border border-[var(--pf-border)] px-3 py-1 hover:border-[var(--pf-accent)] hover:text-[var(--pf-accent)]"
            >
              ← {prev.title}
            </Link>
            <Link
              href={`/hobbies-preview/${next.slug}`}
              className="rounded-md border border-[var(--pf-border)] px-3 py-1 hover:border-[var(--pf-accent)] hover:text-[var(--pf-accent)]"
            >
              {next.title} →
            </Link>
          </span>
        </div>
      </div>

      <SectionKicker index="06" path="hobbies" className="pt-14" />
      <div className="px-6 pt-10 pb-4 text-center">
        <h2 className="bg-[linear-gradient(90deg,var(--pf-accent),var(--pf-accent-2),var(--pf-accent))] bg-clip-text text-5xl font-semibold tracking-tighter text-transparent sm:text-6xl md:text-7xl">
          Off the Clock
        </h2>
        <p className="mt-3 text-[var(--pf-fg-muted)]">{mockup.summary}</p>
      </div>

      {bare ? children : <div className="mx-auto max-w-6xl px-6 pb-24 pt-8">{children}</div>}
    </div>
  );
}
