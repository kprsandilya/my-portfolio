import React from 'react';
import CurvedLoop from "@/components/ui/shadcn-io/curved-loop";
import { useTheme } from "next-themes"
import { Image, Divider } from "@heroui/react";
import { Parallax, ParallaxProvider  } from "react-scroll-parallax";

// Define a simple StraightLoop for contrast
const StraightLoop = (props: any) => (
  <CurvedLoop
    {...props}
    curveAmount={0} // Setting curveAmount to 0 makes it straight
    customPathD="M-100,60 H1540" // Straight horizontal line
  />
);

export default function Experience() {
    const commonClasses = "absolute inset-0 w-full h-full";
    const { theme, setTheme } = useTheme();

    const getBackground = () => {
        if (theme === "dark") return 'bg-gradient-to-b from-[#200210] to-[#200210]';

        if (theme === "surprise") return 'bg-gradient-to-b from-[#FFDBBB] to-[#FFDBBB]';
        
        return `bg-gradient-to-b from-[#00B9B3] to-[#00B9B3]`;
    };

      const comapny_info = [
    {
      name: "Cummins Inc.",
      logo: "profile.jpeg",
      time: "June 2025 — August 2025",
      position: "Software Engineering Intern",
      description:
        "Placeholder.",
    },
    {
      name: "Indiana State Department of Health",
      logo: "profile.jpeg",
      time: "May 2024 — August 2024",
      position: "Viral Hepatitis Intern",
      description:
        "Placeholder.",
    },
    {
      name: "Purdue University",
      logo: "profile.jpeg",
      time: "December 2023 — May 2024",
      position: "Undergraduate Data Science Researcher",
      description:
        "Placeholder.",
    },
    {
      name: "Bureau of Cyberspace and Digital Policy, U.S. Department of State",
      logo: "profile.jpeg",
      time: "June 2022 — July 2022",
      position: "Policy Intern",
      description:
        "Placeholder.",
    },
    {
      name: "Texavi",
      logo: "profile.jpeg",
      time: "June 2021 — July 2021",
      position: "Software Development Intern",
      description:
        "Placeholder.",
    },
    {
      name: "Firestone",
      logo: "profile.jpeg",
      time: "June 2021 — July 2021",
      position: "Engineering Intern",
      description:
        "Placeholder.",
    },
  ];

    return (
        <div className={`relative min-h-[320vh] w-full ${getBackground()} overflow-hidden`}>

            <div className={`${commonClasses} z-10 opacity-30`}>
            <CurvedLoop
                marqueeText="WORK EXPERIENCE"
                speed={4}
                direction="right"
                curveAmount={150}
                customPathD="M-100,50 Q720,-200 1540,50"
                className="text-8xl text-green-500"
                interactive={false}
            />
            </div>

            <div className={`${commonClasses} z-20 opacity-50`}>
            <CurvedLoop
                marqueeText="DEVELOPER PORTFOLIO"
                speed={4}
                direction="left"
                curveAmount={-150}
                customPathD="M-100,500 C300,1300 1140,-300 1540,500"
                className="text-8xl text-indigo-400"
                interactive={false}
            />
            </div>

            <div className={`${commonClasses} z-20 opacity-70`}>
            <CurvedLoop
                marqueeText="DEVELOPER PORTFOLIO"
                speed={4}
                direction="left"
                curveAmount={-150}
                customPathD="M-100,1200 C1140,400 300,2000 1540,1200"
                className="text-8xl text-indigo-400"
                interactive={false}
            />
            </div>

            <div className={`${commonClasses} z-20 opacity-90`}>
            <CurvedLoop
                marqueeText="DEVELOPER PORTFOLIO"
                speed={4}
                direction="left"
                curveAmount={-150}
                customPathD="M-100,1700 Q720,1950 1540,1700"
                className="text-8xl text-indigo-400"
                interactive={false}
            />
            </div>

        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
            <div className="-mt-[10vh] overflow-x-visisble mx-auto w-11/12 overflow-y-visible sm:w-2/3">
            <ParallaxProvider>
                {comapny_info.map((company) => (
                    <Parallax key={company.name} scale={[1, 1.3]}>
                    <div
                        className="mb-16 rounded-xl border border-foreground bg-slate-200 p-8 shadow-xl dark:bg-slate-700"
                        key={company.name}
                    >
                        <div className="flex h-36 w-full items-center px-4">
                        <Image
                            isZoomed
                            src={`/company_logos/${company.logo}`}
                            alt={`Logo for ${company.name}`}
                            width={80}
                        />
                        <Divider className="mx-4 h-full" orientation="vertical" />
                        <div className="pb-b font-light">
                            <h3 className="font-semibold sm:text-xl">{company.name}</h3>
                            <h4 className="text-sm font-light sm:text-lg">
                            {company.position}
                            </h4>
                            <h4 className="text-sm font-light sm:text-lg">
                            {company.time}
                            </h4>
                        </div>
                        </div>
                        <Divider className="mb-2" />
                        <p className="text-sm">{company.description}</p>
                    </div>
                    </Parallax>
                ))}
            </ParallaxProvider>
            </div>
        </div>
        </div>
    );
}