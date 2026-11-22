'use client'

import { memo, ReactNode, useState, useEffect, useRef, type CSSProperties } from 'react'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { FixedCombatLayer, COMBAT_IN_VIEW, COMBAT_PHONE_SCALE, COMBAT_Z, moveAndFade } from './fixedCombat'
import knight from './knight.module.css'
import { DARK_FANTASY } from './palette'

/**
 * ALEXANDER AS A MASKED CAVERN KNIGHT
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

// The knight's drawing in viewBox units: its width and height, his size on screen being these times his
// scale, and the line his soles and his ground shadow sit on, KNIGHT_SOLE_Y below the drawing's top.
const KNIGHT_VIEW_WIDTH = 60
const KNIGHT_VIEW_HEIGHT = 80
const KNIGHT_SOLE_Y = 79
// The small ground shadow drawn over his legs sits this far above the sole line the contact shadows sit on.
const KNIGHT_INNER_SHADOW_RISE = 3

interface KnightCharacterProps {
  scale?: number
  attacking?: boolean
  attackPhase?: number
  facingDirection?: 'left' | 'right'
  breathing?: boolean
}

export const KnightCharacter = memo(function KnightCharacter({
  scale = 1,
  attacking = false,
  attackPhase = 0,
  facingDirection = 'right',
  breathing = false,
}: KnightCharacterProps) {
  const isLeft = facingDirection === 'left'

  const getNailRotation = () => {
    if (!attacking) return 25
    if (attackPhase < 0.3) return 25 - (attackPhase / 0.3) * 85
    if (attackPhase < 0.5) return -60
    return -60 + ((attackPhase - 0.5) / 0.5) * 85
  }

  const nailRotation = getNailRotation()

  return (
    <span style={{ display: 'block', animation: breathing && !attacking ? `${knight.knightIdleFloat} 3.6s ease-in-out infinite` : undefined }}>
    {/* Idle: gentle float wrapper + cloak breathing (HK-style); disabled while attacking */}
    <svg
      width={KNIGHT_VIEW_WIDTH * scale}
      height={KNIGHT_VIEW_HEIGHT * scale}
      viewBox={`0 0 ${KNIGHT_VIEW_WIDTH} ${KNIGHT_VIEW_HEIGHT}`}
      className="block"
      style={{
        overflow: 'visible',
        transform: isLeft ? 'scaleX(-1)' : 'none',
        filter: `drop-shadow(0 4px 3px rgba(0,0,0,0.45)) drop-shadow(0 0 5px ${DARK_FANTASY.soulBlue}22)`,
      }}
    >
      {/* Ground contact shadow, two soft stacked ellipses (replaces the old glow-only shadow) */}
      <ellipse cx="30" cy={KNIGHT_SOLE_Y} rx="21" ry="4.5" fill={DARK_FANTASY.black} opacity="0.22" />
      <ellipse cx="30" cy={KNIGHT_SOLE_Y} rx="14" ry="3" fill={DARK_FANTASY.black} opacity="0.4" />
      {/* === KNIGHT - 3/4 VIEW FACING RIGHT === */}
      {/* Based on reference image proportions */}

      {/* CLOAK/BODY - small, below head - breathing animation applied here only */}
      <g
        style={{
          transformOrigin: '30px 60px',
          animation: breathing ? `${knight.knightCloakBreathing} 3s ease-in-out infinite` : undefined,
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
          fill={DARK_FANTASY.cloak}
          stroke={DARK_FANTASY.black}
          strokeWidth="1.5"
        />
        {/* Cloak detail - center fold */}
        <path
          d="M30,50 L30,72"
          stroke={DARK_FANTASY.cloakDark}
          strokeWidth="2"
          opacity="0.5"
        />
        {/* Cloak side folds */}
        <path
          d="M22,52 C20,58 20,66 22,72"
          stroke={DARK_FANTASY.cloakDark}
          strokeWidth="1"
          fill="none"
          opacity="0.3"
        />
        <path
          d="M38,52 C40,58 40,66 38,72"
          stroke={DARK_FANTASY.cloakDark}
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
        fill={DARK_FANTASY.white}
        stroke={DARK_FANTASY.black}
        strokeWidth="1.5"
      />

      {/* LEFT HORN - curves UPWARD (crescent pointing up-left) */}
      <path
        d="M14,14
           C10,8 8,2 10,-6
           C14,-4 16,2 18,10
           C16,12 14,14 14,14
           Z"
        fill={DARK_FANTASY.white}
        stroke={DARK_FANTASY.black}
        strokeWidth="1"
      />

      {/* RIGHT HORN - curves UPWARD (crescent pointing up-right) */}
      <path
        d="M46,14
           C50,8 52,2 50,-6
           C46,-4 44,2 42,10
           C44,12 46,14 46,14
           Z"
        fill={DARK_FANTASY.white}
        stroke={DARK_FANTASY.black}
        strokeWidth="1"
      />

      {/* LEFT EYE - large void oval */}
      <ellipse
        cx="22"
        cy="28"
        rx="6"
        ry="9"
        fill={DARK_FANTASY.black}
      />

      {/* RIGHT EYE - large void oval */}
      <ellipse
        cx="38"
        cy="28"
        rx="6"
        ry="9"
        fill={DARK_FANTASY.black}
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
        fill={DARK_FANTASY.beard}
        stroke={DARK_FANTASY.beardDark}
        strokeWidth="0.5"
      />
      {/* Beard texture lines */}
      <path
        d="M24,48 C24,52 26,56 28,58"
        stroke={DARK_FANTASY.beardDark}
        strokeWidth="0.5"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M36,48 C36,52 34,56 32,58"
        stroke={DARK_FANTASY.beardDark}
        strokeWidth="0.5"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M30,46 L30,60"
        stroke={DARK_FANTASY.beardDark}
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
        <rect x="49" y="53" width="6" height="10" rx="1" fill={DARK_FANTASY.cloakDark} stroke={DARK_FANTASY.black} strokeWidth="0.5" />
        {/* Blade */}
        <path
          d="M52,53 L48,35 L52,15 L56,35 L52,53"
          fill={DARK_FANTASY.nail}
          stroke={DARK_FANTASY.silver}
          strokeWidth="0.5"
        />
        {/* Highlight */}
        <line x1="52" y1="50" x2="52" y2="18" stroke={DARK_FANTASY.white} strokeWidth="0.5" opacity="0.5" />
        {attacking && attackPhase > 0.2 && attackPhase < 0.6 && (
          <path
            d="M52,53 L48,35 L52,15 L56,35 L52,53"
            fill={DARK_FANTASY.soulBlue}
            opacity="0.5"
          />
        )}
      </g>

      {/* Ground shadow */}
      <ellipse cx="30" cy={KNIGHT_SOLE_Y - KNIGHT_INNER_SHADOW_RISE} rx="14" ry="2" fill={DARK_FANTASY.black} opacity="0.3" />
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
}

type AnimationPhase = 'idle' | 'knight-enter' | 'knight-raise' | 'slash' | 'content-reveal' | 'complete'

// The slash stage, set on the reveal and read by the panel inside it (DarkFantasyTheme) and the knight: the
// panel's widest, its inset from the stage's top and sides, the knight's size, and how far left of his entry
// place he rests. --panel-half is half the panel: at most half of SLASH_PANEL_REM, and on a narrower screen as
// much as leaves room right of it for the knight and his rest step. From lg he is pinned to the screen, his
// entry place the farther right of the panel's edge plus that rest and 8% in from the screen's right edge,
// never past the screen's right edge. Below lg the panel fills the column, so no place beside it is left: he
// rests standing on the panel's top edge at its right corner, above the panel and its text, at the size the
// combat layer gives him there: his soles on the line the panel's frame draws, FRAME_INSET_REM inside the
// panel's top, his box sunk below that line by --sole-drop, the part of his drawing under his soles.
const SLASH_PANEL_REM = 56
const SLASH_KNIGHT_SCALE = 1.8
const REST_SHIFT_PX = 90
const PHONE_KNIGHT_SCALE = SLASH_KNIGHT_SCALE * COMBAT_PHONE_SCALE
/** How far inside its box the panel's frame (VoidFrame) draws its border, read by the frame and the knight. */
export const FRAME_INSET_REM = 1
const SLASH_STAGE = {
  '--slash-panel': `${SLASH_PANEL_REM}rem`,
  '--panel-top': '2rem',
  '--frame-inset': `${FRAME_INSET_REM}rem`,
  '--sole-drop': `${(KNIGHT_VIEW_HEIGHT - KNIGHT_SOLE_Y) * PHONE_KNIGHT_SCALE}px`,
  '--panel-inset': '1.5rem',
  '--rest': `${REST_SHIFT_PX}px`,
  '--knight-w': `${KNIGHT_VIEW_WIDTH * SLASH_KNIGHT_SCALE}px`,
  '--panel-half': `min(${SLASH_PANEL_REM / 2}rem, 50vw - var(--knight-w) - var(--rest))`,
  minHeight: '200px',
} as CSSProperties

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
}: KnightSlashRevealProps) {
  const [phase, setPhase] = useState<AnimationPhase>('idle')
  const [attackPhase, setAttackPhase] = useState(0)
  const [showSlash, setShowSlash] = useState(false)
  const hasAnimated = useRef(false)
  // continuous in-view so the fixed knight fades out once we scroll past the section
  const { ref: stageRef, inView } = useSectionTrigger(COMBAT_IN_VIEW)

  useEffect(() => {
    // The trigger fires once, so the reveal plays once and the phase starts idle
    if (!triggered || hasAnimated.current) return

    // Mark as animated so we don't replay
    hasAnimated.current = true

    const timers: NodeJS.Timeout[] = []
    // The slash's frame by frame ramp, cancelled with the timers when the reveal unmounts mid slash
    let attackFrame = 0

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
        if (progress < 1) attackFrame = requestAnimationFrame(animateAttack)
      }
      attackFrame = requestAnimationFrame(animateAttack)
    }, PHASE_TIMING['slash']))

    timers.push(setTimeout(() => {
      setShowSlash(false)
      setPhase('content-reveal')
      setAttackPhase(0)
    }, PHASE_TIMING['content-reveal']))

    timers.push(setTimeout(() => setPhase('complete'), PHASE_TIMING['complete']))

    return () => {
      timers.forEach(t => clearTimeout(t))
      cancelAnimationFrame(attackFrame)
    }
  }, [triggered])

  const getKnightStyle = (): React.CSSProperties => {
    switch (phase) {
      case 'idle':
        return { transform: 'translateX(120px)', opacity: 0 }
      case 'knight-enter':
        return { transform: 'translateX(0)', opacity: 1, transition: moveAndFade('200ms ease-out') }
      case 'knight-raise':
        return { transform: 'translateX(-10px)', opacity: 1, transition: moveAndFade('150ms ease-out') }
      case 'slash':
        return { transform: 'translateX(-25px)', opacity: 1, transition: moveAndFade('100ms ease-out') }
      case 'content-reveal':
        return { transform: 'translateX(-70px)', opacity: 0.75, transition: moveAndFade('250ms ease-out') }
      case 'complete':
        // Knight rests closer to content (more to the left)
        return {
          transform: `translateX(-${REST_SHIFT_PX}px)`,
          opacity: 0.7,
          transition: moveAndFade('300ms ease-out'),
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
        return { transform: 'translateX(0)', opacity: 1, transition: moveAndFade('250ms cubic-bezier(0.34, 1.56, 0.64, 1)') }
      case 'complete':
        return { transform: 'translateX(0)', opacity: 1 }
      default:
        return { transform: 'translateX(0)', opacity: 1 }
    }
  }

  const showKnight = phase !== 'idle'
  const isAttacking = phase === 'knight-raise' || phase === 'slash'

  return (
    <div ref={stageRef} className="relative w-full max-lg:overflow-x-clip" style={SLASH_STAGE}>
      {showSlash && (
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent 20%, ${DARK_FANTASY.soulBlue}40 50%, transparent 80%)`,
            animation: `${knight.slashFlash} 100ms ease-out`
          }}
        />
      )}

      {/* COMBAT_Z.content: the transform from getContentStyle() makes this a stacking context;
          without an explicit z-index it sinks below the fixed z-[1..8] background and the fighters */}
      <div className={`relative ${COMBAT_Z.content}`} style={getContentStyle()}>
        {children}
      </div>

      {/* Below lg: the knight stands on the panel frame's top line at its right corner (SLASH_STAGE) */}
      {showKnight && (
        <div
          data-worlds-figure=""
          className="pointer-events-none absolute bottom-[calc(100%_-_var(--panel-top)_-_var(--frame-inset)_-_var(--sole-drop))] right-[calc(var(--panel-inset)_-_var(--rest))] z-20 lg:hidden"
          style={getKnightStyle()}
          aria-hidden="true"
        >
          <KnightCharacter
            scale={PHONE_KNIGHT_SCALE}
            attacking={isAttacking}
            attackPhase={attackPhase}
            facingDirection="left"
            breathing={phase === 'complete'}
          />
        </div>
      )}

      {/* From lg: the knight pinned to the viewport (bottom-right ~15-18%); only the content above scrolls */}
      {showKnight && (
        <FixedCombatLayer inView={inView}>
          <div
            data-worlds-figure=""
            className="absolute bottom-[18%] left-[min(max(calc(50%_+_var(--panel-half)_+_var(--rest)),calc(92%_-_var(--knight-w))),calc(100%_-_var(--knight-w)))] z-20 pointer-events-none max-lg:hidden"
            style={getKnightStyle()}
          >
            <KnightCharacter
              scale={SLASH_KNIGHT_SCALE}
              attacking={isAttacking}
              attackPhase={attackPhase}
              facingDirection="left"
              breathing={phase === 'complete'}
            />
          </div>
        </FixedCombatLayer>
      )}
    </div>
  )
})
