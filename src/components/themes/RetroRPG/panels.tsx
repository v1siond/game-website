import type { ReactNode } from 'react'
import { MONO, PIXEL } from './palette'
import world from './world.module.css'

// Retro RPG's panels: the hard white bordered window every block sits in, the small square bullet a
// window's lines carry, and the section title on its black plate.

export function Box({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`relative p-4 sm:p-6 ${world.box} ${className}`}>{children}</div>
}

/** The small square bullet a window's lines start with. */
export function Mark({ className = 'text-[color:var(--rpg-gold)]' }: { className?: string }) {
  return <span className={`mt-[0.45em] inline-block h-1.5 w-1.5 shrink-0 bg-current ${className}`} aria-hidden="true" />
}

export function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className={`mb-6 w-fit bg-[color:var(--rpg-void)] px-3 py-1 text-base uppercase tracking-[0.2em] text-[color:var(--rpg-text)] sm:text-lg ${PIXEL}`}>
      {title}
    </h2>
  )
}

export const BODY = `text-sm leading-relaxed text-[color:var(--rpg-muted)] sm:text-base ${MONO}`
