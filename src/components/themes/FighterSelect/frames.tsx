import type { ReactNode } from 'react'
import look from './world.module.css'

// The arcade cabinet panel every section sits in: brushed metal, a glowing border in the section's
// accent, a bolt in each corner, the screen glass inside, and a title bar with its arcade button.

export type Accent = 'p1' | 'p2' | 'gold' | 'cyan' | 'health'

export const ACCENT: Record<Accent, string> = {
  p1: look.accentP1,
  p2: look.accentP2,
  gold: look.accentGold,
  cyan: look.accentCyan,
  health: look.accentHealth,
}

const BOLTS = ['left-2 top-2', 'right-2 top-2', 'bottom-2 left-2', 'bottom-2 right-2']

function CabinetFrame({ accent, children }: { accent: Accent; children: ReactNode }) {
  return (
    <div className={`relative rounded ${look.metal} ${look.frame} ${ACCENT[accent]}`}>
      {BOLTS.map((place) => (
        <span key={place} className={`absolute z-20 h-4 w-4 rounded-full ${look.bolt} ${place}`} aria-hidden="true" />
      ))}
      <div className={`pointer-events-none absolute inset-0 ${look.screen}`} aria-hidden="true" />
      <div className="relative">{children}</div>
    </div>
  )
}

interface ArcadePanelProps {
  accent: Accent
  title?: string
  id?: string
  children: ReactNode
}

export function ArcadePanel({ accent, title, id, children }: ArcadePanelProps) {
  return (
    <section aria-labelledby={id} className="relative mb-10">
      <CabinetFrame accent={accent}>
        {title && (
          <div className={`flex items-center gap-4 px-5 py-4 sm:px-8 ${look.titleBar}`}>
            <span className={`h-9 w-9 shrink-0 rounded-full ${look.buttonCap}`} aria-hidden="true" />
            <h2 id={id} className={`text-xl uppercase sm:text-2xl ${look.display} ${look.titleText}`}>
              {title}
            </h2>
          </div>
        )}
        <div className="p-5 sm:p-8">{children}</div>
      </CabinetFrame>
    </section>
  )
}

// The cabinet frame alone, for the header and the contact panel.
export function CabinetPanel({ accent, children }: { accent: Accent; children: ReactNode }) {
  return (
    <CabinetFrame accent={accent}>
      <div className="p-5 sm:p-8">{children}</div>
    </CabinetFrame>
  )
}
