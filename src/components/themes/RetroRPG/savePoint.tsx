'use client'

import { useState } from 'react'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { headingId } from '@/lib/cv/sectionText'
import type { Profession } from '@/lib/cv/professions'
import { ActionOptions } from './actions'
import { BODY, Box, Mark } from './panels'
import { PIXEL, RPG } from './palette'
import { Sparkles } from './walker'
import type { Scene } from './scenes'
import { RpgStage } from './stage'
import world from './world.module.css'
import { useLabels } from '@/components/cv/CVDataProvider'

// Contact as the save point: a journal open on its lectern over a glowing rune circle, which pulses over
// the closing window the way a save point glows in its room. Clicking it saves: the circle flares once,
// pixel sparks burst round it, the window flashes white and stays in its saved state (yellow border), and
// the window shows the save line, his name beside the profession, over the contact line and the options.
// On the stage behind (scenes.tsx) he walks up to the save point and kneels at it as the section comes in.
//
// Pattern: CSS loops for the pulse (steps(), opacity), one click state (data-saved) that plays the flare
// and the flash once per click (the key replays them).

const CONTACT_HEADING = headingId('rpg', 'Contact')

/** The save point: the rune circle on the floor, its glow, and the journal open on its lectern. */
function SaveRune() {
  return (
    <svg viewBox="0 0 16 16" className="h-full w-full" aria-hidden="true" focusable="false" shapeRendering="crispEdges">
      <g className={world.rune}>
        <rect x="1" y="12" width="14" height="3" fill={RPG.runeGlow} />
        <rect x="3" y="11" width="10" height="1" fill={RPG.runeGlow} />
      </g>
      <rect x="2" y="13" width="12" height="1" fill={RPG.runeCore} />
      <rect x="7" y="7" width="2" height="6" fill={RPG.woodDark} />
      <rect x="5" y="12" width="6" height="1" fill={RPG.woodDark} />
      <path d="M3 4 H8 V7 H3 Z M8 4 H13 V7 H8 Z" fill={RPG.border} />
      <rect x="7" y="4" width="2" height="3" fill={RPG.borderShade} />
      <rect x="4" y="5" width="3" height="1" fill={RPG.borderShade} />
      <rect x="9" y="5" width="3" height="1" fill={RPG.borderShade} />
    </svg>
  )
}

export function SavePoint({ profession, scene, still }: { profession: Profession; scene: Scene; still: boolean }) {
  const labels = useLabels()
  const [saves, setSaves] = useState(0)
  const saved = saves > 0

  return (
    <section data-scene={scene.id} data-saved={saved} className="relative z-20 px-4 pb-8 pt-[60svh] motion-reduce:pt-16 sm:px-6" aria-labelledby={CONTACT_HEADING}>
      {still && <RpgStage scene={scene} settled />}
      <div className="relative mx-auto max-w-3xl">
        <div className="relative mb-4 flex justify-center">
          <button
            type="button"
            onClick={() => setSaves((n) => n + 1)}
            className="relative h-14 w-14 p-1"
            aria-label={labels.actions.save}
          >
            <span key={saves} className={`block h-full w-full ${saved ? world.saveFlare : ''}`}>
              <SaveRune />
            </span>
          </button>
          {saved && <Sparkles key={saves} className="pointer-events-none absolute left-1/2 top-0 h-14 w-14 -translate-x-1/2 scale-150" />}
        </div>

        <RecruiterHero
          render={({ name, line, actions }) => (
            <Box className={world.saveBox}>
              {saved && <div key={saves} className={`pointer-events-none absolute inset-0 bg-[color:var(--rpg-text)] ${world.flash}`} aria-hidden="true" />}
              <h2 id={CONTACT_HEADING} className={`mb-4 text-base uppercase tracking-[0.2em] text-[color:var(--rpg-text)] sm:text-lg ${PIXEL}`}>
                {labels.sections.contact}
              </h2>
              <p className={`mb-4 flex flex-wrap justify-between gap-2 text-sm uppercase tracking-[0.12em] ${PIXEL} ${saved ? 'text-[color:var(--rpg-gold)]' : 'text-[color:var(--rpg-text)]'}`}>
                <span>{name}</span>
                <span>{labels.professions[profession]}</span>
              </p>
              <p className={`mb-6 ${BODY}`}>
                <Mark className="mr-2 text-[color:var(--rpg-gold)]" />
                {line}
              </p>
              <ActionOptions actions={actions} />
            </Box>
          )}
        />
      </div>
    </section>
  )
}
