import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "./components/navbar"
import "./globals.css";
import { ThemeProvider } from "next-themes";

import Provider from "./components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sandilya Kambhampati",
  description: "Portfolio of Sandilya Kambhampati, a student at Purdue University: education, experience, projects, awards, and skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* First thing a keyboard user reaches: jumps past the nav bar. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[var(--pf-term)] focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-[var(--pf-term-fg)] focus:shadow-xl"
        >
          Skip to content
        </a>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
