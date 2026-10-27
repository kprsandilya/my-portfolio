"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Home, Bookmark, Plus, Search, Settings } from "lucide-react";
import { useThemeReady } from "./useThemeReady";

const themes = ["light", "dark", "surprise"];

export default function NavBar() {
  const { theme, setTheme } = useThemeReady();

  const setGlobalTheme = (theme: string) => {
    setTheme(theme)
    console.log(theme + " is set now!");
    return;
  };

  const getNavbarClasses = () => "bg-[var(--pf-bg)]/70 border-[var(--pf-border)] text-[var(--pf-fg)]";

  const getButtonClasses = (buttonTheme: string) => {
    const base = "rounded-lg px-5 py-1.5 text-xs font-medium transition-colors";
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
    <div className="flex items-center justify-between px-6 py-3 max-w-6xl mx-auto">
      {/* Left: Logo / Title */}
      <div className="flex items-center gap-3">
        <img
          src="/favicon.ico"
          alt="Logo"
          className="w-10 h-10  rounded-lg object-contain"
        />
        <h1 className="text-xl font-semibold tracking-tight">
          Sandilya<span className="text-[var(--pf-accent)]">.dev</span>
        </h1>
      </div>

      {/* Center: Navigation Icons */}
      <div className="flex items-center justify-center gap-6">
        <TooltipProvider delayDuration={100}>
          {[
            { icon: Home, label: "Home" },
            { icon: Bookmark, label: "Bookmark" },
            { icon: Plus, label: "New Post" },
            { icon: Search, label: "Search" },
            { icon: Settings, label: "Settings" },
          ].map(({ icon: Icon, label }) => (
            <Tooltip key={label}>
              <TooltipTrigger asChild>
                <button
                  className={"group relative inline-flex flex-col items-center justify-center transition-all duration-200 text-[var(--pf-fg-muted)] hover:text-[var(--pf-accent)]"}
                >
                  <Icon className="h-6 w-6" />
                  <span
                    className={`absolute -bottom-1 h-[2px] w-0 bg-current transition-all duration-200 group-hover:w-5`}
                  />
                  <span className="sr-only">{label}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className={"rounded-md px-2 py-1 text-xs shadow-md bg-[var(--pf-term)] text-[var(--pf-term-fg)]"}
              >
                {label}
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      {/* Right: Theme Switcher */}
      <div
        className="grid grid-cols-3 gap-1 rounded-lg bg-[var(--pf-bg-alt)] p-1 shadow-inner"
        role="group"
      >
        <button
          onClick={() => setGlobalTheme("dark")}
          className={getButtonClasses("dark")}
        >
          🌙
        </button>
        <button
          onClick={() => setGlobalTheme("light")}
          className={getButtonClasses("light")}
        >
          ☀️
        </button>
        <button
          onClick={() => setGlobalTheme("surprise")}
          className={getButtonClasses("surprise")}
        >
          🎉
        </button>
      </div>
    </div>
  </header>
);
}
