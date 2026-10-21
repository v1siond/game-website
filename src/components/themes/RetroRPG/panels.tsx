import type { ReactNode } from 'react'
import { PIXEL } from './palette'
import world from './world.module.css'

// Retro RPG's panels: the dialogue window every block of text sits in, and the small title window that
// names a section, its gold cursor pointing at it the way a menu points at the picked command.

export function Window({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`relative p-4 sm:p-5 ${world.window} ${className}`}>{children}</div>
}

export function SectionHeader({ title }: { title: string }) {
  return (
    <div className={`mb-4 inline-flex items-center gap-2 px-3 py-2 ${world.window}`}>
      <span className="text-sm text-[color:var(--rpg-gold)]" aria-hidden="true">
        ▶
      </span>
      <h2 className={`text-sm uppercase tracking-[0.15em] text-[color:var(--rpg-text)] ${PIXEL}`}>{title}</h2>
    </div>
  )
}
