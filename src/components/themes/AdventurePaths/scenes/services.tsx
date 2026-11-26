import { drop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { fx, transformTo } from '../../shared/stageNodes'
import { TRAIL } from '../palette'
import { BLOCK, GROUND, TileGround, rigOf } from './kit'
import { levelLayers } from './frame'
import { MAP_MS, phase, reach, startX, type Level, type LevelInput } from './level'
import { FilledBlock } from './pieces'
import { mapWriter } from './worldMap'

// The switch palace: from the map he walks onto its spot and drops into its one colour room, landing in a
// ground pound on the giant switch, which presses flat. Then the map comes back and the dotted outline
// blocks along the path fill in solid, a bridge over the river to the next level.

const SIZE = 24 * BLOCK
// The giant switch: two blocks wide, its plate on top, past his start.
const SWITCH = 120
const SWITCH_W = 2 * SIZE

/** Where he ends: on the switch's plate. */
const switchOf = (input: LevelInput): number => startX(input) + reach(input, SWITCH)
const PLATE_H = 40

function Room() {
  return (
    <>
      <rect x={-200} y={-50} width={2000} height={1100} fill={TRAIL.BLOCK_DARK} />
      {Array.from({ length: 18 }, (_, i) => (
        <rect key={i} x={-120 + i * 100} y={0} width={60} height={GROUND} fill={TRAIL.BLOCK} opacity={0.35} />
      ))}
    </>
  )
}

function GiantSwitch({ x }: { x: number }) {
  return (
    <g transform={`translate(${x - SWITCH_W / 2} ${GROUND - SIZE})`}>
      <g data-fx="plate">
        <rect x={20} y={-PLATE_H} width={SWITCH_W - 40} height={PLATE_H} rx={8} fill={TRAIL.ROUTE} stroke={TRAIL.HUD} strokeWidth={5} />
        <rect x={34} y={-PLATE_H + 8} width={SWITCH_W - 120} height={8} rx={4} fill={TRAIL.ROUTE_LIGHT} />
      </g>
      {[0, 1].map((i) => (
        <g key={i} transform={`translate(${i * SIZE} 0) scale(${BLOCK})`}>
          <FilledBlock fill={TRAIL.STONE} />
        </g>
      ))}
    </g>
  )
}

export const services: Level = {
  script: [MAP_MS, 1300, 1700],
  end: switchOf,
  layers: (input) => {
    return levelLayers(
      {
        sky: <Room />,
        near: (
          <TileGround>
            <FilledBlock fill={TRAIL.BLOCK} />
          </TileGround>
        ),
        things: <GiantSwitch x={switchOf(input)} />,
      },
      input,
    )
  },
  bind: (stage, input) => {
    const map = mapWriter(stage, input)
    const hero = rigOf(stage, 'hero', 'stand')
    const plate = fx(stage, 'plate')
    const x = switchOf(input)
    const top = GROUND - SIZE - PLATE_H
    return (play) => {
      const walked = phase(play, 0)
      const pounding = phase(play, 1)
      const filling = phase(play, 2)
      // the map: walked on and opened, then back over the room to fill the bridge
      const back = ramp(filling, 0, 0.3)
      map({ walk: ramp(walked, 0, 0.6), open: filling > 0 ? 1 - back : ramp(walked, 0.55, 1), fill: ramp(filling, 0.3, 0.95) })
      const fall = ramp(pounding, 0, 0.55)
      const press = ramp(pounding, 0.55, 0.75)
      // the plate presses down onto its base, scaled from its foot
      transformTo(plate, `scale(1 ${(1 - 0.75 * press).toFixed(3)})`)
      const y = fall < 1 ? -60 + drop(fall, top + 60) : top + PLATE_H * 0.75 * press
      hero(x, y, fall < 1 ? (fall < 0.6 ? 'jump' : 'stomp') : press < 1 ? 'stomp' : 'cheer')
    }
  },
}
