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

// His outfit plate: a window, white pixel lettering on black inside a white frame.
const OUTFIT_LOOK: WardrobeLook = { plate: RPG.void, text: RPG.text, ring: RPG.border }

// The hero as the genre's encounter screen: the battle field with its backdrop and him, turned to the
// visitor's pointer, then the window with his name and lines, the stats line and the command window (the
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

// The dusk sky in hard bands, top to bottom, on the 320 by 120 grid.
const SKY_BANDS: ReadonlyArray<readonly [number, number, string]> = [
  [0, 30, RPG.duskHigh],
  [30, 18, RPG.duskLow],
  [48, 10, RPG.duskHigh],
]

const STARS: ReadonlyArray<readonly [number, number]> = [[18, 8], [64, 20], [120, 6], [176, 16], [230, 10], [292, 22]]

/** The battle backdrop: a field at dusk in hard bands, the far hills and the near grass under him. */
function BattleBackdrop() {
  return (
    <svg viewBox="0 0 320 120" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false" shapeRendering="crispEdges">
      <rect width="320" height="120" fill={RPG.void} />
      {SKY_BANDS.map(([y, height, fill]) => (
        <rect key={y} y={y} width="320" height={height} fill={fill} />
      ))}
      {STARS.map(([x, y]) => (
        <rect key={x} x={x} y={y} width="1" height="1" fill={RPG.border} />
      ))}
      <path d="M0 74 L30 58 L64 70 L104 52 L150 68 L196 50 L240 66 L282 54 L320 64 V80 H0 Z" fill={RPG.hillFar} />
      <rect y="80" width="320" height="24" fill={RPG.hillNear} />
      <rect y="104" width="320" height="2" fill={RPG.mossDark} />
    </svg>
  )
}

interface EncounterProps {
  profession: Profession
  /** The window and everything under it (the stats line, the command window). */
  children: ReactNode
}

export function Encounter({ profession, children }: EncounterProps) {
  const switches = useSwitchCount(profession)
  const pointer = usePointerVars(!useReducedMotion())

  return (
    <div className="relative mx-auto max-w-3xl">
      {/* the battle field: the backdrop and him */}
      <div ref={pointer} className={`relative h-44 overflow-hidden sm:h-56 ${world.stage} ${sprite.battle}`} aria-hidden="true">
        <BattleBackdrop />
        <div className="absolute inset-x-0 bottom-2 flex justify-center">
          <div key={profession} data-worlds-figure="" className={switches > 0 ? world.turns : ''}>
            <StageWalker profession={profession} className={`h-[120px] w-20 sm:h-[150px] sm:w-[100px] ${world.idle}`} />
          </div>
        </div>
      </div>

      {/* out of the flow: across the field's top edge on a phone, at his right inside the field from sm */}
      <Wardrobe look={OUTFIT_LOOK} ready className={`c-wardrobe--fan-down-below-lg absolute left-0 -top-7 z-10 sm:left-[calc(50%_+_66px)] sm:top-28 ${PIXEL}`} />

      {children}

      {switches > 0 && <div key={switches} className={`pointer-events-none fixed inset-0 z-[70] bg-[color:var(--rpg-text)] ${world.flash}`} aria-hidden="true" />}
    </div>
  )
}
