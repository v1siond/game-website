'use client'

import type { ReactNode } from 'react'
import type { Labels } from '@/lib/cv/labels'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import { stageItems } from '@/lib/cv/stageItems'
import { drop, hop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { trackAt } from '@/lib/scroll/track'
import { fadeTo, focusOn, fx, lerp, r1, transformTo } from '@/components/themes/shared/stageNodes'
import { Stage } from '@/components/themes/shared/theatre/Stage'
import { SETTLED_PROGRESS, type LayerMotions, type StageWriter, type TheatreScene } from '@/components/themes/shared/theatre/useTheatre'
import { FOE, type FoeName } from './foes'
import { MYTH } from './palette'
import { bodyTransform, jointTransform, poseAt, REST, type Joint, type Move, type Pose } from './rig'
import { FIGURE_BOX, HeroFigure } from './sprite'
import s from './sprite.module.css'

// His scenes on the shared theatre, one per part of the page, over the fixed depths of the descent
// (depths.tsx). Each section is a moment of a mythological action game, one beat per card: About is the
// gods' gift, a light falling into his raised sword per highlight; Work is the combo on the storm deck, a
// soldier knocked over the rail per job; the Tech Stack is the climb up the chain over the storm sea, the
// chain running down a hold per group (the shared track) while a harpy dives and his shield sends it off;
// Services cuts a foe up into the air per service and closes on the slam; Projects turns a fire spirit's
// bolt back off his shield per project; Ventures grabs a charging brute and hurls it into the magma per
// venture; Bands dodges the bronze giant's swing and cuts at its heel per band, the camera pulled out to
// frame it; the Muay Thai record parries a champion's thrust and counters per line, closed by the finisher
// with the camera pushed in; the contact walks him up into the dawn. Every pose is a function of the
// scene's progress and the cards reached, so it plays back on the way up and rests when the scroll does;
// a scene drawn settled (reduced motion) holds its peak.

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

// The stretch of a scene's progress the close after the last card plays over.
const CLOSE = [0.74, 0.9] as const
const closeAt = (t: number): number => lerp(CLOSE[0], CLOSE[1], t)

/** The card playing `reached` cards in, how far through it (0 to 1) and the close after the last card. */
interface Beat {
  card: number
  f: number
  close: number
}

const beatOf = (progress: number, reached: number, count: number): Beat => {
  const card = Math.max(0, Math.min(count - 1, Math.floor(reached)))
  return { card, f: count === 0 ? 0 : Math.min(1, reached - card), close: reached >= count ? ramp(progress, ...CLOSE) : 0 }
}

/** A bump from 0 up to 1 and back over [from, to] of t. */
const bell = (t: number, from: number, to: number): number => Math.sin(Math.PI * ramp(t, from, to))

// ---- him ----

interface HeroNodes {
  root: Element | null
  body: Element | null
  joints: Array<{ joint: Joint; node: Element }>
  light: Element | null
}

const heroNodes = (stage: ParentNode): HeroNodes => {
  const root = fx(stage, 'hero')
  return {
    root,
    body: root?.querySelector('[data-body]') ?? null,
    joints: Array.from(root?.querySelectorAll<SVGGElement>('[data-joint]') ?? [], (node) => ({ joint: node.dataset.joint as Joint, node })),
    light: root?.querySelector('[data-fx="sword-light"]') ?? null,
  }
}

const heroAt = (x: number, lift = 0): string =>
  `translate(${r1(x - FIGURE_BOX.feetX * HERO_SCALE)} ${r1(FLOOR - FIGURE_BOX.feetY * HERO_SCALE - lift)}) scale(${HERO_SCALE.toFixed(3)})`

/** Stands him at `x`, `lift` off the floor, in `pose`, his sword's light at `light`. */
const poseHero = (nodes: HeroNodes, x: number, pose: Pose, light = 0, lift = 0): void => {
  transformTo(nodes.root, heroAt(x, lift))
  transformTo(nodes.body, bodyTransform(pose))
  for (const { joint, node } of nodes.joints) transformTo(node, jointTransform(joint, pose[joint]))
  fadeTo(nodes.light, light)
}

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

/** The light of a god falling into his sword: a column of gold from the sky to the sword's point. */
function GodLight() {
  return (
    <g data-fx="god-light" opacity="0">
      <rect x="-26" y="-1100" width="52" height="1100" fill={MYTH.goldPale} opacity="0.35" />
      <rect x="-8" y="-1100" width="16" height="1100" fill={MYTH.fireCore} opacity="0.8" />
    </g>
  )
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

/** A bolt of fire, round, its glow about it. */
function Bolt() {
  return (
    <g data-fx="bolt" opacity="0">
      <circle r="26" fill={MYTH.fire} opacity="0.45" />
      <circle r="14" fill={MYTH.fireCore} stroke={MYTH.inkLine} strokeWidth="3" />
    </g>
  )
}

// ---- the scenes ----

interface Peak {
  progress: number
  reached: number
}

interface SceneSpec {
  /** The band the scene plays in (sprite.module.css moves it under 1024 px). */
  band: 'left' | 'right'
  figure: (scene: MythScene) => ReactNode
  bind: (stage: HTMLElement, scene: MythScene) => StageWriter
  peak: (count: number) => Peak
}

// The hero: as the page starts to scroll he raises his shield into his guard.
const HERO_X = 600

const hero: SceneSpec = {
  band: 'left',
  figure: (scene) => <Hero x={HERO_X} profession={scene.profession} figure />,
  bind: (stage) => {
    const him = heroNodes(stage)
    return (progress) => poseHero(him, HERO_X, poseAt('parry', 0.3 * ramp(progress, 0.04, 0.3)))
  },
  peak: () => ({ progress: 0.3, reached: 0 }),
}

// About, the gods' gift: per highlight he raises his sword and a god's light falls into it, the blade
// brighter each time. After the last he holds it up, lit.
const ABOUT = { x: 1340, tip: { dx: 46, up: 470 } }

const about: SceneSpec = {
  band: 'right',
  figure: (scene) => (
    <>
      <g transform={`translate(${ABOUT.x + ABOUT.tip.dx} ${FLOOR - ABOUT.tip.up})`}>
        <GodLight />
      </g>
      <Hero x={ABOUT.x} profession={scene.profession} />
    </>
  ),
  bind: (stage, scene) => {
    const him = heroNodes(stage)
    const light = fx(stage, 'god-light')
    return (progress, reached) => {
      const { card, f, close } = beatOf(progress, reached, scene.count)
      const raised = close > 0 ? 1 : ramp(f, 0, 0.3) * (1 - ramp(f, 0.85, 1))
      const given = close > 0 ? 1 : (card + ramp(f, 0.3, 0.7)) / scene.count
      poseHero(him, ABOUT.x, poseAt('raise', raised), given)
      fadeTo(light, close > 0 ? 0 : bell(f, 0.25, 0.75))
    }
  },
  peak: (count) => ({ progress: SETTLED_PROGRESS, reached: count - 1 + 0.55 }),
}

// Work, the combo on the storm deck: per job a soldier comes up the deck, his three cut string lands and the
// last cut knocks it over the rail.
const WORK = { x: 1240, foeFrom: 1760, foeAt: 1470, size: 2.6, over: 260 }

const work: SceneSpec = {
  band: 'right',
  figure: (scene) => (
    <>
      <Foe name="foe" kind="legionnaire" x={WORK.foeFrom} size={WORK.size} />
      <Hero x={WORK.x} profession={scene.profession} />
    </>
  ),
  bind: (stage, scene) => {
    const him = heroNodes(stage)
    const foe = fx(stage, 'foe')
    return (progress, reached) => {
      const { f, close } = beatOf(progress, reached, scene.count)
      const comes = ramp(f, 0, 0.25)
      const knocked = ramp(f, 0.78, 1)
      poseHero(him, WORK.x, close > 0 ? REST : poseAt('combo', ramp(f, 0.2, 0.9)))
      transformTo(foe, foeAt(lerp(WORK.foeFrom, WORK.foeAt, comes) + WORK.over * knocked, WORK.size, hop(knocked, 160), 60 * knocked))
      fadeTo(foe, close > 0 ? 0 : ramp(f, 0, 0.1) * (1 - ramp(f, 0.9, 1)))
    }
  },
  peak: (count) => ({ progress: SETTLED_PROGRESS, reached: count - 1 + 0.72 }),
}

// The Tech Stack, the climb: he hangs on the chain and per group reaches one hold higher as the chain runs
// down (the shared track), while a harpy dives at him and the shield's bash sends it off.
const TECH = { x: 1300, lift: 420, hold: 150, harpyFrom: { x: 1760, y: 220 }, harpyAt: { x: 1430, y: 540 }, size: 2.2, chainX: 1318 }

/** The chain he climbs: links from far above the screen down past its foot. */
function Chain() {
  return (
    <g data-fx="chain">
      <path d={`M${TECH.chainX} -1600 V${FLOOR + 200}`} stroke={MYTH.inkLine} strokeWidth="16" />
      <path d={`M${TECH.chainX} -1600 V${FLOOR + 200}`} stroke={MYTH.chainSteel} strokeWidth="9" strokeDasharray="22 10" />
    </g>
  )
}

const tech: SceneSpec = {
  band: 'right',
  figure: (scene) => (
    <>
      <Chain />
      <Foe name="harpy" kind="harpy" x={TECH.harpyFrom.x} size={TECH.size} />
      <Hero x={TECH.x} profession={scene.profession} />
    </>
  ),
  bind: (stage, scene) => {
    const him = heroNodes(stage)
    const chain = fx(stage, 'chain')
    const harpy = fx(stage, 'harpy')
    return (progress, reached) => {
      const { f, close } = beatOf(progress, reached, scene.count)
      const { offset } = trackAt(Math.min(reached, scene.count), scene.count, TECH.hold, 0.5)
      const reach = close > 0 ? close : ramp(f, 0, 0.5)
      const pose = poseAt('climb', reach)
      const bashing = bell(f, 0.55, 0.85) * (close > 0 ? 0 : 1)
      poseHero(him, TECH.x, { ...pose, armFar: lerp(pose.armFar, -120, bashing), foreFar: lerp(pose.foreFar, -20, bashing) }, 0, TECH.lift)
      transformTo(chain, `translate(0 ${r1(offset + close * TECH.hold)})`)
      const dive = ramp(f, 0.35, 0.65)
      const sent = ramp(f, 0.7, 1)
      const y = lerp(TECH.harpyFrom.y, TECH.harpyAt.y, dive)
      transformTo(harpy, foeAt(lerp(TECH.harpyFrom.x, TECH.harpyAt.x, dive) + 300 * sent, TECH.size, FLOOR - y + hop(sent, 200), -40 * sent))
      fadeTo(harpy, close > 0 ? 0 : ramp(f, 0.3, 0.4) * (1 - ramp(f, 0.85, 1)))
    }
  },
  peak: (count) => ({ progress: SETTLED_PROGRESS, reached: count - 1 + 0.68 }),
}

// Services, the launcher: per service he cuts a foe up into the air, rises after it and cuts it back down to
// the deck. After the last he comes down in the slam, the dust ringing out.
const SERVICES = { x: 1270, foeX: 1430, size: 2.4, rise: 300 }

const services: SceneSpec = {
  band: 'right',
  figure: (scene) => (
    <>
      <g transform={`translate(${SERVICES.x + 60} ${FLOOR})`}>
        <DustRing name="dust" />
      </g>
      <Foe name="foe" kind="gorgon" x={SERVICES.foeX} size={SERVICES.size} />
      <Hero x={SERVICES.x} profession={scene.profession} />
    </>
  ),
  bind: (stage, scene) => {
    const him = heroNodes(stage)
    const foe = fx(stage, 'foe')
    const dust = fx(stage, 'dust')
    return (progress, reached) => {
      const { f, close } = beatOf(progress, reached, scene.count)
      if (close > 0) {
        poseHero(him, SERVICES.x, poseAt('slam', ramp(close, 0, 0.6)))
        fadeTo(foe, 0)
        transformTo(dust, `scale(${lerp(0.3, 1.4, ramp(close, 0.3, 0.8)).toFixed(3)})`)
        fadeTo(dust, bell(close, 0.3, 1))
        return
      }
      const up = ramp(f, 0.25, 0.55)
      const down = ramp(f, 0.65, 0.95)
      const pose = f < 0.6 ? poseAt('launch', ramp(f, 0.05, 0.55)) : poseAt('slam', ramp(f, 0.6, 0.95))
      poseHero(him, SERVICES.x, pose)
      transformTo(foe, foeAt(SERVICES.foeX, SERVICES.size, SERVICES.rise * up - drop(down, SERVICES.rise * up), 0))
      fadeTo(foe, ramp(f, 0, 0.1) * (1 - ramp(f, 0.9, 1)))
      fadeTo(dust, 0)
    }
  },
  peak: (count) => ({ progress: SETTLED_PROGRESS, reached: count - 1 + 0.55 }),
}

// Projects, the parry over the magma: per project a fire spirit throws its bolt, his shield turns it back and
// it bursts on the spirit. After the last he raises his sword, the god's light in it, and every spirit is out.
const PROJECTS = { x: 1250, spiritX: 1640, size: 2.4, shield: { dx: 90, up: 180 }, mouth: { dx: -40, up: 160 } }

const projects: SceneSpec = {
  band: 'right',
  figure: (scene) => (
    <>
      <Foe name="spirit" kind="spirit" x={PROJECTS.spiritX} size={PROJECTS.size} />
      <Bolt />
      <Hero x={PROJECTS.x} profession={scene.profession} />
    </>
  ),
  bind: (stage, scene) => {
    const him = heroNodes(stage)
    const spirit = fx(stage, 'spirit')
    const bolt = fx(stage, 'bolt')
    const shield = { x: PROJECTS.x + PROJECTS.shield.dx, y: FLOOR - PROJECTS.shield.up }
    const mouth = { x: PROJECTS.spiritX + PROJECTS.mouth.dx, y: FLOOR - PROJECTS.mouth.up }
    return (progress, reached) => {
      const { f, close } = beatOf(progress, reached, scene.count)
      if (close > 0) {
        poseHero(him, PROJECTS.x, poseAt('raise', close), 1)
        fadeTo(spirit, 0)
        fadeTo(bolt, 0)
        return
      }
      const out = ramp(f, 0.2, 0.48)
      const back = ramp(f, 0.52, 0.8)
      const at = back > 0 ? { x: lerp(shield.x, mouth.x, back), y: lerp(shield.y, mouth.y, back) } : { x: lerp(mouth.x, shield.x, out), y: lerp(mouth.y, shield.y, out) }
      poseHero(him, PROJECTS.x, poseAt('parry', ramp(f, 0.1, 0.9)))
      transformTo(bolt, `translate(${r1(at.x)} ${r1(at.y)})`)
      fadeTo(bolt, out > 0 && back < 1 ? 1 : 0)
      const burst = ramp(f, 0.8, 1)
      transformTo(spirit, `${foeAt(PROJECTS.spiritX, PROJECTS.size * (1 + 0.3 * burst))}`)
      fadeTo(spirit, ramp(f, 0, 0.15) * (1 - burst))
    }
  },
  peak: (count) => ({ progress: SETTLED_PROGRESS, reached: count - 1 + 0.5 }),
}

// Ventures, the grab and throw: per venture a brute charges, he takes it, heaves it over his head and hurls it
// into the magma, where it sinks.
const VENTURES = { x: 1240, from: 1760, grab: 1330, size: 2.3, overhead: 360, far: 1720 }

const ventures: SceneSpec = {
  band: 'right',
  figure: (scene) => (
    <>
      <Foe name="brute" kind="cyclops" x={VENTURES.from} size={VENTURES.size} />
      <Hero x={VENTURES.x} profession={scene.profession} />
    </>
  ),
  bind: (stage, scene) => {
    const him = heroNodes(stage)
    const brute = fx(stage, 'brute')
    return (progress, reached) => {
      const { f, close } = beatOf(progress, reached, scene.count)
      const charge = ramp(f, 0, 0.25)
      const lift = ramp(f, 0.28, 0.55)
      const thrown = ramp(f, 0.6, 0.92)
      const pose = close > 0 ? REST : f < 0.58 ? poseAt('heave', lift) : poseAt('hurl', ramp(f, 0.58, 0.8))
      poseHero(him, VENTURES.x, pose)
      const x = thrown > 0 ? lerp(VENTURES.grab, VENTURES.far, thrown) : lerp(VENTURES.from, VENTURES.grab, charge)
      const up = thrown > 0 ? VENTURES.overhead * (1 - thrown) + hop(thrown, 180) : VENTURES.overhead * lift
      transformTo(brute, foeAt(x, VENTURES.size, up, 180 * lift + 120 * thrown))
      fadeTo(brute, close > 0 ? 0 : ramp(f, 0, 0.1) * (1 - ramp(f, 0.88, 1)))
    }
  },
  peak: (count) => ({ progress: SETTLED_PROGRESS, reached: count - 1 + 0.75 }),
}

// Bands, the bronze giant: per band it swings at him, he dodges as the world dims a moment and cuts at its
// heel, the camera pulled out to frame it. After the last it drops to one knee.
const BANDS = { x: 1180, giantX: 1560, size: 6.2, zoom: 0.82 }

const bands: SceneSpec = {
  band: 'right',
  figure: (scene) => (
    <>
      <g data-fx="camera">
        <Foe name="giant" kind="cyclops" x={BANDS.giantX} size={BANDS.size} />
        <Hero x={BANDS.x} profession={scene.profession} />
      </g>
      <rect data-fx="dim" x="0" y="0" width={FIELD.width} height={FIELD.height} fill={MYTH.inkLine} opacity="0" />
    </>
  ),
  bind: (stage, scene) => {
    const him = heroNodes(stage)
    const camera = fx(stage, 'camera')
    const giant = fx(stage, 'giant')
    const dim = fx(stage, 'dim')
    return (progress, reached) => {
      const { f, close } = beatOf(progress, reached, scene.count)
      transformTo(camera, focusOn(BANDS.giantX - 160, FLOOR - 200, BANDS.zoom))
      const swing = close > 0 ? 0 : bell(f, 0.2, 0.6)
      const kneel = ramp(close, 0, 0.6)
      transformTo(giant, foeAt(BANDS.giantX, BANDS.size, -90 * kneel, -10 * swing + 6 * kneel))
      poseHero(him, BANDS.x, close > 0 ? REST : poseAt('dodge', ramp(f, 0.15, 0.85)))
      fadeTo(dim, close > 0 ? 0 : 0.35 * bell(f, 0.3, 0.55))
    }
  },
  peak: (count) => ({ progress: SETTLED_PROGRESS, reached: count - 1 + 0.6 }),
}

// The Muay Thai record, the duel: per line a champion in bronze thrusts, his shield parries and he counters
// with a cut. After the last, the finisher: the wind up and the long strike, the champion down, the camera
// pushed in.
const DUEL = { x: 1220, champion: 1500, size: 3.1, lunge: 60, zoom: 1.2 }

const muayThai: SceneSpec = {
  band: 'right',
  figure: (scene) => (
    <g data-fx="camera">
      <Foe name="champion" kind="legionnaire" x={DUEL.champion} size={DUEL.size} />
      <Hero x={DUEL.x} profession={scene.profession} />
    </g>
  ),
  bind: (stage, scene) => {
    const him = heroNodes(stage)
    const camera = fx(stage, 'camera')
    const champion = fx(stage, 'champion')
    return (progress, reached) => {
      const { f, close } = beatOf(progress, reached, scene.count)
      const counter: Move = f < 0.55 ? 'parry' : 'combo'
      const pose = close > 0 ? poseAt('finisher', close) : counter === 'parry' ? poseAt('parry', ramp(f, 0.05, 0.55)) : poseAt('combo', 0.3 * ramp(f, 0.55, 0.9))
      poseHero(him, DUEL.x, pose)
      const thrust = close > 0 ? 0 : bell(f, 0.15, 0.5)
      const down = ramp(close, 0.55, 0.8)
      transformTo(champion, foeAt(DUEL.champion - DUEL.lunge * thrust + 30 * bell(f, 0.7, 0.95), DUEL.size, 0, 80 * down))
      fadeTo(champion, 1 - 0.4 * down)
      transformTo(camera, focusOn(DUEL.x + 120, FLOOR - 160, lerp(1, DUEL.zoom, ramp(close, 0.1, 0.5))))
    }
  },
  peak: () => ({ progress: closeAt(0.62), reached: Number.MAX_SAFE_INTEGER }),
}

// The contact: he walks up into the dawn of the summit, its light opening before him.
const CONTACT = { from: 1180, to: 1420, walk: [0.05, 0.45] as const, stride: 60 }

const contact: SceneSpec = {
  band: 'right',
  figure: (scene) => (
    <>
      <g data-fx="dawn" opacity="0" transform={`translate(${CONTACT.to + 160} ${FLOOR})`}>
        <ellipse cx="0" cy="-260" rx="150" ry="280" fill={MYTH.dawnPale} opacity="0.5" />
        <ellipse cx="0" cy="-200" rx="80" ry="200" fill={MYTH.dawn} opacity="0.6" />
      </g>
      <Hero x={CONTACT.from} profession={scene.profession} />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const dawn = fx(stage, 'dawn')
    return (progress) => {
      const walk = ramp(progress, ...CONTACT.walk)
      const x = lerp(CONTACT.from, CONTACT.to, walk)
      poseHero(him, x, walk > 0 && walk < 1 ? poseAt('walk', ((x - CONTACT.from) / CONTACT.stride) % 1) : REST)
      fadeTo(dawn, ramp(progress, 0.05, 0.4))
    }
  },
  peak: () => ({ progress: 0.5, reached: 0 }),
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
    bind: (stage) => {
      const write = spec.bind(stage, scene)
      const peak = spec.peak(count)
      return (progress, reached) => {
        // Drawn settled (reduced motion), the scene holds its peak.
        const settled = progress === SETTLED_PROGRESS && reached >= count
        if (settled) return write(peak.progress, Math.min(peak.reached, count))
        write(progress, reached)
      }
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
