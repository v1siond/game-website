'use client'

import type { CSSProperties, ReactNode } from 'react'
import type { Labels } from '@/lib/cv/labels'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import { stageItems } from '@/lib/cv/stageItems'
import { sceneEnd, type Playhead, type SceneScript } from '@/lib/scroll/player'
import { ramp } from '@/lib/scroll/stage'
import { bell, clamp01, fadeTo, fx, lerp, r1, transformTo } from '@/components/themes/shared/stageNodes'
import { Stage } from '@/components/themes/shared/theatre/Stage'
import type { LayerMotions, TheatreScene } from '@/components/themes/shared/theatre/useTheatre'
import { Commander, HERO_FEET, HIP_AT, SHIELD_AT, SWORD_AT } from './commander'
import {
  BoneSoldier,
  Cart,
  CinderGiant,
  Fiend,
  Footman,
  Guard,
  Longship,
  Mage,
  OldKing,
  PitFiend,
  Raider,
  Risen,
  Seer,
  SelectRing,
  StitchedBrute,
  Villager,
  WalkingTree,
  WarDrum,
  Warlord,
  Wisp,
} from './folk'
import { DeathSteed, FrostKing, IceThrone, KING_BLADE_AT, KING_FEET, KING_HAND_AT } from './frostKing'
import { GOLEM_FEET, GolemRise, InfernalGolem, riseWriter } from './golem'
import { BurningCityLand, ChurchyardLand, CityLand, FelledForestLand, FrozenLand, HallLand, NorthLand, SeaLand, TreeMountainLand, VillageLand } from './lands'
import { REALM } from './palette'
import look from './world.module.css'

// One war of the fantasy strategy game the world comes from, told in its campaigns' order, with him as the
// kingdom's knight commander who fights through it and never does its dark deeds: the hooded seer's warning
// turned away at the king's hall (hero); the horned raiders put to the sword in a burning village (About); the
// plague in the grain and the dead clawing out of the churchyard (Work); the prince culling the city while he
// turns his back (Tech Stack); the cursed blade taken in the north and the prince become the frost king (Services);
// the frost king raising the dead and climbing into his ice throne (Projects); the burning giants falling on the
// city of mages and standing up out of their craters (Ventures); the horned clans' fleet crossing the storm to
// the new land to his drum (Bands); the red warlord clinched, freed and the pit fiend killed (Muay Thai); and the
// last stand at the great tree, where his horn calls the wisps down on the giant of cinders (contact).
//
// Each scene is a short script of one to three actions the shared scene player moves through
// (src/lib/scroll/player.ts), each at its own pace and never per card; every frame is a function of the playhead
// alone, so an action reads the same played backward, and the end frame is the one a scene drawn settled
// (reduced motion) shows. The ground is the strategy view's, seen from above at an angle: a unit's size follows
// its depth on it (`depth`). Every scene is composed about the middle of its free half and stood on the side it
// plays on (Side), moved there and never mirrored.

export type SceneId = 'hero' | SectionId | 'contact'

/** The half of the screen a section's scene plays on, from lg; its cards take the other. */
export type Side = 'left' | 'right'

/** The land pushes in across its scene, the field a little more than the land behind it. */
export const REALM_MOTION: LayerMotions = {
  land: { zoom: [1.0, 1.05], lift: [0, -1] },
  figure: { zoom: [1.02, 1.08], lift: [0, -2] },
}

// The field: a 1920 by 1080 picture cut to the screen from its foot. A scene's cast stands about x 0 of its own
// frame, at most 330 either way, and that frame is set at the middle of the free half: right of a card column on
// the left of the screen, or left of one on the right (at 1440 by 900 the field shows x 96 to 1824). The hero's
// cast stands under the hero card, right of the middle. world.module.css moves and shrinks each band under
// 1024 px, where the cards and the scene are stacked, so the scene's lead (--lead) stands on the half it names.
const FIELD = { width: 1920, height: 1080 }
const FLOOR = 1000
const ANCHOR: Record<Side | 'hero', number> = { right: 1392, left: 470, hero: 1150 }

/** How big a unit stands at depth y: the near edge full size, the far ground half. */
const depth = (y: number): number => 0.5 + 0.5 * clamp01((y - 500) / 500)

/** How far action `i` has played at `play`: all of it once a later one plays, `t` while it plays, none before. */
const share = ({ action, t }: Playhead, i: number): number => (action > i ? 1 : action === i ? t : 0)

/** A unit's feet at (x, y), facing right (1) or left (-1), at `size` of its depth's size. */
const place = (x: number, y = FLOOR, face: 1 | -1 = 1, size = 1): string => {
  const k = size * depth(y)
  return `translate(${r1(x)} ${r1(y)}) scale(${(face * k).toFixed(3)} ${k.toFixed(3)})`
}

/** The small hop of a walk, by how far the unit has walked. */
const hop = (walked: number): number => -4 * Math.abs(Math.sin(walked / 14))

/** The small people stand at this size beside him. */
const FOLK = 1.2

/** A unit cut down: knocked back onto the ground, `fall` 0 standing to 1 lying. */
const felled = (fall: number): string => `rotate(${r1(-82 * fall)}) translate(0 ${r1(6 * fall)})`

const turn = (deg: number, { x, y }: { x: number; y: number }): string => `rotate(${r1(deg)} ${x} ${y})`

/** A group of units marked `${prefix}-i`, found once. */
const unitsOf = (stage: ParentNode, prefix: string, count: number): Array<Element | null> => Array.from({ length: count }, (_, i) => fx(stage, `${prefix}-${i}`))

/** A small unit's tool arm, turning about the shoulder they share (folk.tsx). */
const SHOULDER = { x: 15, y: -46 }
const swingArm = (arm: Element | null, angle: number): void => transformTo(arm, turn(angle, SHOULDER))

/** A blow's swing over t: back, down through the strike, and home. */
const blow = (t: number): number => (t < 0.4 ? -80 * ramp(t, 0, 0.4) : lerp(-80, 40, ramp(t, 0.4, 0.6)) * (1 - ramp(t, 0.7, 1)))

/** A pool of blood under a fallen unit. */
function Pool({ name }: { name: string }) {
  return <ellipse data-fx={name} rx={44} ry={11} fill={REALM.blood23a} opacity="0" />
}

// ---- him ----

// His size on the field (his 200 by 320 drawing at 0.6 stands about 190 high at the near edge), how far his legs
// swing in a stride, and the turns of his arms (a negative turn swings an arm forward and up).
const HERO_SCALE = 0.6
const LEG_SWING = 24
const ARM = { forward: -90, up: -160, guard: -45, low: -30 }

interface HeroPose {
  x: number
  y?: number
  lift?: number
  face?: 1 | -1
  lean?: number
  sword?: number
  shield?: number
  /** The stride's phase, one step a unit; 0 stands. */
  step?: number
  /** The front leg's own turn, for a knee. */
  knee?: number
  horn?: number
  ring?: number
  shown?: number
}

interface HeroNodes {
  root: Element | null
  sword: Element | null
  shield: Element | null
  front: Element | null
  back: Element | null
  board: Element | null
  horn: Element | null
  ring: Element | null
}

const heroNodes = (stage: ParentNode): HeroNodes => ({
  root: fx(stage, 'hero'),
  sword: fx(stage, 'hero-sword'),
  shield: fx(stage, 'hero-shield'),
  front: fx(stage, 'hero-leg-front'),
  back: fx(stage, 'hero-leg-back'),
  board: fx(stage, 'hero-board'),
  horn: fx(stage, 'hero-horn'),
  ring: fx(stage, 'hero-ring'),
})

const heroAt = (x: number, y = FLOOR, lift = 0, face: 1 | -1 = 1, lean = 0): string => {
  const k = HERO_SCALE * depth(y)
  return `translate(${r1(x - face * HERO_FEET.x * k)} ${r1(y - lift - HERO_FEET.y * k)}) scale(${(face * k).toFixed(3)} ${k.toFixed(3)}) rotate(${r1(lean)} ${HERO_FEET.x} ${HERO_FEET.y})`
}

const poseHero = (nodes: HeroNodes, { x, y = FLOOR, lift = 0, face = 1, lean = 0, sword = 0, shield = 0, step = 0, knee = 0, horn = 0, ring = 1, shown = 1 }: HeroPose): void => {
  const swing = LEG_SWING * Math.sin(step * Math.PI)
  transformTo(nodes.root, heroAt(x, y, lift + (step ? -hop(step * 14) : 0), face, lean))
  fadeTo(nodes.root, shown)
  transformTo(nodes.sword, turn(sword, SWORD_AT))
  transformTo(nodes.shield, turn(shield, SHIELD_AT))
  transformTo(nodes.front, turn(-swing + knee, HIP_AT))
  transformTo(nodes.back, turn(swing, HIP_AT))
  fadeTo(nodes.board, 1 - horn)
  fadeTo(nodes.horn, horn)
  transformTo(nodes.ring, place(x, y))
  fadeTo(nodes.ring, ring * shown)
}

/** Him, the hero unit, and his ring under him. */
function HeroUnit({ x, y = FLOOR, face = 1, scene, ring = true }: { x: number; y?: number; face?: 1 | -1; scene: RealmScene; ring?: boolean }) {
  return (
    <>
      {ring && (
        <g data-fx="hero-ring" transform={place(x, y)}>
          <SelectRing name="hero-ring-mark" rx={64} />
        </g>
      )}
      <g data-fx="hero" transform={heroAt(x, y, 0, face)}>
        <Commander profession={scene.profession} figure={scene.figure} />
      </g>
    </>
  )
}

// ---- the frost king ----

interface KingNodes {
  at: Element | null
  hand: Element | null
  blade: Element | null
  glow: Element | null
}

const kingNodes = (stage: ParentNode, name: string): KingNodes => ({
  at: fx(stage, `${name}-at`),
  hand: fx(stage, `${name}-hand`),
  blade: fx(stage, `${name}-blade`),
  glow: fx(stage, `${name}-glow`),
})

const kingAt = (x: number, y: number, size: number): string =>
  `translate(${r1(x - KING_FEET.x * size)} ${r1(y - KING_FEET.y * size)}) scale(${size.toFixed(3)})`

const poseKing = (nodes: KingNodes, { x, y, size, hand = 0, blade = 0, glow = 0.15 }: { x: number; y: number; size: number; hand?: number; blade?: number; glow?: number }): void => {
  transformTo(nodes.at, kingAt(x, y, size))
  transformTo(nodes.hand, turn(hand, KING_HAND_AT))
  transformTo(nodes.blade, turn(blade, KING_BLADE_AT))
  fadeTo(nodes.glow, glow)
}

// ---- the scenes ----

/** A scene's writer: the frame at the playhead. The land's push in is the theatre's own. */
type SceneWriter = (play: Playhead) => void

interface SceneSpec {
  /** Where his action is in the scene's frame: the point a stacked screen keeps on the half the section names. */
  lead: number
  /** The lead on a phone, where the scene stands its cast another way round for the narrow screen. */
  phoneLead?: number
  land: () => ReactNode
  script: SceneScript
  figure: (scene: RealmScene) => ReactNode
  bind: (stage: HTMLElement, scene: RealmScene) => SceneWriter
}

// The hero, the warning: the river king's hall from above, the throne on its dais, two guards, a brazier. The
// hooded seer strikes his staff and the brazier shows the north: green fire and the dead rising in it. The king
// stands and points him out, the guards cross their halberds before him and he goes; the knight commander turns
// after him. The end frame is him before the throne, his ring lit, the vision gone to smoke.
const HERO = { king: { x: 200, y: 840 }, guards: [{ x: 90, y: 880 }, { x: 250, y: 940 }], seer: { x: -40, y: 900, out: -300 }, him: { x: -190, y: 985 }, vision: { x: 40, y: 860 } }

function Vision() {
  return (
    <g data-fx="vision" opacity="0">
      <ellipse cx="0" cy="-120" rx="120" ry="150" fill={REALM.plague} opacity="0.18" />
      <path d="M-70,0 Q-90,-140 -30,-220 Q-40,-140 0,-120 Q10,-260 60,-300 Q40,-180 80,-120 Q100,-170 90,-60 Q90,0 70,0 Z" fill={REALM.blightFire} opacity="0.55" />
      {[-40, 10, 50].map((x, i) => (
        <g key={x} transform={`translate(${x} ${-120 - i * 40}) scale(0.7)`} opacity="0.75">
          <circle cx="0" cy="-60" r="12" fill={REALM.blightFireCore} />
          <path d="M-12,-46 L12,-46 L16,0 L-16,0 Z M8,-40 L30,-30" fill={REALM.blightFireCore} stroke={REALM.blightFireCore} strokeWidth="5" />
        </g>
      ))}
      <path d="M-22,0 L22,0 L16,-30 L-16,-30 Z" fill={REALM.stone22} stroke={REALM.stone4b} strokeWidth="3" />
    </g>
  )
}

const hero: SceneSpec = {
  lead: -190,
  land: () => <HallLand />,
  script: [1700, 1800],
  figure: (scene) => (
    <>
      <g transform={place(HERO.king.x, HERO.king.y, -1)}>
        <OldKing name="old-king" />
      </g>
      <g transform={place(HERO.vision.x, HERO.vision.y)}>
        <Vision />
      </g>
      {HERO.guards.map(({ x, y }, i) => (
        <g key={x} data-fx={`guard-${i}`} transform={place(x, y, -1, FOLK)}>
          <Guard name={`guard-body-${i}`} />
        </g>
      ))}
      <g data-fx="seer" transform={place(HERO.seer.x, HERO.seer.y, 1, FOLK)}>
        <Seer name="seer-body" />
      </g>
      <HeroUnit x={HERO.him.x} y={HERO.him.y} scene={scene} />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const vision = fx(stage, 'vision')
    const kingArm = fx(stage, 'old-king-arm')
    const kingBody = fx(stage, 'old-king-body')
    const guards = unitsOf(stage, 'guard', HERO.guards.length)
    const halberds = HERO.guards.map((_, i) => fx(stage, `guard-body-${i}-arm`))
    const seer = fx(stage, 'seer')
    const seerArm = fx(stage, 'seer-body-arm')
    return (play) => {
      const warned = share(play, 0)
      const dismissed = share(play, 1)
      // the staff comes down on the floor and the brazier's fire rises into the vision of the north
      swingArm(seerArm, -70 * bell(warned, 0, 0.5) + 20 * ramp(warned, 0.4, 0.5) * (1 - ramp(dismissed, 0.3, 0.5)))
      const shown = ramp(warned, 0.35, 0.8) * (1 - 0.85 * ramp(dismissed, 0.2, 0.7))
      fadeTo(vision, shown)
      transformTo(vision, `scale(${(0.4 + 0.35 * ramp(warned, 0.35, 0.9)).toFixed(3)})`)
      // the king rises and points the door; the guards step in and cross their halberds
      transformTo(kingBody, `translate(0 ${r1(-40 - 22 * ramp(dismissed, 0, 0.3))})`)
      swingArm(kingArm, -95 * ramp(dismissed, 0.1, 0.35))
      guards.forEach((node, i) => {
        const { x, y } = HERO.guards[i]
        const stepIn = ramp(dismissed, 0.15, 0.5)
        transformTo(node, `${place(x - 70 * stepIn, y, -1, FOLK)} translate(0 ${r1(hop(stepIn * 60))})`)
        swingArm(halberds[i], (i ? -40 : 30) * ramp(dismissed, 0.4, 0.6))
      })
      // the seer turns and walks out, into the dark of the hall's far end
      const out = ramp(dismissed, 0.45, 1)
      const seerX = lerp(HERO.seer.x, HERO.seer.out, out)
      transformTo(seer, `${place(seerX, HERO.seer.y - 120 * out, out > 0 ? -1 : 1, FOLK)} translate(0 ${r1(hop(seerX))})`)
      fadeTo(seer, 1 - ramp(out, 0.6, 1))
      // he watches the vision, then turns after the seer, his hand on his sword
      const turned = ramp(dismissed, 0.55, 0.7)
      poseHero(him, {
        x: HERO.him.x + 30 * ramp(warned, 0.3, 0.6),
        y: HERO.him.y,
        step: bell(warned, 0.3, 0.6) > 0 ? ramp(warned, 0.3, 0.6) * 2 : 0,
        face: turned > 0.5 ? -1 : 1,
        shield: ARM.low * bell(warned, 0.5, 1),
        sword: ARM.low * ramp(dismissed, 0.7, 1),
        lean: -5 * bell(warned, 0.4, 1),
      })
    }
  },
}

// About, the first fight: a green hill village from above, its farmsteads along the road. The horned raiders
// swing their torches and the roofs catch, the villagers run; then he leads his line of footmen in, sword up, and
// cuts them down. The end frame is the raiders lying in the road, the roofs burning, his footmen in line.
const ABOUT = {
  houses: [{ x: -250, y: 700 }, { x: 70, y: 650 }, { x: 250, y: 760 }],
  raiders: [{ x: 40, y: 870 }, { x: 140, y: 930 }, { x: 200, y: 840 }, { x: 270, y: 970 }],
  footmen: [{ x: -300, y: 880 }, { x: -260, y: 950 }, { x: -320, y: 1010 }],
  runners: [{ x: -60, y: 760 }, { x: 10, y: 800 }],
  advance: 230,
}
// His charge: on a phone he waits at the head of his line right of the screen's middle, the half the section
// names, so the raid plays beside him and the charge is short.
const ABOUT_HIM = {
  field: { x: -200, y: 960, to: 60 },
  phone: { x: -40, y: 960, to: 60 },
}
const aboutHimOf = ({ phone }: RealmScene) => ABOUT_HIM[phone ? 'phone' : 'field']

/** A farmstead from above at an angle: walls, a thatched roof, the fire on it in `${name}-fire`. */
function Farmstead({ name }: { name: string }) {
  return (
    <g>
      <ellipse cx="0" cy="6" rx="140" ry="22" fill={REALM.stone1} opacity="0.5" />
      <path d="M-110,0 L-110,-80 L110,-80 L110,0 Z" fill={REALM.ember29} stroke={REALM.stone4b} strokeWidth="4" />
      <path d="M-30,0 V-50 H10 V0 Z" fill={REALM.stone8b} />
      <path d="M-130,-74 L-80,-170 L80,-170 L130,-74 Z" fill={REALM.thatch} stroke={REALM.stone4b} strokeWidth="4" />
      <path d="M-80,-170 L0,-196 L80,-170 Z" fill={REALM.thatchDark} stroke={REALM.stone4b} strokeWidth="3" />
      <g data-fx={`${name}-fire`} opacity="0">
        <ellipse cx="0" cy="-150" rx="170" ry="120" fill={REALM.chaosFireMid} opacity="0.2" />
        <path d="M-110,-80 Q-100,-260 -50,-170 Q-20,-320 20,-180 Q60,-300 90,-170 Q120,-230 120,-80 Z" fill={REALM.chaosFireMid} />
        <path d="M-70,-110 Q-50,-220 -20,-150 Q10,-250 40,-150 Q70,-200 80,-110 Z" fill={REALM.chaosFireBright} />
        <path d="M-30,-130 Q-10,-190 10,-140 Q30,-180 40,-130 Z" fill={REALM.chaosFireCore} />
      </g>
    </g>
  )
}

const about: SceneSpec = {
  lead: 0,
  land: () => <VillageLand />,
  script: [1600, 2000],
  figure: (scene) => (
    <>
      {ABOUT.houses.map(({ x, y }, i) => (
        <g key={x} transform={place(x, y, 1, 0.9)}>
          <Farmstead name={`house-${i}`} />
        </g>
      ))}
      {ABOUT.runners.map(({ x, y }, i) => (
        <g key={x} data-fx={`runner-${i}`} transform={place(x, y, -1, FOLK)}>
          <Villager name={`runner-body-${i}`} tint={i} />
        </g>
      ))}
      {ABOUT.raiders.map(({ x, y }, i) => (
        <g key={x} transform={place(x, y)}>
          <Pool name={`pool-${i}`} />
        </g>
      ))}
      {ABOUT.raiders.map(({ x, y }, i) => (
        <g key={x} data-fx={`raider-${i}`} transform={place(x, y, -1, FOLK)}>
          <Raider name={`raider-body-${i}`} torch={i % 2 === 0} />
        </g>
      ))}
      {ABOUT.footmen.map(({ x, y }, i) => (
        <g key={x} data-fx={`footman-${i}`} transform={place(x, y, 1, FOLK)}>
          <Footman name={`footman-body-${i}`} />
        </g>
      ))}
      <HeroUnit x={aboutHimOf(scene).x} y={aboutHimOf(scene).y} scene={scene} />
    </>
  ),
  bind: (stage, scene) => {
    const charge = aboutHimOf(scene)
    const him = heroNodes(stage)
    const fires = ABOUT.houses.map((_, i) => fx(stage, `house-${i}-fire`))
    const raiders = unitsOf(stage, 'raider', ABOUT.raiders.length)
    const raiderArms = ABOUT.raiders.map((_, i) => fx(stage, `raider-body-${i}-arm`))
    const pools = unitsOf(stage, 'pool', ABOUT.raiders.length)
    const footmen = unitsOf(stage, 'footman', ABOUT.footmen.length)
    const footmenArms = ABOUT.footmen.map((_, i) => fx(stage, `footman-body-${i}-arm`))
    const runners = unitsOf(stage, 'runner', ABOUT.runners.length)
    return (play) => {
      const raided = share(play, 0)
      const charged = share(play, 1)
      // the torches swing and the roofs catch one after another; the villagers run for the trees
      fires.forEach((fire, i) => fadeTo(fire, ramp(raided, 0.25 + i * 0.15, 0.5 + i * 0.15)))
      runners.forEach((node, i) => {
        const ran = ramp(raided, 0.1 + i * 0.1, 0.8 + i * 0.1)
        const { x, y } = ABOUT.runners[i]
        transformTo(node, `${place(x - 300 * ran, y - 60 * ran, -1, FOLK)} translate(0 ${r1(hop(ran * 300))})`)
        fadeTo(node, 1 - ramp(ran, 0.7, 1))
      })
      // the charge: his line runs in and the raiders are cut down where they stand
      const ran = ramp(charged, 0, 0.45)
      raiders.forEach((node, i) => {
        const { x, y } = ABOUT.raiders[i]
        const hit = ramp(charged, 0.35 + i * 0.12, 0.5 + i * 0.12)
        swingArm(raiderArms[i], -70 * bell(raided, 0.1 + i * 0.1, 0.6 + i * 0.1) + 50 * hit)
        transformTo(node, `${place(x + 30 * hit, y, -1, FOLK)} ${felled(hit)}`)
        fadeTo(pools[i], 0.75 * ramp(hit, 0.6, 1))
      })
      footmen.forEach((node, i) => {
        const { x, y } = ABOUT.footmen[i]
        const fx0 = x + ABOUT.advance * ran
        transformTo(node, `${place(fx0, y, 1, FOLK)} translate(0 ${r1(ran > 0 && ran < 1 ? hop(fx0) : 0)})`)
        swingArm(footmenArms[i], blow(ramp(charged, 0.45 + i * 0.1, 0.8 + i * 0.05)))
      })
      const chop = ramp(charged, 0.35, 0.75)
      poseHero(him, {
        x: lerp(charge.x, charge.to, ran),
        y: charge.y,
        step: ran > 0 && ran < 1 ? ran * 6 : 0,
        sword: ARM.up * ramp(charged, 0, 0.35) * (1 - chop) + lerp(ARM.up, 20, chop) * (chop > 0 ? 1 : 0) * (1 - ramp(charged, 0.85, 1)),
        shield: ARM.guard * ramp(charged, 0, 0.3),
        lean: 10 * ran * (1 - ramp(charged, 0.85, 1)) + 8 * bell(chop, 0.4, 1),
      })
    }
  },
}

// Work, the dead rise: the churchyard of the last village at night, the grain cart by the barricade. The grain
// sacks split green and the graves heave as the risen claw up; they come at the barricade with the stitched brute
// and his men hold; he cuts the brute down and the risen fall. The end frame is the brute and the dead on the
// ground, the barricade standing, the green dust settling.
const WORK = {
  cart: { x: -40, y: 760 },
  barricade: { x: -60, y: 930 },
  graves: [{ x: 90, y: 780 }, { x: 200, y: 820 }, { x: 290, y: 880 }, { x: 140, y: 920 }, { x: 260, y: 990 }],
  brute: { x: 250, y: 760, to: 60, toY: 900 },
  footmen: [{ x: -200, y: 860 }, { x: -260, y: 1000 }],
  him: { x: -150, y: 950 },
}

function Barricade() {
  return (
    <g>
      <path d="M-90,0 L-60,-100 L-46,-96 L-74,0 Z M70,0 L40,-110 L54,-114 L88,0 Z M-20,0 L0,-120 L14,-116 L-4,0 Z" fill={REALM.ember23} stroke={REALM.stone4b} strokeWidth="3" />
      <rect x={-100} y={-70} width={200} height={40} rx={6} fill={REALM.ember27} stroke={REALM.stone4b} strokeWidth="3" />
      <path d="M-110,-100 L110,-30" stroke={REALM.ember21} strokeWidth="14" />
    </g>
  )
}

/** A grave's mound, drawn over the dead climbing out of it. */
function Mound() {
  return (
    <g>
      <ellipse cx="0" cy="-2" rx="46" ry="16" fill={REALM.earth19} stroke={REALM.stone4b} strokeWidth="2" />
      <path d="M-30,-6 L-24,-16 L-14,-8 L0,-18 L12,-8 L22,-16 L32,-6" stroke={REALM.dirtDark} strokeWidth="4" fill="none" />
    </g>
  )
}

const work: SceneSpec = {
  lead: -40,
  land: () => <ChurchyardLand />,
  script: [1500, 1800, 1600],
  figure: (scene) => (
    <>
      <g transform={place(WORK.cart.x, WORK.cart.y, 1, 1.1)}>
        <Cart name="cart" />
      </g>
      {WORK.graves.map(({ x, y }, i) => (
        <g key={x}>
          <g data-fx={`risen-${i}`} transform={place(x, y + 90, -1, FOLK)} opacity="0">
            <Risen name={`risen-body-${i}`} />
          </g>
          <g transform={place(x, y)}>
            <Mound />
          </g>
        </g>
      ))}
      <g data-fx="brute" transform={place(WORK.brute.x, WORK.brute.y, -1)}>
        <StitchedBrute name="brute-body" />
      </g>
      <g transform={place(WORK.barricade.x, WORK.barricade.y)}>
        <Barricade />
      </g>
      {WORK.footmen.map(({ x, y }, i) => (
        <g key={x} data-fx={`footman-${i}`} transform={place(x, y, 1, FOLK)}>
          <Footman name={`footman-body-${i}`} />
        </g>
      ))}
      <HeroUnit x={WORK.him.x} y={WORK.him.y} scene={scene} />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const dust = fx(stage, 'cart-dust')
    const risen = unitsOf(stage, 'risen', WORK.graves.length)
    const risenArms = WORK.graves.map((_, i) => fx(stage, `risen-body-${i}-arm`))
    const brute = fx(stage, 'brute')
    const cleaver = fx(stage, 'brute-body-arm')
    const footmenArms = WORK.footmen.map((_, i) => fx(stage, `footman-body-${i}-arm`))
    return (play) => {
      const plagued = share(play, 0)
      const waved = share(play, 1)
      const cut = share(play, 2)
      fadeTo(dust, ramp(plagued, 0, 0.3) * (1 - 0.6 * ramp(cut, 0.5, 1)))
      transformTo(dust, `translate(0 ${r1(-20 * ramp(plagued, 0, 0.6))}) scale(${(0.6 + 0.6 * ramp(plagued, 0, 0.6)).toFixed(3)})`)
      // out of the graves, then at the barricade in a wave, then down
      const fell = ramp(cut, 0.4, 0.8)
      risen.forEach((node, i) => {
        const { x, y } = WORK.graves[i]
        const up = ramp(plagued, 0.2 + i * 0.1, 0.6 + i * 0.08)
        const come = ramp(waved, i * 0.08, 0.6 + i * 0.06)
        const rx = lerp(x, -10 + 30 * i, come)
        const ry = lerp(y, 880 + 24 * i, come)
        transformTo(node, `${place(rx, ry + 90 * (1 - up), -1, FOLK)} translate(0 ${r1(come > 0 && come < 1 ? hop(rx) : 0)}) ${felled(ramp(fell, i * 0.08, 0.6 + i * 0.08))}`)
        fadeTo(node, ramp(up, 0, 0.3))
        swingArm(risenArms[i], -30 * Math.sin(waved * 18 + i) * bell(waved, 0.4, 1))
      })
      const bx = lerp(WORK.brute.x, WORK.brute.to, ramp(waved, 0.1, 0.8))
      const by = lerp(WORK.brute.y, WORK.brute.toY, ramp(waved, 0.1, 0.8))
      const down = ramp(cut, 0.45, 0.75)
      transformTo(brute, `${place(bx + 20 * down, by, -1)} translate(0 ${r1(ramp(waved, 0.1, 0.8) < 1 ? hop(bx) : 0)}) ${felled(down)}`)
      swingArm(cleaver, -60 * bell(waved, 0.6, 1) + 40 * ramp(cut, 0, 0.3) * (1 - down))
      footmenArms.forEach((arm, i) => swingArm(arm, blow((waved * 3 + i * 0.4) % 1) * bell(waved, 0.3, 1)))
      const lunge = ramp(cut, 0, 0.35)
      const chop = ramp(cut, 0.3, 0.55)
      poseHero(him, {
        x: WORK.him.x + 110 * lunge,
        y: WORK.him.y - 30 * lunge,
        step: lunge > 0 && lunge < 1 ? lunge * 3 : 0,
        shield: ARM.guard * ramp(waved, 0.5, 0.7) * (1 - lunge),
        sword: ARM.up * ramp(cut, 0, 0.3) * (1 - chop) + lerp(ARM.up, 30, chop) * (chop > 0 ? 1 : 0) * (1 - ramp(cut, 0.8, 1)),
        lean: -6 * bell(waved, 0.6, 1) + 12 * bell(cut, 0.3, 0.8),
      })
    }
  },
}

// The Tech Stack, the culling: the walled city at the river gate at dusk, its houses burning behind the wall. The
// prince raises his sword and his soldiers storm the gate, cutting down the townsfolk there, as the roofs catch;
// he plants his sword and turns his back, his knights with him; then he walks out along the road. The end frame
// is the city burning, the prince alone at the gate and him on the road away.
const TECH = {
  gate: { x: 150, y: 650 },
  prince: { x: 30, y: 760 },
  soldiers: [{ x: -80, y: 850 }, { x: -10, y: 900 }, { x: 60, y: 840 }, { x: 110, y: 890 }],
  townsfolk: [{ x: 120, y: 700 }, { x: 200, y: 720 }],
  knights: [{ x: -230, y: 920 }, { x: -110, y: 1010 }],
}
// His road away: on a phone it starts nearer the gate and ends sooner, so the band can stand far enough left
// that the prince at the gate is whole on the screen while he ends right of its middle.
const TECH_HIM = {
  field: { x: -170, y: 960, away: -300, awayY: 1010 },
  phone: { x: -100, y: 960, away: -180, awayY: 1010 },
}
const techHimOf = ({ phone }: RealmScene) => TECH_HIM[phone ? 'phone' : 'field']

function CityWall() {
  const { x, y } = TECH.gate
  return (
    <g>
      <path d={`M${x - 640} ${y} V${y - 150} H${x + 520} V${y} Z`} fill={REALM.stone21} stroke={REALM.stone4b} strokeWidth="5" />
      {Array.from({ length: 30 }, (_, i) => x - 640 + i * 40).map((bx) => (
        <rect key={bx} x={bx} y={y - 176} width={24} height={28} fill={REALM.stone21} stroke={REALM.stone4b} strokeWidth="3" />
      ))}
      {[-120, 120].map((dx) => (
        <g key={dx}>
          <rect x={x + dx - 50} y={y - 250} width={100} height={250} fill={REALM.stone27} stroke={REALM.stone4b} strokeWidth="5" />
          <path d={`M${x + dx - 60} ${y - 250} L${x + dx} ${y - 330} L${x + dx + 60} ${y - 250} Z`} fill={REALM.kingdomBlue} stroke={REALM.stone4b} strokeWidth="4" />
        </g>
      ))}
      <path d={`M${x - 70} ${y} V${y - 120} Q${x} ${y - 190} ${x + 70} ${y - 120} V${y} Z`} fill={REALM.stone1} />
      <ellipse cx={x} cy={y - 60} rx="60" ry="70" fill={REALM.chaosFireMid} opacity="0.45" />
      <g data-fx="wall-fire" opacity="0">
        {[-420, -240, 300, 440].map((dx) => (
          <path key={dx} d={`M${x + dx - 60} ${y - 170} Q${x + dx - 40} ${y - 330} ${x + dx} ${y - 230} Q${x + dx + 30} ${y - 360} ${x + dx + 60} ${y - 170} Z`} fill={REALM.chaosFireMid} opacity="0.9" />
        ))}
      </g>
    </g>
  )
}

const tech: SceneSpec = {
  lead: -260,
  phoneLead: -160,
  land: () => <CityLand />,
  script: [1700, 1500, 1700],
  figure: (scene) => (
    <>
      <CityWall />
      {TECH.townsfolk.map(({ x, y }, i) => (
        <g key={x}>
          <g transform={place(x, y)}>
            <Pool name={`pool-${i}`} />
          </g>
          <g data-fx={`townsman-${i}`} transform={place(x, y, -1, FOLK)}>
            <Villager name={`townsman-body-${i}`} tint={i + 1} />
          </g>
        </g>
      ))}
      {TECH.soldiers.map(({ x, y }, i) => (
        <g key={x} data-fx={`soldier-${i}`} transform={place(x, y, 1, FOLK)}>
          <Footman name={`soldier-body-${i}`} />
        </g>
      ))}
      <g data-fx="prince-at" transform={kingAt(TECH.prince.x, TECH.prince.y, 0.5 * depth(TECH.prince.y))}>
        <FrostKing name="prince" tone="prince" />
      </g>
      {TECH.knights.map(({ x, y }, i) => (
        <g key={x} data-fx={`knight-${i}`} transform={place(x, y, 1, FOLK)}>
          <Footman name={`knight-body-${i}`} />
        </g>
      ))}
      <HeroUnit x={techHimOf(scene).x} y={techHimOf(scene).y} scene={scene} />
    </>
  ),
  bind: (stage, scene) => {
    const road = techHimOf(scene)
    const him = heroNodes(stage)
    const prince = kingNodes(stage, 'prince')
    const soldiers = unitsOf(stage, 'soldier', TECH.soldiers.length)
    const soldierArms = TECH.soldiers.map((_, i) => fx(stage, `soldier-body-${i}-arm`))
    const townsfolk = unitsOf(stage, 'townsman', TECH.townsfolk.length)
    const pools = unitsOf(stage, 'pool', TECH.townsfolk.length)
    const knights = unitsOf(stage, 'knight', TECH.knights.length)
    const wallFire = fx(stage, 'wall-fire')
    const size = 0.5 * depth(TECH.prince.y)
    return (play) => {
      const ordered = share(play, 0)
      const refused = share(play, 1)
      const left = share(play, 2)
      poseKing(prince, { x: TECH.prince.x, y: TECH.prince.y, size, blade: -150 * ramp(ordered, 0, 0.25) * (1 - ramp(left, 0.6, 1) * 0.6), hand: 40 * ramp(refused, 0.3, 0.6) })
      fadeTo(wallFire, ramp(ordered, 0.4, 0.9))
      // the soldiers run for the gate, cut down the townsfolk there and go in after them
      soldiers.forEach((node, i) => {
        const { x, y } = TECH.soldiers[i]
        const run = ramp(ordered, 0.15 + i * 0.06, 0.8 + i * 0.05)
        const sx = lerp(x, TECH.gate.x - 20 + 14 * i, run)
        const sy = lerp(y, TECH.gate.y + 30, run)
        transformTo(node, `${place(sx, sy, 1, FOLK)} translate(0 ${r1(run > 0 && run < 1 ? hop(sx) : 0)})`)
        fadeTo(node, 1 - ramp(refused, 0.1 + i * 0.1, 0.4 + i * 0.1))
        swingArm(soldierArms[i], blow(ramp(ordered, 0.6, 0.95)))
      })
      townsfolk.forEach((node, i) => {
        const { x, y } = TECH.townsfolk[i]
        const cut = ramp(ordered, 0.65 + i * 0.1, 0.8 + i * 0.1)
        transformTo(node, `${place(x, y, -1, FOLK)} ${felled(cut)}`)
        fadeTo(pools[i], 0.75 * ramp(cut, 0.5, 1))
      })
      // his back to it: the sword planted, then the road out
      const turned = ramp(refused, 0.3, 0.45)
      const walk = ramp(left, 0, 0.9)
      knights.forEach((node, i) => {
        const { x, y } = TECH.knights[i]
        const kx = x - 120 * walk
        transformTo(node, `${place(kx, y + 10 * walk, turned > 0.5 ? -1 : 1, FOLK)} translate(0 ${r1(walk > 0 && walk < 1 ? hop(kx) : 0)})`)
      })
      poseHero(him, {
        x: lerp(road.x, road.away, walk),
        y: lerp(road.y, road.awayY, walk),
        face: turned > 0.5 ? -1 : 1,
        step: walk > 0 && walk < 1 ? walk * 5 : 0,
        sword: 40 * ramp(refused, 0, 0.3) * (1 - ramp(left, 0, 0.2)),
        lean: 8 * bell(refused, 0, 0.4),
      })
    }
  },
}

// Services, the cursed blade: the ice shelf of the north, the prince's ships burning in the bay behind. On the
// shelf the stone guardian raises its hand in warning and crumbles under the prince's blow; the prince pulls the
// blade from its pedestal, the pedestal bursts, a shard flies at him and he takes it on his shield, and the
// prince's silver goes black and spiked: the frost king. The frost king turns, the runeblade lit. The end frame is
// the frost king on the shelf, the pedestal broken, him on one knee behind his shield.
const SERVICES = { shelf: { x: 120, y: 820 }, pedestal: { x: 170, y: 760 }, guardian: { x: 270, y: 740 }, prince: { x: 20, y: 790, to: 110 }, him: { x: -180, y: 985 } }

function IceShelf() {
  const { x, y } = SERVICES.shelf
  return (
    <g>
      <path d={`M${x - 230} ${y} L${x - 180} ${y - 120} L${x + 210} ${y - 140} L${x + 260} ${y} Z`} fill={REALM.frost81} stroke={REALM.frostIceDark} strokeWidth="4" />
      <path d={`M${x - 230} ${y} L${x + 260} ${y} L${x + 250} ${y + 90} L${x - 220} ${y + 100} Z`} fill={REALM.frostIceDark} stroke={REALM.night14} strokeWidth="4" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${x - 320 + i * 30} ${y + 100 - (i + 1) * 25} h90 v25 h-90 Z`} fill={REALM.frost66} stroke={REALM.night14} strokeWidth="2" />
      ))}
      <path d={`M${x - 140} ${y + 20} L${x - 120} ${y + 70} M${x + 60} ${y + 10} L${x + 80} ${y + 80} M${x + 180} ${y + 20} L${x + 170} ${y + 70}`} stroke={REALM.frostIceMid} strokeWidth="3" />
    </g>
  )
}

/** The cursed blade in its pedestal of ice, the pedestal in pieces `${name}-piece-i` to burst. */
function Pedestal({ name }: { name: string }) {
  const pieces = ['M-50,0 L-40,-40 L-6,-44 L-10,0 Z', 'M10,0 L6,-44 L40,-40 L50,0 Z', 'M-40,-40 L-30,-80 L0,-84 L-6,-44 Z', 'M6,-44 L0,-84 L30,-80 L40,-40 Z']
  return (
    <g>
      {pieces.map((d, i) => (
        <path key={i} data-fx={`${name}-piece-${i}`} d={d} fill={REALM.frostIceDark} stroke={REALM.frostIceBright} strokeWidth="2" />
      ))}
      <g data-fx={`${name}-blade`}>
        <ellipse cx={0} cy={-160} rx={50} ry={100} fill={REALM.frostIceBright} opacity="0.3" />
        <path d="M-6,-80 L-7,-220 L0,-240 L7,-220 L6,-80 Z" fill={REALM.frostIceMid} stroke={REALM.frostIceDark} strokeWidth="2" />
        <path d="M-26,-206 L0,-200 L26,-206 L20,-196 L-20,-196 Z" fill={REALM.night15a} stroke={REALM.earth48} strokeWidth="2" />
        <rect x={-4} y={-238} width={8} height={30} fill={REALM.night7a} />
      </g>
    </g>
  )
}

/** The stone guardian, a giant of carved stone, its hand raised in warning in `${name}-arm` (turning about its
 *  shoulder, 40, -250), its blocks in `${name}-block-i` so it can crumble; about 300 high. */
function Guardian({ name }: { name: string }) {
  const blocks = ['M-50,0 L-40,-120 L-6,-120 L-10,0 Z', 'M10,0 L6,-120 L40,-120 L50,0 Z', 'M-64,-120 L64,-120 L56,-250 L-56,-250 Z', 'M-30,-250 L30,-250 L26,-310 L-26,-310 Z', 'M-56,-250 L-90,-130 L-66,-122 L-40,-220 Z']
  return (
    <g>
      {blocks.map((d, i) => (
        <path key={i} data-fx={`${name}-block-${i}`} d={d} fill={REALM.stone33} stroke={REALM.stone4b} strokeWidth="4" />
      ))}
      <path d="M-14,-294 L-6,-284 M14,-294 L6,-284 M-40,-200 L40,-200 M-40,-160 L40,-160" stroke={REALM.frostIceMid} strokeWidth="3" />
      <g data-fx={`${name}-arm`}>
        <path d="M40,-246 L110,-300 L124,-284 L56,-222 Z M110,-300 L118,-340 L128,-338 L130,-296 L140,-330 L148,-326 L136,-286 Z" fill={REALM.stone41} stroke={REALM.stone4b} strokeWidth="4" />
      </g>
    </g>
  )
}

const services: SceneSpec = {
  lead: -180,
  land: () => <NorthLand />,
  script: [1500, 1900, 1400],
  figure: (scene) => (
    <>
      <IceShelf />
      <g transform={place(SERVICES.guardian.x, SERVICES.guardian.y, -1, 0.75)}>
        <Guardian name="guardian" />
      </g>
      <g transform={place(SERVICES.pedestal.x, SERVICES.pedestal.y)}>
        <Pedestal name="pedestal" />
      </g>
      <g data-fx="burst" opacity="0" transform={`translate(${SERVICES.pedestal.x} ${SERVICES.pedestal.y - 120})`}>
        <ellipse rx="220" ry="160" fill={REALM.frostIceBright} opacity="0.5" />
        <ellipse rx="110" ry="80" fill={REALM.ash100} opacity="0.7" />
      </g>
      <g data-fx="king-at" transform={kingAt(SERVICES.prince.x, SERVICES.prince.y, 0.62 * depth(SERVICES.prince.y))}>
        <FrostKing name="king" />
        <g data-fx="silver">
          <FrostKing name="prince" tone="prince" />
        </g>
      </g>
      <g data-fx="shard" opacity="0">
        <path d="M-30,0 L20,-10 L40,0 L20,10 Z" fill={REALM.frostIceBright} stroke={REALM.frostIceDark} strokeWidth="2" />
        <path d="M-30,0 L-120,-4" stroke={REALM.frostIceMid} strokeWidth="6" opacity="0.5" />
      </g>
      <HeroUnit x={SERVICES.him.x} y={SERVICES.him.y} scene={scene} />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const guardianArm = fx(stage, 'guardian-arm')
    const blocks = unitsOf(stage, 'guardian-block', 5)
    const pieces = unitsOf(stage, 'pedestal-piece', 4)
    const blade = fx(stage, 'pedestal-blade')
    const burst = fx(stage, 'burst')
    const shard = fx(stage, 'shard')
    const silver = fx(stage, 'silver')
    const king = kingNodes(stage, 'king')
    const prince = kingNodes(stage, 'prince')
    return (play) => {
      const warned = share(play, 0)
      const taken = share(play, 1)
      const risen = share(play, 2)
      // the guardian's warning hand, then the prince's blow, and it falls apart block by block
      transformTo(guardianArm, `rotate(${r1(-40 * ramp(warned, 0, 0.3))} 40 -246) translate(0 ${r1(260 * ramp(warned, 0.7, 1))})`)
      fadeTo(guardianArm, 1 - ramp(warned, 0.85, 1))
      blocks.forEach((block, i) => {
        const fall = ramp(warned, 0.5 + i * 0.07, 0.7 + i * 0.06)
        transformTo(block, `translate(${r1((i - 2) * 30 * fall)} ${r1(180 * fall * fall)}) rotate(${r1((i % 2 ? 1 : -1) * 30 * fall)})`)
        fadeTo(block, 1 - ramp(fall, 0.7, 1))
      })
      // the prince walks to the pedestal and draws the blade; the ice bursts and his silver goes black
      const walked = ramp(taken, 0, 0.3)
      const x = lerp(SERVICES.prince.x, SERVICES.prince.to, walked)
      const size = 0.62 * depth(SERVICES.prince.y)
      const strike = bell(warned, 0.3, 0.7)
      const drawn = ramp(taken, 0.35, 0.5)
      transformTo(prince.blade, turn(-130 * strike - 120 * bell(taken, 0.25, 0.5), KING_BLADE_AT))
      transformTo(prince.hand, turn(60 * bell(taken, 0.2, 0.5), KING_HAND_AT))
      fadeTo(blade, 1 - drawn)
      const flash = ramp(taken, 0.45, 0.55)
      fadeTo(burst, flash * (1 - ramp(taken, 0.6, 1)))
      transformTo(burst, `translate(${SERVICES.pedestal.x} ${SERVICES.pedestal.y - 120}) scale(${(0.4 + 1.2 * ramp(taken, 0.45, 1)).toFixed(3)})`)
      pieces.forEach((piece, i) => {
        const fly = ramp(taken, 0.48, 0.9)
        transformTo(piece, `translate(${r1((i % 2 ? 1 : -1) * 90 * fly)} ${r1(-80 * Math.sin(Math.PI * fly) + 40 * fly)}) rotate(${r1((i % 2 ? 1 : -1) * 90 * fly)})`)
        fadeTo(piece, 1 - ramp(fly, 0.6, 1))
      })
      fadeTo(silver, 1 - ramp(taken, 0.5, 0.85))
      // the shard flies from the burst at him, and his shield takes it
      const flight = ramp(taken, 0.5, 0.75)
      const from = { x: SERVICES.pedestal.x, y: SERVICES.pedestal.y - 100 }
      const to = { x: SERVICES.him.x + 60, y: SERVICES.him.y - 110 }
      transformTo(shard, `translate(${r1(lerp(from.x, to.x, flight))} ${r1(lerp(from.y, to.y, flight))}) rotate(${r1(180 + 20 * flight)})`)
      fadeTo(shard, flight > 0 && flight < 1 ? 1 : 0)
      // the frost king turns his new blade up, lit
      poseKing(king, { x, y: SERVICES.prince.y - 20 * walked, size, blade: -160 * ramp(risen, 0, 0.6), hand: 30 * ramp(risen, 0.3, 0.8), glow: 0.15 + 0.7 * ramp(risen, 0.2, 0.8) })
      const hit = ramp(taken, 0.72, 0.8)
      const knelt = ramp(taken, 0.75, 1)
      poseHero(him, {
        x: SERVICES.him.x - 20 * hit,
        y: SERVICES.him.y,
        shield: ARM.guard * ramp(taken, 0.4, 0.6),
        sword: 30 * knelt,
        lean: -10 * bell(taken, 0.7, 0.9) + 8 * knelt,
        lift: -28 * knelt,
        knee: -70 * knelt,
      })
    }
  },
}

// Projects, the frost king and his throne: the frozen realm, the ice throne on its spire, the death steed at its
// foot and the dead under the snow. The frost king lifts the runeblade and the dead claw up out of the snow in
// ranks; he sweeps the blade, a ring of frost rolls out and the footmen with the knight commander freeze and
// shatter while he holds behind his shield; then the frost king climbs into his throne and its crown lights. The
// end frame is the frost king on the throne, the steed at its foot, the dead in ranks, him alone before them.
// From the left the field is too wide for half a phone, so there the realm stands the other way round: the
// throne deep in the middle with the steed at its left foot, the dead coming up toward him, and him with his
// footmen on the right half, facing them; `face` is the way he and his footmen face, `deadFace` the dead's.
const PROJECTS_AT = {
  field: {
    throne: { x: 150, y: 760, size: 0.56 },
    seat: { x: 150, y: 680 },
    king: { x: 40, y: 880 },
    steed: { x: 290, y: 930, size: 0.62 },
    dead: [
      { x: -40, y: 900 },
      { x: 40, y: 960 },
      { x: 120, y: 930 },
      { x: 200, y: 990 },
      { x: -10, y: 1020 },
      { x: 110, y: 1030 },
    ],
    footmen: [{ x: -300, y: 910 }, { x: -160, y: 1030 }],
    him: { x: -230, y: 975 },
    face: 1,
    deadFace: -1,
  },
  phone: {
    throne: { x: -60, y: 760, size: 0.56 },
    seat: { x: -60, y: 680 },
    king: { x: 40, y: 880 },
    steed: { x: -200, y: 930, size: 0.62 },
    dead: [
      { x: 110, y: 900 },
      { x: 30, y: 960 },
      { x: -40, y: 930 },
      { x: -120, y: 990 },
      { x: 80, y: 1020 },
      { x: -30, y: 1030 },
    ],
    footmen: [{ x: 330, y: 910 }, { x: 190, y: 1030 }],
    him: { x: 250, y: 975 },
    face: -1,
    deadFace: 1,
  },
} as const
const projectsOf = ({ phone }: RealmScene) => PROJECTS_AT[phone ? 'phone' : 'field']

const projects: SceneSpec = {
  lead: -200,
  phoneLead: 176,
  land: () => <FrozenLand />,
  script: [1600, 1700, 1700],
  figure: (scene) => {
    const at = projectsOf(scene)
    return (
      <>
        <g transform={`translate(${at.throne.x} ${at.throne.y}) scale(${at.throne.size})`}>
          <IceThrone name="throne" />
        </g>
        <g transform={`translate(${at.steed.x} ${at.steed.y}) scale(${at.steed.size})`}>
          <DeathSteed name="steed" />
        </g>
        <g data-fx="nova" opacity="0" transform={`translate(${at.king.x} ${at.king.y})`}>
          <ellipse rx="300" ry="90" fill="none" stroke={REALM.frostIceBright} strokeWidth="18" />
          <ellipse rx="300" ry="90" fill={REALM.frostIceMid} opacity="0.25" />
        </g>
        {at.dead.map(({ x, y }, i) => (
          <g key={x + y} data-fx={`dead-${i}`} transform={place(x, y + 90, at.deadFace, FOLK)} opacity="0">
            {i % 2 ? <BoneSoldier name={`dead-body-${i}`} /> : <Risen name={`dead-body-${i}`} />}
          </g>
        ))}
        <g data-fx="king-at" transform={kingAt(at.king.x, at.king.y, 0.66 * depth(at.king.y))}>
          <FrostKing name="king" />
        </g>
        {at.footmen.map(({ x, y }, i) => (
          <g key={x} data-fx={`footman-${i}`} transform={place(x, y, at.face, FOLK)}>
            <Footman name={`footman-body-${i}`} />
            <g data-fx={`ice-${i}`} opacity="0">
              <path d="M-26,0 L-30,-80 L-10,-104 L20,-100 L30,-60 L26,0 Z" fill={REALM.frostIceMid} opacity="0.7" stroke={REALM.frostIceBright} strokeWidth="3" />
            </g>
          </g>
        ))}
        <HeroUnit x={at.him.x} y={at.him.y} face={at.face} scene={scene} />
      </>
    )
  },
  bind: (stage, scene) => {
    const at = projectsOf(scene)
    const him = heroNodes(stage)
    const king = kingNodes(stage, 'king')
    const crown = fx(stage, 'throne-crown')
    const nova = fx(stage, 'nova')
    const dead = unitsOf(stage, 'dead', at.dead.length)
    const footmen = unitsOf(stage, 'footman', at.footmen.length)
    const ice = unitsOf(stage, 'ice', at.footmen.length)
    return (play) => {
      const raised = share(play, 0)
      const swept = share(play, 1)
      const throned = share(play, 2)
      // the dead come up out of the snow, rank by rank
      dead.forEach((node, i) => {
        const { x, y } = at.dead[i]
        const up = ramp(raised, 0.25 + i * 0.07, 0.6 + i * 0.07)
        transformTo(node, `${place(x, y + 90 * (1 - up), at.deadFace, FOLK)} rotate(${r1(-20 * (1 - up))})`)
        fadeTo(node, ramp(up, 0, 0.25))
      })
      // the nova rolls out and the footmen freeze, then shatter
      const roll = ramp(swept, 0.2, 0.7)
      transformTo(nova, `translate(${at.king.x} ${at.king.y}) scale(${(0.1 + 1.3 * roll).toFixed(3)})`)
      fadeTo(nova, roll > 0 ? 1 - ramp(roll, 0.6, 1) : 0)
      footmen.forEach((node, i) => {
        const frozen = ramp(swept, 0.4 + i * 0.08, 0.55 + i * 0.08)
        fadeTo(ice[i], frozen)
        fadeTo(node, 1 - ramp(swept, 0.75 + i * 0.05, 0.95))
        const { x, y } = at.footmen[i]
        transformTo(node, `${place(x, y, at.face, FOLK)} scale(${(1 + 0.3 * ramp(swept, 0.8, 1)).toFixed(3)})`)
      })
      // up into the throne
      const climb = ramp(throned, 0, 0.8)
      const kx = lerp(at.king.x, at.seat.x, climb)
      const ky = lerp(at.king.y, at.seat.y, climb)
      const sweep = -160 * ramp(raised, 0, 0.4) * (1 - ramp(swept, 0, 0.3)) + lerp(-160, -30, ramp(swept, 0, 0.3)) * (swept > 0 ? 1 : 0) * (1 - ramp(throned, 0.5, 1))
      poseKing(king, {
        x: kx,
        y: ky + 6 * Math.sin(climb * Math.PI * 6) * (climb < 1 ? 1 : 0),
        size: 0.66 * lerp(depth(at.king.y), 0.82, climb),
        blade: sweep,
        hand: 50 * bell(swept, 0, 0.6) + 20 * ramp(throned, 0.8, 1),
        glow: 0.15 + 0.7 * ramp(raised, 0, 0.4) * (1 - 0.6 * ramp(throned, 0, 1)),
      })
      fadeTo(crown, 0.4 + 0.6 * ramp(throned, 0.6, 1))
      poseHero(him, {
        x: at.him.x - at.face * 14 * bell(swept, 0.4, 0.9),
        y: at.him.y,
        face: at.face,
        shield: ARM.guard * ramp(swept, 0.2, 0.4),
        sword: ARM.forward * 0.5 * ramp(throned, 0.4, 1),
        lean: -10 * bell(swept, 0.4, 0.9),
      })
    }
  },
}

// Ventures, the demons arrive: the city of mages burning. The burning giants fall from the sky as meteors and
// burst in their craters; their rocks fly up out of the craters and lock until each stands whole, its blight fire
// lit; the near one swings at him and he takes it on his shield, a footman thrown. The end frame is the golems in
// their craters, the towers burning, him braced before them.
const VENTURES = {
  near: { x: 110, y: 920, size: 1.4 },
  far: { x: 205, y: 720, size: 0.8 },
  mages: [{ x: -40, y: 760 }, { x: 30, y: 800 }],
  footman: { x: -60, y: 960 },
  him: { x: -210, y: 990 },
}

const golemAt = (x: number, y: number, size: number, lean = 0): string =>
  `translate(${r1(x - GOLEM_FEET.x * size)} ${r1(y - GOLEM_FEET.y * size)}) scale(${size.toFixed(3)}) rotate(${r1(lean)} ${GOLEM_FEET.x} ${GOLEM_FEET.y})`

const ventures: SceneSpec = {
  lead: -180,
  land: () => <BurningCityLand />,
  script: [1500, 1900, 1500],
  figure: (scene) => (
    <>
      <g transform={golemAt(VENTURES.far.x, VENTURES.far.y, VENTURES.far.size)}>
        <GolemRise name="golem-far" />
      </g>
      {VENTURES.mages.map(({ x, y }, i) => (
        <g key={x} data-fx={`mage-${i}`} transform={place(x, y, -1, FOLK)}>
          <Mage name={`mage-body-${i}`} />
        </g>
      ))}
      <g data-fx="golem-near-at" transform={golemAt(VENTURES.near.x, VENTURES.near.y, VENTURES.near.size)}>
        <GolemRise name="golem-near" />
      </g>
      <g data-fx="thrown" transform={place(VENTURES.footman.x, VENTURES.footman.y, 1, FOLK)}>
        <Footman name="thrown-body" />
      </g>
      <HeroUnit x={VENTURES.him.x} y={VENTURES.him.y} scene={scene} />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const far = riseWriter(stage, 'golem-far')
    const near = riseWriter(stage, 'golem-near')
    const nearAt = fx(stage, 'golem-near-at')
    const mages = unitsOf(stage, 'mage', VENTURES.mages.length)
    const thrown = fx(stage, 'thrown')
    return (play) => {
      const fell = share(play, 0)
      const rose = share(play, 1)
      const smashed = share(play, 2)
      far({ fall: ramp(fell, 0, 0.45), burst: ramp(fell, 0.45, 0.8), built: ramp(rose, 0, 0.75), whole: ramp(rose, 0.75, 0.95) })
      near({ fall: ramp(fell, 0.3, 0.75), burst: ramp(fell, 0.75, 1), built: ramp(rose, 0.1, 0.85), whole: ramp(rose, 0.85, 1) })
      // the near golem lunges and swings
      const lunge = bell(smashed, 0.1, 0.8)
      transformTo(nearAt, golemAt(VENTURES.near.x - 60 * ramp(smashed, 0.1, 0.5), VENTURES.near.y, VENTURES.near.size, -14 * lunge))
      mages.forEach((node, i) => {
        const { x, y } = VENTURES.mages[i]
        const ran = ramp(fell, 0.2 + i * 0.1, 1)
        transformTo(node, `${place(x - 260 * ran, y - 80 * ran, -1, FOLK)} translate(0 ${r1(hop(ran * 260))})`)
        fadeTo(node, 1 - ramp(ran, 0.6, 1))
      })
      const flung = ramp(smashed, 0.3, 0.8)
      transformTo(thrown, `${place(VENTURES.footman.x - 150 * flung, VENTURES.footman.y - 220 * Math.sin(Math.PI * flung) + 30 * flung, 1, FOLK)} rotate(${r1(-200 * flung)})`)
      fadeTo(thrown, 1 - ramp(flung, 0.8, 1))
      const braced = ramp(smashed, 0.3, 0.5)
      poseHero(him, {
        x: VENTURES.him.x - 30 * bell(smashed, 0.4, 0.9),
        y: VENTURES.him.y,
        shield: ARM.guard * ramp(smashed, 0.1, 0.35) + ARM.low * bell(fell, 0.3, 1),
        sword: ARM.up * 0.7 * braced,
        lean: -12 * bell(smashed, 0.35, 0.9) + 4 * braced,
      })
    }
  },
}

// Bands, the crossing: a storm sea, the horned clans' longships making for the new land's shore. He beats the war
// drum on the lead ship's prow and the oars pull to it under the lightning; then the ships run up the beach and
// the warband leaps into the surf under their red banners. The end frame is the ships beached, the warband
// ashore, him at the drum.
const BANDS = {
  ships: [
    { from: { x: -40, y: 1080 }, to: { x: 20, y: 850 } },
    { from: { x: -260, y: 980 }, to: { x: -220, y: 790 } },
    { from: { x: 230, y: 1000 }, to: { x: 250, y: 800 } },
  ],
  warband: [{ x: -120, y: 740 }, { x: -40, y: 720 }, { x: 60, y: 735 }, { x: 150, y: 715 }, { x: 230, y: 740 }],
  drum: { x: 100, y: -16 },
  him: { x: 30, y: -16 },
}

/** His size on the lead ship's deck, beside its drum. */
const ON_DECK = 0.78

const bands: SceneSpec = {
  lead: 30,
  land: () => <SeaLand />,
  script: [2000, 2200],
  figure: (scene) => (
    <>
      <g data-fx="flash" opacity="0">
        <rect x={-1500} y={0} width={3000} height={FIELD.height} fill={REALM.frostIceBright} opacity="0.25" />
      </g>
      {BANDS.warband.map(({ x, y }, i) => (
        <g key={x} data-fx={`warrior-${i}`} transform={place(x, y, 1, FOLK)} opacity="0">
          <Raider name={`warrior-body-${i}`} />
          {i % 2 === 0 && <path d="M-26,-40 V-150 M-26,-150 H6 L-4,-128 L6,-106 H-26" stroke={REALM.ember21} strokeWidth="4" fill={REALM.clanRed} />}
        </g>
      ))}
      {BANDS.ships.map(({ from }, i) => (
        <g key={from.x} data-fx={`ship-${i}`} transform={place(from.x, from.y, 1, 0.7)}>
          <Longship name={`ship-body-${i}`} />
          {i === 0 && (
            <>
              <g transform={`translate(${BANDS.drum.x} ${BANDS.drum.y}) scale(0.9)`}>
                <WarDrum />
              </g>
              <g transform={`translate(${BANDS.him.x} ${BANDS.him.y})`}>
                <g data-fx="hero" transform={`translate(${-HERO_FEET.x * ON_DECK} ${-HERO_FEET.y * ON_DECK}) scale(${ON_DECK})`}>
                  <Commander profession={scene.profession} figure={scene.figure} />
                </g>
              </g>
            </>
          )}
        </g>
      ))}
    </>
  ),
  bind: (stage) => {
    const ships = unitsOf(stage, 'ship', BANDS.ships.length)
    const oars = BANDS.ships.map((_, i) => fx(stage, `ship-body-${i}-oars`))
    const warriors = unitsOf(stage, 'warrior', BANDS.warband.length)
    const flash = fx(stage, 'flash')
    const sword = fx(stage, 'hero-sword')
    const shield = fx(stage, 'hero-shield')
    return (play) => {
      const drummed = share(play, 0)
      const landed = share(play, 1)
      // the beat: his sticks fall and the oars pull together, held through the run in
      const beats = (drummed + landed * 0.6) * 9
      const beat = Math.abs(Math.sin(beats * Math.PI))
      const playing = ramp(drummed, 0.05, 0.2) * (1 - ramp(landed, 0.75, 1))
      transformTo(sword, turn(-70 + 50 * beat * playing, SWORD_AT))
      transformTo(shield, turn(-70 + 50 * (1 - beat) * playing, SHIELD_AT))
      oars.forEach((oar, i) => transformTo(oar, `rotate(${r1(-18 * beat * playing + 4 * i)})`))
      fadeTo(flash, Math.max(bell(drummed, 0.3, 0.38), bell(drummed, 0.7, 0.76)))
      // the ships make for the shore and run up on the sand
      ships.forEach((node, i) => {
        const { from, to } = BANDS.ships[i]
        const run = ramp(landed, i * 0.08, 0.7 + i * 0.08)
        const sea = run < 1 ? 5 * Math.sin((drummed + landed) * 10 + i * 2) : 0
        transformTo(node, `${place(lerp(from.x, to.x, run), lerp(from.y, to.y, run) + sea, 1, 0.7)} rotate(${r1(2 * Math.sin((drummed + landed) * 8 + i))})`)
      })
      warriors.forEach((node, i) => {
        const { x, y } = BANDS.warband[i]
        const leap = ramp(landed, 0.55 + i * 0.06, 0.8 + i * 0.04)
        transformTo(node, `${place(x, y + 60 * (1 - leap) - 50 * Math.sin(Math.PI * leap), 1, FOLK)}`)
        fadeTo(node, ramp(leap, 0, 0.2))
      })
    }
  },
}

// The Muay Thai record, the warlord and the fiend: the felled forest of the new land, the fouled well glowing red.
// The red warlord charges and he catches him in the clinch and drives a knee; he sweeps him down and the red
// drains out of him; then the pit fiend climbs out of the well and the freed warlord cleaves it as his flying knee
// lands. The end frame is the fiend fallen back into its well and the warlord himself again beside him.
const DUEL = { well: { x: 220, y: 780 }, warlord: { x: 270, y: 920, to: 40, toY: 975 }, him: { x: -150, y: 985, meet: -60 } }

function FouledWell({ front }: { front: boolean }) {
  return front ? (
    <path d="M-120,0 Q-120,40 0,44 Q120,40 120,0 L120,-10 Q0,30 -120,-10 Z" fill={REALM.stone27} stroke={REALM.stone4b} strokeWidth="4" />
  ) : (
    <g>
      <ellipse rx="130" ry="40" fill={REALM.stone27} stroke={REALM.stone4b} strokeWidth="4" />
      <ellipse rx="104" ry="28" fill={REALM.warlordRed} />
      <ellipse rx="70" ry="16" fill={REALM.chaosFireMid} opacity="0.6" />
      <ellipse cy="-80" rx="150" ry="110" fill={REALM.warlordRed} opacity="0.12" />
    </g>
  )
}

const muayThai: SceneSpec = {
  lead: -80,
  land: () => <FelledForestLand />,
  script: [1500, 1500, 1900],
  figure: (scene) => (
    <>
      <g transform={`translate(${DUEL.well.x} ${DUEL.well.y}) scale(${depth(DUEL.well.y).toFixed(3)})`}>
        <FouledWell front={false} />
        <g data-fx="fiend" transform="translate(0 340) scale(0.7)" opacity="0">
          <PitFiend name="fiend-body" />
        </g>
        <FouledWell front />
      </g>
      <g data-fx="warlord" transform={place(DUEL.warlord.x, DUEL.warlord.y, -1)}>
        <Warlord name="warlord-body" />
      </g>
      <HeroUnit x={DUEL.him.x} y={DUEL.him.y} scene={scene} />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const warlord = fx(stage, 'warlord')
    const red = fx(stage, 'warlord-body-red')
    const axe = fx(stage, 'warlord-body-arm')
    const fiend = fx(stage, 'fiend')
    const claw = fx(stage, 'fiend-body-arm')
    return (play) => {
      const clinched = share(play, 0)
      const swept = share(play, 1)
      const slain = share(play, 2)
      // the charge comes in and is caught; the sweep takes him down; freed, he rises and turns on the fiend
      const charge = ramp(clinched, 0, 0.5)
      const wx = lerp(DUEL.warlord.x, DUEL.warlord.to, charge)
      const wy = lerp(DUEL.warlord.y, DUEL.warlord.toY, charge)
      const down = ramp(swept, 0.15, 0.55) * (1 - ramp(slain, 0.2, 0.45))
      const turned = slain > 0.3
      transformTo(warlord, `${place(wx + 40 * ramp(slain, 0.3, 0.7), wy - 30 * ramp(slain, 0.3, 0.7), turned ? 1 : -1)} translate(0 ${r1(charge > 0 && charge < 1 ? hop(wx) : 0)}) rotate(${r1(-10 * bell(clinched, 0.55, 0.9) - 84 * down)})`)
      fadeTo(red, 1 - ramp(swept, 0.5, 0.95))
      transformTo(axe, `rotate(${r1(-80 * ramp(slain, 0.45, 0.6) + 120 * ramp(slain, 0.6, 0.75))} 30 -124)`)
      // the fiend comes up out of the well, claws, takes the axe and goes back down into it
      const up = ramp(slain, 0, 0.35)
      const gone = ramp(slain, 0.72, 1)
      transformTo(fiend, `translate(${r1(20 * gone)} ${r1(lerp(340, 0, up) + 300 * gone * gone)}) scale(0.7) rotate(${r1(24 * gone)})`)
      fadeTo(fiend, ramp(up, 0, 0.2) * (1 - ramp(gone, 0.7, 1)))
      transformTo(claw, `rotate(${r1(-50 * bell(slain, 0.3, 0.65))} 60 -200)`)
      const stepIn = ramp(clinched, 0.35, 0.6)
      const kneed = bell(clinched, 0.6, 1)
      const sweep = bell(swept, 0, 0.5)
      const leap = bell(slain, 0.5, 0.95)
      poseHero(him, {
        x: lerp(DUEL.him.x, DUEL.him.meet, stepIn) + 70 * ramp(slain, 0.4, 0.8),
        y: DUEL.him.y - 20 * ramp(slain, 0.4, 0.8),
        lift: 70 * leap,
        step: stepIn > 0 && stepIn < 1 ? stepIn * 2 : 0,
        sword: ARM.forward * (ramp(clinched, 0.4, 0.6) * (1 - ramp(swept, 0.5, 0.8))) + ARM.up * 0.5 * leap,
        shield: ARM.forward * (ramp(clinched, 0.4, 0.6) * (1 - ramp(swept, 0.5, 0.8))) + ARM.up * 0.4 * leap,
        knee: -80 * kneed - 90 * leap,
        lean: 12 * ramp(clinched, 0.5, 0.7) * (1 - ramp(swept, 0.5, 0.8)) - 16 * sweep - 10 * leap,
      })
    }
  },
}

// The contact, the last stand: the tree mountain, the great tree at its top. The camps on the slope burn and the
// demon host climbs, the giant of cinders striding up with a burning giant beside him; the forest's trees pull up
// their roots and walk into the host; he sounds his horn and the wisps pour down on the giant and it breaks. The
// end frame is the great tree scorched and standing, a green shoot at its root, the giant gone.
const CONTACT = {
  tree: { x: -110, y: 700 },
  giant: { x: 280, y: 870, to: 190 },
  golem: { x: 280, y: 990 },
  fiends: [{ x: 200, y: 980 }, { x: 130, y: 1020 }, { x: 260, y: 1030 }],
  camps: [{ x: 60, y: 720 }, { x: 300, y: 760 }],
  trees: [{ x: -240, y: 900, to: 60 }, { x: -20, y: 800, to: 130 }],
  wisps: 6,
  him: { x: -80, y: 990 },
}

function GreatTree() {
  return (
    <g>
      <ellipse cx="0" cy="-420" rx="330" ry="260" fill={REALM.spirit} opacity="0.12" />
      <path d="M-150,0 Q-90,-30 -60,-120 L-70,-340 L70,-340 L60,-120 Q90,-30 150,0 Z" fill={REALM.forestBark} stroke={REALM.stone4b} strokeWidth="5" />
      <path d="M-20,-120 Q-30,-240 -10,-330 M30,-100 Q40,-220 20,-320" stroke={REALM.ember16} strokeWidth="6" fill="none" />
      <path d="M-60,-300 Q-200,-360 -260,-300 M60,-300 Q200,-380 270,-320" stroke={REALM.forestBark} strokeWidth="26" strokeLinecap="round" fill="none" />
      {[
        [-210, -420, 130],
        [0, -520, 170],
        [200, -430, 130],
        [-110, -560, 110],
        [120, -570, 110],
      ].map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={REALM.forestMoss} stroke={REALM.moss15} strokeWidth="6" />
      ))}
      {[
        [-160, -440],
        [40, -560],
        [180, -400],
        [-60, -500],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="10" fill={REALM.spirit} />
      ))}
      <g data-fx="scorch" opacity="0">
        <path d="M-60,-120 L-70,-340 L70,-340 L60,-120 Z" fill={REALM.stone4a} opacity="0.6" />
        <circle cx="200" cy="-430" r="130" fill={REALM.stone8b} opacity="0.55" />
        <circle cx="-210" cy="-420" r="110" fill={REALM.stone8b} opacity="0.4" />
      </g>
      <g data-fx="shoot" opacity="0">
        <path d="M110,0 Q104,-40 120,-70 M114,-40 Q90,-60 84,-48 M118,-56 Q140,-74 146,-62" stroke={REALM.lifeGreen} strokeWidth="6" fill="none" strokeLinecap="round" />
      </g>
    </g>
  )
}

/** A burning camp on the slope: a tent and its fire in `${name}-fire`. */
function Camp({ name }: { name: string }) {
  return (
    <g>
      <path d="M-60,0 L0,-80 L60,0 Z" fill={REALM.riverCream} stroke={REALM.stone4b} strokeWidth="4" />
      <path d="M0,-80 L-10,0 H10 Z" fill={REALM.ember21} />
      <g data-fx={`${name}-fire`} opacity="0">
        <path d="M-70,0 Q-60,-140 -20,-80 Q0,-180 30,-80 Q60,-140 70,0 Z" fill={REALM.chaosFireMid} />
        <path d="M-30,-10 Q-10,-100 10,-40 Q30,-90 34,-10 Z" fill={REALM.chaosFireCore} />
      </g>
    </g>
  )
}

const contact: SceneSpec = {
  lead: -80,
  land: () => <TreeMountainLand />,
  script: [1500, 1600, 1900],
  figure: (scene) => (
    <>
      <g transform={`translate(${CONTACT.tree.x} ${CONTACT.tree.y}) scale(0.56)`}>
        <GreatTree />
      </g>
      {CONTACT.camps.map(({ x, y }, i) => (
        <g key={x} transform={place(x, y)}>
          <Camp name={`camp-${i}`} />
        </g>
      ))}
      <g data-fx="giant" transform={place(CONTACT.giant.x, CONTACT.giant.y, -1, 0.62)}>
        <CinderGiant name="giant-body" />
      </g>
      <g data-fx="golem" transform={golemAt(CONTACT.golem.x, CONTACT.golem.y, 0.8)}>
        <g transform="translate(160 0) scale(-1 1)">
          <InfernalGolem id="golem-contact" />
        </g>
      </g>
      {CONTACT.fiends.map(({ x, y }, i) => (
        <g key={x} data-fx={`fiend-${i}`} transform={place(x, y, -1, FOLK)}>
          <Fiend name={`fiend-body-${i}`} />
        </g>
      ))}
      {CONTACT.trees.map(({ x, y }, i) => (
        <g key={x} data-fx={`tree-${i}`} transform={place(x, y, 1, 0.6)}>
          <WalkingTree name={`tree-body-${i}`} />
        </g>
      ))}
      {Array.from({ length: CONTACT.wisps }, (_, i) => (
        <g key={i} data-fx={`wisp-at-${i}`}>
          <Wisp name={`wisp-${i}`} />
        </g>
      ))}
      <g data-fx="blast" opacity="0" transform={`translate(${CONTACT.giant.to} ${CONTACT.giant.y - 160})`}>
        <ellipse rx="220" ry="200" fill={REALM.spirit} opacity="0.5" />
        <ellipse rx="110" ry="100" fill={REALM.ash100} opacity="0.7" />
      </g>
      <HeroUnit x={CONTACT.him.x} y={CONTACT.him.y} scene={scene} />
    </>
  ),
  bind: (stage) => {
    const him = heroNodes(stage)
    const fires = CONTACT.camps.map((_, i) => fx(stage, `camp-${i}-fire`))
    const giant = fx(stage, 'giant')
    const golem = fx(stage, 'golem')
    const fiends = unitsOf(stage, 'fiend', CONTACT.fiends.length)
    const trees = unitsOf(stage, 'tree', CONTACT.trees.length)
    const roots = CONTACT.trees.map((_, i) => fx(stage, `tree-body-${i}-roots`))
    const wisps = Array.from({ length: CONTACT.wisps }, (_, i) => ({ at: fx(stage, `wisp-at-${i}`), body: fx(stage, `wisp-${i}`) }))
    const blast = fx(stage, 'blast')
    const scorch = fx(stage, 'scorch')
    const shoot = fx(stage, 'shoot')
    return (play) => {
      const fell = share(play, 0)
      const rose = share(play, 1)
      const sounded = share(play, 2)
      fires.forEach((fire, i) => fadeTo(fire, ramp(fell, 0.1 + i * 0.2, 0.4 + i * 0.2)))
      fadeTo(scorch, ramp(fell, 0.3, 1))
      // the host climbs; the trees walk into it and the fiends go down
      const climb = ramp(fell, 0, 1)
      const gone = ramp(sounded, 0.55, 0.85)
      const gx = lerp(CONTACT.giant.x, CONTACT.giant.to, climb)
      transformTo(giant, `${place(gx, CONTACT.giant.y, -1, 0.62)} translate(0 ${r1(hop(gx * 3) * 2 + 200 * gone * gone)}) rotate(${r1(-10 * gone)})`)
      fadeTo(giant, 1 - gone)
      transformTo(golem, golemAt(CONTACT.golem.x - 80 * climb, CONTACT.golem.y, 0.8, 70 * ramp(sounded, 0.6, 0.9)))
      fadeTo(golem, 1 - ramp(sounded, 0.7, 1))
      fiends.forEach((node, i) => {
        const { x, y } = CONTACT.fiends[i]
        const struck = ramp(rose, 0.5 + i * 0.12, 0.7 + i * 0.1)
        const fx0 = x - 100 * climb
        transformTo(node, `${place(fx0, y, -1, FOLK)} translate(0 ${r1(climb < 1 ? hop(fx0) : 0)}) ${felled(struck)}`)
      })
      trees.forEach((node, i) => {
        const { x, y, to } = CONTACT.trees[i]
        const walked = ramp(rose, 0.2 + i * 0.1, 0.9)
        transformTo(node, `${place(lerp(x, to, walked), y - 14 * ramp(rose, 0, 0.2), 1, 0.6)} rotate(${r1(4 * Math.sin(walked * 10))})`)
        transformTo(roots[i], `translate(0 ${r1(-10 * ramp(rose, 0, 0.2))}) rotate(${r1(10 * Math.sin(walked * 12))})`)
      })
      // the horn: the wisps leave the tree and pour onto the giant, and the light takes him
      wisps.forEach(({ at, body }, i) => {
        const flown = ramp(sounded, 0.15 + i * 0.05, 0.55 + i * 0.05)
        const from = { x: CONTACT.tree.x - 60 + 30 * i, y: CONTACT.tree.y - 280 - 20 * (i % 3) }
        const to = { x: CONTACT.giant.to - 30 + 12 * i, y: CONTACT.giant.y - 200 + 20 * i }
        transformTo(at, `translate(${r1(lerp(from.x, to.x, flown))} ${r1(lerp(from.y, to.y, flown) - 120 * Math.sin(Math.PI * flown))}) rotate(${r1(-20)})`)
        fadeTo(body, bell(flown, 0, 1))
      })
      fadeTo(blast, bell(sounded, 0.5, 0.95))
      fadeTo(shoot, ramp(sounded, 0.85, 1))
      const horn = ramp(sounded, 0, 0.15)
      poseHero(him, {
        x: CONTACT.him.x - 40 * ramp(fell, 0.2, 0.9),
        y: CONTACT.him.y,
        step: bell(fell, 0.2, 0.9) > 0 ? ramp(fell, 0.2, 0.9) * 3 : 0,
        shield: ARM.up * 0.9 * horn,
        horn,
        sword: ARM.guard * ramp(fell, 0, 0.3) * (1 - horn),
        lean: -8 * horn,
      })
    }
  },
}

const SCENES: Record<SceneId, SceneSpec> = { hero, about, work, tech, services, projects, ventures, bands, muayThai, contact }

// The cards a section counts, the shared count (stageItems): the record's facts and its achievements both.
const countOf = (slot: SectionSlot, labels: Labels, highlights: readonly string[]): number => {
  const { lead, count } = stageItems(slot, labels, highlights.length)
  return lead + count
}

export interface RealmScene extends TheatreScene {
  id: SceneId
  slot: SectionSlot | null
  /** The half the scene plays on from lg; the hero's cast stands under its own card. */
  side: Side | 'hero'
  profession: Profession
  /** This stage's hero is the world's figure (data-worlds-figure): the hero's only, the one on screen at first
   *  paint at every width. */
  figure: boolean
  /** Whether the page is read on a phone, where a scene too wide for half of it stands its cast another way. */
  phone: boolean
}

const sceneOf = (id: SceneId, slot: SectionSlot | null, side: Side | 'hero', count: number, profession: Profession, phone: boolean): RealmScene => {
  const spec = SCENES[id]
  const end = sceneEnd(spec.script)
  const scene: RealmScene = {
    id,
    slot,
    side,
    profession,
    count,
    figure: id === 'hero',
    phone,
    script: spec.script,
    bind: (stage) => {
      const write = spec.bind(stage, scene)
      return (_progress, _reached, play = end) => write(play)
    },
  }
  return scene
}

/** The side the scene at `index` among the sections after the hero plays on: the first right of its cards'
 *  column, the next left, and so on to the contact. */
export const sideAt = (index: number): Side => (index % 2 === 0 ? 'right' : 'left')

/** The page's scenes in order: the hero, the profession's sections, the contact. */
export function scenesOf(slots: readonly SectionSlot[], labels: Labels, highlights: readonly string[], profession: Profession, phone: boolean): RealmScene[] {
  return [
    sceneOf('hero', null, 'hero', 0, profession, phone),
    ...slots.map((slot, i) => sceneOf(slot.id, slot, sideAt(i), countOf(slot, labels, highlights), profession, phone)),
    sceneOf('contact', null, sideAt(slots.length), 0, profession, phone),
  ]
}

/** The lead a scene's band stands on: its phone lead on a phone, where it has one. */
const leadOf = ({ lead, phoneLead = lead }: SceneSpec, phone: boolean): number => (phone ? phoneLead : lead)

/** The band a scene's cast stands in (world.module.css), by its side. */
const BAND: Record<Side | 'hero', string> = { right: look.bandRight, left: look.bandLeft, hero: look.bandHero }

/** A scene's field: its cast in the 1920 by 1080 picture, cut from its foot to the screen, stood on its side. */
function Field({ scene }: { scene: RealmScene }) {
  return (
    <svg className="block h-full w-full" viewBox={`0 0 ${FIELD.width} ${FIELD.height}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <g className={BAND[scene.side]} style={{ '--lead': leadOf(SCENES[scene.id], scene.phone) } as CSSProperties}>
        <g transform={`translate(${ANCHOR[scene.side]} 0)`}>{SCENES[scene.id].figure(scene)}</g>
      </g>
    </svg>
  )
}

/** A scene's picture: its place's land under the vignette, then the field. */
export function RealmStage({ scene, settled = false }: { scene: RealmScene; settled?: boolean }) {
  return (
    <Stage
      scene={scene}
      motion={REALM_MOTION}
      settled={settled}
      className={look.stage}
      layers={[
        {
          name: 'land',
          node: (
            <>
              {SCENES[scene.id].land()}
              <div className={look.vignette} />
            </>
          ),
        },
        { name: 'figure', node: <Field scene={scene} /> },
      ]}
    />
  )
}
