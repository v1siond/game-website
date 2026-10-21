'use client'

import { useEffect, useState, type ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { usePreview } from '@/themes/PreviewContext'
import { usePointerVars } from '@/hooks/usePointerVars'
import { RoomWalker, StageWalker } from './walker'
import sprite from './sprite.module.css'
import { RPG } from './palette'
import type { Play } from './play'
import { Soul } from './soul'
import world from './world.module.css'

// The hero entrance, played as the game's encounter start, once, when the hero first shows:
//
//   walk   0ms     he walks into the violet room from the left, three tiles in two step frames
//   alert  600ms   he stops facing down, the exclamation mark pops over his head
//   cut    1300ms  the room cuts to black, the red heart blinks three times where he stood
//   open   1850ms  the heart drops toward the box, the battle backdrop and his sprite step in, the box
//                  opens as a line then full height and its lines type (the CSS reveal, data-play="on")
//   ready  4300ms  everything rests on its last frame (data-play="done")
//
// Pattern: setTimeout phases (a fixed choreography, no per frame values), each phase a data-phase value
// the CSS reads; every move is a steps() keyframe on transform or opacity. Reduced motion and a World
// Select preview start on ready.
//
// A profession switch replays two things on top: the screen flashes white once and his sprite turns
// through four hard frames into the new outfit.

type Phase = 'wait' | 'walk' | 'alert' | 'cut' | 'open' | 'ready'

const PHASE_AT: ReadonlyArray<readonly [Phase, number]> = [
  ['walk', 0],
  ['alert', 600],
  ['cut', 1300],
  ['open', 1850],
  ['ready', 4300],
]

const PLAY_OF: Record<Phase, Play> = {
  wait: 'idle',
  walk: 'idle',
  alert: 'idle',
  cut: 'idle',
  open: 'on',
  ready: 'done',
}

function useEncounterPhase() {
  const { ref, triggered } = useSectionTrigger({ threshold: 0.1 })
  const reduced = useReducedMotion()
  const preview = usePreview()
  const [phase, setPhase] = useState<Phase>('wait')
  const skip = reduced || preview

  useEffect(() => {
    if (skip) {
      setPhase('ready')
      return
    }
    if (!triggered) return
    const timers = PHASE_AT.map(([next, at]) => window.setTimeout(() => setPhase((now) => (now === 'ready' ? now : next)), at))
    return () => timers.forEach(window.clearTimeout)
  }, [triggered, skip])

  return { ref, phase, skip }
}

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

const BRICK_ROWS = [0, 1, 2, 3, 4, 5]
const BRICKS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const FLOOR_ROWS = [0, 1, 2, 3]

/** The room before the encounter: violet brick lit from above, a tiled floor in depth, a beam of light. */
function Room() {
  return (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false" shapeRendering="crispEdges">
      <defs>
        <linearGradient id="rpg-wall-light" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={RPG.wallLit} />
          <stop offset="1" stopColor={RPG.wall} />
        </linearGradient>
        <linearGradient id="rpg-floor-depth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={RPG.floorDark} />
          <stop offset="1" stopColor={RPG.floor} />
        </linearGradient>
        <linearGradient id="rpg-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={RPG.beam} stopOpacity="0.5" />
          <stop offset="1" stopColor={RPG.beam} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="320" height="96" fill="url(#rpg-wall-light)" />
      {BRICK_ROWS.map((row) => (
        <g key={row}>
          <rect y={row * 16 + 15} width="320" height="1" fill={RPG.mortar} />
          {BRICKS.map((col) => (
            <rect key={col} x={col * 32 + (row % 2) * 16} y={row * 16} width="1" height="16" fill={RPG.mortar} />
          ))}
        </g>
      ))}
      <rect y="96" width="320" height="84" fill="url(#rpg-floor-depth)" />
      {FLOOR_ROWS.map((row) => (
        <rect key={row} y={96 + row * row * 6 + row * 8} width="320" height="1" fill={RPG.floorDark} />
      ))}
      <polygon points="130,0 190,0 230,180 90,180" fill="url(#rpg-beam)" />
      <ellipse cx="160" cy="158" rx="22" ry="5" fill={RPG.mortar} opacity="0.6" />
    </svg>
  )
}

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

/** The exclamation mark over his head: white pixels in a black outlined bubble. */
function Alert() {
  return (
    <svg viewBox="0 0 9 12" className={`h-8 w-6 ${world.alert}`} aria-hidden="true" focusable="false" shapeRendering="crispEdges">
      <path d="M2 0 H7 V1 H8 V9 H7 V10 H5 V12 H4 V10 H2 V9 H1 V1 H2 Z" fill={RPG.void} />
      <rect x={4} y={2} width={1} height={5} fill={RPG.text} />
      <rect x={4} y={8} width={1} height={1} fill={RPG.text} />
    </svg>
  )
}

interface EncounterProps {
  profession: Profession
  /** The box and everything under it (the stats line, the command row); it plays with the encounter. */
  children: ReactNode
}

export function Encounter({ profession, children }: EncounterProps) {
  const { ref, phase, skip } = useEncounterPhase()
  const switches = useSwitchCount(profession)
  const pointer = usePointerVars(!skip)

  return (
    <div ref={ref} data-phase={phase} data-play={PLAY_OF[phase]} className="relative mx-auto max-w-3xl">
      {/* the monster area: the backdrop and him */}
      <div ref={pointer} className={`relative h-44 overflow-hidden sm:h-56 ${world.stage} ${sprite.battle}`} aria-hidden="true">
        <BattleBackdrop />
        <div className="absolute inset-x-0 bottom-2 flex justify-center">
          <div key={profession} className={switches > 0 ? world.turns : ''}>
            <StageWalker profession={profession} className={`h-[120px] w-20 sm:h-[150px] sm:w-[100px] ${world.idle}`} />
          </div>
        </div>
      </div>

      {children}

      {/* the room and the cut, over everything until the encounter opens */}
      <div className={`pointer-events-none absolute inset-0 z-20 bg-[color:var(--rpg-void)] ${world.room}`} aria-hidden="true">
        <div className="relative h-44 overflow-hidden sm:h-56">
          <Room />
          <div className="absolute inset-x-0 bottom-4 flex flex-col items-center">
            <Alert />
            <RoomWalker profession={profession} facing="right" className={`h-[90px] w-[60px] sm:h-[120px] sm:w-20 ${sprite.walksRight}`} />
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-28 z-30 flex justify-center sm:top-36" aria-hidden="true">
        <Soul className={`h-6 w-7 ${world.encounterSoul}`} />
      </div>

      {switches > 0 && <div key={switches} className={`pointer-events-none fixed inset-0 z-[70] bg-[color:var(--rpg-text)] ${world.flash}`} aria-hidden="true" />}
    </div>
  )
}
