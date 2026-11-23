import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import { stageItems, type StageItems } from '@/lib/cv/stageItems'
import type { Labels } from '@/lib/cv/labels'
import { ramp } from '@/lib/scroll/stage'
import { trackAt, trackEase } from '@/lib/scroll/track'
import { drop, hop } from '@/lib/motion/arc'
import { handAt, type ArmPivots } from '@/lib/motion/rigPose'
import { fadeTo, focusOn, fx, lerp, r1, transformTo } from '../shared/stageNodes'
import { fxs, propLayout, type FigureState, type FigureWriter, type PropLayout, type StageNodes } from '../shared/figureScene'
import type { Room } from './rooms'
import { Pursuer, Shape } from './foes'
import { SH } from './palette'
import { CROUCH, GUARD, aim, block, kick, lift, mix, raiseLight, reach, read, search, shove, turn, walk, type SurvivorPose } from './pose'

// Each part of the page as a scene in a room of the old house: its room, the props it holds (one per card
// the section counts) and, per frame, what the props and he do at the scene's progress p (0 when its stage
// starts to rise, 1 when it has sunk) with f of its cards reached (0 to count, fractional). One beat per card,
// each a move of the genre, held at its end (trackAt: a short lead in, then the move). The hero: he switches
// his flashlight on in the hall. About: he reads the notes pinned on the study wall by its light, one by one.
// Work: he searches a filing cabinet, one drawer per job. Tech: he shoves a crate down the corridor, one
// door per category, and climbs onto it at the end. Services: he turns a lock's dials, one per service, and
// the shackle springs. Projects: one shape per project comes out of the dark and he spends one shot on it, a
// shell dropping each time. Ventures: he hides while the pursuer walks past, the camera pulled out to show
// it. Bands: he lights the gallery's lamps one by one. Muay Thai: a shape comes at him per line, he blocks and
// kicks it back, the last one down with the camera pushed in. Contact: at dawn he lifts the bar off the
// front door and walks out into the light.

export type SceneId = 'hero' | SectionId | 'contact'

/** The floor his boots stand on, in the room's 600 by 300 units. */
export const GROUND = 262

/** The stage's frame of the room: all of it on a wide screen, its middle and the dark above it on a phone. */
export const VIEW: Record<'wide' | 'phone', string> = { wide: '0 0 600 300', phone: '100 -200 400 500' }

type Layout = PropLayout

export type SurvivorState = FigureState<SurvivorPose>

export interface SceneDef {
  room: Room
  /** His kit in the scene; null takes the profession the page shows. */
  kit: Profession | null
  /** The props behind him and in front of him, drawn in the figure layer. */
  back: (layout: Layout) => ReactNode
  front: (layout: Layout) => ReactNode
  bind: (stage: StageNodes, layout: Layout) => FigureWriter<SurvivorPose>
}

// The band the props stand in: right of the text column on a wide screen (the part every wide screen
// shows beside it), the middle a phone shows. He stands left of it.
const BAND: Record<'wide' | 'phone', readonly [number, number]> = { wide: [372, 462], phone: [262, 392] }
const standOf = ({ phone }: Layout): number => (phone ? 218 : 336)

const K = 0.72
const NONE = (): ReactNode => null

const him = (x: number, pose: SurvivorPose, k = K, y = GROUND, opacity = 1): SurvivorState => ({ x, y, k, pose, opacity })

// His gun hand's joints in his viewBox (the origins in figure.module.css), the muzzle as the hand.
const GUN_ARM: ArmPivots = { shoulder: [32, 48], elbow: [30.5, 66], hand: [30.5, 110] }

/** The revolver's muzzle on the stage in `state`. */
const muzzle = ({ x, y, k, pose }: SurvivorState): readonly [number, number] => {
  const [hx, hy] = handAt(GUN_ARM, pose.armRight, pose.foreRight)
  return [x + (hx - 50) * k, y + (hy - 144 + pose.rise) * k]
}

/** The beat `f` cards in: the card at, its lead in and its move (trackAt on the spot, no floor to scroll). */
const beatOf = (f: number, count: number, lead = 0.3) => trackAt(f, Math.max(count, 1), 0, lead)

/** The move held at its end, or let go over its last stretch when another beat follows. */
const heldIn = (act: number, at: number, count: number): number => (at >= count - 1 ? 1 : 1 - ramp(act, 0.88, 1))

/** How far card `i`'s own beat has played when the beat at `at` is `t` through: done before it, none after. */
const beatShare = (i: number, at: number, t: number): number => (i < at ? 1 : i === at ? t : 0)

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
  kit: null,
  back: ({ phone }) => (phone ? <Gallery /> : null),
  front: NONE,
  bind:
    (_stage, { phone }) =>
    (p) => {
      const on = raiseLight(ramp(p, 0.04, 0.25))
      return phone ? him(300, on, 0.8, GALLERY_Y) : him(404, on, 0.8)
    },
}

// ---------------------------------------------------------------- About: the notes on the wall

const noteY = (i: number): number => (i % 2 === 0 ? 112 : 136)

function Note({ x, i }: { x: number; i: number }) {
  const y = noteY(i)
  return (
    <g>
      <rect x={x - 7} y={y} width={14} height={18} fill={SH.sepia} stroke={SH.void} strokeWidth={0.8} />
      <g data-fx={`note-${i}`} opacity={0}>
        <circle cx={x} cy={y + 9} r={16} fill={SH.flame} opacity={0.22} />
        <rect x={x - 7} y={y} width={14} height={18} fill={SH.ivory} stroke={SH.void} strokeWidth={0.8} />
        <path d={`M${x - 4} ${y + 5} H${x + 4} M${x - 4} ${y + 9} H${x + 4} M${x - 4} ${y + 13} H${x + 1}`} stroke={SH.sepia} strokeWidth={0.9} />
      </g>
      <circle cx={x} cy={y + 1.5} r={1.4} fill={SH.brass} />
    </g>
  )
}

const about: SceneDef = {
  room: 'about',
  kit: null,
  back: ({ xs, count }) => (count === 0 ? null : <>{xs.map((x, i) => <Note key={x} x={x} i={i} />)}</>),
  front: NONE,
  bind: (stage, layout) => {
    const { count } = layout
    const notes = fxs(stage, 'note', count)
    const x = standOf(layout)
    return (_p, f) => {
      const { at, act } = beatOf(f, count)
      notes.forEach((note, i) => fadeTo(note, beatShare(i, at, ramp(act, 0, 0.4))))
      if (f <= 0) return him(x, raiseLight(1))
      return him(x, mix(raiseLight(1), read(1), ramp(act, 0.2, 0.6) * heldIn(act, at, count)))
    }
  },
}

// ---------------------------------------------------------------- Work: the filing cabinet

const CABINET_H = 104

// The tall cabinet, one drawer per job; a searched drawer's card turns from dark to the lamp's colour.
function Cabinet({ cx, count }: { cx: number; count: number }) {
  const n = Math.max(count, 1)
  const h = (CABINET_H - 6) / n
  const top = GROUND - CABINET_H
  return (
    <g>
      <rect x={cx - 24} y={top} width={48} height={CABINET_H} fill={SH.steel} stroke={SH.void} strokeWidth={1.4} />
      {Array.from({ length: n }, (_, i) => (
        <g key={i} data-fx={`drawer-${i}`}>
          <rect x={cx - 21} y={top + 3 + i * h} width={42} height={h - 2} fill={SH.gunmetal} stroke={SH.void} strokeWidth={1} />
          <rect data-fx={`tab-${i}`} x={cx - 6} y={top + 3 + i * h + h / 2 - 3} width={12} height={5} fill={SH.sepia} />
        </g>
      ))}
    </g>
  )
}

const work: SceneDef = {
  room: 'corridor',
  kit: null,
  back: ({ cx, count }) => <Cabinet cx={cx} count={count} />,
  front: NONE,
  bind: (stage, layout) => {
    const { count, cx } = layout
    const drawers = fxs(stage, 'drawer', count)
    const tabs = fxs(stage, 'tab', count)
    const x = cx - 56
    return (_p, f) => {
      const { at, act } = beatOf(f, count)
      drawers.forEach((drawer, i) => {
        const open = i === at && f > 0 ? ramp(act, 0, 0.35) * heldIn(act, at, count) : 0
        transformTo(drawer, `translate(${r1(-16 * open)} 0)`)
      })
      tabs.forEach((tab, i) => tab?.setAttribute('fill', beatShare(i, at, ramp(act, 0.5, 0.6)) >= 1 ? SH.flame : SH.sepia))
      if (f <= 0) return him(x, raiseLight(1))
      return him(x, mix(raiseLight(1), search(ramp(act, 0.1, 0.7)), heldIn(act, at, count)))
    }
  },
}

// ---------------------------------------------------------------- Tech: the crate down the corridor

const DOOR_SPACING = 76
const CRATE_H = 30

// One door per category down the corridor's wall, carried past him as he shoves the crate on.
function Doors({ from, count }: { from: number; count: number }) {
  return (
    <g data-fx="doors">
      {Array.from({ length: Math.max(count, 1) }, (_, i) => (
        <g key={i}>
          <rect x={from + i * DOOR_SPACING} y={GROUND - 84} width={34} height={72} fill={SH.void} stroke={SH.wood} strokeWidth={3} />
          <circle cx={from + i * DOOR_SPACING + 28} cy={GROUND - 46} r={1.8} fill={SH.brass} />
        </g>
      ))}
    </g>
  )
}

function Crate({ x }: { x: number }) {
  return (
    <g>
      <rect x={x} y={GROUND - CRATE_H} width={38} height={CRATE_H} fill={SH.wood} stroke={SH.void} strokeWidth={1.4} />
      <path d={`M${x} ${GROUND - CRATE_H} L${x + 38} ${GROUND} M${x + 38} ${GROUND - CRATE_H} L${x} ${GROUND}`} stroke={SH.sepia} strokeWidth={2.4} />
    </g>
  )
}

const crateAt = (layout: Layout): number => standOf(layout) + 18

const tech: SceneDef = {
  room: 'tech',
  kit: null,
  back: (layout) => <Doors from={crateAt(layout) + 60} count={layout.count} />,
  front: (layout) => <Crate x={crateAt(layout)} />,
  bind: (stage, layout) => {
    const { count } = layout
    const doors = fx(stage, 'doors')
    const x = standOf(layout)
    const top = crateAt(layout) + 12
    return (_p, f) => {
      const { offset, at, run, act } = trackAt(f, Math.max(count, 1), DOOR_SPACING, 0.5)
      transformTo(doors, `translate(${r1(-offset)} 0)`)
      if (f <= 0) return him(x, shove(0))
      if (run < 1) return him(x, shove(run * 2))
      if (at < count - 1) return him(x, mix(shove(0), raiseLight(1), ramp(act, 0.1, 0.4) * heldIn(act, at, count)))
      const climb = ramp(act, 0.1, 0.6)
      const up = mix(mix(shove(0), CROUCH, Math.sin(climb * Math.PI) * 0.6), raiseLight(1), ramp(act, 0.6, 0.9))
      return him(lerp(x, top, climb), up, K, GROUND - CRATE_H * climb - hop(climb, 14))
    }
  },
}

// ---------------------------------------------------------------- Services: the lock's dials

const DIAL_GAP = 15
const LOCK_Y = 186

const lockLeft = ({ cx, count }: Layout): number => cx - (Math.max(count, 1) * DIAL_GAP + 10) / 2 + 8

// The lock box on its stand, one dial per service; a dial's pip lights once it is set, the shackle springs
// at the last.
function Lock({ layout }: { layout: Layout }) {
  const n = Math.max(layout.count, 1)
  const w = n * DIAL_GAP + 10
  const left = lockLeft(layout)
  return (
    <g>
      <rect x={left + w / 2 - 4} y={LOCK_Y + 20} width={8} height={GROUND - LOCK_Y - 20} fill={SH.wood} />
      <path data-fx="shackle" d={`M${left + 10} ${LOCK_Y} V${LOCK_Y - 12} Q${left + w / 2} ${LOCK_Y - 30} ${left + w - 10} ${LOCK_Y - 12} V${LOCK_Y}`} fill="none" stroke={SH.steel} strokeWidth={5} />
      <rect x={left} y={LOCK_Y} width={w} height={22} fill={SH.brass} stroke={SH.void} strokeWidth={1.4} />
      {Array.from({ length: n }, (_, i) => {
        const dx = left + 12 + i * DIAL_GAP
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

const services: SceneDef = {
  room: 'store',
  kit: null,
  back: (layout) => <Lock layout={layout} />,
  front: NONE,
  bind: (stage, layout) => {
    const { count } = layout
    const dials = fxs(stage, 'dial', count)
    const pips = fxs(stage, 'pip', count)
    const shackle = fx(stage, 'shackle')
    const left = lockLeft(layout)
    const x = left - 30
    return (_p, f) => {
      const { at, act } = beatOf(f, count)
      dials.forEach((dial, i) => {
        const dx = left + 12 + i * DIAL_GAP
        transformTo(dial, `rotate(${r1(216 * beatShare(i, at, ramp(act, 0, 0.8)))} ${dx} ${LOCK_Y + 9})`)
      })
      pips.forEach((pip, i) => fadeTo(pip, beatShare(i, at, ramp(act, 0.8, 0.9))))
      const open = at === count - 1 ? ramp(act, 0.9, 1) : 0
      transformTo(shackle, `translate(0 ${r1(-8 * open)})`)
      if (f <= 0) return him(x, raiseLight(1))
      return him(x, mix(raiseLight(1), turn(ramp(act, 0, 0.8)), ramp(act, 0, 0.15) * heldIn(act, at, count)))
    }
  },
}

// ---------------------------------------------------------------- Projects: one shot per shape

// One shape at a time comes out of the dark at the same spot, so a long list never crowds the room: the one
// for the card in play walks in, takes the shot, falls and fades before the next comes.
const SHAPE_K = 0.8
const shapeAt = ({ cx }: Layout): number => cx + 20

function Shapes({ layout }: { layout: Layout }) {
  return (
    <>
      {Array.from({ length: layout.count }, (_, i) => (
        <g key={i} data-fx={`shape-${i}`} transform={`translate(${r1(shapeAt(layout) + 40)} ${GROUND}) scale(${SHAPE_K})`} opacity={0}>
          <Shape />
        </g>
      ))}
    </>
  )
}

function Shot({ count }: { count: number }) {
  return (
    <>
      <circle data-fx="flash" r={5} fill={SH.flame} opacity={0} />
      {Array.from({ length: count }, (_, i) => (
        <rect key={i} data-fx={`shell-${i}`} x={-1.2} y={-2.4} width={2.4} height={4.8} fill={SH.brass} opacity={0} />
      ))}
    </>
  )
}

const projects: SceneDef = {
  room: 'projects',
  kit: null,
  back: (layout) => <Shapes layout={layout} />,
  front: ({ count }) => <Shot count={count} />,
  bind: (stage, layout) => {
    const { count } = layout
    const spot = shapeAt(layout)
    const shapes = fxs(stage, 'shape', count)
    const shells = fxs(stage, 'shell', count)
    const flash = fx(stage, 'flash')
    const x = standOf(layout)
    return (_p, f) => {
      const { at, act } = beatOf(f, count)
      const recoil = f > 0 ? ramp(act, 0.5, 0.55) * (1 - ramp(act, 0.55, 0.75)) : 0
      const state = f <= 0 ? him(x, raiseLight(1)) : him(x, { ...aim(ramp(act, 0, 0.35)), foreRight: -4 - 20 * recoil })
      const [mx, my] = muzzle(state)
      transformTo(flash, `translate(${r1(mx)} ${r1(my)})`)
      fadeTo(flash, recoil)
      shapes.forEach((shape, i) => {
        const near = f > 0 ? beatShare(i, at, ramp(act, 0, 0.5)) : 0
        const down = f > 0 ? beatShare(i, at, ramp(act, 0.55, 0.8)) : 0
        const gone = i < at ? 1 : i === at && at < count - 1 ? ramp(act, 0.85, 1) : 0
        transformTo(shape, `translate(${r1(spot + 40 - 40 * near)} ${GROUND}) rotate(${r1(80 * down)}) scale(${SHAPE_K})`)
        fadeTo(shape, i === at || (i === 0 && f <= 0) ? (0.35 + 0.65 * near) * (1 - 0.4 * down) * (1 - gone) : 0)
      })
      shells.forEach((shell, i) => {
        const fall = f > 0 ? beatShare(i, at, ramp(act, 0.55, 0.8)) : 0
        transformTo(shell, `translate(${r1(x - 4 - 7 * (i % 4))} ${r1(my + drop(fall, GROUND - 2 - my))}) rotate(${r1(300 * fall)})`)
        fadeTo(shell, fall > 0 && i > at - 4 ? 1 : 0)
      })
      return state
    }
  },
}

// ---------------------------------------------------------------- Ventures: hiding from the pursuer

const PURSUER_K = 0.72

function Chest({ x }: { x: number }) {
  return (
    <g>
      <rect x={x} y={GROUND - 44} width={46} height={44} fill={SH.wood} stroke={SH.void} strokeWidth={1.4} />
      <path d={`M${x} ${GROUND - 30} H${x + 46}`} stroke={SH.sepia} strokeWidth={3} />
      <rect x={x + 20} y={GROUND - 36} width={6} height={8} fill={SH.brass} />
    </g>
  )
}

const pursuerPath = ({ phone }: Layout): readonly [number, number] => (phone ? [440, 150] : [560, 250])

const ventures: SceneDef = {
  room: 'ventures',
  kit: null,
  back: (layout) => (
    <g data-fx="pursuer" transform={`translate(${pursuerPath(layout)[0]} ${GROUND - 6}) scale(${PURSUER_K})`}>
      <Pursuer />
    </g>
  ),
  front: (layout) => <Chest x={standOf(layout) + 4} />,
  bind: (stage, layout) => {
    const { count } = layout
    const pursuer = fx(stage, 'pursuer')
    const camera = fx(stage, 'camera')
    const x = standOf(layout)
    const [from, to] = pursuerPath(layout)
    return (p, f) => {
      const { at, act } = beatOf(f, count)
      const walked = f <= 0 ? 0 : (at + act) / Math.max(count, 1)
      const step = (walked * Math.max(count, 1) * 3) % 1
      const gone = at === count - 1 ? ramp(act, 0.8, 1) : 0
      transformTo(pursuer, `translate(${r1(lerp(from, to, walked))} ${r1(GROUND - 6 - hop(step, 2))}) scale(${PURSUER_K})`)
      fadeTo(pursuer, (f > 0 ? 1 : 0.4) * (1 - gone))
      transformTo(camera, focusOn(x + 30, GROUND - 50, 1.3 - 0.3 * ramp(f, 0, 0.8)))
      const crouch = ramp(p, 0.08, 0.25)
      return him(x, mix(mix(raiseLight(1), CROUCH, crouch), raiseLight(1), gone))
    }
  },
}

// ---------------------------------------------------------------- Bands: the gallery's lamps

const LAMP_Y = 156

function Lamps({ xs }: { xs: number[] }) {
  return (
    <>
      {xs.map((x, i) => (
        <g key={x}>
          <path d={`M${x} ${LAMP_Y + 14} V${LAMP_Y + 22} M${x - 6} ${LAMP_Y + 22} H${x + 6}`} stroke={SH.brass} strokeWidth={2} />
          <path d={`M${x - 5} ${LAMP_Y} H${x + 5} L${x + 4} ${LAMP_Y + 14} H${x - 4} Z`} fill={SH.void} stroke={SH.brass} strokeWidth={1.2} />
          <g data-fx={`lamp-${i}`} opacity={0}>
            <circle cx={x} cy={LAMP_Y + 7} r={22} fill={SH.flame} opacity={0.2} />
            <ellipse cx={x} cy={LAMP_Y + 8} rx={2.4} ry={4.4} fill={SH.flame} />
          </g>
        </g>
      ))}
    </>
  )
}

const bands: SceneDef = {
  room: 'bands',
  kit: null,
  back: ({ xs, count }) => (count === 0 ? null : <Lamps xs={xs} />),
  front: NONE,
  bind: (stage, layout) => {
    const { count, xs } = layout
    const lamps = fxs(stage, 'lamp', count)
    const start = standOf(layout)
    const spot = (i: number): number => (i < 0 ? start : xs[i] - 16)
    return (_p, f) => {
      const { at, run, act } = trackAt(f, Math.max(count, 1), 0, 0.5)
      lamps.forEach((lamp, i) => fadeTo(lamp, f > 0 ? beatShare(i, at, ramp(act, 0.4, 0.6)) : 0))
      if (f <= 0 || count === 0) return him(start, raiseLight(1))
      const x = lerp(spot(at - 1), spot(at), trackEase(run))
      if (run < 1) return him(x, walk(run * 2))
      return him(x, reach(ramp(act, 0, 0.5) * heldIn(act, at, count)))
    }
  },
}

// ---------------------------------------------------------------- Muay Thai: block and kick

const muayThai: SceneDef = {
  room: 'gym',
  kit: null,
  back: NONE,
  front: (layout) => (
    <g data-fx="rival" transform={`translate(${standOf(layout) + 52} ${GROUND}) scale(${SHAPE_K})`}>
      <Shape />
    </g>
  ),
  bind: (stage, layout) => {
    const { count } = layout
    const rival = fx(stage, 'rival')
    const camera = fx(stage, 'camera')
    const x = standOf(layout)
    const at0 = x + 52
    return (_p, f) => {
      const { at, act } = beatOf(f, count)
      const last = at === count - 1
      const lunge = f > 0 ? ramp(act, 0, 0.3) * (1 - ramp(act, 0.4, 0.55)) : 0
      const knocked = f > 0 ? ramp(act, 0.55, 0.75) * heldIn(act, at, count) : 0
      const down = last && f > 0 ? ramp(act, 0.65, 0.85) : 0
      transformTo(rival, `translate(${r1(at0 - 14 * lunge + 18 * knocked)} ${GROUND}) rotate(${r1(80 * down)}) scale(${SHAPE_K})`)
      transformTo(camera, focusOn(x + 30, GROUND - 50, 1 + 0.2 * (last ? ramp(act, 0.2, 0.6) : 0)))
      if (f <= 0) return him(x, GUARD)
      const pose = act < 0.45 ? mix(GUARD, block(1), ramp(act, 0.15, 0.3)) : kick(ramp(act, 0.45, 0.75) * (last ? 1 : heldIn(act, at, count)))
      return him(x, pose)
    }
  },
}

// ---------------------------------------------------------------- Contact: out of the front door at dawn

const doorAt = ({ cx }: Layout): number => cx + 10
const BAR_Y = GROUND - 44

// The front door in its frame, the dawn behind it; the leaf swings in on its far hinge, the bar across it.
function FrontDoor({ x }: { x: number }) {
  return (
    <g>
      <rect x={x - 22} y={GROUND - 86} width={44} height={86} fill={SH.void} stroke={SH.sepia} strokeWidth={4} />
      <rect data-fx="dawn" x={x - 20} y={GROUND - 84} width={40} height={84} fill={SH.dawn} opacity={0} />
      <g data-fx="leaf">
        <rect x={x - 20} y={GROUND - 84} width={40} height={84} fill={SH.wood} stroke={SH.void} strokeWidth={1.2} />
        <rect x={x - 14} y={GROUND - 76} width={28} height={30} fill="none" stroke={SH.sepia} strokeWidth={2} />
        <circle cx={x - 14} cy={GROUND - 40} r={2} fill={SH.brass} />
      </g>
    </g>
  )
}

function Bar() {
  return <rect data-fx="bar" x={-28} y={-3} width={56} height={6} fill={SH.rust} stroke={SH.void} strokeWidth={1} />
}

const contact: SceneDef = {
  room: 'contact',
  kit: null,
  back: (layout) => <FrontDoor x={doorAt(layout)} />,
  front: (layout) => (
    <g transform={`translate(${doorAt(layout)} ${BAR_Y})`}>
      <Bar />
    </g>
  ),
  bind: (stage, layout) => {
    const door = doorAt(layout)
    const bar = fx(stage, 'bar')
    const leaf = fx(stage, 'leaf')
    const dawn = fx(stage, 'dawn')
    const start = standOf(layout)
    const at = door - 30
    return (p) => {
      const to = ramp(p, 0.08, 0.3)
      const up = ramp(p, 0.32, 0.45)
      const fall = ramp(p, 0.55, 0.65)
      const open = ramp(p, 0.62, 0.74)
      const out = ramp(p, 0.75, 0.95)
      transformTo(bar, `translate(${r1(-26 * fall)} ${r1(-22 * up + drop(fall, 22 + 41))}) rotate(${r1(-70 * fall)})`)
      transformTo(leaf, `translate(${r1(door + 20)} 0) scale(${(1 - 0.85 * open).toFixed(3)} 1) translate(${r1(-door - 20)} 0)`)
      fadeTo(dawn, open)
      if (out > 0) return him(lerp(at, door, out), walk(out * 3), K, GROUND, 1 - ramp(out, 0.6, 1))
      if (to < 1) return him(lerp(start, at, to), to > 0 ? walk(to * 3) : raiseLight(1))
      return him(at, lift(up * (1 - ramp(p, 0.5, 0.6))))
    }
  },
}

const SCENE_DEFS: Record<SceneId, SceneDef> = { hero, about, work, tech, services, projects, ventures, bands, muayThai, contact }

export interface Scene {
  id: SceneId
  def: SceneDef
  layout: Layout
  /** His kit here: the scene's own, or the profession the page shows. */
  kit: Profession
  /** The section's slot; the hero and the contact have none. */
  slot: SectionSlot | null
}

type RecordWords = Pick<Labels, 'record' | 'years'>

const sceneOf = (id: SceneId, slot: SectionSlot | null, items: StageItems, profession: Profession, phone: boolean): Scene => {
  const def = SCENE_DEFS[id]
  return { id, def, layout: propLayout(items, BAND[phone ? 'phone' : 'wide'], phone), kit: def.kit ?? profession, slot }
}

const NO_ITEMS: StageItems = { lead: 0, count: 0 }

/** The page as scenes: the hero, one per section the profession shows in reading order, the contact. */
export const scenesOf = (slots: readonly SectionSlot[], profession: Profession, phone: boolean, aboutItems: number, labels: RecordWords): Scene[] => [
  sceneOf('hero', null, NO_ITEMS, profession, phone),
  ...slots.map((slot) => sceneOf(slot.id, slot, stageItems(slot, labels, aboutItems), profession, phone)),
  sceneOf('contact', null, NO_ITEMS, profession, phone),
]
