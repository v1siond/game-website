import { RPG } from './palette'

// The red heart: the visitor's soul, the cursor of every menu and the thing that dodges in the bullet
// box. Drawn on a 7 by 6 pixel grid like the game's sprite, with one lighter pixel for the shine. At 0 HP
// it splits down a jagged middle into its two halves (SoulHalves), which the bullet box pushes apart.

const HEART = 'M1 0 H3 V1 H4 V0 H6 V1 H7 V3 H6 V4 H5 V5 H4 V6 H3 V5 H2 V4 H1 V3 H0 V1 H1 Z'
// The two halves as pixel runs (x, y, width), split along a zigzag down the middle.
type Run = readonly [number, number, number]
const LEFT_HALF: Run[] = [[1, 0, 2], [0, 1, 4], [0, 2, 3], [1, 3, 3], [2, 4, 1]]
const RIGHT_HALF: Run[] = [[4, 0, 2], [4, 1, 3], [3, 2, 4], [4, 3, 2], [3, 4, 2], [3, 5, 1]]

const runs = (half: Run[], color: string) => half.map(([x, y, w]) => <rect key={`${x}-${y}`} x={x} y={y} width={w} height={1} fill={color} />)

interface SoulProps {
  className?: string
  color?: string
}

export function Soul({ className = '', color = RPG.soul }: SoulProps) {
  return (
    <svg viewBox="0 0 7 6" className={className} aria-hidden="true" focusable="false" shapeRendering="crispEdges">
      <path d={HEART} fill={color} />
      <rect x={1} y={1} width={1} height={1} fill={RPG.soulShine} />
    </svg>
  )
}

export function SoulHalves({ className = '', color = RPG.soul, leftClass = '', rightClass = '' }: SoulProps & { leftClass?: string; rightClass?: string }) {
  return (
    <svg viewBox="0 0 7 6" className={className} aria-hidden="true" focusable="false" shapeRendering="crispEdges">
      <g className={leftClass}>{runs(LEFT_HALF, color)}</g>
      <g className={rightClass}>{runs(RIGHT_HALF, color)}</g>
    </svg>
  )
}
