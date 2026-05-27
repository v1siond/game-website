'use client'

import { memo, useState, useEffect, useRef } from 'react'

/**
 * KRATOS SVG CHARACTER
 * ====================
 * Hand-drawn SVG based on God of War character design:
 * - Ash-white/grey skin
 * - Red tattoo stripe on left side
 * - Bald head, goatee beard
 * - Muscular shirtless body
 * - Red battle skirt/loincloth
 *
 * Animation: CSS keyframes (Pattern 4 from memory)
 * - Legs alternate forward/back
 * - Arms swing opposite to legs
 * - Body bobs slightly
 *
 * References:
 * - ArtStation pixel sprite studies
 * - KnightCharacter.tsx pattern from DarkFantasy theme
 */

const KRATOS = {
  skin: '#c4b8a8',        // Ash-white skin
  skinShadow: '#9a9080',  // Skin shadow
  tattoo: '#8b1a1a',      // Red tattoo
  beard: '#3a2a1a',       // Dark beard
  skirt: '#8b1a1a',       // Red battle skirt
  skirtDark: '#5a0a0a',   // Skirt shadow
  belt: '#6b5a3a',        // Leather belt
  gold: '#c9a227',        // Gold accents
  eye: '#2a1a0a',         // Dark eye
  eyeGlow: '#ff4400',     // Angry eye glow
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
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
          }
          @keyframes kratosLeftLeg {
            0%, 100% { transform: rotate(-25deg); }
            50% { transform: rotate(25deg); }
          }
          @keyframes kratosRightLeg {
            0%, 100% { transform: rotate(25deg); }
            50% { transform: rotate(-25deg); }
          }
          @keyframes kratosLeftArm {
            0%, 100% { transform: rotate(30deg); }
            50% { transform: rotate(-30deg); }
          }
          @keyframes kratosRightArm {
            0%, 100% { transform: rotate(-30deg); }
            50% { transform: rotate(30deg); }
          }
        `}</style>
      )}
      <svg
        width={60 * scale}
        height={90 * scale}
        viewBox="0 0 60 90"
        className={className}
        style={{
          overflow: 'visible',
          transform: isLeft ? 'scaleX(-1)' : 'none',
        }}
      >
        {/* Body group with bob animation */}
        <g style={{
          animation: running ? 'kratosBodyBob 0.3s ease-in-out infinite' : undefined,
        }}>

          {/* === LEFT LEG (back leg when running) === */}
          <g style={{
            transformOrigin: '25px 55px',
            animation: running ? 'kratosLeftLeg 0.3s ease-in-out infinite' : undefined,
          }}>
            {/* Thigh */}
            <path
              d="M22,55 L20,68 L26,68 L28,55 Z"
              fill={KRATOS.skin}
              stroke={KRATOS.skinShadow}
              strokeWidth="0.5"
            />
            {/* Lower leg */}
            <path
              d="M20,68 L18,82 L24,82 L26,68 Z"
              fill={KRATOS.skin}
              stroke={KRATOS.skinShadow}
              strokeWidth="0.5"
            />
            {/* Foot */}
            <ellipse cx="21" cy="84" rx="5" ry="3" fill={KRATOS.beard} />
          </g>

          {/* === RIGHT LEG (front leg when running) === */}
          <g style={{
            transformOrigin: '35px 55px',
            animation: running ? 'kratosRightLeg 0.3s ease-in-out infinite' : undefined,
          }}>
            {/* Thigh */}
            <path
              d="M32,55 L30,68 L36,68 L38,55 Z"
              fill={KRATOS.skin}
              stroke={KRATOS.skinShadow}
              strokeWidth="0.5"
            />
            {/* Lower leg */}
            <path
              d="M30,68 L28,82 L34,82 L36,68 Z"
              fill={KRATOS.skin}
              stroke={KRATOS.skinShadow}
              strokeWidth="0.5"
            />
            {/* Foot */}
            <ellipse cx="31" cy="84" rx="5" ry="3" fill={KRATOS.beard} />
          </g>

          {/* === BATTLE SKIRT === */}
          <path
            d="M18,48
               L15,60 L20,62 L25,58 L30,62 L35,58 L40,62 L45,60
               L42,48 Z"
            fill={KRATOS.skirt}
            stroke={KRATOS.skirtDark}
            strokeWidth="1"
          />
          {/* Skirt folds */}
          <path d="M25,50 L24,58" stroke={KRATOS.skirtDark} strokeWidth="1" opacity="0.6" />
          <path d="M35,50 L36,58" stroke={KRATOS.skirtDark} strokeWidth="1" opacity="0.6" />

          {/* === TORSO === */}
          <path
            d="M20,25
               C15,28 14,35 16,45
               L18,48 L42,48 L44,45
               C46,35 45,28 40,25
               Z"
            fill={KRATOS.skin}
            stroke={KRATOS.skinShadow}
            strokeWidth="0.5"
          />

          {/* Chest definition */}
          <path
            d="M22,30 C25,32 28,32 30,30 C32,32 35,32 38,30"
            stroke={KRATOS.skinShadow}
            strokeWidth="1"
            fill="none"
            opacity="0.5"
          />
          {/* Abs */}
          <path d="M30,35 L30,45" stroke={KRATOS.skinShadow} strokeWidth="0.8" opacity="0.4" />
          <path d="M26,38 L34,38" stroke={KRATOS.skinShadow} strokeWidth="0.6" opacity="0.3" />
          <path d="M26,42 L34,42" stroke={KRATOS.skinShadow} strokeWidth="0.6" opacity="0.3" />

          {/* RED TATTOO - left side of body */}
          <path
            d="M30,26 C28,30 27,38 28,46"
            stroke={KRATOS.tattoo}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Belt */}
          <rect x="17" y="46" width="26" height="4" rx="1" fill={KRATOS.belt} />
          <circle cx="30" cy="48" r="2" fill={KRATOS.gold} />

          {/* === LEFT ARM === */}
          <g style={{
            transformOrigin: '18px 28px',
            animation: running ? 'kratosLeftArm 0.3s ease-in-out infinite' : undefined,
          }}>
            {/* Upper arm */}
            <path
              d="M14,28 C10,30 8,35 10,42 L16,42 C18,36 18,32 16,28 Z"
              fill={KRATOS.skin}
              stroke={KRATOS.skinShadow}
              strokeWidth="0.5"
            />
            {/* Forearm */}
            <path
              d="M10,42 L6,52 L12,54 L16,42 Z"
              fill={KRATOS.skin}
              stroke={KRATOS.skinShadow}
              strokeWidth="0.5"
            />
            {/* Fist */}
            <circle cx="9" cy="54" r="4" fill={KRATOS.skin} stroke={KRATOS.skinShadow} strokeWidth="0.5" />
          </g>

          {/* === RIGHT ARM === */}
          <g style={{
            transformOrigin: '42px 28px',
            animation: running ? 'kratosRightArm 0.3s ease-in-out infinite' : undefined,
          }}>
            {/* Upper arm */}
            <path
              d="M46,28 C50,30 52,35 50,42 L44,42 C42,36 42,32 44,28 Z"
              fill={KRATOS.skin}
              stroke={KRATOS.skinShadow}
              strokeWidth="0.5"
            />
            {/* Forearm */}
            <path
              d="M50,42 L54,52 L48,54 L44,42 Z"
              fill={KRATOS.skin}
              stroke={KRATOS.skinShadow}
              strokeWidth="0.5"
            />
            {/* Fist */}
            <circle cx="51" cy="54" r="4" fill={KRATOS.skin} stroke={KRATOS.skinShadow} strokeWidth="0.5" />
          </g>

          {/* === HEAD === */}
          <ellipse
            cx="30"
            cy="15"
            rx="12"
            ry="14"
            fill={KRATOS.skin}
            stroke={KRATOS.skinShadow}
            strokeWidth="0.5"
          />

          {/* RED TATTOO - on head/face */}
          <path
            d="M28,8 C26,12 26,18 28,24"
            stroke={KRATOS.tattoo}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />

          {/* Eyes */}
          <ellipse cx="25" cy="14" rx="2.5" ry="2" fill="white" />
          <ellipse cx="35" cy="14" rx="2.5" ry="2" fill="white" />
          <circle cx="25" cy="14" r="1.2" fill={KRATOS.eye} />
          <circle cx="35" cy="14" r="1.2" fill={KRATOS.eye} />

          {/* Angry eyebrows */}
          <path d="M22,10 L28,12" stroke={KRATOS.beard} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M38,10 L32,12" stroke={KRATOS.beard} strokeWidth="1.5" strokeLinecap="round" />

          {/* Nose */}
          <path d="M30,14 L29,18 L31,18 Z" fill={KRATOS.skinShadow} opacity="0.5" />

          {/* Beard/goatee */}
          <path
            d="M24,20
               C24,26 28,28 30,28
               C32,28 36,26 36,20
               L34,20 C34,24 32,25 30,25 C28,25 26,24 26,20 Z"
            fill={KRATOS.beard}
          />

          {/* Mouth (angry grimace) */}
          <path d="M26,21 L34,21" stroke={KRATOS.beard} strokeWidth="1" />

        </g>
      </svg>
    </>
  )
})

// =============================================================================
// KRATOS CHAIN PULL REVEAL
// Multi-phase: Kratos runs in → content slides in from top-left
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
  const [kratosX, setKratosX] = useState(200)  // Start off-screen right
  const didAnimate = useRef(false)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!triggered || didAnimate.current) return
    didAnimate.current = true

    // Phase 1: Kratos runs in
    setPhase('kratos-run')

    // Animate Kratos running from right to center
    const startTime = performance.now()
    const runDuration = 1000
    const startX = 200
    const endX = 20

    const animateRun = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / runDuration, 1)
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3)
      setKratosX(startX + (endX - startX) * eased)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animateRun)
      }
    }
    rafRef.current = requestAnimationFrame(animateRun)

    // Phase 2: Content slides in
    const t1 = setTimeout(() => setPhase('content-slide'), 800)

    // Phase 3: Done
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
      {/* Kratos - runs from right side */}
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

      {/* Content with chain-pull animation */}
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
