import { POSTER_INK } from './palette'
import j from './journey.module.css'

// The wasteland dog that walks at his heel: a shepherd in the flat poster language, tan coat with the
// dark saddle, ears up, facing right. Each leg turns at its hip (its transform origin in journey.module.css)
// so the trot swings the front and back pairs against each other; sitting folds the hind legs under.

export type DogMotion = 'trot' | 'sit' | 'run'

const COAT = '#b07a45'
const SADDLE = '#3a2a1c'
const MUZZLE = '#e2c08d'

const MOTION_CLASS: Record<DogMotion, string> = { trot: j.dogTrot, sit: j.dogSit, run: j.dogRun }

function Leg({ x, className }: { x: number; className: string }) {
  return (
    <g className={className}>
      <rect x={x} y={44} width={7} height={24} rx={3} fill={COAT} stroke={POSTER_INK} strokeWidth={2} />
      <rect x={x - 1} y={64} width={10} height={5} rx={2} fill={SADDLE} />
    </g>
  )
}

export function DogSprite({ motion, className = '' }: { motion: DogMotion; className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={`overflow-visible ${className}`} aria-hidden="true" focusable="false">
      <g className={`${j.dog} ${MOTION_CLASS[motion]}`}>
        <ellipse cx={58} cy={74} rx={34} ry={3} fill={POSTER_INK} opacity={0.3} />
        <Leg x={28} className={j.dogHindFar} />
        <Leg x={80} className={j.dogFrontFar} />
        <g className={j.dogTail}>
          <path d="M22 38 Q6 30 4 16" fill="none" stroke={COAT} strokeWidth={7} strokeLinecap="round" />
          <path d="M22 38 Q6 30 4 16" fill="none" stroke={POSTER_INK} strokeWidth={1.5} strokeLinecap="round" opacity={0.5} />
        </g>
        <g className={j.dogBody}>
          <rect x={18} y={30} width={74} height={22} rx={11} fill={COAT} stroke={POSTER_INK} strokeWidth={2} />
          <path d="M28 31 Q52 22 80 31 L78 40 Q52 34 30 40 Z" fill={SADDLE} />
        </g>
        <Leg x={36} className={j.dogHindNear} />
        <Leg x={86} className={j.dogFrontNear} />
        <g className={j.dogHead}>
          <path d="M84 34 L90 14 L100 22 Z" fill={SADDLE} stroke={POSTER_INK} strokeWidth={2} strokeLinejoin="round" />
          <rect x={86} y={18} width={22} height={20} rx={9} fill={COAT} stroke={POSTER_INK} strokeWidth={2} />
          <path d="M100 26 L118 28 Q118 36 104 36 Z" fill={MUZZLE} stroke={POSTER_INK} strokeWidth={2} strokeLinejoin="round" />
          <circle cx={117} cy={28} r={2.5} fill={POSTER_INK} />
          <circle cx={98} cy={24} r={2} fill={POSTER_INK} />
          <path d="M92 18 L96 4 L102 18 Z" fill={SADDLE} stroke={POSTER_INK} strokeWidth={2} strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  )
}
