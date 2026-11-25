'use client'

import type { ReactNode } from 'react'
import type { Labels } from '@/lib/cv/labels'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import { stageItems } from '@/lib/cv/stageItems'
import { sceneEnd, type Playhead, type SceneScript } from '@/lib/scroll/player'
import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, fx, lerp, r1, transformTo } from '@/components/themes/shared/stageNodes'
import { Stage } from '@/components/themes/shared/theatre/Stage'
import type { LayerMotions, TheatreScene } from '@/components/themes/shared/theatre/useTheatre'
import {
  Carter,
  Cart,
  ChantStone,
  CinderGiant,
  ClansFolk,
  DrumCart,
  ForestFolk,
  Guardian,
  Longship,
  Mage,
  Pedestal,
  Prince,
  Raider,
  Rider,
  Risen,
  SelectRing,
  Soldier,
  Spirit,
  Villager,
  WalkingTree,
  Warlord,
} from './folk'
import { ForestLand, GranaryLand, HallLand, IceLand, IslandLand, LastVillageLand, MountainLand, RiverCityLand, TowerCityLand, VillageLand } from './lands'
import { REALM } from './palette'
import { HAND_AT, HIP_AT, STAFF_AT, Warden, WARDEN_FEET } from './warden'
import look from './world.module.css'

type Realm = 'chaos' | 'frost'

// One war of the fantasy strategy game the world comes from, told in its campaign's order with him as the
// hero unit, a warden in a grey cloak, never the prince who falls: he warns the river kingdom's council and
// is sent away (hero), rallies a hill village against raiders (About), holds the last village until the
// riders come (Work), finds the plague in the grain carts and burns them (Tech Stack), refuses the prince's
// order to put a city to the sword and leads its well folk out (Services), leaves the cursed blade in the ice
// as its guardian warns (Projects), gets the mages out of their burning city (Ventures), drums the horned
// clans' shipwrights to their work as their island sinks (Bands), wrestles their corrupted warlord down until
// the forest folk cleanse him (Muay Thai), and sounds the horn at the great tree (contact). Each scene is a
// short script of one to three actions the shared scene player moves through (src/lib/scroll/player.ts), each
// at its own pace and never per card; every frame is a function of the playhead alone, so an action reads
// the same played backward, and the end frame is the one a scene drawn settled (reduced motion) shows.

export type SceneId = 'hero' | SectionId | 'contact'

/** The land pushes in across its scene, the field a little more than the land behind it. */
export const REALM_MOTION: LayerMotions = {
  land: { zoom: [1.0, 1.05], lift: [0, -1] },
  figure: { zoom: [1.02, 1.08], lift: [0, -2] },
}

// The field: a 1920 by 1080 picture cut to the screen from its foot, the units' feet on FLOOR. On a chaos stage
// they play right of the text column (about x 1050 to 1740, what a phone still sees of it), on a frost stage
// left of it (about 180 to 830); world.module.css moves both bands to the middle under 1024 px.
const FIELD = { width: 1920, height: 1080 }
const FLOOR = 1000

/** How far action `i` has played at `play`: all of it once a later one plays, `t` while it plays, none before. */
const share = ({ action, t }: Playhead, i: number): number => (action > i ? 1 : action === i ? t : 0)

/** A unit's feet at (x, y), facing right (1) or left (-1), at `size`. */
const place = (x: number, face: 1 | -1 = 1, y = FLOOR, size = 1): string => `translate(${r1(x)} ${r1(y)}) scale(${(face * size).toFixed(3)} ${size.toFixed(3)})`

/** The small hop of a walk, by how far the unit has walked. */
const hop = (walked: number): number => -3 * Math.abs(Math.sin(walked / 14))

/** The small people stand at this size beside him. */
const FOLK = 1.25

// ---- the warden ----

// His size on the field (his 200 by 320 drawing at 0.62 stands about 195 high), how far his legs swing in a
// stride, and the turns of his arms (a negative turn swings an arm forward and up).
const WARDEN_SCALE = 0.62
const LEG_SWING = 22
const ARM = { forward: -80, up: -165, point: -105, low: -40 }

interface WardenPose {
  x: number
  lift?: number
  face?: 1 | -1
  lean?: number
  staff?: number
  hand?: number
  /** The stride's phase, one step a unit; 0 stands. */
  step?: number
  torch?: number
  horn?: number
  ring?: number
  shown?: number
}

interface WardenNodes {
  root: Element | null
  staff: Element | null
  hand: Element | null
  front: Element | null
  back: Element | null
  torch: Element | null
  horn: Element | null
  ring: Element | null
}

const wardenNodes = (stage: ParentNode): WardenNodes => ({
  root: fx(stage, 'warden'),
  staff: fx(stage, 'warden-staff'),
  hand: fx(stage, 'warden-hand'),
  front: fx(stage, 'warden-leg-front'),
  back: fx(stage, 'warden-leg-back'),
  torch: fx(stage, 'warden-torch'),
  horn: fx(stage, 'warden-horn'),
  ring: fx(stage, 'warden-ring'),
})

const wardenAt = (x: number, lift = 0, face: 1 | -1 = 1, lean = 0): string =>
  `translate(${r1(x - face * WARDEN_FEET.x * WARDEN_SCALE)} ${r1(FLOOR - lift - WARDEN_FEET.y * WARDEN_SCALE)}) scale(${(face * WARDEN_SCALE).toFixed(3)} ${WARDEN_SCALE}) rotate(${r1(lean)} ${WARDEN_FEET.x} ${WARDEN_FEET.y})`

const turn = (deg: number, { x, y }: { x: number; y: number }): string => `rotate(${r1(deg)} ${x} ${y})`

const poseWarden = (nodes: WardenNodes, { x, lift = 0, face = 1, lean = 0, staff = 0, hand = 0, step = 0, torch = 0, horn = 0, ring = 1, shown = 1 }: WardenPose): void => {
  const swing = LEG_SWING * Math.sin(step * Math.PI)
  transformTo(nodes.root, wardenAt(x, lift + (step ? -hop(step * 14) : 0), face, lean))
  fadeTo(nodes.root, shown)
  transformTo(nodes.staff, turn(staff, STAFF_AT))
  transformTo(nodes.hand, turn(hand, HAND_AT))
  transformTo(nodes.front, turn(-swing, HIP_AT))
  transformTo(nodes.back, turn(swing, HIP_AT))
  fadeTo(nodes.torch, torch)
  fadeTo(nodes.horn, horn)
  transformTo(nodes.ring, place(x, 1, FLOOR - lift))
  fadeTo(nodes.ring, ring * shown)
}

/** Him, the hero unit, and his ring under him. */
function WardenUnit({ x, profession, figure = false }: { x: number; profession: Profession; figure?: boolean }) {
  return (
    <>
      <g data-fx="warden-ring" transform={place(x)}>
        <SelectRing name="warden-ring-mark" rx={70} />
      </g>
      <g data-fx="warden" transform={wardenAt(x)}>
        <Warden profession={profession} figure={figure} />
      </g>
    </>
  )
}

/** A small unit's tool arm, turning about the shoulder they share (folk.tsx). */
const SHOULDER = { x: 15, y: -46 }
const swingArm = (arm: Element | null, angle: number): void => transformTo(arm, turn(angle, SHOULDER))

/** A group of small units marked `${prefix}-i`, found once. */
const unitsOf = (stage: ParentNode, prefix: string, count: number): Array<Element | null> => Array.from({ length: count }, (_, i) => fx(stage, `${prefix}-${i}`))

// ---- the scenes ----

/** A scene's writer: the frame at the playhead. The land's push in is the theatre's own. */
type SceneWriter = (play: Playhead) => void

interface SceneSpec {
  realm: Realm
  land: () => ReactNode
  script: SceneScript
  figure: (scene: RealmScene) => ReactNode
  bind: (stage: HTMLElement, scene: RealmScene) => SceneWriter
}

// The hero, the warning: the river kingdom's council hall, rain at its tall windows, the king on his throne
// and his council round the map table. He lays his hand on the map's north and points with his staff where
// the danger comes from; the king waves him off and a guard steps forward; he turns and walks out, and stands
// on the steps outside in the rain, the hall's doors shut behind him.
const HERO = { warden: 1130, table: 1330, council: [1450, 1520] as const, king: 1650, guard: { from: 1720, to: 1420 }, door: 1060, steps: 1230 }

function MapTable() {
  return (
    <g>
      <rect x={-110} y={-70} width={220} height={14} fill={REALM.ember23} />
      <path d="M-100 -56 V0 M100 -56 V0" stroke={REALM.ember16} strokeWidth="10" />
      <path d="M-96 -82 L96 -82 L104 -70 L-104 -70 Z" fill={REALM.riverCream} />
      <path d="M-70 -76 Q-30 -82 0 -74 T60 -78 M30 -80 L40 -72" stroke={REALM.riverBlue} strokeWidth="3" fill="none" />
      <path d="M-20 -82 L-14 -90 L-8 -82" fill={REALM.blood33} />
    </g>
  )
}

function Throne() {
  return (
    <g>
      <path d="M-40 0 V-150 Q0 -190 40 -150 V0 Z" fill={REALM.riverBlue} stroke={REALM.goldMid} strokeWidth="4" />
      <rect x={-48} y={-60} width={96} height={20} fill={REALM.goldDark} />
      <g transform={`translate(0 -40) scale(${FOLK})`}>
        <path d="M-16,-50 L16,-50 L20,0 L-20,0 Z" fill={REALM.warlordRed} />
        <circle cx={0} cy={-60} r={11} fill={REALM.ember64} />
        <path d="M-11,-68 L-7,-76 L-3,-68 L1,-77 L5,-68 L9,-76 L11,-66 Z" fill={REALM.princeGold} />
        <path d="M-10,-52 Q0,-40 10,-52" fill={REALM.riverCream} />
        <g data-fx="king-arm">
          <rect x={12} y={-48} width={7} height={22} rx={3} fill={REALM.warlordRed} />
        </g>
      </g>
    </g>
  )
}

const hero: SceneSpec = {
  realm: 'chaos',
  land: () => <HallLand />,
  script: [1500, 1500, 1900],
  figure: (scene) => (
    <>
      <g data-fx="inside">
        <g transform={place(HERO.king)}>
          <Throne />
        </g>
        {HERO.council.map((x, i) => (
          <g key={x} data-fx={`council-${i}`} transform={place(x, -1, FLOOR, FOLK)}>
            <Villager name={`councillor-${i}`} tint={i + 1} />
          </g>
        ))}
        <g transform={place(HERO.table)}>
          <MapTable />
        </g>
        <g data-fx="guard" transform={place(HERO.guard.from, -1, FLOOR, FOLK)}>
          <Soldier name="guard-body" />
        </g>
      </g>
      <WardenUnit x={HERO.warden} profession={scene.profession} figure={scene.figure} />
    </>
  ),
  bind: (stage) => {
    const warden = wardenNodes(stage)
    const inside = fx(stage, 'inside')
    const outside = fx(stage, 'outside')
    const kingArm = fx(stage, 'king-arm')
    const guard = fx(stage, 'guard')
    const council = unitsOf(stage, 'council', HERO.council.length)
    return (play) => {
      const pointed = share(play, 0)
      const dismissed = share(play, 1)
      const left = share(play, 2)
      // the king's wave, the council turning their backs, the guard coming on
      swingArm(kingArm, -100 * bell(dismissed, 0, 0.6) * (1 + 0.3 * Math.sin(dismissed * 30)))
      council.forEach((node, i) => transformTo(node, place(HERO.council[i], ramp(dismissed, 0.2 + i * 0.1, 0.4 + i * 0.1) > 0.5 ? 1 : -1, FLOOR, FOLK)))
      const guardX = lerp(HERO.guard.from, HERO.guard.to, ramp(dismissed, 0.3, 1))
      transformTo(guard, `${place(guardX, -1, FLOOR, FOLK)} translate(0 ${r1(hop(guardX))})`)
      // out of the hall: the picture cuts to the steps in the rain halfway through his walk
      const cut = ramp(left, 0.45, 0.6)
      fadeTo(inside, 1 - cut)
      fadeTo(outside, cut)
      if (left > 0) {
        const walkOut = ramp(left, 0, 0.5)
        const downSteps = ramp(left, 0.6, 1)
        const x = left < 0.52 ? lerp(HERO.warden, HERO.door, walkOut) : lerp(HERO.steps + 60, HERO.steps, downSteps)
        poseWarden(warden, { x, face: left < 0.52 ? -1 : 1, step: walkOut < 1 ? walkOut * 4 : downSteps < 1 ? downSteps * 2 : 0, shown: 1 - bell(left, 0.42, 0.62), lift: left < 0.52 ? 0 : 40 * (1 - downSteps) })
        return
      }
      const reach = ramp(pointed, 0, 0.35)
      const point = ramp(pointed, 0.4, 0.7) * (1 - ramp(dismissed, 0, 0.4))
      poseWarden(warden, { x: lerp(HERO.warden, HERO.warden + 40, reach), step: reach < 1 ? reach * 2 : 0, hand: ARM.forward * 0.8 * reach * (1 - ramp(dismissed, 0, 0.3)), staff: ARM.point * point, lean: 6 * reach * (1 - ramp(dismissed, 0, 0.3)) })
    }
  },
}

// About, the first fight: a hill village behind its wooden wall, raiders with torches coming up the field. He
// raises his staff and the villagers run to bar the gate; then he leads them out of it and the raiders scatter
// into the trees. The end frame is the gate open, villagers on the wall and the field clear.
const ABOUT = { warden: 1100, gate: 1540, wall: [1440, 1640] as const, onWall: [1440, 1650] as const, rally: [{ from: 1200, to: 1500 }, { from: 1260, to: 1580 }], raiders: [1700, 1760, 1820] as const, out: 1600 }

function Palisade() {
  return (
    <g>
      {Array.from({ length: 12 }, (_, i) => ABOUT.wall[0] - 60 + i * 26).map((x) =>
        x > ABOUT.gate - 50 && x < ABOUT.gate + 40 ? null : <path key={x} d={`M${x - 10} ${FLOOR} V${FLOOR - 140} L${x} ${FLOOR - 160} L${x + 10} ${FLOOR - 140} V${FLOOR} Z`} fill={REALM.ember23} stroke={REALM.ember16} strokeWidth="3" />,
      )}
      <rect x={ABOUT.wall[0] - 70} y={FLOOR - 100} width={ABOUT.wall[1] - ABOUT.wall[0] + 140} height={10} fill={REALM.ember16} />
      {[-1, 1].map((side) => (
        <g key={side} data-fx={`gate-${side < 0 ? 'left' : 'right'}`}>
          <rect x={side < 0 ? ABOUT.gate - 50 : ABOUT.gate} y={FLOOR - 130} width={45} height={130} fill={REALM.ember27} stroke={REALM.ember16} strokeWidth="3" />
        </g>
      ))}
      <rect data-fx="bar" x={ABOUT.gate - 56} y={FLOOR - 76} width={100} height={12} fill={REALM.ember16} opacity="0" />
    </g>
  )
}

const about: SceneSpec = {
  realm: 'chaos',
  land: () => <VillageLand />,
  script: [1600, 2200],
  figure: (scene) => (
    <>
      <Palisade />
      {ABOUT.onWall.map((x, i) => (
        <g key={x} transform={place(x, 1, FLOOR - 100, FOLK)}>
          <Villager name={`wall-${i}`} armed tint={i} />
        </g>
      ))}
      {ABOUT.raiders.map((x, i) => (
        <g key={x} data-fx={`raider-${i}`} transform={place(x, -1, FLOOR, FOLK)}>
          <Raider name={`raider-body-${i}`} />
        </g>
      ))}
      {ABOUT.rally.map(({ from }, i) => (
        <g key={from} data-fx={`rally-${i}`} transform={place(from, 1, FLOOR, FOLK)}>
          <Villager name={`rally-body-${i}`} armed tint={i + 1} />
        </g>
      ))}
      <WardenUnit x={ABOUT.warden} profession={scene.profession} figure={scene.figure} />
    </>
  ),
  bind: (stage) => {
    const warden = wardenNodes(stage)
    const rally = unitsOf(stage, 'rally', ABOUT.rally.length)
    const raiders = unitsOf(stage, 'raider', ABOUT.raiders.length)
    const gateLeft = fx(stage, 'gate-left')
    const gateRight = fx(stage, 'gate-right')
    const bar = fx(stage, 'bar')
    return (play) => {
      const rallied = share(play, 0)
      const charged = share(play, 1)
      // the villagers run to the gate and bar it; then it swings open and they go out after him
      const ran = ramp(rallied, 0.2, 0.8)
      const out = ramp(charged, 0.2, 1)
      rally.forEach((node, i) => {
        const { from, to } = ABOUT.rally[i]
        const x = lerp(from, to, ran) + (ABOUT.out + 70 * i - to) * out
        transformTo(node, `${place(x, 1, FLOOR, FOLK)} translate(0 ${r1(hop(x))})`)
      })
      const open = ramp(charged, 0, 0.2)
      fadeTo(bar, ramp(rallied, 0.75, 0.9) * (1 - open))
      transformTo(gateLeft, `translate(${ABOUT.gate - 50} 0) scale(${(1 - 0.8 * open).toFixed(3)} 1) translate(${-(ABOUT.gate - 50)} 0)`)
      transformTo(gateRight, `translate(${ABOUT.gate + 45} 0) scale(${(1 - 0.8 * open).toFixed(3)} 1) translate(${-(ABOUT.gate + 45)} 0)`)
      // the raiders creep up the field, then turn and run into the trees
      const fled = ramp(charged, 0.3, 0.9)
      raiders.forEach((node, i) => {
        const x = ABOUT.raiders[i] - 30 * rallied + 260 * fled
        transformTo(node, `${place(x, fled > 0 ? 1 : -1, FLOOR, FOLK)} translate(0 ${r1(hop(x))})`)
        fadeTo(node, 1 - ramp(fled, 0.6, 1))
      })
      const walked = ramp(charged, 0.15, 0.9)
      poseWarden(warden, { x: lerp(ABOUT.warden, ABOUT.out - 80, walked), staff: ARM.up * ramp(rallied, 0, 0.3) * (1 - ramp(charged, 0, 0.3)) + ARM.point * bell(charged, 0.2, 1), step: walked > 0 && walked < 1 ? walked * 5 : 0 })
    }
  },
}

// Work, time as the enemy: the last village on the road at night, a barricade of carts and beams. He turns
// the hourglass on its post; he holds the barricade with his staff as the risen come in waves out of the dark;
// as the last sand falls the kingdom's riders crest the hill and ride down into the square, and the risen
// fall. The end frame is the riders in the square and the barricade standing.
const WORK = { warden: 1120, glass: 1190, barricade: 1400, hold: 1310, risen: [1560, 1640, 1720, 1800] as const, riders: [{ from: 1900, to: 1560 }, { from: 1980, to: 1660 }] }

function Hourglass() {
  return (
    <g>
      <rect x={-5} y={-120} width={10} height={120} fill={REALM.ember16} />
      <g data-fx="glass" transform="translate(0 -150)">
        <path d="M-20 -32 H20 M-20 32 H20" stroke={REALM.ember21} strokeWidth="6" />
        <path d="M-16 -30 L16 -30 L2 0 L16 30 L-16 30 L-2 0 Z" fill={REALM.frost81} opacity="0.35" stroke={REALM.riverCream} strokeWidth="2" />
        <path data-fx="sand-top" d="M-14 -28 L14 -28 L1 -2 L-1 -2 Z" fill={REALM.goldMid} />
        <path data-fx="sand-foot" d="M-14 28 L14 28 L1 2 L-1 2 Z" fill={REALM.goldMid} />
      </g>
    </g>
  )
}

function Barricade() {
  return (
    <g>
      <path d="M-80 0 L-50 -90 L-40 -86 L-66 0 Z M60 0 L30 -96 L42 -100 L76 0 Z" fill={REALM.ember23} stroke={REALM.ember13} strokeWidth="3" />
      <rect x={-90} y={-70} width={180} height={50} rx={6} fill={REALM.ember27} stroke={REALM.ember13} strokeWidth="3" />
      <path d="M-100 -96 L100 -40" stroke={REALM.ember21} strokeWidth="14" />
      {[-60, 60].map((x) => (
        <circle key={x} cx={x} cy={-16} r={18} fill="none" stroke={REALM.ember13} strokeWidth="6" />
      ))}
    </g>
  )
}

const work: SceneSpec = {
  realm: 'chaos',
  land: () => <LastVillageLand />,
  script: [1300, 2000, 1700],
  figure: (scene) => (
    <>
      <g transform={place(WORK.glass)}>
        <Hourglass />
      </g>
      {WORK.risen.map((x, i) => (
        <g key={x} data-fx={`risen-${i}`} transform={place(x, -1, FLOOR, FOLK)}>
          <Risen name={`risen-body-${i}`} />
        </g>
      ))}
      <g transform={place(WORK.barricade)}>
        <Barricade />
      </g>
      {WORK.riders.map(({ from }, i) => (
        <g key={from} data-fx={`rider-${i}`} transform={place(from, -1, FLOOR - 200)}>
          <Rider name={`rider-body-${i}`} />
        </g>
      ))}
      <WardenUnit x={WORK.warden} profession={scene.profession} figure={scene.figure} />
    </>
  ),
  bind: (stage) => {
    const warden = wardenNodes(stage)
    const glass = fx(stage, 'glass')
    const top = fx(stage, 'sand-top')
    const foot = fx(stage, 'sand-foot')
    const risen = unitsOf(stage, 'risen', WORK.risen.length)
    const riders = unitsOf(stage, 'rider', WORK.riders.length)
    return (play) => {
      const turned = share(play, 0)
      const held = share(play, 1)
      const arrived = share(play, 2)
      // the glass turns over, then its sand runs down over the hold and the arrival
      transformTo(glass, `translate(0 -150) rotate(${r1(180 * ramp(turned, 0.3, 0.8))})`)
      const run = (held + arrived) / 2
      transformTo(top, `scale(1 ${(1 - run).toFixed(3)})`)
      transformTo(foot, `scale(1 ${(0.2 + 0.8 * run).toFixed(3)})`)
      // the risen come in two waves against the barricade and are pushed back; then they fall
      const fallen = ramp(arrived, 0.5, 0.9)
      risen.forEach((node, i) => {
        const wave = i < 2 ? ramp(held, 0, 0.45) - 0.5 * ramp(held, 0.45, 0.6) : ramp(held, 0.5, 0.95)
        const x = WORK.risen[i] - (WORK.risen[i] - WORK.barricade - 90 - 40 * i) * wave
        transformTo(node, `${place(x, -1, FLOOR, FOLK)} rotate(${r1(-80 * fallen)})`)
        fadeTo(node, 1 - ramp(fallen, 0.6, 1))
      })
      // the riders crest the hill and ride down into the square
      riders.forEach((node, i) => {
        const { from, to } = WORK.riders[i]
        const rode = ramp(arrived, 0.1 + i * 0.1, 0.7 + i * 0.1)
        const x = lerp(from, to, rode)
        transformTo(node, `${place(x, -1, lerp(FLOOR - 200, FLOOR, rode))} translate(0 ${r1(hop(x * 2))})`)
        fadeTo(node, ramp(arrived, 0, 0.15))
      })
      const toHold = ramp(held, 0, 0.25)
      const brace = ramp(held, 0.2, 0.35)
      const push = bell(held, 0.4, 0.6)
      poseWarden(warden, {
        x: lerp(WORK.warden, WORK.hold, toHold) + 14 * push,
        step: toHold > 0 && toHold < 1 ? toHold * 3 : 0,
        hand: ARM.forward * bell(turned, 0, 0.9),
        staff: ARM.forward * brace * (1 - ramp(arrived, 0.6, 1)) + ARM.up * ramp(arrived, 0.7, 1) * 0.6,
        lean: 8 * brace * (1 - ramp(arrived, 0.6, 1)),
      })
    }
  },
}

// The Tech Stack, the plague: the granary at the river bridge, the grain carts lined up to cross. He slits a
// sack with his staff's end and green dust spills out of it; then he throws his torch onto the carts before
// they can cross, and their carters run. The end frame is the carts burning on the near bank and the bridge
// empty.
const TECH = { warden: 1110, carts: [1330, 1540] as const, carters: [1420, 1630] as const, flee: 280 }

const tech: SceneSpec = {
  realm: 'chaos',
  land: () => <GranaryLand />,
  script: [1500, 2000],
  figure: (scene) => (
    <>
      {TECH.carts.map((x, i) => (
        <g key={x} transform={place(x)}>
          <Cart name={`cart-${i}`} />
        </g>
      ))}
      {TECH.carters.map((x, i) => (
        <g key={x} data-fx={`carter-${i}`} transform={place(x, 1, FLOOR, FOLK)}>
          <Carter name={`carter-body-${i}`} />
        </g>
      ))}
      <g data-fx="thrown" opacity="0">
        <rect x={-3} y={-30} width={6} height={30} fill={REALM.staff} />
        <path d="M-8 -30 Q0 -56 8 -30 Z" fill={REALM.chaosFireMid} />
      </g>
      <WardenUnit x={TECH.warden} profession={scene.profession} figure={scene.figure} />
    </>
  ),
  bind: (stage) => {
    const warden = wardenNodes(stage)
    const dust = fx(stage, 'cart-0-dust')
    const fires = TECH.carts.map((_, i) => fx(stage, `cart-${i}-fire`))
    const carters = unitsOf(stage, 'carter', TECH.carters.length)
    const thrown = fx(stage, 'thrown')
    return (play) => {
      const cut = share(play, 0)
      const burnt = share(play, 1)
      const step = ramp(cut, 0, 0.3)
      fadeTo(dust, ramp(cut, 0.45, 0.7))
      // the torch flies in an arc from his hand to the carts, and they catch one after the other
      const flight = ramp(burnt, 0.3, 0.55)
      const from = { x: TECH.warden + 100, y: FLOOR - 170 }
      const to = { x: TECH.carts[0], y: FLOOR - 80 }
      transformTo(thrown, `translate(${r1(lerp(from.x, to.x, flight))} ${r1(lerp(from.y, to.y, flight) - 160 * Math.sin(Math.PI * flight))}) rotate(${r1(360 * flight)})`)
      fadeTo(thrown, flight > 0 && flight < 1 ? 1 : 0)
      fires.forEach((fire, i) => fadeTo(fire, ramp(burnt, 0.55 + i * 0.12, 0.7 + i * 0.12)))
      const ran = ramp(burnt, 0.6, 1)
      carters.forEach((node, i) => {
        const x = TECH.carters[i] + TECH.flee * ran
        transformTo(node, `${place(x, 1, FLOOR, FOLK)} translate(0 ${r1(hop(x))})`)
        fadeTo(node, 1 - ramp(ran, 0.7, 1))
      })
      poseWarden(warden, {
        x: TECH.warden + 90 * step,
        step: step > 0 && step < 1 ? step * 2 : 0,
        staff: ARM.forward * bell(cut, 0.3, 0.8),
        lean: 6 * bell(cut, 0.3, 0.8),
        hand: ARM.up * ramp(burnt, 0, 0.3) * (1 - ramp(burnt, 0.3, 0.5)) + ARM.low * ramp(burnt, 0.3, 0.45) * (1 - ramp(burnt, 0.6, 0.9)),
        torch: ramp(burnt, 0, 0.1) * (1 - ramp(burnt, 0.3, 0.32)),
      })
    }
  },
}

// Services, the refusal: the walled river city at dusk, smoke over its roofs. The young prince, our own, seen
// at a distance by the city's gate, points his soldiers at it and they march in; the warden plants his staff
// and does not move; then he leads the well townsfolk out by the side gate onto the road. The end frame is
// the line of townsfolk on the road, the city's smoke behind, and the prince alone at the gate.
const SERVICES = { warden: 1180, prince: 1620, soldiers: [1680, 1730, 1780] as const, gate: 1700, sideGate: 1380, folk: [1380, 1380, 1380, 1380] as const, road: 1080, far: { y: FLOOR - 70, size: 0.8 } }

function CityGates() {
  return (
    <g>
      <path d={`M${SERVICES.sideGate - 130} ${FLOOR} V${FLOOR - 220} H${SERVICES.gate + 160} V${FLOOR} Z`} fill={REALM.stone15} stroke={REALM.stone8} strokeWidth="4" />
      <path d={`M${SERVICES.gate - 60} ${FLOOR} V${FLOOR - 140} Q${SERVICES.gate} ${FLOOR - 210} ${SERVICES.gate + 60} ${FLOOR - 140} V${FLOOR} Z`} fill={REALM.bgDeep} />
      <path d={`M${SERVICES.sideGate - 34} ${FLOOR} V${FLOOR - 90} Q${SERVICES.sideGate} ${FLOOR - 124} ${SERVICES.sideGate + 34} ${FLOOR - 90} V${FLOOR} Z`} fill={REALM.bgDeep} />
      <g data-fx="side-door">
        <path d={`M${SERVICES.sideGate - 34} ${FLOOR} V${FLOOR - 90} Q${SERVICES.sideGate} ${FLOOR - 124} ${SERVICES.sideGate + 34} ${FLOOR - 90} V${FLOOR} Z`} fill={REALM.ember23} stroke={REALM.ember13} strokeWidth="3" />
      </g>
    </g>
  )
}

const services: SceneSpec = {
  realm: 'chaos',
  land: () => <RiverCityLand />,
  script: [1500, 1300, 2200],
  figure: (scene) => (
    <>
      <CityGates />
      {SERVICES.soldiers.map((x, i) => (
        <g key={x} data-fx={`soldier-${i}`} transform={place(x, -1, SERVICES.far.y, SERVICES.far.size)}>
          <Soldier name={`soldier-body-${i}`} />
        </g>
      ))}
      <g transform={place(SERVICES.prince, -1, SERVICES.far.y, SERVICES.far.size)}>
        <Prince name="prince" />
      </g>
      {SERVICES.folk.map((x, i) => (
        <g key={i} data-fx={`folk-${i}`} transform={place(x, -1, FLOOR, FOLK)} opacity="0">
          <Villager name={`folk-body-${i}`} tint={i} />
        </g>
      ))}
      <g data-fx="planted" opacity="0">
        <ellipse cx={SERVICES.warden + 50} cy={FLOOR} rx={36} ry={8} fill={REALM.earth36} />
      </g>
      <WardenUnit x={SERVICES.warden} profession={scene.profession} figure={scene.figure} />
    </>
  ),
  bind: (stage) => {
    const warden = wardenNodes(stage)
    const princeArm = fx(stage, 'prince-arm')
    const soldiers = unitsOf(stage, 'soldier', SERVICES.soldiers.length)
    const folk = unitsOf(stage, 'folk', SERVICES.folk.length)
    const door = fx(stage, 'side-door')
    const planted = fx(stage, 'planted')
    return (play) => {
      const ordered = share(play, 0)
      const refused = share(play, 1)
      const led = share(play, 2)
      swingArm(princeArm, -110 * ramp(ordered, 0, 0.3) * (1 - ramp(led, 0.6, 1)))
      // his soldiers march in through the gate, gone into the smoke
      const marched = ramp(ordered, 0.3, 1)
      soldiers.forEach((node, i) => {
        const x = lerp(SERVICES.soldiers[i], SERVICES.gate, marched)
        transformTo(node, `${place(x, -1, SERVICES.far.y, SERVICES.far.size)} translate(0 ${r1(hop(x))})`)
        fadeTo(node, 1 - ramp(marched, 0.5 + i * 0.1, 0.8 + i * 0.07))
      })
      fadeTo(planted, ramp(refused, 0.3, 0.5))
      // the side gate opens and the well folk come out after him onto the road, one after another
      const open = ramp(led, 0, 0.2)
      transformTo(door, `translate(${SERVICES.sideGate + 34} 0) scale(${(1 - 0.85 * open).toFixed(3)} 1) translate(${-(SERVICES.sideGate + 34)} 0)`)
      folk.forEach((node, i) => {
        const came = ramp(led, 0.15 + i * 0.12, 0.65 + i * 0.1)
        const x = lerp(SERVICES.sideGate, SERVICES.road + 120 + 80 * i, came)
        transformTo(node, `${place(x, -1, FLOOR, FOLK)} translate(0 ${r1(hop(x))})`)
        fadeTo(node, ramp(came, 0, 0.1))
      })
      const walk = ramp(led, 0.2, 0.9)
      poseWarden(warden, {
        x: lerp(SERVICES.warden, SERVICES.road, walk),
        face: led > 0.15 ? -1 : 1,
        step: walk > 0 && walk < 1 ? walk * 5 : 0,
        staff: ARM.low * ramp(refused, 0, 0.3) * (1 - ramp(led, 0.1, 0.25)) + ARM.forward * 0.3 * ramp(led, 0.2, 0.3),
        hand: ARM.forward * 0.6 * bell(led, 0.1, 0.4),
      })
    }
  },
}

// Projects, the temptation turned down: the ice shelf of the frozen north, a stair cut into the ice up to a
// cursed blade standing in its pedestal. He climbs the stair; the stone guardian beside the blade lifts its
// hand in warning and crumbles still warning; he leaves the blade where it stands and walks back down. The
// end frame is the blade in its pedestal and his footprints going down.
const PROJECTS = { warden: 240, stair: { from: 330, run: 46, rise: 38, steps: 4 }, top: 560, pedestal: 660, guardian: 760 }
const stairTop = PROJECTS.stair.rise * PROJECTS.stair.steps

/** His height on the stair at x: a step's rise for each step's run climbed. */
const onStair = (x: number): number => {
  const { from, run, rise, steps } = PROJECTS.stair
  return rise * Math.max(0, Math.min(steps, Math.floor((x - from) / run) + 1))
}

function IceStair() {
  const { from, run, rise, steps } = PROJECTS.stair
  return (
    <g>
      <path d={`M${from + steps * run} ${FLOOR} V${FLOOR - stairTop} H${PROJECTS.guardian + 120} V${FLOOR} Z`} fill={REALM.frostIceDark} stroke={REALM.frostIceMid} strokeWidth="3" />
      {Array.from({ length: steps }, (_, i) => (
        <rect key={i} x={from + i * run} y={FLOOR - (i + 1) * rise} width={(steps - i) * run} height={rise} fill={REALM.frostIceMid} stroke={REALM.frostIceDark} strokeWidth="2" />
      ))}
      {Array.from({ length: steps }, (_, i) => (
        <ellipse key={`print-${i}`} data-fx={`print-${i}`} cx={from + i * run + 22} cy={FLOOR - (i + 1) * rise + 4} rx={9} ry={3} fill={REALM.night14} opacity="0" />
      ))}
    </g>
  )
}

const projects: SceneSpec = {
  realm: 'frost',
  land: () => <IceLand />,
  script: [1600, 1800, 1600],
  figure: (scene) => (
    <>
      <IceStair />
      <g data-fx="guardian-place" transform={place(PROJECTS.guardian, -1, FLOOR - stairTop)}>
        <Guardian name="guardian" />
      </g>
      <g transform={place(PROJECTS.pedestal, 1, FLOOR - stairTop)}>
        <Pedestal name="blade" />
      </g>
      <WardenUnit x={PROJECTS.warden} profession={scene.profession} figure={scene.figure} />
    </>
  ),
  bind: (stage) => {
    const warden = wardenNodes(stage)
    const arm = fx(stage, 'guardian-arm')
    const blocks = unitsOf(stage, 'guardian-block', 5)
    const glow = fx(stage, 'blade-glow')
    const prints = unitsOf(stage, 'print', PROJECTS.stair.steps)
    return (play) => {
      const climbed = share(play, 0)
      const warned = share(play, 1)
      const turned = share(play, 2)
      // its warning hand rises, then it falls apart block by block, the hand going last
      transformTo(arm, `rotate(${r1(-40 * ramp(warned, 0, 0.35))} 40 -246) translate(0 ${r1(260 * ramp(warned, 0.75, 1))})`)
      fadeTo(arm, 1 - ramp(warned, 0.85, 1))
      blocks.forEach((block, i) => {
        const fall = ramp(warned, 0.4 + i * 0.07, 0.6 + i * 0.07)
        transformTo(block, `translate(${r1((i - 2) * 30 * fall)} ${r1(200 * fall * fall)}) rotate(${r1((i % 2 ? 1 : -1) * 30 * fall)})`)
        fadeTo(block, 1 - ramp(fall, 0.7, 1))
      })
      fadeTo(glow, 0.25 + 0.3 * bell(climbed, 0.5, 1) + 0.2 * bell(warned, 0, 0.5))
      // up the stair, then back down it leaving his prints
      const up = ramp(climbed, 0, 0.9)
      const down = ramp(turned, 0.15, 1)
      const x = turned > 0 ? lerp(PROJECTS.top, PROJECTS.warden, down) : lerp(PROJECTS.warden, PROJECTS.top, up)
      prints.forEach((print, i) => fadeTo(print, ramp(down, 1 - (i + 1) / PROJECTS.stair.steps, 1 - (i + 0.5) / PROJECTS.stair.steps + 0.1)))
      poseWarden(warden, {
        x,
        lift: onStair(x),
        face: turned > 0.1 ? -1 : 1,
        step: (up > 0 && up < 1 && turned === 0) || (down > 0 && down < 1) ? (turned > 0 ? down : up) * 6 : 0,
        hand: ARM.forward * 0.5 * bell(warned, 0.05, 0.6),
        lean: -4 * bell(warned, 0, 0.6),
      })
    }
  },
}

// Ventures, a loss he cannot stop and a rescue inside it: the mages' tower city, a ring of chanting stones
// outside its walls. He strikes one of the stones and it cracks; the sky tears anyway and a burning hand
// reaches down through it, and the towers catch fire; he opens the mages' gate of light and leads them
// through it. The end frame is the gate closing on its light, him beside it, the towers burning behind.
const VENTURES = { warden: 470, stones: [560, 660, 760] as const, gate: 260, mages: [330, 390, 450] as const, tear: { x: 640, y: 300 } }

function SkyTear() {
  return (
    <g transform={`translate(${VENTURES.tear.x} ${VENTURES.tear.y})`}>
      <g data-fx="tear" opacity="0">
        <path d="M-120 -20 L-60 -60 L-20 -10 L40 -70 L90 -20 L140 -50 L100 30 L40 0 L-10 50 L-70 10 Z" fill={REALM.cinderGlow} opacity="0.8" />
        <path d="M-90 -10 L-50 -40 L-10 0 L40 -50 L80 -10 L60 20 L10 0 L-40 30 Z" fill={REALM.chaosFireCore} />
      </g>
      <g data-fx="hand" opacity="0">
        <path d="M-40 0 L-30 200 L30 200 L40 0 Z" fill={REALM.cinder} />
        <path d="M-50 190 L-70 290 M-26 200 L-34 310 M0 200 L0 316 M26 200 L36 306 M50 190 L80 270" stroke={REALM.cinder} strokeWidth="22" strokeLinecap="round" />
        <path d="M-10 40 L10 120 L-6 170" stroke={REALM.cinderGlow} strokeWidth="6" fill="none" />
      </g>
    </g>
  )
}

function LightGate() {
  return (
    <g data-fx="gate" transform="scale(0 1)">
      <ellipse cx={0} cy={-120} rx={70} ry={130} fill={REALM.gateLight} opacity="0.4" />
      <ellipse cx={0} cy={-120} rx={50} ry={110} fill={REALM.gateLight} opacity="0.8" />
      <ellipse cx={0} cy={-120} rx={22} ry={80} fill={REALM.ash100} />
    </g>
  )
}

const ventures: SceneSpec = {
  realm: 'frost',
  land: () => <TowerCityLand />,
  script: [1300, 1800, 1900],
  figure: (scene) => (
    <>
      <SkyTear />
      {VENTURES.stones.map((x, i) => (
        <g key={x} transform={place(x)}>
          <ChantStone name={`stone-${i}`} />
        </g>
      ))}
      <g transform={place(VENTURES.gate)}>
        <LightGate />
      </g>
      {VENTURES.mages.map((x, i) => (
        <g key={x} data-fx={`mage-${i}`} transform={place(x, -1, FLOOR, FOLK)}>
          <Mage name={`mage-body-${i}`} />
        </g>
      ))}
      <WardenUnit x={VENTURES.warden} profession={scene.profession} figure={scene.figure} />
    </>
  ),
  bind: (stage) => {
    const warden = wardenNodes(stage)
    const crack = fx(stage, 'stone-0-crack')
    const runes = VENTURES.stones.map((_, i) => fx(stage, `stone-${i}-runes`))
    const tear = fx(stage, 'tear')
    const hand = fx(stage, 'hand')
    const gate = fx(stage, 'gate')
    const mages = unitsOf(stage, 'mage', VENTURES.mages.length)
    const burns = [180, 330, 480, 640, 790].map((x) => fx(stage, `burn-${x}`))
    return (play) => {
      const struck = share(play, 0)
      const torn = share(play, 1)
      const through = share(play, 2)
      fadeTo(crack, ramp(struck, 0.5, 0.6))
      runes.forEach((node, i) => fadeTo(node, (i === 0 ? 1 - 0.7 * ramp(struck, 0.5, 0.7) : 1) * (1 - 0.6 * ramp(torn, 0.6, 1))))
      fadeTo(tear, ramp(torn, 0, 0.25))
      transformTo(tear, `scale(${(0.3 + 0.7 * ramp(torn, 0, 0.3)).toFixed(3)})`)
      fadeTo(hand, ramp(torn, 0.2, 0.35))
      transformTo(hand, `translate(0 ${r1(-200 + 200 * ramp(torn, 0.2, 0.7))})`)
      burns.forEach((node, i) => fadeTo(node, ramp(torn, 0.5 + i * 0.08, 0.65 + i * 0.08)))
      // the gate of light opens, the mages walk into it and are gone, and it narrows as it closes
      const open = ramp(through, 0, 0.25)
      const closing = ramp(through, 0.8, 1)
      transformTo(gate, `scale(${(open * (1 - 0.7 * closing)).toFixed(3)} 1)`)
      mages.forEach((node, i) => {
        const went = ramp(through, 0.25 + i * 0.12, 0.55 + i * 0.12)
        const x = lerp(VENTURES.mages[i], VENTURES.gate, went)
        transformTo(node, `${place(x, -1, FLOOR, FOLK)} translate(0 ${r1(hop(x))})`)
        fadeTo(node, 1 - ramp(went, 0.75, 1))
      })
      const toStone = ramp(struck, 0, 0.35)
      const toGate = ramp(through, 0.05, 0.3)
      const x = through > 0 ? lerp(VENTURES.warden + 30, VENTURES.gate + 110, toGate) : VENTURES.warden + 30 * toStone
      poseWarden(warden, {
        x,
        face: through > 0.05 ? -1 : 1,
        step: (toStone > 0 && toStone < 1 && through === 0) || (toGate > 0 && toGate < 1) ? (through > 0 ? toGate : toStone) * 3 : 0,
        staff: ARM.up * ramp(struck, 0.2, 0.45) * (1 - ramp(struck, 0.45, 0.6)) + ARM.forward * bell(struck, 0.45, 1),
        hand: ARM.up * 0.8 * ramp(through, 0.2, 0.4) * (1 - ramp(through, 0.85, 1)),
        lean: -6 * bell(torn, 0.2, 0.8),
      })
    }
  },
}

// Bands, the escape by sea: the clans' volcanic island, its beach and their ships on rollers. He beats the
// clans' war drum and the shipwrights hammer to its beat; then the ships push off and fill their sails as the
// mountain behind sinks into the sea. The end frame is the fleet on open water and the island gone under
// smoke.
const BANDS = { warden: 250, drum: 330, ships: [560, 760] as const, wrights: [480, 650, 820] as const, sail: { up: -150, size: 0.62 } }

const bands: SceneSpec = {
  realm: 'frost',
  land: () => <IslandLand />,
  script: [2200, 2400],
  figure: (scene) => (
    <>
      {BANDS.ships.map((x, i) => (
        <g key={x} data-fx={`ship-${i}`} transform={place(x)}>
          <Longship name={`ship-body-${i}`} />
        </g>
      ))}
      {BANDS.wrights.map((x, i) => (
        <g key={x} data-fx={`wright-${i}`} transform={place(x, -1, FLOOR, FOLK)}>
          <ClansFolk name={`wright-body-${i}`} />
        </g>
      ))}
      <WardenUnit x={BANDS.warden} profession={scene.profession} figure={scene.figure} />
      <g transform={place(BANDS.drum)}>
        <DrumCart />
      </g>
    </>
  ),
  bind: (stage) => {
    const warden = wardenNodes(stage)
    const ships = unitsOf(stage, 'ship', BANDS.ships.length)
    const sails = BANDS.ships.map((_, i) => fx(stage, `ship-body-${i}-sail`))
    const wrights = unitsOf(stage, 'wright', BANDS.wrights.length)
    const arms = BANDS.wrights.map((_, i) => fx(stage, `wright-body-${i}-arm`))
    const mountain = fx(stage, 'mountain')
    return (play) => {
      const drummed = share(play, 0)
      const sailed = share(play, 1)
      // the beat: his sticks and their hammers fall together, the beat held through the launch
      const beats = (drummed + sailed * 0.5) * 10
      const beat = Math.abs(Math.sin(beats * Math.PI))
      const playing = ramp(drummed, 0.05, 0.2) * (1 - ramp(sailed, 0.7, 1))
      arms.forEach((arm, i) => swingArm(arm, -60 * beat * playing * (1 - ramp(sailed, 0, 0.3)) + 4 * i))
      // the ships slide down their rollers into the water and stand out to sea, their crews aboard
      const off = ramp(sailed, 0.1, 0.9)
      ships.forEach((node, i) => {
        const away = ramp(off, i * 0.15, 0.7 + i * 0.15)
        const size = lerp(1, BANDS.sail.size, away)
        transformTo(node, `translate(${r1(BANDS.ships[i] + 60 * away)} ${r1(FLOOR + BANDS.sail.up * away + 4 * Math.sin(sailed * 12 + i))}) scale(${size.toFixed(3)})`)
      })
      sails.forEach((sail, i) => transformTo(sail, `scale(${(0.6 + 0.4 * ramp(sailed, 0.2 + i * 0.1, 0.5 + i * 0.1)).toFixed(3)} 1)`))
      wrights.forEach((node, i) => fadeTo(node, 1 - ramp(sailed, 0.05 + i * 0.08, 0.25 + i * 0.08)))
      transformTo(mountain, `translate(0 ${r1(420 * ramp(sailed, 0.2, 1))})`)
      fadeTo(mountain, 1 - 0.5 * ramp(sailed, 0.6, 1))
      poseWarden(warden, { x: BANDS.warden, staff: ARM.forward + 30 * beat * playing, hand: ARM.forward + 30 * (1 - beat) * playing })
    }
  },
}

// The Muay Thai record, a fight to save a man: the far shore's forest round a fouled spring. The clans'
// warlord, gone red and huge from drinking it, charges; he catches the charge in a clinch, sweeps him to the
// ground and pins him, and the forest folk's circle lights and the red drains out of him. The end frame is
// the warlord on his knees, himself again, and the circle fading.
const DUEL = { warden: 1160, meet: 1240, warlord: { from: 1680, to: 1330 }, circle: [1180, 1440, 1560] as const, spring: 1620 }

const muayThai: SceneSpec = {
  realm: 'chaos',
  land: () => <ForestLand />,
  script: [1500, 1600, 1900],
  figure: (scene) => (
    <>
      <g data-fx="spring" transform={place(DUEL.spring)}>
        <ellipse cx={0} cy={-6} rx={90} ry={20} fill={REALM.warlordRed} opacity="0.8" />
      </g>
      <g data-fx="circle" opacity="0" transform={place(DUEL.warlord.to)}>
        <ellipse rx={200} ry={50} fill="none" stroke={REALM.spirit} strokeWidth="6" />
        <ellipse rx={200} ry={50} fill={REALM.spirit} opacity="0.2" />
      </g>
      {DUEL.circle.map((x, i) => (
        <g key={x} data-fx={`keeper-${i}`} transform={place(x, i === 0 ? 1 : -1, FLOOR - 20, FOLK)} opacity="0">
          <ForestFolk name={`keeper-body-${i}`} />
        </g>
      ))}
      <g data-fx="warlord-place" transform={place(DUEL.warlord.from, -1)}>
        <Warlord name="warlord" />
      </g>
      <WardenUnit x={DUEL.warden} profession={scene.profession} figure={scene.figure} />
    </>
  ),
  bind: (stage) => {
    const warden = wardenNodes(stage)
    const place0 = fx(stage, 'warlord-place')
    const red = fx(stage, 'warlord-red')
    const circle = fx(stage, 'circle')
    const spring = fx(stage, 'spring')
    const keepers = unitsOf(stage, 'keeper', DUEL.circle.length)
    return (play) => {
      const clinched = share(play, 0)
      const swept = share(play, 1)
      const cleansed = share(play, 2)
      // the charge comes in and is caught; the sweep takes him down; cleansed, he comes up onto his knees
      const charge = ramp(clinched, 0, 0.6)
      const down = ramp(swept, 0.2, 0.6)
      const kneel = ramp(cleansed, 0.6, 1)
      const x = lerp(DUEL.warlord.from, DUEL.warlord.to, charge) + 10 * Math.sin(clinched * 40) * bell(clinched, 0.6, 1)
      transformTo(place0, `${place(x, -1)} rotate(${r1(-80 * down * (1 - kneel) - 10 * bell(clinched, 0.55, 0.9))}) translate(0 ${r1(30 * kneel)}) scale(1 ${(1 - 0.25 * kneel).toFixed(3)})`)
      fadeTo(red, 1 - ramp(cleansed, 0.2, 0.7))
      const lit = ramp(cleansed, 0, 0.25)
      fadeTo(circle, lit * (1 - 0.7 * ramp(cleansed, 0.75, 1)))
      transformTo(circle, `${place(DUEL.warlord.to)} scale(${(0.6 + 0.4 * lit).toFixed(3)})`)
      keepers.forEach((node, i) => fadeTo(node, ramp(cleansed, i * 0.06, 0.2 + i * 0.06)))
      fadeTo(spring, 0.8 - 0.6 * ramp(cleansed, 0.3, 0.9))
      const stepIn = ramp(clinched, 0.4, 0.65)
      poseWarden(warden, {
        x: lerp(DUEL.warden, DUEL.meet, stepIn) + 30 * down - 60 * kneel,
        step: stepIn > 0 && stepIn < 1 ? stepIn * 2 : 0,
        staff: ARM.forward * ramp(clinched, 0.5, 0.65) * (1 - kneel),
        hand: ARM.forward * ramp(clinched, 0.5, 0.65) * (1 - kneel),
        lean: 14 * ramp(clinched, 0.55, 0.7) * (1 - down) + 30 * down * (1 - kneel),
        lift: -20 * down * (1 - kneel),
      })
    }
  },
}

// The contact, the last stand: the tree mountain at dawn, the great tree at its top. The three peoples fall
// back up the slope; the forest's trees pull up their roots and walk into the giant of cinders' path; he
// sounds his horn and the forest's spirits pour down on the giant, and it is gone. The end frame is the great
// tree scorched and standing, a green shoot at its root, and the giant gone.
const CONTACT = { warden: 250, camps: [{ from: 420, to: 300 }, { from: 500, to: 360 }, { from: 580, to: 420 }], trees: [{ from: 470, to: 600 }, { from: 560, to: 700 }], giant: 790, spirits: 5 }

const contact: SceneSpec = {
  realm: 'frost',
  land: () => <MountainLand />,
  script: [1500, 1600, 1900],
  figure: (scene) => (
    <>
      <g data-fx="giant-place" transform={place(CONTACT.giant, -1, FLOOR, 0.75)}>
        <CinderGiant name="giant" />
      </g>
      {CONTACT.trees.map(({ from }, i) => (
        <g key={from} data-fx={`tree-${i}`} transform={place(from, 1, FLOOR, 0.8)}>
          <WalkingTree name={`tree-body-${i}`} />
        </g>
      ))}
      {CONTACT.camps.map(({ from }, i) => {
        const Folk = [Villager, ClansFolk, ForestFolk][i]
        return (
          <g key={from} data-fx={`camp-${i}`} transform={place(from, -1, FLOOR, FOLK)}>
            <Folk name={`camp-body-${i}`} />
          </g>
        )
      })}
      {Array.from({ length: CONTACT.spirits }, (_, i) => (
        <g key={i} data-fx={`spirit-place-${i}`}>
          <Spirit name={`spirit-${i}`} />
        </g>
      ))}
      <WardenUnit x={CONTACT.warden} profession={scene.profession} figure={scene.figure} />
    </>
  ),
  bind: (stage) => {
    const warden = wardenNodes(stage)
    const camps = unitsOf(stage, 'camp', CONTACT.camps.length)
    const trees = unitsOf(stage, 'tree', CONTACT.trees.length)
    const roots = CONTACT.trees.map((_, i) => fx(stage, `tree-body-${i}-roots`))
    const giant = fx(stage, 'giant-place')
    const spirits = Array.from({ length: CONTACT.spirits }, (_, i) => ({ place: fx(stage, `spirit-place-${i}`), body: fx(stage, `spirit-${i}`) }))
    const scorch = fx(stage, 'scorch')
    const shoot = fx(stage, 'shoot')
    return (play) => {
      const fell = share(play, 0)
      const rose = share(play, 1)
      const sounded = share(play, 2)
      camps.forEach((node, i) => {
        const { from, to } = CONTACT.camps[i]
        const back = ramp(fell, i * 0.1, 0.7 + i * 0.1)
        const x = lerp(from, to, back)
        transformTo(node, `${place(x, -1, FLOOR - 30 * back, FOLK)} translate(0 ${r1(hop(x))})`)
      })
      // the trees tear their roots up and walk into its path
      trees.forEach((node, i) => {
        const { from, to } = CONTACT.trees[i]
        const walked = ramp(rose, 0.25 + i * 0.1, 0.9)
        transformTo(node, `${place(lerp(from, to, walked), 1, FLOOR - 16 * ramp(rose, 0, 0.25), 0.8)} rotate(${r1(4 * Math.sin(walked * 10))})`)
        transformTo(roots[i], `translate(0 ${r1(-10 * ramp(rose, 0, 0.25))}) rotate(${r1(10 * Math.sin(walked * 12))})`)
      })
      // the giant comes on, is held, and goes under the spirits
      const gone = ramp(sounded, 0.55, 0.95)
      transformTo(giant, `${place(CONTACT.giant - 60 * ramp(fell, 0, 1) + 40 * ramp(rose, 0.5, 1), -1, FLOOR, 0.75)} translate(0 ${r1(120 * gone)})`)
      fadeTo(giant, 1 - gone)
      spirits.forEach(({ place: node, body }, i) => {
        const flown = ramp(sounded, 0.2 + i * 0.06, 0.6 + i * 0.06)
        transformTo(node, `translate(${r1(lerp(100 + i * 60, CONTACT.giant - 20 + i * 10, flown))} ${r1(lerp(260 + i * 40, FLOOR - 260 + i * 30, flown))})`)
        fadeTo(body, bell(flown, 0, 1.15))
      })
      fadeTo(scorch, ramp(fell, 0, 0.6))
      fadeTo(shoot, ramp(sounded, 0.8, 1))
      const backUp = ramp(fell, 0, 0.8)
      poseWarden(warden, {
        x: CONTACT.warden + 60 * (1 - backUp),
        face: -1,
        step: backUp > 0 && backUp < 1 ? backUp * 3 : 0,
        hand: ARM.up * 0.85 * ramp(sounded, 0, 0.2),
        horn: ramp(sounded, 0, 0.15),
        lean: -6 * ramp(sounded, 0, 0.2),
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
  realm: Realm
  profession: Profession
  /** This stage's warden is the world's figure (data-worlds-figure): the hero's only, the one on screen at first
   *  paint at every width. */
  figure: boolean
}

const sceneOf = (id: SceneId, slot: SectionSlot | null, count: number, profession: Profession, figure: boolean): RealmScene => {
  const spec = SCENES[id]
  const scene: RealmScene = {
    id,
    slot,
    realm: spec.realm,
    profession,
    count,
    figure,
    script: spec.script,
    bind: (stage) => {
      const write = spec.bind(stage, scene)
      const end = sceneEnd(spec.script)
      return (_progress, _reached, play = end) => write(play)
    },
  }
  return scene
}

/** The page's scenes in order: the hero, the profession's sections, the contact. */
export function scenesOf(slots: readonly SectionSlot[], labels: Labels, highlights: readonly string[], profession: Profession): RealmScene[] {
  return [
    sceneOf('hero', null, 0, profession, true),
    ...slots.map((slot) => sceneOf(slot.id, slot, countOf(slot, labels, highlights), profession, false)),
    sceneOf('contact', null, 0, profession, false),
  ]
}

/** The band a scene's units stand in (world.module.css): the hero's own, else its realm's. */
const bandOf = ({ id, realm }: RealmScene): string => (id === 'hero' ? look.heroBand : realm === 'chaos' ? look.chaosBand : look.frostBand)

/** A scene's field: its units in the 1920 by 1080 picture, cut from its foot to the screen. */
function Field({ scene }: { scene: RealmScene }) {
  return (
    <svg className="block h-full w-full" viewBox={`0 0 ${FIELD.width} ${FIELD.height}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <g className={bandOf(scene)}>{SCENES[scene.id].figure(scene)}</g>
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
