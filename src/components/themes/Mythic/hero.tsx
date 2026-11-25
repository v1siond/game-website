'use client'

import type { ReactNode } from 'react'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { NameWords } from '@/components/cv/NameWords'
import { useLabels } from '@/components/cv/CVDataProvider'
import Wardrobe, { type WardrobeLook } from '@/components/worlds/Wardrobe'
import { ContactActions } from './buttons'
import { MYTH } from './palette'
import u from './underworld.module.css'

// His outfit plate: a bronze plaque on the dark panel, pale gold lettering and a gold rim.
const OUTFIT_LOOK: WardrobeLook = { plate: MYTH.panel, text: MYTH.goldPale, ring: MYTH.gold }

// The hero on the storm sea: his name carved on the stone, the headline on parchment, his line and the ways
// to reach him. He stands on the ship's deck left of them on the hero's stage behind (scenes.tsx), where the
// sea serpent's king head comes down on him as the page starts to scroll; the bay here keeps his place clear
// and carries the outfit plate. `still` is the stage drawn settled under reduced motion.
export function HallHero({ still }: { still?: ReactNode }) {
  const { navigation } = useLabels()

  return (
    <header data-worlds-hero="" data-scene="hero" className={`relative z-20 ${u.hall}`}>
      {still}
      <div className="relative mx-auto grid min-h-[92vh] max-w-6xl items-end gap-8 px-4 pb-16 pt-20 sm:px-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-center">
        <div className="relative mx-auto h-72 w-56 sm:h-80 sm:w-64">
          <Wardrobe look={OUTFIT_LOOK} className={`c-wardrobe--fan-down-below-md c-wardrobe--fan-down-from-lg absolute inset-x-0 bottom-[calc(100%_+_12px)] z-10 md:bottom-auto md:top-[calc(100%_+_2rem)] lg:bottom-[calc(100%_+_12px)] lg:top-auto ${u.display}`} />
        </div>
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="min-w-0">
              <h1>
                {/* one inner span, so the plate's flex row holds one item that wraps only between the words */}
                <span className={`${u.plate} ${u.display} text-[clamp(1.75rem,0.5rem+4.5vw,3.75rem)] leading-tight`}>
                  <span>
                    <NameWords name={name} />
                  </span>
                </span>
              </h1>
              <p className={`mt-5 inline-block px-5 py-2 text-lg sm:text-xl ${u.parchment}`}>{headline}</p>
              <div className={`mt-4 max-w-prose px-4 py-3 ${u.panel}`}>
                <p className="text-lg italic text-[var(--myth-gold-pale)]">{tagline}</p>
                <p className="mt-2 text-base text-[var(--myth-bone)]">{line}</p>
              </div>
              <nav className="mt-6 flex flex-wrap gap-3" aria-label={navigation.contactAndCv}>
                <ContactActions actions={actions} />
              </nav>
            </div>
          )}
        />
      </div>
    </header>
  )
}
