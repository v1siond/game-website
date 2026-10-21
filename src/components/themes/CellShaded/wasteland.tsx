import { CEL } from './palette'
import { HATCH } from './ink'
import cel from './cel.module.css'

// The fixed land behind the page: four skies in hard flat bands (noon, the town's afternoon, dusk,
// night) of which the root's data-zone shows one, the sun that sets and the stars that come out with
// them, and two ridges of mesas inked and hatched on their shadow sides, the near ridge following the
// pointer further than the far one. Everything here moves by opacity or transform only.

export type Zone = 'noon' | 'town' | 'dusk' | 'night'

const SKIES = [cel.skyNoon, cel.skyTown, cel.skyDusk, cel.skyNight]

// The stars: fixed points, a few larger ones as four point sparks.
const STARS = [
  [8, 9], [17, 22], [26, 6], [34, 17], [45, 8], [53, 25], [61, 12], [70, 4], [77, 19], [86, 10], [93, 27], [12, 33], [40, 31], [66, 34],
]

export function Wasteland() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {SKIES.map((sky) => (
        <div key={sky} className={`${cel.sky} ${sky}`} />
      ))}

      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className={`absolute inset-x-0 top-0 h-2/5 w-full ${cel.stars}`}>
        {STARS.map(([x, y], index) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={index % 4 ? 0.25 : 0.45} fill={CEL.paper} />
        ))}
      </svg>

      <svg viewBox="0 0 100 100" className={`absolute right-[8%] top-[10%] h-28 w-28 sm:h-36 sm:w-36 ${cel.sun} ${cel.inked}`}>
        <circle cx={50} cy={50} r={38} fill={CEL.sun} />
        <path d="M70 22 A38 38 0 0 1 70 78 A44 44 0 0 0 70 22 Z" fill={CEL.orange} data-bare />
      </svg>

      <svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax slice" className={`absolute -inset-x-8 bottom-0 h-[42vh] ${cel.ridgeFar} ${cel.inked}`}>
        <path d="M0 300 L0 170 L90 170 L110 120 L240 120 L262 168 L420 168 L440 96 L600 96 L622 160 L800 160 L822 112 L980 112 L1000 150 L1200 150 L1200 300 Z" fill={CEL.mesa} />
        <path d="M200 120 L240 120 L262 168 L222 168 Z M560 96 L600 96 L622 160 L582 160 Z M940 112 L980 112 L1000 150 L960 150 Z" fill={CEL.mesaShade} data-bare />
        <path d="M200 120 L240 120 L262 168 L222 168 Z M560 96 L600 96 L622 160 L582 160 Z M940 112 L980 112 L1000 150 L960 150 Z" fill={HATCH} opacity={0.45} data-bare />
      </svg>

      <svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax slice" className={`absolute -inset-x-12 bottom-0 h-[30vh] ${cel.ridgeNear} ${cel.inked}`}>
        <path d="M0 300 L0 190 L150 190 L176 140 L330 140 L360 214 L700 214 L724 160 L880 160 L910 220 L1200 220 L1200 300 Z" fill={CEL.dune} />
        <path d="M300 140 L330 140 L360 214 L330 214 Z M850 160 L880 160 L910 220 L880 220 Z" fill={CEL.duneShade} data-bare />
        <path d="M300 140 L330 140 L360 214 L330 214 Z M850 160 L880 160 L910 220 L880 220 Z" fill={HATCH} opacity={0.45} data-bare />
        <path d="M60 250 L80 236 L100 250 M480 262 L494 248 L510 262 M1010 256 L1030 240 L1048 256" fill="none" stroke={CEL.scrub} strokeWidth={6} data-bare />
      </svg>

      <div className={`absolute inset-0 bg-[var(--cel-night)] ${cel.duskShade}`} />
    </div>
  )
}
