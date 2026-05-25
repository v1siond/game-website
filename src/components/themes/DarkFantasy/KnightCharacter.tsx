'use client'

import { memo, useEffect, useState, ReactNode } from 'react'

/**
 * KNIGHT CHARACTER - HOLLOW KNIGHT STYLE
 * ======================================
 *
 * Based on actual Hollow Knight art style:
 * - White/bone MASK with 2 void eye holes (no face!)
 * - Simple curved horns pointing UP
 * - Dark flowing CLOAK as the entire body
 * - Thin nail weapon
 *
 * Alexander is represented by the MASK SHAPE - the bottom edge
 * has a subtle beard-like curve, but it's still a mask, not a face.
 */

const DF = {
  void: '#0f0a1a',
  voidDeep: '#0a0610',
  bone: '#e8e4dc',
  boneShade: '#c8c4bc',
  cloak: '#2a2535',
  cloakDark: '#1a1520',
  ethereal: '#41c8e8',
  spiritGlow: '#ffffff',
}

interface KnightCharacterProps {
  scale?: number
  size?: number
  attacking?: boolean
  attackPhase?: number
  facingDirection?: 'left' | 'right'
  className?: string
}

export const KnightCharacter = memo(function KnightCharacter({
  scale = 1,
  size,
  attacking = false,
  attackPhase = 0,
  facingDirection = 'right',
  className = '',
}: KnightCharacterProps) {
  const effectiveScale = size ? size / 50 : scale
  const isLeft = facingDirection === 'left'

  // Nail rotation during attack
  const getNailRotation = () => {
    if (!attacking) return -20
    if (attackPhase < 0.3) return -20 - (attackPhase / 0.3) * 60
    if (attackPhase < 0.5) return -80
    return -80 + ((attackPhase - 0.5) / 0.5) * 160
  }

  const nailRotation = getNailRotation()

  return (
    <svg
      width={50 * effectiveScale}
      height={70 * effectiveScale}
      viewBox="0 0 50 70"
      className={className}
      style={{
        overflow: 'visible',
        transform: isLeft ? 'scaleX(-1)' : 'none',
      }}
    >
      <defs>
        {/* Mask gradient - white with slight shading */}
        <radialGradient id="maskGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor={DF.bone} />
          <stop offset="100%" stopColor={DF.boneShade} />
        </radialGradient>

        {/* Cloak gradient */}
        <linearGradient id="cloakGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={DF.cloak} />
          <stop offset="100%" stopColor={DF.cloakDark} />
        </linearGradient>

        {/* Glow for attack */}
        <filter id="attackGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* CLOAK / BODY - simple flowing shape */}
      <path
        d="M18,32
           C12,36 8,45 10,58
           Q12,65 18,68
           L32,68
           Q38,65 40,58
           C42,45 38,36 32,32
           L25,30
           Z"
        fill="url(#cloakGrad)"
        stroke={DF.voidDeep}
        strokeWidth="0.5"
      />

      {/* Cloak inner folds */}
      <path
        d="M20,38 Q19,50 20,62
           M30,38 Q31,50 30,62"
        fill="none"
        stroke={DF.voidDeep}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* MASK - the iconic Hollow Knight style */}
      {/* Main mask shape - with subtle beard-like bottom (Alexander hint) */}
      <path
        d="M25,4
           C14,4 10,12 10,20
           C10,26 12,30 16,32
           Q20,35 25,36
           Q30,35 34,32
           C38,30 40,26 40,20
           C40,12 36,4 25,4
           Z"
        fill="url(#maskGrad)"
        stroke={DF.boneShade}
        strokeWidth="0.5"
      />

      {/* HORNS - simple curved, pointing up */}
      <path
        d="M14,14
           C10,10 8,4 12,0
           C14,3 15,8 15,14"
        fill={DF.bone}
        stroke={DF.boneShade}
        strokeWidth="0.5"
      />
      <path
        d="M36,14
           C40,10 42,4 38,0
           C36,3 35,8 35,14"
        fill={DF.bone}
        stroke={DF.boneShade}
        strokeWidth="0.5"
      />

      {/* Horn highlights */}
      <path d="M13,12 C11,8 10,4 12,1" fill="none" stroke={DF.spiritGlow} strokeWidth="0.8" opacity="0.4" />
      <path d="M37,12 C39,8 40,4 38,1" fill="none" stroke={DF.spiritGlow} strokeWidth="0.8" opacity="0.4" />

      {/* EYES - pure void, no pupils, just black holes */}
      <ellipse cx="19" cy="18" rx="4" ry="5" fill={DF.voidDeep} />
      <ellipse cx="31" cy="18" rx="4" ry="5" fill={DF.voidDeep} />

      {/* Subtle eye depth */}
      <ellipse cx="19" cy="18" rx="3" ry="4" fill={DF.void} />
      <ellipse cx="31" cy="18" rx="3" ry="4" fill={DF.void} />

      {/* NAIL (SWORD) - thin and elegant */}
      <g
        style={{
          transformOrigin: '8px 40px',
          transform: `rotate(${nailRotation}deg)`,
          transition: attacking ? 'transform 0.08s ease-out' : 'transform 0.2s ease-out',
        }}
      >
        {/* Handle */}
        <rect x="5" y="38" width="6" height="10" rx="1" fill={DF.cloak} stroke={DF.bone} strokeWidth="0.5" />

        {/* Guard */}
        <ellipse cx="8" cy="38" rx="5" ry="2" fill={DF.bone} />

        {/* Blade - thin and pointed */}
        <path
          d="M8,38 L5,18 L8,4 L11,18 L8,38"
          fill={DF.bone}
          stroke={DF.boneShade}
          strokeWidth="0.3"
        />

        {/* Blade center line */}
        <line x1="8" y1="36" x2="8" y2="6" stroke={DF.spiritGlow} strokeWidth="0.8" opacity="0.5" />

        {/* Attack glow */}
        {attacking && attackPhase > 0.4 && (
          <path
            d="M8,38 L5,18 L8,4 L11,18 L8,38"
            fill={DF.ethereal}
            opacity={0.5 * Math.min(1, (attackPhase - 0.4) * 3)}
            filter="url(#attackGlow)"
          />
        )}
      </g>
    </svg>
  )
})

// ============================================
// KNIGHT SLASH REVEAL ANIMATION
// ============================================

interface KnightSlashRevealProps {
  children: ReactNode
  triggered: boolean
  className?: string
}

type AnimationPhase = 'idle' | 'knight-enter' | 'knight-raise' | 'slash' | 'content-reveal' | 'complete'

const PHASE_TIMING = {
  'knight-enter': 0,
  'knight-raise': 200,
  'slash': 350,
  'content-reveal': 450,
  'complete': 800,
}

export const KnightSlashReveal = memo(function KnightSlashReveal({
  children,
  triggered,
  className = '',
}: KnightSlashRevealProps) {
  const [phase, setPhase] = useState<AnimationPhase>('idle')
  const [attackPhase, setAttackPhase] = useState(0)
  const [showSlash, setShowSlash] = useState(false)

  useEffect(() => {
    if (!triggered) {
      setPhase('idle')
      setAttackPhase(0)
      setShowSlash(false)
      return
    }

    if (phase !== 'idle') return

    setPhase('knight-enter')

    const timers: NodeJS.Timeout[] = []

    timers.push(setTimeout(() => setPhase('knight-raise'), PHASE_TIMING['knight-raise']))

    timers.push(setTimeout(() => {
      setPhase('slash')
      setShowSlash(true)
      let start = performance.now()
      const animateAttack = (now: number) => {
        const progress = Math.min((now - start) / 100, 1)
        setAttackPhase(progress)
        if (progress < 1) requestAnimationFrame(animateAttack)
      }
      requestAnimationFrame(animateAttack)
    }, PHASE_TIMING['slash']))

    timers.push(setTimeout(() => {
      setShowSlash(false)
      setPhase('content-reveal')
      setAttackPhase(0)
    }, PHASE_TIMING['content-reveal']))

    timers.push(setTimeout(() => setPhase('complete'), PHASE_TIMING['complete']))

    return () => timers.forEach(t => clearTimeout(t))
  }, [triggered])

  const getKnightStyle = (): React.CSSProperties => {
    switch (phase) {
      case 'idle':
        return { transform: 'translateX(120px)', opacity: 0 }
      case 'knight-enter':
        return { transform: 'translateX(0)', opacity: 1, transition: 'all 200ms ease-out' }
      case 'knight-raise':
        return { transform: 'translateX(-10px)', opacity: 1, transition: 'all 150ms ease-out' }
      case 'slash':
        return { transform: 'translateX(-25px)', opacity: 1, transition: 'all 100ms ease-out' }
      case 'content-reveal':
      case 'complete':
        return { transform: 'translateX(60px)', opacity: 0.3, transition: 'all 250ms ease-out' }
      default:
        return { transform: 'translateX(120px)', opacity: 0 }
    }
  }

  const getContentStyle = (): React.CSSProperties => {
    switch (phase) {
      case 'idle':
      case 'knight-enter':
      case 'knight-raise':
      case 'slash':
        return { transform: 'translateX(100%)', opacity: 0 }
      case 'content-reveal':
        return { transform: 'translateX(0)', opacity: 1, transition: 'all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)' }
      case 'complete':
        return { transform: 'translateX(0)', opacity: 1 }
      default:
        return { transform: 'translateX(0)', opacity: 1 }
    }
  }

  const showKnight = phase !== 'idle'
  const isAttacking = phase === 'knight-raise' || phase === 'slash'

  return (
    <div className={`relative w-full overflow-hidden ${className}`} style={{ minHeight: '200px' }}>
      {showSlash && (
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent 20%, ${DF.ethereal}40 50%, transparent 80%)`,
            animation: 'slashFlash 100ms ease-out'
          }}
        />
      )}

      <div style={getContentStyle()}>
        {children}
      </div>

      {showKnight && (
        <div
          className="absolute right-8 top-1/2 -translate-y-1/2 z-20 pointer-events-none"
          style={getKnightStyle()}
        >
          <KnightCharacter
            scale={1.8}
            attacking={isAttacking}
            attackPhase={attackPhase}
            facingDirection="left"
          />
        </div>
      )}

      <style>{`
        @keyframes slashFlash {
          0% { opacity: 0; transform: translateX(-100%); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
})
