import type { Profession } from '@/lib/cv/professions'
import { HERO_IDENTITY } from '@/components/cv/heroIdentity'
import { HOSE } from './palette'
import cup from './cup.module.css'

// Him as a parody of the 1930s cup headed cartoon hero, drawn the rubber hose way: one thick ink line, a
// porcelain mug for a head with its handle at the back and a red and white striped bent straw, pie cut
// eyes and a red nose on the cup face, limbs as bendy hoses with no elbows, white four finger gloves, a
// black shirt, red shorts and big brown shoes. He stays him: the coffee filling the cup is his short dark
// hair, a few spiky tufts standing above the rim, and his full dark beard covers the lower cup face
// under the nose with the smile drawn into it. The world's film grain lies over all of it.
//
// Poses are transform keyframes in cup.module.css keyed off data-pose: the bounce that never stops
// (idle), the run with its squash and stretch and a dash burst, the finger gun shot, the cheering win,
// and each profession's act (typing, drumming, the rubber hose jab). Hovering him parries: the pink
// slap flash, from any pose.
//
// The Martial Artist wears red boxing gloves, the prajioud on his arms and his own mongkhon round the rim.

export type HeroPose = 'idle' | 'run' | 'shoot' | 'cheer' | 'type' | 'drum' | 'jab'

const INK = HOSE.ink
const LINE = 3
const SHOE = '#6b3d1f'
const HAIR = HERO_IDENTITY.hair

const CUP_BODY = 'M26 14 C26 40 30 60 50 60 C70 60 74 40 74 14 Z'
const TUFTS = 'M35 14 L37 6 L41 12 L44 3 L47 11 L51 4 L54 11 L58 5 L60 13 Z'
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

function Arm({ side, kit, gun }: { side: 'back' | 'front'; kit: Kit; gun: boolean }) {
  const front = side === 'front'
  const hand = front ? 6 : -6
  return (
    <g transform={`translate(${front ? 61 : 39} 70)`}>
      <g className={front ? cup.armFront : cup.armBack}>
        <Hose d={front ? ARM_FRONT : ARM_BACK} />
        {kit.bands && <rect x={front ? 2.4 : -6.4} y={6} width={4} height={4} rx={1} fill={HOSE.red} stroke={INK} strokeWidth={1.4} />}
        {kit.sticks && <path d={`M${hand} 25 L${hand + (front ? 14 : -14)} 40`} stroke={HOSE.gold} strokeWidth={2.4} strokeLinecap="round" />}
        <Glove x={hand} y={24} gun={front && gun} color={kit.glove} />
      </g>
    </g>
  )
}

function Leg({ side }: { side: 'back' | 'front' }) {
  const front = side === 'front'
  return (
    <g transform={`translate(${front ? 55 : 45} 94)`}>
      <g className={front ? cup.legFront : cup.legBack}>
        <path d={front ? LEG_FRONT : LEG_BACK} fill="none" stroke={INK} strokeWidth={4.4} strokeLinecap="round" />
        <ellipse cx={front ? 8 : -8} cy={46} rx={10} ry={5.4} fill={SHOE} stroke={INK} strokeWidth={LINE} />
        <ellipse cx={front ? 11 : -5} cy={44.4} rx={3} ry={1.4} fill={HOSE.highlight} opacity={0.7} />
      </g>
    </g>
  )
}

// His mongkhon round the cup's rim: the cord ring wound in two tones, the red binding and the tail.
function RimMongkhon() {
  return (
    <g>
      <path d="M26 15 C30 23 70 23 74 15" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <path d="M26 15 C30 23 70 23 74 15" fill="none" stroke={HOSE.paper} strokeWidth={3.4} strokeLinecap="round" strokeDasharray="2.4 1.6" />
      <path d="M26 16 C20 18 16 22 14 27" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <path d="M26 16 C20 18 16 22 14 27" fill="none" stroke={HOSE.paper} strokeWidth={2.4} strokeLinecap="round" />
      <rect x={23.5} y={12.5} width={5} height={6} rx={1} fill={HOSE.red} stroke={INK} strokeWidth={1.6} />
    </g>
  )
}

function CupHead({ profession }: { profession: Profession }) {
  return (
    <g className={cup.head}>
      <g className={cup.straw}>
        <path d="M58 12 L61 -6 L72 -12" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M58 12 L61 -6 L72 -12" fill="none" stroke={HOSE.highlight} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M58 12 L61 -6 L72 -12" fill="none" stroke={HOSE.red} strokeWidth={4} strokeDasharray="3 3" strokeLinejoin="round" />
      </g>
      <path d="M27 22 C13 20 13 46 30 43" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
      <path d="M27 22 C13 20 13 46 30 43" fill="none" stroke={HOSE.highlight} strokeWidth={3.6} strokeLinecap="round" />
      <path d={CUP_BODY} fill={HOSE.highlight} stroke={INK} strokeWidth={LINE} strokeLinejoin="round" />
      <path d="M66 22 C67 36 64 48 58 55" fill="none" stroke={HOSE.paperDark} strokeWidth={3} strokeLinecap="round" />
      <path d={BEARD} fill={HERO_IDENTITY.beard} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <path d="M43.5 49 Q50 56 56.5 49 Q50 51.5 43.5 49 Z" fill={HOSE.red} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      <ellipse cx={50} cy={14} rx={24} ry={6} fill={HOSE.highlight} stroke={INK} strokeWidth={LINE} />
      <ellipse cx={50} cy={14.6} rx={20} ry={4.2} fill={HAIR} />
      <path d={TUFTS} fill={HAIR} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
      {profession === 'fighter' && <RimMongkhon />}
      <g className={cup.eyes}>
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

export function HeroCharacter({ profession, pose = 'idle', className = '' }: { profession: Profession; pose?: HeroPose; className?: string }) {
  const kit = KIT[profession]
  const gun = pose === 'shoot'

  return (
    <svg viewBox="0 -20 100 170" className={`${cup.figure} ${className}`} data-pose={pose} aria-hidden="true" focusable="false">
      <ellipse cx={50} cy={146} rx={26} ry={3.4} fill={INK} opacity={0.3} />
      <g className={cup.dash}>
        <g className={cup.bounce}>
          <Leg side="back" />
          <Leg side="front" />
          <Arm side="back" kit={kit} gun={false} />
          <ellipse cx={50} cy={80} rx={12.5} ry={14} fill={HOSE.inkSoft} stroke={INK} strokeWidth={LINE} />
          <path d="M36.5 84 Q50 79 63.5 84 L64.5 98 Q57 101 51 96.5 L49 96.5 Q43 101 35.5 98 Z" fill={HOSE.red} stroke={INK} strokeWidth={LINE} strokeLinejoin="round" />
          {kit.bands ? (
            <path d="M37 86 Q50 81.5 63 86" fill="none" stroke={HOSE.gold} strokeWidth={2.6} />
          ) : (
            [45, 55].map((x) => <circle key={x} cx={x} cy={88} r={1.8} fill={HOSE.highlight} stroke={INK} strokeWidth={1} />)
          )}
          {profession === 'engineer' && <path d="M44 63 L50 66 L56 63 L56 69 L50 66 L44 69 Z" fill={HOSE.red} stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />}
          <CupHead profession={profession} />
          <Arm side="front" kit={kit} gun={gun} />
          {gun && <circle className={cup.bullet} cx={84} cy={70} r={3.4} fill={HOSE.blue} stroke={INK} strokeWidth={1.4} />}
          <path className={cup.parry} d="M80 40 L84 48 L93 46 L86 53 L91 61 L82 57 L76 64 L76 55 L68 52 L77 49 Z" fill={HOSE.parry} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  )
}
