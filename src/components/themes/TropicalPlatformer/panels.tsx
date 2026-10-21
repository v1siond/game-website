import type { ReactNode } from 'react'
import { headingId } from '@/components/cv/sectionText'
import world from './world.module.css'

// Tropical Platformer's crate panel, the frame every section sits in: a plank crate or a lagoon, leaf or
// hazard board, gold brackets at the corners, a title bar in the chunky display type.

export type PanelVariant = 'wood' | 'hazard' | 'lagoon' | 'temple' | 'leaf'

interface PanelLook {
  body: string
  titleBar: string
  // The corner brackets.
  accent: string
  planks: boolean
}

const PANEL_LOOK: Record<PanelVariant, PanelLook> = {
  wood: {
    body: 'border-[var(--tp-wood-light)] bg-[linear-gradient(145deg,var(--tp-wood),var(--tp-wood-dark))]',
    titleBar: 'border-[var(--tp-wood-light)] bg-[var(--tp-wood)]',
    accent: 'border-[var(--tp-sun)]',
    planks: true,
  },
  hazard: {
    body: 'border-[var(--tp-hazard)] bg-[linear-gradient(145deg,var(--tp-hazard-dark),var(--tp-wood-dark))]',
    titleBar: 'border-[var(--tp-hazard)] bg-[var(--tp-hazard-dark)]',
    accent: 'border-[var(--tp-sun)]',
    planks: false,
  },
  lagoon: {
    body: 'border-[var(--tp-sea-light)] bg-[linear-gradient(145deg,var(--tp-night),var(--tp-sea-deep))]',
    titleBar: 'border-[var(--tp-sea-light)] bg-[var(--tp-sea-deep)]',
    accent: 'border-[var(--tp-sea-light)]',
    planks: false,
  },
  temple: {
    body: 'border-[var(--tp-fruit-gold)] bg-[linear-gradient(145deg,var(--tp-ember),var(--tp-wood-dark))]',
    titleBar: 'border-[var(--tp-fruit-gold)] bg-[var(--tp-ember)]',
    accent: 'border-[var(--tp-sun)]',
    planks: true,
  },
  leaf: {
    body: 'border-[var(--tp-lime)] bg-[linear-gradient(145deg,var(--tp-leaf-dark),var(--tp-canopy))]',
    titleBar: 'border-[var(--tp-lime)] bg-[var(--tp-canopy)]',
    accent: 'border-[var(--tp-lime)]',
    planks: false,
  },
}

const BRACKETS = [
  '-left-3 -top-3 rounded-tl border-l-4 border-t-4',
  '-right-3 -top-3 rounded-tr border-r-4 border-t-4',
  '-bottom-3 -left-3 rounded-bl border-b-4 border-l-4',
  '-bottom-3 -right-3 rounded-br border-b-4 border-r-4',
]

interface CratePanelProps {
  children: ReactNode
  title: string
  titleIcon?: ReactNode
  variant?: PanelVariant
}

export function CratePanel({ children, title, titleIcon, variant = 'wood' }: CratePanelProps) {
  const look = PANEL_LOOK[variant]
  const id = headingId('section', title)

  return (
    <section className="relative" aria-labelledby={id}>
      {BRACKETS.map((place) => (
        <div key={place} className={`absolute h-10 w-10 ${place} ${look.accent}`} aria-hidden="true" />
      ))}

      <div className={`relative overflow-hidden rounded-lg border-4 ${look.body} ${world.panelDepth}`}>
        {look.planks && <div className={`pointer-events-none absolute inset-0 ${world.planks}`} aria-hidden="true" />}

        <div className={`relative flex items-center gap-4 border-b-[3px] px-4 py-4 sm:px-6 ${look.titleBar}`}>
          {titleIcon}
          <h2 id={id} className={`text-xl font-black uppercase tracking-widest text-white ${world.display} ${world.outlined}`}>
            {title}
          </h2>
        </div>

        <div className="relative p-4 sm:p-6">{children}</div>
      </div>
    </section>
  )
}
