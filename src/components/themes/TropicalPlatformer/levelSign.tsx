import type { ReactNode } from 'react'
import look from './jungle.module.css'

// Every section opens like a level opens: its name on a wooden sign nailed to a post planted in a fern,
// standing over the level's scene. The heading carries the id its region is named by.

export function LevelSign({ id, title }: { id: string; title: string }) {
  return (
    <div className="flex flex-col items-center">
      <h2 id={id} className={`relative z-10 rounded-xl px-6 py-3 text-2xl uppercase text-[color:var(--tp-bark-dark)] sm:px-8 sm:text-3xl ${look.plank} ${look.plankText} ${look.display}`}>
        {title}
      </h2>
      <span className={`-mt-1 block h-8 w-3 rounded-b ${look.post}`} aria-hidden="true" />
      <svg viewBox="-60 -50 120 54" className="-mt-5 h-9 w-20" aria-hidden="true" focusable="false">
        <use href="#tp-fern" transform="scale(0.75)" />
      </svg>
    </div>
  )
}

/** The dark wooden board the cards are read on. */
export function Board({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-3xl p-6 sm:p-8 ${look.board} ${className}`}>{children}</div>
}
