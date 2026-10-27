"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { HOBBIES } from "../_shared/hobbies";
import { playPiano, playViolin } from "../_shared/sounds";

// The 3D board loads only when someone runs ./skate, keeping the page light.
const KickflipCanvas = dynamic(() => import("../_shared/KickflipCanvas"), {
  ssr: false,
  loading: () => <p className="p-4 text-[var(--pf-fg-muted)]">loading board.glb …</p>,
});

type Line = { id: number; kind: "cmd" | "out"; body: ReactNode };

const SUGGESTIONS = ["help", "ls", "cat violin.md", "play violin", "play piano", "roll d20", "./skate --kickflip"];

const Accent = ({ children, n = 1 }: { children: ReactNode; n?: 1 | 2 | 3 }) => (
  <span className={n === 1 ? "text-[var(--pf-accent)]" : n === 2 ? "text-[var(--pf-accent-2)]" : "text-[var(--pf-accent-3)]"}>
    {children}
  </span>
);

function DiceRoll() {
  const [value, setValue] = useState(1);
  const [done, setDone] = useState(false);
  useEffect(() => {
    let ticks = 0;
    const final = 1 + Math.floor(Math.random() * 20);
    const id = setInterval(() => {
      ticks += 1;
      if (ticks >= 14) {
        setValue(final);
        setDone(true);
        clearInterval(id);
      } else {
        setValue(1 + Math.floor(Math.random() * 20));
      }
    }, 60);
    return () => clearInterval(id);
  }, []);
  return (
    <span>
      🎲 d20 → <span className="inline-block min-w-[2ch] text-right font-bold text-[var(--pf-prompt)]">{value}</span>
      {done && value === 20 && <Accent n={2}> natural 20! the party cheers.</Accent>}
      {done && value === 1 && <Accent n={2}> natural 1. the DM smiles.</Accent>}
    </span>
  );
}

function SkatePanel() {
  const [flipKey, setFlipKey] = useState(1);
  return (
    <div className="my-2 overflow-hidden rounded-lg border border-white/10 bg-[var(--pf-term-2)]">
      <div className="h-64 w-full">
        <KickflipCanvas flipKey={flipKey} />
      </div>
      <div className="flex items-center justify-between border-t border-white/10 px-3 py-2 text-xs">
        <span className="opacity-70">board.glb · drag-free preview</span>
        <button
          type="button"
          onClick={() => setFlipKey((k) => k + 1)}
          className="rounded border border-white/20 px-2 py-0.5 hover:border-[var(--pf-prompt)] hover:text-[var(--pf-prompt)]"
        >
          kickflip again
        </button>
      </div>
    </div>
  );
}

export default function HobbyShell() {
  const [lines, setLines] = useState<Line[]>(() => [
    {
      id: 0,
      kind: "out",
      body: (
        <span>
          Welcome to <Accent>sandilya-sh</Accent>. Type <Accent n={3}>help</Accent> or click a command below.
        </span>
      ),
    },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const nextId = useRef(1);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const push = (kind: Line["kind"], body: ReactNode) =>
    setLines((ls) => [...ls, { id: nextId.current++, kind, body }]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    push("cmd", cmd);
    setHistory((h) => [...h, cmd]);
    setHistoryIndex(null);

    const [name, ...args] = cmd.split(/\s+/);
    const arg = args.join(" ");

    switch (name) {
      case "help":
        push(
          "out",
          <div className="grid grid-cols-[max-content_1fr] gap-x-6">
            {[
              ["ls", "list hobbies"],
              ["cat <file>", "read about one"],
              ["play violin | piano", "hear it (turn sound on)"],
              ["roll d20", "for the D&D folks"],
              ["./skate --kickflip", "load the 3D board"],
              ["whoami", "who's typing"],
              ["clear", "clear the screen"],
            ].map(([c, d]) => (
              <div key={c} className="contents">
                <Accent n={3}>{c}</Accent>
                <span className="opacity-70">{d}</span>
              </div>
            ))}
          </div>
        );
        break;
      case "ls":
        push(
          "out",
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {HOBBIES.map((h) => (
              <button key={h.id} type="button" onClick={() => run(`cat ${h.file}`)} className="hover:underline">
                <Accent n={h.accent === "--pf-accent" ? 1 : h.accent === "--pf-accent-2" ? 2 : 3}>{h.file}</Accent>
              </button>
            ))}
          </div>
        );
        break;
      case "cat": {
        const hobby = HOBBIES.find((h) => h.file === arg || h.id === arg);
        if (!hobby) {
          push("out", <span>cat: {arg || "(no file)"}: No such file. Try <Accent n={3}>ls</Accent>.</span>);
          break;
        }
        const Icon = hobby.icon;
        push(
          "out",
          <div className="space-y-1">
            <p className="flex items-center gap-2 font-semibold">
              <Icon aria-hidden="true" /> # {hobby.name}
            </p>
            <p>{hobby.blurb}</p>
            {hobby.details.map((d) => (
              <p key={d} className="opacity-80">- {d}</p>
            ))}
            {hobby.id === "violin" && <p className="opacity-60">tip: try <Accent n={3}>play violin</Accent></p>}
            {hobby.id === "piano" && <p className="opacity-60">tip: try <Accent n={3}>play piano</Accent></p>}
            {hobby.id === "dnd" && <p className="opacity-60">tip: try <Accent n={3}>roll d20</Accent></p>}
            {hobby.id === "skate" && <p className="opacity-60">tip: try <Accent n={3}>./skate --kickflip</Accent></p>}
          </div>
        );
        break;
      }
      case "play": {
        const ok = arg === "violin" ? playViolin() : arg === "piano" ? playPiano() : null;
        if (ok === null) push("out", <span>play: try <Accent n={3}>play violin</Accent> or <Accent n={3}>play piano</Accent></span>);
        else if (!ok) push("out", <span>play: audio isn&apos;t available in this browser.</span>);
        else push("out", <span>♪ playing a short {arg} phrase…</span>);
        break;
      }
      case "roll":
        push("out", <DiceRoll />);
        break;
      case "./skate":
      case "skate":
        push("out", <SkatePanel />);
        break;
      case "whoami":
        push("out", <span>sandilya: CS and Data Science at Purdue. Off the clock: skating, violin, piano, game jams, D&amp;D, and puzzles.</span>);
        break;
      case "clear":
        setLines([]);
        break;
      default:
        push("out", <span>{name}: command not found. Try <Accent n={3}>help</Accent>.</span>);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    run(input);
    setInput("");
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div
        className="overflow-hidden rounded-xl border border-white/10 bg-[var(--pf-term)] font-mono text-sm text-[var(--pf-term-fg)] shadow-2xl"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-center gap-2 border-b border-white/10 bg-black/20 px-4 py-2">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="h-3 w-3 rounded-full bg-green-400" />
          <span className="ml-2 opacity-70">sandilya@purdue: ~/hobbies</span>
        </div>

        <div ref={scroller} className="h-[460px] space-y-2 overflow-y-auto overscroll-contain p-4">
          {lines.map((l) =>
            l.kind === "cmd" ? (
              <p key={l.id}>
                <span className="text-[var(--pf-prompt)]">~/hobbies</span> <Accent>$</Accent> {l.body}
              </p>
            ) : (
              <div key={l.id} className="pl-1">{l.body}</div>
            )
          )}
          <form onSubmit={onSubmit} className="flex items-center gap-2">
            <span className="text-[var(--pf-prompt)]">~/hobbies</span>
            <Accent>$</Accent>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" && history.length) {
                  e.preventDefault();
                  const i = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
                  setHistoryIndex(i);
                  setInput(history[i]);
                }
              }}
              aria-label="Terminal command"
              autoComplete="off"
              spellCheck={false}
              className="flex-1 bg-transparent caret-[var(--pf-prompt)] outline-none"
            />
          </form>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2 font-mono text-xs">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => run(s)}
            className="rounded-full border border-[var(--pf-border)] bg-[var(--pf-raised)] px-3 py-1.5 text-[var(--pf-fg)] transition hover:border-[var(--pf-accent)] hover:text-[var(--pf-accent)]"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
