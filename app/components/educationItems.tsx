import React, { useState } from 'react'
import {
  useTransition,
  useSpring,
  useChain,
  config,
  animated,
  useSpringRef,
} from '@react-spring/web'

import { useTheme } from "next-themes"

import data from './educationItemsData'
import styles from './styles.module.scss'

interface EducationItemsProps {
  className?: string; // Make it optional, as you don't always use it
  listIndex: 1 | 2 | 3 | 4;
  side: "right" | "left";
  grade: "Freshman" | "Sophomore" | "Junior" | "Senior";
}

interface CourseItem {
  courseName: string;
  courseTitle: string;
  grade: string;
  css: string;
}

const EducationItems: React.FC<EducationItemsProps> = ({ className, listIndex, side, grade }) => {
    const [open, set] = useState(false)

    const { theme, setTheme } = useTheme();

    const getColor = () => {
        // Main text/foreground color
        if (theme === "dark") {
            if (side == 'left') {
                return "rgba(48, 48, 48, 1)"; // gray-200
            }
            return "rgba(48, 48, 48, 1)";
        }
        if (theme === "surprise") {
            if (side == 'left') {
                return "rgb(219, 39, 119, 1)"; // gray-200
            }
            return "rgb(219, 39, 119, 1)";
        }
        if (side == 'left') {
            return "rgb(31, 41, 55)"; // gray-200
        }
        return "rgb(31, 41, 55)";
    };

    const getItemColor = () => {
        // This returns the item/card background GRADIENT
        
        // --- Dark Theme Gradients ---
        if (theme === "dark") {
            // Purdue Black with 80% opacity for the darker side
            const purdueBlack = "rgba(207, 185, 145, 0.8)"; 
            
            // Purdue Old Gold with 30% opacity for the lighter/accent side
            // This allows the black theme to show through while providing a gold sheen.
            const purdueGold = "rgba(55, 58, 54, 0.3)"; 
            
            if (side === 'left') {
                // Left item starts with the Gold accent and fades into the Black
                // Gradient from top-left to bottom-right (135deg)
                return `linear-gradient(135deg, ${purdueGold} 0%, ${purdueBlack} 100%)`; 
            }
            
            // Right item starts with Black and fades into the Gold accent 
            // This provides a mirrored, alternating look across the screen.
            return `linear-gradient(135deg, ${purdueBlack} 0%, ${purdueGold} 100%)`;
        }

        // --- Surprise Theme Gradients (Vibrant) ---
        if (theme === "surprise") {
            const surpriseStart = "rgba(254, 249, 195, 0.8)"; // Light Yellow (yellow-100)
            const surpriseEnd = "rgba(253, 230, 138, 0.3)";   // Slightly Deeper Yellow (yellow-300)
            
            if (side === 'left') {
                // Gradient from top-left to bottom-right
                return `linear-gradient(135deg, ${surpriseStart} 0%, ${surpriseEnd} 100%)`;
            }
            // Right side: Gradient from bottom-right to top-left (subtle flip)
            return `linear-gradient(135deg, ${surpriseEnd} 0%, ${surpriseStart} 100%)`;
        }
        
        // --- Default Theme Gradients (Light/Professional) ---
        const defaultStart = "rgba(255, 255, 255, 0.8)"; // Pure White
        const defaultEnd = "rgba(243, 244, 246, 0.3)";   // Very Light Gray (gray-100)

        if (side === 'left') {
            // Subtle vertical highlight
            return `linear-gradient(135deg, ${defaultEnd} 0%, ${defaultStart} 100%)`; 
        }
        // Right side: Subtle vertical lowlight
        return `linear-gradient(135deg, ${defaultStart} 0%, ${defaultEnd} 100%)`;
    };

  const springApi = useSpringRef()
  const { size, opacity: textOpacity, ...rest } = useSpring({
    ref: springApi,
    config: config.stiff,
    from: { size: '20%', opacity: 1, background: getItemColor() },
    to: {
      size: open ? '100%' : '20%',
      background: open ? getItemColor() : getColor(),
      opacity: open ? 0: 1
    },
  })

  const selectedData = data[listIndex];

  const transApi = useSpringRef()
  const transition = useTransition(open ? selectedData : [], {
    ref: transApi,
    trail: 400 / selectedData.length,
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0 },
  })

  // This will orchestrate the two animations above, comment the last arg and it creates a sequence
  useChain(open ? [springApi, transApi] : [transApi, springApi], [
    0,
    open ? 0.1 : 0.6,
  ])

  return (
    <div className={`${styles.wrapper} flex w-full ${className}`}>
      
      <animated.div
        style={{ ...rest, width: size }}
        className={styles.container}
        onClick={() => set(open => !open)}>

          <animated.div
              style={{ opacity: textOpacity }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
              <span className="text-xl font-medium italic">{grade} Classes</span>
          </animated.div>

          {transition((style, item) => (
            <animated.div
              className={styles.item}
              style={{ ...style, background: item.css }}
            >
                  <div className={styles.itemContent}>
                  {/* Course Name & Title (Left Side) */}
                  <div className={styles.courseDetails}>
                      <h3 className={styles.courseName}>{item.courseName}</h3>
                      <p className={styles.courseTitle}>{item.courseTitle}</p>
                  </div>
                  
                  {/* Grade (Right Side) */}
                  <span className={styles.courseGrade}>{item.grade}</span>
              </div>
              </animated.div>
          ))}
      </animated.div>
    </div>
  )
}

export default EducationItems
