'use client'

import { useState, type CSSProperties, type ReactNode } from 'react'
import type { Project } from '@/lib/cv/content'
import { ProjectList, type ProjectSlot } from '@/components/cv/ProjectList'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { useLabels } from '@/components/cv/CVDataProvider'
import { fillLabel } from '@/lib/cv/labels'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { CARD_BUTTON } from './actions'
import { STAMP } from './cards'
import { SH } from './palette'
import horror from './horror.module.css'
import look from './world.module.css'

// Projects as the attache case of the 2005 sequel (named here in code only): the case opens on its felt
// lining when the section comes into view (once), and every project lies in it as an item in its own
// felt cell. Examine picks the item up and turns it over in the light, the genre's examine view, and its
// back reads the description, the result, the tools and the links; Put it back turns it face up again.
// The face that is turned away is inert, so the keyboard only ever reaches the side in view.
//
// Animated: the lid (once), the cells settling in (once), the item's turn on Examine.

// Six item pictures, picked by the project's place in the list, all drawn on a 48 square.
const ITEMS: ReactNode[] = [
  // a brass key
  <g key="key">
    <circle cx={14} cy={24} r={8} fill="none" stroke={SH.brass} strokeWidth={4} />
    <path d="M22 24 H42 M34 24 V31 M40 24 V30" stroke={SH.brass} strokeWidth={4} />
  </g>,
  // a film canister
  <g key="film">
    <circle cx={24} cy={24} r={16} fill={SH.steel} stroke={SH.void} strokeWidth={1} />
    {[0, 1, 2, 3, 4].map((hole) => (
      <circle key={hole} cx={24 + 9 * Math.cos((hole * 2 * Math.PI) / 5)} cy={24 + 9 * Math.sin((hole * 2 * Math.PI) / 5)} r={3.4} fill={SH.void} />
    ))}
    <circle cx={24} cy={24} r={2.4} fill={SH.ivory} />
  </g>,
  // a cut gem
  <g key="gem">
    <path d="M10 18 L18 8 H30 L38 18 L24 42 Z" fill={SH.herbRed} stroke={SH.void} strokeWidth={1} />
    <path d="M10 18 H38 M18 8 L24 18 L30 8 M24 18 V42" stroke={SH.ivory} strokeWidth={0.8} opacity={0.6} />
  </g>,
  // a crank handle
  <g key="crank">
    <path d="M8 38 H20 V14 H40" fill="none" stroke={SH.steel} strokeWidth={5} strokeLinejoin="round" />
    <rect x={36} y={8} width={6} height={14} rx={2} fill={SH.wood} />
  </g>,
  // a sealed letter
  <g key="letter">
    <rect x={6} y={12} width={36} height={24} fill={SH.cream} stroke={SH.void} strokeWidth={1} />
    <path d="M6 12 L24 26 L42 12" fill="none" stroke={SH.wood} strokeWidth={1.4} />
    <circle cx={24} cy={27} r={4} fill={SH.leather} />
  </g>,
  // a medal
  <g key="medal">
    <path d="M16 4 L22 20 M32 4 L26 20" stroke={SH.leather} strokeWidth={5} />
    <circle cx={24} cy={30} r={12} fill={SH.brass} stroke={SH.void} strokeWidth={1} />
    <path d="M24 22 L26.4 28 H32 L27.6 31.6 L29.4 37.6 L24 34 L18.6 37.6 L20.4 31.6 L16 28 H21.6 Z" fill={SH.flame} />
  </g>,
]

function ItemPicture({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 48 48" className="h-16 w-16" aria-hidden="true" focusable="false">
      {ITEMS[index % ITEMS.length]}
    </svg>
  )
}

const LINK_PLATE = `${CARD_BUTTON} border-[color:var(--sh-brass)] bg-[color:var(--sh-shadow)] text-[color:var(--sh-flame)] hover:border-[color:var(--sh-flame)]`
const TURN_PLATE = `${CARD_BUTTON} border-[color:var(--sh-felt-line)] bg-[color:var(--sh-void)] text-[color:var(--sh-ivory)] hover:border-[color:var(--sh-flame)]`

function ItemFront({ slot, index, onExamine }: { slot: ProjectSlot; index: number; onExamine: () => void }) {
  const { horror: words } = useLabels()
  const { project, years } = slot

  return (
    <div className="flex h-full flex-col items-center gap-3 p-4 text-center">
      <ItemPicture index={index} />
      <h3 className="text-base text-[color:var(--sh-ivory)]">{project.name}</h3>
      <p className="text-sm text-[color:var(--sh-cream)]">{project.role}</p>
      {years && <span className={STAMP}>{years}</span>}
      <p className="text-sm leading-relaxed text-[color:var(--sh-cream)]">{project.tagline}</p>
      <button type="button" onClick={onExamine} aria-label={fillLabel(words.examineItem, { name: project.name })} className={`mt-auto ${TURN_PLATE}`}>
        {words.examine}
      </button>
    </div>
  )
}

function ToolList({ project }: { project: Project }) {
  const { cards } = useLabels()
  if (project.techStack.length === 0) return null

  return (
    <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={fillLabel(cards.categoryTechnologies, { name: project.name })}>
      {project.techStack.map((tech) => (
        <li key={tech} className="border border-[color:var(--sh-felt-line)] px-2 py-0.5 text-sm text-[color:var(--sh-cream)]">
          {tech}
        </li>
      ))}
    </ul>
  )
}

function ItemBack({ slot, onPutBack }: { slot: ProjectSlot; onPutBack: () => void }) {
  const { horror: words, links: linkLabels } = useLabels()
  const { project, links } = slot

  return (
    <div className="flex h-full flex-col p-4">
      <h3 className={`text-sm uppercase text-[color:var(--sh-brass)] ${look.typed}`}>{project.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[color:var(--sh-cream)]">{project.description}</p>
      {project.impact && <p className="mt-2 text-sm italic text-[color:var(--sh-ivory)]">{project.impact}</p>}
      <ToolList project={project} />
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
        {links.map(({ kind, label, linkProps }) => (
          <a key={kind} {...linkProps} className={LINK_PLATE}>
            {label}
          </a>
        ))}
        {links.length === 0 && <span className="text-sm italic text-[color:var(--sh-cream)]">{linkLabels.noPublicLink}</span>}
        <button type="button" onClick={onPutBack} className={TURN_PLATE}>
          {words.putBack}
        </button>
      </div>
    </div>
  )
}

// Both faces sit in one grid cell so the item is as tall as its longer face; the turn is a 3D flip.
function CaseItem({ slot, index }: { slot: ProjectSlot; index: number }) {
  const [turned, setTurned] = useState(false)

  return (
    <div className={horror.examineCell}>
      <div className={`grid ${horror.flip} ${turned ? horror.flipped : ''}`}>
        <div className={`col-start-1 row-start-1 ${horror.face}`} inert={turned}>
          <ItemFront slot={slot} index={index} onExamine={() => setTurned(true)} />
        </div>
        <div className={`col-start-1 row-start-1 ${horror.face} ${horror.faceBack}`} inert={!turned}>
          <ItemBack slot={slot} onPutBack={() => setTurned(false)} />
        </div>
      </div>
    </div>
  )
}

export function AttacheCase({ projects }: { projects: Project[] }) {
  const { horror: words } = useLabels()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.1 })
  const order = new Map(projects.map((project, index) => [project.id, index]))

  return (
    <div ref={ref} className={horror.caseHinge}>
      <div className={`${horror.caseLid} ${triggered ? horror.caseLidOpen : ''}`} aria-hidden="true">
        <div className="mx-auto mt-3 h-3 w-24 rounded-sm bg-[color:var(--sh-brass)]" />
      </div>
      <div className={`p-3 sm:p-5 ${horror.caseBody}`}>
        <p className="mb-4 text-sm italic text-[color:var(--sh-cream)]">{words.caseHint}</p>
        <ProjectList
          projects={projects}
          className={MASONRY_LIST}
          itemClassName={MASONRY_ITEM}
          renderProject={(slot) => (
            <div className={`${horror.cellDrop} ${triggered ? horror.cellDropped : ''}`} style={{ '--i': order.get(slot.project.id) ?? 0 } as CSSProperties}>
              <CaseItem slot={slot} index={order.get(slot.project.id) ?? 0} />
            </div>
          )}
        />
      </div>
    </div>
  )
}
