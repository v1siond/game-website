import type { ReactNode } from 'react'
import { headingId } from '@/components/cv/sectionText'
import { GreekKey } from './art'
import { MYTH } from './palette'
import world from './world.module.css'

// The stone the sections are carved on: the marble slab with its title on a black plaque on the top
// edge and the Greek key along the foot, the section title on its own over a grid of cards, and the
// inscription his bio is cut in.

// The black plaque a title is set in.
export const PLAQUE = `px-4 py-1 text-base sm:text-lg ${world.carved} ${world.plaque}`

export function MarblePanel({ title, children }: { title: string; children: ReactNode }) {
  const id = headingId('mythic', title)

  return (
    <section className={`relative px-4 pb-9 pt-10 sm:px-6 ${world.slab}`} aria-labelledby={id}>
      <h2 id={id} className={`absolute -top-5 left-4 sm:left-8 ${PLAQUE}`}>
        {title}
      </h2>
      {children}
      <GreekKey className="absolute inset-x-3 bottom-2 h-3" color={MYTH.terracotta} />
    </section>
  )
}

// A section title on its own, over a grid of cards: the plaque with a gold key running off it.
export function SectionTitle({ children }: { children: string }) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <h2 className={PLAQUE}>{children}</h2>
      <GreekKey className="h-3 flex-1" color={MYTH.gold} />
    </div>
  )
}

// His bio cut into the temple's dedication stone: a marble slab, the key band over the text.
export function Inscription({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className={`relative px-6 pb-6 pt-8 ${world.slab}`} aria-label={label}>
      <GreekKey className="absolute inset-x-3 top-2 h-3" color={MYTH.terracotta} />
      {children}
    </section>
  )
}
