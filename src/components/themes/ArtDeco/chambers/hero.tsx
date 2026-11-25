import { ramp } from '@/lib/scroll/stage'
import { mix } from '@/lib/motion/rigPose'
import { bell, fadeTo, fx, lerp, transformTo } from '../../shared/stageNodes'
import { DECO_COLORS as C } from '../palette'
import { fightChamber, share, type Frame } from '../chamber'
import { Canvas, W } from '../city'
import { rest, stride, swim, tread } from '../pose'

// The hero: the crash. A passenger plane has gone down at night in the open sea and its tail is sinking in
// burning fuel; he breaks the surface among the flames, swims out of the fire to the steps of a lone deco
// tower on the rocks, and climbs them, and the tower's doors open and its lamps come on over him while its
// beam turns over the water. Three actions from the page's first paint; the end frame is him at the lit
// doors with the tail going under behind him.

// The sea's surface, above his place on the floor.
const SURFACE = -40
// Where he breaks the surface, where the steps start and where the doors are, from his place.
const UP_AT = 40
const STEPS_AT = 400
const STEP_RISE = 28
const STEP_RUN = 26
const DOOR = { x: 510, y: SURFACE + 12 - 4 * STEP_RISE }
// Lying flat he reaches this far ahead of his feet, so he swims in with his feet this far short of the steps
// and stands up onto them.
const BODY_LENGTH = 240
// The tail sinks this far over the scene.
const SINK = 150
// The tower, from his place.
const TOWER = { x: 450, width: 120, top: -640 }

/** The night: the sky to the horizon, its stars and the moon low behind cloud, the black sea under it with
 *  the moon's path on the water. */
function NightSea() {
  const stars = Array.from({ length: 46 }, (_, i) => ({ x: (i * 397) % W, y: 40 + ((i * 131) % 380), r: i % 5 === 0 ? 2.4 : 1.4 }))
  return (
    <Canvas>
      <defs>
        <linearGradient id="deco-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.abyss} />
          <stop offset="0.5" stopColor={C.nightSky} />
          <stop offset="0.6" stopColor={C.nightHorizon} />
          <stop offset="0.61" stopColor={C.nightSea} />
          <stop offset="1" stopColor={C.abyss} />
        </linearGradient>
        <radialGradient id="deco-moon" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={C.moonPath} stopOpacity="0.5" />
          <stop offset="1" stopColor={C.moonPath} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x={-200} width={W + 400} height={1000} fill="url(#deco-night)" />
      {stars.map(({ x, y, r }) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={C.cream} opacity="0.7" />
      ))}
      <circle cx={1380} cy={430} r={160} fill="url(#deco-moon)" />
      <circle cx={1380} cy={430} r={34} fill={C.moonPath} opacity="0.85" />
      <path d="M1180 450 Q1300 420 1460 444 Q1540 456 1600 440 L1600 470 Q1400 480 1180 470 Z" fill={C.nightSky} opacity="0.9" />
      {Array.from({ length: 9 }, (_, i) => 640 + i * 38).map((y, i) => (
        <path key={y} d={`M${1380 - 30 - i * 14} ${y} H${1380 + 30 + i * 14}`} stroke={C.moonPath} strokeWidth="3" opacity={0.35 - i * 0.03} />
      ))}
      {Array.from({ length: 12 }, (_, i) => i).map((i) => (
        <path key={i} d={`M${(i * 173) % W} ${640 + ((i * 59) % 300)} h${60 + (i % 3) * 30}`} stroke={C.nightHorizon} strokeWidth="3" opacity="0.6" />
      ))}
    </Canvas>
  )
}

/** A tongue of burning fuel on the water, `size` tall, in `data-fx="{name}"` so it can flicker. */
function Flame({ name, x, size }: { name: string; x: number; size: number }) {
  return (
    <g transform={`translate(${x} ${SURFACE})`}>
      <g data-fx={name}>
        <ellipse cx={0} cy={0} rx={size * 0.9} ry={size * 0.16} fill={C.fire} opacity="0.35" />
        <path d={`M${-size * 0.5} 0 Q${-size * 0.4} ${-size * 0.6} 0 ${-size} Q${size * 0.1} ${-size * 0.5} ${size * 0.5} 0 Z`} fill={C.fire} />
        <path d={`M${-size * 0.24} 0 Q${-size * 0.2} ${-size * 0.34} 0 ${-size * 0.6} Q${size * 0.08} ${-size * 0.3} ${size * 0.24} 0 Z`} fill={C.fireCore} />
      </g>
    </g>
  )
}

/** The plane's tail going under: the fin and the last of the fuselage, a stripe and a row of windows. */
function Tail() {
  return (
    <g data-fx="tail">
      <path d="M-120 40 L60 -40 L80 -20 L-90 70 Z" fill={C.plane} stroke={C.sepia} strokeWidth="3" />
      <path d="M40 -32 L96 -200 L130 -196 L104 -26 Z" fill={C.plane} stroke={C.sepia} strokeWidth="3" />
      <path d="M58 -90 L112 -100 L108 -78 L52 -70 Z" fill={C.blood} />
      <path d="M-100 52 L70 -26" stroke={C.blood} strokeWidth="8" />
      {[-60, -30, 0, 30].map((x) => (
        <rect key={x} x={x} y={-4 - (x + 60) * 0.44} width={12} height={9} fill={C.planeShade} transform={`rotate(-24 ${x} ${-(x + 60) * 0.44})`} />
      ))}
      <path d="M-120 40 L60 -40 L80 -20 L-90 70 Z" fill={C.planeShade} opacity="0.3" />
    </g>
  )
}

/** The tower on its rocks: the steps up from the water, the stepped deco shaft, the doors and their lamps,
 *  the lantern room and its beam. */
function Tower() {
  const { x, width, top } = TOWER
  const steps = Array.from({ length: 4 }, (_, i) => i)
  return (
    <g>
      <g data-fx="beam" transform={`rotate(0 ${x + width / 2} ${top + 40})`}>
        <path d={`M${x + width / 2} ${top + 40} L${x - 760} ${top - 60} L${x - 760} ${top + 160} Z`} fill={C.lamp} opacity="0.16" />
      </g>
      <path d={`M${x - 90} ${SURFACE + 20} Q${x - 40} -150 ${x + 60} -120 Q${x + 200} -150 ${x + 260} ${SURFACE + 20} Z`} fill={C.cabinetMid} stroke={C.sepia} strokeWidth="3" />
      <path d={`M${x - 60} ${SURFACE} Q${x} -100 ${x + 60} -90`} fill="none" stroke={C.brassLine} strokeWidth="4" />
      <path
        d={`M${x} ${DOOR.y} V${top + 180} H${x + 14} V${top + 120} H${x + 30} V${top + 80} H${x + width - 30} V${top + 120} H${x + width - 14} V${top + 180} H${x + width} V${DOOR.y} Z`}
        fill={C.cabinetTop}
        stroke={C.brassMid}
        strokeWidth="4"
      />
      {[0.3, 0.5, 0.7].map((share) => (
        <path key={share} d={`M${x + width * share} ${top + 130} V${DOOR.y - 150}`} stroke={C.brassDark} strokeWidth="4" />
      ))}
      <rect x={x + 30} y={top} width={width - 60} height={80} fill={C.abyss} stroke={C.brassMid} strokeWidth="4" />
      <circle data-fx="lantern" cx={x + width / 2} cy={top + 40} r={26} fill={C.lamp} />
      <path d={`M${x + 20} ${top} L${x + width / 2} ${top - 60} L${x + width - 20} ${top} Z`} fill={C.brassMid} stroke={C.gold} strokeWidth="3" />
      {steps.map((i) => (
        <rect key={i} x={STEPS_AT + i * STEP_RUN - 6} y={SURFACE + 12 - (i + 1) * STEP_RISE} width={DOOR.x - STEPS_AT - i * STEP_RUN + 60} height={STEP_RISE} fill={C.stoneShade} stroke={C.sepia} strokeWidth="2" />
      ))}
      <rect x={DOOR.x - 50} y={DOOR.y - 150} width={100} height={150} fill={C.abyss} stroke={C.gold} strokeWidth="4" />
      <rect data-fx="doorway" x={DOOR.x - 46} y={DOOR.y - 146} width={92} height={146} fill={C.lamp} opacity="0" />
      <path d={`M${DOOR.x - 60} ${DOOR.y - 150} L${DOOR.x} ${DOOR.y - 200} L${DOOR.x + 60} ${DOOR.y - 150} Z`} fill={C.brassMid} stroke={C.gold} strokeWidth="3" />
      <g data-fx="door-left" transform={`translate(${DOOR.x - 46} 0)`}>
        <rect x={0} y={DOOR.y - 146} width={46} height={146} fill={C.brassDark} stroke={C.gold} strokeWidth="2" />
        <path d={`M8 ${DOOR.y - 130} H38 M8 ${DOOR.y - 70} H38`} stroke={C.gold} strokeWidth="2" />
      </g>
      <g data-fx="door-right" transform={`translate(${DOOR.x + 46} 0)`}>
        <rect x={-46} y={DOOR.y - 146} width={46} height={146} fill={C.brassDark} stroke={C.gold} strokeWidth="2" />
        <path d={`M-38 ${DOOR.y - 130} H-8 M-38 ${DOOR.y - 70} H-8`} stroke={C.gold} strokeWidth="2" />
      </g>
      {[DOOR.x - 74, DOOR.x + 74].map((lampX, i) => (
        <g key={lampX}>
          <rect x={lampX - 8} y={DOOR.y - 120} width={16} height={26} fill={C.cabinetMid} stroke={C.brassMid} strokeWidth="2" />
          <g data-fx={`lamp-${i}`} opacity="0">
            <circle cx={lampX} cy={DOOR.y - 107} r={44} fill={C.lamp} opacity="0.3" />
            <rect x={lampX - 5} y={DOOR.y - 116} width={10} height={18} fill={C.lamp} />
          </g>
        </g>
      ))}
    </g>
  )
}

/** The black water in front of him, to the frame's foot, so whatever is under the surface is hidden. */
function Water() {
  return (
    <g>
      <rect x={-1400} y={SURFACE} width={2800} height={300} fill={C.nightSea} />
      <path d={`M-1400 ${SURFACE} H1400`} stroke={C.nightHorizon} strokeWidth="4" />
      {[-60, 40, 210, 300].map((x, i) => (
        <path key={x} d={`M${x} ${SURFACE + 14 + i * 9} h${70 + i * 10}`} stroke={C.fire} strokeWidth="3" opacity="0.45" />
      ))}
    </g>
  )
}

const FLAMES_BACK = [
  { name: 'flame-0', x: -30, size: 90 },
  { name: 'flame-1', x: 60, size: 130 },
  { name: 'flame-2', x: 230, size: 70 },
]
const FLAMES_FRONT = [
  { name: 'flame-3', x: 10, size: 60 },
  { name: 'flame-4', x: 170, size: 80 },
]

// His feet under the water while he treads it; flat on the water while he swims; on the steps as he climbs.
const TREAD_LIFT = { under: -260, up: -150 }
const SWIM_LIFT = -6

export const hero = fightChamber({
  light: C.lamp,
  script: [1400, 1900, 1600],
  room: { sky: () => <NightSea />, far: null, mid: null, near: null, fg: null },
  back: () => (
    <>
      <Tower />
      <g transform={`translate(110 ${SURFACE})`}>
        <Tail />
      </g>
      {FLAMES_BACK.map((flame) => (
        <Flame key={flame.name} {...flame} />
      ))}
    </>
  ),
  front: () => (
    <>
      <Water />
      {FLAMES_FRONT.map((flame) => (
        <Flame key={flame.name} {...flame} />
      ))}
    </>
  ),
  bind: (stage, { profession }) => {
    const tail = fx(stage, 'tail')
    const beam = fx(stage, 'beam')
    const doorway = fx(stage, 'doorway')
    const doors = [fx(stage, 'door-left'), fx(stage, 'door-right')]
    const lamps = [fx(stage, 'lamp-0'), fx(stage, 'lamp-1')]
    const flames = [...FLAMES_BACK, ...FLAMES_FRONT].map(({ name }, i) => ({ node: fx(stage, name), seed: i * 1.7 }))
    const beamAt = `${TOWER.x + TOWER.width / 2} ${TOWER.top + 40}`
    return (play): Frame => {
      const surfaced = share(play, 0)
      const swum = share(play, 1)
      const climbed = share(play, 2)
      const whole = (surfaced + swum + climbed) / 3
      // the tail settles and tips as it goes under, the fire on the water dies down behind him
      transformTo(tail, `translate(0 ${(SINK * whole).toFixed(1)}) rotate(${(-12 * whole).toFixed(1)})`)
      flames.forEach(({ node, seed }) => {
        const flicker = 1 + 0.12 * Math.sin(whole * 40 + seed)
        transformTo(node, `scale(${(flicker * (1 - 0.6 * whole)).toFixed(3)})`)
      })
      transformTo(beam, `rotate(${(-40 + 70 * whole).toFixed(1)} ${beamAt})`)
      const lit = ramp(climbed, 0.4, 0.8)
      fadeTo(doorway, lit * 0.85)
      lamps.forEach((lamp) => fadeTo(lamp, lit))
      transformTo(doors[0], `translate(${(DOOR.x - 46).toFixed(1)} 0) scale(${(1 - 0.8 * lit).toFixed(3)} 1)`)
      transformTo(doors[1], `translate(${(DOOR.x + 46).toFixed(1)} 0) scale(${(1 - 0.8 * lit).toFixed(3)} 1)`)

      if (swum === 0) {
        // up out of the black water among the flames, treading it
        return { pose: tread(surfaced * 3), ahead: UP_AT, lift: lerp(TREAD_LIFT.under, TREAD_LIFT.up, ramp(surfaced, 0, 0.7)) }
      }
      if (climbed === 0) {
        // forward onto the water, the crawl out of the fire, and up onto the first step
        const down = ramp(swum, 0, 0.18)
        const up = ramp(swum, 0.84, 1)
        const strokes = swim(swum * 7)
        const lying = mix(tread(3), strokes, down)
        const pose = up > 0 ? mix(strokes, rest(profession), up) : lying
        const lift = up > 0 ? lerp(SWIM_LIFT, -SURFACE - 12 + STEP_RISE, up) : lerp(TREAD_LIFT.up, SWIM_LIFT, down) + 4 * bell(swum, 0.2, 0.84) * Math.sin(swum * 30)
        const ahead = up > 0 ? lerp(STEPS_AT - BODY_LENGTH, STEPS_AT - 10, up) : lerp(UP_AT, STEPS_AT - BODY_LENGTH, ramp(swum, 0.1, 0.84))
        return { pose: { ...pose, shadow: 0 }, ahead, lift }
      }
      // up the steps to the doors, one step a stride
      const stepped = ramp(climbed, 0, 0.75)
      const x = lerp(STEPS_AT - 10, DOOR.x - 30, stepped)
      const onStep = Math.min(3, Math.floor((x - STEPS_AT + STEP_RUN) / STEP_RUN))
      const lift = -SURFACE - 12 + STEP_RISE * (1 + Math.max(0, onStep))
      const walking = stride(profession, stepped * 4)
      return { pose: mix(walking, rest(profession), ramp(climbed, 0.75, 1)), ahead: x, lift: Math.min(lift, -DOOR.y) }
    }
  },
})
