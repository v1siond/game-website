'use client'

import type { ReactNode } from 'react'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { BandList } from '@/components/cv/BandList'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { drumsSince, headingId, newTabName } from '@/components/cv/sectionText'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import type { CVData } from '@/lib/cv/content'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { BossRound } from './bossRound'
import { CrateArt } from './crateArt'
import { CrateField } from './crateField'
import { Crystal, Gem, Relic } from './pickups'
import { useScore } from './score'
import { BandTrial } from './timeTrial'
import { LevelPortal } from './warpLevels'
import ui from './warped.module.css'

// The picked profession's sections, each one played the time travel platformer's way (Warped, named in
// code only): the jobs are the warp room's level portals with a crystal each (warpLevels.tsx), the
// projects a field of crates of every kind (crateField.tsx), the bands time trials for relics
// (timeTrial.tsx), Muay Thai a boss round that hands over powers (bossRound.tsx). About, Tech Stack
// (laid out like the pause screen's inventory panels) and Ventures take the plain fade. A stage plays
// once when it scrolls in (useSectionTrigger's data-on); the long lists are masonry.

const ICON = {
  crystal: <Crystal className="h-full w-full" />,
  crate: <CrateArt kind="wood" className="h-full w-full" />,
  relic: <Relic className="h-full w-full" />,
  gem: <Gem className="h-full w-full" tone="violet" />,
} as const

function SectionTitle({ title, icon }: { title: string; icon?: keyof typeof ICON }) {
  return (
    <h2 id={headingId('np', title)} className={`mb-6 flex items-center gap-3 text-3xl sm:text-4xl ${ui.display}`}>
      {icon && (
        <span className={ui.sectionIcon} aria-hidden="true">
          {ICON[icon]}
        </span>
      )}
      {title}
    </h2>
  )
}

function Stage({ title, icon, children }: { title: string; icon: keyof typeof ICON; children: ReactNode }) {
  const { ref, triggered } = useSectionTrigger()

  return (
    <section ref={ref} data-on={triggered || undefined} aria-labelledby={headingId('np', title)} className={`relative mb-20 ${ui.stage}`}>
      <SectionTitle title={title} icon={icon} />
      {children}
    </section>
  )
}

function Plain({ title, children }: { title: string; children: ReactNode }) {
  return (
    <FadeInScene>
      <section aria-labelledby={headingId('np', title)} className="mb-20">
        <SectionTitle title={title} />
        {children}
      </section>
    </FadeInScene>
  )
}

const HINT = 'mb-6 text-base text-[color:var(--np-muted)]'

function TechStack({ categories }: { categories: CVData['techStack'] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <li key={category.id} className={`${ui.panel} p-5`}>
          <h3 className={`mb-3 flex items-center gap-2 text-base uppercase tracking-wide text-[color:var(--np-teal)] ${ui.chunk}`}>
            <span aria-hidden="true">{category.icon}</span>
            {category.name}
          </h3>
          <ul className="grid grid-cols-2 gap-1.5">
            {category.items.map((tech) => (
              <li key={tech} className="rounded-md border-2 border-[color:var(--np-plate)] bg-[color:var(--np-void)] px-2 py-1 text-sm text-[color:var(--np-white)]">
                {tech}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}

function Ventures({ companies }: { companies: CVData['companies'] }) {
  const { links } = useLabels()
  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {companies.map((company) => (
        <li key={company.id}>
          <a
            href={company.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={newTabName(links, `${company.name}: ${company.tagline}`)}
            className={`block h-full p-5 focus:outline-none ${ui.panel}`}
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">
                {company.icon}
              </span>
              <span>
                <span className={`block text-xl ${ui.display}`}>{company.name}</span>
                <span className="block text-sm text-[color:var(--np-gold)]">{company.tagline}</span>
              </span>
            </span>
            <span className="mt-3 block text-base text-[color:var(--np-white)]">{company.description}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

function EngineerLevels({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()
  const labels = useLabels()

  return (
    <>
      <Plain title={labels.sections.about}>
        <p className={`${ui.panel} max-w-3xl p-6 text-lg leading-relaxed text-[color:var(--np-white)]`}>{professionalSummary.bio}</p>
      </Plain>

      {sections.jobs.length > 0 && (
        <Stage title={labels.sections.workExperience} icon="crystal">
          <p className={HINT}>{labels.warp.levelHint}</p>
          <ul className={MASONRY_LIST}>
            {sections.jobs.map((entry, index) => (
              <li key={entry.id} className={MASONRY_ITEM}>
                <LevelPortal entry={entry} index={index} />
              </li>
            ))}
          </ul>
        </Stage>
      )}

      <Plain title={labels.sections.techStack}>
        <TechStack categories={sections.techStack} />
      </Plain>

      <Stage title={labels.sections.projects} icon="crate">
        <CrateField projects={sections.projects} />
      </Stage>

      <Plain title={labels.sections.ventures}>
        <Ventures companies={sections.companies} />
      </Plain>
    </>
  )
}

/** The gem over the bands once every time trial is won. */
function RelicGem() {
  const { score } = useScore()
  const { relics } = score.counts
  if (score.totals.relics === 0 || relics < score.totals.relics) return null
  return (
    <span className={`block h-12 w-10 ${ui.award}`} aria-hidden="true">
      <Gem className="h-full w-full" tone="gold" />
    </span>
  )
}

function MusicianLevels({ sections }: { sections: SectionsOf<'drummer'> }) {
  const labels = useLabels()
  const { musician, bands } = sections

  return (
    <Stage title={labels.sections.bands} icon="relic">
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <p className="text-lg font-bold text-[color:var(--np-gold)]">{drumsSince(musician, labels.years)}</p>
        <RelicGem />
      </div>
      <p className={HINT}>{labels.warp.trialHint}</p>
      <BandList
        bands={bands}
        className={MASONRY_LIST}
        itemClassName={MASONRY_ITEM}
        renderBand={(slot) => <BandTrial slot={slot} index={bands.indexOf(slot.band)} />}
      />
      <p className="mt-2 text-base italic text-[color:var(--np-muted)]">{musician.line}</p>
    </Stage>
  )
}

function MartialArtistLevels({ sections }: { sections: SectionsOf<'fighter'> }) {
  const labels = useLabels()
  const { martialArts } = sections

  return (
    <Stage title={labels.sections.muayThai} icon="gem">
      <h3 className={`mb-5 text-2xl ${ui.display}`}>{martialArts.primary.title}</h3>
      <BossRound martialArts={martialArts} />
    </Stage>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerLevels,
  drummer: MusicianLevels,
  fighter: MartialArtistLevels,
}
