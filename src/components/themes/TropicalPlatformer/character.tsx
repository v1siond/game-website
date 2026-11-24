import { memo, useId } from 'react'
import { HERO_IDENTITY } from '@/lib/cv/heroIdentity'
import type { Profession } from '@/lib/cv/professions'
import { STAND as RIG_STAND, type RigPose } from '@/lib/motion/rigPose'
import { rigJoints, setRigPose, type RigClasses, type RigJoints } from '../shared/rig'
import { COLORS as C } from './palette'
import figure from './character.module.css'

// Him as the jungle barrel platformer's hero, built the way that game builds its hero and drawn the way it
// drew him, a 3D model rendered into a sprite: every volume shaded round like a cylinder or a ball, lit from
// the front and above with a warm rim light down its lit edge, a dark edge round it and a soft shadow where he
// meets the ground. The build is the game's: stocky and powerful, a broad barrel chest and big shoulders, long
// heavy arms with big hands that hang near his knees, short strong legs, a low stance with the knees bent and
// the head carried forward. The face is his own, side on: his short dark hair, a heavy brow, the dark eye,
// his full beard. Still him in his own clothes, never the ape and never its tie.
//
// The System Engineer in a teal tee, jeans and trainers; the Musician in a black vest and black jeans with his
// sticks; the Martial Artist bare chested in red shorts, his hands wrapped and his mongkhon on, barefoot.
//
// One jointed rig in the 100 by 170 box (character.module.css): both shoulders on one point (52, 66), the
// elbows 24 below, the hips side by side (48 and 56, 112), the knees 17 below, the soles on y 146, the whole of
// him round his feet, so a negative turn swings a limb forward, to the right. His near side is the rig's right,
// the far its left, drawn behind him in its shaded tone. On a page (the hero card, the profession plates) his
// poses are transform keyframes keyed off data-pose: two breaths (idle) or a wave (the picked plate), each
// resting within 5 s. On a stage the shared rig writes the scene's pose (../shared/rig).

export type HeroPose = 'idle' | 'wave'

const EDGE = C.shadow

/** A material's tones: its shade on the far side of a volume, its own colour, its lit side and the rim light. */
type Tones = readonly [dark: string, mid: string, light: string, rim: string]

const SKIN: Tones = [HERO_IDENTITY.skinShade, HERO_IDENTITY.skin, '#d99560', '#ffd9a8']
const HAIR: Tones = ['#0c080c', HERO_IDENTITY.hair, '#4a3a4a', '#7a6670']

const TONES = {
  skin: SKIN,
  hair: HAIR,
  tee: ['#163f48', C.tee, '#56b6c6', '#c6f2f8'],
  jeans: ['#18284a', C.jeans, '#5b7cad', '#b6c8e6'],
  trainers: ['#9a9282', C.trainers, '#ffffff', '#ffffff'],
  vest: ['#0a0908', C.vest, '#4e4846', '#8a8280'],
  blackJeans: ['#141110', C.blackJeans, '#5e5754', '#9a928e'],
  shorts: ['#6a1a0e', C.sunsetRed, '#f26a4e', '#ffc2a8'],
  wrap: ['#b9a27c', C.parchment, '#ffffff', '#ffffff'],
} as const satisfies Record<string, Tones>

type Material = keyof typeof TONES

interface Kit {
  chest: Material
  legs: Material
  /** The sleeve's material over the upper arm, or null for a bare arm. */
  sleeve: Material | null
  /** Shoes, or null for his bare feet. */
  feet: Material | null
  /** Wrapped hands, or his bare fists. */
  wraps: boolean
  sticks: boolean
  crown: boolean
  /** Shorts over the thighs. */
  shorts: boolean
}

const KIT: Record<Profession, Kit> = {
  engineer: { chest: 'tee', legs: 'jeans', sleeve: 'tee', feet: 'trainers', wraps: false, sticks: false, crown: false, shorts: false },
  drummer: { chest: 'vest', legs: 'blackJeans', sleeve: null, feet: 'vest', wraps: false, sticks: true, crown: false, shorts: false },
  fighter: { chest: 'skin', legs: 'skin', sleeve: null, feet: null, wraps: true, sticks: false, crown: true, shorts: true },
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

/** Each material's shading in this drawing: across a limb or the body like a lit cylinder (`-round`), and on a
 *  ball (`-ball`, the head and the fists), plus the soft contact shadow. */
function Shading({ uid }: { uid: string }) {
  return (
    <defs>
      {(Object.keys(TONES) as Material[]).map((name) => {
        const [dark, mid, light] = TONES[name]
        return [
          <linearGradient key={`${name}-round`} id={`${uid}-${name}-round`} x1="0" y1="0" x2="1" y2="0.25">
            <stop offset="0" stopColor={dark} />
            <stop offset="0.35" stopColor={mid} />
            <stop offset="0.75" stopColor={light} />
            <stop offset="1" stopColor={mid} />
          </linearGradient>,
          <radialGradient key={`${name}-ball`} id={`${uid}-${name}-ball`} cx="0.66" cy="0.3" r="0.8">
            <stop offset="0" stopColor={light} />
            <stop offset="0.5" stopColor={mid} />
            <stop offset="1" stopColor={dark} />
          </radialGradient>,
        ]
      })}
      <radialGradient id={`${uid}-shadow`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor={EDGE} stopOpacity="0.55" />
        <stop offset="1" stopColor={EDGE} stopOpacity="0" />
      </radialGradient>
    </defs>
  )
}

/** How a volume of a material is painted: shaded round on the near side, flat in its shade on the far. */
interface Paint {
  round: (material: Material) => string
  ball: (material: Material) => string
  /** The rim light's colour, or none on the far side. */
  rim: (material: Material) => string
}

const LINE = { stroke: EDGE, strokeWidth: 1.8, strokeLinejoin: 'round' as const }

type Side = 'near' | 'far'

// The arm's shapes from the shoulder: the big deltoid and upper arm, the forearm thickening to the wrist, the
// heavy fist; the elbow 24 below the shoulder, the fist 22 below the elbow.
const UPPER = 'M-10 -3 Q0 -11 10 -3 Q11 12 8 24 Q0 28 -7 24 Q-11 12 -10 -3 Z'
const SLEEVE = 'M-11 -4 Q0 -12 11 -4 L10 9 Q0 13 -10 9 Z'
const FORE = 'M-6 -1 Q0 -3 6 -1 Q9 10 8 20 Q0 23 -8 20 Q-8 10 -6 -1 Z'
const FIST = 'M-9 18 Q-10 30 0 32 Q10 32 11 24 Q12 16 3 15 Q-6 15 -9 18 Z'
const KNUCKLES = 'M4 18 Q9 20 10 26'

// One arm: the upper arm (a sleeve over it), the forearm, the heavy fist, a stick in it.
function Arm({ side, kit, paint }: { side: Side; kit: Kit; paint: Paint }) {
  const near = side === 'near'
  const fist = kit.wraps ? 'wrap' : 'skin'
  return (
    <g transform="translate(52 66)">
      <g className={near ? figure.armRight : figure.armLeft}>
        <path d={UPPER} fill={paint.round('skin')} {...LINE} />
        {kit.sleeve && <path d={SLEEVE} fill={paint.round(kit.sleeve)} {...LINE} />}
        <path d="M9 0 Q11 12 7 23" fill="none" stroke={paint.rim('skin')} strokeWidth={1.6} strokeLinecap="round" opacity={0.8} />
        <g transform="translate(0 24)">
          <g className={near ? figure.foreRight : figure.foreLeft}>
            <path d={FORE} fill={paint.round(kit.wraps ? 'wrap' : 'skin')} {...LINE} />
            {kit.sticks && <path d="M2 26 L20 40" stroke={C.plankLight} strokeWidth={3.2} strokeLinecap="round" />}
            <path d={FIST} fill={paint.ball(fist)} {...LINE} />
            <path d={KNUCKLES} fill="none" stroke={paint.rim(fist)} strokeWidth={1.4} strokeLinecap="round" opacity={0.8} />
          </g>
        </g>
      </g>
    </g>
  )
}

// One short strong leg from the hip: the thick thigh, the shin, then his shoe or his bare foot, toes forward.
const THIGH = 'M-8 -3 Q0 -7 8 -3 Q9 8 6 17 Q0 20 -6 17 Q-9 8 -8 -3 Z'
const SHIN = 'M-6 -1 Q0 -3 6 -1 L5 14 Q0 16 -5 14 Z'
const SHOE = 'M-7 11 Q-8 19 -4 20 L16 20 Q18 14 10 11 Z'
const FOOT = 'M-5 12 L-5 19 L14 19 Q15 14 8 12 Z'

function Leg({ side, kit, paint }: { side: Side; kit: Kit; paint: Paint }) {
  const near = side === 'near'
  return (
    <g transform={`translate(${near ? 56 : 48} 112)`}>
      <g className={near ? figure.thighRight : figure.thighLeft}>
        <path d={THIGH} fill={paint.round(kit.shorts ? 'shorts' : kit.legs)} {...LINE} />
        <g transform="translate(0 17)">
          <g className={near ? figure.shinRight : figure.shinLeft}>
            <path d={SHIN} fill={paint.round(kit.legs)} {...LINE} />
            <path d={kit.feet ? SHOE : FOOT} fill={paint.round(kit.feet ?? 'skin')} {...LINE} />
            {kit.feet && <path d="M-6 18 H16" stroke={EDGE} strokeWidth={1.2} />}
          </g>
        </g>
      </g>
    </g>
  )
}

// His mongkhon round his head: the wound cord ring and its tail flying back.
function Mongkhon() {
  return (
    <>
      <path d="M49 30 Q64 22 81 29" fill="none" stroke={EDGE} strokeWidth={5.4} strokeLinecap="round" />
      <path d="M49 30 Q64 22 81 29" fill="none" stroke={C.parchment} strokeWidth={3} strokeLinecap="round" strokeDasharray="2.4 1.6" />
      <path d="M49 30 Q42 33 38 40" fill="none" stroke={C.parchment} strokeWidth={2.4} strokeLinecap="round" />
    </>
  )
}

// His head side on, carried forward of his shoulders: the skull, his short dark hair, the ear, the heavy brow
// over the dark eye, the nose, his full beard and the mouth in it.
function Head({ kit, paint }: { kit: Kit; paint: Paint }) {
  return (
    <g>
      <path d="M48 40 Q47 21 64 20 Q80 20 83 36 Q86 41 84 46 Q81 56 70 60 Q56 61 50 52 Q47 46 48 40 Z" fill={paint.ball('skin')} {...LINE} />
      <path d="M47 39 Q45 19 64 18 Q79 18 83 30 Q75 25 66 26 Q58 27 55 33 Q53 38 52 42 Q48 42 47 39 Z" fill={paint.ball('hair')} {...LINE} />
      <path d="M56 46 Q57 61 70 63 Q82 61 86 47 Q80 51 74 50 Q66 47 56 46 Z" fill={paint.ball('hair')} {...LINE} />
      <path d="M75 52 L82 51" stroke={EDGE} strokeWidth={1.6} strokeLinecap="round" />
      <ellipse cx={57} cy={40} rx={3.4} ry={4.6} fill={paint.round('skin')} {...LINE} strokeWidth={1.2} />
      <path d="M67 31 Q75 28 83 32" fill="none" stroke={HAIR[1]} strokeWidth={3.4} strokeLinecap="round" />
      <ellipse cx={76} cy={36} rx={2.2} ry={2.8} fill={HERO_IDENTITY.eyes} />
      <circle cx={76.8} cy={35.2} r={0.8} fill="#ffffff" />
      <path d="M83 36 Q88 40 84 44" fill={paint.ball('skin')} {...LINE} strokeWidth={1.2} />
      <path d="M62 21 Q78 20 83 32" fill="none" stroke={paint.rim('hair')} strokeWidth={1.4} strokeLinecap="round" opacity={0.8} />
      {kit.crown && <Mongkhon />}
    </g>
  )
}

// His broad barrel chest side on: the big back over the shoulders, the chest bulging forward, the belt line,
// the rim light down the front.
function Torso({ kit, paint }: { kit: Kit; paint: Paint }) {
  return (
    <g>
      <path d="M36 58 Q52 46 68 54 Q81 66 76 90 Q73 106 67 116 L35 116 Q27 98 29 76 Q30 63 36 58 Z" fill={paint.round(kit.chest)} {...LINE} />
      {kit.chest === 'skin' && <path d="M66 66 Q74 72 72 80 M62 90 H72 M62 100 H70" fill="none" stroke={SKIN[0]} strokeWidth={1.4} />}
      {kit.chest === 'vest' && <path d="M60 54 Q64 80 66 112" fill="none" stroke="#3a3432" strokeWidth={2} />}
      <path d="M33 104 H70 L67 117 Q50 120 35 117 Z" fill={paint.round(kit.shorts ? 'shorts' : kit.legs)} {...LINE} />
      <path d="M70 60 Q80 72 75 94" fill="none" stroke={paint.rim(kit.chest)} strokeWidth={1.8} strokeLinecap="round" opacity={0.85} />
    </g>
  )
}

/** Everything but the shadow: the far arm and leg in their shade, the near leg, the body, the head, the near
 *  arm. */
function Body({ profession, uid }: { profession: Profession; uid: string }) {
  const kit = KIT[profession]
  const near: Paint = {
    round: (material) => `url(#${uid}-${material}-round)`,
    ball: (material) => `url(#${uid}-${material}-ball)`,
    rim: (material) => TONES[material][3],
  }
  const far: Paint = { round: (material) => TONES[material][0], ball: (material) => TONES[material][0], rim: () => 'none' }
  return (
    <>
      <Arm side="far" kit={kit} paint={far} />
      <Leg side="far" kit={kit} paint={far} />
      <Leg side="near" kit={kit} paint={near} />
      <Torso kit={kit} paint={near} />
      <Head kit={kit} paint={near} />
      <Arm side="near" kit={kit} paint={near} />
    </>
  )
}

/** The soft shadow where he meets the ground. */
const Contact = ({ uid }: { uid: string }) => <ellipse cx={54} cy={146} rx={30} ry={5} fill={`url(#${uid}-shadow)`} />

/** A drawing's own gradient ids. */
const useShadingId = (): string => `tp-hero-${useId().replace(/:/g, '')}`

// His drawing's box in viewBox units, with room above his head for a raised arm.
const HERO_BOX = { top: -20, height: 170 } as const

interface HeroCharacterProps {
  profession: Profession
  pose?: HeroPose
  className?: string
}

/** Him on a page, posed by the css keyframes of `pose`. */
export const HeroCharacter = memo(function HeroCharacter({ profession, pose = 'idle', className = '' }: HeroCharacterProps) {
  const uid = useShadingId()
  return (
    <svg viewBox={`0 ${HERO_BOX.top} 100 ${HERO_BOX.height}`} className={`${figure.figure} ${className}`} data-pose={pose} aria-hidden="true" focusable="false">
      <Shading uid={uid} />
      <Contact uid={uid} />
      <g className={figure.breath}>
        <Body profession={profession} uid={uid} />
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

/** Him on a stage, his soles at 0 0 and his box 100 wide, standing until the scene writes his pose. */
export const StageFigure = memo(function StageFigure({ profession }: { profession: Profession }) {
  const uid = useShadingId()
  return (
    <g transform="translate(-50 -146)">
      <Shading uid={uid} />
      <Contact uid={uid} />
      <g className={figure.body}>
        <Body profession={profession} uid={uid} />
      </g>
    </g>
  )
})
