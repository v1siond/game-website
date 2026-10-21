import type { ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { PROFESSION_ORDER, type Profession } from '@/lib/cv/professions'
import { HeroCharacter } from './character'
import { RestPoint } from './art'
import world from './world.module.css'

// The profession switch drawn as the world map: each profession is a zone, a room with him inside in
// that zone's costume, joined to its neighbours by glowing paths. The picked zone is lit with its rest
// point under it, a zone already visited stays drawn, one never visited waits under fog. The small map
// in the corner repeats the same three rooms.

export type ZoneState = 'lit' | 'explored' | 'fogged'

// Each zone's accent, as a literal class so the build generates all three.
const ZONE_ACCENT: Record<Profession, string> = {
  drummer: '[--zone:var(--soul-rose)]',
  engineer: '[--zone:var(--soul-moss)]',
  fighter: '[--zone:var(--soul-ember)]',
}

const ZONE_LOOK: Record<ZoneState, { room: string; figure: string }> = {
  lit: { room: world.zoneLit, figure: 'opacity-100' },
  explored: { room: `${world.zoneExplored} hover:border-[var(--soul-glow-deep)]`, figure: 'opacity-70' },
  fogged: { room: `${world.zoneFogged} hover:border-[var(--soul-rock-light)]`, figure: 'opacity-30' },
}

export const zoneState = (selected: boolean, explored: boolean): ZoneState => {
  if (selected) return 'lit'
  return explored ? 'explored' : 'fogged'
}

// The path to the next zone on the map, drawn from each zone but the last.
const hasPathRight = (id: Profession) => PROFESSION_ORDER.indexOf(id) < PROFESSION_ORDER.length - 1

export function ZoneNode({ option, state }: { option: ProfessionOption; state: ZoneState }) {
  const { id, label, optionProps } = option
  const look = ZONE_LOOK[state]

  return (
    <button type="button" {...optionProps} className={`relative w-full sm:w-44 ${ZONE_ACCENT[id]}`}>
      {hasPathRight(id) && <span className={`absolute -right-3 top-1/2 hidden h-[3px] w-3 sm:-right-8 sm:block sm:w-8 ${world.zonePath}`} aria-hidden="true" />}
      <span className={`relative flex flex-col items-center px-2 pb-3 pt-2 ${look.room}`}>
        <HeroCharacter profession={id} className={`h-20 w-14 sm:h-28 sm:w-20 ${look.figure}`} />
        <span className={`mt-1 block text-sm uppercase leading-tight text-[var(--soul-text)] ${world.lettering}`}>{label}</span>
      </span>
      {state === 'lit' && <RestPoint className="absolute -bottom-7 left-1/2 h-8 w-8 -translate-x-1/2" />}
    </button>
  )
}

const HUD_CELL: Record<ZoneState, string> = {
  lit: 'bg-[var(--soul-lantern)] border-[var(--soul-lantern)]',
  explored: 'bg-[var(--soul-glow-deep)] border-[var(--soul-glow)]',
  fogged: 'bg-[var(--soul-abyss)] border-[var(--soul-rock)] border-dashed',
}

// The corner map: the three zones in the switch's order, the current one lit.
export function ZoneHud({ stateOf }: { stateOf: (id: Profession) => ZoneState }) {
  return (
    <div className={`fixed bottom-4 right-4 z-30 hidden items-center p-2 sm:flex ${world.room}`} aria-hidden="true">
      {PROFESSION_ORDER.map((id, i) => (
        <span key={id} className="flex items-center">
          {i > 0 && <span className={`block h-[2px] w-3 ${world.zonePath}`} />}
          <span className={`block h-4 w-5 border ${HUD_CELL[stateOf(id)]}`} />
        </span>
      ))}
    </div>
  )
}
