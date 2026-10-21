import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { at, type LevelZone, type StageLook } from '@/components/scroll/stage'
import { DeskCorner, DrumKit, KitCorner, PadHolder, SoundWaves, StrikeFlash, Terminal, type DrumKitColors } from '@/components/scroll/stageProps'
import scene from '@/components/scroll/heroScene.module.css'
import { HeroCharacter } from './character'
import { DECO_COLORS as C } from './palette'
import styles from './scenes.module.css'

// The three Art Deco stages, one per profession, each in two places: the level strip pinned above a
// section while it scrolls, and the corner of the contact scene. Everything is the city under the sea:
// - System Engineer walks a glass tunnel past the city's stepped towers, brass pipes at his feet; the
//   towers' windows and the brass terminals (Experience) or the neon shop signs (Projects) light as he
//   reaches them, a school of fish swims the other way. He ends typing at his desk.
// - Musician plays his kit on a ballroom stage under a gold proscenium; the sunburst fan behind him
//   lights ray by ray with the song and the sound bars follow the sticks. He ends behind his kit.
// - Martial Artist crosses a ring set in a deco ballroom to the pads, throwing the roundhouse kick, the
//   knee and the elbow while the chandeliers come up. He ends gloves up on his gilded corner post.
// Switching profession swaps the whole stage; no prop is shared between professions.
//
// Animated elements per strip, at most 12: his travel, his moving limbs (four walking, two drumming, two
// striking) and the props that answer progress (three towers and three terminals or signs and the fish;
// three fan rays and five sound bars; two chandeliers and the strike flash). Everything else is static.

const SVG_LAYER = 'absolute inset-0 h-full w-full'

function Layer({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 600 100" preserveAspectRatio="none" className={SVG_LAYER} aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

// ---- System Engineer: the glass tunnel, terminals, the pipes he keeps running ----

// Stepped ziggurat towers with a spire, the skyline of the city. The three near ones light as he passes.
const tower = (x: number, width: number, height: number) =>
  `M${x} 88 V${88 - height} H${x + width * 0.2} V${82 - height} H${x + width * 0.35} V${76 - height} H${x + width * 0.45} V${66 - height} H${x + width * 0.55} V${76 - height} H${x + width * 0.65} V${82 - height} H${x + width * 0.8} V${88 - height} H${x + width} V88 Z`

const FAR_TOWERS = [
  { x: 20, width: 60, height: 30 },
  { x: 200, width: 50, height: 22 },
  { x: 380, width: 64, height: 34 },
  { x: 540, width: 50, height: 26 },
]

const LIT_TOWERS = [
  { position: 0.2, x: 100, width: 70, height: 48 },
  { position: 0.5, x: 265, width: 80, height: 58 },
  { position: 0.8, x: 450, width: 72, height: 50 },
]

const WINDOW_ROWS = [0.25, 0.45, 0.65, 0.85]
const WINDOW_COLUMNS = [0.25, 0.45, 0.65]

function LitTower({ position, x, width, height }: (typeof LIT_TOWERS)[number]) {
  const top = 88 - height

  return (
    <>
      <path d={tower(x, width, height)} fill="#0e2a3e" stroke={C.brassDark} strokeWidth={0.8} />
      <g className={scene.lightAt} style={at(position)}>
        {WINDOW_ROWS.flatMap((row) =>
          WINDOW_COLUMNS.map((column) => (
            <rect key={`${row}-${column}`} x={x + width * column} y={top + height * row} width={width * 0.1} height={3} fill={C.goldBright} />
          )),
        )}
        <circle cx={x + width / 2} cy={top - 22} r={2} fill={C.goldBright} />
      </g>
    </>
  )
}

const RIBS = [0, 75, 150, 225, 300, 375, 450, 525, 600]

// The tunnel: dark water, the skyline, then the brass ribs of the glass walkway in front of it.
function GlassTunnel() {
  return (
    <Layer>
      <rect width={600} height={100} fill={C.abyss} />
      <rect width={600} height={60} fill={C.deepSea} opacity={0.6} />
      {FAR_TOWERS.map(({ x, width, height }) => (
        <path key={x} d={tower(x, width, height)} fill="#0a1c2c" />
      ))}
      {LIT_TOWERS.map((lit) => (
        <LitTower key={lit.x} {...lit} />
      ))}
      <rect width={600} height={4} fill={C.brassMid} />
      {RIBS.map((x) => (
        <g key={x}>
          <rect x={x - 2} y={0} width={4} height={88} fill={C.brassMid} />
          <circle cx={x} cy={20} r={1.4} fill={C.goldBright} />
          <circle cx={x} cy={60} r={1.4} fill={C.goldBright} />
        </g>
      ))}
      <path d="M40 10 L70 80 M340 10 L370 80" stroke={C.waterGlow} strokeWidth={3} opacity={0.12} />
    </Layer>
  )
}

// A school of fish outside the glass, swimming against his walk.
function FishSchool() {
  return (
    <svg viewBox="0 0 120 30" className={`absolute left-0 top-3 h-6 w-28 sm:h-8 sm:w-36 ${styles.school}`} aria-hidden="true" focusable="false">
      {[
        { x: 10, y: 8 },
        { x: 34, y: 18 },
        { x: 56, y: 6 },
        { x: 80, y: 16 },
        { x: 100, y: 9 },
      ].map(({ x, y }) => (
        <path key={x} d={`M${x} ${y} Q${x + 6} ${y - 4} ${x + 12} ${y} Q${x + 6} ${y + 4} ${x} ${y} Z M${x + 12} ${y} L${x + 16} ${y - 3} L${x + 16} ${y + 3} Z`} fill={C.tealLight} opacity={0.55} />
      ))}
    </svg>
  )
}

// The walkway: brass plates with a chevron inlay, the pipes and their valve wheels below.
function Walkway() {
  return (
    <svg viewBox="0 0 600 12" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-3 w-full" aria-hidden="true" focusable="false">
      <rect width={600} height={12} fill="#2a2210" />
      <line x1={0} y1={1} x2={600} y2={1} stroke={C.gold} strokeWidth={1.5} />
      <path d="M0 8 H600" stroke={C.bronze} strokeWidth={2} />
      {[60, 210, 360, 510].map((x) => (
        <circle key={x} cx={x} cy={8} r={3} fill="none" stroke={C.goldBright} strokeWidth={1} />
      ))}
    </svg>
  )
}

// A neon shop sign on a deco bracket, the kind that lines the city arcades: it lights as he passes.
function ShopSign({ position, color }: { position: number; color: string }) {
  return (
    <svg
      viewBox="0 0 48 44"
      className="absolute bottom-3 left-[calc(var(--at)*100%_-_1.5rem)] h-10 w-11 sm:h-14 sm:w-16"
      style={at(position)}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M24 30 V44 M14 44 H34" stroke={C.brassMid} strokeWidth={2} />
      <path d="M4 30 V12 L24 2 L44 12 V30 Z" fill={C.abyss} stroke={C.brassMid} strokeWidth={1.5} />
      <g className={scene.lightAt}>
        <path d="M8 27 V14 L24 6 L40 14 V27 Z" fill="none" stroke={color} strokeWidth={1.5} />
        <path d="M14 20 H34 M18 24 H30" stroke={color} strokeWidth={2} />
      </g>
    </svg>
  )
}

const TERMINAL = { body: '#2a2210', screen: C.tealLight, stand: C.brassMid }

const ENGINEER_PROPS: Record<LevelZone, ReactNode> = {
  record: (
    <>
      <Terminal position={0.3} {...TERMINAL} />
      <Terminal position={0.6} {...TERMINAL} />
      <Terminal position={0.9} {...TERMINAL} />
    </>
  ),
  work: (
    <>
      <ShopSign position={0.3} color={C.neonPink} />
      <ShopSign position={0.6} color={C.goldBright} />
      <ShopSign position={0.9} color={C.waterGlow} />
    </>
  ),
}

function EngineerLevel({ zone }: { zone: LevelZone }) {
  return (
    <>
      <GlassTunnel />
      <FishSchool />
      <Walkway />
      {ENGINEER_PROPS[zone]}
    </>
  )
}

// ---- Musician: the ballroom stage, his kit, the sunburst that answers the song ----

const KIT: DrumKitColors = { stand: C.brassMid, shell: C.blood, rim: C.gold, bass: C.goldBright }
const WAVES: [string, string] = [C.gold, C.waterGlow]

const CURTAIN_FOLDS = Array.from({ length: 15 }, (_, i) => 30 + i * 36)

// Three rays of the fan behind the kit, each lit at its own beat of the song.
const FAN_RAYS = [
  { position: 0.2, angles: [-70, -50] },
  { position: 0.5, angles: [-30, -10, 10, 30] },
  { position: 0.8, angles: [50, 70] },
]

function SunburstFan() {
  return (
    <svg viewBox="0 0 120 60" className="absolute bottom-3 left-[10%] h-20 w-40 sm:h-28 sm:w-56" aria-hidden="true" focusable="false">
      <path d="M4 60 A56 56 0 0 1 116 60 Z" fill={C.abyss} stroke={C.brassMid} strokeWidth={1} />
      {FAN_RAYS.map(({ position, angles }) => (
        <g key={position} className={scene.lightAt} style={at(position)}>
          {angles.map((angle) => (
            <line
              key={angle}
              x1={60}
              y1={60}
              x2={60 + Math.sin((angle * Math.PI) / 180) * 54}
              y2={60 - Math.cos((angle * Math.PI) / 180) * 54}
              stroke={C.goldBright}
              strokeWidth={3}
            />
          ))}
        </g>
      ))}
      <circle cx={60} cy={60} r={10} fill={C.gold} />
    </svg>
  )
}

function BallroomStage() {
  return (
    <>
      <Layer>
        <rect width={600} height={100} fill={C.bloodDark} />
        {CURTAIN_FOLDS.map((x) => (
          <rect key={x} x={x} y={0} width={8} height={100} fill="#4a0000" />
        ))}
        {/* the stepped gold proscenium and its row of marquee bulbs */}
        <path d="M0 0 H600 V14 H570 V22 H545 V100 H530 V30 H70 V100 H55 V22 H30 V14 H0 Z" fill={C.brassDark} />
        {Array.from({ length: 19 }, (_, i) => 80 + i * 24).map((x) => (
          <circle key={x} cx={x} cy={8} r={2.2} fill={C.goldBright} />
        ))}
        <rect x={0} y={88} width={600} height={12} fill="#2a1408" />
      </Layer>
      <SunburstFan />
      <div className="absolute inset-x-0 bottom-0 h-3 border-t-2 border-[#D4AF37] bg-[#1a0f06]" aria-hidden="true" />
      <SoundWaves className="absolute bottom-4 right-12 h-12 w-14 sm:right-16 sm:h-16 sm:w-20" colors={WAVES} />
    </>
  )
}

// His kit, in front of him on the stage.
function KitInFront() {
  return <DrumKit className="absolute bottom-1 left-8 h-14 w-20 sm:left-10 sm:h-20 sm:w-28" colors={KIT} />
}

// ---- Martial Artist: the ring in the ballroom, the pads, kicks, knees, elbows ----

const COLUMNS = [20, 160, 300, 440, 580]

function Chandelier({ position, x }: { position: number; x: number }) {
  return (
    <g>
      <line x1={x} y1={0} x2={x} y2={10} stroke={C.brassMid} strokeWidth={1} />
      <path d={`M${x - 14} 12 H${x + 14} L${x + 8} 22 H${x - 8} Z`} fill={C.brassDark} />
      <g className={scene.lightAt} style={at(position)}>
        {[-10, -4, 4, 10].map((dx) => (
          <circle key={dx} cx={x + dx} cy={14} r={2} fill={C.goldBright} />
        ))}
        <path d={`M${x - 24} 24 L${x} 18 L${x + 24} 24 Z`} fill={C.goldBright} opacity={0.35} />
      </g>
    </g>
  )
}

const ropes = (from: number, to: number) => (
  <>
    <line x1={from} y1={40} x2={to} y2={40} stroke={C.gold} strokeWidth={1.5} />
    <line x1={from} y1={56} x2={to} y2={56} stroke={C.ivory} strokeWidth={1.5} />
    <line x1={from} y1={72} x2={to} y2={72} stroke={C.tealLight} strokeWidth={1.5} />
  </>
)

// A gilded ring post with a stepped sunburst cap.
const post = (x: number) => (
  <g key={x}>
    <rect x={x - 3} y={30} width={6} height={70} fill={C.brassMid} />
    <path d={`M${x - 6} 30 H${x + 6} L${x + 3} 24 H${x - 3} Z`} fill={C.goldBright} />
  </g>
)

function BallroomRing() {
  return (
    <>
      <Layer>
        <rect width={600} height={100} fill={C.deepSeaDark} />
        {COLUMNS.map((x) => (
          <g key={x}>
            <rect x={x - 8} y={0} width={16} height={100} fill="#0e2a3e" />
            <rect x={x - 2} y={0} width={4} height={100} fill={C.brassDark} opacity={0.6} />
          </g>
        ))}
        <Chandelier position={0.25} x={110} />
        <Chandelier position={0.6} x={370} />
        {[40, 300, 560].map(post)}
        {ropes(0, 600)}
        <rect x={0} y={88} width={600} height={12} fill={C.tealDark} />
      </Layer>
      <div className="absolute inset-x-0 bottom-0 h-3 border-t-2 border-[#D4AF37] bg-[#004444]" aria-hidden="true" />
      {/* where his advance ends: 40% of the canvas, plus his own width */}
      <PadHolder className="left-[calc(40%_+_4.5rem)] sm:left-[calc(40%_+_5.5rem)]" body="#1b2a44" pads={C.blood} />
    </>
  )
}

function Strike() {
  return <StrikeFlash color={C.goldBright} />
}

// ---- the contact corners: where each profession ends the page ----

function DeskCornerScene() {
  return (
    <DeskCorner
      hero={<HeroCharacter profession="engineer" className={scene.hero} />}
      colors={{ panel: '#2a2210', screens: [C.tealLight, C.goldBright], desk: C.brassMid, keyboard: C.bronze }}
    />
  )
}

function KitCornerScene() {
  return <KitCorner hero={<HeroCharacter profession="drummer" className={scene.hero} />} kit={KIT} waves={WAVES} />
}

function RingCorner() {
  return (
    <div className={`absolute inset-0 ${scene.guard}`}>
      <svg viewBox="0 0 160 100" preserveAspectRatio="none" className={SVG_LAYER} aria-hidden="true" focusable="false">
        {post(150)}
        {ropes(0, 150)}
        <rect x={0} y={92} width={160} height={8} fill={C.tealDark} />
      </svg>
      <div className="absolute bottom-1 left-1/3">
        <HeroCharacter profession="fighter" className={scene.hero} />
      </div>
    </div>
  )
}

export const PROFESSION_STAGES: Record<Profession, StageLook> = {
  engineer: { Level: EngineerLevel, pose: scene.stride, travel: styles.walk, Companion: null, Corner: DeskCornerScene },
  // He plays in front of the fan, a fifth of the way in.
  drummer: { Level: BallroomStage, pose: scene.drum, travel: 'translate-x-[20%]', Companion: KitInFront, Corner: KitCornerScene },
  fighter: { Level: BallroomRing, pose: scene.strike, travel: styles.advance, Companion: Strike, Corner: RingCorner },
}
