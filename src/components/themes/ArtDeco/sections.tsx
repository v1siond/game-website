'use client'

import { useCVData } from '@/components/cv/CVDataProvider'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { RAPTURE_COLORS } from './palette'
import { ArtDecoChevron, ArtDecoFan, ArtDecoSunburst, GoldFrame } from './frames'
import { BandCard, CARD_TITLE_STYLE, CompanyCard, ExperienceCard, ProjectCard, TechCloud } from './cards'

export function EngineerSections({ sections, reducedMotion }: { sections: SectionsOf<'engineer'>; reducedMotion: boolean }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      <GoldFrame title="ABOUT" reducedMotion={reducedMotion}>
        <p className="text-base leading-relaxed text-center" style={{ color: RAPTURE_COLORS.parchment }}>
          {professionalSummary.bio}
        </p>
      </GoldFrame>

      <ArtDecoSunburst />

      {sections.jobs.length > 0 && (
        <GoldFrame title="WORK EXPERIENCE" reducedMotion={reducedMotion}>
          <div className="space-y-5">
            {sections.jobs.map((entry) => (
              <ExperienceCard key={entry.id} entry={entry} reducedMotion={reducedMotion} />
            ))}
          </div>
        </GoldFrame>
      )}

      <ArtDecoChevron />

      <GoldFrame title="TECH STACK" reducedMotion={reducedMotion}>
        <TechCloud categories={sections.techStack} reducedMotion={reducedMotion} />
      </GoldFrame>

      <div className="pt-8">
        <GoldFrame title="PROJECTS" reducedMotion={reducedMotion}>
          <ProjectList
            projects={sections.projects}
            className="grid md:grid-cols-2 gap-5"
            renderProject={(slot) => <ProjectCard {...slot} reducedMotion={reducedMotion} />}
          />
        </GoldFrame>
      </div>

      <ArtDecoFan />

      <GoldFrame title="VENTURES" reducedMotion={reducedMotion}>
        <div className="grid md:grid-cols-3 gap-5">
          {sections.companies.map((company) => (
            <CompanyCard key={company.id} company={company} reducedMotion={reducedMotion} />
          ))}
        </div>
      </GoldFrame>
    </>
  )
}

export function MusicianSections({ sections, reducedMotion }: { sections: SectionsOf<'drummer'>; reducedMotion: boolean }) {
  const { musician, bands } = sections

  return (
    <>
      <ArtDecoSunburst />
      <GoldFrame title="BANDS" reducedMotion={reducedMotion}>
        <p className="text-base text-center mb-5" style={{ color: RAPTURE_COLORS.parchment }}>
          Drums since {musician.since}, {musician.yearsPlaying} years
        </p>
        <BandList
          bands={bands}
          className="grid md:grid-cols-2 gap-5"
          renderBand={(slot) => <BandCard {...slot} reducedMotion={reducedMotion} />}
        />
        <p className="text-sm text-center mt-5 italic" style={{ color: RAPTURE_COLORS.gold }}>
          {musician.line}
        </p>
      </GoldFrame>
    </>
  )
}

export function MartialArtistSections({ sections, reducedMotion }: { sections: SectionsOf<'fighter'>; reducedMotion: boolean }) {
  const { martialArts } = sections

  return (
    <>
      <ArtDecoSunburst />
      <GoldFrame title="MUAY THAI" reducedMotion={reducedMotion}>
        <h3 className="text-xl text-center mb-6" style={CARD_TITLE_STYLE}>{martialArts.primary.title}</h3>
        <MuayThaiRecord
          martialArts={martialArts}
          classNames={{
            facts: 'grid sm:grid-cols-2 gap-4 mb-6',
            fact: 'p-4 border border-[#D4AF37]/50 bg-[#0d1f2d]/80',
            term: 'text-sm tracking-[0.2em] uppercase text-[#D4AF37]',
            value: 'text-sm mt-1 text-[#F5E6C8]',
            achievements: 'space-y-2',
            achievement: 'text-sm flex items-start gap-2 text-[#F5E6C8]',
          }}
          renderAchievement={(achievement) => (
            <>
              <span className="text-[#D4AF37]" aria-hidden="true">{'>'}</span>
              <span>{achievement}</span>
            </>
          )}
        />
      </GoldFrame>
    </>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews<{ reducedMotion: boolean }> = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}
