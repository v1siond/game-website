import { memo } from 'react'
import type { ProfessionOption } from '@/components/cv/ProfessionSwitch'
import type { Profession } from '@/lib/cv/professions'
import { DiamondIcon, GearIcon, WaveIcon } from '@/components/themes/shared/professionIcons'
import { GOW } from './palette'

// =============================================================================
// WAYSTATION NODE (Profession selector)
// The switch lays the waystations out Musician, System Engineer, Martial Artist; the engineer one
// is the raised centre of the path.
// =============================================================================
const WAYSTATIONS: Record<Profession, { icon: React.ReactNode; sublabel: string; color: string; position: string }> = {
  drummer: { icon: <WaveIcon />, sublabel: 'Drums', color: GOW.fire, position: 'left-[25%] top-[55%]' },
  engineer: { icon: <GearIcon />, sublabel: 'Software', color: GOW.gold, position: 'left-1/2 top-[35%]' },
  fighter: { icon: <DiamondIcon />, sublabel: 'Muay Thai', color: GOW.bloodBright, position: 'left-[75%] top-[55%]' },
}

export const WaystationNode = memo(function WaystationNode({ option }: { option: ProfessionOption }) {
  const { id, label, selected: isActive, optionProps } = option
  const { icon, sublabel, color, position } = WAYSTATIONS[id]

  return (
    <button
      type="button"
      {...optionProps}
      className={`absolute ${position} transform -translate-x-1/2 -translate-y-1/2 group min-w-[70px] md:min-w-[100px] min-h-[70px] md:min-h-[100px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c040] focus-visible:ring-offset-2 focus-visible:ring-offset-black`}
    >
      <div
        className={`absolute inset-0 transition-all duration-500 ${
          isActive ? 'opacity-50 scale-110' : 'opacity-0 scale-100 group-hover:opacity-30 group-hover:scale-105'
        }`}
        style={{
          background: `radial-gradient(ellipse, ${color}60 0%, ${color}30 40%, transparent 70%)`,
        }}
        aria-hidden="true"
      />
      <div
        className={`relative w-24 h-20 md:w-32 md:h-28 flex flex-col items-center justify-center transition-all duration-300 ${
          isActive ? 'scale-110' : 'group-hover:scale-105'
        }`}
        style={{
          background: `linear-gradient(180deg,
            rgba(10, 10, 12, 0.92) 0%,
            rgba(15, 13, 20, 0.88) 50%,
            rgba(10, 10, 12, 0.92) 100%
          )`,
          border: `1px solid ${isActive ? color : GOW.gold}30`,
          borderRadius: '2px',
          backdropFilter: 'blur(4px)',
          boxShadow: isActive
            ? `inset 0 0 20px rgba(0, 0, 0, 0.4), 0 0 15px ${color}40`
            : `inset 0 0 20px rgba(0, 0, 0, 0.4), 0 2px 10px rgba(0, 0, 0, 0.3)`,
        }}
        aria-hidden="true"
      >
        <div className="mb-0.5 md:mb-1 scale-75 md:scale-100" style={{ color: isActive ? color : GOW.silver }}>
          {icon}
        </div>
        <span
          className="text-sm tracking-[0.05em] md:tracking-[0.1em] uppercase font-medium text-center leading-tight"
          style={{ color: isActive ? color : GOW.silver }}
        >
          {label}
        </span>
        <span
          className="text-sm tracking-wider opacity-80 text-center leading-tight hidden md:block"
          style={{ color: isActive ? color : GOW.silver }}
        >
          {sublabel}
        </span>
      </div>
    </button>
  )
})
