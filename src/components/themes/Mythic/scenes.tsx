'use client'

import type { ReactNode } from 'react'
import type { Labels } from '@/lib/cv/labels'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import { stageItems } from '@/lib/cv/stageItems'
import { cssVars } from '@/lib/cssVars'
import { hop } from '@/lib/motion/arc'
import { elapsedOf, sceneEnd, sceneLength, type Playhead, type SceneScript } from '@/lib/scroll/player'
import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, frames, fx, lerp, r1, transformTo } from '@/components/themes/shared/stageNodes'
import { Stage } from '@/components/themes/shared/theatre/Stage'
import type { LayerMotions, StageWriter, TheatreScene } from '@/components/themes/shared/theatre/useTheatre'
import { Colossus, EarthHand, GriffinRider, Harpy, Seer, SerpentHead, SerpentNeck, Steed, Titan, TornWings, UndeadKing, WarGod, WingedHorse, WingedMan, type WingedFrame } from './foes'
import { MYTH } from './palette'
import { ASTRIDE, REST, bodyTransform, jointTransform, poseAt, type Joint, type Move, type Pose } from './rig'
import { FIGURE_BOX, HeroFigure } from './sprite'
import { ZONE_OF, type Side, type Zone } from './stage'
import s from './sprite.module.css'

// His scenes on the shared theatre, one per part of the page, over the fixed places of the run (depths.tsx):
// God of War and God of War II told in their order, one beat a section (score/C75/story.md,
// research/2026-11-25-deep-gow12/notes.md). Each scene is one to three actions played by the shared scene
// player (src/lib/scroll/player.ts) at the scene's own pace, back on the way up, the end frame held; he is
// drawn once in every scene, small against monsters that fill the screen, and every boss ends on the
// finisher's ring closing over it.
//   Hero, the storm sea: rise (the serpent's king head lunges and slams the deck as he rolls clear); cut (his
//     blades fly out on their chains in arcs of fire across its brow); finish (the mast splinters and he
//     drives it down through the skull, pinning the head to the deck).
//   About, burning Athens: cut (the harpies diving at the seer's ropes cut down in a ring of fire); catch (the
//     last rope gives and he leaps to catch her wrist); haul (up onto the ledge, the war god turning his head
//     of fire over the city).
//   Work, the desert: blow (the great horn); rise (the chained Titan crawls up out of the sand, his hand down
//     beside him); climb (up the chain and the arm to the temple gate on his back).
//   Tech Stack, the temple: crank (the lever turns the great ring); leap (over the saws rising out of the
//     floor); align (the rings lock and the light shines down the hall onto him).
//   Services, the last duel: open (the box, the light, and he grows to the god's height); clash (the god's
//     bladed legs on the giant sword); finish (the sword through the god, who bursts into light).
//   Projects, Rhodes: slam (the bronze fist on the quay, the roll, the cut); draw (the great blade out of the
//     stone in a column of light); finish (into the jaw and out through the cracked head as the giant falls).
//   Ventures, the sky and the island: cut (the griffin rider cut down from the winged horse); heave (landed,
//     the windlass turned); pull (the stone steeds rear and the island moves on its chains).
//   Bands, the bog: pound (the king's hammer beat after beat, the firm ground shrinking, the rolls); cut (his
//     blades on the hammer arm); finish (the hammer torn from the grip and laid on his shoulder, the king
//     gone into the mist).
//   Muay Thai, the chasm: grab (the winged man takes him off the ledge into the fall); knees (the clinch won,
//     the knees up); finish (the wings torn off, the winged man gone into the dark, him gliding).
//   Contact, the mountain of the gods: call (the blades raised, the earth Titan's hand rising under him);
//     carry (the hand lifts him up the mountain to the temple).

export type SceneId = 'hero' | SectionId | 'contact'

/** The field pushes in a little across its scene. */
export const FIELD_MOTION: LayerMotions = { figure: { zoom: [1.0, 1.04], lift: [0, -1] } }

// The field: a 1920 by 1080 picture cut to the screen from its foot, the floor at FLOOR. Each section's scene
// is drawn round its own middle (x 0) and set in the band of its side: from lg the cards take one side and
// the scene plays in the other, so a band's middle sits at BAND_X of its side and his action keeps within
// about 220 units of it, clear of the cards from 1024 px to the widest screen. Under lg the cards stack under
// the scene and sprite.module.css frames it with the variables phoneFrame writes. The hero keeps its own place,
// left of his name.
const FIELD = { width: 1920, height: 1080 }
const FLOOR = 1000
const HERO_HEIGHT = 200
const HERO_SCALE = HERO_HEIGHT / FIGURE_BOX.height
const BAND_X: Record<Side, number> = { right: 1440, left: 460 }
// A figure of his own size: its 60 by 80 box with the feet at (30, 78).
const BOX_FEET = { x: 30, y: 78 }

// ---- him ----

/** What his hands hold: both blades, the horn, the great sword, the hammer, or nothing. */
type Held = 'blades' | 'horn' | 'sword' | 'hammer' | 'none'

/** The things each hold shows; every other held thing is hidden. */
const SHOWN: Record<Held, readonly string[]> = {
  blades: ['held-blades', 'held-blade-far'],
  horn: ['held-horn', 'held-blade-far'],
  sword: ['held-sword'],
  hammer: ['held-hammer', 'held-blade-far'],
  none: [],
}

const HELD_NODES = ['held-blades', 'held-blade-far', 'held-horn', 'held-sword', 'held-hammer'] as const

interface HeroNodes {
  root: Element | null
  body: Element | null
  joints: Array<{ joint: Joint; node: Element }>
  held: Array<{ name: string; node: Element | null }>
}

const heroNodes = (stage: ParentNode): HeroNodes => {
  const root = fx(stage, 'hero')
  return {
    root,
    body: root?.querySelector('[data-body]') ?? null,
    joints: Array.from(root?.querySelectorAll<SVGGElement>('[data-joint]') ?? [], (node) => ({ joint: node.dataset.joint as Joint, node })),
    held: HELD_NODES.map((name) => ({ name, node: root ? fx(root, name) : null })),
  }
}

interface Placing {
  /** Off the floor. */
  lift?: number
  /** Times his height. */
  size?: number
  /** Turned round his middle, in degrees (a roll). */
  spin?: number
  shown?: number
}

const heroAt = (x: number, { lift = 0, size = 1, spin = 0 }: Placing = {}): string => {
  const scale = HERO_SCALE * size
  return `translate(${r1(x - FIGURE_BOX.feetX * scale)} ${r1(FLOOR - FIGURE_BOX.feetY * scale - lift)}) scale(${scale.toFixed(3)}) rotate(${r1(spin)} 90 120)`
}

/** Stands him at `x` in `pose`, holding `held`, placed as `place` says. */
const poseHero = (nodes: HeroNodes, x: number, pose: Pose, held: Held = 'blades', place: Placing = {}): void => {
  transformTo(nodes.root, heroAt(x, place))
  fadeTo(nodes.root, place.shown ?? 1)
  transformTo(nodes.body, bodyTransform(pose))
  for (const { joint, node } of nodes.joints) transformTo(node, jointTransform(joint, pose[joint]))
  for (const { name, node } of nodes.held) fadeTo(node, SHOWN[held].includes(name) ? 1 : 0)
}

/** His pose a share of the way through a move. */
const at = (move: Move, t: number): Pose => poseAt(move, t)

/** A move played `times` over a share `t` (a walk, a crank, the knees). */
const cycle = (move: Move, t: number, times: number): Pose => poseAt(move, t >= 1 ? 1 : (t * times) % 1)

/** Where his near hand is at x, with the arms thrown forward (the swing's release), `size` times his height. */
const handOut = (x: number, lift = 0, size = 1) => ({ x: x + 70 * size, y: FLOOR - 120 * size - lift })

function Hero({ x, profession, figure = false }: { x: number; profession: Profession; figure?: boolean }) {
  return (
    <g data-fx="hero" data-worlds-figure={figure ? '' : undefined} transform={heroAt(x)}>
      <HeroFigure profession={profession} />
    </g>
  )
}

// ---- the others of his size: placed by their feet, mirrored when they face him from his left ----

/** A figure's box with its feet at (x, FLOOR - lift), `size` times, turned `turn` degrees. */
const figureAt = (x: number, size: number, lift = 0, turn = 0): string =>
  `translate(${r1(x)} ${r1(FLOOR - lift)}) rotate(${r1(turn)}) scale(${size} ${size}) translate(${-BOX_FEET.x} ${-BOX_FEET.y})`

function Figure({ name, x, size, lift = 0, children }: { name: string; x: number; size: number; lift?: number; children: ReactNode }) {
  return (
    <g data-fx={name} transform={figureAt(x, size, lift)}>
      {children}
    </g>
  )
}

/** A figure's writer: placed, sized, turned, faded, shown in one of its frames. */
function figureWriter(stage: HTMLElement, name: string, size: number, first?: string) {
  const node = fx(stage, name)
  const show = first ? frames(node, first) : () => undefined
  return (x: number, { lift = 0, turn = 0, shown = 1, frame }: { lift?: number; turn?: number; shown?: number; frame?: string } = {}) => {
    if (frame) show(frame)
    transformTo(node, figureAt(x, size, lift, turn))
    fadeTo(node, shown)
  }
}

const turnTo = (stage: HTMLElement, name: string, [x, y]: readonly [number, number]) => {
  const node = fx(stage, name)
  return (turn: number) => transformTo(node, `rotate(${r1(turn)} ${x} ${y})`)
}

// ---- the signs of the games: the blades' arcs of fire, the finisher's ring, sparks ----

/** The blades thrown out on their chains: two arcs of fire swept round his hand, a blade at each lead end on
 *  its chain. Drawn pointing forward; the writer turns it to where the swing is. */
function Swipe({ name }: { name: string }) {
  const arc = 'M79 -216 A230 230 0 0 1 79 216 A260 260 0 0 0 79 -216 Z'
  return (
    <g data-fx={name} opacity="0">
      <path d={arc} fill={MYTH.fireRed} stroke={MYTH.inkLine} strokeWidth="3" transform="rotate(-18) scale(0.86)" />
      <path d={arc} fill={MYTH.fire} stroke={MYTH.inkLine} strokeWidth="3" />
      <path d="M86 -190 A205 205 0 0 1 86 190" fill="none" stroke={MYTH.fireCore} strokeWidth="8" />
      <path d="M0 0 L79 216" stroke={MYTH.chain} strokeWidth="5" strokeDasharray="8 5" />
      <path d="M79 216 L60 250 L96 236 L120 196 Z" fill={MYTH.bronzeLight} stroke={MYTH.inkLine} strokeWidth="3" />
    </g>
  )
}

/** A swipe's writer: at (x, y), pointing `angle` degrees (0 forward, clockwise down), `reach` times its size. */
const swipeWriter = (stage: HTMLElement, name: string) => {
  const node = fx(stage, name)
  return (x: number, y: number, angle: number, shown: number, reach = 1) => {
    transformTo(node, `translate(${r1(x)} ${r1(y)}) rotate(${r1(angle)}) scale(${reach.toFixed(3)})`)
    fadeTo(node, shown)
  }
}

/** A swing's arc over `t` (0 to 1 of the swing move): unseen while he winds up, swept from over his shoulder
 *  to forward and down as the blades fly, fading as it ends. */
const swing = (write: ReturnType<typeof swipeWriter>, x: number, y: number, t: number, reach = 1) => {
  const sweep = ramp(t, 0.35, 0.7)
  write(x, y, lerp(-120, 30, sweep), sweep > 0 ? 1 - ramp(t, 0.75, 1) : 0, reach)
}

/** The finisher's ring: a bronze ring that closes over a weakened foe, flashes once when the blow lands. */
function Prompt({ name }: { name: string }) {
  return (
    <g data-fx={name} opacity="0">
      <circle r="86" fill="none" stroke={MYTH.inkLine} strokeWidth="18" />
      <circle r="86" fill="none" stroke={MYTH.bronze} strokeWidth="11" />
      <circle r="50" fill={MYTH.inkLine} opacity="0.5" />
      <circle r="50" fill="none" stroke={MYTH.goldPale} strokeWidth="6" />
      {[0, 90, 180, 270].map((angle) => (
        <path key={angle} d="M0 -104 L-10 -122 H10 Z" fill={MYTH.gold} stroke={MYTH.inkLine} strokeWidth="2" transform={`rotate(${angle})`} />
      ))}
    </g>
  )
}

/** The ring's writer: closing from wide over `t` (0 to 0.6), held, gone as the finisher lands (`landed`). */
const promptWriter = (stage: HTMLElement, name: string) => {
  const node = fx(stage, name)
  return (x: number, y: number, t: number, landed: number) => {
    const close = ramp(t, 0, 0.6)
    transformTo(node, `translate(${r1(x)} ${r1(y)}) scale(${(2.4 - 1.4 * close + 0.5 * landed).toFixed(3)})`)
    fadeTo(node, ramp(t, 0, 0.2) * (1 - landed))
  }
}

/** Sparks off a blow. */
function Sparks({ name, fill = MYTH.fireCore }: { name: string; fill?: string }) {
  return (
    <g data-fx={name} opacity="0">
      {[0, 40, 90, 140, 200, 250, 310].map((angle) => (
        <path key={angle} d="M0 -14 L5 -64 L0 -54 L-5 -64 Z" fill={fill} stroke={MYTH.inkLine} strokeWidth="2" transform={`rotate(${angle})`} />
      ))}
      <circle r="18" fill={MYTH.fire} opacity="0.6" />
    </g>
  )
}

/** A spark's writer: at (x, y), bursting over `t` (0 to 1), `size` times. */
const sparkWriter = (stage: HTMLElement, name: string) => {
  const node = fx(stage, name)
  return (x: number, y: number, t: number, size = 1) => {
    transformTo(node, `translate(${r1(x)} ${r1(y)}) scale(${((0.6 + 1.2 * t) * size).toFixed(3)})`)
    fadeTo(node, t > 0 && t < 1 ? 1 - t : 0)
  }
}

/** A burst of light, the box's and the god's end. */
function Burst({ name }: { name: string }) {
  return (
    <g data-fx={name} opacity="0">
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d="M-14 0 L0 -420 L14 0 Z" fill={MYTH.goldPale} opacity="0.7" transform={`rotate(${i * 30})`} />
      ))}
      <circle r="120" fill={MYTH.olympusLow} opacity="0.9" />
    </g>
  )
}

const burstWriter = (stage: HTMLElement, name: string) => {
  const node = fx(stage, name)
  return (x: number, y: number, size: number, shown: number) => {
    transformTo(node, `translate(${r1(x)} ${r1(y)}) scale(${size.toFixed(3)})`)
    fadeTo(node, shown)
  }
}

// ---- the scenes ----

interface SceneSpec {
  /** Its actions' wished lengths in ms, one to three. */
  script: SceneScript
  /** On a phone: the middle of his action in the scene's own x, set in the half his side names, and the fit. */
  phone: { focus: number; fit: number }
  figure: (scene: MythScene) => ReactNode
  bind: (stage: HTMLElement) => (play: Playhead) => void
}

// A phone shows about 500 field units across the field's middle (x 960) and the whole height: the scene is
// fitted by `fit`, its feet at PHONE.floor (two thirds down, above the cards), and the middle of his action
// PHONE.offset into the half his side names. The hero stands higher, under the outfit switcher, above his
// name and lines at the foot of the first screen.
const PHONE = { middle: FIELD.width / 2, offset: 120, floor: 720, heroFloor: 388 } as const

/** The variables sprite.module.css places a scene's band with: from lg its middle at its side's BAND_X; on a
 *  phone fitted and its action set in its half. */
const bandFrame = (id: SceneId, side: Side, { focus, fit }: SceneSpec['phone']) => {
  const hero = id === 'hero'
  const screen = hero ? PHONE.middle : PHONE.middle + (side === 'right' ? PHONE.offset : -PHONE.offset)
  const floor = hero ? PHONE.heroFloor : PHONE.floor
  return cssVars({
    '--band-x': hero ? 0 : BAND_X[side],
    '--phone-fit': fit.toFixed(3),
    '--phone-x': r1(screen - focus * fit),
    '--phone-y': r1(floor - FLOOR * fit),
  })
}

/** How far action `i` has played: all of it before, its eased share while it plays, none after. */
const share = ({ action, t }: Playhead, i: number): number => (action > i ? 1 : action === i ? t : 0)

/** Runs the writer of the action playing (the last one once the script is over). */
const byAction = ({ action }: Playhead, writers: ReadonlyArray<() => void>): void => writers[Math.min(action, writers.length - 1)]()

/** The storm's rain, the same slanted sheet in every place that has one; `t` drives it down the screen. */
function Rain({ name, from, to }: { name: string; from: number; to: number }) {
  return (
    <g data-fx={name} opacity="0.5">
      {Array.from({ length: 46 }, (_, i) => (
        <path key={i} d={`M${from + ((i * 151) % (to - from))} ${((i * 97) % 1200) - 200} l-26 70`} stroke={MYTH.seaFoam} strokeWidth="3" />
      ))}
    </g>
  )
}

const rainWriter = (stage: HTMLElement, name: string) => {
  const node = fx(stage, name)
  return (fall: number) => transformTo(node, `translate(${r1(-60 * fall)} ${r1((fall * 900) % 300)})`)
}

// Hero, the storm sea. The ship's deck across the foot, the mast left of the middle; the serpent's neck comes
// up out of the sea behind his name and its king head hangs over the deck, the snout towards him. It lunges
// and slams the planks where he stood as he rolls back; his blades cut across its brow and it sinks stunned on
// the deck; the ring closes over its eye, the mast's top breaks off into his hands and he drives it down
// through the skull. Everything he does stays left of his name (about x 830 at 1440 px).
const HERO = { x: 380, rolled: 240, leapTo: 470, mast: 560, root: [1560, 1340] as const, head: 1.3 }
// The head's root, its turn and its jaw at each beat: risen, lunging, slammed on the deck, stunned.
interface HeadAt {
  x: number
  y: number
  turn: number
  jaw: number
}
const HEAD_AT: Record<'risen' | 'lunge' | 'slammed' | 'recoil', HeadAt> = {
  risen: { x: 980, y: 330, turn: -18, jaw: 6 },
  lunge: { x: 960, y: 620, turn: 4, jaw: 28 },
  slammed: { x: 900, y: 930, turn: 8, jaw: 2 },
  recoil: { x: 940, y: 860, turn: -4, jaw: 18 },
}
const mixHead = (a: HeadAt, b: HeadAt, t: number): HeadAt => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), turn: lerp(a.turn, b.turn, t), jaw: lerp(a.jaw, b.jaw, t) })
const neckPath = (x: number, y: number) => `M${HERO.root[0]} ${HERO.root[1]} Q${r1(x + 380)} ${r1(y - 420)} ${r1(x + 40)} ${r1(y)}`
// The spar the mast's top becomes, 440 long, drawn from its top end.
const SPAR = 440

function Ship() {
  return (
    <>
      <rect x={0} y={FLOOR - 70} width={FIELD.width} height={20} fill={MYTH.deckShade} stroke={MYTH.inkLine} strokeWidth="4" />
      {[60, 200, 340, 480, 620, 760].map((x) => (
        <rect key={x} x={x} y={FLOOR - 110} width={14} height={50} fill={MYTH.deckShade} stroke={MYTH.inkLine} strokeWidth="3" />
      ))}
      <rect x={0} y={FLOOR} width={FIELD.width} height={FIELD.height - FLOOR} fill={MYTH.deck} stroke={MYTH.inkLine} strokeWidth="4" />
      <path d={`M0 ${FLOOR + 30} H${FIELD.width} M0 ${FLOOR + 62} H${FIELD.width}`} stroke={MYTH.deckShade} strokeWidth="4" />
      <path d={`M${HERO.mast - 18} ${FLOOR} L${HERO.mast - 12} ${FLOOR - 420} L${HERO.mast + 12} ${FLOOR - 430} L${HERO.mast + 18} ${FLOOR} Z`} fill={MYTH.deck} stroke={MYTH.inkLine} strokeWidth="4" />
      <path d={`M${HERO.mast - 12} ${FLOOR - 420} l8 -24 l8 18 l8 -22 l6 26`} fill="none" stroke={MYTH.inkLine} strokeWidth="4" />
    </>
  )
}

/** The mast's top above the break, with its yard and torn sail; it falls and becomes the spar he drives. */
function Spar() {
  return (
    <g data-fx="spar">
      <path d={`M-12 0 L12 0 L14 ${SPAR - 30} L0 ${SPAR} L-14 ${SPAR - 30} Z`} fill={MYTH.deck} stroke={MYTH.inkLine} strokeWidth="4" />
      <g data-fx="spar-yard">
        <path d="M-150 40 H150" stroke={MYTH.deckShade} strokeWidth="12" />
        <path d="M0 46 L140 46 L120 210 L80 180 L50 240 L8 200 Z" fill={MYTH.boneShade} stroke={MYTH.inkLine} strokeWidth="3" />
      </g>
    </g>
  )
}

const hero: SceneSpec = {
  script: [1700, 1500, 1800],
  phone: { focus: 600, fit: 0.45 },
  figure: (scene) => (
    <>
      <SerpentNeck d={neckPath(HEAD_AT.risen.x, HEAD_AT.risen.y)} />
      <Ship />
      <g data-fx="serpent-head">
        <SerpentHead />
      </g>
      <Spar />
      <Hero x={HERO.x} profession={scene.profession} figure />
      <Swipe name="hero-swipe" />
      <Prompt name="hero-prompt" />
      <Sparks name="hero-hit" />
      <Rain name="hero-rain" from={0} to={1400} />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const neck = Array.from(fx(stage, 'serpent-neck')?.querySelectorAll('path') ?? [])
    const head = fx(stage, 'serpent-head')
    const jaw = turnTo(stage, 'serpent-jaw', [20, 10])
    const spar = fx(stage, 'spar')
    const yard = fx(stage, 'spar-yard')
    const swipe = swipeWriter(stage, 'hero-swipe')
    const prompt = promptWriter(stage, 'hero-prompt')
    const hit = sparkWriter(stage, 'hero-hit')
    const rain = rainWriter(stage, 'hero-rain')
    const placeHead = ({ x, y, turn, jaw: open }: HeadAt) => {
      transformTo(head, `translate(${r1(x)} ${r1(y)}) rotate(${r1(turn)}) scale(${-HERO.head} ${HERO.head})`)
      jaw(open)
      for (const path of neck) path.setAttribute('d', neckPath(x, y))
    }
    return (play) => {
      const [rise, cut, finish] = [share(play, 0), share(play, 1), share(play, 2)]
      rain(rise + cut + finish)
      // the head: risen, the lunge and the slam on the planks, the cut's recoil, stunned on the deck
      const lunge = ramp(rise, 0, 0.45)
      const slam = ramp(rise, 0.45, 0.7)
      const recoil = bell(cut, 0.45, 1)
      const headNow = rise < 0.45 ? mixHead(HEAD_AT.risen, HEAD_AT.lunge, lunge) : mixHead(HEAD_AT.lunge, HEAD_AT.slammed, slam)
      placeHead(play.action === 0 ? headNow : mixHead(HEAD_AT.slammed, HEAD_AT.recoil, recoil))
      // the finisher: the mast's top breaks and falls into his hands, he leaps and drives it down through the skull
      const fall = ramp(finish, 0.05, 0.3)
      const leap = ramp(finish, 0.3, 0.6)
      const drive = ramp(finish, 0.6, 0.8)
      const x = lerp(HERO.rolled, HERO.leapTo, leap)
      const top = { x: HERO.mast, y: FLOOR - 430 - SPAR }
      const held = { x: x + 40, y: FLOOR - 200 - SPAR - hop(leap, 160) }
      const through = { x: x + 150, y: FLOOR - SPAR + 60 }
      const sparAt = finish < 0.3 ? { x: lerp(top.x, held.x, fall), y: lerp(top.y, held.y, fall) } : finish < 0.6 ? held : { x: lerp(held.x, through.x, drive), y: lerp(held.y, through.y, drive) }
      transformTo(spar, `translate(${r1(sparAt.x)} ${r1(sparAt.y)}) rotate(${r1(-30 * bell(fall, 0, 1))})`)
      fadeTo(yard, 1 - ramp(finish, 0.05, 0.2))
      prompt(HEAD_AT.slammed.x - 220, HEAD_AT.slammed.y - 120, finish, ramp(finish, 0.75, 0.8))
      hit(through.x, FLOOR - 70, ramp(finish, 0.75, 1), 1.6)
      byAction(play, [
        () => poseHero(him, lerp(HERO.x, HERO.rolled, ramp(rise, 0.4, 0.8)), at('roll', ramp(rise, 0.4, 0.8)), 'blades', { spin: -360 * ramp(rise, 0.45, 0.75) }),
        () => poseHero(him, HERO.rolled, at('swing', cut)),
        () => poseHero(him, x, finish < 0.6 ? at('thrust', ramp(finish, 0.2, 0.6) * 0.5) : at('thrust', 0.5 + ramp(finish, 0.6, 0.9) * 0.5), finish < 0.25 ? 'blades' : 'none', { lift: hop(leap, 160) }),
      ])
      const hand = handOut(HERO.rolled)
      swing(swipe, hand.x - 40, hand.y, cut, 1.35)
      hit(HEAD_AT.slammed.x - 380, HEAD_AT.slammed.y - 90, play.action === 1 ? ramp(cut, 0.55, 0.85) : 0, 1.3)
    }
  },
}

// About, burning Athens at night. The temple's broken ledge runs out over the gulf on his side; the seer hangs
// from her last ropes off a beam beyond its edge; two harpies dive at the ropes; far off on the burning
// skyline the war god stands as tall as the sky. His blades cut both harpies down in a ring of fire; the last
// rope gives, and he leaps to the edge and catches her wrist; he hauls her up beside him, and the war god turns
// his head of fire towards them.
const ABOUT = { hero: -150, edge: 120, catchAt: 70, seer: 220, seerSafe: 190, beam: [80, 340] as const, harpies: [[200, 430], [320, 520]] as const, god: { x: 360, sink: 520, size: 1.7 } }

function Ledge() {
  return (
    <>
      <path d={`M-700 ${FLOOR} H${ABOUT.edge} L${ABOUT.edge - 30} ${FLOOR + 80} H-700 Z`} fill={MYTH.templeShade} stroke={MYTH.inkLine} strokeWidth="4" />
      <path d={`M${ABOUT.edge} ${FLOOR} l-10 30 l14 20 l-24 30`} fill="none" stroke={MYTH.inkLine} strokeWidth="3" />
      <path d={`M${ABOUT.beam[0]} ${FLOOR - 520} H${ABOUT.beam[1]} l20 16 H${ABOUT.beam[0]} Z`} fill={MYTH.templeStone} stroke={MYTH.inkLine} strokeWidth="4" />
      <rect x={ABOUT.beam[0] - 60} y={FLOOR - 560} width={70} height={560} fill={MYTH.templeStone} stroke={MYTH.inkLine} strokeWidth="4" />
      {[0, 22, 44].map((dx) => (
        <path key={dx} d={`M${ABOUT.beam[0] - 52 + dx} ${FLOOR - 540} V${FLOOR - 10}`} stroke={MYTH.templeShade} strokeWidth="3" />
      ))}
    </>
  )
}

const about: SceneSpec = {
  script: [1600, 1500, 1600],
  phone: { focus: 60, fit: 0.62 },
  figure: (scene) => (
    <>
      <g data-fx="about-god" transform={`translate(${ABOUT.god.x} ${FLOOR + ABOUT.god.sink}) scale(${ABOUT.god.size})`} opacity="0.4">
        <WarGod />
      </g>
      <Ledge />
      <path data-fx="rope-0" d={`M${ABOUT.seer - 14} ${FLOOR - 510} L${ABOUT.seer - 8} ${FLOOR - 250}`} stroke={MYTH.leather} strokeWidth="6" />
      <path data-fx="rope-1" d={`M${ABOUT.seer + 30} ${FLOOR - 510} L${ABOUT.seer + 8} ${FLOOR - 250}`} stroke={MYTH.leather} strokeWidth="6" />
      <Figure name="seer" x={ABOUT.seer} size={2.6} lift={130}>
        <Seer />
      </Figure>
      {ABOUT.harpies.map(([x, lift], i) => (
        <Figure key={x} name={`harpy-${i}`} x={x} size={2.6} lift={lift}>
          <Harpy />
        </Figure>
      ))}
      <Hero x={ABOUT.hero} profession={scene.profession} />
      <Swipe name="about-swipe" />
      <Sparks name="about-hit" />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const seer = figureWriter(stage, 'seer', 2.6, 'hang')
    const harpies = ABOUT.harpies.map((_, i) => figureWriter(stage, `harpy-${i}`, 2.6))
    const ropes = [fx(stage, 'rope-0'), fx(stage, 'rope-1')]
    const god = fx(stage, 'about-god')
    const godFire = fx(stage, 'god-fire')
    const swipe = swipeWriter(stage, 'about-swipe')
    const hit = sparkWriter(stage, 'about-hit')
    return (play) => {
      const [cut, grab, haul] = [share(play, 0), share(play, 1), share(play, 2)]
      // the harpies dive at the ropes, and fall burning once the arc has passed through them
      const struck = ramp(cut, 0.55, 1)
      ABOUT.harpies.forEach(([x, lift], i) => {
        const dive = ramp(cut, 0, 0.55)
        harpies[i](lerp(x + 60, x - 40, dive) + 40 * struck, { lift: lerp(lift + 80, lift - 120, dive) - 500 * struck * struck, turn: 120 * struck, shown: 1 - ramp(struck, 0.5, 1) })
      })
      const hand = handOut(ABOUT.hero)
      swing(swipe, hand.x - 30, hand.y - 60, cut, 1.15)
      hit(ABOUT.seer - 40, FLOOR - 440, ramp(cut, 0.55, 0.85), 1.2)
      // the rope gives, she drops; he leaps to the edge and catches her wrist; he hauls her up beside him
      fadeTo(ropes[0], 1 - ramp(grab, 0, 0.15))
      fadeTo(ropes[1], 1 - ramp(grab, 0.15, 0.3))
      const drop = ramp(grab, 0.15, 0.55)
      const leap = ramp(grab, 0, 0.55)
      const caught = { x: ABOUT.catchAt + 120, lift: -150 }
      const up = ramp(haul, 0.1, 0.75)
      const seerLift = play.action === 1 ? lerp(130, caught.lift, drop) : lerp(caught.lift, 0, up)
      const seerX = play.action === 1 ? lerp(ABOUT.seer, caught.x, drop) : lerp(caught.x, ABOUT.seerSafe, up)
      seer(seerX, { lift: seerLift, frame: play.action === 2 && up >= 1 ? 'stand' : 'hang' })
      byAction(play, [
        () => poseHero(him, ABOUT.hero, at('swing', cut)),
        () => poseHero(him, lerp(ABOUT.hero, ABOUT.catchAt, leap), leap < 1 ? at('leap', leap) : at('haul', 0), 'blades', { lift: hop(leap, 120) }),
        () => poseHero(him, ABOUT.catchAt - 20 * up, at('haul', up)),
      ])
      // far off, the war god turns his head of fire towards them
      transformTo(god, `translate(${ABOUT.god.x} ${FLOOR + ABOUT.god.sink}) scale(${(ABOUT.god.size + 0.08 * haul).toFixed(3)})`)
      transformTo(godFire, `translate(0 ${r1(-40 * haul)}) scale(1 ${(1 + 0.3 * haul).toFixed(3)})`)
    }
  },
}

// Work, the desert of lost souls in a sandstorm, the band on the left. He sets the great horn to his mouth and
// blows; the chained Titan crawls up out of the sand on the cards' side, a whole temple strapped on his back,
// and his hand comes down beside him; he climbs the chain from the wrist up the arm to the temple gate.
// The Titan's hand is his anchor; at 0.55 of his drawn size his head, the furthest of him from the hand, stays
// inside the free half, short of the cards.
const WORK = { hero: -300, hand: -215, size: 0.55, under: 760 }
// His climb, held in the Titan's own units from the hand: the wrist, the arm, and the gate on his back.
const HOLDS = [
  [-70, 306],
  [28, 639],
  [153, 972],
] as const
const CLIMB = [{ x: WORK.hero, lift: 0 }, ...HOLDS.map(([x, lift]) => ({ x: WORK.hand + WORK.size * x, lift: WORK.size * lift }))]

/** Where he is a share `t` of the way up the climb. */
const climbAt = (t: number) => {
  const leg = Math.min(CLIMB.length - 2, Math.floor(t * (CLIMB.length - 1)))
  const k = t * (CLIMB.length - 1) - leg
  return { x: lerp(CLIMB[leg].x, CLIMB[leg + 1].x, k), lift: lerp(CLIMB[leg].lift, CLIMB[leg + 1].lift, k) }
}

function Dunes() {
  return (
    <>
      <path d={`M-900 ${FLOOR - 20} Q-400 ${FLOOR - 70} 0 ${FLOOR - 20} T900 ${FLOOR - 30} V${FIELD.height} H-900 Z`} fill={MYTH.sand} stroke={MYTH.inkLine} strokeWidth="4" />
      <path d={`M-900 ${FLOOR + 30} Q-300 ${FLOOR} 200 ${FLOOR + 30} T900 ${FLOOR + 24}`} fill="none" stroke={MYTH.sandHigh} strokeWidth="5" />
      <g transform={`translate(${WORK.hero - 50} ${FLOOR})`}>
        <path d="M-8 0 L-6 -150 L6 -150 L8 0 Z" fill={MYTH.deck} stroke={MYTH.inkLine} strokeWidth="3" />
        <path d="M-30 -150 H30" stroke={MYTH.bronze} strokeWidth="8" />
      </g>
    </>
  )
}

const work: SceneSpec = {
  script: [1400, 1800, 1800],
  phone: { focus: -190, fit: 0.55 },
  figure: (scene) => (
    <>
      <g data-fx="titan" transform={`translate(${WORK.hand} ${FLOOR + WORK.under}) scale(${WORK.size})`}>
        <Titan />
      </g>
      <Dunes />
      <g data-fx="storm" opacity="0.6">
        {[0, 1, 2].map((i) => (
          <ellipse key={i} cx={-300 + i * 320} cy={FLOOR - 120 - i * 60} rx={520} ry={70} fill={MYTH.sandLow} />
        ))}
      </g>
      <Hero x={WORK.hero} profession={scene.profession} />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const titan = fx(stage, 'titan')
    const storm = fx(stage, 'storm')
    const eye = fx(stage, 'titan-eye')
    return (play) => {
      const [blow, rise, climb] = [share(play, 0), share(play, 1), share(play, 2)]
      transformTo(storm, `translate(${r1(-200 + 260 * (blow + rise))} 0)`)
      fadeTo(storm, 0.6 * (1 - ramp(rise, 0.3, 1)) + 0.15)
      // the Titan comes up out of the sand, his hand last, set down beside him
      const up = ramp(rise, 0, 0.85)
      transformTo(titan, `translate(${WORK.hand} ${r1(FLOOR + WORK.under * (1 - up) ** 2)}) scale(${WORK.size})`)
      fadeTo(eye, ramp(rise, 0.6, 0.9))
      byAction(play, [
        () => poseHero(him, WORK.hero, at('horn', blow), blow > 0.1 ? 'horn' : 'blades'),
        () => poseHero(him, WORK.hero - 30 * bell(rise, 0.6, 1), at('roll', 0), 'blades'),
        () => {
          const where = climbAt(climb)
          poseHero(him, where.x, climb < 1 ? cycle('climb', climb, 4) : REST, 'blades', { lift: where.lift })
        },
      ])
    }
  },
}

// Tech Stack, inside the architect's temple. A machine of carved bronze rings as tall as the hall turns round a
// dark door; he heaves the great lever and the outer ring turns; saw blades rise out of the floor and he leaps
// them; the last rings lock, the notches line up and the light shines down the hall onto him at the door.
const TECH = { hero: -120, lever: -60, end: 200, saws: [40, 120], center: [200, FLOOR - 470] as const, rings: [470, 370, 270] }
// Each ring's turn before and after: the outer turned by the lever, the inner two locked last.
const RING_TURN = [
  [90, 0],
  [-140, 0],
  [60, 0],
] as const

function Ring({ index, radius }: { index: number; radius: number }) {
  const width = 70
  return (
    <g data-fx={`ring-${index}`}>
      <circle r={radius} fill="none" stroke={MYTH.inkLine} strokeWidth={width + 8} />
      <circle r={radius} fill="none" stroke={index % 2 ? MYTH.templeStone : MYTH.bronze} strokeWidth={width} />
      <circle r={radius} fill="none" stroke={MYTH.templeShade} strokeWidth={4} strokeDasharray="10 34" />
      {/* the notch the door's light passes through, at the top when the ring is locked */}
      <rect x={-46} y={-radius - width / 2 - 6} width={92} height={width + 12} fill={MYTH.templeHigh} stroke={MYTH.inkLine} strokeWidth={4} />
    </g>
  )
}

function Saw({ index }: { index: number }) {
  return (
    <g data-fx={`saw-${index}`}>
      <g data-fx={`saw-spin-${index}`}>
        <circle r={64} fill={MYTH.steel} stroke={MYTH.inkLine} strokeWidth={4} />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d="M-10 -62 L0 -82 L10 -62 Z" fill={MYTH.steel} stroke={MYTH.inkLine} strokeWidth={2} transform={`rotate(${i * 30})`} />
        ))}
        <circle r={14} fill={MYTH.bronzeShade} stroke={MYTH.inkLine} strokeWidth={3} />
      </g>
    </g>
  )
}

const tech: SceneSpec = {
  script: [1600, 1400, 1700],
  phone: { focus: 60, fit: 0.52 },
  figure: (scene) => (
    <>
      <g transform={`translate(${TECH.center[0]} ${TECH.center[1]})`}>
        {TECH.rings.map((radius, i) => (
          <Ring key={radius} index={i} radius={radius} />
        ))}
        <path d="M-80 470 V60 Q0 -30 80 60 V470 Z" fill={MYTH.templeHigh} stroke={MYTH.inkLine} strokeWidth="5" />
      </g>
      <g data-fx="tech-light" opacity="0">
        <path d={`M${TECH.center[0] - 70} 0 H${TECH.center[0] + 70} L${TECH.end + 140} ${FLOOR} H${TECH.end - 140} Z`} fill={MYTH.olympusLow} opacity="0.7" />
        <ellipse cx={TECH.end} cy={FLOOR} rx={170} ry={20} fill={MYTH.goldPale} />
      </g>
      <rect x={-900} y={FLOOR} width={1800} height={FIELD.height - FLOOR} fill={MYTH.templeShade} stroke={MYTH.inkLine} strokeWidth="4" />
      {TECH.saws.map((x, i) => (
        <g key={x} transform={`translate(${x} ${FLOOR})`}>
          <Saw index={i} />
        </g>
      ))}
      <rect x={-900} y={FLOOR} width={1800} height={30} fill={MYTH.templeStone} stroke={MYTH.inkLine} strokeWidth="4" />
      <g data-fx="lever" transform={`translate(${TECH.lever} ${FLOOR})`}>
        <path d="M-6 0 L-4 -150 L4 -150 L6 0 Z" fill={MYTH.bronzeShade} stroke={MYTH.inkLine} strokeWidth="3" />
        <circle cy={-150} r={14} fill={MYTH.bronze} stroke={MYTH.inkLine} strokeWidth="3" />
      </g>
      <Hero x={TECH.hero} profession={scene.profession} />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const rings = TECH.rings.map((_, i) => fx(stage, `ring-${i}`))
    const saws = TECH.saws.map((_, i) => ({ saw: fx(stage, `saw-${i}`), spin: fx(stage, `saw-spin-${i}`) }))
    const lever = fx(stage, 'lever')
    const light = fx(stage, 'tech-light')
    return (play) => {
      const [crank, leap, align] = [share(play, 0), share(play, 1), share(play, 2)]
      const turned = [crank, ramp(align, 0, 0.7), ramp(align, 0.15, 0.8)]
      rings.forEach((node, i) => transformTo(node, `rotate(${r1(lerp(RING_TURN[i][0], RING_TURN[i][1], turned[i]))})`))
      transformTo(lever, `translate(${TECH.lever} ${FLOOR}) rotate(${r1(30 * Math.sin(Math.PI * 2 * crank))})`)
      // the saws come up out of their slots as he runs at them and spin while they are up
      const sawUp = ramp(leap, 0, 0.3) * (1 - ramp(align, 0.2, 0.6))
      saws.forEach(({ saw, spin }, i) => {
        transformTo(saw, `translate(0 ${r1(70 - 60 * sawUp)})`)
        transformTo(spin, `rotate(${r1(720 * (leap + align) + i * 15)})`)
      })
      fadeTo(light, ramp(align, 0.7, 1))
      byAction(play, [
        () => poseHero(him, TECH.hero, cycle('crank', crank, 2)),
        () => poseHero(him, lerp(TECH.hero, TECH.end, ramp(leap, 0.2, 0.9)), at('leap', ramp(leap, 0.1, 0.6)), 'blades', { lift: hop(ramp(leap, 0.25, 0.9), 230) }),
        () => poseHero(him, TECH.end, at('raise', ramp(align, 0.7, 1))),
      ])
    }
  },
}

// Services, the last duel in the grey storm over the temple, the band on the left. He opens the box on its
// plinth; its light bursts and he grows to the war god's height, the giant sword in his hand; the god's bladed
// legs come down on him and he takes them on the sword; the ring closes over the god's chest and he drives
// the sword through him, and the god bursts into light.
// The god stands just right of the band's middle at 0.88 of his drawn size, so his raised sword arm and his
// shoulder keep inside the free half while the sword goes through his chest.
const SERVICES = { hero: -225, box: -150, god: -40, godSize: 0.88, grown: 2.0 }

function Box() {
  return (
    <g transform={`translate(${SERVICES.box} ${FLOOR})`}>
      <rect x={-70} y={-40} width={140} height={40} fill={MYTH.templeStone} stroke={MYTH.inkLine} strokeWidth="4" />
      <rect x={-50} y={-110} width={100} height={70} fill={MYTH.gold} stroke={MYTH.inkLine} strokeWidth="4" />
      <path d="M-50 -90 H50 M-50 -60 H50" stroke={MYTH.goldDeep} strokeWidth="4" />
      <g data-fx="box-lid">
        <path d="M-56 -110 Q0 -140 56 -110 Z" fill={MYTH.gold} stroke={MYTH.inkLine} strokeWidth="4" />
      </g>
    </g>
  )
}

const services: SceneSpec = {
  script: [1600, 1500, 1900],
  phone: { focus: -40, fit: 0.42 },
  figure: (scene) => (
    <>
      <path d={`M-900 ${FLOOR} H900 V${FIELD.height} H-900 Z`} fill={MYTH.stormLow} stroke={MYTH.inkLine} strokeWidth="4" />
      <g data-fx="duel-god" transform={`translate(${SERVICES.god} ${FLOOR}) scale(${SERVICES.godSize})`}>
        <WarGod />
      </g>
      <Box />
      <Burst name="box-burst" />
      <Hero x={SERVICES.hero} profession={scene.profession} />
      <Sparks name="duel-hit" />
      <Prompt name="duel-prompt" />
      <Burst name="god-burst" />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const god = fx(stage, 'duel-god')
    const legs = [turnTo(stage, 'god-leg-0', [40, -470]), turnTo(stage, 'god-leg-1', [40, -470])]
    const arm = turnTo(stage, 'god-arm', [-80, -540])
    const lid = fx(stage, 'box-lid')
    const boxBurst = burstWriter(stage, 'box-burst')
    const godBurst = burstWriter(stage, 'god-burst')
    const hit = sparkWriter(stage, 'duel-hit')
    const prompt = promptWriter(stage, 'duel-prompt')
    return (play) => {
      const [open, clash, finish] = [share(play, 0), share(play, 1), share(play, 2)]
      transformTo(lid, `translate(${r1(-60 * ramp(open, 0.3, 0.5))} ${r1(-40 * ramp(open, 0.3, 0.5))}) rotate(${r1(-50 * ramp(open, 0.3, 0.5))})`)
      boxBurst(SERVICES.box, FLOOR - 120, 0.4 + 1.6 * ramp(open, 0.4, 0.8), bell(open, 0.35, 1))
      const size = lerp(1, SERVICES.grown, ramp(open, 0.5, 0.95))
      // the god's bladed legs come down on the sword; the near arm raised all the while
      const strike = bell(clash, 0.1, 0.7)
      legs[0](-28 + 60 * strike)
      legs[1](-4 + 46 * strike)
      arm(-20 * bell(clash, 0.3, 0.9))
      hit(SERVICES.hero + 230, FLOOR - 470, ramp(clash, 0.35, 0.7), 2)
      // the finisher: the ring closes over his chest, the sword goes through, he bursts into light
      const through = ramp(finish, 0.55, 0.75)
      const gone = ramp(finish, 0.7, 1)
      transformTo(god, `translate(${r1(SERVICES.god + 40 * through)} ${FLOOR}) rotate(${r1(8 * gone)}) scale(${SERVICES.godSize})`)
      fadeTo(god, 1 - 0.85 * gone)
      prompt(SERVICES.god - 20, FLOOR - 400 * SERVICES.godSize, finish, ramp(finish, 0.55, 0.6))
      godBurst(SERVICES.god, FLOOR - 380 * SERVICES.godSize, 0.6 + 2.2 * gone, gone * (1 - 0.4 * ramp(finish, 0.9, 1)))
      byAction(play, [
        () => poseHero(him, SERVICES.hero, at('open', open), open > 0.55 ? 'sword' : 'blades', { size }),
        () => poseHero(him, SERVICES.hero, at('guard', clash), 'sword', { size }),
        () => poseHero(him, SERVICES.hero + 40 * through, at('swing', 0.35 + 0.65 * ramp(finish, 0.4, 0.75)), 'sword', { size }),
      ])
    }
  },
}

// Projects, Rhodes at night under the cyan lightning. The bronze giant stands on the quay, laurel crowned,
// filling the screen's height; his fist comes down on the quay as he rolls back, and his blades cut the hand;
// he draws the great blade out of the stone in a column of light; the ring closes over the giant's head, he
// leaps into the open jaw and bursts out through the cheek in bronze shards as the giant topples back.
const PROJECTS = { hero: -140, rolled: -250, stone: -110, giant: 180, size: 0.72, topple: 8 }
// The giant's head in the scene: his anchor, less his head's height at his size.
const GIANT_HEAD = { x: PROJECTS.giant, y: FLOOR - PROJECTS.size * 990 }

function BladeStone() {
  return (
    <g transform={`translate(${PROJECTS.stone} ${FLOOR})`}>
      <path d="M-70 0 L-56 -80 L60 -90 L74 0 Z" fill={MYTH.titanShade} stroke={MYTH.inkLine} strokeWidth="4" />
      <g data-fx="stone-blade">
        <path d="M-8 -80 L-6 -260 L0 -276 L6 -260 L8 -80 Z" fill={MYTH.lightning} stroke={MYTH.inkLine} strokeWidth="3" />
        <path d="M-30 -84 H30" stroke={MYTH.gold} strokeWidth="10" />
      </g>
      <rect data-fx="stone-light" x={-60} y={-1000} width={120} height={1000} fill={MYTH.lightning} opacity="0" />
    </g>
  )
}

function Shards() {
  return (
    <g data-fx="shards" opacity="0">
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d="M0 0 L26 -10 L18 18 Z" fill={MYTH.giantLight} stroke={MYTH.inkLine} strokeWidth="2" transform={`rotate(${i * 40}) translate(${60 + (i % 3) * 30} 0)`} />
      ))}
    </g>
  )
}

const projects: SceneSpec = {
  script: [1800, 1400, 1800],
  phone: { focus: 140, fit: 0.5 },
  figure: (scene) => (
    <>
      <g data-fx="colossus" transform={`translate(${PROJECTS.giant} ${FLOOR}) scale(${PROJECTS.size})`}>
        <Colossus />
      </g>
      <path d={`M-900 ${FLOOR} H900 V${FIELD.height} H-900 Z`} fill={MYTH.city} stroke={MYTH.inkLine} strokeWidth="4" />
      <path d={`M-900 ${FLOOR + 30} H900`} stroke={MYTH.rhodesLow} strokeWidth="5" />
      <BladeStone />
      <Hero x={PROJECTS.hero} profession={scene.profession} />
      <Swipe name="quay-swipe" />
      <Sparks name="quay-hit" fill={MYTH.lightning} />
      <Prompt name="giant-prompt" />
      <Shards />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const giant = fx(stage, 'colossus')
    const arm = turnTo(stage, 'colossus-arm', [-150, -820])
    const cracks = fx(stage, 'colossus-cracks')
    const jaw = fx(stage, 'colossus-jaw')
    const blade = fx(stage, 'stone-blade')
    const column = fx(stage, 'stone-light')
    const shards = fx(stage, 'shards')
    const swipe = swipeWriter(stage, 'quay-swipe')
    const hit = sparkWriter(stage, 'quay-hit')
    const prompt = promptWriter(stage, 'giant-prompt')
    return (play) => {
      const [slam, draw, finish] = [share(play, 0), share(play, 1), share(play, 2)]
      // the fist up, down on the quay where he stood, stunned there through the cut
      arm(-30 * ramp(slam, 0, 0.2) + 75 * ramp(slam, 0.2, 0.4) - 45 * ramp(draw, 0.2, 1))
      const hand = handOut(PROJECTS.rolled)
      swing(swipe, hand.x - 30, hand.y, ramp(slam, 0.5, 1), 1.1)
      hit(PROJECTS.rolled + 260, FLOOR - 60, ramp(slam, 0.75, 1), 1.4)
      // the blade drawn out of the stone in its column of light, then in his hand
      fadeTo(blade, draw > 0.6 ? 0 : 1)
      fadeTo(column, 0.6 * bell(draw, 0.3, 1))
      // the finisher: up into the jaw, the head cracks, out through the cheek as the giant topples
      const leap = ramp(finish, 0.25, 0.5)
      const inside = finish > 0.5 && finish < 0.68
      const out = ramp(finish, 0.68, 0.85)
      const topple = ramp(finish, 0.7, 1)
      transformTo(giant, `translate(${r1(PROJECTS.giant + 30 * topple)} ${FLOOR}) rotate(${r1(PROJECTS.topple * topple)}) scale(${PROJECTS.size})`)
      fadeTo(jaw, 1 - 0.8 * ramp(finish, 0.2, 0.3))
      fadeTo(cracks, ramp(finish, 0.5, 0.68))
      prompt(GIANT_HEAD.x - 10, GIANT_HEAD.y + 80, finish, ramp(finish, 0.25, 0.3))
      transformTo(shards, `translate(${r1(GIANT_HEAD.x - 100)} ${r1(GIANT_HEAD.y + 60)}) scale(${(0.6 + 1.6 * out).toFixed(3)})`)
      fadeTo(shards, out > 0 ? 1 - 0.6 * topple : 0)
      byAction(play, [
        () => {
          const roll = ramp(slam, 0.15, 0.45)
          poseHero(him, lerp(PROJECTS.hero, PROJECTS.rolled, roll), slam < 0.5 ? at('roll', roll) : at('swing', ramp(slam, 0.5, 1)), 'blades', { spin: -360 * ramp(slam, 0.2, 0.42) })
        },
        () => {
          const walk = ramp(draw, 0, 0.3)
          poseHero(him, lerp(PROJECTS.rolled, PROJECTS.stone - 80, walk), walk < 1 ? cycle('walk', walk, 2) : at('draw', ramp(draw, 0.3, 1)), draw > 0.6 ? 'sword' : 'blades')
        },
        () => {
          const lift = lerp(0, FLOOR - GIANT_HEAD.y - 180, leap) + 60 * out
          const x = lerp(PROJECTS.stone - 80, GIANT_HEAD.x - 60, leap) - 120 * out
          poseHero(him, x, out > 0 ? at('leap', 0.6) : at('leap', ramp(finish, 0.05, 0.4)), 'sword', { lift, shown: inside ? 0 : 1 })
        },
      ])
    }
  },
}

// Ventures, the bright sky over the island of creation, the band on the left. He comes in on the winged horse
// and a griffin rider dives at him; his blades cut it down in flames; landed on the island he turns the
// great windlass; the two stone steeds rear on their chains and pull, and the island moves.
const VENTURES = { from: -420, rideTo: -200, ride: 430, windlass: -40, griffin: [-20, 620] as const, steeds: [-560, -80] as const, steedSize: 0.62 }
const HORSE_SIZE = 0.55

function Island() {
  return (
    <>
      <g data-fx="island">
        <path d={`M-900 ${FLOOR - 40} Q-300 ${FLOOR - 80} 300 ${FLOOR - 40} T900 ${FLOOR - 50} V${FIELD.height} H-900 Z`} fill={MYTH.whiteMarble} stroke={MYTH.inkLine} strokeWidth="4" />
        {[-640, -120, 360].map((x) => (
          <g key={x} transform={`translate(${x} ${FLOOR - 50})`}>
            <rect x={-14} y={-60} width={28} height={60} fill={MYTH.bronze} stroke={MYTH.inkLine} strokeWidth="3" />
          </g>
        ))}
      </g>
      <g transform={`translate(${VENTURES.windlass} ${FLOOR})`}>
        <rect x={-40} y={-30} width={80} height={30} fill={MYTH.templeStone} stroke={MYTH.inkLine} strokeWidth="3" />
        <g data-fx="windlass">
          <path d="M0 -30 V-110 M-90 -100 H90" stroke={MYTH.inkLine} strokeWidth="16" />
          <path d="M0 -30 V-110 M-90 -100 H90" stroke={MYTH.deck} strokeWidth="10" />
        </g>
      </g>
    </>
  )
}

const ventures: SceneSpec = {
  script: [1700, 1600, 1500],
  phone: { focus: -180, fit: 0.5 },
  figure: (scene) => (
    <>
      {VENTURES.steeds.map((x, i) => (
        <g key={x} data-fx={`steed-at-${i}`} transform={`translate(${x} ${FLOOR - 60}) scale(${VENTURES.steedSize})`}>
          <Steed name={`steed-${i}`} />
        </g>
      ))}
      {VENTURES.steeds.map((x, i) => (
        <path key={x} data-fx={`steed-chain-${i}`} d={`M${x + 340} ${FLOOR - 400} L${x + 400} ${FLOOR - 100}`} stroke={MYTH.chain} strokeWidth="12" strokeDasharray="18 8" />
      ))}
      <Island />
      <g data-fx="horse" transform={`translate(${VENTURES.from} ${FLOOR - VENTURES.ride}) scale(${HORSE_SIZE})`}>
        <WingedHorse />
      </g>
      <Figure name="griffin" x={VENTURES.griffin[0]} size={2.8} lift={VENTURES.griffin[1]}>
        <GriffinRider />
      </Figure>
      <Hero x={VENTURES.from} profession={scene.profession} />
      <Swipe name="sky-swipe" />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const horse = fx(stage, 'horse')
    const wing = turnTo(stage, 'horse-wing', [0, -80])
    const wingFar = turnTo(stage, 'horse-wing-far', [-10, -40])
    const griffin = figureWriter(stage, 'griffin', 2.8)
    const griffinFire = fx(stage, 'griffin-fire')
    const swipe = swipeWriter(stage, 'sky-swipe')
    const windlass = fx(stage, 'windlass')
    const island = fx(stage, 'island')
    const steeds = VENTURES.steeds.map((_, i) => fx(stage, `steed-${i}`))
    const chains = VENTURES.steeds.map((_, i) => fx(stage, `steed-chain-${i}`))
    return (play) => {
      const [cut, heave, pull] = [share(play, 0), share(play, 1), share(play, 2)]
      // the flight in and the landing: the horse's back is where he sits
      const fly = ramp(cut, 0, 0.5)
      const land = ramp(heave, 0, 0.35)
      const horseX = lerp(VENTURES.from, VENTURES.rideTo, fly) - 120 * land
      const horseLift = lerp(VENTURES.ride, 0, land) + 30 * Math.sin(Math.PI * 4 * cut) * (1 - land)
      transformTo(horse, `translate(${r1(horseX)} ${r1(FLOOR - horseLift)}) scale(${HORSE_SIZE})`)
      const beat = Math.sin(Math.PI * 2 * (cut * 3 + heave))
      wing(-30 * beat)
      wingFar(-20 * beat)
      // the griffin dives, is cut, and falls burning out of the sky
      const dive = ramp(cut, 0.1, 0.6)
      const burnt = ramp(cut, 0.6, 1)
      griffin(lerp(VENTURES.griffin[0] + 160, VENTURES.rideTo + 220, dive) + 120 * burnt, { lift: lerp(VENTURES.griffin[1] + 160, VENTURES.ride + 60, dive) - 700 * burnt * burnt, turn: 70 * burnt, shown: 1 - ramp(burnt, 0.7, 1) })
      fadeTo(griffinFire, burnt > 0 ? 1 : 0)
      const hand = handOut(horseX + 20, horseLift + 40)
      swing(swipe, hand.x - 30, hand.y, ramp(cut, 0.3, 0.9), 1.1)
      // the windlass turned, the steeds rear and pull, the chains go taut, the island slides
      transformTo(windlass, `rotate(${r1(200 * heave)} 0 -100)`)
      steeds.forEach((node, i) => transformTo(node, `rotate(${r1(-14 * bell(pull, 0, 1) - 6 * ramp(pull, 0, 0.5) - 4 * i * ramp(pull, 0.2, 0.8))} 60 0)`))
      chains.forEach((node, i) => transformTo(node, `translate(${r1(20 * ramp(pull, 0, 0.6) - 6 * i)} ${r1(-30 * ramp(pull, 0, 0.6))})`))
      transformTo(island, `translate(${r1(70 * ramp(pull, 0.3, 1))} 0)`)
      byAction(play, [
        () => poseHero(him, horseX + 20, { ...at('swing', ramp(cut, 0.3, 0.9)), ...ASTRIDE }, 'blades', { lift: horseLift + 40 }),
        () => {
          const off = ramp(heave, 0.35, 0.55)
          poseHero(him, lerp(horseX + 20, VENTURES.windlass - 90, ramp(heave, 0.35, 0.6)), off < 1 ? { ...REST, ...ASTRIDE } : cycle('crank', ramp(heave, 0.55, 1), 2), 'blades', { lift: lerp(40, 0, off) })
        },
        () => poseHero(him, VENTURES.windlass - 90, at('crank', 0.5)),
      ])
    }
  },
}

// Bands, the bog of the forgotten. The undead king stands in the bog on the cards' side, grown giant, his
// hammer as long as a mast; it comes down beat after beat and each beat the ring of firm ground shrinks while
// he rolls between them; his blades bite the hammer arm and the king staggers; the ring closes over the
// king's wrist, he tears the hammer from the grip and lays it on his shoulder as the king sinks into the mist.
const BANDS = { hero: -60, rolled: -200, king: 180, kingDeep: 260, size: 0.9 }

const bands: SceneSpec = {
  script: [1900, 1400, 1700],
  phone: { focus: 40, fit: 0.42 },
  figure: (scene) => (
    <>
      <g data-fx="king" transform={`translate(${BANDS.king} ${FLOOR + BANDS.kingDeep}) scale(${BANDS.size})`}>
        <UndeadKing />
      </g>
      <rect x={-900} y={FLOOR - 10} width={1800} height={FIELD.height - FLOOR + 10} fill={MYTH.bogWater} stroke={MYTH.inkLine} strokeWidth="4" />
      <ellipse data-fx="firm-ground" cx={-110} cy={FLOOR + 10} rx={300} ry={36} fill={MYTH.rot} stroke={MYTH.inkLine} strokeWidth="4" />
      <g data-fx="bog-mist" opacity="0.5">
        {[0, 1, 2].map((i) => (
          <ellipse key={i} cx={-200 + i * 340} cy={FLOOR - 40 + i * 14} rx={360} ry={40} fill={MYTH.mist} />
        ))}
      </g>
      <Hero x={BANDS.hero} profession={scene.profession} />
      <Swipe name="bog-swipe" />
      <Sparks name="bog-hit" />
      <Prompt name="bog-prompt" />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const king = fx(stage, 'king')
    const arm = turnTo(stage, 'king-arm', [-110, -630])
    const hammer = fx(stage, 'king-hammer')
    const ground = fx(stage, 'firm-ground')
    const mist = fx(stage, 'bog-mist')
    const swipe = swipeWriter(stage, 'bog-swipe')
    const hit = sparkWriter(stage, 'bog-hit')
    const prompt = promptWriter(stage, 'bog-prompt')
    return (play) => {
      const [pound, cut, finish] = [share(play, 0), share(play, 1), share(play, 2)]
      // two beats of the hammer, each a lift and a fall; after the second it lies on the ground
      const beats = [bell(pound, 0, 0.5), ramp(pound, 0.5, 0.8)]
      const down = play.action === 0 ? (pound < 0.5 ? beats[0] : beats[1]) : 1
      arm(-60 * down + 20 * bell(cut, 0.4, 1))
      hit(BANDS.hero - 80, FLOOR - 20, play.action === 0 ? ramp(pound, 0.22, 0.4) + ramp(pound, 0.78, 0.98) * (pound > 0.6 ? 1 : 0) : 0, 1.6)
      transformTo(ground, `scale(${(1 - 0.18 * ramp(pound, 0.2, 0.3) - 0.18 * ramp(pound, 0.75, 0.85)).toFixed(3)} 1)`)
      // the finisher: the ring over the wrist, the hammer torn away, the king sinks into the mist
      const torn = ramp(finish, 0.35, 0.55)
      const sink = ramp(finish, 0.5, 1)
      fadeTo(hammer, torn > 0 ? 0 : 1)
      transformTo(king, `translate(${r1(BANDS.king + 40 * bell(cut, 0.4, 1) + 60 * sink)} ${r1(FLOOR + BANDS.kingDeep + 500 * sink * sink)}) rotate(${r1(10 * sink)}) scale(${BANDS.size})`)
      fadeTo(king, 1 - ramp(finish, 0.7, 1))
      fadeTo(mist, 0.5 + 0.3 * sink)
      prompt(BANDS.hero + 160, FLOOR - 200, finish, torn)
      const hand = handOut(BANDS.rolled)
      swing(swipe, hand.x - 30, hand.y, cut, 1.2)
      byAction(play, [
        () => {
          const roll = ramp(pound, 0.15, 0.45)
          poseHero(him, lerp(BANDS.hero, BANDS.rolled, roll), at('roll', roll), 'blades', { spin: -360 * ramp(pound, 0.18, 0.42) })
        },
        () => poseHero(him, BANDS.rolled, at('swing', cut)),
        () => poseHero(him, lerp(BANDS.rolled, BANDS.hero, ramp(finish, 0, 0.35)), finish < 0.7 ? at('wrench', finish / 0.7) : at('shoulder', ramp(finish, 0.7, 1)), torn > 0 ? 'hammer' : 'blades'),
      ])
    }
  },
}

// Muay Thai, the great chasm. He stands on a ledge over the dark; the winged man seizes him and they fall
// together, the rock rushing up past them; in the fall he wins the clinch and drives his knees up; the ring
// closes, he tears the wings off, the winged man drops into the dark, and he glides on the torn wings.
const MUAY_THAI = { hero: -120, fall: 520, foe: 40 }

function Chasm() {
  return (
    <>
      <g data-fx="ledge">
        <path d={`M-900 ${FLOOR} H-40 L-80 ${FLOOR + 120} H-900 Z`} fill={MYTH.rock} stroke={MYTH.inkLine} strokeWidth="4" />
      </g>
      <g data-fx="streaks" opacity="0">
        {Array.from({ length: 24 }, (_, i) => (
          <path key={i} d={`M${-700 + ((i * 131) % 1400)} ${(i * 173) % 1080} v${120 + (i % 3) * 60}`} stroke={MYTH.chasmLow} strokeWidth={6 + (i % 3) * 3} />
        ))}
      </g>
    </>
  )
}

const muayThai: SceneSpec = {
  script: [1600, 1600, 1800],
  phone: { focus: 120, fit: 0.6 },
  figure: (scene) => (
    <>
      <Chasm />
      <Figure name="winged" x={MUAY_THAI.foe + 260} size={2.7} lift={420}>
        <WingedMan />
      </Figure>
      <Hero x={MUAY_THAI.hero} profession={scene.profession} />
      <g data-fx="wings-held">
        <TornWings />
      </g>
      <Prompt name="chasm-prompt" />
      <Sparks name="chasm-hit" />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const winged = figureWriter(stage, 'winged', 2.7, 'grab')
    const wings = fx(stage, 'winged-wings')
    const torn = fx(stage, 'torn-wings')
    const held = fx(stage, 'wings-held')
    const ledge = fx(stage, 'ledge')
    const streaks = fx(stage, 'streaks')
    const prompt = promptWriter(stage, 'chasm-prompt')
    const hit = sparkWriter(stage, 'chasm-hit')
    return (play) => {
      const [grab, knees, finish] = [share(play, 0), share(play, 1), share(play, 2)]
      // the swoop and the grab on the ledge, then the fall: the ledge goes up out of sight and the rock streams up
      const swoop = ramp(grab, 0, 0.45)
      const fall = ramp(grab, 0.45, 1)
      transformTo(ledge, `translate(0 ${r1(-900 * fall * fall)})`)
      fadeTo(streaks, ramp(grab, 0.5, 0.8) * (1 - 0.6 * ramp(finish, 0.7, 1)))
      transformTo(streaks, `translate(0 ${r1(-((grab + knees + finish) * 1400) % 400)})`)
      const pair = { x: lerp(MUAY_THAI.hero, MUAY_THAI.foe - 80, fall), lift: lerp(0, MUAY_THAI.fall, fall) }
      const kick = play.action === 1 ? bell((knees * 2) % 1, 0.3, 0.7) * (knees < 1 ? 1 : 0) : 0
      // the finisher: the ring, the wings torn off, the winged man drops away, he glides off to the right
      const tear = ramp(finish, 0.3, 0.55)
      const drop = ramp(finish, 0.55, 1)
      const glide = ramp(finish, 0.6, 1)
      const foeFrame: WingedFrame = tear > 0 ? 'torn' : play.action === 0 && swoop < 1 ? 'grab' : 'held'
      const foeX = play.action === 0 && swoop < 1 ? lerp(MUAY_THAI.foe + 260, MUAY_THAI.hero + 150, swoop) : pair.x + 150 + 30 * kick
      const foeLift = play.action === 0 && swoop < 1 ? lerp(420, 60, swoop) : pair.lift + 40 * kick - 900 * drop * drop
      winged(foeX + 40 * drop, { lift: foeLift, frame: foeFrame, turn: 160 * drop, shown: 1 - ramp(drop, 0.6, 1) })
      fadeTo(wings, tear > 0 ? 0 : 1)
      hit(pair.x + 120, FLOOR - pair.lift - 80, kick, 1.2)
      prompt(pair.x + 180, FLOOR - pair.lift - 140, finish, tear)
      const x = pair.x + 220 * glide
      const lift = pair.lift + 60 * glide
      transformTo(held, `translate(${r1(x)} ${r1(FLOOR - lift - 200)})`)
      fadeTo(torn, tear > 0 ? 1 : 0)
      byAction(play, [
        () => poseHero(him, pair.x, swoop < 1 ? REST : at('clinch', fall), 'none', { lift: pair.lift }),
        () => poseHero(him, pair.x, cycle('knee', knees, 2), 'none', { lift: pair.lift }),
        () => poseHero(him, x, tear < 1 ? at('tear', tear) : at('glide', glide), 'none', { lift }),
      ])
    }
  },
}

// Contact, the mountain of the gods in gold light, the temple on its top. He raises his blades and the
// mountain shakes; the earth Titan's hand rises out of the cloud under him; it lifts him up the mountain
// towards the temple. The same picture on either side: he faces right, the hand under him.
// The hand at 0.85 of its drawn size and its drift short, so on either side it keeps inside the free half.
const CONTACT = { hero: -60, under: 560, rise: 360, drift: 50, size: 0.85, palm: 90 }

function Mountain() {
  return (
    <>
      <path d="M-900 1080 L-260 260 L-120 180 L40 120 L200 220 L900 1080 Z" fill={MYTH.olympusRock} stroke={MYTH.inkLine} strokeWidth="4" />
      <path d="M-260 260 L-200 360 L-120 300 L-40 380 M200 220 L160 330 L260 380" fill="none" stroke={MYTH.titanShade} strokeWidth="6" />
      <g transform="translate(40 120)">
        <path d="M-110 0 L0 -70 L110 0 Z" fill={MYTH.gold} stroke={MYTH.inkLine} strokeWidth="4" />
        {[-90, -50, -10, 30, 70].map((x) => (
          <rect key={x} x={x} y={0} width={20} height={70} fill={MYTH.whiteMarble} stroke={MYTH.inkLine} strokeWidth="2" />
        ))}
        <rect x={-110} y={70} width={220} height={16} fill={MYTH.gold} stroke={MYTH.inkLine} strokeWidth="3" />
      </g>
    </>
  )
}

const contact: SceneSpec = {
  script: [1800, 2200],
  phone: { focus: 0, fit: 0.6 },
  figure: (scene) => (
    <>
      <Mountain />
      <g data-fx="earth-hand" transform={`translate(${CONTACT.hero + 30} ${FLOOR + CONTACT.under}) scale(${CONTACT.size})`}>
        <EarthHand />
      </g>
      <path d={`M-900 ${FLOOR - 30} Q-450 ${FLOOR - 90} 0 ${FLOOR - 30} T900 ${FLOOR - 40} V${FIELD.height} H-900 Z`} fill={MYTH.cloud} stroke={MYTH.inkLine} strokeWidth="4" />
      <Hero x={CONTACT.hero} profession={scene.profession} />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const hand = fx(stage, 'earth-hand')
    return (play) => {
      const [call, carry] = [share(play, 0), share(play, 1)]
      // the hand rises under him to the cloud's top, then carries him up towards the temple
      const risen = ramp(call, 0.35, 1)
      const shake = 6 * Math.sin(Math.PI * 16 * call) * bell(call, 0.2, 0.8)
      const palm = CONTACT.palm * CONTACT.size
      const handY = FLOOR + CONTACT.under * (1 - risen) + palm * risen - CONTACT.rise * carry
      const handX = CONTACT.hero + 30 + shake + CONTACT.drift * carry
      transformTo(hand, `translate(${r1(handX)} ${r1(handY)}) scale(${CONTACT.size})`)
      // he stands on the palm once it has come up under his feet, its top `palm` above the hand's anchor
      const palmTop = handY - palm
      poseHero(him, handX - 30, at('raise', call < 1 ? ramp(call, 0, 0.5) : 1 - 0.5 * ramp(carry, 0.6, 1)), 'blades', { lift: Math.max(0, FLOOR - palmTop) })
    }
  },
}

const SCENES: Record<SceneId, SceneSpec> = { hero, about, work, tech, services, projects, ventures, bands, muayThai, contact }

// The cards a section counts, the shared count (stageItems): the record's facts and its achievements both.
const countOf = (slot: SectionSlot, labels: Labels, highlights: readonly string[]): number => {
  const { lead, count } = stageItems(slot, labels, highlights.length)
  return lead + count
}

export interface MythScene extends TheatreScene {
  id: SceneId
  profession: Profession
  /** The side its scene plays on from lg; the cards take the other. */
  side: Side
  /** The place whose weather this scene plays (depths.tsx), when it is the first scene in that place. */
  era?: Zone
}

// The first scene in a place also plays that place's weather behind the page: the weather's parts are CSS
// runs held paused (underworld.module.css), scrubbed by --era-t, the share of the scene played, so the rain,
// the sand and the embers follow the scroll with the scene, back on the way up, again every pass.
const eraWriter = (zone: Zone | undefined, script: SceneScript) => {
  if (!zone) return () => undefined
  let era: HTMLElement | null = null
  return (play: Playhead) => {
    era ??= document.querySelector<HTMLElement>(`[data-era="${zone}"]`)
    era?.style.setProperty('--era-t', (elapsedOf(script, play) / sceneLength(script)).toFixed(4))
  }
}

const sceneOf = (id: SceneId, count: number, profession: Profession, side: Side, era?: Zone): MythScene => {
  const spec = SCENES[id]
  return {
    id,
    count,
    profession,
    side,
    era,
    script: spec.script,
    bind: (stage): StageWriter => {
      const write = spec.bind(stage)
      const writeEra = eraWriter(era, spec.script)
      // drawn settled (reduced motion) there is no playhead, and the scene holds its end frame
      return (_progress, _reached, play) => {
        const now = play ?? sceneEnd(spec.script)
        write(now)
        writeEra(now)
      }
    },
  }
}

/** The side of the scene at `index` on the page: the first section after the hero plays on the right (its
 *  cards on the left), the next on the left, and so on to the contact; the hero keeps its own place. */
const sideOf = (index: number): Side => (index % 2 === 1 ? 'right' : 'left')

/** The page's scenes in order: the hero, the profession's sections, the contact; each on its side, the first
 *  in each place playing its weather. */
export function scenesOf(slots: readonly SectionSlot[], labels: Labels, highlights: readonly string[], profession: Profession): MythScene[] {
  const ids: SceneId[] = ['hero', ...slots.map((slot) => slot.id), 'contact']
  const counts = new Map(slots.map((slot) => [slot.id, countOf(slot, labels, highlights)]))
  return ids.map((id, index) => {
    const zone = ZONE_OF[id]
    const leads = ids.findIndex((other) => ZONE_OF[other] === zone) === index
    return sceneOf(id, counts.get(id as SectionId) ?? 0, profession, sideOf(index), leads ? zone : undefined)
  })
}

/** A scene's picture: its field of figures over the places of the run, set in its side's band. */
export function MythStage({ scene, settled = false }: { scene: MythScene; settled?: boolean }) {
  const spec = SCENES[scene.id]
  return (
    <Stage
      scene={scene}
      motion={FIELD_MOTION}
      settled={settled}
      layers={[
        {
          name: 'figure',
          node: (
            <svg className="block h-full w-full" viewBox={`0 0 ${FIELD.width} ${FIELD.height}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
              <g className={scene.id === 'hero' ? s.heroBand : s.band} style={bandFrame(scene.id, scene.side, spec.phone)}>
                {spec.figure(scene)}
              </g>
            </svg>
          ),
        },
      ]}
    />
  )
}
