import { DOG_COAT, DOG_MUZZLE, DOG_SADDLE, POSTER_INK } from './palette'
import d from './dog.module.css'

// The wasteland dog that walks at his heel: a German shepherd in the flat poster language, facing right.
// Tan legs, chest and face, the black saddle over the back, the black muzzle tip, tall pointed ears up,
// the bushy tail held low (from the research). Each leg turns at its hip (its transform
// origin in dog.module.css); the scroll poses him (pose.ts): the trot swings the front and back pairs
// against each other, sitting folds the hind legs under, digging pitches him nose down.

function Leg({ x, className }: { x: number; className: string }) {
  return (
    <g className={className}>
      <rect x={x} y={44} width={7} height={24} rx={3} fill={DOG_COAT} stroke={POSTER_INK} strokeWidth={2} />
      <rect x={x - 1} y={64} width={10} height={5} rx={2} fill={DOG_SADDLE} />
    </g>
  )
}

/** The dog's groups in its 120 by 80 viewBox; a stage places it in a nested svg and poses it itself (pose.ts). */
export function DogFigure() {
  return (
    <g className={d.dog}>
      <ellipse cx={58} cy={74} rx={34} ry={3} fill={POSTER_INK} opacity={0.3} />
      <Leg x={28} className={d.dogHindFar} />
      <Leg x={80} className={d.dogFrontFar} />
      <g className={d.dogTail}>
        <path d="M22 38 Q8 42 7 60" fill="none" stroke={POSTER_INK} strokeWidth={10} strokeLinecap="round" />
        <path d="M22 38 Q8 42 7 60" fill="none" stroke={DOG_COAT} strokeWidth={7} strokeLinecap="round" />
        <path d="M21 37 Q9 40 7.5 52" fill="none" stroke={DOG_SADDLE} strokeWidth={4} strokeLinecap="round" />
      </g>
      <g className={d.dogBody}>
        <rect x={18} y={30} width={74} height={22} rx={11} fill={DOG_COAT} stroke={POSTER_INK} strokeWidth={2} />
        <path d="M22 36 Q24 29 34 29 Q56 25 82 30 Q86 34 82 41 Q56 38 30 44 Q22 43 22 36 Z" fill={DOG_SADDLE} />
      </g>
      <Leg x={36} className={d.dogHindNear} />
      <Leg x={86} className={d.dogFrontNear} />
      <g className={d.dogHead}>
        <path d="M84 34 L90 14 L100 22 Z" fill={DOG_SADDLE} stroke={POSTER_INK} strokeWidth={2} strokeLinejoin="round" />
        <rect x={86} y={18} width={22} height={20} rx={9} fill={DOG_COAT} stroke={POSTER_INK} strokeWidth={2} />
        <path d="M100 26 L118 28 Q118 36 104 36 Z" fill={DOG_MUZZLE} stroke={POSTER_INK} strokeWidth={2} strokeLinejoin="round" />
        <path d="M110 27 L118 28 Q118 34 111 34.5 Z" fill={DOG_SADDLE} />
        <circle cx={117} cy={28} r={2.5} fill={POSTER_INK} />
        <circle cx={98} cy={24} r={2} fill={POSTER_INK} />
        <path d="M92 18 L96 4 L102 18 Z" fill={DOG_SADDLE} stroke={POSTER_INK} strokeWidth={2} strokeLinejoin="round" />
      </g>
    </g>
  )
}
