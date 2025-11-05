import { useTheme } from "next-themes";
import { NewHoleBackground } from '@/components/animate-ui/components/backgrounds/newhole';

export default function Header() {
  const { theme, setTheme } = useTheme();

  const getHoleInner = () => {
    if (theme === "dark") return "transparent";
    if (theme === "surprise") return "transparent";
    return "transparent";
  };

  const getHoleOuter = () => {
    if (theme === "dark") return "black";
    if (theme === "surprise") return "white";
    return "white";
  };

  const getHoleBlob = () => {
    if (theme === "dark") return "#a900ff";
    if (theme === "surprise") return "#000000";
    return "#9fff047a";
  };

  return (
    <div className={`relative w-full h-full ${theme === "surprise" ? "bg-pink-500" : ""}`}>
      <NewHoleBackground
        className={`absolute inset-0 flex items-center justify-center ${
          theme === "surprise" ? "" : ""
        }`}
        holeInnerColor={getHoleInner()}
        holeOuterColor={getHoleOuter()}
        blobColor={getHoleBlob()}
      />
    </div>
  );
}
