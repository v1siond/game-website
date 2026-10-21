// The geometry of every dotted trail on the expedition maps, as plain numbers so the drawing, the dots and
// the walk all read one shape. A trail is a smooth curve through its stops (Catmull-Rom turned into cubic
// Beziers), flattened once into a polyline with its running length, so a point at any distance along it
// is a lookup and a lerp, and the dots sit at even steps like the dotted paths of an overworld map.

export type Point = readonly [number, number]

export interface Trail {
  /** The SVG path through the stops. */
  d: string
  /** Total length in map units. */
  length: number
  /** Distance along the trail of each stop, in stop order. */
  stops: number[]
  samples: Point[]
  cumulative: number[]
}

export interface TrailDot {
  x: number
  y: number
  /** Where the dot sits along the trail, 0 at the first stop and 1 at the last. */
  at: number
}

const SAMPLES_PER_CURVE = 24

type Curve = readonly [Point, Point, Point, Point]

const round = (value: number): number => Math.round(value * 100) / 100

// Catmull-Rom through p1 and p2 (with the neighbours p0 and p3) as one cubic Bezier.
function curveBetween(p0: Point, p1: Point, p2: Point, p3: Point): Curve {
  return [
    p1,
    [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6],
    [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6],
    p2,
  ]
}

function curvesThrough(points: readonly Point[]): Curve[] {
  const at = (index: number): Point => points[Math.min(Math.max(index, 0), points.length - 1)]
  return points.slice(0, -1).map((point, index) => curveBetween(at(index - 1), point, at(index + 1), at(index + 2)))
}

function bezierPoint([a, b, c, d]: Curve, t: number): Point {
  const u = 1 - t
  const w = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t]
  return [w[0] * a[0] + w[1] * b[0] + w[2] * c[0] + w[3] * d[0], w[0] * a[1] + w[1] * b[1] + w[2] * c[1] + w[3] * d[1]]
}

const distance = (a: Point, b: Point): number => Math.hypot(b[0] - a[0], b[1] - a[1])

const pathData = (curves: Curve[]): string =>
  curves.reduce(
    (d, [, c1, c2, end]) => `${d} C${round(c1[0])} ${round(c1[1])} ${round(c2[0])} ${round(c2[1])} ${round(end[0])} ${round(end[1])}`,
    `M${round(curves[0][0][0])} ${round(curves[0][0][1])}`,
  )

/** The trail through `points` (two or more), in the map's own units. */
export function buildTrail(points: readonly Point[]): Trail {
  if (points.length < 2) throw new Error('A trail needs two or more stops')

  const curves = curvesThrough(points)
  const samples: Point[] = [points[0]]
  const cumulative = [0]
  const stops = [0]

  curves.forEach((curve) => {
    for (let step = 1; step <= SAMPLES_PER_CURVE; step += 1) {
      const next = bezierPoint(curve, step / SAMPLES_PER_CURVE)
      cumulative.push(cumulative[cumulative.length - 1] + distance(samples[samples.length - 1], next))
      samples.push(next)
    }
    stops.push(cumulative[cumulative.length - 1])
  })

  return { d: pathData(curves), length: cumulative[cumulative.length - 1], stops, samples, cumulative }
}

/** The point `along` map units from the trail's first stop, clamped to its ends. */
export function pointAt(trail: Trail, along: number): Point {
  const { samples, cumulative, length } = trail
  if (along <= 0) return samples[0]
  if (along >= length) return samples[samples.length - 1]

  let low = 0
  let high = cumulative.length - 1
  while (high - low > 1) {
    const middle = (low + high) >> 1
    if (cumulative[middle] <= along) low = middle
    else high = middle
  }
  const span = cumulative[high] - cumulative[low]
  const t = span === 0 ? 0 : (along - cumulative[low]) / span
  return [samples[low][0] + (samples[high][0] - samples[low][0]) * t, samples[low][1] + (samples[high][1] - samples[low][1]) * t]
}

/** Dots every `spacing` map units, the first one step after the start so a stop's tile is never covered. */
export function dotsAlong(trail: Trail, spacing: number): TrailDot[] {
  const count = Math.max(Math.floor(trail.length / spacing), 1)
  const step = trail.length / count
  return Array.from({ length: count - 1 }, (_, index) => {
    const along = step * (index + 1)
    const [x, y] = pointAt(trail, along)
    return { x: round(x), y: round(y), at: round(along / trail.length) }
  })
}

/** Where each stop sits along the trail, 0 to 1. */
export const stopShares = (trail: Trail): number[] => trail.stops.map((stop) => stop / trail.length)

/** A point in map units as a share of the map's box, for an HTML layer laid over the SVG. */
export const shareOf = ([x, y]: Point, width: number, height: number): Point => [(x / width) * 100, (y / height) * 100]
