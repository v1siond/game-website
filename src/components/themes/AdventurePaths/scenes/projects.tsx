import { hop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp, translateTo } from '../../shared/stageNodes'
import { TRAIL } from '../palette'
import { BLOCK, GROUND, HERO_TALL, Sky, TileGround, rigOf } from './kit'
import { levelLayers } from './frame'
import { MAP_MS, phase, reach, startX, type Level } from './level'
import { Rock } from './pieces'
import { mapWriter } from './worldMap'

// Level 4, the water: from the map he walks onto the spot past the bridge. He dives in and swims in
// strokes through the gap between two fish going up and down; then he surfaces and leaps out onto the
// shore ledge, shaking off a spray of drops, with the exit door behind him.

// The water's surface, the shore ledge's top and where it starts past him.
const SURFACE = 300
const SHORE_Y = SURFACE - 10
const SHORE = 330

/** A fish: a round body, a tail and an eye, facing left. */
function Fish({ name, x, y }: { name: string; x: number; y: number }) {
  return (
    <g data-fx={name} transform={`translate(${x} ${y})`}>
      <path d="M40 0 L70 -24 L70 24 Z" fill={TRAIL.ROUTE} stroke={TRAIL.HUD} strokeWidth={4} strokeLinejoin="round" />
      <ellipse rx={46} ry={30} fill={TRAIL.ROUTE_LIGHT} stroke={TRAIL.HUD} strokeWidth={4} />
      <rect x={-28} y={-12} width={10} height={10} fill={TRAIL.HUD} />
    </g>
  )
}

function Shore({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} ${SHORE_Y})`}>
      <rect x={0} y={0} width={900} height={GROUND} fill={TRAIL.SAND} stroke={TRAIL.HUD} strokeWidth={6} />
      <rect x={0} y={0} width={900} height={18} fill={TRAIL.GRASS} />
      {/* the exit door */}
      <g transform="translate(150 0)">
        <rect x={-40} y={-150} width={80} height={150} rx={30} fill={TRAIL.WOOD} stroke={TRAIL.HUD} strokeWidth={5} />
        <rect x={-30} y={-138} width={60} height={124} rx={24} fill={TRAIL.BARK} />
        <rect x={14} y={-80} width={10} height={10} fill={TRAIL.GOLD} />
      </g>
    </g>
  )
}

export const projects: Level = {
  script: [MAP_MS, 1800, 1400],
  layers: (input) => {
    const x = startX(input)
    return levelLayers(
      {
        sky: <Sky id="ap-projects-sky" top={TRAIL.SKY_HIGH} low={TRAIL.SKY_LOW} />,
        far: (
          <>
            <rect x={-200} y={SURFACE} width={2000} height={800} fill={TRAIL.SEA_DEEP} />
            {[100, 420, 760, 1120, 1450].map((rx, i) => (
              <g key={rx} transform={`translate(${rx} ${GROUND - 18 * BLOCK * (1 + (i % 2))}) scale(${BLOCK * (1 + (i % 2))})`}>
                <Rock />
              </g>
            ))}
          </>
        ),
        near: (
          <TileGround>
            <rect x={1} y={1} width={22} height={22} fill={TRAIL.SAND} stroke={TRAIL.CLIFF_DARK} strokeWidth={2} />
          </TileGround>
        ),
        things: (
          <>
            <Shore x={x + reach(input, SHORE)} />
            <Fish name="fish-0" x={x - reach(input, 20)} y={560} />
            <Fish name="fish-1" x={x + reach(input, 200)} y={460} />
          </>
        ),
        front: (
          <>
            <rect x={-200} y={SURFACE} width={2000} height={GROUND - SURFACE} fill={TRAIL.SEA} opacity={0.35} />
            <path d={`M-200 ${SURFACE} H1800`} stroke={TRAIL.PAGE} strokeWidth={6} strokeDasharray="40 30" />
            <g data-fx="spray" opacity={0}>
              {[-40, -10, 20, 50].map((dx, i) => (
                <rect key={dx} x={dx} y={-30 - (i % 2) * 24} width={12} height={12} fill={TRAIL.PAGE} stroke={TRAIL.SEA_DEEP} strokeWidth={2} />
              ))}
            </g>
          </>
        ),
      },
      input,
    )
  },
  bind: (stage, input) => {
    const map = mapWriter(stage, input)
    const hero = rigOf(stage, 'hero', 'stand')
    const fish = [0, 1].map((i) => fx(stage, `fish-${i}`))
    const spray = fx(stage, 'spray')
    const x0 = startX(input)
    const shore = x0 + reach(input, SHORE)
    return (play) => {
      const walked = phase(play, 0)
      map({ walk: ramp(walked, 0, 0.6), open: ramp(walked, 0.55, 1) })
      const swimming = phase(play, 1)
      const leaping = phase(play, 2)
      // the fish go up and down out of step, so the gap between them opens as he comes
      fish.forEach((node, i) => translateTo(node, x0 + reach(input, i ? 200 : -20), (i ? 460 : 560) + 90 * Math.sin(swimming * Math.PI * 2 + i * Math.PI)))
      if (leaping > 0) {
        const out = ramp(leaping, 0, 0.75)
        const x = lerp(x0 + reach(input, 230), shore + 60, out)
        const y = lerp(SURFACE + HERO_TALL * 0.4, SHORE_Y, out) - hop(out, 200)
        translateTo(spray, x0 + reach(input, 230), SURFACE)
        fadeTo(spray, 1 - ramp(leaping, 0.2, 0.7))
        hero(x, y, out < 1 ? 'jump' : 'stand')
        return
      }
      fadeTo(spray, 0)
      // a dive from the surface, then strokes along the bottom of the gap and up to the surface
      const dive = ramp(swimming, 0, 0.25)
      const along = ramp(swimming, 0.2, 0.9)
      const x = lerp(x0 - reach(input, 160), x0 + reach(input, 230), along)
      const y = swimming < 0.25 ? lerp(SURFACE + 40, 640, dive) : lerp(640, SURFACE + HERO_TALL * 0.4, ramp(swimming, 0.7, 1))
      const stroke = Math.floor(along * 10) % 2 === 0
      hero(x, y, swimming <= 0 ? 'stand' : stroke ? 'jump' : 'grab', false, swimming <= 0 ? 0 : 70)
    }
  },
}
