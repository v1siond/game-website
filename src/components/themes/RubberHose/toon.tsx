import { memo } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_IDENTITY } from '@/lib/cv/heroIdentity'
import { STAND as RIG_STAND, type RigPose } from '@/lib/motion/rigPose'
import { rigJoints, setRigPose, type RigClasses, type RigJoints } from '../shared/rig'
import { HOSE } from './palette'
import toon from './toon.module.css'

// Him as a 1930s rubber hose cartoon character: one thick ink line, a big round head with pie cut eyes,
// limbs as bendy hoses that curve instead of bending at an elbow or a knee, in his own clothes: the System
// Engineer's shirt and trousers, the Musician's black tee and black trousers, his own hands and shoes. He
// stays him: his short dark hair as a cap with a few spiky tufts, his full dark beard round the lower face
// with the smile drawn into it, his own nose. The world's film grain lies over all of it.
//
// On a page (the title card, the cast badges) his poses are transform keyframes in toon.module.css keyed
// off data-pose: the bounce on the beat and the step in place, or the wave of the picked badge. Pointing
// at him squashes him down and stretches him back up. Each loop plays a set number of beats and he rests
// on the pose's held angle within 5 s. On a stage (StageToon) every limb turns at its joint on the shared
// rig (../shared/rig), each hose in two lengths so it curves through the bend, the body squashing and
// stretching, and the scene writes the pose, his face turned toward the boss.
//
// The Martial Artist is bare chested in red Muay Thai shorts with red gloves, the prajioud on his arms and
// his own mongkhon round his head, barefoot.

export type HeroPose = 'idle' | 'wave'

const INK = HOSE.ink
const LINE = 3
const HAIR = HERO_IDENTITY.hair
const SKIN = HERO_IDENTITY.skin

const BEARD = 'M30.5 37 C32.5 52 40 59.5 50 59.5 C60 59.5 67.5 52 69.5 37 C64 41.5 58 43 54 43.5 C52 41.6 48 41.6 46 43.5 C42 43 36 41.5 30.5 37 Z'

/** A hose: the ink line with its fill colour running down the middle. */
function Hose({ d, fill, width = 6.4 }: { d: string; fill: string; width?: number }) {
  return (
    <>
      <path d={d} fill="none" stroke={INK} strokeWidth={width} strokeLinecap="round" />
      <path d={d} fill="none" stroke={fill} strokeWidth={width - 3.8} strokeLinecap="round" />
    </>
  )
}

interface Kit {
  shirt: string
  trousers: string
  hand: string
  sticks: boolean
  bands: boolean
  barefoot: boolean
}

const KIT: Record<Profession, Kit> = {
  engineer: { shirt: HOSE.engineerShirt, trousers: HOSE.trousers, hand: SKIN, sticks: false, bands: false, barefoot: false },
  drummer: { shirt: HOSE.drummerShirt, trousers: HOSE.blackTrousers, hand: SKIN, sticks: true, bands: false, barefoot: false },
  fighter: { shirt: SKIN, trousers: SKIN, hand: HOSE.red, sticks: false, bands: true, barefoot: true },
}

/** The rig's groups of his drawing, by the css module's classes. */
const RIG_CLASSES: RigClasses = {
  body: toon.body,
  armRight: toon.armRight,
  foreRight: toon.foreRight,
  armLeft: toon.armLeft,
  foreLeft: toon.foreLeft,
  thighRight: toon.thighRight,
  shinRight: toon.shinRight,
  thighLeft: toon.thighLeft,
  shinLeft: toon.shinLeft,
}

// One arm: the upper hose from the shoulder in the shirt's colour, the lower hose in his skin, the hand.
// The right arm is the one nearer the things he acts on.
function Arm({ side, kit }: { side: 'left' | 'right'; kit: Kit }) {
  const right = side === 'right'
  const s = right ? 1 : -1
  return (
    <g transform={`translate(${right ? 61 : 39} 70)`}>
      <g className={right ? toon.armRight : toon.armLeft}>
        <Hose d={`M0 0 Q${6 * s} 6 ${4 * s} 12`} fill={kit.shirt} />
        {kit.bands && <rect x={right ? 1.6 : -5.6} y={5} width={4} height={4} rx={1} fill={HOSE.red} stroke={INK} strokeWidth={1.4} />}
        <g transform={`translate(${4 * s} 12)`}>
          <g className={right ? toon.foreRight : toon.foreLeft}>
            <Hose d={`M0 0 Q${3 * s} 6 ${2 * s} 11`} fill={SKIN} />
            {kit.sticks && <path d={`M${2 * s} 13 L${16 * s} 28`} stroke={HOSE.gold} strokeWidth={2.4} strokeLinecap="round" />}
            <circle cx={2 * s} cy={13} r={kit.bands ? 6 : 4.8} fill={kit.hand} stroke={INK} strokeWidth={2.2} />
          </g>
        </g>
      </g>
    </g>
  )
}

// One leg: the thigh and the shin as two hoses in the trousers' colour, and the shoe (or his bare foot).
function Leg({ side, kit }: { side: 'left' | 'right'; kit: Kit }) {
  const right = side === 'right'
  const s = right ? 1 : -1
  return (
    <g transform={`translate(${right ? 55 : 45} 94)`}>
      <g className={right ? toon.thighRight : toon.thighLeft}>
        <Hose d={`M0 0 Q${3 * s} 11 ${2 * s} 21`} fill={kit.trousers} width={6} />
        <g transform={`translate(${2 * s} 21)`}>
          <g className={right ? toon.shinRight : toon.shinLeft}>
            <Hose d={`M0 0 Q${2 * s} 10 ${-1 * s} 21`} fill={kit.trousers} width={6} />
            <ellipse cx={5 * s} cy={25} rx={kit.barefoot ? 6 : 8} ry={kit.barefoot ? 3.4 : 4.6} fill={kit.barefoot ? SKIN : HOSE.shoe} stroke={INK} strokeWidth={LINE} />
          </g>
        </g>
      </g>
    </g>
  )
}

// His mongkhon round his head: the cord ring wound in two tones, the red binding and the tail.
function Mongkhon() {
  return (
    <g>
      <path d="M27 20 C32 27 68 27 73 20" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <path d="M27 20 C32 27 68 27 73 20" fill="none" stroke={HOSE.paper} strokeWidth={3.4} strokeLinecap="round" strokeDasharray="2.4 1.6" />
      <path d="M27 21 C21 23 17 27 15 32" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <path d="M27 21 C21 23 17 27 15 32" fill="none" stroke={HOSE.paper} strokeWidth={2.4} strokeLinecap="round" />
      <rect x={24.5} y={17.5} width={5} height={6} rx={1} fill={HOSE.red} stroke={INK} strokeWidth={1.6} />
    </g>
  )
}

const HAIR_CAP = 'M27 25 C27 11 38 6.5 50 6.5 C62 6.5 73 11 73 25 C67 18 59 14.5 50 14.5 C41 14.5 33 18 27 25 Z'
const TUFTS = 'M36 9 L38 0 L42 6 L45 -2 L48 6 L52 -1 L55 6 L59 1 L61 9 Z'

/** His head, `still` on a stage: no blink or lag of its own there; `turned` toward the right, three quarters
 *  on, for a side action: his eyes, nose and smile move toward the way he faces. */
function Head({ profession, still, turned = false }: { profession: Profession; still: boolean; turned?: boolean }) {
  const face = turned ? 'translate(7 0)' : undefined
  return (
    <g className={still ? undefined : toon.head}>
      <circle cx={50} cy={32} r={24.5} fill={HOSE.highlight} stroke={INK} strokeWidth={LINE} />
      <path d="M66 22 C69 34 66 46 60 52" fill="none" stroke={HOSE.paperDark} strokeWidth={3} strokeLinecap="round" />
      <path d={TUFTS} fill={HAIR} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
      <path d={HAIR_CAP} fill={HAIR} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <path d={BEARD} fill={HERO_IDENTITY.beard} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <path d="M43.5 49 Q50 56 56.5 49 Q50 51.5 43.5 49 Z" fill={HOSE.red} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" transform={face} />
      {profession === 'fighter' && <Mongkhon />}
      <g className={still ? undefined : toon.eyes} transform={face}>
        {[43.5, 56.5].map((x) => (
          <g key={x}>
            <ellipse cx={x} cy={31} rx={4.2} ry={7.4} fill={INK} />
            <path d={`M${x} 30 L${x + 3.6} 25 L${x + 1.2} 24.2 Z`} fill={HOSE.highlight} />
          </g>
        ))}
      </g>
      <g transform={turned ? 'translate(11 0)' : undefined}>
        <circle cx={50} cy={40.5} r={3.4} fill={HERO_IDENTITY.skin} stroke={INK} strokeWidth={1.8} />
        <circle cx={49} cy={39.4} r={0.9} fill={HOSE.highlight} />
      </g>
    </g>
  )
}

// His drawing's box in viewBox units, with room above his hair tufts for the bounce's lift and stretch.
const HERO_BOX = { top: -20, height: 170 } as const

/** Everything but the shadow: the legs, the far arm, the body, the head and the near arm. */
function Body({ profession, still, turned = false }: { profession: Profession; still: boolean; turned?: boolean }) {
  const kit = KIT[profession]
  return (
    <>
      <Leg side="left" kit={kit} />
      <Leg side="right" kit={kit} />
      <Arm side="left" kit={kit} />
      <ellipse cx={50} cy={80} rx={12.5} ry={14} fill={kit.shirt} stroke={INK} strokeWidth={LINE} />
      <path
        d="M36.5 84 Q50 79 63.5 84 L64.5 98 Q57 101 51 96.5 L49 96.5 Q43 101 35.5 98 Z"
        fill={kit.bands ? HOSE.red : kit.trousers}
        stroke={INK}
        strokeWidth={LINE}
        strokeLinejoin="round"
      />
      {kit.bands && <path d="M37 86 Q50 81.5 63 86" fill="none" stroke={HOSE.gold} strokeWidth={2.6} />}
      {profession === 'engineer' && <path d="M44 64 L50 70 L56 64" fill="none" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />}
      <Head profession={profession} still={still} turned={turned} />
      <Arm side="right" kit={kit} />
    </>
  )
}

interface HeroCharacterProps {
  profession: Profession
  pose?: HeroPose
  className?: string
}

export const HeroCharacter = memo(function HeroCharacter({ profession, pose = 'idle', className = '' }: HeroCharacterProps) {
  return (
    <svg viewBox={`0 ${HERO_BOX.top} 100 ${HERO_BOX.height}`} className={`${toon.figure} ${className}`} data-pose={pose} aria-hidden="true" focusable="false">
      <ellipse cx={50} cy={146} rx={26} ry={3.4} fill={INK} opacity={0.3} />
      <g className={toon.bounce}>
        <Body profession={profession} still={false} />
      </g>
    </svg>
  )
})

/** His pose on a stage: the shared rig's turns, plus how far he squashes (negative stretches him tall)
 *  and how far his near arm's lower hose stretches past its length. */
export type ToonPose = RigPose & { squash: number; reach: number }

export const TOON_STAND: ToonPose = { ...RIG_STAND, squash: 0, reach: 0 }

/** His rig's groups inside a stage's figure group. */
export const toonJoints = (root: Element): RigJoints => rigJoints(root, RIG_CLASSES)

/** Writes `p` on his groups: the rig's turns, then the squash on the body and the reach on the near arm. */
export function setToonPose(j: RigJoints, p: ToonPose): void {
  setRigPose(j, p)
  if (j.body) j.body.style.transform = `translateY(${p.rise.toFixed(2)}px) rotate(${p.lean.toFixed(1)}deg) scale(${(1 + 0.12 * p.squash).toFixed(3)}, ${(1 - 0.18 * p.squash).toFixed(3)})`
  if (j.foreRight) j.foreRight.style.transform = `rotate(${p.foreRight.toFixed(1)}deg) scaleY(${(1 + p.reach).toFixed(3)})`
}

/** Him on a stage, his feet at 0 0 and his box 100 wide, standing until the writer poses him; `turned` faces
 *  him toward the right, the way he fights. */
export const StageToon = memo(function StageToon({ profession, turned = false }: { profession: Profession; turned?: boolean }) {
  return (
    <g transform="translate(-50 -146)">
      <ellipse cx={50} cy={146} rx={26} ry={3.4} fill={INK} opacity={0.3} />
      <g className={toon.body}>
        <Body profession={profession} still turned={turned} />
      </g>
    </g>
  )
})
