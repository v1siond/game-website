'use client'

import { useMemo, type ReactNode } from 'react'
import type { CVData } from '@/lib/cv/content'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useTimedSteps } from '@/hooks/useTimedSteps'
import { useZoneStageContext } from '@/hooks/useZoneStage'
import { fillLabel } from '@/lib/cv/labels'
import { DwellerSprite, HOIST_GRIP, VIEW, turn, type Point } from './dweller'
import { BRASS, CHROME, OLIVE, OLIVE_DARK, OLIVE_LIGHT, PHOSPHOR, POSTER_INK } from './palette'
import atomic from './atomic.module.css'
import j from './journey.module.css'
import { cssVars } from '@/lib/cssVars'

// Tech stack as looting a footlocker, the game's container screen. When the stage turns on he squats,
// grabs the olive locker off the floor and hoists it onto his shoulder in the wide, strained carry stance
// (the dweller's hoist motion), the lid flips open and the locker shakes once per pocket while each
// pocket of the inventory tumbles out of it into the panel below. The carry weight under him ticks up by
// that pocket's item count as it lands, the bar filling with it. The pour timing lives here once and
// reaches the CSS as --pour and --pocket on the wrapper; under reduced motion everything is in place and
// the weight is full from the start.

const POUR_MS = 1500
const POCKET_MS = 320

// The locker's drawing in px (its viewBox draws 1 to 1): the box, the lid on its hinge at the lid's bottom
// left, and the two turns of the carry, the lid flipped open and the whole locker tilted on his shoulder
// round its handle. journey.module.css reads the turns and the hinge as --lid-open, --carry-tilt and
// --lid-hinge, and the room he keeps for the lid is worked out from the same numbers below.
const LOCKER = { width: 80, height: 56 }
const LID = { x: 6, y: 10, width: 68, height: 12 }
const HINGE = { x: LID.x, y: LID.y + LID.height }
const LID_OPEN_DEG = -118
const CARRY_TILT_DEG = -12

// His box in px, and his drawing inside it at his viewBox's ratio, centred, where his hand ends the hoist.
const BOX = { width: 86.4, height: 128 }
const DRAWN_WIDTH = (BOX.height * VIEW.width) / VIEW.height
const GRIP = {
  left: (BOX.width - DRAWN_WIDTH) / 2 + (HOIST_GRIP.x / VIEW.width) * DRAWN_WIDTH,
  top: (HOIST_GRIP.y / VIEW.height) * BOX.height,
}

const corners = ({ x, y, width, height }: Point & { width: number; height: number }): Point[] => [
  { x, y },
  { x: x + width, y },
  { x, y: y + height },
  { x: x + width, y: y + height },
]

// The handle at the locker's bottom centre: the point his hand holds and the point the carry tilts round.
const HANDLE = { x: LOCKER.width / 2, y: LOCKER.height }
const CARRIED = [...corners(LID).map((point) => turn(point, HINGE, LID_OPEN_DEG)), ...corners({ x: 0, y: 0, ...LOCKER })].map((point) =>
  turn(point, HANDLE, CARRY_TILT_DEG),
)

// How far the open locker reaches left of and above his hand, and the room his box keeps on its left and
// above it, so the lid stays inside his row and under the heading.
const REACH = {
  left: Math.max(...CARRIED.map((point) => HANDLE.x - point.x)),
  up: Math.max(...CARRIED.map((point) => HANDLE.y - point.y)),
}

const CARRY = cssVars({
  '--view': `${VIEW.width} / ${VIEW.height}`,
  '--grip-x': `${(HOIST_GRIP.x / VIEW.width) * 100}%`,
  '--grip-y': `${(HOIST_GRIP.y / VIEW.height) * 100}%`,
  '--box-w': `${BOX.width}px`,
  '--box-h': `${BOX.height}px`,
  '--room-left': `${Math.max(0, REACH.left - GRIP.left)}px`,
  '--room-top': `${Math.max(0, REACH.up - GRIP.top)}px`,
  '--locker-w': `${LOCKER.width}px`,
  '--locker-h': `${LOCKER.height}px`,
  '--lid-hinge': `${HINGE.x}px ${HINGE.y}px`,
  '--lid-open': `${LID_OPEN_DEG}deg`,
  '--carry-tilt': `${CARRY_TILT_DEG}deg`,
})

/** How many pockets have landed: none until the pour starts, then one more every POCKET_MS. */
function useLanded(on: boolean, total: number, instant: boolean) {
  const pockets = useMemo(() => Array.from({ length: total }, () => POCKET_MS), [total])
  // Step n is pocket n + 1 landed, so before the first step none has.
  return useTimedSteps(pockets, { on, reduced: instant, firstMs: POUR_MS + POCKET_MS }) + 1
}

/** The olive drab footlocker seen from the front: steel corners, a brass latch, the lid on its side hinge. */
function Footlocker() {
  return (
    <svg viewBox={`0 0 ${LOCKER.width} ${LOCKER.height}`} className="h-full w-full overflow-visible" focusable="false">
      <g className={j.lockerLid}>
        <rect x={LID.x} y={LID.y} width={LID.width} height={LID.height} rx={2} fill={OLIVE_LIGHT} stroke={POSTER_INK} strokeWidth={2.5} />
        <path d="M6 16 H74" stroke={OLIVE_DARK} strokeWidth={1.5} />
      </g>
      <rect x={9} y={22} width={62} height={6} fill={PHOSPHOR} className={j.lockerGlow} />
      <rect x={6} y={22} width={68} height={30} rx={2} fill={OLIVE} stroke={POSTER_INK} strokeWidth={2.5} />
      <path d="M6 30 H74 M6 44 H74" stroke={OLIVE_DARK} strokeWidth={2} />
      {[6, 66].map((x) => (
        <rect key={x} x={x} y={22} width={8} height={30} fill={CHROME} stroke={POSTER_INK} strokeWidth={1.5} />
      ))}
      <rect x={34} y={24} width={12} height={10} rx={1.5} fill={BRASS} stroke={POSTER_INK} strokeWidth={1.5} />
      <path d="M24 52 Q24 58 30 58 H50 Q56 58 56 52" fill="none" stroke={POSTER_INK} strokeWidth={2.5} />
    </svg>
  )
}

function CarryWeight({ weight, total }: { weight: number; total: number }) {
  const { hud } = useLabels()

  return (
    <div className={`min-w-0 flex-1 p-3 sm:max-w-sm ${atomic.panel}`}>
      <p className="text-sm font-bold uppercase tracking-widest text-atomic-phosphor">{fillLabel(hud.carryWeight, { count: weight, total })}</p>
      <span className="mt-2 block h-3 w-full overflow-hidden border border-atomic-phosphor" aria-hidden="true">
        <span className={`block h-full w-full origin-left bg-atomic-phosphor ${j.weightFill}`} style={cssVars({ '--weight': total ? weight / total : 0 })} />
      </span>
    </div>
  )
}

export function Loot({ categories, on, children }: { categories: CVData['techStack']; on: boolean; children: ReactNode }) {
  const { reduced } = useZoneStageContext()
  const landed = useLanded(on, categories.length, reduced)
  const weight = categories.slice(0, landed).reduce((sum, category) => sum + category.items.length, 0)
  const total = categories.reduce((sum, category) => sum + category.items.length, 0)
  const timing = cssVars({ '--pour': `${POUR_MS}ms`, '--pocket': `${POCKET_MS}ms`, '--pockets': categories.length })

  return (
    <div style={timing}>
      <div className="mb-4 flex items-end gap-4 sm:gap-6">
        <div className="relative ml-[var(--room-left)] mt-[var(--room-top)] h-[var(--box-h)] w-[var(--box-w)] shrink-0" style={CARRY} aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-full -translate-x-1/2 aspect-[var(--view)]">
            {/* the locker's handle, its bottom centre, hangs from his hand */}
            <span className={`absolute left-[var(--grip-x)] top-[var(--grip-y)] ml-[calc(var(--locker-w)/-2)] mt-[calc(var(--locker-h)*-1)] block h-[var(--locker-h)] w-[var(--locker-w)] ${j.locker}`}>
              <span className={`block h-full w-full ${j.lockerShake}`}>
                <Footlocker />
              </span>
            </span>
            <DwellerSprite profession="engineer" motion={on ? 'hoist' : 'still'} className="absolute inset-0 h-full w-full" />
          </div>
        </div>
        <CarryWeight weight={weight} total={total} />
      </div>
      {children}
    </div>
  )
}
