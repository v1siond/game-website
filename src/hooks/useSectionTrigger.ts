'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useLatest } from '@/hooks/useLatest'

// Whether a section is on screen, from an IntersectionObserver on the element `ref` is set on. With
// `triggerOnce` (the default) `triggered` turns true the first time the section shows and stays true, and
// the element is no longer watched. With `triggerOnce: false` it follows the section in and out, and
// `inView` says the same; a one shot caller gets `inView` false, since nothing watches it
// once it has shown. `onEnter` runs each time the section comes into view (once for a one shot section), in
// the observer's callback, so a caller acts on the entry without an effect relaying `triggered`.

export interface SectionTriggerOptions {
  threshold?: number      // How much of element must be visible (0-1)
  rootMargin?: string     // Margin around viewport (e.g., "0px 0px -20% 0px")
  triggerOnce?: boolean   // Turn true once and stay (default: true); false follows the section in and out
  onEnter?: () => void    // Runs on each entry; the latest one is called, so it need not be stable
}

// A section taller than the screen can never show `threshold` of itself on a phone, so it counts as in view
// once it fills TALL_FILL of the screen instead; anything shorter keeps the plain ratio test.
const TALL_FILL = 0.5
// Ratio steps from 0 to the threshold, so the observer reports a tall section's small ratios too.
const STEPS = 20
// Sub pixel slack, so the crossing that fires the callback is not missed by a rounding.
const SLACK_PX = 1

const ratioSteps = (threshold: number) => Array.from({ length: STEPS + 1 }, (_, step) => (threshold * step) / STEPS)

function isShown(entry: IntersectionObserverEntry, threshold: number): boolean {
  if (!entry.isIntersecting) return false
  const needed = Math.min(entry.boundingClientRect.height * threshold, (entry.rootBounds?.height ?? Infinity) * TALL_FILL)
  return entry.intersectionRect.height >= needed - SLACK_PX
}

export interface SectionTriggerReturn {
  ref: React.RefCallback<HTMLElement>
  triggered: boolean
  inView: boolean
}

export function useSectionTrigger(options: SectionTriggerOptions = {}): SectionTriggerReturn {
  const {
    threshold = 0.15,
    rootMargin = '0px 0px -10% 0px',  // Trigger when 10% from bottom of viewport
    triggerOnce = true,
    onEnter,
  } = options

  const [shown, setShown] = useState(false)
  const elementRef = useRef<HTMLElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // The latest onEnter, so a new one each render never rebuilds the observer.
  const enterRef = useLatest(onEnter)

  const setRef = useCallback((element: HTMLElement | null) => {
    // Cleanup previous observer
    if (observerRef.current && elementRef.current) {
      observerRef.current.unobserve(elementRef.current)
    }

    elementRef.current = element

    if (!element) return

    // The observer reports every ratio step, so an entry is the change from not shown to shown.
    let wasShown = false
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return

        const now = isShown(entry, threshold)
        // A one shot section only ever turns on, and once on it is not watched again.
        if (triggerOnce && !now) return
        setShown(now)
        if (triggerOnce) observerRef.current?.unobserve(element)
        if (now && !wasShown) enterRef.current?.()
        wasShown = now
      },
      {
        threshold: ratioSteps(threshold),
        rootMargin,
      }
    )

    observerRef.current.observe(element)
  }, [threshold, rootMargin, triggerOnce, enterRef])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return {
    ref: setRef,
    triggered: shown,
    inView: !triggerOnce && shown,
  }
}
