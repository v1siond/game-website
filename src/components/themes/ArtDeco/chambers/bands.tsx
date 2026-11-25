import { ramp } from '@/lib/scroll/stage'
import { mix } from '@/lib/motion/rigPose'
import { bell, fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { DECO_COLORS as C } from '../palette'
import { fightChamber, share } from '../chamber'
import { Canvas, FLOOR, W } from '../city'
import { Dancer } from '../cast'
import { drum, rest, sitDown, stride } from '../pose'

// Bands: the gramophone. The ballroom of the pleasure fort, its band stand empty, tenants in torn evening
// clothes swaying to a record on the gramophone. The needle skips, the music stops, and the dancers stop and
// turn toward him; he sits at the band's kit and plays the beat himself, and they sway again. The end frame
// is him at the kit, the dancers turning slowly, the gramophone silent.

const STOOL = 70
const KIT = 150
const DANCERS = [
  { x: 330, gown: true },
  { x: 430, gown: false },
  { x: 530, gown: true },
]
const GRAMOPHONE = { x: 640, y: -120 }

/** The ballroom wall: deep red, gold pilasters, a chandelier in each bay. */
function Ballroom() {
  return (
    <Canvas>
      <rect x={-200} width={W + 400} height={1000} fill={C.ballroom} />
      {[100, 500, 900, 1300, 1700].map((x) => (
        <g key={x}>
          <rect x={x - 26} y={160} width={52} height={720} fill={C.bloodDeep} stroke={C.gold} strokeWidth="3" />
          <path d={`M${x - 40} 160 H${x + 40} V140 H${x - 40} Z`} fill={C.gold} />
        </g>
      ))}
      {[300, 700, 1100, 1500].map((x) => (
        <g key={x}>
          <path d={`M${x} 0 V80`} stroke={C.gold} strokeWidth="3" />
          <path d={`M${x - 60} 80 H${x + 60} L${x + 30} 130 H${x - 30} Z`} fill={C.brassMid} stroke={C.gold} strokeWidth="2" />
          <circle cx={x} cy={110} r={70} fill={C.lamp} opacity="0.1" />
          {[-40, -15, 15, 40].map((dx) => (
            <path key={dx} d={`M${x + dx} 130 V${150 + Math.abs(dx)}`} stroke={C.goldBright} strokeWidth="3" />
          ))}
        </g>
      ))}
      <path d="M-200 150 H1800 M-200 140 H1800" stroke={C.gold} strokeWidth="3" />
    </Canvas>
  )
}

/** The parquet in a herringbone, its border gold. */
function Parquet() {
  return (
    <Canvas>
      <rect x={-200} y={FLOOR} width={W + 400} height={120} fill={C.cabinetTop} />
      {Array.from({ length: 46 }, (_, i) => -200 + i * 40).map((x, i) => (
        <path key={x} d={`M${x} ${FLOOR + 10} l20 ${i % 2 ? 40 : -0} l20 -40`} fill="none" stroke={C.bronze} strokeWidth="3" opacity="0.5" />
      ))}
      <path d={`M-200 ${FLOOR} H1800`} stroke={C.gold} strokeWidth="5" />
    </Canvas>
  )
}

/** The band's kit: the bass drum with its sunburst head, a snare, a tom and a cymbal on its stand; its
 *  cymbal in `data-fx="cymbal"`. */
function Kit() {
  return (
    <g>
      <path d="M90 0 V-170" stroke={C.brassDark} strokeWidth="5" />
      <g data-fx="cymbal">
        <ellipse cx={90} cy={-176} rx={56} ry={9} fill={C.goldBright} stroke={C.brassDark} strokeWidth="3" />
      </g>
      <circle cx={0} cy={-80} r={80} fill={C.bloodDark} stroke={C.gold} strokeWidth="6" />
      <circle cx={0} cy={-80} r={58} fill={C.cream} stroke={C.brassMid} strokeWidth="4" />
      {[-60, -30, 0, 30, 60, 90, 120, 150, 180, 210, 240, 270].map((angle) => (
        <path key={angle} d="M0 -80 L0 -134" stroke={C.gold} strokeWidth="3" transform={`rotate(${angle} 0 -80)`} />
      ))}
      <circle cx={0} cy={-80} r={12} fill={C.gold} />
      <path d="M-70 -116 H-20 V-90 H-70 Z" fill={C.brassMid} stroke={C.sepia} strokeWidth="3" />
      <ellipse cx={-45} cy={-116} rx={27} ry={6} fill={C.cream} stroke={C.gold} strokeWidth="2" />
      <path d="M-45 -90 V0 M-60 0 L-45 -30 L-30 0" stroke={C.brassDark} strokeWidth="4" fill="none" />
    </g>
  )
}

/** The band's stool. */
function Stool() {
  return (
    <g>
      <ellipse cx={0} cy={-92} rx={34} ry={9} fill={C.bloodDark} stroke={C.gold} strokeWidth="3" />
      <path d="M0 -84 V0 M-24 0 L0 -40 L24 0" stroke={C.brassDark} strokeWidth="5" fill="none" />
    </g>
  )
}

/** The gramophone on its stand: the horn, the turning record and the needle arm in `data-fx="needle"`,
 *  the notes it plays in `data-fx="notes"`. */
function Gramophone() {
  return (
    <g>
      <path d="M-30 120 L-20 0 H20 L30 120 Z" fill={C.cabinetTop} stroke={C.brassMid} strokeWidth="3" />
      <rect x={-50} y={-30} width={100} height={40} fill={C.cabinetTop} stroke={C.brassMid} strokeWidth="3" />
      <ellipse cx={0} cy={-32} rx={46} ry={8} fill={C.abyss} stroke={C.sepia} strokeWidth="2" />
      <path d="M30 -30 Q40 -80 10 -110 L-20 -190 Q40 -220 70 -170 L30 -110 Q60 -80 44 -30 Z" fill={C.gold} stroke={C.brassDark} strokeWidth="3" />
      <g data-fx="needle">
        <path d="M-40 -34 L-6 -40" stroke={C.steel} strokeWidth="4" strokeLinecap="round" />
      </g>
      <g data-fx="notes" opacity="0">
        <path d="M-80 -120 V-150 L-64 -156 V-128 M-110 -90 V-116" stroke={C.goldBright} strokeWidth="4" fill="none" />
        <circle cx={-84} cy={-120} r={6} fill={C.goldBright} />
        <circle cx={-68} cy={-128} r={6} fill={C.goldBright} />
        <circle cx={-114} cy={-90} r={6} fill={C.goldBright} />
      </g>
      <g data-fx="skip" opacity="0">
        <path d="M-20 -60 L-10 -50 L-24 -46 L-12 -36" stroke={C.spark} strokeWidth="4" fill="none" />
      </g>
    </g>
  )
}

export const bands = fightChamber({
  light: C.blood,
  script: [1500, 2400],
  room: { sky: () => <Ballroom />, far: null, mid: null, near: () => <Parquet />, fg: null },
  back: () => (
    <>
      <g transform={`translate(${GRAMOPHONE.x} ${GRAMOPHONE.y})`}>
        <Gramophone />
      </g>
      {DANCERS.map(({ x, gown }, i) => (
        <g key={x} data-fx={`dancer-${i}`} transform={`translate(${x} 0)`}>
          <Dancer name={`dancer-body-${i}`} gown={gown} />
        </g>
      ))}
      <g transform={`translate(${STOOL} 0)`}>
        <Stool />
      </g>
    </>
  ),
  front: () => (
    <g transform={`translate(${KIT} 0)`}>
      <Kit />
    </g>
  ),
  bind: (stage, { profession }) => {
    const dancers = DANCERS.map(({ x }, i) => ({ place: fx(stage, `dancer-${i}`), body: fx(stage, `dancer-body-${i}`), x }))
    const needle = fx(stage, 'needle')
    const notes = fx(stage, 'notes')
    const skip = fx(stage, 'skip')
    const cymbal = fx(stage, 'cymbal')
    return (play) => {
      const skipped = share(play, 0)
      const drummed = share(play, 1)
      // the needle jumps the groove and the record goes silent
      const jump = bell(skipped, 0.1, 0.3)
      transformTo(needle, `rotate(${(-14 * jump - 10 * ramp(skipped, 0.3, 0.5)).toFixed(1)} -40 -34)`)
      fadeTo(notes, 1 - ramp(skipped, 0.1, 0.25))
      fadeTo(skip, bell(skipped, 0.1, 0.45))
      // they stop and turn toward him; then sway to his beat, turning slowly
      const turned = ramp(skipped, 0.35, 0.8)
      const beat = ramp(drummed, 0.3, 0.5)
      dancers.forEach(({ place, body, x }, i) => {
        const sway = (1 - turned + beat) * 8 * Math.sin((skipped + drummed) * 10 + i * 1.4)
        transformTo(place, `translate(${x} 0) scale(${(1 - 2 * turned).toFixed(3)} 1)`)
        transformTo(body, `rotate(${sway.toFixed(1)})`)
      })
      transformTo(cymbal, `rotate(${(6 * Math.sin(drummed * 40) * beat).toFixed(1)} 90 -176)`)
      if (drummed > 0) {
        const sat = ramp(drummed, 0, 0.3)
        const going = sat < 1 ? mix(stride(profession, sat * 2.5), sitDown(profession, 1), ramp(sat, 0.5, 1)) : drum(beat, drummed * 18)
        return { pose: going, ahead: STOOL * ramp(sat, 0, 0.6), lift: 0 }
      }
      return { pose: { ...rest(profession), head: 8 * turned }, ahead: 0, lift: 0 }
    }
  },
})
