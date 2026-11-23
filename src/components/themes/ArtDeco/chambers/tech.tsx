import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { DECO_COLORS as C } from '../palette'
import { still, stopsChamber } from '../chamber'
import { Canvas, FLOOR } from '../city'
import { Raider, foeOf } from '../foes'
import { hack } from '../pose'

// Tech stack: the glass tunnel, the sea pressing on its brass ribs. For each category a security turret
// stands by its panel with a raider coming down the tunnel beyond it; he drops to one knee at the panel and
// works its dial, the panel's gauge swings to gold, the turret turns on its post to face the raider and
// fires, and the raider goes down.

const PANEL = 120
const TURRET = 230
const FOE = 420

const RIBS = [260, 520, 800, 1080, 1340]

/** The tunnel's glass vault over the hall: its brass ribs and the sea glinting on the pane. */
function Tunnel() {
  return (
    <Canvas>
      <path d={`M60 ${FLOOR} V420 Q800 -120 1540 420 V${FLOOR}`} fill={C.tunnelSea} opacity="0.35" stroke={C.brassMid} strokeWidth="10" />
      {RIBS.map((x) => (
        <path key={x} d={`M${x} ${FLOOR} V${420 - Math.max(0, 300 - Math.abs(800 - x) * 0.55)}`} stroke={C.brassDark} strokeWidth="8" />
      ))}
      <path d="M300 300 Q520 200 700 260 M960 240 Q1150 200 1300 290" fill="none" stroke={C.waterGlow} strokeWidth="4" opacity="0.4" />
    </Canvas>
  )
}

function Panel() {
  return (
    <g transform={`translate(${PANEL} 0)`}>
      <rect x={-6} y={-120} width={12} height={120} fill={C.brassDark} />
      <rect x={-36} y={-180} width={72} height={64} fill={C.cabinetTop} stroke={C.brassMid} strokeWidth="4" />
      <circle cx={0} cy={-148} r={18} fill={C.cabinetMid} stroke={C.gold} strokeWidth="3" />
    </g>
  )
}

// The turret on its post, its barrel and lamp drawn facing right round its pivot.
function Turret() {
  return (
    <>
      <path d="M-30 0 L0 -150 L30 0" fill="none" stroke={C.brassDark} strokeWidth="8" />
      <circle cx={0} cy={-170} r={34} fill={C.bronze} stroke={C.sepia} strokeWidth="4" />
      <rect x={20} y={-180} width={60} height={20} fill={C.steelShade} stroke={C.sepia} strokeWidth="3" />
    </>
  )
}

export const tech = stopsChamber({
  light: C.waterGlow,
  set: () => <Tunnel />,
  back: (i) => (
    <>
      <Panel />
      <g data-fx={`gauge-${i}`} transform={`translate(${PANEL} 0)`} opacity="0">
        <circle cx={0} cy={-148} r={14} fill={C.goldBright} />
      </g>
      <g transform={`translate(${TURRET} 0)`}>
        <g data-fx={`turret-${i}`} transform="rotate(180 0 -170)">
          <Turret />
        </g>
      </g>
      <path data-fx={`shot-${i}`} d={`M${TURRET + 80} -170 L${FOE} -170`} stroke={C.goldBright} strokeWidth="6" opacity="0" />
      <g transform={`translate(${FOE} 0)`}>
        <Raider name={`raider-${i}`} />
      </g>
    </>
  ),
  move: (profession, t) => still(hack(profession, t)),
  reply: (stage, { count }) => {
    const gauges = Array.from({ length: count }, (_, i) => fx(stage, `gauge-${i}`))
    const turrets = Array.from({ length: count }, (_, i) => fx(stage, `turret-${i}`))
    const shots = Array.from({ length: count }, (_, i) => fx(stage, `shot-${i}`))
    const foes = Array.from({ length: count }, (_, i) => foeOf(stage, `raider-${i}`))
    return (played) =>
      foes.forEach((foe, i) => {
        const t = played(i)
        fadeTo(gauges[i], ramp(t, 0.45, 0.55))
        transformTo(turrets[i], `rotate(${(180 * (1 - ramp(t, 0.5, 0.65))).toFixed(1)} 0 -170)`)
        fadeTo(shots[i], t > 0.68 && t < 0.82 ? 1 : 0)
        foe(t, null, [0.75, 0.9])
      })
  },
})
