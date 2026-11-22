import { forwardRef } from 'react'
import type { Pose } from './motion'
import { FIGURE } from './palette'

// The runner: him as an original bandicoot styled hero, running down the corridor ahead of the camera, seen
// from behind. Orange fur, two upright pointed ears and his dark hair as the spiky tuft on top; rolled
// jeans and red high tops; brown fingerless gloves; a small chrono pack on his back whose ring glows in the
// colour of the era he is in. When he stops to act at a prop (and in the hub) he turns his head to the
// camera and shows his own face: his skin on the long muzzle with the big black nose, his short boxed beard
// on the jaw inside an orange fur rim, the wide toothy grin through it, his thick brows angled in and his
// black oval pupils in big close set eyes.
//
// Every pose is a set of numbers (motion.ts) the scroll picks; applyPose writes them into the parts as SVG
// transform attributes and the face's opacity. Nothing here keeps time. Feet at 0,0; y up is negative.

const r1 = (n: number): number => Math.round(n * 10) / 10

const HIP_L = [-21, -128] as const
const HIP_R = [21, -128] as const
const KNEE_Y = -70
const SHOULDER_L = [-44, -214] as const
const SHOULDER_R = [44, -214] as const
const ELBOW_Y = -170

export const FIGURE_BOX = { x: -170, y: -370, w: 340, h: 400 }

/** The runner is laid out at this share of world size and scaled up on top (a cheap raster). */
export const FIGURE_RASTER = 0.8

const LINE = FIGURE.line

const Limb = ({ name, x, top, length, width, colour }: { name: string; x: number; top: number; length: number; width: number; colour: string }) => (
  <rect data-f={name} x={x - width / 2} y={top} width={width} height={length} rx={width / 2} fill={colour} stroke={LINE} strokeWidth={3} />
)

function Leg({ side, hip }: { side: 'L' | 'R'; hip: readonly [number, number] }) {
  const [hx] = hip
  return (
    <g data-f={`leg${side}`}>
      <Limb name={`thigh${side}`} x={hx} top={-138} length={72} width={30} colour={FIGURE.jeans} />
      <path d={`M ${hx - 6} -130 V -78`} stroke={FIGURE.jeansShade} strokeWidth={4} strokeLinecap="round" />
      <g data-f={`shin${side}`}>
        <Limb name={`calf${side}`} x={hx} top={KNEE_Y - 6} length={48} width={26} colour={FIGURE.jeans} />
        <rect x={hx - 16} y={-36} width={32} height={12} rx={4} fill={FIGURE.cuff} stroke={LINE} strokeWidth={3} />
        <path d={`M ${hx - 19} -26 H ${hx + 19} L ${hx + 21} -4 Q ${hx} 2 ${hx - 21} -4 Z`} fill={FIGURE.shoe} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
        <path d={`M ${hx - 14} -20 H ${hx + 14}`} stroke={FIGURE.shoeShade} strokeWidth={4} strokeLinecap="round" />
        <rect x={hx - 21} y={-7} width={42} height={7} rx={3} fill={FIGURE.sole} stroke={LINE} strokeWidth={2.4} />
      </g>
    </g>
  )
}

function Arm({ side, shoulder, stickDir }: { side: 'L' | 'R'; shoulder: readonly [number, number]; stickDir: 1 | -1 }) {
  const [sx] = shoulder
  return (
    <g data-f={`arm${side}`}>
      <Limb name={`upper${side}`} x={sx} top={-226} length={60} width={22} colour={FIGURE.fur} />
      <g data-f={`fore${side}`}>
        <Limb name={`lower${side}`} x={sx} top={ELBOW_Y - 6} length={46} width={18} colour={FIGURE.fur} />
        <path d={`M ${sx - 10} -118 q -2 12 4 14 q 3 1 4 -3 q 2 5 6 3 q 4 -2 2 -9 Z`} fill={FIGURE.skin} stroke={LINE} strokeWidth={2.4} strokeLinejoin="round" />
        <circle cx={sx} cy={-124} r={15} fill={FIGURE.glove} stroke={LINE} strokeWidth={3} />
        <path data-f={`stick${side}`} d={`M ${sx} -124 l ${stickDir * 30} 62`} stroke={FIGURE.stick} strokeWidth={7} strokeLinecap="round" opacity={0} />
      </g>
    </g>
  )
}

// His head, the same skull from behind and in front: ears up and back, the hair tuft on the crown.
const SKULL = { cx: 0, cy: -276, rx: 46, ry: 43 }
const EAR_L = 'M -36 -300 Q -52 -330 -50 -366 Q -26 -342 -14 -312 Z'
const EAR_R = 'M 36 -300 Q 52 -330 50 -366 Q 26 -342 14 -312 Z'
const EAR_INNER_L = 'M -32 -306 Q -44 -328 -44 -350 Q -28 -334 -20 -314 Z'
const EAR_INNER_R = 'M 32 -306 Q 44 -328 44 -350 Q 28 -334 20 -314 Z'
const TUFT = 'M -24 -312 L -22 -338 L -12 -324 L -4 -352 L 4 -326 L 14 -344 L 18 -322 L 28 -332 L 26 -310 Q 0 -322 -24 -312 Z'
// The beard as it shows from behind: the boxed edge along each side of his jaw, inside the fur rim.
const BEARD_SIDES = 'M -40 -262 Q -40 -242 -30 -236 L -27 -246 Q -34 -252 -35 -264 Z M 40 -262 Q 40 -242 30 -236 L 27 -246 Q 34 -252 35 -264 Z'
const BROW_L = 'M -32 -306 L -5 -300 L -6 -293 L -32 -298 Z'
const BROW_R = 'M 32 -306 L 5 -300 L 6 -293 L 32 -298 Z'
const MUZZLE = 'M -32 -262 Q -34 -284 0 -284 Q 34 -284 32 -262 Q 30 -242 0 -240 Q -30 -242 -32 -262 Z'
const BEARD = 'M -38 -262 Q -40 -236 -24 -228 Q 0 -219 24 -228 Q 40 -236 38 -262 Q 30 -248 0 -246 Q -30 -248 -38 -262 Z'
const MOUSTACHE = 'M -22 -256 Q -10 -264 0 -258 Q 10 -264 22 -256 Q 10 -254 0 -254 Q -10 -254 -22 -256 Z'
const MOUTH = 'M -24 -254 Q 0 -242 24 -254 Q 20 -234 0 -232 Q -20 -234 -24 -254 Z'
const TEETH = 'M -22 -253 Q 0 -242 22 -253 L 20 -246 Q 0 -238 -20 -246 Z'

function Head() {
  return (
    <g data-f="head">
      <path d={EAR_L} fill={FIGURE.furShade} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
      <path d={EAR_R} fill={FIGURE.furShade} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
      <ellipse {...SKULL} fill={FIGURE.fur} stroke={LINE} strokeWidth={3.4} />
      <ellipse cx={-14} cy={-300} rx={16} ry={7} fill={FIGURE.furLit} opacity={0.6} transform="rotate(-16 -14 -300)" />
      <g data-f="nape">
        <path d={BEARD_SIDES} fill={FIGURE.beard} />
        <path d="M -20 -244 Q 0 -238 20 -244" fill="none" stroke={FIGURE.furShade} strokeWidth={4} strokeLinecap="round" />
      </g>
      <g data-f="face" opacity={0}>
        <path d={EAR_INNER_L} fill={FIGURE.earInner} />
        <path d={EAR_INNER_R} fill={FIGURE.earInner} />
        <path d={BEARD} fill={FIGURE.beard} />
        <path d={MUZZLE} fill={FIGURE.skin} stroke={LINE} strokeWidth={2.6} strokeLinejoin="round" />
        <path d="M -26 -262 Q -26 -276 -12 -280" fill="none" stroke={FIGURE.skinShade} strokeWidth={4} strokeLinecap="round" />
        <path d={MOUTH} fill={FIGURE.mouth} stroke={LINE} strokeWidth={2.4} strokeLinejoin="round" />
        <path d={TEETH} fill={FIGURE.teeth} />
        <path d="M -12 -250 V -242 M 0 -248 V -240 M 12 -250 V -242" stroke={LINE} strokeWidth={1.6} />
        <path d={MOUSTACHE} fill={FIGURE.beard} />
        <ellipse cx={0} cy={-270} rx={10} ry={7} fill={FIGURE.nose} />
        <ellipse cx={-3} cy={-273} rx={3.4} ry={1.8} fill="#fff" opacity={0.6} />
        <ellipse cx={-14} cy={-294} rx={11} ry={14} fill={FIGURE.eyeWhite} stroke={LINE} strokeWidth={2.4} />
        <ellipse cx={14} cy={-294} rx={11} ry={14} fill={FIGURE.eyeWhite} stroke={LINE} strokeWidth={2.4} />
        <ellipse cx={-11} cy={-291} rx={4.6} ry={7} fill={FIGURE.eyes} />
        <ellipse cx={11} cy={-291} rx={4.6} ry={7} fill={FIGURE.eyes} />
        <circle cx={-9.6} cy={-294} r={1.8} fill="#fff" />
        <circle cx={12.4} cy={-294} r={1.8} fill="#fff" />
        <path d={BROW_L} fill={FIGURE.hair} stroke={LINE} strokeWidth={1.6} strokeLinejoin="round" />
        <path d={BROW_R} fill={FIGURE.hair} stroke={LINE} strokeWidth={1.6} strokeLinejoin="round" />
      </g>
      <path d={TUFT} fill={FIGURE.hair} stroke={LINE} strokeWidth={2.4} strokeLinejoin="round" />
    </g>
  )
}

/** The runner's svg, laid out at FIGURE_RASTER of its world size; the stage scales and places it. */
export const Runner = forwardRef<SVGSVGElement>(function Runner(_, ref) {
  return (
    <svg
      ref={ref}
      viewBox={`${FIGURE_BOX.x} ${FIGURE_BOX.y} ${FIGURE_BOX.w} ${FIGURE_BOX.h}`}
      width={FIGURE_BOX.w * FIGURE_RASTER}
      height={FIGURE_BOX.h * FIGURE_RASTER}
      focusable="false"
      className="block overflow-visible"
    >
      <ellipse data-f="shadow" cx={0} cy={4} rx={70} ry={14} fill="#000" opacity={0.5} />
      <g data-f="root">
        <Leg side="L" hip={HIP_L} />
        <Leg side="R" hip={HIP_R} />
        <path d="M -50 -224 Q 0 -244 50 -224 Q 58 -178 38 -134 Q 0 -124 -38 -134 Q -58 -178 -50 -224 Z" fill={FIGURE.fur} stroke={LINE} strokeWidth={3.4} strokeLinejoin="round" />
        <path d="M -30 -214 Q -40 -180 -30 -146" fill="none" stroke={FIGURE.furShade} strokeWidth={5} strokeLinecap="round" />
        <path d="M -40 -150 H 40 L 42 -122 Q 0 -114 -42 -122 Z" fill={FIGURE.jeans} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
        <path d="M -40 -142 H 40" stroke={FIGURE.jeansShade} strokeWidth={3} />
        <Arm side="L" shoulder={SHOULDER_L} stickDir={-1} />
        <Arm side="R" shoulder={SHOULDER_R} stickDir={1} />
        <g data-f="pack">
          <rect x={-26} y={-214} width={52} height={54} rx={14} fill={FIGURE.pack} stroke={LINE} strokeWidth={3} />
          <circle cx={0} cy={-187} r={24} className="np-pack-halo" />
          <circle cx={0} cy={-187} r={15} fill="none" className="np-pack-ring" strokeWidth={6} />
          <circle cx={0} cy={-187} r={6} className="np-pack-core" />
        </g>
        <g data-f="chest" opacity={0}>
          <path d="M -24 -218 Q 0 -226 24 -218 Q 30 -184 18 -152 Q 0 -146 -18 -152 Q -30 -184 -24 -218 Z" fill={FIGURE.furLit} />
          <path d="M 0 -136 q -9 -5 -9 1 q 0 5 9 0 q 9 -5 9 1 q 0 5 -9 -1 M -2 -135 l -4 10 M 2 -135 l 4 10" fill="none" stroke={FIGURE.sole} strokeWidth={2.6} strokeLinecap="round" />
        </g>
        <Head />
      </g>
    </svg>
  )
})

/** The runner's parts by name, read once after mount. */
export type RunnerParts = Record<string, SVGElement>

export const runnerParts = (svg: SVGSVGElement): RunnerParts =>
  Object.fromEntries([...svg.querySelectorAll<SVGElement>('[data-f]')].map((part) => [part.dataset.f, part]))

const pct = (n: number): string => String(Math.round(n * 100) / 100)

/** Writes a pose into the runner's parts. */
export function applyPose(parts: RunnerParts, pose: Pose): void {
  const set = (name: string, value: string) => parts[name].setAttribute('transform', value)
  set('root', `translate(0 ${r1(pose.jump)}) rotate(${r1(pose.lean)} 0 -140) scale(${pct(pose.spin)} 1)`)
  set('legL', `translate(0 ${r1(-pose.liftL)}) rotate(${r1(pose.rotL)} ${HIP_L[0]} ${HIP_L[1]})`)
  set('legR', `translate(0 ${r1(-pose.liftR)}) rotate(${r1(pose.rotR)} ${HIP_R[0]} ${HIP_R[1]})`)
  set('shinL', `translate(0 ${KNEE_Y}) scale(1 ${pct(pose.bendL)}) translate(0 ${-KNEE_Y})`)
  set('shinR', `translate(0 ${KNEE_Y}) scale(1 ${pct(pose.bendR)}) translate(0 ${-KNEE_Y})`)
  set('armL', `rotate(${r1(pose.aL)} ${SHOULDER_L[0]} ${SHOULDER_L[1]}) translate(0 ${SHOULDER_L[1]}) scale(1 ${pct(pose.sL)}) translate(0 ${-SHOULDER_L[1]})`)
  set('armR', `rotate(${r1(pose.aR)} ${SHOULDER_R[0]} ${SHOULDER_R[1]}) translate(0 ${SHOULDER_R[1]}) scale(1 ${pct(pose.sR)}) translate(0 ${-SHOULDER_R[1]})`)
  set('foreL', `rotate(${r1(pose.fL)} ${SHOULDER_L[0]} ${ELBOW_Y})`)
  set('foreR', `rotate(${r1(pose.fR)} ${SHOULDER_R[0]} ${ELBOW_Y})`)
  set('shadow', `scale(${pct(1 + pose.jump / 260)} 1)`)
  // A turned head bobs a little with the stride, so the head keeps the run's rhythm.
  set('head', `translate(0 ${r1(Math.sin(pose.wave * 2) * 2 * (1 - pose.look))})`)
  parts.stickL.setAttribute('opacity', pct(pose.sticks))
  parts.stickR.setAttribute('opacity', pct(pose.sticks))
  parts.face.setAttribute('opacity', pct(pose.look))
  parts.nape.setAttribute('opacity', pct(1 - pose.look))
  // Facing the camera he shows his chest; from behind, the chrono pack on his back.
  parts.chest.setAttribute('opacity', pct(pose.look))
  parts.pack.setAttribute('opacity', pct(1 - pose.look))
}
