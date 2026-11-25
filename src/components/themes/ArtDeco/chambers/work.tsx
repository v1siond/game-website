import { ramp } from '@/lib/scroll/stage'
import { mix } from '@/lib/motion/rigPose'
import { bell, fadeTo, fx, lerp, translateTo } from '../../shared/stageNodes'
import { DECO_COLORS as C } from '../palette'
import { fightChamber, share } from '../chamber'
import { Canvas, FLOOR, Floor, W } from '../city'
import { Tenant } from '../cast'
import { holdStill, listen, rest, stride } from '../pose'

// Work: the voice and the first rooms. The flooded reception hall, a bronze statue of the city's builder on
// its plinth and the sea pouring in through a crack in the dome. A wall radio rings; he lifts its handset
// and its dial glows while the keeper's voice, a friendly one, tells him the way; he wades through the
// water to the far door; then the lights fail, and he holds still under the one lamp still lit while a
// tenant's shadow passes behind the frosted glass, and goes.

const RADIO = { x: 92, y: -250 }
const DOOR = { x: 500, width: 110, height: 250 }
const GLASS = { from: 150, to: 430, top: -330, foot: -40 }
// He wades from his place to the door, the water to his shins.
const AT_DOOR = 420
const WATER = -46

/** The dome's crack and the sea pouring through it in a column down into the hall, and the statue. */
function Flood() {
  return (
    <Canvas>
      <path d="M840 150 L870 210 L850 260 L890 330" fill="none" stroke={C.abyss} strokeWidth="6" />
      <path d="M864 210 Q880 520 900 860 L960 860 Q930 520 884 210 Z" fill={C.waterGlow} opacity="0.32" />
      <path d="M872 230 Q886 520 910 860" fill="none" stroke={C.ivory} strokeWidth="3" opacity="0.4" />
      <ellipse cx={930} cy={858} rx={110} ry={16} fill={C.ivory} opacity="0.25" />
      <g transform="translate(1440 0)">
        <path d="M-90 880 V760 H90 V880 Z M-70 760 V730 H70 V760 Z" fill={C.cabinetTop} stroke={C.brassMid} strokeWidth="4" />
        <path d="M-26 730 L-30 610 L-56 520 L-36 420 Q0 396 36 420 L52 500 L96 420 L110 430 L70 530 L34 610 L30 730 Z" fill={C.brassDark} stroke={C.sepia} strokeWidth="4" />
        <path d="M-20 430 Q-30 520 -20 600" fill="none" stroke={C.bronze} strokeWidth="6" opacity="0.6" />
        <path d="M-30 384 Q-30 350 0 348 Q30 350 30 384 Q28 414 0 418 Q-28 414 -30 384 Z" fill={C.brassDark} stroke={C.sepia} strokeWidth="4" />
        <path d="M-22 372 Q0 356 22 372" fill="none" stroke={C.bronze} strokeWidth="5" opacity="0.6" />
        <path d="M-30 520 H40" stroke={C.brassDark} strokeWidth="5" />
      </g>
    </Canvas>
  )
}

/** The marble floor under a sheet of sea water, and its ripples. */
function FloodedFloor() {
  return (
    <>
      <Floor />
      <Canvas>
        <rect x={-200} y={FLOOR + WATER} width={W + 400} height={1000 - FLOOR - WATER} fill={C.seaMid} opacity="0.55" />
        <path d={`M-200 ${FLOOR + WATER} H1800`} stroke={C.waterGlow} strokeWidth="3" opacity="0.6" />
      </Canvas>
    </>
  )
}

/** The wall radio: a stepped deco cabinet with its speaker grille, the round dial in `data-fx="dial"` and
 *  the hook the handset hangs on. */
function Radio() {
  return (
    <g>
      <path d="M-50 70 V-40 H-38 V-56 H38 V-40 H50 V70 Z" fill={C.cabinetTop} stroke={C.brassMid} strokeWidth="4" />
      {[-24, -12, 0, 12, 24].map((x) => (
        <path key={x} d={`M${x} 20 V60`} stroke={C.brassDark} strokeWidth="4" />
      ))}
      <circle cx={0} cy={-12} r={22} fill={C.abyss} stroke={C.gold} strokeWidth="3" />
      <g data-fx="dial" opacity="0">
        <circle cx={0} cy={-12} r={60} fill={C.goldBright} opacity="0.2" />
        <circle cx={0} cy={-12} r={19} fill={C.goldBright} opacity="0.9" />
      </g>
      <path d="M0 -12 L12 -24" stroke={C.blood} strokeWidth="3" />
      <g data-fx="cradle">
        <path d="M-58 -10 Q-70 -30 -58 -50 L-52 -50 Q-62 -30 -52 -10 Z" fill={C.abyss} stroke={C.brassMid} strokeWidth="2" />
      </g>
      <path d="M-56 -10 Q-80 60 -40 120" fill="none" stroke={C.abyss} strokeWidth="3" />
      <g data-fx="voice" opacity="0">
        {[30, 48, 66].map((r) => (
          <path key={r} d={`M${60 + r * 0.2} ${-12 - r * 0.6} Q${60 + r} -12 ${60 + r * 0.2} ${-12 + r * 0.6}`} fill="none" stroke={C.goldBright} strokeWidth="3" />
        ))}
      </g>
    </g>
  )
}

/** The far door with the one lamp over it, whose light stays on when the others fail. */
function Door() {
  const { width, height } = DOOR
  return (
    <g>
      <path d={`M${-width / 2 - 16} 0 V${-height - 10} L0 ${-height - 50} L${width / 2 + 16} ${-height - 10} V0 Z`} fill={C.brassDark} stroke={C.gold} strokeWidth="4" />
      <rect x={-width / 2} y={-height} width={width} height={height} fill={C.cabinetMid} />
      <path d={`M0 ${-height} V0 M${-width / 2 + 14} ${-height / 2} H${-10} M${10} ${-height / 2} H${width / 2 - 14}`} stroke={C.brassMid} strokeWidth="4" />
      <rect x={-12} y={-height - 96} width={24} height={30} fill={C.cabinetTop} stroke={C.brassMid} strokeWidth="3" />
      <rect x={-8} y={-height - 90} width={16} height={18} fill={C.lamp} />
    </g>
  )
}

/** The frosted glass partition, its brass frame and three panes of milky glass. */
function Glass() {
  const { from, to, top, foot } = GLASS
  const panes = [0, 1, 2].map((i) => from + ((to - from) / 3) * i)
  return (
    <g>
      {panes.map((x) => (
        <rect key={x} x={x + 6} y={top + 6} width={(to - from) / 3 - 12} height={foot - top - 12} fill={C.mist} opacity="0.42" />
      ))}
      <rect x={from} y={top} width={to - from} height={foot - top} fill="none" stroke={C.brassMid} strokeWidth="8" />
      {panes.slice(1).map((x) => (
        <path key={x} d={`M${x} ${top} V${foot}`} stroke={C.brassMid} strokeWidth="6" />
      ))}
      <path d={`M${from + 30} ${top + 60} L${from + 70} ${top + 20}`} stroke={C.ivory} strokeWidth="4" opacity="0.4" />
    </g>
  )
}

// The tenant's shadow walks behind the glass from right to left at this scale.
const SHADE_SCALE = 0.85

export const work = fightChamber({
  light: C.waterGlow,
  script: [1300, 1800, 1800],
  set: () => <Flood />,
  room: { near: () => <FloodedFloor /> },
  back: () => (
    <>
      <g transform={`translate(${DOOR.x} 0)`}>
        <Door />
      </g>
      <g data-fx="shade" transform={`translate(${GLASS.to + 80} ${GLASS.foot}) scale(${SHADE_SCALE})`}>
        <Tenant name="shade-body" shade />
      </g>
      <Glass />
      <g transform={`translate(${RADIO.x} ${RADIO.y})`}>
        <Radio />
      </g>
    </>
  ),
  front: () => (
    <>
      <rect x={-1400} y={WATER} width={2800} height={300} fill={C.seaMid} opacity="0.55" />
      <path d={`M-1400 ${WATER} H1400`} stroke={C.waterGlow} strokeWidth="3" opacity="0.6" />
      <g data-fx="wake" opacity="0">
        <path d="M-60 -46 Q-20 -60 20 -46 M-100 -40 Q-60 -52 -20 -40" fill="none" stroke={C.ivory} strokeWidth="3" />
      </g>
      <g data-fx="dark" opacity="0">
        <rect x={-1400} y={-1100} width={2800} height={1400} fill={C.abyss} opacity="0.72" />
        <path d={`M${DOOR.x} ${-DOOR.height - 80} L${DOOR.x - 180} 0 L${DOOR.x + 160} 0 Z`} fill={C.lamp} opacity="0.16" />
      </g>
    </>
  ),
  bind: (stage, { profession }) => {
    const dial = fx(stage, 'dial')
    const voice = fx(stage, 'voice')
    const cradle = fx(stage, 'cradle')
    const shade = fx(stage, 'shade')
    const dark = fx(stage, 'dark')
    const wake = fx(stage, 'wake')
    return (play) => {
      const lifted = share(play, 0)
      const waded = share(play, 1)
      const held = share(play, 2)
      const talking = ramp(lifted, 0.45, 0.6) * (1 - ramp(waded, 0, 0.15))
      fadeTo(dial, talking)
      fadeTo(voice, talking * (0.6 + 0.4 * Math.sin(lifted * 40)))
      fadeTo(cradle, 1 - ramp(lifted, 0.3, 0.45) + ramp(waded, 0, 0.15))
      // the lights fail all at once, then the shadow crosses the glass and is gone
      fadeTo(dark, ramp(held, 0, 0.12))
      const crossing = ramp(held, 0.2, 0.9)
      translateTo(shade, lerp(GLASS.to + 80, GLASS.from - 140, crossing), GLASS.foot + 4 * Math.sin(crossing * 30))
      fadeTo(shade, crossing > 0 && crossing < 1 ? 1 : 0)
      const ahead = AT_DOOR * ramp(waded, 0.1, 0.9)
      fadeTo(wake, bell(waded, 0.1, 0.9))
      translateTo(wake, ahead, 0)
      if (held > 0) return { pose: holdStill(profession, ramp(held, 0.05, 0.3)), ahead, lift: 0 }
      if (waded > 0) {
        const hung = mix(listen(profession, 1), rest(profession), ramp(waded, 0, 0.15))
        return { pose: mix(hung, stride(profession, waded * 5), ramp(waded, 0.1, 0.25) * (1 - ramp(waded, 0.85, 1))), ahead, lift: 0 }
      }
      return { pose: listen(profession, lifted), ahead: 0, lift: 0 }
    }
  },
})
