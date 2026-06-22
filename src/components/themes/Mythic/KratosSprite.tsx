'use client'

import { memo } from 'react'

/**
 * KRATOS SPRITE SYSTEM - CSS Keyframe Animation
 * ==============================================
 * Smooth CSS animations instead of frame-by-frame
 * Each body part rotates independently via keyframes
 */

const K = {
  skin: '#c4956a',
  skinShadow: '#9a7050',
  tattoo: '#8b1a1a',
  beard: '#1a1208',
  hair: '#1a1208',
  skirt: '#8b1a1a',
  skirtDark: '#5a0a0a',
  belt: '#5a4a2a',
  gold: '#c9a227',
  bladeRed: '#cc3333',
  bladeRedGlow: '#ff6666',
  bladeBlue: '#3366cc',
  bladeBlueGlow: '#6699ff',
  chain: '#8a8a8a',
  eye: '#1a0a00',
}

// CSS Keyframes for walk animation
const walkKeyframes = `
  @keyframes kratos-bounce {
    0%, 100% { transform: translateY(0); }
    25%, 75% { transform: translateY(2px); }
    50% { transform: translateY(0); }
  }

  @keyframes kratos-body {
    0%, 100% { transform: rotate(20deg); }
    25%, 75% { transform: rotate(15deg); }
    50% { transform: rotate(20deg); }
  }

  @keyframes kratos-arm-front {
    0%, 100% { transform: rotate(30deg); }
    50% { transform: rotate(130deg); }
  }

  @keyframes kratos-arm-behind {
    0%, 100% { transform: rotate(130deg); }
    50% { transform: rotate(30deg); }
  }

  @keyframes kratos-forearm-front {
    0%, 100% { transform: rotate(-40deg); }
    30%, 70% { transform: rotate(-30deg); }
  }

  @keyframes kratos-forearm-behind {
    0%, 100% { transform: rotate(-30deg); }
    30%, 70% { transform: rotate(-40deg); }
  }

  @keyframes kratos-leg-front {
    0%, 100% { transform: rotate(20deg); }
    50% { transform: rotate(80deg); }
  }

  @keyframes kratos-leg-behind {
    0%, 100% { transform: rotate(80deg); }
    50% { transform: rotate(20deg); }
  }

  @keyframes kratos-calf-front {
    0%, 100% { transform: rotate(20deg); }
    50% { transform: rotate(50deg); }
  }

  @keyframes kratos-calf-behind {
    0%, 100% { transform: rotate(50deg); }
    50% { transform: rotate(20deg); }
  }

  /* Attack idle - breathing/preparation animation */
  @keyframes kratos-attack-breathe {
    0%, 100% { transform: scaleY(1) translateY(0); }
    50% { transform: scaleY(1.03) translateY(-1px); }
  }

  @keyframes kratos-attack-arm-red {
    0%, 100% { transform: rotate(-20deg); }
    30% { transform: rotate(-25deg); }
    70% { transform: rotate(-15deg); }
  }

  @keyframes kratos-attack-arm-blue {
    0%, 100% { transform: rotate(100deg); }
    30% { transform: rotate(105deg); }
    70% { transform: rotate(95deg); }
  }

  @keyframes kratos-attack-forearm-red {
    0%, 100% { transform: rotate(-50deg); }
    50% { transform: rotate(-45deg); }
  }

  @keyframes kratos-attack-forearm-blue {
    0%, 100% { transform: rotate(-20deg); }
    50% { transform: rotate(-25deg); }
  }
`

interface KratosCharacterProps {
  scale?: number
  animation?: 'idle' | 'running' | 'attackIdle'
  facingDirection?: 'left' | 'right'
  className?: string
}

export const KratosCharacter = memo(function KratosCharacter({
  scale = 1,
  animation = 'idle',
  facingDirection = 'left',
  className = '',
}: KratosCharacterProps) {
  const isRunning = animation === 'running'
  const isAttackIdle = animation === 'attackIdle'
  const duration = '0.8s'
  const breatheDuration = '2.5s'
  const isLeft = facingDirection === 'left'

  return (
    <>
      <style>{walkKeyframes}</style>
      <div
        className={className}
        style={{
          width: 70 * scale,
          height: 80 * scale,
          position: 'relative',
          transform: isLeft ? 'scaleX(-1)' : 'none',
        }}
      >
        {/* Outer container for bounce/breathe */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 8 * scale,
            transformOrigin: 'center bottom',
            animation: isRunning
              ? `kratos-bounce ${duration} linear infinite`
              : isAttackIdle
                ? `kratos-attack-breathe ${breatheDuration} ease-in-out infinite`
                : 'none',
          }}
        >
          {/* Body container */}
          <div
            style={{
              position: 'relative',
              transformOrigin: '0 40px',
              transform: isRunning ? 'rotate(20deg)' : isAttackIdle ? 'rotate(15deg)' : 'rotate(5deg)',
              animation: isRunning ? `kratos-body ${duration} linear infinite` : 'none',
            }}
          >
            {/* HEAD */}
            <div
              style={{
                position: 'absolute',
                bottom: 48 * scale,
                left: -7 * scale,
                width: 14 * scale,
                height: 16 * scale,
              }}
            >
              <svg viewBox="0 0 14 16" width={14 * scale} height={16 * scale}>
                {/* Head shape */}
                <ellipse cx="7" cy="8" rx="6" ry="7" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.3" />
                {/* Hair */}
                <path d="M1,6 Q2,1 7,0.5 Q12,1 13,6 Q11,3 7,2.5 Q3,3 1,6 Z" fill={K.hair} />
                {/* Tattoo on visible side */}
                <path d="M11,2 Q13,5 12,8 Q12,11 11,13" stroke={K.tattoo} strokeWidth="1.5" fill="none" strokeLinecap="round" />
                {/* Eye */}
                <ellipse cx="10" cy="7" rx="1.5" ry="1" fill="white" />
                <circle cx="10.3" cy="7" r="0.7" fill={K.eye} />
                {/* Eyebrow */}
                <path d="M8.5,5 L12,5.5" stroke={K.beard} strokeWidth="1" strokeLinecap="round" />
                {/* Beard profile */}
                <path d="M10,10 Q12,12 10,14 Q8,12.5 8,10 Z" fill={K.beard} />
                {/* Nose */}
                <path d="M12,7.5 L12.5,9" stroke={K.skinShadow} strokeWidth="0.3" />
              </svg>
            </div>

            {/* TORSO - side profile (narrow) */}
            <div
              style={{
                position: 'absolute',
                bottom: 20 * scale,
                left: -5 * scale,
                width: 10 * scale,
                height: 28 * scale,
              }}
            >
              <svg viewBox="0 0 10 28" width={10 * scale} height={28 * scale}>
                <ellipse cx="5" cy="12" rx="4" ry="10" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.3" />
                {/* Belt */}
                <rect x="2" y="20" width="6" height="2" fill={K.belt} rx="0.5" />
                {/* Skirt */}
                <path d="M2,22 L1,28 L5,27 L9,28 L8,22 Z" fill={K.skirt} stroke={K.skirtDark} strokeWidth="0.3" />
              </svg>
            </div>

            {/* ARM BEHIND (with RED blade) - raised up-left in attackIdle */}
            <div
              style={{
                position: 'absolute',
                bottom: 42 * scale,
                left: -3 * scale,
                transformOrigin: `${2 * scale}px ${2 * scale}px`,
                transform: isRunning
                  ? 'rotate(130deg)'
                  : isAttackIdle
                    ? 'rotate(-20deg)'
                    : 'rotate(80deg)',
                animation: isRunning
                  ? `kratos-arm-behind ${duration} linear infinite`
                  : isAttackIdle
                    ? `kratos-attack-arm-red ${breatheDuration} ease-in-out infinite`
                    : 'none',
                zIndex: isAttackIdle ? 3 : 0,
              }}
            >
              {/* Upper arm */}
              <div
                style={{
                  width: 12 * scale,
                  height: 4 * scale,
                  background: isAttackIdle ? K.skin : K.skinShadow,
                  borderRadius: 2 * scale,
                }}
              />
              {/* Forearm + blade */}
              <div
                style={{
                  position: 'absolute',
                  left: 9 * scale,
                  top: 0,
                  transformOrigin: `${2 * scale}px ${2 * scale}px`,
                  transform: isRunning
                    ? 'rotate(-30deg)'
                    : isAttackIdle
                      ? 'rotate(-50deg)'
                      : 'rotate(-20deg)',
                  animation: isRunning
                    ? `kratos-forearm-behind ${duration} linear infinite`
                    : isAttackIdle
                      ? `kratos-attack-forearm-red ${breatheDuration} ease-in-out infinite`
                      : 'none',
                }}
              >
                <div
                  style={{
                    width: 10 * scale,
                    height: 4 * scale,
                    background: K.skinShadow,
                    borderRadius: 2 * scale,
                  }}
                />
                {/* Red blade */}
                <svg
                  viewBox="0 0 20 6"
                  width={20 * scale}
                  height={6 * scale}
                  style={{
                    position: 'absolute',
                    left: 8 * scale,
                    top: -1 * scale,
                    filter: 'drop-shadow(0 0 3px #ff4444)',
                  }}
                >
                  <path d="M0,3 L18,1 Q20,3 18,5 L0,3 Z" fill={K.bladeRed} stroke={K.bladeRedGlow} strokeWidth="0.5" />
                </svg>
              </div>
            </div>

            {/* LEG BEHIND - spread back for /\ stance in attackIdle */}
            <div
              style={{
                position: 'absolute',
                bottom: 20 * scale,
                left: -1 * scale,
                transformOrigin: `${2 * scale}px ${2 * scale}px`,
                transform: isRunning
                  ? 'rotate(80deg)'
                  : isAttackIdle
                    ? 'rotate(70deg)'
                    : 'rotate(50deg)',
                animation: isRunning ? `kratos-leg-behind ${duration} linear infinite` : 'none',
                zIndex: 0,
              }}
            >
              {/* Upper leg */}
              <div
                style={{
                  width: 14 * scale,
                  height: 5 * scale,
                  background: K.skinShadow,
                  borderRadius: 2.5 * scale,
                }}
              />
              {/* Lower leg + foot */}
              <div
                style={{
                  position: 'absolute',
                  left: 11 * scale,
                  top: 0,
                  transformOrigin: `${2 * scale}px ${2.5 * scale}px`,
                  transform: isRunning
                    ? 'rotate(50deg)'
                    : isAttackIdle
                      ? 'rotate(10deg)'
                      : 'rotate(30deg)',
                  animation: isRunning ? `kratos-calf-behind ${duration} linear infinite` : 'none',
                }}
              >
                <div
                  style={{
                    width: 12 * scale,
                    height: 5 * scale,
                    background: K.skinShadow,
                    borderRadius: 2.5 * scale,
                  }}
                />
                {/* Foot */}
                <div
                  style={{
                    position: 'absolute',
                    left: 9 * scale,
                    top: 1 * scale,
                    width: 6 * scale,
                    height: 3 * scale,
                    background: K.beard,
                    borderRadius: `${1 * scale}px ${3 * scale}px ${3 * scale}px ${1 * scale}px`,
                  }}
                />
              </div>
            </div>

            {/* LEG FRONT - spread forward for /\ stance in attackIdle */}
            <div
              style={{
                position: 'absolute',
                bottom: 20 * scale,
                left: -1 * scale,
                transformOrigin: `${2 * scale}px ${2 * scale}px`,
                transform: isRunning
                  ? 'rotate(20deg)'
                  : isAttackIdle
                    ? 'rotate(30deg)'
                    : 'rotate(50deg)',
                animation: isRunning ? `kratos-leg-front ${duration} linear infinite` : 'none',
                zIndex: 2,
              }}
            >
              {/* Upper leg */}
              <div
                style={{
                  width: 14 * scale,
                  height: 5 * scale,
                  background: K.skin,
                  borderRadius: 2.5 * scale,
                }}
              />
              {/* Lower leg + foot */}
              <div
                style={{
                  position: 'absolute',
                  left: 11 * scale,
                  top: 0,
                  transformOrigin: `${2 * scale}px ${2.5 * scale}px`,
                  transform: isRunning
                    ? 'rotate(20deg)'
                    : isAttackIdle
                      ? 'rotate(10deg)'
                      : 'rotate(30deg)',
                  animation: isRunning ? `kratos-calf-front ${duration} linear infinite` : 'none',
                }}
              >
                <div
                  style={{
                    width: 12 * scale,
                    height: 5 * scale,
                    background: K.skin,
                    borderRadius: 2.5 * scale,
                  }}
                />
                {/* Foot */}
                <div
                  style={{
                    position: 'absolute',
                    left: 9 * scale,
                    top: 1 * scale,
                    width: 6 * scale,
                    height: 3 * scale,
                    background: K.beard,
                    borderRadius: `${1 * scale}px ${3 * scale}px ${3 * scale}px ${1 * scale}px`,
                  }}
                />
              </div>
            </div>

            {/* ARM FRONT (with BLUE blade) - back position in attackIdle */}
            <div
              style={{
                position: 'absolute',
                bottom: 42 * scale,
                left: -3 * scale,
                transformOrigin: `${2 * scale}px ${2 * scale}px`,
                transform: isRunning
                  ? 'rotate(30deg)'
                  : isAttackIdle
                    ? 'rotate(100deg)'
                    : 'rotate(80deg)',
                animation: isRunning
                  ? `kratos-arm-front ${duration} linear infinite`
                  : isAttackIdle
                    ? `kratos-attack-arm-blue ${breatheDuration} ease-in-out infinite`
                    : 'none',
                zIndex: isAttackIdle ? 0 : 3,
              }}
            >
              {/* Upper arm */}
              <div
                style={{
                  width: 12 * scale,
                  height: 4 * scale,
                  background: isAttackIdle ? K.skinShadow : K.skin,
                  borderRadius: 2 * scale,
                }}
              />
              {/* Forearm + blade */}
              <div
                style={{
                  position: 'absolute',
                  left: 9 * scale,
                  top: 0,
                  transformOrigin: `${2 * scale}px ${2 * scale}px`,
                  transform: isRunning
                    ? 'rotate(-40deg)'
                    : isAttackIdle
                      ? 'rotate(-20deg)'
                      : 'rotate(-20deg)',
                  animation: isRunning
                    ? `kratos-forearm-front ${duration} linear infinite`
                    : isAttackIdle
                      ? `kratos-attack-forearm-blue ${breatheDuration} ease-in-out infinite`
                      : 'none',
                }}
              >
                <div
                  style={{
                    width: 10 * scale,
                    height: 4 * scale,
                    background: K.skin,
                    borderRadius: 2 * scale,
                  }}
                />
                {/* Blue blade */}
                <svg
                  viewBox="0 0 20 6"
                  width={20 * scale}
                  height={6 * scale}
                  style={{
                    position: 'absolute',
                    left: 8 * scale,
                    top: -1 * scale,
                    filter: 'drop-shadow(0 0 3px #4488ff)',
                  }}
                >
                  <path d="M0,3 L18,1 Q20,3 18,5 L0,3 Z" fill={K.bladeBlue} stroke={K.bladeBlueGlow} strokeWidth="0.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Ground shadow */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 30 * scale,
            height: 6 * scale,
            background: 'radial-gradient(ellipse, rgba(201,162,39,0.4) 0%, rgba(90,74,16,0) 70%)',
            borderRadius: '50%',
          }}
        />
      </div>
    </>
  )
})

// ============================================================================
// IDLE VERSION - separate static component
// ============================================================================
const KratosIdle = memo(function KratosIdle({ scale = 1 }: { scale: number }) {
  return (
    <svg viewBox="0 0 70 75" width={70 * scale} height={75 * scale} style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="kratosGroundShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c9a227" stopOpacity="0.4" />
          <stop offset="70%" stopColor="#8b7319" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#5a4a10" stopOpacity="0" />
        </radialGradient>
        <filter id="redGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feFlood floodColor="#ff4444" floodOpacity="0.6" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="blueGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feFlood floodColor="#4488ff" floodOpacity="0.6" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse cx="35" cy="70" rx="14" ry="3" fill="url(#kratosGroundShadow)" />

      {/* Chains */}
      <path d="M35,42 Q28,48 22,44" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />
      <path d="M35,42 Q42,48 48,44" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />

      {/* Torso */}
      <path d="M29,26 Q26,29 27,36 L30,42 L40,42 L43,36 Q44,29 41,26 L38,24 L35,23 L32,24 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
      <path d="M33,26 Q31,32 32,40" stroke={K.tattoo} strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="29" y="40" width="12" height="3" rx="1" fill={K.belt} />
      <circle cx="35" cy="41.5" r="1.5" fill={K.gold} />

      {/* Left leg */}
      <path d="M31,46 Q26,52 25,60 Q25,68 27,72 L31,72 Q32,68 32,60 Q33,52 33,46 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
      <ellipse cx="29" cy="73" rx="3.5" ry="2" fill={K.beard} />

      {/* Right leg */}
      <path d="M37,46 Q42,52 43,60 Q43,68 41,72 L37,72 Q36,68 36,60 Q35,52 35,46 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
      <ellipse cx="39" cy="73" rx="3.5" ry="2" fill={K.beard} />

      {/* Skirt */}
      <path d="M28,43 L25,54 L30,55 L33,53 L35,55 L37,53 L40,55 L45,54 L42,43 Z" fill={K.skirt} stroke={K.skirtDark} strokeWidth="0.5" />

      {/* Left arm + RED blade */}
      <ellipse cx="27" cy="27" rx="3.5" ry="3" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
      <path d="M25,28 Q22,34 20,42 L24,44 Q26,36 27,30 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
      <ellipse cx="22" cy="44" rx="3" ry="2.5" fill={K.skin} />
      <path d="M19,44 L12,58 Q9,62 12,64 L22,50 Z" fill={K.bladeRed} stroke={K.bladeRedGlow} strokeWidth="1.5" filter="url(#redGlow)" />

      {/* Right arm + BLUE blade */}
      <ellipse cx="43" cy="27" rx="3.5" ry="3" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
      <path d="M45,28 Q48,34 50,42 L46,44 Q44,36 43,30 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
      <ellipse cx="48" cy="44" rx="3" ry="2.5" fill={K.skin} />
      <path d="M51,44 L58,58 Q61,62 58,64 L48,50 Z" fill={K.bladeBlue} stroke={K.bladeBlueGlow} strokeWidth="1.5" filter="url(#blueGlow)" />

      {/* Head - front facing */}
      <ellipse cx="35" cy="14" rx="8" ry="9" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
      <path d="M27,10 Q29,3 35,2 Q41,3 43,10 Q41,6 35,5 Q29,6 27,10 Z" fill={K.hair} />
      <path d="M32,6 Q30,10 31,14 Q31,18 32,22" stroke={K.tattoo} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="32" cy="12" rx="2" ry="1.5" fill="white" />
      <ellipse cx="38" cy="12" rx="2" ry="1.5" fill="white" />
      <circle cx="32.5" cy="12" r="1" fill={K.eye} />
      <circle cx="38.5" cy="12" r="1" fill={K.eye} />
      <path d="M29,9 L34,10.5" stroke={K.beard} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M41,9 L36,10.5" stroke={K.beard} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M32,17 Q32,22 35,24 Q38,22 38,17 Z" fill={K.beard} />
    </svg>
  )
})

// ============================================================================
// CHAIN PULL REVEAL - Animation sequence
// ============================================================================

interface KratosChainPullRevealProps {
  children: React.ReactNode
  triggered: boolean
  className?: string
}

import { useState, useEffect, useRef } from 'react'

type Phase = 'waiting' | 'running' | 'pulling' | 'done'

export const KratosChainPullReveal = memo(function KratosChainPullReveal({
  children,
  triggered,
  className = '',
}: KratosChainPullRevealProps) {
  const [phase, setPhase] = useState<Phase>('waiting')
  const [kratosX, setKratosX] = useState(-500)
  const [contentX, setContentX] = useState(-350)
  const didAnimate = useRef(false)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!triggered || didAnimate.current) return
    didAnimate.current = true

    setPhase('running')
    const runStart = performance.now()
    const runDuration = 900

    const animateRun = (now: number) => {
      const elapsed = now - runStart
      const progress = Math.min(elapsed / runDuration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setKratosX(-500 + 300 * eased)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animateRun)
      }
    }
    rafRef.current = requestAnimationFrame(animateRun)

    const t1 = setTimeout(() => {
      setPhase('pulling')
      const pullStart = performance.now()
      const pullDuration = 600

      const animatePull = (now: number) => {
        const elapsed = now - pullStart
        const progress = Math.min(elapsed / pullDuration, 1)
        const eased = 1 - Math.pow(1 - progress, 2)
        setContentX(-350 + 350 * eased)
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animatePull)
        }
      }
      rafRef.current = requestAnimationFrame(animatePull)
    }, 950)

    const t2 = setTimeout(() => setPhase('done'), 1600)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [triggered])

  return (
    <div className={`relative ${className}`}>
      <div
        className="absolute z-30 pointer-events-none"
        style={{
          right: kratosX,
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: phase !== 'waiting' ? 1 : 0,
        }}
      >
        <KratosCharacter
          scale={2}
          animation={phase === 'running' ? 'running' : phase === 'pulling' || phase === 'done' ? 'attackIdle' : 'idle'}
          facingDirection="left"
        />
      </div>

      <div
        style={{
          opacity: phase === 'waiting' ? 0 : 1,
          transform: `translateX(${contentX}px)`,
        }}
      >
        {children}
      </div>
    </div>
  )
})
