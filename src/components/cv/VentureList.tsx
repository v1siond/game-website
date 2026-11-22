import { useMemo, type ReactNode } from 'react'
import type { CVData } from '@/lib/cv/content'
import { fillLabel, type Labels } from '@/lib/cv/labels'
import { useLabels } from './CVDataProvider'
import { newTabName } from '@/lib/cv/sectionText'

// The ventures as a list without a look, in the order viewFor gives (his own products first). A venture
// with a site carries `linkProps` for the world's anchor, named for a link that wraps the whole card
// ("My product, Lumi: tagline (opens in a new tab)"); one without carries null. A link whose visible
// text is a word ("Website") takes its name from `nameFor(word)` instead, so the name holds that word.

export type Venture = CVData['companies'][number]

export interface VentureSlot {
  venture: Venture
  linkProps: { href: string; target: '_blank'; rel: string; 'aria-label': string } | null
  /** "Website of {venture} (opens in a new tab)" for a link that reads "Website". */
  nameFor: (visibleText: string) => string
}

interface VentureListProps {
  companies: CVData['companies']
  /** `index` is the venture's place in `companies`. */
  renderVenture: (slot: VentureSlot, index: number) => ReactNode
  className?: string
  itemClassName?: string
  /** Added to the item of a featured venture (his own product), e.g. to span the columns. */
  featuredItemClassName?: string
}

const cardName = (venture: Venture, labels: Labels): string =>
  `${venture.featured ? `${labels.cards.ownProduct}, ` : ''}${venture.name}: ${venture.tagline}`

const slotFor = (venture: Venture, labels: Labels): VentureSlot => ({
  venture,
  linkProps: venture.url
    ? { href: venture.url, target: '_blank', rel: 'noopener noreferrer', 'aria-label': newTabName(labels.links, cardName(venture, labels)) }
    : null,
  nameFor: (visibleText) => newTabName(labels.links, fillLabel(labels.links.linkOf, { link: visibleText, project: venture.name })),
})

const itemClassFor = (venture: Venture, itemClassName = '', featuredItemClassName = ''): string =>
  venture.featured ? `${itemClassName} ${featuredItemClassName}` : itemClassName

export function VentureList({ companies, renderVenture, className, itemClassName, featuredItemClassName }: VentureListProps) {
  const labels = useLabels()
  // One slot object per venture for as long as the ventures and labels stay, so a memo card fed a slot
  // skips the parent's unrelated renders.
  const slots = useMemo(() => companies.map((venture) => slotFor(venture, labels)), [companies, labels])
  return (
    <ul className={className}>
      {slots.map((slot, index) => (
        <li key={slot.venture.id} className={itemClassFor(slot.venture, itemClassName, featuredItemClassName)}>
          {renderVenture(slot, index)}
        </li>
      ))}
    </ul>
  )
}
