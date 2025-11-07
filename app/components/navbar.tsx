"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Home, Bookmark, Plus, Search, Settings } from "lucide-react";
import { useTheme } from "next-themes";

const themes = ["light", "dark", "surprise"];

export default function NavBar() {
  const { theme, setTheme } = useTheme();

  const setGlobalTheme = (theme: string) => {
    setTheme(theme)
    console.log(theme + " is set now!");
    return;
  };

  const getNavbarClasses = () => {
    if (theme === "dark") return "bg-gray-800/50 border-gray-700 text-white";
    if (theme === "surprise") return "bg-pink-300/50 border-pink-400 text-white";
    return "bg-white/50 border-gray-200 text-gray-900";
  };

  const getButtonClasses = (buttonTheme: string) => {
    const base = "rounded-lg px-5 py-1.5 text-xs font-medium transition-colors";
    const active = "bg-blue-500 text-white";
    const inactive =
      "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white";
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
          Sandilya<span className="text-blue-500">.dev</span>
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
                  className={`group relative inline-flex flex-col items-center justify-center transition-all duration-200 ${
                    theme === "light"
                      ? "text-gray-600 hover:text-blue-600"
                      : theme === "dark"
                      ? "text-gray-400 hover:text-blue-400"
                      : "text-white hover:text-yellow-200"
                  }`}
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
                className={`rounded-md px-2 py-1 text-xs shadow-md ${
                  theme === "light"
                    ? "bg-gray-900 text-white"
                    : theme === "dark"
                    ? "bg-gray-800 text-white"
                    : "bg-pink-500 text-white"
                }`}
              >
                {label}
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      {/* Right: Theme Switcher */}
      <div
        className="grid grid-cols-3 gap-1 rounded-lg bg-gray-200 dark:bg-gray-700 p-1 shadow-inner"
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
