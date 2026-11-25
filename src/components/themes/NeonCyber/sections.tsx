'use client'

import { useMemo, type ReactNode } from 'react'
import { ventureCard } from '@/lib/cv/cvView'
import { fillLabel } from '@/lib/cv/labels'
import type { SectionId, SectionSlot, SlotOf } from '@/lib/cv/sectionPlan'
import { headingId, newTabHint } from '@/lib/cv/sectionText'
import { useLabels } from '@/components/cv/CVDataProvider'
import { TagList } from '@/components/cv/TagList'
import { useAboutBlock } from '@/components/cv/AboutFacts'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { BandDeck } from './bands'
import { ProjectFiles } from './projects'
import { JobTimeline } from './timeline'
import { DATA_CHIPS, panelHeadingId } from './hud'
import type { Scene, SceneSide } from './scenes'
import { NeonStage } from './stage'
import world from './world.module.css'

// One section per scene: a tall head that first shows the city alone and then brings the HUD title
// up from the bottom, then the cards on the HUD's glass, then a screen of the city alone before it sinks.
// The cards a scene counts sit in an element marked data-stage-items, which the shared theatre measures
// for the reading line that drives each prop. Every field comes from the shared lists and the card view
// models.

/** A card on the HUD's glass: the clipped corner with its red diagonal. */
const CARD = `${world.panel} p-4 sm:p-5`

function AboutCards({ slot }: { slot: SlotOf<'about'> }) {
  const { facts, highlights } = useAboutBlock()
  const { cyber } = useLabels()
  const tags = [...facts, ...highlights.map((value) => ({ label: cyber.tagHighlight, value }))]
  return (
    <>
      <p className={`${CARD} mb-5 whitespace-pre-line text-base leading-relaxed text-[color:var(--neon-ice)]`}>{slot.bio}</p>
      <div data-stage-items="">
        <ul className="grid gap-3 sm:grid-cols-2">
          {tags.map((tag) => (
            <li key={tag.value} className={`${world.cut} min-w-0 border border-[color:var(--neon-hud)] bg-[color:var(--neon-ink)] px-3 py-2`}>
              <span className="block text-sm uppercase tracking-wider text-[color:var(--neon-hud)]">{tag.label}</span>
              <span className="block text-sm text-[color:var(--neon-ice)]">{tag.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

function WorkCards({ slot }: { slot: SlotOf<'work'> }) {
  return <JobTimeline jobs={slot.jobs} />
}

function TechCards({ slot }: { slot: SlotOf<'tech'> }) {
  const { cards } = useLabels()
  return (
    <div data-stage-items="">
      <ul className="grid gap-4" aria-label={cards.techByCategory}>
        {slot.categories.map((category) => (
          <li key={category.id} className={CARD}>
            <section aria-labelledby={headingId('nc-tech', category.name)} className="border-l-2 border-[color:var(--neon-hack)] pl-3">
              <h3 id={headingId('nc-tech', category.name)} className="mb-2 text-sm uppercase tracking-wider text-[color:var(--neon-hud)]">
                {category.name}
              </h3>
              <TagList items={category.items} label={fillLabel(cards.categoryTechnologies, { name: category.name })} look={DATA_CHIPS} />
            </section>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ServiceCards({ slot }: { slot: SlotOf<'services'> }) {
  return (
    <div data-stage-items="">
      <ul className="grid gap-4">
        {slot.services.map((service) => (
          <li key={service.id} className={CARD}>
            <h3 className="mb-2 text-sm uppercase tracking-wider text-[color:var(--neon-hud)]">{service.title}</h3>
            <p className="text-base leading-relaxed text-[color:var(--neon-ice)]">{service.line}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProjectCards({ slot }: { slot: SlotOf<'projects'> }) {
  return <ProjectFiles projects={slot.projects} />
}

// His own products (featured) are ruled in full gold with a gold tag over the name.
function VentureCards({ slot }: { slot: SlotOf<'ventures'> }) {
  const { sections, links, cards } = useLabels()
  const companies = useMemo(() => slot.companies.map(ventureCard), [slot.companies])
  return (
    <div data-stage-items="">
      <ul className="grid gap-4">
        {companies.map((company) => (
          <li key={company.id}>
            <a
              href={company.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${world.cut} block border bg-[color:var(--neon-glass)] p-4 hover:border-[color:var(--neon-gold)] ${company.featured ? 'border-[color:var(--neon-gold)]' : 'border-[color-mix(in_srgb,var(--neon-gold)_45%,transparent)]'}`}
            >
              {company.featured && <span className="mb-1 inline-block bg-[color:var(--neon-gold)] px-2 py-0.5 text-sm uppercase tracking-wider text-[color:var(--neon-ink)]">{cards.ownProduct}</span>}
              <span className={`mt-1 block text-[color:var(--neon-ice)] ${company.featured ? 'text-lg' : 'text-base'}`}>
                <SlashBreaks text={company.name} />
              </span>
              <span className="mt-1 block text-sm text-[color:var(--neon-use)]">{company.tagline}</span>
              <span className="mt-2 block text-sm text-[color:var(--neon-ice)]">{company.description}</span>
              <span className="sr-only"> {newTabHint(links)}</span>
            </a>
            <TagList items={company.services} label={sections.services} look={{ ...DATA_CHIPS, list: 'mt-2 flex flex-wrap gap-1' }} />
          </li>
        ))}
      </ul>
    </div>
  )
}

// The record on the HUD: the facts, then each achievement a row with its gold bar full.
function RecordCards({ slot }: { slot: SlotOf<'muayThai'> }) {
  const { martialArts } = slot
  return (
    <div className={CARD}>
      <p className="mb-4 text-base text-[color:var(--neon-hud)]">{martialArts.primary.title}</p>
      <div data-stage-items="">
        <MuayThaiRecord
          martialArts={martialArts}
          classNames={{
            facts: 'mb-5 grid gap-3 border border-[color-mix(in_srgb,var(--neon-data)_45%,transparent)] bg-[color:var(--neon-ink)] p-4 sm:grid-cols-2',
            fact: 'border-l-2 border-[color:var(--neon-data)] pl-3',
            term: 'text-sm uppercase tracking-wider text-[color:var(--neon-data)]',
            value: 'mt-1 text-sm text-[color:var(--neon-ice)]',
            achievements: 'space-y-3',
          }}
          renderAchievement={(achievement) => (
            <span className="block border border-[color-mix(in_srgb,var(--neon-gold)_40%,transparent)] bg-[color:var(--neon-glass)] p-3">
              <span className="block text-sm text-[color:var(--neon-ice)]">{achievement}</span>
              <span className="mt-2 block h-1.5 bg-[color:var(--neon-gold)]" aria-hidden="true" />
            </span>
          )}
        />
      </div>
    </div>
  )
}

const CARDS: { [Id in SectionId]: (props: { slot: SlotOf<Id> }) => ReactNode } = {
  about: AboutCards,
  work: WorkCards,
  tech: TechCards,
  services: ServiceCards,
  projects: ProjectCards,
  ventures: VentureCards,
  bands: BandCards,
  muayThai: RecordCards,
}

function BandCards({ slot }: { slot: SlotOf<'bands'> }) {
  return <BandDeck musician={slot.musician} bands={slot.bands} />
}

/** The HUD title over the city: its place in the page, two slashes, the title in the loud yellow, the red
 *  tick rail, on ink so it reads on any frame. */
export function HudTitle({ number, total, title }: { number: number; total: number; title: string }) {
  return (
    <div className="inline-block max-w-full bg-[color-mix(in_srgb,var(--neon-ink)_88%,transparent)] px-4 py-3">
      <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--neon-data-text)]">{`${String(number).padStart(2, '0')} / ${String(total).padStart(2, '0')}`}</p>
      <h2 id={panelHeadingId(title)} className="mt-1 text-[clamp(1.5rem,6vw,2.75rem)] uppercase leading-tight tracking-[0.16em] text-[color:var(--neon-hud)]">
        <span className="text-[color:var(--neon-data)]" aria-hidden="true">
          {'// '}
        </span>
        {title}
      </h2>
      <div className={`${world.ticks} mt-2`} aria-hidden="true" />
    </div>
  )
}

/** Where a section's title and cards read from lg: on the half its scene leaves free. */
export const READS_BESIDE: Record<SceneSide, { title: string; column: string }> = {
  right: { title: '', column: '' },
  left: { title: 'lg:justify-end', column: 'lg:ml-auto' },
}

interface SceneSectionProps {
  scene: Scene
  slot: SectionSlot
  number: number
  total: number
  still: boolean
}

/** One scene of the page; under reduced motion its own stage sits still behind its head. */
export function SceneSection({ scene, slot, number, total, still }: SceneSectionProps) {
  const { sections } = useLabels()
  const Cards = CARDS[slot.id] as (props: { slot: SectionSlot }) => ReactNode
  const title = sections[slot.titleKey]
  const reads = READS_BESIDE[scene.side ?? 'right']
  return (
    <section data-scene={scene.id} aria-labelledby={panelHeadingId(title)} className="relative px-4 pb-[60svh] motion-reduce:pb-16 sm:px-6 lg:px-[6vw]">
      {still && <NeonStage scene={scene} settled />}
      <header className={`flex min-h-[90svh] items-end pb-10 motion-reduce:min-h-[70svh] max-md:min-h-[130svh] ${reads.title}`}>
        <HudTitle number={number} total={total} title={title} />
      </header>
      <div className={`max-w-[42rem] ${reads.column}`}>
        <Cards slot={slot} />
      </div>
    </section>
  )
}
