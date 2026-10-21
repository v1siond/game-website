'use client'

import { useCVData } from '@/components/cv/CVDataProvider'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { ArtSection } from './art'
import { SectionHeading, SkewedPanel } from './panels'
import { CompanyCard, BandCard, ExperienceCard, ProjectCard, TechStackDisplay } from './cards'

export function EngineerSections({ sections, prefersReducedMotion }: { sections: SectionsOf<'engineer'>; prefersReducedMotion: boolean }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      <section aria-label="About">
        <SkewedPanel color="#ff0033" direction="right" delay={200}>
          <h2 className="text-xl font-black mb-3" style={{ color: '#ff0033' }}>
            ABOUT
          </h2>
          <p className="text-base leading-relaxed" style={{ color: '#ccc' }}>
            {professionalSummary.bio}
          </p>
        </SkewedPanel>
      </section>

      {/* ART SECTION 1: Phantom masks + action lines */}
      {!prefersReducedMotion && <ArtSection variant={1} />}

      {sections.jobs.length > 0 && (
        <section className="mt-8" aria-label="Work experience">
          <SkewedPanel color="#ff0033" direction="left" delay={300}>
            <h2 className="text-xl font-black mb-4" style={{ color: '#ff0033' }}>
              WORK EXPERIENCE
            </h2>
            <div className="space-y-4">
              {sections.jobs.map((entry) => (
                <ExperienceCard key={entry.id} entry={entry} />
              ))}
            </div>
          </SkewedPanel>
        </section>
      )}

      {/* ART SECTION 2: Paint splatters + card suits */}
      {!prefersReducedMotion && <ArtSection variant={2} />}

      <section className="mt-8" aria-label="Tech stack">
        <SkewedPanel color="#ff0033" direction="left" delay={400}>
          <h2 className="text-xl font-black mb-4" style={{ color: '#ff0033' }}>
            TECH STACK
          </h2>
          <TechStackDisplay categories={sections.techStack} />
        </SkewedPanel>
      </section>

      <section className="mt-8" aria-label="Projects">
        <SectionHeading prefersReducedMotion={prefersReducedMotion}>PROJECTS</SectionHeading>
        <ProjectList
          projects={sections.projects}
          className="grid md:grid-cols-2 gap-4"
          renderProject={(slot) => <ProjectCard {...slot} index={sections.projects.indexOf(slot.project)} />}
        />
      </section>

      {/* ART SECTION 3: Speed lines + chain break */}
      {!prefersReducedMotion && <ArtSection variant={3} />}

      <section className="mt-8" aria-label="Ventures">
        <SectionHeading prefersReducedMotion={prefersReducedMotion}>VENTURES</SectionHeading>
        <div className="grid md:grid-cols-3 gap-4">
          {sections.companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </section>
    </>
  )
}

export function MusicianSections({ sections, prefersReducedMotion }: { sections: SectionsOf<'drummer'>; prefersReducedMotion: boolean }) {
  const { musician, bands } = sections

  return (
    <>
      {!prefersReducedMotion && <ArtSection variant={2} />}
      <section className="mt-8" aria-label="Bands">
        <SectionHeading prefersReducedMotion={prefersReducedMotion}>BANDS</SectionHeading>
        <p className="text-base mb-4" style={{ color: '#ccc' }}>
          Drums since {musician.since}, {musician.yearsPlaying} years
        </p>
        <BandList
          bands={bands}
          className="grid md:grid-cols-3 gap-4"
          renderBand={(slot) => <BandCard {...slot} />}
        />
        <p className="text-sm mt-4 italic" style={{ color: '#ff6666' }}>
          {musician.line}
        </p>
      </section>
    </>
  )
}

export function MartialArtistSections({ sections, prefersReducedMotion }: { sections: SectionsOf<'fighter'>; prefersReducedMotion: boolean }) {
  const { martialArts } = sections

  return (
    <>
      {!prefersReducedMotion && <ArtSection variant={3} />}
      <section className="mt-8" aria-label="Muay Thai">
        <SkewedPanel color="#ff0033" direction="right" delay={200}>
          <h2 className="text-xl font-black mb-2" style={{ color: '#ff0033' }}>
            MUAY THAI
          </h2>
          <h3 className="text-lg font-bold mb-4" style={{ color: '#fff' }}>
            {martialArts.primary.title}
          </h3>
          <MuayThaiRecord
            martialArts={martialArts}
            classNames={{
              facts: 'grid sm:grid-cols-2 gap-3 mb-5',
              fact: 'px-4 py-3 border-l-4 border-[#ff0033] bg-[#ff0033]/10',
              term: 'text-sm tracking-widest uppercase font-bold text-[#ff6666]',
              value: 'text-sm mt-1 text-white',
              achievements: 'space-y-2',
              achievement: 'text-sm flex items-start gap-2 text-[#e0e0e0]',
            }}
            renderAchievement={(achievement) => (
              <>
                <span className="text-[#ff6666]" aria-hidden="true">▸</span>
                <span>{achievement}</span>
              </>
            )}
          />
        </SkewedPanel>
      </section>
    </>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews<{ prefersReducedMotion: boolean }> = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}
