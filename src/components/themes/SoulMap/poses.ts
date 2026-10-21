'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { KnightPose } from './knight'

// Plays his knight (./knight) through a short script of poses, the way the game commits him to a move:
// once a script starts it runs to its end (a roll, sitting down to rest and drinking, a strike), and a
// new script waits until he is free. Each step can fire its effect as it starts (the HUD refilled when he
// sits, the damage when the strike lands). The pose key changes on every step, so the scene remounts the
// sprite and a repeated pose plays its animation again. Under reduced motion the same poses are held,
// only still.

export interface PoseStep {
  pose: KnightPose
  ms: number
  effect?: () => void
}

export interface PoseScript {
  pose: KnightPose
  key: number
  busy: () => boolean
  play: (steps: PoseStep[], end?: KnightPose) => boolean
  hold: (pose: KnightPose) => void
}

export function usePoseScript(rest: KnightPose): PoseScript {
  const [shown, setShown] = useState({ pose: rest, key: 0 })
  const timers = useRef<number[]>([])
  const running = useRef(false)

  const clear = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer))
    timers.current = []
  }

  useEffect(() => clear, [])

  const show = useCallback((pose: KnightPose) => setShown((previous) => ({ pose, key: previous.key + 1 })), [])

  const play = useCallback(
    (steps: PoseStep[], end: KnightPose = rest) => {
      if (running.current || steps.length === 0) return false
      running.current = true
      let at = 0
      steps.forEach((step) => {
        timers.current.push(
          window.setTimeout(() => {
            show(step.pose)
            step.effect?.()
          }, at),
        )
        at += step.ms
      })
      timers.current.push(
        window.setTimeout(() => {
          running.current = false
          timers.current = []
          show(end)
        }, at),
      )
      return true
    },
    [rest, show],
  )

  const hold = useCallback(
    (pose: KnightPose) => {
      clear()
      running.current = false
      show(pose)
    },
    [show],
  )

  const busy = useCallback(() => running.current, [])

  return { pose: shown.pose, key: shown.key, busy, play, hold }
}
