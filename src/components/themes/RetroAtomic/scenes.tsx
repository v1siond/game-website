import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import type { Labels } from '@/lib/cv/labels'
import { stageItems, type StageItems } from '@/lib/cv/stageItems'
import { ramp } from '@/lib/scroll/stage'
import { clamp01, fadeTo, fx, lerp, r1, transformTo } from '../shared/stageNodes'
import { fxs, propLayout, type FigureState, type FigureWriter, type PropLayout, type StageNodes } from '../shared/figureScene'
import { DoorArt } from './shelterDoor'
import { DogFigure, PACK } from './dog'
import { MutantFigure } from './mutant'
import { GROUND, type Zone } from './zones'
import {
  BAKELITE,
  BRASS,
  CHROME,
  CREAM,
  GLASS,
  INK,
  OLIVE,
  OLIVE_DARK,
  OLIVE_LIGHT,
  PHOSPHOR,
  PHOSPHOR_DEEP,
  POLE,
  POSTER_BLUE,
  POSTER_INK,
  RUST,
  SHELTER_YELLOW,
  STEEL,
  STEEL_LIGHT,
  WARNING_RED,
} from './palette'
import {
  FOE_DOWN,
  FOE_GUARD,
  FOE_KICKED,
  FOE_KNEED,
  FOE_SWING,
  BLOCK,
  GUARD,
  SITTING,
  STAND,
  STANDING,
  aim,
  dogJoints,
  foeJoints,
  kick,
  knee,
  mix,
  mixFoe,
  lockpick,
  mixDog,
  point,
  setDogPose,
  setFoePose,
  sneak,
  tune,
  thumbsUp,
  trot,
  typing,
  walk,
  type DogPose,
  type SurvivorPose,
} from './pose'

// Each part of the page as a scene of the walk out of the shelter, played the way a wasteland RPG's hero
// plays: its place (the shelter, the wasteland, the town at dusk), his kit, the props it holds (one per card
// the section counts) and, per frame, what the props and he do at the scene's progress p (0 when its stage
// starts to rise, 1 when it has sunk) with f of its cards reached (0 to count, fractional). Each card is one
// beat that ends back at rest, so the scroll plays it forward and back with no jump between cards. About:
// he levels up at the wrist terminal under the shelter's posters, one poster and its pip lit per card.
// Work: he sneaks crouched from quest flag to quest flag and runs each one up. Tech: he picks the lock of a
// footlocker per category, on one knee. Services: he keys a locked set per service, two rows miss, the
// third matches and the tube boots. Projects: per project the targeting freeze, the lock and its hit ring
// on a board, the camera pushed in for the slow shot. Ventures: he points, and one of his three dogs in turn
// runs out, digs a tape out of its mound and trots back to heel. Bands: he turns the radio's dial and a mast
// lamp lights per station. Muay Thai: a turn fight on a row of hexes, his step and strike, then the mutant's
// swing and his block; the last turn freezes, pushes in and drops the mutant. Contact: he and the three
// dogs walk out to the public terminal. The hero: him and the three dogs in the shelter, the cog door
// rolled aside.

export type SceneId = 'hero' | SectionId | 'contact'

type Layout = PropLayout

/** Him in a frame: where his boots are, his size, his pose and how visible he is. */
export type SurvivorState = FigureState<SurvivorPose>

export interface SceneDef {
  zone: Zone
  /** His kit in the scene; null takes the profession the page shows. */
  kit: Profession | null
  /** Whether he holds the bakelite radio. */
  radio?: boolean
  /** The props behind him and in front of him, drawn in the figure layer. */
  back: (layout: Layout) => ReactNode
  front: (layout: Layout) => ReactNode
  bind: (stage: StageNodes, layout: Layout) => FigureWriter<SurvivorPose>
}

// The band the props stand in: right of the text column on a wide screen, the middle a phone shows.
const BAND: Record<'wide' | 'phone', readonly [number, number]> = { wide: [940, 1340], phone: [580, 860] }

/** A prop's size where many share the band: its own size while the gap between props fits its `width`,
 *  smaller as they crowd, never under half. */
const fitOf = (xs: readonly number[], width: number): number => (xs.length < 2 ? 1 : Math.max(0.45, Math.min(1, (xs[1] - xs[0]) / width)))

const propAt = (x: number, y: number, fit: number): string => `translate(${r1(x)} ${r1(y)}) scale(${fit.toFixed(3)})`

const K = 1.5
const NONE = (): ReactNode => null

// He comes in from this far left of the first prop as its card nears the reading line.
const ENTRY = 80

const survivor = (zone: Zone, x: number, pose: SurvivorPose, k = K, opacity = 1): SurvivorState => ({ x, y: GROUND[zone], k, pose, opacity })

// ---------------------------------------------------------------- the beat of a card

/** The card whose beat plays with f cards reached, and how far into its beat, 0 to 1; f = count is the
 *  last card's beat ended, the settled frame. */
const beatOf = (f: number, count: number): { at: number; t: number } => {
  const at = Math.min(count - 1, Math.max(0, Math.floor(f)))
  return { at, t: clamp01(f - at) }
}

/** 0 outside from..to, rising to 1 and falling back inside it: a move that starts and ends at rest. */
const bell = (t: number, from: number, to: number): number => Math.sin(Math.PI * ramp(t, from, to))

/** Up over in..held, held at 1, down over out..to. */
const hold = (t: number, from: number, held: number, out: number, to: number): number => ramp(t, from, held) * (1 - ramp(t, out, to))

const ease = (t: number): number => t * t * (3 - 2 * t)

interface Station {
  x: number
  at: number
  /** How far he has moved on to this card's spot, 0 to 1. */
  go: number
  /** The beat after he got there, 0 to 1. */
  act: number
  /** The step cycle of his move between spots: whole numbers at every spot. */
  phase: number
}

/** He moves to the spot `offset` from card at's prop over the first `run` of its beat and acts over the rest;
 *  the first card's move starts ENTRY short of it. */
function station(xs: readonly number[], f: number, offset: number, run: number): Station {
  const { at, t } = beatOf(f, xs.length)
  const go = ramp(t, 0, run)
  const from = at === 0 ? xs[0] + offset - ENTRY : xs[at - 1] + offset
  return { x: lerp(from, xs[at] + offset, ease(go)), at, go, act: ramp(t, run, 1), phase: (at + go) * 2 }
}

// ---------------------------------------------------------------- the camera and the freeze

// One canvas unit on screen: the planes cover the screen sliced from the 1440 by 900 canvas (stage.tsx).
const UNIT = 'max(100vw / 1440, 100vh / 900)'

/** The canvas point (x, y) on its plane as a CSS transform origin: the canvas sits centred across and on the
 *  bottom edge. */
const originOf = (x: number, y: number): string => `calc(50% + ${r1(x - 720)} * ${UNIT}) calc(100% - ${r1(900 - y)} * ${UNIT})`

/** The camera of the scene: every plane (stage.tsx marks each data-fx="cam-<layer>") pushed in on one point. A
 *  CSS scale on the plane, so the push is composited rather than the planes redrawn each frame. */
function cameraWriter(stage: StageNodes): (x: number, y: number, zoom: number) => void {
  const planes = ['sky', 'far', 'mid', 'near', 'figure'].map((name) => fx(stage, `cam-${name}`) as SVGElement | null)
  return (x, y, zoom) => {
    const pushed = zoom > 1
    planes.forEach((plane) => {
      if (!plane) return
      plane.style.transformOrigin = originOf(x, y)
      plane.style.transform = pushed ? `scale(${zoom.toFixed(3)})` : ''
      plane.style.willChange = pushed ? 'transform' : ''
    })
  }
}

// How far the camera pushes in on the target for the slow shot.
const PUSH = 0.35

/** The targeting freeze: the place washed in the terminal's green while the shot is lined up. */
const Freeze = () => <rect data-fx="freeze" width={1440} height={900} fill={PHOSPHOR} opacity={0} />

// ---------------------------------------------------------------- his three dogs, the second figures some scenes hold

const DOG_K = 1.25

/** Dog `i` of the pack, its 120 by 80 viewBox feet on y 69, placed on the ground by the writer. */
function Dog({ zone, x, i }: { zone: Zone; x: number; i: number }) {
  const breed = PACK[i]
  const k = DOG_K * breed.size
  return (
    <g data-fx={`dog-${i}`} transform={dogAt(zone, x, 1)}>
      <svg x={-60 * k} y={-69 * k} width={120 * k} height={80 * k} viewBox="0 0 120 80" overflow="visible">
        <DogFigure breed={breed} />
      </svg>
    </g>
  )
}

const dogAt = (zone: Zone, x: number, facing: 1 | -1): string => `translate(${r1(x)} ${GROUND[zone]}) scale(${facing} 1)`

/** All three dogs at `xs`, the first drawn last so it stands in front. */
const Pack = ({ zone, xs }: { zone: Zone; xs: readonly number[] }) => (
  <>
    {[2, 1, 0].map((i) => (
      <Dog key={i} zone={zone} x={xs[i]} i={i} />
    ))}
  </>
)

type DogWriter = (i: number, x: number, pose: DogPose, facing?: 1 | -1) => void

/** The pack's writer: where dog i stands, which way it faces and its pose. */
function packWriter(stage: StageNodes, zone: Zone): DogWriter {
  const dogs = PACK.map((_, i) => {
    const group = fx(stage, `dog-${i}`)
    return { group, joints: group && dogJoints(group) }
  })
  return (i, x, pose, facing = 1) => {
    const { group, joints } = dogs[i]
    transformTo(group, dogAt(zone, x, facing))
    if (joints) setDogPose(joints, pose)
  }
}

// ---------------------------------------------------------------- the hero

const DOOR = 320

// Where the door, he and the dogs stand: right of the wrist terminal on a wide screen, in the middle a phone shows.
const HERO_AT = {
  wide: { door: 760, him: 1180, dogs: [1300, 1065, 960] },
  phone: { door: 470, him: 760, dogs: [870, 660, 570] },
}

const doorAt = (x: number, p: number): string => `translate(${r1(x + 60 * p)} ${GROUND.shelter - DOOR}) rotate(${r1(40 * p)} ${DOOR * 1.05} ${DOOR / 2})`

const hero: SceneDef = {
  zone: 'shelter',
  kit: null,
  back: ({ phone }) => (
    <>
      <ellipse cx={HERO_AT[phone ? 'phone' : 'wide'].door + DOOR / 2 - 20} cy={GROUND.shelter - DOOR / 2} rx={DOOR / 2 + 6} ry={DOOR / 2 + 6} fill={INK} opacity={0.8} />
      <g data-fx="door" transform={doorAt(HERO_AT[phone ? 'phone' : 'wide'].door, 0)}>
        <DoorArt x={DOOR * 0.55} width={DOOR} height={DOOR} />
      </g>
    </>
  ),
  front: ({ phone }) => <Pack zone="shelter" xs={HERO_AT[phone ? 'phone' : 'wide'].dogs} />,
  bind: (stage, { phone }) => {
    const door = fx(stage, 'door')
    const dogs = packWriter(stage, 'shelter')
    const at = HERO_AT[phone ? 'phone' : 'wide']
    return (p) => {
      // the door has rolled aside from the opening: as the page moves on it rolls a little further on its track
      transformTo(door, doorAt(at.door, p))
      // the shepherds prick their ears at the open door; the husky gets up, ready to go
      const looked = ramp(p, 0.2, 0.5)
      dogs(0, at.dogs[0], { ...SITTING, look: looked })
      dogs(1, at.dogs[1], { ...SITTING, look: looked })
      dogs(2, at.dogs[2], mixDog(SITTING, { ...STANDING, look: 1 }, ramp(p, 0.15, 0.45)))
      return survivor('shelter', at.him, { ...STAND, rise: -1.5 * Math.sin(p * 12) }, phone ? 1.9 : 2.1)
    }
  },
}

// ---------------------------------------------------------------- About: the posters on the shelter wall

const POSTER_Y = 380

const about: SceneDef = {
  zone: 'shelter',
  kit: null,
  back: ({ xs }) => (
    <>
      {xs.map((x, i) => (
        <g key={x} transform={propAt(x, POSTER_Y, fitOf(xs, 96))}>
          <rect x={-44} y={-62} width={88} height={124} fill={CREAM} stroke={POSTER_INK} strokeWidth={4} />
          <g data-fx={`poster-${i}`} opacity={0.2}>
            <rect x={-36} y={-54} width={72} height={70} fill={SHELTER_YELLOW} />
            <path d="M-12 -2 V-34 Q-12 -42 -4 -42 Q2 -42 2 -34 V-18 H14 Q20 -18 20 -10 V8 Q20 14 12 14 H-12 Z" fill={POSTER_BLUE} stroke={POSTER_INK} strokeWidth={3} />
            <rect x={-30} y={26} width={60} height={8} fill={POSTER_BLUE} />
            <rect x={-22} y={40} width={44} height={6} fill={WARNING_RED} />
          </g>
          <rect x={-16} y={74} width={32} height={10} fill={INK} stroke={STEEL_LIGHT} strokeWidth={2} />
          <rect data-fx={`pip-${i}`} x={-13} y={77} width={26} height={4} fill={PHOSPHOR} opacity={0.1} />
        </g>
      ))}
    </>
  ),
  front: NONE,
  bind: (stage, { count, cx }) => {
    const posters = fxs(stage, 'poster', count)
    const pips = fxs(stage, 'pip', count)
    return (p, f) => {
      posters.forEach((poster, i) => fadeTo(poster, 0.2 + 0.8 * ramp(f, i + 0.3, i + 0.45)))
      pips.forEach((pip, i) => fadeTo(pip, 0.1 + 0.9 * ramp(f, i + 0.35, i + 0.5)))
      // per card: he keys the wrist terminal, then the thumb up with the wink and the star
      const { t } = beatOf(f, Math.max(1, count))
      const keyed = bell(t, 0.05, 0.5)
      const cheered = bell(t, 0.5, 0.95)
      return survivor('shelter', cx, keyed > 0 ? mix(STAND, typing(1, t * 8), keyed) : mix(STAND, thumbsUp(1), cheered))
    }
  },
}

// ---------------------------------------------------------------- Work: the quest flags

const FLAG_POLE = 260

const work: SceneDef = {
  zone: 'wasteland',
  kit: 'engineer',
  back: ({ xs }) => (
    <>
      {xs.map((x, i) => (
        <g key={x} transform={propAt(x, GROUND.wasteland, fitOf(xs, 76))}>
          <rect x={-3} y={-FLAG_POLE} width={6} height={FLAG_POLE} fill={STEEL} />
          <circle cx={0} cy={-FLAG_POLE} r={7} fill={BRASS} />
          <path data-fx={`flag-${i}`} d="M3 -60 H66 L54 -42 L66 -24 H3 Z" fill={SHELTER_YELLOW} stroke={POSTER_INK} strokeWidth={3} />
        </g>
      ))}
    </>
  ),
  front: NONE,
  bind: (stage, { xs, count }) => {
    const flags = fxs(stage, 'flag', count)
    return (p, f) => {
      flags.forEach((flag, i) => transformTo(flag, `translate(0 ${r1(-(FLAG_POLE - 66) * ease(ramp(f, i + 0.6, i + 0.85)))})`))
      // crouched from flag to flag; at each he stands up while it runs up, then crouches again for the next
      const { x, act, phase } = station(xs, f, -90, 0.5)
      return survivor('wasteland', x, sneak(phase, 1 - hold(act, 0, 0.2, 0.75, 1)))
    }
  },
}

// ---------------------------------------------------------------- Tech stack: the footlockers

const tech: SceneDef = {
  zone: 'wasteland',
  kit: 'engineer',
  back: ({ xs }) => (
    <>
      {xs.map((x, i) => (
        <g key={x} transform={propAt(x, GROUND.wasteland, fitOf(xs, 92))}>
          <rect data-fx={`glow-${i}`} x={-36} y={-58} width={72} height={10} fill={PHOSPHOR} opacity={0} />
          <rect x={-40} y={-50} width={80} height={50} rx={3} fill={OLIVE} stroke={POSTER_INK} strokeWidth={3} />
          <path d="M-40 -34 H40 M-40 -16 H40" stroke={OLIVE_DARK} strokeWidth={3} />
          <rect x={-9} y={-47} width={18} height={14} fill={BRASS} stroke={POSTER_INK} strokeWidth={2} />
          <g data-fx={`cylinder-${i}`} transform="translate(0 -40)">
            <circle r={4.5} fill={POSTER_INK} />
            <path d="M0 -3 V3" stroke={BRASS} strokeWidth={2} />
          </g>
          <path data-fx={`pin-${i}`} d="M0 -40 L-22 -40" stroke={CHROME} strokeWidth={2.5} strokeLinecap="round" transform="rotate(-50 0 -40)" />
          <g data-fx={`lid-${i}`}>
            <rect x={-42} y={-62} width={84} height={14} rx={2} fill={OLIVE_LIGHT} stroke={POSTER_INK} strokeWidth={3} />
          </g>
        </g>
      ))}
    </>
  ),
  front: NONE,
  bind: (stage, { xs, count }) => {
    const lids = fxs(stage, 'lid', count)
    const glows = fxs(stage, 'glow', count)
    const pins = fxs(stage, 'pin', count)
    const cylinders = fxs(stage, 'cylinder', count)
    return (p, f) => {
      // the pick feels round to its angle, the cylinder turns, the lid flies open on what is inside
      pins.forEach((pin, i) => transformTo(pin, `rotate(${r1(-50 + 62 * ramp(f, i + 0.35, i + 0.55))} 0 -40)`))
      cylinders.forEach((cylinder, i) => transformTo(cylinder, `translate(0 -40) rotate(${r1(90 * ramp(f, i + 0.55, i + 0.65))})`))
      lids.forEach((lid, i) => transformTo(lid, `rotate(${r1(-118 * ease(ramp(f, i + 0.65, i + 0.8)))} -42 -48)`))
      glows.forEach((glow, i) => fadeTo(glow, ramp(f, i + 0.65, i + 0.8)))
      const { x, act, phase } = station(xs, f, -70, 0.3)
      const kneel = hold(act, 0, 0.12, 0.85, 1)
      return survivor('wasteland', x, mix(sneak(phase, 0.5), lockpick(1, Math.sin(act * Math.PI * 5)), kneel))
    }
  },
}

// ---------------------------------------------------------------- Services: the locked sets

// The rows of unreadable glyph blocks on a locked set's screen, each row's block widths.
const GLYPH_ROWS: readonly (readonly number[])[] = [
  [10, 6, 14, 8, 12],
  [14, 8, 6, 12, 10],
  [6, 12, 10, 14, 8],
]

const ROW_Y = [-152, -136, -120]

// The rows tried per set: the first two miss, the last matches.
const TRIES: readonly (readonly [number, number])[] = [
  [0.32, 0.48],
  [0.48, 0.64],
]

const services: SceneDef = {
  zone: 'wasteland',
  kit: 'engineer',
  back: ({ xs }) => (
    <>
      {xs.map((x, i) => (
        <g key={x} transform={propAt(x, GROUND.wasteland, fitOf(xs, 100))}>
          <rect x={-6} y={-90} width={12} height={90} fill={STEEL} />
          <rect x={-46} y={-170} width={92} height={84} rx={10} fill={BAKELITE} stroke={POSTER_INK} strokeWidth={3} />
          <rect x={-36} y={-160} width={72} height={60} rx={8} fill={GLASS} />
          {GLYPH_ROWS.map((widths, row) => (
            <g key={row}>
              <rect data-fx={`row-${i}-${row}`} x={-33} y={ROW_Y[row] - 6} width={66} height={12} fill={PHOSPHOR} opacity={0} />
              {widths.map((w, k) => (
                <rect key={k} x={-30 + widths.slice(0, k).reduce((a, b) => a + b + 2, 0)} y={ROW_Y[row] - 3} width={w} height={6} fill={PHOSPHOR_DEEP} />
              ))}
            </g>
          ))}
          <g data-fx={`tube-${i}`} opacity={0}>
            <rect x={-36} y={-160} width={72} height={60} rx={8} fill={PHOSPHOR} fillOpacity={0.35} />
            <path d="M-26 -146 H20 M-26 -132 H26 M-26 -118 H6" stroke={PHOSPHOR} strokeWidth={4} />
          </g>
        </g>
      ))}
    </>
  ),
  front: NONE,
  bind: (stage, { xs, count }) => {
    const rows = Array.from({ length: count }, (_, i) => GLYPH_ROWS.map((_, row) => fx(stage, `row-${i}-${row}`)))
    const tubes = fxs(stage, 'tube', count)
    return (p, f) => {
      rows.forEach((set, i) => {
        const t = f - i
        TRIES.forEach(([from, to], row) => fadeTo(set[row], 0.6 * bell(t, from, to)))
        fadeTo(set[2], 0.6 * ramp(t, 0.64, 0.72))
      })
      tubes.forEach((tube, i) => fadeTo(tube, ramp(f, i + 0.75, i + 0.9)))
      const { x, act, phase } = station(xs, f, -110, 0.3)
      const keyed = hold(act, 0, 0.1, 0.85, 1)
      return survivor('wasteland', x, mix(walk(phase), typing(1, act * 10), keyed))
    }
  },
}

// ---------------------------------------------------------------- Projects: the target boards

// The boards' centre over the ground.
const TARGET_UP = -230

// The share of the hit ring the lock fills, the board's odds, by board.
const ODDS = [0.95, 0.8, 0.9, 0.75]

const boardX = (xs: readonly number[], i: number): number => xs[i] + 60 * fitOf(xs, 96)

const projects: SceneDef = {
  zone: 'wasteland',
  kit: null,
  back: ({ xs }) => (
    <>
      {xs.map((x, i) => (
        <g key={x} transform={propAt(boardX(xs, i), GROUND.wasteland, fitOf(xs, 96))}>
          <path d={`M-4 ${TARGET_UP + 40} V0`} stroke={POLE} strokeWidth={6} />
          <g transform={`translate(0 ${TARGET_UP})`}>
            <circle r={42} fill={CREAM} stroke={POSTER_INK} strokeWidth={3} />
            <circle r={28} fill={WARNING_RED} />
            <circle r={14} fill={CREAM} />
            <circle data-fx={`hit-${i}`} r={6} fill={POSTER_INK} opacity={0} />
            <g data-fx={`lock-${i}`} opacity={0} stroke={PHOSPHOR} strokeWidth={4} fill="none">
              <path d="M-54 -38 V-54 H-38 M38 -54 H54 V-38 M54 38 V54 H38 M-38 54 H-54 V38" />
              <circle data-fx={`odds-${i}`} r={62} pathLength={100} strokeDasharray="0 100" transform="rotate(-90)" />
            </g>
          </g>
        </g>
      ))}
    </>
  ),
  front: () => <Freeze />,
  bind: (stage, { xs, count, phone }) => {
    const hits = fxs(stage, 'hit', count)
    const locks = fxs(stage, 'lock', count)
    const odds = fxs(stage, 'odds', count)
    const freeze = fx(stage, 'freeze')
    const camera = cameraWriter(stage)
    const him = xs[0] - (phone ? 40 : 50)
    return (p, f) => {
      const { at, t } = beatOf(f, count)
      hits.forEach((hit, i) => fadeTo(hit, ramp(f, i + 0.58, i + 0.62)))
      // per board: the freeze, the lock and its odds, the push in for the slow shot, then back out
      const locked = hold(t, 0.12, 0.28, 0.82, 0.95)
      locks.forEach((lock, i) => fadeTo(lock, i === at ? locked : 0))
      odds.forEach((ring, i) => ring?.setAttribute('stroke-dasharray', `${r1(i === at ? 100 * ODDS[i % ODDS.length] * ramp(t, 0.2, 0.38) : 0)} 100`))
      fadeTo(freeze, 0.22 * locked)
      camera(boardX(xs, at), GROUND.wasteland + TARGET_UP, 1 + PUSH * ease(hold(t, 0.35, 0.5, 0.72, 0.92)))
      const shot = bell(t, 0.5, 0.7)
      return survivor('wasteland', him, aim(ramp(f, 0, 0.12), shot))
    }
  },
}

// ---------------------------------------------------------------- Ventures: the dogs fetch the tapes

const ventures: SceneDef = {
  zone: 'town',
  kit: null,
  back: ({ xs }) => (
    <>
      {xs.map((x, i) => (
        <g key={x} transform={propAt(x + 50 * fitOf(xs, 90), GROUND.town, fitOf(xs, 90))}>
          <path d="M-40 0 Q0 -30 40 0 Z" fill={RUST} stroke={POSTER_INK} strokeWidth={3} />
          <g data-fx={`tape-${i}`} transform="translate(0 10)">
            <rect x={-22} y={-14} width={44} height={28} rx={4} fill={BAKELITE} stroke={POSTER_INK} strokeWidth={3} />
            <circle cx={-9} cy={0} r={6} fill={PHOSPHOR} />
            <circle cx={9} cy={0} r={6} fill={PHOSPHOR} />
          </g>
        </g>
      ))}
    </>
  ),
  front: ({ xs, phone }) => <Pack zone="town" xs={heelOf(xs, phone)} />,
  bind: (stage, { xs, count, phone }) => {
    const tapes = fxs(stage, 'tape', count)
    const dogs = packWriter(stage, 'town')
    const heel = heelOf(xs, phone)
    return (p, f) => {
      tapes.forEach((tape, i) => transformTo(tape, `translate(0 ${r1(lerp(10, -70, ease(ramp(f, i + 0.5, i + 0.66))))})`))
      const { at, t } = beatOf(f, count)
      const runner = at % PACK.length
      // the runner gets up, runs out to its mound, digs, turns and trots back to heel; the others watch
      const out = ramp(t, 0.12, 0.38)
      const back = ramp(t, 0.62, 0.9)
      const dig = hold(t, 0.38, 0.44, 0.56, 0.62)
      const mound = xs[at] + 50 * fitOf(xs, 90) - 70
      const x = lerp(heel[runner], mound, ease(out) - ease(back))
      const running = (out > 0 && out < 1) || (back > 0 && back < 1)
      const pose = running ? trot(t * 10) : mixDog(SITTING, { ...STANDING, dig }, hold(t, 0.05, 0.12, 0.9, 1))
      PACK.forEach((_, i) => (i === runner ? dogs(i, x, pose, back > 0 && back < 1 ? -1 : 1) : dogs(i, heel[i], { ...SITTING, look: hold(t, 0.1, 0.2, 0.8, 0.95) })))
      return survivor('town', heel[0] - (phone ? 30 : 60), mix(STAND, point(1), bell(t, 0, 0.35)))
    }
  },
}

/** Where the dogs sit at his heel in Ventures, in front of him and short of the first mound. */
const heelOf = (xs: readonly number[], phone: boolean): number[] => {
  const first = xs[0] - (phone ? 10 : 50)
  return [first, first - 70, first - 140]
}

// ---------------------------------------------------------------- Bands: the radio mast

const MAST_Y = 300

const bands: SceneDef = {
  zone: 'town',
  kit: null,
  radio: true,
  back: ({ xs }) => (
    <>
      <path d={`M${r1(xs[0] - 60)} ${GROUND.town} L${r1((xs[0] + xs[xs.length - 1]) / 2)} ${MAST_Y - 40} L${r1(xs[xs.length - 1] + 60)} ${GROUND.town}`} stroke={STEEL} strokeWidth={6} fill="none" />
      <path d={`M${r1(xs[0] - 70)} ${MAST_Y + 30} H${r1(xs[xs.length - 1] + 70)}`} stroke={STEEL_LIGHT} strokeWidth={4} />
      {xs.map((x, i) => (
        <g key={x} transform={`translate(${r1(x)} ${MAST_Y + 30})`}>
          <circle r={12} fill={INK} stroke={STEEL_LIGHT} strokeWidth={3} />
          <circle data-fx={`lamp-${i}`} r={9} fill={WARNING_RED} opacity={0.15} />
        </g>
      ))}
    </>
  ),
  front: NONE,
  bind: (stage, { count, cx }) => {
    const lamps = fxs(stage, 'lamp', count)
    return (p, f) => {
      lamps.forEach((lamp, i) => fadeTo(lamp, 0.15 + 0.85 * ramp(f, i + 0.7, i + 0.82)))
      // per station the dial turns on to it and the needle locks; its lamp lights
      const { at, t } = beatOf(f, count)
      return survivor('town', cx - 40, tune((at + ease(ramp(t, 0.1, 0.7))) / count))
    }
  },
}

// ---------------------------------------------------------------- Muay Thai: the turn fight with the mutant

const FOE_K = 1.6
const STAR_Y = 260

// His last hex, the mutant's, and the hex's width, the step a turn spends.
const fight = ({ cx, phone }: Layout) => ({ foe: cx + 70, last: cx - 70, step: phone ? 35 : 140 / 3 })

/** His hex before turn i's step: the first turn starts one hex further back. */
const hexOf = (layout: Layout, i: number): number => {
  const { last, step } = fight(layout)
  return last - step * (layout.count - 1 - i)
}

const hexPath = (x: number, w: number): string => {
  const y = GROUND.town + 6
  const h = w * 0.32
  return `M${r1(x - w / 2)} ${y} L${r1(x - w / 4)} ${r1(y - h / 2)} H${r1(x + w / 4)} L${r1(x + w / 2)} ${y} L${r1(x + w / 4)} ${r1(y + h / 2)} H${r1(x - w / 4)} Z`
}

const muayThai: SceneDef = {
  zone: 'town',
  kit: 'fighter',
  back: (layout) => {
    const { xs } = layout
    const { foe, step } = fight(layout)
    const hexes = Array.from({ length: Math.round((foe - hexOf(layout, -1)) / step) + 1 }, (_, j) => hexOf(layout, -1) + step * j)
    return (
      <>
        {hexes.map((x) => (
          <path key={x} d={hexPath(x, step * 1.33)} fill="none" stroke={PHOSPHOR} strokeOpacity={0.45} strokeWidth={2} />
        ))}
        {xs.map((x, i) => (
          <g key={x} transform={propAt(x, STAR_Y, fitOf(xs, 60))}>
            <path d="M0 -26 L7 -8 L26 -8 L11 4 L17 23 L0 12 L-17 23 L-11 4 L-26 -8 L-7 -8 Z" fill={INK} stroke={SHELTER_YELLOW} strokeWidth={3} />
            <path data-fx={`star-${i}`} d="M0 -20 L5 -6 L20 -6 L8 3 L13 18 L0 9 L-13 18 L-8 3 L-20 -6 L-5 -6 Z" fill={SHELTER_YELLOW} opacity={0} />
          </g>
        ))}
      </>
    )
  },
  front: (layout) => (
    <>
      <g data-fx="foe" transform={`translate(${r1(fight(layout).foe)} ${GROUND.town})`}>
        <svg x={-66 * FOE_K} y={-146 * FOE_K} width={120 * FOE_K} height={150 * FOE_K} viewBox="0 0 120 150" overflow="visible">
          <MutantFigure />
        </svg>
        <path data-fx="burst" d="M-74 -150 L-60 -132 L-80 -124 L-58 -118 L-66 -98 L-48 -112 L-36 -94 L-38 -118 L-18 -122 L-40 -132 L-30 -150 L-50 -138 Z" fill={SHELTER_YELLOW} stroke={POSTER_INK} strokeWidth={3} opacity={0} />
      </g>
      <Freeze />
    </>
  ),
  bind: (stage, layout) => {
    const { count } = layout
    const stars = fxs(stage, 'star', count)
    const foe = fx(stage, 'foe')
    const joints = foe && foeJoints(foe)
    const burst = fx(stage, 'burst')
    const freeze = fx(stage, 'freeze')
    const camera = cameraWriter(stage)
    const { foe: foeX } = fight(layout)
    return (p, f) => {
      stars.forEach((star, i) => fadeTo(star, ramp(f, i + 0.35, i + 0.45)))
      const { at, t } = beatOf(f, count)
      const final = at === count - 1
      // his turn: one hex step, then the knee to the body or the kick to the head
      const stepped = ramp(t, 0, 0.22)
      const x = lerp(hexOf(layout, at - 1), hexOf(layout, at), ease(stepped))
      const strike = bell(t, 0.25, 0.5)
      const reaction = ramp(strike, 0.6, 1)
      const kneeing = at % 2 === 0
      // the mutant's turn: his swing and the block; on the last turn the freeze, the push in, and he goes down
      const swing = final ? 0 : bell(t, 0.55, 0.9)
      const frozen = final ? hold(t, 0.45, 0.55, 0.85, 0.98) : 0
      const done = final ? ramp(t, 0.6, 0.85) : 0
      if (joints) setFoePose(joints, mixFoe(mixFoe(mixFoe(FOE_GUARD, kneeing ? FOE_KNEED : FOE_KICKED, reaction), FOE_SWING, swing), FOE_DOWN, done))
      fadeTo(burst, Math.max(reaction, frozen))
      fadeTo(freeze, 0.22 * frozen)
      camera(foeX - 20, GROUND.town - 200, 1 + PUSH * ease(frozen))
      const guard = mix(GUARD, BLOCK, swing)
      const striking = mix(guard, kneeing ? knee(strike) : kick(strike), Math.min(1, strike * 2))
      const pose = done > 0 ? mix(GUARD, thumbsUp(1), done) : { ...striking, rise: striking.rise - 6 * Math.sin(Math.PI * stepped) }
      return survivor('town', x + 30 * strike, pose)
    }
  },
}

// ---------------------------------------------------------------- Contact: the public terminal

const contact: SceneDef = {
  zone: 'town',
  kit: null,
  back: ({ cx }) => (
    <g transform={`translate(${r1(cx + 90)} ${GROUND.town})`}>
      <rect x={-8} y={-120} width={16} height={120} fill={STEEL} />
      <rect x={-56} y={-230} width={112} height={116} rx={8} fill={BAKELITE} stroke={POSTER_INK} strokeWidth={3} />
      <rect x={-44} y={-218} width={88} height={72} rx={6} fill={GLASS} />
      <g data-fx="screen" opacity={0.2}>
        <path d="M-34 -204 H26 M-34 -190 H14 M-34 -176 H30 M-34 -162 H4" stroke={PHOSPHOR} strokeWidth={4} />
      </g>
      <rect x={-40} y={-138} width={80} height={14} fill={CHROME} stroke={POSTER_INK} strokeWidth={2} />
    </g>
  ),
  front: ({ cx }) => <Pack zone="town" xs={CONTACT_HEEL.map((back) => cx - 420 - back)} />,
  bind: (stage, { cx }) => {
    const screen = fx(stage, 'screen')
    const dogs = packWriter(stage, 'town')
    return (p) => {
      const there = ramp(p, 0.2, 0.5)
      const x = lerp(cx - 420, cx + 10, there)
      const moving = there > 0 && there < 1 ? 1 : 0
      fadeTo(screen, 0.2 + 0.8 * ramp(p, 0.5, 0.6))
      CONTACT_HEEL.forEach((back, i) => dogs(i, x - back, moving ? trot(p * 12 + i * 0.3) : SITTING))
      const pose = moving ? walk(p * 12) : mix(STAND, typing(1, p * 8), ramp(p, 0.5, 0.58))
      return survivor('town', x, pose)
    }
  },
}

// How far behind him each dog walks out to the terminal.
const CONTACT_HEEL = [120, 240, 360]

const SCENE_DEFS: Record<SceneId, SceneDef> = { hero, about, work, tech, services, projects, ventures, bands, muayThai, contact }

export interface Scene {
  id: SceneId
  def: SceneDef
  layout: Layout
  /** His kit here: the scene's own, or the profession the page shows. */
  kit: Profession
  /** The section's slot; the hero and the contact have none. */
  slot: SectionSlot | null
}

type RecordWords = Pick<Labels, 'record' | 'years'>

const NO_ITEMS: StageItems = { lead: 0, count: 0 }

const sceneOf = (id: SceneId, slot: SectionSlot | null, items: StageItems, profession: Profession, phone: boolean): Scene => {
  const def = SCENE_DEFS[id]
  return { id, def, layout: propLayout(items, BAND[phone ? 'phone' : 'wide'], phone), kit: def.kit ?? profession, slot }
}

/** The page as scenes: the hero, one per section the profession shows in reading order, the contact. */
export const scenesOf = (slots: readonly SectionSlot[], profession: Profession, phone: boolean, highlights: number, labels: RecordWords): Scene[] => [
  sceneOf('hero', null, NO_ITEMS, profession, phone),
  ...slots.map((slot) => sceneOf(slot.id, slot, stageItems(slot, labels, highlights), profession, phone)),
  sceneOf('contact', null, NO_ITEMS, profession, phone),
]

