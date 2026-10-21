'use client'

import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList, type BandSlot } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { PROFESSION_LABELS, type Profession } from '@/lib/cv/professions'
import type { ProfessionSections } from '@/lib/cv/cvView'
import { useCVData } from '@/components/cv/CVDataProvider'
import { CompanyCard, BandCard, CyberPanel, ExperienceCard, ProjectCard, TechCategory } from './cards'
import { CyberArtSection } from './backdrop'

// The cyberware slot each profession's selector option shows.
export const PROFESSION_CYBERWARE: Record<Profession, 'chip' | 'jack' | 'arm'> = {
  drummer: 'jack',
  engineer: 'chip',
  fighter: 'arm',
}

// The selector's state line reads the profession the way the terminal would type it.
export const terminalName = (profession: Profession): string => PROFESSION_LABELS[profession].toUpperCase().replace(/\s+/g, '_')

// Email is the lit primary action, LinkedIn the outlined one.
const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: 'bg-pink-500 text-black hover:bg-pink-400',
  linkedin: 'border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black',
}

const HUD_BUTTON =
  'inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-sm tracking-wider font-mono transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 [clip-path:polygon(8px_0,100%_0,calc(100%-8px)_100%,0_100%)]'

export function HeroAction({ action }: { action: HeroActionSlot }) {
  return (
    <a {...action.linkProps} className={`${HUD_BUTTON} ${HERO_ACTION_LOOK[action.id]}`}>
      [{action.label.toUpperCase()}]
    </a>
  )
}

export function CVLink() {
  return (
    <Link href="/cv" className={`${HUD_BUTTON} border border-white/60 text-white hover:bg-white hover:text-black`}>
      [GET_THE_CV]
    </Link>
  )
}

type SectionsOf<Id extends Profession> = Extract<ProfessionSections, { profession: Id }>

export function EngineerPanels({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary, companies } = useCVData()

  return (
    <>
      <div className="mb-8">
        <CyberPanel title="About" accentColor="#ffff00" holographic>
          <p className="text-sm text-white/80 leading-relaxed font-mono">{professionalSummary.bio}</p>
        </CyberPanel>
      </div>

      <CyberArtSection variant="neon" />

      {sections.jobs.length > 0 && (
        <div className="mb-8">
          <CyberPanel title="Work Experience" accentColor="#00ff66" holographic>
            <div className="space-y-3">
              {sections.jobs.map((entry) => (
                <ExperienceCard key={entry.id} entry={entry} />
              ))}
            </div>
          </CyberPanel>
        </div>
      )}

      <CyberArtSection variant="circuit" />

      <div className="mb-8">
        <CyberPanel title="Tech Stack" accentColor="#00ffff" holographic megacorpStyle>
          {sections.techStack.map((category) => (
            <TechCategory key={category.id} category={category} />
          ))}
        </CyberPanel>
      </div>

      <div className="mb-8">
        <CyberPanel title="Projects" accentColor="#ff00ff" holographic>
          <ProjectList
            projects={sections.projects}
            className="grid md:grid-cols-2 gap-3"
            renderProject={(slot) => <ProjectCard {...slot} />}
          />
        </CyberPanel>
      </div>

      <div className="mb-8">
        <CyberPanel title="Ventures" accentColor="#ff00ff" holographic megacorpStyle>
          <div className="grid md:grid-cols-3 gap-4">
            {companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </CyberPanel>
      </div>
    </>
  )
}

export function MusicianPanels({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { musician, bands } = sections

  return (
    <div className="mb-8">
      <CyberPanel title="Bands" accentColor="#9966cc" holographic>
        <p className="text-sm text-white/80 font-mono mb-4">
          Drums since {musician.since}, {musician.yearsPlaying} years
        </p>
        <BandList
          bands={bands}
          className="grid md:grid-cols-2 gap-4"
          renderBand={(slot: BandSlot) => <BandCard {...slot} />}
        />
        <p className="text-sm text-white/80 font-mono mt-4">
          <span className="text-pink-400" aria-hidden="true">&gt; </span>
          {musician.line}
        </p>
      </CyberPanel>
    </div>
  )
}

export function MartialArtistPanels({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections

  return (
    <div className="mb-8">
      <CyberPanel title="Muay Thai" accentColor="#ff0066" holographic>
        <h3 className="text-base text-pink-400 font-mono mb-4">{martialArts.primary.title}</h3>
        <MuayThaiRecord
          martialArts={martialArts}
          classNames={{
            facts: 'grid sm:grid-cols-2 gap-3 mb-4',
            fact: 'p-3 border border-white/10 bg-white/5',
            term: 'text-sm tracking-wider text-cyan-400 font-mono uppercase',
            value: 'text-sm text-white/90 mt-1',
            achievements: 'space-y-1',
            achievement: 'text-sm text-yellow-300 font-mono',
          }}
          renderAchievement={(achievement) => (
            <>
              <span className="text-pink-400" aria-hidden="true">&gt; </span>
              {achievement}
            </>
          )}
        />
      </CyberPanel>
    </div>
  )
}

export function ProfessionPanels({ sections }: { sections: ProfessionSections }) {
  if (sections.profession === 'drummer') return <MusicianPanels sections={sections} />
  if (sections.profession === 'fighter') return <MartialArtistPanels sections={sections} />
  return <EngineerPanels sections={sections} />
}
