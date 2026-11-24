import { fx, transformTo } from '../../shared/stageNodes'
import { FLOOR } from '../forest'
import { SHADE } from '../palette'
import { START, type Scene } from '../place'

// The hero: the edge of the forest at dawn, where he wakes (his figure stands in the hero itself, with the
// outfit plate), a rope hanging out of the boughs ahead of him. As the page starts to scroll the rope
// swings out once and comes to rest.

const ROPE_X = 1290
const ROPE_END = FLOOR - 300
// The rope swings out this far and back, once, over the hero's one action.
const SWING = 4

const ropeAt = (sway: number): string => `rotate(${sway.toFixed(2)} ${ROPE_X} 0)`

/** The rope out of the boughs, its knot at the end. */
function Rope() {
  return (
    <g data-fx="rope" transform={ropeAt(0)}>
      <line x1={ROPE_X} y1={0} x2={ROPE_X} y2={ROPE_END} stroke={SHADE.black} strokeWidth={7} />
      <circle cx={ROPE_X} cy={ROPE_END + 6} r={10} fill={SHADE.black} />
    </g>
  )
}

export const hero: Scene = {
  script: [1400],
  floor: () => <Rope />,
  bind: (stage) => {
    const rope = fx(stage, 'rope')
    return (_progress, _reached, play = START) => transformTo(rope, ropeAt(SWING * Math.sin(Math.PI * play.t)))
  },
}
