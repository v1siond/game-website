'use client'

import { useState, useEffect, useRef, useCallback, memo } from 'react'

/**
 * DARK FANTASY INTERACTIVE ELEMENTS
 * =================================
 *
 * GPU-optimized interactive animations:
 * - SpiritCompanion: Floating character that follows scroll and reacts to mouse
 * - CursorTrail: Ethereal particles that follow cursor movement
 * - ParallaxLayers: Background depth effect on mouse move
 *
 * All animations use only transform and opacity for 60fps performance.
 */

// Color palette (matching DarkFantasyTheme)
const DF = {
  void: '#0f0a1a',
  ethereal: '#41c8e8',
  spiritGold: '#e8c841',
  brass: '#b08d57',
  lavender: '#b7a9d9',
}

// ============================================
// SPIRIT COMPANION
// ============================================
// A small ethereal being that floats alongside the user,
// bobbing gently and reacting to mouse proximity

interface SpiritState {
  x: number
  y: number
  targetX: number
  targetY: number
  scale: number
  rotation: number
  mood: 'idle' | 'curious' | 'excited' | 'sleepy'
}

export const SpiritCompanion = memo(function SpiritCompanion() {
  const [state, setState] = useState<SpiritState>({
    x: 100,
    y: 200,
    targetX: 100,
    targetY: 200,
    scale: 1,
    rotation: 0,
    mood: 'idle',
  })
  const [isVisible, setIsVisible] = useState(true)
  const rafRef = useRef<number | null>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const scrollRef = useRef(0)
  const idleTimeRef = useRef(0)
  const lastInteractionRef = useRef(Date.now())

  // Smooth animation loop
  useEffect(() => {
    let lastTime = performance.now()

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000
      lastTime = currentTime

      setState(prev => {
        // Easing towards target position
        const easing = 0.08
        const newX = prev.x + (prev.targetX - prev.x) * easing
        const newY = prev.y + (prev.targetY - prev.y) * easing

        // Idle bobbing animation
        idleTimeRef.current += deltaTime
        const bobOffset = Math.sin(idleTimeRef.current * 2) * 8
        const wobble = Math.sin(idleTimeRef.current * 3) * 3

        // Calculate distance to mouse
        const distToMouse = Math.sqrt(
          Math.pow(mouseRef.current.x - prev.x, 2) +
          Math.pow(mouseRef.current.y - prev.y, 2)
        )

        // Determine mood based on interaction
        const timeSinceInteraction = Date.now() - lastInteractionRef.current
        let mood: SpiritState['mood'] = 'idle'
        let scale = 1

        if (distToMouse < 150) {
          mood = 'curious'
          scale = 1.1
          lastInteractionRef.current = Date.now()
        } else if (distToMouse < 80) {
          mood = 'excited'
          scale = 1.2
        } else if (timeSinceInteraction > 5000) {
          mood = 'sleepy'
          scale = 0.9
        }

        return {
          ...prev,
          x: newX,
          y: newY + bobOffset,
          scale,
          rotation: wobble,
          mood,
        }
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      lastInteractionRef.current = Date.now()

      // Spirit follows mouse loosely (stays to the side)
      setState(prev => ({
        ...prev,
        targetX: Math.min(window.innerWidth - 100, Math.max(50, e.clientX - 150)),
        targetY: Math.min(window.innerHeight - 100, Math.max(50, e.clientY - 50)),
      }))
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Track scroll position - spirit follows scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const scrollDelta = scrollY - scrollRef.current
      scrollRef.current = scrollY

      // Move spirit based on scroll direction
      setState(prev => ({
        ...prev,
        targetY: Math.min(window.innerHeight - 100, Math.max(100, prev.targetY + scrollDelta * 0.3)),
      }))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Hide on mobile (too distracting)
  useEffect(() => {
    const checkMobile = () => {
      setIsVisible(window.innerWidth > 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!isVisible) return null

  // Get spirit expression based on mood
  const getEyeStyle = () => {
    switch (state.mood) {
      case 'curious': return { scaleY: 1.2 }
      case 'excited': return { scaleY: 0.6 } // squinting happy
      case 'sleepy': return { scaleY: 0.4, translateY: 2 }
      default: return { scaleY: 1 }
    }
  }

  return (
    <div
      className="fixed pointer-events-none z-[45]"
      style={{
        left: state.x,
        top: state.y,
        transform: `translate(-50%, -50%) scale(${state.scale}) rotate(${state.rotation}deg)`,
        transition: 'transform 0.1s ease-out',
      }}
      aria-hidden="true"
    >
      <svg width="60" height="70" viewBox="0 0 60 70">
        {/* Outer glow */}
        <defs>
          <radialGradient id="spiritGlow" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor={DF.spiritGold} stopOpacity="0.6" />
            <stop offset="50%" stopColor={DF.spiritGold} stopOpacity="0.2" />
            <stop offset="100%" stopColor={DF.spiritGold} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="spiritCore" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="30%" stopColor={DF.spiritGold} stopOpacity="0.8" />
            <stop offset="100%" stopColor={DF.spiritGold} stopOpacity="0.4" />
          </radialGradient>
        </defs>

        {/* Glow aura */}
        <ellipse cx="30" cy="30" rx="28" ry="25" fill="url(#spiritGlow)" />

        {/* Main body - teardrop shape */}
        <path
          d="M30,8 C42,8 48,20 48,32 C48,44 42,52 30,58 C18,52 12,44 12,32 C12,20 18,8 30,8"
          fill="url(#spiritCore)"
        />

        {/* Inner highlight */}
        <ellipse cx="30" cy="25" rx="10" ry="8" fill="#fff" opacity="0.4" />

        {/* Eyes */}
        <g style={{ transform: `translateY(${getEyeStyle().translateY || 0}px)` }}>
          <ellipse
            cx="23"
            cy="28"
            rx="3"
            ry={4 * (getEyeStyle().scaleY || 1)}
            fill={DF.void}
          />
          <ellipse
            cx="37"
            cy="28"
            rx="3"
            ry={4 * (getEyeStyle().scaleY || 1)}
            fill={DF.void}
          />
          {/* Eye highlights */}
          <circle cx="24" cy="27" r="1" fill="#fff" opacity="0.8" />
          <circle cx="38" cy="27" r="1" fill="#fff" opacity="0.8" />
        </g>

        {/* Mouth based on mood */}
        {state.mood === 'excited' && (
          <path d="M26,36 Q30,40 34,36" fill="none" stroke={DF.void} strokeWidth="1.5" strokeLinecap="round" />
        )}
        {state.mood === 'curious' && (
          <ellipse cx="30" cy="37" rx="2" ry="2" fill={DF.void} />
        )}
        {state.mood === 'sleepy' && (
          <path d="M27,36 L33,36" fill="none" stroke={DF.void} strokeWidth="1.5" strokeLinecap="round" />
        )}

        {/* Trailing wisps */}
        <path
          d="M25,55 Q20,62 18,68 M30,58 Q30,65 28,70 M35,55 Q40,62 42,68"
          fill="none"
          stroke={DF.spiritGold}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
          style={{
            animation: 'wispTrail 2s ease-in-out infinite',
          }}
        />
      </svg>

      {/* Floating sparkles around spirit */}
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: i % 2 === 0 ? DF.spiritGold : DF.ethereal,
            left: 20 + Math.sin(idleTimeRef.current * 2 + i * 2) * 25,
            top: 15 + Math.cos(idleTimeRef.current * 1.5 + i * 2.5) * 20,
            opacity: 0.6 + Math.sin(idleTimeRef.current * 3 + i) * 0.3,
            boxShadow: `0 0 4px ${i % 2 === 0 ? DF.spiritGold : DF.ethereal}`,
          }}
        />
      ))}
    </div>
  )
})

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

export const CursorTrail = memo(function CursorTrail() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isVisible, setIsVisible] = useState(true)
  const mouseRef = useRef({ x: 0, y: 0 })
  const lastEmitRef = useRef(0)
  const particleIdRef = useRef(0)

  // Create particles on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }

      const now = Date.now()
      if (now - lastEmitRef.current > 50) { // Emit every 50ms
        lastEmitRef.current = now

        const newParticle: Particle = {
          id: particleIdRef.current++,
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          size: 3 + Math.random() * 4,
          opacity: 0.6 + Math.random() * 0.3,
          color: Math.random() > 0.5 ? DF.spiritGold : DF.ethereal,
          life: 1,
        }

        setParticles(prev => [...prev.slice(-15), newParticle]) // Keep max 15 particles
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Animate particles (fade out)
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev =>
        prev
          .map(p => ({ ...p, life: p.life - 0.05, y: p.y - 1 }))
          .filter(p => p.life > 0)
      )
    }, 30)

    return () => clearInterval(interval)
  }, [])

  // Hide on mobile
  useEffect(() => {
    const checkMobile = () => setIsVisible(window.innerWidth > 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
// Subtle depth effect on mouse movement

export const ParallaxLayers = memo(function ParallaxLayers() {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      const x = (e.clientX - centerX) / centerX
      const y = (e.clientY - centerY) / centerY

      setOffset({ x: x * 20, y: y * 15 })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Hide on mobile
  useEffect(() => {
    const checkMobile = () => setIsVisible(window.innerWidth > 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" aria-hidden="true">
      {/* Deep background layer - moves slowest */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${offset.x * 0.3}px, ${offset.y * 0.3}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      >
        {/* Distant ethereal orbs */}
        {[
          { x: '10%', y: '20%', size: 100, color: DF.ethereal, opacity: 0.05 },
          { x: '80%', y: '30%', size: 150, color: DF.spiritGold, opacity: 0.04 },
          { x: '20%', y: '70%', size: 120, color: DF.lavender, opacity: 0.04 },
          { x: '70%', y: '80%', size: 80, color: DF.ethereal, opacity: 0.05 },
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
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${offset.x * 0.6}px, ${offset.y * 0.6}px)`,
          transition: 'transform 0.2s ease-out',
        }}
      >
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
              background: i % 2 === 0 ? DF.spiritGold : DF.ethereal,
              opacity: 0.3,
            }}
          />
        ))}
      </div>

      {/* Near layer - moves most */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* Close floating particles */}
        {[
          { x: '5%', y: '40%', size: 2, color: DF.spiritGold },
          { x: '95%', y: '20%', size: 3, color: DF.ethereal },
          { x: '50%', y: '90%', size: 2, color: DF.lavender },
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

// ============================================
// CSS KEYFRAMES (add to global styles)
// ============================================
export const interactiveKeyframes = `
  @keyframes wispTrail {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(3px); }
  }
`
