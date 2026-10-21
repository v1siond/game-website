'use client'

import { useMemo, type AnimationEventHandler, type ReactNode } from 'react'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import type { Profession } from '@/lib/cv/professions'
import { pixelRuns } from '@/lib/pixelRuns'
import { cssVars } from './art'
import { motionOf, motionVars, playedPast, type Course, type Motion } from './course'
import { FOE, HERO, HERO_EYE, HERO_OUTFITS, foeColours, foeRows, heroParts, type FoeFrame, type HeroFrame, type SpritePart } from './side'
import side from './side.module.css'

// The side view cast drawn from the pixel rows in side.ts: him, the walking mushroom, the turtle and the
// biting plant. A looping cycle (his run, a foe's two step walk, the plant's bite) draws both frames and
// the CSS swaps them in one step, the way sprite frames change. Actor is the moving rig a level scene
// drives with its course (course.ts): the track carries him along each leg across the playfield (its
// translate is a share of the playfield's width), and the hop inside can bounce him on the spot.

function Pixels({ parts, colours }: { parts: readonly SpritePart[]; colours: Record<string, string> }) {
  return (
    <>
      {parts.flatMap(({ rows, top }) =>
        pixelRuns(rows, top).map((run) => <rect key={`${run.x}-${run.y}`} x={run.x} y={run.y} width={run.width} height={1} fill={colours[run.key]} />),
      )}
    </>
  )
}

export function SideHero({ profession, frame }: { profession: Profession; frame: HeroFrame }) {
  const { headgear, colours } = HERO_OUTFITS[profession]
  return (
    <svg viewBox={`0 0 ${HERO.width} ${HERO.height}`} className={side.heroSprite} shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      {frame === 'run' ? (
        <>
          <g className={side.frameA}>
            <Pixels parts={heroParts('runA', headgear)} colours={colours} />
          </g>
          <g className={side.frameB}>
            <Pixels parts={heroParts('runB', headgear)} colours={colours} />
          </g>
        </>
      ) : (
        <Pixels parts={heroParts(frame, headgear)} colours={colours} />
      )}
      {frame === 'stand' && <rect x={HERO_EYE.x} y={HERO_EYE.y} width={1} height={HERO_EYE.height} fill={colours.S} className={side.blink} />}
    </svg>
  )
}

// A foe's look: a two frame cycle, or one still frame.
const CYCLES = {
  walker: ['walkerA', 'walkerB'],
  turtle: ['turtleA', 'turtleB'],
  plant: ['plantOpen', 'plantShut'],
  plantOpen: ['plantOpen'],
  walkerFlat: ['walkerFlat'],
  shell: ['shell'],
} as const satisfies Record<string, readonly FoeFrame[]>

export type FoeLook = keyof typeof CYCLES

const CYCLE_CLASSES = [side.frameA, side.frameB]

export function FoeSprite({ look, className = '' }: { look: FoeLook; className?: string }) {
  const frames: readonly FoeFrame[] = CYCLES[look]
  return (
    <svg viewBox={`0 0 ${FOE.width} ${FOE.height}`} className={`${side.foeSprite} ${className}`} shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      {frames.map((frame, index) => (
        <g key={frame} className={frames.length > 1 ? CYCLE_CLASSES[index] : undefined}>
          <Pixels parts={[{ rows: foeRows(frame), top: 0 }]} colours={foeColours(frame)} />
        </g>
      ))}
    </svg>
  )
}

interface ActorProps {
  motion: Motion
  profession: Profession
  /** Bumped to replay the same pose (a repeated move); each new pose restarts the track by itself. */
  take?: number
  onAnimationEnd?: AnimationEventHandler<HTMLDivElement>
  /** The class of the inner hop (a bounce on the spot), and a key that restarts it. */
  hopClassName?: string
  hopKey?: string | number
  children?: ReactNode
}

/** The rig: the track runs his leg across the playfield, the hop can bounce him on the spot. */
export function Actor({ motion, profession, take = 0, onAnimationEnd, hopClassName = '', hopKey, children }: ActorProps) {
  return (
    <div
      key={`${motion.pose}:${take}`}
      className={side.track}
      data-pose={motion.pose}
      data-path={motion.path}
      style={cssVars(motionVars(motion))}
      onAnimationEnd={onAnimationEnd}
      aria-hidden="true"
    >
      <div key={hopKey} className={`${side.hop} ${hopClassName}`}>
        <SideHero profession={profession} frame={motion.frame} />
      </div>
      {children}
    </div>
  )
}

/** A scene's course played by the shared pose sequence: the motion to show, and which legs are over. */
export function useCourse<P extends string>(course: Course<P>, moveMs?: number) {
  const entrance = useMemo(() => course.legs.map((leg) => leg.pose), [course])
  const sequence = usePoseSequence<P>({ entrance, rest: course.rest.pose, still: course.rest.pose, moveMs })
  const motion = motionOf(course, sequence.pose)
  const past = (pose: P) => playedPast(course, sequence.pose, sequence.arrived, pose)
  return { ...sequence, motion, past }
}
