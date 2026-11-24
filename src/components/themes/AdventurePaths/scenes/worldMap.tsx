import type { Profession } from '@/lib/cv/professions'
import { fadeTo, fx, lerp, r1, transformTo } from '../../shared/stageNodes'
import { TRAIL } from '../palette'
import { HeroRig, W, H, rigOf, runFrame } from './kit'

// The world map every level opens on, the overhead screen of the 16 bit platformer: one island in a blue
// sea, a beige path from his house past the levels (round yellow spots), the switch palace, the fortress
// and the castle to the goal flag, with a river the switch palace bridges. At the start of a level his
// marker walks the path from the spot he came from to this level's spot, and the spot opens round into
// the level (an iris, no dark frame). The switch palace brings the map back to fill the bridge's blocks;
// the goal crumbles the castle on the way and comes back to the whole map cleared. Drawn in its own
// 1000 by 600 box, placed over the canvas: the whole of it on a wide screen, scaled into a phone's view.

export type SpotId = 'home' | 'about' | 'bands' | 'muayThai' | 'work' | 'tech' | 'services' | 'projects' | 'ventures' | 'contact'

/** Every spot on the map box. */
export const SPOTS: Record<SpotId, readonly [number, number]> = {
  home: [120, 470],
  about: [240, 400],
  bands: [250, 250],
  muayThai: [330, 520],
  work: [380, 380],
  tech: [500, 250],
  services: [600, 330],
  projects: [720, 450],
  ventures: [840, 330],
  contact: [910, 190],
}

// The path in the order he plays it; the Musician's and the Martial Artist's spots branch off the first level.
const ROUTE: readonly SpotId[] = ['home', 'about', 'work', 'tech', 'services', 'projects', 'ventures', 'contact']
const BRANCHES: ReadonlyArray<readonly [SpotId, SpotId]> = [
  ['about', 'bands'],
  ['about', 'muayThai'],
  ['bands', 'tech'],
  ['muayThai', 'projects'],
]

// The river the switch palace's blocks bridge, between its spot and the next.
const RIVER_X = 655
const BRIDGE = [0, 1, 2, 3].map((i) => [RIVER_X - 30 + i * 20, 382 + i * 6] as const)

const ISLAND = 'M60 430 V300 H110 V190 H250 V130 H520 V160 H700 V110 H960 V260 H980 V480 H880 V560 H430 V530 H200 V500 H60 Z'

/** Where the map box sits on the canvas: its corner and scale. */
const placeOf = (phone: boolean): { x: number; y: number; k: number } => (phone ? { x: 575, y: 520, k: 0.45 } : { x: 300, y: 260, k: 1 })

const onCanvas = (phone: boolean, [x, y]: readonly [number, number]): [number, number] => {
  const { x: ox, y: oy, k } = placeOf(phone)
  return [ox + x * k, oy + y * k]
}

/** The canvas with a round hole of radius r at (cx, cy): the iris the level shows through. */
const irisPath = (cx: number, cy: number, r: number): string =>
  `M-200 -50 H${W + 200} V${H + 50} H-200 Z M${r1(cx - r)} ${r1(cy)} a${r1(r)} ${r1(r)} 0 1 0 ${r1(2 * r)} 0 a${r1(r)} ${r1(r)} 0 1 0 ${r1(-2 * r)} 0 Z`

const line = (points: ReadonlyArray<readonly [number, number]>): string => points.map(([x, y]) => `${x},${y}`).join(' ')

function Spot({ id }: { id: SpotId }) {
  const [x, y] = SPOTS[id]
  if (id === 'home')
    return (
      <g transform={`translate(${x} ${y})`}>
        <rect x={-22} y={-30} width={44} height={30} fill={TRAIL.PAGE} stroke={TRAIL.HUD} strokeWidth={4} />
        <path d="M-30 -28 L0 -54 L30 -28 Z" fill={TRAIL.ROUTE} stroke={TRAIL.HUD} strokeWidth={4} strokeLinejoin="round" />
        <rect x={-6} y={-16} width={12} height={16} fill={TRAIL.WOOD} />
      </g>
    )
  if (id === 'ventures')
    return (
      <g transform={`translate(${x} ${y})`}>
        <g data-fx="map-castle">
          {[-24, 0, 24].map((dx) => (
            <rect key={dx} x={dx - 10} y={dx === 0 ? -66 : -52} width={20} height={dx === 0 ? 66 : 52} fill={TRAIL.STONE} stroke={TRAIL.HUD} strokeWidth={4} />
          ))}
          <rect x={-6} y={-18} width={12} height={18} fill={TRAIL.HUD} />
        </g>
        <g data-fx="map-rubble" opacity={0}>
          {[-22, -6, 10, 24].map((dx, i) => (
            <rect key={dx} x={dx - 8} y={-12 - (i % 2) * 8} width={16} height={12 + (i % 2) * 8} fill={TRAIL.STONE_DARK} stroke={TRAIL.HUD} strokeWidth={3} />
          ))}
        </g>
        {/* the fortress on the way in */}
        <g transform="translate(-70 70)">
          <rect x={-16} y={-36} width={32} height={36} fill={TRAIL.FORT_GOLD} stroke={TRAIL.HUD} strokeWidth={4} />
          <path d="M-16 -36 V-44 H-8 V-36 M-4 -36 V-44 H4 V-36 M8 -36 V-44 H16 V-36" fill="none" stroke={TRAIL.HUD} strokeWidth={4} />
        </g>
      </g>
    )
  if (id === 'contact')
    return (
      <g transform={`translate(${x} ${y})`}>
        <circle r={16} fill={TRAIL.BLOCK} stroke={TRAIL.HUD} strokeWidth={4} />
        <path d="M2 -12 V-56" stroke={TRAIL.HUD} strokeWidth={4} />
        <path d="M4 -56 L30 -46 L4 -36 Z" fill={TRAIL.ROUTE} stroke={TRAIL.HUD} strokeWidth={3} />
      </g>
    )
  if (id === 'services')
    return (
      <g transform={`translate(${x} ${y})`}>
        <rect x={-18} y={-18} width={36} height={36} rx={4} fill={TRAIL.BLOCK} stroke={TRAIL.HUD} strokeWidth={4} />
        <rect x={-8} y={-6} width={16} height={6} fill={TRAIL.HUD} />
      </g>
    )
  return <circle cx={x} cy={y} r={16} fill={TRAIL.BLOCK} stroke={TRAIL.HUD} strokeWidth={4} />
}

/** The map over level `at`, its iris and his marker; `phone` scales it into a phone's view. */
export function WorldMap({ phone, profession, at }: { phone: boolean; profession: Profession; at: SpotId }) {
  const { x, y, k } = placeOf(phone)
  // one clip per stage: every stage of the theatre is in the page at once
  const clip = `ap-iris-${at}`
  const main = ROUTE.map((id) => SPOTS[id])
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={clip}>
          <path data-fx="iris" d={irisPath(0, 0, 0)} clipRule="evenodd" />
        </clipPath>
      </defs>
      <g data-fx="map" clipPath={`url(#${clip})`}>
        <rect x={-200} y={-50} width={W + 400} height={H + 100} fill={TRAIL.SEA} />
        <g transform={`translate(${x} ${y}) scale(${k})`} shapeRendering="crispEdges">
          {[...Array(12)].map((_, i) => (
            <rect key={i} x={-260 + (i % 4) * 400 + (i % 3) * 40} y={-200 + Math.floor(i / 4) * 330} width={40} height={6} fill={TRAIL.SEA_DEEP} />
          ))}
          <path d={ISLAND} transform="translate(0 22)" fill={TRAIL.CLIFF_DARK} stroke={TRAIL.HUD} strokeWidth={6} />
          <path d={ISLAND} fill={TRAIL.MEADOW} stroke={TRAIL.HUD} strokeWidth={6} />
          <rect x={RIVER_X - 14} y={160} width={28} height={420} fill={TRAIL.SEA} />
          {[
            [170, 300],
            [330, 200],
            [450, 470],
            [780, 200],
            [900, 420],
            [560, 470],
          ].map(([tx, ty]) => (
            <rect key={tx} x={tx - 16} y={ty - 40} width={32} height={40} rx={16} fill={TRAIL.MEADOW_DARK} stroke={TRAIL.HUD} strokeWidth={4} />
          ))}
          {/* the path: an outline under the sand */}
          {[main, ...BRANCHES.map(([a, b]) => [SPOTS[a], SPOTS[b]])].map((points, i) => (
            <g key={i}>
              <polyline points={line(points)} fill="none" stroke={TRAIL.HUD} strokeWidth={22} strokeLinejoin="round" />
              <polyline points={line(points)} fill="none" stroke={TRAIL.SAND} strokeWidth={14} strokeLinejoin="round" />
            </g>
          ))}
          {/* the bridge the switch palace fills: dotted outlines until then */}
          {BRIDGE.map(([bx, by], i) => (
            <g key={i} transform={`translate(${bx} ${by})`}>
              <rect x={-9} y={-9} width={18} height={18} fill="none" stroke={TRAIL.HUD} strokeWidth={2} strokeDasharray="4 3" />
              <rect data-fx={`map-block-${i}`} x={-9} y={-9} width={18} height={18} fill={TRAIL.BLOCK} stroke={TRAIL.HUD} strokeWidth={2} opacity={0} />
            </g>
          ))}
          {(Object.keys(SPOTS) as SpotId[]).map((id) => (
            <Spot key={id} id={id} />
          ))}
          <g data-fx="map-smoke" opacity={0}>
            {[0, 1, 2].map((i) => (
              <rect key={i} x={SPOTS.ventures[0] - 30 + i * 22} y={SPOTS.ventures[1] - 70 - i * 14} width={22} height={22} rx={8} fill={TRAIL.STONE_LIGHT} stroke={TRAIL.HUD} strokeWidth={3} />
            ))}
          </g>
          <g transform={`scale(${MARKER})`}>
            <HeroRig profession={profession} name="marker" />
          </g>
        </g>
      </g>
    </svg>
  )
}

// His marker on the map box, a third of his size in a level.
const MARKER = 0.3

/** What the map shows in a frame: how far he has walked from spot to spot, how far the iris has opened,
 *  and the switch palace's and the goal's extras. */
export interface MapFrame {
  walk: number
  open: number
  /** The bridge's blocks filled, 0 to 1. */
  fill?: number
  /** The castle crumbled, 0 to 1. */
  crumble?: number
  /** He cheers on his spot. */
  cheer?: boolean
}

export function mapWriter(stage: ParentNode, { phone, from, at }: { phone: boolean; from: SpotId; at: SpotId }): (frame: MapFrame) => void {
  const map = fx(stage, 'map')
  const iris = fx(stage, 'iris')
  const marker = rigOf(stage, 'marker', 'stand')
  const blocks = BRIDGE.map((_, i) => fx(stage, `map-block-${i}`))
  const castle = fx(stage, 'map-castle')
  const rubble = fx(stage, 'map-rubble')
  const smoke = fx(stage, 'map-smoke')
  const [ax, ay] = SPOTS[from]
  const [bx, by] = SPOTS[at]
  const [cx, cy] = onCanvas(phone, SPOTS[at])
  return ({ walk, open, fill = 0, crumble = 0, cheer = false }) => {
    fadeTo(map, open >= 1 ? 0 : 1)
    iris?.setAttribute('d', irisPath(cx, cy, 1900 * open ** 1.5))
    const mx = lerp(ax, bx, walk)
    const my = lerp(ay, by, walk) - 24 * Math.abs(Math.sin(walk * Math.PI * 4))
    marker(mx / MARKER, my / MARKER, cheer ? 'cheer' : walk > 0 && walk < 1 ? runFrame(walk * 400) : 'stand', bx < ax)
    blocks.forEach((block, i) => fadeTo(block, fill * BRIDGE.length > i + 0.5 ? 1 : 0))
    fadeTo(castle, crumble >= 0.5 ? 0 : 1)
    fadeTo(rubble, crumble >= 0.5 ? 1 : 0)
    fadeTo(smoke, crumble > 0 ? 1 - Math.abs(crumble - 0.5) * 2 : 0)
    transformTo(smoke, `translate(0 ${r1(-30 * crumble)})`)
  }
}
