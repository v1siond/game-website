'use client'

import type { HTMLAttributes } from 'react'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'

// The one way a scene waits for its section: every animation on an element and inside it holds on its
// first frame until the section shows, then plays from its start, once. The class pauses them (important,
// so a world's own `animation` shorthand, whatever its specificity or place in the cascade, cannot set them
// running) and is dropped when the flag turns true. The class is a literal so Tailwind generates it.
const HELD = '![animation-play-state:paused] [&_*]:![animation-play-state:paused]'

/**
 * The class that holds an element's animations until `shown` turns true, then nothing. For a scene whose
 * wait reads a flag of its own (a zone stage's `on`, a boot, a phase, the zone on show).
 */
export const heldUntil = (shown: boolean) => (shown ? '' : HELD)

interface InViewProps extends HTMLAttributes<HTMLDivElement> {
  // How much of the scene must be on screen before it plays (useSectionTrigger's, 0.15 when left out).
  threshold?: number
}

/** A block whose scene waits on its first frame until it is in view, then plays once. */
export function InView({ threshold, className = '', ...block }: InViewProps) {
  const { ref, triggered } = useSectionTrigger({ threshold })
  return <div ref={ref} className={`${heldUntil(triggered)} ${className}`} {...block} />
}
