import { COLORS } from './palette'
import { CrashSilhouette, Crystal, GemIcon, NitroCrate, TNTCrate, TimeTrialClock, WarpPortal, WoodenCrate, WumpaFruit } from './icons'

// Tropical Platformer: the three art scenes set between sections.

// ============================================================================
// ART SECTION 1: JUNGLE SCENE (After About)
// Aku Aku mask, vines, wumpa fruits
// ============================================================================
export function JungleSceneArt({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <div className="relative z-10 py-12 overflow-hidden" aria-hidden="true">
      <div className="max-w-5xl mx-auto px-4">
        <svg viewBox="0 0 1000 150" className="w-full h-36" preserveAspectRatio="xMidYMid meet">
          {/* Ground/jungle floor */}
          <rect x="0" y="120" width="1000" height="30" fill={COLORS.jungleDark} />
          <rect x="0" y="115" width="1000" height="10" fill={COLORS.jungleGreen} opacity="0.7" />

          {/* Grass tufts */}
          {[50, 150, 300, 450, 600, 750, 900].map((x, i) => (
            <g key={i}>
              <path d={`M${x} 115 Q${x-8} 95 ${x-5} 80`} stroke={COLORS.jungleLime} strokeWidth="3" fill="none" />
              <path d={`M${x} 115 Q${x+5} 90 ${x+8} 75`} stroke={COLORS.jungleGreen} strokeWidth="3" fill="none" />
              <path d={`M${x} 115 Q${x+12} 100 ${x+15} 85`} stroke={COLORS.jungleLime} strokeWidth="2" fill="none" />
            </g>
          ))}

          {/* Vine hanging from top-left */}
          <path d="M0 0 Q50 40 30 80 Q10 120 40 150" stroke={COLORS.jungleGreen} strokeWidth="5" fill="none" />
          <ellipse cx="35" cy="60" rx="15" ry="7" fill={COLORS.jungleLime} transform="rotate(-20 35 60)" />
          <ellipse cx="25" cy="100" rx="12" ry="6" fill={COLORS.jungleGreen} transform="rotate(15 25 100)" />

          {/* Vine hanging from top-right */}
          <path d="M1000 0 Q950 50 970 90 Q990 130 960 150" stroke={COLORS.jungleGreen} strokeWidth="5" fill="none" />
          <ellipse cx="965" cy="70" rx="15" ry="7" fill={COLORS.jungleLime} transform="rotate(20 965 70)" />
          <ellipse cx="975" cy="110" rx="12" ry="6" fill={COLORS.jungleGreen} transform="rotate(-15 975 110)" />

          {/* Left tiki totem */}
          <g transform="translate(80, 40)">
            <rect x="0" y="50" width="30" height="30" fill={COLORS.crateWood} />
            <rect x="-5" y="5" width="40" height="50" fill={COLORS.crateSienna} rx="3" />
            <rect x="-8" y="0" width="46" height="10" fill={COLORS.crateWood} rx="2" />
            <ellipse cx="10" cy="25" rx="5" ry="6" fill={COLORS.maskYellow} />
            <ellipse cx="20" cy="25" rx="5" ry="6" fill={COLORS.maskYellow} />
            <circle cx="10" cy="25" r="2" fill="black" />
            <circle cx="20" cy="25" r="2" fill="black" />
            <path d="M8 40 Q15 45 22 40" stroke={COLORS.tntRed} strokeWidth="2.5" fill="none" />
          </g>

          {/* Center - Large Aku Aku mask floating */}
          <g transform="translate(500, 10)" className={reducedMotion ? '' : 'animate-aku-float'}>
            {/* Feathers */}
            <ellipse cx="-20" cy="15" rx="8" ry="20" fill={COLORS.tntRed} transform="rotate(-30 -20 15)" />
            <ellipse cx="-5" cy="8" rx="6" ry="16" fill={COLORS.jungleLime} transform="rotate(-10 -5 8)" />
            <ellipse cx="0" cy="5" rx="7" ry="22" fill={COLORS.maskYellow} />
            <ellipse cx="5" cy="8" rx="6" ry="16" fill={COLORS.oceanBlue} transform="rotate(10 5 8)" />
            <ellipse cx="20" cy="15" rx="8" ry="20" fill={COLORS.cortexPurple} transform="rotate(30 20 15)" />

            {/* Mask face */}
            <path d="M-25 30 Q-35 50 -30 80 Q-25 100 0 105 Q25 100 30 80 Q35 50 25 30 Q15 20 0 20 Q-15 20 -25 30 Z" fill={COLORS.crateWood} />
            <ellipse cx="-10" cy="50" rx="8" ry="10" fill={COLORS.maskYellow} />
            <ellipse cx="10" cy="50" rx="8" ry="10" fill={COLORS.maskYellow} />
            <circle cx="-10" cy="50" r="4" fill="white" />
            <circle cx="10" cy="50" r="4" fill="white" />
            <circle cx="-10" cy="50" r="2" fill="black" />
            <circle cx="10" cy="50" r="2" fill="black" />
            <path d="M-5 65 L0 78 L5 65 Z" fill="#5C3D1A" />
            <path d="M-12 85 Q-5 82 0 85 Q5 82 12 85 Q8 95 0 98 Q-8 95 -12 85 Z" fill={COLORS.tntRed} />
          </g>

          {/* Wumpa fruits floating */}
          <g className={reducedMotion ? '' : 'animate-wumpa-bob'}>
            <ellipse cx="250" cy="50" rx="18" ry="16" fill={COLORS.wumpaOrange} />
            <ellipse cx="245" cy="44" rx="6" ry="4" fill={COLORS.wumpaGold} opacity="0.6" />
            <path d="M250 34 Q256 28 262 32 Q256 26 250 30 Z" fill={COLORS.jungleGreen} />
          </g>

          <g className={reducedMotion ? '' : 'animate-wumpa-bob-delayed'}>
            <ellipse cx="750" cy="45" rx="18" ry="16" fill={COLORS.wumpaOrange} />
            <ellipse cx="745" cy="39" rx="6" ry="4" fill={COLORS.wumpaGold} opacity="0.6" />
            <path d="M750 29 Q756 23 762 27 Q756 21 750 25 Z" fill={COLORS.jungleGreen} />
          </g>

          {/* Right tiki totem */}
          <g transform="translate(890, 50)">
            <rect x="0" y="40" width="25" height="30" fill={COLORS.crateWood} />
            <rect x="-3" y="5" width="32" height="40" fill={COLORS.crateSienna} rx="3" />
            <rect x="-6" y="0" width="38" height="8" fill={COLORS.crateWood} rx="2" />
            <ellipse cx="8" cy="20" rx="4" ry="5" fill={COLORS.maskYellow} />
            <ellipse cx="18" cy="20" rx="4" ry="5" fill={COLORS.maskYellow} />
            <circle cx="8" cy="20" r="2" fill="black" />
            <circle cx="18" cy="20" r="2" fill="black" />
            <path d="M6 32 Q13 36 20 32" stroke={COLORS.tntRed} strokeWidth="2" fill="none" />
          </g>

          {/* Gems scattered */}
          <g className={reducedMotion ? '' : 'animate-gem-sparkle'}>
            <path d="M180 90 L190 100 L180 115 L170 100 Z" fill={COLORS.gemBlue} />
            <path d="M178 95 L180 92 L182 95 L180 98 Z" fill="white" opacity="0.7" />
          </g>

          <g className={reducedMotion ? '' : 'animate-gem-sparkle-delayed'}>
            <path d="M820 95 L830 105 L820 120 L810 105 Z" fill={COLORS.gemGreen} />
            <path d="M818 100 L820 97 L822 100 L820 103 Z" fill="white" opacity="0.7" />
          </g>
        </svg>
      </div>
    </div>
  )
}

// ============================================================================
// ART SECTION 2: CRATE STACK (After Experience)
// Various crate types with gems
// ============================================================================
export function CrateStackArt({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <div className="relative z-10 py-10 overflow-hidden" aria-hidden="true">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-center items-end gap-3 flex-wrap">
          {/* Left stack */}
          <div className="flex flex-col items-center gap-1">
            <WoodenCrate size={40} variant="basic" />
            <WoodenCrate size={40} variant="questionmark" />
            <WoodenCrate size={40} variant="basic" />
          </div>

          {/* Wumpa cluster */}
          <div className="flex flex-col items-center gap-2 mb-6">
            <WumpaFruit size={36} />
            <div className="flex gap-1">
              <WumpaFruit size={28} />
              <WumpaFruit size={28} />
            </div>
          </div>

          {/* Center stack with TNT */}
          <div className="flex flex-col items-center gap-1 relative">
            <div className={reducedMotion ? '' : 'animate-bounce-slow'}>
              <GemIcon size={30} color="red" />
            </div>
            <WoodenCrate size={45} variant="bouncy" />
            <TNTCrate size={50} countdown={!reducedMotion} />
            <WoodenCrate size={50} variant="basic" />
          </div>

          {/* Crystal and gem cluster */}
          <div className="flex flex-col items-center gap-2 mb-4">
            <Crystal size={40} />
            <div className="flex gap-2">
              <GemIcon size={22} color="blue" />
              <GemIcon size={22} color="purple" />
            </div>
          </div>

          {/* Nitro stack */}
          <div className="flex flex-col items-center gap-1">
            <NitroCrate size={40} />
            <WoodenCrate size={40} variant="checkpoint" />
            <WoodenCrate size={40} variant="basic" />
          </div>

          {/* Time trial clock */}
          <div className="flex flex-col items-center gap-2 mb-8">
            <TimeTrialClock size={38} />
            <GemIcon size={24} color="yellow" />
          </div>
        </div>

        {/* Decorative divider */}
        <div className="mt-6 flex justify-center items-center gap-4">
          <div
            className="h-1 w-24"
            style={{ background: `linear-gradient(90deg, transparent, ${COLORS.maskYellow}, transparent)` }}
          />
          <WumpaFruit size={24} />
          <div className="h-1 w-32" style={{ background: COLORS.maskYellow }} />
          <WumpaFruit size={24} />
          <div
            className="h-1 w-24"
            style={{ background: `linear-gradient(90deg, transparent, ${COLORS.maskYellow}, transparent)` }}
          />
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ART SECTION 3: WARP PORTAL (After Projects)
// Swirling vortex, crystals
// ============================================================================
export function WarpPortalArt({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <div className="relative z-10 py-12 overflow-hidden" aria-hidden="true">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-center items-center gap-8">
          {/* Left crystals */}
          <div className="flex flex-col gap-4 items-center">
            <Crystal size={35} />
            <GemIcon size={26} color="blue" />
            <Crystal size={30} />
          </div>

          {/* Left gem column */}
          <div className="flex flex-col gap-3">
            <GemIcon size={22} color="red" />
            <GemIcon size={22} color="green" />
            <GemIcon size={22} color="yellow" />
          </div>

          {/* Center warp portal */}
          <div className="relative">
            <WarpPortal size={140} reducedMotion={reducedMotion} />

            {/* Crash silhouette in portal */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70">
              <CrashSilhouette size={35} />
            </div>
          </div>

          {/* Right gem column */}
          <div className="flex flex-col gap-3">
            <GemIcon size={22} color="purple" />
            <GemIcon size={22} color="clear" />
            <GemIcon size={22} color="blue" />
          </div>

          {/* Right crystals */}
          <div className="flex flex-col gap-4 items-center">
            <Crystal size={30} />
            <GemIcon size={26} color="purple" />
            <Crystal size={35} />
          </div>
        </div>

        {/* Portal platform */}
        <div className="flex justify-center mt-4">
          <svg viewBox="0 0 200 30" width={200} height={30}>
            <ellipse cx="100" cy="15" rx="95" ry="12" fill={COLORS.cortexPurple} opacity="0.6" />
            <ellipse cx="100" cy="15" rx="80" ry="8" fill={COLORS.warpPurple} opacity="0.4" />
          </svg>
        </div>
      </div>
    </div>
  )
}
