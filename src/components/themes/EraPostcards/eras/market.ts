import { mulberry32 } from '@/lib/random/seeded'
import { MARKET } from '../palette'
import { clouds, defs, fade, fx, glow, linear, radial, rect, r1, spread, stars, svg, tf } from '../draw'
import { courier, joints, setPose, type Pose } from '../courier'
import type { Playhead } from '@/lib/scroll/player'
import { END, share, type Era } from './era'

// Services: the lantern market by night, domed rooftops under the moon, which rises with the scroll. He
// hangs from a rope over the roofs and plays two actions: he swings out in one long arc over the street,
// then, as the swing settles, the lanterns on the string light one after another from left to right.

const domes = (seed: number, base: number, fill: string, lit: string, scale: number): string => {
  const random = mulberry32(seed)
  const parts: string[] = []
  let x = -200
  while (x < 1800) {
    const w = (80 + random() * 120) * scale
    const h = (80 + random() * 160) * scale
    parts.push(`<rect x="${r1(x)}" y="${r1(base - h)}" width="${r1(w)}" height="${r1(h + 300)}" fill="${fill}"/>`)
    if (random() < 0.45) parts.push(`<path d="M${r1(x + w * 0.15)},${r1(base - h)} a${r1(w * 0.35)},${r1(w * 0.42)} 0 0 1 ${r1(w * 0.7)},0 Z" fill="${fill}"/><rect x="${r1(x + w / 2 - 1.5)}" y="${r1(base - h - w * 0.55)}" width="3" height="${r1(w * 0.2)}" fill="${fill}"/>`)
    if (random() < 0.18) parts.push(`<rect x="${r1(x + w * 0.7)}" y="${r1(base - h - 160 * scale)}" width="${r1(16 * scale)}" height="${r1(170 * scale)}" fill="${fill}"/><path d="M${r1(x + w * 0.7 - 6)},${r1(base - h - 160 * scale)} l${r1(14 * scale)},${r1(-30 * scale)} l${r1(14 * scale)},${r1(30 * scale)} Z" fill="${fill}"/>`)
    for (let k = 0; k < 3; k++) if (random() < 0.6) parts.push(`<path d="M${r1(x + 12 + k * 26 * scale)},${r1(base - h + 30 * scale)} v-${r1(12 * scale)} a5,5 0 0 1 10,0 v${r1(12 * scale)} Z" fill="${lit}" opacity="${r1(0.5 + random() * 0.5)}"/>`)
    x += w
  }
  return parts.join('')
}

const lanternsAt = (count: number): number[] => spread(count, 470, 1130)

const sag = (x: number): number => 300 + 90 * Math.sin(((x - 470) / 660) * Math.PI)

// The swing: one long arc out over the first action, then it dies down over the second.
const swingPhase = (play: Playhead): number => share(play, 0) * 1.5 + share(play, 1) * 1
const swingAngle = (play: Playhead): number => Math.sin(swingPhase(play) * Math.PI) * 34 * (1 - 0.7 * share(play, 1))

/** How lit lantern i of `count` is: they light left to right over the second action. */
const litOf = (play: Playhead, i: number, count: number): number => Math.min(1, Math.max(0, share(play, 1) * (count + 1) - i))

// Where the swing hangs across the canvas, him on it.
const SWING_X = 820

const swingPose = (play: Playhead): Partial<Pose> => {
  const angle = swingAngle(play)
  const kick = Math.cos(swingPhase(play) * Math.PI)
  return { x: SWING_X, y: 560, scale: 1.2, shF: 172, shB: 168, elF: 4, elB: 6, hipF: 20 + kick * 25, hipB: -10 - kick * 20, kneeF: -30, kneeB: -50, lean: -angle * 0.3, head: -10, scarf: -angle * 0.8 }
}

export const market: Era = {
  place: SWING_X,
  script: [2000, 2000],
  build: ({ count }) => {
    const xs = lanternsAt(count)
    const lanterns = xs
      .map(
        (x, i) => `<g transform="translate(${r1(x)} ${r1(sag(x))})">
    <g data-fx="lglow-${i}">${defs(radial(`sv-g-${i}`, [[0, MARKET.lanternGlow, 0.9], [1, MARKET.lanternGlowEdge, 0]]))}<circle cy="30" r="70" fill="url(#sv-g-${i})"/></g>
    <path d="M0,0 v10" stroke="${MARKET.string}" stroke-width="2"/><path d="M-12,14 h24 l-4,34 h-16 Z" fill="${MARKET.lantern}" stroke="${MARKET.trim}" stroke-width="2"/>
    <path data-fx="lcore-${i}" d="M-8,18 h16 l-3,26 h-10 Z" fill="${MARKET.lanternCore}"/></g>`,
      )
      .join('')
    const first = xs[0]
    const last = xs[xs.length - 1]
    const string = `<path d="M${xs.map((x) => `${r1(x)},${r1(sag(x))}`).join(' L')}" stroke="${MARKET.string}" stroke-width="2" fill="none"/>
      <path d="M330,250 L${r1(first)},${r1(sag(first))} M${r1(last)},${r1(sag(last))} L1290,240" stroke="${MARKET.string}" stroke-width="2"/>`
    return {
      sky: svg(`${defs(linear('sv-sky', [[0, MARKET.skyTop], [0.6, MARKET.skyMid], [1, MARKET.skyLow]]))}${rect('url(#sv-sky)')}${stars(51, 200, 600, MARKET.star)}
        ${glow('sv-moon-g', 1150, 250, 300, MARKET.moonGlow, 0.45)}<g data-fx="moon" transform="translate(0 60)"><circle cx="1150" cy="250" r="118" fill="${MARKET.moon}"/><circle cx="1110" cy="220" r="20" fill="${MARKET.crater}"/><circle cx="1190" cy="290" r="28" fill="${MARKET.crater}"/><circle cx="1170" cy="200" r="10" fill="${MARKET.crater}"/></g>
        ${clouds(52, 5, [330, 480], MARKET.cloud, 0.35)}`),
      far: svg(domes(53, 700, MARKET.roofFar, MARKET.roofFarLit, 0.8)),
      mid: svg(domes(54, 800, MARKET.roofNear, MARKET.roofNearLit, 1.15)),
      near: svg(`<path d="M-200,1000 L-200,860 L520,860 L520,900 L1100,900 L1100,850 L1800,850 L1800,1000 Z" fill="${MARKET.street}"/>
        <path d="M-200,860 L520,860 M1100,850 L1800,850" stroke="${MARKET.trim}" stroke-width="3"/>
        <g fill="${MARKET.urn}"><rect x="180" y="800" width="40" height="60" rx="8"/><path d="M170,800 q30,-50 60,0 Z" fill="${MARKET.urnLeaf}"/><rect x="1300" y="790" width="36" height="60" rx="8"/><path d="M1290,790 q28,-44 56,0 Z" fill="${MARKET.urnLeaf}"/></g>`),
      figure: svg(`${string}${lanterns}<g data-fx="swing" transform="rotate(${r1(swingAngle(END))} 820 110)"><path d="M820,110 L820,330" stroke="${MARKET.rope}" stroke-width="4"/>${courier(swingPose(END))}</g>`),
      fg: svg(`<g data-fx="lamp"><path d="M200,-20 v110" stroke="${MARKET.lampPost}" stroke-width="4"/><path d="M160,90 h80 l-14,110 h-52 Z" fill="${MARKET.lamp}" stroke="${MARKET.lampEdge}" stroke-width="4"/><path d="M178,104 h44 l-10,82 h-24 Z" fill="${MARKET.lampLight}"/>${glow('sv-lamp', 200, 150, 160, MARKET.lampGlow, 0.6)}</g>
        <path d="M1250,-20 L1800,-20 L1800,140 Q1700,170 1640,120 Q1580,170 1520,120 Q1460,170 1400,120 Q1340,170 1280,120 Z" fill="${MARKET.awning}"/><path d="M1250,110 Q1340,160 1400,110 Q1460,160 1520,110 Q1580,160 1640,110 Q1700,160 1800,120" stroke="${MARKET.awningEdge}" stroke-width="4" fill="none"/>`),
    }
  },
  bind: (stage, { count }) => {
    const j = joints(stage)
    const lamps = Array.from({ length: count }, (_, i) => [fx(stage, `lglow-${i}`), fx(stage, `lcore-${i}`)] as const)
    const [swing, moon, lamp] = ['swing', 'moon', 'lamp'].map((name) => fx(stage, name))
    return (p, play) => {
      tf(swing, `rotate(${r1(swingAngle(play))} 820 110)`)
      tf(moon, `translate(0 ${r1(60 - p * 90)})`)
      tf(lamp, `rotate(${r1(Math.sin(p * 7) * 6)} 200 -20)`)
      lamps.forEach(([glowNode, core], i) => {
        const lit = litOf(play, i, count)
        fade(glowNode, lit)
        fade(core, 0.1 + lit * 0.9)
      })
      setPose(j, swingPose(play))
    }
  },
}
