import { PinContainer } from '@/components/ui/shadcn-io/3d-pin';
import { useTheme } from 'next-themes'
import { LineShadowText } from '@/components/ui/shadcn-io/line-shadow-text';
import CodeHoverCards from '@/components/ui/3d-hover-gallery';
import { Github, Code, Dices } from 'lucide-react';

const RESEARCH_DATA = [
  {
    id: "1",
    icon: Github,
    href: "https://react.dev",
    title: "React Documentation",
    description: "The library for web and native user interfaces.",
  },
  {
    id: "2",
    icon: Github,
    href: "https://react.dev",
    title: "React Documentation",
    description: "The library for web and native user interfaces.",
  },
  {
    id: "3",
    icon: Github,
    href: "https://react.dev",
    title: "React Documentation",
    description: "The library for web and native user interfaces.",
  },
  {
    id: "4",
    icon: Github,
    href: "https://react.dev",
    title: "React Documentation",
    description: "The library for web and native user interfaces.",
  },
];

// New list for Project items
const PROJECT_DATA = [
  {
    id: 5,
    title: "/project-alpha.com",
    href: "#",
    heading: "Project Alpha: AI Chatbot",
    description: "A generative AI assistant built with Vercel AI SDK and custom models.",
    bgClass: "from-red-500 via-pink-500 to-orange-500",
  },
  {
    id: 6,
    title: "/portfolio-v3.io",
    href: "#",
    heading: "Portfolio Website V3",
    description: "A personal site featuring 3D interactions and dynamic themes.",
    bgClass: "from-lime-500 via-yellow-500 to-amber-500",
  },
  {
    id: 7,
    title: "/e-commerce-app.co",
    href: "#",
    heading: "E-Commerce Platform",
    description: "Full-stack application using Stripe for payments and a headless CMS.",
    bgClass: "from-indigo-500 via-blue-500 to-cyan-500",
  },
  {
    id: 8,
    title: "/data-dashboard.app",
    href: "#",
    heading: "Real-time Analytics Dashboard",
    description: "Monitoring system with live data fetching and customizable charts.",
    bgClass: "from-purple-500 via-fuchsia-500 to-rose-500",
  },
];

const CLIP_CLASS = "clip-top-curve";

export default function ThreeDPinGrid() {
    const { theme, setTheme } = useTheme();

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
    <div className='w-full relative'>
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
        <div className={`w-full ${getColors()} ${CLIP_CLASS} pb-96`}>
            <div className='w-full relative text-center pt-32'>
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
            </div>
            <CodeHoverCards 
                  cards={RESEARCH_DATA}
                  className="flex w-full items-center justify-center bg-transparent pt-12"
                  columns={4}
                  onCardClick={(card) => console.log('Clicked:', card)}
                />
            <CodeHoverCards 
              cards={RESEARCH_DATA}
              className="flex w-full items-center justify-center bg-transparent"
              columns={4}
              onCardClick={(card) => console.log('Clicked:', card)}
            />
        </div>
    </div>
  );
}