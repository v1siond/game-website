import { ramp } from '@/lib/scroll/stage'
import { fadeTo, focusOn, fx, transformTo } from '../../shared/stageNodes'
import { NOIR } from '../palette'
import { holdX, share, still, stepPlace } from '../case'
import { FLOOR } from '../street'
import { RoomFloor, RoomWall } from '../room'
import { accuse, sit, watch } from '../pose'

// Tech Stack: the interrogation room, a table under one hanging lamp, a man of our own across it. He sits
// down and the lamp swings; then the game's centre, the face read close: the frame pushes in on the man, his
// eyes slide away and a drop of sweat runs down his temple, the tell; then he brings the case file out and
// lays it down hard on the table as the evidence, and the man sags in his chair. Sit, read the face, accuse.

const TABLE = { from: 70, to: 400, top: -128 }
const SUSPECT = 470
const LAMP = { x: 240, top: -620, drop: 160 }
// The push in on the man's face while it is read.
const PUSH = 0.3
// On a wider screen the room stands this far right of his place, he with it, so the push in on the face
// keeps him clear of the cards; a phone's view has no room to spare.
const shiftOf = (phone: boolean): number => (phone ? 0 : 140)

function Lamp() {
  return (
    <g data-fx="lamp">
      <path d={`M${LAMP.x} ${LAMP.top} V${LAMP.top + LAMP.drop}`} stroke={NOIR.ink} strokeWidth="4" />
      <polygon points={`${LAMP.x - 30},${LAMP.top + LAMP.drop + 26} ${LAMP.x + 30},${LAMP.top + LAMP.drop + 26} ${LAMP.x + 14},${LAMP.top + LAMP.drop} ${LAMP.x - 14},${LAMP.top + LAMP.drop}`} fill={NOIR.ash} stroke={NOIR.ink} strokeWidth="3" />
      <polygon points={`${LAMP.x - 30},${LAMP.top + LAMP.drop + 26} ${LAMP.x + 30},${LAMP.top + LAMP.drop + 26} ${LAMP.x + 260},${TABLE.top} ${LAMP.x - 260},${TABLE.top}`} fill={NOIR.paper} opacity="0.1" />
    </g>
  )
}

// The man across the table, sat facing him: his coat, his head with its eye and the sweat drop, his hands on
// the table. His upper body is one group so he can sag.
function Suspect() {
  const neck = -250
  return (
    <g transform={`translate(${SUSPECT} 0)`}>
      <rect x={-10} y={-110} width={70} height={14} fill={NOIR.ink} />
      <path d="M50 -110 V0 M-6 -96 V0" stroke={NOIR.ink} strokeWidth="8" />
      <path d="M44 -260 L56 -260 L56 -100 L44 -100 Z" fill={NOIR.ink} />
      <g data-fx="suspect">
        <path d={`M-44 ${neck + 30} Q-8 ${neck + 16} 30 ${neck + 30} L36 -112 L-40 -112 Z`} fill={NOIR.smoke} stroke={NOIR.ink} strokeWidth="3" />
        <path d={`M-24 ${neck + 34} L-6 ${neck + 70} L10 ${neck + 30}`} fill={NOIR.paperDim} stroke={NOIR.ink} strokeWidth="2" />
        <g>
          <path d={`M-28 ${neck + 30} Q-40 ${neck - 6} -26 ${neck - 34} Q-4 ${neck - 52} 18 ${neck - 30} Q26 ${neck - 6} 12 ${neck + 26} Z`} fill={NOIR.paperDim} stroke={NOIR.ink} strokeWidth="3" />
          <path d={`M-34 ${neck - 24} Q-6 ${neck - 64} 22 ${neck - 30} Q4 ${neck - 40} -34 ${neck - 18} Z`} fill={NOIR.ink} />
          <path d={`M-30 ${neck - 14} L-20 ${neck - 16}`} stroke={NOIR.ink} strokeWidth="3" />
          <g data-fx="eye">
            <ellipse cx={-25} cy={neck - 4} rx={3} ry={3.6} fill={NOIR.ink} />
          </g>
          <path d={`M-30 ${neck + 14} Q-24 ${neck + 18} -18 ${neck + 14}`} stroke={NOIR.ink} strokeWidth="3" fill="none" />
          <g data-fx="sweat" opacity="0">
            <path d={`M-6 ${neck - 18} q-5 9 0 13 q5 -4 0 -13 Z`} fill={NOIR.paper} stroke={NOIR.ink} strokeWidth="1.5" />
          </g>
        </g>
        {/* his forearm on the table */}
        <path d={`M-10 ${neck + 50} L-50 ${TABLE.top - 10} L-90 ${TABLE.top - 10}`} stroke={NOIR.smoke} strokeWidth="20" strokeLinecap="round" fill="none" />
        <circle cx={-92} cy={TABLE.top - 10} r={11} fill={NOIR.paperDim} stroke={NOIR.ink} strokeWidth="3" />
      </g>
    </g>
  )
}

function Room() {
  return (
    <>
      {/* the mirror on the wall behind, dark glass with a fog sheen */}
      <rect x={-260} y={-560} width={300} height={190} fill={NOIR.ink} stroke={NOIR.ash} strokeWidth="6" />
      <path d="M-220 -540 L-130 -390 M-170 -548 L-80 -398" stroke={NOIR.fog} strokeWidth="4" opacity="0.25" />
      {/* his chair */}
      <rect x={-46} y={-80} width={70} height={12} fill={NOIR.ink} />
      <path d="M-40 -68 V0 M18 -68 V0 M-44 -80 V-250" stroke={NOIR.ink} strokeWidth="8" />
      <Suspect />
      <Lamp />
    </>
  )
}

function Table() {
  return (
    <>
      <rect x={TABLE.from} y={TABLE.top} width={TABLE.to - TABLE.from} height={14} fill={NOIR.ash} stroke={NOIR.ink} strokeWidth="3" />
      <path d={`M${TABLE.from + 20} ${TABLE.top + 14} V0 M${TABLE.to - 20} ${TABLE.top + 14} V0`} stroke={NOIR.ink} strokeWidth="12" />
      <g data-fx="evidence" opacity="0">
        <rect x={250} y={TABLE.top - 6} width={70} height={7} fill={NOIR.paperDim} stroke={NOIR.ink} strokeWidth="2" />
        <rect x={280} y={TABLE.top - 9} width={24} height={4} fill={NOIR.paperDim} />
      </g>
    </>
  )
}

export const tech = stepPlace({
  light: NOIR.paper,
  script: [1400, 1900, 1700],
  mid: () => <RoomWall />,
  near: () => <RoomFloor />,
  back: ({ phone }) => (
    <g transform={`translate(${shiftOf(phone)} 0)`}>
      <Room />
    </g>
  ),
  front: ({ phone }) => (
    <g transform={`translate(${shiftOf(phone)} 0)`}>
      <Table />
    </g>
  ),
  bind: (stage, input) => {
    const { profession } = input
    const lamp = fx(stage, 'lamp')
    const eye = fx(stage, 'eye')
    const sweat = fx(stage, 'sweat')
    const suspect = fx(stage, 'suspect')
    const evidence = fx(stage, 'evidence')
    const camera = fx(stage, 'camera')
    const shift = shiftOf(input.phone)
    const face = { x: holdX(input) + shift + SUSPECT - 20, y: FLOOR - 280 }
    const at = (pose: Parameters<typeof still>[0]) => ({ ...still(pose), ahead: shift })
    return (play) => {
      const sat = share(play, 0)
      const read = share(play, 1)
      const accused = share(play, 2)
      // the lamp swings when he sits and dies down while the face is read
      const swing = 9 * Math.sin(Math.PI * 3 * (sat + read)) * (1 - ramp(read, 0, 1))
      transformTo(lamp, `rotate(${swing.toFixed(1)} ${LAMP.x} ${LAMP.top})`)
      // the tell: the eye slides away from him and back, then the drop runs down the temple
      const away = Math.sin(Math.PI * ramp(read, 0.25, 0.65))
      transformTo(eye, `translate(${(5 * away).toFixed(1)} 0)`)
      const run = ramp(read, 0.55, 1)
      fadeTo(sweat, run * (1 - ramp(accused, 0.6, 1)))
      transformTo(sweat, `translate(${(4 * run).toFixed(1)} ${(30 * run).toFixed(1)})`)
      fadeTo(evidence, ramp(accused, 0.5, 0.55))
      const sag = ramp(accused, 0.6, 1)
      transformTo(suspect, `translate(${(-6 * sag).toFixed(1)} ${(26 * sag).toFixed(1)}) rotate(${(-8 * sag).toFixed(1)} 0 -112)`)
      const push = PUSH * (ramp(read, 0, 0.35) - ramp(accused, 0, 0.4))
      transformTo(camera, focusOn(face.x, face.y, 1 + push))
      if (accused > 0) return at(accuse(accused))
      if (read > 0) return at(watch(read))
      return at(sit(profession, sat))
    }
  },
})
