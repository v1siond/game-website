import { memo } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_IDENTITY } from '@/lib/cv/heroIdentity'
import { NEON } from './palette'
import s from './figure.module.css'

// Him as this world's own figure, an augmented operative of the neon city: a dark long coat with a cyan
// piped hem and a low collar, a thin visor lit cyan across the eyes, gloves with a wrist deck on the left
// forearm, a short blade sheathed across his back (its hilt over the right shoulder), dark trousers and
// heavy boots. Drawn at sprite size with a hard dark outline, flat fills and one cut of neon rim light on
// the lit side.
//
// His traits come from HERO_IDENTITY: his brown skin, short dark hair cut close, his full dark beard.
//
// Per profession: the System Engineer raises the wrist deck and data climbs off it; the Musician drops
// behind a neon snare with two sticks; the Martial Artist sheds the coat, wraps his hands and wears his own
// mongkhon, then throws the knee and the roundhouse. That action plays on his rig in the profession menu,
// and he glitches when hovered. In the scroll scenes the scene poses him instead (pose.ts): the walk, the
// hack, the takedown, the run and the leap, the swing, the drawn blade's deflect and cut, the drums, the kick.

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
const LW = 1.6
const SKIN = HERO_IDENTITY.skin
const SKIN_SHADE = HERO_IDENTITY.skinShade
const HAIR = HERO_IDENTITY.hair
const COAT = NEON.coat
const COAT_LIT = NEON.coatLit
const PIPING = NEON.data
const GLOVE = NEON.panel
const VISOR = NEON.data
const STEEL = NEON.chrome
const STEEL_LIT = NEON.ash

// ---- shapes (viewBox 100 by 150, three quarter to the viewer facing right, feet on y 144) ----

const HEAD = 'M38 26 Q38 12 50 12 Q62 12 62 26 Q62 40 50 43 Q38 40 38 26 Z'
const HAIR_CUT = 'M37.5 25 Q37 10 50 9.5 Q63 10 62.5 25 Q60 17 54 16.5 Q48 14.5 43 17 Q39 19 37.5 25 Z'
const BEARD = 'M38.5 28 Q39 42 50 45.5 Q61 42 61.5 28 Q58.5 34.5 54 34.5 Q50 32.5 46 34.5 Q41.5 34.5 38.5 28 Z'
const COLLAR = 'M37 38 L42 34 L50 42 L58 34 L63 38 L60 48 L40 48 Z'
const COAT_BODY = 'M31 46 Q50 40 69 46 L71 96 L29 96 Z'
// The coat's skirt hangs behind his legs from the waist, split at the back, its hem piped in cyan.
const COAT_SKIRT = 'M30 90 L70 90 L74 124 L56 126 L50 108 L44 126 L26 124 Z'
const BARE_CHEST = 'M33 47 Q50 42 67 47 L66 86 L34 86 Z'

const UPPER = {
  right: 'M27 46 L37 47 L35 68 L26 66.5 Z',
  left: 'M63 47 L73 46 L74 66.5 L65 68 Z',
}
const FORE = {
  right: 'M26 65 L35 66.5 L34 84 L27 84 Z',
  left: 'M65 66.5 L74 65 L73.5 84 L66 84 Z',
}
const HAND = { right: { x: 30.5, y: 88 }, left: { x: 69.8, y: 88 } }

const THIGH = {
  right: 'M34 92 L49 92 L47.5 118 L37 118 Z',
  left: 'M51 92 L66 92 L63 118 L52.5 118 Z',
}
const SHIN = {
  right: 'M37 116 L47.5 116 L47 135 L37.5 135 Z',
  left: 'M52.5 116 L63 116 L62 135 L53 135 Z',
}
const BOOT = {
  right: 'M36 133 L48.5 133 L48.5 144 L31 144 Q31 136 36 133 Z',
  left: 'M52 133 L63 133 Q68.5 136 68.5 144 L52 144 Z',
}

type Side = 'right' | 'left'

// The left hand wears the deck's glove, the right is his own; wraps cover both for the fight.
const HAND_FILL: Record<Side, string> = { right: SKIN, left: GLOVE }

function Shape({ d, fill }: { d: string; fill: string }) {
  return <path d={d} fill={fill} stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
}

// His mongkhon: a white and gold braided crown ring, its tail standing up at the back, rimmed in neon.
function Mongkhon() {
  return (
    <g>
      <path d="M38 19 Q50 12 62 19" fill="none" stroke={LINE} strokeWidth={5.5} strokeLinecap="round" />
      <path d="M38 19 Q50 12 62 19" fill="none" stroke={NEON.ice} strokeWidth={3.6} strokeLinecap="round" />
      <path d="M41 17 L43 18.5 M47 15 L49 16.5 M53 15 L55 16.5 M59 16.5 L61 18" stroke={NEON.gold} strokeWidth={1.1} />
      <Shape d="M59 16 Q66 6 63 1 Q70 6 64 18 Z" fill={NEON.ice} />
    </g>
  )
}

// The visor: a thin dark band across the eyes, its lit strip brightening when he hacks or fights.
function Visor() {
  return (
    <g>
      <path d="M39.5 22.5 H60.5 L60 27 H40 Z" fill={NEON.ink} stroke={LINE} strokeWidth={1} />
      <rect x={41} y={23.6} width={18} height={1.6} fill={VISOR} opacity={0.45} />
      <rect className={s.visor} x={41} y={23.6} width={18} height={1.6} fill={NEON.ice} />
    </g>
  )
}

function Head({ profession }: { profession: Profession }) {
  return (
    <g className={s.head}>
      <circle cx={38.5} cy={28} r={3} fill={SKIN_SHADE} stroke={LINE} strokeWidth={LW} />
      <circle cx={61.5} cy={28} r={3} fill={SKIN_SHADE} stroke={LINE} strokeWidth={LW} />
      <Shape d={HEAD} fill={SKIN} />
      <Shape d={HAIR_CUT} fill={HAIR} />
      <Shape d={BEARD} fill={HAIR} />
      <path d="M46.5 36.5 Q50 38.5 53.5 36.5" fill="none" stroke={SKIN_SHADE} strokeWidth={1.2} strokeLinecap="round" />
      {profession === 'fighter' ? <Mongkhon /> : <Visor />}
    </g>
  )
}

// The blade's sheath across his back: its hilt shows over the right shoulder while the blade is home.
function Sheath() {
  return (
    <g>
      <path d="M62 40 L38 92" stroke={NEON.ink} strokeWidth={4.5} strokeLinecap="round" />
      <g className={s.hilt}>
        <path d="M62 40 L67 29" stroke={STEEL} strokeWidth={2.6} strokeLinecap="round" />
        <path d="M59.5 39 L65 42" stroke={PIPING} strokeWidth={1.6} strokeLinecap="round" />
      </g>
    </g>
  )
}

function Torso({ profession }: { profession: Profession }) {
  if (profession === 'fighter') {
    return (
      <g>
        <Shape d={BARE_CHEST} fill={SKIN} />
        <path d="M41 58 Q45.5 61 50 58 Q54.5 61 59 58 M50 63 V82" fill="none" stroke={SKIN_SHADE} strokeWidth={1.1} />
        <Shape d="M32 84 L68 84 L69 96 L31 96 Z" fill={NEON.hotPink} />
        <path d="M32 87 H68" stroke={NEON.ice} strokeWidth={1.4} />
      </g>
    )
  }

  return (
    <g>
      <Shape d={COAT_BODY} fill={COAT} />
      <path d="M50 48 V96" stroke={NEON.ink} strokeWidth={1.2} />
      <Shape d={COLLAR} fill={COAT_LIT} />
      <path d="M42 35 L50 43 L58 35" fill="none" stroke={PIPING} strokeWidth={1} />
      {/* the rim light down the lit side and the belt */}
      <path d="M68.5 48 L70 92" stroke={NEON.magenta} strokeWidth={1.4} opacity={0.7} />
      <Shape d="M30 86 L70 86 L70.4 91 L29.6 91 Z" fill={NEON.ink} />
      <rect x={46} y={86.5} width={8} height={4} fill={STEEL} stroke={LINE} strokeWidth={0.8} />
    </g>
  )
}

function Skirt() {
  return (
    <g>
      <Shape d={COAT_SKIRT} fill={COAT} />
      <path d="M26 124 L44 126 M56 126 L74 124" stroke={PIPING} strokeWidth={1.4} />
    </g>
  )
}

function Leg({ side, profession }: { side: Side; profession: Profession }) {
  const trouser = profession === 'fighter' ? SKIN : NEON.trousers

  return (
    <g className={side === 'right' ? s.thighRight : s.thighLeft}>
      <Shape d={THIGH[side]} fill={trouser} />
      <g className={side === 'right' ? s.shinRight : s.shinLeft}>
        <Shape d={SHIN[side]} fill={trouser} />
        <Shape d={BOOT[side]} fill={profession === 'fighter' ? SKIN : NEON.shoe} />
        {profession !== 'fighter' && <path d={side === 'right' ? 'M33 140 H48' : 'M52 140 H67'} stroke={PIPING} strokeWidth={1} opacity={0.7} />}
      </g>
    </g>
  )
}

// The drawn blade in the right fist, along the forearm's line, a straight single edge lit cyan.
function Blade() {
  return (
    <g className={s.blade}>
      <path d="M26.5 89.5 H34.5" stroke={STEEL} strokeWidth={2} strokeLinecap="round" />
      <path d="M29.2 91 L31.8 91 L31.4 128 L30.5 133 L29.6 128 Z" fill={STEEL_LIT} stroke={LINE} strokeWidth={0.9} strokeLinejoin="round" />
      <path d="M31.4 93 L31 127" stroke={PIPING} strokeWidth={0.8} />
    </g>
  )
}

// The wrist deck on the left glove: a dark slab whose screen lights when he hacks.
function Deck() {
  return (
    <g>
      <rect x={65.5} y={74} width={8.6} height={6} fill={NEON.ink} stroke={LINE} strokeWidth={0.9} />
      <rect className={s.deck} x={66.6} y={75.1} width={6.4} height={3.8} fill={VISOR} />
    </g>
  )
}

// The data climbing off the deck in the hack (the hack pose puts the left hand at about 100, 65).
function Glyphs() {
  return (
    <g className={s.glyphs} fill={NEON.hack}>
      <rect x={95} y={58} width={3} height={3} />
      <rect x={101} y={53} width={3} height={3} />
      <rect x={96} y={47} width={3} height={3} />
    </g>
  )
}

function Hand({ side, profession }: { side: Side; profession: Profession }) {
  const { x, y } = HAND[side]
  const fill = profession === 'fighter' ? NEON.ice : HAND_FILL[side]

  return (
    <g>
      {profession === 'drummer' && <path d={`M${x} ${y} L${x + (side === 'right' ? 10 : -10)} ${y + 12}`} stroke={NEON.stickWood} strokeWidth={2.2} strokeLinecap="round" />}
      <circle cx={x} cy={y} r={4.4} fill={fill} stroke={LINE} strokeWidth={LW} />
    </g>
  )
}

function Arm({ side, profession }: { side: Side; profession: Profession }) {
  const sleeve = profession === 'fighter' ? SKIN : COAT
  const fore = side === 'left' && profession !== 'fighter' ? GLOVE : sleeve

  return (
    <g className={side === 'right' ? s.armRight : s.armLeft}>
      <Shape d={UPPER[side]} fill={sleeve} />
      <g className={side === 'right' ? s.foreRight : s.foreLeft}>
        {side === 'right' && <Blade />}
        <Shape d={FORE[side]} fill={fore} />
        {side === 'left' && profession !== 'fighter' && <Deck />}
        <Hand side={side} profession={profession} />
      </g>
    </g>
  )
}

// The neon snare on its stand at his waist, where the stick tips land: a dark shell ringed in magenta, the lit head.
function Snare() {
  return (
    <g>
      <path d="M50 112 V138 M50 132 L40 144 M50 132 L60 144" stroke={NEON.steel} strokeWidth={1.6} />
      <Shape d="M33 96 L67 96 L65 112 L35 112 Z" fill={NEON.panel} />
      <path d="M33 100 H67 M34 108 H66" stroke={NEON.magenta} strokeWidth={1.4} />
      <ellipse className={s.drumHead} cx={50} cy={96} rx={17} ry={3.6} fill={NEON.data} stroke={LINE} strokeWidth={LW} />
    </g>
  )
}

interface HeroProps {
  profession: Profession
  motion: HeroMotion
  className?: string
}

/** His figure's groups in the 100 by 150 viewBox, playing `motion`; a stage places it in a nested svg of
 *  that viewBox and poses its joints itself (pose.ts), with the motion left 'still'. */
export function HeroFigure({ profession, motion }: Omit<HeroProps, 'className'>) {
  const coated = profession !== 'fighter'
  return (
    <g className={`${s.sprite} ${KIT_CLASS[profession]} ${MOTION_CLASS[motion]}`}>
      <ellipse className={s.shadow} cx={50} cy={145} rx={20} ry={2.6} fill={NEON.magenta} opacity={0.35} />
      <g className={s.glitch}>
        <g className={s.ghost} aria-hidden="true">
          <path d={COAT_BODY} fill={NEON.cyan} opacity={0.5} />
          <path d={HEAD} fill={NEON.hotPink} opacity={0.5} />
        </g>
        <g className={s.body}>
          {coated && <Skirt />}
          <Leg side="right" profession={profession} />
          <Leg side="left" profession={profession} />
          <g className={s.chest}>
            {coated && <Sheath />}
            <Torso profession={profession} />
            <Head profession={profession} />
          </g>
          {profession === 'drummer' && <Snare />}
          <Arm side="right" profession={profession} />
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
