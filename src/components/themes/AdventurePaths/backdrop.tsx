import { TRAIL } from './palette'

// The night behind the page: a few stars, the moon over the far ridges and the dark forest line along the
// bottom of the viewport. It stands still (the levels carry the motion) and sits under every section.

const STARS = [
  [6, 8],
  [14, 22],
  [23, 6],
  [31, 15],
  [44, 9],
  [52, 24],
  [61, 5],
  [69, 18],
  [78, 10],
  [86, 26],
  [93, 7],
  [38, 30],
] as const

export function NightBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden [contain:strict]" aria-hidden="true">
      <svg viewBox="0 0 100 40" preserveAspectRatio="xMidYMin slice" className="absolute inset-x-0 top-0 h-1/2 w-full" focusable="false">
        {STARS.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={0.25} fill={TRAIL.PARCHMENT} opacity={0.55} />
        ))}
        <circle cx={82} cy={14} r={4} fill={TRAIL.PARCHMENT} opacity={0.18} />
      </svg>
      <svg viewBox="0 0 400 60" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-1/3 w-full" focusable="false">
        <path d="M0 60 V34 L40 18 L75 30 L120 8 L160 26 L210 14 L250 30 L300 10 L345 28 L400 16 V60 Z" fill={TRAIL.CANOPY} opacity={0.5} />
        <path d="M0 60 V46 L20 38 L34 44 L52 34 L70 44 L92 36 L118 46 L140 38 L170 46 L196 36 L220 46 L248 40 L276 48 L300 38 L330 46 L356 40 L380 46 L400 42 V60 Z" fill={TRAIL.NIGHT} />
      </svg>
    </div>
  )
}
