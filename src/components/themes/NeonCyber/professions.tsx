import type { CSSProperties, ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HeroCharacter } from './character'
import styles from './scenes.module.css'

// The three Neon Cyber stages, one per profession, each in two places: the level strip that runs above
// a section while it scrolls, and the corner of the contact scene. System Engineer runs a rooftop of
// terminals and billboards and ends at his desk; Musician plays his kit on a neon stage with sound
// waves; Martial Artist works the pads in a ring, kick, knee and elbow. A profession's stage holds only
// its own props, so switching profession swaps all of it.
//
// Animated element budget per strip, at most 11: far and mid layers, his travel, his moving limbs (four
// running, two drumming or striking) and the props that answer progress (three terminal screens or
// billboards, two beams and five waves, one strike flash). Everything else here is static.

const VOID = '#0a0512'
const MAGENTA = '#ff00ff'
const CYAN = '#00ffff'
const HOT_PINK = '#ff0066'
const YELLOW = '#ffff00'

// A prop's place along the level (0 to 1) as --at: it sets the prop's left edge and when it lights.
const at = (position: number) => ({ '--at': position }) as CSSProperties

// Tower outlines for the two skyline layers, fixed so every render draws the same city.
const towers = (count: number, spacing: number, salt: number) =>
  Array.from({ length: count }, (_, i) => ({
    x: i * spacing,
    width: spacing - 4 - ((i * salt) % 9),
    height: 30 + ((i * salt * 7) % 55),
  }))

const FAR_TOWERS = towers(20, 30, 5)
const MID_TOWERS = towers(12, 50, 3)

function Skyline() {
  return (
    <>
      <svg viewBox="0 0 600 100" preserveAspectRatio="none" className={styles.far} aria-hidden="true" focusable="false">
        {FAR_TOWERS.map(({ x, width, height }) => (
          <g key={x}>
            <rect x={x} y={100 - height} width={width} height={height} fill="#1a0a2a" />
            <rect x={x + 4} y={104 - height} width={2} height={2} fill={CYAN} opacity={0.5} />
            <rect x={x + width - 7} y={112 - height} width={2} height={2} fill={MAGENTA} opacity={0.5} />
          </g>
        ))}
      </svg>
      <svg viewBox="0 0 600 100" preserveAspectRatio="none" className={styles.mid} aria-hidden="true" focusable="false">
        {MID_TOWERS.map(({ x, width, height }) => (
          <g key={x}>
            <rect x={x} y={100 - height * 0.8} width={width} height={height * 0.8} fill="#2a1240" />
            <line x1={x} y1={100 - height * 0.8} x2={x + width} y2={100 - height * 0.8} stroke={MAGENTA} strokeWidth={0.8} />
          </g>
        ))}
        <rect x={210} y={22} width={60} height={26} fill={VOID} stroke={CYAN} strokeWidth={1.2} />
        <line x1={240} y1={48} x2={240} y2={70} stroke="#3a2456" strokeWidth={3} />
      </svg>
    </>
  )
}

function Ground({ edge }: { edge: string }) {
  return <div className={`absolute inset-x-0 bottom-0 h-3 bg-[#1d1030] border-t-2 ${edge}`} aria-hidden="true" />
}

// A rooftop terminal: its screen boots as he runs past it.
function Terminal({ position }: { position: number }) {
  return (
    <svg
      viewBox="0 0 32 44"
      className="absolute bottom-3 left-[calc(var(--at)*100%_-_1rem)] h-9 w-7 sm:h-12 sm:w-9"
      style={at(position)}
      aria-hidden="true"
      focusable="false"
    >
      <rect x={3} y={2} width={26} height={30} rx={2} fill="#2a1840" stroke={CYAN} strokeWidth={1} />
      <rect x={6} y={5} width={20} height={16} fill={CYAN} className={styles.lightAt} />
      <path d="M6 26 H26 M10 32 V42 M22 32 V42" stroke="#3a2456" strokeWidth={2} />
    </svg>
  )
}

// A billboard on the roof edge: it lights as he passes under it.
function Billboard({ position, color }: { position: number; color: string }) {
  return (
    <svg
      viewBox="0 0 48 44"
      className="absolute bottom-3 left-[calc(var(--at)*100%_-_1.5rem)] h-10 w-11 sm:h-14 sm:w-16"
      style={at(position)}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M14 26 V44 M34 26 V44" stroke="#3a2456" strokeWidth={2} />
      <g className={styles.lightAt}>
        <rect x={2} y={2} width={44} height={24} fill={VOID} stroke={color} strokeWidth={1.5} />
        <path d="M8 10 H40 M8 17 H30" stroke={color} strokeWidth={2} />
      </g>
    </svg>
  )
}

// Circuit traces on the ledge face, the engineer's ground.
function CircuitLedge() {
  return (
    <svg viewBox="0 0 600 12" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-3 w-full" aria-hidden="true" focusable="false">
      <path d="M0 8 H90 L96 3 H180 M220 9 H300 L306 4 H420 M460 8 H600" stroke={CYAN} strokeWidth={0.8} fill="none" opacity={0.6} />
    </svg>
  )
}

export type LevelZone = 'record' | 'work'

function Rooftop({ zone }: { zone: LevelZone }) {
  return (
    <>
      <Skyline />
      <Ground edge="border-cyan-400" />
      <CircuitLedge />
      {zone === 'record' ? (
        <>
          <Terminal position={0.32} />
          <Terminal position={0.62} />
          <Terminal position={0.92} />
        </>
      ) : (
        <>
          <Billboard position={0.3} color={MAGENTA} />
          <Billboard position={0.6} color={CYAN} />
          <Billboard position={0.9} color={YELLOW} />
        </>
      )}
    </>
  )
}

// His kit, drawn in front of him: bass drum, snare, floor tom, hi-hat and the crash.
export function DrumKit({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 60" className={className} aria-hidden="true" focusable="false">
      <line x1={8} y1={18} x2={8} y2={58} stroke="#8a8a92" strokeWidth={1.5} />
      <ellipse cx={8} cy={18} rx={9} ry={2} fill="#f5d28a" />
      <line x1={70} y1={10} x2={70} y2={58} stroke="#8a8a92" strokeWidth={1.5} />
      <ellipse cx={70} cy={10} rx={11} ry={2.2} fill="#f5d28a" />
      <rect x={14} y={30} width={16} height={9} rx={2} fill="#2a1840" stroke={CYAN} strokeWidth={1} />
      <rect x={52} y={34} width={14} height={22} rx={2} fill="#2a1840" stroke={CYAN} strokeWidth={1} />
      <circle cx={38} cy={44} r={15} fill="#2a1840" stroke={MAGENTA} strokeWidth={2} />
      <circle cx={38} cy={44} r={6} fill="none" stroke={MAGENTA} strokeWidth={1} />
    </svg>
  )
}

const WAVE_PHASES = ['0turn', '0.2turn', '0.4turn', '0.6turn', '0.8turn']

function SoundWaves({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 50 40" className={className} aria-hidden="true" focusable="false">
      {WAVE_PHASES.map((phase, i) => (
        <rect
          key={phase}
          x={2 + i * 10}
          y={4}
          width={6}
          height={36}
          fill={i % 2 ? CYAN : MAGENTA}
          className={styles.wave}
          style={{ '--phase': phase } as CSSProperties}
        />
      ))}
    </svg>
  )
}

function Stage() {
  return (
    <>
      <svg viewBox="0 0 600 100" preserveAspectRatio="none" className={styles.far} aria-hidden="true" focusable="false">
        {FAR_TOWERS.map(({ x }) => (
          <g key={x} fill="#1a0a2a">
            <circle cx={x + 8} cy={84} r={6} />
            <rect x={x + 2} y={88} width={12} height={12} />
            <circle cx={x + 22} cy={86} r={5} />
          </g>
        ))}
      </svg>
      <svg viewBox="0 0 600 100" preserveAspectRatio="none" className={styles.mid} aria-hidden="true" focusable="false">
        <line x1={0} y1={6} x2={600} y2={6} stroke="#3a2456" strokeWidth={3} />
        <polygon points="150,6 120,96 180,96" fill={MAGENTA} opacity={0.12} className={styles.beam} />
        <polygon points="390,6 360,96 420,96" fill={CYAN} opacity={0.12} className={styles.beam} />
        <rect x={60} y={50} width={30} height={50} fill="#1d1030" stroke="#3a2456" />
        <rect x={500} y={50} width={30} height={50} fill="#1d1030" stroke="#3a2456" />
      </svg>
      <Ground edge="border-pink-500" />
      <SoundWaves className="absolute bottom-4 right-4 h-12 w-14 sm:h-16 sm:w-20" />
    </>
  )
}

// The pad holder: a plain silhouette with no face, holding the two pads he strikes.
function PadHolder() {
  return (
    <svg
      viewBox="0 0 40 96"
      className="absolute bottom-3 left-[calc(38%_+_4.5rem)] h-24 w-10 sm:left-[calc(38%_+_5.5rem)] sm:h-[7.5rem] sm:w-12"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx={22} cy={16} rx={9} ry={10} fill="#2d2a3d" />
      <path d="M12 28 H32 L30 60 H14 Z" fill="#2d2a3d" />
      <rect x={14} y={60} width={6} height={32} fill="#2d2a3d" />
      <rect x={24} y={60} width={6} height={32} fill="#2d2a3d" />
      <rect x={2} y={34} width={10} height={14} rx={3} fill={HOT_PINK} />
      <rect x={2} y={56} width={10} height={16} rx={3} fill={HOT_PINK} />
    </svg>
  )
}

function Ring() {
  return (
    <>
      <svg viewBox="0 0 600 100" preserveAspectRatio="none" className={styles.far} aria-hidden="true" focusable="false">
        {FAR_TOWERS.map(({ x }) => (
          <circle key={x} cx={x + 12} cy={12} r={2} fill={YELLOW} opacity={0.6} />
        ))}
        <rect x={0} y={70} width={600} height={30} fill="#1a0a2a" />
      </svg>
      <svg viewBox="0 0 600 100" preserveAspectRatio="none" className={styles.mid} aria-hidden="true" focusable="false">
        {[40, 290, 540].map((x) => (
          <rect key={x} x={x} y={30} width={6} height={70} fill="#3a2456" />
        ))}
        <line x1={0} y1={40} x2={600} y2={40} stroke={HOT_PINK} strokeWidth={1.5} />
        <line x1={0} y1={56} x2={600} y2={56} stroke="#e0f0ff" strokeWidth={1.5} />
        <line x1={0} y1={72} x2={600} y2={72} stroke={CYAN} strokeWidth={1.5} />
      </svg>
      <Ground edge="border-cyan-400" />
      <PadHolder />
    </>
  )
}

// The flash where a strike lands, just ahead of him; it lights on each kick, knee and elbow.
function StrikeFlash() {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`absolute bottom-12 left-[4.25rem] h-6 w-6 sm:bottom-16 sm:left-[5.25rem] ${styles.impact}`}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 0 L14 9 L24 12 L14 15 L12 24 L10 15 L0 12 L10 9 Z" fill={YELLOW} />
    </svg>
  )
}

function KitInFront() {
  return <DrumKit className="absolute bottom-1 left-6 h-14 w-20 sm:left-8 sm:h-20 sm:w-28" />
}

interface StageLook {
  Level: (props: { zone: LevelZone }) => ReactNode
  // His action on the level and how far he travels across it.
  pose: string
  travel: string
  // What moves with him on the track: the kit he plays, the flash of a strike.
  Companion: (() => ReactNode) | null
  Corner: () => ReactNode
}

// The contact corner: where each profession ends the page.
function DeskCorner() {
  return (
    <div className={`absolute inset-0 ${styles.type}`}>
      <div className="absolute bottom-6 left-4">
        <HeroCharacter profession="engineer" className={styles.hero} />
      </div>
      <svg viewBox="0 0 160 70" className="absolute inset-x-0 bottom-0 h-24 w-full" aria-hidden="true" focusable="false">
        <rect x={76} y={4} width={38} height={26} rx={2} fill="#2a1840" stroke={CYAN} />
        <rect x={79} y={7} width={32} height={20} fill={CYAN} className={styles.lightAt} style={at(0.4)} />
        <rect x={118} y={4} width={38} height={26} rx={2} fill="#2a1840" stroke={MAGENTA} />
        <rect x={121} y={7} width={32} height={20} fill={MAGENTA} className={styles.lightAt} style={at(0.7)} />
        <rect x={4} y={40} width={154} height={6} fill="#3a2456" />
        <rect x={12} y={46} width={6} height={24} fill="#3a2456" />
        <rect x={144} y={46} width={6} height={24} fill="#3a2456" />
        <rect x={50} y={36} width={34} height={4} rx={1} fill="#8a8a92" />
      </svg>
    </div>
  )
}

function KitCorner() {
  return (
    <div className={`absolute inset-0 ${styles.drum}`}>
      <div className="absolute bottom-1 left-6">
        <HeroCharacter profession="drummer" className={styles.hero} />
      </div>
      <DrumKit className="absolute bottom-1 left-12 h-20 w-28" />
      <SoundWaves className="absolute bottom-3 right-3 h-14 w-16" />
    </div>
  )
}

function RingCorner() {
  return (
    <div className={`absolute inset-0 ${styles.guard}`}>
      <svg viewBox="0 0 160 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
        <rect x={146} y={20} width={8} height={80} fill="#3a2456" />
        <line x1={0} y1={34} x2={150} y2={34} stroke={HOT_PINK} strokeWidth={1.5} />
        <line x1={0} y1={52} x2={150} y2={52} stroke="#e0f0ff" strokeWidth={1.5} />
        <line x1={0} y1={70} x2={150} y2={70} stroke={CYAN} strokeWidth={1.5} />
      </svg>
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
        <HeroCharacter profession="fighter" className={styles.hero} />
      </div>
    </div>
  )
}

export const PROFESSION_STAGES: Record<Profession, StageLook> = {
  engineer: { Level: Rooftop, pose: styles.run, travel: styles.runner, Companion: null, Corner: DeskCorner },
  drummer: { Level: Stage, pose: styles.drum, travel: styles.planted, Companion: KitInFront, Corner: KitCorner },
  fighter: { Level: Ring, pose: styles.strike, travel: styles.advance, Companion: StrikeFlash, Corner: RingCorner },
}
