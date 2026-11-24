'use client'

import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { useSiteLinks } from '@/components/cv/SiteLinks'
import { initialsOf } from '@/lib/cv/nameWords'
import { Stage } from '../shared/theatre/Stage'
import { InkStamp } from './backdrop'
import { NoirLink } from './actions'
import { LAYER_MOTION, type NoirScene } from './scenes'
import page from './page.module.css'

// The page's fixed case bar and its end. The bar is an ink strip across the top with its red rule and his
// initials on a paper tag, the way back to the top. The end is a typed index card from the case's box, his
// line and the ways to reach him on it, stamped in red ink, over the captain's desk where the case closes.

/** The case bar: his initials, back to the top of the page. */
export function CaseBar({ anchor }: { anchor: string }) {
  const { fullName } = useCVData()
  return (
    <header className={page.hud}>
      <a href={`#${anchor}`} className={page.brand}>
        <span aria-hidden="true">{initialsOf(fullName)}</span>
        <span className="sr-only">{fullName}</span>
      </a>
    </header>
  )
}

/** The end of the page: the typed index card, over the captain's desk. */
export function IndexCardContact({ scene, still }: { scene: NoirScene; still: boolean }) {
  const { sections } = useLabels()
  const { cv } = useSiteLinks()
  return (
    <section id={scene.anchor} data-scene={scene.id} aria-labelledby="noir-contact" className={page.goal}>
      {still && <Stage scene={scene} layers={scene.layers} motion={LAYER_MOTION} settled className={page.scrim} />}
      <div className={page.goalCopy}>
        <RecruiterHero
          render={({ line, actions }) => (
            <div className={`relative px-6 pb-10 pt-12 sm:px-10 ${page.indexCard} ${page.delivered}`}>
              <InkStamp className="absolute -right-5 -top-8 h-20 w-20 -rotate-12" />
              <h2 id="noir-contact" className={`mb-4 text-3xl uppercase sm:text-4xl ${page.typed}`}>
                {sections.contact}
              </h2>
              <p className={`mb-8 text-base text-[color:var(--noir-ink)] ${page.copy}`}>{line}</p>
              <nav className="flex flex-col gap-4 sm:flex-row sm:flex-wrap" aria-label={sections.contact}>
                {[...actions, cv].map((slot) => (
                  <span key={slot.id} className={`inline-block ${page.kick}`}>
                    <NoirLink slot={slot} onPaper />
                  </span>
                ))}
              </nav>
            </div>
          )}
        />
      </div>
    </section>
  )
}
