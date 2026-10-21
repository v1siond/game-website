'use client'

import type { ReactNode } from 'react'
import type { SectionsOf } from '@/lib/cv/cvView'
import { fillLabel } from '@/lib/cv/labels'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { headingId, newTabName } from '@/components/cv/sectionText'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import { Braindance } from './braindance'
import { Gigs } from './gigs'
import { Radio } from './radio'
import { FightRecord } from './record'
import { DataChip, HudPanel } from './hud'
import { Scannable } from './scanner'
import world from './world.module.css'

// Neon Cyber's sections per profession. The System Engineer reads the bio, the braindance of his work
// (./braindance), the tech stack as the deck's loaded programs, the gigs with their breach
// (./gigs) and the ventures; the Musician tunes the radio (./radio); the Martial Artist opens the data
// tab and its toasts (./record). The plain panels fade in through the shared FadeInScene; the
// interactive ones play their own entrance.

function Block({ children }: { children: ReactNode }) {
  return <div className="relative z-20 mb-10">{children}</div>
}

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()
  const { sections: titles, cards, links } = useLabels()

  return (
    <>
      <FadeInScene>
        <HudPanel title={titles.about}>
          <p className="max-w-3xl text-base leading-relaxed text-[color:var(--neon-ice)]">{professionalSummary.bio}</p>
        </HudPanel>
      </FadeInScene>

      {sections.jobs.length > 0 && (
        <Block>
          <Braindance jobs={sections.jobs} />
        </Block>
      )}

      <FadeInScene>
        <HudPanel title={titles.techStack}>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sections.techStack.map((category) => (
              <section key={category.id} aria-labelledby={headingId('nc-tech', category.name)}>
                <h3 id={headingId('nc-tech', category.name)} className="mb-2 text-sm uppercase tracking-wider text-[color:var(--neon-hud)]">
                  {category.name}
                </h3>
                <ul className="flex flex-wrap gap-1" aria-label={fillLabel(cards.categoryTechnologies, { name: category.name })}>
                  {category.items.map((tech) => (
                    <DataChip key={tech}>{tech}</DataChip>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </HudPanel>
      </FadeInScene>

      {sections.projects.length > 0 && (
        <Block>
          <Gigs projects={sections.projects} />
        </Block>
      )}

      {sections.companies.length > 0 && (
        <FadeInScene>
          <HudPanel title={titles.ventures}>
            <ul className="grid gap-5 md:grid-cols-3">
              {sections.companies.map((company) => (
                <li key={company.id}>
                  <Scannable kind="use" title={titles.ventures} fact={company.tagline}>
                    <a
                      href={company.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={newTabName(links, `${company.name}: ${company.tagline}. ${company.description}`)}
                      className={`${world.cut} block border border-[color-mix(in_srgb,var(--neon-use)_40%,transparent)] bg-[color:var(--neon-glass)] p-4 hover:border-[color:var(--neon-use)]`}
                    >
                      <span className="block text-base text-[color:var(--neon-ice)]">{company.name}</span>
                      <span className="mt-1 block text-sm text-[color:var(--neon-use)]">{company.tagline}</span>
                      <span className="mt-2 block text-sm text-[color:var(--neon-ice)]">{company.description}</span>
                    </a>
                  </Scannable>
                </li>
              ))}
            </ul>
          </HudPanel>
        </FadeInScene>
      )}
    </>
  )
}

export function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  return (
    <Block>
      <Radio musician={sections.musician} bands={sections.bands} />
    </Block>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  return (
    <Block>
      <FightRecord martialArts={sections.martialArts} />
    </Block>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}
