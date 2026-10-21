'use client'

import { useCVData } from '@/components/cv/CVDataProvider'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { COLORS } from './palette'
import { Darksign } from './art'
import { BonfireArtSection, FogGate, FogGateArtSection, PraiseTheSunArtSection } from './breaks'
import { SectionHeading, StoneSectionCard } from './panels'
import { CompanyCard, BandCard, ExperienceCard, SaveRoomCard, TechCloud } from './cards'

export function EngineerZone({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      {/* Bio panel - item description style */}
      <StoneSectionCard className="mb-8" ariaLabelledby="about-heading">
        <SectionHeading id="about-heading">About</SectionHeading>
        <p className="text-sm leading-relaxed" style={{ color: '#b0a090' }}>
          {professionalSummary.bio}
        </p>
      </StoneSectionCard>

      {/* ART SECTION: Bonfire - after About, before Experience */}
      <BonfireArtSection />

      {sections.jobs.length > 0 && (
        <StoneSectionCard className="mb-8" ariaLabelledby="experience-heading">
          <SectionHeading id="experience-heading">Work Experience</SectionHeading>
          <div className="space-y-3">
            {sections.jobs.map((entry) => (
              <ExperienceCard key={entry.id} entry={entry} />
            ))}
          </div>
        </StoneSectionCard>
      )}

      {/* ART SECTION: Fog Gate - after Experience, before the stack */}
      <FogGateArtSection />

      <StoneSectionCard className="mb-8" ariaLabelledby="skills-heading">
        <h2 id="skills-heading" className="text-sm tracking-[0.3em] mb-4 flex items-center gap-2 uppercase" style={{ color: COLORS.bonfire }}>
          <Darksign size={16} />
          Tech Stack
        </h2>
        <TechCloud categories={sections.techStack} />
      </StoneSectionCard>

      {/* Save rooms / Projects */}
      <section aria-labelledby="projects-heading" className="mb-8">
        <h2 id="projects-heading" className="text-sm tracking-[0.3em] mb-4 flex items-center gap-2 uppercase" style={{ color: '#88cc55' }}>
          <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" style={{ boxShadow: '0 0 10px #88cc55' }} aria-hidden="true" />
          Projects
        </h2>
        <ProjectList
          projects={sections.projects}
          className="grid md:grid-cols-2 gap-3"
          renderProject={(slot) => <SaveRoomCard slot={slot} />}
        />
      </section>

      {/* ART SECTION: Praise the Sun - after Projects, before Ventures */}
      <PraiseTheSunArtSection />

      <section className="mt-8" aria-labelledby="companies-heading">
        <FogGate />
        <h2 id="companies-heading" className="text-sm tracking-[0.3em] mb-4 text-center uppercase" style={{ color: COLORS.bonfire }}>
          Ventures
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {sections.companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </section>
    </>
  )
}

export function MusicianZone({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { musician, bands } = sections

  return (
    <>
      <BonfireArtSection />

      <StoneSectionCard className="mb-8" ariaLabelledby="bands-heading" glowColor="#9966ff">
        <SectionHeading id="bands-heading" color="#b090ff">Bands</SectionHeading>
        <p className="text-sm mb-4" style={{ color: '#b0a090' }}>
          Drums since {musician.since}, {musician.yearsPlaying} years
        </p>
        <BandList bands={bands} className="grid md:grid-cols-3 gap-4" renderBand={(slot) => <BandCard {...slot} />} />
        <p className="text-sm mt-4 italic" style={{ color: '#c0b0a0' }}>{musician.line}</p>
      </StoneSectionCard>

      <PraiseTheSunArtSection />
    </>
  )
}

export function MartialArtistZone({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections

  return (
    <>
      <FogGateArtSection />

      <StoneSectionCard className="mb-8" ariaLabelledby="muay-thai-heading" glowColor="#ff4444">
        <SectionHeading id="muay-thai-heading" color="#ff7070">Muay Thai</SectionHeading>
        <h3 className="text-base tracking-wider mb-4" style={{ color: '#c0a080' }}>{martialArts.primary.title}</h3>
        <MuayThaiRecord
          martialArts={martialArts}
          classNames={{
            facts: 'grid sm:grid-cols-2 gap-3 mb-4',
            fact: 'p-3 bg-[#12100f] border border-[#3a3633]',
            term: 'text-sm tracking-[0.2em] uppercase text-[#ff8c42]',
            value: 'text-sm mt-1 text-[#c0b0a0]',
            achievements: 'space-y-1',
            achievement: 'text-sm flex items-start gap-2 text-[#b0a090]',
          }}
          renderAchievement={(achievement) => (
            <>
              <span className="text-[#ff6a00]/80" aria-hidden="true">◆</span>
              {achievement}
            </>
          )}
        />
      </StoneSectionCard>

      <PraiseTheSunArtSection />
    </>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerZone,
  drummer: MusicianZone,
  fighter: MartialArtistZone,
}
