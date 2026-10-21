import type { Profession } from '@/lib/cv/professions'
import { COLORS } from './palette'
import { Crate, Crystal, Gem, Mango, TikiMask, WarpPortal, type GemColor } from './icons'
import { HeroCharacter } from './character'
import world from './world.module.css'

// Tropical Platformer's three art scenes set between sections, all decorative: the jungle clearing
// (totems, the carved mask, the fruit), the crate stack, and the warp portal with him inside it. Three
// idle loops at most per scene.

const GRASS_XS = [50, 150, 300, 450, 600, 750, 900]

function Totem({ x, y, width }: { x: number; y: number; width: number }) {
  const eye = width / 4

  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={4} y={width + 10} width={width - 8} height={30} fill={COLORS.wood} />
      <rect x={0} y={6} width={width} height={width + 8} rx={3} fill={COLORS.woodMid} />
      <rect x={-4} y={0} width={width + 8} height={10} rx={2} fill={COLORS.wood} />
      <ellipse cx={eye + 2} cy={eye + 14} rx={5} ry={6} fill={COLORS.sun} />
      <ellipse cx={width - eye - 2} cy={eye + 14} rx={5} ry={6} fill={COLORS.sun} />
      <path d={`M${eye} ${width} Q${width / 2} ${width + 6} ${width - eye} ${width}`} stroke={COLORS.hazard} strokeWidth={2.5} fill="none" />
    </g>
  )
}

export function JungleSceneArt() {
  return (
    <div className="relative z-10 overflow-hidden py-12" aria-hidden="true">
      <div className="mx-auto flex max-w-5xl items-end justify-center px-4">
        <svg viewBox="0 0 1000 150" className="h-24 w-full sm:h-36" preserveAspectRatio="xMidYMid meet" focusable="false">
          <rect x={0} y={120} width={1000} height={30} fill={COLORS.leafDark} />
          <rect x={0} y={115} width={1000} height={10} fill={COLORS.leaf} opacity={0.7} />
          {GRASS_XS.map((x) => (
            <path
              key={x}
              d={`M${x} 115 Q${x - 8} 95 ${x - 5} 80 M${x} 115 Q${x + 5} 90 ${x + 8} 75 M${x} 115 Q${x + 12} 100 ${x + 15} 85`}
              stroke={COLORS.leafLight}
              strokeWidth={3}
              fill="none"
            />
          ))}
          <path d="M0 0 Q50 40 30 80 Q10 120 40 150 M1000 0 Q950 50 970 90 Q990 130 960 150" stroke={COLORS.leaf} strokeWidth={5} fill="none" />
          <Totem x={80} y={40} width={30} />
          <Totem x={890} y={50} width={26} />
          <g className={world.bob}>
            <circle cx={250} cy={50} r={16} fill={COLORS.fruit} />
            <path d="M250 34 Q256 28 262 32 Q256 26 250 30 Z" fill={COLORS.leaf} />
          </g>
          <g className={`${world.bob} [--delay:-0.7s]`}>
            <circle cx={750} cy={45} r={16} fill={COLORS.fruit} />
            <path d="M750 29 Q756 23 762 27 Q756 21 750 25 Z" fill={COLORS.leaf} />
          </g>
          <path d="M180 90 L190 100 L180 115 L170 100 Z" fill={COLORS.gemBlue} />
          <path d="M820 95 L830 105 L820 120 L810 105 Z" fill={COLORS.gemGreen} />
        </svg>
      </div>
      <div className={`absolute left-1/2 top-4 -translate-x-1/2 ${world.bob}`}>
        <TikiMask size={44} />
      </div>
    </div>
  )
}

export function CrateStackArt() {
  return (
    <div className="relative z-10 overflow-hidden py-10" aria-hidden="true">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex flex-wrap items-end justify-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <Crate size={40} />
            <Crate size={40} variant="iron" />
            <Crate size={40} />
          </div>
          <div className="mb-6 flex flex-col items-center gap-2">
            <Mango size={36} />
            <div className="flex gap-1">
              <Mango size={28} />
              <Mango size={28} />
            </div>
          </div>
          <div className="relative flex flex-col items-center gap-1">
            <div className={world.bob}>
              <Gem size={30} color="red" />
            </div>
            <Crate size={45} variant="bounce" />
            <Crate size={50} variant="hazard" />
            <Crate size={50} />
          </div>
          <div className="mb-4 flex flex-col items-center gap-2">
            <Crystal size={40} />
            <div className="flex gap-2">
              <Gem size={22} color="blue" />
              <Gem size={22} color="purple" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Crate size={40} variant="flag" />
            <Crate size={40} variant="iron" />
            <Crate size={40} />
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="h-1 w-16 bg-[linear-gradient(90deg,transparent,var(--tp-sun),transparent)] sm:w-24" />
          <Mango size={24} />
          <div className="h-1 w-20 bg-[var(--tp-sun)] sm:w-32" />
          <Mango size={24} />
          <div className="h-1 w-16 bg-[linear-gradient(90deg,transparent,var(--tp-sun),transparent)] sm:w-24" />
        </div>
      </div>
    </div>
  )
}

const GEMS_LEFT: GemColor[] = ['red', 'green', 'yellow']
const GEMS_RIGHT: GemColor[] = ['purple', 'clear', 'blue']

export function WarpPortalArt({ profession }: { profession: Profession }) {
  return (
    <div className="relative z-10 overflow-hidden py-12" aria-hidden="true">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex items-center justify-center gap-4 sm:gap-8">
          <div className="hidden flex-col items-center gap-4 sm:flex">
            <Crystal size={35} />
            <Gem size={26} color="blue" />
            <Crystal size={30} />
          </div>
          <div className="flex flex-col gap-3">
            {GEMS_LEFT.map((color) => (
              <Gem key={color} size={22} color={color} />
            ))}
          </div>
          <div className="relative">
            <WarpPortal size={140} />
            <div className="absolute left-1/2 top-1/2 h-12 w-8 -translate-x-1/2 -translate-y-1/2 opacity-80">
              <HeroCharacter profession={profession} className="h-full w-full" />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {GEMS_RIGHT.map((color) => (
              <Gem key={color} size={22} color={color} />
            ))}
          </div>
          <div className="hidden flex-col items-center gap-4 sm:flex">
            <Crystal size={30} />
            <Gem size={26} color="purple" />
            <Crystal size={35} />
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <svg viewBox="0 0 200 30" width={200} height={30} focusable="false">
            <ellipse cx={100} cy={15} rx={95} ry={12} fill={COLORS.crystal} opacity={0.6} />
            <ellipse cx={100} cy={15} rx={80} ry={8} fill={COLORS.warp} opacity={0.4} />
          </svg>
        </div>
      </div>
    </div>
  )
}
