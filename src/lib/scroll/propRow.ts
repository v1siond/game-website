import { ramp } from './stage'

// A row of props on a theatre floor, one per card of the section, that the hero walks along (walkAlong):
// how big they are drawn, and how lit each one is as the cards are read.

// A prop is drawn whole while its neighbours stand at least PROP_ROOM apart, and shrinks to fit a closer row,
// down to PROP_MIN of its size.
const PROP_ROOM = 140
const PROP_MIN = 0.4

/** How big the props standing at `xs` are drawn: whole when they have room, smaller in a long row. */
export const propSize = (xs: readonly number[]): number => (xs.length < 2 ? 1 : Math.max(PROP_MIN, Math.min(1, (xs[1] - xs[0]) / PROP_ROOM)))

/** How lit prop `i` is, 0 to 1, `reached` cards in: it lights as the act on it lands and stays lit. */
export const litOf = (reached: number, i: number): number => ramp(reached - i, 0.35, 0.5)
