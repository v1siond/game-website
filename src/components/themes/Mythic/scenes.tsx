'use client'

import type { ReactNode } from 'react'
import type { Labels } from '@/lib/cv/labels'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import { stageItems } from '@/lib/cv/stageItems'
import { hop } from '@/lib/motion/arc'
import { actionLengths, elapsedOf, sceneEnd, type Playhead, type SceneScript } from '@/lib/scroll/player'
import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, focusOn, fx, lerp, r1, transformTo } from '@/components/themes/shared/stageNodes'
import { Stage } from '@/components/themes/shared/theatre/Stage'
import type { LayerMotions, StageWriter, TheatreScene } from '@/components/themes/shared/theatre/useTheatre'
import { FOE, type FoeName } from './foes'
import { MYTH } from './palette'
import { bodyTransform, jointTransform, poseAt, REST, type Joint, type Pose } from './rig'
import { FIGURE_BOX, HeroFigure } from './sprite'
import s from './sprite.module.css'

// His scenes on the shared theatre, one per part of the page, over the fixed depths of the descent
// (depths.tsx), each a place of the god of war games and one to three of their moves, played by the scroll
// on the shared scene player (src/lib/scroll/player.ts) at the scene's own pace, back on the way up, the end
// frame held: the shield out of the vambrace and the frost up the axe; the axe thrown into a pillar and
// called back to the hand; the shield bash and the heavy blow over the rail; the chained blades thrown to a
// ring and the swing up to the ledge; the axe's frost locking a gear wheel; Spartan Rage and the bare handed
// slam; the boat rowed to the realm door as its runes light; the dodge and the runic ice under the bronze
// giant; the parry and the finisher; the realm travel light lifting him off the summit. Nothing steps per
// card. A scene drawn settled (reduced motion) holds its end frame.

export type SceneId = 'hero' | SectionId | 'contact'

/** The field pushes in a little across its scene. */
export const FIELD_MOTION: LayerMotions = { figure: { zoom: [1.0, 1.04], lift: [0, -1] } }

// The field: a 1920 by 1080 picture cut to the screen from its foot, his feet on FLOOR. The sections read in
// a column on the left from lg (stage.tsx COLUMN), so their scenes play on the right; the hero stands in the
// hall's left bay. Under 1024 px sprite.module.css moves each band to the middle the screen shows.
const FIELD = { width: 1920, height: 1080 }
const FLOOR = 1000
const HERO_HEIGHT = 300
const HERO_SCALE = HERO_HEIGHT / FIGURE_BOX.height
// A foe's 60 by 80 box, its feet at (30, 78).
const FOE_FEET = { x: 30, y: 78 }

// ---- him ----

interface HeroNodes {
  root: Element | null
  body: Element | null
  joints: Array<{ joint: Joint; node: Element }>
  light: Element | null
  axe: Element | null
  shield: Element | null
  rage: Element | null
}

const heroNodes = (stage: ParentNode): HeroNodes => {
  const root = fx(stage, 'hero')
  return {
    root,
    body: root?.querySelector('[data-body]') ?? null,
    joints: Array.from(root?.querySelectorAll<SVGGElement>('[data-joint]') ?? [], (node) => ({ joint: node.dataset.joint as Joint, node })),
    light: root?.querySelector('[data-fx="axe-frost"]') ?? null,
    axe: root?.querySelector('[data-fx="axe-held"]') ?? null,
    shield: root?.querySelector('[data-fx="shield"]') ?? null,
    rage: root?.querySelector('[data-fx="rage"]') ?? null,
  }
}

const heroAt = (x: number, lift = 0): string =>
  `translate(${r1(x - FIGURE_BOX.feetX * HERO_SCALE)} ${r1(FLOOR - FIGURE_BOX.feetY * HERO_SCALE - lift)}) scale(${HERO_SCALE.toFixed(3)})`

/** What he carries in a frame: the frost on the axe, the axe in his hand or away, the shield out of the
 *  vambrace, the rage's light, each 0 to 1. */
interface Kit {
  frost?: number
  axe?: number
  shield?: number
  rage?: number
}

// The shield's middle on his drawing (sprite.tsx SHIELD_AT): it unfolds from there.
const SHIELD_MIDDLE = { x: 86, y: 116 }

/** Stands him at `x`, `lift` off the floor, in `pose`, with his kit. */
const poseHero = (nodes: HeroNodes, x: number, pose: Pose, { frost = 0, axe = 1, shield = 1, rage = 0 }: Kit = {}, lift = 0): void => {
  transformTo(nodes.root, heroAt(x, lift))
  transformTo(nodes.body, bodyTransform(pose))
  for (const { joint, node } of nodes.joints) transformTo(node, jointTransform(joint, pose[joint]))
  fadeTo(nodes.light, frost)
  fadeTo(nodes.axe, axe)
  fadeTo(nodes.rage, rage)
  transformTo(nodes.shield, `translate(${SHIELD_MIDDLE.x} ${SHIELD_MIDDLE.y}) scale(${Math.max(0.001, shield).toFixed(3)}) translate(${-SHIELD_MIDDLE.x} ${-SHIELD_MIDDLE.y})`)
}

/** Where his near hand is, at x and `lift`, with the arm thrown out ahead (the throw's release, the catch). */
const handOut = (x: number, lift = 0) => ({ x: x + 100, y: FLOOR - 175 - lift })

function Hero({ x, profession, figure = false }: { x: number; profession: Profession; figure?: boolean }) {
  return (
    <g data-fx="hero" data-worlds-figure={figure ? '' : undefined} transform={heroAt(x)}>
      <HeroFigure profession={profession} />
    </g>
  )
}

/** A foe of the deep, its feet at (x, FLOOR) facing him, at `size` times its box. */
const foeAt = (x: number, size: number, lift = 0, turn = 0): string =>
  `translate(${r1(x)} ${r1(FLOOR - lift)}) rotate(${r1(turn)}) scale(${size}) translate(${-FOE_FEET.x} ${-FOE_FEET.y})`

function Foe({ name, kind, x, size }: { name: string; kind: FoeName; x: number; size: number }) {
  const Drawing = FOE[kind]
  return (
    <g data-fx={name} transform={foeAt(x, size)}>
      <Drawing />
    </g>
  )
}

/** The axe in flight, spinning: the haft and the bearded head with its frost edge, round its middle. */
function FlyingAxe({ name }: { name: string }) {
  return (
    <g data-fx={name} opacity="0">
      <g data-fx={`${name}-spin`}>
        <path d="M-6 -70 L6 -70 L4 50 L-4 50 Z" fill={MYTH.leather} stroke={MYTH.inkLine} strokeWidth="4" />
        <path d="M2 18 Q40 10 58 40 Q50 72 18 72 L14 58 Q36 56 36 42 L4 40 Z" fill={MYTH.steel} stroke={MYTH.inkLine} strokeWidth="4" />
        <path d="M30 14 Q54 24 58 40 Q50 72 18 72" fill="none" stroke={MYTH.frost} strokeWidth="5" />
      </g>
    </g>
  )
}

/** A burst of frost where the axe bites: the ring and its shards. */
function FrostBurst({ name }: { name: string }) {
  return (
    <g data-fx={name} opacity="0">
      <circle r="70" fill={MYTH.frost} opacity="0.3" />
      <circle r="40" fill={MYTH.frostCore} opacity="0.6" />
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <path key={angle} d="M0 -46 L10 -96 L0 -86 L-10 -96 Z" fill={MYTH.frostCore} stroke={MYTH.inkLine} strokeWidth="3" transform={`rotate(${angle})`} />
      ))}
    </g>
  )
}

/** Moves a flying axe to (x, y), turned `turn` degrees, shown at `shown`. */
const flyAxe = (node: Element | null, spin: Element | null, x: number, y: number, turn: number, shown: number): void => {
  transformTo(node, `translate(${r1(x)} ${r1(y)})`)
  transformTo(spin, `rotate(${r1(turn)})`)
  fadeTo(node, shown)
}

/** A ring of dust and stones round where a blow lands. */
function DustRing({ name }: { name: string }) {
  return (
    <g data-fx={name} opacity="0">
      <ellipse rx="120" ry="20" fill="none" stroke={MYTH.boneShade} strokeWidth="8" />
      <ellipse rx="80" ry="12" fill={MYTH.ash} opacity="0.4" />
    </g>
  )
}


// ---- the scenes ----

interface SceneSpec {
  /** The band the scene plays in (sprite.module.css moves it under 1024 px). */
  band: 'left' | 'right'
  /** Its actions' wished lengths in ms, one to three. */
  script: SceneScript
  figure: (scene: MythScene) => ReactNode
  bind: (stage: HTMLElement, scene: MythScene) => (play: Playhead) => void
}

/** How far action `i` has played: all of it before, its eased share while it plays, none after. */
const share = ({ action, t }: Playhead, i: number): number => (action > i ? 1 : action === i ? t : 0)

// The hero, the great hall: the shield snaps out of the vambrace on his far arm into his guard, then frost
// runs up the axe's edge.
const HERO_X = 600

const hero: SceneSpec = {
  band: 'left',
  script: [1500, 1500],
  figure: (scene) => <Hero x={HERO_X} profession={scene.profession} figure />,
  bind: (stage) => {
    const him = heroNodes(stage)
    return (play) => {
      const out = share(play, 0)
      poseHero(him, HERO_X, poseAt('parry', 0.3 * out), { shield: ramp(out, 0.2, 0.7), frost: ramp(share(play, 1), 0.1, 0.8) })
    }
  },
}

// About, the axe thrown and called back: wound back and thrown, it spins across the hall and bites into a
// pillar with a burst of frost; then he holds out his hand and it spins back into his palm.
const ABOUT = { x: 1180, pillar: { x: 1600, y: FLOOR - 250 } }

function Pillar({ x }: { x: number }) {
  return (
    <g>
      <rect x={x - 46} y={FLOOR - 560} width="92" height="560" fill={MYTH.columnLight} stroke={MYTH.inkLine} strokeWidth="5" />
      <rect x={x - 62} y={FLOOR - 590} width="124" height="34" fill={MYTH.columnLight} stroke={MYTH.inkLine} strokeWidth="5" />
      <path d={`M${x - 20} ${FLOOR - 540} V${FLOOR - 20} M${x + 20} ${FLOOR - 540} V${FLOOR - 20}`} stroke={MYTH.inkLine} strokeWidth="3" opacity="0.5" />
    </g>
  )
}

const about: SceneSpec = {
  band: 'right',
  script: [1600, 1500],
  figure: (scene) => (
    <>
      <Pillar x={ABOUT.pillar.x} />
      <g transform={`translate(${ABOUT.pillar.x - 40} ${ABOUT.pillar.y})`}>
        <FrostBurst name="burst" />
      </g>
      <Hero x={ABOUT.x} profession={scene.profession} />
      <FlyingAxe name="thrown" />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const axe = fx(stage, 'thrown')
    const spin = fx(stage, 'thrown-spin')
    const burst = fx(stage, 'burst')
    const hand = handOut(ABOUT.x)
    const bite = { x: ABOUT.pillar.x - 70, y: ABOUT.pillar.y }
    return (play) => {
      const thrown = share(play, 0)
      const called = share(play, 1)
      const out = ramp(thrown, 0.6, 1)
      const back = ramp(called, 0.2, 0.75)
      const flying = (out > 0 && called === 0) || (back > 0 && back < 1) ? 1 : called > 0 && back === 0 ? 1 : 0
      const at = called > 0 ? back : 1 - out
      flyAxe(axe, spin, lerp(bite.x, hand.x, at), lerp(bite.y, hand.y, at) - hop(1 - at, 60), 720 * (1 - at), thrown >= 0.6 && back < 1 ? flying : 0)
      const frost = ramp(thrown, 0.92, 1)
      transformTo(burst, `scale(${(0.4 + 0.6 * frost).toFixed(3)})`)
      fadeTo(burst, frost * (1 - 0.6 * ramp(called, 0, 0.3)))
      const held = thrown < 0.6 || back >= 1 ? 1 : 0
      const pose = called > 0 ? poseAt('catch', called) : poseAt('throw', thrown)
      poseHero(him, ABOUT.x, pose, { axe: held, frost: back >= 1 ? 0.6 : 0 })
    }
  },
}

// Work, the storm deck: a soldier comes in and thrusts, his shield takes it and bashes the soldier back;
// then the heavy axe blow knocks it over the rail into the sea.
const WORK = { x: 1220, foeFrom: 1760, foeAt: 1450, size: 2.6, over: 300 }

const work: SceneSpec = {
  band: 'right',
  script: [1600, 1600],
  figure: (scene) => (
    <>
      <path d={`M1100 ${FLOOR - 120} H1760`} stroke={MYTH.leatherShade} strokeWidth="12" />
      <path d={`M1100 ${FLOOR - 120} H1760`} stroke={MYTH.leather} strokeWidth="6" />
      {[1140, 1300, 1460, 1620, 1740].map((x) => (
        <path key={x} d={`M${x} ${FLOOR - 120} V${FLOOR}`} stroke={MYTH.leatherShade} strokeWidth="10" />
      ))}
      <Foe name="foe" kind="legionnaire" x={WORK.foeFrom} size={WORK.size} />
      <Hero x={WORK.x} profession={scene.profession} />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const foe = fx(stage, 'foe')
    return (play) => {
      const bashed = share(play, 0)
      const struck = share(play, 1)
      const comes = ramp(bashed, 0, 0.35)
      const knockedBack = 40 * ramp(bashed, 0.45, 0.7)
      const over = ramp(struck, 0.55, 1)
      transformTo(foe, foeAt(lerp(WORK.foeFrom, WORK.foeAt, comes) + knockedBack + WORK.over * over, WORK.size, hop(over, 200), 70 * over))
      fadeTo(foe, 1 - ramp(struck, 0.85, 1))
      const pose = struck > 0 ? poseAt('finisher', struck) : poseAt('bash', ramp(bashed, 0.3, 0.8))
      poseHero(him, WORK.x, pose)
    }
  },
}

// The Tech Stack, the cliff over the storm sea: he throws the chained blades up and they catch on an iron
// ring in the rock; then he swings up on the chains and lands on the ledge, the chains coiling back.
const TECH = { x: 1200, ring: { x: 1520, y: FLOOR - 620 }, ledge: { x: 1470, top: FLOOR - 380 } }

const tech: SceneSpec = {
  band: 'right',
  script: [1400, 1800],
  figure: (scene) => (
    <>
      <path d={`M${TECH.ledge.x - 110} ${TECH.ledge.top} L${TECH.ledge.x + 300} ${TECH.ledge.top} L${TECH.ledge.x + 300} ${FLOOR} L${TECH.ledge.x - 60} ${FLOOR} Z`} fill={MYTH.basalt} stroke={MYTH.inkLine} strokeWidth="6" />
      <path d={`M${TECH.ledge.x + 40} -100 L${TECH.ledge.x + 40} ${TECH.ledge.top} M${TECH.ledge.x + 40} ${TECH.ledge.top - 200} H${TECH.ledge.x + 300}`} stroke={MYTH.basalt} strokeWidth="140" />
      <circle cx={TECH.ring.x} cy={TECH.ring.y} r="22" fill="none" stroke={MYTH.chainSteel} strokeWidth="9" />
      <g data-fx="chains" opacity="0">
        <path data-fx="chain-a" d="M0 0 L1 0" stroke={MYTH.inkLine} strokeWidth="9" />
        <path data-fx="chain-b" d="M0 0 L1 0" stroke={MYTH.chainSteel} strokeWidth="5" strokeDasharray="14 6" />
        <circle data-fx="chain-blade" r="16" fill={MYTH.bladeFire} stroke={MYTH.inkLine} strokeWidth="4" />
      </g>
      <Hero x={TECH.x} profession={scene.profession} />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const chains = fx(stage, 'chains')
    const lines = [fx(stage, 'chain-a'), fx(stage, 'chain-b')]
    const blade = fx(stage, 'chain-blade')
    return (play) => {
      const cast = share(play, 0)
      const swung = share(play, 1)
      const rise = ramp(swung, 0, 0.75)
      const x = lerp(TECH.x, TECH.ledge.x + 20, rise)
      const lift = (FLOOR - TECH.ledge.top) * Math.min(1, rise * 1.15) + hop(rise, 60)
      const hand = { x: x + 20, y: FLOOR - 300 - lift }
      // the blades fly up to the ring over the cast; while he swings they hold him there
      const reach = ramp(cast, 0.3, 0.8)
      const tip = { x: lerp(hand.x, TECH.ring.x, reach), y: lerp(hand.y, TECH.ring.y, reach) }
      lines.forEach((line) => line?.setAttribute('d', `M${r1(hand.x)} ${r1(hand.y)} L${r1(tip.x)} ${r1(tip.y)}`))
      transformTo(blade, `translate(${r1(tip.x)} ${r1(tip.y)})`)
      fadeTo(chains, cast > 0.25 ? 1 - ramp(swung, 0.8, 1) : 0)
      const landed = ramp(swung, 0.75, 1)
      const pose = swung > 0 ? (landed > 0 ? poseAt('slam', 0.55 + 0.45 * landed) : poseAt('climb', 0)) : poseAt('raise', ramp(cast, 0, 0.4))
      poseHero(him, x, landed >= 1 ? REST : pose, {}, lift)
    }
  },
}

// Services, the frozen mechanism: a gear wheel turns and a spiked gate grinds down; he throws the axe, it
// bites the wheel and the frost locks it, the gate held part way; then he calls the axe back and the wheel
// stays frozen.
const SERVICES = { x: 1180, wheel: { x: 1560, y: FLOOR - 330, r: 110 }, gate: { x: 1700, drop: 220 }, script: [1700, 1500] as SceneScript }

function Gear() {
  const { r } = SERVICES.wheel
  return (
    <g data-fx="gear">
      <circle r={r} fill={MYTH.bronze} stroke={MYTH.inkLine} strokeWidth="6" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={-14} y={-r - 22} width={28} height={30} fill={MYTH.bronze} stroke={MYTH.inkLine} strokeWidth="5" transform={`rotate(${i * 30})`} />
      ))}
      <circle r={r * 0.35} fill={MYTH.leatherShade} stroke={MYTH.inkLine} strokeWidth="5" />
      <path d={`M0 ${-r * 0.8} V${r * 0.8} M${-r * 0.8} 0 H${r * 0.8}`} stroke={MYTH.inkLine} strokeWidth="8" />
    </g>
  )
}

const services: SceneSpec = {
  band: 'right',
  script: SERVICES.script,
  figure: (scene) => (
    <>
      <g data-fx="gate">
        <rect x={SERVICES.gate.x - 60} y={FLOOR - 640} width="140" height="400" fill="none" stroke={MYTH.chainSteel} strokeWidth="10" />
        {[0, 35, 70, 105].map((dx) => (
          <path key={dx} d={`M${SERVICES.gate.x - 50 + dx} ${FLOOR - 640} V${FLOOR - 230} l10 26 l10 -26`} stroke={MYTH.chainSteel} strokeWidth="9" fill="none" />
        ))}
      </g>
      <g transform={`translate(${SERVICES.wheel.x} ${SERVICES.wheel.y})`}>
        <Gear />
        <g data-fx="gear-frost" opacity="0">
          <circle r={SERVICES.wheel.r + 24} fill={MYTH.frost} opacity="0.45" />
          <circle r={SERVICES.wheel.r * 0.7} fill={MYTH.frostCore} opacity="0.5" />
        </g>
      </g>
      <Hero x={SERVICES.x} profession={scene.profession} />
      <FlyingAxe name="thrown" />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const gear = fx(stage, 'gear')
    const frost = fx(stage, 'gear-frost')
    const gate = fx(stage, 'gate')
    const axe = fx(stage, 'thrown')
    const spin = fx(stage, 'thrown-spin')
    const hand = handOut(SERVICES.x)
    const bite = { x: SERVICES.wheel.x - 60, y: SERVICES.wheel.y + 20 }
    const [throwMs] = actionLengths(SERVICES.script)
    // the wheel turns at a steady pace until the axe bites it, then it is locked where it stopped
    const lockedAt = 0.85 * throwMs
    return (play) => {
      const thrown = share(play, 0)
      const called = share(play, 1)
      const ms = Math.min(elapsedOf(SERVICES.script, play), lockedAt)
      transformTo(gear, `rotate(${r1(ms * 0.12)})`)
      transformTo(gate, `translate(0 ${r1(SERVICES.gate.drop * (ms / lockedAt))})`)
      fadeTo(frost, ramp(thrown, 0.85, 1))
      const out = ramp(thrown, 0.6, 0.85)
      const back = ramp(called, 0.2, 0.75)
      const at = called > 0 ? back : 1 - out
      flyAxe(axe, spin, lerp(bite.x, hand.x, at), lerp(bite.y, hand.y, at), 720 * (1 - at), thrown >= 0.6 && back < 1 ? 1 : 0)
      const pose = called > 0 ? poseAt('catch', called) : poseAt('throw', thrown)
      poseHero(him, SERVICES.x, pose, { axe: thrown < 0.6 || back >= 1 ? 1 : 0 })
    }
  },
}

// Projects, Spartan Rage over the magma: a fire spirit rises before him and the rage fills, its red light
// climbing him as he roars with the axe put away; then he slams the ground bare handed and the shockwave
// runs out and bursts the spirit.
const PROJECTS = { x: 1220, spiritX: 1600, size: 2.4 }

const projects: SceneSpec = {
  band: 'right',
  script: [1700, 1500],
  figure: (scene) => (
    <>
      <Foe name="spirit" kind="spirit" x={PROJECTS.spiritX} size={PROJECTS.size} />
      <g transform={`translate(${PROJECTS.x + 90} ${FLOOR})`}>
        <DustRing name="dust" />
        <g data-fx="wave" opacity="0">
          <ellipse rx="160" ry="26" fill="none" stroke={MYTH.blood} strokeWidth="14" />
          <ellipse rx="160" ry="26" fill="none" stroke={MYTH.fireCore} strokeWidth="4" />
        </g>
      </g>
      <Hero x={PROJECTS.x} profession={scene.profession} />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const spirit = fx(stage, 'spirit')
    const dust = fx(stage, 'dust')
    const wave = fx(stage, 'wave')
    return (play) => {
      const raged = share(play, 0)
      const slammed = share(play, 1)
      const rage = ramp(raged, 0.2, 0.8) * (1 - ramp(slammed, 0.75, 1))
      const run = ramp(slammed, 0.5, 0.9)
      transformTo(wave, `translate(${r1(300 * run)} 0) scale(${(0.4 + 0.9 * run).toFixed(3)} 1)`)
      fadeTo(wave, slammed > 0.5 ? 1 - ramp(slammed, 0.85, 1) : 0)
      transformTo(dust, `scale(${lerp(0.3, 1.3, ramp(slammed, 0.5, 0.8)).toFixed(3)})`)
      fadeTo(dust, bell(slammed, 0.5, 1))
      const burst = ramp(slammed, 0.75, 0.95)
      transformTo(spirit, foeAt(PROJECTS.spiritX, PROJECTS.size * (1 + 0.4 * burst), 30 * bell(raged, 0, 1)))
      fadeTo(spirit, ramp(raged, 0, 0.2) * (1 - burst))
      const pose = slammed > 0 ? poseAt('slam', ramp(slammed, 0, 0.6)) : poseAt('rage', raged)
      poseHero(him, PROJECTS.x, pose, { axe: 1 - ramp(raged, 0, 0.3), rage, shield: 1 - ramp(raged, 0, 0.3) })
    }
  },
}

// Ventures, the boat and the realm door: he rows across the lake of fire light; then at the far shore the
// door in the rock lights its runes one after another and opens on a bridge of light.
const VENTURES = { from: 1120, to: 1380, door: 1660, script: [2000, 1600] as SceneScript, strokeMs: 900 }

function Boat() {
  return (
    <g>
      <path d="M-150 -40 Q-160 -70 -170 -90 L-140 -70 L140 -70 L180 -100 Q170 -60 150 -40 Q0 10 -150 -40 Z" fill={MYTH.leather} stroke={MYTH.inkLine} strokeWidth="6" />
      <path d="M-140 -62 H150" stroke={MYTH.leatherShade} strokeWidth="5" />
    </g>
  )
}

function RealmDoor() {
  const { door } = VENTURES
  return (
    <g>
      <path d={`M${door - 120} ${FLOOR} V${FLOOR - 360} Q${door} ${FLOOR - 470} ${door + 120} ${FLOOR - 360} V${FLOOR} Z`} fill={MYTH.basalt} stroke={MYTH.inkLine} strokeWidth="8" />
      <path d={`M${door - 80} ${FLOOR} V${FLOOR - 340} Q${door} ${FLOOR - 420} ${door + 80} ${FLOOR - 340} V${FLOOR} Z`} fill={MYTH.inkLine} />
      <g data-fx="door-light" opacity="0">
        <path d={`M${door - 80} ${FLOOR} V${FLOOR - 340} Q${door} ${FLOOR - 420} ${door + 80} ${FLOOR - 340} V${FLOOR} Z`} fill={MYTH.frost} opacity="0.55" />
        <path d={`M${door - 30} ${FLOOR} V${FLOOR - 330} Q${door} ${FLOOR - 360} ${door + 30} ${FLOOR - 330} V${FLOOR} Z`} fill={MYTH.frostCore} opacity="0.8" />
        <path d={`M${door - 80} ${FLOOR - 20} L${VENTURES.to + 160} ${FLOOR - 40} L${VENTURES.to + 160} ${FLOOR - 20} Z`} fill={MYTH.frostCore} opacity="0.7" />
      </g>
      {Array.from({ length: 7 }, (_, i) => {
        const angle = Math.PI * (0.15 + (0.7 * i) / 6)
        const x = door - Math.cos(angle) * 100
        const y = FLOOR - 340 - Math.sin(angle) * 80 + (i === 0 || i === 6 ? 40 : 0)
        return (
          <g key={i} data-fx={`rune-${i}`} opacity="0.25" transform={`translate(${r1(x)} ${r1(y)})`}>
            <path d="M0 -14 V14 M0 -6 L9 -14 M0 4 L-9 -4" stroke={MYTH.frost} strokeWidth="4" strokeLinecap="round" fill="none" />
          </g>
        )
      })}
    </g>
  )
}

const ventures: SceneSpec = {
  band: 'right',
  script: VENTURES.script,
  figure: (scene) => (
    <>
      <RealmDoor />
      <rect x="1000" y={FLOOR - 30} width="900" height="140" fill={MYTH.aspLow} />
      <path d={`M1000 ${FLOOR - 30} H1900`} stroke={MYTH.magma} strokeWidth="4" opacity="0.7" />
      <Hero x={VENTURES.from} profession={scene.profession} />
      <g data-fx="boat" transform={`translate(${VENTURES.from} ${FLOOR})`}>
        <Boat />
      </g>
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const boat = fx(stage, 'boat')
    const light = fx(stage, 'door-light')
    const runes = Array.from({ length: 7 }, (_, i) => fx(stage, `rune-${i}`))
    return (play) => {
      const rowed = share(play, 0)
      const opened = share(play, 1)
      const x = lerp(VENTURES.from, VENTURES.to, rowed)
      const bob = 4 * Math.sin(elapsedOf(VENTURES.script, play) / 260)
      transformTo(boat, `translate(${r1(x)} ${r1(FLOOR + bob)})`)
      // he sits a little behind the boat's middle, the oar strokes at a steady pace while it moves
      const stroke = (elapsedOf(VENTURES.script, play) / VENTURES.strokeMs) % 1
      poseHero(him, x - 30, poseAt('row', rowed > 0 && rowed < 1 ? stroke : 0), { axe: 0 }, 70 - bob)
      runes.forEach((rune, i) => fadeTo(rune, 0.25 + 0.75 * ramp(opened, i * 0.08, i * 0.08 + 0.2)))
      fadeTo(light, ramp(opened, 0.6, 1))
    }
  },
}

// Bands, the bronze giant: it swings at him and he dodges under the blow; then the runic attack, the axe
// driven into the ground with its frost, ice spikes running to the giant's heel, and it drops to one knee.
const BANDS = { x: 1180, giantX: 1560, size: 6.2, zoom: 0.82, spikes: 6 }

const bands: SceneSpec = {
  band: 'right',
  script: [1500, 1800],
  figure: (scene) => (
    <g data-fx="camera">
      <Foe name="giant" kind="cyclops" x={BANDS.giantX} size={BANDS.size} />
      {Array.from({ length: BANDS.spikes }, (_, i) => (
        <g key={i} data-fx={`spike-${i}`} transform={`translate(${BANDS.x + 110 + i * 50} ${FLOOR}) scale(1 0)`}>
          <path d="M-22 0 L0 -110 L22 0 Z" fill={MYTH.frost} stroke={MYTH.inkLine} strokeWidth="5" />
          <path d="M-6 -10 L0 -80" stroke={MYTH.frostCore} strokeWidth="5" />
        </g>
      ))}
      <Hero x={BANDS.x} profession={scene.profession} />
    </g>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const camera = fx(stage, 'camera')
    const giant = fx(stage, 'giant')
    const spikes = Array.from({ length: BANDS.spikes }, (_, i) => fx(stage, `spike-${i}`))
    transformTo(camera, focusOn(BANDS.giantX - 160, FLOOR - 200, BANDS.zoom))
    return (play) => {
      const dodged = share(play, 0)
      const runed = share(play, 1)
      const swing = bell(dodged, 0.2, 0.7)
      const kneel = ramp(runed, 0.6, 0.95)
      transformTo(giant, foeAt(BANDS.giantX, BANDS.size, -90 * kneel, -10 * swing + 6 * kneel))
      spikes.forEach((spike, i) => {
        const up = ramp(runed, 0.35 + i * 0.06, 0.5 + i * 0.06)
        transformTo(spike, `translate(${BANDS.x + 110 + i * 50} ${FLOOR}) scale(1 ${up.toFixed(3)})`)
      })
      const pose = runed > 0 ? poseAt('slam', ramp(runed, 0, 0.5)) : poseAt('dodge', ramp(dodged, 0.1, 0.9))
      poseHero(him, BANDS.x, pose, { frost: ramp(runed, 0.2, 0.4) })
    }
  },
}

// The Muay Thai record, the duel: the champion thrusts and his shield parries it in a ring of light; then
// the finisher, the ring over the beaten champion that calls it, the long blow, the champion down and the
// camera pushed in.
const DUEL = { x: 1220, champion: 1500, size: 3.1, lunge: 70, zoom: 1.2 }

const muayThai: SceneSpec = {
  band: 'right',
  script: [1500, 1900],
  figure: (scene) => (
    <g data-fx="camera">
      <Foe name="champion" kind="legionnaire" x={DUEL.champion} size={DUEL.size} />
      <g data-fx="parry-ring" opacity="0" transform={`translate(${DUEL.x + 70} ${FLOOR - 170})`}>
        <circle r="60" fill="none" stroke={MYTH.goldPale} strokeWidth="8" />
        <circle r="36" fill={MYTH.goldPale} opacity="0.35" />
      </g>
      <g data-fx="prompt" opacity="0" transform={`translate(${DUEL.champion} ${FLOOR - 330})`}>
        <circle r="34" fill={MYTH.inkLine} stroke={MYTH.bone} strokeWidth="6" />
        <circle r="14" fill="none" stroke={MYTH.blood} strokeWidth="6" />
      </g>
      <Hero x={DUEL.x} profession={scene.profession} />
    </g>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const camera = fx(stage, 'camera')
    const champion = fx(stage, 'champion')
    const ring = fx(stage, 'parry-ring')
    const prompt = fx(stage, 'prompt')
    return (play) => {
      const parried = share(play, 0)
      const finished = share(play, 1)
      const thrust = bell(parried, 0.15, 0.6)
      const down = ramp(finished, 0.55, 0.8)
      transformTo(champion, foeAt(DUEL.champion - DUEL.lunge * thrust + 40 * ramp(parried, 0.6, 0.9) * (1 - down), DUEL.size, 0, 80 * down))
      fadeTo(champion, 1 - 0.4 * down)
      transformTo(ring, `translate(${DUEL.x + 70} ${FLOOR - 170}) scale(${(0.5 + 0.8 * ramp(parried, 0.4, 0.7)).toFixed(3)})`)
      fadeTo(ring, bell(parried, 0.4, 0.8))
      fadeTo(prompt, bell(finished, 0, 0.5))
      transformTo(camera, focusOn(DUEL.x + 120, FLOOR - 160, lerp(1, DUEL.zoom, ramp(finished, 0.1, 0.5))))
      poseHero(him, DUEL.x, finished > 0 ? poseAt('finisher', ramp(finished, 0.2, 1)) : poseAt('parry', ramp(parried, 0.1, 0.9)))
    }
  },
}

// The contact, the summit at dawn: he raises the axe and the light of the realm travel opens round him;
// then it lifts him off the summit and he is gone into it.
const CONTACT = { x: 1300, rise: 260 }

const contact: SceneSpec = {
  band: 'right',
  script: [1500, 1600],
  figure: (scene) => (
    <>
      <g data-fx="column" opacity="0" transform={`translate(${CONTACT.x} ${FLOOR})`}>
        <rect x="-110" y="-1100" width="220" height="1100" fill={MYTH.frost} opacity="0.3" />
        <rect x="-50" y="-1100" width="100" height="1100" fill={MYTH.frostCore} opacity="0.5" />
        <ellipse cx="0" cy="0" rx="150" ry="22" fill={MYTH.frostCore} opacity="0.7" />
      </g>
      <Hero x={CONTACT.x} profession={scene.profession} />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const column = fx(stage, 'column')
    return (play) => {
      const raised = share(play, 0)
      const lifted = share(play, 1)
      fadeTo(column, ramp(raised, 0.3, 0.9))
      poseHero(him, CONTACT.x, poseAt('raise', raised), { frost: raised }, CONTACT.rise * ramp(lifted, 0, 1))
      fadeTo(him.root, 1 - ramp(lifted, 0.5, 1))
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
}

const sceneOf = (id: SceneId, count: number, profession: Profession): MythScene => {
  const spec = SCENES[id]
  const scene: MythScene = {
    id,
    count,
    profession,
    script: spec.script,
    bind: (stage): StageWriter => {
      const write = spec.bind(stage, scene)
      // drawn settled (reduced motion) there is no playhead, and the scene holds its end frame
      return (_progress, _reached, play) => write(play ?? sceneEnd(spec.script))
    },
  }
  return scene
}

/** The page's scenes in order: the hero, the profession's sections, the contact. */
export function scenesOf(slots: readonly SectionSlot[], labels: Labels, highlights: readonly string[], profession: Profession): MythScene[] {
  return [sceneOf('hero', 0, profession), ...slots.map((slot) => sceneOf(slot.id, countOf(slot, labels, highlights), profession)), sceneOf('contact', 0, profession)]
}

/** A scene's picture: its field of figures over the depths. */
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
              <g className={spec.band === 'left' ? s.leftBand : s.rightBand}>{spec.figure(scene)}</g>
            </svg>
          ),
        },
      ]}
    />
  )
}
