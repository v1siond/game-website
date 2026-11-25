'use client'

import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import { hop } from '@/lib/motion/arc'
import { elapsedOf, sceneEnd, type Playhead, type SceneScript } from '@/lib/scroll/player'
import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, focusOn, frames, fx, lerp, r1, transformTo } from '@/components/themes/shared/stageNodes'
import { Stage } from '@/components/themes/shared/theatre/Stage'
import type { LayerMotions, StageWriter, TheatreScene } from '@/components/themes/shared/theatre/useTheatre'
import { DUSK_ART, H, Mesh, W, ZONE_ART, type Zone } from './backdrop'
import { beatIn, hitsUpTo, lifeOf, type Action, type Beat, type RunBeat } from './fight'
import { KiBall, ScrubFighter, scrubWriter, type Rival } from './fighter'
import { CELL, type FighterPose, type Pt } from './poses'
import { FS } from './palette'
import {
  Calls,
  Credits,
  Hud,
  Ladder,
  MapHop,
  OpenSlot,
  SelectBoard,
  boardWriter,
  hopWriter,
  ladderWriter,
  screenWriter,
  type CallId,
  type Climb,
  type ScreenFrame,
  type Staff,
  type StagePin,
} from './run'
import look from './world.module.css'

// One credit of the arcade fighter as the page's scenes, in the cabinet's order (score/C62/fighter-select-concept.md,
// from research/2026-11-24-deep-sf2/notes.md): two strangers brawl in the street before the title, the select
// board picks him, he flies to the dojo of his own school, tours the towns whose place tells the rival at a
// glance, plays the scrap yard, climbs the ladder of the four masters to the leader whose emblem hung on every
// stage, and his ending sends him off. One HUD carries both life bars, the round clock and
// the orbs through the run (fight.ts lifeOf); no caption narrates a place or a count. Each scene is one to
// three actions played by the shared scene player at their own pace (src/lib/scroll/player.ts): forward on the
// way down, back on the way up; reduced motion and a settled stage hold the last frame.
//   Hero, the night street then his rooftop at dusk: brawl (the strangers trade a kick and a punch and the
//     frame freezes on the hit); pick (the board comes up, the cursor roams and stops on him, his slot
//     flashes); declare (the small map comes up and the first route lights).
//   About, stage 1, the dojo: fly (the plane to the dojo); clash (both throw the wave and the two burst to
//     nothing); throw (he steps through the smoke, grabs the school rival and tosses him across the floor).
//   Work, stage 2, the harbour town: block (the heavyweight's charge lands on his guard and costs a sliver);
//     vault (he jumps the next charge); stamp (he turns and kicks the heavyweight's back onto the crates).
//   Tech Stack, stage 3, the factory: fire (his wave, and the rival walks straight through it); wait (he holds
//     still, the rival's small steps go back and forth); chain (the rival commits; the jab cancels into the
//     rising strike).
//   Services, the scrap yard, the car park: kick (the door), smash (the bonnet, the roof, the glass), tally
//     (the clock stops with time left, and WRECKED).
//   Projects, the neon town: climb (the ladder of shadows, his marker to the first); sweep (under the boxer's
//     dash punch); dizzy (three heavy hits, the stars, a special and the special knockout's flash).
//   Ventures, the temple court: rise (past the second and third masters to the top, where the leader turns
//     round); endure (two dark rushes blocked, his bar drained to a sliver, the clock in single digits);
//     counter (the rising strike meets the third rush).
//   Bands, the drummer's last bout, the cage club: watch (the acrobat climbs the mesh above him); rise (the
//     dive met in the air); keep time (the acrobat falls and the band behind the mesh hits the next bar).
//   Muay Thai, the fighter's last bout, the river ring: read (high, low, high, ducked and hopped); clinch
//     (inside the reach, the neck taken); knee (two knees and the last, and the old champion goes down).
//   Contact, his ending on the rooftop at sunrise: leave (the ceremony set, his rival by the trophy, his own
//     spot empty, him already walking off and the rival raising a hand); roll (the credits rise); wait (the 2P
//     side lights, the coin slot and the clock).

export type SceneId = 'hero' | SectionId | 'contact'

/** The stage pushes in across its scene, the fighters a little more than the stage behind them. */
export const TOUR_MOTION: LayerMotions = {
  sky: { zoom: [1.0, 1.05], lift: [0, -1] },
  figure: { zoom: [1.03, 1.1], lift: [0, -2] },
}

// The floor line their feet stand on, and their size on the canvas.
const FLOOR = 860
const SIZE = 2
// He stands at HERO_X; the rival faces him GAP further on: in the clinch for knees, close for blows, at range
// for waves and dives.
const HERO_X = 900
const GAP = { clinch: 70, close: 110, mid: 220, range: 330 } as const
// A hurt rival rocks back KNOCK at the height of the hit.
const KNOCK = 22
// The fight camera: like the arcade's, it follows the pair, so both stand whole however far a throw, a charge or
// a rush takes them. It keeps their middle at the centre of the part of the canvas the screen shows beside the
// cards: x 1170 of the band right of them on a wide screen, and on a phone, under the troupe's shrink
// (world.module.css, the same 1023.98 px breakpoint), x 1150, the middle of the window x 803 to 1497.
const FOLLOW = { wide: 1170, narrow: 1150, query: '(max-width: 1023.98px)' } as const

// Points of a fighter's own 160 by 170 cell: the hands where a wave leaves, the chest where it lands, the
// middle of the body the cell's mirror turns about.
const HAND: Pt = [116, 72]
const CHEST: Pt = [70, 80]
const BODY = 62

/** Where on the canvas a point of a fighter's cell is: his own, or the rival's mirrored one. */
const heroAt = (x: number, [cx, cy]: Pt, size = SIZE): Pt => [x + cx * size, FLOOR - (CELL.ground - cy) * size]
const rivalAt = (x: number, [cx, cy]: Pt, size = SIZE): Pt => [x + (CELL.width - cx) * size, FLOOR - (CELL.ground - cy) * size]

/** A fighter's cell at x, lifted off the floor, `size` times the cell: a bigger one still stands on the floor. */
const standAt = (x: number, lift = 0, size = SIZE): string => `translate(${r1(x)} ${r1(FLOOR - CELL.ground * size - lift)}) scale(${size})`
/** The same cell turned to face left, his body kept where it stood. */
const MIRROR = ` translate(${CELL.width} 0) scale(-1 1)`
const turnedAt = (x: number, lift: number, size: number): string => standAt(x - (CELL.width - 2 * BODY) * size, lift, size) + MIRROR

/** Where the round is: the action, how far through it, its beat and how far through that, the hits landed. */
interface Moment {
  play: Playhead
  beat: Beat
  index: number
  t: number
  hits: number
}

/** How a scene moves the pair off their places this moment. */
interface Steps {
  hero: number
  heroLift: number
  rival: number
  lift: number
  /** He has turned to face left. */
  turn: boolean
  /** His size on the canvas: smaller as he walks off into the distance. */
  heroSize: number
  /** How solid the rival is drawn: less while he walks through a wave untouched. */
  solid: number
  /** His lift is the distance he has walked into, not a jump: his shadow stays at his feet. */
  far: boolean
}

const STILL: Steps = { hero: 0, heroLift: 0, rival: 0, lift: 0, turn: false, heroSize: SIZE, solid: 1, far: false }

/** What opens a scene before its fight: the plane's hop on the map, or the ladder's climb. */
type Intro = { kind: 'hop'; from: StagePin; to: StagePin } | { kind: 'ladder'; climb: Climb }

interface SceneSpec {
  /** Its beat in the run: picked, a fight, the scrap yard or the ending. */
  beat: RunBeat
  zone: Zone
  /** Who stands in his place: the attract demo's stranger; him when left out. */
  stand?: Rival
  /** The rival faced; the scrap yard has none. */
  rival?: Rival
  /** The rival's size on the canvas (SIZE when left out): the big ones stand taller. */
  rivalSize?: number
  /** The rival faces the way he does, watching him go, instead of facing him. */
  rivalAlong?: boolean
  gap: number
  intro?: Intro
  /** The fight's actions, after the intro. */
  actions: readonly Action[]
  /** The round clock across the fight, from and to. */
  clock?: readonly [number, number]
  /** The masters already beaten when this fight starts, crossed on the HUD. */
  masters?: number
  calls?: readonly CallId[]
  callAt?: (m: Moment) => Partial<Record<CallId, number>>
  steps?: (m: Moment) => Partial<Steps>
  /** How far the camera pushes in on the pair. */
  zoom?: (m: Moment) => number
  /** Drawn behind the fighters, and in front of them. */
  props?: () => ReactNode
  front?: () => ReactNode
  write?: (stage: HTMLElement) => (m: Moment, x: { hero: number; rival: number }) => void
  /** The scene's own part of the screen frame: the ending's credits and slot. */
  frame?: (m: Moment) => Partial<ScreenFrame>
}

// The intro's own action: the hop's flight and zoom, the ladder's climb. Both fighters wait in their stance.
const INTRO: Action = { ms: 1200, beats: [{ hero: 'stance', partner: 'stance' }] }

const scriptOf = (spec: SceneSpec): SceneScript => [...(spec.intro ? [INTRO] : []), ...spec.actions].map((action) => action.ms)

const posesOf = (actions: readonly Action[], who: 'hero' | 'partner'): FighterPose[] =>
  Array.from(new Set(['stance' as const, ...actions.flatMap((action) => action.beats.map((beat) => beat[who]))]))

/** Which action of the round, and how far through, as a share of `i`: 0 before it, 1 once it is done. */
const shareOf = ({ action, t }: Playhead, i: number): number => (action > i ? 1 : action === i ? t : 0)

/** The beat's share in the action `i` when the round is in it, else 0 or 1. */
const inAction = (m: Moment, i: number, index?: number): number => {
  if (m.play.action !== i) return m.play.action > i ? 1 : 0
  if (index === undefined) return m.play.t
  return m.index > index ? 1 : m.index === index ? m.t : 0
}

// ---- the moving pieces a scene's writer places ----

/** The energy wave, flying right, or left when `flip`. */
function Wave({ name, flip = false }: { name: string; flip?: boolean }) {
  return (
    <g data-fx={name} opacity="0">
      <g transform={`${flip ? 'scale(-1 1) ' : ''}scale(${SIZE}) translate(${-HAND[0]} ${-HAND[1]})`}>
        <KiBall kind="ki" className="" />
      </g>
    </g>
  )
}

/** The burst where a blow or a wave lands, `fill` its outer glow. */
function Burst({ name, fill = FS.cyan }: { name: string; fill?: string }) {
  return (
    <g data-fx={name} opacity="0">
      <circle r={58} fill={fill} opacity={0.45} />
      <circle r={34} fill={FS.flash} opacity={0.85} />
      <path d="M0 -70 L8 -14 L64 -24 L16 4 L52 52 L0 18 L-46 56 L-16 4 L-66 -20 L-8 -14 Z" fill={FS.flash} opacity={0.7} />
    </g>
  )
}

/** The smoke a burst leaves hanging. */
function Smoke({ name }: { name: string }) {
  return (
    <g data-fx={name} opacity="0">
      {[[-60, 10, 54], [0, -20, 66], [60, 6, 50], [20, 40, 44], [-30, 46, 40]].map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#d8dce8" opacity={0.55} />
      ))}
    </g>
  )
}

/** Puts a named node at (x, y), `scale` times its size, `opacity` shown. */
function placer(stage: HTMLElement, name: string): (x: number, y: number, opacity: number, scale?: number) => void {
  const node = fx(stage, name)
  return (x, y, opacity, scale = 1) => {
    transformTo(node, `translate(${r1(x)} ${r1(y)})${scale === 1 ? '' : ` scale(${scale.toFixed(3)})`}`)
    fadeTo(node, opacity)
  }
}

/** A screen wide flash, a knockout's or a hit stop's. */
const Screen = ({ name, fill }: { name: string; fill: string }) => <rect data-fx={name} x={-W} y={-H} width={W * 3} height={H * 3} fill={fill} opacity="0" />

/** A wave's flight over a beat: it leaves the hand at `from`, lands at `to`. */
const WAVE = { from: 0.3, to: 0.62 } as const

// ---- the scrap yard's car: whole, then the door off, the bonnet in, the roof flat ----

const CAR = { x: HERO_X + 200, w: 440 }
const WRECKS = ['whole', 'door', 'bonnet', 'roof'] as const
type Wreck = (typeof WRECKS)[number]

function CarBody({ wreck }: { wreck: Wreck }) {
  const { x, w } = CAR
  const bonnetIn = wreck === 'bonnet' || wreck === 'roof'
  const cabinTop = wreck === 'roof' ? 744 : 690
  return (
    <g data-frame={wreck} visibility={wreck === 'whole' ? undefined : 'hidden'}>
      <path
        d={`M${x} 840 V${bonnetIn ? 790 : 770} Q${x + 60} ${bonnetIn ? 800 : 758} ${x + 90} 760 H${x + w - 20} Q${x + w} 762 ${x + w} 790 V840 Z`}
        fill={FS.ko}
        stroke={FS.ink}
        strokeWidth={6}
        strokeLinejoin="round"
      />
      <path d={`M${x + 100} 760 L${x + 140} ${cabinTop} H${x + 330} L${x + 380} 760 Z`} fill={FS.p2Dark} stroke={FS.ink} strokeWidth={6} strokeLinejoin="round" />
      {wreck !== 'roof' && <path d={`M${x + 150} 752 L${x + 172} 702 H${x + 236} V752 Z M${x + 248} 752 V702 H${x + 322} L${x + 362} 752 Z`} fill={FS.cyan} opacity={0.75} />}
      {wreck === 'whole' ? (
        <rect x={x + 190} y={768} width={120} height={62} fill={FS.ko} stroke={FS.ink} strokeWidth={4} />
      ) : (
        <rect x={x + 190} y={768} width={120} height={62} fill={FS.ink} />
      )}
      {wreck !== 'whole' && <path d={`M${x + 20} 800 l30 -12 l18 20 l-24 14 Z`} fill={FS.p2Dark} stroke={FS.ink} strokeWidth={3} />}
      {[x + 70, x + w - 70].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={840} r={36} fill={FS.ink} />
          <circle cx={cx} cy={840} r={14} fill={FS.chrome} />
        </g>
      ))}
    </g>
  )
}

function Car() {
  const { x } = CAR
  return (
    <>
      <g data-fx="car">
        {WRECKS.map((wreck) => (
          <CarBody key={wreck} wreck={wreck} />
        ))}
      </g>
      <g data-fx="car-door" opacity="0">
        <rect x={-60} y={-31} width={120} height={62} fill={FS.ko} stroke={FS.ink} strokeWidth={4} />
      </g>
      <g data-fx="car-glass" opacity="0" transform={`translate(${x + 230} 700)`}>
        {[-90, -40, 10, 60, 100].map((dx, i) => (
          <path key={dx} d={`M${dx} ${-20 * (i % 2)} l10 -16 l10 16 l-10 16 Z`} fill={FS.cyan} stroke={FS.ink} strokeWidth={2} />
        ))}
      </g>
    </>
  )
}

// ---- the other props: the quay's crates, the leader's dark power, the band, the ceremony ----

function Crates() {
  return (
    <>
      {[[760, 740, 130], [880, 760, 110], [800, 650, 100]].map(([x, y, s]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width={s} height={s} fill="#a8743e" stroke={FS.ink} strokeWidth={5} />
          <path d={`M${x} ${y} L${x + s} ${y + s} M${x + s} ${y} L${x} ${y + s}`} stroke="#7a5228" strokeWidth={6} />
        </g>
      ))}
    </>
  )
}

/** The dark power the leader rushes in, round his whole body. */
function Aura() {
  return (
    <g data-fx="aura" opacity="0">
      <ellipse rx={150} ry={230} fill={FS.power} opacity={0.4} />
      <ellipse rx={110} ry={200} fill={FS.powerDeep} opacity={0.5} />
      {[-120, -60, 0, 60, 120].map((dx, i) => (
        <path key={dx} d={`M${dx} ${180 - (i % 2) * 40} Q${dx + 30} 0 ${dx} ${-200 + (i % 2) * 30}`} fill="none" stroke={FS.power} strokeWidth={8} opacity={0.7} />
      ))}
    </g>
  )
}

/** The band on the riser behind the mesh: the drummer at his kit, the guitarist; their hits are written. */
function Band() {
  return (
    <g>
      <g transform="translate(1200 470)">
        <ellipse cx={-70} cy={-40} rx={46} ry={10} fill={FS.gold} stroke={FS.ink} strokeWidth={3} data-fx="band-cymbal" />
        <rect x={-50} y={-30} width={100} height={30} fill={FS.p2Dark} stroke={FS.ink} strokeWidth={4} />
        <circle cx={0} cy={-90} r={16} fill="#b9774c" stroke={FS.ink} strokeWidth={3} />
        <path d="M-22 -72 Q0 -80 22 -72 L18 -30 H-18 Z" fill="#2a2a36" stroke={FS.ink} strokeWidth={3} />
        <path data-fx="band-stick" d="M14 -64 L50 -86" stroke={FS.gold} strokeWidth={5} strokeLinecap="round" />
      </g>
      <g transform="translate(1420 470)">
        <circle cx={0} cy={-120} r={15} fill="#e9b08a" stroke={FS.ink} strokeWidth={3} />
        <path d="M-20 -104 Q0 -110 20 -104 L18 -40 H-18 Z" fill={FS.p1} stroke={FS.ink} strokeWidth={3} />
        <path d="M-40 -60 L30 -84" stroke="#5a3020" strokeWidth={8} strokeLinecap="round" />
        <ellipse cx={-30} cy={-62} rx={22} ry={14} fill={FS.orange} stroke={FS.ink} strokeWidth={3} />
      </g>
      <g data-fx="band-hit" opacity="0">
        {[0, 1, 2, 3].map((k) => (
          <path key={k} d={`M${1130 - k * 6} ${400 - k * 16} l-40 -${10 + k * 6}`} stroke={FS.flash} strokeWidth={5} strokeLinecap="round" />
        ))}
        <circle cx={1130} cy={430} r={60} fill={FS.gold} opacity={0.25} />
      </g>
    </g>
  )
}

// The ceremony: the trophy on its stand, and his own spot on the podium left empty.
const TROPHY_X = 1150
const SPOT_X = 1290

function Ceremony() {
  return (
    <g>
      <rect x={TROPHY_X - 50} y={760} width={100} height={100} fill="#5a2a3a" stroke={FS.ink} strokeWidth={5} />
      <path d={`M${TROPHY_X - 44} 680 H${TROPHY_X + 44} Q${TROPHY_X + 40} 740 ${TROPHY_X} 744 Q${TROPHY_X - 40} 740 ${TROPHY_X - 44} 680 Z`} fill={FS.gold} stroke={FS.ink} strokeWidth={5} />
      <path d={`M${TROPHY_X - 44} 694 Q${TROPHY_X - 74} 700 ${TROPHY_X - 52} 724 M${TROPHY_X + 44} 694 Q${TROPHY_X + 74} 700 ${TROPHY_X + 52} 724`} fill="none" stroke={FS.gold} strokeWidth={8} />
      <rect x={TROPHY_X - 16} y={744} width={32} height={16} fill={FS.gold} stroke={FS.ink} strokeWidth={4} />
      <rect x={SPOT_X - 70} y={800} width={140} height={60} fill="#e0c89a" stroke={FS.ink} strokeWidth={5} />
      <text x={SPOT_X} y={846} textAnchor="middle" fontSize={40} fill={FS.p2Dark} className={look.face}>
        1
      </text>
    </g>
  )
}

// ---- the run's scenes ----

/** A call's share across a beat: in at its start, held to its end. */
const callIn = (t: number): number => ramp(t, 0, 0.3)

/** The knockout call from the beat marked ko on, held to the end. */
const koFrom =
  (action: number, index: number) =>
  (m: Moment): Partial<Record<CallId, number>> =>
    inAction(m, action, index) > 0 ? { ko: m.play.action > action || m.index > index ? 1 : ramp(m.t, 0.3, 0.6) } : {}

/** The knockout's flash over the beat marked ko. */
const koFlash = (stage: HTMLElement) => {
  const flash = fx(stage, 'koFlash')
  return ({ beat, t }: Moment) => fadeTo(flash, beat.mark === 'ko' ? 0.6 * bell(t, 0.35, 1) : 0)
}

// The street demo's freeze: the kick held at full stretch, the punch caught on the face.
const HIT_STOP: readonly [number, number] = [0.6, 0.1]

const hero: SceneSpec = {
  beat: 'select',
  zone: 'street',
  stand: 'strangerA',
  rival: 'strangerB',
  gap: GAP.close,
  actions: [
    {
      ms: 1500,
      beats: [
        { hero: 'walk', partner: 'walk', share: 0.7 },
        { hero: 'punch', partner: 'roundhouse', share: 0.7 },
        { hero: 'hurt', partner: 'roundhouse', mark: 'hit', hold: HIT_STOP, share: 1.1 },
      ],
    },
    { ms: 1600, beats: [{ hero: 'hurt', partner: 'roundhouse', hold: HIT_STOP }] },
    { ms: 1600, beats: [{ hero: 'hurt', partner: 'roundhouse', hold: HIT_STOP }] },
  ],
  steps: ({ play, index, t }) => (play.action === 0 && index === 0 ? { hero: -90 * (1 - t), rival: 90 * (1 - t) } : {}),
  props: () => <Burst name="impact" fill={FS.gold} />,
  front: () => <Screen name="stopFlash" fill={FS.flash} />,
  write: (stage) => {
    const impact = placer(stage, 'impact')
    const flash = fx(stage, 'stopFlash')
    const camera = fx(stage, 'camera')
    const dusk = fx(stage, 'dusk')
    const board = boardWriter(stage)
    return (m, x) => {
      const stop = m.play.action === 0 && m.index === 2 ? m.t : m.play.action > 0 ? 1 : 0
      const [hx, hy] = heroAt(x.hero, [70, 52])
      impact(hx, hy, m.play.action === 0 && m.index === 2 ? 1 - ramp(m.t, 0.7, 1) : 0, 0.7)
      fadeTo(flash, 0.35 * bell(stop, 0, 0.25))
      const pick = shareOf(m.play, 1)
      fadeTo(camera, 1 - ramp(pick, 0, 0.25))
      fadeTo(dusk, ramp(pick, 0, 0.3))
      board(pick, shareOf(m.play, 2))
    }
  },
}

// The clash: both waves leave together and meet halfway, where they burst to nothing and leave smoke.
const about: SceneSpec = {
  beat: 'fight',
  zone: 'dojo',
  rival: 'school',
  gap: GAP.range,
  intro: { kind: 'hop', from: 'home', to: 'dojo' },
  clock: [99, 84],
  actions: [
    { ms: 1700, beats: [{ hero: 'fireball', partner: 'fireball' }] },
    {
      ms: 1900,
      beats: [
        { hero: 'walk', partner: 'stance', share: 0.8 },
        { hero: 'throw', partner: 'juggle', mark: 'ko', share: 1.1 },
        { hero: 'stance', partner: 'down', share: 1.1 },
      ],
    },
  ],
  steps: (m) => {
    if (m.play.action !== 1) return {}
    const close = { hero: 200 * (m.index === 0 ? m.t : 1) }
    if (m.index === 1) return { ...close, rival: -60 + 220 * ramp(m.t, 0.4, 1), lift: hop(ramp(m.t, 0.4, 1), 170) }
    if (m.index === 2) return { ...close, rival: 160 }
    return close
  },
  calls: ['round'],
  callAt: ({ play, t }) => (play.action === 0 ? { round: callIn(t) * (1 - ramp(t, 0.5, 0.7)) } : {}),
  props: () => (
    <>
      <Wave name="wave" />
      <Wave name="wave-2" flip />
      <Burst name="burst" />
      <Smoke name="smoke" />
    </>
  ),
  write: (stage) => {
    const wave = placer(stage, 'wave')
    const counter = placer(stage, 'wave-2')
    const burst = placer(stage, 'burst')
    const smoke = placer(stage, 'smoke')
    return (m, x) => {
      const [fromX, y] = heroAt(x.hero, HAND)
      const [rivalHand] = rivalAt(x.rival, HAND)
      const mid = (fromX + rivalHand) / 2
      const clash = m.play.action === 0 ? m.t : 1
      const flight = ramp(clash, WAVE.from, WAVE.to)
      const flying = flight > 0 && flight < 1 ? 1 : 0
      wave(lerp(fromX, mid, flight), y, flying)
      counter(lerp(rivalHand, mid, flight), y, flying)
      burst(mid, y, ramp(clash, 0.58, 0.64) * (1 - ramp(clash, 0.8, 1)), 0.6 + 0.6 * ramp(clash, 0.6, 1))
      const linger = m.play.action === 0 ? ramp(m.t, 0.7, 1) : 1 - inAction(m, 1, 0)
      smoke(mid, y + 20, 0.9 * linger)
    }
  },
}

// The heavyweight's charge: in from the right, again after a step back, and under his jump to the far side.
const CHARGE = 520
const PASS = -170

const work: SceneSpec = {
  beat: 'fight',
  zone: 'harbour',
  rival: 'heavy',
  rivalSize: 2.4,
  gap: GAP.close,
  clock: [99, 81],
  actions: [
    { ms: 1500, beats: [{ hero: 'guard', partner: 'walk', share: 1.2 }, { hero: 'guard', partner: 'strong', chip: 0.12 }] },
    { ms: 1700, beats: [{ hero: 'stance', partner: 'walkBack', share: 0.7 }, { hero: 'jump', partner: 'walk', share: 1.3 }] },
    { ms: 1600, beats: [{ hero: 'roundhouse', partner: 'hurt', mark: 'ko' }, { hero: 'stance', partner: 'down', share: 1.2 }] },
  ],
  steps: ({ play, index, t }) => {
    if (play.action === 0) return index === 0 ? { rival: CHARGE * (1 - t) } : { hero: -40 * t }
    if (play.action === 1 && index === 0) return { hero: -40, rival: 320 * t }
    if (play.action === 1) return { hero: lerp(-40, 220, t), heroLift: hop(t, 300), rival: lerp(320, PASS, t) }
    return { hero: 220, turn: true, rival: PASS - (index === 1 ? 50 * ramp(t, 0, 0.5) : 0) }
  },
  calls: ['ko'],
  callAt: koFrom(2, 0),
  props: () => (
    <>
      <Crates />
      <Burst name="guard-spark" fill={FS.cyan} />
    </>
  ),
  front: () => <Screen name="koFlash" fill={FS.flash} />,
  write: (stage) => {
    const spark = placer(stage, 'guard-spark')
    const flash = koFlash(stage)
    return (m, x) => {
      const [sx, sy] = heroAt(x.hero, [92, 62])
      spark(sx, sy, m.play.action === 0 && m.index === 1 ? 1 - ramp(m.t, 0.5, 1) : 0, 0.5)
      flash(m)
    }
  },
}

// The reader walks straight through his wave: drawn faint while the wave passes over him.
const tech: SceneSpec = {
  beat: 'fight',
  zone: 'factory',
  rival: 'reader',
  gap: GAP.range,
  clock: [99, 77],
  actions: [
    { ms: 1700, beats: [{ hero: 'fireball', partner: 'walk' }] },
    {
      ms: 1500,
      beats: [
        { hero: 'stance', partner: 'walkBack' },
        { hero: 'stance', partner: 'walk' },
        { hero: 'stance', partner: 'walkBack' },
        { hero: 'stance', partner: 'walk' },
      ],
    },
    {
      ms: 1800,
      beats: [
        { hero: 'stance', partner: 'punch', share: 0.6 },
        { hero: 'punch', partner: 'hurt', mark: 'hit', share: 0.8 },
        { hero: 'uppercut', partner: 'juggle', mark: 'hit' },
        { hero: 'uppercut', partner: 'juggle', mark: 'ko', hold: [0.85, 0.5], share: 0.5 },
        { hero: 'stance', partner: 'down', share: 1.1 },
      ],
    },
  ],
  steps: ({ play, index, t }) => {
    if (play.action === 0) return { rival: -200 * t, solid: 1 - 0.7 * bell(t, 0.35, 0.7) }
    if (play.action === 1) return { rival: -200 + (index % 2 ? -30 * (1 - t) : -30 * t) }
    if (index === 2) return { rival: -200, lift: hop(t / 2, 200) }
    if (index === 3) return { rival: -200 + 60 * t, lift: hop(0.5 + t / 2, 200) }
    if (index === 4) return { rival: -140 }
    return { rival: -200 }
  },
  calls: ['ko'],
  callAt: koFrom(2, 3),
  props: () => <Wave name="wave" />,
  front: () => <Screen name="koFlash" fill={FS.flash} />,
  write: (stage) => {
    const wave = placer(stage, 'wave')
    const flash = koFlash(stage)
    return (m, x) => {
      const [fromX, y] = heroAt(x.hero, HAND)
      const flight = m.play.action === 0 ? ramp(m.t, 0.25, 0.85) : 1
      wave(lerp(fromX, fromX + 900, flight), y, flight > 0 && flight < 1 ? 1 : 0)
      flash(m)
    }
  },
}

// The scrap yard's clock runs from 50 while he wrecks the car and stops with time to spare.
const CLOCK = { from: 50, used: 32 }

const services: SceneSpec = {
  beat: 'bonus',
  zone: 'lot',
  gap: GAP.close,
  actions: [
    { ms: 1500, beats: [{ hero: 'walk', partner: 'stance', share: 0.8 }, { hero: 'roundhouse', partner: 'stance', mark: 'hit' }, { hero: 'stance', partner: 'stance', share: 0.6 }] },
    { ms: 1700, beats: [{ hero: 'strong', partner: 'stance', mark: 'hit' }, { hero: 'jump', partner: 'stance', mark: 'hit', share: 1.4 }, { hero: 'stance', partner: 'stance', share: 0.6 }] },
    { ms: 1300, beats: [{ hero: 'win', partner: 'stance' }] },
  ],
  steps: ({ play, index, t }) => {
    if (play.action === 0 && index === 0) return { hero: -160 * (1 - t) }
    if (play.action === 1 && index === 1) return { hero: 60 * Math.sin(Math.PI * t), heroLift: hop(t, 170) }
    return {}
  },
  calls: ['bonus', 'wrecked'],
  callAt: ({ play, t }) => {
    if (play.action === 0) return { bonus: callIn(t) * (1 - ramp(t, 0.35, 0.55)) }
    return play.action === 2 ? { wrecked: callIn(t) } : {}
  },
  props: () => <Car />,
  write: (stage) => {
    const show = frames(fx(stage, 'car'), 'whole')
    const door = fx(stage, 'car-door')
    const glass = fx(stage, 'car-glass')
    return ({ play, hits, index, t }) => {
      show(WRECKS[Math.min(hits, WRECKS.length - 1)])
      // the door flies off the kick, end over end, out past the car
      const flight = play.action === 0 && index === 2 ? t : play.action === 0 && index < 2 ? 0 : 1
      transformTo(door, `translate(${r1(CAR.x + 250 + 420 * flight)} ${r1(800 - hop(flight, 260))}) rotate(${r1(540 * flight)})`)
      fadeTo(door, flight > 0 && flight < 1 ? 1 : 0)
      const burst = play.action === 1 && index === 2 ? t : 0
      transformTo(glass, `translate(${CAR.x + 230} ${r1(700 - 80 * burst)}) scale(${(1 + burst).toFixed(3)})`)
      fadeTo(glass, burst > 0 ? 1 - burst : 0)
    }
  },
}

// The boxer: fists only, so he dashes in over the sweep and has nothing below the waist to stop it.
const projects: SceneSpec = {
  beat: 'fight',
  zone: 'neon',
  rival: 'boxer',
  rivalSize: 2.2,
  gap: GAP.close + 30,
  intro: { kind: 'ladder', climb: { from: -1, to: 0 } },
  masters: 0,
  clock: [99, 73],
  actions: [
    { ms: 1600, beats: [{ hero: 'stance', partner: 'walk', share: 0.8 }, { hero: 'sweep', partner: 'strong', mark: 'hit' }, { hero: 'crouch', partner: 'hurt' }] },
    {
      ms: 2200,
      beats: [
        { hero: 'strong', partner: 'hurt', mark: 'hit' },
        { hero: 'roundhouse', partner: 'hurt', mark: 'hit' },
        { hero: 'strong', partner: 'hurt', mark: 'hit' },
        { hero: 'stance', partner: 'dizzy', share: 1.1 },
        { hero: 'fireball', partner: 'dizzy', share: 1.1 },
        { hero: 'stance', partner: 'down', mark: 'ko', share: 1.2 },
      ],
    },
  ],
  steps: ({ play, index, t }) => {
    if (play.action === 0 && index === 0) return { rival: 200 * (1 - t) }
    if (play.action === 0 && index === 2) return { rival: 30 * t, lift: hop(t, 60) }
    if (play.action === 0) return {}
    if (index === 5) return { rival: 30 + 80 * ramp(t, 0, 0.5) }
    return { rival: 30 }
  },
  calls: ['ko'],
  callAt: koFrom(1, 5),
  props: () => (
    <>
      <Wave name="wave" />
      <Burst name="burst" fill={FS.gold} />
    </>
  ),
  front: () => (
    <>
      <Screen name="koFlash" fill={FS.flash} />
      <g data-fx="special" opacity="0">
        {Array.from({ length: 12 }, (_, k) => (
          <path key={k} d="M0 -120 L14 -700 L-14 -700 Z" fill={FS.gold} transform={`rotate(${k * 30})`} />
        ))}
      </g>
    </>
  ),
  write: (stage) => {
    const wave = placer(stage, 'wave')
    const burst = placer(stage, 'burst')
    const special = placer(stage, 'special')
    const flash = koFlash(stage)
    return (m, x) => {
      const [fromX, y] = heroAt(x.hero, HAND)
      const [toX] = rivalAt(x.rival, CHEST, 2.2)
      const throwing = m.play.action === 1 && m.index === 4
      const flight = throwing ? ramp(m.t, WAVE.from, 0.9) : 0
      wave(lerp(fromX, toX, flight), y, flight > 0 && flight < 1 ? 1 : 0)
      const ko = m.play.action === 1 && m.index === 5 ? m.t : 0
      burst(toX, y, 1 - ramp(ko, 0.2, 0.6), 0.6 + ko)
      special(toX, y, 0.7 * bell(ko, 0, 0.7), 0.5 + ko)
      flash(m)
    }
  },
}

// The leader's dark rush: from his far mark into his guard, back, and again. The fight camera follows the pair,
// so RUSH is short enough that both stand in the band beside the cards at its far end.
const RUSH = 150

const ventures: SceneSpec = {
  beat: 'fight',
  zone: 'court',
  rival: 'leader',
  rivalSize: 2.3,
  gap: GAP.mid,
  intro: { kind: 'ladder', climb: { from: 0, to: 3 } },
  masters: 3,
  clock: [12, 3],
  actions: [
    {
      ms: 2000,
      beats: [
        { hero: 'guard', partner: 'walk', chip: 0.42 },
        { hero: 'guard', partner: 'walkBack', share: 0.6 },
        { hero: 'guard', partner: 'walk', chip: 0.42 },
        { hero: 'stance', partner: 'walkBack', share: 0.6 },
      ],
    },
    { ms: 1800, beats: [{ hero: 'stance', partner: 'walk', share: 0.9 }, { hero: 'uppercut', partner: 'juggle', mark: 'ko' }, { hero: 'stance', partner: 'down', share: 1.2 }] },
  ],
  steps: ({ play, index, t }) => {
    const rush = (share: number) => RUSH * (1 - share) - 70 * share
    if (play.action === 0) return { rival: index % 2 ? lerp(-70, RUSH, t) : rush(t), hero: -24 * (index % 2 ? 1 : t) - (index > 1 ? 24 : 0) }
    if (index === 0) return { rival: rush(t) + 70 * t, hero: -48 }
    if (index === 1) return { rival: 40 * t, lift: hop(t, 220), hero: lerp(-48, 60, t) }
    return { rival: 40 + 10 * ramp(t, 0, 0.5), hero: 60 }
  },
  calls: ['ko'],
  callAt: koFrom(1, 1),
  props: () => <Aura />,
  front: () => <Screen name="koFlash" fill={FS.flash} />,
  write: (stage) => {
    const aura = placer(stage, 'aura')
    const flash = koFlash(stage)
    return (m, x) => {
      const [ax, ay] = rivalAt(x.rival, [70, 100], 2.3)
      const rushing = m.beat.partner === 'walk' ? bell(m.t, 0, 1) * 0.6 + 0.4 : m.beat.partner === 'walkBack' ? 0.3 : 0
      aura(ax, ay, m.play.action === 0 || (m.play.action === 1 && m.index === 0) ? rushing : 0)
      flash(m)
    }
  },
}

// The acrobat climbs the mesh high over him and dives from it.
const PERCH = 320

const bands: SceneSpec = {
  beat: 'fight',
  zone: 'cage',
  rival: 'acrobat',
  gap: GAP.mid,
  clock: [99, 80],
  actions: [
    { ms: 1600, beats: [{ hero: 'stance', partner: 'climb' }] },
    { ms: 1600, beats: [{ hero: 'stance', partner: 'jump', share: 0.7 }, { hero: 'uppercut', partner: 'juggle', mark: 'ko' }] },
    { ms: 1700, beats: [{ hero: 'stance', partner: 'down' }, { hero: 'win', partner: 'down' }] },
  ],
  steps: ({ play, index, t }) => {
    if (play.action === 0) return { rival: 60 * t, lift: PERCH * t }
    if (play.action === 1 && index === 0) return { rival: lerp(60, -70, t), lift: lerp(PERCH, 170, t) }
    if (play.action === 1) return { rival: lerp(-70, 20, t), lift: 170 + hop(t, 80) }
    if (index === 0) return { rival: lerp(20, 60, t), lift: 170 * (1 - ramp(t, 0, 0.7)) }
    return { rival: 60 }
  },
  calls: ['ko'],
  callAt: koFrom(1, 1),
  props: () => (
    <>
      <Band />
      <Mesh />
    </>
  ),
  front: () => <Screen name="koFlash" fill={FS.flash} />,
  write: (stage) => {
    const hit = fx(stage, 'band-hit')
    const stick = fx(stage, 'band-stick')
    const cymbal = fx(stage, 'band-cymbal')
    const flash = koFlash(stage)
    return (m) => {
      const bar = m.play.action === 2 && m.index === 1 ? m.t : 0
      const strike = bell(bar, 0.1, 0.6)
      fadeTo(hit, strike)
      transformTo(stick, `rotate(${r1(40 * strike)} 14 -64)`)
      transformTo(cymbal, `rotate(${r1(-14 * strike)} -70 -40)`)
      flash(m)
    }
  },
}

// The old champion's reach: high, low and high again, ducked, hopped and ducked as he steps inside.
const muayThai: SceneSpec = {
  beat: 'fight',
  zone: 'river',
  rival: 'champion',
  rivalSize: 2.5,
  gap: GAP.mid,
  clock: [99, 79],
  actions: [
    { ms: 1800, beats: [{ hero: 'crouch', partner: 'strong' }, { hero: 'jump', partner: 'roundhouse' }, { hero: 'crouch', partner: 'strong' }] },
    { ms: 1400, beats: [{ hero: 'walk', partner: 'stance' }, { hero: 'knee', partner: 'hurt', hold: [0.05, 0.1] }] },
    {
      ms: 1800,
      beats: [
        { hero: 'knee', partner: 'hurt', mark: 'hit' },
        { hero: 'knee', partner: 'hurt', mark: 'hit' },
        { hero: 'knee', partner: 'hurt', mark: 'ko' },
        { hero: 'stance', partner: 'down', share: 1.2 },
      ],
    },
  ],
  steps: ({ play, index, t }) => {
    if (play.action === 0) return { hero: 30 * (index + t), heroLift: index === 1 ? hop(t, 110) : 0 }
    if (play.action === 1) return { hero: index === 0 ? lerp(90, 140, t) : 140, rival: index === 0 ? -50 * t : -50 }
    if (index === 3) return { hero: 140, rival: -50 + 130 * ramp(t, 0, 0.6) }
    return { hero: 140, rival: -50 }
  },
  calls: ['ko'],
  callAt: koFrom(2, 2),
  front: () => <Screen name="koFlash" fill={FS.flash} />,
  write: (stage) => koFlash(stage),
}

const contact: SceneSpec = {
  beat: 'ending',
  zone: 'dawn',
  rival: 'school',
  rivalAlong: true,
  gap: -180,
  actions: [
    { ms: 1800, beats: [{ hero: 'walk', partner: 'stance' }, { hero: 'walk', partner: 'win' }] },
    { ms: 1600, beats: [{ hero: 'stance', partner: 'win' }] },
    { ms: 1500, beats: [{ hero: 'stance', partner: 'win' }] },
  ],
  steps: ({ play, index, t }) => {
    const away = play.action === 0 ? (index + t) / 2 : 1
    return { hero: 260 + 130 * away, heroSize: lerp(1.5, 1.1, away), heroLift: 120 * away, far: true }
  },
  props: () => <Ceremony />,
  frame: ({ play }) => ({ credits: shareOf(play, 1), slot: ramp(shareOf(play, 2), 0, 0.3), slotSeconds: 9 - 3 * shareOf(play, 2) }),
}

const SCENES: Record<SceneId, SceneSpec> = { hero, about, work, tech, services, projects, ventures, bands, muayThai, contact }

export interface TourScene extends TheatreScene {
  id: SceneId
  slot: SectionSlot | null
  script: SceneScript
}

/** The fight's own playhead: before its first frame while the intro plays. */
const fightPlay = (spec: SceneSpec, play: Playhead): { fight: Playhead; intro: number } => {
  if (!spec.intro) return { fight: play, intro: 1 }
  if (play.action === 0) return { fight: { action: 0, t: 0, done: false }, intro: play.t }
  return { fight: { ...play, action: play.action - 1 }, intro: 1 }
}

// His bar flashes red this often once it is nearly gone.
const WARN = { below: 0.25, everyMs: 260 }

/** The scene's writer: where it is in its run, both fighters posed and placed, the camera, its props and screen. */
function bindScene(stage: HTMLElement, spec: SceneSpec, scene: Omit<TourScene, 'bind'>, profession: Profession): StageWriter {
  const heroNode = fx(stage, 'hero')
  const rivalNode = fx(stage, 'partner')
  const camera = fx(stage, 'camera')
  const heroShadow = heroNode?.querySelector('[data-shadow]') ?? null
  const rivalShadow = rivalNode?.querySelector('[data-shadow]') ?? null
  const poseHero = scrubWriter(heroNode, profession, posesOf(spec.actions, 'hero'))
  const poseRival = scrubWriter(rivalNode, profession, posesOf(spec.actions, 'partner'))
  const props = spec.write?.(stage)
  const intro = spec.intro?.kind === 'hop' ? hopWriter(stage, spec.intro.from, spec.intro.to) : spec.intro ? ladderWriter(stage, spec.intro.climb) : null
  const screen = screenWriter(stage, spec.calls ?? [])
  const rivalSize = spec.rivalSize ?? SIZE
  const narrow = spec.beat === 'fight' ? window.matchMedia(FOLLOW.query) : null
  const facing = spec.rivalAlong ? '' : ` translate(${CELL.width} 0) scale(-1 1)`
  return (_progress, _reached, play = sceneEnd(scene.script)) => {
    const { fight, intro: introT } = fightPlay(spec, play)
    intro?.(introT)
    const action = spec.actions[fight.action]
    const { index, t } = beatIn(action, fight.t)
    const beat = action.beats[index]
    const m: Moment = { play: fight, beat, index, t, hits: hitsUpTo(spec.actions, fight) }
    const steps = { ...STILL, ...spec.steps?.(m) }
    const rock = beat.partner === 'hurt' && !beat.hold ? bell(t, 0, 1) * KNOCK : 0
    const x = { hero: HERO_X + steps.hero, rival: HERO_X + spec.gap + steps.rival + rock }
    poseHero(beat.hero, beat.hold?.[0] ?? t)
    poseRival(beat.partner, beat.hold?.[1] ?? t)
    transformTo(heroNode, steps.turn ? turnedAt(x.hero, steps.heroLift, steps.heroSize) : standAt(x.hero, steps.heroLift, steps.heroSize))
    transformTo(heroShadow, steps.far ? '' : `translate(0 ${r1(steps.heroLift / steps.heroSize)})`)
    transformTo(rivalNode, standAt(x.rival, steps.lift, rivalSize))
    fadeTo(rivalNode, steps.solid)
    transformTo(rivalShadow, `translate(0 ${r1(steps.lift / rivalSize)})${facing}`)
    // the middle of the pair, each cell's middle by its own size (the warlord stands bigger)
    const focus = (x.hero + (CELL.width * steps.heroSize) / 2 + x.rival + (CELL.width * rivalSize) / 2) / 2
    const pan = narrow ? (narrow.matches ? FOLLOW.narrow : FOLLOW.wide) - focus : 0
    transformTo(camera, `translate(${r1(pan)} 0) ${focusOn(focus, FLOOR - 150, spec.zoom?.(m) ?? 1)}`)
    const shown = spec.callAt?.(m) ?? {}
    props?.(m, x)
    const life = lifeOf(spec.actions, fight)
    const elapsed = elapsedOf(scene.script, play)
    const won = spec.rival && spec.beat === 'fight' && life.rival <= 0 ? 1 : 0
    screen({
      seconds: spec.beat === 'bonus' ? CLOCK.from - CLOCK.used * Math.min(1, (fight.action + fight.t) / 2) : spec.clock && lerp(spec.clock[0], spec.clock[1], (fight.action + fight.t) / spec.actions.length),
      life,
      warn: life.hero < WARN.below && Math.floor(elapsed / WARN.everyMs) % 2 === 0 ? 0.85 : 0,
      orbs: won,
      crossed: spec.masters === undefined ? 0 : spec.masters + won,
      shown,
      ...spec.frame?.(m),
    })
  }
}

/** The page's scenes in order: the hero, the profession's sections, the contact. */
export function scenesOf(slots: readonly SectionSlot[], profession: Profession): TourScene[] {
  const ids: SceneId[] = ['hero', ...slots.map((slot) => slot.id), 'contact']
  return ids.map((id) => {
    const spec = SCENES[id]
    const base = { id, slot: slots.find((slot) => slot.id === id) ?? null, count: 0, script: scriptOf(spec) }
    return { ...base, bind: (stage: HTMLElement) => bindScene(stage, spec, base, profession) }
  })
}

// The troupe's own phone framing where a beat's card leaves it less room (world.module.css).
const TROUPE: Partial<Record<RunBeat, string>> = { ending: look.ending }

/** A scene's picture: its stage of the run, the two fighters and the round's props, then the run's screen:
 *  the select board, the map hop or the ladder, the HUD, the calls and the ending's credits and slot. */
export function TourStage({ scene, profession, staff, settled = false }: { scene: TourScene; profession: Profession; staff: Staff; settled?: boolean }) {
  const spec = SCENES[scene.id]
  const fights = spec.beat === 'fight' || spec.beat === 'bonus'
  return (
    <Stage
      scene={scene}
      motion={TOUR_MOTION}
      settled={settled}
      className={look.tourStage}
      layers={[
        {
          name: 'sky',
          node: (
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
              {ZONE_ART[spec.zone]}
              {spec.beat === 'select' && (
                <g data-fx="dusk" opacity="0">
                  {DUSK_ART}
                </g>
              )}
            </svg>
          ),
        },
        {
          name: 'figure',
          node: (
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
              <g className={`${look.troupe} ${TROUPE[spec.beat] ?? ''}`}>
                <g data-fx="camera">
                  {spec.props?.()}
                  <g data-fx="partner" transform={standAt(HERO_X + spec.gap, 0, spec.rivalSize ?? SIZE)} visibility={spec.rival ? undefined : 'hidden'}>
                    <ScrubFighter profession={profession} who="partner" rival={spec.rival} mirror={!spec.rivalAlong} poses={posesOf(spec.actions, 'partner')} />
                  </g>
                  <g data-fx="hero" transform={standAt(HERO_X)}>
                    <ScrubFighter profession={profession} rival={spec.stand} poses={posesOf(spec.actions, 'hero')} />
                  </g>
                  {spec.front?.()}
                </g>
              </g>
            </svg>
          ),
        },
        {
          name: 'screen',
          node: (
            // in a box of its own, so the layer's rule that stretches a stage's svg over it leaves these be
            <div className="absolute inset-0">
              {fights && <Hud rival={spec.beat === 'bonus' ? 'CAR' : undefined} ladder={spec.masters !== undefined} />}
              <Calls calls={spec.calls ?? []} />
              {spec.beat === 'select' && <SelectBoard profession={profession} />}
              {spec.beat === 'ending' && (
                <>
                  <Credits staff={staff} />
                  <OpenSlot />
                </>
              )}
              {spec.intro?.kind === 'hop' && <MapHop from={spec.intro.from} to={spec.intro.to} />}
              {spec.intro?.kind === 'ladder' && <Ladder profession={profession} climb={spec.intro.climb} />}
            </div>
          ),
        },
      ]}
    />
  )
}
