"use client";

import { useTheme } from "next-themes";
import { HoleBackground } from '@/components/animate-ui/components/backgrounds/hole';

export default function Home() {
  const { theme } = useTheme();

  return (
    <div className="relative w-full min-h-screen">
      <HoleBackground className="absolute inset-0 z-0" />

      <div className="relative z-10 flex flex-col gap-8">
        <div className="h-[400px] flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-4">
              <img
              src="/profile.jpg"
              alt="Profile"
              className="w-48 h-48 rounded-full border-4 border-white"
              />
              <div className="flex gap-4">
              <button className="px-4 py-2 rounded bg-white text-black hover:bg-gray-200">Follow</button>
              <button className="px-4 py-2 rounded bg-white text-black hover:bg-gray-200">Message</button>
              </div>
          </div>
        </div>

        <div className="h-[400px] flex items-center justify-center">
          <p className="text-xl text-white">This is another section with the HoleBackground behind it.</p>
        </div>

        <div className="h-[400px] flex items-center justify-center">
          <p className="text-xl text-white">And another one!</p>
        </div>
      </div>
    </div>
  );
}
