import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { useCVData } from '@/components/cv/CVDataProvider'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { COLORS } from './palette'
import { AkuAkuMask, Crystal, GemIcon, TNTCrate, WoodenCrate, WumpaFruit } from './icons'
import { CratePanel } from './panels'
import { CrateStackArt, JungleSceneArt, WarpPortalArt } from './art'
import { BandCard, ExperienceCard, ProjectCard, TechCrates, VentureCard } from './cards'

// ============================================================================
// PROFESSION SECTIONS - what each profession shows, from the content files
// ============================================================================

export function EngineerSections({ sections, reducedMotion }: { sections: SectionsOf<'engineer'>; reducedMotion: boolean }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      <div className="relative z-20 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <CratePanel title="About" titleIcon={<AkuAkuMask size={35} animated={!reducedMotion} />} variant="checkpoint">
            <p className="text-base leading-relaxed" style={{ color: '#fff' }}>
              {professionalSummary.bio}
            </p>
          </CratePanel>
        </div>
      </div>

      {/* ART SECTION 1: JUNGLE SCENE (After About) */}
      <JungleSceneArt reducedMotion={reducedMotion} />

      {sections.jobs.length > 0 && (
        <div className="relative z-20 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <CratePanel title="Work Experience" titleIcon={<WoodenCrate size={28} variant="checkpoint" />} variant="temple">
              <div className="space-y-4">
                {sections.jobs.map((entry) => (
                  <ExperienceCard key={entry.id} entry={entry} />
                ))}
              </div>
            </CratePanel>
          </div>
        </div>
      )}

      {/* ART SECTION 2: CRATE STACK (After Experience) */}
      <CrateStackArt reducedMotion={reducedMotion} />

      <div className="relative z-20 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <CratePanel title="Tech Stack" titleIcon={<WoodenCrate size={28} />} variant="wood">
            <TechCrates categories={sections.techStack} />
          </CratePanel>
        </div>
      </div>

      <div className="relative z-20 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <CratePanel title="Projects" titleIcon={<TNTCrate size={32} />} variant="tnt">
            <ProjectList
              projects={sections.projects}
              className="grid md:grid-cols-2 gap-4"
              renderProject={(slot) => <ProjectCard {...slot} />}
            />
          </CratePanel>
        </div>
      </div>

      {/* ART SECTION 3: WARP PORTAL (After Projects) */}
      <WarpPortalArt reducedMotion={reducedMotion} />

      {sections.companies.length > 0 && (
        <div className="relative z-20 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <CratePanel title="Ventures" titleIcon={<Crystal size={28} />} variant="checkpoint">
              <div className="grid md:grid-cols-3 gap-4">
                {sections.companies.map((company) => (
                  <VentureCard key={company.id} company={company} />
                ))}
              </div>
            </CratePanel>
          </div>
        </div>
      )}
    </>
  )
}

export function MusicianSections({ sections, reducedMotion }: { sections: SectionsOf<'drummer'>; reducedMotion: boolean }) {
  const { musician, bands } = sections

  return (
    <>
      <JungleSceneArt reducedMotion={reducedMotion} />
      <div className="relative z-20 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <CratePanel title="Bands" titleIcon={<GemIcon size={26} color="purple" />} variant="nitro">
            <p className="text-base mb-6" style={{ color: '#fff' }}>
              Drums since {musician.since}, {musician.yearsPlaying} years
            </p>
            <BandList bands={bands} className="grid md:grid-cols-3 gap-4" renderBand={(slot) => <BandCard {...slot} />} />
            <p className="text-sm mt-6 italic" style={{ color: COLORS.nitroBright }}>
              {musician.line}
            </p>
          </CratePanel>
        </div>
      </div>
      <CrateStackArt reducedMotion={reducedMotion} />
    </>
  )
}

export function MartialArtistSections({ sections, reducedMotion }: { sections: SectionsOf<'fighter'>; reducedMotion: boolean }) {
  const { martialArts } = sections

  return (
    <>
      <CrateStackArt reducedMotion={reducedMotion} />
      <div className="relative z-20 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <CratePanel title="Muay Thai" titleIcon={<TNTCrate size={32} />} variant="tnt">
            <h3
              className="text-xl font-black mb-6"
              style={{ color: '#fff', fontFamily: 'Impact, Arial Black, sans-serif', textShadow: '2px 2px 0 #000' }}
            >
              {martialArts.primary.title}
            </h3>
            <MuayThaiRecord
              martialArts={martialArts}
              classNames={{
                facts: 'grid sm:grid-cols-2 gap-4 mb-6',
                fact: 'p-3 rounded-lg border-2 border-[#FFD700] bg-[#5c1a00]',
                term: 'text-sm tracking-widest uppercase font-black text-[#FFD700]',
                value: 'text-sm mt-1 text-white',
                achievements: 'space-y-2',
                achievement: 'text-sm flex items-start gap-2 text-white',
              }}
              renderAchievement={(achievement) => (
                <>
                  <WumpaFruit size={14} className="flex-shrink-0 mt-0.5" />
                  <span>{achievement}</span>
                </>
              )}
            />
          </CratePanel>
        </div>
      </div>
      <WarpPortalArt reducedMotion={reducedMotion} />
    </>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews<{ reducedMotion: boolean }> = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}
