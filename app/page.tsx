"use client";

import { useThemeReady } from "./components/useThemeReady";
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
  const { theme } = useThemeReady();

  const textGradient = () => {
    if (theme === "dark") return 'linear-gradient(90deg, #48166cff 0%, #c31432 50%, #48166cff 100%)';
    if (theme === "surprise") return 'linear-gradient(90deg, #d5ec3cff 0%, #e866ccff 50%, #d5ec3cff 100%)';
    return 'linear-gradient(90deg, #A5B4FC 0%, #60A5FA 50%, #A5B4FC 100%)';
  };

  const getBackgroundColor = () => {
    if (theme === "dark") return 'bg-[#120016]';
    if (theme === "surprise") return 'bg-[#8A2F4E]';
    return 'bg-[#013A46]';
  };

  return (
    <div className="relative w-full min-h-screen">

      <div className="absolute inset-0 z-0 h-[890px]">
        <Header />
      </div>

      <div className="relative z-20 pt-32 md:pt-40">
        <Info />
      </div>

      <div className="relative z-30 mt-24 md:mt-40 w-full">
        <Education />
      </div>

      <div className="relative z-40 mt-0">
        <Pictures />
      </div>

      <div className="relative z-50 mt-0">
        <Experience />
      </div>

      <div className="relative z-50 mt-0">
        <Projects />
      </div>

      <div className="relative z-50 mt-0">
        <Awards />
      </div>

      <div className={`relative z-50 ${getBackgroundColor()} flex flex-col items-center`}>
        <div className="w-full mt-8">
          <div className="flex flex-col items-center px-6 pt-20 pb-6 text-center">
            <GradientText
              className="text-5xl sm:text-6xl md:text-8xl font-semibold leading-none tracking-tighter text-center"
              gradient={textGradient()}
              text="Skills and Frameworks"
            />
          </div>
          <Skills />
        </div>
      </div>


      {/* <div className="relative z-50">
        <Skate />
      </div> */}

      <div className="relative z-50">
        <Footer />
      </div>

    </div>
  );
}
