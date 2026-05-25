'use client'

import { useState, useEffect, useRef, memo, ReactNode } from 'react'
import { KnightCharacter } from './KnightCharacter'

/**
 * BATTLE REVEAL ANIMATION
 * =======================
 *
 * A dramatic content reveal sequence where a knight defeats a bug
 * and content drops from above where the bug was holding it.
 *
 * Animation Timeline:
 * - 0-500ms:    Bug wanders, Knight enters from left
 * - 500-800ms:  Knight dashes toward bug
 * - 800-1000ms: Slash effect with hit impact
 * - 1000-1300ms: Bug death animation (flip, sparks)
 * - 1300-1600ms: Bug falls to ground
 * - 1600-2000ms: Content drops with bounce
 * - 2000ms+:    Static final state
 *
 * Uses only transform and opacity for GPU-accelerated performance.
 */

// Color palette (matching DarkFantasyTheme)
const DF = {
  void: '#0f0a1a',
  ethereal: '#41c8e8',
  spiritGold: '#e8c841',
  brass: '#b08d57',
  lavender: '#b7a9d9',
  bone: '#e8e4dc',
}

// Animation phases
type AnimationPhase =
  | 'idle'           // Not started
  | 'bug-wander'     // Bug moving, knight entering
  | 'knight-dash'    // Knight dashes toward bug
  | 'slash'          // Slash attack
  | 'bug-hit'        // Bug recoils from hit
  | 'bug-tremble'    // Bug trembles before exploding
  | 'bug-death'      // Bug EXPLODES
  | 'bug-fall'       // Bug falls to ground
  | 'content-drop'   // Content drops from above
  | 'complete'       // Final static state

interface BattleRevealProps {
  children: ReactNode
  triggered: boolean
}

// Phase timing - faster start, longer explosion
const PHASE_TIMING = {
  'bug-wander': 0,
  'knight-dash': 300,
  'slash': 500,
  'bug-hit': 600,
  'bug-tremble': 700,
  'bug-death': 1100,
  'bug-fall': 1600,
  'content-drop': 2000,
  'complete': 2500,
}

export const BattleReveal = memo(function BattleReveal({
  children,
  triggered
}: BattleRevealProps) {
  const [phase, setPhase] = useState<AnimationPhase>('idle')
  const [showSlash, setShowSlash] = useState(false)
  const [showImpact, setShowImpact] = useState(false)
  const [showDeathParticles, setShowDeathParticles] = useState(false)
  const [showBloodSplatter, setShowBloodSplatter] = useState(false)
  const [showBloodPool, setShowBloodPool] = useState(false)
  const [screenShake, setScreenShake] = useState(false)
  const [bugHit, setBugHit] = useState(false)
  const [bugTremble, setBugTremble] = useState(false)
  const [attackPhase, setAttackPhase] = useState(0)
  const [legPhase, setLegPhase] = useState(0)
  const [antennaPhase, setAntennaPhase] = useState(0)

  const rafRef = useRef<number | null>(null)
  const lastTimeRef = useRef(0)

  // Continuous animation loop for leg/antenna movement
  useEffect(() => {
    if (phase === 'idle' || phase === 'complete') {
      return
    }

    const animate = (currentTime: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = currentTime
      const deltaTime = currentTime - lastTimeRef.current
      lastTimeRef.current = currentTime

      // Update leg and antenna phases for continuous movement
      setLegPhase(prev => (prev + deltaTime * 0.006) % 1)
      setAntennaPhase(prev => (prev + deltaTime * 0.008) % 1)

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [phase])

  // Trigger animation sequence
  useEffect(() => {
    if (!triggered) {
      // Reset all state when scrolling back up
      setPhase('idle')
      setAttackPhase(0)
      setShowSlash(false)
      setShowImpact(false)
      setShowDeathParticles(false)
      setShowBloodSplatter(false)
      setShowBloodPool(false)
      setScreenShake(false)
      setBugHit(false)
      setBugTremble(false)
      return
    }

    // Only start if coming from idle (prevents re-triggering mid-animation)
    if (phase !== 'idle') return

    // Start the sequence
    setPhase('bug-wander')

    const timers: NodeJS.Timeout[] = []

    // Knight dash
    timers.push(setTimeout(() => setPhase('knight-dash'), PHASE_TIMING['knight-dash']))

    // Slash attack - animate attack phase
    timers.push(setTimeout(() => {
      setPhase('slash')
      setShowSlash(true)
      // Animate attack phase from 0 to 1 over 200ms
      let start = performance.now()
      const animateAttack = (now: number) => {
        const progress = Math.min((now - start) / 200, 1)
        setAttackPhase(progress)
        if (progress < 1) requestAnimationFrame(animateAttack)
      }
      requestAnimationFrame(animateAttack)
    }, PHASE_TIMING['slash']))

    // Bug hit - blood splatter!
    timers.push(setTimeout(() => {
      setShowSlash(false)
      setShowImpact(true)
      setShowBloodSplatter(true)
      setBugHit(true)
      setPhase('bug-hit')
    }, PHASE_TIMING['bug-hit']))

    // Bug tremble - shaking violently before explosion
    timers.push(setTimeout(() => {
      setShowImpact(false)
      setBugHit(false)
      setBugTremble(true)
      setPhase('bug-tremble')
    }, PHASE_TIMING['bug-tremble']))

    // Bug death - EXPLOSIVE with screen shake!
    timers.push(setTimeout(() => {
      setShowBloodSplatter(false)
      setBugTremble(false)
      setShowDeathParticles(true)
      setShowBloodPool(true)
      setScreenShake(true)
      setPhase('bug-death')
      setAttackPhase(0)
    }, PHASE_TIMING['bug-death']))

    // Bug fall - particles continue, shake stops
    timers.push(setTimeout(() => {
      setScreenShake(false)
      setPhase('bug-fall')
    }, PHASE_TIMING['bug-fall']))

    // Death particles fade (longer - 500ms after fall)
    timers.push(setTimeout(() => {
      setShowDeathParticles(false)
    }, PHASE_TIMING['bug-fall'] + 500))

    // Content drop
    timers.push(setTimeout(() => setPhase('content-drop'), PHASE_TIMING['content-drop']))

    // Complete
    timers.push(setTimeout(() => setPhase('complete'), PHASE_TIMING['complete']))

    return () => timers.forEach(t => clearTimeout(t))
  }, [triggered])

  // Calculate positions based on phase
  const getKnightStyle = (): React.CSSProperties => {
    switch (phase) {
      case 'idle':
        return {
          transform: 'translateX(-200px)',
          opacity: 0
        }
      case 'bug-wander':
        return {
          transform: 'translateX(0)',
          opacity: 1,
          transition: 'transform 500ms ease-out, opacity 300ms ease-out'
        }
      case 'knight-dash':
        return {
          transform: 'translateX(180px)',
          opacity: 1,
          transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)'
        }
      default:
        return {
          transform: 'translateX(80px)',
          opacity: 1,
          transition: 'transform 200ms ease-out'
        }
    }
  }

  const getBugStyle = (): React.CSSProperties => {
    const baseStyle = {
      transition: 'transform 200ms ease-out, opacity 200ms ease-out',
    }

    // Bug base: right-[18%] bottom-[15%] (BOTTOM RIGHT - where bug ends up dead)
    // Explosion: left-[12%] top-[15%] (TOP LEFT - where bug starts and explodes)
    // Bug starts at TOP LEFT, flies to BOTTOM RIGHT for battle, then explodes back at TOP LEFT

    switch (phase) {
      case 'idle':
        // Start at EXPLOSION position (TOP LEFT)
        // Large negative X and Y to move from bottom-right base to top-left
        return {
          ...baseStyle,
          transform: 'translateX(-280px) translateY(-180px) rotateZ(0deg)',
          opacity: 0
        }
      case 'bug-wander':
        // Bug flies from TOP LEFT down to BOTTOM RIGHT battle position
        return {
          ...baseStyle,
          transform: 'translateX(0) translateY(0) rotateZ(0deg)',
          opacity: 1,
          transition: 'all 600ms ease-out',
          animation: 'bugWander 600ms ease-in-out infinite'
        }
      case 'knight-dash':
        return {
          ...baseStyle,
          transform: 'translateX(0) translateY(0) rotateZ(0deg)',
          opacity: 1
        }
      case 'slash':
      case 'bug-hit':
        // Recoil from hit at battle position
        return {
          ...baseStyle,
          transform: 'translateX(30px) translateY(-15px) rotateZ(-15deg) scale(0.95)',
          opacity: 1,
          transition: 'transform 100ms ease-out'
        }
      case 'bug-tremble':
        // Tremble before explosion at battle position
        return {
          ...baseStyle,
          transform: 'translateX(30px) translateY(-10px) rotateZ(-10deg) scale(0.95)',
          opacity: 1,
          animation: 'bugTremble 50ms ease-in-out infinite',
          transition: 'none'
        }
      case 'bug-death':
        // Bug flies back to TOP LEFT explosion position, flips and explodes
        return {
          ...baseStyle,
          transform: 'translateX(-280px) translateY(-180px) rotateZ(180deg) scale(0.85)',
          opacity: 0.9,
          transition: 'transform 400ms cubic-bezier(0.68, -0.55, 0.27, 1.55)'
        }
      case 'bug-fall':
        // Bug falls from TOP LEFT explosion to ground (still on left side)
        return {
          ...baseStyle,
          transform: 'translateX(-200px) translateY(50px) rotateZ(180deg) scale(0.75)',
          opacity: 0.7,
          transition: 'transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }
      case 'content-drop':
      case 'complete':
        // Dead on the ground (left side, below explosion)
        return {
          ...baseStyle,
          transform: 'translateX(-200px) translateY(50px) rotateZ(180deg) scale(0.75)',
          opacity: 0.55,
        }
      default:
        return baseStyle
    }
  }

  const getContentStyle = (): React.CSSProperties => {
    switch (phase) {
      case 'idle':
        // Content HIDDEN when not triggered (ready to drop in)
        return {
          transform: 'translateY(-100vh)',
          opacity: 0
        }
      case 'bug-wander':
      case 'knight-dash':
      case 'slash':
      case 'bug-hit':
      case 'bug-tremble':
      case 'bug-death':
      case 'bug-fall':
        // Content hidden during entire battle, drops only after bug dies
        return {
          transform: 'translateY(-100vh)',
          opacity: 0
        }
      case 'content-drop':
        return {
          transform: 'translateY(0)',
          opacity: 1,
          animation: 'contentDrop 400ms cubic-bezier(0.34, 1.56, 0.64, 1)'
        }
      case 'complete':
        return {
          transform: 'translateY(0)',
          opacity: 1
        }
      default:
        return {
          transform: 'translateY(0)',
          opacity: 1
        }
    }
  }

  const isAnimating = phase !== 'idle' && phase !== 'complete'
  const showKnight = phase !== 'idle'
  const showBug = phase !== 'idle'
  const showContent = phase === 'content-drop' || phase === 'complete'
  const isBugDead = ['bug-death', 'bug-fall', 'content-drop', 'complete'].includes(phase)
  const isAttacking = phase === 'slash' || phase === 'knight-dash'

  return (
    <>
      {/* CSS Keyframes */}
      <style>{battleRevealKeyframes}</style>

      <div
        className={`relative w-full min-h-[300px] flex items-center justify-center ${screenShake ? 'animate-screenShake' : ''}`}
        aria-live="polite"
        aria-label={isAnimating ? "Battle animation in progress" : "Content revealed"}
      >
        {/* Knight - CLOSER to center */}
        {showKnight && (
          <div
            className="absolute left-[15%] bottom-[20%] z-20"
            style={getKnightStyle()}
          >
            <div className={phase === 'slash' ? 'animate-knightSlash' : ''}>
              <KnightCharacter
                scale={1.3}
                attacking={isAttacking}
                attackPhase={attackPhase}
                facingDirection="right"
              />
            </div>
          </div>
        )}

        {/* Slash Arc Effect */}
        {showSlash && (
          <div
            className="absolute left-[30%] bottom-[30%] z-30 pointer-events-none"
            style={{ animation: 'slashArc 150ms ease-out forwards' }}
          >
            <SlashEffect />
          </div>
        )}

        {/* Impact Burst Effect */}
        {showImpact && (
          <div
            className="absolute right-[25%] bottom-[35%] z-30 pointer-events-none"
            style={{ animation: 'impactBurst 150ms ease-out forwards' }}
          >
            <ImpactBurst />
          </div>
        )}

        {/* Blood Splatter - on hit */}
        {showBloodSplatter && (
          <div
            className="absolute right-[22%] bottom-[40%] z-35 pointer-events-none"
          >
            <BloodSplatter />
          </div>
        )}

        {/* Blood Pool - stays on the floor after explosion (LEFT side where bug falls) */}
        {showBloodPool && (
          <div
            className="absolute left-[15%] bottom-[8%] z-5 pointer-events-none"
          >
            <BloodPool />
          </div>
        )}

        {/* Death Particles - EXPLOSIVE - TOP LEFT of container */}
        {showDeathParticles && (
          <div
            className="absolute left-[12%] top-[15%] z-30 pointer-events-none"
          >
            <DeathParticles />
          </div>
        )}

        {/* Bug - CLOSER to center */}
        {showBug && (
          <div
            className={`absolute right-[18%] bottom-[15%] z-10 ${bugTremble ? 'animate-bugTremble' : ''}`}
            style={getBugStyle()}
          >
            {isBugDead ? (
              <DeadBugCreature size={120} />
            ) : (
              <BattleBug
                size={120}
                legPhase={legPhase}
                antennaPhase={antennaPhase}
                isHit={bugHit}
              />
            )}
          </div>
        )}

        {/* Content - center, drops from above */}
        <div
          className="relative z-15"
          style={getContentStyle()}
        >
          {/* Drop shadow that appears as content falls */}
          {showContent && (
            <div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-2 rounded-full"
              style={{
                background: `radial-gradient(ellipse, ${DF.void}80 0%, transparent 70%)`,
                animation: 'shadowGrow 400ms ease-out forwards'
              }}
            />
          )}
          {children}
        </div>
      </div>
    </>
  )
})

// Battle Bug - SIMPLE Hollow Knight style
// Based on actual HK infected enemies: round body, orange blobs, simple legs
// EXPORTED for reuse in BugDiscoverReveal
export const BattleBug = memo(function BattleBug({
  size = 100,
  legPhase = 0,
  antennaPhase = 0,
  isHit = false,
}: {
  size?: number
  legPhase?: number
  antennaPhase?: number
  isHit?: boolean
}) {
  const shell = '#2a2040'
  const shellDark = '#1a1525'
  const infected = '#ff6b35'
  const infectedBright = '#ff9955'

  const getLegY = (index: number) => {
    const offset = index % 2 === 0 ? 0 : 0.5
    return Math.sin((legPhase + offset) * Math.PI * 2) * 3
  }

  const antennaWiggle = Math.sin(antennaPhase * Math.PI * 2) * 6

  return (
    <svg
      width={size}
      height={size * 0.7}
      viewBox="0 0 80 56"
      style={{
        filter: isHit ? 'brightness(2) saturate(0)' : `drop-shadow(0 0 10px ${infected}50)`,
        transition: 'filter 100ms'
      }}
    >
      <defs>
        <filter id="battleGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="battleShellGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor={shell} />
          <stop offset="100%" stopColor={shellDark} />
        </radialGradient>
      </defs>

      {/* SIMPLE THIN LEGS - 3 per side */}
      <g stroke={shellDark} strokeWidth="2.5" strokeLinecap="round" fill="none">
        <path d={`M24,30 Q14,${34 + getLegY(0)} 6,${42 + getLegY(0)}`} />
        <path d={`M22,36 Q12,${40 + getLegY(1)} 4,${48 + getLegY(1)}`} />
        <path d={`M26,40 Q18,${44 + getLegY(2)} 10,${52 + getLegY(2)}`} />
        <path d={`M56,30 Q66,${34 + getLegY(3)} 74,${42 + getLegY(3)}`} />
        <path d={`M58,36 Q68,${40 + getLegY(4)} 76,${48 + getLegY(4)}`} />
        <path d={`M54,40 Q62,${44 + getLegY(5)} 70,${52 + getLegY(5)}`} />
      </g>

      {/* SIMPLE BODY - round oval */}
      <ellipse cx="40" cy="32" rx="22" ry="16" fill="url(#battleShellGrad)" stroke={DF.void} strokeWidth="1" />

      {/* HEAD - smaller oval */}
      <ellipse cx="40" cy="18" rx="14" ry="10" fill={shell} stroke={DF.void} strokeWidth="0.5" />

      {/* ANTENNAE - simple curved */}
      <path d={`M30,12 Q${24 + antennaWiggle},4 ${20 + antennaWiggle},0`} fill="none" stroke={shellDark} strokeWidth="2" strokeLinecap="round" />
      <path d={`M50,12 Q${56 - antennaWiggle},4 ${60 - antennaWiggle},0`} fill="none" stroke={shellDark} strokeWidth="2" strokeLinecap="round" />

      {/* EYES - orange glowing */}
      <g filter="url(#battleGlow)">
        <ellipse cx="32" cy="18" rx="5" ry="6" fill={infected} />
        <ellipse cx="48" cy="18" rx="5" ry="6" fill={infected} />
        <ellipse cx="30" cy="16" rx="2" ry="3" fill={infectedBright} opacity="0.7" />
        <ellipse cx="46" cy="16" rx="2" ry="3" fill={infectedBright} opacity="0.7" />
      </g>

      {/* INFECTION BLOBS - bulbous orange growths */}
      <g filter="url(#battleGlow)">
        <ellipse cx="40" cy="26" rx="8" ry="7" fill={infected} opacity="0.9">
          <animate attributeName="rx" values="8;9;8" dur="2s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="28" cy="36" rx="6" ry="5" fill={infected} opacity="0.8">
          <animate attributeName="ry" values="5;6;5" dur="1.8s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="52" cy="36" rx="6" ry="5" fill={infected} opacity="0.8">
          <animate attributeName="ry" values="5;6;5" dur="2.2s" repeatCount="indefinite" />
        </ellipse>
        <circle cx="36" cy="42" r="4" fill={infected} opacity="0.6" />
        <circle cx="46" cy="40" r="3" fill={infected} opacity="0.5" />
      </g>

      {/* Blob highlights */}
      <ellipse cx="38" cy="24" rx="3" ry="2" fill={infectedBright} opacity="0.4" />
    </svg>
  )
})

// Dead Bug - SIMPLE Hollow Knight style, flipped
const DeadBugCreature = memo(function DeadBugCreature({ size = 100 }: { size?: number }) {
  const shell = '#2a2040'
  const shellDark = '#1a1525'
  const infected = '#ff6b35'

  return (
    <svg
      width={size}
      height={size * 0.7}
      viewBox="0 0 80 56"
      style={{
        opacity: 0.7,
        transform: 'rotate(180deg)',
        filter: `drop-shadow(0 0 6px ${infected}30)`
      }}
    >
      <defs>
        <radialGradient id="deadShellGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor={shell} />
          <stop offset="100%" stopColor={shellDark} />
        </radialGradient>
      </defs>

      {/* CURLED LEGS - pointing inward */}
      <g stroke={shellDark} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7">
        <path d="M24,30 Q18,24 20,18" />
        <path d="M22,36 Q16,30 18,24" />
        <path d="M26,40 Q22,34 24,28" />
        <path d="M56,30 Q62,24 60,18" />
        <path d="M58,36 Q64,30 62,24" />
        <path d="M54,40 Q58,34 56,28" />
      </g>

      {/* BODY */}
      <ellipse cx="40" cy="32" rx="22" ry="16" fill="url(#deadShellGrad)" stroke={DF.void} strokeWidth="1" opacity="0.85" />

      {/* HEAD */}
      <ellipse cx="40" cy="18" rx="14" ry="10" fill={shell} stroke={DF.void} strokeWidth="0.5" opacity="0.85" />

      {/* ANTENNAE - drooped */}
      <path d="M30,12 Q22,18 16,22" fill="none" stroke={shellDark} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M50,12 Q58,18 64,22" fill="none" stroke={shellDark} strokeWidth="2" strokeLinecap="round" opacity="0.6" />

      {/* X EYES - dead */}
      <g stroke={infected} strokeWidth="2.5" strokeLinecap="round" opacity="0.7">
        <line x1="26" y1="12" x2="38" y2="24" />
        <line x1="38" y1="12" x2="26" y2="24" />
        <line x1="42" y1="12" x2="54" y2="24" />
        <line x1="54" y1="12" x2="42" y2="24" />
      </g>

      {/* Dimmed infection - leaking */}
      <ellipse cx="40" cy="26" rx="6" ry="5" fill={infected} opacity="0.35" />
      <ellipse cx="30" cy="36" rx="4" ry="3" fill={infected} opacity="0.25" />
      <ellipse cx="50" cy="36" rx="4" ry="3" fill={infected} opacity="0.25" />

      {/* Blood pool below */}
      <ellipse cx="40" cy="50" rx="15" ry="4" fill={infected} opacity="0.4" />
      <path d="M36,42 Q38,46 40,50" fill="none" stroke={infected} strokeWidth="3" opacity="0.4" />
    </svg>
  )
})

// Slash effect SVG - white/cyan arc trail
const SlashEffect = memo(function SlashEffect() {
  return (
    <svg
      width="150"
      height="100"
      viewBox="0 0 150 100"
      aria-hidden="true"
      style={{
        filter: `drop-shadow(0 0 10px ${DF.ethereal}) drop-shadow(0 0 20px ${DF.bone})`
      }}
    >
      <defs>
        <linearGradient id="slashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={DF.bone} stopOpacity="1" />
          <stop offset="50%" stopColor={DF.ethereal} stopOpacity="0.8" />
          <stop offset="100%" stopColor={DF.ethereal} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Main slash arc */}
      <path
        d="M0,80 Q40,20 100,5 Q130,0 145,10"
        fill="none"
        stroke="url(#slashGrad)"
        strokeWidth="8"
        strokeLinecap="round"
        style={{
          strokeDasharray: '200',
          strokeDashoffset: '200',
          animation: 'slashDraw 200ms ease-out forwards'
        }}
      />
      {/* Secondary trail */}
      <path
        d="M10,85 Q50,30 105,15"
        fill="none"
        stroke={DF.bone}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.5"
        style={{
          strokeDasharray: '150',
          strokeDashoffset: '150',
          animation: 'slashDraw 150ms ease-out 50ms forwards'
        }}
      />
    </svg>
  )
})

// Impact burst effect - sparks radiating from hit point
const ImpactBurst = memo(function ImpactBurst() {
  const sparkCount = 8
  const sparks = Array.from({ length: sparkCount }, (_, i) => ({
    angle: (360 / sparkCount) * i,
    length: 20 + Math.random() * 15,
    delay: Math.random() * 50,
  }))

  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      aria-hidden="true"
    >
      {/* Central flash */}
      <circle
        cx="40"
        cy="40"
        r="15"
        fill={DF.bone}
        style={{ animation: 'flashPulse 150ms ease-out forwards' }}
      />
      <circle
        cx="40"
        cy="40"
        r="8"
        fill={DF.ethereal}
        style={{ animation: 'flashPulse 100ms ease-out forwards' }}
      />

      {/* Radiating sparks */}
      {sparks.map((spark, i) => {
        const radian = (spark.angle * Math.PI) / 180
        const endX = 40 + Math.cos(radian) * spark.length
        const endY = 40 + Math.sin(radian) * spark.length

        return (
          <line
            key={i}
            x1="40"
            y1="40"
            x2={endX}
            y2={endY}
            stroke={i % 2 === 0 ? DF.bone : DF.ethereal}
            strokeWidth="2"
            strokeLinecap="round"
            style={{
              opacity: 0,
              animation: `sparkShoot 150ms ease-out ${spark.delay}ms forwards`
            }}
          />
        )
      })}
    </svg>
  )
})

// EXPLOSIVE Death particles - more dramatic, more particles, bigger explosion
const DeathParticles = memo(function DeathParticles() {
  const orangeColors = ['#ff7b00', '#ff9500', '#ffaa00', '#cc5500', '#ff6b35', '#ff4400']

  // Core explosion particles - burst outward
  const burstParticles = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2
    const distance = 40 + Math.random() * 60
    return {
      endX: Math.cos(angle) * distance,
      endY: Math.sin(angle) * distance,
      delay: Math.random() * 50,
      duration: 300 + Math.random() * 200,
      size: 6 + Math.random() * 8,
      color: orangeColors[i % orangeColors.length],
    }
  })

  // Rising soul particles
  const soulParticles = Array.from({ length: 15 }, (_, i) => ({
    x: Math.random() * 100 - 50,
    delay: 100 + Math.random() * 150,
    duration: 400 + Math.random() * 200,
    size: 4 + Math.random() * 6,
  }))

  // Spark/debris particles
  const sparkParticles = Array.from({ length: 12 }, (_, i) => {
    const angle = Math.random() * Math.PI * 2
    const distance = 30 + Math.random() * 40
    return {
      endX: Math.cos(angle) * distance,
      endY: Math.sin(angle) * distance - 20,
      delay: Math.random() * 80,
      size: 2 + Math.random() * 3,
    }
  })

  return (
    <div className="relative w-40 h-40" style={{ transform: 'translate(-50%, -50%)' }}>
      {/* Central flash */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 60,
          height: 60,
          background: 'radial-gradient(circle, #fff 0%, #ff9500 40%, #ff6b35 70%, transparent 100%)',
          animation: 'explosionFlash 200ms ease-out forwards',
        }}
      />

      {/* Burst particles - explode outward */}
      {burstParticles.map((p, i) => (
        <div
          key={`burst-${i}`}
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 1.5}px ${p.color}, 0 0 ${p.size * 2}px ${p.color}50`,
            opacity: 0,
            animation: `particleBurst ${p.duration}ms ease-out ${p.delay}ms forwards`,
            ['--end-x' as string]: `${p.endX}px`,
            ['--end-y' as string]: `${p.endY}px`,
          }}
        />
      ))}

      {/* Soul particles - rise upward */}
      {soulParticles.map((p, i) => (
        <div
          key={`soul-${i}`}
          className="absolute rounded-full"
          style={{
            left: `calc(50% + ${p.x}px)`,
            bottom: '40%',
            width: p.size,
            height: p.size,
            backgroundColor: orangeColors[i % orangeColors.length],
            boxShadow: `0 0 ${p.size * 2}px ${orangeColors[i % orangeColors.length]}`,
            opacity: 0,
            animation: `particleRise ${p.duration}ms ease-out ${p.delay}ms forwards`
          }}
        />
      ))}

      {/* Spark particles */}
      {sparkParticles.map((p, i) => (
        <div
          key={`spark-${i}`}
          className="absolute left-1/2 top-1/2"
          style={{
            width: p.size,
            height: p.size * 3,
            backgroundColor: '#fff',
            boxShadow: '0 0 4px #ff9500',
            opacity: 0,
            animation: `sparkFly 250ms ease-out ${p.delay}ms forwards`,
            ['--end-x' as string]: `${p.endX}px`,
            ['--end-y' as string]: `${p.endY}px`,
            transform: `rotate(${Math.atan2(p.endY, p.endX)}rad)`,
          }}
        />
      ))}
    </div>
  )
})

// Blood Splatter - orange infection blood spraying on hit
const BloodSplatter = memo(function BloodSplatter() {
  const bloodColors = ['#ff6b35', '#ff4400', '#cc3300', '#ff7b00']

  // Main blood drops
  const drops = Array.from({ length: 16 }, (_, i) => {
    const angle = (Math.random() - 0.5) * Math.PI * 0.8 + Math.PI * 0.25
    const distance = 30 + Math.random() * 50
    const gravity = 20 + Math.random() * 30
    return {
      endX: Math.cos(angle) * distance,
      endY: Math.sin(angle) * distance + gravity,
      delay: Math.random() * 50,
      duration: 200 + Math.random() * 150,
      size: 4 + Math.random() * 8,
      color: bloodColors[i % bloodColors.length],
    }
  })

  // Smaller spray particles
  const spray = Array.from({ length: 12 }, (_, i) => {
    const angle = (Math.random() - 0.5) * Math.PI
    const distance = 20 + Math.random() * 30
    return {
      endX: Math.cos(angle) * distance,
      endY: Math.sin(angle) * distance + 15,
      delay: Math.random() * 30,
      size: 2 + Math.random() * 3,
    }
  })

  return (
    <div className="relative w-32 h-32" style={{ transform: 'translate(-50%, -50%)' }}>
      {/* Blood drops */}
      {drops.map((d, i) => (
        <div
          key={`drop-${i}`}
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: d.size,
            height: d.size * 1.3,
            backgroundColor: d.color,
            boxShadow: `0 0 ${d.size}px ${d.color}`,
            opacity: 0,
            animation: `bloodDrop ${d.duration}ms ease-out ${d.delay}ms forwards`,
            ['--end-x' as string]: `${d.endX}px`,
            ['--end-y' as string]: `${d.endY}px`,
          }}
        />
      ))}

      {/* Fine spray */}
      {spray.map((s, i) => (
        <div
          key={`spray-${i}`}
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: s.size,
            height: s.size,
            backgroundColor: bloodColors[i % bloodColors.length],
            opacity: 0,
            animation: `bloodSpray 150ms ease-out ${s.delay}ms forwards`,
            ['--end-x' as string]: `${s.endX}px`,
            ['--end-y' as string]: `${s.endY}px`,
          }}
        />
      ))}
    </div>
  )
})

// Blood Pool - orange/green infection blood that stays on the "floor"
const BloodPool = memo(function BloodPool() {
  // Mix of orange and green for infected blood
  const poolColors = ['#ff6b35', '#44aa44', '#ff7b00', '#55bb55', '#cc5500', '#338833']

  // Main pool blobs
  const pools = Array.from({ length: 8 }, (_, i) => ({
    x: (Math.random() - 0.5) * 80,
    y: Math.random() * 20,
    width: 20 + Math.random() * 40,
    height: 8 + Math.random() * 12,
    delay: i * 50,
    color: poolColors[i % poolColors.length],
  }))

  // Small drips/splats
  const drips = Array.from({ length: 12 }, (_, i) => ({
    x: (Math.random() - 0.5) * 100,
    y: Math.random() * 15 - 5,
    size: 4 + Math.random() * 8,
    delay: 100 + i * 30,
    color: poolColors[i % poolColors.length],
  }))

  return (
    <div className="relative w-40 h-12" style={{ transform: 'translateX(-50%)' }}>
      {/* Main pool blobs */}
      {pools.map((p, i) => (
        <div
          key={`pool-${i}`}
          className="absolute rounded-full"
          style={{
            left: `calc(50% + ${p.x}px)`,
            bottom: p.y,
            width: p.width,
            height: p.height,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.height}px ${p.color}80, inset 0 -2px 4px rgba(0,0,0,0.3)`,
            opacity: 0,
            animation: `bloodPoolSpread 400ms ease-out ${p.delay}ms forwards`,
            transform: 'translateX(-50%)',
          }}
        />
      ))}

      {/* Small drips */}
      {drips.map((d, i) => (
        <div
          key={`drip-${i}`}
          className="absolute rounded-full"
          style={{
            left: `calc(50% + ${d.x}px)`,
            bottom: d.y,
            width: d.size,
            height: d.size,
            backgroundColor: d.color,
            boxShadow: `0 0 ${d.size / 2}px ${d.color}`,
            opacity: 0,
            animation: `bloodDripAppear 300ms ease-out ${d.delay}ms forwards`,
          }}
        />
      ))}
    </div>
  )
})

// CSS Keyframes for all animations
const battleRevealKeyframes = `
  @keyframes bugWander {
    0%, 100% { transform: translateX(0) translateY(0); }
    25% { transform: translateX(12px) translateY(-8px); }
    50% { transform: translateX(-8px) translateY(5px); }
    75% { transform: translateX(8px) translateY(-5px); }
  }

  @keyframes knightSlash {
    0% { transform: rotate(0deg); }
    50% { transform: rotate(-15deg) translateX(10px); }
    100% { transform: rotate(0deg); }
  }

  @keyframes slashDraw {
    from { stroke-dashoffset: 200; }
    to { stroke-dashoffset: 0; }
  }

  @keyframes slashArc {
    0% { transform: scale(0.8) rotate(-10deg); opacity: 0; }
    30% { transform: scale(1.1) rotate(0deg); opacity: 1; }
    100% { transform: scale(1.2) rotate(5deg); opacity: 0; }
  }

  @keyframes flashPulse {
    0% { transform: scale(0); opacity: 1; }
    50% { transform: scale(1.5); opacity: 1; }
    100% { transform: scale(2); opacity: 0; }
  }

  @keyframes sparkShoot {
    0% { opacity: 0; transform: scale(0); }
    30% { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(1.5); }
  }

  @keyframes impactBurst {
    0% { transform: scale(0); opacity: 1; }
    100% { transform: scale(1.5); opacity: 0; }
  }

  @keyframes particleRise {
    0% {
      opacity: 0;
      transform: translateY(0) scale(1);
    }
    20% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateY(-60px) scale(0.3);
    }
  }

  @keyframes particleBurst {
    0% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y))) scale(0.3);
    }
  }

  @keyframes explosionFlash {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 1;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.5);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(2);
      opacity: 0;
    }
  }

  @keyframes sparkFly {
    0% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y))) scale(0.5);
    }
  }

  @keyframes bloodDrop {
    0% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    100% {
      opacity: 0.6;
      transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y))) scale(0.8);
    }
  }

  @keyframes bloodSpray {
    0% {
      opacity: 0.8;
      transform: translate(-50%, -50%) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y))) scale(0.4);
    }
  }

  @keyframes screenShake {
    0%, 100% { transform: translateX(0) translateY(0); }
    10% { transform: translateX(-8px) translateY(4px); }
    20% { transform: translateX(8px) translateY(-4px); }
    30% { transform: translateX(-6px) translateY(3px); }
    40% { transform: translateX(6px) translateY(-3px); }
    50% { transform: translateX(-4px) translateY(2px); }
    60% { transform: translateX(4px) translateY(-2px); }
    70% { transform: translateX(-2px) translateY(1px); }
    80% { transform: translateX(2px) translateY(-1px); }
    90% { transform: translateX(-1px) translateY(0); }
  }

  @keyframes contentDrop {
    0% {
      transform: translateY(-100px);
      opacity: 0;
    }
    60% {
      transform: translateY(10px);
      opacity: 1;
    }
    80% {
      transform: translateY(-5px);
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes shadowGrow {
    0% {
      transform: translateX(-50%) scaleX(0.3) scaleY(0.5);
      opacity: 0;
    }
    60% {
      transform: translateX(-50%) scaleX(1.2) scaleY(1);
      opacity: 0.8;
    }
    100% {
      transform: translateX(-50%) scaleX(1) scaleY(1);
      opacity: 1;
    }
  }

  @keyframes bugTremble {
    0%, 100% { transform: translateX(30px) translateY(-10px) rotate(-10deg) scale(0.95); }
    10% { transform: translateX(26px) translateY(-14px) rotate(-14deg) scale(0.94); }
    20% { transform: translateX(34px) translateY(-6px) rotate(-6deg) scale(0.96); }
    30% { transform: translateX(25px) translateY(-13px) rotate(-15deg) scale(0.94); }
    40% { transform: translateX(35px) translateY(-7px) rotate(-5deg) scale(0.96); }
    50% { transform: translateX(27px) translateY(-15px) rotate(-13deg) scale(0.94); }
    60% { transform: translateX(33px) translateY(-5px) rotate(-7deg) scale(0.96); }
    70% { transform: translateX(26px) translateY(-14px) rotate(-16deg) scale(0.93); }
    80% { transform: translateX(34px) translateY(-6px) rotate(-4deg) scale(0.96); }
    90% { transform: translateX(28px) translateY(-12px) rotate(-12deg) scale(0.95); }
  }

  @keyframes bloodPoolSpread {
    0% {
      transform: translateX(-50%) scaleX(0.2) scaleY(0.5);
      opacity: 0;
    }
    50% {
      transform: translateX(-50%) scaleX(1.1) scaleY(1);
      opacity: 0.8;
    }
    100% {
      transform: translateX(-50%) scaleX(1) scaleY(1);
      opacity: 0.7;
    }
  }

  @keyframes bloodDripAppear {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    60% {
      transform: scale(1.2);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 0.6;
    }
  }

  .animate-knightSlash {
    animation: knightSlash 200ms ease-out;
  }

  .animate-screenShake {
    animation: screenShake 300ms ease-out;
  }

  .animate-bugTremble {
    animation: bugTremble 50ms ease-in-out infinite;
  }
`

export default BattleReveal
