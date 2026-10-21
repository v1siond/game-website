'use client'

import type { ReactNode } from 'react'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { headingId } from '@/components/cv/sectionText'
import { useReachLevel } from './hud'
import { Backdrop, type SceneKind } from './scenery'
import look from './jungle.module.css'
import sign from './levelSign.module.css'

// Every section opens like a level of the source opens: its name on a wooden sign nailed to a post
// planted in a fern, dropping in and swinging to rest when the section scrolls in (data-on from the
// shared trigger, once). The level stands in its own scene (scenery.tsx), bled out to the screen's edges
// behind it. A banana bunch hangs by the sign; when the level scrolls in it is collected (it pops away)
// and the counter in the corner counts the level. The heading carries the id its region is named by.

interface LevelProps {
  title: string
  scene: SceneKind
  children: ReactNode
}

export function Level({ title, scene, children }: LevelProps) {
  const { ref, triggered } = useSectionTrigger({ threshold: 0.1 })
  const id = headingId('jungle', title)
  useReachLevel(id, triggered)

  return (
    <section ref={ref} data-on={triggered || undefined} aria-labelledby={id} className={`relative isolate ${sign.level}`}>
      <Backdrop kind={scene} placement="bleed" />
      <div className="mb-10 flex flex-col items-center">
        <div className="relative">
          <h2 id={id} className={`relative z-10 rounded-xl px-6 py-3 text-2xl uppercase text-[color:var(--tp-sun-gold)] sm:px-8 sm:text-3xl ${look.plank} ${look.display} ${look.outlined} ${sign.sign}`}>
            {title}
          </h2>
          <svg viewBox="-24 -26 48 48" className={`absolute -right-7 top-1/2 z-20 h-9 w-9 -translate-y-1/2 sm:-right-10 sm:h-11 sm:w-11 ${sign.bunch}`} aria-hidden="true" focusable="false">
            <use href="#tp-bunch" />
          </svg>
        </div>
        <span className={`-mt-1 block h-8 w-3 rounded-b ${sign.post}`} aria-hidden="true" />
        <svg viewBox="-60 -50 120 54" className="-mt-5 h-9 w-20" aria-hidden="true" focusable="false">
          <use href="#tp-fern" transform="scale(0.75)" />
        </svg>
      </div>
      {children}
    </section>
  )
}

/** The dark wooden board the short sections are read on. */
export function Board({ children }: { children: ReactNode }) {
  return <div className={`rounded-3xl p-6 sm:p-8 ${look.board}`}>{children}</div>
}
