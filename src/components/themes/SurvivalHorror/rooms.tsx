import type { ReactNode } from 'react'
import type { Flags, Zone } from './scripts'
import { SH } from './palette'
import stage from './stage.module.css'

// The rooms of the house behind the page, one fixed camera frame each (600 by 300, the floor from y 220),
// the way the genre's pre-rendered rooms hold still while the figures move through them. The stage
// (./stage) shows the room of the part of the page in view and cuts to the next with a black frame. A
// phone sees only the middle of a room, so what matters stands near x 300. What a figure handles (the
// chest, the lamp, the doors, the trader, the desk) is not here but in ./props, placed by his body width.
//
// Each room keeps still; the lamps glow without flicker. The few that move do it once: the hall's
// chandelier settles when he walks in, the armoury lamp swings at the blow.

type Room = Zone | 'safe'

const FLOOR_ROWS = 7
const FLOOR_COLS = 12
const rowY = (row: number) => 220 + 80 * (row / FLOOR_ROWS) ** 1.4
const colX = (col: number, y: number) => 300 + (col - FLOOR_COLS / 2) * (680 / FLOOR_COLS) * (0.62 + 0.38 * ((y - 220) / 80))

// The checker floor in perspective, only its dark tiles drawn over the floor colour.
const CHECKER = Array.from({ length: FLOOR_ROWS * FLOOR_COLS }, (_, index) => {
  const row = Math.floor(index / FLOOR_COLS)
  const col = index % FLOOR_COLS
  const top = rowY(row)
  const bottom = rowY(row + 1)
  return { key: index, dark: (row + col) % 2 === 0, d: `M${colX(col, top)} ${top} L${colX(col + 1, top)} ${top} L${colX(col + 1, bottom)} ${bottom} L${colX(col, bottom)} ${bottom} Z` }
}).filter((tile) => tile.dark)

const BOARDS = Array.from({ length: 9 }, (_, index) => 224 + index * 9 + index * index * 0.6)
const PANELS = [20, 120, 220, 320, 420, 520]
const POSTS = Array.from({ length: 23 }, (_, index) => 70 + index * 20)
const STEPS = Array.from({ length: 9 }, (_, index) => index)
const BOOKS = Array.from({ length: 14 }, (_, index) => index)

function Wall({ tone = SH.paper, children }: { tone?: string; children?: ReactNode }) {
  return (
    <>
      <rect width={600} height={220} fill={tone} />
      <rect width={600} height={220} fill="url(#sh-room-dark)" />
      {children}
    </>
  )
}

/** The wainscot along the foot of the wall, its panels. */
function Wainscot() {
  return (
    <>
      <rect y={168} width={600} height={52} fill={SH.wood} opacity={0.55} />
      <rect y={164} width={600} height={5} fill={SH.sepia} />
      {PANELS.map((x) => (
        <rect key={x} x={x} y={176} width={84} height={36} fill="none" stroke={SH.sepia} strokeWidth={2} />
      ))}
    </>
  )
}

function Boards() {
  return (
    <>
      <rect y={220} width={600} height={80} fill={SH.sepia} />
      {BOARDS.map((y) => (
        <path key={y} d={`M0 ${y} H600`} stroke={SH.shadow} strokeWidth={1.4} opacity={0.6} />
      ))}
    </>
  )
}

function Checker() {
  return (
    <>
      <rect y={220} width={600} height={80} fill={SH.shadow} />
      {CHECKER.map((tile) => (
        <path key={tile.key} d={tile.d} fill={SH.sepia} opacity={0.6} />
      ))}
    </>
  )
}

/** A pool of lamp light on wall and floor. */
function Glow({ x, y, r }: { x: number; y: number; r: number }) {
  return <ellipse cx={x} cy={y} rx={r} ry={r * 0.7} fill="url(#sh-room-glow)" />
}

function TallWindow({ x }: { x: number }) {
  return (
    <g>
      <path d={`M${x} 160 V64 Q${x + 22} 40 ${x + 44} 64 V160 Z`} fill={SH.moon} opacity={0.16} />
      <path d={`M${x} 160 V64 Q${x + 22} 40 ${x + 44} 64 V160 Z M${x + 22} 50 V160 M${x} 108 H${x + 44}`} fill="none" stroke={SH.sepia} strokeWidth={3} />
      <path d={`M${x + 4} 160 L${x - 26} 220 H${x + 20} L${x + 40} 160 Z`} fill={SH.moon} opacity={0.05} />
    </g>
  )
}

function Bulb({ x }: { x: number }) {
  return (
    <g>
      <line x1={x} y1={0} x2={x} y2={46} stroke={SH.ash} strokeWidth={1.2} />
      <path d={`M${x - 10} 52 Q${x} 40 ${x + 10} 52 Z`} fill={SH.gunmetal} />
      <circle cx={x} cy={53} r={3.5} fill={SH.flame} />
    </g>
  )
}

const HALL = (
  <>
    <Wall>
      <TallWindow x={40} />
      <TallWindow x={516} />
      <rect x={262} y={150} width={76} height={70} fill={SH.void} />
      <rect x={266} y={154} width={33} height={66} fill={SH.wood} />
      <rect x={301} y={154} width={33} height={66} fill={SH.wood} />
      <circle cx={296} cy={188} r={1.8} fill={SH.brass} />
      <circle cx={304} cy={188} r={1.8} fill={SH.brass} />
      <rect x={60} y={124} width={480} height={10} fill={SH.wood} />
      <rect x={60} y={106} width={480} height={4} fill={SH.wood} />
      {POSTS.map((x) => (
        <rect key={x} x={x} y={110} width={3} height={14} fill={SH.sepia} />
      ))}
      {STEPS.map((step) => (
        <g key={step}>
          <rect x={60 + step * 10} y={134 + step * 9.6} width={70} height={9.6} fill={step % 2 ? SH.sepia : SH.wood} />
          <rect x={470 - step * 10} y={134 + step * 9.6} width={70} height={9.6} fill={step % 2 ? SH.sepia : SH.wood} />
        </g>
      ))}
    </Wall>
    <Checker />
    <path d="M262 220 L338 220 L392 300 L208 300 Z" fill={SH.leather} opacity={0.7} />
    <Glow x={300} y={262} r={170} />
    <g className={stage.settle}>
      <line x1={300} y1={0} x2={300} y2={50} stroke={SH.ash} strokeWidth={1.4} />
      <path d="M270 58 Q300 76 330 58 L326 54 Q300 66 274 54 Z" fill={SH.brass} />
      {[274, 286, 300, 314, 326].map((x) => (
        <g key={x}>
          <rect x={x - 1.2} y={46} width={2.4} height={9} fill={SH.cream} />
          <ellipse cx={x} cy={43} rx={1.6} ry={3} fill={SH.flame} />
        </g>
      ))}
    </g>
  </>
)

const SHELF_BOXES = [
  [180, 92, 30, 22],
  [216, 98, 22, 16],
  [330, 90, 34, 24],
  [372, 96, 20, 18],
  [190, 142, 40, 26],
  [350, 146, 28, 22],
  [400, 140, 26, 28],
] as const

const STORE = (
  <>
    <Wall tone={SH.panel}>
      {[114, 164].map((y) => (
        <rect key={y} x={160} y={y} width={280} height={6} fill={SH.wood} />
      ))}
      {SHELF_BOXES.map(([x, y, w, h]) => (
        <rect key={`${x}-${y}`} x={x} y={y + 22 - h} width={w} height={h} fill={SH.sepia} stroke={SH.shadow} strokeWidth={1} />
      ))}
      <path d="M160 70 V220 M440 70 V220" stroke={SH.wood} strokeWidth={5} />
    </Wall>
    <Boards />
    <Glow x={300} y={150} r={150} />
    <Bulb x={300} />
  </>
)

const ABOUT = (
  <>
    <Wall>
      <rect x={340} y={40} width={150} height={180} fill={SH.wood} />
      {[64, 112, 160].map((y) => (
        <g key={y}>
          <rect x={346} y={y} width={138} height={4} fill={SH.sepia} />
          {BOOKS.map((book) => (
            <rect key={book} x={350 + book * 9.4} y={y - 22 + (book % 3) * 2} width={7} height={22 - (book % 3) * 2} fill={book % 4 === 0 ? SH.leather : book % 3 === 0 ? SH.olive : SH.rust} />
          ))}
        </g>
      ))}
      <TallWindow x={150} />
      <Wainscot />
    </Wall>
    <Boards />
    <path d="M180 236 H420 L440 286 H160 Z" fill={SH.leather} opacity={0.55} />
  </>
)

// The long corridor of the ground floor: its window is the stage's glass band, the night beyond it.
const CORRIDOR = (
  <>
    <Wall tone={SH.panel}>
      <rect x={0} y={60} width={600} height={6} fill={SH.wood} />
      <Wainscot />
    </Wall>
    <Boards />
    <path d="M0 300 L250 220 H350 L600 300 Z" fill={SH.leather} opacity={0.3} />
  </>
)

const PEGS = Array.from({ length: 6 }, (_, index) => 190 + index * 44)

const TECH = (
  <>
    <Wall tone={SH.panel}>
      <rect x={170} y={60} width={260} height={110} fill={SH.olive} opacity={0.6} />
      {PEGS.map((x) => (
        <g key={x}>
          <path d={`M${x} 92 h22 v6 h-12 l-2 12 h-6 l2 -12 h-4 Z`} fill={SH.void} opacity={0.75} />
          <rect x={x - 2} y={128} width={30} height={8} fill={SH.void} opacity={0.75} />
        </g>
      ))}
      <rect x={110} y={182} width={380} height={10} fill={SH.wood} />
      <path d="M120 192 V220 M480 192 V220" stroke={SH.wood} strokeWidth={6} />
    </Wall>
    <rect y={220} width={600} height={80} fill={SH.shadow} />
    <Glow x={300} y={160} r={160} />
  </>
)

const PROJECTS = (
  <>
    <Wall>
      <TallWindow x={110} />
      <Wainscot />
    </Wall>
    <Checker />
    <Glow x={240} y={240} r={130} />
  </>
)

const VENTURES = (
  <>
    <Wall tone={SH.shadow}>
      <path d="M140 220 V90 Q300 20 460 90 V220" fill={SH.void} opacity={0.7} />
      <path d="M140 220 V90 Q300 20 460 90 V220" fill="none" stroke={SH.sepia} strokeWidth={6} />
    </Wall>
    <rect y={220} width={600} height={80} fill={SH.shadow} />
    <ellipse cx={380} cy={250} rx={160} ry={50} fill="url(#sh-room-blue)" />
  </>
)

const SUIT_STRIP = [200, 260, 340, 400]

const BANDS = (
  <>
    <Wall tone={SH.panel}>
      <rect x={0} y={60} width={600} height={6} fill={SH.wood} />
      {SUIT_STRIP.map((x) => (
        <rect key={x} x={x} y={30} width={16} height={16} transform={`rotate(45 ${x + 8} 38)`} fill={SH.brass} opacity={0.3} />
      ))}
      <Wainscot />
    </Wall>
    <Checker />
  </>
)

const GYM = (
  <>
    <Wall tone={SH.void}>
      <path d="M0 34 H600 M0 48 H600" stroke={SH.rust} strokeWidth={6} opacity={0.5} />
      <rect x={430} y={60} width={90} height={160} fill={SH.olive} opacity={0.25} />
    </Wall>
    <rect y={220} width={600} height={80} fill={SH.olive} opacity={0.6} />
    <rect y={220} width={600} height={80} fill="url(#sh-room-dark)" opacity={0.5} />
    <Glow x={300} y={200} r={150} />
    <Bulb x={300} />
  </>
)

// Outside the safe room: the last corridor, the safe door at his end of it.
const CONTACT = (
  <>
    <Wall tone={SH.panel}>
      {[60, 180, 420, 520].map((x) => (
        <rect key={x} x={x} y={70} width={50} height={70} fill="none" stroke={SH.sepia} strokeWidth={2} />
      ))}
      <Wainscot />
    </Wall>
    <Boards />
    <Glow x={260} y={220} r={110} />
    <Bulb x={260} />
  </>
)

// Inside: the safe room's warm lamp, the item box against the wall.
const SAFE = (
  <>
    <Wall tone={SH.paper}>
      <rect x={380} y={150} width={120} height={70} fill={SH.wood} />
      <path d="M380 150 Q440 124 500 150 Z" fill={SH.rust} />
      <rect x={434} y={160} width={12} height={14} fill={SH.brass} />
      <Wainscot />
    </Wall>
    <Boards />
    <Glow x={300} y={200} r={200} />
  </>
)

const ROOMS: Record<Room, ReactNode> = {
  hall: HALL,
  store: STORE,
  about: ABOUT,
  experience: CORRIDOR,
  tech: TECH,
  projects: PROJECTS,
  ventures: VENTURES,
  bands: BANDS,
  gym: GYM,
  contact: CONTACT,
  safe: SAFE,
}

/** The room in view: the safe room once he is inside it. */
export function RoomArt({ zone, flags }: { zone: Zone; flags: Flags }) {
  const room: Room = zone === 'contact' && flags.inside ? 'safe' : zone

  return (
    <svg viewBox="0 0 600 300" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="sh-room-dark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={SH.void} stopOpacity={0.9} />
          <stop offset="70%" stopColor={SH.void} stopOpacity={0.2} />
          <stop offset="100%" stopColor={SH.void} stopOpacity={0.4} />
        </linearGradient>
        <radialGradient id="sh-room-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={SH.flame} stopOpacity={0.3} />
          <stop offset="100%" stopColor={SH.flame} stopOpacity={0} />
        </radialGradient>
        <radialGradient id="sh-room-blue" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={SH.moon} stopOpacity={0.3} />
          <stop offset="100%" stopColor={SH.moon} stopOpacity={0} />
        </radialGradient>
      </defs>
      {ROOMS[room]}
      {room === 'tech' && (
        <g className={flags.swing ? stage.swing : ''}>
          <Bulb x={300} />
        </g>
      )}
    </svg>
  )
}
