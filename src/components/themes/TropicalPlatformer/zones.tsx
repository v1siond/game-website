import { memo, useId, type ComponentType } from 'react'
import { COLORS as C, type Tone } from './palette'
import paint from './scenery.module.css'

// The run's places on the stages, one per world of the game it comes from, each in its own palette
// (palette.ts TONES): his isle with the sea round it, the jungle, the desert temple's dunes, the toy factory,
// the cove of wrecks, the mushroom forest, the castle's rampart in the rain, the hideout's steel, the ring
// under its lights and the sunset sea. Each is four planes on a 1440 by 1080 canvas in the place's tone: the
// sky, the far plane, the middle with the ground he stands on, the near plane in front. The jungle's are
// painted from the scenery's shapes (scenery.tsx); the place's own things stand on the ground in the figure
// plane (places/).

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
function skyOf(light: 'sun' | null): ComponentType {
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

// ---- the worlds past the jungle, each its own far, middle and near planes, the ground at GROUND

/** The sea from the horizon down, its crests catching the light. */
const SEA_LINE = 640

const SeaFar = memo(function SeaFar() {
  return (
    <>
      <rect x={0} y={SEA_LINE} width={1440} height={1080 - SEA_LINE} className={paint.sea} />
      <path d={`M0 ${SEA_LINE} H1440`} className={paint.rim} strokeWidth={3} opacity={0.6} />
      {[680, 730, 790].map((y, i) => (
        <path key={y} d={`M${120 + i * 70} ${y} h220 M${760 - i * 60} ${y + 14} h180 M${1100 + i * 30} ${y + 6} h160`} className={paint.seaLit} strokeWidth={4} opacity={0.6} />
      ))}
    </>
  )
})

/** His isle's beach: the palms at both sides and the sand he stands on. */
const IsleMid = memo(function IsleMid() {
  return (
    <>
      {PALMS.map(([x, scale, lean]) => (
        <use key={x} href="#tp-palm" transform={`translate(${x} ${GROUND + 6}) rotate(${lean}) scale(${scale})`} className={scale < 2 ? paint.haze : undefined} />
      ))}
      <path d={`M0 ${GROUND - 10} Q360 ${GROUND - 26} 720 ${GROUND - 6} T1440 ${GROUND - 12} V1080 H0 Z`} className={paint.leafShade} />
      <path d={`M0 ${GROUND - 10} Q360 ${GROUND - 26} 720 ${GROUND - 6} T1440 ${GROUND - 12}`} className={paint.rim} strokeWidth={4} opacity={0.5} />
    </>
  )
})

/** The desert: dunes far off and two stepped temples on them. */
const DesertFar = memo(function DesertFar() {
  const temple = (x: number, w: number) =>
    [0, 1, 2, 3, 4].map((i) => <rect key={i} x={x - w / 2 + i * (w / 10)} y={600 - (i + 1) * 40} width={w - i * (w / 5)} height={42} className={i % 2 ? paint.farLit : paint.far} />)
  return (
    <>
      <g opacity={0.8}>{temple(260, 300)}</g>
      <g opacity={0.8}>{temple(1180, 360)}</g>
      <path d="M0 640 Q240 560 480 620 T960 600 T1440 630 V1080 H0 Z" className={paint.far} />
      <path d="M0 700 Q300 640 600 690 T1200 680 T1440 700 V1080 H0 Z" className={paint.farLit} />
    </>
  )
})

const DesertMid = memo(function DesertMid() {
  return (
    <>
      <path d={`M0 ${GROUND - 8} Q360 ${GROUND - 24} 720 ${GROUND - 6} T1440 ${GROUND - 10} V1080 H0 Z`} className={paint.leaf} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${60 + i * 360} ${GROUND + 30 + (i % 2) * 30} q60 -12 120 0 t120 0`} fill="none" className={paint.rim} strokeWidth={3} opacity={0.4} />
      ))}
    </>
  )
})

/** Broken stone posts at both edges in front. */
const DesertNear = memo(function DesertNear() {
  return (
    <>
      {[30, 1410].map((x) => (
        <g key={x}>
          <rect x={x - 34} y={760} width={68} height={320} className={paint.trunk} />
          <path d={`M${x - 34} 760 L${x - 10} 740 L${x + 12} 756 L${x + 34} 744 V760 Z`} className={paint.trunk} />
          <path d={`M${x - 30} 820 H${x + 30} M${x - 30} 900 H${x + 30}`} className={paint.rim} strokeWidth={3} opacity={0.3} />
        </g>
      ))}
    </>
  )
})

/** The toy factory: girders and a high window with the moon in it far off. */
const FactoryFar = memo(function FactoryFar() {
  return (
    <>
      <rect x={560} y={140} width={320} height={260} className={paint.farLit} />
      <circle cx={790} cy={220} r={40} fill={C.moon} opacity={0.9} />
      <path d="M560 270 H880 M720 140 V400" className={paint.far} strokeWidth={12} />
      {[100, 460, 900, 1260].map((x) => (
        <g key={x}>
          <rect x={x} y={80} width={40} height={760} className={paint.far} />
          <path d={`M${x} 160 L${x + 160} 420 M${x + 160} 160 L${x} 420`} className={paint.far} strokeWidth={14} />
        </g>
      ))}
    </>
  )
})

// The factory's toy blocks stacked at both sides, each [x, y, colour].
const BLOCKS: ReadonlyArray<readonly [number, number, string]> = [
  [60, 0, '#e8463a'],
  [150, 0, '#2f86e8'],
  [100, -90, '#ffc93c'],
  [1280, 0, '#3fb83a'],
  [1370, 0, '#9a52e0'],
  [1325, -90, '#e8463a'],
]

const FactoryMid = memo(function FactoryMid() {
  return (
    <>
      {Array.from({ length: 8 }, (_, row) => (
        <path key={row} d={`M0 ${480 + row * 50} H1440`} className={paint.leafShade} strokeWidth={4} opacity={0.5} />
      ))}
      <rect x={0} y={GROUND - 6} width={1440} height={24} className={paint.leafLit} />
      <path d={`M0 ${GROUND + 18} H1440 V1080 H0 Z`} className={paint.leafShade} />
      {BLOCKS.map(([x, y, colour]) => (
        <g key={`${x}${y}`} transform={`translate(${x} ${GROUND - 90 + y})`}>
          <rect x={-44} y={0} width={88} height={88} rx={6} fill={colour} stroke={C.shadow} strokeWidth={3} opacity={0.85} />
          <rect x={-30} y={14} width={60} height={60} rx={4} fill="none" stroke="#ffffff" strokeWidth={3} opacity={0.35} />
        </g>
      ))}
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

/** The cove: its rock walls and the wreck of a galleon far off in the dark. */
const CoveFar = memo(function CoveFar() {
  return (
    <>
      <path d="M0 0 H1440 V260 Q1200 340 1100 220 Q980 120 720 160 Q460 120 340 240 Q220 340 0 260 Z" className={paint.far} />
      <g transform="translate(720 760) rotate(-8)" className={paint.farLit}>
        <path d="M-260 0 Q-250 -110 -200 -120 H220 Q280 -130 300 -170 L310 -60 Q300 0 240 10 Z" />
        <rect x={-120} y={-460} width={14} height={340} />
        <rect x={60} y={-520} width={16} height={400} />
        <path d="M-113 -440 L-40 -300 L-113 -300 Z M68 -500 L170 -320 L68 -320 Z" opacity={0.7} />
      </g>
      <path d="M0 520 Q200 600 260 1080 H0 Z M1440 520 Q1240 600 1180 1080 H1440 Z" className={paint.far} />
    </>
  )
})

/** The cove's water from the line he sails on down. */
const CoveMid = memo(function CoveMid() {
  return (
    <>
      <rect x={0} y={GROUND - 10} width={1440} height={1080 - GROUND + 10} className={paint.sea} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M0 ${GROUND + 20 + i * 50} Q180 ${GROUND + 8 + i * 50} 360 ${GROUND + 20 + i * 50} T720 ${GROUND + 20 + i * 50} T1080 ${GROUND + 20 + i * 50} T1440 ${GROUND + 20 + i * 50}`} fill="none" className={paint.rim} strokeWidth={3} opacity={0.25} />
      ))}
    </>
  )
})

const CoveNear = memo(function CoveNear() {
  return <path d="M0 0 H1440 V40 Q1340 110 1260 50 Q1160 120 1080 40 Q900 90 800 30 Q640 100 520 40 Q360 120 260 50 Q140 110 0 60 Z" className={paint.leafShade} />
})

/** The mushroom forest: big caps far off over the treeline. */
const FungiFar = memo(function FungiFar() {
  return (
    <>
      {[0, 400, 800, 1200].map((x) => (
        <use key={x} href="#tp-treeline" transform={`translate(${x - 120} 600) scale(1.1 3.2)`} />
      ))}
      {[
        [160, 420, 1.2],
        [620, 470, 0.8],
        [1240, 400, 1.4],
      ].map(([x, y, k]) => (
        <g key={x} transform={`translate(${x} ${y}) scale(${k})`} className={paint.farLit}>
          <rect x={-16} y={0} width={32} height={300} />
          <path d="M-120 10 Q-110 -90 0 -100 Q110 -90 120 10 Z" />
        </g>
      ))}
    </>
  )
})

const FungiMid = memo(function FungiMid() {
  return (
    <>
      {[
        [80, 1.4],
        [1360, 1.2],
      ].map(([x, k]) => (
        <g key={x} transform={`translate(${x} ${GROUND}) scale(${k})`}>
          <rect x={-14} y={-150} width={28} height={150} className={paint.trunk} />
          <path d="M-90 -140 Q-80 -220 0 -226 Q80 -220 90 -140 Z" className={paint.bloom} />
          <circle cx={-30} cy={-186} r={10} fill="#fff6ea" opacity={0.85} />
          <circle cx={26} cy={-200} r={8} fill="#fff6ea" opacity={0.85} />
        </g>
      ))}
      <path d={`M0 ${GROUND - 6} Q360 ${GROUND - 22} 720 ${GROUND - 4} T1440 ${GROUND - 8} V1080 H0 Z`} className={paint.leafShade} />
      <path d={`M0 ${GROUND - 6} Q360 ${GROUND - 22} 720 ${GROUND - 4} T1440 ${GROUND - 8}`} className={paint.rim} strokeWidth={4} opacity={0.5} />
    </>
  )
})

/** The castle: its towers black against the storm far off. */
const CastleFar = memo(function CastleFar() {
  const tower = (x: number, h: number, w: number) => (
    <g key={x}>
      <rect x={x - w / 2} y={GROUND - h} width={w} height={h} />
      <path d={`M${x - w / 2 - 14} ${GROUND - h} L${x} ${GROUND - h - w * 1.1} L${x + w / 2 + 14} ${GROUND - h} Z`} />
    </g>
  )
  return (
    <g className={paint.far}>
      {tower(140, 600, 120)}
      {tower(420, 460, 90)}
      {tower(1010, 520, 100)}
      {tower(1300, 640, 130)}
      <rect x={0} y={GROUND - 300} width={1440} height={300} />
    </g>
  )
})

/** The rampart he stands on: the crenellated parapet behind him and the stones underfoot. */
const CastleMid = memo(function CastleMid() {
  return (
    <>
      <rect x={0} y={GROUND - 150} width={1440} height={150} className={paint.trunk} />
      {Array.from({ length: 13 }, (_, i) => (
        <rect key={i} x={i * 120 - 20} y={GROUND - 210} width={70} height={64} className={paint.trunk} />
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d={`M${i * 120} ${GROUND - 150} V${GROUND} M${i * 120 + 60} ${GROUND - 100} V${GROUND - 50}`} className={paint.rib} strokeWidth={3} />
      ))}
      <path d={`M0 ${GROUND - 100} H1440 M0 ${GROUND - 50} H1440`} className={paint.rib} strokeWidth={3} />
      <path d={`M0 ${GROUND - 4} H1440 V1080 H0 Z`} className={paint.leafShade} />
      {[200, 680, 1180].map((x) => (
        <path key={x} d={`M${x} ${GROUND - 150} q-10 40 6 80 q-14 20 -4 60`} fill="none" className={paint.vine} strokeWidth={8} />
      ))}
    </>
  )
})

/** The hideout: steel wall panels and pipes, the red alarm lamps along the top. */
const HelmFar = memo(function HelmFar() {
  return (
    <>
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={i * 170 - 40} y={120} width={160} height={700} className={i % 2 ? paint.far : paint.farLit} opacity={0.8} />
      ))}
      {[220, 300].map((y) => (
        <path key={y} d={`M0 ${y} H1440`} className={paint.far} strokeWidth={18} />
      ))}
      {[180, 540, 900, 1260].map((x) => (
        <circle key={x} cx={x} cy={90} r={18} className={paint.bloom} />
      ))}
    </>
  )
})

const HelmMid = memo(function HelmMid() {
  return (
    <>
      <rect x={0} y={GROUND - 6} width={1440} height={1080 - GROUND + 6} className={paint.leaf} />
      {Array.from({ length: 36 }, (_, i) => (
        <path key={i} d={`M${i * 40} ${GROUND} V1080`} className={paint.leafShade} strokeWidth={4} />
      ))}
      <path d={`M0 ${GROUND - 6} H1440`} className={paint.rim} strokeWidth={3} opacity={0.6} />
    </>
  )
})

const HelmNear = memo(function HelmNear() {
  return <path d="M0 30 H1440 M0 56 H1440" className={paint.leafShade} strokeWidth={22} />
})

/** The arena round the ring: the crowd in the dark and the banks of lights over it. */
const RingFar = memo(function RingFar() {
  return (
    <>
      {Array.from({ length: 5 }, (_, row) =>
        Array.from({ length: 30 }, (_, i) => <circle key={`${row}-${i}`} cx={i * 50 + (row % 2) * 25} cy={520 + row * 46} r={16} className={row % 2 ? paint.far : paint.farLit} />),
      )}
      {[200, 600, 1000, 1360].map((x) => (
        <g key={x} transform={`translate(${x} 150)`}>
          <rect x={-90} y={-40} width={180} height={80} rx={8} fill="#2a2e3a" />
          {[-60, -20, 20, 60].map((cx) => (
            <circle key={cx} cx={cx} cy={0} r={15} fill="#fffbe8" />
          ))}
        </g>
      ))}
    </>
  )
})

/** The ring: its blue mat with red stars, the ropes along the far side. */
const RingMid = memo(function RingMid() {
  return (
    <>
      {[GROUND - 70, GROUND - 130, GROUND - 190].map((y, i) => (
        <path key={y} d={`M0 ${y} H1440`} stroke={['#d8282a', '#ffffff', '#2f86e8'][i]} strokeWidth={8} />
      ))}
      <rect x={0} y={GROUND - 6} width={1440} height={1080 - GROUND + 6} className={paint.leaf} />
      <path d={`M0 ${GROUND - 6} H1440`} className={paint.rim} strokeWidth={4} opacity={0.7} />
      {[100, 360, 620, 880, 1140, 1400].map((x, i) => (
        <path key={x} transform={`translate(${x} ${GROUND + 70 + (i % 2) * 60}) scale(1 0.4)`} d="M0 -40 L12 -12 L40 -12 L18 6 L26 34 L0 18 L-26 34 L-18 6 L-40 -12 L-12 -12 Z" className={paint.bloom} />
      ))}
    </>
  )
})

/** The sunset sea on the way home: the water from the line the giant swims on down. */
const SeaMid = memo(function SeaMid() {
  return (
    <>
      <rect x={0} y={GROUND - 10} width={1440} height={1080 - GROUND + 10} className={paint.sea} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${100 + i * 200} ${GROUND + 30 + i * 46} h260 M${900 - i * 120} ${GROUND + 50 + i * 40} h200`} className={paint.seaLit} strokeWidth={4} opacity={0.6} />
      ))}
    </>
  )
})

const Nothing = memo(function Nothing() {
  return null
})

const SKY: Record<Zone, 'sun' | null> = { isle: null, jungle: null, desert: 'sun', factory: null, cove: null, fungi: null, castle: null, helm: null, ring: null, sea: 'sun' }

const art = (zone: Zone, far: ComponentType, mid: ComponentType, near: ComponentType): ZoneArt => ({ sky: skyOf(SKY[zone]), far, mid, near })

export const ZONE_ART: Record<Zone, ZoneArt> = {
  isle: art('isle', SeaFar, IsleMid, Near),
  jungle: art('jungle', Far, Mid, Near),
  desert: art('desert', DesertFar, DesertMid, DesertNear),
  factory: art('factory', FactoryFar, FactoryMid, FactoryNear),
  cove: art('cove', CoveFar, CoveMid, CoveNear),
  fungi: art('fungi', FungiFar, FungiMid, Near),
  castle: art('castle', CastleFar, CastleMid, Nothing),
  helm: art('helm', HelmFar, HelmMid, HelmNear),
  ring: art('ring', RingFar, RingMid, Nothing),
  sea: art('sea', SeaFar, SeaMid, Nothing),
}
