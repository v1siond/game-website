import { TOMB, TOMB_DEPTH } from '../palette'
import { defs, fade, fx, glow, lerp, linear, radial, rect, r1, svg, tf } from '../draw'
import { courier, joints, setPose, type Pose } from '../courier'
import { ease, peakOf, reached, type Era } from './era'

// Tech: the sun tomb, the heist. A hall of columns towards a lit door. As the scene rises he drops in on a
// rope from the roof, then works the vault in the wall: one ring of its lock per category turns and locks
// green while he listens at the door. Halfway a guard's light sweeps the far door and he flattens to the
// wall until it passes. On the last ring the vault swings open, gold light falls on him and he settles the
// satchel on his back.

const column = (x: number, base: number, h: number, w: number, fill: string, band: string): string => `<g><rect x="${x - w / 2}" y="${base - h}" width="${w}" height="${h}" fill="${fill}"/>
  <rect x="${x - w / 2 - 6}" y="${base - h - 14}" width="${w + 12}" height="16" fill="${fill}"/><rect x="${x - w / 2}" y="${base - h + 30}" width="${w}" height="${r1(Math.max(8, h * 0.06))}" fill="${band}"/>
  <rect x="${x - w / 2}" y="${r1(base - h * 0.45)}" width="${w}" height="${r1(Math.max(6, h * 0.04))}" fill="${band}" opacity="0.7"/></g>`

const VAULT = { x: 1030, y: 700, r: 120 } as const
const STAND_X = 880
const FLOOR_Y = 905
const ROOF_Y = 200

// The lock's rings, outer to inner, and where each starts turned from its notch.
const ringsOf = (count: number): { r: number; width: number; from: number }[] =>
  Array.from({ length: count }, (_, i) => {
    const step = (VAULT.r - 34) / Math.max(1, count)
    return { r: VAULT.r - 18 - i * step, width: Math.max(4, step * 0.55), from: 60 + ((i * 97) % 240) }
  })

const ring = ({ r, width, from }: { r: number; width: number; from: number }, i: number, turned: number, locked: boolean): string =>
  `<g data-fx="ring-${i}" transform="rotate(${r1(from * (1 - turned))})"><circle r="${r1(r)}" fill="none" stroke="${locked ? TOMB.glyph : TOMB.ring}" stroke-width="${r1(width)}" data-fx="ringline-${i}"/>
    <rect x="-3" y="${r1(-r - width)}" width="6" height="${r1(width * 2)}" fill="${TOMB.vaultLight}"/></g>`

const vault = (count: number, open: number): string => `
  <circle cx="${VAULT.x}" cy="${VAULT.y}" r="${VAULT.r + 10}" fill="${TOMB.frame}"/>
  <g data-fx="vaultlight" opacity="${open}"><circle cx="${VAULT.x}" cy="${VAULT.y}" r="${VAULT.r}" fill="${TOMB.doorWarm}"/>${glow('tc-vault-g', VAULT.x, VAULT.y, 320, TOMB.vaultLight, 0.8)}</g>
  <g data-fx="vaultdoor" transform="${doorTransform(open)}">
    <circle r="${VAULT.r}" fill="${TOMB.vault}" stroke="${TOMB.vaultEdge}" stroke-width="6"/>
    ${ringsOf(count).map((each, i) => ring(each, i, open, open > 0)).join('')}
    <circle r="16" fill="${TOMB.vaultEdge}"/></g>`

// The door swings on its left hinge: it narrows towards the hinge as it opens.
function doorTransform(open: number): string {
  return `translate(${r1(VAULT.x - VAULT.r * ease(open))} ${VAULT.y}) scale(${r1(1 - 0.85 * ease(open))} 1) translate(${r1(VAULT.r * ease(open))} 0)`
}

const ROPE_X = STAND_X + 8

const AT_DOOR: Partial<Pose> = { x: STAND_X, y: FLOOR_Y, scale: 1.2, lean: 12, head: 12, shF: 74, elF: 46, shB: 20, elB: 30, hipF: 8, kneeF: -6 }
const FLAT: Partial<Pose> = { x: STAND_X - 30, y: FLOOR_Y, scale: 1.2, lean: -8, head: -6, shF: -12, elF: 6, shB: -24, elB: 6, hipF: 2, kneeF: -2 }
const ON_ROPE: Partial<Pose> = { x: STAND_X, scale: 1.2, lean: 0, head: -10, shF: 172, elF: 6, shB: 164, elB: 10, hipF: 30, kneeF: -40, hipB: 10, kneeB: -30 }
const SATCHEL: Partial<Pose> = { x: STAND_X, y: FLOOR_Y, scale: 1.2, lean: -4, head: -8, shF: 40, elF: 90, shB: 130, elB: 70, scarf: 16 }

const KEYS = ['x', 'y', 'lean', 'head', 'shF', 'elF', 'shB', 'elB', 'hipF', 'kneeF', 'hipB', 'kneeB', 'scarf'] as const

const blend = (from: Partial<Pose>, to: Partial<Pose>, t: number): Partial<Pose> => ({
  scale: 1.2,
  ...Object.fromEntries(KEYS.map((key) => [key, lerp(from[key] ?? 0, to[key] ?? 0, t)])),
})

// The drop in on the rope as the scene rises (p 0 to ENTRY), then the vault.
const ENTRY = 0.16
const ropeY = (p: number): number => lerp(ROOF_Y, FLOOR_Y, ease(p / ENTRY))

const guardCard = (count: number): number => Math.floor(count / 2)

// The guard's light across the far door: over the middle card it sweeps left to right once.
const sweepOf = (f: number, count: number): number => (count > 2 ? reached(f, guardCard(count)) : 0)
const flatOf = (f: number, count: number): number => (count > 2 ? peakOf(sweepOf(f, count), 0.15, 0.85) : 0)

// How far the door has swung: over the last card, once its ring has locked.
const openOf = (f: number, count: number): number => (count === 0 ? 0 : ease((reached(f, count - 1) - 0.35) / 0.4))

// How far ring i has turned to its notch: the first part of its card, then it holds, locked.
const turnOf = (f: number, i: number): number => ease(reached(f, i) / 0.3)

const heistPose = (p: number, f: number, count: number): Partial<Pose> => {
  if (p < ENTRY) return { ...ON_ROPE, y: ropeY(p) }
  const landed = blend(ON_ROPE, AT_DOOR, ease((p - ENTRY) / 0.06))
  const flat = blend(landed, FLAT, flatOf(f, count))
  return blend(flat, SATCHEL, openOf(f, count))
}

export const tomb: Era = {
  build: ({ count }) => {
    const back = [3, 2, 1, 0]
      .map((d) => [-1, 1].map((side) => column(800 + side * (140 + d * 70), 700 + d * 22, 240 + d * 50, 34 + d * 10, TOMB_DEPTH[d], TOMB.gold)).join(''))
      .join('')
    const floorLines = Array.from({ length: 11 }, (_, i) => `<path d="M800,600 L${-400 + i * 240},1000" stroke="${TOMB.floorLine}" stroke-width="2"/>`).join('')
    // The settled frame (reduced motion, and the picture before the first scroll): the vault open on every
    // locked ring, him with the satchel at its peak, the rope hanging behind him.
    const settled = heistPose(1, count, count)
    return {
      sky: svg(`${defs(linear('tc-wall', [[0, TOMB.wallTop], [1, TOMB.wallBottom]]), linear('tc-door', [[0, TOMB.door], [1, TOMB.doorWarm]]), linear('tc-beam', [[0, TOMB.beam, 0.55], [1, TOMB.beam, 0]]))}${rect('url(#tc-wall)')}
        ${glow('tc-door-g', 800, 520, 360, TOMB.doorGlow, 0.75)}<path d="M740,600 L740,420 Q800,380 860,420 L860,600 Z" fill="url(#tc-door)"/>
        <g data-fx="beams"><path d="M760,430 L380,1000 L560,1000 L800,430 Z" fill="url(#tc-beam)"/><path d="M820,430 L1220,1000 L1060,1000 L840,430 Z" fill="url(#tc-beam)"/></g>
        <g data-fx="guard" opacity="0">${defs(radial('tc-guard', [[0, TOMB.guardLight, 0.9], [1, TOMB.guardLight, 0]]))}<ellipse cx="0" cy="520" rx="70" ry="90" fill="url(#tc-guard)"/></g>`),
      far: svg(`<path d="M-200,1000 L800,600 L1800,1000 Z" fill="${TOMB.floor}"/>${floorLines}${back}<rect x="-200" y="160" width="2000" height="40" fill="${TOMB.lintel}"/><rect x="-200" y="198" width="2000" height="6" fill="${TOMB.gold}"/>`),
      mid: svg(`${[-1, 1].map((side) => column(800 + side * 560, 1000, 760, 120, TOMB.columnNear, TOMB.goldBright) + column(800 + side * 430, 900, 520, 74, TOMB.columnMid, TOMB.goldDim)).join('')}${vault(count, count > 0 ? 1 : 0)}`),
      near: svg(`<g data-fx="motes" fill="${TOMB.mote}">${Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 137) % 1600}" cy="${(i * 263) % 1000}" r="${1 + (i % 3)}" opacity="${r1(0.3 + (i % 4) * 0.15)}"/>`).join('')}</g>`),
      figure: svg(`<rect data-fx="rope" x="${ROPE_X - 3.5}" y="${ROOF_Y - 40}" width="7" rx="3" height="${FLOOR_Y - ROOF_Y - 60}" fill="${TOMB.rope}"/>${courier(settled)}`),
      fg: svg(`<rect x="-200" y="-20" width="400" height="1040" fill="${TOMB.frame}"/><rect x="190" y="-20" width="14" height="1040" fill="${TOMB.goldBright}"/>
        <rect x="1400" y="-20" width="400" height="1040" fill="${TOMB.frame}"/><rect x="1396" y="-20" width="14" height="1040" fill="${TOMB.goldBright}"/>
        <g data-fx="sand" fill="${TOMB.sand}" opacity="0.6"><rect x="520" y="-600" width="3" height="700"/><rect x="1090" y="-800" width="2" height="900"/><rect x="300" y="-500" width="2" height="600"/></g>`),
    }
  },
  bind: (stage, { count }) => {
    const j = joints(stage)
    const rings = ringsOf(count).map((each, i) => ({ each, node: fx(stage, `ring-${i}`), line: fx(stage, `ringline-${i}`) }))
    const [beams, motes, sand, guard, door, vaultLight, rope] = ['beams', 'motes', 'sand', 'guard', 'vaultdoor', 'vaultlight', 'rope'].map((name) => fx(stage, name))
    return (p, f) => {
      fade(beams, 0.5 + Math.sin(p * Math.PI) * 0.5)
      tf(motes, `translate(${r1(Math.sin(p * 5) * 30)} ${r1(-p * 160)})`)
      tf(sand, `translate(0 ${r1(p * 700)})`)
      const sweep = sweepOf(f, count)
      fade(guard, Math.sin(sweep * Math.PI))
      tf(guard, `translate(${r1(lerp(720, 880, sweep))} 0)`)
      rings.forEach(({ each, node, line }, i) => {
        const turned = turnOf(f, i)
        tf(node, `rotate(${r1(each.from * (1 - turned))})`)
        line?.setAttribute('stroke', turned >= 1 ? TOMB.glyph : TOMB.ring)
      })
      const open = openOf(f, count)
      tf(door, doorTransform(open))
      fade(vaultLight, open)
      rope?.setAttribute('height', String(r1(Math.max(0, (p < ENTRY ? ropeY(p) : FLOOR_Y) - ROOF_Y - 60 + 40))))
      setPose(j, heistPose(p, f, count))
    }
  },
}
