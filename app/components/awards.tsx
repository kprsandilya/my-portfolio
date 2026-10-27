import ThreeDCarousel, { ThreeDCarouselItem } from "@/components/ui/ThreeDCarousel";
import { BackgroundBeams } from "@/components/ui/shadcn-io/background-beams";
import { useThemeReady } from "./useThemeReady"
import { GradientText } from '@/components/ui/shadcn-io/gradient-text';
import { Parallax } from 'react-scroll-parallax';
import { FaAws } from "react-icons/fa";
import { ShieldCheck, ChartCandlestick, GraduationCap } from "lucide-react";

// Certifications from the resume, plus Dean's List honors from the transcript.
const items: ThreeDCarouselItem[] = [
  {
    id: 1,
    title: "AWS Certified Solutions Architect – Associate",
    brand: "Amazon Web Services",
    icon: FaAws,
    description: "Designing secure, resilient, and cost-effective architectures on AWS.",
    tags: ["AWS", "Cloud", "Architecture"],
  },
  {
    id: 2,
    title: "AWS Certified Machine Learning Engineer – Associate",
    brand: "Amazon Web Services",
    icon: FaAws,
    description: "Building, deploying, and operating machine learning workloads on AWS.",
    tags: ["AWS", "Machine Learning", "MLOps"],
  },
  {
    id: 3,
    title: "AWS Certified AI Practitioner",
    brand: "Amazon Web Services",
    icon: FaAws,
    description: "Foundations of AI, machine learning, and generative AI services on AWS.",
    tags: ["AWS", "AI", "Generative AI"],
  },
  {
    id: 4,
    title: "AWS Certified Cloud Practitioner",
    brand: "Amazon Web Services",
    icon: FaAws,
    description: "Core AWS services, security, pricing, and cloud concepts.",
    tags: ["AWS", "Cloud"],
  },
  {
    id: 5,
    title: "GIAC Foundational Cybersecurity Technologies (GFACT)",
    brand: "GIAC",
    icon: ShieldCheck,
    description: "Foundations of computing, networking, and cybersecurity.",
    tags: ["Security", "Networking"],
  },
  {
    id: 6,
    title: "Options 101",
    brand: "Akuna Capital",
    icon: ChartCandlestick,
    description: "Options pricing, trading fundamentals, and market-making concepts.",
    tags: ["Finance", "Options", "Trading"],
  },
  {
    id: 7,
    title: "Dean's List & Semester Honors",
    brand: "Purdue University",
    icon: GraduationCap,
    description: "Earned every semester from Fall 2023 through Spring 2026, with a 3.98 cumulative GPA.",
    tags: ["Academics", "Honors"],
  },
];

const ECCENTRIC_CLIP_CLASS = "eccentric-curve-clip";
const BOTTOM_CLIP_CLASS = "eccentric-curve-clip-bottom";

export default function Awards() {
    const { theme, setTheme } = useThemeReady();

    // Top color matches Projects' bottom (seamless), bottom is the lighter
    // Awards tone that the bottom curve carves into.
    const getBackgroundColor = () => 'bg-gradient-to-b from-[var(--pf-bg-alt)] to-[var(--pf-bg-deep)]';

    // The curved panel keeps the Awards tone; its carved bottom reveals the
    // Skills color behind it, so the curve reads as a contrasting transition.
    const getBottomBackgroundColor = () => 'bg-[var(--pf-bg-deep)]';

    // Color of the Skills section that follows (kept in sync with page.tsx).
    // Used as the layer the bottom curve reveals, so the seam stays clean.
    const getSkillsColor = () => 'bg-[color:var(--pf-term)]';

    // Projects' bottom color (kept in sync with projects.tsx). The curved top
    // is cut deeper than Awards overlaps Projects, so this fills the cut-out
    // corners below Projects instead of letting the page background show.
    const getProjectsBottomColor = () => 'bg-[var(--pf-bg-alt)]';

    const textGradient = () => 'linear-gradient(90deg, var(--pf-accent) 0%, var(--pf-accent-2) 50%, var(--pf-accent) 100%)';

    return (
        // Static block: it tucks its curved top up over Projects via a scalable
        // negative margin (sized to cover the eccentric curve's depth).
        <div className="w-full relative mt-[clamp(-260px,-20vh,-150px)]">
            <svg
                width="0"
                height="0"
                className="absolute top-0 left-0 pointer-events-none"
            >

            <clipPath id="eccentric-curve-clip" clipPathUnits="objectBoundingBox">
            <path d="M0 0.2 C0.15 0.05, 0.35 0.1, 0.5 0.05 S0.85 0.0, 1 0.2 L1 1 L0 1 Z" />
            </clipPath>

            <clipPath id="eccentric-curve-clip-bottom" clipPathUnits="objectBoundingBox">
                <path d="M0 0 L1 0 L1 0.8 C0.75 0.2, 0.25 0.2, 0 0.8 Z" />
            </clipPath>

            </svg>
            {/* Starts where Projects ends (same offset as the negative margin
                above, minus 2px of overlap to hide the sub-pixel seam), so it
                only fills the area Projects doesn't reach. */}
            <div className={`absolute inset-x-0 top-[calc(clamp(150px,20vh,260px)-2px)] h-[40%] ${getProjectsBottomColor()}`} />
            <div className={`relative w-full ${ECCENTRIC_CLIP_CLASS} ${getBackgroundColor()} shadow-2xl pb-[clamp(100px,14vh,200px)] overflow-hidden`}>
                <div className={`w-full will-change-transform `}>
                    {/* <BackgroundBeams className="absolute inset-0" /> */}
                    <Parallax speed={6} className='w-full relative text-center pt-48'>
                        <GradientText className="text-balance text-8xl font-semibold leading-none tracking-tighter"
                            gradient={textGradient()} text="Awards and Certifications"/>
                    </Parallax>
                    <Parallax speed={6} className="relative z-10 pt-32 w-full">
                        <ThreeDCarousel
                        items={items}
                        autoRotate={true}
                        rotateInterval={4000}
                        cardHeight={500}
                        />
                    </Parallax>
                </div>
            </div>

            {/* Bottom curved transition: a Skills-colored layer sits behind an
                Awards-colored panel whose bottom is curved away, so the curve
                reveals the (contrasting) Skills color and flows into it. */}
            <div className="relative w-full h-[clamp(140px,18vh,260px)] -mt-px">
                <div className={`absolute inset-0 ${getSkillsColor()}`} />
                <div className={`absolute inset-0 ${getBottomBackgroundColor()} ${BOTTOM_CLIP_CLASS}`} />
            </div>

        </div>
    )
}