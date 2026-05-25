import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Smooth scroll tracking with interpolation
 * Returns smoothed scroll position that animates rather than jumping
 */
export function useSmoothScroll(smoothing = 0.1) {
  const [scrollY, setScrollY] = useState(0)
  const [smoothScrollY, setSmoothScrollY] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isScrollingDown, setIsScrollingDown] = useState(true)
  const lastScrollY = useRef(0)
  const rafRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const handleScroll = () => {
      const newScrollY = window.scrollY
      setIsScrollingDown(newScrollY > lastScrollY.current)
      lastScrollY.current = newScrollY
      setScrollY(newScrollY)

      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docHeight > 0 ? newScrollY / docHeight : 0)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Smooth interpolation using requestAnimationFrame
  useEffect(() => {
    const animate = () => {
      setSmoothScrollY(prev => {
        const diff = scrollY - prev
        if (Math.abs(diff) < 0.5) return scrollY
        return prev + diff * smoothing
      })
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [scrollY, smoothing])

  return { scrollY, smoothScrollY, scrollProgress, isScrollingDown }
}

/**
 * One-time trigger that only fires on first scroll-down past threshold
 * Won't re-trigger when scrolling back up
 */
export function useScrollTrigger(threshold: number) {
  const [hasTriggered, setHasTriggered] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      const isScrollingDown = currentY > lastScrollY.current
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? currentY / docHeight : 0
      lastScrollY.current = currentY

      if (!hasTriggered && isScrollingDown && progress >= threshold) {
        setHasTriggered(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold, hasTriggered])

  return hasTriggered
}

/**
 * Track multiple scroll trigger zones
 * Returns which zones have been triggered (only on scroll down)
 */
export function useScrollZones(zones: number[]) {
  const [triggered, setTriggered] = useState<Set<number>>(new Set())
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      const isScrollingDown = currentY > lastScrollY.current
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? currentY / docHeight : 0
      lastScrollY.current = currentY

      if (isScrollingDown) {
        zones.forEach(zone => {
          if (!triggered.has(zone) && progress >= zone) {
            setTriggered(prev => new Set([...prev, zone]))
          }
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [zones, triggered])

  return triggered
}

/**
 * Intersection observer for element visibility
 * Triggers once when element enters viewport while scrolling down
 */
export function useInViewTrigger(ref: React.RefObject<HTMLElement | null>, options?: IntersectionObserverInit) {
  const [hasEntered, setHasEntered] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const element = ref.current
    if (!element || hasEntered) return

    const handleScroll = () => {
      lastScrollY.current = window.scrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && window.scrollY > lastScrollY.current) {
          setHasEntered(true)
        }
        lastScrollY.current = window.scrollY
      },
      { threshold: 0.1, ...options }
    )

    observer.observe(element)
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [ref, hasEntered, options])

  return hasEntered
}

/**
 * Smooth value interpolation (lerp)
 */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Map a value from one range to another
 */
export function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  return clamp(((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin, outMin, outMax)
}
