'use client'

import { useRef, useState, type FocusEvent, type PointerEvent } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { ProjectList, type ProjectSlot } from '@/components/cv/ProjectList'
import { createValueStore, useStoreValue, useZoneStage, type ValueStore } from '@/hooks/useZoneStage'
import { cssVars } from '@/lib/cssVars'
import type { Project } from '@/lib/cv/content'
import { BODY, FACE, Fact, Points, Tags } from './cards'
import { aimAt, type Motion } from './choreography'
import type { Era } from './palette'
import { FigureRow, Region, Rig } from './stage'
import css from './spheres.module.css'

// Projects in the future city as the warp spheres of the promo art (research part 2 [39][24], part 5
// item 6): each project framed in its own glass sphere card, one size for all, its year and stack on the
// time trial's black board inside. He stands in the row above the grid and, when the visitor points at or
// focuses a card, turns his arm toward it while its sphere lifts and a glint crosses its glass. The aim
// lives in a small store outside React state, so pointing from card to card re-renders only him, never
// the sixteen cards.
//
// Animated: him (the point), the sphere's lift and glint.
// Reduced motion: he points with no swing and the sphere lifts with no motion.

/** The aim: his arm's turn toward the card pointed at, or null when no card is. */
type Aim = number | null

const AT_CENTRE = { x: 50, lift: 0 }

function PointingFigure({ aim }: { aim: ValueStore<Aim> }) {
  const angle = useStoreValue(aim)
  const motion: Motion = { pose: angle === null ? 'idle' : 'point', from: AT_CENTRE, to: AT_CENTRE, ms: 0 }
  return (
    <div className="absolute inset-0" style={cssVars({ '--aim': `${angle ?? 0}deg` })}>
      <Rig motion={motion} step={0} run size="row" />
    </div>
  )
}

function SphereCard({ slot, onPoint }: { slot: ProjectSlot; onPoint: (card: HTMLElement) => void }) {
  const { cards } = useLabels()
  const { project, years, links, noLink } = slot
  const point = (event: PointerEvent<HTMLElement> | FocusEvent<HTMLElement>) => onPoint(event.currentTarget)
  return (
    <article className={`${css.sphere} ${BODY}`} onPointerEnter={point} onFocus={point}>
      <h3 className={`${FACE} text-2xl leading-tight tracking-wide text-[color:var(--np-white)]`}>{project.name}</h3>
      <p className="mt-1 text-sm font-semibold text-[color:var(--np-glass-text)]">{project.role}</p>
      <p className="mt-3 text-base font-semibold">{project.tagline}</p>
      <p className="mt-2 text-sm leading-relaxed">{project.description}</p>
      {project.impact && <Fact label={cards.impact}>{project.impact}</Fact>}
      <Points items={project.details} label={cards.details} />
      <div className="mt-4 rounded-md border-2 border-[color:var(--np-seam)] bg-[color:var(--np-board)] p-3">
        {years && <p className={`${FACE} text-lg tracking-wide text-[color:var(--np-gold)]`}>{years}</p>}
        <Tags items={project.techStack} label={cards.technologiesUsed} className="mt-2" />
      </div>
      <p className="mt-4 flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            key={link.kind}
            {...link.linkProps}
            className={`${FACE} inline-flex min-h-[44px] items-center rounded-full border-[3px] border-[color:var(--np-ink)] bg-[color:var(--np-glass-text)] px-4 text-base tracking-wide text-[color:var(--np-ink)] shadow-[0_3px_0_var(--np-ink)]`}
          >
            {link.label}
          </a>
        ))}
        {noLink && <span className="text-sm text-[color:var(--np-glass-text)]">{noLink}</span>}
      </p>
    </article>
  )
}

export function SphereLevel({ projects }: { projects: Project[] }) {
  const { sections } = useLabels()
  const { ref, on } = useZoneStage<Era>('future')
  const [aim] = useState(() => createValueStore<Aim>(null))
  const grid = useRef<HTMLDivElement>(null)

  const onPoint = (card: HTMLElement) => {
    const box = grid.current?.getBoundingClientRect()
    if (!box) return
    const { left, width } = card.getBoundingClientRect()
    aim.write(aimAt((left + width / 2 - box.left) / box.width))
  }
  const onLeave = () => aim.write(null)
  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget)) return
    onLeave()
  }

  return (
    <Region title={sections.projects} stageRef={ref} on={on}>
      <FigureRow>
        <PointingFigure aim={aim} />
      </FigureRow>
      <div ref={grid} onPointerLeave={onLeave} onBlur={onBlur}>
        <ProjectList
          projects={projects}
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          renderProject={(slot) => <SphereCard slot={slot} onPoint={onPoint} />}
        />
      </div>
    </Region>
  )
}
