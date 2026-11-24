import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fxAll, fx } from '../../shared/stageNodes'
import { NOIR } from '../palette'
import { share, still, stepPlace } from '../case'
import { RoomFloor, RoomWall } from '../room'
import { lay, rest, tip } from '../pose'

// Contact: the case closed, at the captain's desk in the precinct, the window's blinds throwing their bars
// across the wall. He lays the case file down on the desk; then the five stars of the case's rating light
// over it one after another, the way the game scores every case it closes; then he tips his hat.

const DESK = { from: 120, to: 470, top: -112 }
const STARS = 5
const STAR = { y: -480, gap: 76, r: 26 }

const starPoints = (cx: number, cy: number, r: number): string =>
  Array.from({ length: 10 }, (_, i) => {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5
    const d = i % 2 === 0 ? r : r * 0.42
    return `${(cx + Math.cos(angle) * d).toFixed(1)},${(cy + Math.sin(angle) * d).toFixed(1)}`
  }).join(' ')

function Office() {
  const left = (DESK.from + DESK.to) / 2 - ((STARS - 1) * STAR.gap) / 2
  return (
    <>
      {/* the bars of the blinds' shadow across the wall */}
      {Array.from({ length: 7 }, (_, i) => -700 + i * 36).map((y) => (
        <polygon key={y} points={`-360,${y} 40,${y - 60} 40,${y - 44} -360,${y + 16}`} fill={NOIR.paper} opacity="0.07" />
      ))}
      {/* the desk, its lamp and its phone */}
      <rect x={DESK.from} y={DESK.top} width={DESK.to - DESK.from} height={20} fill={NOIR.ash} stroke={NOIR.ink} strokeWidth="4" />
      <rect x={DESK.to - 120} y={DESK.top + 20} width={110} height={-DESK.top - 20} fill={NOIR.smoke} stroke={NOIR.ink} strokeWidth="4" />
      <path d={`M${DESK.from + 20} ${DESK.top + 20} V0`} stroke={NOIR.ink} strokeWidth="12" />
      <path d={`M${DESK.to - 60} ${DESK.top} V${DESK.top - 70} L${DESK.to - 90} ${DESK.top - 110}`} stroke={NOIR.ink} strokeWidth="6" fill="none" />
      <polygon points={`${DESK.to - 120},${DESK.top - 96} ${DESK.to - 70},${DESK.top - 126} ${DESK.to - 60},${DESK.top - 104} ${DESK.to - 106},${DESK.top - 80}`} fill={NOIR.fog} stroke={NOIR.ink} strokeWidth="3" />
      <rect x={DESK.from + 30} y={DESK.top - 22} width={60} height={22} rx={6} fill={NOIR.ink} />
      <g data-fx="case-file" opacity="0">
        <rect x={DESK.from + 120} y={DESK.top - 8} width={110} height={8} fill={NOIR.paperDim} stroke={NOIR.ink} strokeWidth="2" />
      </g>
      {Array.from({ length: STARS }, (_, i) => {
        const cx = left + i * STAR.gap
        return (
          <g key={i}>
            <polygon points={starPoints(cx, STAR.y, STAR.r)} fill="none" stroke={NOIR.paperDim} strokeWidth="4" />
            <g data-fx={`star-${i}`} opacity="0">
              <circle cx={cx} cy={STAR.y} r={STAR.r * 1.8} fill={NOIR.red} opacity="0.2" />
              <polygon points={starPoints(cx, STAR.y, STAR.r)} fill={NOIR.red} stroke={NOIR.paper} strokeWidth="4" />
            </g>
          </g>
        )
      })}
    </>
  )
}

export const contact = stepPlace({
  light: NOIR.paper,
  script: [1500, 1700, 1300],
  mid: () => <RoomWall />,
  near: () => <RoomFloor />,
  back: () => <Office />,
  bind: (stage, { profession }) => {
    const file = fx(stage, 'case-file')
    const stars = fxAll(stage, 'star-')
    return (play) => {
      const laid = share(play, 0)
      const rated = share(play, 1)
      const tipped = share(play, 2)
      fadeTo(file, ramp(laid, 0.7, 0.85))
      stars.forEach((star, i) => fadeTo(star, ramp(rated, i / STARS, (i + 0.6) / STARS)))
      if (tipped > 0) return still(tip(profession, tipped))
      return still(mix(lay(profession, laid), rest(profession), ramp(rated, 0, 0.3)))
    }
  },
})
