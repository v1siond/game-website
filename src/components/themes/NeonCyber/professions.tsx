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
import styles from './scenes.module.css'
import { NEON } from './palette'

// The three Neon Cyber stages, one per profession, each in two places: the level strip that runs above
// a section while it scrolls, and the corner of the contact scene. System Engineer runs a rooftop of
// terminals and billboards and ends at his desk; Musician plays his kit on a neon stage with sound
// waves; Martial Artist works the pads in a ring, kick, knee and elbow. A profession's stage holds only
// its own props, so switching profession swaps all of it.
//
// Animated element budget per strip, at most 11: far and mid layers, his travel, his moving limbs (four
// running, two drumming or striking) and the props that answer progress (three terminal screens or
// billboards, two beams and five waves, one strike flash). Everything else here is static.

const VOID = NEON.void
const MAGENTA = NEON.magenta
const CYAN = NEON.cyan
const HOT_PINK = NEON.hotPink
const YELLOW = NEON.yellow

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
      <LevelArt className={`absolute inset-y-0 left-0 h-full w-[120%] ${scene.far}`}>
        {FAR_TOWERS.map(({ x, width, height }) => (
          <g key={x}>
            <rect x={x} y={100 - height} width={width} height={height} fill={NEON.street} />
            <rect x={x + 4} y={104 - height} width={2} height={2} fill={CYAN} opacity={0.5} />
            <rect x={x + width - 7} y={112 - height} width={2} height={2} fill={MAGENTA} opacity={0.5} />
          </g>
        ))}
      </LevelArt>
      <LevelArt className={`absolute inset-y-0 left-0 h-full w-[140%] ${scene.mid}`}>
        {MID_TOWERS.map(({ x, width, height }) => (
          <g key={x}>
            <rect x={x} y={100 - height * 0.8} width={width} height={height * 0.8} fill={NEON.tower} />
            <line x1={x} y1={100 - height * 0.8} x2={x + width} y2={100 - height * 0.8} stroke={MAGENTA} strokeWidth={0.8} />
          </g>
        ))}
        <rect x={210} y={22} width={60} height={26} fill={VOID} stroke={CYAN} strokeWidth={1.2} />
        <line x1={240} y1={48} x2={240} y2={70} stroke={NEON.steel} strokeWidth={3} />
      </LevelArt>
    </>
  )
}

// A billboard on the roof edge: it lights as he passes under it.
function Billboard({ position, color }: { position: number; color: string }) {
  return (
    <svg
      viewBox="0 0 48 44"
      className={`absolute bottom-3 left-[calc(var(--at)*100%_-_1.5rem)] h-10 w-11 sm:h-14 sm:w-16 ${atClass(position)}`}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M14 26 V44 M34 26 V44" stroke={NEON.steel} strokeWidth={2} />
      <g className={scene.lightAt}>
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

const TERMINAL = { body: NEON.panel, screen: CYAN, stand: NEON.steel }

function Rooftop({ zone }: { zone: LevelZone }) {
  return (
    <>
      <Skyline />
      <LevelGround className="border-cyan-400 bg-[color:var(--neon-alley)]" />
      <CircuitLedge />
      {zone === 'record' ? (
        <>
          <Terminal position={0.32} {...TERMINAL} />
          <Terminal position={0.62} {...TERMINAL} />
          <Terminal position={0.92} {...TERMINAL} />
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

const KIT: DrumKitColors = { stand: NEON.chrome, shell: NEON.panel, rim: CYAN, bass: MAGENTA }
const WAVES: [string, string] = [MAGENTA, CYAN]

function Stage() {
  return (
    <>
      <LevelArt className={`absolute inset-y-0 left-0 h-full w-[120%] ${scene.far}`}>
        {FAR_TOWERS.map(({ x }) => (
          <g key={x} fill={NEON.street}>
            <circle cx={x + 8} cy={84} r={6} />
            <rect x={x + 2} y={88} width={12} height={12} />
            <circle cx={x + 22} cy={86} r={5} />
          </g>
        ))}
      </LevelArt>
      <LevelArt className={`absolute inset-y-0 left-0 h-full w-[140%] ${scene.mid}`}>
        <line x1={0} y1={6} x2={600} y2={6} stroke={NEON.steel} strokeWidth={3} />
        <polygon points="150,6 120,96 180,96" fill={MAGENTA} opacity={0.12} className={styles.beam} />
        <polygon points="390,6 360,96 420,96" fill={CYAN} opacity={0.12} className={styles.beam} />
        <rect x={60} y={50} width={30} height={50} fill={NEON.alley} stroke={NEON.steel} />
        <rect x={500} y={50} width={30} height={50} fill={NEON.alley} stroke={NEON.steel} />
      </LevelArt>
      <LevelGround className="border-pink-500 bg-[color:var(--neon-alley)]" />
      <SoundWaves className="absolute bottom-4 right-4 h-12 w-14 sm:h-16 sm:w-20" colors={WAVES} />
    </>
  )
}

function Ring() {
  return (
    <>
      <LevelArt className={`absolute inset-y-0 left-0 h-full w-[120%] ${scene.far}`}>
        {FAR_TOWERS.map(({ x }) => (
          <circle key={x} cx={x + 12} cy={12} r={2} fill={YELLOW} opacity={0.6} />
        ))}
        <rect x={0} y={70} width={600} height={30} fill={NEON.street} />
      </LevelArt>
      <LevelArt className={`absolute inset-y-0 left-0 h-full w-[140%] ${scene.mid}`}>
        {[40, 290, 540].map((x) => (
          <rect key={x} x={x} y={30} width={6} height={70} fill={NEON.steel} />
        ))}
        <line x1={0} y1={40} x2={600} y2={40} stroke={HOT_PINK} strokeWidth={1.5} />
        <line x1={0} y1={56} x2={600} y2={56} stroke={NEON.ice} strokeWidth={1.5} />
        <line x1={0} y1={72} x2={600} y2={72} stroke={CYAN} strokeWidth={1.5} />
      </LevelArt>
      <LevelGround className="border-cyan-400 bg-[color:var(--neon-alley)]" />
      <PadHolder className="left-[calc(38%_+_4.5rem)] sm:left-[calc(38%_+_5.5rem)]" body={NEON.jeans} pads={HOT_PINK} />
    </>
  )
}

function Strike() {
  return <StrikeFlash color={YELLOW} />
}

function KitInFront() {
  return <DrumKit className="absolute bottom-1 left-6 h-14 w-20 sm:left-8 sm:h-20 sm:w-28" colors={KIT} />
}

// The contact corners: where each profession ends the page.
function DeskCornerScene() {
  return (
    <DeskCorner
      hero={<HeroCharacter profession="engineer" className={scene.hero} />}
      colors={{ panel: NEON.panel, screens: [CYAN, MAGENTA], desk: NEON.steel, keyboard: NEON.chrome }}
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
      side="right"
      post={ringPost('right', NEON.steel)}
      ropes={[HOT_PINK, NEON.ice, CYAN]}
      heroPlace="left-1/2 -translate-x-1/2"
    />
  )
}

export const PROFESSION_STAGES: Record<Profession, StageLook> = {
  engineer: { Level: Rooftop, pose: scene.stride, travel: scene.walk, Companion: null, Corner: DeskCornerScene },
  drummer: { Level: Stage, pose: scene.drum, travel: styles.planted, Companion: KitInFront, Corner: KitCornerScene },
  fighter: { Level: Ring, pose: scene.strike, travel: scene.advance, Companion: Strike, Corner: RingCornerScene },
}
