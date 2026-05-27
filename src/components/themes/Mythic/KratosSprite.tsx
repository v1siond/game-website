'use client'

import { memo, useState, useEffect, useRef } from 'react'

/**
 * KRATOS SVG CHARACTER - Redesigned with proper sprite proportions
 * ================================================================
 * Based on research from:
 * - SLYNYRD Pixelblog human anatomy (6-head model)
 * - AnimeOutline muscular male tutorial
 * - 2D Will Never Die sprite guides
 * - God of War: Betrayal sprite references
 *
 * Proportions (6-head model, 90px total height):
 * - Head: 15px tall, 12px wide
 * - Shoulders: ~36px wide (3x head width for muscular look)
 * - Neck: ~8px wide (2/3 head width)
 * - Torso: V-shape, wide chest tapering to waist
 * - Arms: Thick upper arm (~8px), taper to wrist (~4px)
 * - Legs: Thigh thick (~10px), calf bulge, ankle thin (~4px)
 *
 * Tattoo: Kratos's LEFT side (SVG left x~20 → screen right after scaleX flip)
 */

const KRATOS = {
  skin: '#d4c8b8',        // Ash-white skin (lighter)
  skinLight: '#e8ddd0',   // Highlights
  skinShadow: '#a89880',  // Skin shadow
  tattoo: '#8b1a1a',      // Red tattoo
  beard: '#2a1a0a',       // Dark beard
  skirt: '#8b1a1a',       // Red battle skirt
  skirtDark: '#5a0a0a',   // Skirt shadow
  belt: '#5a4a2a',        // Leather belt
  gold: '#c9a227',        // Gold accents
  eye: '#1a0a00',         // Dark eye
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
            50% { transform: translateY(-2px); }
          }
          @keyframes kratosLeftLeg {
            0%, 100% { transform: rotate(-20deg); }
            50% { transform: rotate(20deg); }
          }
          @keyframes kratosRightLeg {
            0%, 100% { transform: rotate(20deg); }
            50% { transform: rotate(-20deg); }
          }
          @keyframes kratosLeftArm {
            0%, 100% { transform: rotate(25deg); }
            50% { transform: rotate(-25deg); }
          }
          @keyframes kratosRightArm {
            0%, 100% { transform: rotate(-25deg); }
            50% { transform: rotate(25deg); }
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
        {/* Ground shadow */}
        <defs>
          <radialGradient id="kratosShadowGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c9a227" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#8b7319" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#5a4a10" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="30" cy="87" rx="20" ry="5" fill="url(#kratosShadowGradient)" />

        {/* Body group with bob animation */}
        <g style={{
          animation: running ? 'kratosBodyBob 0.3s ease-in-out infinite' : undefined,
        }}>

          {/* === LEGS === */}
          {/* Left leg (back when running) */}
          <g style={{
            transformOrigin: '24px 52px',
            animation: running ? 'kratosLeftLeg 0.3s ease-in-out infinite' : undefined,
          }}>
            {/* Thigh - muscular curve */}
            <path
              d="M21,52 Q18,56 19,62 Q20,66 23,66 L27,66 Q29,66 29,62 Q30,56 27,52 Z"
              fill={KRATOS.skin}
              stroke={KRATOS.skinShadow}
              strokeWidth="0.5"
            />
            {/* Calf - proper muscle bulge on back */}
            <path
              d="M20,66 Q17,70 18,76 Q19,82 22,83 L26,83 Q28,82 28,76 Q29,70 26,66 Z"
              fill={KRATOS.skin}
              stroke={KRATOS.skinShadow}
              strokeWidth="0.5"
            />
            {/* Foot */}
            <ellipse cx="24" cy="85" rx="5" ry="2" fill={KRATOS.beard} />
          </g>

          {/* Right leg (front when running) */}
          <g style={{
            transformOrigin: '36px 52px',
            animation: running ? 'kratosRightLeg 0.3s ease-in-out infinite' : undefined,
          }}>
            {/* Thigh */}
            <path
              d="M33,52 Q30,56 31,62 Q32,66 35,66 L39,66 Q41,66 41,62 Q42,56 39,52 Z"
              fill={KRATOS.skin}
              stroke={KRATOS.skinShadow}
              strokeWidth="0.5"
            />
            {/* Calf */}
            <path
              d="M32,66 Q29,70 30,76 Q31,82 34,83 L38,83 Q40,82 40,76 Q41,70 38,66 Z"
              fill={KRATOS.skin}
              stroke={KRATOS.skinShadow}
              strokeWidth="0.5"
            />
            {/* Foot */}
            <ellipse cx="36" cy="85" rx="5" ry="2" fill={KRATOS.beard} />
          </g>

          {/* === BATTLE SKIRT === */}
          <path
            d="M17,48 L14,58 L19,60 L24,56 L30,60 L36,56 L41,60 L46,58 L43,48 Z"
            fill={KRATOS.skirt}
            stroke={KRATOS.skirtDark}
            strokeWidth="0.5"
          />
          {/* Skirt folds/shadows */}
          <path d="M24,50 L23,56" stroke={KRATOS.skirtDark} strokeWidth="0.8" opacity="0.5" />
          <path d="M30,50 L30,58" stroke={KRATOS.skirtDark} strokeWidth="0.8" opacity="0.5" />
          <path d="M36,50 L37,56" stroke={KRATOS.skirtDark} strokeWidth="0.8" opacity="0.5" />

          {/* === TORSO - V-shape muscular === */}
          <path
            d="M14,26
               Q10,30 12,40 L16,48 L44,48 L48,40
               Q50,30 46,26
               L40,24 L30,22 L20,24 Z"
            fill={KRATOS.skin}
            stroke={KRATOS.skinShadow}
            strokeWidth="0.5"
          />

          {/* Chest muscles (pectorals) */}
          <path
            d="M18,28 Q22,32 26,30 Q28,29 30,30 Q32,29 34,30 Q38,32 42,28"
            stroke={KRATOS.skinShadow}
            strokeWidth="1"
            fill="none"
            opacity="0.4"
          />
          {/* Center chest line */}
          <path d="M30,30 L30,46" stroke={KRATOS.skinShadow} strokeWidth="0.5" opacity="0.3" />
          {/* Abs - 6 pack definition */}
          <path d="M25,36 L35,36" stroke={KRATOS.skinShadow} strokeWidth="0.5" opacity="0.25" />
          <path d="M24,40 L36,40" stroke={KRATOS.skinShadow} strokeWidth="0.5" opacity="0.25" />
          <path d="M24,44 L36,44" stroke={KRATOS.skinShadow} strokeWidth="0.5" opacity="0.25" />

          {/* RED TATTOO on body - aligned with head tattoo */}
          <path
            d="M23,26 Q21,34 21,42 Q21,46 22,48"
            stroke={KRATOS.tattoo}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Belt */}
          <rect x="15" y="46" width="30" height="3" rx="1" fill={KRATOS.belt} />
          <circle cx="30" cy="47.5" r="2" fill={KRATOS.gold} />

          {/* === LEFT ARM === */}
          <g style={{
            transformOrigin: '14px 26px',
            animation: running ? 'kratosLeftArm 0.3s ease-in-out infinite' : undefined,
          }}>
            {/* Shoulder/Deltoid */}
            <ellipse cx="12" cy="27" rx="5" ry="4" fill={KRATOS.skin} stroke={KRATOS.skinShadow} strokeWidth="0.5" />
            {/* Upper arm - thick bicep */}
            <path
              d="M8,28 Q4,32 5,40 Q6,44 10,44 L14,44 Q17,44 17,40 Q18,32 14,28 Z"
              fill={KRATOS.skin}
              stroke={KRATOS.skinShadow}
              strokeWidth="0.5"
            />
            {/* Forearm - tapers */}
            <path
              d="M7,44 Q4,48 4,54 Q4,56 7,56 L11,56 Q14,56 14,54 Q14,48 11,44 Z"
              fill={KRATOS.skin}
              stroke={KRATOS.skinShadow}
              strokeWidth="0.5"
            />
            {/* Fist */}
            <ellipse cx="9" cy="58" rx="4" ry="3" fill={KRATOS.skin} stroke={KRATOS.skinShadow} strokeWidth="0.5" />
          </g>

          {/* === RIGHT ARM === */}
          <g style={{
            transformOrigin: '46px 26px',
            animation: running ? 'kratosRightArm 0.3s ease-in-out infinite' : undefined,
          }}>
            {/* Shoulder/Deltoid */}
            <ellipse cx="48" cy="27" rx="5" ry="4" fill={KRATOS.skin} stroke={KRATOS.skinShadow} strokeWidth="0.5" />
            {/* Upper arm - thick bicep */}
            <path
              d="M46,28 Q42,32 43,40 Q44,44 46,44 L50,44 Q53,44 53,40 Q54,32 50,28 Z"
              fill={KRATOS.skin}
              stroke={KRATOS.skinShadow}
              strokeWidth="0.5"
            />
            {/* Forearm - tapers */}
            <path
              d="M46,44 Q43,48 43,54 Q43,56 46,56 L50,56 Q53,56 53,54 Q53,48 50,44 Z"
              fill={KRATOS.skin}
              stroke={KRATOS.skinShadow}
              strokeWidth="0.5"
            />
            {/* Fist */}
            <ellipse cx="48" cy="58" rx="4" ry="3" fill={KRATOS.skin} stroke={KRATOS.skinShadow} strokeWidth="0.5" />
          </g>

          {/* === HEAD === */}
          {/* Neck - thick like a muscular warrior */}
          <rect x="26" y="20" width="8" height="6" rx="2" fill={KRATOS.skin} />

          {/* Head shape - slightly wider at jaw */}
          <ellipse cx="30" cy="12" rx="11" ry="12" fill={KRATOS.skin} stroke={KRATOS.skinShadow} strokeWidth="0.5" />

          {/* RED TATTOO on head - next to LEFT eye in SVG (x~23), appears next to RIGHT eye on screen after flip */}
          <path
            d="M23,1 Q21,6 22,12 Q22,18 23,22"
            stroke={KRATOS.tattoo}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />

          {/* Eyes - intense stare */}
          <ellipse cx="24" cy="11" rx="3" ry="2" fill="white" />
          <ellipse cx="36" cy="11" rx="3" ry="2" fill="white" />
          <circle cx="24" cy="11" r="1.5" fill={KRATOS.eye} />
          <circle cx="36" cy="11" r="1.5" fill={KRATOS.eye} />

          {/* Angry eyebrows - angled down toward center */}
          <path d="M20,7 L27,9" stroke={KRATOS.beard} strokeWidth="2" strokeLinecap="round" />
          <path d="M40,7 L33,9" stroke={KRATOS.beard} strokeWidth="2" strokeLinecap="round" />

          {/* Nose */}
          <path d="M30,12 L28,16 L32,16 Z" fill={KRATOS.skinShadow} opacity="0.4" />

          {/* Beard/goatee - classic Kratos look */}
          <path
            d="M24,17 Q24,22 27,24 Q30,26 33,24 Q36,22 36,17
               L34,17 Q34,20 32,22 Q30,23 28,22 Q26,20 26,17 Z"
            fill={KRATOS.beard}
          />

          {/* Mouth - grimace */}
          <path d="M27,18 L33,18" stroke="#1a0a00" strokeWidth="0.8" />

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

    // Kratos runs from off-screen right to position
    const startTime = performance.now()
    const runDuration = 1000
    const startX = -600  // Far off-screen right
    const endX = -180    // Final position between content and screen edge

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
      {/* Kratos */}
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

      {/* Content */}
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
