'use client'

import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { initialsOf } from '@/lib/cv/nameWords'
import { Stage } from '../shared/theatre/Stage'
import { ContactSigns } from './actions'
import { JOURNAL_SERIF } from './palette'
import { LAYER_MOTION, type TrailScene } from './scenes'
import page from './page.module.css'

// The pieces round the levels: the HUD bar at the top of the screen (his initials, back to the top) and
// the goal at the end, the contact, under the run through the finish gate.

export function Hud({ anchor }: { anchor: string }) {
  const { fullName } = useCVData()
  return (
    <header className={page.hud}>
      <a className={`${page.brand} ${JOURNAL_SERIF}`} href={`#${anchor}`}>
        <span aria-hidden="true">{initialsOf(fullName)}</span>
        <span className="sr-only">{fullName}</span>
      </a>
    </header>
  )
}

export function Goal({ scene, still }: { scene: TrailScene; still: boolean }) {
  const { sections } = useLabels()
  return (
    <section id={scene.anchor} data-scene={scene.id} aria-labelledby="trail-contact" className={page.goal}>
      {still && <Stage scene={scene} layers={scene.layers} motion={LAYER_MOTION} settled className={page.scrim} />}
      <RecruiterHero
        render={({ line, actions }) => (
          <div className={page.goalCopy}>
            <h2 id="trail-contact" className={`${page.title} ${JOURNAL_SERIF}`}>
              {sections.contact}
            </h2>
            <div className="mt-6 rounded-md border-4 border-double border-white bg-[color:var(--ap-hud)] p-5 text-white sm:p-6">
              <p className="mb-5 text-base">{line}</p>
              <div className="flex flex-wrap gap-3">
                <ContactSigns actions={actions} />
              </div>
            </div>
          </div>
        )}
      />
    </section>
  )
}
