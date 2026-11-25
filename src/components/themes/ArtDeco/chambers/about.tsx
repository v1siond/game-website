import { ramp } from '@/lib/scroll/stage'
import { mix } from '@/lib/motion/rigPose'
import { bell, fadeTo, fx, fxAll, lerp, transformTo, translateTo } from '../../shared/stageNodes'
import { DECO_COLORS as C } from '../palette'
import { fightChamber, share, still } from '../chamber'
import { Canvas, FLOOR, W } from '../city'
import { gaze, pull } from '../pose'

// About: the descent. Inside the sphere at the top of the tower he pulls its lever and the hatch over him
// shuts; the sphere drops through the dark water, past a whale's shadow, the bubbles streaming up past its
// round window; then the drowned city lights up below the window, tower by tower and floor by floor, and
// he leans in to it, its light on his face. Seen from inside, so he is drawn once, beside the window.

// The round window and the lever, from his place.
const PANE = { x: 350, y: -360, r: 220 }
const LEVER = { x: 120, y: -230 }
// The water outside rises past the window this far as the sphere sinks.
const DEPTH = 900

/** The sphere's inside: riveted brass plates curving round him, a pipe or two, the hatch in its ceiling. */
function Shell() {
  return (
    <Canvas>
      <defs>
        <radialGradient id="deco-shell" cx="0.6" cy="0.45" r="0.75">
          <stop offset="0" stopColor={C.cabinetTop} />
          <stop offset="1" stopColor={C.abyss} />
        </radialGradient>
      </defs>
      <rect x={-200} width={W + 400} height={1000} fill="url(#deco-shell)" />
      {[220, 420, 620, 820].map((y) => (
        <path key={y} d={`M-200 ${y} Q800 ${y - 60} 1800 ${y}`} fill="none" stroke={C.brassLine} strokeWidth="6" />
      ))}
      {Array.from({ length: 30 }, (_, i) => ({ x: -100 + (i % 10) * 190, y: 214 + Math.floor(i / 10) * 200 })).map(({ x, y }) => (
        <circle key={`${x}-${y}`} cx={x} cy={y - 18} r={5} fill={C.boltHead} />
      ))}
      <path d="M-200 120 Q800 40 1800 120 V0 H-200 Z" fill={C.cabinetMid} />
    </Canvas>
  )
}

/** The sphere's floor: a brass grating. */
function Deck() {
  return (
    <Canvas>
      <rect x={-200} y={FLOOR} width={W + 400} height={120} fill={C.cabinetFoot} />
      {Array.from({ length: 40 }, (_, i) => -200 + i * 50).map((x) => (
        <path key={x} d={`M${x} ${FLOOR + 6} V1000`} stroke={C.brassLine} strokeWidth="4" />
      ))}
      <path d={`M-200 ${FLOOR} H1800`} stroke={C.brassMid} strokeWidth="5" />
    </Canvas>
  )
}

const TOWERS = [
  { x: -200, width: 70, height: 200 },
  { x: -110, width: 90, height: 300 },
  { x: 0, width: 70, height: 230 },
  { x: 90, width: 100, height: 340 },
  { x: 200, width: 60, height: 180 },
]
const FLOORS = 7

/** What the window sees: the water from the lit shallows down to black, the whale's shadow, the bubbles,
 *  and at the bottom the drowned city, its windows dark until it lights. */
function View() {
  const { r } = PANE
  return (
    <g>
      <defs>
        <clipPath id="deco-pane">
          <circle cx={0} cy={0} r={r} />
        </clipPath>
        <linearGradient id="deco-deep" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.tealLight} />
          <stop offset="0.35" stopColor={C.seaMid} />
          <stop offset="0.7" stopColor={C.deepSea} />
          <stop offset="1" stopColor={C.abyss} />
        </linearGradient>
      </defs>
      <g clipPath="url(#deco-pane)">
        <g data-fx="water">
          <rect x={-r} y={-r} width={r * 2} height={r * 2 + DEPTH} fill="url(#deco-deep)" />
        </g>
        <g data-fx="whale" opacity="0.6">
          <path d="M-120 0 Q-60 -40 60 -24 Q120 -20 150 -40 L140 -4 L160 26 Q110 10 60 22 Q-40 40 -120 0 Z" fill={C.abyss} />
        </g>
        <g data-fx="bubbles-up">
          {Array.from({ length: 14 }, (_, i) => ({ x: -r + ((i * 83) % (r * 2)), y: -r + ((i * 131) % (r * 2)), size: 3 + (i % 4) * 2 })).map(({ x, y, size }) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={size} fill="none" stroke={C.waterGlow} strokeWidth="2" opacity="0.6" />
          ))}
        </g>
        <g data-fx="city">
          <rect x={-r} y={r - 30} width={r * 2} height={200} fill={C.abyss} />
          {TOWERS.map(({ x, width, height }) => (
            <g key={x}>
              <path d={`M${x} ${r} V${r - height + 24} H${x + 10} V${r - height + 10} H${x + width - 10} V${r - height + 24} H${x + width} V${r} Z`} fill={C.skylineFar} stroke={C.brassLine} strokeWidth="2" />
              {Array.from({ length: FLOORS }, (_, row) => (
                <g key={row} data-fx={`floor-${row}`} opacity="0">
                  {[0.25, 0.6].map((column) => (
                    <rect key={column} x={x + width * column} y={r - 30 - row * ((height - 40) / FLOORS)} width={8} height={11} fill={C.goldBright} />
                  ))}
                </g>
              ))}
            </g>
          ))}
          <g data-fx="city-glow" opacity="0">
            <rect x={-r} y={r - 260} width={r * 2} height={260} fill={C.goldBright} opacity="0.18" />
          </g>
        </g>
      </g>
      <circle cx={0} cy={0} r={r + 14} fill="none" stroke={C.brassMid} strokeWidth="28" />
      <circle cx={0} cy={0} r={r} fill="none" stroke={C.gold} strokeWidth="4" />
      {Array.from({ length: 12 }, (_, i) => (i * Math.PI) / 6).map((angle) => (
        <circle key={angle} cx={Math.cos(angle) * (r + 14)} cy={Math.sin(angle) * (r + 14)} r={6} fill={C.boltHead} />
      ))}
      <path d={`M${-r * 0.6} ${-r * 0.5} Q${-r * 0.2} ${-r * 0.85} ${r * 0.3} ${-r * 0.8}`} fill="none" stroke={C.ivory} strokeWidth="6" opacity="0.18" />
    </g>
  )
}

/** The lever on its brass box, its handle in `data-fx="handle"` turning on its pivot. */
function Lever() {
  return (
    <g>
      <rect x={-30} y={-40} width={60} height={110} rx={6} fill={C.cabinetTop} stroke={C.brassMid} strokeWidth="4" />
      <path d="M0 70 V230" stroke={C.brassDark} strokeWidth="10" />
      <g data-fx="handle">
        <path d="M0 0 L0 -90" stroke={C.steel} strokeWidth="10" strokeLinecap="round" />
        <circle cx={0} cy={-96} r={14} fill={C.blood} stroke={C.sepia} strokeWidth="3" />
      </g>
      <circle cx={0} cy={0} r={12} fill={C.gold} />
    </g>
  )
}

/** The hatch over him: the shaft of the tower's light down through it, the lid swinging shut over it. */
function Hatch() {
  return (
    <g transform="translate(0 -760)">
      <g data-fx="shaft">
        <path d="M-70 0 L70 0 L150 760 L-150 760 Z" fill={C.lamp} opacity="0.14" />
      </g>
      <ellipse cx={0} cy={0} rx={90} ry={20} fill={C.lamp} opacity="0.5" />
      <g data-fx="lid">
        <ellipse cx={0} cy={0} rx={92} ry={22} fill={C.brassMid} stroke={C.gold} strokeWidth="4" />
        <path d="M-60 0 H60" stroke={C.brassDark} strokeWidth="6" />
      </g>
    </g>
  )
}

const LEAN_AHEAD = 70

export const about = fightChamber({
  light: C.goldBright,
  script: [1300, 1800, 1800],
  room: { sky: () => <Shell />, far: null, mid: null, near: () => <Deck />, fg: null },
  back: () => (
    <>
      <Hatch />
      <g transform={`translate(${PANE.x} ${PANE.y})`}>
        <View />
      </g>
      <g transform={`translate(${LEVER.x} ${LEVER.y})`}>
        <Lever />
      </g>
    </>
  ),
  front: () => (
    <g data-fx="facelight" opacity="0">
      <ellipse cx={120} cy={-240} rx={220} ry={240} fill={C.goldBright} opacity="0.14" />
    </g>
  ),
  bind: (stage, { profession }) => {
    const handle = fx(stage, 'handle')
    const lid = fx(stage, 'lid')
    const shaft = fx(stage, 'shaft')
    const water = fx(stage, 'water')
    const whale = fx(stage, 'whale')
    const bubbles = fx(stage, 'bubbles-up')
    const city = fx(stage, 'city')
    const glow = fx(stage, 'city-glow')
    const faceLight = fx(stage, 'facelight')
    const camera = fx(stage, 'camera')
    const floors = Array.from({ length: FLOORS }, (_, row) => fxAll(stage, `floor-${row}`))
    return (play) => {
      const pulled = share(play, 0)
      const sunk = share(play, 1)
      const lit = share(play, 2)
      transformTo(handle, `rotate(${(160 * ramp(pulled, 0.45, 0.85)).toFixed(1)})`)
      transformTo(lid, `scale(1 ${(1 - ramp(pulled, 0.3, 0.9)).toFixed(3)})`)
      fadeTo(shaft, 1 - ramp(pulled, 0.3, 0.9))
      // the water climbs past the window as the sphere drops, and the city rises into its foot
      translateTo(water, 0, -DEPTH * sunk)
      translateTo(whale, lerp(-PANE.r - 200, PANE.r + 200, ramp(sunk, 0.1, 0.8)), -40 + 20 * sunk)
      fadeTo(whale, 0.6 * bell(sunk, 0.05, 0.85))
      translateTo(bubbles, 0, -260 * (sunk + lit))
      translateTo(city, 0, 240 * (1 - ramp(sunk, 0.4, 1)))
      floors.forEach((nodes, row) => nodes.forEach((node) => fadeTo(node, ramp(lit, row / (FLOORS + 2), (row + 3) / (FLOORS + 2)))))
      fadeTo(glow, lit)
      fadeTo(faceLight, ramp(lit, 0.3, 1))
      // the sphere shudders as it drops
      const shudder = 3 * bell(sunk, 0, 1) * Math.sin(sunk * 60)
      transformTo(camera, `translate(0 ${shudder.toFixed(1)})`)
      const pose = lit > 0 ? gaze(profession, ramp(lit, 0.2, 0.7)) : mix(pull(profession, pulled), gaze(profession, 0), ramp(sunk, 0, 0.3))
      return { ...still(pose), ahead: LEAN_AHEAD * ramp(lit, 0.1, 0.6) }
    }
  },
})
