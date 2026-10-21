import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { LevelArt, LevelGround, atClass, type LevelZone, type StageLook } from '@/components/scroll/stage'
import { DeskCorner, DrumKit, KitCorner, PadHolder, RingCorner, SoundWaves, StrikeFlash, Terminal, ringPost, type DrumKitColors } from '@/components/scroll/stageProps'
import scene from '@/components/scroll/heroScene.module.css'
import { HeroCharacter } from './character'
import { RainStreaks, Skyline } from './backdrop'
import { NOIR } from './palette'
import styles from './scenes.module.css'

// Bold Noir's three profession stages on the shared stage (src/components/scroll/stage.tsx), each in
// two places: the level strip pinned above a section while it scrolls, and his corner in the contact
// scene. Every level is a graphic novel night in black, white and greys, with one red accent.
// - System Engineer walks a wet street at night under the lamps, the skyline sliding behind him and
//   the rain pouring; terminals light (Experience) or case boards swing into place on their wires
//   (Projects) as he reaches them. He ends typing at his desk.
// - Musician plays his kit on the stage of a late night club between red curtains: the spotlights come
//   on in turn and the sound bars rise with the sticks. He ends behind his kit.
// - Martial Artist crosses a basement gym under blind light to the pads and works the roundhouse kick,
//   the knee and the elbow; the bulb over the ring swings and a red ink splash bursts behind the pads
//   on every strike. He ends gloves up in his corner.
// Switching profession swaps the whole stage; no prop is shared between professions.
//
// Animated elements per strip, at most 12: his travel and four limbs, the skyline and the rain with
// three terminals or boards; three spotlights and five sound bars; the bulb, the splash, two pads and
// the strike flash.

function Street() {
  return <LevelGround className="border-[color:var(--noir-ash)] bg-[color:var(--noir-ink)]" />
}

// ---- System Engineer: the wet street at night ----

const LAMPS = [110, 330, 550]

function NightStreet() {
  return (
    <>
      <LevelArt>
        <rect x={-2} y={-2} width={604} height={104} fill={NOIR.coal} />
        <circle cx={480} cy={24} r={12} fill={NOIR.paper} />
      </LevelArt>
      <Skyline className={`absolute bottom-3 left-0 h-[72%] w-[115%] ${scene.drift}`} fill={NOIR.ink} />
      <LevelArt>
        {LAMPS.map((x) => (
          <g key={x}>
            <polygon points={`${x - 6},26 ${x + 6},26 ${x + 40},97 ${x - 40},97`} fill={NOIR.paper} fillOpacity={0.12} />
            <rect x={x - 1.5} y={18} width={3} height={79} fill={NOIR.ash} />
            <rect x={x - 6} y={20} width={12} height={6} fill={NOIR.paper} />
          </g>
        ))}
      </LevelArt>
      <RainStreaks className={`absolute -top-1/3 left-0 h-[133%] w-[133%] ${styles.pour}`} />
      <Street />
    </>
  )
}

// A case board hung on its wire: three photographs pinned to it and the red string between them.
function CaseBoard({ position }: { position: number }) {
  return (
    <svg
      viewBox="0 0 44 60"
      className={`absolute top-0 left-[calc(var(--at)*100%_-_1.5rem)] h-14 w-10 sm:h-20 sm:w-14 ${atClass(position)} ${styles.pinAt}`}
      aria-hidden="true"
      focusable="false"
    >
      <line x1={22} y1={0} x2={22} y2={14} stroke={NOIR.fog} strokeWidth={1} />
      <rect x={2} y={14} width={40} height={30} fill={NOIR.smoke} stroke={NOIR.paper} strokeWidth={1.5} />
      <rect x={6} y={18} width={10} height={9} fill={NOIR.paper} />
      <rect x={28} y={18} width={10} height={9} fill={NOIR.paper} />
      <rect x={17} y={31} width={10} height={9} fill={NOIR.paper} />
      <path d="M11 20 L22 34 L33 20 Z" fill="none" stroke={NOIR.red} strokeWidth={1} />
      <circle cx={22} cy={14} r={2} fill={NOIR.red} />
    </svg>
  )
}

const TERMINAL = { body: NOIR.smoke, screen: NOIR.paper, stand: NOIR.ash }

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
      <CaseBoard position={0.3} />
      <CaseBoard position={0.6} />
      <CaseBoard position={0.9} />
    </>
  ),
}

function EngineerLevel({ zone }: { zone: LevelZone }) {
  return (
    <>
      <NightStreet />
      {ENGINEER_PROPS[zone]}
    </>
  )
}

// ---- Musician: the club stage, red curtains, spotlights and his kit ----

const KIT: DrumKitColors = { stand: NOIR.fog, shell: NOIR.smoke, rim: NOIR.paper, bass: NOIR.red, cymbal: NOIR.fog }
const WAVES: [string, string] = [NOIR.paper, NOIR.red]

const SPOTLIGHTS = [
  { position: 0.2, x: 150 },
  { position: 0.5, x: 300 },
  { position: 0.8, x: 450 },
]

// The light through the club's blinds: slanted bands across the back wall.
const BLIND_BANDS = [40, 90, 140, 190, 240]

// The folds of one curtain, every other one in shadow.
const curtain = (from: number) =>
  [0, 10, 20, 30].map((offset, i) => (
    <rect key={from + offset} x={from + offset} y={-2} width={10} height={90} fill={i % 2 ? NOIR.redDeep : NOIR.red} />
  ))

function ClubStage() {
  return (
    <>
      <LevelArt>
        <rect x={-2} y={-2} width={604} height={104} fill={NOIR.smoke} />
        {BLIND_BANDS.map((x) => (
          <polygon key={x} points={`${x},0 ${x + 24},0 ${x + 84},86 ${x + 60},86`} fill={NOIR.paper} fillOpacity={0.07} />
        ))}
        {SPOTLIGHTS.map(({ position, x }) => (
          <g key={x} className={`${scene.lightAt} ${atClass(position)}`}>
            <polygon points={`${x - 6},0 ${x + 6},0 ${x + 44},86 ${x - 44},86`} fill={NOIR.paper} fillOpacity={0.3} />
          </g>
        ))}
        {curtain(0)}
        {curtain(560)}
        <rect x={418} y={40} width={2} height={46} fill={NOIR.fog} />
        <ellipse cx={419} cy={38} rx={3} ry={4} fill={NOIR.ash} />
        <rect x={-2} y={86} width={604} height={16} fill={NOIR.ink} />
        <rect x={-2} y={86} width={604} height={1.5} fill={NOIR.paper} />
      </LevelArt>
      <SoundWaves className="absolute bottom-4 right-14 h-12 w-14 sm:right-20 sm:h-16 sm:w-20" colors={WAVES} />
    </>
  )
}

function KitInFront() {
  return <DrumKit className="absolute bottom-1 left-8 h-14 w-20 sm:left-10 sm:h-20 sm:w-28" colors={KIT} />
}

// ---- Martial Artist: the basement gym, the ring, the pads, kicks, knees, elbows ----

const ROPES: [string, string, string] = [NOIR.red, NOIR.paper, NOIR.red]
const BRICK_ROWS = [12, 24, 36, 48, 60, 72]
const WINDOW_SLATS = [10, 16, 22, 28, 34]

function BasementGym() {
  return (
    <>
      <LevelArt>
        <rect x={-2} y={-2} width={604} height={104} fill={NOIR.coal} />
        {BRICK_ROWS.map((y) => (
          <rect key={y} x={-2} y={y} width={604} height={1} fill={NOIR.smoke} />
        ))}
        {/* the high window and the bands of light its blinds let down onto the floor */}
        <rect x={60} y={6} width={70} height={34} fill={NOIR.ink} />
        {WINDOW_SLATS.map((y) => (
          <rect key={y} x={62} y={y - 2} width={66} height={3} fill={NOIR.paper} />
        ))}
        <polygon points="62,40 128,40 230,88 150,88" fill={NOIR.paper} fillOpacity={0.08} />
        <rect x={16} y={28} width={8} height={60} fill={NOIR.ash} />
        <rect x={576} y={28} width={8} height={60} fill={NOIR.ash} />
        {ROPES.map((color, i) => (
          <line key={40 + i * 15} x1={0} y1={40 + i * 15} x2={600} y2={40 + i * 15} stroke={color} strokeWidth={1.5} />
        ))}
        <rect x={-2} y={88} width={604} height={14} fill={NOIR.smoke} />
      </LevelArt>
      {/* the bulb hangs over where his advance ends (40% of the strip, plus his own width) */}
      <svg
        viewBox="0 0 60 100"
        preserveAspectRatio="none"
        className={`absolute inset-y-0 left-[calc(40%_+_1.5rem)] w-20 sm:left-[calc(40%_+_2rem)] sm:w-28 ${styles.sway}`}
        aria-hidden="true"
        focusable="false"
      >
        <line x1={30} y1={0} x2={30} y2={18} stroke={NOIR.fog} strokeWidth={0.8} />
        <polygon points="27,22 33,22 58,88 2,88" fill={NOIR.paper} fillOpacity={0.12} />
        <ellipse cx={30} cy={21} rx={3.5} ry={4} fill={NOIR.paper} />
      </svg>
      <svg
        viewBox="0 0 100 100"
        className={`absolute bottom-8 left-[calc(40%_+_3rem)] h-16 w-16 sm:left-[calc(40%_+_4rem)] sm:h-24 sm:w-24 ${scene.burst}`}
        aria-hidden="true"
        focusable="false"
      >
        <path d="M50 8 L58 34 L86 18 L68 44 L96 52 L66 60 L80 88 L54 68 L44 96 L38 66 L10 80 L28 56 L4 44 L32 40 L20 14 L44 32 Z" fill={NOIR.red} />
      </svg>
      <PadHolder className="left-[calc(40%_+_4.5rem)] sm:left-[calc(40%_+_5.5rem)]" body={NOIR.ash} pads={NOIR.paper} />
      <Street />
    </>
  )
}

function Strike() {
  return <StrikeFlash color={NOIR.paper} />
}

// ---- the contact corners: where each profession ends the page ----

function DeskCornerScene() {
  return (
    <DeskCorner
      hero={<HeroCharacter profession="engineer" className={scene.hero} />}
      colors={{ panel: NOIR.ink, screens: [NOIR.paper, NOIR.red], desk: NOIR.smoke, keyboard: NOIR.ash }}
    />
  )
}

function KitCornerScene() {
  return <KitCorner hero={<HeroCharacter profession="drummer" className={scene.hero} />} kit={KIT} waves={WAVES} />
}

function RingCornerScene() {
  return (
    <RingCorner hero={<HeroCharacter profession="fighter" className={scene.hero} />} side="left" post={ringPost('left', NOIR.ash)} ropes={ROPES}>
      <rect x={0} y={92} width={160} height={8} fill={NOIR.smoke} />
    </RingCorner>
  )
}

export const PROFESSION_STAGES: Record<Profession, StageLook> = {
  engineer: { Level: EngineerLevel, pose: scene.stride, travel: scene.walk, Companion: null, Corner: DeskCornerScene },
  drummer: { Level: ClubStage, pose: scene.drum, travel: styles.onStage, Companion: KitInFront, Corner: KitCornerScene },
  fighter: { Level: BasementGym, pose: scene.strike, travel: scene.advance, Companion: Strike, Corner: RingCornerScene },
}
