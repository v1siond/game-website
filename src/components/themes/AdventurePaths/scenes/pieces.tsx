import { TRAIL } from '../palette'

// The level's things he hits and passes, drawn the way the 16 bit games draw them: square blocks with a
// black outline and a light top left bevel, the plain item box and the box once open with what it held,
// the bricks, the spinning coin seen side on, the crate, the spring pad, the switch plate and the blocks it
// fills, the drum he lands on, the finish gate with its ribbon, and the trees, rocks, ladder and hatch of
// the path. Each is a group drawn in its own small box from the origin (a block is 24 by 24), which a
// scene places and scales on its canvas (kit.tsx).

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

export function Brick() {
  return (
    <>
      <rect x={1} y={1} width={22} height={22} fill={TRAIL.BRICK} {...OUTLINE} />
      <path d="M2 8 H22 M2 15 H22 M8 2 V8 M16 8 V15 M8 15 V22" stroke={TRAIL.BRICK_DARK} strokeWidth={2} />
      <path d="M2 2 H22" stroke={TRAIL.PAGE} strokeWidth={1} opacity={0.5} />
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

/** The switch plate, 28 wide, its top at y 0; the scene presses it down into its frame once he lands. */
export function SwitchPlate() {
  return <rect x={3} y={0} width={22} height={3} rx={1} fill={TRAIL.ROUTE} stroke={TRAIL.HUD} strokeWidth={1} />
}

/** The switch plate's frame round the plate, 28 wide from y 1 to 4. */
export function SwitchFrame() {
  return <rect x={1} y={2} width={26} height={2} fill={TRAIL.STONE_DARK} stroke={TRAIL.HUD} strokeWidth={1} />
}

/** A block the switch plate fills: its dotted outline, and the solid block in `fill` the scene fades in. */
export function OutlineBlock() {
  return <rect x={1.5} y={1.5} width={21} height={21} rx={2} fill="none" stroke={TRAIL.HUD} strokeWidth={1.5} strokeDasharray="3 2" />
}

export function FilledBlock({ fill }: { fill: string }) {
  return (
    <>
      <rect x={1} y={1} width={22} height={22} rx={2} fill={fill} {...OUTLINE} />
      <path d="M3 3 H21 V5 H5 V21 H3 Z" fill={TRAIL.PAGE} opacity={0.45} />
    </>
  )
}

/** The spring pad, 24 wide, its top at y 0 and its feet at y 12: a red pad on a coil the scene squashes. */
export function SpringPad() {
  return (
    <>
      <path d="M6 3 L18 5 L6 7 L18 9 L6 11" stroke={TRAIL.STONE_DARK} strokeWidth={2} fill="none" />
      <rect x={3} y={10} width={18} height={2} fill={TRAIL.STONE_DARK} stroke={TRAIL.HUD} strokeWidth={1} />
      <rect x={1} y={0} width={22} height={3} rx={1} fill={TRAIL.ROUTE} stroke={TRAIL.HUD} strokeWidth={1} />
    </>
  )
}

/** A wooden crate, 24 by 24: its plank frame and the brace across it. */
export function Crate() {
  return (
    <>
      <rect x={1} y={1} width={22} height={22} fill={TRAIL.CRATE} {...OUTLINE} />
      <rect x={3} y={3} width={18} height={18} fill="none" stroke={TRAIL.CRATE_DARK} strokeWidth={2} />
      <path d="M4 20 L20 4" stroke={TRAIL.CRATE_DARK} strokeWidth={3} />
      <path d="M3 3 H21" stroke={TRAIL.PAGE} strokeWidth={1} opacity={0.5} />
    </>
  )
}

/** The plain power-up an item box holds, a gem 16 by 18 drawn round its centre. */
export function PowerUp() {
  return (
    <>
      <path d="M-8 -3 L-4 -9 H4 L8 -3 L0 9 Z" fill={TRAIL.RUNE} stroke={TRAIL.HUD} strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M-4 -9 L-2 -3 H2 L4 -9 M-8 -3 H8 M-2 -3 L0 9 L2 -3" stroke={TRAIL.TEAL} strokeWidth={1} fill="none" />
      <path d="M-5 -4 L-3 -7" stroke={TRAIL.PAGE} strokeWidth={1.5} strokeLinecap="round" />
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

/** A ladder `rungs` rungs tall, 14 wide, from the origin down, 8 between rungs. */
export function Ladder({ rungs }: { rungs: number }) {
  const height = rungs * 8
  return (
    <>
      <path d={`M1 0 V${height} M13 0 V${height}`} stroke={TRAIL.WOOD} strokeWidth={2.5} />
      {Array.from({ length: rungs }, (_, i) => (
        <path key={i} d={`M1 ${4 + i * 8} H13`} stroke={TRAIL.WOOD_LIGHT} strokeWidth={2} />
      ))}
    </>
  )
}

/** The hatch in the ceiling the ladder comes down through, 28 wide, standing open. */
export function Hatch() {
  return (
    <>
      <rect x={0} y={0} width={28} height={4} fill={TRAIL.HUD} />
      <rect x={-2} y={-1} width={4} height={6} fill={TRAIL.WOOD} stroke={TRAIL.HUD} strokeWidth={1} />
      <rect x={-16} y={4} width={16} height={3} fill={TRAIL.WOOD} stroke={TRAIL.HUD} strokeWidth={1} transform="rotate(70 0 4)" />
    </>
  )
}

/** The finish gate, 70 wide and 64 tall from its left post's foot at (0, 64): two posts and the banner. */
export function FinishGate() {
  return (
    <>
      <rect x={0} y={6} width={6} height={58} fill={TRAIL.STONE_LIGHT} stroke={TRAIL.HUD} strokeWidth={1.5} />
      <rect x={64} y={6} width={6} height={58} fill={TRAIL.STONE_LIGHT} stroke={TRAIL.HUD} strokeWidth={1.5} />
      <rect x={-2} y={0} width={74} height={12} rx={2} fill={TRAIL.ROUTE} stroke={TRAIL.HUD} strokeWidth={1.5} />
      {[8, 20, 32, 44, 56].map((x, i) => (
        <rect key={x} x={x} y={3} width={6} height={6} fill={i % 2 === 0 ? TRAIL.PAGE : TRAIL.HUD} />
      ))}
    </>
  )
}

/** Half of the finish ribbon, `length` long from the post it is tied to, along +x. */
export function Ribbon({ length }: { length: number }) {
  return <rect x={0} y={-1.5} width={length} height={3} fill={TRAIL.GOLD} stroke={TRAIL.HUD} strokeWidth={0.75} />
}

/** A short flag on its pole, 16 wide and 30 tall from the pole's foot at the origin up. */
export function LedgeFlag() {
  return <rect x={0} y={-30} width={2} height={30} fill={TRAIL.STONE_DARK} />
}

export function Pennant() {
  return <path d="M2 0 L16 4 L2 8 Z" fill={TRAIL.ROUTE} stroke={TRAIL.HUD} strokeWidth={1} />
}

/** A burst: eight sparks round a hot centre, drawn round the origin, 34 across. */
export function Firework() {
  return (
    <>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <rect key={angle} x={-2} y={-16} width={4} height={8} fill={angle % 90 === 0 ? TRAIL.COIN : TRAIL.PAGE} transform={`rotate(${angle})`} />
      ))}
      <circle r={4} fill={TRAIL.COIN} />
    </>
  )
}
