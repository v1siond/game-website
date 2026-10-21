'use client'

import { useCVData } from '@/components/cv/CVDataProvider'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { BORDERLANDS_COLORS } from './palette'
import { ArtSectionBreak } from './separators'
import { ComicPanel, HEADING_BANNER, SpeechBubble } from './panels'
import { CompanyCard, ExperienceCard, LootCard, BandCard, TechStackCloud, rarityFor } from './cards'

function EngineerPanels({ sections, reducedMotion }: { sections: SectionsOf<'engineer'>; reducedMotion: boolean }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      {/* 1. About / Bio speech bubble */}
      <section className="mb-8" aria-label="About">
        <SpeechBubble ariaLabel="About me">
          <p className="text-sm leading-relaxed relative z-10 font-sans" style={{ color: BORDERLANDS_COLORS.ink }}>
            {professionalSummary.bio}
          </p>
        </SpeechBubble>
      </section>

      {/* ART SECTION 1: Vault symbols with psycho masks */}
      <ArtSectionBreak variant={1} reducedMotion={reducedMotion} />

      {/* 2. Work Experience */}
      {sections.jobs.length > 0 && (
        <section className="mb-8">
          <ComicPanel rotation={0.5} accentColor={BORDERLANDS_COLORS.legendary} title="Work Experience" ariaLabel="Work Experience">
            <div className="mt-4">
              {sections.jobs.map((entry, i) => (
                <ExperienceCard key={entry.id} entry={entry} index={i} reducedMotion={reducedMotion} />
              ))}
            </div>
          </ComicPanel>
        </section>
      )}

      {/* ART SECTION 2: Loot drops with weapons */}
      <ArtSectionBreak variant={2} reducedMotion={reducedMotion} />

      {/* 3. Tech Stack */}
      <section className="mb-8">
        <ComicPanel rotation={-0.5} accentColor={BORDERLANDS_COLORS.rare} title="Tech Stack" ariaLabel="Tech Stack">
          <div className="mt-4">
            <TechStackCloud categories={sections.techStack} reducedMotion={reducedMotion} />
          </div>
        </ComicPanel>
      </section>

      {/* 4. Projects as loot drops */}
      <section className="mb-8" aria-label="Projects">
        <div className="text-center mb-6" style={{ transform: 'rotate(1deg)' }}>
          <h2 className={`${HEADING_BANNER} text-[#1a1a1a] bg-gradient-to-br from-[#ffcc00] to-[#f0c850] [text-shadow:2px_2px_0_#ff9500]`}>
            Featured Work
          </h2>
        </div>
        <ProjectList
          projects={sections.projects}
          className="grid md:grid-cols-2 gap-6"
          renderProject={(slot) => (
            <LootCard
              slot={slot}
              rarity={rarityFor(slot.project, sections.projects.indexOf(slot.project))}
              reducedMotion={reducedMotion}
            />
          )}
        />
      </section>

      {/* ART SECTION 3: Action lines with Claptrap */}
      <ArtSectionBreak variant={3} reducedMotion={reducedMotion} />

      {/* 5. Ventures */}
      <section className="mb-8" aria-label="Ventures">
        <div className="text-center mb-6" style={{ transform: 'rotate(-1deg)' }}>
          <h2 className={`${HEADING_BANNER} text-[#1a1a1a] bg-gradient-to-br from-[#ffcc00] to-[#f0c850]`}>
            VENTURES
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {sections.companies.map((company) => (
            <CompanyCard key={company.id} company={company} reducedMotion={reducedMotion} />
          ))}
        </div>
      </section>
    </>
  )
}

function MusicianPanels({ sections, reducedMotion }: { sections: SectionsOf<'drummer'>; reducedMotion: boolean }) {
  const { musician, bands } = sections

  return (
    <>
      <ArtSectionBreak variant={1} reducedMotion={reducedMotion} />

      <section className="mb-8" aria-label="Bands">
        <div className="text-center mb-6" style={{ transform: 'rotate(1deg)' }}>
          <h2 className={`${HEADING_BANNER} text-[#f5ecd5] bg-gradient-to-br from-[#9966cc] to-[#7744aa]`}>
            BANDS
          </h2>
        </div>
        <p className="text-sm font-bold text-center mb-6 font-sans" style={{ color: BORDERLANDS_COLORS.ink }}>
          Drums since {musician.since}, {musician.yearsPlaying} years
        </p>
        <BandList
          bands={bands}
          className="grid md:grid-cols-3 gap-6"
          renderBand={(slot) => <BandCard slot={slot} reducedMotion={reducedMotion} />}
        />
        <p className="text-sm font-bold text-center mt-6 font-sans" style={{ color: BORDERLANDS_COLORS.ink }}>
          {musician.line}
        </p>
      </section>

      <ArtSectionBreak variant={3} reducedMotion={reducedMotion} />
    </>
  )
}

function MartialArtistPanels({ sections, reducedMotion }: { sections: SectionsOf<'fighter'>; reducedMotion: boolean }) {
  const { martialArts } = sections

  return (
    <>
      <ArtSectionBreak variant={2} reducedMotion={reducedMotion} />

      <section className="mb-8">
        <ComicPanel rotation={-0.5} accentColor={BORDERLANDS_COLORS.psychoRed} title="Muay Thai" ariaLabel="Muay Thai">
          <h3 className="text-lg font-black mt-4 mb-4" style={{ color: BORDERLANDS_COLORS.ink }}>
            {martialArts.primary.title}
          </h3>
          <MuayThaiRecord
            martialArts={martialArts}
            classNames={{
              facts: 'grid sm:grid-cols-2 gap-3 mb-4 font-sans',
              fact: 'p-3 bg-white border-[3px] border-[#1a1a1a] shadow-[2px_2px_0_#1a1a1a]',
              term: 'text-sm font-black tracking-wider uppercase text-[#1a1a1a]',
              value: 'text-sm mt-1 text-[#1a1a1a]',
              achievements: 'space-y-1.5 font-sans',
              achievement: 'text-sm font-bold flex items-start gap-2 text-[#1a1a1a]',
            }}
            renderAchievement={(achievement) => (
              <>
                <span className="text-[#cc2222]" aria-hidden="true">◆</span>
                {achievement}
              </>
            )}
          />
        </ComicPanel>
      </section>

      <ArtSectionBreak variant={3} reducedMotion={reducedMotion} />
    </>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews<{ reducedMotion: boolean }> = {
  engineer: EngineerPanels,
  drummer: MusicianPanels,
  fighter: MartialArtistPanels,
}
