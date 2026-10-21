'use client'

import { useEffect, useState, type AnimationEvent, type ReactNode } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import type { Profession } from '@/contexts/ProfessionContext'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { useScrollScene } from '@/hooks/useScrollScene'
import { usePreview } from '@/themes/PreviewContext'
import { Bandicoot, type BandicootPose } from './bandicoot'
import { Ride, type Vehicle } from './vehicles'
import scene from './eraScenes.module.css'

// His moment in each era (the time travel platformer's levels, Warped, named in code only, design
// worlds-v2/neon-portals.md section W4). Each one plays inside its section's stage once the stage is
// on (data-on, from useZoneStage), and only one figure moves in a view at a time:
//   BridgeSlide  medieval: he slides in along the castle bridge and the bio unrolls as a banner; a tap
//                on him plays the game's death gag (halo and wings, he floats off) and he beams back
//   TombRun      Egypt: he runs along the tomb floor under the jobs, his place tied to the scroll
//   Crossing     one pass across a lane, then gone: the scuba swim under the sea, the motorbike down
//                the future road, the jet ski across the harbour
// Reduced motion and a World Select preview show each of them still, in place.

const ANGEL_MS = 1800
const WARP_MS = 1300

type Gag = 'angel' | 'warp'

const GAG_NEXT: Record<Gag, Gag | null> = { angel: 'warp', warp: null }
const GAG_MS: Record<Gag, number> = { angel: ANGEL_MS, warp: WARP_MS }

/** The death gag: angel, then the warp back in, then his own pose again. */
function useGag() {
  const [gag, setGag] = useState<Gag | null>(null)

  useEffect(() => {
    if (!gag) return
    const timer = window.setTimeout(() => setGag(GAG_NEXT[gag]), GAG_MS[gag])
    return () => window.clearTimeout(timer)
  }, [gag])

  return { gag, start: () => setGag((now) => now ?? 'angel') }
}

const SLIDE_IN: readonly BandicootPose[] = ['slide']

/** About in the medieval era: the slide along the bridge, the bio banner, the tap for the gag. */
export function BridgeSlide({ on, profession, children }: { on: boolean; profession: Profession; children: ReactNode }) {
  const { warp } = useLabels()
  const reduced = useReducedMotion()
  const figure = usePoseSequence<BandicootPose>({
    entrance: SLIDE_IN,
    rest: 'idle',
  })
  const { gag, start } = useGag()
  const pose = gag ?? (on ? figure.pose : 'idle')

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className={`relative shrink-0 self-start sm:self-end ${scene.bridge}`}>
        {reduced ? (
          <span className="relative block h-36 w-24" aria-hidden="true">
            <Bandicoot profession={profession} pose="idle" className="h-full w-full" />
          </span>
        ) : (
          <button
            type="button"
            onClick={start}
            aria-label={warp.lifeHint}
            title={warp.lifeHint}
            className={`relative block h-36 w-24 rounded-xl ${on ? scene.slideIn : scene.offStage}`}
            onAnimationEnd={figure.onOwnAnimationEnd}
          >
            <Bandicoot key={gag ?? 'self'} profession={profession} pose={pose} className="h-full w-full" />
          </button>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className={scene.banner}>{children}</div>
        {!reduced && <p className={`mt-3 ${scene.hint}`}>{warp.lifeHint}</p>}
      </div>
    </div>
  )
}

/** The tomb floor under the jobs: he runs along it while the section scrolls up, then stands still (one figure moving per view). */
export function TombRun({ profession }: { profession: Profession }) {
  const { ref, phase } = useScrollScene<HTMLDivElement>({
    start: 1,
    end: 0.25,
  })

  return (
    <div ref={ref} className={`relative mb-6 h-24 ${scene.tomb}`} aria-hidden="true">
      <span className={`absolute inset-y-0 left-0 right-16 block ${scene.runner}`}>
        <span className="absolute bottom-1 left-0 block h-[5.5rem] w-16">
          <Bandicoot profession={profession} pose={phase === 'playing' ? 'run' : 'still'} className="h-full w-full" />
        </span>
      </span>
    </div>
  )
}

type Traveller = { kind: 'swim' } | { kind: 'ride'; vehicle: Vehicle }

const LANE: Record<Traveller['kind'], { lane: string; size: string }> = {
  swim: { lane: 'h-20', size: 'h-20 w-28' },
  ride: { lane: 'h-24', size: 'h-24 w-32' },
}

const laneMotion = (on: boolean) => (on ? scene.cross : scene.waiting)

/** One pass across a lane, then gone; still (parked at the start) under reduced motion and in a preview. */
export function Crossing({ on, profession, traveller, className = '' }: { on: boolean; profession: Profession; traveller: Traveller; className?: string }) {
  const reduced = useReducedMotion()
  const preview = usePreview()
  const [passed, setPassed] = useState(false)
  const still = reduced || preview
  const onEnd = (event: AnimationEvent<HTMLSpanElement>) => {
    if (event.target === event.currentTarget) setPassed(true)
  }

  const { lane, size } = LANE[traveller.kind]
  const motion = still ? '' : laneMotion(on)

  return (
    <div className={`relative overflow-hidden ${lane} ${scene.lane} ${className}`} aria-hidden="true">
      {!passed && (
        <span className={`relative block ${size} ${motion}`} onAnimationEnd={onEnd}>
          {traveller.kind === 'swim' ? (
            <Bandicoot profession={profession} pose="swim" frame={still ? 0 : undefined} className="h-full w-full" />
          ) : (
            <Ride vehicle={traveller.vehicle} profession={profession} still={still} className="relative h-full w-full" />
          )}
        </span>
      )}
    </div>
  )
}

/** The plate behind a hint line, so it reads on every era's painting. */
export function Hint({ children }: { children: ReactNode }) {
  return <p className={`mb-6 ${scene.hint}`}>{children}</p>
}
