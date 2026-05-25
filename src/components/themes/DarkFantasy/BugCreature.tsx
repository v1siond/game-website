'use client'

import { useState, useEffect, memo, ReactNode } from 'react'

/**
 * BUG CREATURE - HOLLOW KNIGHT INFECTED STYLE
 * ============================================
 *
 * Based on actual Hollow Knight infected enemies:
 * - Simple round/oval dark shell body
 * - Orange BULBOUS infection growths
 * - Thin spindly legs
 * - Orange glowing eyes
 * - Simple readable silhouette
 */

const DF = {
  void: '#0f0a1a',
  shell: '#2a2040',
  shellDark: '#1a1525',
  infected: '#ff6b35',
  infectedBright: '#ff9955',
  infectedDark: '#cc4420',
}

interface BugCreatureProps {
  size?: number
  className?: string
  style?: React.CSSProperties
  legPhase?: number
  antennaPhase?: number
  isDead?: boolean
  isHit?: boolean
}

export const BugCreature = memo(function BugCreature({
  size = 60,
  className = '',
  style = {},
  legPhase = 0,
  antennaPhase = 0,
  isDead = false,
  isHit = false,
}: BugCreatureProps) {
  // Leg animation - alternating gait
  const getLegY = (index: number) => {
    if (isDead) return 5
    const offset = index % 2 === 0 ? 0 : 0.5
    return Math.sin((legPhase + offset) * Math.PI * 2) * 3
  }

  const antennaWiggle = isDead ? 0 : Math.sin(antennaPhase * Math.PI * 2) * 5

  return (
    <svg
      width={size}
      height={size * 0.7}
      viewBox="0 0 60 42"
      className={className}
      style={{
        ...style,
        filter: isHit ? 'brightness(2) saturate(0)' : undefined,
        transform: isDead ? 'rotate(180deg)' : undefined,
        opacity: isDead ? 0.6 : 1,
      }}
    >
      <defs>
        {/* Infection glow */}
        <filter id="infectionGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Shell gradient */}
        <radialGradient id="shellGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor={DF.shell} />
          <stop offset="100%" stopColor={DF.shellDark} />
        </radialGradient>
      </defs>

      {/* LEGS - thin, spindly, 3 per side */}
      <g stroke={DF.shellDark} strokeWidth="2" strokeLinecap="round" fill="none">
        {/* Left legs */}
        <path d={`M18,22 Q10,${26 + getLegY(0)} 4,${32 + getLegY(0)}`} />
        <path d={`M16,26 Q8,${30 + getLegY(1)} 2,${36 + getLegY(1)}`} />
        <path d={`M18,30 Q12,${34 + getLegY(2)} 6,${40 + getLegY(2)}`} />
        {/* Right legs */}
        <path d={`M42,22 Q50,${26 + getLegY(3)} 56,${32 + getLegY(3)}`} />
        <path d={`M44,26 Q52,${30 + getLegY(4)} 58,${36 + getLegY(4)}`} />
        <path d={`M42,30 Q48,${34 + getLegY(5)} 54,${40 + getLegY(5)}`} />
      </g>

      {/* BODY - simple oval shell */}
      <ellipse
        cx="30"
        cy="24"
        rx="16"
        ry="12"
        fill="url(#shellGrad)"
        stroke={DF.void}
        strokeWidth="1"
      />

      {/* HEAD - smaller oval */}
      <ellipse
        cx="30"
        cy="14"
        rx="10"
        ry="8"
        fill={DF.shell}
        stroke={DF.void}
        strokeWidth="0.5"
      />

      {/* ANTENNAE - simple curved */}
      <path
        d={`M24,10 Q${20 + antennaWiggle},4 ${16 + antennaWiggle},2`}
        fill="none"
        stroke={DF.shellDark}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d={`M36,10 Q${40 - antennaWiggle},4 ${44 - antennaWiggle},2`}
        fill="none"
        stroke={DF.shellDark}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* EYES - orange glowing */}
      <g filter="url(#infectionGlow)">
        <ellipse cx="25" cy="14" rx="3" ry="4" fill={DF.infected} />
        <ellipse cx="35" cy="14" rx="3" ry="4" fill={DF.infected} />
        {/* Eye highlights */}
        <ellipse cx="24" cy="13" rx="1.5" ry="2" fill={DF.infectedBright} opacity="0.7" />
        <ellipse cx="34" cy="13" rx="1.5" ry="2" fill={DF.infectedBright} opacity="0.7" />
      </g>

      {/* INFECTION BLOBS - bulbous orange growths */}
      <g filter="url(#infectionGlow)">
        {/* Main back blob */}
        <ellipse cx="30" cy="20" rx="6" ry="5" fill={DF.infected} opacity="0.9">
          {!isDead && <animate attributeName="rx" values="6;6.5;6" dur="2s" repeatCount="indefinite" />}
        </ellipse>
        {/* Side blobs */}
        <ellipse cx="22" cy="26" rx="4" ry="3.5" fill={DF.infected} opacity="0.8">
          {!isDead && <animate attributeName="ry" values="3.5;4;3.5" dur="1.8s" repeatCount="indefinite" />}
        </ellipse>
        <ellipse cx="38" cy="26" rx="4" ry="3.5" fill={DF.infected} opacity="0.8">
          {!isDead && <animate attributeName="ry" values="3.5;4;3.5" dur="2.2s" repeatCount="indefinite" />}
        </ellipse>
        {/* Small blobs */}
        <circle cx="26" cy="30" r="2.5" fill={DF.infected} opacity="0.6" />
        <circle cx="34" cy="30" r="2" fill={DF.infected} opacity="0.5" />
      </g>

      {/* Blob highlights */}
      <ellipse cx="28" cy="18" rx="2" ry="1.5" fill={DF.infectedBright} opacity="0.4" />
    </svg>
  )
})

// ============================================
// BUG PULL REVEAL ANIMATION
// ============================================

interface BugPullRevealProps {
  children: ReactNode
  triggered: boolean
  className?: string
}

type AnimationPhase = 'idle' | 'bug-enter' | 'bug-center' | 'bug-exit' | 'complete'

const BUG_TIMING = {
  'bug-enter': 0,
  'bug-center': 400,
  'bug-exit': 800,
  'complete': 1200,
}

export const BugPullReveal = memo(function BugPullReveal({
  children,
  triggered,
  className = '',
}: BugPullRevealProps) {
  const [phase, setPhase] = useState<AnimationPhase>('idle')
  const [legPhase, setLegPhase] = useState(0)

  // Leg animation
  useEffect(() => {
    if (phase === 'idle' || phase === 'complete') return

    let rafId: number
    let lastTime = 0

    const animate = (time: number) => {
      if (!lastTime) lastTime = time
      const delta = time - lastTime
      lastTime = time
      setLegPhase(prev => (prev + delta * 0.008) % 1)
      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [phase])

  useEffect(() => {
    if (!triggered) {
      setPhase('idle')
      return
    }

    if (phase !== 'idle') return

    setPhase('bug-enter')

    const timers: NodeJS.Timeout[] = []

    timers.push(setTimeout(() => setPhase('bug-center'), BUG_TIMING['bug-center']))
    timers.push(setTimeout(() => setPhase('bug-exit'), BUG_TIMING['bug-exit']))
    timers.push(setTimeout(() => setPhase('complete'), BUG_TIMING['complete']))

    return () => timers.forEach(t => clearTimeout(t))
  }, [triggered])

  const getBugStyle = (): React.CSSProperties => {
    const baseWobble = { animation: 'bugRun 100ms ease-in-out infinite' }

    switch (phase) {
      case 'idle':
        return { left: '-100px', opacity: 0 }
      case 'bug-enter':
        return { left: '-100px', opacity: 1, transition: 'left 400ms ease-out, opacity 200ms', ...baseWobble }
      case 'bug-center':
        return { left: 'calc(50% - 40px)', opacity: 1, transition: 'left 400ms ease-in-out', ...baseWobble }
      case 'bug-exit':
        return { left: 'calc(100% + 100px)', opacity: 0, transition: 'left 400ms ease-in, opacity 300ms ease-in 100ms', ...baseWobble }
      case 'complete':
        return { left: 'calc(100% + 100px)', opacity: 0 }
      default:
        return { left: '-100px', opacity: 0 }
    }
  }

  const getContentStyle = (): React.CSSProperties => {
    switch (phase) {
      case 'idle':
        return { transform: 'translateX(-100%) translateY(20px)', opacity: 0 }
      case 'bug-enter':
        return { transform: 'translateX(-60%) translateY(10px)', opacity: 0.5, transition: 'all 400ms ease-out' }
      case 'bug-center':
        return { transform: 'translateX(0) translateY(0)', opacity: 1, transition: 'all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)' }
      case 'bug-exit':
      case 'complete':
        return { transform: 'translateX(0) translateY(0)', opacity: 1 }
      default:
        return { transform: 'translateX(0)', opacity: 1 }
    }
  }

  const showBug = phase !== 'idle' && phase !== 'complete'

  return (
    <div className={`relative w-full overflow-hidden ${className}`} style={{ minHeight: '250px' }}>
      {showBug && (
        <div
          className="absolute top-1/2 -translate-y-1/2 z-30 pointer-events-none"
          style={{ ...getBugStyle(), position: 'absolute' }}
        >
          <BugCreature size={80} legPhase={legPhase} antennaPhase={legPhase * 1.5} />
        </div>
      )}

      <div className="relative z-20" style={getContentStyle()}>
        {children}
      </div>

      <style>{`
        @keyframes bugRun {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(-2deg); }
          75% { transform: translateY(3px) rotate(2deg); }
        }
      `}</style>
    </div>
  )
})

export const bugCreatureKeyframes = `
  @keyframes infectionPulse {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.1); }
  }
`
