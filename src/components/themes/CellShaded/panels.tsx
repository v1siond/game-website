import type { ReactNode } from 'react'
import world from './world.module.css'

// The comic page pieces the sections are laid out in: the panel with its title caption, the section
// banner, and the speech bubble for his bio.

export type Accent = 'sun' | 'sky' | 'magenta' | 'orange' | 'green'

// Each accent as a flat fill with ink lettering on it (all at 4.5:1 or better).
export const ACCENT_FILL: Record<Accent, string> = {
  sun: 'bg-[#ffd23f] text-[#141414]',
  sky: 'bg-[#3fc4e8] text-[#141414]',
  magenta: 'bg-[#e8318a] text-[#141414]',
  orange: 'bg-[#ff7a1a] text-[#141414]',
  green: 'bg-[#5fc14a] text-[#141414]',
}

// A caption box on the panel's top edge, tilted a little like a hand lettered comic caption.
function Caption({ title, accent }: { title: string; accent: Accent }) {
  return (
    <h2
      className={`absolute -top-6 left-4 -rotate-2 border-4 border-[#141414] px-4 py-1 text-lg uppercase tracking-wider sm:left-8 sm:text-xl ${world.drop} ${ACCENT_FILL[accent]}`}
    >
      {title}
    </h2>
  )
}

export function ComicPanel({ title, accent, children }: { title: string; accent: Accent; children: ReactNode }) {
  return (
    <section className={`relative px-4 pb-6 pt-10 sm:px-6 ${world.panel}`} aria-label={title}>
      <Caption title={title} accent={accent} />
      {children}
    </section>
  )
}

// A section title on its own, over a grid of cards.
export function SectionBanner({ children, accent }: { children: ReactNode; accent: Accent }) {
  return (
    <div className="mb-8 text-center">
      <h2
        className={`inline-block rotate-1 border-[5px] border-[#141414] px-6 py-2 text-2xl uppercase tracking-wider ${world.drop} ${ACCENT_FILL[accent]}`}
      >
        {children}
      </h2>
    </div>
  )
}

export function SpeechBubble({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="relative mb-6" aria-label={label}>
      <div className={`p-6 ${world.bubble}`}>{children}</div>
      <div className={`absolute -bottom-5 left-16 h-0 w-0 ${world.bubbleTail}`} aria-hidden="true" />
    </section>
  )
}
