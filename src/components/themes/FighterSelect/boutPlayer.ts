import { useCallback, useEffect, useState } from 'react'
import { useLatest } from '@/hooks/useLatest'
import { lastBeat, nextBeat, type Beat } from './bout'

// Plays a bout once its scene is on: each beat holds for its ms, then the next shows, until the last,
// which is held. Replay starts it over (a tap on the stage). Under reduced motion the last beat shows at
// once and replay does nothing. `take` changes on every beat so a sprite replays a repeated pose.
// `onBeat` is called from the bout's clock with each beat it moves to, so a scene acts on a beat (a hit
// on the combo counter) without an effect relaying it a commit later.

export function useBout(beats: readonly Beat[], on: boolean, reduced: boolean, onBeat?: (beat: Beat) => void) {
  const [index, setIndex] = useState(-1)
  const [take, setTake] = useState(0)
  // The first render with the scene on starts the bout, in that render rather than an effect after it, and
  // a new take, so the sprites mounted before the scene came in play their first beat from here.
  if (on && index === -1) {
    setIndex(0)
    setTake((now) => now + 1)
  }

  // The latest onBeat, so a new one each render never restarts the clock.
  const beatRef = useLatest(onBeat)

  useEffect(() => {
    if (index < 0 || index >= lastBeat(beats)) return
    const timer = window.setTimeout(() => {
      const next = nextBeat(beats, index)
      setIndex(next)
      setTake((now) => now + 1)
      beatRef.current?.(beats[next])
    }, beats[index].ms)
    return () => window.clearTimeout(timer)
  }, [index, beats, beatRef])

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
