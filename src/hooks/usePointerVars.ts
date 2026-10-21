'use client'

import { useEffect, useRef } from 'react'

// The one pointer follower for every world. Each world decides its own motion from --mx and --my in CSS.

/**
 * Writes the pointer's place on the element as --mx and --my, -1 to 1 from the viewport centre: one
 * passive listener, at most one write a frame. Off until the element is drawn and under reduced
 * motion, where the layers stay still.
 */
export function usePointerVars(enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || !enabled) return
    let frame = 0
    let x = 0
    let y = 0

    const write = () => {
      frame = 0
      element.style.setProperty('--mx', x.toFixed(3))
      element.style.setProperty('--my', y.toFixed(3))
    }
    const onMove = (event: PointerEvent) => {
      x = (event.clientX / window.innerWidth) * 2 - 1
      y = (event.clientY / window.innerHeight) * 2 - 1
      if (!frame) frame = window.requestAnimationFrame(write)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.cancelAnimationFrame(frame)
    }
  }, [enabled])

  return ref
}
