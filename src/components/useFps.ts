import { useEffect, useRef, useState } from 'react'

/** Samples frames-per-second via requestAnimationFrame, refreshing ~once per second.
 *  Shared by the game-engine editor's top-nav readout (edit/show) and its play-mode floating box (#86). */
export function useFps(): number {
  const [fps, setFps] = useState(0)
  const frames = useRef(0)
  const last = useRef(0)
  useEffect(() => {
    let raf = 0
    last.current = performance.now()
    const tick = () => {
      frames.current++
      const now = performance.now()
      const delta = now - last.current
      if (delta >= 1000) {
        setFps(Math.round((frames.current * 1000) / delta))
        frames.current = 0
        last.current = now
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return fps
}
