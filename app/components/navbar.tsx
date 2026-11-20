"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Home, GraduationCap, Briefcase, FolderGit2, Wrench } from "lucide-react";
import { useThemeReady } from "./useThemeReady";

// Jump links to each section of the page.
const SECTIONS = [
  { icon: Home, label: "Home", href: "#top" },
  { icon: GraduationCap, label: "Education", href: "#education" },
  { icon: Briefcase, label: "Experience", href: "#experience" },
  { icon: FolderGit2, label: "Projects", href: "#projects" },
  { icon: Wrench, label: "Skills", href: "#skills" },
];

const THEMES = [
  { id: "dark", emoji: "🌙", label: "Dark theme" },
  { id: "light", emoji: "☀️", label: "Light theme" },
  { id: "surprise", emoji: "🎉", label: "Surprise theme" },
];

export default function NavBar() {
  const { theme, setTheme } = useThemeReady();

  const getNavbarClasses = () => "bg-[var(--pf-bg)]/70 border-[var(--pf-border)] text-[var(--pf-fg)]";

  const getButtonClasses = (buttonTheme: string) => {
    const base = "rounded-lg px-2.5 sm:px-5 py-1.5 text-xs font-medium transition-colors";
    const active = "bg-[var(--pf-accent)] text-[var(--pf-on-accent)]";
    const inactive =
      "hover:bg-[var(--pf-bg-deep)] text-[var(--pf-fg)]";
    return theme === buttonTheme ? `${base} ${active}` : `${base} ${inactive}`;
  };

return (
  <header
    className={`fixed top-0 left-0 z-50 w-full border-b backdrop-blur-lg bg-opacity-80 ${getNavbarClasses()}`}
  >
    {/* Inner Container */}
    <div className="flex items-center justify-between gap-3 px-4 py-2 sm:px-6 sm:py-3 max-w-6xl mx-auto">
      {/* Left: Logo / Title (the logo is decorative next to the name) */}
      <a href="#top" className="flex items-center gap-3 rounded-lg">
        <img
          src="/favicon.ico"
          alt=""
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-contain"
        />
        <span className="text-lg sm:text-xl font-semibold tracking-tight">
          Sandilya<span className="text-[var(--pf-accent-text)]">.dev</span>
        </span>
      </a>

      {/* Center: section links (no room for them on phones) */}
      <nav aria-label="Sections" className="hidden md:block">
        <ul className="flex items-center justify-center gap-6">
          <TooltipProvider delayDuration={100}>
            {SECTIONS.map(({ icon: Icon, label, href }) => (
              <li key={label}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={href}
                      aria-label={label}
                      className="group relative inline-flex flex-col items-center justify-center rounded-md transition-all duration-200 text-[var(--pf-fg-muted)] hover:text-[var(--pf-accent-text)]"
                    >
                      <Icon className="h-6 w-6" aria-hidden="true" />
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-1 h-[2px] w-0 bg-current transition-all duration-200 group-hover:w-5 group-focus-visible:w-5"
                      />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="rounded-md px-2 py-1 text-xs shadow-md bg-[var(--pf-term)] text-[var(--pf-term-fg)]"
                  >
                    {label}
                  </TooltipContent>
                </Tooltip>
              </li>
            ))}
          </TooltipProvider>
        </ul>
      </nav>

      {/* Right: Theme Switcher */}
      <div
        className="grid grid-cols-3 gap-1 rounded-lg bg-[var(--pf-bg-alt)] p-1 shadow-inner"
        role="group"
        aria-label="Color theme"
      >
        {THEMES.map(({ id, emoji, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTheme(id)}
            aria-label={label}
            aria-pressed={theme === id}
            className={getButtonClasses(id)}
          >
            <span aria-hidden="true">{emoji}</span>
          </button>
        ))}
      </div>
    </div>
  </header>
);
}
