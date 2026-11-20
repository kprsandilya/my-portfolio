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
import HobbiesSection from "./components/hobbies/HobbiesSection"
import SectionKicker from "./components/sectionKicker"
import { ChevronDown } from "lucide-react"

import { GradientText } from '@/components/ui/shadcn-io/gradient-text';

// The "But College is More than Academics" photo wall (fed by public/college).
// Hidden until there are photos to show; flip to true to bring it back.
const SHOW_COLLEGE_PHOTOS = false;

export default function TestHome() {
  const { theme } = useThemeReady();

  const textGradient = () => 'linear-gradient(90deg, var(--pf-accent) 0%, var(--pf-accent-2) 50%, var(--pf-accent) 100%)';

  const getBackgroundColor = () => 'bg-[color:var(--pf-term)]';

  return (
    <div id="top" className="relative w-full min-h-screen">
      {/* Everything but the footer is the page's main content. tabIndex lets
          the skip link move focus here. */}
      <main id="main" tabIndex={-1} className="outline-none">

      <div aria-hidden="true" className="absolute inset-0 z-0 h-[890px]">
        <Header />
      </div>

      <div className="relative z-20 pt-32 md:pt-40">
        <Info />
      </div>

      {/* Scroll cue: leads from the header into Education */}
      <div className="relative z-20 mt-10 flex justify-center">
        <a
          href="#education"
          className="group inline-flex flex-col items-center gap-1 font-mono text-sm text-[var(--pf-fg-muted)] transition-colors hover:text-[var(--pf-accent-text)]"
        >
          <span aria-hidden="true">
            <span className="text-[var(--pf-accent-text)]">$</span> scroll --down
          </span>
          <span className="sr-only">Scroll down to Education</span>
          <ChevronDown className="h-5 w-5 animate-bounce" aria-hidden="true" />
        </a>
      </div>

      <div id="education" className="relative z-30 mt-16 md:mt-24 w-full scroll-mt-16">
        <Education roomForPhotos={SHOW_COLLEGE_PHOTOS} />
      </div>

      {SHOW_COLLEGE_PHOTOS && (
        <div className="relative z-40 mt-0">
          <Pictures />
        </div>
      )}

      <div id="experience" className="relative z-50 mt-0 scroll-mt-16">
        <Experience />
      </div>

      <div id="projects" className="relative z-50 mt-0 scroll-mt-16">
        <Projects />
      </div>

      <div id="awards" className="relative z-50 mt-0 scroll-mt-16">
        <Awards />
      </div>

      <div id="skills" className={`relative z-50 ${getBackgroundColor()} flex flex-col items-center scroll-mt-16`}>
        <div className="w-full mt-8">
          <SectionKicker index="05" path="skills" className="pt-6 md:pt-16" />
          <div className="flex flex-col items-center px-6 pt-10 pb-6 text-center">
            <h2>
              <GradientText
                className="text-5xl sm:text-6xl md:text-8xl font-semibold leading-none tracking-tighter text-center"
                gradient={textGradient()}
                text="Skills and Frameworks"
              />
            </h2>
          </div>
          <Skills />
        </div>
      </div>


      <div className="relative z-50">
        <HobbiesSection />
      </div>

      </main>

      <div className="relative z-50">
        <Footer />
      </div>

    </div>
  );
}
