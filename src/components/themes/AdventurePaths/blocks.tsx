import { TRAIL } from './palette'
import side from './side.module.css'

// The level's things he hits, drawn the way the 16 bit games draw them (research images 04, 09, 12, 21):
// square blocks with a black outline, a light top left bevel and four rivets, the ? block that turns
// to a used brown block once hit, the brick, the spinning coin seen side on, the note block, the switch
// he stomps flat, and the castle at the end of the course. All aria-hidden art.

const OUTLINE = { stroke: TRAIL.HUD, strokeWidth: 2 }

function Rivets({ fill }: { fill: string }) {
  return (
    <>
      {[
        [4, 4],
        [18, 4],
        [4, 18],
        [18, 18],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={2} height={2} fill={fill} />
      ))}
    </>
  )
}

/** The ? block, and under it the used block it turns into; the scene's CSS swaps them. */
export function QuestionBlock() {
  return (
    <svg viewBox="0 0 24 24" className="block h-full w-full" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      <g className={side.qMark}>
        <rect x={1} y={1} width={22} height={22} rx={2} fill={TRAIL.BLOCK} {...OUTLINE} />
        <path d="M3 3 H21 V5 H5 V21 H3 Z" fill={TRAIL.PAGE} opacity={0.55} />
        <path d="M9 7 H15 V8 H16 V11 H14 V12 H13 V14 H11 V11 H12 V10 H13 V9 H11 V10 H9 Z M11 15 H13 V17 H11 Z" fill={TRAIL.BLOCK_DARK} />
        <Rivets fill={TRAIL.BLOCK_DARK} />
      </g>
      <g className={side.qUsed}>
        <rect x={1} y={1} width={22} height={22} rx={2} fill={TRAIL.USED} {...OUTLINE} />
        <Rivets fill={TRAIL.HUD} />
      </g>
    </svg>
  )
}

export function Brick() {
  return (
    <svg viewBox="0 0 24 24" className="block h-full w-full" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      <rect x={1} y={1} width={22} height={22} fill={TRAIL.BRICK} {...OUTLINE} />
      <path d="M2 8 H22 M2 15 H22 M8 2 V8 M16 8 V15 M8 15 V22" stroke={TRAIL.BRICK_DARK} strokeWidth={2} />
      <path d="M2 2 H22" stroke={TRAIL.PAGE} strokeWidth={1} opacity={0.5} />
    </svg>
  )
}

export function Coin({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 10 14" className={className} shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      <rect x={1} y={0.5} width={8} height={13} rx={4} fill={TRAIL.COIN} stroke={TRAIL.HUD} strokeWidth={1} />
      <rect x={4} y={3} width={2} height={8} fill={TRAIL.BLOCK_DARK} />
      <rect x={2.5} y={2.5} width={1} height={4} fill={TRAIL.PAGE} />
    </svg>
  )
}

export function NoteBlock() {
  return (
    <svg viewBox="0 0 24 24" className="block h-full w-full" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      <rect x={1} y={1} width={22} height={22} rx={3} fill={TRAIL.PAGE} {...OUTLINE} />
      <path d="M3 3 H21 V5 H5 V21 H3 Z" fill={TRAIL.HUD} opacity={0.12} />
      <path d="M10 6 H17 V9 H12 V16 H10 Z M14 9 H17 V15 H14 Z" fill={TRAIL.HUD} />
      <rect x={7} y={14} width={5} height={4} rx={1} fill={TRAIL.HUD} />
      <rect x={12} y={13} width={5} height={4} rx={1} fill={TRAIL.HUD} />
    </svg>
  )
}

/** A musical note, sent up by each bounce. */
export function Note() {
  return (
    <svg viewBox="0 0 12 14" className="h-5 w-[18px]" aria-hidden="true" focusable="false">
      <path d="M5 1 H11 V4 H7 V11 A3 2.6 0 1 1 5 8.6 Z" fill={TRAIL.COIN} stroke={TRAIL.HUD} strokeWidth={1} />
    </svg>
  )
}

/** The switch he stomps: a blue block with its P stud, squashed flat once pressed (bigCap). */
export function BigSwitch() {
  return (
    <svg viewBox="0 0 28 22" className="block h-full w-full overflow-visible" aria-hidden="true" focusable="false">
      <rect x={1} y={19} width={26} height={3} fill={TRAIL.STONE_DARK} stroke={TRAIL.HUD} strokeWidth={1} />
      <g className={side.bigCap}>
        <path d="M3 19 V8 Q3 3 8 3 H20 Q25 3 25 8 V19 Z" fill={TRAIL.BLUE} stroke={TRAIL.HUD} strokeWidth={2} />
        <path d="M6 7 H12" stroke={TRAIL.PAGE} strokeWidth={2} strokeLinecap="round" opacity={0.7} />
        <path d="M11 8 H16 Q19 8 19 11 Q19 14 16 14 H13 V17 H11 Z M13 10 V12 H16 Q17 12 17 11 Q17 10 16 10 Z" fill={TRAIL.PAGE} fillRule="evenodd" />
      </g>
    </svg>
  )
}

/** The castle at the end of the course, with its dark doorway. */
export function Castle() {
  return (
    <svg viewBox="0 0 64 64" className="block h-full w-full" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      <path d="M8 64 V28 H14 V22 H20 V28 H26 V22 H32 V28 H38 V22 H44 V28 H50 V22 H56 V28 V64 Z" fill={TRAIL.BRICK} stroke={TRAIL.HUD} strokeWidth={2} />
      <path d="M18 28 V10 H22 V6 H28 V10 H34 V6 H40 V10 H46 V28" fill={TRAIL.BRICK} stroke={TRAIL.HUD} strokeWidth={2} />
      <path d="M10 36 H54 M10 46 H54 M10 56 H54 M20 28 V36 M36 28 V36 M28 36 V46 M44 36 V46 M20 46 V56 M36 46 V56" stroke={TRAIL.BRICK_DARK} strokeWidth={1.5} />
      <path d="M25 64 V50 Q32 42 39 50 V64 Z" fill={TRAIL.HUD} />
      <rect x={24} y={14} width={4} height={8} fill={TRAIL.HUD} />
      <rect x={36} y={14} width={4} height={8} fill={TRAIL.HUD} />
    </svg>
  )
}

/** A burst over the castle: eight sparks round a hot centre. */
export function Firework() {
  return (
    <svg viewBox="-17 -17 34 34" className="block h-full w-full" aria-hidden="true" focusable="false">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <rect key={angle} x={-2} y={-16} width={4} height={8} fill={angle % 90 === 0 ? TRAIL.COIN : TRAIL.PAGE} transform={`rotate(${angle})`} />
      ))}
      <circle r={4} fill={TRAIL.COIN} />
    </svg>
  )
}
