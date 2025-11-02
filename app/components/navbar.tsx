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

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700">
      <div className="w-full">
        <div
          className="mx-auto my-2 grid max-w-xs grid-cols-3 gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-600"
          role="group"
        >
          <button className="rounded-lg px-5 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700"
                  onClick={() => setGlobalTheme("dark")}>
            Dark
          </button>
          <button className="rounded-lg bg-gray-900 px-5 py-1.5 text-xs font-medium text-white dark:bg-gray-300 dark:text-gray-900"
                  onClick={() => setGlobalTheme("light")}>
            Light
          </button>
          <button className="rounded-lg px-5 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700"
                  onClick={() => setGlobalTheme("surprise")}>
            Surprise
          </button>
        </div>
      </div>

      <div className="mx-auto grid max-w-lg grid-cols-5">
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="group inline-flex flex-col items-center justify-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                <Home className="mb-1 h-5 w-5 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500" />
                <span className="sr-only">Home</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="rounded-md bg-gray-900 px-2 py-1 text-xs text-white">
              Home
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="group inline-flex flex-col items-center justify-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                <Bookmark className="mb-1 h-5 w-5 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500" />
                <span className="sr-only">Bookmark</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="rounded-md bg-gray-900 px-2 py-1 text-xs text-white">
              Bookmark
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="group inline-flex flex-col items-center justify-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                <Plus className="mb-1 h-5 w-5 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500" />
                <span className="sr-only">New Post</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="rounded-md bg-gray-900 px-2 py-1 text-xs text-white">
              New Post
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="group inline-flex flex-col items-center justify-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                <Search className="mb-1 h-5 w-5 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500" />
                <span className="sr-only">Search</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="rounded-md bg-gray-900 px-2 py-1 text-xs text-white">
              Search
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="group inline-flex flex-col items-center justify-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                <Settings className="mb-1 h-5 w-5 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500" />
                <span className="sr-only">Settings</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="rounded-md bg-gray-900 px-2 py-1 text-xs text-white">
              Settings
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
