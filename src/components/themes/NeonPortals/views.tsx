'use client'

import type { CSSProperties, ReactNode } from 'react'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { BandList } from '@/components/cv/BandList'
import { MASONRY_ITEM, MASONRY_LIST, MASONRY_TILES } from '@/components/cv/masonry'
import { drumsSince, headingId, newTabName } from '@/components/cv/sectionText'
import { useZoneStage } from '@/hooks/useZoneStage'
import type { CVData } from '@/lib/cv/content'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { BossRound } from './bossRound'
import { CrateArt } from './crateArt'
import { CrateField } from './crateField'
import type { Zone } from './eraBackdrop'
import { BridgeSlide, Crossing, Hint, TombRun } from './eraScenes'
import scenes from './eraScenes.module.css'
import { Crystal, Gem, Relic } from './pickups'
import { useScore } from './score'
import { BandTrial } from './timeTrial'
import { LevelPortal } from './warpLevels'
import ui from './warped.module.css'

// The picked profession's sections, each one a level in its own era of the time travel platformer
// (Warped, named in code only; design worlds-v2/neon-portals.md section W4). A stage hands its era to
// the page while it is in view (useZoneStage), the fixed backdrop warps to it (eraBackdrop.tsx), and his
// moment there plays once the stage is on (eraScenes.tsx):
//   About        medieval     he slides in along the bridge, the bio unrolls as a banner, the death gag
//   Experience   Egypt        he runs along the tomb floor with the scroll; the level portals (warpLevels)
//   Tech stack   underwater   the scuba swim across; the panels rise like bubbles
//   Projects     prehistoric  he rides the baby T rex in and hops off at the crates (crateField)
//   Ventures     future       the motorbike passes under the cards and lights each one as it goes
//   Bands        Arabian      the jet ski across the harbour; the time trials (timeTrial)
//   Muay Thai    great wall   the boss round against the time foe (bossRound)
// Headings and hints sit on dark plates so they read on every era's painting; the long lists are
// masonry.

const ICON = {
  crystal: <Crystal className="h-full w-full" />,
  crate: <CrateArt kind="wood" className="h-full w-full" />,
  relic: <Relic className="h-full w-full" />,
  gem: <Gem className="h-full w-full" tone="violet" />,
} as const

function SectionTitle({ title, icon }: { title: string; icon?: keyof typeof ICON }) {
  return (
    <h2 id={headingId('np', title)} className={`mb-6 flex w-fit max-w-full items-center gap-3 text-3xl sm:text-4xl ${ui.plate}`}>
      {icon && (
        <span className={ui.sectionIcon} aria-hidden="true">
          {ICON[icon]}
        </span>
      )}
      {/* the clipped text gradient sits on its own span so the plate's fill does not clip to the letters */}
      <span className={ui.display}>{title}</span>
    </h2>
  )
}

function Stage({ title, zone, icon, children }: { title: string; zone: Zone; icon?: keyof typeof ICON; children: (on: boolean) => ReactNode }) {
  const { ref, on } = useZoneStage<Zone>(zone)

  return (
    <section ref={ref} data-on={on || undefined} aria-labelledby={headingId('np', title)} className={`relative mb-24 scroll-mt-8 ${ui.stage}`}>
      <SectionTitle title={title} icon={icon} />
      {children(on)}
    </section>
  )
}

function TechStack({ categories }: { categories: CVData['techStack'] }) {
  return (
    <ul className={MASONRY_LIST}>
      {categories.map((category, index) => (
        <li key={category.id} className={`${MASONRY_ITEM} ${ui.panel} ${ui.rise} ${scenes.bubble} p-5`} style={{ '--i': index } as CSSProperties}>
          <h3 className={`mb-3 flex items-center gap-2 text-base uppercase tracking-wide text-[color:var(--np-teal)] ${ui.chunk}`}>
            <span aria-hidden="true">{category.icon}</span>
            {category.name}
          </h3>
          <ul className={`${MASONRY_TILES} gap-1.5`}>
            {category.items.map((tech) => (
              <li key={tech} className="rounded-md border-2 border-[color:var(--np-plate)] bg-[color:var(--np-void)] px-2 py-1 text-sm text-[color:var(--np-white)]">
                {tech}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}

function Ventures({ companies }: { companies: CVData['companies'] }) {
  const { links } = useLabels()
  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {companies.map((company, index) => (
        <li key={company.id} className={scenes.lightUp} style={{ '--i': index } as CSSProperties}>
          <a
            href={company.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={newTabName(links, `${company.name}: ${company.tagline}`)}
            className={`block h-full p-5 focus:outline-none ${ui.panel}`}
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">
                {company.icon}
              </span>
              <span>
                <span className={`block text-xl ${ui.display}`}>{company.name}</span>
                <span className="block text-sm text-[color:var(--np-gold)]">{company.tagline}</span>
              </span>
            </span>
            <span className="mt-3 block text-base text-[color:var(--np-white)]">{company.description}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

function EngineerLevels({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()
  const labels = useLabels()

  return (
    <>
      <Stage title={labels.sections.about} zone="medieval">
        {(on) => (
          <BridgeSlide on={on} profession="engineer">
            <p className={`${ui.panel} max-w-3xl p-6 text-lg leading-relaxed text-[color:var(--np-white)]`}>{professionalSummary.bio}</p>
          </BridgeSlide>
        )}
      </Stage>

      {sections.jobs.length > 0 && (
        <Stage title={labels.sections.workExperience} zone="egypt" icon="crystal">
          {() => (
            <>
              <Hint>{labels.warp.levelHint}</Hint>
              <TombRun profession="engineer" />
              <ul className={MASONRY_LIST}>
                {sections.jobs.map((entry, index) => (
                  <li key={entry.id} className={MASONRY_ITEM}>
                    <LevelPortal entry={entry} index={index} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </Stage>
      )}

      <Stage title={labels.sections.techStack} zone="underwater">
        {(on) => (
          <>
            <Crossing on={on} profession="engineer" traveller={{ kind: 'swim' }} className="mb-2" />
            <TechStack categories={sections.techStack} />
          </>
        )}
      </Stage>

      <Stage title={labels.sections.projects} zone="prehistoric" icon="crate">
        {() => <CrateField projects={sections.projects} />}
      </Stage>

      <Stage title={labels.sections.ventures} zone="future">
        {(on) => (
          <>
            <Ventures companies={sections.companies} />
            <Crossing on={on} profession="engineer" traveller={{ kind: 'ride', vehicle: 'bike' }} className="mt-2" />
          </>
        )}
      </Stage>
    </>
  )
}

/** The gem over the bands once every time trial is won. */
function RelicGem() {
  const { score } = useScore()
  const { relics } = score.counts
  if (score.totals.relics === 0 || relics < score.totals.relics) return null
  return (
    <span className={`block h-12 w-10 ${ui.award}`} aria-hidden="true">
      <Gem className="h-full w-full" tone="gold" />
    </span>
  )
}

function MusicianLevels({ sections }: { sections: SectionsOf<'drummer'> }) {
  const labels = useLabels()
  const { musician, bands } = sections

  return (
    <Stage title={labels.sections.bands} zone="arabian" icon="relic">
      {(on) => (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <p className={`w-fit text-lg font-bold text-[color:var(--np-gold)] ${ui.plate}`}>{drumsSince(musician, labels.years)}</p>
            <RelicGem />
          </div>
          <Hint>{labels.warp.trialHint}</Hint>
          <Crossing on={on} profession="drummer" traveller={{ kind: 'ride', vehicle: 'jetski' }} className="mb-2" />
          <BandList
            bands={bands}
            className={MASONRY_LIST}
            itemClassName={MASONRY_ITEM}
            renderBand={(slot) => <BandTrial slot={slot} index={bands.indexOf(slot.band)} />}
          />
          <p className={`mt-2 w-fit max-w-full text-base italic text-[color:var(--np-white)] ${ui.plate}`}>{musician.line}</p>
        </>
      )}
    </Stage>
  )
}

function MartialArtistLevels({ sections }: { sections: SectionsOf<'fighter'> }) {
  const labels = useLabels()
  const { martialArts } = sections

  return (
    <Stage title={labels.sections.muayThai} zone="wall" icon="gem">
      {() => (
        <>
          <h3 className={`mb-5 w-fit max-w-full text-2xl ${ui.plate}`}>
            <span className={ui.display}>{martialArts.primary.title}</span>
          </h3>
          <BossRound martialArts={martialArts} />
        </>
      )}
    </Stage>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerLevels,
  drummer: MusicianLevels,
  fighter: MartialArtistLevels,
}
