"use client";

import { useTheme } from "next-themes";
import Header from './components/header';
import UpperNavBar from "./components/uppernav";
import Info from "./components/intro"
import Education from "./components/education"
import { ParallaxProvider } from 'react-scroll-parallax';

export default function TestHome() {
  const { theme } = useTheme();

  return (
    <div className="relative w-full min-h-screen">
      <div className="absolute inset-0 z-0 h-[600px]">
        <Header />
      </div>

      <div className="relative z-10 p-10">
        <UpperNavBar/>
      </div>

      <div className="relative z-20 flex flex-col gap-8">
        <Info/>
      </div>

      <ParallaxProvider>
        <div className="relative z-30 flex flex-col gap-8 py-92">
          <Education/>
        </div>
      </ParallaxProvider>

      <div className="relative z-40 flex flex-col gap-8 py-92">
        <Info/>
      </div>
    </div>
  );
}
