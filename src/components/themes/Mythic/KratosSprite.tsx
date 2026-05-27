'use client'

import { memo, useState, useEffect, useRef } from 'react'

/**
 * KRATOS SPRITE SYSTEM
 * ====================
 * 3-frame run cycle + idle pose
 * Simple SVG drawings, frame-based animation
 */

const K = {
  skin: '#d4c8b8',
  skinShadow: '#a89880',
  tattoo: '#8b1a1a',
  beard: '#2a1a0a',
  skirt: '#8b1a1a',
  skirtDark: '#5a0a0a',
  belt: '#5a4a2a',
  gold: '#c9a227',
  // Blades of Chaos - red and blue
  bladeRed: '#cc3333',
  bladeRedDark: '#881111',
  bladeRedGlow: '#ff6666',
  bladeBlue: '#3366cc',
  bladeBlueDark: '#112288',
  bladeBlueGlow: '#6699ff',
  chain: '#8a8a8a',
  chainDark: '#5a5a5a',
  eye: '#1a0a00',
}

// ============================================================================
// FRAME 1: Contact Right - right leg forward, left blade forward
// ============================================================================
const KratosRunFrame1 = memo(function KratosRunFrame1() {
  return (
    <g>
      {/* Chains from back to blades */}
      <path d="M35,42 Q40,44 50,41" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />
      <path d="M35,42 Q30,44 20,41" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />

      {/* Torso - smaller, leaning forward */}
      <g transform="rotate(-10, 35, 38)">
        <path
          d="M29,26 Q26,29 27,36 L30,42 L40,42 L43,36 Q44,29 41,26 L38,24 L35,23 L32,24 Z"
          fill={K.skin}
          stroke={K.skinShadow}
          strokeWidth="0.5"
        />
        <path d="M31,29 Q33,31 35,29 Q37,31 39,29" stroke={K.skinShadow} strokeWidth="0.5" fill="none" opacity="0.4" />
        <path d="M35,30 L35,40" stroke={K.skinShadow} strokeWidth="0.4" opacity="0.3" />
        <path d="M33,26 Q31,32 32,40" stroke={K.tattoo} strokeWidth="2" fill="none" strokeLinecap="round" />
        <rect x="29" y="40" width="12" height="3" rx="1" fill={K.belt} />
        <circle cx="35" cy="41.5" r="1.5" fill={K.gold} />
      </g>

      {/* Back leg - extended back - thinner, longer */}
      <g>
        <path d="M37,46 Q42,50 48,58 Q52,66 50,72 L46,72 Q46,66 42,58 Q38,52 36,46 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="48" cy="73" rx="3.5" ry="2" fill={K.beard} />
      </g>

      {/* Front leg - extended forward - thinner, longer */}
      <g>
        <path d="M33,46 Q28,50 22,58 Q18,66 20,72 L24,72 Q24,66 28,58 Q32,52 34,46 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="22" cy="73" rx="3.5" ry="2" fill={K.beard} />
      </g>

      {/* Skirt */}
      <path
        d="M27,43 L23,54 L28,55 L32,52 L35,55 L38,52 L42,55 L47,54 L43,43 Z"
        fill={K.skirt}
        stroke={K.skirtDark}
        strokeWidth="0.5"
      />

      {/* Back arm + BLUE blade - more muscular */}
      <g>
        <ellipse cx="42" cy="27" rx="3.5" ry="3" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <path d="M43,28 Q48,34 51,40 L47,42 Q45,36 42,30 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="49" cy="42" rx="3" ry="2.5" fill={K.skin} />
        <path d="M51,42 L62,52 Q67,56 64,58 L53,47 Z" fill={K.bladeBlue} stroke={K.bladeBlueGlow} strokeWidth="1.5" filter="url(#blueGlow)" />
      </g>

      {/* Front arm + RED blade - more muscular */}
      <g>
        <ellipse cx="28" cy="27" rx="3.5" ry="3" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <path d="M27,28 Q22,34 19,40 L23,42 Q25,36 28,30 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="21" cy="42" rx="3" ry="2.5" fill={K.skin} />
        <path d="M19,42 L8,52 Q3,56 6,58 L17,47 Z" fill={K.bladeRed} stroke={K.bladeRedGlow} strokeWidth="1.5" filter="url(#redGlow)" />
      </g>

      {/* Head - SIDE PROFILE for running */}
      <g transform="translate(0, -2)">
        <ellipse cx="35" cy="14" rx="7" ry="8" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        {/* Tattoo on visible side */}
        <path d="M30,6 Q28,10 29,14 Q29,18 30,21" stroke={K.tattoo} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Single eye visible (side view) */}
        <ellipse cx="31" cy="12" rx="2" ry="1.5" fill="white" />
        <circle cx="30.5" cy="12" r="1" fill={K.eye} />
        {/* Eyebrow */}
        <path d="M28,9 L33,10" stroke={K.beard} strokeWidth="1.5" strokeLinecap="round" />
        {/* Beard profile */}
        <path d="M32,17 Q30,20 32,23 Q35,21 35,17 Z" fill={K.beard} />
        {/* Nose hint */}
        <path d="M29,13 L28,15" stroke={K.skinShadow} strokeWidth="0.5" />
      </g>
    </g>
  )
})

// ============================================================================
// FRAME 2: Mid-Stride - legs together, blades at sides
// ============================================================================
const KratosRunFrame2 = memo(function KratosRunFrame2() {
  return (
    <g>
      {/* Chains from back to blades */}
      <path d="M35,42 Q42,46 46,42" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />
      <path d="M35,42 Q28,46 24,42" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />

      {/* Torso - smaller, slight lean */}
      <g transform="rotate(-5, 35, 38)">
        <path
          d="M29,26 Q26,29 27,36 L30,42 L40,42 L43,36 Q44,29 41,26 L38,24 L35,23 L32,24 Z"
          fill={K.skin}
          stroke={K.skinShadow}
          strokeWidth="0.5"
        />
        <path d="M31,29 Q33,31 35,29 Q37,31 39,29" stroke={K.skinShadow} strokeWidth="0.5" fill="none" opacity="0.4" />
        <path d="M35,30 L35,40" stroke={K.skinShadow} strokeWidth="0.4" opacity="0.3" />
        <path d="M33,26 Q31,32 32,40" stroke={K.tattoo} strokeWidth="2" fill="none" strokeLinecap="round" />
        <rect x="29" y="40" width="12" height="3" rx="1" fill={K.belt} />
        <circle cx="35" cy="41.5" r="1.5" fill={K.gold} />
      </g>

      {/* Left leg - passing through - thinner, longer */}
      <g>
        <path d="M31,46 Q27,52 26,60 Q26,68 28,72 L32,72 Q32,68 32,60 Q33,52 33,46 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="30" cy="73" rx="3.5" ry="2" fill={K.beard} />
      </g>

      {/* Right leg - passing through - thinner, longer */}
      <g>
        <path d="M37,46 Q41,52 42,60 Q42,68 40,72 L36,72 Q36,68 36,60 Q35,52 35,46 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="38" cy="73" rx="3.5" ry="2" fill={K.beard} />
      </g>

      {/* Skirt */}
      <path
        d="M28,43 L25,54 L29,55 L32,53 L35,55 L38,53 L41,55 L45,54 L42,43 Z"
        fill={K.skirt}
        stroke={K.skirtDark}
        strokeWidth="0.5"
      />

      {/* Left arm + RED blade - more muscular */}
      <g>
        <ellipse cx="28" cy="27" rx="3.5" ry="3" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <path d="M26,28 Q24,34 22,40 L26,42 Q27,36 28,30 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="24" cy="42" rx="3" ry="2.5" fill={K.skin} />
        <path d="M22,42 L14,56 Q11,60 14,62 L24,48 Z" fill={K.bladeRed} stroke={K.bladeRedGlow} strokeWidth="1.5" filter="url(#redGlow)" />
      </g>

      {/* Right arm + BLUE blade - more muscular */}
      <g>
        <ellipse cx="42" cy="27" rx="3.5" ry="3" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <path d="M44,28 Q46,34 48,40 L44,42 Q43,36 42,30 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="46" cy="42" rx="3" ry="2.5" fill={K.skin} />
        <path d="M48,42 L56,56 Q59,60 56,62 L46,48 Z" fill={K.bladeBlue} stroke={K.bladeBlueGlow} strokeWidth="1.5" filter="url(#blueGlow)" />
      </g>

      {/* Head - SIDE PROFILE for running */}
      <g>
        <ellipse cx="35" cy="14" rx="7" ry="8" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <path d="M30,6 Q28,10 29,14 Q29,18 30,21" stroke={K.tattoo} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <ellipse cx="31" cy="12" rx="2" ry="1.5" fill="white" />
        <circle cx="30.5" cy="12" r="1" fill={K.eye} />
        <path d="M28,9 L33,10" stroke={K.beard} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M32,17 Q30,20 32,23 Q35,21 35,17 Z" fill={K.beard} />
        <path d="M29,13 L28,15" stroke={K.skinShadow} strokeWidth="0.5" />
      </g>
    </g>
  )
})

// ============================================================================
// FRAME 3: Contact Left - left leg forward, right blade forward
// ============================================================================
const KratosRunFrame3 = memo(function KratosRunFrame3() {
  return (
    <g>
      {/* Chains from back to blades */}
      <path d="M35,42 Q30,44 20,41" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />
      <path d="M35,42 Q40,44 50,41" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />

      {/* Torso - smaller, leaning forward */}
      <g transform="rotate(-10, 35, 38)">
        <path
          d="M29,26 Q26,29 27,36 L30,42 L40,42 L43,36 Q44,29 41,26 L38,24 L35,23 L32,24 Z"
          fill={K.skin}
          stroke={K.skinShadow}
          strokeWidth="0.5"
        />
        <path d="M31,29 Q33,31 35,29 Q37,31 39,29" stroke={K.skinShadow} strokeWidth="0.5" fill="none" opacity="0.4" />
        <path d="M35,30 L35,40" stroke={K.skinShadow} strokeWidth="0.4" opacity="0.3" />
        <path d="M33,26 Q31,32 32,40" stroke={K.tattoo} strokeWidth="2" fill="none" strokeLinecap="round" />
        <rect x="29" y="40" width="12" height="3" rx="1" fill={K.belt} />
        <circle cx="35" cy="41.5" r="1.5" fill={K.gold} />
      </g>

      {/* Back leg - extended back - thinner, longer */}
      <g>
        <path d="M33,46 Q28,50 22,58 Q18,66 20,72 L24,72 Q24,66 28,58 Q32,52 34,46 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="22" cy="73" rx="3.5" ry="2" fill={K.beard} />
      </g>

      {/* Front leg - extended forward - thinner, longer */}
      <g>
        <path d="M37,46 Q42,50 48,58 Q52,66 50,72 L46,72 Q46,66 42,58 Q38,52 36,46 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="48" cy="73" rx="3.5" ry="2" fill={K.beard} />
      </g>

      {/* Skirt */}
      <path
        d="M27,43 L23,54 L28,55 L32,52 L35,55 L38,52 L42,55 L47,54 L43,43 Z"
        fill={K.skirt}
        stroke={K.skirtDark}
        strokeWidth="0.5"
      />

      {/* Back arm + RED blade - more muscular */}
      <g>
        <ellipse cx="28" cy="27" rx="3.5" ry="3" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <path d="M27,28 Q22,34 19,40 L23,42 Q25,36 28,30 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="21" cy="42" rx="3" ry="2.5" fill={K.skin} />
        <path d="M19,42 L8,52 Q3,56 6,58 L17,47 Z" fill={K.bladeRed} stroke={K.bladeRedGlow} strokeWidth="1.5" filter="url(#redGlow)" />
      </g>

      {/* Front arm + BLUE blade - more muscular */}
      <g>
        <ellipse cx="42" cy="27" rx="3.5" ry="3" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <path d="M43,28 Q48,34 51,40 L47,42 Q45,36 42,30 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="49" cy="42" rx="3" ry="2.5" fill={K.skin} />
        <path d="M51,42 L62,52 Q67,56 64,58 L53,47 Z" fill={K.bladeBlue} stroke={K.bladeBlueGlow} strokeWidth="1.5" filter="url(#blueGlow)" />
      </g>

      {/* Head - SIDE PROFILE for running */}
      <g transform="translate(0, -2)">
        <ellipse cx="35" cy="14" rx="7" ry="8" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <path d="M30,6 Q28,10 29,14 Q29,18 30,21" stroke={K.tattoo} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <ellipse cx="31" cy="12" rx="2" ry="1.5" fill="white" />
        <circle cx="30.5" cy="12" r="1" fill={K.eye} />
        <path d="M28,9 L33,10" stroke={K.beard} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M32,17 Q30,20 32,23 Q35,21 35,17 Z" fill={K.beard} />
        <path d="M29,13 L28,15" stroke={K.skinShadow} strokeWidth="0.5" />
      </g>
    </g>
  )
})

// ============================================================================
// IDLE FRAME - Standing, breathing
// ============================================================================
const KratosIdle = memo(function KratosIdle() {
  return (
    <g>
      {/* Chains from back to blades */}
      <path d="M35,42 Q28,48 22,44" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />
      <path d="M35,42 Q42,48 48,44" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />

      {/* Torso - smaller */}
      <path
        d="M29,26 Q26,29 27,36 L30,42 L40,42 L43,36 Q44,29 41,26 L38,24 L35,23 L32,24 Z"
        fill={K.skin}
        stroke={K.skinShadow}
        strokeWidth="0.5"
      />
      <path d="M31,29 Q33,31 35,29 Q37,31 39,29" stroke={K.skinShadow} strokeWidth="0.5" fill="none" opacity="0.4" />
      <path d="M35,30 L35,40" stroke={K.skinShadow} strokeWidth="0.4" opacity="0.3" />
      <path d="M33,26 Q31,32 32,40" stroke={K.tattoo} strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="29" y="40" width="12" height="3" rx="1" fill={K.belt} />
      <circle cx="35" cy="41.5" r="1.5" fill={K.gold} />

      {/* Left leg - thinner, longer */}
      <path d="M31,46 Q26,52 25,60 Q25,68 27,72 L31,72 Q32,68 32,60 Q33,52 33,46 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
      <ellipse cx="29" cy="73" rx="3.5" ry="2" fill={K.beard} />

      {/* Right leg - thinner, longer */}
      <path d="M37,46 Q42,52 43,60 Q43,68 41,72 L37,72 Q36,68 36,60 Q35,52 35,46 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
      <ellipse cx="39" cy="73" rx="3.5" ry="2" fill={K.beard} />

      {/* Skirt */}
      <path
        d="M28,43 L25,54 L30,55 L33,53 L35,55 L37,53 L40,55 L45,54 L42,43 Z"
        fill={K.skirt}
        stroke={K.skirtDark}
        strokeWidth="0.5"
      />

      {/* Left arm + RED blade - more muscular */}
      <ellipse cx="27" cy="27" rx="3.5" ry="3" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
      <path d="M25,28 Q22,34 20,42 L24,44 Q26,36 27,30 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
      <ellipse cx="22" cy="44" rx="3" ry="2.5" fill={K.skin} />
      <path d="M19,44 L12,58 Q9,62 12,64 L22,50 Z" fill={K.bladeRed} stroke={K.bladeRedGlow} strokeWidth="1.5" filter="url(#redGlow)" />

      {/* Right arm + BLUE blade - more muscular */}
      <ellipse cx="43" cy="27" rx="3.5" ry="3" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
      <path d="M45,28 Q48,34 50,42 L46,44 Q44,36 43,30 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
      <ellipse cx="48" cy="44" rx="3" ry="2.5" fill={K.skin} />
      <path d="M51,44 L58,58 Q61,62 58,64 L48,50 Z" fill={K.bladeBlue} stroke={K.bladeBlueGlow} strokeWidth="1.5" filter="url(#blueGlow)" />

      {/* Head - front facing for idle (looks good) */}
      <ellipse cx="35" cy="14" rx="8" ry="9" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
      <path d="M32,6 Q30,10 31,14 Q31,18 32,22" stroke={K.tattoo} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="32" cy="12" rx="2" ry="1.5" fill="white" />
      <ellipse cx="38" cy="12" rx="2" ry="1.5" fill="white" />
      <circle cx="32.5" cy="12" r="1" fill={K.eye} />
      <circle cx="38.5" cy="12" r="1" fill={K.eye} />
      <path d="M29,9 L34,10.5" stroke={K.beard} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M41,9 L36,10.5" stroke={K.beard} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M32,17 Q32,22 35,24 Q38,22 38,17 Z" fill={K.beard} />
    </g>
  )
})

// ============================================================================
// MAIN CHARACTER COMPONENT - Cycles through frames
// ============================================================================

const RUN_FRAMES = [KratosRunFrame1, KratosRunFrame2, KratosRunFrame3, KratosRunFrame2]

type KratosAnimation = 'idle' | 'running'

interface KratosCharacterProps {
  scale?: number
  animation?: KratosAnimation
  facingDirection?: 'left' | 'right'
  className?: string
}

export const KratosCharacter = memo(function KratosCharacter({
  scale = 1,
  animation = 'idle',
  facingDirection = 'left',
  className = '',
}: KratosCharacterProps) {
  const [frameIndex, setFrameIndex] = useState(0)
  const isLeft = facingDirection === 'left'

  useEffect(() => {
    if (animation !== 'running') {
      setFrameIndex(0)
      return
    }

    const interval = setInterval(() => {
      setFrameIndex(prev => (prev + 1) % RUN_FRAMES.length)
    }, 120)

    return () => clearInterval(interval)
  }, [animation])

  const CurrentFrame = animation === 'running' ? RUN_FRAMES[frameIndex] : KratosIdle

  return (
    <svg
      width={70 * scale}
      height={75 * scale}
      viewBox="0 0 70 75"
      className={className}
      style={{
        overflow: 'visible',
        transform: isLeft ? 'scaleX(-1)' : 'none',
      }}
    >
      <defs>
        {/* Ground shadow */}
        <radialGradient id="kratosGroundShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c9a227" stopOpacity="0.4" />
          <stop offset="70%" stopColor="#8b7319" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#5a4a10" stopOpacity="0" />
        </radialGradient>
        {/* Red blade glow */}
        <filter id="redGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feFlood floodColor="#ff4444" floodOpacity="0.6" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Blue blade glow */}
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

      <CurrentFrame />
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

    // Phase 1: Kratos runs in
    setPhase('running')
    const runStart = performance.now()
    const runDuration = 900

    const animateRun = (now: number) => {
      const elapsed = now - runStart
      const progress = Math.min(elapsed / runDuration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      // End at -200 (further right from content, closer to screen edge)
      setKratosX(-500 + (300) * eased)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animateRun)
      }
    }
    rafRef.current = requestAnimationFrame(animateRun)

    // Phase 2: Pull content
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

    // Phase 3: Done
    const t2 = setTimeout(() => setPhase('done'), 1600)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [triggered])

  return (
    <div className={`relative ${className}`}>
      {/* Kratos */}
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
          animation={phase === 'running' ? 'running' : 'idle'}
          facingDirection="left"
        />
      </div>

      {/* Content */}
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
