import { forwardRef } from 'react'
import type { Move } from './motion'
import { r1 } from '../shared/stageNodes'
import { FIGURE } from './palette'
import { setSidePose, SideFigure, sideJoints, type SideJoints } from './side'

// The runner: him as an original orange furred hero drawn as the time travelling cartoon platformer draws
// its hero (a big neckless head, upright pointed ears, a lean body, long legs, big gloves and big sneakers in
// a thick ink line), seen three ways as he turns. From behind, running into the screen: the big round orange
// head with the two ears up and his dark hair as the spiky tuft on top, the edge of his short dark beard
// either side of the jaw, the jeans rolled to the knee, brown gloves, big red sneakers, and a small chrono
// pack on his back whose ring glows in the colour of the era he is in. From the front, running at the
// camera: the same body with his face (the muzzle in his own skin, the big black nose, his short dark beard
// round the jaw, his thick brows, the grin), the light chest and the toe caps of his sneakers. Side on, for a
// run across the screen and the moves that show him whole: the side figure (side.tsx).
//
// Which one shows is his yaw (motion.ts), the way he faces in degrees: 0 from behind, 90 side on facing
// right, 180 the front, 270 (or -90) side on facing left. The front and back share one body (legs, arms,
// torso), drawn as wide as the cosine of the yaw, and swap their own parts (the face or the back of the
// head, the chest or the pack, toe caps or heel tabs) as the cosine changes sign; the side figure is drawn
// as wide as the sine, mirrored by its sign. The view swaps where the two widths meet, so a turn narrows the
// body and widens the profile out of it with no jump, and a spin passes back, side, front, side: a turn in
// depth, never a flat rotation on the screen.
//
// Every pose is a set of numbers (motion.ts) the corridor picks; applyPose writes them into the parts as SVG
// transform attributes and opacity. Nothing here keeps time. Feet at 0,0; y up is negative.

const HIP_L = [-19, -112] as const
const HIP_R = [19, -112] as const
const KNEE_Y = -57
const SHOULDER_L = [-42, -196] as const
const SHOULDER_R = [42, -196] as const
const ELBOW_Y = -146
const GLOVE_Y = -90

export const FIGURE_BOX = { x: -170, y: -370, w: 340, h: 400 }

/** The runner is laid out at this share of world size and scaled up on top (a cheap raster). */
export const FIGURE_RASTER = 0.8

// The side on figure's own units to these: his soles to the crown of his head as tall as from behind.
const SIDE_SCALE = 1.79

const LINE = FIGURE.line

const Limb = ({ x, top, length, width, colour }: { x: number; top: number; length: number; width: number; colour: string }) => (
  <rect x={x - width / 2} y={top} width={width} height={length} rx={width / 2} fill={colour} stroke={LINE} strokeWidth={3} />
)

function Leg({ side, hip }: { side: 'L' | 'R'; hip: readonly [number, number] }) {
  const [hx] = hip
  return (
    <g data-f={`leg${side}`}>
      <Limb x={hx} top={-122} length={70} width={30} colour={FIGURE.jeans} />
      <path d={`M ${hx - 6} -114 V -66`} stroke={FIGURE.jeansShade} strokeWidth={4} strokeLinecap="round" />
      <g data-f={`shin${side}`}>
        <rect x={hx - 17} y={-66} width={34} height={13} rx={5} fill={FIGURE.cuff} stroke={LINE} strokeWidth={3} />
        <Limb x={hx} top={KNEE_Y + 4} length={32} width={18} colour={FIGURE.fur} />
        <path d={`M ${hx - 22} -28 Q ${hx - 22} -36 ${hx - 12} -36 H ${hx + 12} Q ${hx + 22} -36 ${hx + 22} -28 L ${hx + 25} -8 Q ${hx} -2 ${hx - 25} -8 Z`} fill={FIGURE.shoe} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
        <path data-view="rear" d={`M ${hx - 9} -32 V -14 H ${hx + 9} V -32`} fill="none" stroke={FIGURE.shoeShade} strokeWidth={4} strokeLinejoin="round" />
        <path data-view="fore" d={`M ${hx - 20} -10 Q ${hx - 20} -24 ${hx} -24 Q ${hx + 20} -24 ${hx + 20} -10 Z`} fill={FIGURE.sole} stroke={LINE} strokeWidth={2.6} opacity={0} />
        <rect x={hx - 25} y={-10} width={50} height={10} rx={4} fill={FIGURE.sole} stroke={LINE} strokeWidth={2.6} />
      </g>
    </g>
  )
}

function Arm({ side, shoulder, stickDir }: { side: 'L' | 'R'; shoulder: readonly [number, number]; stickDir: 1 | -1 }) {
  const [sx] = shoulder
  return (
    <g data-f={`arm${side}`}>
      <Limb x={sx} top={-204} length={60} width={20} colour={FIGURE.fur} />
      <g data-f={`fore${side}`}>
        <Limb x={sx} top={ELBOW_Y - 6} length={46} width={18} colour={FIGURE.fur} />
        <rect x={sx - 14} y={-114} width={28} height={12} rx={5} fill={FIGURE.cuff} stroke={LINE} strokeWidth={2.6} />
        <circle cx={sx} cy={GLOVE_Y} r={19} fill={FIGURE.glove} stroke={LINE} strokeWidth={3} />
        <path d={`M ${sx - stickDir * 8} ${GLOVE_Y - 12} Q ${sx - stickDir * 16} ${GLOVE_Y - 2} ${sx - stickDir * 8} ${GLOVE_Y + 10}`} fill="none" stroke={FIGURE.gloveShade} strokeWidth={4} strokeLinecap="round" />
        <path data-f={`stick${side}`} d={`M ${sx} ${GLOVE_Y} l ${stickDir * 30} 62`} stroke={FIGURE.stick} strokeWidth={7} strokeLinecap="round" opacity={0} />
      </g>
    </g>
  )
}

// His head from behind: big, round and neckless, the ears up, the hair tuft on the crown, the beard's edge at the jaw.
const SKULL = { cx: 0, cy: -256, rx: 60, ry: 66 }
const EAR_L = 'M -46 -294 L -58 -366 L -14 -318 Z'
const EAR_R = 'M 46 -294 L 58 -366 L 14 -318 Z'
const TUFT = 'M -30 -316 L -26 -350 L -14 -330 L -4 -362 L 6 -332 L 18 -354 L 22 -328 L 32 -342 L 30 -312 Q 0 -324 -30 -316 Z'
const BEARD_SIDES = 'M -60 -246 Q -58 -208 -36 -196 L -34 -212 Q -48 -222 -52 -248 Z M 60 -246 Q 58 -208 36 -196 L 34 -212 Q 48 -222 52 -248 Z'

function BackHead() {
  return (
    <g data-view="rear">
      <path d={EAR_L} fill={FIGURE.furShade} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
      <path d={EAR_R} fill={FIGURE.furShade} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
      <ellipse {...SKULL} fill={FIGURE.fur} stroke={LINE} strokeWidth={3.6} />
      <ellipse cx={-20} cy={-292} rx={22} ry={9} fill={FIGURE.furLit} opacity={0.6} transform="rotate(-18 -20 -292)" />
      <path d={BEARD_SIDES} fill={FIGURE.beard} />
      <path d="M -30 -206 Q 0 -196 30 -206" fill="none" stroke={FIGURE.furShade} strokeWidth={5} strokeLinecap="round" />
      <path d={TUFT} fill={FIGURE.hair} stroke={LINE} strokeWidth={2.6} strokeLinejoin="round" />
    </g>
  )
}

// His face from the front, in the head's units: the muzzle of his own skin over the lower half, the beard
// round the jaw under it, the wide grin, the big nose, the two big eyes under thick brows.
const EAR_INNER_L = 'M -44 -300 L -52 -350 L -22 -318 Z'
const EAR_INNER_R = 'M 44 -300 L 52 -350 L 22 -318 Z'
const FRONT_BEARD = 'M -54 -250 Q -54 -200 0 -188 Q 54 -200 54 -250 Q 44 -214 0 -208 Q -44 -214 -54 -250 Z'
const MUZZLE = 'M -44 -244 Q -44 -276 0 -276 Q 44 -276 44 -244 Q 42 -212 0 -208 Q -42 -212 -44 -244 Z'
const GRIN = 'M -30 -236 Q 0 -232 30 -236 Q 24 -212 0 -210 Q -24 -212 -30 -236 Z'
const TEETH = 'M -27 -235 Q 0 -231 27 -235 L 24 -228 Q 0 -224 -24 -228 Z'
const BROWS = 'M -38 -308 L -8 -300 M 38 -308 L 8 -300'

function FrontHead() {
  return (
    <g data-view="fore" opacity={0}>
      <path d={EAR_L} fill={FIGURE.furShade} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
      <path d={EAR_R} fill={FIGURE.furShade} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
      <path d={EAR_INNER_L} fill={FIGURE.earInner} />
      <path d={EAR_INNER_R} fill={FIGURE.earInner} />
      <ellipse {...SKULL} fill={FIGURE.fur} stroke={LINE} strokeWidth={3.6} />
      <path d={FRONT_BEARD} fill={FIGURE.beard} stroke={LINE} strokeWidth={2.6} strokeLinejoin="round" />
      <path d={MUZZLE} fill={FIGURE.skin} stroke={LINE} strokeWidth={2.6} />
      <path d={GRIN} fill={FIGURE.mouth} stroke={LINE} strokeWidth={2.6} strokeLinejoin="round" />
      <path d={TEETH} fill={FIGURE.teeth} />
      <ellipse cx={0} cy={-254} rx={13} ry={9} fill={FIGURE.nose} />
      <ellipse cx={-20} cy={-284} rx={14} ry={18} fill={FIGURE.eyeWhite} stroke={LINE} strokeWidth={2.6} />
      <ellipse cx={20} cy={-284} rx={14} ry={18} fill={FIGURE.eyeWhite} stroke={LINE} strokeWidth={2.6} />
      <ellipse cx={-16} cy={-281} rx={5.5} ry={8.5} fill={FIGURE.eyes} />
      <ellipse cx={16} cy={-281} rx={5.5} ry={8.5} fill={FIGURE.eyes} />
      <path d={BROWS} stroke={FIGURE.hair} strokeWidth={7} strokeLinecap="round" />
      <path d={TUFT} fill={FIGURE.hair} stroke={LINE} strokeWidth={2.6} strokeLinejoin="round" />
    </g>
  )
}

/** His head: the back of it and his face, one shown as he turns; it bobs a little with the stride. */
function Head() {
  return (
    <g data-f="head">
      <BackHead />
      <FrontHead />
    </g>
  )
}

// The whirl of the spin round him, in the side figure's units laid over his (SIDE_SCALE, his soles
// at 66, 192 of its viewBox), so it is the same whirl whichever way he faces.
const Whirl = () => (
  <g data-f="whirl" opacity={0}>
    <g transform={`scale(${SIDE_SCALE}) translate(-66 -192)`}>
      <ellipse cx={66} cy={110} rx={70} ry={86} fill={FIGURE.fur} opacity={0.35} />
      <path d="M-6 70 Q66 40 138 70 M-10 110 Q66 80 142 110 M-6 150 Q66 120 138 150" fill="none" stroke={FIGURE.furLit} strokeWidth={6} strokeLinecap="round" />
    </g>
  </g>
)

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
      <g data-f="boulder" opacity={0}>
        <g data-f="boulderRoll">
          <path d="M -150 -300 Q -40 -372 80 -350 Q 172 -300 168 -190 Q 176 -80 90 -26 Q -20 18 -120 -30 Q -182 -100 -174 -200 Q -178 -262 -150 -300 Z" fill={FIGURE.boulder} stroke={LINE} strokeWidth={6} />
          <path d="M -110 -250 L -60 -210 L -80 -150 M 40 -300 L 70 -240 L 130 -220 M -20 -120 L 30 -80" fill="none" stroke={LINE} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <ellipse cx={40} cy={-120} rx={120} ry={90} fill={FIGURE.boulderShade} opacity={0.45} />
        <ellipse cx={-70} cy={-280} rx={46} ry={20} fill={FIGURE.boulderLit} opacity={0.6} transform="rotate(-24 -70 -280)" />
      </g>
      <ellipse data-f="shadow" cx={0} cy={4} rx={70} ry={14} fill="#000" opacity={0.5} />
      <g data-f="board" opacity={0}>
        <path d="M -96 -2 Q -100 -18 -80 -20 H 80 Q 100 -18 96 -2 Q 90 8 70 8 H -70 Q -90 8 -96 -2 Z" fill={FIGURE.board} stroke={LINE} strokeWidth={3} />
        <path d="M -70 -10 H 70" stroke={FIGURE.boardStripe} strokeWidth={4} strokeLinecap="round" />
        <ellipse cx={-50} cy={14} rx={26} ry={6} className="np-pack-halo" />
        <ellipse cx={50} cy={14} rx={26} ry={6} className="np-pack-halo" />
      </g>
      <g data-f="frontal">
        <g data-f="root">
          <Leg side="L" hip={HIP_L} />
          <Leg side="R" hip={HIP_R} />
          <path d="M -40 -206 Q 0 -220 40 -206 Q 48 -160 36 -116 Q 0 -108 -36 -116 Q -48 -160 -40 -206 Z" fill={FIGURE.fur} stroke={LINE} strokeWidth={3.4} strokeLinejoin="round" />
          <path data-view="rear" d="M -24 -196 Q -34 -164 -24 -132" fill="none" stroke={FIGURE.furShade} strokeWidth={5} strokeLinecap="round" />
          <path data-view="fore" d="M -24 -202 Q 0 -192 24 -202 Q 28 -160 0 -140 Q -28 -160 -24 -202 Z" fill={FIGURE.furLit} opacity={0} />
          <path d="M -38 -136 H 38 L 40 -102 Q 0 -94 -40 -102 Z" fill={FIGURE.jeans} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
          <path d="M -38 -128 H 38" stroke={FIGURE.jeansShade} strokeWidth={3} />
          <circle data-view="fore" cx={0} cy={-120} r={4} fill={FIGURE.cuff} stroke={LINE} strokeWidth={2} opacity={0} />
          <Arm side="L" shoulder={SHOULDER_L} stickDir={-1} />
          <Arm side="R" shoulder={SHOULDER_R} stickDir={1} />
          <g data-view="rear">
            <rect x={-24} y={-190} width={48} height={46} rx={13} fill={FIGURE.pack} stroke={LINE} strokeWidth={3} />
            <circle cx={0} cy={-167} r={22} className="np-pack-halo" />
            <circle cx={0} cy={-167} r={14} fill="none" className="np-pack-ring" strokeWidth={6} />
            <circle cx={0} cy={-167} r={5.5} className="np-pack-core" />
          </g>
          <Head />
        </g>
      </g>
      <g data-f="side" opacity={0}>
        <SideFigure scale={SIDE_SCALE} />
      </g>
      <Whirl />
    </svg>
  )
})

/** The runner's parts: the front and back body's by name, what only the back or only the front shows, and
 *  the side on figure's joints. */
export interface RunnerParts {
  back: Record<string, SVGElement>
  rear: SVGElement[]
  fore: SVGElement[]
  side: SideJoints
}

export const runnerParts = (svg: SVGSVGElement): RunnerParts => {
  const back = Object.fromEntries([...svg.querySelectorAll<SVGElement>('[data-f]')].map((part) => [part.dataset.f, part]))
  const view = (name: string) => [...svg.querySelectorAll<SVGElement>(`[data-view="${name}"]`)]
  return { back, rear: view('rear'), fore: view('fore'), side: sideJoints(back.side) }
}

const pct = (n: number): string => String(Math.round(n * 100) / 100)

const showAll = (parts: readonly SVGElement[], shown: boolean): void => parts.forEach((part) => part.setAttribute('opacity', shown ? '1' : '0'))

/** Writes a move into the runner: the front and back body, the side on figure, and the turn between them. */
export function applyPose({ back: parts, rear, fore, side }: RunnerParts, { pose, side: sidePose, yaw }: Move): void {
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
  // The head bobs a little with the stride, so it keeps the run's rhythm.
  set('head', `translate(0 ${r1(Math.sin(pose.wave * 2) * 2)})`)
  parts.stickL.setAttribute('opacity', pct(pose.sticks))
  parts.stickR.setAttribute('opacity', pct(pose.sticks))
  parts.board.setAttribute('opacity', pct(pose.board))
  parts.boulder.setAttribute('opacity', pct(Math.min(1, pose.boulder * 4)))
  // The boulder grows as it closes in on him and rolls as it comes.
  set('boulder', `translate(0 -190) scale(${pct(0.6 + 0.4 * pose.boulder)}) translate(0 190)`)
  set('boulderRoll', `rotate(${r1(pose.boulder * 540)} 0 -190)`)
  set('whirl', `translate(0 ${r1(pose.jump)})`)
  parts.whirl.setAttribute('opacity', pct(sidePose.whirl))
  // The turn in depth: the body as wide as the cosine of his yaw, the profile as wide as its sine.
  const angle = (yaw * Math.PI) / 180
  const across = Math.cos(angle)
  const profile = Math.sin(angle)
  const sideways = Math.abs(profile) > Math.abs(across)
  set('frontal', `scale(${pct(Math.abs(across))} 1)`)
  set('side', `translate(0 ${r1(pose.jump)}) scale(${pct(profile)} 1)`)
  parts.frontal.setAttribute('opacity', sideways ? '0' : '1')
  parts.side.setAttribute('opacity', sideways ? '1' : '0')
  showAll(rear, across >= 0)
  showAll(fore, across < 0)
  if (sideways) setSidePose(side, sidePose)
}
