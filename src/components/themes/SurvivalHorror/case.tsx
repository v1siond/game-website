'use client'

import { useRef, useState, type ReactNode, type RefObject } from 'react'
import type { Project } from '@/lib/cv/content'
import { ProjectList, type ProjectSlot } from '@/components/cv/ProjectList'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import { useLabels } from '@/components/cv/CVDataProvider'
import { ImpactLabel } from '@/components/cv/ImpactLabel'
import { projectCard } from '@/lib/cv/cvView'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { fillLabel } from '@/lib/cv/labels'
import { cssVars } from '@/lib/cssVars'
import { useOnChange } from '@/hooks/useOnChange'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { CARD_BUTTON } from './actions'
import { MarkedLines } from '@/components/cv/MarkedLines'
import { TagList } from '@/components/cv/TagList'
import { MARK_LIST, PINNED_TAGS, STAMP } from './cards'
import { SH } from './palette'
import horror from './horror.module.css'
import look from './world.module.css'

// Projects as the attache case of the 2005 sequel (named here in code only): the case opens on its felt
// lining when the section comes into view (once), and every project lies in it as an item in its own
// felt cell. Examine picks the item up and turns it over in the light, the genre's examine view, and its
// back reads the description, the result, the tools and the links; Put it back turns it face up again.
// The face that is turned away is inert, so the keyboard only ever reaches the side in view, and the turn
// hands keyboard focus to the button of the face that comes up.
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

const LINK_PLATE = `${CARD_BUTTON} border-[color:var(--sh-brass)] bg-[color:var(--sh-shadow)] text-[color:var(--sh-flame-text)] hover:border-[color:var(--sh-flame)]`
const TURN_PLATE = `${CARD_BUTTON} border-[color:var(--sh-felt-line)] bg-[color:var(--sh-void)] text-[color:var(--sh-ivory)] hover:border-[color:var(--sh-flame)]`

interface FaceProps {
  slot: ProjectSlot
  turnRef: RefObject<HTMLButtonElement | null>
  onTurn: () => void
}

function ItemFront({ slot, index, turnRef, onTurn }: FaceProps & { index: number }) {
  const labels = useLabels()
  const { horror: words } = labels
  const project = projectCard(slot.project, labels)

  return (
    <div className="flex h-full flex-col items-center gap-3 p-4 text-center">
      <ItemPicture index={index} />
      <h3 className="text-base text-[color:var(--sh-ivory)]">
        <SlashBreaks text={project.name} />
      </h3>
      <p className="text-sm text-[color:var(--sh-cream)]">{project.role}</p>
      {project.years && <span className={STAMP}>{project.years}</span>}
      <p className="text-sm leading-relaxed text-[color:var(--sh-cream)]">{project.tagline}</p>
      <button ref={turnRef} type="button" onClick={onTurn} aria-label={fillLabel(words.examineItem, { name: project.name })} className={`mt-auto ${TURN_PLATE}`}>
        {words.examine}
      </button>
    </div>
  )
}

function ItemBack({ slot, turnRef, onTurn }: FaceProps) {
  const labels = useLabels()
  const { horror: words, cards } = labels
  const { links, noLink } = slot
  const project = projectCard(slot.project, labels)

  return (
    <div className="flex h-full flex-col p-4">
      <h3 className={`text-sm uppercase text-[color:var(--sh-brass-text)] ${look.typed}`}>
        <SlashBreaks text={project.name} />
      </h3>
      {project.description && <p className="mt-2 text-sm leading-relaxed text-[color:var(--sh-cream)]">{project.description}</p>}
      <MarkedLines items={project.details} label={cards.details} look={{ ...MARK_LIST, list: 'mt-2 space-y-1' }} />
      {project.impact && (
        <p className="mt-2 text-sm italic text-[color:var(--sh-ivory)]">
          <ImpactLabel />
          {project.impact}
        </p>
      )}
      <TagList items={project.techStack} label={fillLabel(cards.categoryTechnologies, { name: project.name })} look={PINNED_TAGS} />
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
        {links.map(({ kind, label, linkProps }) => (
          <a key={kind} {...linkProps} className={LINK_PLATE}>
            {label}
          </a>
        ))}
        {noLink && <span className="text-sm italic text-[color:var(--sh-cream)]">{noLink}</span>}
        <button ref={turnRef} type="button" onClick={onTurn} className={TURN_PLATE}>
          {words.putBack}
        </button>
      </div>
    </div>
  )
}

// Both faces sit in one grid cell so the item is as tall as its longer face; the turn is a 3D flip.
function CaseItem({ slot, index }: { slot: ProjectSlot; index: number }) {
  const [turned, setTurned] = useState(false)
  const examine = useRef<HTMLButtonElement>(null)
  const putBack = useRef<HTMLButtonElement>(null)
  // Before the paint of the turn, once the face pressed has gone inert and dropped focus.
  useOnChange(turned, (backUp) => (backUp ? putBack : examine).current?.focus(), { timing: 'layout' })

  return (
    <div className={horror.examineCell}>
      <div className={`grid ${horror.flip} ${turned ? horror.flipped : ''}`}>
        <div className={`col-start-1 row-start-1 ${horror.face}`} inert={turned}>
          <ItemFront slot={slot} index={index} turnRef={examine} onTurn={() => setTurned(true)} />
        </div>
        <div className={`col-start-1 row-start-1 ${horror.face} ${horror.faceBack}`} inert={!turned}>
          <ItemBack slot={slot} turnRef={putBack} onTurn={() => setTurned(false)} />
        </div>
      </div>
    </div>
  )
}

export function AttacheCase({ projects }: { projects: Project[] }) {
  const { ref, triggered } = useSectionTrigger({ threshold: 0.1 })

  return (
    <div ref={ref} className={horror.caseHinge}>
      <div className={`${horror.caseLid} ${triggered ? horror.caseLidOpen : ''}`} aria-hidden="true">
        <div className="mx-auto mt-3 h-3 w-24 rounded-sm bg-[color:var(--sh-brass)]" />
      </div>
      <div className={`p-3 sm:p-5 ${horror.caseBody}`}>
        <ProjectList
          projects={projects}
          className={MASONRY_LIST}
          itemClassName={MASONRY_ITEM}
          renderProject={(slot, index) => (
            <div className={`${horror.cellDrop} ${triggered ? horror.cellDropped : ''}`} style={cssVars({ '--i': index })}>
              <CaseItem slot={slot} index={index} />
            </div>
          )}
        />
      </div>
    </div>
  )
}
