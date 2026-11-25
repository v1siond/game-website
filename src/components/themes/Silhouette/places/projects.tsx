import type { Profession } from '@/lib/cv/professions'
import { ramp } from '@/lib/scroll/stage'
import { fx, translateTo } from '../../shared/stageNodes'
import { SHADE, type Light } from '../palette'
import { runFrame, type Frame, type Place } from '../place'

// Beat 6, inside the machines: a corridor where a hydraulic crusher pounds the floor. He runs up to it and
// stops short as it slams down; as it lifts he runs under it; it slams down again behind him as he clears
// it, and he runs on down the corridor.

const PRESS = { from: 270, to: 380, h: 90 }
const WAIT = PRESS.from - 50
const CLEAR = PRESS.to + 40
// How high the press's face hangs when it is raised, above the floor.
const RAISED = 300

/** The press's face above the floor at t: it slams down as he arrives, lifts slowly, and slams down again
 *  behind him once he is through. */
const pressAt = (t: number): number => RAISED * (1 - ramp(t, 0.18, 0.24) + ramp(t, 0.36, 0.5) - ramp(t, 0.68, 0.72))

function move(profession: Profession, t: number, length: number): Frame {
  if (t < 0.48) return runFrame(profession, 0, WAIT, ramp(t, 0, 0.2))
  if (t < 0.75) return runFrame(profession, WAIT, CLEAR, ramp(t, 0.48, 0.66))
  return runFrame(profession, CLEAR, length, ramp(t, 0.75, 1))
}

export const projects: Place = {
  region: 'machine',
  length: 480,
  script: [1500, 1300, 1500],
  ends: [0.35, 0.62, 1],
  obstacle: ({ light }: { light: Light }) => (
    <>
      {/* the corridor's ceiling and the press's housing in it */}
      <rect x={PRESS.from - 400} y={-RAISED - PRESS.h - 500} width={PRESS.to - PRESS.from + 800} height={500} fill={SHADE.black} />
      <rect x={PRESS.from - 30} y={-RAISED - PRESS.h - 40} width={PRESS.to - PRESS.from + 60} height={60} fill={SHADE.black} />
      <g data-fx="press">
        <rect x={(PRESS.from + PRESS.to) / 2 - 12} y={-RAISED - 600} width={24} height={600 - PRESS.h} fill={SHADE.black} />
        <rect x={PRESS.from} y={-PRESS.h} width={PRESS.to - PRESS.from} height={PRESS.h} fill={SHADE.black} />
        <path d={`M${PRESS.from} 0 ${Array.from({ length: 6 }, (_, i) => `L${PRESS.from + (i + 0.5) * ((PRESS.to - PRESS.from) / 6)} 10 L${PRESS.from + (i + 1) * ((PRESS.to - PRESS.from) / 6)} 0`).join(' ')} Z`} fill={SHADE.black} />
        <rect x={PRESS.from + 6} y={-PRESS.h + 10} width={PRESS.to - PRESS.from - 12} height={4} fill={light.far} opacity={0.3} />
      </g>
      {/* the plate it strikes, and the dents round it */}
      <rect x={PRESS.from - 10} y={-3} width={PRESS.to - PRESS.from + 20} height={3} fill={light.rim} opacity={0.25} />
    </>
  ),
  move,
  reply: (stage) => {
    const press = fx(stage, 'press')
    return (t) => translateTo(press, 0, -pressAt(t))
  },
}
