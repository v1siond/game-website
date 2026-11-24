'use client'

import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { initialsOf } from '@/lib/cv/nameWords'
import { Stage } from '../shared/theatre/Stage'
import { ContactButtons } from './links'
import { CARVED } from './palette'
import { LAYER_MOTION, type SoulScene } from './scenes'
import { SectionTitle } from './sections'
import page from './page.module.css'

// The page's fixed top bar and its end. The bar is a black strip with his initials in carved gold capitals,
// the way back to the top. The end is the last fire: the contact panel with his line and the ways to
// reach him, beside the fire he kindles.

/** The top bar: his initials, back to the top of the page. */
export function TopBar({ anchor }: { anchor: string }) {
  const { fullName } = useCVData()
  return (
    <header className={page.hud}>
      <a href={`#${anchor}`} className={`${page.brand} ${CARVED}`}>
        <span aria-hidden="true">{initialsOf(fullName)}</span>
        <span className="sr-only">{fullName}</span>
      </a>
    </header>
  )
}

/** The end of the page: the contact panel at the last fire. */
export function LastFireContact({ scene, still }: { scene: SoulScene; still: boolean }) {
  const { sections } = useLabels()
  const { contact } = useCVData()
  return (
    <section id={scene.anchor} data-scene={scene.id} aria-labelledby="soul-contact" className={page.goal}>
      {still && <Stage scene={scene} layers={scene.layers} motion={LAYER_MOTION} settled />}
      <div className={page.goalCopy}>
        <SectionTitle id="soul-contact" title={sections.contact} />
        <div className={`mt-8 p-5 sm:p-8 ${page.panel}`}>
          <p className={`${CARVED} text-xl tracking-wide text-[color:var(--soul-glow)] sm:text-2xl`}>{contact.line}</p>
          <RecruiterHero
            render={({ actions }) => (
              <nav className="mt-6 flex flex-wrap gap-3" aria-label={sections.contact}>
                <ContactButtons actions={actions} />
              </nav>
            )}
          />
        </div>
      </div>
    </section>
  )
}
