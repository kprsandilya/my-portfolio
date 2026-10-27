"use client";

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
  // Lets a parent measure the card's position (used to draw the roadmap).
  registerRef?: (el: HTMLDivElement | null) => void;
}

interface CourseItem {
  courseName: string;
  courseTitle: string;
  grade: string;
  css: string;
}

const EducationItems: React.FC<EducationItemsProps> = ({ className, listIndex, side, grade, registerRef }) => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

    const [open, set] = useState(false)

    const { theme, setTheme } = useTheme();

    const getColor = () => "var(--pf-chip)";

    // Text color for the "<grade> Classes" label on the closed card. It must
    // contrast with getColor() rather than inherit the section's text color.
    const getLabelColor = () => "var(--pf-term-fg)";

    const getItemColor = () => "color-mix(in srgb, var(--pf-raised) 80%, transparent)";

  const springApi = useSpringRef()
  // NOTE: `background` is intentionally NOT animated here. The closed state is a
  // solid color and the open state is a gradient, and react-spring cannot
  // interpolate between a solid color and a gradient (their parsed value arrays
  // have different lengths -> "The arity of each output value must be equal").
  // We switch it as a plain style instead.
  const { size, opacity: textOpacity } = useSpring({
    ref: springApi,
    config: config.stiff,
    from: { size: '20%', opacity: 1 },
    to: {
      size: open ? '100%' : '20%',
      opacity: open ? 0 : 1,
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

  const renderCourse = (item: CourseItem) => (
    <div className={styles.itemContent}>
      {/* Course Name & Title (Left Side) */}
      <div className={styles.courseDetails}>
        <h3 className={styles.courseName}>{item.courseName}</h3>
        <p className={styles.courseTitle}>{item.courseTitle}</p>
      </div>

      {/* Grade (Right Side) */}
      <span className={styles.courseGrade}>{item.grade}</span>
    </div>
  )

  // The row always keeps the height of the fully opened card: an invisible
  // copy of the open grid sits in the layout, and the real card is centered
  // on top of it. Opening and closing a card then happens inside a fixed
  // space, so the rest of the page doesn't jump.
  return (
    <div className={`${styles.wrapper} relative flex w-full ${className ?? ""}`}>
      <div aria-hidden="true" className={`${styles.container} invisible pointer-events-none`} style={{ width: '100%' }}>
        {selectedData.map((item) => (
          <div key={item.courseName} className={styles.item}>
            {renderCourse(item)}
          </div>
        ))}
      </div>

      {mounted && (
        <div
          className={`absolute inset-0 flex items-center ${className ?? ""}`}
          style={{ paddingLeft: 70, paddingRight: 70 }}
        >
          <animated.div
            ref={registerRef}
            style={{ width: size, background: open ? getItemColor() : getColor() }}
            className={styles.container}
            onClick={() => set(open => !open)}>

              <animated.div
                  style={{ opacity: textOpacity, color: getLabelColor() }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                  <span className="text-xl font-medium italic">{grade} Classes</span>
              </animated.div>

              {transition((style, item) => (
                <animated.div
                  className={styles.item}
                  style={{ ...style, background: item.css }}
                >
                  {renderCourse(item)}
                </animated.div>
              ))}
          </animated.div>
        </div>
      )}
    </div>
  )
}

export default EducationItems
