'use client'

import { useCVData } from '@/components/cv/CVDataProvider'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import type { Profession } from '@/lib/cv/professions'
import type { ProfessionSections } from '@/lib/cv/cvView'
import { PORTAL } from './palette'
import { ApertureLogo, ArtSectionCubeAndTurrets, ArtSectionPortals, ArtSectionTestChamber } from './art'
import { BandCard, ExperienceCard, ProjectCard, TechTerminal, VentureCard } from './cards'

// ============================================================================
// SECTION WRAPPER - Test Chamber Panel Style
// ============================================================================

function TestChamberSection({
  children,
  title,
  notice,
  id,
}: {
  children: React.ReactNode
  title: string
  notice?: string
  id: string
}) {
  return (
    <section
      className="relative"
      aria-labelledby={`section-${id}`}
    >
      {/* Top caution stripe */}
      <div
        className="h-1.5"
        style={{
          background: `repeating-linear-gradient(
            90deg,
            ${PORTAL.CAUTION_YELLOW},
            ${PORTAL.CAUTION_YELLOW} 10px,
            ${PORTAL.CAUTION_BLACK} 10px,
            ${PORTAL.CAUTION_BLACK} 20px
          )`,
        }}
        aria-hidden="true"
      />

      {/* Portal glow edges */}
      <div
        className="absolute top-1.5 bottom-1.5 left-0 w-0.5 z-10"
        style={{
          background: `linear-gradient(180deg, ${PORTAL.ORANGE}60, ${PORTAL.ORANGE}30, ${PORTAL.ORANGE}60)`,
          boxShadow: `0 0 12px ${PORTAL.ORANGE}40`,
        }}
        aria-hidden="true"
      />
      <div
        className="absolute top-1.5 bottom-1.5 right-0 w-0.5 z-10"
        style={{
          background: `linear-gradient(180deg, ${PORTAL.BLUE}60, ${PORTAL.BLUE}30, ${PORTAL.BLUE}60)`,
          boxShadow: `0 0 12px ${PORTAL.BLUE}40`,
        }}
        aria-hidden="true"
      />

      {/* Content area */}
      <div
        className="relative px-5 py-5"
        style={{
          background: `
            linear-gradient(180deg, ${PORTAL.CHAMBER_BG}f8, ${PORTAL.VOID}fc),
            repeating-linear-gradient(0deg, transparent, transparent 24px, ${PORTAL.PANEL_WHITE}03 24px, ${PORTAL.PANEL_WHITE}03 25px),
            repeating-linear-gradient(90deg, transparent, transparent 24px, ${PORTAL.PANEL_WHITE}03 24px, ${PORTAL.PANEL_WHITE}03 25px)
          `,
        }}
      >
        {/* Corner screws */}
        {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos, i) => (
          <div
            key={i}
            className={`absolute ${pos} w-2 h-2 rounded-full`}
            style={{
              background: `radial-gradient(circle at 35% 35%, ${PORTAL.METAL_LIGHT}, ${PORTAL.METAL_MID})`,
              boxShadow: 'inset 1px 1px 1px rgba(0,0,0,0.25)',
            }}
            aria-hidden="true"
          />
        ))}

        {/* Section header */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="flex-1 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${PORTAL.ORANGE}35)` }}
            aria-hidden="true"
          />
          <div className="flex items-center gap-2">
            <ApertureLogo size={16} color={PORTAL.BLUE} />
            <h2
              id={`section-${id}`}
              className="text-xs tracking-[0.2em] uppercase font-medium"
              style={{ color: PORTAL.BLUE }}
            >
              {title}
            </h2>
          </div>
          <div
            className="flex-1 h-px"
            style={{ background: `linear-gradient(90deg, ${PORTAL.BLUE}35, transparent)` }}
            aria-hidden="true"
          />
        </div>

        {/* Optional notice */}
        {notice && (
          <div className="mb-4 flex justify-center">
            <div
              className="inline-flex items-center gap-2 px-3 py-1"
              style={{
                background: `repeating-linear-gradient(
                  -45deg,
                  ${PORTAL.CAUTION_YELLOW}15,
                  ${PORTAL.CAUTION_YELLOW}15 6px,
                  transparent 6px,
                  transparent 12px
                )`,
                border: `1px solid ${PORTAL.CAUTION_YELLOW}40`,
              }}
            >
              <span className="text-[9px] font-bold tracking-wider" style={{ color: PORTAL.CAUTION_YELLOW }}>
                NOTICE:
              </span>
              <span className="text-[9px]" style={{ color: PORTAL.PANEL_WHITE }}>
                {notice}
              </span>
            </div>
          </div>
        )}

        {children}
      </div>

      {/* Bottom caution stripe */}
      <div
        className="h-1.5"
        style={{
          background: `repeating-linear-gradient(
            90deg,
            ${PORTAL.CAUTION_BLACK},
            ${PORTAL.CAUTION_BLACK} 10px,
            ${PORTAL.CAUTION_YELLOW} 10px,
            ${PORTAL.CAUTION_YELLOW} 20px
          )`,
        }}
        aria-hidden="true"
      />
    </section>
  )
}

type SectionsOf<Id extends Profession> = Extract<ProfessionSections, { profession: Id }>

function EngineerChambers({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      {/* 1. ABOUT */}
      <TestChamberSection title="About" notice="CLEARANCE LEVEL: AUTHORIZED" id="about">
        <p className="text-sm leading-relaxed" style={{ color: PORTAL.PANEL_WHITE }}>
          {professionalSummary.bio}
        </p>
      </TestChamberSection>

      {/* 2. ART SECTION - Portals */}
      <ArtSectionPortals />

      {/* 3. EXPERIENCE */}
      {sections.jobs.length > 0 && (
        <TestChamberSection title="Work Experience" id="experience">
          <div className="space-y-3">
            {sections.jobs.map((entry, i) => (
              <ExperienceCard key={entry.id} entry={entry} index={i} />
            ))}
          </div>
        </TestChamberSection>
      )}

      {/* 4. ART SECTION - Cube & Turrets */}
      <ArtSectionCubeAndTurrets />

      {/* 5. TECH STACK */}
      <TestChamberSection title="Tech Stack" id="skills">
        <TechTerminal categories={sections.techStack} />
      </TestChamberSection>

      {/* 6. PROJECTS */}
      <TestChamberSection title="Projects" notice="RESULTS VERIFIED" id="projects">
        <ProjectList
          projects={sections.projects}
          className="grid md:grid-cols-2 gap-4"
          renderProject={(slot) => <ProjectCard slot={slot} index={sections.projects.indexOf(slot.project)} />}
        />
      </TestChamberSection>

      {/* 7. ART SECTION - Test Chamber Elements */}
      <ArtSectionTestChamber />

      {/* 8. VENTURES */}
      <TestChamberSection title="Ventures" id="ventures">
        <div className="grid md:grid-cols-3 gap-4">
          {sections.companies.map((company) => (
            <VentureCard key={company.id} company={company} />
          ))}
        </div>
      </TestChamberSection>
    </>
  )
}

function MusicianChambers({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { musician, bands } = sections

  return (
    <>
      <ArtSectionPortals />

      <TestChamberSection title="Bands" id="bands">
        <p className="text-sm mb-4" style={{ color: PORTAL.PANEL_WHITE }}>
          Drums since {musician.since}, {musician.yearsPlaying} years
        </p>
        <BandList bands={bands} className="grid md:grid-cols-3 gap-4" renderBand={(slot) => <BandCard {...slot} />} />
        <p className="text-sm mt-4 italic" style={{ color: PORTAL.BLUE }}>{musician.line}</p>
      </TestChamberSection>

      <ArtSectionTestChamber />
    </>
  )
}

function MartialArtistChambers({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections

  return (
    <>
      <ArtSectionCubeAndTurrets />

      <TestChamberSection title="Muay Thai" id="muay-thai">
        <h3 className="text-sm tracking-wider uppercase mb-4 text-[#FF9A00]">{martialArts.primary.title}</h3>
        <MuayThaiRecord
          martialArts={martialArts}
          classNames={{
            facts: 'grid sm:grid-cols-2 gap-3 mb-4',
            fact: 'p-3 border border-[#00A2FF]/25 bg-[#00A2FF]/5',
            term: 'text-sm tracking-wider uppercase text-[#00A2FF]',
            value: 'text-sm mt-1 text-[#E8E8E8]',
            achievements: 'space-y-1.5',
            achievement: 'text-sm flex items-start gap-2 text-[#E8E8E8]',
          }}
          renderAchievement={(achievement) => (
            <>
              <span className="text-[#FF9A00]" aria-hidden="true">^</span>
              {achievement}
            </>
          )}
        />
      </TestChamberSection>

      <ArtSectionTestChamber />
    </>
  )
}

export function ProfessionChambers({ sections }: { sections: ProfessionSections }) {
  if (sections.profession === 'drummer') return <MusicianChambers sections={sections} />
  if (sections.profession === 'fighter') return <MartialArtistChambers sections={sections} />
  return <EngineerChambers sections={sections} />
}
