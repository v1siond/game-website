'use client'

import { useState, type CSSProperties, type ReactNode } from 'react'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { drumsSince, headingId, newTabName } from '@/components/cv/sectionText'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import type { CVData } from '@/lib/cv/content'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { Crate, Fruit, Gem } from './art'
import { HeroCharacter } from './character'
import { ProjectCrate } from './crates'
import { LevelCard } from './levelCards'
import { BandWarp, GemLine } from './records'
import world from './world.module.css'

// The picked profession's sections. About, Tech Stack and Ventures take the plain fade; every other
// section is a stage that plays once when it scrolls in (useSectionTrigger's data-on, items staggered by
// --i): jobs rise as levels full of fruit, projects sit as crates to break, bands are bonus warps, the
// Muay Thai achievements drop in as gems. The long lists are masonry.

const TITLE_ICON = {
  fruit: <Fruit className="h-9 w-9" />,
  crate: <Crate className="h-9 w-9" />,
  gem: <Gem className="h-9 w-8" />,
} as const

function SectionTitle({ title, icon }: { title: string; icon?: keyof typeof TITLE_ICON }) {
  return (
    <h2 id={headingId('np', title)} className={`mb-6 flex items-center gap-3 text-3xl sm:text-4xl ${world.sectionTitle}`}>
      {icon && <span aria-hidden="true">{TITLE_ICON[icon]}</span>}
      {title}
    </h2>
  )
}

function Stage({ title, icon, children }: { title: string; icon: keyof typeof TITLE_ICON; children: ReactNode }) {
  const { ref, triggered } = useSectionTrigger()

  return (
    <section ref={ref} data-on={triggered || undefined} aria-labelledby={headingId('np', title)} className={`relative mb-20 ${world.stage}`}>
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
const PANEL = 'rounded-2xl border-4 border-[color:var(--np-stone-dark)] bg-[color:var(--np-panel)]'

function TechStack({ categories }: { categories: CVData['techStack'] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <li key={category.id} className={`${PANEL} p-5`}>
          <h3 className="mb-3 flex items-center gap-2 text-base font-black uppercase tracking-wide text-[color:var(--np-blue)]">
            <span aria-hidden="true">{category.icon}</span>
            {category.name}
          </h3>
          <ul className="flex flex-wrap gap-1.5">
            {category.items.map((tech) => (
              <li key={tech} className="rounded-md bg-[color:var(--np-seam)] px-2 py-0.5 text-sm text-[color:var(--np-white)]">
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
            className={`block h-full p-5 focus:outline-none ${PANEL} ${world.bandCard}`}
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">
                {company.icon}
              </span>
              <span>
                <span className={`block text-xl ${world.display}`}>{company.name}</span>
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

/** The projects as crates, with the spin that breaks them all in a cascade. */
function Crates({ projects, title }: { projects: SectionsOf<'engineer'>['projects']; title: string }) {
  const { hud } = useLabels()
  const [spin, setSpin] = useState(0)

  return (
    <Stage title={title} icon="crate">
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <p className="text-base text-[color:var(--np-muted)]">{hud.crateHint}</p>
        <button type="button" onClick={() => setSpin((count) => count + 1)} className={`${world.chunkyButton} ${world.chunkyLit} gap-2`}>
          <span className={`block h-8 w-6 ${world.spinHero}`} aria-hidden="true">
            <span key={spin} className={`block h-full w-full ${spin ? world.spinning : ''}`}>
              <HeroCharacter profession="engineer" className="h-full w-full" />
            </span>
          </span>
          {hud.spinAll}
        </button>
      </div>
      <ProjectList
        projects={projects}
        className={MASONRY_LIST}
        itemClassName={MASONRY_ITEM}
        renderProject={(slot) => {
          const order = projects.indexOf(slot.project)
          return (
            <div className={world.crateSlot} style={{ '--i': order } as CSSProperties}>
              <ProjectCrate slot={slot} spin={spin} order={order} />
            </div>
          )
        }}
      />
    </Stage>
  )
}

function EngineerLevels({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()
  const labels = useLabels()

  return (
    <>
      <Plain title={labels.sections.about}>
        <p className={`${PANEL} max-w-3xl p-6 text-lg leading-relaxed text-[color:var(--np-white)]`}>{professionalSummary.bio}</p>
      </Plain>

      {sections.jobs.length > 0 && (
        <Stage title={labels.sections.workExperience} icon="fruit">
          <p className={HINT}>{labels.hud.fruitHint}</p>
          <ul className={MASONRY_LIST}>
            {sections.jobs.map((entry, index) => (
              <li key={entry.id} className={MASONRY_ITEM}>
                <LevelCard entry={entry} index={index} />
              </li>
            ))}
          </ul>
        </Stage>
      )}

      <Plain title={labels.sections.techStack}>
        <TechStack categories={sections.techStack} />
      </Plain>

      <Crates projects={sections.projects} title={labels.sections.projects} />

      <Plain title={labels.sections.ventures}>
        <Ventures companies={sections.companies} />
      </Plain>
    </>
  )
}

function MusicianLevels({ sections }: { sections: SectionsOf<'drummer'> }) {
  const labels = useLabels()
  const { musician, bands } = sections

  return (
    <Stage title={labels.sections.bands} icon="fruit">
      <p className="mb-6 text-lg font-bold text-[color:var(--np-gold)]">{drumsSince(musician, labels.years)}</p>
      <BandList bands={bands} className={MASONRY_LIST} itemClassName={MASONRY_ITEM} renderBand={(slot) => <BandWarp slot={slot} index={bands.indexOf(slot.band)} />} />
      <p className="mt-2 text-base italic text-[color:var(--np-muted)]">{musician.line}</p>
    </Stage>
  )
}

function MartialArtistLevels({ sections }: { sections: SectionsOf<'fighter'> }) {
  const labels = useLabels()
  const { martialArts } = sections
  const { achievements } = martialArts.primary

  return (
    <Stage title={labels.sections.muayThai} icon="gem">
      <h3 className={`mb-5 text-2xl ${world.display}`}>{martialArts.primary.title}</h3>
      <MuayThaiRecord
        martialArts={martialArts}
        classNames={{
          facts: 'mb-8 grid gap-4 sm:grid-cols-2',
          fact: `${PANEL} p-4`,
          term: 'text-sm font-black uppercase tracking-wide text-[color:var(--np-gold)]',
          value: 'mt-1 text-base text-[color:var(--np-white)]',
          achievements: 'space-y-4',
        }}
        renderAchievement={(achievement) => <GemLine achievement={achievement} index={achievements.indexOf(achievement)} />}
      />
    </Stage>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerLevels,
  drummer: MusicianLevels,
  fighter: MartialArtistLevels,
}
