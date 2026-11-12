"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

export type MarqueeImage = { src: string; alt: string };

export type ThreeDMarqueeProps = {
  images: MarqueeImage[];
  className?: string;
};

const COLUMNS = 5;
// The tilted grid looks empty with only a few photos, so the list is repeated
// until every column has at least this many tiles.
const MIN_PER_COLUMN = 5;

export const ThreeDMarquee = ({ images, className }: ThreeDMarqueeProps) => {
  const filled: MarqueeImage[] = [];
  if (images.length) {
    const target = Math.max(images.length, COLUMNS * MIN_PER_COLUMN);
    for (let i = 0; i < target; i++) filled.push(images[i % images.length]);
  }

  // Deal tiles across columns round-robin (tile i -> column i % 5), so a
  // repeated photo lands in a different column and row than its twin.
  const chunks = Array.from({ length: COLUMNS }, (_, colIndex) =>
    filled.filter((_, i) => i % COLUMNS === colIndex),
  );

  return (
    <div
      className={cn(
        "mx-auto block h-full overflow-hidden rounded-2xl max-sm:h-100",
        className,
      )}
    >
      <div className="flex h-full w-full items-center justify-center">
        <div className="size-[3000px] shrink-0 scale-50 sm:scale-75 lg:scale-100">
          <div
            style={{
              transform: "rotateX(55deg) rotateY(0deg) rotateZ(-45deg)",
            }}
            className="relative top-96 right-[80%] grid size-full origin-top-left grid-cols-5 gap-8 transform-3d"
          >
            {chunks.map((subarray, colIndex) => (
              <motion.div
                animate={{ y: colIndex % 2 === 0 ? 100 : -100 }}
                transition={{
                  duration: colIndex % 2 === 0 ? 10 : 15,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                key={colIndex + "marquee"}
                className="flex flex-col items-start gap-8"
              >
                <GridLineVertical className="-left-4" offset="80px" />
                {subarray.map((image, imageIndex) => (
                  <div className="relative w-full" key={imageIndex + image.src}>
                    <GridLineHorizontal className="-top-4" offset="20px" />
                    <motion.div
                      whileHover={{
                        y: -10,
                      }}
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                      }}
                      className="overflow-hidden rounded-lg ring ring-gray-950/5 hover:shadow-2xl"
                    >
                      {/* next/image serves a resized copy, so full-size phone
                          photos in the folder don't slow the page down. */}
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={970}
                        height={700}
                        sizes="(max-width: 640px) 300px, (max-width: 1024px) 450px, 600px"
                        className="aspect-[970/700] h-auto w-full object-cover"
                      />
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export type GridLineHorizontalProps = {
  className?: string;
  offset?: string;
};

const GridLineHorizontal = ({ className, offset }: GridLineHorizontalProps) => {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "1px",
          "--width": "5px",
          "--fade-stop": "90%",
          "--offset": offset || "200px", //-100px if you want to keep the line inside
          "--color-dark": "rgba(255, 255, 255, 0.2)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))]",
        "bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className,
      )}
    ></div>
  );
};

export type GridLineVerticalProps = {
  className?: string;
  offset?: string;
};

const GridLineVertical = ({ className, offset }: GridLineVerticalProps) => {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "5px",
          "--width": "1px",
          "--fade-stop": "90%",
          "--offset": offset || "150px", //-100px if you want to keep the line inside
          "--color-dark": "rgba(255, 255, 255, 0.2)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)]",
        "bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className,
      )}
    ></div>
  );
};

export { GridLineHorizontal, GridLineVertical };