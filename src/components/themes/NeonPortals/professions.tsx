import type { CSSProperties, ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HeroCharacter } from './character'
import { PORTAL } from './palette'
import styles from './scenes.module.css'

// The three Neon Portals stages, one per profession, each in two places: the lane that stays pinned above
// a section while it scrolls, and the corner of the contact scene. Every lane runs from an orange portal
// (in) to a blue one (out) through two rifts, and each rift swaps the dimension behind it: a test
// chamber, a light grid, a violet pocket. What fills each dimension belongs to the profession:
// - System Engineer walks the lane past terminals that power on (Experience) or build blocks that drop
//   into place (Projects), circuits in every dimension, and ends typing at his desk.
// - Musician plays his kit on a stage that hops dimensions with the song: speaker stacks, light rigs,
//   sound bars that follow the stick hits, and ends on the crash.
// - Martial Artist steps out of the orange portal to the pads in a ring and throws the roundhouse kick,
//   the knee and the elbow, and ends gloves up in his corner.
// Switching profession swaps the whole stage; no prop is shared between professions.
//
// Animated elements per lane, at most 14: three dimensions, two rifts, his travel, his moving limbs (four
// walking, two drumming, three striking) and the props that answer progress (three terminals or blocks,
// five sound bars and two cymbals, one strike flash). Everything else here is static.

// A prop's place along the lane (0 to 1) as --at: it sets the prop's left edge and when it answers.
const at = (position: number) => ({ '--at': position }) as CSSProperties

const PROP_SLOT = 'absolute bottom-3 left-[calc(var(--at)*100%_-_1rem)]'

// ---- the world's lane pieces, the same for every profession ----

// A dimension layer, full lane, stretched: `art` is the profession's own detail inside it.
function Dimension({ layer, base, art }: { layer: string; base: ReactNode; art: ReactNode }) {
  return (
    <svg
      viewBox="0 0 600 100"
      preserveAspectRatio="none"
      className={`${styles.dimension} ${layer} h-full w-full`}
      aria-hidden="true"
      focusable="false"
    >
      {base}
      {art}
    </svg>
  )
}

const CHAMBER_PANELS = Array.from({ length: 12 }, (_, i) => i * 50)
const GRID_LINES = Array.from({ length: 13 }, (_, i) => i * 50)

const chamberBase = (
  <>
    <rect width={600} height={100} fill={PORTAL.CHAMBER} />
    {CHAMBER_PANELS.map((x) => (
      <rect key={x} x={x + 2} y={4} width={46} height={40} fill={PORTAL.PANEL} stroke={PORTAL.SEAM} strokeWidth={1} />
    ))}
  </>
)

const gridBase = (
  <>
    <rect width={600} height={100} fill={PORTAL.VOID} />
    {GRID_LINES.map((x) => (
      <line key={x} x1={x} y1={0} x2={x} y2={100} stroke={PORTAL.GRID} strokeWidth={1.5} />
    ))}
    <line x1={0} y1={30} x2={600} y2={30} stroke={PORTAL.GRID} strokeWidth={1.5} />
    <line x1={0} y1={62} x2={600} y2={62} stroke={PORTAL.GRID} strokeWidth={1.5} />
  </>
)

const pocketBase = (
  <>
    <rect width={600} height={100} fill="#120a24" />
    <ellipse cx={150} cy={40} rx={120} ry={30} fill={PORTAL.VIOLET} opacity={0.12} />
    <ellipse cx={450} cy={30} rx={140} ry={26} fill={PORTAL.VIOLET} opacity={0.1} />
    <path d="M60 70 L80 58 L96 72 Z M300 20 L318 8 L330 26 Z M520 66 L540 50 L552 70 Z" fill={PORTAL.VIOLET} opacity={0.4} />
  </>
)

function Dimensions({ chamber, grid, pocket }: { chamber: ReactNode; grid: ReactNode; pocket: ReactNode }) {
  return (
    <>
      <Dimension layer={styles.chamber} base={chamberBase} art={chamber} />
      <Dimension layer={styles.grid} base={gridBase} art={grid} />
      <Dimension layer={styles.pocket} base={pocketBase} art={pocket} />
    </>
  )
}

// A torn rift at 1/3 and 2/3 of the lane: it opens as the level reaches it and closes to a scar.
function Rifts() {
  return (
    <>
      {[1 / 3, 2 / 3].map((position) => (
        <svg
          key={position}
          viewBox="0 0 16 100"
          preserveAspectRatio="none"
          className={`absolute inset-y-2 left-[calc(var(--at)*100%_-_0.5rem)] w-4 ${styles.rift}`}
          style={at(position)}
          aria-hidden="true"
          focusable="false"
        >
          <path d="M8 0 L13 18 L5 34 L14 52 L4 70 L12 86 L8 100 L3 86 L10 70 L2 52 L11 34 L3 18 Z" fill={PORTAL.VIOLET} />
          <path d="M8 6 L10 20 L6 34 L10 52 L6 70 L9 86 L8 94" stroke={PORTAL.WHITE} strokeWidth={1} fill="none" />
        </svg>
      ))}
    </>
  )
}

function Portal({ color, className }: { color: string; className: string }) {
  return (
    <svg viewBox="0 0 48 80" className={className} aria-hidden="true" focusable="false">
      <ellipse cx={24} cy={40} rx={20} ry={36} fill={PORTAL.VOID} stroke={color} strokeWidth={4} />
      <ellipse cx={24} cy={40} rx={13} ry={27} fill="none" stroke={color} strokeWidth={1} opacity={0.5} />
    </svg>
  )
}

function Floor() {
  return <div className="absolute inset-x-0 bottom-0 h-3 border-t-2 border-[#2c2a3d] bg-[#1c1b29]" aria-hidden="true" />
}

// The way in on the left, the way out on the right, both standing on the floor.
function LanePortals() {
  return (
    <>
      <Portal color={PORTAL.ORANGE} className="absolute bottom-2 left-1 h-24 w-14 sm:h-32 sm:w-[4.5rem]" />
      <Portal color={PORTAL.BLUE} className="absolute bottom-2 right-1 h-24 w-14 sm:h-32 sm:w-[4.5rem]" />
    </>
  )
}

// ---- System Engineer: terminals, circuits, his desk ----

const circuits = (color: string) => (
  <path
    d="M0 84 H70 L78 76 H160 M200 86 H280 L288 78 H390 M430 84 H520 L528 76 H600"
    stroke={color}
    strokeWidth={1.2}
    fill="none"
    opacity={0.7}
  />
)

// A terminal on the lane: its screen powers on as he walks past it.
function Terminal({ position }: { position: number }) {
  return (
    <svg viewBox="0 0 32 44" className={`${PROP_SLOT} h-9 w-7 sm:h-12 sm:w-9`} style={at(position)} aria-hidden="true" focusable="false">
      <rect x={3} y={2} width={26} height={30} rx={2} fill={PORTAL.PANEL} stroke={PORTAL.BLUE} strokeWidth={1} />
      <rect x={6} y={5} width={20} height={16} fill={PORTAL.BLUE} className={styles.lightAt} />
      <path d="M6 26 H26 M10 32 V42 M22 32 V42" stroke={PORTAL.SEAM} strokeWidth={2} />
    </svg>
  )
}

// A build block, the level piece a project adds: it drops into place as he walks under it.
function BuildBlock({ position, color }: { position: number; color: string }) {
  return (
    <svg viewBox="0 0 32 32" className={`${PROP_SLOT} h-8 w-8 sm:h-10 sm:w-10 ${styles.dropAt}`} style={at(position)} aria-hidden="true" focusable="false">
      <rect x={2} y={2} width={28} height={28} fill={PORTAL.PANEL} stroke={color} strokeWidth={2} />
      <path d="M8 16 H24 M16 8 V24" stroke={color} strokeWidth={2} />
    </svg>
  )
}

export type LaneZone = 'record' | 'work'

const ENGINEER_PROPS: Record<LaneZone, ReactNode> = {
  record: (
    <>
      <Terminal position={0.26} />
      <Terminal position={0.56} />
      <Terminal position={0.84} />
    </>
  ),
  work: (
    <>
      <BuildBlock position={0.26} color={PORTAL.ORANGE} />
      <BuildBlock position={0.56} color={PORTAL.VIOLET} />
      <BuildBlock position={0.84} color={PORTAL.BLUE} />
    </>
  ),
}

function EngineerLane({ zone }: { zone: LaneZone }) {
  return (
    <>
      <Dimensions chamber={circuits(PORTAL.SEAM)} grid={circuits(PORTAL.BLUE)} pocket={circuits(PORTAL.VIOLET)} />
      <Rifts />
      <LanePortals />
      <Floor />
      {ENGINEER_PROPS[zone]}
    </>
  )
}

// ---- Musician: his drum kit, the stage, sound ----

export function DrumKit({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 60" className={className} aria-hidden="true" focusable="false">
      <line x1={8} y1={18} x2={8} y2={58} stroke={PORTAL.MUTED} strokeWidth={1.5} />
      <ellipse cx={8} cy={18} rx={9} ry={2} fill="#f5d28a" className={styles.cymbal} />
      <line x1={70} y1={10} x2={70} y2={58} stroke={PORTAL.MUTED} strokeWidth={1.5} />
      <ellipse cx={70} cy={10} rx={11} ry={2.2} fill="#f5d28a" className={styles.cymbal} style={{ '--phase': '0.5turn' } as CSSProperties} />
      <rect x={14} y={30} width={16} height={9} rx={2} fill={PORTAL.PANEL} stroke={PORTAL.BLUE} strokeWidth={1} />
      <rect x={52} y={34} width={14} height={22} rx={2} fill={PORTAL.PANEL} stroke={PORTAL.BLUE} strokeWidth={1} />
      <circle cx={38} cy={44} r={15} fill={PORTAL.PANEL} stroke={PORTAL.ORANGE} strokeWidth={2} />
      <circle cx={38} cy={44} r={6} fill="none" stroke={PORTAL.ORANGE} strokeWidth={1} />
    </svg>
  )
}

const WAVE_PHASES = ['0turn', '0.2turn', '0.4turn', '0.6turn', '0.8turn']

function SoundBars({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 50 40" className={className} aria-hidden="true" focusable="false">
      {WAVE_PHASES.map((phase, i) => (
        <rect
          key={phase}
          x={2 + i * 10}
          y={4}
          width={6}
          height={36}
          fill={i % 2 ? PORTAL.BLUE : PORTAL.ORANGE}
          className={styles.wave}
          style={{ '--phase': phase } as CSSProperties}
        />
      ))}
    </svg>
  )
}

const speakers = (stroke: string) => (
  <>
    {[30, 520].map((x) => (
      <g key={x}>
        <rect x={x} y={44} width={50} height={56} fill={PORTAL.PANEL} stroke={stroke} strokeWidth={1.5} />
        <circle cx={x + 25} cy={62} r={9} fill="none" stroke={stroke} strokeWidth={1.5} />
        <circle cx={x + 25} cy={86} r={6} fill="none" stroke={stroke} strokeWidth={1.5} />
      </g>
    ))}
  </>
)

const lightRig = (color: string) => (
  <>
    <line x1={0} y1={6} x2={600} y2={6} stroke={PORTAL.SEAM} strokeWidth={3} />
    {[150, 300, 450].map((x) => (
      <polygon key={x} points={`${x},6 ${x - 30},96 ${x + 30},96`} fill={color} opacity={0.12} />
    ))}
  </>
)

function MusicianLane() {
  return (
    <>
      <Dimensions
        chamber={speakers(PORTAL.SEAM)}
        grid={<>{lightRig(PORTAL.BLUE)}{speakers(PORTAL.BLUE)}</>}
        pocket={<>{lightRig(PORTAL.VIOLET)}{speakers(PORTAL.VIOLET)}</>}
      />
      <Rifts />
      <LanePortals />
      <Floor />
      <SoundBars className="absolute bottom-4 right-16 h-12 w-14 sm:right-20 sm:h-16 sm:w-20" />
    </>
  )
}

// His kit, in front of him, moving with him on the track.
function KitInFront() {
  return <DrumKit className="absolute bottom-1 left-8 h-14 w-20 sm:left-10 sm:h-20 sm:w-28" />
}

// ---- Martial Artist: the ring, the pads, kicks, knees, elbows ----

const ringRopes = (posts: string) => (
  <>
    {[40, 300, 560].map((x) => (
      <rect key={x} x={x} y={30} width={6} height={70} fill={posts} />
    ))}
    <line x1={0} y1={40} x2={600} y2={40} stroke={PORTAL.ORANGE} strokeWidth={1.5} />
    <line x1={0} y1={56} x2={600} y2={56} stroke={PORTAL.WHITE} strokeWidth={1.5} />
    <line x1={0} y1={72} x2={600} y2={72} stroke={PORTAL.BLUE} strokeWidth={1.5} />
  </>
)

// The pad holder: a plain silhouette with no face, holding the two pads he strikes, where his advance
// ends (42% of the lane, plus his own width).
function PadHolder() {
  return (
    <svg
      viewBox="0 0 40 96"
      className="absolute bottom-3 left-[calc(42%_+_4.5rem)] h-24 w-10 sm:left-[calc(42%_+_5.5rem)] sm:h-[7.5rem] sm:w-12"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx={22} cy={16} rx={9} ry={10} fill={PORTAL.SEAM} />
      <path d="M12 28 H32 L30 60 H14 Z" fill={PORTAL.SEAM} />
      <rect x={14} y={60} width={6} height={32} fill={PORTAL.SEAM} />
      <rect x={24} y={60} width={6} height={32} fill={PORTAL.SEAM} />
      <rect x={2} y={34} width={10} height={14} rx={3} fill={PORTAL.VIOLET} />
      <rect x={2} y={56} width={10} height={16} rx={3} fill={PORTAL.VIOLET} />
    </svg>
  )
}

function FighterLane() {
  return (
    <>
      <Dimensions chamber={ringRopes(PORTAL.SEAM)} grid={ringRopes(PORTAL.GRID)} pocket={ringRopes('#3a2466')} />
      <Rifts />
      <LanePortals />
      <Floor />
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
      <path d="M12 0 L14 9 L24 12 L14 15 L12 24 L10 15 L0 12 L10 9 Z" fill={PORTAL.ORANGE} />
    </svg>
  )
}

// ---- the contact corners: where each profession ends the page, beside the exit portal ----

function DeskCorner() {
  return (
    <div className={`absolute inset-0 ${styles.type}`}>
      <div className="absolute bottom-6 left-4">
        <HeroCharacter profession="engineer" className={styles.hero} />
      </div>
      <svg viewBox="0 0 160 70" className="absolute inset-x-0 bottom-0 h-24 w-full" aria-hidden="true" focusable="false">
        <rect x={76} y={4} width={38} height={26} rx={2} fill={PORTAL.PANEL} stroke={PORTAL.ORANGE} />
        <rect x={79} y={7} width={32} height={20} fill={PORTAL.ORANGE} className={styles.lightAt} style={at(0.4)} />
        <rect x={118} y={4} width={38} height={26} rx={2} fill={PORTAL.PANEL} stroke={PORTAL.BLUE} />
        <rect x={121} y={7} width={32} height={20} fill={PORTAL.BLUE} className={styles.lightAt} style={at(0.7)} />
        <rect x={4} y={40} width={154} height={6} fill={PORTAL.SEAM} />
        <rect x={12} y={46} width={6} height={24} fill={PORTAL.SEAM} />
        <rect x={144} y={46} width={6} height={24} fill={PORTAL.SEAM} />
        <rect x={50} y={36} width={34} height={4} rx={1} fill={PORTAL.MUTED} />
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
      <SoundBars className="absolute bottom-3 right-3 h-14 w-16" />
    </div>
  )
}

function RingCorner() {
  return (
    <div className={`absolute inset-0 ${styles.guard}`}>
      <svg viewBox="0 0 160 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
        <rect x={4} y={20} width={8} height={80} fill={PORTAL.SEAM} />
        <line x1={10} y1={34} x2={160} y2={34} stroke={PORTAL.ORANGE} strokeWidth={1.5} />
        <line x1={10} y1={52} x2={160} y2={52} stroke={PORTAL.WHITE} strokeWidth={1.5} />
        <line x1={10} y1={70} x2={160} y2={70} stroke={PORTAL.BLUE} strokeWidth={1.5} />
      </svg>
      <div className="absolute bottom-1 left-1/3">
        <HeroCharacter profession="fighter" className={styles.hero} />
      </div>
    </div>
  )
}

interface StageLook {
  Lane: (props: { zone: LaneZone }) => ReactNode
  // His action on the lane and how he travels across it.
  pose: string
  travel: string
  // What moves with him on the track: the kit he plays, the flash of a strike.
  Companion: (() => ReactNode) | null
  Corner: () => ReactNode
}

export const PROFESSION_STAGES: Record<Profession, StageLook> = {
  engineer: { Lane: EngineerLane, pose: styles.walking, travel: styles.walk, Companion: null, Corner: DeskCorner },
  // He plays from a third of the way in, between the two rifts.
  drummer: { Lane: MusicianLane, pose: styles.drum, travel: 'translate-x-[28%]', Companion: KitInFront, Corner: KitCorner },
  fighter: { Lane: FighterLane, pose: styles.strike, travel: styles.advance, Companion: StrikeFlash, Corner: RingCorner },
}
