'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'

// The world's reveal clock on the shared section trigger: a block is 'idle' until it enters the
// screen, 'on' while its stepped CSS reveal plays (world.module.css reads data-play), then 'done' for
// good, so a reveal plays once. Reduced motion is handled in the CSS, which shows the final frame.

export type Play = 'idle' | 'on' | 'done'

/** False while a room's event still plays (rooms.tsx): the blocks it holds wait for him, then reveal. */
export const RoomOpen = createContext(true)

export function usePlay(lengthMs: number) {
  const { ref, triggered } = useSectionTrigger({ threshold: 0.2 })
  const open = useContext(RoomOpen)
  const [play, setPlay] = useState<Play>('idle')

  useEffect(() => {
    if (!triggered || !open) return
    setPlay('on')
    const timer = window.setTimeout(() => setPlay('done'), lengthMs)
    return () => window.clearTimeout(timer)
  }, [triggered, open, lengthMs])

  return { ref, play }
}
