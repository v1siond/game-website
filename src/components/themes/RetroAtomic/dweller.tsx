import type { Profession } from '@/lib/cv/professions'
import { HERO_IDENTITY } from '@/components/cv/heroIdentity'
import {
  BAKELITE,
  BRASS,
  CREAM,
  CREAM_SHADE,
  GLASS,
  OLIVE,
  OLIVE_DARK,
  PHOSPHOR,
  PHOSPHOR_DEEP,
  PHOSPHOR_DIM,
  POSTER_INK,
  SHELTER_BLUE,
  SHELTER_BLUE_DARK,
  SHELTER_YELLOW,
  WARNING_RED,
} from './palette'
import s from './dweller.module.css'

// Him as this world's own figure, a parody of the shelter dweller drawn as the mascot of that game's
// posters and perk cards (Fallout's Vault Boy and the Vault Dweller): a big round head on a small body,
// the wide toothy grin and the wink, the blue jumpsuit with the yellow collar, placket, cuffs and belt
// buckle, black boots, the wrist terminal strapped on the left forearm with its green screen. Drawn the
// poster way: flat fills, one thick ink outline round every shape, a cream highlight, no gradients. The
// same drawing has a phosphor tone for the wrist terminal's status screen: every fill a shade of the
// tube's green, the line in bright green.
//
// His traits come from HERO_IDENTITY: his brown skin, short dark hair (where the mascot has a blond
// quiff), his full dark beard round the grin and dark oval eyes.
//
// Per profession: the System Engineer in the jumpsuit, whose action is raising the wrist terminal and
// tapping its keys while the screen flickers; the Musician in the jumpsuit at a snare with two sticks,
// whose action is the drum roll; the Martial Artist with the jumpsuit rolled down to the waist and the
// sleeves tied, bare chested with wrapped hands and his own mongkhon, whose action is the knee then the
// side kick. Every one can idle (bounce, blink), walk the jaunty poster walk, take the targeting stance
// with the bracket reticle, and give the level up thumbs up with a wink and a star. The bands section has
// him hold the bakelite radio to his chest, turn its knob and dance each station's step; the Muay Thai
// spar has the clinch knee and the roundhouse kick, both landing on the foe at his left (the viewer's right).

export type DwellerTone = 'poster' | 'phosphor'
export type DwellerMotion =
  | 'still'
  | 'idle'
  | 'walk'
  | 'thumbsUp'
  | 'target'
  | 'type'
  | 'drum'
  | 'strike'
  | 'hoist'
  | 'aim'
  | 'fire'
  | 'tune'
  | 'sway'
  | 'twist'
  | 'shuffle'
  | 'bop'
  | 'knee'
  | 'kick'

/** The radio dance's motions: he holds the bakelite radio in all of them. */
export type RadioMotion = Extract<DwellerMotion, 'tune' | 'sway' | 'twist' | 'shuffle' | 'bop'>

const HOLDS_RADIO: Record<DwellerMotion, boolean> = {
  still: false,
  idle: false,
  walk: false,
  thumbsUp: false,
  target: false,
  type: false,
  drum: false,
  strike: false,
  hoist: false,
  aim: false,
  fire: false,
  tune: true,
  sway: true,
  twist: true,
  shuffle: true,
  bop: true,
  knee: false,
  kick: false,
}

/** Each profession's action, the way the dweller would do that job. */
export const DWELLER_ACTION: Record<Profession, DwellerMotion> = {
  engineer: 'type',
  drummer: 'drum',
  fighter: 'strike',
}

const MOTION_CLASS: Record<DwellerMotion, string> = {
  still: '',
  idle: s.idle,
  walk: s.walk,
  thumbsUp: s.thumbsUp,
  target: s.target,
  type: s.type,
  drum: s.drum,
  strike: s.strike,
  hoist: s.hoist,
  aim: s.aim,
  fire: s.fire,
  tune: `${s.holdRadio} ${s.tune}`,
  sway: `${s.holdRadio} ${s.sway}`,
  twist: `${s.holdRadio} ${s.twist}`,
  shuffle: `${s.holdRadio} ${s.shuffle}`,
  bop: `${s.holdRadio} ${s.bop}`,
  knee: s.knee,
  kick: s.kick,
}

const KIT_CLASS: Record<Profession, string> = {
  engineer: '',
  drummer: s.kitSticks,
  fighter: s.kitGuard,
}

interface Inks {
  line: string
  lineWidth: number
  skin: string
  skinShade: string
  hair: string
  eye: string
  teeth: string
  suit: string
  suitShade: string
  trim: string
  boot: string
  device: string
  screen: string
  wrap: string
  band: string
}

const INKS: Record<DwellerTone, Inks> = {
  poster: {
    line: POSTER_INK,
    lineWidth: 2,
    skin: HERO_IDENTITY.skin,
    skinShade: HERO_IDENTITY.skinShade,
    hair: HERO_IDENTITY.hair,
    eye: HERO_IDENTITY.eyes,
    teeth: CREAM,
    suit: SHELTER_BLUE,
    suitShade: SHELTER_BLUE_DARK,
    trim: SHELTER_YELLOW,
    boot: BAKELITE,
    device: OLIVE,
    screen: PHOSPHOR,
    wrap: CREAM_SHADE,
    band: WARNING_RED,
  },
  phosphor: {
    line: PHOSPHOR,
    lineWidth: 1.1,
    skin: PHOSPHOR_DEEP,
    skinShade: GLASS,
    hair: PHOSPHOR_DIM,
    eye: PHOSPHOR,
    teeth: PHOSPHOR,
    suit: GLASS,
    suitShade: GLASS,
    trim: PHOSPHOR_DIM,
    boot: PHOSPHOR_DEEP,
    device: OLIVE_DARK,
    screen: PHOSPHOR,
    wrap: PHOSPHOR_DIM,
    band: PHOSPHOR_DIM,
  },
}

// ---- shapes (viewBox 100 by 150, facing the viewer, feet on y 144) ----

const HEAD = 'M30 34 Q30 12 50 12 Q70 12 70 34 Q70 54 50 57 Q30 54 30 34 Z'
const HAIR = 'M30.5 31 Q29 10 50 9.5 Q66 9 70.5 26 Q63 16.5 53 19 Q45 15 38 20 Q33 24 32.5 32 Z'
const BEARD = 'M31.5 37 Q32 56 50 60 Q68 56 68.5 37 Q64.5 45.5 58.5 45.5 Q50 42.5 41.5 45.5 Q35.5 45.5 31.5 37 Z'
const GRIN = 'M40 45.5 Q50 55 60 45.5 Q50 48.5 40 45.5 Z'
const SUIT = 'M34 58 Q50 54 66 58 L67 96 L33 96 Z'
const CHEST = 'M35 59 Q50 55 65 59 L65 86 L35 86 Z'

const UPPER = {
  right: 'M29 58.5 L38.5 60 L36.5 79 L27.5 77.5 Z',
  left: 'M61.5 60 L71 58.5 L72.5 77.5 L63.5 79 Z',
}
const FORE = {
  right: 'M27.5 76 L36.5 77.5 L35.5 93 L28 93 Z',
  left: 'M63.5 77.5 L72.5 76 L72 93 L64.5 93 Z',
}
const HAND = { right: { x: 31.8, y: 97 }, left: { x: 68.2, y: 97 } }

const THIGH = {
  right: 'M35.5 94 L49.5 94 L48 120 L38 120 Z',
  left: 'M50.5 94 L64.5 94 L62 120 L52 120 Z',
}
const SHIN = {
  right: 'M38 118 L48 118 L47.5 137 L38.5 137 Z',
  left: 'M52 118 L62 118 L61.5 137 L52.5 137 Z',
}
const BOOT = {
  right: 'M37 135 L49 135 L49 144 L32.5 144 Q32.5 137.5 37 135 Z',
  left: 'M51 135 L63 135 Q67.5 137.5 67.5 144 L51 144 Z',
}

type Side = 'right' | 'left'

function Shape({ d, fill, inks }: { d: string; fill: string; inks: Inks }) {
  return <path d={d} fill={fill} stroke={inks.line} strokeWidth={inks.lineWidth} strokeLinejoin="round" />
}

function Head({ profession, inks }: { profession: Profession; inks: Inks }) {
  return (
    <g className={s.head}>
      <circle cx={30.5} cy={36} r={4.2} fill={inks.skinShade} stroke={inks.line} strokeWidth={inks.lineWidth} />
      <circle cx={69.5} cy={36} r={4.2} fill={inks.skinShade} stroke={inks.line} strokeWidth={inks.lineWidth} />
      <Shape d={HEAD} fill={inks.skin} inks={inks} />
      <Shape d={HAIR} fill={inks.hair} inks={inks} />
      <Shape d={BEARD} fill={inks.hair} inks={inks} />
      <Shape d={GRIN} fill={inks.teeth} inks={inks} />
      <path d="M50 33 Q54 39.5 49 40.5" fill="none" stroke={inks.line} strokeWidth={1.3} strokeLinecap="round" />
      <path d="M38 24.5 L46 23.5 M54 23.5 L62 24.5" stroke={inks.hair} strokeWidth={2.2} strokeLinecap="round" />
      <ellipse cx={58} cy={30.5} rx={1.9} ry={3} fill={inks.eye} className={s.eyeOpen} />
      <g className={s.eyeWink}>
        <ellipse cx={42} cy={30.5} rx={1.9} ry={3} fill={inks.eye} className={s.eyeShut} />
        <path d="M39 31 Q42 33 45 31" fill="none" stroke={inks.eye} strokeWidth={1.4} strokeLinecap="round" className={s.winkLine} />
      </g>
      {profession === 'fighter' && <Mongkhon inks={inks} />}
    </g>
  )
}

// His mongkhon: a fat braided ring round the crown with two tails standing up at the back, poster flat.
function Mongkhon({ inks }: { inks: Inks }) {
  return (
    <g>
      <path d="M31 22 Q50 13 69 22" fill="none" stroke={inks.line} strokeWidth={6} strokeLinecap="round" />
      <path d="M31 22 Q50 13 69 22" fill="none" stroke={inks.band} strokeWidth={4} strokeLinecap="round" />
      <path d="M36 19 L38 21 M44 16.5 L46 18.5 M54 16.5 L56 18.5 M62 18.5 L64 20.5" stroke={inks.trim} strokeWidth={1.2} />
      <Shape d="M66 19 Q74 8 70 2 Q78 8 72 21 Z" fill={inks.band} inks={inks} />
    </g>
  )
}

function Torso({ profession, inks }: { profession: Profession; inks: Inks }) {
  if (profession === 'fighter') {
    return (
      <g>
        <Shape d={CHEST} fill={inks.skin} inks={inks} />
        <path d="M41 68 Q45.5 71 50 68 Q54.5 71 59 68 M50 73 V84" fill="none" stroke={inks.line} strokeWidth={1.1} />
        <Shape d="M33 84 L67 84 L67 96 L33 96 Z" fill={inks.suit} inks={inks} />
        <Shape d="M38 86 Q50 92 62 86 L64 90 Q50 96 36 90 Z" fill={inks.suitShade} inks={inks} />
      </g>
    )
  }

  return (
    <g>
      <Shape d={SUIT} fill={inks.suit} inks={inks} />
      <path d="M48.2 60 H51.8 V86 H48.2 Z" fill={inks.trim} />
      <Shape d="M39.5 57 L50 64 L60.5 57 L57.5 54.5 L50 59.5 L42.5 54.5 Z" fill={inks.trim} inks={inks} />
      <Shape d="M33.5 86 L66.5 86 L66.5 91 L33.5 91 Z" fill={inks.suitShade} inks={inks} />
      <Shape d="M46.5 85.5 L53.5 85.5 L53.5 91.5 L46.5 91.5 Z" fill={inks.trim} inks={inks} />
      <path d="M38 64 Q36 72 37.5 80" fill="none" stroke={CREAM} strokeWidth={1.4} opacity={0.5} strokeLinecap="round" />
    </g>
  )
}

function Leg({ side, inks }: { side: Side; inks: Inks }) {
  return (
    <g className={side === 'right' ? s.thighRight : s.thighLeft}>
      <Shape d={THIGH[side]} fill={inks.suit} inks={inks} />
      <g className={side === 'right' ? s.shinRight : s.shinLeft}>
        <Shape d={SHIN[side]} fill={inks.suit} inks={inks} />
        <Shape d={BOOT[side]} fill={inks.boot} inks={inks} />
      </g>
    </g>
  )
}

// The wrist terminal: a chunky olive housing round the forearm, the green screen and two dials.
function WristTerminal({ inks }: { inks: Inks }) {
  return (
    <g>
      <Shape d="M61.5 79 L74.5 78.5 L74.5 91 L62 91.5 Z" fill={inks.device} inks={inks} />
      <rect x={64} y={81} width={8} height={5.5} fill={inks.screen} className={s.screen} />
      <circle cx={65.5} cy={89} r={1.1} fill={inks.trim} />
      <circle cx={70.5} cy={89} r={1.1} fill={inks.trim} />
    </g>
  )
}

// The atomic age pistol in his left fist, drawn along the hanging forearm so the aim swings it level: a
// chunky barrel with two cooling rings and a red emitter tip, the grip out of the fist, the muzzle flash
// at the tip. Both rest hidden; the aim and fire motions show them.
function Pistol({ inks }: { inks: Inks }) {
  return (
    <g className={s.pistol}>
      <Shape d="M59 95 L66 95 L66 100.5 L59 100.5 Z" fill={inks.boot} inks={inks} />
      <Shape d="M64.5 99 L72 99 L71.5 114 L65 114 Z" fill={inks.device} inks={inks} />
      <path d="M64.8 104 H71.8 M64.9 108 H71.7" stroke={inks.trim} strokeWidth={1.6} />
      <Shape d="M65.5 114 L71 114 L70 118 L66.5 118 Z" fill={inks.band} inks={inks} />
      <path className={s.flash} d="M68.2 118 L71 124 L76 122 L72.5 127 L77 131 L70.5 129.5 L68.2 136 L66 129.5 L59.5 131 L64 127 L60.5 122 L65.5 124 Z" fill={inks.trim} stroke={inks.line} strokeWidth={inks.lineWidth} strokeLinejoin="round" />
    </g>
  )
}

function Hand({ side, profession, inks }: { side: Side; profession: Profession; inks: Inks }) {
  const { x, y } = HAND[side]
  const wrapped = profession === 'fighter'

  return (
    <g>
      {profession === 'drummer' && <path d={`M${x} ${y} L${x + (side === 'right' ? 16 : -16)} ${y + 8}`} stroke={inks.line} strokeWidth={2.4} strokeLinecap="round" />}
      {side === 'right' && <rect x={x - 1.8} y={y + 1.5} width={3.6} height={7} rx={1.8} fill={wrapped ? inks.wrap : inks.skin} stroke={inks.line} strokeWidth={inks.lineWidth} className={s.thumb} />}
      <circle cx={x} cy={y} r={4.8} fill={wrapped ? inks.wrap : inks.skin} stroke={inks.line} strokeWidth={inks.lineWidth} />
    </g>
  )
}

function Arm({ side, profession, inks }: { side: Side; profession: Profession; inks: Inks }) {
  const bare = profession === 'fighter'
  const sleeve = bare ? inks.skin : inks.suit

  return (
    <g className={side === 'right' ? s.armRight : s.armLeft}>
      <Shape d={UPPER[side]} fill={sleeve} inks={inks} />
      <g className={side === 'right' ? s.foreRight : s.foreLeft}>
        <Shape d={FORE[side]} fill={sleeve} inks={inks} />
        {!bare && <path d={side === 'right' ? 'M28 90 L35.8 90' : 'M64.3 90 L72.2 90'} stroke={inks.trim} strokeWidth={3} />}
        {side === 'left' && <WristTerminal inks={inks} />}
        <Hand side={side} profession={profession} inks={inks} />
        {side === 'left' && <Pistol inks={inks} />}
      </g>
    </g>
  )
}

// The poster snare at his knees: a blue shell with yellow lugs, the cream head.
function Snare({ inks }: { inks: Inks }) {
  return (
    <g>
      <Shape d="M34 112 L66 112 L64 128 L36 128 Z" fill={inks.suitShade} inks={inks} />
      <path d="M40 112 L40 128 M50 112 L50 128 M60 112 L60 128" stroke={inks.trim} strokeWidth={1.6} />
      <ellipse cx={50} cy={112} rx={16} ry={3.6} fill={inks.teeth} stroke={inks.line} strokeWidth={inks.lineWidth} className={s.drumHead} />
    </g>
  )
}

// The bakelite table radio he holds level against his chest for the dance: the arched red case, the cream
// grille, the round dial window with its needle, and at the lower left the long pointer knob on its brass
// boss, which his right hand pinches and turns; the pointer reaches past his fingers so the turn shows. The
// knob and the dial needle turn with the receiver's --needle (0 to 1), which the radio panel sets on its
// grid, so the knob in his hand follows the tuning scale's needle.
function HeldRadio({ inks }: { inks: Inks }) {
  return (
    <g>
      <Shape d="M34 84 L34 71 Q34 61.5 49 61.5 Q64 61.5 64 71 L64 84 Z" fill={inks.band} inks={inks} />
      <rect x={41} y={67} width={11} height={13} rx={1.5} fill={inks.wrap} stroke={inks.line} strokeWidth={inks.lineWidth * 0.6} />
      <path d="M41.5 70 H51.5 M41.5 73 H51.5 M41.5 76 H51.5" stroke={inks.boot} strokeWidth={1} />
      <circle cx={57} cy={71} r={3.8} fill={inks.teeth} stroke={inks.line} strokeWidth={inks.lineWidth * 0.6} />
      <path className={s.dialNeedle} d="M57 71 L57 67.8" stroke={inks.line} strokeWidth={1.2} strokeLinecap="round" />
      <g className={s.knob}>
        <circle cx={38.5} cy={78.5} r={3.4} fill={BRASS} stroke={inks.line} strokeWidth={inks.lineWidth} />
        <Shape d="M38.5 70.5 L40.6 78.5 L38.5 86.5 L36.4 78.5 Z" fill={inks.teeth} inks={inks} />
      </g>
    </g>
  )
}

// The targeting stance's bracket reticle and the level up star, both resting hidden.
function Overlays({ inks }: { inks: Inks }) {
  return (
    <g>
      <g className={s.reticle} fill="none" stroke={PHOSPHOR} strokeWidth={2}>
        <path d="M80 34 H76 V42 M96 34 H100 V42 M80 62 H76 V54 M96 62 H100 V54" />
        <circle cx={88} cy={48} r={2} fill={PHOSPHOR} />
      </g>
      <path className={s.star} d="M14 20 L17 28 L25 28 L19 33 L21 41 L14 36 L7 41 L9 33 L3 28 L11 28 Z" fill={inks.trim} stroke={inks.line} strokeWidth={inks.lineWidth} />
    </g>
  )
}

interface DwellerProps {
  profession: Profession
  motion: DwellerMotion
  tone?: DwellerTone
  className?: string
}

/** Him as the shelter dweller of the posters, in a profession's kit, playing one motion. */
export function DwellerSprite({ profession, motion, tone = 'poster', className = '' }: DwellerProps) {
  const inks = INKS[tone]

  return (
    <svg viewBox="0 0 100 150" className={`overflow-visible ${className}`} aria-hidden="true" focusable="false">
      <g className={`${s.sprite} ${KIT_CLASS[profession]} ${MOTION_CLASS[motion]}`}>
        {tone === 'poster' && <ellipse cx={50} cy={145} rx={22} ry={3} fill={POSTER_INK} opacity={0.35} />}
        <g className={s.body}>
          <Leg side="right" inks={inks} />
          <Leg side="left" inks={inks} />
          <g className={s.chest}>
            <Torso profession={profession} inks={inks} />
            <Head profession={profession} inks={inks} />
          </g>
          {profession === 'drummer' && <Snare inks={inks} />}
          {HOLDS_RADIO[motion] && <HeldRadio inks={inks} />}
          <Arm side="right" profession={profession} inks={inks} />
          <Arm side="left" profession={profession} inks={inks} />
        </g>
        <Overlays inks={inks} />
      </g>
    </svg>
  )
}
