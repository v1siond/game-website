import { gait } from '@/lib/motion/gait'
import { hop } from '@/lib/motion/arc'
import { WALL } from '../palette'
import { defs, fade, fx, glow, lerp, linear, rect, ridge, r1, svg, tf } from '../draw'
import { courier, joints, setPose, type Pose } from '../courier'
import { bike, cockpit, RIDE } from './highway'
import { ease, reached, type Era } from './era'

// Projects: the long wall at sunset, the chase. He runs along the wall towards us, from the far towers to
// the near walkway, hurdling a gap in it per project while the tower's searchlight hunts after him and the
// stars of how wanted he is light one by one. On the last project he leaps off the wall onto the hover bike
// waiting below and the searchlight loses him.

// The run from far to near: where he starts small on the far wall (right of the cards' column at 1440)
// and where the near walkway ends.
const FAR = { x: 760, y: 700, scale: 0.55 } as const
const NEAR = { x: 1040, y: 905, scale: 1.2 } as const

// The getaway: the bike sits this far from where the Work scene draws it, and he lands in its saddle.
const BIKE_AT = [300, 34] as const
const ON_BIKE: Partial<Pose> = { ...RIDE, x: (RIDE.x ?? 0) + BIKE_AT[0], y: 870 + BIKE_AT[1] }

const STARS = 5
const STAR = 'M0,-14 L4,-5 L14,-4 L6,3 L9,13 L0,7 L-9,13 L-6,3 L-14,-4 L-4,-5 Z'
const TOWER_LIGHT = [1500, 590] as const

// How far along the run he is (0 far, 1 near): the cards carry him, the last one only to its first part.
const runOf = (f: number, count: number): number => (count === 0 ? 1 : Math.min(1, f / Math.max(1, count - 0.6)))

const placeOf = (s: number): { x: number; y: number; scale: number } => {
  const t = ease(s) * 0.4 + s * 0.6
  return { x: lerp(FAR.x, NEAR.x, t), y: lerp(FAR.y, NEAR.y, t * t), scale: lerp(FAR.scale, NEAR.scale, t) }
}

// The hurdle of card i: most of the card in the air, so a stopped scroll holds him over the gap.
const liftOf = (f: number, i: number): number => hop((reached(f, i) - 0.08) / 0.84, 1)

// The leap onto the bike over the last card's second half.
const leapOf = (f: number, count: number): number => (count === 0 ? 1 : ease((reached(f, count - 1) - 0.45) / 0.4))

const TUCK = { hipF: 70, kneeF: -96, hipB: -10, kneeB: -70, shF: 120, elF: 30, shB: -40, elB: 40 } as const

const runPose = (f: number, count: number): Partial<Pose> => {
  const at = Math.min(count - 1, Math.max(0, Math.floor(f)))
  const place = placeOf(runOf(f, count))
  const air = count === 0 ? 0 : liftOf(f, at)
  const legs = gait(runOf(f, count) * count * 1.5, 1.5)
  const tucked = Object.fromEntries(Object.entries(TUCK).map(([key, value]) => [key, lerp(legs[key as keyof typeof TUCK], value, air)]))
  return { ...place, ...tucked, lean: 14, head: -6, scarf: 20 + legs.scarf, lift: air * 90 * place.scale }
}

const KEYS = ['x', 'y', 'scale', 'lean', 'head', 'hipF', 'kneeF', 'hipB', 'kneeB', 'shF', 'elF', 'shB', 'elB', 'scarf', 'lift'] as const

const chasePose = (f: number, count: number): Partial<Pose> => {
  const run = runPose(f, count)
  const leap = leapOf(f, count)
  if (leap <= 0) return run
  const pose = Object.fromEntries(KEYS.map((key) => [key, lerp(run[key] ?? 0, ON_BIKE[key] ?? 0, leap)])) as Partial<Pose>
  return { ...pose, lift: hop(leap, 140) }
}

// The wanted stars: star k lights once its share of the projects has been read.
const starLit = (f: number, count: number, k: number): number => (count === 0 ? 1 : ease(f / count * STARS - k))

const stars = (lit: number): string =>
  Array.from({ length: STARS }, (_, k) => `<g transform="translate(${1250 + k * 38} 236)">
    <path d="${STAR}" fill="${WALL.starOff}" stroke="${WALL.starEdge}" stroke-width="2"/>
    <path data-fx="star-${k}" d="${STAR}" fill="${WALL.star}" opacity="${lit}"/></g>`).join('')

// The searchlight: a beam from the far tower to a point, hunting where he was a moment ago.
const beamTo = ([x, y]: readonly [number, number]): string => {
  const [tx, ty] = TOWER_LIGHT
  const a = Math.atan2(y - ty, x - tx)
  const spread = 70
  const nx = -Math.sin(a) * spread
  const ny = Math.cos(a) * spread
  return `M${tx},${ty} L${r1(x + nx)},${r1(y + ny)} L${r1(x - nx)},${r1(y - ny)} Z`
}

const huntAt = (f: number, count: number): [number, number] => {
  const { x, y } = placeOf(Math.max(0, runOf(f, count) - 0.06))
  return [x, y - 60]
}

// The gaps in the wall he hurdles, one per project, along the run; drawn cleared (the settled frame) and
// opened by the writer for the ones still ahead of him.
const gaps = (count: number): string =>
  Array.from({ length: count }, (_, i) => {
    const { x, y, scale } = placeOf(Math.min(1, (i + 0.5) / Math.max(1, count - 0.6)))
    return `<ellipse data-fx="gap-${i}" opacity="0" cx="${r1(x + 40 * scale)}" cy="${r1(y + 4)}" rx="${r1(34 * scale)}" ry="${r1(7 * scale)}" fill="${WALL.gap}"/>`
  }).join('')

export const wall: Era = {
  build: ({ count }) => {
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
      // The settled frame (reduced motion, and the picture before the first scroll): every star lit, the
      // searchlight lost, him in the bike's saddle.
      figure: svg(`${gaps(count)}<path data-fx="search" d="${beamTo(huntAt(count, count))}" fill="${WALL.search}" opacity="0"/>
        <g data-fx="getaway" transform="translate(${BIKE_AT[0]} ${BIKE_AT[1]})">${cockpit}</g>${courier(chasePose(count, count))}
        <g transform="translate(${BIKE_AT[0]} ${BIKE_AT[1]})"><g data-fx="getaway-hull">${bike}</g></g>${stars(1)}`),
      fg: svg(`<g fill="${WALL.branch}"><path d="M1800,-20 L1180,-20 Q1300,60 1460,70 Q1560,120 1800,110 Z"/>${[1260, 1380, 1500, 1620].map((x) => `<path d="M${x},40 q-30,40 -70,46 q40,10 80,-30 Z"/>`).join('')}</g>
        <g data-fx="petals" fill="${WALL.petal}">${Array.from({ length: 24 }, (_, i) => `<ellipse cx="${(i * 173) % 1700}" cy="${(i * 89) % 600}" rx="6" ry="3" transform="rotate(${i * 40} ${(i * 173) % 1700} ${(i * 89) % 600})" opacity="0.8"/>`).join('')}</g>`),
    }
  },
  bind: (stage, { count }) => {
    const j = joints(stage)
    const lit = Array.from({ length: STARS }, (_, k) => fx(stage, `star-${k}`))
    const gapNodes = Array.from({ length: count }, (_, i) => fx(stage, `gap-${i}`))
    const [petals, search, getaway, hull] = ['petals', 'search', 'getaway', 'getaway-hull'].map((name) => fx(stage, name))
    return (p, f) => {
      tf(petals, `translate(${r1(-p * 500)} ${r1(p * 420)})`)
      lit.forEach((node, k) => fade(node, starLit(f, count, k)))
      // A gap he has cleared closes behind him, so only the ones ahead show.
      gapNodes.forEach((node, i) => fade(node, 1 - reached(f, i)))
      const leap = leapOf(f, count)
      search?.setAttribute('d', beamTo(huntAt(f, count)))
      fade(search, 0.35 * (1 - leap) * Math.min(1, p * 6))
      const bikeIn = count === 0 ? 1 : ease((reached(f, count - 1) - 0.1) / 0.25)
      fade(getaway, bikeIn)
      fade(hull, bikeIn)
      setPose(j, chasePose(f, count))
    }
  },
}
