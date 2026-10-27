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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
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

type SkillLevelKey = keyof typeof SkillLevels;

// Expertise level (see skillLevels.js), a short explanation of what the
// skill is, and its official site. Shown in the detail panels.
const SKILL_DETAILS: Record<string, { level: SkillLevelKey; about: string; url: string }> = {
  "Python": { level: "EXPERT", about: "A general-purpose, high-level programming language known for readable syntax and a huge ecosystem for data science, machine learning, and automation.", url: "https://www.python.org" },
  "TypeScript": { level: "ADVANCED", about: "JavaScript with static types. It catches mistakes before the code runs and compiles to plain JavaScript.", url: "https://www.typescriptlang.org" },
  "JavaScript": { level: "ADVANCED", about: "The programming language of the web. It runs in every browser and, with Node.js, on servers too.", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  "Java": { level: "PROFICIENT", about: "A statically typed, object-oriented language that runs on the Java Virtual Machine, widely used for backend and enterprise systems.", url: "https://dev.java" },
  "C / C++": { level: "PROFICIENT", about: "Compiled languages that give direct control over memory and hardware. C++ adds classes and templates on top of C.", url: "https://isocpp.org" },
  "R": { level: "COMPETENT", about: "A language and environment built for statistical computing and data visualization.", url: "https://www.r-project.org" },
  "GDScript": { level: "PROFICIENT", about: "The Python-like scripting language built into the Godot game engine.", url: "https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/" },
  "HTML / CSS": { level: "ADVANCED", about: "HTML structures the content of a web page, and CSS controls how that content looks and is laid out.", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development" },
  "React": { level: "ADVANCED", about: "A JavaScript library for building user interfaces out of reusable components.", url: "https://react.dev" },
  "Next.js": { level: "PROFICIENT", about: "A React framework that adds routing, server rendering, and build tooling for production websites.", url: "https://nextjs.org" },
  "React Native": { level: "PROFICIENT", about: "A framework for building native iOS and Android apps with React.", url: "https://reactnative.dev" },
  "Tailwind CSS": { level: "ADVANCED", about: "A utility-first CSS framework: you style elements by combining small, single-purpose classes.", url: "https://tailwindcss.com" },
  "PyTorch": { level: "PROFICIENT", about: "An open-source deep learning framework for building and training neural networks, with GPU acceleration.", url: "https://pytorch.org" },
  "LangChain": { level: "PROFICIENT", about: "A framework for building applications on top of large language models, such as chains, agents, and retrieval pipelines.", url: "https://www.langchain.com" },
  "FastAPI / Flask": { level: "PROFICIENT", about: "Python web frameworks for building APIs. Flask is minimal and flexible; FastAPI adds type-based validation and async support.", url: "https://fastapi.tiangolo.com" },
  "Bootstrap": { level: "COMPETENT", about: "A CSS framework with ready-made responsive layouts and components.", url: "https://getbootstrap.com" },
  "AWS": { level: "ADVANCED", about: "Amazon Web Services, a cloud platform offering on-demand computing, storage, databases, and machine learning services.", url: "https://aws.amazon.com" },
  "Docker": { level: "PROFICIENT", about: "A tool for packaging an application and its dependencies into a container that runs the same way everywhere.", url: "https://www.docker.com" },
  "PostgreSQL": { level: "PROFICIENT", about: "A powerful open-source relational database known for reliability and standards compliance.", url: "https://www.postgresql.org" },
  "Firebase": { level: "COMPETENT", about: "Google's app development platform, with hosting, authentication, databases, and file storage.", url: "https://firebase.google.com" },
  "Selenium": { level: "PROFICIENT", about: "A framework for automating web browsers, used for testing and scripted data entry.", url: "https://www.selenium.dev" },
  "Jira": { level: "PROFICIENT", about: "Atlassian's tool for tracking issues and managing team workflows.", url: "https://www.atlassian.com/software/jira" },
  "Linux": { level: "ADVANCED", about: "An open-source operating system that powers most servers and development environments.", url: "https://www.kernel.org" },
  "Git / GitHub": { level: "ADVANCED", about: "Git tracks changes to code; GitHub hosts Git repositories and adds collaboration tools like pull requests.", url: "https://git-scm.com" },
  "Maven": { level: "COMPETENT", about: "A build and dependency management tool for Java projects.", url: "https://maven.apache.org" },
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

// Flat-topped hexagon, as in the sketch.
const HEXAGON = "polygon(25% 3%, 75% 3%, 100% 50%, 75% 97%, 25% 97%, 0% 50%)";

const PANEL_CLASSES = "rounded-2xl border border-white/15 bg-white/10 text-white/90 shadow-lg backdrop-blur-md";

function SkillLevelBadge({ levelKey }: { levelKey: SkillLevelKey | null }) {
  const level = levelKey ? SkillLevels[levelKey] : null;
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 overflow-hidden p-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Expertise</p>
      <div
        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-white/70 shadow-xl xl:h-24 xl:w-24 ${
          level ? level.color : "bg-white/10"
        }`}
      >
        <span className="text-2xl font-bold text-white xl:text-3xl">{level ? level.level : "?"}</span>
      </div>
      <p className="text-lg font-semibold">{level ? level.name : "Level"}</p>
      {/* One pip per level, filled up to this skill's level */}
      <div className="flex gap-1.5" aria-label={level ? `${level.level} out of 5` : undefined}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={`h-2 w-5 rounded-full ${level && n <= level.level ? "bg-white" : "bg-white/25"}`}
          />
        ))}
      </div>
      {level && <p className="line-clamp-3 text-xs leading-snug text-white/75">{level.description}</p>}
    </div>
  );
}

// Each row gets a frame that describes its category:
//   code  - Languages: a code editor window with a file tab
//   stack - Frameworks & Libraries: stacked layers with an import line
//   cloud - Cloud & Tools: a card with a cloud-shaped top
type FrameVariant = "code" | "stack" | "cloud";

const FILE_NAMES: Record<string, string> = {
  "Python": "main.py",
  "TypeScript": "index.ts",
  "JavaScript": "app.js",
  "Java": "Main.java",
  "C / C++": "main.cpp",
  "R": "analysis.R",
  "GDScript": "player.gd",
  "HTML / CSS": "index.html",
};

const PACKAGE_NAMES: Record<string, string> = {
  "React": "react",
  "Next.js": "next",
  "React Native": "react-native",
  "Tailwind CSS": "tailwindcss",
  "PyTorch": "torch",
  "LangChain": "langchain",
  "FastAPI / Flask": "fastapi",
  "Bootstrap": "bootstrap",
};

// Cloud outline for the top of the Cloud & Tools cards (viewBox 0 0 100 30).
const CLOUD_PATH =
  "M0 30 L0 23 C0 16 7 13 14 16 C15 6 30 1 38 9 C43 -1 62 -1 67 9 C74 2 91 5 89 17 C95 16 100 20 100 25 L100 30";

function SkillCardBody({ title, description, mono = false }: { title: string; description: string; mono?: boolean }) {
  const Icon = SKILL_ICONS[title];
  return (
    <>
      {Icon && <Icon className="mb-2 h-8 w-8 shrink-0 md:h-10 md:w-10" aria-hidden="true" />}
      <span
        className={`mb-1 max-w-full text-[clamp(0.8rem,1.3vw,1.5rem)] font-semibold leading-tight tracking-tight ${
          mono ? "font-mono" : ""
        }`}
      >
        {title}
      </span>
      <p className="text-[11px] leading-snug opacity-80 xl:text-sm">{description}</p>
    </>
  );
}

function SkillFrame({
  variant,
  title,
  description,
  selected,
}: {
  variant: FrameVariant;
  title: string;
  description: string;
  selected: boolean;
}) {
  const tone = selected
    ? "border-amber-300/80 bg-amber-50/95 text-black"
    : "border-white/15 bg-white/10 text-white group-hover:bg-white/20";

  if (variant === "code") {
    return (
      <div className={`flex h-full flex-col overflow-hidden rounded-lg border shadow-lg backdrop-blur-md transition-colors ${tone}`}>
        {/* Editor title bar: window dots and a file tab */}
        <div
          className={`flex shrink-0 items-center gap-0.5 border-b px-1.5 py-1 xl:gap-1 xl:px-2 ${
            selected ? "border-amber-300/60 bg-amber-100" : "border-white/10 bg-black/25"
          }`}
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-400 xl:h-2 xl:w-2" />
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-400 xl:h-2 xl:w-2" />
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-400 xl:h-2 xl:w-2" />
          <span className="ml-1 truncate font-mono text-[9px] opacity-80 xl:text-[10px]">{FILE_NAMES[title] ?? "main"}</span>
        </div>
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center p-2 text-center xl:p-3">
          <SkillCardBody title={title} description={description} mono />
        </div>
      </div>
    );
  }

  if (variant === "stack") {
    const layer = selected ? "border-amber-300/60 bg-amber-100/40" : "border-white/10 bg-white/5";
    return (
      <div className="relative h-full">
        {/* Two sheets peeking out behind the card, like a stack of building blocks */}
        <div aria-hidden="true" className={`absolute inset-x-3 top-0 bottom-3 rounded-2xl border ${layer}`} />
        <div aria-hidden="true" className={`absolute inset-x-1.5 top-1.5 bottom-1.5 rounded-2xl border ${layer}`} />
        <div
          className={`absolute inset-x-0 top-3 bottom-0 flex flex-col items-center justify-center rounded-2xl border p-2 text-center shadow-lg backdrop-blur-md transition-colors xl:p-3 ${tone}`}
        >
          <span
            className={`mb-2 max-w-full truncate rounded-md px-1.5 py-0.5 font-mono text-[10px] ${
              selected ? "bg-amber-200/80" : "bg-black/25"
            }`}
          >
            <span className="hidden xl:inline">import </span>
            {PACKAGE_NAMES[title] ?? title.toLowerCase()}
          </span>
          <SkillCardBody title={title} description={description} />
        </div>
      </div>
    );
  }

  // cloud: a slightly stronger outline so the cloud shape reads clearly
  const cloudTone = selected ? tone : "border-white/30 bg-white/10 text-white group-hover:bg-white/20";
  return (
    <div className="flex h-full flex-col drop-shadow-lg">
      <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="block h-9 w-full shrink-0 xl:h-12" aria-hidden="true">
        <path
          d={CLOUD_PATH + " Z"}
          className={`transition-colors ${selected ? "fill-amber-50/95" : "fill-white/10 group-hover:fill-white/20"}`}
        />
        <path
          d={CLOUD_PATH}
          fill="none"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          className={selected ? "stroke-amber-300/80" : "stroke-white/30"}
        />
      </svg>
      <div
        className={`-mt-px flex min-h-0 flex-1 flex-col items-center justify-center rounded-b-2xl border border-t-0 p-2 text-center transition-colors xl:p-3 ${cloudTone}`}
      >
        <SkillCardBody title={title} description={description} />
      </div>
    </div>
  );
}

// Carousel track whose cards fade into the background at an edge whenever
// more cards are hidden past that edge, instead of being cut off sharply.
const EDGE_FADE_PX = 72;

function FadingCarouselContent({ className, children }: { className?: string; children: ReactNode }) {
  const { canScrollPrev, canScrollNext } = useCarousel();
  const left = canScrollPrev ? EDGE_FADE_PX : 0;
  const right = canScrollNext ? EDGE_FADE_PX : 0;
  const mask = `linear-gradient(to right, transparent 0, #000 ${left}px, #000 calc(100% - ${right}px), transparent 100%)`;
  return (
    <CarouselContent
      className={className}
      viewportStyle={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      {children}
    </CarouselContent>
  );
}

interface CarouselSectionProps {
  carouselId: number;
  variant: FrameVariant;
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
  variant,
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
        <FadingCarouselContent className="h-full w-full">
        {cardData.map(({ title, description }, index) => {
            const cardId = `${carouselId}-${index}`;
            const isSelected = selectedCard === cardId;
            const isPressed = pressedCard === cardId;

            return (
            <CarouselItem key={cardId} className={`${cardBasis} h-full`}>
                <div className="p-1 h-full">
                <div
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    onClick={() => handleCardClick(carouselId, index)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleCardClick(carouselId, index);
                        }
                    }}
                    onMouseDown={() => handleMouseDown(cardId)}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className={`group h-full cursor-pointer transition-transform duration-200 ease-in-out ${
                        isPressed ? "scale-95" : "hover:-translate-y-1"
                    } ${isSelected ? "drop-shadow-xl" : ""}`}
                >
                    <SkillFrame variant={variant} title={title} description={description} selected={isSelected} />
                </div>
                </div>
            </CarouselItem>
            );
        })}
        </FadingCarouselContent>
      <CarouselPrevious className="disabled:opacity-30" />
      {/* Sits just inside the right edge, over the peeking card, because the
          detail panels are right next to the carousels. */}
      <CarouselNext className="right-2 z-10 border-white/40 bg-white/85 text-slate-900 shadow-lg hover:bg-white disabled:opacity-0" />
    </Carousel>
    </div>
  );
}


export default function Skills() {
    const { theme, setTheme } = useThemeReady();

    const getBackgroundColor = () => {
        if (theme === "dark") return 'bg-[radial-gradient(circle_at_50%,_#FFD700_0%,_#120016_400px)]';
        if (theme === "surprise") return 'bg-[radial-gradient(circle_at_50%_500px,_#D69EBA_0%,_#8A2F4E_400px)]';
        return 'bg-[radial-gradient(circle_at_50%_500px,_#06beb6,_#013A46_400px)]';
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
        // Each basis is a little under 1/3, 1/4, and 1/5 so part of the next
        // card peeks in on the right, showing that the row scrolls.
        { widthClass: "w-28/48", cardBasis: "basis-[80%] lg:basis-[29%]", variant: "code" as const },
        { widthClass: "w-36/48", cardBasis: "basis-[80%] lg:basis-[22.5%]", variant: "stack" as const },
        { widthClass: "w-42/48", cardBasis: "basis-[80%] lg:basis-[18.5%]", variant: "cloud" as const },
    ];

    const selectedCarouselId = selectedCard ? Number(selectedCard.split("-")[0]) : null;
    const selectedCardIndex = selectedCard ? Number(selectedCard.split("-")[1]) : null;

    const selectedGroup = selectedCarouselId !== null ? SKILL_GROUPS[selectedCarouselId] : null;
    const selectedSkill =
        selectedGroup && selectedCardIndex !== null ? selectedGroup.skills[selectedCardIndex] : null;
    const selectedDetails = selectedSkill ? SKILL_DETAILS[selectedSkill.title] : null;
    const SelectedIcon = selectedSkill ? SKILL_ICONS[selectedSkill.title] : null;

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
                            variant={c.variant}
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

                {/* Right column: details for the selected skill.
                    Left: name, experience & projects, learn more.
                    Right: logo in a hexagon, expertise badge. */}
                <div className="col-span-2 grid grid-cols-2 gap-4">
                    <div className="col-span-1 flex min-h-0 flex-col gap-4">
                        <div className={`${PANEL_CLASSES} flex flex-[1] items-center px-4 py-3`}>
                            <div className="min-w-0">
                                <p className="text-[11px] uppercase tracking-widest text-white/60">
                                    {selectedGroup ? selectedGroup.category : "Skill"}
                                </p>
                                <h3 className="truncate text-xl font-bold text-white">
                                    {selectedSkill ? selectedSkill.title : "Pick a skill"}
                                </h3>
                            </div>
                        </div>

                        <div className={`${PANEL_CLASSES} flex min-h-0 flex-[6] flex-col bg-white/15 p-4`}>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/70">
                                Experience & projects
                            </p>
                            {selectedSkill ? (
                                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain pr-1 text-sm leading-snug">
                                    <p className="text-white">{selectedSkill.usage}</p>
                                    <div>
                                        <p className="text-xs font-semibold text-white/70">Where I used it</p>
                                        <p>{selectedSkill.experience}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-white/70">Projects</p>
                                        <p>{selectedSkill.projects}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-white/70">Coursework</p>
                                        <p>{selectedSkill.coursework}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="m-auto text-center text-sm text-white/80">
                                    Click a skill on the left to see where I&apos;ve used it.
                                </p>
                            )}
                        </div>

                        <div className={`${PANEL_CLASSES} flex min-h-0 flex-[3] flex-col p-4`}>
                            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-white/70">Learn more</p>
                            {selectedDetails ? (
                                <>
                                    <p className="min-h-0 flex-1 overflow-y-auto overscroll-contain text-xs leading-snug">
                                        {selectedDetails.about}
                                    </p>
                                    <a
                                        href={selectedDetails.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 inline-flex items-center gap-1 self-start text-xs font-semibold text-white underline underline-offset-2 hover:text-white/80"
                                    >
                                        Official site ↗
                                    </a>
                                </>
                            ) : (
                                <p className="text-xs text-white/70">What each skill is, with a link to learn more.</p>
                            )}
                        </div>
                    </div>

                    <div className="col-span-1 flex min-h-0 flex-col gap-4">
                        <div className={`${PANEL_CLASSES} flex flex-[4] items-center justify-center p-4`}>
                            {/* Hexagon frame: an outer ring with the logo on an inner face */}
                            <div className="flex aspect-[1.15] w-[78%] max-w-[200px] items-center justify-center bg-white/40" style={{ clipPath: HEXAGON }}>
                                <div className="flex h-[88%] w-[88%] items-center justify-center bg-white text-slate-900" style={{ clipPath: HEXAGON }}>
                                    {SelectedIcon ? (
                                        <SelectedIcon className="h-1/2 w-1/2" aria-label={`${selectedSkill?.title} logo`} />
                                    ) : (
                                        <span className="text-sm font-semibold text-slate-500">Logo</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={`${PANEL_CLASSES} min-h-0 flex-[5]`}>
                            <SkillLevelBadge levelKey={selectedDetails ? selectedDetails.level : null} />
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}