'use client'

import { useState } from 'react'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { headingId } from '@/components/cv/sectionText'
import type { Profession } from '@/lib/cv/professions'
import { ActionOptions } from './actions'
import { BODY, Box, Mark, Typed } from './panels'
import { PIXEL, RPG } from './palette'
import { usePlay } from './play'
import world from './world.module.css'
import { useLabels } from '@/components/cv/CVDataProvider'

// Contact as the save point: the yellow star twinkles over the closing box the way the game's save
// point flickers in its room. Clicking the star saves: it spins once fast, the box flashes white and
// stays in its saved state (yellow border, the star lit), and the box shows the save line, his name
// beside the profession, over the contact line and the options.
//
// Pattern: CSS loops for the twinkle (steps(), opacity and a scaleX turn), one click state (data-saved)
// that plays the spin and the flash once per click (the key replays them). The box opens with the same
// stepped reveal as every other box when it scrolls in.

const CONTACT_HEADING = headingId('rpg', 'Contact')

/** The save star: a four point pixel star in its glow, the core lighter than the points. */
function SaveStar() {
  return (
    <svg viewBox="0 0 15 15" className="h-full w-full" aria-hidden="true" focusable="false" shapeRendering="crispEdges">
      <rect x="2" y="2" width="11" height="11" fill={RPG.starGlow} className={world.glow} />
      <g className={world.star}>
        <path d="M7 0 H8 V4 H9 V6 H11 V7 H15 V8 H11 V9 H9 V11 H8 V15 H7 V11 H6 V9 H4 V8 H0 V7 H4 V6 H6 V4 H7 Z" fill={RPG.gold} />
        <rect x="6" y="6" width="3" height="3" fill={RPG.starCore} />
      </g>
    </svg>
  )
}

export function SavePoint({ profession }: { profession: Profession }) {
  const labels = useLabels()
  const [saves, setSaves] = useState(0)
  const saved = saves > 0
  const { ref, play } = usePlay(2400)

  return (
    <section ref={ref} data-play={play} data-saved={saved} className="relative z-20 px-4 pb-8 pt-16 sm:px-6" aria-labelledby={CONTACT_HEADING}>
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex justify-center">
          <button
            type="button"
            onClick={() => setSaves((n) => n + 1)}
            className="relative h-14 w-14 p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--rpg-text)]"
            aria-label={labels.actions.spinStar}
          >
            <span key={saves} className={`block h-full w-full ${saved ? world.saveSpin : ''}`}>
              <SaveStar />
            </span>
          </button>
        </div>

        <RecruiterHero
          render={({ name, line, actions }) => (
            <Box className={`${world.opens} ${world.saveBox}`}>
              {saved && <div key={saves} className={`pointer-events-none absolute inset-0 bg-[color:var(--rpg-text)] ${world.flash}`} aria-hidden="true" />}
              <h2 id={CONTACT_HEADING} className={`mb-4 text-base uppercase tracking-[0.2em] text-[color:var(--rpg-text)] sm:text-lg ${PIXEL}`}>
                <Typed pace="short" delay="open">
                  {labels.sections.contact}
                </Typed>
              </h2>
              <p className={`mb-4 flex flex-wrap justify-between gap-2 text-sm uppercase tracking-[0.12em] ${PIXEL} ${saved ? 'text-[color:var(--rpg-gold)]' : 'text-[color:var(--rpg-text)]'}`}>
                <span>{name}</span>
                <span>{labels.professions[profession]}</span>
              </p>
              <p className={`mb-6 ${BODY}`}>
                <Mark className="mr-2 text-[color:var(--rpg-gold)]" />
                <Typed pace="long" delay="second">
                  {line}
                </Typed>
              </p>
              <ActionOptions actions={actions} />
            </Box>
          )}
        />
      </div>
    </section>
  )
}
