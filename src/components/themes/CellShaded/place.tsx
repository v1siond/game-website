import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { mix } from '@/lib/motion/rigPose'
import { walkAlong } from '@/lib/scroll/walkAlong'
import { fx } from '../shared/stageNodes'
import type { StageWriter } from '../shared/theatre/useTheatre'
import { Commando, placeCommando, type Hour } from './desert'
import { celJoints, setCelPose, walk, type CelPose } from './pose'

// What every place of the desert is: its hour, optional art of its own in the sky behind the mesas and on
// the sand, what stands on its sand (one prop per card of the section, and him) and the binder that finds the nodes the scroll moves once and returns the per frame writer. The writer takes the scene's
// progress (0 when its stage starts to rise, 1 when it has sunk) and how many of the section's cards have
// crossed the reading line, fractional.

export interface PlaceInput {
  /** Where each prop stands on the sand, one per card. */
  xs: readonly number[]
  profession: Profession
  /** Each prop's own colour, where its card gives it one (a project's rarity). */
  tones: readonly string[]
}

export interface Place {
  hour: Hour
  /** Its own art in the sky, behind the mesas. */
  back?: (input: PlaceInput) => ReactNode
  /** Its own art standing on the sand, behind him. */
  set?: (input: PlaceInput) => ReactNode
  floor: (input: PlaceInput) => ReactNode
  bind: (stage: ParentNode, input: PlaceInput) => StageWriter
}

/** The props stand between these x, right of the text column; one card puts its prop in the middle. */
export const ROW_FROM = 900
export const ROW_TO = 1420

/** He stands this far left of a prop to act on it, and walks in from this far short of the first. */
export const REACH = 120
const LEAD_IN = 260

// One step of his stride carries him this far over the sand.
const STEP = 60

/** His act on prop `at`, `t` of the way (0 walking, 1 done): a pose of pose.ts. */
export type Act = (profession: Profession, t: number, at: number) => CelPose

/** Where he is along the row and how far into his act, `reached` cards in (the shared walkAlong). */
export const commandoAt = (xs: readonly number[], reached: number) => walkAlong(xs.length > 0 ? xs : [(ROW_FROM + ROW_TO) / 2], reached, -REACH, LEAD_IN)

/** Him where the row starts him, before the first card nears the line. */
export function Walker({ xs, profession }: Pick<PlaceInput, 'xs' | 'profession'>) {
  return <Commando x={commandoAt(xs, 0).x} profession={profession} />
}

/** Binds him and returns his writer: placed along the row, walking between props, acting at each. */
export function walkerOf(stage: ParentNode, { xs, profession }: PlaceInput, act: Act): (reached: number) => void {
  const root = fx(stage, 'commando')
  const joints = root ? celJoints(root) : null
  return (reached) => {
    const { x, at, moving, act: amount } = commandoAt(xs, reached)
    placeCommando(root, x)
    if (!joints) return
    setCelPose(joints, mix(act(profession, amount, at), walk(profession, x / STEP), moving))
  }
}
