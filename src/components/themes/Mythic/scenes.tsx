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
import { Seer, Smith, Stranger, Walker, Youth, type StrangerFrame, type YouthFrame } from './foes'
import { MYTH } from './palette'
import { bodyTransform, jointTransform, poseAt, REST, type Joint, type Move, type Pose } from './rig'
import { FIGURE_BOX, HeroFigure } from './sprite'
import { ZONE_OF, type Zone } from './stage'
import s from './sprite.module.css'

// His scenes on the shared theatre, one per part of the page, over the fixed places of the journey
// (depths.tsx): the journey of the northern game, told in its order with his old mentor's ashes and a young
// apprentice at his side (score/C62/mythic-concept.md, research/2026-11-24-deep-god-of-war/notes.md). Each
// scene is one to three actions played by the shared scene player (src/lib/scroll/player.ts) at the scene's
// own pace, back on the way up, the end frame held; he and the apprentice are drawn once in every scene. The
// pace is slow, the only loud moment the last duel.
//   Hero, the snow wood: light (the torch to his mentor's pyre); gather (the ashes swept into a pouch); hand
//     over (the pouch to the apprentice, who hangs it round the neck).
//   About, the cabin: knock (the pale stranger at the door, and he steps out and shuts it on the apprentice);
//     strike (the stranger hits him through the fence and smiles); shove (over the edge of the ravine).
//   Work, the old road: throw (his axe wedges the wheel and the gate stays up); call back (it flies back to his
//     hand and the gate starts down); duck (the apprentice under first, him after, the grave walkers shut out).
//   Tech Stack, the mirror lake: row; rise (the wyrm lifts its head, looks, and sinks); turn (the island
//     temple turns and its door opens).
//   Services, the smith's hut: lay down (the axe on the anvil); hammer (the smith strikes, the sparks fly);
//     heft (the new edge lifted).
//   Projects, the ring of light: step in; see (a past battle rises as shadows on the walls); pull (the
//     apprentice pulls him out, the sling stones lit).
//   Ventures, the iron mountain: haul (the cage up the shaft); cut free (the seer's bonds); point (across the
//     sea to the true peak, the smoke clearing off it).
//   Bands, home and the sea of the dead: dig (the hearth stones up, the drum of his past unwrapped); drum (the
//     rowers' time on the deck, the ship pulling away from the dead, the apprentice asleep against the drum).
//   Muay Thai, the frozen shore: clinch (the knees, and nothing hurts the stranger); sling (the apprentice's
//     thorn, and he feels pain); elbow (the falling elbow lays him in the snow, and the apprentice's hand on
//     his shoulder as he kneels).
//   Contact, the stair to the peak: climb (past the wall the mentor painted with their road); scatter (the
//     apprentice opens the pouch and the wind takes the ashes over the clouds).

export type SceneId = 'hero' | SectionId | 'contact'

/** The field pushes in a little across its scene. */
export const FIELD_MOTION: LayerMotions = { figure: { zoom: [1.0, 1.04], lift: [0, -1] } }

// The field: a 1920 by 1080 picture cut to the screen from its foot, his feet on FLOOR. The sections read in
// a column on the left from lg (stage.tsx COLUMN), so their scenes play on the right, between about x 1150 and
// 1720; the hero stands in the wood's left bay. Under 1024 px sprite.module.css moves each band to the middle.
const FIELD = { width: 1920, height: 1080 }
const FLOOR = 1000
const HERO_HEIGHT = 300
const HERO_SCALE = HERO_HEIGHT / FIGURE_BOX.height
// Every other figure's 60 by 80 box, its feet at (30, 78), and each one's size against him.
const BOX_FEET = { x: 30, y: 78 }
const SIZE = { youth: 2.4, stranger: 3.7, walker: 3.4, smith: 3.6, seer: 3.4 } as const

// ---- him ----

/** What his near hand holds: the axe, the torch, the ash pouch, the drum's mallets. */
type Held = 'axe' | 'torch' | 'pouch' | 'mallets' | 'none'

interface HeroNodes {
  root: Element | null
  body: Element | null
  joints: Array<{ joint: Joint; node: Element }>
  held: Record<Exclude<Held, 'none'>, Element[]>
}

const heroNodes = (stage: ParentNode): HeroNodes => {
  const root = fx(stage, 'hero')
  const all = (name: string) => [fx(root ?? stage, name)].filter((node): node is Element => node !== null)
  return {
    root,
    body: root?.querySelector('[data-body]') ?? null,
    joints: Array.from(root?.querySelectorAll<SVGGElement>('[data-joint]') ?? [], (node) => ({ joint: node.dataset.joint as Joint, node })),
    held: { axe: all('axe-held'), torch: all('held-torch'), pouch: all('held-pouch'), mallets: [...all('held-mallets'), ...all('held-mallets-far')] },
  }
}

const heroAt = (x: number, lift = 0): string =>
  `translate(${r1(x - FIGURE_BOX.feetX * HERO_SCALE)} ${r1(FLOOR - FIGURE_BOX.feetY * HERO_SCALE - lift)}) scale(${HERO_SCALE.toFixed(3)})`

/** Stands him at `x`, `lift` off the floor, in `pose`, holding `held`. */
const poseHero = (nodes: HeroNodes, x: number, pose: Pose, held: Held = 'axe', lift = 0): void => {
  transformTo(nodes.root, heroAt(x, lift))
  transformTo(nodes.body, bodyTransform(pose))
  for (const { joint, node } of nodes.joints) transformTo(node, jointTransform(joint, pose[joint]))
  for (const [name, list] of Object.entries(nodes.held)) for (const node of list) fadeTo(node, name === held ? 1 : 0)
}

/** His pose a share of the way through a move. */
const at = (move: Move, t: number): Pose => poseAt(move, t)

/** Where his near hand is at x and `lift`, with the arm out ahead (the throw's release, the catch). */
const handOut = (x: number, lift = 0) => ({ x: x + 100, y: FLOOR - 175 - lift })

function Hero({ x, profession, figure = false }: { x: number; profession: Profession; figure?: boolean }) {
  return (
    <g data-fx="hero" data-worlds-figure={figure ? '' : undefined} transform={heroAt(x)}>
      <HeroFigure profession={profession} />
    </g>
  )
}

// ---- the others: each placed by its feet, facing as drawn, shown in one frame at a time ----

/** A figure's box with its feet at (x, FLOOR - lift), `size` times, mirrored when `flip`. */
const figureAt = (x: number, size: number, lift = 0, flip = false): string =>
  `translate(${r1(x)} ${r1(FLOOR - lift)}) scale(${flip ? -size : size} ${size}) translate(${-BOX_FEET.x} ${-BOX_FEET.y})`

function Figure({ name, x, size, flip = false, children }: { name: string; x: number; size: number; flip?: boolean; children: ReactNode }) {
  return (
    <g data-fx={name} transform={figureAt(x, size, 0, flip)}>
      {children}
    </g>
  )
}

/** A figure's writer: placed, sized, mirrored, shown in one of its frames. */
function figureWriter(stage: HTMLElement, name: string, size: number, first: string) {
  const node = fx(stage, name)
  const show = frames(node, first)
  return (frame: string, x: number, lift = 0, flip = false, opacity = 1) => {
    show(frame)
    transformTo(node, figureAt(x, size, lift, flip))
    fadeTo(node, opacity)
  }
}

const youthWriter = (stage: HTMLElement) => {
  const place = figureWriter(stage, 'youth', SIZE.youth, 'stand')
  const pouch = fx(stage, 'youth-pouch')
  const stones = Array.from(stage.querySelectorAll('[data-fx="youth-stones"]'))
  return (frame: YouthFrame, x: number, { lift = 0, flip = false, pouch: worn = 1, stones: lit = 0 }: { lift?: number; flip?: boolean; pouch?: number; stones?: number } = {}) => {
    place(frame, x, lift, flip)
    fadeTo(pouch, worn)
    for (const node of stones) fadeTo(node, lit)
  }
}

const Apprentice = ({ x, flip = false }: { x: number; flip?: boolean }) => (
  <Figure name="youth" x={x} size={SIZE.youth} flip={flip}>
    <Youth />
  </Figure>
)

/** His axe in flight, spinning round its middle. */
function FlyingAxe() {
  return (
    <g data-fx="flying-axe" opacity="0">
      <g data-fx="flying-axe-spin">
        <path d="M-6 -60 L6 -60 L4 44 L-4 44 Z" fill={MYTH.leather} stroke={MYTH.inkLine} strokeWidth="4" />
        <path d="M2 22 L30 14 Q44 24 44 40 L14 46 L8 36 Z" fill={MYTH.steel} stroke={MYTH.inkLine} strokeWidth="4" />
      </g>
    </g>
  )
}

const axeWriter = (stage: HTMLElement) => {
  const node = fx(stage, 'flying-axe')
  const spin = fx(stage, 'flying-axe-spin')
  return (x: number, y: number, turn: number, shown: number) => {
    transformTo(node, `translate(${r1(x)} ${r1(y)})`)
    transformTo(spin, `rotate(${r1(turn)})`)
    fadeTo(node, shown)
  }
}

/** Sparks off the anvil or a blow. */
function Sparks({ name }: { name: string }) {
  return (
    <g data-fx={name} opacity="0">
      {[0, 50, 110, 160, 220, 300].map((angle) => (
        <path key={angle} d="M0 -10 L3 -40 L0 -34 L-3 -40 Z" fill={MYTH.fireCore} stroke={MYTH.inkLine} strokeWidth="1.4" transform={`rotate(${angle})`} />
      ))}
      <circle r="10" fill={MYTH.ember} opacity="0.6" />
    </g>
  )
}

/** A spark's writer: placed at (x, y), bursting over `t` (0 to 1). */
const sparkWriter = (stage: HTMLElement, name: string) => {
  const node = fx(stage, name)
  return (x: number, y: number, t: number) => {
    transformTo(node, `translate(${r1(x)} ${r1(y)}) scale(${(0.6 + 0.8 * t).toFixed(3)})`)
    fadeTo(node, t > 0 && t < 1 ? 1 - t : 0)
  }
}

// ---- the scenes ----

interface SceneSpec {
  /** The band the scene plays in (sprite.module.css moves it under 1024 px). */
  band: 'left' | 'right'
  /** A right band scene's cast from its leftmost to its rightmost reach in x, framed whole on a phone. */
  cast?: readonly [number, number]
  /** Its actions' wished lengths in ms, one to three. */
  script: SceneScript
  figure: (scene: MythScene) => ReactNode
  bind: (stage: HTMLElement) => (play: Playhead) => void
}

// A phone shows about 500 field units across the field's middle (x 960), the whole height: the cast fits in
// PHONE.width at most PHONE.fit times, centred, its feet at PHONE.floor (two thirds down, above the cards).
const PHONE = { width: 470, fit: 0.8, middle: FIELD.width / 2, floor: 720 } as const

/** The variables sprite.module.css frames a right band scene's cast with on a phone. */
const phoneFrame = ([from, to]: readonly [number, number]) => {
  const fit = Math.min(PHONE.fit, PHONE.width / (to - from))
  return cssVars({ '--phone-fit': fit.toFixed(3), '--phone-x': r1(PHONE.middle - ((from + to) / 2) * fit), '--phone-y': r1(PHONE.floor - FLOOR * fit) })
}

/** How far action `i` has played: all of it before, its eased share while it plays, none after. */
const share = ({ action, t }: Playhead, i: number): number => (action > i ? 1 : action === i ? t : 0)

// Hero, the snow wood by the cabin: his old mentor's pyre in the clearing, the mentor's staff leant on it. He
// sets the torch to it; when it has burnt low he sweeps the ashes into a pouch and ties it; he holds it out to
// the apprentice, who comes round the pyre and hangs it round the neck. Smoke rises behind the pair.
const HERO = { x: 600, pyre: 780, youthFrom: 1010, youthTo: 860 }

function Pyre({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} ${FLOOR})`}>
      <path data-fx="pyre-smoke" d="M0 -120 Q-40 -260 10 -380 Q-30 -500 20 -640" fill="none" stroke={MYTH.ash} strokeWidth="40" strokeLinecap="round" opacity="0" />
      <g data-fx="pyre-logs">
        {[-20, -50, -80].map((y, i) => (
          <rect key={y} x={-90 + i * 8} y={y} width={180 - i * 16} height={28} rx={10} fill={MYTH.wood} stroke={MYTH.inkLine} strokeWidth="3" />
        ))}
        <path d="M-70 -84 Q0 -120 70 -84 L60 -76 Q0 -100 -60 -76 Z" fill={MYTH.wrap} stroke={MYTH.inkLine} strokeWidth="3" />
      </g>
      <path d="M100 0 L60 -210" stroke={MYTH.inkLine} strokeWidth="9" strokeLinecap="round" />
      <path d="M100 0 L60 -210" stroke={MYTH.wood} strokeWidth="5" strokeLinecap="round" />
      <path data-fx="pyre-ash" d="M-80 0 Q0 -30 80 0 Z" fill={MYTH.ash} stroke={MYTH.inkLine} strokeWidth="2" opacity="0" />
      <g data-fx="pyre-fire" opacity="0">
        <path d="M-90 -60 Q-60 -200 -20 -120 Q0 -260 30 -130 Q60 -220 90 -60 Z" fill={MYTH.fire} stroke={MYTH.inkLine} strokeWidth="3" />
        <path d="M-50 -60 Q-30 -150 0 -100 Q30 -170 50 -60 Z" fill={MYTH.fireCore} />
      </g>
    </g>
  )
}

const hero: SceneSpec = {
  band: 'left',
  script: [1600, 1600, 1600],
  figure: (scene) => (
    <>
      <Pyre x={HERO.pyre} />
      <Hero x={HERO.x} profession={scene.profession} figure />
      <Apprentice x={HERO.youthFrom} flip />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const youth = youthWriter(stage)
    const fire = fx(stage, 'pyre-fire')
    const logs = fx(stage, 'pyre-logs')
    const ash = fx(stage, 'pyre-ash')
    const smoke = fx(stage, 'pyre-smoke')
    return (play) => {
      const [light, gather, give] = [share(play, 0), share(play, 1), share(play, 2)]
      const burn = ramp(light, 0.45, 1) * (1 - ramp(gather, 0, 0.45))
      fadeTo(fire, burn)
      transformTo(fire, `scale(1 ${(0.4 + 0.6 * burn).toFixed(3)})`)
      fadeTo(logs, 1 - ramp(gather, 0.1, 0.45))
      fadeTo(ash, ramp(gather, 0.2, 0.5) * (1 - ramp(gather, 0.75, 1)))
      fadeTo(smoke, 0.5 * ramp(light, 0.6, 1))
      if (play.action === 0) poseHero(him, HERO.x + 40 * light, at('torch', light), 'torch')
      else if (play.action === 1) poseHero(him, HERO.x + 40, at('gather', gather), gather > 0.7 ? 'pouch' : 'none')
      else poseHero(him, HERO.x + 40, at('give', give), give > 0.6 ? 'none' : 'pouch')
      const walked = ramp(give, 0, 0.5)
      youth(walked > 0 && walked < 1 ? 'walk' : give >= 0.5 ? 'reach' : 'stand', lerp(HERO.youthFrom, HERO.youthTo, walked), { flip: true, pouch: ramp(give, 0.6, 0.75) })
    }
  },
}

// About, the cabin: the pale stranger knocks; he steps out of the door and shuts it on the apprentice, whose
// face then shows at the window; the stranger strikes him across the fence and smiles; he drives the stranger
// back over the edge of the ravine.
const ABOUT = { door: 1200, window: 1110, hero: 1280, out: 1350, stranger: 1500, fence: 1440, edge: 1680 }

function Cabin() {
  const { fence, edge } = ABOUT
  return (
    <>
      <path d={`M${fence} ${FLOOR - 90} V${FLOOR} M${fence + 80} ${FLOOR - 90} V${FLOOR} M${fence - 10} ${FLOOR - 70} H${fence + 100} M${fence - 10} ${FLOOR - 30} H${fence + 100}`} stroke={MYTH.wood} strokeWidth="10" />
      <path d={`M${edge} ${FLOOR} L${edge + 30} ${FLOOR + 80} H${FIELD.width} V${FLOOR} Z`} fill={MYTH.inkLine} />
    </>
  )
}

/** The cabin's wall in front of the apprentice, cut with the door and the window; the door that shuts. */
function CabinWall() {
  const { door, window: pane } = ABOUT
  const wall = `M960 ${FLOOR} V${FLOOR - 330} L1120 ${FLOOR - 440} L1280 ${FLOOR - 330} V${FLOOR} Z`
  const doorHole = `M${door - 40} ${FLOOR} V${FLOOR - 200} H${door + 40} V${FLOOR} Z`
  const paneHole = `M${pane - 40} ${FLOOR - 250} H${pane + 40} V${FLOOR - 180} H${pane - 40} Z`
  return (
    <>
      <path d={`${wall} ${doorHole} ${paneHole}`} fill={MYTH.wood} fillRule="evenodd" stroke={MYTH.inkLine} strokeWidth="4" />
      <path d={`M950 ${FLOOR - 330} L1120 ${FLOOR - 450} L1290 ${FLOOR - 330}`} fill="none" stroke={MYTH.snow} strokeWidth="18" />
      <path d={`M${pane} ${FLOOR - 250} V${FLOOR - 180} M${pane - 40} ${FLOOR - 215} H${pane + 40}`} stroke={MYTH.woodShade} strokeWidth="4" />
      <g data-fx="cabin-door" transform={`translate(${door - 40} 0)`}>
        <rect x={0} y={FLOOR - 200} width={80} height={200} fill={MYTH.woodShade} stroke={MYTH.inkLine} strokeWidth="4" />
        <circle cx={64} cy={FLOOR - 100} r={5} fill={MYTH.iron} />
      </g>
    </>
  )
}

const about: SceneSpec = {
  band: 'right',
  cast: [1060, 1720],
  script: [1700, 1500, 1600],
  figure: (scene) => (
    <>
      <Cabin />
      <Apprentice x={ABOUT.door} />
      <CabinWall />
      <Figure name="stranger" x={ABOUT.stranger} size={SIZE.stranger}>
        <Stranger />
      </Figure>
      <Hero x={ABOUT.hero} profession={scene.profession} />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const youth = youthWriter(stage)
    const stranger = figureWriter(stage, 'stranger', SIZE.stranger, 'stand')
    const door = fx(stage, 'cabin-door')
    return (play) => {
      const [knock, strike, shove] = [share(play, 0), share(play, 1), share(play, 2)]
      // the door: open while the stranger knocks and he steps out, shut on her as he goes
      const shut = ramp(knock, 0.6, 0.85)
      transformTo(door, `translate(${ABOUT.door - 40} 0) scale(${(0.15 + 0.85 * shut).toFixed(3)} 1)`)
      youth(shut < 1 ? 'stand' : 'reach', shut < 1 ? ABOUT.door : ABOUT.window, { lift: shut < 1 ? 0 : 150 })
      fadeTo(him.root, ramp(knock, 0.25, 0.45))
      const out = lerp(ABOUT.hero, ABOUT.out, ramp(knock, 0.3, 0.7))
      if (play.action === 0) {
        stranger(knock < 0.4 ? 'knock' : 'stand', lerp(ABOUT.door + 90, ABOUT.stranger, ramp(knock, 0.3, 0.7)))
        poseHero(him, out, at('walk', ramp(knock, 0.3, 0.7)))
      } else if (play.action === 1) {
        stranger(bell(strike, 0.2, 0.7) > 0.3 ? 'strike' : 'stand', ABOUT.stranger - 40 * bell(strike, 0.2, 0.7))
        poseHero(him, out, at('reel', ramp(strike, 0.35, 1)))
      } else {
        const fall = ramp(shove, 0.5, 1)
        poseHero(him, out - 20 + 90 * ramp(shove, 0.2, 0.6), at('shove', shove))
        stranger(fall > 0 ? 'fall' : 'stand', lerp(ABOUT.stranger, ABOUT.edge + 120, fall), -hop(fall, -60) - 400 * fall * fall, false, 1 - ramp(fall, 0.7, 1))
      }
    }
  },
}

// Work, the old road: a water wheel turns a gate down; his axe wedges the wheel and the gate stays up; he calls
// it back, the wheel turns again and the gate starts down; the apprentice slips under first, he stoops after,
// and the gate shuts behind them on the grave walkers coming slow down the road.
const WORK = { hero: 1170, youth: 1090, wheel: 1300, gate: 1450, past: 1580, walkers: [930, 1010] }

function WheelAndGate() {
  const { wheel, gate } = WORK
  return (
    <>
      <path d={`M${wheel - 140} ${FLOOR} H${wheel + 140} V${FLOOR + 40} H${wheel - 140} Z`} fill={MYTH.lakeWater} />
      <g data-fx="wheel" transform={`translate(${wheel} ${FLOOR - 120})`}>
        <circle r="110" fill="none" stroke={MYTH.wood} strokeWidth="14" />
        {[0, 45, 90, 135].map((angle) => (
          <path key={angle} d="M-110 0 H110" stroke={MYTH.wood} strokeWidth="10" transform={`rotate(${angle})`} />
        ))}
        <circle r="18" fill={MYTH.woodShade} stroke={MYTH.inkLine} strokeWidth="4" />
      </g>
      <rect x={gate - 90} y={FLOOR - 320} width={24} height={320} fill={MYTH.stoneShade} stroke={MYTH.inkLine} strokeWidth="4" />
      <rect x={gate + 66} y={FLOOR - 320} width={24} height={320} fill={MYTH.stoneShade} stroke={MYTH.inkLine} strokeWidth="4" />
      <rect x={gate - 100} y={FLOOR - 350} width={200} height={40} fill={MYTH.stone} stroke={MYTH.inkLine} strokeWidth="4" />
      <g data-fx="gate">
        {[-50, -20, 10, 40].map((dx) => (
          <rect key={dx} x={gate + dx} y={FLOOR - 300} width={10} height={300} fill={MYTH.iron} stroke={MYTH.inkLine} strokeWidth="2" />
        ))}
        <path d={`M${gate - 66} ${FLOOR - 200} H${gate + 66} M${gate - 66} ${FLOOR - 100} H${gate + 66}`} stroke={MYTH.iron} strokeWidth="8" />
      </g>
    </>
  )
}

const work: SceneSpec = {
  band: 'right',
  // from the walkers at the wheel to the apprentice past the gate, where she ends
  cast: [930, 1830],
  script: [1600, 1400, 1800],
  figure: (scene) => (
    <>
      {WORK.walkers.map((x, i) => (
        <Figure key={x} name={`walker-${i}`} x={x} size={SIZE.walker}>
          <Walker />
        </Figure>
      ))}
      <WheelAndGate />
      <Apprentice x={WORK.youth} />
      <Hero x={WORK.hero} profession={scene.profession} />
      <FlyingAxe />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const youth = youthWriter(stage)
    const axe = axeWriter(stage)
    const wheel = fx(stage, 'wheel')
    const gate = fx(stage, 'gate')
    const walkers = WORK.walkers.map((_, i) => fx(stage, `walker-${i}`))
    const hub = { x: WORK.wheel - 30, y: FLOOR - 150 }
    return (play) => {
      const [thrown, called, duck] = [share(play, 0), share(play, 1), share(play, 2)]
      const flight = ramp(thrown, 0.55, 0.8)
      const back = ramp(called, 0.2, 0.6)
      const hand = handOut(WORK.hero)
      // the wheel turns until the axe bites, stands while it is wedged, turns again once it is called back
      const turning = ramp(thrown, 0, 0.8) + ramp(called, 0.6, 1) + duck
      transformTo(wheel, `translate(${WORK.wheel} ${FLOOR - 120}) rotate(${r1(70 * turning)})`)
      // the gate: up, held while the wheel is wedged, then down behind them
      transformTo(gate, `translate(0 ${r1(-260 * (1 - ramp(thrown, 0, 0.8) * 0.15) * (1 - ramp(duck, 0.7, 1)))})`)
      axe(lerp(hand.x, hub.x, flight) - lerp(0, hand.x - hub.x, back), lerp(hand.y, hub.y, flight) + lerp(0, hand.y - hub.y, back), 720 * flight - 720 * back, play.action === 0 ? (flight > 0 ? 1 : 0) : play.action === 1 ? (back < 1 ? 1 : 0) : 0)
      if (play.action === 0) poseHero(him, WORK.hero, at('throw', thrown), flight > 0 ? 'none' : 'axe')
      else if (play.action === 1) poseHero(him, WORK.hero, at('catch', called), back < 1 ? 'none' : 'axe')
      else poseHero(him, lerp(WORK.hero, WORK.past + 60, ramp(duck, 0.3, 0.9)), at('stoop', ramp(duck, 0.3, 0.6)))
      const run = ramp(duck, 0, 0.55)
      youth(run > 0 && run < 1 ? 'crouch' : 'stand', lerp(WORK.youth, WORK.past + 150, run))
      walkers.forEach((node, i) => transformTo(node, figureAt(WORK.walkers[i] + 120 * (thrown + called + duck) / 3, SIZE.walker)))
    }
  },
}

// Tech Stack, the mirror lake: he rows with the apprentice at the bow; the great wyrm of the lake lifts its
// head out of the water, looks at them and sinks again; the temple on the island turns on its base and a door
// opens in it, and the boat comes to the door.
const TECH = { from: 1120, to: 1380, wyrm: 1640, temple: 1700, water: FLOOR - 40 }

function Lake() {
  const { wyrm, temple, water } = TECH
  return (
    <>
      <g data-fx="wyrm" transform={`translate(${wyrm} ${water})`}>
        <path d="M-60 120 Q-70 -60 0 -150 Q40 -190 100 -170 L120 -140 Q60 -130 40 -90 Q20 -20 40 120 Z" fill={MYTH.pineLight} stroke={MYTH.inkLine} strokeWidth="5" />
        <path d="M30 -170 L10 -230 L50 -180 M70 -176 L80 -240 L96 -172" fill={MYTH.stoneShade} stroke={MYTH.inkLine} strokeWidth="4" />
        <path d="M-40 -40 Q-20 -80 10 -110" fill="none" stroke={MYTH.pine} strokeWidth="14" />
        <circle data-fx="wyrm-eye" cx={80} cy={-156} r={7} fill={MYTH.fireCore} />
      </g>
      <rect x={1000} y={water} width={920} height={200} fill={MYTH.lakeWater} />
      <path d={`M1000 ${water + 30} H1920 M1000 ${water + 70} H1920`} stroke={MYTH.lakeLow} strokeWidth="3" opacity="0.6" />
      <g transform={`translate(${temple} ${water})`}>
        <path d="M-140 0 Q0 -40 140 0 Z" fill={MYTH.pine} stroke={MYTH.inkLine} strokeWidth="4" />
        <g data-fx="temple">
          <rect x={-90} y={-260} width={180} height={240} fill={MYTH.stoneShade} stroke={MYTH.inkLine} strokeWidth="5" />
          <path d="M-110 -260 L0 -330 L110 -260 Z" fill={MYTH.stone} stroke={MYTH.inkLine} strokeWidth="5" />
          <rect data-fx="temple-door" x={-36} y={-150} width={72} height={130} fill={MYTH.fireCore} stroke={MYTH.inkLine} strokeWidth="4" />
        </g>
      </g>
    </>
  )
}

function Boat() {
  return (
    <g data-fx="boat">
      <path d="M-180 -30 H200 L160 30 H-150 Z" fill={MYTH.wood} stroke={MYTH.inkLine} strokeWidth="5" />
      <path d="M-160 -20 H190" stroke={MYTH.woodShade} strokeWidth="5" />
      <path data-fx="oar" d="M-20 -40 L-120 40" stroke={MYTH.woodShade} strokeWidth="8" strokeLinecap="round" />
      <path data-fx="wake" d="M-200 10 Q-300 0 -420 14" fill="none" stroke={MYTH.snow} strokeWidth="4" opacity="0.6" />
    </g>
  )
}

const tech: SceneSpec = {
  band: 'right',
  cast: [1040, 1790],
  script: [1600, 1800, 1500],
  figure: (scene) => (
    <>
      <Lake />
      <Apprentice x={TECH.from + 130} />
      <Hero x={TECH.from} profession={scene.profession} />
      <Boat />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const youth = youthWriter(stage)
    const boat = fx(stage, 'boat')
    const oar = fx(stage, 'oar')
    const wyrm = fx(stage, 'wyrm')
    const eye = fx(stage, 'wyrm-eye')
    const temple = fx(stage, 'temple')
    const door = fx(stage, 'temple-door')
    return (play) => {
      const [row, rise, turn] = [share(play, 0), share(play, 1), share(play, 2)]
      const x = lerp(TECH.from, TECH.to, ramp(row, 0, 1) * 0.7 + ramp(turn, 0.3, 1) * 0.3)
      const stroke = (row * 2 + turn) % 1
      transformTo(boat, `translate(${r1(x + 60)} ${TECH.water})`)
      transformTo(oar, `rotate(${r1(-30 * Math.sin(stroke * Math.PI * 2))} -20 -40)`)
      poseHero(him, x, at('row', stroke), 'none', 40)
      youth('sit', x + 170, { lift: 34 })
      const up = bell(rise, 0, 1)
      transformTo(wyrm, `translate(${TECH.wyrm} ${r1(TECH.water + 360 * (1 - up))})`)
      fadeTo(eye, ramp(rise, 0.35, 0.5) * (1 - ramp(rise, 0.75, 0.85)))
      transformTo(temple, `scale(${(Math.cos(Math.PI * ramp(turn, 0, 0.6)) * 0.5 + 0.5 > 0.5 ? 1 : -1) * Math.max(0.1, Math.abs(Math.cos(Math.PI * ramp(turn, 0, 0.6))))} 1)`)
      fadeTo(door, ramp(turn, 0.6, 0.9))
    }
  },
}

// Services, the smith's hut on stilts at the lake's edge: he lays his axe on the anvil; the smith strikes it,
// sparks flying with each blow; he lifts it and looks the new edge over. The apprentice waits by the post.
const SERVICES = { hero: 1300, anvil: 1450, smith: 1580, youth: 1170 }

function Forge() {
  const { anvil } = SERVICES
  return (
    <>
      <path d="M1360 640 L1520 560 L1720 640 Z" fill={MYTH.woodShade} stroke={MYTH.inkLine} strokeWidth="4" />
      <path d="M1380 640 V1000 M1700 640 V1000" stroke={MYTH.wood} strokeWidth="18" />
      <rect x={1620} y={820} width={110} height={180} fill={MYTH.stoneShade} stroke={MYTH.inkLine} strokeWidth="4" />
      <ellipse data-fx="forge-glow" cx={1675} cy={880} rx={40} ry={26} fill={MYTH.fire} />
      <path d={`M${anvil - 60} ${FLOOR - 110} H${anvil + 70} L${anvil + 40} ${FLOOR - 80} H${anvil - 30} Z M${anvil - 20} ${FLOOR - 80} H${anvil + 20} L${anvil + 34} ${FLOOR} H${anvil - 34} Z`} fill={MYTH.iron} stroke={MYTH.inkLine} strokeWidth="4" />
      <g data-fx="anvil-axe" opacity="0">
        <path d={`M${anvil - 90} ${FLOOR - 118} H${anvil + 30}`} stroke={MYTH.leather} strokeWidth="8" />
        <path d={`M${anvil + 20} ${FLOOR - 134} L${anvil + 60} ${FLOOR - 130} L${anvil + 60} ${FLOOR - 112} L${anvil + 20} ${FLOOR - 112} Z`} fill={MYTH.steel} stroke={MYTH.inkLine} strokeWidth="3" />
      </g>
    </>
  )
}

const services: SceneSpec = {
  band: 'right',
  cast: [1090, 1720],
  script: [1400, 1800, 1500],
  figure: (scene) => (
    <>
      <Forge />
      <Apprentice x={SERVICES.youth} />
      <Figure name="smith" x={SERVICES.smith} size={SIZE.smith}>
        <Smith />
      </Figure>
      <Hero x={SERVICES.hero} profession={scene.profession} />
      <Sparks name="anvil-sparks" />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const youth = youthWriter(stage)
    const smith = figureWriter(stage, 'smith', SIZE.smith, 'up')
    const onAnvil = fx(stage, 'anvil-axe')
    const sparks = sparkWriter(stage, 'anvil-sparks')
    return (play) => {
      const [lay, hammer, heft] = [share(play, 0), share(play, 1), share(play, 2)]
      const laid = lay >= 0.7 && play.action < 2
      fadeTo(onAnvil, laid ? 1 : 0)
      if (play.action === 0) poseHero(him, SERVICES.hero, at('torch', lay), laid ? 'none' : 'axe')
      else if (play.action === 1) poseHero(him, SERVICES.hero, REST, 'none')
      else poseHero(him, SERVICES.hero, at('raise', heft), 'axe')
      // three blows: the hammer up, then down on the edge, a burst of sparks each time
      const blow = (hammer * 3) % 1
      const down = play.action === 1 && hammer < 1 && blow > 0.5
      smith(down ? 'down' : 'up', SERVICES.smith)
      sparks(SERVICES.anvil + 30, FLOOR - 130, play.action === 1 && hammer < 1 ? ramp(blow, 0.5, 1) : 0)
      youth('stand', SERVICES.youth)
    }
  },
}

// Projects, the ring of light: he walks into the column of light; on the faces of the ring's two walls a past
// battle rises in shadows, a line of warriors with shields and spears; the apprentice grabs his hand and pulls
// him back out of it, the stones of the sling lit, and the shadows stay faint on the stone. Everything stands
// right of the project cards, which run wider than the other sections'.
const PROJECTS = { hero: 1390, light: 1520, youth: 1260, walls: [1310, 1730], wall: { width: 200, height: 460 } } as const
// The warriors on each wall face: their place from the wall's middle and which way each spear leans.
const WARRIORS = [-62, 0, 62] as const

function Warrior({ x, lean }: { x: number; lean: 1 | -1 }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <path d="M-18 0 V-120 Q0 -142 18 -120 V0 Z" />
      <circle cy={-156} r={16} />
      <path d={`M${24 * lean} 12 L${44 * lean} -270`} stroke={MYTH.ink} strokeWidth="7" />
      <ellipse cx={16 * lean} cy={-78} rx={24} ry={34} />
    </g>
  )
}

function Ring() {
  const { width, height } = PROJECTS.wall
  return (
    <>
      {PROJECTS.walls.map((x) => (
        <rect key={x} x={x - width / 2} y={FLOOR - height} width={width} height={height} fill={MYTH.stone} stroke={MYTH.inkLine} strokeWidth="4" />
      ))}
      <g data-fx="past" opacity="0" fill={MYTH.ink}>
        {PROJECTS.walls.map((x) => (
          <g key={x} transform={`translate(${x} ${FLOOR - 70})`}>
            {WARRIORS.map((dx, i) => (
              <Warrior key={dx} x={dx} lean={i % 2 ? 1 : -1} />
            ))}
          </g>
        ))}
      </g>
      <g data-fx="column">
        <rect x={PROJECTS.light - 110} y={0} width={220} height={FLOOR} fill={MYTH.lightHigh} opacity="0.45" />
        <rect x={PROJECTS.light - 50} y={0} width={100} height={FLOOR} fill={MYTH.frostCore} opacity="0.55" />
        <ellipse cx={PROJECTS.light} cy={FLOOR} rx={150} ry={22} fill={MYTH.frostCore} opacity="0.7" />
      </g>
    </>
  )
}

const projects: SceneSpec = {
  band: 'right',
  cast: [1190, 1840],
  script: [1500, 1700, 1700],
  figure: (scene) => (
    <>
      <Ring />
      <Hero x={PROJECTS.hero} profession={scene.profession} />
      <Apprentice x={PROJECTS.youth} />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const youth = youthWriter(stage)
    const past = fx(stage, 'past')
    const column = fx(stage, 'column')
    return (play) => {
      const [step, see, pull] = [share(play, 0), share(play, 1), share(play, 2)]
      const inLight = lerp(PROJECTS.hero, PROJECTS.light - 60, step)
      const out = ramp(pull, 0.35, 1)
      const x = lerp(inLight, PROJECTS.hero - 20, out)
      if (play.action === 0) poseHero(him, x, at('walk', (step * 2) % 1))
      else if (play.action === 1) poseHero(him, x, at('see', see))
      else poseHero(him, x, at('reel', ramp(pull, 0.2, 0.7)))
      fadeTo(past, 0.85 * ramp(see, 0.05, 0.4) * (1 - 0.5 * ramp(pull, 0.4, 0.9)))
      transformTo(past, `translate(0 ${r1(80 * (1 - ramp(see, 0.1, 0.7)))})`)
      fadeTo(column, 1 - 0.4 * ramp(pull, 0.5, 1))
      const reach = ramp(pull, 0, 0.35)
      youth(reach > 0 ? 'pull' : 'stand', lerp(PROJECTS.youth, x - 140, reach), { stones: ramp(pull, 0.6, 0.9) })
    }
  },
}

// Ventures, the iron mountain: he hauls the chain and the cage carries them up the shaft to the windy top; he
// cuts the old seer's bonds from the dead tree; the seer points across the sea, and the true peak clears.
const VENTURES = { cage: 1220, tree: 1640, seer: 1600, rise: 420 }

function Summit() {
  return (
    <>
      <g data-fx="far-peak" opacity="0">
        <path d="M1180 640 L1300 470 L1360 520 L1440 420 L1560 640 Z" fill={MYTH.peakLow} stroke={MYTH.inkLine} strokeWidth="3" />
        <path d="M1300 470 L1330 500 L1360 520 L1440 420 L1470 470" fill="none" stroke={MYTH.snow} strokeWidth="8" />
      </g>
      <path d={`M1100 ${FLOOR} V700 Q1100 660 1140 660 H1920 V${FLOOR} Z`} fill="none" />
      <path d={`M${VENTURES.tree} ${FLOOR} L${VENTURES.tree + 10} ${FLOOR - 380} M${VENTURES.tree + 6} ${FLOOR - 260} L${VENTURES.tree - 70} ${FLOOR - 340} M${VENTURES.tree + 8} ${FLOOR - 320} L${VENTURES.tree + 80} ${FLOOR - 400}`} stroke={MYTH.woodShade} strokeWidth="16" strokeLinecap="round" />
      <rect x={1000} y={FLOOR} width={920} height={80} fill={MYTH.mountainLow} />
    </>
  )
}

function Cage() {
  return (
    <g data-fx="cage">
      <path d={`M${VENTURES.cage - 130} ${FLOOR} H${VENTURES.cage + 230} M${VENTURES.cage - 130} ${FLOOR - 340} H${VENTURES.cage + 230}`} stroke={MYTH.iron} strokeWidth="14" />
      {[-130, -40, 50, 140, 230].map((dx) => (
        <path key={dx} d={`M${VENTURES.cage + dx} ${FLOOR} V${FLOOR - 340}`} stroke={MYTH.iron} strokeWidth="6" />
      ))}
      <path d={`M${VENTURES.cage + 50} ${FLOOR - 340} V-200`} stroke={MYTH.chainSteel} strokeWidth="8" strokeDasharray="14 6" />
    </g>
  )
}

const ventures: SceneSpec = {
  band: 'right',
  cast: [1100, 1740],
  script: [1700, 1500, 1600],
  figure: (scene) => (
    <>
      <Summit />
      <Figure name="seer" x={VENTURES.seer} size={SIZE.seer}>
        <Seer />
      </Figure>
      <Apprentice x={VENTURES.cage - 80} />
      <Hero x={VENTURES.cage} profession={scene.profession} />
      <Cage />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const youth = youthWriter(stage)
    const seer = figureWriter(stage, 'seer', SIZE.seer, 'bound')
    const cage = fx(stage, 'cage')
    const peak = fx(stage, 'far-peak')
    return (play) => {
      const [haul, cut, point] = [share(play, 0), share(play, 1), share(play, 2)]
      const below = VENTURES.rise * (1 - haul)
      transformTo(cage, `translate(0 ${r1(below)})`)
      const walk = ramp(cut, 0, 0.4)
      const x = lerp(VENTURES.cage, VENTURES.seer - 170, walk)
      if (play.action === 0) poseHero(him, x, at('haul', (haul * 3) % 1), 'axe', -below)
      else if (play.action === 1) poseHero(him, x, walk < 1 ? at('walk', (walk * 2) % 1) : at('chop', ramp(cut, 0.4, 1)))
      else poseHero(him, x, REST)
      youth('stand', VENTURES.cage - 80 + 60 * walk, { lift: -below })
      seer(point > 0.2 ? 'point' : cut > 0.75 ? 'free' : 'bound', VENTURES.seer)
      fadeTo(peak, ramp(point, 0.3, 0.9))
    }
  },
}

// Bands, home and the sea of the dead: the apprentice lies ill by the hearth; he lifts the hearth stones and
// unwraps the war drum of his past and its two mallets; on the deck he beats the rowers' time and the ship
// pulls away from the dead at the rail; the drum goes quiet with the apprentice asleep against it.
const BANDS = { hero: 1300, hearth: 1450, drum: 1450, youth: 1560 }

function Hearth() {
  return (
    <g data-fx="hearth">
      <rect x={1100} y={FLOOR - 440} width={720} height={440} fill={MYTH.woodShade} opacity="0.85" />
      <rect x={BANDS.hearth - 110} y={FLOOR - 30} width={220} height={30} fill={MYTH.stoneShade} stroke={MYTH.inkLine} strokeWidth="3" />
      <g data-fx="hearth-stone">
        <rect x={BANDS.hearth - 90} y={FLOOR - 60} width={180} height={34} fill={MYTH.stone} stroke={MYTH.inkLine} strokeWidth="3" />
      </g>
    </g>
  )
}

function Ship() {
  return (
    <g data-fx="ship" opacity="0">
      <path d={`M1060 ${FLOOR - 10} H1840 L1780 ${FLOOR + 70} H1110 Z`} fill={MYTH.wood} stroke={MYTH.inkLine} strokeWidth="5" />
      <path d={`M1060 ${FLOOR - 60} H1840`} stroke={MYTH.woodShade} strokeWidth="10" />
      <g data-fx="dead-hands">
        {[1090, 1150, 1780, 1830].map((x) => (
          <path key={x} d={`M${x} ${FLOOR + 80} L${x + 6} ${FLOOR - 70} l-8 -20 m8 20 l4 -24 m-4 24 l12 -18`} stroke={MYTH.deadLow} strokeWidth="9" strokeLinecap="round" fill="none" />
        ))}
      </g>
    </g>
  )
}

function WarDrum() {
  return (
    <g data-fx="war-drum">
      <path data-fx="drum-cloth" d={`M${BANDS.drum - 80} ${FLOOR - 60} Q${BANDS.drum} ${FLOOR - 140} ${BANDS.drum + 80} ${FLOOR - 60} L${BANDS.drum + 70} ${FLOOR} H${BANDS.drum - 70} Z`} fill={MYTH.leatherShade} stroke={MYTH.inkLine} strokeWidth="3" />
      <g data-fx="drum-body" opacity="0">
        <rect x={BANDS.drum - 70} y={FLOOR - 130} width={140} height={130} fill={MYTH.crimson} stroke={MYTH.inkLine} strokeWidth="4" />
        <ellipse cx={BANDS.drum} cy={FLOOR - 130} rx={70} ry={18} fill={MYTH.wrap} stroke={MYTH.inkLine} strokeWidth="4" />
        <path d={`M${BANDS.drum - 70} ${FLOOR - 120} L${BANDS.drum - 30} ${FLOOR} M${BANDS.drum} ${FLOOR - 112} L${BANDS.drum - 30} ${FLOOR} M${BANDS.drum} ${FLOOR - 112} L${BANDS.drum + 30} ${FLOOR} M${BANDS.drum + 70} ${FLOOR - 120} L${BANDS.drum + 30} ${FLOOR}`} stroke={MYTH.bone} strokeWidth="3" />
      </g>
    </g>
  )
}

const bands: SceneSpec = {
  band: 'right',
  cast: [1220, 1660],
  script: [1700, 2400],
  figure: (scene) => (
    <>
      <Hearth />
      <Ship />
      <WarDrum />
      <Apprentice x={BANDS.youth} />
      <Hero x={BANDS.hero} profession={scene.profession} />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const youth = youthWriter(stage)
    const hearth = fx(stage, 'hearth')
    const stone = fx(stage, 'hearth-stone')
    const ship = fx(stage, 'ship')
    const hands = fx(stage, 'dead-hands')
    const cloth = fx(stage, 'drum-cloth')
    const body = fx(stage, 'drum-body')
    return (play) => {
      const [dig, drum] = [share(play, 0), share(play, 1)]
      const lifted = ramp(dig, 0.1, 0.55)
      transformTo(stone, `translate(${r1(-80 * ramp(dig, 0.55, 0.7))} ${r1(-140 * lifted * (1 - ramp(dig, 0.55, 0.7)))})`)
      fadeTo(cloth, 1 - ramp(dig, 0.7, 0.95))
      fadeTo(body, ramp(dig, 0.7, 0.95))
      const aboard = ramp(drum, 0, 0.15)
      fadeTo(hearth, 1 - aboard)
      fadeTo(ship, aboard)
      fadeTo(hands, 1 - ramp(drum, 0.3, 0.85))
      transformTo(hands, `translate(0 ${r1(160 * ramp(drum, 0.3, 0.85))})`)
      if (play.action === 0) poseHero(him, BANDS.hero, at('heave', lifted), 'none')
      else poseHero(him, BANDS.hero, at('drum', drum < 0.85 ? (drum * 4) % 1 : 1), 'mallets')
      youth('sit', BANDS.youth, { flip: true })
    }
  },
}

// Muay Thai, the frozen shore under a low sun, the last duel: he takes the stranger in the clinch and knees
// him, and nothing hurts him; the apprentice's sling puts a rowan thorn in him and he feels pain for the
// first time; the falling elbow lays him in the snow, and he goes down on one knee with the apprentice's
// hand on his shoulder.
const MUAY_THAI = { hero: 1360, stranger: 1490, youth: 1130 }

const muayThai: SceneSpec = {
  band: 'right',
  cast: [1050, 1620],
  script: [1700, 1500, 1800],
  figure: (scene) => (
    <>
      <Figure name="stranger" x={MUAY_THAI.stranger} size={SIZE.stranger}>
        <Stranger first="clinched" />
      </Figure>
      <Hero x={MUAY_THAI.hero} profession={scene.profession} />
      <Apprentice x={MUAY_THAI.youth} />
      <circle data-fx="thorn" r="6" fill={MYTH.blood} stroke={MYTH.inkLine} strokeWidth="2" opacity="0" />
      <Sparks name="hit" />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const youth = youthWriter(stage)
    const stranger = figureWriter(stage, 'stranger', SIZE.stranger, 'clinched')
    const thorn = fx(stage, 'thorn')
    const hit = sparkWriter(stage, 'hit')
    return (play) => {
      const [clinch, sling, elbow] = [share(play, 0), share(play, 1), share(play, 2)]
      const strike = ramp(elbow, 0, 0.55)
      const kneel = ramp(elbow, 0.6, 1)
      if (play.action === 0) poseHero(him, MUAY_THAI.hero, clinch < 0.3 ? at('clinch', clinch / 0.3) : at('knee', ((clinch - 0.3) / 0.7) * 2 % 1), 'none')
      else if (play.action === 1) poseHero(him, MUAY_THAI.hero, at('clinch', 1), 'none')
      else poseHero(him, MUAY_THAI.hero, kneel > 0 ? at('kneel', kneel) : at('elbow', strike), 'none')
      const frame: StrangerFrame = play.action === 2 && strike > 0.6 ? 'down' : play.action >= 1 && sling > 0.55 ? 'pained' : 'clinched'
      stranger(frame, MUAY_THAI.stranger + (frame === 'down' ? 60 : 0))
      const flight = ramp(sling, 0.3, 0.55)
      const from = { x: MUAY_THAI.youth + 60, y: FLOOR - 200 }
      const to = { x: MUAY_THAI.stranger + 20, y: FLOOR - 200 }
      transformTo(thorn, `translate(${r1(lerp(from.x, to.x, flight))} ${r1(lerp(from.y, to.y, flight) - hop(flight, 60))})`)
      fadeTo(thorn, flight > 0 && flight < 1 ? 1 : 0)
      hit(to.x, to.y, ramp(sling, 0.55, 0.85))
      const come = ramp(elbow, 0.6, 1)
      youth(play.action === 1 && sling < 0.6 ? 'sling' : come > 0 ? (come < 1 ? 'walk' : 'reach') : 'stand', lerp(MUAY_THAI.youth, MUAY_THAI.hero - 150, come))
    }
  },
}

// Contact, the stair to the peak: they climb past the long wall his mentor painted long before with their
// own road, the pyre to the peak; at the top the apprentice opens the pouch and the wind takes the ashes out
// over the clouds.
const CONTACT = { from: 1160, to: 1440, rise: 220 }
// At the top he stands at ease, the near forearm let down so the axe hangs head down at his side, clear of
// the apprentice ahead of him.
const AT_EASE: Pose = { ...REST, foreNear: 20 }
// The ashes: three rows of six motes, ASHES.step apart.
const ASHES = { step: 60, width: 300 } as const

const MURAL: readonly string[] = [
  // the pyre, the door, the wheel, the wyrm, the ring, the mountain, the ship, the peak
  'M-14 10 L0 -14 L14 10 Z',
  'M-10 12 V-12 H10 V12',
  'M0 -12 A12 12 0 1 0 0.1 -12 M-12 0 H12 M0 -12 V12',
  'M-14 12 Q-12 -10 6 -12 L14 -6',
  'M-12 12 V-12 M12 12 V-12 M-4 12 V-14 H4 V12',
  'M-14 12 L0 -14 L14 12 Z',
  'M-14 4 H14 L10 12 H-10 Z M0 4 V-14',
  'M-14 12 L-2 -12 L4 -2 L8 -8 L14 12',
]

function Stair() {
  return (
    <>
      <rect x={1100} y={FLOOR - 560} width={700} height={200} fill={MYTH.stone} stroke={MYTH.inkLine} strokeWidth="4" />
      {MURAL.map((d, i) => (
        <g key={d} transform={`translate(${1150 + i * 84} ${FLOOR - 460})`}>
          <path d={d} fill="none" stroke={MYTH.goldDeep} strokeWidth="4" strokeLinejoin="round" />
          {i < MURAL.length - 1 && <path d="M20 0 H62" stroke={MYTH.boneShade} strokeWidth="3" strokeDasharray="6 6" />}
        </g>
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} x={1120 + i * 46} y={FLOOR - i * 36 - 20} width={360 - i * 30} height={20 + i * 36} fill={MYTH.stoneShade} stroke={MYTH.inkLine} strokeWidth="2" />
      ))}
      <path d={`M1430 ${FLOOR - 230} H1920 V${FLOOR} H1430 Z`} fill={MYTH.stoneShade} stroke={MYTH.inkLine} strokeWidth="3" />
      <g data-fx="ashes" opacity="0">
        {Array.from({ length: 18 }, (_, i) => (
          <circle key={i} cx={(i % 6) * ASHES.step} cy={-((i * 37) % 110)} r={3 + (i % 3)} fill={MYTH.ash} />
        ))}
      </g>
    </>
  )
}

const contact: SceneSpec = {
  band: 'right',
  cast: [1080, 1760],
  script: [2000, 2200],
  figure: (scene) => (
    <>
      <Stair />
      <Hero x={CONTACT.from} profession={scene.profession} />
      <Apprentice x={CONTACT.from + 110} />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const youth = youthWriter(stage)
    const ashes = fx(stage, 'ashes')
    return (play) => {
      const [climb, scatter] = [share(play, 0), share(play, 1)]
      const x = lerp(CONTACT.from, CONTACT.to, climb)
      const lift = CONTACT.rise * climb
      poseHero(him, x, climb < 1 ? at('walk', (climb * 3) % 1) : AT_EASE, 'axe', lift)
      const ahead = Math.min(CONTACT.to + 140, x + 120 + 40 * climb)
      youth(climb < 1 ? 'walk' : 'reach', ahead, { lift: CONTACT.rise * ramp(climb, 0, 0.9), pouch: 1 - ramp(scatter, 0.2, 0.4) })
      // the ashes leave the pouch and spread as they rise over the clouds, centred over the band so the last
      // frame holds them in view
      const blown = ramp(scatter, 0.2, 1)
      const size = 0.5 + 0.8 * blown
      transformTo(ashes, `translate(${r1(ahead + 20 - 60 * blown - ASHES.width * size / 2)} ${r1(FLOOR - CONTACT.rise - 120 - 260 * blown)}) scale(${size.toFixed(3)})`)
      fadeTo(ashes, ramp(scatter, 0.2, 0.35) * (1 - 0.25 * ramp(scatter, 0.7, 1)))
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
  /** The place whose weather this scene plays (depths.tsx), when it is the first scene in that place. */
  era?: Zone
}

// The first scene in a place also plays that place's weather behind the page: the weather's parts are CSS
// runs held paused (underworld.module.css), scrubbed by --era-t, the share of the scene played, so the snow,
// the mist and the smoke follow the scroll with the scene, back on the way up, again every pass.
const eraWriter = (zone: Zone | undefined, script: SceneScript) => {
  if (!zone) return () => undefined
  let era: HTMLElement | null = null
  return (play: Playhead) => {
    era ??= document.querySelector<HTMLElement>(`[data-era="${zone}"]`)
    era?.style.setProperty('--era-t', (elapsedOf(script, play) / sceneLength(script)).toFixed(4))
  }
}

const sceneOf = (id: SceneId, count: number, profession: Profession, era?: Zone): MythScene => {
  const spec = SCENES[id]
  return {
    id,
    count,
    profession,
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

/** The page's scenes in order: the hero, the profession's sections, the contact; the first in each place
 *  plays its weather. */
export function scenesOf(slots: readonly SectionSlot[], labels: Labels, highlights: readonly string[], profession: Profession): MythScene[] {
  const ids: SceneId[] = ['hero', ...slots.map((slot) => slot.id), 'contact']
  const counts = new Map(slots.map((slot) => [slot.id, countOf(slot, labels, highlights)]))
  return ids.map((id, index) => {
    const zone = ZONE_OF[id]
    const leads = ids.findIndex((other) => ZONE_OF[other] === zone) === index
    return sceneOf(id, counts.get(id as SectionId) ?? 0, profession, leads ? zone : undefined)
  })
}

/** A scene's picture: its field of figures over the places of the journey. */
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
              <g className={spec.band === 'left' ? s.leftBand : s.rightBand} style={spec.cast && phoneFrame(spec.cast)}>
                {spec.figure(scene)}
              </g>
            </svg>
          ),
        },
      ]}
    />
  )
}
