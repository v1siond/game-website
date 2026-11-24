import { TRAIL } from '../palette'

// The level's things he hits and passes, drawn the way the 16 bit games draw them: square blocks with a
// black outline and a light top left bevel, the plain item box and the box once open, the cave's and the
// fortress's bricks, the coin seen side on, the drum and the note, the filled blocks of the note row and
// the switch palace, and the trees and rocks of the path. Each is a group drawn in its own small box from
// the origin (a block is 24 by 24), which a scene places and scales on its canvas (kit.tsx).

const OUTLINE = { stroke: TRAIL.HUD, strokeWidth: 2 }

/** The item box: a plain gold box with its lid seam and latch. */
export function ItemBox() {
  return (
    <>
      <rect x={1} y={1} width={22} height={22} rx={2} fill={TRAIL.BLOCK} {...OUTLINE} />
      <path d="M3 3 H21 V5 H5 V21 H3 Z" fill={TRAIL.PAGE} opacity={0.55} />
      <rect x={2} y={8} width={20} height={3} fill={TRAIL.BLOCK_DARK} />
      <rect x={10} y={7} width={4} height={7} rx={1} fill={TRAIL.HUD} />
    </>
  )
}

/** The item box once open: its lid tipped back off the top, its dark inside showing. */
export function OpenBox() {
  return (
    <>
      <rect x={1} y={9} width={22} height={14} rx={2} fill={TRAIL.BLOCK} {...OUTLINE} />
      <rect x={3} y={10} width={18} height={4} fill={TRAIL.BOX_INSIDE} />
      <path d="M3 12 H5 V21 H3 Z" fill={TRAIL.PAGE} opacity={0.55} />
      <g transform="rotate(-28 1 9)">
        <rect x={1} y={2} width={22} height={7} rx={2} fill={TRAIL.BLOCK} {...OUTLINE} />
        <rect x={10} y={6} width={4} height={3} fill={TRAIL.HUD} />
      </g>
    </>
  )
}

/** A teal brick of the underground room. */
export function CaveBrick() {
  return (
    <>
      <rect x={1} y={1} width={22} height={22} fill={TRAIL.CAVE_BRICK} {...OUTLINE} />
      <path d="M2 8 H22 M2 15 H22 M8 2 V8 M16 8 V15 M8 15 V22" stroke={TRAIL.CAVE_BRICK_DARK} strokeWidth={2} />
    </>
  )
}

/** A gold fortress block. */
export function GoldBlock() {
  return (
    <>
      <rect x={1} y={1} width={22} height={22} fill={TRAIL.FORT_GOLD} {...OUTLINE} />
      <path d="M3 3 H21 V6 H6 V21 H3 Z" fill={TRAIL.PAGE} opacity={0.35} />
      <path d="M21 6 V21 H6" stroke={TRAIL.FORT_GOLD_DARK} strokeWidth={3} fill="none" />
    </>
  )
}

/** The coin seen side on, 10 by 14. */
export function Coin() {
  return (
    <>
      <rect x={1} y={0.5} width={8} height={13} rx={4} fill={TRAIL.COIN} stroke={TRAIL.HUD} strokeWidth={1} />
      <rect x={4} y={3} width={2} height={8} fill={TRAIL.BLOCK_DARK} />
      <rect x={2.5} y={2.5} width={1} height={4} fill={TRAIL.PAGE} />
    </>
  )
}

/** The drum he bounces on, 24 wide and 18 tall from the origin: its white head on a red shell with gold hoops. */
export function DrumPad() {
  return (
    <>
      <rect x={2} y={4} width={20} height={14} fill={TRAIL.ROUTE} {...OUTLINE} />
      <path d="M2 8 H22 M2 15 H22" stroke={TRAIL.GOLD} strokeWidth={2} />
      <path d="M5 8 L9 15 L13 8 L17 15 L21 8" stroke={TRAIL.PAGE} strokeWidth={1} fill="none" opacity={0.7} />
      <ellipse cx={12} cy={4} rx={11} ry={3} fill={TRAIL.PAGE} {...OUTLINE} />
    </>
  )
}

/** A musical note, 12 by 14, sent up by each bounce. */
export function Note() {
  return <path d="M5 1 H11 V4 H7 V11 A3 2.6 0 1 1 5 8.6 Z" fill={TRAIL.COIN} stroke={TRAIL.HUD} strokeWidth={1} />
}

export function FilledBlock({ fill }: { fill: string }) {
  return (
    <>
      <rect x={1} y={1} width={22} height={22} rx={2} fill={fill} {...OUTLINE} />
      <path d="M3 3 H21 V5 H5 V21 H3 Z" fill={TRAIL.PAGE} opacity={0.45} />
    </>
  )
}

/** A round leafy tree, 40 wide and 56 tall, its foot at the bottom centre (20, 56). */
export function Tree() {
  return (
    <>
      <rect x={17} y={34} width={6} height={22} fill={TRAIL.BARK} stroke={TRAIL.HUD} strokeWidth={1.5} />
      <circle cx={20} cy={22} r={18} fill={TRAIL.LEAF} stroke={TRAIL.LEAF_DARK} strokeWidth={2.5} />
      <circle cx={13} cy={16} r={5} fill={TRAIL.LEAF_LIGHT} opacity={0.7} />
    </>
  )
}

/** A rock, 32 wide and 18 tall, sitting on its bottom edge. */
export function Rock() {
  return (
    <>
      <path d="M1 18 L4 7 Q8 1 15 2 L24 3 Q30 6 31 18 Z" fill={TRAIL.STONE} stroke={TRAIL.STONE_DARK} strokeWidth={2} strokeLinejoin="round" />
      <path d="M7 8 Q11 4 16 5" stroke={TRAIL.STONE_LIGHT} strokeWidth={2} fill="none" strokeLinecap="round" />
    </>
  )
}
