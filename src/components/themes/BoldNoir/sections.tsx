'use client'

import { useState, type CSSProperties, type ReactNode } from 'react'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { ProjectList, type ProjectSlot } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { drumsSince, headingId } from '@/components/cv/sectionText'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { HitStar } from './backdrop'
import { BandPanel, CaseCard, CompanyTag, RankCard, TechStackBoard } from './cards'
import { AllOutAttack } from './allOut'
import { NOIR } from './palette'
import world from './world.module.css'

// The picked profession's sections. Tech Stack and Ventures take the plain fade; every other section is
// a stage: one useSectionTrigger per section adds data-on once it is in view, and the CSS plays each
// item's own entrance off it, staggered by --i (the speech box wobble, the rank flip and year stamp, the
// result slide over the red line, the hit slam). The long lists are masonry.

const LEAD = `text-base text-[color:var(--noir-paper-dim)] ${world.copy}`

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 id={headingId('noir', title)} className={`mb-8 inline-block px-5 py-2 text-3xl uppercase tracking-widest sm:text-4xl ${world.heading}`}>
      {title}
    </h2>
  )
}

/** A section whose items play their entrance once it scrolls into view. */
function Stage({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  const { ref, triggered } = useSectionTrigger()

  return (
    <section ref={ref} data-on={triggered || undefined} aria-labelledby={headingId('noir', title)} className={`relative z-20 mb-16 ${world.stage} ${className}`}>
      <SectionTitle title={title} />
      {children}
    </section>
  )
}

function About({ bio }: { bio: string }) {
  return (
    <Stage title="About">
      <div className={`max-w-3xl px-6 pb-10 pt-6 sm:px-8 ${world.speech}`}>
        <p className={`text-base leading-relaxed ${world.copy}`}>{bio}</p>
      </div>
    </Stage>
  )
}

function Projects({ projects }: { projects: SectionsOf<'engineer'>['projects'] }) {
  const [opened, setOpened] = useState<{ slot: ProjectSlot; trigger: HTMLElement } | null>(null)

  return (
    <Stage title="Featured Work">
      <ProjectList
        projects={projects}
        className={MASONRY_LIST}
        itemClassName={MASONRY_ITEM}
        renderProject={(slot) => <CaseCard slot={slot} index={projects.indexOf(slot.project)} onOpen={(picked, trigger) => setOpened({ slot: picked, trigger })} />}
      />
      {opened && <AllOutAttack slot={opened.slot} trigger={opened.trigger} onClose={() => setOpened(null)} />}
    </Stage>
  )
}

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      <About bio={professionalSummary.bio} />

      {sections.jobs.length > 0 && (
        <Stage title="Work Experience">
          <ul className={MASONRY_LIST}>
            {sections.jobs.map((entry, index) => (
              <li key={entry.id} className={MASONRY_ITEM}>
                <RankCard entry={entry} index={index} />
              </li>
            ))}
          </ul>
        </Stage>
      )}

      <FadeInScene>
        <section aria-labelledby={headingId('noir', 'Tech Stack')} className="mb-16">
          <SectionTitle title="Tech Stack" />
          <TechStackBoard categories={sections.techStack} />
        </section>
      </FadeInScene>

      <Projects projects={sections.projects} />

      <FadeInScene>
        <section aria-labelledby={headingId('noir', 'Ventures')} className="mb-16">
          <SectionTitle title="Ventures" />
          <ul className="grid gap-8 md:grid-cols-3">
            {sections.companies.map((company) => (
              <li key={company.id}>
                <CompanyTag company={company} />
              </li>
            ))}
          </ul>
        </section>
      </FadeInScene>
    </>
  )
}

// The uneven red line of the victory screen, drawn behind the band panels, in a 600 by 40 box.
const TRAIL = 'M0 22 L70 14 L120 26 L190 8 L260 24 L330 12 L380 30 L450 10 L520 22 L600 6 L600 18 L520 34 L450 22 L380 42 L330 24 L260 36 L190 20 L120 38 L70 26 L0 34 Z'

export function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const labels = useLabels()
  const { musician, bands } = sections

  return (
    <Stage title="Bands">
      <p className={`mb-6 ${LEAD}`}>{drumsSince(musician, labels.years)}</p>
      <div className="relative">
        <svg viewBox="0 0 600 40" preserveAspectRatio="none" className={`pointer-events-none absolute inset-x-0 top-10 h-16 w-full ${world.trail}`} aria-hidden="true" focusable="false">
          <path d={TRAIL} fill={NOIR.red} />
        </svg>
        <BandList bands={bands} className={`relative ${MASONRY_LIST}`} itemClassName={MASONRY_ITEM} renderBand={(slot) => <BandPanel slot={slot} index={bands.indexOf(slot.band)} />} />
      </div>
      <p className={`mt-6 italic ${LEAD}`}>{musician.line}</p>
    </Stage>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections
  const { achievements } = martialArts.primary

  return (
    <Stage title="Muay Thai">
      <h3 className="mb-5 text-3xl tracking-wide">{martialArts.primary.title}</h3>
      <MuayThaiRecord
        martialArts={martialArts}
        classNames={{
          facts: `mb-8 grid gap-4 sm:grid-cols-2 ${world.copy}`,
          fact: `p-5 ${world.slab}`,
          term: 'text-sm font-bold uppercase tracking-widest text-[color:var(--noir-fog)]',
          value: 'mt-1 text-sm text-[color:var(--noir-paper)]',
          achievements: `space-y-4 ${world.copy}`,
          achievement: 'text-base text-[color:var(--noir-paper)]',
        }}
        renderAchievement={(achievement) => (
          <span className={`flex items-center gap-4 ${world.hitRow}`} style={{ '--i': achievements.indexOf(achievement) } as CSSProperties}>
            <span className={`relative block h-12 w-12 flex-shrink-0 ${world.burst}`} aria-hidden="true">
              <HitStar className={`h-full w-full ${world.burstHover}`} />
            </span>
            <span className={`block flex-1 px-4 py-3 ${world.slab} ${world.hit}`}>{achievement}</span>
          </span>
        )}
      />
    </Stage>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}
