'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { useScrollScene } from '@/hooks/useScrollScene'
import { travelLines, type SceneLines } from '@/lib/scroll/progress'

// A section whose scene plays over its whole height: a world pins its level strip or lane inside it and
// reads `--scene-progress` from this element, from the moment the section enters to just before it
// leaves. Reduced motion and World Select previews show the final frame at once (useScrollScene).

// Re-measures when the section's height or the viewport changes; the lines only change on a real
// difference, so the scene is not re-armed on every resize event.
function useTravelLines<T extends HTMLElement>(): [SceneLines, (element: T | null) => void] {
  const [element, setElement] = useState<T | null>(null)
  const [lines, setLines] = useState<SceneLines>(() => travelLines(0, 0))

  useEffect(() => {
    if (!element) return
    const measure = () => {
      const next = travelLines(element.offsetHeight, window.innerHeight)
      setLines((previous) => (previous.start === next.start && previous.end === next.end ? previous : next))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    window.addEventListener('resize', measure, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [element])

  return [lines, setElement]
}

// A wrapper, not a landmark: the panel inside it is the labelled section. `relative z-20` keeps the
// section above the world's fixed backdrop layers once a transform inside it makes a stacking context.
// `className` carries the world's own scene class.
export function TravelScene({ children, className = '' }: { children: ReactNode; className?: string }) {
  const [lines, measure] = useTravelLines<HTMLElement>()
  const { ref, phase } = useScrollScene<HTMLElement>(lines)
  const setElement = useCallback(
    (element: HTMLElement | null) => {
      ref(element)
      measure(element)
    },
    [ref, measure],
  )

  return (
    <div ref={setElement} data-scene-phase={phase} className={`relative z-20 mb-8 ${className}`}>
      {children}
    </div>
  )
}
