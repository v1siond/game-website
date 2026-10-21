import { useCVData } from '@/components/cv/CVDataProvider'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { KratosChainPullReveal } from './KratosSprite'
import { GOW } from './palette'
import { ArtSectionOlympus, ArtSectionPillars, ArtSectionWeapons } from './art'
import { FadeInSection, FramedSection, SpartanFrame } from './panels'
import { BandCard, CompanyCard, ExperienceCard, ProjectCard, TechCloud } from './cards'

// The picked profession's sections.

function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()
  const experienceTrigger = useSectionTrigger()
  const projectsTrigger = useSectionTrigger()
  const { jobs, techStack, projects, companies } = sections

  return (
    <>
      <FramedSection title="About">
        <p className="leading-relaxed" style={{ color: GOW.bone }}>{professionalSummary.bio}</p>
      </FramedSection>

      {/* Art Section 1 - Weapons */}
      <FadeInSection delay={150}>
        <ArtSectionWeapons />
      </FadeInSection>

      {/* Work Experience - Kratos runs in, then pulls content with Blades of Chaos */}
      {jobs.length > 0 && (
        <section ref={experienceTrigger.ref} className="relative z-20 py-8 px-6 overflow-visible">
          <KratosChainPullReveal triggered={experienceTrigger.triggered} className="max-w-4xl mx-auto">
            <SpartanFrame title="Work Experience">
              <div>
                {jobs.map((entry, index) => (
                  <ExperienceCard key={entry.id} entry={entry} isLast={index === jobs.length - 1} />
                ))}
              </div>
            </SpartanFrame>
          </KratosChainPullReveal>
        </section>
      )}

      {/* Art Section 2 - Greek Pillars */}
      <FadeInSection>
        <ArtSectionPillars />
      </FadeInSection>

      <FramedSection title="Tech Stack">
        <TechCloud categories={techStack} />
      </FramedSection>

      {/* Projects */}
      <section
        ref={projectsTrigger.ref}
        className={`relative z-20 py-6 md:py-8 px-4 md:px-6 transition-[opacity,transform] duration-[600ms] ease-out ${
          projectsTrigger.triggered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <SpartanFrame title="Projects">
            <ProjectList
              projects={projects}
              className="grid md:grid-cols-2 gap-3 md:gap-4"
              renderProject={(slot) => <ProjectCard slot={slot} />}
            />
          </SpartanFrame>
        </div>
      </section>

      {/* Art Section 3 - Mount Olympus */}
      <FadeInSection>
        <ArtSectionOlympus />
      </FadeInSection>

      <FramedSection title="Ventures">
        <div className="grid md:grid-cols-3 gap-3 md:gap-4">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </FramedSection>
    </>
  )
}

function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { musician, bands } = sections

  return (
    <>
      <FadeInSection delay={150}>
        <ArtSectionWeapons />
      </FadeInSection>

      <FramedSection title="Bands">
        <p className="text-sm mb-4 text-center" style={{ color: GOW.bone }}>
          Drums since {musician.since}, {musician.yearsPlaying} years
        </p>
        <BandList bands={bands} className="grid md:grid-cols-3 gap-3 md:gap-4" renderBand={(slot) => <BandCard {...slot} />} />
        <p className="text-sm mt-4 italic text-center" style={{ color: GOW.goldBright }}>{musician.line}</p>
      </FramedSection>

      <FadeInSection>
        <ArtSectionOlympus />
      </FadeInSection>
    </>
  )
}

function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections
  const recordTrigger = useSectionTrigger()

  return (
    <>
      <FadeInSection>
        <ArtSectionPillars />
      </FadeInSection>

      {/* Muay Thai record - Kratos pulls it in with the Blades of Chaos */}
      <section ref={recordTrigger.ref} className="relative z-20 py-8 px-6 overflow-visible">
        <KratosChainPullReveal triggered={recordTrigger.triggered} className="max-w-4xl mx-auto">
          <SpartanFrame title="Muay Thai">
            <h3 className="text-lg font-medium mb-4" style={{ color: GOW.bone }}>{martialArts.primary.title}</h3>
            <MuayThaiRecord
              martialArts={martialArts}
              classNames={{
                facts: 'grid sm:grid-cols-2 gap-3 mb-4',
                fact: 'p-3 bg-black/60 border border-[#2a2420] rounded',
                term: 'text-sm tracking-[0.15em] uppercase text-[#c9a227]',
                value: 'text-sm mt-1 text-[#e8e0d0]',
                achievements: 'space-y-1',
                achievement: 'text-sm flex items-start gap-2 text-[#e8e0d0]',
              }}
              renderAchievement={(achievement) => (
                <>
                  <span className="text-[#8b1a1a]" aria-hidden="true">◆</span>
                  {achievement}
                </>
              )}
            />
          </SpartanFrame>
        </KratosChainPullReveal>
      </section>

      <FadeInSection>
        <ArtSectionOlympus />
      </FadeInSection>
    </>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}
