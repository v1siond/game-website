import { memo, useId, type ComponentType } from 'react'
import { COLORS as C, type Tone } from './palette'
import paint from './scenery.module.css'

// The run's places on the stages, one per light: above ground the sunset, the day jungle, the misty giant
// tree, the dusk and the night, each the sky, the banded treeline far off, the palms and the ground he stands
// on, the leaves in front, painted from the scenery's shapes (scenery.tsx); and below and beyond the jungle
// the mine, the cold lake, the dark cave, the factory and the ship's deck, each its own far, middle and near
// planes. All are four planes on a 1440 by 1080 canvas in the place's tone. The place's own things stand on
// the ground in the figure plane (places/).

export const VIEW = '0 0 1440 1080'

/** A phone's view of the canvas (xMidYMin slice): x 480 to 1040 from y 294, so the ground sits half way down
 *  its screen with the place before him in view; the ground runs on below the canvas (PhoneFloor). */
export const PHONE_VIEW = '480 294 560 1212'

/** The ground line he stands on. */
export const GROUND = 900

export type Zone = Tone

export interface ZoneArt {
  sky: ComponentType
  far: ComponentType
  mid: ComponentType
  near: ComponentType
}

/** The sky, its tone's high colour down to the horizon, with the zone's light in it. */
function skyOf(light: 'sun' | 'moon' | null): ComponentType {
  return memo(function Sky() {
    const id = useId()
    return (
      <>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className={paint.skyHigh} />
            <stop offset="0.75" className={paint.skyLow} />
          </linearGradient>
        </defs>
        <rect width={1440} height={1080} fill={`url(#${id})`} />
        {light === 'sun' && <circle cx={980} cy={700} r={170} fill={C.sunCore} opacity={0.6} />}
        {light === 'moon' && <circle cx={1120} cy={200} r={60} fill={C.moon} />}
      </>
    )
  })
}

const Far = memo(function Far() {
  return (
    <>
      {[0, 400, 800, 1200].map((x) => (
        <use key={x} href="#tp-treeline" transform={`translate(${x - 120} 560) scale(1.1 3.6)`} />
      ))}
    </>
  )
})

// The palms at both sides and the ground band: the stage's middle stays open for the stops.
const PALMS: ReadonlyArray<readonly [number, number, number]> = [
  // x, scale, lean
  [90, 2.4, -6],
  [260, 1.6, 5],
  [1240, 1.9, 6],
  [1390, 2.6, -4],
]

const Mid = memo(function Mid() {
  return (
    <>
      {PALMS.map(([x, scale, lean]) => (
        <use key={x} href="#tp-palm" transform={`translate(${x} ${GROUND + 6}) rotate(${lean}) scale(${scale})`} className={scale < 2 ? paint.haze : undefined} />
      ))}
      <path d={`M0 ${GROUND - 6} Q360 ${GROUND - 22} 720 ${GROUND - 4} T1440 ${GROUND - 8} V1080 H0 Z`} className={paint.leafShade} />
      <path d={`M0 ${GROUND - 6} Q360 ${GROUND - 22} 720 ${GROUND - 4} T1440 ${GROUND - 8}`} className={paint.rim} strokeWidth={4} opacity={0.5} />
    </>
  )
})

/** The ground carried on below the canvas for a phone's taller view. */
export const PhoneFloor = memo(function PhoneFloor() {
  return <rect x={0} y={1070} width={1440} height={500} className={paint.leafShade} />
})

const Near = memo(function Near() {
  return (
    <>
      <use href="#tp-frond" transform="translate(-30 1080) rotate(-40) scale(3)" />
      <use href="#tp-broad" transform="translate(110 1060) rotate(10) scale(2.4)" />
      <use href="#tp-frond" transform="translate(1470 1080) scale(-1 1) rotate(-40) scale(3)" />
      <use href="#tp-fern" transform="translate(1330 1080) scale(1.2)" />
      <use href="#tp-frond" transform="translate(-30 -10) rotate(30) scale(2.4)" />
      <use href="#tp-frond" transform="translate(1470 -10) scale(-1 1) rotate(32) scale(2.2)" />
    </>
  )
})

// ---- the places under and beyond the jungle: each its own far and middle planes, the ground at GROUND

const Rock = memo(function Rock() {
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${i * 320 - 60} 560 Q${i * 320 + 60} ${420 + (i % 2) * 60} ${i * 320 + 200} 540 T${i * 320 + 420} 560 V1080 H${i * 320 - 60} Z`} className={paint.far} />
      ))}
      <path d="M0 0 H1440 V150 Q1100 230 720 170 T0 200 Z" className={paint.leafShade} />
    </>
  )
})

/** The mine: timber frames down the tunnel, lamps hung on them, a rock floor. */
const MineMid = memo(function MineMid() {
  return (
    <>
      {[140, 520, 900, 1280].map((x) => (
        <g key={x}>
          <rect x={x - 16} y={300} width={32} height={GROUND - 300} className={paint.trunk} />
          <rect x={x - 150} y={290} width={300} height={28} className={paint.trunk} />
          <path d={`M${x + 90} 318 V360`} className={paint.rim} strokeWidth={3} />
          <circle cx={x + 90} cy={372} r={14} className={paint.bloom} />
          <circle cx={x + 90} cy={372} r={40} className={paint.bloom} opacity={0.18} />
        </g>
      ))}
      <path d={`M0 ${GROUND - 4} H1440 V1080 H0 Z`} className={paint.leafShade} />
    </>
  )
})

/** Hanging rock along the top, in front. */
const RockNear = memo(function RockNear() {
  return <path d="M0 0 H1440 V40 Q1340 110 1260 50 Q1160 120 1080 40 Q900 90 800 30 Q640 100 520 40 Q360 120 260 50 Q140 110 0 60 Z" className={paint.leafShade} />
})

/** The cold lake: shafts of light from the ice above, its floor of rounded stones. */
const LakeFar = memo(function LakeFar() {
  return (
    <>
      {[200, 520, 840, 1160].map((x) => (
        <path key={x} d={`M${x} 0 L${x + 60} 0 L${x + 220} 1080 L${x + 100} 1080 Z`} className={paint.rim} opacity={0.07} />
      ))}
    </>
  )
})

const LakeMid = memo(function LakeMid() {
  return (
    <>
      {[0, 260, 560, 860, 1180].map((x, i) => (
        <ellipse key={x} cx={x + 120} cy={GROUND + 20} rx={170} ry={60 + (i % 2) * 20} className={paint.leaf} />
      ))}
      <path d={`M0 ${GROUND + 10} H1440 V1080 H0 Z`} className={paint.leafShade} />
    </>
  )
})

const LakeNear = memo(function LakeNear() {
  return (
    <>
      {[60, 140, 1300, 1380].map((x, i) => (
        <path key={x} d={`M${x} 1080 Q${x - 30} ${900 - i * 20} ${x + 10} ${760 - (i % 2) * 60}`} fill="none" className={paint.leafLit} strokeWidth={10} />
      ))}
    </>
  )
})

/** The dark cave: its floor, and ice teeth hanging in front. */
const CaveMid = memo(function CaveMid() {
  return <path d={`M0 ${GROUND - 4} H1440 V1080 H0 Z`} className={paint.leaf} />
})

const CaveNear = memo(function CaveNear() {
  return <path d="M0 0 H1440 V30 L1400 120 L1360 30 L1290 160 L1230 30 L1120 90 L1040 30 L980 140 L900 30 L460 30 L400 130 L340 30 L250 100 L180 30 L120 150 L60 30 L0 80 Z" className={paint.rim} opacity={0.35} />
})

/** The factory: girders and pipes far off, a brick wall and a steel floor. */
const FactoryFar = memo(function FactoryFar() {
  return (
    <>
      {[100, 460, 820, 1180].map((x) => (
        <g key={x}>
          <rect x={x} y={120} width={40} height={700} className={paint.far} />
          <path d={`M${x} 160 L${x + 320} 520 M${x + 320} 160 L${x} 520`} className={paint.far} strokeWidth={18} />
        </g>
      ))}
      <rect x={0} y={260} width={1440} height={40} className={paint.farLit} />
    </>
  )
})

const FactoryMid = memo(function FactoryMid() {
  return (
    <>
      {Array.from({ length: 9 }, (_, row) => (
        <path key={row} d={`M0 ${520 + row * 42} H1440`} className={paint.leafShade} strokeWidth={4} opacity={0.5} />
      ))}
      <rect x={0} y={GROUND - 6} width={1440} height={30} className={paint.leafLit} />
      <path d={`M0 ${GROUND + 24} H1440 V1080 H0 Z`} className={paint.leafShade} />
    </>
  )
})

const FactoryNear = memo(function FactoryNear() {
  return (
    <>
      {[70, 1370].map((x) => (
        <path key={x} d={`M${x} 0 V420`} className={paint.leafShade} strokeWidth={10} strokeDasharray="22 8" />
      ))}
    </>
  )
})

/** The ship: the sea to the horizon, the deck's planks, its rail and a mast. */
const DeckFar = memo(function DeckFar() {
  return (
    <>
      <rect x={0} y={640} width={1440} height={440} className={paint.far} />
      <path d="M0 640 H1440" className={paint.rim} strokeWidth={4} opacity={0.6} />
      {[700, 760, 830].map((y) => (
        <path key={y} d={`M${200 + (y % 3) * 80} ${y} h300 M${900 - (y % 5) * 40} ${y + 20} h260`} className={paint.farLit} strokeWidth={4} />
      ))}
    </>
  )
})

const DeckMid = memo(function DeckMid() {
  return (
    <>
      <rect x={1180} y={-40} width={36} height={GROUND} className={paint.trunk} />
      <path d={`M1198 120 L980 ${GROUND - 120} M1198 120 L1420 ${GROUND - 120}`} className={paint.trunk} strokeWidth={5} />
      <rect x={0} y={GROUND - 150} width={1440} height={18} className={paint.trunk} />
      {[60, 220, 380, 540, 700, 860, 1020, 1180, 1340].map((x) => (
        <rect key={x} x={x} y={GROUND - 150} width={14} height={150} className={paint.trunk} />
      ))}
      <path d={`M0 ${GROUND - 4} H1440 V1080 H0 Z`} className={paint.leafLit} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M0 ${GROUND + 30 + i * 40} H1440`} className={paint.leaf} strokeWidth={4} />
      ))}
    </>
  )
})

const DeckNear = memo(function DeckNear() {
  return <path d="M-20 -20 Q300 260 380 620 M1460 -20 Q1180 220 1100 560" fill="none" className={paint.trunk} strokeWidth={8} />
})


const SKY: Record<Zone, 'sun' | 'moon' | null> = { sunset: 'sun', dusk: 'sun', jungle: null, treetop: null, night: 'moon', mine: null, lake: null, cave: null, factory: null, deck: 'sun' }

const zoneArt = (zone: Zone): ZoneArt => ({ sky: skyOf(SKY[zone]), far: Far, mid: Mid, near: Near })

export const ZONE_ART: Record<Zone, ZoneArt> = {
  sunset: zoneArt('sunset'),
  dusk: zoneArt('dusk'),
  jungle: zoneArt('jungle'),
  treetop: zoneArt('treetop'),
  night: zoneArt('night'),
  mine: { sky: skyOf(null), far: Rock, mid: MineMid, near: RockNear },
  lake: { sky: skyOf(null), far: LakeFar, mid: LakeMid, near: LakeNear },
  cave: { sky: skyOf(null), far: Rock, mid: CaveMid, near: CaveNear },
  factory: { sky: skyOf(null), far: FactoryFar, mid: FactoryMid, near: FactoryNear },
  deck: { sky: skyOf('sun'), far: DeckFar, mid: DeckMid, near: DeckNear },
}


