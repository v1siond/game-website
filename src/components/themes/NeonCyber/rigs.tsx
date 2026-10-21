import type { CSSProperties, ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { MERC_ACTION, MercSprite } from './merc'
import { NEON } from './palette'
import world from './world.module.css'

// His rig per profession, the place the quickhack menu swaps in: three layers (far, mid with him, near)
// that lean apart under the pointer, each place with its own loop.
// - System Engineer, the den: the city through the window, cables from the ceiling, three screens with
//   scrolling code, the deck on the desk and the netrunner chair; he types (5 loops).
// - Musician, the club: a holo sign over the stage, two beams sweeping, his kit with the crash shaking
//   on the hit; he plays behind it (6 loops).
// - Martial Artist, the overpass gym: the highway deck overhead with traffic crossing, the ring ropes
//   in front, the heavy bag swinging on its chain; the guard, the jab and the roundhouse (4 loops).

const VIEW = '0 0 480 240'

function Layer({ depth, children }: { depth: 'far' | 'mid' | 'near'; children: ReactNode }) {
  return (
    <svg
      viewBox={VIEW}
      preserveAspectRatio="xMidYMid meet"
      className={`absolute inset-0 h-full w-full overflow-visible ${world.depth} ${world[depth]}`}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

// Where he stands in the rig, in percent of the rig box; his loop there is the merc's profession action.
const PLACE: Record<Profession, string> = {
  engineer: 'left-[13%] bottom-[3%] w-[18%]',
  drummer: 'left-[41%] bottom-[10%] w-[18%]',
  fighter: 'left-[30%] bottom-[4%] w-[18%]',
}

// ---- System Engineer: the den ----

const CODE_ROWS = [0, 10, 20, 30, 40, 50, 60, 70]

function Screen({ x, y, id, color }: { x: number; y: number; id: string; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width={58} height={44} fill={NEON.ink} stroke={NEON.steel} strokeWidth={3} />
      <clipPath id={id}>
        <rect x={x + 4} y={y + 4} width={50} height={36} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <g className={world.codeScroll}>
          {CODE_ROWS.map((row, i) => (
            <rect key={row} x={x + 6 + (i % 3) * 4} y={y + 8 + row} width={22 + ((i * 7) % 20)} height={4} fill={color} fillOpacity={0.8} />
          ))}
        </g>
      </g>
      <rect x={x + 26} y={y + 44} width={6} height={14} fill={NEON.steel} />
    </g>
  )
}

function Den({ figure }: { figure: ReactNode }) {
  return (
    <>
      <Layer depth="far">
        <rect x={-40} y={-20} width={560} height={280} fill={NEON.dusk} />
        <rect x={190} y={18} width={270} height={92} fill={NEON.ink} stroke={NEON.steel} strokeWidth={4} />
        {[205, 240, 290, 330, 380, 420].map((x, i) => (
          <rect key={x} x={x} y={110 - (i % 2 ? 46 : 70)} width={28} height={i % 2 ? 46 : 70} fill={NEON.tower} />
        ))}
        <rect x={322} y={18} width={4} height={92} fill={NEON.steel} />
        <rect x={190} y={62} width={270} height={3} fill={NEON.steel} />
      </Layer>
      <Layer depth="mid">
        <path d="M150 -10 Q170 60 160 120 M176 -10 Q205 50 214 104 M420 -10 Q404 40 436 126" stroke={NEON.ink} strokeWidth={3} fill="none" />
        <rect x={128} y={164} width={302} height={8} fill={NEON.steel} />
        <rect x={138} y={172} width={8} height={68} fill={NEON.steel} />
        <rect x={412} y={172} width={8} height={68} fill={NEON.steel} />
        <Screen x={196} y={92} id="nc-den-a" color={NEON.data} />
        <Screen x={262} y={84} id="nc-den-b" color={NEON.hud} />
        <rect x={334} y={98} width={52} height={40} fill={NEON.ink} stroke={NEON.steel} strokeWidth={3} />
        <rect x={344} y={112} width={8} height={12} fill={NEON.hack} className={world.blink} />
        {/* the deck under his hands, its status light */}
        <rect x={132} y={154} width={74} height={10} fill={NEON.alley} stroke={NEON.data} strokeWidth={1.5} />
        <rect x={192} y={157} width={8} height={3} fill={NEON.hack} />
      </Layer>
      {figure}
      <Layer depth="near">
        {/* the netrunner chair, reclined, its cable to the deck */}
        <path d="M400 236 L418 168 Q426 150 446 156 L470 236 Z" fill={NEON.ink} stroke={NEON.chromeRed} strokeWidth={2} />
        <path d="M420 176 Q300 230 206 160" stroke={NEON.data} strokeOpacity={0.6} strokeWidth={2} fill="none" />
        <rect x={-40} y={232} width={560} height={20} fill={NEON.ink} />
      </Layer>
    </>
  )
}

// ---- Musician: the club ----

function Club({ figure }: { figure: ReactNode }) {
  return (
    <>
      <Layer depth="far">
        <rect x={-40} y={-20} width={560} height={280} fill={NEON.ink} />
        {/* the holo sign: a ring and three bars, no words */}
        <g className={world.flicker}>
          <circle cx={240} cy={52} r={30} fill="none" stroke={NEON.hud} strokeWidth={4} />
          <rect x={196} y={92} width={88} height={6} fill={NEON.magenta} />
          <rect x={210} y={102} width={60} height={4} fill={NEON.data} />
        </g>
        <polygon points="120,-10 150,-10 250,220 30,220" fill={NEON.data} fillOpacity={0.12} className={world.beam} style={{ '--origin': '135px 0' } as CSSProperties} />
        <polygon points="330,-10 360,-10 450,220 230,220" fill={NEON.magenta} fillOpacity={0.12} className={`${world.beam} ${world.beamBack}`} style={{ '--origin': '345px 0' } as CSSProperties} />
      </Layer>
      <Layer depth="mid">
        <rect x={60} y={196} width={360} height={14} fill={NEON.steel} />
        {/* toms and the floor tom at either hand, the crash high on the right */}
        <ellipse cx={186} cy={160} rx={20} ry={9} fill={NEON.alley} stroke={NEON.chrome} strokeWidth={2} />
        <ellipse cx={294} cy={160} rx={20} ry={9} fill={NEON.alley} stroke={NEON.chrome} strokeWidth={2} />
        <line x1={330} y1={196} x2={330} y2={112} stroke={NEON.chrome} strokeWidth={2} />
        <ellipse cx={330} cy={112} rx={30} ry={5} fill={NEON.gold} fillOpacity={0.85} className={world.cymbal} />
        <line x1={150} y1={196} x2={150} y2={124} stroke={NEON.chrome} strokeWidth={2} />
        <ellipse cx={150} cy={124} rx={22} ry={4} fill={NEON.gold} fillOpacity={0.7} />
      </Layer>
      {figure}
      <Layer depth="near">
        {/* the bass drum in front of him, its head lit in the club's yellow ring */}
        <circle cx={240} cy={196} r={34} fill={NEON.ink} stroke={NEON.chrome} strokeWidth={3} />
        <circle cx={240} cy={196} r={20} fill="none" stroke={NEON.hud} strokeWidth={3} />
        <rect x={-40} y={226} width={560} height={30} fill={NEON.ink} />
      </Layer>
    </>
  )
}

// ---- Martial Artist: the overpass gym ----

function Gym({ figure }: { figure: ReactNode }) {
  return (
    <>
      <Layer depth="far">
        <rect x={-40} y={-20} width={560} height={280} fill={NEON.dusk} />
        <rect x={-40} y={20} width={560} height={26} fill={NEON.alley} />
        <rect x={-40} y={46} width={560} height={6} fill={NEON.ink} />
        {[40, 200, 360].map((x) => (
          <rect key={x} x={x} y={52} width={30} height={190} fill={NEON.street} />
        ))}
        <g className={world.traffic}>
          <rect x={0} y={30} width={10} height={4} fill={NEON.ice} />
          <rect x={60} y={36} width={10} height={4} fill={NEON.chromeRed} />
        </g>
      </Layer>
      <Layer depth="mid">
        <path d="M0 160 H480 M0 130 H480" stroke={NEON.steel} strokeWidth={1} strokeDasharray="3 5" />
        {/* the heavy bag on its chain, hung off the overpass */}
        <line x1={330} y1={52} x2={330} y2={96} stroke={NEON.chrome} strokeWidth={2} strokeDasharray="4 2" />
        <g className={world.bag}>
          <line x1={330} y1={96} x2={330} y2={104} stroke={NEON.chrome} strokeWidth={2} />
          <rect x={312} y={104} width={36} height={92} rx={10} fill={NEON.hotPink} />
          <rect x={312} y={120} width={36} height={4} fill={NEON.ink} />
          <rect x={312} y={176} width={36} height={4} fill={NEON.ink} />
        </g>
      </Layer>
      {figure}
      <Layer depth="near">
        {/* the ring: posts and three ropes */}
        <rect x={20} y={150} width={8} height={90} fill={NEON.chrome} />
        <rect x={452} y={150} width={8} height={90} fill={NEON.chrome} />
        <path d="M24 162 H456 M24 186 H456 M24 210 H456" stroke={NEON.chromeRed} strokeWidth={3} />
        <rect x={-40} y={230} width={560} height={26} fill={NEON.ink} />
      </Layer>
    </>
  )
}

const RIG: Record<Profession, (props: { figure: ReactNode }) => ReactNode> = {
  engineer: Den,
  drummer: Club,
  fighter: Gym,
}

export function Rig({ profession }: { profession: Profession }) {
  const Place = RIG[profession]
  const place = PLACE[profession]

  return (
    <div className="relative aspect-[2/1] overflow-hidden border border-[color-mix(in_srgb,var(--neon-chrome-red)_60%,transparent)] bg-[color:var(--neon-ink)]" aria-hidden="true">
      <Place
        figure={
          <div className={`absolute ${place} ${world.depth} ${world.mid}`}>
            <MercSprite profession={profession} motion={MERC_ACTION[profession]} className="h-auto w-full" />
          </div>
        }
      />
    </div>
  )
}
