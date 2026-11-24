'use client'

import type { ReactNode } from 'react'
import { FS } from './palette'

// The arcade tour's stages, a place of its own for every round, drawn on one 1600 by 900 canvas for the
// theatre's scenes (theatre.tsx), each with its own crowd: the castle rooftop under the moon for his
// entrance and the win; the dojo hall with its students kneeling along the wall (About); the street market
// at noon (Work); the factory floor under the crane, the workers on the gantry (Tech Stack); the subway
// platform with the train in and the riders at its windows (Services); the harbour at sunset, the crowd on
// the yacht's deck (Projects); the neon plaza at night under the signs (Ventures); the concert stage, the
// crowd's hands up at the front (Bands); the temple ring (Muay Thai). Every stage stands still: only the
// scroll moves the theatre.

export type Zone = 'castle' | 'dojo' | 'market' | 'factory' | 'subway' | 'harbour' | 'plaza' | 'concert' | 'temple'

export const W = 1600
export const H = 900

const SHIRTS = [FS.p2Dark, FS.p1, FS.health, FS.orange, FS.chrome, FS.giDeep, FS.gold]
const SKINS = ['#e9b08a', '#b9774c', FS.skinDeep, '#f2c49b']

// A group of onlookers standing on the line `base`, `count` of them from `x`, `gap` apart.
export function CrowdGroup({ x, base, count, gap, scale, i }: { x: number; base: number; count: number; gap: number; scale: number; i: number }) {
  return (
    <g>
      {Array.from({ length: count }, (_, k) => (
        <g key={k} transform={`translate(${x + k * gap} ${base + (k % 2) * 6}) scale(${scale})`}>
          <path d="M-12 0 Q-12 -19 0 -20 Q12 -19 12 0 Z" fill={SHIRTS[(k + i) % SHIRTS.length]} stroke={FS.ink} strokeWidth={1.4} />
          {k % 3 === 1 && <path d="M8 -15 L16 -32" stroke={SKINS[k % SKINS.length]} strokeWidth={5} strokeLinecap="round" />}
          <circle cy={-27} r={7.5} fill={SKINS[(k + i) % SKINS.length]} stroke={FS.ink} strokeWidth={1.4} />
          <path d="M-7.5 -28 Q-7 -36 0 -36 Q7 -36 7.5 -28 Q3 -32 -7.5 -28 Z" fill={k % 4 === 2 ? FS.rivalHair : FS.belt} />
        </g>
      ))}
    </g>
  )
}

function Crowd({ groups, base, scale = 1.6 }: { groups: [number, number][]; base: number; scale?: number }) {
  return (
    <>
      {groups.map(([x, count], i) => (
        <CrowdGroup key={x} x={x} base={base} count={count} gap={34 * scale * 0.6} scale={scale} i={i} />
      ))}
    </>
  )
}

// The castle rooftop at night: the full moon, the far hills, the roof's tiled ridge with its upturned
// ends and the wooden signboard, no crowd: he trains alone up there.
const CASTLE = (
  <>
    <rect width={W} height={H} fill="#0b1240" />
    <rect y={420} width={W} height={480} fill="#18205a" />
    <circle cx={1180} cy={190} r={110} fill="#f6efc4" />
    <circle cx={1150} cy={170} r={18} fill="#e4d9a2" />
    <circle cx={1210} cy={225} r={12} fill="#e4d9a2" />
    <path d="M0 560 Q200 470 420 540 T860 520 T1300 500 T1600 540 V900 H0 Z" fill="#101845" />
    <path d="M0 650 H1600 L1520 610 H80 Z" fill="#2a1b3a" stroke={FS.ink} strokeWidth={4} />
    {Array.from({ length: 24 }, (_, k) => (
      <path key={k} d={`M${80 + k * 60} 612 V650`} stroke="#3d2a52" strokeWidth={6} />
    ))}
    <path d="M60 612 L20 580 M1540 612 L1580 580" stroke="#2a1b3a" strokeWidth={14} strokeLinecap="round" />
    <rect y={650} width={W} height={250} fill="#3b2f2a" />
    {Array.from({ length: 9 }, (_, k) => (
      <path key={k} d={`M${k * 200} 650 L${k * 200 - 120} 900`} stroke="#2a201c" strokeWidth={4} />
    ))}
    <g>
      <rect x={300} y={470} width={70} height={150} fill="#c9b48a" stroke={FS.ink} strokeWidth={4} />
      <path d="M318 500 H352 M318 530 H352 M318 560 H352" stroke={FS.ink} strokeWidth={6} />
    </g>
  </>
)

// The street market at noon: shop fronts, lanterns hanging, stalls, the crowd along the street and a
// rider in the street.
const MARKET = (
  <>
    <rect width={W} height={H} fill="#f6c46a" />
    {[0, 260, 560, 900, 1220].map((x, k) => (
      <g key={x}>
        <rect x={x} y={120} width={300} height={480} fill={k % 2 ? '#a3402a' : '#7a2d22'} stroke={FS.ink} strokeWidth={4} />
        <rect x={x + 40} y={200} width={220} height={60} fill={FS.gold} stroke={FS.ink} strokeWidth={4} />
        <rect x={x + 30} y={380} width={240} height={220} fill="#3a1a14" />
      </g>
    ))}
    {[180, 520, 860, 1200, 1500].map((x) => (
      <g key={x}>
        <path d={`M${x} 60 V100`} stroke={FS.ink} strokeWidth={3} />
        <ellipse cx={x} cy={126} rx={26} ry={30} fill={FS.p2} stroke={FS.ink} strokeWidth={4} />
        <path d={`M${x - 26} 126 H${x + 26}`} stroke={FS.gold} strokeWidth={4} />
      </g>
    ))}
    {[140, 760, 1340].map((x) => (
      <g key={x}>
        <path d={`M${x - 90} 560 H${x + 90} L${x + 70} 520 H${x - 70} Z`} fill="#e8e0c8" stroke={FS.ink} strokeWidth={4} />
        <rect x={x - 80} y={560} width={160} height={70} fill="#8a5a2a" stroke={FS.ink} strokeWidth={4} />
      </g>
    ))}
    <rect y={640} width={W} height={260} fill="#b8a080" />
    <path d="M0 640 H1600" stroke={FS.ink} strokeWidth={4} />
    <Crowd
      groups={[
        [40, 4],
        [330, 5],
        [640, 4],
        [990, 5],
        [1330, 4],
      ]}
      base={680}
    />
    <g transform="translate(220 820)">
      <circle cx={-40} cy={0} r={34} fill="none" stroke={FS.ink} strokeWidth={6} />
      <circle cx={60} cy={0} r={34} fill="none" stroke={FS.ink} strokeWidth={6} />
      <path d="M-40 0 L0 -40 L60 0 M0 -40 L10 -70" stroke={FS.ink} strokeWidth={6} fill="none" />
      <path d="M-10 -100 Q0 -120 14 -100 L20 -60 L-4 -60 Z" fill={FS.p1} stroke={FS.ink} strokeWidth={4} />
      <circle cx={4} cy={-118} r={14} fill="#e9b08a" stroke={FS.ink} strokeWidth={4} />
    </g>
  </>
)

// The harbour at sunset: the sea, the far cranes, the yacht moored along the quay, its deck
// packed with a crowd.
const HARBOUR = (
  <>
    <rect width={W} height={H} fill="#ff9a4a" />
    <rect y={260} width={W} height={200} fill="#ff6a3a" />
    <circle cx={300} cy={330} r={90} fill="#ffd27a" />
    {[1100, 1300, 1460].map((x) => (
      <path key={x} d={`M${x} 470 V200 H${x + 120} M${x} 240 L${x + 90} 200`} stroke="#5a2a3a" strokeWidth={10} fill="none" />
    ))}
    <rect y={470} width={W} height={430} fill="#1d4f9a" />
    {[520, 600, 690].map((y) => (
      <path
        key={y}
        d={`M0 ${y} Q100 ${y - 10} 200 ${y} T400 ${y} T600 ${y} T800 ${y} T1000 ${y} T1200 ${y} T1400 ${y} T1600 ${y}`}
        stroke="#4f86d0"
        strokeWidth={4}
        fill="none"
      />
    ))}
    <g>
      <path d="M120 600 H1480 L1400 760 H220 Z" fill={FS.gi} stroke={FS.ink} strokeWidth={6} />
      <path d="M150 640 H1450" stroke={FS.p1} strokeWidth={12} />
      <rect x={520} y={420} width={420} height={180} fill={FS.gi} stroke={FS.ink} strokeWidth={6} />
      {[560, 680, 800].map((x) => (
        <rect key={x} x={x} y={460} width={90} height={50} fill="#4fb4ff" stroke={FS.ink} strokeWidth={4} />
      ))}
      <path d="M730 420 V300 M730 320 H900" stroke={FS.ink} strokeWidth={8} />
      <Crowd
        groups={[
          [170, 5],
          [960, 5],
          [1250, 4],
        ]}
        base={600}
        scale={1.5}
      />
    </g>
    <rect y={800} width={W} height={100} fill="#6b5a4a" stroke={FS.ink} strokeWidth={4} />
  </>
)

// The temple ring at dusk: the tiered roofs, the great golden figure resting on the left, the ring
// ropes, and the crowd packed round it.
const TEMPLE = (
  <>
    <rect width={W} height={H} fill="#e0603a" />
    <rect y={300} width={W} height={300} fill="#c2412a" />
    {[0, 1, 2].map((tier) => (
      <path
        key={tier}
        d={`M${700 + tier * 70} ${330 - tier * 70} L1000 ${230 - tier * 70} L${1300 - tier * 70} ${330 - tier * 70} Z`}
        fill="#1a0a1e"
      />
    ))}
    <rect x={760} y={330} width={480} height={200} fill="#1a0a1e" />
    <path d="M60 560 Q120 420 300 440 Q460 420 560 500 L600 560 Z" fill={FS.gold} stroke={FS.ink} strokeWidth={6} />
    <circle cx={140} cy={460} r={44} fill={FS.gold} stroke={FS.ink} strokeWidth={6} />
    <rect y={560} width={W} height={340} fill="#8a6a40" />
    {[620, 660, 700].map((y, k) => (
      <path key={y} d={`M0 ${y} H1600`} stroke={[FS.p2, FS.gi, FS.p1][k]} strokeWidth={8} />
    ))}
    <Crowd
      groups={[
        [30, 5],
        [380, 4],
        [720, 5],
        [1080, 4],
        [1380, 4],
      ]}
      base={590}
    />
  </>
)

// The dojo hall: paper screens, the scroll on the far wall, the wooden floor, the students kneeling in a row.
const DOJO = (
  <>
    <rect width={W} height={H} fill="#e8d3a6" />
    {[0, 320, 640, 960, 1280].map((x) => (
      <g key={x}>
        <rect x={x + 10} y={120} width={300} height={440} fill="#f6ecd2" stroke="#5a3a1e" strokeWidth={10} />
        <path d={`M${x + 110} 120 V560 M${x + 210} 120 V560 M${x + 10} 266 H${x + 310} M${x + 10} 412 H${x + 310}`} stroke="#5a3a1e" strokeWidth={5} />
      </g>
    ))}
    <rect y={80} width={W} height={40} fill="#5a3a1e" />
    <rect x={720} y={170} width={160} height={300} fill="#fbf6e8" stroke={FS.ink} strokeWidth={5} />
    <circle cx={800} cy={300} r={52} fill="none" stroke={FS.ink} strokeWidth={14} strokeDasharray="250 80" />
    <rect y={560} width={W} height={340} fill="#a8743e" />
    {Array.from({ length: 12 }, (_, k) => (
      <path key={k} d={`M${k * 150 - 40} 560 L${k * 150 - 200} 900`} stroke="#7a5228" strokeWidth={4} />
    ))}
    <path d="M0 560 H1600" stroke={FS.ink} strokeWidth={5} />
    <Crowd groups={[[40, 6], [1180, 6]]} base={600} scale={1.5} />
  </>
)

// The factory floor: girders, the crane's hook over the floor, the furnace glow, the workers on the gantry.
const FACTORY = (
  <>
    <rect width={W} height={H} fill="#2a2e3a" />
    <rect x={1080} y={260} width={360} height={300} fill="#ff7a1a" opacity={0.85} />
    <rect x={1100} y={280} width={320} height={260} fill="#ffcf4a" opacity={0.7} />
    {[100, 500, 900, 1300].map((x) => (
      <path key={x} d={`M${x} 0 V560 M${x + 60} 0 V560 M${x} 80 L${x + 60} 160 L${x} 240 L${x + 60} 320 L${x} 400 L${x + 60} 480`} stroke="#5b6078" strokeWidth={8} fill="none" />
    ))}
    <rect y={300} width={W} height={24} fill="#4a4e60" stroke={FS.ink} strokeWidth={4} />
    <path d="M740 0 V180 M740 180 Q700 230 740 250 Q780 230 760 200" stroke={FS.ink} strokeWidth={8} fill="none" />
    <Crowd groups={[[60, 5], [560, 4]]} base={300} scale={1.3} />
    <rect y={580} width={W} height={320} fill="#4a4a52" />
    {Array.from({ length: 10 }, (_, k) => (
      <path key={k} d={`M${k * 180} 580 L${k * 180 - 140} 900`} stroke="#3a3a40" strokeWidth={4} />
    ))}
    <path d="M0 580 H1600" stroke={FS.ink} strokeWidth={5} />
    <path d="M0 596 H1600" stroke={FS.gold} strokeWidth={10} strokeDasharray="60 40" />
  </>
)

// The subway platform: the tiled wall, the train in with its riders at the windows, the yellow edge line.
const SUBWAY = (
  <>
    <rect width={W} height={H} fill="#d8dcc8" />
    {Array.from({ length: 20 }, (_, k) => (
      <path key={k} d={`M0 ${40 + k * 28} H1600`} stroke="#b8bca8" strokeWidth={2} />
    ))}
    <rect x={60} y={260} width={1480} height={340} rx={30} fill="#9aa4b8" stroke={FS.ink} strokeWidth={6} />
    <path d="M60 330 H1540" stroke={FS.p2} strokeWidth={14} />
    {[140, 460, 780, 1100, 1420].map((x) => (
      <g key={x}>
        <rect x={x - 30} y={360} width={160} height={110} rx={10} fill="#2a3448" stroke={FS.ink} strokeWidth={4} />
        <CrowdGroup x={x + 4} base={470} count={3} gap={44} scale={1.3} i={x} />
      </g>
    ))}
    <rect y={600} width={W} height={300} fill="#8a8e96" />
    <path d="M0 600 H1600" stroke={FS.ink} strokeWidth={5} />
    <path d="M0 620 H1600" stroke={FS.gold} strokeWidth={16} />
  </>
)

// The neon plaza at night: the towers, the signs lit, the wet street, the crowd under the signs.
const PLAZA = (
  <>
    <rect width={W} height={H} fill="#0a0a2a" />
    {[[0, 220], [240, 140], [520, 260], [860, 120], [1120, 200], [1380, 160]].map(([x, y]) => (
      <rect key={x} x={x} y={y} width={240} height={600} fill="#161640" stroke="#24245a" strokeWidth={4} />
    ))}
    <rect x={260} y={200} width={200} height={70} rx={14} fill="none" stroke={FS.p2} strokeWidth={10} />
    <rect x={880} y={170} width={200} height={90} rx={45} fill="none" stroke={FS.cyan} strokeWidth={10} />
    <path d="M1150 260 H1330 M1150 300 H1290" stroke={FS.gold} strokeWidth={12} strokeLinecap="round" />
    <path d="M560 320 L620 400 L680 320 L740 400" stroke="#ff4fd8" strokeWidth={10} fill="none" />
    <rect y={600} width={W} height={300} fill="#1a1a3a" />
    <path d="M0 600 H1600" stroke={FS.ink} strokeWidth={5} />
    <rect x={260} y={640} width={200} height={20} fill={FS.p2} opacity={0.3} />
    <rect x={880} y={650} width={200} height={20} fill={FS.cyan} opacity={0.3} />
    <Crowd groups={[[40, 5], [560, 4], [1200, 5]]} base={630} />
  </>
)

// The concert stage: the truss and its lights, the speaker stacks, the drum riser, hands up at the front.
const CONCERT = (
  <>
    <rect width={W} height={H} fill="#2a0a2a" />
    {[300, 800, 1300].map((x) => (
      <path key={x} d={`M${x - 20} 60 L${x - 220} 600 H${x + 220} L${x + 20} 60 Z`} fill={FS.gold} opacity={0.14} />
    ))}
    <path d="M0 50 H1600 M0 76 H1600" stroke={FS.steel} strokeWidth={8} />
    {Array.from({ length: 40 }, (_, k) => (
      <line key={k} x1={k * 40} y1={50} x2={k * 40 + 40} y2={76} stroke={FS.steel} strokeWidth={3} />
    ))}
    {[40, 1420].map((x) => (
      <g key={x}>
        <rect x={x} y={240} width={140} height={340} fill={FS.ink} stroke={FS.steel} strokeWidth={4} />
        {[300, 400, 500].map((y) => (
          <circle key={y} cx={x + 70} cy={y} r={36} fill={FS.panel} stroke={FS.steel} strokeWidth={4} />
        ))}
      </g>
    ))}
    <rect x={640} y={400} width={320} height={60} fill={FS.p2Dark} stroke={FS.ink} strokeWidth={4} />
    <ellipse cx={800} cy={380} rx={70} ry={50} fill={FS.panelLight} stroke={FS.chrome} strokeWidth={5} />
    <ellipse cx={700} cy={350} rx={40} ry={10} fill={FS.gold} />
    <ellipse cx={900} cy={340} rx={44} ry={10} fill={FS.gold} />
    <rect y={580} width={W} height={320} fill="#3a2418" />
    <path d="M0 580 H1600" stroke={FS.ink} strokeWidth={5} />
    <Crowd groups={[[20, 8], [560, 6], [1100, 8]]} base={900} scale={2.2} />
  </>
)

/** Each stage's art on the canvas. */
export const ZONE_ART: Record<Zone, ReactNode> = {
  castle: CASTLE,
  dojo: DOJO,
  market: MARKET,
  factory: FACTORY,
  subway: SUBWAY,
  harbour: HARBOUR,
  plaza: PLAZA,
  concert: CONCERT,
  temple: TEMPLE,
}
