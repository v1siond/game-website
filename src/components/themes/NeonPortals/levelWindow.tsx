'use client'

import { useCallback, type CSSProperties, type ReactNode } from 'react'
import { headingId } from '@/lib/cv/sectionText'
import type { Profession } from '@/lib/cv/professions'
import type { Era } from './eras'
import { buildLevel, type Ending } from './level'
import { ERA_COLOURS } from './palette'
import { useSceneWindow, useWorldEngine } from './world'
import css from './portals.module.css'

// One section as a level: its window onto the era (the run, level.ts), the section title as the level name on
// a dark band over the top of the window with the level's number dome, and the CV under it on panels. The
// window is 4 by 3 on a phone and 21 by 9 from md up, the two shapes run.ts frames.

interface LevelProps {
  number: number
  title: string
  era: Era
  ending: Ending
  profession: Profession
  crates?: number
  children: ReactNode
}

function LevelWindow({ era, ending, profession, crates }: Pick<LevelProps, 'era' | 'ending' | 'profession' | 'crates'>) {
  const make = useCallback(() => buildLevel({ era, ending, profession, crates }), [era, ending, profession, crates])
  const ref = useSceneWindow<HTMLDivElement>(make)
  const { engine } = useWorldEngine()
  const sky = ERA_COLOURS[era]

  return (
    <div
      ref={ref}
      className={`aspect-[4/3] w-full md:aspect-[21/9] ${css.window}`}
      style={{ '--np-sky-top': sky.skyTop, '--np-sky-low': sky.skyLow } as CSSProperties}
      data-live={engine ? '' : undefined}
      aria-hidden="true"
    />
  )
}

export function Level({ number, title, era, ending, profession, crates, children }: LevelProps) {
  const id = headingId('np', title)

  return (
    <section aria-labelledby={id} className="relative mb-20 scroll-mt-8">
      <div className="relative mb-6">
        <LevelWindow era={era} ending={ending} profession={profession} crates={crates} />
        <h2 id={id} className={`text-2xl sm:text-3xl ${css.levelName}`}>
          <span className={`text-lg ${css.dome}`} aria-hidden="true">
            {number}
          </span>
          <span className={`${css.display} ${css.levelText}`}>{title}</span>
        </h2>
      </div>
      {children}
    </section>
  )
}
