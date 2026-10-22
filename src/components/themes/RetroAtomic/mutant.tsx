import { CREAM_SHADE, DUST_DARK, MUTANT, MUTANT_LIGHT, MUTANT_SHADE, POSTER_INK, RUST, WARNING_RED } from './palette'
import m from './mutant.module.css'

// The Muay Thai spar's foe: a hulking green mutant of the wasteland in the flat poster language, facing
// left toward him. From the research (mutant-normal, mutant-brute): olive green skin with ochre
// highlights, bald, no neck, the small head thrust forward under a heavy brow with the jaw open, the
// shoulders twice the head's width, long thick arms with wrapped wrists, a rag loincloth over short bowed
// legs, and from the armoured brute one rust shoulder plate and the knee pads. Every part turns round its
// own joint (mutant.module.css) so the same drawing keeps a brawler's guard, doubles over a knee to the
// gut, rocks back from a kick to the head, and drops to one knee when the spar is over.

export type MutantMotion = 'guard' | 'kneed' | 'kicked' | 'down'

const MOTION_CLASS: Record<MutantMotion, string> = { guard: m.guard, kneed: m.kneed, kicked: m.kicked, down: m.down }

const LINE = { stroke: POSTER_INK, strokeWidth: 2.2, strokeLinejoin: 'round' as const }

function Leg({ near }: { near: boolean }) {
  const skin = near ? MUTANT : MUTANT_SHADE
  const shift = near ? 0 : 22

  return (
    <g className={near ? m.thighNear : m.thighFar}>
      <path d={`M${48 + shift} 96 L${64 + shift} 96 L${61 + shift} 121 L${47 + shift} 121 Z`} fill={skin} {...LINE} />
      <g className={near ? m.shinNear : m.shinFar}>
        <path d={`M${47 + shift} 119 L${61 + shift} 119 L${60 + shift} 140 L${48 + shift} 140 Z`} fill={skin} {...LINE} />
        <ellipse cx={54 + shift} cy={121} rx={8.5} ry={6} fill={RUST} {...LINE} />
        <path d={`M${41 + shift} 146 L${60 + shift} 146 L${60 + shift} 139 L${47 + shift} 138 Q${41 + shift} 140 ${41 + shift} 146 Z`} fill={skin} {...LINE} />
        <path d={`M${47 + shift} 135 H${60 + shift}`} stroke={CREAM_SHADE} strokeWidth={3} />
      </g>
    </g>
  )
}

// The one scrap plate strapped over the near shoulder, riding with the upper arm.
function ShoulderPlate() {
  return (
    <g>
      <path d="M37 47 Q44 34 60 39 L60 54 Q50 50 41 56 Z" fill={RUST} {...LINE} />
      <circle cx={45} cy={46} r={1.3} fill={POSTER_INK} />
      <circle cx={55} cy={44} r={1.3} fill={POSTER_INK} />
    </g>
  )
}

function Arm({ near }: { near: boolean }) {
  const skin = near ? MUTANT : MUTANT_SHADE
  const shift = near ? 0 : 26

  return (
    <g className={near ? m.armNear : m.armFar}>
      <path d={`M${40 + shift} 48 L${58 + shift} 52 L${50 + shift} 78 L${34 + shift} 74 Z`} fill={skin} {...LINE} />
      <g className={near ? m.foreNear : m.foreFar}>
        <path d={`M${34 + shift} 72 L${50 + shift} 76 L${46 + shift} 100 L${33 + shift} 98 Z`} fill={skin} {...LINE} />
        <path d={`M${33.5 + shift} 93 L${46.5 + shift} 95`} stroke={CREAM_SHADE} strokeWidth={4} />
        <circle cx={39.5 + shift} cy={103} r={7.5} fill={skin} {...LINE} />
        {near && <path d="M35 100 Q39 98 43 100" fill="none" stroke={POSTER_INK} strokeWidth={1.4} />}
      </g>
      {near && <ShoulderPlate />}
    </g>
  )
}

export function MutantSprite({ motion, className = '' }: { motion: MutantMotion; className?: string }) {
  return (
    <svg viewBox="0 0 120 150" className={`overflow-visible ${className}`} aria-hidden="true" focusable="false">
      <g className={`${m.sprite} ${MOTION_CLASS[motion]}`}>
        <ellipse cx={66} cy={146} rx={34} ry={3.5} fill={POSTER_INK} opacity={0.35} />
        <g className={m.body}>
          <Leg near={false} />
          <Arm near={false} />
          <g className={m.torso}>
            <path d="M46 98 Q40 72 40 54 Q50 36 78 37 Q98 42 95 66 Q92 88 86 98 Z" fill={MUTANT} {...LINE} />
            <path d="M50 58 Q60 50 74 54 M54 72 Q62 76 72 72 M58 84 Q64 86 70 84" fill="none" stroke={MUTANT_SHADE} strokeWidth={1.8} strokeLinecap="round" />
            <path d="M80 44 Q92 48 90 64" fill="none" stroke={MUTANT_LIGHT} strokeWidth={2.4} strokeLinecap="round" />
            <path d="M44 90 L88 90 L86 98 L82 116 L70 104 L60 118 L50 102 Z" fill={DUST_DARK} {...LINE} />
            <path d="M44 89 L88 89 L88 94 L44 94 Z" fill={RUST} {...LINE} />
            <g className={m.head}>
              <path d="M22 46 Q20 30 33 27 Q47 25 49 40 Q50 53 39 58 Q25 59 22 46 Z" fill={MUTANT} {...LINE} />
              <path d="M22 37 Q32 31 44 35" fill="none" stroke={POSTER_INK} strokeWidth={3.2} strokeLinecap="round" />
              <circle cx={29} cy={39.5} r={1.8} fill={WARNING_RED} />
              <path d="M21 47 L34 47 L32 55 L23 54 Z" fill={POSTER_INK} />
              <path d="M23 47 L25 50 L27 47 M29 47 L31 50 L33 47" fill={CREAM_SHADE} />
              <path d="M37 32 Q43 31 46 36" fill="none" stroke={MUTANT_LIGHT} strokeWidth={2} strokeLinecap="round" />
            </g>
          </g>
          <Leg near />
          <Arm near />
        </g>
      </g>
    </svg>
  )
}
