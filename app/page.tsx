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
import Footer from "./components/footer"
import Skate from "./components/hobbies"

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

      <div className="absolute inset-0 z-0 h-[890px]">
        <Header />
      </div>

      {/* Info Section */}
      <div className="relative z-20 pt-40">
        <Info />
      </div>

      {/* Education Section */}
      <div className="relative z-30 mt-40 w-full">
        <Education />
      </div>

      {/* Pictures Section */}
      <div className="relative z-40 -mt-32 ">
        <Pictures />
      </div>

      {/* Experience Section */}
      <div className="relative z-50 -mt-32 ">
        <Experience />
      </div>

      {/* Projects Section */}
      <div className="relative z-50 -mt-40 ">
        <Projects />
      </div>

      {/* Awards Section */}


      {/* Awards content overlapping Projects */}
      <div className="relative z-50 -mt-100">
        <Awards />
      </div>

      <div className={`relative z-40 ${getBackgroundColor()} -mt-150 flex flex-col items-center`}>
        <div className='h-[300px]'>
        </div>
      </div>

      {/* Skills Section */}
      <div className={`relative z-50 ${getBackgroundColor()}  flex flex-col items-center`}>
        <GradientText
          className="text-6xl md:text-8xl font-semibold leading-none tracking-tighter text-center"
          gradient={textGradient()}
          text="Skills and Frameworks"
        />
        <div className="w-full mt-16">
          <Skills />
        </div>
      </div>
{/* 
      <div className="relative z-50 -mt-100">
        <Skate />
      </div> */}

      {/* Footer */}
      <div className="relative z-50">
        <Footer />
      </div>

    </div>
  );
}
