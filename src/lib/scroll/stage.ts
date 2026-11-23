// Pure math behind the scroll stages (useScrollStage): a full screen picture per section that rises from
// dark, holds while the section's text scrolls over it and sinks back into dark as the next one rises, the
// Rockstar VI hand over (score C47 research vi.md). Every value is a function of a scroll position, so the
// stages play forwards on the way down and backwards on the way up, and nothing moves while the scroll
// rests. The settle is the eased follow that draws the stages a little behind the scroll and brings them to
// rest about a second after it stops. No DOM here.

import { clamp01 } from './progress'

/** The settle's time constant in ms: after the scroll stops the drawing covers 95 percent of the way left
 *  in 3 x SETTLE_TAU_MS and sits within a few pixels by a second (his 11-22 ask, C53: "1s instead of .5"). */
export const SETTLE_TAU_MS = 200

/** The drawn position counts as at rest once this close to the scroll, in px; the loop then stops. */
export const SETTLE_EPSILON_PX = 0.5

// A jump longer than this many screens in one scroll event (a link to a section, Home, End) is not eased
// across every stage in between: the drawing lands JUMP_LANDING_SCREENS short of it and eases the rest.
const JUMP_SCREENS = 1.5
const JUMP_LANDING_SCREENS = 0.25

/** A frame after an idle has no earlier timestamp; it advances as one 60 Hz frame. */
export const FIRST_FRAME_MS = 1000 / 60

/** 0 before `from`, 1 after `to`, linear between; a range given high to low reads the other way. */
export const ramp = (value: number, from: number, to: number): number => clamp01((value - from) / (to - from))

export interface Settle {
  drawn: number
  settled: boolean
}

/**
 * One frame of the eased follow, frame rate independent: drawn += (target - drawn) * (1 - e^(-dt / tau)).
 * Within SETTLE_EPSILON_PX it snaps to the target and reports settled; a tau of 0 draws at the scroll.
 */
export function settleStep(drawn: number, target: number, dtMs: number, tauMs: number = SETTLE_TAU_MS): Settle {
  const eased = tauMs > 0 ? drawn + (target - drawn) * (1 - Math.exp(-dtMs / tauMs)) : target
  if (Math.abs(target - eased) < SETTLE_EPSILON_PX) return { drawn: target, settled: true }
  return { drawn: eased, settled: false }
}

/** Where the drawing starts from when the scroll moves to `target`: a long jump lands a quarter screen short. */
export function jumpStart(drawn: number, target: number, viewport: number): number {
  if (Math.abs(target - drawn) <= JUMP_SCREENS * viewport) return drawn
  return target - Math.sign(target - drawn) * JUMP_LANDING_SCREENS * viewport
}

/** A section's place in the document, in px from the page top. */
export interface StageSpan {
  top: number
  bottom: number
}

/**
 * When a stage rises and sinks, in viewport heights from its section's top (in) and bottom (out): it rises
 * from top + inFrom to top + inTo and sinks from bottom + outFrom to bottom + outTo, so between two sections
 * there is a short dark dip where both stages are low.
 */
export interface Handover {
  inFrom: number
  inTo: number
  outFrom: number
  outTo: number
}

export const HANDOVER: Handover = { inFrom: -0.55, inTo: 0.25, outFrom: -1.15, outTo: -0.35 }

/** How visible a stage is (0 dark to 1 full) and how far its scene has played (0 to 1). */
export interface StageState {
  vis: number
  progress: number
}

interface StageOptions {
  /** The last stage never sinks: it holds to the end of the page, where its progress reaches 1. */
  last?: boolean
  handover?: Handover
}

export function stageState(span: StageSpan, position: number, viewport: number, { last = false, handover = HANDOVER }: StageOptions = {}): StageState {
  const start = span.top + handover.inFrom * viewport
  const rise = ramp(position, start, span.top + handover.inTo * viewport)
  const end = last ? span.bottom - viewport : span.bottom + handover.outTo * viewport
  const sink = last ? 0 : ramp(position, span.bottom + handover.outFrom * viewport, end)
  return { vis: Math.min(rise, 1 - sink), progress: ramp(position, start, end) }
}

// The hero's stage is up at the top of the page and fades out over its first three quarters of a screen.
const HERO_OUT_SCREENS = 0.75

/** The hero's stage: full at the top, gone by HERO_OUT_SCREENS, its progress run over the first screen. */
export const heroState = (position: number, viewport: number): StageState => ({
  vis: 1 - ramp(position, 0, HERO_OUT_SCREENS * viewport),
  progress: ramp(position, 0, viewport),
})

// An item counts as reached over this many screens of scroll after its trigger.
const ITEM_RAMP_SCREENS = 0.3

/** How many items have scrolled past their triggers (px of scroll), the one passing now as a fraction. */
export const itemsReached = (triggers: readonly number[], position: number, viewport: number): number =>
  triggers.reduce((sum, at) => sum + ramp(position, at, at + ITEM_RAMP_SCREENS * viewport), 0)

/** The stage's opacity from its visibility, eased in so it climbs out of the dark slowly. */
export const stageOpacity = (vis: number): number => vis ** 1.6

// The black veil over a stage: up to VEIL_MAX while the stage is under VEIL_BELOW visible, the fade to dark
// done with opacity instead of a brightness filter.
const VEIL_MAX = 0.8
const VEIL_BELOW = 0.65

export const veilOpacity = (vis: number): number => VEIL_MAX * (1 - clamp01(vis / VEIL_BELOW))

/** A layer's push in across its scene: scale from zoom[0] to zoom[1], lift (percent of its height) likewise. */
export interface LayerMotion {
  zoom: readonly [number, number]
  lift: readonly [number, number]
}

/** The layer's transform at progress p; `amount` scales the motion (a phone moves less). */
export function layerTransform(motion: LayerMotion, progress: number, amount = 1): string {
  const zoom = 1 + (motion.zoom[0] - 1 + (motion.zoom[1] - motion.zoom[0]) * progress) * amount
  const lift = (motion.lift[0] + (motion.lift[1] - motion.lift[0]) * progress) * amount
  return `translate3d(0,${lift.toFixed(2)}%,0) scale(${zoom.toFixed(4)})`
}

/** The index of the most visible stage, the first one on a tie: the stage the page is in. */
export const leadOf = (visibilities: readonly number[]): number =>
  visibilities.reduce((lead, vis, index) => (vis > visibilities[lead] ? index : lead), 0)
