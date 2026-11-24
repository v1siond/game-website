import { memo, useId } from 'react'
import { HERO_IDENTITY } from '@/lib/cv/heroIdentity'
import type { Profession } from '@/lib/cv/professions'
import { STAND as RIG_STAND, type RigPose } from '@/lib/motion/rigPose'
import { rigJoints, setRigPose, type RigClasses, type RigJoints } from '../shared/rig'
import { COLORS as C } from './palette'
import figure from './character.module.css'

// Him as the jungle barrel platformer's hero, drawn the way that game drew its heroes: rendered volumes, each
// shape a soft gradient from a lit top to a shaded underside with a dark edge, the look of a 3D model turned
// into a sprite. He is himself mixed with the build of the cartoon marsupial platformer hero: a
// big head on a lean body, long thin limbs, a spiky tuft of his short dark hair, his full beard round a wide
// grin, one big eye, big sneakers and fingerless gloves. Side on and facing right, the way he acts in every
// scene.
//
// The System Engineer in a teal tee and jeans with red sneakers; the Musician in a black vest and black
// jeans with his sticks; the Martial Artist bare chested in red shorts, his hands wrapped and his mongkhon on,
// barefoot.
//
// One jointed rig in the 100 by 170 box (character.module.css): both shoulders on one point (50, 62), the
// elbows 19 below, the hips side by side (47 and 53, 98), the knees 23 below, the soles on y 146, the whole
// of him round his feet, so a negative turn swings a limb forward, to the right. His near side is the rig's
// right, the far its left, drawn behind him a shade darker. On a page (the hero card, the profession plates)
// his poses are transform keyframes keyed off data-pose: two breaths (idle) or a wave (the picked plate),
// each resting within 5 s. On a stage the shared rig writes the scene's pose (../shared/rig).

export type HeroPose = 'idle' | 'wave'

const EDGE = C.shadow

/** A material's three tones, lit top to shaded underside, the way the rendered sprites shade a volume. */
type Tones = readonly [light: string, mid: string, dark: string]

const SKIN: Tones = ['#d08a55', HERO_IDENTITY.skin, HERO_IDENTITY.skinShade]
const HAIR: Tones = ['#4a3a4a', HERO_IDENTITY.hair, '#120c12']

const TONES = {
  skin: SKIN,
  hair: HAIR,
  tee: ['#4fb0c0', C.tee, '#1c4f5a'],
  jeans: ['#5577a8', C.jeans, '#1f3352'],
  vest: ['#4a4442', C.vest, '#0f0d0c'],
  blackJeans: ['#5a5350', C.blackJeans, '#1a1716'],
  shorts: ['#f0644a', C.sunsetRed, '#7a1f12'],
  sneaker: ['#ff6a4a', '#d8331d', '#7a1408'],
  sole: ['#fff6e2', '#e8dcc4', '#b9a888'],
  glove: ['#8a5a3a', '#5e3a22', '#2e1a0e'],
  wrap: ['#ffffff', C.parchment, '#c9b48e'],
} as const satisfies Record<string, Tones>

type Material = keyof typeof TONES

interface Kit {
  chest: Material
  legs: Material
  /** The sleeve's material over the upper arm, or null for a bare arm. */
  sleeve: Material | null
  /** Shoes, or null for his bare feet. */
  feet: Material | null
  hands: Material
  sticks: boolean
  crown: boolean
  /** Shorts over the thighs. */
  shorts: boolean
}

const KIT: Record<Profession, Kit> = {
  engineer: { chest: 'tee', legs: 'jeans', sleeve: 'tee', feet: 'sneaker', hands: 'glove', sticks: false, crown: false, shorts: false },
  drummer: { chest: 'vest', legs: 'blackJeans', sleeve: null, feet: 'sneaker', hands: 'glove', sticks: true, crown: false, shorts: false },
  fighter: { chest: 'skin', legs: 'skin', sleeve: null, feet: null, hands: 'wrap', sticks: false, crown: true, shorts: true },
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

/** Each material's gradient, lit from above, under its own id in this drawing. */
function Shading({ uid }: { uid: string }) {
  return (
    <defs>
      {(Object.keys(TONES) as Material[]).map((name) => (
        <linearGradient key={name} id={`${uid}-${name}`} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor={TONES[name][0]} />
          <stop offset="0.45" stopColor={TONES[name][1]} />
          <stop offset="1" stopColor={TONES[name][2]} />
        </linearGradient>
      ))}
      <radialGradient id={`${uid}-head`} cx="0.62" cy="0.32" r="0.75">
        <stop offset="0" stopColor={SKIN[0]} />
        <stop offset="0.55" stopColor={SKIN[1]} />
        <stop offset="1" stopColor={SKIN[2]} />
      </radialGradient>
    </defs>
  )
}

/** A material's fill in this drawing; the far side reads its dark tone flat, a shade behind him. */
type Paint = (material: Material) => string

/** A limb's length from its joint: the dark edge, then its material down the middle. */
function Limb({ to, paint, material, width }: { to: readonly [number, number]; paint: Paint; material: Material; width: number }) {
  const d = `M0 0 L${to[0]} ${to[1]}`
  return (
    <>
      <path d={d} stroke={EDGE} strokeWidth={width + 2.4} strokeLinecap="round" />
      <path d={d} stroke={paint(material)} strokeWidth={width} strokeLinecap="round" />
    </>
  )
}

type Side = 'near' | 'far'

// One arm from the shoulder: the upper arm (a sleeve over it), the forearm, the big gloved hand, a stick in it.
function Arm({ side, kit, paint }: { side: Side; kit: Kit; paint: Paint }) {
  const near = side === 'near'
  return (
    <g transform="translate(50 62)">
      <g className={near ? figure.armRight : figure.armLeft}>
        <Limb to={[0, 19]} paint={paint} material="skin" width={6.5} />
        {kit.sleeve && <Limb to={[0, 7]} paint={paint} material={kit.sleeve} width={10} />}
        <g transform="translate(0 19)">
          <g className={near ? figure.foreRight : figure.foreLeft}>
            <Limb to={[0, 16]} paint={paint} material="skin" width={6} />
            {kit.sticks && <path d="M0 20 L14 34" stroke={C.plankLight} strokeWidth={2.8} strokeLinecap="round" />}
            <path d="M-3.6 13 H3.6 V17 H-3.6 Z" fill={paint(kit.hands)} stroke={EDGE} strokeWidth={1.2} />
            <circle cx={0.8} cy={20} r={6} fill={paint(kit.hands === 'wrap' ? 'wrap' : 'skin')} stroke={EDGE} strokeWidth={1.6} />
            {kit.hands === 'glove' && <path d="M-4.5 17 Q0.8 13 6.2 17 L6 20 Q0.8 17 -4.4 20 Z" fill={paint('glove')} />}
          </g>
        </g>
      </g>
    </g>
  )
}

// One leg from the hip: the thigh and the shin, then his big sneaker or his bare foot, toes forward.
function Leg({ side, kit, paint }: { side: Side; kit: Kit; paint: Paint }) {
  const near = side === 'near'
  const { legs } = kit
  return (
    <g transform={`translate(${near ? 53 : 47} 98)`}>
      <g className={near ? figure.thighRight : figure.thighLeft}>
        <Limb to={[0, 23]} paint={paint} material={legs} width={9} />
        {kit.shorts && <Limb to={[0, 12]} paint={paint} material="shorts" width={13} />}
        <g transform="translate(0 23)">
          <g className={near ? figure.shinRight : figure.shinLeft}>
            <Limb to={[0, 19]} paint={paint} material={kit.feet ? legs : 'skin'} width={kit.feet ? 8.5 : 6.5} />
            {kit.feet ? (
              <>
                <path d="M-7 19 Q-8 14 -2 13.5 L6 13.5 Q16 14 18 20 Q18 25 12 25 L-6 25 Q-9 24 -7 19 Z" fill={paint('sneaker')} stroke={EDGE} strokeWidth={1.6} />
                <path d="M-7.5 22.5 H17.5 V25 H-6.5 Z" fill={paint('sole')} stroke={EDGE} strokeWidth={1} />
                <path d="M2 15.5 L7 18 M4.5 14.6 L9.5 17.2" stroke={TONES.sole[0]} strokeWidth={1.2} strokeLinecap="round" />
              </>
            ) : (
              <path d="M-5 19 L4 19 Q13 20 13 24 L-5 24 Z" fill={paint('skin')} stroke={EDGE} strokeWidth={1.4} />
            )}
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
      <path d="M32 22 Q54 14 76 22" fill="none" stroke={EDGE} strokeWidth={5.6} strokeLinecap="round" />
      <path d="M32 22 Q54 14 76 22" fill="none" stroke={C.parchment} strokeWidth={3.2} strokeLinecap="round" strokeDasharray="2.6 1.6" />
      <path d="M32 22 Q24 24 18 31" fill="none" stroke={C.parchment} strokeWidth={2.6} strokeLinecap="round" />
    </>
  )
}

// His big head side on: the round skull, the spiky tuft of his dark hair, the muzzle forward, one big eye
// with its pupil looking ahead, the brow, his full beard round the jaw and the wide grin.
function Head({ kit, uid, paint }: { kit: Kit; uid: string; paint: Paint }) {
  return (
    <g>
      <path d="M30 30 Q30 7 54 6 Q76 6 78 26 Q83 30 82 37 Q80 48 70 53 Q58 58 44 53 Q30 46 30 30 Z" fill={`url(#${uid}-head)`} stroke={EDGE} strokeWidth={2} />
      <path d="M29 30 Q26 14 36 6 L36 1 L42 5 L44 -4 L50 3 L56 -5 L60 3 L68 -1 L67 7 Q76 9 78 18 Q70 12 60 13 Q50 14 44 20 Q38 26 38 34 Q33 34 29 30 Z" fill={paint('hair')} stroke={EDGE} strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M44 38 Q46 52 58 56 Q72 56 80 42 Q74 46 68 45 Q62 42 56 44 Q50 44 44 38 Z" fill={paint('hair')} stroke={EDGE} strokeWidth={1.4} />
      <path d="M62 42 Q71 48 80 39 Q72 43 62 42 Z" fill={C.parchment} stroke={EDGE} strokeWidth={1.2} />
      <ellipse cx={40} cy={31} rx={4} ry={5} fill={SKIN[2]} stroke={EDGE} strokeWidth={1.4} />
      <ellipse cx={66} cy={24} rx={6} ry={7.5} fill={C.parchment} stroke={EDGE} strokeWidth={1.4} />
      <ellipse cx={68.5} cy={25} rx={3} ry={4.2} fill={HERO_IDENTITY.eyes} />
      <circle cx={69.6} cy={23.4} r={1.1} fill="#ffffff" />
      <path d="M59 15 Q66 12 73 15" fill="none" stroke={HAIR[1]} strokeWidth={2.6} strokeLinecap="round" />
      <path d="M58 8 Q72 8 76 20" fill="none" stroke={C.sunCore} strokeWidth={1.6} strokeLinecap="round" opacity={0.6} />
      {kit.crown && <Mongkhon />}
    </g>
  )
}

// His lean body side on: the chest a little forward of the hips, the belt line, the rim light down his back.
function Torso({ kit, paint }: { kit: Kit; paint: Paint }) {
  return (
    <g>
      <path d="M41 58 Q50 53 60 58 Q63 78 59 100 L42 100 Q38 78 41 58 Z" fill={paint(kit.chest)} stroke={EDGE} strokeWidth={2} />
      {kit.chest === 'skin' && <path d="M56 66 Q60 70 59 75 M53 82 H59 M53 89 H59" fill="none" stroke={SKIN[2]} strokeWidth={1.2} />}
      <path d="M41.5 92 H59.5 L59 101 Q50 103 42 101 Z" fill={paint(kit.shorts ? 'shorts' : kit.legs)} stroke={EDGE} strokeWidth={1.6} />
      <path d="M42 62 Q40 78 43 94" fill="none" stroke={C.sunCore} strokeWidth={1.4} strokeLinecap="round" opacity={0.5} />
    </g>
  )
}

/** Everything but the shadow: the far arm and leg in their dark tone, the near leg, the body, the head, the
 *  near arm. */
function Body({ profession }: { profession: Profession }) {
  const uid = useId().replace(/:/g, '')
  const kit = KIT[profession]
  const near: Paint = (material) => `url(#${uid}-${material})`
  const far: Paint = (material) => TONES[material][2]
  return (
    <>
      <Shading uid={uid} />
      <Arm side="far" kit={kit} paint={far} />
      <Leg side="far" kit={kit} paint={far} />
      <Leg side="near" kit={kit} paint={near} />
      <Torso kit={kit} paint={near} />
      <Head kit={kit} uid={uid} paint={near} />
      <Arm side="near" kit={kit} paint={near} />
    </>
  )
}

// His drawing's box in viewBox units, with room above his tuft for a raised arm.
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
      <ellipse cx={52} cy={146} rx={24} ry={3.4} fill={EDGE} opacity={0.35} />
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

/** Him on a stage, his soles at 0 0 and his box 100 wide, standing until the scene writes his pose. */
export const StageFigure = memo(function StageFigure({ profession }: { profession: Profession }) {
  return (
    <g transform="translate(-50 -146)">
      <ellipse cx={52} cy={146} rx={24} ry={3.4} fill={EDGE} opacity={0.35} />
      <g className={figure.body}>
        <Body profession={profession} />
      </g>
    </g>
  )
})
