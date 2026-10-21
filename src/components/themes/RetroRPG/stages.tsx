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
import { RPG } from './palette'
import styles from './scenes.module.css'

// Retro RPG's three profession stages on the shared stage (src/components/scroll/stage.tsx), each in two
// places: the level strip pinned above a section while it scrolls, and his corner in the window of the
// contact scene. A level is the side view of a 16 bit role playing game's overworld, drawn in hard
// edged pixel shapes, with him walking the path in front.
// - System Engineer walks the daytime meadow road under snow capped mountains, through a village at each
//   stop whose windows light and whose terminal wakes as he reaches it (Experience), or past the save
//   points that spin as he passes (Projects), to the castle at the end of the road, whose gate lifts as
//   he arrives.
// - Musician plays his kit at the night camp beside the fire: the flames leap and the stars twinkle with
//   the stick hits, the sound bars rise across the camp.
// - Martial Artist crosses the arena ring at dusk to the pad holder and works the roundhouse kick, the
//   knee and the elbow; the crowd in the stands jumps with each strike. He ends gloves up in his corner.
// Switching profession swaps the whole stage; no prop is shared between professions.
//
// Animated elements per strip, at most 17: his travel and four limbs, the two meadow layers, and the props that answer (three
// terminals, six village windows and the gate, or three save points and the gate; two star groups,
// two flames and five sound bars; two crowd rows, two pads and the flash).

const PIXEL_EDGES = { shapeRendering: 'crispEdges' } as const

function Sky({ className }: { className: string }) {
  return <div className={`absolute inset-0 bg-gradient-to-b ${className}`} aria-hidden="true" />
}

// ---- System Engineer: the meadow road, villages, terminals, save points, the castle ----

const DAY_SKY = 'from-[color:var(--rpg-day-top)] to-[color:var(--rpg-day-low)]'
const PROP_POSITIONS = [0.24, 0.48, 0.72]
const TREE_XS = [40, 150, 210, 330, 395, 520]

// Stepped pixel mountains with snow caps far back, and round pixel trees on the meadow line nearer; the
// two layers slide at their own pace as he walks (the shared .far and .mid parallax), each wider than the
// strip so no edge comes into view.
function Meadow() {
  return (
    <>
      <LevelArt className={`absolute inset-y-0 left-0 h-full w-[120%] ${scene.far}`}>
        <g {...PIXEL_EDGES}>
          <path d="M0 62 H30 V52 H50 V40 H70 V30 H90 V42 H110 V54 H150 V46 H170 V36 H190 V24 H210 V38 H230 V50 H300 V44 H320 V32 H340 V22 H360 V34 H380 V48 H440 V40 H460 V30 H480 V42 H500 V56 H560 V48 H600 V100 H0 Z" fill={RPG.mountain} />
          <path d="M70 30 H90 V34 H70 Z M190 24 H210 V28 H190 Z M340 22 H360 V26 H340 Z M460 30 H480 V34 H460 Z" fill={RPG.snow} />
        </g>
      </LevelArt>
      <LevelArt className={`absolute inset-y-0 left-0 h-full w-[130%] ${scene.mid}`}>
        <g {...PIXEL_EDGES}>
          <rect x={0} y={70} width={600} height={30} fill={RPG.grass} />
          <rect x={0} y={70} width={600} height={3} fill={RPG.grassDark} />
          {TREE_XS.map((x) => (
            <g key={x}>
              <rect x={x - 1.5} y={66} width={3} height={8} fill={RPG.pathEdge} />
              <rect x={x - 6} y={56} width={12} height={10} fill={RPG.tree} />
              <rect x={x - 4} y={52} width={8} height={4} fill={RPG.tree} />
            </g>
          ))}
        </g>
      </LevelArt>
    </>
  )
}

function Road() {
  return <LevelGround className="border-[color:var(--rpg-grass)] bg-[color:var(--rpg-path)]" />
}

// A village cottage behind the terminal at each stop; its window lights as he reaches it.
function Cottage({ position }: { position: number }) {
  return (
    <svg
      viewBox="0 0 40 36"
      className={`absolute bottom-3 left-[calc(var(--at)*100%_-_3.25rem)] h-10 w-11 sm:h-14 sm:w-16 ${atClass(position)}`}
      aria-hidden="true"
      focusable="false"
      {...PIXEL_EDGES}
    >
      <path d="M2 16 L20 2 L38 16 Z" fill={RPG.roof} />
      <rect x={6} y={16} width={28} height={20} fill={RPG.wall} />
      <rect x={16} y={24} width={8} height={12} fill={RPG.pathEdge} />
      <rect x={9} y={20} width={5} height={5} fill={RPG.lamp} className={scene.lightAt} />
      <rect x={26} y={20} width={5} height={5} fill={RPG.lamp} className={scene.lightAt} />
    </svg>
  )
}

// A save point on the road: a gold star stone over a stone plinth; it lights and spins as he passes.
function SavePoint({ position }: { position: number }) {
  return (
    <svg
      viewBox="0 0 24 36"
      className={`absolute bottom-3 left-[calc(var(--at)*100%_-_0.75rem)] h-10 w-7 sm:h-14 sm:w-9 ${atClass(position)}`}
      aria-hidden="true"
      focusable="false"
      {...PIXEL_EDGES}
    >
      <rect x={4} y={28} width={16} height={8} fill={RPG.stone} />
      <rect x={4} y={28} width={16} height={2} fill={RPG.stoneDark} />
      <g className={scene.lightAt}>
        <path d="M12 2 L18 12 L12 22 L6 12 Z" fill={RPG.gold} className={styles.spin} />
      </g>
    </svg>
  )
}

const ENGINEER_PROPS: Record<LevelZone, ReactNode> = {
  record: PROP_POSITIONS.map((position) => (
    <div key={position}>
      <Cottage position={position} />
      <Terminal position={position} body={RPG.stoneDark} screen={RPG.green} stand={RPG.stoneDark} />
    </div>
  )),
  work: PROP_POSITIONS.map((position) => <SavePoint key={position} position={position} />),
}

// The castle at the end of the road: a stone tower over its gate, the portcullis lifting as he arrives.
function Castle() {
  return (
    <svg viewBox="0 0 40 60" className="absolute bottom-3 right-1 h-16 w-11 sm:h-24 sm:w-16" aria-hidden="true" focusable="false" {...PIXEL_EDGES}>
      <path d="M2 8 H8 V2 H14 V8 H20 V2 H26 V8 H32 V2 H38 V60 H2 Z" fill={RPG.stone} />
      <rect x={12} y={30} width={16} height={30} fill={RPG.void} />
      <g className={styles.gate}>
        <path d="M12 30 H28 V60 H12 Z M16 30 V60 M20 30 V60 M24 30 V60 M12 38 H28 M12 46 H28 M12 54 H28" stroke={RPG.stoneDark} strokeWidth={1.5} fill="none" />
      </g>
      <rect x={17} y={14} width={6} height={8} fill={RPG.lamp} />
    </svg>
  )
}

function EngineerLevel({ zone }: { zone: LevelZone }) {
  return (
    <>
      <Sky className={DAY_SKY} />
      <Meadow />
      <Road />
      {ENGINEER_PROPS[zone]}
      <Castle />
    </>
  )
}

// ---- Musician: the night camp, his kit, the fire, sound ----

const NIGHT_SKY = 'from-[color:var(--rpg-night-top)] to-[color:var(--rpg-night-low)]'

const KIT: DrumKitColors = {
  stand: RPG.stone,
  shell: RPG.vest,
  rim: RPG.gold,
  bass: RPG.gold,
  cymbalsTip: true,
}

// Two star groups, each twinkling on its own half of the stick hits.
const STAR_GROUPS: [number, number][][] = [
  [
    [40, 12],
    [130, 24],
    [250, 10],
    [390, 20],
    [520, 14],
  ],
  [
    [85, 30],
    [190, 16],
    [320, 28],
    [450, 8],
    [570, 26],
  ],
]
const STAR_PHASES = ['[--phase:0turn]', '[--phase:0.5turn]']

function NightCamp() {
  return (
    <>
      <Sky className={NIGHT_SKY} />
      <LevelArt>
        <g {...PIXEL_EDGES}>
          {STAR_GROUPS.map((stars, i) => (
            <g key={STAR_PHASES[i]} className={`${styles.twinkle} ${STAR_PHASES[i]}`}>
              {stars.map(([x, y]) => (
                <rect key={x} x={x} y={y} width={3} height={3} fill={RPG.star} />
              ))}
            </g>
          ))}
          <rect x={470} y={12} width={14} height={14} fill={RPG.star} />
          <rect x={474} y={12} width={10} height={10} fill={RPG.nightTop} />
          <path d="M0 72 H60 V64 H120 V58 H200 V66 H300 V60 H380 V54 H460 V62 H540 V68 H600 V100 H0 Z" fill={RPG.hill} />
          <path d="M250 86 L268 64 L286 86 Z M410 86 L426 66 L442 86 Z" fill={RPG.tent} />
        </g>
      </LevelArt>
      <LevelGround className="border-[color:var(--rpg-hill)] bg-[color:var(--rpg-night)]" />
      <Campfire />
      <SoundWaves className="absolute bottom-3 right-3 h-12 w-14 sm:right-6 sm:h-16 sm:w-20" colors={[RPG.gold, RPG.fire]} />
    </>
  )
}

// The camp fire: crossed logs and two flames that leap on the hits, the second half a hit later.
function Campfire() {
  return (
    <svg viewBox="0 0 30 30" className="absolute bottom-2 left-[58%] h-10 w-10 sm:h-14 sm:w-14" aria-hidden="true" focusable="false" {...PIXEL_EDGES}>
      <path d="M8 4 L20 26 L16 26 Z" fill={RPG.fire} className={`${styles.flame} [--phase:0turn]`} />
      <path d="M18 8 L12 26 L22 26 Z" fill={RPG.fireCore} className={`${styles.flame} [--phase:0.5turn]`} />
      <path d="M4 26 L26 30 M26 26 L4 30" stroke={RPG.tent} strokeWidth={3} />
    </svg>
  )
}

function KitAtCamp() {
  return <DrumKit className="absolute bottom-1 left-8 h-14 w-20 sm:left-10 sm:h-20 sm:w-28" colors={KIT} />
}

// ---- Martial Artist: the arena ring at dusk, the pads, kicks, knees, elbows ----

const DUSK_SKY = 'from-[color:var(--rpg-dusk-top)] to-[color:var(--rpg-dusk-low)]'
const CROWD_ROWS: { y: number; xs: number[]; cheer: string }[] = [
  { y: 50, xs: [30, 70, 110, 150, 450, 490, 530, 570], cheer: styles.cheerHigh },
  { y: 58, xs: [50, 90, 130, 470, 510, 550], cheer: styles.cheerLow },
]

// The stands of the arena, two rows of the crowd over the wall, and the ring on the sand in front.
function DuskArena() {
  return (
    <>
      <Sky className={DUSK_SKY} />
      <LevelArt>
        <g {...PIXEL_EDGES}>
          <path d="M0 44 H20 V36 H34 V44 H170 V36 H184 V44 H416 V36 H430 V44 H566 V36 H580 V44 H600 V100 H0 Z" fill={RPG.arenaWall} />
          {[200, 260, 320, 380].map((x) => (
            <rect key={x} x={x} y={52} width={20} height={20} fill={RPG.duskTop} />
          ))}
          <path d="M230 36 V20 L244 26 L230 30 M370 36 V20 L384 26 L370 30" stroke={RPG.stone} fill={RPG.banner} strokeWidth={1.2} />
        </g>
      </LevelArt>
      {CROWD_ROWS.map(({ y, xs, cheer }) => (
        <LevelArt key={y} className={`absolute inset-0 h-full w-full ${cheer}`}>
          <g {...PIXEL_EDGES}>
            {xs.map((x) => (
              <rect key={x} x={x} y={y} width={8} height={8} fill={RPG.holder} />
            ))}
          </g>
        </LevelArt>
      ))}
      <LevelArt>
        <rect x={4} y={34} width={8} height={66} fill={RPG.stoneDark} />
        <rect x={588} y={34} width={8} height={66} fill={RPG.stoneDark} />
        <line x1={8} y1={48} x2={592} y2={48} stroke={RPG.rope} strokeWidth={1.6} />
        <line x1={8} y1={62} x2={592} y2={62} stroke={RPG.banner} strokeWidth={1.6} />
        <line x1={8} y1={76} x2={592} y2={76} stroke={RPG.rope} strokeWidth={1.6} />
      </LevelArt>
      <LevelGround className="border-[color:var(--rpg-sand-edge)] bg-[color:var(--rpg-sand)]" />
      <PadHolder className="left-[calc(40%_+_4.5rem)] sm:left-[calc(40%_+_5.5rem)]" body={RPG.holder} pads={RPG.pad} />
    </>
  )
}

function GoldFlash() {
  return <StrikeFlash color={RPG.gold} />
}

// ---- the contact corners: where each profession ends the page, in the closing window ----

export const CORNER_SKY: Record<Profession, string> = {
  engineer: DAY_SKY,
  drummer: NIGHT_SKY,
  fighter: DUSK_SKY,
}

function EngineerCorner() {
  return (
    <DeskCorner
      hero={<HeroCharacter profession="engineer" className={scene.hero} />}
      colors={{
        panel: RPG.stoneDark,
        screens: [RPG.green, RPG.sky],
        desk: RPG.pathEdge,
        keyboard: RPG.stone,
      }}
    />
  )
}

function MusicianCorner() {
  return <KitCorner hero={<HeroCharacter profession="drummer" className={scene.hero} />} kit={KIT} waves={[RPG.gold, RPG.fire]} />
}

function FighterCorner() {
  return (
    <RingCorner
      hero={<HeroCharacter profession="fighter" className={scene.hero} />}
      side="left"
      post={ringPost('left', RPG.stoneDark)}
      ropes={[RPG.rope, RPG.banner, RPG.rope]}
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
    Level: NightCamp,
    pose: scene.drum,
    travel: styles.atCamp,
    Companion: KitAtCamp,
    Corner: MusicianCorner,
  },
  fighter: {
    Level: DuskArena,
    pose: scene.strike,
    travel: scene.advance,
    Companion: GoldFlash,
    Corner: FighterCorner,
  },
}
