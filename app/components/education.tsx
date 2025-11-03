import * as React from 'react'
import { useScroll, animated, useSpring } from '@react-spring/web'
import { useTheme } from "next-themes"
import { Parallax } from "react-scroll-parallax";
import styles from './styles.module.scss'
import { HighlightText } from "@/components/ui/shadcn-io/highlight-text";

import EducationItems from './educationItems';

const X_LINES = 100

const PAGE_COUNT = 2

const INITIAL_WIDTH = 20

const SMOOTHING_FACTOR = 128

const SCROLLING_FACTOR = 0.9

export default function Education() {
    const containerRef = React.useRef<HTMLDivElement>(null!)
    const barContainerRef = React.useRef<HTMLDivElement>(null!)

    const { theme, setTheme } = useTheme();

    const getColors = () => {
        if (theme === "dark") return 'bg-gradient-to-r from-gray-700 to-black';

        if (theme === "surprise") return 'bg-gradient-to-r from-pink-500 to-yellow-300';
        
        return 'bg-gradient-to-r from-indigo-400 to-cyan-400';
    };

    const getBackgroundColors = () => {
        if (theme === "dark") return 'bg-gray-900/50'; 
        if (theme === "surprise") return 'bg-pink-300/50';
        return 'bg-[#D4F0F3]/50';
    };

    const getTextColors = () => {
        if (theme === "dark") return 'text-gray-200'; 
        if (theme === "surprise") return 'text-gray-900';
        return 'text-gray-900';
    };

    const [textStyles, textApi] = useSpring(() => ({
    y: '100%',
    }))

    const { scrollYProgress } = useScroll({
        onChange: ({ value: { scrollYProgress } }) => {
            if (scrollYProgress > 0.22 && scrollYProgress < 0.6) {
            textApi.start({ y: '0' })
            } else {
            textApi.start({ y: '100%' })
            }
        },
        default: {
            immediate: true,
        },
    })

    const SCROLL_LIMIT = 0.75; // 75%

    // Map the 0 to 0.75 scroll range to 0 to 1.0, and clamp it.
    const limitedScrollProgress = scrollYProgress.to([0, SCROLL_LIMIT], [0, 1], 'clamp');

    const [circleStyles] = useSpring(() => ({
        // Map scroll progress (0.1 to 0.4) to a scale factor (0 to 10)
        scale: scrollYProgress.to([0.1, 0.4], [0, 15], 'clamp'),
        // Move the scale and clipPath logic here
    }))

    const [barFadeStyles] = useSpring(() => ({
      // Start fade at 70% scroll, end it at 80% scroll
      opacity: limitedScrollProgress.to([0.5, 0.8], [1, 0], 'clamp'),
  }));

  return (
    //<Parallax className="pb-[20vh] pt-[15vh]" speed={-30}>
    <div className={styles.body}>
      <div className={`${styles.animated__layers} ${getBackgroundColors()}`}>
        <animated.div ref={barContainerRef} className={styles.bar__container} style={barFadeStyles}>
          {Array.from({ length: X_LINES }).map((_, i) => (
            <animated.div
              key={i}
              className={styles.bar}
              style={{
                width: limitedScrollProgress.to(scrollP => {
                  const percentilePosition = (i + 1) / X_LINES

                  const AdjustedScrollP = scrollP * SCROLLING_FACTOR

                  return INITIAL_WIDTH / 4 + 40 * Math.cos(((percentilePosition - AdjustedScrollP) * Math.PI) / 1.5) ** SMOOTHING_FACTOR
                }),
              }}
            />
          ))}
        </animated.div>
        <animated.div className={styles.bar__container__inverted } style={barFadeStyles}>
          {Array.from({ length: X_LINES }).map((_, i) => (
            <animated.div
              key={i}
              className={styles.bar}
              style={{
                width: limitedScrollProgress.to(scrollP => {
                  const percentilePosition = 1 - (i + 1) / X_LINES

                  const AdjustedScrollP = scrollP * SCROLLING_FACTOR

                  return INITIAL_WIDTH / 4 + 40 * Math.cos(((percentilePosition - AdjustedScrollP) * Math.PI) / 1.5) ** SMOOTHING_FACTOR
                }),
              }}
            />
          ))}
        </animated.div>

        <animated.div
          className={`${styles.dot_visual} ${getColors()}`} 
          style={{
              transform: circleStyles.scale.to(s => `translate(-50%, -50%) scale(${s})`),
              opacity: circleStyles.scale.to([0, 0.5, 10], [0, 1, 1]) 
          }}
          >
                
        </animated.div>
        <div className={styles.content_overlay}>
            <h1 className={`${styles.title} bg-transparent h-full`}>
                <span>
                    <animated.span style={textStyles}>My</animated.span>
                </span>
                <span>
                    <animated.span style={textStyles}>Educational Journey</animated.span>
                </span>
            </h1>
        </div>
      </div>
        <div className="flex flex-col w-full h-[260vh] gap-4 py-180 relative overflow-hidden">
            <div className="absolute top-[139vh] right-[43vh] w-0 h-230 origin-top-left rotate-100 border-l border-l-4 border-dashed border-white/60"></div>

            <div className="absolute top-[154.75vh] left-[44vh] w-0 h-229 origin-top-left -rotate-98 border-l border-l-4 border-dashed border-white/60"></div>

            <div className="absolute top-[173vh] right-[43vh] w-0 h-230 origin-top-left rotate-100 border-l border-l-4 border-dashed border-white/60"></div>

            <div className={`font-serif text-4xl  pb-24 ${getTextColors()} z-20 max-w-7xl mx-auto text-center leading-tight`}>
                I am currently a Purdue University student pursuing a double major in Computer Science and Data Science, complemented by minors in Mathematics and Statistics, maintaining highest excellence with a   
                <div className='pl-4'></div>
                <HighlightText 
                  text="3.98 GPA"
                  inView={true}
                  className="font-semibold"
                  transition={{ duration: 1.0, ease: "easeOut" }}
                />
                .
            </div>
            <EducationItems className="justify-start pr-100 flex-1" listIndex={1} side={'left'} grade='Freshman' /> 
            
            <EducationItems className="justify-end pl-100 flex-1" listIndex={2} side={'right'} grade='Sophomore' />
            
            <EducationItems className="justify-start pr-100 flex-1" listIndex={3} side={'left'} grade='Junior' />
            
            <EducationItems className="justify-end pl-100 flex-1" listIndex={4} side={'right'} grade='Senior' />
        </div>
      {new Array(PAGE_COUNT).fill(null).map((_, index) => (
        <div className={styles.full__page} key={index} />
      ))}
    </div>
    //</Parallax>
  )
}