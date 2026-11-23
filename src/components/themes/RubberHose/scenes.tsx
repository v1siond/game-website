import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import { hop } from '@/lib/motion/arc'
import { mix, walk } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, focusOn, fx, lerp, r1, transformTo, translateTo } from '../shared/stageNodes'
import type { FigureState, StageNodes } from '../shared/figureScene'
import { GROUND } from './arena'
import { PARRY_PINK, PIPES, SHOULDER, STILTS, STILTS_FOOT, WAGON_TOP, scaleYFrom, turnAbout, type BossKit } from './boss'
import { HOSE } from './palette'
import type { Playhead, SceneScript } from './playStub'
import { TOON_STAND, type ToonPose } from './toon'

// The page as one boss fight in the big top (arena.tsx), the structure of the 1930s cartoon run and gun:
// the hero is the map and the boss rolling in, each section is a stage of the fight against the steam
// calliope (boss.tsx), and the contact is the knockout. Each scene plays one to three different actions
// on time once its section arrives, then holds its end frame (the shared section scene player; until it
// lands, playStub.ts). He stands on the left facing the boss on the right, side on, and fights with the
// genre's verbs: shoot, jump, dash, the parry slap on anything pink, a charged shot and a super.
//
// The phases escalate: About and Work fight the calliope on its wheels; Tech raises it on its stilts into
// a tall organ; Services dents it with the charged shot; Projects drops the ring floor into the pit and
// hangs trapezes over it; Ventures opens its doors on the boiler for the super; Contact is the knockout.
// The Musician's phase bolts a bass drum to its front, the Martial Artist's a glove on a spring.

export type SceneId = 'hero' | SectionId | 'contact'

/** Where the fighters stand: him on the left facing right, the boss on the right; their sizes. */
export interface Layout {
  phone: boolean
  him: number
  boss: number
  bossK: number
  k: number
  /** The trapezes' spacing over the pit. */
  gap: number
}

const LAYOUT: Record<'wide' | 'phone', Layout> = {
  wide: { phone: false, him: 740, boss: 1130, bossK: 1.05, k: 1.25, gap: 150 },
  phone: { phone: true, him: 560, boss: 840, bossK: 0.78, k: 1.05, gap: 95 },
}

export type ToonState = FigureState<ToonPose>

/** One frame of a scene: it writes the boss and the effects, and hands back him. */
export type FightWriter = (play: Playhead) => ToonState

export interface SceneDef {
  script: SceneScript
  /** The boss's kit in the scene. */
  kit: BossKit
  /** Him on the stage: the hero shows only the map marker. */
  him: boolean
  /** What the scene draws besides the boss and him: its effects, its floor. */
  back: (layout: Layout, profession: Profession) => ReactNode
  front?: (layout: Layout) => ReactNode
  bind: (stage: StageNodes, layout: Layout) => FightWriter
}

const INK = HOSE.ink

// ---------------------------------------------------------------- his poses, facing right

const posed = (turns: Partial<ToonPose>): ToonPose => ({ ...TOON_STAND, ...turns })

const READY = posed({ squash: 0.12, armRight: -50, foreRight: -40, armLeft: 25, foreLeft: -30, thighRight: -12, shinRight: 14, thighLeft: 12, shinLeft: 8 })
const SHOOT = posed({ lean: 4, armRight: -90, reach: 0.35, armLeft: 30, foreLeft: -40, thighRight: -18, shinRight: 10, thighLeft: 14, shinLeft: 6 })
const LEAP = posed({ squash: -0.25, armRight: -150, foreRight: -10, armLeft: -120, foreLeft: -20, thighRight: -70, shinRight: 80, thighLeft: -30, shinLeft: 70 })
const TUCK = posed({ squash: 0.1, armRight: -60, armLeft: -40, thighRight: -90, shinRight: 110, thighLeft: -70, shinLeft: 110 })
const DASH = posed({ lean: 28, squash: -0.2, armRight: 70, foreRight: 20, armLeft: 80, foreLeft: 20, thighRight: -60, shinRight: 30, thighLeft: 50, shinLeft: 40 })
const SLAP = posed({ squash: -0.15, armRight: -140, foreRight: -15, reach: 0.4, armLeft: -40, thighRight: -60, shinRight: 90, thighLeft: -20, shinLeft: 60 })
const CHARGE = posed({ lean: 6, squash: 0.18, armRight: -88, reach: 0.2, armLeft: -80, foreLeft: -5, thighRight: -25, shinRight: 15, thighLeft: 20, shinLeft: 10 })
const RECOIL = posed({ ...CHARGE, lean: -10, squash: 0.3 })
const CROUCH = posed({ squash: 0.3, thighRight: -40, shinRight: 70, thighLeft: -20, shinLeft: 60, armRight: -40, armLeft: 20 })
const KNEE = posed({ lean: -6, armRight: -60, foreRight: -80, armLeft: -40, foreLeft: -80, thighRight: -100, shinRight: 110, thighLeft: 10 })
const KICK = posed({ lean: -22, armRight: 40, foreRight: -60, armLeft: -50, foreLeft: -60, thighRight: -100, shinRight: 0, thighLeft: 18 })
const STICKS_UP = posed({ armRight: -160, foreRight: -20, armLeft: -150, foreLeft: -20 })
const STICKS_DOWN = posed({ squash: 0.12, armRight: -70, foreRight: -30, armLeft: -60, foreLeft: -30 })
const BOW = posed({ squash: 0.35, rise: 6, lean: 30, armRight: 30, foreRight: 40, armLeft: 70 })

/** His running stride, facing the boss. */
const run = (phase: number): ToonPose => posed(walk(phase, 1))

const him = (layout: Layout, x: number, pose: ToonPose, lift = 0): ToonState => ({ x, y: GROUND - lift, k: layout.k, pose, opacity: 1 })

/** Where his near hand is when it points at the boss: the shots leave from here. */
const handOf = (layout: Layout, x: number, lift = 0): [number, number] => [x + 42 * layout.k, GROUND - lift - 78 * layout.k]

/** A bump that rises and falls over u in 0 to 1. */
const bump = (u: number): number => (u <= 0 || u >= 1 ? 0 : Math.sin(Math.PI * u))

/** u's share of the way through `from` to `to`, for a beat inside an action. */
const within = ramp

// ---------------------------------------------------------------- the boss's writer

// The piston arm at rest, raised clear of him.
const ARM_REST = 45

interface BossState {
  /** Rolled in this far from off the right, 0 to 1. */
  rolled: number
  /** Up on its stilts, 0 to 1. */
  tall: number
  arm: number
  spring: number
  dent: number
  doors: number
  heart: number
  crack: number
  sag: number
  keys: number
  split: number
  shake: number
  /** Every pipe's steam, 0 to 1; `seq` puffs them one after another instead. */
  steam: number
  seq: number | null
}

const CALLIOPE: BossState = { rolled: 1, tall: 0, arm: ARM_REST, spring: 0, dent: 0, doors: 0, heart: 0, crack: 0, sag: 0, keys: 0, split: 0, shake: 0, steam: 0, seq: null }
// Up on its stilts the arm swings up out of the way of the trapezes.
const ORGAN: BossState = { ...CALLIOPE, tall: 1, arm: 75 }

// How high the stilts raise the wagon and how far the pipes grow in the tall form.
const RISE = STILTS
const GROW = 0.5

interface BossNodes {
  root: Element | null
  stilts: Element | null
  lift: Element | null
  body: Element | null
  pipes: Element | null
  pipe: Array<Element | null>
  puff: Array<Element | null>
  arm: Element | null
  spring: Element | null
  glove: Element | null
  doorL: Element | null
  doorR: Element | null
  heart: Element | null
  crack: Element | null
  keys: Element | null
  split: Element | null
  eyes: Element | null
  xeyes: Element | null
}

const bossNodes = (stage: StageNodes): BossNodes => ({
  root: fx(stage, 'boss'),
  stilts: fx(stage, 'boss-stilts'),
  lift: fx(stage, 'boss-lift'),
  body: fx(stage, 'boss-body'),
  pipes: fx(stage, 'boss-pipes'),
  pipe: PIPES.map((_, i) => fx(stage, `boss-pipe-${i}`)),
  puff: PIPES.map((_, i) => fx(stage, `boss-puff-${i}`)),
  arm: fx(stage, 'boss-arm'),
  spring: fx(stage, 'boss-spring'),
  glove: fx(stage, 'boss-glove'),
  doorL: fx(stage, 'boss-door-l'),
  doorR: fx(stage, 'boss-door-r'),
  heart: fx(stage, 'boss-heart'),
  crack: fx(stage, 'boss-crack'),
  keys: fx(stage, 'boss-keys'),
  split: fx(stage, 'boss-split'),
  eyes: fx(stage, 'boss-eyes'),
  xeyes: fx(stage, 'boss-xeyes'),
})

// It rolls in from this far off to the right.
const ROLL_IN = 700

function writeBoss(n: BossNodes, layout: Layout, s: BossState): void {
  const x = layout.boss + (1 - s.rolled) * ROLL_IN
  transformTo(n.root, `translate(${r1(x)} ${GROUND}) scale(${layout.bossK})`)
  transformTo(n.stilts, scaleYFrom(STILTS_FOOT, Math.max(0.001, s.tall)))
  translateTo(n.lift, 0, -RISE * s.tall)
  const ko = ramp(s.sag, 0.2, 0.5)
  transformTo(n.body, `translate(${r1(s.shake)} ${r1(14 * s.sag)}) ${turnAbout(7 * s.sag, 160, -60)}`)
  transformTo(n.pipes, scaleYFrom(WAGON_TOP, 1 + GROW * s.tall))
  PIPES.forEach(([px], i) => {
    transformTo(n.pipe[i], turnAbout((i % 2 ? 1 : -1) * 16 * s.sag, px, WAGON_TOP))
    fadeTo(n.puff[i], s.seq === null ? s.steam : bump(s.seq * (PIPES.length + 1) - i))
  })
  transformTo(n.arm, `translate(${SHOULDER[0]} ${SHOULDER[1]}) rotate(${s.arm.toFixed(1)})`)
  transformTo(n.spring, `scale(${(1 + 1.6 * s.spring).toFixed(3)} 1)`)
  transformTo(n.glove, `translate(${r1(-100 * (1 + 1.6 * s.spring))} 0) rotate(${(24 * s.dent).toFixed(1)}) scale(${(1 - 0.22 * s.dent).toFixed(3)})`)
  transformTo(n.doorL, `translate(-14 0) scale(${(1 - 0.88 * s.doors).toFixed(3)} 1) translate(14 0)`)
  transformTo(n.doorR, `translate(94 0) scale(${(1 - 0.88 * s.doors).toFixed(3)} 1) translate(-94 0)`)
  fadeTo(n.heart, s.heart)
  fadeTo(n.crack, s.crack)
  transformTo(n.keys, `translate(${r1(-50 * s.keys)} ${r1(-36 * s.keys)}) ${turnAbout(-24 * s.keys, -90, -105)}`)
  fadeTo(n.keys, 1 - 0.7 * s.keys)
  fadeTo(n.split, s.split)
  fadeTo(n.eyes, 1 - ko)
  fadeTo(n.xeyes, ko)
}

/** Where the boss's front is at the height of its eyes, for shots to land on. */
const bossFront = (layout: Layout, tall: number): [number, number] => [layout.boss - 150 * layout.bossK, GROUND - (180 + RISE * tall) * layout.bossK]

// ---------------------------------------------------------------- the effects

/** The effects every fight scene can use, all hidden until a writer shows them. */
export function Effects({ kit }: { kit: Profession }) {
  const shot = {
    engineer: <circle r={11} fill={INK} stroke={HOSE.highlight} strokeWidth={3} />,
    drummer: <path d="M-16 0 H16" stroke={HOSE.gold} strokeWidth={6} strokeLinecap="round" />,
    fighter: <circle r={14} fill="none" stroke={INK} strokeWidth={5} />,
  }[kit]
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <g key={i} data-fx={`shot-${i}`} opacity={0}>
          {shot}
        </g>
      ))}
      {[0, 1, 2].map((i) => (
        <g key={i} data-fx={`burst-${i}`} opacity={0}>
          <path d="M0 -30 L8 -9 L30 -8 L12 6 L19 28 L0 15 L-19 28 L-12 6 L-30 -8 L-8 -9 Z" fill={HOSE.highlight} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        </g>
      ))}
      <g data-fx="ball" opacity={0}>
        <circle r={48} fill={HOSE.highlight} stroke={INK} strokeWidth={5} />
        <path d="M-26 -10 Q0 -34 26 -10" fill="none" stroke={HOSE.paperDark} strokeWidth={6} strokeLinecap="round" />
      </g>
      <g data-fx="note" opacity={0}>
        <ellipse cx={0} cy={0} rx={22} ry={16} fill={PARRY_PINK} stroke={INK} strokeWidth={4} transform="rotate(-20)" />
        <path d="M18 -6 V-58 Q34 -48 40 -30" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      </g>
      <circle data-fx="flash" r={70} fill={HOSE.highlight} opacity={0} />
      <g data-fx="speed" opacity={0}>
        {[-60, -30, 0].map((y) => (
          <path key={y} d={`M-170 ${y} H-40`} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        ))}
      </g>
      <g data-fx="charge" opacity={0}>
        <circle r={40} fill={INK} stroke={PARRY_PINK} strokeWidth={6} />
        <path d="M-24 0 A24 24 0 0 1 24 0" fill="none" stroke={HOSE.highlight} strokeWidth={6} strokeLinecap="round" />
      </g>
      <g data-fx="beam" opacity={0}>
        <rect x={0} y={-34} width={1} height={68} rx={34} fill={HOSE.highlight} stroke={INK} strokeWidth={5} vectorEffect="non-scaling-stroke" />
      </g>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} data-fx={`star-${i}`} opacity={0}>
          <path d="M0 -18 L5 -5 L18 -5 L8 4 L12 17 L0 9 L-12 17 L-8 4 L-18 -5 L-5 -5 Z" fill={HOSE.gold} stroke={INK} strokeWidth={3} />
        </g>
      ))}
      <g data-fx="cloud" opacity={0}>
        {[
          [0, 0, 70],
          [-70, 20, 52],
          [60, 24, 56],
          [-20, -50, 50],
        ].map(([x, y, r]) => (
          <circle key={`${x} ${y}`} cx={x} cy={y} r={r} fill={HOSE.highlight} stroke={INK} strokeWidth={5} />
        ))}
      </g>
    </>
  )
}

interface EffectNodes {
  shot: Array<Element | null>
  burst: Array<Element | null>
  ball: Element | null
  note: Element | null
  flash: Element | null
  speed: Element | null
  charge: Element | null
  beam: Element | null
  beamBar: Element | null
  star: Array<Element | null>
  cloud: Element | null
  camera: Element | null
}

const effectNodes = (stage: StageNodes): EffectNodes => {
  const beam = fx(stage, 'beam')
  return {
    shot: [0, 1, 2, 3].map((i) => fx(stage, `shot-${i}`)),
    burst: [0, 1, 2].map((i) => fx(stage, `burst-${i}`)),
    ball: fx(stage, 'ball'),
    note: fx(stage, 'note'),
    flash: fx(stage, 'flash'),
    speed: fx(stage, 'speed'),
    charge: fx(stage, 'charge'),
    beam,
    beamBar: beam?.querySelector('rect') ?? null,
    star: [0, 1, 2, 3, 4].map((i) => fx(stage, `star-${i}`)),
    cloud: fx(stage, 'cloud'),
    camera: fx(stage, 'camera'),
  }
}

/** Puts an effect at x y, turned and sized, shown at `opacity`. */
const place = (node: Element | null, x: number, y: number, opacity: number, turn = 0, size = 1): void => {
  transformTo(node, `translate(${r1(x)} ${r1(y)}) rotate(${turn.toFixed(1)}) scale(${size.toFixed(3)})`)
  fadeTo(node, opacity)
}

const hide = (...nodes: Array<Element | null>): void => nodes.forEach((node) => fadeTo(node, 0))

/** A stream of shots from his hand to the boss over u, each bursting as it lands. */
function volley(e: EffectNodes, from: [number, number], to: [number, number], u: number): void {
  e.shot.forEach((node, i) => {
    const s = u * 2.2 - i * 0.32
    const flying = s > 0 && s < 1
    place(node, lerp(from[0], to[0], s), lerp(from[1], to[1], s) + 10 * Math.sin(s * 9), flying ? 1 : 0, s * 720)
  })
  e.burst.forEach((node, i) => {
    const landed = u * 2.2 - i * 0.32 - 1
    const showing = landed > 0 && landed < 0.35 && i < 3
    place(node, to[0] + 18 * (i - 1), to[1] + 22 * ((i % 2) - 0.5), showing ? 1 : 0, 20 * i, 0.7 + landed)
  })
}

/** The parry: the slap's white flash at x y over u, gone by the end. */
const flashAt = (e: EffectNodes, x: number, y: number, u: number): void => place(e.flash, x, y, 0.9 * bump(u), 0, 0.5 + u)

/** The camera's push in on x y, by `amount` of a full push. */
const pushIn = (e: EffectNodes, x: number, y: number, amount: number): void => transformTo(e.camera, focusOn(x, y, 1 + 0.08 * amount))

// ---------------------------------------------------------------- the scenes

/** The hero: the isle map, his marker walking up to the big top's sign, then the iris into the ring where
 *  the calliope rolls in and blows its whistle. */
const MAP_PATH: ReadonlyArray<readonly [number, number]> = [
  [260, 900],
  [420, 820],
  [540, 850],
  [660, 740],
  [790, 690],
  [880, 610],
]
const SIGN: readonly [number, number] = [940, 560]

const along = (points: ReadonlyArray<readonly [number, number]>, t: number): [number, number] => {
  const at = t * (points.length - 1)
  const i = Math.min(points.length - 2, Math.floor(at))
  const u = at - i
  return [lerp(points[i][0], points[i + 1][0], u), lerp(points[i][1], points[i + 1][1], u)]
}

/** The iris: the whole canvas with a round hole of radius r at the sign, which shows the ring through it. */
const irisPath = (r: number): string =>
  `M-10 -10 H1450 V1090 H-10 Z M${SIGN[0] - r} ${SIGN[1]} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`

function IsleMap() {
  return (
    <>
      <rect x={-10} y={-10} width={1460} height={1100} fill={HOSE.skyWash} />
      {[...Array(9)].map((_, i) => (
        <path key={i} d={`M${60 + i * 160} ${120 + (i % 3) * 300} q20 -10 40 0 q20 10 40 0`} fill="none" stroke={HOSE.blue} strokeWidth={4} opacity={0.5} />
      ))}
      <path d="M150 960 Q60 760 240 640 Q360 470 640 520 Q900 430 1120 520 Q1320 640 1240 860 Q1140 1020 820 990 Q500 1060 150 960 Z" fill={HOSE.meadow} stroke={INK} strokeWidth={6} />
      <path d="M190 940 Q120 780 270 680 Q380 540 640 580" fill="none" stroke={HOSE.meadowDark} strokeWidth={10} opacity={0.5} />
      <polyline points={MAP_PATH.map(([x, y]) => `${x},${y}`).join(' ')} fill="none" stroke={HOSE.paperSepia} strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={MAP_PATH.map(([x, y]) => `${x},${y}`).join(' ')} fill="none" stroke={INK} strokeWidth={3} strokeDasharray="10 14" strokeLinecap="round" />
      {/* the wooden bridge and the stairs on the way */}
      <g transform="translate(480 835) rotate(10)">
        {[-30, -15, 0, 15, 30].map((x) => (
          <rect key={x} x={x - 6} y={-22} width={12} height={44} fill={HOSE.boards} stroke={INK} strokeWidth={3} />
        ))}
      </g>
      <g transform="translate(725 715)">
        {[0, 1, 2].map((i) => (
          <rect key={i} x={-26 + i * 8} y={-i * 12} width={44} height={10} fill={HOSE.paperDark} stroke={INK} strokeWidth={3} />
        ))}
      </g>
      {/* trees, round and inked */}
      {[
        [330, 700],
        [400, 600],
        [1000, 760],
        [1080, 640],
        [620, 920],
      ].map(([x, y]) => (
        <g key={`${x}`} transform={`translate(${x} ${y})`}>
          <rect x={-6} y={0} width={12} height={34} fill={HOSE.boards} stroke={INK} strokeWidth={3} />
          <circle cy={-14} r={36} fill={HOSE.meadowDark} stroke={INK} strokeWidth={4} />
        </g>
      ))}
      {/* the big top's round sign */}
      <g transform={`translate(${SIGN[0]} ${SIGN[1]})`}>
        <path d="M-90 40 L0 -70 L90 40 Z" fill={HOSE.red} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <path d="M-45 40 L0 -70 L45 40" fill="none" stroke={HOSE.paper} strokeWidth={10} />
        <circle cy={-96} r={34} fill={HOSE.paper} stroke={INK} strokeWidth={5} />
        <path d="M-14 -96 h28 M0 -110 v28" stroke={HOSE.red} strokeWidth={7} strokeLinecap="round" />
      </g>
    </>
  )
}

const HERO_TOOT_AT = 0.8

const hero: SceneDef = {
  script: [1600, 1800],
  kit: 'piston',
  him: false,
  back: () => null,
  front: () => (
    <g data-fx="map">
      <defs>
        <clipPath id="hose-iris">
          <path data-fx="iris" d={irisPath(0)} clipRule="evenodd" />
        </clipPath>
      </defs>
      <g clipPath="url(#hose-iris)">
        <IsleMap />
        <g data-fx="marker" transform={`translate(${MAP_PATH[0][0]} ${MAP_PATH[0][1]})`}>
          <ellipse cy={4} rx={20} ry={6} fill={INK} opacity={0.3} />
          <circle cy={-26} r={22} fill={HOSE.highlight} stroke={INK} strokeWidth={5} />
          <path d="M-20 -32 Q0 -56 20 -32 Q0 -42 -20 -32 Z" fill={INK} />
          <ellipse cx={-6} cy={-26} rx={3.5} ry={6} fill={INK} />
          <ellipse cx={6} cy={-26} rx={3.5} ry={6} fill={INK} />
        </g>
      </g>
    </g>
  ),
  bind: (stage, layout) => {
    const boss = bossNodes(stage)
    const iris = fx(stage, 'iris')
    const marker = fx(stage, 'marker')
    const map = fx(stage, 'map')
    return ({ action, t }) => {
      const walked = action === 0 ? t : 1
      const opened = action === 0 ? 0 : t
      const [mx, my] = along(MAP_PATH, walked)
      translateTo(marker, mx, my - 18 * bump((walked * 10) % 1))
      iris?.setAttribute('d', irisPath(1700 * opened ** 1.4))
      fadeTo(map, opened >= 1 ? 0 : 1)
      const rolled = action === 0 ? 0 : within(t, 0.2, 0.7)
      writeBoss(boss, layout, { ...CALLIOPE, rolled, seq: action === 1 && t > HERO_TOOT_AT ? within(t, HERO_TOOT_AT, 1) : null })
      return him(layout, layout.him, READY)
    }
  },
}

/** Phase 1: he runs in and shoots; the calliope's whistle blows a steam ball along the floor and he jumps it. */
const about: SceneDef = {
  script: [1500, 1600],
  kit: 'piston',
  him: true,
  back: () => null,
  bind: (stage, layout) => {
    const boss = bossNodes(stage)
    const e = effectNodes(stage)
    return ({ action, t }) => {
      const front = bossFront(layout, 0)
      if (action === 0) {
        const running = within(t, 0, 0.35)
        const x = lerp(layout.him - 160, layout.him, running)
        const firing = within(t, 0.35, 1)
        volley(e, handOf(layout, x), front, firing)
        hide(e.ball)
        writeBoss(boss, layout, { ...CALLIOPE, shake: 6 * Math.sin(firing * 40) * bump(firing) })
        return him(layout, x, running < 1 ? run(running * 3) : SHOOT)
      }
      volley(e, handOf(layout, layout.him), front, 0)
      const ballX = lerp(front[0], layout.him - 420, t)
      place(e.ball, ballX, GROUND - 48, t < 0.95 ? 1 : 0, -t * 900)
      writeBoss(boss, layout, { ...CALLIOPE, seq: within(t, 0, 0.3) })
      const jump = within(t, 0.32, 0.72)
      const lift = hop(jump, 190)
      const pose = jump <= 0 ? READY : jump >= 1 ? SHOOT : mix(LEAP, TUCK, bump(jump))
      return him(layout, layout.him, pose, lift)
    }
  },
}

/** Phase 1: the piston arm sweeps the floor and he dashes under it; a pink note pops out of a pipe and he
 *  slaps it away in mid jump. */
const work: SceneDef = {
  script: [1400, 1700],
  kit: 'piston',
  him: true,
  back: () => null,
  bind: (stage, layout) => {
    const boss = bossNodes(stage)
    const e = effectNodes(stage)
    const past = layout.him + 90
    return ({ action, t }) => {
      if (action === 0) {
        const sweep = Math.sin(Math.PI * t)
        writeBoss(boss, layout, { ...CALLIOPE, arm: lerp(ARM_REST, -38, sweep) })
        const dash = within(t, 0.25, 0.75)
        const x = lerp(layout.him - 90, past, dash)
        place(e.speed, x, GROUND - 40 * layout.k, bump(dash), 0, layout.k)
        hide(e.note, e.flash)
        return him(layout, x, dash > 0 && dash < 1 ? DASH : READY)
      }
      hide(e.speed)
      writeBoss(boss, layout, { ...CALLIOPE, steam: bump(within(t, 0, 0.3)) })
      // the note leaves the middle pipe's top and arcs toward him; he meets it at the top of his jump
      const [pipeX, pipeH] = PIPES[2]
      const top: [number, number] = [layout.boss + pipeX * layout.bossK, GROUND + (WAGON_TOP - pipeH) * layout.bossK]
      const meet: [number, number] = [past + 40, GROUND - 260]
      const flight = within(t, 0, 0.55)
      const slapped = t >= 0.55
      place(e.note, lerp(top[0], meet[0], flight), lerp(top[1], meet[1], flight) - 120 * bump(flight), slapped ? 0 : 1, -30 * flight)
      flashAt(e, meet[0], meet[1], within(t, 0.55, 0.8))
      const jump = within(t, 0.3, 1)
      const lift = jump < 0.45 ? hop(jump / 0.9, 210) : jump < 0.6 ? 210 : 210 + 60 * within(jump, 0.6, 1)
      const pose = jump <= 0 ? READY : jump < 0.45 ? LEAP : SLAP
      return him(layout, past, pose, lift)
    }
  },
}

/** The phase change: the calliope shudders in a cloud of steam and rises on its stilts into a tall organ;
 *  its pipes fire notes in an arc and he dashes through the gap. */
const tech: SceneDef = {
  script: [1800, 1500],
  kit: 'piston',
  him: true,
  back: () => null,
  bind: (stage, layout) => {
    const boss = bossNodes(stage)
    const e = effectNodes(stage)
    return ({ action, t }) => {
      if (action === 0) {
        const rising = within(t, 0.3, 0.9)
        writeBoss(boss, layout, { ...ORGAN, tall: rising, shake: 8 * Math.sin(t * 50) * (1 - rising), steam: bump(within(t, 0.1, 1)) })
        place(e.cloud, layout.boss, GROUND - 140 * layout.bossK, 0.9 * bump(within(t, 0.15, 0.85)), 0, layout.bossK * (0.8 + 0.4 * t))
        hide(e.speed, ...e.shot)
        return him(layout, layout.him, mix(READY, CROUCH, bump(t)))
      }
      hide(e.cloud)
      writeBoss(boss, layout, { ...ORGAN, steam: bump(within(t, 0, 0.4)) })
      // three notes leave the pipes and land in a row on the floor; the gap is between the first two
      const notes = [0, 1, 2]
      notes.forEach((i) => {
        const u = within(t, i * 0.12, 0.5 + i * 0.12)
        const land = layout.him - 120 + i * 210
        place(e.shot[i], lerp(layout.boss, land, u), lerp(GROUND - 520 * layout.bossK, GROUND - 20, u) - 200 * bump(u), u > 0 && u < 1 ? 1 : 0, u * 600, 1.8)
        place(e.burst[i], land, GROUND - 24, bump(within(t, 0.5 + i * 0.12, 0.7 + i * 0.12)), 0, 0.9)
      })
      const dash = within(t, 0.45, 0.85)
      const x = lerp(layout.him, layout.him + 100, dash)
      place(e.speed, x, GROUND - 40 * layout.k, bump(dash), 0, layout.k)
      return him(layout, x, dash > 0 && dash < 1 ? DASH : READY)
    }
  },
}

/** Phase 2: he slaps a second pink note to charge up and fires the charged shot into the keyboard, which
 *  buckles and spits its keys. */
const services: SceneDef = {
  script: [1500, 1600],
  kit: 'piston',
  him: true,
  back: () => null,
  bind: (stage, layout) => {
    const boss = bossNodes(stage)
    const e = effectNodes(stage)
    return ({ action, t }) => {
      const hand = handOf(layout, layout.him)
      if (action === 0) {
        writeBoss(boss, layout, ORGAN)
        const [pipeX, pipeH] = PIPES[3]
        const top: [number, number] = [layout.boss + pipeX * layout.bossK, GROUND + (WAGON_TOP - pipeH * (1 + GROW) - RISE) * layout.bossK]
        const meet: [number, number] = [layout.him + 30, GROUND - 240]
        const flight = within(t, 0, 0.55)
        place(e.note, lerp(top[0], meet[0], flight), lerp(top[1], meet[1], flight) - 100 * bump(flight), t >= 0.55 ? 0 : 1, -30 * flight)
        flashAt(e, meet[0], meet[1], within(t, 0.55, 0.8))
        const jump = within(t, 0.3, 0.95)
        const pose = jump <= 0 || jump >= 1 ? CHARGE : jump < 0.4 ? LEAP : SLAP
        place(e.charge, hand[0], hand[1], within(t, 0.85, 1) * 0.9, 0, 0.4)
        hide(e.cloud)
        return him(layout, layout.him, pose, hop(jump, 220))
      }
      hide(e.note, e.flash)
      const [fx0, fy0] = bossFront(layout, 1)
      const fly = within(t, 0, 0.45)
      const hit = within(t, 0.45, 1)
      place(e.charge, lerp(hand[0], fx0, fly), lerp(hand[1], fy0 + 70 * layout.bossK, fly), fly < 1 ? 1 : 0, fly * 900, 0.4 + 0.8 * fly)
      place(e.cloud, fx0 + 20, fy0 + 60 * layout.bossK, 0.85 * bump(hit), 0, 0.5 + 0.4 * hit)
      writeBoss(boss, layout, { ...ORGAN, keys: hit, shake: 10 * Math.sin(hit * 40) * (1 - hit), steam: 0.8 * hit })
      pushIn(e, fx0, fy0, bump(hit))
      return him(layout, layout.him, fly < 1 ? CHARGE : mix(CHARGE, RECOIL, bump(hit) + (hit >= 1 ? 1 : 0)))
    }
  },
}

/** The pit and the three trapezes over it, for the high wire phase and the core. */
function HighWire({ layout, open }: { layout: Layout; open: boolean }) {
  return (
    <>
      <ellipse cx={layout.him + layout.gap * 0.2} cy={GROUND + 40} rx={layout.gap * 2.4} ry={70} fill={INK} />
      <g data-fx="floor" opacity={open ? 0 : 1}>
        <ellipse cx={layout.him + layout.gap * 0.2} cy={GROUND + 40} rx={layout.gap * 2.4} ry={70} fill={HOSE.footlight} stroke={INK} strokeWidth={4} />
      </g>
      {[-1, 0, 1].map((i) => (
        <g key={i} data-fx={`trapeze-${i + 1}`} transform={`translate(${layout.him + i * layout.gap} ${open ? TRAPEZE_Y : -200})`}>
          <path d={`M-40 0 L-40 ${-TRAPEZE_Y - 260} M40 0 L40 ${-TRAPEZE_Y - 260}`} stroke={INK} strokeWidth={4} />
          <rect x={-48} y={-6} width={96} height={14} rx={6} fill={HOSE.gold} stroke={INK} strokeWidth={4} />
        </g>
      ))}
    </>
  )
}

/** The trapeze bars hang at this height; he stands on them. */
const TRAPEZE_Y = GROUND - 230

/** Phase 3: the organ stamps and the ring floor drops into the pit; trapezes come down and he leaps from
 *  bar to bar while fire puffs sweep under them. */
const projects: SceneDef = {
  script: [1700, 1800],
  kit: 'piston',
  him: true,
  back: (layout) => <HighWire layout={layout} open={false} />,
  bind: (stage, layout) => {
    const boss = bossNodes(stage)
    const e = effectNodes(stage)
    const floor = fx(stage, 'floor')
    const bars = [1, 2, 3].map((i) => fx(stage, `trapeze-${i}`))
    const barX = (i: number): number => layout.him + (i - 1) * layout.gap
    const lift = GROUND - TRAPEZE_Y + 8
    return ({ action, t }) => {
      if (action === 0) {
        const stamp = within(t, 0, 0.3)
        writeBoss(boss, layout, { ...ORGAN, shake: 0, steam: bump(stamp) })
        const fall = within(t, 0.25, 0.6)
        transformTo(floor, `translate(0 ${r1(240 * fall ** 2)})`)
        fadeTo(floor, 1 - fall)
        const down = within(t, 0.35, 0.8)
        bars.forEach((bar, i) => translateTo(bar, barX(i), lerp(-200, TRAPEZE_Y, down)))
        // he leaps up onto the first bar as the floor goes
        const leap = within(t, 0.55, 1)
        const x = lerp(layout.him, barX(0), leap)
        hide(e.cloud)
        return him(layout, x, leap <= 0 ? READY : leap >= 1 ? CROUCH : LEAP, leap >= 1 ? lift : hop(leap, lift + 90) + lift * leap)
      }
      writeBoss(boss, layout, { ...ORGAN, steam: bump(t) })
      fadeTo(floor, 0)
      bars.forEach((bar, i) => transformTo(bar, `translate(${barX(i)} ${TRAPEZE_Y}) ${turnAbout(5 * Math.sin(t * 6 + i) * (1 - t), 0, -TRAPEZE_Y - 260)}`))
      // fire puffs sweep along under the bars, right to left
      place(e.cloud, lerp(layout.boss - 100, layout.him - 2 * layout.gap, t), GROUND + 20, 0.9 * bump(t), 0, 0.45)
      // a leap to the middle bar, then a hop in place as the fire passes under it
      const first = within(t, 0.1, 0.5)
      const second = within(t, 0.6, 0.9)
      const jumping = (first > 0 && first < 1) || (second > 0 && second < 1)
      return him(layout, lerp(barX(0), barX(1), first), jumping ? LEAP : CROUCH, lift + hop(first, 120) + hop(second, 90))
    }
  },
}

/** The final phase: the organ's doors fall open on its glowing boiler; he fires the super into it from his
 *  bar; a last steam blast, and he dashes through it to the far bar. */
const ventures: SceneDef = {
  script: [1300, 1500, 1300],
  kit: 'piston',
  him: true,
  back: (layout) => <HighWire layout={layout} open />,
  bind: (stage, layout) => {
    const boss = bossNodes(stage)
    const e = effectNodes(stage)
    const lift = GROUND - TRAPEZE_Y + 8
    const barX = (i: number): number => layout.him + (i - 1) * layout.gap
    const heartAt = (): [number, number] => [layout.boss + 40 * layout.bossK, GROUND - (160 + RISE) * layout.bossK]
    return ({ action, t }) => {
      const [hx, hy] = heartAt()
      const hand = handOf(layout, barX(1), lift)
      if (action === 0) {
        writeBoss(boss, layout, { ...ORGAN, doors: t, heart: within(t, 0.3, 1) })
        hide(e.beam, e.cloud, ...e.star)
        return him(layout, barX(1), mix(CROUCH, CHARGE, within(t, 0.5, 1)), lift)
      }
      if (action === 1) {
        const grow = within(t, 0, 0.35)
        const length = Math.hypot(hx - hand[0], hy - hand[1]) * grow
        const angle = (Math.atan2(hy - hand[1], hx - hand[0]) * 180) / Math.PI
        transformTo(e.beam, `translate(${r1(hand[0])} ${r1(hand[1])}) rotate(${angle.toFixed(1)})`)
        e.beamBar?.setAttribute('width', r1(Math.max(1, length)).toString())
        fadeTo(e.beam, t < 0.9 ? 1 : 1 - within(t, 0.9, 1))
        e.star.forEach((star, i) => {
          const u = (t * 3 + i / 5) % 1
          place(star, lerp(hand[0], hx, u), lerp(hand[1], hy, u) + 30 * Math.sin(u * 8 + i), grow >= 1 && t < 0.92 ? 1 : 0, u * 360, 0.8)
        })
        writeBoss(boss, layout, { ...ORGAN, doors: 1, heart: 1, crack: within(t, 0.5, 0.8), shake: 9 * Math.sin(t * 60) * bump(t) })
        pushIn(e, hx, hy, bump(t))
        return him(layout, barX(1), mix(CHARGE, RECOIL, bump(t)), lift)
      }
      hide(e.beam, ...e.star)
      writeBoss(boss, layout, { ...ORGAN, doors: 1, heart: 1, crack: 1, steam: 1 })
      place(e.cloud, lerp(hx - 80, barX(0), t), lerp(hy, TRAPEZE_Y - 80, t), 0.85 * bump(t), 0, 0.6 + 0.4 * t)
      const dash = within(t, 0.3, 0.7)
      const x = lerp(barX(1), barX(2), dash)
      place(e.speed, x, TRAPEZE_Y - 40 * layout.k, bump(dash), 0, layout.k)
      return him(layout, x, dash > 0 && dash < 1 ? DASH : READY, lift)
    }
  },
}

/** The Musician's phase: the bass drum on the calliope's front beats out shock rings along the floor and he
 *  jumps them; a pink cymbal flies off its rim, he slaps it away and drums the skin until it splits. */
const bands: SceneDef = {
  script: [1600, 1800],
  kit: 'drum',
  him: true,
  back: () => (
    <>
      {[0, 1].map((i) => (
        <ellipse key={i} data-fx={`ring-${i}`} rx={60} ry={14} fill="none" stroke={INK} strokeWidth={6} opacity={0} />
      ))}
    </>
  ),
  bind: (stage, layout) => {
    const boss = bossNodes(stage)
    const e = effectNodes(stage)
    const rings = [0, 1].map((i) => fx(stage, `ring-${i}`))
    const drumX = layout.boss - 196 * layout.bossK
    const at = drumX - 70 * layout.k
    return ({ action, t }) => {
      if (action === 0) {
        writeBoss(boss, layout, CALLIOPE)
        rings.forEach((ring, i) => {
          const u = within(t, i * 0.4, 0.6 + i * 0.4)
          place(ring, lerp(drumX, layout.him - 300, u), GROUND - 10, u > 0 && u < 1 ? 1 : 0, 0, 1 + u)
        })
        // each ring reaches him at about a third of the way; he hops it
        const lift = hop(within(t, 0.12, 0.42), 150) + hop(within(t, 0.52, 0.82), 150)
        hide(e.note, e.flash)
        return him(layout, layout.him, lift > 0 ? LEAP : READY, lift)
      }
      rings.forEach((ring) => fadeTo(ring, 0))
      const meet: [number, number] = [layout.him + 40, GROUND - 230]
      const flight = within(t, 0, 0.35)
      place(e.note, lerp(drumX, meet[0], flight), lerp(GROUND - 230 * layout.bossK, meet[1], flight) - 90 * bump(flight), t < 0.35 ? 1 : 0, 400 * flight)
      flashAt(e, meet[0], meet[1], within(t, 0.35, 0.55))
      const slap = within(t, 0.15, 0.5)
      if (slap < 1) {
        writeBoss(boss, layout, CALLIOPE)
        return him(layout, layout.him, slap > 0.4 ? SLAP : slap > 0 ? LEAP : READY, hop(slap, 200))
      }
      // over to the drum and down on its skin, beat after beat, until it splits
      const go = within(t, 0.5, 0.65)
      const beats = within(t, 0.65, 1)
      writeBoss(boss, layout, { ...CALLIOPE, split: within(beats, 0.7, 0.9), shake: 4 * Math.sin(beats * 30) * (1 - beats) })
      const pose = go < 1 ? run(go * 2) : beats >= 1 ? STICKS_UP : mix(STICKS_UP, STICKS_DOWN, Math.abs(Math.sin(beats * Math.PI * 4)))
      return him(layout, lerp(layout.him, at, go), pose)
    }
  },
}

/** The Martial Artist's phase: the boxing glove springs at him and he dashes under it, lands a jumping knee
 *  on the spring and sends the pink glove back into the wagon with a round kick. */
const muayThai: SceneDef = {
  script: [1400, 1800],
  kit: 'glove',
  him: true,
  back: () => null,
  bind: (stage, layout) => {
    const boss = bossNodes(stage)
    const e = effectNodes(stage)
    const under = layout.him + 120
    return ({ action, t }) => {
      if (action === 0) {
        const lunge = bump(within(t, 0, 0.9))
        writeBoss(boss, layout, { ...CALLIOPE, spring: lunge })
        const dash = within(t, 0.25, 0.7)
        const x = lerp(layout.him - 60, under, dash)
        place(e.speed, x, GROUND - 40 * layout.k, bump(dash), 0, layout.k)
        hide(e.flash)
        return him(layout, x, dash > 0 && dash < 1 ? DASH : READY)
      }
      hide(e.speed)
      const knee = within(t, 0, 0.45)
      const kick = within(t, 0.5, 0.85)
      const reach = 0.55 * bump(within(t, 0, 0.5))
      const dent = within(t, 0.6, 0.85)
      writeBoss(boss, layout, { ...CALLIOPE, spring: kick > 0 ? reach * (1 - kick) : reach, dent, shake: 8 * Math.sin(dent * 30) * bump(dent) })
      flashAt(e, under + 70, GROUND - 150, within(t, 0.6, 0.8))
      const pose = kick > 0 ? mix(READY, KICK, Math.min(1, kick * 2)) : knee > 0 ? KNEE : READY
      return him(layout, under, pose, hop(knee, 140))
    }
  },
}

/** The knockout: the lettering slams over the ring with a shake; the organ sags, its pipes droop and puff
 *  one by one, its eyes cross out, and he takes his bow. */
const contact: SceneDef = {
  script: [1200, 1800],
  kit: 'piston',
  him: true,
  back: () => null,
  front: () => (
    <g data-fx="ko" opacity={0}>
      <path d="M-260 -10 L-200 -90 L-120 -60 L-60 -130 L20 -80 L90 -140 L150 -70 L240 -100 L220 -10 L280 50 L180 80 L210 150 L90 110 L20 170 L-60 110 L-150 150 L-140 70 L-250 60 Z" fill={HOSE.gold} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <text x={0} y={40} textAnchor="middle" fontFamily="var(--hose-lettering), serif" fontSize={140} fill={HOSE.red} stroke={INK} strokeWidth={6} paintOrder="stroke">
        K.O.!
      </text>
    </g>
  ),
  bind: (stage, layout) => {
    const boss = bossNodes(stage)
    const e = effectNodes(stage)
    const ko = fx(stage, 'ko')
    const center: [number, number] = [(layout.him + layout.boss) / 2, GROUND - 520]
    return ({ action, t }) => {
      const slam = action === 0 ? t : 1
      const size = slam < 0.6 ? lerp(2.4, 0.9, slam / 0.6) : lerp(0.9, 1, within(slam, 0.6, 1))
      place(ko, center[0], center[1], within(slam, 0, 0.2), -6, size * (layout.phone ? 0.6 : 1))
      const sag = action === 0 ? 0 : within(t, 0, 0.6)
      writeBoss(boss, layout, { ...ORGAN, tall: 1 - 0.7 * sag, doors: 1, heart: 1 - 0.6 * sag, crack: 1, sag, seq: action === 0 ? null : within(t, 0.3, 1), shake: action === 0 ? 10 * Math.sin(t * 50) * (1 - t) : 0 })
      pushIn(e, center[0], center[1], action === 0 ? bump(within(t, 0.4, 1)) * 0.5 : 0)
      const bow = action === 0 ? 0 : within(t, 0.35, 0.8)
      return him(layout, layout.him, mix(READY, BOW, bow))
    }
  },
}

const SCENE_DEFS: Record<SceneId, SceneDef> = { hero, about, work, tech, services, projects, ventures, bands, muayThai, contact }

export interface Scene {
  id: SceneId
  def: SceneDef
  layout: Layout
  /** His kit: the profession the page shows. */
  kit: Profession
  /** The section's slot; the hero and the contact have none. */
  slot: SectionSlot | null
}

const sceneOf = (id: SceneId, slot: SectionSlot | null, profession: Profession, phone: boolean): Scene => ({
  id,
  def: SCENE_DEFS[id],
  layout: LAYOUT[phone ? 'phone' : 'wide'],
  kit: profession,
  slot,
})

/** The page as scenes: the hero, one per section the profession shows in reading order, the contact. */
export const scenesOf = (slots: readonly SectionSlot[], profession: Profession, phone: boolean): Scene[] => [
  sceneOf('hero', null, profession, phone),
  ...slots.map((slot) => sceneOf(slot.id, slot, profession, phone)),
  sceneOf('contact', null, profession, phone),
]

