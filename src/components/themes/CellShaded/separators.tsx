import { BORDERLANDS_COLORS } from './palette'

// Art Section Break - Borderlands themed decorative divider
export function ArtSectionBreak({ variant = 1, reducedMotion = false }: { variant?: 1 | 2 | 3; reducedMotion?: boolean }) {
  // Variant 1: Vault symbols with psycho masks
  if (variant === 1) {
    return (
      <div className="relative py-12 my-8 overflow-hidden" aria-hidden="true">
        {/* Central vault symbol */}
        <div className="flex items-center justify-center gap-4">
          {/* Left psycho mask */}
          <div className="opacity-40" style={{ transform: 'rotate(-15deg)' }}>
            <svg width="60" height="72" viewBox="0 0 80 96" fill={BORDERLANDS_COLORS.ink}>
              <ellipse cx="40" cy="48" rx="35" ry="42" />
              <ellipse cx="28" cy="38" rx="8" ry="12" fill={BORDERLANDS_COLORS.paper} />
              <ellipse cx="52" cy="38" rx="8" ry="12" fill={BORDERLANDS_COLORS.paper} />
              <path d="M20,65 Q28,75 40,75 Q52,75 60,65" fill="none" stroke={BORDERLANDS_COLORS.paper} strokeWidth="3" />
              <line x1="28" y1="66" x2="28" y2="74" stroke={BORDERLANDS_COLORS.paper} strokeWidth="2" />
              <line x1="36" y1="68" x2="36" y2="75" stroke={BORDERLANDS_COLORS.paper} strokeWidth="2" />
              <line x1="44" y1="68" x2="44" y2="75" stroke={BORDERLANDS_COLORS.paper} strokeWidth="2" />
              <line x1="52" y1="66" x2="52" y2="74" stroke={BORDERLANDS_COLORS.paper} strokeWidth="2" />
            </svg>
          </div>

          {/* Left decorative line */}
          <div
            className="h-1 flex-1 max-w-32"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${BORDERLANDS_COLORS.clapTrapYellow} 50%, ${BORDERLANDS_COLORS.legendary} 100%)`,
              border: `2px solid ${BORDERLANDS_COLORS.ink}`,
            }}
          />

          {/* Main vault symbol */}
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="45" stroke={BORDERLANDS_COLORS.clapTrapYellow} strokeWidth="5" />
            <circle cx="50" cy="50" r="45" stroke={BORDERLANDS_COLORS.ink} strokeWidth="2" strokeDasharray="8 4" />
            <circle cx="50" cy="50" r="30" stroke={BORDERLANDS_COLORS.legendary} strokeWidth="4" />
            <line x1="50" y1="5" x2="50" y2="20" stroke={BORDERLANDS_COLORS.clapTrapYellow} strokeWidth="5" />
            <line x1="50" y1="80" x2="50" y2="95" stroke={BORDERLANDS_COLORS.clapTrapYellow} strokeWidth="5" />
            <line x1="5" y1="50" x2="20" y2="50" stroke={BORDERLANDS_COLORS.clapTrapYellow} strokeWidth="5" />
            <line x1="80" y1="50" x2="95" y2="50" stroke={BORDERLANDS_COLORS.clapTrapYellow} strokeWidth="5" />
            <path d="M35,35 L50,55 L65,35" stroke={BORDERLANDS_COLORS.legendary} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M42,60 L50,70 L58,60" stroke={BORDERLANDS_COLORS.clapTrapYellow} strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>

          {/* Right decorative line */}
          <div
            className="h-1 flex-1 max-w-32"
            style={{
              background: `linear-gradient(90deg, ${BORDERLANDS_COLORS.legendary} 0%, ${BORDERLANDS_COLORS.clapTrapYellow} 50%, transparent 100%)`,
              border: `2px solid ${BORDERLANDS_COLORS.ink}`,
            }}
          />

          {/* Right psycho mask */}
          <div className="opacity-40" style={{ transform: 'rotate(15deg)' }}>
            <svg width="60" height="72" viewBox="0 0 80 96" fill={BORDERLANDS_COLORS.ink}>
              <ellipse cx="40" cy="48" rx="35" ry="42" />
              <ellipse cx="28" cy="38" rx="8" ry="12" fill={BORDERLANDS_COLORS.paper} />
              <ellipse cx="52" cy="38" rx="8" ry="12" fill={BORDERLANDS_COLORS.paper} />
              <path d="M20,65 Q28,75 40,75 Q52,75 60,65" fill="none" stroke={BORDERLANDS_COLORS.paper} strokeWidth="3" />
              <line x1="28" y1="66" x2="28" y2="74" stroke={BORDERLANDS_COLORS.paper} strokeWidth="2" />
              <line x1="36" y1="68" x2="36" y2="75" stroke={BORDERLANDS_COLORS.paper} strokeWidth="2" />
              <line x1="44" y1="68" x2="44" y2="75" stroke={BORDERLANDS_COLORS.paper} strokeWidth="2" />
              <line x1="52" y1="66" x2="52" y2="74" stroke={BORDERLANDS_COLORS.paper} strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Floating small decorations */}
        <div className="absolute top-4 left-1/4 opacity-30" style={{ transform: 'rotate(-20deg)' }}>
          <svg width="30" height="30" viewBox="0 0 30 30">
            <polygon points="15,0 18,12 30,12 20,19 24,30 15,23 6,30 10,19 0,12 12,12" fill={BORDERLANDS_COLORS.legendary} stroke={BORDERLANDS_COLORS.ink} strokeWidth="1" />
          </svg>
        </div>
        <div className="absolute bottom-4 right-1/4 opacity-30" style={{ transform: 'rotate(25deg)' }}>
          <svg width="25" height="25" viewBox="0 0 30 30">
            <polygon points="15,0 18,12 30,12 20,19 24,30 15,23 6,30 10,19 0,12 12,12" fill={BORDERLANDS_COLORS.psychoRed} stroke={BORDERLANDS_COLORS.ink} strokeWidth="1" />
          </svg>
        </div>
      </div>
    )
  }

  // Variant 2: Loot drops with weapon silhouettes
  if (variant === 2) {
    return (
      <div className="relative py-12 my-8 overflow-hidden" aria-hidden="true">
        <div className="flex items-center justify-center gap-6">
          {/* Left weapon silhouette */}
          <div className="opacity-30" style={{ transform: 'rotate(-10deg)' }}>
            <svg width="100" height="45" viewBox="0 0 140 60" fill={BORDERLANDS_COLORS.ink}>
              <path d="M5,28 L42,28 L47,22 L95,22 L100,16 L130,16 L135,20 L135,28 L125,28 L125,34 L100,34 L100,40 L65,40 L60,34 L47,34 L42,40 L32,40 L32,34 L5,34 Z" stroke={BORDERLANDS_COLORS.ink} strokeWidth="3" />
              <rect x="26" y="34" width="18" height="20" rx="2" stroke={BORDERLANDS_COLORS.ink} strokeWidth="2" />
              <ellipse cx="80" cy="14" rx="8" ry="4" fill={BORDERLANDS_COLORS.rare} opacity="0.6" />
            </svg>
          </div>

          {/* Loot beam / pillar */}
          <div className="relative">
            {/* Glow effect */}
            <div
              className={`absolute inset-0 ${reducedMotion ? '' : 'animate-pulse'}`}
              style={{
                background: `radial-gradient(ellipse at center, ${BORDERLANDS_COLORS.legendary}40 0%, transparent 70%)`,
                filter: 'blur(10px)',
                transform: 'scale(1.5)',
              }}
            />
            {/* Loot chest icon */}
            <svg width="80" height="60" viewBox="0 0 80 60" className="relative z-10">
              {/* Chest base */}
              <rect x="5" y="25" width="70" height="35" rx="5" fill={BORDERLANDS_COLORS.legendary} stroke={BORDERLANDS_COLORS.ink} strokeWidth="4" />
              {/* Chest lid */}
              <path d="M5,30 Q40,5 75,30" fill={BORDERLANDS_COLORS.clapTrapYellow} stroke={BORDERLANDS_COLORS.ink} strokeWidth="4" />
              {/* Chest lock */}
              <rect x="32" y="30" width="16" height="12" rx="2" fill={BORDERLANDS_COLORS.ink} />
              <circle cx="40" cy="36" r="3" fill={BORDERLANDS_COLORS.clapTrapYellow} />
              {/* Shine lines */}
              <line x1="15" y1="40" x2="25" y2="40" stroke={BORDERLANDS_COLORS.paper} strokeWidth="2" opacity="0.6" />
              <line x1="55" y1="40" x2="65" y2="40" stroke={BORDERLANDS_COLORS.paper} strokeWidth="2" opacity="0.6" />
            </svg>
          </div>

          {/* Floating loot items */}
          <div className="flex flex-col gap-2">
            {/* Legendary drop */}
            <div
              className={`px-3 py-1 text-xs font-black tracking-wider ${reducedMotion ? '' : 'animate-bounce'}`}
              style={{
                background: BORDERLANDS_COLORS.legendary,
                color: BORDERLANDS_COLORS.ink,
                border: `2px solid ${BORDERLANDS_COLORS.ink}`,
                boxShadow: `2px 2px 0 ${BORDERLANDS_COLORS.ink}, 0 0 15px ${BORDERLANDS_COLORS.legendary}50`,
                animationDuration: '2s',
              }}
            >
              LEGENDARY
            </div>
            {/* Epic drop */}
            <div
              className={`px-3 py-1 text-xs font-black tracking-wider ${reducedMotion ? '' : 'animate-bounce'}`}
              style={{
                background: BORDERLANDS_COLORS.epic,
                color: '#fff',
                border: `2px solid ${BORDERLANDS_COLORS.ink}`,
                boxShadow: `2px 2px 0 ${BORDERLANDS_COLORS.ink}`,
                animationDelay: '0.3s',
                animationDuration: '2s',
              }}
            >
              EPIC
            </div>
            {/* Rare drop */}
            <div
              className={`px-3 py-1 text-xs font-black tracking-wider ${reducedMotion ? '' : 'animate-bounce'}`}
              style={{
                background: BORDERLANDS_COLORS.rare,
                color: '#fff',
                border: `2px solid ${BORDERLANDS_COLORS.ink}`,
                boxShadow: `2px 2px 0 ${BORDERLANDS_COLORS.ink}`,
                animationDelay: '0.6s',
                animationDuration: '2s',
              }}
            >
              RARE
            </div>
          </div>

          {/* Right weapon silhouette */}
          <div className="opacity-30" style={{ transform: 'rotate(10deg) scaleX(-1)' }}>
            <svg width="100" height="45" viewBox="0 0 140 60" fill={BORDERLANDS_COLORS.ink}>
              <path d="M5,28 L42,28 L47,22 L95,22 L100,16 L130,16 L135,20 L135,28 L125,28 L125,34 L100,34 L100,40 L65,40 L60,34 L47,34 L42,40 L32,40 L32,34 L5,34 Z" stroke={BORDERLANDS_COLORS.ink} strokeWidth="3" />
              <rect x="26" y="34" width="18" height="20" rx="2" stroke={BORDERLANDS_COLORS.ink} strokeWidth="2" />
              <ellipse cx="80" cy="14" rx="8" ry="4" fill={BORDERLANDS_COLORS.epic} opacity="0.6" />
            </svg>
          </div>
        </div>

        {/* Eridium crystals */}
        <div className="absolute top-6 left-1/3 opacity-40">
          <svg width="20" height="35" viewBox="0 0 20 35">
            <polygon points="10,0 20,25 10,35 0,25" fill={BORDERLANDS_COLORS.eridium} stroke={BORDERLANDS_COLORS.ink} strokeWidth="2" />
            <line x1="10" y1="5" x2="10" y2="15" stroke="#fff" strokeWidth="2" opacity="0.4" />
          </svg>
        </div>
        <div className="absolute bottom-6 right-1/3 opacity-40" style={{ transform: 'rotate(20deg)' }}>
          <svg width="15" height="28" viewBox="0 0 20 35">
            <polygon points="10,0 20,25 10,35 0,25" fill={BORDERLANDS_COLORS.eridium} stroke={BORDERLANDS_COLORS.ink} strokeWidth="2" />
          </svg>
        </div>
      </div>
    )
  }

  // Variant 3: Cel-shaded action lines with Claptrap
  return (
    <div className="relative py-12 my-8 overflow-hidden" aria-hidden="true">
      <div className="flex items-center justify-center gap-8">
        {/* Left action lines */}
        <div className="flex gap-1 items-end opacity-60">
          {[25, 40, 55, 35, 50, 30].map((h, i) => (
            <div
              key={i}
              className="w-1"
              style={{
                height: h,
                background: `linear-gradient(180deg, ${BORDERLANDS_COLORS.clapTrapYellow} 0%, ${BORDERLANDS_COLORS.legendary} 100%)`,
                border: `1px solid ${BORDERLANDS_COLORS.ink}`,
                transform: `rotate(${-15 + i * 3}deg)`,
              }}
            />
          ))}
        </div>

        {/* Explosion/Impact burst */}
        <div className="relative">
          <svg width="120" height="80" viewBox="0 0 120 80">
            <polygon
              points="60,2 72,22 98,17 82,38 105,55 73,48 60,78 47,48 15,55 38,38 22,17 48,22"
              fill={BORDERLANDS_COLORS.legendary}
              stroke={BORDERLANDS_COLORS.ink}
              strokeWidth="4"
            />
            <polygon
              points="60,12 68,26 88,22 76,38 92,50 69,45 60,68 51,45 28,50 44,38 32,22 52,26"
              fill={BORDERLANDS_COLORS.clapTrapYellow}
              stroke={BORDERLANDS_COLORS.ink}
              strokeWidth="2"
            />
            <text x="60" y="44" textAnchor="middle" fill={BORDERLANDS_COLORS.ink} fontSize="12" fontWeight="900" fontFamily="Bangers, Impact, sans-serif">
              BADASS!
            </text>
          </svg>
        </div>

        {/* Mini Claptrap */}
        <div className="opacity-60">
          <svg width="50" height="65" viewBox="0 0 80 100">
            <rect x="15" y="30" width="50" height="45" rx="5" fill={BORDERLANDS_COLORS.ink} stroke={BORDERLANDS_COLORS.ink} strokeWidth="3" />
            <rect x="18" y="33" width="20" height="39" rx="3" fill={BORDERLANDS_COLORS.clapTrapYellow} opacity="0.3" />
            <circle cx="40" cy="50" r="14" fill={BORDERLANDS_COLORS.paper} stroke={BORDERLANDS_COLORS.ink} strokeWidth="3" />
            <circle cx="40" cy="50" r="9" fill={BORDERLANDS_COLORS.rare} />
            <circle cx="43" cy="47" r="4" fill="#fff" />
            <rect x="37" y="10" width="6" height="20" fill={BORDERLANDS_COLORS.ink} />
            <circle cx="40" cy="10" r="6" fill={BORDERLANDS_COLORS.clapTrapYellow} stroke={BORDERLANDS_COLORS.ink} strokeWidth="2" />
            <circle cx="40" cy="85" r="13" fill={BORDERLANDS_COLORS.ink} />
            <circle cx="40" cy="85" r="7" fill={BORDERLANDS_COLORS.paper} />
            <rect x="0" y="40" width="15" height="8" rx="2" fill={BORDERLANDS_COLORS.ink} />
            <rect x="65" y="40" width="15" height="8" rx="2" fill={BORDERLANDS_COLORS.ink} />
          </svg>
        </div>

        {/* Right action lines */}
        <div className="flex gap-1 items-end opacity-60">
          {[30, 50, 35, 55, 40, 25].map((h, i) => (
            <div
              key={i}
              className="w-1"
              style={{
                height: h,
                background: `linear-gradient(180deg, ${BORDERLANDS_COLORS.clapTrapYellow} 0%, ${BORDERLANDS_COLORS.legendary} 100%)`,
                border: `1px solid ${BORDERLANDS_COLORS.ink}`,
                transform: `rotate(${15 - i * 3}deg)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Small scattered debris */}
      {[
        { left: '20%', top: '20%', rot: 45 },
        { left: '75%', top: '30%', rot: -30 },
        { left: '30%', top: '70%', rot: 60 },
        { left: '80%', top: '65%', rot: -45 },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 opacity-40"
          style={{
            left: pos.left,
            top: pos.top,
            background: i % 2 === 0 ? BORDERLANDS_COLORS.legendary : BORDERLANDS_COLORS.psychoRed,
            border: `1px solid ${BORDERLANDS_COLORS.ink}`,
            transform: `rotate(${pos.rot}deg)`,
          }}
        />
      ))}
    </div>
  )
}
