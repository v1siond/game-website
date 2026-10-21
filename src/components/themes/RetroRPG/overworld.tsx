'use client'

import { memo, type CSSProperties, type ReactNode } from 'react'
import { RPG } from './palette'
import rooms from './rooms.module.css'

// The overworld behind the page: the underground he walks through as the visitor scrolls, the way the
// game's zones follow one another (research 2026-10-21-w4-retro-rpg). Each section hands up its zone
// (useZoneStage in rooms.tsx) and the backdrop crossfades to it in hard steps: the violet ruins with red
// leaves falling, the snow with its pines and falling flakes, the navy waterfall lit by rising glow dots,
// the heat zone with lava flicker and rising embers, the ancestor's pastel town with drifting clouds.
//
// Rooms in the game are flat: a back wall band over a floor, a black void round them. So is each zone:
// one SVG, the wall band, the floor and its small life. Only the zone on show animates (data-active, read
// by rooms.module.css); a veil keeps the page's boxes the brightest thing on screen.

export type Zone = 'ruins' | 'snow' | 'water' | 'heat' | 'town'

const ZONES: readonly Zone[] = ['ruins', 'snow', 'water', 'heat', 'town']

/** Something that falls or rises through the zone: its x, when it starts and how long it takes. */
type Mote = readonly [x: number, at: number, ms: number]

const motion = (at: number, ms: number, drift = 12): CSSProperties =>
  ({ '--fall-at': `${-at}ms`, '--fall-ms': `${ms}ms`, '--drift': `${drift}px` }) as CSSProperties

function Falling({ motes, fill, size, className = rooms.falls }: { motes: readonly Mote[]; fill: string; size: number; className?: string }) {
  return (
    <>
      {motes.map(([x, at, ms]) => (
        <rect key={x} x={x} y={0} width={size} height={size} fill={fill} className={className} style={motion(at, ms)} />
      ))}
    </>
  )
}

const LEAVES: readonly Mote[] = [[30, 0, 9000], [96, 3000, 11000], [170, 6000, 10000], [240, 1500, 12000], [300, 4500, 9500]]
const FLAKES: readonly Mote[] = [[14, 0, 7000], [58, 2000, 8000], [102, 4000, 7500], [150, 1000, 9000], [196, 5000, 7000], [244, 3000, 8500], [290, 6000, 7800], [320, 1500, 8200]]
const GLOW: readonly Mote[] = [[40, 0, 6000], [110, 2000, 6000], [180, 4000, 6000], [250, 1000, 6000], [300, 3000, 6000]]
const EMBERS: readonly Mote[] = [[60, 0, 6000], [150, 2500, 6000], [260, 4500, 6000]]

function Bricks({ fill, rows, top = 0 }: { fill: string; rows: number; top?: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, row) => (
        <g key={row}>
          <rect y={top + row * 10 + 9} width="340" height="1" fill={fill} />
          {Array.from({ length: 12 }, (_, col) => (
            <rect key={col} x={col * 30 + (row % 2) * 15} y={top + row * 10} width="1" height="10" fill={fill} />
          ))}
        </g>
      ))}
    </>
  )
}

function Ruins() {
  return (
    <>
      <rect width="340" height="200" fill={RPG.ruinsFloor} />
      <rect width="340" height="70" fill={RPG.ruinsPath} />
      <Bricks fill={RPG.ruinsWall} rows={7} />
      <rect y="70" width="340" height="3" fill={RPG.ruinsWall} />
      <path d="M140 200 V130 a30 30 0 0 1 60 0 V200 Z" fill={RPG.ruinsPath} />
      <rect x="20" y="150" width="70" height="20" fill={RPG.leafDark} />
      <rect x="250" y="150" width="70" height="20" fill={RPG.leafDark} />
      <Falling motes={LEAVES} fill={RPG.leaf} size={3} />
    </>
  )
}

function Snow() {
  const trees = [0, 40, 80, 120, 160, 200, 240, 280, 320]
  return (
    <>
      <rect width="340" height="200" fill={RPG.snow} />
      <rect width="340" height="60" fill={RPG.pine} />
      {trees.map((x) => (
        <g key={x}>
          <path d={`M${x + 20} 10 L${x + 40} 70 H${x} Z`} fill={RPG.pineLit} />
          <path d={`M${x + 20} 10 L${x + 28} 34 H${x + 12} Z`} fill={RPG.snowCap} />
        </g>
      ))}
      <rect y="120" width="340" height="40" fill={RPG.snowShade} />
      <Falling motes={FLAKES} fill={RPG.snowCap} size={2} />
    </>
  )
}

function Water() {
  return (
    <>
      <rect width="340" height="200" fill={RPG.waterFloor} />
      <rect width="340" height="80" fill={RPG.waterWall} />
      {[12, 28, 44, 60].map((y) => (
        <path key={y} d={`M0 ${y} q10 -4 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0`} fill="none" stroke={RPG.waterLine} strokeWidth="1" />
      ))}
      <rect y="150" width="340" height="50" fill={RPG.void} />
      {[160, 172, 184].map((y) => (
        <path key={y} d={`M0 ${y} q10 -3 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0`} fill="none" stroke={RPG.waterWall} strokeWidth="1" />
      ))}
      <rect x="60" y="20" width="24" height="10" fill={RPG.glow} opacity="0.6" className={rooms.flicker} />
      <rect x="250" y="20" width="24" height="10" fill={RPG.glow} opacity="0.6" />
      <g transform="translate(0 150)">
        <Falling motes={GLOW} fill={RPG.glow} size={2} className={rooms.rises} />
      </g>
      <g transform="translate(20 140)">
        <Falling motes={GLOW.slice(0, 3)} fill={RPG.glowPink} size={2} className={rooms.rises} />
      </g>
    </>
  )
}

function Heat() {
  return (
    <>
      <rect width="340" height="200" fill={RPG.heatGround} />
      <rect width="340" height="30" fill={RPG.slate} />
      <rect y="30" width="340" height="40" fill={RPG.heatRock} />
      <Bricks fill={RPG.heatDeep} rows={4} top={30} />
      <rect y="160" width="340" height="40" fill={RPG.heatDeep} />
      <rect y="166" width="340" height="12" fill={RPG.lava} className={rooms.flicker} />
      <rect y="170" width="340" height="3" fill={RPG.lavaCore} />
      <g transform="translate(0 160)">
        <Falling motes={EMBERS} fill={RPG.lavaCore} size={2} className={rooms.rises} />
      </g>
    </>
  )
}

function Town() {
  const fronts = [0, 90, 180, 270]
  return (
    <>
      <rect width="340" height="200" fill={RPG.townGrass} />
      <rect width="340" height="40" fill={RPG.sky} />
      {fronts.map((x) => (
        <g key={x}>
          <rect x={x + 6} y="28" width="80" height="10" fill={RPG.townRoof} />
          <rect x={x + 10} y="38" width="72" height="52" fill={RPG.townWall} />
          <rect x={x + 20} y="50" width="14" height="14" fill={RPG.townMint} />
          <rect x={x + 58} y="50" width="14" height="14" fill={RPG.townMint} />
        </g>
      ))}
      <rect y="120" width="340" height="24" fill={RPG.borderShade} />
      <rect y="131" width="340" height="2" fill={RPG.townWall} />
      <g className={rooms.taxi}>
        <rect x="0" y="122" width="30" height="10" fill={RPG.taxi} />
        <rect x="7" y="116" width="16" height="7" fill={RPG.taxi} />
      </g>
    </>
  )
}

const ART: Record<Zone, () => ReactNode> = { ruins: Ruins, snow: Snow, water: Water, heat: Heat, town: Town }

export const Overworld = memo(function Overworld({ zone }: { zone: Zone }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-[color:var(--rpg-void)]" aria-hidden="true">
      {ZONES.map((id) => {
        const Art = ART[id]
        const active = id === zone
        return (
          <svg
            key={id}
            viewBox="0 0 320 180"
            preserveAspectRatio="xMidYMid slice"
            className={`absolute inset-0 h-full w-full ${rooms.zone} ${active ? 'opacity-100' : 'opacity-0'}`}
            data-active={active}
            shapeRendering="crispEdges"
            focusable="false"
          >
            <Art />
          </svg>
        )
      })}
      <div className="absolute inset-0 bg-[color:var(--rpg-void)] opacity-50" />
    </div>
  )
})
