'use client'

import { memo, useEffect, useState, useRef, useCallback, ReactNode } from 'react'

/**
 * ALEX CHARACTER - KNIGHT BODY WITH ALEXANDER'S HEAD
 * ===================================================
 *
 * Dark fantasy warrior using the knight's body/cloak/sword
 * but with Alexander's distinctive head: brown skin, beard,
 * short dark hair - adapted to the ethereal theme style.
 *
 * Based on the sprite from /src/assets/sprites/stop_front.png
 */

// Color palette
const DF = {
  void: '#0f0a1a',
  voidDeep: '#1a1025',
  bone: '#e8e4dc',
  ethereal: '#41c8e8',
  spiritGold: '#e8c841',
  // Alexander's colors (from sprite)
  skinTone: '#a06848',
  skinShadow: '#7d5038',
  beardDark: '#2d1f2d',
  hairDark: '#3d2d3d',
}

interface AlexCharacterProps {
  scale?: number
  size?: number
  attacking?: boolean
  attackPhase?: number
  pose?: 'idle' | 'dash' | 'attack'
  className?: string
}

export const AlexCharacter = memo(function AlexCharacter({
  scale = 1,
  size,
  attacking = false,
  attackPhase = 0,
  pose = 'idle',
  className = '',
}: AlexCharacterProps) {
  const effectiveScale = size ? size / 80 : scale
  const isAttacking = attacking || pose === 'attack'

  const getNailRotation = () => {
    if (!isAttacking) return 20
    if (attackPhase < 0.3) return 20 - (attackPhase / 0.3) * 65
    if (attackPhase < 0.5) return -45
    return -45 + ((attackPhase - 0.5) / 0.5) * 135
  }

  const nailRotation = getNailRotation()

  return (
    <svg
      width={80 * effectiveScale}
      height={100 * effectiveScale}
      viewBox="0 0 80 100"
      className={className}
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Glow for ethereal effects */}
        <radialGradient id="alexGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={DF.spiritGold} stopOpacity="0.3" />
          <stop offset="100%" stopColor={DF.spiritGold} stopOpacity="0" />
        </radialGradient>

        {/* Skin gradient */}
        <radialGradient id="skinShade" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor={DF.skinTone} />
          <stop offset="70%" stopColor={DF.skinShadow} />
        </radialGradient>

        {/* Cloak gradient */}
        <linearGradient id="alexCloakGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={DF.voidDeep} />
          <stop offset="100%" stopColor={DF.void} />
        </linearGradient>
      </defs>

      {/* CLOAK / BODY - same as knight */}
      <g>
        <path
          d="M25,55
             C20,58 15,65 18,80
             Q20,90 25,95
             L55,95
             Q60,90 62,80
             C65,65 60,58 55,55
             L40,52
             Z"
          fill="url(#alexCloakGrad)"
          stroke={DF.void}
          strokeWidth="1"
        />

        {/* Cloak folds */}
        <path
          d="M30,60 Q28,70 30,85 M50,60 Q52,70 50,85"
          fill="none"
          stroke="#0a0510"
          strokeWidth="2"
          opacity="0.5"
        />

        {/* Collar */}
        <ellipse cx="40" cy="54" rx="18" ry="6" fill={DF.voidDeep} stroke={DF.void} strokeWidth="1" />

        {/* Spirit gold trim on cloak */}
        <path
          d="M25,55 Q30,53 40,52 Q50,53 55,55"
          fill="none"
          stroke={DF.spiritGold}
          strokeWidth="1.5"
          opacity="0.6"
        />
      </g>

      {/* ALEXANDER'S HEAD */}
      <g>
        {/* Neck */}
        <rect x="35" y="48" width="10" height="8" fill={DF.skinShadow} />

        {/* Face - rounded with beard */}
        <ellipse cx="40" cy="32" rx="16" ry="18" fill="url(#skinShade)" />

        {/* Ears */}
        <ellipse cx="24" cy="32" rx="3" ry="5" fill={DF.skinTone} />
        <ellipse cx="56" cy="32" rx="3" ry="5" fill={DF.skinTone} />
        <ellipse cx="24" cy="32" rx="2" ry="3" fill={DF.skinShadow} opacity="0.5" />
        <ellipse cx="56" cy="32" rx="2" ry="3" fill={DF.skinShadow} opacity="0.5" />

        {/* Hair - short dark */}
        <path
          d="M25,22
             Q28,10 40,8
             Q52,10 55,22
             Q56,26 55,28
             L54,25
             Q52,18 40,16
             Q28,18 26,25
             L25,28
             Q24,26 25,22"
          fill={DF.hairDark}
        />

        {/* Hair highlight */}
        <path
          d="M30,14 Q40,12 50,14"
          fill="none"
          stroke={DF.void}
          strokeWidth="2"
          opacity="0.3"
        />

        {/* Eyes - dark ovals like sprite */}
        <ellipse cx="33" cy="30" rx="3" ry="4" fill={DF.void} />
        <ellipse cx="47" cy="30" rx="3" ry="4" fill={DF.void} />
        {/* Eye highlights */}
        <circle cx="34" cy="29" r="1" fill="#fff" opacity="0.6" />
        <circle cx="48" cy="29" r="1" fill="#fff" opacity="0.6" />

        {/* Eyebrows */}
        <path d="M29,25 Q33,23 37,25" fill="none" stroke={DF.hairDark} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M43,25 Q47,23 51,25" fill="none" stroke={DF.hairDark} strokeWidth="1.5" strokeLinecap="round" />

        {/* Beard - distinctive full beard */}
        <path
          d="M28,36
             Q26,38 27,44
             Q30,52 40,54
             Q50,52 53,44
             Q54,38 52,36
             Q48,35 40,36
             Q32,35 28,36"
          fill={DF.beardDark}
        />

        {/* Beard texture lines */}
        <path
          d="M32,40 Q36,42 40,44 M48,40 Q44,42 40,44"
          fill="none"
          stroke={DF.void}
          strokeWidth="0.8"
          opacity="0.4"
        />

        {/* Mouth area (visible above beard) */}
        <ellipse cx="40" cy="38" rx="5" ry="2" fill={DF.skinShadow} opacity="0.3" />

        {/* Ethereal glow aura around head when attacking */}
        {isAttacking && (
          <ellipse cx="40" cy="32" rx="22" ry="24" fill="url(#alexGlow)" opacity={0.3 + attackPhase * 0.4} />
        )}
      </g>

      {/* NAIL (SWORD) - same as knight */}
      <g
        style={{
          transformOrigin: '15px 55px',
          transform: `rotate(${nailRotation}deg)`,
          transition: attacking ? 'transform 0.08s ease-out' : 'transform 0.3s ease-out',
        }}
      >
        {/* Handle */}
        <rect x="10" y="50" width="10" height="16" rx="2" fill={DF.voidDeep} stroke={DF.bone} strokeWidth="1" />

        {/* Handle wrapping */}
        <g stroke={DF.bone} strokeWidth="1" opacity="0.6">
          <line x1="11" y1="53" x2="19" y2="53" />
          <line x1="11" y1="57" x2="19" y2="57" />
          <line x1="11" y1="61" x2="19" y2="61" />
        </g>

        {/* Guard */}
        <ellipse cx="15" cy="50" rx="8" ry="3" fill={DF.bone} stroke="#a8a4a0" strokeWidth="0.5" />

        {/* Blade */}
        <path d="M15,50 L10,20 L15,5 L20,20 L15,50" fill={DF.bone} stroke="#a8a4a0" strokeWidth="0.5" />

        {/* Blade center line */}
        <line x1="15" y1="48" x2="15" y2="8" stroke="#c8c4bc" strokeWidth="1.5" />

        {/* Blade tip highlight */}
        <path d="M15,5 L13,15 L17,15 Z" fill="#fff" opacity="0.3" />

        {/* Ethereal glow when attacking */}
        {attacking && attackPhase > 0.4 && (
          <path
            d="M15,50 L10,20 L15,5 L20,20 L15,50"
            fill={DF.ethereal}
            opacity={0.4 * Math.min(1, (attackPhase - 0.4) * 3)}
          />
        )}
      </g>
    </svg>
  )
})

// ============================================
// SIMPLE SLASH REVEAL - RELIABLE ANIMATION
// ============================================

interface SlashRevealProps {
  children: ReactNode
  triggered: boolean
  className?: string
}

export const SlashReveal = memo(function SlashReveal({
  children,
  triggered,
  className = '',
}: SlashRevealProps) {
  const [phase, setPhase] = useState<'hidden' | 'entering' | 'slashing' | 'revealing' | 'done'>('hidden')
  const [attackPhase, setAttackPhase] = useState(0)

  useEffect(() => {
    // Fallback: show content after 3 seconds even if not triggered (accessibility)
    const fallbackTimer = setTimeout(() => {
      if (phase === 'hidden') {
        setPhase('done')
      }
    }, 3000)

    if (!triggered) return () => clearTimeout(fallbackTimer)
    if (phase !== 'hidden') return () => clearTimeout(fallbackTimer)

    // Start animation sequence
    setPhase('entering')

    // Slash after entering
    const slashTimer = setTimeout(() => {
      setPhase('slashing')
      let start = performance.now()
      const animateSlash = (now: number) => {
        const progress = Math.min((now - start) / 300, 1)
        setAttackPhase(progress)
        if (progress < 1) requestAnimationFrame(animateSlash)
        else {
          setPhase('revealing')
          setTimeout(() => setPhase('done'), 500)
        }
      }
      requestAnimationFrame(animateSlash)
    }, 600)

    return () => {
      clearTimeout(slashTimer)
      clearTimeout(fallbackTimer)
    }
  }, [triggered, phase])

  // Content is ALWAYS visible - animation just enhances
  // Default to visible, animate if triggered
  const showAnimation = triggered && phase !== 'hidden'
  const contentStyle: React.CSSProperties = {
    opacity: showAnimation && phase !== 'done' && phase !== 'revealing' ? 0.3 : 1,
    transform: showAnimation && phase === 'entering' ? 'translateX(30px)' : 'translateX(0)',
    transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
  }

  const characterStyle: React.CSSProperties = {
    position: 'absolute' as const,
    left: phase === 'hidden' ? '-100px' : phase === 'entering' ? '60px' : phase === 'done' ? '95%' : '30%',
    top: '50%',
    transform: 'translateY(-50%)',
    transition: 'left 0.6s ease-out',
    opacity: phase === 'hidden' ? 0 : phase === 'done' ? 0.3 : 1,
    zIndex: 20,
  }

  // Show slash effect
  const showSlash = phase === 'slashing'

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ minHeight: '200px' }}>
      {/* Alex Character */}
      <div style={characterStyle}>
        <AlexCharacter
          scale={1}
          attacking={phase === 'slashing'}
          attackPhase={attackPhase}
        />
      </div>

      {/* Slash effect */}
      {showSlash && (
        <div
          className="absolute left-[30%] top-1/2 -translate-y-1/2 z-30 pointer-events-none"
          style={{ animation: 'slashFade 300ms ease-out forwards' }}
        >
          <svg width="150" height="80" viewBox="0 0 150 80">
            <defs>
              <linearGradient id="slashGradAlex" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={DF.ethereal} stopOpacity="0" />
                <stop offset="50%" stopColor={DF.bone} stopOpacity="1" />
                <stop offset="100%" stopColor={DF.ethereal} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,60 Q50,20 100,10 Q130,5 150,15"
              fill="none"
              stroke="url(#slashGradAlex)"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      {/* Content */}
      <div style={contentStyle}>
        {children}
      </div>

      <style>{`
        @keyframes slashFade {
          0% { opacity: 0; transform: translateY(-50%) scaleX(0.5); }
          30% { opacity: 1; transform: translateY(-50%) scaleX(1); }
          100% { opacity: 0; transform: translateY(-50%) scaleX(1.2); }
        }
      `}</style>
    </div>
  )
})

// ============================================
// CTA REVEAL - DRAMATIC ENTRANCE FOR CONTACT
// ============================================

interface CTARevealProps {
  children: ReactNode
  triggered: boolean
  className?: string
}

export const CTAReveal = memo(function CTAReveal({
  children,
  triggered,
  className = '',
}: CTARevealProps) {
  const [phase, setPhase] = useState<'hidden' | 'char-enter' | 'gesture' | 'reveal' | 'done'>('hidden')

  useEffect(() => {
    // Fallback: show content after 3 seconds even if not triggered
    const fallbackTimer = setTimeout(() => {
      if (phase === 'hidden') {
        setPhase('done')
      }
    }, 3000)

    if (!triggered) return () => clearTimeout(fallbackTimer)
    if (phase !== 'hidden') return () => clearTimeout(fallbackTimer)

    setPhase('char-enter')

    const gestureTimer = setTimeout(() => setPhase('gesture'), 500)
    const revealTimer = setTimeout(() => setPhase('reveal'), 800)
    const doneTimer = setTimeout(() => setPhase('done'), 1300)

    return () => {
      clearTimeout(gestureTimer)
      clearTimeout(revealTimer)
      clearTimeout(doneTimer)
      clearTimeout(fallbackTimer)
    }
  }, [triggered, phase])

  const characterVisible = phase !== 'hidden'
  const characterX = phase === 'hidden' ? -100 : phase === 'done' ? 20 : 80
  const contentVisible = phase === 'reveal' || phase === 'done'

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ minHeight: '150px' }}>
      {/* Alex character beckoning */}
      {characterVisible && (
        <div
          className="absolute z-20"
          style={{
            left: characterX,
            bottom: '10%',
            transition: 'left 0.5s ease-out',
            opacity: phase === 'done' ? 0.4 : 1,
          }}
        >
          <AlexCharacter scale={0.8} pose={phase === 'gesture' ? 'idle' : 'idle'} />

          {/* Speech bubble / gesture indicator */}
          {phase === 'gesture' && (
            <div
              className="absolute -top-8 left-1/2 -translate-x-1/2"
              style={{
                animation: 'bubblePop 500ms ease-out forwards',
              }}
            >
              <svg width="60" height="40" viewBox="0 0 60 40">
                <path
                  d="M5,5 Q5,0 15,0 L45,0 Q55,0 55,10 L55,25 Q55,35 45,35 L35,35 L30,40 L25,35 L15,35 Q5,35 5,25 Z"
                  fill={DF.spiritGold}
                  opacity="0.9"
                />
                <text x="30" y="22" textAnchor="middle" fill={DF.void} fontSize="10" fontWeight="bold">
                  Hey!
                </text>
              </svg>
            </div>
          )}
        </div>
      )}

      {/* Content - ALWAYS visible, animation just enhances */}
      <div
        className="relative z-10"
        style={{
          opacity: 1,
          transform: 'translateY(0)',
          transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
        }}
      >
        {children}
      </div>

      <style>{`
        @keyframes bubblePop {
          0% { transform: translateX(-50%) scale(0); opacity: 0; }
          50% { transform: translateX(-50%) scale(1.1); opacity: 1; }
          100% { transform: translateX(-50%) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
})

export default AlexCharacter
