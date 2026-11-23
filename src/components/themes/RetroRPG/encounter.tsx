'use client'

import { useState, type ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { usePointerVars } from '@/hooks/usePointerVars'
import { StageWalker } from './walker'
import sprite from './sprite.module.css'
import { PIXEL, RPG } from './palette'
import Wardrobe, { type WardrobeLook } from '@/components/worlds/Wardrobe'
import world from './world.module.css'

// His outfit plate: a battle box, white pixel lettering on black inside a white frame.
const OUTFIT_LOOK: WardrobeLook = { plate: RPG.void, text: RPG.text, ring: RPG.border }

// The hero as the game's encounter screen: the monster area with the battle backdrop and him, turned to
// the visitor's pointer, then the box with his name and lines, the stats line and the command row (the
// children). A profession switch plays two things once: the screen flashes white and his sprite turns
// through four hard frames into the new outfit.

/** Counts profession switches after the first render, so the flash and the turn play only on a switch. */
// Adjusted during render from the previous value (React's pattern for state derived from a prop change),
// so no effect runs a second render after the switch.
function useSwitchCount(profession: Profession) {
  const [seen, setSeen] = useState(profession)
  const [count, setCount] = useState(0)

  if (profession !== seen) {
    setSeen(profession)
    setCount(count + 1)
  }

  return count
}

// ---- the art ----

const NEAR_PANELS = [0, 1, 2, 3, 4, 5, 6, 7]
const FAR_PANELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

/** The battle backdrop: two rows of green outlined panels, the far row smaller and dimmer, over a haze. */
function BattleBackdrop() {
  return (
    <svg viewBox="0 0 320 120" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false" shapeRendering="crispEdges">
      <defs>
        <linearGradient id="rpg-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={RPG.void} />
          <stop offset="0.7" stopColor={RPG.haze} />
          <stop offset="1" stopColor={RPG.void} />
        </linearGradient>
      </defs>
      <rect width="320" height="120" fill="url(#rpg-haze)" />
      {FAR_PANELS.map((i) => (
        <rect key={`f${i}`} x={4 + i * 26} y={18} width={22} height={34} fill="none" stroke={RPG.panelFar} strokeWidth="1" />
      ))}
      {NEAR_PANELS.map((i) => (
        <g key={`n${i}`}>
          <rect x={2 + i * 40} y={46} width={36} height={52} fill="none" stroke={RPG.panelNear} strokeWidth="2" />
          <rect x={8 + i * 40} y={52} width={24} height={40} fill="none" stroke={RPG.panelFar} strokeWidth="1" />
        </g>
      ))}
      <rect y="104" width="320" height="2" fill={RPG.panelFar} />
    </svg>
  )
}

interface EncounterProps {
  profession: Profession
  /** The box and everything under it (the stats line, the command row). */
  children: ReactNode
}

export function Encounter({ profession, children }: EncounterProps) {
  const switches = useSwitchCount(profession)
  const pointer = usePointerVars(!useReducedMotion())

  return (
    <div className="relative mx-auto max-w-3xl">
      {/* the monster area: the backdrop and him */}
      <div ref={pointer} className={`relative h-44 overflow-hidden sm:h-56 ${world.stage} ${sprite.battle}`} aria-hidden="true">
        <BattleBackdrop />
        <div className="absolute inset-x-0 bottom-2 flex justify-center">
          <div key={profession} data-worlds-figure="" className={switches > 0 ? world.turns : ''}>
            <StageWalker profession={profession} className={`h-[120px] w-20 sm:h-[150px] sm:w-[100px] ${world.idle}`} />
          </div>
        </div>
      </div>

      {/* out of the flow: across the stage's top edge on a phone, at his right inside the stage from sm */}
      <Wardrobe look={OUTFIT_LOOK} ready className={`c-wardrobe--fan-down-below-lg absolute left-0 -top-7 z-10 sm:left-[calc(50%_+_66px)] sm:top-28 ${PIXEL}`} />

      {children}

      {switches > 0 && <div key={switches} className={`pointer-events-none fixed inset-0 z-[70] bg-[color:var(--rpg-text)] ${world.flash}`} aria-hidden="true" />}
    </div>
  )
}
