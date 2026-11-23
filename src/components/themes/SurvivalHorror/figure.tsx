import type { Profession } from '@/lib/cv/professions'
import { HERO_IDENTITY } from '@/lib/cv/heroIdentity'
import { SH } from './palette'
import s from './figure.module.css'

// Him as this world's survivor, lit like a figure in a pre-rendered room: a worn canvas jacket over a grey
// shirt, dark trousers and boots, a flashlight in his left hand whose beam he raises into the dark, a revolver
// he draws from his belt when a shape comes for him. His traits come from HERO_IDENTITY: his skin, his short
// dark hair, his full dark beard. The Martial Artist sheds the jacket for a dark vest, wraps his hands and
// wears his own mongkhon. Drawn facing right in a 100 by 150 box, feet on y 144, on the shared rig's joints:
// the scenes pose him per frame (pose.ts).

const LINE = SH.void
const LW = 1.4
const SKIN = HERO_IDENTITY.skin
const SKIN_SHADE = HERO_IDENTITY.skinShade
const HAIR = HERO_IDENTITY.hair

const HEAD = 'M38 26 Q38 12 50 12 Q62 12 62 26 Q62 40 50 43 Q38 40 38 26 Z'
const HAIR_CUT = 'M37.5 25 Q37 10 50 9.5 Q63 10 62.5 25 Q60 17 54 16.5 Q48 14.5 43 17 Q39 19 37.5 25 Z'
const BEARD = 'M38.5 28 Q39 42 50 45.5 Q61 42 61.5 28 Q58.5 34.5 54 34.5 Q50 32.5 46 34.5 Q41.5 34.5 38.5 28 Z'
const JACKET = 'M31 46 Q50 40 69 46 L71 98 L29 98 Z'
const SHIRT = 'M42 44 L50 58 L58 44 Z'
const VEST = 'M34 47 Q50 43 66 47 L66 92 L34 92 Z'

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

function Shape({ d, fill }: { d: string; fill: string }) {
  return <path d={d} fill={fill} stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
}

// His mongkhon: a white and gold braided crown ring, its tail standing up at the back.
function Mongkhon() {
  return (
    <g>
      <path d="M38 19 Q50 12 62 19" fill="none" stroke={LINE} strokeWidth={5.5} strokeLinecap="round" />
      <path d="M38 19 Q50 12 62 19" fill="none" stroke={SH.ivory} strokeWidth={3.6} strokeLinecap="round" />
      <path d="M41 17 L43 18.5 M47 15 L49 16.5 M53 15 L55 16.5 M59 16.5 L61 18" stroke={SH.brass} strokeWidth={1.1} />
      <Shape d="M59 16 Q66 6 63 1 Q70 6 64 18 Z" fill={SH.ivory} />
    </g>
  )
}

function Head({ profession }: { profession: Profession }) {
  return (
    <g>
      <circle cx={38.5} cy={28} r={3} fill={SKIN_SHADE} stroke={LINE} strokeWidth={LW} />
      <Shape d={HEAD} fill={SKIN} />
      <Shape d={HAIR_CUT} fill={HAIR} />
      <Shape d={BEARD} fill={HAIR} />
      <path d="M42 21.5 L47.5 21 M52.5 21 L58 21.5" stroke={HAIR} strokeWidth={1.8} strokeLinecap="round" />
      <path d="M43 25 H46.5 M53.5 25 H57" stroke={LINE} strokeWidth={1.6} strokeLinecap="round" />
      {profession === 'fighter' && <Mongkhon />}
    </g>
  )
}

function Torso({ profession }: { profession: Profession }) {
  if (profession === 'fighter') {
    return (
      <g>
        <Shape d={VEST} fill={SH.top} />
        <path d="M50 47 V90" stroke={SH.steel} strokeWidth={1} />
        <Shape d="M32 88 L68 88 L69 98 L31 98 Z" fill={SH.cargo} />
      </g>
    )
  }

  return (
    <g>
      <Shape d={JACKET} fill={SH.jacket} />
      <Shape d={SHIRT} fill={SH.steel} />
      <path d="M42 44 L46 62 M58 44 L54 62" stroke={SH.jacketShade} strokeWidth={2.2} />
      <path d="M68.5 48 L70 94" stroke={SH.jacketLit} strokeWidth={1.6} />
      <path d="M34 70 H44 M56 70 H66" stroke={SH.jacketShade} strokeWidth={1.2} />
      <Shape d="M30 90 L70 90 L70.4 95 L29.6 95 Z" fill={SH.strap} />
      {/* the revolver's holster on his right hip, empty once he draws */}
      <g className={s.holster}>
        <Shape d="M29 92 L36 92 L35 106 L30 106 Z" fill={SH.strap} />
        <path d="M30.5 90 L33.5 86" stroke={SH.gunmetal} strokeWidth={2.4} strokeLinecap="round" />
      </g>
    </g>
  )
}

function Leg({ side }: { side: Side }) {
  return (
    <g className={side === 'right' ? s.thighRight : s.thighLeft}>
      <Shape d={THIGH[side]} fill={SH.cargo} />
      <g className={side === 'right' ? s.shinRight : s.shinLeft}>
        <Shape d={SHIN[side]} fill={SH.cargo} />
        <Shape d={BOOT[side]} fill={SH.boot} />
      </g>
    </g>
  )
}

// The revolver in his right fist, its barrel along the forearm's line.
function Revolver() {
  return (
    <g className={s.gun} opacity={0}>
      <path d="M28.5 86 L32.5 86 L32.5 110 L28.5 110 Z" fill={SH.steel} stroke={LINE} strokeWidth={0.8} />
      <circle cx={30.5} cy={94} r={3.2} fill={SH.fog} stroke={LINE} strokeWidth={0.8} />
    </g>
  )
}

// A page in his right hand, held up to the light.
function Paper() {
  return (
    <g className={s.paper} opacity={0}>
      <path d="M24 86 L38 84 L40 104 L26 106 Z" fill={SH.ivory} stroke={LINE} strokeWidth={0.8} />
      <path d="M27 90 L36 89 M27.5 94 L36.5 93 M28 98 L34 97.4" stroke={SH.sepia} strokeWidth={0.9} />
    </g>
  )
}

// The flashlight in his left fist and its beam, a long cone along the forearm's line that lights what he
// points it at. The beam is drawn hanging down; the arm's turn points it.
function Flashlight() {
  return (
    <g>
      <path className={s.beam} opacity={0} d="M67 92 L72.6 92 L120 250 L22 250 Z" fill={SH.flame} fillOpacity={0.22} />
      <rect x={67.4} y={84} width={4.8} height={11} rx={1} fill={SH.gunmetal} stroke={LINE} strokeWidth={0.8} />
      <rect className={s.beam} opacity={0} x={67.4} y={93} width={4.8} height={2} fill={SH.ivory} />
    </g>
  )
}

function Hand({ side, profession }: { side: Side; profession: Profession }) {
  const { x, y } = HAND[side]
  return <circle cx={x} cy={y} r={4.2} fill={profession === 'fighter' ? SH.ivory : SKIN} stroke={LINE} strokeWidth={LW} />
}

function Arm({ side, profession }: { side: Side; profession: Profession }) {
  const sleeve = profession === 'fighter' ? SKIN : SH.jacket

  return (
    <g className={side === 'right' ? s.armRight : s.armLeft}>
      <Shape d={UPPER[side]} fill={sleeve} />
      <g className={side === 'right' ? s.foreRight : s.foreLeft}>
        {side === 'left' && <Flashlight />}
        <Shape d={FORE[side]} fill={sleeve} />
        <Hand side={side} profession={profession} />
        {side === 'right' && <Revolver />}
        {side === 'right' && <Paper />}
      </g>
    </g>
  )
}

/** His figure's groups in the 100 by 150 viewBox; a stage places it in a nested svg of that viewBox and poses its joints (pose.ts). */
export function SurvivorFigure({ profession }: { profession: Profession }) {
  return (
    <g className={s.sprite}>
      <ellipse cx={50} cy={145} rx={20} ry={2.6} fill={SH.void} opacity={0.6} />
      <g className={s.body}>
        <Arm side="right" profession={profession} />
        <Leg side="right" />
        <Leg side="left" />
        <Torso profession={profession} />
        <Head profession={profession} />
        <Arm side="left" profession={profession} />
      </g>
    </g>
  )
}
