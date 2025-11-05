import { useTheme } from "next-themes"
import { GradientText } from '@/components/ui/shadcn-io/gradient-text';
import { SkillLevels } from './skillLevels';
import SkillLevelDisplay from "./skillLevelsBadges"
import { ParallaxProvider } from 'react-scroll-parallax';
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const ECCENTRIC_CLIP_CLASS = "underneath-curve-clip";

const CARD_DATA = [
  {
    id: 1,
    title: "Project Initiation",
    description: "Define scope and gather initial requirements."
  },
  {
    id: 2,
    title: "Design Phase",
    description: "Create mockups and component blueprints."
  },
  {
    id: 3,
    title: "Development Core",
    description: "Build out the main functionality and UI structure."
  },
  {
    id: 4,
    title: "Testing & QA",
    description: "Verify all features and fix identified bugs."
  },
  {
    id: 5,
    title: "Deployment Prep",
    description: "Optimize assets and configure production environment."
  },
  {
    id: 6,
    title: "Launch Day",
    description: "Monitor initial usage and system stability."
  },
];

export default function Awards() {
    const { theme, setTheme } = useTheme();

    const getBackgroundColor = () => {
        if (theme === "dark") return 'bg-[radial-gradient(circle_at_50%,_#FFD700_0%,_#1A001C_400px)]';
        if (theme === "surprise") return 'bg-[radial-gradient(circle_at_50%_500px,_#D69EBA_0%,_#BA5370_400px)]';
        return 'bg-[radial-gradient(circle_at_50%_500px,_#06beb6,_#006473_400px)]';
    };

    const textGradient = () => {
        if (theme === "dark") return 'linear-gradient(90deg, #48166cff 0%, #c31432 50%, #48166cff 100%)';
        if (theme === "surprise") return 'linear-gradient(90deg, #d5ec3cff 0%, #e866ccff 50%, #d5ec3cff 100%)';
        return 'linear-gradient(90deg, #A5B4FC 0%, #60A5FA 50%, #A5B4FC 100%)';
    };

    return (
            <ParallaxProvider>
            <div className="w-full relative">
                {/* <svg
                    width="0"
                    height="0"
                    className="absolute top-0 left-0 pointer-events-none"
                >

                <clipPath id="underneath-curve-clip" clipPathUnits="objectBoundingBox">
                    <path 
                        d="M0 0.2 
                        C0.25 0.0, 0.75 0.0, 1 0.2 
                        L1 1 
                        L0 1 
                        Z"
                    />
                </clipPath>

                </svg> */}
                <div className={`w-full ${getBackgroundColor()} ${ECCENTRIC_CLIP_CLASS} shadow-2xl`}>
                    <div className={`w-full will-change-transform `}>
                        {/* <BackgroundBeams className="absolute inset-0" /> */}
                        <div className="relative z-10 pr-24 pb-24 w-full">
                            <div className="grid grid-cols-5 divide-x-10 divide-double divide-yellow-500 lg:h-[720px] gap-4">
                                <div className="col-span-3 grid grid-rows-3 gap-4 justify-items-end pr-4">
                                    <div className="w-28/48 h-full flex justify-end border-fade-right-to-left">
                                        <div className="bg-gray-600 w-full h-[98%] text-white rounded-lg flex items-center justify-center text-2xl font-bold text-center">
                                            <Carousel className="w-full h-full">
                                                <CarouselContent className="h-full w-full">
                                                    {Array.from({ length: 5 }).map((_, index) => (
                                                        <CarouselItem key={index} className="lg:basis-1/3 h-full">
                                                            <div className="p-1 h-full">
                                                            <Card className="h-full">
                                                                <CardContent className="flex items-center justify-center p-6 h-full text-center">
                                                                <span className="text-3xl font-semibold">{index + 1}</span>
                                                                </CardContent>
                                                            </Card>
                                                            </div>
                                                        </CarouselItem>
                                                    ))}
                                                </CarouselContent>
                                                <CarouselPrevious /> 
                                            </Carousel>
                                        </div>
                                    </div>
                                    <div className="w-36/48 h-full flex justify-end border-fade-right-to-left">
                                        <div className="bg-gray-600 w-full h-[98%] text-white rounded-lg flex items-center justify-center text-2xl font-bold text-center">
                                            <Carousel className="w-full h-full">
                                                <CarouselContent className="h-full w-full">
                                                    {Array.from({ length: 5 }).map((_, index) => (
                                                        <CarouselItem key={index} className="lg:basis-1/4 h-full">
                                                            <div className="p-1 h-full">
                                                            <Card className="h-full">
                                                                <CardContent className="flex items-center justify-center p-6 h-full text-center">
                                                                <span className="text-3xl font-semibold">{index + 1}</span>
                                                                </CardContent>
                                                            </Card>
                                                            </div>
                                                        </CarouselItem>
                                                    ))}
                                                </CarouselContent>
                                                <CarouselPrevious /> 
                                            </Carousel>
                                        </div>
                                    </div>
                                    <div className="w-42/48 h-full flex justify-end border-fade-right-to-left">
                                        <div className="bg-gray-600 w-full h-[98%] text-white rounded-lg flex items-center justify-center text-2xl font-bold text-center">
                                            <Carousel className="w-full h-full">
                                                <CarouselContent className="h-full w-full">
                                                    {Array.from({ length: 5 }).map((_, index) => (
                                                        <CarouselItem key={index} className="lg:basis-1/5 h-full">
                                                            <div className="p-1 h-full">
                                                            <Card className="h-full">
                                                                <CardContent className="flex items-center justify-center p-6 h-full text-center">
                                                                <span className="text-3xl font-semibold">{index + 1}</span>
                                                                </CardContent>
                                                            </Card>
                                                            </div>
                                                        </CarouselItem>
                                                    ))}
                                                </CarouselContent>
                                                <CarouselPrevious /> 
                                            </Carousel>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-2 grid grid-cols-2 gap-4">
                                    
                                    <div className="col-span-1 flex flex-col gap-4">
                                        <div className="h-[10%] bg-red-500 text-white p-2 rounded-lg flex items-center justify-center text-xs">Top (10%)</div>
                                        
                                        <div className="h-[60%] bg-red-600 text-white p-2 rounded-lg flex items-center justify-center text-sm font-semibold">Middle (60%)</div>
                                        
                                        <div className="h-[30%] bg-red-700 text-white p-2 rounded-lg flex items-center justify-center text-xs">Bottom (30%)</div>
                                    </div>

                                    <div className="col-span-1 flex flex-col gap-4">
                                        <div className="h-1/2 bg-yellow-400 text-black p-2 rounded-lg flex items-center justify-center text-sm font-semibold">Internal Right Top (50%)</div>
                                        
                                        <div className="h-1/2 bg-yellow-500 text-black p-2 rounded-lg flex items-center justify-center text-sm font-semibold">Internal Right Bottom (50%)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </ParallaxProvider>
    )
}