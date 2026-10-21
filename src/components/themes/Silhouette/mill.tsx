'use client'

import type { Project } from '@/lib/cv/content'
import { ProjectList } from '@/components/cv/ProjectList'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { ProjectCard } from './cards'
import { SHADE } from './palette'
import shade from './shade.module.css'
import world from './world.module.css'

// His projects on the floor of a dark sawmill, the first of the machine levels past the forest: a rail
// runs over the section with a circular saw blade spinning in its carriage, and when the section comes
// into view the carriage runs the rail once from one end to the other, the way the saws sweep a room
// in the game. Girders stand in the dark behind the cards, and a lantern pool of warm light follows the
// visitor's pointer over the floor, held to the screen while it scrolls by.
//
// The carriage rides a track 4rem short of the rail (the carriage's width), so translating the track
// by its own full width brings the carriage to the rail's far end.
//
// Animated: the carriage (once), the blade, the lantern.

// A saw blade: a disc with 16 hooked teeth and a hub, centred on (0, 0).
const BLADE = (() => {
  const teeth = 16
  const step = (Math.PI * 2) / teeth
  const at = (angle: number, radius: number) => `${(Math.cos(angle) * radius).toFixed(1)} ${(Math.sin(angle) * radius).toFixed(1)}`
  const points = Array.from({ length: teeth }, (_, index) => `${at(index * step, 22)} L${at(index * step + step * 0.7, 28)} L${at((index + 1) * step, 22)}`)
  return `M${points.join(' L')} Z M-4 0 A4 4 0 1 0 4 0 A4 4 0 1 0 -4 0 Z`
})()

function SawRail({ running }: { running: boolean }) {
  return (
    <div className="relative mb-6 h-16" aria-hidden="true">
      <div className="absolute inset-x-0 top-3 h-2 bg-[color:var(--sh-black)]" />
      <div className={`absolute left-0 right-16 top-0 h-16 ${shade.carriage} ${running ? shade.carriageRun : ''}`}>
        <svg viewBox="-32 -14 64 64" className="h-16 w-16 overflow-visible" focusable="false">
          <rect x={-10} y={-14} width={20} height={14} fill={SHADE.black} />
          <line x1={0} y1={0} x2={0} y2={18} stroke={SHADE.black} strokeWidth={3} />
          <g transform="translate(0 22)">
            <path d={BLADE} fill={SHADE.black} fillRule="evenodd" stroke={SHADE.fog} strokeWidth={0.8} className={shade.blade} />
          </g>
        </svg>
      </div>
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

export function MillProjects({ projects }: { projects: Project[] }) {
  const { shade: words } = useLabels()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.05 })

  return (
    <div ref={ref} className={`relative px-4 pb-6 sm:px-6 ${world.mill}`}>
      <Lantern />
      <SawRail running={triggered} />
      <p className="relative mb-4 text-center text-sm italic tracking-wider text-[color:var(--sh-muted)]">{words.lightHint}</p>
      <ProjectList projects={projects} className={`relative ${MASONRY_LIST}`} itemClassName={MASONRY_ITEM} renderProject={(slot) => <ProjectCard {...slot} />} />
    </div>
  )
}
