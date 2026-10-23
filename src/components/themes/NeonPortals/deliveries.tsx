'use client'

import { useEffect, type ReactNode } from 'react'
import type { Profession } from '@/contexts/ProfessionContext'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { usePreview } from '@/themes/PreviewContext'
import { Bandicoot, type BandicootPose } from './bandicoot'
import { Blast } from './burst'
import { CrateArt } from './crateArt'
import deliver from './deliveries.module.css'

// Two sections he delivers himself, each with a move the time travel platformer (Warped, named in code
// only) opens things with:
//   CrateSpin  Services: he runs in to a crate on the list's top edge and spins into it; the crate flies
//              apart, and the list bursts out of the crate's spot. Run 0 to 480 ms, spin 480 to
//              980 ms (contact at 480, the list pops in 520 ms), hop off and fade 980 to 1400 ms.
//   BodySlam   Ventures: he drops in from the upper right tucked for the body slam (0 to 600 ms) and lands
//              flat on the cards' top edge at 600 ms (held 400 ms, the slam's ring); the cards are knocked down
//              into place by 960 ms; he hops off and fades by 1420 ms, and only then is the row's own scene (the motorbike) let go.
// Pattern: the shared section trigger starts it once (useSectionTrigger keeps it triggered), the shared
// pose sequence walks the beats, each beat ended by its own CSS animation on the track; the section's
// reaction is one CSS animation with its contact delay (deliveries.module.css). Once the beats are over
// the figure unmounts and the section rests exactly as it did without him. Reduced motion and a World
// Select preview show the section in place with no figure. Transforms and opacity only.

const TRIGGER = { threshold: 0.3 }

type SpinBeat = 'run' | 'spin' | 'leave'
type SlamBeat = 'drop' | 'land' | 'leave'

const SPIN_BEATS: readonly SpinBeat[] = ['run', 'spin', 'leave']
const SLAM_BEATS: readonly SlamBeat[] = ['drop', 'land', 'leave']

const SPIN_POSE: Record<SpinBeat, BandicootPose> = { run: 'run', spin: 'spin', leave: 'jump' }
// The slam is shown as the rig's own key frames held per beat (the tuck, the flat landing, the hop), so
// the drop adds one moving element to a view that already has the future era's and the crate field's.
const SLAM_FRAME: Record<SlamBeat, { pose: BandicootPose; frame: number }> = {
  drop: { pose: 'slam', frame: 1 },
  land: { pose: 'slam', frame: 3 },
  leave: { pose: 'jump', frame: 1 },
}

const SPIN_TRACK: Record<SpinBeat, string> = { run: deliver.runIn, spin: deliver.spinHold, leave: deliver.hopOff }
const SLAM_TRACK: Record<SlamBeat, string> = { drop: deliver.dropIn, land: deliver.landHold, leave: deliver.hopOff }

/** Whether the scene plays: the section has shown, and motion is wanted. */
function useStage() {
  const { ref, triggered } = useSectionTrigger(TRIGGER)
  const reduced = useReducedMotion()
  const preview = usePreview()
  const still = reduced || preview
  return { ref, still, playing: triggered && !still }
}

function SpinRun({ profession }: { profession: Profession }) {
  const beat = usePoseSequence<SpinBeat | 'gone'>({ entrance: SPIN_BEATS, rest: 'gone' })
  if (beat.pose === 'gone') return null
  const broken = beat.pose !== 'run'

  return (
    <div className={`pointer-events-none absolute inset-x-0 top-0 z-30 ${deliver.lane}`} aria-hidden="true">
      <span className={`absolute bottom-0 h-16 w-16 ${deliver.cratePlace} ${broken ? deliver.crateBreak : ''}`}>
        <CrateArt kind="wood" className="h-full w-full" />
      </span>
      <span className={`absolute bottom-0 h-36 w-24 ${deliver.runnerPlace}`}>
        <span className={`block h-full w-full ${SPIN_TRACK[beat.pose]}`} onAnimationEnd={beat.onOwnAnimationEnd}>
          <Bandicoot profession={profession} pose={SPIN_POSE[beat.pose]} className="h-full w-full" />
        </span>
      </span>
    </div>
  )
}

/** Services: the list bursts out of the crate he spins into. */
export function CrateSpin({ profession, children }: { profession: Profession; children: ReactNode }) {
  const { ref, still, playing } = useStage()
  const reaction = playing ? deliver.burstOut : deliver.packed

  return (
    <div ref={ref} className="relative z-20 mb-8">
      <div className={still ? '' : reaction}>{children}</div>
      {playing && <SpinRun profession={profession} />}
    </div>
  )
}

function SlamDrop({ profession, onGone }: { profession: Profession; onGone: () => void }) {
  const beat = usePoseSequence<SlamBeat | 'gone'>({ entrance: SLAM_BEATS, rest: 'gone' })
  const pose = beat.pose
  const gone = pose === 'gone'

  useEffect(() => {
    if (gone) onGone()
  }, [gone, onGone])

  if (pose === 'gone') return null

  return (
    <div className={`pointer-events-none absolute inset-x-0 top-0 z-30 ${deliver.lane}`} aria-hidden="true">
      <span className={`absolute bottom-0 h-36 w-24 ${deliver.slamPlace}`}>
        <span className={`block h-full w-full ${SLAM_TRACK[pose]}`} onAnimationEnd={beat.onOwnAnimationEnd}>
          <Bandicoot profession={profession} pose={SLAM_FRAME[pose].pose} frame={SLAM_FRAME[pose].frame} className="h-full w-full" />
        </span>
        {pose === 'land' && (
          <span className="absolute inset-x-0 bottom-0 h-8">
            <Blast tone="slam" />
          </span>
        )}
      </span>
    </div>
  )
}

interface BodySlamProps {
  profession: Profession
  /** Called once he is gone (at once when there is no scene), so the row's own scene can follow. */
  onDone: () => void
  children: ReactNode
}

/** Ventures: the cards are knocked down into place by his body slam. */
export function BodySlam({ profession, onDone, children }: BodySlamProps) {
  const { ref, still, playing } = useStage()
  const reaction = playing ? deliver.slamDown : deliver.packed

  useEffect(() => {
    if (still) onDone()
  }, [still, onDone])

  return (
    <div ref={ref} className="relative">
      <div className={still ? '' : reaction}>{children}</div>
      {playing && <SlamDrop profession={profession} onGone={onDone} />}
    </div>
  )
}
