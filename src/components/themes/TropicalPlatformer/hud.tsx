'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import look from './jungle.module.css'
import hud from './hud.module.css'

// The source's counter in the top left corner: a banana bunch and the count beside it in chunky gold
// numerals. Here every level (section) carries a bunch beside its sign, collected when the level scrolls
// in, and the counter counts the levels reached. As in the source, the counter rolls in when a bunch is
// collected and, on a phone, rolls out again after a moment so it never sits over the text; from md up
// it stays. The top right belongs to the worlds launcher. Decoration: the sections themselves carry
// the content, so the counter is hidden from screen readers.
//
// Pattern: one context at the world's root; a level reports itself once with useReachLevel.

const ReachContext = createContext<(level: string) => void>(() => undefined)

/** Reports a level as reached once its section has scrolled in. */
export function useReachLevel(level: string, reached: boolean) {
  const reach = useContext(ReachContext)
  useEffect(() => {
    if (!reached) return
    reach(level)
  }, [level, reached, reach])
}

function BananaCounter({ count }: { count: number }) {
  if (count === 0) return null

  return (
    <div className={`pointer-events-none fixed left-3 top-3 z-40 md:left-4 md:top-4 ${hud.counter}`} aria-hidden="true">
      <div key={count} className={`flex items-center gap-1 ${hud.roll}`}>
        <svg viewBox="-24 -26 48 48" className="h-10 w-10 drop-shadow-[0_2px_0_rgb(0_0_0/0.6)]" focusable="false">
          <use href="#tp-bunch" />
        </svg>
        <span className={`text-3xl text-[color:var(--tp-sun-gold)] ${look.display} ${look.outlined} ${hud.count}`}>{count}</span>
      </div>
    </div>
  )
}

export function HudProvider({ children }: { children: ReactNode }) {
  const [reached, setReached] = useState<ReadonlySet<string>>(() => new Set())
  const reach = useCallback((level: string) => {
    setReached((current) => (current.has(level) ? current : new Set(current).add(level)))
  }, [])

  return (
    <ReachContext.Provider value={reach}>
      {children}
      <BananaCounter count={reached.size} />
    </ReachContext.Provider>
  )
}
