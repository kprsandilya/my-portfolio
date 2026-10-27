import React from 'react';
import CurvedLoop from "@/components/ui/shadcn-io/curved-loop";
import { useThemeReady } from "./useThemeReady"
import { Divider } from "@heroui/react";
import { FaAws } from "react-icons/fa";
import { Truck, HeartPulse, CodeXml, GraduationCap, Landmark, Wrench } from "lucide-react";

type Icon = React.ComponentType<{ className?: string }>;

interface Role {
  name: string;
  icon: Icon;
  time: string;
  position: string;
  location: string;
  bullets: string[];
}

interface EarlierRole {
  name: string;
  icon: Icon;
  time: string;
  position: string;
}

// Roles and bullets from the resume.
const ROLES: Role[] = [
  {
    name: "Amazon Web Services (AWS)",
    icon: FaAws,
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
    icon: Truck,
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
    icon: HeartPulse,
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
    icon: CodeXml,
    time: "June 2024 — August 2024",
    position: "Software Development Intern",
    location: "Remote",
    bullets: [
      "Built a dynamic WordPress CMS for a UK archery organization to support easy updates and user engagement.",
      "Improved website structure, layout, and navigation for better usability, accessibility, and user experience.",
      "Implemented email management strategies to streamline customer communication and improve outreach.",
    ],
  },
];

// Older roles that aren't on the resume, shown together in one compact card.
const EARLIER_ROLES: EarlierRole[] = [
  {
    name: "Purdue University",
    icon: GraduationCap,
    time: "December 2023 — May 2024",
    position: "Undergraduate Data Science Researcher",
  },
  {
    name: "Bureau of Cyberspace and Digital Policy, U.S. Department of State",
    icon: Landmark,
    time: "June 2022 — July 2022",
    position: "Policy Intern",
  },
  {
    name: "Firestone",
    icon: Wrench,
    time: "June 2021 — July 2021",
    position: "Engineering Intern",
  },
];

const CARD_CLASSES = "rounded-xl border border-[var(--pf-border)] bg-[var(--pf-raised)]/90 p-6 text-[var(--pf-fg)] shadow-xl backdrop-blur-sm sm:p-8";

function IconBadge({ icon: IconComponent, small = false }: { icon: Icon; small?: boolean }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl bg-[var(--pf-bg-alt)] text-[var(--pf-accent)] shadow-inner ${
        small ? "h-11 w-11" : "h-16 w-16"
      }`}
    >
      <IconComponent className={small ? "h-6 w-6" : "h-9 w-9"} />
    </div>
  );
}

export default function Experience() {
    const { theme } = useThemeReady();

    // Background flows from the color Pictures fades into (top) down to the
    // color Projects starts with (bottom), so the section seams are invisible.
    const getBackground = () => 'bg-gradient-to-b from-[var(--pf-bg-alt)] to-[var(--pf-bg)]';

    // The marquee's own wrapper is a full screen tall; these overrides let it
    // size to the curve instead.
    const loopFit = "[&>div]:min-h-0 [&>div]:h-full";

    return (
        // Bottom padding leaves room for Projects, which tucks its curved top
        // up over the end of this section.
        <div className={`relative w-full overflow-hidden ${getBackground()} pb-72`}>

            {/* Decorative marquees behind the cards. Kept faint so the cards
                stay readable. */}
            <div className={`pointer-events-none absolute inset-0 z-10 opacity-20 ${loopFit}`} aria-hidden="true">
                <CurvedLoop
                    marqueeText="DEVELOPER PORTFOLIO"
                    speed={2}
                    direction="left"
                    curveAmount={-150}
                    customPathD="M-100,500 C300,1300 1140,-300 1540,500"
                    className="text-8xl text-[var(--pf-accent-2)]"
                    interactive={false}
                />
            </div>
            <div className={`pointer-events-none absolute inset-0 z-10 opacity-15 ${loopFit}`} aria-hidden="true">
                <CurvedLoop
                    marqueeText="DEVELOPER PORTFOLIO"
                    speed={2}
                    direction="left"
                    curveAmount={-150}
                    customPathD="M-100,1200 C1140,400 300,2000 1540,1200"
                    className="text-8xl text-[var(--pf-accent-2)]"
                    interactive={false}
                />
            </div>

            {/* Header: its own row, so the cards can never cover it. */}
            <div className={`relative z-20 pt-[12vw] ${loopFit}`}>
                <CurvedLoop
                    marqueeText="WORK EXPERIENCE"
                    speed={2}
                    direction="right"
                    curveAmount={150}
                    customPathD="M-100,50 Q720,-200 1540,50"
                    className="text-8xl text-[var(--pf-accent)]"
                    interactive={false}
                />
            </div>

            <div className="relative z-30 mx-auto mt-8 grid w-11/12 max-w-6xl gap-8 lg:grid-cols-2">
                {ROLES.map((role) => (
                    <div key={role.name} className={CARD_CLASSES}>
                        <div className="flex items-center gap-4">
                            <IconBadge icon={role.icon} />
                            <div className="font-light">
                                <h3 className="text-lg font-semibold sm:text-xl">{role.name}</h3>
                                <h4 className="text-sm sm:text-base">{role.position}</h4>
                                <h4 className="text-sm opacity-80">
                                    {role.time} · {role.location}
                                </h4>
                            </div>
                        </div>
                        <Divider className="my-4" />
                        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
                            {role.bullets.map((bullet) => (
                                <li key={bullet}>{bullet}</li>
                            ))}
                        </ul>
                    </div>
                ))}

                <div className={`${CARD_CLASSES} lg:col-span-2`}>
                    <h3 className="mb-4 text-lg font-semibold sm:text-xl">Earlier experience</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                        {EARLIER_ROLES.map((role) => (
                            <div key={role.name} className="flex items-start gap-3">
                                <IconBadge icon={role.icon} small />
                                <div className="text-sm font-light">
                                    <p className="font-semibold">{role.name}</p>
                                    <p>{role.position}</p>
                                    <p className="opacity-80">{role.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
