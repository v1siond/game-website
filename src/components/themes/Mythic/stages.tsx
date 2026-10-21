import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { LevelArt, LevelGround, atClass, type LevelZone, type StageLook } from '@/components/scroll/stage'
import { DeskCorner, DrumKit, KitCorner, PadHolder, RingCorner, SoundWaves, StrikeFlash, Terminal, type DrumKitColors } from '@/components/scroll/stageProps'
import scene from '@/components/scroll/heroScene.module.css'
import { HeroCharacter } from './character'
import { Brazier, BrazierFlame, Column, Islands } from './art'
import { MYTH } from './palette'
import styles from './scenes.module.css'

// Mythic's three profession stages on the shared stage (src/components/scroll/stage.tsx), each in two
// places: the level strip pinned above a section while it scrolls, and his corner in the contact scene.
// - System Engineer walks a marble colonnade on a cliff over the noon Aegean, the columns sliding past
//   and the islands on the horizon; terminals light on their plinths (Experience) or marble steles rise
//   from the floor with their circuit lines glowing gold (Projects) as he reaches them. He ends typing
//   at his desk.
// - Musician plays his kit on the stage of an open air amphitheatre at dusk, the stone tiers behind
//   him: the constellations come out over the theatre in turn, the braziers flare and the sound bars
//   rise with the sticks. He ends behind his kit.
// - Martial Artist crosses the sand of a palaestra by the sea, the ring roped between two columns, to
//   the pads and works the roundhouse kick, the knee and the elbow; the brazier behind the pads flares
//   on every strike. He ends gloves up in his corner by a column.
// Switching profession swaps the whole stage; no prop is shared between professions.
//
// Animated elements per strip, at most 14: his travel and four limbs, the colonnade and three
// terminals or steles; three constellations, two flames and five sound bars; the brazier's flame, two
// pads and the strike flash.

function MarbleFloor() {
  return <LevelGround className="border-[color:var(--myth-marble)] bg-[var(--myth-marble-shade)]" />
}

// The noon sea under the sky, the sun high, the islands where they meet: `horizon` is the sea's top in
// the 100 unit box, `islandsAt` the islands' top as a class, 12% above it.
function NoonSea({ horizon, islandsAt }: { horizon: number; islandsAt: string }) {
  return (
    <>
      <LevelArt>
        <rect x={-2} y={-2} width={604} height={104} fill={MYTH.sky} />
        <circle cx={520} cy={18} r={9} fill={MYTH.sun} />
        <rect x={-2} y={horizon} width={604} height={102 - horizon} fill={MYTH.sea} />
      </LevelArt>
      <Islands className={`absolute inset-x-0 h-[12%] w-full ${islandsAt}`} />
    </>
  )
}

// ---- System Engineer: the colonnade over the sea ----

const COLONNADE = [30, 120, 210, 300, 390, 480, 570]

function Colonnade() {
  return (
    <LevelArt className={`absolute inset-y-0 left-0 h-full w-[120%] ${scene.drift}`}>
      <rect x={-2} y={4} width={604} height={8} fill={MYTH.marble} />
      <rect x={-2} y={12} width={604} height={2} fill={MYTH.marbleShade} />
      {COLONNADE.map((x) => (
        <Column key={x} x={x} top={14} base={89} />
      ))}
    </LevelArt>
  )
}

// A marble stele that rises from the floor as he reaches it, its circuit lines lighting gold.
function CircuitStele({ position }: { position: number }) {
  return (
    <svg
      viewBox="0 0 32 48"
      className={`absolute bottom-3 left-[calc(var(--at)*100%_-_1rem)] h-10 w-7 sm:h-14 sm:w-9 ${atClass(position)} ${styles.riseAt}`}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3 10 L16 2 L29 10 V48 H3 Z" fill={MYTH.marble} stroke={MYTH.stone} strokeWidth={1} />
      <path d="M8 16 H16 V24 H24 M8 32 H12 V28 H20 V38 M24 30 V42" fill="none" stroke={MYTH.ink} strokeWidth={1.2} />
      <g className={scene.lightAt}>
        <path d="M8 16 H16 V24 H24 M8 32 H12 V28 H20 V38 M24 30 V42" fill="none" stroke={MYTH.gold} strokeWidth={1.6} />
        <circle cx={24} cy={24} r={1.8} fill={MYTH.gold} />
        <circle cx={20} cy={38} r={1.8} fill={MYTH.gold} />
      </g>
    </svg>
  )
}

const TERMINAL = { body: MYTH.ink, screen: MYTH.gold, stand: MYTH.stone }

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
      <CircuitStele position={0.3} />
      <CircuitStele position={0.6} />
      <CircuitStele position={0.9} />
    </>
  ),
}

function EngineerLevel({ zone }: { zone: LevelZone }) {
  return (
    <>
      <NoonSea horizon={58} islandsAt="top-[46%]" />
      <Colonnade />
      {ENGINEER_PROPS[zone]}
      <MarbleFloor />
    </>
  )
}

// ---- Musician: the amphitheatre at dusk ----

const KIT: DrumKitColors = { stand: MYTH.stone, shell: MYTH.terracotta, rim: MYTH.gold, bass: MYTH.ink }
const WAVES: [string, string] = [MYTH.gold, MYTH.terracotta]

// Three constellations over the theatre, each lighting as the scene reaches it: its stars and the
// lines between them.
const CONSTELLATIONS = [
  { position: 0.2, stars: [[110, 12], [126, 20], [140, 14], [152, 26]] },
  { position: 0.5, stars: [[270, 8], [286, 18], [300, 10], [316, 22], [330, 14]] },
  { position: 0.8, stars: [[430, 16], [446, 8], [462, 18], [476, 10]] },
]

// The stone tiers of the cavea, wider and higher towards the back.
const TIERS = [
  { rx: 270, y: 58, color: MYTH.stone },
  { rx: 240, y: 64, color: MYTH.marbleShade },
  { rx: 210, y: 70, color: MYTH.stone },
  { rx: 180, y: 76, color: MYTH.marbleShade },
]

function Amphitheatre() {
  return (
    <>
      <LevelArt>
        <rect x={-2} y={-2} width={604} height={104} fill={MYTH.dusk} />
        <rect x={-2} y={36} width={604} height={30} fill={MYTH.duskLow} />
        {CONSTELLATIONS.map(({ position, stars }) => (
          <g key={position} className={`${scene.lightAt} ${atClass(position)}`}>
            <polyline points={stars.map(([x, y]) => `${x},${y}`).join(' ')} fill="none" stroke={MYTH.star} strokeWidth={0.6} strokeOpacity={0.6} />
            {stars.map(([x, y]) => (
              <circle key={x} cx={x} cy={y} r={1.6} fill={MYTH.star} />
            ))}
          </g>
        ))}
        {TIERS.map(({ rx, y, color }) => (
          <path key={y} d={`M${300 - rx} 84 Q${300 - rx} ${y - 20} 300 ${y - 20} Q${300 + rx} ${y - 20} ${300 + rx} 84`} fill="none" stroke={color} strokeWidth={5} />
        ))}
        <Column x={130} top={34} base={84} width={10} />
        <Column x={470} top={34} base={84} width={10} />
        <rect x={-2} y={84} width={604} height={18} fill={MYTH.marbleShade} />
        <rect x={-2} y={84} width={604} height={1.5} fill={MYTH.marble} />
        <Brazier x={60} base={84} flame={<BrazierFlame x={60} rim={66} className={styles.flare} />} />
        <Brazier x={540} base={84} flame={<BrazierFlame x={540} rim={66} className={`${styles.flare} [--phase:0.5turn]`} />} />
      </LevelArt>
      <SoundWaves className="absolute bottom-4 right-16 h-12 w-14 sm:right-24 sm:h-16 sm:w-20" colors={WAVES} />
    </>
  )
}

function KitInFront() {
  return <DrumKit className="absolute bottom-1 left-8 h-14 w-20 sm:left-10 sm:h-20 sm:w-28" colors={KIT} />
}

// ---- Martial Artist: the palaestra by the sea, the ring, the pads, kicks, knees, elbows ----

const ROPES: [string, string, string] = [MYTH.terracotta, MYTH.marble, MYTH.terracotta]
const ROPE_HEIGHTS = [44, 58, 72]

function Palaestra() {
  return (
    <>
      <NoonSea horizon={52} islandsAt="top-[40%]" />
      <LevelArt>
        <rect x={-2} y={84} width={604} height={18} fill={MYTH.sand} />
        <Column x={18} top={24} base={88} width={10} />
        <Column x={582} top={24} base={88} width={10} />
        {ROPES.map((color, i) => (
          <line key={ROPE_HEIGHTS[i]} x1={24} y1={ROPE_HEIGHTS[i]} x2={576} y2={ROPE_HEIGHTS[i]} stroke={color} strokeWidth={1.5} />
        ))}
      </LevelArt>
      {/* the brazier stands behind the pads, where his advance ends (40% of the strip, plus his width) */}
      <svg
        viewBox="0 0 24 44"
        className="absolute bottom-3 left-[calc(40%_+_7.5rem)] h-12 w-7 sm:left-[calc(40%_+_9rem)] sm:h-16 sm:w-9"
        aria-hidden="true"
        focusable="false"
      >
        <Brazier x={12} base={44} flame={<BrazierFlame x={12} rim={26} className={styles.strikeFlare} />} />
      </svg>
      <PadHolder className="left-[calc(40%_+_4.5rem)] sm:left-[calc(40%_+_5.5rem)]" body={MYTH.ink} pads={MYTH.terracotta} />
      <LevelGround className="border-[color:var(--myth-marble)] bg-[var(--myth-sand)]" />
    </>
  )
}

function Strike() {
  return <StrikeFlash color={MYTH.flameCore} />
}

// ---- the contact corners: where each profession ends the page ----

function DeskCornerScene() {
  return (
    <DeskCorner
      hero={<HeroCharacter profession="engineer" className={scene.hero} />}
      colors={{ panel: MYTH.ink, screens: [MYTH.gold, MYTH.sky], desk: MYTH.stone, keyboard: MYTH.ink }}
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
      post={<Column x={8} top={18} base={100} width={8} />}
      ropes={ROPES}
    >
      <rect x={0} y={92} width={160} height={8} fill={MYTH.sand} />
    </RingCorner>
  )
}

export const PROFESSION_STAGES: Record<Profession, StageLook> = {
  engineer: { Level: EngineerLevel, pose: scene.stride, travel: scene.walk, Companion: null, Corner: DeskCornerScene },
  drummer: { Level: Amphitheatre, pose: scene.drum, travel: styles.onStage, Companion: KitInFront, Corner: KitCornerScene },
  fighter: { Level: Palaestra, pose: scene.strike, travel: scene.advance, Companion: Strike, Corner: RingCornerScene },
}
