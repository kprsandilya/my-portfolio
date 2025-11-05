// app/providers.tsx
"use client"; // 🛑 MAKE THIS A CLIENT COMPONENT

import dynamic from 'next/dynamic';
import { ThemeProvider } from "next-themes";
// You may need to adjust the import path for your NavBar
import NavBar from "./navbar";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // 2. Wrap the dynamic component with ThemeProvider, as it also needs client-side execution
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
      <NavBar />
    </ThemeProvider>
  );
}