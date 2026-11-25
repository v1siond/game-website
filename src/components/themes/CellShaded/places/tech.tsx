import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { BanditBoss, Console, Part, Runner } from '../cast'
import { HOURS } from '../desert'
import { Burst } from '../ink'
import { CEL } from '../palette'
import { stopsPlace } from '../place'
import { DRIVE, PUSH, rest, snipe, stride } from '../pose'

// Tech Stack, the station that builds a car (notes L45 to L46, L104, L144, [1] [9] [10]): a raider took the
// part the station needs. From the canyon lip one long shot drops the raider boss on his ledge, and the part
// falls to the sand. At the station he pushes it into the console, which lights; then the station builds a
// car on its pad in a beam, line by line, he jumps in and roars off in a dust trail.

const LEDGE = { x: 420, y: -170 }
const CONSOLE = 140
const PAD = 330
// The part's fall from the ledge, and where he holds it at the console.
const PART = { from: { x: 380, y: -230 }, lands: { x: 300, y: -20 } }
const SEAT = { ahead: PAD - 20, lift: 60 }
const DRIVES = 100

export const tech = stopsPlace({
  hour: HOURS.town,
  // a step left of the usual place, so he and the car are still in the frame as he drives off
  at: (phone) => (phone ? 530 : 790),
  script: [1500, 1500, 1900],
  ends: [0.32, 0.6, 1],
  back: () => (
    <>
      <g data-fx="lookout" transform={`translate(${LEDGE.x} ${LEDGE.y})`}>
        <rect x={-120} y={0} width={360} height={-LEDGE.y} fill={CEL.mesa} />
        <g data-fx="boss" transform="scale(0.55)">
          <BanditBoss />
        </g>
      </g>
      <g transform={`translate(${CONSOLE} 0)`} data-fx="console" opacity="0">
        <Console />
      </g>
      <g data-fx="pad" opacity="0">
        <ellipse cx={PAD} cy={0} rx={190} ry={20} fill={CEL.steelDark} />
        <path data-fx="beam" d={`M${PAD - 170} 0 L${PAD - 150} -260 L${PAD + 150} -260 L${PAD + 170} 0 Z`} fill={CEL.holo} opacity="0" data-bare />
      </g>
      <g data-fx="car" transform={`translate(${PAD} 0)`}>
        <g data-fx="car-build" transform="scale(1 0)">
          <Runner />
        </g>
      </g>
      <g data-fx="part">
        <g transform="scale(0.8)">
          <Part />
        </g>
      </g>
      <g data-fx="shot" opacity="0">
        <path d={`M150 -190 L${LEDGE.x} ${LEDGE.y - 120}`} stroke={CEL.sun} strokeWidth="5" data-bare />
        <Burst x={LEDGE.x} y={LEDGE.y - 120} r={40} fill={CEL.crit} />
      </g>
      <g data-fx="trail" opacity="0">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={PAD - 200 - 70 * i} cy={-30 - 10 * i} r={30 - 6 * i} fill={CEL.dune} />
        ))}
      </g>
    </>
  ),
  move: (profession, t) => {
    if (t < 0.32) return { pose: snipe(ramp(t, 0, 0.32), 0.55), ahead: 0, lift: 0 }
    if (t < 0.6) {
      const walk = ramp(t, 0.34, 0.48)
      return { pose: walk < 1 ? stride(profession, 4 * walk) : mix(rest(profession), PUSH, ramp(t, 0.5, 0.56)), ahead: (CONSOLE - 90) * walk, lift: 0 }
    }
    const jump = ramp(t, 0.78, 0.86)
    const off = ramp(t, 0.88, 1)
    if (jump === 0) return { pose: rest(profession), ahead: CONSOLE - 90, lift: 0 }
    const ahead = CONSOLE - 90 + (SEAT.ahead - CONSOLE + 90) * jump + DRIVES * off * off
    return { pose: mix(rest(profession), DRIVE, jump), ahead, lift: SEAT.lift * jump + 80 * jump * (1 - jump) }
  },
  reply: (stage) => {
    const boss = fx(stage, 'boss')
    const lookout = fx(stage, 'lookout')
    const shot = fx(stage, 'shot')
    const part = fx(stage, 'part')
    const station = fx(stage, 'console')
    const light = fx(stage, 'console-light')
    const pad = fx(stage, 'pad')
    const beam = fx(stage, 'beam')
    const car = fx(stage, 'car')
    const build = fx(stage, 'car-build')
    const trail = fx(stage, 'trail')
    return (t) => {
      fadeTo(shot, ramp(t, 0.17, 0.18) * (1 - ramp(t, 0.22, 0.26)))
      transformTo(boss, `scale(0.55) rotate(${(80 * ramp(t, 0.19, 0.26)).toFixed(1)})`)
      // the part drops to the sand, then into the console in his hands
      const drop = ramp(t, 0.2, 0.3)
      const into = ramp(t, 0.5, 0.56)
      const x = t < 0.5 ? PART.from.x + (PART.lands.x - PART.from.x) * drop : PART.lands.x + (CONSOLE - PART.lands.x) * into
      const y = t < 0.5 ? PART.from.y + (PART.lands.y - PART.from.y) * drop * drop : PART.lands.y + (-150 - PART.lands.y) * into
      transformTo(part, `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(400 * drop).toFixed(1)})`)
      fadeTo(part, t < 0.18 ? 0 : 1 - ramp(t, 0.56, 0.58))
      // he leaves the raider's lookout behind for the station
      fadeTo(lookout, 1 - ramp(t, 0.3, 0.36))
      fadeTo(station, ramp(t, 0.3, 0.36))
      fadeTo(light, ramp(t, 0.56, 0.6))
      // the pad lights and the beam builds the car on it from the wheels up, then it roars off
      fadeTo(pad, ramp(t, 0.58, 0.62))
      fadeTo(beam, 0.5 * Math.sin(Math.PI * ramp(t, 0.6, 0.8)))
      transformTo(build, `translate(0 0) scale(1 ${ramp(t, 0.62, 0.78).toFixed(3)})`)
      const off = ramp(t, 0.88, 1)
      transformTo(car, `translate(${(PAD + DRIVES * off * off).toFixed(1)} 0)`)
      // his dust trail hangs behind the car and settles before the end
      fadeTo(trail, ramp(t, 0.9, 0.94) * (1 - ramp(t, 0.96, 1)))
    }
  },
})
