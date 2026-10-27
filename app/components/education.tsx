"use client";

import * as React from 'react'
import { animated, useSpring } from '@react-spring/web'
import { useTheme } from "next-themes"
import styles from './styles.module.scss'
import { HighlightText } from "@/components/ui/shadcn-io/highlight-text";

import EducationItems from './educationItems';
import SectionKicker from './sectionKicker';

const X_LINES = 60

// Largest width (in px) a bar reaches; bars are scaled down from this so the
// animation runs on the compositor (transform) instead of triggering layout.
const BAR_MAX = 45

const INITIAL_WIDTH = 20

const SMOOTHING_FACTOR = 72

const SCROLLING_FACTOR = 1.5

// Fades the Education band in over its first 220px.
const EDGE_FADE = 'linear-gradient(to bottom, transparent 0, #000 220px)'

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

// Smooth Catmull-Rom spline through the measured card centers -> a winding
// "road". Coordinates are in pixels relative to the content container, so the
// path stays sharp and rescales whenever we re-measure on resize.
function buildRoadPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return ''
  const d = [`M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`]
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d.push(
      `C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
    )
  }
  return d.join(' ')
}

const YEARS = [
  { grade: 'Freshman', side: 'left', listIndex: 1 },
  { grade: 'Sophomore', side: 'right', listIndex: 2 },
  { grade: 'Junior', side: 'left', listIndex: 3 },
  { grade: 'Senior', side: 'right', listIndex: 4 },
] as const

export default function Education() {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    const containerRef = React.useRef<HTMLDivElement>(null!)
    const contentRef = React.useRef<HTMLDivElement>(null!)
    const introRef = React.useRef<HTMLDivElement>(null!)
    const cardRefs = React.useRef<(HTMLDivElement | null)[]>([])

    const { theme } = useTheme();

    const getColors = () => 'bg-gradient-to-r from-[var(--pf-bg-alt)] to-[var(--pf-bg-deep)]';

    const getBackgroundColors = () => 'bg-[var(--pf-bg-alt)]/60';

    const getTextColors = () => 'text-[var(--pf-fg)]';

    const getRoadColor = () => 'var(--pf-accent)';

    // Single spring that tracks how far the section has scrolled through the
    // viewport (0 = just entering at the bottom, 1 = fully scrolled past the
    // top). Every visual is derived from this, so timing is tied to the
    // section itself rather than the whole page.
    const [{ p }, pApi] = useSpring(() => ({ p: 0 }))

    // Title reveal: slides in as the section reaches the viewport and out as
    // it leaves. Tied to section progress so it never fires "off time".
    const titleY = p.to((v: number) => {
        if (v < 0.14) return '100%'
        if (v < 0.24) return `${(1 - (v - 0.14) / 0.1) * 100}%`
        if (v < 0.46) return '0%'
        if (v < 0.56) return `${((v - 0.46) / 0.1) * 100}%`
        return '100%'
    })

    const barOpacity = p.to((v: number) => (v <= 0.5 ? 1 : clamp01(1 - (v - 0.5) / 0.2)))

    React.useEffect(() => {
        let raf = 0
        const update = () => {
            raf = 0
            const el = containerRef.current
            if (!el) return
            const rect = el.getBoundingClientRect()
            const vh = window.innerHeight || 1
            const progress = clamp01((vh - rect.top) / (vh + rect.height))
            pApi.start({ p: progress, immediate: true })
        }
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(update)
        }
        update()
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onScroll)
        return () => {
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', onScroll)
            if (raf) cancelAnimationFrame(raf)
        }
    }, [pApi, mounted])

    // Measure the intro + each card and rebuild the road. Re-runs on resize so
    // the connectors always line up regardless of screen size.
    const [roadPath, setRoadPath] = React.useState('')
    const [roadPoints, setRoadPoints] = React.useState<{ x: number; y: number }[]>([])

    React.useEffect(() => {
        if (!mounted) return
        const measure = () => {
            const content = contentRef.current
            if (!content) return
            const base = content.getBoundingClientRect()
            const points: { x: number; y: number }[] = []
            if (introRef.current) {
                const r = introRef.current.getBoundingClientRect()
                points.push({ x: r.left + r.width / 2 - base.left, y: r.bottom - base.top })
            }
            // Anchor each node to the card's *inner* edge (the side facing the
            // road) so the marker sits next to the button instead of being
            // hidden behind its center.
            const NODE_GAP = 16
            cardRefs.current.forEach((el, i) => {
                if (!el) return
                const r = el.getBoundingClientRect()
                const x = YEARS[i].side === 'left'
                    ? r.right - base.left + NODE_GAP
                    : r.left - base.left - NODE_GAP
                points.push({ x, y: r.top + r.height / 2 - base.top })
            })
            setRoadPoints(points)
            setRoadPath(buildRoadPath(points))
        }

        measure()
        // Re-measure after fonts/layout settle.
        const timers = [120, 400, 1000].map((t) => setTimeout(measure, t))
        window.addEventListener('resize', measure)
        // Each year's row is sized by its course text, so the cards can move
        // whenever fonts load or text re-wraps, even without a window resize.
        // Re-measure on any size change of the section so the dots follow.
        let cancelled = false
        const observer = new ResizeObserver(() => measure())
        if (contentRef.current) observer.observe(contentRef.current)
        document.fonts?.ready.then(() => {
            if (!cancelled) measure()
        })
        return () => {
            cancelled = true
            observer.disconnect()
            window.removeEventListener('resize', measure)
            timers.forEach(clearTimeout)
        }
    }, [mounted, theme])

    if (!mounted) {
        return <div className={styles.body} />;
    }

  return (
    <div ref={containerRef} className={styles.body}>
      {/* The band fades in from the top instead of starting with a hard edge. */}
      <div
        className={`${styles.animated__layers} ${getBackgroundColors()} pointer-events-none`}
        style={{ maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }}
      >
        <animated.div
          className={styles.bar__container}
          style={{ opacity: barOpacity }}
        >
          {Array.from({ length: X_LINES }).map((_, i) => (
            <animated.div
              key={i}
              className={styles.bar}
              style={{
                transformOrigin: 'right center',
                transform: p.to((scrollP: number) => {
                  const percentilePosition = (i + 1) / X_LINES
                  const adjustedScrollP = scrollP * SCROLLING_FACTOR
                  const widthPx =
                    INITIAL_WIDTH / 4 +
                    40 *
                      Math.cos((((percentilePosition - adjustedScrollP) * Math.PI) / 1.5)) **
                        SMOOTHING_FACTOR
                  return `scaleX(${widthPx / BAR_MAX})`
                }),
              }}
            />
          ))}
        </animated.div>
        <animated.div
          className={styles.bar__container__inverted}
          style={{ opacity: barOpacity }}
        >
          {Array.from({ length: X_LINES }).map((_, i) => (
            <animated.div
              key={i}
              className={styles.bar}
              style={{
                transformOrigin: 'left center',
                transform: p.to((scrollP: number) => {
                  const percentilePosition = 1 - (i + 1) / X_LINES
                  const adjustedScrollP = scrollP * SCROLLING_FACTOR
                  const widthPx =
                    INITIAL_WIDTH / 4 +
                    40 *
                      Math.cos((((percentilePosition - adjustedScrollP) * Math.PI) / 1.5)) **
                        SMOOTHING_FACTOR
                  return `scaleX(${widthPx / BAR_MAX})`
                }),
              }}
            />
          ))}
        </animated.div>

        <animated.div
          className={`${styles.dot_visual} ${getColors()}`}
          style={{
            transform: p.to((v: number) => {
              const s = v <= 0.08 ? 0 : v >= 0.3 ? 15 : ((v - 0.08) / (0.3 - 0.08)) * 15
              return `translate(-50%, -50%) scale(${s})`
            }),
            opacity: p.to((v: number) => clamp01((v - 0.08) / 0.05)),
          }}
        />
      </div>

      <div ref={contentRef} className="relative z-10 w-full">
        <SectionKicker index="01" path="education" className="relative z-20 pt-24" />
        <h1 className={`${styles.title} relative z-20 bg-transparent`}>
            <span>
                <animated.span style={{ y: titleY }}>My</animated.span>
            </span>
            <span>
                <animated.span style={{ y: titleY }}>Educational Journey</animated.span>
            </span>
        </h1>

        {/* Winding "road" that connects the years. Measured in px and rebuilt
            on resize, so it scales with the layout. */}
        <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full" aria-hidden="true">
          {roadPath && (
            <path
              d={roadPath}
              fill="none"
              style={{ stroke: getRoadColor() }}
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray="2 16"
              opacity={0.75}
            />
          )}
          {roadPoints.map((pt, i) =>
            i === 0 ? null : (
              <g key={i}>
                <circle cx={pt.x} cy={pt.y} r={11} style={{ fill: getRoadColor() }} opacity={0.9} />
                <circle cx={pt.x} cy={pt.y} r={4.5} fill="#ffffff" />
              </g>
            )
          )}
        </svg>

        <div
          ref={introRef}
          className={`font-serif text-3xl md:text-4xl pb-16 ${getTextColors()} relative z-20 max-w-5xl mx-auto px-6 text-center leading-tight`}
        >
            I am a Purdue University student double majoring in Computer Science (Machine Intelligence) and Data Science with minors in Mathematics and Statistics, now also pursuing an M.S. in Computer Science, with a{' '}
            <HighlightText
              text="3.98 GPA"
              inView={true}
              className="font-semibold"
              transition={{ duration: 1.0, ease: "easeOut" }}
            />
            .
        </div>

        <div className="relative z-10 flex flex-col gap-[14vh] py-[10vh]">
          {YEARS.map((year, i) => (
            <EducationItems
              key={year.grade}
              className={year.side === 'left' ? 'justify-start' : 'justify-end'}
              listIndex={year.listIndex}
              side={year.side}
              grade={year.grade}
              registerRef={(el) => {
                cardRefs.current[i] = el
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
