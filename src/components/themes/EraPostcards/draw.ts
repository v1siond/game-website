import { mulberry32 } from '@/lib/random/seeded'

// Drawing primitives for the era pictures. Every picture is a stack of SVG layers on one 1600 by 1000
// canvas anchored to its bottom centre (xMidYMax slice), so a phone, which sees about x 570 to 1030, and a
// desktop crop the same art. Each returns markup as a string: the pictures are built once from code and
// numbers (no CV text goes into them), the same on the server and in the browser, and the scroll engine
// only writes transforms and opacity on the nodes they mark with data-fx and data-j.

export const W = 1600
export const H = 1000

/** One decimal, so the server and the browser print the same numbers. */
export const r1 = (n: number): number => Math.round(n * 10) / 10

export const svg = (content: string): string =>
  `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">${content}</svg>`

type Stop = readonly [offset: number, color: string, opacity?: number]

const stopsOf = (stops: readonly Stop[]): string =>
  stops.map(([offset, color, opacity = 1]) => `<stop offset="${offset}" stop-color="${color}" stop-opacity="${opacity}"/>`).join('')

export const linear = (id: string, stops: readonly Stop[], [x1, y1, x2, y2]: readonly number[] = [0, 0, 0, 1]): string =>
  `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stopsOf(stops)}</linearGradient>`

export const radial = (id: string, stops: readonly Stop[]): string => `<radialGradient id="${id}">${stopsOf(stops)}</radialGradient>`

export const defs = (...items: string[]): string => `<defs>${items.join('')}</defs>`

/** A band across the whole canvas and its overscan. */
export const rect = (fill: string, y = 0, h = H): string => `<rect x="-200" y="${y}" width="${W + 400}" height="${h}" fill="${fill}"/>`

/** A soft light: a circle filled with a radial gradient fading to nothing. */
export const glow = (id: string, cx: number, cy: number, r: number, color: string, opacity = 0.8): string =>
  `${defs(radial(id, [[0, color, opacity], [0.4, color, opacity * 0.35], [1, color, 0]]))}<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id})"/>`

interface Ridge {
  y: number
  amp: number
  fill: string
  step?: number
  sharp?: number
  opacity?: number
}

/** A mountain or dune line: a sum of three sine waves with seeded phases, closed to the bottom. */
export function ridge(seed: number, { y, amp, fill, step = 16, sharp = 0, opacity = 1 }: Ridge): string {
  const random = mulberry32(seed)
  const waves = [0, 1, 2].map((i) => ({ f: (0.002 + random() * 0.004) * (i + 1), p: random() * 6.28, a: amp / (i + 1.4) }))
  const points: string[] = []
  for (let x = -200; x <= W + 200; x += step) {
    const wave = waves.reduce((sum, { f, p, a }) => sum + Math.sin(x * f + p) * a, 0)
    const jag = sharp ? (random() - 0.5) * sharp : 0
    points.push(`${x},${r1(y - wave + jag)}`)
  }
  return `<path d="M-200,${H + 50} L${points.join(' L')} L${W + 200},${H + 50} Z" fill="${fill}" opacity="${opacity}"/>`
}

export function stars(seed: number, count: number, yMax: number, color: string): string {
  const random = mulberry32(seed)
  return Array.from({ length: count }, () => {
    const r = random() < 0.12 ? 2.2 : 0.6 + random() * 1.1
    return `<circle cx="${r1(random() * W)}" cy="${r1(random() * yMax)}" r="${r1(r)}" fill="${color}" opacity="${r1(0.35 + random() * 0.65)}"/>`
  }).join('')
}

/** A bank of soft clouds: overlapping ellipses in one colour. */
export function clouds(seed: number, count: number, [yMin, yMax]: readonly [number, number], color: string, opacity = 0.5): string {
  const random = mulberry32(seed)
  return Array.from({ length: count }, () => {
    const cx = random() * (W + 200) - 100
    const cy = yMin + random() * (yMax - yMin)
    const w = 120 + random() * 260
    const puffs = Array.from(
      { length: 4 },
      (_, i) => `<ellipse cx="${r1(cx + (i - 1.5) * w * 0.28)}" cy="${r1(cy - (i % 2) * 10)}" rx="${r1(w * 0.32)}" ry="${r1(14 + random() * 16)}"/>`,
    ).join('')
    return `<g fill="${color}" opacity="${r1(opacity * (0.5 + random() * 0.5))}">${puffs}</g>`
  }).join('')
}

interface Skyline {
  base: number
  hMin: number
  hMax: number
  wMin?: number
  wMax?: number
  fill: string
  lit: string
  density: number
  spires: number
}

/** City blocks with lit windows across the canvas, the window colour and density per era. */
export function skyline(seed: number, { base, hMin, hMax, wMin = 40, wMax = 110, fill, lit, density, spires }: Skyline): string {
  const random = mulberry32(seed)
  const parts: string[] = []
  let x = -200
  while (x < W + 200) {
    const w = wMin + random() * (wMax - wMin)
    const top = base - (hMin + random() * (hMax - hMin))
    parts.push(`<rect x="${r1(x)}" y="${r1(top)}" width="${r1(w)}" height="${r1(base - top + 60)}" fill="${fill}"/>`)
    if (random() < spires) parts.push(`<rect x="${r1(x + w / 2 - 2)}" y="${r1(top - 50)}" width="4" height="50" fill="${fill}"/>`)
    for (let wy = top + 12; wy < base - 10; wy += 16) {
      for (let wx = x + 7; wx < x + w - 9; wx += 13) {
        if (random() < density) parts.push(`<rect x="${r1(wx)}" y="${r1(wy)}" width="5" height="7" fill="${lit}" opacity="${r1(0.5 + random() * 0.5)}"/>`)
      }
    }
    x += w + random() * 8
  }
  return parts.join('')
}

/** A retro sun: a disc cut by horizontal gaps that widen towards the horizon. */
export function stripedSun(id: string, cx: number, cy: number, r: number, colors: readonly Stop[]): string {
  const bands: string[] = []
  let top = cy - r
  for (let i = 0; i < 7; i++) {
    const gapAt = cy + i * (r / 7) + 4
    bands.push(`<rect x="${cx - r}" y="${r1(top)}" width="${r * 2}" height="${r1(gapAt - top)}"/>`)
    top = gapAt + 2 + i * 2.2
  }
  bands.push(`<rect x="${cx - r}" y="${r1(top)}" width="${r * 2}" height="${r1(cy + r - top)}"/>`)
  return `${defs(linear(`${id}-g`, colors), `<clipPath id="${id}-c">${bands.join('')}</clipPath>`)}<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id}-g)" clip-path="url(#${id}-c)"/>`
}

/** A fern or palm frond fan, for the prehistoric and jungle foregrounds. */
export function frond(x: number, y: number, size: number, angle: number, fill: string): string {
  const leaves = Array.from({ length: 9 }, (_, i) => {
    const t = i / 8
    const lx = r1(size * t)
    const ly = r1(-Math.sin(t * Math.PI) * size * 0.18)
    const len = r1(size * 0.36 * (1 - t * 0.7))
    return `<path d="M${lx},${ly} q${r1(len * 0.4)},${r1(-len * 0.9)} ${len},${r1(-len * 0.5)} q${r1(-len * 0.6)},${r1(len * 0.2)} ${-len},${r1(len * 0.5)} Z M${lx},${ly} q${r1(len * 0.4)},${r1(len * 0.9)} ${len},${r1(len * 0.5)} q${r1(-len * 0.6)},${r1(-len * 0.2)} ${-len},${r1(-len * 0.5)} Z"/>`
  }).join('')
  return `<g transform="translate(${x} ${y}) rotate(${angle})" fill="${fill}"><path d="M0,0 Q${size / 2},${-size * 0.2} ${size},0" stroke="${fill}" stroke-width="5" fill="none"/>${leaves}</g>`
}

/** Item positions spread evenly inside the band a phone still sees (about x 570 to 1030). */
export const spread = (count: number, from = 590, to = 1010): number[] =>
  Array.from({ length: count }, (_, i) => (count === 1 ? (from + to) / 2 : from + ((to - from) * i) / (count - 1)))

// The node finders and lerp every theatre writer shares (one owner, shared/stageNodes).
export { fx, fxAll, lerp } from '../shared/stageNodes'

export const tf = (node: Element | null, value: string): void => node?.setAttribute('transform', value)

export const fade = (node: Element | null, value: number): void => node?.setAttribute('opacity', value.toFixed(3))
