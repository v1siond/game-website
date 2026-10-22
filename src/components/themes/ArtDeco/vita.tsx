'use client'

import { useLabels } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { headingId } from '@/components/cv/sectionText'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { CVLink, HeroAction } from './actions'
import { SurvivorSprite, type DecoMotion } from './sprite'
import { DECO_COLORS as C } from './palette'
import vita from './vita.module.css'

// Contact as the revival chamber at the bottom of the city, where the survivor always comes back. When
// it comes into view its glass lights teal, he is put back together inside it from the feet up, the
// frosted doors part on him standing ready, and the contact plate slides out beside the chamber with the
// neon heading, his line and the ways to reach him. Pointing at the chamber makes him come back again.
//
// Pattern: the shared usePoseSequence plays revive then the idle (mounted on the trigger, so the revive
// starts when the chamber is seen); the glow, the doors and the plate are CSS delays off data-on (glow
// 0 s, doors 1.7 s, plate 2 s). Reduced motion: he stands in the open chamber, the plate in place.

const CONTACT_HEADING = headingId('deco', 'Contact')
const ENTRANCE: readonly DecoMotion[] = ['revive']

// The chamber's gold deco crown: fanned wings round a sunburst.
function Crown() {
  return (
    <svg viewBox="0 0 160 50" className="absolute -top-10 left-0 h-12 w-full" aria-hidden="true" focusable="false">
      <path d="M4 50 L24 10 L40 50 Z M156 50 L136 10 L120 50 Z" fill={C.brassMid} stroke={C.gold} strokeWidth="1.5" />
      <path d="M40 50 Q80 0 120 50 Z" fill={C.gold} />
      {[-50, -25, 0, 25, 50].map((angle) => (
        <path key={angle} d="M80 50 V18" stroke={C.brassDark} strokeWidth="2" transform={`rotate(${angle} 80 50)`} />
      ))}
      <circle cx="80" cy="48" r="7" fill={C.vita} />
    </svg>
  )
}

function RevivedSurvivor() {
  const { pose, play, advance } = usePoseSequence<DecoMotion>({ entrance: ENTRANCE, rest: 'idle', still: 'still', policy: 'rest' })
  return (
    <div className="absolute bottom-2 left-1/2 h-44 w-28 -translate-x-1/2" onPointerEnter={() => play('revive')}>
      <SurvivorSprite profession="engineer" motion={pose} onDone={advance} className="h-full w-full" />
    </div>
  )
}

/** The closing section: he comes back in the chamber and the contact plate comes out beside it. */
export function VitaChamber() {
  const { sections, navigation } = useLabels()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.25 })

  return (
    <section
      ref={ref}
      data-on={triggered || undefined}
      aria-labelledby={CONTACT_HEADING}
      className={`relative z-20 mx-auto flex max-w-5xl flex-col items-center gap-14 px-4 py-20 md:flex-row md:gap-12 ${vita.bay}`}
    >
      <div className={`relative h-60 w-40 flex-shrink-0 ${vita.tube}`} aria-hidden="true">
        <Crown />
        <span className={`absolute inset-0 ${vita.glow}`} />
        {triggered && <RevivedSurvivor />}
        <span className={`absolute inset-y-0 left-0 w-1/2 ${vita.door} ${vita.doorLeft}`} />
        <span className={`absolute inset-y-0 right-0 w-1/2 ${vita.door} ${vita.doorRight}`} />
        <span className={`absolute -bottom-3 left-1/2 h-3 w-48 -translate-x-1/2 ${vita.base}`} />
      </div>

      <RecruiterHero
        render={({ line, actions }) => (
          <div className={`relative w-full flex-1 p-6 sm:p-8 ${vita.plate}`}>
            <h2 id={CONTACT_HEADING} className={`text-2xl uppercase tracking-[0.3em] ${vita.neon}`}>
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
