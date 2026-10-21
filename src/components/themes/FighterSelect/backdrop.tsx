'use client'

import type { CSSProperties, ReactNode } from 'react'
import { FS } from './palette'
import living from './living.module.css'

// The stage behind the page, the way the arcade tour moves from one country's stage to the next: the
// castle rooftop under the moon behind his entrance, the select screen and the bonus stage; the street
// market at noon, its crowd round the stalls and a rider crossing, behind his jobs and his move list;
// the harbour at sunset with the crowd dancing on the yacht's deck behind his projects, ventures and
// bands; the temple ring with its crowd behind the Muay Thai record and the win quote. The page hands
// the zone in view down (useZoneStage in each scene) and the stages cross fade. Each crowd loops a
// two frame bob in groups, out of step; a stage out of view holds still.

export type Zone = 'castle' | 'market' | 'harbour' | 'temple'

const W = 1600
const H = 900

const SHIRTS = [FS.p2Dark, FS.p1, FS.health, FS.orange, FS.chrome, FS.giDeep, FS.gold]
const SKINS = ['#e9b08a', '#b9774c', FS.skinDeep, '#f2c49b']

// A bobbing group of onlookers standing on the line `base`, `count` of them from `x`, `gap` apart.
export function CrowdGroup({ x, base, count, gap, scale, i }: { x: number; base: number; count: number; gap: number; scale: number; i: number }) {
  return (
    <g className={living.bob} style={{ '--i': i } as CSSProperties}>
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
    <g className={living.sway} style={{ '--i': 0 } as CSSProperties}>
      <rect x={300} y={470} width={70} height={150} fill="#c9b48a" stroke={FS.ink} strokeWidth={4} />
      <path d="M318 500 H352 M318 530 H352 M318 560 H352" stroke={FS.ink} strokeWidth={6} />
    </g>
  </>
)

// The street market at noon: shop fronts, lanterns swinging, stalls, the crowd along the street and a
// rider crossing it now and then.
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
    {[180, 520, 860, 1200, 1500].map((x, k) => (
      <g key={x} className={living.sway} style={{ '--i': k } as CSSProperties}>
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
    <g className={living.ride}>
      <g transform="translate(0 820)">
        <circle cx={-40} cy={0} r={34} fill="none" stroke={FS.ink} strokeWidth={6} />
        <circle cx={60} cy={0} r={34} fill="none" stroke={FS.ink} strokeWidth={6} />
        <path d="M-40 0 L0 -40 L60 0 M0 -40 L10 -70" stroke={FS.ink} strokeWidth={6} fill="none" />
        <path d="M-10 -100 Q0 -120 14 -100 L20 -60 L-4 -60 Z" fill={FS.p1} stroke={FS.ink} strokeWidth={4} />
        <circle cx={4} cy={-118} r={14} fill="#e9b08a" stroke={FS.ink} strokeWidth={4} />
      </g>
    </g>
  </>
)

// The harbour at sunset: the sea, the far cranes, the yacht moored along the quay, rocking, its deck
// packed with a crowd dancing.
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
    <g className={living.rock}>
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

const STAGES: Record<Zone, ReactNode> = {
  castle: CASTLE,
  market: MARKET,
  harbour: HARBOUR,
  temple: TEMPLE,
}
const ZONES = Object.keys(STAGES) as Zone[]

export function TourBackdrop({ zone }: { zone: Zone }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      {ZONES.map((id) => (
        <svg
          key={id}
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMax slice"
          className={`absolute inset-0 h-full w-full ${living.zone}`}
          data-on={id === zone || undefined}
          focusable="false"
        >
          {STAGES[id]}
        </svg>
      ))}
      <div className="absolute inset-0 bg-[color:var(--fs-select-deep)] opacity-40" />
    </div>
  )
}
