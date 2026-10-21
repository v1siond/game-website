'use client'

import type { CSSProperties } from 'react'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { RansomWord, StarBurst } from './backdrop'
import { CVLink, EngineLink, HeroAction } from './actions'
import { NOIR } from './palette'
import world from './world.module.css'

// The recruiter first screen as a calling card thrown at the screen: the card spins in and lands
// crooked, his name drops onto it letter by letter in ransom note cut-outs, then the headline and the
// actions slash in. The card and the burst behind it lean toward the pointer (--mx, --my on the root).
//
// Pattern: CSS only, one trigger. useSectionTrigger adds data-on once the header is in view; every
// phase is a CSS delay off that one switch (card 0 to 560 ms, letters from 420 ms, 45 ms apart, the rest
// after the last letter through --n), so React renders once and the reveal never replays.

export function CallingCardHero() {
  const { ref, triggered } = useSectionTrigger({ threshold: 0.1, rootMargin: '0px' })
  const { navigation } = useLabels()

  return (
    <RecruiterHero
      render={({ name, headline, tagline, line, actions }) => (
        <div
          ref={ref}
          data-on={triggered || undefined}
          className={`mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] ${world.hero}`}
          style={{ '--n': name.length } as CSSProperties}
        >
          <div className={`relative ${world.follow}`}>
            <div className="pointer-events-none absolute -inset-10 opacity-60" aria-hidden="true">
              <StarBurst className={`h-full w-full ${world.spin}`} light={NOIR.red} dark={NOIR.ink} />
            </div>
            <div className={world.lean}>
              <div className={`relative px-5 py-8 sm:px-8 sm:py-10 ${world.card} ${world.slab}`}>
                <h1 className="text-5xl uppercase sm:text-7xl">
                  <RansomWord text={name} />
                </h1>
                <p className={`mt-5 inline-block px-3 py-1 text-xl uppercase tracking-widest ${world.heading} ${world.after}`}>{headline}</p>
              </div>
            </div>
          </div>

          <div className={world.after}>
            <p className={`text-lg italic text-[color:var(--noir-paper)] ${world.copy}`}>{tagline}</p>
            <p className={`mt-2 text-base text-[color:var(--noir-paper-dim)] ${world.copy}`}>{line}</p>
            <nav className="mt-6 flex flex-wrap items-center gap-3" aria-label={navigation.contactAndCv}>
              {actions.map((action) => (
                <HeroAction key={action.id} action={action} />
              ))}
              <CVLink />
              <EngineLink />
            </nav>
          </div>
        </div>
      )}
    />
  )
}
