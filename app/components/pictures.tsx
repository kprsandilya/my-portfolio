"use client";

import { useTheme } from "next-themes"

import { ThreeDMarquee } from "@/components/ui/shadcn-io/3d-marquee";
export default function ThreeDMarqueeDemo() {
    const { theme, setTheme } = useTheme();

    const getColors = () => {
        if (theme === "dark") return 'bg-gradient-to-r from-gray-700 to-black';

        if (theme === "surprise") return 'bg-gradient-to-r from-pink-500 to-yellow-300';
        
        return 'bg-gradient-to-r from-indigo-400 to-cyan-400';
    };

    const getFadingOverlay = () => {
        if (theme === "dark") return 'bg-gradient-to-b from-transparent via-transparent to-[#200210]';

        if (theme === "surprise") return 'bg-gradient-to-b from-transparent via-transparent to-[#FFDBBB]';
        
        return `bg-gradient-to-b from-transparent via-transparent to-[#00B9B3]`;
    };

  const images = [
    "https://assets.aceternity.com/cloudinary_bkp/3d-card.png",
    "https://assets.aceternity.com/animated-modal.png",
  ];
  return (
    <div className={`relative h-[150vh] w-full ${getColors()}`}>
      
      <div className="h-full h-[125vh] w-full">
        <div className="absolute inset-0 z-1 h-full w-full">
            <ThreeDMarquee images={images} />
        </div>

        <div className={`absolute inset-0 z-[5] ${getFadingOverlay()}`} />

        <div className="absolute inset-0 z-10 flex items-center mt-[-150vh] justify-center p-8 pointer-events-none">
            <div className="max-w-xl text-center p-10 bg-black/50 backdrop-blur-sm rounded-xl">
                <h1 className="text-6xl font-bold text-white mb-4">
                    But College is More than Academics
                </h1>
                <p className="text-xl text-neutral-300">
                    It's the people you meet, things you do, and memories you create that will stick with you for a lifetime.
                </p>
            </div>
        </div>
      </div>
    
    </div>
  );
}