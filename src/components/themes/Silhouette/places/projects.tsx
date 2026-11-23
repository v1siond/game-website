import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { Canvas, gearPath } from '../forest'
import { SHADE, type Light } from '../palette'
import { still, type Place } from '../place'
import { DUCK, pull } from '../pose'

// Projects on the sawmill floor: for each project a lever stands in the path under a saw blade hung on a
// long arm. He throws the lever and the arm swings the blade down through the path; he drops flat and the
// frame holds the blade just over his back, its edge catching the light.

const PIVOT_Y = -860
const ARM = 600
const BLADE_R = 56
// The arm waits this far ahead of him, in degrees, and swings through to just past his back.
const WAIT = 60
const OVER = -8
const LEVER_X = -50

const BLADE = gearPath(0, ARM, BLADE_R, 18)

const swungAt = (t: number): number => WAIT + (OVER - WAIT) * ramp(t, 0.4, 0.85)

function MillWheel({ light }: { light: Light }) {
  return (
    <Canvas>
      <g fill={light.far} opacity={0.85}>
        <path d={gearPath(1320, 360, 220, 20)} fillRule="evenodd" />
        <rect x={180} y={260} width={220} height={620} />
        <path d="M160 260 L290 160 L420 260 Z" />
      </g>
    </Canvas>
  )
}

export const projects: Place = {
  far: ({ light }) => <MillWheel light={light} />,
  obstacle: (i, { light }) => (
    <>
      <g transform={`translate(${LEVER_X} 0)`}>
        <rect x={-14} y={-24} width={28} height={24} fill={SHADE.black} />
        <g data-fx={`lever-${i}`} transform="rotate(-35 0 -20)">
          <line x1={0} y1={-20} x2={0} y2={-120} stroke={SHADE.black} strokeWidth={8} />
          <circle cx={0} cy={-124} r={12} fill={SHADE.black} />
        </g>
      </g>
      <g data-fx={`arm-${i}`} transform={`translate(-90 ${PIVOT_Y}) rotate(${-WAIT})`}>
        <line x1={0} y1={0} x2={0} y2={ARM} stroke={SHADE.black} strokeWidth={10} />
        <path d={BLADE} fill={SHADE.black} fillRule="evenodd" />
        <g data-fx={`edge-${i}`} opacity="0">
          <path d={BLADE} fill="none" stroke={light.rim} strokeWidth={4} />
        </g>
      </g>
    </>
  ),
  move: (profession, t) => still(t < 0.4 ? pull(profession, t / 0.4) : mix(pull(profession, 1), DUCK, ramp(t, 0.4, 0.6))),
  reply: (stage, { count }) => {
    const levers = Array.from({ length: count }, (_, i) => fx(stage, `lever-${i}`))
    const arms = Array.from({ length: count }, (_, i) => fx(stage, `arm-${i}`))
    const edges = Array.from({ length: count }, (_, i) => fx(stage, `edge-${i}`))
    return (played) =>
      levers.forEach((lever, i) => {
        const t = played(i)
        transformTo(lever, `rotate(${(-35 + 70 * ramp(t, 0.1, 0.4)).toFixed(1)} 0 -20)`)
        transformTo(arms[i], `translate(-90 ${PIVOT_Y}) rotate(${(-swungAt(t)).toFixed(1)})`)
        fadeTo(edges[i], ramp(t, 0.8, 1))
      })
  },
}
