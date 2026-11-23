'use client'

import { useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { ImpactBurst } from './badges'
import fight from './fight.module.css'

// The projects take hits under the pointer: every card the pointer lands on freezes and vibrates for the
// hitstop and a burst flashes where the pointer entered. React renders only on a hit: the burst's position
// goes to CSS variables on the card, the burst itself is a keyed one shot animation, and the shake restarts
// its class on the card's own element, so the card (and a focused link in it) stays mounted.

// Plays the shake again from its first frame: the class comes off, a layout read ends the running
// animation, and the class goes back on.
function replayShake(element: HTMLElement) {
  element.classList.remove(fight.hitShake)
  void element.offsetWidth
  element.classList.add(fight.hitShake)
}

export function HitCard({ children }: { children: ReactNode }) {
  const [hit, setHit] = useState(0)
  const shaken = useRef<HTMLDivElement>(null)

  const onPointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--hx', `${event.clientX - box.left}px`)
    event.currentTarget.style.setProperty('--hy', `${event.clientY - box.top}px`)
    if (shaken.current) replayShake(shaken.current)
    setHit((count) => count + 1)
  }

  return (
    <div onPointerEnter={onPointerEnter} className="relative">
      <div ref={shaken}>{children}</div>
      {hit > 0 && (
        <span key={hit} className={`pointer-events-none absolute left-[var(--hx)] top-[var(--hy)] z-10 ${fight.spark}`} aria-hidden="true">
          <ImpactBurst className="h-20 w-20" />
        </span>
      )}
    </div>
  )
}
