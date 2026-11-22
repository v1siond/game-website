'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import { useLatest } from './useLatest'
import { FIRST_FRAME_MS, SETTLE_TAU_MS, jumpStart, settleStep } from '@/lib/scroll/stage'

/**
 * The scroll stage engine: reversible scroll progress for pinned full screen stages, drawn with the
 * settle. One passive scroll listener starts one requestAnimationFrame loop that runs only while the drawn
 * position is catching up with window.scrollY; each frame eases it (settleStep, the time constant
 * SETTLE_TAU_MS) and hands it to `draw`, and the loop ends once it rests, so nothing runs while the page
 * is still. The page scroll stays native: scrollbar, keyboard, touch momentum and find in page are the
 * browser's own. `measure` reads the layout (section boxes, item triggers) on mount, on every resize of the
 * observed element or the window and once the fonts load, never inside a frame, so a frame only writes
 * (transforms and opacity). The math is in src/lib/scroll/stage.ts.
 *
 *   const ref = useScrollStage({ enabled: !reducedMotion, measure, draw })
 *   <main ref={ref}>...</main>
 *
 * `draw(position, lag, metrics)`: `position` is the drawn scroll position in px, `lag` how far it trails
 * the real scroll (scrollY - position, positive while scrolling down), which a world can write as a
 * translate on content it wants to settle with the art. The first draw runs in a layout effect, so the
 * first paint already shows the stages where the scroll is.
 */

export interface StageMetrics {
  /** The viewport height in px. */
  viewport: number
  /** True under 768 px wide, where a world moves its layers less. */
  phone: boolean
}

export interface ScrollStageOptions {
  /** False under reduced motion (or before the world is ready): no listener, no loop, no draw. */
  enabled: boolean
  /** Reads the layout at scroll position `scrollY`; runs outside the frames. */
  measure: (scrollY: number, metrics: StageMetrics) => void
  /** Writes the stages for the drawn position; runs inside a frame, so it only writes. */
  draw: (position: number, lag: number, metrics: StageMetrics) => void
  /** The settle's time constant in ms, SETTLE_TAU_MS when left out; 0 draws at the scroll. */
  tauMs?: number
  /** What the stages are built from: a new value (new content, stages bound again) measures and draws at once. */
  content?: unknown
}

const PHONE_QUERY = '(max-width: 767.98px)'

const readMetrics = (): StageMetrics => ({ viewport: window.innerHeight, phone: window.matchMedia(PHONE_QUERY).matches })

export function useScrollStage<T extends HTMLElement>({ enabled, measure, draw, tauMs = SETTLE_TAU_MS, content }: ScrollStageOptions): (element: T | null) => void {
  const [element, setElement] = useState<T | null>(null)
  const latest = useLatest({ measure, draw, tauMs })

  // The first frame, and the first after new content: measure and draw at the scroll before the browser paints.
  useLayoutEffect(() => {
    if (!enabled || !element) return
    const metrics = readMetrics()
    latest.current.measure(window.scrollY, metrics)
    latest.current.draw(window.scrollY, 0, metrics)
  }, [enabled, element, latest, content])

  useEffect(() => {
    if (!enabled || !element) return
    let metrics = readMetrics()
    let drawn = window.scrollY
    let frame = 0
    let lastTime = 0

    const tick = (now: number) => {
      const target = window.scrollY
      const step = settleStep(drawn, target, lastTime ? now - lastTime : FIRST_FRAME_MS, latest.current.tauMs)
      drawn = step.drawn
      latest.current.draw(drawn, target - drawn, metrics)
      lastTime = step.settled ? 0 : now
      frame = step.settled ? 0 : requestAnimationFrame(tick)
    }

    const request = () => {
      drawn = jumpStart(drawn, window.scrollY, metrics.viewport)
      if (!frame) frame = requestAnimationFrame(tick)
    }

    const resize = () => {
      metrics = readMetrics()
      latest.current.measure(window.scrollY, metrics)
      request()
    }

    const observer = new ResizeObserver(resize)
    observer.observe(element)
    window.addEventListener('scroll', request, { passive: true })
    window.addEventListener('resize', resize, { passive: true })
    let live = true
    document.fonts?.ready.then(() => {
      if (live) resize()
    })

    return () => {
      live = false
      observer.disconnect()
      window.removeEventListener('scroll', request)
      window.removeEventListener('resize', resize)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [enabled, element, latest])

  return setElement
}
