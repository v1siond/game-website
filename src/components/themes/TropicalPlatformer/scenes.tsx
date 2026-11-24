import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import type { Labels } from '@/lib/cv/labels'
import type { Playhead, SceneScript } from '@/lib/scroll/player'
import { stageItems, type StageItems } from '@/lib/cv/stageItems'
import { hop } from '@/lib/motion/arc'
import { handAt, mix, walk } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, fx, lerp, r1, transformTo } from '../shared/stageNodes'
import { propLayout, type FigureState, type FigureWriter, type PropLayout, type StageNodes } from '../shared/figureScene'
import { FIGURE_STAND, type FigurePose } from './character'
import { Armadillo, Banana, BananaBunch, Barrel, Beetle, Boar, Burst, Cart, Crate, Deck, GoldLetter, NAME_LETTERS, PLANKS, Pit, PlankWall, Rails, Rope, StandingBarrel, boardAt, plankAt } from './props'
import { COLORS as C } from './palette'
import { GROUND, type Zone } from './zones'

// Each part of the page as one place of the jungle barrel platformer it comes from, played the way that game
// plays: he stands at one spot under a fixed camera and the shared scene player moves his move through the
// scene's script of one to three actions (src/lib/scroll/player.ts), each action its own stretch of the move,
// so every frame is a function of the playhead alone, plays the same backward, and the last action's end is
// the frame reduced motion shows. Hero: a blast barrel fires him out in a tumbling arc onto the sunset trail.
// About: he rolls into a beetle and it tumbles off, then jumps and grabs a banana bunch. Work: barrel cannons
// across a pit, into the first, blasted into the second as it turns, blasted out to the far deck. Tech: he
// slaps the ground hand over hand and a gold letter pops out of the earth into his hand. Services: he rides
// the mine cart to the broken rail, jumps out over the gap and lands in the next cart. Projects: rope to
// rope over a pit and a landing past it. Ventures: he rolls into the buddy crate, the boar steps out, he
// hops on and it charges through a plank wall. Bands: a roll on a barrel head, then the bonus barrel bursts
// into a ring of bananas. Muay Thai: an armadillo rolls in and uncurls, his side kick bowls it away.
// Contact: he jumps for the last gold letter and the four letters of his name light over him.
//
// He is the jungle hero of character.tsx on the shared rig, side on and facing right.

export type SceneId = 'hero' | SectionId | 'contact'

/** What a scene's art and writer read: the phone's narrower view, the kit he wears. */
export interface SceneInput {
  phone: boolean
  kit: Profession
}

/** His frame in a move: his pose, how far ahead of his spot and how high above the ground his soles are,
 *  a tumble (`spin`, degrees round the middle of his tucked body) and how much of him shows. */
interface Frame {
  pose: FigurePose
  ahead: number
  lift?: number
  spin?: number
  opacity?: number
}

export interface SceneDef {
  zone: Zone
  /** His kit in the scene; null takes the profession the page shows. */
  kit: Profession | null
  /** The scene's actions, each its length in ms. */
  script: SceneScript
  /** Where each action ends on the move's t, one per action, the last 1. */
  ends: readonly number[]
  /** How far right of his usual spot he stands, on a wide screen and on a phone (the hero: clear of its card
   *  and the profession plates). */
  shift?: { wide: number; phone: number }
  /** The place's art round his spot (x 0 his spot, y 0 the ground), behind him and in front of him. */
  back: (input: SceneInput) => ReactNode
  front?: (input: SceneInput) => ReactNode
  /** His move `t` of the way. */
  move: (kit: Profession, t: number) => Frame
  /** Binds the place's reply to his move and returns its writer over the move's t. */
  reply: (stage: StageNodes, input: SceneInput) => (t: number) => void
}

/** Him in a frame, as the shared figure scene places him. */
export type HeroState = FigureState<FigurePose>

// His size on the stage, and where he stands: right of the text column on a wide screen, the left of a
// phone's view (zones.tsx PHONE_VIEW, x 480 to 1040) so the place before him shows whole.
const K = 1.5
const spotOf = (phone: boolean): number => (phone ? 580 : 820)

/** On a phone's narrow view the place round his spot, and he, are drawn at this share of their size. */
export const placeScale = (phone: boolean): number => (phone ? 0.8 : 1)

/** Before the section arrives a scene shows its first frame. */
const START: Playhead = { action: 0, t: 0, done: false }

/** How far the move has played at `play`: each action plays its stretch, from the end of the one before to its
 *  own end on the move's t. */
const moveAt = (ends: readonly number[], { action, t }: Playhead): number => lerp(action > 0 ? ends[action - 1] : 0, ends[action] ?? 1, t)

const ease = (t: number): number => t * t * (3 - 2 * t)

/** His pose over a stretch of the move: from `a` to `b` while t runs from..to. */
const blend = (a: FigurePose, b: FigurePose, t: number, from: number, to: number): FigurePose => mix(a, b, ease(ramp(t, from, to)))

const still = (pose: FigurePose, ahead = 0, lift = 0): Frame => ({ pose, ahead, lift })

// ---------------------------------------------------------------- his poses (the near side is the rig's right)

const posed = (turns: Partial<FigurePose>): FigurePose => ({ ...FIGURE_STAND, ...turns })

/** His stance: low, the knees bent, the head forward, the long arms hanging a little ahead, ready. */
const STAND = posed({ rise: 4, lean: 4, thighRight: -14, shinRight: 18, thighLeft: 10, shinLeft: 12, armRight: -10, foreRight: -12, armLeft: 6, foreLeft: -10 })
const CROUCH = posed({ rise: 8, thighRight: -50, shinRight: 70, thighLeft: -30, shinLeft: 60, armRight: -30, foreRight: -40, armLeft: -10, foreLeft: -40 })
/** Tucked into a ball for the roll and the blast: knees to the chest, arms round them. */
const TUCK = posed({ rise: 28, thighRight: -120, shinRight: 140, thighLeft: -110, shinLeft: 140, armRight: -70, foreRight: -100, armLeft: -60, foreLeft: -100 })
/** In the air reaching up: both arms high, the legs drawn up under him. */
const REACH = posed({ armRight: -168, foreRight: -6, armLeft: -150, foreLeft: -10, thighRight: -40, shinRight: 60, thighLeft: -10, shinLeft: 40 })
/** Hanging from both hands, the legs a little forward. */
const HANG = posed({ armRight: -178, foreRight: 0, armLeft: -172, foreLeft: 0, thighRight: -20, shinRight: 10, thighLeft: -8, shinLeft: 14 })
/** Holding a pickup out before him in the near hand, the arm forward under his beard, clear of his face. */
const HOLD_UP = posed({ armRight: -80, foreRight: -20, armLeft: 20 })
/** Squatting wide and low for the hand slap, leaning over the ground he pounds. */
const KNEEL = posed({ rise: 9, thighRight: -60, shinRight: 70, thighLeft: -50, shinLeft: 62, lean: 16 })
/** Riding: seated with the knees forward, the hands on the rim or the boar's neck. */
const RIDE = posed({ rise: 12, thighRight: -80, shinRight: 75, thighLeft: -70, shinLeft: 75, armRight: -60, foreRight: -30, armLeft: -50, foreLeft: -30 })
const GUARD = posed({ armRight: -40, foreRight: -110, armLeft: -50, foreLeft: -105, thighRight: -12, thighLeft: 14 })
const KICK = posed({ armRight: -30, foreRight: -110, armLeft: 20, foreLeft: -60, thighRight: -100, shinRight: 0, lean: -16, rise: 2 })

/** The hand slap at `phase`: squatting low, each heavy hand swung high overhead and slammed flat on the ground
 *  in turn, the near and the far. */
const slap = (phase: number): FigurePose => {
  const swing = Math.sin(Math.PI * phase)
  return { ...KNEEL, armRight: -80 - 70 * swing, foreRight: -15, armLeft: -80 + 70 * swing, foreLeft: -15 }
}

/** The drum roll at `phase`: the sticks over the barrel head, near and far coming down in turn. */
const roll = (phase: number): FigurePose => {
  const near = Math.max(0, Math.sin(Math.PI * phase))
  const far = Math.max(0, -Math.sin(Math.PI * phase))
  return posed({ armRight: -45 + 25 * near, foreRight: -70 + 30 * near, armLeft: -40 + 25 * far, foreLeft: -70 + 30 * far, thighRight: -6, thighLeft: 8 })
}

/** A walk step at `phase`, facing right. */
const stride = (phase: number): FigurePose => ({ ...FIGURE_STAND, ...walk(phase, 1) })

// His size in place units: soles to his raised hands, and the middle of his tucked body above the ground.
const HANDS_UP = 192
const TUCK_MIDDLE = 75

/** The middle of his tucked body in his drawing, from his soles: what a tumble turns him round. */
const BALL = { x: 8, y: -50 }

// His near arm's joints in his drawing (character.tsx): the shoulder, the elbow, the middle of the hand.
const ARM = { shoulder: [52, 66], elbow: [52, 90], hand: [53, 114] } as const

/** Where his near hand is in a pose, from his soles, in place units (y up negative). */
const handOf = (pose: FigurePose): [number, number] => {
  const [x, y] = handAt({ shoulder: [...ARM.shoulder], elbow: [...ARM.elbow], hand: [...ARM.hand] }, pose.armRight, pose.foreRight)
  return [(x - 50) * K, (y - 146 + pose.rise) * K]
}

/** Where a thing he holds sits in a frame: at his near hand. */
const heldIn = (frame: Frame): [number, number] => {
  const [x, y] = handOf(frame.pose)
  return [frame.ahead + x, -(frame.lift ?? 0) + y]
}

/** A flight from `from` to `to` (each [ahead, lift]) over an arc `height` above the straight line between them. */
const flight = (u: number, from: readonly [number, number], to: readonly [number, number], height: number): [number, number] => [
  lerp(from[0], to[0], u),
  lerp(from[1], to[1], u) + hop(u, height),
]

// ---------------------------------------------------------------- the hero: the sunset trail

// The blast barrel behind his spot, its mouth up and forward, and where he comes out of it.
const HERO_BARREL = { x: -70, y: -70, angle: -40 }
const mouthOf = ({ x, y, angle }: { x: number; y: number; angle: number }): [number, number] => {
  const a = (angle * Math.PI) / 180
  return [x + 60 * Math.cos(a), y + 60 * Math.sin(a)]
}
const HERO_MOUTH = mouthOf(HERO_BARREL)
const HERO_LAND = 200

const hero: SceneDef = {
  zone: 'sunset',
  kit: null,
  script: [1800],
  ends: [1],
  shift: { wide: 230, phone: 50 },
  back: () => (
    <g data-fx="hero-barrel" transform={`translate(${HERO_BARREL.x} ${HERO_BARREL.y}) rotate(${HERO_BARREL.angle})`}>
      <Barrel blast />
      <g data-fx="hero-burst" opacity="0" transform="translate(70 0)">
        <Burst size={70} />
      </g>
    </g>
  ),
  move: (_kit, t) => {
    if (t < 0.08) return { pose: TUCK, ahead: HERO_MOUTH[0], lift: -HERO_MOUTH[1], opacity: 0 }
    if (t < 0.7) {
      const u = ramp(t, 0.08, 0.7)
      const [ahead, lift] = flight(u, [HERO_MOUTH[0], -HERO_MOUTH[1]], [HERO_LAND, 0], 200)
      return { pose: blend(TUCK, CROUCH, t, 0.55, 0.7), ahead, lift, spin: 720 * ease(ramp(t, 0.08, 0.6)) }
    }
    return still(blend(CROUCH, STAND, t, 0.72, 0.95), HERO_LAND)
  },
  reply: (stage) => {
    const barrel = fx(stage, 'hero-barrel')
    const burst = fx(stage, 'hero-burst')
    return (t) => {
      const kick = bell(t, 0.06, 0.2)
      transformTo(barrel, `translate(${HERO_BARREL.x - 10 * kick} ${HERO_BARREL.y + 6 * kick}) rotate(${HERO_BARREL.angle})`)
      fadeTo(burst, kick)
    }
  },
}

// ---------------------------------------------------------------- about: the roll and the banana bunch

const BEETLE_FROM = 420
const ROLL_TO = 170
const BUNCH = { x: 300, y: -330 }
const BUNCH_LAND = 270

const aboutMove = (t: number): Frame => {
  if (t < 0.08) return still(blend(STAND, CROUCH, t, 0, 0.08))
  if (t < 0.4) return { pose: TUCK, ahead: ROLL_TO * ease(ramp(t, 0.08, 0.4)), spin: 900 * ease(ramp(t, 0.08, 0.4)) }
  if (t < 0.55) return still(blend(TUCK, STAND, t, 0.4, 0.5), ROLL_TO)
  if (t < 0.85) {
    const u = ramp(t, 0.55, 0.85)
    const [ahead, lift] = flight(u, [ROLL_TO, 0], [BUNCH_LAND, 0], 160)
    return { pose: u < 0.8 ? blend(CROUCH, REACH, t, 0.55, 0.62) : blend(REACH, CROUCH, t, 0.8, 0.85), ahead, lift }
  }
  return still(blend(CROUCH, HOLD_UP, t, 0.86, 0.98), BUNCH_LAND)
}

const about: SceneDef = {
  zone: 'jungle',
  kit: null,
  script: [1600, 1700],
  ends: [0.48, 1],
  back: () => (
    <g>
      <path d={`M${BUNCH.x} -700 V${BUNCH.y}`} stroke={C.moss} strokeWidth={6} data-fx="about-vine" />
      <g data-fx="about-beetle" transform={`translate(${BEETLE_FROM} 0)`}>
        <Beetle />
      </g>
    </g>
  ),
  // The bunch hangs in front of him, so it shows in his hand once caught.
  front: () => (
    <g data-fx="about-bunch" transform={`translate(${BUNCH.x} ${BUNCH.y})`}>
      <BananaBunch />
    </g>
  ),
  move: (_kit, t) => aboutMove(t),
  reply: (stage) => {
    const beetle = fx(stage, 'about-beetle')
    const bunch = fx(stage, 'about-bunch')
    const vine = fx(stage, 'about-vine')
    return (t) => {
      // the beetle walks in at him until the ball hits it at 0.36, then flips and tumbles away
      const hit = ramp(t, 0.36, 0.55)
      const walked = lerp(BEETLE_FROM, 250, ease(ramp(t, 0, 0.36)))
      transformTo(beetle, `translate(${r1(walked + 260 * hit)} ${r1(-hop(hit, 160) + 400 * hit * hit * hit)}) rotate(${r1(200 * hit)})`)
      fadeTo(beetle, 1 - ramp(t, 0.5, 0.56))
      // the bunch is caught at the top of his jump (0.69) and rides in his near hand from then on
      const caught = t >= 0.69
      const [hx, hy] = heldIn(aboutMove(t))
      transformTo(bunch, caught ? `translate(${r1(hx)} ${r1(hy - 6)})` : `translate(${BUNCH.x} ${BUNCH.y})`)
      fadeTo(vine, caught ? 0 : 1)
    }
  },
}

// ---------------------------------------------------------------- work: the barrel cannons over the pit

const PIT_WORK = { from: 70, to: 430 }
const CANNON_A = { x: 150, y: -150, angle: -40 }
const CANNON_B = { x: 340, y: -300 }
// The second barrel turns from its mouth up and back to its mouth down at the far deck.
const B_FROM = -150
const B_TO = 30
const WORK_LAND = 460

const work: SceneDef = {
  zone: 'treetop',
  kit: 'engineer',
  script: [1400, 1400, 1700],
  ends: [0.3, 0.6, 1],
  back: () => (
    <g>
      <Pit from={PIT_WORK.from} to={PIT_WORK.to} />
      <Deck width={140} height={220} />
      <g data-fx="work-a" transform={`translate(${CANNON_A.x} ${CANNON_A.y}) rotate(${CANNON_A.angle})`}>
        <Barrel blast />
        <g data-fx="work-burst-a" opacity="0" transform="translate(70 0)">
          <Burst size={70} />
        </g>
      </g>
      <g data-fx="work-b" transform={`translate(${CANNON_B.x} ${CANNON_B.y}) rotate(${B_FROM})`}>
        <Barrel blast />
        <g data-fx="work-burst-b" opacity="0" transform="translate(70 0)">
          <Burst size={70} />
        </g>
      </g>
    </g>
  ),
  move: (_kit, t) => {
    const a: [number, number] = [CANNON_A.x - 10, -CANNON_A.y - TUCK_MIDDLE]
    const b: [number, number] = [CANNON_B.x - 10, -CANNON_B.y - TUCK_MIDDLE]
    if (t < 0.06) return still(blend(STAND, CROUCH, t, 0, 0.06))
    if (t < 0.26) {
      const [ahead, lift] = flight(ramp(t, 0.06, 0.26), [0, 0], a, 90)
      return { pose: blend(CROUCH, TUCK, t, 0.06, 0.16), ahead, lift, opacity: 1 - ramp(t, 0.22, 0.26) }
    }
    if (t < 0.33) return { pose: TUCK, ahead: a[0], lift: a[1], opacity: 0 }
    if (t < 0.5) {
      const [ahead, lift] = flight(ramp(t, 0.33, 0.5), a, b, 60)
      return { pose: TUCK, ahead, lift, spin: 540 * ramp(t, 0.33, 0.5), opacity: 1 - ramp(t, 0.47, 0.5) }
    }
    if (t < 0.64) return { pose: TUCK, ahead: b[0], lift: b[1], opacity: 0 }
    if (t < 0.88) {
      const u = ramp(t, 0.64, 0.88)
      const [ahead, lift] = flight(u, b, [WORK_LAND, 0], 120)
      return { pose: blend(TUCK, CROUCH, t, 0.8, 0.88), ahead, lift, spin: 360 * ease(ramp(t, 0.64, 0.82)) }
    }
    return still(blend(CROUCH, STAND, t, 0.88, 1), WORK_LAND)
  },
  reply: (stage) => {
    const a = fx(stage, 'work-a')
    const b = fx(stage, 'work-b')
    const burstA = fx(stage, 'work-burst-a')
    const burstB = fx(stage, 'work-burst-b')
    return (t) => {
      // each barrel bucks as he goes in, fires with a burst at its mouth, and the second turns to aim between
      const inA = bell(t, 0.25, 0.32)
      const fireA = bell(t, 0.32, 0.42)
      transformTo(a, `translate(${CANNON_A.x - 8 * fireA} ${CANNON_A.y + 6 * inA}) rotate(${CANNON_A.angle})`)
      fadeTo(burstA, fireA)
      const turn = lerp(B_FROM, B_TO, ease(ramp(t, 0.5, 0.62)))
      const inB = bell(t, 0.49, 0.55)
      const fireB = bell(t, 0.63, 0.73)
      transformTo(b, `translate(${CANNON_B.x - 8 * fireB} ${CANNON_B.y + 6 * inB}) rotate(${r1(turn)})`)
      fadeTo(burstB, fireB)
    }
  },
}

// ---------------------------------------------------------------- tech: the hand slap and the gold letter

const DIG = 90

const techMove = (t: number): Frame => {
  if (t < 0.08) return still(blend(STAND, KNEEL, t, 0, 0.08))
  if (t < 0.5) return still(slap(8 * ramp(t, 0.08, 0.5)))
  if (t < 0.6) return still(blend(KNEEL, STAND, t, 0.5, 0.6))
  return still(blend(STAND, HOLD_UP, t, 0.7, 0.82))
}

const tech: SceneDef = {
  zone: 'jungle',
  kit: 'engineer',
  script: [1800, 1500],
  ends: [0.55, 1],
  back: () => (
    <g>
      <g data-fx="tech-dust" opacity="0" transform={`translate(${DIG} 0)`}>
        <ellipse rx={70} ry={12} fill={C.sandLight} opacity={0.7} />
      </g>
      <path data-fx="tech-crack" opacity="0" d={`M${DIG - 40} 2 L${DIG - 14} -4 L${DIG} 4 L${DIG + 16} -3 L${DIG + 42} 2`} fill="none" stroke={C.shadow} strokeWidth={4} />
      <g data-fx="tech-glint" opacity="0" transform={`translate(${DIG} -40)`}>
        <Burst size={60} />
      </g>
    </g>
  ),
  // The letter flies in front of him into his hand.
  front: () => (
    <g data-fx="tech-letter" opacity="0" transform={`translate(${DIG} 0)`}>
      <GoldLetter letter="A" />
    </g>
  ),
  move: (_kit, t) => techMove(t),
  reply: (stage) => {
    const dust = fx(stage, 'tech-dust')
    const crack = fx(stage, 'tech-crack')
    const letter = fx(stage, 'tech-letter')
    const glint = fx(stage, 'tech-glint')
    return (t) => {
      // a puff of dust on each of the eight slaps, the ground cracking open over them
      const beat = (8 * ramp(t, 0.08, 0.5)) % 1
      fadeTo(dust, t > 0.08 && t < 0.5 ? 0.8 * (1 - beat) : 0)
      fadeTo(crack, ramp(t, 0.2, 0.5))
      // the letter springs up out of the crack and drops into his raised hand
      const up = ramp(t, 0.56, 0.82)
      const [hx, hy] = heldIn(techMove(t))
      const y = lerp(-20, hy - 34, up) - hop(up, 200)
      const x = lerp(DIG, hx + 6, ease(up))
      transformTo(letter, `translate(${r1(x)} ${r1(y)}) rotate(${r1(360 * (1 - ease(up)))})`)
      fadeTo(letter, ramp(t, 0.55, 0.6))
      fadeTo(glint, bell(t, 0.54, 0.66) + 0.8 * bell(t, 0.8, 0.95))
    }
  },
}

// ---------------------------------------------------------------- services: the mine cart over the broken rail

const RAIL_END = 200
const RAIL_ON = 320
const CART_ONE = { from: -20, to: RAIL_END - 50 }
const CART_TWO = { from: RAIL_ON + 60, to: 450 }
// His soles in a cart: on its floor.
const IN_CART = 22

const services: SceneDef = {
  zone: 'dusk',
  kit: 'engineer',
  script: [1600, 1800],
  ends: [0.47, 1],
  back: () => (
    <g>
      <Pit from={RAIL_END} to={RAIL_ON} />
      <Rails from={-300} to={RAIL_END} />
      <path d={`M${RAIL_END - 4} 0 L${RAIL_END + 26} 30`} stroke={C.stoneDark} strokeWidth={6} />
      <Rails from={RAIL_ON} to={900} />
    </g>
  ),
  // He stands in the carts, so they are drawn over his legs.
  front: () => (
    <g>
      <g data-fx="cart-one" transform={`translate(${CART_ONE.from} 0)`}>
        <Cart />
      </g>
      <g data-fx="cart-two" transform={`translate(${CART_TWO.from} 0)`}>
        <Cart />
      </g>
    </g>
  ),
  move: (_kit, t) => {
    const one = lerp(CART_ONE.from, CART_ONE.to, ease(ramp(t, 0, 0.47)))
    if (t < 0.5) return still(blend(RIDE, mix(RIDE, CROUCH, 0.5), t, 0.4, 0.5), one, IN_CART)
    if (t < 0.78) {
      const [ahead, lift] = flight(ramp(t, 0.5, 0.78), [CART_ONE.to, IN_CART], [CART_TWO.from, IN_CART], 170)
      return { pose: blend(REACH, CROUCH, t, 0.66, 0.78), ahead, lift }
    }
    return still(blend(CROUCH, RIDE, t, 0.78, 0.88), lerp(CART_TWO.from, CART_TWO.to, ease(ramp(t, 0.78, 1))), IN_CART)
  },
  reply: (stage) => {
    const one = fx(stage, 'cart-one')
    const two = fx(stage, 'cart-two')
    return (t) => {
      // the first cart runs to the broken end, then tips over the edge and drops into the gap
      const x = lerp(CART_ONE.from, CART_ONE.to, ease(ramp(t, 0, 0.47)))
      const tip = ramp(t, 0.5, 0.8)
      transformTo(one, `translate(${r1(x + 90 * tip)} ${r1(300 * tip * tip)}) rotate(${r1(70 * tip)})`)
      fadeTo(one, 1 - ramp(t, 0.72, 0.8))
      const x2 = lerp(CART_TWO.from, CART_TWO.to, ease(ramp(t, 0.78, 1)))
      transformTo(two, `translate(${r1(x2)} 0)`)
    }
  },
}

// ---------------------------------------------------------------- projects: rope to rope over the pit

const PIT_ROPES = { from: 60, to: 390 }
const ROPE_TOP = -560
const ROPE_LENGTH = 320
const ROPE_ONE = 150
const ROPE_TWO = 320
const ROPES_LAND = 450

/** The rope's end (where his hands hold) at `angle` for a rope hung at x `top`. */
const ropeEnd = (top: number, angle: number): [number, number] => {
  const a = (angle * Math.PI) / 180
  return [top - ROPE_LENGTH * Math.sin(a), ROPE_TOP + ROPE_LENGTH * Math.cos(a)]
}

/** Him hanging from the end of a rope at `angle`: his hands at its knot, his body along it. */
const hanging = (top: number, angle: number): Frame => {
  const [x, y] = ropeEnd(top, angle)
  return { pose: { ...HANG, lean: angle * 0.6 }, ahead: x - 14, lift: -(y + HANDS_UP) }
}

// Each rope's swing over the move: the first held back toward him, swung forward with him on it, then
// left swinging; the second waits back and carries him forward.
const ropeOne = (t: number): number => (t < 0.28 ? 32 : t < 0.6 ? lerp(32, -34, ease(ramp(t, 0.28, 0.6))) : lerp(-34, 0, ease(ramp(t, 0.6, 1))))
const ropeTwo = (t: number): number => (t < 0.68 ? 26 : lerp(26, -32, ease(ramp(t, 0.68, 0.86))))

const projects: SceneDef = {
  zone: 'dusk',
  kit: 'engineer',
  script: [1600, 1900],
  ends: [0.45, 1],
  back: () => (
    <g>
      <Pit from={PIT_ROPES.from} to={PIT_ROPES.to} />
      <g data-fx="rope-one" transform={`translate(${ROPE_ONE} ${ROPE_TOP})`}>
        <Rope length={ROPE_LENGTH} angle={32} />
      </g>
      <g data-fx="rope-two" transform={`translate(${ROPE_TWO} ${ROPE_TOP})`}>
        <Rope length={ROPE_LENGTH} angle={26} />
      </g>
    </g>
  ),
  move: (_kit, t) => {
    if (t < 0.06) return still(blend(STAND, CROUCH, t, 0, 0.06))
    if (t < 0.28) {
      const caught = hanging(ROPE_ONE, 32)
      const [ahead, lift] = flight(ramp(t, 0.06, 0.28), [0, 0], [caught.ahead, caught.lift ?? 0], 60)
      return { pose: blend(CROUCH, HANG, t, 0.06, 0.18), ahead, lift }
    }
    if (t < 0.6) return hanging(ROPE_ONE, ropeOne(t))
    if (t < 0.68) {
      const from = hanging(ROPE_ONE, -34)
      const to = hanging(ROPE_TWO, 26)
      const [ahead, lift] = flight(ramp(t, 0.6, 0.68), [from.ahead, from.lift ?? 0], [to.ahead, to.lift ?? 0], 50)
      return { pose: HANG, ahead, lift }
    }
    if (t < 0.86) return hanging(ROPE_TWO, ropeTwo(t))
    if (t < 0.95) {
      const from = hanging(ROPE_TWO, -32)
      const [ahead, lift] = flight(ramp(t, 0.86, 0.95), [from.ahead, from.lift ?? 0], [ROPES_LAND, 0], 40)
      return { pose: blend(HANG, CROUCH, t, 0.86, 0.95), ahead, lift }
    }
    return still(blend(CROUCH, STAND, t, 0.95, 1), ROPES_LAND)
  },
  reply: (stage) => {
    const one = fx(stage, 'rope-one')
    const two = fx(stage, 'rope-two')
    return (t) => {
      transformTo(one?.firstElementChild ?? null, `rotate(${r1(ropeOne(t))})`)
      transformTo(two?.firstElementChild ?? null, `rotate(${r1(ropeTwo(t))})`)
    }
  },
}

// ---------------------------------------------------------------- ventures: the buddy crate and the charge

const CRATE_X = 190
const ROLLED = 110
const SADDLE = 100
// Seated, his hips are this far above his soles: the lift that puts his seat on the saddle, his legs astride.
const SEAT = 33
const CHARGE_TO = 430
const WALL_X = 400

const boarAt = (t: number): number => lerp(CRATE_X, CHARGE_TO, ease(ramp(t, 0.62, 0.95)))

const ventures: SceneDef = {
  zone: 'jungle',
  kit: 'engineer',
  script: [1500, 1900],
  ends: [0.44, 1],
  back: () => (
    <g>
      <g data-fx="wall" transform={`translate(${WALL_X} 0)`}>
        <PlankWall />
      </g>
      <g data-fx="boar" opacity="0" transform={`translate(${CRATE_X} 0)`}>
        <Boar />
      </g>
      <g data-fx="crate" transform={`translate(${CRATE_X} 0)`}>
        <Crate />
      </g>
    </g>
  ),
  move: (_kit, t) => {
    if (t < 0.06) return still(blend(STAND, CROUCH, t, 0, 0.06))
    if (t < 0.3) return { pose: TUCK, ahead: ROLLED * ease(ramp(t, 0.06, 0.3)), spin: 720 * ease(ramp(t, 0.06, 0.3)) }
    if (t < 0.46) return still(blend(TUCK, STAND, t, 0.3, 0.4), ROLLED)
    if (t < 0.6) {
      const [ahead, lift] = flight(ramp(t, 0.46, 0.6), [ROLLED, 0], [CRATE_X - 10, SADDLE - SEAT], 80)
      return { pose: blend(CROUCH, RIDE, t, 0.46, 0.58), ahead, lift }
    }
    const x = boarAt(t)
    return { pose: { ...RIDE, lean: -10 * bell(t, 0.62, 0.95) }, ahead: x - 10, lift: SADDLE - SEAT - 6 * Math.abs(Math.sin(t * 40)) * bell(t, 0.62, 0.95) }
  },
  reply: (stage) => {
    const crate = fx(stage, 'crate')
    const boards = [0, 1, 2, 3].map((i) => fx(stage, `crate-board-${i}`))
    const boar = fx(stage, 'boar')
    const wall = fx(stage, 'wall')
    const planks = Array.from({ length: PLANKS }, (_, i) => fx(stage, `plank-${i}`))
    return (t) => {
      // the crate's boards fly apart and the boar steps out; it charges once he is on and smashes the wall
      const burst = ramp(t, 0.3, 0.44)
      boards.forEach((board, i) => transformTo(board, boardAt(i, burst)))
      fadeTo(crate, 1 - ramp(t, 0.4, 0.46))
      fadeTo(boar, ramp(t, 0.3, 0.38))
      transformTo(boar, `translate(${r1(boarAt(t))} 0)`)
      const smash = ramp(t, 0.8, 1)
      planks.forEach((plank, i) => transformTo(plank, plankAt(i, smash)))
      fadeTo(wall, 1 - ramp(t, 0.92, 1))
    }
  },
}

// ---------------------------------------------------------------- bands: the drum roll and the bonus barrel

const DRUM_X = 78
const BONUS_X = 230
const RING = 8

const ringSpot = (i: number, out: number): [number, number] => {
  const a = Math.PI * (0.1 + (0.8 * i) / (RING - 1))
  return [BONUS_X - 30 + Math.cos(a) * -180 * out, -120 - Math.sin(a) * 190 * out]
}

const bands: SceneDef = {
  zone: 'dusk',
  kit: 'drummer',
  script: [1700, 1700],
  ends: [0.5, 1],
  back: () => (
    <g>
      <g transform={`translate(${DRUM_X} 0)`}>
        <StandingBarrel />
      </g>
      <g data-fx="bonus" transform={`translate(${BONUS_X} 0)`}>
        <StandingBarrel bonus />
      </g>
      <g data-fx="bonus-burst" opacity="0" transform={`translate(${BONUS_X} -60)`}>
        <Burst size={120} />
      </g>
      {Array.from({ length: RING }, (_, i) => (
        <g key={i} data-fx={`banana-${i}`} opacity="0" transform={`translate(${BONUS_X} -60)`}>
          <Banana />
        </g>
      ))}
    </g>
  ),
  move: (_kit, t) => {
    if (t < 0.06) return still(blend(STAND, roll(0), t, 0, 0.06))
    if (t < 0.46) return still(roll(10 * ramp(t, 0.06, 0.46)))
    return still(blend(roll(0), HOLD_UP, t, 0.62, 0.74))
  },
  reply: (stage) => {
    const bonus = fx(stage, 'bonus')
    const burst = fx(stage, 'bonus-burst')
    const bananas = Array.from({ length: RING }, (_, i) => fx(stage, `banana-${i}`))
    return (t) => {
      const shake = bell(t, 0.5, 0.62) * Math.sin(t * 160)
      transformTo(bonus, `translate(${r1(BONUS_X + 4 * shake)} 0) rotate(${r1(5 * shake)} 0 -48)`)
      fadeTo(bonus, 1 - ramp(t, 0.62, 0.66))
      fadeTo(burst, bell(t, 0.6, 0.78))
      const out = ease(ramp(t, 0.62, 0.86))
      bananas.forEach((banana, i) => {
        const [x, y] = ringSpot(i, out)
        transformTo(banana, `translate(${r1(lerp(BONUS_X, x, out))} ${r1(lerp(-60, y, out))}) rotate(${r1(360 * (1 - out))})`)
        fadeTo(banana, ramp(t, 0.62, 0.66))
      })
    }
  },
}

// ---------------------------------------------------------------- muay thai: the armadillo

const ROLL_FROM = 600
const UNCURLED = 230
const STEP_IN = 60

const muayThai: SceneDef = {
  zone: 'jungle',
  kit: 'fighter',
  script: [1500, 1700],
  ends: [0.47, 1],
  back: () => (
    <g>
      <g data-fx="armadillo" transform={`translate(${ROLL_FROM} -40)`}>
        <Armadillo />
      </g>
      <g data-fx="mt-burst" opacity="0" transform={`translate(${UNCURLED - 40} -60)`}>
        <Burst size={80} />
      </g>
    </g>
  ),
  move: (_kit, t) => {
    if (t < 0.5) return still(blend(STAND, GUARD, t, 0.2, 0.4))
    if (t < 0.6) return still(GUARD, STEP_IN * ease(ramp(t, 0.5, 0.6)))
    if (t < 0.8) return still(blend(GUARD, KICK, t, 0.6, 0.68), STEP_IN)
    return still(blend(KICK, GUARD, t, 0.8, 0.92), STEP_IN)
  },
  reply: (stage) => {
    const dillo = fx(stage, 'armadillo')
    const walker = fx(stage, 'armadillo-walk')
    const rolled = fx(stage, 'armadillo-ball')
    const burst = fx(stage, 'mt-burst')
    return (t) => {
      // it rolls in at him and uncurls, then the kick curls it up and bowls it away up the clearing
      const come = ease(ramp(t, 0, 0.36))
      const x = lerp(ROLL_FROM, UNCURLED, come)
      const hit = ramp(t, 0.68, 0.98)
      const ball = t < 0.68 ? 1 - ramp(t, 0.36, 0.46) : Math.min(1, ramp(t, 0.68, 0.72) * 2)
      const spin = t < 0.68 ? -400 * come : 600 * hit
      fadeTo(walker, 1 - ball)
      fadeTo(rolled, ball)
      transformTo(rolled, `rotate(${r1(spin)})`)
      transformTo(dillo, `translate(${r1(x + 380 * hit)} ${r1(-40 - hop(hit, 220))})`)
      fadeTo(dillo, 1 - ramp(t, 0.9, 1))
      fadeTo(burst, bell(t, 0.66, 0.8))
    }
  },
}

// ---------------------------------------------------------------- contact: the last gold letter

const STUMP = 150
const JUMP_FROM = 110
const LETTER_X = 250
const LETTER_Y = -250
const CONTACT_LAND = 260
// The letters' row once all four are his: high over him, the last one flown up into its place.
const ROW_Y = -340
const rowX = (i: number): number => 60 + i * 80

const contact: SceneDef = {
  zone: 'night',
  kit: null,
  script: [1700, 1500],
  ends: [0.53, 1],
  back: () => (
    <g>
      <path d={`M${STUMP - 34} 0 L${STUMP - 28} -58 Q${STUMP} -66 ${STUMP + 28} -58 L${STUMP + 34} 0 Z`} fill="url(#tp-wood)" stroke={C.shadow} strokeWidth={3} />
      <ellipse cx={STUMP} cy={-60} rx={28} ry={8} fill="#d9a35f" stroke={C.shadow} strokeWidth={3} />
      {NAME_LETTERS.map((letter, i) => (
        <g key={letter} data-fx={`letter-${i}`} transform={`translate(${i === 3 ? LETTER_X : rowX(i)} ${i === 3 ? LETTER_Y : ROW_Y})`} opacity={i === 3 ? 1 : 0.35}>
          <GoldLetter letter={letter} />
        </g>
      ))}
      <g data-fx="row-glow" opacity="0" transform={`translate(${rowX(1.5)} ${ROW_Y})`}>
        <ellipse rx={230} ry={70} fill="url(#tp-burst)" />
      </g>
    </g>
  ),
  move: (_kit, t) => {
    if (t < 0.25) return still(stride(4 * ramp(t, 0, 0.25)), JUMP_FROM * ramp(t, 0, 0.25))
    if (t < 0.5) {
      const [ahead, lift] = flight(ramp(t, 0.25, 0.5), [JUMP_FROM, 0], [CONTACT_LAND, 0], 150)
      return { pose: blend(CROUCH, REACH, t, 0.25, 0.33), ahead, lift }
    }
    return still(blend(blend(REACH, CROUCH, t, 0.5, 0.54), STAND, t, 0.56, 0.7), CONTACT_LAND)
  },
  reply: (stage) => {
    const letters = NAME_LETTERS.map((_, i) => fx(stage, `letter-${i}`))
    const glow = fx(stage, 'row-glow')
    return (t) => {
      // the last letter is taken at the top of his jump, flies up into its place in the row, and all four light
      const taken = ramp(t, 0.38, 0.4)
      const fly = ease(ramp(t, 0.58, 0.76))
      const from: [number, number] = [LETTER_X, LETTER_Y]
      transformTo(letters[3], `translate(${r1(lerp(from[0], rowX(3), fly))} ${r1(lerp(from[1], ROW_Y, fly) - hop(fly, 60))}) scale(${(1 + 0.3 * bell(t, 0.38, 0.5)).toFixed(3)})`)
      const lit = ramp(t, 0.78, 0.9)
      letters.forEach((letter, i) => fadeTo(letter, i === 3 ? 1 : 0.35 + 0.65 * lit))
      fadeTo(glow, 0.8 * lit + 0.6 * taken * bell(t, 0.38, 0.5))
    }
  },
}

const SCENE_DEFS: Record<SceneId, SceneDef> = { hero, about, work, tech, services, projects, ventures, bands, muayThai, contact }

export interface Scene {
  id: SceneId
  def: SceneDef
  /** The cards the section counts, for the theatre's reading line. */
  layout: PropLayout
  /** His kit here: the scene's own, or the profession the page shows. */
  kit: Profession
  /** The section's slot; the hero and the contact have none. */
  slot: SectionSlot | null
}

/** The scene's writer: the place's reply and his frame at the scene's playhead, him placed at his spot and
 *  his tumble turning him round the middle of his tucked body (stage.tsx data-fx="tumble"). */
export function sceneWriter(scene: Scene): (stage: StageNodes) => FigureWriter<FigurePose> {
  const { def, kit, layout } = scene
  const input: SceneInput = { phone: layout.phone, kit }
  const spot = sceneSpot(scene)
  const size = placeScale(layout.phone)
  return (stage) => {
    const reply = def.reply(stage, input)
    const tumble = fx(stage, 'tumble')
    return (_p, _f, play = START) => {
      const t = moveAt(def.ends, play)
      reply(t)
      const frame = def.move(kit, t)
      transformTo(tumble, frame.spin ? `rotate(${r1(frame.spin % 360)} ${BALL.x} ${BALL.y})` : '')
      return { x: spot + frame.ahead * size, y: GROUND - (frame.lift ?? 0) * size, k: K * size, pose: frame.pose, opacity: frame.opacity ?? 1 }
    }
  }
}

/** Where he stands in a scene: his usual spot, shifted right where the scene asks. */
export const sceneSpot = ({ def, layout }: Scene): number => spotOf(layout.phone) + (def.shift?.[layout.phone ? 'phone' : 'wide'] ?? 0)

/** The input the scene's art reads. */
export const inputOf = (scene: Scene): SceneInput => ({ phone: scene.layout.phone, kit: scene.kit })

type RecordWords = Pick<Labels, 'record' | 'years'>

const NO_ITEMS: StageItems = { lead: 0, count: 0 }

// The theatre reads only the count of a scene's layout; its band is not drawn on.
const BAND = [0, 0] as const

const sceneOf = (id: SceneId, slot: SectionSlot | null, items: StageItems, profession: Profession, phone: boolean): Scene => {
  const def = SCENE_DEFS[id]
  return { id, def, layout: propLayout(items, BAND, phone), kit: def.kit ?? profession, slot }
}

/** The page as scenes: the hero, one per section the profession shows in reading order, the contact. */
export const scenesOf = (slots: readonly SectionSlot[], profession: Profession, phone: boolean, highlights: number, labels: RecordWords): Scene[] => [
  sceneOf('hero', null, NO_ITEMS, profession, phone),
  ...slots.map((slot) => sceneOf(slot.id, slot, stageItems(slot, labels, highlights), profession, phone)),
  sceneOf('contact', null, NO_ITEMS, profession, phone),
]
