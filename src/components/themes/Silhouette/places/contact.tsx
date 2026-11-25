import { mix } from '@/lib/motion/rigPose'
import type { Profession } from '@/lib/cv/professions'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp, transformTo } from '../../shared/stageNodes'
import { Hut } from '../forest'
import { SHADE, type Light } from '../palette'
import { arc, runFrame, type Frame, type Place } from '../place'
import { CROUCH, KNOCK, TUCK, rest } from '../pose'

// Contact, back where it began: the last pane of glass gives way and throws him out into the grass at the
// forest's edge where he woke (Limbo notes L86 to L87, [1] [2]). The small shape on posts with the one lit
// window, far off in the hero, stands close now. He walks to its foot, slow, and stops; he knocks, and the
// door opens and warm light falls on him, no one shown, only the light coming out (L88 to L89: where the
// search ends). The game's cut to black is left out, so the end frame stays readable under the contact card; on a phone the stretch is framed low, so
// the hut, the door's light and he stand in the band below the card.

const PANE = -20
const LAND = 70
const FOOT = 380
const HUT = 440

function move(profession: Profession, t: number): Frame {
  if (t < 0.3) {
    const out = ramp(t, 0.06, 0.24)
    if (out === 0) return { pose: rest(profession), ahead: PANE - 30, lift: 30, over: 0 }
    if (out < 1) return { pose: mix(TUCK, CROUCH, ramp(out, 0.7, 1)), ahead: lerp(PANE - 30, LAND, out), lift: arc(out, 30, -30) + 30, over: 0 }
    return { pose: mix(CROUCH, rest(profession), ramp(t, 0.24, 0.3)), ahead: LAND, lift: 0, over: 0 }
  }
  if (t < 0.62) return runFrame(profession, LAND, FOOT, ramp(t, 0.3, 0.6))
  // two knocks, then he stands in the light
  const knock = ramp(t, 0.64, 0.68) - ramp(t, 0.7, 0.72) + ramp(t, 0.72, 0.75) - ramp(t, 0.77, 0.8)
  return { pose: mix(rest(profession), KNOCK, knock), ahead: FOOT, lift: 0, over: 0 }
}

export const contact: Place = {
  region: 'forest',
  length: FOOT,
  // on a phone the contact card stands over the top half while he knocks: the ground goes low, under it
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
      <g transform={`translate(${HUT} 0)`}>
        <Hut name="home" w={92} />
      </g>
      <path data-fx="spill" d={`M${HUT - 37} -33 L${HUT - 6} -33 L${HUT - 6} 0 L${FOOT - 60} 0 Z`} fill={SHADE.sun} opacity="0" />
    </>
  ),
  move,
  reply: (stage) => {
    const pane = fx(stage, 'pane')
    const shards = fx(stage, 'shards')
    const door = fx(stage, 'home-door')
    const inside = fx(stage, 'home-inside')
    const spill = fx(stage, 'spill')
    return (t) => {
      const breaks = ramp(t, 0.06, 0.08)
      fadeTo(pane, 0.5 * (1 - breaks))
      fadeTo(shards, breaks * (1 - ramp(t, 0.24, 0.3)))
      transformTo(shards, `translate(${(90 * ramp(t, 0.06, 0.26)).toFixed(1)} ${(80 * ramp(t, 0.1, 0.28)).toFixed(1)})`)
      // the door swings open on its hinge and the warm light falls out onto the grass and him
      const open = ramp(t, 0.82, 0.95)
      transformTo(door, `translate(${(-37 * open).toFixed(1)} 0) scale(${(1 - 0.85 * open).toFixed(3)} 1) translate(${(37 * open).toFixed(1)} 0)`)
      fadeTo(inside, open)
      fadeTo(spill, 0.45 * open)
    }
  },
}
