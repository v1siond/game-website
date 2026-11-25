import type { Playhead } from '@/lib/scroll/player'
import { gait } from '@/lib/motion/gait'
import { WALL } from '../palette'
import { defs, fade, fx, glow, lerp, linear, rect, ridge, r1, svg, tf } from '../draw'
import { courier, joints, setPose, type Pose } from '../courier'
import { END, share, type Era } from './era'

// Projects: the long wall at sunset, petals drifting with the scroll. He stands on the near walkway with a
// dragon kite and plays two actions: he takes two steps along the walkway and throws the kite up into the
// wind, then it climbs high over the far towers into the sunset, its tail streaming, while he holds the
// line with both hands and watches it go.

// He walks from FROM to AT along the walkway, right of the cards' column at 1440.
const FROM = 900
const AT = { x: 1000, y: 905, scale: 1.2 } as const

const THROW: Partial<Pose> = { ...AT, shF: 170, elF: 10, shB: 20, elB: 30, head: -14, lean: -4 }
const HOLD: Partial<Pose> = { ...AT, shF: 120, elF: 30, shB: 100, elB: 40, head: -20, lean: -8, scarf: 18 }

const KEYS = ['x', 'shF', 'elF', 'shB', 'elB', 'head', 'lean', 'scarf', 'hipF', 'hipB', 'kneeF', 'kneeB'] as const

const blend = (from: Partial<Pose>, to: Partial<Pose>, t: number): Partial<Pose> => ({
  ...AT,
  ...Object.fromEntries(KEYS.map((key) => [key, lerp(from[key] ?? 0, to[key] ?? 0, t)])),
})

// The steps and the throw over the first action, then the line held over the second.
function flyPose(play: Playhead): Partial<Pose> {
  if (play.action > 0) return blend(THROW, HOLD, share(play, 1))
  const walked = Math.min(1, play.t / 0.6)
  if (play.t < 0.6) return { ...AT, ...gait(walked * 2), x: lerp(FROM, AT.x, walked), shF: 60, elF: 20 }
  return blend({ ...AT, shF: 60, elF: 20 }, THROW, (play.t - 0.6) / 0.4)
}

/** His front hand on the canvas in `pose`: the shoulder, the upper arm and the forearm turned (courier.ts). */
function handOf(pose: Partial<Pose>): readonly [number, number] {
  const a = ((pose.shF ?? 0) * Math.PI) / 180
  const b = (((pose.shF ?? 0) + (pose.elF ?? 0)) * Math.PI) / 180
  const scale = pose.scale ?? 1
  return [(pose.x ?? 0) + (6 + 30 * Math.sin(a) + 31 * Math.sin(b)) * scale, (pose.y ?? 0) + (-138 + 30 * Math.cos(a) + 31 * Math.cos(b)) * scale]
}

// Where the kite flies: in his hand, then thrown up over the walkway, then high over the far towers.
const kiteAt = (play: Playhead, hand: readonly [number, number]): readonly [number, number, number] => {
  const thrown = play.action === 0 ? Math.max(0, (play.t - 0.6) / 0.4) : 1
  const climbed = share(play, 1)
  const low = [lerp(hand[0], 1150, thrown), lerp(hand[1], 640, thrown)] as const
  return [lerp(low[0], 1130, climbed), lerp(low[1], 250, climbed), lerp(0.5, 1, thrown) * lerp(1, 0.8, climbed)]
}

// The dragon kite: a red diamond with gold edges and eyes, its tail of bows hanging from it.
const KITE = `<path d="M0,-46 L32,0 L0,40 L-32,0 Z" fill="${WALL.kite}" stroke="${WALL.kiteEdge}" stroke-width="4"/>
  <path d="M0,-46 V40 M-32,0 H32" stroke="${WALL.kiteEdge}" stroke-width="2"/><circle cx="-10" cy="-12" r="4" fill="${WALL.kiteEdge}"/><circle cx="10" cy="-12" r="4" fill="${WALL.kiteEdge}"/>
  <g data-fx="tail">${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${-8 + (i % 2) * 6},${52 + i * 24} l8,-6 l8,6 l-8,6 Z" fill="${i % 2 ? WALL.kiteEdge : WALL.kite}"/>`).join('')}
  <path d="M0,40 q-10,40 4,80 q10,30 -4,70" stroke="${WALL.kiteEdge}" stroke-width="2" fill="none"/></g>`

const kiteTransform = ([x, y, scale]: readonly [number, number, number], sway: number): string => `translate(${r1(x)} ${r1(y)}) rotate(${r1(sway)}) scale(${r1(scale)})`

const lineTo = (hand: readonly [number, number], kite: readonly [number, number, number]): string =>
  `M${r1(hand[0])},${r1(hand[1])} Q${r1((hand[0] + kite[0]) / 2 + 40)},${r1((hand[1] + kite[1]) / 2 + 60)} ${r1(kite[0])},${r1(kite[1] + 40 * kite[2])}`

const END_POSE = flyPose(END)
const END_HAND = handOf(END_POSE)
const END_KITE = kiteAt(END, END_HAND)

export const wall: Era = {
  place: AT.x,
  script: [2000, 2400],
  build: () => {
    const towers = [300, 700, 1100, 1500]
    const tops = [640, 610, 650, 590]
    return {
      sky: svg(`${defs(linear('pj-sky', [[0, WALL.skyTop], [0.4, WALL.skyMid], [0.7, WALL.skyLow], [1, WALL.skyHorizon]]))}${rect('url(#pj-sky)')}
        ${glow('pj-sun-g', 560, 520, 320, WALL.sunGlow, 0.75)}<circle cx="560" cy="520" r="104" fill="${WALL.sun}"/>
        ${Array.from({ length: 6 }, (_, i) => `<rect x="${-100 + i * 300}" y="${300 + i * 34}" width="${500 + i * 40}" height="${6 + (i % 3) * 3}" rx="4" fill="${WALL.streak}" opacity="0.5"/>`).join('')}`),
      far: svg(`${ridge(61, { y: 560, amp: 90, fill: WALL.ridgeFar, sharp: 30, step: 24, opacity: 0.55 })}${ridge(62, { y: 640, amp: 80, fill: WALL.ridgeMid, sharp: 24, step: 22 })}`),
      mid: svg(`${ridge(63, { y: 720, amp: 60, fill: WALL.ridgeNear, sharp: 10 })}
        <path d="M-200,700 Q100,640 300,690 T700,660 T1100,700 T1500,640 T1900,680" stroke="${WALL.wall}" stroke-width="22" fill="none"/>
        <path d="M-200,686 Q100,626 300,676 T700,646 T1100,686 T1500,626 T1900,666" stroke="${WALL.wall}" stroke-width="10" stroke-dasharray="10 8" fill="none"/>
        ${towers.map((x, i) => `<rect x="${x - 20}" y="${tops[i]}" width="40" height="60" fill="${WALL.wall}"/><path d="M${x - 28},${tops[i]} l28,-22 l28,22 Z" fill="${WALL.wall}"/>`).join('')}
        <g fill="${WALL.pagoda}" transform="translate(1340 640)"><rect x="-30" y="-90" width="60" height="90"/><path d="M-70,-90 q70,-24 140,0 l-20,-16 h-100 Z"/><rect x="-22" y="-150" width="44" height="50"/><path d="M-56,-150 q56,-20 112,0 l-18,-14 h-76 Z"/><path d="M-36,-196 q36,-14 72,0 l-14,-12 h-44 Z"/><rect x="-14" y="-190" width="28" height="30"/></g>`),
      near: svg(`${defs(linear('pj-wall', [[0, WALL.walkTop], [1, WALL.walkBottom]]))}<path d="M-200,1000 L-200,880 L1800,880 L1800,1000 Z" fill="url(#pj-wall)"/>
        ${Array.from({ length: 22 }, (_, i) => `<rect x="${-200 + i * 96}" y="812" width="56" height="70" fill="${WALL.merlon}"/><rect x="${-200 + i * 96}" y="812" width="56" height="5" fill="${WALL.merlonLit}" opacity="0.5"/>`).join('')}
        <path d="M-200,880 L1800,880" stroke="${WALL.walkEdge}" stroke-width="3" opacity="0.7"/>`),
      // The end frame: the kite high over the towers, him holding its line.
      figure: svg(`<path data-fx="line" d="${lineTo(END_HAND, END_KITE)}" stroke="${WALL.line}" stroke-width="2" fill="none" opacity="0.8"/>
        <g data-fx="kite" transform="${kiteTransform(END_KITE, 0)}">${KITE}</g>${courier(END_POSE)}`),
      fg: svg(`<g fill="${WALL.branch}"><path d="M1800,-20 L1180,-20 Q1300,60 1460,70 Q1560,120 1800,110 Z"/>${[1260, 1380, 1500, 1620].map((x) => `<path d="M${x},40 q-30,40 -70,46 q40,10 80,-30 Z"/>`).join('')}</g>
        <g data-fx="petals" fill="${WALL.petal}">${Array.from({ length: 24 }, (_, i) => `<ellipse cx="${(i * 173) % 1700}" cy="${(i * 89) % 600}" rx="6" ry="3" transform="rotate(${i * 40} ${(i * 173) % 1700} ${(i * 89) % 600})" opacity="0.8"/>`).join('')}</g>`),
    }
  },
  bind: (stage) => {
    const j = joints(stage)
    const [petals, kite, line, tail] = ['petals', 'kite', 'line', 'tail'].map((name) => fx(stage, name))
    return (p, play) => {
      tf(petals, `translate(${r1(-p * 500)} ${r1(p * 420)})`)
      const pose = flyPose(play)
      const hand = handOf(pose)
      const at = kiteAt(play, hand)
      const sway = Math.sin(share(play, 1) * Math.PI * 3) * 8
      tf(kite, kiteTransform(at, sway))
      tf(tail, `rotate(${r1(-sway * 1.5)} 0 40)`)
      line?.setAttribute('d', lineTo(hand, at))
      fade(line, play.action === 0 && play.t < 0.6 ? 0 : 0.8)
      setPose(j, pose)
    }
  },
}
