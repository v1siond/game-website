import type { ComponentType, ReactNode } from 'react'
import { RPG } from './palette'

// The five places of the walk underground, each as the layers of a scene's stage (stage.tsx): the violet
// ruins (brick wall, the light from above, red leaves on the tiles), the snow (pines and their caps, a
// wooden fence, the drifts), the navy waterfall (the wall's ripples, the glowing crystals, the reeds, the
// dock over black water), the heat zone (the slate vault, the red rock and its pipes, the lava channel) and
// the pastel town (sky, the house fronts, the lamps, the lawn and the road). Every layer is drawn on the
// game's own 320 by 180 grid of hard pixels and blown up to the 1440 by 810 canvas, so a pixel is 4.5
// canvas units and the art stays crisp at any width.

export const VIEW = '0 0 1440 810'

/** One grid pixel in canvas units. */
export const PX = 4.5

export type Zone = 'ruins' | 'snow' | 'water' | 'heat' | 'town'

export interface ZoneArt {
  sky: ComponentType
  far: ComponentType
  mid: ComponentType
  near: ComponentType
}

/** The ground line his feet stand on in every place, on the grid. */
export const GROUND_PX = 150

/** The same line in canvas units. */
export const GROUND = GROUND_PX * PX

/** A layer's art on the grid, blown up to the canvas. */
const Grid = ({ children }: { children: ReactNode }) => <g transform={`scale(${PX})`}>{children}</g>

const COLS = Array.from({ length: 12 }, (_, i) => i)

function Bricks({ fill, rows, top = 0, size = 10 }: { fill: string; rows: number; top?: number; size?: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, row) => (
        <g key={row}>
          <rect y={top + row * size + size - 1} width="320" height="1" fill={fill} />
          {COLS.map((col) => (
            <rect key={col} x={col * 30 + (row % 2) * 15} y={top + row * size} width="1" height={size} fill={fill} />
          ))}
        </g>
      ))}
    </>
  )
}

// ---------------------------------------------------------------- the ruins

function RuinsSky() {
  return (
    <Grid>
      <rect width="320" height="180" fill={RPG.ruinsFloor} />
      <rect width="320" height="112" fill={RPG.wall} />
      <rect width="320" height="56" fill={RPG.wallLit} />
      <Bricks fill={RPG.mortar} rows={7} size={16} />
    </Grid>
  )
}

function RuinsFar() {
  return (
    <Grid>
      {[44, 248].map((x) => (
        <g key={x}>
          <rect x={x} y="20" width="28" height="92" fill={RPG.ruinsWall} />
          <rect x={x - 4} y="16" width="36" height="6" fill={RPG.ruinsPath} />
          <rect x={x + 4} y="30" width="2" height="76" fill={RPG.mortar} />
        </g>
      ))}
      <path d="M140 112 V64 a20 20 0 0 1 40 0 V112 Z" fill={RPG.mortar} />
    </Grid>
  )
}

function RuinsMid() {
  return (
    <Grid>
      <polygon points="128,0 192,0 232,180 88,180" fill={RPG.beam} opacity="0.18" />
      <rect y="112" width="320" height="3" fill={RPG.ruinsWall} />
    </Grid>
  )
}

const LEAVES: ReadonlyArray<readonly [number, number]> = [[18, 160], [40, 166], [66, 158], [250, 162], [276, 168], [300, 158], [120, 172], [200, 174]]

function RuinsNear() {
  return (
    <Grid>
      <rect y="115" width="320" height="65" fill={RPG.ruinsFloor} />
      {[128, 140, 156, 176].map((y) => (
        <rect key={y} y={y} width="320" height="1" fill={RPG.ruinsWall} />
      ))}
      <rect x="10" y="154" width="70" height="16" fill={RPG.leafDark} />
      <rect x="240" y="154" width="70" height="16" fill={RPG.leafDark} />
      {LEAVES.map(([x, y]) => (
        <rect key={x} x={x} y={y} width="3" height="2" fill={RPG.leaf} />
      ))}
    </Grid>
  )
}

// ---------------------------------------------------------------- the snow

const PINES = [0, 40, 80, 120, 160, 200, 240, 280]

function SnowSky() {
  return (
    <Grid>
      <rect width="320" height="180" fill={RPG.snowShade} />
      <rect width="320" height="70" fill={RPG.pine} />
    </Grid>
  )
}

function SnowFar() {
  return (
    <Grid>
      {PINES.map((x) => (
        <g key={x}>
          <path d={`M${x + 20} 6 L${x + 42} 96 H${x - 2} Z`} fill={RPG.pineLit} />
          <path d={`M${x + 20} 6 L${x + 28} 34 H${x + 12} Z`} fill={RPG.snowCap} />
          <rect x={x + 18} y="96" width="4" height="10" fill={RPG.woodDark} />
        </g>
      ))}
    </Grid>
  )
}

function SnowMid() {
  return (
    <Grid>
      <rect y="112" width="320" height="3" fill={RPG.woodDark} />
      <rect y="120" width="320" height="2" fill={RPG.woodDark} />
      {COLS.map((col) => (
        <rect key={col} x={col * 30 + 4} y="106" width="4" height="20" fill={RPG.wood} />
      ))}
    </Grid>
  )
}

function SnowNear() {
  return (
    <Grid>
      <rect y="126" width="320" height="54" fill={RPG.snow} />
      <rect y="126" width="320" height="2" fill={RPG.snowCap} />
      {[[30, 168, 40], [150, 172, 60], [250, 166, 46]].map(([x, y, w]) => (
        <rect key={x} x={x} y={y} width={w} height="3" fill={RPG.snowCap} />
      ))}
    </Grid>
  )
}

// ---------------------------------------------------------------- the waterfall

const RIPPLES = 'q10 -4 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0'
const CRYSTALS: ReadonlyArray<readonly [number, number]> = [[24, 18], [70, 40], [112, 12], [176, 30], [220, 14], [262, 44], [300, 22]]

function WaterSky() {
  return (
    <Grid>
      <rect width="320" height="180" fill={RPG.waterFloor} />
      <rect width="320" height="120" fill={RPG.waterWall} />
      {[14, 30, 46, 62, 78, 94].map((y) => (
        <path key={y} d={`M0 ${y} ${RIPPLES}`} fill="none" stroke={RPG.waterLine} strokeWidth="1" />
      ))}
    </Grid>
  )
}

function WaterFar() {
  return (
    <Grid>
      {CRYSTALS.map(([x, y]) => (
        <g key={x}>
          <rect x={x} y={y} width="2" height="2" fill={RPG.glow} />
          <rect x={x - 1} y={y + 1} width="4" height="1" fill={RPG.glow} opacity="0.5" />
        </g>
      ))}
      <rect x="130" y="0" width="22" height="120" fill={RPG.waterLine} />
      {[8, 26, 44, 62, 80, 98].map((y) => (
        <rect key={y} x="134" y={y} width="2" height="10" fill={RPG.glow} opacity="0.6" />
      ))}
    </Grid>
  )
}

function WaterMid() {
  return (
    <Grid>
      {[6, 18, 92, 104, 210, 224, 290, 304].map((x, i) => (
        <rect key={x} x={x} y={92 + (i % 2) * 6} width="3" height={34 - (i % 2) * 6} fill={RPG.waterLine} />
      ))}
    </Grid>
  )
}

function WaterNear() {
  return (
    <Grid>
      <rect y="126" width="320" height="30" fill={RPG.wood} />
      {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300].map((x) => (
        <rect key={x} x={x} y="126" width="1" height="30" fill={RPG.woodDark} />
      ))}
      <rect y="156" width="320" height="24" fill={RPG.void} />
      {[162, 170].map((y) => (
        <path key={y} d={`M0 ${y} ${RIPPLES}`} fill="none" stroke={RPG.waterWall} strokeWidth="1" />
      ))}
    </Grid>
  )
}

// ---------------------------------------------------------------- the heat zone

function HeatSky() {
  return (
    <Grid>
      <rect width="320" height="180" fill={RPG.heatGround} />
      <rect width="320" height="40" fill={RPG.slate} />
      <rect y="40" width="320" height="80" fill={RPG.heatRock} />
      <Bricks fill={RPG.heatDeep} rows={8} top={40} />
    </Grid>
  )
}

function HeatFar() {
  return (
    <Grid>
      {[60, 200].map((x) => (
        <g key={x}>
          <rect x={x} y="0" width="10" height="120" fill={RPG.slate} />
          <rect x={x - 2} y="56" width="14" height="4" fill={RPG.heatDeep} />
        </g>
      ))}
      <rect y="24" width="320" height="6" fill={RPG.heatDeep} />
    </Grid>
  )
}

function HeatMid() {
  return (
    <Grid>
      <rect y="118" width="320" height="4" fill={RPG.heatDeep} />
    </Grid>
  )
}

function HeatNear() {
  return (
    <Grid>
      <rect y="122" width="320" height="40" fill={RPG.heatGround} />
      <rect y="162" width="320" height="18" fill={RPG.heatDeep} />
      <rect y="166" width="320" height="8" fill={RPG.lava} />
      <rect y="169" width="320" height="2" fill={RPG.lavaCore} />
    </Grid>
  )
}

// ---------------------------------------------------------------- the town

const FRONTS = [0, 90, 180, 270]

function TownSky() {
  return (
    <Grid>
      <rect width="320" height="180" fill={RPG.townGrass} />
      <rect width="320" height="60" fill={RPG.sky} />
    </Grid>
  )
}

function TownFar() {
  return (
    <Grid>
      {FRONTS.map((x) => (
        <g key={x}>
          <rect x={x + 6} y="34" width="80" height="10" fill={RPG.townRoof} />
          <rect x={x + 10} y="44" width="72" height="72" fill={RPG.townWall} />
          <rect x={x + 20} y="58" width="14" height="14" fill={RPG.townMint} />
          <rect x={x + 58} y="58" width="14" height="14" fill={RPG.townMint} />
          <rect x={x + 38} y="88" width="16" height="28" fill={RPG.townRoof} />
        </g>
      ))}
    </Grid>
  )
}

function TownMid() {
  return (
    <Grid>
      {[84, 174, 264].map((x) => (
        <g key={x}>
          <rect x={x} y="80" width="2" height="44" fill={RPG.borderShade} />
          <rect x={x - 2} y="76" width="6" height="5" fill={RPG.gold} />
        </g>
      ))}
    </Grid>
  )
}

function TownNear() {
  return (
    <Grid>
      <rect y="124" width="320" height="56" fill={RPG.townGrass} />
      <rect y="160" width="320" height="20" fill={RPG.borderShade} />
      <rect y="169" width="320" height="2" fill={RPG.townWall} />
    </Grid>
  )
}

export const ZONE_ART: Record<Zone, ZoneArt> = {
  ruins: { sky: RuinsSky, far: RuinsFar, mid: RuinsMid, near: RuinsNear },
  snow: { sky: SnowSky, far: SnowFar, mid: SnowMid, near: SnowNear },
  water: { sky: WaterSky, far: WaterFar, mid: WaterMid, near: WaterNear },
  heat: { sky: HeatSky, far: HeatFar, mid: HeatMid, near: HeatNear },
  town: { sky: TownSky, far: TownFar, mid: TownMid, near: TownNear },
}
