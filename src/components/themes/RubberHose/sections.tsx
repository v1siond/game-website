'use client'

import { useCVData } from '@/components/cv/CVDataProvider'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { ArtBreak, CurlBanner, PieEyes } from './art'
import { HOSE } from './palette'
import { BandRecord, CompanyPoster, ExperienceCard, TechBubbleCloud } from './cards'
import { Reveal, staggerAt } from './scenes'
import { ParryBoard } from './parry'
import world from './world.module.css'
import styles from './scenes.module.css'
import { drumsSince } from '@/components/cv/sectionText'

// The picked profession's sections. About, Tech Stack and Ventures fade in. Work Experience is a boss's
// phases: each job a phase card dropping in with a squash, in masonry. Featured Work is the parry board
// (./parry). Bands is the shop shelf, each record's disc spinning up under the pointer. The Muay Thai
// record opens on the knockout slam, its achievements landing as hit stars, the bell swinging on hover.
// The art breaks between them are a film leader, a sing along line and pie eyed balls.

const LEAD = `text-center text-base ${world.ink}`

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      <FadeInScene>
        <section aria-labelledby="hose-about">
          <CurlBanner id="hose-about">About</CurlBanner>
          <p className={`mx-auto max-w-2xl leading-relaxed ${LEAD}`}>{professionalSummary.bio}</p>
        </section>
      </FadeInScene>

      <ArtBreak kind="filmLeader" />

      {sections.jobs.length > 0 && (
        <section aria-labelledby="hose-work-experience" className="mb-8">
          <CurlBanner id="hose-work-experience">Work Experience</CurlBanner>
          <Reveal>
            {({ played }) => (
              <ul className={`pt-4 ${MASONRY_LIST}`}>
                {sections.jobs.map((entry, index) => (
                  <li key={entry.id} className={`${MASONRY_ITEM} pt-4 ${staggerAt(index)} ${played ? styles.phaseIn : styles.phaseWait}`}>
                    <div className={styles.breathe}>
                      <ExperienceCard entry={entry} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
        </section>
      )}

      <ArtBreak kind="singAlong" />

      <FadeInScene>
        <section aria-labelledby="hose-tech-stack">
          <CurlBanner id="hose-tech-stack">Tech Stack</CurlBanner>
          <div className={`mx-auto max-w-3xl p-6 ${world.poster} ${world.posterWide}`}>
            <TechBubbleCloud categories={sections.techStack} />
          </div>
        </section>
      </FadeInScene>

      <section aria-labelledby="hose-featured-work" className="mb-8">
        <CurlBanner id="hose-featured-work">Featured Work</CurlBanner>
        <ParryBoard projects={sections.projects} />
      </section>

      <ArtBreak kind="bouncingBalls" />

      <FadeInScene>
        <section aria-labelledby="hose-ventures">
          <CurlBanner id="hose-ventures">Ventures</CurlBanner>
          <ul className="grid gap-4 md:grid-cols-3">
            {sections.companies.map((company) => (
              <li key={company.id}>
                <CompanyPoster company={company} />
              </li>
            ))}
          </ul>
        </section>
      </FadeInScene>
    </>
  )
}

export function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { musician, bands } = sections

  return (
    <>
      <ArtBreak kind="singAlong" />
      <section aria-labelledby="hose-bands" className="mb-8">
          <CurlBanner id="hose-bands">Bands</CurlBanner>
          <p className={`mb-6 ${LEAD}`}>
            {drumsSince(musician)}
          </p>
          <BandList bands={bands} className={MASONRY_LIST} itemClassName={MASONRY_ITEM} renderBand={(slot) => <BandRecord {...slot} />} />
          <p className={`mt-6 italic ${LEAD} ${world.red}`}>{musician.line}</p>
        </section>
    </>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections

  return (
    <>
      <ArtBreak kind="bouncingBalls" />
      <section aria-labelledby="hose-muay-thai" className="mb-8">
        <CurlBanner id="hose-muay-thai">Muay Thai</CurlBanner>
        <Reveal className={`relative mx-auto max-w-3xl p-6 ${world.poster} ${world.posterWide}`}>
          {({ played }) => (
            <>
            <RingBell />
            <h3 className={`mb-6 text-center text-2xl ${world.red} ${world.lettering} ${world.dropText} ${played ? styles.koSlam : styles.koWait}`}>
              {martialArts.primary.title}
            </h3>
            <MuayThaiRecord
              martialArts={martialArts}
              classNames={{
                facts: 'grid sm:grid-cols-2 gap-4 mb-6',
                fact: `p-3 ${world.fact}`,
                term: `text-sm tracking-widest uppercase ${world.red}`,
                value: `text-sm mt-1 ${world.ink}`,
                achievements: 'space-y-4',
                achievement: `text-sm ${world.ink}`,
              }}
              renderAchievement={(achievement) => (
                <p className={`flex items-start gap-2 p-4 ${world.titleCard}`}>
                  <span className={`inline-block ${world.red} ${staggerAt(martialArts.primary.achievements.indexOf(achievement))} ${played ? styles.hitIn : styles.hitWait}`} aria-hidden="true">
                    ★
                  </span>
                  <span>{achievement}</span>
                </p>
              )}
            />
            </>
          )}
        </Reveal>
      </section>
    </>
  )
}

// The ring bell in the poster's corner, swinging when the pointer lands on it.
function RingBell() {
  return (
    <div className={`absolute right-3 top-3 h-12 w-10 ${styles.bellBox}`} aria-hidden="true">
      <svg viewBox="0 0 24 30" className={`h-full w-full ${world.inked}`} focusable="false">
        <rect x={10} y={0} width={4} height={6} fill={HOSE.ink} />
        <g className={styles.bell}>
          <path d="M3 24 Q3 6 12 6 Q21 6 21 24 Z" fill={HOSE.gold} />
          <ellipse cx={9} cy={13} rx={2} ry={4} fill={HOSE.highlight} opacity={0.6} />
          <PieEyes cx={12} cy={15} size={9} paper={HOSE.gold} />
          <rect x={1} y={23} width={22} height={3} rx={1.5} fill={HOSE.shadowDark} />
        </g>
      </svg>
    </div>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}
