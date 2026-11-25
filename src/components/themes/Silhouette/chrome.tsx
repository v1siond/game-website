'use client'

import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { initialsOf } from '@/lib/cv/nameWords'
import { Stage } from '../shared/theatre/Stage'
import { ContactButtons } from './actions'
import { TYPEWRITER } from './palette'
import { LAYER_MOTION, SIDE_CLASS, type ShadeScene } from './scenes'
import { SectionTitle } from './sections'
import page from './page.module.css'

// The page's fixed top bar and its end. The bar is a black strip with his initials in typewriter type, the
// way back to the top. The end is the clearing: the contact panel with his line and the ways to reach him,
// where he sits down in the light.

// Under his line at the end: the hero's actions, the CV, and Enter into the engine.
const END_SITES = ['cv', 'engine'] as const

/** The top bar: his initials, back to the top of the page. */
export function TopBar({ anchor }: { anchor: string }) {
  const { fullName } = useCVData()
  return (
    <header className={page.hud}>
      <a href={`#${anchor}`} className={`${page.brand} ${TYPEWRITER}`}>
        <span aria-hidden="true">{initialsOf(fullName)}</span>
        <span className="sr-only">{fullName}</span>
      </a>
    </header>
  )
}

/** The end of the page: the contact panel in the clearing. */
export function ClearingContact({ scene, still }: { scene: ShadeScene; still: boolean }) {
  const { sections } = useLabels()
  const { contact } = useCVData()
  return (
    <section id={scene.anchor} data-scene={scene.id} aria-labelledby="sh-contact" className={`${page.goal} ${SIDE_CLASS[scene.side]}`}>
      {still && <Stage scene={scene} layers={scene.layers} motion={LAYER_MOTION} settled />}
      <div className={page.goalCopy}>
        <SectionTitle id="sh-contact" title={sections.contact} />
        <div className={`mt-8 border-l-4 border-[color:var(--sh-black)] p-5 sm:p-8 ${page.panel}`}>
          <p className={`text-lg tracking-wider text-[color:var(--sh-heading)] sm:text-xl ${TYPEWRITER}`}>{contact.line}</p>
          <RecruiterHero
            render={({ actions }) => (
              <nav className="mt-6 flex flex-wrap gap-3" aria-label={sections.contact}>
                <ContactButtons actions={actions} sites={END_SITES} />
              </nav>
            )}
          />
        </div>
      </div>
    </section>
  )
}
