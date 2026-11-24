import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp, r1, transformTo, translateTo } from '../../shared/stageNodes'
import { TRAIL } from '../palette'
import { Bush, Cloud, DomeHills, GROUND, GrassGround, PillHills, Placed, Sky, rigOf, runFrame } from './kit'
import { levelLayers } from './frame'
import { phase, reach, startX, type Level } from './level'
import { Tree } from './pieces'

// The start of the world, behind his name plaque and the world map he picks a profession on: his house on
// the plains at the head of the path, its door at his start. Smoke curls from the chimney and the door
// swings open; he steps out onto the path and throws a fist up, ready to go.

function House({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} ${GROUND})`}>
      <rect x={-130} y={-200} width={260} height={200} fill={TRAIL.PAGE} stroke={TRAIL.HUD} strokeWidth={6} />
      <path d="M-160 -196 L0 -320 L160 -196 Z" fill={TRAIL.ROUTE} stroke={TRAIL.HUD} strokeWidth={6} strokeLinejoin="round" />
      <rect x={60} y={-330} width={40} height={90} fill={TRAIL.BRICK} stroke={TRAIL.HUD} strokeWidth={5} />
      <rect x={-100} y={-150} width={50} height={50} fill={TRAIL.SKY_LOW} stroke={TRAIL.HUD} strokeWidth={5} />
      <rect x={-46} y={-130} width={92} height={130} fill={TRAIL.BARK} stroke={TRAIL.HUD} strokeWidth={5} />
      <g data-fx="door">
        <rect x={-46} y={-130} width={92} height={130} fill={TRAIL.WOOD} stroke={TRAIL.HUD} strokeWidth={5} />
        <rect x={24} y={-70} width={12} height={12} fill={TRAIL.GOLD} />
      </g>
      {[0, 1, 2].map((i) => (
        <rect key={i} data-fx={`smoke-${i}`} x={60} y={-370} width={40} height={36} rx={14} fill={TRAIL.CLOUD} stroke={TRAIL.CLOUD_SHADE} strokeWidth={4} opacity={0} />
      ))}
    </g>
  )
}

export const hub: Level = {
  script: [1300, 1500],
  layers: (input) => {
    const x = startX(input)
    return levelLayers(
      {
        sky: (
          <>
            <Sky id="ap-hub-sky" top={TRAIL.SKY_HIGH} low={TRAIL.SKY_LOW} />
            <Cloud x={120} y={110} scale={2.4} />
            <Cloud x={760} y={60} scale={1.8} />
            <Cloud x={1240} y={170} scale={2.2} />
          </>
        ),
        far: (
          <>
            <PillHills base={800} fill={TRAIL.HILL_FAR} edge={TRAIL.HILL_FAR_EDGE} />
            {[1240, 1330].map((tx, i) => (
              <Placed key={tx} x={tx} y={800 - 56 * (2 + i)} scale={2 + i}>
                <Tree />
              </Placed>
            ))}
          </>
        ),
        mid: <DomeHills base={880} fill={TRAIL.HILL_NEAR} edge={TRAIL.HILL_NEAR_DARK} />,
        near: <GrassGround />,
        things: <House x={x} />,
        fg: (
          <>
            <Bush x={20} fill={TRAIL.HILL_NEAR_DARK} />
            <Bush x={1540} fill={TRAIL.HILL_NEAR_DARK} />
          </>
        ),
      },
      input,
      false,
    )
  },
  bind: (stage, input) => {
    const hero = rigOf(stage, 'hero', 'stand')
    const him = fx(stage, 'hero')
    const door = fx(stage, 'door')
    const smoke = [0, 1, 2].map((i) => fx(stage, `smoke-${i}`))
    const x0 = startX(input)
    return (play) => {
      const opening = phase(play, 0)
      const stepping = phase(play, 1)
      smoke.forEach((puff, i) => {
        const rise = ramp(opening, i * 0.2, 0.6 + i * 0.2)
        translateTo(puff, 20 * rise, -110 * rise)
        fadeTo(puff, rise > 0 ? 1 - rise : 0)
      })
      // the door swings open on its left hinge
      transformTo(door, `translate(-46 0) scale(${(1 - 0.8 * ramp(opening, 0.5, 1)).toFixed(3)} 1) translate(46 0)`)
      const out = ramp(stepping, 0, 0.6)
      const x = lerp(x0, x0 + reach(input, 200), out)
      hero(r1(x), GROUND, stepping <= 0 ? 'stand' : out < 1 ? runFrame(x) : 'cheer')
      // he is inside until the door is open
      fadeTo(him, stepping > 0 || opening >= 1 ? 1 : 0)
    }
  },
}
