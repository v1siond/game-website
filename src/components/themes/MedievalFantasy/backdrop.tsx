'use client'

import { memo, useEffect, useState } from 'react'
import { WC3 } from './palette'
import { ReignOfChaosAtmosphere } from './reignOfChaos'
import { FrozenThroneAtmosphere } from './frozenThrone'

// The fixed backdrop behind the page: the Reign of Chaos zone fades into the Frozen Throne as the page scrolls.

export const DualZoneAtmosphere = memo(function DualZoneAtmosphere() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight
          const progress = Math.min(window.scrollY / maxScroll, 1)
          setScrollProgress(progress)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const transitionPoint = 0.4
  const rocOpacity = scrollProgress < transitionPoint ? 1 : Math.max(0, 1 - (scrollProgress - transitionPoint) / 0.2)
  const ftOpacity = scrollProgress < transitionPoint ? 0 : Math.min(1, (scrollProgress - transitionPoint) / 0.2)

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {/* Base dark */}
      <div style={{ position: 'absolute', inset: 0, background: WC3.bgVoid }} />

      {/* REIGN OF CHAOS atmosphere */}
      <div style={{ position: 'absolute', inset: 0, opacity: rocOpacity, transition: 'opacity 0.5s ease' }}>
        <ReignOfChaosAtmosphere />
      </div>

      {/* FROZEN THRONE atmosphere */}
      <div style={{ position: 'absolute', inset: 0, opacity: ftOpacity, transition: 'opacity 0.5s ease' }}>
        <FrozenThroneAtmosphere />
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
