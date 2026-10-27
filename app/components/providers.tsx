// app/providers.tsx
"use client"; // 🛑 MAKE THIS A CLIENT COMPONENT

import dynamic from 'next/dynamic';
import { ThemeProvider } from "next-themes";
import { ParallaxProvider } from 'react-scroll-parallax';
// You may need to adjust the import path for your NavBar
import NavBar from "./navbar";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // 2. Wrap the dynamic component with ThemeProvider, as it also needs client-side execution
    // List every theme so next-themes removes the previous theme's class when
    // switching. Without "surprise" here, its class stayed on <html> and its
    // colors overrode light and dark.
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} themes={["light", "dark", "surprise"]}>
      {/* Single app-level parallax controller so any section can use <Parallax>
          on its inner content (the colored section blocks stay static). */}
      <ParallaxProvider>
        {children}
        <NavBar />
      </ParallaxProvider>
    </ThemeProvider>
  );
}