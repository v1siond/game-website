'use client'

import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { BandList } from '@/components/cv/BandList'
import { VentureList } from '@/components/cv/VentureList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { FadeInScene, ScrollScene } from '@/components/scroll/ScrollScene'
import { useZoneStageContext } from '@/hooks/useZoneStage'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { ArtBreak, CurlBanner, PieEyes } from './art'
import { HOSE } from './palette'
import { BandRecord, CompanyPoster, ExperienceCard, TechBubbleCloud } from './cards'
import { Reveal, RunBar } from './scenes'
import { staggerAt } from '../shared/stagger'
import { ParryBoard } from './parry'
import { FingerGunPop, ParrySlap } from './gags'
import { IsleStage } from './isles'
import { BagFoe, Bandstand, FlowerKnockout, MapRun, ShopCounter, StageCurtains } from './stages'
import world from './world.module.css'
import styles from './scenes.module.css'
import { drumsSince, headingId } from '@/lib/cv/sectionText'

// The picked profession's sections, each on its isle (./isles, the backdrop follows) and each with its own
// act of his (./stages). About: he knocks out the flower boss and the text unfolds. Work Experience: the
// lost round's run bar, his figure running past a flag per job as they scroll by, the jobs dropping in as
// phase cards. Tech Stack: he pays at the shop counter and the items lift off the shelf. Services: poster
// cards he pops into place with the finger gun (./gags). Featured Work: the parry board (./parry), bounced
// by his parry slap (./gags). Ventures: the curtains part and he
// bows. Bands: he drums on the bandstand, each record spinning up under the pointer. Muay Thai: he drops the heavy bag, the knockout slams the
// title, the achievements land as hit stars. Between About, Work and Tech he runs the isle map.

const LEAD = `text-center text-base ${world.ink}`

// The run bar's scroll lines: it starts as the section's top passes the middle of the screen and he
// reaches the last flag as the section's top is most of a screen above it (the jobs scrolled by).
const RUN_START = 0.5
const RUN_END = -0.9

// The map run between sections: he sets off as the strip comes up from the bottom and reaches the far
// island as it nears the top third.
const MAP_START = 0.95
const MAP_END = 0.25

function MapBreak() {
  return (
    <ScrollScene reveal={false} start={MAP_START} end={MAP_END}>
      <MapRun profession="engineer" />
    </ScrollScene>
  )
}

// The knockout starburst's points, long and short rays in turn round an oval 200 by 60.
const KO_RAYS = 18
const KO_BURST = Array.from({ length: KO_RAYS * 2 }, (_, i) => {
  const angle = (Math.PI * i) / KO_RAYS
  const reach = i % 2 === 0 ? 1 : 0.62
  return `${(100 + Math.cos(angle) * 98 * reach).toFixed(1)},${(30 + Math.sin(angle) * 29 * reach).toFixed(1)}`
}).join(' ')

// The heading each section is named by (aria-labelledby).
const HEADING = {
  about: headingId('hose', 'About'),
  workExperience: headingId('hose', 'Work Experience'),
  techStack: headingId('hose', 'Tech Stack'),
  services: headingId('hose', 'Services'),
  featuredWork: headingId('hose', 'Featured Work'),
  ventures: headingId('hose', 'Ventures'),
  bands: headingId('hose', 'Bands'),
  muayThai: headingId('hose', 'Muay Thai'),
} as const

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()
  const titles = useLabels().sections
  const { reduced } = useZoneStageContext()

  return (
    <>
      <IsleStage isle="meadow">
        {(on) => (
          <section aria-labelledby={HEADING.about} className="mb-8">
            <CurlBanner id={HEADING.about}>{titles.about}</CurlBanner>
            <FlowerKnockout on={on} reduced={reduced} profession="engineer">
              <p className={`mx-auto max-w-prose p-5 leading-relaxed ${world.titleCard} ${LEAD}`}>{professionalSummary.bio}</p>
            </FlowerKnockout>
          </section>
        )}
      </IsleStage>

      <MapBreak />

      {sections.jobs.length > 0 && (
        <IsleStage isle="meadow">
          <ScrollScene reveal={false} start={RUN_START} end={RUN_END}>
            <section aria-labelledby={HEADING.workExperience} className="mb-8">
              <CurlBanner id={HEADING.workExperience}>{titles.workExperience}</CurlBanner>
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
        </IsleStage>
      )}

      <MapBreak />

      <IsleStage isle="carnival">
        {(on) => (
          <section aria-labelledby={HEADING.techStack} className="mx-auto mb-8 max-w-3xl">
            <CurlBanner id={HEADING.techStack}>{titles.techStack}</CurlBanner>
            <ShopCounter on={on} reduced={reduced} profession="engineer">
              <TechBubbleCloud categories={sections.techStack} />
            </ShopCounter>
          </section>
        )}
      </IsleStage>

      {sections.services.length > 0 && (
        <IsleStage isle="carnival">
          <section aria-labelledby={HEADING.services} className="mb-8">
            <CurlBanner id={HEADING.services}>{titles.services}</CurlBanner>
            <FadeInScene>
              <FingerGunPop>
                <ul className={MASONRY_LIST}>
                  {sections.services.map((service) => (
                    <li key={service.id} className={`${MASONRY_ITEM} p-5 ${world.poster}`}>
                      <h3 className={`text-lg ${world.lettering}`}>{service.title}</h3>
                      <p className={`mt-2 text-base leading-relaxed ${world.ink}`}>{service.line}</p>
                    </li>
                  ))}
                </ul>
              </FingerGunPop>
            </FadeInScene>
          </section>
        </IsleStage>
      )}

      <IsleStage isle="carnival">
        <section aria-labelledby={HEADING.featuredWork} className="mb-8">
          <CurlBanner id={HEADING.featuredWork}>{titles.featuredWork}</CurlBanner>
          <ParrySlap>
            <ParryBoard projects={sections.projects} />
          </ParrySlap>
        </section>
      </IsleStage>

      <ArtBreak kind="bouncingBalls" />

      <IsleStage isle="carnival">
        {(on) => (
          <section aria-labelledby={HEADING.ventures}>
            <CurlBanner id={HEADING.ventures}>{titles.ventures}</CurlBanner>
            <StageCurtains on={on} profession="engineer">
              <VentureList
                companies={sections.companies}
                className="grid gap-4 md:grid-cols-6"
                itemClassName="md:col-span-2"
                featuredItemClassName="md:col-span-3"
                renderVenture={(slot) => <CompanyPoster {...slot} />}
              />
            </StageCurtains>
          </section>
        )}
      </IsleStage>
    </>
  )
}

export function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const labels = useLabels()
  const { musician, bands } = sections

  return (
    <>
      <ArtBreak kind="singAlong" />
      <IsleStage isle="casino">
        <section aria-labelledby={HEADING.bands} className="mb-8">
          <CurlBanner id={HEADING.bands}>{labels.sections.bands}</CurlBanner>
          <Bandstand profession="drummer" />
          <p className={`mb-6 p-3 ${world.titleCard} ${LEAD}`}>{drumsSince(musician, labels.years)}</p>
          <BandList bands={bands} className={MASONRY_LIST} itemClassName={MASONRY_ITEM} renderBand={(slot) => <BandRecord {...slot} />} />
          <p className={`mt-6 p-3 italic ${world.titleCard} ${LEAD} ${world.red}`}>{musician.line}</p>
        </section>
      </IsleStage>
    </>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections
  const titles = useLabels().sections

  return (
    <>
      <ArtBreak kind="bouncingBalls" />
      <IsleStage isle="casino">
        <section aria-labelledby={HEADING.muayThai} className="mb-8">
          <CurlBanner id={HEADING.muayThai}>{titles.muayThai}</CurlBanner>
          <Reveal className={`relative mx-auto max-w-3xl p-6 ${world.poster} ${world.posterWide}`}>
            {({ played }) => (
              <>
                <RingBell />
                <BagFoe on={played} profession="fighter" />
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
                  renderAchievement={(achievement, index) => (
                    <p className={`flex items-start gap-2 p-4 ${world.titleCard}`}>
                      <span className={`inline-block ${world.red} ${staggerAt(index)} ${played ? styles.hitIn : styles.hitWait}`} aria-hidden="true">
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
      </IsleStage>
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
