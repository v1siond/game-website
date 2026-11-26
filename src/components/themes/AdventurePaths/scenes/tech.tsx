import { hop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { fx, lerp, r1, transformTo, translateTo } from '../../shared/stageNodes'
import { TRAIL } from '../palette'
import { Cloud, GROUND, HERO_TALL, PillHills, Sky, rigOf } from './kit'
import { Foe, foeOf, levelLayers } from './frame'
import { MAP_MS, clearOf, phase, reach, startX, type Level, type LevelInput } from './level'
import { mapWriter } from './worldMap'

// Level 3, the sky, which scrolls on its own: from the map he walks onto the third spot. He rides a row
// of moving platforms as the screen carries the clouds past, hopping from one to the next; a spiked foe
// sits on the last one and he spin jumps off it safely, spinning high above the spikes.

// The platforms ride at this height, each this wide and this far apart; the screen scrolls one gap over
// the ride, so he ends where he started.
const DECK = GROUND - 120
const PLANK = 200
const GAP = 260

/** Where the course starts, his first deck: his start, or, beside cards on the left of a wide screen, far enough
 *  right that the first deck, scrolled a deck along as he leaves it, still ends clear of them. */
const courseOf = (input: LevelInput): number => clearOf(input, startX(input) - reach(input, GAP), PLANK / 2) + reach(input, GAP)

/** Where he ends: off the spikes, over the second deck once the course has scrolled a deck along. */
const landOf = (input: LevelInput): number => courseOf(input) + reach(input, GAP)

/** A moving platform: a plank of gold blocks with a dark edge. */
function Platform({ name, x }: { name: string; x: number }) {
  return (
    <g data-fx={name} transform={`translate(${x} ${DECK})`}>
      <rect x={-PLANK / 2} y={0} width={PLANK} height={30} rx={4} fill={TRAIL.BLOCK} stroke={TRAIL.HUD} strokeWidth={4} />
      {[-1, 0, 1].map((i) => (
        <rect key={i} x={i * 60 - 6} y={8} width={12} height={12} fill={TRAIL.BLOCK_DARK} />
      ))}
    </g>
  )
}

/** The spikes on the foe's back. */
function Spikes() {
  return (
    <g transform="translate(0 -84)">
      {[-30, -10, 10, 30].map((x) => (
        <path key={x} d={`M${x - 10} 0 L${x} -26 L${x + 10} 0 Z`} fill={TRAIL.PAGE} stroke={TRAIL.HUD} strokeWidth={3} strokeLinejoin="round" />
      ))}
    </g>
  )
}

export const tech: Level = {
  script: [MAP_MS, 1700, 1500],
  end: landOf,
  layers: (input) => {
    const x = courseOf(input)
    return levelLayers(
      {
        sky: <Sky id="ap-tech-sky" top={TRAIL.SKY_HIGH} low={TRAIL.SKY_LOW} />,
        far: <PillHills base={1060} fill={TRAIL.HILL_FAR} edge={TRAIL.HILL_FAR_EDGE} />,
        mid: (
          <g data-fx="clouds">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Cloud key={i} x={i * 360 - 100} y={200 + (i % 3) * 130} scale={2.2} />
            ))}
          </g>
        ),
        near: (
          <g data-fx="floor">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <Cloud key={i} x={i * 300 - 200} y={GROUND + 30} scale={3.2} fill={TRAIL.CLOUD} />
            ))}
          </g>
        ),
        things: (
          <>
            <Platform name="deck-0" x={x} />
            <Platform name="deck-1" x={x + reach(input, GAP)} />
            <Platform name="deck-2" x={x + reach(input, 2 * GAP)} />
            <Foe name="spiky" x={x + reach(input, 2 * GAP)} y={DECK}>
              <Spikes />
            </Foe>
          </>
        ),
      },
      input,
    )
  },
  bind: (stage, input) => {
    const map = mapWriter(stage, input)
    const hero = rigOf(stage, 'hero', 'stand')
    const spiky = foeOf(stage, 'spiky')
    const clouds = fx(stage, 'clouds')
    const floor = fx(stage, 'floor')
    const decks = [0, 1, 2].map((i) => fx(stage, `deck-${i}`))
    const x0 = courseOf(input)
    const gap = reach(input, GAP)
    const scroll = gap
    return (play) => {
      const walked = phase(play, 0)
      map({ walk: ramp(walked, 0, 0.6), open: ramp(walked, 0.55, 1) })
      // the screen scrolls on its own: the course slides left under him as he rides
      const riding = phase(play, 1)
      const spinning = phase(play, 2)
      const pan = scroll * riding
      transformTo(clouds, `translate(${r1(-0.4 * pan)} 0)`)
      transformTo(floor, `translate(${r1(-0.7 * pan)} 0)`)
      const bob = (i: number) => 14 * Math.sin(riding * Math.PI * 2 + i)
      decks.forEach((deck, i) => translateTo(deck, x0 + i * gap - pan, DECK + bob(i)))
      spiky(x0 + 2 * gap - pan, DECK + bob(2), 'critterA', 0, spinning >= 0.5 ? 1 - ramp(spinning, 0.5, 0.8) : 1)
      // he rides the first deck, then hops onto the second as the first drifts off
      const hopAcross = ramp(riding, 0.45, 0.8)
      const onDeck = DECK + bob(hopAcross >= 1 ? 1 : 0)
      const rideX = lerp(x0, x0 + gap, hopAcross) - pan
      if (spinning <= 0) {
        hero(rideX, onDeck - hop(hopAcross, 140), hopAcross > 0 && hopAcross < 1 ? 'jump' : 'stand')
        return
      }
      // the spin jump: up off the deck, down onto the spikes and off them, spinning, high above
      const startSpin = x0 + gap - scroll
      const footX = lerp(startSpin, landOf(input), ramp(spinning, 0, 0.5))
      const lift = spinning < 0.5 ? hop(spinning * 2, 180) : 240 * ramp(spinning, 0.5, 1) ** 0.6
      hero(footX, DECK + bob(1) - lift - (spinning >= 0.5 ? HERO_TALL * 0.2 : 0), 'jump', false, spinning * 1080)
    }
  },
}
