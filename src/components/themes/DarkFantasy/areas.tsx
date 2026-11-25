'use client'

import { createContext, memo, useContext, useId, type ReactNode } from 'react'
import { DARK_FANTASY as P } from './palette'

// The places of the descent, one per scene, each its own area of the fallen kingdom in the game's order and
// look (the C62 research notes, L240 to L266): the fading town above the well, the
// stone crossroads with the sealed door far back, the green overgrowth over pools of acid, the ochre wastes and
// the village of blades on its poles, the blue city in the rain, the spire above it, the black tunnels of the
// nest, the abyss under everything, the temple round the door, and the light behind it. Each is drawn on
// one 1920 by 1080 canvas split into the theatre's layers: the sky and what stands far off (sky), the middle
// distance (mid), the ground he stands on (near) and the dark shapes in front (fg). The infection's orange
// rises area by area: none in the town, a glow in the crossroads, the temple floor cracked with it.
//
// A layer is cut from the canvas bottom anchored; on a screen narrower than lg the framing (Framing) centres
// the cut on the scene's action, so a phone shows the half of the canvas the scene plays in. The sections
// alternate sides from lg: a scene that plays on the left half is drawn `pan` further left, and the pieces of
// its area that frame the action (SetPiece: an arch, the pillars, the pools) move with it while the rest of the
// place stays where it stands.

export const CANVAS_W = 1920
export const CANVAS_H = 1080
/** The ground line his soles stand on. */
export const FLOOR_Y = 990

export type AreaName = 'town' | 'crossroads' | 'overgrowth' | 'village' | 'city' | 'spire' | 'nest' | 'abyss' | 'temple' | 'light'

/** How a scene is cut: on a narrow screen the canvas x the cut is centred on; from lg how far left its action
 *  and its set pieces are drawn (0 when it plays on the right half). */
export const Framing = createContext<{ narrow: boolean; centerX: number; pan: number }>({ narrow: false, centerX: CANVAS_W / 2, pan: 0 })

/** One layer's canvas: bottom anchored, cut at the sides, centred on the scene's action on a narrow screen. */
export function AreaLayer({ children }: { children: ReactNode }) {
  const { narrow, centerX } = useContext(Framing)
  const left = narrow ? centerX - CANVAS_W / 2 : 0
  return (
    <svg viewBox={`${left} 0 ${CANVAS_W} ${CANVAS_H}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

/** A piece of an area that frames where the scene plays, drawn with the action when it plays on the left. */
function SetPiece({ children }: { children: ReactNode }) {
  const { pan } = useContext(Framing)
  return <g transform={pan ? `translate(${pan} 0)` : undefined}>{children}</g>
}

/** An area's colours: the sky from its top to its low haze, the far and middle shapes, the ground, and its light. */
interface Tint {
  top: string
  low: string
  far: string
  mid: string
  ground: string
  light: string
}

const TINTS: Record<AreaName, Tint> = {
  town: { top: '#2a3142', low: '#8b94a6', far: '#5b6476', mid: '#323847', ground: '#15171f', light: P.spiritGold },
  crossroads: { top: '#141c30', low: '#4f6288', far: '#3a4a6c', mid: '#202a42', ground: '#0e1220', light: P.infectedGlow },
  overgrowth: { top: '#0f2416', low: '#4f8f5a', far: '#326040', mid: '#1c3a24', ground: '#0b170e', light: P.acid },
  village: { top: '#241a0c', low: '#a6874c', far: '#6c5630', mid: '#3a2c16', ground: '#160f07', light: P.spore },
  city: { top: '#0c1834', low: '#4069b0', far: '#2a4888', mid: '#16285a', ground: '#0a1226', light: P.rain },
  spire: { top: '#13224a', low: '#7397d8', far: '#44649f', mid: '#22336a', ground: '#0d1630', light: P.rain },
  nest: { top: '#08080b', low: '#2c2834', far: '#1c1a24', mid: '#100f15', ground: '#050507', light: P.lantern },
  abyss: { top: '#000000', low: '#16161c', far: '#0c0c10', mid: '#060608', ground: '#000000', light: P.white },
  temple: { top: '#120806', low: '#5a2814', far: '#3c1a10', mid: '#200c08', ground: '#100606', light: P.infected },
  light: { top: '#e9dcc0', low: '#fff6e2', far: '#f3e4c4', mid: '#e2cfa6', ground: '#cdb88c', light: P.white },
}

// A stable stand in for chance: the same fraction in 0 to 1 for the same index on every render.
const scatter = (i: number): number => {
  const s = Math.sin(i * 12.9898) * 43758.5453
  return s - Math.floor(s)
}

const range = (n: number): number[] => Array.from({ length: n }, (_, i) => i)

// ---- what stands far off, per area ----

/** The pass he comes over and the roofs of the town under it, one lamp lit. */
function TownFar({ t }: { t: Tint }) {
  return (
    <g>
      <path d="M0 640 L180 520 L340 590 L520 430 L700 560 L860 470 L1040 600 L1240 420 L1420 540 L1600 380 L1760 470 L1920 410 L1920 1080 L0 1080 Z" fill={t.far} />
      {range(9).map((i) => {
        const x = 980 + i * 110 + scatter(i) * 30
        const h = 120 + scatter(i + 9) * 70
        return <path key={i} d={`M${x} 900 L${x} ${900 - h} L${x + 45} ${860 - h} L${x + 90} ${900 - h} L${x + 90} 900 Z`} fill={t.mid} opacity={0.85} />
      })}
    </g>
  )
}

/** The stone vault of the crossroads, its hanging rock, and far back through an arch the great door. */
function CrossroadsFar({ t }: { t: Tint }) {
  return (
    <g>
      <path d="M0 0 H1920 V170 Q1700 260 1500 190 Q1300 130 1100 220 Q900 300 700 200 Q420 90 200 230 Q90 290 0 250 Z" fill={t.mid} />
      {range(12).map((i) => {
        const x = 80 + i * 160 + scatter(i) * 50
        const h = 80 + scatter(i + 3) * 140
        return <path key={i} d={`M${x - 26} 180 L${x} ${180 + h} L${x + 26} 180 Z`} fill={t.mid} />
      })}
      <SetPiece>
        <path d="M1290 990 L1290 520 Q1290 380 1450 380 Q1610 380 1610 520 L1610 990 Z" fill={t.far} />
      </SetPiece>
    </g>
  )
}

/** Hanging leaves and vines over the overgrowth, the light coming down through them in shafts. */
function OvergrowthFar({ t }: { t: Tint }) {
  return (
    <g>
      {range(5).map((i) => (
        <path key={i} d={`M${200 + i * 380} 0 L${320 + i * 380} 0 L${520 + i * 380} 990 L${380 + i * 380} 990 Z`} fill={t.light} opacity={0.05} />
      ))}
      {range(14).map((i) => {
        const x = 40 + i * 140 + scatter(i) * 60
        const len = 220 + scatter(i + 5) * 340
        return (
          <g key={i} fill={t.far}>
            <path d={`M${x} 0 Q${x + 18} ${len / 2} ${x - 6} ${len} L${x + 4} ${len} Q${x + 30} ${len / 2} ${x + 10} 0 Z`} />
            <ellipse cx={x - 2} cy={len} rx={26} ry={12} transform={`rotate(-30 ${x - 2} ${len})`} />
          </g>
        )
      })}
      <path d="M0 760 Q200 690 420 740 Q660 800 900 720 Q1180 640 1420 730 Q1680 810 1920 720 V1080 H0 Z" fill={t.far} />
    </g>
  )
}

/** The ochre wastes: tall thin poles of the village of blades, the ropes slung between them, the spores. */
function VillageFar({ t }: { t: Tint }) {
  return (
    <g>
      {range(11).map((i) => {
        const x = 60 + i * 180 + scatter(i) * 40
        const top = 140 + scatter(i + 2) * 220
        return <rect key={i} x={x} y={top} width={14} height={990 - top} fill={t.far} />
      })}
      {range(10).map((i) => {
        const x = 67 + i * 180
        const y = 300 + scatter(i + 7) * 200
        return <path key={i} d={`M${x} ${y} Q${x + 90} ${y + 60} ${x + 180} ${y}`} fill="none" stroke={t.far} strokeWidth={4} />
      })}
      <path d="M0 820 Q240 760 520 800 Q860 850 1200 790 Q1560 740 1920 800 V1080 H0 Z" fill={t.far} />
    </g>
  )
}

/** The blue city: tall towers with lit windows behind the rain. */
function CityFar({ t, high = false }: { t: Tint; high?: boolean }) {
  const base = high ? 1080 : 990
  return (
    <g>
      {range(10).map((i) => {
        const x = 20 + i * 200 + scatter(i) * 60
        const w = 90 + scatter(i + 4) * 60
        const top = (high ? 420 : 160) + scatter(i + 8) * 260
        return (
          <g key={i}>
            <rect x={x} y={top} width={w} height={base - top} fill={t.far} />
            <path d={`M${x} ${top} L${x + w / 2} ${top - w * 0.9} L${x + w} ${top} Z`} fill={t.far} />
            {range(4).map((j) => (
              <rect key={j} x={x + w / 2 - 6} y={top + 40 + j * 70} width={12} height={26} rx={6} fill={t.light} opacity={0.35} />
            ))}
          </g>
        )
      })}
    </g>
  )
}

/** The black tunnels of the nest: thick roots and old webs, a few lanterns' glow far off. */
function NestFar({ t }: { t: Tint }) {
  return (
    <g>
      {range(9).map((i) => {
        const x = 100 + i * 220 + scatter(i) * 60
        return <path key={i} d={`M${x - 40} 0 Q${x + 30} 300 ${x - 20} 600 Q${x - 50} 800 ${x} 990 L${x + 40} 990 Q${x} 760 ${x + 30} 600 Q${x + 80} 300 ${x + 20} 0 Z`} fill={t.far} />
      })}
      {range(6).map((i) => (
        <circle key={i} cx={260 + i * 300 + scatter(i) * 80} cy={520 + scatter(i + 3) * 200} r={5} fill={t.light} opacity={0.35} />
      ))}
    </g>
  )
}

/** The abyss: the dark, and far off under it the pale heaps of the shells that went down before him. */
function AbyssFar({ t }: { t: Tint }) {
  return (
    <g>
      <path d="M0 880 Q300 820 600 870 Q900 920 1200 860 Q1500 800 1920 870 V1080 H0 Z" fill={t.far} />
      {range(40).map((i) => (
        <ellipse key={i} cx={40 + i * 48 + scatter(i) * 20} cy={870 + scatter(i + 40) * 40} rx={10} ry={13} fill={P.bone} opacity={0.08 + scatter(i + 80) * 0.08} />
      ))}
    </g>
  )
}

/** The temple round the door: the curved inside of a shell of stone, its ribs, the chains' anchors. */
function TempleFar({ t }: { t: Tint }) {
  return (
    <g>
      <path d="M0 0 H1920 V1080 H1800 Q1840 520 1460 200 Q1200 40 960 40 Q720 40 460 200 Q80 520 120 1080 H0 Z" fill={t.mid} />
      {range(7).map((i) => {
        const x = 300 + i * 220
        return <path key={i} d={`M${x} 990 Q${x + (960 - x) * 0.2} 400 ${960 + (x - 960) * 0.3} 80`} fill="none" stroke={t.far} strokeWidth={10} />
      })}
    </g>
  )
}

/** The light: a field of white with pale columns of light rising through it. */
function LightFar({ t }: { t: Tint }) {
  return (
    <g>
      {range(9).map((i) => (
        <rect key={i} x={80 + i * 220 + scatter(i) * 40} y={0} width={40 + scatter(i + 2) * 40} height={1080} fill={t.light} opacity={0.35} />
      ))}
    </g>
  )
}

const FAR: Record<AreaName, (props: { t: Tint }) => ReactNode> = {
  town: TownFar,
  crossroads: CrossroadsFar,
  overgrowth: OvergrowthFar,
  village: VillageFar,
  city: CityFar,
  spire: ({ t }) => <CityFar t={t} high />,
  nest: NestFar,
  abyss: AbyssFar,
  temple: TempleFar,
  light: LightFar,
}

/** The sky of an area from its top to its haze, what stands far off, and its drifting motes or rain
 *  ([data-fx="motes"], moved by the scroll). */
export const AreaSky = memo(function AreaSky({ area }: { area: AreaName }) {
  const id = useId()
  const { pan } = useContext(Framing)
  const t = TINTS[area]
  const Far = FAR[area]
  const rain = area === 'city' || area === 'spire'
  return (
    <AreaLayer>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={t.top} />
          <stop offset="0.75" stopColor={t.low} />
          <stop offset="1" stopColor={t.low} />
        </linearGradient>
        <radialGradient id={`${id}glow`} cx={(0.72 + pan / CANVAS_W).toFixed(3)} cy="0.55" r="0.5">
          <stop offset="0" stopColor={t.light} stopOpacity="0.16" />
          <stop offset="1" stopColor={t.light} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x={-600} width={CANVAS_W + 1200} height={CANVAS_H} fill={`url(#${id}sky)`} />
      <rect x={-600} width={CANVAS_W + 1200} height={CANVAS_H} fill={`url(#${id}glow)`} />
      <Far t={t} />
      <g data-fx="motes">
        {rain
          ? range(60).map((i) => {
              const x = scatter(i) * CANVAS_W
              const y = scatter(i + 60) * CANVAS_H - 200
              return <path key={i} d={`M${x.toFixed(0)} ${y.toFixed(0)} l-8 60`} stroke={t.light} strokeWidth={2} opacity={0.35} />
            })
          : range(22).map((i) => (
              <circle key={i} cx={(scatter(i) * CANVAS_W).toFixed(0)} cy={(200 + scatter(i + 22) * 760).toFixed(0)} r={2 + (i % 3)} fill={t.light} opacity={0.35} />
            ))}
      </g>
    </AreaLayer>
  )
})

// ---- the middle distance, per area ----

const MID: Partial<Record<AreaName, (props: { t: Tint }) => ReactNode>> = {
  town: ({ t }) => (
    <g fill={t.mid}>
      <path d="M760 990 L760 760 L860 680 L960 760 L960 990 Z" />
      <path d="M1560 990 L1560 800 L1660 720 L1760 800 L1760 990 Z" />
      <rect x={1060} y={720} width={6} height={270} />
      <circle cx={1063} cy={712} r={14} fill={t.light} opacity={0.9} />
      <circle cx={1063} cy={712} r={46} fill={t.light} opacity={0.15} />
    </g>
  ),
  crossroads: ({ t }) => (
    <g fill={t.mid}>
      <path d="M0 990 V300 Q120 260 180 330 V990 Z" />
      <path d="M1920 990 V300 Q1800 260 1740 330 V990 Z" />
    </g>
  ),
  overgrowth: ({ t }) => (
    <g fill={t.mid}>
      <path d="M0 0 H700 Q560 120 380 90 Q200 60 0 160 Z" />
      <path d="M1920 0 H1300 Q1460 140 1660 100 Q1820 70 1920 180 Z" />
      <SetPiece>
        {range(6).map((i) => (
          <path key={i} d={`M${980 + i * 170} 990 Q${960 + i * 170} 860 ${1010 + i * 170} 800 Q${1030 + i * 170} 900 ${1020 + i * 170} 990 Z`} />
        ))}
      </SetPiece>
    </g>
  ),
  village: ({ t }) => (
    <SetPiece>
      <g fill={t.mid}>
        <rect x={1000} y={260} width={26} height={730} />
        <rect x={1880} y={200} width={40} height={790} />
      </g>
    </SetPiece>
  ),
  city: ({ t }) => (
    <SetPiece>
      <g fill={t.mid}>
        <rect x={1860} y={0} width={60} height={1080} />
        <rect x={960} y={0} width={60} height={1080} />
        <path d="M960 0 H1920 V90 Q1440 30 960 90 Z" />
      </g>
    </SetPiece>
  ),
  spire: ({ t }) => (
    <SetPiece>
      <circle cx={1730} cy={430} r={150} fill={t.low} opacity={0.5} />
      <circle cx={1730} cy={430} r={150} fill="none" stroke={t.mid} strokeWidth={26} />
      <path d="M1730 280 V580 M1580 430 H1880" stroke={t.mid} strokeWidth={10} />
      <rect x={1080} y={0} width={50} height={1080} fill={t.mid} />
    </SetPiece>
  ),
  nest: ({ t }) => (
    <g fill={t.mid}>
      <path d="M0 0 H1920 V120 Q1500 240 1200 150 Q900 60 600 200 Q300 320 0 180 Z" />
      <path d="M0 1080 V560 Q140 520 220 640 Q260 820 300 1080 Z" />
    </g>
  ),
  temple: ({ t }) => (
    <SetPiece>
      <g fill={t.mid}>
        <rect x={1040} y={0} width={70} height={1080} />
        <rect x={1830} y={0} width={70} height={1080} />
      </g>
    </SetPiece>
  ),
}

/** The middle distance of an area: walls, houses, roots, whatever frames where he stands. */
export const AreaMid = memo(function AreaMid({ area }: { area: AreaName }) {
  const Mid = MID[area]
  return <AreaLayer>{Mid && <Mid t={TINTS[area]} />}</AreaLayer>
})

// ---- the ground and the dark in front ----

const GROUND_TOP: Partial<Record<AreaName, (props: { t: Tint }) => ReactNode>> = {
  overgrowth: ({ t }) => (
    <SetPiece>
      <rect x={560} y={992} width={260} height={18} rx={9} fill={t.light} opacity={0.55} />
      <rect x={1760} y={992} width={180} height={18} rx={9} fill={t.light} opacity={0.55} />
    </SetPiece>
  ),
  temple: ({ t }) => (
    <SetPiece>
      <g stroke={t.light} strokeWidth={3} fill="none" opacity={0.8}>
      {range(8).map((i) => {
        const x = 900 + i * 130 + scatter(i) * 40
        return <path key={i} d={`M${x} 994 l20 18 l-12 20 l26 24`} />
      })}
      </g>
    </SetPiece>
  ),
}

/** The ground he stands on, its ink edge and what lies on it (the acid pools, the temple's cracks). */
export const AreaGround = memo(function AreaGround({ area }: { area: AreaName }) {
  const t = TINTS[area]
  const Top = GROUND_TOP[area]
  return (
    <AreaLayer>
      <rect x={-600} y={FLOOR_Y} width={CANVAS_W + 1200} height={CANVAS_H - FLOOR_Y} fill={t.ground} />
      <path d={`M-600 ${FLOOR_Y} H${CANVAS_W + 600}`} stroke={P.black} strokeWidth={6} />
      {range(30).map((i) => {
        const x = i * 70 + scatter(i) * 30
        return <path key={i} d={`M${x} ${FLOOR_Y + 2} q8 -14 16 0 q8 -10 14 0`} fill={t.ground} stroke={P.black} strokeWidth={2} />
      })}
      {Top && <Top t={t} />}
    </AreaLayer>
  )
})

/** The dark shapes in front of the area at the bottom corners, and the mist rising under them. */
export const AreaFront = memo(function AreaFront({ area }: { area: AreaName }) {
  const id = useId()
  const t = TINTS[area]
  const ink = P.black
  return (
    <AreaLayer>
      <defs>
        <linearGradient id={`${id}mist`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={t.ground} stopOpacity="0" />
          <stop offset="1" stopColor={t.ground} stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <rect x={-600} y={CANVAS_H - 200} width={CANVAS_W + 1200} height={200} fill={`url(#${id}mist)`} />
      <path d="M-600 1080 V940 Q-300 900 -80 960 Q80 1000 180 1080 Z" fill={ink} />
      <path d="M2520 1080 V930 Q2200 890 2000 950 Q1880 990 1840 1080 Z" fill={ink} />
    </AreaLayer>
  )
})
