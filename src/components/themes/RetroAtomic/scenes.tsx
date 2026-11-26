import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import type { Labels } from '@/lib/cv/labels'
import type { Playhead, SceneScript } from '@/lib/scroll/player'
import { stageItems, type StageItems } from '@/lib/cv/stageItems'
import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, focusOn, fx, lerp, r1, transformTo } from '../shared/stageNodes'
import { propLayout, type FigureState, type FigureWriter, type PropLayout, type StageNodes } from '../shared/figureScene'
import { DoorArt } from './shelterDoor'
import { DogFigure, PACK } from './dog'
import { MutantFigure } from './mutant'
import { Bobblehead } from './dweller'
import { GROUND, type Zone } from './zones'
import {
  BAKELITE,
  BRASS,
  CHROME,
  CREAM,
  DUST_DARK,
  GLASS,
  HAZE_SUN,
  INK,
  OLIVE,
  OLIVE_DARK,
  OLIVE_LIGHT,
  PHOSPHOR,
  PHOSPHOR_DEEP,
  POLE,
  POSTER_INK,
  RUST,
  SHELTER_YELLOW,
  STEEL,
  STEEL_LIGHT,
  WARNING_RED,
} from './palette'
import {
  AIM,
  BLOCK,
  FOE_DOWN,
  FOE_GUARD,
  FOE_KNEED,
  FOE_SWING,
  HOLD_UP,
  JAB,
  KEYS,
  KICK,
  KIT,
  KNEE,
  KNEEL,
  PICK,
  POINT,
  RADIO,
  REACH,
  SHADE,
  SITTING,
  STANDING,
  WRIST,
  dogJoints,
  foeJoints,
  mix,
  mixDog,
  mixFoe,
  pose,
  setDogPose,
  setFoePose,
  trot,
  walk,
  type DogPose,
  type DwellerPose,
  type FoePose,
} from './pose'

// Each part of the page as one place of the walk out of the shelter, played the way the atomic age RPG it
// comes from plays: he stands at one spot under a fixed camera and the shared scene player moves his move
// through the scene's script of one to three actions (src/lib/scroll/player.ts), each action its own stretch
// of the move, so every frame is a function of the playhead alone, plays the same backward, and the last
// action's end is the frame reduced motion shows. Hero: the cog door rolls aside and he walks out into the
// glare, shading his eyes, the dogs up. About: he raises the wrist computer, then takes the bobblehead off its
// stand and a pip lights. Work: the targeting freeze on a mutant behind a wreck, the hit percents, the slowed
// shot under the pushed in camera. Tech: on one knee he picks the footlocker's lock. Services: he steps into the
// power armour from behind, it closes, and he lands the stomp. Projects: the wrist needle climbs over the
// glowing crater, he backs off and jabs the syringe. Ventures: he points and the husky digs up the tape and
// brings it back. Bands: he tunes the radio and the mast lights. Muay Thai: a turn fight with the mutant, his
// knee, its swing and his block, the freeze and the slowed kick. Contact: he walks out to the public terminal
// and keys it, the dogs at heel.

export type SceneId = 'hero' | SectionId | 'contact'

/** What a scene's art and writer read: the phone's narrower view, the side of a wide screen it plays on, the
 *  kit he wears. */
export interface SceneInput {
  phone: boolean
  /** From lg the scene plays on the left half, its section's cards reading on the right (sideOf). */
  left: boolean
  /** The place is drawn the other way round about the middle: on a phone so he ends in the half his section
   *  names, from lg where it turns for the right half (turnedOf). */
  turned: boolean
  kit: Profession
}

/** The half of a wide screen a scene plays in; its cards read on the other half. */
export type SceneSide = 'right' | 'left'

/** The side of the scene at `index` among the sections after the hero, the contact last: right, left, right... */
const sideOf = (index: number): SceneSide => (index % 2 === 0 ? 'right' : 'left')

/** His frame in a move: his pose, how far ahead of his spot he is, and how much of him shows. */
interface Frame {
  pose: DwellerPose
  ahead: number
  opacity?: number
}

export interface SceneDef {
  zone: Zone
  /** His kit in the scene; null takes the profession the page shows. */
  kit: Profession | null
  /** The scene's actions, each its length in ms. */
  script: SceneScript
  /** Where each action ends on the move's t, one per action, the last 1. */
  ends: readonly number[]
  /** How far right of his usual spot he stands, on a wide screen and on a phone (the hero: clear of the wide
   *  wrist computer, and his dogs in a phone's view). */
  shift?: { wide: number; phone: number }
  /** From lg, on the right it is drawn as its left composition turned round the middle, so all of it plays
   *  right of the cards (the contact: he and the pack come in from the right edge to the terminal). */
  turnsRight?: boolean
  /** The place's art round his spot (x 0 his spot, y 0 the ground), behind him and in front of him. */
  back: (input: SceneInput) => ReactNode
  front?: (input: SceneInput) => ReactNode
  /** His move `t` of the way. */
  move: (kit: Profession, t: number) => Frame
  /** Binds the place's reply to his move and returns its writer over the move's t. */
  reply: (stage: StageNodes, input: SceneInput) => (t: number) => void
}

/** Him in a frame, as the shared figure scene places him. */
export type DwellerState = FigureState<DwellerPose>

// His size on the stage, and where he stands: right of the text column on a wide screen, or 600 further left
// when the cards read on the right, so the place before him fills the left half the same way and ends left of
// the cards (what stands furthest from him, the mutant behind the wreck, about 370 past him); the left of a
// phone's view (about x 490 to 950) so the place before him shows whole.
const K = 1.6
const spotOf = ({ phone, left }: Pick<SceneInput, 'phone' | 'left'>): number => (phone ? 560 : left ? 260 : 860)

/** On a phone's narrow view the place round his spot, and he, are drawn at this share of their size. */
export const placeScale = (phone: boolean): number => (phone ? 0.8 : 1)

/** The middle of the canvas, and of a phone's view of it: the line a turned place is drawn round. */
const MIDDLE = 720

/** The transform that draws a turned place the other way round about the middle. */
export const MIRROR = `translate(${2 * MIDDLE} 0) scale(-1 1)`

/** Before the section arrives a scene shows its first frame. */
const START: Playhead = { action: 0, t: 0, done: false }

/** How far the move has played at `play`: each action plays its stretch, from the end of the one before to its
 *  own end on the move's t. */
const moveAt = (ends: readonly number[], { action, t }: Playhead): number => lerp(action > 0 ? ends[action - 1] : 0, ends[action] ?? 1, t)

const ease = (t: number): number => t * t * (3 - 2 * t)

const still = (p: DwellerPose, ahead = 0): Frame => ({ pose: p, ahead })

/** His pose over a stretch of the move: from `a` to `b` while t runs from..to. */
const blend = (a: DwellerPose, b: DwellerPose, t: number, from: number, to: number): DwellerPose => mix(a, b, ease(ramp(t, from, to)))

// ---------------------------------------------------------------- the camera and the targeting freeze

/** The camera of the scene: every plane's group (stage.tsx marks each data-fx="cam-<layer>") pushed in on one
 *  canvas point, as an SVG transform, so it holds on a phone's view as on the wide one. */
function cameraWriter(stage: StageNodes, { turned }: Pick<SceneInput, 'turned'>): (x: number, y: number, zoom: number) => void {
  const planes = ['sky', 'far', 'mid', 'near', 'figure'].map((name) => fx(stage, `cam-${name}`))
  return (x, y, zoom) => planes.forEach((plane) => transformTo(plane, zoom > 1 ? focusOn(turned ? 2 * MIDDLE - x : x, y, zoom) : ''))
}

// How far the camera pushes in on the target for the slowed shot.
const PUSH = 0.35

/** The targeting freeze: the place washed in the wrist screen's green while the shot is lined up. */
const Freeze = () => <rect data-fx="freeze" x={-1600} y={-1200} width={4000} height={2600} fill={PHOSPHOR} opacity={0} />

/** A targeting box round a part with its hit percent on a dark tab; in a turned place the percent is turned
 *  back round its own middle, so it reads. */
function Target({ name, x, y, size, odds, turned }: { name: string; x: number; y: number; size: number; odds: number; turned: boolean }) {
  const h = size / 2
  return (
    <g data-fx={name} opacity={0} transform={`translate(${x} ${y})`}>
      <path d={`M${-h} ${-h + 10} V${-h} H${-h + 10} M${h - 10} ${-h} H${h} V${-h + 10} M${h} ${h - 10} V${h} H${h - 10} M${-h + 10} ${h} H${-h} V${h - 10}`} fill="none" stroke={PHOSPHOR} strokeWidth={4} />
      <rect x={h + 6} y={-14} width={58} height={28} rx={3} fill={INK} />
      <text x={h + 35} y={7} transform={turned ? `translate(${2 * (h + 35)} 0) scale(-1 1)` : undefined} textAnchor="middle" fontFamily="monospace" fontSize={20} fontWeight={700} fill={PHOSPHOR}>
        {odds}%
      </text>
    </g>
  )
}

// ---------------------------------------------------------------- his three dogs

const DOG_K = 1.25

const dogAt = (x: number, facing: 1 | -1): string => `translate(${r1(x)} 0) scale(${facing} 1)`

/** Dog `i` of the pack at x, its 120 by 80 viewBox's feet on y 69. */
function Dog({ x, i }: { x: number; i: number }) {
  const breed = PACK[i]
  const k = DOG_K * breed.size
  return (
    <g data-fx={`dog-${i}`} transform={dogAt(x, 1)}>
      <svg x={-60 * k} y={-69 * k} width={120 * k} height={80 * k} viewBox="0 0 120 80" overflow="visible">
        <DogFigure breed={breed} />
      </svg>
    </g>
  )
}

/** All three dogs at `xs`, the first drawn last so it stands in front. */
const Pack = ({ xs }: { xs: readonly number[] }) => (
  <>
    {[2, 1, 0].map((i) => (
      <Dog key={i} x={xs[i]} i={i} />
    ))}
  </>
)

type DogWriter = (i: number, x: number, pose: DogPose, facing?: 1 | -1) => void

function packWriter(stage: StageNodes): DogWriter {
  const dogs = PACK.map((_, i) => {
    const group = fx(stage, `dog-${i}`)
    return { group, joints: group && dogJoints(group) }
  })
  return (i, x, dogPose, facing = 1) => {
    const { group, joints } = dogs[i]
    transformTo(group, dogAt(x, facing))
    if (joints) setDogPose(joints, dogPose)
  }
}

// ---------------------------------------------------------------- the mutant

const FOE_K = 1.6

/** The mutant, its 120 by 150 viewBox's feet at (66, 146), facing left toward him. */
function Mutant({ x }: { x: number }) {
  return (
    <g data-fx="foe" transform={`translate(${x} 0)`}>
      <svg x={-66 * FOE_K} y={-146 * FOE_K} width={120 * FOE_K} height={150 * FOE_K} viewBox="0 0 120 150" overflow="visible">
        <MutantFigure />
      </svg>
    </g>
  )
}

/** The mutant's head from its feet, where the targeting box and the shot land. */
const FOE_HEAD = { x: (40 - 66) * FOE_K, y: (40 - 146) * FOE_K }

function foeWriter(stage: StageNodes): (foePose: FoePose, lift?: number) => void {
  const foe = fx(stage, 'foe')
  const joints = foe && foeJoints(foe)
  return (foePose) => {
    if (joints) setFoePose(joints, foePose)
  }
}

// The pistol's muzzle with the pistol up (AIM), from his spot: the 100 by 150 box's (106, 58) at his size.
const MUZZLE = { x: (106 - 52) * K, y: -(144 - 58) * K }

/** The round of the slowed shot and the hit's burst, both resting hidden. */
function Round({ to }: { to: { x: number; y: number } }) {
  return (
    <>
      <g data-fx="round" opacity={0}>
        <path d="M-18 0 H0" stroke={SHELTER_YELLOW} strokeWidth={5} strokeLinecap="round" />
        <circle r={4} fill={CREAM} />
      </g>
      <path
        data-fx="burst"
        transform={`translate(${to.x} ${to.y})`}
        d="M0 -30 L8 -10 L28 -14 L12 2 L24 20 L4 10 L-6 30 L-8 8 L-28 12 L-14 -4 L-26 -20 L-6 -12 Z"
        fill={SHELTER_YELLOW}
        stroke={POSTER_INK}
        strokeWidth={3}
        opacity={0}
      />
    </>
  )
}

function roundWriter(stage: StageNodes, from: { x: number; y: number }, to: { x: number; y: number }): (flight: number, hit: number) => void {
  const round = fx(stage, 'round')
  const burst = fx(stage, 'burst')
  return (flight, hit) => {
    fadeTo(round, flight > 0 && flight < 1 ? 1 : 0)
    transformTo(round, `translate(${r1(lerp(from.x, to.x, flight))} ${r1(lerp(from.y, to.y, flight))})`)
    fadeTo(burst, hit)
  }
}

// ---------------------------------------------------------------- Hero: the cog door

const DOOR = { x: 210, size: 300, rolled: 340 }
const HERO_DOGS = [-60, -115, -170]

const hero: SceneDef = {
  zone: 'shelter',
  kit: null,
  shift: { wide: 150, phone: 70 },
  script: [1600, 1800],
  ends: [0.45, 1],
  back: () => (
    <>
      {/* the opening in the wall and the glare of the outside through it */}
      <circle cx={DOOR.x} cy={-DOOR.size / 2 - 4} r={DOOR.size / 2 + 4} fill={INK} />
      <circle data-fx="glare" cx={DOOR.x} cy={-DOOR.size / 2 - 4} r={DOOR.size / 2 - 10} fill={HAZE_SUN} opacity={0} />
      <path data-fx="beam" d={`M${DOOR.x - 130} -20 L${DOOR.x + 130} -20 L${DOOR.x + 260} 14 L${DOOR.x - 300} 14 Z`} fill={HAZE_SUN} opacity={0} />
      <path d={`M${DOOR.x - 160} 0 H${DOOR.x + 380}`} stroke={STEEL} strokeWidth={8} />
      <path d={`M${DOOR.x - 150} 0 H${DOOR.x + 370}`} stroke={BRASS} strokeWidth={3} strokeDasharray="6 10" />
      {/* the warning light over the opening */}
      <g transform={`translate(${DOOR.x - 170} -320)`}>
        <rect x={-14} y={-6} width={28} height={30} rx={6} fill={STEEL_LIGHT} stroke={POSTER_INK} strokeWidth={3} />
        <circle data-fx="alarm" cy={4} r={10} fill={WARNING_RED} opacity={0.2} />
      </g>
      <Pack xs={HERO_DOGS} />
    </>
  ),
  front: () => (
    <g data-fx="door">
      <DoorArt x={DOOR.x - DOOR.size / 2} y={-DOOR.size - 4} width={DOOR.size} height={DOOR.size} />
    </g>
  ),
  // he waits at his spot, then walks out to the edge of the opening and shades his eyes against the glare
  move: (kit, t) => {
    const out = ramp(t, 0.45, 0.8)
    const walking = out > 0 && out < 1
    const shade = ramp(t, 0.78, 0.95)
    return still(walking ? walk(out * 4) : blend(KIT[kit], pose({ ...KIT[kit], ...SHADE }), shade, 0, 1), 70 * ease(out))
  },
  reply: (stage) => {
    const door = fx(stage, 'door')
    const glare = fx(stage, 'glare')
    const beam = fx(stage, 'beam')
    const alarm = fx(stage, 'alarm')
    const dogs = packWriter(stage)
    return (t) => {
      // the purge light, the door pulled out of its seat, then rolled aside along its rack
      fadeTo(alarm, 0.2 + 0.8 * Math.abs(Math.sin(ramp(t, 0, 0.4) * Math.PI * 3)))
      const pulled = ease(ramp(t, 0.08, 0.2))
      const rolled = ease(ramp(t, 0.2, 0.45))
      const cx = DOOR.x + DOOR.rolled * rolled
      const cy = -DOOR.size / 2 - 4
      const size = 1 + 0.05 * pulled
      transformTo(door, `translate(${r1(cx)} ${r1(cy)}) rotate(${r1(150 * rolled)}) scale(${size.toFixed(3)}) translate(${-DOOR.x} ${-cy})`)
      fadeTo(glare, ramp(t, 0.2, 0.45))
      fadeTo(beam, 0.5 * ramp(t, 0.3, 0.5))
      // the dogs get up and look out
      const up = ramp(t, 0.5, 0.75)
      HERO_DOGS.forEach((x, i) => dogs(i, x, mixDog(SITTING, { ...STANDING, look: 1 }, up)))
    }
  },
}

// ---------------------------------------------------------------- About: the bobblehead stand

const SHELF = { x: 66, y: -126 }
const PIPS = 5

const about: SceneDef = {
  zone: 'shelter',
  kit: null,
  script: [1400, 1800],
  ends: [0.4, 1],
  back: () => (
    <>
      {/* the stat panel on the wall: five pips, the fourth fills when he takes the figure */}
      <g transform="translate(150 -300)">
        <rect x={-10} y={-10} width={PIPS * 26 + 10} height={36} rx={4} fill={GLASS} stroke={POSTER_INK} strokeWidth={3} />
        {Array.from({ length: PIPS }, (_, i) => (
          <rect key={i} x={i * 26} y={0} width={18} height={16} fill={i < 3 ? PHOSPHOR : PHOSPHOR_DEEP} />
        ))}
        <rect data-fx="pip" x={3 * 26} y={0} width={18} height={16} fill={PHOSPHOR} opacity={0} />
      </g>
      {/* the shelf on its brackets and the stand on it */}
      <rect x={SHELF.x - 40} y={SHELF.y} width={130} height={10} fill={OLIVE_LIGHT} stroke={POSTER_INK} strokeWidth={3} />
      <path d={`M${SHELF.x - 30} ${SHELF.y + 10} l10 24 M${SHELF.x + 80} ${SHELF.y + 10} l-10 24`} stroke={STEEL} strokeWidth={5} />
      <rect x={SHELF.x - 10} y={SHELF.y - 10} width={90} height={10} fill={BAKELITE} stroke={POSTER_INK} strokeWidth={2} />
      <g data-fx="stand-figure" transform={`translate(${SHELF.x} ${SHELF.y - 10}) scale(${K})`}>
        <Bobblehead />
      </g>
      <g transform={`translate(${SHELF.x + 50} ${SHELF.y - 10}) scale(${K})`}>
        <Bobblehead />
      </g>
    </>
  ),
  // the wrist computer up before his face, then the reach to the stand and the figure held up, its head bobbing
  move: (kit, t) => {
    const base = KIT[kit]
    const looked = blend(base, pose({ ...WRIST, gauge: 1 }), t, 0, 0.25)
    if (t < 0.45) return still(looked)
    const reached = blend(looked, pose(REACH), t, 0.45, 0.65)
    if (t < 0.68) return still(reached)
    const held = blend(pose(REACH), pose({ ...HOLD_UP }), t, 0.68, 0.85)
    const bob = Math.sin(ramp(t, 0.72, 1) * Math.PI * 4) * (1 - ramp(t, 0.72, 1))
    return still({ ...held, held: 1, bob })
  },
  reply: (stage) => {
    const standFigure = fx(stage, 'stand-figure')
    const pip = fx(stage, 'pip')
    return (t) => {
      fadeTo(standFigure, t < 0.68 ? 1 : 0)
      fadeTo(pip, ramp(t, 0.85, 0.95))
    }
  },
}

// ---------------------------------------------------------------- Work: the targeting freeze on the wreck

const WRECK = 250
const WORK_FOE = 330

function Wreck() {
  return (
    <g transform={`translate(${WRECK} 0)`}>
      <path d="M-110 -10 L-104 -58 L-60 -66 L-36 -104 L44 -104 L74 -66 L112 -58 L116 -10 Z" fill={RUST} stroke={POSTER_INK} strokeWidth={4} />
      <path d="M-30 -96 L40 -96 L62 -66 L-52 -66 Z" fill={INK} opacity={0.7} />
      <circle cx={-66} cy={-10} r={22} fill={INK} />
      <circle cx={74} cy={-10} r={22} fill={INK} />
      <path d="M-104 -40 H116" stroke={DUST_DARK} strokeWidth={4} />
    </g>
  )
}

const workTarget = { x: WORK_FOE + FOE_HEAD.x, y: FOE_HEAD.y }

const work: SceneDef = {
  zone: 'wasteland',
  kit: null,
  script: [2000, 2400],
  ends: [0.45, 1],
  back: () => (
    <>
      {/* the ground hides the mutant while he crouches behind the wreck */}
      <clipPath id="ra-work-ground">
        <rect x={WORK_FOE - 200} y={-400} width={400} height={404} />
      </clipPath>
      <g clipPath="url(#ra-work-ground)">
        <Mutant x={WORK_FOE} />
      </g>
    </>
  ),
  front: ({ turned }) => (
    <>
      <Wreck />
      <Freeze />
      <Target name="aim-head" x={workTarget.x} y={workTarget.y} size={70} odds={62} turned={turned} />
      <Target name="aim-body" x={WORK_FOE - 30} y={-200} size={90} odds={88} turned={turned} />
      <Round to={workTarget} />
    </>
  ),
  // the pistol drawn and up on the head, held through the slowed shot, its kick at the release
  move: (kit, t) => {
    const aimed = blend(KIT[kit], pose(AIM), t, 0.1, 0.32)
    const kick = bell(t, 0.56, 0.66)
    return still({ ...aimed, armRight: aimed.armRight - 10 * kick, flash: kick })
  },
  reply: (stage, input) => {
    const { phone } = input
    const spot = spotOf(input)
    const size = placeScale(phone)
    const foe = foeWriter(stage)
    const foeNode = fx(stage, 'foe')
    const freeze = fx(stage, 'freeze')
    const head = fx(stage, 'aim-head')
    const body = fx(stage, 'aim-body')
    const camera = cameraWriter(stage, input)
    const shot = roundWriter(stage, MUZZLE, workTarget)
    return (t) => {
      // the mutant rises from behind the wreck; the place goes green and stops on the targeting boxes
      transformTo(foeNode, `translate(${WORK_FOE} ${r1(110 * (1 - ease(ramp(t, 0, 0.28))))})`)
      const frozen = ramp(t, 0.3, 0.42) * (1 - ramp(t, 0.88, 1))
      fadeTo(freeze, 0.22 * frozen)
      fadeTo(head, ramp(t, 0.34, 0.42) * (1 - ramp(t, 0.6, 0.66)))
      fadeTo(body, ramp(t, 0.38, 0.45) * (1 - ramp(t, 0.5, 0.56)))
      // the slowed shot: the camera pushes in on the head, the round crosses slowly, the hit throws him over
      camera(spot + workTarget.x * size, GROUND.wasteland + workTarget.y * size, 1 + PUSH * ease(ramp(t, 0.46, 0.6) * (1 - ramp(t, 0.86, 1))))
      shot(ramp(t, 0.6, 0.8), ramp(t, 0.79, 0.82) * (1 - ramp(t, 0.92, 1)))
      foe(mixFoe(FOE_GUARD, FOE_DOWN, ease(ramp(t, 0.8, 0.95))))
    }
  },
}

// ---------------------------------------------------------------- Tech stack: the footlocker

const LOCKER = 74

const tech: SceneDef = {
  zone: 'wasteland',
  kit: 'engineer',
  script: [1600, 1400],
  ends: [0.55, 1],
  back: () => (
    <g transform={`translate(${LOCKER} 0) scale(1.3)`}>
      <rect data-fx="glow" x={-36} y={-58} width={72} height={10} fill={PHOSPHOR} opacity={0} />
      <rect x={-40} y={-50} width={80} height={50} rx={3} fill={OLIVE} stroke={POSTER_INK} strokeWidth={3} />
      <path d="M-40 -34 H40 M-40 -16 H40" stroke={OLIVE_DARK} strokeWidth={3} />
      <rect x={-9} y={-47} width={18} height={14} fill={BRASS} stroke={POSTER_INK} strokeWidth={2} />
      <g data-fx="cylinder" transform="translate(0 -40)">
        <circle r={4.5} fill={POSTER_INK} />
        <path d="M0 -3 V3" stroke={BRASS} strokeWidth={2} />
      </g>
      <path data-fx="pin" d="M0 -40 L-22 -40" stroke={CHROME} strokeWidth={2.5} strokeLinecap="round" transform="rotate(-50 0 -40)" />
      <g data-fx="lid">
        <rect x={-42} y={-62} width={84} height={14} rx={2} fill={OLIVE_LIGHT} stroke={POSTER_INK} strokeWidth={3} />
      </g>
    </g>
  ),
  // down on one knee at the lock, the pick worked round, then sitting back as the lid flies
  move: (kit, t) => {
    const knelt = blend(KIT[kit], pose({ ...KNEEL, ...PICK }), t, 0, 0.25)
    const work = t > 0.25 && t < 0.55 ? Math.sin(ramp(t, 0.25, 0.55) * Math.PI * 6) : 0
    const back = 6 * ease(ramp(t, 0.7, 0.85))
    return still({ ...knelt, foreRight: knelt.foreRight + 8 * work, lean: knelt.lean - back })
  },
  reply: (stage) => {
    const pin = fx(stage, 'pin')
    const cylinder = fx(stage, 'cylinder')
    const lid = fx(stage, 'lid')
    const glow = fx(stage, 'glow')
    return (t) => {
      transformTo(pin, `rotate(${r1(-50 + 62 * ramp(t, 0.28, 0.55))} 0 -40)`)
      transformTo(cylinder, `translate(0 -40) rotate(${r1(90 * ramp(t, 0.55, 0.7))})`)
      transformTo(lid, `rotate(${r1(-118 * ease(ramp(t, 0.7, 0.85)))} -42 -48)`)
      fadeTo(glow, ramp(t, 0.72, 0.9))
    }
  },
}

// ---------------------------------------------------------------- Services: the power armour

const ARMOUR = 170
const ARMOUR_LINE = { stroke: POSTER_INK, strokeWidth: 4, strokeLinejoin: 'round' as const }

/** The power armour frame side on, facing right, feet on y 0: the legs, the hull, the shoulder plate, the
 *  helmet and its visor slit, the hatch on its back that swings open. */
function Armour() {
  return (
    <g data-fx="armour">
      <path d="M-40 0 L-38 -96 L-6 -96 L-4 0 Z" fill={STEEL} {...ARMOUR_LINE} />
      <path d="M-14 0 L-12 -100 L22 -100 L26 0 Z" fill={STEEL_LIGHT} {...ARMOUR_LINE} />
      <path d="M-20 4 L-20 -10 L40 -10 L46 4 Z" fill={OLIVE_DARK} {...ARMOUR_LINE} />
      <path d="M-50 -92 L-46 -220 Q-10 -236 36 -220 L44 -92 Z" fill={STEEL_LIGHT} {...ARMOUR_LINE} />
      <path d="M-10 -200 L34 -196 L38 -120 L-6 -118 Z" fill={STEEL} {...ARMOUR_LINE} />
      <path d="M-34 -232 Q4 -252 40 -228 L44 -196 L-38 -196 Z" fill={SHELTER_YELLOW} {...ARMOUR_LINE} />
      {/* the helmet and its visor slit */}
      <path d="M-28 -236 Q-26 -292 8 -294 Q42 -292 44 -248 L40 -230 L-24 -228 Z" fill={STEEL_LIGHT} {...ARMOUR_LINE} />
      <rect x={14} y={-262} width={30} height={10} rx={3} fill={INK} />
      <rect data-fx="visor" x={16} y={-260} width={26} height={6} rx={2} fill={SHELTER_YELLOW} opacity={0} />
      {/* the back hatch: open, the dark of the frame shows; it swings shut on its hinge at the back edge */}
      <path data-fx="inside" d="M-48 -100 L-44 -218 L-8 -218 L-10 -100 Z" fill={INK} />
      <g data-fx="hatch" transform="rotate(55 -46 -218)">
        <path d="M-48 -100 L-44 -218 L-14 -216 L-16 -102 Z" fill={STEEL} {...ARMOUR_LINE} />
        <circle cx={-30} cy={-160} r={8} fill={BRASS} stroke={POSTER_INK} strokeWidth={3} />
      </g>
    </g>
  )
}

const services: SceneDef = {
  zone: 'wasteland',
  kit: 'engineer',
  script: [1800, 1800],
  ends: [0.5, 1],
  back: () => (
    <>
      <ellipse data-fx="ring" cx={ARMOUR} cy={4} rx={60} ry={10} fill="none" stroke={CREAM} strokeWidth={8} opacity={0} />
      <g data-fx="cracks" opacity={0} stroke={POSTER_INK} strokeWidth={5} fill="none">
        <path d={`M${ARMOUR - 30} 4 l-40 10 l-30 -2 M${ARMOUR + 40} 4 l50 8 l20 10 M${ARMOUR} 6 l6 14`} />
      </g>
    </>
  ),
  front: () => (
    <g data-fx="suit" transform={`translate(${ARMOUR} 0)`}>
      <Armour />
    </g>
  ),
  // he walks up behind the frame and steps into it; inside it he is the armour
  move: (_kit, t) => {
    const into = ease(ramp(t, 0, 0.3))
    const walking = into > 0 && into < 1
    return { pose: walking ? walk(into * 4) : pose({}), ahead: (ARMOUR - 12) * into, opacity: 1 - ramp(t, 0.3, 0.34) }
  },
  reply: (stage) => {
    const suit = fx(stage, 'suit')
    const hatch = fx(stage, 'hatch')
    const inside = fx(stage, 'inside')
    const visor = fx(stage, 'visor')
    const ring = fx(stage, 'ring')
    const cracks = fx(stage, 'cracks')
    return (t) => {
      // the hatch swings shut behind him, the visor lights
      const shut = ease(ramp(t, 0.34, 0.48))
      transformTo(hatch, `rotate(${r1(55 * (1 - shut))} -46 -218)`)
      fadeTo(inside, 1 - shut)
      fadeTo(visor, ramp(t, 0.5, 0.58))
      // the crouch, the jump and the landing stomp, the dust ring and the cracks going out
      const dip = 10 * bell(t, 0.58, 0.68) + 14 * bell(t, 0.8, 0.9)
      const flight = ramp(t, 0.66, 0.82)
      const lift = -130 * Math.sin(Math.PI * flight)
      transformTo(suit, `translate(${ARMOUR} ${r1(lift + dip)})`)
      const out = ease(ramp(t, 0.8, 1))
      transformTo(ring, `translate(${r1(ARMOUR * (1 - (1 + 2 * out)))} 0) scale(${(1 + 2 * out).toFixed(3)} 1)`)
      fadeTo(ring, ramp(t, 0.8, 0.84) * (1 - 0.6 * out))
      fadeTo(cracks, ramp(t, 0.82, 0.88))
    }
  },
}

// ---------------------------------------------------------------- Projects: the glowing crater

const CRATER = 210

const projects: SceneDef = {
  zone: 'wasteland',
  kit: null,
  script: [1800, 1600],
  ends: [0.5, 1],
  back: () => (
    <g transform={`translate(${CRATER} 0)`}>
      <ellipse cx={0} cy={6} rx={130} ry={24} fill={DUST_DARK} stroke={POSTER_INK} strokeWidth={4} />
      <ellipse data-fx="glow" cx={0} cy={6} rx={104} ry={16} fill={PHOSPHOR} opacity={0.5} />
      <path d="M-40 4 Q-30 -40 -20 4 M10 4 Q22 -56 34 4" fill="none" stroke={PHOSPHOR_DEEP} strokeWidth={6} opacity={0.6} />
      <g transform="translate(150 0)">
        <rect x={-5} y={-130} width={10} height={130} fill={POLE} />
        <path d="M0 -130 L-30 -100 H30 Z" fill={SHELTER_YELLOW} stroke={POSTER_INK} strokeWidth={4} />
        <circle cx={0} cy={-112} r={6} fill={POSTER_INK} />
      </g>
    </g>
  ),
  // to the crater's edge with the wrist computer up, its needle climbing; back off and the syringe to the arm
  move: (kit, t) => {
    const base = KIT[kit]
    const there = ease(ramp(t, 0, 0.28))
    const away = ease(ramp(t, 0.5, 0.66))
    const ahead = 90 * there - 70 * away
    const moving = (there > 0 && there < 1) || (away > 0 && away < 1)
    const gauge = ramp(t, 0.15, 0.48) * (1 - 0.8 * ramp(t, 0.82, 0.96))
    const alarm = t > 0.36 && t < 0.86 ? 0.5 + 0.5 * Math.sin(t * 80) : 0
    if (moving) return still({ ...walk((there + away) * 4), gauge, alarm }, ahead)
    const looked = t < 0.5 ? blend(base, pose(WRIST), t, 0.28, 0.36) : blend(pose(WRIST), pose(JAB), t, 0.66, 0.78)
    return still({ ...looked, gauge, alarm, syringe: t < 0.5 ? 0 : ramp(t, 0.66, 0.7) }, ahead)
  },
  reply: (stage) => {
    const glow = fx(stage, 'glow')
    return (t) => fadeTo(glow, 0.5 + 0.4 * Math.sin(Math.PI * 2 * ramp(t, 0, 1) * 2) ** 2)
  },
}

// ---------------------------------------------------------------- Ventures: the husky fetches the tape

const MOUND = 250
const VENTURE_DOGS = [-60, -120, 70]
const RUNNER = 2

const ventures: SceneDef = {
  zone: 'town',
  kit: null,
  script: [1800, 1600],
  ends: [0.5, 1],
  back: () => (
    <>
      <path d={`M${MOUND - 50} 0 Q${MOUND} -36 ${MOUND + 50} 0 Z`} fill={RUST} stroke={POSTER_INK} strokeWidth={3} />
      <Pack xs={VENTURE_DOGS} />
    </>
  ),
  front: () => (
    <g data-fx="tape" transform={`translate(${MOUND} 10)`}>
      <rect x={-18} y={-11} width={36} height={22} rx={3} fill={BAKELITE} stroke={POSTER_INK} strokeWidth={3} />
      <circle cx={-7} cy={0} r={5} fill={PHOSPHOR} />
      <circle cx={7} cy={0} r={5} fill={PHOSPHOR} />
    </g>
  ),
  // he points the husky out, then reaches for the tape it brings back
  move: (kit, t) => {
    const base = KIT[kit]
    if (t < 0.5) return still(mix(base, pose(POINT), bell(t, 0, 0.45)))
    return still(blend(base, pose({ ...REACH, armRight: -40, foreRight: -30 }), t, 0.8, 0.92))
  },
  reply: (stage) => {
    const dogs = packWriter(stage)
    const tape = fx(stage, 'tape')
    const heel = VENTURE_DOGS[RUNNER]
    return (t) => {
      const out = ease(ramp(t, 0.12, 0.36))
      const dig = t > 0.36 && t < 0.5 ? 1 : 0
      const back = ease(ramp(t, 0.55, 0.82))
      const x = lerp(heel, MOUND - 60, out - back)
      const running = (out > 0 && out < 1) || (back > 0 && back < 1)
      const facing = back > 0 && back < 1 ? -1 : 1
      const dogPose = running ? trot(t * 12) : dig ? { ...STANDING, dig: Math.abs(Math.sin(t * 60)) } : mixDog(SITTING, STANDING, ramp(t, 0.05, 0.12))
      dogs(RUNNER, x, dogPose, facing)
      dogs(0, VENTURE_DOGS[0], { ...SITTING, look: ramp(t, 0.1, 0.2) })
      dogs(1, VENTURE_DOGS[1], { ...SITTING, look: ramp(t, 0.1, 0.2) })
      // the tape: in the mound, up in the husky's jaws, then in his hand
      const dug = ramp(t, 0.46, 0.5)
      const handed = ease(ramp(t, 0.84, 0.94))
      const mouth = { x: x + 50 * facing, y: -26 }
      const hand = { x: 44, y: -104 }
      const atDog = dug > 0 ? mouth : { x: MOUND, y: 10 }
      transformTo(tape, `translate(${r1(lerp(atDog.x, hand.x, handed))} ${r1(lerp(atDog.y, hand.y, handed))})`)
    }
  },
}

// ---------------------------------------------------------------- Bands: the radio mast

const MAST = 250
const LAMPS = [-90, -170, -250, -330]

const bands: SceneDef = {
  zone: 'town',
  // both hands are on the radio, so he wears the plain jumpsuit with no sticks
  kit: 'engineer',
  script: [1600, 1600],
  ends: [0.5, 1],
  back: () => (
    <g transform={`translate(${MAST} 0)`}>
      <path d="M-50 0 L0 -350 L50 0 M-38 -80 H38 M-26 -170 H26 M-14 -260 H14" stroke={STEEL} strokeWidth={6} fill="none" />
      {LAMPS.map((y, i) => (
        <g key={y} transform={`translate(0 ${y})`}>
          <circle r={12} fill={INK} stroke={STEEL_LIGHT} strokeWidth={3} />
          <circle data-fx={`lamp-${i}`} r={9} fill={WARNING_RED} opacity={0.15} />
        </g>
      ))}
      <ellipse data-fx="wave-0" cx={0} cy={-350} rx={40} ry={16} fill="none" stroke={SHELTER_YELLOW} strokeWidth={4} opacity={0} />
      <ellipse data-fx="wave-1" cx={0} cy={-350} rx={40} ry={16} fill="none" stroke={SHELTER_YELLOW} strokeWidth={4} opacity={0} />
    </g>
  ),
  // the radio held at his chest and its dial turned on to the station
  move: (_kit, t) => still(pose({ ...RADIO, dial: ease(ramp(t, 0.08, 0.46)) })),
  reply: (stage) => {
    const lamps = LAMPS.map((_, i) => fx(stage, `lamp-${i}`))
    const waves = [fx(stage, 'wave-0'), fx(stage, 'wave-1')]
    return (t) => {
      lamps.forEach((lamp, i) => fadeTo(lamp, 0.15 + 0.85 * ramp(t, 0.5 + 0.1 * i, 0.58 + 0.1 * i)))
      waves.forEach((wave, i) => {
        const out = ramp(t, 0.6 + 0.15 * i, 0.95)
        transformTo(wave, `translate(0 ${r1(-350 * 2 * out)}) scale(${(1 + 2 * out).toFixed(3)})`)
        fadeTo(wave, out > 0 ? 1 - 0.7 * out : 0)
      })
    }
  },
}

// ---------------------------------------------------------------- Muay Thai: the turn fight

const DUEL = { foe: 200, step: 46 }

const hexPath = (x: number, w: number): string => {
  const h = w * 0.32
  return `M${r1(x - w / 2)} 6 L${r1(x - w / 4)} ${r1(6 - h / 2)} H${r1(x + w / 4)} L${r1(x + w / 2)} 6 L${r1(x + w / 4)} ${r1(6 + h / 2)} H${r1(x - w / 4)} Z`
}

const duelTarget = { x: DUEL.foe + FOE_HEAD.x, y: FOE_HEAD.y }

const muayThai: SceneDef = {
  zone: 'town',
  kit: 'fighter',
  script: [1600, 1400, 2000],
  ends: [0.3, 0.55, 1],
  back: () => (
    <>
      {[-1, 0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={hexPath(i * DUEL.step, DUEL.step * 1.33)} fill="none" stroke={PHOSPHOR} strokeOpacity={0.45} strokeWidth={2} />
      ))}
    </>
  ),
  front: ({ turned }) => (
    <>
      <Mutant x={DUEL.foe} />
      <path
        data-fx="burst"
        transform={`translate(${duelTarget.x} ${duelTarget.y})`}
        d="M0 -30 L8 -10 L28 -14 L12 2 L24 20 L4 10 L-6 30 L-8 8 L-28 12 L-14 -4 L-26 -20 L-6 -12 Z"
        fill={SHELTER_YELLOW}
        stroke={POSTER_INK}
        strokeWidth={3}
        opacity={0}
      />
      <Freeze />
      <Target name="aim-head" x={duelTarget.x} y={duelTarget.y} size={64} odds={95} turned={turned} />
    </>
  ),
  // his turn: a hex step and the knee; the foe's turn: the block; the last: the kick in slow time
  move: (kit, t) => {
    const guard = KIT[kit]
    const stepped = ease(ramp(t, 0, 0.1))
    const ahead = DUEL.step * stepped
    if (t < 0.3) return still(mix(guard, pose(KNEE), bell(t, 0.1, 0.3)), ahead)
    if (t < 0.55) return still(mix(guard, pose(BLOCK), bell(t, 0.32, 0.55)), ahead)
    return still(mix(guard, pose(KICK), bell(t, 0.66, 0.9)), ahead)
  },
  reply: (stage, input) => {
    const { phone } = input
    const spot = spotOf(input)
    const size = placeScale(phone)
    const foe = foeWriter(stage)
    const burst = fx(stage, 'burst')
    const freeze = fx(stage, 'freeze')
    const head = fx(stage, 'aim-head')
    const camera = cameraWriter(stage, input)
    return (t) => {
      const kneed = bell(t, 0.14, 0.3)
      const swing = bell(t, 0.32, 0.55)
      const down = ease(ramp(t, 0.8, 0.95))
      foe(mixFoe(mixFoe(mixFoe(FOE_GUARD, FOE_KNEED, kneed), FOE_SWING, swing), FOE_DOWN, down))
      const frozen = ramp(t, 0.56, 0.62) * (1 - ramp(t, 0.9, 1))
      fadeTo(freeze, 0.22 * frozen)
      fadeTo(head, ramp(t, 0.58, 0.64) * (1 - ramp(t, 0.74, 0.78)))
      camera(spot + duelTarget.x * size, GROUND.town + duelTarget.y * size, 1 + PUSH * ease(ramp(t, 0.6, 0.7) * (1 - ramp(t, 0.9, 1))))
      fadeTo(burst, Math.max(bell(t, 0.18, 0.28), ramp(t, 0.78, 0.82) * (1 - ramp(t, 0.92, 1))))
    }
  },
}

// ---------------------------------------------------------------- Contact: the public terminal

const TERMINAL = 150
const CONTACT_HEEL = [80, 150, 220]
const CONTACT_FROM = -260

const contact: SceneDef = {
  zone: 'town',
  kit: null,
  script: [1800, 1400],
  ends: [0.55, 1],
  turnsRight: true,
  back: () => (
    <>
      <g transform={`translate(${TERMINAL} 0)`}>
        <rect x={-8} y={-120} width={16} height={120} fill={STEEL} />
        <rect x={-56} y={-230} width={112} height={116} rx={8} fill={BAKELITE} stroke={POSTER_INK} strokeWidth={3} />
        <rect x={-44} y={-218} width={88} height={72} rx={6} fill={GLASS} />
        <g data-fx="screen" opacity={0.2}>
          <path d="M-34 -204 H26 M-34 -190 H14 M-34 -176 H30 M-34 -162 H4" stroke={PHOSPHOR} strokeWidth={4} />
        </g>
        <rect x={-40} y={-138} width={80} height={14} fill={CHROME} stroke={POSTER_INK} strokeWidth={2} />
      </g>
      <Pack xs={CONTACT_HEEL.map((back) => CONTACT_FROM - back)} />
    </>
  ),
  move: (kit, t) => {
    const there = ease(ramp(t, 0, 0.55))
    const ahead = lerp(CONTACT_FROM, TERMINAL - 80, there)
    if (there < 1) return still(walk(there * 10), ahead)
    const tap = Math.abs(Math.sin(ramp(t, 0.62, 0.9) * Math.PI * 4))
    const keyed = blend(KIT[kit], pose(KEYS), t, 0.55, 0.62)
    return still({ ...keyed, foreRight: keyed.foreRight + 6 * tap }, ahead)
  },
  reply: (stage) => {
    const screen = fx(stage, 'screen')
    const dogs = packWriter(stage)
    return (t) => {
      const there = ease(ramp(t, 0, 0.55))
      const x = lerp(CONTACT_FROM, TERMINAL - 80, there)
      const moving = there > 0 && there < 1
      CONTACT_HEEL.forEach((back, i) => dogs(i, x - back, moving ? trot(t * 14 + i * 0.3) : mixDog(SITTING, { ...SITTING, look: 1 }, ramp(t, 0.6, 0.7))))
      fadeTo(screen, 0.2 + 0.8 * ramp(t, 0.7, 0.85))
    }
  },
}

const SCENE_DEFS: Record<SceneId, SceneDef> = { hero, about, work, tech, services, projects, ventures, bands, muayThai, contact }

export interface Scene {
  id: SceneId
  def: SceneDef
  /** The cards the section counts, for the theatre's reading line. */
  layout: PropLayout
  /** His kit here: the scene's own, or the profession the page shows. */
  kit: Profession
  /** The section's slot; the hero and the contact have none. */
  slot: SectionSlot | null
  /** The half it plays in from lg, its cards on the other; the hero keeps its own layout on the right. */
  side: SceneSide
  /** It plays on the left half now: a left side on a screen of lg or wider. */
  left: boolean
  /** It plays on the right half from lg as its left composition turned (SceneDef turnsRight). */
  wideTurn: boolean
}

/** The scene's writer: the place's reply and his frame at the scene's playhead, him placed at his spot. */
export function sceneWriter(scene: Scene): (stage: StageNodes) => FigureWriter<DwellerPose> {
  const { def, kit, layout } = scene
  const input = inputOf(scene)
  const spot = sceneSpot(scene)
  const size = placeScale(layout.phone)
  return (stage) => {
    const reply = def.reply(stage, input)
    return (_p, _f, play = START) => {
      const t = moveAt(def.ends, play)
      reply(t)
      const frame = def.move(kit, t)
      return { x: spot + frame.ahead * size, y: GROUND[def.zone], k: K * size, pose: frame.pose, opacity: frame.opacity ?? 1 }
    }
  }
}

/** Where he stands in a scene: his usual spot, shifted right where the scene asks. */
export const sceneSpot = ({ def, layout, left, wideTurn }: Scene): number => spotOf({ phone: layout.phone, left: left || wideTurn }) + (def.shift?.[layout.phone ? 'phone' : 'wide'] ?? 0)

const NAMED: Record<SceneSide, number> = { right: 1, left: -1 }

/** On a phone a section's place is turned round the middle of the view where he would end in the half it does
 *  not name: he then plays it facing the other way, the place on his other side, and ends in the named half;
 *  from lg one that turns for the right half (wideTurn) is. */
const turnedOf = (scene: Scene): boolean => {
  if (scene.wideTurn) return true
  if (scene.id === 'hero' || !scene.layout.phone) return false
  const end = sceneSpot(scene) + scene.def.move(scene.kit, 1).ahead * placeScale(true)
  return (end - MIDDLE) * NAMED[scene.side] < 0
}

/** The input the scene's art reads. */
export const inputOf = (scene: Scene): SceneInput => ({ phone: scene.layout.phone, left: scene.left, turned: turnedOf(scene), kit: scene.kit })

type RecordWords = Pick<Labels, 'record' | 'years'>

const NO_ITEMS: StageItems = { lead: 0, count: 0 }

// The theatre reads only the count of a scene's layout; its band is not drawn on.
const BAND = [0, 0] as const

/** The screen a page is drawn for: a phone (below md), or wide enough for cards and scene side by side (lg). */
export interface Screen {
  phone: boolean
  wide: boolean
}

const sceneOf = (id: SceneId, slot: SectionSlot | null, items: StageItems, profession: Profession, screen: Screen, side: SceneSide): Scene => {
  const def = SCENE_DEFS[id]
  return { id, def, layout: propLayout(items, BAND, screen.phone), kit: def.kit ?? profession, slot, side, left: screen.wide && side === 'left', wideTurn: screen.wide && side === 'right' && Boolean(def.turnsRight) }
}

/** The page as scenes: the hero, one per section the profession shows in reading order, the contact, sides alternating. */
export const scenesOf = (slots: readonly SectionSlot[], profession: Profession, screen: Screen, highlights: number, labels: RecordWords): Scene[] => [
  sceneOf('hero', null, NO_ITEMS, profession, screen, 'right'),
  ...slots.map((slot, i) => sceneOf(slot.id, slot, stageItems(slot, labels, highlights), profession, screen, sideOf(i))),
  sceneOf('contact', null, NO_ITEMS, profession, screen, sideOf(slots.length)),
]
