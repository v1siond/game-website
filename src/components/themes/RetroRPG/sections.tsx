'use client'

import type { ReactNode } from 'react'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { drumsSince } from '@/components/cv/sectionText'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { BandCard, CompanyCard, ExperienceCard, ItemBag, ProjectCard } from './cards'
import { BulletBox } from './bulletBox'
import { BODY, Box, Mark, SectionHeader } from './panels'
import { PIXEL } from './palette'
import { usePlay } from './play'
import world from './world.module.css'

// Each profession's sections, and only those, as the encounter's boxes. Light blocks (About, Tech stack,
// Ventures, the band lines) are one box each; heavy blocks are the long lists in masonry columns
// (MASONRY_LIST), each entry its own box with its own reveal (cards.tsx). The bullet box sits above
// each profession's main list, playing that profession's soul mode (bulletBox.tsx).
//
// Every reveal has its own play scope (usePlay), so a block's heading, its box and each card in a list
// open and type once, each when it shows, and never drive one another.

const WIDE = 'max-w-6xl'
const NARROW = 'max-w-3xl'

function Heading({ title }: { title: string }) {
  const { ref, play } = usePlay(600)

  return (
    <div ref={ref} data-play={play}>
      <SectionHeader title={title} />
    </div>
  )
}

/** A single box that opens in steps, then shows what it holds, when it first shows. */
function OpenBox({ children }: { children: ReactNode }) {
  const { ref, play } = usePlay(1400)

  return (
    <div ref={ref} data-play={play}>
      <Box className={world.opens}>{children}</Box>
    </div>
  )
}

function Block({ label, title, width = NARROW, children }: { label: string; title: string; width?: string; children: ReactNode }) {
  return (
    <section className="px-4 py-10 sm:px-6" aria-label={label}>
      <div className={`mx-auto ${width}`}>
        <Heading title={title} />
        {children}
      </div>
    </section>
  )
}

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()
  const titles = useLabels().sections

  return (
    <>
      <Block label={titles.about} title={titles.about}>
        <OpenBox>
          <p className={BODY}>{professionalSummary.bio}</p>
        </OpenBox>
      </Block>

      {sections.jobs.length > 0 && (
        <Block label={titles.workExperience} title={titles.workExperience} width={WIDE}>
          <BulletBox profession="engineer" />
          <ul className={MASONRY_LIST}>
            {sections.jobs.map((entry) => (
              <li key={entry.id} className={MASONRY_ITEM}>
                <ExperienceCard entry={entry} />
              </li>
            ))}
          </ul>
        </Block>
      )}

      <Block label={titles.techStack} title={titles.techStack}>
        <OpenBox>
          <ItemBag categories={sections.techStack} />
        </OpenBox>
      </Block>

      <Block label={titles.projects} title={titles.featuredWork} width={WIDE}>
        <ProjectList projects={sections.projects} className={MASONRY_LIST} itemClassName={MASONRY_ITEM} renderProject={(slot) => <ProjectCard {...slot} />} />
      </Block>

      <Block label={titles.ventures} title={titles.ventures} width={WIDE}>
        <div className="grid gap-6 md:grid-cols-3">
          {sections.companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </Block>
    </>
  )
}

export function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const labels = useLabels()
  const { musician, bands } = sections

  return (
    <Block label={labels.sections.bands} title={labels.sections.bands} width={WIDE}>
      <p className={`mb-6 text-center text-sm uppercase tracking-[0.15em] text-[color:var(--rpg-gold)] ${PIXEL}`}>{drumsSince(musician, labels.years)}</p>
      <BulletBox profession="drummer" />
      <BandList bands={bands} className={MASONRY_LIST} itemClassName={MASONRY_ITEM} renderBand={(slot) => <BandCard {...slot} />} />
      <p className={`mt-4 text-center ${BODY}`}>{musician.line}</p>
    </Block>
  )
}

const STAT = 'border-2 border-[color:var(--rpg-border-shade)] bg-[color:var(--rpg-window-low)] p-3'

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections
  const titles = useLabels().sections

  return (
    <Block label={titles.muayThai} title={titles.muayThai}>
      <BulletBox profession="fighter" />
      <OpenBox>
        <h3 className={`mb-4 flex items-start gap-2 text-sm uppercase tracking-wide text-[color:var(--rpg-gold)] sm:text-base ${PIXEL}`}>
          <Mark className="" />
          {martialArts.primary.title}
        </h3>
        <MuayThaiRecord
          martialArts={martialArts}
          classNames={{
            facts: `mb-6 grid gap-3 sm:grid-cols-2 ${world.after} [--show-delay:500ms]`,
            fact: STAT,
            term: `text-sm uppercase tracking-widest text-[color:var(--rpg-gold)] ${PIXEL}`,
            value: `mt-2 ${BODY} text-[color:var(--rpg-text)]`,
            achievements: `space-y-3 ${world.after} [--show-delay:900ms]`,
            achievement: BODY,
          }}
          renderAchievement={(achievement) => (
            <span className="flex items-start gap-2 text-[color:var(--rpg-green)]">
              <Mark />
              {achievement}
            </span>
          )}
        />
      </OpenBox>
    </Block>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}
