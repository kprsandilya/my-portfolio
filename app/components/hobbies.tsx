import SkateboardScrollScene from "./SkateboardScrollScene";

export default function Skate() {
  return (
    <div className="relative">
      <SkateboardScrollScene />

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
