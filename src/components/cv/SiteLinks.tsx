'use client'

import Link from 'next/link'
import { useMemo, type ReactNode } from 'react'
import { siteLinks, type EngineWord, type SiteLinkId, type SiteLinkSlot } from '@/lib/cv/siteLinks'
import { useLabels } from './CVDataProvider'
import type { HeroActionSlot } from './RecruiterHero'

// The contact links of a world without a look: the hero's email and LinkedIn actions and the CV and engine
// links. A world passes its own class per link id and, when it draws more than the label, a render
// function for the inside; the address, the new tab and the accessible name stay the slot's.

export type ContactLinkId = HeroActionSlot['id'] | SiteLinkId

/** The CV and engine slots in the visitor's language, with the engine button showing `word`. */
export function useSiteLinks(word: EngineWord = 'engine'): Record<SiteLinkId, SiteLinkSlot> {
  const labels = useLabels()
  return useMemo(() => siteLinks(labels, word), [labels, word])
}

// Email and LinkedIn leave the site, so they are plain anchors; the CV and the engine go through next/link
// as every world drew them before.
const ELEMENT_FOR: Record<ContactLinkId, typeof Link | 'a'> = {
  email: 'a',
  linkedin: 'a',
  cv: Link,
  engine: Link,
}

const showLabel = (label: string): ReactNode => label

interface ContactLinkProps {
  slot: HeroActionSlot | SiteLinkSlot
  className: string
  children?: (label: string) => ReactNode
}

export function ContactLink({ slot, className, children = showLabel }: ContactLinkProps) {
  const Element = ELEMENT_FOR[slot.id]
  return (
    <Element {...slot.linkProps} className={className}>
      {children(slot.label)}
    </Element>
  )
}
