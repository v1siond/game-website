import { hop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, frames, fx, lerp, r1, transformTo, translateTo } from '../../shared/stageNodes'
import { TRAIL } from '../palette'
import { BLOCK, Bush, Cloud, DomeHills, GROUND, GrassGround, HERO_TALL, PillHills, Placed, Sky, critterStep, rigOf, runFrame } from './kit'
import { Foe, foeOf, levelLayers } from './frame'
import { MAP_MS, phase, reach, startX, type Level } from './level'
import { Coin, ItemBox, OpenBox } from './pieces'
import { mapWriter } from './worldMap'

// Level 1, the grass plains: from the map he walks onto the first spot; he jumps and hits an item box from
// below and a coin spins out of it; a round walker comes at him and he stomps it flat and bounces off; he
// runs on through the midway gate and its tape snaps.

const SIZE = 24 * BLOCK
// The box hangs this far above his head; he jumps to meet it, its middle over where he lands.
const BOX_GAP = 130
const BOX_LEFT = 20 - SIZE / 2

/** The midway gate: two plain posts and the tape between them, its two halves dropping when he breaks it. */
export function MidwayGate({ x, name }: { x: number; name: string }) {
  return (
    <g transform={`translate(${x} ${GROUND})`}>
      <rect x={-70} y={-300} width={20} height={300} fill={TRAIL.WOOD} stroke={TRAIL.HUD} strokeWidth={4} />
      <rect x={50} y={-300} width={20} height={300} fill={TRAIL.WOOD} stroke={TRAIL.HUD} strokeWidth={4} />
      <rect data-fx={`${name}-l`} x={-50} y={-170} width={50} height={12} fill={TRAIL.PAGE} stroke={TRAIL.HUD} strokeWidth={3} />
      <rect data-fx={`${name}-r`} x={0} y={-170} width={50} height={12} fill={TRAIL.PAGE} stroke={TRAIL.HUD} strokeWidth={3} />
    </g>
  )
}

/** The midway tape's writer: snapped `t` of the way, its halves swinging down to the posts. */
export function tapeOf(stage: ParentNode, name: string): (t: number) => void {
  const left = fx(stage, `${name}-l`)
  const right = fx(stage, `${name}-r`)
  return (t) => {
    transformTo(left, `rotate(${r1(80 * t)} -50 -164)`)
    transformTo(right, `rotate(${r1(-80 * t)} 50 -164)`)
  }
}

export const about: Level = {
  script: [MAP_MS, 1300, 1700],
  layers: (input) => {
    const x = startX(input)
    return levelLayers(
      {
        sky: (
          <>
            <Sky id="ap-about-sky" top={TRAIL.SKY_HIGH} low={TRAIL.SKY_LOW} />
            <Cloud x={160} y={120} scale={2.4} />
            <Cloud x={820} y={70} scale={1.8} />
            <Cloud x={1260} y={180} scale={2.2} />
          </>
        ),
        far: <PillHills base={800} fill={TRAIL.HILL_FAR} edge={TRAIL.HILL_FAR_EDGE} />,
        mid: <DomeHills base={880} fill={TRAIL.HILL_NEAR} edge={TRAIL.HILL_NEAR_DARK} />,
        near: <GrassGround />,
        things: (
          <>
            <g data-fx="coin" transform={`translate(${x + BOX_LEFT + SIZE / 2 - 20} ${GROUND - HERO_TALL - BOX_GAP - SIZE})`} opacity={0}>
              <g transform={`scale(${BLOCK})`}>
                <Coin />
              </g>
            </g>
            <Placed name="box" x={x + BOX_LEFT} y={GROUND - HERO_TALL - BOX_GAP - SIZE}>
              <g data-frame="closed" visibility="visible">
                <ItemBox />
              </g>
              <g data-frame="open" visibility="hidden">
                <OpenBox />
              </g>
            </Placed>
            <MidwayGate x={x + reach(input, 400)} name="tape" />
            <Foe name="walker" x={x + reach(input, 460)} />
          </>
        ),
        fg: (
          <>
            <Bush x={1520} fill={TRAIL.HILL_NEAR_DARK} />
            <Bush x={20} fill={TRAIL.HILL_NEAR_DARK} />
          </>
        ),
      },
      input,
    )
  },
  bind: (stage, input) => {
    const map = mapWriter(stage, input)
    const hero = rigOf(stage, 'hero', 'stand')
    const walker = foeOf(stage, 'walker')
    const box = fx(stage, 'box')
    const boxFace = frames(box, 'closed')
    const coin = fx(stage, 'coin')
    const tape = tapeOf(stage, 'tape')
    const x0 = startX(input)
    const boxY = GROUND - HERO_TALL - BOX_GAP - SIZE
    const stompAt = x0 + reach(input, 230)
    const past = x0 + reach(input, 520)
    return (play) => {
      const walked = phase(play, 0)
      map({ walk: ramp(walked, 0, 0.6), open: ramp(walked, 0.55, 1) })
      // the box: a run in under it and a jump that bumps it open
      const boxing = phase(play, 1)
      const run = ramp(boxing, 0, 0.3)
      const jump = ramp(boxing, 0.3, 0.75)
      const hit = boxing >= 0.52
      translateTo(box, x0 + BOX_LEFT, boxY - hop(ramp(boxing, 0.52, 0.62), 24))
      boxFace(hit ? 'open' : 'closed')
      const rise = ramp(boxing, 0.55, 0.9)
      translateTo(coin, x0 + BOX_LEFT + SIZE / 2 - 20, boxY - 170 * rise)
      fadeTo(coin, rise > 0 ? 1 : 0)
      // the walker comes on; he jumps it, stomps it flat, bounces and runs through the tape
      const stomping = phase(play, 2)
      const come = ramp(stomping, 0, 0.35)
      const walkerX = lerp(x0 + reach(input, 460), stompAt, come)
      walker(walkerX, GROUND, stomping >= 0.35 ? 'critterFlat' : critterStep(walkerX))
      const leap = ramp(stomping, 0.1, 0.35)
      const bounce = ramp(stomping, 0.35, 0.6)
      const dash = ramp(stomping, 0.6, 0.95)
      tape(ramp(stomping, 0.72, 0.85))
      if (stomping > 0.1) {
        const x = dash > 0 ? lerp(stompAt + 60, past, dash) : bounce > 0 ? lerp(stompAt, stompAt + 60, bounce) : lerp(x0 + reach(input, 20), stompAt, leap)
        const lift = bounce > 0 && bounce < 1 ? 24 * (1 - bounce) + hop(bounce, 180) : leap < 1 ? 24 * leap + hop(leap, 160) : 0
        hero(x, GROUND - lift, dash > 0 ? (dash < 1 ? runFrame(x) : 'stand') : leap < 1 ? 'jump' : bounce < 1 ? 'stomp' : 'stand')
        return
      }
      const x = lerp(x0 - reach(input, 140), x0 + reach(input, 20), run)
      hero(x, GROUND - hop(jump, BOX_GAP + 10), jump > 0 && jump < 1 ? 'jump' : run > 0 && run < 1 ? runFrame(x) : 'stand')
    }
  },
}
