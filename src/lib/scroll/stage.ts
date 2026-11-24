// Pure math behind the scroll stages (useScrollStage): a full screen picture per section that rises in over
// the one before it and stays whole while the section's text scrolls over it, until the next one rises over
// it in turn: a cross dissolve, never a dip to dark (his 11-23 words, C55; the engines draw it with crossOf,
// src/lib/scroll/player.ts). Every value is a function of a scroll position, so the
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
 * When a stage rises and how long its scene runs, in viewport heights from its section's top (in) and bottom
 * (out): it rises from top + inFrom to top + inTo, and its progress runs on to bottom + outTo.
 */
export interface Handover {
  inFrom: number
  inTo: number
  outTo: number
}

// A stage is whole by the time its section's top reaches the screen's top, so a reader stopped there never
// sees two rooms at once.
export const HANDOVER: Handover = { inFrom: -0.55, inTo: 0, outTo: -0.35 }

/** How far a stage has risen over the one before (0 not yet, 1 whole), how far its scene has played (0 to
 *  1, the layers' push in), and how far the scroll has played its actions (0 to 1, for the scene player). */
export interface StageState {
  vis: number
  progress: number
  play: number
}

// A section's actions play from its stage's arrival (this many screens before its top reaches the screen's
// top) over this many screens of scroll, ended while the section is still in view: by the time half a screen
// of it is left, or for the last one by the page's end.
const PLAY_FROM = -0.25
const PLAY_SCREENS = 1.2
const PLAY_LEFT_SCREENS = 0.5
// The hero plays its actions over this much of the first screen.
const HERO_PLAY_SCREENS = 0.6

function playSpan(span: StageSpan, viewport: number, last: boolean): readonly [number, number] {
  const start = span.top + PLAY_FROM * viewport
  const latest = last ? span.bottom - viewport : span.bottom - PLAY_LEFT_SCREENS * viewport
  return [start, Math.max(start + 1, Math.min(start + PLAY_SCREENS * viewport, latest))]
}

interface StageOptions {
  /** The last stage's scene runs to the end of the page, where its progress reaches 1. */
  last?: boolean
  handover?: Handover
}

export function stageState(span: StageSpan, position: number, viewport: number, { last = false, handover = HANDOVER }: StageOptions = {}): StageState {
  const start = span.top + handover.inFrom * viewport
  const rise = ramp(position, start, span.top + handover.inTo * viewport)
  const end = last ? span.bottom - viewport : span.bottom + handover.outTo * viewport
  const [playFrom, playTo] = playSpan(span, viewport, last)
  return { vis: rise, progress: ramp(position, start, end), play: ramp(position, playFrom, playTo) }
}

/** The hero's stage: whole from the top of the page, under the stages that rise over it, its progress run
 *  over the first screen and its actions over the first part of it. */
export const heroState = (position: number, viewport: number): StageState => ({
  vis: 1,
  progress: ramp(position, 0, viewport),
  play: ramp(position, 0, HERO_PLAY_SCREENS * viewport),
})

// An item counts as reached over this many screens of scroll after its trigger.
const ITEM_RAMP_SCREENS = 0.3

/** How many items have scrolled past their triggers (px of scroll), the one passing now as a fraction. */
export const itemsReached = (triggers: readonly number[], position: number, viewport: number): number =>
  triggers.reduce((sum, at) => sum + ramp(position, at, at + ITEM_RAMP_SCREENS * viewport), 0)

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
