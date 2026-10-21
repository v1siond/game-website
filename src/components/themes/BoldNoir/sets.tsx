import type { CSSProperties, ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HitStar, StarBurst } from './backdrop'
import { HeroCharacter } from './character'
import { NOIR } from './palette'
import world from './world.module.css'

// Bold Noir's three profession sets, the hideout panel under the menu that shows him at work in the
// picked profession. Each is a flat panel the way the game draws its menus: a red wash, a far layer in
// ink, a near layer of solid black shapes and paper highlights, no gradient. The far and near layers
// lean against the pointer (--mx, --my) in opposite directions for depth. A pick slams the new set in
// (keyed by profession in the theme).
// - System Engineer: the night office, the city through the window, a standing desk with two
//   monitors, the code lines typing in and the cursor blinking (4 animated).
// - Musician: the club stage, a spotlight sweeping, his kit, the crash cymbal shaking on the hit
//   (2 animated).
// - Martial Artist: the gym, the heavy bag swinging on its chain, a hit star bursting on it, the ring
//   ropes in red (2 animated).

const VIEW = '0 0 600 200'

function Layer({ depth, children }: { depth: 'far' | 'near'; children: ReactNode }) {
  return (
    <svg viewBox={VIEW} preserveAspectRatio="xMidYMax slice" className={`absolute -inset-x-6 inset-y-0 h-full w-[calc(100%+3rem)] ${depth === 'far' ? world.followSoft : world.follow}`} aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

// ---- System Engineer: the night office ----

const CODE_LINES = [
  { x: 262, y: 92, w: 52 },
  { x: 262, y: 102, w: 38 },
  { x: 270, y: 112, w: 46 },
]

function Office() {
  return (
    <>
      <Layer depth="far">
        <rect width={600} height={200} fill={NOIR.redDeep} />
        <polygon points="40,20 250,10 240,150 50,156" fill={NOIR.ink} />
        {[60, 92, 130, 168, 200].map((x, i) => (
          <rect key={x} x={x} y={150 - (i % 2 ? 70 : 100)} width={26} height={i % 2 ? 70 : 100} fill={NOIR.smoke} />
        ))}
        <path d="M145 20 V152 M45 86 H245" stroke={NOIR.coal} strokeWidth={6} />
      </Layer>
      <Layer depth="near">
        <polygon points="0,170 600,160 600,200 0,200" fill={NOIR.ink} />
        <polygon points="230,140 470,134 466,146 234,152" fill={NOIR.paper} />
        <rect x={340} y={146} width={8} height={30} fill={NOIR.paper} />
        <polygon points="250,76 336,72 338,128 252,130" fill={NOIR.ink} stroke={NOIR.paper} strokeWidth={3} />
        <polygon points="350,74 440,78 438,128 352,126" fill={NOIR.ink} stroke={NOIR.paper} strokeWidth={3} />
        {CODE_LINES.map(({ x, y, w }, i) => (
          <rect key={y} x={x} y={y} width={w} height={5} fill={NOIR.red} className={world.typeLine} style={{ '--i': i } as CSSProperties} />
        ))}
        <rect x={364} y={92} width={6} height={10} fill={NOIR.paper} className={world.blink} />
        <foreignObject x={150} y={70} width={70} height={105}>
          <HeroCharacter profession="engineer" className={`h-full w-full ${world.redShadow}`} />
        </foreignObject>
      </Layer>
    </>
  )
}

// ---- Musician: the club stage ----

function Club() {
  return (
    <>
      <Layer depth="far">
        <rect width={600} height={200} fill={NOIR.ink} />
        <polygon points="0,0 120,0 60,200 0,200" fill={NOIR.redDeep} />
        <polygon points="480,0 600,0 600,200 540,200" fill={NOIR.redDeep} />
        <g className={world.sweep}>
          <polygon points="300,-10 220,170 380,170" fill={NOIR.paper} fillOpacity={0.14} />
        </g>
      </Layer>
      <Layer depth="near">
        <polygon points="0,168 600,160 600,200 0,200" fill={NOIR.coal} />
        <polygon points="0,160 600,152 600,160 0,168" fill={NOIR.red} />
        <foreignObject x={262} y={56} width={76} height={114}>
          <HeroCharacter profession="drummer" className={`h-full w-full ${world.redShadow}`} />
        </foreignObject>
        <ellipse cx={300} cy={146} rx={34} ry={22} fill={NOIR.ink} stroke={NOIR.paper} strokeWidth={3} />
        <circle cx={300} cy={146} r={8} fill={NOIR.red} />
        <rect x={232} y={128} width={30} height={18} fill={NOIR.ink} stroke={NOIR.paper} strokeWidth={2.5} />
        <rect x={338} y={124} width={28} height={16} fill={NOIR.ink} stroke={NOIR.paper} strokeWidth={2.5} />
        <path d="M228 112 V164 M376 104 V164" stroke={NOIR.paper} strokeWidth={2} />
        <ellipse cx={228} cy={112} rx={22} ry={4} fill={NOIR.paper} />
        <g className={world.crash}>
          <ellipse cx={376} cy={104} rx={24} ry={4} fill={NOIR.paper} />
        </g>
      </Layer>
    </>
  )
}

// ---- Martial Artist: the gym ----

function Gym() {
  return (
    <>
      <Layer depth="far">
        <rect width={600} height={200} fill={NOIR.coal} />
        <foreignObject x={400} y={-60} width={260} height={260}>
          <StarBurst className="h-full w-full opacity-30" light={NOIR.redDeep} dark={NOIR.coal} />
        </foreignObject>
        <path d="M0 96 L600 86 M0 118 L600 108 M0 140 L600 130" stroke={NOIR.red} strokeWidth={5} />
      </Layer>
      <Layer depth="near">
        <polygon points="0,166 600,158 600,200 0,200" fill={NOIR.ink} />
        <g className={world.swing}>
          <path d="M370 0 V40" stroke={NOIR.paper} strokeWidth={2} strokeDasharray="4 3" />
          <polygon points="352,40 390,38 394,146 356,150" fill={NOIR.ink} stroke={NOIR.paper} strokeWidth={3} />
          <rect x={352} y={70} width={40} height={6} fill={NOIR.red} />
          <foreignObject x={340} y={70} width={60} height={60}>
            <HitStar className={`h-full w-full ${world.bagHit}`} fill={NOIR.red} edge={NOIR.paper} />
          </foreignObject>
        </g>
        <foreignObject x={250} y={58} width={76} height={114}>
          <HeroCharacter profession="fighter" className={`h-full w-full ${world.redShadow}`} />
        </foreignObject>
      </Layer>
    </>
  )
}

const SET: Record<Profession, () => ReactNode> = {
  engineer: Office,
  drummer: Club,
  fighter: Gym,
}

export function ProfessionSet({ profession }: { profession: Profession }) {
  const Scene = SET[profession]

  return (
    <div className={`relative mx-auto h-48 max-w-5xl overflow-hidden sm:h-64 ${world.setFrame} ${world.setIn}`} aria-hidden="true">
      <Scene />
    </div>
  )
}
