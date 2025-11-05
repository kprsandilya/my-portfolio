import { useTheme } from "next-themes"
import { GradientText } from '@/components/ui/shadcn-io/gradient-text';
import { SkillLevels } from './skillLevels';
import SkillLevelDisplay from "./skillLevelsBadges"
import { ParallaxProvider } from 'react-scroll-parallax';

const ECCENTRIC_CLIP_CLASS = "underneath-curve-clip";

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
            <div className="w-full relative -mt-[200px]">
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
                <div className={`-mt-[45vh] w-full ${getBackgroundColor()} ${ECCENTRIC_CLIP_CLASS} shadow-2xl `}>
                    <div className={`w-full will-change-transform `}>
                        {/* <BackgroundBeams className="absolute inset-0" /> */}
                        <div className='w-full relative text-center pt-36'>
                            <GradientText className="text-balance text-8xl font-semibold leading-none tracking-tighter" 
                                gradient={textGradient()} text="Skills and Frameworks"/>
                        </div>
                        <div className="relative z-10 pt-32 w-full">
                            <SkillLevelDisplay levelData={SkillLevels.EXPERT}/>
                        </div>
                    </div>
                </div>
            </div>
            </ParallaxProvider>
    )
}