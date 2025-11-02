"use client";

import { useTheme } from "next-themes";
import Header from './components/header';
import UpperNavBar from "./components/uppernav";
import Info from "./components/intro"

export default function TestHome() {
  const { theme } = useTheme();

  return (
    <div className="relative w-full min-h-screen">
      <div className="absolute inset-0 z-0">
        <Header />
      </div>

      <div className="relative z-10 p-10">
        <UpperNavBar/>
      </div>

      <div className="relative z-20 flex flex-col gap-8">
        <Info/>
      </div>
    </div>
  );
}
