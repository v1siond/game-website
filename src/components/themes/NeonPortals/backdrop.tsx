import { PORTAL } from './palette'

// The world behind the page, all static: the void with a faint light grid, and the two portals of the
// world, orange high on the left (in) and blue low on the right (out), as dim rims. Nothing here moves,
// so the scroll scenes keep the whole animated element budget.

function PortalRim({ color, className }: { color: string; className: string }) {
  return (
    <svg viewBox="0 0 120 200" className={className} aria-hidden="true" focusable="false">
      <ellipse cx={60} cy={100} rx={54} ry={94} fill="none" stroke={color} strokeWidth={4} opacity={0.35} />
      <ellipse cx={60} cy={100} rx={44} ry={82} fill={PORTAL.VOID} opacity={0.6} />
      <ellipse cx={60} cy={100} rx={30} ry={60} fill="none" stroke={color} strokeWidth={1} opacity={0.18} />
    </svg>
  )
}

export function DimensionBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-b from-[#07060f] via-[#0d0b1a] to-[#07060f]" />
      <div className="absolute inset-0 opacity-40 bg-[linear-gradient(#0d3a5c_1px,transparent_1px),linear-gradient(90deg,#0d3a5c_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]" />
      <PortalRim color={PORTAL.ORANGE} className="absolute -left-16 top-[12%] h-80 w-48 sm:left-[-2rem]" />
      <PortalRim color={PORTAL.BLUE} className="absolute -right-16 bottom-[8%] h-80 w-48 sm:right-[-2rem]" />
    </div>
  )
}

// The world's mark: an orange and a blue portal side by side.
export function PortalPair({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 40" className={className} aria-hidden="true" focusable="false">
      <ellipse cx={13} cy={20} rx={9} ry={17} fill={PORTAL.VOID} stroke={PORTAL.ORANGE} strokeWidth={3} />
      <ellipse cx={35} cy={20} rx={9} ry={17} fill={PORTAL.VOID} stroke={PORTAL.BLUE} strokeWidth={3} />
    </svg>
  )
}
