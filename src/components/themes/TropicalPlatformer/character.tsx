import { memo } from 'react'
import { HERO_IDENTITY } from '@/lib/cv/heroIdentity'
import type { Profession } from '@/lib/cv/professions'
import { STAND as RIG_STAND, type RigPose } from '@/lib/motion/rigPose'
import { rigJoints, setRigPose, type RigClasses, type RigJoints } from '../shared/rig'
import { COLORS as C } from './palette'
import figure from './character.module.css'

// Him as a jungle platformer hero, in his own clothes: round shaded volumes with a dark edge and a warm rim
// light from the level's sun, his short dark hair, his full dark beard, black oval eyes and his own skin.
// The System Engineer in a teal tee, jeans and trainers; the Musician in a black vest and black jeans with
// his sticks; the Martial Artist bare chested in red shorts, his hand wraps and his mongkhon, barefoot.
//
// On a page (the hero card, the profession plates) his poses are transform keyframes in
// character.module.css keyed off data-pose: a breath and a look round (idle), or a wave (the picked
// plate); each plays a set number of beats and rests within 5 s. On a stage (StageFigure) every limb turns
// at its joint on the shared rig (../shared/rig) and the scroll writes the pose.

export type HeroPose = 'idle' | 'wave'

const EDGE = C.shadow
const SKIN = HERO_IDENTITY.skin

interface Kit {
  shirt: string | null
  sleeve: boolean
  legs: string
  shorts: string | null
  feet: string | null
  hands: string
  sticks: boolean
}

const KIT: Record<Profession, Kit> = {
  engineer: { shirt: C.tee, sleeve: true, legs: C.jeans, shorts: null, feet: C.trainers, hands: SKIN, sticks: false },
  drummer: { shirt: C.vest, sleeve: false, legs: C.blackJeans, shorts: null, feet: C.shadowSoft, hands: SKIN, sticks: true },
  fighter: { shirt: null, sleeve: false, legs: SKIN, shorts: C.sunsetRed, feet: null, hands: C.parchment, sticks: false },
}

/** The rig's groups of his drawing, by the css module's classes. */
const RIG_CLASSES: RigClasses = {
  body: figure.body,
  armRight: figure.armRight,
  foreRight: figure.foreRight,
  armLeft: figure.armLeft,
  foreLeft: figure.foreLeft,
  thighRight: figure.thighRight,
  shinRight: figure.shinRight,
  thighLeft: figure.thighLeft,
  shinLeft: figure.shinLeft,
}

/** A limb's length: the dark edge, then its colour down the middle. */
function Limb({ to, fill, width }: { to: readonly [number, number]; fill: string; width: number }) {
  const d = `M0 0 L${to[0]} ${to[1]}`
  return (
    <>
      <path d={d} stroke={EDGE} strokeWidth={width + 2.4} strokeLinecap="round" />
      <path d={d} stroke={fill} strokeWidth={width} strokeLinecap="round" />
    </>
  )
}

// One arm from the shoulder: the upper arm (a tee's sleeve over it), the forearm and the hand, the
// drummer's stick in it. The right arm is the one nearer the things he acts on.
function Arm({ side, kit }: { side: 'left' | 'right'; kit: Kit }) {
  const s = side === 'right' ? 1 : -1
  return (
    <g transform={`translate(${50 + 13 * s} 64)`}>
      <g className={side === 'right' ? figure.armRight : figure.armLeft}>
        <Limb to={[3 * s, 16]} fill={SKIN} width={8} />
        {kit.sleeve && kit.shirt && <Limb to={[1.4 * s, 7]} fill={kit.shirt} width={10} />}
        <g transform={`translate(${3 * s} 16)`}>
          <g className={side === 'right' ? figure.foreRight : figure.foreLeft}>
            <Limb to={[1 * s, 14]} fill={SKIN} width={7} />
            {kit.sticks && <path d={`M${1 * s} 17 L${12 * s} 34`} stroke={C.plankLight} strokeWidth={2.6} strokeLinecap="round" />}
            <circle cx={1 * s} cy={17} r={kit.hands === SKIN ? 4.8 : 5.6} fill={kit.hands} stroke={EDGE} strokeWidth={1.6} />
          </g>
        </g>
      </g>
    </g>
  )
}

// One leg from the hip: the thigh and the shin, then the shoe or his bare foot.
function Leg({ side, kit }: { side: 'left' | 'right'; kit: Kit }) {
  const s = side === 'right' ? 1 : -1
  return (
    <g transform={`translate(${50 + 6 * s} 96)`}>
      <g className={side === 'right' ? figure.thighRight : figure.thighLeft}>
        <Limb to={[1 * s, 22]} fill={kit.legs} width={10} />
        <g transform={`translate(${1 * s} 22)`}>
          <g className={side === 'right' ? figure.shinRight : figure.shinLeft}>
            <Limb to={[0, 21]} fill={kit.legs} width={9} />
            <ellipse cx={3.5 * s} cy={26} rx={kit.feet ? 8 : 6.5} ry={kit.feet ? 4.4 : 3.4} fill={kit.feet ?? SKIN} stroke={EDGE} strokeWidth={1.6} />
          </g>
        </g>
      </g>
    </g>
  )
}

// His mongkhon round his head: the wound cord ring and its tail.
function Mongkhon() {
  return (
    <>
      <path d="M31 24 C36 31 64 31 69 24" fill="none" stroke={EDGE} strokeWidth={5.4} strokeLinecap="round" />
      <path d="M31 24 C36 31 64 31 69 24" fill="none" stroke={C.parchment} strokeWidth={3} strokeLinecap="round" strokeDasharray="2.4 1.6" />
      <path d="M31 25 C25 27 22 31 20 36" fill="none" stroke={C.parchment} strokeWidth={2.4} strokeLinecap="round" />
    </>
  )
}

function Head({ profession }: { profession: Profession }) {
  return (
    <g>
      <circle cx={50} cy={34} r={20} fill={SKIN} stroke={EDGE} strokeWidth={2} />
      <path d="M33 26 C33 13 42 10 50 10 C58 10 67 13 67 26 C62 20 56 18 50 18 C44 18 38 20 33 26 Z" fill={HERO_IDENTITY.hair} />
      <path d="M31.5 36 C33 48 40 54.5 50 54.5 C60 54.5 67 48 68.5 36 C63 40 57 41 54 41.5 C52 40 48 40 46 41.5 C43 41 37 40 31.5 36 Z" fill={HERO_IDENTITY.beard} />
      <path d="M45 46 Q50 50 55 46" fill="none" stroke={C.sunsetRed} strokeWidth={1.8} strokeLinecap="round" />
      <ellipse cx={43.5} cy={31} rx={2.6} ry={3.6} fill={HERO_IDENTITY.eyes} />
      <ellipse cx={56.5} cy={31} rx={2.6} ry={3.6} fill={HERO_IDENTITY.eyes} />
      <path d="M64 22 C68 30 67 40 62 47" fill="none" stroke={C.sunCore} strokeWidth={1.8} strokeLinecap="round" opacity={0.7} />
      {profession === 'fighter' && <Mongkhon />}
    </g>
  )
}

/** Everything but the shadow: the far leg and arm, the body, the head, the near leg and arm. */
function Body({ profession }: { profession: Profession }) {
  const kit = KIT[profession]
  return (
    <>
      <Leg side="left" kit={kit} />
      <Leg side="right" kit={kit} />
      <Arm side="left" kit={kit} />
      <rect x={37} y={56} width={26} height={42} rx={11} fill={kit.shirt ?? SKIN} stroke={EDGE} strokeWidth={2} />
      {kit.shorts && <path d="M37 86 H63 V100 Q57 102 51 99 H49 Q43 102 37 100 Z" fill={kit.shorts} stroke={EDGE} strokeWidth={2} strokeLinejoin="round" />}
      {!kit.shorts && <path d="M38 90 H62 V97 Q50 100 38 97 Z" fill={kit.legs} stroke={EDGE} strokeWidth={1.6} />}
      <path d="M60 62 Q63 76 61 92" fill="none" stroke={C.sunCore} strokeWidth={1.6} strokeLinecap="round" opacity={0.55} />
      <Head profession={profession} />
      <Arm side="right" kit={kit} />
    </>
  )
}

// His drawing's box in viewBox units, with room above his hair for a raised arm.
const HERO_BOX = { top: -20, height: 170 } as const

interface HeroCharacterProps {
  profession: Profession
  pose?: HeroPose
  className?: string
}

/** Him on a page, posed by the css keyframes of `pose`. */
export const HeroCharacter = memo(function HeroCharacter({ profession, pose = 'idle', className = '' }: HeroCharacterProps) {
  return (
    <svg viewBox={`0 ${HERO_BOX.top} 100 ${HERO_BOX.height}`} className={`${figure.figure} ${className}`} data-pose={pose} aria-hidden="true" focusable="false">
      <ellipse cx={50} cy={146} rx={24} ry={3.4} fill={EDGE} opacity={0.35} />
      <g className={figure.breath}>
        <Body profession={profession} />
      </g>
    </svg>
  )
})

/** His pose on a stage: the shared rig's turns. */
export type FigurePose = RigPose

export const FIGURE_STAND: FigurePose = RIG_STAND

/** His rig's groups inside a stage's figure group. */
export const figureJoints = (root: Element): RigJoints => rigJoints(root, RIG_CLASSES)

/** Writes `p` on his groups. */
export const setFigurePose = (j: RigJoints, p: FigurePose): void => setRigPose(j, p)

/** Him on a stage, his feet at 0 0 and his box 100 wide, standing until the scroll writes his pose. */
export const StageFigure = memo(function StageFigure({ profession }: { profession: Profession }) {
  return (
    <g transform="translate(-50 -146)">
      <ellipse cx={50} cy={146} rx={24} ry={3.4} fill={EDGE} opacity={0.35} />
      <g className={figure.body}>
        <Body profession={profession} />
      </g>
    </g>
  )
})
