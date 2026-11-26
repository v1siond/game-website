import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import type { Labels } from '@/lib/cv/labels'
import type { Playhead } from '@/lib/scroll/player'
import { stageItems, type StageItems } from '@/lib/cv/stageItems'
import { fx, lerp, r1, transformTo } from '../shared/stageNodes'
import { propLayout, type FigureState, type FigureWriter, type PropLayout, type StageNodes } from '../shared/figureScene'
import type { FigurePose } from './character'
import { BALL, K } from './moves'
import { partnerOf, type PartnerFrame } from './partner'
import type { SceneDef, SceneInput } from './place'
import { PLACES } from './places'
import { GROUND } from './zones'

// The page as one run of the 3D jungle platformer it comes from, one world of the run per part of the page
// (places/), in that game's order: the theft on his isle, the jungle, the desert temple, the toy factory, the
// cove of wrecks, the mushroom forest, the castle, the hideout, the ring and the ride home. In each place he
// stands under a fixed camera and the shared scene player moves his move through the place's script of one to
// three actions (src/lib/scroll/player.ts), each action its own stretch of the move, so every frame is a
// function of the playhead alone, plays the same backward, and the last action's end is the frame reduced
// motion shows. The lemur and the rest of the troop are drawn by the places they are in.
//
// The sections take turns down the page (score/C72/plan.md): the first after the hero plays on the right half
// beside its cards on the left, the next on the left half beside its cards on the right, and so on to the
// contact. A place on the left is the same place stood in the left half: he still goes on to what waits on his
// right, nothing is flipped. On a phone, where the cards and the scene are stacked, the place is centred in
// the view and leant so the spot he ends on sits in the half the section names.
//
// He is the jungle hero of character.tsx on the shared rig, side on and facing right.

export type SceneId = 'hero' | SectionId | 'contact'

/** The half of a wide screen a scene plays in; its cards read on the other half. */
export type SceneSide = 'right' | 'left'

/** The side of the section at `index` after the hero, the contact last: right, left, right... */
const sideOf = (index: number): SceneSide => (index % 2 === 0 ? 'right' : 'left')

/** Him in a frame, as the shared figure scene places him. */
export type HeroState = FigureState<FigurePose>

// The middle of the half a section leaves free on a 1440 by 1080 canvas drawn 1:1 on a wide screen, and how
// wide a place may be in it: right of the cards' column (x 86 to 720, 44% of the width, so it still ends short
// of the middle at 1024) or left of it (x 720 to 1354), inside the canopy's fronds at both edges, and measured before the layers' push in, which carries what is far from the
// middle about a tenth further out.
const WIDE_FREE: Record<SceneSide, number> = { right: 1045, left: 398 }
const WIDE_ROOM = 550
// Between a phone and lg the section stacks as on a phone: the scene plays first in the whole screen and the
// cards come after it, full width. The place stands in the half the section names, whole on a 768 wide screen
// (the canvas seen from about x 260 to 1180, its middle 720), and is never wider than that half.
const STACKED_FREE: Record<SceneSide, number> = { right: 950, left: 490 }
const STACKED_ROOM = 440
// The middle of a phone's view (zones.tsx PHONE_VIEW, x 480 to 1040), how wide a place may be in it, and how far
// into the half the section names the spot he ends on sits.
const PHONE_MIDDLE = 760
const PHONE_ROOM = 520
const PHONE_LEAN = 60

const widthOf = (def: SceneDef): number => def.span[1] - def.span[0]

/** A place, he and the troop are drawn at the place's size, on a phone's narrow view at this share of it, less
 *  for a place that asks for it, and never wider than the room its half or the phone's view has. */
export const placeScale = (scene: Scene): number => {
  const { def, layout } = scene
  const size = (def.size ?? 1) * (layout.phone ? 0.8 * (def.phoneSize ?? 1) : 1)
  if (def.spot) return size
  return Math.min(size, roomOf(scene) / widthOf(def))
}

/** How wide a place may be: in a phone's view, in the half a stacked section names, or in the free half. */
const roomOf = ({ layout, split }: Scene): number => (layout.phone ? PHONE_ROOM : split ? WIDE_ROOM : STACKED_ROOM)

/** Before the section arrives a scene shows its first frame. */
const START: Playhead = { action: 0, t: 0, done: false }

/** How far the move has played at `play`: each action plays its stretch, from the end of the one before to its
 *  own end on the move's t. */
const moveAt = (ends: readonly number[], { action, t }: Playhead): number => lerp(action > 0 ? ends[action - 1] : 0, ends[action] ?? 1, t)

/** Where the lemur is gone: none in this scene, or not yet freed. */
const AWAY: PartnerFrame = { ahead: 0, opacity: 0 }

export interface Scene {
  id: SceneId
  def: SceneDef
  /** The cards the section counts, for the theatre's reading line. */
  layout: PropLayout
  /** His kit here: the scene's own, or the profession the page shows. */
  kit: Profession
  /** The section's slot; the hero and the contact have none. */
  slot: SectionSlot | null
  /** The half of a wide screen it plays in. */
  side: SceneSide
  /** Cards and scene side by side, from lg. */
  split: boolean
}

/** The lemur's frame in a scene `t` of the way: the place's, or away. */
export const partnerAt = (scene: Scene, t: number): PartnerFrame => scene.def.partner?.(t, inputOf(scene)) ?? AWAY

/** The scene's writer: the place's reply, the lemur and his frame at the scene's playhead, him placed at his
 *  spot and his tumble turning him round the middle of his tucked body (stage.tsx data-fx="tumble"). */
export function sceneWriter(scene: Scene): (stage: StageNodes) => FigureWriter<FigurePose> {
  const { def, kit } = scene
  const input = inputOf(scene)
  const spot = sceneSpot(scene)
  const size = placeScale(scene)
  return (stage) => {
    const reply = def.reply(stage, input)
    const partner = def.partner && partnerOf(stage)
    const tumble = fx(stage, 'tumble')
    return (_p, _f, play = START) => {
      const t = moveAt(def.ends, play)
      reply(t)
      partner?.(partnerAt(scene, t), spot, GROUND, size)
      const frame = def.move(kit, t)
      transformTo(tumble, frame.spin ? `rotate(${r1(frame.spin % 360)} ${BALL.x} ${BALL.y})` : '')
      return { x: spot + frame.ahead * size, y: GROUND - (frame.lift ?? 0) * size, k: K * size, pose: frame.pose, opacity: frame.opacity ?? 1 }
    }
  }
}

/** Where a scene stands: his spot, and whether the place is drawn the other way round. */
export interface Placing {
  spot: number
  mirrored: boolean
}

/** Where he stands in a scene: the place's stretch centred in the free half from lg, in the half the section
 *  names between a phone and lg; in a phone's view centred, drawn the other way round where he would end in the half the
 *  section does not name (he then goes the other way, facing it, nothing lettered in it), and leant toward the
 *  named half as far as the place still shows whole; the hero at its own spot. */
export const placingOf = (scene: Scene): Placing => {
  const { def, layout, side, kit } = scene
  if (def.spot) return { spot: layout.phone ? def.spot.phone : def.spot.wide, mirrored: false }
  const [from, to] = def.span
  const size = placeScale(scene)
  if (!layout.phone) return { spot: (scene.split ? WIDE_FREE : STACKED_FREE)[side] - ((from + to) / 2) * size, mirrored: false }
  const centred = PHONE_MIDDLE - ((from + to) / 2) * size
  const end = centred + def.move(kit, 1).ahead * size
  const named = side === 'right' ? 1 : -1
  const mirrored = (end - PHONE_MIDDLE) * named < 0
  const shown = mirrored ? 2 * PHONE_MIDDLE - end : end
  const slack = Math.max(0, (PHONE_ROOM - widthOf(def) * size) / 2)
  const lean = named * Math.min(slack, Math.max(0, (PHONE_MIDDLE + named * PHONE_LEAN - shown) * named))
  return { spot: centred + (mirrored ? -lean : lean), mirrored }
}

/** Where he stands in a scene, in the place's own drawing (before a phone's mirror). */
export const sceneSpot = (scene: Scene): number => placingOf(scene).spot

/** The transform that draws a mirrored place the other way round about the middle of a phone's view. */
export const MIRROR = `translate(${2 * PHONE_MIDDLE} 0) scale(-1 1)`

/** The input the scene's art reads. */
export const inputOf = (scene: Scene): SceneInput => ({ phone: scene.layout.phone, left: scene.split && scene.side === 'left', kit: scene.kit })

type RecordWords = Pick<Labels, 'record' | 'years'>

const NO_ITEMS: StageItems = { lead: 0, count: 0 }

// The theatre reads only the count of a scene's layout; its band is not drawn on.
const BAND = [0, 0] as const

const sceneOf = (id: SceneId, slot: SectionSlot | null, items: StageItems, profession: Profession, screen: Screen, side: SceneSide): Scene => {
  const def: SceneDef = PLACES[id]
  return { id, def, layout: propLayout(items, BAND, screen.phone), kit: def.kit ?? profession, slot, side, split: screen.split }
}

/** The screen a page is drawn for: a phone (below md), or wide enough for cards and scene side by side (lg). */
interface Screen {
  phone: boolean
  split: boolean
}

/** The page as scenes: the hero, one per section the profession shows in reading order, the contact; the
 *  sections after the hero taking turns right and left at every width, beside their cards from lg (`split`),
 *  in the half they name above their cards below it. */
export const scenesOf = (slots: readonly SectionSlot[], profession: Profession, phone: boolean, split: boolean, highlights: number, labels: RecordWords): Scene[] => {
  const screen = { phone, split }
  return [
    sceneOf('hero', null, NO_ITEMS, profession, screen, 'right'),
    ...slots.map((slot, i) => sceneOf(slot.id, slot, stageItems(slot, labels, highlights), profession, screen, sideOf(i))),
    sceneOf('contact', null, NO_ITEMS, profession, screen, sideOf(slots.length)),
  ]
}
