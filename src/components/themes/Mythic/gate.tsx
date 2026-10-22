'use client'

import { useState } from 'react'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import type { Profession } from '@/lib/cv/professions'
import { SpartanSprite, type SpriteMotion } from './sprite'
import { BronzeDoors } from './doors'
import { ContactActions, SlabButton } from './buttons'
import { useZoneStage } from '@/hooks/useZoneStage'
import { SectionTitle, mythHeadingId, useHouse, type Zone } from './stage'
import { MYTH } from './palette'
import u from './underworld.module.css'

// Contact at the last gate of the red temple, the escape's end: he stands before the shut bronze gate.
// Open the gate sets him against it: both palms on the bronze, he leans in and drives the leaves apart
// ('push' in rig.ts), the dawn of the summit floods in and, once they are open, he walks up into it (a
// second press shuts it and brings him back); the contact panel under the gate holds the line and the four ways to reach him. Return to
// the house takes the visitor back to the top, where he rises from the pool again (the escape always
// starts over).

const GATE_LEAVES = { left: u.gateLeft, right: u.gateRight }

type GatePhase = 'shut' | 'pushing' | 'through'

export function LastGate({ profession }: { profession: Profession }) {
  const { sections, myth, navigation } = useLabels()
  const { returnToHouse } = useHouse()
  const { ref, on, reduced } = useZoneStage<Zone>('olympus')
  const [phase, setPhase] = useState<GatePhase>('shut')
  const { pose, take, play, settle } = usePoseSequence<SpriteMotion>({ entrance: [], rest: 'idle', still: 'still', policy: 'always' })
  const open = phase !== 'shut'

  const toggle = () => {
    if (open) return setPhase('shut')
    if (reduced) return setPhase('through')
    setPhase('pushing')
    play('push')
  }

  const pushed = () => {
    settle()
    setPhase('through')
  }
  const title = sections.contact

  return (
    <section ref={ref} data-on={on || undefined} aria-labelledby={mythHeadingId(title)} className="relative z-20 mx-auto max-w-6xl scroll-mt-8 px-4 pb-24 sm:px-6">
      <SectionTitle title={title} />
      <div data-open={open || undefined} data-through={phase === 'through' || undefined} className={`relative h-80 overflow-hidden ${u.gateScene}`} aria-hidden="true">
        {/* the dawn behind the gate */}
        <div className={`absolute inset-x-[22%] bottom-0 top-8 rounded-t-full bg-[radial-gradient(ellipse_at_50%_80%,var(--myth-dawn-pale),var(--myth-dawn)_45%,var(--myth-blood)_100%)] ${u.dawn}`} />
        {/* the gate's arch and its two bronze leaves */}
        <BronzeDoors className="absolute inset-x-[22%] bottom-0 top-8 border-4" leaves={GATE_LEAVES} />
        <svg viewBox="0 0 400 40" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-10 w-full">
          <path d="M0 10 L400 10 L400 40 L0 40 Z" fill={MYTH.styxHigh} stroke={MYTH.inkLine} strokeWidth={3} />
        </svg>
        <div className={`absolute bottom-6 left-1/2 h-48 w-40 -translate-x-1/2 ${u.walker}`}>
          <SpartanSprite key={take} profession={profession} motion={phase === 'through' ? 'walk' : pose} onDone={pushed} className="h-full w-full" />
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
              <SlabButton tone="gold" aria-pressed={open} onClick={toggle}>
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
