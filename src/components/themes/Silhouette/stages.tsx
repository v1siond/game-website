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
import { SHADE, SKY, type SkyLight } from './palette'
import styles from './scenes.module.css'

// Silhouette's three profession stages on the shared stage (src/components/scroll/stage.tsx), each in
// two places: the level strip pinned above a section while it scrolls, and his corner behind the
// parting rocks of the contact scene. A level is the side view of a silhouette game: a lit sky, a far
// fog layer, a nearer darker one, a fog band drifting over the black ground, and him walking in front.
// - System Engineer walks the dawn machine forest, pylons and pines in the fog, past black terminals
//   whose screens wake (Experience) or server racks whose lamps come on (Projects), to the door at the
//   end of the path, whose light opens as he arrives.
// - Musician plays his kit on a hilltop against the ember sunset: the birds cross the sun, the grass
//   bends and the cymbals tip with the hits, the sound bars rise beside him.
// - Martial Artist crosses the ring under a crimson dusk, a temple roof in the fog behind, to the pad
//   holder and works the roundhouse kick, the knee and the elbow; the lanterns on the rope swing with
//   each strike. He ends gloves up in his corner.
// Switching profession swaps the whole stage; no prop is shared between professions.
//
// Animated elements per strip, at most 17: the three depth layers, his travel and four limbs, and the
// props that answer (three terminals or racks and the door; the birds, two tufts, two cymbals and five
// sound bars; two lanterns, two pads and the flash).

export const PROFESSION_SKY: Record<Profession, SkyLight> = {
  engineer: SKY.dawn,
  drummer: SKY.ember,
  fighter: SKY.crimson,
}

// ---- the layers every level is built from ----

export function Sky({ light }: { light: SkyLight }) {
  return <div className={`absolute inset-0 bg-gradient-to-b ${light.sky}`} aria-hidden="true" />
}

// The depth layers: each a LevelArt wider than the strip, sliding at its own speed (scenes.module.css).
const FAR_LAYER = `absolute inset-y-0 left-0 h-full w-[130%] ${styles.far}`
const MID_LAYER = `absolute inset-y-0 left-0 h-full w-[150%] ${styles.mid}`
const BIRD_LAYER = `absolute inset-y-0 left-0 h-full w-[200%] ${styles.birds}`

function FogBand({ light }: { light: SkyLight }) {
  return (
    <div
      className={`absolute bottom-3 left-0 h-6 w-[160%] bg-gradient-to-r from-transparent to-transparent sm:h-8 ${light.fog} ${styles.drift}`}
      aria-hidden="true"
    />
  )
}

function Ground() {
  return <LevelGround className="border-[color:var(--sh-edge)] bg-[color:var(--sh-black)]" />
}

// A pine in two tiers on a short trunk, its foot at y 100, narrow enough for the mid layer's stretch.
const pine = (x: number, height: number) => {
  const top = 100 - height
  const tier = top + height * 0.45
  return `M${x - 0.7} 100 V${top + height * 0.8} M${x - 5} ${tier} L${x} ${top} L${x + 5} ${tier} Z M${x - 7} ${top + height * 0.85} L${x} ${top + height * 0.3} L${x + 7} ${top + height * 0.85} Z`
}

// ---- System Engineer: the dawn machine forest, terminals, server racks ----

const DAWN = SKY.dawn
const PYLON_XS = [92, 308, 523]
const MID_PINES = [20, 63, 120, 160, 220, 280, 313, 373, 427, 480, 540, 580]

function MachineForest() {
  return (
    <>
      <LevelArt className={FAR_LAYER}>
        <path d="M0 70 Q90 52 200 64 T400 60 T600 66 V100 H0 Z" fill={DAWN.far} />
        {PYLON_XS.map((x) => (
          <path
            key={x}
            d={`M${x - 7} 72 L${x} 22 L${x + 7} 72 M${x - 9} 34 H${x + 9} M${x - 5} 48 H${x + 5} M${x - 4} 34 L${x + 5} 48 M${x + 4} 34 L${x - 5} 48`}
            stroke={DAWN.far}
            strokeWidth={1.5}
            fill="none"
          />
        ))}
        <path d="M83 34 Q200 52 299 34 Q415 52 514 34 Q570 44 600 40" stroke={DAWN.far} strokeWidth={0.8} fill="none" />
      </LevelArt>
      <LevelArt className={MID_LAYER}>
        {MID_PINES.map((x, i) => (
          <path key={x} d={pine(x, 46 + (i % 3) * 12)} fill={DAWN.mid} />
        ))}
      </LevelArt>
    </>
  )
}

const PROP_POSITIONS = [0.24, 0.48, 0.72]

// A black server rack, the machine a project runs on: three units whose lamps come on as he passes.
function ServerRack({ position }: { position: number }) {
  return (
    <svg
      viewBox="0 0 30 50"
      className={`absolute bottom-3 left-[calc(var(--at)*100%_-_1rem)] h-14 w-8 sm:h-20 sm:w-12 ${atClass(position)}`}
      aria-hidden="true"
      focusable="false"
    >
      <rect x={1} y={1} width={28} height={49} fill={SHADE.black} stroke={DAWN.rim} strokeWidth={0.6} />
      {[5, 19, 33].map((y) => (
        <rect key={y} x={4} y={y} width={22} height={10} fill={SHADE.raised} />
      ))}
      <g className={scene.lightAt}>
        {[9, 23, 37].map((y) => (
          <rect key={y} x={7} y={y} width={5} height={2} fill={DAWN.rim} />
        ))}
      </g>
    </svg>
  )
}

const ENGINEER_PROPS: Record<LevelZone, ReactNode> = {
  record: PROP_POSITIONS.map((position) => (
    <Terminal key={position} position={position} body={SHADE.black} screen={DAWN.rim} stand={SHADE.black} />
  )),
  work: PROP_POSITIONS.map((position) => <ServerRack key={position} position={position} />),
}

// The door at the end of the path: a black frame in the last pine, its light opening as he arrives.
function EndDoor() {
  return (
    <svg viewBox="0 0 30 60" className="absolute bottom-3 right-1 h-16 w-8 sm:h-24 sm:w-12" aria-hidden="true" focusable="false">
      <rect x={1} y={4} width={28} height={56} fill={SHADE.black} />
      <rect x={7} y={12} width={16} height={48} fill={DAWN.rim} className={styles.doorLight} />
    </svg>
  )
}

function EngineerLevel({ zone }: { zone: LevelZone }) {
  return (
    <>
      <Sky light={DAWN} />
      <MachineForest />
      <FogBand light={DAWN} />
      <Ground />
      {ENGINEER_PROPS[zone]}
      <EndDoor />
    </>
  )
}

// ---- Musician: the ember hill, his kit, sound ----

const EMBER = SKY.ember

const KIT: DrumKitColors = {
  stand: SHADE.black,
  shell: SHADE.black,
  rim: EMBER.rim,
  bass: EMBER.rim,
  cymbal: styles.cymbal,
}

const BIRDS = [
  { x: 190, y: 22 },
  { x: 205, y: 14 },
  { x: 220, y: 26 },
  { x: 350, y: 18 },
]

function EmberHill() {
  return (
    <>
      <Sky light={EMBER} />
      <LevelArt>
        <ellipse cx={330} cy={72} rx={22} ry={30} fill={SHADE.sun} />
      </LevelArt>
      <LevelArt className={FAR_LAYER}>
        <path d="M0 78 Q108 58 230 74 T460 70 T600 76 V100 H0 Z" fill={EMBER.far} />
      </LevelArt>
      <LevelArt className={BIRD_LAYER}>
        {BIRDS.map(({ x, y }) => (
          <path key={x} d={`M${x - 3} ${y} Q${x - 1.5} ${y - 3} ${x} ${y} Q${x + 1.5} ${y - 3} ${x + 3} ${y}`} stroke={SHADE.black} strokeWidth={1.4} fill="none" />
        ))}
      </LevelArt>
      <LevelArt>
        <path d="M0 100 V88 Q160 70 300 74 Q440 70 600 88 V100 Z" fill={EMBER.mid} />
        <path d="M60 88 l3 -12 l3 12 l4 -9 l2 9 Z" fill={SHADE.black} className={styles.sway} />
        <path d="M530 88 l3 -12 l3 12 l4 -9 l2 9 Z" fill={SHADE.black} className={`${styles.sway} [--phase:0.5turn]`} />
      </LevelArt>
      <FogBand light={EMBER} />
      <Ground />
      <SoundWaves className="absolute bottom-3 right-3 h-12 w-14 sm:right-6 sm:h-16 sm:w-20" colors={[EMBER.rim, SHADE.glow]} />
    </>
  )
}

function KitOnTheHill() {
  return <DrumKit className="absolute bottom-1 left-8 h-14 w-20 sm:left-10 sm:h-20 sm:w-28" colors={KIT} />
}

// ---- Martial Artist: the crimson dusk ring, the pads, kicks, knees, elbows ----

const CRIMSON = SKY.crimson
const LANTERN_XS = [150, 450]

// A temple's tiered roof, its eave finials curling up at each end, in the fog behind the ring (drawn
// narrow for the far layer's stretch).
function TempleRoof({ x }: { x: number }) {
  return (
    <path
      d={`M${x - 46} 76 H${x + 46} V100 H${x - 46} Z M${x - 54} 76 L${x - 31} 58 H${x + 31} L${x + 54} 76 Z M${x - 38} 58 L${x - 18} 42 H${x + 18} L${x + 38} 58 Z M${x - 23} 42 L${x} 22 L${x + 23} 42 Z M${x - 54} 76 Q${x - 60} 72 ${x - 58} 64 M${x + 54} 76 Q${x + 60} 72 ${x + 58} 64 M${x} 22 V12`}
      fill={CRIMSON.far}
      stroke={CRIMSON.far}
      strokeWidth={1.5}
    />
  )
}

function DuskRing() {
  return (
    <>
      <Sky light={CRIMSON} />
      <LevelArt className={FAR_LAYER}>
        <path d="M0 74 L70 52 L130 70 L200 46 L277 72 H600 V100 H0 Z" fill={CRIMSON.mid} />
        <TempleRoof x={415} />
      </LevelArt>
      <FogBand light={CRIMSON} />
      <LevelArt>
        <rect x={4} y={26} width={8} height={74} fill={SHADE.black} />
        <rect x={588} y={26} width={8} height={74} fill={SHADE.black} />
        <line x1={8} y1={42} x2={592} y2={42} stroke={CRIMSON.rim} strokeWidth={1.6} />
        <line x1={8} y1={58} x2={592} y2={58} stroke={SHADE.ember} strokeWidth={1.6} />
        <line x1={8} y1={74} x2={592} y2={74} stroke={CRIMSON.rim} strokeWidth={1.6} />
        {LANTERN_XS.map((x) => (
          <g key={x} className={styles.lantern}>
            <line x1={x} y1={42} x2={x} y2={48} stroke={SHADE.black} strokeWidth={1} />
            <rect x={x - 3} y={48} width={6} height={9} rx={2} fill={CRIMSON.rim} />
          </g>
        ))}
      </LevelArt>
      <Ground />
      <PadHolder className="left-[calc(40%_+_4.5rem)] sm:left-[calc(40%_+_5.5rem)]" body={SHADE.black} pads={SHADE.ember} />
    </>
  )
}

function RimFlash() {
  return <StrikeFlash color={CRIMSON.rim} />
}

// ---- the contact corners: where each profession ends the page, behind the parting rocks ----

function EngineerCorner() {
  return (
    <DeskCorner
      hero={<HeroCharacter profession="engineer" className={scene.hero} />}
      colors={{
        panel: SHADE.black,
        screens: [DAWN.rim, DAWN.far],
        desk: SHADE.black,
        keyboard: SHADE.raised,
      }}
    />
  )
}

function MusicianCorner() {
  return <KitCorner hero={<HeroCharacter profession="drummer" className={scene.hero} />} kit={KIT} waves={[EMBER.rim, SHADE.glow]} />
}

function FighterCorner() {
  return (
    <RingCorner
      hero={<HeroCharacter profession="fighter" className={scene.hero} />}
      side="left"
      post={ringPost('left', SHADE.black)}
      ropes={[CRIMSON.rim, SHADE.ember, CRIMSON.rim]}
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
    Level: EmberHill,
    pose: scene.drum,
    travel: styles.onHill,
    Companion: KitOnTheHill,
    Corner: MusicianCorner,
  },
  fighter: {
    Level: DuskRing,
    pose: scene.strike,
    travel: scene.advance,
    Companion: RimFlash,
    Corner: FighterCorner,
  },
}
