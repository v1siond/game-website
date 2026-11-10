'use client'

import { useCallback } from 'react'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import type { Profession } from '@/lib/cv/professions'
import { CVLink, HeroActions } from './buttons'
import { buildPodium } from './podium'
import { useSceneWindow } from './world'
import css from './portals.module.css'

// The contact as the hub's curved save monitor: the title, the line and the actions in the monitor's green
// on dark glass, him beside it on a pad throwing the ta da once (podium.ts).

function Podium({ profession }: { profession: Profession }) {
  const make = useCallback(() => buildPodium(profession), [profession])
  const ref = useSceneWindow<HTMLDivElement>(make)
  return <div ref={ref} className="aspect-[3/4] w-40 shrink-0 sm:w-48" aria-hidden="true" />
}

export function SaveMonitor({ profession }: { profession: Profession }) {
  const { sections } = useLabels()

  return (
    <section id="contact" aria-labelledby="np-contact" className="relative z-10 scroll-mt-20 px-4 py-16 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 md:flex-row md:items-end">
        <Podium profession={profession} />
        <RecruiterHero
          render={({ line, actions }) => (
            <div className={`w-full p-6 md:p-10 ${css.monitor}`}>
              <h2 id="np-contact" className={`text-4xl ${css.display} ${css.screenText}`}>
                {sections.contact}
              </h2>
              <p className="mt-4 text-lg text-[color:var(--np-white)]">{line}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <HeroActions actions={actions} />
                <CVLink />
              </div>
            </div>
          )}
        />
      </div>
    </section>
  )
}
