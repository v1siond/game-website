import type { Playhead } from '@/lib/scroll/player'
import { mulberry32 } from '@/lib/random/seeded'
import { TOMB, TOMB_DEPTH } from '../palette'
import { defs, fade, fx, glow, lerp, linear, radial, rect, r1, svg, tf } from '../draw'
import { courier, joints, setPose, type Pose } from '../courier'
import { END, share, type Era } from './era'

// Tech: the sun tomb. A hall of columns towards a lit door; dust rises, sand falls with the scroll. He stands
// in the hall with a torch and plays two actions: he raises it to the glyph tablet on the wall beside him
// and its glyphs wake, then the light runs on down the hall, column by column from the nearest to the
// farthest, and the sun door's beams flare while he lowers the torch and looks down the hall.

/** The torch in his front hand: the stick and its flame, held out along his forearm beyond the hand. */
const torch = `<g transform="translate(0 30) rotate(175)"><rect x="-3" y="-46" width="6" height="56" rx="2" fill="${TOMB.stick}"/>
  <path d="M0,-80 q14,16 8,30 q-8,6 -16,0 q-6,-14 8,-30 Z" fill="${TOMB.flame}"/><path d="M0,-66 q6,8 3,14 q-3,3 -6,0 q-2,-7 3,-14 Z" fill="${TOMB.flameCore}"/></g>`

const bandOf = (base: number, h: number): { y: number; height: number } => ({ y: base - h + 30, height: r1(Math.max(8, h * 0.06)) })

const column = (x: number, base: number, h: number, w: number, fill: string, band: string): string => {
  const { y, height } = bandOf(base, h)
  return `<g><rect x="${x - w / 2}" y="${base - h}" width="${w}" height="${h}" fill="${fill}"/>
  <rect x="${x - w / 2 - 6}" y="${base - h - 14}" width="${w + 12}" height="16" fill="${fill}"/><rect x="${x - w / 2}" y="${y}" width="${w}" height="${height}" fill="${band}"/>
  <rect x="${x - w / 2}" y="${r1(base - h * 0.45)}" width="${w}" height="${r1(Math.max(6, h * 0.04))}" fill="${band}" opacity="0.7"/></g>`
}

// The hall's far columns, a pair per depth step, nearest first.
const DEPTHS = [0, 1, 2, 3]
const backColumn = (d: number, side: number) => ({ x: 800 + side * (140 + d * 70), base: 700 + d * 22, h: 240 + d * 50, w: 34 + d * 10 })

// The glyph light on a pair of columns' bands.
const bandLight = (d: number): string =>
  `<g data-fx="band-${d}" opacity="0">${[-1, 1]
    .map((side) => {
      const { x, base, h, w } = backColumn(d, side)
      const { y, height } = bandOf(base, h)
      return `<rect x="${x - w / 2}" y="${y}" width="${w}" height="${height}" fill="${TOMB.glyph}"/>`
    })
    .join('')}</g>`

const glyphs = (seed: number): string => {
  const random = mulberry32(seed)
  return Array.from({ length: 5 }, (_, k) => {
    const y = -70 + k * 14
    const kind = Math.floor(random() * 4)
    const shapes = [`<circle cx="${r1(-10 + random() * 20)}" cy="${y}" r="5"/>`, `<path d="M-10,${y + 5} l10,-10 l10,10 Z"/>`, `<path d="M-12,${y} h24 M0,${y - 5} v10"/>`, `<path d="M-12,${y + 4} q12,-12 24,0"/>`]
    return shapes[kind]
  }).join('')
}

const STAND_X = 880
const FLOOR_Y = 905
const TABLET = { x: 1020, y: 700 } as const

// The glyph tablet on the wall beside him, its glyphs dim until the torch wakes them. It is drawn on his layer,
// behind him, so it keeps its place at his torch when his era moves to its side (scenes.ts SHIFT).
const TABLET_ART = `<g transform="translate(${TABLET.x} ${TABLET.y}) scale(1.3)">
  <g data-fx="tglow" opacity="0">${defs(radial('tc-g', [[0, TOMB.glyph, 0.8], [1, TOMB.glyph, 0]]))}<circle cy="-40" r="90" fill="url(#tc-g)"/></g>
  <rect x="-28" y="-86" width="56" height="92" rx="6" fill="${TOMB.tablet}" stroke="${TOMB.goldDim}" stroke-width="3"/>
  <g data-fx="glyphs" stroke="${TOMB.glyph}" fill="none" stroke-width="3" opacity="0.2">${glyphs(41)}</g></g>`

const AT = { x: STAND_X, y: FLOOR_Y, scale: 1.2 } as const
const HOLD: Partial<Pose> = { ...AT, shF: 50, elF: 50, shB: -10, elB: 12, head: 0 }
const RAISED: Partial<Pose> = { ...AT, shF: 132, elF: 10, shB: -6, elB: 14, head: -12, lean: 4 }
const DOWN_HALL: Partial<Pose> = { ...AT, shF: 110, elF: 24, shB: -12, elB: 10, head: 6, lean: -4 }

const KEYS = ['shF', 'elF', 'shB', 'elB', 'head', 'lean'] as const

const blend = (from: Partial<Pose>, to: Partial<Pose>, t: number): Partial<Pose> => ({
  ...AT,
  ...Object.fromEntries(KEYS.map((key) => [key, lerp(from[key] ?? 0, to[key] ?? 0, t)])),
})

const torchPose = (play: Playhead): Partial<Pose> => (play.action === 0 ? blend(HOLD, RAISED, play.t) : blend(RAISED, DOWN_HALL, share(play, 1)))

/** How lit the band at depth d is when the light has run `t` down the hall. */
const bandLit = (t: number, d: number): number => Math.min(1, Math.max(0, t * 5 - d * 1.1))

export const tomb: Era = {
  place: STAND_X,
  script: [1800, 2400],
  build: () => {
    const back = [3, 2, 1, 0]
      .map((d) =>
        [-1, 1]
          .map((side) => {
            const { x, base, h, w } = backColumn(d, side)
            return column(x, base, h, w, TOMB_DEPTH[d], TOMB.gold)
          })
          .join(''),
      )
      .join('')
    const floorLines = Array.from({ length: 11 }, (_, i) => `<path d="M800,600 L${-400 + i * 240},1000" stroke="${TOMB.floorLine}" stroke-width="2"/>`).join('')
    return {
      sky: svg(`${defs(linear('tc-wall', [[0, TOMB.wallTop], [1, TOMB.wallBottom]]), linear('tc-door', [[0, TOMB.door], [1, TOMB.doorWarm]]), linear('tc-beam', [[0, TOMB.beam, 0.55], [1, TOMB.beam, 0]]))}${rect('url(#tc-wall)')}
        ${glow('tc-door-g', 800, 520, 360, TOMB.doorGlow, 0.75)}<path d="M740,600 L740,420 Q800,380 860,420 L860,600 Z" fill="url(#tc-door)"/>
        <g data-fx="beams" opacity="0.4"><path d="M760,430 L380,1000 L560,1000 L800,430 Z" fill="url(#tc-beam)"/><path d="M820,430 L1220,1000 L1060,1000 L840,430 Z" fill="url(#tc-beam)"/></g>`),
      far: svg(`<path d="M-200,1000 L800,600 L1800,1000 Z" fill="${TOMB.floor}"/>${floorLines}${back}${DEPTHS.map(bandLight).join('')}<rect x="-200" y="160" width="2000" height="40" fill="${TOMB.lintel}"/><rect x="-200" y="198" width="2000" height="6" fill="${TOMB.gold}"/>`),
      mid: svg(`${[-1, 1].map((side) => column(800 + side * 560, 1000, 760, 120, TOMB.columnNear, TOMB.goldBright) + column(800 + side * 430, 900, 520, 74, TOMB.columnMid, TOMB.goldDim)).join('')}`),
      near: svg(`<g data-fx="motes" fill="${TOMB.mote}">${Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 137) % 1600}" cy="${(i * 263) % 1000}" r="${1 + (i % 3)}" opacity="${r1(0.3 + (i % 4) * 0.15)}"/>`).join('')}</g>`),
      figure: svg(`${TABLET_ART}<g transform="translate(${STAND_X + 30} ${FLOOR_Y})">${glow('tc-torch', 0, -150, 260, TOMB.torchGlow, 0.55)}</g>${courier(torchPose(END), { held: torch })}`),
      fg: svg(`<rect x="-200" y="-20" width="400" height="1040" fill="${TOMB.frame}"/><rect x="190" y="-20" width="14" height="1040" fill="${TOMB.goldBright}"/>
        <rect x="1400" y="-20" width="400" height="1040" fill="${TOMB.frame}"/><rect x="1396" y="-20" width="14" height="1040" fill="${TOMB.goldBright}"/>
        <g data-fx="sand" fill="${TOMB.sand}" opacity="0.6"><rect x="520" y="-600" width="3" height="700"/><rect x="1090" y="-800" width="2" height="900"/><rect x="300" y="-500" width="2" height="600"/></g>`),
    }
  },
  bind: (stage) => {
    const j = joints(stage)
    const bands = DEPTHS.map((d) => fx(stage, `band-${d}`))
    const [beams, motes, sand, tabletGlow, marks] = ['beams', 'motes', 'sand', 'tglow', 'glyphs'].map((name) => fx(stage, name))
    return (p, play) => {
      const woke = share(play, 0)
      const ran = share(play, 1)
      tf(motes, `translate(${r1(Math.sin(p * 5) * 30)} ${r1(-p * 160)})`)
      tf(sand, `translate(0 ${r1(p * 700)})`)
      fade(tabletGlow, Math.max(0, woke * 1.6 - 0.6))
      fade(marks, 0.2 + 0.8 * Math.max(0, woke * 1.6 - 0.6))
      bands.forEach((band, d) => fade(band, bandLit(ran, d)))
      fade(beams, 0.4 + 0.6 * Math.max(0, ran * 2 - 1))
      setPose(j, torchPose(play))
    }
  },
}
