import type { CSSProperties, ReactNode } from 'react'
import type { Flags, Zone } from './scripts'
import { SH } from './palette'
import stage from './stage.module.css'

// What he handles in each room, standing on his floor and placed by his body width (./scripts) so his
// hand meets it at every screen size: the item box chest, the desk lamp, the back door the pursuer stands
// in, the travelling trader by his blue fire (the Merchant of the 2005 sequel, named here in code only, a
// hood with two pale eyes in its shadow and the coat he throws open), the suit door, the safe door, and
// inside the safe room the chair and the typewriter desk. Each moves once, from a flag the room's script
// sets: the lid lifts, the lamp lights, a door leaf swings, the coat opens, the safe door shakes.

interface PlaceProps {
  // From his left edge, in his body widths; its own size in his widths and heights.
  at: number
  w: number
  h: number
  children: ReactNode
  viewBox: string
}

function Place({ at, w, h, viewBox, children }: PlaceProps) {
  return (
    <svg viewBox={viewBox} preserveAspectRatio="xMidYMax meet" className={stage.prop} style={{ '--at': at, '--w': w, '--h': h } as CSSProperties} aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

const turned = (on: boolean, className: string) => `${className} ${on ? stage.on : ''}`

function Chest({ open }: { open: boolean }) {
  return (
    <Place at={1} w={1.1} h={0.34} viewBox="0 0 110 76">
      <g className={turned(open, stage.lid)}>
        <path d="M4 34 Q55 2 106 34 Z" fill={SH.rust} />
        <path d="M4 34 Q55 2 106 34" fill="none" stroke={SH.brass} strokeWidth={2} />
      </g>
      <rect x={10} y={30} width={90} height={6} fill={SH.void} opacity={open ? 0.9 : 0} />
      <rect x={4} y={34} width={102} height={42} fill={SH.wood} />
      <path d="M4 48 H106 M30 34 V76 M80 34 V76" stroke={SH.sepia} strokeWidth={3} />
      <rect x={49} y={38} width={12} height={14} fill={SH.brass} />
    </Place>
  )
}

function DeskLamp({ lit }: { lit: boolean }) {
  return (
    <Place at={1.15} w={1} h={0.7} viewBox="0 0 100 160">
      <ellipse cx={46} cy={50} rx={60} ry={44} fill="url(#sh-prop-glow)" className={turned(lit, stage.glow)} />
      <rect x={6} y={84} width={84} height={8} fill={SH.wood} />
      <path d="M14 92 V160 M82 92 V160" stroke={SH.wood} strokeWidth={6} />
      <rect x={40} y={78} width={20} height={6} fill={SH.brass} />
      <path d="M50 78 V44" stroke={SH.brass} strokeWidth={3} />
      <path d="M32 46 L40 26 H60 L68 46 Z" fill={SH.felt} />
      <ellipse cx={50} cy={46} rx={18} ry={3} fill={lit ? SH.flame : SH.sepia} />
      <rect x={16} y={76} width={18} height={8} fill={SH.ivory} opacity={0.8} />
    </Place>
  )
}

function BackDoor({ open }: { open: boolean }) {
  return (
    <Place at={1.45} w={1.8} h={1.5} viewBox="0 0 120 170">
      <rect x={8} y={6} width={104} height={164} fill={SH.wood} />
      <rect x={16} y={14} width={88} height={156} fill={SH.void} />
      <g className={turned(open, stage.leaf)}>
        <rect x={16} y={14} width={88} height={156} fill={SH.sepia} />
        <rect x={26} y={26} width={68} height={56} fill="none" stroke={SH.wood} strokeWidth={3} />
        <rect x={26} y={96} width={68} height={62} fill="none" stroke={SH.wood} strokeWidth={3} />
        <circle cx={94} cy={96} r={3} fill={SH.brass} />
      </g>
    </Place>
  )
}

// Hung on the coat lining behind the flaps, his wares.
const WARES = [0, 1, 2].flatMap((row) => [0, 1].map((col) => ({ key: `${row}-${col}`, x: 44 + col * 18, y: 66 + row * 30 })))

function Trader({ open }: { open: boolean }) {
  return (
    <Place at={1.7} w={1.3} h={1.02} viewBox="0 0 120 150">
      <ellipse cx={18} cy={60} rx={30} ry={38} fill="url(#sh-prop-blue)" />
      <path d="M14 150 V70" stroke={SH.wood} strokeWidth={3} />
      <path d="M8 70 Q18 44 26 70 Z" fill={SH.moon} />
      <path d="M12 70 Q18 56 22 70 Z" fill={SH.ivory} opacity={0.8} />
      <path d="M40 50 H86 L94 150 H34 Z" fill={SH.felt} />
      {WARES.map((ware) => (
        <rect key={ware.key} x={ware.x} y={ware.y} width={14} height={20} rx={2} fill={SH.feltLine} />
      ))}
      <path d="M44 56 Q42 10 64 8 Q86 10 84 56 Z" fill={SH.coat} />
      <ellipse cx={64} cy={38} rx={13} ry={15} fill={SH.void} />
      <circle cx={59} cy={36} r={1.6} fill={SH.moon} />
      <circle cx={69} cy={36} r={1.6} fill={SH.moon} />
      <g className={turned(open, stage.flapLeft)}>
        <path d="M64 52 H40 L30 150 H62 Z" fill={SH.coatLit} />
      </g>
      <g className={turned(open, stage.flapRight)}>
        <path d="M64 52 H88 L98 150 H66 Z" fill={SH.coatLit} />
      </g>
    </Place>
  )
}

function SuitDoor({ open }: { open: boolean }) {
  return (
    <Place at={1.15} w={0.95} h={1.18} viewBox="0 0 70 132">
      <rect x={0} y={0} width={70} height={132} fill={SH.wood} />
      <rect x={6} y={6} width={58} height={126} fill={SH.void} />
      <g className={turned(open, stage.leaf)}>
        <rect x={6} y={6} width={58} height={126} fill={SH.sepia} />
        <rect x={14} y={16} width={42} height={40} fill="none" stroke={SH.wood} strokeWidth={2} />
        <path d="M35 24 Q46 36 35 48 Q24 36 35 24 Z" fill={SH.brass} />
        <rect x={14} y={66} width={42} height={56} fill="none" stroke={SH.wood} strokeWidth={2} />
        <rect x={10} y={68} width={6} height={10} rx={1} fill={SH.brass} />
      </g>
    </Place>
  )
}

function SafeDoor({ open, shaking }: { open: boolean; shaking: boolean }) {
  return (
    <Place at={-0.2} w={1} h={1.18} viewBox="0 0 70 132">
      <g className={shaking ? stage.shake : ''}>
        <rect x={0} y={0} width={70} height={132} fill={SH.wood} />
        <rect x={6} y={6} width={58} height={126} fill={SH.void} />
        <g className={turned(open, stage.leaf)}>
          <rect x={6} y={6} width={58} height={126} fill={SH.steel} />
          <rect x={14} y={16} width={42} height={104} fill="none" stroke={SH.gunmetal} strokeWidth={3} />
          <circle cx={54} cy={70} r={3} fill={SH.brass} />
        </g>
      </g>
    </Place>
  )
}

function Chair() {
  return (
    <Place at={0.15} w={0.7} h={0.62} viewBox="0 0 50 72">
      <path d="M4 0 V70" stroke={SH.wood} strokeWidth={5} />
      <rect x={4} y={34} width={42} height={6} fill={SH.wood} />
      <path d="M44 40 V72 M8 40 V72" stroke={SH.wood} strokeWidth={4} />
    </Place>
  )
}

function TypewriterDesk() {
  return (
    <Place at={0.95} w={1.4} h={0.5} viewBox="0 0 140 56">
      <rect x={0} y={16} width={140} height={6} fill={SH.wood} />
      <path d="M8 22 V56 M132 22 V56" stroke={SH.wood} strokeWidth={5} />
      <path d="M12 16 L18 2 H58 L64 16 Z" fill={SH.gunmetal} />
      <rect x={24} y={-8} width={28} height={10} fill={SH.ivory} />
      {[96, 106].map((x) => (
        <rect key={x} x={x} y={8} width={8} height={8} rx={1} fill={SH.leather} />
      ))}
    </Place>
  )
}

const BEHIND: Partial<Record<Zone, (flags: Flags) => ReactNode>> = {
  store: (flags) => <Chest open={flags.lid} />,
  about: (flags) => <DeskLamp lit={flags.lamp} />,
  projects: (flags) => <BackDoor open={flags.backDoor} />,
  ventures: (flags) => <Trader open={flags.coat} />,
  bands: (flags) => <SuitDoor open={flags.suitDoor} />,
  contact: (flags) =>
    flags.inside ? (
      <>
        <Chair />
        <TypewriterDesk />
      </>
    ) : (
      <SafeDoor open={flags.safeDoor} shaking={flags.shake} />
    ),
}

/** The room's props, drawn behind him and the pursuer. */
export function Props({ zone, flags }: { zone: Zone; flags: Flags }) {
  return (
    <>
      <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id="sh-prop-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor={SH.flame} stopOpacity={0.45} />
            <stop offset="100%" stopColor={SH.flame} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="sh-prop-blue" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor={SH.moon} stopOpacity={0.5} />
            <stop offset="100%" stopColor={SH.moon} stopOpacity={0} />
          </radialGradient>
        </defs>
      </svg>
      {BEHIND[zone]?.(flags)}
    </>
  )
}

/** The spent magazine he drops in the armoury, on the floor at his feet. */
export function Magazine({ dropped }: { dropped: boolean }) {
  return (
    <svg viewBox="0 0 10 6" className={turned(dropped, stage.magazine)} aria-hidden="true" focusable="false">
      <rect x={1} y={1} width={8} height={4} rx={0.6} fill={SH.gunmetal} />
    </svg>
  )
}
