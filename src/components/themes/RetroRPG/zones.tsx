import type { ComponentType, ReactNode } from 'react'
import { RPG } from './palette'

// The five places of the walk, each as the layers of a scene's stage (stage.tsx): the stone ruins (a grey
// green block wall, its broken columns and arch, moss on the flagstones), the snow town (pines, the log
// houses, the drifts), the crystal cave (the rock strata, the crystal clusters, the stalagmites, the rock
// floor), the volcano (the cones and their smoke, the basalt shelf, the lava channel) and the market town
// (sky, the timbered house fronts, the awnings of the stalls, the lawn and the road). Every layer is drawn
// on the genre's 320 by 180 grid of hard pixels and blown up to the 1440 by 810 canvas, so a pixel is 4.5
// canvas units and the art stays crisp at any width.

export const VIEW = '0 0 1440 810'

/** One grid pixel in canvas units. */
export const PX = 4.5

export type Zone = 'ruins' | 'snow' | 'cave' | 'volcano' | 'town'

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
      <rect width="320" height="180" fill={RPG.stoneDark} />
      <rect width="320" height="112" fill={RPG.stone} />
      <rect width="320" height="40" fill={RPG.stoneLit} />
      <Bricks fill={RPG.stoneDark} rows={7} size={16} />
    </Grid>
  )
}

function RuinsFar() {
  return (
    <Grid>
      {[44, 248].map((x, i) => (
        <g key={x}>
          <rect x={x} y={20 + i * 18} width="28" height={92 - i * 18} fill={RPG.stoneLit} />
          <rect x={x - 4} y={16 + i * 18} width="36" height="6" fill={RPG.stoneDark} />
          <rect x={x + 4} y={30 + i * 18} width="2" height={76 - i * 18} fill={RPG.stoneDark} />
        </g>
      ))}
      <path d="M140 112 V64 a20 20 0 0 1 40 0 V112 Z" fill={RPG.stoneDark} />
      <path d="M150 112 V70 a10 10 0 0 1 20 0 V112 Z" fill={RPG.void} />
    </Grid>
  )
}

function RuinsMid() {
  return (
    <Grid>
      {[[24, 104, 30], [120, 108, 22], [262, 102, 36]].map(([x, y, w]) => (
        <rect key={x} x={x} y={y} width={w} height="8" fill={RPG.moss} />
      ))}
      <rect y="112" width="320" height="3" fill={RPG.stoneDark} />
    </Grid>
  )
}

const TUFTS: ReadonlyArray<readonly [number, number]> = [[18, 160], [40, 166], [66, 158], [250, 162], [276, 168], [300, 158], [120, 172], [200, 174]]

function RuinsNear() {
  return (
    <Grid>
      <rect y="115" width="320" height="65" fill={RPG.stone} />
      {[128, 140, 156, 176].map((y) => (
        <rect key={y} y={y} width="320" height="1" fill={RPG.stoneDark} />
      ))}
      {TUFTS.map(([x, y]) => (
        <g key={x}>
          <rect x={x} y={y} width="5" height="2" fill={RPG.mossDark} />
          <rect x={x + 1} y={y - 1} width="3" height="1" fill={RPG.moss} />
        </g>
      ))}
    </Grid>
  )
}

// ---------------------------------------------------------------- the snow town

const PINES = [0, 120, 240]

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
          <path d={`M${x + 20} 10 L${x + 40} 96 H${x} Z`} fill={RPG.pineLit} />
          <rect x={x + 18} y="96" width="4" height="10" fill={RPG.woodDark} />
        </g>
      ))}
    </Grid>
  )
}

const HOUSES = [44, 164, 284]

function SnowMid() {
  return (
    <Grid>
      {HOUSES.map((x) => (
        <g key={x}>
          <path d={`M${x - 6} 78 L${x + 22} 62 L${x + 50} 78 Z`} fill={RPG.snowCap} />
          <rect x={x} y="78" width="44" height="46" fill={RPG.woodDark} />
          {[84, 92, 100, 108, 116].map((y) => (
            <rect key={y} x={x} y={y} width="44" height="1" fill={RPG.wood} />
          ))}
          <rect x={x + 6} y="88" width="10" height="9" fill={RPG.lavaCore} />
          <rect x={x + 26} y="96" width="12" height="28" fill={RPG.spriteLine} />
        </g>
      ))}
    </Grid>
  )
}

function SnowNear() {
  return (
    <Grid>
      <rect y="124" width="320" height="56" fill={RPG.snow} />
      <rect y="124" width="320" height="2" fill={RPG.snowCap} />
      {[[30, 168, 40], [150, 172, 60], [250, 166, 46]].map(([x, y, w]) => (
        <rect key={x} x={x} y={y} width={w} height="3" fill={RPG.snowCap} />
      ))}
    </Grid>
  )
}

// ---------------------------------------------------------------- the crystal cave

const CLUSTERS: ReadonlyArray<readonly [number, number, string]> = [
  [24, 60, RPG.crystal],
  [96, 40, RPG.crystalViolet],
  [182, 70, RPG.crystal],
  [250, 46, RPG.crystalViolet],
  [300, 76, RPG.crystal],
]

function CaveSky() {
  return (
    <Grid>
      <rect width="320" height="180" fill={RPG.caveFloor} />
      <rect width="320" height="120" fill={RPG.caveWall} />
      {[18, 44, 70, 96].map((y, i) => (
        <path key={y} d={`M0 ${y} L60 ${y + 4 - i} L130 ${y - 2} L210 ${y + 3} L320 ${y - 1}`} fill="none" stroke={RPG.caveLine} strokeWidth="2" />
      ))}
    </Grid>
  )
}

function CaveFar() {
  return (
    <Grid>
      {CLUSTERS.map(([x, y, fill]) => (
        <g key={x}>
          <path d={`M${x} ${y} L${x + 3} ${y - 12} L${x + 6} ${y} Z`} fill={fill} />
          <path d={`M${x + 5} ${y} L${x + 9} ${y - 18} L${x + 13} ${y} Z`} fill={fill} />
          <path d={`M${x + 12} ${y} L${x + 14} ${y - 8} L${x + 16} ${y} Z`} fill={fill} opacity="0.7" />
        </g>
      ))}
    </Grid>
  )
}

function CaveMid() {
  return (
    <Grid>
      {[10, 70, 150, 226, 296].map((x, i) => (
        <path key={x} d={`M${x} 124 L${x + 6} ${92 + (i % 2) * 10} L${x + 12} 124 Z`} fill={RPG.caveLine} />
      ))}
    </Grid>
  )
}

function CaveNear() {
  return (
    <Grid>
      <rect y="124" width="320" height="56" fill={RPG.caveFloor} />
      <rect y="124" width="320" height="2" fill={RPG.caveLine} />
      {[[20, 150], [90, 166], [170, 144], [240, 170], [292, 152]].map(([x, y]) => (
        <rect key={x} x={x} y={y} width="8" height="3" fill={RPG.caveLine} />
      ))}
    </Grid>
  )
}

// ---------------------------------------------------------------- the volcano

function VolcanoSky() {
  return (
    <Grid>
      <rect width="320" height="180" fill={RPG.basalt} />
      <rect width="320" height="60" fill={RPG.heatSky} />
      <rect y="60" width="320" height="30" fill={RPG.ash} />
    </Grid>
  )
}

function VolcanoFar() {
  return (
    <Grid>
      {[[70, 46], [230, 34]].map(([x, top]) => (
        <g key={x}>
          <path d={`M${x - 70} 120 L${x - 10} ${top} H${x + 10} L${x + 70} 120 Z`} fill={RPG.basaltLit} />
          <rect x={x - 8} y={top} width="16" height="3" fill={RPG.lava} />
          <rect x={x - 4} y={top - 14} width="8" height="6" fill={RPG.ash} />
          <rect x={x - 10} y={top - 26} width="12" height="6" fill={RPG.ash} opacity="0.7" />
        </g>
      ))}
    </Grid>
  )
}

function VolcanoMid() {
  return (
    <Grid>
      <rect y="118" width="320" height="4" fill={RPG.basaltLit} />
    </Grid>
  )
}

function VolcanoNear() {
  return (
    <Grid>
      <rect y="122" width="320" height="40" fill={RPG.basalt} />
      {[134, 148].map((y) => (
        <rect key={y} y={y} width="320" height="1" fill={RPG.basaltLit} />
      ))}
      <rect y="162" width="320" height="18" fill={RPG.basaltLit} />
      <rect y="166" width="320" height="8" fill={RPG.lava} />
      <rect y="169" width="320" height="2" fill={RPG.lavaCore} />
    </Grid>
  )
}

// ---------------------------------------------------------------- the market town

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
          <path d={`M${x + 4} 46 L${x + 46} 24 L${x + 88} 46 Z`} fill={RPG.townRoof} />
          <rect x={x + 10} y="46" width="72" height="70" fill={RPG.townWall} />
          <rect x={x + 10} y="46" width="72" height="2" fill={RPG.townBeam} />
          <rect x={x + 10} y="80" width="72" height="2" fill={RPG.townBeam} />
          <rect x={x + 10} y="46" width="2" height="70" fill={RPG.townBeam} />
          <rect x={x + 80} y="46" width="2" height="70" fill={RPG.townBeam} />
          <rect x={x + 22} y="56" width="12" height="14" fill={RPG.lavaCore} />
          <rect x={x + 58} y="56" width="12" height="14" fill={RPG.lavaCore} />
          <rect x={x + 38} y="88" width="16" height="28" fill={RPG.townBeam} />
        </g>
      ))}
    </Grid>
  )
}

function TownMid() {
  return (
    <Grid>
      {[60, 240].map((x) => (
        <g key={x}>
          <rect x={x} y="96" width="40" height="6" fill={RPG.awning} />
          {[0, 10, 20, 30].map((dx) => (
            <rect key={dx} x={x + dx} y="96" width="5" height="6" fill={RPG.townRoof} />
          ))}
          <rect x={x + 2} y="102" width="2" height="22" fill={RPG.townBeam} />
          <rect x={x + 36} y="102" width="2" height="22" fill={RPG.townBeam} />
          <rect x={x} y="114" width="40" height="4" fill={RPG.shopWood} />
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
  cave: { sky: CaveSky, far: CaveFar, mid: CaveMid, near: CaveNear },
  volcano: { sky: VolcanoSky, far: VolcanoFar, mid: VolcanoMid, near: VolcanoNear },
  town: { sky: TownSky, far: TownFar, mid: TownMid, near: TownNear },
}
