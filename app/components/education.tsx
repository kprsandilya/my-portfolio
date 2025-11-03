import * as React from 'react'
import { useScroll, animated, useSpring } from '@react-spring/web'
import { useTheme } from "next-themes"
import { Parallax } from "react-scroll-parallax";
import styles from './styles.module.scss'

import EducationItems from './educationItems';

const X_LINES = 100

const PAGE_COUNT = 2

const INITIAL_WIDTH = 20

const SMOOTHING_FACTOR = 16

const SCROLLING_FACTOR = 1.5

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

    const [textStyles, textApi] = useSpring(() => ({
    y: '100%',
    }))

    const { scrollYProgress } = useScroll({
        onChange: ({ value: { scrollYProgress } }) => {
            if (scrollYProgress > 0.26) {
            textApi.start({ y: '0' })
            } else {
            textApi.start({ y: '100%' })
            }
        },
        default: {
            immediate: true,
        },
    })
  return (
    <Parallax className="pb-[20vh] pt-[15vh]" speed={-30}>
    <div className={styles.body}>
      <div className={`${styles.animated__layers} ${getBackgroundColors()}`}>
        <animated.div ref={barContainerRef} className={styles.bar__container}>
          {Array.from({ length: X_LINES }).map((_, i) => (
            <animated.div
              key={i}
              className={styles.bar}
              style={{
                width: scrollYProgress.to(scrollP => {
                  const percentilePosition = (i + 1) / X_LINES

                  const AdjustedScrollP = scrollP * SCROLLING_FACTOR

                  return INITIAL_WIDTH / 4 + 40 * Math.cos(((percentilePosition - AdjustedScrollP) * Math.PI) / 1.5) ** SMOOTHING_FACTOR
                }),
              }}
            />
          ))}
        </animated.div>
        <animated.div className={styles.bar__container__inverted}>
          {Array.from({ length: X_LINES }).map((_, i) => (
            <animated.div
              key={i}
              className={styles.bar}
              style={{
                width: scrollYProgress.to(scrollP => {
                  const percentilePosition = 1 - (i + 1) / X_LINES

                  const AdjustedScrollP = scrollP * SCROLLING_FACTOR

                  return INITIAL_WIDTH / 4 + 40 * Math.cos(((percentilePosition - AdjustedScrollP) * Math.PI) / 1.5) ** SMOOTHING_FACTOR
                }),
              }}
            />
          ))}
        </animated.div>
        <animated.div
            className={styles.dot}
            style={{
                clipPath: scrollYProgress.to(val => {
                    const startPoint = 0.1; 
                    const endPoint = 0.4; // New point: start disappearing before the end (1.0)
                    const growthFactor = 2; // Adjusted growth factor to fill the area
                    
                    // 1. Calculate growth: Progress from 0.2 to 0.95
                    const progressRange = endPoint - startPoint; // 0.75
                    
                    // 2. Map the scroll value (0 to 1) to the active range (0.2 to 0.95)
                    const activeProgress = Math.min(1, Math.max(0, (val - startPoint) / progressRange));
                    
                    // The circle radius shrinks at the end
                    const radius = activeProgress * 100;
                    
                    return `circle(${radius}%)`;
                }),
            }}>
          <h1 className={`${styles.title} ${getColors()} h-full`}>
            <span>
              <animated.span style={textStyles}>My</animated.span>
            </span>
            <span>
              <animated.span style={textStyles}>Educational Journey</animated.span>
            </span>
          </h1>

        </animated.div>
      </div>
        <div className="flex flex-col w-full h-[200vh] gap-8 py-150">
            <EducationItems className="justify-start pr-100 flex-1" /> 
            
            <EducationItems className="justify-end pl-100 flex-1" />
            
            <EducationItems className="justify-start pr-100 flex-1" />
            
            <EducationItems className="justify-end pl-100 flex-1" />
        </div>
      {new Array(PAGE_COUNT).fill(null).map((_, index) => (
        <div className={styles.full__page} key={index} />
      ))}
    </div>
    </Parallax>
  )
}