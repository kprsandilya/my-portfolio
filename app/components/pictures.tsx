"use client";

import { useThemeReady } from "./useThemeReady"

import { ThreeDMarquee } from "@/components/ui/shadcn-io/3d-marquee";
export default function ThreeDMarqueeDemo() {
    const { theme, setTheme } = useThemeReady();

    const getColors = () => 'bg-gradient-to-b from-[var(--pf-bg-deep)] to-[var(--pf-bg-alt)]';

    const getFadingOverlay = () => 'bg-gradient-to-b from-transparent via-transparent to-[var(--pf-bg-alt)]';

  const images = [
    "https://assets.aceternity.com/cloudinary_bkp/3d-card.png",
    "https://assets.aceternity.com/animated-modal.png",
  ];
  return (
    <div className={`relative h-[1400px] w-full ${getColors()}`}>
      
      <div className="h-full w-full">
        <div className="absolute inset-0 z-1 h-full w-full">
            <ThreeDMarquee images={images} />
        </div>

        <div className={`absolute inset-0 z-[5] ${getFadingOverlay()}`} />

        <div className="absolute inset-0 z-10 flex items-center lg:top-[-1400px] justify-center p-8 pointer-events-none">
            <div className="max-w-xl text-center p-10 bg-[var(--pf-term)]/80 backdrop-blur-sm rounded-xl">
                <h1 className="text-6xl font-bold text-[var(--pf-term-fg)] mb-4">
                    But College is More than Academics
                </h1>
                <p className="text-xl text-[var(--pf-term-fg)]/80">
                    It's the people you meet, things you do, and memories you create that will stick with you for a lifetime.
                </p>
            </div>
        </div>
      </div>
    
    </div>
  );
}