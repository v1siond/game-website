import { mix } from '@/lib/motion/rigPose'
import type { Profession } from '@/lib/cv/professions'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp, transformTo, translateTo } from '../../shared/stageNodes'
import { FIGURE_H } from '../forest'
import { SHADE, type Light } from '../palette'
import { outline, runFrame, type Frame, type Place } from '../place'
import { STRIKE, TUCK, rest } from '../pose'

// Muay Thai, the fighter's middle section, turn the guns on each other: the gravity room, two wall guns
// facing each other high across it, a curtain of light in front of each that fires its gun when broken, a
// saw on the floor's rail and a gravity switch (research notes L82 to L83, L153, [2]: machine guns set off by
// light beams, made to shoot each other). He feints into the near curtain and back out: the near gun fires
// across the room over his head into the far gun, which falls silent. He strikes the switch and falls up to
// the ceiling as the saw passes under; gravity flips back and he lands in guard past the saw.

const NEAR_GUN = 20
const FAR_GUN = 400
const GUN_Y = -190
const NEAR_BEAM = 140
const FAR_BEAM = 290
const SWITCH = 220
const CEILING = 300
const ON_CEILING = CEILING - FIGURE_H
const BACK = 340
const LAND = 400
const LOOK_ACROSS = 150
const SAW = { r: 58, from: 800, to: 260 }
const FIRE = { from: 0.18, to: 0.26 }

/** A saw blade standing on the floor at x, turned `turn` radians: `teeth` hooked teeth round a disc with a
 *  hub hole, drawn anew each frame so its box stays the blade's own. */
function sawPath(x: number, r: number, teeth: number, turn: number): string {
  const step = (Math.PI * 2) / teeth
  const at = (angle: number, radius: number) => `${(x + Math.cos(angle + turn) * radius).toFixed(1)} ${(-r + Math.sin(angle + turn) * radius).toFixed(1)}`
  const rim = Array.from({ length: teeth }, (_, i) => `L${at(i * step, r * 0.86)} L${at(i * step + step * 0.15, r * 1.12)} L${at(i * step + step, r * 0.86)}`).join(' ')
  const hub = r * 0.2
  return `M${at(0, r * 0.86)} ${rim} Z M${x - hub} ${-r} a${hub} ${hub} 0 1 0 ${hub * 2} 0 a${hub} ${hub} 0 1 0 ${-hub * 2} 0 Z`
}

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

/** A wall gun on its bracket hung from the ceiling, a heavy housing and a long barrel toward `facing` (1
 *  right, -1 left), its sensor eye lit while it is armed. */
function Gun({ x, facing, name }: { x: number; facing: 1 | -1; name: string }) {
  return (
    <g data-fx={name} transform={`translate(${x} ${GUN_Y}) scale(${facing} 1)`}>
      <path d={`M-14 ${-CEILING - GUN_Y} V-20 M10 ${-CEILING - GUN_Y} V-20`} stroke={SHADE.black} strokeWidth={6} />
      <path d="M-46 -24 H18 L28 -12 V14 L18 24 H-46 Z" fill={SHADE.black} />
      <rect x={24} y={-7} width={70} height={14} fill={SHADE.black} />
      <rect x={88} y={-10} width={10} height={20} fill={SHADE.black} />
      <circle data-fx={`${name}-eye`} cx={-24} cy={0} r={6} fill={SHADE.glow} />
    </g>
  )
}

export const muayThai: Place = {
  region: 'machine',
  length: LAND,
  // the camera looks across the room while the near gun fires, so on a phone both guns are in the frame
  lead: (t) => LOOK_ACROSS * (ramp(t, 0.04, 0.12) - ramp(t, 0.3, 0.42)),
  script: [1600, 1800, 1400],
  ends: [0.32, 0.66, 1],
  obstacle: ({ light }: { light: Light }) => (
    <>
      <defs>
        <linearGradient id="room-lamp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={SHADE.glow} stopOpacity="0.5" />
          <stop offset="1" stopColor={SHADE.glow} stopOpacity="0.04" />
        </linearGradient>
      </defs>
      {/* two lamps hung under the ceiling, their cones of light down to the floor */}
      {[130, 330].map((x) => (
        <g key={x}>
          <path d={`M${x - 14} ${-CEILING + 34} L${x - 110} 0 H${x + 110} L${x + 14} ${-CEILING + 34} Z`} fill="url(#room-lamp)" />
          <path d={`M${x - 2} ${-CEILING} V${-CEILING + 22} M${x - 18} ${-CEILING + 36} Q${x} ${-CEILING + 14} ${x + 18} ${-CEILING + 36} Z`} stroke={SHADE.black} strokeWidth={4} fill={SHADE.black} />
        </g>
      ))}
      <rect x={-500} y={-CEILING - 600} width={1500} height={600} fill={SHADE.black} />
      <rect x={-500} y={-4} width={1500} height={4} fill={light.rim} opacity={0.2} />
      <Gun x={NEAR_GUN} facing={1} name="near-gun" />
      <Gun x={FAR_GUN} facing={-1} name="far-gun" />
      {[NEAR_BEAM, FAR_BEAM].map((x, i) => (
        <rect key={x} data-fx={`beam-${i}`} x={x - 3} y={-CEILING} width={6} height={CEILING} fill={SHADE.glow} opacity={0.35} />
      ))}
      {/* the near gun's burst: tracers across the room over his head, and the flash at its muzzle */}
      <g data-fx="burst" opacity="0">
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={i * 50} y={GUN_Y - 3} width={34} height={6} fill={SHADE.glow} />
        ))}
      </g>
      <path data-fx="flash" opacity="0" d={`M${NEAR_GUN + 98} ${GUN_Y} l18 -18 l4 14 l22 -6 l-14 10 l22 6 l-22 4 l12 14 l-22 -10 l-4 14 Z`} fill={SHADE.glow} />
      {/* the gravity switch: a lit sign on a post, its arrow the way he falls */}
      <rect x={SWITCH - 3} y={-80} width={6} height={80} fill={SHADE.black} />
      <rect x={SWITCH - 20} y={-122} width={40} height={44} fill={SHADE.black} />
      <rect x={SWITCH - 15} y={-117} width={30} height={34} fill={light.far} opacity={0.5} />
      <path data-fx="arrow" d={`M${SWITCH} -112 l-11 14 h6 v10 h10 v-10 h6 Z`} fill={SHADE.glow} />
      {/* the saw on its rail: a great toothed blade that runs the floor, sparks off its edge */}
      <rect x={-500} y={-6} width={1500} height={6} fill={SHADE.black} />
      <path data-fx="saw" d={sawPath(SAW.from, SAW.r, 24, 0)} fill={SHADE.black} fillRule="evenodd" />
      <path data-fx="sparks" d={`M${SAW.r * 0.7} -6 l26 -16 M${SAW.r * 0.6} -4 l30 -4 M${SAW.r * 0.8} -10 l14 -26`} stroke={SHADE.glow} strokeWidth={2} />
    </>
  ),
  move,
  reply: (stage) => {
    const saw = fx(stage, 'saw')
    const sparks = fx(stage, 'sparks')
    const flash = fx(stage, 'flash')
    const arrow = fx(stage, 'arrow')
    const burst = fx(stage, 'burst')
    const farEye = fx(stage, 'far-gun-eye')
    const farBeam = fx(stage, 'beam-1')
    const nearBeam = fx(stage, 'beam-0')
    return (t) => {
      // the burst crosses from the near gun to the far one, and the far gun dies
      const fire = ramp(t, FIRE.from, FIRE.to)
      transformTo(burst, `translate(${lerp(NEAR_GUN + 100, FAR_GUN - 290, fire).toFixed(1)} 0)`)
      fadeTo(burst, fire > 0 && fire < 1 ? 1 : 0)
      const dead = ramp(t, FIRE.to - 0.01, FIRE.to + 0.01)
      fadeTo(farEye, 1 - dead)
      fadeTo(farBeam, 0.35 * (1 - dead))
      fadeTo(nearBeam, 0.35 + 0.5 * (ramp(t, 0.13, 0.14) - ramp(t, 0.16, 0.17)))
      const x = lerp(SAW.from, SAW.to, ramp(t, 0.5, 0.74))
      outline(saw, sawPath(x, SAW.r, 24, (-x * 1.7 * Math.PI) / 180))
      translateTo(sparks, x, 0)
      fadeTo(sparks, x > SAW.to + 1 ? 1 : 0)
      fadeTo(flash, fire > 0 && fire < 1 ? 1 : 0)
      transformTo(arrow, `rotate(${(180 * (ramp(t, 0.45, 0.47) - ramp(t, 0.68, 0.7))).toFixed(1)} ${SWITCH} -91)`)
    }
  },
}
