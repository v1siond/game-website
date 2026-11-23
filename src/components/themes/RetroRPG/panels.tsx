import type { ReactNode } from 'react'
import { MONO, PIXEL } from './palette'
import world from './world.module.css'

// Retro RPG's panels: the hard white box every block sits in, and the section title written the way a box
// speaks a line ("* " and the name).

export function Box({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`relative p-4 sm:p-6 ${world.box} ${className}`}>{children}</div>
}

/** The asterisk the game's boxes start every spoken line with. */
export function Mark({ className = 'text-[color:var(--rpg-gold)]' }: { className?: string }) {
  return (
    <span className={`shrink-0 ${className}`} aria-hidden="true">
      *
    </span>
  )
}

export function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className={`mb-6 w-fit bg-[color:var(--rpg-void)] px-3 py-1 text-base uppercase tracking-[0.2em] text-[color:var(--rpg-text)] sm:text-lg ${PIXEL}`}>
      <Mark className="mr-3 text-[color:var(--rpg-gold)]" />
      {title}
    </h2>
  )
}

export const BODY = `text-sm leading-relaxed text-[color:var(--rpg-muted)] sm:text-base ${MONO}`
