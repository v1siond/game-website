import type { ReactNode } from 'react'
import { ATOMIC_YELLOW, SHELTER_BLUE_DARK } from './palette'
import { AtomSymbol, RadiationSymbol, Starburst } from './icons'
import world from './world.module.css'

// The section panels: the phosphor screen, the shelter blue panel, the rusted steel panel and the worn
// document. Each is a labelled section whose title is the section's own.

interface PanelProps {
  children: ReactNode
  title: string
}

// The screen's corner brackets, each turned to its corner.
const BRACKETS = ['top-2 left-2', 'top-2 right-2 rotate-90', 'bottom-2 left-2 -rotate-90', 'bottom-2 right-2 rotate-180']

export function PhosphorFrame({ children, title }: PanelProps) {
  return (
    <section className={`relative overflow-hidden rounded-lg ${world.phosphorScreen}`} aria-label={title}>
      <div className={`absolute inset-0 rounded-lg border-[3px] border-[#14FF00] ${world.screenFrame}`} aria-hidden="true" />
      {BRACKETS.map((place) => (
        <div key={place} className={`absolute h-4 w-4 border-l-2 border-t-2 border-[#14FF00] ${place}`} aria-hidden="true" />
      ))}

      <div className="absolute -top-px left-6 flex items-center gap-2 bg-[#0a0a08] px-4 py-1">
        <span className="font-mono text-sm text-[#10CC00]" aria-hidden="true">
          &gt;&gt;
        </span>
        <h2 className={`font-mono text-sm font-bold uppercase tracking-[0.3em] text-[#14FF00] ${world.glowGreenSoft}`}>{title}</h2>
        <span className="font-mono text-sm text-[#10CC00]" aria-hidden="true">
          &lt;&lt;
        </span>
      </div>

      <div className="relative px-6 pb-6 pt-8">{children}</div>
    </section>
  )
}

export function ShelterPanel({ children, title }: PanelProps) {
  return (
    <section className={`relative overflow-hidden ${world.shelterBlue}`} aria-label={title}>
      <div className={`absolute inset-0 border-[3px] border-[#FFD700] ${world.shelterFrame}`} aria-hidden="true" />

      <div className={`relative flex items-center justify-center gap-4 border-b-2 border-[#004499] py-3 ${world.yellowBar}`}>
        <AtomSymbol size={28} color={SHELTER_BLUE_DARK} />
        <h2 className="font-mono text-sm font-bold uppercase tracking-[0.4em] text-[#004499]">{title}</h2>
        <AtomSymbol size={28} color={SHELTER_BLUE_DARK} />
      </div>

      <div className="relative px-6 py-6">{children}</div>
    </section>
  )
}

const RIVETS = ['top-1 left-1', 'top-1 right-1', 'bottom-1 left-1', 'bottom-1 right-1']

export function RustedPanel({ children, title }: PanelProps) {
  return (
    <section className={`relative overflow-hidden ${world.rust}`} aria-label={title}>
      <div className={`absolute inset-0 border-[3px] border-[#B7410E] ${world.rustFrame}`} aria-hidden="true" />
      {RIVETS.map((place) => (
        <div key={place} className={`absolute h-4 w-4 rounded-full border-2 border-[#8B3A0E] ${world.rivet} ${place}`} aria-hidden="true" />
      ))}

      <div className={`absolute -top-3 left-8 flex items-center gap-2 border-2 border-[#FFD700] px-4 py-1 ${world.hazard}`}>
        <RadiationSymbol size={14} color={ATOMIC_YELLOW} />
        <h2 className={`font-mono text-sm font-bold uppercase tracking-[0.25em] text-[#FFD700] ${world.glowYellow}`}>{title}</h2>
      </div>

      <div className="relative px-6 pb-6 pt-10">{children}</div>
    </section>
  )
}

export function WornDocumentPanel({ children, title }: PanelProps) {
  return (
    <section className={`relative overflow-hidden ${world.wornPaper}`} aria-label={title}>
      <div className={`absolute inset-0 border-2 border-[#6B5344] ${world.paperFrame}`} aria-hidden="true" />

      <div className="relative border-b border-[#6B5344] px-6 pb-2 pt-4">
        <div className="flex items-center gap-3">
          <span className="inline-block -rotate-6" aria-hidden="true">
            <Starburst size={20} color={ATOMIC_YELLOW} />
          </span>
          <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-[#A3A38C]">{title}</h2>
        </div>
      </div>

      <div className="relative px-6 py-4">{children}</div>
    </section>
  )
}
