'use client'

import { useEffect, useRef, useState } from 'react'
import { usePreview } from '@/themes/PreviewContext'
import {
  type ScenePhase,
  type SceneLines,
  type SceneState,
  SCENE_DONE,
  SCENE_IDLE,
  advanceScene,
  sectionProgress,
} from '@/lib/scroll/progress'

/**
 * One scroll engine for every world's scenes.
 *
 * An IntersectionObserver arms the section when it nears the viewport; only while it is armed does a
 * passive scroll listener schedule one requestAnimationFrame per frame, which measures the section and
 * writes its progress (0 to 1) to the `--scene-progress` CSS variable on the element. React re-renders
 * only on phase changes (idle, playing, done), never per frame. Once done the scene stays done
 * (`hasAnimated`), and every listener is released. Reduced motion and World Select previews start done.
 */

export const SCENE_PROGRESS_VAR = '--scene-progress'

export interface ScrollSceneOptions extends SceneLines {
  rootMargin?: string
}

export interface ScrollSceneReturn<T extends HTMLElement> {
  ref: (element: T | null) => void
  phase: ScenePhase
}

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function writeProgress(element: HTMLElement, state: SceneState) {
  element.style.setProperty(SCENE_PROGRESS_VAR, String(state.progress))
}

export function useScrollScene<T extends HTMLElement = HTMLDivElement>({
  start,
  end,
  rootMargin = '0px 0px 10% 0px',
}: ScrollSceneOptions = {}): ScrollSceneReturn<T> {
  const [element, setElement] = useState<T | null>(null)
  const [phase, setPhase] = useState<ScenePhase>(SCENE_IDLE.phase)
  const hasAnimated = useRef(false)
  const isPreview = usePreview()

  useEffect(() => {
    if (!element) return

    const finish = () => {
      hasAnimated.current = true
      writeProgress(element, SCENE_DONE)
      setPhase(SCENE_DONE.phase)
    }

    if (hasAnimated.current) {
      writeProgress(element, SCENE_DONE)
      return
    }
    if (isPreview || window.matchMedia(REDUCED_MOTION_QUERY).matches) {
      finish()
      return
    }

    let state = SCENE_IDLE
    let frame = 0

    const measure = () => {
      frame = 0
      const raw = sectionProgress(element.getBoundingClientRect().top, window.innerHeight, { start, end })
      const next = advanceScene(state, raw)
      if (next.phase !== state.phase) setPhase(next.phase)
      state = next
      writeProgress(element, state)
      if (state.phase === 'done') release()
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    const arm = () => {
      window.addEventListener('scroll', schedule, { passive: true })
      window.addEventListener('resize', schedule, { passive: true })
      schedule()
    }

    const disarm = () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
      frame = 0
    }

    const observer = new IntersectionObserver(
      ([entry]) => (entry?.isIntersecting ? arm() : disarm()),
      { rootMargin },
    )

    function release() {
      hasAnimated.current = true
      disarm()
      observer.disconnect()
    }

    writeProgress(element, state)
    observer.observe(element)
    return () => {
      disarm()
      observer.disconnect()
    }
  }, [element, isPreview, start, end, rootMargin])

  return { ref: setElement, phase }
}
