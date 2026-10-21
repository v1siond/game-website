'use client'

import { useId, type ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { FS } from './palette'
import fight from './fight.module.css'

// The three fight stages, one per profession, drawn in depth like the early 90s arcade stages: a lit sky,
// a far layer, a mid layer with a crowd of onlookers in it, the tiled fighting floor in perspective and
// the light pool on it. They stand behind the versus splash and the
// select preview, and a band's stage card reuses the concert stage. Still art: the motion is the
// fighter's and the cards', never the stage's, except the three depth layers that lean with the cursor
// (depthFar, depthMid, depthNear read --mx and --my from the element above).

interface Depth {
  far: ReactNode
  mid: ReactNode
  near: ReactNode
  sky: [string, string]
  floor: [string, string]
  // The joints between the floor tiles.
  tile: string
  pool: string
}

// The onlookers every stage gathers along its back wall: a shirt, a head and a dark crop of hair each,
// standing on the line `base`, in the colours and sizes given.
const SHIRTS = [FS.p2Dark, FS.p1, FS.health, FS.orange, FS.chrome, FS.giDeep]
const SKINS = ['#e9b08a', '#b9774c', FS.skinDeep]

interface Onlooker {
  x: number
  scale: number
}

function Crowd({ people, base }: { people: Onlooker[]; base: number }) {
  return (
    <>
      {people.map(({ x, scale }, i) => (
        <g key={x} transform={`translate(${x} ${base}) scale(${scale})`}>
          <path d="M-10 0 Q-10 -15 0 -16 Q10 -15 10 0 Z" fill={SHIRTS[i % SHIRTS.length]} stroke={FS.ink} strokeWidth={1.2} />
          <circle cy={-22} r={6} fill={SKINS[i % SKINS.length]} stroke={FS.ink} strokeWidth={1.2} />
          <path d="M-6 -23 Q-6 -29 0 -29 Q6 -29 6 -23 Q3 -26 -6 -23 Z" fill={FS.belt} />
        </g>
      ))}
    </>
  )
}

const onlookers = (xs: number[]): Onlooker[] => xs.map((x, i) => ({ x, scale: 0.9 + (i % 3) * 0.12 }))

const RACKS = [30, 110, 190, 410, 490, 570]
const LEDS = [30, 42, 54, 66, 78]

const SERVER_HALL: Depth = {
  sky: ['#16307a', '#0b1440'],
  floor: ['#3a4a8c', '#141c46'],
  tile: FS.chrome,
  pool: FS.cyan,
  far: (
    <>
      {RACKS.map((x) => (
        <g key={x} opacity={0.55}>
          <rect x={x} y={20} width={44} height={110} fill={FS.panel} stroke={FS.steel} />
          {LEDS.map((y, i) => (
            <rect key={y} x={x + 32} y={y} width={6} height={3} fill={i % 2 ? FS.cyan : FS.health} />
          ))}
        </g>
      ))}
    </>
  ),
  mid: (
    <>
      <path d="M0 18 H640 M0 26 H640" stroke={FS.steel} strokeWidth={3} />
      <path d="M60 26 Q160 60 260 26 M380 26 Q480 60 580 26" fill="none" stroke={FS.p1} strokeWidth={3} opacity={0.7} />
      <rect x={250} y={70} width={140} height={60} fill={FS.panelLight} stroke={FS.cyan} strokeWidth={2} />
      <rect x={260} y={78} width={120} height={40} fill={FS.cyan} opacity={0.25} />
      <path d="M268 90 H320 M268 100 H350 M268 110 H300" stroke={FS.cyan} strokeWidth={3} />
      <Crowd people={onlookers([120, 150, 186, 454, 490, 522])} base={150} />
    </>
  ),
  near: (
    <>
      <path d="M0 160 L40 120 H90 L70 160 Z" fill={FS.ink} />
      <path d="M640 160 L600 118 H548 L572 160 Z" fill={FS.ink} />
    </>
  ),
}

const BEAMS = [130, 320, 510]

const CONCERT: Depth = {
  sky: ['#5a0c2c', '#1a0614'],
  floor: ['#6b3a1c', '#24120a'],
  tile: '#c98a4a',
  pool: FS.gold,
  far: (
    <>
      {BEAMS.map((x) => (
        <path key={x} d={`M${x - 6} 24 L${x - 70} 150 H${x + 70} L${x + 6} 24 Z`} fill={FS.gold} opacity={0.16} />
      ))}
      <path d="M0 16 H640 M0 24 H640" stroke={FS.steel} strokeWidth={3} />
      {Array.from({ length: 32 }, (_, i) => i * 20).map((x) => (
        <line key={x} x1={x} y1={16} x2={x + 20} y2={24} stroke={FS.steel} strokeWidth={1.2} />
      ))}
    </>
  ),
  mid: (
    <>
      {[16, 576].map((x) => (
        <g key={x}>
          <rect x={x} y={70} width={48} height={70} fill={FS.ink} stroke={FS.steel} strokeWidth={1.5} />
          <circle cx={x + 24} cy={90} r={11} fill={FS.panel} stroke={FS.steel} />
          <circle cx={x + 24} cy={120} r={8} fill={FS.panel} stroke={FS.steel} />
        </g>
      ))}
      <rect x={250} y={112} width={140} height={14} fill={FS.p2Dark} />
      <ellipse cx={320} cy={104} rx={30} ry={22} fill={FS.p2Dark} stroke={FS.chrome} strokeWidth={2} />
      <ellipse cx={268} cy={92} rx={18} ry={5} fill={FS.gold} />
      <ellipse cx={372} cy={88} rx={20} ry={5} fill={FS.gold} />
    </>
  ),
  near: (
    <>
      <Crowd people={onlookers(Array.from({ length: 12 }, (_, i) => 14 + i * 26))} base={200} />
      <Crowd people={onlookers(Array.from({ length: 12 }, (_, i) => 340 + i * 26))} base={200} />
    </>
  ),
}

// A tiered temple roof: three stacked gables with the upturned finials at their ends.
const roof = (x: number, width: number, base: number) =>
  [0, 1, 2]
    .map((tier) => {
      const inset = tier * width * 0.14
      const y = base - tier * 16
      const left = x + inset
      const right = x + width - inset
      return `M${left} ${y} L${x + width / 2} ${y - 20} L${right} ${y} Z M${left} ${y} l-6 -8 M${right} ${y} l6 -8`
    })
    .join(' ')

const TEMPLE_RING: Depth = {
  sky: ['#ffb347', '#e0603a'],
  floor: ['#c9b48a', '#6b5a3a'],
  tile: '#7a6440',
  pool: FS.orange,
  far: (
    <>
      <circle cx={500} cy={50} r={22} fill={FS.gold} opacity={0.8} />
      <path d={roof(170, 300, 96)} fill="#1a0a1e" stroke="#1a0a1e" strokeWidth={3} strokeLinejoin="round" />
      <rect x={210} y={96} width={220} height={40} fill="#1a0a1e" />
    </>
  ),
  mid: (
    <>
      {[110, 530].map((x) => (
        <g key={x}>
          <line x1={x} y1={0} x2={x} y2={24} stroke={FS.steel} />
          <rect x={x - 7} y={24} width={14} height={20} rx={6} fill={FS.p2Dark} />
          <rect x={x - 4} y={27} width={8} height={14} rx={4} fill={FS.gold} />
        </g>
      ))}
      <Crowd people={onlookers([40, 70, 100, 132, 508, 540, 572, 602])} base={150} />
    </>
  ),
  near: (
    <>
      <rect x={14} y={70} width={10} height={90} fill={FS.p1} />
      <rect x={616} y={70} width={10} height={90} fill={FS.p2} />
      {[
        [FS.p2, 92],
        [FS.chrome, 110],
        [FS.p1, 128],
      ].map(([color, y]) => (
        <line key={y} x1={0} y1={y} x2={640} y2={y} stroke={color as string} strokeWidth={2.5} />
      ))}
    </>
  ),
}

const STAGES: Record<Profession, Depth> = {
  engineer: SERVER_HALL,
  drummer: CONCERT,
  fighter: TEMPLE_RING,
}

// The floor's tiles: joints running to the vanishing point, and rows that open up toward the viewer.
const FLOOR_LINES = [-320, -160, 0, 80, 160, 240, 320, 400, 480, 560, 640, 800, 960]
const FLOOR_ROWS = [156, 164, 175, 190]

export function StageBackdrop({ profession, className = '' }: { profession: Profession; className?: string }) {
  const id = useId()
  const stage = STAGES[profession]
  const sky = `${id}-sky`
  const floor = `${id}-floor`
  const pool = `${id}-pool`

  return (
    <svg viewBox="0 0 640 200" preserveAspectRatio="xMidYMax slice" className={`absolute inset-0 h-full w-full ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={sky} x1={0} y1={0} x2={0} y2={1}>
          <stop offset="0%" stopColor={stage.sky[0]} />
          <stop offset="100%" stopColor={stage.sky[1]} />
        </linearGradient>
        <linearGradient id={floor} x1={0} y1={0} x2={0} y2={1}>
          <stop offset="0%" stopColor={stage.floor[0]} />
          <stop offset="100%" stopColor={stage.floor[1]} />
        </linearGradient>
        <radialGradient id={pool} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={stage.pool} stopOpacity={0.45} />
          <stop offset="100%" stopColor={stage.pool} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={640} height={200} fill={`url(#${sky})`} />
      <g className={fight.depthFar}>{stage.far}</g>
      <g className={fight.depthMid}>{stage.mid}</g>
      <path d="M0 150 H640 V200 H0 Z" fill={`url(#${floor})`} />
      <line x1={0} y1={150} x2={640} y2={150} stroke={FS.ink} strokeWidth={2} />
      {FLOOR_LINES.map((x) => (
        <line key={x} x1={x} y1={150} x2={320 + (x - 320) * 1.8} y2={200} stroke={stage.tile} strokeWidth={1} opacity={0.55} />
      ))}
      {FLOOR_ROWS.map((y) => (
        <line key={y} x1={0} y1={y} x2={640} y2={y} stroke={stage.tile} strokeWidth={1} opacity={0.55} />
      ))}
      <ellipse cx={320} cy={178} rx={240} ry={22} fill={`url(#${pool})`} />
      <g className={fight.depthNear}>{stage.near}</g>
    </svg>
  )
}
