import type { ReactNode } from 'react'
import { CallText } from './badges'
import look from './world.module.css'

// The arcade screen every section sits in: the monitor's black, a thin rule in the section's accent and a
// hard black drop, opened by a HUD strip that carries the section title in the round call lettering and
// a full life bar running out to the edge, the way a fight screen opens with its HUD across the top.

export type Accent = 'p1' | 'p2' | 'gold' | 'cyan' | 'health'

export const ACCENT: Record<Accent, string> = {
  p1: look.accentP1,
  p2: look.accentP2,
  gold: look.accentGold,
  cyan: look.accentCyan,
  health: look.accentHealth,
}

function Screen({ accent, children }: { accent: Accent; children: ReactNode }) {
  return <div className={`relative ${look.screen} ${ACCENT[accent]}`}>{children}</div>
}

interface ArcadePanelProps {
  accent: Accent
  title?: string
  id?: string
  children: ReactNode
}

export function ArcadePanel({ accent, title, id, children }: ArcadePanelProps) {
  return (
    <section aria-labelledby={id} className="relative mb-12">
      <Screen accent={accent}>
        {title && (
          <div className={`flex items-center gap-4 px-4 py-3 sm:px-8 ${look.hudStrip}`}>
            <h2 id={id} className="min-w-0 text-[clamp(1.375rem,5vw,2rem)] uppercase leading-tight">
              <CallText>{title}</CallText>
            </h2>
            <span className="hidden h-3 flex-1 border-2 border-black bg-[color:var(--fs-hud-yellow)] shadow-[0_0_0_1px_#fff] sm:block" aria-hidden="true" />
          </div>
        )}
        <div className="p-4 sm:p-8">{children}</div>
      </Screen>
    </section>
  )
}

// The screen alone, for the contact panel.
export function ScreenPanel({ accent, children }: { accent: Accent; children: ReactNode }) {
  return (
    <Screen accent={accent}>
      <div className="p-4 sm:p-8">{children}</div>
    </Screen>
  )
}
