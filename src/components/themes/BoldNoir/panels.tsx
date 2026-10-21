import type { ReactNode } from 'react'
import { headingId } from '@/components/cv/sectionText'
import world from './world.module.css'

// The graphic novel page the sections are laid out in: the panel with its typed caption box on the top
// edge, the section title over a grid of cards, and the narration box his bio is told in.

// The typed caption box a panel's title sits in.
export const CAPTION = `px-4 py-1 text-lg font-bold uppercase tracking-widest sm:text-xl ${world.typed} ${world.caption}`

export function NoirPanel({ title, children }: { title: string; children: ReactNode }) {
  const id = headingId('noir', title)

  return (
    <section className={`relative px-4 pb-6 pt-10 sm:px-6 ${world.panel}`} aria-labelledby={id}>
      <h2 id={id} className={`absolute -top-5 left-4 sm:left-8 ${CAPTION}`}>
        {title}
      </h2>
      {children}
    </section>
  )
}

// A section title on its own, over a grid of cards: a caption box with the red rule running off it.
export function SectionTitle({ children }: { children: string }) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <h2 className={CAPTION}>{children}</h2>
      <span className="h-1 flex-1 bg-[color:var(--noir-red)]" aria-hidden="true" />
    </div>
  )
}

// His bio as the narration of the opening panel: typed on paper, the red bar down its edge.
export function Narration({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className={`relative border-l-8 border-[color:var(--noir-red)] p-6 ${world.caption}`} aria-label={label}>
      {children}
    </section>
  )
}
