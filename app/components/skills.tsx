import { useThemeReady } from "./useThemeReady"
import { useState, type ReactNode } from "react"
import type { IconType } from "react-icons"
import {
  SiPython, SiTypescript, SiJavascript, SiCplusplus, SiR, SiGodotengine, SiHtml5,
  SiReact, SiNextdotjs, SiTailwindcss, SiPytorch, SiLangchain, SiFastapi, SiBootstrap,
  SiDocker, SiPostgresql, SiFirebase, SiSelenium, SiJira, SiLinux, SiGit, SiApachemaven,
} from "react-icons/si"
import { FaAws, FaJava } from "react-icons/fa"
import { TbBrandReactNative } from "react-icons/tb"
import { GradientText } from '@/components/ui/shadcn-io/gradient-text';
import { SkillLevels } from './skillLevels';
import SkillLevelDisplay from "./skillLevelsBadges"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const ECCENTRIC_CLIP_CLASS = "underneath-curve-clip";

interface CardSections {
  top: string | null;
  middle: string | null;
  bottom: string | null;
  rightTop: string | null;
  rightBottom: string | null;
}

// Brand icon for each skill card, keyed by the card title.
const SKILL_ICONS: Record<string, IconType> = {
  "Python": SiPython,
  "TypeScript": SiTypescript,
  "JavaScript": SiJavascript,
  "Java": FaJava,
  "C / C++": SiCplusplus,
  "R": SiR,
  "GDScript": SiGodotengine,
  "HTML / CSS": SiHtml5,
  "React": SiReact,
  "Next.js": SiNextdotjs,
  "React Native": TbBrandReactNative,
  "Tailwind CSS": SiTailwindcss,
  "PyTorch": SiPytorch,
  "LangChain": SiLangchain,
  "FastAPI / Flask": SiFastapi,
  "Bootstrap": SiBootstrap,
  "AWS": FaAws,
  "Docker": SiDocker,
  "PostgreSQL": SiPostgresql,
  "Firebase": SiFirebase,
  "Selenium": SiSelenium,
  "Jira": SiJira,
  "Linux": SiLinux,
  "Git / GitHub": SiGit,
  "Maven": SiApachemaven,
};

interface Skill {
  title: string;
  description: string;
  usage: string;
  coursework: string;
  experience: string;
  projects: string;
}

// One carousel per group. Details come from the resume and transcript, and
// show in the side panels when a card is clicked.
const SKILL_GROUPS: { category: string; skills: Skill[] }[] = [
  {
    category: "Languages",
    skills: [
      {
        title: "Python",
        description: "ML, data, and automation",
        usage: "Main language for machine learning, data pipelines, and automation.",
        coursework: "CS 38003 Python Programming, CS 37300 Data Mining & ML",
        experience: "Cummins, Indiana State Department of Health",
        projects: "AI-Driven Nurse Assistant, Tradify, ReciPic, Ports",
      },
      {
        title: "TypeScript",
        description: "Typed web and mobile apps",
        usage: "Front ends for web and mobile apps, including this site.",
        coursework: "Self-taught through projects",
        experience: "AWS",
        projects: "AI-Driven Nurse Assistant, DM Workbench, this portfolio",
      },
      {
        title: "JavaScript",
        description: "Web apps and extensions",
        usage: "Interactive web apps, browser extensions, and small Node.js tools.",
        coursework: "Self-taught through projects",
        experience: "Texavi",
        projects: "Estimathon, link-opener, ReciPic",
      },
      {
        title: "Java",
        description: "Object-oriented programming",
        usage: "Object-oriented design and backend logic.",
        coursework: "CS 18000 Problem Solving & OOP",
        experience: "—",
        projects: "Ports",
      },
      {
        title: "C / C++",
        description: "Systems programming",
        usage: "Low-level and systems programming.",
        coursework: "CS 24000 Programming in C, CS 25200 Systems Programming",
        experience: "—",
        projects: "Coursework",
      },
      {
        title: "R",
        description: "Statistics",
        usage: "Statistical analysis and modeling.",
        coursework: "STAT 35500 Statistics for Data Science",
        experience: "—",
        projects: "Coursework",
      },
      {
        title: "GDScript",
        description: "Godot games",
        usage: "Game development in the Godot engine.",
        coursework: "HONR 29900 C3 Game Jam",
        experience: "—",
        projects: "Pirate Software Game Jam, Boilermake 2024, C3 Game",
      },
      {
        title: "HTML / CSS",
        description: "Web layout and styling",
        usage: "Accessible, responsive layouts and styling.",
        coursework: "Self-taught through projects",
        experience: "Texavi, Cummins",
        projects: "This portfolio",
      },
    ],
  },
  {
    category: "Frameworks & Libraries",
    skills: [
      {
        title: "React",
        description: "Component-based UIs",
        usage: "Interactive front ends built from reusable components.",
        coursework: "Self-taught through projects",
        experience: "—",
        projects: "ReciPic, this portfolio",
      },
      {
        title: "Next.js",
        description: "Full-stack React",
        usage: "Server-rendered React sites deployed on Vercel.",
        coursework: "Self-taught through projects",
        experience: "—",
        projects: "This portfolio",
      },
      {
        title: "React Native",
        description: "Mobile apps",
        usage: "Cross-platform mobile apps.",
        coursework: "Self-taught through projects",
        experience: "—",
        projects: "AI-Driven Nurse Assistant, ReciPic",
      },
      {
        title: "Tailwind CSS",
        description: "Utility-first styling",
        usage: "Fast, consistent styling for React apps.",
        coursework: "Self-taught through projects",
        experience: "—",
        projects: "This portfolio",
      },
      {
        title: "PyTorch",
        description: "Deep learning",
        usage: "Training and running custom deep learning models.",
        coursework: "CS 47100 Intro to AI, CS 37300 Data Mining & ML",
        experience: "Cummins",
        projects: "ReciPic (YOLOv8)",
      },
      {
        title: "LangChain",
        description: "LLM pipelines",
        usage: "LLM pipelines with Ollama and Pydantic-based parsing.",
        coursework: "Self-taught through projects",
        experience: "—",
        projects: "AI-Driven Nurse Assistant",
      },
      {
        title: "FastAPI / Flask",
        description: "Python APIs",
        usage: "Python web APIs for ML-backed apps.",
        coursework: "Self-taught through projects",
        experience: "—",
        projects: "AI-Driven Nurse Assistant, ReciPic",
      },
      {
        title: "Bootstrap",
        description: "Responsive layouts",
        usage: "Quick responsive layouts for websites.",
        coursework: "Self-taught through projects",
        experience: "Texavi",
        projects: "Earlier websites",
      },
    ],
  },
  {
    category: "Cloud & Tools",
    skills: [
      {
        title: "AWS",
        description: "Four AWS certifications",
        usage: "ECS Fargate, S3, and Aurora for large-scale, low-latency APIs.",
        coursework: "Solutions Architect, ML Engineer, AI Practitioner, and Cloud Practitioner certifications",
        experience: "AWS",
        projects: "Geospatial tile delivery API",
      },
      {
        title: "Docker",
        description: "Containers",
        usage: "Containerizing services for consistent deployment.",
        coursework: "Self-taught through work",
        experience: "Indiana State Department of Health",
        projects: "Address lookup system",
      },
      {
        title: "PostgreSQL",
        description: "Relational databases",
        usage: "Storing app, market, and analytics data.",
        coursework: "CS 44000 Large Scale Data Analytics (in progress)",
        experience: "AWS (Aurora)",
        projects: "AI-Driven Nurse Assistant, Tradify",
      },
      {
        title: "Firebase",
        description: "App backend and storage",
        usage: "Storage and backend services for apps.",
        coursework: "Self-taught through projects",
        experience: "—",
        projects: "ReciPic",
      },
      {
        title: "Selenium",
        description: "Browser automation",
        usage: "Automating data entry in web systems.",
        coursework: "Self-taught through work",
        experience: "Indiana State Department of Health",
        projects: "NEDSS lab data entry",
      },
      {
        title: "Jira",
        description: "Workflow automation",
        usage: "Dashboards and automations for intake workflows.",
        coursework: "—",
        experience: "Cummins",
        projects: "Auditing dashboards (40% efficiency gain)",
      },
      {
        title: "Linux",
        description: "Development environment",
        usage: "Daily development and systems work.",
        coursework: "CS 19300 Tools, CS 25200 Systems Programming",
        experience: "—",
        projects: "Coursework and projects",
      },
      {
        title: "Git / GitHub",
        description: "Version control",
        usage: "Version control and collaboration on every project.",
        coursework: "CS 19300 Tools",
        experience: "All roles",
        projects: "github.com/kprsandilya",
      },
      {
        title: "Maven",
        description: "Java builds",
        usage: "Building and testing Java projects.",
        coursework: "—",
        experience: "—",
        projects: "Ports",
      },
    ],
  },
];

const CAROUSEL_CARD_DATA = SKILL_GROUPS.map((group) =>
  group.skills.map(({ title, description }) => ({ title, description }))
);

const CAROUSEL_CARD_CONTENT: CardSections[][] = SKILL_GROUPS.map((group) =>
  group.skills.map((skill) => ({
    top: `${group.category} · ${skill.title}`,
    middle: skill.usage,
    bottom: `Coursework: ${skill.coursework}`,
    rightTop: `Experience: ${skill.experience}`,
    rightBottom: `Projects: ${skill.projects}`,
  }))
);


// Cohesive glass panel used for the detail column. Keeps the section on-theme
// instead of the raw red/yellow placeholder blocks.
function DetailPanel({
  children,
  className = "",
  emphasis = false,
}: {
  children: ReactNode;
  className?: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`${className} flex items-center justify-center rounded-2xl border border-white/15 ${
        emphasis ? "bg-white/15" : "bg-white/8"
      } px-3 py-2 text-center text-sm font-medium text-white/90 shadow-lg backdrop-blur-md transition-colors`}
    >
      {children}
    </div>
  );
}

interface CarouselSectionProps {
  carouselId: number;
  widthClass: string;
  cardBasis: string;
  selectedCard: string | null;
  pressedCard: string | null;
  handleCardClick: (carouselId: number, index: number) => void;
  handleMouseDown: (cardId: string) => void;
  handleMouseUp: () => void;
  cardData: { title: string; description: string }[];
  cardContent: CardSections[];
}

function CarouselSection({
  carouselId,
  widthClass,
  cardBasis,
  selectedCard,
  pressedCard,
  handleCardClick,
  handleMouseDown,
  handleMouseUp,
  cardData,
  cardContent,
}: CarouselSectionProps) {
  return (
    <div className={`${widthClass} h-full flex justify-end`}>
    <Carousel className="w-full h-full">
        <CarouselContent className="h-full w-full">
        {cardData.map(({ title, description }, index) => {
            const cardId = `${carouselId}-${index}`;
            const isSelected = selectedCard === cardId;
            const isPressed = pressedCard === cardId;

            return (
            <CarouselItem key={cardId} className={`${cardBasis} h-full`}>
                <div className="p-1 h-full">
                <Card
                    onClick={() => handleCardClick(carouselId, index)}
                    onMouseDown={() => handleMouseDown(cardId)}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className={`h-full cursor-pointer rounded-2xl border backdrop-blur-md transition-all duration-200 ease-in-out
                    ${isSelected
                        ? "border-amber-300/80 bg-amber-50/95 text-black shadow-xl ring-2 ring-amber-300/60"
                        : "border-white/15 bg-white/10 text-white shadow-lg hover:-translate-y-1 hover:bg-white/20 hover:shadow-xl"}
                    ${isPressed ? "scale-95" : "scale-100"}
                    `}
                >
                    <CardContent className="flex h-full flex-col items-center justify-center p-4 text-center">
                    {(() => {
                        const Icon = SKILL_ICONS[title];
                        return Icon ? <Icon className="mb-2 h-8 w-8 shrink-0 md:h-10 md:w-10" aria-hidden="true" /> : null;
                    })()}
                    <span className="mb-2 text-xl font-semibold tracking-tight md:text-2xl">{title}</span>
                    <p className="text-sm leading-snug opacity-80">{description}</p>
                    </CardContent>
                </Card>
                </div>
            </CarouselItem>
            );
        })}
        </CarouselContent>
      <CarouselPrevious />
    </Carousel>
    </div>
  );
}


export default function Skills() {
    const { theme, setTheme } = useThemeReady();

    const getBackgroundColor = () => {
        if (theme === "dark") return 'bg-[radial-gradient(circle_at_50%,_#FFD700_0%,_#1A001C_400px)]';
        if (theme === "surprise") return 'bg-[radial-gradient(circle_at_50%_500px,_#D69EBA_0%,_#BA5370_400px)]';
        return 'bg-[radial-gradient(circle_at_50%_500px,_#06beb6,_#006473_400px)]';
    };
        
    const [selectedCard, setSelectedCard] = useState<string | null>(null);
    const [pressedCard, setPressedCard] = useState<string | null>(null);

    const handleCardClick = (carouselId: number, index: number) => {
    const cardId = `${carouselId}-${index}`;
    setSelectedCard((prev) => (prev === cardId ? null : cardId));
    };
    const handleMouseDown = (cardId: string) => setPressedCard(cardId);
    const handleMouseUp = () => setPressedCard(null);

    const carousels = [
        { widthClass: "w-28/48", cardBasis: "lg:basis-1/3" },
        { widthClass: "w-36/48", cardBasis: "lg:basis-1/4" },
        { widthClass: "w-42/48", cardBasis: "lg:basis-1/5" },
    ];

    const selectedCarouselId = selectedCard ? Number(selectedCard.split("-")[0]) : null;
    const selectedCardIndex = selectedCard ? Number(selectedCard.split("-")[1]) : null;

    const sections: CardSections = 
        selectedCarouselId !== null && selectedCardIndex !== null
            ? CAROUSEL_CARD_CONTENT[selectedCarouselId][selectedCardIndex]
            : { top: null, middle: null, bottom: null, rightTop: null, rightBottom: null };

    return (
        <div className="w-full relative">
            <div className={`w-full ${getBackgroundColor()} shadow-2xl`}>
            <div className="relative z-10 w-full px-6 py-16 md:px-16">
                <div className="grid grid-cols-5 lg:h-[720px] gap-6">
                {/* ✅ Left Column with generated carousels */}
                {/* grid-cols-1 pins the track to the column width; otherwise it
                    grows to fit every card and the carousels spill under the
                    detail panels. */}
                <div className="col-span-3 grid grid-cols-1 grid-rows-3 gap-4 justify-items-end pr-4">
                        {carousels.map((c, carouselId) => {
                        const cardData = CAROUSEL_CARD_DATA[carouselId];
                        const cardContent = CAROUSEL_CARD_CONTENT[carouselId];

                        return (
                            <CarouselSection
                            key={carouselId}
                            carouselId={carouselId}
                            widthClass={c.widthClass}
                            cardBasis={c.cardBasis}
                            selectedCard={selectedCard}
                            pressedCard={pressedCard}
                            handleCardClick={handleCardClick}
                            handleMouseDown={handleMouseDown}
                            handleMouseUp={handleMouseUp}
                            cardData={cardData}           // pass specific card array
                            cardContent={cardContent}     // pass specific content array
                            />
                        );
                        })}
                </div>

                {/* ✅ Right Column: detail panels for the selected card */}
                <div className="col-span-2 grid grid-cols-2 gap-4">
                    <div className="col-span-1 flex flex-col gap-4">
                        <DetailPanel className="h-[10%] text-xs">
                        {sections.top || "Skill details"}
                        </DetailPanel>
                        <DetailPanel className="h-[60%]" emphasis>
                        {sections.middle || "Click a skill on the left to see how I have used it."}
                        </DetailPanel>
                        <DetailPanel className="h-[30%] text-xs">
                        {sections.bottom || "Coursework"}
                        </DetailPanel>
                    </div>

                    <div className="col-span-1 flex flex-col gap-4">
                        <DetailPanel className="h-1/2">
                        {sections.rightTop || "Experience"}
                        </DetailPanel>
                        <DetailPanel className="h-1/2">
                        {sections.rightBottom || "Projects"}
                        </DetailPanel>
                    </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}