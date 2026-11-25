import type { ReactNode } from 'react'
import { rigJoints, setRigPose, type RigJoints } from '../shared/rig'
import { fadeTo, transformTo } from '../shared/stageNodes'
import { FIGURE as F } from './palette'
import { PARTS, type Part, type SidePose } from './sidePose'
import s from './side.module.css'

// The runner side on, for the moves seen from the side (a run across the screen, the slam, the kick): the
// same hero the corridor shows from behind and from the front (runner.tsx), facing right, drawn as the time travelling cartoon
// platformer draws its hero: a big neckless head with a long muzzle, upright pointed ears, a lean furred body,
// long legs, big gloves and big sneakers, all in a thick ink line. Orange fur with the light chest; on the
// muzzle his own skin with the big black nose, his short dark beard on the jaw, his thick brows and his dark
// eye; his dark hair as the spiky tuft on top; the wide toothy grin; rolled jeans, brown gloves, red sneakers.
//
// The parts are groups that turn round their own joints (side.module.css), posed on the shared rig
// (sidePose.ts, setSidePose below). The whole figure squashes and stretches from his soles
// ([data-part="squash"]); the head nods at the neck; the dust of a landing rests hidden until a pose shows it
// (the whirl of his spin is the runner's, round him whichever way he faces). Transform and opacity only.

// ---- shapes (viewBox 132 by 200, facing right, soles on y 192; the ears rise above the box) ----

const VIEW = { width: 132, height: 200 }

/** His viewBox and the point he stands on (between his soles). */
const SIDE = { ...VIEW, soleX: 66, soleY: 192 }

const LINE = F.line

const HEAD = 'M38 50 C38 22 58 8 76 12 C92 16 99 30 97 42 L112 50 C120 55 118 67 108 69 L92 73 C82 86 56 88 46 78 C40 72 38 62 38 50 Z'
const MUZZLE = 'M76 46 L110 52 C117 57 115 66 107 68 L86 74 C77 72 72 60 76 46 Z'
const EAR = 'M46 26 L36 -12 L62 16 Z'
const EAR_INNER = 'M46 22 L41 -2 L56 16 Z'
const TUFT = 'M54 16 L57 -4 L64 11 L71 -8 L74 10 L82 -2 L82 16 Z'
const BEARD = 'M58 72 Q68 90 86 86 Q100 82 106 70 L90 74 Q74 78 58 72 Z'
const MOUTH = 'M80 60 Q95 67 110 61 Q106 73 94 74 Q84 72 80 60 Z'
const TEETH = 'M82 61.5 Q95 66.5 108 62 L107 65 Q95 69.5 83.5 64.5 Z'
const BROW = 'M72 22 L94 28'
const TORSO = 'M48 80 Q66 72 84 82 L86 120 Q66 128 46 122 Z'
const CHEST = 'M72 86 Q84 90 84 106 Q78 114 72 110 Z'
const SHORTS = 'M44 114 L88 114 L90 136 L42 136 Z'

const HIP = { back: 58, front: 72 }
const SHOULDER = { back: 54, front: 78 }

const sneaker = (x: number): string => `M${x - 10} 182 Q${x - 10} 175 ${x - 2} 175 L${x + 10} 177 Q${x + 24} 179 ${x + 24} 187 L${x + 24} 192 L${x - 12} 192 Z`

function Ink({ d, fill, width = 3 }: { d: string; fill: string; width?: number }) {
  return <path d={d} fill={fill} stroke={LINE} strokeWidth={width} strokeLinejoin="round" />
}

function Head() {
  return (
    <g data-part="head">
      <Ink d={EAR} fill={F.furShade} />
      <Ink d={HEAD} fill={F.fur} />
      <path d={EAR_INNER} fill={F.earInner} />
      <Ink d={TUFT} fill={F.hair} width={2.5} />
      <Ink d={MUZZLE} fill={F.skin} width={2} />
      <Ink d={BEARD} fill={F.beard} width={2} />
      <Ink d={MOUTH} fill={F.mouth} width={2.5} />
      <path d={TEETH} fill={F.teeth} />
      <ellipse cx={111} cy={54} rx={7} ry={5.5} fill={F.nose} />
      <ellipse cx={93} cy={34} rx={4} ry={9} fill={F.eyeWhite} stroke={LINE} strokeWidth={2} />
      <ellipse cx={80} cy={35} rx={9} ry={12} fill={F.eyeWhite} stroke={LINE} strokeWidth={2.5} />
      <ellipse cx={84} cy={37} rx={3.6} ry={5.4} fill={F.eyes} />
      <path d={BROW} stroke={F.hair} strokeWidth={5} strokeLinecap="round" />
    </g>
  )
}

function Leg({ side }: { side: 'back' | 'front' }) {
  const x = HIP[side]
  const shade = side === 'back'
  return (
    <g className={side === 'back' ? s.thighBack : s.thighFront}>
      <rect x={x - 8} y={124} width={16} height={38} rx={6} fill={shade ? F.jeansShade : F.jeans} stroke={LINE} strokeWidth={3} />
      <rect x={x - 8.5} y={156} width={17} height={7} rx={3} fill={F.cuff} stroke={LINE} strokeWidth={2} />
      <g className={side === 'back' ? s.shinBack : s.shinFront}>
        <rect x={x - 5} y={161} width={10} height={22} rx={4} fill={shade ? F.furShade : F.fur} stroke={LINE} strokeWidth={3} />
        <Ink d={sneaker(x)} fill={shade ? F.shoeShade : F.shoe} />
        <path d={`M${x - 11} 189 L${x + 23} 189`} stroke={F.sole} strokeWidth={4} />
      </g>
    </g>
  )
}

function Arm({ side }: { side: 'back' | 'front' }) {
  const x = SHOULDER[side]
  const shade = side === 'back'
  return (
    <g className={side === 'back' ? s.armBack : s.armFront}>
      <rect x={x - 5.5} y={84} width={11} height={31} rx={5} fill={shade ? F.furShade : F.fur} stroke={LINE} strokeWidth={3} />
      <g className={side === 'back' ? s.foreBack : s.foreFront}>
        <rect x={x - 5} y={110} width={10} height={24} rx={5} fill={shade ? F.furShade : F.fur} stroke={LINE} strokeWidth={3} />
        <rect x={x - 8} y={128} width={16} height={7} rx={3} fill={F.cuff} stroke={LINE} strokeWidth={2} />
        <ellipse cx={x + 1} cy={141} rx={11} ry={10} fill={shade ? F.gloveShade : F.glove} stroke={LINE} strokeWidth={3} />
        <path d={`M${x + 6} 136 Q${x + 12} 140 ${x + 8} 146`} fill="none" stroke={LINE} strokeWidth={2} />
      </g>
    </g>
  )
}

function Shown({ name, children }: { name: Part; children: ReactNode }) {
  return (
    <g data-part={name} opacity="0">
      {children}
    </g>
  )
}

/** Him side on, at rest, standing on 0,0 of the back view's units and as tall as it (`scale` of his own
 *  viewBox units); setSidePose poses him. */
export function SideFigure({ scale }: { scale: number }) {
  const width = VIEW.width * scale
  const height = VIEW.height * scale
  return (
    <svg x={-SIDE.soleX * scale} y={-SIDE.soleY * scale} width={width} height={height} viewBox={`0 0 ${VIEW.width} ${VIEW.height}`} overflow="visible">
      <g className={s.sprite}>
        <Shown name="dust">
          <ellipse cx={30} cy={186} rx={22} ry={9} fill={F.sole} opacity={0.7} />
          <ellipse cx={104} cy={186} rx={22} ry={9} fill={F.sole} opacity={0.7} />
        </Shown>
        <g data-part="squash">
          <g className={s.body}>
            <Arm side="back" />
            <Leg side="back" />
            <Leg side="front" />
            <Ink d={SHORTS} fill={F.jeans} />
            <Ink d={TORSO} fill={F.fur} />
            <path d={CHEST} fill={F.furLit} />
            <Head />
            <Arm side="front" />
          </g>
        </g>
      </g>
    </svg>
  )
}

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

export type SideJoints = RigJoints & { head: SVGElement | null; squash: SVGElement | null; parts: [Part, SVGElement | null][] }

const part = (root: Element, name: string): SVGElement | null => root.querySelector<SVGElement>(`[data-part="${name}"]`)

/** His groups inside `root`, the element that holds one SideFigure. */
export const sideJoints = (root: Element): SideJoints => ({
  ...rigJoints(root, LIMB_CLASSES),
  head: part(root, 'head'),
  squash: part(root, 'squash'),
  parts: PARTS.map((name) => [name, part(root, name)]),
})

// A stretch narrows him by this share of how much it lengthens him, so he keeps his bulk.
const BULK = 0.6

/** Writes `p` on his groups: the rig's limbs, the squash from his soles, the head's nod and what shows round
 *  him. Transforms and opacity only. */
export function setSidePose(j: SideJoints, p: SidePose): void {
  setRigPose(j, p)
  const { soleX, soleY } = SIDE
  transformTo(j.squash, `translate(${soleX} ${soleY}) scale(${(1 - BULK * p.stretch).toFixed(3)} ${(1 + p.stretch).toFixed(3)}) translate(${-soleX} ${-soleY})`)
  // the head nods at the neck
  transformTo(j.head, `rotate(${p.head.toFixed(1)} 66 80)`)
  j.parts.forEach(([name, el]) => fadeTo(el, p[name]))
}
