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
  const hasAnimated = useRef(false)

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
    if (!triggered || hasAnimated.current) {
      // Only reset if we haven't animated yet
      if (!triggered && !hasAnimated.current) {
        setPhase('idle')
      }
      return
    }

    // Mark as animated so we don't replay
    hasAnimated.current = true

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
      setScreenShake(true)
      setPhase('bug-death')
      setAttackPhase(0)
    }, PHASE_TIMING['bug-death']))

    // Bug fall - start the tumble
    timers.push(setTimeout(() => {
      setScreenShake(false)
      setPhase('bug-fall')
    }, PHASE_TIMING['bug-fall']))

    // Blood pool appears AFTER tumble animation completes (500ms after bug-fall starts)
    timers.push(setTimeout(() => {
      setShowBloodPool(true)
    }, PHASE_TIMING['bug-fall'] + 500))

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
      case 'complete':
        // Knight stays closer to content, breathing handled by cloak
        return {
          transform: 'translateX(140px)',
          opacity: 1,
        }
      default:
        return {
          transform: 'translateX(140px)',
          opacity: 1,
          transition: 'transform 200ms ease-out'
        }
    }
  }

  const getBugStyle = (): React.CSSProperties => {
    const baseStyle = {
      transition: 'transform 200ms ease-out, opacity 200ms ease-out',
    }

    // Bug base: right-[18%] bottom-[15%]
    // All effects (explosion, blood) are now CHILDREN of bug container,
    // so they automatically follow the bug's position

    switch (phase) {
      case 'idle':
        // Hidden, slightly offset
        return {
          ...baseStyle,
          transform: 'translateX(-20px) translateY(-60px) rotateZ(0deg)',
          opacity: 0
        }
      case 'bug-wander':
        // Bug enters and hovers at base position
        return {
          ...baseStyle,
          transform: 'translateX(0) translateY(0) rotateZ(0deg)',
          opacity: 1,
          transition: 'all 500ms ease-out',
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
        // Recoil from hit
        return {
          ...baseStyle,
          transform: 'translateX(20px) translateY(-10px) rotateZ(-10deg) scale(0.95)',
          opacity: 1,
          transition: 'transform 100ms ease-out'
        }
      case 'bug-tremble':
        // Tremble before explosion
        return {
          ...baseStyle,
          transform: 'translateX(20px) translateY(-8px) rotateZ(-8deg) scale(0.95)',
          opacity: 1,
          animation: 'bugTremble 50ms ease-in-out infinite',
          transition: 'none'
        }
      case 'bug-death':
        // Bug pops up and flips (explosion particles appear here)
        return {
          ...baseStyle,
          transform: 'translateX(-20px) translateY(-40px) rotateZ(180deg) scale(0.9)',
          opacity: 0.9,
          transition: 'transform 300ms cubic-bezier(0.68, -0.55, 0.27, 1.55)'
        }
      case 'bug-fall':
        // Bug tumbles/rolls to the RIGHT like a boulder after explosion
        return {
          ...baseStyle,
          transform: 'translateX(-120px) translateY(50px) rotateZ(540deg) scale(0.75)',
          opacity: 0.7,
          transition: 'transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }
      case 'content-drop':
        // Dead on the ground - rolled/tumbled to the right
        return {
          ...baseStyle,
          transform: 'translateX(-120px) translateY(50px) rotateZ(540deg) scale(0.75)',
          opacity: 0.55,
        }
      case 'complete':
        // Dead on the ground - no twitch, just static (blood drips handled in DeadBugCreature SVG)
        return {
          ...baseStyle,
          transform: 'translateX(-120px) translateY(50px) rotateZ(540deg) scale(0.75)',
          opacity: 0.6,
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
                breathing={phase === 'complete'}
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

        {/* Impact and Blood Splatter are now inside bug container below */}

        {/* Bug shadow - stays on ground */}
        {showBug && !isBugDead && (
          <div
            className="absolute right-[18%] bottom-[10%] z-5 pointer-events-none"
            style={{
              transition: 'all 300ms ease-out',
            }}
          >
            <div
              className="rounded-full"
              style={{
                width: 80,
                height: 16,
                background: 'radial-gradient(ellipse, rgba(15,10,26,0.5) 0%, transparent 70%)',
                animation: 'shadowBreathing 2s ease-in-out infinite',
              }}
            />
          </div>
        )}

        {/* Bug container - all bug-related effects are children so they follow the bug */}
        {showBug && (
          <div
            className={`absolute right-[18%] bottom-[15%] z-10 ${bugTremble ? 'animate-bugTremble' : ''}`}
            style={getBugStyle()}
          >
            {/* Impact Burst - centered on bug */}
            {showImpact && (
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                style={{ animation: 'impactBurst 150ms ease-out forwards' }}
              >
                <ImpactBurst />
              </div>
            )}

            {/* Blood Splatter - centered on bug */}
            {showBloodSplatter && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-35 pointer-events-none">
                <BloodSplatter />
              </div>
            )}

            {/* Death Particles - dead center on bug */}
            {showDeathParticles && (
              <div className="absolute left-1/2 top-1/2 z-30 pointer-events-none">
                <DeathParticles />
              </div>
            )}

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

        {/* Blood Pool - RIGHT EDGE at dead bug CENTER */}
        {/* Bug final pos: right:18%, translateX(-120px), translateY(50px) */}
        {/* Blood pool right edge should touch bug center */}
        {showBloodPool && isBugDead && (
          <div
            className="absolute z-4 pointer-events-none"
            style={{
              right: '18%',
              bottom: '15%',
              transform: 'translateX(-120px) translateY(55px)',
              animation: phase === 'complete' ? 'bloodPoolPulse 3s ease-in-out infinite' : undefined,
            }}
          >
            <BloodPool />
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

/**
 * BATTLE BUG - HK BOSS STYLE
 * ==========================
 * Based on actual HK boss designs (chunky, armored, threatening):
 * - Segmented armored body
 * - Void-black eyes with orange infection glow
 * - Curved mandibles
 * - Thick segmented legs
 * - Orange infection growths
 */
export const BattleBug = memo(function BattleBug({
  size = 120,
  legPhase = 0,
  antennaPhase = 0,
  isHit = false,
}: {
  size?: number
  legPhase?: number
  antennaPhase?: number
  isHit?: boolean
}) {
  const shell = '#3a3055'
  const shellMid = '#2a2040'
  const shellDark = '#1a1525'
  const mask = '#4a4565'
  const maskLight = '#5a5575'
  const infected = '#ff6b35'
  const infectedBright = '#ff9955'
  const infectedGlow = '#ff8833'

  const getLegY = (index: number) => {
    const offset = index % 2 === 0 ? 0 : 0.5
    return Math.sin((legPhase + offset) * Math.PI * 2) * 4
  }

  const antennaWiggle = Math.sin(antennaPhase * Math.PI * 2) * 6

  return (
    <svg
      width={size}
      height={size * 0.85}
      viewBox="0 0 100 85"
      style={{
        filter: isHit
          ? 'brightness(2) saturate(0)'
          : `drop-shadow(0 0 12px ${infectedGlow}60) drop-shadow(0 0 6px ${infected}80)`,
        transition: 'filter 100ms'
      }}
    >
      <defs>
        <filter id="battleGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="battleShellGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor={shell} />
          <stop offset="70%" stopColor={shellMid} />
          <stop offset="100%" stopColor={shellDark} />
        </radialGradient>
        <radialGradient id="battleMaskGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={maskLight} />
          <stop offset="100%" stopColor={mask} />
        </radialGradient>
      </defs>

      {/* LEGS - thick, segmented, 4 per side */}
      <g stroke={shellDark} strokeWidth="4" strokeLinecap="round" fill="none">
        <path d={`M28,45 Q18,${50 + getLegY(0)} 10,${58 + getLegY(0)} Q6,${62 + getLegY(0)} 4,${68 + getLegY(0)}`} />
        <path d={`M25,52 Q15,${56 + getLegY(1)} 8,${64 + getLegY(1)} Q4,${68 + getLegY(1)} 2,${74 + getLegY(1)}`} />
        <path d={`M26,58 Q18,${62 + getLegY(2)} 12,${70 + getLegY(2)} Q8,${74 + getLegY(2)} 6,${80 + getLegY(2)}`} />
        <path d={`M30,62 Q24,${66 + getLegY(3)} 18,${74 + getLegY(3)}`} />
        <path d={`M72,45 Q82,${50 + getLegY(4)} 90,${58 + getLegY(4)} Q94,${62 + getLegY(4)} 96,${68 + getLegY(4)}`} />
        <path d={`M75,52 Q85,${56 + getLegY(5)} 92,${64 + getLegY(5)} Q96,${68 + getLegY(5)} 98,${74 + getLegY(5)}`} />
        <path d={`M74,58 Q82,${62 + getLegY(6)} 88,${70 + getLegY(6)} Q92,${74 + getLegY(6)} 94,${80 + getLegY(6)}`} />
        <path d={`M70,62 Q76,${66 + getLegY(7)} 82,${74 + getLegY(7)}`} />
      </g>
      {/* Leg joints */}
      <g fill={shellMid}>
        <circle cx="18" cy={50 + getLegY(0)} r="3" />
        <circle cx="15" cy={56 + getLegY(1)} r="3" />
        <circle cx="82" cy={50 + getLegY(4)} r="3" />
        <circle cx="85" cy={56 + getLegY(5)} r="3" />
      </g>

      {/* BODY - chunky segmented shell */}
      <ellipse cx="50" cy="55" rx="28" ry="20" fill="url(#battleShellGrad)" stroke={DF.void} strokeWidth="1.5" />
      <path d="M30,50 Q50,45 70,50" fill="none" stroke={shellDark} strokeWidth="2" opacity="0.6" />
      <path d="M32,58 Q50,54 68,58" fill="none" stroke={shellDark} strokeWidth="1.5" opacity="0.4" />

      {/* Middle segment */}
      <ellipse cx="50" cy="40" rx="22" ry="14" fill={shellMid} stroke={DF.void} strokeWidth="1" />

      {/* HEAD/MASK */}
      <ellipse cx="50" cy="26" rx="18" ry="15" fill="url(#battleMaskGrad)" stroke={DF.void} strokeWidth="1" />
      <path d="M35,22 Q50,16 65,22" fill="none" stroke={maskLight} strokeWidth="2" opacity="0.5" />

      {/* MANDIBLES */}
      <path d={`M36,32 Q${28 + antennaWiggle * 0.3},38 ${24 + antennaWiggle * 0.5},45`} fill="none" stroke={shell} strokeWidth="5" strokeLinecap="round" />
      <path d={`M64,32 Q${72 - antennaWiggle * 0.3},38 ${76 - antennaWiggle * 0.5},45`} fill="none" stroke={shell} strokeWidth="5" strokeLinecap="round" />
      <circle cx={24 + antennaWiggle * 0.5} cy="45" r="3" fill={shellDark} />
      <circle cx={76 - antennaWiggle * 0.5} cy="45" r="3" fill={shellDark} />

      {/* HORNS */}
      <path d={`M38,14 Q${30 + antennaWiggle},6 ${26 + antennaWiggle},0`} fill="none" stroke={shell} strokeWidth="3" strokeLinecap="round" />
      <path d={`M62,14 Q${70 - antennaWiggle},6 ${74 - antennaWiggle},0`} fill="none" stroke={shell} strokeWidth="3" strokeLinecap="round" />

      {/* EYES - void black with orange glow */}
      <g filter="url(#battleGlow)">
        <ellipse cx="40" cy="24" rx="6" ry="8" fill={DF.void} />
        <ellipse cx="60" cy="24" rx="6" ry="8" fill={DF.void} />
        <ellipse cx="40" cy="24" rx="4" ry="5" fill={infected} opacity="0.7" />
        <ellipse cx="60" cy="24" rx="4" ry="5" fill={infected} opacity="0.7" />
        <ellipse cx="38" cy="22" rx="2" ry="2.5" fill={infectedBright} opacity="0.8" />
        <ellipse cx="58" cy="22" rx="2" ry="2.5" fill={infectedBright} opacity="0.8" />
      </g>

      {/* INFECTION GROWTHS */}
      <g filter="url(#battleGlow)">
        <ellipse cx="50" cy="50" rx="10" ry="8" fill={infected} opacity="0.85">
          <animate attributeName="rx" values="10;11;10" dur="2s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="35" cy="56" rx="7" ry="5" fill={infected} opacity="0.75">
          <animate attributeName="ry" values="5;6;5" dur="1.8s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="65" cy="56" rx="7" ry="5" fill={infected} opacity="0.75">
          <animate attributeName="ry" values="5;6;5" dur="2.2s" repeatCount="indefinite" />
        </ellipse>
        <circle cx="42" cy="60" r="4" fill={infected} opacity="0.5" />
        <circle cx="58" cy="62" r="3" fill={infected} opacity="0.45" />
        <circle cx="50" cy="38" r="5" fill={infected} opacity="0.6" />
      </g>

      <ellipse cx="48" cy="47" rx="3" ry="2" fill={infectedBright} opacity="0.35" />
    </svg>
  )
})

/**
 * DEAD BUG - HK Boss style corpse
 * ================================
 * Matches the BattleBug design but:
 * - Flipped/rotated
 * - Curled legs
 * - Dimmed colors
 * - Dripping blood animation
 * - Exhaling smoke
 */
const DeadBugCreature = memo(function DeadBugCreature({ size = 120 }: { size?: number }) {
  const shell = '#3a3055'
  const shellMid = '#2a2040'
  const shellDark = '#1a1525'
  const mask = '#4a4565'
  const infected = '#ff6b35'
  const infectedDim = '#cc4420'

  return (
    <svg
      width={size}
      height={size * 0.85}
      viewBox="0 0 100 85"
      style={{
        opacity: 0.85,
        transform: 'rotate(180deg)',
        filter: `drop-shadow(0 0 8px ${infected}40)`
      }}
    >
      <defs>
        <radialGradient id="deadShellGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor={shell} />
          <stop offset="70%" stopColor={shellMid} />
          <stop offset="100%" stopColor={shellDark} />
        </radialGradient>
      </defs>

      {/* CURLED LEGS - dead, pointing inward */}
      <g stroke={shellDark} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6">
        <path d="M28,45 Q22,38 26,30" />
        <path d="M25,52 Q18,44 22,36" />
        <path d="M26,58 Q20,50 24,42" />
        <path d="M30,62 Q26,56 28,50" />
        <path d="M72,45 Q78,38 74,30" />
        <path d="M75,52 Q82,44 78,36" />
        <path d="M74,58 Q80,50 76,42" />
        <path d="M70,62 Q74,56 72,50" />
      </g>

      {/* BODY - dimmed */}
      <ellipse cx="50" cy="55" rx="28" ry="20" fill="url(#deadShellGrad)" stroke={DF.void} strokeWidth="1.5" opacity="0.8" />
      <ellipse cx="50" cy="40" rx="22" ry="14" fill={shellMid} stroke={DF.void} strokeWidth="1" opacity="0.8" />

      {/* HEAD/MASK */}
      <ellipse cx="50" cy="26" rx="18" ry="15" fill={mask} stroke={DF.void} strokeWidth="1" opacity="0.8" />

      {/* MANDIBLES - drooped */}
      <path d="M36,32 Q30,42 28,52" fill="none" stroke={shell} strokeWidth="5" strokeLinecap="round" opacity="0.6" />
      <path d="M64,32 Q70,42 72,52" fill="none" stroke={shell} strokeWidth="5" strokeLinecap="round" opacity="0.6" />

      {/* HORNS - drooped */}
      <path d="M38,14 Q30,20 24,28" fill="none" stroke={shell} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <path d="M62,14 Q70,20 76,28" fill="none" stroke={shell} strokeWidth="3" strokeLinecap="round" opacity="0.5" />

      {/* CLOSED EYES - dimmed */}
      <ellipse cx="40" cy="24" rx="5" ry="4" fill={DF.void} opacity="0.8" />
      <ellipse cx="60" cy="24" rx="5" ry="4" fill={DF.void} opacity="0.8" />
      <ellipse cx="40" cy="24" rx="3" ry="2" fill={infectedDim} opacity="0.4" />
      <ellipse cx="60" cy="24" rx="3" ry="2" fill={infectedDim} opacity="0.4" />

      {/* Dimmed infection - leaking */}
      <ellipse cx="50" cy="50" rx="8" ry="6" fill={infectedDim} opacity="0.35" />
      <ellipse cx="38" cy="56" rx="5" ry="4" fill={infectedDim} opacity="0.25" />
      <ellipse cx="62" cy="56" rx="5" ry="4" fill={infectedDim} opacity="0.25" />

      {/* DRIPPING BLOOD - animated */}
      <g>
        <ellipse cx="50" cy="72" rx="12" ry="4" fill={infected} opacity="0.5" />
        {/* Drip 1 */}
        <ellipse cx="46" cy="65" rx="2" ry="3" fill={infected} opacity="0.6">
          <animate attributeName="cy" values="60;68;60" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0.3;0.6" dur="2s" repeatCount="indefinite" />
        </ellipse>
        {/* Drip 2 */}
        <ellipse cx="54" cy="62" rx="1.5" ry="2.5" fill={infected} opacity="0.5">
          <animate attributeName="cy" values="58;66;58" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2.5s" repeatCount="indefinite" />
        </ellipse>
        {/* Drip 3 */}
        <ellipse cx="50" cy="64" rx="2.5" ry="4" fill={infected} opacity="0.55">
          <animate attributeName="cy" values="62;70;62" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.55;0.25;0.55" dur="1.8s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* SMOKE/STEAM - rising from body */}
      <g opacity="0.4">
        <ellipse cx="45" cy="35" rx="3" ry="2" fill="#aaa">
          <animate attributeName="cy" values="40;25;40" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" repeatCount="indefinite" />
          <animate attributeName="rx" values="3;6;3" dur="3s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="55" cy="38" rx="2.5" ry="1.5" fill="#999">
          <animate attributeName="cy" values="42;28;42" dur="3.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.35;0;0.35" dur="3.5s" repeatCount="indefinite" />
          <animate attributeName="rx" values="2.5;5;2.5" dur="3.5s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="50" cy="32" rx="2" ry="1.5" fill="#bbb">
          <animate attributeName="cy" values="36;22;36" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0;0.3" dur="4s" repeatCount="indefinite" />
          <animate attributeName="rx" values="2;4;2" dur="4s" repeatCount="indefinite" />
        </ellipse>
      </g>
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
  // SATURATED infected blood - bright greens and oranges
  const poolColors = ['#ff5500', '#00ff44', '#ff7700', '#33ff66', '#ee4400', '#22ee55']

  // Main pool blobs - spread LEFT from right edge
  const pools = Array.from({ length: 8 }, (_, i) => ({
    x: -10 - Math.random() * 70,  // All negative = extends LEFT from right edge
    y: Math.random() * 20,
    width: 20 + Math.random() * 40,
    height: 8 + Math.random() * 12,
    delay: i * 50,
    color: poolColors[i % poolColors.length],
  }))

  // Small drips/splats - also extend left
  const drips = Array.from({ length: 12 }, (_, i) => ({
    x: -5 - Math.random() * 90,
    y: Math.random() * 15 - 5,
    size: 4 + Math.random() * 8,
    delay: 100 + i * 30,
    color: poolColors[i % poolColors.length],
  }))

  return (
    <div className="relative w-40 h-12">
      {/* Main pool blobs - positioned from RIGHT edge */}
      {pools.map((p, i) => (
        <div
          key={`pool-${i}`}
          className="absolute rounded-full"
          style={{
            right: -p.x,  // Convert to right positioning
            bottom: p.y,
            width: p.width,
            height: p.height,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.height + 4}px ${p.color}, inset 0 -2px 4px rgba(0,0,0,0.3)`,
            opacity: 0,
            animation: `bloodPoolSpread 400ms ease-out ${p.delay}ms forwards`,
          }}
        />
      ))}

      {/* Small drips */}
      {drips.map((d, i) => (
        <div
          key={`drip-${i}`}
          className="absolute rounded-full"
          style={{
            right: -d.x,
            bottom: d.y,
            width: d.size,
            height: d.size,
            backgroundColor: d.color,
            boxShadow: `0 0 ${d.size}px ${d.color}`,
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
    0%, 100% { transform: translateX(20px) translateY(-8px) rotate(-8deg) scale(0.95); }
    10% { transform: translateX(16px) translateY(-12px) rotate(-12deg) scale(0.94); }
    20% { transform: translateX(24px) translateY(-4px) rotate(-4deg) scale(0.96); }
    30% { transform: translateX(15px) translateY(-11px) rotate(-13deg) scale(0.94); }
    40% { transform: translateX(25px) translateY(-5px) rotate(-3deg) scale(0.96); }
    50% { transform: translateX(17px) translateY(-13px) rotate(-11deg) scale(0.94); }
    60% { transform: translateX(23px) translateY(-3px) rotate(-5deg) scale(0.96); }
    70% { transform: translateX(16px) translateY(-12px) rotate(-14deg) scale(0.93); }
    80% { transform: translateX(24px) translateY(-4px) rotate(-2deg) scale(0.96); }
    90% { transform: translateX(18px) translateY(-10px) rotate(-10deg) scale(0.95); }
  }

  @keyframes bloodPoolSpread {
    0% {
      transform: scaleX(0.2) scaleY(0.5);
      opacity: 0;
    }
    50% {
      transform: scaleX(1.1) scaleY(1);
      opacity: 0.9;
    }
    100% {
      transform: scaleX(1) scaleY(1);
      opacity: 0.85;
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

  @keyframes knightVictoryBreathing {
    0%, 100% {
      transform: translateX(80px) translateY(0) scale(1);
    }
    50% {
      transform: translateX(80px) translateY(-4px) scale(1.02);
    }
  }

  @keyframes deadBugTwitch {
    0%, 85%, 100% {
      transform: translateX(-120px) translateY(50px) rotateZ(540deg) scale(0.75);
    }
    87% {
      transform: translateX(-118px) translateY(48px) rotateZ(538deg) scale(0.76);
    }
    89% {
      transform: translateX(-121px) translateY(51px) rotateZ(541deg) scale(0.74);
    }
    91% {
      transform: translateX(-120px) translateY(50px) rotateZ(540deg) scale(0.75);
    }
  }

  @keyframes bloodPoolPulse {
    0%, 100% {
      transform: translateX(-120px) translateY(55px) scale(1);
      opacity: 0.8;
    }
    50% {
      transform: translateX(-120px) translateY(55px) scale(1.03);
      opacity: 0.85;
    }
  }

  @keyframes continuousDrip {
    0% {
      opacity: 0;
      transform: translateY(0) scale(0.5);
    }
    20% {
      opacity: 0.7;
      transform: translateY(5px) scale(1);
    }
    100% {
      opacity: 0;
      transform: translateY(25px) scale(0.3);
    }
  }

  @keyframes shadowBreathing {
    0%, 100% {
      transform: scale(1);
      opacity: 0.5;
    }
    50% {
      transform: scale(1.15);
      opacity: 0.35;
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
