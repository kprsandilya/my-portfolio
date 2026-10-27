// Terminal-style label that opens each section, e.g. "01  ~/education".
// Every section starts with the same label and rule, which makes it clear
// where one section ends and the next begins.
export default function SectionKicker({
  index,
  path,
  className = "",
}: {
  index: string;
  path: string;
  className?: string;
}) {
  return (
    <div className={`mx-auto flex w-full max-w-5xl items-center gap-4 px-6 ${className}`}>
      <span aria-hidden="true" className="h-px flex-1 bg-[var(--pf-border)]" />
      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[var(--pf-term)] px-4 py-1.5 font-mono text-sm text-[var(--pf-term-fg)] shadow-lg">
        <span className="text-[var(--pf-accent)]">{index}</span>
        <span aria-hidden="true" className="opacity-40">/</span>
        <span>
          <span className="text-[var(--pf-prompt)]">~</span>/{path}
        </span>
      </span>
      <span aria-hidden="true" className="h-px flex-1 bg-[var(--pf-border)]" />
    </div>
  );
}
