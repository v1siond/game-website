'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'

/**
 * SCROLL TRIGGER SYSTEM
 * ====================
 *
 * This system manages content visibility based on scroll position.
 * Content is "hidden" by default and becomes visible when user
 * scrolls near its trigger point.
 *
 * KEY CONCEPTS:
 * - Trigger Point: A percentage of page height where content starts revealing
 * - Trigger Distance: How far before the trigger point content starts fading in
 * - Active State: Whether content is visible (triggered) or hidden
 *
 * PERFORMANCE CONSIDERATIONS:
 * - Uses requestAnimationFrame for scroll handling
 * - Debounces resize calculations
 * - Memoizes trigger calculations
 * - Components can use the "triggered" state to conditionally render
 */

export interface TriggerPoint {
  id: string
  /** Percentage of page height (0-100) where this trigger activates */
  position: number
  /** Distance in pixels before trigger point where fade-in starts */
  fadeDistance?: number
}

export interface TriggerState {
  id: string
  /** Whether the trigger has been activated */
  triggered: boolean
  /** Progress from 0 (not visible) to 1 (fully visible) for fade effects */
  progress: number
  /** Whether this section is currently in the viewport */
  inView: boolean
}

export interface ScrollTriggerConfig {
  /** Array of trigger points to track */
  triggers: TriggerPoint[]
  /** Global fade distance if not specified per trigger (default: 200px) */
  defaultFadeDistance?: number
  /** Offset from top of viewport to consider as "trigger line" (default: 70% of viewport) */
  viewportTriggerOffset?: number
  /** Whether to keep content visible once triggered (default: true) */
  persistTriggered?: boolean
}

interface ScrollTriggerReturn {
  /** Current state of all triggers */
  states: Map<string, TriggerState>
  /** Current scroll progress (0-1) through the page */
  scrollProgress: number
  /** Total page height */
  pageHeight: number
  /** Viewport height */
  viewportHeight: number
  /** Current scroll position */
  scrollY: number
  /** Helper to check if a specific trigger is active */
  isTriggered: (id: string) => boolean
  /** Helper to get progress of a specific trigger */
  getProgress: (id: string) => number
  /** Force recalculation of page dimensions */
  recalculate: () => void
}

export function useScrollTriggers(config: ScrollTriggerConfig): ScrollTriggerReturn {
  const {
    triggers,
    defaultFadeDistance = 200,
    viewportTriggerOffset = 0.7,
    persistTriggered = true,
  } = config

  // Page dimensions
  const [pageHeight, setPageHeight] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(0)
  const [scrollY, setScrollY] = useState(0)

  // Trigger states
  const [states, setStates] = useState<Map<string, TriggerState>>(new Map())

  // Track which triggers have been activated (for persistence)
  const triggeredOnce = useRef<Set<string>>(new Set())

  // RAF reference for scroll handling
  const rafRef = useRef<number | null>(null)
  const lastScrollY = useRef(0)

  // Calculate page dimensions
  const calculateDimensions = useCallback(() => {
    if (typeof window === 'undefined') return

    const docHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    )

    setPageHeight(docHeight)
    setViewportHeight(window.innerHeight)
  }, [])

  // Calculate trigger states based on scroll position
  const calculateTriggerStates = useCallback((currentScrollY: number) => {
    if (pageHeight === 0 || viewportHeight === 0) return

    const triggerLineY = currentScrollY + (viewportHeight * viewportTriggerOffset)

    const newStates = new Map<string, TriggerState>()

    triggers.forEach((trigger) => {
      const fadeDistance = trigger.fadeDistance ?? defaultFadeDistance
      const triggerY = (trigger.position / 100) * pageHeight

      // Calculate distance to trigger
      const distanceToTrigger = triggerY - triggerLineY

      // Calculate progress (0 = not visible, 1 = fully visible)
      let progress = 0
      if (distanceToTrigger <= 0) {
        progress = 1
      } else if (distanceToTrigger < fadeDistance) {
        progress = 1 - (distanceToTrigger / fadeDistance)
      }

      // Check if triggered
      const triggered = progress >= 1 || (persistTriggered && triggeredOnce.current.has(trigger.id))

      if (triggered && persistTriggered) {
        triggeredOnce.current.add(trigger.id)
      }

      // Check if in viewport (roughly)
      const sectionTop = triggerY - fadeDistance
      const sectionBottom = triggerY + viewportHeight
      const inView = currentScrollY + viewportHeight > sectionTop && currentScrollY < sectionBottom

      newStates.set(trigger.id, {
        id: trigger.id,
        triggered,
        progress: Math.min(1, Math.max(0, progress)),
        inView,
      })
    })

    setStates(newStates)
  }, [triggers, pageHeight, viewportHeight, viewportTriggerOffset, defaultFadeDistance, persistTriggered])

  // Scroll handler with RAF throttling
  const handleScroll = useCallback(() => {
    if (rafRef.current) return

    rafRef.current = requestAnimationFrame(() => {
      const currentScrollY = window.scrollY

      // Only update if scroll changed significantly (reduces calculations)
      if (Math.abs(currentScrollY - lastScrollY.current) > 2) {
        lastScrollY.current = currentScrollY
        setScrollY(currentScrollY)
        calculateTriggerStates(currentScrollY)
      }

      rafRef.current = null
    })
  }, [calculateTriggerStates])

  // Debounced resize handler
  const resizeTimeout = useRef<NodeJS.Timeout | null>(null)
  const handleResize = useCallback(() => {
    if (resizeTimeout.current) {
      clearTimeout(resizeTimeout.current)
    }

    resizeTimeout.current = setTimeout(() => {
      calculateDimensions()
      calculateTriggerStates(window.scrollY)
    }, 100)
  }, [calculateDimensions, calculateTriggerStates])

  // Force recalculation
  const recalculate = useCallback(() => {
    calculateDimensions()
    calculateTriggerStates(window.scrollY)
  }, [calculateDimensions, calculateTriggerStates])

  // Initialize and set up listeners
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Initial calculation
    calculateDimensions()

    // Small delay to ensure DOM is fully rendered
    const initTimeout = setTimeout(() => {
      calculateDimensions()
      setScrollY(window.scrollY)
      calculateTriggerStates(window.scrollY)
    }, 100)

    // Set up listeners
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      clearTimeout(initTimeout)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (resizeTimeout.current) clearTimeout(resizeTimeout.current)
    }
  }, [calculateDimensions, calculateTriggerStates, handleScroll, handleResize])

  // Recalculate when triggers change
  useEffect(() => {
    if (pageHeight > 0) {
      calculateTriggerStates(scrollY)
    }
  }, [triggers, pageHeight, calculateTriggerStates, scrollY])

  // Helper functions
  const isTriggered = useCallback((id: string) => {
    return states.get(id)?.triggered ?? false
  }, [states])

  const getProgress = useCallback((id: string) => {
    return states.get(id)?.progress ?? 0
  }, [states])

  // Calculate overall scroll progress
  const scrollProgress = useMemo(() => {
    if (pageHeight <= viewportHeight) return 1
    return scrollY / (pageHeight - viewportHeight)
  }, [scrollY, pageHeight, viewportHeight])

  return {
    states,
    scrollProgress,
    pageHeight,
    viewportHeight,
    scrollY,
    isTriggered,
    getProgress,
    recalculate,
  }
}

/**
 * WRAPPER COMPONENT HELPER
 *
 * This provides a simple component wrapper that uses triggers
 * to conditionally render children.
 */
export interface TriggerSectionProps {
  id: string
  states: Map<string, TriggerState>
  children: React.ReactNode
  /** Whether to render children before triggered (hidden but in DOM) */
  preRender?: boolean
  /** Custom styles based on trigger state */
  getStyles?: (state: TriggerState | undefined) => React.CSSProperties
}

/**
 * Default styles for triggered sections
 * Uses only transform and opacity for GPU acceleration
 */
export function getDefaultTriggerStyles(state: TriggerState | undefined): React.CSSProperties {
  if (!state) {
    return {
      opacity: 0,
      transform: 'translateY(30px)',
      transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
    }
  }

  return {
    opacity: state.progress,
    transform: `translateY(${30 * (1 - state.progress)}px)`,
    transition: state.triggered ? 'opacity 0.6s ease-out, transform 0.6s ease-out' : 'none',
  }
}
