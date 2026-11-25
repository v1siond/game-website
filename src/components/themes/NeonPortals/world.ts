import { clamp01 } from '@/lib/scroll/progress'
import type { Era } from './palette'
import { HUB_ERA, type RoomId } from './plan'

// The corridor: the time machine's passage between eras, one tunnel along z, seen head on from a camera at
// camZ. Every plane (a rib, a gate, a turning decor ring) sits at a fixed world position, and its screen scale is focal / depth, so
// far planes are small at the vanishing point and grow as the camera comes. Planes far away fade up out of
// the dark and planes passing the camera grow and fade. The planes are laid out far first, so the DOM order
// is the depth order and no z-index ever changes. Nothing here touches the DOM: the stage (corridor.tsx)
// measures the page, and these functions turn a scroll position into what each plane shows.

export const FOCAL = 500
export const FLOOR = 420
export const TH = 1500
/** The runner's depth in front of the camera. */
export const DF = 520
/** Card to card along the room: the camera's travel while one card scrolls by. */
export const STEP = 330

const LEAD = 700 // gate to the first card's mark
const TAIL = 620 // the last card's mark to the room's end
const GAP = 2000 // a room's end to the next gate: the dark between eras
const HUB_RING = 1250
const RIB = 420
const FAR = 6200
const FAR_FULL = 4300
const CY = FLOOR - TH / 2 // the tunnel's centre line

export type PlaneKind = 'rib' | 'gate' | 'decor'

// Raster scale per kind: a plane is laid out at world size x RASTER and scaled by 1 / RASTER on top, so a
// huge gate is rasterised at a size the GPU keeps cheaply.
export const RASTER: Record<PlaneKind, number> = { rib: 0.35, gate: 0.3, decor: 0.35 }

// Where each kind fades as it nears the camera: gone at the first depth, whole at the second.
const NEAR: Record<PlaneKind, readonly [number, number]> = {
  rib: [60, 300],
  gate: [130, 560],
  decor: [160, 600],
}

export interface RoomSpec {
  id: RoomId
  era: Era
  /** How many cards the room's section shows. */
  items: number
}

export interface Plane {
  key: string
  kind: PlaneKind
  era: Era
  x: number
  y: number
  z: number
  anchor: 'center' | 'bottom'
  /** The plane's own opacity share: the approach ribs in the dark are dimmer. */
  dim: number
  /** Degrees per world unit of camera travel (a decor ring turning with the scroll). */
  spin: number
  /** Degrees a decor sways either way as the camera travels. */
  sway: number
}

/** Where the camera stands while a card is on the reading line. */
export interface ItemSpot {
  z: number
}

export interface RoomGeometry {
  id: RoomId
  era: Era
  gate: number
  items: ItemSpot[]
  /** The room's far end, where its set piece hands back to the passage. */
  vista: number
  /** Where the room before ended: the hub ring or its far end. */
  from: number
}

export interface Corridor {
  planes: Plane[]
  rooms: RoomGeometry[]
  /** The tunnel's width in world units. */
  tw: number
}

/** A decor's place and turn per era; its art is in eras.tsx. */
export const DECOR: Partial<Record<Era, { y: number; spin: number; sway: number }>> = {
  hub: { y: CY, spin: 0.06, sway: 0 },
  village: { y: CY, spin: 0.03, sway: 0 },
  trial: { y: -TH * 0.125, spin: -0.05, sway: 0 },
  sky: { y: FLOOR - TH * 0.42, spin: 0, sway: 18 },
  saved: { y: CY, spin: 0.04, sway: 0 },
}

const plane = (kind: PlaneKind, era: Era, z: number, key: string, extra: Partial<Plane> = {}): Plane => ({
  key,
  kind,
  era,
  x: 0,
  y: CY,
  z,
  anchor: 'center',
  dim: 1,
  spin: 0,
  sway: 0,
  ...extra,
})

const decorPlane = (era: Era, z: number): Plane[] => {
  const decor = DECOR[era]
  if (!decor) return []
  return [plane('decor', era, z, `decor-${era}`, decor)]
}

const ribs = (era: Era, from: number, to: number, dim: number, key: string): Plane[] => {
  const planes: Plane[] = []
  for (let z = from; z < to; z += RIB) planes.push(plane('rib', era, z, `${key}-${z}`, { dim }))
  return planes
}

/**
 * Lays the corridor out along z: the hub, then per room its dark approach ribs, its gate, its ribs, one mark
 * per card where the camera stands while that card is read, and its decor at the far end.
 */
export function layoutCorridor(specs: readonly RoomSpec[], phone: boolean): Corridor {
  const tw = phone ? 1150 : 2400
  const planes: Plane[] = [plane('gate', HUB_ERA, HUB_RING, 'hub-gate'), ...decorPlane(HUB_ERA, HUB_RING - 12), ...ribs(HUB_ERA, RIB, HUB_RING, 1, 'hub-rib')]
  const rooms: RoomGeometry[] = []

  specs.reduce((behind, spec) => {
    const gate = behind + GAP
    planes.push(...ribs(spec.era, behind + RIB, gate - RIB / 2, 0.4, `${spec.id}-dark`), plane('gate', spec.era, gate, `${spec.id}-gate`))
    const items = Array.from({ length: Math.max(1, spec.items) }, (_, i): ItemSpot => ({ z: gate + LEAD + i * STEP }))
    const vista = items[items.length - 1].z + TAIL
    planes.push(...ribs(spec.era, gate + RIB / 2, vista, 1, `${spec.id}-rib`), ...decorPlane(spec.era, vista - 14))
    rooms.push({ id: spec.id, era: spec.era, gate, items, vista, from: behind })
    return vista
  }, HUB_RING)

  return { planes: planes.sort((a, b) => b.z - a.z), rooms, tw }
}

export const smooth = (a: number, b: number, v: number): number => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

export const round2 = (n: number): number => Math.round(n * 100) / 100

// ---- the camera path ----

/** Scroll position paired with camera depth. */
export type Keyframe = readonly [number, number]

/** Where a room's parts sit on the page, in document pixels. */
export interface RoomMarks {
  top: number
  transitEnd: number
  gateTop: number
  gateBottom: number
  /** Each card's centre. */
  items: number[]
  bottom: number
}

export interface PageMarks {
  heroHeight: number
  /** How far down the screen a card's centre is read (the reading line), in pixels. */
  reading: number
  maxScroll: number
}

/** The depth the camera leaves a room at: just past its last card's mark. */
const leaveDepth = (room: RoomGeometry): number => room.items[room.items.length - 1].z - DF + 230

/**
 * The camera path from the page's marks: each card's centre on the reading line holds the camera at its
 * mark, the gate holds framed then flies through, and the last room ends at the page's end,
 * flying into the saved's light. `roomTops` are where each room is read from (the settled frames).
 */
export function cameraPath(corridor: Corridor, marks: readonly RoomMarks[], page: PageMarks): { keyframes: Keyframe[]; roomTops: number[] } {
  const at = (pos: number) => pos - page.reading
  const frames: Keyframe[] = [
    [0, 0],
    [page.heroHeight * 0.25, 300],
  ]
  const lastIndex = corridor.rooms.length - 1
  corridor.rooms.forEach((room, r) => {
    const mark = marks[r]
    frames.push([at(mark.top), r === 0 ? 700 : leaveDepth(corridor.rooms[r - 1])])
    frames.push([at(mark.gateTop), room.gate - 950])
    frames.push([at(mark.gateBottom), room.gate + 80])
    mark.items.forEach((centre, i) => frames.push([at(centre), room.items[i].z - DF]))
    const leave: Keyframe = r === lastIndex ? [Math.min(at(mark.bottom), page.maxScroll), room.vista - 760] : [at(mark.bottom), leaveDepth(room)]
    frames.push(leave)
  })
  // Keep the path strictly increasing in scroll, so every segment has a length.
  const keyframes = frames.reduce<Keyframe[]>((kept, frame) => {
    const prev = kept[kept.length - 1]
    if (!prev || frame[0] > prev[0]) kept.push(frame)
    return kept
  }, [])
  return { keyframes, roomTops: marks.map((mark) => at(mark.transitEnd)) }
}

/** The camera's depth at a scroll position, eased per segment so it settles at each keyframe. */
export function camAt(keyframes: readonly Keyframe[], y: number): number {
  if (y <= keyframes[0][0]) return keyframes[0][1]
  const last = keyframes[keyframes.length - 1]
  if (y >= last[0]) return last[1]
  let lo = 0
  let hi = keyframes.length - 1
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1
    if (keyframes[mid][0] <= y) lo = mid
    if (keyframes[mid][0] > y) hi = mid
  }
  const [y0, z0] = keyframes[lo]
  const [y1, z1] = keyframes[hi]
  return z0 + (z1 - z0) * smooth(0, 1, (y - y0) / (y1 - y0))
}

/** Reduced motion: the settled frame of the room being read, just inside its gate; the hub above it. */
export function settledCam(corridor: Corridor, roomTops: readonly number[], y: number): number {
  const index = roomTops.findLastIndex((top) => y >= top)
  if (index < 0) return 0
  return corridor.rooms[index].gate + 260
}

// ---- the dip to dark between eras ----

const DIP_IN = [-250, 250] as const // around the end of the room left behind
const DIP_OUT = [-1500, -1050] as const // before the next gate

/** The depth where a room's colours take over: the darkest point of the gap before its gate. */
export const eraSwitchAt = (room: RoomGeometry): number => room.from + (DIP_IN[1] + GAP + DIP_OUT[0]) / 2

/** How dark the tunnel is at camZ: it dips past the end of a room, stays dark across the gap, and lifts before
 *  the next gate is framed, so the next era comes up out of the dark. */
export function troughAt(rooms: readonly RoomGeometry[], camZ: number): number {
  return rooms.reduce((dark, room) => {
    const rise = smooth(room.from + DIP_IN[0], room.from + DIP_IN[1], camZ)
    const fall = 1 - smooth(room.gate + DIP_OUT[0], room.gate + DIP_OUT[1], camZ)
    return Math.max(dark, Math.min(rise, fall))
  }, 0)
}

/** The room the camera is in: past the darkest point of the gap before its gate; null in the hub. */
export const roomAt = (rooms: readonly RoomGeometry[], camZ: number): RoomGeometry | null =>
  rooms.findLast((room) => camZ >= eraSwitchAt(room)) ?? null

// ---- placing a plane on screen ----

export interface View {
  vw: number
  vh: number
  /** The vanishing point. */
  vpx: number
  vpy: number
  /** Screen pixels per world unit at the focal depth, over FOCAL. */
  unit: number
}

// The engine's phone line (useScrollStage): under 768 px wide.
const PHONE_MAX = 768

/** The screen's view: a phone centres the vanishing point, a desktop moves it right of the text column. */
export function viewOf(vw: number, vh: number): View & { phone: boolean } {
  const phone = vw < PHONE_MAX
  return { vw, vh, phone, vpx: vw * (phone ? 0.5 : 0.64), vpy: vh * (phone ? 0.4 : 0.42), unit: vh / 1000 }
}

/** The screen scale of a world point at depth d. */
export const scaleAt = (view: View, d: number): number => (view.unit * FOCAL) / d

/** The transform of an element laid out at world size x raster for a world point at depth d. */
export const placeAt = (view: View, x: number, y: number, d: number, raster: number, anchor: Plane['anchor']): string => {
  const s = scaleAt(view, d)
  const ty = anchor === 'bottom' ? '-100%' : '-50%'
  return `translate3d(${round2(view.vpx + x * s)}px, ${round2(view.vpy + y * s)}px, 0) scale(${Math.round((s / raster) * 1000) / 1000}) translate(-50%, ${ty})`
}

const turnOf = (plane: Plane, camZ: number): string => {
  if (plane.spin) return ` rotate(${round2(camZ * plane.spin)}deg)`
  if (plane.sway) return ` rotate(${round2(Math.sin(camZ / 260) * plane.sway)}deg)`
  return ''
}

/** A plane's transform and opacity for this camera; opacity 0 when it is behind the camera or too far. */
export function planeView(plane: Plane, view: View, camZ: number): { transform: string; opacity: number } {
  const d = plane.z - camZ
  const [gone, whole] = NEAR[plane.kind]
  if (d < gone || d > FAR) return { transform: '', opacity: 0 }
  const fade = clamp01((FAR - d) / (FAR - FAR_FULL)) * clamp01((d - gone) / (whole - gone)) * plane.dim
  return { transform: placeAt(view, plane.x, plane.y, d, RASTER[plane.kind], plane.anchor) + turnOf(plane, camZ), opacity: round2(fade) }
}

// ---- the warp sparks: fixed points in world space the camera flies through, so they stream outward ----

const SPARKS = 44
const SPARK_SPAN = 2600

export interface Spark {
  x: number
  y: number
  z0: number
  angle: number
}

/** A seeded random, so every star, window and spark lands in the same place on every load. */
export function seeded(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }
}

export function sparksFor(tw: number): Spark[] {
  const rand = seeded(97)
  return Array.from({ length: SPARKS }, () => {
    const x = (rand() - 0.5) * tw * 0.9
    const y = CY + (rand() - 0.5) * TH * 0.9
    return { x, y, z0: rand() * SPARK_SPAN, angle: (Math.atan2(y, x) * 180) / Math.PI }
  })
}

/** A spark's transform and opacity: brighter and longer in the dark between eras, the warp. */
export function sparkView(spark: Spark, view: View, camZ: number, trough: number): { transform: string; opacity: number } {
  const d = ((((spark.z0 - camZ) % SPARK_SPAN) + SPARK_SPAN) % SPARK_SPAN) + 40
  const s = scaleAt(view, d)
  const fade = clamp01((SPARK_SPAN - d) / 900) * clamp01((d - 40) / 160) * (0.25 + 0.75 * trough)
  const stretch = 1 + Math.min(14, (900 / d) * (0.4 + trough))
  return {
    transform: `translate3d(${round2(view.vpx + spark.x * s)}px, ${round2(view.vpy + spark.y * s)}px, 0) rotate(${round2(spark.angle)}deg) scale(${round2(stretch * s * 2.2)}, ${round2(s * 2.2)})`,
    opacity: round2(fade),
  }
}

/** The static floor and wall rails: lines from the vanishing point through the tunnel's corners. */
export function railsPath(view: View, tw: number): string {
  const corners = [
    [-tw / 2, FLOOR],
    [tw / 2, FLOOR],
    [-tw / 4, FLOOR],
    [tw / 4, FLOOR],
    [0, FLOOR],
    [-tw / 2, FLOOR - TH],
    [tw / 2, FLOOR - TH],
  ]
  const reach = Math.hypot(view.vw, view.vh) * 2
  return corners
    .map(([x, y]) => {
      const len = Math.hypot(x, y)
      return `M ${round2(view.vpx)} ${round2(view.vpy)} L ${round2(view.vpx + (x / len) * reach)} ${round2(view.vpy + (y / len) * reach)}`
    })
    .join(' ')
}
