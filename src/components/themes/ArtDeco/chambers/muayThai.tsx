import { ramp } from '@/lib/scroll/stage'
import { mix } from '@/lib/motion/rigPose'
import { bell, fadeTo, fx, fxAll, lerp, transformTo } from '../../shared/stageNodes'
import { DECO_COLORS as C } from '../palette'
import { fightChamber, share, still } from '../chamber'
import { Canvas, FLOOR, W } from '../city'
import { Giant, LittleOne } from '../cast'
import { lookUp, rest, slip, strike } from '../pose'

// Muay Thai: the last fight. The pump hall, its gauges and its catwalk, where the tenant who swelled himself
// on the tonic waits, twice his size and glowing. The giant's shoulder charge comes and he slips it, staying
// in motion; the little ones on the catwalk raise their lamps and the giant shields his eyes from them; then
// his round kick sends the giant back through the grating into the water below. The end frame is the broken
// grating, the hall quiet, and the little ones' lamps above him. The little ones only help; nothing touches
// them.

const GIANT = { from: 470, charge: 250, stand: 330 }
const CATWALK = { y: -620, from: 120, to: 480 }
const LITTLE = [190, 290, 400]
const PIT = { from: 300, to: 470 }

/** The pump hall's wall: dark painted iron, big pipes and gauges. */
function PumpHall() {
  return (
    <Canvas>
      <rect x={-200} width={W + 400} height={1000} fill={C.pumpWall} />
      {[220, 300].map((y) => (
        <path key={y} d={`M-200 ${y} H1800`} stroke={C.steelShade} strokeWidth="30" />
      ))}
      {[200, 600, 1000, 1400].map((x) => (
        <g key={x}>
          <path d={`M${x} 0 V880`} stroke={C.brassLine} strokeWidth="40" />
          <circle cx={x + 90} cy={560} r={46} fill={C.cream} stroke={C.brassMid} strokeWidth="8" />
          <path d={`M${x + 90} 560 L${x + 116} 536`} stroke={C.blood} strokeWidth="5" />
        </g>
      ))}
    </Canvas>
  )
}

/** The hall's floor: iron grating over dark water. */
function Grating() {
  return (
    <Canvas>
      <rect x={-200} y={FLOOR} width={W + 400} height={120} fill={C.abyss} />
      {Array.from({ length: 70 }, (_, i) => -200 + i * 30).map((x) => (
        <path key={x} d={`M${x} ${FLOOR} V1000`} stroke={C.steelShade} strokeWidth="6" />
      ))}
      <path d={`M-200 ${FLOOR} H1800`} stroke={C.steel} strokeWidth="6" />
    </Canvas>
  )
}

/** The catwalk over the hall on its hangers, with its rail. */
function Catwalk() {
  const { y, from, to } = CATWALK
  return (
    <g>
      {[from + 20, to - 20].map((x) => (
        <path key={x} d={`M${x} ${y} V-900`} stroke={C.steelShade} strokeWidth="6" />
      ))}
      <rect x={from} y={y} width={to - from} height={16} fill={C.steelShade} stroke={C.sepia} strokeWidth="3" />
      <path d={`M${from} ${y - 50} H${to}`} stroke={C.steel} strokeWidth="4" />
      {Array.from({ length: 9 }, (_, i) => from + ((to - from) / 8) * i).map((x) => (
        <path key={x} d={`M${x} ${y} V${y - 50}`} stroke={C.steel} strokeWidth="3" />
      ))}
    </g>
  )
}

/** The grating where it gives: the dark water under it, and its two panels in `data-fx="plate-i"` that
 *  swing down from their outer edges. */
function Pit() {
  const { from, to } = PIT
  const mid = (from + to) / 2
  return (
    <g>
      <rect x={from} y={0} width={to - from} height={120} fill={C.deepSea} />
      <g data-fx="splash" opacity="0">
        <path d={`M${mid - 70} -10 L${mid - 100} -80 M${mid - 20} -10 L${mid - 30} -110 M${mid + 30} -10 L${mid + 40} -100 M${mid + 70} -10 L${mid + 110} -70`} stroke={C.waterGlow} strokeWidth="6" strokeLinecap="round" />
      </g>
      <g data-fx="plate-0">
        <rect x={from} y={-4} width={mid - from} height={12} fill={C.steelShade} />
      </g>
      <g data-fx="plate-1">
        <rect x={mid} y={-4} width={to - mid} height={12} fill={C.steelShade} />
      </g>
    </g>
  )
}

export const muayThai = fightChamber({
  light: C.giantGlow,
  script: [1400, 1500, 1700],
  room: { sky: () => <PumpHall />, far: null, mid: null, near: () => <Grating />, fg: null },
  back: () => (
    <>
      <defs>
        <clipPath id="deco-above-grating">
          <rect x={-1000} y={-1400} width={3000} height={1400} />
        </clipPath>
      </defs>
      <Catwalk />
      {LITTLE.map((x, i) => (
        <g key={x} transform={`translate(${x} ${CATWALK.y})`}>
          <LittleOne name={`little-${i}`} lampUp />
        </g>
      ))}
      <Pit />
      <g clipPath="url(#deco-above-grating)">
        <g data-fx="giant-place" transform={`translate(${GIANT.from} 0)`}>
          <Giant name="giant" />
        </g>
      </g>
    </>
  ),
  bind: (stage, { profession }) => {
    const place = fx(stage, 'giant-place')
    const giant = fx(stage, 'giant')
    const arm = fx(stage, 'giant-arm')
    const glow = fx(stage, 'giant-glow')
    const glows = fxAll(stage, 'little-').filter((node) => node.getAttribute('data-fx')?.endsWith('-glow'))
    const plates = [fx(stage, 'plate-0'), fx(stage, 'plate-1')]
    const splash = fx(stage, 'splash')
    return (play) => {
      const slipped = share(play, 0)
      const dazzled = share(play, 1)
      const kicked = share(play, 2)
      // the charge: in, past where he stood, and back to its feet in the middle of the hall
      const charge = bell(slipped, 0.15, 0.85)
      const x = lerp(GIANT.from, GIANT.charge, charge) + (GIANT.stand - GIANT.from) * ramp(slipped, 0.6, 1)
      // the kick drives it back over the grating, which gives, and it drops into the water under it
      const back = ramp(kicked, 0.4, 0.65)
      const drop = ramp(kicked, 0.6, 0.85)
      transformTo(place, `translate(${(x + 50 * back).toFixed(1)} ${(640 * drop * drop).toFixed(1)})`)
      transformTo(giant, `rotate(${(-14 * charge + 12 * back).toFixed(1)})`)
      // the lamps raised and blazing, his arm up over his eyes
      const blaze = ramp(dazzled, 0.1, 0.5)
      glows.forEach((node) => {
        fadeTo(node, 0.35 + 0.6 * blaze * (1 - 0.5 * ramp(kicked, 0.7, 1)))
        transformTo(node, `scale(${(1 + 0.8 * blaze * (1 - 0.6 * ramp(kicked, 0.7, 1))).toFixed(3)})`)
      })
      transformTo(arm, `rotate(${(150 * ramp(dazzled, 0.3, 0.6) * (1 - ramp(kicked, 0.5, 0.7))).toFixed(1)} -90 -420)`)
      fadeTo(glow, 0.16 * (1 - drop))
      plates.forEach((plate, i) => {
        const pivot = i === 0 ? PIT.from : PIT.to
        transformTo(plate, `rotate(${((i === 0 ? 1 : -1) * 80 * ramp(kicked, 0.55, 0.7)).toFixed(1)} ${pivot} 0)`)
      })
      fadeTo(splash, bell(kicked, 0.75, 1))
      if (kicked > 0) {
        const blow = strike(0.5 + 0.5 * ramp(kicked, 0, 0.45))
        return still(mix(blow, rest(profession), ramp(kicked, 0.7, 1)))
      }
      if (dazzled > 0) return still(mix(slip(profession, 1), lookUp(ramp(dazzled, 0.3, 0.7)), ramp(dazzled, 0, 0.3)))
      return { pose: slip(profession, bell(slipped, 0.1, 0.9) * 0.6 + ramp(slipped, 0.5, 1) * 0.4), ahead: -50 * bell(slipped, 0.1, 0.9), lift: 0 }
    }
  },
})
