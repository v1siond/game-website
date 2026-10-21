import { useEffect, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { COLORS } from './palette'

// Tropical Platformer: the small SVG icons (fruit, gems, crystals, crates, masks, portal) the panels,
// cards, art and backdrop are dressed with.

// ============================================================================
// WUMPA FRUIT - The iconic apple-mango hybrid collectible
// ============================================================================
export function WumpaFruit({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Wumpa fruit"
    >
      {/* Main fruit body - apple-mango hybrid shape */}
      <ellipse cx="16" cy="18" rx="12" ry="11" fill={COLORS.wumpaOrange} />
      {/* Inner gradient simulation */}
      <ellipse cx="16" cy="18" rx="10" ry="9" fill={COLORS.wumpaGold} opacity="0.4" />
      {/* Highlight - top left shine */}
      <ellipse cx="11" cy="13" rx="4" ry="3" fill="#FFCC66" opacity="0.7" />
      {/* Stem */}
      <rect x="14" y="5" width="4" height="5" fill={COLORS.crateWood} rx="1" />
      {/* Left leaf */}
      <path d="M14 7 Q8 4 10 0 Q14 3 16 6 Z" fill={COLORS.jungleGreen} />
      {/* Right leaf */}
      <path d="M18 7 Q24 4 22 0 Q18 3 16 6 Z" fill={COLORS.jungleLime} />
      {/* Bottom shadow */}
      <ellipse cx="16" cy="28" rx="8" ry="2" fill="rgba(0,0,0,0.2)" />
    </svg>
  )
}

// ============================================================================
// GEM ICON - Collectible gems (clear, red, blue, green, yellow, purple)
// ============================================================================
export function GemIcon({
  size = 24,
  color = 'clear',
  className = ''
}: {
  size?: number
  color?: 'clear' | 'red' | 'blue' | 'green' | 'yellow' | 'purple'
  className?: string
}) {
  const gemColors = {
    clear: { main: COLORS.gemClear, dark: '#B0B0B0', light: '#FFFFFF' },
    red: { main: COLORS.gemRed, dark: '#CC1144', light: '#FF6699' },
    blue: { main: COLORS.gemBlue, dark: '#0099CC', light: '#66DDFF' },
    green: { main: COLORS.gemGreen, dark: '#00CC77', light: '#66FFBB' },
    yellow: { main: COLORS.gemYellow, dark: '#CCCC00', light: '#FFFF66' },
    purple: { main: COLORS.gemPurple, dark: '#9933CC', light: '#DD77FF' },
  }
  const c = gemColors[color]

  return (
    <svg
      viewBox="0 0 24 28"
      width={size}
      height={size * 1.17}
      className={className}
      role="img"
      aria-label={`${color} gem`}
    >
      {/* Diamond shape - top half */}
      <path d="M12 2 L22 12 L12 15 L2 12 Z" fill={c.main} />
      {/* Diamond shape - bottom half */}
      <path d="M12 15 L22 12 L12 26 L2 12 Z" fill={c.dark} />
      {/* Left facet */}
      <path d="M12 2 L2 12 L12 15 Z" fill={c.light} opacity="0.4" />
      {/* Top shine */}
      <path d="M8 8 L12 4 L14 8 L12 10 Z" fill="white" opacity="0.6" />
      {/* Outer glow */}
      <ellipse cx="12" cy="14" rx="14" ry="16" fill={`url(#gemGlow-${color})`} opacity="0.3" />
      <defs>
        <radialGradient id={`gemGlow-${color}`}>
          <stop offset="0%" stopColor={c.main} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </svg>
  )
}

// ============================================================================
// CRYSTAL - Power crystals (Crash 2/3 collectible)
// ============================================================================
export function Crystal({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 36"
      width={size}
      height={size * 1.5}
      className={className}
      role="img"
      aria-label="Power crystal"
    >
      {/* Main crystal body */}
      <path d="M12 2 L20 10 L20 28 L12 34 L4 28 L4 10 Z" fill={COLORS.cortexPurple} />
      {/* Right facet - darker */}
      <path d="M12 2 L20 10 L20 28 L12 34 Z" fill={COLORS.cortexOrchid} opacity="0.7" />
      {/* Left facet - lighter */}
      <path d="M12 2 L4 10 L4 28 L12 34 Z" fill={COLORS.cortexPurple} />
      {/* Center line */}
      <path d="M12 2 L12 34" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      {/* Top shine */}
      <path d="M8 10 L12 5 L14 10 L12 14 Z" fill="white" opacity="0.5" />
      {/* Glow effect */}
      <ellipse cx="12" cy="18" rx="14" ry="20" fill="url(#crystalGlow)" opacity="0.4" />
      <defs>
        <radialGradient id="crystalGlow">
          <stop offset="0%" stopColor={COLORS.cortexOrchid} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </svg>
  )
}

// ============================================================================
// AKU AKU MASK - The iconic tiki mask with feathers
// ============================================================================
export function AkuAkuMask({
  size = 60,
  className = '',
  animated = true
}: {
  size?: number
  className?: string
  animated?: boolean
}) {
  const reducedMotion = useReducedMotion()
  const shouldAnimate = animated && !reducedMotion

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size * 1.5 }}
      role="img"
      aria-label="Aku Aku tiki mask - protective spirit from Crash Bandicoot"
    >
      <svg viewBox="0 0 50 75" width={size} height={size * 1.5}>
        {/* Feathers on top - 5 colorful feathers */}
        <ellipse cx="10" cy="8" rx="4" ry="12" fill={COLORS.tntRed} transform="rotate(-35 10 8)" />
        <ellipse cx="17" cy="5" rx="3" ry="10" fill={COLORS.jungleLime} transform="rotate(-15 17 5)" />
        <ellipse cx="25" cy="3" rx="4" ry="14" fill={COLORS.maskYellow} />
        <ellipse cx="33" cy="5" rx="3" ry="10" fill={COLORS.oceanBlue} transform="rotate(15 33 5)" />
        <ellipse cx="40" cy="8" rx="4" ry="12" fill={COLORS.cortexPurple} transform="rotate(35 40 8)" />

        {/* Feather details - stripes */}
        <line x1="25" y1="3" x2="25" y2="15" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
        <line x1="10" y1="5" x2="10" y2="18" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" transform="rotate(-35 10 8)" />
        <line x1="40" y1="5" x2="40" y2="18" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" transform="rotate(35 40 8)" />

        {/* Main mask face - carved wood shape */}
        <path
          d="M10 20 Q5 30 7 50 Q10 65 25 70 Q40 65 43 50 Q45 30 40 20 Q35 12 25 12 Q15 12 10 20 Z"
          fill={COLORS.crateWood}
        />

        {/* Wood grain texture */}
        <path d="M15 25 Q20 28 20 45" stroke={COLORS.crateSienna} strokeWidth="0.8" fill="none" opacity="0.4" />
        <path d="M35 25 Q30 28 30 45" stroke={COLORS.crateSienna} strokeWidth="0.8" fill="none" opacity="0.4" />
        <path d="M25 20 Q25 35 25 55" stroke={COLORS.crateSienna} strokeWidth="0.5" fill="none" opacity="0.3" />

        {/* Eye sockets - glowing yellow/gold */}
        <ellipse cx="17" cy="32" rx="6" ry="7" fill={COLORS.maskYellow} />
        <ellipse cx="33" cy="32" rx="6" ry="7" fill={COLORS.maskYellow} />

        {/* Inner eye glow */}
        <ellipse cx="17" cy="32" rx="4" ry="5" fill={COLORS.maskGold} />
        <ellipse cx="33" cy="32" rx="4" ry="5" fill={COLORS.maskGold} />

        {/* Pupils - white with black centers */}
        <circle cx="17" cy="32" r="3" fill="white" />
        <circle cx="33" cy="32" r="3" fill="white" />
        <circle cx="17" cy="32" r="1.5" fill="black" />
        <circle cx="33" cy="32" r="1.5" fill="black" />

        {/* Tribal eyebrow markings */}
        <path d="M10 25 Q14 20 20 25" stroke={COLORS.maskYellow} strokeWidth="2" fill="none" />
        <path d="M30 25 Q36 20 40 25" stroke={COLORS.maskYellow} strokeWidth="2" fill="none" />

        {/* Nose - triangular carved shape */}
        <path d="M22 38 L25 50 L28 38 Z" fill="#5C3D1A" />
        <path d="M25 38 L25 48" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />

        {/* Mouth - tribal zigzag pattern with teeth */}
        <path
          d="M14 54 Q17 52 20 54 Q23 52 25 54 Q27 52 30 54 Q33 52 36 54 Q34 60 25 62 Q16 60 14 54 Z"
          fill={COLORS.tntRed}
        />

        {/* Teeth - rectangular blocks */}
        <rect x="16" y="54" width="3" height="4" fill="white" rx="0.5" />
        <rect x="21" y="54" width="3" height="4" fill="white" rx="0.5" />
        <rect x="26" y="54" width="3" height="4" fill="white" rx="0.5" />
        <rect x="31" y="54" width="3" height="4" fill="white" rx="0.5" />

        {/* Tribal side decorations - bone/tusk shapes */}
        <ellipse cx="5" cy="40" rx="3" ry="8" fill={COLORS.beachTan} />
        <ellipse cx="45" cy="40" rx="3" ry="8" fill={COLORS.beachTan} />

        {/* Side tribal markings */}
        <path d="M7 45 L5 50 L7 55" stroke={COLORS.maskYellow} strokeWidth="2" fill="none" />
        <path d="M43 45 L45 50 L43 55" stroke={COLORS.maskYellow} strokeWidth="2" fill="none" />

        {/* Chin marking */}
        <path d="M20 65 Q25 68 30 65" stroke={COLORS.maskYellow} strokeWidth="1.5" fill="none" />
      </svg>

      {/* Mystical glow effect */}
      {shouldAnimate && (
        <div
          className="absolute inset-0 animate-aku-glow"
          style={{
            background: `radial-gradient(circle at 50% 45%, ${COLORS.maskYellow}50 0%, transparent 60%)`,
            filter: 'blur(6px)',
          }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

// ============================================================================
// CRASH SILHOUETTE - Spiky hair, jeans character outline
// ============================================================================
export function CrashSilhouette({ size = 60, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 40 60"
      width={size}
      height={size * 1.5}
      className={className}
      role="img"
      aria-label="Crash Bandicoot silhouette"
    >
      {/* Spiky mohawk hair */}
      <path d="M15 8 L17 0 L20 6 L23 0 L25 8" fill={COLORS.crashOrange} />

      {/* Head */}
      <ellipse cx="20" cy="14" rx="10" ry="9" fill={COLORS.crashOrange} />

      {/* Ears */}
      <ellipse cx="8" cy="10" rx="4" ry="5" fill={COLORS.crashOrange} />
      <ellipse cx="32" cy="10" rx="4" ry="5" fill={COLORS.crashOrange} />
      <ellipse cx="8" cy="10" rx="2" ry="3" fill={COLORS.beachTan} />
      <ellipse cx="32" cy="10" rx="2" ry="3" fill={COLORS.beachTan} />

      {/* Face - snout area */}
      <ellipse cx="20" cy="18" rx="6" ry="4" fill={COLORS.beachTan} />

      {/* Eyes */}
      <ellipse cx="15" cy="13" rx="3" ry="4" fill="white" />
      <ellipse cx="25" cy="13" rx="3" ry="4" fill="white" />
      <circle cx="15" cy="13" r="2" fill={COLORS.jungleDark} />
      <circle cx="25" cy="13" r="2" fill={COLORS.jungleDark} />

      {/* Nose */}
      <ellipse cx="20" cy="16" rx="2" ry="1.5" fill="#333" />

      {/* Big grin */}
      <path d="M14 19 Q20 24 26 19" stroke="#333" strokeWidth="1" fill="none" />

      {/* Body - blue jeans style */}
      <rect x="12" y="23" width="16" height="20" fill={COLORS.oceanRoyal} rx="3" />

      {/* Belt */}
      <rect x="12" y="25" width="16" height="3" fill={COLORS.crateWood} />

      {/* Arms */}
      <ellipse cx="8" cy="32" rx="4" ry="6" fill={COLORS.crashOrange} />
      <ellipse cx="32" cy="32" rx="4" ry="6" fill={COLORS.crashOrange} />

      {/* Gloves */}
      <ellipse cx="8" cy="38" rx="4" ry="3" fill={COLORS.tntRed} />
      <ellipse cx="32" cy="38" rx="4" ry="3" fill={COLORS.tntRed} />

      {/* Legs */}
      <rect x="13" y="43" width="6" height="12" fill={COLORS.oceanRoyal} />
      <rect x="21" y="43" width="6" height="12" fill={COLORS.oceanRoyal} />

      {/* Shoes */}
      <ellipse cx="16" cy="57" rx="5" ry="3" fill={COLORS.tntRed} />
      <ellipse cx="24" cy="57" rx="5" ry="3" fill={COLORS.tntRed} />
    </svg>
  )
}

// ============================================================================
// TNT CRATE - Red explosive with countdown
// ============================================================================
export function TNTCrate({
  size = 40,
  className = '',
  countdown = false
}: {
  size?: number
  className?: string
  countdown?: boolean
}) {
  const reducedMotion = useReducedMotion()
  const [count, setCount] = useState(3)

  useEffect(() => {
    if (!countdown || reducedMotion) return
    const interval = setInterval(() => {
      setCount(c => c <= 1 ? 3 : c - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [countdown, reducedMotion])

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="TNT crate - explosive box"
    >
      <svg viewBox="0 0 40 40" width={size} height={size}>
        {/* Main crate body - red */}
        <rect x="2" y="2" width="36" height="36" fill={COLORS.tntRed} stroke={COLORS.tntDark} strokeWidth="2" rx="2" />

        {/* Wood plank texture lines */}
        <line x1="2" y1="14" x2="38" y2="14" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
        <line x1="2" y1="26" x2="38" y2="26" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
        <line x1="14" y1="2" x2="14" y2="38" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
        <line x1="26" y1="2" x2="26" y2="38" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />

        {/* Corner metal brackets */}
        <path d="M2 8 L8 8 L8 2" stroke={COLORS.crateWood} strokeWidth="3" fill="none" />
        <path d="M38 8 L32 8 L32 2" stroke={COLORS.crateWood} strokeWidth="3" fill="none" />
        <path d="M2 32 L8 32 L8 38" stroke={COLORS.crateWood} strokeWidth="3" fill="none" />
        <path d="M38 32 L32 32 L32 38" stroke={COLORS.crateWood} strokeWidth="3" fill="none" />

        {/* TNT Text - bold impact style */}
        <text
          x="20" y="24"
          textAnchor="middle"
          fill="white"
          fontWeight="900"
          fontSize="11"
          fontFamily="Impact, Arial Black, sans-serif"
          style={{ textShadow: '1px 1px 0 #000' }}
        >
          TNT
        </text>

        {/* Countdown number */}
        {countdown && (
          <text
            x="20" y="35"
            textAnchor="middle"
            fill={COLORS.maskYellow}
            fontWeight="bold"
            fontSize="8"
            fontFamily="monospace"
          >
            {count}
          </text>
        )}
      </svg>

      {/* Danger pulse glow */}
      {!reducedMotion && (
        <div
          className="absolute inset-0 animate-tnt-pulse"
          style={{
            background: `radial-gradient(circle, ${COLORS.tntRed}40 0%, transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

// ============================================================================
// NITRO CRATE - Green instant explosion
// ============================================================================
export function NitroCrate({ size = 40, className = '' }: { size?: number; className?: string }) {
  const reducedMotion = useReducedMotion()

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Nitro crate - instant explosion"
    >
      <svg viewBox="0 0 40 40" width={size} height={size}>
        {/* Main crate body - green */}
        <rect x="2" y="2" width="36" height="36" fill={COLORS.nitroGreen} stroke={COLORS.nitroBright} strokeWidth="2" rx="2" />

        {/* Warning stripes - yellow */}
        <rect x="2" y="10" width="36" height="4" fill={COLORS.maskYellow} />
        <rect x="2" y="26" width="36" height="4" fill={COLORS.maskYellow} />

        {/* Exclamation mark */}
        <rect x="17" y="15" width="6" height="8" fill={COLORS.maskYellow} rx="1" />
        <circle cx="20" cy="28" r="3" fill={COLORS.maskYellow} />

        {/* Corner brackets */}
        <path d="M2 8 L8 8 L8 2" stroke={COLORS.maskYellow} strokeWidth="2" fill="none" />
        <path d="M38 8 L32 8 L32 2" stroke={COLORS.maskYellow} strokeWidth="2" fill="none" />
        <path d="M2 32 L8 32 L8 38" stroke={COLORS.maskYellow} strokeWidth="2" fill="none" />
        <path d="M38 32 L32 32 L32 38" stroke={COLORS.maskYellow} strokeWidth="2" fill="none" />
      </svg>

      {/* Toxic glow */}
      {!reducedMotion && (
        <div
          className="absolute inset-0 animate-nitro-glow"
          style={{
            background: `radial-gradient(circle, ${COLORS.nitroBright}30 0%, transparent 60%)`,
          }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

// ============================================================================
// WOODEN CRATE - Basic/Bouncy/Checkpoint variants
// ============================================================================
export function WoodenCrate({
  size = 40,
  className = '',
  variant = 'basic'
}: {
  size?: number
  className?: string
  variant?: 'basic' | 'bouncy' | 'checkpoint' | 'questionmark'
}) {
  const variants = {
    basic: { fill: COLORS.crateWood, stroke: COLORS.cratePeru, icon: null, iconColor: null },
    bouncy: { fill: COLORS.jungleGreen, stroke: COLORS.jungleLime, icon: 'arrow', iconColor: 'white' },
    checkpoint: { fill: COLORS.crateWood, stroke: COLORS.maskYellow, icon: 'C', iconColor: COLORS.maskYellow },
    questionmark: { fill: COLORS.crateWood, stroke: COLORS.cratePeru, icon: '?', iconColor: COLORS.maskYellow },
  }
  const v = variants[variant]

  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`${variant} crate`}
    >
      {/* Main crate body */}
      <rect x="2" y="2" width="36" height="36" fill={v.fill} stroke={v.stroke} strokeWidth="2" rx="2" />

      {/* Wood plank pattern - horizontal */}
      <line x1="2" y1="14" x2="38" y2="14" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
      <line x1="2" y1="26" x2="38" y2="26" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />

      {/* Wood plank pattern - vertical on top/bottom sections */}
      <line x1="14" y1="2" x2="14" y2="14" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
      <line x1="26" y1="2" x2="26" y2="14" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
      <line x1="14" y1="26" x2="14" y2="38" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
      <line x1="26" y1="26" x2="26" y2="38" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />

      {/* Metal corner brackets */}
      <rect x="3" y="3" width="5" height="5" fill="#666" rx="1" />
      <rect x="32" y="3" width="5" height="5" fill="#666" rx="1" />
      <rect x="3" y="32" width="5" height="5" fill="#666" rx="1" />
      <rect x="32" y="32" width="5" height="5" fill="#666" rx="1" />

      {/* Variant icons */}
      {v.icon === 'arrow' && (
        <path d="M20 10 L28 20 L23 20 L23 30 L17 30 L17 20 L12 20 Z" fill={v.iconColor} />
      )}
      {v.icon === 'C' && (
        <text x="20" y="27" textAnchor="middle" fill={v.iconColor} fontWeight="bold" fontSize="18" fontFamily="Impact, sans-serif">C</text>
      )}
      {v.icon === '?' && (
        <text x="20" y="28" textAnchor="middle" fill={v.iconColor} fontWeight="bold" fontSize="20" fontFamily="Impact, sans-serif">?</text>
      )}
    </svg>
  )
}

// ============================================================================
// TIKI TOTEM - Decorative jungle totem pole
// ============================================================================
export function TikiTotem({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 30 60"
      width={size}
      height={size * 2}
      className={className}
      role="img"
      aria-label="Tiki totem"
    >
      {/* Totem base */}
      <rect x="8" y="50" width="14" height="10" fill={COLORS.crateWood} />

      {/* Main totem body */}
      <rect x="5" y="10" width="20" height="40" fill={COLORS.crateWood} rx="2" />

      {/* Top cap */}
      <rect x="3" y="5" width="24" height="8" fill={COLORS.crateSienna} rx="2" />

      {/* Face 1 - top angry face */}
      <ellipse cx="11" cy="18" rx="3" ry="4" fill={COLORS.maskYellow} />
      <ellipse cx="19" cy="18" rx="3" ry="4" fill={COLORS.maskYellow} />
      <circle cx="11" cy="18" r="1.5" fill="black" />
      <circle cx="19" cy="18" r="1.5" fill="black" />
      <path d="M9 14 L14 16" stroke={COLORS.tntRed} strokeWidth="2" />
      <path d="M21 14 L16 16" stroke={COLORS.tntRed} strokeWidth="2" />
      <path d="M10 24 Q15 28 20 24" stroke={COLORS.tntRed} strokeWidth="2" fill="none" />

      {/* Divider */}
      <rect x="5" y="28" width="20" height="3" fill={COLORS.jungleGreen} />

      {/* Face 2 - bottom happy face */}
      <ellipse cx="11" cy="38" rx="3" ry="4" fill={COLORS.maskYellow} />
      <ellipse cx="19" cy="38" rx="3" ry="4" fill={COLORS.maskYellow} />
      <circle cx="11" cy="38" r="1.5" fill="black" />
      <circle cx="19" cy="38" r="1.5" fill="black" />
      <path d="M10 42 Q15 46 20 42" stroke={COLORS.tntRed} strokeWidth="2" fill="none" />
    </svg>
  )
}

// ============================================================================
// TIME TRIAL CLOCK - Floating time icon
// ============================================================================
export function TimeTrialClock({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Time trial clock"
    >
      {/* Clock face */}
      <circle cx="16" cy="16" r="14" fill={COLORS.timeGold} stroke={COLORS.crashOrangeDark} strokeWidth="2" />
      <circle cx="16" cy="16" r="11" fill="white" />

      {/* Clock markings */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
        <line
          key={angle}
          x1={16 + 9 * Math.cos((angle - 90) * Math.PI / 180)}
          y1={16 + 9 * Math.sin((angle - 90) * Math.PI / 180)}
          x2={16 + 11 * Math.cos((angle - 90) * Math.PI / 180)}
          y2={16 + 11 * Math.sin((angle - 90) * Math.PI / 180)}
          stroke="#333"
          strokeWidth={angle % 90 === 0 ? "2" : "1"}
        />
      ))}

      {/* Clock hands */}
      <line x1="16" y1="16" x2="16" y2="7" stroke="#333" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="16" x2="22" y2="16" stroke={COLORS.tntRed} strokeWidth="1.5" strokeLinecap="round" />

      {/* Center dot */}
      <circle cx="16" cy="16" r="2" fill="#333" />
    </svg>
  )
}

// ============================================================================
// WARP PORTAL - Swirling vortex effect
// ============================================================================
export function WarpPortal({
  size = 100,
  className = '',
  reducedMotion = false
}: {
  size?: number
  className?: string
  reducedMotion?: boolean
}) {
  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Warp portal"
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        {/* Outer glow ring */}
        <circle
          cx="50" cy="50" r="48"
          fill="none"
          stroke={COLORS.warpPurple}
          strokeWidth="4"
          opacity="0.5"
        />

        {/* Swirl rings - animated */}
        <circle
          cx="50" cy="50" r="40"
          fill="none"
          stroke={COLORS.warpBlue}
          strokeWidth="6"
          strokeDasharray="25 10"
          className={reducedMotion ? '' : 'animate-warp-spin'}
        />
        <circle
          cx="50" cy="50" r="30"
          fill="none"
          stroke={COLORS.warpPink}
          strokeWidth="5"
          strokeDasharray="20 8"
          className={reducedMotion ? '' : 'animate-warp-spin-reverse'}
        />
        <circle
          cx="50" cy="50" r="20"
          fill="none"
          stroke={COLORS.warpPurple}
          strokeWidth="4"
          strokeDasharray="15 6"
          className={reducedMotion ? '' : 'animate-warp-spin'}
        />

        {/* Center vortex */}
        <circle cx="50" cy="50" r="12" fill={COLORS.warpPurple} opacity="0.8" />
        <circle cx="50" cy="50" r="8" fill={COLORS.warpBlue} opacity="0.9" />
        <circle cx="50" cy="50" r="4" fill="white" />

        {/* Sparkle effects */}
        <circle cx="30" cy="25" r="2" fill="white" opacity="0.8" />
        <circle cx="70" cy="30" r="1.5" fill="white" opacity="0.7" />
        <circle cx="25" cy="60" r="1" fill="white" opacity="0.6" />
        <circle cx="75" cy="70" r="2" fill="white" opacity="0.8" />
      </svg>

      {/* Portal glow */}
      {!reducedMotion && (
        <div
          className="absolute inset-0 animate-portal-pulse"
          style={{
            background: `radial-gradient(circle, ${COLORS.warpPurple}40 0%, transparent 70%)`,
            filter: 'blur(8px)',
          }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}
