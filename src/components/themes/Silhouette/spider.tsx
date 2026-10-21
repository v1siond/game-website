'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import type { Project } from '@/lib/cv/content'
import { ProjectList } from '@/components/cv/ProjectList'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import { usePreview } from '@/themes/PreviewContext'
import { ProjectCard } from './cards'
import { SHADE } from './palette'
import shade from './shade.module.css'

// His projects lie under webbing in the dark, the giant spider of the silhouette forest: when the
// section comes into view the spider drops in at the top corner, its legs reach across, and the
// webbing is pulled off the cards one after the other before it climbs back out (once). A lantern
// pool of warm light follows the visitor's pointer over the section, held to the screen while it
// scrolls by. Reduced motion and the World Select preview show the cards uncovered.
//
// Animated: the spider, four legs, one veil per project (once), the lantern.

type Hunt = 'wait' | 'reach' | 'pull' | 'retreat' | 'done'

const HUNT_AT: ReadonlyArray<readonly [Hunt, number]> = [
  ['reach', 0],
  ['pull', 700],
  ['retreat', 1250],
  ['done', 2000],
]

const SPIDER: Record<Hunt, string> = {
  wait: '',
  reach: shade.spiderIn,
  pull: shade.spiderIn,
  retreat: shade.spiderGone,
  done: 'hidden',
}

const LEG: Record<Hunt, string> = {
  wait: '',
  reach: shade.legReach,
  pull: shade.legPull,
  retreat: '',
  done: '',
}

const UNCOVERED: Record<Hunt, boolean> = { wait: false, reach: false, pull: true, retreat: true, done: true }

// Each leg from the body at (150, 30): hip, knee, foot.
const LEGS = ['M150 30 Q110 -6 70 20 L18 70', 'M150 30 Q104 10 64 52 L34 120', 'M150 30 Q120 36 100 76 L84 150', 'M150 30 Q150 60 136 92 L130 156']

function Spider({ hunt }: { hunt: Hunt }) {
  return (
    <div className={`pointer-events-none absolute -right-4 top-0 z-30 w-48 sm:w-72 ${shade.spider} ${SPIDER[hunt]}`} aria-hidden="true">
      <svg viewBox="0 0 200 160" className="w-full overflow-visible" focusable="false">
        <line x1={150} y1={-400} x2={150} y2={20} stroke={SHADE.black} strokeWidth={1.2} />
        {LEGS.map((d, index) => (
          <g key={d} className={`${shade.leg} ${LEG[hunt]}`} style={{ '--i': index } as CSSProperties}>
            <path d={d} fill="none" stroke={SHADE.black} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ))}
        <ellipse cx={164} cy={20} rx={24} ry={18} fill={SHADE.black} />
        <ellipse cx={146} cy={32} rx={13} ry={11} fill={SHADE.black} />
      </svg>
    </div>
  )
}

function Webbing({ index, uncovered }: { index: number; uncovered: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-10 bg-[color:var(--sh-black)] ${shade.veil} ${uncovered ? shade.veilOff : ''}`}
      style={{ '--i': index } as CSSProperties}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full" focusable="false">
        <path d="M0 0 L100 100 M100 0 L0 100 M50 0 V100 M0 50 H100 M20 30 Q50 40 80 30 M20 70 Q50 60 80 70" stroke={SHADE.fog} strokeWidth={0.4} fill="none" />
      </svg>
    </div>
  )
}

function Lantern() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-clip" aria-hidden="true">
      <div className="sticky top-0 h-screen">
        <div
          className={`absolute left-1/2 top-1/2 -ml-[30vmin] -mt-[30vmin] h-[60vmin] w-[60vmin] rounded-full bg-[radial-gradient(closest-side,var(--sh-rim),transparent)] opacity-10 ${shade.lantern}`}
        />
      </div>
    </div>
  )
}

export function SpiderProjects({ projects }: { projects: Project[] }) {
  const { shade: words } = useLabels()
  const preview = usePreview()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.1 })
  const [hunt, setHunt] = useState<Hunt>('wait')

  useEffect(() => {
    if (!triggered) return
    if (preview || prefersReducedMotion()) {
      setHunt('done')
      return
    }
    const timers = HUNT_AT.map(([next, at]) => window.setTimeout(() => setHunt(next), at))
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [triggered, preview])

  const uncovered = UNCOVERED[hunt]

  return (
    <div ref={ref} className="relative">
      <Lantern />
      <Spider hunt={hunt} />
      <p className="relative mb-4 text-center text-sm italic tracking-wider text-[color:var(--sh-muted)]">{words.lightHint}</p>
      <ProjectList
        projects={projects}
        className={`relative ${MASONRY_LIST}`}
        itemClassName={MASONRY_ITEM}
        renderProject={(slot) => (
          <div className="relative overflow-hidden">
            <ProjectCard {...slot} />
            <Webbing index={projects.indexOf(slot.project)} uncovered={uncovered} />
          </div>
        )}
      />
    </div>
  )
}
