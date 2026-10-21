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
import { Crystal, RestPoint } from './art'
import { SOUL } from './palette'
import styles from './scenes.module.css'

// Soul Map's three profession stages on the shared stage (src/components/scroll/stage.tsx), each in two
// places: the level strip pinned above a section while it scrolls, and his corner in the contact scene.
// A level is a side view of a deep blue cavern in a map exploration game:
// - System Engineer crosses the caverns under the map: each room of the map above him has its fog lift
//   as he walks into it and the glowing path to the next room lights behind him; terminals wake on the
//   cavern floor (Experience) or crystal clusters light up (Projects), and the lantern of the rest point
//   at the far end comes on as he reaches it. He ends typing at his desk.
// - Musician plays his kit in the echo hall: the hanging lanterns light in turn, the wall crystals glow
//   on the stick hits, an echo ring swells behind the kit and the sound bars rise with the sticks. He
//   ends behind his kit.
// - Martial Artist crosses the arena chamber between two stone pillars to the pads and works the
//   roundhouse kick, the knee and the elbow; the floor runes flare on every strike while the pads give.
//   He ends gloves up in his corner.
// Switching profession swaps the whole stage; no prop is shared between professions.
//
// Animated elements per strip, at most 19: his walk and four limbs, the motes, three room fogs, three
// room fills, three paths, three terminals or crystals and the rest point's lantern (engineer); four
// limbs, three lanterns, three crystals, the echo ring and five sound bars (musician); his advance and
// four limbs, the motes, the runes, two pads and the strike flash (fighter).

// A prop standing on the cavern floor at its place along the level.
const PROP_SLOT = 'absolute bottom-3 left-[calc(var(--at)*100%_-_1rem)]'

// Where the map's rooms are, and the props under them.
const STOPS = [0.24, 0.54, 0.84]

const STALACTITES = 'M0 0 H600 V6 L580 18 L560 6 L530 26 L505 8 L470 14 L440 4 L410 30 L385 8 L350 16 L320 4 L290 24 L265 6 L230 14 L200 4 L170 28 L145 8 L110 16 L80 4 L55 22 L30 6 L0 12 Z'

// The cavern every level stands in: the blue dark, the far rock arches and the stalactites above.
function Cavern({ children = null }: { children?: ReactNode }) {
  return (
    <LevelArt>
      <rect x={-2} y={-2} width={604} height={104} fill={SOUL.deep} />
      <path d="M0 100 V58 Q60 30 120 58 Q180 26 240 56 Q300 34 360 58 Q420 28 480 56 Q540 32 600 58 V100 Z" fill={SOUL.cavern} />
      <path d={STALACTITES} fill={SOUL.ink} />
      {children}
    </LevelArt>
  )
}

const MOTES = [
  [40, 70],
  [120, 86],
  [190, 64],
  [270, 92],
  [350, 72],
  [430, 88],
  [500, 66],
  [570, 84],
]

// Soft motes of light, taller than the strip so they can rise through it while he crosses.
function Motes() {
  return (
    <LevelArt className={`absolute inset-x-0 top-0 h-[140%] w-full ${styles.motes}`}>
      {MOTES.map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r={1.1} fill={SOUL.glow} opacity={0.7} />
      ))}
    </LevelArt>
  )
}

function CavernFloor() {
  return <LevelGround className="border-[var(--soul-glow-deep)] bg-[var(--soul-rock)]" />
}

// ---- System Engineer: the cavern crossing under the map ----

const ROOM = { width: 44, height: 16, y: 10 }

// One room of the map at a stop: its wall, its fill that lights as he enters, the fog that lifts off it.
function MapRoom({ position }: { position: number }) {
  const x = position * 600 - ROOM.width / 2

  return (
    <g className={atClass(position)}>
      <rect x={x} y={ROOM.y} width={ROOM.width} height={ROOM.height} fill={SOUL.cavern} stroke={SOUL.glow} strokeWidth={1} />
      <rect x={x + 3} y={ROOM.y + 3} width={ROOM.width - 6} height={ROOM.height - 6} fill={SOUL.glowDeep} className={scene.lightAt} />
      <rect x={x - 1} y={ROOM.y - 1} width={ROOM.width + 2} height={ROOM.height + 2} fill={SOUL.abyss} className={styles.fogLift} />
    </g>
  )
}

// The path into a room lights just before he reaches it.
function MapPath({ from, to }: { from: number; to: number }) {
  return (
    <g className={atClass(to - 0.1)}>
      <line
        x1={from * 600 + ROOM.width / 2}
        y1={ROOM.y + ROOM.height / 2}
        x2={to * 600 - ROOM.width / 2}
        y2={ROOM.y + ROOM.height / 2}
        stroke={SOUL.glow}
        strokeWidth={1.5}
        className={scene.lightAt}
      />
    </g>
  )
}

// The map above the cavern: the room he starts in is already drawn, the rest wait under fog.
function CavernMap() {
  const rooms = [0.05, ...STOPS]

  return (
    <LevelArt>
      <rect x={30 - ROOM.width / 2} y={ROOM.y} width={ROOM.width} height={ROOM.height} fill={SOUL.glowDeep} stroke={SOUL.glow} strokeWidth={1} />
      {rooms.slice(1).map((to, i) => (
        <MapPath key={to} from={rooms[i]} to={to} />
      ))}
      {STOPS.map((position) => (
        <MapRoom key={position} position={position} />
      ))}
    </LevelArt>
  )
}

const TERMINAL = { body: SOUL.rock, screen: SOUL.glow, stand: SOUL.ridge }

function WallCrystal({ position }: { position: number }) {
  return <Crystal className={`${PROP_SLOT} h-10 w-8 sm:h-14 sm:w-10 ${scene.lightAt} ${atClass(position)}`} />
}

const ENGINEER_PROPS: Record<LevelZone, ReactNode> = {
  record: STOPS.map((position) => <Terminal key={position} position={position} {...TERMINAL} />),
  work: STOPS.map((position) => <WallCrystal key={position} position={position} />),
}

function EngineerLevel({ zone }: { zone: LevelZone }) {
  return (
    <>
      <Cavern />
      <Motes />
      <CavernMap />
      {ENGINEER_PROPS[zone]}
      <RestPoint className={`absolute bottom-3 right-1 h-12 w-12 sm:h-16 sm:w-16 ${atClass(0.92)}`} lit={scene.lightAt} />
      <CavernFloor />
    </>
  )
}

// ---- Musician: the echo hall, its lanterns, crystals and his kit ----

const KIT: DrumKitColors = { stand: SOUL.ridge, shell: SOUL.rock, rim: SOUL.glow, bass: SOUL.rose, cymbalsTip: true }
const WAVES: [string, string] = [SOUL.rose, SOUL.glow]

const HALL_LANTERNS = [
  { position: 0.2, x: 120 },
  { position: 0.5, x: 300 },
  { position: 0.8, x: 480 },
]

// Each crystal's --phase as a literal class, so the build generates all three.
const HALL_CRYSTALS = [
  { place: 'left-[8%]', phase: '[--phase:0turn]' },
  { place: 'left-[46%]', phase: '[--phase:0.33turn]' },
  { place: 'left-[64%]', phase: '[--phase:0.66turn]' },
]

function EchoHall() {
  return (
    <>
      <Cavern>
        <path d="M150 100 V54 Q300 -6 450 54 V100 Z" fill={SOUL.rock} opacity={0.6} />
        {HALL_LANTERNS.map(({ position, x }) => (
          <g key={x} className={atClass(position)}>
            <line x1={x} y1={0} x2={x} y2={22} stroke={SOUL.ridge} strokeWidth={1} />
            <polygon points={`${x - 6},22 ${x + 6},22 ${x + 40},96 ${x - 40},96`} fill={SOUL.lantern} opacity={0.14} className={scene.lightAt} />
            <rect x={x - 4} y={22} width={8} height={9} rx={1.5} fill={SOUL.lantern} className={scene.lightAt} />
          </g>
        ))}
        <rect x={-2} y={88} width={604} height={14} fill={SOUL.rockLight} />
      </Cavern>
      {HALL_CRYSTALS.map(({ place, phase }) => (
        <Crystal key={place} className={`absolute bottom-3 h-10 w-7 sm:h-14 sm:w-10 ${place} ${styles.pulse} ${phase}`} color={SOUL.rose} />
      ))}
      <SoundWaves className="absolute bottom-4 right-4 h-12 w-14 sm:right-8 sm:h-16 sm:w-20" colors={WAVES} />
    </>
  )
}

// The kit he plays, with the echo ring swelling behind it.
function KitInFront() {
  return (
    <>
      <svg viewBox="0 0 40 40" className="absolute bottom-0 left-6 h-20 w-20 sm:h-28 sm:w-28" aria-hidden="true" focusable="false">
        <circle cx={20} cy={20} r={18} fill="none" stroke={SOUL.glow} strokeWidth={1} className={styles.echo} />
      </svg>
      <DrumKit className="absolute bottom-1 left-8 h-14 w-20 sm:left-10 sm:h-20 sm:w-28" colors={KIT} />
    </>
  )
}

// ---- Martial Artist: the arena chamber, the pads, kicks, knees, elbows ----

const ROPES: [string, string, string] = [SOUL.ember, SOUL.mist, SOUL.glow]

const pillarAt = (x: number) => (
  <g key={x}>
    <rect x={x - 7} y={24} width={14} height={66} fill={SOUL.rockLight} />
    <rect x={x - 9} y={20} width={18} height={6} fill={SOUL.ridge} />
    <rect x={x - 2} y={30} width={4} height={8} fill={SOUL.glow} opacity={0.8} />
  </g>
)

function ArenaChamber() {
  return (
    <>
      <Cavern>
        {[30, 570].map(pillarAt)}
        {ROPES.map((color, i) => (
          <line key={color} x1={37} y1={44 + i * 14} x2={563} y2={44 + i * 14} stroke={color} strokeWidth={1.5} />
        ))}
        <rect x={-2} y={88} width={604} height={14} fill={SOUL.rockLight} />
      </Cavern>
      <Motes />
      {/* the floor runes under the pads, flaring on each strike (the strip carries the strikes) */}
      <svg viewBox="0 0 80 12" className={`absolute bottom-2 left-[calc(40%_+_2rem)] h-4 w-28 sm:w-36 ${scene.impact}`} aria-hidden="true" focusable="false">
        <ellipse cx={40} cy={6} rx={38} ry={5} fill="none" stroke={SOUL.glow} strokeWidth={1.2} />
        <path d="M20 6 H28 M36 3 V9 M44 3 L48 9 M54 6 H62" stroke={SOUL.glow} strokeWidth={1.2} />
      </svg>
      {/* where his advance ends: 40% of the strip, plus his own width */}
      <PadHolder className="left-[calc(40%_+_4.5rem)] sm:left-[calc(40%_+_5.5rem)]" body={SOUL.ridge} pads={SOUL.ember} />
      <CavernFloor />
    </>
  )
}

function Strike() {
  return <StrikeFlash color={SOUL.lantern} />
}

// ---- the contact corners: where each profession ends the page ----

function DeskCornerScene() {
  return (
    <DeskCorner
      hero={<HeroCharacter profession="engineer" className={scene.hero} />}
      colors={{ panel: SOUL.ink, screens: [SOUL.glow, SOUL.moss], desk: SOUL.rockLight, keyboard: SOUL.ridge }}
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
      post={
        <>
          <rect x={2} y={22} width={12} height={78} fill={SOUL.rockLight} />
          <rect x={6} y={30} width={4} height={8} fill={SOUL.glow} />
        </>
      }
      ropes={ROPES}
    >
      <rect x={0} y={92} width={160} height={8} fill={SOUL.rock} />
    </RingCorner>
  )
}

export const PROFESSION_STAGES: Record<Profession, StageLook> = {
  engineer: { Level: EngineerLevel, pose: scene.stride, travel: scene.walk, Companion: null, Corner: DeskCornerScene },
  // He plays a little left of the hall's middle, under the first lanterns.
  drummer: { Level: EchoHall, pose: scene.drum, travel: 'translate-x-[22%]', Companion: KitInFront, Corner: KitCornerScene },
  fighter: { Level: ArenaChamber, pose: scene.strike, travel: scene.advance, Companion: Strike, Corner: RingCornerScene },
}
