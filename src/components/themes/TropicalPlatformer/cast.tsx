import { COLORS as C } from './palette'
import { Snapper } from './crocs'
import { Shadow } from './props'

// His isle's things, our own, drawn as the props are (props.tsx): rendered volumes in the shared gradients, lit
// from the upper right, a dark edge. The store of golden mangoes the snappers steal, a snapper carrying a crate
// of it off, his treehouse and the cave under it where the store is kept. Each stands on its own 0 0 unless
// said; moving parts are data-fx groups its place turns about a stated point. Nothing here is a character,
// name or object of the game it evokes.

const EDGE = C.shadow
const LINE = { stroke: EDGE, strokeWidth: 3, strokeLinejoin: 'round' as const }

// The store's mangoes are gold.
export const MANGO = { light: '#fff4b0', mid: '#ffc93c', dark: '#c8820a', leaf: '#3f8a2a' }

/** A golden mango, its middle on 0 0, `size` 1 about 40 long. */
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

/** A crate of the golden mango store, 80 wide, mangoes heaped over its rim. */
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

/** A snapper of the king's carrying a crate of the store over his head, walking left to the shore. */
export function Carrier() {
  return (
    <g>
      <Snapper />
      <g transform="translate(-14 -160) rotate(-6) scale(0.7)">
        <MangoCrate />
      </g>
    </g>
  )
}

/** His treehouse: a thick trunk, the plank hut on its platform with the door on its left, the porch, and under
 *  the roots the store cave, empty, its mouth from x 110 to 250. */
export function Treehouse() {
  return (
    <g>
      <path d="M150 0 Q160 -160 170 -330 L230 -330 Q240 -160 260 0 Z" fill="url(#tp-wood)" {...LINE} />
      <path d="M80 0 Q130 -40 150 -10 M330 0 Q280 -40 258 -10" fill="none" stroke={C.bark} strokeWidth={22} strokeLinecap="round" />
      {/* the store cave under the roots */}
      <path d="M110 0 Q110 -120 180 -126 Q250 -120 250 0 Z" fill={C.shadow} {...LINE} />
      <rect x={60} y={-350} width={300} height={24} rx={4} fill="url(#tp-wood)" {...LINE} />
      <rect x={100} y={-500} width={220} height={150} fill={C.plank} {...LINE} />
      <path d="M100 -470 H320 M100 -430 H320 M100 -390 H320" stroke={C.woodDark} strokeWidth={4} opacity={0.6} />
      <path d="M80 -500 L210 -590 L340 -500 Z" fill={C.moss} {...LINE} />
      <path d="M96 -506 L210 -580 L324 -506" fill="none" stroke={C.fern} strokeWidth={6} opacity={0.7} />
      <rect x={240} y={-470} width={50} height={40} fill={C.sunGold} {...LINE} />
      <rect x={100} y={-450} width={66} height={100} fill={C.woodDark} />
      <rect x={100} y={-450} width={66} height={100} fill="url(#tp-wood)" {...LINE} />
      <circle cx={156} cy={-400} r={5} fill={C.sunGold} />
    </g>
  )
}
