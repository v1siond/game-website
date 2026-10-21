import type { ReactNode } from 'react'
import { MONO, PIXEL } from './palette'
import world from './world.module.css'

// Retro RPG's panels: the hard white box every block sits in, the section title written as the line a
// box types when it opens ("* " and the name), and the typed line itself.

export function Box({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`relative p-4 sm:p-6 ${world.box} ${className}`}>{children}</div>
}

// A line that types itself when its block plays: the full text is in the page at once (readers and
// search get it whole), the black block over it slides off in steps. Paces and delays are fixed class
// strings so Tailwind sees each one.
const PACE = {
  short: '[--type-steps:10] [--type-ms:500ms]',
  line: '[--type-steps:18] [--type-ms:900ms]',
  long: '[--type-steps:28] [--type-ms:1300ms]',
} as const

const DELAY = {
  none: '',
  open: '[--type-delay:420ms]',
  second: '[--type-delay:900ms]',
} as const

export type TypePace = keyof typeof PACE
export type TypeDelay = keyof typeof DELAY

export function Typed({ children, className = '', pace = 'line', delay = 'none' }: { children: ReactNode; className?: string; pace?: TypePace; delay?: TypeDelay }) {
  return <span className={`${world.type} ${PACE[pace]} ${DELAY[delay]} ${className}`}>{children}</span>
}

/** Shows a block in one step once the line before it is typed. */
export const SHOW_AFTER = {
  second: `${world.after} [--show-delay:900ms]`,
  third: `${world.after} [--show-delay:1400ms]`,
  last: `${world.after} [--show-delay:2000ms]`,
} as const

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
    <h2 className={`mb-6 text-base uppercase tracking-[0.2em] text-[color:var(--rpg-text)] sm:text-lg ${PIXEL}`}>
      <Mark className="mr-3 text-[color:var(--rpg-gold)]" />
      <Typed pace="short">{title}</Typed>
    </h2>
  )
}

export const BODY = `text-sm leading-relaxed text-[color:var(--rpg-muted)] sm:text-base ${MONO}`
