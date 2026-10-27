"use client";

import { useEffect, useState } from "react";
import { useThemeReady } from "../../components/useThemeReady";

// Canvas and three.js code can't read CSS variables, so this resolves the
// theme tokens from globals.css into plain color strings and re-reads them
// whenever the theme changes.
export interface Palette {
  bg: string;
  bgAlt: string;
  bgDeep: string;
  raised: string;
  fg: string;
  fgMuted: string;
  border: string;
  accent: string;
  accent2: string;
  accent3: string;
  term: string;
  term2: string;
  termFg: string;
  prompt: string;
}

const FALLBACK: Palette = {
  bg: "#e1e2e7",
  bgAlt: "#d5d6db",
  bgDeep: "#c4c8da",
  raised: "#f2f3f7",
  fg: "#343b58",
  fgMuted: "#6172b0",
  border: "#a8aecb",
  accent: "#2e7de9",
  accent2: "#9854f1",
  accent3: "#007197",
  term: "#24283b",
  term2: "#1f2335",
  termFg: "#c0caf5",
  prompt: "#9ece6a",
};

const VARS: Record<keyof Palette, string> = {
  bg: "--pf-bg",
  bgAlt: "--pf-bg-alt",
  bgDeep: "--pf-bg-deep",
  raised: "--pf-raised",
  fg: "--pf-fg",
  fgMuted: "--pf-fg-muted",
  border: "--pf-border",
  accent: "--pf-accent",
  accent2: "--pf-accent-2",
  accent3: "--pf-accent-3",
  term: "--pf-term",
  term2: "--pf-term-2",
  termFg: "--pf-term-fg",
  prompt: "--pf-prompt",
};

export function usePalette(): Palette {
  const { theme, mounted } = useThemeReady();
  const [palette, setPalette] = useState<Palette>(FALLBACK);

  useEffect(() => {
    if (!mounted) return;
    // Wait a frame so the new theme class is on <html> before reading.
    const id = requestAnimationFrame(() => {
      const cs = getComputedStyle(document.documentElement);
      const next = { ...FALLBACK };
      (Object.keys(VARS) as (keyof Palette)[]).forEach((key) => {
        const value = cs.getPropertyValue(VARS[key]).trim();
        if (value) next[key] = value;
      });
      setPalette(next);
    });
    return () => cancelAnimationFrame(id);
  }, [theme, mounted]);

  return palette;
}
