import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { LevelArt, LevelGround, atClass, type LevelZone, type StageLook } from '@/components/scroll/stage'
import {
  DeskCorner,
  DrumKit,
  KitCorner,
  PadHolder,
  RingCorner,
  SoundWaves,
  StrikeFlash,
  Terminal,
  ringPost,
  type DrumKitColors,
} from '@/components/scroll/stageProps'
import scene from '@/components/scroll/heroScene.module.css'
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

const PROP_SLOT = 'absolute bottom-3 left-[calc(var(--at)*100%_-_1rem)]'

// ---- the world's lane pieces, the same for every profession ----

// A dimension layer, full lane, stretched: `art` is the profession's own detail inside it.
function Dimension({ layer, base, art }: { layer: string; base: ReactNode; art: ReactNode }) {
  return (
    <LevelArt className={`${styles.dimension} ${layer} h-full w-full`}>
      {base}
      {art}
    </LevelArt>
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
          className={`absolute inset-y-2 left-[calc(var(--at)*100%_-_0.5rem)] w-4 ${styles.rift} ${atClass(position)}`}
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

// A build block, the level piece a project adds: it drops into place as he walks under it.
function BuildBlock({ position, color }: { position: number; color: string }) {
  return (
    <svg viewBox="0 0 32 32" className={`${PROP_SLOT} h-8 w-8 sm:h-10 sm:w-10 ${styles.dropAt} ${atClass(position)}`} aria-hidden="true" focusable="false">
      <rect x={2} y={2} width={28} height={28} fill={PORTAL.PANEL} stroke={color} strokeWidth={2} />
      <path d="M8 16 H24 M16 8 V24" stroke={color} strokeWidth={2} />
    </svg>
  )
}

const TERMINAL = { body: PORTAL.PANEL, screen: PORTAL.BLUE, stand: PORTAL.SEAM }

const ENGINEER_PROPS: Record<LevelZone, ReactNode> = {
  record: (
    <>
      <Terminal position={0.26} {...TERMINAL} />
      <Terminal position={0.56} {...TERMINAL} />
      <Terminal position={0.84} {...TERMINAL} />
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

function EngineerLane({ zone }: { zone: LevelZone }) {
  return (
    <>
      <Dimensions chamber={circuits(PORTAL.SEAM)} grid={circuits(PORTAL.BLUE)} pocket={circuits(PORTAL.VIOLET)} />
      <Rifts />
      <LanePortals />
      <LevelGround className="border-[#2c2a3d] bg-[#1c1b29]" />
      {ENGINEER_PROPS[zone]}
    </>
  )
}

// ---- Musician: his drum kit, the stage, sound ----

// The cymbals wobble on the crash, the world's own touch on the kit.
const KIT: DrumKitColors = { stand: PORTAL.MUTED, shell: PORTAL.PANEL, rim: PORTAL.BLUE, bass: PORTAL.ORANGE, cymbal: styles.cymbal }
const WAVES: [string, string] = [PORTAL.ORANGE, PORTAL.BLUE]

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
      <LevelGround className="border-[#2c2a3d] bg-[#1c1b29]" />
      <SoundWaves className="absolute bottom-4 right-16 h-12 w-14 sm:right-20 sm:h-16 sm:w-20" colors={WAVES} />
    </>
  )
}

// His kit, in front of him, moving with him on the track.
function KitInFront() {
  return <DrumKit className="absolute bottom-1 left-8 h-14 w-20 sm:left-10 sm:h-20 sm:w-28" colors={KIT} />
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

function FighterLane() {
  return (
    <>
      <Dimensions chamber={ringRopes(PORTAL.SEAM)} grid={ringRopes(PORTAL.GRID)} pocket={ringRopes('#3a2466')} />
      <Rifts />
      <LanePortals />
      <LevelGround className="border-[#2c2a3d] bg-[#1c1b29]" />
      {/* where his advance ends: 42% of the lane, plus his own width */}
      <PadHolder className="left-[calc(42%_+_4.5rem)] sm:left-[calc(42%_+_5.5rem)]" body={PORTAL.SEAM} pads={PORTAL.VIOLET} />
    </>
  )
}

function Strike() {
  return <StrikeFlash color={PORTAL.ORANGE} />
}

// ---- the contact corners: where each profession ends the page, beside the exit portal ----

function DeskCornerScene() {
  return (
    <DeskCorner
      hero={<HeroCharacter profession="engineer" className={scene.hero} />}
      colors={{ panel: PORTAL.PANEL, screens: [PORTAL.ORANGE, PORTAL.BLUE], desk: PORTAL.SEAM, keyboard: PORTAL.MUTED }}
    />
  )
}

function KitCornerScene() {
  return <KitCorner hero={<HeroCharacter profession="drummer" className={scene.hero} />} kit={KIT} waves={WAVES} />
}

function RingCornerScene() {
  return (
    <RingCorner
      hero={<HeroCharacter profession="fighter" className={scene.hero} />}
      side="left"
      post={ringPost('left', PORTAL.SEAM)}
      ropes={[PORTAL.ORANGE, PORTAL.WHITE, PORTAL.BLUE]}
    />
  )
}

export const PROFESSION_STAGES: Record<Profession, StageLook> = {
  engineer: { Level: EngineerLane, pose: scene.stride, travel: scene.walk, Companion: null, Corner: DeskCornerScene },
  // He plays from a third of the way in, between the two rifts.
  drummer: { Level: MusicianLane, pose: scene.drum, travel: 'translate-x-[28%]', Companion: KitInFront, Corner: KitCornerScene },
  fighter: { Level: FighterLane, pose: scene.strike, travel: scene.advance, Companion: Strike, Corner: RingCornerScene },
}
