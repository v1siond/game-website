import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import type { Labels } from '@/lib/cv/labels'
import { stageItems, type StageItems } from '@/lib/cv/stageItems'
import { drop, hop } from '@/lib/motion/arc'
import { mix, walk } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { trackAt, trackEase } from '@/lib/scroll/track'
import { clamp01, fadeTo, focusOn, fx, lerp, r1, transformTo, translateTo } from '../shared/stageNodes'
import { fxs, propLayout, type FigureState, type FigureWriter, type PropLayout, type StageNodes } from '../shared/figureScene'
import { FIGURE_STAND, type FigurePose } from './character'
import { COLORS as C } from './palette'
import { GROUND, type Zone } from './zones'

// Each part of the page as a level of the jungle run: its place (the cliffs, the giant tree, the canopy, the
// riverbank, the temple ruins, the lagoon, the river at dusk, the clearing, the beach at night), his kit, and
// one stop per card the section counts. He holds his place while the jungle slides under him: as each card
// is read the jungle runs one spacing to bring its stop (the run, his stride), then he makes the genre's
// move there and the stop answers it (the beat), held once done; scroll up plays it back (the shared
// trackAt). About: he jumps, hangs from a rock ledge and pulls himself up, and a flower opens beside him.
// Work: he climbs the vine to the next deck of the giant tree and its lantern lights (the tree slides down
// as he climbs). Tech: he whirls his sling at a coconut high in a palm; it drops and splits on a gem.
// Services: he pushes a boulder off the bank and it splashes in as a stepping stone. Projects: he hangs his
// weight on the temple's stone lever and the door grinds up. Ventures: he dives into the lagoon, swims to a
// sunken chest and comes up with its pearl. Bands: he treads a floating log, each step a note, the frogs
// hopping. Muay Thai: a swing kick from a branch at a hanging sack, then his knee. Contact: he rides the
// zip line down to the beach camp and its fire lights. The hero: him by his stilt hut at sunset, a frond
// swaying once.
//
// He is the jungle hero of character.tsx on the shared rig: every limb turns at its joint.

export type SceneId = 'hero' | SectionId | 'contact'

type Layout = PropLayout

/** Him in a frame: where his feet are, his size, his pose and how visible he is. */
export type FigureFrame = FigureState<FigurePose>

export interface SceneDef {
  zone: Zone
  /** His kit in the scene; null takes the profession the page shows. */
  kit: Profession | null
  /** The stops behind him, drawn in the figure layer. */
  back: (layout: Layout) => ReactNode
  /** What stands in front of him (the water he swims in). */
  front?: (layout: Layout) => ReactNode
  bind: (stage: StageNodes, layout: Layout) => FigureWriter<FigurePose>
}

// The middle of the band the scenes play in: right of the text column on a wide screen, the middle a phone shows.
const BAND: Record<'wide' | 'phone', readonly [number, number]> = { wide: [880, 1320], phone: [560, 880] }

/** His size on the canvas: his 170 unit box about a quarter of the screen. */
const K = 1.7

/** Where he holds his place: right of the text on a wide screen, left of the middle on a phone. */
const holdOf = ({ phone }: Layout): number => (phone ? 560 : 860)

/** The stops stand this far apart; the next one waits one spacing ahead of him. */
const SPACING = 600

/** His stride on the run between stops: a whole number of steps per spacing, so a run ends standing. */
const STRIDE = 75

// How far the view pushes in at a full push.
const PUSH = 0.1

const EDGE = C.shadow

const frame = (x: number, pose: FigurePose, k = K, lift = 0): FigureFrame => ({ x, y: GROUND - lift, k, pose, opacity: 1 })

/** A pose from the standing one with `turns` changed. */
const posed = (turns: Partial<FigurePose>): FigurePose => ({ ...FIGURE_STAND, ...turns })

/** The bell a push follows over a move: 0, up to 1 at `at`, back to 0 `width` either side. */
const bell = (t: number, at: number, width = 0.1): number => clamp01(1 - Math.abs(t - at) / width)

/** A wobble that settles: `0` at the start and the end of its time t. */
const wobble = (t: number): number => (t <= 0 || t >= 1 ? 0 : Math.sin(2 * Math.PI * t) * (1 - t))

// ---------------------------------------------------------------- his poses

const CROUCH = posed({ rise: 8, thighRight: -18, shinRight: 30, thighLeft: 18, shinLeft: -30, armRight: 20, armLeft: -20 })
const ARMS_UP = { armRight: -172, armLeft: 172 }
const HANG = posed({ ...ARMS_UP, thighRight: -8, thighLeft: 8 })
const GUARD = posed({ armRight: -40, foreRight: -120, armLeft: 40, foreLeft: 120 })

/** His climb up a vine: the hands reach over each other, the knees grip in turn. */
const climb = (phase: number): FigurePose => {
  const swing = Math.sin(phase * Math.PI)
  return posed({ armRight: -150 - 25 * swing, foreRight: -20, armLeft: 150 - 25 * swing, foreLeft: 20, thighRight: -30 * Math.max(0, swing), shinRight: 50 * Math.max(0, swing), thighLeft: 30 * Math.max(0, -swing), shinLeft: -50 * Math.max(0, -swing) })
}

// ---------------------------------------------------------------- the stops writer

/** Him at a moment of a move: his pose, how far ahead of his place and above the floor. */
interface Him {
  pose: FigurePose
  ahead: number
  lift?: number
}

/** A key of a move: by `at` (0 to 1 of the move) he is in `pose`, `ahead` and `lift` up, having got there
 *  over an arc `arc` high; the first key is where the move starts. */
interface Key extends Him {
  at: number
  arc?: number
}

/** A move from its keys in order of `at`: between two keys every number eases from one to the next; after
 *  the last he holds it. */
function keyed(keys: readonly Key[]): (t: number) => Him {
  return (t) => {
    const next = keys.findIndex((key) => key.at > t)
    if (next === -1) return keys[keys.length - 1]
    const from = keys[Math.max(0, next - 1)]
    const to = keys[next]
    const u = next === 0 ? 0 : ramp(t, from.at, to.at)
    const e = trackEase(u)
    return { pose: mix(from.pose, to.pose, e), ahead: lerp(from.ahead, to.ahead, e), lift: lerp(from.lift ?? 0, to.lift ?? 0, e) + hop(u, to.arc ?? 0) }
  }
}

const STAND: Him = { pose: FIGURE_STAND, ahead: 0 }

/** How he gets to the next stop: walking along the ground, climbing while the tree slides down, or
 *  jumping from one floating log to the next. */
type Run = 'walk' | 'climb' | 'leap'

const RUN_POSE: Record<Run, (offset: number) => FigurePose> = {
  walk: (offset) => posed(walk(offset / STRIDE, 0)),
  climb: (offset) => climb(offset / STRIDE),
  leap: () => CROUCH,
}

/** The run between beats: out of the last move's held end, back to his place. */
function runOf(before: Him, run: number, offset: number, kind: Run): Him {
  if (run <= 0) return before
  const out = ramp(run, 0, 0.4)
  return {
    pose: mix(before.pose, RUN_POSE[kind](offset), trackEase(out)),
    ahead: lerp(before.ahead, 0, out),
    lift: lerp(before.lift ?? 0, 0, out) + (kind === 'leap' ? hop(run, 90) : 0),
  }
}

interface StopsDef {
  zone: Zone
  kit: Profession | null
  /** A card's stop, drawn round the spot where he makes his move (x 0 his place, y 0 the floor). */
  stop: (i: number) => ReactNode
  /** What of a stop stands in front of him. */
  over?: (i: number) => ReactNode
  /** The way the run goes: along the ground (the default), up the tree, from log to log. */
  run?: Run
  /** His move at a stop, `t` of the way; t 1 is its held end. */
  move: (t: number) => Him
  /** How far the view pushes in over his move. */
  push?: (t: number) => number
  /** Binds the stops' answers; the writer takes how far each card's answer has played, 0 to 1. */
  reply: (stage: StageNodes, count: number) => (played: (i: number) => number) => void
}

/** A stop's place on the course: along it, or up it for a climb. */
const stopAt = (hold: number, i: number, up: boolean): string => (up ? `translate(${hold} ${GROUND - SPACING * (i + 1)})` : `translate(${hold + SPACING * (i + 1)} ${GROUND})`)

function Course({ name, layout, up, art }: { name: string; layout: Layout; up: boolean; art: (i: number) => ReactNode }) {
  return (
    <g data-fx={name}>
      {Array.from({ length: Math.max(1, layout.count) }, (_, i) => (
        <g key={i} transform={stopAt(holdOf(layout), i, up)}>
          {art(i)}
        </g>
      ))}
    </g>
  )
}

const stopsScene = ({ zone, kit, stop, over, run = 'walk', move, push, reply }: StopsDef): SceneDef => {
  const up = run === 'climb'
  return {
    zone,
    kit,
    back: (layout) => <Course name="course" layout={layout} up={up} art={stop} />,
    front: over && ((layout) => <Course name="course-over" layout={layout} up={up} art={over} />),
    bind: (stage, layout) => {
      const count = Math.max(1, layout.count)
      const hold = holdOf(layout)
      const courses = [fx(stage, 'course'), fx(stage, 'course-over')]
      const camera = fx(stage, 'camera')
      const answers = reply(stage, count)
      return (_p, f) => {
        const beat = trackAt(f, count, SPACING)
        courses.forEach((course) => (up ? translateTo(course, 0, beat.offset) : translateTo(course, -beat.offset, 0)))
        answers((i) => (i < beat.at ? 1 : i === beat.at ? beat.act : 0))
        const him = beat.act > 0 ? move(beat.act) : runOf(beat.at > 0 ? move(1) : STAND, beat.run, beat.offset, run)
        const x = hold + him.ahead
        const lift = him.lift ?? 0
        const pushed = beat.act > 0 && push ? push(beat.act) : 0
        transformTo(camera, pushed > 0 ? focusOn(x + 60, GROUND - lift - 140, 1 + PUSH * pushed) : '')
        return frame(x, him.pose, K, lift)
      }
    },
  }
}

/** A thing's two looks: the first shown until `on`, then the second. */
const shown = (first: Element | null, second: Element | null, on: boolean): void => {
  fadeTo(first, on ? 0 : 1)
  fadeTo(second, on ? 1 : 0)
}

// ---------------------------------------------------------------- the stops' art

const Rock = ({ x, width, height }: { x: number; width: number; height: number }) => (
  <>
    <path d={`M${x} 0 V${-height + 14} Q${x} ${-height} ${x + 14} ${-height} H${x + width - 14} Q${x + width} ${-height} ${x + width} ${-height + 14} V0 Z`} fill={C.stone} stroke={EDGE} strokeWidth={4} />
    <path d={`M${x + 10} ${-height + 4} H${x + width - 10}`} stroke={C.fern} strokeWidth={8} strokeLinecap="round" />
    <path d={`M${x + 30} ${-height * 0.6} L${x + 70} ${-height * 0.55} M${x + width - 60} ${-height * 0.3} L${x + width - 20} ${-height * 0.34}`} stroke={C.stoneDark} strokeWidth={4} strokeLinecap="round" />
  </>
)

const Bloom = ({ name }: { name: string }) => (
  <g data-fx={name} transform="scale(0)">
    <use href="#tp-bloom" transform="scale(0.9)" />
  </g>
)

const Deck = () => (
  <>
    <rect x={-80} y={-4} width={300} height={22} rx={4} fill={C.plank} stroke={EDGE} strokeWidth={4} />
    <rect x={250} y={-SPACING} width={70} height={SPACING + 18} fill={C.bark} stroke={EDGE} strokeWidth={4} />
    <path d={`M0 ${SPACING} C-14 ${SPACING * 0.66} 12 ${SPACING * 0.33} 0 0`} fill="none" stroke={C.moss} strokeWidth={8} strokeLinecap="round" />
    <path d="M150 18 V90" stroke={EDGE} strokeWidth={3} />
  </>
)

const Lantern = ({ lit }: { lit: boolean }) => <rect x={136} y={90} width={28} height={36} rx={6} fill={lit ? C.lamp : C.stoneDark} stroke={EDGE} strokeWidth={3} />

const Coconut = () => <circle r={22} fill={C.husk} stroke={EDGE} strokeWidth={3} />

const Gem = () => <path d="M0 -16 L12 0 L0 16 L-12 0 Z" fill={C.gem} stroke={EDGE} strokeWidth={3} strokeLinejoin="round" />

const Stone = () => <circle r={7} fill={C.stoneDark} stroke={EDGE} strokeWidth={2} />

const River = ({ from, to }: { from: number; to: number }) => (
  <>
    <rect x={from} y={-4} width={to - from} height={190} fill={C.water} />
    <path d={`M${from + 20} 30 H${from + 90} M${to - 120} 70 H${to - 40}`} stroke={C.sunCore} strokeWidth={4} strokeLinecap="round" opacity={0.5} />
  </>
)

const Boulder = () => (
  <>
    <circle r={55} fill={C.stone} stroke={EDGE} strokeWidth={4} />
    <path d="M-30 -14 Q-10 -30 12 -20 M10 18 Q24 10 30 -4" fill="none" stroke={C.stoneDark} strokeWidth={4} strokeLinecap="round" />
  </>
)

const Splash = () => (
  <>
    {[-50, -20, 20, 50].map((x) => (
      <circle key={x} cx={x} cy={-30 - Math.abs(x) * 0.4} r={9} fill={C.sunCore} opacity={0.8} />
    ))}
  </>
)

const TEMPLE = { x: 170, width: 320, height: 340, door: { x: 280, width: 100, height: 170 } }

const Temple = () => (
  <>
    <rect x={TEMPLE.x} y={-TEMPLE.height} width={TEMPLE.width} height={TEMPLE.height} fill={C.stone} stroke={EDGE} strokeWidth={4} />
    <path d={`M${TEMPLE.x - 20} ${-TEMPLE.height} H${TEMPLE.x + TEMPLE.width + 20} L${TEMPLE.x + TEMPLE.width - 30} ${-TEMPLE.height - 50} H${TEMPLE.x + 30} Z`} fill={C.stoneDark} stroke={EDGE} strokeWidth={4} />
    <rect x={TEMPLE.door.x} y={-TEMPLE.door.height} width={TEMPLE.door.width} height={TEMPLE.door.height} fill={C.lamp} opacity={0.8} />
    <path d={`M${TEMPLE.x} -120 H${TEMPLE.door.x} M${TEMPLE.door.x + TEMPLE.door.width} -220 H${TEMPLE.x + TEMPLE.width}`} stroke={C.stoneDark} strokeWidth={4} />
    <rect x={10} y={-300} width={40} height={300} fill={C.stoneDark} stroke={EDGE} strokeWidth={4} />
  </>
)

const Door = () => <rect x={TEMPLE.door.x} y={-TEMPLE.door.height} width={TEMPLE.door.width} height={TEMPLE.door.height} fill={C.stoneDark} stroke={EDGE} strokeWidth={4} />

/** The temple's lever, turning round its pin on the post: the handle at the far end. */
const LEVER = { pin: { x: 30, y: -300 }, length: 100, from: -32, to: 28 }

const Lever = () => (
  <>
    <rect x={0} y={-8} width={LEVER.length} height={16} rx={6} fill={C.bark} stroke={EDGE} strokeWidth={4} />
    <circle cx={LEVER.length} r={12} fill={C.plank} stroke={EDGE} strokeWidth={4} />
    <circle r={8} fill={C.stone} stroke={EDGE} strokeWidth={3} />
  </>
)

const Chest = ({ open }: { open: boolean }) => (
  <>
    <rect x={-40} y={-40} width={80} height={40} rx={4} fill={C.bark} stroke={EDGE} strokeWidth={4} />
    <path d={open ? 'M-40 -40 L-30 -84 H30 L40 -40' : 'M-40 -40 Q0 -64 40 -40 Z'} fill={C.plank} stroke={EDGE} strokeWidth={4} strokeLinejoin="round" />
    <rect x={-6} y={-30} width={12} height={12} fill={C.sunGold} stroke={EDGE} strokeWidth={2} />
  </>
)

const Pearl = () => <circle r={12} fill={C.parchment} stroke={EDGE} strokeWidth={3} />

const Log = () => (
  <>
    <rect x={-110} y={-18} width={220} height={38} rx={19} fill={C.bark} stroke={EDGE} strokeWidth={4} />
    <ellipse cx={110} cy={1} rx={12} ry={19} fill={C.plank} stroke={EDGE} strokeWidth={3} />
  </>
)

const Grain = () => <path d="M-80 -4 H-30 M-10 8 H50 M60 -6 H90" stroke={C.barkDark} strokeWidth={4} strokeLinecap="round" />

const Pad = ({ x }: { x: number }) => <ellipse cx={x} cy={6} rx={40} ry={10} fill={C.fern} stroke={EDGE} strokeWidth={3} />

const Frog = () => (
  <>
    <ellipse cy={-12} rx={18} ry={13} fill={C.moss} stroke={EDGE} strokeWidth={3} />
    <circle cx={-8} cy={-24} r={5} fill={C.parchment} stroke={EDGE} strokeWidth={2} />
    <circle cx={8} cy={-24} r={5} fill={C.parchment} stroke={EDGE} strokeWidth={2} />
  </>
)

const Note = () => (
  <>
    <ellipse cx={-6} rx={9} ry={7} fill={C.sunCore} transform="rotate(-20 -6 0)" />
    <path d="M2 -2 V-34 L16 -26" fill="none" stroke={C.sunCore} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
  </>
)

const BRANCH = -330

const Branch = () => (
  <>
    <rect x={300} y={-560} width={60} height={560} fill={C.bark} stroke={EDGE} strokeWidth={4} />
    <path d={`M-60 ${BRANCH} H310`} stroke={EDGE} strokeWidth={22} strokeLinecap="round" />
    <path d={`M-60 ${BRANCH} H310`} stroke={C.bark} strokeWidth={16} strokeLinecap="round" />
  </>
)

const Sack = () => (
  <>
    <path d="M0 0 V70" stroke={EDGE} strokeWidth={4} />
    <path d="M-34 70 Q-40 150 -20 210 H20 Q40 150 34 70 Z" fill={C.husk} stroke={EDGE} strokeWidth={4} strokeLinejoin="round" />
    <path d="M-30 100 H30" stroke={C.plank} strokeWidth={5} />
  </>
)

// ---------------------------------------------------------------- the hero

const HERO_AT = { wide: { hut: 180, frond: 1440, him: 1180 }, phone: { hut: 470, frond: 1000, him: 820 } }

const Hut = () => (
  <>
    <path d="M10 0 V-150 M130 0 V-150" stroke={EDGE} strokeWidth={14} />
    <rect x={-10} y={-170} width={160} height={20} rx={4} fill={C.shadowSoft} />
    <rect x={10} y={-260} width={120} height={92} fill={C.shadowSoft} />
    <path d="M-20 -256 L70 -330 L160 -256 Z" fill={EDGE} />
    <rect x={56} y={-228} width={30} height={60} fill={C.lamp} opacity={0.7} />
  </>
)

const hero: SceneDef = {
  zone: 'sunset',
  kit: null,
  back: ({ phone }) => {
    const at = HERO_AT[phone ? 'phone' : 'wide']
    return (
      <>
        <g transform={`translate(${at.hut} ${GROUND})`}>
          <Hut />
        </g>
        <g data-fx="frond" transform={`translate(${at.frond} 120)`}>
          <use href="#tp-frond" transform="scale(-1 1) rotate(60) scale(2.6)" />
        </g>
      </>
    )
  },
  bind: (stage, { phone }) => {
    const frond = fx(stage, 'frond')
    const at = HERO_AT[phone ? 'phone' : 'wide']
    return (p) => {
      // the frond sways once in the evening wind as the page moves on
      transformTo(frond, `translate(${at.frond} 120) rotate(${r1(10 * wobble(ramp(p, 0, 0.45)))})`)
      return frame(at.him, FIGURE_STAND, phone ? 1.9 : 2.2)
    }
  },
}

// ---------------------------------------------------------------- the sections

// About: the ledge. He crouches, jumps and catches the ledge's lip, hangs, swings a leg up and pulls
// himself over; the flower on the ledge opens at BLOOM.
const ABOUT = { rock: { x: 70, width: 300, height: 260 }, flower: 260, bloom: [0.62, 0.82] as const }

const about = stopsScene({
  zone: 'jungle',
  kit: null,
  stop: (i) => (
    <>
      <Rock {...ABOUT.rock} />
      <g transform={`translate(${ABOUT.flower} ${-ABOUT.rock.height})`}>
        <path d="M0 0 V-40" stroke={C.moss} strokeWidth={6} />
        <g transform="translate(0 -40)">
          <Bloom name={`bloom-${i}`} />
        </g>
      </g>
    </>
  ),
  move: keyed([
    { at: 0, ...STAND },
    { at: 0.12, pose: CROUCH, ahead: 0 },
    { at: 0.28, pose: HANG, ahead: 80, lift: 90, arc: 40 },
    { at: 0.4, pose: posed({ ...ARMS_UP, thighRight: -70, shinRight: 70, thighLeft: 10 }), ahead: 85, lift: 120 },
    { at: 0.52, pose: CROUCH, ahead: 140, lift: ABOUT.rock.height },
    { at: 0.6, pose: FIGURE_STAND, ahead: 150, lift: ABOUT.rock.height },
  ]),
  reply: (stage, count) => {
    const blooms = fxs(stage, 'bloom', count)
    return (played) =>
      blooms.forEach((bloom, i) => {
        const g = ramp(played(i), ABOUT.bloom[0], ABOUT.bloom[1])
        const w = 0.3 * wobble(g)
        transformTo(bloom, `scale(${(g + w).toFixed(3)} ${(g - w).toFixed(3)})`)
      })
  },
})

// Work: the climb. The tree slides down while he climbs the vine to the next deck; on the deck he steps
// to the lantern and it lights at LIT.
const WORK = { lit: 0.45 }

const work = stopsScene({
  zone: 'treetop',
  kit: 'engineer',
  run: 'climb',
  stop: (i) => (
    <>
      <Deck />
      <g data-fx={`dark-${i}`}>
        <Lantern lit={false} />
      </g>
      <g data-fx={`lit-${i}`} opacity={0}>
        <Lantern lit />
      </g>
    </>
  ),
  move: keyed([
    { at: 0, pose: climb(0), ahead: 0 },
    { at: 0.15, pose: FIGURE_STAND, ahead: 0 },
    { at: 0.32, pose: posed(walk(1, 0)), ahead: 70 },
    { at: WORK.lit, pose: posed({ armRight: -60, foreRight: -40 }), ahead: 100 },
    { at: 0.6, pose: FIGURE_STAND, ahead: 100 },
  ]),
  reply: (stage, count) => {
    const lamps = fxs(stage, 'dark', count).map((dark, i) => ({ dark, lit: fx(stage, `lit-${i}`) }))
    return (played) => lamps.forEach(({ dark, lit }, i) => shown(dark, lit, played(i) >= WORK.lit))
  },
})

// Tech: the sling. He loads a stone, whirls it twice over his head and lets fly at the coconut high in the
// palm; it drops, splits and the gem rolls out.
const TECH = { palm: 300, nut: { x: 270, y: -300 }, whirl: [0.15, 0.36] as const, fly: [0.36, 0.48] as const, fall: [0.48, 0.62] as const }

const tech = stopsScene({
  zone: 'jungle',
  kit: 'engineer',
  stop: (i) => (
    <>
      <use href="#tp-palm" transform={`translate(${TECH.palm} 0) scale(1.8)`} />
      <g data-fx={`gem-${i}`} opacity={0}>
        <Gem />
      </g>
      <g data-fx={`nut-${i}`}>
        <Coconut />
      </g>
      <g data-fx={`stone-${i}`} opacity={0}>
        <Stone />
      </g>
    </>
  ),
  move: keyed([
    { at: 0, ...STAND },
    { at: 0.1, pose: posed({ armRight: 20, armLeft: -30, foreLeft: -40 }), ahead: 0 },
    { at: 0.2, pose: posed({ armRight: -175, foreRight: -10, lean: -4 }), ahead: 0 },
    { at: 0.28, pose: posed({ armRight: -150, foreRight: -40, lean: -4 }), ahead: 0 },
    { at: TECH.fly[0], pose: posed({ armRight: -110, lean: 6, thighRight: -10 }), ahead: 10 },
    { at: 0.5, pose: posed({ armRight: -60 }), ahead: 10 },
    { at: 0.62, pose: FIGURE_STAND, ahead: 10 },
  ]),
  push: (t) => bell(t, TECH.fly[1]),
  reply: (stage, count) => {
    const stops = fxs(stage, 'nut', count).map((nut, i) => ({ nut, stone: fx(stage, `stone-${i}`), gem: fx(stage, `gem-${i}`) }))
    return (played) =>
      stops.forEach(({ nut, stone, gem }, i) => {
        const t = played(i)
        const whirl = ramp(t, TECH.whirl[0], TECH.whirl[1])
        const fly = ramp(t, TECH.fly[0], TECH.fly[1])
        const spin = 4 * Math.PI * whirl
        const sx = whirl < 1 ? 20 + 40 * Math.cos(spin) : lerp(30, TECH.nut.x, fly)
        const sy = whirl < 1 ? -300 + 14 * Math.sin(spin) : lerp(-300, TECH.nut.y, fly) - hop(fly, 30)
        translateTo(stone, sx, sy)
        fadeTo(stone, whirl > 0 && fly < 1 ? 1 : 0)
        const fall = ramp(t, TECH.fall[0], TECH.fall[1])
        const split = ramp(t, TECH.fall[1], TECH.fall[1] + 0.08)
        transformTo(nut, `translate(${TECH.nut.x} ${r1(TECH.nut.y + drop(fall, -TECH.nut.y - 22))}) scale(${(1 - 0.4 * split).toFixed(3)} ${(1 - split).toFixed(3)})`)
        const roll = ramp(t, TECH.fall[1], 0.8)
        transformTo(gem, `translate(${r1(TECH.nut.x - 70 * roll)} -16) rotate(${r1(-200 * roll)})`)
        fadeTo(gem, split > 0 ? 1 : 0)
      })
  },
})

// Services: the boulder. He sets his shoulder to it and pushes it off the bank; it rolls, tips over the
// edge and splashes into the river, where it stays as a stepping stone.
const SERVICES = { from: 110, edge: 220, rest: { x: 330, y: 40 }, roll: [0.15, 0.45] as const, tip: [0.45, 0.6] as const, river: [220, 560] as const }

const services = stopsScene({
  zone: 'jungle',
  kit: 'engineer',
  stop: (i) => (
    <>
      <River from={SERVICES.river[0]} to={SERVICES.river[1]} />
      <g data-fx={`boulder-${i}`} transform={`translate(${SERVICES.from} -55)`}>
        <Boulder />
      </g>
      <g data-fx={`splash-${i}`} opacity={0} transform={`translate(${SERVICES.rest.x} 0)`}>
        <Splash />
      </g>
    </>
  ),
  move: keyed([
    { at: 0, ...STAND },
    { at: 0.12, pose: posed({ lean: 12, armRight: -70, armLeft: -40, rise: 4 }), ahead: 20 },
    { at: 0.3, pose: posed({ lean: 16, armRight: -75, armLeft: -45, thighLeft: 22, thighRight: -10, rise: 4 }), ahead: 70 },
    { at: SERVICES.roll[1], pose: posed({ lean: 16, armRight: -80, armLeft: -50, thighLeft: 22, rise: 4 }), ahead: 110 },
    { at: 0.6, pose: FIGURE_STAND, ahead: 120 },
  ]),
  reply: (stage, count) => {
    const stops = fxs(stage, 'boulder', count).map((boulder, i) => ({ boulder, splash: fx(stage, `splash-${i}`) }))
    return (played) =>
      stops.forEach(({ boulder, splash }, i) => {
        const t = played(i)
        const roll = trackEase(ramp(t, SERVICES.roll[0], SERVICES.roll[1]))
        const tip = ramp(t, SERVICES.tip[0], SERVICES.tip[1])
        const x = lerp(lerp(SERVICES.from, SERVICES.edge, roll), SERVICES.rest.x, tip)
        const y = -55 + drop(tip, 55 + SERVICES.rest.y)
        transformTo(boulder, `translate(${r1(x)} ${r1(y)}) rotate(${r1(((x - SERVICES.from) / 55) * 57)})`)
        const spray = ramp(t, SERVICES.tip[1] - 0.02, SERVICES.tip[1] + 0.14)
        transformTo(splash, `translate(${SERVICES.rest.x} ${r1(-40 * Math.sin(Math.PI * spray))})`)
        fadeTo(splash, spray > 0 && spray < 1 ? 1 : 0)
      })
  },
})

// Projects: the lever. He jumps to the stone lever's handle and hangs his weight on it; it comes down, he
// drops and the temple door grinds up on the light inside.
const PROJECTS = { pull: [0.3, 0.5] as const, door: [0.5, 0.72] as const }

const projects = stopsScene({
  zone: 'dusk',
  kit: 'engineer',
  stop: (i) => (
    <>
      <Temple />
      <g data-fx={`door-${i}`}>
        <Door />
      </g>
      <g data-fx={`lever-${i}`} transform={`translate(${LEVER.pin.x} ${LEVER.pin.y}) rotate(${LEVER.from})`}>
        <Lever />
      </g>
    </>
  ),
  move: keyed([
    { at: 0, ...STAND },
    { at: 0.12, pose: CROUCH, ahead: 0 },
    { at: PROJECTS.pull[0], pose: HANG, ahead: 100, lift: 185, arc: 30 },
    { at: PROJECTS.pull[1], pose: posed({ ...ARMS_UP, thighRight: -14, thighLeft: 14 }), ahead: 112, lift: 115 },
    { at: 0.58, pose: CROUCH, ahead: 112 },
    { at: 0.66, pose: FIGURE_STAND, ahead: 112 },
  ]),
  reply: (stage, count) => {
    const stops = fxs(stage, 'lever', count).map((lever, i) => ({ lever, door: fx(stage, `door-${i}`) }))
    return (played) =>
      stops.forEach(({ lever, door }, i) => {
        const t = played(i)
        transformTo(lever, `translate(${LEVER.pin.x} ${LEVER.pin.y}) rotate(${r1(lerp(LEVER.from, LEVER.to, trackEase(ramp(t, PROJECTS.pull[0], PROJECTS.pull[1]))))})`)
        translateTo(door, 0, -(TEMPLE.door.height - 10) * trackEase(ramp(t, PROJECTS.door[0], PROJECTS.door[1])))
      })
  },
})

// Ventures: the dive. He dives off the bank into the lagoon, swims down to the sunken chest, it opens and
// he comes up treading water with its pearl.
const VENTURES = { chest: { x: 360, y: 150 }, open: 0.55, rise: [0.58, 0.74] as const, lagoon: [140, 900] as const }

const SWIM = posed({ lean: 90, ...ARMS_UP, thighRight: -20, thighLeft: 20 })

const ventures = stopsScene({
  zone: 'jungle',
  kit: 'engineer',
  stop: (i) => (
    <>
      <rect x={VENTURES.lagoon[0]} y={-4} width={VENTURES.lagoon[1] - VENTURES.lagoon[0]} height={200} fill={C.waterDeep} />
      <g transform={`translate(${VENTURES.chest.x} ${VENTURES.chest.y})`}>
        <g data-fx={`shut-${i}`}>
          <Chest open={false} />
        </g>
        <g data-fx={`open-${i}`} opacity={0}>
          <Chest open />
        </g>
      </g>
      <g data-fx={`pearl-${i}`} opacity={0}>
        <Pearl />
      </g>
    </>
  ),
  over: () => (
    <>
      <rect x={VENTURES.lagoon[0]} y={0} width={VENTURES.lagoon[1] - VENTURES.lagoon[0]} height={200} fill={C.water} opacity={0.55} />
      <path d={`M${VENTURES.lagoon[0]} 0 H${VENTURES.lagoon[1]}`} stroke={C.sunCore} strokeWidth={5} opacity={0.7} />
    </>
  ),
  move: keyed([
    { at: 0, ...STAND },
    { at: 0.1, pose: CROUCH, ahead: 0 },
    { at: 0.22, pose: posed({ lean: 120, ...ARMS_UP }), ahead: 170, lift: 40, arc: 60 },
    { at: 0.32, pose: posed({ lean: 160, ...ARMS_UP }), ahead: 230, lift: -90 },
    { at: 0.42, pose: SWIM, ahead: 300, lift: -130 },
    { at: 0.5, pose: posed({ ...SWIM, thighRight: 20, thighLeft: -20 }), ahead: 340, lift: -140 },
    { at: VENTURES.rise[1], pose: posed({ armRight: -130, armLeft: 60, thighRight: -20, shinRight: 30, thighLeft: 20, shinLeft: -30 }), ahead: 360, lift: -150 },
  ]),
  reply: (stage, count) => {
    const stops = fxs(stage, 'pearl', count).map((pearl, i) => ({ pearl, shut: fx(stage, `shut-${i}`), open: fx(stage, `open-${i}`) }))
    return (played) =>
      stops.forEach(({ pearl, shut, open }, i) => {
        const t = played(i)
        shown(shut, open, t >= VENTURES.open)
        const rise = trackEase(ramp(t, VENTURES.rise[0], VENTURES.rise[1]))
        translateTo(pearl, lerp(VENTURES.chest.x, VENTURES.chest.x + 40, rise), lerp(VENTURES.chest.y - 50, -10, rise))
        fadeTo(pearl, t >= VENTURES.open ? 1 : 0)
      })
  },
})

// Bands: the log. He leaps onto the log the card floats in and treads it as it rolls under him, each step
// a note; the frogs on the lily pads hop in time.
const BANDS = { steps: [0.2, 0.3, 0.4, 0.5, 0.6] as const, frogs: [210, 330] as const, notes: [0.25, 0.85] as const }

const STEP_RIGHT = posed({ thighRight: -30, shinRight: 40, armRight: -80, armLeft: 70 })
const STEP_LEFT = posed({ thighLeft: 30, shinLeft: -40, armRight: -70, armLeft: 80 })

const bands = stopsScene({
  zone: 'dusk',
  kit: 'drummer',
  run: 'leap',
  stop: (i) => (
    <>
      <River from={-SPACING / 2} to={SPACING / 2} />
      {BANDS.frogs.map((x, n) => (
        <g key={x}>
          <Pad x={x} />
          <g data-fx={`frog-${i}-${n}`} transform={`translate(${x} 0)`}>
            <Frog />
          </g>
        </g>
      ))}
      <g data-fx={`log-${i}`}>
        <Log />
        <g data-fx={`grain-${i}`}>
          <Grain />
        </g>
      </g>
      {[0, 1, 2].map((n) => (
        <g key={n} data-fx={`note-${i}-${n}`} opacity={0}>
          <Note />
        </g>
      ))}
    </>
  ),
  move: keyed([
    { at: 0, pose: CROUCH, ahead: 0, lift: 18 },
    { at: 0.12, pose: posed({ armRight: -80, armLeft: 80 }), ahead: 0, lift: 18 },
    ...BANDS.steps.map((at, s) => ({ at, pose: s % 2 === 0 ? STEP_RIGHT : STEP_LEFT, ahead: 0, lift: 18 })),
    { at: 0.7, pose: posed({ armRight: -85, armLeft: 85 }), ahead: 0, lift: 18 },
  ]),
  reply: (stage, count) => {
    const stops = fxs(stage, 'log', count).map((log, i) => ({
      log,
      grain: fx(stage, `grain-${i}`),
      frogs: BANDS.frogs.map((_, n) => fx(stage, `frog-${i}-${n}`)),
      notes: [0, 1, 2].map((n) => fx(stage, `note-${i}-${n}`)),
    }))
    return (played) =>
      stops.forEach(({ log, grain, frogs, notes }, i) => {
        const t = played(i)
        const bob = BANDS.steps.reduce((sum, at) => sum + hop(ramp(t, at, at + 0.06), 5), 0)
        translateTo(log, 0, bob)
        translateTo(grain, -60 * ramp(t, BANDS.steps[0], 0.7), 0)
        frogs.forEach((frog, n) => translateTo(frog, BANDS.frogs[n], -hop(ramp(t, BANDS.steps[1 + 2 * n], BANDS.steps[1 + 2 * n] + 0.12), 50)))
        notes.forEach((note, n) => {
          const rise = ramp(t, BANDS.notes[0] + n * 0.12, BANDS.notes[1] - (2 - n) * 0.05)
          translateTo(note, 40 + 50 * n + 16 * Math.sin(4 * rise), -60 - 220 * rise)
          fadeTo(note, rise > 0 ? 1 - ramp(rise, 0.7, 1) : 0)
        })
      })
  },
})

// Muay Thai: the swing kick. He jumps to the branch, swings both legs up into the sack, drops into his
// guard and drives his knee into it; each hit swings it round, the first shakes a coconut loose.
const MUAY = { sack: 150, hits: [0.4, 0.68] as const, nut: [0.42, 0.56] as const }

const muayThai = stopsScene({
  zone: 'jungle',
  kit: 'fighter',
  stop: (i) => (
    <>
      <Branch />
      <g data-fx={`sack-${i}`} transform={`translate(${MUAY.sack} ${BRANCH})`}>
        <Sack />
      </g>
      <g data-fx={`fall-${i}`} opacity={0}>
        <Coconut />
      </g>
    </>
  ),
  move: keyed([
    { at: 0, ...STAND },
    { at: 0.1, pose: GUARD, ahead: 0 },
    { at: 0.18, pose: CROUCH, ahead: 0 },
    { at: 0.3, pose: HANG, ahead: 20, lift: 160, arc: 30 },
    { at: MUAY.hits[0], pose: posed({ ...ARMS_UP, thighRight: -100, thighLeft: -88, lean: -18 }), ahead: 30, lift: 160 },
    { at: 0.52, pose: CROUCH, ahead: 40 },
    { at: MUAY.hits[1], pose: posed({ ...GUARD, thighRight: -80, shinRight: 80 }), ahead: 50, lift: 10, arc: 16 },
    { at: 0.8, pose: GUARD, ahead: 50 },
  ]),
  push: (t) => bell(t, MUAY.hits[0] + 0.02),
  reply: (stage, count) => {
    const stops = fxs(stage, 'sack', count).map((sack, i) => ({ sack, nut: fx(stage, `fall-${i}`) }))
    return (played) =>
      stops.forEach(({ sack, nut }, i) => {
        const t = played(i)
        const swing = MUAY.hits.reduce((sum, at) => sum + (t > at ? 22 * Math.exp(-(t - at) * 8) * Math.sin((t - at) * 28) : 0), 0)
        transformTo(sack, `translate(${MUAY.sack} ${BRANCH}) rotate(${r1(-swing)})`)
        const fall = ramp(t, MUAY.nut[0], MUAY.nut[1])
        translateTo(nut, MUAY.sack + 70 * fall, BRANCH + 200 + drop(fall, -BRANCH - 222))
        fadeTo(nut, fall > 0 ? 1 : 0)
      })
  },
})

// ---------------------------------------------------------------- Contact: the zip line to the camp

const CONTACT = { ride: [0.15, 0.5] as const, land: 0.56, fire: 0.62, lanterns: 0.7, from: { dx: -540, y: -540 }, to: { dx: 0, y: -210 } }

// His hands on the line hang this far above his feet.
const REACH = 171

const contact: SceneDef = {
  zone: 'night',
  kit: null,
  back: ({ cx }) => (
    <>
      <rect x={cx + CONTACT.from.dx - 90} y={GROUND + CONTACT.from.y + 20} width={150} height={20} fill={C.plank} stroke={EDGE} strokeWidth={4} />
      <path d={`M${cx + CONTACT.from.dx - 70} ${GROUND + CONTACT.from.y + 40} V${GROUND} M${cx + CONTACT.from.dx + 40} ${GROUND + CONTACT.from.y + 40} V${GROUND}`} stroke={EDGE} strokeWidth={12} />
      <path d={`M${cx + CONTACT.from.dx} ${GROUND + CONTACT.from.y} Q${cx - 240} ${GROUND - 260} ${cx + 60} ${GROUND + CONTACT.to.y - 10} L${cx + 80} ${GROUND}`} fill="none" stroke={C.plankLight} strokeWidth={4} />
      <g transform={`translate(${cx + 180} ${GROUND})`}>
        <path d="M-40 0 L40 0 M-30 -6 L30 -26 M-30 -26 L30 -6" stroke={C.bark} strokeWidth={10} strokeLinecap="round" />
        <path data-fx="fire" d="M-30 -10 Q-24 -70 0 -110 Q24 -70 30 -10 Z" fill={C.lamp} opacity={0} />
      </g>
      {[cx + 300, cx + 400].map((x) => (
        <g key={x}>
          <path d={`M${x} ${GROUND} V${GROUND - 160}`} stroke={C.bark} strokeWidth={8} />
          <rect data-fx={`lantern-${x - cx}`} x={x - 14} y={GROUND - 200} width={28} height={36} rx={6} fill={C.lamp} opacity={0.15} stroke={EDGE} strokeWidth={3} />
        </g>
      ))}
    </>
  ),
  bind: (stage, { cx }) => {
    const fire = fx(stage, 'fire')
    const lanterns = [fx(stage, 'lantern-300'), fx(stage, 'lantern-400')]
    return (p) => {
      const ride = ramp(p, CONTACT.ride[0], CONTACT.ride[1])
      const along = trackEase(ride)
      const x = cx + lerp(CONTACT.from.dx, CONTACT.to.dx, along)
      const line = lerp(CONTACT.from.y, CONTACT.to.y, along) + 60 * Math.sin(Math.PI * along)
      const hanging = -(line + REACH)
      const landing = ramp(p, CONTACT.ride[1], CONTACT.land)
      const lift = ride < 1 ? hanging : lerp(-(CONTACT.to.y + REACH), 0, landing)
      const pose = ride < 1 ? posed({ ...ARMS_UP, thighRight: -40, thighLeft: -30 }) : mix(CROUCH, FIGURE_STAND, ramp(p, CONTACT.land, CONTACT.land + 0.06))
      fadeTo(fire, ramp(p, CONTACT.fire, CONTACT.fire + 0.06))
      lanterns.forEach((lantern, n) => fadeTo(lantern, 0.15 + 0.85 * ramp(p, CONTACT.lanterns + 0.04 * n, CONTACT.lanterns + 0.04 * n + 0.05)))
      return frame(x, pose, K, Math.max(0, lift))
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
