import React from 'react';
import CurvedLoop from "@/components/ui/shadcn-io/curved-loop";
import { useThemeReady } from "./useThemeReady"
import { Image, Divider } from "@heroui/react";
import { Parallax } from "react-scroll-parallax";

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
    const { theme, setTheme } = useThemeReady();

    // Background flows from the color Pictures fades into (top) down to the
    // color Projects starts with (bottom), so the section seams are invisible.
    const getBackground = () => {
        if (theme === "dark") return 'bg-gradient-to-b from-[#200210] to-[#121B21]';

        if (theme === "surprise") return 'bg-gradient-to-b from-[#FFDBBB] to-[#FFB69B]';

        return `bg-gradient-to-b from-[#00B9B3] to-[#91EAE4]`;
    };

    // Roles and bullets from the resume. Older roles that aren't on the
    // resume keep their dates but have no bullets yet.
    const comapny_info: {
      name: string;
      logo: string;
      time: string;
      position: string;
      location?: string;
      bullets: string[];
    }[] = [
    {
      name: "Amazon Web Services (AWS)",
      logo: "profile.jpeg",
      time: "May 2026 — August 2026",
      position: "Cloud Consultant Intern",
      location: "Arlington, Virginia",
      bullets: [
        "Designed and developed a cloud-native geospatial tile delivery API on Amazon ECS Fargate, Amazon S3, and Amazon Aurora, serving over 1 billion detections with sub-second response times for 100+ concurrent users.",
        "Engineered an AI-powered analytics interface to monitor API usage and analyze overall system performance.",
        "Developed a pipeline that regenerates map tiles as detections enter Amazon Aurora, enabling real-time API data.",
      ],
    },
    {
      name: "Cummins Inc.",
      logo: "profile.jpeg",
      time: "July 2025 — December 2025",
      position: "Software Engineering Intern",
      location: "West Lafayette, Indiana",
      bullets: [
        "Developed a company-specific transformer in Python to interpret customer messages and retrieve relevant products.",
        "Created auditing dashboards and automations in Jira that streamlined intake workflows and improved efficiency by 40%.",
        "Conducted audits and built internal company pages to improve the usability and accessibility of resources.",
      ],
    },
    {
      name: "Indiana State Department of Health",
      logo: "profile.jpeg",
      time: "May 2025 — July 2025",
      position: "Data Science Intern",
      location: "Indianapolis, Indiana",
      bullets: [
        "Created an address lookup system that automated 150,000+ data entries, running on an Apache server containerized with Docker.",
        "Used Selenium to enter thousands of lab details into the National Electronic Disease Surveillance System (NEDSS).",
      ],
    },
    {
      name: "Texavi",
      logo: "profile.jpeg",
      time: "June 2024 — August 2024",
      position: "Software Development Intern",
      location: "Remote",
      bullets: [
        "Built a dynamic WordPress CMS for a UK archery organization to support easy updates and user engagement.",
        "Improved website structure, layout, and navigation for better usability, accessibility, and user experience.",
        "Implemented email management strategies to streamline customer communication and improve outreach.",
      ],
    },
    {
      name: "Purdue University",
      logo: "profile.jpeg",
      time: "December 2023 — May 2024",
      position: "Undergraduate Data Science Researcher",
      bullets: [],
    },
    {
      name: "Bureau of Cyberspace and Digital Policy, U.S. Department of State",
      logo: "profile.jpeg",
      time: "June 2022 — July 2022",
      position: "Policy Intern",
      bullets: [],
    },
    {
      name: "Firestone",
      logo: "profile.jpeg",
      time: "June 2021 — July 2021",
      position: "Engineering Intern",
      bullets: [],
    },
  ];

    return (
        <div className={`relative lg:min-h-[2900px] w-full ${getBackground()} overflow-hidden`}>

            <div className={`${commonClasses} z-10 opacity-90`}>
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

            <div className={`${commonClasses} z-20 opacity-70`}>
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

            <div className={`${commonClasses} z-20 opacity-50`}>
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

            <div className={`${commonClasses} z-20 opacity-30`}>
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
            <div className="relative top-[-50px] overflow-x-visisble mx-auto w-11/12 overflow-y-visible sm:w-2/3">
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
                            {company.location ? ` · ${company.location}` : ""}
                            </h4>
                        </div>
                        </div>
                        {company.bullets.length > 0 && (
                            <>
                            <Divider className="mb-2" />
                            <ul className="list-disc space-y-1 pl-5 text-sm">
                                {company.bullets.map((bullet) => (
                                    <li key={bullet}>{bullet}</li>
                                ))}
                            </ul>
                            </>
                        )}
                    </div>
                    </Parallax>
                ))}
            </div>
        </div>
        </div>
    );
}