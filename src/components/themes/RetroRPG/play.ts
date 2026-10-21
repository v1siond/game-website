'use client'

import { useEffect, useState } from 'react'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'

// The world's reveal clock on the shared section trigger: a block is 'idle' until it enters the
// screen, 'on' while its stepped CSS reveal plays (world.module.css reads data-play), then 'done' for
// good, so a reveal plays once. Reduced motion is handled in the CSS, which shows the final frame.

export type Play = 'idle' | 'on' | 'done'

export function usePlay(lengthMs: number) {
  const { ref, triggered } = useSectionTrigger({ threshold: 0.2 })
  const [play, setPlay] = useState<Play>('idle')

  useEffect(() => {
    if (!triggered) return
    setPlay('on')
    const timer = window.setTimeout(() => setPlay('done'), lengthMs)
    return () => window.clearTimeout(timer)
  }, [triggered, lengthMs])

  return { ref, play }
}
