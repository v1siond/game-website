import type { ReactNode } from 'react'
import { headingId } from '@/components/cv/sectionText'
import world from './world.module.css'

// The optics HUD chrome every section sits in: a glass panel with one clipped corner and its red
// diagonal, the title in the loud HUD yellow after two slashes, a red tick rail under it. Red stays in
// the line work; the words are yellow or ice white on near black, which keep 4.5:1.

export const panelHeadingId = (title: string): string => headingId('nc', title)

interface HudPanelProps {
  title: string
  children: ReactNode
  // Controls that sit on the title line, at its right (the layer switch, the replay).
  tools?: ReactNode
  className?: string
}

export function HudPanel({ title, children, tools = null, className = '' }: HudPanelProps) {
  return (
    <section className={`${world.panel} p-4 sm:p-6 ${className}`} aria-labelledby={panelHeadingId(title)}>
      <header className="mb-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id={panelHeadingId(title)} className="text-base uppercase tracking-[0.3em] text-[color:var(--neon-hud)] sm:text-lg">
            <span className="text-[color:var(--neon-data)]" aria-hidden="true">
              {'// '}
            </span>
            {title}
          </h2>
          {tools}
        </div>
        <div className={`${world.ticks} mt-2`} aria-hidden="true" />
      </header>
      {children}
    </section>
  )
}

/** A chip of tech or skills, square, the data cyan on glass. */
export function DataChip({ children }: { children: ReactNode }) {
  return (
    <li className="border border-[color-mix(in_srgb,var(--neon-data)_45%,transparent)] bg-[color-mix(in_srgb,var(--neon-data)_8%,transparent)] px-2 py-0.5 text-sm text-[color:var(--neon-data)]">
      {children}
    </li>
  )
}
