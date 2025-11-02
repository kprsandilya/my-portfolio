import {
  LinkedinLogoIcon,
  GithubLogoIcon,
  EnvelopeSimpleIcon,
  FileIcon,
} from "@phosphor-icons/react";

import { Image, Link, Button } from "@heroui/react";

import { useTheme } from "next-themes";

export default function Info() {
    const { theme, setTheme } = useTheme();

    const getBackground = () => {
        if (theme === "dark") return "bg-black/50";
        if (theme === "surprise") return "bg-pink-300/50";
        return "bg-white/50";
    };

    return (
        <div className="h-[400px] flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-4">
              <img
              src="/profile.jpg"
              alt="Profile"
              className="w-64 h-64 rounded-full border-4 border-white"
              />
              <div className="mx-auto mb-4 flex justify-center gap-8">
                <Button
                as={Link}
                isIconOnly={true}
                variant="solid"
                className={`flex h-14 w-14 items-center justify-center shadow-xl rounded-xl ${getBackground()}`}
                href="https://www.linkedin.com/in/kprsandilya/"
                target="_blank"
                >
                <LinkedinLogoIcon size={44} />
                </Button>
                <Button
                as={Link}
                isIconOnly={true}
                variant="solid"
                className={`flex h-14 w-14 items-center justify-center shadow-xl rounded-xl ${getBackground()}`}
                href="https://github.com/kprsandilya/"
                target="_blank"
                >
                <GithubLogoIcon size={44} />
                </Button>
                <Button
                as={Link}
                isIconOnly={true}
                variant="solid"
                className={`flex h-14 w-14 items-center justify-center shadow-xl rounded-xl ${getBackground()}`}
                href="mailto: kprsandilya@gmail.com"
                target="_blank"
                >
                <EnvelopeSimpleIcon size={44} />
                </Button>
                <Button
                as={Link}
                isIconOnly={true}
                variant="solid"
                className={`flex h-14 w-14 items-center justify-center shadow-xl rounded-xl ${getBackground()}`}
                href="/resume.pdf"
                target="_blank"
                >
                <FileIcon size={44} />
                </Button>
            </div>
          </div>
        </div>
    )
}