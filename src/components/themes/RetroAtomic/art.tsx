import { ATOMIC_YELLOW, ATOMIC_YELLOW_DIM, PHOSPHOR_GREEN } from './palette'
import { AtomSymbol, RadiationSymbol, Rocket, ShelterHatch, Starburst, TownSkyline } from './icons'
import world from './world.module.css'

// The art separators between sections, all atomic age and all decoration: the shelter hatch between
// two atoms, the town skyline at dusk, the rocket between two starbursts.

const TREFOILS = [0, 1, 2, 3, 4]
const STARS = [0, 1, 2, 3, 4, 5, 6]

export function ShelterArt() {
  return (
    <div className="flex flex-col items-center gap-4 py-12" aria-hidden="true">
      <div className="flex items-center gap-6">
        <AtomSymbol size={56} color={ATOMIC_YELLOW} />
        <ShelterHatch size={80} />
        <AtomSymbol size={56} color={ATOMIC_YELLOW} />
      </div>
      <div className="flex items-center gap-4">
        {TREFOILS.map((i) => (
          <RadiationSymbol key={i} size={16} color={ATOMIC_YELLOW_DIM} />
        ))}
      </div>
    </div>
  )
}

export function SkylineArt() {
  return (
    <div className="py-8" aria-hidden="true">
      <TownSkyline />
      <div className="relative z-10 -mt-8 flex items-center justify-center gap-6">
        <AtomSymbol size={40} color={PHOSPHOR_GREEN} />
        <Starburst size={28} color={ATOMIC_YELLOW} />
        <AtomSymbol size={40} color={PHOSPHOR_GREEN} />
      </div>
    </div>
  )
}

export function RocketArt() {
  return (
    <div className={`flex flex-col items-center gap-4 py-10 ${world.rocketBand}`} aria-hidden="true">
      <div className="flex items-center gap-8">
        <Starburst size={44} color={ATOMIC_YELLOW} />
        <Rocket size={80} />
        <Starburst size={44} color={ATOMIC_YELLOW} />
      </div>
      <div className="flex items-center gap-3">
        {STARS.map((i) => (
          <Starburst key={i} size={14} color={ATOMIC_YELLOW_DIM} />
        ))}
      </div>
    </div>
  )
}
