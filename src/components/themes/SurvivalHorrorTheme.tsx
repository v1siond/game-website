'use client'

import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { fillLabel } from '@/lib/cv/labels'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { SH_VARS } from './SurvivalHorror/palette'
import { HouseBackdrop } from './SurvivalHorror/backdrop'
import { InkRibbon, Typewriter } from './SurvivalHorror/art'
import { ItemSlot } from './SurvivalHorror/selector'
import { CVLink, HeroAction, PortfolioLink } from './SurvivalHorror/actions'
import { SECTION_VIEWS } from './SurvivalHorror/sections'
import { ContactScene } from './SurvivalHorror/scenes'
import look from './SurvivalHorror/world.module.css'

// Survival Horror, an old house at night in the survival horror way (fixed camera rooms, one lamp at a
// time, fog, the save room with its typewriter and item box, doors between rooms): the page
// composition. Its palette, the room behind the page, the save room art, the item box slots, the cards,
// his clothes, the stages and the scroll scenes live in ./SurvivalHorror.
//
// The root clips sideways overflow with overflow-x: clip, not hidden: hidden would make the root a
// scroll container and stop the scenes' level strips from sticking to the viewport. The palette's CSS
// variables are the root's only inline style.

const EMPTY_SLOTS = [1, 2, 3, 4, 5]

export default function SurvivalHorrorTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const { navigation, professions } = useLabels()

  return (
    <div className={`relative min-h-screen overflow-x-clip ${look.root}`} style={SH_VARS}>
      <HouseBackdrop />

      <div className="relative z-10">
        {/* Header - the recruiter first screen, typed on the save room's paper */}
        <header className="px-4 pb-6 pt-10 sm:px-6">
          <RecruiterHero
            render={({ name, headline, tagline, line, actions }) => (
              <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-6">
                <div className="min-w-0">
                  <h1 className="break-words text-2xl uppercase tracking-[0.15em] text-[color:var(--sh-ivory)] md:text-4xl">{name}</h1>
                  <p className="mt-3 text-base text-[color:var(--sh-fog)]">{headline}</p>
                  <p className={`mt-2 text-sm italic text-[color:var(--sh-brass)] ${look.typed}`}>{tagline}</p>
                  <p className="mt-2 text-sm text-[color:var(--sh-cream)]">{line}</p>
                </div>

                <nav className="flex flex-wrap items-center gap-3" aria-label={navigation.contactAndCv}>
                  {actions.map((action) => (
                    <HeroAction key={action.id} action={action} />
                  ))}
                  <CVLink />
                  <PortfolioLink />
                </nav>
              </div>
            )}
          />
        </header>

        <main className="px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-4xl">
            {/* The item box: the shared profession switch, one item per profession */}
            <div className={`mx-auto mb-8 max-w-xl p-4 sm:p-6 ${look.panel}`}>
              <ProfessionSwitch className="grid grid-cols-3 gap-3" label={navigation.profession} renderOption={(option) => <ItemSlot option={option} />} />
              <div className="mt-3 grid grid-cols-5 gap-3" aria-hidden="true">
                {EMPTY_SLOTS.map((slot) => (
                  <div key={slot} className={`h-10 sm:h-14 ${look.emptySlot}`} />
                ))}
              </div>
            </div>

            <div role="region" aria-label={fillLabel(navigation.professionDetails, { profession: professions[active] })}>
              <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
            </div>
          </div>
        </main>

        <ContactScene profession={active} />

        {/* Footer - the typewriter at rest between its ink ribbons */}
        <footer className="flex items-center justify-center gap-4 py-12" aria-hidden="true">
          <InkRibbon />
          <Typewriter className="h-20 w-28 opacity-70" />
          <InkRibbon />
        </footer>
      </div>
    </div>
  )
}
