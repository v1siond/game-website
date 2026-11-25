import type { ComponentType, ReactNode } from 'react'
import { RPG } from './palette'

// The six places of the run in the game's order, each as the layers of a scene's stage (stage.tsx): the
// ruins (a violet brick wall, its broken columns and arch, red leaves on the flagstones), the snow forest
// (pines, the log houses, the drifts), the dark marsh cave (the rock strata, the glowing crystal clusters,
// the stalagmites, the rock floor), the hot lab country (the cones and their smoke, the basalt shelf, the lava
// channel), the grey royal city (its tall windows, columns and capsules, the wall of light at its end) and the
// surface at sunset (the sky, the far hills, the cliff he climbs out onto). Every layer is drawn
// on the genre's 320 by 180 grid of hard pixels and blown up to the 1440 by 810 canvas, so a pixel is 4.5
// canvas units and the art stays crisp at any width.

export const VIEW = '0 0 1440 810'

/** A phone's view: the room from above the doors down past the floor, its top on the screen's top, so the floor
 *  sits about half way down the screen and stays clear of the cards when a scene ends; below the picture the
 *  floor's colour runs on under the cards. */
export const PHONE_VIEW = '0 360 1440 620'

/** The picture's bottom, where the floor's colour takes over on a phone. */
export const PICTURE_BOTTOM = 810

/** One grid pixel in canvas units. */
export const PX = 4.5

export type Zone = 'ruins' | 'snow' | 'cave' | 'volcano' | 'royal' | 'surface'

export interface ZoneArt {
  sky: ComponentType
  far: ComponentType
  mid: ComponentType
  near: ComponentType
  /** The floor's colour, carried on below the picture where a phone's view reaches past it. */
  floor: string
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

// ---------------------------------------------------------------- the royal city and the barrier

const WINDOWS = [24, 88, 152, 216, 280]

function RoyalSky() {
  return (
    <Grid>
      <rect width="320" height="180" fill={RPG.royalSky} />
      {WINDOWS.map((x) => (
        <g key={x}>
          <rect x={x} y="14" width="16" height="70" fill={RPG.royalDark} />
          <rect x={x + 2} y="16" width="12" height="66" fill={RPG.barrier} opacity={0.16} />
          <path d={`M${x} 14 a8 8 0 0 1 16 0 Z`} fill={RPG.royalDark} />
        </g>
      ))}
    </Grid>
  )
}

function RoyalFar() {
  return (
    <Grid>
      {[8, 72, 136, 200, 264].map((x) => (
        <g key={x}>
          <rect x={x} y="12" width="8" height="104" fill={RPG.royalWall} />
          <rect x={x - 2} y="10" width="12" height="4" fill={RPG.royalLit} />
          <rect x={x + 6} y="14" width="2" height="102" fill={RPG.royalDark} />
        </g>
      ))}
      <rect x="296" y="0" width="24" height="124" fill={RPG.barrier} opacity={0.7} />
      <rect x="292" y="0" width="4" height="124" fill={RPG.barrier} opacity={0.35} />
    </Grid>
  )
}

function RoyalMid() {
  return (
    <Grid>
      {[40, 104, 168, 232].map((x) => (
        <g key={x}>
          <rect x={x} y="94" width="14" height="22" fill={RPG.royalDark} />
          <rect x={x + 3} y="98" width="8" height="12" fill={RPG.royalLit} opacity={0.6} />
        </g>
      ))}
      <rect y="116" width="320" height="3" fill={RPG.royalDark} />
    </Grid>
  )
}

function RoyalNear() {
  return (
    <Grid>
      <rect y="119" width="320" height="61" fill={RPG.royalWall} />
      {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300].map((x) => (
        <rect key={x} x={x} y="119" width="1" height="61" fill={RPG.royalDark} />
      ))}
      {[134, 152, 170].map((y) => (
        <rect key={y} y={y} width="320" height="1" fill={RPG.royalDark} />
      ))}
    </Grid>
  )
}

// ---------------------------------------------------------------- the surface at sunset

function SurfaceSky() {
  return (
    <Grid>
      <rect width="320" height="180" fill={RPG.sunsetLow} />
      <rect width="320" height="70" fill={RPG.sunsetMid} />
      <rect width="320" height="34" fill={RPG.sunsetHigh} />
      <rect x="226" y="88" width="24" height="12" fill={RPG.gold} />
      <rect x="222" y="92" width="32" height="6" fill={RPG.gold} />
    </Grid>
  )
}

function SurfaceFar() {
  return (
    <Grid>
      <path d="M0 108 L40 86 L76 100 L120 78 L168 98 L212 84 L262 100 L320 88 V120 H0 Z" fill={RPG.sunsetHigh} />
      <path d="M0 118 L60 104 L130 114 L200 102 L270 112 L320 106 V124 H0 Z" fill={RPG.hillFar} />
    </Grid>
  )
}

function SurfaceMid() {
  return (
    <Grid>
      <rect y="124" width="320" height="56" fill={RPG.cliff} />
      <rect y="124" width="320" height="4" fill={RPG.duskGrass} />
    </Grid>
  )
}

function SurfaceNear() {
  return (
    <Grid>
      {[146, 160, 172].map((y) => (
        <rect key={y} y={y} width="320" height="1" fill={RPG.cliffLit} />
      ))}
      {[[12, 130], [70, 136], [150, 132], [236, 138], [300, 131]].map(([x, y]) => (
        <rect key={x} x={x} y={y} width="6" height="2" fill={RPG.duskGrass} />
      ))}
    </Grid>
  )
}

export const ZONE_ART: Record<Zone, ZoneArt> = {
  ruins: { sky: RuinsSky, far: RuinsFar, mid: RuinsMid, near: RuinsNear, floor: RPG.stone },
  snow: { sky: SnowSky, far: SnowFar, mid: SnowMid, near: SnowNear, floor: RPG.snow },
  cave: { sky: CaveSky, far: CaveFar, mid: CaveMid, near: CaveNear, floor: RPG.caveFloor },
  volcano: { sky: VolcanoSky, far: VolcanoFar, mid: VolcanoMid, near: VolcanoNear, floor: RPG.basalt },
  royal: { sky: RoyalSky, far: RoyalFar, mid: RoyalMid, near: RoyalNear, floor: RPG.royalWall },
  surface: { sky: SurfaceSky, far: SurfaceFar, mid: SurfaceMid, near: SurfaceNear, floor: RPG.cliff },
}
