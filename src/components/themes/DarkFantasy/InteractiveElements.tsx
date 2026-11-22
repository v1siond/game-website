'use client'

import { useState, useEffect, useRef, memo } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { usePointerVars } from '@/hooks/usePointerVars'
import { DARK_FANTASY } from './palette'

/**
 * DARK FANTASY INTERACTIVE ELEMENTS
 * =================================
 *
 * GPU-optimized interactive animations:
 * - CursorTrail: Ethereal particles that follow cursor movement
 * - ParallaxLayers: Background depth effect on mouse move, read from --mx and --my (usePointerVars)
 *
 * All animations use only transform and opacity for 60fps performance.
 */

// The trail and the parallax hide at 768px and below (too distracting on a phone).
const WIDER_THAN_MOBILE = '(min-width: 769px)'

// ============================================
// CURSOR TRAIL
// ============================================
// Ethereal particles that follow the cursor

interface Particle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  color: string
  life: number
}

// One fade tick: every particle loses life and drifts up a pixel, and the spent ones go.
const fadeStep = (particles: Particle[]): Particle[] =>
  particles.map((p) => ({ ...p, life: p.life - 0.05, y: p.y - 1 })).filter((p) => p.life > 0)

export const CursorTrail = memo(function CursorTrail() {
  const [particles, setParticles] = useState<Particle[]>([])
  const isVisible = useMediaQuery(WIDER_THAN_MOBILE)
  const lastEmitRef = useRef(0)
  const particleIdRef = useRef(0)

  // Create particles on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastEmitRef.current > 50) { // Emit every 50ms
        lastEmitRef.current = now

        const newParticle: Particle = {
          id: particleIdRef.current++,
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          size: 3 + Math.random() * 4,
          opacity: 0.6 + Math.random() * 0.3,
          color: Math.random() > 0.5 ? DARK_FANTASY.spiritGold : DARK_FANTASY.ethereal,
          life: 1,
        }

        setParticles(prev => [...prev.slice(-15), newParticle]) // Keep max 15 particles
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Fade the particles out, ticking only while any is alive: with the pointer still the trail renders nothing.
  const alive = particles.length > 0
  useEffect(() => {
    if (!alive) return
    const interval = setInterval(() => setParticles(fadeStep), 30)
    return () => clearInterval(interval)
  }, [alive])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[44]" aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.x,
            top: p.y,
            width: p.size * p.life,
            height: p.size * p.life,
            background: `radial-gradient(circle, ${p.color} 0%, transparent 70%)`,
            opacity: p.opacity * p.life,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  )
})

// ============================================
// PARALLAX BACKGROUND LAYERS
// ============================================
// Subtle depth effect on mouse movement. The mouse's place from the screen centre (-1 to 1) moves the near layer
// up to 20px across and 15px down, the mid layer 0.6 of that and the deep layer 0.3, all in CSS: a move writes
// two custom properties and renders nothing. A finger dragging on a tablet leaves the layers still.

export const ParallaxLayers = memo(function ParallaxLayers() {
  const isVisible = useMediaQuery(WIDER_THAN_MOBILE)
  const pointerRef = usePointerVars(isVisible, { mouseOnly: true })

  if (!isVisible) return null

  return (
    <div ref={pointerRef} className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" aria-hidden="true">
      {/* Deep background layer - moves slowest */}
      <div className="absolute inset-0 [transform:translate(calc(var(--mx,0)*6px),calc(var(--my,0)*4.5px))] [transition:transform_0.3s_ease-out]">
        {/* Distant ethereal orbs */}
        {[
          { x: '10%', y: '20%', size: 100, color: DARK_FANTASY.ethereal, opacity: 0.05 },
          { x: '80%', y: '30%', size: 150, color: DARK_FANTASY.spiritGold, opacity: 0.04 },
          { x: '20%', y: '70%', size: 120, color: DARK_FANTASY.lavender, opacity: 0.04 },
          { x: '70%', y: '80%', size: 80, color: DARK_FANTASY.ethereal, opacity: 0.05 },
        ].map((orb, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: orb.x,
              top: orb.y,
              width: orb.size,
              height: orb.size,
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              opacity: orb.opacity,
            }}
          />
        ))}
      </div>

      {/* Mid layer - moves medium */}
      <div className="absolute inset-0 [transform:translate(calc(var(--mx,0)*12px),calc(var(--my,0)*9px))] [transition:transform_0.2s_ease-out]">
        {/* Floating dust motes */}
        {[
          { x: '15%', y: '25%', size: 3 },
          { x: '45%', y: '15%', size: 2 },
          { x: '75%', y: '35%', size: 4 },
          { x: '25%', y: '65%', size: 3 },
          { x: '85%', y: '55%', size: 2 },
          { x: '55%', y: '85%', size: 3 },
        ].map((mote, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: mote.x,
              top: mote.y,
              width: mote.size,
              height: mote.size,
              background: i % 2 === 0 ? DARK_FANTASY.spiritGold : DARK_FANTASY.ethereal,
              opacity: 0.3,
            }}
          />
        ))}
      </div>

      {/* Near layer - moves most */}
      <div className="absolute inset-0 [transform:translate(calc(var(--mx,0)*20px),calc(var(--my,0)*15px))] [transition:transform_0.1s_ease-out]">
        {/* Close floating particles */}
        {[
          { x: '5%', y: '40%', size: 2, color: DARK_FANTASY.spiritGold },
          { x: '95%', y: '20%', size: 3, color: DARK_FANTASY.ethereal },
          { x: '50%', y: '90%', size: 2, color: DARK_FANTASY.lavender },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              background: p.color,
              opacity: 0.5,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            }}
          />
        ))}
      </div>
    </div>
  )
})
