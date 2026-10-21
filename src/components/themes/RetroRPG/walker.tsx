import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { RPG } from './palette'
import { COLOURS, EYES, HEART, PART_TOP, SPRITE, actionPose, pixelRuns, walkPose, type Facing, type Pose } from './sprite'
import sprite from './sprite.module.css'

// Him as the room walker (the pixel data in sprite.ts), drawn as one rect per run of a colour on the
// 20 by 30 grid with crisp edges. Each component draws only the frames its place needs; sprite.module.css
// shows one at a time by opacity in steps, the way sprite frames swap, and moves the whole sprite by
// transform.

function Pixels({ pose, colours }: { pose: Pose; colours: Record<string, string> }) {
  const runs = [
    ...pixelRuns(pose.head, PART_TOP.head),
    ...pixelRuns(pose.torso, PART_TOP.torso),
    ...pixelRuns(pose.legs, PART_TOP.legs),
  ]
  return (
    <>
      {runs.map((run) => (
        <rect key={`${run.x}-${run.y}`} x={run.x} y={run.y} width={run.width} height={1} fill={colours[run.key]} />
      ))}
    </>
  )
}

/** The red heart over his chest, his soul, shown in the battle moments. */
function ChestSoul({ className }: { className: string }) {
  return (
    <g className={className}>
      {pixelRuns(HEART.rows, HEART.y, HEART.x).map((run) => (
        <rect key={`${run.x}-${run.y}`} x={run.x} y={run.y} width={run.width} height={1} fill={RPG.soul} />
      ))}
    </g>
  )
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
 * Him in the monster area: he stands facing down and turns left or right to face the visitor's pointer
 * (--mx from the shared pointer hook on a parent). Hovering the stage is a battle moment: his soul shows
 * on his chest and he plays his profession's two frame action.
 */
export function StageWalker({ profession, className = '' }: StageWalkerProps) {
  const colours = COLOURS[profession]
  const facings: ReadonlyArray<readonly [Facing, string]> = [
    ['down', sprite.faceDown],
    ['right', sprite.faceRight],
    ['left', sprite.faceLeft],
  ]

  return (
    <Sheet className={className}>
      {facings.map(([facing, faceClass]) => (
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
      <ChestSoul className={sprite.soul} />
    </Sheet>
  )
}

interface RoomWalkerProps {
  profession: Profession
  /** The way he walks in; he stops facing down. */
  facing: Facing
  className?: string
}

/**
 * Him walking a few tiles in his four facing walk, two step frames, then standing facing down. The walk
 * plays while a parent says so (data-phase="walk" in the encounter room, data-walk="on" at the save point,
 * read by sprite.module.css); the rest of the time he stands.
 */
export function RoomWalker({ profession, facing, className = '' }: RoomWalkerProps) {
  const colours = COLOURS[profession]

  return (
    <Sheet className={className}>
      <g className={sprite.stepA}>
        <Pixels pose={walkPose(profession, facing, 'stepA')} colours={colours} />
      </g>
      <g className={sprite.stepB}>
        <Pixels pose={walkPose(profession, facing, 'stepB')} colours={colours} />
      </g>
      <g className={sprite.arrived}>
        <Pixels pose={walkPose(profession, facing === 'up' ? 'up' : 'down', 'stand')} colours={colours} />
      </g>
      <ChestSoul className={sprite.savedSoul} />
    </Sheet>
  )
}

/** The determination sparkle: four point pixel stars that burst round him when he saves. */
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
