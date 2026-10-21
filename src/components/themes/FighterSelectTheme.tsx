'use client'

import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { ArcadePanel, CabinetPanel } from './FighterSelect/frames'
import { ClashEmblem, RoundCall } from './FighterSelect/badges'
import { FighterPortrait } from './FighterSelect/selector'
import { ControlPanel } from './FighterSelect/footer'
import { CVLink, HeroAction, PortfolioLink } from './FighterSelect/actions'
import { SECTION_VIEWS } from './FighterSelect/sections'
import { ContactScene } from './FighterSelect/scenes'
import look from './FighterSelect/world.module.css'

// Fighter Select, an arcade fighting game's select screen and its stages: the page composition. Its
// palette, cabinet frames, versus art, portraits, cards, his costume, the stages and the scroll scenes
// live in ./FighterSelect.
//
// The root clips sideways overflow with overflow-x: clip, not hidden: hidden would make the root a
// scroll container and stop the scenes' level strips from sticking to the viewport.

export default function FighterSelectTheme() {
  const { active, config } = useProfession()
  const view = useWorldView()

  return (
    <div className={`relative min-h-screen overflow-x-clip ${look.root}`}>
      <div className={`pointer-events-none fixed inset-0 z-0 ${look.glow}`} aria-hidden="true" />
      <div className={`pointer-events-none fixed inset-0 z-0 ${look.scanlines}`} aria-hidden="true" />
      <div className={`pointer-events-none fixed inset-0 z-0 ${look.vignette}`} aria-hidden="true" />

      <div className="relative z-10">
        {/* Header - the recruiter first screen, the title screen of the cabinet */}
        <header className="relative px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto max-w-6xl">
            <CabinetPanel accent="p1">
              <RecruiterHero
                render={({ name, headline, tagline, line, actions }) => (
                  <div className="flex flex-col items-start justify-between gap-6 lg:flex-row">
                    <div className="min-w-0">
                      <h1 className={`break-words text-3xl uppercase leading-tight md:text-5xl ${look.display} ${look.marquee}`}>{name}</h1>
                      <p className="mt-4 max-w-2xl text-base md:text-lg">{headline}</p>
                      <p className="mt-2 text-sm italic text-[color:var(--fs-cyan)] md:text-base">{tagline}</p>
                      <p className="mt-2 text-sm">{line}</p>
                    </div>

                    <nav className="flex shrink-0 flex-wrap items-center gap-3 sm:gap-4" aria-label="Contact and CV">
                      {actions.map((action) => (
                        <HeroAction key={action.id} action={action} />
                      ))}
                      <CVLink />
                      <PortfolioLink />
                    </nav>
                  </div>
                )}
              />
            </CabinetPanel>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* The select grid: the shared profession switch, System Engineer in the centre and picked */}
          <ArcadePanel accent="cyan">
            <ProfessionSwitch
              className="mb-6 grid grid-cols-3 gap-2 pt-4 md:flex md:items-center md:justify-center md:gap-0"
              label="Profession"
              renderOption={(option) => (
                <>
                  {option.id !== 'drummer' && (
                    <div className="mx-2 hidden md:block lg:mx-4" aria-hidden="true">
                      <ClashEmblem />
                    </div>
                  )}
                  <FighterPortrait {...option} />
                </>
              )}
            />
            <RoundCall text={config.title} />
          </ArcadePanel>

          <div role="region" aria-label={`${active} profession details`}>
            <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
          </div>
        </main>

        <ContactScene profession={active} />

        <ControlPanel />
      </div>
    </div>
  )
}
