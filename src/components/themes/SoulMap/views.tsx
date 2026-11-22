'use client'

import type { ReactNode } from 'react'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { aboutBlock } from '@/lib/cv/cvView'
import { sectionViews, type SectionFrames } from '@/components/cv/SectionPlanView'
import type { Labels } from '@/lib/cv/labels'
import { drumsSince, headingId } from '@/lib/cv/sectionText'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import { MarkedLines } from '@/components/cv/MarkedLines'
import { AreaTitle, CARD_BODY, CARD_META, CARD_TITLE, EMBER_LIST, MenuPanel, TechSlots } from './menu'
import { FogGate } from './gate'
import { LiftDescent } from './descent'
import { ItemProjects } from './items'
import { FloorMessages } from './messages'
import { SunStages } from './stage'
import { FogArena } from './arena'
import { IllusoryWall, RollIn } from './plunge'

// Each profession's sections, each with its own event of the bonfire world: the System Engineer walks
// out of a fog gate into About (./gate), his jobs are the lift ride down past bloodstains that replay his
// ghost (./descent), his projects are summon signs his phantom rises out of (./items), his ventures are
// messages a spirit of him kneels and writes (./messages); the Musician's bands play in a shaft of sun
// (./stage); the Martial Artist's record is the bout behind the fog wall, its boss dropping in (./arena).
// The Tech Stack and the Services are the game's menu screen (./menu): the stack's stands behind an
// illusory wall he breaks with a plunging attack, the services are knocked into place by his roll (./plunge).

function Block({ titleKey, wide = false, children }: { titleKey: keyof Labels['sections']; wide?: boolean; children: ReactNode }) {
  const title = useLabels().sections[titleKey]
  const id = headingId('soul', title)
  return (
    <section className="relative px-4 py-12 sm:px-6" aria-labelledby={id}>
      <div className={`mx-auto ${wide ? 'max-w-6xl' : 'max-w-3xl'}`}>
        <AreaTitle id={id} title={title} className="mb-6" />
        {children}
      </div>
    </section>
  )
}

// His education, languages and summary highlights under the bio, on the same menu panel.
function AboutFacts() {
  const { about, cards } = useLabels()
  const { education, languages, highlights } = aboutBlock(useCVData().professionalSummary)
  const facts = [
    { label: about.education, value: education },
    { label: about.languages, value: languages },
  ].filter((fact) => fact.value)

  return (
    <>
      {facts.length > 0 && (
        <dl className="mt-4 space-y-2">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className={`uppercase ${CARD_META}`}>{fact.label}</dt>
              <dd className={CARD_BODY}>{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}
      <MarkedLines items={highlights} label={cards.keyAchievements} look={{ ...EMBER_LIST, list: 'space-y-1.5 mt-4' }} />
    </>
  )
}

// One frame per section of the shared plan, which picks the ones a profession shows and their order.
const FRAMES: SectionFrames = {
  about: function AboutFrame({ slot }) {
    return (
      <Block titleKey="about">
        <FogGate>
          <MenuPanel>
            <p className="max-w-prose text-base leading-relaxed text-[color:var(--soul-text)]">{slot.bio}</p>
            <AboutFacts />
          </MenuPanel>
        </FogGate>
      </Block>
    )
  },
  work: function WorkFrame({ slot }) {
    return (
      <Block titleKey="workExperience" wide>
        <LiftDescent jobs={slot.jobs} />
      </Block>
    )
  },
  tech: function TechFrame({ slot }) {
    return (
      <Block titleKey="techStack" wide>
        <IllusoryWall>
          <MenuPanel>
            <TechSlots categories={slot.categories} />
          </MenuPanel>
        </IllusoryWall>
      </Block>
    )
  },
  services: function ServicesFrame({ slot }) {
    return (
      <Block titleKey="services" wide>
        <RollIn>
          <MenuPanel>
            <ul className={MASONRY_LIST}>
              {slot.services.map((service) => (
                <li key={service.id} className={MASONRY_ITEM}>
                  <h3 className={CARD_TITLE}>{service.title}</h3>
                  <p className={`mt-2 ${CARD_BODY}`}>{service.line}</p>
                </li>
              ))}
            </ul>
          </MenuPanel>
        </RollIn>
      </Block>
    )
  },
  projects: function ProjectsFrame({ slot }) {
    return (
      <Block titleKey="featuredWork" wide>
        <ItemProjects projects={slot.projects} />
      </Block>
    )
  },
  ventures: function VenturesFrame({ slot }) {
    return (
      <Block titleKey="ventures" wide>
        <FloorMessages companies={slot.companies} />
      </Block>
    )
  },
  bands: function BandsFrame({ slot: { musician, bands } }) {
    const { years } = useLabels()
    return (
      <Block titleKey="bands" wide>
        <p className="text-center text-base text-[color:var(--soul-glow)]">{drumsSince(musician, years)}</p>
        <SunStages bands={bands} />
        <p className="mt-6 text-center text-sm italic text-[color:var(--soul-text-soft)]">{musician.line}</p>
      </Block>
    )
  },
  muayThai: function MuayThaiFrame({ slot }) {
    return (
      <Block titleKey="muayThai" wide>
        <FogArena martialArts={slot.martialArts} />
      </Block>
    )
  },
}

export const SECTION_VIEWS = sectionViews(FRAMES)
