'use client'

import { playedPast } from '@/lib/motion/course'
import { usePoseSequence } from './usePoseSequence'

// A course's legs played by the shared pose sequence, for the worlds that run a figure along legs
// (src/lib/motion/course.ts): each leg is an entrance pose ended by the rig's own animationend, then the
// rest. Besides the sequence it gives the leg playing as a step (the leg count once at rest) and whether a
// leg is over.

interface LegSequenceOptions<Name extends string> {
  /** Shown in place of everything under reduced motion. */
  still?: Name
  /** A one shot move ends on its own after this many ms. */
  moveMs?: number
}

export function useLegSequence<Name extends string>(names: readonly Name[], rest: Name, { still, moveMs }: LegSequenceOptions<Name> = {}) {
  const sequence = usePoseSequence<Name>({ entrance: names, rest, still, moveMs })
  const playing = names.indexOf(sequence.pose)
  return {
    ...sequence,
    step: playing < 0 ? names.length : playing,
    past: (name: Name) => playedPast(names, sequence.pose, sequence.arrived, name),
  }
}
