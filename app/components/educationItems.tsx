"use client";

import React, { useId, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

import data from './educationItemsData'

interface EducationItemsProps {
  className?: string;
  listIndex: 1 | 2 | 3 | 4;
  side: "right" | "left";
  grade: "Freshman" | "Sophomore" | "Junior" | "Senior";
  years: string;
  // Lets a parent measure the card's position (used to draw the roadmap).
  registerRef?: (el: HTMLDivElement | null) => void;
}

// Same card surface as the Experience section, so the two read as one site.
const CARD =
  "rounded-xl border border-[var(--pf-border)] bg-[var(--pf-raised)]/90 text-[var(--pf-fg)] shadow-xl backdrop-blur-sm";

const EASE = [0.22, 1, 0.36, 1] as const

// Senior-year titles carry "(in progress)"; that is shown as a tag instead.
const cleanTitle = (title: string) => title.replace(/\s*\(in progress\)\s*$/i, '')

const EducationItems: React.FC<EducationItemsProps> = ({ className, listIndex, side, grade, years, registerRef }) => {
  const [open, setOpen] = useState(false)
  const reduceMotion = useReducedMotion()
  const panelId = useId()

  const courses = data[listIndex]
  const inProgress = courses.every((c) => c.grade === '—')
  const yearNumber = String(listIndex).padStart(2, '0')

  return (
    <div className={`relative flex w-full px-6 md:px-[70px] ${className ?? ''}`}>
      <motion.div
        ref={registerRef}
        className={`${CARD} group/card relative w-full overflow-hidden md:w-[min(600px,46%)] ${
          open ? 'ring-1 ring-[var(--pf-accent)]/40' : 'hover:-translate-y-0.5 hover:shadow-2xl'
        } transition-[box-shadow,transform] duration-300`}
      >
        {/* Accent strip on the side that faces the road */}
        <span
          aria-hidden="true"
          className={`absolute inset-y-0 w-1 bg-gradient-to-b from-[var(--pf-accent)] via-[var(--pf-accent-2)] to-[var(--pf-accent-3)] transition-opacity duration-300 ${
            side === 'left' ? 'right-0' : 'left-0'
          } ${open ? 'opacity-100' : 'opacity-50 group-hover/card:opacity-100'}`}
        />

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full cursor-pointer items-center gap-4 px-6 py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--pf-accent)] sm:px-8 sm:py-6"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 font-mono text-xs text-[var(--pf-fg-muted)] sm:text-sm">
              <span className="text-[var(--pf-accent)]">{yearNumber}</span>
              <span aria-hidden="true" className="opacity-40">/</span>
              <span>{years}</span>
              {inProgress && (
                <span className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-[var(--pf-prompt)]/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-[var(--pf-prompt)] sm:text-xs">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--pf-prompt)]" />
                  now
                </span>
              )}
            </div>
            <h3 className="mt-1 font-serif text-2xl leading-tight sm:text-3xl">
              {grade} <span className="italic text-[var(--pf-fg-muted)]">Year</span>
            </h3>

            {/* Closed: a peek at the course codes. Collapses away when opened. */}
            <AnimatePresence initial={false}>
              {!open && (
                <motion.div
                  key="peek"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-1.5 pt-3">
                    {courses.map((c) => (
                      <span
                        key={c.courseName}
                        className="rounded-md bg-[var(--pf-bg-alt)] px-2 py-0.5 font-mono text-[11px] text-[var(--pf-fg-muted)] sm:text-xs"
                      >
                        {c.courseName}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex shrink-0 flex-col items-center gap-1">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${
                open
                  ? 'rotate-180 border-[var(--pf-accent)] bg-[var(--pf-accent)] text-[var(--pf-on-accent)]'
                  : 'border-[var(--pf-border)] bg-[var(--pf-bg-alt)] text-[var(--pf-fg)] group-hover/card:border-[var(--pf-accent)] group-hover/card:text-[var(--pf-accent)]'
              }`}
            >
              <ChevronDown className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-mono text-[10px] text-[var(--pf-fg-muted)] sm:text-xs">
              {courses.length} classes
            </span>
          </div>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={panelId}
              key="panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.45, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="border-t border-[var(--pf-border)]/70 px-3 pb-4 pt-2 sm:px-5">
                <motion.ul
                  initial="hidden"
                  animate="shown"
                  variants={{ shown: { transition: { staggerChildren: reduceMotion ? 0 : 0.05, delayChildren: 0.1 } } }}
                >
                  {courses.map((course) => {
                    const ongoing = course.grade === '—'
                    return (
                      <motion.li
                        key={course.courseName}
                        variants={{
                          hidden: { opacity: 0, y: 8 },
                          shown: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
                        }}
                        className="group/row flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-[var(--pf-bg-alt)]/70 sm:gap-4"
                      >
                        <span
                          className="w-[5.75rem] shrink-0 rounded-md px-2 py-1 text-center font-mono text-xs font-semibold sm:w-24 sm:text-sm"
                          style={{
                            color: `var(${course.accent})`,
                            background: `color-mix(in srgb, var(${course.accent}) 14%, transparent)`,
                          }}
                        >
                          {course.courseName}
                        </span>
                        <span className="min-w-0 flex-1 text-sm leading-snug sm:text-base">
                          {cleanTitle(course.courseTitle)}
                        </span>
                        {ongoing ? (
                          <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-[var(--pf-prompt)] sm:text-xs">
                            in progress
                          </span>
                        ) : (
                          <span className="w-9 shrink-0 text-right font-mono text-base font-bold text-[var(--pf-accent)] sm:text-lg">
                            {course.grade}
                          </span>
                        )}
                      </motion.li>
                    )
                  })}
                </motion.ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default EducationItems
