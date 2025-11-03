import React from 'react';
import CurvedLoop from "@/components/ui/shadcn-io/curved-loop";
import { useTheme } from "next-themes"

// Define a simple StraightLoop for contrast
const StraightLoop = (props: any) => (
  <CurvedLoop
    {...props}
    curveAmount={0} // Setting curveAmount to 0 makes it straight
    customPathD="M-100,60 H1540" // Straight horizontal line
  />
);

export default function Experience() {
    const commonClasses = "absolute inset-0 w-full h-full";
    const { theme, setTheme } = useTheme();

    const getBackground = () => {
        if (theme === "dark") return 'bg-gradient-to-b from-[#023020] to-[#023020]';

        if (theme === "surprise") return 'bg-gradient-to-b from-[#FFDBBB] to-[#FFDBBB]';
        
        return `bg-gradient-to-b from-[#00B9B3] to-[#00B9B3]`;
    };

  return (
    // 1. Main Relative Container (defines the scroll/viewport area)
    <div className={`relative min-h-[150vh] w-full ${getBackground()} overflow-hidden`}>
      
      {/* --- BACKGROUND LAYERS (Z-INDEX 1 - 3) --- */}

      {/* Layer 1: Deep Background (Lowest Z-Index) */}
      <div className={`${commonClasses} z-10 opacity-30`}>
        <CurvedLoop
          marqueeText="PRACTICE MAKES PERFECT CODE"
          speed={1}
          direction="right"
          curveAmount={500}
          customPathD="M-100,10 Q600,600 1540,10" // Deep U shape
          className="text-9xl text-green-500"
          interactive={false}
        />
      </div>

      {/* Layer 2: Mid Background (Z-Index 2) */}
      <div className={`${commonClasses} z-20 opacity-40`}>
        <CurvedLoop
          marqueeText="DEVELOPER PORTFOLIO"
          speed={3}
          direction="left"
          curveAmount={-150} // Inverted curve
          customPathD="M-100,110 Q500,-100 1540,110" 
          className="text-8xl text-indigo-400"
          interactive={true}
        />
      </div>

      {/* Layer 3: Foreground Marquee (Z-Index 3) */}
      <div className={`${commonClasses} z-30 opacity-70 mt-10`}>
        <StraightLoop
          marqueeText="FRONTEND | BACKEND | FULLSTACK | DEVOPS"
          speed={5}
          direction="right"
          className="text-7xl text-yellow-300"
          interactive={false}
        />
      </div>

      {/* --- FOREGROUND CONTENT (Z-INDEX 10) --- */}

      {/* The main content div sits on top of all marquees */}
      <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
        <div className="max-w-4xl p-12 text-center bg-white/10 backdrop-blur-sm rounded-xl pointer-events-auto">
          <h1 className="text-7xl font-extrabold text-white mb-4">
            Hello, I'm Gemini!
          </h1>
          <p className="text-2xl text-gray-300">
            This content is on top (Z-40), allowing the cool curved text to flow seamlessly behind it.
          </p>
        </div>
      </div>
    </div>
  );
}