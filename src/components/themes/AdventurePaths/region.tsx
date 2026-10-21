import type { ReactNode } from 'react'
import { headingId } from '@/components/cv/sectionText'
import { JOURNAL_SERIF } from './palette'

// A region of the expedition: one CV section as one map page, a wooden header board with the section's
// title and a one line hint for what the visitor can do on it, then the region's own map and its cards.

export function Region({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  const id = headingId('trail', title)
  return (
    <section aria-labelledby={id} className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b-4 border-[color:var(--ap-wood)] pb-3">
        <h2 id={id} className={`text-2xl font-bold tracking-wide text-[color:var(--ap-gold)] sm:text-3xl ${JOURNAL_SERIF}`}>
          {title}
        </h2>
        {hint && <p className="text-sm text-[color:var(--ap-edge)]">{hint}</p>}
      </header>
      {children}
    </section>
  )
}

/** A parchment map page in its wooden frame. */
export function MapFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-md border-[6px] border-[color:var(--ap-wood)] bg-[color:var(--ap-parchment)] shadow-[0_8px_0_var(--ap-bark)] ${className}`}>
      {children}
    </div>
  )
}

/** The black banner over a map naming where he stands, read out when it changes. */
export function MapBanner({ children }: { children: ReactNode }) {
  return (
    <p
      className={`flex min-h-[2.75rem] items-center justify-center border-b-4 border-[color:var(--ap-wood)] bg-[color:var(--ap-ink)] px-4 py-2 text-center text-base font-bold tracking-wide text-[color:var(--ap-page)] [overflow-wrap:anywhere] ${JOURNAL_SERIF}`}
      aria-live="polite"
    >
      {children}
    </p>
  )
}

export const PAPER_CARD = 'rounded-sm border-2 border-[color:var(--ap-edge)] bg-[color:var(--ap-page)] p-4 text-[color:var(--ap-ink)] shadow-[0_4px_0_var(--ap-bark)]'
