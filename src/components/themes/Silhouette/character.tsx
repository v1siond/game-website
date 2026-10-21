import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { SHADE } from './palette'
import sprite from './sprite.module.css'

// Him as this world's sprite, a parody of the monochrome forest platformer's hero (the small boy of
// Limbo, named here in code only): a small, slender, pure black figure seen from the side and facing
// right, the boy's big head on a thin body with short legs, and two glowing white eyes, the only light
// on him. He is still himself in the outline: the short hair's ragged top, the full beard bulking out
// his jaw with its ragged fringe and a nose. His identity colours (HERO_IDENTITY) are dropped, as a
// silhouette world does; only his shape is kept.
// - System Engineer: a long work coat flaring below the hips.
// - Musician: a stick in each hand.
// - Martial Artist: heavy gloves, and the mongkhon (the corded ring a Muay Thai fighter wears) round his
//   head with its tail standing up behind.
//
// The parts are separate groups (back arm, back leg, body and head, front leg, front arm), each turning
// round its own joint, so sprite.module.css can run his poses with transforms only: idle (breath and
// blink), the heavy run, push, fall, lie, rise, and one action per profession (typing, drumming, the
// roundhouse kick). His eyes follow the visitor's pointer (--mx and --my from the world root).
// viewBox units: 40 by 64, feet on y 63.

export type SpritePose = 'idle' | 'run' | 'push' | 'fall' | 'lie' | 'rise' | 'act'

const BLACK = SHADE.black
const EYE_GLOW = SHADE.glow

const HEAD = 'M11.4 12.5 A8.6 8.6 0 1 0 28.6 12.5 A8.6 8.6 0 1 0 11.4 12.5 Z'
const HAIR = 'M11.6 11.6 L11 7.6 L12.8 8 L13 5 L15 6 L16 3.4 L18 4.8 L19.8 2.4 L21.4 4.4 L23.4 3 L24.4 5 L26.6 4.4 L26.8 6.6 L28.4 7.4 L27.8 9.6 Z'
const NOSE = 'M28.2 11 L30.2 13.6 L28.3 14.2 Z'
const BEARD =
  'M13.4 13.6 Q13.2 20.5 17.2 23 L18.4 25 L19.8 23.4 L21.2 25.4 L22.6 23.4 L24.2 24.8 L25.2 22.6 L27 23.2 L27.6 20.4 Q29.6 18.8 28.8 16 L25.6 16.4 Q22 17.4 19 15.6 Z'
const TORSO = 'M15.2 23.6 Q20 22 24.8 23.6 L24.4 40.5 L15.6 40.5 Z'

interface Look {
  // Drawn over the torso: the coat's skirt.
  skirt: ReactNode
  // Drawn round the head: the mongkhon.
  headwear: ReactNode
  hand: (x: number) => ReactNode
}

const fist = (x: number) => <circle cx={x} cy={41} r={1.5} fill={BLACK} />

const LOOK: Record<Profession, Look> = {
  engineer: {
    skirt: <path d="M15.6 39 L14 50 L26 50 L24.4 39 Z" fill={BLACK} />,
    headwear: null,
    hand: fist,
  },
  drummer: {
    skirt: null,
    headwear: null,
    hand: (x) => (
      <>
        <line x1={x - 1} y1={40} x2={x + 7.5} y2={46.5} stroke={BLACK} strokeWidth={0.9} strokeLinecap="round" />
        {fist(x)}
      </>
    ),
  },
  fighter: {
    skirt: null,
    headwear: (
      <>
        <path d="M11.6 9.8 Q20 6 28.4 9.8" fill="none" stroke={BLACK} strokeWidth={2} strokeLinecap="round" />
        <path d="M12.4 9.6 Q8.6 5.8 8.2 1.4 Q10.4 4.8 13.6 7.6 Z" fill={BLACK} />
      </>
    ),
    hand: (x) => <circle cx={x + 0.4} cy={41.2} r={2.4} fill={BLACK} />,
  },
}

function Arm({ x, look, className }: { x: number; look: Look; className: string }) {
  return (
    <g className={className}>
      <rect x={x - 1.2} y={23.6} width={2.4} height={17} rx={1.2} fill={BLACK} />
      {look.hand(x)}
    </g>
  )
}

function Leg({ x, className }: { x: number; className: string }) {
  return (
    <g className={className}>
      <rect x={x - 1.4} y={38.6} width={2.8} height={22.6} rx={1.4} fill={BLACK} />
      <path d={`M${x - 1.8} 60.4 H${x + 2.6} Q${x + 4.4} 61.4 ${x + 3.8} 63 H${x - 1.8} Z`} fill={BLACK} />
    </g>
  )
}

// Where he stands inside a scene's own svg: his feet's left edge at x, the ground at y, and his height,
// all in the scene's units, so he lines up with the art at every width.
export interface SpritePlace {
  x: number
  y: number
  height: number
}

interface HeroCharacterProps {
  profession: Profession
  pose?: SpritePose
  place?: SpritePlace
  className?: string
}

const placement = (place: SpritePlace | undefined) =>
  place && { x: place.x, y: place.y - place.height, height: place.height, width: (place.height * 40) / 64 }

export function HeroCharacter({ profession, pose = 'idle', place, className = '' }: HeroCharacterProps) {
  const look = LOOK[profession]

  return (
    <svg
      {...placement(place)}
      viewBox="0 0 40 64"
      className={`${sprite.sprite} ${sprite[pose]} ${sprite[profession]} ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <g className={sprite.whole}>
        <Arm x={16.4} look={look} className={sprite.armBack} />
        <Leg x={18.2} className={sprite.legBack} />
        <g className={sprite.body}>
          <path d={TORSO} fill={BLACK} />
          {look.skirt}
          <rect x={18.4} y={20} width={3.4} height={4} fill={BLACK} />
          <g className={sprite.head}>
            <path d={HEAD} fill={BLACK} />
            <path d={HAIR} fill={BLACK} />
            <path d={NOSE} fill={BLACK} />
            <path d={BEARD} fill={BLACK} />
            <g className={sprite.look}>
              <g className={sprite.eye}>
                <ellipse cx={20.6} cy={11.4} rx={1.2} ry={1.9} fill={EYE_GLOW} />
                <ellipse cx={25} cy={11.4} rx={1.5} ry={2} fill={EYE_GLOW} />
              </g>
            </g>
            {look.headwear}
          </g>
        </g>
        <Leg x={21.8} className={sprite.legFront} />
        <Arm x={23.4} look={look} className={sprite.armFront} />
      </g>
    </svg>
  )
}
