import type { ReactNode } from 'react'
import { atClass } from './stage'
import scene from './heroScene.module.css'

// The profession props more than one world stands on its stages, drawn in the world's own colours:
// the terminal that lights as he passes (System Engineer), his drum kit and the sound waves that follow
// the sticks (Musician), the pad holder and the strike flash (Martial Artist), and the closing corners
// at his desk, behind his kit and in the ring.

// A terminal on the level: its screen lights as he passes it.
export function Terminal({ position, body, screen, stand }: { position: number; body: string; screen: string; stand: string }) {
  return (
    <svg
      viewBox="0 0 32 44"
      className={`absolute bottom-3 left-[calc(var(--at)*100%_-_1rem)] h-9 w-7 sm:h-12 sm:w-9 ${atClass(position)}`}
      aria-hidden="true"
      focusable="false"
    >
      <rect x={3} y={2} width={26} height={30} rx={2} fill={body} stroke={screen} strokeWidth={1} />
      <rect x={6} y={5} width={20} height={16} fill={screen} className={scene.lightAt} />
      <path d="M6 26 H26 M10 32 V42 M22 32 V42" stroke={stand} strokeWidth={2} />
    </svg>
  )
}

export interface DrumKitColors {
  stand: string
  shell: string
  // The snare and floor tom rims, and the bass drum's.
  rim: string
  bass: string
  // The cymbals' brass; a world with its own metal passes it.
  cymbal?: string
  // The cymbals tip on each stick hit (heroScene's .cymbal, the world's numbers in its tempo).
  cymbalsTip?: boolean
}

const BRASS = '#f5d28a'

// His kit: bass drum, snare, floor tom, hi-hat and the crash.
export function DrumKit({ className = '', colors }: { className?: string; colors: DrumKitColors }) {
  const { stand, shell, rim, bass, cymbal = BRASS, cymbalsTip = false } = colors
  const tip = cymbalsTip ? scene.cymbal : ''

  return (
    <svg viewBox="0 0 80 60" className={className} aria-hidden="true" focusable="false">
      <line x1={8} y1={18} x2={8} y2={58} stroke={stand} strokeWidth={1.5} />
      <ellipse cx={8} cy={18} rx={9} ry={2} fill={cymbal} className={tip} />
      <line x1={70} y1={10} x2={70} y2={58} stroke={stand} strokeWidth={1.5} />
      <ellipse cx={70} cy={10} rx={11} ry={2.2} fill={cymbal} className={`${tip} [--phase:0.5turn]`} />
      <rect x={14} y={30} width={16} height={9} rx={2} fill={shell} stroke={rim} strokeWidth={1} />
      <rect x={52} y={34} width={14} height={22} rx={2} fill={shell} stroke={rim} strokeWidth={1} />
      <circle cx={38} cy={44} r={15} fill={shell} stroke={bass} strokeWidth={2} />
      <circle cx={38} cy={44} r={6} fill="none" stroke={bass} strokeWidth={1} />
    </svg>
  )
}

// Each bar's --phase as a literal class, so the build generates all five.
const WAVE_PHASES = ['[--phase:0turn]', '[--phase:0.2turn]', '[--phase:0.4turn]', '[--phase:0.6turn]', '[--phase:0.8turn]']

// Five bars that rise with the stick hits, alternating the world's two colours.
export function SoundWaves({ className = '', colors: [even, odd] }: { className?: string; colors: [string, string] }) {
  return (
    <svg viewBox="0 0 50 40" className={className} aria-hidden="true" focusable="false">
      {WAVE_PHASES.map((phase, i) => (
        <rect
          key={phase}
          x={2 + i * 10}
          y={4}
          width={6}
          height={36}
          fill={i % 2 ? odd : even}
          className={`${scene.wave} ${phase}`}
        />
      ))}
    </svg>
  )
}

// The pad holder: a plain silhouette with no face, holding the two pads he strikes; the pads give with
// each strike (padHigh, padLow). `className` places it where his advance ends.
export function PadHolder({ className, body, pads }: { className: string; body: string; pads: string }) {
  return (
    <svg viewBox="0 0 40 96" className={`absolute bottom-3 h-24 w-10 sm:h-[7.5rem] sm:w-12 ${className}`} aria-hidden="true" focusable="false">
      <ellipse cx={22} cy={16} rx={9} ry={10} fill={body} />
      <path d="M12 28 H32 L30 60 H14 Z" fill={body} />
      <rect x={14} y={60} width={6} height={32} fill={body} />
      <rect x={24} y={60} width={6} height={32} fill={body} />
      <rect x={2} y={34} width={10} height={14} rx={3} fill={pads} className={scene.padHigh} />
      <rect x={2} y={56} width={10} height={16} rx={3} fill={pads} className={scene.padLow} />
    </svg>
  )
}

// The flash where a strike lands, just ahead of him; it lights on each kick, knee and elbow.
export function StrikeFlash({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`absolute bottom-12 left-[4.25rem] h-6 w-6 sm:bottom-16 sm:left-[5.25rem] ${scene.impact}`}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 0 L14 9 L24 12 L14 15 L12 24 L10 15 L0 12 L10 9 Z" fill={color} />
    </svg>
  )
}

interface DeskColors {
  panel: string
  screens: [string, string]
  desk: string
  keyboard: string
}

// The System Engineer's closing corner: he types at his desk while the two screens light in turn.
export function DeskCorner({ hero, colors }: { hero: ReactNode; colors: DeskColors }) {
  const {
    panel,
    screens: [left, right],
    desk,
    keyboard,
  } = colors

  return (
    <div className={`absolute inset-0 ${scene.type}`}>
      <div className="absolute bottom-6 left-4">{hero}</div>
      <svg viewBox="0 0 160 70" className="absolute inset-x-0 bottom-0 h-24 w-full" aria-hidden="true" focusable="false">
        <rect x={76} y={4} width={38} height={26} rx={2} fill={panel} stroke={left} />
        <rect x={79} y={7} width={32} height={20} fill={left} className={`${scene.lightAt} ${atClass(0.4)}`} />
        <rect x={118} y={4} width={38} height={26} rx={2} fill={panel} stroke={right} />
        <rect x={121} y={7} width={32} height={20} fill={right} className={`${scene.lightAt} ${atClass(0.7)}`} />
        <rect x={4} y={40} width={154} height={6} fill={desk} />
        <rect x={12} y={46} width={6} height={24} fill={desk} />
        <rect x={144} y={46} width={6} height={24} fill={desk} />
        <rect x={50} y={36} width={34} height={4} rx={1} fill={keyboard} />
      </svg>
    </div>
  )
}

// The Musician's closing corner: he plays behind his kit, the waves beside him.
export function KitCorner({ hero, kit, waves }: { hero: ReactNode; kit: DrumKitColors; waves: [string, string] }) {
  return (
    <div className={`absolute inset-0 ${scene.drum}`}>
      <div className="absolute bottom-1 left-6">{hero}</div>
      <DrumKit className="absolute bottom-1 left-12 h-20 w-28" colors={kit} />
      <SoundWaves className="absolute bottom-3 right-3 h-14 w-16" colors={waves} />
    </div>
  )
}

export type RingSide = 'left' | 'right'

// The corner post's place and the span of the ropes from it, in the corner's 160 by 100 box.
const RING_SIDE: Record<RingSide, { postX: number; ropes: [number, number] }> = {
  left: { postX: 4, ropes: [10, 160] },
  right: { postX: 146, ropes: [0, 150] },
}

const ROPE_HEIGHTS: [number, number, number] = [34, 52, 70]

// A plain corner post, for a world that does not draw its own.
export const ringPost = (side: RingSide, color: string) => (
  <rect x={RING_SIDE[side].postX} y={20} width={8} height={80} fill={color} />
)

interface RingCornerProps {
  hero: ReactNode
  side: RingSide
  // The corner post as the world draws it (ringPost draws a plain one).
  post: ReactNode
  // The three ropes' colours top to bottom, and their heights in the 100 unit box.
  ropes: [string, string, string]
  ropeHeights?: [number, number, number]
  // Where he stands, as position classes.
  heroPlace?: string
  // What else the world draws in the corner (a floor, a mat).
  children?: ReactNode
}

// The Martial Artist's closing corner: the post, the ropes from it and him gloves up in guard.
export function RingCorner({ hero, side, post, ropes, ropeHeights = ROPE_HEIGHTS, heroPlace = 'left-1/3', children = null }: RingCornerProps) {
  const [from, to] = RING_SIDE[side].ropes

  return (
    <div className={`absolute inset-0 ${scene.guard}`}>
      <svg viewBox="0 0 160 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
        {post}
        {ropes.map((color, i) => (
          <line key={ropeHeights[i]} x1={from} y1={ropeHeights[i]} x2={to} y2={ropeHeights[i]} stroke={color} strokeWidth={1.5} />
        ))}
        {children}
      </svg>
      <div className={`absolute bottom-1 ${heroPlace}`}>{hero}</div>
    </div>
  )
}
