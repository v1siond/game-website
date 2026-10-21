import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { atClass, type LevelZone, type StageLook } from '@/components/scroll/stage'
import { DeskCorner, DrumKit, KitCorner, PadHolder, RingCorner, SoundWaves, StrikeFlash, Terminal, type DrumKitColors } from '@/components/scroll/stageProps'
import scene from '@/components/scroll/heroScene.module.css'
import { HeroCharacter } from './character'
import { ImpactBurst, SpeedLines } from './backdrop'
import { CEL } from './palette'
import world from './world.module.css'
import styles from './scenes.module.css'

// Cell Shaded's three profession stages on the shared stage (src/components/scroll/stage.tsx), each in
// two places: the level strip pinned above a section while it scrolls, and his corner in the contact
// scene. Every level is drawn the toon shaded way: the sky in flat bands, every shape in one ink line,
// speed lines behind him and comic impact bursts where a hit lands.
// - System Engineer runs the rooftops at sunset, the skyline drifting behind and speed lines rushing
//   past; terminals light (Experience) or comic page billboards pop up (Projects) as he reaches them.
//   He ends typing at his desk.
// - Musician plays his kit on a comic stage: the spotlights come on in turn, the speaker cones pump and
//   the sound bars rise with the sticks. He ends behind his kit.
// - Martial Artist crosses a rooftop ring at dusk to the pads and works the roundhouse kick, the knee and
//   the elbow; an orange impact burst blows up behind the pads on every strike. He ends gloves up in
//   his corner.
// Switching profession swaps the whole stage; no prop is shared between professions.
//
// Animated elements per strip, at most 14: his travel and four limbs, the skyline and the speed lines
// with three terminals or billboards; three spotlights, two speaker cones, two cymbals and five sound
// bars; the pads, the impact burst and the strike flash.

function Layer({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 600 100" preserveAspectRatio="none" className={`absolute inset-0 h-full w-full ${world.inked}`} aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

// The sky in flat bands, top to horizon.
function SkyBands({ bands }: { bands: string[] }) {
  const height = 100 / bands.length

  return (
    <>
      {bands.map((fill, i) => (
        <rect key={fill} x={-2} y={i * height} width={604} height={height + 1} fill={fill} />
      ))}
    </>
  )
}

function Rooftop() {
  return <div className="absolute inset-x-0 bottom-0 h-3 border-t-4 border-[#141414] bg-[#2b2b33]" aria-hidden="true" />
}

// ---- System Engineer: the rooftop run at sunset ----

const SUNSET = [CEL.violet, CEL.magenta, CEL.orange, CEL.sun]

// The skyline: flat towers with lit windows, wider than the strip so it can drift behind him.
const TOWERS = [
  { x: 10, width: 50, height: 46 },
  { x: 70, width: 36, height: 64 },
  { x: 120, width: 60, height: 38 },
  { x: 196, width: 40, height: 72 },
  { x: 250, width: 56, height: 50 },
  { x: 320, width: 34, height: 60 },
  { x: 368, width: 64, height: 42 },
  { x: 446, width: 42, height: 68 },
  { x: 502, width: 58, height: 48 },
  { x: 574, width: 40, height: 58 },
  { x: 628, width: 52, height: 44 },
]

function Skyline() {
  return (
    <svg
      viewBox="0 0 690 100"
      preserveAspectRatio="none"
      className={`absolute bottom-3 left-0 h-[72%] w-[115%] ${world.inked} ${styles.drift}`}
      aria-hidden="true"
      focusable="false"
    >
      {TOWERS.map(({ x, width, height }) => (
        <g key={x}>
          <rect x={x} y={100 - height} width={width} height={height} fill={CEL.night} />
          <rect x={x + width * 0.2} y={100 - height + 8} width={width * 0.18} height={5} fill={CEL.sun} />
          <rect x={x + width * 0.6} y={100 - height + 20} width={width * 0.18} height={5} fill={CEL.sun} />
        </g>
      ))}
    </svg>
  )
}

function SunsetRun() {
  return (
    <>
      <Layer>
        <SkyBands bands={SUNSET} />
        <circle cx={470} cy={58} r={20} fill="#fff3b0" />
      </Layer>
      <Skyline />
      <SpeedLines className={`absolute left-0 top-[12%] h-1/2 w-[150%] opacity-60 ${styles.rush}`} color="#ffffff" />
      <Rooftop />
    </>
  )
}

// A comic page billboard on the roof: it pops up as he reaches it.
function Billboard({ position, panels }: { position: number; panels: [string, string, string] }) {
  const [first, second, third] = panels

  return (
    <svg
      viewBox="0 0 44 48"
      className={`absolute bottom-3 left-[calc(var(--at)*100%_-_1.5rem)] h-11 w-10 sm:h-16 sm:w-14 ${world.inked} ${atClass(position)} ${styles.popAt}`}
      aria-hidden="true"
      focusable="false"
    >
      <rect x={20} y={30} width={4} height={18} fill={CEL.inkSoft} />
      <rect x={2} y={2} width={40} height={30} fill={CEL.paper} />
      <rect x={6} y={6} width={15} height={11} fill={first} />
      <rect x={23} y={6} width={15} height={11} fill={second} />
      <rect x={6} y={19} width={32} height={9} fill={third} />
    </svg>
  )
}

const TERMINAL = { body: CEL.inkSoft, screen: CEL.sky, stand: CEL.ink }

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
      <Billboard position={0.3} panels={[CEL.sky, CEL.magenta, CEL.sun]} />
      <Billboard position={0.6} panels={[CEL.orange, CEL.sky, CEL.green]} />
      <Billboard position={0.9} panels={[CEL.magenta, CEL.sun, CEL.sky]} />
    </>
  ),
}

function EngineerLevel({ zone }: { zone: LevelZone }) {
  return (
    <>
      <SunsetRun />
      {ENGINEER_PROPS[zone]}
    </>
  )
}

// ---- Musician: the comic stage, spotlights, speakers and his kit ----

const KIT: DrumKitColors = { stand: CEL.ink, shell: CEL.red, rim: CEL.ink, bass: CEL.sun, cymbal: styles.cymbal }
const WAVES: [string, string] = [CEL.sun, CEL.sky]

// The rays of the burst painted on the back wall, every other one in the darker band.
const WALL_RAYS = Array.from({ length: 9 }, (_, i) => {
  const left = -80 + i * 20
  const right = left + 10
  const point = (angle: number) => `${300 + Math.sin((angle * Math.PI) / 180) * 400},${100 - Math.cos((angle * Math.PI) / 180) * 400}`
  return `300,100 ${point(left)} ${point(right)}`
})

const SPOTLIGHTS = [
  { position: 0.2, x: 120 },
  { position: 0.5, x: 300 },
  { position: 0.8, x: 480 },
]

function ComicStage() {
  return (
    <>
      <Layer>
        <rect x={-2} y={-2} width={604} height={104} fill={CEL.magenta} />
        {WALL_RAYS.map((points) => (
          <polygon key={points} points={points} fill={CEL.violet} />
        ))}
        {SPOTLIGHTS.map(({ position, x }) => (
          <g key={x} className={`${scene.lightAt} ${atClass(position)}`}>
            <polygon points={`${x - 8},0 ${x + 8},0 ${x + 46},88 ${x - 46},88`} fill="#fff3b0" />
          </g>
        ))}
        <rect x={-2} y={86} width={604} height={16} fill={CEL.orange} />
      </Layer>
      <Speakers />
      <SoundWaves className="absolute bottom-4 right-24 h-12 w-14 sm:right-32 sm:h-16 sm:w-20" colors={WAVES} />
    </>
  )
}

// The speaker stack at the side of the stage; its two cones pump with the stick hits.
function Speakers() {
  return (
    <svg viewBox="0 0 30 60" className={`absolute bottom-3 right-3 h-16 w-8 sm:h-24 sm:w-12 ${world.inked}`} aria-hidden="true" focusable="false">
      <rect x={1} y={1} width={28} height={58} fill={CEL.inkSoft} />
      <circle cx={15} cy={16} r={9} fill={CEL.steel} className={styles.pump} />
      <circle cx={15} cy={42} r={11} fill={CEL.steel} className={`${styles.pump} [--phase:0.5turn]`} />
    </svg>
  )
}

function KitInFront() {
  return <DrumKit className={`absolute bottom-1 left-8 h-14 w-20 sm:left-10 sm:h-20 sm:w-28 ${world.inked}`} colors={KIT} />
}

// ---- Martial Artist: the rooftop ring at dusk, the pads, kicks, knees, elbows ----

const DUSK = [CEL.night, CEL.violet, CEL.magenta]
const ROPES: [string, string, string] = [CEL.red, CEL.paper, CEL.sky]

const ringPostAt = (x: number) => <rect key={x} x={x - 4} y={28} width={8} height={62} fill={CEL.sky} />

function RooftopRing() {
  return (
    <>
      <Layer>
        <SkyBands bands={DUSK} />
        {TOWERS.slice(0, 9).map(({ x, width, height }) => (
          <rect key={x} x={x * 0.9} y={100 - height * 0.7} width={width} height={height * 0.7} fill={CEL.ink} />
        ))}
        {[40, 300, 560].map(ringPostAt)}
        {ROPES.map((color, i) => (
          <line key={color} x1={0} y1={40 + i * 16} x2={600} y2={40 + i * 16} stroke={color} strokeWidth={2} />
        ))}
        <rect x={-2} y={88} width={604} height={14} fill={CEL.skyDeep} />
      </Layer>
      {/* where his advance ends: 40% of the canvas, plus his own width */}
      <div className={`absolute bottom-6 left-[calc(40%_+_3rem)] h-20 w-20 sm:left-[calc(40%_+_4rem)] sm:h-28 sm:w-28 ${styles.impactFrame}`} aria-hidden="true">
        <ImpactBurst fill={CEL.orange} />
      </div>
      <PadHolder className={`left-[calc(40%_+_4.5rem)] sm:left-[calc(40%_+_5.5rem)] ${world.inked}`} body={CEL.inkSoft} pads={CEL.red} />
      <Rooftop />
    </>
  )
}

function Strike() {
  return <StrikeFlash color={CEL.sun} />
}

// ---- the contact corners: where each profession ends the page ----

function DeskCornerScene() {
  return (
    <DeskCorner
      hero={<HeroCharacter profession="engineer" className={scene.hero} />}
      colors={{ panel: CEL.ink, screens: [CEL.sky, CEL.sun], desk: CEL.inkSoft, keyboard: CEL.steel }}
    />
  )
}

function KitCornerScene() {
  return <KitCorner hero={<HeroCharacter profession="drummer" className={scene.hero} />} kit={KIT} waves={WAVES} />
}

function RingCornerScene() {
  return (
    <RingCorner hero={<HeroCharacter profession="fighter" className={scene.hero} />} side="left" post={<rect x={4} y={20} width={8} height={80} fill={CEL.red} stroke={CEL.ink} strokeWidth={1.5} />} ropes={ROPES}>
      <rect x={0} y={92} width={160} height={8} fill={CEL.skyDeep} />
    </RingCorner>
  )
}

export const PROFESSION_STAGES: Record<Profession, StageLook> = {
  engineer: { Level: EngineerLevel, pose: scene.stride, travel: scene.walk, Companion: null, Corner: DeskCornerScene },
  // He plays from a quarter of the way across the stage, under the first spotlights.
  drummer: { Level: ComicStage, pose: scene.drum, travel: 'translate-x-[24%]', Companion: KitInFront, Corner: KitCornerScene },
  fighter: { Level: RooftopRing, pose: scene.strike, travel: scene.advance, Companion: Strike, Corner: RingCornerScene },
}
