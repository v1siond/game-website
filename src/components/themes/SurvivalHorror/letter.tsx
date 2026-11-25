'use client'

import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { ContactPlates } from './actions'
import { PANEL_HEADING, PANEL_SIDE, sectionHeadingId } from './panels'
import type { Scene } from './scenes'
import { SurvivorStage } from './stage'
import look from './world.module.css'

// Contact as a letter left by the door of the lit room, which he runs through and shuts the pursuer out of
// behind the page (./scenes): his line typed on the paper, the ways to reach him under it. Under reduced
// motion the door's picture sits still behind it.

const HEADING = sectionHeadingId('Contact')

export function Letter({ scene, still }: { scene: Scene; still: boolean }) {
  const { sections } = useLabels()

  return (
    <section data-scene="contact" aria-labelledby={HEADING} className="relative px-4 pb-[110svh] motion-reduce:pb-16 sm:px-6 lg:px-[4vw]">
      {still && <SurvivorStage scene={scene} settled />}
      <div className="min-h-[80svh] motion-reduce:min-h-[70svh] max-md:min-h-[130svh]" aria-hidden="true" />
      <div className={`relative p-4 sm:p-6 lg:w-[min(42rem,46vw)] ${PANEL_SIDE[scene.layout.side]} ${look.panel}`}>
        <h2 id={HEADING} className={PANEL_HEADING}>
          {sections.contact}
        </h2>
        <RecruiterHero
          render={({ line, actions }) => (
            <>
              <p className={`bg-[color:var(--sh-ivory)] p-4 text-base text-[color:var(--sh-void)] ${look.typed}`}>{line}</p>
              <nav className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap" aria-label={sections.contact}>
                <ContactPlates actions={actions} sites={['cv']} />
              </nav>
            </>
          )}
        />
      </div>
    </section>
  )
}
