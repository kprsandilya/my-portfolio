"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/**
 * Wrapper around next-themes' useTheme that avoids hydration mismatches.
 *
 * The server (and the first client render) cannot know the user's persisted
 * theme, so they must render with a stable default. Reading `theme` directly
 * during render makes the first client paint use the persisted value while the
 * server used the default, which React flags as a hydration mismatch.
 *
 * This hook returns the default theme until the component has mounted, then
 * switches to the real (persisted) theme, keeping SSR and the first client
 * render identical.
 */
export function useThemeReady(defaultTheme: string = "light") {
  const { theme, setTheme, ...rest } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    ...rest,
    theme: mounted ? theme : defaultTheme,
    setTheme,
    mounted,
  };
}
