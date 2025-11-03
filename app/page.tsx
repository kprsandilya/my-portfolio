"use client";

import { useTheme } from "next-themes";
import Header from './components/header';
import UpperNavBar from "./components/uppernav";
import Info from "./components/intro"
import Education from "./components/education"
import { ParallaxProvider } from 'react-scroll-parallax';
import Projects from "./components/pictures"
import Experience from "./components/experience"

export default function TestHome() {
  const { theme } = useTheme();

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
          <Projects/>
      </div>

      <div className="relative z-50 flex gap-8">
        <Experience/>
      </div>
    </div>
  );
}
