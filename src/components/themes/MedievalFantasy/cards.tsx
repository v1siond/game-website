import type { CSSProperties } from 'react'
import type { Job } from '@/lib/cv/content'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { BandSlot } from '@/components/cv/BandList'
import type { VentureSlot } from '@/components/cv/VentureList'
import { jobCard, projectCard, ventureCard } from '@/lib/cv/cvView'
import { shownUrl } from '@/lib/cv/sectionText'
import { useLabels } from '@/components/cv/CVDataProvider'
import { ImpactLabel } from '@/components/cv/ImpactLabel'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { MarkedLines, type MarkedLinesLook } from '@/components/cv/MarkedLines'
import { TagList, type TagListLook } from '@/components/cv/TagList'
import { REALM } from './palette'
import { InnerCard } from './panels'
import { RealmButton } from './actions'

// One card per job, project, venture and band, read from the shared section slots. Each card shows every
// field of its view model (cvView.ts) in the realm's look.

export const CARD_TITLE: CSSProperties = { color: REALM.textBright, fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.125rem' }
export const CARD_SUBTITLE: CSSProperties = { color: REALM.goldText, fontSize: '0.875rem', marginBottom: '0.25rem' }
export const CARD_BODY: CSSProperties = { color: REALM.textMid, fontSize: '1rem', marginBottom: '0.25rem' }

// The marked lines under a card (a job's highlights, a project's details, the About highlights).
export const MARKED_LIST: MarkedLinesLook = {
  list: 'mt-1.5',
  line: 'relative mb-0.5 pl-3 text-[0.875rem] text-[color:var(--realm-text-mid)]',
  marker: (
    <span className="absolute left-0 text-[color:var(--realm-gold-dark)]" aria-hidden="true">
      ›
    </span>
  ),
}

// The tags under a card, every one: a job's skills, a project's technologies, a venture's services, on the
// blight green at alpha 0x40 (64 of 255).
const CHIP_ROW: TagListLook = {
  list: 'mt-2 flex flex-wrap gap-1',
  tag: 'bg-[color-mix(in_srgb,var(--realm-chaos-blight-dark)_25.098%,transparent)] px-1 py-0.5 text-[0.875rem] uppercase text-[color:var(--realm-chaos-blight-text)]',
}

export function JobCard({ job }: { job: Job }) {
  const { years, cards } = useLabels()
  const card = jobCard(job, years)
  return (
    <InnerCard highlight={job.endDate === null} zone="chaos">
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.25rem 0.75rem', marginBottom: '0.375rem' }}>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ ...CARD_TITLE, fontSize: '0.875rem' }}>{card.title}</h3>
          <p style={{ color: REALM.goldText, fontSize: '0.875rem' }}><SlashBreaks text={card.company} /></p>
          {card.location && <p className="text-sm text-[color:var(--realm-text-dim)]">{card.location}</p>}
        </div>
        <span style={{ color: REALM.textDim, fontSize: '0.875rem', whiteSpace: 'nowrap' }}>{card.years}</span>
      </div>
      {card.description && <p style={{ color: REALM.textMid, fontSize: '0.875rem' }}>{card.description}</p>}
      <MarkedLines items={card.highlights} label={cards.keyAchievements} look={MARKED_LIST} />
      <TagList items={card.skills} label={cards.skillsUsed} look={CHIP_ROW} />
    </InnerCard>
  )
}

// The project's links come from the slot, which carries their anchor props; every other field from its card.
export function ProjectCard({ slot: { project, links } }: { slot: ProjectSlot }) {
  const labels = useLabels()
  const card = projectCard(project, labels)
  return (
    <InnerCard zone="frost">
      <h3 style={CARD_TITLE}><SlashBreaks text={card.name} /></h3>
      <p style={CARD_SUBTITLE}>
        {card.role}
        {card.years && <span aria-hidden="true"> | </span>}
        {card.years}
      </p>
      <p style={CARD_BODY}>{card.tagline}</p>
      {card.description && <p className="mb-1 text-sm text-[color:var(--realm-text-mid)]">{card.description}</p>}
      {card.impact && <p className="text-[1rem] font-medium text-[color:var(--realm-frost-ice-mid)]"><ImpactLabel />{card.impact}</p>}
      <MarkedLines items={card.details} label={labels.cards.details} look={MARKED_LIST} />
      <TagList items={card.techStack} label={labels.cards.technologiesUsed} look={CHIP_ROW} />
      {links.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
          {links.map(({ kind, label, linkProps }) => (
            <RealmButton key={kind} linkProps={linkProps}>{label}</RealmButton>
          ))}
        </div>
      )}
    </InnerCard>
  )
}

export function BandCard({ band, years, linkProps, release }: BandSlot) {
  return (
    <InnerCard zone="frost">
      <h3 style={CARD_TITLE}>
        {linkProps ? (
          <a {...linkProps} style={{ color: REALM.textBright, textDecoration: 'underline', textUnderlineOffset: '3px' }}>{band.name}</a>
        ) : band.name}
      </h3>
      <p style={CARD_SUBTITLE}>
        {band.role}
        {years && <span aria-hidden="true"> | </span>}
        {years}
      </p>
      {release && (
        <p style={CARD_BODY}>
          {release.label} <cite>&ldquo;{release.title}&rdquo;</cite>
        </p>
      )}
    </InnerCard>
  )
}

// The venture's link shows its address, so its accessible name starts with that address (label in name).
export function VentureCard({ slot: { venture, linkProps, nameFor } }: { slot: VentureSlot }) {
  const { cards, sections } = useLabels()
  const card = ventureCard(venture)
  const address = shownUrl(card.url)
  return (
    <InnerCard zone="frost" highlight={card.featured}>
      {card.featured && (
        <p className="mb-2 inline-block border border-[color:var(--realm-gold-dark)] px-2 py-0.5 text-sm font-semibold uppercase tracking-[0.08em] text-[color:var(--realm-gold-bright)]">
          {cards.ownProduct}
        </p>
      )}
      <h3 style={CARD_TITLE}><SlashBreaks text={card.name} /></h3>
      <p style={{ ...CARD_SUBTITLE, fontSize: '1rem' }}>{card.tagline}</p>
      <p style={CARD_BODY}>{card.description}</p>
      <TagList items={card.services} label={sections.services} look={CHIP_ROW} />
      {linkProps && (
        <a
          {...linkProps}
          aria-label={nameFor(address)}
          style={{ color: REALM.frostIceMid, fontSize: '0.875rem', textDecoration: 'none', display: 'inline-block', minHeight: '44px', paddingTop: '0.75rem', overflowWrap: 'anywhere' }}
        >
          {address}
        </a>
      )}
    </InnerCard>
  )
}
