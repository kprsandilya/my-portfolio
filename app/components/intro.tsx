import {
  LinkedinLogoIcon,
  GithubLogoIcon,
  EnvelopeSimpleIcon,
  FileIcon,
} from "@phosphor-icons/react";

import { Image, Link, Button } from "@heroui/react";

import { useThemeReady } from "./useThemeReady";
import GraphemeSplitter from 'grapheme-splitter';
import { TypeAnimation } from 'react-type-animation';

const splitter = new GraphemeSplitter();

const GREETING_CLASSES = "text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold font-mono tracking-wider text-[var(--pf-prompt)] drop-shadow-[0_0_5px_var(--pf-prompt)] max-w-4xl bg-[var(--pf-term)] leading-tight";

const GREETINGS = [
    "Hi! I'm Sandilya Kambhampati, a student at Purdue University!",
    // Telugu
    'నమస్కారం! నేను పర్డ్యూ యూనివర్సిటీ విద్యార్థిని, శాండిల్య కంభంపాటి!',
    // Mandarin Chinese
    '你好! 我是 Sandilya Kambhampati, 普渡大学的学生!',
    // Bulgarian
    'Здравейте! Аз съм Сандиля Камбампати, студент в Университета Пърдю!',
    // Spanish
    '¡Hola! Soy Sandilya Kambhampati, ¡un estudiante de la Universidad de Purdue!',
    // French
    "Bonjour! Je suis Sandilya Kambhampati, un étudiant à l'Université Purdue!",
    // Hindi
    'नमस्ते! मैं सन्धिल्य कम्भम्पाटी हूँ, पर्ड्यू विश्वविद्यालय का छात्र हूँ!',
];

export default function Info() {
    const { theme, setTheme } = useThemeReady();

    const getBackground = () => "bg-[var(--pf-raised)]/70 text-[var(--pf-fg)]";

    const getBorderBackground = () => "border-[var(--pf-accent)]/60";

    return (
        <div className="h-[400px] flex flex-col items-center justify-center h-full">
          <div className="flex flex-col items-center justify-center gap-4">
                <img
                src="/profile.jpeg"
                alt="Profile"
                className={`w-44 h-44 sm:w-64 sm:h-64 rounded-full border-4 ${getBorderBackground()} object-cover`}
                />
                <div className="mx-auto mb-4 flex justify-center gap-4 sm:gap-8">
                    <Button
                    as={Link}
                    isIconOnly={true}
                    variant="solid"
                    className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center shadow-xl rounded-xl ${getBackground()}`}
                    href="https://www.linkedin.com/in/kprsandilya/"
                    target="_blank"
                    >
                    <LinkedinLogoIcon size={36} />
                    </Button>
                    <Button
                    as={Link}
                    isIconOnly={true}
                    variant="solid"
                    className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center shadow-xl rounded-xl ${getBackground()}`}
                    href="https://github.com/kprsandilya/"
                    target="_blank"
                    >
                    <GithubLogoIcon size={36} />
                    </Button>
                    <Button
                    as={Link}
                    isIconOnly={true}
                    variant="solid"
                    className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center shadow-xl rounded-xl ${getBackground()}`}
                    href="mailto: kprsandilya@gmail.com"
                    target="_blank"
                    >
                    <EnvelopeSimpleIcon size={36} />
                    </Button>
                    <Button
                    as={Link}
                    isIconOnly={true}
                    variant="solid"
                    className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center shadow-xl rounded-xl ${getBackground()}`}
                    href="/Resume.pdf"
                    target="_blank"
                    >
                    <FileIcon size={36} />
                    </Button>
                </div>
            </div>
            <div className="py-12 sm:py-18 h-full w-full max-w-[150vh] px-4 sm:px-6 text-center rounded-xl">
                {/* Every greeting is rendered invisibly in the same grid cell as
                    the typing text, so the box is always as tall as the longest
                    greeting. Without this, the box grows and shrinks as lines
                    wrap, and the whole page below jumps up and down. */}
                <div className="grid">
                    {GREETINGS.map((greeting) => (
                        <div key={greeting} aria-hidden="true" className="invisible col-start-1 row-start-1">
                            <span className={GREETING_CLASSES}>
                                {greeting}|
                            </span>
                        </div>
                    ))}
                    <div className="col-start-1 row-start-1">
                        <TypeAnimation
                            splitter={(str) => splitter.splitGraphemes(str)}
                            className={GREETING_CLASSES}
                            sequence={GREETINGS.flatMap((greeting) => [greeting, 2000])}
                           
                            repeat={Infinity}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}