'use client'

import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { FadeInScene, ScrollScene } from '@/components/scroll/ScrollScene'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { ArtBreak, CurlBanner, PieEyes } from './art'
import { HOSE } from './palette'
import { BandRecord, CompanyPoster, ExperienceCard, TechBubbleCloud } from './cards'
import { Reveal, RunBar, staggerAt } from './scenes'
import { ParryBoard } from './parry'
import world from './world.module.css'
import styles from './scenes.module.css'
import { drumsSince } from '@/components/cv/sectionText'

// The picked profession's sections. About, Tech Stack and Ventures fade in. Work Experience is a boss's
// phases: each job a phase card dropping in with a squash, in masonry, under the run bar his figure runs
// along as the jobs scroll by. Featured Work is the parry board (./parry). Bands is the shop shelf, each
// record's disc spinning up under the pointer. The Muay Thai record opens on the knockout slam over an
// ink starburst, its achievements landing as hit stars, the bell swinging on hover. The art breaks
// between them are a film leader, a sing along line and pie eyed balls.

const LEAD = `text-center text-base ${world.ink}`

// The run bar's scroll lines: it starts as the section's top passes the middle of the screen and he
// reaches the last flag as the section's top is most of a screen above it (the jobs scrolled by).
const RUN_START = 0.5
const RUN_END = -0.9

// The knockout starburst's points, long and short rays in turn round an oval 200 by 60.
const KO_RAYS = 18
const KO_BURST = Array.from({ length: KO_RAYS * 2 }, (_, i) => {
  const angle = (Math.PI * i) / KO_RAYS
  const reach = i % 2 === 0 ? 1 : 0.62
  return `${(100 + Math.cos(angle) * 98 * reach).toFixed(1)},${(30 + Math.sin(angle) * 29 * reach).toFixed(1)}`
}).join(' ')

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()
  const titles = useLabels().sections

  return (
    <>
      <FadeInScene>
        <section aria-labelledby="hose-about">
          <CurlBanner id="hose-about">{titles.about}</CurlBanner>
          <p className={`mx-auto max-w-2xl leading-relaxed ${LEAD}`}>{professionalSummary.bio}</p>
        </section>
      </FadeInScene>

      <ArtBreak kind="filmLeader" />

      {sections.jobs.length > 0 && (
        <ScrollScene reveal={false} start={RUN_START} end={RUN_END}>
          <section aria-labelledby="hose-work-experience" className="mb-8">
            <CurlBanner id="hose-work-experience">{titles.workExperience}</CurlBanner>
            <div className="sticky top-3 z-30 mb-2">
              <RunBar profession="engineer" stops={sections.jobs.length} />
            </div>
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
        </ScrollScene>
      )}

      <ArtBreak kind="singAlong" />

      <FadeInScene>
        <section aria-labelledby="hose-tech-stack">
          <CurlBanner id="hose-tech-stack">{titles.techStack}</CurlBanner>
          <div className={`mx-auto max-w-3xl p-6 ${world.poster} ${world.posterWide}`}>
            <TechBubbleCloud categories={sections.techStack} />
          </div>
        </section>
      </FadeInScene>

      <section aria-labelledby="hose-featured-work" className="mb-8">
        <CurlBanner id="hose-featured-work">{titles.featuredWork}</CurlBanner>
        <ParryBoard projects={sections.projects} />
      </section>

      <ArtBreak kind="bouncingBalls" />

      <FadeInScene>
        <section aria-labelledby="hose-ventures">
          <CurlBanner id="hose-ventures">{titles.ventures}</CurlBanner>
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
  const labels = useLabels()
  const { musician, bands } = sections

  return (
    <>
      <ArtBreak kind="singAlong" />
      <section aria-labelledby="hose-bands" className="mb-8">
          <CurlBanner id="hose-bands">{labels.sections.bands}</CurlBanner>
          <p className={`mb-6 ${LEAD}`}>
            {drumsSince(musician, labels.years)}
          </p>
          <BandList bands={bands} className={MASONRY_LIST} itemClassName={MASONRY_ITEM} renderBand={(slot) => <BandRecord {...slot} />} />
          <p className={`mt-6 italic ${LEAD} ${world.red}`}>{musician.line}</p>
        </section>
    </>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections
  const titles = useLabels().sections

  return (
    <>
      <ArtBreak kind="bouncingBalls" />
      <section aria-labelledby="hose-muay-thai" className="mb-8">
        <CurlBanner id="hose-muay-thai">{titles.muayThai}</CurlBanner>
        <Reveal className={`relative mx-auto max-w-3xl p-6 ${world.poster} ${world.posterWide}`}>
          {({ played }) => (
            <>
            <RingBell />
            <div className="relative mb-6 flex min-h-24 items-center justify-center px-6">
              <svg viewBox="0 0 200 60" preserveAspectRatio="none" className={`absolute inset-0 h-full w-full ${world.inked} ${played ? styles.koBurst : styles.koBurstWait}`} aria-hidden="true" focusable="false">
                <polygon points={KO_BURST} fill={HOSE.highlight} />
              </svg>
              <h3 className={`relative text-center text-2xl ${world.red} ${world.lettering} ${world.dropText} ${played ? styles.koSlam : styles.koWait}`}>
                {martialArts.primary.title}
              </h3>
            </div>
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
