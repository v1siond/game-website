'use client'

import { useCVData } from '@/components/cv/CVDataProvider'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { ArcadeSectionCard } from './frames'
import { ArcadeText } from './badges'
import { BandCard, ExperienceCard, FightCard, TeamCard } from './cards'
import { ArtSeparator } from './separators'
import { COLORS } from './palette'

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      <ArcadeSectionCard color={COLORS.specialBlue} title="About" titleIcon="►" id="about-heading">
        <p className="text-base leading-relaxed" style={{ color: COLORS.chrome, fontFamily: 'system-ui, sans-serif' }}>
          {professionalSummary.bio}
        </p>
      </ArcadeSectionCard>

      {/* ART SECTION 1: VS Badge separator (after About) */}
      <ArtSeparator type="versus" />

      {sections.jobs.length > 0 && (
        <ArcadeSectionCard color={COLORS.p1Blue} title="Work Experience" titleIcon="▶▶" id="experience-heading">
          <div className="grid md:grid-cols-2 gap-6">
            {sections.jobs.map((entry) => (
              <ExperienceCard key={entry.id} entry={entry} />
            ))}
          </div>
        </ArcadeSectionCard>
      )}

      {/* ART SECTION 2: Lightning separator (after Experience) */}
      <ArtSeparator type="lightning" />

      <ArcadeSectionCard color={COLORS.specialBlue} title="Tech Stack" titleIcon="▶▶▶" id="tech-stack-heading">
        <div className="space-y-8">
          {sections.techStack.map((category) => (
            <div key={category.id}>
              <h3
                className="text-base mb-4 flex items-center gap-3 tracking-[0.2em] uppercase"
                style={{
                  fontFamily: '"Impact", "Arial Black", sans-serif',
                  color: '#FFF',
                  textShadow: `0 0 8px ${COLORS.specialBlue}60`,
                }}
              >
                <span aria-hidden="true">{category.icon}</span>
                {category.name}
              </h3>
              <ul
                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2"
                aria-label={`${category.name} technologies`}
              >
                {category.items.map((tech) => (
                  <li
                    key={tech}
                    className="px-3 py-2 text-sm"
                    style={{
                      background: `${COLORS.arcadeGray}cc`,
                      border: `1px solid ${COLORS.chromeDarker}`,
                      borderRadius: '2px',
                      color: COLORS.chrome,
                    }}
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ArcadeSectionCard>

      <ArcadeSectionCard color={COLORS.gold} title="Projects" titleIcon="★" id="projects-heading">
        <ProjectList
          projects={sections.projects}
          className="grid md:grid-cols-2 gap-6"
          renderProject={(slot) => <FightCard {...slot} />}
        />
      </ArcadeSectionCard>

      {/* ART SECTION 3: Flames separator (after Projects) */}
      <ArtSeparator type="flames" />

      <ArcadeSectionCard color={COLORS.specialBlue} title="Ventures" titleIcon="▶▶▶▶" id="ventures-heading">
        <div className="grid md:grid-cols-3 gap-6">
          {sections.companies.map((company) => (
            <TeamCard key={company.id} company={company} />
          ))}
        </div>
      </ArcadeSectionCard>
    </>
  )
}

export function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { musician, bands } = sections

  return (
    <>
      <ArtSeparator type="lightning" />
      <ArcadeSectionCard color={COLORS.neonPink} title="Bands" titleIcon="♪♪♪" id="bands-heading">
        <p className="text-base mb-6" style={{ color: COLORS.chrome, fontFamily: 'system-ui, sans-serif' }}>
          Drums since {musician.since}, {musician.yearsPlaying} years
        </p>
        <BandList bands={bands} className="grid md:grid-cols-3 gap-6" renderBand={(slot) => <BandCard {...slot} />} />
        <p className="text-sm mt-6 italic" style={{ color: COLORS.neonPinkLight }}>
          {musician.line}
        </p>
      </ArcadeSectionCard>
    </>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections

  return (
    <>
      <ArtSeparator type="flames" />
      <ArcadeSectionCard color={COLORS.orange} title="Muay Thai" titleIcon="▶▶▶" id="muay-thai-heading">
        <h3
          className="text-xl mb-6 tracking-[0.15em] uppercase"
          style={{
            fontFamily: '"Impact", "Arial Black", sans-serif',
            color: COLORS.gold,
            textShadow: `0 0 12px ${COLORS.gold}60`,
          }}
        >
          {martialArts.primary.title}
        </h3>
        <MuayThaiRecord
          martialArts={martialArts}
          classNames={{
            facts: 'grid sm:grid-cols-2 gap-4 mb-6',
            fact: 'px-4 py-3 border-l-4 border-[#FF6600] bg-[#FF6600]/10',
            term: 'text-sm tracking-[0.2em] uppercase font-black text-[#FFD700]',
            value: 'text-sm mt-1 text-white',
            achievements: 'space-y-2',
            achievement: 'text-sm flex items-start gap-3 text-white',
          }}
          renderAchievement={(achievement) => (
            <>
              <span aria-hidden="true">
                <ArcadeText text="HIT" type="combo" size="sm" />
              </span>
              <span>{achievement}</span>
            </>
          )}
        />
      </ArcadeSectionCard>
    </>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}
