import { PinContainer } from '@/components/ui/shadcn-io/3d-pin';
import { useThemeReady } from './useThemeReady'
import { LineShadowText } from '@/components/ui/shadcn-io/line-shadow-text';
import CodeHoverCards, { type CardData } from '@/components/ui/3d-hover-gallery';
import { Github, Code, Dices } from 'lucide-react';
import { Parallax } from 'react-scroll-parallax';

// First row: projects from the resume. Clicking a card flips it to show
// details; the repo link only appears for public repositories.
const RESUME_PROJECTS: CardData[] = [
  {
    id: "nurse-assistant",
    icon: Code,
    title: "AI-Driven Nurse Assistant",
    description: "LLM pipeline that turns nurse feedback into staffing insights.",
    details: {
      summary: "Helps nurse managers understand workload and morale by analyzing feedback that nurses leave in Microsoft Teams. (Aug 2025 – Dec 2026)",
      bullets: [
        "NLP pipeline with LangChain and Ollama, Pydantic-based parsing, and GPU acceleration that pulls structured sentiment from free-form feedback and suggests actions for managers.",
        "Prediction logic that models nurse supply and demand, turning unstructured Teams messages into real-time availability indicators for staffing decisions.",
        "TypeScript front end built on the Microsoft Teams API.",
      ],
      tech: ["React Native", "FastAPI", "LangChain", "Ollama", "PostgreSQL"],
      visibility: "private",
    },
  },
  {
    id: "tradify",
    icon: Code,
    title: "Tradify",
    description: "ML-driven trading pipeline that trades live through Alpaca.",
    details: {
      summary: "An end-to-end automated trading system built with the Boiler Quant team. (Aug 2025 – Dec 2025)",
      bullets: [
        "Always-on data collector that pulls live prices, news, and sentiment, stores them in PostgreSQL, and keeps an in-memory cache for fast reads.",
        "Signal generator and trading engine that produce buy/sell/hold signals from a custom-trained ML model, apply risk rules, and place trades through Alpaca.",
        "Logs every trade and keeps portfolio status up to date.",
      ],
      tech: ["Python", "Alpaca", "PostgreSQL", "WebSockets", "Matplotlib"],
      visibility: "private",
    },
  },
  {
    id: "recipic",
    icon: Github,
    title: "ReciPic",
    description: "Finds recipes from fridge photos with YOLOv8 and Gemini.",
    details: {
      summary: "Take a photo of your fridge and get recipes you can make with what you have. (April 2025)",
      bullets: [
        "Custom-trained YOLOv8 model recognizes ingredients in uploaded photos and stores the results in Firebase Storage.",
        "Gemini writes recipes and works out which extra ingredients are needed.",
        "A Chrome extension adds missing ingredients to a Walmart order.",
      ],
      tech: ["React", "PyTorch", "Flask", "Firebase", "Gemini"],
      image: "/projects/ReciPic.png",
      visibility: "public",
      repoUrl: "https://github.com/kprsandilya/ReciPic",
    },
  },
  {
    id: "ports",
    icon: Code,
    title: "Ports",
    description: "Portfolio risk and Sharpe ratio models for a fintech startup.",
    details: {
      summary: "Risk research for Ports, a fintech startup for investing in user-generated portfolios. (Feb 2025 – May 2025)",
      bullets: [
        "Researched methods for calculating portfolio risk.",
        "Built a risk quantifier with tests to optimize portfolio performance using the Capital Market Line.",
        "Built a gradient-descent model that maximizes the Sharpe ratio while accounting for additional risk measures.",
      ],
      tech: ["Python", "Java", "Maven"],
      visibility: "private",
    },
  },
];

// Second row: other public GitHub repositories.
const GITHUB_PROJECTS: CardData[] = [
  {
    id: "sailing-simulator",
    icon: Dices,
    title: "Tia's Sailing Simulator",
    description: "Sailing game with a live Llama 3.1 voice companion.",
    details: {
      summary: "A BoilerMake XII hackathon game built with a team of four: sail, fish, and keep your hunger bar up while Tia, an AI companion, shares facts about the sea.",
      bullets: [
        "Built in Godot with GDScript, controlled through a dynamic keyboard interface.",
        "A quantized Llama 3.1 8B model hosted on Modal generates Tia's lines, and Cartesia's Sonic text-to-speech voices them live.",
      ],
      tech: ["Godot", "GDScript", "Llama 3.1", "Modal", "Cartesia"],
      image: "/projects/Tia-s-Sailing-Simulator.png",
      visibility: "public",
      repoUrl: "https://github.com/kprsandilya/Tia-s-Sailing-Simulator",
    },
  },
  {
    id: "dm-workbench",
    icon: Github,
    title: "DM Workbench",
    description: "Offline desktop toolkit for running D&D 5e campaigns.",
    details: {
      summary: "A private, offline desktop app for Dungeon Masters that keeps a whole campaign in one database.",
      bullets: [
        "World atlas powered by a bundled Azgaar's Fantasy Map Generator, plus a grid-based dungeon and battle-map editor.",
        "Creatures, encounters, and a combat tracker; quests; a calendar and timeline; and session notes that turn into campaign updates.",
        "No accounts, telemetry, or network access: everything lives in SQLite on your machine.",
      ],
      tech: ["Tauri 2", "Rust", "React 19", "TypeScript", "SQLite"],
      image: "/projects/GMDND.png",
      visibility: "public",
      repoUrl: "https://github.com/kprsandilya/GMDND",
    },
  },
  {
    id: "estimathon",
    icon: Github,
    title: "Estimathon",
    description: "Live scoreboard and team app for Estimathon events.",
    details: {
      summary: "Web app for running an Estimathon, a team competition where players submit interval estimates.",
      bullets: [
        "Scoreboard display, a player page where teams submit answers, and a password-protected admin console.",
        "Runs locally in one browser, or as a shared live game on Vercel backed by Redis.",
      ],
      tech: ["JavaScript", "Vite", "Vercel", "Redis"],
      image: "/projects/Estimathon.png",
      visibility: "public",
      repoUrl: "https://github.com/kprsandilya/Estimathon",
      liveUrl: "https://estimathon-pearl.vercel.app",
    },
  },
  {
    id: "link-opener",
    icon: Github,
    title: "link-opener",
    description: "Firefox extension that saves and reopens link sessions.",
    details: {
      summary: "A Firefox extension that turns lists of links into browser windows, and open windows back into editable, shareable link lists.",
      bullets: [
        "Each list becomes one window, and each link becomes its own tab.",
        "Privacy first: everything stays in local storage, with no network requests or page access.",
      ],
      tech: ["JavaScript", "Firefox", "Manifest V3"],
      visibility: "public",
      repoUrl: "https://github.com/kprsandilya/link-opener",
    },
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