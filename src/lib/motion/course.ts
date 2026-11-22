// A figure's course as data, for the worlds whose figure runs legs one after another across its stage
// (Adventure Paths' course.ts, Neon Portals' choreography.ts): where he starts, the legs, each ending at a
// spot, and the rules that read them. Each world adds its own fields to a leg (a pose, a frame, a path) and
// its own units to a spot. The rig's travel reads --from-*, --to-* and --ms (travelVars). No React here;
// useLegSequence (src/hooks) plays the legs.

/** A place on a stage: x in % of its width, lift above the ground in the world's own unit. */
export interface Spot {
  x: number
  lift: number
}

/** The legs of a course: each starts where the one before it ended, the first at `start`. */
export interface LegsFrom<Leg extends { to: Spot }> {
  start: Spot
  legs: readonly Leg[]
}

/** Where he stands once the legs are run. */
export const restSpot = <Leg extends { to: Spot }>(course: LegsFrom<Leg>): Spot => course.legs.at(-1)?.to ?? course.start

/** Where leg `index` starts. */
export const legFrom = <Leg extends { to: Spot }>(course: LegsFrom<Leg>, index: number): Spot => course.legs[index - 1]?.to ?? course.start

/** Whether the legs, in `order`, have played past `name`: a later leg is playing, or he has arrived. */
export function playedPast(order: readonly string[], now: string, arrived: boolean, name: string): boolean {
  if (arrived) return true
  return order.indexOf(now) > order.indexOf(name)
}

/** The CSS variables a rig's travel reads for one leg. */
export const travelVars = ({ from, to, ms }: { from: Spot; to: Spot; ms: number }) => ({
  '--from-x': from.x,
  '--from-lift': from.lift,
  '--to-x': to.x,
  '--to-lift': to.lift,
  '--ms': ms,
})
