import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { mix } from '@/lib/motion/rigPose'
import { walkAlong } from '@/lib/scroll/walkAlong'
import { ramp } from '@/lib/scroll/stage'
import { fx } from '../shared/stageNodes'
import type { StageWriter } from '../shared/theatre/useTheatre'
import { FLOOR, Survivor, placeSurvivor } from './city'
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

/** Him where the row starts him, before the first card nears the line. */
export function Walker({ xs, profession }: ChamberInput) {
  return <Survivor x={survivorAt(xs, 0).x} profession={profession} />
}

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

/** How lit prop `i` is, 0 to 1, `reached` cards in: it lights as his act on it lands and stays lit. */
export const litOf = (reached: number, i: number): number => ramp(reached - i, 0.35, 0.5)

/** One prop's nodes: the art that moves and the light over it. */
export interface PropNodes {
  move: Element | null
  lit: Element | null
}

/** Every prop's nodes, found once. */
export const propNodes = (stage: ParentNode, count: number): PropNodes[] =>
  Array.from({ length: count }, (_, i) => ({ move: fx(stage, `move-${i}`), lit: fx(stage, `lit-${i}`) }))

/** The props on the floor, each drawn round its foot at the floor (x 0, y 0): its art, and its light
 *  hidden until he acts on it. */
export function PropRow({ xs, art, light }: { xs: readonly number[]; art: (i: number) => ReactNode; light: (i: number) => ReactNode }) {
  return (
    <>
      {xs.map((x, i) => (
        <g key={i} transform={`translate(${x} ${FLOOR})`}>
          <g data-fx={`move-${i}`}>{art(i)}</g>
          <g data-fx={`lit-${i}`} opacity="0">
            {light(i)}
          </g>
        </g>
      ))}
    </>
  )
}
