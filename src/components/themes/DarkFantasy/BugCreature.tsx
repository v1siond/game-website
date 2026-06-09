'use client'

import { useState, useEffect, memo, ReactNode, useRef } from 'react'
import { useInView, FixedCombatLayer } from './fixedCombat'
import { KnightCharacter } from './KnightCharacter'
import { BattleBug } from './BattleReveal'

/**
 * BUG CREATURE - HOLLOW KNIGHT BOSS STYLE
 * =======================================
 *
 * Based on actual HK boss designs (reference image):
 * - Chunky armored body with segmented shell
 * - Multiple void-black eyes (some glowing orange)
 * - Curved mandibles/horns
 * - Thick segmented legs
 * - Purple-grey color palette with orange infection
 * - Mask-like face structure
 *
 * Key bosses referenced:
 * - False Knight (bulky, armored)
 * - Broken Vessel (infected, orange glows)
 * - Husk Guard (segmented body)
 * - Gruz Mother (rounded, multiple legs)
 */

const DF = {
  void: '#0f0a1a',
  shell: '#3a3055',
  shellMid: '#2a2040',
  shellDark: '#1a1525',
  mask: '#4a4565',
  maskLight: '#5a5575',
  infected: '#ff6b35',
  infectedBright: '#ff9955',
  infectedDark: '#cc4420',
  infectedGlow: '#ff8833',
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
  size = 80,
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
    return Math.sin((legPhase + offset) * Math.PI * 2) * 4
  }

  const antennaWiggle = isDead ? 0 : Math.sin(antennaPhase * Math.PI * 2) * 6

  return (
    <svg
      width={size}
      height={size * 0.85}
      viewBox="0 0 100 85"
      className={className}
      style={{
        ...style,
        filter: isHit
          ? 'brightness(2) saturate(0)'
          : `drop-shadow(0 0 8px ${DF.infectedGlow}50)`,
        transform: isDead ? 'rotate(180deg)' : undefined,
        opacity: isDead ? 0.6 : 1,
      }}
    >
      <defs>
        <radialGradient id="bugShellGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor={DF.shell} />
          <stop offset="70%" stopColor={DF.shellMid} />
          <stop offset="100%" stopColor={DF.shellDark} />
        </radialGradient>
        <radialGradient id="bugMaskGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={DF.maskLight} />
          <stop offset="100%" stopColor={DF.mask} />
        </radialGradient>
        <filter id="infectionGlow2" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* LEGS - thick, segmented, 4 per side */}
      <g stroke={DF.shellDark} strokeWidth="4" strokeLinecap="round" fill="none">
        {/* Left legs - curved downward with joints */}
        <path d={`M28,45 Q18,${50 + getLegY(0)} 10,${58 + getLegY(0)} Q6,${62 + getLegY(0)} 4,${68 + getLegY(0)}`} />
        <path d={`M25,52 Q15,${56 + getLegY(1)} 8,${64 + getLegY(1)} Q4,${68 + getLegY(1)} 2,${74 + getLegY(1)}`} />
        <path d={`M26,58 Q18,${62 + getLegY(2)} 12,${70 + getLegY(2)} Q8,${74 + getLegY(2)} 6,${80 + getLegY(2)}`} />
        <path d={`M30,62 Q24,${66 + getLegY(3)} 18,${74 + getLegY(3)}`} />
        {/* Right legs */}
        <path d={`M72,45 Q82,${50 + getLegY(4)} 90,${58 + getLegY(4)} Q94,${62 + getLegY(4)} 96,${68 + getLegY(4)}`} />
        <path d={`M75,52 Q85,${56 + getLegY(5)} 92,${64 + getLegY(5)} Q96,${68 + getLegY(5)} 98,${74 + getLegY(5)}`} />
        <path d={`M74,58 Q82,${62 + getLegY(6)} 88,${70 + getLegY(6)} Q92,${74 + getLegY(6)} 94,${80 + getLegY(6)}`} />
        <path d={`M70,62 Q76,${66 + getLegY(7)} 82,${74 + getLegY(7)}`} />
      </g>
      {/* Leg segments (joints) */}
      <g fill={DF.shellMid}>
        <circle cx="18" cy={50 + getLegY(0)} r="3" />
        <circle cx="15" cy={56 + getLegY(1)} r="3" />
        <circle cx="82" cy={50 + getLegY(4)} r="3" />
        <circle cx="85" cy={56 + getLegY(5)} r="3" />
      </g>

      {/* BODY - chunky segmented shell */}
      {/* Back segment (largest) */}
      <ellipse
        cx="50"
        cy="55"
        rx="28"
        ry="20"
        fill="url(#bugShellGrad)"
        stroke={DF.void}
        strokeWidth="1.5"
      />
      {/* Shell ridge lines */}
      <path
        d="M30,50 Q50,45 70,50"
        fill="none"
        stroke={DF.shellDark}
        strokeWidth="2"
        opacity="0.6"
      />
      <path
        d="M32,58 Q50,54 68,58"
        fill="none"
        stroke={DF.shellDark}
        strokeWidth="1.5"
        opacity="0.4"
      />

      {/* Middle segment */}
      <ellipse
        cx="50"
        cy="40"
        rx="22"
        ry="14"
        fill={DF.shellMid}
        stroke={DF.void}
        strokeWidth="1"
      />

      {/* HEAD/MASK - HK style face */}
      <ellipse
        cx="50"
        cy="26"
        rx="18"
        ry="15"
        fill="url(#bugMaskGrad)"
        stroke={DF.void}
        strokeWidth="1"
      />
      {/* Mask ridge */}
      <path
        d="M35,22 Q50,16 65,22"
        fill="none"
        stroke={DF.maskLight}
        strokeWidth="2"
        opacity="0.5"
      />

      {/* MANDIBLES - curved, threatening */}
      <path
        d={`M36,32 Q${28 + antennaWiggle * 0.3},38 ${24 + antennaWiggle * 0.5},45`}
        fill="none"
        stroke={DF.shell}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d={`M64,32 Q${72 - antennaWiggle * 0.3},38 ${76 - antennaWiggle * 0.5},45`}
        fill="none"
        stroke={DF.shell}
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Mandible tips */}
      <circle cx={24 + antennaWiggle * 0.5} cy="45" r="3" fill={DF.shellDark} />
      <circle cx={76 - antennaWiggle * 0.5} cy="45" r="3" fill={DF.shellDark} />

      {/* HORNS/ANTENNAE - curved upward */}
      <path
        d={`M38,14 Q${30 + antennaWiggle},6 ${26 + antennaWiggle},0`}
        fill="none"
        stroke={DF.shell}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d={`M62,14 Q${70 - antennaWiggle},6 ${74 - antennaWiggle},0`}
        fill="none"
        stroke={DF.shell}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* EYES - void black with orange glow (HK style) */}
      <g filter="url(#infectionGlow2)">
        {/* Main eyes - large, void black */}
        <ellipse cx="40" cy="24" rx="6" ry="8" fill={DF.void} />
        <ellipse cx="60" cy="24" rx="6" ry="8" fill={DF.void} />
        {/* Inner orange glow */}
        <ellipse cx="40" cy="24" rx="4" ry="5" fill={DF.infected} opacity="0.7" />
        <ellipse cx="60" cy="24" rx="4" ry="5" fill={DF.infected} opacity="0.7" />
        {/* Eye highlights */}
        <ellipse cx="38" cy="22" rx="2" ry="2.5" fill={DF.infectedBright} opacity="0.8" />
        <ellipse cx="58" cy="22" rx="2" ry="2.5" fill={DF.infectedBright} opacity="0.8" />
      </g>

      {/* INFECTION GROWTHS - bulbous orange blobs */}
      <g filter="url(#infectionGlow2)">
        {/* Main back infection */}
        <ellipse cx="50" cy="50" rx="10" ry="8" fill={DF.infected} opacity="0.85">
          {!isDead && <animate attributeName="rx" values="10;11;10" dur="2s" repeatCount="indefinite" />}
        </ellipse>
        {/* Side infections */}
        <ellipse cx="35" cy="56" rx="7" ry="5" fill={DF.infected} opacity="0.75">
          {!isDead && <animate attributeName="ry" values="5;6;5" dur="1.8s" repeatCount="indefinite" />}
        </ellipse>
        <ellipse cx="65" cy="56" rx="7" ry="5" fill={DF.infected} opacity="0.75">
          {!isDead && <animate attributeName="ry" values="5;6;5" dur="2.2s" repeatCount="indefinite" />}
        </ellipse>
        {/* Small accent blobs */}
        <circle cx="42" cy="60" r="4" fill={DF.infected} opacity="0.5" />
        <circle cx="58" cy="62" r="3" fill={DF.infected} opacity="0.45" />
        <circle cx="50" cy="38" r="5" fill={DF.infected} opacity="0.6" />
      </g>

      {/* Blob highlights */}
      <ellipse cx="48" cy="47" rx="3" ry="2" fill={DF.infectedBright} opacity="0.35" />
    </svg>
  )
})

// ============================================
// BUG ATTACK REVEAL ANIMATION
// ============================================

interface BugPullRevealProps {
  children: ReactNode
  triggered: boolean
  className?: string
}

type AnimationPhase =
  | 'idle'
  | 'alex-enters'
  | 'bug-appears'
  | 'bug-hits'
  | 'alex-blocks'
  | 'attack-stance'
  | 'complete'

const ATTACK_TIMING = {
  'alex-enters': 0,
  'bug-appears': 400,
  'bug-hits': 700,
  'alex-blocks': 1000,
  'attack-stance': 1400,
  'complete': 1900,
}

export const BugPullReveal = memo(function BugPullReveal({
  children,
  triggered,
  className = '',
}: BugPullRevealProps) {
  const [phase, setPhase] = useState<AnimationPhase>('idle')
  const [legPhase, setLegPhase] = useState(0)
  const hasAnimated = useRef(false)
  // continuous in-view so the fixed Alex/bug fade out once we scroll past the section
  const { ref: stageRef, inView } = useInView()

  useEffect(() => {
    if (phase === 'idle' || phase === 'complete') return

    let rafId: number
    let lastTime = 0

    const animate = (time: number) => {
      if (!lastTime) lastTime = time
      const delta = time - lastTime
      lastTime = time
      const speed = phase === 'bug-hits' ? 0.015 : phase === 'attack-stance' ? 0.003 : 0.006
      setLegPhase(prev => (prev + delta * speed) % 1)
      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [phase])

  useEffect(() => {
    if (!triggered || hasAnimated.current) {
      if (!triggered && !hasAnimated.current) {
        setPhase('idle')
      }
      return
    }

    hasAnimated.current = true
    setPhase('alex-enters')

    const timers: NodeJS.Timeout[] = []

    timers.push(setTimeout(() => setPhase('bug-appears'), ATTACK_TIMING['bug-appears']))
    timers.push(setTimeout(() => setPhase('bug-hits'), ATTACK_TIMING['bug-hits']))
    timers.push(setTimeout(() => setPhase('alex-blocks'), ATTACK_TIMING['alex-blocks']))
    timers.push(setTimeout(() => setPhase('attack-stance'), ATTACK_TIMING['attack-stance']))
    timers.push(setTimeout(() => setPhase('complete'), ATTACK_TIMING['complete']))

    return () => timers.forEach(t => clearTimeout(t))
  }, [triggered])

  const getAlexStyle = (): React.CSSProperties => {
    switch (phase) {
      case 'idle':
        return { left: '45%', transform: 'translateX(-50%)', opacity: 0 }
      case 'alex-enters':
        return {
          left: '45%',
          transform: 'translateX(-50%)',
          opacity: 1,
          transition: 'all 400ms ease-out'
        }
      case 'bug-appears':
        return {
          left: '45%',
          transform: 'translateX(-50%)',
          opacity: 1
        }
      case 'bug-hits':
        return {
          left: '40%',
          transform: 'translateX(-50%)',
          opacity: 1,
          transition: 'all 150ms ease-out'
        }
      case 'alex-blocks':
        return {
          left: '8%',
          transform: 'translateX(0)',
          opacity: 1,
          transition: 'all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)'
        }
      case 'attack-stance':
      case 'complete':
        return {
          left: '15%',
          transform: 'translateX(0)',
          opacity: 1,
          transition: 'all 200ms ease-out'
        }
      default:
        return { left: '45%', transform: 'translateX(-50%)', opacity: 0 }
    }
  }

  const getBugStyle = (): React.CSSProperties => {
    switch (phase) {
      case 'idle':
      case 'alex-enters':
        return { right: '-180px', opacity: 0, transform: 'translateY(0)' }
      case 'bug-appears':
        return {
          right: '2%',
          opacity: 1,
          transform: 'translateY(0)',
          transition: 'all 350ms ease-out'
        }
      case 'bug-hits':
        return {
          right: '5%',
          opacity: 1,
          transform: 'translateX(-20px) translateY(-8px) rotate(-8deg)',
          transition: 'all 150ms ease-out'
        }
      case 'alex-blocks':
        return {
          right: '3%',
          opacity: 1,
          transform: 'translateY(0) rotate(0deg)',
          transition: 'all 200ms ease-out'
        }
      case 'attack-stance':
      case 'complete':
        return {
          right: '16%',
          opacity: 1,
          transform: 'translateY(-70px)',
          transition: 'all 400ms ease-out',
          animation: 'bugFloat 1.5s ease-in-out infinite'
        }
      default:
        return { right: '-180px', opacity: 0 }
    }
  }

  const getContentStyle = (): React.CSSProperties => {
    switch (phase) {
      case 'idle':
      case 'alex-enters':
        return { transform: 'translateX(100%)', opacity: 0 }
      case 'bug-appears':
        return {
          transform: 'translateX(55%)',
          opacity: 0.7,
          transition: 'all 350ms ease-out'
        }
      case 'bug-hits':
        return {
          transform: 'translateX(15%)',
          opacity: 0.95,
          transition: 'all 300ms ease-out'
        }
      case 'alex-blocks':
      case 'attack-stance':
      case 'complete':
        return {
          transform: 'translateX(0)',
          opacity: 1,
          transition: 'all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)'
        }
      default:
        return { transform: 'translateX(0)', opacity: 1 }
    }
  }

  const showBug = phase !== 'idle' && phase !== 'alex-enters'
  const showAlex = phase !== 'idle'
  const isFloating = phase === 'attack-stance' || phase === 'complete'

  return (
    <div ref={stageRef} className={`relative w-full ${className}`} style={{ minHeight: '280px' }}>
      {/* Alex (knight) + bug pinned to the viewport bottom; only the content scrolls */}
      {(showAlex || showBug) && (
        <FixedCombatLayer inView={inView}>
          {showAlex && (
            <div
              className="absolute bottom-[15%] z-10 pointer-events-none"
              style={{ ...getAlexStyle(), position: 'absolute' }}
            >
              <KnightCharacter scale={1.5} facingDirection="right" breathing={phase === 'complete'} />
            </div>
          )}

          {showBug && (
            <>
              <div
                className="absolute bottom-[15%] z-5 pointer-events-none"
                style={{
                  ...getBugStyle(),
                  position: 'absolute',
                  transform: isFloating ? 'translateY(60px)' : 'translateY(40px)',
                  transition: 'all 400ms ease-out',
                }}
              >
                <div
                  className="rounded-full"
                  style={{
                    width: isFloating ? 100 : 80,
                    height: isFloating ? 20 : 16,
                    background: 'radial-gradient(ellipse, rgba(15,10,26,0.6) 0%, transparent 70%)',
                    transform: 'translateX(20px)',
                    transition: 'all 400ms ease-out',
                  }}
                />
              </div>
              <div
                className="absolute bottom-[15%] -translate-y-1/2 z-30 pointer-events-none"
                style={{ ...getBugStyle(), position: 'absolute' }}
              >
                <BattleBug size={140} legPhase={legPhase} antennaPhase={legPhase * 1.3} />
              </div>
            </>
          )}
        </FixedCombatLayer>
      )}

      <div className="relative z-20" style={getContentStyle()}>
        {children}
      </div>

      <style>{`
        @keyframes bugFloat {
          0%, 100% { transform: translateY(-70px); }
          50% { transform: translateY(-85px); }
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
