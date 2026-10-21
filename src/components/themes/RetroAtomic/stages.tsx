import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { atClass, type LevelZone, type StageLook } from '@/components/scroll/stage'
import { DeskCorner, DrumKit, KitCorner, StrikeFlash, Terminal, type DrumKitColors } from '@/components/scroll/stageProps'
import scene from '@/components/scroll/heroScene.module.css'
import { HeroCharacter } from './character'
import {
  CASING,
  CHROME,
  LAMP_GLOW,
  ROCKET_RED,
  PHOSPHOR_GREEN,
  PHOSPHOR_GREEN_DARK,
  SCREEN_BG,
  STEEL,
  STEEL_EDGE,
  STEEL_LIGHT,
  TERMINAL_AMBER,
  BUNKER_BG,
  SHELTER_BLUE,
  SHELTER_BLUE_DARK,
  ATOMIC_YELLOW,
  VELVET,
  VELVET_FOLD,
} from './palette'
import styles from './scenes.module.css'

// Retro Atomic's three profession stages on the shared stage (src/components/scroll/stage.tsx), each in
// two places: the level strip pinned above a section while it scrolls, and his corner behind the round
// hatch of the contact scene. A level is a side cut through a shelter, three rooms in a row:
// - System Engineer walks the lab rooms, a hatch sliding up before him at each bulkhead, past green
//   terminals that power on (Experience) or tape reel mainframes that run (Projects), and ends typing.
// - Musician plays his red kit on the lounge stage: the curtain parts, the spotlights come on in turn,
//   the amp's valves glow and its meter needle jumps with the stick hits.
// - Martial Artist crosses the bunker gym ring to a tin robot holding the pads and works the roundhouse
//   kick, the knee and the elbow, an atomic yellow flash on each strike; he ends gloves up in his corner.
// Switching profession swaps the whole stage; no prop is shared between professions.
//
// Animated elements per strip, at most 18: three lamps or spotlights, two hatches or the curtain halves,
// his travel and four swinging limbs, and the props that answer (three terminals or six reels; the
// needle, three valves and two cymbals; the strike flash and the robot's two pads).

// A prop standing on the floor at --at along the level.
const PROP_SLOT = 'absolute bottom-3 left-[calc(var(--at)*100%_-_1rem)]'

// ---- the shelter pieces every level is built from ----

function Wall({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 600 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

function Floor({ tone }: { tone: string }) {
  return <div className={`absolute inset-x-0 bottom-0 h-3 border-t-2 border-[#5a5e50] ${tone}`} aria-hidden="true" />
}

// One lamp per room, each switching on as he enters its room (the rooms start at 0, 1/3 and 2/3).
const ROOM_LAMPS = [
  { place: 'left-[16%]', enters: 0 },
  { place: 'left-1/2', enters: 1 / 3 },
  { place: 'left-[84%]', enters: 2 / 3 },
]

function RoomLamps({ glow }: { glow: string }) {
  return (
    <>
      {ROOM_LAMPS.map(({ place, enters }) => (
        <svg
          key={place}
          viewBox="0 0 40 100"
          preserveAspectRatio="none"
          className={`absolute top-0 h-[88%] w-16 -translate-x-1/2 sm:w-24 ${place} ${atClass(enters)}`}
          aria-hidden="true"
          focusable="false"
        >
          <rect x={15} y={0} width={10} height={6} fill={STEEL_EDGE} />
          <g opacity={0.24}>
            <polygon points="14,6 26,6 40,100 0,100" fill={glow} className={scene.lightAt} />
          </g>
        </svg>
      ))}
    </>
  )
}

// A bulkhead between two rooms: a steel frame and a hazard striped hatch that slides up into the
// ceiling as he reaches it.
function Bulkheads() {
  return (
    <>
      {[1 / 3, 2 / 3].map((position) => (
        <div
          key={position}
          className={`absolute inset-y-0 left-[calc(var(--at)*100%_-_0.6rem)] w-5 sm:w-6 ${atClass(position)}`}
          aria-hidden="true"
        >
          <div className="absolute inset-y-0 -left-1 w-1.5 bg-[#5a5e50]" />
          <div className="absolute inset-y-0 -right-1 w-1.5 bg-[#5a5e50]" />
          <svg
            viewBox="0 0 20 100"
            preserveAspectRatio="none"
            className={`absolute inset-x-0 top-0 h-[calc(100%_-_0.75rem)] w-full ${styles.hatch}`}
            focusable="false"
          >
            <rect width={20} height={100} fill={SHELTER_BLUE_DARK} />
            <path d="M0 10 L20 0 V8 L0 18 Z M0 82 L20 72 V80 L0 90 Z" fill={ATOMIC_YELLOW} />
            <circle cx={10} cy={46} r={4} fill="none" stroke={CHROME} strokeWidth={1.5} />
          </svg>
        </div>
      ))}
    </>
  )
}

// ---- System Engineer: the lab, terminals, circuits, tape reel mainframes ----

const LAB_PANELS = Array.from({ length: 12 }, (_, i) => i * 50)

function LabWall() {
  return (
    <Wall>
      <rect width={600} height={100} fill={BUNKER_BG} />
      {LAB_PANELS.map((x) => (
        <rect key={x} x={x + 2} y={12} width={46} height={60} fill={STEEL} stroke={STEEL_LIGHT} strokeWidth={1} />
      ))}
      <rect y={3} width={600} height={5} fill={SHELTER_BLUE_DARK} />
      <path d="M0 80 H90 L98 72 H230 M260 82 H340 L348 74 H460 M500 80 H600" stroke={PHOSPHOR_GREEN_DARK} strokeWidth={1.2} fill="none" />
    </Wall>
  )
}

// A tape reel mainframe, the machine a project runs on: its two reels turn while the level advances.
function Mainframe({ position }: { position: number }) {
  return (
    <svg viewBox="0 0 36 52" className={`${PROP_SLOT} h-14 w-10 sm:h-20 sm:w-14 ${atClass(position)}`} aria-hidden="true" focusable="false">
      <rect x={1} y={1} width={34} height={50} rx={2} fill={CASING} />
      <rect x={4} y={4} width={28} height={22} fill={SCREEN_BG} />
      {[11, 25].map((cx) => (
        <g key={cx} className={styles.reel}>
          <circle cx={cx} cy={15} r={6} fill="none" stroke={CHROME} strokeWidth={2} />
          <path d={`M${cx} 9 V21 M${cx - 6} 15 H${cx + 6}`} stroke={CHROME} strokeWidth={1.2} />
        </g>
      ))}
      <rect x={6} y={31} width={4} height={3} fill={TERMINAL_AMBER} />
      <rect x={13} y={31} width={4} height={3} fill={PHOSPHOR_GREEN} />
      <rect x={20} y={31} width={4} height={3} fill={ROCKET_RED} />
      <path d="M5 40 H31 M5 44 H31" stroke={STEEL} strokeWidth={1.5} />
    </svg>
  )
}

const PROP_POSITIONS = [0.2, 0.52, 0.84]

const ENGINEER_PROPS: Record<LevelZone, ReactNode> = {
  record: PROP_POSITIONS.map((position) => (
    <Terminal key={position} position={position} body={CASING} screen={PHOSPHOR_GREEN} stand={STEEL_EDGE} />
  )),
  work: PROP_POSITIONS.map((position) => <Mainframe key={position} position={position} />),
}

function EngineerLevel({ zone }: { zone: LevelZone }) {
  return (
    <>
      <LabWall />
      <RoomLamps glow={PHOSPHOR_GREEN} />
      <Bulkheads />
      <Floor tone="bg-[#23261f]" />
      {ENGINEER_PROPS[zone]}
    </>
  )
}

// ---- Musician: the lounge stage, his kit, sound ----

const KIT: DrumKitColors = {
  stand: CHROME,
  shell: ROCKET_RED,
  rim: CHROME,
  bass: ATOMIC_YELLOW,
  cymbal: styles.cymbal,
}

const CURTAIN_FOLDS = Array.from({ length: 20 }, (_, i) => i * 30)

function LoungeWall() {
  return (
    <Wall>
      <rect width={600} height={100} fill={VELVET_FOLD} />
      {CURTAIN_FOLDS.map((x) => (
        <rect key={x} x={x + 4} y={0} width={14} height={100} fill={VELVET} />
      ))}
      <rect y={0} width={600} height={7} fill={ATOMIC_YELLOW} opacity={0.7} />
    </Wall>
  )
}

// The valve amp beside the stage: three glowing valves and the level meter whose needle jumps on the hits.
function ValveAmp() {
  return (
    <svg
      viewBox="0 0 48 44"
      className="absolute bottom-3 right-3 h-12 w-14 sm:right-6 sm:h-16 sm:w-20"
      aria-hidden="true"
      focusable="false"
    >
      <rect x={1} y={1} width={46} height={42} rx={4} fill={CASING} />
      <rect x={5} y={5} width={22} height={14} rx={2} fill={LAMP_GLOW} />
      <path d="M8 16 A9 9 0 0 1 24 16" stroke={STEEL} strokeWidth={1} fill="none" />
      <rect x={15.5} y={8} width={1.5} height={10} fill={ROCKET_RED} className={styles.needle} />
      {[32, 37, 42].map((x) => (
        <rect key={x} x={x - 1.5} y={6} width={3} height={12} rx={1.5} fill={TERMINAL_AMBER} className={styles.valve} />
      ))}
      <rect x={5} y={24} width={38} height={15} rx={2} fill={STEEL} />
      <path d="M8 28 H40 M8 32 H40 M8 36 H40" stroke={STEEL_EDGE} strokeWidth={1} />
    </svg>
  )
}

// The stage curtain, in front of him and the kit, parting as the song starts.
function StageCurtain() {
  return (
    <div className="absolute inset-0 z-10 flex" aria-hidden="true">
      <div className={`h-full w-1/2 border-r-4 border-[#3d0a15] bg-[#5a1020] ${styles.curtainLeft}`} />
      <div className={`h-full w-1/2 border-l-4 border-[#3d0a15] bg-[#5a1020] ${styles.curtainRight}`} />
    </div>
  )
}

const SPOTLIGHTS = [
  { place: 'left-[22%]', on: 0.15 },
  { place: 'left-1/2', on: 0.35 },
  { place: 'left-[78%]', on: 0.55 },
]

function MusicianLevel() {
  return (
    <>
      <LoungeWall />
      {SPOTLIGHTS.map(({ place, on }) => (
        <svg
          key={place}
          viewBox="0 0 40 100"
          preserveAspectRatio="none"
          className={`absolute top-0 h-full w-20 -translate-x-1/2 sm:w-28 ${place} ${atClass(on)}`}
          aria-hidden="true"
          focusable="false"
        >
          <g opacity={0.3}>
            <polygon points="16,0 24,0 40,100 0,100" fill={LAMP_GLOW} className={scene.lightAt} />
          </g>
        </svg>
      ))}
      <Floor tone="bg-[#4a3728]" />
      <ValveAmp />
      <StageCurtain />
    </>
  )
}

function KitInFront() {
  return <DrumKit className="absolute bottom-1 left-8 h-14 w-20 sm:left-10 sm:h-20 sm:w-28" colors={KIT} />
}

// ---- Martial Artist: the bunker gym ring, the pads, kicks, knees, elbows ----

const GYM_BLOCKS = Array.from({ length: 15 }, (_, i) => i * 40)

function GymWall() {
  return (
    <Wall>
      <rect width={600} height={100} fill={STEEL} />
      {GYM_BLOCKS.map((x) => (
        <g key={x}>
          <rect x={x + 1} y={8} width={38} height={18} fill={STEEL_LIGHT} />
          <rect x={x - 19} y={28} width={38} height={18} fill={STEEL_LIGHT} />
        </g>
      ))}
      <path d="M0 58 H600" stroke={ATOMIC_YELLOW} strokeWidth={4} strokeDasharray="14 10" />
      {[30, 570].map((x) => (
        <rect key={x} x={x} y={28} width={6} height={72} fill={CHROME} />
      ))}
      <line x1={0} y1={44} x2={600} y2={44} stroke={ROCKET_RED} strokeWidth={1.5} />
      <line x1={0} y1={60} x2={600} y2={60} stroke={CHROME} strokeWidth={1.5} />
      <line x1={0} y1={76} x2={600} y2={76} stroke={SHELTER_BLUE} strokeWidth={1.5} />
    </Wall>
  )
}

// The tin robot holding the pads, facing him where his advance ends (40% of the level plus his width):
// a box head with a bulb antenna and lamp eyes, a barrel body on treads, a red pad in each claw. The
// pads give with his strikes (the shared padHigh and padLow read the strip's --kick, --knee, --elbow).
function PadRobot() {
  return (
    <svg
      viewBox="0 0 40 96"
      className="absolute bottom-3 left-[calc(40%_+_4.5rem)] h-24 w-10 sm:left-[calc(40%_+_5.5rem)] sm:h-[7.5rem] sm:w-12"
      aria-hidden="true"
      focusable="false"
    >
      <line x1={22} y1={2} x2={22} y2={12} stroke={CHROME} strokeWidth={1.5} />
      <circle cx={22} cy={3} r={2.5} fill={ROCKET_RED} />
      <rect x={12} y={12} width={20} height={16} rx={3} fill={CHROME} />
      <circle cx={17} cy={20} r={2.5} fill={TERMINAL_AMBER} />
      <circle cx={27} cy={20} r={2.5} fill={TERMINAL_AMBER} />
      <rect x={11} y={31} width={22} height={34} rx={8} fill={CASING} />
      <path d="M13 42 H31 M13 50 H31 M11 38 H4 M11 58 H4" stroke={STEEL_EDGE} strokeWidth={1.5} />
      <rect x={8} y={68} width={28} height={22} rx={6} fill={STEEL_LIGHT} />
      <circle cx={14} cy={84} r={3} fill={STEEL_EDGE} />
      <circle cx={30} cy={84} r={3} fill={STEEL_EDGE} />
      <rect x={0} y={32} width={8} height={14} rx={3} fill={ROCKET_RED} className={scene.padHigh} />
      <rect x={0} y={52} width={8} height={16} rx={3} fill={ROCKET_RED} className={scene.padLow} />
    </svg>
  )
}

function FighterLevel() {
  return (
    <>
      <GymWall />
      <RoomLamps glow={LAMP_GLOW} />
      <Floor tone="bg-[#3d4136]" />
      <PadRobot />
    </>
  )
}

function AtomicFlash() {
  return <StrikeFlash color={ATOMIC_YELLOW} />
}

// ---- the contact corners: where each profession ends the page, behind the round hatch ----

function EngineerCorner() {
  return (
    <DeskCorner
      hero={<HeroCharacter profession="engineer" className={scene.hero} />}
      colors={{
        panel: CASING,
        screens: [PHOSPHOR_GREEN, TERMINAL_AMBER],
        desk: STEEL_EDGE,
        keyboard: CASING,
      }}
    />
  )
}

function MusicianCorner() {
  return <KitCorner hero={<HeroCharacter profession="drummer" className={scene.hero} />} kit={KIT} waves={[TERMINAL_AMBER, PHOSPHOR_GREEN]} />
}

function RingCorner() {
  return (
    <div className={`absolute inset-0 ${scene.guard}`}>
      <svg viewBox="0 0 160 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
        <rect x={4} y={20} width={8} height={80} fill={CHROME} />
        <line x1={10} y1={34} x2={160} y2={34} stroke={ROCKET_RED} strokeWidth={1.5} />
        <line x1={10} y1={52} x2={160} y2={52} stroke={CHROME} strokeWidth={1.5} />
        <line x1={10} y1={70} x2={160} y2={70} stroke={SHELTER_BLUE} strokeWidth={1.5} />
      </svg>
      <div className="absolute bottom-1 left-1/3">
        <HeroCharacter profession="fighter" className={scene.hero} />
      </div>
    </div>
  )
}

export const PROFESSION_STAGES: Record<Profession, StageLook> = {
  engineer: {
    Level: EngineerLevel,
    pose: scene.stride,
    travel: styles.walk,
    Companion: null,
    Corner: EngineerCorner,
  },
  drummer: {
    Level: MusicianLevel,
    pose: scene.drum,
    travel: styles.onStage,
    Companion: KitInFront,
    Corner: MusicianCorner,
  },
  fighter: {
    Level: FighterLevel,
    pose: scene.strike,
    travel: styles.advance,
    Companion: AtomicFlash,
    Corner: RingCorner,
  },
}
