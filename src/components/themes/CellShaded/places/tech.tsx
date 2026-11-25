import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { hop } from '@/lib/motion/arc'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { Raider } from '../cast/foes'
import { Console, Pad, Part, Runner, RunnerGrid, Tower } from '../cast/props'
import { LANDS } from '../desert'
import { Hits, Scope, Tag, drainWriter, hitsWriter, scopeWriter, type Hit } from '../hud'
import { CEL } from '../palette'
import { stopsPlace } from '../place'
import { DRIVE, PUSH, rest, snipe, stride } from '../pose'

// Tech Stack, the station builds a car (research notes, the story 6, the bosses 2, [9] [10]; footage 6, 25,
// 78): the raider who stole the station's part keeps watch on his tower. Down on one knee, the scope's round
// frame comes over him with its red skull; one shot, a critical, and he goes over backwards and the part falls.
// He slots it into the console, the screen goes green, and on the pad a runner is drawn in blue lines and
// filled in from the ground up; he jumps in and it tears off the pad in its dust.

const CONSOLE = 110
const PAD = 360
const TOWER = { x: 520, scale: 0.85 }
// The raider on the tower's platform, and where the scope finds his head.
const LOOKOUT = { x: TOWER.x, y: -TOWER.scale * 318 }
const HEAD = { x: LOOKOUT.x, y: LOOKOUT.y - 190 }
const PART = { from: { x: LOOKOUT.x - 50, y: LOOKOUT.y - 120 }, to: { x: 180, y: -24 }, slot: { x: CONSOLE, y: -96 } }
const WALK = 60
// The runner's seat over its foot, where he sits: a little behind its middle.
const SEAT = -30
const DRIVE_OFF = 120

const HITS: readonly Hit[] = [{ x: HEAD.x - 40, y: HEAD.y - 40, value: '212', at: 0.25, crit: true }]

export const tech = stopsPlace({
  land: LANDS.badlands,
  script: [1700, 1300, 1900],
  ends: [0.36, 0.6, 1],
  back: () => (
    <>
      <g transform={`translate(${TOWER.x} 0) scale(${TOWER.scale})`}>
        <Tower />
      </g>
      <g data-fx="lookout" transform={`translate(${LOOKOUT.x} ${LOOKOUT.y})`}>
        <Raider />
        <Tag name="lookout-tag" label="RAIDER" level={6} y={-230} />
      </g>
      <g transform={`translate(${PAD} 0)`}>
        <Pad />
      </g>
      <g transform={`translate(${CONSOLE} 0)`}>
        <Console />
      </g>
      <defs>
        <clipPath id="cel-build">
          <rect data-fx="build" x={-220} y={-200} width={440} height={220} transform="translate(0 220)" />
        </clipPath>
      </defs>
    </>
  ),
  front: () => (
    <>
      <g data-fx="part" transform={`translate(${PART.from.x} ${PART.from.y})`}>
        <Part />
      </g>
      <g data-fx="runner" transform={`translate(${PAD} 0)`}>
        <g clipPath="url(#cel-build)">
          <Runner />
        </g>
        <g data-fx="grid" opacity="0">
          <RunnerGrid />
        </g>
      </g>
      <g data-fx="speed" opacity="0">
        <path d="M-60 -150 H-220 M-40 -110 H-260 M-70 -70 H-200" stroke={CEL.ink} strokeWidth="6" strokeLinecap="round" data-bare />
      </g>
      <Scope name="scope" x={HEAD.x} y={HEAD.y} />
      <Hits name="hit" hits={HITS} />
    </>
  ),
  move: (profession, t) => {
    if (t < 0.36) return { pose: snipe(ramp(t, 0, 0.36), 0.7), ahead: 0, lift: 0 }
    if (t < 0.6) {
      const walk = ramp(t, 0.37, 0.45)
      if (walk < 1) return { pose: stride(profession, 3 * walk), ahead: WALK * walk, lift: 0 }
      return { pose: mix(rest(profession), PUSH, Math.sin(Math.PI * ramp(t, 0.46, 0.58))), ahead: WALK, lift: 0 }
    }
    // the jump into the seat, then the drive off the pad
    const jump = ramp(t, 0.8, 0.88)
    const off = ramp(t, 0.9, 1)
    const seat = PAD + SEAT
    if (jump === 0) return { pose: rest(profession), ahead: WALK, lift: 0 }
    return { pose: mix(rest(profession), DRIVE, ramp(jump, 0.3, 1)), ahead: WALK + (seat - WALK) * jump + DRIVE_OFF * off * off, lift: 34 * jump + hop(jump, 90) }
  },
  reply: (stage) => {
    const scope = scopeWriter(stage, 'scope', HEAD.x, HEAD.y, [0.06, 0.25, 0.31])
    const hits = hitsWriter(stage, 'hit', HITS)
    const lookout = fx(stage, 'lookout')
    const part = fx(stage, 'part')
    const light = fx(stage, 'console-light')
    const build = fx(stage, 'build')
    const grid = fx(stage, 'grid')
    const runner = fx(stage, 'runner')
    const speed = fx(stage, 'speed')
    const drain = drainWriter(stage, 'lookout-tag', 0.25, 0.27)
    return (t) => {
      scope(t)
      hits(t)
      drain(t)
      // the lookout goes over backwards off his platform
      const over = ramp(t, 0.26, 0.33)
      transformTo(lookout, `translate(${(LOOKOUT.x + 60 * over).toFixed(1)} ${(LOOKOUT.y + 40 * over * over).toFixed(1)}) rotate(${(70 * over).toFixed(1)})`)
      fadeTo(lookout, 1 - ramp(t, 0.31, 0.35))
      // the part falls to the ground by the console, then he pushes it into its slot
      const fall = ramp(t, 0.26, 0.36)
      const slot = ramp(t, 0.47, 0.53)
      const x = slot > 0 ? PART.to.x + (PART.slot.x - PART.to.x) * slot : PART.from.x + (PART.to.x - PART.from.x) * fall
      const y = slot > 0 ? PART.to.y + (PART.slot.y - PART.to.y) * slot : PART.from.y + (PART.to.y - PART.from.y) * fall * fall
      transformTo(part, `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(540 * fall).toFixed(1)}) scale(${(1 - 0.5 * slot).toFixed(3)})`)
      fadeTo(part, 1 - ramp(t, 0.53, 0.55))
      fadeTo(light, ramp(t, 0.53, 0.57))
      // the runner drawn in blue lines, filled in from the ground up, then off the pad
      fadeTo(grid, ramp(t, 0.6, 0.63) * (1 - ramp(t, 0.76, 0.8)))
      transformTo(build, `translate(0 ${(220 * (1 - ramp(t, 0.64, 0.78))).toFixed(1)})`)
      const off = ramp(t, 0.9, 1)
      transformTo(runner, `translate(${(PAD + DRIVE_OFF * off * off).toFixed(1)} ${(-4 * Math.abs(Math.sin(60 * off))).toFixed(1)})`)
      transformTo(speed, `translate(${(PAD + DRIVE_OFF * off * off).toFixed(1)} 0)`)
      fadeTo(speed, ramp(t, 0.92, 0.96))
    }
  },
})
