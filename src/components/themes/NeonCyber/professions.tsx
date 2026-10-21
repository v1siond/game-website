import type { Profession } from '@/lib/cv/professions'
import { at, type LevelZone, type StageLook } from '@/components/scroll/stage'
import { DeskCorner, DrumKit, KitCorner, PadHolder, SoundWaves, StrikeFlash, Terminal, type DrumKitColors } from '@/components/scroll/stageProps'
import scene from '@/components/scroll/heroScene.module.css'
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

const TERMINAL = { body: '#2a1840', screen: CYAN, stand: '#3a2456' }

function Rooftop({ zone }: { zone: LevelZone }) {
  return (
    <>
      <Skyline />
      <Ground edge="border-cyan-400" />
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

const KIT: DrumKitColors = { stand: '#8a8a92', shell: '#2a1840', rim: CYAN, bass: MAGENTA }
const WAVES: [string, string] = [MAGENTA, CYAN]

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
      <SoundWaves className="absolute bottom-4 right-4 h-12 w-14 sm:h-16 sm:w-20" colors={WAVES} />
    </>
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
      <PadHolder className="left-[calc(38%_+_4.5rem)] sm:left-[calc(38%_+_5.5rem)]" body="#2d2a3d" pads={HOT_PINK} />
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
      colors={{ panel: '#2a1840', screens: [CYAN, MAGENTA], desk: '#3a2456', keyboard: '#8a8a92' }}
    />
  )
}

function KitCornerScene() {
  return <KitCorner hero={<HeroCharacter profession="drummer" className={scene.hero} />} kit={KIT} waves={WAVES} />
}

function RingCorner() {
  return (
    <div className={`absolute inset-0 ${scene.guard}`}>
      <svg viewBox="0 0 160 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
        <rect x={146} y={20} width={8} height={80} fill="#3a2456" />
        <line x1={0} y1={34} x2={150} y2={34} stroke={HOT_PINK} strokeWidth={1.5} />
        <line x1={0} y1={52} x2={150} y2={52} stroke="#e0f0ff" strokeWidth={1.5} />
        <line x1={0} y1={70} x2={150} y2={70} stroke={CYAN} strokeWidth={1.5} />
      </svg>
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
        <HeroCharacter profession="fighter" className={scene.hero} />
      </div>
    </div>
  )
}

export const PROFESSION_STAGES: Record<Profession, StageLook> = {
  engineer: { Level: Rooftop, pose: scene.stride, travel: styles.runner, Companion: null, Corner: DeskCornerScene },
  drummer: { Level: Stage, pose: scene.drum, travel: styles.planted, Companion: KitInFront, Corner: KitCornerScene },
  fighter: { Level: Ring, pose: scene.strike, travel: styles.advance, Companion: Strike, Corner: RingCorner },
}
