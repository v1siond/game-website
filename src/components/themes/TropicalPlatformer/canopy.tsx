import { COLORS as C } from './palette'

// The jungle round the page: dark canopy silhouettes hanging down both edges, fixed while the page
// scrolls, from md up (on a phone they would cover the cards). Still, decoration only.

function Fronds({ flip }: { flip: boolean }) {
  return (
    <svg viewBox="0 0 80 800" preserveAspectRatio="none" className={`h-full w-full ${flip ? '-scale-x-100' : ''}`} aria-hidden="true" focusable="false">
      <path d="M0 0 H50 Q30 60 40 120 Q20 200 34 280 Q14 360 30 440 Q10 540 26 640 Q8 720 18 800 H0 Z" fill={C.jungleDeep} />
      <path d="M0 0 H26 Q12 90 20 180 Q6 300 16 420 Q4 560 12 800 H0 Z" fill={C.shadow} opacity="0.8" />
      {[90, 230, 380, 520, 660].map((y) => (
        <path key={y} d={`M24 ${y} q30 -10 46 12 q-24 -2 -46 -12 Z`} fill={C.moss} opacity="0.7" />
      ))}
    </svg>
  )
}

export function Canopy() {
  return (
    <div className="pointer-events-none fixed inset-y-0 left-0 right-0 z-[5] hidden md:block" aria-hidden="true">
      <div className="absolute inset-y-0 left-0 w-12 lg:w-16">
        <Fronds flip={false} />
      </div>
      <div className="absolute inset-y-0 right-0 w-12 lg:w-16">
        <Fronds flip />
      </div>
    </div>
  )
}
