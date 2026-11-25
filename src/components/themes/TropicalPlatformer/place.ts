import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import type { SceneScript } from '@/lib/scroll/player'
import type { StageNodes } from '../shared/figureScene'
import type { Frame } from './moves'
import type { PartnerFrame } from './partner'
import type { Zone } from './zones'

// What each place of the run is (places/): its light, his kit, its script of one to three actions, its art
// round his spot, his move and the partner's, and the place's reply to them. x 0 is his spot and y 0 the
// ground in the art; his frame and the partner's give how far ahead and how high.

/** What a place's art and writers read: the phone's narrower view, the kit he wears, and whether the partner
 *  joins in the hero scene (a page with no About, where the partner is not freed). */
export interface SceneInput {
  phone: boolean
  kit: Profession
  partnerJoins: boolean
}

export interface SceneDef {
  zone: Zone
  /** His kit in the scene; null takes the profession the page shows. */
  kit: Profession | null
  /** The scene's actions, each its length in ms. */
  script: SceneScript
  /** Where each action ends on the move's t, one per action, the last 1. */
  ends: readonly number[]
  /** How far right of his usual spot he stands, on a wide screen and on a phone. */
  shift?: { wide: number; phone: number }
  /** On a phone, a share of the usual phone size for a place too wide to show whole at it. */
  phoneSize?: number
  /** The place's art round his spot (x 0 his spot, y 0 the ground), behind him and in front of him. */
  back: (input: SceneInput) => ReactNode
  front?: (input: SceneInput) => ReactNode
  /** His move `t` of the way. */
  move: (kit: Profession, t: number) => Frame
  /** The partner's frame `t` of the way; none where he is not in the scene. */
  partner?: (t: number, input: SceneInput) => PartnerFrame | null
  /** Binds the place's reply to the move and returns its writer over the move's t. */
  reply: (stage: StageNodes, input: SceneInput) => (t: number) => void
}
