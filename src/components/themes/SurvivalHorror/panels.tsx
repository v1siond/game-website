import type { ReactNode } from 'react'
import { headingId } from '@/components/cv/sectionText'
import look from './world.module.css'

// The paper panel every section sits on, its heading typed in brass; the heading names the region.

export const sectionHeadingId = (title: string) => headingId('survival-horror', title)

export const PANEL_HEADING = `mb-4 text-sm uppercase tracking-[0.3em] text-[color:var(--sh-brass)] ${look.typed}`

// The four corner marks of an item box slot, as position and border classes.
export const CORNER_MARKS = ['left-0 top-0 border-l-2 border-t-2', 'right-0 top-0 border-r-2 border-t-2', 'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2']

export function PaperPanel({ title, children }: { title: string; children: ReactNode }) {
  const id = sectionHeadingId(title)

  return (
    <section aria-labelledby={id} className={`relative mb-8 overflow-hidden p-6 ${look.panel}`}>
      <h2 id={id} className={PANEL_HEADING}>
        {title}
      </h2>
      {children}
    </section>
  )
}
