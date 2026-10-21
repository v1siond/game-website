import { BORDERLANDS_COLORS } from './palette'

// Comic book halftone pattern - enhanced with cel-shading gradient
export function HalftoneBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1]"
      aria-hidden="true"
    >
      {/* Base halftone dots */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `radial-gradient(circle, ${BORDERLANDS_COLORS.ink} 1px, transparent 1px)`,
          backgroundSize: '4px 4px',
        }}
      />
      {/* Cel-shading gradient overlay */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `linear-gradient(180deg,
            transparent 0%,
            ${BORDERLANDS_COLORS.dustyOrange}10 25%,
            ${BORDERLANDS_COLORS.sand}20 50%,
            ${BORDERLANDS_COLORS.sunBurn}15 75%,
            ${BORDERLANDS_COLORS.ink}30 100%
          )`,
        }}
      />
    </div>
  )
}

// Wasteland grunge texture overlay - enhanced with graffiti/spray paint effect
export function WastelandTexture() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[2]"
      aria-hidden="true"
    >
      {/* Cross-hatch ink texture */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 2px, ${BORDERLANDS_COLORS.ink} 2px, transparent 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, ${BORDERLANDS_COLORS.ink} 2px, transparent 4px)
          `,
        }}
      />
      {/* Spray paint speckle effect */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, ${BORDERLANDS_COLORS.dustyOrange} 1px, transparent 1px),
            radial-gradient(circle at 80% 70%, ${BORDERLANDS_COLORS.wastelandYellow} 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, ${BORDERLANDS_COLORS.sand} 1px, transparent 1px)
          `,
          backgroundSize: '47px 53px, 31px 37px, 23px 29px',
        }}
      />
      {/* Sand/dust overlay */}
      <div
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage: `linear-gradient(135deg,
            ${BORDERLANDS_COLORS.sand}40 0%,
            transparent 50%,
            ${BORDERLANDS_COLORS.panderanDust}30 100%
          )`,
        }}
      />
    </div>
  )
}

// Psycho mask silhouette decoration
export function PsychoMask({ x, y, size, rotation = 0 }: { x: number; y: number; size: number; rotation?: number }) {
  return (
    <div
      className="fixed pointer-events-none z-[2] opacity-[0.12]"
      aria-hidden="true"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <svg width={size} height={size * 1.2} viewBox="0 0 80 96" fill={BORDERLANDS_COLORS.ink}>
        {/* Psycho mask shape */}
        <ellipse cx="40" cy="48" rx="35" ry="42" />
        {/* Eye holes */}
        <ellipse cx="28" cy="38" rx="8" ry="12" fill={BORDERLANDS_COLORS.paper} />
        <ellipse cx="52" cy="38" rx="8" ry="12" fill={BORDERLANDS_COLORS.paper} />
        {/* Stitched mouth */}
        <path
          d="M20,65 Q28,75 40,75 Q52,75 60,65"
          fill="none"
          stroke={BORDERLANDS_COLORS.paper}
          strokeWidth="3"
        />
        {/* Mouth stitches */}
        <line x1="28" y1="66" x2="28" y2="74" stroke={BORDERLANDS_COLORS.paper} strokeWidth="2" />
        <line x1="36" y1="68" x2="36" y2="75" stroke={BORDERLANDS_COLORS.paper} strokeWidth="2" />
        <line x1="44" y1="68" x2="44" y2="75" stroke={BORDERLANDS_COLORS.paper} strokeWidth="2" />
        <line x1="52" y1="66" x2="52" y2="74" stroke={BORDERLANDS_COLORS.paper} strokeWidth="2" />
      </svg>
    </div>
  )
}

// Graffiti drip decoration
export function GraffitiDrip({ x, y, color, height = 40 }: { x: number; y: number; color: string; height?: number }) {
  return (
    <div
      className="fixed pointer-events-none z-[2] opacity-30"
      aria-hidden="true"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <svg width="20" height={height} viewBox={`0 0 20 ${height}`}>
        <path
          d={`M10,0 Q8,${height * 0.3} 10,${height * 0.5} Q12,${height * 0.7} 10,${height} Q9,${height - 5} 10,${height - 8} Q8,${height * 0.6} 10,${height * 0.4} Q11,${height * 0.2} 10,0`}
          fill={color}
        />
      </svg>
    </div>
  )
}

// Ink splatter decoration - hand-drawn sketch quality
export function InkSplatter({ x, y, size, color = BORDERLANDS_COLORS.ink, rotation = 0 }: { x: number; y: number; size: number; color?: string; rotation?: number }) {
  return (
    <div
      className="fixed pointer-events-none z-[2]"
      aria-hidden="true"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: color,
        borderRadius: '60% 40% 50% 50%',
        transform: `rotate(${rotation}deg)`,
        boxShadow: `3px 3px 0 ${BORDERLANDS_COLORS.ink}`,
        // Hand-drawn wobble effect
        filter: 'url(#borderlands-sketch)',
      }}
    />
  )
}

// Floating damage numbers - respects reduced motion
export function DamageNumber({ x, y, value, color, reducedMotion = false }: { x: number; y: number; value: string; color: string; reducedMotion?: boolean }) {
  return (
    <div
      className={`fixed pointer-events-none z-[3] font-black text-2xl ${reducedMotion ? '' : 'animate-damage-float'}`}
      aria-hidden="true"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        color: color,
        textShadow: `4px 4px 0 ${BORDERLANDS_COLORS.ink}, -1px -1px 0 ${BORDERLANDS_COLORS.ink}, 1px -1px 0 ${BORDERLANDS_COLORS.ink}, -1px 1px 0 ${BORDERLANDS_COLORS.ink}`,
        fontFamily: '"Bangers", "Impact", sans-serif',
        WebkitTextStroke: `2px ${BORDERLANDS_COLORS.ink}`,
      }}
    >
      +{value}
    </div>
  )
}

// Gun silhouette decoration - Jakobs/Hyperion style
export function GunSilhouette({ x, y, rotation, flip }: { x: number; y: number; rotation: number; flip?: boolean }) {
  return (
    <div
      className="fixed pointer-events-none z-[2] opacity-[0.15]"
      aria-hidden="true"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `rotate(${rotation}deg) ${flip ? 'scaleX(-1)' : ''}`,
      }}
    >
      <svg width="140" height="60" viewBox="0 0 140 60" fill={BORDERLANDS_COLORS.ink}>
        {/* Main body with cel-shading */}
        <path
          d="M5,28 L42,28 L47,22 L95,22 L100,16 L130,16 L135,20 L135,28 L125,28 L125,34 L100,34 L100,40 L65,40 L60,34 L47,34 L42,40 L32,40 L32,34 L5,34 Z"
          stroke={BORDERLANDS_COLORS.ink}
          strokeWidth="3"
        />
        {/* Magazine */}
        <rect x="26" y="34" width="18" height="20" rx="2" stroke={BORDERLANDS_COLORS.ink} strokeWidth="2" />
        {/* Scope */}
        <ellipse cx="80" cy="14" rx="8" ry="4" fill={BORDERLANDS_COLORS.rare} opacity="0.6" />
        {/* Trigger detail */}
        <path d="M52,34 L52,44 L48,44" fill="none" stroke={BORDERLANDS_COLORS.ink} strokeWidth="2" />
      </svg>
    </div>
  )
}

// Vault symbol - authentic Borderlands vault key design
export function VaultSymbol({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <div
      className="fixed pointer-events-none z-[2] opacity-[0.12]"
      aria-hidden="true"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        {/* Outer ring with thick ink outline */}
        <circle cx="50" cy="50" r="45" stroke={BORDERLANDS_COLORS.clapTrapYellow} strokeWidth="5" />
        <circle cx="50" cy="50" r="45" stroke={BORDERLANDS_COLORS.ink} strokeWidth="2" strokeDasharray="8 4" />
        {/* Inner ring */}
        <circle cx="50" cy="50" r="30" stroke={BORDERLANDS_COLORS.legendary} strokeWidth="4" />
        {/* Cardinal lines */}
        <line x1="50" y1="5" x2="50" y2="20" stroke={BORDERLANDS_COLORS.clapTrapYellow} strokeWidth="5" />
        <line x1="50" y1="80" x2="50" y2="95" stroke={BORDERLANDS_COLORS.clapTrapYellow} strokeWidth="5" />
        <line x1="5" y1="50" x2="20" y2="50" stroke={BORDERLANDS_COLORS.clapTrapYellow} strokeWidth="5" />
        <line x1="80" y1="50" x2="95" y2="50" stroke={BORDERLANDS_COLORS.clapTrapYellow} strokeWidth="5" />
        {/* V-shape (Vault symbol core) */}
        <path d="M35,35 L50,55 L65,35" stroke={BORDERLANDS_COLORS.legendary} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Bottom detail */}
        <path d="M42,60 L50,70 L58,60" stroke={BORDERLANDS_COLORS.clapTrapYellow} strokeWidth="3" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  )
}

// Claptrap robot silhouette - with cel-shaded details
export function ClaptrapSilhouette({ x, y, reducedMotion = false }: { x: number; y: number; reducedMotion?: boolean }) {
  return (
    <div
      className="fixed pointer-events-none z-[2] opacity-[0.18]"
      aria-hidden="true"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <svg width="80" height="100" viewBox="0 0 80 100">
        {/* Body with outline */}
        <rect x="15" y="30" width="50" height="45" rx="5" fill={BORDERLANDS_COLORS.ink} stroke={BORDERLANDS_COLORS.ink} strokeWidth="3" />
        {/* Body highlight (cel-shading) */}
        <rect x="18" y="33" width="20" height="39" rx="3" fill={BORDERLANDS_COLORS.clapTrapYellow} opacity="0.3" />
        {/* Eye */}
        <circle cx="40" cy="50" r="14" fill={BORDERLANDS_COLORS.paper} stroke={BORDERLANDS_COLORS.ink} strokeWidth="3" />
        <circle cx="40" cy="50" r="9" fill={BORDERLANDS_COLORS.rare} />
        <circle cx="43" cy="47" r="4" fill="#fff" />
        {/* Eye glow */}
        <circle cx="40" cy="50" r="9" fill="none" stroke={BORDERLANDS_COLORS.rare} strokeWidth="2" opacity="0.5" className={reducedMotion ? '' : 'animate-pulse'} />
        {/* Antenna */}
        <rect x="37" y="10" width="6" height="20" fill={BORDERLANDS_COLORS.ink} />
        <circle cx="40" cy="10" r="6" fill={BORDERLANDS_COLORS.clapTrapYellow} stroke={BORDERLANDS_COLORS.ink} strokeWidth="2" />
        {/* Wheel */}
        <circle cx="40" cy="85" r="13" fill={BORDERLANDS_COLORS.ink} />
        <circle cx="40" cy="85" r="7" fill={BORDERLANDS_COLORS.paper} />
        <circle cx="40" cy="85" r="3" fill={BORDERLANDS_COLORS.ink} />
        {/* Arms */}
        <rect x="0" y="40" width="15" height="8" rx="2" fill={BORDERLANDS_COLORS.ink} />
        <rect x="65" y="40" width="15" height="8" rx="2" fill={BORDERLANDS_COLORS.ink} />
        {/* Arm joints */}
        <circle cx="15" cy="44" r="4" fill={BORDERLANDS_COLORS.clapTrapYellow} />
        <circle cx="65" cy="44" r="4" fill={BORDERLANDS_COLORS.clapTrapYellow} />
      </svg>
    </div>
  )
}

// Explosion burst decoration - comic book action word
export function ExplosionBurst({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <div
      className="fixed pointer-events-none z-[4]"
      aria-hidden="true"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <svg width="120" height="80" viewBox="0 0 120 80">
        {/* Outer burst with cel-shading */}
        <polygon
          points="60,2 72,22 98,17 82,38 105,55 73,48 60,78 47,48 15,55 38,38 22,17 48,22"
          fill={BORDERLANDS_COLORS.legendary}
          stroke={BORDERLANDS_COLORS.ink}
          strokeWidth="4"
        />
        {/* Inner highlight burst */}
        <polygon
          points="60,12 68,26 88,22 76,38 92,50 69,45 60,68 51,45 28,50 44,38 32,22 52,26"
          fill={BORDERLANDS_COLORS.clapTrapYellow}
          stroke={BORDERLANDS_COLORS.ink}
          strokeWidth="2"
        />
        {/* Action text */}
        <text
          x="60"
          y="44"
          textAnchor="middle"
          fill={BORDERLANDS_COLORS.ink}
          fontSize="14"
          fontWeight="900"
          fontFamily="Bangers, Impact, sans-serif"
          style={{ letterSpacing: '1px' }}
        >
          {text}
        </text>
      </svg>
    </div>
  )
}
