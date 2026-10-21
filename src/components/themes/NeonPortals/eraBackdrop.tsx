'use client'

import type { ReactNode } from 'react'
import { useZoneStage } from '@/hooks/useZoneStage'
import { PORTAL } from './palette'
import era from './eraBackdrop.module.css'

// The page as a trip through the time travel platformer's eras (Warped, named in code only, research
// 2026-10-21-w4-neon-portals): a fixed backdrop behind the content that changes to the era of the
// section in view, the way the game dresses each warp room and level in one period. Every era is a full
// width painting in a 1600 by 900 box (cut to the screen from the bottom middle), four or five layers
// deep, with one to three living details that play only while that era shows. The era in view is lit
// (data-shown) and fades in over the last; each change sets off the warp, a burst of rings and a white
// flash from the middle of the screen (WarpBurst, keyed on the era so it replays).
//   hub          the time machine at night: the hourglass, the coils, the bent screen frame, the riveted floor
//   room         the warp room: a round floor floating over the sea, crenellated towers, banners, blue pads
//   medieval     gold wheat hills, a castle with blue cone roofs and red pennants, a harlequin tent, a bridge
//   egypt        a tomb hall: walls painted in teal, red and orange bands, papyrus columns, two braziers
//   underwater   deep teal water, light shafts, purple coral arches, seaweed, a shark far off, bubbles
//   prehistoric  a smoking volcano, jungle trunks, a lava river with stepping stones
//   future       a violet night city: dark towers with rows of yellow windows, neon rings, a lit road
//   arabian      a night harbour: domes, a minaret, lit lattice windows, the crescent moon, a carpet
//   wall         the great stone wall winding over green hills, red banners with gold trim, a watchtower
// Colours here are each era's own (sampled per image in the research notes); the shared ink is the
// palette's. Transform and opacity only, and nothing plays under reduced motion.

export type Zone = 'hub' | 'room' | 'medieval' | 'egypt' | 'underwater' | 'prehistoric' | 'future' | 'arabian' | 'wall'

const INK = PORTAL.VOID

function Sky({ id, top, low }: { id: string; top: string; low: string }) {
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={low} />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill={`url(#${id})`} />
    </>
  )
}

const STARS = [
  [120, 80],
  [260, 160],
  [420, 60],
  [610, 140],
  [780, 50],
  [930, 170],
  [1090, 70],
  [1260, 150],
  [1420, 90],
  [1530, 200],
  [340, 260],
  [1180, 260],
]

function Stars() {
  return (
    <g fill={PORTAL.WHITE}>
      {STARS.map(([x, y], i) => (
        <circle key={x} cx={x} cy={y} r={i % 3 === 0 ? 2.4 : 1.4} opacity={0.8} />
      ))}
    </g>
  )
}

function Hub() {
  return (
    <>
      <Sky id="np-era-hub" top="#0b0730" low="#3a1060" />
      <Stars />
      <path d="M260 900 V560 Q800 330 1340 560 V900" fill="none" stroke="#2f9a6a" strokeWidth="40" />
      <path d="M260 900 V560 Q800 330 1340 560 V900" fill="none" stroke={PORTAL.BRASS} strokeWidth="8" />
      <rect x="560" y="520" width="480" height="160" rx="18" fill="#0c2a2a" stroke={INK} strokeWidth="6" />
      {[0, 1, 2].map((row) => (
        <rect key={row} x={600} y={548 + row * 40} width={400 - row * 90} height={20} rx={4} fill="#3fe08a" opacity={0.8} />
      ))}
      <g transform="translate(150 470)">
        <path d="M0 0 H160 L100 150 L160 300 H0 L60 150 Z" fill="#9ff3ff" fillOpacity="0.25" stroke={PORTAL.BRASS} strokeWidth="10" strokeLinejoin="round" />
        <path d="M20 10 H140 L86 140 H74 Z" fill="#3fa8ff" opacity="0.8" />
        <path d="M30 290 Q80 230 130 290 Z" fill="#3fa8ff" opacity="0.8" />
        <rect x="76" y="140" width="8" height="140" fill="#3fa8ff" className={era.sand} />
        <rect x="-16" y="-20" width="192" height="24" rx="8" fill={PORTAL.BRASS} stroke={INK} strokeWidth="4" />
        <rect x="-16" y="296" width="192" height="24" rx="8" fill={PORTAL.BRASS} stroke={INK} strokeWidth="4" />
      </g>
      <g transform="translate(1340 440)">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <ellipse key={i} cx="60" cy={40 + i * 50} rx="70" ry="18" fill="none" stroke="#c87533" strokeWidth="12" />
        ))}
        <rect x="52" y="0" width="16" height="340" fill={PORTAL.STONE_DARK} />
        <path d="M60 -10 L30 -60 L66 -44 L44 -110" fill="none" stroke="#9ff3ff" strokeWidth="6" strokeLinejoin="round" className={era.spark} />
      </g>
      <ellipse cx="800" cy="900" rx="760" ry="170" fill="#1f6a5a" stroke={INK} strokeWidth="8" />
      <ellipse cx="800" cy="900" rx="620" ry="120" fill="none" stroke={PORTAL.BRASS} strokeWidth="6" />
      {Array.from({ length: 14 }, (_, i) => (
        <circle key={i} cx={130 + i * 103} cy={808 + Math.abs(7 - i) * 6} r="6" fill={PORTAL.STONE_LIT} />
      ))}
    </>
  )
}

function Tower({ x, roof }: { x: number; roof: boolean }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <rect x="0" y="380" width="150" height="360" fill="#7a7488" stroke={INK} strokeWidth="5" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={i * 40} y="350" width="30" height="34" fill="#7a7488" stroke={INK} strokeWidth="5" />
      ))}
      <rect x="55" y="470" width="40" height="70" rx="20" fill={INK} />
      {roof && <path d="M-20 352 L75 200 L170 352 Z" fill="#2f4ab8" stroke={INK} strokeWidth="5" />}
      <path d="M150 420 h60 v120 l-30 -24 l-30 24 Z" fill={roof ? PORTAL.TNT : '#2f9a3a'} stroke={INK} strokeWidth="4" className={era.banner} />
    </g>
  )
}

function Room() {
  return (
    <>
      <Sky id="np-era-room" top="#140a40" low="#5a2a8a" />
      <Stars />
      <rect y="640" width="1600" height="260" fill="#0c1640" />
      <path d="M0 660 H1600" stroke="#3a5ab0" strokeWidth="3" opacity="0.6" />
      <Tower x={160} roof />
      <Tower x={1290} roof={false} />
      <ellipse cx="800" cy="860" rx="720" ry="150" fill="#6a6478" stroke={INK} strokeWidth="8" />
      <ellipse cx="800" cy="850" rx="640" ry="120" fill="#8a5a2c" />
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d={`M${220 + i * 105} 760 L${200 + i * 108} 960`} stroke="#5a3418" strokeWidth="4" />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${480 + i * 160} ${800 - Math.abs(2 - i) * 22})`}>
          <ellipse rx="62" ry="20" fill="#8a8a96" stroke={INK} strokeWidth="4" />
          <ellipse cy="-8" rx="48" ry="16" fill={PORTAL.TEAL} stroke={INK} strokeWidth="3" />
          <ellipse cx="-14" cy="-14" rx="16" ry="5" fill={PORTAL.WHITE} opacity="0.5" />
        </g>
      ))}
    </>
  )
}

function Medieval() {
  return (
    <>
      <Sky id="np-era-medieval" top="#5fa8f0" low="#fff0c0" />
      <g className={era.cloud}>
        <ellipse cx="300" cy="160" rx="120" ry="34" fill={PORTAL.WHITE} opacity="0.85" />
        <ellipse cx="1180" cy="110" rx="150" ry="40" fill={PORTAL.WHITE} opacity="0.8" />
      </g>
      <g transform="translate(1010 330)">
        <rect x="0" y="80" width="300" height="200" fill="#b8b4c0" stroke={INK} strokeWidth="5" />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${i * 120 - 20} 0)`}>
            <rect x="0" y="40" width="70" height="240" fill="#c8c4d0" stroke={INK} strokeWidth="5" />
            <path d="M-12 44 L35 -60 L82 44 Z" fill="#2f4ab8" stroke={INK} strokeWidth="5" />
            <path d="M35 -60 V-100" stroke={INK} strokeWidth="4" />
            <path d="M35 -100 L80 -88 L35 -76 Z" fill={PORTAL.TNT} stroke={INK} strokeWidth="3" className={era.pennant} />
          </g>
        ))}
      </g>
      <path d="M0 620 Q300 480 640 580 Q980 470 1600 560 V900 H0 Z" fill="#d8b040" stroke={INK} strokeWidth="5" />
      <path d="M0 720 Q400 610 820 700 Q1200 620 1600 690 V900 H0 Z" fill="#b8862a" stroke={INK} strokeWidth="5" />
      <g transform="translate(150 520)">
        <path d="M0 200 L110 0 L220 200 Z" fill="#8a3ab0" stroke={INK} strokeWidth="5" />
        <path d="M55 100 L110 0 L165 100 L110 200 Z" fill="#e85aa0" stroke={INK} strokeWidth="4" />
        <path d="M110 0 V-40" stroke={INK} strokeWidth="4" />
      </g>
      <path d="M560 900 L740 640 H880 L1060 900 Z" fill="#9a96a4" stroke={INK} strokeWidth="5" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${700 - i * 50} ${700 + i * 60} H${920 + i * 50}`} stroke="#6a6676" strokeWidth="4" />
      ))}
    </>
  )
}

function Egypt() {
  const bands = ['#1fa89a', '#c0391a', '#f08a2a', '#1fa89a']
  return (
    <>
      <rect width="1600" height="900" fill="#6a2a14" />
      {bands.map((fill, i) => (
        <rect key={i} y={90 + i * 120} width="1600" height="70" fill={fill} opacity="0.9" />
      ))}
      {Array.from({ length: 16 }, (_, i) => (
        <g key={i} fill="#2a0f06" opacity="0.6">
          <rect x={40 + i * 100} y={110} width="16" height="30" />
          <circle cx={80 + i * 100} cy={245} r="12" />
          <path d={`M${30 + i * 100} 380 l20 -30 l20 30 Z`} />
        </g>
      ))}
      {[180, 560, 1040, 1420].map((x) => (
        <g key={x} transform={`translate(${x} 0)`}>
          <rect x="-50" y="60" width="100" height="700" fill="#e8c27a" stroke={INK} strokeWidth="5" />
          <rect x="-50" y="160" width="100" height="40" fill="#1fa89a" />
          <rect x="-50" y="420" width="100" height="40" fill="#c0391a" />
          <path d="M-80 60 Q0 -10 80 60 Z" fill={PORTAL.BRASS} stroke={INK} strokeWidth="5" />
        </g>
      ))}
      <rect y="740" width="1600" height="160" fill="#d8a85a" stroke={INK} strokeWidth="5" />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M${i * 200} 740 L${i * 200 - 60} 900`} stroke="#a8783a" strokeWidth="4" />
      ))}
      {[380, 1230].map((x) => (
        <g key={x} transform={`translate(${x} 640)`}>
          <path d="M-40 0 H40 L24 100 H-24 Z" fill={PORTAL.BRASS} stroke={INK} strokeWidth="5" />
          <path d="M-34 0 Q-30 -70 0 -110 Q30 -70 34 0 Z" fill="#ff8a1a" className={era.flame} />
          <path d="M-18 0 Q-14 -40 0 -64 Q14 -40 18 0 Z" fill="#ffe08a" className={era.flame} />
        </g>
      ))}
    </>
  )
}

function Underwater() {
  return (
    <>
      <Sky id="np-era-sea" top="#0e5a6e" low="#021820" />
      {[200, 640, 1100].map((x) => (
        <path key={x} d={`M${x} 0 H${x + 140} L${x + 320} 900 H${x + 120} Z`} fill="#9ff3ff" opacity="0.08" />
      ))}
      <g className={era.shark} fill="#2a5a6a" opacity="0.7">
        <path d="M0 0 Q80 -30 180 0 Q80 26 0 0 Z M120 -14 L140 -50 L150 -12 Z M0 0 L-40 -26 L-30 0 L-40 24 Z" transform="translate(1100 260)" />
      </g>
      <path d="M0 620 Q140 420 300 620 M260 640 Q400 380 560 640" fill="none" stroke="#7a3a9a" strokeWidth="60" />
      <path d="M1100 640 Q1260 400 1420 640" fill="none" stroke="#9a4aa8" strokeWidth="70" />
      <path d="M0 780 Q400 720 800 780 Q1200 740 1600 780 V900 H0 Z" fill="#3a6a4a" stroke={INK} strokeWidth="4" />
      {[80, 420, 700, 980, 1300, 1520].map((x, i) => (
        <path key={x} d={`M${x} 820 Q${x - 30} 720 ${x} 640 Q${x + 30} 560 ${x} 480`} fill="none" stroke={i % 2 ? '#2f9a5a' : '#8a3ab0'} strokeWidth="18" strokeLinecap="round" className={i % 2 ? era.weed : undefined} />
      ))}
      <g className={era.bubbles} fill="none" stroke="#c8f8ff" strokeWidth="3">
        {[
          [520, 700, 10],
          [540, 640, 6],
          [1000, 760, 12],
          [1020, 690, 7],
          [1460, 720, 9],
        ].map(([x, y, r]) => (
          <circle key={x + y} cx={x} cy={y} r={r} />
        ))}
      </g>
    </>
  )
}

function Prehistoric() {
  return (
    <>
      <Sky id="np-era-dino" top="#3a1410" low="#e86a2a" />
      <path d="M900 520 L1120 200 H1220 L1440 520 Z" fill="#3a2418" stroke={INK} strokeWidth="5" />
      <path d="M1120 200 Q1170 240 1220 200 L1200 260 Q1170 230 1140 260 Z" fill="#ff6a1a" className={era.glow} />
      <g className={era.smoke} fill="#5a4a48" opacity="0.7">
        <circle cx="1160" cy="150" r="50" />
        <circle cx="1210" cy="90" r="40" />
      </g>
      <path d="M0 560 Q400 460 800 540 Q1200 480 1600 560 V900 H0 Z" fill="#1f3a1a" stroke={INK} strokeWidth="5" />
      {[60, 300, 520, 1400, 1530].map((x, i) => (
        <g key={x}>
          <rect x={x} y={160 + i * 30} width="70" height="700" fill="#3a2a18" stroke={INK} strokeWidth="5" />
          <path d={`M${x + 35} ${170 + i * 30} q-120 -10 -160 50 M${x + 35} ${170 + i * 30} q120 -10 160 50 M${x + 35} ${170 + i * 30} q-60 -80 -110 -60 M${x + 35} ${170 + i * 30} q60 -80 110 -60`} fill="none" stroke="#2f6b2e" strokeWidth="26" strokeLinecap="round" />
        </g>
      ))}
      <path d="M0 760 Q400 700 800 770 Q1200 820 1600 740 V900 H0 Z" fill="#ff7a1a" className={era.glow} />
      <path d="M0 790 Q400 740 800 800 Q1200 850 1600 770" fill="none" stroke="#ffe08a" strokeWidth="6" />
      {[380, 640, 900, 1160].map((x) => (
        <ellipse key={x} cx={x} cy={800} rx="70" ry="20" fill="#6a6a6a" stroke={INK} strokeWidth="4" />
      ))}
    </>
  )
}

function Future() {
  const towers = [
    [60, 240, 140],
    [260, 120, 120],
    [450, 300, 160],
    [700, 80, 130],
    [900, 220, 150],
    [1120, 140, 120],
    [1320, 260, 170],
  ]
  return (
    <>
      <Sky id="np-era-future" top="#0e0330" low="#5a1a8a" />
      <Stars />
      <g className={era.car}>
        <path d="M0 0 Q30 -20 70 -16 Q100 -12 110 4 H0 Z" fill="#ff4a8a" stroke={INK} strokeWidth="3" transform="translate(-200 180)" />
      </g>
      {towers.map(([x, top, w], i) => (
        <g key={x}>
          <rect x={x} y={top} width={w} height={900 - top} rx={w / 3} fill="#1a1050" stroke={INK} strokeWidth="5" />
          {Array.from({ length: 8 }, (_, row) => (
            <rect key={row} x={x + 16} y={top + 50 + row * 70} width={w - 32} height="12" rx="4" fill={row % 3 === 1 ? '#3fe0ff' : '#ffd23f'} opacity="0.85" className={row === 2 && i % 2 ? era.window : undefined} />
          ))}
          <ellipse cx={x + w / 2} cy={top + 30} rx={w / 2 + 14} ry="12" fill="none" stroke={i % 2 ? '#3fe08a' : '#ff3a5a'} strokeWidth="6" />
        </g>
      ))}
      <path d="M0 900 L640 660 H960 L1600 900 Z" fill="#c8c0e0" stroke={INK} strokeWidth="5" />
      <path d="M640 660 L0 900 M960 660 L1600 900" stroke="#3fe0ff" strokeWidth="8" />
      <path d="M800 660 V900" stroke="#3fe08a" strokeWidth="6" strokeDasharray="30 30" />
    </>
  )
}

function Arabian() {
  return (
    <>
      <Sky id="np-era-arabian" top="#0a1442" low="#40306a" />
      <Stars />
      <path d="M1280 90 A70 70 0 1 0 1350 180 A52 52 0 1 1 1280 90 Z" fill="#ffe08a" />
      <g className={era.carpet}>
        <path d="M0 0 Q60 -14 120 0 L116 16 Q60 4 4 16 Z" fill="#2f9a3a" stroke={INK} strokeWidth="3" transform="translate(300 250)" />
      </g>
      <g fill="#c8a06a" stroke={INK} strokeWidth="5">
        <path d="M80 760 V480 H420 V760 Z" />
        <path d="M100 480 Q250 240 400 480 Z" fill="#d8b47a" />
        <path d="M560 760 V300 H620 V760 Z" />
        <path d="M545 300 Q590 200 635 300 Z" fill="#d8b47a" />
        <path d="M760 760 V520 H1240 V760 Z" fill="#a8784a" />
        <path d="M820 520 Q1000 300 1180 520 Z" fill="#b8885a" />
      </g>
      {[160, 300, 860, 980, 1100].map((x) => (
        <path key={x} d={`M${x} 640 v-60 q30 -40 60 0 v60 Z`} fill="#ff9a2a" stroke={INK} strokeWidth="4" className={x === 980 ? era.lamp : undefined} />
      ))}
      <path d="M1300 760 V560 H1600 V760 Z" fill="#8a5a3a" stroke={INK} strokeWidth="5" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M${1300 + i * 50} 560 h50 l-10 40 h-30 Z`} fill={i % 2 ? '#c0391a' : '#f2e8c8'} stroke={INK} strokeWidth="3" />
      ))}
      <rect y="760" width="1600" height="140" fill="#0c1a4a" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${100 + i * 380} ${800 + (i % 2) * 40} h160`} stroke="#3a6ad8" strokeWidth="5" strokeLinecap="round" />
      ))}
    </>
  )
}

function Wall() {
  return (
    <>
      <Sky id="np-era-wall" top="#4fa0f0" low="#dff2ff" />
      <g className={era.cloud}>
        <ellipse cx="420" cy="140" rx="130" ry="34" fill={PORTAL.WHITE} opacity="0.85" />
        <ellipse cx="1240" cy="190" rx="110" ry="30" fill={PORTAL.WHITE} opacity="0.8" />
      </g>
      <path d="M0 520 Q300 380 640 480 Q1000 360 1600 470 V900 H0 Z" fill="#5cc23a" stroke={INK} strokeWidth="5" />
      <path d="M0 640 Q400 540 820 620 Q1200 540 1600 610 V900 H0 Z" fill="#2f8a22" stroke={INK} strokeWidth="5" />
      <path d="M-20 700 Q300 520 640 600 Q980 460 1300 520 Q1460 500 1620 470" fill="none" stroke={INK} strokeWidth="70" />
      <path d="M-20 700 Q300 520 640 600 Q980 460 1300 520 Q1460 500 1620 470" fill="none" stroke="#9a9a90" strokeWidth="60" />
      <path d="M-20 668 Q300 488 640 568 Q980 428 1300 488 Q1460 468 1620 438" fill="none" stroke="#7a7a70" strokeWidth="16" strokeDasharray="26 22" />
      <g transform="translate(1180 300)">
        <rect x="0" y="40" width="140" height="200" fill="#8a8a80" stroke={INK} strokeWidth="5" />
        <path d="M-20 44 L70 -20 L160 44 Z" fill="#2a2a2a" stroke={INK} strokeWidth="5" />
        <path d="M-20 44 Q-30 30 -40 34 M160 44 Q170 30 180 34" stroke={PORTAL.BRASS} strokeWidth="5" />
      </g>
      {[180, 520, 900].map((x, i) => (
        <g key={x} transform={`translate(${x} ${560 - i * 40})`}>
          <path d="M0 0 V-260" stroke="#4a2a1a" strokeWidth="8" />
          <path d="M4 -250 h90 v170 l-45 -24 l-45 24 Z" fill="#c0201a" stroke={PORTAL.BRASS} strokeWidth="6" className={era.banner} />
        </g>
      ))}
    </>
  )
}

const ERAS: Record<Zone, () => ReactNode> = {
  hub: Hub,
  room: Room,
  medieval: Medieval,
  egypt: Egypt,
  underwater: Underwater,
  prehistoric: Prehistoric,
  future: Future,
  arabian: Arabian,
  wall: Wall,
}

const ZONES = Object.keys(ERAS) as Zone[]

/** The warp between two eras: rings rushing out from the middle and a white flash. */
function WarpBurst() {
  return (
    <div className={`absolute inset-0 ${era.warp}`} aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className={era.ring} data-ring={i} />
      ))}
      <span className={era.flash} />
    </div>
  )
}

/** The fixed backdrop: every era painted, the one in view shown, the warp on each change. */
export function EraBackdrop({ zone, reduced }: { zone: Zone; reduced: boolean }) {
  return (
    <div className={`pointer-events-none fixed inset-0 overflow-hidden ${era.backdrop}`} aria-hidden="true">
      {ZONES.map((name) => {
        const Painting = ERAS[name]
        return (
          <svg key={name} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className={`absolute inset-0 h-full w-full ${era.era}`} data-shown={name === zone || undefined}>
            <Painting />
          </svg>
        )
      })}
      <div className={`absolute inset-0 ${era.shade}`} />
      {!reduced && <WarpBurst key={zone} />}
    </div>
  )
}

/** A part of the page outside the CV sections (the hub at the top and the end, the warp room) that hands its era up while in view. */
export function EraArea({ zone, children }: { zone: Zone; children: ReactNode }) {
  const { ref } = useZoneStage<Zone>(zone)
  return <div ref={ref}>{children}</div>
}
