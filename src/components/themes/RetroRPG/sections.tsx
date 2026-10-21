'use client'

import { useCVData } from '@/components/cv/CVDataProvider'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { CT_COLORS } from './palette'
import { CharacterParty, LavosDramaticSection, TimePortalGateway } from './breaks'
import { BattleFrame } from './panels'
import { BandCard, CompanyCard, ExperienceCard, ProjectCard, TechInventory } from './cards'

function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      <BattleFrame title="ABOUT" era="present">
        <div className="p-4" style={{
          border: `2px solid ${CT_COLORS.portalBlue}30`,
          background: `linear-gradient(90deg, ${CT_COLORS.voidDark} 0%, transparent 100%)`,
        }}>
          <p className="text-sm leading-relaxed tracking-wide" style={{ color: CT_COLORS.white }}>
            {professionalSummary.bio}
          </p>
        </div>
      </BattleFrame>

      {/* ART SECTION 1: Character Party */}
      <CharacterParty />

      {sections.jobs.length > 0 && (
        <BattleFrame title="WORK EXPERIENCE" era="medieval">
          <div className="space-y-4">
            {sections.jobs.map((entry) => (
              <ExperienceCard key={entry.id} entry={entry} />
            ))}
          </div>
        </BattleFrame>
      )}

      {/* ART SECTION 2: Time Portal Gateway */}
      <TimePortalGateway />

      <BattleFrame title="TECH STACK" era="future">
        <TechInventory categories={sections.techStack} />
      </BattleFrame>

      <BattleFrame title="PROJECTS" era="present">
        <ProjectList
          projects={sections.projects}
          className="grid md:grid-cols-2 gap-4"
          renderProject={(slot) => <ProjectCard {...slot} />}
        />
      </BattleFrame>

      {/* ART SECTION 3: Lavos Dramatic */}
      <LavosDramaticSection />

      <BattleFrame title="VENTURES" era="future">
        <div className="grid md:grid-cols-3 gap-4">
          {sections.companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </BattleFrame>
    </>
  )
}

function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { musician, bands } = sections

  return (
    <>
      <CharacterParty />
      <BattleFrame title="BANDS" era="medieval">
        <p className="text-sm mb-4" style={{ color: CT_COLORS.white }}>
          Drums since {musician.since}, {musician.yearsPlaying} years
        </p>
        <BandList
          bands={bands}
          className="grid md:grid-cols-2 gap-4"
          renderBand={(slot) => <BandCard {...slot} />}
        />
        <p className="text-sm mt-4" style={{ color: CT_COLORS.silver }}>
          <span style={{ color: CT_COLORS.portalMagenta }} aria-hidden="true">◇ </span>
          {musician.line}
        </p>
      </BattleFrame>
    </>
  )
}

function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections

  return (
    <>
      <CharacterParty />
      <BattleFrame title="MUAY THAI" era="prehistoric">
        <h3 className="text-sm tracking-wide mb-4" style={{ color: CT_COLORS.prehistoricOrangeLight }}>
          {martialArts.primary.title}
        </h3>
        <MuayThaiRecord
          martialArts={martialArts}
          classNames={{
            facts: 'grid sm:grid-cols-2 gap-3 mb-4',
            fact: 'p-3 border-2 border-white/20',
            term: 'text-sm tracking-widest text-[#FFD700]',
            value: 'text-sm text-white mt-2 leading-relaxed',
            achievements: 'space-y-2',
            achievement: 'text-sm text-[#00FF66] flex items-start gap-2',
          }}
          renderAchievement={(achievement) => (
            <>
              <span className="text-[#FFD700]" aria-hidden="true">★</span>
              <span>{achievement}</span>
            </>
          )}
        />
      </BattleFrame>
    </>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}
