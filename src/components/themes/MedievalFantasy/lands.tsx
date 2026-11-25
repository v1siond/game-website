import type { ReactNode } from 'react'
import { REALM } from './palette'

// The war's places, one land per scene in the campaign's order, each a still 1920 by 1080 picture cut to the
// screen from its foot like the field over it (scenes.tsx): the river kingdom's council hall and its steps in
// the rain, a hill village, the last village on the road at night, the granary at the river bridge, the
// walled river city at dusk, the ice shelf of the frozen north, the mages' tower city, the clans' volcanic
// island, the far shore's forest and the tree mountain at dawn. A part a scene changes is marked data-fx.

const W = 1920
const H = 1080
/** The ground line the field's units stand on. */
const GROUND = 1000

function Land({ children }: { children: ReactNode }) {
  return (
    <svg className="absolute inset-0 block h-full w-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

function Sky({ id, stops }: { id: string; stops: readonly string[] }) {
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          {stops.map((color, i) => (
            <stop key={i} offset={i / (stops.length - 1)} stopColor={color} />
          ))}
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id})`} />
    </>
  )
}

/** Rain in slanted streaks over the whole picture. */
function Rain({ opacity = 0.35 }: { opacity?: number }) {
  return (
    <g stroke={REALM.frost75} strokeWidth="2" opacity={opacity}>
      {Array.from({ length: 70 }, (_, i) => ({ x: (i * 211) % W, y: (i * 97) % H })).map(({ x, y }) => (
        <path key={`${x}-${y}`} d={`M${x} ${y} l-14 44`} />
      ))}
    </g>
  )
}

/** Rolling hills on a band, `fill` the near one. */
const hills = (y: number, rise: number, fill: string, seed = 0) => (
  <path d={`M0 ${y} Q${240 + seed} ${y - rise} ${520 + seed} ${y - rise * 0.4} T${1100 + seed} ${y - rise * 0.6} T${1600} ${y - rise} T${W} ${y - rise * 0.3} V${H} H0 Z`} fill={fill} />
)

// ---- the council hall, and its steps outside in the rain ----

export function HallLand() {
  return (
    <Land>
      <Sky id="mf-hall" stops={[REALM.night9, REALM.stone11, REALM.stone8]} />
      {[260, 640, 1280, 1660].map((x) => (
        <g key={x}>
          <path d={`M${x - 70} 760 V300 Q${x} 180 ${x + 70} 300 V760 Z`} fill={REALM.night14} stroke={REALM.stone22} strokeWidth="10" />
          <path d={`M${x} 200 V760 M${x - 70} 480 H${x + 70}`} stroke={REALM.stone22} strokeWidth="6" />
          <g stroke={REALM.frost75} strokeWidth="2" opacity="0.4">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <path key={i} d={`M${x - 50 + i * 20} ${320 + (i % 3) * 120} l-6 26`} />
            ))}
          </g>
        </g>
      ))}
      {[450, 960, 1470].map((x) => (
        <g key={x}>
          <path d={`M${x - 50} 160 H${x + 50} V520 L${x} 480 L${x - 50} 520 Z`} fill={REALM.riverBlue} />
          <path d={`M${x - 30} 300 Q${x - 15} 280 ${x} 300 T${x + 30} 300 M${x - 30} 340 Q${x - 15} 320 ${x} 340 T${x + 30} 340`} stroke={REALM.riverCream} strokeWidth="6" fill="none" />
        </g>
      ))}
      <rect y={GROUND - 120} width={W} height={H} fill={REALM.stone11} />
      {Array.from({ length: 12 }, (_, i) => i * 170).map((x) => (
        <path key={x} d={`M${x} ${GROUND - 120} L${x - 60} ${H}`} stroke={REALM.stone8} strokeWidth="4" />
      ))}
      {[200, 1740].map((x) => (
        <g key={x}>
          <path d={`M${x - 30} ${GROUND - 40} L${x - 20} ${GROUND - 160} H${x + 20} L${x + 30} ${GROUND - 40} Z`} fill={REALM.stone22} />
          <path d={`M${x - 26} ${GROUND - 160} Q${x} ${GROUND - 250} ${x + 26} ${GROUND - 160} Z`} fill={REALM.chaosFireMid} />
          <circle cx={x} cy={GROUND - 190} r={90} fill={REALM.chaosFireBright} opacity="0.12" />
        </g>
      ))}
      <g data-fx="outside" opacity="0">
        <Sky id="mf-rain" stops={[REALM.night7, REALM.night14, REALM.stone11]} />
        <path d={`M300 ${GROUND - 140} V140 L960 40 L1620 140 V${GROUND - 140} Z`} fill={REALM.stone15} />
        {[420, 640, 1280, 1500].map((x) => (
          <rect key={x} x={x - 26} y={260} width={52} height={160} rx={26} fill={REALM.chaosFireBright} opacity="0.35" />
        ))}
        <path d={`M820 ${GROUND - 140} V560 Q960 440 1100 560 V${GROUND - 140} Z`} fill={REALM.ember16} stroke={REALM.stone28} strokeWidth="12" />
        <path d={`M960 520 V${GROUND - 140}`} stroke={REALM.stone8} strokeWidth="6" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={560 - i * 60} y={GROUND - 140 + i * 35} width={800 + i * 120} height={35} fill={i % 2 ? REALM.stone22 : REALM.stone28} />
        ))}
        <Rain opacity={0.5} />
      </g>
    </Land>
  )
}

// ---- a hill village ----

export function VillageLand() {
  return (
    <Land>
      <Sky id="mf-village" stops={[REALM.night15, REALM.ember29, REALM.chaosFireBright]} />
      {hills(760, 160, REALM.moss11, 0)}
      {hills(860, 120, REALM.moss13, 120)}
      {[300, 520, 1720].map((x) => (
        <g key={x}>
          <rect x={x - 50} y={GROUND - 150} width={100} height={80} fill={REALM.ember23} />
          <path d={`M${x - 64} ${GROUND - 150} L${x} ${GROUND - 210} L${x + 64} ${GROUND - 150} Z`} fill={REALM.earth36} />
          <rect x={x - 12} y={GROUND - 120} width={20} height={26} fill={REALM.chaosFireBright} opacity="0.7" />
        </g>
      ))}
      <rect y={GROUND - 60} width={W} height={H} fill={REALM.moss10} />
      {Array.from({ length: 30 }, (_, i) => i * 66).map((x) => (
        <path key={x} d={`M${x} ${GROUND - 20} l8 -18 l8 18`} stroke={REALM.moss15} strokeWidth="3" fill="none" />
      ))}
    </Land>
  )
}

// ---- the last village on the road, at night ----

export function LastVillageLand() {
  return (
    <Land>
      <Sky id="mf-last" stops={[REALM.night4, REALM.night11, REALM.night18]} />
      <circle cx={1500} cy={220} r={60} fill={REALM.frost81} opacity="0.7" />
      {hills(820, 220, REALM.night9, 200)}
      <path d={`M1400 ${GROUND - 120} Q1700 620 ${W} 600 V${GROUND} H1400 Z`} fill={REALM.night12} />
      {[180, 420].map((x) => (
        <g key={x}>
          <rect x={x - 60} y={GROUND - 170} width={120} height={110} fill={REALM.stone15} />
          <path d={`M${x - 76} ${GROUND - 170} L${x} ${GROUND - 240} L${x + 76} ${GROUND - 170} Z`} fill={REALM.stone11} />
          <rect x={x - 14} y={GROUND - 140} width={24} height={30} fill={REALM.chaosFireBright} opacity="0.6" />
        </g>
      ))}
      <rect y={GROUND - 60} width={W} height={H} fill={REALM.night9b} />
    </Land>
  )
}

// ---- the granary at the river bridge ----

export function GranaryLand() {
  return (
    <Land>
      <Sky id="mf-granary" stops={[REALM.stone28, REALM.stone41, REALM.ash53]} />
      {hills(700, 120, REALM.moss16, 60)}
      <g>
        <rect x={180} y={GROUND - 330} width={260} height={270} fill={REALM.ember23} stroke={REALM.ember16} strokeWidth="6" />
        <path d={`M160 ${GROUND - 330} L310 ${GROUND - 450} L460 ${GROUND - 330} Z`} fill={REALM.earth30} />
        <rect x={270} y={GROUND - 190} width={80} height={130} fill={REALM.ember13} />
      </g>
      <rect y={GROUND - 70} width={W} height={H} fill={REALM.moss13} />
      <path d={`M1560 ${GROUND - 70} Q1620 ${GROUND - 40} 1600 ${H} H1900 Q1860 ${GROUND - 30} 1920 ${GROUND - 70} Z`} fill={REALM.night19} />
      <path d={`M1500 ${GROUND - 70} Q1700 ${GROUND - 200} 1920 ${GROUND - 70}`} stroke={REALM.stone41} strokeWidth="36" fill="none" />
      <path d={`M1500 ${GROUND - 60} Q1700 ${GROUND - 190} 1920 ${GROUND - 60}`} stroke={REALM.stone28} strokeWidth="8" fill="none" />
    </Land>
  )
}

// ---- the walled river city at dusk ----

export function RiverCityLand() {
  return (
    <Land>
      <Sky id="mf-city" stops={[REALM.night14a, REALM.blood31, REALM.chaosFireMid]} />
      {[[700, 300], [1000, 220], [1350, 340]].map(([x, r]) => (
        <ellipse key={x} cx={x} cy={300} rx={r} ry={90} fill={REALM.stone11} opacity="0.7" />
      ))}
      <path d={`M300 ${GROUND - 120} V560 H360 V520 H420 V560 H900 V420 H980 V560 H1500 V520 H1560 V560 H1620 V${GROUND - 120} Z`} fill={REALM.stone15} />
      {[480, 640, 780, 1100, 1260, 1400].map((x, i) => (
        <path key={x} d={`M${x - 40} 560 L${x} ${500 - (i % 2) * 30} L${x + 40} 560 Z`} fill={REALM.blood15} />
      ))}
      <rect y={GROUND - 120} width={W} height={H} fill={REALM.earth19} />
      <rect y={GROUND - 30} width={W} height={H} fill={REALM.earth26} />
    </Land>
  )
}

// ---- the ice shelf of the frozen north ----

export function IceLand() {
  return (
    <Land>
      <Sky id="mf-ice" stops={[REALM.night4, REALM.night16, REALM.frostSkyBot]} />
      <path d="M0 260 Q480 160 960 240 T1920 200" stroke={REALM.selectRing} strokeWidth="40" fill="none" opacity="0.18" />
      <path d="M0 330 Q600 240 1100 320 T1920 280" stroke={REALM.frostIceMid} strokeWidth="30" fill="none" opacity="0.15" />
      <path d={`M0 ${GROUND - 200} L240 560 L420 ${GROUND - 260} L700 480 L980 ${GROUND - 240} L1300 520 L1600 ${GROUND - 220} L${W} 600 V${H} H0 Z`} fill={REALM.frostIceDark} />
      <path d={`M240 560 L300 700 M700 480 L760 640 M1300 520 L1360 700`} stroke={REALM.frostIceMid} strokeWidth="6" />
      <rect y={GROUND - 60} width={W} height={H} fill={REALM.frostFrostMid} />
      <path d={`M0 ${GROUND - 60} H${W}`} stroke={REALM.frostFrostWhite} strokeWidth="6" />
    </Land>
  )
}

// ---- the mages' tower city ----

export function TowerCityLand() {
  return (
    <Land>
      <Sky id="mf-towers" stops={[REALM.night7a, REALM.night20b, REALM.blood23]} />
      {[[180, 520], [330, 640], [480, 460], [640, 580], [790, 500]].map(([x, h]) => (
        <g key={x}>
          <rect x={x - 34} y={GROUND - h} width={68} height={h} fill={REALM.night20} stroke={REALM.night23} strokeWidth="4" />
          <path d={`M${x - 46} ${GROUND - h} L${x} ${GROUND - h - 110} L${x + 46} ${GROUND - h} Z`} fill={REALM.night21} />
          <rect x={x - 10} y={GROUND - h + 60} width={20} height={34} fill={REALM.gateLight} opacity="0.6" />
          <g data-fx={`burn-${x}`} opacity="0">
            <path d={`M${x - 40} ${GROUND - h + 10} Q${x - 20} ${GROUND - h - 90} ${x} ${GROUND - h - 30} Q${x + 24} ${GROUND - h - 120} ${x + 40} ${GROUND - h + 10} Z`} fill={REALM.cinderGlow} />
            <ellipse cx={x} cy={GROUND - h - 160} rx={70} ry={50} fill={REALM.stone11} opacity="0.8" />
          </g>
        </g>
      ))}
      <path d={`M60 ${GROUND - 120} H900 V${GROUND} H60 Z`} fill={REALM.night15} />
      <rect y={GROUND - 40} width={W} height={H} fill={REALM.stone11} />
    </Land>
  )
}

// ---- the clans' volcanic island ----

export function IslandLand() {
  return (
    <Land>
      <Sky id="mf-island" stops={[REALM.stone8, REALM.blood23, REALM.ember34]} />
      <g data-fx="mountain">
        <path d={`M200 ${GROUND - 120} L620 300 L760 300 L1180 ${GROUND - 120} Z`} fill={REALM.stone11} />
        <path d="M620 300 L690 380 L760 300 Z" fill={REALM.cinderGlow} />
        <path d="M690 300 Q640 180 700 80 Q760 0 700 -60" stroke={REALM.stone22} strokeWidth="60" fill="none" opacity="0.7" />
      </g>
      <rect y={GROUND - 120} width={W} height={H} fill={REALM.night18} />
      <path d={`M0 ${GROUND - 120} H${W}`} stroke={REALM.frost75} strokeWidth="3" opacity="0.4" />
      <path d={`M1000 ${GROUND - 50} Q1400 ${GROUND - 110} ${W} ${GROUND - 70} V${H} H1000 Z`} fill={REALM.earth48} />
    </Land>
  )
}

// ---- the far shore's forest ----

export function ForestLand() {
  return (
    <Land>
      <Sky id="mf-forest" stops={[REALM.night9, REALM.moss11, REALM.moss13]} />
      {Array.from({ length: 14 }, (_, i) => 60 + i * 140).map((x, i) => (
        <g key={x}>
          <rect x={x - 18} y={200 + (i % 3) * 40} width={36} height={800} fill={REALM.forestBark} opacity="0.7" />
          <circle cx={x} cy={200 + (i % 3) * 40} r={110} fill={REALM.moss11a} />
        </g>
      ))}
      {[700, 860, 1000].map((x) => (
        <rect key={x} x={x - 26} y={GROUND - 90} width={52} height={40} fill={REALM.forestBark} />
      ))}
      <rect y={GROUND - 50} width={W} height={H} fill={REALM.moss10} />
    </Land>
  )
}

// ---- the tree mountain at dawn ----

export function MountainLand() {
  return (
    <Land>
      <Sky id="mf-mountain" stops={[REALM.night14, REALM.ember34, REALM.chaosFireBright]} />
      <path d={`M0 ${GROUND - 80} L260 360 L440 300 L900 420 L${W} ${GROUND - 160} V${H} H0 Z`} fill={REALM.moss10a} />
      <g transform="translate(420 300)">
        <path d="M-40 0 Q-60 -200 -20 -300 L20 -300 Q60 -200 40 0 Z" fill={REALM.forestBark} />
        {[
          [-160, -340, 140],
          [0, -420, 180],
          [170, -330, 140],
        ].map(([x, y, r]) => (
          <circle key={x} cx={x} cy={y} r={r} fill={REALM.moss13} opacity="0.9" />
        ))}
        <g data-fx="shoot" opacity="0">
          <path d="M60 0 Q56 -30 64 -50" stroke={REALM.selectRing} strokeWidth="6" fill="none" />
          <path d="M64 -50 Q80 -62 86 -48 Q72 -44 64 -50 Z M62 -36 Q44 -46 40 -32 Q54 -30 62 -36 Z" fill={REALM.selectRing} />
        </g>
        <g data-fx="scorch" opacity="0">
          <circle cx={-120} cy={-300} r={110} fill={REALM.stone8} opacity="0.8" />
          <circle cx={120} cy={-360} r={90} fill={REALM.stone8} opacity="0.7" />
        </g>
      </g>
      <rect y={GROUND - 50} width={W} height={H} fill={REALM.moss10} />
    </Land>
  )
}
