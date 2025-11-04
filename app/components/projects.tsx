import { PinContainer } from '@/components/ui/shadcn-io/3d-pin';
import { useTheme } from 'next-themes'
import GlitchText from "@/components/ui/shadcn-io/glitch-text";
import { LineShadowText } from '@/components/ui/shadcn-io/line-shadow-text';
import { GradientText } from '@/components/ui/shadcn-io/gradient-text';

const PIN_DATA = [
  {
    id: 1,
    title: "/react.dev",
    href: "https://react.dev",
    heading: "React Documentation",
    description: "The library for web and native user interfaces.",
    bgClass: "from-blue-500 via-indigo-500 to-sky-500",
  },
  {
    id: 2,
    title: "/nextjs.org",
    href: "https://nextjs.org",
    heading: "Next.js Framework",
    description: "The React Framework for Production.",
    bgClass: "from-gray-700 via-black to-gray-900",
  },
  {
    id: 3,
    title: "/ui.shadcn.io",
    href: "https://ui.shadcn.com",
    heading: "shadcn/ui Components",
    description: "Beautifully designed components built with Radix UI and Tailwind CSS.",
    bgClass: "from-violet-500 via-purple-500 to-blue-500",
  },
  {
    id: 4,
    title: "/tailwindcss.com",
    href: "https://tailwindcss.com",
    heading: "Tailwind CSS",
    description: "A utility-first CSS framework for rapid UI development.",
    bgClass: "from-green-500 via-teal-500 to-cyan-500",
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
    
const textGradient = () => {
    // 1. Dark Theme: Maximum luminosity using white and bright cool tones.
    if (theme === "dark") return 'linear-gradient(90deg, #48166cff 0%, #c31432 50%, #48166cff 100%)';

    // 2. Surprise Theme: Anchored by white and cool blue against the warm background.
    if (theme === "surprise") return 'linear-gradient(90deg, #d5ec3cff 0%, #e866ccff 50%, #d5ec3cff 100%)';

    // 3. Default Theme: Uses Teal and Violet for strong color contrast against Peach/Cyan.
    return 'linear-gradient(90deg, #A5B4FC 0%, #60A5FA 50%, #A5B4FC 100%)';
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
        <div className={`w-full ${getColors()} ${CLIP_CLASS}`}>
            <div className='w-full relative text-center pt-32'>
                <h1 className="text-balance text-8xl font-semibold leading-none tracking-tighter">
                    <LineShadowText 
                    className="italic" 
                    shadowColor={textShadow()}
                    textColor={textColor()}
                    >
                    Research
                    </LineShadowText>
                    {' & '}
                    <GradientText className="text-balance text-8xl font-semibold leading-none tracking-tighter" 
                        gradient={textGradient()} text="Projects"/>
                </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 pt-4 pb-4 items-stretch justify-items-center">
                
                {PIN_DATA.map((pin) => (
                // Each PinContainer needs to be wrapped in a div for consistent grid layout
                <div key={pin.id} className="flex h-[40rem] w-full items-center justify-center">
                    <PinContainer
                    title={pin.title}
                    href={pin.href}
                    >
                    <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem]">
                        <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
                        {pin.heading}
                        </h3>
                        <div className="text-base !m-0 !p-0 font-normal">
                        <span className="text-slate-500">
                            {pin.description}
                        </span>
                        </div>
                        {/* Dynamic background color class */}
                        <div 
                        className={`flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br ${pin.bgClass}`} 
                        />
                    </div>
                    </PinContainer>
                </div>
                ))}  
            </div>
        </div>
    </div>
  );
}