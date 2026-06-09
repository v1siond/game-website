'use client'

import { memo, ReactNode, useState, useEffect, useRef } from 'react'
import { useInView, FixedCombatLayer } from './fixedCombat'

/**
 * ALEXANDER AS HOLLOW KNIGHT CHARACTER
 * =====================================
 * Based on reference image - 3/4 view facing RIGHT
 *
 * KEY DESIGN ELEMENTS (from reference):
 * - HORNS curve UPWARD like crescents (not outward like devil horns)
 * - Large rounded head/mask (egg-shaped, top-heavy)
 * - TWO void black eyes (large ovals)
 * - Small cloak/body below head
 * - Default orientation faces RIGHT (mirror for left)
 *
 * ALEXANDER ADAPTATION:
 * - Beard extends from bottom of mask
 */

const DF = {
  void: '#000000',
  mask: '#ffffff',
  maskShade: '#e8e8e8',
  cloak: '#3d4a5c',
  cloakDark: '#2a3545',
  ethereal: '#50e0ff',
  nail: '#c8c8c8',
  nailShade: '#a0a0a0',
  beard: '#4a3c2e',
  beardDark: '#3a2c1e',
}

interface KnightCharacterProps {
  scale?: number
  size?: number
  attacking?: boolean
  attackPhase?: number
  facingDirection?: 'left' | 'right'
  className?: string
  breathing?: boolean
}

export const KnightCharacter = memo(function KnightCharacter({
  scale = 1,
  size,
  attacking = false,
  attackPhase = 0,
  facingDirection = 'right',
  className = '',
  breathing = false,
}: KnightCharacterProps) {
  const effectiveScale = size ? size / 60 : scale
  const isLeft = facingDirection === 'left'

  const getNailRotation = () => {
    if (!attacking) return 25
    if (attackPhase < 0.3) return 25 - (attackPhase / 0.3) * 85
    if (attackPhase < 0.5) return -60
    return -60 + ((attackPhase - 0.5) / 0.5) * 85
  }

  const nailRotation = getNailRotation()

  return (
    <span style={{ display: 'inline-block', animation: breathing && !attacking ? 'knightIdleFloat 3.6s ease-in-out infinite' : undefined }}>
    {/* Idle: gentle float wrapper + cloak breathing (HK-style); disabled while attacking */}
    {breathing && (
      <style>{`
        @keyframes knightCloakBreathing {
          0%, 100% { transform: scaleY(1) scaleX(1); }
          50% { transform: scaleY(1.06) scaleX(1.03); }
        }
        @keyframes knightIdleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    )}
    <svg
      width={60 * effectiveScale}
      height={80 * effectiveScale}
      viewBox="0 0 60 80"
      className={className}
      style={{
        overflow: 'visible',
        transform: isLeft ? 'scaleX(-1)' : 'none',
        filter: `drop-shadow(0 4px 3px rgba(0,0,0,0.45)) drop-shadow(0 0 5px ${DF.ethereal}22)`,
      }}
    >
      {/* Ground contact shadow — two soft stacked ellipses (replaces the old glow-only shadow) */}
      <ellipse cx="30" cy="79" rx="21" ry="4.5" fill={DF.void} opacity="0.22" />
      <ellipse cx="30" cy="79" rx="14" ry="3" fill={DF.void} opacity="0.4" />
      {/* === KNIGHT - 3/4 VIEW FACING RIGHT === */}
      {/* Based on reference image proportions */}

      {/* CLOAK/BODY - small, below head - breathing animation applied here only */}
      <g
        style={{
          transformOrigin: '30px 60px',
          animation: breathing ? 'knightCloakBreathing 3s ease-in-out infinite' : undefined,
        }}
      >
        <path
          d="M18,48
             C14,52 12,60 14,70
             L18,74
             L42,74
             L46,70
             C48,60 46,52 42,48
             Z"
          fill={DF.cloak}
          stroke={DF.void}
          strokeWidth="1.5"
        />
        {/* Cloak detail - center fold */}
        <path
          d="M30,50 L30,72"
          stroke={DF.cloakDark}
          strokeWidth="2"
          opacity="0.5"
        />
        {/* Cloak side folds */}
        <path
          d="M22,52 C20,58 20,66 22,72"
          stroke={DF.cloakDark}
          strokeWidth="1"
          fill="none"
          opacity="0.3"
        />
        <path
          d="M38,52 C40,58 40,66 38,72"
          stroke={DF.cloakDark}
          strokeWidth="1"
          fill="none"
          opacity="0.3"
        />
      </g>

      {/* MASK/HEAD - large rounded egg shape */}
      <ellipse
        cx="30"
        cy="28"
        rx="20"
        ry="22"
        fill={DF.mask}
        stroke={DF.void}
        strokeWidth="1.5"
      />

      {/* LEFT HORN - curves UPWARD (crescent pointing up-left) */}
      <path
        d="M14,14
           C10,8 8,2 10,-6
           C14,-4 16,2 18,10
           C16,12 14,14 14,14
           Z"
        fill={DF.mask}
        stroke={DF.void}
        strokeWidth="1"
      />

      {/* RIGHT HORN - curves UPWARD (crescent pointing up-right) */}
      <path
        d="M46,14
           C50,8 52,2 50,-6
           C46,-4 44,2 42,10
           C44,12 46,14 46,14
           Z"
        fill={DF.mask}
        stroke={DF.void}
        strokeWidth="1"
      />

      {/* LEFT EYE - large void oval */}
      <ellipse
        cx="22"
        cy="28"
        rx="6"
        ry="9"
        fill={DF.void}
      />

      {/* RIGHT EYE - large void oval */}
      <ellipse
        cx="38"
        cy="28"
        rx="6"
        ry="9"
        fill={DF.void}
      />

      {/* BEARD - Alexander's signature */}
      <path
        d="M20,42
           C18,44 16,48 18,54
           C20,58 26,62 30,62
           C34,62 40,58 42,54
           C44,48 42,44 40,42
           C36,44 34,46 30,46
           C26,46 24,44 20,42
           Z"
        fill={DF.beard}
        stroke={DF.beardDark}
        strokeWidth="0.5"
      />
      {/* Beard texture lines */}
      <path
        d="M24,48 C24,52 26,56 28,58"
        stroke={DF.beardDark}
        strokeWidth="0.5"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M36,48 C36,52 34,56 32,58"
        stroke={DF.beardDark}
        strokeWidth="0.5"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M30,46 L30,60"
        stroke={DF.beardDark}
        strokeWidth="0.5"
        opacity="0.4"
      />

      {/* NAIL - held to the side */}
      <g
        style={{
          transformOrigin: '52px 55px',
          transform: `rotate(${nailRotation}deg)`,
          transition: attacking ? 'transform 0.06s ease-out' : 'transform 0.15s ease-out',
        }}
      >
        {/* Handle */}
        <rect x="49" y="53" width="6" height="10" rx="1" fill={DF.cloakDark} stroke={DF.void} strokeWidth="0.5" />
        {/* Blade */}
        <path
          d="M52,53 L48,35 L52,15 L56,35 L52,53"
          fill={DF.nail}
          stroke={DF.nailShade}
          strokeWidth="0.5"
        />
        {/* Highlight */}
        <line x1="52" y1="50" x2="52" y2="18" stroke="#ffffff" strokeWidth="0.5" opacity="0.5" />
        {attacking && attackPhase > 0.2 && attackPhase < 0.6 && (
          <path
            d="M52,53 L48,35 L52,15 L56,35 L52,53"
            fill={DF.ethereal}
            opacity="0.5"
          />
        )}
      </g>

      {/* Ground shadow */}
      <ellipse cx="30" cy="76" rx="14" ry="2" fill={DF.void} opacity="0.3" />
    </svg>
    </span>
  )
})

// ============================================
// KNIGHT SLASH REVEAL ANIMATION
// ============================================
// Uses IntersectionObserver for reliable triggering

interface KnightSlashRevealProps {
  children: ReactNode
  triggered: boolean
  className?: string
}

type AnimationPhase = 'idle' | 'knight-enter' | 'knight-raise' | 'slash' | 'content-reveal' | 'complete'

const PHASE_TIMING = {
  'knight-enter': 500,      // 0.5s delay before animation starts
  'knight-raise': 700,
  'slash': 850,
  'content-reveal': 950,
  'complete': 1300,
}

export const KnightSlashReveal = memo(function KnightSlashReveal({
  children,
  triggered,
  className = '',
}: KnightSlashRevealProps) {
  const [phase, setPhase] = useState<AnimationPhase>('idle')
  const [attackPhase, setAttackPhase] = useState(0)
  const [showSlash, setShowSlash] = useState(false)
  const hasAnimated = useRef(false)
  // continuous in-view so the fixed knight fades out once we scroll past the section
  const { ref: stageRef, inView } = useInView()

  useEffect(() => {
    if (!triggered || hasAnimated.current) {
      if (!triggered) {
        // Only reset if we haven't animated yet
        if (!hasAnimated.current) {
          setPhase('idle')
        }
      }
      return
    }

    // Mark as animated so we don't replay
    hasAnimated.current = true

    const timers: NodeJS.Timeout[] = []

    // 0.5s delay before animation starts
    timers.push(setTimeout(() => setPhase('knight-enter'), PHASE_TIMING['knight-enter']))
    timers.push(setTimeout(() => setPhase('knight-raise'), PHASE_TIMING['knight-raise']))

    timers.push(setTimeout(() => {
      setPhase('slash')
      setShowSlash(true)
      const start = performance.now()
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
        return { transform: 'translateX(-70px)', opacity: 0.75, transition: 'all 250ms ease-out' }
      case 'complete':
        // Knight rests closer to content (more to the left)
        return {
          transform: 'translateX(-90px)',
          opacity: 0.7,
          transition: 'all 300ms ease-out',
        }
      default:
        return { transform: 'translateX(120px)', opacity: 0 }
    }
  }

  const getContentStyle = (): React.CSSProperties => {
    switch (phase) {
      case 'idle':
        return { transform: 'translateX(100%)', opacity: 0 }
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
    <div ref={stageRef} className={`relative w-full ${className}`} style={{ minHeight: '200px' }}>
      {showSlash && (
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent 20%, ${DF.ethereal}40 50%, transparent 80%)`,
            animation: 'slashFlash 100ms ease-out'
          }}
        />
      )}

      {/* relative z-20: the transform from getContentStyle() makes this a stacking context;
          without an explicit z-index it sinks below the fixed z-[1..6] background (transparent) */}
      <div className="relative z-20" style={getContentStyle()}>
        {children}
      </div>

      {/* Knight pinned to the viewport (bottom-right ~15-18%); only the content above scrolls */}
      {showKnight && (
        <FixedCombatLayer inView={inView}>
          <div
            className="absolute right-[8%] bottom-[18%] z-20 pointer-events-none"
            style={getKnightStyle()}
          >
            <KnightCharacter
              scale={1.8}
              attacking={isAttacking}
              attackPhase={attackPhase}
              facingDirection="left"
              breathing={phase === 'complete'}
            />
          </div>
        </FixedCombatLayer>
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
