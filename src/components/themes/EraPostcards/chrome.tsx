'use client'

import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ContactLink, useSiteLinks } from '@/components/cv/SiteLinks'
import { cssVars } from '@/lib/cssVars'
import { SCENE_DEFS, lookVars, type Scene } from './scenes'
import { ACTION_CLASS } from './hero'
import { Stage } from './stage'
import css from './page.module.css'

// The pieces round the gates: the ledger at the top (his initials, a link back to the top), the rail of
// gates on the right (the engine marks the current one) and the beacon at the end, the contact.

/** His initials, the ledger's mark: the first letter of each word of his name. */
const initialsOf = (name: string): string =>
  name
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .join('')

export function Ledger() {
  const { fullName } = useCVData()
  return (
    <header className={css.ledger}>
      <a className={css.brand} href={`#${SCENE_DEFS.hero.anchor}`}>
        <span aria-hidden="true">{initialsOf(fullName)}</span>
        <span className="sr-only">{fullName}</span>
      </a>
    </header>
  )
}

const railTitle = (scene: Scene, sections: ReturnType<typeof useLabels>['sections']): string =>
  scene.slot ? sections[scene.slot.titleKey] : sections.contact

export function Rail({ scenes }: { scenes: readonly Scene[] }) {
  const { hud, sections } = useLabels()
  return (
    <nav className={css.rail} aria-label={hud.sectionTabs}>
      <ul>
        {scenes
          .filter((scene) => scene.id !== 'hero')
          .map((scene) => (
            <li key={scene.id}>
              <a href={`#${scene.anchor}`} data-rail={scene.id}>
                <span>{railTitle(scene, sections)}</span>
              </a>
            </li>
          ))}
      </ul>
    </nav>
  )
}

export function Beacon({ scene, still }: { scene: Scene; still: boolean }) {
  const { sections } = useLabels()
  const { cv } = useSiteLinks()
  return (
    <section id={scene.anchor} data-scene="contact" aria-labelledby="era-contact" className={css.beacon} style={cssVars(lookVars(scene.look))}>
      {still && <Stage scene={scene} settled />}
      <RecruiterHero
        render={({ name, line, actions }) => (
          <div className={css.beaconCopy}>
            <h2 id="era-contact" className={`${css.display} ${css.title}`}>
              {sections.contact}
            </h2>
            <p className={css.beaconLine}>{line}</p>
            <p className={css.actions}>
              {actions.map((slot) => (
                <ContactLink key={slot.id} slot={slot} className={ACTION_CLASS[slot.id]} />
              ))}
              <ContactLink slot={cv} className={css.pill} />
            </p>
            <p className={css.sign}>{name}</p>
          </div>
        )}
      />
    </section>
  )
}
