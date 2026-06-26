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
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {/* Single app-level parallax controller so any section can use <Parallax>
          on its inner content (the colored section blocks stay static). */}
      <ParallaxProvider>
        {children}
        <NavBar />
      </ParallaxProvider>
    </ThemeProvider>
  );
}