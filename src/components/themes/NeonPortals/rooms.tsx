'use client'

import type { ReactNode } from 'react'
import { AboutFacts, useAboutBlock } from '@/components/cv/AboutFacts'
import { BandList } from '@/components/cv/BandList'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MarkedLines } from '@/components/cv/MarkedLines'
import { NameWords } from '@/components/cv/NameWords'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { ProjectList } from '@/components/cv/ProjectList'
import { RecruiterHero, type HeroActionSlot } from '@/components/cv/RecruiterHero'
import { ContactLink, useSiteLinks } from '@/components/cv/SiteLinks'
import { TagList } from '@/components/cv/TagList'
import { VentureList } from '@/components/cv/VentureList'
import Wardrobe from '@/components/worlds/Wardrobe'
import { useYearNow } from '@/hooks/useYearNow'
import { mix } from '@/lib/color'
import { cssVars } from '@/lib/cssVars'
import { jobCard } from '@/lib/cv/cvView'
import { fillLabel, type Labels } from '@/lib/cv/labels'
import { drumsSince, muayThaiFacts, shownUrl, yearCount } from '@/lib/cv/sectionText'
import type { SectionSlot, SlotOf } from '@/lib/cv/sectionPlan'
import type { Profession } from '@/lib/cv/professions'
import { BUTTON_LINE, BUTTON_SMALL, CARD, CARD_TITLE, CARD_TITLE_BIG, CARD_WIDE, CONTACT_LOOK, FACE, FACTS, MUTED, POINTS, TAGS, TINT } from './cards'
import { ERA_TINT_SHARE, ERAS, OUTFIT_LOOK, PORTAL, type Era } from './palette'
import { HUB_ERA, ROOM_ERA, roomAnchor, type CardSide, type RoomId } from './plan'
import { relicOf } from './relics'

// The text layer: plain HTML in normal flow over the fixed tunnel and its set pieces, never scaled by the
// art and never faded. The hero is the machine's hub: his name, the recruiter copy and the three profession
// wings (the shared switch). Each room is a transit spacer (the flight down the passage to the next portal,
// [data-transit]), the gate plate with the room's title ([data-gate]; on a phone it holds the room alone
// while its set piece plays above the cards), one card per item ([data-item], each a mark the camera holds
// at) and a tail. The stage measures these marks. From the desktop line up the rooms zigzag: a room's plate
// and cards sit on the left or on the right (plan.ts cardSideOf), its scene in the other half.

/** A room's colours as the CSS variables its text reads: its edge and its tint. */
export const eraVars = (era: Era) => cssVars({ '--ra1': ERAS[era].a1, '--ra-text': mix(ERAS[era].a1, PORTAL.WHITE, ERA_TINT_SHARE) })

const Item = ({ children, wide = false }: { children: ReactNode; wide?: boolean }) => (
  <article data-item="" className={`${CARD} ${wide ? CARD_WIDE : ''}`}>
    {children}
  </article>
)

// The cards of a room one under the other, 24 px apart as in the other worlds, on the room's side.
const ITEMS_LIST: Record<CardSide, string> = { left: 'flex flex-col items-start gap-6', right: 'flex flex-col items-start gap-6 md:items-end' }

// A card's row in a list that draws its own rows (projects, ventures, bands), on the room's side.
const ITEM_ROW: Record<CardSide, string> = { left: 'w-full', right: 'w-full md:flex md:justify-end' }

// The gate plate's row, on the room's side.
const GATE_ROW: Record<CardSide, string> = { left: 'flex', right: 'flex md:justify-end' }

function ContactActions({ actions, small = false }: { actions: readonly HeroActionSlot[]; small?: boolean }) {
  const { cv, engine } = useSiteLinks('engine')
  return (
    <p className="flex flex-wrap gap-3 pt-3">
      {[...actions, cv, engine].map((slot) => (
        <ContactLink key={slot.id} slot={slot} className={`${CONTACT_LOOK[slot.id]} ${small ? BUTTON_SMALL : ''}`} />
      ))}
    </p>
  )
}

function AboutItems() {
  const { bio, highlights } = useAboutBlock()
  return (
    <>
      <Item>
        <p className="whitespace-pre-line text-[1.2rem] leading-normal">{bio}</p>
        <AboutFacts look={FACTS} />
      </Item>
      {highlights.map((text) => (
        <Item key={text}>
          <p className="flex items-start gap-3.5">
            <span className="mt-1 h-[22px] w-4 shrink-0 bg-[color:var(--ra1)] [clip-path:polygon(50%_0,100%_40%,50%_100%,0_40%)]" aria-hidden="true" />
            {text}
          </p>
        </Item>
      ))}
    </>
  )
}

function WorkItems({ slot }: { slot: SlotOf<'work'> }) {
  const { years, cards } = useLabels()
  const now = useYearNow()
  return (
    <>
      {slot.jobs.map((job) => {
        const card = jobCard(job, years)
        return (
          <Item key={card.id}>
            <p className={`flex items-center gap-2.5 tabular-nums ${TINT}`}>
              <span className="h-[18px] w-3.5 [clip-path:polygon(50%_0,100%_40%,50%_100%,0_40%)] data-[relic=gold]:bg-[color:var(--np-gold)] data-[relic=platinum]:bg-[color:var(--np-platinum)] data-[relic=sapphire]:bg-[color:var(--np-sapphire)]" data-relic={relicOf(job, now)} aria-hidden="true" />
              {card.years}
            </p>
            <h3 className={CARD_TITLE}>{card.title}</h3>
            <p className={MUTED}>
              {card.company}
              <span className="mx-2 opacity-60" aria-hidden="true">
                /
              </span>
              {card.location}
            </p>
            <p>{card.description}</p>
            <MarkedLines items={card.highlights} label={cards.keyAchievements} look={POINTS} />
            <TagList items={card.skills} label={cards.skillsUsed} look={TAGS} />
          </Item>
        )
      })}
    </>
  )
}

function TechItems({ slot }: { slot: SlotOf<'tech'> }) {
  const { cards } = useLabels()
  return (
    <>
      {slot.categories.map((category) => (
        <Item key={category.id}>
          <h3 className={CARD_TITLE}>
            <span className="mr-2" aria-hidden="true">
              {category.icon}
            </span>
            {category.name}
          </h3>
          <TagList items={category.items} label={fillLabel(cards.categoryTechnologies, { name: category.name })} look={TAGS} />
        </Item>
      ))}
    </>
  )
}

function ServiceItems({ slot }: { slot: SlotOf<'services'> }) {
  return (
    <>
      {slot.services.map((service) => (
        <Item key={service.id}>
          <h3 className={CARD_TITLE}>{service.title}</h3>
          <p>{service.line}</p>
        </Item>
      ))}
    </>
  )
}

function ProjectItems({ slot, side }: { slot: SlotOf<'projects'>; side: CardSide }) {
  const { cards } = useLabels()
  return (
    <ProjectList
      projects={slot.projects}
      className={ITEMS_LIST[side]}
      itemClassName={ITEM_ROW[side]}
      renderProject={({ project, years, links, noLink }) => (
        <Item wide>
          {years && <p className={`tabular-nums ${TINT}`}>{years}</p>}
          <h3 className={CARD_TITLE_BIG}>{project.name}</h3>
          <p className={TINT}>{project.tagline}</p>
          <p className={MUTED}>{project.role}</p>
          {project.description && <p>{project.description}</p>}
          {project.impact && (
            <p className="border-l-[3px] border-[color:var(--np-violet)] bg-[color:var(--np-raised)] px-3 py-2.5">
              <span className={TINT}>{cards.impact}</span> {project.impact}
            </p>
          )}
          <MarkedLines items={project.details} label={cards.details} look={POINTS} />
          <TagList items={project.techStack} label={cards.technologiesUsed} look={TAGS} />
          <p className="flex flex-wrap gap-3 pt-2">
            {links.map((link) => (
              <a key={link.kind} {...link.linkProps} className={`${BUTTON_LINE} ${BUTTON_SMALL}`}>
                {link.label}
              </a>
            ))}
            {noLink && <span className={MUTED}>{noLink}</span>}
          </p>
        </Item>
      )}
    />
  )
}

function VentureItems({ slot, side }: { slot: SlotOf<'ventures'>; side: CardSide }) {
  const { cards, sections } = useLabels()
  return (
    <VentureList
      companies={slot.companies}
      className={ITEMS_LIST[side]}
      itemClassName={ITEM_ROW[side]}
      renderVenture={({ venture, linkProps, nameFor }) => (
        <Item wide>
          {venture.featured && <p className="inline-block bg-[color:var(--np-gold)] px-2.5 py-0.5 text-[0.9rem] font-bold text-[color:var(--np-panel)]">{cards.ownProduct}</p>}
          <h3 className={CARD_TITLE_BIG}>
            <span className="mr-2" aria-hidden="true">
              {venture.icon}
            </span>
            {venture.name}
          </h3>
          <p className={TINT}>{venture.tagline}</p>
          <p>{venture.description}</p>
          <TagList items={venture.services} label={sections.services} look={TAGS} />
          {linkProps && (
            <p className="pt-2">
              <a {...linkProps} aria-label={nameFor(shownUrl(venture.url))} className={`${BUTTON_LINE} ${BUTTON_SMALL}`}>
                {shownUrl(venture.url)}
              </a>
            </p>
          )}
        </Item>
      )}
    />
  )
}

function BandItems({ slot, side }: { slot: SlotOf<'bands'>; side: CardSide }) {
  const { years, links } = useLabels()
  const { musician } = slot
  return (
    <>
      <Item>
        <p className={TINT}>{drumsSince(musician, years)}</p>
        <p className="text-[1.2rem] leading-normal">{yearCount(musician.yearsPlaying, years)}</p>
        <p>{musician.line}</p>
      </Item>
      <BandList
        bands={slot.bands}
        className={ITEMS_LIST[side]}
        itemClassName={ITEM_ROW[side]}
        renderBand={({ band, years: span, linkProps, nameFor, release }) => (
          <Item>
            {span && <p className={`tabular-nums ${TINT}`}>{span}</p>}
            <h3 className={CARD_TITLE_BIG}>{band.name}</h3>
            <p className={MUTED}>{band.role}</p>
            {release && (
              <p>
                <span className={TINT}>{release.label}</span> {release.title}
              </p>
            )}
            {linkProps && (
              <p className="pt-2">
                <a {...linkProps} aria-label={nameFor(links.website)} className={`${BUTTON_LINE} ${BUTTON_SMALL}`}>
                  {links.website}
                </a>
              </p>
            )}
          </Item>
        )}
      />
    </>
  )
}

function MuayThaiItems({ slot }: { slot: SlotOf<'muayThai'> }) {
  const labels = useLabels()
  const { martialArts } = slot
  return (
    <>
      <Item>
        <h3 className={CARD_TITLE_BIG}>{martialArts.primary.title}</h3>
      </Item>
      {muayThaiFacts(martialArts, labels).map((fact) => (
        <Item key={`${fact.label}-${fact.value}`}>
          <dl>
            <dt className={TINT}>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </dl>
        </Item>
      ))}
      <Item>
        <h3 className={CARD_TITLE}>{labels.record.achievements}</h3>
        <MarkedLines items={martialArts.primary.achievements} label={labels.record.achievements} look={POINTS} />
      </Item>
    </>
  )
}

function ContactItem() {
  return (
    <RecruiterHero
      render={({ line, actions }) => (
        <Item>
          <p className="text-[1.2rem] leading-normal">{line}</p>
          <ContactActions actions={actions} />
          <p className={`break-all ${MUTED}`}>{actions[0].value}</p>
        </Item>
      )}
    />
  )
}

/** A room's cards, on its side; roomCount counts the same. */
function RoomItems({ slot, side }: { slot: SectionSlot | null; side: CardSide }) {
  if (!slot) return <ContactItem />
  const ITEMS: { [Id in SectionSlot['id']]: (slot: SlotOf<Id>) => ReactNode } = {
    about: () => <AboutItems />,
    work: (s) => <WorkItems slot={s} />,
    tech: (s) => <TechItems slot={s} />,
    services: (s) => <ServiceItems slot={s} />,
    projects: (s) => <ProjectItems slot={s} side={side} />,
    ventures: (s) => <VentureItems slot={s} side={side} />,
    bands: (s) => <BandItems slot={s} side={side} />,
    muayThai: (s) => <MuayThaiItems slot={s} />,
  }
  // The map is keyed by the same id that narrows `slot`, so this renderer takes this slot.
  return (ITEMS[slot.id] as (slot: SectionSlot) => ReactNode)(slot)
}

/** How many cards RoomItems draws for a room. */
export function roomCount(slot: SectionSlot | null, labels: Labels, highlights: readonly string[]): number {
  if (!slot) return 1
  const COUNTS: { [Id in SectionSlot['id']]: (slot: SlotOf<Id>) => number } = {
    about: () => 1 + highlights.length,
    work: (s) => s.jobs.length,
    tech: (s) => s.categories.length,
    services: (s) => s.services.length,
    projects: (s) => s.projects.length,
    ventures: (s) => s.companies.length,
    bands: (s) => 1 + s.bands.length,
    muayThai: (s) => 2 + muayThaiFacts(s.martialArts, labels).length,
  }
  return (COUNTS[slot.id] as (slot: SectionSlot) => number)(slot)
}

interface RoomProps {
  id: RoomId
  slot: SectionSlot | null
  title: string
  /** The profession wing this room opens, shown over the first room's title. */
  wing: string | null
  last: boolean
  /** Where its plate and cards sit from the desktop line up. */
  side: CardSide
}

export function Room({ id, slot, title, wing, last, side }: RoomProps) {
  const era = ROOM_ERA[id]
  const flat = slot?.id === 'projects' || slot?.id === 'ventures'
  return (
    <section data-room="" id={roomAnchor(id)} aria-labelledby={`${roomAnchor(id)}-title`} style={eraVars(era)} className="px-[max(16px,6vw)]">
      <div data-transit="" className="h-[95vh] max-md:h-[80vh]" aria-hidden="true" />
      <div data-gate="" className={`min-h-[62vh] max-md:min-h-[90vh] ${GATE_ROW[side]}`}>
        <div className="h-fit max-w-[35rem] border-t-4 border-[color:var(--ra1)] bg-[color:var(--np-panel)] px-[1.6rem] pb-[1.4rem] pt-5 max-md:w-full max-md:px-5 max-md:pb-5 max-md:pt-4">
          {wing && <p className={TINT}>{wing}</p>}
          <h2 id={`${roomAnchor(id)}-title`} className={`${FACE} mb-1.5 mt-0.5 text-[clamp(2.2rem,5vw,4.25rem)] leading-none text-[color:var(--np-white)]`}>
            {title}
          </h2>
        </div>
      </div>
      {flat && <RoomItems slot={slot} side={side} />}
      {!flat && (
        <div className={ITEMS_LIST[side]}>
          <RoomItems slot={slot} side={side} />
        </div>
      )}
      <div className={last ? 'h-[75vh]' : 'h-[34vh]'} aria-hidden="true" />
    </section>
  )
}

const WING_RING: Record<Profession, string> = { engineer: ERAS.hub.a1, drummer: ERAS.sky.a1, fighter: ERAS.core.a1 }

function Wings() {
  const { navigation, professionFields } = useLabels()
  return (
    <div className="pt-9">
      <p className={`mb-2.5 inline-block bg-[color:var(--np-panel)] px-2 py-0.5 ${MUTED}`} aria-hidden="true">
        {navigation.selectYourProfession}
      </p>
      <ProfessionSwitch
        className="flex flex-wrap gap-3"
        label={navigation.selectYourProfession}
        renderOption={(option) => (
          <button
            type="button"
            {...option.optionProps}
            className={`grid min-h-[44px] min-w-[11rem] grid-cols-[auto_1fr] items-center gap-x-3 border bg-[color:var(--np-panel)] py-2.5 pl-3 pr-4 text-left hover:bg-[color:var(--np-raised)] max-md:min-w-0 max-md:flex-[1_1_100%] ${
              option.selected ? 'border-[color:var(--np-gold)] shadow-[inset_0_-3px_0_var(--np-gold)]' : 'border-[color:var(--np-seam)]'
            }`}
          >
            <span
              className="row-span-2 h-8 w-[26px] rounded-[50%_50%_4px_4px] border-[3px] border-[color:var(--wing)]"
              style={cssVars({ '--wing': WING_RING[option.id] })}
              aria-hidden="true"
            />
            <span className="font-bold">{option.label}</span>
            <span className={`text-[0.9rem] ${MUTED}`}>{professionFields[option.id]}</span>
          </button>
        )}
      />
    </div>
  )
}

const PLATE = 'bg-[color:var(--np-panel)] border-l-4 border-[color:var(--ra1)]'

/** The hub: his name, the recruiter copy and the wings, on panels; the runner stands right of them (on a
 *  phone, under the name), with the wardrobe plate at his feet. From 768 px up the column ends half a plate
 *  short of the vanishing point (58vw from the gutter, less 9.5rem), so neither he nor the plate covers a
 *  panel at any width. */
export function HubHero() {
  return (
    <header data-worlds-hero="" style={eraVars(HUB_ERA)} className="relative flex min-h-[100svh] items-center px-[max(16px,6vw)] pb-12 pt-20 max-md:items-start max-md:pt-[5.5rem]">
      <RecruiterHero
        render={({ name, headline, tagline, line, actions }) => (
          <div data-hero-inner="" className="w-full max-w-[38rem] origin-left md:max-w-[min(38rem,calc(58vw-9.5rem))]">
            <div className={`${PLATE} px-6 pb-5 pt-4`}>
              <h1 className={`${FACE} mt-1 text-[clamp(2.2rem,5vw,5.25rem)] leading-[0.95] text-[color:var(--np-white)]`}>
                <NameWords name={name} wordClassName="block" />
              </h1>
            </div>
            <div className="hidden h-[calc(var(--np-foot-y,80svh)-14rem)] max-md:block" aria-hidden="true" />
            <div className={`${PLATE} mt-4 px-6 pb-6 pt-5 max-md:mt-28`}>
              <p className="text-[1.3rem] font-bold leading-snug max-md:text-[1.15rem]">{headline}</p>
              <p className={`mt-3 ${MUTED}`}>{tagline}</p>
              <p className="mt-3">{line}</p>
              <ContactActions actions={actions} />
            </div>
            <Wings />
          </div>
        )}
      />
      <Wardrobe look={OUTFIT_LOOK} className="absolute left-[var(--np-vpx,64vw)] top-[calc(var(--np-foot-y,82vh)+10px)] z-10 -translate-x-1/2" />
    </header>
  )
}
