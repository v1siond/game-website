'use client'

import type { ReactNode } from 'react'
import { fillLabel } from '@/lib/cv/labels'
import { useLabels, useWorldView } from './CVDataProvider'
import { newTabName } from './sectionText'

// The recruiter first screen (R7) without a look: his name, the headline, the tagline, the contact
// line and the two actions, email and LinkedIn. Each world draws it through `render`, spreading
// `linkProps` on its own anchor, so the targets, the new tab and the accessible names stay the same in
// every world.

export interface HeroActionLinkProps {
  href: string
  target?: '_blank'
  rel?: string
  'aria-label': string
}

export interface HeroActionSlot {
  id: 'email' | 'linkedin'
  label: string
  value: string
  linkProps: HeroActionLinkProps
}

export interface RecruiterHeroSlots {
  name: string
  headline: string
  tagline: string
  line: string
  actions: [HeroActionSlot, HeroActionSlot]
}

export function RecruiterHero({ render }: { render: (hero: RecruiterHeroSlots) => ReactNode }) {
  const { hero } = useWorldView()
  const { actions, links } = useLabels()
  const { email, linkedin } = hero.actions

  return render({
    name: hero.name,
    headline: hero.headline,
    tagline: hero.tagline,
    line: hero.line,
    actions: [
      {
        id: 'email',
        label: actions.emailMe,
        value: email.value,
        linkProps: { href: email.href, 'aria-label': fillLabel(actions.emailMeAt, { email: email.value }) },
      },
      {
        id: 'linkedin',
        label: actions.linkedin,
        value: linkedin.value,
        linkProps: {
          href: linkedin.href,
          target: '_blank',
          rel: 'noopener noreferrer',
          'aria-label': newTabName(links, actions.linkedin),
        },
      },
    ],
  })
}
