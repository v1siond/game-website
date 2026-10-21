'use client'

import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { newTabName } from '@/components/cv/sectionText'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import { fillLabel } from '@/lib/cv/labels'
import { FortressTrail } from './fortresses'
import { JourneyRegion } from './journey'
import { PAPER_CARD, Region } from './region'
import { StarRoad } from './starRoad'
import { SwitchPalaces } from './switches'
import { JOURNAL_SERIF } from './palette'

// Each profession's regions of the map, and only those. About, Tech Stack and Ventures are journal pages
// that fade in; Experience is the region he walks, Projects the switch palaces, Bands the star road and
// the Muay Thai record the fortresses (their own files).

function AboutPage() {
  const { professionalSummary } = useCVData()
  const { sections } = useLabels()
  return (
    <FadeInScene>
      <Region title={sections.about}>
        <p className={`max-w-3xl text-lg leading-relaxed text-[color:var(--ap-parchment)] ${JOURNAL_SERIF}`}>{professionalSummary.bio}</p>
      </Region>
    </FadeInScene>
  )
}

/** The tech stack as the explorer's pack: one pouch per category, its tools as stamped blocks. */
function PackPage({ categories }: { categories: SectionsOf<'engineer'>['techStack'] }) {
  const { sections, cards } = useLabels()
  return (
    <FadeInScene>
      <Region title={sections.techStack}>
        <ul className={MASONRY_LIST} aria-label={cards.techByCategory}>
          {categories.map((category) => (
            <li key={category.id} className={`${MASONRY_ITEM} ${PAPER_CARD}`}>
              <h3 className={`text-lg font-bold ${JOURNAL_SERIF}`}>{category.name}</h3>
              <ul className="mt-2 flex flex-wrap gap-1.5" aria-label={fillLabel(cards.categoryTechnologies, { name: category.name })}>
                {category.items.map((item) => (
                  <li key={item} className="rounded-sm border-2 border-[color:var(--ap-ink)] bg-[color:var(--ap-parchment)] px-2 py-0.5 text-sm font-semibold">
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Region>
    </FadeInScene>
  )
}

/** The ventures as camps marked on the map, each a flag and its card. */
function CampsPage({ companies }: { companies: SectionsOf<'engineer'>['companies'] }) {
  const { sections, links } = useLabels()
  return (
    <FadeInScene>
      <Region title={sections.ventures}>
        <ul className="grid gap-6 md:grid-cols-3">
          {companies.map((company) => (
            <li key={company.id}>
              <a
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={newTabName(links, `${company.name}: ${company.tagline}`)}
                className="block h-full transition-transform hover:-translate-y-1 motion-reduce:transition-none"
              >
                <article className={`${PAPER_CARD} h-full border-t-8 border-t-[color:var(--ap-route)]`}>
                  <h3 className={`text-lg font-bold ${JOURNAL_SERIF}`}>{company.name}</h3>
                  <p className="text-sm font-semibold text-[color:var(--ap-route)]">{company.tagline}</p>
                  <p className="mt-2 text-sm text-[color:var(--ap-ink-soft)]">{company.description}</p>
                </article>
              </a>
            </li>
          ))}
        </ul>
      </Region>
    </FadeInScene>
  )
}

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  return (
    <>
      <AboutPage />
      {sections.jobs.length > 0 && <JourneyRegion jobs={sections.jobs} profession="engineer" />}
      <PackPage categories={sections.techStack} />
      <SwitchPalaces projects={sections.projects} />
      <CampsPage companies={sections.companies} />
    </>
  )
}

export function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  return <StarRoad bands={sections.bands} musician={sections.musician} />
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  return <FortressTrail martialArts={sections.martialArts} />
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}
