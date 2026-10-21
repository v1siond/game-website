import type { CSSProperties, ReactNode } from 'react'
import rig from './rig.module.css'

// The jointed rig both of this world's figures are built on (survivor.tsx, stalker.tsx). A limb is a
// nested group per bone: the upper arm turns round the shoulder and carries the forearm, which turns round
// the elbow, so a pose is only a set of angles (degrees, positive turns clockwise on screen). Every group
// carries its turn twice: as the SVG transform attribute, which a static render (and a picture of the pose
// made without a browser) reads, and as --a with its pivot in --ox and --oy, which rig.module.css turns
// into a CSS transform the browser eases from one pose to the next. In the browser the CSS transform wins.
//
// Both figures are drawn facing right, so a negative shoulder or hip turn swings the limb forward, an
// elbow only ever bends with a negative turn and a knee only with a positive one (poses.test.ts checks the
// rule on every pose of both figures).

type Point = readonly [number, number]

const pivotVars = (at: Point, angle: number) =>
  ({ '--a': `${angle}deg`, '--ox': `${at[0]}px`, '--oy': `${at[1]}px` }) as CSSProperties

/** A bone: its children turn round `at` by `angle`. */
export function Joint({ at, angle, children }: { at: Point; angle: number; children: ReactNode }) {
  return (
    <g transform={`rotate(${angle} ${at[0]} ${at[1]})`} className={rig.joint} style={pivotVars(at, angle)}>
      {children}
    </g>
  )
}

/** The whole figure lowered (a kneel, a seat) or raised, in viewBox units. */
export function Drop({ by, children }: { by: number; children: ReactNode }) {
  return (
    <g transform={`translate(0 ${by})`} className={rig.drop} style={{ '--dy': `${by}px` } as CSSProperties}>
      {children}
    </g>
  )
}

/** The chest's slow rise and fall at rest, the only motion a figure keeps once its beat has played. */
export function Breath({ at, children }: { at: Point; children: ReactNode }) {
  return (
    <g className={rig.breath} style={{ '--ox': `${at[0]}px`, '--oy': `${at[1]}px` } as CSSProperties}>
      {children}
    </g>
  )
}

/** A limb: the upper bone from `root` and the lower from `mid`, with what each carries. */
export function Limb({ root, mid, upper, lower, angles }: { root: Point; mid: Point; upper: ReactNode; lower: ReactNode; angles: readonly [number, number] }) {
  return (
    <Joint at={root} angle={angles[0]}>
      {upper}
      <Joint at={mid} angle={angles[1]}>
        {lower}
      </Joint>
    </Joint>
  )
}
