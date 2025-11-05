import ThreeDCarousel, { ThreeDCarouselItem } from "@/components/ui/ThreeDCarousel";
import { BackgroundBeams } from "@/components/ui/shadcn-io/background-beams";
import { useTheme } from "next-themes"
import { GradientText } from '@/components/ui/shadcn-io/gradient-text';

import { ParallaxBanner, Parallax, ParallaxProvider } from 'react-scroll-parallax';

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
const BOTTOM_CLIP_CLASS = "eccentric-curve-clip-bottom";

export default function Awards() {
    const { theme, setTheme } = useTheme();

    const getBackgroundColor = () => {
        if (theme === "dark") return 'bg-gradient-to-b from-[#8B6508] to-[#4A3203]';
        if (theme === "surprise") return 'bg-gradient-to-b from-[#FF7F50] to-[#FF1493]';
        return 'bg-gradient-to-b from-[#A5E5E7] to-[#A0C5C7]';
    };

    const getBottomBackgroundColor = () => {
        if (theme === "dark") return 'bg-gradient-to-b from-[#4A3203] to-[#2C1E00]'; 
        if (theme === "surprise") return 'bg-gradient-to-b from-[#FF1493] to-[#800080]';
        return 'bg-gradient-to-b from-[#A0C5C7] to-[#A4C1D4]'; 
    };

    const textGradient = () => {
        if (theme === "dark") return 'linear-gradient(90deg, #48166cff 0%, #c31432 50%, #48166cff 100%)';
        if (theme === "surprise") return 'linear-gradient(90deg, #d5ec3cff 0%, #e866ccff 50%, #d5ec3cff 100%)';
        return 'linear-gradient(90deg, #A5B4FC 0%, #60A5FA 50%, #A5B4FC 100%)';
    };

    return (
        <ParallaxProvider>
        <div className="w-full relative -mt-[200px]">
            <svg
                width="0"
                height="0"
                className="absolute top-0 left-0 pointer-events-none"
            >

            <clipPath id="eccentric-curve-clip" clipPathUnits="objectBoundingBox">
            <path 
                d="M0 0.2 
                C0.15 0.05, 0.35 0.1, 0.5 0.05
                S0.85 0.0, 1 0.2 
                L1 1 
                L0 1 
                Z"
            />
            </clipPath>

            <clipPath id="eccentric-curve-clip-bottom" clipPathUnits="objectBoundingBox">
                <path 
                    d="M0 0 L1 0 
                    L1 0.8 
                    C0.75 0.2, 0.25 0.2, 0 0.8 
                    Z"
                />
            </clipPath>

            </svg>
            <Parallax className={`pb-[200px] -mt-[30vh] w-full`} speed={30}>
                <div className={`w-full ${ECCENTRIC_CLIP_CLASS} ${getBackgroundColor()} shadow-2xl `}>
                    <div className={`w-full will-change-transform `}>
                        {/* <BackgroundBeams className="absolute inset-0" /> */}
                        <div className='w-full relative text-center pt-48'>
                            <GradientText className="text-balance text-8xl font-semibold leading-none tracking-tighter" 
                                gradient={textGradient()} text="Awards and Certifications"/>
                        </div>
                        <div className="relative z-10 pt-32 w-full">
                            <ThreeDCarousel 
                            items={items}
                            autoRotate={true}
                            rotateInterval={4000}
                            cardHeight={500}
                            />
                        </div>
                    </div>
                </div>

                <div 
                className={`w-full h-[300px] ${getBottomBackgroundColor()} ${BOTTOM_CLIP_CLASS}`}
                >
                </div>

            </Parallax>
        </div>
        </ParallaxProvider>
    )
}