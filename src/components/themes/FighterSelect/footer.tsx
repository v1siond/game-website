import { FS } from './palette'

// The cabinet's control panel closes the page: the stick and the six attack buttons, still art.

const BUTTONS = [
  { x: 92, y: 18, color: FS.p1Light },
  { x: 116, y: 14, color: FS.p1Light },
  { x: 140, y: 18, color: FS.p1Light },
  { x: 92, y: 40, color: FS.p2 },
  { x: 116, y: 36, color: FS.p2 },
  { x: 140, y: 40, color: FS.p2 },
]

export function ControlPanel() {
  return (
    <footer className="relative z-20 flex justify-center py-12" aria-hidden="true">
      <svg viewBox="0 0 170 60" className="h-16 w-44 opacity-70" focusable="false">
        <rect x={2} y={2} width={166} height={56} rx={6} fill={FS.panel} stroke={FS.steel} strokeWidth={2} />
        <circle cx={40} cy={34} r={12} fill={FS.ink} stroke={FS.steel} />
        <rect x={38} y={14} width={4} height={20} fill={FS.chrome} />
        <circle cx={40} cy={14} r={8} fill={FS.p2} />
        {BUTTONS.map(({ x, y, color }) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={7} fill={color} stroke={FS.ink} strokeWidth={2} />
        ))}
      </svg>
    </footer>
  )
}
