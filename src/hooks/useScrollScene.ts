'use client'

import { useEffect, useRef, useState } from 'react'
import { usePreview } from '@/themes/PreviewContext'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import {
  type FrameTask,
  type ScenePhase,
  type SceneLines,
  type SceneState,
  SCENE_DONE,
  SCENE_IDLE,
  advanceScene,
  readThenWrite,
  sectionProgress,
} from '@/lib/scroll/progress'

/**
 * One scroll engine for every world's scenes.
 *
 * An IntersectionObserver arms the section when it nears the viewport. Every armed scene on the page
 * shares one scheduler: one passive scroll and resize listener and at most one requestAnimationFrame per
 * frame, which first measures every armed section and then writes each progress (0 to 1) to the
 * `--scene-progress` CSS variable on its element, so the frame forces layout once. React re-renders
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

type ArmedScene = FrameTask<number>

const armedScenes = new Set<ArmedScene>()
let pendingFrame = 0

function flushScenes() {
  pendingFrame = 0
  readThenWrite(armedScenes)
}

function scheduleFrame() {
  if (!pendingFrame) pendingFrame = requestAnimationFrame(flushScenes)
}

function armScene(scene: ArmedScene) {
  if (armedScenes.has(scene)) return
  if (armedScenes.size === 0) {
    window.addEventListener('scroll', scheduleFrame, { passive: true })
    window.addEventListener('resize', scheduleFrame, { passive: true })
  }
  armedScenes.add(scene)
  scheduleFrame()
}

function disarmScene(scene: ArmedScene) {
  if (!armedScenes.delete(scene) || armedScenes.size > 0) return
  window.removeEventListener('scroll', scheduleFrame)
  window.removeEventListener('resize', scheduleFrame)
  if (pendingFrame) cancelAnimationFrame(pendingFrame)
  pendingFrame = 0
}

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
    if (isPreview || prefersReducedMotion()) {
      finish()
      return
    }

    let state = SCENE_IDLE

    const scene: ArmedScene = {
      read: () => element.getBoundingClientRect().top,
      write: (top) => {
        const next = advanceScene(state, sectionProgress(top, window.innerHeight, { start, end }))
        if (next.phase !== state.phase) setPhase(next.phase)
        state = next
        writeProgress(element, state)
        if (state.phase === 'done') release()
      },
    }

    const observer = new IntersectionObserver(
      ([entry]) => (entry?.isIntersecting ? armScene(scene) : disarmScene(scene)),
      { rootMargin },
    )

    function release() {
      hasAnimated.current = true
      disarmScene(scene)
      observer.disconnect()
    }

    writeProgress(element, state)
    observer.observe(element)
    return () => {
      disarmScene(scene)
      observer.disconnect()
    }
  }, [element, isPreview, start, end, rootMargin])

  return { ref: setElement, phase }
}
