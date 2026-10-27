import Link from "next/link";
import { MOCKUPS } from "./_shared/hobbies";

// Index of the hobbies-section mockups. Temporary: once one is chosen
// it moves to the home page and this folder is deleted.
export default function HobbiesPreviewIndex() {
  return (
    <div className="min-h-screen bg-[var(--pf-bg)] px-6 pb-24 pt-28 text-[var(--pf-fg)]">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-sm text-[var(--pf-fg-muted)]">
          <span className="text-[var(--pf-accent)]">$</span> ls ~/hobbies-preview
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Hobbies section mockups</h1>
        <p className="mt-2 text-[var(--pf-fg-muted)]">
          Two takes on a hobbies section for the bottom of the home page. Each one works with the light, dark, and
          surprise themes.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {MOCKUPS.map((m, i) => (
            <Link
              key={m.slug}
              href={`/hobbies-preview/${m.slug}`}
              className="group rounded-2xl border border-[var(--pf-border)] bg-[var(--pf-raised)] p-5 transition hover:-translate-y-1 hover:border-[var(--pf-accent)] hover:shadow-xl"
            >
              <p className="font-mono text-xs text-[var(--pf-accent)]">0{i + 1}</p>
              <h2 className="mt-1 text-xl font-semibold group-hover:text-[var(--pf-accent)]">{m.title}</h2>
              <p className="mt-1 text-sm text-[var(--pf-fg-muted)]">{m.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
