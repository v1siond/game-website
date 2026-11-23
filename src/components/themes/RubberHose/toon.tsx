import { memo } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_IDENTITY } from '@/lib/cv/heroIdentity'
import { HOSE } from './palette'
import toon from './toon.module.css'

// Him as a 1930s rubber hose cartoon character: one thick ink line, a big round head with pie cut eyes and
// a red nose, limbs as bendy hoses with no elbows, white four finger gloves, a black shirt, red shorts and
// big brown shoes. He stays him: his short dark hair as a cap with a few spiky tufts, and his full dark
// beard round the lower face with the smile drawn into it. The world's film grain lies over all of it.
//
// On a page (the title card, the cast badges) his poses are transform keyframes in toon.module.css keyed
// off data-pose: the bounce on the beat and the step in place, or the finger gun shot of the picked badge.
// Hovering him parries: the pink slap flash, from any pose. Each loop plays a set number of beats and he
// rests on the pose's held angle within 5 s. On a stage (StageToon) he is drawn still in each frame the scroll can
// show, his limbs at fixed angles, and the scroll picks the frame.
//
// The Martial Artist wears red boxing gloves, the prajioud on his arms and his own mongkhon round his head.

export type HeroPose = 'idle' | 'shoot'

const INK = HOSE.ink
const LINE = 3
const HAIR = HERO_IDENTITY.hair

const BEARD = 'M30.5 37 C32.5 52 40 59.5 50 59.5 C60 59.5 67.5 52 69.5 37 C64 41.5 58 43 54 43.5 C52 41.6 48 41.6 46 43.5 C42 43 36 41.5 30.5 37 Z'
const ARM_BACK = 'M0 0 Q-11 11 -6 23'
const ARM_FRONT = 'M0 0 Q11 11 6 23'
const LEG_BACK = 'M0 0 Q-5 22 -3 42'
const LEG_FRONT = 'M0 0 Q5 22 3 42'

function Hose({ d }: { d: string }) {
  return (
    <>
      <path d={d} fill="none" stroke={INK} strokeWidth={6.4} strokeLinecap="round" />
      <path d={d} fill="none" stroke={HOSE.highlight} strokeWidth={2.6} strokeLinecap="round" />
    </>
  )
}

// A cartoon glove at (x, y): the puffed cuff, the round hand and the three stitch lines; a finger gun
// points its index finger out along the arm's end.
function Glove({ x, y, gun = false, color = HOSE.highlight }: { x: number; y: number; gun?: boolean; color?: string }) {
  return (
    <g>
      <ellipse cx={x} cy={y - 3} rx={4.6} ry={2.4} fill={color} stroke={INK} strokeWidth={2} />
      {gun && <rect x={x - 1.6} y={y + 2} width={3.2} height={8} rx={1.6} fill={color} stroke={INK} strokeWidth={2} />}
      <circle cx={x} cy={y + 2} r={5.4} fill={color} stroke={INK} strokeWidth={2.2} />
      {!gun && color === HOSE.highlight && <path d={`M${x - 2} ${y + 1} v3 M${x} ${y + 1.4} v3 M${x + 2} ${y + 1} v3`} stroke={INK} strokeWidth={0.9} />}
    </g>
  )
}

interface Kit {
  glove: string
  sticks: boolean
  bands: boolean
}

const KIT: Record<Profession, Kit> = {
  engineer: { glove: HOSE.highlight, sticks: false, bands: false },
  drummer: { glove: HOSE.highlight, sticks: true, bands: false },
  fighter: { glove: HOSE.red, sticks: false, bands: true },
}

/** A limb's class on a page, or its fixed turn in degrees on a stage. */
type Limb = { still: false } | { still: true; turn: number }

const limbProps = (limb: Limb, cls: string) => (limb.still ? { transform: `rotate(${limb.turn})` } : { className: cls })

function Arm({ side, kit, gun, limb }: { side: 'back' | 'front'; kit: Kit; gun: boolean; limb: Limb }) {
  const front = side === 'front'
  const hand = front ? 6 : -6
  return (
    <g transform={`translate(${front ? 61 : 39} 70)`}>
      <g {...limbProps(limb, front ? toon.armFront : toon.armBack)}>
        <Hose d={front ? ARM_FRONT : ARM_BACK} />
        {kit.bands && <rect x={front ? 2.4 : -6.4} y={6} width={4} height={4} rx={1} fill={HOSE.red} stroke={INK} strokeWidth={1.4} />}
        {kit.sticks && <path d={`M${hand} 25 L${hand + (front ? 14 : -14)} 40`} stroke={HOSE.gold} strokeWidth={2.4} strokeLinecap="round" />}
        <Glove x={hand} y={24} gun={front && gun} color={kit.glove} />
      </g>
    </g>
  )
}

function Leg({ side, limb }: { side: 'back' | 'front'; limb: Limb }) {
  const front = side === 'front'
  return (
    <g transform={`translate(${front ? 55 : 45} 94)`}>
      <g {...limbProps(limb, front ? toon.legFront : toon.legBack)}>
        <path d={front ? LEG_FRONT : LEG_BACK} fill="none" stroke={INK} strokeWidth={4.4} strokeLinecap="round" />
        <ellipse cx={front ? 8 : -8} cy={46} rx={10} ry={5.4} fill={HOSE.shoe} stroke={INK} strokeWidth={LINE} />
        <ellipse cx={front ? 11 : -5} cy={44.4} rx={3} ry={1.4} fill={HOSE.highlight} opacity={0.7} />
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

/** His head, `still` on a stage: no blink or lag of its own there. */
function Head({ profession, still }: { profession: Profession; still: boolean }) {
  return (
    <g className={still ? undefined : toon.head}>
      <circle cx={50} cy={32} r={24.5} fill={HOSE.highlight} stroke={INK} strokeWidth={LINE} />
      <path d="M66 22 C69 34 66 46 60 52" fill="none" stroke={HOSE.paperDark} strokeWidth={3} strokeLinecap="round" />
      <path d={TUFTS} fill={HAIR} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
      <path d={HAIR_CAP} fill={HAIR} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <path d={BEARD} fill={HERO_IDENTITY.beard} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <path d="M43.5 49 Q50 56 56.5 49 Q50 51.5 43.5 49 Z" fill={HOSE.red} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      {profession === 'fighter' && <Mongkhon />}
      <g className={still ? undefined : toon.eyes}>
        {[43.5, 56.5].map((x) => (
          <g key={x}>
            <ellipse cx={x} cy={31} rx={4.2} ry={7.4} fill={INK} />
            <path d={`M${x} 30 L${x + 3.6} 25 L${x + 1.2} 24.2 Z`} fill={HOSE.highlight} />
          </g>
        ))}
      </g>
      <circle cx={50} cy={40.5} r={3.6} fill={HOSE.red} stroke={INK} strokeWidth={1.8} />
      <circle cx={49} cy={39.4} r={1} fill={HOSE.highlight} />
    </g>
  )
}

// His drawing's box in viewBox units, with room above his hair tufts for the bounce's lift and stretch.
const HERO_BOX = { top: -20, height: 170 } as const

/** His limbs' fixed turns in a stage frame, in degrees; the front arm raised forward is negative. */
export interface StillPose {
  armFront: number
  armBack: number
  legFront: number
  legBack: number
  /** He lifts off the ground by this much, in viewBox units. */
  rise: number
  gun: boolean
}

const PAGE: Limb = { still: false }
const still = (turn: number): Limb => ({ still: true, turn })

/** Everything but the shadow: his limbs on the page's classes, or fixed at a stage frame's turns. */
function Body({ profession, gun, pose }: { profession: Profession; gun: boolean; pose: StillPose | null }) {
  const kit = KIT[profession]
  const limb = (turn: keyof Omit<StillPose, 'rise' | 'gun'>): Limb => (pose ? still(pose[turn]) : PAGE)
  return (
    <>
      <Leg side="back" limb={limb('legBack')} />
      <Leg side="front" limb={limb('legFront')} />
      <Arm side="back" kit={kit} gun={false} limb={limb('armBack')} />
      <ellipse cx={50} cy={80} rx={12.5} ry={14} fill={HOSE.inkSoft} stroke={INK} strokeWidth={LINE} />
      <path d="M36.5 84 Q50 79 63.5 84 L64.5 98 Q57 101 51 96.5 L49 96.5 Q43 101 35.5 98 Z" fill={HOSE.red} stroke={INK} strokeWidth={LINE} strokeLinejoin="round" />
      {kit.bands ? (
        <path d="M37 86 Q50 81.5 63 86" fill="none" stroke={HOSE.gold} strokeWidth={2.6} />
      ) : (
        [45, 55].map((x) => <circle key={x} cx={x} cy={88} r={1.8} fill={HOSE.highlight} stroke={INK} strokeWidth={1} />)
      )}
      {profession === 'engineer' && <path d="M44 63 L50 66 L56 63 L56 69 L50 66 L44 69 Z" fill={HOSE.red} stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />}
      <Head profession={profession} still={pose !== null} />
      <Arm side="front" kit={kit} gun={gun} limb={limb('armFront')} />
    </>
  )
}

interface HeroCharacterProps {
  profession: Profession
  pose?: HeroPose
  className?: string
}

export const HeroCharacter = memo(function HeroCharacter({ profession, pose = 'idle', className = '' }: HeroCharacterProps) {
  const gun = pose === 'shoot'

  return (
    <svg viewBox={`0 ${HERO_BOX.top} 100 ${HERO_BOX.height}`} className={`${toon.figure} ${className}`} data-pose={pose} aria-hidden="true" focusable="false">
      <ellipse cx={50} cy={146} rx={26} ry={3.4} fill={INK} opacity={0.3} />
      <g className={toon.bounce}>
        <Body profession={profession} gun={gun} pose={null} />
        {gun && <circle className={toon.bullet} cx={84} cy={70} r={3.4} fill={HOSE.blue} stroke={INK} strokeWidth={1.4} />}
        <path className={toon.parry} d="M80 40 L84 48 L93 46 L86 53 L91 61 L82 57 L76 64 L76 55 L68 52 L77 49 Z" fill={HOSE.parry} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      </g>
    </svg>
  )
})

/** His frames on a stage (stage.tsx): standing, two strides, his profession's two act frames. */
export type Frame = 'stand' | 'stepA' | 'stepB' | 'actA' | 'actB'

const STAND: StillPose = { armFront: 0, armBack: 0, legFront: 0, legBack: 0, rise: 0, gun: false }

const STRIDE: Record<'stepA' | 'stepB', StillPose> = {
  stepA: { armFront: 28, armBack: -28, legFront: -26, legBack: 22, rise: 3, gun: false },
  stepB: { armFront: -28, armBack: 28, legFront: 22, legBack: -26, rise: 3, gun: false },
}

// Each profession's act in two frames: the finger gun aimed then fired, the sticks up then down on the
// beat, the guard then the rubber hose jab.
const ACTS: Record<Profession, Record<'actA' | 'actB', StillPose>> = {
  engineer: { actA: { ...STAND, armFront: -80, gun: true }, actB: { ...STAND, armFront: -95, rise: 2, gun: true } },
  drummer: { actA: { ...STAND, armFront: -130, armBack: 130 }, actB: { ...STAND, armFront: -40, armBack: 40, rise: 2 } },
  fighter: { actA: { ...STAND, armFront: -60, armBack: 60, legFront: -10 }, actB: { ...STAND, armFront: -100, armBack: 40, legFront: -18, rise: 2 } },
}

const posesOf = (profession: Profession): ReadonlyArray<readonly [Frame, StillPose]> => [
  ['stand', STAND],
  ['stepA', STRIDE.stepA],
  ['stepB', STRIDE.stepB],
  ['actA', ACTS[profession].actA],
  ['actB', ACTS[profession].actB],
]

/**
 * Him on a stage, his feet at 0 0 and his box 100 wide: every frame drawn once, still, all but the
 * standing one hidden; the scroll shows one at a time (the shared stage's frames, through the rig in
 * stage.tsx).
 */
export const StageToon = memo(function StageToon({ profession }: { profession: Profession }) {
  return (
    <g transform="translate(-50 -146)">
      <ellipse cx={50} cy={146} rx={26} ry={3.4} fill={INK} opacity={0.3} />
      {posesOf(profession).map(([frame, pose]) => (
        <g key={frame} data-frame={frame} visibility={frame === 'stand' ? 'visible' : 'hidden'} transform={`translate(0 ${-pose.rise})`}>
          <Body profession={profession} gun={pose.gun} pose={pose} />
        </g>
      ))}
    </g>
  )
})
