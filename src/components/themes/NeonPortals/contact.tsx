'use client'

import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import type { Profession } from '@/lib/cv/professions'
import { CVLink, HeroActions } from './actions'
import { Crystal, StonePad } from './art'
import { HeroCharacter } from './character'
import { PORTAL } from './palette'
import world from './world.module.css'

// Contact as the end of the level: the crystal on its pedestal. When the section scrolls in he hops up
// onto the platform, the crystal rises off the pedestal and turns, the light ring opens under it, then
// the panel with the actions slides up beside it. The crystal tilts toward the pointer (--mx, --my).
//
// Pattern: CSS only off one trigger (useSectionTrigger's data-on), each phase a delay: the hop 0 to
// 500 ms, the crystal rise 400 to 1100 ms, the ring 900 ms, the panel 1100 ms; afterwards only the
// crystal's slow turn loops. Reduced motion and a preview show the last frame.

export function CrystalExit({ profession }: { profession: Profession }) {
  const { sections } = useLabels()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.25 })

  return (
    <section ref={ref} data-on={triggered || undefined} aria-labelledby="np-contact" className={`relative z-20 px-4 py-16 sm:px-6 ${world.exit}`}>
      <div className="mx-auto grid max-w-5xl items-end gap-8 rounded-[2rem] border-4 border-[color:var(--np-stone-dark)] bg-[color:var(--np-chamber)] p-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:p-10">
        <div className="relative mx-auto h-64 w-56" aria-hidden="true">
          <div className={`absolute bottom-0 left-1/2 h-16 w-56 -translate-x-1/2 ${world.exitRing}`}>
            <StonePad glow={PORTAL.CRYSTAL} className="h-full w-full" />
          </div>
          <div className={`absolute bottom-10 left-1/2 h-36 w-16 -translate-x-1/2 ${world.crystalRise}`}>
            <div className={`h-full w-full ${world.crystalTilt}`}>
              <Crystal className={`h-full w-full ${world.crystalTurn}`} />
            </div>
          </div>
          <div className={`absolute bottom-6 left-0 h-28 w-[4.5rem] ${world.exitHop}`}>
            <HeroCharacter profession={profession} className="h-full w-full" />
          </div>
        </div>
        <RecruiterHero
          render={({ line, actions }) => (
            <div className={world.exitPanel}>
              <h2 id="np-contact" className={`text-4xl ${world.display}`}>
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
