import { PinContainer } from '@/components/ui/shadcn-io/3d-pin';
import { useThemeReady } from './useThemeReady'
import { LineShadowText } from '@/components/ui/shadcn-io/line-shadow-text';
import CodeHoverCards from '@/components/ui/3d-hover-gallery';
import { Github, Code, Dices } from 'lucide-react';
import { Parallax } from 'react-scroll-parallax';

// First row: projects from the resume.
const RESUME_PROJECTS = [
  {
    id: "nurse-assistant",
    icon: Code,
    title: "AI-Driven Nurse Assistant",
    description: "LLM pipeline that turns nurse feedback into staffing insights.",
  },
  {
    id: "tradify",
    icon: Code,
    title: "Tradify",
    description: "ML-driven trading pipeline that trades live through Alpaca.",
  },
  {
    id: "recipic",
    icon: Github,
    href: "https://github.com/kprsandilya/ReciPic",
    title: "ReciPic",
    description: "Finds recipes from fridge photos with YOLOv8 and Gemini.",
  },
  {
    id: "ports",
    icon: Code,
    title: "Ports",
    description: "Portfolio risk and Sharpe ratio models for a fintech startup.",
  },
];

// Second row: other public GitHub repositories.
const GITHUB_PROJECTS = [
  {
    id: "sailing-simulator",
    icon: Dices,
    href: "https://github.com/kprsandilya/Tia-s-Sailing-Simulator",
    title: "Tia's Sailing Simulator",
    description: "Sailing game with a live Llama 3.1 voice companion.",
  },
  {
    id: "dm-workbench",
    icon: Github,
    href: "https://github.com/kprsandilya/GMDND",
    title: "DM Workbench",
    description: "Offline desktop toolkit for running D&D 5e campaigns.",
  },
  {
    id: "estimathon",
    icon: Github,
    href: "https://estimathon-pearl.vercel.app",
    title: "Estimathon",
    description: "Live scoreboard and team app for Estimathon events.",
  },
  {
    id: "link-opener",
    icon: Github,
    href: "https://github.com/kprsandilya/link-opener",
    title: "link-opener",
    description: "Firefox extension that saves and reopens link sessions.",
  },
];

const CLIP_CLASS = "clip-top-curve";

export default function ThreeDPinGrid() {
    const { theme, setTheme } = useThemeReady();

    const getColors = () => {
        // New Dark Theme: Deep Slate to Black with a mid-tone for depth.
        if (theme === "dark") return 'bg-gradient-to-b from-[#121B21] to-[#241427]';

        // New Surprise Theme: High-energy Rose to Purple.
        if (theme === "surprise") return 'bg-gradient-to-b from-[#FFB69B] to-[#F0CC95]';
        
        // New Default Theme: Clean, modern Teal/Sky to Blue.
        return 'bg-gradient-to-b from-[#91EAE4] to-[#86A8E7]';
    };

    const textShadow = () => {
        if (theme === "dark") return 'rgb(255, 255, 255)';
        if (theme === "surprise") return 'rgba(53, 53, 70, 1)';
        return 'rgb(0,0,0)';
    };

    const textColor = () => {
        if (theme === "dark") return 'rgb(255, 255, 255)';
        if (theme === "surprise") return 'rgba(70, 87, 111, 1)';
        return 'rgb(0,0,0)';
    };

  return (
    // Static block (no scroll-translate parallax) that tucks its curved top up
    // over the section above. The negative margin is scalable and large enough
    // to cover the curve depth, and the section above shares this top color so
    // the seam is seamless.
    <div className='w-full relative mt-[clamp(-240px,-18vh,-140px)]'>
         <svg
            width="0"
            height="0"
            className="absolute top-0 left-0 pointer-events-none"
        >
            <clipPath id="top-curve-clip" clipPathUnits="objectBoundingBox">
            {/* Path that defines the visible area, with the top curved */}
            <path 
                d="M0 0.1 C0.5 0, 0.5 0, 1 0.1 L1 1 L0 1 Z"
            />
            </clipPath>
        </svg>
        <div className={`w-full ${getColors()} ${CLIP_CLASS} pb-96 overflow-hidden`}>
            <Parallax speed={8} className='w-full relative text-center pt-32'>
                <h1 className="text-balance text-8xl font-semibold leading-none tracking-tighter">
                    <LineShadowText 
                    className="italic" 
                    shadowColor={textShadow()}
                    textColor={textColor()}
                    >
                    Research
                    </LineShadowText>
                    {' '}
                    <LineShadowText 
                    className="italic" 
                    shadowColor={textShadow()}
                    textColor={textColor()}
                    >
                    &
                    </LineShadowText>
                    {' '}
                    <LineShadowText 
                    className="italic" 
                    shadowColor={textShadow()}
                    textColor={textColor()}
                    >
                    Projects
                    </LineShadowText>

                </h1>
            </Parallax>
            <Parallax speed={8}>
              <CodeHoverCards 
                    cards={RESUME_PROJECTS}
                    className="flex w-full items-center justify-center bg-transparent pt-12"
                    columns={4}
                  />
              <CodeHoverCards 
                cards={GITHUB_PROJECTS}
                className="flex w-full items-center justify-center bg-transparent"
                columns={4}
              />
            </Parallax>
        </div>
    </div>
  );
}