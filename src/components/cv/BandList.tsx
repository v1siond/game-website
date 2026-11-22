import { useMemo, type ReactNode } from 'react'
import type { Band } from '@/lib/cv/content'
import type { Labels } from '@/lib/cv/labels'
import { useLabels } from './CVDataProvider'
import { bandSpan, newTabName } from '@/lib/cv/sectionText'

// The bands (R5) as a list without a look, in the order viewFor gives (current first). A band with a
// site carries `linkProps` for the world's anchor; one without carries null and is drawn as text.

export interface BandSlot {
  band: Band
  years: string
  linkProps: { href: string; target: '_blank'; rel: string; 'aria-label': string } | null
}

interface BandListProps {
  bands: Band[]
  renderBand: (slot: BandSlot) => ReactNode
  className?: string
  itemClassName?: string
}

const slotFor = (band: Band, labels: Labels): BandSlot => ({
  band,
  years: bandSpan(band, labels.years),
  linkProps: band.url
    ? { href: band.url, target: '_blank', rel: 'noopener noreferrer', 'aria-label': newTabName(labels.links, band.name) }
    : null,
})

export function BandList({ bands, renderBand, className, itemClassName }: BandListProps) {
  const labels = useLabels()
  // One slot object per band for as long as the bands and labels stay, so a memo card fed a slot skips
  // the parent's unrelated renders.
  const slots = useMemo(() => bands.map((band) => slotFor(band, labels)), [bands, labels])
  return (
    <ul className={className}>
      {slots.map((slot) => (
        <li key={slot.band.id} className={itemClassName}>
          {renderBand(slot)}
        </li>
      ))}
    </ul>
  )
}
