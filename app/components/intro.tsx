import {
  LinkedinLogoIcon,
  GithubLogoIcon,
  EnvelopeSimpleIcon,
  FileIcon,
} from "@phosphor-icons/react";

import { Image, Link, Button } from "@heroui/react";

import { useTheme } from "next-themes";
import GraphemeSplitter from 'grapheme-splitter';
import { TypeAnimation } from 'react-type-animation';

const splitter = new GraphemeSplitter();

export default function Info() {
    const { theme, setTheme } = useTheme();

    const getBackground = () => {
        if (theme === "dark") return "bg-black/50";
        if (theme === "surprise") return "bg-pink-300/50";
        return "bg-white/50";
    };

    const getBorderBackground = () => {
        if (theme === "dark") return "border-black/50";
        if (theme === "surprise") return "border-pink-300/50";
        return "border-white/50";
    };

    return (
        <div className="h-[400px] flex flex-col items-center justify-center h-full">
          <div className="flex flex-col items-center justify-center gap-4">
                <img
                src="/profile.jpeg"
                alt="Profile"
                className={`w-64 h-64 rounded-full border-4 ${getBorderBackground()} object-cover`}
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
            <div className="py-18 h-full w-[150vh] text-center rounded-xl">
                <TypeAnimation
                    splitter={(str) => splitter.splitGraphemes(str)}
                    className="text-5xl font-bold font-mono tracking-wider text-[#1bbc68] drop-shadow-[0_0_5px_#1bbc68] max-w-4xl bg-black leading-tight"
                    sequence={[
                    "Hi! I'm Sandilya Kambhampati, a student at Purdue University!",
                    2000,
                    // Telugu
                    'నమస్కారం! నేను పర్డ్యూ యూనివర్సిటీ విద్యార్థిని, శాండిల్య కంభంపాటి!',
                    2000,
                    // Mandarin Chinese 🇨🇳
                    '你好! 我是 Sandilya Kambhampati, 普渡大学的学生!', 
                    2000,
                    // Bulgarian 🇧🇬
                    'Здравейте! Аз съм Сандиля Камбампати, студент в Университета Пърдю!',
                    2000,
                    // Spanish 🇪🇸
                    '¡Hola! Soy Sandilya Kambhampati, ¡un estudiante de la Universidad de Purdue!',
                    2000,
                    // French 🇫🇷
                    'Bonjour! Je suis Sandilya Kambhampati, un étudiant à l\'Université Purdue!',
                    2000,
                    // Hindi 🇮🇳
                    'नमस्ते! मैं सन्धिल्य कम्भम्पाटी हूँ, पर्ड्यू विश्वविद्यालय का छात्र हूँ!',
                    2000
                ]}
                    style={{ fontSize: '2em' }}
                    repeat={Infinity}
                />
            </div>
        </div>
    )
}