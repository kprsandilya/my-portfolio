import {
  LinkedinLogoIcon,
  GithubLogoIcon,
  EnvelopeSimpleIcon,
  FileIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { useThemeReady } from "./useThemeReady"

export default function Footer() {
  const { theme, setTheme } = useThemeReady();

  const getBackground = () => 'bg-white/10 hover:bg-white/20 text-[var(--pf-term-fg)]';

  const getBorderBackground = () => 'border-[var(--pf-accent)]';

  // Top color matches the Skills section above so the footer flows out of it,
  // then settles into the footer's own base tone at the bottom.
  const getFooterBackground = () => "bg-gradient-to-b from-[var(--pf-term)] to-[var(--pf-term-2)]";

  return (
    <footer className={`w-full ${getFooterBackground()} text-[var(--pf-term-fg)] py-8 px-12 flex flex-col md:flex-row items-center justify-between`}>
      {/* Left Side: Text */}
      <div className="md:w-1/3 text-center md:text-left mb-6 md:mb-0">
        <h2 className="text-2xl font-semibold">Let’s Build Something Great</h2>
        <p className="mt-2 text-[var(--pf-term-fg)]/70">
          Crafted with <span className="text-[var(--pf-accent)]">♥</span> by Sandilya Kambhampati.  
          All rights reserved, unless the footer rebels.
        </p>
      </div>

      {/* Center: Logo */}
      <div className="md:w-1/3 flex justify-center items-center mb-6 md:mb-0">
        <img
          src="/Logo.png"
          alt="Logo"
          className="object-contain w-40 h-40 scale-x-[1.3]"
        />
      </div>

      {/* Right Side: Profile + 2x2 Grid */}
      <div className="md:w-1/3 flex flex-row items-center justify-center gap-4">
        <img
          src="/profile.jpeg"
          alt="Profile"
          className={`w-32 h-32 rounded-full border-4 ${getBorderBackground()} object-cover`}
        />
        <div className="grid grid-cols-2 gap-6">
          <Button
            asChild
            variant="ghost"
            className={`flex h-14 w-14 items-center justify-center shadow-xl rounded-xl ${getBackground()}`}
          >
            <Link href="https://www.linkedin.com/in/kprsandilya/" target="_blank">
              <LinkedinLogoIcon width={44} height={44} />
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className={`flex h-14 w-14 items-center justify-center shadow-xl rounded-xl ${getBackground()}`}
          >
            <Link href="https://github.com/kprsandilya/" target="_blank">
              <GithubLogoIcon width={44} height={44} />
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className={`flex h-14 w-14 items-center justify-center shadow-xl rounded-xl ${getBackground()}`}
          >
            <Link href="mailto:kprsandilya@gmail.com" target="_blank">
              <EnvelopeSimpleIcon width={44} height={44} />
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className={`flex h-14 w-14 items-center justify-center shadow-xl rounded-xl ${getBackground()}`}
          >
            <Link href="/Resume.pdf" target="_blank">
              <FileIcon width={44} height={44} />
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
