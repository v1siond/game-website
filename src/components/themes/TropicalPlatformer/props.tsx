import type { ReactNode } from 'react'
import { COLORS as C } from './palette'

// The platformer's things on the stages, drawn the way its rendered models look: round volumes in soft
// gradients lit from the upper right, a dark edge, a bright rim. Each is drawn round its own origin (its foot
// on the ground at 0 0 unless said) and placed by its place (places/). The gradients are drawn once for the
// page (PropShading, inside the world's SceneryDefs) and read by id: wood, iron hoops, iron, a crocodile's
// hide, gold, the desert's red stone, a mushroom's cap and the castle's grey stone.

const EDGE = C.shadow

// Each material's rendered shading: the specular glint at its lit top, its lit side, its own colour, its shade.
const GRADIENTS: ReadonlyArray<readonly [id: string, glint: string, light: string, mid: string, dark: string]> = [
  ['tp-wood', '#ffd59a', '#e8a35c', '#a8642a', '#3a1a06'],
  ['tp-hoop', '#ffffff', '#d6dde4', '#7d8690', '#262b30'],
  ['tp-iron', '#ffffff', '#b9c0c8', '#5b636c', '#181c20'],
  ['tp-croc', '#d6e890', '#8cb44c', '#4e7a2a', '#16280c'],
  ['tp-gold', '#fffbe0', '#ffd24a', '#d89a1a', '#5a3a06'],
  ['tp-stone', '#ffe6c0', '#d9945e', '#a4552e', '#3e160a'],
  ['tp-cap', '#ffd6c8', '#f2563c', '#b8221a', '#420806'],
  ['tp-keep', '#ddd4f4', '#8c86a4', '#4c4662', '#14101c'],
]

/** Every prop's gradient, lit from the top and front down to its shaded underside, and the soft contact
 *  shadow, once for the page. */
export function PropShading() {
  return (
    <>
      {GRADIENTS.map(([id, glint, light, mid, dark]) => (
        <linearGradient key={id} id={id} x1="0.3" y1="0" x2="0.45" y2="1">
          <stop offset="0" stopColor={glint} />
          <stop offset="0.18" stopColor={light} />
          <stop offset="0.55" stopColor={mid} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
      ))}
      <radialGradient id="tp-shadow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor={EDGE} stopOpacity="0.55" />
        <stop offset="1" stopColor={EDGE} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="tp-burst" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor={C.sunCore} stopOpacity="1" />
        <stop offset="0.6" stopColor={C.sunGold} stopOpacity="0.6" />
        <stop offset="1" stopColor={C.sunGold} stopOpacity="0" />
      </radialGradient>
    </>
  )
}

const LINE = { stroke: EDGE, strokeWidth: 3, strokeLinejoin: 'round' as const }

/** The soft shadow where a thing meets the ground at 0 0, `width` across. */
export const Shadow = ({ width, x = 0 }: { width: number; x?: number }) => <ellipse cx={x} cy={2} rx={width / 2} ry={width / 14} fill="url(#tp-shadow)" />

/** A barrel lying on its side, its mouth to the right, round its middle: the staves, two iron hoops, the
 *  dark mouth; a blast barrel carries the burst on its side. Its length is 120, its height 96. */
export function Barrel({ blast = false, mouth = true }: { blast?: boolean; mouth?: boolean }) {
  return (
    <g>
      <path d="M-60 -40 Q-66 0 -60 40 L56 40 Q64 0 56 -40 Z" fill="url(#tp-wood)" {...LINE} />
      <path d="M-62 -14 H60 M-63 14 H61" stroke="#6b3a14" strokeWidth={2} opacity={0.6} />
      <path d="M-40 -42 Q-45 0 -40 42" fill="none" stroke="url(#tp-hoop)" strokeWidth={9} />
      <path d="M36 -42 Q41 0 36 42" fill="none" stroke="url(#tp-hoop)" strokeWidth={9} />
      {mouth && <ellipse cx={58} cy={0} rx={11} ry={40} fill={C.woodDark} {...LINE} />}
      {mouth && <ellipse cx={60} cy={0} rx={6} ry={30} fill={EDGE} />}
      {blast && <path d="M-6 -22 L2 -8 L18 -14 L8 0 L20 12 L2 8 L-4 24 L-10 8 L-26 14 L-16 0 L-28 -12 L-12 -8 Z" fill={C.sunGold} stroke={EDGE} strokeWidth={2} />}
      <path d="M-54 -36 Q-20 -46 50 -36" fill="none" stroke={C.sunCore} strokeWidth={3} strokeLinecap="round" opacity={0.6} />
    </g>
  )
}

/** A barrel standing on its end, its head up, the drum he plays: 72 wide, 96 tall, its foot at 0 0. */
export function StandingBarrel() {
  return (
    <g>
      <Shadow width={110} />
      <path d="M-34 0 Q-42 -48 -34 -96 L34 -96 Q42 -48 34 0 Z" fill="url(#tp-wood)" {...LINE} />
      <path d="M-38 -24 Q0 -18 38 -24 M-38 -72 Q0 -66 38 -72" fill="none" stroke="url(#tp-hoop)" strokeWidth={8} />
      <ellipse cx={0} cy={-96} rx={34} ry={9} fill="#d9a35f" {...LINE} />
    </g>
  )
}

/** A burst of light round 0 0 at `size`, where a thing bursts, lands or fires. */
export function Burst({ size }: { size: number }): ReactNode {
  return <circle r={size} fill="url(#tp-burst)" />
}
