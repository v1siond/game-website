import { memo, type ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { pixelRuns, type Run } from '@/lib/pixelRuns'
import { RPG } from './palette'
import { COLOURS, EYES, MOVE_FRAMES, PART_TOP, SPRITE, actionPose, movePose, walkPose, type Facing, type MoveFrame, type Pose } from './sprite'
import sprite from './sprite.module.css'
import type { PixelSprite } from './npcs'
import { PixelRuns } from '../shared/PixelRuns'

// Him as the room walker (the pixel data in sprite.ts), drawn as one rect per run of a colour on the
// 20 by 30 grid with crisp edges. Each component draws only the frames its place needs; sprite.module.css
// shows one at a time by opacity in steps, the way sprite frames swap, and moves the whole sprite by
// transform. The figures are memoised and their runs worked out once per rows and place, since every
// sprite row is module data that never changes.

const RUNS = new WeakMap<readonly string[], Map<string, Run[]>>()

/** The rows' runs placed at `top` and `left`, from the cache once they have been worked out. */
function runsOf(rows: readonly string[], top: number, left = 0): Run[] {
  const placed = RUNS.get(rows) ?? new Map<string, Run[]>()
  RUNS.set(rows, placed)
  const at = `${top},${left}`
  const known = placed.get(at)
  if (known) return known
  const runs = pixelRuns(rows, top, left)
  placed.set(at, runs)
  return runs
}

function Pixels({ pose, colours }: { pose: Pose; colours: Record<string, string> }) {
  const runs = [...runsOf(pose.head, PART_TOP.head), ...runsOf(pose.torso, PART_TOP.torso), ...runsOf(pose.legs, PART_TOP.legs)]
  return <PixelRuns runs={runs} colours={colours} />
}

function Sheet({ className, children }: { className: string; children: ReactNode }) {
  return (
    <svg
      viewBox={`0 0 ${SPRITE.width} ${SPRITE.height}`}
      className={`overflow-visible ${sprite.pixelated} ${className}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <rect x={4} y={SPRITE.height - 1} width={12} height={1} fill={RPG.void} opacity={0.45} />
      {children}
    </svg>
  )
}

interface StageWalkerProps {
  profession: Profession
  className?: string
}

/**
 * Him on the battle field: he stands facing down and turns left or right to face the visitor's pointer
 * (--mx from the shared pointer hook on a parent). Hovering the field is a battle moment: he plays his
 * profession's two frame action.
 */
const FACINGS: ReadonlyArray<readonly [Facing, string]> = [
  ['down', sprite.faceDown],
  ['right', sprite.faceRight],
  ['left', sprite.faceLeft],
]

export const StageWalker = memo(function StageWalker({ profession, className = '' }: StageWalkerProps) {
  const colours = COLOURS[profession]

  return (
    <Sheet className={className}>
      {FACINGS.map(([facing, faceClass]) => (
        <g key={facing} className={`${sprite.stand} ${faceClass}`}>
          <Pixels pose={walkPose(profession, facing, 'stand')} colours={colours} />
        </g>
      ))}
      <g className={`${sprite.stand} ${sprite.faceDown}`}>
        <g className={sprite.blink}>
          {EYES.map(([x, y]) => (
            <rect key={x} x={x} y={y} width={1} height={1} fill={colours.S} />
          ))}
        </g>
      </g>
      <g className={sprite.actA}>
        <Pixels pose={actionPose(profession, 'actA')} colours={colours} />
      </g>
      <g className={sprite.actB}>
        <Pixels pose={actionPose(profession, 'actB')} colours={colours} />
      </g>
    </Sheet>
  )
})

/** His frames on a stage (stage.tsx): standing facing down, two steps facing right, his profession's two
 *  action frames and the genre's moves facing right. */
export type Frame = 'stand' | 'stepA' | 'stepB' | 'actA' | 'actB' | MoveFrame

/**
 * Him on a stage, on his 20 by 30 grid with his feet at its bottom middle (0, 0): every frame drawn once,
 * all but the standing one hidden, and the scroll shows one at a time (the shared stage's frames, through
 * the rig in stage.tsx).
 */
export const StageFigure = memo(function StageFigure({ profession }: { profession: Profession }) {
  const colours = COLOURS[profession]
  const poses: ReadonlyArray<readonly [Frame, Pose]> = [
    ['stand', walkPose(profession, 'down', 'stand')],
    ['stepA', walkPose(profession, 'right', 'stepA')],
    ['stepB', walkPose(profession, 'right', 'stepB')],
    ['actA', actionPose(profession, 'actA')],
    ['actB', actionPose(profession, 'actB')],
    ...MOVE_FRAMES.map((move) => [move, movePose(move)] as const),
  ]

  return (
    <g transform={`translate(${-SPRITE.width / 2} ${-SPRITE.height})`}>
      <rect x={4} y={SPRITE.height - 1} width={12} height={1} fill={RPG.void} opacity={0.45} />
      {poses.map(([frame, pose]) => (
        <g key={frame} data-frame={frame} visibility={frame === 'stand' ? 'visible' : 'hidden'}>
          <Pixels pose={pose} colours={colours} />
        </g>
      ))}
    </g>
  )
})

/** The save sparkle: four point pixel sparks that burst round the save point when he saves. */
export function Sparkles({ className = '' }: { className?: string }) {
  const spots: ReadonlyArray<readonly [number, number]> = [
    [1, 6],
    [17, 2],
    [15, 16],
  ]
  return (
    <svg viewBox="0 0 22 22" className={className} shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      {spots.map(([x, y]) => (
        <path key={x} className={sprite.sparkle} d={`M${x + 2} ${y} h1 v2 h2 v1 h-2 v2 h-1 v-2 h-2 v-1 h2 Z`} fill={RPG.gold} />
      ))}
    </svg>
  )
}

/** A cast sprite (npcs.ts) as one rect per run, placed at x, y inside a room's SVG. */
export function PixelArt({ sprite: { rows, colours }, x = 0, y = 0, className }: { sprite: PixelSprite; x?: number; y?: number; className?: string }) {
  return (
    <g className={className}>
      <PixelRuns runs={runsOf(rows, y, x)} colours={colours} />
    </g>
  )
}
