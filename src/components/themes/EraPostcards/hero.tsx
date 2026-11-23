'use client'

import { useLabels } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ContactLink } from '@/components/cv/SiteLinks'
import Wardrobe, { type WardrobeLook } from '@/components/worlds/Wardrobe'
import type { Profession } from '@/lib/cv/professions'
import { cssVars } from '@/lib/cssVars'
import { PAGE } from './palette'
import { SCENE_DEFS, lookVars, type Scene } from './scenes'
import { Stage } from './stage'
import css from './page.module.css'

// The hub: his name, the headline, the tagline, the contact line and his two actions over the Chronoport's
// picture, then the three professions as portal pads. Every profession is on this one page, so a pad is a
// link down to the first gate of its wing. He stands in the picture under the ring; his outfit plate sits
// beside him. The copy stands on two plates, his name and headline, then the rest, so on a phone the
// picture shows him between them. Under reduced motion the hub's picture sits still behind the hero.

const OUTFIT: WardrobeLook = { plate: PAGE.night, text: PAGE.chalk, ring: PAGE.portal }

const PADS: ReadonlyArray<{ id: Profession; anchor: string; className: string }> = [
  { id: 'engineer', anchor: SCENE_DEFS.about.anchor, className: css.padEngineer },
  { id: 'drummer', anchor: SCENE_DEFS.bands.anchor, className: css.padDrummer },
  { id: 'fighter', anchor: SCENE_DEFS.muayThai.anchor, className: css.padFighter },
]

/** His two actions' looks, the email filled and LinkedIn outlined, in the hero and at the beacon. */
export const ACTION_CLASS = { email: `${css.pill} ${css.pillSolid}`, linkedin: css.pill } as const

export function HubHero({ scene, still }: { scene: Scene; still: boolean }) {
  const { navigation, professions, professionFields } = useLabels()

  return (
    <section id={scene.anchor} data-scene="hero" data-worlds-hero="" aria-labelledby="era-hero" className={css.hero} style={cssVars(lookVars(scene.look))}>
      {still && <Stage scene={scene} settled />}
      <RecruiterHero
        render={({ name, headline, tagline, line, actions }) => (
          <div className={css.heroCopy}>
            <div className={css.heroPlate}>
              <h1 id="era-hero" className={`${css.display} ${css.name}`}>
                {name}
              </h1>
              <p className={css.headline}>{headline}</p>
            </div>
            <div className={css.heroPlate}>
              <p className={css.tagline}>{tagline}</p>
              <p className={css.line}>{line}</p>
              <p className={css.actions}>
                {actions.map((slot) => (
                  <ContactLink key={slot.id} slot={slot} className={ACTION_CLASS[slot.id]} />
                ))}
              </p>
              <nav className={css.pads} aria-labelledby="era-pads">
                <p id="era-pads" className={css.padsTitle}>
                  {navigation.selectYourProfession}
                </p>
                <ul>
                  {PADS.map(({ id, anchor, className }) => (
                    <li key={id}>
                      <a className={`${css.pad} ${className}`} href={`#${anchor}`}>
                        <strong>{professions[id]}</strong>
                        <span>{professionFields[id]}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        )}
      />
      <Wardrobe look={OUTFIT} className={css.wardrobe} />
    </section>
  )
}
