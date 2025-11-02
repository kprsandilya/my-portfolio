"use client";

import { useTheme } from "next-themes";
import Header from './components/header';
import UpperNavBar from "./components/uppernav";

export default function TestHome() {
  const { theme } = useTheme();

  return (
    <div className="relative w-full min-h-screen">
      <div className="absolute inset-0 z-0">
        <Header />
      </div>

      <div className="relative z-5 p-10">
        <UpperNavBar/>
      </div>

      <div className="relative z-10 flex flex-col gap-8">
        <div className="h-[400px] flex items-center justify-center">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <img
              src="/profile.jpg"
              alt="Profile"
              className="w-64 h-64 rounded-full border-4 border-white"
              />
              <div className="flex gap-4">
              <button className="px-4 py-2 rounded bg-white text-black hover:bg-gray-200">Follow</button>
              <button className="px-4 py-2 rounded bg-white text-black hover:bg-gray-200">Message</button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
