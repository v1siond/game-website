'use client'

import type { ReactNode } from 'react'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { headingId } from '@/components/cv/sectionText'
import look from './jungle.module.css'
import sign from './levelSign.module.css'

// Every section opens like a level of the source opens: its name on a wooden sign nailed to a post,
// dropping in and swinging to rest when the section scrolls in (data-on from the shared trigger, once).
// The heading carries the id its region is named by.

interface LevelProps {
  title: string
  children: ReactNode
}

export function Level({ title, children }: LevelProps) {
  const { ref, triggered } = useSectionTrigger({ threshold: 0.1 })
  const id = headingId('jungle', title)

  return (
    <section ref={ref} data-on={triggered || undefined} aria-labelledby={id} className={sign.level}>
      <div className="mb-10 flex flex-col items-center">
        <h2 id={id} className={`relative z-10 rounded-xl px-8 py-3 text-2xl uppercase text-[color:var(--tp-sun-gold)] sm:text-3xl ${look.plank} ${look.display} ${look.outlined} ${sign.sign}`}>
          {title}
        </h2>
        <span className={`-mt-1 block h-8 w-3 rounded-b ${sign.post}`} aria-hidden="true" />
      </div>
      {children}
    </section>
  )
}

/** The dark wooden board the short sections are read on. */
export function Board({ children }: { children: ReactNode }) {
  return <div className={`rounded-3xl p-6 sm:p-8 ${look.board}`}>{children}</div>
}
