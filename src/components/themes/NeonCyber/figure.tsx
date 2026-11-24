import { memo } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_IDENTITY } from '@/lib/cv/heroIdentity'
import { NEON } from './palette'
import s from './figure.module.css'

// Him as the merc of the neon city the world comes from, side on and facing right: a cropped yellow jacket
// with black panels and a tall upturned collar lit cyan inside, dark cargo trousers and heavy boots, a chrome
// cyberarm on the near side with its seams, optics that glow cyan at the eye and the implant line down his
// temple. An arm blade folds out of the chrome forearm, along it and past the fist. No logo on any of it.
//
// His traits come from HERO_IDENTITY: his skin, his short dark hair, his full dark beard, here in profile.
//
// Drawn in a 100 by 150 box, feet on y 144, on the shared rig's joints: both shoulders turn on one point and
// the hips stand side by side, so every part hangs from the joint it moves with and a negative angle swings a
// limb forward, to the right. The far arm and leg are drawn behind him in shade.
//
// Per profession: the System Engineer raises the chrome hand and data climbs off it; the Musician plays a
// snare in front of him with two sticks; the Martial Artist sheds the jacket, wraps his hands and wears his own
// mongkhon, then throws the knee and the roundhouse. That action plays on his rig in the profession menu, and
// he glitches when hovered. In the scroll scenes the scene poses him instead (pose.ts).

export type HeroMotion = 'still' | 'hack' | 'drum' | 'kick'

/** Each profession's action, the way he would do that job. */
export const HERO_ACTION: Record<Profession, HeroMotion> = {
  engineer: 'hack',
  drummer: 'drum',
  fighter: 'kick',
}

const MOTION_CLASS: Record<HeroMotion, string> = {
  still: '',
  hack: s.hack,
  drum: s.drum,
  kick: s.kick,
}

const KIT_CLASS: Record<Profession, string> = {
  engineer: '',
  drummer: s.kitSticks,
  fighter: s.kitGuard,
}

const LINE = NEON.ink
const LW = 1.4
const SKIN = HERO_IDENTITY.skin
const SKIN_SHADE = HERO_IDENTITY.skinShade
const HAIR = HERO_IDENTITY.hair

// ---- shapes (viewBox 100 by 150, side on facing right, feet on y 144) ----

// The head in profile: the back of the skull on the left, the brow, nose and chin to the right.
const HEAD = 'M41 26 Q41 12 52 11.5 Q61 12 62.5 21 L66 27 L62.8 28.5 Q63 36 58 41 Q52 44 46 40 Q41 35 41 26 Z'
const HAIR_CUT = 'M40.5 27 Q39 10 53 9.5 Q62 10 63 19 Q58 15.5 52 16.5 Q47 18 46 27 Z'
const BEARD = 'M46.5 31 Q47 42 53.5 44.5 Q61 43 63.4 32 L60 33.5 Q57 34.5 55 33 Q50 34 46.5 31 Z'

// The cropped jacket: its body to the waist band, the black side panel and the black lower front.
const JACKET = 'M41 46 Q52 42 62 46 L63 91 L41 91 Z'
const BARE_CHEST = 'M43 47 Q52 44 61 47 L61.5 90 L42.5 90 Z'

// One arm's parts, shoulder at (51, 49), elbow at (51, 67), hand at (51, 88): the far and the near arm are
// the same shape, the far one drawn behind the body in shade.
const UPPER = 'M46.5 46 L55.5 46 L55 68 L47 68 Z'
const FORE = 'M47 66 L55 66 L54.5 85 L47.5 85 Z'
const HAND = { x: 51, y: 88 }

// The legs side by side under the hips, the boots' toes to the right.
const HIP = { right: 49, left: 53 }
const thigh = (x: number) => `M${x - 6} 92 L${x + 6} 92 L${x + 5} 118 L${x - 4.5} 118 Z`
const shin = (x: number) => `M${x - 4.5} 116 L${x + 5} 116 L${x + 4.5} 135 L${x - 4} 135 Z`
const boot = (x: number) => `M${x - 5.5} 132 L${x + 5.5} 132 Q${x + 13} 135 ${x + 13} 144 L${x - 5.5} 144 Z`
const foot = (x: number) => `M${x - 4} 134 L${x + 4.5} 134 Q${x + 11} 138 ${x + 11} 144 L${x - 4} 144 Z`

type Side = 'right' | 'left'

function Shape({ d, fill }: { d: string; fill: string }) {
  return <path d={d} fill={fill} stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
}

// His mongkhon: a white and gold braided crown ring seen from the side, its tail standing up at the back.
function Mongkhon() {
  return (
    <g>
      <path d="M41 19 Q52 13 62 18" fill="none" stroke={LINE} strokeWidth={5.5} strokeLinecap="round" />
      <path d="M41 19 Q52 13 62 18" fill="none" stroke={NEON.ice} strokeWidth={3.6} strokeLinecap="round" />
      <path d="M45 16.5 L47 18 M51 15 L53 16.5 M57 15 L59 16.5" stroke={NEON.gold} strokeWidth={1.1} />
      <Shape d="M42 18 Q35 8 38 2 Q31 8 39 20 Z" fill={NEON.ice} />
    </g>
  )
}

// His optics: the eye lit cyan, dim at rest, bright with a halo when they scan; the implant line down his
// temple to the cheek.
function Optics() {
  return (
    <g>
      <path d="M49 19 L51.5 25 L51 33" fill="none" stroke={NEON.chrome} strokeWidth={0.9} />
      <circle cx={49} cy={19} r={1.2} fill={NEON.data} />
      <rect x={56} y={22.2} width={5.4} height={2.4} rx={1} fill={NEON.data} opacity={0.6} />
      <g className={s.optics}>
        <circle cx={58.7} cy={23.4} r={5} fill={NEON.data} opacity={0.35} />
        <rect x={56} y={22.2} width={5.4} height={2.4} rx={1} fill={NEON.ice} />
      </g>
    </g>
  )
}

function Head({ profession }: { profession: Profession }) {
  return (
    <g>
      <Shape d={HEAD} fill={SKIN} />
      <Shape d={HAIR_CUT} fill={HAIR} />
      <Shape d={BEARD} fill={HAIR} />
      <ellipse cx={48} cy={27} rx={2.6} ry={3.4} fill={SKIN_SHADE} stroke={LINE} strokeWidth={1} />
      <path d="M55 20 L60.5 20.5" stroke={HAIR} strokeWidth={1.8} strokeLinecap="round" />
      {profession === 'fighter' ? <Mongkhon /> : <Optics />}
    </g>
  )
}

// The collar's back half stands up behind his neck, the front half beside his throat, lit cyan inside.
function CollarBack() {
  return <Shape d="M40.5 47 L40 33 Q43 31 46 35 L48 46 Z" fill={NEON.jacket} />
}

function CollarFront() {
  return (
    <g>
      <Shape d="M55 47 L56.5 37 Q60.5 35 62.5 38 L62.5 48 Z" fill={NEON.jacket} />
      <path d="M57.5 38.5 L56.6 46" stroke={NEON.data} strokeWidth={1.4} strokeLinecap="round" />
    </g>
  )
}

function Torso({ profession }: { profession: Profession }) {
  if (profession === 'fighter') {
    return (
      <g>
        <Shape d={BARE_CHEST} fill={SKIN} />
        <path d="M55 58 Q59 61 61 58 M57 64 V84" fill="none" stroke={SKIN_SHADE} strokeWidth={1.1} />
        <Shape d="M41 88 L63 88 L64 102 L40 102 Z" fill={NEON.hotPink} />
        <path d="M41 92 H63.4" stroke={NEON.ice} strokeWidth={1.4} />
      </g>
    )
  }

  return (
    <g>
      <CollarBack />
      <Shape d={JACKET} fill={NEON.jacket} />
      <Shape d="M42 50 L46 49 L45.5 86 L41.6 86 Z" fill={LINE} />
      <Shape d="M56.5 62 L62.6 61 L63 86 L57 86 Z" fill={LINE} />
      <path d="M61.6 49 L62.4 60" stroke={NEON.data} strokeWidth={1.2} />
      <Shape d="M41 86 L63 86 L63 91.5 L41 91.5 Z" fill={NEON.jacketShade} />
      <Shape d="M41 91 L63 91 L63.4 98 L40.6 98 Z" fill={NEON.trousers} />
      <rect x={55} y={92} width={5} height={4} fill={NEON.chrome} stroke={LINE} strokeWidth={0.7} />
    </g>
  )
}

function Leg({ side, profession }: { side: Side; profession: Profession }) {
  const x = HIP[side]
  const far = side === 'right'
  const bare = profession === 'fighter'
  const cloth = bare ? (far ? SKIN_SHADE : SKIN) : far ? NEON.shoe : NEON.trousers
  return (
    <g className={far ? s.thighRight : s.thighLeft}>
      <Shape d={thigh(x)} fill={cloth} />
      {!bare && <rect x={x - 3} y={102} width={7} height={8} fill={far ? NEON.shoe : NEON.steel} stroke={LINE} strokeWidth={0.7} />}
      <g className={far ? s.shinRight : s.shinLeft}>
        <Shape d={shin(x)} fill={cloth} />
        {/* the calf's charge line, lit when his legs wind up a jump */}
        <path className={s.charge} d={`M${x - 2.5} 119 L${x - 2} 132`} stroke={NEON.data} strokeWidth={2.2} strokeLinecap="round" />
        {bare ? <Shape d={foot(x)} fill={far ? SKIN_SHADE : SKIN} /> : <Shape d={boot(x)} fill={NEON.shoe} />}
        {!bare && <path d={`M${x - 5} 140 H${x + 12}`} stroke={NEON.jacket} strokeWidth={1} opacity={0.7} />}
      </g>
    </g>
  )
}

// The arm blade in the chrome forearm: hinged at the wrist, folded back along the forearm until it opens
// past the fist, its edge lit cyan.
function Blade() {
  return (
    <g className={s.blade}>
      <path d="M48.8 80 L53 80 Q58 102 53.5 126 Q51.5 104 48.8 80 Z" fill={NEON.chromeLit} stroke={LINE} strokeWidth={0.9} strokeLinejoin="round" />
      <path d="M52.8 84 Q56 102 53.6 122" fill="none" stroke={NEON.data} strokeWidth={0.9} />
    </g>
  )
}

// A stick in his fist along the forearm's line, its tip past the fist.
function Stick() {
  return <path d={`M${HAND.x} ${HAND.y - 4} L${HAND.x} ${HAND.y + 14}`} stroke={NEON.stickWood} strokeWidth={2.2} strokeLinecap="round" />
}

const SLEEVE: Record<Side, string> = { right: NEON.jacketShade, left: NEON.jacket }

function Arm({ side, profession }: { side: Side; profession: Profession }) {
  const far = side === 'right'
  const bare = profession === 'fighter'
  const chrome = !far && !bare
  const sleeve = bare ? (far ? SKIN_SHADE : SKIN) : SLEEVE[side]
  const fore = chrome ? NEON.chrome : sleeve
  const fist = bare ? NEON.ice : chrome ? NEON.chromeLit : SKIN_SHADE

  return (
    <g className={far ? s.armRight : s.armLeft}>
      <Shape d={UPPER} fill={sleeve} />
      {!bare && <path d="M47 62 H55" stroke={LINE} strokeWidth={3} />}
      <g className={far ? s.foreRight : s.foreLeft}>
        {chrome && <Blade />}
        {profession === 'drummer' && <Stick />}
        <Shape d={FORE} fill={fore} />
        {chrome && <path d="M49 70 V82 M53 70 V82 M47.5 76 H54.5" stroke={NEON.steel} strokeWidth={0.8} />}
        <circle cx={HAND.x} cy={HAND.y} r={4.2} fill={fist} stroke={LINE} strokeWidth={LW} />
      </g>
    </g>
  )
}

// The neon snare on its stand in front of him, where the stick tips land: a dark shell ringed in magenta, the lit head.
function Snare() {
  return (
    <g>
      <path d="M80 98 V140 M80 132 L72 144 M80 132 L88 144" stroke={NEON.steel} strokeWidth={1.6} />
      <Shape d="M68 87 L92 87 L91 99 L69 99 Z" fill={NEON.panel} />
      <path d="M68.5 91 H91.5 M68.8 95.5 H91.2" stroke={NEON.magenta} strokeWidth={1.2} />
      <ellipse className={s.drumHead} cx={80} cy={87} rx={12} ry={2.6} fill={NEON.data} stroke={LINE} strokeWidth={LW} />
    </g>
  )
}

// The data climbing off his raised chrome hand in the hack (the hack pose puts the hand at about 90, 52).
function Glyphs() {
  return (
    <g className={s.glyphs} fill={NEON.hack}>
      <rect x={91} y={44} width={3} height={3} />
      <rect x={97} y={39} width={3} height={3} />
      <rect x={92} y={33} width={3} height={3} />
    </g>
  )
}

interface HeroProps {
  profession: Profession
  motion: HeroMotion
  className?: string
}

/** His figure's groups in the 100 by 150 viewBox, playing `motion`; a stage places it in a nested svg of
 *  that viewBox and poses its joints itself (pose.ts), with the motion left 'still'. The Musician's snare
 *  stands before him where he plays it (the menu's club, the stage); `snare` false leaves it behind. */
export function HeroFigure({ profession, motion, snare = true }: Omit<HeroProps, 'className'> & { snare?: boolean }) {
  return (
    <g className={`${s.sprite} ${KIT_CLASS[profession]} ${MOTION_CLASS[motion]}`}>
      <ellipse className={s.shadow} cx={52} cy={145} rx={18} ry={2.6} fill={NEON.magenta} opacity={0.35} />
      <g className={s.glitch}>
        <g className={s.ghost} aria-hidden="true">
          <path d={JACKET} fill={NEON.cyan} opacity={0.5} />
          <path d={HEAD} fill={NEON.hotPink} opacity={0.5} />
        </g>
        <g className={s.body}>
          <Arm side="right" profession={profession} />
          <Leg side="right" profession={profession} />
          <Leg side="left" profession={profession} />
          <Torso profession={profession} />
          <Head profession={profession} />
          {profession !== 'fighter' && <CollarFront />}
          {snare && profession === 'drummer' && <Snare />}
          <Arm side="left" profession={profession} />
          {profession === 'engineer' && <Glyphs />}
        </g>
      </g>
    </g>
  )
}

/** Him in a profession's kit, playing one motion; he glitches when hovered.
 *  Memoised on its three primitive props, so a parent render that keeps them redraws none of his svg. */
export const HeroSprite = memo(function HeroSprite({ profession, motion, className = '' }: HeroProps) {
  return (
    <svg viewBox="0 0 100 150" className={`overflow-visible ${className}`} aria-hidden="true" focusable="false">
      <HeroFigure profession={profession} motion={motion} />
    </svg>
  )
})
