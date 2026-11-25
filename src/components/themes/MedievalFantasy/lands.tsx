import type { ReactNode } from 'react'
import { REALM } from './palette'

// The war's places as the strategy view shows them: the ground seen from above at an angle, filling the frame,
// far ground darker and fogged at the top, trees massed along the edges and the black fog of the unexplored
// map closing in on every side. Each land is a still 1920 by 1080 picture cut to the screen from its foot like
// the field over it (scenes.tsx), in the game's order: the river king's hall, a green hill village, the
// churchyard of the last village at night, the walled city at dusk, the ice shelf of the north, the frozen
// realm, the burning city of mages, the storm sea to the new land, the felled forest and the tree mountain.
// The great things a scene acts on (the throne, the walls, the tree) stand on the field, on the scene's side.

const W = 1920
const H = 1080

/** A steady scatter: the i-th of a seeded sequence, 0 to 1, the same on the server and in the browser. */
const rnd = (i: number, seed: number): number => {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453
  return x - Math.floor(x)
}

/** `count` points scattered over a box, each with a size factor 0 to 1. */
const scatter = (count: number, seed: number, box: { x: number; y: number; w: number; h: number }) =>
  Array.from({ length: count }, (_, i) => ({ x: box.x + rnd(i, seed) * box.w, y: box.y + rnd(i, seed + 1) * box.h, s: rnd(i, seed + 2) }))

function Land({ id, children }: { id: string; children: ReactNode }) {
  return (
    <svg className="absolute inset-0 block h-full w-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      {children}
      <FogOfWar id={id} />
    </svg>
  )
}

/** The ground from the far edge (top) to the near one, in a gradient of its colours. */
function Ground({ id, stops }: { id: string; stops: readonly string[] }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-ground`} x1="0" y1="0" x2="0" y2="1">
          {stops.map((color, i) => (
            <stop key={i} offset={i / (stops.length - 1)} stopColor={color} />
          ))}
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-ground)`} />
    </>
  )
}

/** The unexplored map's black fog, heavy at the far edge and the sides, and a lighter dark at the near edge. */
function FogOfWar({ id }: { id: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-fog-far`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={REALM.bgVoid} stopOpacity="0.95" />
          <stop offset="0.24" stopColor={REALM.bgVoid} stopOpacity="0.5" />
          <stop offset="0.45" stopColor={REALM.bgVoid} stopOpacity="0" />
          <stop offset="0.92" stopColor={REALM.bgVoid} stopOpacity="0" />
          <stop offset="1" stopColor={REALM.bgVoid} stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id={`${id}-fog-side`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={REALM.bgVoid} stopOpacity="0.9" />
          <stop offset="0.05" stopColor={REALM.bgVoid} stopOpacity="0.35" />
          <stop offset="0.11" stopColor={REALM.bgVoid} stopOpacity="0" />
          <stop offset="0.89" stopColor={REALM.bgVoid} stopOpacity="0" />
          <stop offset="0.95" stopColor={REALM.bgVoid} stopOpacity="0.35" />
          <stop offset="1" stopColor={REALM.bgVoid} stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-fog-far)`} />
      <rect width={W} height={H} fill={`url(#${id}-fog-side)`} />
    </>
  )
}

/** Blotches of another shade over the ground. */
function Patches({ seed, count, fill, box, size = 90, opacity = 0.5 }: { seed: number; count: number; fill: string; box: { x: number; y: number; w: number; h: number }; size?: number; opacity?: number }) {
  return (
    <g fill={fill} opacity={opacity}>
      {scatter(count, seed, box).map(({ x, y, s }, i) => (
        <ellipse key={i} cx={Math.round(x)} cy={Math.round(y)} rx={Math.round(size * (0.5 + s))} ry={Math.round(size * (0.5 + s) * 0.34)} />
      ))}
    </g>
  )
}

/** Pines massed as the view sees them from above: dark cones in rows, each with a lit side. */
function Pines({ seed, count, box, dark, lit, size = 1 }: { seed: number; count: number; box: { x: number; y: number; w: number; h: number }; dark: string; lit: string; size?: number }) {
  const trees = scatter(count, seed, box).sort((a, b) => a.y - b.y)
  return (
    <g>
      {trees.map(({ x, y, s }, i) => {
        const h = Math.round((70 + 60 * s) * size * (0.6 + (0.4 * y) / H))
        const w = Math.round(h * 0.42)
        const tx = Math.round(x)
        const ty = Math.round(y)
        return (
          <g key={i}>
            <ellipse cx={tx + 8} cy={ty} rx={w * 0.9} ry={w * 0.3} fill={REALM.stone1} opacity="0.5" />
            <path d={`M${tx} ${ty - h} L${tx - w} ${ty} L${tx + w} ${ty} Z`} fill={dark} />
            <path d={`M${tx} ${ty - h} L${tx + w} ${ty} L${tx + w * 0.2} ${ty} Z`} fill={lit} opacity="0.8" />
          </g>
        )
      })}
    </g>
  )
}

/** A column of smoke rising from the far ground. */
function Smoke({ x, y, h = 360, fill = REALM.stone22 }: { x: number; y: number; h?: number; fill?: string }) {
  return (
    <g fill={fill} opacity="0.45">
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse key={i} cx={x + i * 18 * (i % 2 ? 1 : -0.6)} cy={y - (h * i) / 5} rx={36 + i * 16} ry={24 + i * 10} />
      ))}
    </g>
  )
}

/** A dirt road winding from the near edge to the far one. */
const road = (from: number, to: number, width: number, fill: string) => (
  <path d={`M${from - width} ${H} Q${from + 120} 760 ${(from + to) / 2} 620 T${to} 360 L${to + width * 0.4} 360 Q${(from + to) / 2 + width * 0.6} 640 ${from + 120 + width} 780 T${from + width} ${H} Z`} fill={fill} />
)

// ---- the river king's hall ----

export function HallLand() {
  return (
    <Land id="mf-hall">
      <Ground id="mf-hall" stops={[REALM.stone2, REALM.stone9a, REALM.stone21, REALM.stone15]} />
      {Array.from({ length: 13 }, (_, i) => 160 * i - 0).map((x) => (
        <path key={x} d={`M${960 + (x - 960) * 0.45} 380 L${x} ${H}`} stroke={REALM.stone9} strokeWidth="4" />
      ))}
      {[440, 520, 610, 710, 820, 940].map((y) => (
        <path key={y} d={`M0 ${y} H${W}`} stroke={REALM.stone9} strokeWidth="3" />
      ))}
      <path d="M900 380 L1020 380 L1180 1080 L740 1080 Z" fill={REALM.blood28} opacity="0.85" />
      <path d="M912 380 L1008 380 L1150 1080 L770 1080 Z" fill="none" stroke={REALM.goldDark} strokeWidth="6" />
      {[
        [260, 900],
        [560, 700],
        [1360, 700],
        [1660, 900],
      ].map(([x, foot]) => (
        <g key={x}>
          <ellipse cx={x} cy={foot} rx="80" ry="26" fill={REALM.stone1} opacity="0.6" />
          <rect x={x - 54} y={foot - 640} width="108" height="640" fill={REALM.stone14} stroke={REALM.stone8} strokeWidth="6" />
          <rect x={x - 34} y={foot - 640} width="22" height="640" fill={REALM.stone27} opacity="0.5" />
          <path d={`M${x - 70} ${foot - 20} H${x + 70} V${foot} H${x - 70} Z`} fill={REALM.stone21} />
          <path d={`M${x - 44} ${foot - 560} H${x + 44} V${foot - 300} L${x} ${foot - 340} L${x - 44} ${foot - 300} Z`} fill={REALM.kingdomBlue} stroke={REALM.goldDark} strokeWidth="4" />
          <path d={`M${x - 12} ${foot - 470} V${foot - 420} H${x + 12} V${foot - 470} L${x + 6} ${foot - 480} L${x} ${foot - 470} L${x - 6} ${foot - 480} Z`} fill={REALM.goldMid} />
        </g>
      ))}
      {[700, 1220].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={600} rx="90" ry="60" fill={REALM.chaosFireMid} opacity="0.18" />
          <path d={`M${x - 20} 600 L${x + 20} 600 L${x + 12} 560 L${x - 12} 560 Z`} fill={REALM.stone22} />
          <path d={`M${x - 14} 560 Q${x} 510 ${x + 14} 560 Z`} fill={REALM.chaosFireBright} />
        </g>
      ))}
    </Land>
  )
}

// ---- a green hill village ----

export function VillageLand() {
  return (
    <Land id="mf-village">
      <Ground id="mf-village" stops={[REALM.moss8, REALM.moss16, REALM.grassGreen, REALM.moss23]} />
      <Patches seed={3} count={40} fill={REALM.grassLight} box={{ x: 0, y: 420, w: W, h: 660 }} opacity={0.35} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M${200 + i * 50} ${520 + i * 34} L${720 + i * 50} ${500 + i * 34}`} stroke={REALM.earth19} strokeWidth="18" opacity="0.7" />
      ))}
      {road(860, 1080, 90, REALM.dirt)}
      <Patches seed={5} count={14} fill={REALM.dirtDark} box={{ x: 760, y: 600, w: 420, h: 480 }} size={40} opacity={0.5} />
      <Pines seed={7} count={40} box={{ x: -40, y: 300, w: 380, h: 760 }} dark={REALM.moss10} lit={REALM.moss18} />
      <Pines seed={9} count={40} box={{ x: 1580, y: 300, w: 380, h: 760 }} dark={REALM.moss10} lit={REALM.moss18} />
      <Pines seed={11} count={40} box={{ x: 0, y: 260, w: W, h: 160 }} dark={REALM.moss8} lit={REALM.moss13} size={0.8} />
      <Smoke x={1300} y={480} />
      <Smoke x={640} y={520} h={300} />
    </Land>
  )
}

// ---- the churchyard of the last village, at night ----

export function ChurchyardLand() {
  return (
    <Land id="mf-yard">
      <Ground id="mf-yard" stops={[REALM.stone2, REALM.moss7, REALM.moss11, REALM.moss15]} />
      <Patches seed={13} count={30} fill={REALM.stone11} box={{ x: 0, y: 420, w: W, h: 660 }} opacity={0.5} />
      {scatter(28, 17, { x: 260, y: 520, w: 1400, h: 400 }).map(({ x, y }, i) => (
        <g key={i} transform={`translate(${Math.round(x)} ${Math.round(y)}) scale(${(0.6 + (0.4 * y) / H).toFixed(2)})`}>
          <ellipse cx="0" cy="4" rx="34" ry="10" fill={REALM.earth19} />
          <path d={i % 3 ? 'M-12 0 V-40 Q0 -54 12 -40 V0 Z' : 'M-3 0 V-50 M-14 -36 H14'} fill={REALM.stone27} stroke={REALM.stone27} strokeWidth="6" />
        </g>
      ))}
      <ellipse cx="960" cy="760" rx="900" ry="200" fill={REALM.plague} opacity="0.06" />
      <Pines seed={19} count={44} box={{ x: -40, y: 260, w: 340, h: 800 }} dark={REALM.stone6} lit={REALM.moss11} />
      <Pines seed={21} count={44} box={{ x: 1620, y: 260, w: 340, h: 800 }} dark={REALM.stone6} lit={REALM.moss11} />
      <Pines seed={23} count={40} box={{ x: 0, y: 240, w: W, h: 160 }} dark={REALM.stone3} lit={REALM.moss8} size={0.8} />
    </Land>
  )
}

// ---- the walled city at dusk ----

export function CityLand() {
  return (
    <Land id="mf-city">
      <Ground id="mf-city" stops={[REALM.blood7, REALM.blood19, REALM.stone21, REALM.earth19]} />
      <ellipse cx="960" cy="380" rx="1100" ry="260" fill={REALM.chaosFireMid} opacity="0.22" />
      {scatter(70, 29, { x: 0, y: 300, w: W, h: 230 }).map(({ x, y, s }, i) => (
        <g key={i} transform={`translate(${Math.round(x)} ${Math.round(y)})`}>
          <path d={`M-40 0 L-40 -34 L0 -60 L40 -34 L40 0 Z`} fill={REALM.stone14} />
          <path d="M-46 -30 L0 -64 L46 -30 L36 -30 L0 -54 L-36 -30 Z" fill={REALM.blood19} />
          {s > 0.55 && <path d="M-30 -40 Q-20 -110 0 -70 Q16 -130 30 -44 Z" fill={REALM.chaosFireMid} opacity="0.85" />}
        </g>
      ))}
      <Smoke x={420} y={360} h={320} fill={REALM.stone11} />
      <Smoke x={1500} y={340} h={320} fill={REALM.stone11} />
      {Array.from({ length: 10 }, (_, i) => i).map((i) => (
        <path key={i} d={`M0 ${620 + i * 46} H${W}`} stroke={REALM.stone15} strokeWidth="3" opacity="0.6" />
      ))}
      <Patches seed={31} count={18} fill={REALM.blood10} box={{ x: 200, y: 700, w: 1500, h: 360 }} size={40} opacity={0.6} />
    </Land>
  )
}

// ---- the ice shelf of the north, the burnt ships in the bay ----

export function NorthLand() {
  return (
    <Land id="mf-north">
      <Ground id="mf-north" stops={[REALM.night4, REALM.night12, REALM.frost75, REALM.frostFrostMid]} />
      <path d="M0 300 H1920 V430 Q1500 470 1200 440 T600 450 T0 420 Z" fill={REALM.night7} />
      {[360, 980, 1560].map((x, i) => (
        <g key={x} transform={`translate(${x} ${400 + i * 8})`}>
          <path d="M-120 0 Q-110 20 -70 20 L80 20 Q110 20 124 -16 L96 -4 Q80 8 70 8 L-70 8 Q-96 8 -104 -16 Z" fill={REALM.stone8b} />
          <path d="M-60 0 Q-40 -120 -10 -60 Q10 -150 40 -40 Q60 -100 70 0 Z" fill={REALM.chaosFireMid} opacity="0.85" />
          <path d="M-30 0 Q-14 -70 0 -30 Q14 -80 30 0 Z" fill={REALM.chaosFireCore} />
          <Smoke x={0} y={-80} h={240} fill={REALM.stone11} />
        </g>
      ))}
      <Patches seed={37} count={30} fill={REALM.frostFrostWhite} box={{ x: 0, y: 500, w: W, h: 580 }} size={110} opacity={0.5} />
      <Patches seed={39} count={18} fill={REALM.frostIceMid} box={{ x: 0, y: 520, w: W, h: 560 }} size={70} opacity={0.25} />
      <Pines seed={41} count={30} box={{ x: -40, y: 460, w: 300, h: 600 }} dark={REALM.night12} lit={REALM.frost81} />
      <Pines seed={43} count={30} box={{ x: 1660, y: 460, w: 300, h: 600 }} dark={REALM.night12} lit={REALM.frost81} />
    </Land>
  )
}

// ---- the frozen realm, from the old frost land: the frozen lake, its spires, the buried dead ----

export function FrozenLand() {
  return (
    <Land id="mf-frozen">
      <Ground id="mf-frozen" stops={[REALM.night4, REALM.night9, REALM.night17, REALM.night21]} />
      <ellipse cx="960" cy="700" rx="900" ry="170" fill={REALM.frostIceDark} opacity="0.25" />
      <ellipse cx="960" cy="700" rx="760" ry="130" fill={REALM.night12} opacity="0.5" />
      <path d="M300 690 L420 710 L500 692 L640 720 L720 700 M1200 712 L1320 690 L1440 720 L1600 696" stroke={REALM.frostIceMid} strokeWidth="2" fill="none" opacity="0.4" />
      {[
        [160, 520, 1],
        [380, 470, 0.7],
        [1560, 480, 0.8],
        [1780, 540, 1.1],
        [90, 880, 1.2],
        [1840, 900, 1.2],
      ].map(([x, y, s]) => (
        <g key={x} transform={`translate(${x} ${y}) scale(${s})`}>
          <path d="M-60 0 L-30 -150 L-12 -110 L0 -230 L14 -120 L34 -170 L60 0 Z" fill={REALM.night16} stroke={REALM.frostIceDark} strokeWidth="2" />
          <path d="M-8 -150 L0 -230 L8 -150 Z" fill={REALM.frostIceBright} opacity="0.4" />
        </g>
      ))}
      {scatter(16, 47, { x: 200, y: 800, w: 1520, h: 240 }).map(({ x, y, s }, i) => (
        <g key={i} transform={`translate(${Math.round(x)} ${Math.round(y)})`} opacity="0.55">
          <ellipse cx="0" cy="0" rx="30" ry="9" fill={REALM.frostFrostWhite} opacity="0.5" />
          {s > 0.5 ? <path d="M0 0 L-4 -24 L-10 -40 M-10 -40 L-14 -50 M-10 -40 L-8 -52 M-10 -40 L-4 -50" stroke={REALM.earth74} strokeWidth="3" fill="none" /> : <ellipse cx="0" cy="-8" rx="12" ry="10" fill={REALM.earth74} />}
        </g>
      ))}
      <Patches seed={49} count={26} fill={REALM.frostFrostWhite} box={{ x: 0, y: 760, w: W, h: 320 }} size={90} opacity={0.14} />
    </Land>
  )
}

// ---- the burning city of mages ----

export function BurningCityLand() {
  return (
    <Land id="mf-mages">
      <Ground id="mf-mages" stops={[REALM.blood6, REALM.blood12, REALM.mageStone, REALM.stone21]} />
      <ellipse cx="960" cy="340" rx="1200" ry="300" fill={REALM.blightFire} opacity="0.1" />
      {[120, 400, 700, 1220, 1520, 1800].map((x, i) => (
        <g key={x} transform={`translate(${x} ${440 + (i % 2) * 40})`}>
          <rect x="-34" y="-300" width="68" height="300" fill={REALM.mageStoneDark} />
          <path d="M-46 -300 L0 -380 L46 -300 Z" fill={REALM.mageViolet} />
          <path d="M-30 -220 Q-10 -360 10 -260 Q30 -380 40 -200 Z" fill={i % 2 ? REALM.blightFire : REALM.chaosFireMid} opacity="0.85" />
          <Smoke x={0} y={-320} h={260} fill={REALM.stone11} />
        </g>
      ))}
      {Array.from({ length: 9 }, (_, i) => i).map((i) => (
        <path key={i} d={`M0 ${560 + i * 58} H${W}`} stroke={REALM.mageStoneDark} strokeWidth="4" opacity="0.6" />
      ))}
      <Patches seed={53} count={20} fill={REALM.stone4a} box={{ x: 0, y: 600, w: W, h: 480 }} size={70} opacity={0.6} />
      {scatter(14, 57, { x: 100, y: 620, w: 1720, h: 420 }).map(({ x, y }, i) => (
        <path key={i} d={`M${Math.round(x) - 12} ${Math.round(y)} Q${Math.round(x)} ${Math.round(y) - 46} ${Math.round(x) + 12} ${Math.round(y)} Z`} fill={REALM.blightFire} opacity="0.7" />
      ))}
    </Land>
  )
}

// ---- the storm sea, and the new land's shore ----

export function SeaLand() {
  return (
    <Land id="mf-sea">
      <Ground id="mf-sea" stops={[REALM.stone2, REALM.night9, REALM.seaDeep, REALM.seaMid]} />
      <path d="M0 360 H1920 V560 Q1600 600 1300 580 T700 600 T0 570 Z" fill={REALM.redEarth} />
      <path d="M0 540 Q300 590 700 586 T1300 566 T1920 580 V620 Q1600 640 1300 616 T700 640 T0 610 Z" fill={REALM.sand} />
      <Pines seed={61} count={50} box={{ x: 0, y: 360, w: W, h: 150 }} dark={REALM.moss10} lit={REALM.moss18} size={0.8} />
      {Array.from({ length: 16 }, (_, i) => i).map((i) => (
        <path key={i} d={`M${(i * 233) % W} ${660 + ((i * 97) % 400)} q40 -16 80 0 t80 0`} stroke={REALM.frost66} strokeWidth="3" fill="none" opacity="0.4" />
      ))}
      <path d="M1360 0 L1300 140 L1340 150 L1260 330" stroke={REALM.frostIceBright} strokeWidth="5" fill="none" opacity="0.6" />
      <g stroke={REALM.frost75} strokeWidth="2" opacity="0.3">
        {Array.from({ length: 60 }, (_, i) => ({ x: (i * 211) % W, y: (i * 97) % H })).map(({ x, y }) => (
          <path key={`${x}-${y}`} d={`M${x} ${y} l-14 44`} />
        ))}
      </g>
    </Land>
  )
}

// ---- the felled forest of the new land ----

export function FelledForestLand() {
  return (
    <Land id="mf-felled">
      <Ground id="mf-felled" stops={[REALM.stone3b, REALM.blood12, REALM.redEarth, REALM.ember21]} />
      <Patches seed={67} count={30} fill={REALM.moss16} box={{ x: 0, y: 440, w: W, h: 640 }} size={80} opacity={0.4} />
      {scatter(26, 71, { x: 160, y: 520, w: 1600, h: 520 }).map(({ x, y, s }, i) => (
        <g key={i} transform={`translate(${Math.round(x)} ${Math.round(y)}) scale(${(0.6 + (0.4 * y) / H).toFixed(2)})`}>
          <ellipse cx="0" cy="0" rx="26" ry="9" fill={REALM.ember16} />
          <ellipse cx="0" cy="-10" rx="22" ry="8" fill={REALM.earth48} stroke={REALM.ember21} strokeWidth="3" />
          {s > 0.6 && <path d="M30 4 L120 20" stroke={REALM.forestBark} strokeWidth="14" strokeLinecap="round" />}
        </g>
      ))}
      <Pines seed={73} count={44} box={{ x: -40, y: 280, w: 340, h: 780 }} dark={REALM.moss8} lit={REALM.moss15} />
      <Pines seed={79} count={44} box={{ x: 1620, y: 280, w: 340, h: 780 }} dark={REALM.moss8} lit={REALM.moss15} />
      <Pines seed={83} count={40} box={{ x: 0, y: 250, w: W, h: 170 }} dark={REALM.moss7} lit={REALM.moss11} size={0.8} />
    </Land>
  )
}

// ---- the tree mountain ----

export function TreeMountainLand() {
  return (
    <Land id="mf-tree">
      <Ground id="mf-tree" stops={[REALM.moss7, REALM.moss12, REALM.grassGreen, REALM.moss18]} />
      <ellipse cx="960" cy="420" rx="1000" ry="240" fill={REALM.spirit} opacity="0.06" />
      <Patches seed={89} count={40} fill={REALM.grassLight} box={{ x: 0, y: 440, w: W, h: 640 }} opacity={0.3} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M0 ${560 + i * 130} Q960 ${520 + i * 130} 1920 ${560 + i * 130}`} stroke={REALM.moss10} strokeWidth="10" fill="none" opacity="0.4" />
      ))}
      <Pines seed={97} count={50} box={{ x: -40, y: 260, w: 360, h: 800 }} dark={REALM.moss10} lit={REALM.forestMoss} />
      <Pines seed={101} count={50} box={{ x: 1600, y: 260, w: 360, h: 800 }} dark={REALM.moss10} lit={REALM.forestMoss} />
      <Pines seed={103} count={46} box={{ x: 0, y: 240, w: W, h: 170 }} dark={REALM.moss8} lit={REALM.moss15} size={0.8} />
    </Land>
  )
}
