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
    if (theme === "dark") return "bg-gray-800 border-gray-700 text-white";
    if (theme === "surprise") return "bg-pink-300 border-pink-400 text-white";
    return "bg-white border-gray-200 text-gray-900";
  };

  const getButtonClasses = (buttonTheme: string) => {
    const base = "rounded-lg px-5 py-1.5 text-xs font-medium transition-colors";
    const active = "bg-blue-500 text-white";
    const inactive =
      "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white";
    return theme === buttonTheme ? `${base} ${active}` : `${base} ${inactive}`;
  };

  return (
    <div className={`fixed bottom-0 left-0 z-50 w-full border ${getNavbarClasses()}`}>
      <div className="w-full">
        <div
          className="mx-auto my-2 grid max-w-xs grid-cols-3 gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-600"
          role="group"
        >
          <button onClick={() => setGlobalTheme("dark")} className={getButtonClasses("dark")}>
            Dark
          </button>
          <button onClick={() => setGlobalTheme("light")} className={getButtonClasses("light")}>
            Light
          </button>
          <button onClick={() => setGlobalTheme("surprise")} className={getButtonClasses("surprise")}>
            Surprise
          </button>
        </div>
      </div>

      <div className="mx-auto grid max-w-lg grid-cols-5">
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
            className={`group inline-flex flex-col items-center justify-center p-4 transition-colors ${
              theme === "light"
                ? "hover:bg-gray-100 text-gray-500 group-hover:text-blue-600"
                : theme === "dark"
                ? "hover:bg-gray-900 text-gray-400 group-hover:text-blue-500"
                : theme === "surprise"
                ? "hover:bg-pink-400 text-white group-hover:text-yellow-200"
                : ""
            }`}
          >
            <Icon
              className={`mb-1 h-5 w-5 ${
                theme === "light"
                  ? "text-gray-500 group-hover:text-blue-600"
                  : theme === "dark"
                  ? "text-gray-400 group-hover:text-blue-500"
                  : theme === "surprise"
                  ? "text-white group-hover:text-yellow-200"
                  : ""
              }`}
            />
            <span className="sr-only">{label}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className={`rounded-md px-2 py-1 text-xs ${
            theme === "light"
              ? "bg-gray-900 text-white"
              : theme === "dark"
              ? "bg-gray-900 text-white"
              : theme === "surprise"
              ? "bg-pink-500 text-white"
              : ""
          }`}
        >
          {label}
        </TooltipContent>
      </Tooltip>
    ))}
  </TooltipProvider>
</div>
    </div>
  );
}
