import { mix } from '@/lib/motion/rigPose'
import type { Profession } from '@/lib/cv/professions'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp, transformTo } from '../../shared/stageNodes'
import { Girl, placeGirl } from '../children'
import { Hut } from '../forest'
import { SHADE, type Light } from '../palette'
import { arc, runFrame, type Frame, type Place } from '../place'
import { CROUCH, KNOCK, TUCK, rest } from '../pose'

// Contact, back where it began: the last pane of glass gives way and throws him out into the grass at the
// forest's edge where he woke (research notes L86 to L87, [1] [2]). The small shape on posts with the one lit
// window, far off in the hero, stands close now, and under it, between its posts, stands the small girl with
// her back to him. He walks to it, slow, and stops; she turns round to him, her eye lit, and he lifts his hand
// to her (L88 to L89: the girl found under the treehouse, where the search ends). The game's cut to black is
// left out, so the end frame stays readable under the contact card; on a phone the stretch is framed low, so the
// hut, the two of them and the light stand in the band below the card.

const PANE = -20
const LAND = 70
const FOOT = 360
const HUT = 450
const GIRL = HUT - 14

function move(profession: Profession, t: number): Frame {
  if (t < 0.3) {
    const out = ramp(t, 0.06, 0.24)
    if (out === 0) return { pose: rest(profession), ahead: PANE - 30, lift: 30, over: 0 }
    if (out < 1) return { pose: mix(TUCK, CROUCH, ramp(out, 0.7, 1)), ahead: lerp(PANE - 30, LAND, out), lift: arc(out, 30, -30) + 30, over: 0 }
    return { pose: mix(CROUCH, rest(profession), ramp(t, 0.24, 0.3)), ahead: LAND, lift: 0, over: 0 }
  }
  if (t < 0.62) return runFrame(profession, LAND, FOOT, ramp(t, 0.3, 0.6))
  // once she has turned to him, his hand comes up to her
  return { pose: mix(rest(profession), KNOCK, 0.7 * ramp(t, 0.84, 0.94)), ahead: FOOT, lift: 0, over: 0 }
}

export const contact: Place = {
  region: 'forest',
  length: FOOT,
  // on a phone the contact card stands over the top half: the ground goes low, under it
  phoneTop: 850,
  script: [1400, 1600, 1700],
  ends: [0.3, 0.62, 1],
  obstacle: ({ light }: { light: Light }) => (
    <>
      {/* the last machine wall behind him and its pane of glass */}
      <rect x={PANE - 900} y={-1200} width={900} height={1204} fill={SHADE.black} />
      <rect data-fx="pane" x={PANE - 4} y={-150} width={8} height={120} fill={light.rim} opacity={0.5} />
      <g data-fx="shards" opacity="0" fill={light.rim} fillOpacity={0.7}>
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M${PANE + i * 10} ${-60 - i * 18} l8 -10 l4 12 Z`} />
        ))}
      </g>
      <g data-fx="home" transform={`translate(${HUT} 0)`}>
        <Hut name="home" w={170} legs={0.62} />
      </g>
      <Girl name="girl" />
    </>
  ),
  move,
  reply: (stage) => {
    const pane = fx(stage, 'pane')
    const shards = fx(stage, 'shards')
    const girl = fx(stage, 'girl')
    const eye = fx(stage, 'girl-eye')
    return (t) => {
      const breaks = ramp(t, 0.06, 0.08)
      fadeTo(pane, 0.5 * (1 - breaks))
      fadeTo(shards, breaks * (1 - ramp(t, 0.24, 0.3)))
      transformTo(shards, `translate(${(90 * ramp(t, 0.06, 0.26)).toFixed(1)} ${(80 * ramp(t, 0.1, 0.28)).toFixed(1)})`)
      // under the hut she stands with her back to him until he stops, then turns round to him
      placeGirl(girl, eye, { x: GIRL, turn: ramp(t, 0.66, 0.82), size: 0.92 })
    }
  },
}
