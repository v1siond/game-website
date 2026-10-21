import {
  IRRADIATED_GREEN,
  NUKA_RED,
  NUKA_RED_DARK,
  PIPBOY_GREEN,
  RUST_ORANGE,
  TERMINAL_AMBER,
  VAULT_BLUE,
  VAULT_BLUE_DARK,
  VAULT_YELLOW,
  VAULT_YELLOW_DIM,
  WASTELAND_BROWN_DARK,
  WASTELAND_BROWN_MED,
} from './palette'

// Retro Atomic's SVG icons and props.

export function RadiationSymbol({
  size = 24,
  color = VAULT_YELLOW,
  className = ''
}: {
  size?: number
  color?: string
  className?: string
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="12" fill={color} />
      <path d="M50 10 A40 40 0 0 1 84.6 30 L60 45 A10 10 0 0 0 50 38 Z" fill={color} />
      <path d="M84.6 70 A40 40 0 0 1 15.4 70 L40 55 A10 10 0 0 0 60 55 Z" fill={color} />
      <path d="M15.4 30 A40 40 0 0 1 50 10 L50 38 A10 10 0 0 0 40 45 Z" fill={color} />
    </svg>
  )
}

export function AtomSymbol({
  size = 24,
  color = PIPBOY_GREEN
}: {
  size?: number
  color?: string
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="6" fill={color} />
      <ellipse cx="50" cy="50" rx="42" ry="14" fill="none" stroke={color} strokeWidth="2" />
      <ellipse cx="50" cy="50" rx="42" ry="14" fill="none" stroke={color} strokeWidth="2" transform="rotate(60 50 50)" />
      <ellipse cx="50" cy="50" rx="42" ry="14" fill="none" stroke={color} strokeWidth="2" transform="rotate(120 50 50)" />
      {/* Electron dots */}
      <circle cx="92" cy="50" r="4" fill={color}>
        <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="50" cy="92" r="4" fill={color}>
        <animateTransform attributeName="transform" type="rotate" from="60 50 50" to="420 50 50" dur="5s" repeatCount="indefinite" />
      </circle>
      <circle cx="8" cy="50" r="4" fill={color}>
        <animateTransform attributeName="transform" type="rotate" from="120 50 50" to="480 50 50" dur="6s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

export function BottleCap({
  size = 24,
  count
}: {
  size?: number
  count?: number
}) {
  return (
    <div className="flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
        {/* Cap base */}
        <circle cx="50" cy="50" r="45" fill={VAULT_YELLOW_DIM} />
        <circle cx="50" cy="50" r="40" fill={VAULT_YELLOW} />
        {/* Crimped edges */}
        {[...Array(20)].map((_, i) => (
          <path
            key={i}
            d={`M${50 + 38 * Math.cos((i * 18 * Math.PI) / 180)} ${50 + 38 * Math.sin((i * 18 * Math.PI) / 180)}
                L${50 + 45 * Math.cos((i * 18 * Math.PI) / 180)} ${50 + 45 * Math.sin((i * 18 * Math.PI) / 180)}`}
            stroke={WASTELAND_BROWN_DARK}
            strokeWidth="4"
            strokeLinecap="round"
          />
        ))}
        {/* Inner ring */}
        <circle cx="50" cy="50" r="30" fill="none" stroke={WASTELAND_BROWN_MED} strokeWidth="2" />
        {/* Nuka label */}
        <text x="50" y="52" textAnchor="middle" fill={NUKA_RED} fontSize="18" fontWeight="bold" fontFamily="monospace">
          N
        </text>
        <circle cx="50" cy="60" r="3" fill={NUKA_RED} />
      </svg>
      {count !== undefined && (
        <span
          className="font-mono font-bold text-sm"
          style={{ color: VAULT_YELLOW, textShadow: `0 0 6px ${VAULT_YELLOW}60` }}
        >
          {count.toLocaleString()}
        </span>
      )}
    </div>
  )
}

export function VaultBoy({
  size = 80,
  expression = 'thumbsUp'
}: {
  size?: number
  expression?: 'thumbsUp' | 'pointing' | 'welcoming'
}) {
  // Vault Boy silhouette - iconic thumbs up pose
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      {/* Head */}
      <circle cx="50" cy="22" r="16" fill={VAULT_YELLOW} />
      {/* Simple face features */}
      <circle cx="44" cy="20" r="2" fill={VAULT_BLUE} />
      <circle cx="56" cy="20" r="2" fill={VAULT_BLUE} />
      <path d="M44 28 Q50 32 56 28" fill="none" stroke={VAULT_BLUE} strokeWidth="2" strokeLinecap="round" />
      {/* Hair swoop */}
      <path d="M35 16 Q40 6 55 14" fill="none" stroke={VAULT_YELLOW_DIM} strokeWidth="3" />
      {/* Body (vault suit) */}
      <path d="M38 36 L38 60 L62 60 L62 36 Q50 32 38 36" fill={VAULT_BLUE} />
      {/* Collar */}
      <path d="M44 36 L50 42 L56 36" fill="none" stroke={VAULT_YELLOW} strokeWidth="2" />
      {expression === 'thumbsUp' && (
        <>
          {/* Right arm - thumbs up */}
          <path d="M62 40 Q75 35 72 20" fill={VAULT_YELLOW} stroke={VAULT_YELLOW} strokeWidth="8" strokeLinecap="round" />
          {/* Thumb */}
          <path d="M72 20 L68 12" stroke={VAULT_YELLOW} strokeWidth="6" strokeLinecap="round" />
          {/* Left arm down */}
          <path d="M38 40 Q28 50 25 60" fill="none" stroke={VAULT_YELLOW} strokeWidth="6" strokeLinecap="round" />
        </>
      )}
      {expression === 'pointing' && (
        <>
          {/* Right arm pointing */}
          <path d="M62 40 Q80 38 90 35" fill="none" stroke={VAULT_YELLOW} strokeWidth="6" strokeLinecap="round" />
          {/* Left arm on hip */}
          <path d="M38 40 Q30 45 35 55" fill="none" stroke={VAULT_YELLOW} strokeWidth="6" strokeLinecap="round" />
        </>
      )}
      {expression === 'welcoming' && (
        <>
          {/* Both arms up */}
          <path d="M62 38 Q75 30 80 20" fill="none" stroke={VAULT_YELLOW} strokeWidth="6" strokeLinecap="round" />
          <path d="M38 38 Q25 30 20 20" fill="none" stroke={VAULT_YELLOW} strokeWidth="6" strokeLinecap="round" />
        </>
      )}
      {/* Legs */}
      <path d="M42 60 L40 85" stroke={VAULT_BLUE} strokeWidth="8" strokeLinecap="round" />
      <path d="M58 60 L60 85" stroke={VAULT_BLUE} strokeWidth="8" strokeLinecap="round" />
      {/* Boots */}
      <ellipse cx="40" cy="90" rx="8" ry="5" fill={WASTELAND_BROWN_DARK} />
      <ellipse cx="60" cy="90" rx="8" ry="5" fill={WASTELAND_BROWN_DARK} />
    </svg>
  )
}

export function VaultDoor({ size = 100 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      {/* Outer frame */}
      <circle cx="50" cy="50" r="48" fill="none" stroke={WASTELAND_BROWN_MED} strokeWidth="4" />
      {/* Door */}
      <circle cx="50" cy="50" r="42" fill={VAULT_BLUE_DARK} />
      {/* Inner details */}
      <circle cx="50" cy="50" r="35" fill="none" stroke={`${VAULT_YELLOW}40`} strokeWidth="2" />
      <circle cx="50" cy="50" r="25" fill="none" stroke={`${VAULT_YELLOW}30`} strokeWidth="1" />
      {/* Vault number */}
      <text x="50" y="45" textAnchor="middle" fill={VAULT_YELLOW} fontSize="20" fontWeight="bold" fontFamily="monospace">
        101
      </text>
      <text x="50" y="62" textAnchor="middle" fill={`${VAULT_YELLOW}80`} fontSize="8" fontFamily="monospace">
        VAULT-TEC
      </text>
      {/* Handle */}
      <circle cx="75" cy="50" r="6" fill={RUST_ORANGE} stroke={WASTELAND_BROWN_DARK} strokeWidth="2" />
      <path d="M75 44 L75 56" stroke={WASTELAND_BROWN_DARK} strokeWidth="2" />
    </svg>
  )
}

export function NukaColaBottle({ size = 60 }: { size?: number }) {
  return (
    <svg width={size * 0.4} height={size} viewBox="0 0 40 100" aria-hidden="true">
      {/* Cap */}
      <rect x="14" y="0" width="12" height="8" fill={NUKA_RED} />
      <rect x="12" y="6" width="16" height="4" fill={NUKA_RED_DARK} />
      {/* Neck */}
      <path d="M15 10 L15 25 Q12 28 12 35 L12 35 L28 35 Q28 28 25 25 L25 10 Z" fill={NUKA_RED} />
      {/* Body */}
      <path d="M10 35 Q8 40 8 50 L8 85 Q8 95 20 95 Q32 95 32 85 L32 50 Q32 40 30 35 Z" fill={NUKA_RED} />
      {/* Label */}
      <rect x="10" y="45" width="20" height="25" fill="#fff" opacity="0.9" />
      <text x="20" y="55" textAnchor="middle" fill={NUKA_RED} fontSize="6" fontWeight="bold" fontFamily="serif">
        NUKA
      </text>
      <text x="20" y="63" textAnchor="middle" fill={NUKA_RED} fontSize="5" fontWeight="bold" fontFamily="serif">
        COLA
      </text>
      {/* Highlight */}
      <path d="M12 40 Q14 60 12 80" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
    </svg>
  )
}

export function WastelandSilhouette() {
  return (
    <svg className="w-full h-32" viewBox="0 0 1200 150" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      {/* Sky gradient */}
      <defs>
        <linearGradient id="wastelandSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={TERMINAL_AMBER} stopOpacity="0.1" />
          <stop offset="50%" stopColor={RUST_ORANGE} stopOpacity="0.15" />
          <stop offset="100%" stopColor={WASTELAND_BROWN_DARK} stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <rect width="1200" height="150" fill="url(#wastelandSky)" />

      {/* Distant ruins */}
      <g fill={WASTELAND_BROWN_DARK} opacity="0.4">
        <rect x="100" y="90" width="40" height="60" />
        <rect x="115" y="70" width="20" height="80" />
        <rect x="300" y="80" width="60" height="70" />
        <polygon points="320,80 330,50 340,80" />
        <rect x="500" y="100" width="30" height="50" />
        <rect x="700" y="85" width="50" height="65" />
        <rect x="715" y="60" width="25" height="90" />
        <rect x="900" y="95" width="45" height="55" />
        <rect x="1050" y="90" width="35" height="60" />
      </g>

      {/* Ground line */}
      <path
        d="M0,145 Q200,140 400,145 T800,142 T1200,145 L1200,150 L0,150 Z"
        fill={WASTELAND_BROWN_DARK}
        opacity="0.5"
      />

      {/* Radiation symbols scattered */}
      <g opacity="0.1">
        <RadiationSymbol size={20} color={IRRADIATED_GREEN} />
        <g transform="translate(600, 60)">
          <RadiationSymbol size={15} color={IRRADIATED_GREEN} />
        </g>
        <g transform="translate(1000, 70)">
          <RadiationSymbol size={18} color={IRRADIATED_GREEN} />
        </g>
      </g>
    </svg>
  )
}
