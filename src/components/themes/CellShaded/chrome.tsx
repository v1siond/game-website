'use client'

import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { initialsOf } from '@/lib/cv/nameWords'
import { Stage } from '../shared/theatre/Stage'
import { ContactActions } from './buttons'
import { LAYER_MOTION, type CelScene } from './scenes'
import { SectionTitle } from './sections'
import cel from './cel.module.css'
import page from './page.module.css'

// The page's fixed top bar and its end. The bar is an ink strip with his initials in the sun lettering,
// the way back to the top. The end is the station at night: the contact panel with his line in the sun
// lettering and the ways to reach him, over the pad that builds him.

/** The top bar: his initials, back to the top of the page. */
export function TopBar({ anchor }: { anchor: string }) {
  const { fullName } = useCVData()
  return (
    <header className={page.hud}>
      <a href={`#${anchor}`} className={`${page.brand} ${cel.display}`}>
        <span aria-hidden="true">{initialsOf(fullName)}</span>
        <span className="sr-only">{fullName}</span>
      </a>
    </header>
  )
}

/** The end of the page: the contact panel, over the station that builds him. */
export function StationContact({ scene, still }: { scene: CelScene; still: boolean }) {
  const { sections } = useLabels()
  const { contact } = useCVData()
  return (
    <section id={scene.anchor} data-scene={scene.id} aria-labelledby="cel-contact" className={page.goal}>
      {still && <Stage scene={scene} layers={scene.layers} motion={LAYER_MOTION} settled className={page.scrim} />}
      <div className={page.goalCopy}>
        <SectionTitle id="cel-contact" title={sections.contact} />
        <div className={`mt-8 p-5 sm:p-8 ${cel.darkPaper}`}>
          <p className={`text-2xl text-[var(--cel-sun)] sm:text-3xl ${cel.display}`}>{contact.line}</p>
          <RecruiterHero
            render={({ actions }) => (
              <nav className="mt-6 flex flex-wrap gap-3" aria-label={sections.contact}>
                <ContactActions actions={actions} />
              </nav>
            )}
          />
        </div>
      </div>
    </section>
  )
}
