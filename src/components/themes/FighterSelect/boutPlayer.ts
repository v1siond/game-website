'use client'

import { useCallback, useEffect, useState } from 'react'
import { lastBeat, nextBeat, type Beat } from './bout'

// Plays a bout once its scene is on: each beat holds for its ms, then the next shows, until the last,
// which is held. Replay starts it over (a tap on the stage). Under reduced motion the last beat shows at
// once and replay does nothing. `take` changes on every beat so a sprite replays a repeated pose.

export function useBout(beats: readonly Beat[], on: boolean, reduced: boolean) {
  const [index, setIndex] = useState(-1)
  const [take, setTake] = useState(0)

  useEffect(() => {
    if (on && index === -1) setIndex(0)
  }, [on, index])

  useEffect(() => {
    if (index < 0 || index >= lastBeat(beats)) return
    const timer = window.setTimeout(() => {
      setIndex((now) => nextBeat(beats, now))
      setTake((now) => now + 1)
    }, beats[index].ms)
    return () => window.clearTimeout(timer)
  }, [index, beats])

  const replay = useCallback(() => {
    if (reduced) return
    setIndex(0)
    setTake((now) => now + 1)
  }, [reduced])

  const shown = reduced ? lastBeat(beats) : Math.max(0, index)
  return {
    index: shown,
    beat: beats[shown],
    take,
    started: reduced || index >= 0,
    replay,
  }
}
