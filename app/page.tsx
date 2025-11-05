"use client";

import { useTheme } from "next-themes";
import Header from './components/header';
import UpperNavBar from "./components/uppernav";
import Info from "./components/intro"
import Education from "./components/education"
import Pictures from "./components/pictures"
import Experience from "./components/experience"
import Projects from "./components/projects"
import Awards from "./components/awards"
import Skills from "./components/skills"

import { GradientText } from '@/components/ui/shadcn-io/gradient-text';

export default function TestHome() {
  const { theme } = useTheme();

  const textGradient = () => {
    if (theme === "dark") return 'linear-gradient(90deg, #48166cff 0%, #c31432 50%, #48166cff 100%)';
    if (theme === "surprise") return 'linear-gradient(90deg, #d5ec3cff 0%, #e866ccff 50%, #d5ec3cff 100%)';
    return 'linear-gradient(90deg, #A5B4FC 0%, #60A5FA 50%, #A5B4FC 100%)';
  };

    const getBackgroundColor = () => {
      if (theme === "dark") return 'bg-[#1A001C]';
      if (theme === "surprise") return 'bg-[#BA5370]';
      return 'bg-[#006473]';
    };

  return (
    <div className="relative w-full min-h-screen">
      <div className="absolute inset-0 z-0 h-[700px]">
        <Header />
      </div>

      <div className="relative z-10 p-10">
        <UpperNavBar/>
      </div>

      <div className="relative z-20 flex flex-col gap-8">
        <Info/>
      </div>

      <div className="relative z-30 flex flex-col gap-8 pt-58 pb-58">
        <Education/>
      </div>

      <div className="relative z-40 flex -mt-[232px] gap-8">
          <Pictures/>
      </div>

      <div className="relative z-50 flex gap-8">
        <Experience/>
      </div>

      <div className="relative z-50 flex -mt-[200px] gap-8">
        <Projects/>
      </div>

      <div className={`relative z-50 flex gap-8 ${getBackgroundColor()}`}>
        <Awards/>
      </div>

      <div className={`relative z-50 h-[400px] gap-8 bg-white flex flex-col items-center justify-center`}>
        <div className={`w-full relative text-center -mt-[1000px]`}>
            <GradientText className="text-balance text-8xl font-semibold leading-none tracking-tighter" 
                gradient={textGradient()} text="Skills and Frameworks"/>
        </div>
      </div>

      <div className="relative z-50 flex gap-8 -mt-[600px] ">
        <Skills/>
      </div>

    </div>
  );
}
