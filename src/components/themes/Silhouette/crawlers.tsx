import { fadeTo, fx, lerp, transformTo } from '../shared/stageNodes'
import { SHADE } from './palette'
import { outline } from './place'
import type { Point } from './spider'

// The small crawling things of the forest's last stretch, our own: the glowing worm that drops onto his head
// and walks him where it wants (research notes L66 to L68, [2] [11] [1]), the only pale thing on the page beside
// his eyes, a fat segmented grub with a soft halo; and the creatures that hang in a cluster under the overhang,
// hungry, and take the worm off him (L111 to L112, [2]): black sacs on short stalks with a fringe of thin
// jointed legs that hang, open and close.

const BEADS = 7
const BEAD = { r: 6.5, gap: 6.2 }

/** The worm, `{name}` placed by the writer, its beads `{name}-bead-<i>` wriggled along it. */
export function Worm({ name }: { name: string }) {
  return (
    <g data-fx={name} opacity="0">
      <circle r={34} fill={`url(#${name}-halo)`} />
      <defs>
        <radialGradient id={`${name}-halo`}>
          <stop offset="0" stopColor={SHADE.glow} stopOpacity="0.55" />
          <stop offset="1" stopColor={SHADE.glow} stopOpacity="0" />
        </radialGradient>
      </defs>
      <g fill={SHADE.glow}>
        {Array.from({ length: BEADS }, (_, i) => (
          <circle key={i} data-fx={`${name}-bead-${i}`} r={BEAD.r * (1 - i * 0.07)} />
        ))}
      </g>
    </g>
  )
}

/** Binds a drawn worm: the writer puts its head at `at`, its body trailing `along` (radians, 0 to the right)
 *  and waving at `wave` (a phase, rising as it wriggles), shown at `shown`. */
export function bindWorm(stage: ParentNode, name: string): (at: Point, along: number, wave: number, shown: number) => void {
  const root = fx(stage, name)
  const beads = Array.from({ length: BEADS }, (_, i) => fx(stage, `${name}-bead-${i}`))
  return (at, along, wave, shown) => {
    transformTo(root, `translate(${at.x.toFixed(1)} ${at.y.toFixed(1)}) rotate(${((along * 180) / Math.PI).toFixed(1)})`)
    fadeTo(root, shown)
    beads.forEach((bead, i) => {
      const curl = Math.sin(wave * Math.PI * 2 - i * 0.9) * (1.2 + i * 0.9)
      transformTo(bead, `translate(${(i * BEAD.gap).toFixed(1)} ${curl.toFixed(1)})`)
    })
  }
}

// One creature's legs: six, splayed round the bottom of its sac, each a thigh and a shin.
const LEGS = [-70, -42, -16, 16, 42, 70]
const SAC = { rx: 13, ry: 17 }
const LEG = { thigh: 20, shin: 24 }

/** A cluster of `count` hanging creatures along an overhang, `{name}-<i>`, each on its stalk with its legs
 *  `{name}-<i>-legs`. */
export function Hangers({ name, xs, top }: { name: string; xs: readonly number[]; top: number }) {
  return (
    <g fill={SHADE.black}>
      {xs.map((x, i) => (
        <g key={x} data-fx={`${name}-${i}`} transform={`translate(${x} ${top})`}>
          <path d={`M-2 0 L2 0 L1.4 24 L-1.4 24 Z`} />
          <ellipse cx={0} cy={24 + SAC.ry} rx={SAC.rx} ry={SAC.ry} />
          <path d={`M-6 ${22 + SAC.ry * 0.4} L-12 ${12} L-4 ${24} Z M6 ${22 + SAC.ry * 0.4} L12 ${12} L4 ${24} Z`} />
          <path data-fx={`${name}-${i}-legs`} />
        </g>
      ))}
    </g>
  )
}

const legOutline = (hip: Point, thighAngle: number, shinAngle: number): string => {
  const knee = { x: hip.x + Math.sin(thighAngle) * LEG.thigh, y: hip.y + Math.cos(thighAngle) * LEG.thigh }
  const foot = { x: knee.x + Math.sin(shinAngle) * LEG.shin, y: knee.y + Math.cos(shinAngle) * LEG.shin }
  const n = (a: number, w: number) => ({ x: Math.cos(a) * w, y: -Math.sin(a) * w })
  const a = n(thighAngle, 1.6)
  const b = n(shinAngle, 1.2)
  return `M${(hip.x + a.x).toFixed(1)} ${(hip.y + a.y).toFixed(1)} L${(knee.x + a.x).toFixed(1)} ${(knee.y + a.y).toFixed(1)} L${(knee.x + b.x).toFixed(1)} ${(knee.y + b.y).toFixed(1)} L${foot.x.toFixed(1)} ${foot.y.toFixed(1)} L${(knee.x - b.x).toFixed(1)} ${(knee.y - b.y).toFixed(1)} L${(hip.x - a.x).toFixed(1)} ${(hip.y - a.y).toFixed(1)} Z`
}

/** Binds a cluster of hanging creatures: the writer lowers each by `drop` units and opens its legs by `open`
 *  (0 hanging slack, 1 splayed wide) and closes them by `grip` (1 clutched shut under the sac), every leg
 *  stirring at `stir`. */
export function bindHangers(stage: ParentNode, name: string, xs: readonly number[], top: number): (drop: number, open: number, grip: number, stir: number) => void {
  const bodies = xs.map((_, i) => fx(stage, `${name}-${i}`))
  const legs = xs.map((_, i) => fx(stage, `${name}-${i}-legs`))
  return (drop, open, grip, stir) => {
    xs.forEach((x, i) => {
      const sway = Math.sin(stir * Math.PI * 2 + i * 1.7) * 3
      transformTo(bodies[i], `translate(${(x + sway).toFixed(1)} ${(top + drop * (0.7 + 0.3 * ((i + 1) % 2))).toFixed(1)})`)
      const hipY = 24 + SAC.ry * 1.7
      const paths = LEGS.map((spread, k) => {
        const twitch = Math.sin(stir * Math.PI * 6 + k * 2.1 + i) * 0.12
        const side = Math.sign(spread)
        const thigh = ((spread * lerp(0.5, 1.3, open) * (1 - grip * 0.6)) * Math.PI) / 180 + twitch
        const shin = thigh - side * lerp(0.2, 1.6, grip) + twitch
        return legOutline({ x: spread * 0.1, y: hipY - 4 }, thigh, shin)
      })
      outline(legs[i], paths.join(' '))
    })
  }
}
