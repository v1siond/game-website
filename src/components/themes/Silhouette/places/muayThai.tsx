import { mix } from '@/lib/motion/rigPose'
import type { Profession } from '@/lib/cv/professions'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp, transformTo } from '../../shared/stageNodes'
import { FIGURE_H, gearPath } from '../forest'
import { SHADE, type Light } from '../palette'
import { runFrame, type Frame, type Place } from '../place'
import { STRIKE, TUCK, rest } from '../pose'

// Muay Thai, the fighter's middle section, turn the guns on each other: the gravity room, two wall guns
// facing each other high across it, a curtain of light in front of each that fires its gun when broken, a
// saw on the floor's rail and a gravity switch (research notes L82 to L83, L153, [2]: machine guns set off by
// light beams, made to shoot each other). He feints into the near curtain and back out: the near gun fires
// across the room over his head into the far gun, which falls silent. He strikes the switch and falls up to
// the ceiling as the saw passes under; gravity flips back and he lands in guard past the saw.

const NEAR_GUN = -40
const FAR_GUN = 600
const GUN_Y = -190
const NEAR_BEAM = 110
const FAR_BEAM = 470
const SWITCH = 220
const CEILING = 300
const ON_CEILING = CEILING - FIGURE_H
const BACK = 440
const LAND = 500
const SAW = { r: 34, from: 760, to: 160 }
const FIRE = { from: 0.18, to: 0.26 }

function move(profession: Profession, t: number): Frame {
  if (t < 0.32) {
    const walk = ramp(t, 0, 0.1)
    if (walk < 1) return runFrame(profession, 0, NEAR_BEAM - 40, walk)
    // the feint: a step into the curtain and straight back out of it
    const feint = ramp(t, 0.1, 0.14) - ramp(t, 0.15, 0.19)
    return { pose: rest(profession), ahead: lerp(NEAR_BEAM - 40, NEAR_BEAM + 4, feint), lift: 0, over: 0 }
  }
  if (t < 0.66) {
    const walk = ramp(t, 0.32, 0.4)
    if (walk < 1) return runFrame(profession, NEAR_BEAM - 40, SWITCH - 20, walk)
    const strike = ramp(t, 0.4, 0.45)
    const fall = ramp(t, 0.46, 0.54)
    if (fall === 0) return { pose: mix(rest(profession), STRIKE, strike), ahead: SWITCH - 20, lift: 0, over: 0 }
    if (fall < 1) return { pose: TUCK, ahead: SWITCH - 20, lift: ON_CEILING * fall * fall, over: fall }
    return { ...runFrame(profession, SWITCH - 20, BACK, ramp(t, 0.54, 0.66)), lift: ON_CEILING, over: 1 }
  }
  const back = ramp(t, 0.7, 0.82)
  if (back < 1) return { pose: TUCK, ahead: lerp(BACK, LAND, back), lift: ON_CEILING * (1 - back * back), over: 1 - back }
  return { pose: rest(profession), ahead: LAND, lift: 0, over: 0 }
}

/** A wall gun on its bracket at the wall, its muzzle toward `facing` (1 right, -1 left). */
function Gun({ x, facing, name }: { x: number; facing: 1 | -1; name: string }) {
  return (
    <g transform={`translate(${x} ${GUN_Y}) scale(${facing} 1)`}>
      <rect x={-30} y={-14} width={34} height={28} fill={SHADE.black} />
      <rect x={4} y={-5} width={34} height={10} fill={SHADE.black} />
      <circle data-fx={`${name}-eye`} cx={-14} cy={0} r={4} fill={SHADE.ember} />
    </g>
  )
}

export const muayThai: Place = {
  region: 'machine',
  length: LAND,
  script: [1600, 1800, 1400],
  ends: [0.32, 0.66, 1],
  obstacle: ({ light }: { light: Light }) => (
    <>
      <rect x={-500} y={-CEILING - 600} width={1500} height={600} fill={SHADE.black} />
      <rect x={-500} y={-4} width={1500} height={4} fill={light.rim} opacity={0.2} />
      <Gun x={NEAR_GUN} facing={1} name="near-gun" />
      <Gun x={FAR_GUN} facing={-1} name="far-gun" />
      {[NEAR_BEAM, FAR_BEAM].map((x, i) => (
        <rect key={x} data-fx={`beam-${i}`} x={x - 3} y={-CEILING} width={6} height={CEILING} fill={SHADE.glow} opacity={0.35} />
      ))}
      {/* the near gun's burst: tracers across the room over his head */}
      <g data-fx="burst" opacity="0">
        {[0, 1, 2].map((i) => (
          <rect key={i} x={i * 44} y={GUN_Y - 2} width={30} height={4} fill={SHADE.glow} />
        ))}
      </g>
      <rect x={SWITCH - 3} y={-80} width={6} height={80} fill={SHADE.black} />
      <rect x={SWITCH - 12} y={-104} width={24} height={26} fill={SHADE.black} />
      <path data-fx="arrow" d={`M${SWITCH} -100 l-7 10 h4 v8 h6 v-8 h4 Z`} fill={light.rim} />
      <g data-fx="saw">
        <path d={gearPath(0, -SAW.r, SAW.r, 18)} fill={SHADE.black} fillRule="evenodd" />
      </g>
    </>
  ),
  move,
  reply: (stage) => {
    const saw = fx(stage, 'saw')
    const arrow = fx(stage, 'arrow')
    const burst = fx(stage, 'burst')
    const farEye = fx(stage, 'far-gun-eye')
    const farBeam = fx(stage, 'beam-1')
    const nearBeam = fx(stage, 'beam-0')
    return (t) => {
      // the burst crosses from the near gun to the far one, and the far gun dies
      const fire = ramp(t, FIRE.from, FIRE.to)
      transformTo(burst, `translate(${lerp(NEAR_GUN + 40, FAR_GUN - 120, fire).toFixed(1)} 0)`)
      fadeTo(burst, fire > 0 && fire < 1 ? 1 : 0)
      const dead = ramp(t, FIRE.to - 0.01, FIRE.to + 0.01)
      fadeTo(farEye, 1 - dead)
      fadeTo(farBeam, 0.35 * (1 - dead))
      fadeTo(nearBeam, 0.35 + 0.5 * (ramp(t, 0.13, 0.14) - ramp(t, 0.16, 0.17)))
      const x = lerp(SAW.from, SAW.to, ramp(t, 0.5, 0.74))
      transformTo(saw, `translate(${x.toFixed(1)} 0) rotate(${(-x * 1.7).toFixed(1)} 0 ${-SAW.r})`)
      transformTo(arrow, `rotate(${(180 * (ramp(t, 0.45, 0.47) - ramp(t, 0.68, 0.7))).toFixed(1)} ${SWITCH} -91)`)
    }
  },
}
