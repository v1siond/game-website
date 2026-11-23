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
import { HOSE } from './palette'
import { TOON_STAND, type ToonPose } from './toon'
import { GROUND, type Zone } from './zones'

// Each part of the page as a scene of a 1930s cartoon: its place (the meadow, the carnival, the theatre),
// his kit, and one stop per card the section counts. He holds his place while the set slides under him: as
// each card is read the set runs one spacing to bring its stop (the run, his hose legs striding), then he
// makes the genre's move there and the stop answers it (the beat), held once done; scroll up plays it back
// (the shared trackAt). About: he winds up and zips to a closed bud, which blooms in a squash and stretch.
// Work: his arm stretches out to a pole's line and pulls, and the pennant runs up. Tech: he blows up a
// balloon in three puffs and lets it float off. Services: he stomps on a spring board and bounces, and the
// sign flips to its painted face. Projects: he winds up and throws at a stack of bottles, which topple.
// Ventures: he swings the mallet at the high striker, the puck rings the bell and its lamp lights. Bands:
// he drums at his kit and the record bounces, spins and lets out its notes. Muay Thai: punch, knee and kick
// at the bag, which swings round. Contact: he walks up to the microphone and bows, the spotlight closing
// round him like an iris. The hero: him in the meadow beside the big flower, which sways once.
//
// He is the rubber hose cartoon of toon.tsx on the shared rig: every limb turns at its joint and the hoses
// curve through the bend, his body squashes and stretches, and his near arm stretches past its length.

export type SceneId = 'hero' | SectionId | 'contact'

type Layout = PropLayout

/** Him in a frame: where his shoes are, his size, his pose and how visible he is. */
export type ToonState = FigureState<ToonPose>

export interface SceneDef {
  zone: Zone
  /** His kit in the scene; null takes the profession the page shows. */
  kit: Profession | null
  /** He carries the carnival mallet in his near hand. */
  mallet?: boolean
  /** The stops and the set pieces, drawn in the figure layer behind him. */
  back: (layout: Layout) => ReactNode
  bind: (stage: StageNodes, layout: Layout) => FigureWriter<ToonPose>
}

// The middle of the band the scenes play in: right of the text column on a wide screen, the middle a phone shows.
const BAND: Record<'wide' | 'phone', readonly [number, number]> = { wide: [880, 1320], phone: [560, 880] }

/** His size on the canvas: his 170 unit box about a quarter of the screen. */
const K = 1.7

/** Where he holds his place: right of the text on a wide screen, left of the middle on a phone. */
const holdOf = ({ phone }: Layout): number => (phone ? 600 : 880)

/** The stops stand this far apart; the next one waits one spacing ahead of him. */
const SPACING = 600

/** His stride on the run between stops: a whole number of steps per spacing, so a run ends standing. */
const STRIDE = 75

// How far the view pushes in at a full push.
const PUSH = 0.1

const INK = HOSE.ink

const toon = (zone: Zone, x: number, pose: ToonPose, k = K, lift = 0): ToonState => ({ x, y: GROUND[zone] - lift, k, pose, opacity: 1 })

/** A pose from the standing one with `turns` changed. */
const posed = (turns: Partial<ToonPose>): ToonPose => ({ ...TOON_STAND, ...turns })

// ---------------------------------------------------------------- the stops writer

/** Him at a moment of a move: his pose, how far ahead of his place and above the floor. */
interface Him {
  pose: ToonPose
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

const STAND: Him = { pose: TOON_STAND, ahead: 0 }

/** The run between beats: out of the last move's held end, back to his place, his hose legs striding. */
function runOf(before: Him, run: number, offset: number): Him {
  if (run <= 0) return before
  const out = ramp(run, 0, 0.4)
  return {
    pose: mix(before.pose, posed(walk(offset / STRIDE, 0)), trackEase(out)),
    ahead: lerp(before.ahead, 0, out),
    lift: lerp(before.lift ?? 0, 0, out),
  }
}

interface StopsDef {
  zone: Zone
  kit: Profession | null
  mallet?: boolean
  /** A card's stop, drawn round the spot where he makes his move (x 0 his place, y 0 the floor). */
  stop: (i: number) => ReactNode
  /** His move at a stop, `t` of the way; t 1 is its held end. */
  move: (t: number) => Him
  /** How far the view pushes in over his move. */
  push?: (t: number) => number
  /** Binds the stops' answers; the writer takes how far each card's answer has played, 0 to 1. */
  reply: (stage: StageNodes, count: number) => (played: (i: number) => number) => void
}

const stopsScene = ({ zone, kit, mallet, stop, move, push, reply }: StopsDef): SceneDef => ({
  zone,
  kit,
  mallet,
  back: (layout) => (
    <g data-fx="course">
      {Array.from({ length: Math.max(1, layout.count) }, (_, i) => (
        <g key={i} transform={`translate(${holdOf(layout) + SPACING * (i + 1)} ${GROUND[zone]})`}>
          {stop(i)}
        </g>
      ))}
    </g>
  ),
  bind: (stage, layout) => {
    const count = Math.max(1, layout.count)
    const hold = holdOf(layout)
    const course = fx(stage, 'course')
    const camera = fx(stage, 'camera')
    const answers = reply(stage, count)
    return (_p, f) => {
      const beat = trackAt(f, count, SPACING)
      translateTo(course, -beat.offset, 0)
      answers((i) => (i < beat.at ? 1 : i === beat.at ? beat.act : 0))
      const him = beat.act > 0 ? move(beat.act) : runOf(beat.at > 0 ? move(1) : STAND, beat.run, beat.offset)
      const x = hold + him.ahead
      const lift = him.lift ?? 0
      const pushed = beat.act > 0 && push ? push(beat.act) : 0
      transformTo(camera, pushed > 0 ? focusOn(x + 60, GROUND[zone] - lift - 140, 1 + PUSH * pushed) : '')
      return toon(zone, x, him.pose, K, lift)
    }
  },
})

/** The bell a push follows over a move: 0, up to 1 at `at`, back to 0 `width` either side. */
const bell = (t: number, at: number, width = 0.1): number => clamp01(1 - Math.abs(t - at) / width)

/** A thing's two looks: the first shown until `on`, then the second. */
const shown = (first: Element | null, second: Element | null, on: boolean): void => {
  fadeTo(first, on ? 0 : 1)
  fadeTo(second, on ? 1 : 0)
}

/** A wobble that settles: a squash and stretch, `0` at the start and the end of its time t. */
const wobble = (t: number): number => (t <= 0 || t >= 1 ? 0 : Math.sin(2 * Math.PI * t) * (1 - t))

// ---------------------------------------------------------------- the stops' art

function Bloom({ petal }: { petal: string }) {
  return (
    <>
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse key={a} cx={0} cy={-26} rx={14} ry={22} fill={petal} stroke={INK} strokeWidth={4} transform={`rotate(${a})`} />
      ))}
      <circle r={21} fill={HOSE.gold} stroke={INK} strokeWidth={4.4} />
    </>
  )
}

const Stem = ({ height }: { height: number }) => (
  <>
    <path d={`M0 0 Q-8 ${-height / 2} 0 ${-height}`} fill="none" stroke={HOSE.meadowDark} strokeWidth={8} />
    <path d="M-2 -50 Q-36 -72 -46 -54 Q-24 -38 -2 -44" fill={HOSE.meadow} stroke={INK} strokeWidth={4} />
  </>
)

const Bud = () => <path d="M0 -10 C-18 -18 -16 -44 0 -56 C16 -44 18 -18 0 -10 Z" fill={HOSE.meadow} stroke={INK} strokeWidth={4} strokeLinejoin="round" />

const POLE = 230

const Pole = () => (
  <>
    <rect x={-4} y={-POLE} width={8} height={POLE} fill={HOSE.inkSoft} />
    <circle cy={-POLE} r={9} fill={HOSE.gold} stroke={INK} strokeWidth={3} />
    <path d={`M-10 ${-POLE + 6} V-60 H-4`} fill="none" stroke={INK} strokeWidth={2} />
  </>
)

const Flag = () => <path d="M4 -32 L76 -16 L4 0 Z" fill={HOSE.red} stroke={INK} strokeWidth={4} strokeLinejoin="round" />

const BalloonArt = ({ tint }: { tint: string }) => (
  <>
    <path d="M0 0 Q8 -20 0 -40" fill="none" stroke={INK} strokeWidth={3} />
    <ellipse cy={-80} rx={34} ry={42} fill={tint} stroke={INK} strokeWidth={4.4} />
    <path d="M-6 -38 L6 -38 L0 -30 Z" fill={tint} stroke={INK} strokeWidth={3} />
    <ellipse cx={-12} cy={-94} rx={7} ry={12} fill={HOSE.highlight} opacity={0.6} />
  </>
)

const BALLOONS = [HOSE.red, HOSE.blue, HOSE.gold, HOSE.orange]

const Board = () => (
  <>
    <path d="M-30 0 L-20 -6 L20 -12 L-20 -18 L20 -24" fill="none" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <rect x={-50} y={-30} width={100} height={10} rx={4} fill={HOSE.boards} stroke={INK} strokeWidth={3.4} />
  </>
)

const SignPost = () => <rect x={-5} y={-150} width={10} height={150} fill={HOSE.inkSoft} />

const SignBack = () => (
  <>
    <rect x={-50} y={-33} width={100} height={66} rx={8} fill={HOSE.paperDark} stroke={INK} strokeWidth={4.4} />
    <path d="M-34 -13 H34 M-34 3 H18 M-34 19 H26" stroke={HOSE.shadow} strokeWidth={6} />
  </>
)

const SignFace = () => (
  <>
    <rect x={-50} y={-33} width={100} height={66} rx={8} fill={HOSE.red} stroke={INK} strokeWidth={4.4} />
    <path d="M0 -19 L7 -6 L21 -4 L11 6 L13 20 L0 13 L-13 20 L-11 6 L-21 -4 L-7 -6 Z" fill={HOSE.gold} stroke={INK} strokeWidth={3} />
  </>
)

const Bottle = () => (
  <>
    <path d="M-14 0 V-46 Q-14 -56 -6 -60 V-76 H6 V-60 Q14 -56 14 -46 V0 Z" fill={HOSE.bottleGreen} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <rect x={-14} y={-40} width={28} height={16} fill={HOSE.paper} stroke={INK} strokeWidth={3} />
  </>
)

const Ball = () => <circle r={12} fill={HOSE.red} stroke={INK} strokeWidth={3.4} />

const Table = () => (
  <>
    <rect x={-60} y={-96} width={120} height={10} fill={HOSE.shadowDark} stroke={INK} strokeWidth={3} />
    <path d="M-48 -86 V0 M48 -86 V0" stroke={INK} strokeWidth={6} />
  </>
)

const TOWER = 280

const Striker = () => (
  <>
    <rect x={-40} y={-50} width={60} height={50} fill={HOSE.paperDark} stroke={INK} strokeWidth={4} />
    <rect x={-36} y={-62} width={52} height={12} rx={4} fill={HOSE.red} stroke={INK} strokeWidth={3.4} />
    <rect x={40} y={-TOWER} width={24} height={TOWER} fill={HOSE.paper} stroke={INK} strokeWidth={4} />
    {[1, 2, 3, 4].map((n) => (
      <path key={n} d={`M40 ${-n * 56} H64`} stroke={HOSE.red} strokeWidth={4} />
    ))}
  </>
)

const StrikerBell = () => (
  <>
    <path d={`M38 ${-TOWER - 4} Q52 ${-TOWER - 44} 66 ${-TOWER - 4} Z`} fill={HOSE.gold} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <circle cx={52} cy={-TOWER - 4} r={4} fill={INK} />
  </>
)

const Lamp = ({ lit }: { lit: boolean }) => <circle cx={52} cy={-TOWER - 66} r={14} fill={lit ? HOSE.gold : HOSE.shadow} stroke={INK} strokeWidth={3.4} />

const Puck = () => <rect x={44} y={-16} width={16} height={16} rx={3} fill={HOSE.red} stroke={INK} strokeWidth={3} />

const Kit = () => (
  <>
    <ellipse cy={-80} rx={70} ry={70} fill={HOSE.paper} stroke={INK} strokeWidth={4.4} />
    <ellipse cy={-80} rx={54} ry={54} fill="none" stroke={HOSE.red} strokeWidth={6} />
    <path d="M70 -150 L66 0 M-70 -140 L-66 0" stroke={INK} strokeWidth={4} />
    <ellipse cx={74} cy={-152} rx={36} ry={7} fill={HOSE.gold} stroke={INK} strokeWidth={3.4} />
    <rect x={-104} y={-150} width={60} height={30} rx={6} fill={HOSE.red} stroke={INK} strokeWidth={3.4} />
  </>
)

const Disc = () => (
  <>
    <circle r={48} fill={HOSE.film} stroke={INK} strokeWidth={4} />
    <circle r={32} fill="none" stroke={HOSE.inkSoft} strokeWidth={2} />
    <circle r={16} fill={HOSE.red} />
    <rect x={-3} y={-30} width={6} height={12} fill={HOSE.paper} />
  </>
)

const Note = () => (
  <>
    <ellipse cx={-6} rx={9} ry={7} fill={INK} transform="rotate(-20 -6 0)" />
    <path d="M2 -2 V-34 L16 -26" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
  </>
)

const BEAM = 320

const Bag = () => (
  <>
    <path d="M-20 -10 V-40" stroke={INK} strokeWidth={4} />
    <rect x={-46} y={-180} width={52} height={140} rx={24} fill={HOSE.red} stroke={INK} strokeWidth={4.4} />
    <rect x={-46} y={-150} width={52} height={10} fill={HOSE.redDark} />
  </>
)

const Hit = () => <path d="M-48 -20 L-76 -36 M-50 0 L-84 0 M-48 20 L-76 36" stroke={HOSE.gold} strokeWidth={6} strokeLinecap="round" />

// ---------------------------------------------------------------- the hero

const HERO_AT = { wide: { flower: 200, him: 1240 }, phone: { flower: 560, him: 820 } }

const hero: SceneDef = {
  zone: 'meadow',
  kit: null,
  back: ({ phone }) => (
    <g data-fx="flower" transform={`translate(${HERO_AT[phone ? 'phone' : 'wide'].flower} ${GROUND.meadow})`}>
      <g transform="scale(1.6)">
        <Stem height={120} />
        <g transform="translate(0 -140)">
          <Bloom petal={HOSE.orange} />
        </g>
      </g>
    </g>
  ),
  bind: (stage, { phone }) => {
    const flower = fx(stage, 'flower')
    const at = HERO_AT[phone ? 'phone' : 'wide']
    return (p) => {
      // the big flower sways once as the page moves on, then bows out
      const sway = ramp(p, 0, 0.35)
      transformTo(flower, `translate(${at.flower} ${GROUND.meadow}) rotate(${r1(12 * Math.sin(2 * Math.PI * sway) * (1 - sway) - 20 * ramp(p, 0.4, 0.7))})`)
      return toon('meadow', at.him, TOON_STAND, phone ? 1.9 : 2.2)
    }
  },
}

// ---------------------------------------------------------------- the sections

// About: the zip. He winds up, zips to the bud at BUD and stops dead; it blooms at BLOOM.
const ABOUT = { bud: 230, bloom: [0.42, 0.7] as const }

const PETALS = [HOSE.orange, HOSE.red, HOSE.gold]

const about = stopsScene({
  zone: 'meadow',
  kit: null,
  stop: (i) => (
    <g transform={`translate(${ABOUT.bud} 0)`}>
      <Stem height={110} />
      <g data-fx={`bud-${i}`} transform="translate(0 -104)">
        <Bud />
      </g>
      <g data-fx={`bloom-${i}`} transform="translate(0 -140) scale(0)">
        <Bloom petal={PETALS[i % PETALS.length]} />
      </g>
    </g>
  ),
  move: keyed([
    { at: 0, ...STAND },
    { at: 0.15, pose: posed({ squash: 0.7, lean: -14, armRight: 30, armLeft: 30 }), ahead: -20 },
    { at: 0.28, pose: posed({ squash: -0.5, lean: 18, armRight: 40, armLeft: 50, thighRight: -30, thighLeft: 30 }), ahead: 100 },
    { at: 0.34, pose: posed({ squash: 0.4, lean: -8, armRight: -40, armLeft: 40 }), ahead: 110 },
    { at: 0.45, pose: TOON_STAND, ahead: 110 },
  ]),
  reply: (stage, count) => {
    const buds = fxs(stage, 'bud', count)
    const blooms = fxs(stage, 'bloom', count)
    return (played) =>
      blooms.forEach((bloom, i) => {
        const g = ramp(played(i), ABOUT.bloom[0], ABOUT.bloom[1])
        const w = 0.35 * wobble(g)
        transformTo(bloom, `translate(0 -140) scale(${(g + w).toFixed(3)} ${(g - w).toFixed(3)})`)
        fadeTo(buds[i], 1 - g)
      })
  },
})

// Work: the reach. His arm stretches out to the pole's line, then pulls it down and the flag runs up.
const WORK = { pole: 180, up: [0.35, 0.7] as const }

const work = stopsScene({
  zone: 'meadow',
  kit: 'engineer',
  stop: (i) => (
    <g transform={`translate(${WORK.pole} 0)`}>
      <Pole />
      <g data-fx={`flag-${i}`} transform="translate(0 -40)">
        <Flag />
      </g>
    </g>
  ),
  move: keyed([
    { at: 0, ...STAND },
    { at: 0.12, pose: posed({ lean: -6, squash: 0.3 }), ahead: 30 },
    { at: 0.28, pose: posed({ armRight: -95, reach: 3, lean: 8, armLeft: 20 }), ahead: 40 },
    { at: 0.36, pose: posed({ armRight: -95, reach: 3, lean: 8, armLeft: 20 }), ahead: 40 },
    { at: 0.6, pose: posed({ armRight: -25, reach: 0.8, lean: -6, squash: 0.3 }), ahead: 40 },
    { at: 0.75, pose: TOON_STAND, ahead: 40 },
  ]),
  reply: (stage, count) => {
    const flags = fxs(stage, 'flag', count)
    return (played) => flags.forEach((flag, i) => translateTo(flag, 0, lerp(-40, -POLE + 40, trackEase(ramp(played(i), WORK.up[0], WORK.up[1])))))
  },
})

// Tech: the puffs. He holds the balloon's knot by his face, puffs three times and lets it float off.
const TECH = { knot: { x: 60, y: -150 }, puffs: [0.2, 0.35, 0.5] as const, off: [0.65, 1] as const }

const PUFF = posed({ armRight: -120, squash: 0.45, lean: 4 })
const BREATH = posed({ armRight: -120, squash: -0.35, rise: -4 })

const tech = stopsScene({
  zone: 'carnival',
  kit: 'engineer',
  stop: (i) => (
    <g data-fx={`balloon-${i}`} opacity={0}>
      <BalloonArt tint={BALLOONS[i % BALLOONS.length]} />
    </g>
  ),
  move: keyed([
    { at: 0, ...STAND },
    { at: 0.12, pose: BREATH, ahead: 0 },
    ...TECH.puffs.flatMap((at) => [
      { at, pose: PUFF, ahead: 0 },
      { at: at + 0.07, pose: BREATH, ahead: 0 },
    ]),
    { at: TECH.off[0], pose: posed({ armRight: -150, foreRight: -20 }), ahead: 0 },
    { at: 0.8, pose: TOON_STAND, ahead: 0 },
  ]),
  reply: (stage, count) => {
    const balloons = fxs(stage, 'balloon', count)
    return (played) =>
      balloons.forEach((balloon, i) => {
        const t = played(i)
        const size = 0.15 + (0.85 / TECH.puffs.length) * TECH.puffs.reduce((sum, at) => sum + ramp(t, at - 0.02, at + 0.03), 0)
        const off = ramp(t, TECH.off[0], TECH.off[1])
        transformTo(balloon, `translate(${r1(TECH.knot.x + 60 * off)} ${r1(TECH.knot.y - 560 * off)}) rotate(${r1(10 * Math.sin(6 * off))}) scale(${size.toFixed(3)})`)
        fadeTo(balloon, t > 0.1 ? 1 - ramp(off, 0.6, 1) : 0)
      })
  },
})

// Services: the stomp. He hops onto the spring board, stomps it flat, bounces up and lands, and the sign
// flips to its painted face as he lands the stomp.
const SERVICES = { board: 130, sign: 280, stomp: 0.36, flip: [0.4, 0.56] as const }

const TUCK = { thighRight: -30, shinRight: 50, thighLeft: 30, shinLeft: -50 }

const services = stopsScene({
  zone: 'carnival',
  kit: 'engineer',
  stop: (i) => (
    <>
      <g data-fx={`board-${i}`} transform={`translate(${SERVICES.board} 0)`}>
        <Board />
      </g>
      <g transform={`translate(${SERVICES.sign} 0)`}>
        <SignPost />
        <g data-fx={`sign-${i}`} transform="translate(0 -183)">
          <g data-fx={`back-${i}`}>
            <SignBack />
          </g>
          <g data-fx={`face-${i}`} opacity={0}>
            <SignFace />
          </g>
        </g>
      </g>
    </>
  ),
  move: keyed([
    { at: 0, ...STAND },
    { at: 0.12, pose: posed({ squash: 0.5, armRight: 20, armLeft: -20 }), ahead: 0 },
    { at: 0.3, pose: posed({ squash: -0.3, ...TUCK, armRight: -60, armLeft: 60 }), ahead: SERVICES.board, lift: 30, arc: 110 },
    { at: SERVICES.stomp, pose: posed({ squash: 0.9, armRight: 30, armLeft: -30 }), ahead: SERVICES.board, lift: 16 },
    { at: 0.52, pose: posed({ squash: -0.4, armRight: -160, armLeft: 160 }), ahead: SERVICES.board, lift: 30, arc: 130 },
    { at: 0.6, pose: posed({ squash: 0.4 }), ahead: SERVICES.board, lift: 30 },
    { at: 0.68, pose: TOON_STAND, ahead: SERVICES.board, lift: 30 },
  ]),
  reply: (stage, count) => {
    const stops = fxs(stage, 'board', count).map((board, i) => ({ board, sign: fx(stage, `sign-${i}`), back: fx(stage, `back-${i}`), face: fx(stage, `face-${i}`) }))
    return (played) =>
      stops.forEach(({ board, sign, back, face }, i) => {
        const t = played(i)
        const flat = Math.max(hop(ramp(t, 0.3, 0.44), 1), 0.5 * hop(ramp(t, 0.56, 0.64), 1))
        transformTo(board, `translate(${SERVICES.board} 0) scale(1 ${(1 - 0.5 * flat).toFixed(3)})`)
        const flip = ramp(t, SERVICES.flip[0], SERVICES.flip[1])
        transformTo(sign, `translate(0 -183) scale(${Math.abs(Math.cos(Math.PI * flip)).toFixed(3)} 1)`)
        shown(back, face, flip >= 0.5)
      })
  },
})

// Projects: the throw. He winds the ball up over his head and lets it fly at the stack on the table,
// which topples, the top bottle first.
const PROJECTS = { table: 280, fly: [0.27, 0.4] as const, from: { x: 70, y: -190 }, at: { x: 280, y: -150 } }

const STACK = [
  { x: -18, y: -96, fall: 70, turn: 80 },
  { x: 18, y: -96, fall: 70, turn: -70 },
  { x: 0, y: -172, fall: 150, turn: 110 },
]

const projects = stopsScene({
  zone: 'carnival',
  kit: 'engineer',
  stop: (i) => (
    <>
      <g transform={`translate(${PROJECTS.table} 0)`}>
        <Table />
        {STACK.map(({ x, y }, b) => (
          <g key={b} data-fx={`bottle-${i}-${b}`} transform={`translate(${x} ${y})`}>
            <Bottle />
          </g>
        ))}
      </g>
      <g data-fx={`ball-${i}`} opacity={0}>
        <Ball />
      </g>
    </>
  ),
  move: keyed([
    { at: 0, ...STAND },
    { at: 0.15, pose: posed({ armRight: -175, foreRight: -20, lean: -10, squash: -0.2, thighLeft: 10 }), ahead: 0 },
    { at: PROJECTS.fly[0], pose: posed({ armRight: -60, reach: 0.6, lean: 14, squash: 0.3, thighRight: -15 }), ahead: 10 },
    { at: 0.42, pose: posed({ armRight: -20, lean: 4 }), ahead: 10 },
    { at: 0.52, pose: TOON_STAND, ahead: 10 },
  ]),
  reply: (stage, count) => {
    const stops = fxs(stage, 'ball', count).map((ball, i) => ({ ball, bottles: STACK.map((_, b) => fx(stage, `bottle-${i}-${b}`)) }))
    return (played) =>
      stops.forEach(({ ball, bottles }, i) => {
        const t = played(i)
        const fly = ramp(t, PROJECTS.fly[0], PROJECTS.fly[1])
        translateTo(ball, lerp(PROJECTS.from.x, PROJECTS.at.x, fly), lerp(PROJECTS.from.y, PROJECTS.at.y, fly) - hop(fly, 40))
        fadeTo(ball, fly > 0 && fly < 1 ? 1 : 0)
        bottles.forEach((bottle, b) => {
          const { x, y, fall, turn } = STACK[b]
          const tip = ramp(t, PROJECTS.fly[1] + (2 - b) * 0.04, PROJECTS.fly[1] + 0.16 + (2 - b) * 0.04)
          transformTo(bottle, `translate(${r1(x + 0.4 * turn * tip)} ${r1(y + drop(tip, fall))}) rotate(${r1(turn * tip)})`)
          fadeTo(bottle, 1 - ramp(tip, 0.7, 1))
        })
      })
  },
})

// Ventures: the mallet. He swings it up over his head and down on the striker's pad; the puck runs up the
// tower, rings the bell and the lamp on top lights; the puck slides back down.
const VENTURES = { striker: 110, smash: 0.28, top: 0.45, lit: 0.5, back: [0.6, 0.78] as const }

const ventures = stopsScene({
  zone: 'carnival',
  kit: 'engineer',
  mallet: true,
  stop: (i) => (
    <g transform={`translate(${VENTURES.striker} 0)`}>
      <Striker />
      <g data-fx={`ring-${i}`}>
        <StrikerBell />
      </g>
      <g data-fx={`dark-${i}`}>
        <Lamp lit={false} />
      </g>
      <g data-fx={`lit-${i}`} opacity={0}>
        <Lamp lit />
      </g>
      <g data-fx={`puck-${i}`}>
        <Puck />
      </g>
    </g>
  ),
  move: keyed([
    { at: 0, ...STAND },
    { at: 0.15, pose: posed({ armRight: -185, lean: -8, squash: -0.3, rise: -4 }), ahead: 0 },
    { at: VENTURES.smash, pose: posed({ armRight: -50, lean: 14, squash: 0.6 }), ahead: 0 },
    { at: 0.4, pose: posed({ armRight: -50, lean: 10, squash: 0.2 }), ahead: 0 },
    { at: 0.52, pose: posed({ armRight: -20 }), ahead: 0 },
  ]),
  push: (t) => bell(t, VENTURES.smash + 0.03),
  reply: (stage, count) => {
    const stops = fxs(stage, 'puck', count).map((puck, i) => ({ puck, ring: fx(stage, `ring-${i}`), dark: fx(stage, `dark-${i}`), lit: fx(stage, `lit-${i}`) }))
    return (played) =>
      stops.forEach(({ puck, ring, dark, lit }, i) => {
        const t = played(i)
        const up = trackEase(ramp(t, VENTURES.smash, VENTURES.top))
        const down = ramp(t, VENTURES.back[0], VENTURES.back[1])
        translateTo(puck, 0, -(TOWER - 20) * up + drop(down, TOWER - 20))
        const ding = ramp(t, VENTURES.top, VENTURES.top + 0.12)
        transformTo(ring, `rotate(${r1(14 * wobble(ding))} 52 ${-TOWER - 44})`)
        shown(dark, lit, t >= VENTURES.lit)
      })
  },
})

// Bands: the drums. He stands at his kit and plays the tom and the cymbal in turn; the record bounces on
// each hit, spins once and lets out its notes.
const BANDS = { record: 230, hits: [0.2, 0.3, 0.4, 0.5] as const, spin: [0.2, 0.7] as const, notes: [0.45, 0.95] as const }

const UP_RIGHT = posed({ armRight: -110, foreRight: -30, armLeft: 60 })
const DOWN_RIGHT = posed({ armRight: -70, foreRight: 10, armLeft: 70, squash: 0.15 })
const UP_LEFT = posed({ armLeft: 110, foreLeft: 30, armRight: -60 })
const DOWN_LEFT = posed({ armLeft: 70, foreLeft: -10, armRight: -70, squash: 0.15 })

const bands = stopsScene({
  zone: 'theatre',
  kit: 'drummer',
  stop: (i) => (
    <>
      <Kit />
      <g transform={`translate(${BANDS.record} 0)`}>
        <rect x={-4} y={-70} width={8} height={70} fill={HOSE.inkSoft} />
        <g data-fx={`disc-${i}`} transform="translate(0 -120)">
          <Disc />
        </g>
        {[0, 1, 2].map((n) => (
          <g key={n} data-fx={`note-${i}-${n}`} opacity={0}>
            <Note />
          </g>
        ))}
      </g>
    </>
  ),
  move: keyed([
    { at: 0, ...STAND },
    ...BANDS.hits.flatMap((at, h) => [
      { at: at - 0.05, pose: h % 2 === 0 ? UP_RIGHT : UP_LEFT, ahead: 0 },
      { at, pose: h % 2 === 0 ? DOWN_RIGHT : DOWN_LEFT, ahead: 0 },
    ]),
    { at: 0.62, pose: posed({ armRight: -150, armLeft: 150, squash: -0.3 }), ahead: 0 },
    { at: 0.75, pose: TOON_STAND, ahead: 0 },
  ]),
  reply: (stage, count) => {
    const stops = fxs(stage, 'disc', count).map((disc, i) => ({ disc, notes: [0, 1, 2].map((n) => fx(stage, `note-${i}-${n}`)) }))
    return (played) =>
      stops.forEach(({ disc, notes }, i) => {
        const t = played(i)
        const bounce = BANDS.hits.reduce((sum, at) => sum + hop(ramp(t, at, at + 0.06), 14), 0)
        transformTo(disc, `translate(0 ${r1(-120 - bounce)}) rotate(${r1(360 * trackEase(ramp(t, BANDS.spin[0], BANDS.spin[1])))})`)
        notes.forEach((note, n) => {
          const rise = ramp(t, BANDS.notes[0] + n * 0.1, BANDS.notes[1] - (2 - n) * 0.05)
          translateTo(note, 30 + 30 * n + 20 * Math.sin(4 * rise), -180 - 160 * rise)
          fadeTo(note, rise > 0 ? 1 - ramp(rise, 0.7, 1) : 0)
        })
      })
  },
})

// Muay Thai: the combination. Punch, knee and kick at the bag, each hit swinging it round from the beam;
// the view pushes in on the kick.
const MUAY = { bag: 140, hits: [0.2, 0.42, 0.66] as const }

const GUARD = posed({ armRight: -40, foreRight: -120, armLeft: 40, foreLeft: 120 })

const muayThai = stopsScene({
  zone: 'theatre',
  kit: 'fighter',
  stop: (i) => (
    <g transform={`translate(${MUAY.bag} 0)`}>
      <path d={`M-90 ${-BEAM} H60`} stroke={INK} strokeWidth={8} />
      <g data-fx={`bag-${i}`} transform={`translate(20 ${-BEAM + 10})`}>
        <g transform="translate(0 180)">
          <Bag />
        </g>
      </g>
      <g data-fx={`hit-${i}`} opacity={0}>
        <Hit />
      </g>
    </g>
  ),
  move: keyed([
    { at: 0, ...STAND },
    { at: 0.1, pose: GUARD, ahead: 30 },
    { at: MUAY.hits[0], pose: posed({ armRight: -90, reach: 1.4, lean: 8, squash: -0.2, armLeft: 40, foreLeft: 120 }), ahead: 30 },
    { at: 0.3, pose: GUARD, ahead: 40 },
    { at: MUAY.hits[1], pose: posed({ ...GUARD, thighRight: -80, shinRight: 80, squash: -0.2 }), ahead: 70, lift: 10, arc: 20 },
    { at: 0.52, pose: GUARD, ahead: 40 },
    { at: MUAY.hits[2], pose: posed({ ...GUARD, thighRight: -95, lean: -14 }), ahead: 40 },
    { at: 0.8, pose: GUARD, ahead: 40 },
    { at: 0.9, pose: TOON_STAND, ahead: 40 },
  ]),
  push: (t) => bell(t, MUAY.hits[2] + 0.02),
  reply: (stage, count) => {
    const stops = fxs(stage, 'bag', count).map((bag, i) => ({ bag, hit: fx(stage, `hit-${i}`) }))
    return (played) =>
      stops.forEach(({ bag, hit }, i) => {
        const t = played(i)
        const swing = MUAY.hits.reduce((sum, at) => sum + (t > at ? 16 * Math.exp(-(t - at) * 9) * Math.sin((t - at) * 30) : 0), 0)
        transformTo(bag, `translate(20 ${-BEAM + 10}) rotate(${r1(-swing)})`)
        const near = MUAY.hits.findLast((at) => t >= at)
        const y = near === MUAY.hits[0] ? -150 : near === MUAY.hits[1] ? -110 : -90
        translateTo(hit, 0, y)
        fadeTo(hit, near !== undefined && t - near < 0.06 ? 1 : 0)
      })
  },
})

// ---------------------------------------------------------------- Contact: the microphone and the iris

const CONTACT = { walk: [0.15, 0.5] as const, bow: [0.6, 0.72, 0.85] as const, iris: [0.5, 0.82] as const }

const BOW = posed({ squash: 0.35, rise: 6, armRight: 30, foreRight: 40, armLeft: 70 })

const contact: SceneDef = {
  zone: 'theatre',
  kit: null,
  back: ({ cx }) => (
    <>
      <circle data-fx="spot" cx={cx} cy={GROUND.theatre - 130} r={520} fill={HOSE.footlight} opacity={0} />
      <circle data-fx="iris" cx={cx} cy={GROUND.theatre - 130} r={520} fill="none" stroke={INK} strokeWidth={8} opacity={0} />
      <g transform={`translate(${r1(cx + 90)} ${GROUND.theatre})`}>
        <rect x={-30} y={-6} width={60} height={6} fill={INK} />
        <rect x={-3} y={-170} width={6} height={166} fill={HOSE.inkSoft} />
        <rect x={-12} y={-210} width={24} height={44} rx={12} fill={HOSE.shadow} stroke={INK} strokeWidth={4} />
      </g>
    </>
  ),
  bind: (stage, { cx }) => {
    const spot = fx(stage, 'spot')
    const iris = fx(stage, 'iris')
    return (p) => {
      const there = ramp(p, CONTACT.walk[0], CONTACT.walk[1])
      const x = lerp(cx - 420, cx, there)
      const closing = trackEase(ramp(p, CONTACT.iris[0], CONTACT.iris[1]))
      const r = r1(lerp(520, 190, closing))
      spot?.setAttribute('r', String(r))
      iris?.setAttribute('r', String(r))
      fadeTo(spot, 0.4 * ramp(p, 0.45, 0.55))
      fadeTo(iris, 0.8 * ramp(p, 0.45, 0.55))
      const walking = posed(walk(there < 1 ? (x - cx) / STRIDE : 0, 0))
      const down = hop(ramp(p, CONTACT.bow[0], CONTACT.bow[2]), 1)
      return toon('theatre', x, there < 1 ? walking : mix(TOON_STAND, BOW, down))
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
