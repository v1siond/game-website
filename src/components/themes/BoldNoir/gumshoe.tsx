import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_IDENTITY } from '@/lib/cv/heroIdentity'
import { NOIR } from './palette'
import s from './gumshoe.module.css'

// Him side on, facing right, as the scenes draw him: the 1947 city detective of the game the world is drawn
// from, in its black and white mode. The pale fedora with its dark band and the brim snapped down over his
// brow, the single breasted suit in smoke grey with the white shirt and the one red of the tie, dark
// trousers, black shoes. Cut flat the way the world cuts everything: ink, smoke, fog and paper, a hard ink
// line, no gradient. His own face under the brim: brown skin, short dark hair, the full dark beard, the dark
// eye (HERO_IDENTITY).
//
// Per profession, the way that detective would:
// - System Engineer: the full suit.
// - Musician: jacket off, the waistcoat over the shirt, the hat kept, a drumstick in each hand.
// - Martial Artist: hat and jacket off, bare chested in dark shorts, his own mongkhon round the head, red
//   prajioud on the arms and wrapped fists.
//
// The parts are groups that turn round their own joints (the origins in gumshoe.module.css), posed by a
// scene's writer on the shared rig (pose.ts). What a move needs in his hands (the notebook, the clue, the
// call box receiver, the case file, the newspaper, the cuffs) rests hidden until a pose shows it. Transform
// and opacity only.

const KIT_CLASS: Record<Profession, string> = {
  engineer: '',
  drummer: s.kitSticks,
  fighter: s.kitGuard,
}

const LINE = NOIR.ink

function Cut({ d, fill, className }: { d: string; fill: string; className?: string }) {
  return <path d={d} fill={fill} stroke={LINE} strokeWidth={1.2} strokeLinejoin="round" className={className} />
}

// ---- shapes (viewBox 120 by 180, facing right, feet on y 172) ----

const VIEW = { width: 120, height: 180 }
const SOLES_Y = 172

/** The share of his drawn height that sits under his soles, so a scene can drop the drawing by it. */
export const SOLE_DROP = (VIEW.height - SOLES_Y) / VIEW.height

/** His viewBox, for a scene that sizes him. */
export const GUMSHOE_VIEW = VIEW

const HEAD = 'M51 28 Q51 15 62 15 Q74 15 74.5 28 L74.5 34 Q73 41 66 44 L58 44 Q51 40 51 34 Z'
const HAIR = 'M50 29 Q48 12 62 12.5 Q76 13 75.5 26 Q71 19.5 63 19.5 Q56 20 53.5 30 Z'
const BEARD = 'M51.5 31 Q52.5 44 59 48.5 Q66 51 71.5 46.5 Q75.5 41.5 75 32 Q72 36.5 68 36.5 Q63 37.5 58 34.5 Q55 33 53 31 Z'
const NECK = 'M57 41 L67 41 L67.5 51 L56.5 51 Z'

// The fedora in profile: the pinched crown, the dark band, the brim snapped down at the front.
const CROWN = 'M50 21 L52 9 Q56 5.5 62 6 Q69 5.5 72.5 9 L74 21 Z'
const BAND = 'M50.6 16.5 L73.4 16.5 L74 21 L50 21 Z'
const BRIM = 'M43 21.5 Q60 18.5 83 22.5 Q84 25 81 25.5 Q64 22.5 45 24.5 Q42 23.5 43 21.5 Z'

// The suit jacket, longer than the waist, with the shirt and tie showing down the front edge.
const JACKET = 'M44.5 51 Q61 45.5 79.5 51 L82 104 Q62 107 42.5 104 Z'
const JACKET_SHADE = 'M44.5 51 Q49 49.5 53 48.6 Q48.5 76 51.5 106 L42.5 104 Z'
const SHIRT = 'M68 49 L79.5 51 L78.5 74 Z'
const TIE = 'M73.5 51.5 L77.5 52 L76.6 72 L74.4 75 L73 70 Z'
const LAPEL = 'M68 49 L74.5 64 L79 58'
const WAISTCOAT = 'M45 51 Q61 46 79 51 L80 94 Q62 97 44 94 Z'
const CHEST = 'M45 51 Q61 46 79 51 L79.5 88 Q62 91 44.5 88 Z'
const CHEST_LINES = 'M51 64 Q57 68 62 64 Q67 68 74 64 M62 70 V86'
const TROUSERS = 'M44 88 L80 88 L80 99 L44 99 Z'
const SHORTS = 'M43 86 L81 86 L82 108 L64 108 L62 100 L60 108 L42 108 Z'

const THIGH = {
  back: 'M46 96 L61 96 L60 133 L49 133 Z',
  front: 'M62 96 L78 96 L75 133 L63 133 Z',
}
const SHIN = {
  back: 'M49 131 L60 131 L59 166 L50 166 Z',
  front: 'M63 131 L75 131 L73.5 166 L64 166 Z',
}
const SHOE = {
  back: 'M48.5 164 L60.5 164 Q67 166 67 172 L48.5 172 Z',
  front: 'M62.5 164 L75 164 Q81.5 166 81.5 172 L62.5 172 Z',
}
const FOOT = {
  back: 'M50 164 L59 164 Q64 167 64 171 L50 171 Z',
  front: 'M64.5 164 L73 164 Q78.5 167 78.5 171 L64.5 171 Z',
}

const UPPER_ARM = {
  back: 'M43.5 51 L54.5 52 L53.5 77 L45 77 Z',
  front: 'M67.5 52 L78.5 51 L78 77 L69.5 77 Z',
}
const FOREARM = {
  back: 'M45 75 L53.5 75 L52.5 96 L46 96 Z',
  front: 'M69.5 75 L78 75 L77 96 L70.5 96 Z',
}
const CUFF = { back: 'M45.5 93 L53 93', front: 'M70.5 93 L77.5 93' }

const HAND = { back: { x: 49.5, y: 99 }, front: { x: 73.8, y: 99 } }

type Side = 'back' | 'front'

/** What he can hold, each a group `data-part="{name}"` that a pose fades in. */
export type HeldProp = 'notebook' | 'pencil' | 'clue' | 'receiver' | 'file' | 'paper' | 'cuffs'

// ---- the parts ----

function Hat() {
  return (
    <g data-part="hat">
      <Cut d={CROWN} fill={NOIR.fog} />
      <path d="M56 7.5 Q60 11 62 7 M66 7 Q68 10.5 70 8" fill="none" stroke={NOIR.ash} strokeWidth={0.9} />
      <path d={BAND} fill={NOIR.ink} />
      <Cut d={BRIM} fill={NOIR.fog} />
      <path d="M46 24 Q63 21.6 81 25" fill="none" stroke={NOIR.ink} strokeWidth={1.4} />
    </g>
  )
}

// His mongkhon: a braided ring round the head, bound in paper, its tail rising behind.
function Mongkhon() {
  return (
    <g>
      <path d="M50 22.5 Q62 17.5 75.5 21.5" fill="none" stroke={NOIR.paper} strokeWidth={3.4} strokeLinecap="round" />
      <path d="M51 22 Q62 17 75 21" fill="none" stroke={NOIR.red} strokeWidth={0.9} strokeDasharray="2 2" />
      <path d="M51 22 Q42 14 44 4 Q47 12 53 19" fill={NOIR.paper} stroke={LINE} strokeWidth={0.8} />
    </g>
  )
}

function Head({ profession }: { profession: Profession }) {
  return (
    <g data-part="head">
      <Cut d={HEAD} fill={HERO_IDENTITY.skin} />
      <ellipse cx={54.5} cy={30} rx={2.4} ry={3.6} fill={HERO_IDENTITY.skinShade} />
      <Cut d={HAIR} fill={HERO_IDENTITY.hair} />
      <Cut d={BEARD} fill={HERO_IDENTITY.beard} />
      <path d="M74 25.5 Q77 30.5 74.5 32.5" fill={HERO_IDENTITY.skinShade} />
      <path d="M65 24.5 L71 23.8" stroke={HERO_IDENTITY.hair} strokeWidth={1.3} strokeLinecap="round" />
      <ellipse cx={69} cy={28.4} rx={1.4} ry={1.9} fill={HERO_IDENTITY.eyes} />
      {/* the brim's hard shadow over his brow */}
      {profession !== 'fighter' && <path d="M51 21 Q63 19 76 22 L75.5 26 Q64 23.5 52 25.5 Z" fill={NOIR.ink} opacity={0.55} />}
      {profession === 'fighter' ? <Mongkhon /> : <Hat />}
    </g>
  )
}

function Torso({ profession }: { profession: Profession }) {
  if (profession === 'fighter') {
    return (
      <g>
        <Cut d={CHEST} fill={HERO_IDENTITY.skin} />
        <path d={CHEST_LINES} fill="none" stroke={HERO_IDENTITY.skinShade} strokeWidth={0.9} />
      </g>
    )
  }
  if (profession === 'drummer') {
    return (
      <g>
        <Cut d={SHIRT} fill={NOIR.paper} />
        <Cut d={WAISTCOAT} fill={NOIR.smoke} />
        <path d="M70 52 L78 53 L77.5 70 Z" fill={NOIR.paper} />
        <Cut d={TIE} fill={NOIR.red} />
        <path d="M63 60 V92" stroke={NOIR.ash} strokeWidth={0.8} />
        {[66, 74, 82].map((y) => (
          <circle key={y} cx={65.5} cy={y} r={0.9} fill={NOIR.fog} />
        ))}
      </g>
    )
  }
  return (
    <g>
      <Cut d={JACKET} fill={NOIR.ash} />
      <path d={JACKET_SHADE} fill={NOIR.smoke} />
      <Cut d={SHIRT} fill={NOIR.paper} />
      <Cut d={TIE} fill={NOIR.red} />
      <path d={LAPEL} fill="none" stroke={LINE} strokeWidth={1.2} />
      <path d="M56 84 H66" stroke={LINE} strokeWidth={1.2} />
      <circle cx={77.5} cy={82} r={1} fill={LINE} />
    </g>
  )
}

function Waist({ profession }: { profession: Profession }) {
  if (profession === 'fighter') {
    return (
      <g>
        <Cut d={SHORTS} fill={NOIR.coal} />
        <path d="M43 86 L81 86 L81 91 L43 91 Z" fill={NOIR.red} />
      </g>
    )
  }
  return <Cut d={TROUSERS} fill={NOIR.smoke} />
}

function Leg({ side, profession }: { side: Side; profession: Profession }) {
  const bare = profession === 'fighter'
  const thighClass = side === 'back' ? s.thighBack : s.thighFront
  const shinClass = side === 'back' ? s.shinBack : s.shinFront
  const cloth = side === 'back' ? NOIR.coal : NOIR.smoke

  return (
    <g className={thighClass}>
      <Cut d={THIGH[side]} fill={bare ? HERO_IDENTITY.skin : cloth} />
      <g className={shinClass}>
        {bare ? (
          <>
            <Cut d={SHIN[side]} fill={HERO_IDENTITY.skin} />
            <Cut d={FOOT[side]} fill={HERO_IDENTITY.skinShade} />
          </>
        ) : (
          <>
            <Cut d={SHIN[side]} fill={cloth} />
            <Cut d={SHOE[side]} fill={NOIR.ink} />
            <path d={side === 'back' ? 'M55 166.5 H60' : 'M69 166.5 H75'} stroke={NOIR.fog} strokeWidth={0.9} />
          </>
        )}
      </g>
    </g>
  )
}

// ---- what he holds, each hidden until a pose shows it ----

/** A prop drawn at a hand, upright when the forearm hangs straight down. */
function Held({ side, name, children }: { side: Side; name: HeldProp; children: ReactNode }) {
  const { x, y } = HAND[side]
  return (
    <g data-part={name} transform={`translate(${x} ${y})`} opacity="0">
      {children}
    </g>
  )
}


function Props({ side }: { side: Side }) {
  if (side === 'back') {
    return (
      <>
        <Held side="back" name="notebook">
          <rect x={-6} y={-2} width={12} height={15} fill={NOIR.paper} stroke={LINE} strokeWidth={1} />
          <path d="M-6 0.5 H6 M-3.5 4 H4 M-3.5 7 H3 M-3.5 10 H4" stroke={NOIR.ash} strokeWidth={0.8} />
        </Held>
        <Held side="back" name="file">
          <rect x={-4} y={-6} width={26} height={18} fill={NOIR.paperDim} stroke={LINE} strokeWidth={1} />
          <rect x={8} y={-9} width={10} height={4} fill={NOIR.paperDim} stroke={LINE} strokeWidth={1} />
          <path d="M0 -1 H16 M0 3 H12" stroke={NOIR.ash} strokeWidth={0.9} />
        </Held>
      </>
    )
  }
  return (
    <>
      <Held side="front" name="pencil">
        <path d="M0 0 L8 -10" stroke={NOIR.fog} strokeWidth={1.8} strokeLinecap="round" />
      </Held>
      <Held side="front" name="clue">
        <rect x={-3} y={-1} width={9} height={6} fill={NOIR.red} stroke={LINE} strokeWidth={0.8} />
        <path d="M-3 2 H6" stroke={NOIR.paper} strokeWidth={0.8} />
      </Held>
      <Held side="front" name="receiver">
        <path d="M-3 -10 Q-6 0 -3 10" fill="none" stroke={NOIR.ink} strokeWidth={3.4} strokeLinecap="round" />
        <circle cx={-3} cy={-10} r={3} fill={NOIR.ink} />
        <circle cx={-3} cy={10} r={3} fill={NOIR.ink} />
      </Held>
      <Held side="front" name="paper">
        <rect x={-2} y={-22} width={30} height={38} fill={NOIR.paper} stroke={LINE} strokeWidth={1} />
        <rect x={2} y={-18} width={22} height={5} fill={NOIR.ink} />
        <rect x={2} y={-10} width={11} height={10} fill={NOIR.ash} />
        <circle cx={7.5} cy={-5} r={7.4} fill="none" stroke={NOIR.red} strokeWidth={1.4} />
        <path d="M15 -9 H24 M15 -5 H24 M15 -1 H24 M2 4 H24 M2 8 H24 M2 12 H18" stroke={NOIR.ash} strokeWidth={0.9} />
      </Held>
      <Held side="front" name="cuffs">
        <circle cx={-2} cy={4} r={4} fill="none" stroke={NOIR.fog} strokeWidth={1.6} />
        <circle cx={6} cy={4} r={4} fill="none" stroke={NOIR.fog} strokeWidth={1.6} />
      </Held>
    </>
  )
}

function Stick({ x }: { x: number }) {
  return <path d={`M${x} 99 L${x + 18} 88`} stroke={NOIR.paperDim} strokeWidth={1.8} strokeLinecap="round" />
}

function Arm({ side, profession }: { side: Side; profession: Profession }) {
  const bare = profession === 'fighter'
  const shirtsleeve = profession === 'drummer'
  const upperClass = side === 'back' ? s.armBack : s.armFront
  const foreClass = side === 'back' ? s.foreBack : s.foreFront
  const sleeve = shirtsleeve ? NOIR.paper : side === 'back' ? NOIR.smoke : NOIR.ash
  const { x, y } = HAND[side]
  // The Muay Thai wrap makes the fist larger and paper white; a bare fist is his skin.
  const fist = bare ? { rx: 4.4, ry: 4.2, fill: NOIR.paper } : { rx: 3.6, ry: 3.8, fill: HERO_IDENTITY.skin }

  return (
    <g className={upperClass}>
      <Cut d={UPPER_ARM[side]} fill={bare ? HERO_IDENTITY.skin : sleeve} />
      {bare && <path d={side === 'back' ? 'M44 60 L54.5 61' : 'M68 61 L78.5 60'} stroke={NOIR.red} strokeWidth={3} strokeLinecap="round" />}
      <g className={foreClass}>
        <Cut d={FOREARM[side]} fill={bare || shirtsleeve ? HERO_IDENTITY.skin : sleeve} />
        {!bare && !shirtsleeve && <path d={CUFF[side]} stroke={NOIR.paper} strokeWidth={2.2} />}
        {shirtsleeve && <path d={side === 'back' ? 'M45 79 L53.5 79' : 'M69.5 79 L78 79'} stroke={NOIR.paper} strokeWidth={4} />}
        {profession === 'drummer' && <Stick x={x} />}
        {!bare && <Props side={side} />}
        <ellipse cx={x} cy={y} {...fist} stroke={LINE} strokeWidth={1} />
      </g>
    </g>
  )
}

interface GumshoeProps {
  profession: Profession
  /** Its size where it is drawn inside another SVG (the theatre's canvas). */
  box?: { width: number; height: number }
}

/** Him side on as the scenes' detective, standing in a profession's kit; a scene poses his groups (pose.ts). */
export function GumshoeSprite({ profession, box }: GumshoeProps) {
  return (
    <svg viewBox={`0 0 ${VIEW.width} ${VIEW.height}`} {...box} className="overflow-visible" aria-hidden="true" focusable="false">
      <g className={`${s.sprite} ${KIT_CLASS[profession]}`}>
        <ellipse cx={62} cy={SOLES_Y + 0.5} rx={26} ry={3.4} fill={NOIR.ink} opacity={0.6} />
        <g className={s.body}>
          <Arm side="back" profession={profession} />
          <Leg side="back" profession={profession} />
          <Leg side="front" profession={profession} />
          <Waist profession={profession} />
          <path d={NECK} fill={HERO_IDENTITY.skinShade} />
          <Torso profession={profession} />
          <Head profession={profession} />
          <Arm side="front" profession={profession} />
        </g>
      </g>
    </svg>
  )
}
