import type { ReactNode } from 'react'
import { headingId } from '@/components/cv/sectionText'
import { CompassRose } from './icons'
import { JOURNAL_SERIF } from './palette'

// A section of the expedition: a heading on a route line with the compass rose, over a page of the field
// journal (parchment) or a clearing under the canopy (dark green). Labelled by its own heading.

export type PanelTone = 'journal' | 'canopy'

const TONE: Record<PanelTone, string> = {
  journal:
    'border-[color:var(--ap-edge)] bg-[color:var(--ap-parchment)] text-[color:var(--ap-ink)]',
  canopy:
    'border-[color:var(--ap-moss)] bg-[color:var(--ap-canopy)] text-[color:var(--ap-parchment)]',
}

interface TrailPanelProps {
  title: string
  tone: PanelTone
  children: ReactNode
}

export function TrailPanel({ title, tone, children }: TrailPanelProps) {
  const id = headingId('trail', title)

  return (
    <section aria-labelledby={id}>
      <div className="mb-3 flex items-center gap-3">
        <CompassRose className="h-8 w-8 shrink-0" />
        <h2 id={id} className={`text-xl font-bold tracking-wide text-[color:var(--ap-parchment)] sm:text-2xl ${JOURNAL_SERIF}`}>
          {title}
        </h2>
        <div className="h-0 flex-1 border-t-2 border-dashed border-[color:var(--ap-route)]" aria-hidden="true" />
      </div>
      <div className={`rounded-sm border-2 p-4 sm:p-6 ${TONE[tone]}`}>{children}</div>
    </section>
  )
}
