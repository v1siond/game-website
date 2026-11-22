import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { mix } from '@/lib/motion/rigPose'
import { walkAlong } from '@/lib/scroll/walkAlong'
import { fx } from '../shared/stageNodes'
import type { StageWriter } from '../shared/theatre/useTheatre'
import { placeSurvivor } from './city'
import { decoJoints, setDecoPose, walk, type DecoPose } from './pose'

// What every chamber of the city is: its light, an optional set of its own between the hall and the floor,
// what stands on its floor (one prop per card of the section, and him) and the binder that finds the nodes
// the scroll moves once and returns the per frame writer. The writer takes the scene's progress (0 when its
// stage starts to rise, 1 when it has sunk) and how many of the section's cards have crossed the reading
// line, fractional.

export interface ChamberInput {
  /** Where each prop stands on the floor, one per card. */
  xs: readonly number[]
  profession: Profession
}

export interface Chamber {
  light: string
  set?: (input: ChamberInput) => ReactNode
  floor: (input: ChamberInput) => ReactNode
  bind: (stage: ParentNode, input: ChamberInput) => StageWriter
}

/** The props stand between these x, right of the text column; one card puts its prop in the middle. */
export const ROW_FROM = 900
export const ROW_TO = 1420

/** He stands this far left of a prop to act on it, and walks in from this far short of the first. */
export const REACH = 130
const LEAD_IN = 260

// One step of his stride carries him this far over the floor.
const STEP = 70

/** His act on prop `at`, `t` of the way (0 walking, 1 done): a pose of pose.ts. */
export type Act = (profession: Profession, t: number, at: number) => DecoPose

/** Where he is along the row and how far into his act, `reached` cards in; he walks from prop to prop as the
 *  scroll goes down (the shared walkAlong) and acts at each when its card is read. */
export const survivorAt = (xs: readonly number[], reached: number) => walkAlong(xs.length > 0 ? xs : [(ROW_FROM + ROW_TO) / 2], reached, -REACH, LEAD_IN)

/** Binds him and returns his writer: placed along the row, walking between props, acting at each. */
export function walkerOf(stage: ParentNode, { xs, profession }: ChamberInput, act: Act): (reached: number) => void {
  const root = fx(stage, 'survivor')
  const joints = root ? decoJoints(root) : null
  return (reached) => {
    const { x, at, moving, act: amount } = survivorAt(xs, reached)
    placeSurvivor(root, x)
    if (!joints) return
    setDecoPose(joints, mix(act(profession, amount, at), walk(profession, x / STEP), moving))
  }
}
