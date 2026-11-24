'use client'

import { useState, type ReactNode } from 'react'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { RealmDoors } from './realmDoors'
import { ContactActions, SlabButton } from './buttons'
import { useZoneStage } from '@/hooks/useZoneStage'
import { COLUMN, SectionTitle, mythHeadingId, type Zone } from './stage'
import { MYTH } from './palette'
import u from './underworld.module.css'

// Contact at the realm door on the summit, the climb's end: the shut carved doors with the light of the
// realm travel behind them. Open the gate drives the leaves apart and the light floods in (a second press
// shuts it);
// the contact panel under the gate holds the line and the four ways to reach him. Back to the great hall
// takes the visitor to the top of the page. The realm travel light lifts him on the contact's stage behind it
// (scenes.tsx). `still` is the stage drawn settled under reduced motion.

const GATE_LEAVES = { left: u.gateLeft, right: u.gateRight }

export function LastGate({ still }: { still?: ReactNode }) {
  const { sections, myth } = useLabels()
  const { ref, on, reduced } = useZoneStage<Zone>('olympus')
  const [open, setOpen] = useState(false)
  const toHall = () => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  const title = sections.contact

  return (
    <section ref={ref} data-scene="contact" data-on={on || undefined} aria-labelledby={mythHeadingId(title)} className="relative z-20 mx-auto min-h-[130svh] max-w-6xl scroll-mt-8 px-4 pb-24 sm:px-6">
      {still}
      {/* tall enough that its scene fully rises over the one before it, even at the page's end */}
      <div className={COLUMN}>
        <SectionTitle title={title} />
        {/* under lg the realm travel plays in this gap first, as every section's scene does (stage.tsx) */}
        <div className="max-lg:min-h-[115svh]" aria-hidden="true" />
        <div data-open={open || undefined} className={`relative h-80 overflow-hidden ${u.gateScene}`} aria-hidden="true">
          {/* the realm's light behind the doors */}
          <div className={`absolute inset-x-[22%] bottom-0 top-8 rounded-t-full bg-[radial-gradient(ellipse_at_50%_80%,var(--myth-frost-core),var(--myth-frost)_45%,var(--myth-iron-deep)_100%)] ${u.dawn}`} />
          {/* the door's arch and its two carved leaves */}
          <RealmDoors className="absolute inset-x-[22%] bottom-0 top-8 border-4" leaves={GATE_LEAVES} />
          <svg viewBox="0 0 400 40" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-10 w-full">
            <path d="M0 10 L400 10 L400 40 L0 40 Z" fill={MYTH.styxHigh} stroke={MYTH.inkLine} strokeWidth={3} />
          </svg>
        </div>

        <RecruiterHero
          render={({ line, actions }) => (
            <div className={`relative -mt-2 p-6 sm:p-8 ${u.panel}`}>
              <p className="text-lg">{line}</p>
              <nav className="mt-5 flex flex-wrap gap-3" aria-label={sections.contact}>
                <ContactActions actions={actions} />
              </nav>
              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[var(--myth-iron)] pt-5">
                <SlabButton tone="frost" aria-pressed={open} onClick={() => setOpen(!open)}>
                  {myth.openGate}
                </SlabButton>
                <SlabButton tone="stone" onClick={toHall}>
                  {myth.returnHall}
                </SlabButton>
                <span className="text-base italic text-[var(--myth-frost-core)]" role="status">
                  {open ? myth.gateOpen : ''}
                </span>
              </div>
            </div>
          )}
        />
      </div>
    </section>
  )
}
