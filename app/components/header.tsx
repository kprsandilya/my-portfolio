import { useThemeReady } from "./useThemeReady";
import { NewHoleBackground } from '@/components/animate-ui/components/backgrounds/newhole';

// The hole background is drawn on a canvas, which can't read CSS variables,
// so these mirror --pf-bg (outer) and the accent (blob) from globals.css.
const HOLE_COLORS = {
  light: { outer: "#e1e2e7", blob: "#2e7de980" },
  dark: { outer: "#1a1b26", blob: "#bb9af7" },
  surprise: { outer: "#272822", blob: "#f92672" },
} as const;

export default function Header() {
  const { theme, setTheme } = useThemeReady();

  const getHoleInner = () => "transparent";

  const getHoleOuter = () => HOLE_COLORS[theme === "dark" || theme === "surprise" ? theme : "light"].outer;

  const getHoleBlob = () => HOLE_COLORS[theme === "dark" || theme === "surprise" ? theme : "light"].blob;

  return (
    <div className="relative w-full h-full">
      <NewHoleBackground
        className="absolute inset-0 flex items-center justify-center"
        holeInnerColor={getHoleInner()}
        holeOuterColor={getHoleOuter()}
        blobColor={getHoleBlob()}
      />
      {/* Fades the grid and glow into the page color, so the header doesn't
          end in a hard line above Education. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-72 bg-gradient-to-b from-transparent to-[var(--pf-bg)]"
      />
    </div>
  );
}
