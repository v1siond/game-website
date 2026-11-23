import { DOG_COAT, DOG_COAT_DARK, DOG_MUZZLE, DOG_SADDLE, HUSKY_EYE, HUSKY_GREY, HUSKY_WHITE, POSTER_INK } from './palette'
import d from './dog.module.css'

// His three dogs in the flat poster language, facing right: two German shepherds and a husky, one drawing with
// the breed as data, so all three share the joints and the poses (pose.ts). The shepherd: tan legs, chest and
// face, the black saddle over the back, the black muzzle tip, tall pointed ears up, the bushy tail held low;
// the second shepherd a shade darker with a wider saddle and a bigger frame, so the two tell apart. The husky
// (from the breed standard): grey back and white underside, the white mask face under a grey cap, blue
// almond eyes, high erect ears, the brush tail carried over the back in a sickle. Each leg turns at its hip
// (its transform origin in dog.module.css); the scroll poses them: the trot swings the front and back pairs
// against each other, sitting folds the hind legs under, digging pitches the dog nose down.

export interface Breed {
  /** Legs, chest and face. */
  coat: string
  /** The marking over the back: the shepherd's saddle, the husky's grey. */
  back: string
  muzzle: string
  paw: string
  eye: string
  /** The back marking's outline in the 120 by 80 viewBox. */
  saddle: string
  tail: 'low' | 'sickle'
  /** The husky's grey cap over the white face. */
  mask: boolean
  /** The dog's size against the others. */
  size: number
}

const SADDLE = 'M22 36 Q24 29 34 29 Q56 25 82 30 Q86 34 82 41 Q56 38 30 44 Q22 43 22 36 Z'
const SADDLE_WIDE = 'M20 38 Q21 28 34 27 Q56 23 86 29 Q90 35 86 44 Q56 42 30 48 Q20 46 20 38 Z'
const HUSKY_BACK = 'M19 38 Q20 30 32 30 Q56 27 84 31 Q90 34 88 40 Q60 37 34 41 Q22 42 19 38 Z'

export const SHEPHERD: Breed = { coat: DOG_COAT, back: DOG_SADDLE, muzzle: DOG_MUZZLE, paw: DOG_SADDLE, eye: POSTER_INK, saddle: SADDLE, tail: 'low', mask: false, size: 1 }
export const SHEPHERD_DARK: Breed = { ...SHEPHERD, coat: DOG_COAT_DARK, saddle: SADDLE_WIDE, size: 1.08 }
export const HUSKY: Breed = { coat: HUSKY_WHITE, back: HUSKY_GREY, muzzle: HUSKY_WHITE, paw: HUSKY_WHITE, eye: HUSKY_EYE, saddle: HUSKY_BACK, tail: 'sickle', mask: true, size: 0.96 }

/** His three dogs, always in this order. */
export const PACK: readonly Breed[] = [SHEPHERD, SHEPHERD_DARK, HUSKY]

function Leg({ x, className, breed }: { x: number; className: string; breed: Breed }) {
  return (
    <g className={className}>
      <rect x={x} y={44} width={7} height={24} rx={3} fill={breed.coat} stroke={POSTER_INK} strokeWidth={2} />
      <rect x={x - 1} y={64} width={10} height={5} rx={2} fill={breed.paw} stroke={breed.mask ? POSTER_INK : 'none'} strokeWidth={1} />
    </g>
  )
}

const TAILS: Record<Breed['tail'], { line: string; tip: string }> = {
  low: { line: 'M22 38 Q8 42 7 60', tip: 'M21 37 Q9 40 7.5 52' },
  sickle: { line: 'M22 36 Q6 28 12 15 Q18 7 28 14', tip: 'M21 35 Q8 27 13 16' },
}

/** The tail; the low one swings and drops on its joint, the sickle stays curled over the back. */
function Tail({ breed, className }: { breed: Breed; className?: string }) {
  const { line, tip } = TAILS[breed.tail]
  return (
    <g className={className}>
      <path d={line} fill="none" stroke={POSTER_INK} strokeWidth={10} strokeLinecap="round" />
      <path d={line} fill="none" stroke={breed.coat} strokeWidth={7} strokeLinecap="round" />
      <path d={tip} fill="none" stroke={breed.back} strokeWidth={4} strokeLinecap="round" />
    </g>
  )
}

function Head({ breed }: { breed: Breed }) {
  return (
    <g className={d.dogHead}>
      <path d="M84 34 L90 14 L100 22 Z" fill={breed.back} stroke={POSTER_INK} strokeWidth={2} strokeLinejoin="round" />
      <rect x={86} y={18} width={22} height={20} rx={9} fill={breed.coat} stroke={POSTER_INK} strokeWidth={2} />
      {breed.mask && <path d="M87 30 Q85 19 95 18.5 L101 18.5 Q107.5 19 107.5 25 L101 26 Q99 21.5 96 22 Q92.5 23 92 30 Z" fill={breed.back} />}
      <path d="M100 26 L118 28 Q118 36 104 36 Z" fill={breed.muzzle} stroke={POSTER_INK} strokeWidth={2} strokeLinejoin="round" />
      <path d="M110 27 L118 28 Q118 34 111 34.5 Z" fill={DOG_SADDLE} />
      <circle cx={117} cy={28} r={2.5} fill={POSTER_INK} />
      {breed.mask ? (
        <ellipse cx={98} cy={24.5} rx={2.6} ry={1.9} fill={breed.eye} stroke={POSTER_INK} strokeWidth={1} />
      ) : (
        <circle cx={98} cy={24} r={2} fill={breed.eye} />
      )}
      <path d="M92 18 L96 4 L102 18 Z" fill={breed.back} stroke={POSTER_INK} strokeWidth={2} strokeLinejoin="round" />
    </g>
  )
}

/** A dog's groups in its 120 by 80 viewBox; a stage places it in a nested svg and poses it itself (pose.ts). */
export function DogFigure({ breed }: { breed: Breed }) {
  return (
    <g className={d.dog}>
      <ellipse cx={58} cy={74} rx={34} ry={3} fill={POSTER_INK} opacity={0.3} />
      <Leg x={28} className={d.dogHindFar} breed={breed} />
      <Leg x={80} className={d.dogFrontFar} breed={breed} />
      {breed.tail === 'low' && <Tail breed={breed} className={d.dogTail} />}
      <g className={d.dogBody}>
        {breed.tail === 'sickle' && <Tail breed={breed} />}
        <rect x={18} y={30} width={74} height={22} rx={11} fill={breed.coat} stroke={POSTER_INK} strokeWidth={2} />
        <path d={breed.saddle} fill={breed.back} />
      </g>
      <Leg x={36} className={d.dogHindNear} breed={breed} />
      <Leg x={86} className={d.dogFrontNear} breed={breed} />
      <Head breed={breed} />
    </g>
  )
}
