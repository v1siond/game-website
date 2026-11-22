'use client'

import type { ReactNode } from 'react'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'

// A section a world's figure plays into once: he comes in, does his act on the section and goes, and the
// section's reaction ends at its own resting place and look. The shared section trigger starts it once;
// the shared pose sequence plays the world's three beats, each ended by the figure wrapper's own
// animationend, so nothing is timed in React. The stage carries data-on once in view, data-beat (the pose
// playing: a beat, then 'gone') and the world's own mark, and the world's CSS module reads them for every
// keyframe. Reduced motion shows 'still': no figure, the section rests in place from the start.

type Pose<B extends string> = B | 'gone' | 'still'

/** The world's own data attribute on the stage, read by its CSS: data-side, data-strike or data-act. */
export type CameoMark = Readonly<Record<`data-${string}`, string>>

export interface SectionCameoProps<B extends string> {
  children: ReactNode
  /** The figure's beats in order: in, the act on the section, out. */
  beats: readonly B[]
  threshold: number
  /** The stage class of the world's CSS module. */
  stage: string
  mark: CameoMark
  /** The section's reaction, a class of the world's CSS module. */
  reaction: string
  /** Where the figure stands and its module class; it is absolute, above the section, and ignores the pointer. */
  place: string
  /** The figure for the beat playing. */
  figure: (beat: B) => ReactNode
  /** Drawn inside the reaction with the section, so it moves with it. */
  prop?: ReactNode
  /** Drawn on the stage beside the figure, only while he is there. */
  aside?: ReactNode
}

export function SectionCameo<B extends string>({ children, beats, threshold, stage, mark, reaction, place, figure, prop, aside }: SectionCameoProps<B>) {
  const { ref, triggered } = useSectionTrigger({ threshold })
  const { pose, onOwnAnimationEnd } = usePoseSequence<Pose<B>>({ entrance: beats, rest: 'gone', still: 'still' })

  return (
    <div ref={ref} className={`relative ${stage}`} data-on={triggered || undefined} data-beat={pose} {...mark}>
      <div className={`relative ${reaction}`}>
        {children}
        {prop}
      </div>
      {triggered && pose !== 'gone' && pose !== 'still' && (
        <>
          <div className={`pointer-events-none absolute z-30 ${place}`} onAnimationEnd={onOwnAnimationEnd} aria-hidden="true">
            {figure(pose)}
          </div>
          {aside}
        </>
      )}
    </div>
  )
}
