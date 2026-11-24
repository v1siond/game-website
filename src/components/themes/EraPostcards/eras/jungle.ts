import { JUNGLE } from '../palette'
import { defs, fade, frond, fx, glow, linear, rect, ridge, r1, spread, svg, tf } from '../draw'
import { courier, joints, setPose, type Pose } from '../courier'
import type { Playhead } from '@/lib/scroll/player'
import { END, share, type Era } from './era'

// Muay Thai: the jungle ring under a waterfall by a temple; the falls run and flies drift with the scroll.
// He plays three actions: he raises his guard, throws one round kick into the bag and the bag swings away
// and settles, then he steps back into his guard while the torches round the ring light one after another.
// The bag hangs at his hip height, its near side (x 1030) where the instep of a full kick lands (about 1040, 685).

const BAG_PIVOT = [1060, 470] as const

// The kick rises and returns over the second action.
const kickOf = (play: Playhead): number => (play.action === 1 ? Math.sin(play.t * Math.PI) : 0)

// His hands come up into the guard over the first action and stay there.
const guardOf = (play: Playhead): number => share(play, 0)

const kickPose = (play: Playhead): Partial<Pose> => {
  const kick = kickOf(play)
  const guard = guardOf(play)
  return {
    x: 960,
    y: 900,
    scale: 1.25,
    lean: -kick * 34,
    hipF: 10 + kick * 105,
    kneeF: -40 + kick * 36,
    hipB: -8 - kick * 10,
    kneeB: -10,
    shF: 20 + guard * 50 - kick * 30,
    elF: 20 + guard * 100,
    shB: 10 + guard * 30 + kick * 60,
    elB: 20 + guard * 90 - kick * 60,
    head: kick * 10,
    scarf: kick * 40,
  }
}

// The bag: struck at the top of the kick, it swings away and settles back by the end of the second action.
const bagSwing = (play: Playhead): number => {
  if (play.action !== 1) return 0
  const after = Math.max(0, (play.t - 0.45) / 0.55)
  return -Math.sin(after * Math.PI * 2) * 16 * (1 - after)
}

/** How lit torch i of `count` is: they light one after another over the third action. */
const torchLit = (play: Playhead, i: number, count: number): number => Math.min(1, Math.max(0, share(play, 2) * (count + 1) - i))

export const jungle: Era = {
  script: [1300, 1600, 2000],
  build: ({ count }) => {
    const torches = spread(count, 480, 1120)
      .map(
        (x, i) => `<g transform="translate(${r1(x)} 760)"><rect x="-4" y="0" width="8" height="100" fill="${JUNGLE.ring}"/>
    <g data-fx="flame-${i}">${glow(`mt-t-${i}`, 0, -10, 60, JUNGLE.flame, 0.8)}<path d="M0,-34 q14,16 8,30 q-8,6 -16,0 q-6,-14 8,-30 Z" fill="${JUNGLE.flame}"/></g></g>`,
      )
      .join('')
    const stripes = Array.from({ length: 30 }, (_, i) => `<rect x="${360 + (i % 5) * 26}" y="${-800 + i * 60}" width="10" height="44" rx="5" fill="${JUNGLE.spray}" opacity="0.6"/>`).join('')
    const ropes = [JUNGLE.ropeRed, JUNGLE.ropeWhite, JUNGLE.ropeBlue]
    return {
      sky: svg(`${defs(linear('mt-sky', [[0, JUNGLE.skyTop], [0.45, JUNGLE.skyMid], [0.8, JUNGLE.skyLow], [1, JUNGLE.skyHorizon]]))}${rect('url(#mt-sky)')}
        ${glow('mt-sun', 1100, 520, 360, JUNGLE.sun, 0.6)}<g fill="${JUNGLE.ray}" opacity="0.12"><path d="M1100,300 L700,1000 L860,1000 Z"/><path d="M1100,300 L1300,1000 L1420,1000 Z"/></g>`),
      far: svg(`<g fill="${JUNGLE.temple}"><path d="M940,620 L980,560 h240 l40,60 Z"/><path d="M980,560 L1010,500 h180 l30,60 Z"/><path d="M1010,500 L1040,440 h120 l30,60 Z"/><path d="M1060,440 L1100,360 L1140,440 Z"/></g>
        ${ridge(81, { y: 640, amp: 50, fill: JUNGLE.ridgeFar, step: 10, sharp: 14 })}`),
      mid: svg(`${defs('<clipPath id="mt-clip"><rect x="350" y="200" width="140" height="620"/></clipPath>')}<rect x="350" y="200" width="140" height="620" fill="${JUNGLE.falls}" opacity="0.5"/>
        <g clip-path="url(#mt-clip)"><g data-fx="falls">${stripes}</g></g>
        <path d="M260,170 Q420,120 580,170 L560,230 L280,230 Z" fill="${JUNGLE.cliff}"/><ellipse cx="420" cy="820" rx="140" ry="24" fill="${JUNGLE.spray}" opacity="0.5"/>
        ${ridge(82, { y: 780, amp: 30, fill: JUNGLE.ridgeNear, step: 8, sharp: 20 })}
        ${[160, 680, 1300, 1480].map((x) => `<path d="M${x},0 q20,140 -6,300" stroke="${JUNGLE.ridgeNear}" stroke-width="6" fill="none"/>`).join('')}`),
      near: svg(`<path d="M380,940 L1220,940 L1260,860 L340,860 Z" fill="${JUNGLE.ringFloor}"/><path d="M340,860 L1260,860" stroke="${JUNGLE.ringEdge}" stroke-width="4"/>
        ${torches}
        ${[400, 1200].map((x) => `<rect x="${x - 10}" y="700" width="20" height="170" fill="${JUNGLE.post}"/><rect x="${x - 14}" y="694" width="28" height="12" fill="${JUNGLE.ropeRed}"/>`).join('')}
        ${[730, 770, 810].map((y, i) => `<path d="M400,${y} L1200,${y}" stroke="${ropes[i]}" stroke-width="5"/>`).join('')}`),
      figure: svg(`<path d="M980,470 L1200,470" stroke="${JUNGLE.beam}" stroke-width="12"/><g data-fx="bag"><path d="M1060,470 L1060,540" stroke="${JUNGLE.chain}" stroke-width="4"/><rect x="1030" y="540" width="60" height="220" rx="28" fill="${JUNGLE.bag}" stroke="${JUNGLE.bagEdge}" stroke-width="4"/><rect x="1030" y="590" width="60" height="16" fill="${JUNGLE.bagEdge}"/></g>${courier(kickPose(END))}`),
      fg: svg(`<g fill="${JUNGLE.leaf}">${frond(-80, 1010, 460, -50, JUNGLE.leaf)}${frond(-60, 1010, 380, -80, JUNGLE.leaf)}<path d="M1800,1000 L1800,560 Q1600,620 1560,760 Q1520,880 1480,1000 Z"/>${frond(1700, 1010, 420, -130, JUNGLE.leaf)}</g>
        <g data-fx="flies" fill="${JUNGLE.fly}">${Array.from({ length: 18 }, (_, i) => `<circle cx="${(i * 181) % 1600}" cy="${400 + ((i * 113) % 500)}" r="3" opacity="0.7"/>`).join('')}</g>`),
    }
  },
  bind: (stage, { count }) => {
    const j = joints(stage)
    const flames = Array.from({ length: count }, (_, i) => fx(stage, `flame-${i}`))
    const [falls, bag, flies] = ['falls', 'bag', 'flies'].map((name) => fx(stage, name))
    return (p, play) => {
      tf(falls, `translate(0 ${r1(((p * 1800) % 60) + p * 600)})`)
      tf(flies, `translate(${r1(Math.sin(p * 7) * 40)} ${r1(-p * 120)})`)
      flames.forEach((flame, i) => fade(flame, 0.1 + torchLit(play, i, count) * 0.9))
      tf(bag, `rotate(${r1(bagSwing(play))} ${BAG_PIVOT[0]} ${BAG_PIVOT[1]})`)
      setPose(j, kickPose(play))
    }
  },
}
