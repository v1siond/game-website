import { mulberry32 } from '@/lib/random/seeded'
import { TOMB, TOMB_DEPTH } from '../palette'
import { defs, fade, fx, glow, lerp, linear, radial, rect, r1, spread, svg, tf } from '../draw'
import { courier, joints, setPose, strideAt, walkOn, type Pose } from '../courier'
import { clamp01, reached, type Era } from './era'

// Tech: the sun tomb. A hall of columns towards a lit door; he carries a torch down it and a glyph tablet
// per category lights as he passes; dust rises, sand falls, the door's beams breathe.

export const torch = `<g transform="translate(0 30) rotate(-10)"><rect x="-3" y="-46" width="6" height="56" rx="2" fill="${TOMB.stick}"/>
  <path d="M0,-80 q14,16 8,30 q-8,6 -16,0 q-6,-14 8,-30 Z" fill="${TOMB.flame}"/><path d="M0,-66 q6,8 3,14 q-3,3 -6,0 q-2,-7 3,-14 Z" fill="${TOMB.flameCore}"/></g>`

const column = (x: number, base: number, h: number, w: number, fill: string, band: string): string => `<g><rect x="${x - w / 2}" y="${base - h}" width="${w}" height="${h}" fill="${fill}"/>
  <rect x="${x - w / 2 - 6}" y="${base - h - 14}" width="${w + 12}" height="16" fill="${fill}"/><rect x="${x - w / 2}" y="${base - h + 30}" width="${w}" height="${r1(Math.max(8, h * 0.06))}" fill="${band}"/>
  <rect x="${x - w / 2}" y="${r1(base - h * 0.45)}" width="${w}" height="${r1(Math.max(6, h * 0.04))}" fill="${band}" opacity="0.7"/></g>`

const glyphs = (seed: number): string => {
  const random = mulberry32(seed)
  return Array.from({ length: 5 }, (_, k) => {
    const y = -70 + k * 14
    const kind = Math.floor(random() * 4)
    const shapes = [`<circle cx="${r1(-10 + random() * 20)}" cy="${y}" r="5"/>`, `<path d="M-10,${y + 5} l10,-10 l10,10 Z"/>`, `<path d="M-12,${y} h24 M0,${y - 5} v10"/>`, `<path d="M-12,${y + 4} q12,-12 24,0"/>`]
    return shapes[kind]
  }).join('')
}

const tabletsAt = (count: number): number[] => spread(count, 520, 1080)

const carryPose = (xs: readonly number[], p: number, f: number): Partial<Pose> => {
  const x = walkOn(lerp(xs[0] - 40, xs[xs.length - 1] + 30, clamp01(f / Math.max(1, xs.length))), p)
  return { x, y: 905, scale: 1.2, ...strideAt(x, 1.2, 0.7), shF: 150, elF: 20, head: -4 }
}

export const tomb: Era = {
  build: ({ count }) => {
    const xs = tabletsAt(count)
    const tablets = xs
      .map(
        (x, i) => `<g transform="translate(${r1(x)} 330)">
    <g data-fx="tglow-${i}" opacity="0">${defs(radial(`tc-g-${i}`, [[0, TOMB.glyph, 0.8], [1, TOMB.glyph, 0]]))}<circle cy="-40" r="80" fill="url(#tc-g-${i})"/></g>
    <rect x="-28" y="-86" width="56" height="92" rx="6" fill="${TOMB.tablet}" stroke="${TOMB.goldDim}" stroke-width="3"/>
    <g data-fx="glyph-${i}" stroke="${TOMB.glyph}" fill="none" stroke-width="3" opacity="0.2">${glyphs(40 + i)}</g></g>`,
      )
      .join('')
    const back = [3, 2, 1, 0]
      .map((d) => [-1, 1].map((side) => column(800 + side * (140 + d * 70), 700 + d * 22, 240 + d * 50, 34 + d * 10, TOMB_DEPTH[d], TOMB.gold)).join(''))
      .join('')
    const floorLines = Array.from({ length: 11 }, (_, i) => `<path d="M800,600 L${-400 + i * 240},1000" stroke="${TOMB.floorLine}" stroke-width="2"/>`).join('')
    const start = carryPose(xs, 0, 0)
    return {
      sky: svg(`${defs(linear('tc-wall', [[0, TOMB.wallTop], [1, TOMB.wallBottom]]), linear('tc-door', [[0, TOMB.door], [1, TOMB.doorWarm]]), linear('tc-beam', [[0, TOMB.beam, 0.55], [1, TOMB.beam, 0]]))}${rect('url(#tc-wall)')}
        ${glow('tc-door-g', 800, 520, 360, TOMB.doorGlow, 0.75)}<path d="M740,600 L740,420 Q800,380 860,420 L860,600 Z" fill="url(#tc-door)"/>
        <g data-fx="beams"><path d="M760,430 L380,1000 L560,1000 L800,430 Z" fill="url(#tc-beam)"/><path d="M820,430 L1220,1000 L1060,1000 L840,430 Z" fill="url(#tc-beam)"/></g>`),
      far: svg(`<path d="M-200,1000 L800,600 L1800,1000 Z" fill="${TOMB.floor}"/>${floorLines}${back}<rect x="-200" y="160" width="2000" height="40" fill="${TOMB.lintel}"/><rect x="-200" y="198" width="2000" height="6" fill="${TOMB.gold}"/>`),
      mid: svg(`${[-1, 1].map((side) => column(800 + side * 560, 1000, 760, 120, TOMB.columnNear, TOMB.goldBright) + column(800 + side * 430, 900, 520, 74, TOMB.columnMid, TOMB.goldDim)).join('')}${tablets}`),
      near: svg(`<g data-fx="motes" fill="${TOMB.mote}">${Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 137) % 1600}" cy="${(i * 263) % 1000}" r="${1 + (i % 3)}" opacity="${r1(0.3 + (i % 4) * 0.15)}"/>`).join('')}</g>`),
      figure: svg(`<g data-fx="torchglow" transform="translate(${r1((start.x ?? 0) + 30)} 905)">${glow('tc-torch', 0, -150, 260, TOMB.torchGlow, 0.55)}</g>${courier(start, { held: torch })}`),
      fg: svg(`<rect x="-200" y="-20" width="400" height="1040" fill="${TOMB.frame}"/><rect x="190" y="-20" width="14" height="1040" fill="${TOMB.goldBright}"/>
        <rect x="1400" y="-20" width="400" height="1040" fill="${TOMB.frame}"/><rect x="1396" y="-20" width="14" height="1040" fill="${TOMB.goldBright}"/>
        <g data-fx="sand" fill="${TOMB.sand}" opacity="0.6"><rect x="520" y="-600" width="3" height="700"/><rect x="1090" y="-800" width="2" height="900"/><rect x="300" y="-500" width="2" height="600"/></g>`),
    }
  },
  bind: (stage, { count }) => {
    const xs = tabletsAt(count)
    const j = joints(stage)
    const lights = Array.from({ length: count }, (_, i) => [fx(stage, `tglow-${i}`), fx(stage, `glyph-${i}`)] as const)
    const [beams, motes, sand, torchGlow] = ['beams', 'motes', 'sand', 'torchglow'].map((name) => fx(stage, name))
    return (p, f) => {
      fade(beams, 0.5 + Math.sin(p * Math.PI) * 0.5)
      tf(motes, `translate(${r1(Math.sin(p * 5) * 30)} ${r1(-p * 160)})`)
      tf(sand, `translate(0 ${r1(p * 700)})`)
      lights.forEach(([glowNode, mark], i) => {
        fade(glowNode, reached(f, i))
        fade(mark, 0.2 + reached(f, i) * 0.8)
      })
      const pose = carryPose(xs, p, f)
      tf(torchGlow, `translate(${r1((pose.x ?? 0) + 30)} 905)`)
      setPose(j, pose)
    }
  },
}
