import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import type { Labels } from '@/lib/cv/labels'
import { stageItems, type StageItems } from '@/lib/cv/stageItems'
import { ramp } from '@/lib/scroll/stage'
import { walkAlong } from '@/lib/scroll/walkAlong'
import { fadeTo, fx, lerp, r1, reached, transformTo } from '../shared/stageNodes'
import { fxs, propLayout, type FigureState, type FigureWriter, type PropLayout, type StageNodes } from '../shared/figureScene'
import { DoorArt } from './vaultDoor'
import { DogFigure } from './dog'
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
  GUARD,
  SITTING,
  STAND,
  aim,
  dogJoints,
  foeJoints,
  hoist,
  kick,
  knee,
  mix,
  mixFoe,
  setDogPose,
  setFoePose,
  sway,
  thumbsUp,
  trot,
  typing,
  walk,
  type DogPose,
  type DwellerPose,
} from './pose'

// Each part of the page as a scene of the walk out of the shelter: its place (the shelter, the wasteland,
// the town at dusk), his kit, the props it holds (one per card the section counts) and, per frame, what the
// props and he do at the scene's progress p (0 when its stage starts to rise, 1 when it has sunk) with f of
// its cards reached (0 to count, fractional). About: a row of propaganda posters on the shelter wall, each
// lit with his thumbs up and the star. Work: a quest flag per job, run up its pole while he keys the wrist
// terminal. Tech: a footlocker per category, its lid thrown open as he hoists it. Services: a dead tube per
// service, booted on with a side kick. Projects: a target board per project, locked and shot. Ventures: the
// dog digs a holotape out of each mound. Bands: the radio mast's lamps, one per station, light while he
// sways with the bakelite radio. Muay Thai: the mutant takes a knee or a kick per achievement, its star
// lit on the perk board, and goes down after the last. Contact: he and the dog walk out to the public
// terminal. The hero: him and the dog in the shelter, the cog door rolled aside.

export type SceneId = 'hero' | SectionId | 'contact'

type Layout = PropLayout

/** Him in a frame: where his boots are, his size, his pose and how visible he is. */
export type DwellerState = FigureState<DwellerPose>

export interface SceneDef {
  zone: Zone
  /** His kit in the scene; null takes the profession the page shows. */
  kit: Profession | null
  /** Whether he holds the bakelite radio. */
  radio?: boolean
  /** The props behind him and in front of him, drawn in the figure layer. */
  back: (layout: Layout) => ReactNode
  front: (layout: Layout) => ReactNode
  bind: (stage: StageNodes, layout: Layout) => FigureWriter<DwellerPose>
}

// The band the props stand in: right of the text column on a wide screen, the middle a phone shows.
const BAND: Record<'wide' | 'phone', readonly [number, number]> = { wide: [760, 1240], phone: [580, 860] }

const K = 1.5
const NONE = (): ReactNode => null

// He comes in from this far left of the first prop as its card nears the reading line.
const ENTRY = 200

const travel = (xs: readonly number[], f: number, offset: number) => walkAlong(xs, f, offset, ENTRY)

const dweller = (zone: Zone, x: number, pose: DwellerPose, k = K, opacity = 1): DwellerState => ({ x, y: GROUND[zone], k, pose, opacity })

/** His walk while he is between props, his act at one. */
const walkOr = (act: number, f: number, p: number, acting: DwellerPose): DwellerPose => mix(walk(f * 3 + p * 2), acting, act)

// ---------------------------------------------------------------- the dog, a second figure some scenes hold

const DOG_K = 1.3

/** The dog's group in its 120 by 80 viewBox, feet on y 69, placed at `x` on the ground by the writer. */
function Dog({ zone, x }: { zone: Zone; x: number }) {
  return (
    <g data-fx="dog" transform={`translate(${r1(x)} ${GROUND[zone]})`}>
      <svg x={-60 * DOG_K} y={-69 * DOG_K} width={120 * DOG_K} height={80 * DOG_K} viewBox="0 0 120 80" overflow="visible">
        <DogFigure />
      </svg>
    </g>
  )
}

/** The dog's writer: where he stands and his pose. */
function dogWriter(stage: StageNodes, zone: Zone): (x: number, pose: DogPose) => void {
  const group = fx(stage, 'dog')
  const joints = group && dogJoints(group)
  return (x, pose) => {
    transformTo(group, `translate(${r1(x)} ${GROUND[zone]})`)
    if (joints) setDogPose(joints, pose)
  }
}

// ---------------------------------------------------------------- the hero

const DOOR = 320

// Where the door, he and the dog stand: right of the wrist terminal on a wide screen, in the middle a phone shows.
const HERO_AT = { wide: { door: 760, him: 1180, dog: 1330 }, phone: { door: 520, him: 760, dog: 880 } }

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
  front: ({ phone }) => <Dog zone="shelter" x={HERO_AT[phone ? 'phone' : 'wide'].dog} />,
  bind: (stage, { phone }) => {
    const door = fx(stage, 'door')
    const dog = dogWriter(stage, 'shelter')
    const at = HERO_AT[phone ? 'phone' : 'wide']
    return (p) => {
      // the door has rolled aside from the opening: as the page moves on it rolls a little further on its track
      transformTo(door, doorAt(at.door, p))
      dog(at.dog, SITTING)
      return dweller('shelter', at.him, { ...STAND, rise: -1.5 * Math.sin(p * 12) }, phone ? 1.9 : 2.1)
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
        <g key={x} transform={`translate(${r1(x)} ${POSTER_Y})`}>
          <rect x={-44} y={-62} width={88} height={124} fill={CREAM} stroke={POSTER_INK} strokeWidth={4} />
          <g data-fx={`poster-${i}`} opacity={0.2}>
            <rect x={-36} y={-54} width={72} height={70} fill={SHELTER_YELLOW} />
            <path d="M-12 -2 V-34 Q-12 -42 -4 -42 Q2 -42 2 -34 V-18 H14 Q20 -18 20 -10 V8 Q20 14 12 14 H-12 Z" fill={POSTER_BLUE} stroke={POSTER_INK} strokeWidth={3} />
            <rect x={-30} y={26} width={60} height={8} fill={POSTER_BLUE} />
            <rect x={-22} y={40} width={44} height={6} fill={WARNING_RED} />
          </g>
        </g>
      ))}
    </>
  ),
  front: NONE,
  bind: (stage, { xs, count }) => {
    const posters = fxs(stage, 'poster', count)
    return (p, f) => {
      posters.forEach((poster, i) => fadeTo(poster, 0.2 + 0.8 * reached(f, i)))
      const { x, act } = travel(xs, f, -100)
      return dweller('shelter', x, walkOr(act, f, p, thumbsUp(1)))
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
        <g key={x} transform={`translate(${r1(x)} ${GROUND.wasteland})`}>
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
      flags.forEach((flag, i) => transformTo(flag, `translate(0 ${r1(-(FLAG_POLE - 66) * reached(f, i))})`))
      const { x, act } = travel(xs, f, -90)
      return dweller('wasteland', x, walkOr(act, f, p, typing(1, f * 4)))
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
        <g key={x} transform={`translate(${r1(x)} ${GROUND.wasteland})`}>
          <rect data-fx={`glow-${i}`} x={-36} y={-58} width={72} height={10} fill={PHOSPHOR} opacity={0} />
          <rect x={-40} y={-50} width={80} height={50} rx={3} fill={OLIVE} stroke={POSTER_INK} strokeWidth={3} />
          <path d="M-40 -34 H40 M-40 -16 H40" stroke={OLIVE_DARK} strokeWidth={3} />
          <rect x={-8} y={-46} width={16} height={12} fill={BRASS} stroke={POSTER_INK} strokeWidth={2} />
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
    return (p, f) => {
      lids.forEach((lid, i) => transformTo(lid, `rotate(${r1(-118 * reached(f, i))} -42 -48)`))
      glows.forEach((glow, i) => fadeTo(glow, reached(f, i)))
      const { x, act } = travel(xs, f, -70)
      return dweller('wasteland', x, walkOr(act, f, p, hoist(Math.sin(Math.PI * Math.min(1, act)))))
    }
  },
}

// ---------------------------------------------------------------- Services: the dead tubes

const services: SceneDef = {
  zone: 'wasteland',
  kit: 'engineer',
  back: ({ xs }) => (
    <>
      {xs.map((x, i) => (
        <g key={x} transform={`translate(${r1(x)} ${GROUND.wasteland})`}>
          <rect x={-6} y={-90} width={12} height={90} fill={STEEL} />
          <rect x={-46} y={-170} width={92} height={84} rx={10} fill={BAKELITE} stroke={POSTER_INK} strokeWidth={3} />
          <rect x={-36} y={-160} width={72} height={60} rx={8} fill={GLASS} />
          <g data-fx={`tube-${i}`} opacity={0.08}>
            <rect x={-36} y={-160} width={72} height={60} rx={8} fill={PHOSPHOR} fillOpacity={0.35} />
            <path d="M-26 -146 H20 M-26 -132 H26 M-26 -118 H6" stroke={PHOSPHOR} strokeWidth={4} />
          </g>
          <rect data-fx={`line-${i}`} x={-36} y={-131} width={72} height={2} fill={PHOSPHOR} />
        </g>
      ))}
    </>
  ),
  front: NONE,
  bind: (stage, { xs, count }) => {
    const tubes = fxs(stage, 'tube', count)
    const lines = fxs(stage, 'line', count)
    return (p, f) => {
      tubes.forEach((tube, i) => fadeTo(tube, 0.08 + 0.92 * reached(f, i)))
      lines.forEach((line, i) => fadeTo(line, 1 - reached(f, i)))
      const { x, act } = travel(xs, f, -110)
      // the boot to the set: the kick lands as he reaches it, then he draws the leg back
      return dweller('wasteland', x, walkOr(act, f, p, kick(Math.sin(Math.PI * Math.min(1, act)))))
    }
  },
}

// ---------------------------------------------------------------- Projects: the target boards

const TARGET_Y = 560

const projects: SceneDef = {
  zone: 'wasteland',
  kit: null,
  back: ({ xs }) => (
    <>
      {xs.map((x, i) => (
        <g key={x} transform={`translate(${r1(x + 60)} ${TARGET_Y})`}>
          <path d={`M-4 40 V${GROUND.wasteland - TARGET_Y}`} stroke={POLE} strokeWidth={6} />
          <circle r={42} fill={CREAM} stroke={POSTER_INK} strokeWidth={3} />
          <circle r={28} fill={WARNING_RED} />
          <circle r={14} fill={CREAM} />
          <circle data-fx={`hit-${i}`} r={6} fill={POSTER_INK} opacity={0} />
          <g data-fx={`lock-${i}`} opacity={0} stroke={PHOSPHOR} strokeWidth={4} fill="none">
            <path d="M-54 -38 V-54 H-38 M38 -54 H54 V-38 M54 38 V54 H38 M-38 54 H-54 V38" />
          </g>
        </g>
      ))}
    </>
  ),
  front: NONE,
  bind: (stage, { xs, count }) => {
    const hits = fxs(stage, 'hit', count)
    const locks = fxs(stage, 'lock', count)
    return (p, f) => {
      hits.forEach((hit, i) => fadeTo(hit, ramp(f, i + 0.45, i + 0.55)))
      const { x, at, act } = travel(xs, f, -110)
      locks.forEach((lock, i) => fadeTo(lock, i === at ? act : 0))
      // the shot at the middle of his stop: the recoil and the flash
      const shot = act * Math.max(0, 1 - Math.abs(f - (at + 0.5)) * 8)
      return dweller('wasteland', x, walkOr(act, f, p, aim(1, shot)))
    }
  },
}

// ---------------------------------------------------------------- Ventures: the dog digs the holotapes

const ventures: SceneDef = {
  zone: 'town',
  kit: null,
  back: ({ xs }) => (
    <>
      {xs.map((x, i) => (
        <g key={x} transform={`translate(${r1(x + 50)} ${GROUND.town})`}>
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
  front: ({ xs }) => <Dog zone="town" x={xs[0]} />,
  bind: (stage, { xs, count }) => {
    const tapes = fxs(stage, 'tape', count)
    const dog = dogWriter(stage, 'town')
    return (p, f) => {
      tapes.forEach((tape, i) => transformTo(tape, `translate(0 ${r1(lerp(10, -70, reached(f, i) ** 2))})`))
      const pup = travel(xs, f, 0)
      dog(pup.x, { stride: trot(f * 3 + p * 2).stride * pup.moving, sit: 0, dig: pup.act })
      // he follows the dog a few steps behind and cheers each tape up
      const { x, act } = travel(xs, f, -150)
      return dweller('town', x, walkOr(act, f, p, thumbsUp(1)))
    }
  },
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
      lamps.forEach((lamp, i) => fadeTo(lamp, 0.15 + 0.85 * reached(f, i)))
      return dweller('town', cx - 40, sway(f * 4 + p * 3))
    }
  },
}

// ---------------------------------------------------------------- Muay Thai: the mutant

const FOE_K = 1.6
const STAR_Y = 260

const muayThai: SceneDef = {
  zone: 'town',
  kit: 'fighter',
  back: ({ xs }) => (
    <>
      {xs.map((x, i) => (
        <g key={x} transform={`translate(${r1(x)} ${STAR_Y})`}>
          <path d="M0 -26 L7 -8 L26 -8 L11 4 L17 23 L0 12 L-17 23 L-11 4 L-26 -8 L-7 -8 Z" fill={INK} stroke={SHELTER_YELLOW} strokeWidth={3} />
          <path data-fx={`star-${i}`} d="M0 -20 L5 -6 L20 -6 L8 3 L13 18 L0 9 L-13 18 L-8 3 L-20 -6 L-5 -6 Z" fill={SHELTER_YELLOW} opacity={0} />
        </g>
      ))}
    </>
  ),
  front: ({ cx }) => (
    <g data-fx="foe" transform={`translate(${r1(cx + 70)} ${GROUND.town})`}>
      <svg x={-66 * FOE_K} y={-146 * FOE_K} width={120 * FOE_K} height={150 * FOE_K} viewBox="0 0 120 150" overflow="visible">
        <MutantFigure />
      </svg>
      <path data-fx="burst" d="M-74 -150 L-60 -132 L-80 -124 L-58 -118 L-66 -98 L-48 -112 L-36 -94 L-38 -118 L-18 -122 L-40 -132 L-30 -150 L-50 -138 Z" fill={SHELTER_YELLOW} stroke={POSTER_INK} strokeWidth={3} opacity={0} />
    </g>
  ),
  bind: (stage, { count, cx }) => {
    const stars = fxs(stage, 'star', count)
    const foe = fx(stage, 'foe')
    const joints = foe && foeJoints(foe)
    const burst = fx(stage, 'burst')
    return (p, f) => {
      stars.forEach((star, i) => fadeTo(star, ramp(f, i + 0.45, i + 0.6)))
      const at = Math.min(count - 1, Math.max(0, Math.floor(f)))
      const beat = Math.sin(Math.PI * Math.min(1, Math.max(0, f - at)))
      const kneeing = at % 2 === 0
      const done = ramp(f, count - 0.2, count)
      const strike = f > 0 && f < count ? beat : 0
      const reaction = ramp(strike, 0.6, 1)
      if (joints) setFoePose(joints, mixFoe(mixFoe(FOE_GUARD, kneeing ? FOE_KNEED : FOE_KICKED, reaction), FOE_DOWN, done))
      fadeTo(burst, reaction)
      const pose = done > 0 ? mix(GUARD, thumbsUp(1), done) : mix(GUARD, kneeing ? knee(strike) : kick(strike), Math.min(1, strike * 2))
      return dweller('town', cx - 70 + 30 * strike, pose)
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
  front: ({ cx }) => <Dog zone="town" x={cx - 300} />,
  bind: (stage, { cx }) => {
    const screen = fx(stage, 'screen')
    const dog = dogWriter(stage, 'town')
    return (p) => {
      const there = ramp(p, 0.2, 0.5)
      const x = lerp(cx - 420, cx + 10, there)
      const moving = there > 0 && there < 1 ? 1 : 0
      fadeTo(screen, 0.2 + 0.8 * ramp(p, 0.5, 0.6))
      dog(x - 130, moving ? trot(p * 12) : SITTING)
      const pose = moving ? walk(p * 12) : mix(STAND, typing(1, p * 8), ramp(p, 0.5, 0.58))
      return dweller('town', x, pose)
    }
  },
}

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

