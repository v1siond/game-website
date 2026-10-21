import type { Profession } from '@/lib/cv/professions'
import { HERO_IDENTITY } from '@/components/cv/heroIdentity'
import { NEON } from './palette'
import s from './merc.module.css'

// Him as this world's own figure, a parody of the night city merc of Cyberpunk 2077 (V): the black
// samurai style jacket with its tall upturned yellow collar and the red sigil on the chest, a chrome
// cyberarm with its segment seams, the optics glowing cyan at the eyes with the implant lines on the
// temple, dark cargo trousers and heavy boots. Drawn the way the game's key art reads at sprite size:
// hard dark outline, flat fills with one cut of neon rim light on the lit side, chrome in two tones.
//
// His traits come from HERO_IDENTITY: his brown skin, short dark hair cut close, his full dark beard.
//
// Per profession: the System Engineer jacks a cable from the temple into a deck and runs a quickhack
// (data glyphs climb off the hand); the Musician drops behind a neon snare with two sticks; the Martial
// Artist sheds the jacket, wraps his hands and wears his own mongkhon, then throws the knee and the
// roundhouse. Every one can idle (breath, optic blink), walk, pop the mantis blades for the strike, take
// the scan pose with the optic reticle, double jump on the cyberlegs, and glitch when hit or hovered.

export type MercMotion = 'still' | 'idle' | 'walk' | 'blades' | 'scan' | 'jump' | 'hack' | 'drum' | 'kick'

/** Each profession's action, the way the merc would do that job. */
export const MERC_ACTION: Record<Profession, MercMotion> = {
  engineer: 'hack',
  drummer: 'drum',
  fighter: 'kick',
}

const MOTION_CLASS: Record<MercMotion, string> = {
  still: '',
  idle: s.idle,
  walk: s.walk,
  blades: s.blades,
  scan: s.scan,
  jump: s.jump,
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
const JACKET = NEON.jacket
const COLLAR = NEON.hud
const OPTIC = NEON.data
const CHROME = NEON.chrome
const CHROME_LIT = NEON.ash

// ---- shapes (viewBox 100 by 150, three quarter to the viewer, feet on y 144) ----

const HEAD = 'M38 26 Q38 12 50 12 Q62 12 62 26 Q62 40 50 43 Q38 40 38 26 Z'
const HAIR_CUT = 'M37.5 25 Q37 10 50 9.5 Q63 10 62.5 25 Q60 17 54 16.5 Q48 14.5 43 17 Q39 19 37.5 25 Z'
const BEARD = 'M38.5 28 Q39 42 50 45.5 Q61 42 61.5 28 Q58.5 34.5 54 34.5 Q50 32.5 46 34.5 Q41.5 34.5 38.5 28 Z'
const COLLAR_BACK = 'M33 34 L36 22 L44 38 L50 44 L56 38 L64 22 L67 34 L62 50 L38 50 Z'
const JACKET_BODY = 'M31 46 Q50 40 69 46 L71 94 L29 94 Z'
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

// The left hand is the chrome cyberarm's, the right is his own; wraps cover both for the fight.
const HAND_FILL: Record<Side, string> = { right: SKIN, left: CHROME }

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

function Head({ profession }: { profession: Profession }) {
  return (
    <g className={s.head}>
      <circle cx={38.5} cy={28} r={3} fill={SKIN_SHADE} stroke={LINE} strokeWidth={LW} />
      <circle cx={61.5} cy={28} r={3} fill={SKIN_SHADE} stroke={LINE} strokeWidth={LW} />
      <Shape d={HEAD} fill={SKIN} />
      <path d="M58 16 Q61.5 24 59 36" fill="none" stroke={NEON.magenta} strokeWidth={1} opacity={0.6} />
      <Shape d={HAIR_CUT} fill={HAIR} />
      <Shape d={BEARD} fill={HAIR} />
      <path d="M46.5 36.5 Q50 38.5 53.5 36.5" fill="none" stroke={SKIN_SHADE} strokeWidth={1.2} strokeLinecap="round" />
      <path d="M42 21.5 L47.5 21 M52.5 21 L58 21.5" stroke={HAIR} strokeWidth={1.8} strokeLinecap="round" />
      {/* the optics: two lit cyan slits and the implant seams down the left temple */}
      <g className={s.optics}>
        <rect x={42.6} y={24} width={4} height={2.2} rx={0.6} fill={OPTIC} />
        <rect x={53.4} y={24} width={4} height={2.2} rx={0.6} fill={OPTIC} />
      </g>
      <path d="M59.5 23 L61 27 L59.5 31" fill="none" stroke={OPTIC} strokeWidth={0.8} />
      {profession === 'fighter' && <Mongkhon />}
    </g>
  )
}

function Torso({ profession }: { profession: Profession }) {
  if (profession === 'fighter') {
    return (
      <g>
        <Shape d={BARE_CHEST} fill={SKIN} />
        <path d="M41 58 Q45.5 61 50 58 Q54.5 61 59 58 M50 63 V82" fill="none" stroke={SKIN_SHADE} strokeWidth={1.1} />
        <path d="M35 52 L40 60 L37 70" fill="none" stroke={OPTIC} strokeWidth={0.9} opacity={0.8} />
        <Shape d="M32 84 L68 84 L69 96 L31 96 Z" fill={NEON.hotPink} />
        <path d="M32 87 H68" stroke={NEON.ice} strokeWidth={1.4} />
      </g>
    )
  }

  return (
    <g>
      <Shape d={COLLAR_BACK} fill={COLLAR} />
      <Shape d={JACKET_BODY} fill={JACKET} />
      <path d="M44 42 L50 60 L56 42" fill={NEON.ink} stroke={LINE} strokeWidth={LW} />
      <path d="M50 60 V94" stroke={NEON.steel} strokeWidth={1.2} />
      {/* the sigil on the chest and the rim light down the lit side */}
      <path d="M36 56 L41 54 L40 60 L36 61 Z" fill={NEON.chromeRed} />
      <path d="M68.5 48 L70 92" stroke={NEON.magenta} strokeWidth={1.4} opacity={0.7} />
      <Shape d="M30 88 L70 88 L70.5 94 L29.5 94 Z" fill={NEON.ink} />
      <rect x={46} y={88.5} width={8} height={5} fill={COLLAR} stroke={LINE} strokeWidth={1} />
    </g>
  )
}

function Leg({ side, profession }: { side: Side; profession: Profession }) {
  const trouser = profession === 'fighter' ? SKIN : NEON.jeans

  return (
    <g className={side === 'right' ? s.thighRight : s.thighLeft}>
      <Shape d={THIGH[side]} fill={trouser} />
      <g className={side === 'right' ? s.shinRight : s.shinLeft}>
        <Shape d={SHIN[side]} fill={trouser} />
        <Shape d={BOOT[side]} fill={profession === 'fighter' ? SKIN : NEON.shoe} />
        {profession !== 'fighter' && <path d={side === 'right' ? 'M33 140 H48' : 'M52 140 H67'} stroke={NEON.chromeRed} strokeWidth={1.2} />}
        {/* the cyberleg's thrusters, lit only on the double jump */}
        <path className={s.thrust} d={side === 'right' ? 'M36 145 L39.5 152 L43 145 Z' : 'M57 145 L60.5 152 L64 145 Z'} fill={OPTIC} />
      </g>
    </g>
  )
}

// The mantis blade folds out of the forearm: a long magenta edged chrome scythe, resting folded away.
function Blade({ side }: { side: Side }) {
  const d = side === 'right' ? 'M30 70 Q14 74 6 96 Q18 84 31 80 Z' : 'M70 70 Q86 74 94 96 Q82 84 69 80 Z'
  return <path className={side === 'right' ? s.bladeRight : s.bladeLeft} d={d} fill={CHROME_LIT} stroke={NEON.magenta} strokeWidth={1.2} strokeLinejoin="round" />
}

function Hand({ side, profession }: { side: Side; profession: Profession }) {
  const { x, y } = HAND[side]
  const fill = profession === 'fighter' ? NEON.ice : HAND_FILL[side]

  return (
    <g>
      {profession === 'drummer' && <path d={`M${x} ${y} L${x + (side === 'right' ? -15 : 15)} ${y + 9}`} stroke={NEON.stickWood} strokeWidth={2.2} strokeLinecap="round" />}
      <circle cx={x} cy={y} r={4.4} fill={fill} stroke={LINE} strokeWidth={LW} />
    </g>
  )
}

function Arm({ side, profession }: { side: Side; profession: Profession }) {
  const chrome = side === 'left'
  const sleeve = profession === 'fighter' ? SKIN : JACKET
  const fore = chrome ? CHROME : sleeve

  return (
    <g className={side === 'right' ? s.armRight : s.armLeft}>
      <Shape d={UPPER[side]} fill={chrome && profession === 'fighter' ? CHROME : sleeve} />
      <g className={side === 'right' ? s.foreRight : s.foreLeft}>
        <Blade side={side} />
        <Shape d={FORE[side]} fill={fore} />
        {chrome && <path d="M66 71 H73.6 M66 76 H73.6 M69.8 66 V84" stroke={NEON.steel} strokeWidth={0.9} />}
        {chrome && <path d="M73.5 67 L73 83" stroke={CHROME_LIT} strokeWidth={1.2} />}
        <Hand side={side} profession={profession} />
      </g>
    </g>
  )
}

// The neon snare at his knees: a dark shell ringed in magenta, the lit head.
function Snare() {
  return (
    <g>
      <Shape d="M33 110 L67 110 L65 126 L35 126 Z" fill={NEON.panel} />
      <path d="M33 114 H67 M34 122 H66" stroke={NEON.magenta} strokeWidth={1.4} />
      <ellipse className={s.drumHead} cx={50} cy={110} rx={17} ry={3.6} fill={NEON.data} stroke={LINE} strokeWidth={LW} />
    </g>
  )
}

// The quickhack: the cable from the temple to a deck in the chrome hand, glyphs climbing off it.
function Jack() {
  return (
    <g className={s.jack}>
      <path d="M60 30 Q78 40 72 64" fill="none" stroke={OPTIC} strokeWidth={1.2} strokeDasharray="2 1.5" />
      <rect x={76} y={58} width={14} height={9} fill={NEON.ink} stroke={OPTIC} strokeWidth={1.2} />
      <g className={s.glyphs} fill={NEON.hack}>
        <rect x={79} y={50} width={3} height={3} />
        <rect x={84} y={45} width={3} height={3} />
        <rect x={80} y={40} width={3} height={3} />
      </g>
    </g>
  )
}

// The scan pose's optic reticle, resting hidden.
function Reticle() {
  return (
    <g className={s.reticle} fill="none" stroke={COLLAR} strokeWidth={1.6}>
      <path d="M80 14 H76 V20 M94 14 H98 V20 M80 34 H76 V28 M94 34 H98 V28" />
      <circle cx={87} cy={24} r={1.6} fill={COLLAR} />
    </g>
  )
}

interface MercProps {
  profession: Profession
  motion: MercMotion
  className?: string
}

/** Him as the night city merc, in a profession's kit, playing one motion; he glitches when hovered. */
export function MercSprite({ profession, motion, className = '' }: MercProps) {
  return (
    <svg viewBox="0 0 100 150" className={`overflow-visible ${className}`} aria-hidden="true" focusable="false">
      <g className={`${s.sprite} ${KIT_CLASS[profession]} ${MOTION_CLASS[motion]}`}>
        <ellipse className={s.shadow} cx={50} cy={145} rx={20} ry={2.6} fill={NEON.magenta} opacity={0.35} />
        <g className={s.glitch}>
          <g className={s.ghost} aria-hidden="true">
            <path d={JACKET_BODY} fill={NEON.cyan} opacity={0.5} />
            <path d={HEAD} fill={NEON.hotPink} opacity={0.5} />
          </g>
          <g className={s.body}>
            <Leg side="right" profession={profession} />
            <Leg side="left" profession={profession} />
            <g className={s.chest}>
              <Torso profession={profession} />
              <Head profession={profession} />
            </g>
            {profession === 'drummer' && <Snare />}
            <Arm side="right" profession={profession} />
            <Arm side="left" profession={profession} />
            {profession === 'engineer' && <Jack />}
          </g>
        </g>
        <Reticle />
      </g>
    </svg>
  )
}
