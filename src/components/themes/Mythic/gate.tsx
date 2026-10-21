'use client'

import { useState } from 'react'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import type { Profession } from '@/lib/cv/professions'
import { SpartanSprite } from './sprite'
import { ContactActions, SlabButton } from './buttons'
import { useZoneStage } from '@/hooks/useZoneStage'
import { SectionTitle, mythHeadingId, useHouse, type Zone } from './stage'
import { MYTH } from './palette'
import u from './underworld.module.css'

// Contact at the last gate of the red temple, the escape's end: he stands before the shut bronze gate.
// Open the gate swings it wide (a second press shuts it), the dawn of the surface floods in and he walks
// up into it; the contact panel under the gate holds the line and the four ways to reach him. Return to
// the house takes the visitor back to the top, where he rises from the pool again (the escape always
// starts over).

export function LastGate({ profession }: { profession: Profession }) {
  const { sections, myth, navigation } = useLabels()
  const { returnToHouse } = useHouse()
  const { ref, on } = useZoneStage<Zone>('temple')
  const [open, setOpen] = useState(false)
  const title = sections.contact

  return (
    <section ref={ref} data-on={on || undefined} aria-labelledby={mythHeadingId(title)} className="relative z-20 mx-auto max-w-6xl scroll-mt-8 px-4 pb-24 sm:px-6">
      <SectionTitle title={title} />
      <div data-open={open || undefined} className={`relative h-80 overflow-hidden ${u.gateScene}`} aria-hidden="true">
        {/* the dawn behind the gate */}
        <div className={`absolute inset-x-[22%] bottom-0 top-8 rounded-t-full bg-[radial-gradient(ellipse_at_50%_80%,var(--myth-dawn-pale),var(--myth-dawn)_45%,var(--myth-blood)_100%)] ${u.dawn}`} />
        {/* the gate's arch and its two bronze leaves */}
        <div className="absolute inset-x-[22%] bottom-0 top-8 overflow-hidden rounded-t-full border-4 border-[var(--myth-ink)]">
          <div className={`absolute inset-y-0 left-0 w-1/2 border-r-2 border-[var(--myth-ink)] bg-[linear-gradient(90deg,var(--myth-bronze),var(--myth-gold-deep))] ${u.gateLeft}`} />
          <div className={`absolute inset-y-0 right-0 w-1/2 border-l-2 border-[var(--myth-ink)] bg-[linear-gradient(270deg,var(--myth-bronze),var(--myth-gold-deep))] ${u.gateRight}`} />
        </div>
        <svg viewBox="0 0 400 40" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-10 w-full">
          <path d="M0 10 L400 10 L400 40 L0 40 Z" fill={MYTH.styxHigh} stroke={MYTH.inkLine} strokeWidth={3} />
        </svg>
        <div className={`absolute bottom-6 left-1/2 h-48 w-40 -translate-x-1/2 ${u.walker}`}>
          <SpartanSprite profession={profession} motion={open ? 'walk' : 'idle'} className="h-full w-full" />
        </div>
      </div>

      <RecruiterHero
        render={({ line, actions }) => (
          <div className={`relative -mt-2 p-6 sm:p-8 ${u.panel}`}>
            <p className="text-lg">{line}</p>
            <nav className="mt-5 flex flex-wrap gap-3" aria-label={navigation.contactAndCv}>
              <ContactActions actions={actions} />
            </nav>
            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[var(--myth-gold-deep)] pt-5">
              <SlabButton tone="gold" aria-pressed={open} onClick={() => setOpen((now) => !now)}>
                {myth.openGate}
              </SlabButton>
              <SlabButton tone="stone" onClick={returnToHouse}>
                {myth.returnHouse}
              </SlabButton>
              <span className="text-base italic text-[var(--myth-gold-pale)]" role="status">
                {open ? myth.gateOpen : ''}
              </span>
            </div>
          </div>
        )}
      />
    </section>
  )
}
