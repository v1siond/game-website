import { NOIR } from './palette'

// Bold Noir's small static art for the cards, flat fills in the paperwork of a 1947 detective's case: the
// red ink stamp a desk sergeant brings down on a file, and the paper clip on the case file. The city
// behind the page is the theatre's (street.tsx).

/** The red ink stamp: a ring round a five pointed star, the way a file is marked. */
export function InkStamp({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <circle cx={50} cy={50} r={44} fill="none" stroke={NOIR.red} strokeWidth={7} />
      <circle cx={50} cy={50} r={34} fill="none" stroke={NOIR.red} strokeWidth={2.5} />
      <path d="M50 22 L57 42 L78 42 L61 55 L67 76 L50 63 L33 76 L39 55 L22 42 L43 42 Z" fill={NOIR.red} />
    </svg>
  )
}

/** The paper clip that holds the case file shut, bent wire in fog grey. */
export function PaperClip({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 30 80" className={className} aria-hidden="true" focusable="false">
      <path d="M20 22 V62 Q20 74 12 74 Q4 74 4 62 V14 Q4 4 14 4 Q24 4 24 14 V58 Q24 64 18 64 Q12 64 12 58 V22" fill="none" stroke={NOIR.fog} strokeWidth={3.5} strokeLinecap="round" />
    </svg>
  )
}
