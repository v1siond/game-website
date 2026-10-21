import type { CSSProperties } from 'react'
import type { Job } from '@/lib/cv/content'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { BandSlot } from '@/components/cv/BandList'
import { jobYears, RELEASED } from '@/components/cv/sectionText'
import { REALM } from './palette'
import { InnerCard } from './panels'
import { RealmButton } from './actions'

// One card per job, project and band, read from the shared section slots.

export const CARD_TITLE: CSSProperties = { color: REALM.textBright, fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.125rem' }
export const CARD_SUBTITLE: CSSProperties = { color: REALM.goldMid, fontSize: '0.875rem', marginBottom: '0.25rem' }
export const CARD_BODY: CSSProperties = { color: REALM.textMid, fontSize: '1rem', marginBottom: '0.25rem' }
export const CARD_CHIP: CSSProperties = {
  background: REALM.chaosFelDark + '40',
  color: REALM.chaosFelBright,
  fontSize: '0.875rem',
  padding: '0.125rem 0.25rem',
  textTransform: 'uppercase',
}

function jobYearsLabel(job: Job): string {
  const { start, end } = jobYears(job, 'Present')
  return `${start} - ${end}`
}

export function JobCard({ job }: { job: Job }) {
  return (
    <InnerCard highlight={job.endDate === null} zone="roc">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.375rem' }}>
        <div>
          <h3 style={{ ...CARD_TITLE, fontSize: '0.875rem' }}>{job.title}</h3>
          <p style={{ color: REALM.goldMid, fontSize: '0.875rem' }}>{job.company}</p>
        </div>
        <span style={{ color: REALM.textDim, fontSize: '0.875rem', whiteSpace: 'nowrap' }}>{jobYearsLabel(job)}</span>
      </div>
      {job.description && <p style={{ color: REALM.textMid, fontSize: '0.875rem' }}>{job.description}</p>}
      {job.highlights.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, margin: '0.375rem 0 0 0' }}>
          {job.highlights.map((highlight) => (
            <li key={highlight} style={{ color: REALM.textMid, fontSize: '0.875rem', paddingLeft: '0.75rem', position: 'relative', marginBottom: '0.125rem' }}>
              <span style={{ position: 'absolute', left: 0, color: REALM.goldDark }} aria-hidden="true">›</span>{highlight}
            </li>
          ))}
        </ul>
      )}
      {job.skills.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.5rem' }}>
          {job.skills.map((skill) => (
            <span key={skill} style={CARD_CHIP}>{skill}</span>
          ))}
        </div>
      )}
    </InnerCard>
  )
}

export function ProjectCard({ slot: { project, years, links } }: { slot: ProjectSlot }) {
  return (
    <InnerCard zone="ft">
      <h3 style={CARD_TITLE}>{project.name}</h3>
      <p style={CARD_SUBTITLE}>
        {project.role}
        {years && <span aria-hidden="true"> | </span>}
        {years}
      </p>
      <p style={CARD_BODY}>{project.tagline}</p>
      {project.impact && <p style={{ color: REALM.frostIceMid, fontSize: '1rem', fontWeight: 500 }}>{project.impact}</p>}
      {links.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
          {links.map(({ kind, label, linkProps }) => (
            <RealmButton key={kind} linkProps={linkProps} zone="ft">{label}</RealmButton>
          ))}
        </div>
      )}
    </InnerCard>
  )
}

export function BandCard({ band, years, linkProps }: BandSlot) {
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
      {band.release && (
        <p style={CARD_BODY}>
          {RELEASED} <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </InnerCard>
  )
}
