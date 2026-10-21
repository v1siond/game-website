'use client'

import { useLabels } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { headingId } from '@/components/cv/sectionText'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { CVLink, HeroAction } from './actions'
import { DECO_COLORS as C } from './palette'
import hatch from './hatch.module.css'

// Contact as the bulkhead hatch at the bottom of the city. When it comes into view the locking wheel
// spins twice, the round door swings open on its hinge and the lit room behind it shows; the contact
// plate slides out of the doorway with the neon heading, his line and the ways to reach him. Pointing
// at the hatch eases the door a little wider and turns the wheel.
//
// Pattern: CSS off one section trigger, phases as delays (wheel 0 to 1.1 s, door 0.9 to 2 s, plate from
// 1.6 s). Reduced motion: the door stands open and the plate is in place.

const CONTACT_HEADING = headingId('deco', 'Contact')
const SPOKES = [0, 60, 120, 180, 240, 300]
const BOLTS = Array.from({ length: 12 }, (_, i) => i * 30)

function Door() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true" focusable="false">
      <circle cx="100" cy="100" r="92" fill={C.deepSeaDark} stroke={C.brassMid} strokeWidth="6" />
      <circle cx="100" cy="100" r="78" fill="none" stroke={C.brassDark} strokeWidth="2" />
      {BOLTS.map((angle) => (
        <circle key={angle} cx="100" cy="14" r="4" fill={C.gold} transform={`rotate(${angle} 100 100)`} />
      ))}
      <g className={hatch.wheel}>
        <circle cx="100" cy="100" r="44" fill="none" stroke={C.gold} strokeWidth="7" />
        {SPOKES.map((angle) => (
          <path key={angle} d="M100 100 V52" stroke={C.gold} strokeWidth="6" strokeLinecap="round" transform={`rotate(${angle} 100 100)`} />
        ))}
        <circle cx="100" cy="100" r="12" fill={C.brassMid} stroke={C.goldBright} strokeWidth="3" />
      </g>
    </svg>
  )
}

/** The closing section: the hatch opens and the contact plate comes out of it. */
export function ContactHatch() {
  const { sections, navigation } = useLabels()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.25 })

  return (
    <section
      ref={ref}
      data-on={triggered || undefined}
      aria-labelledby={CONTACT_HEADING}
      className={`relative z-20 mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-16 md:flex-row md:gap-12 ${hatch.bay}`}
    >
      <div className={`relative h-56 w-56 flex-shrink-0 sm:h-64 sm:w-64 ${hatch.frame}`} aria-hidden="true">
        <span className={`absolute inset-3 rounded-full ${hatch.room}`} />
        <div className={`absolute inset-0 ${hatch.hinge}`}>
          <div className={`h-full w-full ${hatch.door}`}>
            <Door />
          </div>
        </div>
      </div>

      <RecruiterHero
        render={({ line, actions }) => (
          <div className={`relative w-full flex-1 p-6 sm:p-8 ${hatch.plate}`}>
            <h2 id={CONTACT_HEADING} className={`text-2xl uppercase tracking-[0.3em] ${hatch.neon}`}>
              {sections.contact}
            </h2>
            <p className="mt-4 text-base text-[color:var(--deco-cream)]">{line}</p>
            <nav className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap" aria-label={navigation.contactAndCv}>
              {actions.map((action) => (
                <HeroAction key={action.id} action={action} />
              ))}
              <CVLink />
            </nav>
          </div>
        )}
      />
    </section>
  )
}
