import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { atClass, LevelArt, LevelGround, type LevelZone, type StageLook } from '@/components/scroll/stage'
import { DeskCorner, DrumKit, KitCorner, PadHolder, RingCorner, ringPost, SoundWaves, StrikeFlash, Terminal, type DrumKitColors } from '@/components/scroll/stageProps'
import scene from '@/components/scroll/heroScene.module.css'
import { HeroCharacter } from './character'
import { IrisRing, PieEyes } from './art'
import { HOSE } from './palette'
import world from './world.module.css'
import styles from './scenes.module.css'

// Rubber Hose's three profession stages on the shared stage (src/components/scroll/stage.tsx), each in
// two places: the level strip pinned above a section while it scrolls, and his corner in the contact
// scene. Every level is a 1930s cartoon set in sepia under one ink line, bobbing on one beat, its props
// wearing pie eyes (never him).
// - System Engineer bounces down a cartoon street, the pie eyed houses squashing and stretching to the
//   beat; terminals light (Experience) or show poster columns spring up (Projects) as he reaches them.
//   He ends typing at his desk.
// - Musician plays his kit on a vaudeville stage between red curtains: the footlights come on in turn,
//   the pie eyed gramophone's horn pumps and the sound bars rise with the sticks. He ends behind his kit.
// - Martial Artist crosses a fairground prize ring under the big top to the pads and works the
//   roundhouse kick, the knee and the elbow while the crowd bobs and the pie eyed bell swings on every
//   strike. He ends gloves up in his corner.
// Switching profession swaps the whole stage; no prop is shared between professions.
//
// Animated elements per strip, at most 16: his travel, his bounce and four limbs, the two house rows
// with three terminals or poster columns and the iris; three footlights, the gramophone, two cymbals
// and five sound bars; the crowd, the pads, the bell and the strike flash.

const GROUND = 'border-[var(--hose-ink)] bg-[var(--hose-ink-soft)]'

// Every level opens on the iris, drawn over him and the props (z-10 inside the strip).
function IrisIn() {
  return <IrisRing className={`z-10 ${styles.irisIn}`} />
}

// ---- System Engineer: the cartoon street ----

function Sun() {
  return (
    <svg viewBox="0 0 40 40" className={`absolute right-[18%] top-2 h-8 w-8 sm:h-12 sm:w-12 ${world.inked}`} aria-hidden="true" focusable="false">
      {[0, 45, 90, 135].map((angle) => (
        <rect key={angle} x={18.5} y={1} width={3} height={38} fill={HOSE.gold} transform={`rotate(${angle} 20 20)`} />
      ))}
      <circle cx={20} cy={20} r={11} fill={HOSE.gold} />
    </svg>
  )
}

// A house of the street: walls, roof, the door and two pie eyed windows looking down at him.
function House({ roof }: { roof: string }) {
  return (
    <svg viewBox="0 0 40 60" className={`h-full w-full ${world.inked}`} aria-hidden="true" focusable="false">
      <path d="M2 24 L20 4 L38 24 Z" fill={roof} />
      <rect x={5} y={24} width={30} height={36} fill={HOSE.paperSepia} />
      <rect x={8} y={29} width={24} height={13} rx={6} fill={HOSE.paper} />
      <PieEyes cx={20} cy={35.5} size={14} />
      <rect x={16} y={46} width={8} height={14} rx={4} fill={HOSE.shadowDark} />
    </svg>
  )
}

interface HouseRowProps {
  // Each house's place and height as literal classes.
  houses: { place: string; roof: string }[]
  phase: string
}

function HouseRow({ houses, phase }: HouseRowProps) {
  return (
    <div className={`absolute inset-x-0 bottom-3 h-[62%] ${styles.bobRow} ${phase}`} aria-hidden="true">
      {houses.map(({ place, roof }) => (
        <div key={place} className={`absolute bottom-0 aspect-[2/3] ${place}`}>
          <House roof={roof} />
        </div>
      ))}
    </div>
  )
}

const BACK_HOUSES = [
  { place: 'left-[4%] h-[80%]', roof: HOSE.redDark },
  { place: 'left-[34%] h-full', roof: HOSE.blue },
  { place: 'left-[66%] h-[86%]', roof: HOSE.redDark },
]

const FRONT_HOUSES = [
  { place: 'left-[18%] h-[70%]', roof: HOSE.orange },
  { place: 'left-[50%] h-[76%]', roof: HOSE.redDark },
  { place: 'left-[84%] h-[68%]', roof: HOSE.blue },
]

function CartoonStreet() {
  return (
    <>
      <LevelArt>
        <rect x={-2} y={-2} width={604} height={104} fill={HOSE.paper} />
        <path d="M-2 78 Q80 52 170 74 T360 70 T540 66 L602 72 V102 H-2 Z" fill={HOSE.paperDark} />
      </LevelArt>
      <Sun />
      <HouseRow houses={BACK_HOUSES} phase="[--phase:0turn]" />
      <HouseRow houses={FRONT_HOUSES} phase="[--phase:0.5turn]" />
      <LevelGround className={GROUND} />
    </>
  )
}

// A show poster column on the street: it springs up as he reaches it.
function PosterColumn({ position, poster }: { position: number; poster: [string, string] }) {
  const [sheet, band] = poster

  return (
    <svg
      viewBox="0 0 24 60"
      className={`absolute bottom-3 left-[calc(var(--at)*100%_-_1rem)] h-12 w-5 sm:h-16 sm:w-7 ${world.inked} ${atClass(position)} ${styles.springAt}`}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3 8 Q12 0 21 8 Z" fill={HOSE.ink} />
      <rect x={4} y={8} width={16} height={50} fill={HOSE.paperDark} />
      <rect x={6} y={14} width={12} height={24} fill={sheet} />
      <rect x={6} y={30} width={12} height={4} fill={band} />
      <rect x={2} y={56} width={20} height={4} fill={HOSE.ink} />
    </svg>
  )
}

const TERMINAL = { body: HOSE.inkSoft, screen: HOSE.gold, stand: HOSE.ink }

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
      <PosterColumn position={0.3} poster={[HOSE.red, HOSE.gold]} />
      <PosterColumn position={0.6} poster={[HOSE.blue, HOSE.paper]} />
      <PosterColumn position={0.9} poster={[HOSE.gold, HOSE.redDark]} />
    </>
  ),
}

function EngineerLevel({ zone }: { zone: LevelZone }) {
  return (
    <>
      <CartoonStreet />
      {ENGINEER_PROPS[zone]}
      <IrisIn />
    </>
  )
}

// ---- Musician: the vaudeville stage ----

const KIT: DrumKitColors = { stand: HOSE.ink, shell: HOSE.redDark, rim: HOSE.gold, bass: HOSE.gold, cymbal: styles.cymbal }
const WAVES: [string, string] = [HOSE.gold, HOSE.redDark]

const FOOTLIGHTS = [
  { position: 0.2, x: 120 },
  { position: 0.5, x: 300 },
  { position: 0.8, x: 480 },
]

function VaudevilleStage() {
  return (
    <>
      <LevelArt>
        <rect x={-2} y={-2} width={604} height={104} fill={HOSE.paperDark} />
        {/* the curtains gathered at both sides and the swagged valance across the top */}
        <path d="M-2 -2 H90 Q70 40 84 88 H-2 Z" fill={HOSE.red} />
        <path d="M602 -2 H510 Q530 40 516 88 H602 Z" fill={HOSE.red} />
        <path d="M-2 -2 H602 V10 Q525 24 450 10 Q375 24 300 10 Q225 24 150 10 Q75 24 -2 10 Z" fill={HOSE.redDark} />
        {FOOTLIGHTS.map(({ position, x }) => (
          <g key={x} className={`${scene.lightAt} ${atClass(position)}`}>
            <polygon points={`${x - 10},88 ${x + 10},88 ${x + 50},20 ${x - 50},20`} fill={HOSE.highlight} opacity={0.6} />
          </g>
        ))}
        <rect x={-2} y={86} width={604} height={16} fill={HOSE.shadowDark} />
      </LevelArt>
      <Gramophone />
      <SoundWaves className="absolute bottom-4 right-24 h-12 w-14 sm:right-36 sm:h-16 sm:w-20" colors={WAVES} />
      <IrisIn />
    </>
  )
}

// The gramophone on its cabinet at the side of the stage, its pie eyed horn pumping with the sticks.
function Gramophone() {
  return (
    <svg viewBox="0 0 44 56" className={`absolute bottom-3 right-3 h-16 w-12 sm:h-24 sm:w-[4.5rem] ${world.inked}`} aria-hidden="true" focusable="false">
      <rect x={6} y={36} width={26} height={20} fill={HOSE.shadowDark} />
      <rect x={4} y={32} width={30} height={5} fill={HOSE.inkSoft} />
      <rect x={17} y={22} width={3} height={11} fill={HOSE.gold} />
      <g className={styles.pump}>
        <path d="M18 24 L30 4 Q44 6 42 22 Z" fill={HOSE.gold} />
        <PieEyes cx={34} cy={14} size={9} paper={HOSE.gold} />
      </g>
    </svg>
  )
}

function KitInFront() {
  return <DrumKit className={`absolute bottom-1 left-8 h-14 w-20 sm:left-10 sm:h-20 sm:w-28 ${world.inked}`} colors={KIT} />
}

// ---- Martial Artist: the fairground prize ring under the big top ----

const ROPES: [string, string, string] = [HOSE.red, HOSE.paper, HOSE.blue]

// The big top's canvas in red and paper stripes, fanning down from the pole.
const TENT_STRIPES = Array.from({ length: 12 }, (_, i) => {
  const left = -60 + i * 60
  return { points: `300,-40 ${left},100 ${left + 30},100`, key: left }
})

const ringPostAt = (x: number) => <rect key={x} x={x - 4} y={34} width={8} height={56} fill={HOSE.gold} />

function PrizeRing() {
  return (
    <>
      <LevelArt>
        <rect x={-2} y={-2} width={604} height={104} fill={HOSE.paper} />
        {TENT_STRIPES.map(({ points, key }) => (
          <polygon key={key} points={points} fill={HOSE.red} opacity={0.75} />
        ))}
        <path d="M0 12 Q150 30 300 12 T600 12" fill="none" stroke={HOSE.ink} strokeWidth={1} />
      </LevelArt>
      <Crowd />
      <LevelArt>
        {[40, 300, 560].map(ringPostAt)}
        {ROPES.map((color, i) => (
          <line key={color} x1={0} y1={46 + i * 14} x2={600} y2={46 + i * 14} stroke={color} strokeWidth={2} />
        ))}
        <rect x={-2} y={88} width={604} height={14} fill={HOSE.paperDark} />
      </LevelArt>
      <RingBell />
      <PadHolder className={`left-[calc(38%_+_4.5rem)] sm:left-[calc(38%_+_5.5rem)] ${world.inked}`} body={HOSE.inkSoft} pads={HOSE.red} />
      <LevelGround className={GROUND} />
      <IrisIn />
    </>
  )
}

// The crowd at the ringside, round heads in a row behind the ropes, bobbing on the beat as one.
function Crowd() {
  return (
    <LevelArt className={`absolute inset-0 h-full w-full ${styles.crowd}`}>
      {Array.from({ length: 20 }, (_, i) => (
        <ellipse key={i} cx={15 + i * 30} cy={70 + (i % 2) * 4} rx={11} ry={13} fill={i % 3 ? HOSE.inkSoft : HOSE.shadowDark} />
      ))}
    </LevelArt>
  )
}

// The ring bell on the far post, swinging on every strike, its pie eyes on the dome.
function RingBell() {
  return (
    <svg viewBox="0 0 24 30" className={`absolute right-[5%] top-[18%] h-8 w-6 sm:h-10 sm:w-8 ${world.inked}`} aria-hidden="true" focusable="false">
      <rect x={10} y={0} width={4} height={6} fill={HOSE.ink} />
      <g className={styles.bell}>
        <path d="M3 24 Q3 6 12 6 Q21 6 21 24 Z" fill={HOSE.gold} />
        <PieEyes cx={12} cy={14} size={9} paper={HOSE.gold} />
        <rect x={1} y={23} width={22} height={3} rx={1.5} fill={HOSE.shadowDark} />
      </g>
    </svg>
  )
}

function Strike() {
  return <StrikeFlash color={HOSE.gold} />
}

// ---- the contact corners: where each profession ends the page ----

function DeskCornerScene() {
  return (
    <DeskCorner
      hero={<HeroCharacter profession="engineer" className={scene.hero} />}
      colors={{ panel: HOSE.ink, screens: [HOSE.gold, HOSE.highlight], desk: HOSE.shadowDark, keyboard: HOSE.inkSoft }}
    />
  )
}

function KitCornerScene() {
  return <KitCorner hero={<HeroCharacter profession="drummer" className={scene.hero} />} kit={KIT} waves={WAVES} />
}

function RingCornerScene() {
  return (
    <RingCorner hero={<HeroCharacter profession="fighter" className={scene.hero} />} side="left" post={ringPost('left', HOSE.gold)} ropes={ROPES}>
      <rect x={0} y={92} width={160} height={8} fill={HOSE.paperDark} />
    </RingCorner>
  )
}

export const PROFESSION_STAGES: Record<Profession, StageLook> = {
  engineer: { Level: EngineerLevel, pose: scene.stride, travel: scene.walk, Companion: null, Corner: DeskCornerScene },
  // He plays from a quarter of the way across the stage, between the first footlights.
  drummer: { Level: VaudevilleStage, pose: scene.drum, travel: 'translate-x-[24%]', Companion: KitInFront, Corner: KitCornerScene },
  fighter: { Level: PrizeRing, pose: scene.strike, travel: scene.advance, Companion: Strike, Corner: RingCornerScene },
}
