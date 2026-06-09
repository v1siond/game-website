'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'

/**
 * useInView — continuous "is this element currently in the viewport?" signal.
 *
 * Unlike `useSectionTrigger` (one-shot `triggered` that latches true), this toggles
 * back to false when the element scrolls out of view. We use it to fade the fixed
 * combat layer out as the user scrolls past a section ("the bug disappears as we go
 * down") rather than leaving the knight/bug pinned to the corner forever.
 */
export function useInView(rootMargin = '-30% 0px -30% 0px') {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0, rootMargin }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])
  return { ref, inView }
}

/**
 * FixedCombatLayer — pins the knight/bug combat to the viewport so only the section
 * CONTENT scrolls. `fixed inset-0` makes this a full-viewport box, so any child with
 * `left/right/bottom` percentages resolves against the viewport (knight ~15-20% from a
 * side, ~15-20% from the bottom). Fades out when the section leaves view. The reveals
 * live directly under <main> (no transformed ancestor), so `fixed` is genuinely
 * viewport-relative here.
 */
export function FixedCombatLayer({ inView, children }: { inView: boolean; children: ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-40 pointer-events-none"
      style={{ opacity: inView ? 1 : 0, transition: 'opacity 350ms ease-out' }}
      aria-hidden="true"
    >
      {children}
    </div>
  )
}
