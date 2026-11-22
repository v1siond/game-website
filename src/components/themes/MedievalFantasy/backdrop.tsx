'use client'

import { memo, useEffect, useRef } from 'react'
import { REALM } from './palette'
import { ChaosAtmosphere } from './chaosZone'
import { FrostAtmosphere } from './frostZone'

// The fixed backdrop behind the page: the chaos zone fades into the frost zone as the page scrolls.

// The chaos zone holds until 40% of the scroll, then the two cross over the next 20%.
const TRANSITION_POINT = 0.4
const TRANSITION_SPAN = 0.2

const crossfade = (progress: number): { roc: number; ft: number } => {
  const ft = Math.min(1, Math.max(0, (progress - TRANSITION_POINT) / TRANSITION_SPAN))
  return { roc: 1 - ft, ft }
}

// The scroll writes the two zone opacities as --roc and --ft on the backdrop's root once per frame, so a
// scroll re-renders nothing; each layer reads its variable and eases into it over half a second.
export const DualZoneAtmosphere = memo(function DualZoneAtmosphere() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0
    const paint = () => {
      frame = 0
      const root = rootRef.current
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      if (!root || maxScroll <= 0) return
      const { roc, ft } = crossfade(Math.min(window.scrollY / maxScroll, 1))
      root.style.setProperty('--roc', String(roc))
      root.style.setProperty('--ft', String(ft))
    }
    const handleScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(paint)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={rootRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {/* Base dark */}
      <div style={{ position: 'absolute', inset: 0, background: REALM.bgVoid }} />

      {/* REIGN OF CHAOS atmosphere */}
      <div className="absolute inset-0 opacity-[var(--roc,1)] transition-opacity duration-500 ease-[ease]">
        <ChaosAtmosphere />
      </div>

      {/* FROZEN THRONE atmosphere */}
      <div className="absolute inset-0 opacity-[var(--ft,0)] transition-opacity duration-500 ease-[ease]">
        <FrostAtmosphere />
      </div>

      {/* Vignette (always visible) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, transparent 20%, rgba(0,0,0,0.7) 100%)',
        pointerEvents: 'none'
      }} />
    </div>
  )
})
