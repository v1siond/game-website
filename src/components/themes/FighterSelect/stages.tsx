import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { atClass, type LevelZone, type StageLook } from '@/components/scroll/stage'
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
import { FS } from './palette'
import styles from './scenes.module.css'

// The three Fighter Select stages, one per profession, each in two places: the level strip pinned
// above a section while it scrolls, and the corner of the contact scene. Every strip is a fighting game
// stage under the match HUD: his health bar full on the left, the challenger's draining on the right as
// he crosses the stage, and the three round pips lighting as he reaches them.
// - System Engineer walks the server hall stage at night: rack lights come up as he passes, the
//   terminals (Experience) or the arcade cabinets (Projects) on the floor light their screens. He ends
//   typing at his desk.
// - Musician plays his kit on the concert stage, the truss spotlights opening in turn with the song and
//   the sound bars following the sticks between the speaker stacks. He ends behind his kit.
// - Martial Artist crosses a ring set in a temple courtyard at dusk to the pads, throwing the
//   roundhouse kick, the knee and the elbow while the lanterns light. He ends gloves up on the red post.
// Switching profession swaps the whole stage; no prop is shared between professions.
//
// Animated elements per strip, at most 13: his travel, his moving limbs (four walking, two drumming,
// two striking), the draining bar and the three pips, and the props that answer progress (three racks
// and three terminals or cabinets; three spotlights and five sound bars; two lanterns, the two pads and
// the strike flash). Everything else is static.

const SVG_LAYER = 'absolute inset-0 h-full w-full'

function Layer({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 600 100" preserveAspectRatio="none" className={SVG_LAYER} aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

// ---- the match HUD over every stage ----

const PIPS = [0.33, 0.66, 0.99]

function MatchHud() {
  return (
    <div className="absolute inset-x-2 top-1.5 flex items-center gap-2 sm:inset-x-4 sm:top-2" aria-hidden="true">
      <div className="h-2.5 flex-1 border border-[color:var(--fs-gold)] bg-[color:var(--fs-ink)] sm:h-3.5">
        <div className="h-full w-full bg-[color:var(--fs-health)]" />
      </div>
      <div className="flex gap-1">
        {PIPS.map((position) => (
          <span key={position} className={`h-2 w-2 rotate-45 bg-[color:var(--fs-gold)] sm:h-2.5 sm:w-2.5 ${scene.lightAt} ${atClass(position)}`} />
        ))}
      </div>
      <div className="h-2.5 flex-1 border border-[color:var(--fs-gold)] bg-[color:var(--fs-p2)] sm:h-3.5">
        <div className={`h-full w-full bg-[color:var(--fs-health)] ${styles.drain}`} />
      </div>
    </div>
  )
}

// The stage floor: the lit edge of the fighting plane and its perspective lines.
function StageFloor({ edge, fill }: { edge: string; fill: string }) {
  return (
    <svg viewBox="0 0 600 14" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-3.5 w-full" aria-hidden="true" focusable="false">
      <rect width={600} height={14} fill={fill} />
      <line x1={0} y1={1} x2={600} y2={1} stroke={edge} strokeWidth={2} />
      {[0, 75, 150, 225, 300, 375, 450, 525, 600].map((x) => (
        <line key={x} x1={x} y1={2} x2={300 + (x - 300) * 1.4} y2={14} stroke={edge} strokeWidth={0.6} opacity={0.4} />
      ))}
    </svg>
  )
}

// ---- System Engineer: the server hall stage, terminals and arcade cabinets ----

const DARK_RACKS = [20, 140, 330, 520]
const LIT_RACKS = [
  { position: 0.2, x: 80 },
  { position: 0.5, x: 250 },
  { position: 0.8, x: 430 },
]
const LED_ROWS = [26, 36, 46, 56, 66, 76]

function Rack({ x }: { x: number }) {
  return (
    <>
      <rect x={x} y={18} width={44} height={70} fill={FS.panel} stroke={FS.steel} strokeWidth={1} />
      {LED_ROWS.map((y) => (
        <rect key={y} x={x + 4} y={y} width={36} height={5} fill={FS.panelLight} />
      ))}
    </>
  )
}

function LitRack({ position, x }: (typeof LIT_RACKS)[number]) {
  return (
    <>
      <Rack x={x} />
      <g className={`${scene.lightAt} ${atClass(position)}`}>
        {LED_ROWS.map((y, i) => (
          <rect key={y} x={x + 30} y={y + 1.5} width={6} height={2} fill={i % 2 ? FS.cyan : FS.health} />
        ))}
      </g>
    </>
  )
}

function ServerHall() {
  return (
    <Layer>
      <rect width={600} height={100} fill={FS.night} />
      <rect y={60} width={600} height={30} fill={FS.p1} opacity={0.08} />
      {DARK_RACKS.map((x) => (
        <Rack key={x} x={x} />
      ))}
      {LIT_RACKS.map((rack) => (
        <LitRack key={rack.x} {...rack} />
      ))}
      <path d="M0 14 H600" stroke={FS.steel} strokeWidth={2} />
      <path d="M60 14 Q120 30 180 14 M300 14 Q360 30 420 14" fill="none" stroke={FS.p1} strokeWidth={1.5} opacity={0.6} />
    </Layer>
  )
}

// An upright arcade cabinet on the floor: its screen lights as he passes.
function Cabinet({ position }: { position: number }) {
  return (
    <svg
      viewBox="0 0 30 48"
      className={`absolute bottom-3 left-[calc(var(--at)*100%_-_1rem)] h-10 w-7 sm:h-14 sm:w-9 ${atClass(position)}`}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 2 H26 L28 20 L24 26 V48 H6 V26 L2 20 Z" fill={FS.panelLight} stroke={FS.p2} strokeWidth={1} />
      <rect x={4} y={2} width={22} height={4} fill={FS.p2} />
      <rect x={7} y={8} width={16} height={11} fill={FS.gold} className={scene.lightAt} />
      <rect x={6} y={22} width={18} height={4} fill={FS.ink} />
      <circle cx={10} cy={24} r={1.2} fill={FS.p1Light} />
      <circle cx={18} cy={24} r={1.2} fill={FS.p2} />
    </svg>
  )
}

const TERMINAL = { body: FS.panel, screen: FS.cyan, stand: FS.steel }

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
      <Cabinet position={0.3} />
      <Cabinet position={0.6} />
      <Cabinet position={0.9} />
    </>
  ),
}

function EngineerLevel({ zone }: { zone: LevelZone }) {
  return (
    <>
      <ServerHall />
      <StageFloor edge={FS.cyan} fill={FS.ink} />
      {ENGINEER_PROPS[zone]}
      <MatchHud />
    </>
  )
}

// ---- Musician: the concert stage, his kit, the spotlights that answer the song ----

const KIT: DrumKitColors = { stand: FS.chrome, shell: FS.p2Dark, rim: FS.chrome, bass: FS.gold }
const WAVES: [string, string] = [FS.gold, FS.p2]

const SPOTLIGHTS = [
  { position: 0.2, x: 140, to: 100 },
  { position: 0.5, x: 300, to: 260 },
  { position: 0.8, x: 460, to: 420 },
]

function Speaker({ x }: { x: number }) {
  return (
    <>
      <rect x={x} y={44} width={40} height={44} fill={FS.ink} stroke={FS.steel} strokeWidth={1} />
      <circle cx={x + 20} cy={58} r={8} fill={FS.panel} stroke={FS.steel} />
      <circle cx={x + 20} cy={77} r={6} fill={FS.panel} stroke={FS.steel} />
    </>
  )
}

const CROWD = Array.from({ length: 21 }, (_, i) => ({ x: 6 + i * 29, r: 7 + (i % 3) }))

function ConcertStage() {
  return (
    <>
      <Layer>
        <rect width={600} height={100} fill={FS.night} />
        <rect y={18} width={600} height={70} fill={FS.p2Dark} opacity={0.18} />
        {/* the lighting truss and its three lamps */}
        <path d="M0 16 H600 M0 22 H600" stroke={FS.steel} strokeWidth={1.5} />
        {Array.from({ length: 30 }, (_, i) => i * 20).map((x) => (
          <line key={x} x1={x} y1={16} x2={x + 20} y2={22} stroke={FS.steel} strokeWidth={0.8} />
        ))}
        {SPOTLIGHTS.map(({ position, x, to }) => (
          <g key={x}>
            <rect x={x - 6} y={22} width={12} height={8} fill={FS.steel} />
            <path d={`M${x - 5} 30 L${to - 40} 88 H${to + 40} L${x + 5} 30 Z`} fill={FS.gold} className={`${styles.beam} ${atClass(position)}`} />
          </g>
        ))}
        <Speaker x={10} />
        <Speaker x={550} />
      </Layer>
      <StageFloor edge={FS.gold} fill={FS.ink} />
      {/* the front row of the crowd, heads against the stage light */}
      <svg viewBox="0 0 600 20" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-4 w-full" aria-hidden="true" focusable="false">
        {CROWD.map(({ x, r }) => (
          <circle key={x} cx={x} cy={20} r={r} fill={FS.ink} />
        ))}
      </svg>
      <SoundWaves className="absolute bottom-4 right-14 h-12 w-14 sm:right-20 sm:h-16 sm:w-20" colors={WAVES} />
      <MatchHud />
    </>
  )
}

// His kit, in front of him on the stage.
function KitInFront() {
  return <DrumKit className="absolute bottom-1 left-8 h-14 w-20 sm:left-10 sm:h-20 sm:w-28" colors={KIT} />
}

// ---- Martial Artist: the temple courtyard ring, the pads, kicks, knees, elbows ----

// A tiered temple roof: three stacked gables with the upturned finials at their ends.
const roof = (x: number, width: number, base: number) =>
  [0, 1, 2]
    .map((tier) => {
      const inset = tier * width * 0.14
      const y = base - tier * 12
      const left = x + inset
      const right = x + width - inset
      const peak = x + width / 2
      return `M${left} ${y} L${peak} ${y - 16} L${right} ${y} Z M${left} ${y} l-4 -6 M${right} ${y} l4 -6`
    })
    .join(' ')

const LANTERNS = [
  { position: 0.25, x: 120 },
  { position: 0.6, x: 380 },
]

function Lantern({ position, x }: (typeof LANTERNS)[number]) {
  return (
    <g>
      <line x1={x} y1={0} x2={x} y2={14} stroke={FS.steel} strokeWidth={1} />
      <rect x={x - 5} y={14} width={10} height={14} rx={4} fill={FS.p2Dark} />
      <g className={`${scene.lightAt} ${atClass(position)}`}>
        <rect x={x - 3} y={16} width={6} height={10} rx={3} fill={FS.gold} />
        <circle cx={x} cy={21} r={14} fill={FS.orange} opacity={0.25} />
      </g>
    </g>
  )
}

const ROPE_COLORS: [string, string, string] = [FS.p2, FS.chrome, FS.p1]
const ROPE_HEIGHTS: [number, number, number] = [42, 57, 72]

// A ring post wrapped in the corner's colour, with its pad.
const post = (x: number, color: string) => (
  <g key={x}>
    <rect x={x - 3} y={34} width={6} height={66} fill={FS.steel} />
    <rect x={x - 4.5} y={38} width={9} height={38} rx={2} fill={color} />
  </g>
)

function TempleRing() {
  return (
    <>
      <Layer>
        <rect width={600} height={100} fill="#2a1030" />
        <rect y={40} width={600} height={60} fill={FS.orange} opacity={0.14} />
        <circle cx={470} cy={34} r={14} fill={FS.gold} opacity={0.5} />
        <path d={roof(160, 260, 66)} fill={FS.ink} stroke={FS.ink} strokeWidth={2} strokeLinejoin="round" />
        <rect x={190} y={66} width={200} height={24} fill={FS.ink} />
        {LANTERNS.map((lantern) => (
          <Lantern key={lantern.x} {...lantern} />
        ))}
        {post(40, FS.p1)}
        {post(560, FS.p2)}
        {ROPE_COLORS.map((color, i) => (
          <line key={ROPE_HEIGHTS[i]} x1={0} y1={ROPE_HEIGHTS[i]} x2={600} y2={ROPE_HEIGHTS[i]} stroke={color} strokeWidth={1.5} />
        ))}
      </Layer>
      <StageFloor edge={FS.chrome} fill={FS.p1} />
      {/* where his advance ends: 40% of the stage, plus his own width */}
      <PadHolder className="left-[calc(40%_+_4.5rem)] sm:left-[calc(40%_+_5.5rem)]" body={FS.ink} pads={FS.p2} />
      <MatchHud />
    </>
  )
}

function Strike() {
  return <StrikeFlash color={FS.gold} />
}

// ---- the contact corners: where each profession ends the page ----

function DeskCornerScene() {
  return (
    <DeskCorner
      hero={<HeroCharacter profession="engineer" className={scene.hero} />}
      colors={{ panel: FS.panel, screens: [FS.cyan, FS.health], desk: FS.steel, keyboard: FS.chrome }}
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
      post={post(150, FS.p2)}
      ropes={ROPE_COLORS}
      ropeHeights={ROPE_HEIGHTS}
    >
      <rect x={0} y={92} width={160} height={8} fill={FS.p1} />
    </RingCorner>
  )
}

export const PROFESSION_STAGES: Record<Profession, StageLook> = {
  engineer: { Level: EngineerLevel, pose: scene.stride, travel: scene.walk, Companion: null, Corner: DeskCornerScene },
  // He plays under the middle of the truss, a fifth of the way in.
  drummer: { Level: ConcertStage, pose: scene.drum, travel: 'translate-x-[20%]', Companion: KitInFront, Corner: KitCornerScene },
  fighter: { Level: TempleRing, pose: scene.strike, travel: scene.advance, Companion: Strike, Corner: RingCornerScene },
}
