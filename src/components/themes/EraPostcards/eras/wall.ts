import { WALL } from '../palette'
import { defs, fade, fx, glow, linear, radial, rect, ridge, r1, spread, svg, tf } from '../draw'
import { courier, joints, setPose, type Pose } from '../courier'
import { clamp01, reached, type Era } from './era'

// Projects: the long wall at sunset. A crate per project stands on the walkway in two rows; he breaks each
// one open with a spin as its card is read: the lid flies, a burst of light, a shard rises. Petals drift.

const SIZE = 50

interface Spot {
  x: number
  y: number
}

const cratesAt = (count: number): Spot[] => {
  const perRow = Math.ceil(count / 2)
  const xs = spread(perRow, 560, 1040)
  return Array.from({ length: count }, (_, i) => {
    const row = i < perRow ? 0 : 1
    return { x: xs[row ? i - perRow : i] + (row ? 26 : 0), y: row ? 892 - SIZE : 892 }
  })
}

const spinPose = (crates: readonly Spot[], f: number): Partial<Pose> => {
  const at = Math.min(crates.length - 1, Math.max(0, Math.floor(f)))
  const spin = Math.sin(clamp01((f - Math.floor(f)) * 1.6) * Math.PI)
  return { x: crates[at].x + 54, y: 960, scale: 1.05, lean: -spin * 14, shF: 40 + spin * 90, shB: -30 - spin * 70, elF: 10, elB: 10, hipF: 14 + spin * 12, hipB: -14, head: -4, scarf: spin * 30 }
}

export const wall: Era = {
  build: ({ count }) => {
    const crates = cratesAt(count)
    const markup = crates
      .map(
        ({ x, y }, i) => `<g transform="translate(${r1(x)} ${y})">
    <g data-fx="burst-${i}" opacity="0">${defs(radial(`pj-b-${i}`, [[0, WALL.burst, 1], [0.5, WALL.burstMid, 0.5], [1, WALL.burstEdge, 0]]))}<circle cy="-30" r="70" fill="url(#pj-b-${i})"/></g>
    <rect x="${-SIZE / 2}" y="${-SIZE}" width="${SIZE}" height="${SIZE}" rx="3" fill="${WALL.crate}" stroke="${WALL.crateEdge}" stroke-width="3"/>
    <path d="M${-SIZE / 2 + 5},${-SIZE + 5} L${SIZE / 2 - 5},-5 M${SIZE / 2 - 5},${-SIZE + 5} L${-SIZE / 2 + 5},-5" stroke="${WALL.crateBrace}" stroke-width="5"/>
    <g data-fx="lid-${i}"><rect x="${-SIZE / 2 - 3}" y="${-SIZE - 8}" width="${SIZE + 6}" height="10" rx="2" fill="${WALL.lid}" stroke="${WALL.crateEdge}" stroke-width="3"/></g>
    <path data-fx="gem-${i}" d="M0,-70 l12,14 l-12,18 l-12,-18 Z" fill="${WALL.gem}" stroke="${WALL.gemEdge}" stroke-width="2" opacity="0"/></g>`,
      )
      .join('')
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
      figure: svg(`${markup}${courier(spinPose(crates, 0))}`),
      fg: svg(`<g fill="${WALL.branch}"><path d="M1800,-20 L1180,-20 Q1300,60 1460,70 Q1560,120 1800,110 Z"/>${[1260, 1380, 1500, 1620].map((x) => `<path d="M${x},40 q-30,40 -70,46 q40,10 80,-30 Z"/>`).join('')}</g>
        <g data-fx="petals" fill="${WALL.petal}">${Array.from({ length: 24 }, (_, i) => `<ellipse cx="${(i * 173) % 1700}" cy="${(i * 89) % 600}" rx="6" ry="3" transform="rotate(${i * 40} ${(i * 173) % 1700} ${(i * 89) % 600})" opacity="0.8"/>`).join('')}</g>`),
    }
  },
  bind: (stage, { count }) => {
    const crates = cratesAt(count)
    const j = joints(stage)
    const parts = Array.from({ length: count }, (_, i) => [fx(stage, `lid-${i}`), fx(stage, `burst-${i}`), fx(stage, `gem-${i}`)] as const)
    const petals = fx(stage, 'petals')
    return (p, f) => {
      tf(petals, `translate(${r1(-p * 500)} ${r1(p * 420)})`)
      parts.forEach(([lid, burst, gem], i) => {
        const open = reached(f, i)
        tf(lid, `translate(0 ${r1(-open * 24)}) rotate(${r1(-open * 120)} -28 -58)`)
        fade(burst, Math.sin(open * Math.PI) * 0.9 + open * 0.25)
        fade(gem, open > 0 ? Math.min(1, open * 3) : 0)
        tf(gem, `translate(0 ${r1(-open * 90)}) rotate(${r1(open * 180)} 0 -56)`)
      })
      setPose(j, spinPose(crates, f))
    }
  },
}
