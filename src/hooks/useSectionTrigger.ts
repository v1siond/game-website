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
  // fires — force everything "triggered" so the hero renders instead of staying blank.
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

        setInView(entry.isIntersecting)

        if (entry.isIntersecting) {
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
        threshold,
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

/**
 * MULTI-SECTION TRIGGER HOOK
 * ==========================
 * Manages triggers for multiple sections at once.
 * More efficient than individual observers for many sections.
 */

export interface MultiSectionTriggerOptions {
  sectionIds: string[]
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export interface MultiSectionTriggerReturn {
  registerSection: (id: string, element: HTMLElement | null) => void
  isTriggered: (id: string) => boolean
  isInView: (id: string) => boolean
  triggeredSections: Set<string>
}

export function useMultiSectionTrigger(options: MultiSectionTriggerOptions): MultiSectionTriggerReturn {
  const {
    sectionIds,
    threshold = 0.15,
    rootMargin = '0px 0px -10% 0px',
    triggerOnce = true,
  } = options

  const [triggeredSections, setTriggeredSections] = useState<Set<string>>(new Set())
  const [inViewSections, setInViewSections] = useState<Set<string>>(new Set())
  const elementsRef = useRef<Map<string, HTMLElement>>(new Map())
  const observerRef = useRef<IntersectionObserver | null>(null)

  // See useSectionTrigger: previews are frozen, so report every section as triggered.
  const isPreview = usePreview()

  // Create observer once
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const id = entry.target.getAttribute('data-section-id')
          if (!id) return

          if (entry.isIntersecting) {
            setInViewSections(prev => new Set([...prev, id]))
            setTriggeredSections(prev => new Set([...prev, id]))
          } else {
            setInViewSections(prev => {
              const next = new Set(prev)
              next.delete(id)
              return next
            })
            if (!triggerOnce) {
              setTriggeredSections(prev => {
                const next = new Set(prev)
                next.delete(id)
                return next
              })
            }
          }
        })
      },
      {
        threshold,
        rootMargin,
      }
    )

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [threshold, rootMargin, triggerOnce])

  const registerSection = useCallback((id: string, element: HTMLElement | null) => {
    const observer = observerRef.current
    if (!observer) return

    // Unobserve previous element for this id
    const prevElement = elementsRef.current.get(id)
    if (prevElement) {
      observer.unobserve(prevElement)
    }

    if (!element) {
      elementsRef.current.delete(id)
      return
    }

    // Set data attribute for identification in callback
    element.setAttribute('data-section-id', id)
    elementsRef.current.set(id, element)
    observer.observe(element)
  }, [])

  const isTriggered = useCallback((id: string) => {
    return isPreview || triggeredSections.has(id)
  }, [isPreview, triggeredSections])

  const isInView = useCallback((id: string) => {
    return isPreview || inViewSections.has(id)
  }, [isPreview, inViewSections])

  return {
    registerSection,
    isTriggered,
    isInView,
    triggeredSections,
  }
}
