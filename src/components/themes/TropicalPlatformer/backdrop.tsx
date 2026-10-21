import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { COLORS } from './palette'
import { Crate, Crystal, Gem, Mango, type GemColor } from './icons'
import world from './world.module.css'

// Tropical Platformer's fixed backdrop behind the page: the canopy fringe at the top, a vine down each
// side, the lagoon rolling in at the bottom and five collectibles floating at the edges, a set per
// profession. Eight idle loops in all.

export function Canopy() {
  return (
    <div className={`pointer-events-none fixed inset-x-0 top-0 z-[2] h-36 ${world.canopy}`} aria-hidden="true">
      <svg viewBox="0 0 100 25" preserveAspectRatio="none" className="absolute bottom-0 h-16 w-full opacity-70" focusable="false">
        <path d="M0 25 Q8 8 16 25 Q24 12 32 25 Q40 5 48 25 Q56 15 64 25 Q72 8 80 25 Q88 12 96 25 L100 25" fill={COLORS.canopy} />
      </svg>
    </div>
  )
}

const VINE_LEAVES = [80, 180, 280, 380, 480]

export function JungleVine({ side }: { side: 'left' | 'right' }) {
  const placement = side === 'left' ? `left-0 ${world.vineShade}` : `right-0 ${world.vineShadeRight}`

  return (
    <div className={`pointer-events-none absolute top-0 hidden h-full w-20 sm:block ${placement}`} aria-hidden="true">
      <svg
        viewBox="0 0 80 500"
        width={80}
        height="100%"
        preserveAspectRatio="none"
        className={side === 'right' ? '-scale-x-100' : ''}
        focusable="false"
      >
        <path d="M40 0 Q10 60 30 120 Q50 180 20 240 Q-10 300 30 360 Q70 420 30 500" stroke={COLORS.leaf} strokeWidth={6} fill="none" />
        <path d="M50 0 Q20 80 40 140 Q60 200 30 260 Q0 320 40 380 Q80 440 40 500" stroke={COLORS.leafLight} strokeWidth={4} fill="none" />
        {VINE_LEAVES.map((y) => (
          <g key={y}>
            <ellipse cx={30} cy={y} rx={18} ry={8} fill={COLORS.leafLight} transform={`rotate(-30 30 ${y})`} />
            <ellipse cx={40} cy={y + 30} rx={15} ry={7} fill={COLORS.leaf} transform={`rotate(25 40 ${y + 30})`} />
          </g>
        ))}
        <circle cx={35} cy={150} r={8} fill={COLORS.fruit} />
        <circle cx={25} cy={350} r={8} fill={COLORS.fruit} />
      </svg>
    </div>
  )
}

const WAVES = [
  { d: 'M0 80 Q180 30 360 80 T720 80 T1080 80 T1440 80 T1800 80 L1800 150 L0 150 Z', fill: COLORS.seaDeep, period: '[--period:12s]' },
  { d: 'M0 100 Q180 60 360 100 T720 100 T1080 100 T1440 100 T1800 100 L1800 150 L0 150 Z', fill: COLORS.sea, period: '[--period:8s]' },
  { d: 'M0 115 Q180 85 360 115 T720 115 T1080 115 T1440 115 T1800 115 L1800 150 L0 150 Z', fill: COLORS.seaLight, period: '[--period:6s]' },
]

export function OceanWaves() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 overflow-hidden" aria-hidden="true">
      <div className={`absolute inset-0 ${world.lagoon}`} />
      <svg viewBox="0 0 1440 150" preserveAspectRatio="none" className="absolute bottom-0 h-28 w-full" focusable="false">
        {WAVES.map(({ d, fill, period }) => (
          <path key={period} d={d} fill={fill} className={`${world.roll} ${period}`} />
        ))}
      </svg>
      <div className={`absolute inset-x-0 bottom-0 h-5 ${world.shore}`} />
    </div>
  )
}

type Floater = { icon: ReactNode; place: string }

const mango = <Mango size={32} />
const crate = <Crate size={30} />
const crystal = <Crystal size={28} />
const gem = (color: GemColor) => <Gem size={26} color={color} />

const FLOATERS: Record<Profession, Floater[]> = {
  engineer: [
    { icon: mango, place: 'left-[5%] top-[12%]' },
    { icon: gem('blue'), place: 'left-[92%] top-[22%]' },
    { icon: crate, place: 'left-[7%] top-[55%]' },
    { icon: gem('green'), place: 'left-[88%] top-[70%]' },
    { icon: crystal, place: 'left-[10%] top-[85%]' },
  ],
  drummer: [
    { icon: mango, place: 'left-[6%] top-[18%]' },
    { icon: gem('purple'), place: 'left-[90%] top-[28%]' },
    { icon: mango, place: 'left-[8%] top-[50%]' },
    { icon: crate, place: 'left-[88%] top-[65%]' },
    { icon: gem('yellow'), place: 'left-[5%] top-[78%]' },
  ],
  fighter: [
    { icon: gem('red'), place: 'left-[6%] top-[15%]' },
    { icon: mango, place: 'left-[91%] top-[25%]' },
    { icon: crate, place: 'left-[7%] top-[48%]' },
    { icon: mango, place: 'left-[89%] top-[62%]' },
    { icon: crystal, place: 'left-[8%] top-[80%]' },
  ],
}

// Each floater's loop starts at its own point, as literal classes so the build generates them.
const FLOAT_DELAYS = ['[--delay:0s]', '[--delay:-2s]', '[--delay:-4s]', '[--delay:-6s]', '[--delay:-8s]']

export function JungleFloaters({ profession }: { profession: Profession }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[4] hidden overflow-hidden sm:block" aria-hidden="true">
      {FLOATERS[profession].map(({ icon, place }, i) => (
        <div key={place} className={`absolute opacity-60 ${place} ${world.float} ${FLOAT_DELAYS[i]}`}>
          {icon}
        </div>
      ))}
    </div>
  )
}
