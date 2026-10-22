'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { usePreview } from '@/themes/PreviewContext'

/**
 * SECTION TRIGGER HOOK
 * ====================
 * Uses IntersectionObserver to detect when sections enter viewport.
 * This replaces hardcoded percentage-based triggers that break when
 * content changes (font sizes, spacing, etc.)
 *
 * How it works:
 * - Each section registers its element ref
 * - IntersectionObserver fires when element enters viewport
 * - Once triggered, stays triggered (no replay on scroll back)
 * - Threshold determines how much of element must be visible
 *
 * Pattern: IntersectionObserver (browser-native, performant)
 * Why chosen: Automatically handles content size changes, responsive,
 * no manual percentage calculations needed.
 */

export interface SectionTriggerOptions {
  threshold?: number      // How much of element must be visible (0-1)
  rootMargin?: string     // Margin around viewport (e.g., "0px 0px -20% 0px")
  triggerOnce?: boolean   // Only trigger once (default: true)
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
  } = options

  const [triggered, setTriggered] = useState(false)
  const [inView, setInView] = useState(false)
  const elementRef = useRef<HTMLElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // In a World Select preview, sections are clipped/frozen so the observer never
  // fires, force everything "triggered" so the hero renders instead of staying blank.
  const isPreview = usePreview()

  const setRef = useCallback((element: HTMLElement | null) => {
    // Cleanup previous observer
    if (observerRef.current && elementRef.current) {
      observerRef.current.unobserve(elementRef.current)
    }

    elementRef.current = element

    if (!element) return

    // Create observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return

        const shown = isShown(entry, threshold)
        setInView(shown)

        if (shown) {
          setTriggered(true)

          // Unobserve if triggerOnce
          if (triggerOnce && observerRef.current) {
            observerRef.current.unobserve(element)
          }
        } else if (!triggerOnce) {
          setTriggered(false)
        }
      },
      {
        threshold: ratioSteps(threshold),
        rootMargin,
      }
    )

    observerRef.current.observe(element)
  }, [threshold, rootMargin, triggerOnce])

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
    triggered: isPreview || triggered,
    inView: isPreview || inView,
  }
}
