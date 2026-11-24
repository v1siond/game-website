import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import { stageItems, type StageItems } from '@/lib/cv/stageItems'
import type { Labels } from '@/lib/cv/labels'
import { actionLengths, elapsedOf, type Playhead, type SceneScript } from '@/lib/scroll/player'
import { ramp } from '@/lib/scroll/stage'
import { hop } from '@/lib/motion/arc'
import { handAt, type ArmPivots } from '@/lib/motion/rigPose'
import { fadeTo, focusOn, fx, lerp, r1, transformTo } from '../shared/stageNodes'
import { propLayout, type FigureState, type FigureWriter, type PropLayout, type StageNodes } from '../shared/figureScene'
import type { Room } from './rooms'
import { Shape } from './foes'
import { PACES, PURSUER_POSES, Pursuer, mixPose, posePursuer, pursuerAt, stride, type PursuerPose, type PursuerPoseName } from './pursuer'
import { SH } from './palette'
import { CROUCH, GUARD, aim, block, kick, mix, pull, raiseLight, reach, read, run, shove, sweep, turn, walk, type SurvivorPose } from './pose'

// Each part of the page as a scene in a room of the old house: its room, its props and a short script of
// one to three different actions that the scroll plays, forward and back, at no more than its own speed
// (src/lib/scroll/player.ts), each eased and long enough to be seen. Nothing steps per card. He faces right
// and every move goes forward. The hero: he switches his flashlight on and sweeps the hall with it. About: he
// walks up to the notes pinned on the study wall and reads one by its light. Work: he walks to a filing
// cabinet and pulls a drawer out toward him, a file in his hand. Tech: he shoves a crate along the corridor
// and climbs onto it toward the high window. Services: he turns a lock's dials and the shackle springs open.
// Projects: a shape lurches out of the dark, he spends one shot on it, and behind him the pursuer stomps out
// of the wall. Ventures: the pursuer rushes him, he vaults the fallen cabinet and it lunges over it, a hand
// short. Bands: he lights the gallery's first lamp and the rest light down the hall. Muay Thai: a shape
// lunges, he blocks, then kicks it down, the camera pushed in. Contact: he runs through the door of the lit
// room and shuts it, and the pursuer rushes up and hammers on it. Projects, ventures and contact are one
// chase: it appears, he runs, he gets in. The pursuer (./pursuer) always comes on at one steady speed.

export type SceneId = 'hero' | SectionId | 'contact'

/** The floor his boots stand on, in the room's 600 by 300 units. */
export const GROUND = 262

/** The stage's frame of the room: all of it on a wide screen; on a phone its middle, with the dark above
 *  it and the dark floor before it, so the floor he stands on sits above the panel that scrolls up. */
export const VIEW: Record<'wide' | 'phone', string> = { wide: '0 0 600 300', phone: '100 -160 400 640' }

type Layout = PropLayout

export type SurvivorState = FigureState<SurvivorPose>

export interface SceneDef {
  room: Room
  /** The scene's actions, each one's length in ms, played in order by the scroll. */
  script: SceneScript
  /** The props behind him and in front of him, drawn in the figure layer. */
  back: (layout: Layout) => ReactNode
  front: (layout: Layout) => ReactNode
  bind: (stage: StageNodes, layout: Layout) => FigureWriter<SurvivorPose>
}

// Where the action plays: the stretch of the room right of the text column that every wide screen shows
// beside it, the middle a phone shows. Places are given as a share u of it, 0 its left end, 1 its right.
const BAND: Record<'wide' | 'phone', readonly [number, number]> = { wide: [322, 468], phone: [205, 400] }
const at = ({ phone }: Layout, u: number): number => lerp(...BAND[phone ? 'phone' : 'wide'], u)

const K = 0.72
const NONE = (): ReactNode => null

const him = (x: number, pose: SurvivorPose, y = GROUND, opacity = 1, k = K): SurvivorState => ({ x, y, k, pose, opacity })

/** Before its arrival a scene shows its first frame. */
const START: Playhead = { action: 0, t: 0, done: false }

/** How far action `i` has played: done before it, `t` while it plays, none after. */
const share = ({ action, t }: Playhead, i: number): number => (action > i ? 1 : action === i ? t : 0)

// His gun hand's joints in his viewBox (the origins in figure.module.css), the muzzle as the hand.
const GUN_ARM: ArmPivots = { shoulder: [51, 49], elbow: [51, 67], hand: [51, 110] }

/** The revolver's muzzle on the stage in `state`. */
const muzzle = ({ x, y, k, pose }: SurvivorState): readonly [number, number] => {
  const [hx, hy] = handAt(GUN_ARM, pose.armRight, pose.foreRight)
  return [x + (hx - 52) * k, y + (hy - 144 + pose.rise) * k]
}

// The pursuer's paces, in room units a second: it walks out of the dark, then rushes him faster than he
// runs, always at one steady speed, never eased, so its stomps keep time with the floor it covers.
const WALK_SPEED = 22
const RUSH_SPEED = 70

/** Where it is `ms` into the scene when it comes on at `speed` and stops at `stop` at `arriveMs`. */
const comingOn = (stop: number, arriveMs: number, speed: number, ms: number): number => stop - (speed * Math.max(0, arriveMs - ms)) / 1000

/** What it does once it stops: each move a pose reached over its ms, in order, from the pose it stopped in. */
function then(from: PursuerPose, moves: readonly (readonly [PursuerPoseName, number])[], ms: number): PursuerPose {
  let pose = from
  let left = ms
  for (const [name, length] of moves) {
    if (left < length) return mixPose(pose, PURSUER_POSES[name], Math.max(0, left) / length)
    pose = PURSUER_POSES[name]
    left -= length
  }
  return pose
}

/** The pursuer at `x` in `pose`, written to its stage nodes. */
function pursuerWriter(stage: StageNodes): (x: number, pose: PursuerPose) => void {
  const node = fx(stage, 'pursuer')
  const posed = posePursuer(stage)
  return (x, pose) => {
    transformTo(node, pursuerAt(x, GROUND, K))
    posed(pose)
  }
}

// ---------------------------------------------------------------- the hero: the flashlight on

// On a phone the hero's panel takes the lower half of the screen, so he stands up on the hall's gallery in
// the dark above the frame, where the hero shows him over the panel.
const GALLERY_Y = 6

function Gallery() {
  return (
    <g>
      <path d={`M150 ${GALLERY_Y} H450 V${GALLERY_Y + 12} H150 Z`} fill={SH.wood} stroke={SH.void} strokeWidth={1.4} />
      <path d={`M150 ${GALLERY_Y - 30} H450`} stroke={SH.wood} strokeWidth={4} />
      {Array.from({ length: 16 }, (_, i) => (
        <rect key={i} x={154 + i * 19} y={GALLERY_Y - 30} width={3} height={30} fill={SH.sepia} />
      ))}
    </g>
  )
}

const hero: SceneDef = {
  room: 'hall',
  script: [1500, 2200],
  back: ({ phone }) => (phone ? <Gallery /> : null),
  front: NONE,
  bind: (_stage, layout) => (_p, _f, play = START) => {
    const pose = play.action === 0 ? raiseLight(play.t) : sweep(play.t)
    return layout.phone ? him(250, pose, GALLERY_Y, 1, 0.8) : him(at(layout, 0.45), pose, GROUND, 1, 0.8)
  },
}

// ---------------------------------------------------------------- About: the notes on the wall

const NOTES = [0, 1, 2, 3, 4]
const noteX = (layout: Layout, i: number): number => at(layout, 0.62 + 0.09 * i)
const noteY = (i: number): number => (i % 2 === 0 ? 112 : 132)

function Notes({ layout }: { layout: Layout }) {
  return (
    <>
      {NOTES.map((i) => {
        const x = noteX(layout, i)
        const y = noteY(i)
        return (
          <g key={i} data-fx={i === 0 ? 'note' : undefined}>
            <rect x={x - 7} y={y} width={14} height={18} fill={SH.cream} opacity={0.55} stroke={SH.void} strokeWidth={0.8} />
            <circle cx={x} cy={y + 1.5} r={1.4} fill={SH.brass} />
          </g>
        )
      })}
      <circle data-fx="lit" cx={noteX(layout, 0)} cy={noteY(0) + 9} r={22} fill={SH.flame} opacity={0} />
    </>
  )
}

const about: SceneDef = {
  room: 'about',
  script: [2000, 2000],
  back: (layout) => <Notes layout={layout} />,
  front: NONE,
  bind: (stage, layout) => {
    const note = fx(stage, 'note')
    const lit = fx(stage, 'lit')
    const from = at(layout, 0.05)
    const to = noteX(layout, 0) - 26
    return (_p, _f, play = START) => {
      const walked = share(play, 0)
      const reading = share(play, 1)
      fadeTo(lit, 0.25 * Math.min(1, walked * 2))
      fadeTo(note, 1 - reading)
      if (play.action === 0) return him(lerp(from, to, walked), walk(walked * 4))
      return him(to, mix(raiseLight(1), read(1), reading))
    }
  },
}

// ---------------------------------------------------------------- Work: the filing cabinet

const CABINET_H = 96

// The tall cabinet seen side on, its drawers facing him on the left; the middle one slides out toward him.
function Cabinet({ x }: { x: number }) {
  const top = GROUND - CABINET_H
  return (
    <g>
      <rect x={x} y={top} width={34} height={CABINET_H} fill={SH.steel} stroke={SH.void} strokeWidth={1.4} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${x + 2} ${top + 6 + i * 23} V${top + 24 + i * 23}`} stroke={SH.gunmetal} strokeWidth={3} />
      ))}
      <g data-fx="drawer">
        <rect x={x - 2} y={top + 29} width={30} height={18} fill={SH.gunmetal} stroke={SH.void} strokeWidth={1} />
        <rect x={x - 4} y={top + 34} width={4} height={8} fill={SH.brass} />
        <path d={`M${x + 4} ${top + 31} V${top + 45} M${x + 9} ${top + 31} V${top + 45}`} stroke={SH.cream} strokeWidth={1.4} />
      </g>
    </g>
  )
}

const cabinetAt = (layout: Layout): number => at(layout, 0.72)

const work: SceneDef = {
  room: 'corridor',
  script: [1800, 2000],
  back: (layout) => <Cabinet x={cabinetAt(layout)} />,
  front: NONE,
  bind: (stage, layout) => {
    const drawer = fx(stage, 'drawer')
    const from = at(layout, 0.02)
    const to = cabinetAt(layout) - 34
    return (_p, _f, play = START) => {
      const walked = share(play, 0)
      const pulled = share(play, 1)
      transformTo(drawer, `translate(${r1(-22 * Math.min(1, pulled * 1.4))} 0)`)
      if (play.action === 0) return him(lerp(from, to, walked), walk(walked * 3))
      return him(to, pull(pulled))
    }
  },
}

// ---------------------------------------------------------------- Tech: the crate down the corridor

const CRATE_H = 30
const CRATE_W = 36

function Crate() {
  return (
    <g data-fx="crate">
      <rect x={0} y={GROUND - CRATE_H} width={CRATE_W} height={CRATE_H} fill={SH.wood} stroke={SH.void} strokeWidth={1.4} />
      <path d={`M0 ${GROUND - CRATE_H} L${CRATE_W} ${GROUND} M${CRATE_W} ${GROUND - CRATE_H} L0 ${GROUND}`} stroke={SH.sepia} strokeWidth={2.4} />
    </g>
  )
}

// The high window he climbs toward, its pale square up on the wall.
function HighWindow({ x }: { x: number }) {
  return <rect x={x} y={112} width={26} height={22} fill={SH.moon} opacity={0.22} stroke={SH.sepia} strokeWidth={3} />
}

const tech: SceneDef = {
  room: 'tech',
  script: [2200, 1800],
  back: (layout) => <HighWindow x={at(layout, 0.82)} />,
  front: () => <Crate />,
  bind: (stage, layout) => {
    const crate = fx(stage, 'crate')
    const from = at(layout, 0.02)
    const to = at(layout, 0.5)
    return (_p, _f, play = START) => {
      const pushed = share(play, 0)
      const climbed = share(play, 1)
      const x = lerp(from, to, pushed)
      transformTo(crate, `translate(${r1(x + 14)} 0)`)
      if (play.action === 0) return him(x, shove(pushed * 5))
      const up = ramp(climbed, 0.15, 0.7)
      const pose = climbed < 0.7 ? mix(shove(0), CROUCH, Math.sin(up * Math.PI) * 0.8) : raiseLight(1)
      return him(lerp(to, to + 30, up), pose, GROUND - CRATE_H * up - hop(up, 16))
    }
  },
}

// ---------------------------------------------------------------- Services: the lock's dials

const LOCK_Y = 184
const DIALS = [0, 1, 2]

// The lock box on its stand, three dials; the pips light as each is set, then the shackle springs.
function Lock({ x }: { x: number }) {
  return (
    <g>
      <rect x={x + 22} y={LOCK_Y + 22} width={8} height={GROUND - LOCK_Y - 22} fill={SH.wood} />
      <path data-fx="shackle" d={`M${x + 10} ${LOCK_Y} V${LOCK_Y - 12} Q${x + 26} ${LOCK_Y - 30} ${x + 42} ${LOCK_Y - 12} V${LOCK_Y}`} fill="none" stroke={SH.steel} strokeWidth={5} />
      <rect x={x} y={LOCK_Y} width={52} height={22} fill={SH.brass} stroke={SH.void} strokeWidth={1.4} />
      {DIALS.map((i) => {
        const dx = x + 12 + i * 14
        return (
          <g key={i}>
            <circle cx={dx} cy={LOCK_Y + 9} r={5.5} fill={SH.gunmetal} stroke={SH.void} strokeWidth={1} />
            <path data-fx={`dial-${i}`} d={`M${dx} ${LOCK_Y + 9} V${LOCK_Y + 4}`} stroke={SH.ivory} strokeWidth={1.6} />
            <circle data-fx={`pip-${i}`} cx={dx} cy={LOCK_Y + 18.5} r={1.6} fill={SH.flame} opacity={0} />
          </g>
        )
      })}
    </g>
  )
}

const lockAt = (layout: Layout): number => at(layout, 0.6)

const services: SceneDef = {
  room: 'store',
  script: [2400, 1400],
  back: (layout) => <Lock x={lockAt(layout)} />,
  front: NONE,
  bind: (stage, layout) => {
    const dials = DIALS.map((i) => fx(stage, `dial-${i}`))
    const pips = DIALS.map((i) => fx(stage, `pip-${i}`))
    const shackle = fx(stage, 'shackle')
    const lock = lockAt(layout)
    const x = lock - 30
    return (_p, _f, play = START) => {
      const turned = share(play, 0)
      const opened = share(play, 1)
      DIALS.forEach((i) => {
        const set = ramp(turned, i / 3, (i + 1) / 3)
        transformTo(dials[i], `rotate(${r1(240 * set)} ${lock + 12 + i * 14} ${LOCK_Y + 9})`)
        fadeTo(pips[i], set >= 1 ? 1 : 0)
      })
      transformTo(shackle, `translate(0 ${r1(-9 * opened)})`)
      if (play.action === 0) return him(x, turn((turned * 3) % 1))
      return him(x, mix(turn(0), reach(0.55), opened))
    }
  },
}

// ---------------------------------------------------------------- Projects: one shot, and the pursuer appears

const SHAPE_K = 0.8

const PROJECTS_SCRIPT: SceneScript = [2200, 2200]

const projects: SceneDef = {
  room: 'projects',
  script: PROJECTS_SCRIPT,
  back: (layout) => (
    <>
      <g data-fx="pursuer" transform={pursuerAt(at(layout, -0.05), GROUND, K)} opacity={0}>
        <Pursuer />
      </g>
      <g data-fx="shape" transform={`translate(${r1(at(layout, 1.1))} ${GROUND}) scale(${SHAPE_K})`} opacity={0}>
        <Shape />
      </g>
    </>
  ),
  front: () => <circle data-fx="flash" r={5} fill={SH.flame} opacity={0} />,
  bind: (stage, layout) => {
    const shape = fx(stage, 'shape')
    const flash = fx(stage, 'flash')
    const pursuer = fx(stage, 'pursuer')
    const placePursuer = pursuerWriter(stage)
    const x = at(layout, 0.48)
    // it steps out of the wall at the second action and walks up behind him, then stands
    const [shotMs] = actionLengths(PROJECTS_SCRIPT)
    const out = at(layout, -0.05)
    const stop = at(layout, 0.12)
    const arrive = shotMs + ((stop - out) / WALK_SPEED) * 1000
    return (_p, _f, play = START) => {
      const shot = share(play, 0)
      const appears = share(play, 1)
      const ms = elapsedOf(PROJECTS_SCRIPT, play)
      const near = ramp(shot, 0, 0.5)
      const recoil = ramp(shot, 0.55, 0.6) * (1 - ramp(shot, 0.6, 0.8))
      const down = ramp(shot, 0.6, 0.85)
      transformTo(shape, `translate(${r1(lerp(at(layout, 1.1), at(layout, 0.86), near))} ${GROUND}) rotate(${r1(80 * down)}) scale(${SHAPE_K})`)
      fadeTo(shape, (0.4 + 0.6 * near) * (1 - 0.5 * down))
      const walked = Math.max(out, comingOn(stop, arrive, WALK_SPEED, ms))
      fadeTo(pursuer, ramp(ms, shotMs, shotMs + 600))
      placePursuer(walked, then(stride(PACES.walk, walked, K), [['stand', 400]], ms - arrive))
      const pose = { ...aim(ramp(shot, 0.1, 0.45)), foreRight: -4 - 20 * recoil }
      const state = him(x, play.action === 0 ? pose : mix(aim(1), raiseLight(1), appears))
      const [mx, my] = muzzle(state)
      transformTo(flash, `translate(${r1(mx)} ${r1(my)})`)
      fadeTo(flash, recoil)
      return state
    }
  },
}

// ---------------------------------------------------------------- Ventures: the run from the pursuer

// The fallen cabinet across the floor: he vaults it, the pursuer stops at it.
function Debris({ x }: { x: number }) {
  return (
    <g>
      <rect x={x} y={GROUND - 18} width={44} height={18} fill={SH.steel} stroke={SH.void} strokeWidth={1.4} />
      <path d={`M${x + 6} ${GROUND - 14} H${x + 38}`} stroke={SH.gunmetal} strokeWidth={3} />
    </g>
  )
}

const debrisAt = (layout: Layout): number => at(layout, 0.52)

/** How long the pursuer's lunge over the cabinet takes. */
const LUNGE_MS = 500

const VENTURES_SCRIPT: SceneScript = [2000, 1800]

const ventures: SceneDef = {
  room: 'ventures',
  script: VENTURES_SCRIPT,
  back: (layout) => (
    <g data-fx="pursuer" transform={pursuerAt(debrisAt(layout) - 26, GROUND, K)}>
      <Pursuer row={PURSUER_POSES.lunge} />
    </g>
  ),
  front: (layout) => <Debris x={debrisAt(layout)} />,
  bind: (stage, layout) => {
    const placePursuer = pursuerWriter(stage)
    const debris = debrisAt(layout)
    const from = at(layout, 0.15)
    const before = debris - 22
    const after = at(layout, 0.96)
    // it rushes him the whole scene at one speed, kept behind him, and reaches the cabinet once he is over,
    // in time for its lunge to end with the scene
    const [runMs, vaultMs] = actionLengths(VENTURES_SCRIPT)
    const stop = debris - 26
    const arrive = runMs + vaultMs - LUNGE_MS
    return (_p, _f, play = START) => {
      const fled = share(play, 0)
      const vaulted = share(play, 1)
      const ms = elapsedOf(VENTURES_SCRIPT, play)
      const chased = comingOn(stop, arrive, RUSH_SPEED, ms)
      placePursuer(chased, then(stride(PACES.rush, chased, K), [['lunge', LUNGE_MS]], ms - arrive))
      if (play.action === 0) return him(lerp(from, before, fled), run(fled * 5))
      const over = ramp(vaulted, 0, 0.5)
      const pose = vaulted < 0.5 ? mix(run(0), CROUCH, Math.sin(over * Math.PI) * 0.7) : run(4 + vaulted * 3)
      return him(lerp(before, after, vaulted), pose, GROUND - hop(over, 26))
    }
  },
}

// ---------------------------------------------------------------- Bands: the gallery's lamps

const LAMP_Y = 150
const LAMPS = [0, 1, 2]
const lampX = (layout: Layout, i: number): number => at(layout, 0.42 + 0.27 * i)

function Lamps({ layout }: { layout: Layout }) {
  return (
    <>
      {LAMPS.map((i) => {
        const x = lampX(layout, i)
        return (
          <g key={i}>
            <path d={`M${x} ${LAMP_Y + 14} V${LAMP_Y + 22} M${x - 6} ${LAMP_Y + 22} H${x + 6}`} stroke={SH.brass} strokeWidth={2} />
            <path d={`M${x - 5} ${LAMP_Y} H${x + 5} L${x + 4} ${LAMP_Y + 14} H${x - 4} Z`} fill={SH.void} stroke={SH.brass} strokeWidth={1.2} />
            <g data-fx={`lamp-${i}`} opacity={0}>
              <circle cx={x} cy={LAMP_Y + 7} r={24} fill={SH.flame} opacity={0.22} />
              <ellipse cx={x} cy={LAMP_Y + 8} rx={2.4} ry={4.4} fill={SH.flame} />
            </g>
          </g>
        )
      })}
    </>
  )
}

const bands: SceneDef = {
  room: 'bands',
  script: [1800, 2200],
  back: (layout) => <Lamps layout={layout} />,
  front: NONE,
  bind: (stage, layout) => {
    const lamps = LAMPS.map((i) => fx(stage, `lamp-${i}`))
    const x = lampX(layout, 0) - 20
    return (_p, _f, play = START) => {
      const reached = share(play, 0)
      const lit = share(play, 1)
      fadeTo(lamps[0], ramp(reached, 0.55, 0.75))
      fadeTo(lamps[1], ramp(lit, 0.1, 0.4))
      fadeTo(lamps[2], ramp(lit, 0.5, 0.8))
      if (play.action === 0) return him(x, reach(Math.sin(Math.min(1, reached * 1.25) * Math.PI * 0.5)))
      return him(x, mix(reach(1), raiseLight(1), lit))
    }
  },
}

// ---------------------------------------------------------------- Muay Thai: block and kick

const muayThai: SceneDef = {
  room: 'gym',
  script: [1600, 2200],
  back: NONE,
  front: (layout) => (
    <g data-fx="rival" transform={`translate(${r1(at(layout, 0.75))} ${GROUND}) scale(${SHAPE_K})`}>
      <Shape />
    </g>
  ),
  bind: (stage, layout) => {
    const rival = fx(stage, 'rival')
    const camera = fx(stage, 'camera')
    const x = at(layout, 0.4)
    const home = at(layout, 0.75)
    return (_p, _f, play = START) => {
      const blocked = share(play, 0)
      const kicked = share(play, 1)
      const lunge = ramp(blocked, 0, 0.5) * (1 - ramp(kicked, 0.3, 0.5))
      const down = ramp(kicked, 0.45, 0.8)
      transformTo(rival, `translate(${r1(home - 30 * lunge + 8 * down)} ${GROUND}) rotate(${r1(80 * down)}) scale(${SHAPE_K})`)
      transformTo(camera, focusOn(x + 30, GROUND - 50, 1 + 0.2 * ramp(kicked, 0.2, 0.7)))
      if (play.action === 0) return him(x, mix(GUARD, block(1), ramp(blocked, 0.3, 0.6)))
      return him(x, kick(ramp(kicked, 0, 0.6)))
    }
  },
}

// ---------------------------------------------------------------- Contact: into the lit room

const doorAt = (layout: Layout): number => at(layout, 0.82)

// The door of the lit room, its window warm; the leaf swings in on its far hinge as he goes through.
function LitDoor({ x }: { x: number }) {
  return (
    <g>
      <rect x={x - 22} y={GROUND - 86} width={44} height={86} fill={SH.lampLight} opacity={0.85} stroke={SH.sepia} strokeWidth={4} />
      <g data-fx="leaf">
        <rect x={x - 20} y={GROUND - 84} width={40} height={84} fill={SH.wood} stroke={SH.void} strokeWidth={1.2} />
        <rect x={x - 12} y={GROUND - 76} width={24} height={20} fill={SH.lampLight} opacity={0.75} stroke={SH.sepia} strokeWidth={2} />
        <circle cx={x - 14} cy={GROUND - 40} r={2} fill={SH.brass} />
      </g>
    </g>
  )
}

const CONTACT_SCRIPT: SceneScript = [2200, 1800]

const contact: SceneDef = {
  room: 'contact',
  script: CONTACT_SCRIPT,
  back: (layout) => <LitDoor x={doorAt(layout)} />,
  front: (layout) => (
    <g data-fx="pursuer" transform={pursuerAt(doorAt(layout) - 40, GROUND, K)}>
      <Pursuer row={PURSUER_POSES.pound} />
    </g>
  ),
  bind: (stage, layout) => {
    const leaf = fx(stage, 'leaf')
    const placePursuer = pursuerWriter(stage)
    const door = doorAt(layout)
    const hinge = door + 20
    const from = at(layout, 0.05)
    // it rushes in behind him at one speed, reaches the door just after it shuts, raises a fist and hammers it
    const [runMs] = actionLengths(CONTACT_SCRIPT)
    const stop = door - 40
    const arrive = runMs + 400
    return (_p, _f, play = START) => {
      const ran = share(play, 0)
      const open = ramp(ran, 0.45, 0.65) * (1 - ramp(ran, 0.85, 1))
      transformTo(leaf, `translate(${hinge} 0) scale(${(1 - 0.85 * open).toFixed(3)} 1) translate(${-hinge} 0)`)
      const ms = elapsedOf(CONTACT_SCRIPT, play)
      const chased = comingOn(stop, arrive, RUSH_SPEED, ms)
      placePursuer(chased, then(stride(PACES.rush, chased, K), [['raise', 350], ['pound', 250]], ms - arrive))
      const x = lerp(from, door + 4, ran)
      const inside = ramp(ran, 0.7, 0.85)
      return him(x, run(ran * 6), GROUND, 1 - inside)
    }
  },
}

const SCENE_DEFS: Record<SceneId, SceneDef> = { hero, about, work, tech, services, projects, ventures, bands, muayThai, contact }

export interface Scene {
  id: SceneId
  def: SceneDef
  layout: Layout
  /** His kit here: the profession the page shows. */
  kit: Profession
  /** The section's slot; the hero and the contact have none. */
  slot: SectionSlot | null
}

type RecordWords = Pick<Labels, 'record' | 'years'>

const sceneOf = (id: SceneId, slot: SectionSlot | null, items: StageItems, profession: Profession, phone: boolean): Scene => ({
  id,
  def: SCENE_DEFS[id],
  layout: propLayout(items, BAND[phone ? 'phone' : 'wide'], phone),
  kit: profession,
  slot,
})

const NO_ITEMS: StageItems = { lead: 0, count: 0 }

/** The page as scenes: the hero, one per section the profession shows in reading order, the contact. */
export const scenesOf = (slots: readonly SectionSlot[], profession: Profession, phone: boolean, aboutItems: number, labels: RecordWords): Scene[] => [
  sceneOf('hero', null, NO_ITEMS, profession, phone),
  ...slots.map((slot) => sceneOf(slot.id, slot, stageItems(slot, labels, aboutItems), profession, phone)),
  sceneOf('contact', null, NO_ITEMS, profession, phone),
]
