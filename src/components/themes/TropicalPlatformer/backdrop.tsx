import { useReducedMotion } from '@/hooks/useReducedMotion'
import { COLORS } from './palette'
import { Crystal, GemIcon, WoodenCrate, WumpaFruit } from './icons'

// Tropical Platformer: the fixed backdrop layers behind the page (vines, ocean, floating collectibles).

// ============================================================================
// JUNGLE VINE - Side decoration
// ============================================================================
export function JungleVine({ side = 'left', className = '' }: { side?: 'left' | 'right'; className?: string }) {
  return (
    <div
      className={`absolute top-0 ${side === 'left' ? 'left-0' : 'right-0'} w-20 h-full pointer-events-none ${className}`}
      style={{
        background: side === 'left'
          ? `linear-gradient(90deg, ${COLORS.jungleDark}60 0%, transparent 100%)`
          : `linear-gradient(-90deg, ${COLORS.jungleDark}60 0%, transparent 100%)`,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 80 500"
        width={80}
        height="100%"
        preserveAspectRatio="none"
        className={side === 'right' ? 'scale-x-[-1]' : ''}
      >
        {/* Main vine curves */}
        <path
          d="M40 0 Q10 60 30 120 Q50 180 20 240 Q-10 300 30 360 Q70 420 30 500"
          stroke={COLORS.jungleGreen}
          strokeWidth="6"
          fill="none"
        />
        <path
          d="M50 0 Q20 80 40 140 Q60 200 30 260 Q0 320 40 380 Q80 440 40 500"
          stroke={COLORS.jungleLime}
          strokeWidth="4"
          fill="none"
        />

        {/* Leaves along the vine */}
        {[80, 180, 280, 380, 480].map((y) => (
          <g key={y}>
            <ellipse cx="30" cy={y} rx="18" ry="8" fill={COLORS.jungleLime} transform={`rotate(-30 30 ${y})`} />
            <ellipse cx="40" cy={y + 30} rx="15" ry="7" fill={COLORS.jungleGreen} transform={`rotate(25 40 ${y + 30})`} />
            {/* Leaf vein */}
            <line
              x1="18" y1={y}
              x2="42" y2={y}
              stroke={COLORS.jungleDark}
              strokeWidth="1"
              opacity="0.4"
              transform={`rotate(-30 30 ${y})`}
            />
          </g>
        ))}

        {/* Small wumpa fruits on vine */}
        <circle cx="35" cy="150" r="8" fill={COLORS.wumpaOrange} />
        <circle cx="25" cy="350" r="8" fill={COLORS.wumpaOrange} />
      </svg>
    </div>
  )
}

// ============================================================================
// OCEAN WAVES - Bottom decoration
// ============================================================================
export function OceanWaves({ className = '' }: { className?: string }) {
  const reducedMotion = useReducedMotion()

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 h-40 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Deep water gradient */}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(180deg, transparent 0%, ${COLORS.oceanRoyal}80 50%, ${COLORS.oceanBlue} 100%)` }}
      />

      {/* Wave layers */}
      <svg viewBox="0 0 1440 150" preserveAspectRatio="none" className="absolute bottom-0 w-full h-28">
        {/* Back wave */}
        <path
          d="M0 80 Q180 30 360 80 T720 80 T1080 80 T1440 80 L1440 150 L0 150 Z"
          fill={COLORS.oceanRoyal}
          className={reducedMotion ? '' : 'animate-wave-slow'}
        />
        {/* Middle wave */}
        <path
          d="M0 100 Q180 60 360 100 T720 100 T1080 100 T1440 100 L1440 150 L0 150 Z"
          fill={COLORS.oceanBlue}
          className={reducedMotion ? '' : 'animate-wave-medium'}
        />
        {/* Front wave */}
        <path
          d="M0 115 Q180 85 360 115 T720 115 T1080 115 T1440 115 L1440 150 L0 150 Z"
          fill={COLORS.oceanSky}
          className={reducedMotion ? '' : 'animate-wave-fast'}
        />

        {/* Foam patches */}
        <ellipse cx="120" cy="118" rx="40" ry="6" fill="white" opacity="0.7" />
        <ellipse cx="500" cy="115" rx="35" ry="5" fill="white" opacity="0.6" />
        <ellipse cx="900" cy="120" rx="45" ry="6" fill="white" opacity="0.7" />
        <ellipse cx="1300" cy="116" rx="38" ry="5" fill="white" opacity="0.6" />
      </svg>

      {/* Beach sand strip */}
      <div
        className="absolute bottom-0 left-0 right-0 h-5"
        style={{ background: `linear-gradient(180deg, ${COLORS.beachSand} 0%, ${COLORS.beachBrown} 100%)` }}
      />
    </div>
  )
}

// ============================================================================
// FLOATING JUNGLE ELEMENTS
// ============================================================================
export function JungleFloaters({
  profession,
  reducedMotion = false
}: {
  profession: 'engineer' | 'drummer' | 'fighter'
  reducedMotion?: boolean
}) {
  const floatersByProfession = {
    engineer: [
      { type: 'wumpa', x: 5, y: 12 },
      { type: 'gem', x: 92, y: 22, color: 'blue' as const },
      { type: 'crate', x: 7, y: 55 },
      { type: 'gem', x: 88, y: 70, color: 'green' as const },
      { type: 'crystal', x: 10, y: 85 },
    ],
    drummer: [
      { type: 'wumpa', x: 6, y: 18 },
      { type: 'gem', x: 90, y: 28, color: 'purple' as const },
      { type: 'wumpa', x: 8, y: 50 },
      { type: 'crate', x: 88, y: 65 },
      { type: 'gem', x: 5, y: 78, color: 'yellow' as const },
    ],
    fighter: [
      { type: 'gem', x: 6, y: 15, color: 'red' as const },
      { type: 'wumpa', x: 91, y: 25 },
      { type: 'crate', x: 7, y: 48 },
      { type: 'wumpa', x: 89, y: 62 },
      { type: 'crystal', x: 8, y: 80 },
    ],
  }

  const floaters = floatersByProfession[profession]

  return (
    <div className="fixed inset-0 pointer-events-none z-[4] overflow-hidden" aria-hidden="true">
      {floaters.map((f, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            opacity: 0.6,
            animation: reducedMotion ? 'none' : `jungleFloat ${10 + i * 3}s ease-in-out infinite`,
            animationDelay: `${-i * 2}s`,
          }}
        >
          {f.type === 'wumpa' && <WumpaFruit size={32} />}
          {f.type === 'gem' && <GemIcon size={26} color={f.color || 'clear'} />}
          {f.type === 'crate' && <WoodenCrate size={30} />}
          {f.type === 'crystal' && <Crystal size={28} />}
        </div>
      ))}
    </div>
  )
}
