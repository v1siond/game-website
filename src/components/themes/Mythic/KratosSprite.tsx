'use client'

import { memo, useState, useEffect, useRef } from 'react'

/**
 * KRATOS SVG CHARACTER - With Blades of Chaos
 * Based on God of War: Betrayal sprite sheet
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
  bladeEdge: '#f0c050',
  chain: '#888888',
  chainDark: '#555555',
  eye: '#1a0a00',
}

type KratosAnimation = 'idle' | 'running' | 'throwing' | 'pulling' | 'breathing'

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
  const isLeft = facingDirection === 'left'

  return (
    <>
      <style>{`
        @keyframes kratosRunBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes kratosRunLegBack {
          0%, 100% { transform: rotate(-30deg); }
          50% { transform: rotate(25deg); }
        }
        @keyframes kratosRunLegFront {
          0%, 100% { transform: rotate(25deg); }
          50% { transform: rotate(-30deg); }
        }
        @keyframes kratosRunArmBack {
          0%, 100% { transform: rotate(35deg); }
          50% { transform: rotate(-25deg); }
        }
        @keyframes kratosRunArmFront {
          0%, 100% { transform: rotate(-35deg); }
          50% { transform: rotate(25deg); }
        }
        @keyframes kratosBreathing {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.02); }
        }
        @keyframes kratosThrowArms {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-60deg); }
        }
        @keyframes kratosPullArms {
          0%, 30% { transform: rotate(-60deg); }
          60%, 100% { transform: rotate(20deg); }
        }
      `}</style>
      <svg
        width={70 * scale}
        height={90 * scale}
        viewBox="0 0 70 90"
        className={className}
        style={{
          overflow: 'visible',
          transform: isLeft ? 'scaleX(-1)' : 'none',
        }}
      >
        {/* Ground shadow */}
        <defs>
          <radialGradient id="kratosShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c9a227" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#8b7319" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#5a4a10" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="35" cy="87" rx="16" ry="4" fill="url(#kratosShadow)" />

        {/* Main body group */}
        <g style={{
          transformOrigin: '35px 50px',
          animation: animation === 'running' ? 'kratosRunBob 0.25s ease-in-out infinite' :
                     animation === 'breathing' ? 'kratosBreathing 2s ease-in-out infinite' : undefined,
        }}>

          {/* === BACK LEG === */}
          <g style={{
            transformOrigin: '32px 52px',
            animation: animation === 'running' ? 'kratosRunLegBack 0.25s ease-in-out infinite' : undefined,
          }}>
            <path
              d="M29,52 Q26,58 27,65 Q28,70 31,70 L35,70 Q37,70 37,65 Q38,58 35,52 Z"
              fill={KRATOS.skin}
              stroke={KRATOS.skinShadow}
              strokeWidth="0.5"
            />
            <path
              d="M28,70 Q25,76 26,82 L30,84 L34,84 L35,82 Q36,76 33,70 Z"
              fill={KRATOS.skin}
              stroke={KRATOS.skinShadow}
              strokeWidth="0.5"
            />
            <ellipse cx="30" cy="85" rx="4" ry="2" fill={KRATOS.beard} />
          </g>

          {/* === FRONT LEG === */}
          <g style={{
            transformOrigin: '40px 52px',
            animation: animation === 'running' ? 'kratosRunLegFront 0.25s ease-in-out infinite' : undefined,
          }}>
            <path
              d="M37,52 Q34,58 35,65 Q36,70 39,70 L43,70 Q45,70 45,65 Q46,58 43,52 Z"
              fill={KRATOS.skin}
              stroke={KRATOS.skinShadow}
              strokeWidth="0.5"
            />
            <path
              d="M36,70 Q33,76 34,82 L38,84 L42,84 L43,82 Q44,76 41,70 Z"
              fill={KRATOS.skin}
              stroke={KRATOS.skinShadow}
              strokeWidth="0.5"
            />
            <ellipse cx="39" cy="85" rx="4" ry="2" fill={KRATOS.beard} />
          </g>

          {/* === BATTLE SKIRT === */}
          <path
            d="M26,48 L22,60 L28,62 L33,58 L35,62 L37,58 L42,62 L48,60 L44,48 Z"
            fill={KRATOS.skirt}
            stroke={KRATOS.skirtDark}
            strokeWidth="0.5"
          />
          <path d="M33,50 L32,58" stroke={KRATOS.skirtDark} strokeWidth="0.6" opacity="0.5" />
          <path d="M37,50 L38,58" stroke={KRATOS.skirtDark} strokeWidth="0.6" opacity="0.5" />

          {/* === TORSO === */}
          <path
            d="M25,28
               Q21,32 23,42 L26,48 L44,48 L47,42
               Q49,32 45,28
               L40,26 L35,25 L30,26 Z"
            fill={KRATOS.skin}
            stroke={KRATOS.skinShadow}
            strokeWidth="0.5"
          />

          {/* Chest muscles */}
          <path
            d="M27,30 Q31,33 34,31 Q35,30 36,31 Q39,33 43,30"
            stroke={KRATOS.skinShadow}
            strokeWidth="0.6"
            fill="none"
            opacity="0.4"
          />
          <path d="M35,32 L35,46" stroke={KRATOS.skinShadow} strokeWidth="0.4" opacity="0.3" />
          <path d="M31,37 L39,37" stroke={KRATOS.skinShadow} strokeWidth="0.4" opacity="0.2" />
          <path d="M30,41 L40,41" stroke={KRATOS.skinShadow} strokeWidth="0.4" opacity="0.2" />

          {/* RED TATTOO on body */}
          <path
            d="M29,28 Q27,36 27,44 Q27,47 28,48"
            stroke={KRATOS.tattoo}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Belt */}
          <rect x="25" y="46" width="20" height="3" rx="1" fill={KRATOS.belt} />
          <circle cx="35" cy="47.5" r="1.5" fill={KRATOS.gold} />

          {/* === BACK ARM WITH BLADE === */}
          <g style={{
            transformOrigin: '46px 28px',
            animation: animation === 'running' ? 'kratosRunArmBack 0.25s ease-in-out infinite' :
                       animation === 'throwing' ? 'kratosThrowArms 0.3s ease-out forwards' :
                       animation === 'pulling' ? 'kratosPullArms 0.8s ease-in-out forwards' : undefined,
          }}>
            {/* Shoulder */}
            <ellipse cx="46" cy="28" rx="3" ry="2.5" fill={KRATOS.skin} stroke={KRATOS.skinShadow} strokeWidth="0.5" />
            {/* Upper arm */}
            <path
              d="M44,29 Q41,33 42,38 L46,38 Q48,33 46,29 Z"
              fill={KRATOS.skin}
              stroke={KRATOS.skinShadow}
              strokeWidth="0.5"
            />
            {/* Forearm */}
            <path
              d="M42,38 Q40,42 41,47 L45,47 Q46,42 44,38 Z"
              fill={KRATOS.skin}
              stroke={KRATOS.skinShadow}
              strokeWidth="0.5"
            />
            {/* Fist */}
            <ellipse cx="43" cy="49" rx="2.5" ry="2" fill={KRATOS.skin} stroke={KRATOS.skinShadow} strokeWidth="0.5" />

            {/* Blade of Chaos in hand */}
            <g>
              {/* Handle */}
              <rect x="41" y="50" width="4" height="3" rx="0.5" fill={KRATOS.bladeDark} />
              {/* Blade - curved */}
              <path
                d="M43,53 L40,58 Q38,62 40,64 Q42,65 44,63 L46,58 L43,53 Z"
                fill={KRATOS.blade}
                stroke={KRATOS.bladeDark}
                strokeWidth="0.5"
              />
              <path d="M43,54 L42,60" stroke={KRATOS.bladeEdge} strokeWidth="0.5" opacity="0.6" />
            </g>
          </g>

          {/* === FRONT ARM WITH BLADE === */}
          <g style={{
            transformOrigin: '24px 28px',
            animation: animation === 'running' ? 'kratosRunArmFront 0.25s ease-in-out infinite' :
                       animation === 'throwing' ? 'kratosThrowArms 0.3s ease-out forwards' :
                       animation === 'pulling' ? 'kratosPullArms 0.8s ease-in-out forwards' : undefined,
          }}>
            {/* Shoulder */}
            <ellipse cx="24" cy="28" rx="3" ry="2.5" fill={KRATOS.skin} stroke={KRATOS.skinShadow} strokeWidth="0.5" />
            {/* Upper arm */}
            <path
              d="M22,29 Q19,33 20,38 L24,38 Q26,33 24,29 Z"
              fill={KRATOS.skin}
              stroke={KRATOS.skinShadow}
              strokeWidth="0.5"
            />
            {/* Forearm */}
            <path
              d="M19,38 Q17,42 18,47 L22,47 Q24,42 22,38 Z"
              fill={KRATOS.skin}
              stroke={KRATOS.skinShadow}
              strokeWidth="0.5"
            />
            {/* Fist */}
            <ellipse cx="20" cy="49" rx="2.5" ry="2" fill={KRATOS.skin} stroke={KRATOS.skinShadow} strokeWidth="0.5" />

            {/* Blade of Chaos in hand */}
            <g>
              {/* Handle */}
              <rect x="18" y="50" width="4" height="3" rx="0.5" fill={KRATOS.bladeDark} />
              {/* Blade */}
              <path
                d="M20,53 L17,58 Q15,62 17,64 Q19,65 21,63 L23,58 L20,53 Z"
                fill={KRATOS.blade}
                stroke={KRATOS.bladeDark}
                strokeWidth="0.5"
              />
              <path d="M20,54 L19,60" stroke={KRATOS.bladeEdge} strokeWidth="0.5" opacity="0.6" />
            </g>
          </g>

          {/* === HEAD === */}
          <rect x="31" y="22" width="8" height="5" rx="2" fill={KRATOS.skin} />
          <ellipse cx="35" cy="14" rx="9" ry="10" fill={KRATOS.skin} stroke={KRATOS.skinShadow} strokeWidth="0.5" />

          {/* RED TATTOO on head */}
          <path
            d="M28,4 Q26,8 27,14 Q27,20 28,24"
            stroke={KRATOS.tattoo}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Eyes */}
          <ellipse cx="31" cy="12" rx="2.2" ry="1.6" fill="white" />
          <ellipse cx="39" cy="12" rx="2.2" ry="1.6" fill="white" />
          <circle cx="32" cy="12" r="1" fill={KRATOS.eye} />
          <circle cx="40" cy="12" r="1" fill={KRATOS.eye} />

          {/* Angry eyebrows */}
          <path d="M28,8 L33,10" stroke={KRATOS.beard} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M42,8 L37,10" stroke={KRATOS.beard} strokeWidth="1.5" strokeLinecap="round" />

          {/* Nose */}
          <path d="M35,13 L33,16 L37,16 Z" fill={KRATOS.skinShadow} opacity="0.4" />

          {/* Beard */}
          <path
            d="M31,17 Q31,21 33,23 Q35,24 37,23 Q39,21 39,17
               L37,17 Q37,20 36,21 Q35,21.5 34,21 Q33,20 33,17 Z"
            fill={KRATOS.beard}
          />

          {/* Mouth */}
          <path d="M33,18 L37,18" stroke="#1a0a00" strokeWidth="0.6" />

        </g>
      </svg>
    </>
  )
})

// =============================================================================
// KRATOS CHAIN PULL REVEAL - Multi-phase animation
// =============================================================================

interface KratosChainPullRevealProps {
  children: React.ReactNode
  triggered: boolean
  className?: string
}

type Phase = 'waiting' | 'running' | 'throwing' | 'pulling' | 'done'

export const KratosChainPullReveal = memo(function KratosChainPullReveal({
  children,
  triggered,
  className = '',
}: KratosChainPullRevealProps) {
  const [phase, setPhase] = useState<Phase>('waiting')
  const [kratosX, setKratosX] = useState(-500)
  const [chainLength, setChainLength] = useState(0)
  const [contentX, setContentX] = useState(-400)
  const didAnimate = useRef(false)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!triggered || didAnimate.current) return
    didAnimate.current = true

    // Phase 1: Kratos runs in
    setPhase('running')
    const runStart = performance.now()
    const runDuration = 800
    const kratosStartX = -500
    const kratosStopX = -100

    const animateRun = (now: number) => {
      const elapsed = now - runStart
      const progress = Math.min(elapsed / runDuration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setKratosX(kratosStartX + (kratosStopX - kratosStartX) * eased)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animateRun)
      }
    }
    rafRef.current = requestAnimationFrame(animateRun)

    // Phase 2: Throw chains
    const t1 = setTimeout(() => {
      setPhase('throwing')
      // Animate chain extending
      const chainStart = performance.now()
      const chainDuration = 400
      const animateChain = (now: number) => {
        const elapsed = now - chainStart
        const progress = Math.min(elapsed / chainDuration, 1)
        setChainLength(progress * 300)
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animateChain)
        }
      }
      rafRef.current = requestAnimationFrame(animateChain)
    }, 850)

    // Phase 3: Pull content
    const t2 = setTimeout(() => {
      setPhase('pulling')
      const pullStart = performance.now()
      const pullDuration = 800
      const contentStartX = -400
      const contentEndX = 0

      const animatePull = (now: number) => {
        const elapsed = now - pullStart
        const progress = Math.min(elapsed / pullDuration, 1)
        const eased = 1 - Math.pow(1 - progress, 2)
        setContentX(contentStartX + (contentEndX - contentStartX) * eased)
        setChainLength(300 * (1 - eased))

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animatePull)
        }
      }
      rafRef.current = requestAnimationFrame(animatePull)
    }, 1300)

    // Phase 4: Done - breathing
    const t3 = setTimeout(() => setPhase('done'), 2200)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [triggered])

  const kratosAnimation: KratosAnimation =
    phase === 'running' ? 'running' :
    phase === 'throwing' ? 'throwing' :
    phase === 'pulling' ? 'pulling' :
    phase === 'done' ? 'breathing' : 'idle'

  return (
    <div className={`relative ${className}`}>
      {/* Chain connecting Kratos to content */}
      {(phase === 'throwing' || phase === 'pulling') && chainLength > 0 && (
        <svg
          className="absolute z-25 pointer-events-none"
          style={{
            right: -100,
            top: '50%',
            width: chainLength + 150,
            height: 40,
            transform: 'translateY(-50%)',
            overflow: 'visible',
          }}
        >
          {/* Chain links */}
          <path
            d={`M0,20 Q${chainLength/3},10 ${chainLength/2},20 Q${chainLength*2/3},30 ${chainLength},20`}
            stroke="#888"
            strokeWidth="3"
            fill="none"
            strokeDasharray="6,3"
          />
          {/* Blade at end */}
          <path
            d={`M${chainLength-5},15 L${chainLength+10},20 L${chainLength-5},25 Z`}
            fill="#d4a030"
            stroke="#8a6a10"
            strokeWidth="1"
          />
        </svg>
      )}

      {/* Kratos */}
      <div
        className="absolute z-30 pointer-events-none"
        style={{
          right: kratosX,
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: phase !== 'waiting' ? 1 : 0,
          transition: phase === 'waiting' ? 'opacity 0.2s' : 'none',
        }}
      >
        <KratosCharacter
          scale={2}
          animation={kratosAnimation}
          facingDirection="left"
        />
      </div>

      {/* Content - pulled by chain */}
      <div
        style={{
          opacity: phase === 'waiting' ? 0 : 1,
          transform: `translateX(${contentX}px)`,
          transition: phase === 'waiting' ? 'opacity 0.2s' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  )
})
