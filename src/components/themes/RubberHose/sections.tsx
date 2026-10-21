'use client'

import { useCVData } from '@/components/cv/CVDataProvider'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { CUPHEAD_COLORS } from './palette'
import { ArtSection, DecorativeBanner } from './art'
import { BandRecord, CompanyPoster, ExperienceCard, POSTER_STYLE, TechBubbleCloud, VintagePoster } from './cards'

function SectionBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center mb-6">
      <DecorativeBanner>
        <span className="text-lg tracking-wider">{children}</span>
      </DecorativeBanner>
    </div>
  )
}

function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      <section className="text-center mb-8" aria-label="About">
        <DecorativeBanner>
          <span className="text-lg tracking-wider">ABOUT</span>
        </DecorativeBanner>
        <p
          className="mt-8 text-base leading-relaxed max-w-2xl mx-auto"
          style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}
        >
          {professionalSummary.bio}
        </p>
      </section>

      {/* ========== ART SECTION 1: Film Reel Break ========== */}
      <ArtSection variant="filmReel" />

      {sections.jobs.length > 0 && (
        <section className="mb-8" aria-label="Work experience">
          <SectionBanner>WORK EXPERIENCE</SectionBanner>
          <div className="space-y-4 max-w-3xl mx-auto">
            {sections.jobs.map((entry) => (
              <ExperienceCard key={entry.id} entry={entry} />
            ))}
          </div>
        </section>
      )}

      {/* ========== ART SECTION 2: Music Notes Break ========== */}
      <ArtSection variant="musicNotes" />

      <section className="mb-8" aria-label="Tech stack">
        <SectionBanner>TECH STACK</SectionBanner>
        <div
          className="p-6 max-w-3xl mx-auto"
          style={{ ...POSTER_STYLE, boxShadow: `6px 6px 0 ${CUPHEAD_COLORS.shadowBrown}` }}
        >
          <TechBubbleCloud categories={sections.techStack} />
        </div>
      </section>

      <section className="mb-8" aria-label="Projects">
        <SectionBanner>PROJECTS</SectionBanner>
        <ProjectList
          projects={sections.projects}
          className="grid md:grid-cols-2 gap-4"
          renderProject={(slot) => <VintagePoster {...slot} />}
        />
      </section>

      {/* ========== ART SECTION 3: Bouncing Balls Break ========== */}
      <ArtSection variant="bouncingBalls" />

      <section className="mb-8" aria-label="Ventures">
        <SectionBanner>VENTURES</SectionBanner>
        <div className="grid md:grid-cols-3 gap-4">
          {sections.companies.map((company) => (
            <CompanyPoster key={company.id} company={company} />
          ))}
        </div>
      </section>
    </>
  )
}

function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { musician, bands } = sections

  return (
    <>
      <ArtSection variant="musicNotes" />
      <section className="mb-8" aria-label="Bands">
        <SectionBanner>BANDS</SectionBanner>
        <p className="text-base text-center mb-6" style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}>
          Drums since {musician.since}, {musician.yearsPlaying} years
        </p>
        <BandList bands={bands} className="grid md:grid-cols-3 gap-4" renderBand={(slot) => <BandRecord {...slot} />} />
        <p className="text-sm text-center mt-6 italic" style={{ color: CUPHEAD_COLORS.accentRedDark, fontFamily: 'serif' }}>
          {musician.line}
        </p>
      </section>
    </>
  )
}

function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections

  return (
    <>
      <ArtSection variant="bouncingBalls" />
      <section className="mb-8" aria-label="Muay Thai">
        <SectionBanner>MUAY THAI</SectionBanner>
        <div className="p-6 max-w-3xl mx-auto" style={{ ...POSTER_STYLE, boxShadow: `6px 6px 0 ${CUPHEAD_COLORS.shadowBrown}` }}>
          <h3
            className="text-xl text-center mb-6"
            style={{ color: CUPHEAD_COLORS.accentRedDark, fontFamily: '"Abril Fatface", serif' }}
          >
            {martialArts.primary.title}
          </h3>
          <MuayThaiRecord
            martialArts={martialArts}
            classNames={{
              facts: 'grid sm:grid-cols-2 gap-4 mb-6',
              fact: 'p-3 border-4 border-[#2a2015] bg-[#f7ead0]',
              term: 'text-sm tracking-widest uppercase text-[#8b0000] font-serif',
              value: 'text-sm mt-1 text-[#2a2015] font-serif',
              achievements: 'space-y-2',
              achievement: 'text-sm flex items-start gap-2 text-[#2a2015] font-serif',
            }}
            renderAchievement={(achievement) => (
              <>
                <span className="text-[#8b0000]" aria-hidden="true">★</span>
                <span>{achievement}</span>
              </>
            )}
          />
        </div>
      </section>
    </>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}
