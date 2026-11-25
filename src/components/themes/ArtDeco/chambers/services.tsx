import { ramp } from '@/lib/scroll/stage'
import { mix } from '@/lib/motion/rigPose'
import { bell, fadeTo, fx, fxAll, lerp, transformTo } from '../../shared/stageNodes'
import { DECO_COLORS as C } from '../palette'
import { fightChamber, share } from '../chamber'
import { pay, rest, rewire, stride } from '../pose'

// Services: the machines. The gallery of the city's machines, three deco cabinets in a row with a service
// each, and a turret on the ceiling that has him in its sights. He feeds a coin to the first machine and
// its lights run up its face, and the next two light after it; then he kneels at the turret's wall box and
// rewires it, and it swings off him to cover the gallery. The end frame is the turret on guard over him and
// the machines lit in a row.

const MACHINES = [
  { x: 120, light: C.goldBright },
  { x: 250, light: C.waterGlow },
  { x: 380, light: C.neonPink },
]
const ROWS = 6
const TURRET = { x: 300, y: -690 }
const BOX = { x: 540, y: -110 }
// He kneels at the box from here.
const AT_BOX = 440

// Each machine's glyph on its crown: a cog, a key, a lamp.
const GLYPHS = [
  <circle key="cog" cx={0} cy={0} r={10} fill="none" strokeWidth="5" strokeDasharray="5 3" />,
  <path key="key" d="M-10 0 H8 M2 0 V6 M8 0 V6 M-14 0 A5 5 0 1 0 -14 0.1" fill="none" strokeWidth="4" />,
  <path key="lamp" d="M-6 8 H6 M-4 4 Q-10 -10 0 -12 Q10 -10 4 4 Z" fill="none" strokeWidth="4" />,
]

/** A machine at its feet: a stepped deco cabinet, its glyph, the coin slot and the face of lit rows in
 *  `data-fx="m{i}-row-{r}"`. */
function Machine({ index, light }: { index: number; light: string }) {
  return (
    <g>
      <path d="M-56 0 V-270 H-44 V-290 H-26 V-306 H26 V-290 H44 V-270 H56 V0 Z" fill={C.cabinetTop} stroke={C.brassMid} strokeWidth="4" />
      <g transform="translate(0 -288)" stroke={light}>
        {GLYPHS[index]}
      </g>
      <rect x={-40} y={-250} width={80} height={150} fill={C.machineGlassDeep} stroke={C.gold} strokeWidth="3" />
      <rect x={-54} y={-216} width={14} height={34} fill={C.brassMid} stroke={C.sepia} strokeWidth="2" />
      <path d="M-47 -210 V-188" stroke={C.abyss} strokeWidth="3" />
      {Array.from({ length: ROWS }, (_, row) => (
        <rect key={row} data-fx={`m${index}-row-${row}`} x={-32} y={-120 - row * 22} width={64} height={14} fill={light} opacity="0.12" />
      ))}
      <rect x={-40} y={-90} width={80} height={60} fill={C.cabinetMid} stroke={C.brassDark} strokeWidth="2" />
      <rect x={-30} y={-46} width={44} height={12} fill={C.abyss} />
    </g>
  )
}

/** The ceiling turret on its mount, its barrel group in `data-fx="gun"` turning on the mount's pivot, its
 *  sight lamp in `data-fx="sight"`. */
function Turret() {
  return (
    <g>
      <path d="M-70 -200 H70 V-180 H-70 Z" fill={C.brassDark} />
      <path d="M0 -180 V-40" stroke={C.brassDark} strokeWidth="18" />
      <g data-fx="gun">
        <path d="M-50 -40 Q-60 30 0 46 Q60 30 50 -40 Z" fill={C.brassMid} stroke={C.sepia} strokeWidth="4" />
        <path d="M-40 -10 H40" stroke={C.brassDark} strokeWidth="4" />
        <rect x={-120} y={4} width={90} height={16} rx={6} fill={C.steelShade} stroke={C.sepia} strokeWidth="3" />
        <rect x={-130} y={0} width={18} height={24} rx={4} fill={C.steel} />
        <circle data-fx="sight" cx={-20} cy={-14} r={9} fill={C.spark} />
      </g>
      <circle cx={0} cy={0} r={14} fill={C.gold} />
    </g>
  )
}

/** The turret's wall box: open, its wires and its lamp, red until rewired, then green in `data-fx="friend"`. */
function WallBox() {
  return (
    <g>
      <rect x={-40} y={-60} width={80} height={90} rx={6} fill={C.cabinetTop} stroke={C.brassMid} strokeWidth="4" />
      <path d="M-26 -40 Q0 -10 -20 14 M-6 -44 Q20 -12 8 18 M14 -40 Q-10 0 22 16" fill="none" stroke={C.copper} strokeWidth="4" />
      <circle cx={0} cy={-76} r={10} fill={C.spark} />
      <circle data-fx="friend" cx={0} cy={-76} r={10} fill={C.allClear} opacity="0" />
    </g>
  )
}

export const services = fightChamber({
  travel: AT_BOX,
  // he crosses to the wall box at the far end, so left of the cards he starts further left
  places: { left: 210 },
  light: C.goldBright,
  script: [1700, 2300],
  back: () => (
    <>
      {MACHINES.map(({ x, light }, i) => (
        <g key={x} transform={`translate(${x} 0)`}>
          <Machine index={i} light={light} />
        </g>
      ))}
      <path d={`M${BOX.x} ${BOX.y - 60} V${TURRET.y - 200} H${TURRET.x + 70}`} fill="none" stroke={C.brassDark} strokeWidth="6" />
      <g transform={`translate(${TURRET.x} ${TURRET.y})`}>
        <Turret />
      </g>
      <g transform={`translate(${BOX.x} ${BOX.y})`}>
        <WallBox />
      </g>
      <g data-fx="sightline" opacity="0">
        <path d={`M${TURRET.x - 130} ${TURRET.y + 12} L40 -180`} stroke={C.spark} strokeWidth="2" strokeDasharray="10 8" />
      </g>
    </>
  ),
  bind: (stage, { profession }) => {
    const rows = MACHINES.map((_, i) => fxAll(stage, `m${i}-row-`))
    const gun = fx(stage, 'gun')
    const sight = fx(stage, 'sight')
    const friend = fx(stage, 'friend')
    const sightline = fx(stage, 'sightline')
    return (play) => {
      const paid = share(play, 0)
      const wired = share(play, 1)
      // the lights run up the first machine's face, then the next two light in turn
      rows.forEach((machine, i) => {
        const from = i === 0 ? 0.4 : 0.6 + i * 0.12
        machine.forEach((row, r) => fadeTo(row, 0.12 + 0.88 * ramp(paid, from + (r / ROWS) * 0.15, from + ((r + 1) / ROWS) * 0.15 + 0.02)))
      })
      // the turret has him in its sights until the box is rewired, then swings off him to watch the gallery
      const turned = ramp(wired, 0.65, 0.95)
      transformTo(gun, `rotate(${lerp(-28, 160, turned).toFixed(1)})`)
      fadeTo(sight, 1 - ramp(wired, 0.6, 0.7))
      fadeTo(friend, ramp(wired, 0.6, 0.7))
      fadeTo(sightline, 0.7 * (1 - turned))
      if (wired > 0) {
        const walked = ramp(wired, 0, 0.3)
        const going = mix(pay(profession, 1), stride(profession, walked * 4), ramp(walked, 0, 0.2))
        const pose = walked < 1 ? mix(going, rest(profession), ramp(walked, 0.8, 1)) : rewire(profession, ramp(wired, 0.3, 0.95))
        return { pose: { ...pose, sparks: pose.sparks + 0.6 * bell(wired, 0.55, 0.7) }, ahead: AT_BOX * walked, lift: 0 }
      }
      return { pose: pay(profession, paid), ahead: 0, lift: 0 }
    }
  },
})
