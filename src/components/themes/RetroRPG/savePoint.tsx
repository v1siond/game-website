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

// Contact as the save point: a star of light over its glow, which pulses over the closing window the way
// a save point sparkles in its room. Clicking it saves: the star flares once,
// pixel sparks burst round it, the window flashes white and stays in its saved state (yellow border), and
// the window shows the save line, his name beside the profession, over the contact line and the options.
// On the stage behind (scenes.tsx) he walks up to the save star and touches it, and the save box opens.
//
// Pattern: CSS loops for the pulse (steps(), opacity), one click state (data-saved) that plays the flare
// and the flash once per click (the key replays them).

const CONTACT_HEADING = headingId('rpg', 'Contact')

/** The save point: a four point star of light over its glow, drawn for this page. */
function SaveStar() {
  return (
    <svg viewBox="0 0 16 16" className="h-full w-full" aria-hidden="true" focusable="false" shapeRendering="crispEdges">
      <g className={world.starGlow}>
        <rect x="3" y="3" width="10" height="10" fill={RPG.gold} opacity="0.35" />
      </g>
      <path d="M8 1 L9.5 6.5 L15 8 L9.5 9.5 L8 15 L6.5 9.5 L1 8 L6.5 6.5 Z" fill={RPG.gold} />
      <rect x="7" y="7" width="2" height="2" fill={RPG.border} />
    </svg>
  )
}

export function SavePoint({ profession, scene, still }: { profession: Profession; scene: Scene; still: boolean }) {
  const labels = useLabels()
  const [saves, setSaves] = useState(0)
  const saved = saves > 0

  return (
    <section data-scene={scene.id} data-saved={saved} className="relative z-20 px-4 pb-8 pt-[60svh] motion-reduce:pt-16 max-md:pt-[130svh] sm:px-6" aria-labelledby={CONTACT_HEADING}>
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
              <SaveStar />
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
