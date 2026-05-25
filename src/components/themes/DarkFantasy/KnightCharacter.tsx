'use client'

import { memo, useEffect, useState, ReactNode } from 'react'

/**
 * ALEXANDER CHARACTER - HOLLOW KNIGHT STYLE
 * =========================================
 *
 * Alexander's features styled in HK's dark aesthetic:
 * - Brown/tan skin (from sprite)
 * - Dark prominent BEARD (key identifier)
 * - Dark short hair
 * - Simple oval eyes with void-like quality
 * - Visible ears
 * - Dark flowing CLOAK (HK style)
 * - Thin nail weapon (HK style)
 *
 * Style: Simple shapes, limited dark palette, readable silhouette
 */

const DF = {
  void: '#0f0a1a',
  voidDeep: '#0a0610',
  // Alexander's skin tones - MORE SATURATED
  skin: '#a5784d',
  skinShade: '#7a5a3a',
  skinHighlight: '#c49060',
  // Beard/hair - richer dark brown
  beard: '#352838',
  beardDark: '#221822',
  hair: '#352838',
  // Cloak - deeper purple tones
  cloak: '#3a3050',
  cloakDark: '#221830',
  // Accents - brighter ethereal
  ethereal: '#50e0ff',
  etherealGlow: '#80ffff',
  bone: '#f0ece5',
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
      height={85 * effectiveScale}
      viewBox="0 0 50 85"
      className={className}
      style={{
        overflow: 'visible',
        transform: isLeft ? 'scaleX(-1)' : 'none',
        filter: `drop-shadow(0 0 8px ${DF.ethereal}40) drop-shadow(0 0 3px ${DF.void})`,
      }}
    >
      <defs>
        <radialGradient id="skinGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor={DF.skinHighlight} />
          <stop offset="100%" stopColor={DF.skin} />
        </radialGradient>
        <linearGradient id="cloakGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={DF.cloak} />
          <stop offset="100%" stopColor={DF.cloakDark} />
        </linearGradient>
        <filter id="attackGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="characterGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* CLOAK / BODY - dark flowing shape (HK style) */}
      <path
        d="M18,30
           C12,34 8,45 10,58
           Q12,65 18,68
           L32,68
           Q38,65 40,58
           C42,45 38,34 32,30
           Z"
        fill="url(#cloakGrad)"
        stroke={DF.voidDeep}
        strokeWidth="0.5"
      />
      {/* Cloak folds */}
      <path
        d="M20,36 Q19,48 20,60 M30,36 Q31,48 30,60"
        fill="none"
        stroke={DF.voidDeep}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* EARS - visible like in sprite */}
      <ellipse cx="10" cy="18" rx="3" ry="4" fill={DF.skin} stroke={DF.skinShade} strokeWidth="0.5" />
      <ellipse cx="40" cy="18" rx="3" ry="4" fill={DF.skin} stroke={DF.skinShade} strokeWidth="0.5" />
      {/* Inner ear detail */}
      <ellipse cx="10" cy="18" rx="1.5" ry="2.5" fill={DF.skinShade} opacity="0.5" />
      <ellipse cx="40" cy="18" rx="1.5" ry="2.5" fill={DF.skinShade} opacity="0.5" />

      {/* HEAD - Alexander's face shape */}
      <ellipse
        cx="25"
        cy="16"
        rx="12"
        ry="14"
        fill="url(#skinGrad)"
        stroke={DF.skinShade}
        strokeWidth="0.5"
      />

      {/* HAIR - dark, short, close-cropped like sprite */}
      <path
        d="M13,12
           Q13,4 25,4
           Q37,4 37,12
           Q37,8 25,6
           Q13,8 13,12
           Z"
        fill={DF.hair}
        stroke={DF.beardDark}
        strokeWidth="0.3"
      />
      {/* Hair sides */}
      <path d="M13,12 Q12,14 13,18" fill="none" stroke={DF.hair} strokeWidth="3" strokeLinecap="round" />
      <path d="M37,12 Q38,14 37,18" fill="none" stroke={DF.hair} strokeWidth="3" strokeLinecap="round" />

      {/* BEARD - prominent, key Alexander identifier */}
      <path
        d="M16,22
           Q14,26 16,30
           Q20,34 25,35
           Q30,34 34,30
           Q36,26 34,22
           Q30,24 25,24
           Q20,24 16,22
           Z"
        fill={DF.beard}
        stroke={DF.beardDark}
        strokeWidth="0.3"
      />
      {/* Beard texture lines */}
      <path
        d="M18,26 Q20,30 22,32
           M25,25 L25,33
           M32,26 Q30,30 28,32"
        fill="none"
        stroke={DF.beardDark}
        strokeWidth="0.5"
        opacity="0.6"
      />

      {/* EYES - void-like with subtle ethereal glow (HK style: one glowing accent) */}
      <ellipse cx="20" cy="16" rx="3" ry="4" fill={DF.voidDeep} />
      <ellipse cx="30" cy="16" rx="3" ry="4" fill={DF.voidDeep} />
      {/* Ethereal eye glow - the "one glowing accent" HK OCs need */}
      <ellipse cx="20" cy="16" rx="2" ry="2.5" fill={DF.ethereal} opacity="0.15" />
      <ellipse cx="30" cy="16" rx="2" ry="2.5" fill={DF.ethereal} opacity="0.15" />
      {/* Tiny bright core */}
      <ellipse cx="20" cy="15" rx="0.8" ry="1" fill={DF.ethereal} opacity="0.4" />
      <ellipse cx="30" cy="15" rx="0.8" ry="1" fill={DF.ethereal} opacity="0.4" />

      {/* NAIL (SWORD) - HK style weapon */}
      <g
        style={{
          transformOrigin: '8px 40px',
          transform: `rotate(${nailRotation}deg)`,
          transition: attacking ? 'transform 0.08s ease-out' : 'transform 0.2s ease-out',
        }}
      >
        <rect x="5" y="38" width="6" height="10" rx="1" fill={DF.cloak} stroke={DF.bone} strokeWidth="0.5" />
        <ellipse cx="8" cy="38" rx="5" ry="2" fill={DF.bone} />
        <path
          d="M8,38 L5,18 L8,4 L11,18 L8,38"
          fill={DF.bone}
          stroke={DF.skinShade}
          strokeWidth="0.3"
        />
        <line x1="8" y1="36" x2="8" y2="6" stroke={DF.spiritGlow} strokeWidth="0.8" opacity="0.5" />
        {attacking && attackPhase > 0.4 && (
          <path
            d="M8,38 L5,18 L8,4 L11,18 L8,38"
            fill={DF.ethereal}
            opacity={0.5 * Math.min(1, (attackPhase - 0.4) * 3)}
            filter="url(#attackGlow)"
          />
        )}
      </g>

      {/* LEGS - visible below cloak */}
      <g>
        {/* Left leg */}
        <path
          d="M18,66 L16,75 L14,75 L14,78 L20,78 L20,75 L18,75 L20,66"
          fill={DF.cloakDark}
          stroke={DF.void}
          strokeWidth="0.5"
        />
        {/* Right leg */}
        <path
          d="M30,66 L28,75 L26,75 L26,78 L32,78 L32,75 L30,75 L32,66"
          fill={DF.cloakDark}
          stroke={DF.void}
          strokeWidth="0.5"
        />
        {/* Boot details */}
        <ellipse cx="17" cy="77" rx="4" ry="1.5" fill={DF.void} />
        <ellipse cx="29" cy="77" rx="4" ry="1.5" fill={DF.void} />
      </g>

      {/* GROUND SHADOW - follows character */}
      <ellipse
        cx="25"
        cy="82"
        rx="12"
        ry="3"
        fill={DF.void}
        opacity="0.5"
      >
        <animate
          attributeName="opacity"
          values="0.4;0.6;0.4"
          dur="2s"
          repeatCount="indefinite"
        />
      </ellipse>
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
