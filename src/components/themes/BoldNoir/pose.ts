import type { Profession } from '@/lib/cv/professions'
import { STAND as RIG_STAND, mix, walk, type RigPose } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { rigJoints, setRigPose, type RigJoints } from '../shared/rig'
import { fadeTo, transformTo } from '../shared/stageNodes'
import type { HeldProp } from './gumshoe'
import s from './gumshoe.module.css'

// The detective posed by his scene's actions, on the shared rig (rigPose, ../shared/rig): his limbs as the
// rig's numbers, plus his own on top: the head's nod in degrees (positive looks down), how far the hat is
// lifted off his brow, 0 to 1, and what shows in his hands, each 0 to 1. His front side (the near arm and
// leg) is the rig's right, his back side its left; he faces right, so a negative turn swings a limb ahead.

const PROPS: readonly HeldProp[] = ['notebook', 'pencil', 'clue', 'receiver', 'file', 'paper', 'cuffs']
type Prop = HeldProp

export type NoirPose = RigPose & { head: number; hat: number } & Record<Prop, number>

const STAND: NoirPose = { ...RIG_STAND, head: 0, hat: 0, notebook: 0, pencil: 0, clue: 0, receiver: 0, file: 0, paper: 0, cuffs: 0 }

const pose = (partial: Partial<NoirPose>): NoirPose => ({ ...STAND, ...partial })

/** Each profession's resting kit: the suit's arms down, both sticks raised, the Muay Thai guard. */
const KIT: Record<Profession, NoirPose> = {
  engineer: STAND,
  drummer: pose({ armRight: -20, foreRight: -70, armLeft: -25, foreLeft: -75 }),
  fighter: pose({ armRight: -35, foreRight: -135, armLeft: -25, foreLeft: -145, thighRight: -6 }),
}

/** He stands in his kit. */
export const rest = (profession: Profession): NoirPose => KIT[profession]

/** The front hand up at the brim, settling the hat on (`t` to 0.6) and the hand back down. */
const BRIM = pose({ armRight: -150, foreRight: -40 })
export const settle = (profession: Profession, t: number): NoirPose => {
  const up = Math.sin(Math.PI * ramp(t, 0, 1))
  return { ...mix(KIT[profession], BRIM, up), hat: up * (1 - ramp(t, 0.3, 0.6)) }
}

/** The hat tipped with two fingers at the brim and back, `t` of the way. */
export const tip = (profession: Profession, t: number): NoirPose => {
  const up = Math.sin(Math.PI * t)
  return { ...mix(KIT[profession], BRIM, up), head: 6 * up }
}

/** His head turned down to something on the ground ahead, `t` of the way. */
export const look = (profession: Profession, t: number): NoirPose => ({ ...KIT[profession], head: 18 * t })

// Down low: the front knee up ahead of him, the back knee on the ground, the body dropped to match.
const LOW = { thighRight: -80, shinRight: 85, thighLeft: 10, shinLeft: 85, rise: 30 }

/** He kneels at the clue and his front hand picks it up off the ground, `t` of the way. */
const REACH = pose({ ...LOW, armRight: -30, foreRight: -10, lean: 18, head: 14 })
const PICKED = pose({ ...LOW, armRight: -55, foreRight: -95, lean: 2, head: 6, clue: 1 })
export const pick = (profession: Profession, t: number): NoirPose => {
  if (t < 0.55) return mix(KIT[profession], REACH, ramp(t, 0, 0.55))
  return { ...mix(REACH, PICKED, ramp(t, 0.55, 1)), clue: ramp(t, 0.55, 0.6) }
}

/** Still knelt, he turns the clue in his hand by his face, then the notebook comes up in the back hand and
 *  the clue goes into it, `t` of the way. */
const NOTED = pose({ ...LOW, armRight: -55, foreRight: -80, armLeft: -45, foreLeft: -70, head: 10, notebook: 1, pencil: 1 })
export const examine = (t: number): NoirPose => {
  const turned = { ...PICKED, foreRight: PICKED.foreRight + 14 * Math.sin(Math.PI * 2 * ramp(t, 0, 0.45)) }
  return { ...mix(turned, NOTED, ramp(t, 0.45, 0.75)), clue: 1 - ramp(t, 0.55, 0.7), pencil: ramp(t, 0.6, 0.75), notebook: ramp(t, 0.45, 0.55) }
}

/** The call box's receiver lifted out and held to his ear, the back hand on the box's door, `t` of the way. */
const CALL = pose({ armRight: -40, foreRight: -150, armLeft: -50, foreLeft: -30, head: -4, receiver: 1 })
export const call = (profession: Profession, t: number): NoirPose => ({
  ...mix(KIT[profession], { ...CALL, receiver: 0 }, ramp(t, 0, 0.5)),
  receiver: ramp(t, 0.3, 0.45),
})

/** The receiver hung up, the notebook up in the back hand and the pencil working down its page. */
const WRITE = pose({ armRight: -50, foreRight: -75, armLeft: -50, foreLeft: -65, head: 12, notebook: 1, pencil: 1 })
export const write = (t: number): NoirPose => {
  const held = mix({ ...CALL, receiver: 1 }, WRITE, ramp(t, 0, 0.3))
  return { ...held, receiver: 1 - ramp(t, 0, 0.12), foreRight: held.foreRight + 6 * Math.sin(Math.PI * 10 * ramp(t, 0.3, 0.9)) }
}

/** Sat on a chair: the thighs ahead level, the shins straight down, the body dropped by the thigh. */
const SEAT = { thighRight: -88, shinRight: 88, thighLeft: -82, shinLeft: 82, rise: 30 }

/** He sits across the table, the hands on it, `t` of the way. */
const SAT = pose({ ...SEAT, armRight: -60, foreRight: -30, armLeft: -50, foreLeft: -30, lean: 4 })
export const sit = (profession: Profession, t: number): NoirPose => mix(KIT[profession], SAT, t)

/** Sat, he watches the face across, leaning in on his forearms, `t` of the way. */
const WATCH = pose({ ...SAT, lean: 10, head: -3 })
export const watch = (t: number): NoirPose => mix(SAT, WATCH, t)

/** The case file brought up out of his coat and laid down hard on the table before the suspect. */
const SLAP = pose({ ...SEAT, armRight: -78, foreRight: -12, armLeft: -50, foreLeft: -30, lean: 14, file: 1 })
export const accuse = (t: number): NoirPose => {
  const raised = mix(WATCH, pose({ ...SEAT, armRight: -110, foreRight: -70, armLeft: -50, foreLeft: -30, lean: 2 }), ramp(t, 0, 0.4))
  const laid = t < 0.4 ? raised : mix(raised, SLAP, ramp(t, 0.4, 0.55))
  return { ...laid, file: ramp(t, 0.1, 0.25) }
}

/** At the wheel: sat, both hands up on it. */
export const DRIVE = pose({ ...SEAT, armRight: -58, foreRight: -40, armLeft: -52, foreLeft: -42, lean: -4 })

/** The flat out run at `phase` (one stride per unit): a long stride, the body leant into it, the forearms
 *  bent and pumping against the legs. */
export function run(phase: number): NoirPose {
  const stride = walk(phase, 1)
  return pose({
    ...stride,
    thighRight: 1.5 * stride.thighRight,
    thighLeft: 1.5 * stride.thighLeft,
    shinRight: 2 * stride.shinRight,
    shinLeft: 2 * stride.shinLeft,
    rise: 2 * stride.rise,
    lean: 12,
    armRight: 2 * stride.armRight,
    foreRight: -90,
    armLeft: 2 * stride.armLeft,
    foreLeft: -90,
  })
}

/** The dive of the tackle: launched flat out, both arms reaching ahead, the legs trailing. */
export const DIVE = pose({ armRight: -170, foreRight: -10, armLeft: -160, foreLeft: -10, thighRight: 20, shinRight: 30, thighLeft: 35, shinLeft: 20, lean: 72 })

/** Knelt on the suspect's back, the cuffs out and snapped on, `t` of the way. */
const CUFF = pose({ ...LOW, armRight: -45, foreRight: -15, armLeft: -40, foreLeft: -15, lean: 22, head: 14 })
export const cuff = (t: number): NoirPose => ({ ...mix(DIVE, CUFF, ramp(t, 0, 0.35)), cuffs: ramp(t, 0.35, 0.5) })

/** The newspaper taken up off the stand and held open before him, `t` of the way. */
const READ = pose({ armRight: -60, foreRight: -95, armLeft: -50, foreLeft: -90, head: 6, paper: 1 })
export const read = (profession: Profession, t: number): NoirPose => ({ ...mix(KIT[profession], { ...READ, paper: 0 }, ramp(t, 0, 0.5)), paper: ramp(t, 0.25, 0.4) })

/** Brushes on the snare: each forearm strikes on its half of `phase`, `t` of the way into the roll. */
export function drum(t: number, phase: number): NoirPose {
  const beat = Math.abs(Math.sin(phase * Math.PI))
  const right = phase % 2 < 1 ? beat : 0
  const left = beat - right
  const kit = KIT.drummer
  return { ...kit, foreRight: kit.foreRight + 30 * right * t, foreLeft: kit.foreLeft + 30 * left * t, head: 3 * beat * t }
}

/** Both sticks up high and brought down on the cymbal at his front, held there. */
const CRASH_UP = pose({ armRight: -150, foreRight: -40, armLeft: -140, foreLeft: -40, lean: -4 })
const CRASH = pose({ armRight: -80, foreRight: -20, armLeft: -70, foreLeft: -25, lean: 6, head: 8 })
export const crash = (t: number): NoirPose => (t < 0.5 ? mix(KIT.drummer, CRASH_UP, ramp(t, 0, 0.5)) : mix(CRASH_UP, CRASH, ramp(t, 0.5, 0.62)))

/** The slip under a swing: down and back on bent knees, the head out of the line, and up into the guard. */
const SLIP = pose({ thighRight: -30, shinRight: 40, thighLeft: 20, shinLeft: 40, rise: 10, lean: -16 })
export const slip = (profession: Profession, t: number): NoirPose => mix(KIT[profession], { ...KIT[profession], ...SLIP }, Math.sin(Math.PI * t))

/** The knee (`t` to 0.5), then the round kick out of it, the guard held. */
const KNEE = pose({ thighRight: -85, shinRight: 95, lean: -6 })
const KICK = pose({ thighRight: -80, shinRight: 0, lean: -6 })
export function strike(profession: Profession, t: number): NoirPose {
  const kit = KIT[profession]
  const legs = t < 0.5 ? mix(kit, KNEE, t / 0.5) : mix(KNEE, KICK, (t - 0.5) / 0.5)
  return { ...kit, thighRight: legs.thighRight, shinRight: legs.shinRight, lean: legs.lean }
}

/** The case file laid on the captain's desk with the front hand, the hand kept flat on it. */
const LAY = pose({ armRight: -55, foreRight: -20, lean: 8, head: 10, file: 1 })
export const lay = (profession: Profession, t: number): NoirPose => ({ ...mix(KIT[profession], LAY, ramp(t, 0, 0.6)), file: 1 - ramp(t, 0.7, 0.85) })

// ---- the writer ----

const LIMB_CLASSES = {
  body: s.body,
  armRight: s.armFront,
  foreRight: s.foreFront,
  armLeft: s.armBack,
  foreLeft: s.foreBack,
  thighRight: s.thighFront,
  shinRight: s.shinFront,
  thighLeft: s.thighBack,
  shinLeft: s.shinBack,
}


export type NoirJoints = RigJoints & { head: SVGElement | null; hat: SVGElement | null; props: [Prop, SVGElement | null][] }

const part = (root: Element, name: string): SVGElement | null => root.querySelector<SVGElement>(`[data-part="${name}"]`)

/** His groups inside `root`, the group that holds one GumshoeSprite. */
export const noirJoints = (root: Element): NoirJoints => ({
  ...rigJoints(root, LIMB_CLASSES),
  head: part(root, 'head'),
  hat: part(root, 'hat'),
  props: PROPS.map((prop) => [prop, part(root, prop)]),
})

/** Writes `p` on his groups: the rig's limbs, then his head, hat and what he holds. Transforms and opacity
 *  only. */
export function setNoirPose(j: NoirJoints, p: NoirPose): void {
  setRigPose(j, p)
  // the head turns at the neck and the hat at its brim's back edge (their joints in gumshoe.module.css)
  transformTo(j.head, `rotate(${p.head.toFixed(1)} 62 44)`)
  transformTo(j.hat, `translate(0 ${(-5 * p.hat).toFixed(2)}) rotate(${(-6 * p.hat).toFixed(1)} 50 22)`)
  j.props.forEach(([prop, el]) => fadeTo(el, p[prop]))
}
