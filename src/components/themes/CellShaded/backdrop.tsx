import world from './world.module.css'
import { CEL } from './palette'

// Cell Shaded's static art: the comic impact burst, the speed lines, the page backdrop (the halftone
// screen, a few ink splats and bursts in the margins) and the breaks between sections. Nothing here
// moves; the scroll scenes own every motion.

// The points of a jagged comic impact burst: twelve spikes, every other one short.
const BURST_POINTS = Array.from({ length: 24 }, (_, i) => {
  const angle = (i * Math.PI) / 12
  const radius = i % 2 ? 26 : 48 - (i % 4) * 4
  return `${50 + Math.sin(angle) * radius},${50 - Math.cos(angle) * radius}`
}).join(' ')

export function ImpactBurst({ fill, className = 'h-full w-full' }: { fill: string; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={`${world.inked} ${className}`} aria-hidden="true" focusable="false">
      <polygon points={BURST_POINTS} fill={fill} />
    </svg>
  )
}

// Horizontal speed lines, the streaks a cel shaded game draws behind anything moving fast.
const STREAKS = [
  { y: 12, x: 20, length: 160 },
  { y: 26, x: 240, length: 110 },
  { y: 40, x: 90, length: 200 },
  { y: 54, x: 380, length: 140 },
  { y: 68, x: 160, length: 120 },
  { y: 82, x: 460, length: 180 },
]

export function SpeedLines({ className, color }: { className: string; color: string }) {
  return (
    <svg viewBox="0 0 600 100" preserveAspectRatio="none" className={className} aria-hidden="true" focusable="false">
      {STREAKS.map(({ y, x, length }) => (
        <rect key={y} x={x} y={y} width={length} height={2.5} rx={1.25} fill={color} />
      ))}
    </svg>
  )
}

// Ink splats and bursts in the page margins: where each sits, its size and colour.
const MARGIN_ART = [
  { place: 'left-[3%] top-[18%] h-16 w-16', fill: CEL.sun },
  { place: 'right-[4%] top-[32%] h-12 w-12', fill: CEL.magenta },
  { place: 'left-[5%] top-[62%] h-10 w-10', fill: CEL.sky },
  { place: 'right-[3%] top-[78%] h-14 w-14', fill: CEL.orange },
]

export function CelBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] hidden overflow-hidden md:block" aria-hidden="true">
      <div className={`absolute inset-0 ${world.halftone}`} />
      {MARGIN_ART.map(({ place, fill }) => (
        <div key={place} className={`absolute opacity-40 ${place}`}>
          <ImpactBurst fill={fill} />
        </div>
      ))}
    </div>
  )
}

export type BreakKind = 'burst' | 'streaks'

const BREAK_COLORS: Record<BreakKind, [string, string]> = {
  burst: [CEL.sun, CEL.orange],
  streaks: [CEL.sky, CEL.magenta],
}

// The break between two sections: speed lines running into an impact burst from both sides.
export function SectionBreak({ kind }: { kind: BreakKind }) {
  const [burst, streak] = BREAK_COLORS[kind]

  return (
    <div className="relative my-6 flex items-center justify-center gap-3 py-4" aria-hidden="true">
      <SpeedLines className="h-8 w-24 flex-1 sm:max-w-56" color={streak} />
      <ImpactBurst fill={burst} className="h-16 w-16 flex-shrink-0 sm:h-20 sm:w-20" />
      <SpeedLines className="h-8 w-24 flex-1 -scale-x-100 sm:max-w-56" color={streak} />
    </div>
  )
}
