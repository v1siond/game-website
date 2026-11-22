import { DECO_COLORS as C } from './palette'

// The city's depth gauge on a chamber's plaque: nine ticks from -120 to 120 degrees round a brass rimmed
// dark dial, a needle and its hub. The caller places it and turns the needle with its own class.

const TICKS = Array.from({ length: 9 }, (_, i) => -120 + i * 30)

export function DepthGauge({ className, needle }: { className: string; needle: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <circle cx={24} cy={24} r={22} fill={C.abyss} stroke={C.brassMid} strokeWidth={3} />
      {TICKS.map((angle) => (
        <path key={angle} d="M24 5 V9" stroke={C.gold} strokeWidth={1.5} transform={`rotate(${angle} 24 24)`} />
      ))}
      <g className={needle}>
        <path d="M24 24 L24 8" stroke={C.spark} strokeWidth={2} strokeLinecap="round" />
      </g>
      <circle cx={24} cy={24} r={3} fill={C.gold} />
    </svg>
  )
}
