import { drop, hop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp, r1, transformTo, translateTo } from '../../shared/stageNodes'
import { TRAIL } from '../palette'
import { GROUND, TileGround, rigOf, runFrame } from './kit'
import { Foe, foeOf, levelLayers } from './frame'
import { MAP_MS, phase, reach, startX, type Level } from './level'
import { GoldBlock } from './pieces'
import { mapWriter } from './worldMap'

// The fortress, then the castle: from the map he walks onto the castle's spot past the fortress. In the
// fortress grey crushers slam down in turn and he runs under each as it rises; in the castle's boss room
// our own boss, an armoured beetle, rocks on a platform tilting over lava, and he stomps it three times
// until it slides off into the lava.

// The crushers: how far past his start each hangs, its size, where it rests up and where it lands.
const CRUSHERS = [60, 230, 400]
const CRUSHER = 130
const UP = 360
// The castle's platform: its middle past his start, its half width and its height over the lava.
const PIVOT = 220
const HALF = 260
const DECK_Y = GROUND - 200
const TILTS = [0, 9, 18, 30]
// The boss against a walker, and how high its back stands when he lands on it.
const BOSS_SIZE = 1.8
const BACK = 60

function Crusher({ i, x }: { i: number; x: number }) {
  return (
    <g data-fx={`crusher-${i}`} transform={`translate(${x} ${UP})`}>
      <rect x={-6} y={-UP - 60} width={12} height={UP + 60} fill={TRAIL.STONE_DARK} />
      <rect x={-CRUSHER / 2} y={0} width={CRUSHER} height={CRUSHER} rx={6} fill={TRAIL.STONE} stroke={TRAIL.HUD} strokeWidth={5} />
      <rect x={-CRUSHER / 2 + 18} y={30} width={22} height={22} fill={TRAIL.HUD} />
      <rect x={CRUSHER / 2 - 40} y={30} width={22} height={22} fill={TRAIL.HUD} />
      {[-48, -16, 16, 48].map((dx) => (
        <path key={dx} d={`M${dx - 14} ${CRUSHER} L${dx} ${CRUSHER + 20} L${dx + 14} ${CRUSHER}`} fill={TRAIL.STONE_LIGHT} stroke={TRAIL.HUD} strokeWidth={3} />
      ))}
    </g>
  )
}

/** The lava under the castle's platform, its bands of orange and gold. */
function Lava() {
  return (
    <>
      <rect x={-200} y={GROUND - 40} width={2000} height={200} fill={TRAIL.ROUTE} />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <rect key={i} x={-160 + i * 220} y={GROUND - 40} width={110} height={18} rx={9} fill={TRAIL.GOLD} />
      ))}
    </>
  )
}

/** The armour over the boss's shell: a plated helmet with horns. */
function Armour() {
  return (
    <g transform="translate(0 -52)">
      <path d="M-34 -10 Q0 -40 34 -10 Z" fill={TRAIL.STONE} stroke={TRAIL.HUD} strokeWidth={3} />
      <path d="M-30 -14 L-40 -34 L-22 -22 M30 -14 L40 -34 L22 -22" fill={TRAIL.PAGE} stroke={TRAIL.HUD} strokeWidth={3} />
    </g>
  )
}

export const ventures: Level = {
  script: [MAP_MS, 1500, 1900],
  layers: (input) => {
    const x = startX(input)
    const pivot = x + reach(input, PIVOT)
    return levelLayers(
      {
        sky: (
          <>
            <rect x={-200} y={-50} width={2000} height={1100} fill={TRAIL.FORT} />
            <g data-fx="castle-wall" opacity={0}>
              {Array.from({ length: 9 }, (_, i) => (
                <rect key={i} x={-100 + i * 200} y={120} width={60} height={110} rx={30} fill={TRAIL.HUD} stroke={TRAIL.STONE_DARK} strokeWidth={6} />
              ))}
            </g>
          </>
        ),
        near: (
          <g data-fx="fortress-floor">
            <TileGround>
              <GoldBlock />
            </TileGround>
          </g>
        ),
        things: (
          <>
            <g data-fx="fortress">
              {CRUSHERS.map((dx, i) => (
                <Crusher key={i} i={i} x={x + reach(input, dx)} />
              ))}
            </g>
            <g data-fx="castle" opacity={0}>
              <Lava />
              <g data-fx="deck" transform={`translate(${pivot} ${DECK_Y})`}>
                <rect x={-HALF} y={0} width={2 * HALF} height={36} fill={TRAIL.STONE} stroke={TRAIL.HUD} strokeWidth={5} />
                {[-2, -1, 0, 1].map((i) => (
                  <rect key={i} x={i * 120 + 20} y={10} width={80} height={10} fill={TRAIL.STONE_DARK} />
                ))}
              </g>
              <rect x={pivot - 14} y={DECK_Y + 36} width={28} height={GROUND - DECK_Y} fill={TRAIL.STONE_DARK} stroke={TRAIL.HUD} strokeWidth={4} />
              <Foe name="boss" x={pivot + 80} y={DECK_Y} size={BOSS_SIZE}>
                <Armour />
              </Foe>
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
    const boss = foeOf(stage, 'boss')
    const crushers = CRUSHERS.map((_, i) => fx(stage, `crusher-${i}`))
    const fortress = fx(stage, 'fortress')
    const floor = fx(stage, 'fortress-floor')
    const castle = fx(stage, 'castle')
    const wall = fx(stage, 'castle-wall')
    const deck = fx(stage, 'deck')
    const x0 = startX(input)
    const pivot = x0 + reach(input, PIVOT)
    const xs = CRUSHERS.map((dx) => x0 + reach(input, dx))
    /** A point on the tilted deck `dx` from the pivot. */
    const onDeck = (dx: number, tilt: number): number => DECK_Y + dx * Math.tan((tilt * Math.PI) / 180)
    return (play) => {
      const walked = phase(play, 0)
      map({ walk: ramp(walked, 0, 0.6), open: ramp(walked, 0.55, 1) })
      const running = phase(play, 1)
      const fighting = phase(play, 2)
      // the cut from the fortress to the castle
      const inCastle = fighting > 0
      fadeTo(fortress, inCastle ? 0 : 1)
      fadeTo(floor, inCastle ? 0 : 1)
      fadeTo(castle, inCastle ? 1 : 0)
      fadeTo(wall, inCastle ? 1 : 0)
      // each crusher slams down in turn and rises; he runs under it as it rises
      crushers.forEach((node, i) => {
        const slam = ramp(running, i * 0.25, i * 0.25 + 0.2)
        const down = slam < 0.4 ? drop(slam / 0.4, 1) : 1 - ramp(slam, 0.5, 1)
        translateTo(node, xs[i], UP + down * (GROUND - CRUSHER - UP))
      })
      if (!inCastle) {
        const x = lerp(x0 - reach(input, 160), x0 + reach(input, 480), ramp(running, 0.1, 1))
        hero(x, GROUND, running > 0.1 && running < 1 ? runFrame(x) : 'stand')
        return
      }
      // three stomps, each tipping the deck further; the last tips the boss off into the lava
      const stomp = Math.min(2, Math.floor(fighting * 3))
      const u = fighting * 3 - stomp
      const landed = fighting >= 1 ? 3 : stomp + (u >= 0.55 ? 1 : 0)
      const tilt = lerp(TILTS[Math.max(0, landed - 1)], TILTS[landed], landed === 0 ? 0 : ramp(u, 0.55, 0.8))
      transformTo(deck, `translate(${r1(pivot)} ${DECK_Y}) rotate(${r1(tilt)})`)
      const bossDx = 80 + 50 * landed
      const off = ramp(fighting, 0.85, 1)
      boss(pivot + bossDx + 120 * off, onDeck(bossDx, tilt) + drop(off, 260), landed > 0 && u < 0.7 ? 'critterFlat' : 'critterA', 30 * off, 1 - off)
      // each stomp: from his spot up onto the boss's back, then a bounce back to his spot
      const spot = -80
      if (fighting >= 1) {
        hero(pivot + spot, onDeck(spot, tilt), 'cheer')
        return
      }
      const going = ramp(u, 0, 0.55)
      const back = ramp(u, 0.55, 1)
      const target = 80 + 50 * stomp
      const dx = u < 0.55 ? lerp(spot, target, going) : lerp(target, spot, back)
      const y = onDeck(dx, tilt) - BACK * (u < 0.55 ? going : 1 - back) - (u < 0.55 ? hop(going, 220) : hop(back, 120))
      hero(pivot + dx, y, u < 0.45 ? 'jump' : u < 0.65 ? 'stomp' : 'jump')
    }
  },
}
