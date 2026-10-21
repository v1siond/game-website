import type { ReactNode } from 'react'
import { RE } from './palette'

// The paper panel every section sits on; `texture` picks its stains.
export function PaperPanel({ label, texture, children }: { label: string; texture: string; children: ReactNode }) {
  return (
    <section
      aria-label={label}
      className="p-6 mb-8 relative overflow-hidden"
      style={{ background: `${RE.sepia}f0`, border: `2px solid ${RE.midBrown}`, backgroundImage: texture }}
    >
      {children}
    </section>
  )
}

export const PANEL_HEADING = 'text-sm tracking-[0.3em] mb-4 uppercase text-[#c49050]'
