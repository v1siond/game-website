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

// The page as one run of the jungle barrel platformer it comes from, one place of the run per part of the
// page (places/), played the way that game plays: he stands at one spot under a fixed camera and the shared
// scene player moves his move through the place's script of one to three actions (src/lib/scroll/player.ts),
// each action its own stretch of the move, so every frame is a function of the playhead alone, plays the same
// backward, and the last action's end is the frame reduced motion shows. His partner, the lemur, is drawn
// with him from About on, and in the hero on a page with no About.
//
// He is the jungle hero of character.tsx on the shared rig, side on and facing right.

export type SceneId = 'hero' | SectionId | 'contact'

/** Him in a frame, as the shared figure scene places him. */
export type HeroState = FigureState<FigurePose>

// Where he stands: right of the text column on a wide screen, the left of a phone's view (zones.tsx
// PHONE_VIEW, x 480 to 1040) so the place before him shows whole.
const spotOf = (phone: boolean): number => (phone ? 580 : 820)

/** On a phone's narrow view the place round his spot, he and his partner are drawn at this share of their size,
 *  less for a place that asks for it. */
export const placeScale = ({ def, layout }: Scene): number => (layout.phone ? 0.8 * (def.phoneSize ?? 1) : 1)

/** Before the section arrives a scene shows its first frame. */
const START: Playhead = { action: 0, t: 0, done: false }

/** How far the move has played at `play`: each action plays its stretch, from the end of the one before to its
 *  own end on the move's t. */
const moveAt = (ends: readonly number[], { action, t }: Playhead): number => lerp(action > 0 ? ends[action - 1] : 0, ends[action] ?? 1, t)

/** Where the partner is gone: none in this scene, or not yet joined. */
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
  /** True on a page with no About, where the partner joins in the hero scene. */
  partnerJoins: boolean
}

/** The partner's frame in a scene `t` of the way: the place's, or away. */
export const partnerAt = (scene: Scene, t: number): PartnerFrame => scene.def.partner?.(t, inputOf(scene)) ?? AWAY

/** The scene's writer: the place's reply, the partner and his frame at the scene's playhead, him placed at his
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

/** Where he stands in a scene: his usual spot, shifted right where the scene asks. */
export const sceneSpot = ({ def, layout }: Scene): number => spotOf(layout.phone) + (def.shift?.[layout.phone ? 'phone' : 'wide'] ?? 0)

/** The input the scene's art reads. */
export const inputOf = (scene: Scene): SceneInput => ({ phone: scene.layout.phone, kit: scene.kit, partnerJoins: scene.partnerJoins })

type RecordWords = Pick<Labels, 'record' | 'years'>

const NO_ITEMS: StageItems = { lead: 0, count: 0 }

// The theatre reads only the count of a scene's layout; its band is not drawn on.
const BAND = [0, 0] as const

const sceneOf = (id: SceneId, slot: SectionSlot | null, items: StageItems, profession: Profession, phone: boolean, partnerJoins: boolean): Scene => {
  const def: SceneDef = PLACES[id]
  return { id, def, layout: propLayout(items, BAND, phone), kit: def.kit ?? profession, slot, partnerJoins }
}

/** The page as scenes: the hero, one per section the profession shows in reading order, the contact. */
export const scenesOf = (slots: readonly SectionSlot[], profession: Profession, phone: boolean, highlights: number, labels: RecordWords): Scene[] => {
  const partnerJoins = !slots.some((slot) => slot.id === 'about')
  return [
    sceneOf('hero', null, NO_ITEMS, profession, phone, partnerJoins),
    ...slots.map((slot) => sceneOf(slot.id, slot, stageItems(slot, labels, highlights), profession, phone, partnerJoins)),
    sceneOf('contact', null, NO_ITEMS, profession, phone, partnerJoins),
  ]
}
