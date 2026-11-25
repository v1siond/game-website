import { ramp } from '@/lib/scroll/stage'
import { mix } from '@/lib/motion/rigPose'
import { bell, fadeTo, fx, fxAll, lerp, transformTo } from '../../shared/stageNodes'
import { DECO_COLORS as C } from '../palette'
import { fightChamber, share } from '../chamber'
import { Canvas, FLOOR, W } from '../city'
import { Tenant } from '../cast'
import { rest, route, shock, strapOn, stride } from '../pose'

// Tech Stack: two hands. The clinic's tiled corridor, ankle deep in sea water. He takes the spark coil off a
// dead machine and straps it over his forearm; a tenant splashes in at a run, and he sends a spark into the
// water it stands in, and it drops; then he turns the door panel's pipe tiles until the flow runs through
// them and lights, and the door opens.

const MACHINE = 96
const FOE = { from: 640, to: 290 }
const PANEL = { x: 150, y: -290, tile: 34 }
const DOOR = { x: 500, width: 120, height: 270 }
const WATER = -18

/** The clinic's walls: pale green tiles to shoulder height, a dark band, and the dim lamps in a row. */
function Tiles() {
  return (
    <Canvas>
      <rect x={-200} width={W + 400} height={1000} fill={C.pumpWall} />
      <rect x={-200} y={420} width={W + 400} height={460} fill={C.tileShade} />
      {Array.from({ length: 12 }, (_, row) => 420 + row * 40).map((y) => (
        <path key={y} d={`M-200 ${y} H1800`} stroke={C.tile} strokeWidth="2" opacity="0.5" />
      ))}
      {Array.from({ length: 46 }, (_, i) => -200 + i * 40).map((x) => (
        <path key={x} d={`M${x} 420 V880`} stroke={C.tile} strokeWidth="2" opacity="0.35" />
      ))}
      <rect x={-200} y={396} width={W + 400} height={24} fill={C.cabinetMid} />
      {[260, 760, 1260].map((x) => (
        <g key={x}>
          <path d={`M${x} 0 V120`} stroke={C.brassDark} strokeWidth="4" />
          <path d={`M${x - 40} 120 L${x} 100 L${x + 40} 120 Z`} fill={C.brassMid} />
          <ellipse cx={x} cy={124} rx={30} ry={8} fill={C.lamp} opacity="0.6" />
          <path d={`M${x - 30} 128 L${x - 160} 880 H${x + 160} L${x + 30} 128 Z`} fill={C.lamp} opacity="0.05" />
        </g>
      ))}
      <path d="M-200 300 H1800" stroke={C.brassLine} strokeWidth="14" />
    </Canvas>
  )
}

/** The tiled floor under its sheet of water. */
function WetFloor() {
  return (
    <Canvas>
      <rect x={-200} y={FLOOR} width={W + 400} height={120} fill={C.tileShade} />
      {Array.from({ length: 30 }, (_, i) => -200 + i * 70).map((x) => (
        <path key={x} d={`M${x} ${FLOOR} L${x - 40} 1000`} stroke={C.tile} strokeWidth="2" opacity="0.4" />
      ))}
      <rect x={-200} y={FLOOR + WATER} width={W + 400} height={1000} fill={C.seaMid} opacity="0.5" />
    </Canvas>
  )
}

/** The dead machine he takes the coil from: a cracked deco cabinet, its glass dark, the coil on its bracket
 *  in `data-fx="spare"`. */
function DeadMachine() {
  return (
    <g>
      <path d="M-40 0 V-210 H-30 V-226 H30 V-210 H40 V0 Z" fill={C.cabinetTop} stroke={C.brassDark} strokeWidth="4" />
      <rect x={-28} y={-196} width={56} height={80} fill={C.abyss} stroke={C.brassDark} strokeWidth="3" />
      <path d="M-20 -180 L4 -150 L-8 -136 M10 -190 L-2 -160" stroke={C.mist} strokeWidth="2" opacity="0.5" />
      <rect x={-30} y={-100} width={60} height={24} fill={C.cabinetMid} stroke={C.brassDark} strokeWidth="2" />
      <g data-fx="spare">
        <rect x={-14} y={-104} width={28} height={20} rx={4} fill={C.copper} stroke={C.sepia} strokeWidth="2" />
        <path d="M-10 -100 V-88 M-4 -100 V-88 M2 -100 V-88 M8 -100 V-88" stroke={C.copperDark} strokeWidth="2" />
      </g>
    </g>
  )
}

// The panel's tiles: each a bend or a straight, turned this many quarters out of line at the start.
const TILES = [
  { col: 0, row: 0, d: 'M0 17 H17 V34', off: 1 },
  { col: 1, row: 0, d: 'M0 17 H34', off: 1 },
  { col: 2, row: 0, d: 'M0 17 H17 V34', off: 2 },
  { col: 0, row: 1, d: 'M17 0 V34', off: 0 },
  { col: 1, row: 1, d: 'M0 17 H34', off: 0 },
  { col: 2, row: 1, d: 'M17 0 V17 H34', off: 3 },
]

/** The door panel: a brass plate of pipe tiles in a grid, each in `data-fx="tile-i"`, the flow lit in
 *  `data-fx="flow"` once they line up. */
function Panel() {
  const { tile } = PANEL
  return (
    <g>
      <rect x={-14} y={-14} width={tile * 3 + 28} height={tile * 2 + 28} rx={6} fill={C.cabinetTop} stroke={C.brassMid} strokeWidth="4" />
      {TILES.map(({ col, row, d }, i) => (
        <g key={i} transform={`translate(${col * tile} ${row * tile})`}>
          <rect width={tile} height={tile} fill={C.abyss} stroke={C.brassDark} strokeWidth="2" />
          <g data-fx={`tile-${i}`}>
            <path d={d} fill="none" stroke={C.steel} strokeWidth="8" />
          </g>
        </g>
      ))}
      <g data-fx="flow" opacity="0">
        <rect x={-14} y={-14} width={tile * 3 + 28} height={tile * 2 + 28} rx={6} fill={C.bolt} opacity="0.25" />
      </g>
      <path d={`M${tile * 3 + 14} ${tile} H${DOOR.x - PANEL.x - DOOR.width / 2}`} stroke={C.brassDark} strokeWidth="6" />
    </g>
  )
}

/** The door at the corridor's end: two leaves in `data-fx="leaf-top"` and `data-fx="leaf-foot"` that part. */
function Door() {
  const { width, height } = DOOR
  return (
    <g>
      <rect x={-width / 2 - 14} y={-height - 14} width={width + 28} height={height + 14} fill={C.brassDark} stroke={C.gold} strokeWidth="4" />
      <rect x={-width / 2} y={-height} width={width} height={height} fill={C.lamp} opacity="0.6" />
      <g data-fx="leaf-top">
        <rect x={-width / 2} y={-height} width={width} height={height / 2} fill={C.steelShade} stroke={C.sepia} strokeWidth="3" />
        <path d={`M${-width / 2} ${-height / 2 - 10} H${width / 2}`} stroke={C.gold} strokeWidth="4" />
      </g>
      <g data-fx="leaf-foot">
        <rect x={-width / 2} y={-height / 2} width={width} height={height / 2} fill={C.steelShade} stroke={C.sepia} strokeWidth="3" />
      </g>
    </g>
  )
}

/** The spark running along the water from his hand to the tenant's feet. */
function WaterSpark() {
  const points = Array.from({ length: 9 }, (_, k) => `${(80 + ((FOE.to - 80) * k) / 8).toFixed(0)},${(WATER + (k % 2 ? -14 : 6)).toFixed(0)}`).join(' ')
  return (
    <g data-fx="water-spark" opacity="0" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <polyline points={points} stroke={C.bolt} strokeWidth="9" />
      <polyline points={points} stroke={C.boltCore} strokeWidth="3" />
      <ellipse cx={FOE.to} cy={WATER} rx={90} ry={14} fill={C.bolt} opacity="0.3" />
    </g>
  )
}

// He steps up to the panel for the last action.
const AT_PANEL = 60

export const tech = fightChamber({
  light: C.tile,
  script: [1300, 1600, 1800],
  room: { sky: () => <Tiles />, far: null, mid: null, near: () => <WetFloor />, fg: null },
  back: () => (
    <>
      <g transform={`translate(${DOOR.x} 0)`}>
        <Door />
      </g>
      <g transform={`translate(${PANEL.x} ${PANEL.y})`}>
        <Panel />
      </g>
      <g transform={`translate(${MACHINE} 0)`}>
        <DeadMachine />
      </g>
      <g data-fx="runner" transform={`translate(${FOE.from} 0)`}>
        <Tenant name="tenant" />
      </g>
    </>
  ),
  front: () => (
    <>
      <rect x={-1400} y={WATER} width={2800} height={300} fill={C.seaMid} opacity="0.45" />
      <g data-fx="splash" opacity="0">
        <path d="M-50 -18 L-70 -60 M-20 -20 L-24 -70 M20 -20 L34 -64 M50 -18 L78 -50" stroke={C.ivory} strokeWidth="4" strokeLinecap="round" />
      </g>
      <WaterSpark />
    </>
  ),
  bind: (stage, { profession }) => {
    const spare = fx(stage, 'spare')
    const runner = fx(stage, 'runner')
    const tenant = fx(stage, 'tenant')
    const splash = fx(stage, 'splash')
    const spark = fx(stage, 'water-spark')
    const flow = fx(stage, 'flow')
    const top = fx(stage, 'leaf-top')
    const foot = fx(stage, 'leaf-foot')
    const tiles = fxAll(stage, 'tile-')
    const half = PANEL.tile / 2
    return (play) => {
      const strapped = share(play, 0)
      const shocked = share(play, 1)
      const routed = share(play, 2)
      fadeTo(spare, 1 - ramp(strapped, 0.3, 0.4))
      // the tenant runs in splashing, stiffens in the spark, and drops backward into the water
      const ran = ramp(shocked, 0, 0.45)
      const x = lerp(FOE.from, FOE.to, ran)
      transformTo(runner, `translate(${x.toFixed(1)} ${(-6 * Math.abs(Math.sin(ran * 12)) * (1 - ran)).toFixed(1)})`)
      const jolt = bell(shocked, 0.45, 0.75)
      const down = ramp(shocked, 0.7, 0.95)
      transformTo(tenant, `translate(${(5 * jolt * Math.sin(shocked * 160)).toFixed(1)} 0) rotate(${(8 * jolt + 80 * down).toFixed(1)})`)
      fadeTo(splash, Math.max(bell(ran, 0.2, 1), bell(down, 0.6, 1)))
      transformTo(splash, `translate(${x.toFixed(1)} 0)`)
      fadeTo(spark, jolt)
      // each tile turns home in its turn, then the flow lights and the leaves part
      tiles.forEach((tile, i) => {
        const turned = ramp(routed, 0.15 + i * 0.08, 0.25 + i * 0.08)
        transformTo(tile, `rotate(${(90 * TILES[i].off * (1 - turned)).toFixed(1)} ${half} ${half})`)
      })
      const open = ramp(routed, 0.75, 1)
      fadeTo(flow, ramp(routed, 0.68, 0.78))
      // the top leaf folds up into the lintel, the foot leaf down into the sill
      const left = (1 - 0.9 * open).toFixed(3)
      transformTo(top, `translate(0 ${-DOOR.height}) scale(1 ${left}) translate(0 ${DOOR.height})`)
      transformTo(foot, `scale(1 ${left})`)
      if (routed > 0) {
        const step = ramp(routed, 0, 0.15)
        const walking = mix(shock(profession, 1), stride(profession, step * 2), ramp(step, 0, 0.3))
        const pose = step < 1 ? walking : route(profession, ramp(routed, 0.12, 0.9))
        const settled = mix(pose, { ...rest(profession), coil: 1, sparks: 0.4 }, ramp(routed, 0.9, 1))
        return { pose: settled, ahead: AT_PANEL * step, lift: 0 }
      }
      if (shocked > 0) return { pose: shock(profession, ramp(shocked, 0.3, 1)), ahead: 0, lift: 0 }
      return { pose: strapOn(profession, strapped), ahead: 0, lift: 0 }
    }
  },
})
