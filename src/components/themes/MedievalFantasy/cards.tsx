import type { CSSProperties } from 'react'
import type { Job } from '@/lib/cv/content'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { BandSlot } from '@/components/cv/BandList'
import type { VentureSlot } from '@/components/cv/VentureList'
import { jobCard, projectCard, ventureCard } from '@/lib/cv/cvView'
import { shownUrl } from '@/lib/cv/sectionText'
import { useLabels } from '@/components/cv/CVDataProvider'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { REALM } from './palette'
import { InnerCard } from './panels'
import { RealmButton } from './actions'

// One card per job, project, venture and band, read from the shared section slots. Each card shows every
// field of its view model (cvView.ts) in the realm's look.

export const CARD_TITLE: CSSProperties = { color: REALM.textBright, fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.125rem' }
export const CARD_SUBTITLE: CSSProperties = { color: REALM.goldText, fontSize: '0.875rem', marginBottom: '0.25rem' }
export const CARD_BODY: CSSProperties = { color: REALM.textMid, fontSize: '1rem', marginBottom: '0.25rem' }
export const CARD_CHIP: CSSProperties = {
  background: REALM.chaosFelDark + '40',
  color: REALM.chaosFelText,
  fontSize: '0.875rem',
  padding: '0.125rem 0.25rem',
  textTransform: 'uppercase',
}

// The marked lines under a card (a job's highlights, a project's details, the About highlights).
export function MarkedList({ items }: { items: string[] }) {
  if (items.length === 0) return null
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: '0.375rem 0 0 0' }}>
      {items.map((item) => (
        <li key={item} style={{ color: REALM.textMid, fontSize: '0.875rem', paddingLeft: '0.75rem', position: 'relative', marginBottom: '0.125rem' }}>
          <span style={{ position: 'absolute', left: 0, color: REALM.goldDark }} aria-hidden="true">›</span>{item}
        </li>
      ))}
    </ul>
  )
}

// The tags under a card, every one: a job's skills, a project's technologies, a venture's services.
function ChipRow({ chips }: { chips: string[] }) {
  if (chips.length === 0) return null
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.5rem' }}>
      {chips.map((chip) => (
        <span key={chip} style={CARD_CHIP}>{chip}</span>
      ))}
    </div>
  )
}

export function JobCard({ job }: { job: Job }) {
  const { years } = useLabels()
  const card = jobCard(job, years)
  return (
    <InnerCard highlight={job.endDate === null} zone="roc">
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.25rem 0.75rem', marginBottom: '0.375rem' }}>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ ...CARD_TITLE, fontSize: '0.875rem' }}>{card.title}</h3>
          <p style={{ color: REALM.goldText, fontSize: '0.875rem' }}><SlashBreaks text={card.company} /></p>
          {card.location && <p className="text-sm text-[color:var(--realm-text-dim)]">{card.location}</p>}
        </div>
        <span style={{ color: REALM.textDim, fontSize: '0.875rem', whiteSpace: 'nowrap' }}>{card.years}</span>
      </div>
      {card.description && <p style={{ color: REALM.textMid, fontSize: '0.875rem' }}>{card.description}</p>}
      <MarkedList items={card.highlights} />
      <ChipRow chips={card.skills} />
    </InnerCard>
  )
}

// The project's links come from the slot, which carries their anchor props; every other field from its card.
export function ProjectCard({ slot: { project, links } }: { slot: ProjectSlot }) {
  const labels = useLabels()
  const card = projectCard(project, labels)
  return (
    <InnerCard zone="ft">
      <h3 style={CARD_TITLE}><SlashBreaks text={card.name} /></h3>
      <p style={CARD_SUBTITLE}>
        {card.role}
        {card.years && <span aria-hidden="true"> | </span>}
        {card.years}
      </p>
      <p style={CARD_BODY}>{card.tagline}</p>
      {card.description && <p className="mb-1 text-sm text-[color:var(--realm-text-mid)]">{card.description}</p>}
      {card.impact && <p style={{ color: REALM.frostIceMid, fontSize: '1rem', fontWeight: 500 }}>{card.impact}</p>}
      <MarkedList items={card.details} />
      <ChipRow chips={card.techStack} />
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
    <InnerCard zone="ft">
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
  const { cards } = useLabels()
  const card = ventureCard(venture)
  const address = shownUrl(card.url)
  return (
    <InnerCard zone="ft" highlight={card.featured}>
      {card.featured && (
        <p className="mb-2 inline-block border border-[color:var(--realm-gold-dark)] px-2 py-0.5 text-sm font-semibold uppercase tracking-[0.08em] text-[color:var(--realm-gold-bright)]">
          {cards.ownProduct}
        </p>
      )}
      <h3 style={CARD_TITLE}><SlashBreaks text={card.name} /></h3>
      <p style={{ ...CARD_SUBTITLE, fontSize: '1rem' }}>{card.tagline}</p>
      <p style={CARD_BODY}>{card.description}</p>
      <ChipRow chips={card.services} />
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
