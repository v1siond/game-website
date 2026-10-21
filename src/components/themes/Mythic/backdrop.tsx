import { Islands } from './art'
import { MYTH } from './palette'
import world from './world.module.css'

// The Aegean behind the page: the noon sky paling to the sea, the sun high on the right, two bands of
// clouds drifting across, and the islands on the horizon. Fixed under the content (z-0); the clouds
// are the only motion, on transform, and they stop under reduced motion.

// One tile of a cloud band in its 600 by 60 box; the band draws it twice so it loops without a seam.
const CLOUD_PUFFS = [
  { x: 60, y: 30, rx: 46, ry: 12 },
  { x: 92, y: 22, rx: 26, ry: 12 },
  { x: 300, y: 38, rx: 60, ry: 10 },
  { x: 330, y: 30, rx: 30, ry: 11 },
  { x: 500, y: 26, rx: 40, ry: 10 },
]

function CloudBand({ className, opacity }: { className: string; opacity: number }) {
  return (
    <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className={className} aria-hidden="true" focusable="false">
      {[0, 600].map((tile) =>
        CLOUD_PUFFS.map(({ x, y, rx, ry }) => (
          <ellipse key={`${tile}-${x}-${y}`} cx={tile + x} cy={y} rx={rx} ry={ry} fill={MYTH.cloud} fillOpacity={opacity} />
        )),
      )}
    </svg>
  )
}

export function Aegean() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className={`absolute inset-0 ${world.sky}`} />
      <svg viewBox="0 0 100 100" className="absolute right-[8%] top-[6%] h-24 w-24 sm:h-32 sm:w-32" aria-hidden="true" focusable="false">
        <circle cx={50} cy={50} r={46} fill={MYTH.sun} fillOpacity={0.35} />
        <circle cx={50} cy={50} r={30} fill={MYTH.sun} />
      </svg>
      <CloudBand className={`absolute left-0 top-[8%] h-16 ${world.cloudsFar}`} opacity={0.55} />
      <CloudBand className={`absolute left-0 top-[22%] h-24 ${world.clouds}`} opacity={0.85} />
      <Islands className="absolute inset-x-0 bottom-[42%] h-10 w-full sm:h-14" />
    </div>
  )
}
