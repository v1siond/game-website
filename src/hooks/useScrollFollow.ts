'use client'

import { useEffect } from 'react'
import { settleStep } from '@/lib/scroll/stage'
import { useLatest } from './useLatest'

// A page's ambient motion played by the scroll instead of a clock: the page's scroll position followed at
// the smooth scroll's own pace (settleStep, the same eased follow the stages settle with), handed to the
// world's writer once a frame while it moves and never after it has come to rest. Scrolling down plays the
// motion forward, scrolling up plays it back, every pass the same. The writer only writes (CSS variables,
// transforms, opacity); the hook reads no media query, so each world passes `!reducedMotion` and leaves its
// rest frame drawn by its CSS under reduced motion.

/** The writer: the followed scroll position in px from the page top, and the viewport's height. */
export type ScrollWriter = (scroll: number, viewport: number) => void

export function useScrollFollow(write: ScrollWriter, enabled: boolean): void {
  const writer = useLatest(write)

  useEffect(() => {
    if (!enabled) return
    let drawn = window.scrollY
    let frame = 0
    let last = 0

    const draw = (now: number) => {
      const step = settleStep(drawn, window.scrollY, last ? now - last : 0)
      drawn = step.drawn
      last = now
      writer.current(drawn, window.innerHeight)
      frame = step.settled ? 0 : window.requestAnimationFrame(draw)
      if (step.settled) last = 0
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(draw)
    }

    writer.current(drawn, window.innerHeight)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.cancelAnimationFrame(frame)
    }
  }, [enabled, writer])
}
