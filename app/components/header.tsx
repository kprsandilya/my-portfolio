import { useTheme } from "next-themes";
import { NewHoleBackground } from '@/components/animate-ui/components/backgrounds/newhole';

export default function Header() {
  const { theme } = useTheme();

  const holeColors = theme === 'surprise'
    ? { inner: '#ffeb3b', outer: '#ff4081' }
    : { inner: '#ffffff', outer: '#000000' };

  return (
    <div className={`relative w-full h-[100vh] ${theme === "surprise" ? "bg-pink-500" : ""}`}>
      <NewHoleBackground
        className={`absolute inset-0 flex items-center justify-center rounded-xl ${
          theme === "surprise" ? "" : ""
        }`}
        holeColors={holeColors}
      />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <img
            src="/profile.jpg"
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white"
            />
            <div className="flex gap-4">
            <button className="px-4 py-2 rounded bg-white text-black hover:bg-gray-200">Follow</button>
            <button className="px-4 py-2 rounded bg-white text-black hover:bg-gray-200">Message</button>
            </div>
        </div>
    </div>
  );
}
