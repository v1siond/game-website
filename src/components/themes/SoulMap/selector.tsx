import type { ProfessionOption } from '@/components/cv/ProfessionSwitch'
import type { Profession } from '@/lib/cv/professions'
import { COLORS } from './palette'
import { Bonfire, SwordMarker } from './art'

// Zone/Room node on the map - Dark Souls bonfire style
type Direction = 'up' | 'down' | 'left' | 'right'

// Each zone keeps its own colour, a short plain sublabel and the stone paths to its neighbours. The
// switch lays the zones out Musician, System Engineer, Martial Artist, so the engineer zone is the hub.
export const ZONES: Record<Profession, { color: string; description: string; connections: Direction[] }> = {
  drummer: { color: '#9966ff', description: 'Drums', connections: ['right'] },
  engineer: { color: COLORS.bonfire, description: 'Software', connections: ['left', 'right'] },
  fighter: { color: '#ff4444', description: 'Muay Thai', connections: ['left'] },
}

export const CONNECTION_PLACEMENT: Record<Direction, string> = {
  up: '-top-[30px] left-1/2 w-[3px] h-[30px] -translate-x-1/2',
  down: '-bottom-[30px] left-1/2 w-[3px] h-[30px] -translate-x-1/2',
  left: '-left-[30px] top-1/2 w-[30px] h-[3px] -translate-y-1/2',
  right: '-right-[30px] top-1/2 w-[30px] h-[3px] -translate-y-1/2',
}

export function ZoneNode({ option, isExplored }: { option: ProfessionOption; isExplored: boolean }) {
  const { id, label, selected: isActive, optionProps } = option
  const zone = ZONES[id]

  return (
    <button
      type="button"
      {...optionProps}
      className={`relative transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6a00] ${
        isActive ? 'scale-110 z-20' : 'hover:scale-105 opacity-80 hover:opacity-100'
      }`}
    >
      {/* Connection lines - ancient stone paths */}
      {zone.connections.map((direction) => (
        <div
          key={direction}
          className={`absolute ${CONNECTION_PLACEMENT[direction]}`}
          style={{
            background: `linear-gradient(${direction === 'left' || direction === 'right' ? '90deg' : '180deg'}, transparent, ${COLORS.ash}80, transparent)`,
          }}
          aria-hidden="true"
        />
      ))}

      {/* Zone container - gothic stone frame */}
      <div
        className="w-36 h-24 flex flex-col items-center justify-center relative"
        style={{
          background: isActive
            ? `radial-gradient(ellipse at 50% 80%, ${zone.color}30, ${COLORS.stone} 70%)`
            : isExplored
            ? `linear-gradient(180deg, ${COLORS.stone}, #151015)`
            : '#0a0808',
          border: `2px solid ${isActive ? zone.color : isExplored ? '#2a2025' : '#151015'}`,
          boxShadow: isActive
            ? `0 0 40px ${zone.color}30, inset 0 0 30px ${zone.color}15`
            : 'inset 0 0 20px rgba(0,0,0,0.5)',
        }}
        aria-hidden="true"
      >
        {/* Mini bonfire when active */}
        {isActive && (
          <div className="absolute -top-8">
            <Bonfire size="small" />
          </div>
        )}

        {/* Zone icon - sword marker when not active */}
        {!isActive && isExplored && (
          <div className="absolute -top-10 scale-50">
            <SwordMarker />
          </div>
        )}

        <span
          className="text-sm tracking-[0.15em] font-bold mt-2 uppercase text-center leading-tight"
          style={{ color: isActive ? zone.color : '#8a8070' }}
        >
          {label}
        </span>
        <span className="text-sm tracking-wider mt-1" style={{ color: isActive ? '#bbb' : '#777' }}>
          {zone.description}
        </span>
      </div>

      {/* Rest at bonfire prompt */}
      {isActive && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap" aria-hidden="true">
          <span className="text-sm tracking-widest animate-pulse" style={{ color: `${COLORS.bonfire}80` }}>
            BONFIRE LIT
          </span>
        </div>
      )}
    </button>
  )
}

// Mini-map component - Dark Souls style. The middle row is the zone row: Musician, System Engineer,
// Martial Artist, the order the switch lays them out.
export const MINI_MAP_CELL: Record<Profession, number> = { drummer: 3, engineer: 4, fighter: 5 }
export const MINI_MAP_AREAS = ['', '', '', 'Musician', 'System Engineer', 'Martial Artist', '', '', '']

export function MiniMap({ active }: { active: Profession }) {
  const currentCell = MINI_MAP_CELL[active]

  return (
    <div
      className="fixed bottom-6 right-6 p-3 z-30"
      style={{
        background: `linear-gradient(180deg, ${COLORS.stone}ee, #05050899)`,
        border: `2px solid ${COLORS.ash}`,
        boxShadow: '0 0 20px rgba(0,0,0,0.8)',
      }}
      aria-hidden="true"
    >
      <div className="text-sm tracking-widest mb-2 text-center" style={{ color: '#888070' }}>
        LORDRAN
      </div>
      <div className="grid grid-cols-3 gap-1">
        {MINI_MAP_AREAS.map((area, cell) => {
          const isCurrent = cell === currentCell
          return (
            <div
              key={cell}
              title={area || undefined}
              className="w-4 h-4 relative"
              style={{
                background: isCurrent
                  ? `radial-gradient(circle, ${COLORS.bonfire}, ${COLORS.darksign}80)`
                  : '#1a1815',
                boxShadow: isCurrent ? `0 0 10px ${COLORS.bonfire}60` : 'none',
                border: `1px solid ${COLORS.ash}`,
              }}
            >
              {isCurrent && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
