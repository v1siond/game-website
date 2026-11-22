'use client'

import type { AnimationEvent, ReactNode } from 'react'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { Knight, type KnightPose } from './knight'
import plunge from './plunge.module.css'

// Two sections he opens with the bonfire world's own moves, each started once by the shared section
// trigger and walked by the shared pose sequence, every beat ended by its own CSS animation on his track
// (plunge.module.css):
//   IllusoryWall  Tech stack: the panel stands behind a stone wall the panel's size until the section
//                 shows; he drops from above onto the wall's top edge in his guard (drop 0 to 500 ms, the
//                 plunging attack), the struck wall shudders and fades (strike 500 to 900 ms), he steps
//                 back off the edge and fades (leave 900 to 1300 ms). The panel fades open under the wall
//                 on its own trigger, as it always has.
//   RollIn        Services: he rolls in from the left onto the panel's top edge (the rig's 1.2 s roll, the
//                 track carrying him in 780 ms), and at 780 ms the hidden panel is knocked into place
//                 under him with a jolt (420 ms); he stands and fades (leave 1200 to 1500 ms).
// When the beats are over he (and the wall) unmount and the panel rests exactly as it did without him.
// Reduced motion shows the panel in place with no knight and no wall.

type Gone = 'gone'
type WallBeat = 'drop' | 'strike' | 'leave'
type RollBeat = 'roll' | 'leave'

const WALL_BEATS: readonly WallBeat[] = ['drop', 'strike', 'leave']
const ROLL_BEATS: readonly RollBeat[] = ['roll', 'leave']

const WALL_POSE: Record<WallBeat, KnightPose> = { drop: 'guard', strike: 'guard', leave: 'idle' }
const WALL_TRACK: Record<WallBeat, string> = { drop: plunge.dropIn, strike: plunge.landHold, leave: plunge.stepOff }
const ROLL_POSE: Record<RollBeat, KnightPose> = { roll: 'roll', leave: 'idle' }
const ROLL_TRACK: Record<RollBeat, string> = { roll: plunge.rollIn, leave: plunge.fadeOff }

/** Whether the scene plays: the section has shown, and motion is wanted. */
function useStage() {
  const { ref, triggered } = useSectionTrigger({ threshold: 0.3 })
  const still = useReducedMotion()
  return { ref, still, playing: triggered && !still }
}

function Figure({ pose, track, place, onEnd }: { pose: KnightPose; track: string; place: string; onEnd: (event: AnimationEvent<Element>) => void }) {
  return (
    <div className={`pointer-events-none absolute inset-x-0 top-0 z-30 ${plunge.lane}`} aria-hidden="true">
      <span className={`absolute bottom-0 h-28 w-[4.375rem] ${place}`}>
        <span className={`block h-full w-full ${track}`} onAnimationEnd={onEnd}>
          <Knight gear="engineer" pose={pose} className="block h-full w-full" />
        </span>
      </span>
    </div>
  )
}

function WallScene() {
  const beat = usePoseSequence<WallBeat | Gone>({ entrance: WALL_BEATS, rest: 'gone' })
  const pose = beat.pose
  if (pose === 'gone') return null

  return (
    <>
      <div className={`pointer-events-none absolute inset-0 z-20 ${plunge.wall} ${pose === 'drop' ? '' : plunge.wallGive}`} aria-hidden="true" />
      <Figure pose={WALL_POSE[pose]} track={WALL_TRACK[pose]} place={plunge.wallPlace} onEnd={beat.onOwnAnimationEnd} />
    </>
  )
}

/** Tech stack: the stone wall in front of the panel gives way under his plunging attack. */
export function IllusoryWall({ children }: { children: ReactNode }) {
  const { ref, still, playing } = useStage()

  return (
    <div ref={ref} className="relative">
      {children}
      {!still && !playing && <div className={`pointer-events-none absolute inset-0 z-20 ${plunge.wall}`} aria-hidden="true" />}
      {playing && <WallScene />}
    </div>
  )
}

function RollScene() {
  const beat = usePoseSequence<RollBeat | Gone>({ entrance: ROLL_BEATS, rest: 'gone' })
  const pose = beat.pose
  if (pose === 'gone') return null
  return <Figure pose={ROLL_POSE[pose]} track={ROLL_TRACK[pose]} place={plunge.rollPlace} onEnd={beat.onOwnAnimationEnd} />
}

/** Services: the panel is knocked into place by his roll. */
export function RollIn({ children }: { children: ReactNode }) {
  const { ref, still, playing } = useStage()
  const reaction = playing ? plunge.knockedIn : plunge.hidden

  return (
    <div ref={ref} className="relative">
      <div className={still ? '' : reaction}>{children}</div>
      {playing && <RollScene />}
    </div>
  )
}
