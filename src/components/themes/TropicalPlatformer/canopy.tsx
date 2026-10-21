import { ToneScope } from './scenery'
import paint from './scenery.module.css'

// The jungle round the page: fronds hanging down both edges in the shade under the canopy, fixed while
// the page scrolls, from md up (on a phone they would cover the cards). Still, decoration only. The
// fronds are the scenery's own shape, darkened as a back layer.

const HANGING: ReadonlyArray<readonly [number, number, number]> = [
  // y, angle, scale
  [40, 70, 0.7],
  [190, 96, 0.6],
  [330, 64, 0.75],
  [480, 100, 0.55],
  [620, 72, 0.7],
  [770, 92, 0.6],
]

function Fronds({ flip }: { flip: boolean }) {
  return (
    <svg viewBox="0 0 80 800" preserveAspectRatio="xMinYMid slice" className={`h-full w-full ${flip ? '-scale-x-100' : ''}`} aria-hidden="true" focusable="false">
      <path d="M0 0 H22 Q10 200 18 400 Q8 600 16 800 H0 Z" className={paint.leafShade} />
      {HANGING.map(([y, angle, scale]) => (
        <use key={y} href="#tp-frond" transform={`translate(4 ${y}) rotate(${angle}) scale(${scale})`} className={paint.back} />
      ))}
    </svg>
  )
}

export function Canopy() {
  return (
    <ToneScope tone="jungle" className="pointer-events-none fixed inset-y-0 left-0 right-0 z-[5] hidden md:block">
      <div className="absolute inset-y-0 left-0 w-12 lg:w-16" aria-hidden="true">
        <Fronds flip={false} />
      </div>
      <div className="absolute inset-y-0 right-0 w-12 lg:w-16" aria-hidden="true">
        <Fronds flip />
      </div>
    </ToneScope>
  )
}
