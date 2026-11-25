'use client'

import type { ReactNode } from 'react'
import { FS } from './palette'
import look from './world.module.css'

// The arcade run's stages, a place of its own for every beat of one credit, drawn on one 1600 by 900 canvas
// for the theatre's scenes (theatre.tsx). The place comes first and tells who the rival is at a glance, the way
// the cabinet picked a country and then a fighting style for it: the night street of the attract demo and his
// home rooftop at dusk behind the select grid (Hero); the dojo hall of his own school (About); the harbour
// town at the waterline, ropes and crates on the quay, for the heavyweight of the docks (Work); the factory
// floor under the gantry (Tech Stack); the car park under the overpass for the scrap yard (Services); the
// neon town of gambling halls for the boxer (Projects); the temple court at night of the leader behind it all
// (Ventures); the club inside its mesh cage, the band behind the mesh (Bands); the ring in the river town at
// dusk, the great stone on the bank (Muay Thai); and the same rooftop at sunrise for his ending (Contact).
// The sponsor's emblem, our own plain mark, hangs on every stage of the tour: a banner over the dojo door, a
// plate on the crane, lights over the gambling street, carved huge over the temple gate. Every stage stands
// still: only the scene's own props move.
//
// A stage is composed for a fight on the right half of a wide screen, beside a section card on the left. When
// its section reads on the right instead, the fight plays on the left half (theatre.tsx) and the stage is
// recomposed round it from lg: the pieces the fight stands in front of (SetPiece: the crane, the gate, the ring)
// move with it to the left half, and the pieces they leave room for there (AsidePiece: the roofs, the moon, the
// great stone) move to the right half, behind the card (world.module.css .sceneLeft).

/** A piece the fight stands in front of: on the left half of the stage when the fight plays there. */
const SetPiece = ({ children }: { children: ReactNode }) => <g className={look.setPiece}>{children}</g>

/** A piece that makes room for the fight: on the right half of the stage when the fight plays on the left. */
const AsidePiece = ({ children }: { children: ReactNode }) => <g className={look.asidePiece}>{children}</g>

export type Zone = 'street' | 'dojo' | 'harbour' | 'factory' | 'lot' | 'neon' | 'court' | 'cage' | 'river' | 'dawn'

export const W = 1600
export const H = 900

const SHIRTS = [FS.p2Dark, FS.p1, FS.health, FS.orange, FS.chrome, FS.giDeep, FS.gold]
const SKINS = ['#e9b08a', '#b9774c', FS.skinDeep, '#f2c49b']

// A group of onlookers standing on the line `base`, `count` of them from `x`, `gap` apart.
function CrowdGroup({ x, base, count, gap, scale, i }: { x: number; base: number; count: number; gap: number; scale: number; i: number }) {
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

/** The sponsor's emblem, our own plain mark: a crimson ring round a black wedge pointing down, a white bar
 *  across it. Drawn at (x, y), `r` its radius; `lit` draws it as neon tubes on the dark. */
export function Emblem({ x, y, r, lit = false }: { x: number; y: number; r: number; lit?: boolean }) {
  const wedge = `M${-r * 0.56} ${-r * 0.42} H${r * 0.56} L0 ${r * 0.62} Z`
  if (lit) {
    return (
      <g transform={`translate(${x} ${y})`} fill="none" strokeLinejoin="round">
        <circle r={r} stroke={FS.p2} strokeWidth={r * 0.2} opacity={0.35} />
        <circle r={r} stroke="#ff8aa0" strokeWidth={r * 0.07} />
        <path d={wedge} stroke={FS.p2} strokeWidth={r * 0.18} opacity={0.35} />
        <path d={wedge} stroke="#ff8aa0" strokeWidth={r * 0.06} />
        <path d={`M${-r * 0.74} ${-r * 0.06} H${r * 0.74}`} stroke={FS.flash} strokeWidth={r * 0.07} />
      </g>
    )
  }
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill={FS.emblem} stroke={FS.ink} strokeWidth={Math.max(3, r * 0.08)} />
      <circle r={r * 0.8} fill="none" stroke="#c22a3a" strokeWidth={r * 0.06} />
      <path d={wedge} fill={FS.ink} />
      <rect x={-r * 0.74} y={-r * 0.12} width={r * 1.48} height={r * 0.14} fill={FS.flash} />
    </g>
  )
}

// The night street of the attract demo: shop shutters pulled down, one lamp, the wet road catching the light,
// the sponsor's poster pasted on a shutter.
const STREET = (
  <>
    <rect width={W} height={H} fill="#090c28" />
    {[[0, 200], [260, 150], [560, 230], [880, 170], [1180, 210], [1420, 160]].map(([x, top]) => (
      <rect key={x} x={x} y={top} width={300} height={H} fill="#141a44" stroke={FS.ink} strokeWidth={4} />
    ))}
    {[[60, 330], [340, 300], [640, 340], [960, 320], [1240, 350], [1480, 300]].map(([x, y], k) => (
      <rect key={x} x={x} y={y} width={60} height={40} fill={k % 2 ? '#ffd27a' : '#2a3060'} opacity={k % 2 ? 0.7 : 1} />
    ))}
    {[20, 300, 600, 900, 1200, 1460].map((x) => (
      <g key={x}>
        <rect x={x} y={430} width={240} height={210} fill="#3a4262" stroke={FS.ink} strokeWidth={4} />
        {Array.from({ length: 9 }, (_, k) => (
          <path key={k} d={`M${x} ${452 + k * 22} H${x + 240}`} stroke="#272d4c" strokeWidth={4} />
        ))}
        <rect x={x - 10} y={410} width={260} height={22} fill="#262c4c" stroke={FS.ink} strokeWidth={3} />
      </g>
    ))}
    <g>
      <rect x={640} y={470} width={120} height={150} fill="#d8cfb0" stroke={FS.ink} strokeWidth={3} />
      <Emblem x={700} y={530} r={40} />
      <rect x={656} y={584} width={88} height={10} fill={FS.ink} />
    </g>
    <path d="M1100 640 V250 Q1100 220 1140 220" fill="none" stroke="#5b6078" strokeWidth={10} />
    <ellipse cx={1152} cy={224} rx={22} ry={8} fill={FS.gold} />
    <path d="M1132 230 L1020 640 H1300 Z" fill={FS.gold} opacity={0.07} />
    <rect y={640} width={W} height={260} fill="#1a1d36" />
    <path d="M0 640 H1600" stroke={FS.ink} strokeWidth={5} />
    {[[1080, 700, 220], [300, 760, 160], [700, 820, 260]].map(([x, y, w]) => (
      <ellipse key={x} cx={x} cy={y} rx={w} ry={10} fill="#3a4272" opacity={0.6} />
    ))}
    <ellipse cx={1150} cy={760} rx={70} ry={16} fill={FS.gold} opacity={0.2} />
  </>
)

// His home rooftop at dusk, behind the select grid: the sky going from violet to orange, the low sun, the far
// hills, the roof's tiled ridge and the wooden signboard of his school.
const DUSK = (
  <>
    <rect width={W} height={H} fill="#3a2a6a" />
    <rect y={240} width={W} height={200} fill="#8a3a6a" />
    <rect y={420} width={W} height={160} fill="#e07a5a" />
    <circle cx={1180} cy={520} r={110} fill="#ffcf7a" />
    <path d="M0 560 Q200 470 420 540 T860 520 T1300 500 T1600 540 V900 H0 Z" fill="#4a2a5a" />
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

// The dojo hall of his school: paper screens, the scroll on the far wall, the wooden floor, the students
// kneeling in a row, and over the door the sponsor's banner, the first time the emblem shows.
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
    <SetPiece>
      <rect x={1060} y={330} width={340} height={230} fill="#5a3a1e" stroke={FS.ink} strokeWidth={6} />
      <rect x={1080} y={350} width={300} height={210} fill="#3a2410" />
      <path d="M1140 228 H1320 V330 L1230 306 L1140 330 Z" fill="#f2e6c8" stroke={FS.ink} strokeWidth={4} />
      <Emblem x={1230} y={272} r={34} />
    </SetPiece>
    <rect y={560} width={W} height={340} fill="#a8743e" />
    {Array.from({ length: 12 }, (_, k) => (
      <path key={k} d={`M${k * 150 - 40} 560 L${k * 150 - 200} 900`} stroke="#7a5228" strokeWidth={4} />
    ))}
    <path d="M0 560 H1600" stroke={FS.ink} strokeWidth={5} />
    <Crowd groups={[[40, 6], [560, 5]]} base={600} scale={1.5} />
  </>
)

// The harbour town at the waterline on a grey morning: the far roofs on the hill, the grey water, a crane with
// the sponsor's plate on its arm, bollards and heavy ropes on the quay, crates stacked on the stones.
const HARBOUR = (
  <>
    <rect width={W} height={H} fill="#9aaec4" />
    <path d="M0 360 L120 300 L240 340 L380 280 L520 330 L700 290 L860 320 L1020 270 L1200 310 L1400 280 L1600 320 V460 H0 Z" fill="#6a7a94" />
    <AsidePiece>
    {[60, 200, 330, 470, 610, 760].map((x, k) => (
      <g key={x}>
        <rect x={x} y={350 - (k % 3) * 20} width={90} height={110} fill={k % 2 ? '#c87a5a' : '#e0d0b0'} stroke={FS.ink} strokeWidth={3} />
        <path d={`M${x - 8} ${352 - (k % 3) * 20} L${x + 45} ${320 - (k % 3) * 20} L${x + 98} ${352 - (k % 3) * 20} Z`} fill="#8a3a2a" stroke={FS.ink} strokeWidth={3} />
      </g>
    ))}
    </AsidePiece>
    <rect y={460} width={W} height={150} fill="#4a6a8a" />
    {[490, 530, 570].map((y) => (
      <path key={y} d={`M0 ${y} Q100 ${y - 8} 200 ${y} T400 ${y} T600 ${y} T800 ${y} T1000 ${y} T1200 ${y} T1400 ${y} T1600 ${y}`} stroke="#7a9aba" strokeWidth={4} fill="none" />
    ))}
    <SetPiece>
      <path d="M1180 610 V140 M1260 610 V140 M1180 200 L1260 260 M1260 200 L1180 260 M1180 320 L1260 380 M1260 320 L1180 380 M1180 440 L1260 500 M1260 440 L1180 500" stroke="#c8a030" strokeWidth={10} fill="none" />
      <path d="M1150 140 H1560 V170 H1150 Z" fill="#c8a030" stroke={FS.ink} strokeWidth={5} />
      <path d="M1500 170 V320" stroke={FS.ink} strokeWidth={4} />
      <rect x={1470} y={320} width={60} height={34} fill="#6a4a2a" stroke={FS.ink} strokeWidth={3} />
      <rect x={1160} y={262} width={120} height={56} fill="#e8e0c8" stroke={FS.ink} strokeWidth={4} />
      <Emblem x={1220} y={290} r={24} />
    </SetPiece>
    <rect y={600} width={W} height={300} fill="#8a8070" />
    <path d="M0 600 H1600" stroke={FS.ink} strokeWidth={6} />
    <path d="M0 612 H1600" stroke="#5a5448" strokeWidth={8} />
    {Array.from({ length: 8 }, (_, k) => (
      <path key={k} d={`M${k * 220} 620 L${k * 220 - 160} 900`} stroke="#6a6254" strokeWidth={4} />
    ))}
    <AsidePiece>
    {[120, 560].map((x) => (
      <g key={x}>
        <rect x={x - 22} y={560} width={44} height={60} rx={10} fill="#3a3a44" stroke={FS.ink} strokeWidth={4} />
        <path d={`M${x} 590 Q${x + 140} 660 ${x + 300} 600`} fill="none" stroke="#c8b080" strokeWidth={12} />
        <path d={`M${x} 590 Q${x + 140} 660 ${x + 300} 600`} fill="none" stroke="#8a7050" strokeWidth={4} strokeDasharray="8 10" />
      </g>
    ))}
    {[[260, 520, 150], [380, 540, 120], [300, 440, 110]].map(([x, y, s]) => (
      <g key={`${x}-${y}`}>
        <rect x={x} y={y} width={s} height={s * 0.7} fill="#a8743e" stroke={FS.ink} strokeWidth={4} />
        <path d={`M${x} ${y} L${x + s} ${y + s * 0.7} M${x + s} ${y} L${x} ${y + s * 0.7}`} stroke="#7a5228" strokeWidth={5} />
      </g>
    ))}
    </AsidePiece>
  </>
)

// The factory floor: girders, the crane's hook over the floor, the furnace glow, the workers on the gantry
// and the sponsor's plate bolted to its rail.
const FACTORY = (
  <>
    <rect width={W} height={H} fill="#2a2e3a" />
    <SetPiece>
      <rect x={1080} y={260} width={360} height={300} fill="#ff7a1a" opacity={0.85} />
      <rect x={1100} y={280} width={320} height={260} fill="#ffcf4a" opacity={0.7} />
    </SetPiece>
    {[100, 500, 900, 1300].map((x) => (
      <path key={x} d={`M${x} 0 V560 M${x + 60} 0 V560 M${x} 80 L${x + 60} 160 L${x} 240 L${x + 60} 320 L${x} 400 L${x + 60} 480`} stroke="#5b6078" strokeWidth={8} fill="none" />
    ))}
    <rect y={300} width={W} height={24} fill="#4a4e60" stroke={FS.ink} strokeWidth={4} />
    <SetPiece>
      <rect x={1150} y={250} width={110} height={50} fill="#e8e0c8" stroke={FS.ink} strokeWidth={4} />
      <Emblem x={1205} y={275} r={20} />
    </SetPiece>
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

// The scrap yard: a car park under an overpass at night, the slab on its pillars, two street lamps, the
// painted bay lines on the tarmac. The car itself is the scene's prop (theatre.tsx), so it can be wrecked.
const LOT = (
  <>
    <rect width={W} height={H} fill="#0c1430" />
    <path d="M0 470 Q300 430 640 460 T1300 440 T1600 460 V640 H0 Z" fill="#141c44" />
    {[90, 260, 420, 1180, 1330, 1480].map((x, k) => (
      <rect key={x} x={x} y={300 + (k % 3) * 40} width={70} height={340} fill="#1b2452" />
    ))}
    <rect y={150} width={W} height={90} fill="#3a3f5a" stroke={FS.ink} strokeWidth={5} />
    <rect y={240} width={W} height={18} fill="#262a40" />
    <Emblem x={1000} y={195} r={30} />
    {[180, 620, 1060, 1500].map((x) => (
      <rect key={x} x={x - 40} y={258} width={80} height={382} fill="#4a4f6a" stroke={FS.ink} strokeWidth={5} />
    ))}
    {[400, 1280].map((x, k) => {
      const Piece = k ? SetPiece : AsidePiece
      return (
        <Piece key={x}>
          <path d={`M${x} 640 V330 Q${x} 300 ${x + 40} 300`} fill="none" stroke="#5b6078" strokeWidth={10} />
          <ellipse cx={x + 52} cy={304} rx={20} ry={8} fill={FS.gold} />
          <path d={`M${x + 32} 310 L${x - 60} 640 H${x + 170} Z`} fill={FS.gold} opacity={0.08} />
        </Piece>
      )
    })}
    <rect y={640} width={W} height={260} fill="#2a2c3a" />
    <path d="M0 640 H1600" stroke={FS.ink} strokeWidth={4} />
    {[60, 420, 780, 1140, 1500].map((x) => (
      <path key={x} d={`M${x} 660 L${x - 70} 900`} stroke="#e8e0c8" strokeWidth={6} opacity={0.6} />
    ))}
  </>
)

// A suit of cards as a neon sign: the spade and the diamond, our own shapes.
const SUIT = {
  spade: 'M0 -26 C14 -10 26 0 16 12 C10 18 4 14 2 10 L6 24 H-6 L-2 10 C-4 14 -10 18 -16 12 C-26 0 -14 -10 0 -26 Z',
  diamond: 'M0 -26 L20 0 L0 26 L-20 0 Z',
}

// The neon town of the gambling halls at night: dark facades, the dice and the suits lit in tubes, the
// sponsor's emblem in lights over the street, the crowd under the signs.
const NEON = (
  <>
    <rect width={W} height={H} fill="#12062a" />
    {[[0, 140, '#22103e'], [300, 90, '#2a1448'], [620, 160, '#1e0e38'], [940, 110, '#2a1448'], [1260, 150, '#22103e']].map(([x, top, fill]) => (
      <rect key={x} x={x as number} y={top as number} width={320} height={H} fill={fill as string} stroke={FS.ink} strokeWidth={4} />
    ))}
    {[[150, 260, 'spade', FS.cyan], [460, 220, 'diamond', FS.p2], [1100, 240, 'spade', FS.gold], [1420, 280, 'diamond', FS.cyan]].map(([x, y, suit, color]) => (
      <g key={`${x}`} transform={`translate(${x} ${y}) scale(2)`} fill="none" strokeLinejoin="round">
        <path d={SUIT[suit as keyof typeof SUIT]} stroke={color as string} strokeWidth={6} opacity={0.3} />
        <path d={SUIT[suit as keyof typeof SUIT]} stroke={FS.flash} strokeWidth={2} />
      </g>
    ))}
    {[[760, 330], [860, 360]].map(([x, y], k) => (
      <g key={x} transform={`translate(${x} ${y}) rotate(${k ? 12 : -10})`}>
        <rect x={-36} y={-36} width={72} height={72} rx={12} fill="none" stroke={FS.gold} strokeWidth={10} opacity={0.3} />
        <rect x={-36} y={-36} width={72} height={72} rx={12} fill="none" stroke={FS.flash} strokeWidth={3} />
        {(k ? [[-16, -16], [16, 16], [0, 0]] : [[-16, -16], [16, 16]]).map(([dx, dy]) => (
          <circle key={`${dx}-${dy}`} cx={dx} cy={dy} r={6} fill={FS.gold} />
        ))}
      </g>
    ))}
    <path d="M200 60 H1400" stroke="#3a2a5a" strokeWidth={6} />
    <Emblem x={800} y={130} r={62} lit />
    {Array.from({ length: 16 }, (_, k) => (
      <circle key={k} cx={240 + k * 74} cy={60} r={7} fill={k % 2 ? FS.gold : FS.p2} />
    ))}
    {[0, 320, 640, 960, 1280].map((x) => (
      <rect key={x} x={x + 40} y={460} width={240} height={130} fill="#ffcf4a" opacity={0.16} stroke="#5a3a7a" strokeWidth={4} />
    ))}
    <rect y={600} width={W} height={300} fill="#24183a" />
    <path d="M0 600 H1600" stroke={FS.ink} strokeWidth={5} />
    {[[400, 680, FS.p2], [1100, 700, FS.cyan], [800, 800, FS.gold]].map(([x, y, color]) => (
      <ellipse key={`${x}`} cx={x as number} cy={y as number} rx={240} ry={14} fill={color as string} opacity={0.12} />
    ))}
    <Crowd groups={[[30, 5], [380, 4], [1300, 5]]} base={640} />
  </>
)

// The temple court at night, the leader's: the moon over a stone wall, the great gate with the sponsor's
// emblem carved huge over it, a brazier burning either side, the flagstones of the court.
const COURT = (
  <>
    <rect width={W} height={H} fill="#0a0818" />
    <AsidePiece>
      <circle cx={300} cy={160} r={70} fill="#e8e0c8" opacity={0.9} />
    </AsidePiece>
    {[[120, 80], [520, 60], [700, 140], [1480, 90], [940, 40]].map(([x, y]) => (
      <circle key={x} cx={x} cy={y} r={3} fill={FS.flash} />
    ))}
    <rect y={380} width={W} height={260} fill="#1e1828" />
    {Array.from({ length: 6 }, (_, k) => (
      <path key={k} d={`M0 ${410 + k * 40} H1600`} stroke="#141020" strokeWidth={4} />
    ))}
    <SetPiece>
      <rect x={880} y={140} width={90} height={500} fill="#2e2638" stroke={FS.ink} strokeWidth={6} />
      <rect x={1420} y={140} width={90} height={500} fill="#2e2638" stroke={FS.ink} strokeWidth={6} />
      <path d="M820 140 H1570 L1540 90 H850 Z" fill="#3a3044" stroke={FS.ink} strokeWidth={6} />
      <rect x={970} y={140} width={450} height={500} fill="#08060f" />
      <rect x={1090} y={220} width={210} height={190} fill="#2a2234" stroke={FS.ink} strokeWidth={5} />
      <Emblem x={1195} y={315} r={82} />
      {[760, 1560].map((x) => (
        <g key={x}>
          <path d={`M${x - 30} 640 L${x - 14} 560 H${x + 14} L${x + 30} 640 Z`} fill="#3a3044" stroke={FS.ink} strokeWidth={4} />
          <path d={`M${x} 470 Q${x + 34} 520 ${x + 20} 560 H${x - 20} Q${x - 34} 520 ${x} 470 Z`} fill={FS.power} opacity={0.85} />
          <path d={`M${x} 500 Q${x + 16} 530 ${x + 8} 560 H${x - 8} Q${x - 16} 530 ${x} 500 Z`} fill={FS.cyan} opacity={0.7} />
        </g>
      ))}
    </SetPiece>
    <rect y={640} width={W} height={260} fill="#2a2430" />
    <path d="M0 640 H1600" stroke={FS.ink} strokeWidth={4} />
    {Array.from({ length: 9 }, (_, k) => (
      <path key={k} d={`M${k * 200} 640 L${k * 200 - 120} 900`} stroke="#1a1420" strokeWidth={4} />
    ))}
    {[700, 780].map((y) => (
      <path key={y} d={`M0 ${y} H1600`} stroke="#1a1420" strokeWidth={3} />
    ))}
  </>
)

// The club inside its mesh cage: the bar with the sponsor's emblem over it, the band on the riser behind the
// mesh (drawn by the scene, so it can play), the light beams, the crowd pressed on the mesh at the sides.
const CAGE = (
  <>
    <rect width={W} height={H} fill="#1e0a24" />
    {[300, 800, 1300].map((x) => (
      <path key={x} d={`M${x - 20} 40 L${x - 220} 600 H${x + 220} L${x + 20} 40 Z`} fill={FS.gold} opacity={0.1} />
    ))}
    <path d="M0 40 H1600 M0 64 H1600" stroke={FS.steel} strokeWidth={8} />
    <AsidePiece>
      <rect x={120} y={380} width={420} height={200} fill="#3a1e14" stroke={FS.ink} strokeWidth={5} />
      <rect x={100} y={360} width={460} height={28} fill="#5a3020" stroke={FS.ink} strokeWidth={4} />
      {[160, 230, 300, 370, 440].map((x, k) => (
        <rect key={x} x={x} y={300} width={20} height={60} rx={4} fill={[FS.health, FS.gold, FS.p2, FS.cyan, FS.orange][k]} opacity={0.8} />
      ))}
      <Emblem x={330} y={200} r={48} />
    </AsidePiece>
    <SetPiece>
      <rect x={820} y={470} width={680} height={110} fill={FS.p2Dark} stroke={FS.ink} strokeWidth={4} />
    </SetPiece>
    <rect y={580} width={W} height={320} fill="#2a1a18" />
    <path d="M0 580 H1600" stroke={FS.ink} strokeWidth={5} />
  </>
)

// The diamond mesh of the cage, from the riser up to the roof: the band plays behind it.
export function Mesh() {
  const cells = []
  for (let y = 90; y < 600; y += 46) for (let x = 620; x < 1600; x += 46) cells.push(`M${x} ${y} l23 23 l-23 23 l-23 -23 Z`)
  return (
    <g>
      <path d={cells.join(' ')} fill="none" stroke="#9aa0b8" strokeWidth={2.4} opacity={0.75} />
      <path d="M620 80 H1600 M620 600 H1600" stroke={FS.steel} strokeWidth={12} />
      <path d="M620 80 V600" stroke={FS.steel} strokeWidth={12} />
      <Crowd groups={[[40, 4]]} base={640} scale={1.8} />
    </g>
  )
}

// The ring in the river town at dusk: the sun low over the river, the houses on stilts on the far bank, the
// great stone on the near bank, the ring's posts and ropes, the sponsor's plate on the corner post.
const RIVER = (
  <>
    <rect width={W} height={H} fill="#f08a4a" />
    <rect y={240} width={W} height={200} fill="#e0603a" />
    <AsidePiece>
      <circle cx={520} cy={400} r={90} fill="#ffd27a" />
    </AsidePiece>
    {[80, 260, 420, 1080, 1260, 1440].map((x, k) => (
      <g key={x}>
        <path d={`M${x + 10} 500 V430 M${x + 80} 500 V430`} stroke="#4a2a2a" strokeWidth={6} />
        <rect x={x} y={360 - (k % 2) * 20} width={100} height={70 + (k % 2) * 20} fill="#7a3a2a" stroke={FS.ink} strokeWidth={3} />
        <path d={`M${x - 10} ${362 - (k % 2) * 20} L${x + 50} ${320 - (k % 2) * 20} L${x + 110} ${362 - (k % 2) * 20} Z`} fill="#3a1a1a" />
      </g>
    ))}
    <rect y={480} width={W} height={100} fill="#c8603a" />
    {[500, 540].map((y) => (
      <path key={y} d={`M0 ${y} Q100 ${y - 8} 200 ${y} T400 ${y} T600 ${y} T800 ${y} T1000 ${y} T1200 ${y} T1400 ${y} T1600 ${y}`} stroke="#ffb07a" strokeWidth={3} fill="none" />
    ))}
    <AsidePiece>
      <path d="M60 600 Q90 470 220 450 Q370 440 420 520 L450 600 Z" fill="#6a6a72" stroke={FS.ink} strokeWidth={6} />
      <path d="M120 540 Q180 490 260 490" fill="none" stroke="#8a8a94" strokeWidth={8} strokeLinecap="round" />
    </AsidePiece>
    <rect y={580} width={W} height={320} fill="#8a6a40" />
    <path d="M0 580 H1600" stroke={FS.ink} strokeWidth={5} />
    <SetPiece>
      {[860, 1560].map((x) => (
        <rect key={x} x={x - 14} y={460} width={28} height={200} fill="#d8d0c0" stroke={FS.ink} strokeWidth={4} />
      ))}
      {[490, 530, 570].map((y, k) => (
        <path key={y} d={`M860 ${y} H1560`} stroke={[FS.p2, FS.gi, FS.p1][k]} strokeWidth={7} />
      ))}
      <rect x={826} y={472} width={68} height={40} fill="#e8e0c8" stroke={FS.ink} strokeWidth={3} />
      <Emblem x={860} y={492} r={16} />
    </SetPiece>
    <Crowd groups={[[480, 4], [620, 3]]} base={640} />
  </>
)

// His ending: the same rooftop at sunrise, the sky warm, the sun coming up behind the far hills, the trophy on
// its stand where the ceremony is set and the paper streamers hung for it.
const DAWN = (
  <>
    <rect width={W} height={H} fill="#f2a46a" />
    <rect y={260} width={W} height={300} fill="#f6c88a" />
    <SetPiece>
      <circle cx={1180} cy={470} r={130} fill="#fff1c4" />
    </SetPiece>
    <path d="M0 560 Q200 470 420 540 T860 520 T1300 500 T1600 540 V900 H0 Z" fill="#8a4a5a" />
    <path d="M0 650 H1600 L1520 610 H80 Z" fill="#5a2a3a" stroke={FS.ink} strokeWidth={4} />
    {Array.from({ length: 24 }, (_, k) => (
      <path key={k} d={`M${80 + k * 60} 612 V650`} stroke="#6e3a4a" strokeWidth={6} />
    ))}
    <path d="M60 612 L20 580 M1540 612 L1580 580" stroke="#5a2a3a" strokeWidth={14} strokeLinecap="round" />
    <rect y={650} width={W} height={250} fill="#6a4a3a" />
    {Array.from({ length: 9 }, (_, k) => (
      <path key={k} d={`M${k * 200} 650 L${k * 200 - 120} 900`} stroke="#4a3228" strokeWidth={4} />
    ))}
    <SetPiece>
      <path d="M760 120 Q960 200 1160 120 Q1360 200 1560 120" fill="none" stroke={FS.ink} strokeWidth={3} />
      {[820, 900, 980, 1060, 1220, 1300, 1380, 1460].map((x, k) => (
        <path key={x} d={`M${x} ${150 + ((k % 4) - 1.5) ** 2 * 6} l14 34 l-28 0 Z`} fill={[FS.p2, FS.gold, FS.p1, FS.health][k % 4]} stroke={FS.ink} strokeWidth={2} />
      ))}
    </SetPiece>
    <AsidePiece>
      <rect x={300} y={470} width={70} height={150} fill="#e0c89a" stroke={FS.ink} strokeWidth={4} />
      <path d="M318 500 H352 M318 530 H352 M318 560 H352" stroke={FS.ink} strokeWidth={6} />
    </AsidePiece>
  </>
)

export const ZONE_ART: Record<Zone, ReactNode> = {
  street: STREET,
  dojo: DOJO,
  harbour: HARBOUR,
  factory: FACTORY,
  lot: LOT,
  neon: NEON,
  court: COURT,
  cage: CAGE,
  river: RIVER,
  dawn: DAWN,
}

/** The select grid's backdrop: his home rooftop at dusk, drawn over the street as the title holds. */
export const DUSK_ART = DUSK
