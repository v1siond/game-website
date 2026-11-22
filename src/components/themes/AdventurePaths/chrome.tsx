'use client'

import type { Ref } from 'react'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { Stage } from '../shared/theatre/Stage'
import { ContactSigns } from './actions'
import { JOURNAL_SERIF } from './palette'
import { LAYER_MOTION, type TrailScene } from './scenes'
import page from './page.module.css'

// The pieces round the levels: the HUD bar at the top of the screen (the level the page is in and how many
// of its things he has done, both written by the theatre's lead callback) and the goal at the end, the
// contact, under the flagpole run.

/** His initials, the HUD's mark: the first letter of each word of his name. */
const initialsOf = (name: string): string =>
  name
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .join('')

export function Hud({ placeRef, countRef, anchor }: { placeRef: Ref<HTMLSpanElement>; countRef: Ref<HTMLSpanElement>; anchor: string }) {
  const { trail } = useLabels()
  const { fullName } = useCVData()
  return (
    <header className={page.hud}>
      <a className={`${page.brand} ${JOURNAL_SERIF}`} href={`#${anchor}`}>
        <span aria-hidden="true">{initialsOf(fullName)}</span>
        <span className="sr-only">{fullName}</span>
      </a>
      <p className={page.hudText}>
        <span ref={placeRef}>{trail.placeHero}</span>
        <span ref={countRef} className={page.hudCount} />
      </p>
    </header>
  )
}

export function Goal({ scene, still }: { scene: TrailScene; still: boolean }) {
  const { sections, trail } = useLabels()
  return (
    <section id={scene.anchor} data-scene={scene.id} aria-labelledby="trail-contact" className={page.goal}>
      {still && <Stage scene={scene} layers={scene.layers} motion={LAYER_MOTION} settled className={page.scrim} />}
      <RecruiterHero
        render={({ line, actions }) => (
          <div className={page.goalCopy}>
            <p className={page.place}>{trail[scene.place]}</p>
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
