import type { ReactNode } from 'react'
import { headingId } from '@/components/cv/sectionText'
import { RoomGlyph } from './art'
import world from './world.module.css'

// The section surfaces: a map room panel with its title, and the title alone for a section that lays
// its cards straight on the cavern.

export function SectionTitle({ title }: { title: string }) {
  return (
    <h2 id={headingId('soul', title)} className={`mb-5 flex items-center gap-3 text-xl uppercase text-[var(--soul-glow)] sm:text-2xl ${world.lettering}`}>
      <RoomGlyph />
      {title}
    </h2>
  )
}

export function MapPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={headingId('soul', title)} className={`relative p-5 sm:p-7 ${world.room}`}>
      <SectionTitle title={title} />
      {children}
    </section>
  )
}

// A section whose cards lie straight on the cavern, under its title.
export function OpenSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={headingId('soul', title)}>
      <SectionTitle title={title} />
      {children}
    </section>
  )
}
