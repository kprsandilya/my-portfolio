// app/providers.tsx
"use client"; // 🛑 MAKE THIS A CLIENT COMPONENT

import dynamic from 'next/dynamic';
import { ThemeProvider } from "next-themes";
// You may need to adjust the import path for your NavBar
import NavBar from "./navbar";

// 1. Define the DynamicNavBar inside this client component's scope
const DynamicNavBar = dynamic(() => import("./navbar").then(mod => mod.default), {
  ssr: false, // This is now allowed because 'providers.tsx' is a Client Component
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // 2. Wrap the dynamic component with ThemeProvider, as it also needs client-side execution
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
      <DynamicNavBar />
    </ThemeProvider>
  );
}