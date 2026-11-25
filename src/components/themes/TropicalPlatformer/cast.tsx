import type { ReactNode } from 'react'
import { COLORS as C } from './palette'
import { Beetle, Shadow } from './props'

// The run's cast and its things, our own, drawn as the props are (props.tsx): rendered volumes in the shared
// gradients, lit from the upper right, a dark edge. The pirate toad captain and his beetle crew, the mango
// store they steal, his treehouse and the cave under it, the giant eel of the cold lake, the lantern beetle
// and the bat of the dark cave, the burning drums of the factory, the save barrel and the hut. Each stands on
// its own 0 0 unless said; moving parts are data-fx groups its place turns about a stated point. Nothing here
// is a character, name or object of the game it evokes.

const EDGE = C.shadow
const LINE = { stroke: EDGE, strokeWidth: 3, strokeLinejoin: 'round' as const }

export const MANGO = { light: '#ffd25a', mid: '#f08a2a', dark: '#b8321e', leaf: '#3f8a2a' }

/** A mango, its middle on 0 0, `size` 1 about 40 long. */
export function Mango({ size = 1 }: { size?: number }) {
  return (
    <g transform={`scale(${size})`}>
      <ellipse rx={22} ry={17} fill={MANGO.mid} {...LINE} />
      <ellipse cx={6} cy={-5} rx={11} ry={7} fill={MANGO.light} opacity={0.8} />
      <path d="M-14 8 Q0 16 16 6" fill="none" stroke={MANGO.dark} strokeWidth={4} strokeLinecap="round" opacity={0.6} />
      <path d="M-18 -10 Q-26 -26 -10 -24 Q-14 -16 -18 -10 Z" fill={MANGO.leaf} {...LINE} strokeWidth={2} />
    </g>
  )
}

/** A crate of the mango store, 80 wide, mangoes heaped over its rim. */
export function MangoCrate() {
  return (
    <g>
      <Shadow width={100} />
      <rect x={-40} y={-56} width={80} height={56} rx={3} fill="url(#tp-wood)" {...LINE} />
      <path d="M-40 -30 H40 M-14 -56 V0 M14 -56 V0" stroke={C.woodDark} strokeWidth={4} />
      <g transform="translate(-20 -62)">
        <Mango size={0.7} />
      </g>
      <g transform="translate(6 -66)">
        <Mango size={0.75} />
      </g>
      <g transform="translate(26 -60)">
        <Mango size={0.65} />
      </g>
    </g>
  )
}

/** A beetle of the captain's crew up on its hind legs, a crate of the store on its back, walking right. */
export function Carrier() {
  return (
    <g>
      <g transform="scale(-1 1)">
        <Beetle />
      </g>
      <g transform="translate(-4 -38) rotate(8) scale(0.7)">
        <MangoCrate />
      </g>
    </g>
  )
}

/** His treehouse: a thick trunk, the plank hut on its platform with the door on its left (`door`, hinged at
 *  its left edge), the porch, and under the roots the store cave, its mouth from x 110 to 250. */
export function Treehouse({ children }: { children?: ReactNode }) {
  return (
    <g>
      <path d="M150 0 Q160 -160 170 -330 L230 -330 Q240 -160 260 0 Z" fill="url(#tp-wood)" {...LINE} />
      <path d="M80 0 Q130 -40 150 -10 M330 0 Q280 -40 258 -10" fill="none" stroke={C.bark} strokeWidth={22} strokeLinecap="round" />
      {/* the store cave under the roots */}
      <path d="M110 0 Q110 -120 180 -126 Q250 -120 250 0 Z" fill={C.shadow} {...LINE} />
      {children}
      <rect x={60} y={-350} width={300} height={24} rx={4} fill="url(#tp-wood)" {...LINE} />
      <rect x={100} y={-500} width={220} height={150} fill={C.plank} {...LINE} />
      <path d="M100 -470 H320 M100 -430 H320 M100 -390 H320" stroke={C.woodDark} strokeWidth={4} opacity={0.6} />
      <path d="M80 -500 L210 -590 L340 -500 Z" fill={C.moss} {...LINE} />
      <path d="M96 -506 L210 -580 L324 -506" fill="none" stroke={C.fern} strokeWidth={6} opacity={0.7} />
      <rect x={240} y={-470} width={50} height={40} fill={C.sunGold} {...LINE} />
      <rect x={100} y={-450} width={66} height={100} fill={C.woodDark} />
      <g data-fx="door">
        <rect x={100} y={-450} width={66} height={100} fill="url(#tp-wood)" {...LINE} />
        <circle cx={156} cy={-400} r={5} fill={C.sunGold} />
      </g>
    </g>
  )
}

/** The store inside the cave, its crates stacked; each `store-<i>` starts out of sight and is faded in by its place. */
export function Store({ count = 3 }: { count?: number }) {
  const spots: ReadonlyArray<readonly [number, number]> = [
    [150, 0],
    [214, 0],
    [182, -56],
  ]
  return (
    <>
      {spots.slice(0, count).map(([x, y], i) => (
        <g key={i} data-fx={`store-${i}`} opacity="0" transform={`translate(${x} ${y}) scale(0.8)`}>
          <MangoCrate />
        </g>
      ))}
    </>
  )
}

/** The pirate toad captain, our own: a big warty toad in a long red coat with gold buttons, a cutlass belt,
 *  a wide eyed scowl, facing left; his hat (`captain-hat`) is a separate piece he throws. About 230 tall;
 *  `captain-body` turns him about his feet. */
export function Captain() {
  return (
    <g data-fx="captain-body">
      <Shadow width={170} />
      <path d="M-50 0 Q-60 -20 -40 -26 L-20 -26 L-20 0 Z M20 0 L20 -26 L44 -26 Q60 -20 52 0 Z" fill="#5a7a2a" {...LINE} />
      <path d="M-70 -40 Q-80 -150 0 -170 Q80 -150 70 -40 Q60 -14 0 -16 Q-60 -14 -70 -40 Z" fill="#c0392b" {...LINE} />
      <path d="M-30 -150 Q-40 -60 -20 -30 L20 -30 Q40 -60 30 -150 Z" fill="#b8d06a" {...LINE} />
      <rect x={-70} y={-70} width={140} height={14} fill={C.woodDark} {...LINE} />
      <rect x={-12} y={-72} width={24} height={18} fill={C.sunGold} {...LINE} />
      {[-120, -100, -80].map((y) => (
        <circle key={y} cx={-46} cy={y} r={5} fill={C.sunGold} {...LINE} strokeWidth={2} />
      ))}
      <path d="M-74 -130 Q-110 -110 -104 -70" fill="none" stroke="#c0392b" strokeWidth={22} strokeLinecap="round" />
      <circle cx={-104} cy={-66} r={14} fill="#6a8a30" {...LINE} />
      <path d="M-60 -168 Q-70 -230 0 -232 Q70 -230 60 -168 Z" fill="#6a8a30" {...LINE} />
      <path d="M-62 -180 Q-30 -164 10 -172" fill="none" stroke={EDGE} strokeWidth={4} strokeLinecap="round" />
      <circle cx={-36} cy={-214} r={16} fill="#fff6d8" {...LINE} />
      <circle cx={-42} cy={-214} r={7} fill={EDGE} />
      <circle cx={6} cy={-220} r={14} fill="#fff6d8" {...LINE} />
      <circle cx={0} cy={-220} r={6} fill={EDGE} />
      <path d="M-54 -232 L-20 -226 M-10 -234 L20 -232" stroke={EDGE} strokeWidth={5} strokeLinecap="round" />
      {[
        [26, -196],
        [40, -182],
        [18, -178],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={4} fill="#4a6a20" />
      ))}
    </g>
  )
}

/** The captain's hat: a black tricorn with a gold band, its middle on 0 0. */
export function CaptainHat() {
  return (
    <g>
      <path d="M-60 6 Q-40 -30 0 -34 Q40 -30 60 6 Q0 -6 -60 6 Z" fill="#1a1414" {...LINE} />
      <path d="M-44 -6 Q0 -16 44 -6" fill="none" stroke={C.sunGold} strokeWidth={5} />
      <circle cx={0} cy={-20} r={7} fill="#fff6d8" {...LINE} strokeWidth={2} />
    </g>
  )
}

/** A cannonball, its middle on 0 0, 30 across. */
export function Cannonball() {
  return (
    <g>
      <circle r={15} fill="url(#tp-iron)" {...LINE} />
      <circle cx={5} cy={-5} r={4} fill="#fff" opacity={0.6} />
    </g>
  )
}

/** A burning oil drum standing in the pit, its top at 0 0, 70 wide; its flame is `flame-<i>`. */
export function FireDrum({ i }: { i: number }) {
  return (
    <g>
      <rect x={-35} y={0} width={70} height={140} rx={6} fill="url(#tp-iron)" {...LINE} />
      <path d="M-35 40 H35 M-35 100 H35" stroke={EDGE} strokeWidth={4} />
      <ellipse cx={0} cy={0} rx={35} ry={8} fill="#3a3a3a" {...LINE} />
      <g data-fx={`flame-${i}`}>
        <path d="M-28 -2 Q-34 -50 -8 -80 Q-12 -50 4 -40 Q6 -76 26 -96 Q22 -60 32 -40 Q36 -14 28 -2 Z" fill="#ff8a2a" {...LINE} strokeWidth={2} />
        <path d="M-16 -4 Q-18 -36 0 -52 Q2 -34 14 -28 Q20 -12 16 -4 Z" fill="#ffe08a" />
      </g>
    </g>
  )
}

/** The lantern beetle, our own: a small beetle with a glowing lantern abdomen, its middle on 0 0. */
export function LanternBeetle() {
  return (
    <g>
      <ellipse cx={-10} cy={4} rx={18} ry={14} fill="#ffe86a" stroke="#a87a10" strokeWidth={3} />
      <ellipse cx={-14} cy={0} rx={8} ry={6} fill="#fffbd0" />
      <ellipse cx={10} cy={-4} rx={14} ry={11} fill="url(#tp-beetle)" {...LINE} />
      <circle cx={20} cy={-6} r={3} fill="#fff" />
      <g data-fx="lantern-wings">
        <ellipse cx={4} cy={-16} rx={14} ry={7} fill="#e6f4ff" opacity={0.7} transform="rotate(-24 4 -16)" />
      </g>
    </g>
  )
}

/** The bat of the dark cave, hanging upside down from 0 0, wings folded. */
export function Bat() {
  return (
    <g>
      <path d="M0 0 V10" stroke={EDGE} strokeWidth={4} />
      <path d="M-26 14 Q-30 50 0 64 Q30 50 26 14 Q0 22 -26 14 Z" fill="#3a2a4a" {...LINE} />
      <path d="M-12 60 L-18 76 L-6 66 M12 60 L18 76 L6 66" fill="#3a2a4a" {...LINE} />
    </g>
  )
}

/** The bat's eyes, all that shows of it in the dark. */
export function BatEyes() {
  return (
    <g>
      <circle cx={-8} cy={46} r={4.5} fill="#ffe14d" />
      <circle cx={8} cy={46} r={4.5} fill="#ffe14d" />
    </g>
  )
}

/** The save barrel standing by the hut, its lid (`save-lid`) on top; 100 wide, 140 tall. */
export function SaveBarrel() {
  return (
    <g>
      <Shadow width={120} />
      <path d="M-46 0 Q-56 -70 -46 -140 L46 -140 Q56 -70 46 0 Z" fill="url(#tp-wood)" {...LINE} />
      <path d="M-50 -30 H50 M-52 -110 H52" stroke="url(#tp-hoop)" strokeWidth={8} />
      <g data-fx="save-lid">
        <ellipse cx={0} cy={-140} rx={48} ry={11} fill="url(#tp-wood)" {...LINE} />
        <circle cx={0} cy={-150} r={6} fill="url(#tp-iron)" {...LINE} strokeWidth={2} />
      </g>
    </g>
  )
}

/** The friend's hut, our own: a round thatched hut with a lit window and the friend's shape in it. */
export function SaveHut() {
  return (
    <g>
      <rect x={-90} y={-150} width={180} height={150} rx={10} fill={C.plank} {...LINE} />
      <path d="M-120 -140 Q0 -270 120 -140 Z" fill="#d9a441" {...LINE} />
      <path d="M-100 -150 Q0 -240 100 -150" fill="none" stroke="#a8782a" strokeWidth={5} />
      <rect x={20} y={-120} width={50} height={46} rx={6} fill={C.sunGold} {...LINE} />
      <path d="M36 -74 Q36 -104 46 -104 Q56 -104 56 -74 Z" fill={C.woodDark} />
      <rect x={-60} y={-100} width={50} height={100} rx={4} fill={C.woodDark} {...LINE} />
    </g>
  )
}

/** His old relative on the porch, our own: a small white bearded elder with a cane, sitting, waving
 *  (`elder-arm`, turned at the shoulder 10 -50). */
export function Elder() {
  return (
    <g>
      <path d="M-20 0 L-24 -20 L20 -20 L24 0" fill="none" stroke={C.woodDark} strokeWidth={6} />
      <ellipse cx={0} cy={-40} rx={22} ry={24} fill="#7a5a3a" {...LINE} />
      <circle cx={2} cy={-76} r={16} fill="#c99a70" {...LINE} />
      <path d="M-10 -70 Q2 -44 16 -70 Q4 -58 -10 -70 Z" fill="#f4f1ea" {...LINE} strokeWidth={2} />
      <path d="M-16 -86 Q2 -100 18 -86" fill="none" stroke="#f4f1ea" strokeWidth={6} strokeLinecap="round" />
      <path d="M24 -30 L30 4" stroke={C.woodDark} strokeWidth={4} />
      <g data-fx="elder-arm">
        <path d="M10 -50 L30 -74" stroke="#7a5a3a" strokeWidth={9} strokeLinecap="round" />
        <circle cx={31} cy={-76} r={6} fill="#c99a70" {...LINE} strokeWidth={2} />
      </g>
    </g>
  )
}
