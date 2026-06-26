import ThreeDCarousel, { ThreeDCarouselItem } from "@/components/ui/ThreeDCarousel";
import { BackgroundBeams } from "@/components/ui/shadcn-io/background-beams";
import { useThemeReady } from "./useThemeReady"
import { GradientText } from '@/components/ui/shadcn-io/gradient-text';
import { Parallax } from 'react-scroll-parallax';

const items: ThreeDCarouselItem[] = [
  {
    id: 1,
    title: "6th SENSE Safety System",
    brand: "FireCat Group",
    description: "AI-driven smart uniform tech for law enforcement, military & firefighters.",
    tags: ["Safety", "Military", "AI Sensors", "Monitoring"],
    imageUrl: "/profile.jpeg",
    link: "/projects/firecat"
  },
    {
    id: 2,
    title: "6th SENSE Safety System",
    brand: "FireCat Group",
    description: "AI-driven smart uniform tech for law enforcement, military & firefighters.",
    tags: ["Safety", "Military", "AI Sensors", "Monitoring"],
    imageUrl: "/profile.jpeg",
    link: "/projects/firecat"
  },
    {
    id: 3,
    title: "6th SENSE Safety System",
    brand: "FireCat Group",
    description: "AI-driven smart uniform tech for law enforcement, military & firefighters.",
    tags: ["Safety", "Military", "AI Sensors", "Monitoring"],
    imageUrl: "/profile.jpeg",
    link: "/projects/firecat"
  }
];

const ECCENTRIC_CLIP_CLASS = "eccentric-curve-clip";

export default function Awards() {
    const { theme, setTheme } = useThemeReady();

    // Top color matches Projects' bottom; bottom color matches the Skills
    // section that follows, so Awards blends seamlessly between the two.
    const getBackgroundColor = () => {
        if (theme === "dark") return 'bg-gradient-to-b from-[#241427] to-[#1A001C]';
        if (theme === "surprise") return 'bg-gradient-to-b from-[#F0CC95] to-[#BA5370]';
        return 'bg-gradient-to-b from-[#86A8E7] to-[#006473]';
    };

    // The bottom curved panel is the same solid color as the Skills section, so
    // the bottom curve reveals a matching color (a seamless transition).
    const getBottomBackgroundColor = () => {
        if (theme === "dark") return 'bg-[#1A001C]';
        if (theme === "surprise") return 'bg-[#BA5370]';
        return 'bg-[#006473]';
    };

    const textGradient = () => {
        if (theme === "dark") return 'linear-gradient(90deg, #48166cff 0%, #c31432 50%, #48166cff 100%)';
        if (theme === "surprise") return 'linear-gradient(90deg, #d5ec3cff 0%, #e866ccff 50%, #d5ec3cff 100%)';
        return 'linear-gradient(90deg, #A5B4FC 0%, #60A5FA 50%, #A5B4FC 100%)';
    };

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

            </svg>
            <div className={`w-full ${ECCENTRIC_CLIP_CLASS} ${getBackgroundColor()} shadow-2xl pb-[clamp(100px,14vh,200px)] overflow-hidden`}>
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

            {/* Flat same-color block that continues straight into the Skills
                section below (no bottom curve -> nothing for a notch to show
                through). */}
            <div
            className={`w-full h-[clamp(120px,16vh,240px)] ${getBottomBackgroundColor()} -mt-px`}
            >
            </div>

        </div>
    )
}