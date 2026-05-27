'use client'

import { memo, useState, useEffect, useRef } from 'react'

/**
 * KRATOS SVG CHARACTER - Based on God of War: Betrayal sprite sheet
 * =================================================================
 * Reference: spritedatabase.net/file/7048
 *
 * Key features from reference:
 * - Dynamic running/attack pose (body leaning forward)
 * - Blades of Chaos - curved blades on chains
 * - Arms extended in attack position
 * - Compact proportions (~5 heads tall)
 * - Red loincloth/skirt flowing with movement
 */

const KRATOS = {
  skin: '#d4c8b8',
  skinShadow: '#a89880',
  tattoo: '#8b1a1a',
  beard: '#2a1a0a',
  skirt: '#8b1a1a',
  skirtDark: '#5a0a0a',
  belt: '#5a4a2a',
  gold: '#c9a227',
  blade: '#d4a030',
  bladeDark: '#8a6a10',
  chain: '#7a7a7a',
  eye: '#1a0a00',
}

interface KratosCharacterProps {
  scale?: number
  running?: boolean
  facingDirection?: 'left' | 'right'
  className?: string
}

export const KratosCharacter = memo(function KratosCharacter({
  scale = 1,
  running = false,
  facingDirection = 'left',
  className = '',
}: KratosCharacterProps) {
  const isLeft = facingDirection === 'left'

  return (
    <>
      {running && (
        <style>{`
          @keyframes kratosBodyBob {
            0%, 100% { transform: translateY(0) rotate(-5deg); }
            50% { transform: translateY(-2px) rotate(-5deg); }
          }
          @keyframes kratosBackLeg {
            0%, 100% { transform: rotate(-35deg); }
            50% { transform: rotate(15deg); }
          }
          @keyframes kratosFrontLeg {
            0%, 100% { transform: rotate(35deg); }
            50% { transform: rotate(-15deg); }
          }
          @keyframes kratosBackArm {
            0%, 100% { transform: rotate(40deg); }
            50% { transform: rotate(-20deg); }
          }
          @keyframes kratosFrontArm {
            0%, 100% { transform: rotate(-50deg); }
            50% { transform: rotate(10deg); }
          }
          @keyframes bladeSwing {
            0%, 100% { transform: rotate(-10deg); }
            50% { transform: rotate(10deg); }
          }
        `}</style>
      )}
      <svg
        width={80 * scale}
        height={90 * scale}
        viewBox="0 0 80 90"
        className={className}
        style={{
          overflow: 'visible',
          transform: isLeft ? 'scaleX(-1)' : 'none',
        }}
      >
        {/* Ground shadow */}
        <defs>
          <radialGradient id="kratosShadowGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c9a227" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#8b7319" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#5a4a10" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="40" cy="87" rx="18" ry="4" fill="url(#kratosShadowGradient)" />

        {/* Main body group - tilted forward for running pose */}
        <g style={{
          transformOrigin: '40px 50px',
          animation: running ? 'kratosBodyBob 0.25s ease-in-out infinite' : undefined,
          transform: running ? undefined : 'rotate(-5deg)',
        }}>

          {/* === BACK BLADE OF CHAOS (behind body) === */}
          <g style={{
            transformOrigin: '55px 35px',
            animation: running ? 'bladeSwing 0.25s ease-in-out infinite' : undefined,
          }}>
            {/* Chain */}
            <path
              d="M52,38 Q60,32 70,28 Q78,25 85,20"
              stroke={KRATOS.chain}
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="2,1"
            />
            {/* Blade - curved like in sprite */}
            <path
              d="M82,22 Q88,18 92,12 Q94,8 90,6 Q86,8 84,14 Q80,20 82,22 Z"
              fill={KRATOS.blade}
              stroke={KRATOS.bladeDark}
              strokeWidth="0.5"
            />
          </g>

          {/* === BACK LEG === */}
          <g style={{
            transformOrigin: '35px 52px',
            animation: running ? 'kratosBackLeg 0.25s ease-in-out infinite' : undefined,
          }}>
            <path
              d="M32,52 Q29,58 30,65 Q31,70 34,70 L38,70 Q40,70 40,65 Q41,58 38,52 Z"
              fill={KRATOS.skin}
              stroke={KRATOS.skinShadow}
              strokeWidth="0.5"
            />
            <path
              d="M31,70 Q28,76 29,82 L33,84 L37,84 L38,82 Q39,76 36,70 Z"
              fill={KRATOS.skin}
              stroke={KRATOS.skinShadow}
              strokeWidth="0.5"
            />
            <ellipse cx="33" cy="85" rx="4" ry="2" fill={KRATOS.beard} />
          </g>

          {/* === FRONT LEG === */}
          <g style={{
            transformOrigin: '45px 52px',
            animation: running ? 'kratosFrontLeg 0.25s ease-in-out infinite' : undefined,
          }}>
            <path
              d="M42,52 Q39,58 40,65 Q41,70 44,70 L48,70 Q50,70 50,65 Q51,58 48,52 Z"
              fill={KRATOS.skin}
              stroke={KRATOS.skinShadow}
              strokeWidth="0.5"
            />
            <path
              d="M41,70 Q38,76 39,82 L43,84 L47,84 L48,82 Q49,76 46,70 Z"
              fill={KRATOS.skin}
              stroke={KRATOS.skinShadow}
              strokeWidth="0.5"
            />
            <ellipse cx="44" cy="85" rx="4" ry="2" fill={KRATOS.beard} />
          </g>

          {/* === BATTLE SKIRT - flowing back === */}
          <path
            d="M30,48 L26,60 L31,62 L36,58 L40,62 L44,58 L49,62 L54,60 L50,48 Z"
            fill={KRATOS.skirt}
            stroke={KRATOS.skirtDark}
            strokeWidth="0.5"
          />
          <path d="M36,50 L34,58" stroke={KRATOS.skirtDark} strokeWidth="0.6" opacity="0.5" />
          <path d="M44,50 L46,58" stroke={KRATOS.skirtDark} strokeWidth="0.6" opacity="0.5" />

          {/* === TORSO - leaning forward === */}
          <path
            d="M28,28
               Q24,32 26,42 L29,48 L51,48 L54,42
               Q56,32 52,28
               L46,26 L40,25 L34,26 Z"
            fill={KRATOS.skin}
            stroke={KRATOS.skinShadow}
            strokeWidth="0.5"
          />

          {/* Chest definition */}
          <path
            d="M30,30 Q34,33 37,31 Q40,30 43,31 Q46,33 50,30"
            stroke={KRATOS.skinShadow}
            strokeWidth="0.7"
            fill="none"
            opacity="0.4"
          />
          <path d="M40,32 L40,46" stroke={KRATOS.skinShadow} strokeWidth="0.4" opacity="0.3" />
          <path d="M35,37 L45,37" stroke={KRATOS.skinShadow} strokeWidth="0.4" opacity="0.2" />
          <path d="M34,41 L46,41" stroke={KRATOS.skinShadow} strokeWidth="0.4" opacity="0.2" />

          {/* RED TATTOO on body */}
          <path
            d="M33,28 Q31,36 31,44 Q31,47 32,48"
            stroke={KRATOS.tattoo}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Belt */}
          <rect x="28" y="46" width="24" height="3" rx="1" fill={KRATOS.belt} />
          <circle cx="40" cy="47.5" r="1.5" fill={KRATOS.gold} />

          {/* === BACK ARM (raised back with blade) === */}
          <g style={{
            transformOrigin: '52px 28px',
            animation: running ? 'kratosBackArm 0.25s ease-in-out infinite' : undefined,
          }}>
            <ellipse cx="53" cy="28" rx="3" ry="2.5" fill={KRATOS.skin} stroke={KRATOS.skinShadow} strokeWidth="0.5" />
            <path
              d="M51,29 Q48,33 49,38 L53,38 Q55,33 53,29 Z"
              fill={KRATOS.skin}
              stroke={KRATOS.skinShadow}
              strokeWidth="0.5"
            />
            <path
              d="M49,38 Q47,42 48,47 L52,47 Q53,42 51,38 Z"
              fill={KRATOS.skin}
              stroke={KRATOS.skinShadow}
              strokeWidth="0.5"
            />
            <ellipse cx="50" cy="49" rx="2.5" ry="2" fill={KRATOS.skin} stroke={KRATOS.skinShadow} strokeWidth="0.5" />
          </g>

          {/* === FRONT ARM (extended forward with blade) === */}
          <g style={{
            transformOrigin: '28px 28px',
            animation: running ? 'kratosFrontArm 0.25s ease-in-out infinite' : undefined,
          }}>
            <ellipse cx="27" cy="28" rx="3" ry="2.5" fill={KRATOS.skin} stroke={KRATOS.skinShadow} strokeWidth="0.5" />
            <path
              d="M25,29 Q22,33 23,38 L27,38 Q29,33 27,29 Z"
              fill={KRATOS.skin}
              stroke={KRATOS.skinShadow}
              strokeWidth="0.5"
            />
            <path
              d="M22,38 Q19,42 20,47 L24,47 Q26,42 24,38 Z"
              fill={KRATOS.skin}
              stroke={KRATOS.skinShadow}
              strokeWidth="0.5"
            />
            <ellipse cx="22" cy="49" rx="2.5" ry="2" fill={KRATOS.skin} stroke={KRATOS.skinShadow} strokeWidth="0.5" />
          </g>

          {/* === FRONT BLADE OF CHAOS === */}
          <g style={{
            transformOrigin: '22px 49px',
            animation: running ? 'bladeSwing 0.25s ease-in-out infinite reverse' : undefined,
          }}>
            {/* Chain */}
            <path
              d="M22,49 Q14,45 6,48 Q-2,52 -10,55"
              stroke={KRATOS.chain}
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="2,1"
            />
            {/* Blade */}
            <path
              d="M-8,54 Q-14,52 -20,56 Q-24,60 -20,62 Q-16,60 -12,56 Q-6,52 -8,54 Z"
              fill={KRATOS.blade}
              stroke={KRATOS.bladeDark}
              strokeWidth="0.5"
            />
          </g>

          {/* === HEAD === */}
          <rect x="36" y="22" width="8" height="5" rx="2" fill={KRATOS.skin} />
          <ellipse cx="40" cy="14" rx="10" ry="11" fill={KRATOS.skin} stroke={KRATOS.skinShadow} strokeWidth="0.5" />

          {/* RED TATTOO on head */}
          <path
            d="M32,4 Q30,8 31,14 Q31,20 32,24"
            stroke={KRATOS.tattoo}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Eyes - fierce stare */}
          <ellipse cx="35" cy="12" rx="2.5" ry="1.8" fill="white" />
          <ellipse cx="45" cy="12" rx="2.5" ry="1.8" fill="white" />
          <circle cx="36" cy="12" r="1.2" fill={KRATOS.eye} />
          <circle cx="46" cy="12" r="1.2" fill={KRATOS.eye} />

          {/* Angry eyebrows */}
          <path d="M32,8 L37,10" stroke={KRATOS.beard} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M48,8 L43,10" stroke={KRATOS.beard} strokeWidth="1.8" strokeLinecap="round" />

          {/* Nose */}
          <path d="M40,13 L38,17 L42,17 Z" fill={KRATOS.skinShadow} opacity="0.4" />

          {/* Beard */}
          <path
            d="M35,18 Q35,22 38,24 Q40,25 42,24 Q45,22 45,18
               L43,18 Q43,21 41,22 Q40,22.5 39,22 Q37,21 37,18 Z"
            fill={KRATOS.beard}
          />

          {/* Mouth - battle cry */}
          <path d="M37,19 Q40,21 43,19" stroke="#1a0a00" strokeWidth="0.8" fill="none" />

        </g>
      </svg>
    </>
  )
})

// =============================================================================
// KRATOS CHAIN PULL REVEAL
// =============================================================================

interface KratosChainPullRevealProps {
  children: React.ReactNode
  triggered: boolean
  className?: string
}

type Phase = 'waiting' | 'kratos-run' | 'content-slide' | 'done'

export const KratosChainPullReveal = memo(function KratosChainPullReveal({
  children,
  triggered,
  className = '',
}: KratosChainPullRevealProps) {
  const [phase, setPhase] = useState<Phase>('waiting')
  const [kratosX, setKratosX] = useState(-600)
  const didAnimate = useRef(false)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!triggered || didAnimate.current) return
    didAnimate.current = true

    setPhase('kratos-run')

    const startTime = performance.now()
    const runDuration = 1000
    const startX = -600
    const endX = -180

    const animateRun = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / runDuration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setKratosX(startX + (endX - startX) * eased)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animateRun)
      }
    }
    rafRef.current = requestAnimationFrame(animateRun)

    const t1 = setTimeout(() => setPhase('content-slide'), 800)
    const t2 = setTimeout(() => setPhase('done'), 2200)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [triggered])

  const isKratosVisible = phase !== 'waiting'
  const isKratosRunning = phase === 'kratos-run'
  const isContentVisible = phase === 'content-slide' || phase === 'done'

  return (
    <div className={`relative ${className}`}>
      <div
        className="absolute z-30 pointer-events-none"
        style={{
          right: kratosX,
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: isKratosVisible ? 1 : 0,
          transition: isKratosVisible ? 'none' : 'opacity 0.2s',
        }}
      >
        <KratosCharacter
          scale={2}
          running={isKratosRunning}
          facingDirection="left"
        />
      </div>

      <div
        style={{
          opacity: isContentVisible ? 1 : 0,
          transform: isContentVisible
            ? 'translate(0, 0) rotate(0deg)'
            : 'translate(-300px, -150px) rotate(-10deg)',
          transition: isContentVisible
            ? 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease-out'
            : 'none',
          willChange: 'transform, opacity',
        }}
      >
        {children}
      </div>
    </div>
  )
})
