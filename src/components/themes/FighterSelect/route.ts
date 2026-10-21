// The flight across the select screen's world map between his jobs: each job's town as a pin on the
// map (WorldMap's 400 x 160 coordinates), read from the job's own location line in any language by
// the place names the three locales share, and the heading the plane turns to on the way there.

export type Pin = readonly [number, number]

// Ordered: the first place named in the line wins, a line naming no known place lands in the States.
const PLACES: readonly (readonly [RegExp, Pin])[] = [
  [/venezuela/i, [104, 98]],
  [/miami/i, [104, 66]],
  [/florida/i, [99, 62]],
]

const UNITED_STATES: Pin = [80, 48]

export const pinFor = (location: string): Pin => PLACES.find(([place]) => place.test(location))?.[1] ?? UNITED_STATES

// Degrees clockwise from east, the way an SVG rotate reads, for the plane flying from one pin to the next.
export function headingTo(from: Pin, to: Pin): number {
  if (from[0] === to[0] && from[1] === to[1]) return 0
  return Math.round((Math.atan2(to[1] - from[1], to[0] - from[0]) * 180) / Math.PI)
}
