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
      <path d="M35,44 Q40,46 50,43" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />
      <path d="M35,44 Q30,46 20,43" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />

      {/* Torso - leaning forward */}
      <g transform="rotate(-8, 35, 40)">
        {/* Main torso */}
        <path
          d="M28,24 Q24,28 26,38 L29,44 L41,44 L44,38 Q46,28 42,24 L38,22 L35,21 L32,22 Z"
          fill={K.skin}
          stroke={K.skinShadow}
          strokeWidth="0.5"
        />
        {/* Chest lines */}
        <path d="M30,28 Q33,30 35,28 Q37,30 40,28" stroke={K.skinShadow} strokeWidth="0.5" fill="none" opacity="0.4" />
        <path d="M35,30 L35,42" stroke={K.skinShadow} strokeWidth="0.4" opacity="0.3" />
        {/* Tattoo on body - tiny bit more left on screen = +1 to x */}
        <path d="M33,24 Q31,32 32,42" stroke={K.tattoo} strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Belt */}
        <rect x="28" y="42" width="14" height="3" rx="1" fill={K.belt} />
        <circle cx="35" cy="43.5" r="1.5" fill={K.gold} />
      </g>

      {/* Back leg (left) - extended back - muscular */}
      <g>
        <path d="M36,50 Q40,52 43,56 Q46,60 45,64 L42,66 Q40,62 38,58 Q36,54 34,50 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="43.5" cy="66" rx="3.5" ry="2" fill={K.beard} />
      </g>

      {/* Front leg (right) - extended forward - muscular */}
      <g>
        <path d="M34,50 Q30,52 27,56 Q24,60 25,64 L28,66 Q30,62 32,58 Q34,54 36,50 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="26.5" cy="66" rx="3.5" ry="2" fill={K.beard} />
      </g>

      {/* Skirt - flowing back - AFTER legs */}
      <path
        d="M26,45 L22,56 L28,57 L32,54 L35,57 L38,54 L42,57 L48,56 L44,45 Z"
        fill={K.skirt}
        stroke={K.skirtDark}
        strokeWidth="0.5"
      />

      {/* Back arm (right) + BLUE blade - bigger */}
      <g>
        <ellipse cx="42" cy="26" rx="3" ry="2.5" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <path d="M43,27 L50,38 L52,42 L48,42 L44,32 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="50" cy="43" rx="2.5" ry="2" fill={K.skin} />
        {/* Blue blade with glow - bigger */}
        <path d="M52,43 L62,52 Q67,56 64,58 L54,48 Z" fill={K.bladeBlue} stroke={K.bladeBlueGlow} strokeWidth="1.5" filter="url(#blueGlow)" />
      </g>

      {/* Front arm (left) + RED blade - bigger */}
      <g>
        <ellipse cx="28" cy="26" rx="3" ry="2.5" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <path d="M27,27 L20,38 L18,42 L22,42 L26,32 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="20" cy="43" rx="2.5" ry="2" fill={K.skin} />
        {/* Red blade with glow - bigger */}
        <path d="M18,43 L8,52 Q3,56 6,58 L16,48 Z" fill={K.bladeRed} stroke={K.bladeRedGlow} strokeWidth="1.5" filter="url(#redGlow)" />
      </g>

      {/* Head */}
      <g transform="translate(0, -2)">
        <ellipse cx="35" cy="14" rx="8" ry="9" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        {/* Tattoo on head - tiny bit more left = +1 to x */}
        <path d="M32,6 Q30,10 31,14 Q31,18 32,22" stroke={K.tattoo} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Eyes */}
        <ellipse cx="32" cy="12" rx="2" ry="1.5" fill="white" />
        <ellipse cx="38" cy="12" rx="2" ry="1.5" fill="white" />
        <circle cx="32.5" cy="12" r="1" fill={K.eye} />
        <circle cx="38.5" cy="12" r="1" fill={K.eye} />
        {/* Eyebrows */}
        <path d="M29,9 L34,10.5" stroke={K.beard} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M41,9 L36,10.5" stroke={K.beard} strokeWidth="1.5" strokeLinecap="round" />
        {/* Beard - solid goatee pointing down */}
        <path d="M32,17 Q32,22 35,24 Q38,22 38,17 Z" fill={K.beard} />
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
      <path d="M35,44 Q42,48 46,44" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />
      <path d="M35,44 Q28,48 24,44" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />

      {/* Torso - slight lean */}
      <g transform="rotate(-5, 35, 40)">
        <path
          d="M28,24 Q24,28 26,38 L29,44 L41,44 L44,38 Q46,28 42,24 L38,22 L35,21 L32,22 Z"
          fill={K.skin}
          stroke={K.skinShadow}
          strokeWidth="0.5"
        />
        <path d="M30,28 Q33,30 35,28 Q37,30 40,28" stroke={K.skinShadow} strokeWidth="0.5" fill="none" opacity="0.4" />
        <path d="M35,30 L35,42" stroke={K.skinShadow} strokeWidth="0.4" opacity="0.3" />
        <path d="M33,24 Q31,32 32,42" stroke={K.tattoo} strokeWidth="2" fill="none" strokeLinecap="round" />
        <rect x="28" y="42" width="14" height="3" rx="1" fill={K.belt} />
        <circle cx="35" cy="43.5" r="1.5" fill={K.gold} />
      </g>

      {/* Left leg - passing through - muscular */}
      <g>
        <path d="M32,50 Q29,54 30,58 Q30,62 32,66 L35,66 Q35,62 35,58 Q36,54 34,50 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="33.5" cy="67" rx="3" ry="2" fill={K.beard} />
      </g>

      {/* Right leg - passing through - muscular */}
      <g>
        <path d="M36,50 Q39,54 38,58 Q38,62 36,66 L33,66 Q33,62 33,58 Q32,54 34,50 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="34.5" cy="67" rx="3" ry="2" fill={K.beard} />
      </g>

      {/* Skirt - AFTER legs */}
      <path
        d="M27,45 L24,56 L29,57 L32,55 L35,57 L38,55 L41,57 L46,56 L43,45 Z"
        fill={K.skirt}
        stroke={K.skirtDark}
        strokeWidth="0.5"
      />

      {/* Left arm + RED blade - bigger */}
      <g>
        <ellipse cx="28" cy="26" rx="3" ry="2.5" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <path d="M26,27 L24,36 L22,42 L26,42 L28,36 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="24" cy="44" rx="2.5" ry="2" fill={K.skin} />
        <path d="M22,44 L14,56 Q11,60 14,62 L24,50 Z" fill={K.bladeRed} stroke={K.bladeRedGlow} strokeWidth="1.5" filter="url(#redGlow)" />
      </g>

      {/* Right arm + BLUE blade - bigger */}
      <g>
        <ellipse cx="42" cy="26" rx="3" ry="2.5" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <path d="M44,27 L46,36 L48,42 L44,42 L42,36 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="46" cy="44" rx="2.5" ry="2" fill={K.skin} />
        <path d="M48,44 L56,56 Q59,60 56,62 L46,50 Z" fill={K.bladeBlue} stroke={K.bladeBlueGlow} strokeWidth="1.5" filter="url(#blueGlow)" />
      </g>

      {/* Head */}
      <g>
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
      <path d="M35,44 Q30,46 20,43" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />
      <path d="M35,44 Q40,46 50,43" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />

      {/* Torso - leaning forward */}
      <g transform="rotate(-8, 35, 40)">
        <path
          d="M28,24 Q24,28 26,38 L29,44 L41,44 L44,38 Q46,28 42,24 L38,22 L35,21 L32,22 Z"
          fill={K.skin}
          stroke={K.skinShadow}
          strokeWidth="0.5"
        />
        <path d="M30,28 Q33,30 35,28 Q37,30 40,28" stroke={K.skinShadow} strokeWidth="0.5" fill="none" opacity="0.4" />
        <path d="M35,30 L35,42" stroke={K.skinShadow} strokeWidth="0.4" opacity="0.3" />
        <path d="M33,24 Q31,32 32,42" stroke={K.tattoo} strokeWidth="2" fill="none" strokeLinecap="round" />
        <rect x="28" y="42" width="14" height="3" rx="1" fill={K.belt} />
        <circle cx="35" cy="43.5" r="1.5" fill={K.gold} />
      </g>

      {/* Back leg (right) - extended back - muscular */}
      <g>
        <path d="M34,50 Q30,52 27,56 Q24,60 25,64 L28,66 Q30,62 32,58 Q34,54 36,50 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="26.5" cy="66" rx="3.5" ry="2" fill={K.beard} />
      </g>

      {/* Front leg (left) - extended forward - muscular */}
      <g>
        <path d="M36,50 Q40,52 43,56 Q46,60 45,64 L42,66 Q40,62 38,58 Q36,54 34,50 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="43.5" cy="66" rx="3.5" ry="2" fill={K.beard} />
      </g>

      {/* Skirt - flowing back - AFTER legs */}
      <path
        d="M26,45 L22,56 L28,57 L32,54 L35,57 L38,54 L42,57 L48,56 L44,45 Z"
        fill={K.skirt}
        stroke={K.skirtDark}
        strokeWidth="0.5"
      />

      {/* Back arm (left) + RED blade - bigger */}
      <g>
        <ellipse cx="28" cy="26" rx="3" ry="2.5" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <path d="M27,27 L20,38 L18,42 L22,42 L26,32 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="20" cy="43" rx="2.5" ry="2" fill={K.skin} />
        <path d="M18,43 L8,52 Q3,56 6,58 L16,48 Z" fill={K.bladeRed} stroke={K.bladeRedGlow} strokeWidth="1.5" filter="url(#redGlow)" />
      </g>

      {/* Front arm (right) + BLUE blade - bigger */}
      <g>
        <ellipse cx="42" cy="26" rx="3" ry="2.5" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <path d="M43,27 L50,38 L52,42 L48,42 L44,32 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="50" cy="43" rx="2.5" ry="2" fill={K.skin} />
        <path d="M52,43 L62,52 Q67,56 64,58 L54,48 Z" fill={K.bladeBlue} stroke={K.bladeBlueGlow} strokeWidth="1.5" filter="url(#blueGlow)" />
      </g>

      {/* Head */}
      <g transform="translate(0, -2)">
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
      <path d="M35,44 Q28,50 22,46" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />
      <path d="M35,44 Q42,50 48,46" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />

      {/* Torso */}
      <path
        d="M28,24 Q24,28 26,38 L29,44 L41,44 L44,38 Q46,28 42,24 L38,22 L35,21 L32,22 Z"
        fill={K.skin}
        stroke={K.skinShadow}
        strokeWidth="0.5"
      />
      <path d="M30,28 Q33,30 35,28 Q37,30 40,28" stroke={K.skinShadow} strokeWidth="0.5" fill="none" opacity="0.4" />
      <path d="M35,30 L35,42" stroke={K.skinShadow} strokeWidth="0.4" opacity="0.3" />
      <path d="M33,24 Q31,32 32,42" stroke={K.tattoo} strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="28" y="42" width="14" height="3" rx="1" fill={K.belt} />
      <circle cx="35" cy="43.5" r="1.5" fill={K.gold} />

      {/* Left leg - muscular thigh tapering to calf */}
      <path d="M32,50 Q29,54 29,58 Q29,62 31,66 L34,66 Q35,62 35,58 Q36,54 34,50 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
      <ellipse cx="32.5" cy="67" rx="3" ry="2" fill={K.beard} />

      {/* Right leg - muscular thigh tapering to calf */}
      <path d="M36,50 Q39,54 39,58 Q39,62 37,66 L34,66 Q33,62 33,58 Q32,54 34,50 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
      <ellipse cx="35.5" cy="67" rx="3" ry="2" fill={K.beard} />

      {/* Skirt - AFTER legs */}
      <path
        d="M28,45 L25,56 L30,57 L33,55 L35,57 L37,55 L40,57 L45,56 L42,45 Z"
        fill={K.skirt}
        stroke={K.skirtDark}
        strokeWidth="0.5"
      />

      {/* Left arm + RED blade - bigger */}
      <ellipse cx="27" cy="26" rx="3" ry="2.5" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
      <path d="M25,27 L22,36 L20,44 L24,44 L26,36 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
      <ellipse cx="22" cy="46" rx="2.5" ry="2" fill={K.skin} />
      <path d="M19,46 L12,58 Q9,62 12,64 L22,52 Z" fill={K.bladeRed} stroke={K.bladeRedGlow} strokeWidth="1.5" filter="url(#redGlow)" />

      {/* Right arm + BLUE blade - bigger */}
      <ellipse cx="43" cy="26" rx="3" ry="2.5" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
      <path d="M45,27 L48,36 L50,44 L46,44 L44,36 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
      <ellipse cx="48" cy="46" rx="2.5" ry="2" fill={K.skin} />
      <path d="M51,46 L58,58 Q61,62 58,64 L48,52 Z" fill={K.bladeBlue} stroke={K.bladeBlueGlow} strokeWidth="1.5" filter="url(#blueGlow)" />

      {/* Head */}
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
