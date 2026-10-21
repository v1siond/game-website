import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { atClass, type LevelZone, type StageLook } from '@/components/scroll/stage'
import { DeskCorner, DrumKit, KitCorner, PadHolder, SoundWaves, StrikeFlash, Terminal, type DrumKitColors } from '@/components/scroll/stageProps'
import scene from '@/components/scroll/heroScene.module.css'
import { HeroCharacter } from './character'
import { COLORS } from './palette'
import { Mango } from './icons'
import styles from './scenes.module.css'

// Tropical Platformer's three profession stages on the shared stage (src/components/scroll/stage.tsx),
// each in two places: the level strip pinned above a section while it scrolls, and his corner behind
// the palm fronds of the contact scene. A level is a side scrolling island run, the far islands and the
// palms drifting behind him at their own depths:
// - System Engineer runs the jungle boardwalk, hopping three stumps and collecting the mango trail,
//   past stone pedestal terminals whose circuit traces light under the planks (Experience) or bamboo
//   server racks whose lamps come on (Projects), and the checkpoint flag rises as he reaches the end.
// - Musician plays his kit on the beach stage: the palms sway and the tiki torches flare on the hits,
//   the sound bars rise beside him.
// - Martial Artist crosses the jungle clearing ring to the pad holder and works the roundhouse kick, the
//   knee and the elbow, a sun gold flash on each strike; he ends gloves up in his corner.
// Switching profession swaps the whole stage; no prop is shared between professions.
//
// Animated elements per strip, at most 19: the two drifting layers, his travel and four swinging limbs,
// and the props that answer (five mangos, three terminals or racks, three traces and the flag; two palms,
// two torches, two cymbals and five sound bars; two torches, two pads and the flash).

// ---- the island pieces every level is built from ----

function Backdrop({ sky, children }: { sky: string; children?: ReactNode }) {
  return (
    <svg viewBox="0 0 600 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <rect width={600} height={100} fill={sky} />
      {children}
    </svg>
  )
}

// The far islands over the sea line, then the near palms, each layer wider than the strip so it can
// drift left as he runs right.
function FarIslands() {
  return (
    <div className={`absolute inset-y-0 left-0 w-[140%] ${scene.far}`} aria-hidden="true">
      <svg viewBox="0 0 840 100" preserveAspectRatio="none" className="h-full w-full" focusable="false">
        <rect y={58} width={840} height={42} fill={COLORS.sea} />
        <path d="M40 60 Q90 22 150 60 Z M300 60 Q340 34 390 60 Z M560 60 Q630 14 700 60 Z" fill={COLORS.lagoonDeep} />
        <path d="M0 64 H840" stroke={COLORS.seaLight} strokeWidth={1.5} strokeDasharray="20 16" />
      </svg>
    </div>
  )
}

const PALM_XS = [60, 250, 470, 690]

function Palm({ x, sway = '' }: { x: number; sway?: string }) {
  return (
    <g className={sway}>
      <path d={`M${x} 100 Q${x - 6} 70 ${x + 4} 40`} stroke={COLORS.woodMid} strokeWidth={5} fill="none" />
      <path
        d={`M${x + 4} 40 Q${x - 26} 30 ${x - 34} 48 M${x + 4} 40 Q${x + 34} 30 ${x + 40} 50 M${x + 4} 40 Q${x - 8} 18 ${x - 22} 22 M${x + 4} 40 Q${x + 20} 16 ${x + 34} 24`}
        stroke={COLORS.leaf}
        strokeWidth={6}
        strokeLinecap="round"
        fill="none"
      />
    </g>
  )
}

function NearPalms() {
  return (
    <div className={`absolute inset-y-0 left-0 w-[140%] ${scene.mid}`} aria-hidden="true">
      <svg viewBox="0 0 840 100" preserveAspectRatio="none" className="h-full w-full" focusable="false">
        {PALM_XS.map((x) => (
          <Palm key={x} x={x} />
        ))}
      </svg>
    </div>
  )
}

function Boardwalk() {
  return <div className="absolute inset-x-0 bottom-0 h-3 border-t-4 border-[var(--tp-wood-dark)] bg-[var(--tp-wood)]" aria-hidden="true" />
}

// Placed along his path (hero space): --at is the progress at which he stands over the piece.
const ON_PATH = 'absolute left-[calc(var(--at)*(100%_-_5.5rem)_+_2rem)]'

// He hops at the top of each jump arc in .hop (scenes.module.css): progress 1/12, 5/12 and 9/12.
const JUMPS = [1 / 12, 5 / 12, 9 / 12]

function Stumps() {
  return (
    <>
      {JUMPS.map((position) => (
        <svg key={position} viewBox="0 0 20 16" className={`${ON_PATH} bottom-3 h-4 w-5 ${atClass(position)}`} aria-hidden="true" focusable="false">
          <rect x={1} y={2} width={18} height={14} rx={2} fill={COLORS.woodMid} />
          <ellipse cx={10} cy={3} rx={9} ry={2.5} fill={COLORS.woodLight} />
        </svg>
      ))}
    </>
  )
}

// The mango trail: a fruit at each jump top and between them, each popping up and gone as he reaches it.
const MANGOS = [1 / 12, 0.25, 5 / 12, 0.58, 9 / 12]

function MangoTrail() {
  return (
    <>
      {MANGOS.map((position) => (
        <div key={position} className={`${ON_PATH} bottom-14 sm:bottom-16 ${atClass(position)} ${styles.collect}`} aria-hidden="true">
          <Mango size={18} />
        </div>
      ))}
    </>
  )
}

// The checkpoint at the end of the run: a bamboo pole whose flag rises as he arrives.
function Checkpoint() {
  return (
    <svg viewBox="0 0 24 60" className="absolute bottom-3 right-1 h-16 w-6 sm:h-24 sm:w-9" aria-hidden="true" focusable="false">
      <rect x={3} y={2} width={3} height={58} fill={COLORS.sandLight} />
      <path d="M2 14 H7 M2 30 H7 M2 46 H7" stroke={COLORS.woodMid} strokeWidth={1.5} />
      <path d="M6 44 L22 49 L6 54 Z" fill={COLORS.hazard} className={styles.flag} />
    </svg>
  )
}

// ---- System Engineer: the jungle boardwalk, terminals, circuits, server racks ----

const PROP_POSITIONS = [0.28, 0.56, 0.84]

// The circuit traces under the planks, each lighting as he runs over it.
function CircuitTraces() {
  return (
    <>
      {[0.05, 0.38, 0.7].map((position) => (
        <div
          key={position}
          className={`absolute bottom-1 left-[calc(var(--at)*100%)] h-1 w-[28%] bg-[var(--tp-gem-green)] ${atClass(position)} ${scene.lightAt}`}
          aria-hidden="true"
        />
      ))}
    </>
  )
}

// A bamboo server rack, the machine a project runs on: three units whose lamps come on as he passes.
function BambooRack({ position }: { position: number }) {
  return (
    <svg
      viewBox="0 0 32 52"
      className={`absolute bottom-3 left-[calc(var(--at)*100%_-_1rem)] h-14 w-9 sm:h-20 sm:w-12 ${atClass(position)}`}
      aria-hidden="true"
      focusable="false"
    >
      <rect x={1} y={1} width={4} height={51} fill={COLORS.sandLight} />
      <rect x={27} y={1} width={4} height={51} fill={COLORS.sandLight} />
      <path d="M1 12 H31 M1 26 H31 M1 40 H31" stroke={COLORS.woodMid} strokeWidth={1.5} />
      {[4, 18, 32].map((y) => (
        <rect key={y} x={6} y={y} width={20} height={8} rx={1} fill={COLORS.night} />
      ))}
      <g className={scene.lightAt}>
        {[8, 22, 36].map((y) => (
          <rect key={y} x={9} y={y} width={4} height={2} fill={COLORS.gemGreen} />
        ))}
      </g>
    </svg>
  )
}

// A terminal on a carved stone pedestal (the shared terminal, in the island's colours).
const ENGINEER_PROPS: Record<LevelZone, ReactNode> = {
  record: PROP_POSITIONS.map((position) => (
    <Terminal key={position} position={position} body={COLORS.woodDark} screen={COLORS.gemGreen} stand={COLORS.ironLight} />
  )),
  work: PROP_POSITIONS.map((position) => <BambooRack key={position} position={position} />),
}

function EngineerLevel({ zone }: { zone: LevelZone }) {
  return (
    <>
      <Backdrop sky={COLORS.lagoon} />
      <FarIslands />
      <NearPalms />
      <Boardwalk />
      <CircuitTraces />
      {ENGINEER_PROPS[zone]}
      <Stumps />
      <MangoTrail />
      <Checkpoint />
    </>
  )
}

// ---- Musician: the beach stage, his kit, sound ----

const KIT: DrumKitColors = {
  stand: COLORS.ironLight,
  shell: COLORS.sea,
  rim: COLORS.sun,
  bass: COLORS.fruitGold,
  cymbalsTip: true,
}

// A tiki torch whose flame flares on the stick hits.
function TikiTorch({ place }: { place: string }) {
  return (
    <svg viewBox="0 0 16 60" className={`absolute bottom-3 h-16 w-5 sm:h-24 sm:w-7 ${place}`} aria-hidden="true" focusable="false">
      <rect x={6} y={20} width={4} height={40} fill={COLORS.woodMid} />
      <rect x={4} y={16} width={8} height={6} rx={1} fill={COLORS.wood} />
      <path d="M8 2 Q14 10 11 16 H5 Q2 10 8 2 Z" fill={COLORS.fruitGold} className={styles.flame} />
    </svg>
  )
}

function MusicianLevel() {
  return (
    <>
      <Backdrop sky={COLORS.fruitShine}>
        <circle cx={480} cy={58} r={26} fill={COLORS.sun} />
        <rect y={60} width={600} height={40} fill={COLORS.sea} />
        <path d="M0 66 H600" stroke={COLORS.seaLight} strokeWidth={1.5} strokeDasharray="20 16" />
        <rect y={82} width={600} height={18} fill={COLORS.sand} />
      </Backdrop>
      <svg viewBox="0 0 600 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
        <Palm x={40} sway={styles.sway} />
        <Palm x={560} sway={`${styles.sway} [--phase:0.5turn]`} />
        <rect x={150} y={8} width={6} height={92} fill={COLORS.sandLight} />
        <rect x={444} y={8} width={6} height={92} fill={COLORS.sandLight} />
        <path d="M140 10 Q300 -2 460 10 L460 18 Q300 6 140 18 Z" fill={COLORS.leafDark} />
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-3 border-t-4 border-[var(--tp-wood-dark)] bg-[var(--tp-wood-mid)]" aria-hidden="true" />
      <TikiTorch place="left-[18%]" />
      <TikiTorch place="right-[18%]" />
      <SoundWaves className="absolute bottom-3 right-3 h-12 w-14 sm:right-6 sm:h-16 sm:w-20" colors={[COLORS.hazard, COLORS.sea]} />
    </>
  )
}

function KitInFront() {
  return <DrumKit className="absolute bottom-1 left-8 h-14 w-20 sm:left-10 sm:h-20 sm:w-28" colors={KIT} />
}

// ---- Martial Artist: the jungle clearing ring, the pads, kicks, knees, elbows ----

function RingRopes({ width }: { width: number }) {
  return (
    <>
      <rect x={4} y={24} width={8} height={76} fill={COLORS.sandLight} />
      <rect x={width - 12} y={24} width={8} height={76} fill={COLORS.sandLight} />
      <line x1={8} y1={42} x2={width - 8} y2={42} stroke={COLORS.hazard} strokeWidth={2} />
      <line x1={8} y1={58} x2={width - 8} y2={58} stroke={COLORS.parchment} strokeWidth={2} />
      <line x1={8} y1={74} x2={width - 8} y2={74} stroke={COLORS.sea} strokeWidth={2} />
    </>
  )
}

function FighterLevel() {
  return (
    <>
      <Backdrop sky={COLORS.leafLight} />
      <FarIslands />
      <NearPalms />
      <svg viewBox="0 0 600 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
        <RingRopes width={600} />
        <g className={`${scene.lightAt} ${atClass(0.1)}`}>
          <path d="M8 6 Q14 14 11 22 H5 Q2 14 8 6 Z M592 6 Q598 14 595 22 H589 Q586 14 592 6 Z" fill={COLORS.fruitGold} />
        </g>
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-3 border-t-4 border-[var(--tp-leaf-dark)] bg-[var(--tp-sand)]" aria-hidden="true" />
      <PadHolder
        className="left-[calc(40%_+_4.5rem)] sm:left-[calc(40%_+_5.5rem)]"
        body={COLORS.leafDark}
        pads={COLORS.hazard}
      />
    </>
  )
}

function SunFlash() {
  return <StrikeFlash color={COLORS.sun} />
}

// ---- the contact corners: where each profession ends the page, behind the palm fronds ----

function EngineerCorner() {
  return (
    <DeskCorner
      hero={<HeroCharacter profession="engineer" className={scene.hero} />}
      colors={{
        panel: COLORS.woodDark,
        screens: [COLORS.gemGreen, COLORS.seaLight],
        desk: COLORS.wood,
        keyboard: COLORS.woodDark,
      }}
    />
  )
}

function MusicianCorner() {
  return <KitCorner hero={<HeroCharacter profession="drummer" className={scene.hero} />} kit={KIT} waves={[COLORS.hazard, COLORS.sea]} />
}

function RingCorner() {
  return (
    <div className={`absolute inset-0 ${scene.guard}`}>
      <svg viewBox="0 0 160 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
        {/* the ropes run on out of his corner, the far post beyond it */}
        <RingRopes width={320} />
      </svg>
      <div className="absolute bottom-1 left-1/3">
        <HeroCharacter profession="fighter" className={scene.hero} />
      </div>
    </div>
  )
}

export const PROFESSION_STAGES: Record<Profession, StageLook> = {
  engineer: {
    Level: EngineerLevel,
    pose: scene.stride,
    travel: styles.hop,
    Companion: null,
    Corner: EngineerCorner,
  },
  drummer: {
    Level: MusicianLevel,
    pose: scene.drum,
    travel: styles.onStage,
    Companion: KitInFront,
    Corner: MusicianCorner,
  },
  fighter: {
    Level: FighterLevel,
    pose: scene.strike,
    travel: styles.advance,
    Companion: SunFlash,
    Corner: RingCorner,
  },
}
