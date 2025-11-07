import {
  LinkedinLogoIcon,
  GithubLogoIcon,
  EnvelopeSimpleIcon,
  FileIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { useTheme } from "next-themes"

export default function Footer() {
  const { theme, setTheme } = useTheme();

  const getBackground = () => {
    // New Dark Theme: Deep Slate to Black with a mid-tone for depth.
    if (theme === "dark") return 'bg-gradient-to-b from-[#121B21] to-[#241427]';

    // New Surprise Theme: High-energy Rose to Purple.
    if (theme === "surprise") return 'bg-gradient-to-b from-[#FFB69B] to-[#F0CC95]';
    
    // New Default Theme: Clean, modern Teal/Sky to Blue.
    return 'bg-gradient-to-b from-[#91EAE4] to-[#86A8E7]';
  };

  const getBorderBackground = () => {
    // New Dark Theme: Deep Slate to Black with a mid-tone for depth.
    if (theme === "dark") return 'border-[#241427]';

    // New Surprise Theme: High-energy Rose to Purple.
    if (theme === "surprise") return 'border-[#F0CC95]';
    
    // New Default Theme: Clean, modern Teal/Sky to Blue.
    return 'border-[#86A8E7]';
  };

  const getFooterBackground = () => {
    // Dark Theme: Deep plum-to-slate gradient with subtle glow.
    if (theme === "dark")
      return "bg-gradient-to-t from-[#0D0E10] via-[#1A1720] to-[#241427]";

    // Surprise Theme: Warm sunset vibe that grounds the brighter page tones.
    if (theme === "surprise")
      return "bg-gradient-to-t from-[#F0CC95] via-[#FFB69B] to-[#F28585]";

    // Default Theme: Calm ocean dusk gradient to mirror header tones but darker at the base.
    return "bg-[#D3CCE3]";
  };

  return (
    <footer className={`w-full ${getFooterBackground()} text-white py-8 px-12 flex flex-col md:flex-row items-center justify-between`}>
      {/* Left Side: Text */}
      <div className="md:w-1/3 text-center md:text-left mb-6 md:mb-0">
        <h2 className="text-2xl font-semibold">Let’s Build Something Great</h2>
        <p className="text-gray-400 mt-2">
          Crafted with <span className="text-red-500">♥</span> by Sandilya Kambhampati.  
          All rights reserved, unless the footer rebels.
        </p>
      </div>

      {/* Center: Logo */}
      <div className="md:w-1/3 flex justify-center items-center mb-6 md:mb-0">
        <img
          src="/logo.png"
          alt="Logo"
          className="object-contain w-40 h-40 scale-x-[1.3]"
        />
      </div>

      {/* Right Side: Profile + 2x2 Grid */}
      <div className="md:w-1/3 flex flex-row items-center justify-center gap-4">
        <img
          src="/profile.jpeg"
          alt="Profile"
          className={`w-32 h-32 rounded-full border-4 ${getBorderBackground()} object-cover`}
        />
        <div className="grid grid-cols-2 gap-6">
          <Button
            asChild
            variant="ghost"
            className={`flex h-14 w-14 items-center justify-center shadow-xl rounded-xl ${getBackground()}`}
          >
            <Link href="https://www.linkedin.com/in/kprsandilya/" target="_blank">
              <LinkedinLogoIcon width={44} height={44} />
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className={`flex h-14 w-14 items-center justify-center shadow-xl rounded-xl ${getBackground()}`}
          >
            <Link href="https://github.com/kprsandilya/" target="_blank">
              <GithubLogoIcon width={44} height={44} />
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className={`flex h-14 w-14 items-center justify-center shadow-xl rounded-xl ${getBackground()}`}
          >
            <Link href="mailto:kprsandilya@gmail.com" target="_blank">
              <EnvelopeSimpleIcon width={44} height={44} />
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className={`flex h-14 w-14 items-center justify-center shadow-xl rounded-xl ${getBackground()}`}
          >
            <Link href="/resume.pdf" target="_blank">
              <FileIcon width={44} height={44} />
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
