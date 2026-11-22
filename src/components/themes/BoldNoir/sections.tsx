'use client'

import { useState, type CSSProperties, type ReactNode } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { AboutFacts, useAboutBlock, type AboutFactsLook } from '@/components/cv/AboutFacts'
import { sectionViews, type SectionFrames } from '@/components/cv/SectionPlanView'
import { ProjectList, type ProjectSlot } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import { drumsSince, headingId } from '@/lib/cv/sectionText'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import type { Project } from '@/lib/cv/content'
import { HitStar } from './backdrop'
import { MarkedLines } from '@/components/cv/MarkedLines'
import { BULLETS, BandPanel, CaseCard, CompanyTag, RankCard, ServiceSlab, TechStackBoard, staggerStep } from './cards'
import { AllOutAttack } from './allOut'
import { SlappedStatement, StampedCase } from './evidence'
import { NOIR } from './palette'
import world from './world.module.css'

// The picked profession's sections. Tech Stack, Services and Ventures take the plain fade; every other section is
// a stage: one useSectionTrigger per section adds data-on once it is in view, and the CSS plays each
// item's own entrance off it, staggered by --i (the speech box wobble, the rank flip and year stamp, the
// result slide over the red line, the hit slam). The long lists are masonry. Two sections the detective
// works on himself (./evidence): he slaps the about statement down and stamps the services as a closed case.
// The shared plan picks which sections a profession shows and in which order.

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

/** A section that fades in whole as it scrolls into view, with no entrance per item. */
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <FadeInScene>
      <section aria-labelledby={headingId('noir', title)} className="mb-16">
        <SectionTitle title={title} />
        {children}
      </section>
    </FadeInScene>
  )
}

// The facts under the statement, each label in the red capitals.
const STATEMENT_FACTS: AboutFactsLook = {
  list: 'mt-4 max-w-prose space-y-1',
  fact: `text-sm ${world.copy}`,
  term: 'inline font-bold uppercase tracking-wider text-[color:var(--noir-red-plate)]',
  value: 'inline',
  termEnd: ': ',
}

function About({ bio }: { bio: string }) {
  const { sections, cards } = useLabels()
  const { highlights } = useAboutBlock()

  return (
    <Stage title={sections.about}>
      <SlappedStatement>
        <div className={`max-w-3xl px-6 pb-10 pt-6 sm:px-8 ${world.speech}`}>
          <p className={`max-w-prose text-base leading-relaxed ${world.copy}`}>{bio}</p>
          <MarkedLines
            items={highlights}
            label={cards.keyAchievements}
            look={{ ...BULLETS, list: 'mt-4 max-w-prose space-y-1.5', line: `flex items-start gap-2 text-sm ${world.copy}` }}
          />
          <AboutFacts look={STATEMENT_FACTS} />
        </div>
      </SlappedStatement>
    </Stage>
  )
}

function Projects({ projects }: { projects: Project[] }) {
  const [opened, setOpened] = useState<{ slot: ProjectSlot; trigger: HTMLElement } | null>(null)
  const { sections } = useLabels()

  return (
    <Stage title={sections.featuredWork}>
      <ProjectList
        projects={projects}
        className={MASONRY_LIST}
        itemClassName={MASONRY_ITEM}
        renderProject={(slot, index) => <CaseCard slot={slot} index={index} onOpen={(picked, trigger) => setOpened({ slot: picked, trigger })} />}
      />
      {opened && <AllOutAttack slot={opened.slot} trigger={opened.trigger} onClose={() => setOpened(null)} />}
    </Stage>
  )
}

// The uneven red line of the victory screen, drawn behind the band panels, in a 600 by 40 box.
const TRAIL = 'M0 22 L70 14 L120 26 L190 8 L260 24 L330 12 L380 30 L450 10 L520 22 L600 6 L600 18 L520 34 L450 22 L380 42 L330 24 L260 36 L190 20 L120 38 L70 26 L0 34 Z'

const FRAMES: SectionFrames = {
  about: function AboutFrame({ slot }) {
    return <About bio={slot.bio} />
  },
  work: function WorkFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <Stage title={titles[slot.titleKey]}>
        <ul className={MASONRY_LIST}>
          {slot.jobs.map((entry, index) => (
            <li key={entry.id} className={MASONRY_ITEM}>
              <RankCard entry={entry} index={index} />
            </li>
          ))}
        </ul>
      </Stage>
    )
  },
  tech: function TechFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <Section title={titles[slot.titleKey]}>
        <TechStackBoard categories={slot.categories} />
      </Section>
    )
  },
  services: function ServicesFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <Section title={titles[slot.titleKey]}>
        <StampedCase>
          <ul className={MASONRY_LIST}>
            {slot.services.map((service) => (
              <li key={service.id} className={MASONRY_ITEM}>
                <ServiceSlab service={service} />
              </li>
            ))}
          </ul>
        </StampedCase>
      </Section>
    )
  },
  projects: function ProjectsFrame({ slot }) {
    return <Projects projects={slot.projects} />
  },
  ventures: function VenturesFrame({ slot }) {
    const titles = useLabels().sections
    return (
      <Section title={titles[slot.titleKey]}>
        <ul className="grid gap-8 md:grid-cols-6">
          {slot.companies.map((company) => (
            <li key={company.id} className={company.featured ? 'md:col-span-3' : 'md:col-span-2'}>
              <CompanyTag company={company} />
            </li>
          ))}
        </ul>
      </Section>
    )
  },
  bands: function BandsFrame({ slot }) {
    const labels = useLabels()
    const { musician, bands } = slot

    return (
      <Stage title={labels.sections[slot.titleKey]}>
        <p className={`mb-6 ${LEAD}`}>{drumsSince(musician, labels.years)}</p>
        <div className="relative">
          <svg viewBox="0 0 600 40" preserveAspectRatio="none" className={`pointer-events-none absolute inset-x-0 top-10 h-16 w-full ${world.trail}`} aria-hidden="true" focusable="false">
            <path d={TRAIL} fill={NOIR.red} />
          </svg>
          <BandList bands={bands} className={`relative ${MASONRY_LIST}`} itemClassName={MASONRY_ITEM} renderBand={(panel, index) => <BandPanel slot={panel} index={index} />} />
        </div>
        <p className={`mt-6 italic ${LEAD}`}>{musician.line}</p>
      </Stage>
    )
  },
  muayThai: function MuayThaiFrame({ slot }) {
    const { martialArts } = slot
    const titles = useLabels().sections

    return (
      <Stage title={titles[slot.titleKey]}>
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
          renderAchievement={(achievement, index) => (
            <span className={`flex items-center gap-4 ${world.hitRow}`} style={{ '--i': staggerStep(index) } as CSSProperties}>
              <span className={`relative block h-12 w-12 flex-shrink-0 ${world.burst}`} aria-hidden="true">
                <HitStar className={`h-full w-full ${world.burstHover}`} />
              </span>
              <span className={`block flex-1 px-4 py-3 ${world.slab} ${world.hit}`}>{achievement}</span>
            </span>
          )}
        />
      </Stage>
    )
  },
}

export const SECTION_VIEWS = sectionViews(FRAMES)
