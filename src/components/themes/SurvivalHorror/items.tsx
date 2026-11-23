import { useState, type ReactNode } from 'react'
import type { Project } from '@/lib/cv/content'
import { ProjectList, type ProjectSlot } from '@/components/cv/ProjectList'
import { MASONRY_ITEM } from '@/lib/cv/masonry'
import { useLabels } from '@/components/cv/CVDataProvider'
import { ImpactLabel } from '@/components/cv/ImpactLabel'
import { projectCard } from '@/lib/cv/cvView'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { fillLabel } from '@/lib/cv/labels'
import { MarkedLines } from '@/components/cv/MarkedLines'
import { TagList } from '@/components/cv/TagList'
import { CARD_BUTTON } from './actions'
import { COLUMN_LIST, MARK_LIST, PINNED_TAGS, STAMP } from './cards'
import { SH } from './palette'
import look from './world.module.css'

// Projects as the items he finds in the house, each a card with its picture: the name, his role, the years
// and the tagline always in view, and Read file opens the rest (the description, the details, the result,
// the tools). The links sit at the foot of every card. The rest is always in the page, hidden until opened,
// so the server HTML carries it.

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
    <path d="M10 18 L18 8 H30 L38 18 L24 42 Z" fill={SH.leather} stroke={SH.void} strokeWidth={1} />
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
    <svg viewBox="0 0 48 48" className="h-14 w-14 shrink-0" aria-hidden="true" focusable="false">
      {ITEMS[index % ITEMS.length]}
    </svg>
  )
}

const LINK_PLATE = `${CARD_BUTTON} border-[color:var(--sh-brass)] bg-[color:var(--sh-shadow)] text-[color:var(--sh-flame-text)] hover:border-[color:var(--sh-flame)]`
const READ_PLATE = `${CARD_BUTTON} border-[color:var(--sh-wood)] bg-[color:var(--sh-void)] text-[color:var(--sh-ivory)] hover:border-[color:var(--sh-flame)]`

function ItemCard({ slot, index }: { slot: ProjectSlot; index: number }) {
  const labels = useLabels()
  const { cards, actions } = labels
  const [open, setOpen] = useState(false)
  const { links, noLink } = slot
  const project = projectCard(slot.project, labels)
  const bodyId = `survival-horror-project-${slot.project.id}`

  return (
    <article className={`flex flex-col gap-3 p-4 ${look.file}`}>
      <div className="flex items-start gap-3">
        <ItemPicture index={index} />
        <div className="min-w-0">
          <h3 className="text-base text-[color:var(--sh-ivory)]">
            <SlashBreaks text={project.name} />
          </h3>
          <p className="text-sm text-[color:var(--sh-cream)]">{project.role}</p>
          {project.years && <span className={`mt-1 inline-block ${STAMP}`}>{project.years}</span>}
        </div>
      </div>
      <p className="text-sm leading-relaxed text-[color:var(--sh-cream)]">{project.tagline}</p>
      <div>
        <button type="button" onClick={() => setOpen((shown) => !shown)} aria-controls={bodyId} aria-expanded={open} className={READ_PLATE}>
          {actions.readFile}
        </button>
      </div>
      <div id={bodyId} hidden={!open} className="border-t border-[color:var(--sh-wood)] pt-3">
        {project.description && <p className="text-sm leading-relaxed text-[color:var(--sh-cream)]">{project.description}</p>}
        <MarkedLines items={project.details} label={cards.details} look={{ ...MARK_LIST, list: 'mt-2 space-y-1' }} />
        {project.impact && (
          <p className="mt-2 text-sm italic text-[color:var(--sh-ivory)]">
            <ImpactLabel />
            {project.impact}
          </p>
        )}
        <TagList items={project.techStack} label={fillLabel(cards.categoryTechnologies, { name: project.name })} look={PINNED_TAGS} />
      </div>
      {(links.length > 0 || noLink) && (
        <div className="flex flex-wrap items-center gap-2">
          {links.map(({ kind, label, linkProps }) => (
            <a key={kind} {...linkProps} className={LINK_PLATE}>
              {label}
            </a>
          ))}
          {noLink && <span className="text-sm italic text-[color:var(--sh-cream)]">{noLink}</span>}
        </div>
      )}
    </article>
  )
}

export function ProjectItems({ projects }: { projects: Project[] }) {
  return (
    <div data-stage-items="">
      <ProjectList projects={projects} className={COLUMN_LIST} itemClassName={MASONRY_ITEM} renderProject={(slot, index) => <ItemCard slot={slot} index={index} />} />
    </div>
  )
}
