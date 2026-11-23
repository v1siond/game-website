import type { ReactNode } from 'react'
import { propSize } from '@/lib/scroll/propRow'
import { fx } from './stageNodes'

// The props on a theatre floor, one per card of the section: each drawn round its foot, its art in a group
// the scroll can move and its light in a group hidden until the hero acts on it (litOf).

/** One prop's nodes: the art that moves and the light over it. */
export interface PropNodes {
  move: Element | null
  lit: Element | null
}

/** Every prop's nodes, found once. */
export const propNodes = (stage: Pick<ParentNode, 'querySelector'>, count: number): PropNodes[] =>
  Array.from({ length: count }, (_, i) => ({ move: fx(stage, `move-${i}`), lit: fx(stage, `lit-${i}`) }))

/** The props standing at `xs` on the `floor` line, each drawn round its foot (x 0, y 0) at the row's size. */
export function PropRow({ xs, floor, art, light }: { xs: readonly number[]; floor: number; art: (i: number, size: number) => ReactNode; light: (i: number, size: number) => ReactNode }) {
  const size = propSize(xs)
  return (
    <>
      {xs.map((x, i) => (
        <g key={i} transform={`translate(${x} ${floor}) scale(${size.toFixed(3)})`}>
          <g data-fx={`move-${i}`}>{art(i, size)}</g>
          <g data-fx={`lit-${i}`} opacity="0">
            {light(i, size)}
          </g>
        </g>
      ))}
    </>
  )
}
