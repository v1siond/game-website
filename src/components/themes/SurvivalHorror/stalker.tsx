import { SH } from './palette'

// The stalker of the 1999 sequel (Nemesis, named here in code only), drawn as the genre's pursuer and
// nothing more: a head and shoulders taller than him, a long dark coat belted at the chest, heavy boots and
// gloves, the left arm bigger than the right, a bald pale grey head with one pale eye catching the light.
// No wounds, no teeth, no words. He faces left, toward the hero. The motion (the burst through the wall,
// the stagger, the throw, the retreat) is the corridor's, in horror.module.css; this is the art.
// viewBox units: 70 by 150, feet on y 148.

export function Stalker({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 70 150" className={`overflow-visible ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="sh-stalker-coat" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={SH.coatLit} />
          <stop offset="60%" stopColor={SH.coat} />
          <stop offset="100%" stopColor={SH.void} />
        </linearGradient>
        <radialGradient id="sh-stalker-head" cx="0.35" cy="0.35" r="0.7">
          <stop offset="0%" stopColor={SH.fog} />
          <stop offset="70%" stopColor={SH.stalkerSkin} />
          <stop offset="100%" stopColor={SH.ash} />
        </radialGradient>
      </defs>
      <ellipse cx={36} cy={148} rx={22} ry={2.4} fill={SH.void} opacity={0.7} />
      {/* boots and trousers under the coat */}
      <rect x={22} y={112} width={10} height={32} fill={SH.top} />
      <rect x={38} y={112} width={10} height={32} fill={SH.top} />
      <path d="M16 140 H33 V148 H14 Q13 143 16 140 Z" fill={SH.boot} />
      <path d="M34 140 H50 V148 H32 Q31 143 34 140 Z" fill={SH.boot} />
      {/* the long coat, wide at the shoulders, belted twice across the chest */}
      <path d="M14 40 Q20 30 36 30 Q54 30 58 42 L60 124 Q48 130 36 128 Q22 130 12 124 Z" fill="url(#sh-stalker-coat)" />
      <path d="M36 34 V126" stroke={SH.void} strokeWidth={1} />
      <path d="M15 56 L57 50 M15 66 L58 60" stroke={SH.strap} strokeWidth={3} />
      <rect x={33} y={50} width={5} height={5} fill={SH.steel} />
      <rect x={33} y={60} width={5} height={5} fill={SH.steel} />
      <path d="M20 34 Q28 44 36 38 Q44 44 52 34" fill={SH.coat} stroke={SH.void} strokeWidth={0.8} />
      {/* the big left arm (on the visitor's left, toward him), the smaller right one behind */}
      <path d="M52 42 Q62 46 62 64 L60 98 Q56 102 52 98 L52 60 Z" fill={SH.coat} />
      <circle cx={56} cy={100} r={4.4} fill={SH.top} />
      <g>
        <path d="M16 40 Q2 44 2 66 L4 104 Q10 110 16 104 L18 66 Z" fill="url(#sh-stalker-coat)" />
        <circle cx={9} cy={108} r={7} fill={SH.top} />
        <path d="M4 106 Q9 101 14 106" stroke={SH.coatLit} strokeWidth={1} fill="none" />
      </g>
      {/* the bald head and its one lit eye */}
      <path d="M28 30 Q26 14 36 12 Q46 12 46 26 Q46 34 38 36 Q30 36 28 30 Z" fill="url(#sh-stalker-head)" />
      <path d="M28.6 22 Q36 18 45.6 21" stroke={SH.ash} strokeWidth={1.4} fill="none" />
      <ellipse cx={31.6} cy={25} rx={1.6} ry={1.1} fill={SH.ivory} />
      <path d="M29.6 31 Q32 32.4 35 31.6" stroke={SH.ash} strokeWidth={1} fill="none" />
    </svg>
  )
}
