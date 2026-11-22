'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { useZoneAttribute, type ValueStore } from '@/hooks/useZoneStage'
import { staggerAt } from '../shared/stagger'
import { ERA, PORTAL, type Era } from './palette'
import css from './backdrop.module.css'

// The world behind the page, fixed to the viewport: the warp room's night of navy and magenta with its
// stars over a dark sea (research part 1 [33][36]), dressed in the era of the section in view, the way
// the game gives each warp room its own era and colour key [1][36]. Each section hands its era up
// (useZoneStage); the root's data-zone (useZoneAttribute, no render) crossfades the eras: the hub's night
// for the hero, About and Contact, the medieval hills for Work Experience, the tomb for the Tech Stack,
// the great wall for Services, the future city for Projects, the deep for Ventures, the Arabian night for
// Bands and the prehistoric rocks for Muay Thai.
//
// Animated: the stars twinkling and the sea's swell (once on arrival), the crossfade between two eras,
// and the one element of each of those two eras, played only the first time its era comes in: the hub's beacon, the
// torch flames, the sand motes in the light shaft, the banners, the neon ring, the weed, the lamps, the
// lava's glow. At most 5 at once, none looping (BD29).
// Reduced motion and the preview: the eras swap with no fade and nothing moves.

const ERAS = Object.keys(ERA) as Era[]

const STARS = [
  [4, 8],
  [12, 22],
  [19, 6],
  [27, 15],
  [34, 30],
  [41, 9],
  [48, 21],
  [56, 4],
  [63, 17],
  [70, 28],
  [77, 11],
  [84, 24],
  [91, 7],
  [96, 19],
  [8, 36],
  [52, 38],
  [88, 40],
] as const

/** A layer of an era's art along the bottom of the screen, 1200 by 400, sliced to the screen's width. */
function Scenery({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 bottom-0 h-[46vh] w-full">
      {children}
    </svg>
  )
}

const { hub, medieval, tomb, wall, future, underwater, arabian, prehistoric } = ERA

const SCENERY: Record<Era, ReactNode> = {
  hub: (
    <>
      <ellipse cx={930} cy={344} rx={170} ry={26} fill={hub.far} />
      <ellipse cx={930} cy={336} rx={170} ry={24} fill={hub.near} />
      <ellipse cx={250} cy={360} rx={110} ry={16} fill={hub.near} />
      <path d="M196 352 L206 214 H216 L226 352 Z" fill={hub.far} />
      <g className={css.beacon}>
        <path d="M211 212 L110 150 L120 120 Z M211 212 L312 150 L302 120 Z" fill={hub.light} opacity={0.22} />
        <circle cx={211} cy={210} r={9} fill={hub.light} />
      </g>
    </>
  ),
  medieval: (
    <>
      <path d="M0 330 Q200 250 420 300 T820 280 T1200 300 V400 H0 Z" fill={medieval.hillFar} />
      <path d="M0 360 Q260 300 520 344 T1000 330 T1200 350 V400 H0 Z" fill={medieval.hill} />
      {[180, 640, 980].map((x) => (
        <g key={x}>
          <rect x={x - 26} y={250} width={52} height={110} fill={medieval.wall} stroke={PORTAL.INK} strokeWidth={3} />
          <path d={`M${x - 36} 252 L${x} 168 L${x + 36} 252 Z`} fill={medieval.cone} stroke={PORTAL.INK} strokeWidth={3} />
          <path d={`M${x} 168 L${x + 36} 252 H${x + 12} Z`} fill={medieval.coneDark} />
          <path d={`M${x - 8} 360 V320 Q${x} 306 ${x + 8} 320 V360 Z`} fill={PORTAL.INK} />
          <g className={css.flame}>
            <path d={`M${x + 44} 296 Q${x + 34} 280 ${x + 44} 262 Q${x + 54} 280 ${x + 44} 296 Z`} fill={medieval.flame} />
            <path d={`M${x + 44} 292 Q${x + 40} 282 ${x + 44} 274 Q${x + 48} 282 ${x + 44} 292 Z`} fill={medieval.flameCore} />
          </g>
          <path d={`M${x + 44} 296 V340`} stroke={PORTAL.INK} strokeWidth={4} />
        </g>
      ))}
    </>
  ),
  tomb: (
    <>
      <path d="M760 360 L980 140 L1200 360 Z" fill={tomb.stoneDark} />
      <path d="M980 140 L1200 360 H1090 Z" fill={tomb.stone} opacity={0.5} />
      <rect x={0} y={230} width={640} height={170} fill={tomb.stone} stroke={PORTAL.INK} strokeWidth={3} />
      <rect x={0} y={252} width={640} height={14} fill={tomb.band} />
      <rect x={0} y={300} width={640} height={8} fill={tomb.paint} />
      {[80, 220, 360, 500].map((x) => (
        <rect key={x} x={x} y={266} width={40} height={134} fill={tomb.stoneDark} stroke={PORTAL.INK} strokeWidth={3} />
      ))}
      <path d="M560 0 L700 0 L520 400 L380 400 Z" fill={tomb.shaft} opacity={0.12} />
      {[
        [520, 300],
        [480, 250],
        [560, 200],
        [500, 160],
        [600, 120],
      ].map(([x, y], index) => (
        <circle key={`${x}-${y}`} className={`${css.mote} ${staggerAt(index)}`} cx={x} cy={y} r={3} fill={tomb.shaft} />
      ))}
    </>
  ),
  wall: (
    <>
      <path d="M0 320 Q300 220 600 290 T1200 250 V400 H0 Z" fill={wall.hill} />
      <path d="M0 300 L200 250 L420 280 L640 220 L860 260 L1080 210 L1200 230 V262 L1080 242 L860 292 L640 252 L420 312 L200 282 L0 332 Z" fill={wall.stone} stroke={PORTAL.INK} strokeWidth={3} />
      <path d="M0 300 L200 250 L420 280 L640 220 L860 260 L1080 210 L1200 230" fill="none" stroke={wall.stoneDark} strokeWidth={10} strokeDasharray="14 10" />
      {[
        [200, 250],
        [640, 220],
        [1080, 210],
      ].map(([x, y]) => (
        <g key={x}>
          <path d={`M${x} ${y} V${y - 96}`} stroke={wall.pole} strokeWidth={5} />
          <path className={css.banner} d={`M${x + 2} ${y - 94} H${x + 58} L${x + 46} ${y - 72} L${x + 58} ${y - 50} H${x + 2} Z`} fill={wall.banner} stroke={PORTAL.INK} strokeWidth={3} />
        </g>
      ))}
    </>
  ),
  future: (
    <>
      {[
        [40, 180, 90],
        [150, 110, 70],
        [240, 210, 110],
        [370, 140, 80],
        [470, 60, 120],
        [610, 160, 90],
        [720, 90, 110],
        [850, 200, 80],
        [950, 120, 100],
        [1070, 170, 110],
      ].map(([x, y, width]) => (
        <g key={x}>
          <rect x={x} y={y} width={width} height={400 - y} fill={future.tower} stroke={future.towerDark} strokeWidth={4} />
          <path d={`M${x + 14} ${y + 24} H${x + width - 14} M${x + 14} ${y + 64} H${x + width - 14} M${x + 14} ${y + 104} H${x + width - 14}`} stroke={future.window} strokeWidth={6} strokeDasharray="8 10" />
        </g>
      ))}
      <g className={css.ring}>
        <ellipse cx={600} cy={90} rx={150} ry={34} fill="none" stroke={future.neonPink} strokeWidth={8} />
        <ellipse cx={600} cy={90} rx={150} ry={34} fill="none" stroke={future.neonTeal} strokeWidth={3} strokeDasharray="20 24" />
      </g>
    </>
  ),
  underwater: (
    <>
      <rect x={0} y={0} width={1200} height={400} fill={underwater.water} opacity={0.35} />
      <path d="M0 360 Q300 330 600 356 T1200 344 V400 H0 Z" fill={underwater.sand} />
      {[90, 260, 470, 720, 930, 1110].map((x, index) => (
        <path
          key={x}
          className={`${css.weed} ${staggerAt(index)}`}
          d={`M${x} 362 Q${x - 24} 300 ${x + 6} 250 Q${x + 26} 210 ${x - 4} 160 Q${x + 18} 220 ${x + 18} 254 Q${x + 2} 300 ${x + 16} 362 Z`}
          fill={index % 2 === 0 ? underwater.weed : underwater.weedLight}
          stroke={PORTAL.INK}
          strokeWidth={3}
        />
      ))}
    </>
  ),
  arabian: (
    <>
      <path d="M0 400 V300 H160 V262 C160 222 222 214 230 150 C238 214 300 222 300 262 V300 H420 V188 L433 166 L446 188 V300 H600 V272 C600 230 672 222 680 156 C688 222 760 230 760 272 V300 H940 V208 L953 186 L966 208 V300 H1200 V400 Z" fill={arabian.dome} stroke={PORTAL.INK} strokeWidth={3} />
      <path d="M0 400 V340 H1200 V400 Z" fill={arabian.domeDark} />
      {[230, 433, 680, 953].map((x) => (
        <g key={x} className={css.lamp}>
          <circle cx={x} cy={318} r={20} fill={arabian.lamp} opacity={0.3} />
          <ellipse cx={x} cy={318} rx={8} ry={10} fill={arabian.lamp} stroke={PORTAL.INK} strokeWidth={2.4} />
          <circle cx={x} cy={318} r={3.4} fill={arabian.lampCore} />
        </g>
      ))}
    </>
  ),
  prehistoric: (
    <>
      <path d="M700 380 L860 150 L900 160 L1060 380 Z" fill={prehistoric.rockLight} />
      <ellipse className={css.lava} cx={880} cy={156} rx={46} ry={18} fill={prehistoric.lava} />
      <path d="M872 158 Q850 260 830 380 M890 160 Q920 260 960 380" fill="none" stroke={prehistoric.lava} strokeWidth={8} />
      <path d="M0 400 V300 L80 260 L150 300 L230 240 L330 310 L420 280 V400 Z M1200 400 V280 L1110 240 L1040 300 L980 270 V400 Z" fill={prehistoric.rock} stroke={PORTAL.INK} strokeWidth={3} />
      <path d="M120 300 q14 -40 40 -50 M140 304 q24 -30 50 -26 M1080 296 q-14 -36 -40 -44" fill="none" stroke={prehistoric.fern} strokeWidth={8} strokeLinecap="round" />
      <ellipse className={css.lava} cx={600} cy={400} rx={420} ry={40} fill={prehistoric.lavaCore} opacity={0.4} />
    </>
  ),
}

export function Backdrop({ zones, still }: { zones: ValueStore<Era>; still: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  useZoneAttribute(zones, root)

  // An era the page leaves has had its one play: marked, its element stays at rest when the page comes back.
  useEffect(() => {
    let shown = zones.read()
    return zones.subscribe(() => {
      root.current?.querySelector(`[data-era='${shown}']`)?.setAttribute('data-played', '')
      shown = zones.read()
    })
  }, [zones])

  return (
    <div ref={root} data-zone={zones.first()} data-still={still || undefined} className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${css.world}`} aria-hidden="true">
      <svg viewBox="0 0 100 50" preserveAspectRatio="xMidYMin slice" className="absolute inset-x-0 top-0 h-[60vh] w-full">
        {STARS.map(([x, y], index) => (
          <circle key={`${x}-${y}`} className={`${css.star} ${staggerAt(index % 8)}`} cx={x} cy={y} r={0.28} fill={PORTAL.STAR} />
        ))}
      </svg>
      {ERAS.map((era) => (
        <div key={era} className={css.era} data-era={era}>
          <Scenery>{SCENERY[era]}</Scenery>
        </div>
      ))}
      <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className={`absolute inset-x-0 bottom-0 h-[7vh] w-full ${css.sea}`}>
        <rect width={1200} height={60} fill={PORTAL.SEA} />
        <path className={css.swell} d="M0 14 Q150 4 300 14 T600 14 T900 14 T1200 14 M0 36 Q150 26 300 36 T600 36 T900 36 T1200 36" fill="none" stroke={PORTAL.SEA_LIGHT} strokeWidth={3} />
      </svg>
    </div>
  )
}
