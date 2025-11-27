import SkateboardScrollScene from "./SkateboardScrollScene";
import { useRef } from "react";

export default function Skate() {
  const ref = useRef(null);

  return (
    <div ref={ref} className="relative">
      {/* Sticky 3D Canvas */}
      <div className="sticky top-0 h-screen z-30">
        <SkateboardScrollScene targetRef={ref} />
      </div>

      {/* Sections below still create scroll */}
      <section className="h-screen flex justify-center items-center text-6xl font-bold">
        🛹 My Hobbies
      </section>

      <section className="h-screen flex justify-center items-center text-4xl">
        🎸 Guitar
      </section>

      <section className="h-screen flex justify-center items-center text-4xl">
        📸 Photography
      </section>

      <section className="h-screen flex justify-center items-center text-4xl">
        🏄‍♂️ Skating
      </section>

      <section className="h-screen flex justify-center items-center text-4xl">
        🎮 Gaming
      </section>
    </div>
  );
}

