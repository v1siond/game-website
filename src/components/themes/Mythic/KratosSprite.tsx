'use client'

import { memo, useState, useEffect, useRef } from 'react'

/**
 * KRATOS SPRITE SYSTEM
 * ====================
 * 3-frame run cycle + idle pose
 * Simple SVG drawings, frame-based animation
 */

const K = {
  // Latino skin tone
  skin: '#c4956a',
  skinShadow: '#9a7050',
  tattoo: '#8b1a1a',
  beard: '#1a1208',
  hair: '#1a1208',
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
// SHARED: Running head facing RIGHT in SVG (shows LEFT on screen after flip)
// All features on the RIGHT side of the face
// ============================================================================
const RunningHeadRight = memo(function RunningHeadRight() {
  return (
    <g transform="translate(0, -2)">
      <ellipse cx="35" cy="14" rx="7" ry="8" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
      {/* Hair on top */}
      <path d="M28,10 Q30,4 35,3 Q40,4 42,10 Q40,7 35,6 Q30,7 28,10 Z" fill={K.hair} />
      {/* Tattoo on RIGHT side (same side as eye) */}
      <path d="M40,6 Q42,10 41,14 Q41,18 40,21" stroke={K.tattoo} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Single eye visible - facing RIGHT */}
      <ellipse cx="39" cy="12" rx="2" ry="1.5" fill="white" />
      <circle cx="39.5" cy="12" r="1" fill={K.eye} />
      {/* Eyebrow */}
      <path d="M37,9 L42,10" stroke={K.beard} strokeWidth="1.5" strokeLinecap="round" />
      {/* Beard profile - facing right */}
      <path d="M38,17 Q40,20 38,23 Q35,21 35,17 Z" fill={K.beard} />
      {/* Nose hint - facing right */}
      <path d="M41,13 L42,15" stroke={K.skinShadow} strokeWidth="0.5" />
    </g>
  )
})

// ============================================================================
// FRAME 1: SIDE PROFILE - Blue arm forward (visible), red arm back (hidden)
// Right leg forward (/), left leg back (\)
// ============================================================================
const KratosRunFrame1 = memo(function KratosRunFrame1() {
  return (
    <g>
      {/* Chain to visible blade */}
      <path d="M35,36 Q45,32 55,28" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />

      {/* LEFT leg - extended BACK (behind, angled \) */}
      <g>
        <path d="M33,46 Q27,54 22,62 Q19,68 21,72 L25,72 Q25,66 28,58 Q32,50 34,46 Z" fill={K.skinShadow} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="23" cy="73" rx="3.5" ry="2" fill={K.beard} />
      </g>

      {/* Torso - SIDE PROFILE (narrow ellipse) leaning forward */}
      <g transform="rotate(-15, 35, 34)">
        <ellipse cx="35" cy="34" rx="6" ry="10" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <path d="M35,26 L35,42" stroke={K.skinShadow} strokeWidth="0.5" opacity="0.3" />
        <rect x="30" y="42" width="10" height="3" rx="1" fill={K.belt} />
        <circle cx="35" cy="43.5" r="1.5" fill={K.gold} />
      </g>

      {/* RIGHT leg - extended FORWARD (in front, angled /) */}
      <g>
        <path d="M37,46 Q43,54 48,62 Q51,68 49,72 L45,72 Q45,66 42,58 Q38,50 36,46 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="47" cy="73" rx="3.5" ry="2" fill={K.beard} />
      </g>

      {/* Skirt - side view (narrower) */}
      <path
        d="M30,44 L27,54 L32,55 L35,53 L38,55 L43,54 L40,44 Z"
        fill={K.skirt}
        stroke={K.skirtDark}
        strokeWidth="0.5"
      />

      {/* VISIBLE arm + BLUE blade (swinging forward) */}
      <g>
        <ellipse cx="37" cy="26" rx="3" ry="3" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <path d="M39,27 Q46,28 52,26 L52,30 Q46,31 39,30 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="53" cy="28" rx="2.5" ry="2" fill={K.skin} />
        <path d="M55,27 L68,20 Q73,17 70,14 L57,23 Z" fill={K.bladeBlue} stroke={K.bladeBlueGlow} strokeWidth="1.5" filter="url(#blueGlow)" />
      </g>

      {/* Head - facing RIGHT (side profile) */}
      <RunningHeadRight />
    </g>
  )
})

// ============================================================================
// FRAME 2: SIDE PROFILE - Mid-stride, arm at side pointing down
// Legs passing through center (more vertical)
// ============================================================================
const KratosRunFrame2 = memo(function KratosRunFrame2() {
  return (
    <g>
      {/* Chain to blade */}
      <path d="M35,36 Q38,45 40,55" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />

      {/* Back leg (slightly behind, darker) */}
      <g>
        <path d="M34,46 Q32,54 31,62 Q30,68 32,72 L36,72 Q36,66 36,58 Q36,50 35,46 Z" fill={K.skinShadow} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="34" cy="73" rx="3.5" ry="2" fill={K.beard} />
      </g>

      {/* Torso - SIDE PROFILE (narrow) */}
      <g transform="rotate(-8, 35, 34)">
        <ellipse cx="35" cy="34" rx="6" ry="10" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <path d="M35,26 L35,42" stroke={K.skinShadow} strokeWidth="0.5" opacity="0.3" />
        <rect x="30" y="42" width="10" height="3" rx="1" fill={K.belt} />
        <circle cx="35" cy="43.5" r="1.5" fill={K.gold} />
      </g>

      {/* Front leg (slightly forward) */}
      <g>
        <path d="M36,46 Q38,54 39,62 Q40,68 38,72 L34,72 Q34,66 34,58 Q34,50 35,46 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="36" cy="73" rx="3.5" ry="2" fill={K.beard} />
      </g>

      {/* Skirt - side view */}
      <path
        d="M30,44 L28,54 L33,55 L35,53 L37,55 L42,54 L40,44 Z"
        fill={K.skirt}
        stroke={K.skirtDark}
        strokeWidth="0.5"
      />

      {/* Arm at side pointing down + blade */}
      <g>
        <ellipse cx="37" cy="26" rx="3" ry="3" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <path d="M38,28 Q40,36 41,44 L37,45 Q37,37 36,29 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="39" cy="45" rx="2.5" ry="2" fill={K.skin} />
        <path d="M40,47 L48,62 Q51,67 48,69 L38,53 Z" fill={K.bladeBlue} stroke={K.bladeBlueGlow} strokeWidth="1.5" filter="url(#blueGlow)" />
      </g>

      {/* Head - facing RIGHT */}
      <RunningHeadRight />
    </g>
  )
})

// ============================================================================
// FRAME 3: SIDE PROFILE - Red arm forward (visible), blue arm back (hidden)
// Left leg forward (/), right leg back (\) - OPPOSITE of frame 1
// ============================================================================
const KratosRunFrame3 = memo(function KratosRunFrame3() {
  return (
    <g>
      {/* Chain to visible blade */}
      <path d="M35,36 Q45,32 55,28" stroke={K.chain} strokeWidth="1.5" fill="none" strokeDasharray="2,1" />

      {/* RIGHT leg - extended BACK (behind, angled \) */}
      <g>
        <path d="M37,46 Q43,54 48,62 Q51,68 49,72 L45,72 Q45,66 42,58 Q38,50 36,46 Z" fill={K.skinShadow} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="47" cy="73" rx="3.5" ry="2" fill={K.beard} />
      </g>

      {/* Torso - SIDE PROFILE (narrow ellipse) leaning forward */}
      <g transform="rotate(-15, 35, 34)">
        <ellipse cx="35" cy="34" rx="6" ry="10" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <path d="M35,26 L35,42" stroke={K.skinShadow} strokeWidth="0.5" opacity="0.3" />
        <rect x="30" y="42" width="10" height="3" rx="1" fill={K.belt} />
        <circle cx="35" cy="43.5" r="1.5" fill={K.gold} />
      </g>

      {/* LEFT leg - extended FORWARD (in front, angled /) */}
      <g>
        <path d="M33,46 Q27,54 22,62 Q19,68 21,72 L25,72 Q25,66 28,58 Q32,50 34,46 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="23" cy="73" rx="3.5" ry="2" fill={K.beard} />
      </g>

      {/* Skirt - side view (narrower) */}
      <path
        d="M30,44 L27,54 L32,55 L35,53 L38,55 L43,54 L40,44 Z"
        fill={K.skirt}
        stroke={K.skirtDark}
        strokeWidth="0.5"
      />

      {/* VISIBLE arm + RED blade (swinging forward) - SWAPPED from frame 1 */}
      <g>
        <ellipse cx="37" cy="26" rx="3" ry="3" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <path d="M39,27 Q46,28 52,26 L52,30 Q46,31 39,30 Z" fill={K.skin} stroke={K.skinShadow} strokeWidth="0.5" />
        <ellipse cx="53" cy="28" rx="2.5" ry="2" fill={K.skin} />
        <path d="M55,27 L68,20 Q73,17 70,14 L57,23 Z" fill={K.bladeRed} stroke={K.bladeRedGlow} strokeWidth="1.5" filter="url(#redGlow)" />
      </g>

      {/* Head - facing RIGHT (side profile) */}
      <RunningHeadRight />
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
      {/* Hair on top */}
      <path d="M27,10 Q29,3 35,2 Q41,3 43,10 Q41,6 35,5 Q29,6 27,10 Z" fill={K.hair} />
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
