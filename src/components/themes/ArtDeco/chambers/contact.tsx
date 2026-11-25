import { ramp } from '@/lib/scroll/stage'
import { mix } from '@/lib/motion/rigPose'
import { bell, fadeTo, fx, fxAll, lerp, transformTo, translateTo } from '../../shared/stageNodes'
import { DECO_COLORS as C } from '../palette'
import { fightChamber, share } from '../chamber'
import { Canvas, W } from '../city'
import { LittleOne } from '../cast'
import { rest, stride } from '../pose'

// Contact: the way back up. The sphere climbs through water going from black to blue, its window lit by
// the little ones' lamps inside; then it surfaces at the tower's dock in the morning, its door swings open
// on daylight, he steps out onto the warm stone and the little ones climb out after him onto the steps. The
// end frame is the sphere at the dock, the little ones on the steps and the sea calm. He is inside the
// sphere, behind its shell, until he steps out of its door: drawn once.

const SPHERE = { x: 150, y: -230, r: 200 }
const DOCK = { from: 300, y: -70 }
// The water line at the dock, and where he and the little ones stand on the stone.
const SEA = -40
const STAND_AT = 420
const LITTLE = [{ to: 365 }, { to: 490 }]
// Inside the sphere his soles stand this high, so the shell hides all of him.
const INSIDE = 80
// The sphere rises this far through the deep before it surfaces.
const CLIMB = 700

/** The deep, black at the foot and blue toward the light, as a tall wash `data-fx="deep"` slides down. */
function Deep() {
  return (
    <Canvas>
      <defs>
        <linearGradient id="deco-rise" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.tealLight} />
          <stop offset="0.4" stopColor={C.seaMid} />
          <stop offset="0.75" stopColor={C.abyss} />
          <stop offset="1" stopColor={C.abyss} />
        </linearGradient>
        <linearGradient id="deco-morning" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.daySky} />
          <stop offset="0.62" stopColor={C.dawnSky} />
          <stop offset="0.63" stopColor={C.daySea} />
          <stop offset="1" stopColor={C.seaMid} />
        </linearGradient>
      </defs>
      <g data-fx="deep">
        <rect x={-200} y={-2000} width={W + 400} height={3000} fill="url(#deco-rise)" />
        {Array.from({ length: 24 }, (_, i) => ({ x: (i * 211) % W, y: -1900 + ((i * 337) % 2800), r: 4 + (i % 4) * 3 })).map(({ x, y, r }) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="none" stroke={C.waterGlow} strokeWidth="2" opacity="0.5" />
        ))}
      </g>
      <g data-fx="morning" opacity="0">
        <rect x={-200} width={W + 400} height={1000} fill="url(#deco-morning)" />
        <circle cx={1350} cy={600} r={90} fill={C.ivory} opacity="0.9" />
        <circle cx={1350} cy={600} r={220} fill={C.dawnSky} opacity="0.35" />
        {[680, 740, 810, 890].map((y, i) => (
          <path key={y} d={`M${1350 - 60 - i * 30} ${y} H${1350 + 60 + i * 30}`} stroke={C.ivory} strokeWidth="4" opacity={0.5 - i * 0.1} />
        ))}
      </g>
    </Canvas>
  )
}

/** The dock at the foot of the tower: warm stone steps down to the water, the tower's base beyond. */
function Dock() {
  const steps = [0, 1, 2]
  return (
    <g>
      <path d={`M${DOCK.from + 220} ${DOCK.y} V-620 H${DOCK.from + 236} V-660 H${DOCK.from + 334} V-620 H${DOCK.from + 350} V${DOCK.y} Z`} fill={C.stone} stroke={C.stoneShade} strokeWidth="4" />
      <path d={`M${DOCK.from + 220} -700 H${DOCK.from + 350} M${DOCK.from + 240} -600 H${DOCK.from + 330}`} stroke={C.brassMid} strokeWidth="6" />
      <rect x={DOCK.from + 255} y={DOCK.y - 120} width={60} height={120} fill={C.cabinetTop} stroke={C.brassMid} strokeWidth="4" />
      <rect x={DOCK.from} y={DOCK.y} width={460} height={-DOCK.y + 40} fill={C.stone} stroke={C.stoneShade} strokeWidth="4" />
      {steps.map((i) => (
        <rect key={i} x={DOCK.from - 30 - i * 30} y={DOCK.y + 12 + i * 12} width={40} height={12} fill={C.stoneShade} />
      ))}
      <path d={`M${DOCK.from} ${DOCK.y} H${DOCK.from + 460}`} stroke={C.ivory} strokeWidth="3" opacity="0.6" />
    </g>
  )
}

/** The sphere: brass shell, its round window lit, and its door on the dock side in `data-fx="door"`
 *  swinging open on its hinge. */
function Sphere() {
  const { r } = SPHERE
  return (
    <g>
      <path d={`M0 ${-r - 400} V${-r}`} stroke={C.steelShade} strokeWidth="6" />
      <circle cx={0} cy={0} r={r} fill={C.brassMid} stroke={C.brassRimDark} strokeWidth="8" />
      <circle cx={0} cy={0} r={r - 26} fill="none" stroke={C.gold} strokeWidth="3" />
      {Array.from({ length: 12 }, (_, i) => (i * Math.PI) / 6).map((angle) => (
        <circle key={angle} cx={Math.cos(angle) * (r - 13)} cy={Math.sin(angle) * (r - 13)} r={6} fill={C.boltHead} />
      ))}
      <circle cx={-40} cy={-10} r={56} fill={C.lamp} stroke={C.boltHead} strokeWidth="10" />
      <circle cx={-40} cy={-10} r={120} fill={C.lamp} opacity="0.15" />
      <rect x={r - 30} y={-80} width={36} height={170} fill={C.lamp} opacity="0.6" />
      <g data-fx="door">
        <rect x={r - 34} y={-84} width={40} height={176} rx={14} fill={C.brassMid} stroke={C.gold} strokeWidth="4" />
        <circle cx={r - 22} cy={6} r={6} fill={C.boltHead} />
      </g>
    </g>
  )
}

export const contact = fightChamber({
  light: C.lamp,
  script: [2000, 2400],
  room: { sky: () => <Deep />, far: null, mid: null, near: null, fg: null },
  back: () => (
    <>
      <g data-fx="dock" opacity="0">
        <Dock />
      </g>
      {LITTLE.map((_, i) => (
        <g key={i} data-fx={`kid-${i}`} transform={`translate(${SPHERE.x} ${SPHERE.y + 60})`}>
          {/* turned to face the dock they walk out to */}
          <g transform="scale(-1 1)">
            <LittleOne name={`kid-body-${i}`} />
          </g>
        </g>
      ))}
    </>
  ),
  front: () => (
    <>
      <g data-fx="sphere" transform={`translate(${SPHERE.x} ${SPHERE.y + CLIMB})`}>
        <Sphere />
      </g>
      <g data-fx="sea" opacity="0">
        <rect x={-1400} y={SEA} width={2800} height={300} fill={C.daySea} opacity="0.9" />
        <path d={`M-1400 ${SEA} H1400`} stroke={C.ivory} strokeWidth="3" opacity="0.6" />
      </g>
    </>
  ),
  bind: (stage, { profession }) => {
    const deep = fx(stage, 'deep')
    const morning = fx(stage, 'morning')
    const dock = fx(stage, 'dock')
    const sea = fx(stage, 'sea')
    const sphere = fx(stage, 'sphere')
    const door = fx(stage, 'door')
    const kids = LITTLE.map((_, i) => fx(stage, `kid-${i}`))
    const glows = fxAll(stage, 'kid-body-').filter((node) => node.getAttribute('data-fx')?.endsWith('-glow'))
    return (play) => {
      const rose = share(play, 0)
      const opened = share(play, 1)
      // up through the deep: the wash slides down past it from black to blue, then the surface
      translateTo(deep, 0, 1800 * rose)
      const surfaced = ramp(rose, 0.85, 1)
      fadeTo(morning, surfaced)
      fadeTo(dock, surfaced)
      fadeTo(sea, surfaced)
      const bob = 6 * Math.sin(opened * 8) * (1 - ramp(opened, 0.6, 1))
      const below = lerp(CLIMB, 0, ramp(rose, 0, 0.9)) + bob
      translateTo(sphere, SPHERE.x, SPHERE.y + below)
      // the door swings open on daylight, then he steps out, then the little ones after him
      // seen edge on as it swings out toward the dock
      const hinge = SPHERE.r + 6
      transformTo(door, `translate(${hinge} 0) scale(${(1 - 0.85 * ramp(opened, 0, 0.2)).toFixed(3)} 1) translate(${-hinge} 0)`)
      const out = ramp(opened, 0.2, 0.55)
      kids.forEach((place, i) => {
        const came = ramp(opened, 0.45 + i * 0.15, 0.75 + i * 0.12)
        const x = lerp(SPHERE.x, LITTLE[i].to, came)
        const y = lerp(SPHERE.y + 60 + below, DOCK.y, ramp(came, 0, 0.4)) - 10 * bell(came, 0, 0.5)
        translateTo(place, x, y)
      })
      glows.forEach((node) => fadeTo(node, 0.35 * (1 - surfaced) + 0.15))
      // inside, he rises with the sphere; out of its door he steps up onto the dock
      const ahead = lerp(SPHERE.x - 20, STAND_AT, out)
      const lift = lerp(INSIDE - below, -DOCK.y, ramp(out, 0.3, 0.7))
      const walking = out > 0 && out < 1 ? stride(profession, out * 4) : rest(profession)
      return { pose: mix(walking, { ...rest(profession), head: -6 }, ramp(opened, 0.6, 1)), ahead, lift }
    }
  },
})
