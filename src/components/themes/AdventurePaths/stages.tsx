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
import { WaypointFlag } from './icons'
import { TRAIL } from './palette'
import styles from './scenes.module.css'

// Adventure Paths' three profession stages on the shared stage (src/components/scroll/stage.tsx), each in
// two places: the level strip pinned above a section while it scrolls, and his corner behind the temple
// door of the contact scene. A level is a side view of a trail in an exploration game:
// - System Engineer hikes the ruins path by day, the far ridges and near ruins sliding at two speeds,
//   past old terminals that wake on the stones (Experience) or glyph stones whose circuit traces light
//   (Projects), the red route inking itself behind him and a waypoint flag rising at each stop.
// - Musician plays his kit in a night clearing: the lanterns on the line light one by one, the campfire
//   leaps and the sound bars rise with the stick hits.
// - Martial Artist crosses the temple terrace ring at sunset to the pad holder and works the roundhouse
//   kick, the knee and the elbow, a gold flash on each strike while the pads give.
// Switching profession swaps the whole stage; no prop is shared between professions.
//
// Animated elements per strip, at most 17: the two ridges, the route cover and three flags, his travel
// and four limbs, three terminals or glyph stones (engineer); four lanterns, two flames, five bars, two
// cymbals and four limbs (musician); the sun, his travel, three limbs, two pads and the flash (fighter).

// A prop standing on the ground at its place along the level.
const PROP_SLOT = 'absolute bottom-3 left-[calc(var(--at)*100%_-_1rem)]'

const STOPS = [0.2, 0.52, 0.84]

// ---- System Engineer: the ruins path, terminals, circuits ----

function FarRidges() {
  return (
    <svg
      viewBox="0 0 780 100"
      preserveAspectRatio="none"
      className={`absolute inset-y-0 left-0 h-full w-[130%] ${styles.farRidge}`}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M0 100 V62 L60 40 L110 54 L170 28 L230 50 L300 34 L350 52 L420 24 L480 48 L540 36 L600 54 L660 30 L720 46 L780 38 V100 Z"
        fill={TRAIL.RIVER}
        opacity={0.55}
      />
    </svg>
  )
}

// The near ruins: broken columns, a fallen arch and moss, repeated along a strip wider than the view.
const RUIN_COLUMNS = [40, 150, 290, 420, 560, 700, 830]

function NearRuins() {
  return (
    <svg
      viewBox="0 0 960 100"
      preserveAspectRatio="none"
      className={`absolute inset-y-0 left-0 h-full w-[160%] ${styles.nearRidge}`}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0 100 V80 Q120 66 240 78 T480 76 T720 80 T960 74 V100 Z" fill={TRAIL.FOREST} />
      {RUIN_COLUMNS.map((x, i) => (
        <g key={x}>
          <rect x={x} y={34 + (i % 3) * 10} width={14} height={60} fill={TRAIL.STONE} />
          <rect x={x - 3} y={30 + (i % 3) * 10} width={20} height={5} fill={TRAIL.STONE_DARK} />
          <path d={`M${x} ${60 + (i % 2) * 8} q7 -6 14 0`} stroke={TRAIL.MOSS} strokeWidth={3} fill="none" />
        </g>
      ))}
      <path d="M352 94 V58 Q380 30 408 58 V94 H398 V62 Q380 44 362 62 V94 Z" fill={TRAIL.STONE_DARK} />
    </svg>
  )
}

// The route line along the ground and the unexplored ground that slides off it as he walks.
function Route() {
  return (
    <div className="absolute inset-x-0 bottom-1 h-1" aria-hidden="true">
      <div className="absolute inset-0 border-t-2 border-dashed border-[color:var(--ap-route)]" />
      <div className={`absolute -inset-y-0.5 left-0 w-full bg-[color:var(--ap-stone-dark)] ${styles.unexplored}`} />
    </div>
  )
}

function Waypoints() {
  return (
    <>
      {[0.36, 0.68, 0.97].map((position) => (
        <div key={position} className={`absolute bottom-3 left-[calc(var(--at)*100%_-_0.75rem)] h-7 w-5 ${atClass(position)}`} aria-hidden="true">
          <WaypointFlag className="h-full w-full" pennantClassName={styles.raise} />
        </div>
      ))}
    </>
  )
}

// A glyph stone, the old machine of the ruins: its circuit trace lights as he passes it.
function GlyphStone({ position }: { position: number }) {
  return (
    <svg viewBox="0 0 30 48" className={`${PROP_SLOT} h-12 w-8 sm:h-16 sm:w-10 ${atClass(position)}`} aria-hidden="true" focusable="false">
      <path d="M3 48 V12 Q3 2 15 2 Q27 2 27 12 V48 Z" fill={TRAIL.STONE} stroke={TRAIL.STONE_DARK} strokeWidth={1.5} />
      <path
        d="M9 12 H15 V20 H21 M15 20 V30 H9 M15 30 V40 M21 20 V26"
        stroke={TRAIL.RUNE}
        strokeWidth={1.8}
        fill="none"
        className={`${scene.lightAt} ${atClass(position)}`}
      />
      <circle cx={21} cy={26} r={1.6} fill={TRAIL.RUNE} />
      <circle cx={9} cy={30} r={1.6} fill={TRAIL.RUNE} />
    </svg>
  )
}

const ENGINEER_PROPS: Record<LevelZone, ReactNode> = {
  record: STOPS.map((position) => (
    <Terminal key={position} position={position} body={TRAIL.STONE_DARK} screen={TRAIL.RUNE} stand={TRAIL.STONE} />
  )),
  work: STOPS.map((position) => <GlyphStone key={position} position={position} />),
}

function EngineerLevel({ zone }: { zone: LevelZone }) {
  return (
    <>
      <LevelArt>
        <rect width={600} height={100} fill={TRAIL.SKY} />
        <rect y={58} width={600} height={42} fill={TRAIL.DUSK} opacity={0.35} />
      </LevelArt>
      <FarRidges />
      <NearRuins />
      <LevelGround className="border-[color:var(--ap-moss)] bg-[color:var(--ap-stone-dark)]" />
      <Route />
      <Waypoints />
      {ENGINEER_PROPS[zone]}
    </>
  )
}

// ---- Musician: the night clearing, his kit, the campfire, sound ----

const KIT: DrumKitColors = {
  stand: TRAIL.STONE,
  shell: TRAIL.ROUTE,
  rim: TRAIL.PARCHMENT,
  bass: TRAIL.GOLD,
  cymbal: styles.cymbal,
}

const PINES = [20, 70, 130, 400, 460, 520, 575]
const NIGHT_STARS = [60, 160, 250, 330, 440, 540]

function Clearing() {
  return (
    <LevelArt>
      <rect width={600} height={100} fill={TRAIL.NIGHT} />
      {NIGHT_STARS.map((x, i) => (
        <circle key={x} cx={x} cy={10 + (i % 3) * 8} r={1.2} fill={TRAIL.PARCHMENT} opacity={0.7} />
      ))}
      {PINES.map((x, i) => (
        <path key={x} d={`M${x} 92 L${x + 22} ${30 + (i % 3) * 10} L${x + 44} 92 Z`} fill={i % 2 ? TRAIL.CANOPY : TRAIL.FOREST} />
      ))}
      <path d="M0 14 Q150 40 300 18 Q450 40 600 14" stroke={TRAIL.BARK} strokeWidth={1.2} fill="none" />
    </LevelArt>
  )
}

// The lanterns hung on the line across the clearing; each lights in turn as the song goes on.
const LANTERNS = [
  { place: 'left-[12%] top-[12%]', on: 0.1 },
  { place: 'left-[32%] top-[24%]', on: 0.3 },
  { place: 'left-[58%] top-[22%]', on: 0.5 },
  { place: 'left-[80%] top-[13%]', on: 0.7 },
]

function Lanterns() {
  return (
    <>
      {LANTERNS.map(({ place, on }) => (
        <svg key={place} viewBox="0 0 12 18" className={`absolute h-5 w-3.5 sm:h-6 sm:w-4 ${place}`} aria-hidden="true" focusable="false">
          <rect x={4} y={0} width={4} height={3} fill={TRAIL.BARK} />
          <rect x={1} y={3} width={10} height={13} rx={3} fill={TRAIL.WOOD} />
          <rect x={2.5} y={4.5} width={7} height={10} rx={2} fill={TRAIL.LANTERN} className={`${scene.lightAt} ${atClass(on)}`} />
        </svg>
      ))}
    </>
  )
}

// The campfire on the clearing's right: crossed logs and two flames leaping on the hits.
function Campfire() {
  return (
    <svg viewBox="0 0 40 36" className="absolute bottom-2 right-[24%] h-10 w-11 sm:h-14 sm:w-16" aria-hidden="true" focusable="false">
      <path d="M4 34 L36 26 M4 26 L36 34" stroke={TRAIL.WOOD} strokeWidth={4} strokeLinecap="round" />
      <path d="M20 2 Q30 16 26 24 Q28 22 28 28 H12 Q12 22 14 24 Q10 16 20 2 Z" fill={TRAIL.ROUTE} className={styles.flame} />
      <path d="M20 12 Q26 20 24 26 H16 Q14 20 20 12 Z" fill={TRAIL.GOLD} className={`${styles.flame} [--phase:0.5turn]`} />
    </svg>
  )
}

function MusicianLevel() {
  return (
    <>
      <Clearing />
      <Lanterns />
      <LevelGround className="border-[color:var(--ap-moss)] bg-[color:var(--ap-bark)]" />
      <Campfire />
      <SoundWaves className="absolute bottom-3 right-3 h-12 w-14 sm:right-6 sm:h-16 sm:w-20" colors={[TRAIL.GOLD, TRAIL.LANTERN]} />
    </>
  )
}

function KitByTheFire() {
  return <DrumKit className="absolute bottom-1 left-8 h-14 w-20 sm:left-10 sm:h-20 sm:w-28" colors={KIT} />
}

// ---- Martial Artist: the temple terrace ring, the pads, kicks, knees, elbows ----

function Terrace() {
  return (
    <>
      <LevelArt>
        <rect width={600} height={100} fill={TRAIL.DUSK} />
      </LevelArt>
      <LevelArt className={`absolute inset-0 h-full w-full ${styles.sunset}`}>
        <circle cx={420} cy={34} r={16} fill={TRAIL.LANTERN} />
      </LevelArt>
      <LevelArt>
        <path d="M330 92 V70 H350 V56 H370 V42 H390 V30 H450 V42 H470 V56 H490 V70 H510 V92 Z" fill={TRAIL.STONE_DARK} />
        <path d="M402 30 L420 14 L438 30 Z" fill={TRAIL.STONE} />
        <rect x={412} y={74} width={16} height={18} fill={TRAIL.NIGHT} />
        <path d="M0 0 Q12 30 6 60 M40 0 Q50 22 44 40 M560 0 Q552 26 558 50 M596 0 Q586 34 592 70" stroke={TRAIL.MOSS} strokeWidth={4} fill="none" />
        {[24, 576].map((x) => (
          <rect key={x} x={x} y={36} width={7} height={60} fill={TRAIL.WOOD} />
        ))}
        <line x1={24} y1={48} x2={583} y2={48} stroke={TRAIL.ROUTE} strokeWidth={1.8} />
        <line x1={24} y1={62} x2={583} y2={62} stroke={TRAIL.PARCHMENT} strokeWidth={1.8} />
        <line x1={24} y1={76} x2={583} y2={76} stroke={TRAIL.GOLD} strokeWidth={1.8} />
      </LevelArt>
    </>
  )
}

function FighterLevel() {
  return (
    <>
      <Terrace />
      <LevelGround className="border-[color:var(--ap-moss)] bg-[color:var(--ap-stone)]" />
      <PadHolder className="left-[calc(40%_+_4.5rem)] sm:left-[calc(40%_+_5.5rem)]" body={TRAIL.CANOPY} pads={TRAIL.ROUTE} />
    </>
  )
}

function GoldFlash() {
  return <StrikeFlash color={TRAIL.GOLD} />
}

// ---- the contact corners: where each profession ends the page, behind the temple door ----

function EngineerCorner() {
  return (
    <DeskCorner
      hero={<HeroCharacter profession="engineer" className={scene.hero} />}
      colors={{
        panel: TRAIL.STONE_DARK,
        screens: [TRAIL.RUNE, TRAIL.LANTERN],
        desk: TRAIL.WOOD,
        keyboard: TRAIL.STONE,
      }}
    />
  )
}

function MusicianCorner() {
  return <KitCorner hero={<HeroCharacter profession="drummer" className={scene.hero} />} kit={KIT} waves={[TRAIL.GOLD, TRAIL.LANTERN]} />
}

function RingCornerScene() {
  return (
    <RingCorner
      hero={<HeroCharacter profession="fighter" className={scene.hero} />}
      side="left"
      post={ringPost('left', TRAIL.WOOD)}
      ropes={[TRAIL.ROUTE, TRAIL.PARCHMENT, TRAIL.GOLD]}
    />
  )
}

export const PROFESSION_STAGES: Record<Profession, StageLook> = {
  engineer: {
    Level: EngineerLevel,
    pose: scene.stride,
    travel: scene.walk,
    Companion: null,
    Corner: EngineerCorner,
  },
  drummer: {
    Level: MusicianLevel,
    pose: scene.drum,
    travel: styles.atCamp,
    Companion: KitByTheFire,
    Corner: MusicianCorner,
  },
  fighter: {
    Level: FighterLevel,
    pose: scene.strike,
    travel: scene.advance,
    Companion: GoldFlash,
    Corner: RingCornerScene,
  },
}
