'use client'

import type { ReactNode } from 'react'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'

// A section a world's figure crosses once along a lane above it: the shared section trigger starts it
// once, and only then is the figure mounted, so its pose sequence starts with the play. Each beat is its
// own CSS animation on his track, ended by that track's own animationend; after the last he unmounts and
// the section rests exactly as it did without him. The section shows the reaction's idle look until the
// play and its playing look from then on. Reduced motion shows the section in place with
// no figure and no reaction class.

// How much of the section shows before he comes in.
const THRESHOLD = 0.3

export interface LaneCameoProps<B extends string> {
  children: ReactNode
  /** The figure's beats in order. */
  beats: readonly B[]
  /** The animation class of his track for each beat. */
  track: Readonly<Record<B, string>>
  /** The lane's module class, the strip above the section he moves along. */
  lane: string
  /** His size and module class at his place on the lane. */
  place: string
  /** The section's look before the play (idle) and from the play on (playing). */
  reaction: { playing: string; idle: string }
  /** The figure for the beat playing. */
  figure: (beat: B) => ReactNode
  /** Drawn at his place beside the track during a beat (an impact burst). */
  beside?: Partial<Readonly<Record<B, ReactNode>>>
}

type FigureProps<B extends string> = Pick<LaneCameoProps<B>, 'beats' | 'track' | 'lane' | 'place' | 'figure' | 'beside'>

function LaneFigure<B extends string>({ beats, track, lane, place, figure, beside }: FigureProps<B>) {
  const { pose, onOwnAnimationEnd } = usePoseSequence<B | 'gone'>({ entrance: beats, rest: 'gone' })
  if (pose === 'gone') return null

  return (
    <div className={`pointer-events-none absolute inset-x-0 top-0 z-30 ${lane}`} aria-hidden="true">
      <span className={`absolute bottom-0 ${place}`}>
        <span className={`block h-full w-full ${track[pose]}`} onAnimationEnd={onOwnAnimationEnd}>
          {figure(pose)}
        </span>
        {beside?.[pose]}
      </span>
    </div>
  )
}

export function LaneCameo<B extends string>({ children, reaction, ...cameo }: LaneCameoProps<B>) {
  const { ref, triggered } = useSectionTrigger({ threshold: THRESHOLD })
  const still = useReducedMotion()
  const playing = triggered && !still
  const look = playing ? reaction.playing : reaction.idle

  return (
    <div ref={ref} className="relative">
      <div className={still ? '' : look}>{children}</div>
      {playing && <LaneFigure {...cameo} />}
    </div>
  )
}
