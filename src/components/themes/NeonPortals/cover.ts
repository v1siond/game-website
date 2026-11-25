import { ramp } from '@/lib/scroll/stage'
import { easeInOut } from '@/lib/scroll/player'
import { lerp } from '../shared/stageNodes'
import type { RoomMarks } from './world'

// When each era's set piece (sets/) covers the machine's passage, and where its box sits on the screen. The
// passage between eras is the tunnel (corridor.tsx); as a room's gate plate comes up the reading line its
// place zooms in out of the vanishing point until it fills the screen, it holds while the room's cards are
// read, and as the section ends it zooms out past the camera and fades back to the passage, the handoff he
// chose; it comes in through a round opening at the vanishing point that widens to the whole screen. The scroll also sets how far the place's script is asked to play (playAt), from the moment the place
// is in, over a shorter scroll on a phone, where the cards cover the width once they come up. Every value is a
// function of the scroll, so scrolling up plays the same covers backwards. No DOM here.

/** A span of scroll positions, from and to. */
type Span = readonly [number, number]

export interface SceneSpan {
  /** The zoom in out of the passage; none for the hero, whole from the top. */
  rise: Span | null
  /** The zoom out back to the passage; none for the last room, held to the end of the page. */
  fall: Span | null
  /** The scroll over which the scene's script is asked to play. */
  play: Span
}

// Around the gate plate reaching the reading line, in screens.
const RISE: Span = [-0.25, 0.05]
// Before the section's end reaches the reading line, in screens.
const FALL: Span = [-0.4, 0]
// The script is asked for over this many screens from the gate plate on the reading line.
const PLAY_SCREENS = 1
const PHONE_PLAY_SCREENS = 0.4
// and is all asked for this long before the place starts to leave.
const PLAY_CLEAR_SCREENS = 0.05
// The hero hands over to the passage over this share of its own height, and plays over this many screens: on
// a phone his headline plate comes up over him within a tenth of a screen, so there the whole fall is asked
// for at once and plays on at its own pace while he is still in view.
const HERO_FALL: Span = [0.55, 0.95]
const HERO_PLAY_SCREENS = 0.35
const HERO_PHONE_PLAY_SCREENS = 0.08
// How small the place is as it comes through the portal, and how far past the camera it goes.
const RISE_ZOOM = 0.8
const FALL_ZOOM = 1.4

export interface PageSpan {
  /** Where a card's centre is read, from the screen's top, in px. */
  reading: number
  vh: number
  maxScroll: number
}

/** A room's spans from its marks on the page. */
export function roomSpan(marks: RoomMarks, page: PageSpan, { phone, last }: { phone: boolean; last: boolean }): SceneSpan {
  const { vh } = page
  const gate = marks.gateTop - page.reading
  const end = marks.bottom - page.reading
  const fall: Span | null = last ? null : [end + FALL[0] * vh, end + FALL[1] * vh]
  const latest = fall ? fall[0] - PLAY_CLEAR_SCREENS * vh : page.maxScroll
  const playTo = Math.min(gate + (phone ? PHONE_PLAY_SCREENS : PLAY_SCREENS) * vh, latest)
  return { rise: [gate + RISE[0] * vh, gate + RISE[1] * vh], fall, play: [gate, Math.max(gate + 1, playTo)] }
}

/** The hero's spans: whole from the top, handed to the passage across its own height. */
export const heroSpan = (heroHeight: number, vh: number, phone: boolean): SceneSpan => ({
  rise: null,
  fall: [HERO_FALL[0] * heroHeight, HERO_FALL[1] * heroHeight],
  play: [0, (phone ? HERO_PHONE_PLAY_SCREENS : HERO_PLAY_SCREENS) * vh],
})

/** How a place is drawn over the passage: its opacity, its zoom about the vanishing point and how much of
 *  it shows through the opening portal (0 none, 1 the whole screen). */
export interface Cover {
  opacity: number
  zoom: number
  reveal: number
}

const spanned = (span: Span | null, position: number, none: number): number => (span ? easeInOut(ramp(position, span[0], span[1])) : none)

export function coverAt(span: SceneSpan, position: number): Cover {
  const rise = spanned(span.rise, position, 1)
  const fall = spanned(span.fall, position, 0)
  if (fall > 0) return { opacity: 1 - fall, zoom: lerp(1, FALL_ZOOM, fall), reveal: 1 }
  return { opacity: Math.min(1, 3 * rise), zoom: lerp(RISE_ZOOM, 1, rise), reveal: rise }
}

/** How far the scroll asks the scene's script to have played, 0 to 1. */
export const playAt = (span: SceneSpan, position: number): number => ramp(position, span.play[0], span.play[1])

/** Under reduced motion one scene shows, still: the last whose place has started to come in, else the hero. */
export const readAt = (spans: readonly SceneSpan[], position: number): number => spans.reduce((read, span, i) => (span.rise && position >= span.rise[0] ? i : read), 0)

/** A set piece's box, in its own units: the ground line, and where he starts in the hero's. The art reaches
 *  past the box on every side, so a screen of any shape is covered. */
export const BOX = { w: 640, h: 480, ground: 400, heroStart: 300 } as const

/** Where the box sits on the screen and its scale (px per unit). */
export interface Box {
  x: number
  y: number
  k: number
}

// The engine's phone line (useScrollStage): under 768 px wide.
const PHONE_MAX = 768

/**
 * The box on a screen. A desktop puts it right of the text column, its ground low; a phone scales it past
 * the screen's width (the middle 560 units fill it), so he and the one he meets read at a phone's size, and
 * sits it high, the cards coming up under it. The hero's box stands where he starts on `foot` (the wardrobe
 * plate is under him there).
 */
export function boxOf(vw: number, vh: number, foot: { x: number; y: number } | null): Box {
  const phone = vw < PHONE_MAX
  const k = phone ? vw / (foot ? BOX.w : 560) : Math.min((vw * 0.48) / BOX.w, (vh * 0.62) / BOX.h)
  if (foot) return { x: foot.x - BOX.heroStart * k, y: foot.y - BOX.ground * k, k }
  if (phone) return { x: vw / 2 - (BOX.w / 2) * k, y: vh * 0.3, k }
  return { x: vw * 0.74 - (BOX.w / 2) * k, y: vh * 0.86 - BOX.ground * k, k }
}
