import { useCVData } from '@/components/cv/CVDataProvider'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { LIMBO } from './palette'
import { ForestArt, GiantSpiderArt, IndustrialGearsArt } from './backdrop'
import { BandCard, CompanyCard, ExperienceCard, LimboCard, ProjectCard, SectionHeader, TechCloud } from './cards'

function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      {/* ========== ABOUT ========== */}
      <section className="px-6 py-8" aria-label="About">
        <div className="max-w-2xl mx-auto">
          <SectionHeader title="about" />
          <LimboCard>
            <p className="text-sm leading-relaxed" style={{ color: LIMBO.lightGrey2 }}>{professionalSummary.bio}</p>
          </LimboCard>
        </div>
      </section>

      {/* ========== ART: GIANT SPIDER ========== */}
      <GiantSpiderArt />

      {/* ========== EXPERIENCE ========== */}
      {sections.jobs.length > 0 && (
        <section className="px-6 py-8" aria-label="Work experience">
          <div className="max-w-2xl mx-auto">
            <SectionHeader title="work experience" />
            <div className="space-y-3">
              {sections.jobs.map((entry) => (
                <ExperienceCard key={entry.id} entry={entry} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== ART: INDUSTRIAL GEARS ========== */}
      <IndustrialGearsArt />

      {/* ========== TECH STACK ========== */}
      <section className="px-6 py-8" aria-label="Tech stack">
        <div className="max-w-2xl mx-auto">
          <SectionHeader title="tech stack" />
          <LimboCard>
            <TechCloud categories={sections.techStack} />
          </LimboCard>
        </div>
      </section>

      {/* ========== PROJECTS ========== */}
      <section className="px-6 py-8" aria-label="Projects">
        <div className="max-w-2xl mx-auto">
          <SectionHeader title="featured work" />
          <ProjectList
            projects={sections.projects}
            className="grid md:grid-cols-2 gap-4"
            renderProject={(slot) => <ProjectCard {...slot} />}
          />
        </div>
      </section>

      {/* ========== ART: FOREST ========== */}
      <ForestArt />

      {/* ========== VENTURES ========== */}
      <section className="px-6 py-8" aria-label="Ventures">
        <div className="max-w-2xl mx-auto">
          <SectionHeader title="ventures" />
          <div className="grid md:grid-cols-3 gap-3">
            {sections.companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { musician, bands } = sections

  return (
    <>
      <GiantSpiderArt />

      <section className="px-6 py-8" aria-label="Bands">
        <div className="max-w-2xl mx-auto">
          <SectionHeader title="bands" />
          <p className="text-sm mb-4 text-center" style={{ color: LIMBO.lightGrey2 }}>
            Drums since {musician.since}, {musician.yearsPlaying} years
          </p>
          <BandList
            bands={bands}
            className="grid md:grid-cols-3 gap-3"
            renderBand={(slot) => <BandCard {...slot} />}
          />
          <p className="text-sm mt-4 italic text-center" style={{ color: LIMBO.lightGrey2 }}>{musician.line}</p>
        </div>
      </section>

      <ForestArt />
    </>
  )
}

function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections

  return (
    <>
      <IndustrialGearsArt />

      <section className="px-6 py-8" aria-label="Muay Thai">
        <div className="max-w-2xl mx-auto">
          <SectionHeader title="muay thai" />
          <LimboCard>
            <h3 className="text-sm tracking-[0.2em] uppercase mb-4 text-[#DDDDDD]">{martialArts.primary.title}</h3>
            <MuayThaiRecord
              martialArts={martialArts}
              classNames={{
                facts: 'grid sm:grid-cols-2 gap-3 mb-4',
                fact: 'p-3 border-l-2 border-black bg-[#121212]',
                term: 'text-xs tracking-[0.25em] uppercase text-[#888888]',
                value: 'text-sm mt-1 text-[#CCCCCC]',
                achievements: 'space-y-1',
                achievement: 'text-sm flex items-start gap-1.5 text-[#AAAAAA]',
              }}
              renderAchievement={(achievement) => (
                <>
                  <span className="text-[#888888]" aria-hidden="true">-</span>
                  {achievement}
                </>
              )}
            />
          </LimboCard>
        </div>
      </section>

      <ForestArt />
    </>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}
