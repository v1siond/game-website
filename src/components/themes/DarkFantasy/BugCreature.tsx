'use client'

import { useState, useEffect, memo, ReactNode } from 'react'
import { KnightCharacter } from './KnightCharacter'
import { BattleBug } from './BattleReveal'

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
// BUG ATTACK REVEAL ANIMATION
// ============================================
// Narrative: Bug throws content AT Alex as an attack, starting the battle
// Alex is on left, bug throws content at him, then enters attack stance

interface BugPullRevealProps {
  children: ReactNode
  triggered: boolean
  className?: string
}

type AnimationPhase =
  | 'idle'
  | 'alex-enters'      // Alex walks in from left
  | 'bug-appears'      // Bug emerges from right with content
  | 'bug-throws'       // Bug throws content AT Alex
  | 'content-lands'    // Content lands near Alex
  | 'attack-stance'    // Bug floats into attack position, Alex reacts
  | 'complete'

const ATTACK_TIMING = {
  'alex-enters': 0,
  'bug-appears': 300,
  'bug-throws': 600,
  'content-lands': 900,
  'attack-stance': 1200,
  'complete': 1700,
}

export const BugPullReveal = memo(function BugPullReveal({
  children,
  triggered,
  className = '',
}: BugPullRevealProps) {
  const [phase, setPhase] = useState<AnimationPhase>('idle')
  const [legPhase, setLegPhase] = useState(0)

  // Bug leg/antenna animation
  useEffect(() => {
    if (phase === 'idle' || phase === 'complete') return

    let rafId: number
    let lastTime = 0

    const animate = (time: number) => {
      if (!lastTime) lastTime = time
      const delta = time - lastTime
      lastTime = time
      // Faster when throwing, slower when floating
      const speed = phase === 'bug-throws' ? 0.015 : phase === 'attack-stance' ? 0.003 : 0.006
      setLegPhase(prev => (prev + delta * speed) % 1)
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

    setPhase('alex-enters')

    const timers: NodeJS.Timeout[] = []

    timers.push(setTimeout(() => setPhase('bug-appears'), ATTACK_TIMING['bug-appears']))
    timers.push(setTimeout(() => setPhase('bug-throws'), ATTACK_TIMING['bug-throws']))
    timers.push(setTimeout(() => setPhase('content-lands'), ATTACK_TIMING['content-lands']))
    timers.push(setTimeout(() => setPhase('attack-stance'), ATTACK_TIMING['attack-stance']))
    timers.push(setTimeout(() => setPhase('complete'), ATTACK_TIMING['complete']))

    return () => timers.forEach(t => clearTimeout(t))
  }, [triggered])

  // Alex enters from left, reacts to attack
  const getAlexStyle = (): React.CSSProperties => {
    switch (phase) {
      case 'idle':
        return { left: '-100px', opacity: 0 }
      case 'alex-enters':
        return {
          left: '8%',
          opacity: 1,
          transition: 'all 300ms ease-out'
        }
      case 'bug-appears':
      case 'bug-throws':
        return {
          left: '8%',
          opacity: 1
        }
      case 'content-lands':
        // Alex steps back slightly, surprised
        return {
          left: '5%',
          opacity: 1,
          transition: 'all 150ms ease-out'
        }
      case 'attack-stance':
      case 'complete':
        // Alex ready for battle
        return {
          left: '5%',
          opacity: phase === 'complete' ? 0.5 : 1,
          transition: 'opacity 300ms'
        }
      default:
        return { left: '-100px', opacity: 0 }
    }
  }

  // Bug comes from LEFT, throws content, then floats UP into attack stance
  const getBugStyle = (): React.CSSProperties => {
    switch (phase) {
      case 'idle':
      case 'alex-enters':
        // Bug starts off-screen LEFT
        return { left: '-120px', opacity: 0, transform: 'translateY(0)' }
      case 'bug-appears':
        // Bug enters from LEFT to center-right area
        return {
          left: '60%',
          opacity: 1,
          transform: 'translateY(0)',
          transition: 'all 400ms ease-out'
        }
      case 'bug-throws':
        // Bug lunges LEFT while throwing content at Alex
        return {
          left: '45%',
          opacity: 1,
          transform: 'translateY(-10px) rotate(-5deg)',
          transition: 'all 250ms ease-out'
        }
      case 'content-lands':
        // Bug retreats back to right
        return {
          left: '70%',
          opacity: 1,
          transform: 'translateY(0)',
          transition: 'all 300ms ease-out'
        }
      case 'attack-stance':
        // Bug floats UP into attack position
        return {
          left: '75%',
          opacity: 1,
          transform: 'translateY(-40px)',
          transition: 'all 400ms ease-out',
          animation: 'bugFloat 1000ms ease-in-out infinite'
        }
      case 'complete':
        return {
          left: '75%',
          opacity: 0.5,
          transform: 'translateY(-40px)',
          animation: 'bugFloat 1000ms ease-in-out infinite',
          transition: 'opacity 300ms'
        }
      default:
        return { right: '-120px', opacity: 0 }
    }
  }

  // Content gets thrown from bug towards Alex
  const getContentStyle = (): React.CSSProperties => {
    switch (phase) {
      case 'idle':
      case 'alex-enters':
        return { transform: 'translateX(120%)', opacity: 0 }
      case 'bug-appears':
        return {
          transform: 'translateX(80%)',
          opacity: 0.5,
          transition: 'all 300ms ease-out'
        }
      case 'bug-throws':
        // Content flies towards Alex (left side)
        return {
          transform: 'translateX(10%)',
          opacity: 0.9,
          transition: 'all 300ms ease-out'
        }
      case 'content-lands':
      case 'attack-stance':
        return {
          transform: 'translateX(0)',
          opacity: 1,
          transition: 'all 200ms cubic-bezier(0.34, 1.56, 0.64, 1)'
        }
      case 'complete':
        return { transform: 'translateX(0)', opacity: 1 }
      default:
        return { transform: 'translateX(0)', opacity: 1 }
    }
  }

  const showBug = phase !== 'idle' && phase !== 'alex-enters'
  const showAlex = phase !== 'idle'

  return (
    <div className={`relative w-full overflow-hidden ${className}`} style={{ minHeight: '280px' }}>
      {/* Alex on the left */}
      {showAlex && (
        <div
          className="absolute top-1/2 -translate-y-1/2 z-10 pointer-events-none"
          style={{ ...getAlexStyle(), position: 'absolute' }}
        >
          <KnightCharacter scale={1.4} facingDirection="right" />
        </div>
      )}

      {/* Bug throwing content then floating in attack stance */}
      {showBug && (
        <div
          className="absolute top-1/2 -translate-y-1/2 z-30 pointer-events-none"
          style={{ ...getBugStyle(), position: 'absolute' }}
        >
          <BattleBug size={110} legPhase={legPhase} antennaPhase={legPhase * 1.3} />
        </div>
      )}

      {/* Content being thrown at Alex */}
      <div className="relative z-20" style={getContentStyle()}>
        {children}
      </div>

      <style>{`
        @keyframes bugFloat {
          0%, 100% { transform: translateY(-40px); }
          50% { transform: translateY(-55px); }
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
