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
  type DrumKitColors,
} from '@/components/scroll/stageProps'
import scene from '@/components/scroll/heroScene.module.css'
import { HeroCharacter } from './character'
import { SH } from './palette'
import styles from './scenes.module.css'

// The three Survival Horror stages, one per profession, each in two places: the level strip pinned
// above a section while it scrolls, and the corner of the save room at the end of the page. Every strip
// is a fixed camera room of the old house at night, fog on the floor.
// - System Engineer walks the basement corridor with his chest torch, the caged emergency lamps coming
//   on as he reaches them; the terminals (Experience) or the security monitors (Projects) along the
//   wall light their screens as he passes. He ends typing at the save room desk.
// - Musician plays his kit on the stage of a shut theatre, the footlights coming up one by one with the
//   song and the sound bars following the sticks. He ends behind his kit.
// - Martial Artist steps across the ring in the basement gym to the pads, throwing the roundhouse kick,
//   the knee and the elbow under one hanging bulb while the strip lights stutter on. He ends gloves up
//   in the corner.
// Switching profession swaps the whole stage; no prop is shared between professions.
//
// Animated elements per strip, at most 12: his travel, his moving limbs (four walking, two drumming,
// two striking), the beam, and the props that answer progress (three lamps and three screens; five
// footlights and five sound bars; two strip lights, the bulb's cone, the two pads and the strike flash).

const GROUND = 'border-[color:var(--sh-wood)] bg-[color:var(--sh-shadow)]'

function FloorFog() {
  return <div className={`absolute inset-x-0 bottom-0 h-8 ${styles.floorFog}`} aria-hidden="true" />
}

// ---- System Engineer: the basement corridor, terminals and security monitors ----

const LAMPS = [
  { position: 0.2, x: 110 },
  { position: 0.5, x: 300 },
  { position: 0.8, x: 480 },
]

const WAINSCOT = Array.from({ length: 12 }, (_, i) => 8 + i * 50)

// A caged emergency lamp on the wall: dark until he reaches it, then lit with its pool of light.
function CagedLamp({ position, x }: (typeof LAMPS)[number]) {
  return (
    <g>
      <rect x={x - 5} y={18} width={10} height={9} rx={2} fill={SH.steel} />
      <g className={`${scene.lightAt} ${atClass(position)}`}>
        <rect x={x - 3.5} y={19.5} width={7} height={6} rx={1.5} fill={SH.flame} />
        <ellipse cx={x} cy={46} rx={34} ry={26} fill={SH.flame} opacity={0.14} />
      </g>
      <path d={`M${x - 5} 21 H${x + 5} M${x - 5} 24 H${x + 5}`} stroke={SH.void} strokeWidth={0.8} />
    </g>
  )
}

function Corridor() {
  return (
    <LevelArt>
      <rect width={600} height={100} fill={SH.shadow} />
      <rect y={56} width={600} height={34} fill={SH.panel} />
      {WAINSCOT.map((x) => (
        <rect key={x} x={x} y={62} width={40} height={22} fill="none" stroke={SH.sepia} strokeWidth={1} />
      ))}
      <path d="M0 6 H600 M0 11 H600" stroke={SH.steel} strokeWidth={2} />
      <path d="M0 56 H600" stroke={SH.wood} strokeWidth={1.5} />
      {/* the far door, shut, at the end of the corridor */}
      <rect x={556} y={30} width={30} height={60} fill={SH.void} stroke={SH.wood} strokeWidth={2} />
      {LAMPS.map((lamp) => (
        <CagedLamp key={lamp.x} {...lamp} />
      ))}
    </LevelArt>
  )
}

// A security monitor on its cabinet: the screen lights as he passes.
function SecurityMonitor({ position }: { position: number }) {
  return (
    <svg
      viewBox="0 0 34 44"
      className={`absolute bottom-3 left-[calc(var(--at)*100%_-_1rem)] h-9 w-7 sm:h-12 sm:w-9 ${atClass(position)}`}
      aria-hidden="true"
      focusable="false"
    >
      <rect x={2} y={2} width={30} height={24} rx={3} fill={SH.panel} stroke={SH.steel} strokeWidth={1} />
      <rect x={5} y={5} width={24} height={17} rx={2} fill={SH.phosphor} className={scene.lightAt} />
      <rect x={6} y={26} width={22} height={18} fill={SH.wood} />
      <path d="M9 32 H25 M9 37 H25" stroke={SH.void} strokeWidth={1} />
    </svg>
  )
}

const TERMINAL = { body: SH.panel, screen: SH.phosphor, stand: SH.steel }
const ENGINEER_PROPS_AT = [0.3, 0.6, 0.9]

const ENGINEER_PROPS: Record<LevelZone, (position: number) => ReactNode> = {
  record: (position) => <Terminal key={position} position={position} {...TERMINAL} />,
  work: (position) => <SecurityMonitor key={position} position={position} />,
}

function EngineerLevel({ zone }: { zone: LevelZone }) {
  return (
    <>
      <Corridor />
      <LevelGround className={GROUND} />
      {ENGINEER_PROPS_AT.map(ENGINEER_PROPS[zone])}
      <FloorFog />
    </>
  )
}

// His torch beam, ahead of him at the height of the chest pocket.
function TorchBeam() {
  return (
    <div
      className={`absolute bottom-[1.35rem] left-[3.1rem] h-20 w-40 sm:bottom-[1.75rem] sm:left-[3.8rem] sm:h-24 sm:w-56 ${styles.beam}`}
      aria-hidden="true"
    />
  )
}

// ---- Musician: the shut theatre's stage, his kit, the footlights that answer the song ----

const KIT: DrumKitColors = { stand: SH.ash, shell: SH.leather, rim: SH.brass, bass: SH.cream }
const WAVES: [string, string] = [SH.flame, SH.brass]

const FOOTLIGHTS = [0.1, 0.3, 0.5, 0.7, 0.9]
const CURTAIN_FOLDS = [0, 14, 28, 42, 56]

function Curtain({ x, flip }: { x: number; flip: boolean }) {
  const fold = flip ? -14 : 14
  return (
    <g>
      {CURTAIN_FOLDS.map((offset) => (
        <path
          key={offset}
          d={`M${x + (flip ? -offset : offset)} 14 q${fold / 2} 40 0 76 h${fold} q${-fold / 2} -36 0 -76 Z`}
          fill={offset % 28 ? SH.leather : SH.rust}
        />
      ))}
    </g>
  )
}

function Theatre() {
  return (
    <LevelArt>
      <rect width={600} height={100} fill={SH.void} />
      <rect x={70} y={14} width={460} height={76} fill={SH.shadow} />
      <Curtain x={0} flip={false} />
      <Curtain x={600} flip />
      {/* the proscenium arch and its valance */}
      <path d="M0 0 H600 V14 H0 Z" fill={SH.wood} />
      <path d="M60 14 Q300 30 540 14" fill={SH.leather} />
      {FOOTLIGHTS.map((position) => (
        <g key={position}>
          <rect x={position * 600 - 6} y={86} width={12} height={4} fill={SH.steel} />
          <ellipse cx={position * 600} cy={80} rx={40} ry={18} fill={SH.flame} className={`${styles.glowAt} ${atClass(position)}`} />
        </g>
      ))}
    </LevelArt>
  )
}

function TheatreStage() {
  return (
    <>
      <Theatre />
      <LevelGround className={GROUND} />
      <SoundWaves className="absolute bottom-4 right-16 h-12 w-14 sm:right-24 sm:h-16 sm:w-20" colors={WAVES} />
      <FloorFog />
    </>
  )
}

// His kit, in front of him on the stage.
function KitInFront() {
  return <DrumKit className="absolute bottom-1 left-8 h-14 w-20 sm:left-10 sm:h-20 sm:w-28" colors={KIT} />
}

// ---- Martial Artist: the basement gym ring, the pads, kicks, knees, elbows ----

const BRICK_ROWS = Array.from({ length: 8 }, (_, row) => 14 + row * 9)
const STRIP_LIGHTS = [
  { position: 0.15, x: 90 },
  { position: 0.45, x: 400 },
]
const ROPES: [string, string, string] = [SH.leather, SH.cream, SH.ash]
const ROPE_HEIGHTS: [number, number, number] = [44, 58, 72]

function BasementGym() {
  return (
    <LevelArt>
      <rect width={600} height={100} fill={SH.shadow} />
      {BRICK_ROWS.map((y, row) => (
        <path key={y} d={`M0 ${y} H600 ${Array.from({ length: 20 }, (_, i) => `M${i * 30 + (row % 2) * 15} ${y} v9`).join(' ')}`} stroke={SH.panel} strokeWidth={1} />
      ))}
      {/* the strip lights on the ceiling, stuttering on as he advances */}
      {STRIP_LIGHTS.map(({ position, x }) => (
        <g key={x}>
          <rect x={x} y={4} width={90} height={5} fill={SH.steel} />
          <rect x={x + 3} y={5} width={84} height={3} fill={SH.ivory} className={`${scene.lightAt} ${atClass(position)}`} />
        </g>
      ))}
      {/* the bulb over the ring and its cone */}
      <line x1={260} y1={0} x2={260} y2={20} stroke={SH.ash} strokeWidth={1} />
      <circle cx={260} cy={22} r={3} fill={SH.flame} />
      <path d="M254 24 L200 90 H320 L266 24 Z" fill={SH.flame} className={`${styles.glowAt} ${atClass(0.05)}`} />
      {/* the heavy bag hanging at the back */}
      <line x1={520} y1={0} x2={520} y2={30} stroke={SH.ash} strokeWidth={1} />
      <rect x={510} y={30} width={20} height={40} rx={8} fill={SH.leather} />
      <rect x={4} y={34} width={6} height={56} fill={SH.wood} />
      <rect x={590} y={34} width={6} height={56} fill={SH.wood} />
      {ROPES.map((color, i) => (
        <line key={ROPE_HEIGHTS[i]} x1={0} y1={ROPE_HEIGHTS[i]} x2={600} y2={ROPE_HEIGHTS[i]} stroke={color} strokeWidth={1.5} />
      ))}
    </LevelArt>
  )
}

function GymRing() {
  return (
    <>
      <BasementGym />
      <LevelGround className="border-[color:var(--sh-ash)] bg-[color:var(--sh-panel)]" />
      {/* where his advance ends: 40% of the ring, plus his own width */}
      <PadHolder className="left-[calc(40%_+_4.5rem)] sm:left-[calc(40%_+_5.5rem)]" body={SH.ash} pads={SH.cream} />
      <FloorFog />
    </>
  )
}

function Strike() {
  return <StrikeFlash color={SH.flame} />
}

// ---- the save room corners: where each profession ends the page ----

function DeskCornerScene() {
  return (
    <DeskCorner
      hero={<HeroCharacter profession="engineer" className={scene.hero} />}
      colors={{ panel: SH.panel, screens: [SH.phosphor, SH.flame], desk: SH.wood, keyboard: SH.ash }}
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
      post={<rect x={4} y={30} width={8} height={70} fill={SH.wood} />}
      ropes={ROPES}
      ropeHeights={ROPE_HEIGHTS}
    >
      <rect x={0} y={92} width={160} height={8} fill={SH.panel} />
    </RingCorner>
  )
}

export const PROFESSION_STAGES: Record<Profession, StageLook> = {
  engineer: { Level: EngineerLevel, pose: scene.stride, travel: scene.walk, Companion: TorchBeam, Corner: DeskCornerScene },
  // He plays centre stage, between the curtains.
  drummer: { Level: TheatreStage, pose: scene.drum, travel: 'translate-x-[30%]', Companion: KitInFront, Corner: KitCornerScene },
  fighter: { Level: GymRing, pose: scene.strike, travel: scene.advance, Companion: Strike, Corner: RingCornerScene },
}
