import { fx, translateTo } from '../../shared/stageNodes'
import { TRAIL } from '../palette'
import { BLOCK, Bush, Canvas, Cloud, DomeHills, GROUND, GrassGround, PillHills, Placed, Sky } from './kit'
import type { Level } from './level'
import { ItemBox, Rock, Tree } from './pieces'

// The hero's picture: the plains of the first world at the start of the course, behind the name plaque
// and the overworld map he picks a profession on. A row of item boxes and a rock wait on the path, trees
// stand far off; the clouds drift as the page leaves the hero. He is on the map, not here.

export const hub: Level = {
  layers: () => [
    {
      name: 'sky',
      node: (
        <Canvas>
          <Sky id="ap-hub-sky" top={TRAIL.SKY_HIGH} low={TRAIL.SKY_LOW} />
          <g data-fx="clouds">
            <Cloud x={120} y={110} scale={2.4} />
            <Cloud x={760} y={60} scale={1.8} />
            <Cloud x={1240} y={170} scale={2.2} />
          </g>
        </Canvas>
      ),
    },
    {
      name: 'far',
      node: (
        <Canvas>
          <PillHills base={800} fill={TRAIL.HILL_FAR} edge={TRAIL.HILL_FAR_EDGE} />
          {[1240, 1330].map((x, i) => (
            <Placed key={x} x={x} y={800 - 56 * (2 + i)} scale={2 + i}>
              <Tree />
            </Placed>
          ))}
        </Canvas>
      ),
    },
    {
      name: 'mid',
      node: (
        <Canvas>
          <DomeHills base={880} fill={TRAIL.HILL_NEAR} edge={TRAIL.HILL_NEAR_DARK} />
        </Canvas>
      ),
    },
    {
      name: 'near',
      node: (
        <Canvas>
          <GrassGround />
        </Canvas>
      ),
    },
    {
      name: 'figure',
      node: (
        <Canvas>
          {[560, 656, 752].map((x) => (
            <Placed key={x} x={x} y={560}>
              <ItemBox />
            </Placed>
          ))}
          <Placed x={1080} y={GROUND - 18 * BLOCK}>
            <Rock />
          </Placed>
        </Canvas>
      ),
    },
    {
      name: 'fg',
      node: (
        <Canvas>
          <Bush x={20} fill={TRAIL.HILL_NEAR_DARK} />
          <Bush x={1540} fill={TRAIL.HILL_NEAR_DARK} />
        </Canvas>
      ),
    },
  ],
  bind: (stage) => {
    const clouds = fx(stage, 'clouds')
    return (p) => translateTo(clouds, -p * 200, 0)
  },
}
